#!/usr/bin/env bash
# PreToolUse hook for Write/Edit — guards the "immutable" block from CLAUDE.md:
# brand, stack, and anti-TOV vocabulary. Blocks only inside production content
# paths (site/**, content/**, assets/**). Docs and contex/** are untouched so we
# can still quote competitors and anti-patterns in strategy files.
#
# Escape hatch: include "obikhod:ok" anywhere in the new content to bypass.

set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
case "$TOOL_NAME" in
  Write|Edit|NotebookEdit) ;;
  *) exit 0 ;;
esac

FILE_PATH="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty')"
[ -z "$FILE_PATH" ] && exit 0

# Only guard production content paths
case "$FILE_PATH" in
  */site/*|*/content/*|*/assets/*) ;;
  *) exit 0 ;;
esac

# Skip tests and stories — quoting anti-patterns in them is legit
case "$FILE_PATH" in
  *.test.*|*.spec.*|*/__tests__/*|*.stories.*) exit 0 ;;
esac

# Pull the incoming content (Write: content; Edit: new_string)
CONTENT="$(printf '%s' "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')"
[ -z "$CONTENT" ] && exit 0

# Escape hatch
if printf '%s' "$CONTENT" | grep -q 'obikhod:ok'; then
  exit 0
fi

# Forbidden CMS/stack mentions (per CLAUDE.md: never suggest these)
FORBIDDEN_STACK='Тильд[аеуы]|Tilda|Битрикс|Bitrix|WordPress|Joomla|\bMODX\b'
# Anti-TOV vocabulary (per contex/03_brand_naming.md)
ANTI_TOV='услуги населению|имеем честь|от 1[[:space:]\xa0]*000[[:space:]\xa0]*₽|в кратчайшие сроки|индивидуальный подход'

violations=()
if printf '%s' "$CONTENT" | grep -E -iq "$FORBIDDEN_STACK"; then
  hit="$(printf '%s' "$CONTENT" | grep -E -io "$FORBIDDEN_STACK" | head -3 | paste -sd', ' -)"
  violations+=("forbidden stack/CMS: $hit")
fi
if printf '%s' "$CONTENT" | grep -E -iq "$ANTI_TOV"; then
  hit="$(printf '%s' "$CONTENT" | grep -E -io "$ANTI_TOV" | head -3 | paste -sd', ' -)"
  violations+=("anti-TOV phrase: $hit")
fi

if [ ${#violations[@]} -gt 0 ]; then
  {
    echo "BLOCKED by protect-immutable: $FILE_PATH"
    for v in "${violations[@]}"; do echo "  - $v"; done
    echo "CLAUDE.md immutable block: do not ship these in production content."
    echo "If this is an intentional quote/comparison, add 'obikhod:ok' to the content."
  } >&2
  exit 2
fi

exit 0
