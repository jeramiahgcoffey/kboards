import type { ReactNode } from "react";
import Link from "next/link";

// Centered, mobile-first shell for the sign-in / register / reset screens.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-5 py-12">
      <Link
        href="/"
        className="flex items-center gap-2 self-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <span aria-hidden className="h-6 w-6 rounded bg-[var(--color-accent)]" />
        <span className="text-2xl font-bold tracking-tight">kboards</span>
      </Link>
      {children}
    </main>
  );
}
