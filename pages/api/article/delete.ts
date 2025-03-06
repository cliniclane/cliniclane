import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const config = {
  runtime: "nodejs",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const article = await prisma.articles.delete({
      where: { id: id as string },
    });

    return res.status(200).json(article);
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Failed to delete article" });
  }
}
