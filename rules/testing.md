---
paths:
  - "**/*.test.{ts,tsx}"
  - "tests/**"
  - "**/lib/**"
---

# Tests

- Vitest, with Testing Library for components and Playwright for end-to-end tests when the repository has them.
- Unit tests sit next to the tested file (`stock.ts` → `stock.test.ts`) unless the repository uses `tests/unit/`.
- Every new or changed rule in a `lib/` module (business rule, game rule, maths, parser) comes with its tests.
  Rules live in pure functions so they can be tested without React.
- Domain code is tested against reference values from an independent source (an ephemeris, a published example),
  not against values the code itself produced.
- Randomness is injected (`random` parameter, seeded in tests); time is injected or faked (`vi.useFakeTimers`).
- A test name describes the expected behavior (`'a discontinued source links to its archive'`).
- Component tests query by role and accessible name, as a user would; `data-testid` only for e2e selectors that
  must not depend on the UI language.
- In e2e tests, never `waitForTimeout`: wait for an observable state.
- Edge cases run on fixtures or temporary copies, never on the real data.
