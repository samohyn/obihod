#!/usr/bin/env bash
# Ручной деплой прода из закоммиченного SHA.
#
# Запуск из корня репо:   deploy/manual-deploy.sh [ref] [staging]   (ref по умолчанию origin/main)
# Код берётся через `git archive <sha> site` — рабочее дерево не используется вообще,
# поэтому незакоммиченные правки на прод не попадут. Для прода ref должен быть в origin/main
# (ALLOW_NON_MAIN=1 — осознанный обход, например для hotfix-ветки); на staging — любая ветка
# (https://staging.obikhod.ru, пароль у владельца; данные — obikhod-staging-refresh).
#
# Вся серверная логика — в /usr/local/sbin/obikhod-deploy (deploy/server/obikhod-deploy.sh):
# бэкап, сборка, переключение, health-check с откатом, чистка релизов. Её же вызывает
# GitHub Actions (.github/workflows/deploy.yml). Этот скрипт перед выкаткой ставит на сервер
# версию obikhod-deploy из того же коммита.
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

git archive --format=tar.gz "$SHA" site | $SSH "$HOST" "obikhod-deploy $SHA $TARGET"

[ "$TARGET" = prod ] || exit 0
log "smoke"
for p in / /arboristika/ /kalkulyator/foto-smeta/ /admin/login/ /api/health/; do
  printf '%-28s %s\n' "$p" "$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' "https://obikhod.ru$p")"
done
