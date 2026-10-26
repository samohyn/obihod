#!/usr/bin/env bash
# Установка таймеров панели заявок на прод (план 09, этап 5.4). Идемпотентно.
# Сначала выкатить релиз с адресами /api/internal/leads/*, потом из корня репо:
#   tar -C deploy/leads -cz . | ssh root@<host> \
#     'rm -rf /tmp/obikhod-leads-src && mkdir /tmp/obikhod-leads-src && \
#      tar -xz -C /tmp/obikhod-leads-src && bash /tmp/obikhod-leads-src/install.sh'
set -euo pipefail
SRC=${LEADS_SRC:-/tmp/obikhod-leads-src}
ENV_FILE=/home/deploy/obikhod/shared/.env
APP=obikhod

log() { printf '\n== %s ==\n' "$*"; }

log "скрипт и юниты"
install -m 0750 "$SRC/obikhod-leads-run.sh" /usr/local/sbin/obikhod-leads-run
for u in obikhod-leads-overdue.service obikhod-leads-overdue.timer \
  obikhod-leads-purge.service obikhod-leads-purge.timer; do
  install -m 0644 "$SRC/$u" "/etc/systemd/system/$u"
done

log "секрет"
if ! grep -qE '^LEADS_CRON_SECRET=.{32,}' "$ENV_FILE"; then
  printf '\n# Таймеры панели заявок (deploy/leads/)\nLEADS_CRON_SECRET=%s\n' "$(openssl rand -hex 32)" >>"$ENV_FILE"
  # Next читает .env при старте — перезапуск, чтобы сайт узнал секрет
  sudo -u deploy pm2 restart "$APP" --update-env >/dev/null
  for _ in $(seq 1 30); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health/)" = 200 ] && break
    sleep 2
  done
  echo "секрет добавлен, $APP перезапущен"
else
  echo "секрет уже есть"
fi

log "проверка"
/usr/local/sbin/obikhod-leads-run overdue

log "таймеры"
systemctl daemon-reload
systemctl enable --now obikhod-leads-overdue.timer obikhod-leads-purge.timer
systemctl list-timers --no-pager 'obikhod-*'
