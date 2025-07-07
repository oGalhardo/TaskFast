import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Não autorizado" });

  const userId = session.user.id;

  if (req.method === "GET") {
    const { listId } = req.query;
    if (!listId) return res.status(500).json({ message: "Parâmetro listId é obrigatório" });
    
    const tasks = await prisma.task.findMany({
      where: {
        listId: listId || undefined,
        list: {
          userId,
        },
      },
    });
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { name, description = "", listId, priority = 0 } = req.body;

    // Garantir que o listId pertence ao user
    const list = await prisma.list.findFirst({
      where: { id: listId, userId },
    });

    if (!list) return res.status(403).json({ message: "Lista não encontrada ou não pertence ao usuário" });

    const task = await prisma.task.create({
      data: {
        name,
        description,
        priority,
        listId,
      },
    });
    return res.status(201).json(task);
  }

  if (req.method === "PUT") {
    const { id, ...data } = req.body;

    // Verifica se a task pertence a uma list do usuário
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        list: true,
      },
    });

    if (!task || task.list.userId !== userId)
      return res.status(403).json({ message: "Tarefa não pertence ao usuário" });

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        list: true,
      },
    });

    if (!task || task.list.userId !== userId)
      return res.status(403).json({ message: "Tarefa não pertence ao usuário" });

    await prisma.task.delete({
      where: { id },
    });

    return res.status(200).json({ deleted: true });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
