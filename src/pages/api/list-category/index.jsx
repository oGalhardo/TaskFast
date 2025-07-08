import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const userId = session.user.id;

  if (req.method === "GET") {
    const { id } = req.query;

    try {
      if (id) {
        const category = await prisma.listCategory.findUnique({
          where: {
            id,
            userId
          }
        });
        return res.status(200).json(category);
      }
      else {
        const categories = await prisma.listCategory.findMany({
          where: {
            userId
          },
          orderBy: { priority: "asc" },
        });
        return res.status(200).json(categories);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  }

  if (req.method === "POST") {
    const { name, priority = 0 } = req.body;

    try {
      const category = await prisma.listCategory.create({
        data: {
          name,
          priority,
          userId,
        },
      });
      return res.status(201).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao criar categoria" });
    }
  }

  if (req.method === "PUT") {
    const { id, name, priority } = req.body;

    try {
      const category = await prisma.listCategory.updateMany({
        where: { id, userId },
        data: { name, priority },
      });

      if (category.count === 0) {
        return res.status(404).json({ message: "Categoria não encontrada ou sem permissão" });
      }

      return res.status(200).json({ message: "Atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar categoria" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const deleted = await prisma.listCategory.deleteMany({
        where: { id, userId },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ message: "Categoria não encontrada ou sem permissão" });
      }

      return res.status(200).json({ message: "Categoria deletada com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao deletar categoria" });
    }
  }

  return res.status(405).json({ message: "Método não permitido" });
}
