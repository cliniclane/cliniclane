import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    try {
      const pagesContent = await prisma.pagesContent.findUnique({
        where: { slug: slug as string },
      });

      if (!pagesContent) {
        return res.status(404).json({ error: "Page not found" });
      }

      res.status(200).json(pagesContent);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: "Failed to fetch page content" });
    }
  } else if (req.method === "PUT") {
    const { mainSlug, title, mdxContent, slug, id } = req.body;

    if (!mainSlug) {
      return res.status(400).json({ error: "Slug is required for update" });
    }

    try {
      // Update the page content
      const updatedPage = await prisma.pagesContent.update({
        where: { id: id },
        data: {
          title,
          mdxContent,
          slug,
          updatedAt: new Date(),
        },
      });

      if (!updatedPage) {
        return res.status(500).json({ error: "Failed to update page" });
      }

      res.status(200).json(updatedPage);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: "Failed to update page" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
