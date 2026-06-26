import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listBoards } from "@/lib/services/boards";
import { AppShell } from "@/components/board/AppShell";
import { EmptyBoards } from "@/components/board/EmptyBoards";

export const metadata: Metadata = { title: "Your boards" };

export default async function BoardsPage() {
  // The proxy already gates this route; re-check so the page has a session and
  // degrades safely if reached directly.
  const session = await auth();
  if (!session?.user) redirect("/login");

  const boards = await listBoards(session.user.id);
  // Land the user on a concrete board rather than an index with no content.
  if (boards.length > 0) redirect(`/boards/${boards[0]._id}`);

  return (
    <AppShell boards={[]} userEmail={session.user.email ?? ""} title="Your boards">
      <EmptyBoards />
    </AppShell>
  );
}
