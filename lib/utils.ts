import { Articles } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterArticlesByLanguage(
  articles: Articles[],
  language: string
): Articles[] {
  const lowerLang = language.toLowerCase();

  // Case: English — return all original articles
  if (lowerLang === "english") {
    return articles;
  }

  // Case: other language — return only translated articles
  return articles
    .map((article) => {
      const translated = article.translations.find(
        (t) => t.language.toLowerCase() === lowerLang
      );

      if (!translated) return null; // Exclude if no translation found

      return {
        ...article,
        title: translated.title,
        tags: translated.tags,
        mdxString: translated.mdxString,
        language: translated.language,
        canonical: translated.canonical ?? article.canonical,
        description: translated.description,
        openGraphTitle: translated.openGraphTitle ?? article.openGraphTitle,
        openGraphDescription:
          translated.openGraphDescription ?? article.openGraphDescription,
      };
    })
    .filter((article): article is NonNullable<typeof article> => article !== null);
}
