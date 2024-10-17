import { prisma } from "@/src/lib/prisma";
import { setCookie } from "nookies";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, username } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
    // data quais dados quero usar para criar o usuario
    // select = quais dados eu quero retornar do usuario apos a sua criação
  });

  setCookie({ res }, "@ignitecall:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return res.status(201).json(user);
}
