#!/usr/bin/env bash
# Обновить данные staging из прода — план 09, этап 1.
#
#   obikhod-staging-refresh
#
# Последний ежедневный бэкап прода → БД obikhod_staging (пересоздаётся), затем обезличивание:
# телефоны/имена/почты заявок заменяются, audit_log очищается. Media — копия прода.
# Пользователи админки сохраняются (вход тот же, что на проде).

set -euo pipefail

STAGING=/home/deploy/obikhod-staging
DB=obikhod_staging
DUMP=$(ls -1t /var/backups/obikhod/daily/obikhod-*.dump 2>/dev/null | head -1 || true)
[ -n "$DUMP" ] || { echo "✗ нет ежедневного бэкапа прода — сначала obikhod-backup" >&2; exit 1; }

echo "== БД из $(basename "$DUMP")"
sudo -u deploy pm2 stop obikhod-staging >/dev/null 2>&1 </dev/null || true
sudo -u postgres dropdb --if-exists --force "$DB"
sudo -u postgres createdb -O obikhod "$DB"
sudo -u postgres pg_restore --no-owner --role=obikhod --exit-on-error -d "$DB" < "$DUMP"

echo "== обезличивание"
sudo -u postgres psql -v ON_ERROR_STOP=1 -q "$DB" <<'SQL'
UPDATE leads SET phone = '+7000000' || lpad((id % 10000)::text, 4, '0'),
                 name = 'Тестовый клиент ' || id,
                 email = NULL;
TRUNCATE audit_log;
SQL
sudo -u postgres psql -tAc "select 'заявок: ' || count(*) || ', с реальным телефоном: ' || count(*) filter (where phone not like '+7000000%') from leads" "$DB"

echo "== media"
mkdir -p "$STAGING/shared/media"
rsync -a --delete /home/deploy/obikhod/shared/media/ "$STAGING/shared/media/"
chown -R deploy:deploy "$STAGING/shared/media"

sudo -u deploy pm2 start obikhod-staging >/dev/null 2>&1 </dev/null || true
echo "✓ staging обновлён из $(basename "$DUMP")"
