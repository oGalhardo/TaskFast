"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function ModalNovaLista({ aberto, fecharModal, salvarLista }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    if (aberto) {
      setNome("");
      setCategoria("");
      setDataInicial("");
      setDataFinal("");
    }
  }, [aberto]);

  function onSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !categoria.trim()) {
      alert("Preencha nome e categoria");
      return;
    }

    if (dataInicial && dataFinal) {
      const inicio = DateTime.fromISO(dataInicial);
      const fim = DateTime.fromISO(dataFinal);
      if (fim < inicio) {
        alert("Data final deve ser igual ou posterior à data inicial");
        return;
      }
    }

    salvarLista({
      name: nome.trim(),
      categoria: categoria.trim(),
      initialDate: dataInicial || null,
      finalDate: dataFinal || null,
    });
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
        <h3 className="text-xl font-semibold mb-4">Criar Nova Lista</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da lista"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium">Data Inicial</label>
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="mb-1 font-medium">Data Final</label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
