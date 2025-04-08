import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const user = await prisma.users.update({
      where: { id: req.body.id },
      data: { password: req.body.password },
    });
    res.status(200).json(user);
  }
}
