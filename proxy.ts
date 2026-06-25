import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 renamed Middleware to Proxy. Reuse the database-free config so the
// proxy can read the session and run the `authorized` callback without bundling
// the Credentials provider or Mongoose. Auth.js returns an `auth` function that
// is itself the proxy handler.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Run on everything except API routes, Next internals, and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
