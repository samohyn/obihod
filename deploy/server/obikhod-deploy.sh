#!/usr/bin/env bash
# Выкатка релиза на сервере — единая логика для ручного деплоя и GitHub Actions (план 09, этап 1).
#
#   git archive --format=tar.gz <sha> site | ssh root@<host> obikhod-deploy <sha> [prod|staging]
#
# Из GitHub Actions — ключом с forced command в /root/.ssh/authorized_keys:
#   command="/usr/local/sbin/obikhod-deploy --from-ssh",restrict ssh-ed25519 AAAA… github-actions-deploy
# тогда команда берётся из SSH_ORIGINAL_COMMAND вида «deploy <40 hex> [prod|staging]», другие отклоняются.
#
# staging — https://staging.obikhod.ru (deploy/staging/): своя папка, БД obikhod_staging, pm2
# obikhod-staging на :3001, без бэкапа перед выкаткой.
#
# Шаги: бэкап (obikhod-backup --tag pre-deploy-<sha7>) → распаковка в releases/<ts>-<sha7> →
# симлинки .env и media → pnpm install + build под deploy → переключение current → pm2 restart →
# health-check (не 200 за 60 с — откат на предыдущий релиз) → чистка, остаётся KEEP_RELEASES.
# Миграции БД сюда не входят: применяются psql до выкатки (ADR-0016).

set -euo pipefail

KEEP_RELEASES=5

if [ "${1:-}" = "--from-ssh" ]; then
  read -r CMD SHA TARGET EXTRA <<< "${SSH_ORIGINAL_COMMAND:-}" || true
  [ "${CMD:-}" = deploy ] && [ -z "${EXTRA:-}" ] || { echo "✗ разрешена только команда: deploy <sha> [prod|staging]" >&2; exit 2; }
else
  SHA=${1:-}
  TARGET=${2:-}
fi
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || { echo "✗ нужен полный SHA коммита (40 hex), получено: '${SHA}'" >&2; exit 2; }
case "${TARGET:-prod}" in
  prod) TARGET=prod; BASE=/home/deploy/obikhod; APP=obikhod; PORT=3000 ;;
  staging) BASE=/home/deploy/obikhod-staging; APP=obikhod-staging; PORT=3001 ;;
  *) echo "✗ неизвестная цель: $TARGET" >&2; exit 2 ;;
esac
[ -f "$BASE/shared/.env" ] || { echo "✗ нет $BASE/shared/.env — для staging сначала deploy/staging/setup.sh" >&2; exit 2; }

exec 9>/run/obikhod-deploy-$TARGET.lock
flock -n 9 || { echo "✗ уже идёт другая выкатка" >&2; exit 3; }

log() { printf '\n== %s ==\n' "$*"; }
REL=$(date +%Y%m%d%H%M%S)-${SHA:0:7}

if [ "$TARGET" = prod ]; then
  log "backup before deploy"
  if command -v obikhod-backup >/dev/null; then
    obikhod-backup --tag "pre-deploy-${SHA:0:7}" </dev/null
  else
    echo "⚠ obikhod-backup не установлен (deploy/backup/install.sh)"
  fi
fi

log "unpack $REL → $TARGET"
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
PREV=$(readlink current || true)
ln -sfn "releases/$REL" current && chown -h deploy:deploy current
if sudo -u deploy pm2 describe "$APP" >/dev/null 2>&1; then
  sudo -u deploy pm2 restart "$APP" >/dev/null 2>&1 </dev/null
else
  # первый запуск (staging): pm2 запомнит cwd=current и порт
  sudo -u deploy pm2 start bash --name "$APP" --cwd "$BASE/current" -- -c "PORT=$PORT pnpm start" >/dev/null 2>&1 </dev/null
  sudo -u deploy pm2 save >/dev/null 2>&1 </dev/null
fi
code=000
for _ in $(seq 1 30); do
  code=$(curl -s --max-time 5 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/health/" || true)
  [ "$code" = 200 ] && break
  sleep 2
done
if [ "$code" != 200 ]; then
  echo "✗ health-check $code — откат на ${PREV:-—}" >&2
  if [ -n "$PREV" ]; then
    ln -sfn "$PREV" current && chown -h deploy:deploy current
    sudo -u deploy pm2 restart "$APP" >/dev/null 2>&1 </dev/null
  fi
  exit 1
fi
echo "$REL" > .last-rel
echo "✓ $TARGET: current → releases/$REL (prev: ${PREV:-—})"

# старые релизы: оставляем KEEP_RELEASES последних, предыдущий — всегда
ls -1t releases | tail -n +$((KEEP_RELEASES + 1)) | while read -r r; do
  [ "releases/$r" = "$PREV" ] || rm -rf "releases/$r"
done
echo "релизов на диске: $(ls releases | wc -l)"
