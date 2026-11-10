---
paths:
  - "**/*.tsx"
---

# React

## Files

- One component per file, named after it (`SourceItem.tsx` exports `SourceItem`) _(lint)_, shadcn components
  included: a shadcn file exporting several components is split (`Dialog.tsx`, `DialogContent.tsx`, …). A file
  name then finds its component, and the other way round.
- One hook per file, named after it (`useLanguage.ts`).
- Components are `function` declarations. A single prop may be typed inline; otherwise an `interface Props`
  right above the component, destructured in the signature. `type` only for intersections.

## React API

- Go through the `React` object: `import React from 'react'`, then `React.useState`, `React.ComponentProps<…>`,
  `React.ReactNode` (`import type React from 'react'` when only types are used). No named imports from `'react'`
  _(lint)_: one import line per file, and hooks are easy to spot. (`import * as React` is flagged by the same lint
  rule, so it is not used either.)
- List every hook dependency _(lint)_. When that is inconvenient, restructure: derive the value during render,
  memoize with `React.useMemo`, keep the latest handler in a ref (see a `useLatest` / `useKeyDown` hook), read
  non-reactive state through a getter, create and dispose a resource in the same effect.
- Load data with the repository's data layer (TanStack Query), not `useEffect` + `useState`, which loses caching,
  retries and race handling. Do not `setState` in an effect to mirror props: derive the value.
- `useCallback` / `useMemo` only when the reference matters (an effect dependency, a memoized child, a costly
  computation), not by default.

## Component body

- Order: hooks and derived values, then handlers, then `React.useEffect` calls (and hooks wrapping effects) last,
  then a blank line and the `return`. Effects at the end read as "what happens after render".
- What does not depend on props, state or hooks goes to module level: constants, config objects, static data, pure
  helpers. No magic numbers in a component: name them (`const ALTITUDE = 2.5;`).
- A component receives the minimum it needs (`sources`, not the whole data set), so it re-renders less and is
  easier to test.
- Callback props are named after the event: `onSelect`, `onChange`, `onClose`, `onOpenChange(open)`.
- Prefer composition (`children`, small assembled components) to boolean flag props: each flag doubles the
  states to test.
- No comments inside JSX and none on props: a _why_ goes above the component or the statement it explains.

## Accessibility

- Every icon-only button has an accessible name (`aria-label`, in the UI language); dialogs have a title and a
  description. Prefer a semantic element (`<button>`, `<output>`, `<section>`) to a `role=`.
- No native `alert` / `confirm` / `prompt`, which block the page and cannot be styled: use a dialog component.
