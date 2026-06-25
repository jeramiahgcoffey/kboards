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

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-bold tracking-wide text-[var(--color-dim)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-11 rounded-md border bg-transparent px-3 text-sm text-[var(--color-fg)] transition-colors placeholder:text-[var(--color-dim)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
            error ? "border-[var(--color-danger)]" : "border-[var(--color-line)]"
          } ${className}`}
          {...props}
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
