# Contributing

This is a personal project, but it follows real conventions so that the work reads as
engineered rather than generated, and so the history shows genuine iteration.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`,
  imperative mood, subject under ~50 characters. Types: `feat`, `fix`, `refactor`,
  `perf`, `test`, `docs`, `chore`, `build`, `ci`.
- Explain the why in the body, not just the what.
- When AI assisted, add an `Assisted-by:` trailer. The human is the author; the AI is the
  tool. (Not `Co-authored-by:`, which implies legal personhood.)

```
feat(board): persist column reordering

Optimistic UI keeps drag responsive; rolls back on a 4xx.

Assisted-by: Claude (Opus 4.8) <noreply@anthropic.com>
```

## Branches and pull requests

- Branch per unit of work: `feat/...`, `fix/...`, `refactor/...`.
- Open a PR using the template (problem / approach / tradeoffs / testing). The tradeoffs
  section is where engineering judgment is made visible.
- CI (lint, typecheck, test, build) must be green before merge.

## Decisions

- Record significant architecture decisions in `docs/adr/` using `template.md`.

## Releases

- Update `CHANGELOG.md`, tag `vX.Y.Z` (SemVer), and create a GitHub Release.
