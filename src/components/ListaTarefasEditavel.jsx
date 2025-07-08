import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Plus } from "lucide-react";

function SortableItem({ id, task, onRemove, onToggleExpand }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded p-3 mb-2 cursor-grab hover:bg-gray-200 max-w-full overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div
          className="pr-2 w-full overflow-hidden cursor-pointer"
          onClick={() => onToggleExpand(id)}
        >
          <h4 className="text-md font-semibold break-words">{task.name}</h4>
          <p
            className={`text-sm text-gray-700 ${
              task.expanded ? "" : "truncate"
            } break-words`}
          >
            {task.description}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function TarefasEditor({ tarefasIniciais = [], onChange }) {
    const [tarefas, setTarefas] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {
        const processadas = tarefasIniciais.map((t, index) => ({
            ...t,
            id: t.id || `temp-${index}`,
            expanded: false,
        }));
        setTarefas(processadas);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tarefasIniciais]);

    function adicionarTarefa() {
        if (!nome.trim()) return;

        const nova = {
            id: `temp-${Date.now()}`,
            name: nome.trim(),
            description: descricao.trim(),
            priority: tarefas.length,
            expanded: false,
        };

        const atualizadas = [...tarefas, nova];
        setTarefas(atualizadas);
        setNome("");
        setDescricao("");
        onChange?.(atualizadas);
    }

    function removerTarefa(id) {
        console.log(tarefas)
        console.log(id)
        const filtradas = tarefas.filter((t) => t.id !== id);
        console.log(filtradas)
        setTarefas(filtradas);
        onChange?.(filtradas);
    }

    function alternarExpandir(id) {
        setTarefas((ts) =>
            ts.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t))
        );
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = tarefas.findIndex((t) => t.id === active.id);
            const newIndex = tarefas.findIndex((t) => t.id === over.id);
            const reordenadas = arrayMove(tarefas, oldIndex, newIndex).map(
                (t, i) => ({ ...t, priority: i })
            );
            setTarefas(reordenadas);
            onChange?.(reordenadas);
        }
    }

    return (
        <div className="border-l pl-6 flex-1 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2">Tarefas da Lista</h3>

            <div className="mb-4">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Nome da tarefa"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                    />
                    <button
                        type="button"
                        onClick={adicionarTarefa}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Descrição da tarefa"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                />
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={tarefas.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tarefas.map((task) => (
                            <SortableItem
                                key={task.id}
                                id={task.id}
                                task={task}
                                onRemove={removerTarefa}
                                onToggleExpand={alternarExpandir}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>

    );
}
