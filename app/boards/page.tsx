import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = { title: "Your boards" };

export default async function BoardsPage() {
  // The proxy already gates this route; re-check so the page has a session and
  // degrades safely if reached directly.
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--color-line)] px-5 py-4">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-5 w-5 rounded bg-[var(--color-accent)]" />
          <span className="text-lg font-bold tracking-tight">kboards</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[var(--color-dim)] sm:inline">
            {session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center gap-3 px-5 py-12">
        <h1 className="text-2xl font-bold tracking-tight">You are signed in</h1>
        <p className="max-w-prose text-[var(--color-dim)]">
          Authentication is wired up end to end. The board view, with columns,
          cards, and drag and drop, lands in the next slice.
        </p>
      </main>
    </div>
  );
}
