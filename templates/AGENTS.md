# AGENTS.md

<!-- Keep this file short (well under 200 lines): only what an agent cannot guess from the code.
     Generic rules belong in the shared rules, not here. -->

Shared rules for every repository: [general](.claude/rules/shared/general.md),
[TypeScript](.claude/rules/shared/typescript.md), [React](.claude/rules/shared/react.md),
[Tailwind and shadcn](.claude/rules/shared/tailwind-shadcn.md), [tests](.claude/rules/shared/testing.md),
[mobile PWA](.claude/rules/shared/mobile-pwa.md), [Cloudflare](.claude/rules/shared/cloudflare.md).
Read the ones matching the files you touch. This file wins when it says otherwise.

## Product

<!-- What the app is, who uses it, the language of the UI, hard constraints (offline, no backend…). -->

## Commands

| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Development server                   |
| `npm run check`  | Lint, format check, typecheck, tests |
| `npm run build`  | Production build                     |

Run `npm run check` and `npm run build` before considering a task done.

## Layout

<!-- The folders and what goes where, with one real example per folder. -->

## Project rules

<!-- Only rules specific to this repository, each with its why. -->
