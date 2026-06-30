"use client";

import { useId, useRef, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";

export interface TaskFormValues {
  title: string;
  description?: string;
  statusName: string;
  subtasks: string[];
}

interface TaskFormModalProps {
  mode: "create" | "edit";
  // The board's columns supply the status options; the modal is only opened
  // when at least one column exists.
  columns: { id: string; name: string }[];
  initial?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<boolean>;
  onClose: () => void;
}

// Subtasks carry a stable local key so adding/removing rows never reshuffles
// React's input identity and steal focus mid-typing.
interface SubtaskRow {
  key: number;
  value: string;
}

export function TaskFormModal({
  mode,
  columns,
  initial,
  onSubmit,
  onClose,
}: TaskFormModalProps) {
  const titleId = useId();
  // Seeded past the initial rows (which key off their index) so freshly added
  // rows never collide; only bumped inside the add handler, never during render.
  const nextKeyRef = useRef(initial?.subtasks?.length ?? 0);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [statusName, setStatusName] = useState(
    initial?.statusName ?? columns[0]?.name ?? "",
  );
  const [subtasks, setSubtasks] = useState<SubtaskRow[]>(() =>
    (initial?.subtasks ?? []).map((value, index) => ({ key: index, value })),
  );
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  function updateSubtask(key: number, value: string) {
    setSubtasks((rows) =>
      rows.map((row) => (row.key === key ? { ...row, value } : row)),
    );
  }
  function addSubtask() {
    setSubtasks((rows) => [...rows, { key: nextKeyRef.current++, value: "" }]);
  }
  function removeSubtask(key: number) {
    setSubtasks((rows) => rows.filter((row) => row.key !== key));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1) {
      setError("A task title is required");
      return;
    }

    setError(undefined);
    setPending(true);
    const ok = await onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      statusName,
      // Drop blank rows; the API rejects empty subtask titles.
      subtasks: subtasks.map((row) => row.value.trim()).filter(Boolean),
    });
    if (ok) {
      onClose();
      return;
    }
    setPending(false);
  }

  return (
    <Modal open onClose={onClose} labelledBy={titleId}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <h2 id={titleId} className="text-lg font-bold">
          {mode === "create" ? "Add New Task" : "Edit Task"}
        </h2>

        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={error}
          autoFocus
          placeholder="e.g. Take coffee break"
        />

        <TextArea
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What needs to happen?"
        />

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-wide text-[var(--color-dim)]">
            Subtasks
          </span>
          <ul className="flex flex-col gap-2">
            {subtasks.map((row) => (
              <li key={row.key} className="flex items-center gap-2">
                <input
                  value={row.value}
                  onChange={(event) => updateSubtask(row.key, event.target.value)}
                  aria-label="Subtask title"
                  placeholder="e.g. Make coffee"
                  className="min-h-11 flex-1 rounded-md border border-[var(--color-line)] bg-transparent px-3 text-sm text-[var(--color-fg)] transition-colors placeholder:text-[var(--color-dim)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(row.key)}
                  aria-label="Remove subtask"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-danger-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="secondary"
            onClick={addSubtask}
            className="w-full"
          >
            + Add Subtask
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${titleId}-status`}
            className="text-xs font-bold tracking-wide text-[var(--color-dim)]"
          >
            Status
          </label>
          <select
            id={`${titleId}-status`}
            value={statusName}
            onChange={(event) => setStatusName(event.target.value)}
            className="min-h-11 rounded-md border border-[var(--color-line)] bg-transparent px-3 text-sm capitalize text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.name} className="capitalize">
                {column.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={pending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" loading={pending} className="flex-1">
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
