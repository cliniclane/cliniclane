import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const l = await prisma.languages.findMany();
    res.status(200).json(l);
  } else if (req.method === "POST") {
    const { code, name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
    }
    if (!code) {
      res.status(400).json({ error: "Code is required" });
    }

    try {
      const l = await prisma.languages.upsert({
        where: { code: code },
        update: {},
        create: {
          id: Math.random().toString(36).substring(2, 12),
          code,
          name,
        },
      });

      res.status(201).json(l);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create language" });
    }
  }
}
