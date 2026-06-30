"use client";

import { useId, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Disables the buttons and spins the confirm action while the request runs.
  pending?: boolean;
  variant?: "primary" | "destructive";
  onConfirm: () => void;
  onClose: () => void;
}

// A focused confirmation built on the shared Modal a11y machinery, used for
// irreversible actions (delete board/column/task) so they never fire on a
// single stray click.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending = false,
  variant = "destructive",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className="flex flex-col gap-5">
        <h2
          id={titleId}
          className={`text-lg font-bold ${
            variant === "destructive" ? "text-[var(--color-danger-hover)]" : ""
          }`}
        >
          {title}
        </h2>
        <div className="text-sm leading-relaxed text-[var(--color-dim)]">
          {message}
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={pending}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            loading={pending}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
