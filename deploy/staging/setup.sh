#!/usr/bin/env bash
# Установка staging на сервер. Идемпотентно — повторный запуск ничего не ломает.
# Запуск из корня репо:
#   COPYFILE_DISABLE=1 tar -C deploy/staging --no-xattrs -cz . | ssh root@<host> \
#     'rm -rf /tmp/obikhod-staging-src && mkdir /tmp/obikhod-staging-src && \
#      tar -xz -C /tmp/obikhod-staging-src && bash /tmp/obikhod-staging-src/setup.sh'
# Затем выкатка кода: deploy/manual-deploy.sh <ref> staging.

set -euo pipefail
SRC=/tmp/obikhod-staging-src
STAGING=/home/deploy/obikhod-staging
PROD_ENV=/home/deploy/obikhod/shared/.env

log() { printf '\n== %s ==\n' "$*"; }

log "каталоги"
install -d -o deploy -g deploy "$STAGING" "$STAGING/releases" "$STAGING/shared"

log "окружение"
if [ ! -f "$STAGING/shared/.env" ]; then
  python3 - "$PROD_ENV" "$STAGING/shared/.env" <<'PY'
import re, secrets, sys
src, dst = sys.argv[1], sys.argv[2]
# что staging не должен делать: писать клиентам/менеджеру, слать в поисковики и Метрику
drop = re.compile(r'^(TELEGRAM_\w*|SMTP_\w*|LEAD_NOTIFY_EMAIL|INDEXNOW_KEY|NEXT_PUBLIC_YANDEX_METRIKA_ID|OPERATOR_EMAIL|'
                  r'PAYLOAD_SECRET|REVALIDATE_SECRET|PAYLOAD_PREVIEW_SECRET|NEXT_PUBLIC_SITE_URL|SITE_URL|DATABASE_URI)=')
out, uri = [], None
for line in open(src, encoding='utf-8'):
    if line.startswith('DATABASE_URI='):
        uri = line.split('=', 1)[1].strip()
    if drop.match(line):
        continue
    out.append(line.rstrip('\n'))
q = uri[0] if uri and uri[0] in '\'"' else ''
body = uri.strip('\'"')
body = re.sub(r'/obikhod(?=$|\?)', '/obikhod_staging', body)
out += [
    '', '# staging (deploy/staging/setup.sh)',
    f'DATABASE_URI={q}{body}{q}',
    "NEXT_PUBLIC_SITE_URL='https://staging.obikhod.ru'",
    "SITE_URL='https://staging.obikhod.ru'",
    f"PAYLOAD_SECRET='{secrets.token_hex(32)}'",
    f"REVALIDATE_SECRET='{secrets.token_hex(16)}'",
    f"PAYLOAD_PREVIEW_SECRET='{secrets.token_hex(16)}'",
]
open(dst, 'w', encoding='utf-8').write('\n'.join(out) + '\n')
PY
  chown deploy:deploy "$STAGING/shared/.env"
  chmod 600 "$STAGING/shared/.env"
fi
grep -c '^DATABASE_URI=.*obikhod_staging' "$STAGING/shared/.env"

log "скрипт обновления данных"
install -m 0750 "$SRC/obikhod-staging-refresh.sh" /usr/local/sbin/obikhod-staging-refresh
obikhod-staging-refresh

log "nginx + пароль"
if [ ! -f /etc/nginx/staging.htpasswd ]; then
  PASS=$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)
  printf 'obikhod:%s\n' "$(openssl passwd -apr1 "$PASS")" > /etc/nginx/staging.htpasswd
  chown root:www-data /etc/nginx/staging.htpasswd
  chmod 640 /etc/nginx/staging.htpasswd
  echo "ПАРОЛЬ STAGING (показывается один раз): логин obikhod, пароль $PASS"
fi
if ! grep -q 'managed by Certbot' /etc/nginx/sites-available/staging.obikhod.ru 2>/dev/null; then
  install -m 0644 "$SRC/staging.obikhod.ru.nginx" /etc/nginx/sites-available/staging.obikhod.ru
  ln -sfn /etc/nginx/sites-available/staging.obikhod.ru /etc/nginx/sites-enabled/staging.obikhod.ru
  nginx -t && systemctl reload nginx
  certbot --nginx -d staging.obikhod.ru --non-interactive --redirect
fi
nginx -t && systemctl reload nginx
echo "✓ staging готов к выкатке: deploy/manual-deploy.sh <ref> staging"
