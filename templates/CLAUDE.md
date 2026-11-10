# Claude Code

The rules for every coding agent live in [AGENTS.md](AGENTS.md): read and follow them.

@AGENTS.md

Shared rules (general, TypeScript, React…) are in `.claude/rules/shared/` and load automatically,
some only when you touch matching files. They come from the `yanngdev/claude` repository: do not
edit them here.

Claude Code hooks (`.claude/settings.json`) format and lint every file you edit; fix the reported
lint errors before moving on.
