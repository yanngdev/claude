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
  Keep rules in pure functions so they are tested without React.
- Domain code is tested against reference values from an independent source (an ephemeris, a published example),
  not values the code itself produced: those only prove the code agrees with itself.
- Randomness is injected (`random` parameter, seeded in tests); time is injected or faked (`vi.useFakeTimers`).
- A test name describes the expected behavior (`'a discontinued source links to its archive'`).
- Component tests query by role and accessible name, as a user would; `data-testid` only for e2e selectors that
  must not depend on the UI language.
- In e2e tests, wait for an observable state (`expect(...).toBeVisible()`, `toPass`), not `waitForTimeout`, which
  is slow and flaky.
- Edge cases run on fixtures or temporary copies, not on the real data.
