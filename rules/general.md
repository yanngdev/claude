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
- Do not copy logic that is a little complex: extract it and use it from both places, so a fix lands everywhere at
  once. Trivial code (a few lines with no logic) may be repeated.
- Something used by a single file stays in that file; it moves to a shared module when a second file needs it.
- Remove what nothing uses: dead code, unused exports, options, variants, files.

## Language

- Code, identifiers, comments, commit messages and agent instructions in English.
- User-facing text in the language(s) the repository's `AGENTS.md` names (usually French), with correct
  typography (`’`, non-breaking spaces before `:`, `;`, `!`, `?`), numbers and dates formatted through `Intl`.

## Comments

- Rare, and they explain _why_ (a constraint, a browser quirk), not what the name says; code that needs a _what_
  comment is rewritten.
- `/** */` documents exported functions, types and constants whose purpose is not obvious.

## Naming

- Full words (`settings`, `response`, `error`); standard abbreviations only: `i`, `x`/`y`, `dx`/`dy`, `(a, b)` in
  comparators, `ctx`, `id`, `url`, `db`, `t` / `i18n`.
- Booleans `isXxx` / `hasXxx`; module constants `UPPER_SNAKE_CASE`; types and components `PascalCase`.

## Checks

- oxfmt owns formatting (quotes, semicolons, width, trailing commas, import and Tailwind class order) and the hook
  runs it after every edit. Do not reformat, re-read or hand-fix layout; act only when `format:check` or the hook
  reports an error, then run `oxfmt` on the file. Fighting the tool by hand only costs tokens.
- Do not silence a check (`eslint-disable`, `oxlint-disable`, `@ts-expect-error`, `@ts-ignore`), in particular
  `exhaustive-deps`: the warning points at a real bug or a design to restructure. If a rule is wrong for the whole
  project, change it in the config, with a comment explaining why. A repository whose `AGENTS.md` allows a
  justified exception writes it `// oxlint-disable-next-line <rule> -- <why>`. The Claude Code hook rejects any
  other silencer.
- Before considering a task done, run every check the repository's `AGENTS.md` lists (lint, format, typecheck,
  tests, build) and fix what fails. Report what you could not fix, with the output.
- Do not skip, delete or weaken a test to get green.

## Shell output (rtk)

- Where rtk is installed (`rtk gain` works), its hook compacts shell output: run commands as usual, without typing
  `rtk`. When the compact output hides what you need, rerun with `rtk bypass <command>`; a cut output names where
  the full one is. Set rtk up only when asked (skill `shared-setup-rtk`).

## Git

- Small commits with an imperative English message saying what changed and why; Conventional Commits
  (`feat:`, `fix:`, `refactor:`, `docs:`, `ci:`, `chore:`) when the repository uses them.
- Do not commit build output (`dist/`), dependencies, `.wrangler/` or secrets (`.env.local`).

## Agent instructions

- A rule learned the hard way (a review comment, a repeated mistake): propose one line for the repository's
  `AGENTS.md`, or for the `claude` repository when it holds everywhere.
- `.claude/rules/shared/` and `.claude/skills/shared-*` are copies from the `claude` repository: do not edit them
  in place, the next sync would erase the change.
