import Link from "next/link";
import type { BoardSummaryDTO } from "@/lib/dto";

interface SidebarProps {
  boards: BoardSummaryDTO[];
  activeBoardId?: string;
  // Lets the mobile drawer close itself when a board is chosen.
  onNavigate?: () => void;
}

export function Sidebar({ boards, activeBoardId, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 py-6">
      <div className="flex items-center gap-2 px-6">
        <span aria-hidden className="h-5 w-5 rounded bg-[var(--color-accent)]" />
        <span className="text-lg font-bold tracking-tight">kboards</span>
      </div>

      <nav aria-label="Boards" className="flex flex-1 flex-col gap-1">
        <h2 className="px-6 pb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-dim)]">
          All boards ({boards.length})
        </h2>
        {boards.map((board) => {
          const active = board.id === activeBoardId;
          return (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`mr-4 flex min-h-11 items-center gap-3 rounded-r-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)] ${
                active
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
              }`}
            >
              <BoardGlyph />
              <span className="truncate">{board.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function BoardGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
    >
      <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89v3.666h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" />
    </svg>
  );
}
