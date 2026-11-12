# AGENTS.md

<!-- Keep this file short (well under 200 lines): only what an agent cannot guess from the code.
     Generic rules belong in the shared rules, not here. -->

Shared rules for every repository are in [.claude/rules/shared/](.claude/rules/shared/) (general rules,
then one file per language or technology, each listing in `paths:` the files it is about) and shared
procedures in `.claude/skills/shared-*/SKILL.md`. Read the rules matching the files you touch. This file
wins when it says otherwise.

## Product

<!-- What the app is, who uses it, the language of the UI, hard constraints (offline, no backend…). -->

## Commands

| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Development server                   |
| `npm run check`  | Lint, format check, typecheck, tests |
| `npm run build`  | Production build                     |

Run `npm run check` and `npm run build` before considering a task done. oxfmt owns formatting: do not reformat
by hand, only run `npm run format` when `npm run check` reports a formatting error.

## Layout

<!-- The folders and what goes where, with one real example per folder. -->

## Project rules

<!-- Only rules specific to this repository, each with its why and a real example
     (`see features/sky/lib/useSatelliteFeed.ts`). A rule a linter or a test can check goes
     there instead. A repeated multi-step procedure becomes a skill in .claude/skills/. -->
