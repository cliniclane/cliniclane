import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const user = await prisma.users.findUnique({
        where: { id: id as string },
      });
      res.status(200).json(user);
    } else {
      const users = await prisma.users.findMany();
      res.status(200).json(users);
    }
  } else if (req.method === "PUT") {
    const { id, blogs } = req.body;

    if (!id) {
      res.status(400).json({ error: "ID is required" });
    }

    // make Array from string blogs
    const assignedBlogs: string[] = blogs.split(",");

    console.log(assignedBlogs);
    try {
      const article = await prisma.users.update({
        where: { id },
        data: { 
          assignedBlogs
         },
      });

      res.status(201).json(article);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create article" });
    }
  } else if (req.method === "POST") {
    const { email, password } = req.body;

    // check if email and password are provided
    if (!email || !password) {
      res.status(400).json({ error: "Missing required parameter" });
    }
    // check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: email as string },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // create the user in the database
    try {
      const user = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: email as string,
          password: password as string,
        },
      });

      res.status(201).json(user);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
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
  }
}
