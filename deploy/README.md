# Deploy — Обиход

Два workflow в `.github/workflows/`:

- **[ci.yml](../.github/workflows/ci.yml)** — на каждый PR и push в main:
  type-check → lint → format:check → build → Playwright E2E с Postgres service container.
  Работает из коробки, ничего не требует.

- **[deploy.yml](../.github/workflows/deploy.yml)** — выкатка на Beget.
  Запускается **только вручную** (`workflow_dispatch`), пока не подгружены secrets.
  После подачи доступов можно включить `on: push: branches: [main]`.

## Что нужно от тебя (доступы)

Подать в Settings → Secrets and variables → Actions (после создания GitHub-репо).

### SSH и хостинг на Beget

| Secret                | Что это                                                        | Пример                            |
|-----------------------|----------------------------------------------------------------|-----------------------------------|
| `BEGET_SSH_HOST`      | IP или hostname VPS/Cloud на Beget                             | `185.125.xxx.xxx` или `srv.obihod.ru` |
| `BEGET_SSH_PORT`      | Порт SSH (опционально, по умолчанию 22)                        | `22`                              |
| `BEGET_SSH_USER`      | Пользователь SSH (НЕ root — отдельный deploy-юзер)             | `deploy`                          |
| `BEGET_SSH_KEY`       | Приватный SSH-ключ (RSA/ED25519), публичный — в `~/.ssh/authorized_keys` на Beget | `-----BEGIN OPENSSH PRIVATE KEY-----\n…\n-----END OPENSSH PRIVATE KEY-----` |
| `BEGET_DEPLOY_PATH`   | Абсолютный путь на сервере, где живёт приложение               | `/home/deploy/obikhod`            |
| `BEGET_APP_NAME`      | Имя процесса в PM2 (опционально, по умолчанию `obikhod`)       | `obikhod`                         |

### Переменные приложения на проде

| Secret                 | Что это                                                  |
|------------------------|----------------------------------------------------------|
| `DATABASE_URI`         | `postgres://user:pass@host:5432/db` — БД на Beget        |
| `PAYLOAD_SECRET`       | Случайные 32+ байта (`openssl rand -hex 32`)             |
| `NEXT_PUBLIC_SITE_URL` | `https://obihod.ru` (основной публичный URL)             |
| `REVALIDATE_SECRET`    | Случайный 32+ байтов для webhook Payload → Next          |
| `INDEXNOW_KEY`         | 32 hex-символа — ключ IndexNow для Я.Вебмастера/Bing     |

### Инструкция подготовки Beget-сервера (один раз)

Я дам тебе пошаговую инструкцию, когда ты подтвердишь, что VPS заказан. Там будет:

1. Создать deploy-юзера и отключить ему `sudo`, шелл `/bin/bash`
2. Добавить публичный SSH-ключ в `~/.ssh/authorized_keys`
3. Установить Node 22 (через nvm или nodesource), pnpm 10 через corepack
4. Установить PM2 глобально + автостарт (`pm2 startup`)
5. Установить Postgres 16 (нативно или через Beget managed)
6. Положить `.env` в `$BEGET_DEPLOY_PATH/shared/.env` (симлинкуется в релиз)
7. Настроить nginx: `upstream → localhost:3000`, SSL через Let's Encrypt
8. Прогнать первый деплой вручную, проверить smoke

## Что уже работает локально (проверено)

- `pnpm run type-check` → 0 ошибок
- `pnpm run lint` → 0 errors, 118 warnings (baseline `no-explicit-any`, убираем постепенно)
- `pnpm run format:check` → clean
- `pnpm run build` → ✓ 16 страниц сгенерированы
- `pnpm run start` + Playwright E2E → 8/8 зелёных

## Ручной деплой — как запускать (пока нет auto-deploy на push main)

1. GitHub → Actions → Deploy to Beget → Run workflow
2. В поле confirm ввести `deploy`
3. Ждать зелёного чек. Smoke-проверка в конце: `curl -I $NEXT_PUBLIC_SITE_URL`

Rollback на предыдущий релиз (вручную на сервере):

```bash
ssh deploy@$BEGET_SSH_HOST
cd $BEGET_DEPLOY_PATH
ls -1t releases/ | head -2   # текущий и предыдущий
ln -sfn releases/<previous-sha> current
pm2 reload obikhod --update-env
```

## Как перевести deploy в auto-mode на push main

Когда смоуки стабильны (≥3 успешных manual-деплоя подряд):

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
  workflow_dispatch:
    …
```

И снять `confirm` gate в preflight. До тех пор — только manual.
