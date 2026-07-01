"use client";

import { useEffect, useId, useRef } from "react";

// A shared registry for stacked overlays (modals, menus). Each open overlay
// registers an Escape handler; a single capture-phase document listener routes
// Escape to only the *topmost* overlay and stops it there. This replaces each
// overlay wiring its own document listener — which only worked for one exact
// nesting (a menu inside a modal) and broke for any deeper or repeated stack.

interface OverlayEntry {
  id: string;
  onEscape: () => void;
}

const stack: OverlayEntry[] = [];
let listening = false;

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || stack.length === 0) return;
  // Only the topmost overlay reacts, and it consumes the event so it never
  // reaches a parent overlay or the document below.
  event.preventDefault();
  event.stopPropagation();
  stack[stack.length - 1].onEscape();
}

function startListening() {
  if (listening) return;
  document.addEventListener("keydown", handleKeyDown, true);
  listening = true;
}

function stopListening() {
  if (!listening) return;
  document.removeEventListener("keydown", handleKeyDown, true);
  listening = false;
}

// Exposed for tests to assert the stack drains on unmount.
export function overlayStackSize() {
  return stack.length;
}

// Registers `onEscape` as the Escape handler while `active` is true, pushing it
// onto the shared stack on activate and popping it on deactivate/unmount. The
// latest `onEscape` is always called, without re-ordering the stack on every
// render.
export function useOverlayEscape(active: boolean, onEscape: () => void) {
  const id = useId();
  const handlerRef = useRef(onEscape);

  useEffect(() => {
    handlerRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const entry: OverlayEntry = { id, onEscape: () => handlerRef.current() };
    stack.push(entry);
    startListening();
    return () => {
      const index = stack.findIndex((item) => item.id === entry.id);
      if (index !== -1) stack.splice(index, 1);
      if (stack.length === 0) stopListening();
    };
  }, [active, id]);
}
