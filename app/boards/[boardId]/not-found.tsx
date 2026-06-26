import Link from "next/link";

export default function BoardNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Board not found</h1>
      <p className="max-w-sm text-[var(--color-dim)]">
        This board does not exist, or it is not one of yours.
      </p>
      <Link
        href="/boards"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        Back to your boards
      </Link>
    </div>
  );
}
