# 06. Deploy plan — Обиход на VPS

> **Назначение.** Спецификация production-деплоя сайта `obikhod.ru` на VPS `root@155.212.186.204`. Активируется после M1 (когда [`site/`](../site/) собирается и работает локально). До M3 деплоится только для smoke-тестов; production-релиз — M5/M6 по [CLAUDE.md](../CLAUDE.md) roadmap.
>
> **Соавторы (когда задача активизируется):** [agents/devops.md](../agents/devops.md), [agents/cto.md](../agents/cto.md), [agents/backend-developer.md](../agents/backend-developer.md), [agents/legal-advisor.md](../agents/legal-advisor.md) (152-ФЗ).
>
> **Не deploy-скрипт, а контракт.** Этот документ описывает что должно быть сделано, в каком порядке и с какими acceptance criteria. Конкретные команды deployment команда уточнит при подготовке prod (терминал-сессии, доступы, secrets).

## 1. Открытые вопросы (блокируют старт)

1. **Хостинг-провайдер VPS `155.212.186.204`** — `whois` показал только RIPE-блок без явной идентификации. CLAUDE.md immutable пишет «Beget», но IP не выглядит Beget-овским. Перед началом prod-настройки оператор подтверждает фактического провайдера и юрисдикцию ПДн (важно для 152-ФЗ). Команды для проверки: `whois 155.212.186.204 | grep -iE "descr|origin|netname"`, `ssh root@155.212.186.204 'lsb_release -a; df -h; free -m; nproc'`.
2. **Ресурсы VPS** — RAM/CPU/диск/сеть. Минимум для Next.js 16 (Turbopack build) + Payload + Postgres: 4 vCPU, 8 GB RAM, 80 GB SSD. Если меньше — выносим Postgres в отдельный managed-сервис.
3. **S3 для медиа** — выбор провайдера: Beget S3 / Yandex Object Storage / Selectel Object Storage / собственный MinIO на VPS. Влияет на `next/image` loader, `images.remotePatterns`, CSP `img-src` (см. [05_site_structure.md §2.10 п.3](05_site_structure.md)).
4. **Домен `obikhod.ru`** — DNS уже указывает на VPS (подтверждено оператором 2026-04-16). Нужно настроить A/AAAA на www → non-www redirect, DNSSEC опционально.
5. **SSL-сертификат** — Let's Encrypt через certbot (бесплатно, автообновление). Альтернатива — wildcard от провайдера, если потребуются сабдомены.
6. **ИНН в SeoSettings** — на момент prod-релиза ИНН может уже измениться (см. [memory project_inn_temp](../../.claude/projects/-Users-a36-obikhod/memory/project_inn_temp.md)). Проверить актуальность через admin до релиза.

## 2. Архитектура prod-окружения

```
                              ┌─────────────────────────┐
                              │       Cloudflare        │
                              │  (опц. CDN + WAF)       │
                              └────────────┬────────────┘
                                           │
                                ┌──────────▼──────────┐
                                │     obikhod.ru      │
                                │   A 155.212.186.204 │
                                └──────────┬──────────┘
                                           │
                              ┌────────────▼────────────┐
                              │  nginx (host)           │
                              │  - SSL termination      │
                              │  - HTTP→HTTPS redirect  │
                              │  - rate-limit /api/leads│
                              │  - access logs → fs     │
                              └─┬──────────────────────┬┘
                                │                      │
                ┌───────────────▼───┐    ┌─────────────▼────────┐
                │  next.js (3000)   │    │  /admin → next.js    │
                │  (Server)         │    │  (Payload встроен)   │
                └─┬─────────────────┘    └──────────────────────┘
                  │
       ┌──────────┴───────────────────────┐
       │                                  │
┌──────▼───────┐                  ┌───────▼────────┐
│  Postgres 16 │                  │  S3 / Object   │
│  (host или   │                  │  Storage       │
│   managed)   │                  │  (медиа)       │
└──────────────┘                  └────────────────┘
```

Всё на одной ноде (single-VPS) для M1-M3. Горизонтальное масштабирование — только когда трафик потребует (по KPI из [02_growth_gtm_plan.md](02_growth_gtm_plan.md): 22 000 сессий/мес к м12 — single VPS справляется при правильной CWV-настройке).

## 3. Bootstrap VPS (одноразовая настройка)

Ubuntu 24.04 LTS / Debian 12 предполагается.

