#!/usr/bin/env bash
# Бэкап прода Обихода: БД (pg_dump -Fc) + media (tar.gz) — план 09, этап 1.
#
# Установка: deploy/backup/install.sh (кладёт в /usr/local/sbin/obikhod-backup, таймер systemd).
# Запуск:    obikhod-backup                  — ежедневный (daily/, по воскресеньям копия в weekly/)
#            obikhod-backup --tag pre-deploy  — разовый перед выкаткой (pre-deploy/)
#
# Локально: /var/backups/obikhod/{daily,weekly,pre-deploy}; хранение 14 ежедневных / 8 недельных /
# 10 перед выкаткой. Если в /etc/obikhod/backup.env задан RESTIC_REPOSITORY — ещё и копия в S3 в РФ
# (restic, шифрование на стороне сервера, хранение 14d/8w/12m). Без S3 бэкап не переживёт
# потерю самого сервера — как было со старым VPS.
# Ошибка → уведомление (obikhod-notify) и код выхода ≠ 0 (systemd покажет failed).

set -euo pipefail

ROOT=/var/backups/obikhod
STATE=/var/lib/obikhod-backup
MEDIA_DIR=/home/deploy/obikhod/shared/media
DB=obikhod
ENV_FILE=/etc/obikhod/backup.env

TAG=daily
if [ "${1:-}" = "--tag" ] && [ -n "${2:-}" ]; then TAG=$2; fi

[ -f "$ENV_FILE" ] && { set -a; . "$ENV_FILE"; set +a; }

fail() {
  local msg="Бэкап «$TAG» не удался: $1"
  echo "✗ $msg" >&2
  /usr/local/sbin/obikhod-notify "Обиход: ошибка бэкапа" "$msg (сервер $(hostname), $(date '+%F %T %Z'))" || true
  exit 1
}
trap 'fail "строка $LINENO"' ERR

exec 9>/run/obikhod-backup.lock
flock -n 9 || { echo "уже идёт другой бэкап — выходим"; exit 0; }

case "$TAG" in
  daily) DIR=$ROOT/daily ;;
  *) DIR=$ROOT/pre-deploy ;;
esac
mkdir -p "$DIR" "$ROOT/weekly" "$STATE"
chmod 700 "$ROOT"

TS=$(date +%Y%m%d-%H%M%S)
DUMP=$DIR/obikhod-$TS-$TAG.dump
MEDIA=$DIR/media-$TS-$TAG.tgz

# 1. БД и media во временные файлы, затем атомарный rename — недописанный файл не выглядит бэкапом
sudo -u postgres pg_dump -Fc "$DB" > "$DUMP.part"
pg_restore -l "$DUMP.part" > /dev/null || fail "дамп не читается pg_restore"
mv "$DUMP.part" "$DUMP"

# код 1 у GNU tar = «файл изменился во время чтения» (загрузка в админке) — архив при этом годный
tar -czf "$MEDIA.part" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")" || [ $? -eq 1 ]
tar -tzf "$MEDIA.part" > /dev/null || fail "архив media не читается"
mv "$MEDIA.part" "$MEDIA"
chmod 600 "$DUMP" "$MEDIA"

# 2. Недельная копия по воскресеньям
if [ "$TAG" = daily ] && [ "$(date +%u)" = 7 ]; then
  cp -p "$DUMP" "$MEDIA" "$ROOT/weekly/"
fi

# 3. Ротация (по парам дамп + media, старые первыми)
prune() { # dir keep
  local f
  for f in $(ls -1t "$1"/obikhod-*.dump 2>/dev/null | tail -n +$(($2 + 1))); do
    rm -f "$f" "$1/media-$(basename "$f" | sed -E 's/^obikhod-(.*)\.dump$/\1/').tgz"
  done
}
prune "$ROOT/daily" 14
prune "$ROOT/weekly" 8
prune "$ROOT/pre-deploy" 10

# 4. Копия в S3 (если настроено)
OFFSITE="нет (S3 не настроен)"
if [ -n "${RESTIC_REPOSITORY:-}" ]; then
  restic backup --quiet --tag "$TAG" --host obikhod-prod "$DUMP" "$MEDIA"
  if [ "$TAG" = daily ]; then
    restic forget --quiet --host obikhod-prod --keep-daily 14 --keep-weekly 8 --keep-monthly 12 --prune
  fi
  OFFSITE="restic ok"
fi

date -Is > "$STATE/last-success-$TAG"
echo "✓ $TAG: $(du -h "$DUMP" | cut -f1) БД, $(du -h "$MEDIA" | cut -f1) media; S3: $OFFSITE"
