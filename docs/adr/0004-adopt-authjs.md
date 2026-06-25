# ADR 0004: Adopt Auth.js (NextAuth) for authentication

- Status: Accepted
- Date: 2026-06-24

## Context

v1 auth is custom: JWT issued by the Express API, plus an email-based password-reset
flow (a `Token` model with nodemailer delivery). The rebuild moves to Next.js. Options
were to port the custom JWT logic into Route Handlers, or adopt Auth.js v5.

## Decision

Adopt **Auth.js v5 (NextAuth)** with:

- a **Credentials provider** (email + password, bcrypt verification),
- the **JWT session strategy** with httpOnly, secure cookies,
- the **MongoDB adapter deferred** until OAuth providers are added. Credentials with JWT
  sessions does not persist users through the adapter, so wiring it now would be dead
  code; users are created and read directly through Mongoose.

Auth.js does not provide password reset. Keep a **custom token-based email reset flow**
(retain the `Token` model and add reset Route Handlers) layered alongside Auth.js, at
behavior parity with v1.

## Consequences

- A standard, maintained auth surface: session handling, CSRF, and cookie management come
  from the library, with room to add OAuth providers later without re-architecting.
- Rewriting working auth carries risk, and the Credentials provider is the least
  batteries-included Auth.js path (it deliberately omits niceties to discourage passwords
  over OAuth). Cover login, registration, session, and reset with Vitest before cutover.
- The reset flow stays custom, so its security (token expiry, single use, hashing the
  stored token) remains our responsibility and must be tested.
