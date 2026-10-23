#!/usr/bin/env bash
# Ручная выкатка ветки на staging или main на прод.
#
# Запуск из корня репо:   deploy/manual-deploy.sh [ветка] [staging]   (по умолчанию origin/main)
#
# Ставит на сервер obikhod-deploy из того же коммита и запускает сборку в GitHub Actions
# (.github/workflows/deploy.yml, workflow_dispatch): компиляция там, на сервере — только генерация
# страниц из базы. Ветка должна быть запушена; выкатывается её последний коммит в origin.
# Для прода — только main (ALLOW_NON_MAIN=1 работает лишь со сборкой на сервере).
#
# BUILD_ON_SERVER=1 — прежний путь (запасной, если GitHub недоступен): `git archive <sha> site`
# прямо на сервер и полная сборка там; ref тогда — любая ветка или SHA, рабочее дерево не
# используется. Staging — https://staging.obikhod.ru (пароль у владельца; данные —
# obikhod-staging-refresh).
#
# Вся серверная логика — в /usr/local/sbin/obikhod-deploy (deploy/server/obikhod-deploy.sh):
# бэкап, миграции, сборка, переключение, health-check с откатом, чистка релизов.
#
# Откат вручную: ssh root@<host> 'ln -sfn releases/<prev> /home/deploy/obikhod/current && sudo -u deploy pm2 restart obikhod'

set -euo pipefail

HOST=${DEPLOY_HOST:-root@89.111.141.79}
REF=${1:-origin/main}
TARGET=${2:-prod}
[ "$TARGET" = prod ] || [ "$TARGET" = staging ] || { echo "✗ цель: prod или staging" >&2; exit 1; }
# Таймауты: 19.10.2026 скрипт повис после переключения релиза (ssh/curl без таймаута при
# нестабильном канале) — релиз встал, но скрипт не вернулся.
SSH="ssh -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=4"

log() { printf '\n== %s ==\n' "$*"; }

log "resolve $REF"
git fetch -q origin
SHA=$(git rev-parse --verify "$REF^{commit}")
if [ "$TARGET" = prod ] && [ "${ALLOW_NON_MAIN:-0}" != "1" ] && ! git merge-base --is-ancestor "$SHA" origin/main; then
  echo "✗ $SHA не входит в origin/main. Смержи PR или запусти с ALLOW_NON_MAIN=1." >&2
  exit 1
fi
echo "sha=$SHA → $TARGET"

log "install obikhod-deploy from $SHA"
git show "$SHA:deploy/server/obikhod-deploy.sh" | $SSH "$HOST" 'install -m 0750 /dev/stdin /usr/local/sbin/obikhod-deploy'

if [ "${BUILD_ON_SERVER:-0}" = "1" ]; then
  git archive --format=tar.gz "$SHA" site | $SSH "$HOST" "obikhod-deploy $SHA $TARGET"
else
  GH=${GH:-$(command -v gh || echo "$HOME/.local/bin/gh")}
  BRANCH=${REF#origin/}
  REMOTE=$(git ls-remote origin "refs/heads/$BRANCH" | cut -f1)
  [ -n "$REMOTE" ] || { echo "✗ $BRANCH нет в origin — запушьте ветку (или BUILD_ON_SERVER=1 для SHA)" >&2; exit 1; }
  [ "$REMOTE" = "$SHA" ] || { echo "✗ $REF ($SHA) не совпадает с origin/$BRANCH ($REMOTE) — запушьте ветку" >&2; exit 1; }
  log "build in GitHub Actions: $BRANCH → $TARGET"
  SINCE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  "$GH" workflow run deploy.yml --ref "$BRANCH" -f target="$TARGET"
  RUN=""
  for _ in $(seq 1 30); do
    RUN=$("$GH" run list --workflow deploy.yml --branch "$BRANCH" --event workflow_dispatch --limit 5 \
      --json databaseId,createdAt --jq "[.[] | select(.createdAt >= \"$SINCE\")][0].databaseId // empty")
    [ -n "$RUN" ] && break
    sleep 4
  done
  [ -n "$RUN" ] || { echo "✗ запуск workflow не появился — смотрите Actions" >&2; exit 1; }
  echo "run $RUN — $("$GH" run view "$RUN" --json url --jq .url)"
  "$GH" run watch "$RUN" --exit-status --interval 15 >/dev/null || {
    "$GH" run view "$RUN" --log-failed | tail -40
    exit 1
  }
  $SSH "$HOST" "readlink /home/deploy/obikhod$([ "$TARGET" = staging ] && echo -staging)/current"
fi

[ "$TARGET" = prod ] || exit 0
log "smoke"
for p in / /arboristika/ /kalkulyator/foto-smeta/ /admin/login/ /api/health/; do
  printf '%-28s %s\n' "$p" "$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' "https://obikhod.ru$p")"
done
