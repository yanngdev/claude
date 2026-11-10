---
paths:
  - "**/*.{ts,tsx,mts,cts}"
---

# TypeScript

## Compiler _(typecheck)_

- `strict` and `noUncheckedIndexedAccess`: an indexed access may be `undefined`. Handle it (guard, default,
  `.at()` + check) rather than asserting it away with `!`, which only moves the crash to runtime. `!` is fine in
  tests.
- `verbatimModuleSyntax`: `import type` for anything that is only a type.
- `erasableSyntaxOnly`: no `enum`, `namespace` or constructor parameter properties, so Node can run the code by
  stripping types. An enumeration is a union of string literals, or an `as const` array and its derived type:
  `const LAYERS = ['stars', 'planets'] as const; type Layer = (typeof LAYERS)[number];`
- No `any` _(lint)_: use `unknown` and narrow it.

## Data and errors

- External data (JSON files, HTTP responses, storage, user input, YAML/CSV) is validated with a Valibot schema
  before use, and its type is inferred from the schema (`v.InferOutput<typeof Schema>`), not written twice. `as` on
  unvalidated data hides exactly the bugs the schema would catch.
- Throw `Error` instances (or subclasses), not literals, to keep stack traces. An expected failure (a missing
  file, an invalid form) is a return value, not an exception.

## Functions

- Up to three positional parameters. Beyond that, or with several optional ones, the rest goes in a destructured
  options object typed by a named interface, with defaults in the destructuring:
  `loadCsv(file, schema, { header = true }: LoadCsvOptions = {})`.
- Parameter order: context first (`db`, `i18n`, `settings`), then the processed object, then the rest.
- A function that does two things, or grows past ~30 lines, is split into named functions.
- What does not depend on the call (constants, regexes, pure helpers) is declared at module level, so it is
  created once and testable alone.

## Modules

- Named exports only _(lint)_: they keep one name across the codebase and make renames safe. `export default` only
  where a tool requires it (`vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, a Worker entry). For
  `React.lazy`: `React.lazy(() => import('./SkyPage').then((module) => ({ default: module.SkyPage })))`.
- Imports leaving the current folder use the `@/` alias (or the workspace package name); only same-folder imports
  use `./`. No `../` _(lint)_, so a file can move without rewriting its imports.
- An export used only inside its own file is not exported.
- Rules, maths and parsing live in pure functions outside components and hooks, so they are tested without
  rendering.

## Style

- Braces for every `if` / `else` / loop _(lint)_; a guard clause is `if (!x) {\n  return;\n}`.
- A blank line before every `return`, unless it is the first statement of its block.
- `===` _(lint)_; `const` by default, `let` only when reassigned _(lint)_.
