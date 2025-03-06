import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;
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
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