### 3.1. Базовая защита

```bash
# SSH-ключ вместо пароля (root login disable после настройки sudo-пользователя)
adduser obikhod && usermod -aG sudo obikhod
mkdir -p /home/obikhod/.ssh && nano /home/obikhod/.ssh/authorized_keys
sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh

# Файрволл: только 22, 80, 443
ufw default deny incoming && ufw default allow outgoing
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp
ufw enable

# fail2ban на SSH
apt install -y fail2ban && systemctl enable --now fail2ban

# Автопатч безопасности
apt install -y unattended-upgrades && dpkg-reconfigure -plow unattended-upgrades
```

### 3.2. Стек

```bash
# Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
usermod -aG docker obikhod

# Node.js 24 (для миграций / CLI / сборки)
curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && apt install -y nodejs
npm i -g pnpm@10

# nginx + certbot
apt install -y nginx certbot python3-certbot-nginx
```

### 3.3. SSL

```bash
# DNS должен быть настроен ДО запуска certbot
certbot --nginx -d obikhod.ru -d www.obikhod.ru --email admin@obikhod.ru --agree-tos --redirect
# Автообновление (cron или systemd timer)
systemctl enable --now certbot.timer
```

### 3.4. Структура каталогов

```
/srv/obikhod/
├── current/           # symlink на текущий релиз
├── releases/
│   ├── 2026-04-16-001/
│   ├── 2026-04-16-002/
│   └── ...
├── shared/
│   ├── .env.production    # secrets (chmod 600, owner obikhod)
│   ├── media/             # Payload uploads (если не S3)
│   └── postgres-data/     # если Postgres in-docker
└── backups/
    ├── db/                # ежедневные дампы Postgres
    └── media/             # weekly snapshot
```

## 4. Production env vars

`/srv/obikhod/shared/.env.production` (chmod 600, владелец `obikhod`):

```env
NODE_ENV=production
DATABASE_URI=postgres://obikhod:<strong-password>@localhost:5432/obikhod
PAYLOAD_SECRET=<openssl rand -hex 32>
SITE_URL=https://obikhod.ru
NEXT_PUBLIC_SITE_URL=https://obikhod.ru
REVALIDATE_SECRET=<openssl rand -hex 32>
INDEXNOW_KEY=<32-hex from seo-settings.indexNowKey>

# S3 (после решения по провайдеру)
S3_ENDPOINT=https://s3.<provider>.com
S3_REGION=ru-central1
S3_BUCKET=obikhod-media-prod
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>

# Claude API (фото→смета, M2+)
ANTHROPIC_API_KEY=<key-with-prompt-caching-enabled>

# Sentry
SENTRY_DSN=<dsn>
NEXT_PUBLIC_SENTRY_DSN=<dsn>

# amoCRM webhook
AMOCRM_WEBHOOK_TOKEN=<shared-secret>

# Wazzup24 / Telegram / MAX Bot tokens
TELEGRAM_BOT_TOKEN=<token>
WAZZUP24_API_KEY=<key>
MAX_BOT_TOKEN=<token>
```

**Никогда не коммитим в Git.** Хранение мастер-копии — в 1Password / HashiCorp Vault / pass; rotation 1 раз в полгода.

## 5. CI/CD через GitHub Actions

`.github/workflows/deploy.yml` (создаётся на этапе подготовки prod):

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
    paths: ['site/**']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm, cache-dependency-path: site/pnpm-lock.yaml }
      - working-directory: site
        run: |
          pnpm install --frozen-lockfile
          pnpm payload generate:importmap
          pnpm payload generate:types
          NEXT_PUBLIC_SITE_URL=https://obikhod.ru pnpm build
      - name: Deploy via rsync + restart
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        run: ./scripts/deploy.sh
```

`scripts/deploy.sh` делает:
1. rsync `site/` (без `node_modules`, `.env*`) → новый каталог `releases/<timestamp>/`
2. ssh: `cd releases/<timestamp> && ln -s /srv/obikhod/shared/.env.production .env.production && pnpm install --prod --frozen-lockfile`
3. ssh: миграция БД (см. §6)
4. ssh: атомарное переключение symlink `current` → новый релиз
5. ssh: `systemctl restart obikhod-next` (см. §7)
6. ssh: smoke-тесты (`curl -f https://obikhod.ru/healthz`, `https://obikhod.ru/sitemap.xml`)
7. ssh: hold последние 5 релизов, остальные — `rm -rf`

