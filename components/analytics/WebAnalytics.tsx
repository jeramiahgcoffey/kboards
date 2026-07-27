"use client";

import { Analytics } from "@vercel/analytics/next";
import { redactAnalyticsRoute } from "@/lib/analytics";

// Keep the callback on the client side: Next.js cannot serialize a function
// prop from the server RootLayout into the Analytics client component.
export function WebAnalytics() {
  return <Analytics beforeSend={redactAnalyticsRoute} />;
}
