"use client";

import { useId, useState, type SyntheticEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";

export interface BoardFormValues {
  name: string;
  description?: string;
}

interface BoardFormModalProps {
  mode: "create" | "edit";
  initial?: BoardFormValues;
  // Returns true when the mutation succeeded, so the modal can close itself;
  // false keeps it open (the error is surfaced as a toast by the caller).
  onSubmit: (values: BoardFormValues) => Promise<boolean>;
  onClose: () => void;
}

// Mounted only while open, so its field state starts fresh from `initial`
// on every open without a reset effect.
export function BoardFormModal({
  mode,
  initial,
  onSubmit,
  onClose,
}: BoardFormModalProps) {
  const titleId = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const nextErrors: typeof errors = {};
    if (trimmedName.length < 1) nextErrors.name = "A board name is required";
    else if (trimmedName.length > 25)
      nextErrors.name = "Keep the name under 26 characters";
    if (trimmedDescription && trimmedDescription.length < 3)
      nextErrors.description = "Use at least 3 characters, or leave it empty";
    else if (trimmedDescription.length > 100)
      nextErrors.description = "Keep the description under 101 characters";

    if (nextErrors.name || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setPending(true);
    const ok = await onSubmit({
      name: trimmedName,
      description: trimmedDescription || undefined,
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
          {mode === "create" ? "Add New Board" : "Edit Board"}
        </h2>
        <TextField
          label="Board name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          maxLength={25}
          autoFocus
          placeholder="e.g. Platform Launch"
        />
        <TextArea
          label="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
          maxLength={100}
          placeholder="What is this board for?"
        />
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
            {mode === "create" ? "Create Board" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
