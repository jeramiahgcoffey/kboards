import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  if (await auth()) redirect("/boards");

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6">
      <div className="flex items-center gap-2">
        <span aria-hidden className="h-7 w-7 rounded bg-[var(--color-accent)]" />
        <h1 className="text-3xl font-bold tracking-tight">kboards</h1>
      </div>
      <p className="max-w-prose text-[var(--color-dim)]">
        A kanban board for tracking work. Create boards, organize tasks into
        columns, and break work into subtasks.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-surface-2)] px-5 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:bg-[var(--color-line)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
