import { auth } from "@/auth";

// Data access helper: returns the signed-in user's id, or null. Route Handlers
// and Server Components call this to enforce authorization close to the data,
// following the Next.js Data Access Layer guidance.
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
