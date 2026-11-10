---
name: shared-setup-rtk
description: Install rtk (Rust Token Killer, github.com/rtk-ai/rtk) and its Claude Code hook, on the local machine or in a Claude Code cloud environment. Use when asked to set up rtk, or to set up a new machine or cloud environment for the owner's repositories.
---

# Set up rtk

rtk compresses the output of shell commands (tests, git, builds, lint) before the agent reads it: its Claude Code
hook rewrites `git status` into `rtk git status`. The hook is registered in the user settings
(`~/.claude/settings.json`), not in a repository: it is set up once per machine or cloud environment.

1. Check: `rtk gain` prints a savings summary when rtk is installed. `command not found`, or an error from
   another `rtk` (Rust Type Kit, same crate name), means it is missing: never install it with `cargo install rtk`.
2. Local machine (macOS or Linux), as the user, not root:
   - with Homebrew: `brew install rtk`;
   - otherwise: `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh`, which
     installs `~/.local/bin/rtk` after checking its SHA-256: `~/.local/bin` must be on the `PATH`.

   Then `rtk init -g`, and answer no to telemetry. Restart Claude Code.

3. Claude Code cloud environment: the setup script of the environment installs it before each new session (it runs
   as root, so the binary goes to `/usr/local/bin`, on every `PATH`). Add these lines to the script, or propose them
   with the environment tools, after running them once in the session:

   ```sh
   if ! rtk gain >/dev/null 2>&1; then
     curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | RTK_INSTALL_DIR=/usr/local/bin sh
   fi
   rtk init -g </dev/null
   ```

   `</dev/null` answers the prompts with their default (no telemetry). The download needs `raw.githubusercontent.com`,
   `github.com` and the GitHub release asset hosts: if the environment's network blocks them, ask for these hosts.
   A session already running only gets the hook from the next one.

4. Verify in a new session: run `git status`, then `rtk gain`: the command is counted.
5. To remove it: `rtk init -g --uninstall`.
