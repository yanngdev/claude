---
paths:
  - "**/*.tsx"
---

# React

## Files

- Exactly one component per file, the file named after it (`SourceItem.tsx` exports `SourceItem`), shadcn
  components included: a shadcn file exporting several components is split (`Dialog.tsx`, `DialogContent.tsx`, …).
- One hook per file, named after it (`useLanguage.ts`).
- Components are `function` declarations. Props: a single prop may be typed inline; otherwise an `interface Props`
  (or `<Component>Props`) right above the component, destructured in the signature. `type` only for intersections.

## React API

- Use the namespace: `import * as React from 'react'` then `React.useState`, `React.useEffect`,
  `React.ComponentProps<…>`, `React.ReactNode` (`import type * as React` when only types are used). Never named
  imports from `'react'`.
- List every hook dependency. When that is inconvenient, restructure: memoize with `React.useMemo`, keep the latest
  handler in a ref, read non-reactive state through a getter, create and dispose a resource in the same effect.
- No `useEffect` + `useState` to load data: use the repository's data layer (TanStack Query) or derive the value
  during render. No `setState` in an effect to mirror props.
- `useCallback` / `useMemo` only when the reference matters (an effect dependency, a memoized child, a costly
  computation), not by default.

## Component body

- Order: hooks and derived values, then handlers, then `React.useEffect` calls (and hooks wrapping effects) last,
  then a blank line and the `return`.
- Everything that does not depend on props, state or hooks goes to module level: constants, config objects,
  static data, pure helpers. No magic numbers in a component: name them.
- A component receives the minimum it needs (`sources`, not the whole data set).
- Callback props are named after the event: `onSelect`, `onChange`, `onClose`, `onOpenChange(open)`; handlers
  inside a component `handleXxx` or `onXxx`, as the repository already does.
- Prefer composition (`children`, small assembled components) to boolean flag props.
- No comments inside JSX and none on props: a _why_ goes above the component or the statement it explains.

## Accessibility

- Every icon-only button has an accessible name (`aria-label`, in the UI language); dialogs have a title and a
  description. Prefer a semantic element (`<button>`, `<output>`, `<section>`) to a `role=`.
- No native `alert` / `confirm` / `prompt`: use a dialog component.
