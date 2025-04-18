import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { languages, userID } = req.body;
    console.log(languages);

    if (!userID) {
      res.status(400).json({ error: "UserID is required" });
    }

    try {
      const l = await prisma.users.update({
        where: { id: userID as string },
        data: {
          assignedLanguages: languages,
        },
      });

      res.status(201).json(l);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create language" });
    }
  } else if (req.method === "GET") {
    const { email } = req.query;
    if (!email) {
      res.status(400).json({ error: "email is required" });
    }

    try {
      const l = await prisma.users.findUnique({
        where: { email: email as string },
        select: {
          assignedLanguages: true,
        },
      });
      res.status(200).json(l?.assignedLanguages);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create language" });
    }
  }
}
