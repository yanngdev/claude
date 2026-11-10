# General rules

Shared by every repository of the owner. The repository's own `AGENTS.md` describes the product, its layout and
its commands, and wins when it says otherwise.

A rule marked _(lint)_, _(format)_ or _(typecheck)_ is enforced by oxlint, oxfmt or `tsc` with the shared configs:
the tools will tell you, the marker only says why the error exists. The other rules are checked in review.

## Scope and design

- Do what was asked, completely, and nothing more. Keep the smallest working solution: no abstraction without a
  second caller, no option without a user, no speculative feature. Unused flexibility is code to maintain and test.
- When a requirement is ambiguous or two rules conflict, ask instead of guessing.
- Prefer a proven, maintained library to custom code, on its latest version.
- Do not copy logic that is a little complex: extract a function, hook or component and use it from both places,
  so a fix lands everywhere at once. Trivial code (a few lines with no logic) may be repeated.
- Something used by a single file stays in that file; it moves to a shared module when a second file needs it.
- Remove what nothing uses: dead code, unused exports, options, variants, files.

## Language

- Code, identifiers, comments, commit messages and agent instructions in English.
- User-facing text in the language(s) the repository's `AGENTS.md` names (usually French), with correct
  typography (`’`, non-breaking spaces before `:`, `;`, `!`, `?`), numbers and dates formatted through `Intl`.

## Comments

- Rare, and they explain _why_ (a constraint, a browser quirk, a non-obvious choice), not what the name already
  says. Code that needs a _what_ comment is rewritten instead.
- `/** */` documents exported functions, types and constants whose purpose is not obvious.

## Naming

- Full words (`settings`, `observation`, `response`, `error`), so code reads without guessing. Standard
  abbreviations only: `i`, `x`/`y`, `dx`/`dy`, `(a, b)` in comparators, `ctx`, `id`, `url`, `db`, `t` / `i18n`.
- Booleans `isXxx` / `hasXxx`; module constants `UPPER_SNAKE_CASE`; types and components `PascalCase`.

## Checks

- Formatting is the formatter's job: run it, do not format by hand.
- Do not silence a check (`eslint-disable`, `oxlint-disable`, `@ts-expect-error`, `@ts-ignore`), in particular
  `exhaustive-deps`: the warning points at a real bug or a design to restructure. If a rule is wrong for the whole
  project, change it in the config, with a comment explaining why. A repository whose `AGENTS.md` allows a
  justified exception writes it `// oxlint-disable-next-line <rule> -- <why>`. The Claude Code hook rejects any
  other silencer.
- Before considering a task done, run every check the repository's `AGENTS.md` lists (lint, format, typecheck,
  tests, build) and fix what fails. Report what you could not fix, with the output.
- Do not skip, delete or weaken a test to get green: a red test is information.

## Git

- Small commits with an imperative English message saying what changed and why; Conventional Commits
  (`feat:`, `fix:`, `refactor:`, `docs:`, `ci:`, `chore:`) when the repository uses them.
- Do not commit build output (`dist/`), dependencies, `.wrangler/` or secrets (`.env.local`).

## Agent instructions

- When a rule is learned the hard way (a review comment, a repeated mistake), propose one line for the repository's
  `AGENTS.md`, or for the `claude` repository when it holds everywhere.
- The files in `.claude/rules/shared/` and `.claude/skills/shared-*` are copies from the `claude` repository: do
  not edit them in place, the next sync would erase the change.
