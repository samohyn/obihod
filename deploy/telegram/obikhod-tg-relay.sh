#!/usr/bin/env bash
# Ретранслятор уведомлений о заявках в Telegram (deploy/telegram/README.md).
# С VPS в РФ api.telegram.org недоступен: сайт кладёт сообщение файлом в очередь, этот скрипт
# коммитит его в закрытый репозиторий samohyn/obihod-tg-relay, GitHub Actions отправляет в Telegram.
# Запускается systemd (obikhod-tg-relay.path — сразу при новом файле, .timer — повтор раз в 2 минуты).
set -euo pipefail
OUTBOX=/home/deploy/obikhod/shared/tg-outbox
REPO=/home/deploy/obikhod-tg-relay
KEY=/home/deploy/.ssh/obikhod_tg_relay_ed25519
export GIT_SSH_COMMAND="ssh -i $KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

# замок не в очереди: запись в каталог очереди снова запустила бы .path
exec 9>/run/lock/obikhod-tg-relay.lock
flock -n 9 || exit 0

cd "$REPO"
shopt -s nullglob
moved=0
for f in "$OUTBOX"/*.json; do
  mv "$f" queue/
  moved=$((moved + 1))
done
# отправленное старше 7 дней убираем из репозитория — удаление сообщения не шлёт
find queue -name '*.json' -mtime +7 -print0 | xargs -0r git rm -q --
git add queue
git diff --cached --quiet || git commit -qm "уведомления: $moved"
# пушим и то, что не ушло в прошлый раз (сеть, GitHub)
if [ "$(git rev-list --count origin/main..HEAD)" -gt 0 ]; then
  git push -q origin HEAD:main
  echo "отправлено в ретранслятор: $(git log -1 --format=%s)"
fi
