"use client";

import { useState, useEffect } from "react";
import { XCircle, CheckCircle } from "lucide-react";

export default function ModalNovaTarefa({ listId, aberto, fecharModal, salvarTarefa }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (aberto) {
      setNome("");
      setDescricao("");
    }
  }, [aberto]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Preencha o nome da tarefa");
      return;
    }

    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          name: nome.trim(),
          description: descricao.trim(),
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar tarefa");

      const novaTarefa = await res.json();
      salvarTarefa(novaTarefa);
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao salvar tarefa");
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={fecharModal}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Criar Nova Tarefa</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da tarefa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full border rounded px-3 py-2 resize-none"
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={fecharModal}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle size={18} /> Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle size={18} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
