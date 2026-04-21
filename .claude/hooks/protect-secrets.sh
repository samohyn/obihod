#!/usr/bin/env bash
# PreToolUse hook — blocks writes/edits to files that must never be committed.
# Also blocks Reads of those same files (defense in depth against leaking to logs).
# Exit 2 blocks the tool call with the stderr message shown to Claude.

set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')"
COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"

# Patterns of sensitive files. Basenames only so /path/to/.env still matches.
SENSITIVE_BASENAME_RE='^(\.env(\..+)?|.*\.key|.*\.pem|.*\.p12|credentials\.json|service-account.*\.json|secrets\.ya?ml|.*id_rsa.*|.*id_ed25519.*)$'
# Path fragments that indicate secret stores
SENSITIVE_PATH_RE='(^|/)(secrets|\.ssh|\.gnupg)(/|$)'
# Allowlist — examples are fine
ALLOWLIST_RE='\.example$|\.sample$|\.template$'

is_sensitive() {
  local p="$1"
  [ -z "$p" ] && return 1
  local base
  base="$(basename "$p")"
  if [[ "$p" =~ $ALLOWLIST_RE ]]; then return 1; fi
  if [[ "$base" =~ $SENSITIVE_BASENAME_RE ]]; then return 0; fi
  if [[ "$p" =~ $SENSITIVE_PATH_RE ]]; then return 0; fi
  return 1
}

case "$TOOL_NAME" in
  Write|Edit|NotebookEdit|Read)
    if is_sensitive "$FILE_PATH"; then
      echo "BLOCKED by protect-secrets: '$FILE_PATH' matches sensitive pattern." >&2
      echo "If this is a legitimate config, rename to .env.example or ask the operator." >&2
      exit 2
    fi
    ;;
  Bash)
    # Catch attempts to cat/tail/less secrets through the shell
    if printf '%s' "$COMMAND" | grep -E -q '(\.env(\.[a-z]+)?|credentials\.json|id_rsa|id_ed25519)' \
       && printf '%s' "$COMMAND" | grep -E -q '^(cat|less|more|head|tail|bat|xxd|od|strings)\b'; then
      echo "BLOCKED by protect-secrets: command appears to read a secret file." >&2
      echo "Command: $COMMAND" >&2
      exit 2
    fi
    ;;
esac

exit 0
