"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import TarefasEditor from "./ListaTarefasEditavel";
import { Plus, XCircle, CheckCircle } from "lucide-react";

export default function ModalNovaLista({ aberto, fecharModal, listaParaEditar = null }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    if (aberto) {
      fetchCategorias();
    }
  }, [aberto]);

  useEffect(() => {
    if (aberto && listaParaEditar) {
      setNome(listaParaEditar.name || "");
      setCategoria(listaParaEditar.categoryId || "");
      setDataInicial(listaParaEditar.initialDate?.substring(0, 10) || "");
      setDataFinal(listaParaEditar.finalDate?.substring(0, 10) || "");
      setTarefas(listaParaEditar.tasks || []);
    } else if (aberto && !listaParaEditar) {
      setNome("");
      setCategoria("");
      setNovaCategoria("");
      setMostrarInputCategoria(false);
      setDataInicial("");
      setDataFinal("");
      setTarefas([]);
    }
  }, [listaParaEditar, aberto]);


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
        method: listaParaEditar ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: listaParaEditar?.id,
          name: nome.trim(),
          categoryId: categoria,
          initialDate: initialDateISO,
          finalDate: finalDateISO,
          tasks: tarefas
        })
      });
      const nova = await res.json();
      fecharModal(true);
    } catch (err) {
      console.error("Erro ao salvar lista:", err);
    }
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-4xl flex flex-col gap-4 h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6 flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">
              {listaParaEditar ? "Editar Lista" : "Criar Nova Lista"}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4 flex-1 flex flex-col">
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
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    <Plus size={16} />
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
            </form>
          </div>

          <TarefasEditor tarefasIniciais={tarefas} onChange={setTarefas} />
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={() => fecharModal(false)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
          >
            <XCircle size={18} /> Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle size={18} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
