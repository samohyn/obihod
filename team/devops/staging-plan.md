---
title: Staging instance plan — staging.obikhod.ru
team: common (do)
owner: do
requested_by: poseo
created: 2026-05-01
target_ready: 2026-05-15  # W2 end (US-0 Stage 0 — gate W3 dependency)
status: planning  # planning → provisioning → ready
related:
  - specs/EPIC-SEO-CONTENT-FILL/US-0-templates-ux-migration/sa-seo.md (AC-11, AC-13.1)
  - .claude/projects/-Users-a36-obikhod/memory/project_infra.md
---

# Staging instance plan — `staging.obikhod.ru`

## 1 · Контекст

`poseo` запросил отдельный staging-инстанс для US-0 Stage 0 (`EPIC-SEO-CONTENT-FILL`)
для:

- Hosting 8 эталонных URL (AC-11) до Operator gate W3 (deadline 2026-05-22).
- Прогона `lint:schema` против реального origin (AC-6.6: `pnpm lint:schema --url=https://staging.obikhod.ru`).
- Smoke `tov-checker` + axe + Playwright скриншотов на боевой stack (Next 16 + Payload 3 + Postgres 16).

Production остаётся `obikhod.ru`. Staging — изолированный preview-инстанс на той же VPS.

## 2 · Архитектура (single-VPS, port-split)

```
                          Beget VPS 45.153.190.107
                          ┌──────────────────────────────┐
   obikhod.ru     ──TLS──▶│  nginx :443  →  127.0.0.1:3000  (prod Next, systemd unit obikhod-prod)
                          │                                                                 │
   staging.obikhod.ru ──TLS─▶ nginx :443 (basic-auth) → 127.0.0.1:3001 (staging Next, systemd unit obikhod-staging)
                          │                                                                 │
                          │  Postgres 16  ─┬─ obikhod_prod                                  │
                          │                └─ obikhod_staging  (отдельный database, тот же кластер)
                          └──────────────────────────────┘
```

**Решение:** один VPS, два systemd-юнита, два nginx vhost'а, два database в одном Postgres-кластере.
Альтернатива «branch-deploy через GitHub Actions Vercel-style» не выбрана — VPS
паттерн уже отлажен (deploy.yml ssh+systemd), повторное использование быстрее.

## 3 · Компоненты

### 3.1 · DNS

- A-record `staging.obikhod.ru. → 45.153.190.107` через Beget DNS-панель.
- TTL 300s на момент провижининга (потом увеличить до 3600s).
- Проверка: `dig +short staging.obikhod.ru` → `45.153.190.107`.

### 3.2 · TLS

- Let's Encrypt через `certbot --nginx -d staging.obikhod.ru` (тот же паттерн что prod).
- Auto-renew через системный `certbot.timer` (уже работает для prod).
- Проверка: `curl -I https://staging.obikhod.ru/` → `HTTP/2 401` (basic-auth) с валидным сертификатом.

### 3.3 · nginx vhost

`/etc/nginx/sites-available/staging.obikhod.ru.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name staging.obikhod.ru;

    ssl_certificate     /etc/letsencrypt/live/staging.obikhod.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.obikhod.ru/privkey.pem;

    # Basic-auth gate — препятствует случайной индексации Я + Google
    auth_basic "obikhod staging";
    auth_basic_user_file /etc/nginx/.htpasswd-staging;

    # Robots header — дублирует /robots.txt (см. §3.6)
    add_header X-Robots-Tag "noindex, nofollow, noarchive" always;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # robots.txt — обходит basic-auth (нужен для самого факта обхода роботами)
    location = /robots.txt {
        auth_basic off;
        return 200 "User-agent: *\nDisallow: /\n";
        add_header Content-Type text/plain;
    }
}

server {
    listen 80;
    server_name staging.obikhod.ru;
    return 301 https://$server_name$request_uri;
}
```

`/etc/nginx/.htpasswd-staging` — генерируется через `htpasswd -c -B <file> obikhod`,
пароль кладётся в 1Password / Bitwarden оператора + передаётся `poseo` для команды
SEO; не коммитится никогда.

### 3.4 · Postgres database

```sql
-- Через psql от postgres-superuser на VPS:
CREATE DATABASE obikhod_staging OWNER obikhod_app;
GRANT ALL PRIVILEGES ON DATABASE obikhod_staging TO obikhod_app;
```

Reuse того же `obikhod_app` user (одинаковые права, разный database). Альтернатива
«отдельный user + role» — не нужна для preview-инстанса. Если в Stage 1+ будут
секретные данные — пересмотреть.

**Seed:** на старте — пустая БД. `seed-content.ts` (US-0 AC-3) запускается локально
через `OBIKHOD_SEED_CONFIRM=yes pnpm tsx scripts/seed-content.ts` (паттерн ADR-0001).

