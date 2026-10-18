#!/usr/bin/env bash
# PreToolUse hook — blocks Write/Edit/NotebookEdit to specs/**/*.md
# when skills_activated field is explicitly empty: skills_activated: []
#
# Input: JSON via stdin (same pattern as protect-secrets.sh / protect-immutable.sh)
# Exit 2 = block with message shown to Claude.
# Exit 0 = allow.

set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"

case "$TOOL_NAME" in
  Write|Edit|NotebookEdit) ;;
  *) exit 0 ;;
esac

FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')"

# Only specs/**/*.md files
case "$FILE_PATH" in
  */specs/*.md|*/specs/*/*.md) ;;
  *) exit 0 ;;
esac

CONTENT="$(printf '%s' "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')"
[ -z "$CONTENT" ] && exit 0

# Block only if skills_activated is explicitly set to empty array
if printf '%s' "$CONTENT" | grep -qE '^skills_activated: \[\]'; then
  echo "BLOCKED by validate-skills-activated: $FILE_PATH" >&2
  echo "skills_activated пустой. Вызови Skill tool → заполни [skill1, skill2] → тогда пиши артефакт." >&2
  exit 2
fi

exit 0
