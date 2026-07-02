"use client";

import { useState, type ReactNode } from "react";
import type { BoardSummaryDTO } from "@/lib/dto";
import { Modal } from "@/components/ui/Modal";
import { LogoMark } from "@/components/ui/Logo";
import { Sidebar } from "./Sidebar";
import { SignOutButton } from "./SignOutButton";

interface AppShellProps {
  boards: BoardSummaryDTO[];
  userEmail: string;
  activeBoardId?: string;
  // Heading for the current view (board name, or a fallback for the empty state).
  title: string;
  children: ReactNode;
}

export function AppShell({
  boards,
  userEmail,
  activeBoardId,
  title,
  children,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // With no boards there is nothing to navigate to, so the drawer and its
  // trigger would only open an empty dead-end panel on small screens.
  const hasBoards = boards.length > 0;

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Persistent sidebar on large screens. */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-line)] lg:block">
        <Sidebar boards={boards} activeBoardId={activeBoardId} />
      </aside>

      {/* Slide-over board list on small screens, reusing the modal a11y machinery. */}
      {hasBoards ? (
        <Modal
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          label="Boards"
          containerClassName="items-stretch justify-start"
          panelClassName="h-full w-72 max-w-[80vw] border-r border-[var(--color-line)] bg-[var(--color-surface)]"
        >
          <Sidebar
            boards={boards}
            activeBoardId={activeBoardId}
            onNavigate={() => setDrawerOpen(false)}
          />
        </Modal>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {hasBoards ? (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open board list"
                className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] lg:hidden"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M3 5.5A.75.75 0 0 1 3.75 4.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm.75 3.75a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" />
                </svg>
              </button>
            ) : null}
            {/* The sidebar (and its brand mark) is hidden on small screens, so
                surface the mark in the header there to keep the app branded. */}
            <LogoMark className="h-6 w-6 shrink-0 lg:hidden" title="kboards" />
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-sm text-[var(--color-dim)] sm:inline">
              {userEmail}
            </span>
            <SignOutButton />
          </div>
        </header>

        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