### 3.5 · `.env.staging` на VPS

`/opt/obikhod/.env.staging` (chmod 600, owner `obikhod_app`):

```bash
NODE_ENV=production
APP_ENV=staging                        # отличается от prod (для логов / Sentry tag)

# DB — отдельный database на том же кластере
DATABASE_URL=postgres://obikhod_app:<pass>@127.0.0.1:5432/obikhod_staging

# Public URL — критично для SEO (canonical, og:url, sitemap.xml)
NEXT_PUBLIC_SITE_URL=https://staging.obikhod.ru

# Payload secret — отдельный (НЕ переиспользовать prod)
PAYLOAD_SECRET=<сгенерировать через `openssl rand -hex 32`>

# Email — staging НЕ шлёт реальные письма (используем mailtrap.io / mailcatcher на 127.0.0.1)
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_FROM_EMAIL=staging@obikhod.ru
SMTP_FROM_NAME="Обиход staging"        # double-quotes обязательны (см. memory feedback_env_example_quoting)

# Telegram bot — тот же bot, но channel staging-only (или completely disabled через env-флаг)
TELEGRAM_BOT_TOKEN=<staging-token-or-prod-token-with-staging-channel>
TELEGRAM_CHAT_ID=<staging-channel-id>
TELEGRAM_ENABLED=false                 # на старте отключаем, включаем когда US-8 MVP готов

# Sentry — отдельный environment tag
SENTRY_DSN=<тот же DSN, но environment=staging>
SENTRY_ENVIRONMENT=staging

# fal.ai — общий ключ (rate-limit одинаковый)
FAL_KEY=<тот же>

# Я.Метрика — отдельный счётчик НЕ нужен (на staging metrika отключена через robots noindex)
NEXT_PUBLIC_YA_METRIKA_ID=             # пусто → клиент не грузит счётчик
```

**Секреты:** генерируются `do` руками на VPS, кладутся в 1Password / GitHub
Actions secret store (`STAGING_*` префикс). НЕ коммитятся в git.

### 3.6 · `robots.txt` + meta-tags

Двойная защита от индексации:

1. **nginx-уровень** (см. §3.3): `add_header X-Robots-Tag "noindex, nofollow, noarchive"`
   на всех ответах + кастомный `/robots.txt` с `Disallow: /`.
2. **Application-уровень**: `next.config.ts` или `app/layout.tsx` читают `APP_ENV`
   и для `staging` рендерят `<meta name="robots" content="noindex, nofollow">` в
   `<head>` каждой страницы. Проверять при билде сайта.

**Почему дубликат:** Я.Робот иногда игнорирует `X-Robots-Tag` если basic-auth срабатывает
до того как заголовок отдан, поэтому meta-tag в HTML — обязателен.

### 3.7 · systemd-юнит `obikhod-staging.service`

`/etc/systemd/system/obikhod-staging.service`:

```ini
[Unit]
Description=Obikhod staging Next.js
After=network.target postgresql.service

[Service]
Type=simple
User=obikhod_app
Group=obikhod_app
WorkingDirectory=/opt/obikhod-staging/site
EnvironmentFile=/opt/obikhod/.env.staging
ExecStart=/usr/bin/pnpm start --port 3001
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/obikhod-staging/stdout.log
StandardError=append:/var/log/obikhod-staging/stderr.log

[Install]
WantedBy=multi-user.target
```

Логи в `/var/log/obikhod-staging/` с logrotate (daily, keep 14 days).

## 4 · Deploy workflow `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy staging

on:
  push:
    branches: [feature/seo-content-fill-stage-0]
  workflow_dispatch:                   # manual trigger (other branches)
    inputs:
      ref:
        description: "Git ref to deploy"
        required: true
        default: "feature/seo-content-fill-stage-0"

concurrency:
  group: deploy-staging
  cancel-in-progress: false            # НЕ отменять in-flight deploy (миграции могут быть в середине)

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.ref || github.ref }}
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter site build

      # Deploy через ssh (тот же паттерн что deploy.yml prod)
      - name: Sync to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: 45.153.190.107
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "site/.next,site/public,site/package.json,site/payload.config.ts,site/payload-types.ts,site/migrations"
          target: /opt/obikhod-staging/

      - name: Restart staging
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: 45.153.190.107
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/obikhod-staging/site
            sudo systemctl restart obikhod-staging
            sleep 5
            curl -fsS -u "${{ secrets.STAGING_BASIC_AUTH }}" https://staging.obikhod.ru/ > /dev/null

      - name: Smoke check
        run: |
          curl -fsS -u "${{ secrets.STAGING_BASIC_AUTH }}" \
            -o /dev/null -w "%{http_code}" \
            https://staging.obikhod.ru/api/health || exit 1
