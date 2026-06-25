# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
