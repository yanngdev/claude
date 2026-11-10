# AGENTS.md

This repository holds the shared rules (`rules/`) and skills (`skills/`) that `scripts/sync.mjs` copies into the
owner's other repositories (`.claude/rules/shared/`, `.claude/skills/shared-*`), plus templates for a new
repository. See [README.md](README.md) (French).

- Rules are in English, short and imperative, one bullet per rule, each with its _why_ when it is not obvious.
- A rule belongs here only if it holds in at least two repositories; anything else stays in that repository's
  `AGENTS.md`.
- Keep `paths:` frontmatter on every rule except `general.md`, so a rule only loads for the files it is about.
- Each rule file stays under ~60 lines: everything loaded at once must remain far below 200 lines.
- Give the _why_ and a concrete example rather than emphasis (capitals, "NEVER"): current models follow
  instructions literally, and emphasis makes them over-apply a rule.
- A rule a linter, formatter or typecheck enforces with the template configs is marked _(lint)_, _(format)_ or
  _(typecheck)_ and kept to one line. Prefer adding a check (config, hook, test) to adding prose.
- A multi-step procedure is a skill (`skills/<name>/SKILL.md`, `name: shared-<name>`), not a rule: it only loads
  when its `description` matches the task.
- `configs/` holds the base oxlint and oxfmt configs every repository extends: a rule goes there only when every
  repository can follow it; a project-specific exception stays in that repository's config, with a comment.
- After changing `scripts/sync.mjs` or the hook, run them against a scratch directory (`--init`, then `--check`).