```

**Trigger logic:**

- Auto-deploy на каждый push в `feature/seo-content-fill-stage-0`.
- Manual `workflow_dispatch` для тест-prевью других веток (если track A / B / C
  захотят посмотреть отдельную ветку — например, ветку миграции до merge).
- НЕ запускается на `main` (deploy на prod — отдельный `deploy.yml`).

**Concurrency group:** `deploy-staging` (один deploy одновременно). На push в
середине миграции `cancel-in-progress: false` — не убивать активный.

## 5 · Auth gate (защита от индексации + случайных user)

- HTTP basic-auth на nginx уровне (см. §3.3) — credentials в 1Password,
  раздаются `poseo` (для SEO команды) и оператору.
- В meta-теге HTML `<meta name="robots" content="noindex, nofollow">` (см. §3.6).
- `/robots.txt` отдаётся nginx без basic-auth, чтобы Я.Робот / Googlebot увидел
  `Disallow: /` если случайно зайдёт по DNS-сканеру.

**Не используем IP-allowlist** — `poseo` + `qa-site` + оператор могут работать
с разных мест (VPN / мобильный). Basic-auth достаточно для preview.

## 6 · Smoke checklist (пост-провижининг)

- [ ] DNS: `dig +short staging.obikhod.ru` → `45.153.190.107`
- [ ] TLS: `curl -I https://staging.obikhod.ru/` → `HTTP/2 401`, валидный certificate
- [ ] Basic-auth: `curl -u obikhod:<pass> https://staging.obikhod.ru/api/health` → `200 ok`
- [ ] Postgres: `psql -h 127.0.0.1 -U obikhod_app -d obikhod_staging -c "SELECT 1"` → `1`
- [ ] systemd: `systemctl status obikhod-staging` → `active (running)`
- [ ] Logs: `/var/log/obikhod-staging/stdout.log` пишется
- [ ] robots.txt: `curl https://staging.obikhod.ru/robots.txt` → `Disallow: /`
- [ ] Meta-robots в HTML: `curl -u obikhod:<pass> https://staging.obikhod.ru/ | grep noindex` → есть
- [ ] Auto-deploy: push в `feature/seo-content-fill-stage-0` → workflow зелёный → restart staging → /api/health 200

## 7 · ETA

| Этап | Дата | Owner |
|---|---|---|
| DNS A-record | 2026-05-04 (W2 W1) | `do` |
| nginx vhost + Let's Encrypt | 2026-05-05 | `do` |
| Postgres `obikhod_staging` database | 2026-05-05 | `do` (поручается `dba` apruv) |
| `.env.staging` на VPS | 2026-05-06 | `do` |
| systemd-юнит `obikhod-staging` | 2026-05-06 | `do` |
| `deploy-staging.yml` workflow | 2026-05-07 | `do` |
| First successful deploy + smoke pass | 2026-05-08 (W2 W3) | `do` |
| Готов к US-0 эталонам | **2026-05-15 (W2 end)** | `do` → `poseo` |

Buffer 7 дней до Operator gate W3 (2026-05-22).

## 8 · Риски и митигации

### R-S1 — Beget VPS 2×CPU/2GB не выдержит 2 Next-инстанса (P=0.4, High)

**Описание:** Текущая VPS 2GB RAM, prod-Next ~600MB resident, staging ещё ~600MB +
build-time piki до 1.5GB. Postgres ~200MB. Запас может схлопнуться при одновременных
билде на staging + prod traffic.

**Митигация:**
- Включить swap 2GB на VPS (если ещё нет): `fallocate -l 2G /swapfile && mkswap && swapon`.
- Build для staging запускать в GitHub Actions runner (compute-в-CI), на VPS
  только `pnpm start` без билда — экономит RAM на pики.
