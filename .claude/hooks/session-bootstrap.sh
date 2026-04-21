#!/usr/bin/env bash
# SessionStart hook — prints a compact status block to additionalContext so
# Claude sees current project state without re-reading CLAUDE.md every turn.
#
# Keep output small (< 2KB). Anything larger belongs in a file Claude reads on demand.

set -euo pipefail

PROJECT_ROOT="/Users/a36/obikhod"
HANDOFF="$PROJECT_ROOT/.claude/memory/handoff.md"
LEARNINGS="$PROJECT_ROOT/.claude/memory/learnings.md"

# Read git state quickly (cheap — no network)
cd "$PROJECT_ROOT" 2>/dev/null || true
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
MODIFIED="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
LAST_COMMIT="$(git log -1 --pretty='%h %s' 2>/dev/null || echo 'no commits')"

{
  echo "## Обиход — статус на старте сессии"
  echo ""
  echo "**Git:** branch \`$BRANCH\` · $MODIFIED изменённых файлов · last: $LAST_COMMIT"
  echo ""
  if [ -s "$HANDOFF" ]; then
    echo "### Handoff с прошлой сессии"
    echo ""
    # First 40 non-empty lines of handoff — enough context without bloat
    grep -v '^$' "$HANDOFF" | head -40
    echo ""
  fi
  if [ -s "$LEARNINGS" ]; then
    echo "### Последние уроки"
    echo ""
    grep -E '^- ' "$LEARNINGS" | tail -10
    echo ""
  fi
  echo "_Источники: .claude/memory/handoff.md, .claude/memory/learnings.md, CLAUDE.md_"
} | jq -Rs '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: .}}'
