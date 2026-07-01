import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { TaskDTO } from "@/lib/dto";

interface TaskCardProps {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
  // Optional drag wiring, supplied by DraggableTaskCard. Omitted when the card
  // is rendered statically (e.g. inside the drag overlay or in tests).
  dragRef?: (element: HTMLElement | null) => void;
  dragListeners?: DraggableSyntheticListeners;
  dragging?: boolean;
}

export function TaskCard({
  task,
  onOpen,
  dragRef,
  dragListeners,
  dragging = false,
}: TaskCardProps) {
  const total = task.subtasks.length;
  const done = task.subtasks.filter((subtask) => subtask.completed).length;

  return (
    <button
      ref={dragRef}
      type="button"
      onClick={() => onOpen(task)}
      {...dragListeners}
      className={`group flex w-full touch-none flex-col gap-2 rounded-lg bg-[var(--color-surface)] px-4 py-4 text-left shadow-sm transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <span className="font-bold leading-snug text-[var(--color-fg)] group-hover:text-[var(--color-accent-hover)]">
        {task.title}
      </span>
      {total > 0 ? (
        <span className="text-xs font-bold text-[var(--color-dim)]">
          {done} of {total} subtasks
        </span>
      ) : null}
    </button>
  );
}
