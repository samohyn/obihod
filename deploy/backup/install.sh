#!/usr/bin/env bash
# Установка бэкапов на сервер. Идемпотентно.
# Запуск из корня репо:
#   tar -C deploy/backup -cz . | ssh root@<host> \
#     'rm -rf /tmp/obikhod-backup-src && mkdir /tmp/obikhod-backup-src && \
#      tar -xz -C /tmp/obikhod-backup-src && bash /tmp/obikhod-backup-src/install.sh'

set -euo pipefail
SRC=${BACKUP_SRC:-/tmp/obikhod-backup-src}

log() { printf '\n== %s ==\n' "$*"; }

log "restic"
command -v restic >/dev/null || { apt-get update -qq && apt-get install -y -qq restic >/dev/null; }
restic version

log "скрипты и юниты"
install -m 0750 "$SRC/obikhod-backup.sh" /usr/local/sbin/obikhod-backup
install -m 0750 "$SRC/obikhod-restore-check.sh" /usr/local/sbin/obikhod-restore-check
install -m 0750 "$SRC/obikhod-notify.sh" /usr/local/sbin/obikhod-notify
for u in obikhod-backup.service obikhod-backup.timer obikhod-restore-check.service obikhod-restore-check.timer; do
  install -m 0644 "$SRC/$u" /etc/systemd/system/$u
done

log "настройки"
install -d -m 0700 /etc/obikhod /var/backups/obikhod /var/lib/obikhod-backup
[ -f /etc/obikhod/backup.env ] || install -m 0600 "$SRC/backup.env.example" /etc/obikhod/backup.env
set -a; . /etc/obikhod/backup.env; set +a
if [ -n "${RESTIC_REPOSITORY:-}" ] && ! restic cat config >/dev/null 2>&1; then
  restic init
fi

log "таймеры"
systemctl daemon-reload
systemctl enable --now obikhod-backup.timer obikhod-restore-check.timer
systemctl list-timers --no-pager 'obikhod-*'
