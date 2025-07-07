"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import ModalNovaTarefa from "./ModalNovaTarefa";
import { Trash2 } from "lucide-react";

export default function ListaCard({ lista, adicionarTarefa, excluirLista }) {
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
  if (lista.tarefas?.length) tarefasExibidas = lista.tarefas.slice(0, 3);

  let tarefasRestantes = 0;
  if (lista.tarefas?.length) tarefasRestantes = lista.tarefas.length - 3;

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col relative">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{lista.name}</h2>
        <button
          onClick={() => excluirLista(lista.id)}
          className="text-red-600 hover:text-red-800"
          title="Excluir lista"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-1">Categoria: {lista.categoria}</p>
      <p className="text-sm text-gray-500 mb-2"
        hidden={!dataInicial && !dataFinal}
      >
        De: {dataInicial} até {dataFinal}
      </p>

      <ul className="space-y-1 text-gray-700 text-sm flex-1 overflow-auto max-h-48">
        {(lista.tarefas?.length || 0) === 0 && <li>Nenhuma tarefa</li>}
        {tarefasExibidas.map((tarefa) => (
          <li key={tarefa.id}>• {tarefa.name}</li>
        ))}
        {tarefasRestantes > 0 && (
          <li className="italic text-gray-400">+{tarefasRestantes} tarefas...</li>
        )}
      </ul>

      <button
        onClick={() => setModalAbertoTarefa(true)}
        className="mt-3 self-end bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
      >
        + Nova Tarefa
      </button>

      <ModalNovaTarefa
        aberto={modalAbertoTarefa}
        fecharModal={() => setModalAbertoTarefa(false)}
        salvarTarefa={(tarefa) => {
          adicionarTarefa(lista.id, tarefa);
          setModalAbertoTarefa(false);
        }}
      />
    </div>
  );
}
