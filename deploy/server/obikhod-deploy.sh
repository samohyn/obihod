#!/usr/bin/env bash
# Выкатка релиза на сервере — единая логика для ручного деплоя и GitHub Actions (план 09, этап 1).
#
#   git archive --format=tar.gz <sha> site | ssh root@<host> obikhod-deploy <sha>
#
# Из GitHub Actions — ключом с forced command в /root/.ssh/authorized_keys:
#   command="/usr/local/sbin/obikhod-deploy --from-ssh",restrict ssh-ed25519 AAAA… github-actions-deploy
# тогда <sha> берётся из SSH_ORIGINAL_COMMAND вида «deploy <40 hex>», другие команды отклоняются.
#
# Шаги: бэкап (obikhod-backup --tag pre-deploy-<sha7>) → распаковка в releases/<ts>-<sha7> →
# симлинки .env и media → pnpm install + build под deploy → переключение current → pm2 restart →
# health-check (не 200 за 60 с — откат на предыдущий релиз) → чистка, остаётся KEEP_RELEASES.
# Миграции БД сюда не входят: применяются psql до выкатки (ADR-0016).

set -euo pipefail

BASE=/home/deploy/obikhod
KEEP_RELEASES=5

if [ "${1:-}" = "--from-ssh" ]; then
  read -r CMD SHA EXTRA <<< "${SSH_ORIGINAL_COMMAND:-}" || true
  [ "${CMD:-}" = deploy ] && [ -z "${EXTRA:-}" ] || { echo "✗ разрешена только команда: deploy <sha>" >&2; exit 2; }
else
  SHA=${1:-}
fi
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "✗ нужен полный SHA коммита (40 hex), получено: '${SHA}'" >&2; exit 2; }

exec 9>/run/obikhod-deploy.lock
flock -n 9 || { echo "✗ уже идёт другая выкатка" >&2; exit 3; }

log() { printf '\n== %s ==\n' "$*"; }
REL=$(date +%Y%m%d%H%M%S)-${SHA:0:7}

log "backup before deploy"
if command -v obikhod-backup >/dev/null; then
  obikhod-backup --tag "pre-deploy-${SHA:0:7}" </dev/null
else
  echo "⚠ obikhod-backup не установлен (deploy/backup/install.sh)"
fi

log "unpack $REL"
mkdir -p "$BASE/releases/$REL"
tar -xzf - -C "$BASE/releases/$REL" --strip-components=1
cd "$BASE/releases/$REL"
echo "$SHA" > REVISION
ln -sfn "$BASE/shared/.env" .env
ln -sfn "$BASE/shared/media" media
chown -R deploy:deploy "$BASE/releases/$REL"

log "build"
sudo -u deploy bash -c '
  set -eo pipefail
  export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
  env -u NODE_ENV pnpm install --frozen-lockfile 2>&1 | tail -3
  set -a; . ./.env; set +a
  export NODE_OPTIONS=--max-old-space-size=3072
  pnpm build 2>&1 | tail -5
' </dev/null

log "switch + health-check"
cd "$BASE"
PREV=$(readlink current)
ln -sfn "releases/$REL" current && chown -h deploy:deploy current
sudo -u deploy pm2 restart obikhod >/dev/null 2>&1 </dev/null
code=000
for _ in $(seq 1 30); do
  code=$(curl -s --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health/ || true)
  [ "$code" = 200 ] && break
  sleep 2
done
if [ "$code" != 200 ]; then
  echo "✗ health-check $code — откат на $PREV" >&2
  ln -sfn "$PREV" current && chown -h deploy:deploy current
  sudo -u deploy pm2 restart obikhod >/dev/null 2>&1 </dev/null
  exit 1
fi
echo "$REL" > .last-rel
echo "✓ current → releases/$REL (prev: $PREV)"

# старые релизы: оставляем KEEP_RELEASES последних, предыдущий — всегда
ls -1t releases | tail -n +$((KEEP_RELEASES + 1)) | while read -r r; do
  [ "releases/$r" = "$PREV" ] || rm -rf "releases/$r"
done
echo "релизов на диске: $(ls releases | wc -l)"
