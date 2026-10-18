#!/usr/bin/env bash
# Ручной деплой прода из закоммиченного SHA (пока CI-деплой выключен — ADR-0022 / handoff 2026-10-18).
#
# Запуск из корня репо:   deploy/manual-deploy.sh [ref]        (по умолчанию origin/main)
# Берёт код через `git archive <sha> site` — рабочее дерево не используется вообще,
# поэтому незакоммиченные правки на прод не попадут. Ref должен быть в origin/main
# (ALLOW_NON_MAIN=1 — осознанный обход, например для hotfix-ветки).
#
# На сервере: releases/<ts>-<sha7>/ + REVISION, симлинки .env/media из shared/,
# pnpm install + build под deploy, переключение current, pm2 restart, health-check.
# Health-check не прошёл → current возвращается на предыдущий релиз.
#
# Откат вручную: ssh root@<host> 'ln -sfn releases/<prev> /home/deploy/obikhod/current && sudo -u deploy pm2 restart obikhod'

set -euo pipefail

HOST=${DEPLOY_HOST:-root@89.111.141.79}
BASE=/home/deploy/obikhod
REF=${1:-origin/main}

log() { printf '\n== %s ==\n' "$*"; }

log "resolve $REF"
git fetch -q origin
SHA=$(git rev-parse --verify "$REF^{commit}")
if [ "${ALLOW_NON_MAIN:-0}" != "1" ] && ! git merge-base --is-ancestor "$SHA" origin/main; then
  echo "✗ $SHA не входит в origin/main. Смержи PR или запусти с ALLOW_NON_MAIN=1." >&2
  exit 1
fi
REL=$(date +%Y%m%d%H%M%S)-${SHA:0:7}
echo "sha=$SHA  release=$REL"

log "upload"
git archive --format=tar.gz "$SHA" site | ssh "$HOST" "mkdir -p $BASE/releases/$REL && tar -xzf - -C $BASE/releases/$REL --strip-components=1"

log "build on server"
ssh "$HOST" bash -s <<EOF
set -euo pipefail
cd $BASE/releases/$REL
echo "$SHA" > REVISION
ln -sfn $BASE/shared/.env .env
ln -sfn $BASE/shared/media media
chown -R deploy:deploy $BASE/releases/$REL
sudo -u deploy bash -c '
  set -eo pipefail
  export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
  cd $BASE/releases/$REL
  env -u NODE_ENV pnpm install --frozen-lockfile 2>&1 | tail -3
  set -a; . ./.env; set +a
  export NODE_OPTIONS=--max-old-space-size=3072
  pnpm build 2>&1 | tail -5
'
EOF

log "switch + health-check"
ssh "$HOST" bash -s <<EOF
set -euo pipefail
cd $BASE
PREV=\$(readlink current)
ln -sfn releases/$REL current && chown -h deploy:deploy current
sudo -u deploy pm2 restart obikhod >/dev/null
for i in \$(seq 1 30); do
  code=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health/ || true)
  [ "\$code" = "200" ] && break
  sleep 2
done
if [ "\$code" != "200" ]; then
  echo "✗ health-check \$code — откат на \$PREV" >&2
  ln -sfn "\$PREV" current && chown -h deploy:deploy current
  sudo -u deploy pm2 restart obikhod >/dev/null
  exit 1
fi
echo $REL > .last-rel
echo "✓ current → releases/$REL (prev: \$PREV)"
EOF

log "smoke"
for p in / /arboristika/ /kalkulyator/foto-smeta/ /admin/login/ /api/health/; do
  printf '%-28s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://obikhod.ru$p")"
done
