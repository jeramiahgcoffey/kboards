import { cache } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBoard, listBoards, type BoardDocument } from "@/lib/services/boards";
import { ServiceError } from "@/lib/services/errors";
import { toBoard, toBoardSummary } from "@/lib/dto";
import { AppShell } from "@/components/board/AppShell";
import { BoardView } from "@/components/board/BoardView";

// Cached per request so generateMetadata and the page share one set of queries
// instead of hitting Mongo twice. A missing/foreign board resolves to null so
// callers can render a 404 instead of throwing.
const loadWorkspace = cache(async (userId: string, boardId: string) => {
  const summariesPromise = listBoards(userId);
  let board: BoardDocument | null = null;
  try {
    board = await getBoard(userId, boardId);
  } catch (error) {
    if (error instanceof ServiceError && error.status === 404) board = null;
    else throw error;
  }
  return { summaries: await summariesPromise, board };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardId: string }>;
}): Promise<Metadata> {
  const { boardId } = await params;
  const session = await auth();
  if (!session?.user) return { title: "Boards" };

  const { board } = await loadWorkspace(session.user.id, boardId);
  return { title: board ? board.name : "Board not found" };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { summaries, board } = await loadWorkspace(session.user.id, boardId);
  if (!board) notFound();

  return (
    <AppShell
      boards={summaries.map(toBoardSummary)}
      activeBoardId={boardId}
      userEmail={session.user.email ?? ""}
      title={board.name}
    >
      <BoardView board={toBoard(board)} />
    </AppShell>
  );
}
