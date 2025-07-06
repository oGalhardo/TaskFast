"use client";

import { useState, useEffect } from "react";

export default function ModalNovaTarefa({ aberto, fecharModal, salvarTarefa }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (aberto) {
      setNome("");
      setDescricao("");
    }
  }, [aberto]);

  function onSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Preencha o nome da tarefa");
      return;
    }
    salvarTarefa({ name: nome.trim(), description: descricao.trim() });
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={fecharModal}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
