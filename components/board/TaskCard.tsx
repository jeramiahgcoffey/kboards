import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";
import { Menu, MenuItem } from "@/components/ui/Menu";

interface TaskCardProps {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
  // Optional drag wiring, supplied by DraggableTaskCard. Omitted when the card
  // is rendered statically (e.g. inside the drag overlay or in tests).
  dragRef?: (element: HTMLElement | null) => void;
  dragListeners?: DraggableSyntheticListeners;
  dragging?: boolean;
  // Optional on-card actions. When provided, the card grows a "..." menu whose
  // "Move to" items are the keyboard/screen-reader path to move a task (pointer
  // users can also drag). Omitted for the drag overlay and static/test renders.
  columns?: ColumnDTO[];
  onMove?: (task: TaskDTO, toColumnName: string) => void;
  onEdit?: (task: TaskDTO) => void;
  onDelete?: (task: TaskDTO) => void;
}

export function TaskCard({
  task,
  onOpen,
  dragRef,
  dragListeners,
  dragging = false,
  columns,
  onMove,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const total = task.subtasks.length;
  const done = task.subtasks.filter((subtask) => subtask.completed).length;
  const hasActions = Boolean(onMove || onEdit || onDelete);
  // Every column except the one the task already sits in.
  const moveTargets =
    columns?.filter((column) => column.name !== task.status.name) ?? [];

  return (
    <article className="group relative">
      <button
        ref={dragRef}
        type="button"
        onClick={() => onOpen(task)}
        {...dragListeners}
        aria-label={`Open task: ${task.title}`}
        className={`flex w-full flex-col gap-2 rounded-lg bg-[var(--color-surface)] py-4 pl-4 pr-11 text-left shadow-sm transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
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

      {hasActions ? (
        <div className="absolute right-1.5 top-3.5">
          <Menu
            label={`Actions for ${task.title}`}
            triggerClassName="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {onMove
              ? moveTargets.map((column) => (
                  <MenuItem
                    key={column.id}
                    onSelect={() => onMove(task, column.name)}
                  >
                    Move to {column.name}
                  </MenuItem>
                ))
              : null}
            {onEdit ? (
              <MenuItem onSelect={() => onEdit(task)}>Edit task</MenuItem>
            ) : null}
            {onDelete ? (
              <MenuItem onSelect={() => onDelete(task)} destructive>
                Delete task
              </MenuItem>
            ) : null}
          </Menu>
        </div>
      ) : null}
    </article>
  );
}
