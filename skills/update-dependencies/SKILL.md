---
name: shared-update-dependencies
description: Update every npm dependency to its latest version and fix what breaks. Use when asked to upgrade or refresh dependencies, or when a dependency check (deps:fresh, ncu) fails.
---

# Update dependencies

1. List what is outdated: `npx npm-check-updates` (with `--workspaces --root` in an npm workspace).
2. Read the changelog or release notes of every major version bump before upgrading it; note breaking changes.
3. Upgrade: the repository's script (`npm run deps:update`, `npm run upgrade`) or `npx npm-check-updates -u`
   then `npm install`. Keep exact versions if `.npmrc` has `save-exact=true`.
4. Run the repository's checks and the build. Fix breakages in the code, following the migration guides; do not
   pin an old version to avoid the work unless the new one is broken (then say why in the commit message).
5. If the repository has `npm run deps:fresh`, run it: every dependency must be latest and published this year.
   A dependency that fails only because it is not maintained any more is reported, with a maintained alternative.
6. One commit: `chore: update dependencies`, listing the major bumps and what changed for them.
