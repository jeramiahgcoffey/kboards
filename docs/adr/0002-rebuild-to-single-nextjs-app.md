# ADR 0002: Rebuild the Vue/Quasar client and Express API into a single Next.js app

- Status: Accepted
- Date: 2026-06-24

## Context

kboards (2023) is a Vue 3 + Quasar 2 + Pinia client (Vite) talking to a separate
Express + TypeScript API, deployed as two services (frontend plus an Express server on
Render). It works, but:

- It is off my primary stack. I build and present myself in React / Next / TypeScript;
  the flagship should demonstrate that.
- Dependencies are stale (axios 0.21, TypeScript 4.5, Node 12 types).
- There are no tests and no CI.
- Two deploys add operational overhead for a personal-scale app.

## Decision

Collapse the project into a single **Next.js 16** (App Router) application:

- **UI:** React 19 + Tailwind v4. Drag and drop via **dnd-kit** (keyboard accessible),
  replacing `vuedraggable`.
- **API:** Route Handlers backed by Mongoose, replacing the standalone Express server.
- **Deploy:** one Vercel deployment, retiring the Render backend.
- **Parity first:** v2.0 reaches feature parity with v1 before any new features land.
  New features (labels, due dates, realtime, keyboard nav) follow in v2.1+ as visible,
  ongoing iteration.

Legacy Vue and Express code is moved to `legacy/` during the migration for reference and
removed when v2.0 reaches parity.

## Consequences

- Brand alignment, modern DX, one deploy, and shared muscle with jeramiahcoffey.com.
- Serverless Route Handlers require a cached Mongoose connection to avoid exhausting the
  pool across invocations (standard Next + Mongoose pattern).
- Quasar components must be rebuilt as React + Tailwind; this is the bulk of the work.
- Next.js 16 has non-obvious conventions; consult the bundled docs in
  `node_modules/next/dist/docs/` before writing framework code rather than relying on
  prior assumptions.
