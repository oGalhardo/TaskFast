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
    const { name, categoryId, initialDate, finalDate, priority = 0, tasks = [] } = req.body;

    try {
      const list = await prisma.list.create({
        data: {
          name,
          categoryId,
          userId,
          initialDate: initialDate || null,
          finalDate: finalDate || null,
          priority,
          tasks: {
            create: tasks.map((t, index) => ({
              name: t.name,
              description: t.description || "",
              priority: typeof t.priority === "number" ? t.priority : index,
            })),
          },
        },
        include: {
          tasks: true,
        },
      });

      return res.status(201).json(list);
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      return res.status(500).json({ message: "Erro ao criar lista", error });
    }
  }

  if (req.method === "PUT") {
    const { id, tasks = [], ...data } = req.body;

    const listaAtualizada = await prisma.list.update({
      where: { id, userId },
      data: {
        ...data,
        tasks: {
          deleteMany: {},
          create: tasks.map((t, index) => ({
            name: t.name,
            description: t.description || "",
            priority: typeof t.priority === "number" ? t.priority : index,
          })),
        },
      },
      include: { tasks: true },
    });

    return res.status(200).json(listaAtualizada);
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      await prisma.task.deleteMany({
        where: { listId: id },
      });

      const deleted = await prisma.list.delete({
        where: { id, userId },
      });

      return res.status(200).json({ deleted });
    } catch (error) {
      console.error("Erro no DELETE da lista:", error);
      return res.status(500).json({ error: "Erro interno ao deletar lista" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
