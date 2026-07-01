import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

// The multi-line sibling of TextField, sharing its label/error a11y wiring so
// task descriptions read and validate like every other field.
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, error, id, className = "", ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

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
        <textarea
          {...props}
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy}
          className={`min-h-20 resize-y rounded-md border bg-transparent px-3 py-2 text-sm text-[var(--color-fg)] transition-colors placeholder:text-[var(--color-dim)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
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
