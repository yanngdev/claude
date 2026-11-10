---
paths:
  - "**/*.{ts,tsx,mts,cts}"
---

# TypeScript

## Compiler

- `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`.
  An indexed access may be `undefined`: handle it, do not hide it with `!` (tolerated in tests only).
- `verbatimModuleSyntax`: `import type` (or `type X` inside the import) for anything that is only a type.
- `erasableSyntaxOnly`: no `enum`, `namespace` or constructor parameter properties. An enumeration is a union of
  string literals, or an `as const` array with its derived type.
- No `any`. Use `unknown` and narrow it.

## Data and errors

- External data (JSON files, HTTP responses, storage, user input, YAML/CSV) is validated with a schema (Valibot)
  before use, and its type is inferred from the schema (`v.InferOutput`), never written twice. Never `as` on
  unvalidated data.
- Throw `Error` instances (or subclasses), never literals. An expected failure is a return value, not an exception.

## Functions

- Up to three positional parameters. Beyond that, or with several optional ones, the rest goes in a destructured
  options object typed by a named interface, with defaults in the destructuring.
- Parameter order: context first (`db`, `i18n`, `settings`), then the processed object, then the rest.
- A function that does two things, or grows past ~30 lines, is split into named functions.
- Everything that does not depend on the call (constants, regexes, pure helpers) is declared at module level.

## Modules

- Named exports only. `export default` only where a tool requires it (`vite.config.ts`, `vitest.config.ts`,
  `playwright.config.ts`, a Worker entry). For `React.lazy`, map the named export:
  `React.lazy(() => import('./SkyPage').then((module) => ({ default: module.SkyPage })))`.
- Imports leaving the current folder use the `@/` alias (or the workspace package name); only same-folder imports
  use `./`. Never `../`.
- An export used only inside its own file is not exported.
- `lib/` modules have no React; their file names are `camelCase` or `kebab-case`, as the repository already does.

## Style

- Always braces for `if` / `else` / loops, even for one statement; a guard clause is
  `if (!x) {\n  return;\n}`.
- A blank line before every `return`, unless it is the first statement of its block.
- `===` only; `const` by default, `let` when reassigned, never `var`.
