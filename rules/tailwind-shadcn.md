---
paths:
  - "**/*.tsx"
  - "**/*.css"
  - "components.json"
---

# Tailwind CSS v4 and shadcn/ui

- No custom CSS classes. The global stylesheet only holds the Tailwind import, fonts and the theme tokens.
- Tailwind classes are written inline in `className`, not stored in variables, constants or class maps: the
  formatter sorts them only there (`sortTailwindcss`) and the reader sees the style where it applies. Repeat them,
  or extract a component when the repetition is real. Dynamic classes go through `cn(...)` with conditions
  (`cn('rounded-md', isActive && 'bg-primary')`).
- Mobile first: the base classes target a phone, `sm:` and up widen. Use logical properties (`ps-*`, `ms-*`,
  `start-*`, `border-s`) rather than `left` / `right`, so a right-to-left language works unchanged.
- Use theme tokens (`bg-background`, `text-muted-foreground`) rather than raw colors, so the theme stays consistent.
- shadcn/ui components live in the repository's `ui/` folder, one component per file. To add one, follow the
  `shared-add-shadcn-component` skill.
