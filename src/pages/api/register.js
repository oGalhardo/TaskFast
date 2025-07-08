// pages/api/register.js
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "Login e senha obrigatórios" });
  }

  try {
    const userExistente = await prisma.user.findUnique({ where: { login } });

    if (userExistente) {
      return res.status(409).json({ error: "Usuário já existe" });
    }

    const senhaCriptografada = await hash(password, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        login,
        password: senhaCriptografada,
      },
    });

    return res.status(201).json(novoUsuario);
  } catch (err) {
    console.error("❌ Erro no registro:", err);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
}
