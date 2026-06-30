"use client";

import { CreateBoardButton } from "./CreateBoardButton";

export function EmptyBoards() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h2 className="text-xl font-bold tracking-tight">No boards yet</h2>
      <p className="max-w-sm text-[var(--color-dim)]">
        Create your first board to set up columns and start tracking tasks.
      </p>
      <CreateBoardButton variant="primary" />
    </div>
  );
}
