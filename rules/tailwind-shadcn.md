---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "components.json"
---

# Tailwind CSS v4 and shadcn/ui

- No custom CSS classes. The global stylesheet only holds the Tailwind import, fonts and the theme tokens.
- Tailwind classes are written inline in `className`, never stored in variables, constants or class maps: repeat
  them, or extract a component when the repetition is real. Dynamic classes go through `cn(...)` with conditions
  (`isActive && 'bg-primary'`). Class order is the formatter's job (`sortTailwindcss` in oxfmt).
- Mobile first: the base classes target a phone, `sm:` and up widen. Use logical properties (`ps-*`, `ms-*`,
  `start-*`, `border-s`) rather than `left` / `right`.
- shadcn/ui components live in the repository's `ui/` folder, one component per file, as an `export function`.
  Add one with `npx shadcn@latest add <name>` (or from the shadcn source when offline), then split it and remove
  the variants nothing uses.
- Use theme tokens (`bg-background`, `text-muted-foreground`) rather than raw colors, so light and dark stay
  consistent.
