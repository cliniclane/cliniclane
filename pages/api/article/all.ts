import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    // get user information
    const user = await prisma.users.findUnique({
      where: { email: email as string },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let articles;

    if (user.role === "super_admin") {
      articles = await prisma.articles.findMany({
        orderBy: { publishDate: "desc" },
      });
    } else {
      articles = await prisma.articles.findMany({
        where: { id: { in: user.assignedBlogs } }, // Use `in` for an array of IDs
        orderBy: { publishDate: "desc" },
      });
    }
    res.status(200).json(articles);
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
}
