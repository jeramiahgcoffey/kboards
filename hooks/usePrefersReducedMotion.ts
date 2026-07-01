"use client";

import { useSyncExternalStore } from "react";

// Reports the user's "reduce motion" OS setting, updating live if it changes.
// SSR-safe via useSyncExternalStore: the server snapshot is `false` (assume
// motion is allowed) and the client subscribes to the media query.

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
