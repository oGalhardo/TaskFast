"use client";

import { useState, useEffect } from "react";
import ListaCard from "@/components/ListaCard";
import ModalNovaLista from "@/components/ModalNovaLista";

export default function HomePage() {
  const [modalAbertoNovaLista, setModalAbertoNovaLista] = useState(false);
  const [listaEditando, setListaEditando] = useState(null);
  const [listas, setListas] = useState([]);

  async function fetchListas() {
    const res = await fetch("/api/list");
    const listasBase = await res.json();

    const listasCompletas = await Promise.all(
      listasBase.map(async (lista) => {
        try {
          const [tarefasRes, categoriaRes] = await Promise.all([
            fetch(`/api/task?listId=${lista.id}`),
            fetch(`/api/list-category?id=${lista.categoryId}`),
          ]);

          const [tarefasData, categoriaData] = await Promise.all([
            tarefasRes.json(),
            categoriaRes.json(),
          ]);

          return {
            ...lista,
            tasks: tarefasData || [],
            categoria: categoriaData.name || "Sem categoria",
          };
        } catch (err) {
          console.error("Erro ao buscar dados da lista:", err);
          return {
            ...lista,
            tasks: [],
            categoria: "Erro ao carregar",
          };
        }
      })
    );

    setListas(listasCompletas);
  }

  function abrirModalNovaLista() {
    setModalAbertoNovaLista(true);
  }

  function fecharModalNovaLista(salvo = false) {
    if (salvo) {
      fetchListas();
    }
    setListaEditando(null);
    setModalAbertoNovaLista(false);
  }

  useEffect(() => {
    fetchListas();
  }, []);

  function adicionarTarefa(listaId, tarefa) {
    setListas((oldListas) =>
      oldListas.map((lista) =>
        lista.id === listaId
          ? {
            ...lista,
            tasks: [
              ...lista.tasks,
              { ...tarefa },
            ],
          }
          : lista
      )
    );
  }

  function alterarLista(list) {
    setListaEditando(list)
    setModalAbertoNovaLista(true);
  }

  async function excluirLista(listId) {
    try {
      const res = await fetch(`/api/list?id=${listId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro na resposta do servidor:", text);
        return;
      }

      const data = await res.json();
      console.log("Lista excluída com sucesso:", data);

      fetchListas();
    } catch (err) {
      console.error("Erro ao excluir lista:", err);
    }
  };

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
            editarLista={alterarLista}
            excluirLista={excluirLista}
          />
        ))}
      </section>

      <ModalNovaLista
        aberto={modalAbertoNovaLista}
        fecharModal={fecharModalNovaLista}
        listaParaEditar={listaEditando}
      />
    </main>
  );
}
