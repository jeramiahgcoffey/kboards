"use client";

import { useId } from "react";
import type { TaskDTO } from "@/lib/dto";
import { Modal } from "@/components/ui/Modal";
import { Menu, MenuItem } from "@/components/ui/Menu";

interface TaskModalProps {
  task: TaskDTO | null;
  // The board's columns supply the status options.
  columns: { id: string; name: string }[];
  onClose: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onChangeStatus: (statusName: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskModal({
  task,
  columns,
  onClose,
  onToggleSubtask,
  onChangeStatus,
  onEdit,
  onDelete,
}: TaskModalProps) {
  const titleId = useId();
  const statusId = useId();
  const done = task
    ? task.subtasks.filter((subtask) => subtask.completed).length
    : 0;

  return (
    <Modal open={task !== null} onClose={onClose} labelledBy={titleId}>
      {task ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-2">
            <h2 id={titleId} className="text-lg font-bold leading-snug">
              {task.title}
            </h2>
            <div className="flex shrink-0 items-center">
              <Menu label="Task actions">
                <MenuItem onSelect={onEdit}>Edit Task</MenuItem>
                <MenuItem onSelect={onDelete} destructive>
                  Delete Task
                </MenuItem>
              </Menu>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close task"
                className="-mr-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          {task.description ? (
            <p className="text-sm leading-relaxed text-[var(--color-dim)]">
              {task.description}
            </p>
          ) : null}

          {task.subtasks.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-[var(--color-dim)]">
                Subtasks ({done} of {task.subtasks.length})
              </h3>
              <ul className="flex flex-col gap-2">
                {task.subtasks.map((subtask) => (
                  <li key={subtask.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-md bg-[var(--color-bg)] px-3 py-3 text-sm transition-colors hover:bg-[var(--color-surface-2)]">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(subtask.id)}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                      <span
                        className={
                          subtask.completed
                            ? "text-[var(--color-dim)] line-through"
                            : "text-[var(--color-fg)]"
                        }
                      >
                        {subtask.title}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={statusId}
              className="text-xs font-bold text-[var(--color-dim)]"
            >
              Current status
            </label>
            <select
              id={statusId}
              value={task.status.name}
              onChange={(event) => onChangeStatus(event.target.value)}
              className="min-h-11 rounded-md border border-[var(--color-line)] bg-transparent px-3 text-sm capitalize text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.name} className="capitalize">
                  {column.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
