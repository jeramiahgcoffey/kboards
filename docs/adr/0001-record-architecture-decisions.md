# ADR 0001: Record architecture decisions

- Status: Accepted
- Date: 2026-06-24

## Context

The v2 rebuild makes several consequential choices (framework, data model, auth). A
reader of this repo, including future me, should be able to see not just what was built
but why. Commit history alone does not carry that reasoning well.

## Decision

Record significant architecture decisions as short Markdown files in `docs/adr/`,
numbered sequentially, using Michael Nygard's lightweight Context / Decision /
Consequences format. Copy `template.md` for each new decision.

## Consequences

- A durable, in-repo trail of why the system is the way it is.
- A small ongoing discipline: a decision is not "done" until it is recorded.
- These records are also the clearest signal that the work is engineered rather than
  generated without judgment.
