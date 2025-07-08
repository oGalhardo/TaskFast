"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ login: userName, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 409) {
        router.push("/login");
      } else if (res.ok) {
        await signIn("credentials", {
          login: userName,
          password,
          callbackUrl: "/home",
        });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
      <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
        TaskFast
      </div>
      <div className="relative mt-12 w-full max-w-lg sm:mt-10">
        <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
        <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Cadastro</h3>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleRegister}>
              <div>
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                    Usuário
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 text-foreground"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                  <label className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="block w-full border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 text-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm bg-white text-black h-10 px-4 py-2"
                >
                  Criar Conta
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="bg-white text-black hover:bg-gray-100 transition rounded-md px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.805 10.023h-9.18v3.956h5.41c-.23 1.218-.928 2.246-1.98 2.941v2.44h3.2c1.873-1.725 2.95-4.267 2.95-7.244 0-.61-.057-1.205-.17-1.793z" fill="#4285F4" />
                    <path d="M12.625 22c2.508 0 4.61-.83 6.14-2.245l-3.2-2.44c-.888.594-2.02.943-2.94.943-2.258 0-4.174-1.524-4.854-3.57h-3.28v2.24C6.64 19.828 9.41 22 12.625 22z" fill="#34A853" />
                    <path d="M7.77 14.688c-.198-.594-.312-1.23-.312-1.888s.114-1.294.312-1.888v-2.24h-3.28A9.373 9.373 0 0 0 3.625 12c0 1.54.374 2.992 1.07 4.24l3.075-2.553z" fill="#FBBC05" />
                    <path d="M12.625 6.772c1.37 0 2.6.472 3.566 1.402l2.663-2.662C17.234 3.722 15.132 3 12.625 3 9.41 3 6.64 5.172 5.28 8.312l3.28 2.24c.68-2.046 2.596-3.78 4.854-3.78z" fill="#EA4335" />
                  </svg>
                  Cadastrar com Google
                </button>
              </div>
              <div className="mt-4 text-right">
                <a href="/login" className="text-sm text-gray-400 hover:underline">
                  Já tem uma conta? Entrar
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
