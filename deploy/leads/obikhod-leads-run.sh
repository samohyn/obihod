#!/usr/bin/env bash
# Задачи панели заявок (план 09, этап 5.4): дёргает служебный адрес сайта на этом сервере.
#   obikhod-leads-run overdue        — письмо «Просрочена заявка» (таймер раз в минуту)
#   obikhod-leads-run purge-photos   — удаление фото закрытых заявок по сроку (раз в сутки)
# Секрет — LEADS_CRON_SECRET из окружения сайта; без него адрес отвечает 403.
set -euo pipefail
JOB=${1:?overdue | purge-photos}
case "$JOB" in overdue | purge-photos) ;; *) echo "✗ неизвестная задача: $JOB" >&2; exit 2 ;; esac
ENV_FILE=${OBIKHOD_ENV:-/home/deploy/obikhod/shared/.env}
PORT=${OBIKHOD_PORT:-3000}
SECRET=$(grep -E '^LEADS_CRON_SECRET=' "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d "\"'")
[ -n "$SECRET" ] || { echo "✗ нет LEADS_CRON_SECRET в $ENV_FILE" >&2; exit 1; }
curl -fsS --max-time 120 -X POST -H "x-obikhod-cron: $SECRET" \
  "http://127.0.0.1:$PORT/api/internal/leads/$JOB"
echo
