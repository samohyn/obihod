#!/usr/bin/env bash
# Установка ретранслятора уведомлений Telegram на прод (deploy/telegram/README.md). Идемпотентно.
# Из корня репо:
#   tar -C deploy/telegram -cz . | ssh root@<host> \
#     'rm -rf /tmp/obikhod-tg-src && mkdir /tmp/obikhod-tg-src && \
#      tar -xz -C /tmp/obikhod-tg-src && bash /tmp/obikhod-tg-src/install.sh'
# Первый запуск печатает ключ — добавить его deploy key с правом записи в samohyn/obihod-tg-relay
# (gh repo deploy-key add … --allow-write) и запустить ещё раз.
set -euo pipefail
SRC=${TG_SRC:-/tmp/obikhod-tg-src}
ENV_FILE=/home/deploy/obikhod/shared/.env
OUTBOX=/home/deploy/obikhod/shared/tg-outbox
REPO=/home/deploy/obikhod-tg-relay
KEY=/home/deploy/.ssh/obikhod_tg_relay_ed25519
REMOTE=git@github.com:samohyn/obihod-tg-relay.git
APP=obikhod

log() { printf '\n== %s ==\n' "$*"; }
as_deploy() { sudo -u deploy env GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" "$@"; }

log "очередь"
install -d -o deploy -g deploy -m 0750 "$OUTBOX"

log "ключ"
if [ ! -f "$KEY" ]; then
  sudo -u deploy ssh-keygen -q -t ed25519 -N '' -C 'obikhod VPS → obihod-tg-relay' -f "$KEY"
fi
if ! as_deploy git ls-remote "$REMOTE" >/dev/null 2>&1; then
  echo "Добавьте deploy key с правом записи в samohyn/obihod-tg-relay и запустите снова:"
  cat "$KEY.pub"
  exit 2
fi

log "ключ шифрования"
# RELAY_KEY: этот файл и секрет репозитория-ретранслятора — одно значение. Создаётся не здесь:
# printf %s "$K" | gh secret set RELAY_KEY -R samohyn/obihod-tg-relay и тот же $K — в этот файл.
if [ ! -s /home/deploy/.config/obikhod-tg-relay.key ]; then
  echo "Нет /home/deploy/.config/obikhod-tg-relay.key — без него сообщения не уходят (README)"
fi

log "репозиторий"
if [ ! -d "$REPO/.git" ]; then
  as_deploy git clone -q "$REMOTE" "$REPO"
fi
as_deploy git -C "$REPO" config user.name 'obikhod VPS'
as_deploy git -C "$REPO" config user.email 'noreply@obikhod.ru'
as_deploy git -C "$REPO" pull -q --ff-only
install -d -o deploy -g deploy "$REPO/queue"

log "скрипт и юниты"
install -m 0755 "$SRC/obikhod-tg-relay.sh" /usr/local/sbin/obikhod-tg-relay
for u in obikhod-tg-relay.service obikhod-tg-relay.path obikhod-tg-relay.timer; do
  install -m 0644 "$SRC/$u" "/etc/systemd/system/$u"
done
systemctl daemon-reload
systemctl enable --now obikhod-tg-relay.path obikhod-tg-relay.timer

log "сайт пишет в очередь"
if ! grep -q "^TELEGRAM_OUTBOX_DIR=$OUTBOX$" "$ENV_FILE"; then
  sed -i '/^TELEGRAM_OUTBOX_DIR=/d' "$ENV_FILE"
  printf '\n# Уведомления о заявках в Telegram через ретранслятор (deploy/telegram/)\nTELEGRAM_OUTBOX_DIR=%s\n' "$OUTBOX" >>"$ENV_FILE"
  # Next читает .env при старте
  sudo -u deploy pm2 restart "$APP" --update-env >/dev/null
  for _ in $(seq 1 30); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/health/)" = 200 ] && break
    sleep 2
  done
  echo "TELEGRAM_OUTBOX_DIR добавлен, $APP перезапущен"
else
  echo "TELEGRAM_OUTBOX_DIR уже задан"
fi
systemctl list-units --no-pager 'obikhod-tg-relay*'
