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
      });

      res.status(200).json(articles);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  } else if (req.method === "PUT") {
    const { id, ...updateData } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID is required" });
    }
    try {
      const article = await prisma.articles.update({
        where: { id },
        data: updateData,
      });

      res.status(201).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create article" });
    }
  } else if (req.method === "POST") {
    const { ...updateData } = req.body;

    try {
      const article = await prisma.articles.create({
        data: updateData,
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
