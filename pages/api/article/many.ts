import { Articles, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { articles, email } = req.body;
    const articlesIDsArray =  articles.map((a: Articles) => a.id);
    if (articles) {
      try {
        // get user information
        const user = await prisma.users.findUnique({
          where: { email: email as string },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

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

        await prisma.articles.createMany({
          data: articles,
        });

        const insertedSlugs = articles.map((a: Articles) => a.slug); // Or unique identifier

        const createdArticles = await prisma.articles.findMany({
          where: {
            slug: { in: insertedSlugs },
          },
        });

        if (!createdArticles) {
          return res.status(404).json({ error: "Cannot create articles" });
        }

        res.status(200).send({
          message: "Articles created successfully",
          data: createdArticles,
        });
      } catch (error: unknown) {
        console.log(error);
        res.status(500).json({ error: "Failed to create articles" });
      }
    } else {
      res.status(400).json({ error: "No articles provided" });
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
