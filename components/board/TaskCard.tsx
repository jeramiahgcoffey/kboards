import type { TaskDTO } from "@/lib/dto";

interface TaskCardProps {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  const total = task.subtasks.length;
  const done = task.subtasks.filter((subtask) => subtask.completed).length;

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="group flex w-full flex-col gap-2 rounded-lg bg-[var(--color-surface)] px-4 py-4 text-left shadow-sm transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
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