Rollback: `ln -sfn releases/<previous-timestamp> current && systemctl restart obikhod-next`.

## 6. Database migrations

**Dev (M1):** `db.push: true` в [`payload.config.ts`](../site/payload.config.ts) — schema автоматически синхронизируется с моделью.

**Prod:** переключаемся на explicit migrations:

```typescript
// payload.config.ts (prod-build)
db: postgresAdapter({
  pool: { connectionString: process.env.DATABASE_URI! },
  push: false,
  migrationDir: path.resolve(dirname, 'migrations'),
}),
```

Workflow:
1. На dev: `pnpm payload migrate:create -- "<name>"` — генерирует SQL-миграцию по diff
2. Коммит миграции в Git
3. CI на prod-деплое: `pnpm payload migrate` (idempotent, применяет только новые)
4. Перед деструктивной миграцией (drop column, type change) — обязательный backup БД, окно даунтайма (rolling-deploy без даунтайма требует blue/green — overkill для M1-M6)

## 7. Process management — systemd

`/etc/systemd/system/obikhod-next.service`:

```ini
[Unit]
Description=Obikhod Next.js
After=network.target postgresql.service

[Service]
Type=simple
User=obikhod
WorkingDirectory=/srv/obikhod/current
EnvironmentFile=/srv/obikhod/shared/.env.production
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node /srv/obikhod/current/node_modules/.bin/next start
Restart=on-failure
RestartSec=5
StandardOutput=append:/var/log/obikhod/next.log
StandardError=append:/var/log/obikhod/next.err

[Install]
WantedBy=multi-user.target
```

Логи: `journalctl -u obikhod-next -f` или `tail -f /var/log/obikhod/next.log`.

## 8. nginx config

`/etc/nginx/sites-enabled/obikhod.ru`:

