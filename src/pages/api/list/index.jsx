import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Não autorizado" });

  const userId = session.user.id;

  if (req.method === "GET") {
    const lists = await prisma.list.findMany({
      where: { userId },
      include: { tasks: true }, // opcional: se quiser listar já com tasks
    });
    return res.status(200).json(lists);
  }
  if (req.method === "POST") {
    const { name, categoryId, initialDate, finalDate, priority = 0 } = req.body;

    const list = await prisma.list.create({
      data: {
        name,
        categoryId,
        userId,
        initialDate: initialDate || null,
        finalDate: finalDate || null,
        priority,
      },
    });
    return res.status(201).json(list);
  }

  if (req.method === "PUT") {
    const { id, ...data } = req.body;

    const list = await prisma.list.updateMany({
      where: { id, userId },
      data,
    });

    return res.status(200).json(list);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    const deleted = await prisma.list.deleteMany({
      where: { id, userId },
    });

    return res.status(200).json({ deleted });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
