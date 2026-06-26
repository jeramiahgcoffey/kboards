import type { ReactNode } from "react";

// Shared shell for the auth screens: a titled card with optional subtitle and a
// footer for the cross-link (sign in <-> register, etc.).
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-lg sm:p-8">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--color-dim)]">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
      {footer ? (
        <p className="mt-6 text-center text-sm text-[var(--color-dim)]">
          {footer}
        </p>
      ) : null}
    </section>
  );
}
