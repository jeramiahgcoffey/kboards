import type { DefaultSession } from "next-auth";

// Expose the user's MongoDB id on the session (it is carried in the JWT `sub`
// claim and copied across in the session callback) so Server Components, Route
// Handlers, and the proxy can read it.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
