"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

// Client-side context shared across the app: the Auth.js session (for
// useSession in client components) and the toast surface.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster theme="dark" position="bottom-center" richColors />
    </SessionProvider>
  );
}
