"use client";

import { useId, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PALETTE } from "./colors";

export interface ColumnFormValues {
  name: string;
  color: string;
}

interface ColumnFormModalProps {
  mode: "create" | "edit";
  initial?: ColumnFormValues;
  onSubmit: (values: ColumnFormValues) => Promise<boolean>;
  onClose: () => void;
}

export function ColumnFormModal({
  mode,
  initial,
  onSubmit,
  onClose,
}: ColumnFormModalProps) {
  const titleId = useId();
  const [name, setName] = useState(initial?.name ?? "");
  // Preserve whatever color the column already has (it may be outside the
  // palette), so renaming a column never silently overwrites its color; only
  // fall back to the first swatch when there is no color yet.
  const [color, setColor] = useState(initial?.color ?? PALETTE[0]);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length < 3) {
      setError("Column name must be more than 2 characters");
      return;
    }

    setError(undefined);
    setPending(true);
    const ok = await onSubmit({ name: trimmedName, color });
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
          {mode === "create" ? "Add New Column" : "Edit Column"}
        </h2>
        <TextField
          label="Column name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={error}
          autoFocus
          placeholder="e.g. In Progress"
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-bold tracking-wide text-[var(--color-dim)]">
            Color
          </legend>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((swatch) => {
              const selected = swatch === color;
              return (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Color ${swatch}`}
                  aria-pressed={selected}
                  onClick={() => setColor(swatch)}
                  style={{ backgroundColor: swatch }}
                  className={`h-8 w-8 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] ${
                    selected
                      ? "scale-110 ring-2 ring-[var(--color-fg)]"
                      : "hover:scale-105"
                  }`}
                />
              );
            })}
          </div>
        </fieldset>
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
            {mode === "create" ? "Create Column" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
