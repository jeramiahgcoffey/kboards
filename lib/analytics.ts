import type { BeforeSendEvent } from "@vercel/analytics/next";

export function redactAnalyticsRoute(
  event: BeforeSendEvent,
): BeforeSendEvent {
  const url = new URL(event.url);

  // Board ids and password-reset credentials do not belong in analytics.
  url.pathname = url.pathname
    .replace(/^\/boards\/[^/]+/, "/boards/[board]")
    .replace(
      /^\/password-reset\/[^/]+\/[^/]+/,
      "/password-reset/[private-link]",
    );
  url.search = "";

  return { ...event, url: url.toString() };
}