- Monitoring: `vmstat 5` + alert на `swap_used > 1GB` или `mem_available < 200MB`
  (через простой cron + Telegram alert; полноценный monitoring — отдельный
  backlog-пункт `project_cicd_backlog.md` #3 «uptime monitor»).
- **Эскалация:** если RAM-пики ломают prod (latency p99 > 500ms или OOM-kill в
  dmesg) → апгрейд VPS до 4GB RAM (Beget панель, online, ~5 минут даунтайма).
  Заложен в memory `project_shop_separate_team.md` (для shop тоже 4GB).

### R-S2 — Я.Робот игнорирует basic-auth и индексирует staging (P=0.2, High)

**Описание:** Я.Робот прошёл basic-auth (бывает редко), индексирует HTML, бренд
обрастает дублирующими URL в Я.Поиске → SEO штраф (duplicate content).

**Митигация:**
- Двойная защита: basic-auth на nginx + `<meta name="robots" content="noindex">`
  + `/robots.txt: Disallow: /` без basic-auth.
- После 2 недель — проверка `site:staging.obikhod.ru` в Я.Вебмастере. Если URL
  попали — добавить в Я.Вебмастер → Удалить из поиска.
- DNS subdomain-only: НЕ используем `obikhod.ru/staging/` (path-based), чтобы
  prod-canonical не пересекался.

### R-S3 — TLS-сертификат для subdomain не выпускается (P=0.1, Low)

**Описание:** Let's Encrypt rate-limit (50 certificates/week per registered domain).
Если оператор активно тестирует — может попасть в лимит.

**Митигация:**
- Использовать стандартный flow (один cert на staging.obikhod.ru — далеко от лимита).
- В случае отказа Let's Encrypt — fallback на `acme.sh` с другим CA (ZeroSSL).

### R-S4 — Деплой ломает prod через общий Postgres-кластер (P=0.2, Medium)

**Описание:** Migration script ошибочно подключился к `obikhod_prod` вместо
`obikhod_staging` → дамаг prod-данных.

**Митигация:**
- Hardcode `DATABASE_URL` в `.env.staging` файле (НЕ в коде). Скрипт читает только
  `process.env.DATABASE_URL`, не имеет fallback.
- В `seed-content.ts` (US-0) проверка safety-gate (`OBIKHOD_SEED_CONFIRM=yes`) +
  обязательный `process.env.NEXT_PUBLIC_SITE_URL.includes('staging')` assert
  перед write-операциями. Паттерн ADR-0001.
- Бэкап prod-DB перед каждой миграцией (cron `obikhod-backup.sh` на VPS, daily).

## 9 · Out-of-scope (НЕ делаем сейчас)

- Multi-region staging (только одна VPS Beget).
- Blue-green deploy на staging (одинокий инстанс, restart = ~5s downtime, OK для preview).
- Helm / Kubernetes (избыточно для одного preview-инстанса).
- Отдельный Redis на staging (приложение не использует Redis сейчас).
- Visual regression CI (Chromatic / Percy) — backlog после W14 (см. план US-0 §«Что НЕ делаем»).
- HTTPS pinning / mTLS — preview-инстанс, не критично.

## 10 · Зависимости и блокеры

- **Beget DNS-доступ** — оператор уже залогинен (memory `project_infra.md`); `do`
  делает DNS-правку через панель или API.
- **VPS sudo** — `do` имеет ssh + sudo (для systemd, nginx, certbot).
- **GitHub secrets** — `STAGING_BASIC_AUTH` (формат `user:pass` для curl), `VPS_SSH_KEY`
  (тот же что для prod), `STAGING_DATABASE_URL` если решим инжектить через secrets,
  а не env-файл.
- **`dba` apruv** — для создания `obikhod_staging` database (формальность; SQL-команды
  тривиальные).

## 11 · Hand-off log

- `2026-05-01 22:50 · poseo → do: запрос на staging-инстанс staging.obikhod.ru, deadline W2 (2026-05-15), для US-0 AC-11/AC-13 эталонов`.
- `2026-05-01 23:00 · do → poseo: план провижининга готов (этот файл). ETA первый
  deploy 2026-05-08, готовность к US-0 эталонам 2026-05-15. Открытый вопрос: апгрейд
  VPS до 4GB до Stage 2 (US-2 batch ~150 SD) — поднять с оператором отдельно.`

## 12 · Открытые вопросы для оператора

1. **Апгрейд VPS до 4GB RAM** — нужен ли сейчас (вместе со staging) или отложить
   до Stage 2 / shop launch? Memory `project_shop_separate_team.md` упоминает что
   апгрейд обязателен для shop. Если делаем сейчас — staging провижининг проще
   (без R-S1). Цена Beget — ~+500₽/мес.

2. **Basic-auth credentials** — кому раздавать (только `poseo` + оператор; или
   ещё `qa-site`, `cw`, `art`)? `do` рекомендует: `poseo` + оператор, остальным
   через `poseo`.

3. **Telegram-bot на staging** — отдельный bot или общий с prod (с фильтром по
   chat_id)? `do` рекомендует общий bot, отдельный chat_id = staging-channel; на
   старте `TELEGRAM_ENABLED=false`, включаем когда US-8 MVP merge на main.

4. **Я.Метрика на staging** — отключаем полностью (`NEXT_PUBLIC_YA_METRIKA_ID=`
   пусто) ИЛИ отдельный счётчик для preview-аналитики? `do` рекомендует
   отключить — staging-трафик исказит prod-метрики, для отладки целей хватает
   real-time prevalence на prod после deploy.
