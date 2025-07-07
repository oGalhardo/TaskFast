"use client";

import { useState, useEffect } from "react";
import ListaCard from "@/components/ListaCard";
import ModalNovaLista from "@/components/ModalNovaLista";

export default function HomePage() {
  const [listas, setListas] = useState([]);

  useEffect(() => {
    async function fetchListas() {
      const res = await fetch("/api/list");
      const data = await res.json();

      for (const lista of data) {
        try {
          const res = await fetch(`/api/task?listId=${lista.id}`);
          const data = await res.json();
          lista.tarefas = data || [];
        } catch (err) {
          console.error("Erro ao buscar tarefas:", err);
        }

        // try {
        //   const res = await fetch(`/api/list-category?listId=${lista.id}`);
        //   const data = await res.json();
        //   lista.tarefas = data || [];
        // } catch (err) {
        //   console.error("Erro ao buscar tarefas:", err);
        // }
      }

      setListas(data);
    }

    fetchListas();
  }, []);

  const [modalAbertoNovaLista, setModalAbertoNovaLista] = useState(false);

  function abrirModalNovaLista() {
    setModalAbertoNovaLista(true);
  }

  function fecharModalNovaLista() {
    setModalAbertoNovaLista(false);
  }

  function adicionarTarefa(listaId, tarefa) {
    setListas((oldListas) =>
      oldListas.map((lista) =>
        lista.id === listaId
          ? {
            ...lista,
            tarefas: [
              ...lista.tarefas,
              { ...tarefa, id: Date.now().toString() },
            ],
          }
          : lista
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 relative">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Listas</h1>
        <button
          onClick={abrirModalNovaLista}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg"
        >
          + Nova Lista
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listas.map((lista) => (
          <ListaCard
            key={lista.id}
            lista={lista}
            adicionarTarefa={adicionarTarefa}
          />
        ))}
      </section>

      <ModalNovaLista
        aberto={modalAbertoNovaLista}
        fecharModal={fecharModalNovaLista}
      />
    </main>
  );
}
