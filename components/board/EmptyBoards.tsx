"use client";

import { CreateBoardButton } from "./CreateBoardButton";

export function EmptyBoards() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <span
        aria-hidden
        className="mb-6 grid h-16 w-16 grid-cols-3 items-end gap-1.5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3"
      >
        <span className="h-8 rounded-sm bg-[#8471f2]" />
        <span className="h-11 rounded-sm bg-[#49c4e5]" />
        <span className="h-6 rounded-sm bg-[#67e2ae]" />
      </span>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77d8ee]">
        Your first board
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
        Start with a useful shape.
      </h2>
      <p className="mt-3 max-w-md leading-7 text-[var(--color-dim)]">
        Choose the Personal flow for a ready-to-edit Backlog → This week → Done
        board, or begin with a blank canvas.
      </p>
      <div className="mt-7">
        <CreateBoardButton
          variant="primary"
          label="Create your first board"
        />
      </div>
    </div>
  );
}
