# Claude Code

The rules for every coding agent live in [AGENTS.md](AGENTS.md): read and follow them.

@AGENTS.md

Shared rules (`.claude/rules/shared/`) load automatically, some only when you touch matching files;
shared skills are `.claude/skills/shared-*`. Both come from the `yanngdev/claude` repository: do
not edit them here.

The Claude Code hook (`.claude/settings.json`) formats and lints every file you edit and rejects
comments that silence a check; fix what it reports before moving on.
