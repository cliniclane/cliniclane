import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: "Missing required parameter" });
    }

    try {
      const articles = await prisma.articles.findUnique({
        where: { id: id as string },
        include: {
          translations: true,
          translatedFrom: true,
        },
      });

      res.status(200).json(articles);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  } else if (req.method === "PUT") {
    const { id, slug, ...updateData } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID is required" });
    }

    // make slug from title
    if (!slug) updateData.slug = updateData.title.split(" ").join("-");

    // check if slug already exists
    const existingArticle = await prisma.articles.findFirst({
      where: { slug },
    });
    if (existingArticle) {
      if (existingArticle.id !== id) {
        return res.status(400).json({ error: "Slug already exists" });
      }
    }

    console.log(updateData);
    try {
      const article = await prisma.articles.update({
        where: { id },
        data: { ...updateData, slug },
      });

      res.status(201).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create article" });
    }
  } else if (req.method === "POST") {
    const { slug, ...updateData } = req.body;

    // make slug from title
    if (!slug) updateData.slug = updateData.title.split(" ").join("-");

    // check if slug already exists
    const existingArticle = await prisma.articles.findFirst({
      where: { slug },
    });
    if (existingArticle) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    // create the article in the database
    try {
      const article = await prisma.articles.create({
        data: { ...updateData, slug },
      });

      res.status(201).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create article" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: "ID is required" });
    }
    try {
      const article = await prisma.articles.delete({
        where: { id: id as string },
      });

      res.status(201).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  }
}
