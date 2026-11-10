# General rules

Shared by every repository of the owner. The repository's own `AGENTS.md` describes the product, its layout and
its commands, and wins when it says otherwise.

## Scope and design

- Do what was asked, completely, and nothing more. Keep the smallest working solution: no abstraction without a
  second caller, no option without a user, no speculative feature or "just in case" code.
- When a requirement is ambiguous or two rules conflict, ask instead of guessing.
- Prefer a proven, maintained library to custom code. Every new dependency must be on its latest version.
- Never copy logic that is a little complex: extract a function, hook or component and use it from both places.
  Only trivial code (a few lines with no logic) may be repeated.
- Something used by a single file stays in that file; it moves to a shared module when a second file needs it.
- Remove what nothing uses: dead code, unused exports, options, variants, files.

## Language

- Code, identifiers, comments, commit messages and agent instructions in English.
- User-facing text in the language(s) the repository's `AGENTS.md` names (usually French), with correct
  typography (`’`, non-breaking spaces before `:`, `;`, `!`, `?`), numbers and dates formatted through `Intl`.

## Comments

- Rare, and they explain _why_ (a constraint, a browser quirk, a non-obvious choice), never what the name
  already says. Code that needs a _what_ comment is rewritten.
- `/** */` documents exported functions, types and constants whose purpose is not obvious.

## Naming

- Full words (`settings`, `observation`, `response`, `error`). Standard abbreviations only: `i`, `x`/`y`, `dx`/`dy`,
  `(a, b)` in comparators, `ctx` (canvas or audio context), `id`, `url`, `db`, `t` / `i18n`.
- Booleans `isXxx` / `hasXxx`; module constants `UPPER_SNAKE_CASE`; types and components `PascalCase`.

## Checks

- Formatting and linting are the tools' job (oxfmt, oxlint): run them, never format by hand or argue with them.
- Never disable a lint rule (`eslint-disable`, `oxlint-disable`, `@ts-expect-error`, `@ts-ignore`) to make a
  check pass, in particular `exhaustive-deps`: restructure the code. If a rule really is wrong for the whole
  project, change it in the config with a comment explaining why.
- Before considering a task done, run every check the repository's `AGENTS.md` lists (lint, format, typecheck,
  tests, build) and fix what fails. Report failures you could not fix instead of hiding them.
- Never skip, delete or weaken a test to get green.

## Git

- Small commits with an imperative English message saying what changed and why; Conventional Commits
  (`feat:`, `fix:`, `refactor:`, `docs:`, `ci:`, `chore:`) when the repository uses them.
- Never commit build output (`dist/`), dependencies, `.wrangler/` or secrets (`.env.local`).

## Agent instructions

- When you learn a project rule the hard way (a review comment, a repeated mistake), propose adding one line to
  the repository's `AGENTS.md`. Shared rules (in `.claude/rules/shared/`) are not edited in place: they come from
  the `claude` repository.
