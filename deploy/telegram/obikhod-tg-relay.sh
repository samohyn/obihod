#!/usr/bin/env bash
# Ретранслятор уведомлений о заявках в Telegram (deploy/telegram/README.md).
# С VPS в РФ api.telegram.org недоступен: сайт кладёт сообщение файлом в очередь, этот скрипт
# коммитит его в закрытый репозиторий samohyn/obihod-tg-relay, GitHub Actions отправляет в Telegram.
# Запускается systemd (obikhod-tg-relay.path — сразу при новом файле, .timer — повтор раз в 2 минуты).
# В сообщении имя и телефон клиента (с 28.10.2026) — в репозиторий файл уходит только зашифрованным
# (AES-256-CBC + PBKDF2, ключ RELAY_KEY: здесь — файл, в ретрансляторе — секрет).
set -euo pipefail
OUTBOX=/home/deploy/obikhod/shared/tg-outbox
REPO=/home/deploy/obikhod-tg-relay
KEY=/home/deploy/.ssh/obikhod_tg_relay_ed25519
RELAY_KEY=/home/deploy/.config/obikhod-tg-relay.key
export GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

# замок не в очереди: запись в каталог очереди снова запустила бы .path
exec 9>/run/lock/obikhod-tg-relay.lock
flock -n 9 || exit 0

# без ключа не отправляем: имя и телефон не должны попасть в репозиторий открытым текстом
[ -s "$RELAY_KEY" ] || { echo "нет ключа шифрования $RELAY_KEY" >&2; exit 1; }

cd "$REPO"
shopt -s nullglob
moved=0
for f in "$OUTBOX"/*.json; do
  openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt -a -A -pass "file:$RELAY_KEY" \
    -in "$f" -out "queue/$(basename "$f").enc"
  rm -f "$f"
  moved=$((moved + 1))
done
# отправленное старше 7 дней убираем из репозитория — удаление сообщения не шлёт
find queue -name '*.json*' -mtime +7 -print0 | xargs -0r git rm -q --
git add queue
git diff --cached --quiet || git commit -qm "уведомления: $moved"
# пушим и то, что не ушло в прошлый раз (сеть, GitHub)
if [ "$(git rev-list --count origin/main..HEAD)" -gt 0 ]; then
  git push -q origin HEAD:main
  echo "отправлено в ретранслятор: $(git log -1 --format=%s)"
fi
