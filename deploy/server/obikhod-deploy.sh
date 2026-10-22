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
# симлинки .env, media и lead-photos → pnpm install → миграции БД (pnpm migrate) → build →
# переключение current → pm2 restart → health-check (не 200 за 60 с — откат кода на предыдущий
# релиз) → чистка, остаётся KEEP_RELEASES.
#
# Миграции (план 09, этап 1 — «Дрейф схемы»; заменяет ручной psql из ADR-0016): до сборки и переключения,
# поэтому каждая миграция обязана быть совместима со старым кодом (expand → contract: сначала
# добавляем, удаляем старое — следующим релизом). Упала миграция — релиз не переключается.
# Откат кода при провале health-check схему не откатывает; полный откат — pre-deploy бэкап.

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
# фото заявок — закрытая папка вне media (её отдаёт публичный маршрут медиатеки)
install -d -o deploy -g deploy -m 0750 "$BASE/shared/lead-photos"
ln -sfn "$BASE/shared/lead-photos" lead-photos
chown -R deploy:deploy "$BASE/releases/$REL"

log "install"
sudo -u deploy bash -c '
  set -eo pipefail
  export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
  env -u NODE_ENV pnpm install --frozen-lockfile 2>&1 | tail -3
' </dev/null

# Миграции — до сборки: next build пререндерит страницы из БД, и новый код может читать
# новые колонки. Старый релиз в это время продолжает работать (миграции совместимы с ним).
MIGRATED=0
if grep -q '"migrate":' package.json; then
  log "migrate"
  if ! out=$(sudo -u deploy bash -c '
    set -eo pipefail
    set -a; . ./.env; set +a
    NODE_ENV=production pnpm -s migrate
  ' </dev/null 2>&1); then
    echo "$out" | tail -25
    echo "✗ миграции не применились — релиз не переключён. Упавшая миграция откатилась целиком;" >&2
    echo "  применённые до неё (если были) остались — см. вывод выше." >&2
    exit 1
  fi
  echo "$out" | grep -vE 'identifiers exceed|^[[:space:]]*$' | tail -8
  MIGRATED=$(printf '%s\n' "$out" | sed -n 's/^MIGRATIONS_APPLIED=//p' | tail -1)
fi

log "build"
if ! sudo -u deploy bash -c '
  set -eo pipefail
  set -a; . ./.env; set +a
  export NODE_OPTIONS=--max-old-space-size=3072
  pnpm build 2>&1 | tail -5
' </dev/null; then
  echo "✗ сборка упала — релиз не переключён." >&2
  [ "${MIGRATED:-0}" != 0 ] && echo "⚠ миграции этого релиза ($MIGRATED) уже в БД; старый код с ними совместим." >&2
  exit 1
fi

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
  if [ "${MIGRATED:-0}" != 0 ]; then
    echo "⚠ откатан только код: миграции этого релиза ($MIGRATED) остались в БД." >&2
    echo "  Старый код с ними совместим (expand → contract); полный откат — pre-deploy бэкап." >&2
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
