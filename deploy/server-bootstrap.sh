#!/usr/bin/env bash
# Idempotent server bootstrap для Обихода.
# Запуск: ssh root@<host> 'bash -s' < server-bootstrap.sh
# Повторный запуск безопасен — все шаги проверяют текущее состояние.

set -euo pipefail

log() { printf '\n== %s ==\n' "$*"; }

# ---------------------------------------------------------------------------
# 1. Swap 2 GB
# ---------------------------------------------------------------------------
log "swap"
if swapon --show | grep -q /swapfile; then
  echo "already configured"
else
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10 >/dev/null
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-obikhod-swap.conf
fi
swapon --show

# ---------------------------------------------------------------------------
# 2. apt packages
# ---------------------------------------------------------------------------
log "apt"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq \
  curl gnupg ca-certificates build-essential \
  ufw nginx \
  postgresql postgresql-contrib \
  certbot python3-certbot-nginx \
  jq htop rsync >/dev/null

# ---------------------------------------------------------------------------
# 3. Node 22 via NodeSource
# ---------------------------------------------------------------------------
log "node 22"
if command -v node >/dev/null 2>&1 && node -v | grep -q '^v22\.'; then
  echo "already: $(node -v)"
else
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
  echo "installed: $(node -v)"
fi

# ---------------------------------------------------------------------------
# 4. corepack + pnpm
# ---------------------------------------------------------------------------
log "pnpm via corepack"
corepack enable >/dev/null
corepack prepare pnpm@10.33.0 --activate >/dev/null
echo "pnpm $(pnpm --version)"

# ---------------------------------------------------------------------------
# 5. PM2 global
# ---------------------------------------------------------------------------
log "pm2"
if command -v pm2 >/dev/null 2>&1; then
  echo "already: $(pm2 -v)"
else
  npm install -g pm2@latest >/dev/null 2>&1
  echo "installed: $(pm2 -v)"
fi

# ---------------------------------------------------------------------------
# 6. deploy-user + dirs
# ---------------------------------------------------------------------------
log "deploy user + dirs"
if ! id deploy >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" deploy >/dev/null
fi
install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
install -d -m 755 -o deploy -g deploy /home/deploy/obikhod
install -d -m 755 -o deploy -g deploy /home/deploy/obikhod/releases
install -d -m 755 -o deploy -g deploy /home/deploy/obikhod/shared
echo "deploy uid=$(id -u deploy)"

# corepack/pnpm для deploy-юзера (чтобы pnpm был доступен под ним)
sudo -u deploy bash -c 'corepack enable --install-directory ~/.local/bin 2>/dev/null || true'
sudo -u deploy bash -c 'mkdir -p ~/.local/bin'

# ---------------------------------------------------------------------------
# 7. SSH key для GitHub Actions
# ---------------------------------------------------------------------------
log "github-actions ssh key"
KEY=/root/.ssh/obikhod_deploy_ed25519
if [ ! -f "$KEY" ]; then
  ssh-keygen -t ed25519 -N '' -f "$KEY" -C "github-actions-deploy@obikhod" >/dev/null
  echo "generated"
else
  echo "already exists"
fi

# публичный ключ в authorized_keys deploy-юзера (не дублируем)
PUBKEY=$(cat "$KEY.pub")
AK=/home/deploy/.ssh/authorized_keys
touch "$AK"
chown deploy:deploy "$AK"
chmod 600 "$AK"
grep -qF "$PUBKEY" "$AK" || echo "$PUBKEY" >> "$AK"

# ---------------------------------------------------------------------------
# 8. PostgreSQL: user + database
# ---------------------------------------------------------------------------
log "postgres"
systemctl enable --now postgresql >/dev/null
PGPASS_FILE=/root/.obikhod-pgpass
if [ ! -f "$PGPASS_FILE" ]; then
  openssl rand -hex 24 > "$PGPASS_FILE"
  chmod 600 "$PGPASS_FILE"
