# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Began the v2 rebuild: migrating from a Vue/Quasar client plus a standalone Express API
  to a single Next.js 16 full-stack application (see `docs/adr/0002`). Established
  architecture decision records and contribution conventions.

## [2023.1.1] - 2023-03-18

- Last v1 release: Vue 3 + Quasar 2 client with an Express + TypeScript API, JWT auth,
  email password reset, and drag-and-drop kanban boards.
