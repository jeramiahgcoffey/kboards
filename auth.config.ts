import type { NextAuthConfig } from "next-auth";

// Route prefixes that require an authenticated user. Everything else is public.
const PROTECTED_PREFIXES = ["/boards"];

// Database- and adapter-free configuration shared by the full auth instance
// (`auth.ts`) and the proxy (`proxy.ts`). Keeping the Credentials provider and
// its Mongoose lookup out of this file lets the proxy read sessions without
// pulling the database layer into every request.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Gate used by the proxy. Returning false redirects the visitor to the
    // sign-in page; returning true lets the request through.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        nextUrl.pathname.startsWith(prefix),
      );
      if (isProtected) return isLoggedIn;
      return true;
    },
    // Auth.js stores the signed-in user's id in the JWT `sub` claim. Surface it
    // on the session so the app can read the current user's id.
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
