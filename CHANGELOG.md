# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Board interactivity: create/edit/delete dialogs for boards, columns (with a color
  picker), and tasks (title, description, status, and a dynamic subtask list); an
  interactive task modal with subtask toggles and status changes; and dnd-kit drag of tasks
  between columns. Mutations are optimistic with toast feedback (sonner) and roll back on
  failure; the optimistic paths keep their own change rather than replacing the whole board
  on success, so concurrent edits are not clobbered. Board/column/task/subtask mutation
  Route Handlers now return the board as a serialized DTO, and a new `BoardWorkspace` client
  component owns active-board state and routes every dialog. Drag is a pointer enhancement;
  the keyboard-accessible way to move a task is the status select in the task modal. Covered
  by Vitest tests and verified end to end.
- Board view: a responsive boards workspace with a board-list sidebar (a slide-over drawer
  on small screens), columns rendered from each board's schema, task cards showing subtask
  progress, and a read-only task modal. The sidebar and task modal share one accessible
  dialog primitive (focus trap, `Escape` to close, scroll lock, focus restore) built on a
  portal rather than the native `<dialog>` element, which the test runner's jsdom does not
  yet implement. Server Components fetch through the service layer and serialize boards to
  plain DTOs before crossing into Client Components. Covered by Vitest component tests.
- Authentication UI: sign-in, registration, and a two-step password-reset flow, plus a
  landing page and an authenticated boards placeholder, built mobile-first and accessible
  (labelled fields, `aria-invalid` / `aria-describedby`, `role="alert"` errors, visible
  focus rings). Introduces a small design-system layer (Button, TextField) and a component
  testing harness (Vitest + Testing Library + jsdom).
- Board and task API: CRUD Route Handlers for boards, columns, tasks, and subtasks,
  backed by an ownership-scoped service layer and a shared authenticated-route wrapper
  (one auth gate and one error-mapping policy). Improves on v1 by adding board rename and
  delete, which the old API lacked. Covered by Vitest integration tests.
- Authentication layer (see `docs/adr/0004`): Auth.js v5 with a Credentials provider and
  JWT sessions, a registration Route Handler, and a custom email password-reset flow whose
  tokens are stored only as SHA-256 hashes and are single use. Route protection moved to a
  Next.js 16 `proxy` (the renamed Middleware). Covered by Vitest integration tests.

### Changed

- Began the v2 rebuild: migrating from a Vue/Quasar client plus a standalone Express API
  to a single Next.js 16 full-stack application (see `docs/adr/0002`). Established
  architecture decision records and contribution conventions.

## [2023.1.1] - 2023-03-18

- Last v1 release: Vue 3 + Quasar 2 client with an Express + TypeScript API, JWT auth,
  email password reset, and drag-and-drop kanban boards.