fi
PG_PASSWORD=$(cat "$PGPASS_FILE")

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL >/dev/null
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'obikhod') THEN
    CREATE ROLE obikhod WITH LOGIN PASSWORD '${PG_PASSWORD}';
  ELSE
    ALTER USER obikhod WITH PASSWORD '${PG_PASSWORD}';
  END IF;
END
\$\$;
SQL
sudo -u postgres psql -v ON_ERROR_STOP=1 -tAc "SELECT 1 FROM pg_database WHERE datname='obikhod'" | grep -q 1 \
  || sudo -u postgres createdb -O obikhod obikhod
echo "postgres ready"

# ---------------------------------------------------------------------------
# 9. shared/.env — на него симлинкуется release/.env при деплое
# ---------------------------------------------------------------------------
log "shared/.env"
SHARED_ENV=/home/deploy/obikhod/shared/.env
if [ ! -f "$SHARED_ENV" ]; then
  PAYLOAD_SECRET=$(openssl rand -hex 32)
  REVALIDATE_SECRET=$(openssl rand -hex 32)
  INDEXNOW_KEY=$(openssl rand -hex 16)
  cat > "$SHARED_ENV" <<EOF
# Автогенерировано server-bootstrap.sh. Правь осторожно.
NODE_ENV=production
PORT=3000

DATABASE_URI=postgres://obikhod:${PG_PASSWORD}@localhost:5432/obikhod

PAYLOAD_SECRET=${PAYLOAD_SECRET}

SITE_URL=https://obikhod.ru
NEXT_PUBLIC_SITE_URL=https://obikhod.ru

REVALIDATE_SECRET=${REVALIDATE_SECRET}
INDEXNOW_KEY=${INDEXNOW_KEY}
EOF
  chown deploy:deploy "$SHARED_ENV"
  chmod 600 "$SHARED_ENV"
  echo "created"
else
  echo "already exists (не перезаписываю)"
fi

# ---------------------------------------------------------------------------
# 10. nginx — HTTP-only пока, certbot апгрейднет после проверки
# ---------------------------------------------------------------------------
log "nginx"
cat > /etc/nginx/sites-available/obikhod.ru <<'NGX'
server {
    listen 80;
    listen [::]:80;
    server_name obikhod.ru www.obikhod.ru;

    # Let's Encrypt http-01
    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }

    # Пока deploy не прошёл — вместо 502 отдаём временную страницу
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 5s;

        # Пока upstream пустой — показываем placeholder, а не 502
        error_page 502 503 504 = @maintenance;
    }

    location @maintenance {
        default_type text/html;
        return 503 '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Обиход — скоро</title></head><body style="font-family:sans-serif;text-align:center;padding:10vh 2rem"><h1>Обиход</h1><p>Сайт готовится к запуску.</p></body></html>';
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 1024;
}
NGX
ln -sf /etc/nginx/sites-available/obikhod.ru /etc/nginx/sites-enabled/obikhod.ru
rm -f /etc/nginx/sites-enabled/default
mkdir -p /var/www/html
nginx -t
systemctl enable --now nginx >/dev/null
systemctl reload nginx
echo "nginx reloaded"

# ---------------------------------------------------------------------------
# 11. UFW — последним, чтобы случайно не отрезать SSH
# ---------------------------------------------------------------------------
log "ufw"
ufw default deny incoming >/dev/null
ufw default allow outgoing >/dev/null
ufw allow 22/tcp >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
if ! ufw status | grep -q "Status: active"; then
  ufw --force enable >/dev/null
fi
ufw status

# ---------------------------------------------------------------------------
# Финал
# ---------------------------------------------------------------------------
log "summary"
echo "node:     $(node -v)"
echo "pnpm:     $(pnpm --version)"
echo "pm2:      $(pm2 -v)"
echo "nginx:    $(nginx -v 2>&1)"
echo "postgres: $(psql --version)"
echo "deploy:   uid=$(id -u deploy)"
echo
echo "Private key для GitHub Secret BEGET_SSH_KEY:  $KEY"
echo "Public key (уже в authorized_keys deploy):    $KEY.pub"
echo "Postgres password:                            $PGPASS_FILE"
echo "App env (не трогать):                         $SHARED_ENV"
