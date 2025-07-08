import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { login: credentials.login },
        });

        if (!user || !user.password) {
          throw new Error("Usuário não encontrado");
        }

        const valid = await compare(credentials.password, user.password);
        if (!valid) {
          throw new Error("Senha incorreta");
        }

        return { id: user.id, name: user.login };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findFirst({
          where: { login: profile.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              login: profile.email,
              name: profile.name,
              password: "",
            },
          });
        }
      }

      return true;
    },

    async session({ session, token }) {
      const user = await prisma.user.findFirst({
        where: { login: session.user.email },
      });

      if (user) {
        session.user.id = user.id;
        session.user.login = user.login;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);