```nginx
server {
    listen 80;
    server_name obikhod.ru www.obikhod.ru;
    return 301 https://obikhod.ru$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.obikhod.ru;
    ssl_certificate     /etc/letsencrypt/live/obikhod.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/obikhod.ru/privkey.pem;
    return 301 https://obikhod.ru$request_uri;
}

server {
    listen 443 ssl http2;
    server_name obikhod.ru;
    ssl_certificate     /etc/letsencrypt/live/obikhod.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/obikhod.ru/privkey.pem;

    client_max_body_size 25M;  # для фото-upload в Payload Media

    # Rate-limit на форму заявок
    limit_req_zone $binary_remote_addr zone=leads:10m rate=5r/m;
    location /api/leads {
        limit_req zone=leads burst=10;
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        include /etc/nginx/proxy_params;
        proxy_buffering on;
    }

    # Long cache на статику Next.js
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 9. Backups

| Что | Частота | Хранение | Кто |
|---|---|---|---|
| Postgres дамп | ежедневно 03:00 | 14 дней локально + 3 мес в S3 | systemd timer + `pg_dump`-скрипт |
| Media (S3) | если не S3 — еженедельно `tar.gz` | 4 недели | rsync на бэкап-сервер |
| `.env.production` | при изменении | 1Password vault | оператор |
| nginx/systemd configs | в Git (`infra/` репо) | unlimited | devops |

Тест восстановления — раз в квартал (раз в полгода после M6, когда стабилизируется).

## 10. Monitoring и оповещения

| Слой | Инструмент | Алерт куда |
|---|---|---|
| Errors | Sentry | Telegram-bot @obikhod_alerts |
| Uptime | UptimeRobot или собственный cron `curl /healthz` | Telegram |
| CWV | Я.Метрика «Скорость» + Lighthouse CI на каждый PR | Slack/TG |
| Disk / RAM / CPU | node_exporter + Grafana Cloud free tier | Telegram |
| Postgres | `pg_stat_statements` + базовый dashboard | по запросу |
| nginx 5xx | `tail | grep 5xx` → Loki/Grafana | Telegram |

`/healthz` route добавляется в Next.js (`app/api/health/route.ts`) — возвращает `{ ok: true, db: 'connected', version: '<git-sha>' }`. UptimeRobot пингует каждые 5 мин.

## 11. Compliance чеклист перед запуском

- [ ] Уведомление в РКН как оператор ПДн отправлено (legal-advisor)
- [ ] Политика конфиденциальности опубликована и сослана из всех форм
- [ ] Cookie-banner с явным согласием перед инициализацией Я.Метрики/Top.Mail.Ru
- [ ] SmartCaptcha (Я.Облако) вместо reCAPTCHA на всех формах
- [ ] CSP headers с allowlist для всех загружаемых третьих доменов (см. [next.config.ts](../site/next.config.ts))
- [ ] HSTS preload submitted (https://hstspreload.org)
- [ ] Я.Вебмастер: подтверждение прав, sitemap, региональность по районам
- [ ] GSC: подтверждение прав, sitemap (вторично)
- [ ] IndexNow ключ опубликован, webhook от Payload работает
- [ ] amoCRM-webhook принимает заявки end-to-end (тестовый лид прошёл)
- [ ] Sentry получает события (тестовая ошибка)
- [ ] ОРД-маркировка работает на рекламных посадочных (если запускаем Я.Директ одновременно)

## 12. Sequencing — когда что делается

| Этап | Что | Когда (по [CLAUDE.md](../CLAUDE.md) roadmap) |
|---|---|---|
| Подготовка | Bootstrap VPS, домен, SSL, nginx, Postgres | M1 (нед. 1–2) — параллельно с локальной разработкой |
| Smoke-deploy | Первый деплой `site/` на staging-поддомен (`staging.obikhod.ru` или порт), без публичного индексирования (`X-Robots-Tag: noindex`) | M2 (нед. 3–4) — после готовности 4 pillar |
| Connect amoCRM/colltracking/мессенджеры | Webhook'и через nginx → Next.js | M3 (нед. 5–6) |
| Public soft-launch | Снятие noindex, регистрация в Я.Вебмастере и Я.Бизнесе, мониторинг | M4 (нед. 7) после programmatic-волны 1 |
| Production HA + backups | Полная BAS, blue/green деплой, runbooks | M6 (нед. 9–10) |

## 13. Что НЕ делаем сейчас

- **Не настраиваем prod до решения по хостинг-провайдеру** (open question 1) — можем потерять день, если перенос потребуется
- **Не выносим Postgres в managed-сервис** на M1-M3 — single VPS дешевле, миграция делается миграциями SQL без даунтайма при росте
- **Не используем Vercel/Netlify** — оплата из РФ + юрисдикция ПДн (CLAUDE.md immutable)
- **Не делаем blue/green** до M6 — overkill для трафика M1-M5
- **Не настраиваем CDN перед проверкой CWV** — Beget/Selectel CDN включается только если nginx + Next.js не вытягивают целевой LCP <2.0s

## 14. Ответственные

| Зона | Owner | Бэкап |
|---|---|---|
| VPS bootstrap, nginx, SSL, systemd | [devops](../agents/devops.md) | [cto](../agents/cto.md) |
| Database migrations, Payload prod-config | [backend-developer](../agents/backend-developer.md) | [cto](../agents/cto.md) |
| GitHub Actions, deploy.sh | [devops](../agents/devops.md) | [cto](../agents/cto.md) |
| Compliance чеклист (152-ФЗ, ОРД) | [legal-advisor](../agents/legal-advisor.md) | оператор |
| Я.Вебмастер / GSC / IndexNow | [tech-seo](../agents/tech-seo.md) | [seo-expert](../agents/seo-expert.md) |
| Sentry / monitoring | [devops](../agents/devops.md) | [analytics-engineer](../agents/analytics-engineer.md) |
| Backup тест восстановления | [devops](../agents/devops.md) | [cto](../agents/cto.md) |

## 15. Acceptance — production-ready (M6 Go/No-Go)

- [ ] `https://obikhod.ru/` отвечает 200, TTFB <400ms, LCP <2.5s (CrUX p75 mobile)
- [ ] `/admin` доступен только через SSH-туннель ИЛИ по basic-auth поверх nginx (опц.)
- [ ] Все коммиты в `main` за последние 14 дней успешно деплоились без даунтайма
- [ ] amoCRM получает 10 тестовых лидов из 10 (100% durability)
- [ ] Я.Метрика считает события заявок и калькуляторов
- [ ] Sentry: 0 critical errors за последние 7 дней
- [ ] Backup восстанавливается за <1 час (тест проведён)
- [ ] Disk usage <70%, RAM usage <80% при пиковой нагрузке
- [ ] HSTS preload подтверждён
- [ ] Я.Вебмастер: 0 критических ошибок схем, ≥80% страниц из sitemap в индексе
