---
name: shared-add-shadcn-component
description: Add a shadcn/ui component to the repository (Dialog, Select, Sheet…), split into one component per file. Use when a UI needs a shadcn primitive that is not in the repository's ui/ folder yet.
---

# Add a shadcn/ui component

1. Check the repository's `ui/` folder (path in `components.json`, `aliases.ui`): reuse a component that exists.
2. Run `npx shadcn@latest add <name>`. Offline or blocked: copy the source from the shadcn registry for the
   style in `components.json` (new-york) and the primitives library the repository already uses (`radix-ui` or
   Base UI, see `package.json`).
3. Split the generated file: one component per file, named after it in PascalCase (`Dialog.tsx`,
   `DialogContent.tsx`, `DialogTitle.tsx`…), each an `export function`. Imports between them use the `@/` alias.
4. Apply the React rules: `import React from 'react'` (or `import type React`) and `React.xxx` instead of named
   imports from `'react'`, no `export default`.
5. Remove the variants, sizes and sub-components nothing uses yet.
6. User-facing strings shipped by shadcn (`Close`, `sr-only` labels) are translated to the UI language.
7. Run the repository's checks (`npm run check` or lint, format, typecheck, tests).
