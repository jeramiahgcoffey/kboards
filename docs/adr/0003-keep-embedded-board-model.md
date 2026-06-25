# ADR 0003: Keep the embedded board document model

- Status: Accepted
- Date: 2026-06-24

## Context

The current schema embeds columns, tasks, and subtasks inside a single `Board`
document. The alternative is to normalize tasks and subtasks into their own collections
referenced by id.

## Decision

Keep the embedded model for v2.0. A board is a natural aggregate: it is read and written
as a unit, it stays far under MongoDB's 16MB document limit at personal-productivity
scale, and embedding keeps reads to a single document with no joins and makes updates
atomic.

## Consequences

- Simple, fast single-document reads and writes; atomic board updates.
- Array subdocuments are addressed by `_id` for patch, reorder, and delete operations.
- Unbounded growth is a theoretical risk if a single board became enormous, which is not
  a realistic usage pattern here.
- Revisit if shared/multi-user boards or very large boards become a goal, since those
  shift the access pattern toward per-task contention.
