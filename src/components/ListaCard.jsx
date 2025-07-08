"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import ModalNovaTarefa from "./ModalNovaTarefa";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function ListaCard({ lista, adicionarTarefa, excluirLista, editarLista }) {
  const [modalAbertoTarefa, setModalAbertoTarefa] = useState(false);

  const anoAtual = DateTime.now().year;

  const formatarData = (iso) => {
    const data = DateTime.fromISO(iso);
    return data.year === anoAtual
      ? data.toFormat("dd/MM")
      : data.toFormat("dd/MM/yyyy");
  };

  const dataInicial = lista.initialDate ? formatarData(lista.initialDate) : "";
  const dataFinal = lista.finalDate ? formatarData(lista.finalDate) : "";

  let tarefasExibidas = [];
  if (lista.tasks?.length) tarefasExibidas = lista.tasks.slice(0, 3);

  let tarefasRestantes = 0;
  if (lista.tasks?.length) tarefasRestantes = lista.tasks.length - 3;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{lista.name}</h2>
          <p className="text-sm text-gray-500">{lista.categoria}</p>
          {dataInicial || dataFinal ? (
            <p className="text-xs text-gray-400 mt-1">
              De: {dataInicial} até {dataFinal}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => editarLista(lista)}
            className="text-blue-600 hover:text-blue-800"
            title="Editar lista"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => excluirLista(lista.id)}
            className="text-red-600 hover:text-red-800"
            title="Excluir lista"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-auto">
        {(lista.tasks?.length || 0) === 0 && <li className="italic text-gray-400">Nenhuma tarefa</li>}
        {tarefasExibidas.map((tarefa) => (
          <li key={tarefa.id} className="truncate">• {tarefa.name}</li>
        ))}
        {tarefasRestantes > 0 && (
          <li className="italic text-gray-400">+{tarefasRestantes} tarefas...</li>
        )}
      </ul>

      <button
        onClick={() => setModalAbertoTarefa(true)}
        className="mt-auto bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm self-end"
        title="Adicionar tarefa"
      >
        <Plus size={18} />
      </button>

      <ModalNovaTarefa
        aberto={modalAbertoTarefa}
        fecharModal={() => setModalAbertoTarefa(false)}
        listId={lista.id}
        salvarTarefa={(tarefa) => {
          adicionarTarefa(lista.id, tarefa);
          setModalAbertoTarefa(false);
        }}
      />
    </div>
  );
}
