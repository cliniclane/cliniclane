import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pages = await prisma.pagesContent.findMany();

    res.status(200).json(pages);
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
}
