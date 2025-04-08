import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Missing required parameter" });
    }

    const images = await prisma.images.findMany({
      where: {
        uploadedBy: email as string,
      },
    });

    res.status(200).json(images);
  } else if (req.method === "POST") {
    const { userID, fileURL } = req.body;
    if (!userID || !fileURL) {
      return res.status(400).json({ error: "Missing required parameter" });
    }

    const i = await prisma.images.create({
      data: {
        id: Math.random().toString(36).substring(2, 15),
        uploadedBy: userID,
        url: fileURL,
      },
    });

    res.status(200).json(i);
  } else if (req.method === "DELETE") {
    const { imageID } = req.body;
    await prisma.images.delete({
      where: { id: imageID as string },
    });

    return res.send({ message: "success" });
  }
}
