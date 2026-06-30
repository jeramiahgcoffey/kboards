"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

// A small dropdown menu for the "..." action triggers (board, column, task).
// Closes on outside click, on Escape (restoring focus to the trigger), and
// after an item is chosen. Honors the ARIA menu pattern: focus moves into the
// menu on open and the arrow/Home/End keys navigate between items.

const MenuContext = createContext<{ close: () => void } | null>(null);

interface MenuProps {
  // Accessible name for the trigger button, e.g. "Board actions".
  label: string;
  children: ReactNode;
  // Optional override for the trigger styling/content; defaults to a "..." glyph.
  triggerClassName?: string;
}

export function Menu({ label, children, triggerClassName = "" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = () => setOpen(false);

  const items = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );

  useEffect(() => {
    if (!open) return;

    // Move focus into the menu so the arrow keys have somewhere to start.
    items()[0]?.focus();

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const all = items();
    if (all.length === 0) return;
    const current = all.indexOf(document.activeElement as HTMLElement);

    let next: number | null = null;
    if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % all.length;
    else if (event.key === "ArrowUp") next = current <= 0 ? all.length - 1 : current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = all.length - 1;

    if (next === null) return;
    event.preventDefault();
    all[next].focus();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={
          triggerClassName ||
          "inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        }
      >
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
        </svg>
      </button>

      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 z-10 mt-2 flex w-44 flex-col gap-1 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-2 shadow-xl"
        >
          <MenuContext.Provider value={{ close }}>
            {children}
          </MenuContext.Provider>
        </div>
      ) : null}
    </div>
  );
}

interface MenuItemProps {
  onSelect: () => void;
  children: ReactNode;
  destructive?: boolean;
}

export function MenuItem({ onSelect, children, destructive }: MenuItemProps) {
  const ctx = useContext(MenuContext);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        ctx?.close();
        onSelect();
      }}
      className={`rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
        destructive
          ? "text-[var(--color-danger-hover)]"
          : "text-[var(--color-fg)]"
      }`}
    >
      {children}
    </button>
  );
}
