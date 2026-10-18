#!/usr/bin/env bash
# UserPromptSubmit hook — injects current datetime into every message context.
set -euo pipefail

NOW="$(date '+%Y-%m-%d %H:%M %Z')"
echo "{\"hookSpecificOutput\":{\"hookEventName\":\"UserPromptSubmit\",\"additionalContext\":\"🕐 $NOW\"}}"
