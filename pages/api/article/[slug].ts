import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug, locale } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "Missing required parameter" });
    }

    try {
      let article;

      if (locale) {
        article = await prisma.articles.findUnique({
          where: { slug: slug as string, language: locale as string },
        });
      } else {
        article = await prisma.articles.findUnique({
          where: { slug: slug as string },
        });
      }

      res.status(200).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  }
}
