#!/usr/bin/env bash
# Проверка, что из бэкапа можно восстановиться — план 09, этап 1. Раз в неделю (таймер systemd).
#
# 1. Последний ежедневный дамп разворачивается во временную БД obikhod_restore_check, число строк
#    в ключевых таблицах сверяется с продом (бэкап за сутки может отставать — допускаем рост прода).
# 2. Архив media читается, число файлов сверяется с shared/media и shared/lead-photos.
# 3. Если настроен S3 (restic) — `restic check` с чтением 10% данных и восстановление последнего
#    снимка во временную папку со сверкой контрольных сумм с локальной копией.
# Временная БД и файлы удаляются в любом случае. Сбой → obikhod-notify, код выхода ≠ 0.

set -euo pipefail

ROOT=/var/backups/obikhod
STATE=/var/lib/obikhod-backup
MEDIA_DIR=/home/deploy/obikhod/shared/media
TEST_DB=obikhod_restore_check
ENV_FILE=/etc/obikhod/backup.env
TABLES="services districts service_districts cases blog leads users media"

[ -f "$ENV_FILE" ] && { set -a; . "$ENV_FILE"; set +a; }

TMP=$(mktemp -d)
cleanup() {
  sudo -u postgres dropdb --if-exists "$TEST_DB" >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

fail() {
  local msg="Проверка восстановления не прошла: $1"
  echo "✗ $msg" >&2
  /usr/local/sbin/obikhod-notify "Обиход: бэкап не восстанавливается" "$msg (сервер $(hostname), $(date '+%F %T %Z'))" || true
  exit 1
}
trap 'fail "строка $LINENO"' ERR

DUMP=$(ls -1t "$ROOT"/daily/obikhod-*.dump 2>/dev/null | head -1 || true)
[ -n "$DUMP" ] || fail "нет ни одного ежедневного дампа в $ROOT/daily"
MEDIA=$ROOT/daily/media-$(basename "$DUMP" | sed -E 's/^obikhod-(.*)\.dump$/\1/').tgz
[ -f "$MEDIA" ] || fail "нет архива media к $(basename "$DUMP")"

AGE_H=$(( ($(date +%s) - $(stat -c %Y "$DUMP")) / 3600 ))
[ "$AGE_H" -le 30 ] || fail "последнему дампу $AGE_H ч — ежедневный бэкап не работает"

# 1. БД
sudo -u postgres dropdb --if-exists "$TEST_DB"
sudo -u postgres createdb "$TEST_DB"
sudo -u postgres pg_restore --no-owner --no-privileges --exit-on-error -d "$TEST_DB" < "$DUMP" \
  || fail "pg_restore $(basename "$DUMP") завершился с ошибкой"

REPORT=""
for t in $TABLES; do
  restored=$(sudo -u postgres psql -tAc "select count(*) from \"$t\"" "$TEST_DB")
  live=$(sudo -u postgres psql -tAc "select count(*) from \"$t\"" obikhod)
  REPORT+="$t $restored/$live; "
  # бэкап не может содержать больше строк, чем было, и не должен «потерять» больше 10%
  [ "$restored" -le "$live" ] || [ "$t" = leads ] || fail "$t: в бэкапе $restored строк, на проде $live"
  [ "$live" -eq 0 ] || [ $((restored * 100 / live)) -ge 90 ] || fail "$t: в бэкапе $restored из $live строк"
done

# 2. Media
in_archive=$(tar -tzf "$MEDIA" | grep -c -v '/$' || true)
on_disk=$(find "$MEDIA_DIR" "$(dirname "$MEDIA_DIR")/lead-photos" -type f 2>/dev/null | wc -l)
[ "$in_archive" -gt 0 ] || fail "архив media пустой"
[ $((in_archive * 100 / (on_disk > 0 ? on_disk : 1))) -ge 90 ] || fail "media: в архиве $in_archive файлов, на диске $on_disk"

# 3. S3
OFFSITE="S3 не настроен"
if [ -n "${RESTIC_REPOSITORY:-}" ]; then
  restic check --quiet --read-data-subset=10% || fail "restic check нашёл повреждения"
  restic restore latest --host obikhod-prod --target "$TMP/restic" --quiet || fail "restic restore latest"
  restored_dump=$(find "$TMP/restic" -name 'obikhod-*.dump' | sort | tail -1)
  [ -n "$restored_dump" ] || fail "в последнем снимке S3 нет дампа"
  local_copy=$(find "$ROOT" -name "$(basename "$restored_dump")" | head -1)
  if [ -n "$local_copy" ]; then
    [ "$(sha256sum < "$restored_dump")" = "$(sha256sum < "$local_copy")" ] || fail "дамп из S3 не совпадает с локальным"
  fi
  OFFSITE="S3 ok ($(basename "$restored_dump"))"
fi

mkdir -p "$STATE"
date -Is > "$STATE/last-restore-check"
echo "✓ $(basename "$DUMP") восстанавливается: $REPORT media $in_archive/$on_disk; $OFFSITE"
