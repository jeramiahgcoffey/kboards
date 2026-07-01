"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useOverlayEscape } from "./overlayStack";

// A store that never changes: the snapshots alone distinguish server from client.
const emptySubscribe = () => () => {};
const getClientSnapshot = () => false;
const getServerSnapshot = () => true;

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  // Positioning hooks so the same a11y machinery backs both a centered modal
  // and a left nav drawer.
  containerClassName?: string;
  panelClassName?: string;
}

// Every dialog must have an accessible name, so require exactly one of
// `labelledBy` (an id) or `label` (literal text) at the type level.
type ModalProps = BaseModalProps &
  (
    | { labelledBy: string; label?: never }
    | { label: string; labelledBy?: never }
  );

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  label,
  containerClassName = "items-end justify-center p-4 sm:items-center",
  panelClassName = "w-full max-w-md rounded-xl bg-[var(--color-surface)] p-6 shadow-2xl",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // A "use client" component can still render on the server before hydration;
  // detect that without setState-in-effect so `document` is only touched on the
  // client (useSyncExternalStore returns the server snapshot through hydration).
  const isServer = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Escape is handled through the shared overlay stack so a nested overlay (a
  // menu inside this modal) closes only itself, and this modal closes only when
  // it is the topmost overlay.
  useOverlayEscape(open, onClose);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    // Only the Tab focus-trap lives here now; Escape is owned by the overlay
    // stack above.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (isServer || !open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex overflow-y-auto bg-black/60 ${containerClassName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        className={`outline-none ${panelClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
