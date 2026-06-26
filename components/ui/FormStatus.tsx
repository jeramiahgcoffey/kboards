// A form-level message announced to assistive tech via role="alert". Used for
// submission errors that are not tied to a single field.
export function FormStatus({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger-hover)]"
    >
      {message}
    </p>
  );
}
