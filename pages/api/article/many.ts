import { Articles, PrismaClient, Translations, Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { language } = req.query;

    if (!language || typeof language !== "string") {
      return res
        .status(400)
        .json({ message: "Language query param is required" });
    }

    try {
      const articles = await prisma.articles.findMany({
        where: {
          OR: [
            { language: language.toLowerCase() }, // primary language match
            { translations: { some: { language: language.toLowerCase() } } }, // translated match
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          tags: true,
          description: true,
          author: true,
          language: true,
          languages: true,
          headerImage: true,
          images: true,
          publishDate: true,
          mdxString: true,
          canonical: true,
          openGraphImage: true,
          openGraphTitle: true,
          openGraphDescription: true,
          translations: true,
        },
      });

      const filteredArticles = articles.map((article) => ({
        ...article,
        translations: article.translations.filter(
          (translation) =>
            translation.language.toLowerCase() === language.toLowerCase()
        ),
      }));

      res.status(200).json(filteredArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    const { articles, email } = req.body;

    if (!articles) {
      return res.status(400).json({ error: "No articles provided" });
    }

    try {
      const articlesIDsArray = articles.map((a: Articles) => a.id);

      // Get user
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Assign blog IDs to user (if not super_admin)
      if (user.role !== "super_admin") {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            assignedBlogs: {
              push: articlesIDsArray,
            },
          },
        });
      }

      // Separate articles by language
      const englishArticles: Articles[] = [];
      const translations: {
        baseSlug: string;
        translation: Translations;
      }[] = [];

      for (const article of articles) {
        const lang = article.language?.toLowerCase();
        const baseTranslation: Translations = {
          title: article.title,
          mdxString: article.mdxString,
          tags: article.tags,
          canonical: article.canonical,
          description: article.description,
          language: article.language!,
          openGraphTitle: article.openGraphTitle,
          openGraphDescription: article.openGraphDescription,
        };

        if (!lang || lang === "english") {
          englishArticles.push(article);
        } else {
          translations.push({
            baseSlug: article.slug,
            translation: baseTranslation,
          });
        }
      }

      // Step 1: Insert only new English articles
      const existingSlugs = await prisma.articles.findMany({
        where: {
          slug: {
            in: englishArticles.map((a) => a.slug),
          },
        },
        select: { slug: true },
      });


      if (existingSlugs.length > 0) {
        console.log("Existing slugs:", existingSlugs);
        const existingSlugsArray = existingSlugs.map((a) => a.slug);
        res.status(400).json({ error: "duplicate-slug", data: existingSlugsArray });
        return;
      }

      const existingSlugSet = new Set(existingSlugs.map((a) => a.slug));
      const newEnglishArticles = englishArticles.filter(
        (a) => !existingSlugSet.has(a.slug)
      );


      if (newEnglishArticles.length > 0) {
        const c = await prisma.articles.createMany({
          data: newEnglishArticles,
        });
        console.log("New English articles inserted:", c);
      }

      // Step 2: Fetch existing base articles for translations
      const baseSlugs = translations.map((t) => t.baseSlug);
      const baseArticles = await prisma.articles.findMany({
        where: { slug: { in: baseSlugs } },
      });

      const slugToId: Record<string, string> = Object.fromEntries(
        baseArticles.map((a) => [a.slug, a.id])
      );

      // Step 3: Create blank English articles where base doesn't exist
      const missingSlugs = baseSlugs.filter((slug) => !slugToId[slug]);

      if (missingSlugs.length > 0) {
        const missingArticles = missingSlugs
          .map((slug) => {
            const original = articles.find((a: Articles) => a.slug === slug);
            if (!original) return null;

            return {
              id: uuid(),
              slug: original.slug,
              title: original.title,
              description: original.description,
              author: original.author,
              language: "english",
              languages: [...new Set([original.language, "english"])],
              tags: original.tags || [],
              headerImage: original.headerImage || "",
              images: original.images || ["", "", ""],
              publishDate: original.publishDate || new Date().toISOString(),
              mdxString:
                original.language === "english" ? original.mdxString : "", // ✅ Fix applied
              canonical: original.canonical || "",
              openGraphImage: original.openGraphImage || null,
              openGraphTitle: original.openGraphTitle || null,
              openGraphDescription: original.openGraphDescription || null,
              translations: [],
            };
          })
          .filter(
            // @ts-expect-error:""
            (article): article is Articles => article !== null
          );

        if (missingArticles.length > 0) {
          await prisma.articles.createMany({
            data: missingArticles as Prisma.ArticlesCreateManyInput[],
          });

          const newBases = await prisma.articles.findMany({
            where: { slug: { in: missingSlugs } },
          });

          newBases.forEach((a) => (slugToId[a.slug] = a.id));
        }
      }

      // Step 4: Push each translation to its base article
      for (const t of translations) {
        const articleId = slugToId[t.baseSlug];
        if (articleId) {
          await prisma.articles.update({
            where: { id: articleId },
            data: {
              translations: {
                push: t.translation,
              },
            },
          });
        }
      }

      // Final fetch of all updated articles
      const insertedSlugs = [
        ...new Set([...newEnglishArticles.map((a) => a.slug), ...baseSlugs]),
      ];

      const createdArticles = await prisma.articles.findMany({
        where: {
          slug: { in: insertedSlugs },
        },
      });

      console.log("Created articles:", createdArticles);

      if (!createdArticles.length) {
        return res.status(404).json({ error: "No articles were created" });
      }

      res.status(200).send({
        message: "Articles and translations created successfully",
        data: createdArticles,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Failed to create articles" });
    }
  } else if (req.method === "DELETE") {
    const ids = req.body.ids;

    if (!ids) {
      return res.status(400).json({ error: "IDs are required" });
    }

    try {
      const deletedArticles = await prisma.articles.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      if (!deletedArticles) {
        return res.status(404).json({ error: "Cannot delete articles" });
      }

      res.status(200).json(deletedArticles);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete articles" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
