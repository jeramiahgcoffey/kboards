"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BoardDTO } from "@/lib/dto";
import { apiFetch, ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { BoardFormModal, type BoardFormValues } from "./BoardFormModal";

// The board-list's create entry point. Self-contained so it works from the
// sidebar, the mobile drawer, and the no-boards empty state, even when no board
// is active. `variant` switches between the sidebar link styling and a
// standalone primary button for the empty state.
export function CreateBoardButton({
  onCreated,
  variant = "sidebar",
}: {
  onCreated?: () => void;
  variant?: "sidebar" | "primary";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function submit(values: BoardFormValues): Promise<boolean> {
    try {
      const { board } = await apiFetch<{ board: BoardDTO }>("/api/boards", {
        method: "POST",
        body: values,
      });
      toast.success("Board created");
      onCreated?.();
      // Land on the new board and refresh the server-rendered sidebar/title.
      router.push(`/boards/${board.id}`);
      router.refresh();
      return true;
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not create the board.",
      );
      return false;
    }
  }

  return (
    <>
      {variant === "primary" ? (
        <Button type="button" onClick={() => setOpen(true)}>
          + Create New Board
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mr-4 flex min-h-11 items-center gap-3 rounded-r-full px-6 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
            <path d="M8 1.333a.667.667 0 0 1 .667.667v5.333H14a.667.667 0 0 1 0 1.334H8.667V14a.667.667 0 1 1-1.334 0V8.667H2a.667.667 0 1 1 0-1.334h5.333V2A.667.667 0 0 1 8 1.333Z" />
          </svg>
          <span className="truncate">Create New Board</span>
        </button>
      )}
      {open ? (
        <BoardFormModal
          mode="create"
          onSubmit={submit}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
