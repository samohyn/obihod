#!/usr/bin/env bash
# PreToolUse hook for Bash — blocks a narrow set of irreversible destructive ops.
# Intentionally conservative: only catches clearly dangerous patterns, not merely
# "risky" ones. CLAUDE.md guidance handles the softer cases.

set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
[ "$TOOL_NAME" != "Bash" ] && exit 0

CMD="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"
[ -z "$CMD" ] && exit 0

block() {
  echo "BLOCKED by block-dangerous-bash: $1" >&2
  echo "Command: $CMD" >&2
  echo "If intentional, run it yourself in a terminal." >&2
  exit 2
}

# 1. rm -rf targeting root, home, or the project tree wholesale
if printf '%s' "$CMD" | grep -E -q 'rm[[:space:]]+(-[a-zA-Z]*[rRf][a-zA-Z]*[[:space:]]+)+(/|~|\$HOME|\*)([[:space:]]|$)'; then
  block "rm -rf against root/home/glob"
fi
if printf '%s' "$CMD" | grep -E -q 'rm[[:space:]]+-rf?[[:space:]]+/Users/a36/obikhod([[:space:]]|$|/$)'; then
  block "rm -rf against the project root"
fi

# 2. git force push to main/master
if printf '%s' "$CMD" | grep -E -q 'git[[:space:]]+push.*(-f\b|--force(-with-lease)?)'; then
  if printf '%s' "$CMD" | grep -E -q '(origin[[:space:]]+(main|master)|[[:space:]](main|master)$|:refs/heads/(main|master))'; then
    block "git force push to main/master"
  fi
fi

# 3. git reset --hard / git clean -fd with no path (nukes uncommitted work)
if printf '%s' "$CMD" | grep -E -q 'git[[:space:]]+reset[[:space:]]+--hard([[:space:]]|$)'; then
  block "git reset --hard can discard uncommitted work"
fi
if printf '%s' "$CMD" | grep -E -q 'git[[:space:]]+clean[[:space:]]+-[a-zA-Z]*f'; then
  block "git clean -f deletes untracked files"
fi

# 4. Dropping databases (production shape — belt and braces)
if printf '%s' "$CMD" | grep -E -iq '(DROP[[:space:]]+(DATABASE|SCHEMA|TABLE)|TRUNCATE[[:space:]]+TABLE)'; then
  block "SQL DDL that destroys data"
fi

# 5. Skipping hooks/signing flags — CLAUDE.md bans these
if printf '%s' "$CMD" | grep -E -q '(--no-verify|--no-gpg-sign)'; then
  block "skipping git hooks/signing is not allowed"
fi

exit 0
