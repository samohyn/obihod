#!/usr/bin/env bash
# Git auto-sync hook
#
# Modes:
#   pull  — fetch origin, ff-pull if working tree clean and current branch behind
#   push  — push current branch if ahead>0, has upstream, and branch != main
#
# Safety:
#   - Никогда не пушит main (защита prod-деплоя на push main)
#   - Никогда не делает non-ff merge или rebase
#   - Молчит если нет remote / нет upstream / detached HEAD
#   - Логирует одну строку в .claude/memory/logs/autosync.log
#
# Vars:
#   CLAUDE_PROJECT_DIR — задаётся хуковой машинкой
#
# Usage:
#   git-autosync.sh pull
#   git-autosync.sh push

set -uo pipefail

MODE="${1:-pull}"
ROOT="${CLAUDE_PROJECT_DIR:-/Users/a36/obikhod}"
LOG_DIR="$ROOT/.claude/memory/logs"
LOG="$LOG_DIR/autosync.log"
mkdir -p "$LOG_DIR"

cd "$ROOT" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

ts() { date '+%Y-%m-%d %H:%M:%S'; }
log() { echo "[$(ts)] $MODE: $*" >>"$LOG"; }

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
[ "$BRANCH" = "HEAD" ] && { log "detached HEAD, skip"; exit 0; }

UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

case "$MODE" in
  pull)
    git fetch --all --prune --quiet 2>>"$LOG" || { log "fetch failed"; exit 0; }
    [ -z "$UPSTREAM" ] && { log "no upstream for $BRANCH, skip pull"; exit 0; }

    BEHIND="$(git rev-list --count "HEAD..$UPSTREAM" 2>/dev/null || echo 0)"
    [ "$BEHIND" = "0" ] && { log "$BRANCH up-to-date with $UPSTREAM"; exit 0; }

    # Working tree должен быть чист по tracked файлам — иначе pull может задеть локальные правки
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
      log "$BRANCH behind $BEHIND but working tree dirty — manual pull required"
      exit 0
    fi

    if git pull --ff-only --quiet 2>>"$LOG"; then
      log "$BRANCH ff-pulled $BEHIND commits from $UPSTREAM"
    else
      log "$BRANCH ff-pull failed (likely diverged) — manual merge required"
    fi
    ;;

  push)
    [ -z "$UPSTREAM" ] && { log "no upstream for $BRANCH, skip push"; exit 0; }
    [ "$BRANCH" = "main" ] && { log "refusing auto-push to main"; exit 0; }

    AHEAD="$(git rev-list --count "$UPSTREAM..HEAD" 2>/dev/null || echo 0)"
    [ "$AHEAD" = "0" ] && exit 0

    if git push --quiet 2>>"$LOG"; then
      log "$BRANCH pushed $AHEAD commits to $UPSTREAM"
    else
      log "$BRANCH push failed"
    fi
    ;;

  *)
    log "unknown mode: $MODE"
    exit 0
    ;;
esac

exit 0
