"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function ModalNovaLista({ aberto, fecharModal }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    if (aberto) {
      setNome("");
      setCategoria("");
      setNovaCategoria("");
      setMostrarInputCategoria(false);
      setDataInicial("");
      setDataFinal("");
      fetchCategorias();
    }
  }, [aberto]);

  async function fetchCategorias() {
    try {
      const res = await fetch("/api/list-category");
      const data = await res.json();
      setCategoriasExistentes(data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  }

  async function criarNovaCategoria() {
    if (!novaCategoria.trim()) return;
    try {
      const res = await fetch("/api/list-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: novaCategoria })
      });
      const nova = await res.json();
      setCategoriasExistentes([...categoriasExistentes, nova]);
      setCategoria(nova.id);
      setNovaCategoria("");
      setMostrarInputCategoria(false);
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !categoria) {
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

    try {
      const initialDateISO = dataInicial ? DateTime.fromISO(dataInicial).toISO() : null;
      const finalDateISO = dataFinal ? DateTime.fromISO(dataFinal).toISO() : null;
      
      const res = await fetch("/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome.trim(),
          categoryId: categoria,
          initialDate: initialDateISO,
          finalDate: finalDateISO,
        })
      });
      const nova = await res.json();
      fecharModal();
      return;
    } catch (err) {
      console.error("Erro ao criar lista:", err);
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-4xl flex gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lado esquerdo: formulário */}
        <div className="flex-1">
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

            <div>
              <div className="flex items-center gap-2">
                <select
                  placeholder="Selecione uma Categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value || "")}
                  className="w-full border rounded px-3 py-2"
                >
                  {categoriasExistentes.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setMostrarInputCategoria(!mostrarInputCategoria)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              {mostrarInputCategoria && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nova categoria"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={criarNovaCategoria}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>

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

        {/* Lado direito: listagem de tarefas */}
        <div className="flex-1 border-l pl-6">
          <h3 className="text-lg font-semibold mb-2">Tarefas da Lista</h3>
          <p className="text-sm text-gray-500">(Exibição futura das tarefas relacionadas)</p>
        </div>
      </div>
    </div>
  );
}
