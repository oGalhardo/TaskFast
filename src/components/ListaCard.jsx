"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import ModalNovaTarefa from "./ModalNovaTarefa";

export default function ListaCard({ lista, adicionarTarefa }) {
  const [modalAbertoTarefa, setModalAbertoTarefa] = useState(false);

  const dataInicialFormatada = lista.initialDate
    ? DateTime.fromISO(lista.initialDate).toLocaleString(DateTime.DATE_MED)
    : "-";

  const dataFinalFormatada = lista.finalDate
    ? DateTime.fromISO(lista.finalDate).toLocaleString(DateTime.DATE_MED)
    : "-";

  function abrirModalTarefa() {
    setModalAbertoTarefa(true);
  }

  function fecharModalTarefa() {
    setModalAbertoTarefa(false);
  }

  function salvarTarefa(tarefa) {
    adicionarTarefa(lista.id, tarefa);
    fecharModalTarefa();
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{lista.name}</h2>
        <button
          onClick={abrirModalTarefa}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          + Nova Tarefa
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-1">Categoria: {lista.categoria}</p>
      <p className="text-sm text-gray-500 mb-2">
        De: {dataInicialFormatada} até {dataFinalFormatada}
      </p>
      <p className="text-sm text-gray-500 mb-2">Categoria: {lista.categoria}</p>
      <ul className="space-y-1 text-gray-700 text-sm flex-1 overflow-auto max-h-48">
        {lista.tarefas.length === 0 && <li>Nenhuma tarefa</li>}
        {lista.tarefas.map((tarefa) => (
          <li key={tarefa.id}>• {tarefa.name}</li>
        ))}
      </ul>

      <ModalNovaTarefa
        aberto={modalAbertoTarefa}
        fecharModal={fecharModalTarefa}
        salvarTarefa={salvarTarefa}
      />
    </div>
  );
}
