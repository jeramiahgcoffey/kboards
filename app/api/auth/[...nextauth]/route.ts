import { handlers } from "@/auth";

// Auth.js mounts its endpoints (sign-in, sign-out, session, CSRF) here.
export const { GET, POST } = handlers;
