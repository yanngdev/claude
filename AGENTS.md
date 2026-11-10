# AGENTS.md

This repository holds the shared rules that `scripts/sync.mjs` copies into the owner's other repositories
(`.claude/rules/shared/`), plus templates for a new repository. See [README.md](README.md) (French).

- Rules are in English, short and imperative, one bullet per rule, each with its _why_ when it is not obvious.
- A rule belongs here only if it holds in at least two repositories; anything else stays in that repository's
  `AGENTS.md`.
- Keep `paths:` frontmatter on every rule except `general.md`, so a rule only loads for the files it is about.
- Each rule file stays under ~60 lines: everything loaded at once must remain far below 200 lines.
- Do not repeat what a linter or formatter enforces unless the reason matters to the agent.
- After changing `scripts/sync.mjs`, run it against a scratch directory with `--init`, then `--check`.
