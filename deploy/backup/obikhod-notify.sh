#!/usr/bin/env bash
# Уведомление владельцу о сбое бэкапа/проверки: obikhod-notify "тема" "текст".
#
# Telegram с этого VPS недоступен (api.telegram.org — таймаут, проверено 19.10.2026), поэтому
# канал — почта через SMTP (Beget/Яндекс), настройки в /etc/obikhod/backup.env:
#   NOTIFY_SMTP_URL=smtps://smtp.beget.com:465   NOTIFY_SMTP_USER=…   NOTIFY_SMTP_PASS=…
#   NOTIFY_TO=partner@obikhod.ru   NOTIFY_FROM_NAME=«Обиход — сервер» (необязательно)
# Без настроек — только запись в журнал (journalctl -t obikhod-notify). В тексте — без данных клиентов.

set -uo pipefail

SUBJECT=${1:-"Обиход: уведомление"}
BODY=${2:-""}
ENV_FILE=/etc/obikhod/backup.env
[ -f "$ENV_FILE" ] && { set -a; . "$ENV_FILE"; set +a; }

logger -t obikhod-notify -p user.err "$SUBJECT — $BODY"

if [ -z "${NOTIFY_SMTP_URL:-}" ] || [ -z "${NOTIFY_TO:-}" ]; then
  echo "уведомление только в журнал: SMTP не настроен" >&2
  exit 0
fi

# конверт SMTP — голый адрес ящика; в заголовке имя кодируем по RFC 2047 (кириллица)
FROM_ADDR=$NOTIFY_SMTP_USER
FROM_NAME=${NOTIFY_FROM_NAME:-Обиход}
MSG=$(mktemp)
trap 'rm -f "$MSG"' EXIT
{
  printf 'From: =?UTF-8?B?%s?= <%s>\r\nTo: %s\r\n' "$(printf '%s' "$FROM_NAME" | base64 -w0)" "$FROM_ADDR" "$NOTIFY_TO"
  printf 'Date: %s\r\nMessage-ID: <%s@obikhod.ru>\r\n' "$(LC_ALL=C date -R)" "$(date +%s).$$"
  printf 'Subject: =?UTF-8?B?%s?=\r\n' "$(printf '%s' "$SUBJECT" | base64 -w0)"
  printf 'MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n'
  printf '%s\r\n' "$BODY"
} > "$MSG"

curl -sS --max-time 30 --ssl-reqd --url "$NOTIFY_SMTP_URL" \
  --user "$NOTIFY_SMTP_USER:$NOTIFY_SMTP_PASS" \
  --mail-from "$FROM_ADDR" --mail-rcpt "$NOTIFY_TO" --upload-file "$MSG"
