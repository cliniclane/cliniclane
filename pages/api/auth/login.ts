import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ error: "Missing required parameter" });
    }

    try {
      const user = await prisma.users.findUnique({
        where: { email: email as string },
      });
      // check if user exists
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      // check if password is correct
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid password" });
      }
      res.status(200).json(user);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
