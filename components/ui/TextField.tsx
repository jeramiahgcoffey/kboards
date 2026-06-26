import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, id, className = "", ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    // Merge so the error wiring always applies, without dropping any
    // aria-describedby the consumer passed for another purpose.
    const describedBy =
      [props["aria-describedby"], error ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-bold tracking-wide text-[var(--color-dim)]"
        >
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          className={`min-h-11 rounded-md border bg-transparent px-3 text-sm text-[var(--color-fg)] transition-colors placeholder:text-[var(--color-dim)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
            error ? "border-[var(--color-danger)]" : "border-[var(--color-line)]"
          } ${className}`}
        />
        {error ? (
          <p id={errorId} className="text-xs text-[var(--color-danger)]">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
