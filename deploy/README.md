# Deploy и эксплуатация — Обиход

Прод — VPS в РФ `89.111.141.79` (Ubuntu 24.04, 2 CPU / 4 GB + swap), Node 22, pnpm 10, pm2 (процесс
`obikhod` под пользователем `deploy`), nginx + Let's Encrypt, PostgreSQL 16. Сервер поднят
`server-bootstrap.sh` (2026-10-18). Сайт закрыт от индексации в nginx — открывает только владелец.

```
/home/deploy/obikhod/
  current -> releases/<ts>-<sha7>     # активный релиз
  releases/                           # последние 5 (старые чистит obikhod-deploy)
  shared/.env  shared/media/          # симлинкаются в каждый релиз
/var/backups/obikhod/{daily,weekly,pre-deploy}/   # бэкапы (root, 700)
/etc/obikhod/backup.env               # S3 и почта для бэкапов (root, 600)
```

## Выкатка

**Обычный путь — автоматически после мержа в `main`** (`.github/workflows/deploy.yml`, если
изменился `site/**`). Раннер шлёт `git archive <sha> site` по SSH ключом `DEPLOY_SSH_KEY`, который
в `/root/.ssh/authorized_keys` ограничен forced command — умеет только `deploy <sha>`.

**Вручную** (сбой CI, hotfix, изменился сам серверный скрипт):

```bash
deploy/manual-deploy.sh            # origin/main
deploy/manual-deploy.sh <sha>      # конкретный коммит из main; ALLOW_NON_MAIN=1 — обход
```

Оба пути вызывают на сервере `/usr/local/sbin/obikhod-deploy` (`deploy/server/obikhod-deploy.sh`):
бэкап → распаковка → `pnpm install` → миграции БД (`pnpm migrate`) → `build` → переключение
`current` → `pm2 restart` → health-check `/api/health/` (нет 200 за 60 с — откат кода) → чистка релизов. Ручной скрипт перед
выкаткой ставит на сервер версию `obikhod-deploy` из того же коммита; ключ CI этого не может —
изменения `deploy/server/` выкатить один раз вручную.

**Миграции БД** — шаг выкатки (с 20.10.2026, план 09 «Дрейф схемы»; ручной psql из ADR-0016 больше
не нужен). Изменили коллекцию/поле → `pnpm schema:diff` (локально, против свежей копии staging/прода)
→ миграция `site/migrations/<ts>_<имя>.ts` + `.up.sql` + `.down.sql` → `pnpm migrate` локально →
PR. CI строит схему миграциями с нуля и падает, если код разошёлся с ними (`schema:diff --check`).
При выкатке `obikhod-deploy` запускает `pnpm migrate` после бэкапа, до сборки и переключения:

- каждая миграция — в своей транзакции; упала — релиз не переключается;
- миграция обязана быть **совместима со старым кодом** (expand → contract): сначала добавить,
  удалить старое — следующим релизом; в начале `.up.sql` — `SET LOCAL lock_timeout = '10s';`;
- откат кода при провале health-check схему не откатывает; полный откат — pre-deploy бэкап;
- миграцию данных сначала прогнать на staging (это копия прода).

Схема до 20.10.2026 жила на dev-push и ручных миграциях (`site/migrations/legacy/history/`, не
запускаются). Базовая миграция `20261020_120000_baseline` создаёт всю схему с нуля; на старой БД
`scripts/migrate.ts` один раз применяет `migrations/legacy/sync-to-baseline.sql` и отмечает базовую
миграцию применённой.

## Staging — https://staging.obikhod.ru

Копия сайта для показа владельцу до мержа: тот же сервер, своя папка `/home/deploy/obikhod-staging`,
БД `obikhod_staging`, pm2 `obikhod-staging` на :3001, nginx с паролем (`/etc/nginx/staging.htpasswd`,
логин `obikhod`, пароль у владельца) и `noindex`. Писем, Telegram, Метрики и IndexNow нет — их ключи
вырезаны из `shared/.env` staging.

```bash
deploy/manual-deploy.sh <ветка> staging                 # с ноутбука, любая ветка
gh workflow run deploy-staging.yml -f ref=<ветка>       # из GitHub
ssh root@89.111.141.79 obikhod-staging-refresh          # данные: свежий бэкап прода, заявки обезличены
```

Установка (один раз, уже сделано 19.10.2026): `deploy/staging/setup.sh` — см. шапку скрипта.

## Откат

```bash
ssh root@89.111.141.79 'cd /home/deploy/obikhod && ls -1t releases | head -3'
ssh root@89.111.141.79 'ln -sfn releases/<prev> /home/deploy/obikhod/current && sudo -u deploy pm2 restart obikhod'
```

Данные — из бэкапа `pre-deploy-<sha7>` (см. ниже).

## Бэкапы

Установка/обновление (идемпотентно):

```bash
COPYFILE_DISABLE=1 tar -C deploy/backup --no-xattrs -cz . | ssh root@89.111.141.79 \
  'rm -rf /tmp/obikhod-backup-src && mkdir /tmp/obikhod-backup-src && tar -xz -C /tmp/obikhod-backup-src && bash /tmp/obikhod-backup-src/install.sh'
```

| Что | Когда | Где | Хранение |
|---|---|---|---|
| `obikhod-backup` — `pg_dump -Fc` + `media.tgz` | каждый день 03:30 (`obikhod-backup.timer`) | `daily/`, по воскресеньям копия в `weekly/` | 14 дней / 8 недель |
| то же перед выкаткой | каждая выкатка | `pre-deploy/` | 10 последних |
| копия в S3 в РФ (restic, шифрование на сервере) | вместе с ежедневным | `RESTIC_REPOSITORY` | 14 д / 8 н / 12 мес |
| `obikhod-restore-check` — восстановление последнего дампа во временную БД, сверка строк и media; restic check | воскресенье 05:00 | — | — |

Сбой → `obikhod-notify`: письмо через SMTP из `/etc/obikhod/backup.env` (Telegram с сервера
недоступен), без настроек — только журнал. Состояние:

```bash
systemctl list-timers 'obikhod-*'
journalctl -u obikhod-backup -u obikhod-restore-check -n 20 -o cat
journalctl -t obikhod-notify -n 10 -o cat
cat /var/lib/obikhod-backup/last-success-daily /var/lib/obikhod-backup/last-restore-check
```

Пока `RESTIC_REPOSITORY` пуст, бэкапы лежат только на этом сервере и не переживут его потерю.
Бэкапы содержат ПДн клиентов — только серверы в РФ, локально не копировать.

**Восстановление прода:**

```bash
ssh root@89.111.141.79
ls -1t /var/backups/obikhod/daily | head            # или pre-deploy/, weekly/, restic restore latest --target /tmp/r
sudo -u deploy pm2 stop obikhod
sudo -u postgres dropdb obikhod && sudo -u postgres createdb -O obikhod obikhod
sudo -u postgres pg_restore --no-owner --role=obikhod -d obikhod < /var/backups/obikhod/daily/obikhod-<ts>-daily.dump
tar -xzf /var/backups/obikhod/daily/media-<ts>-daily.tgz -C /home/deploy/obikhod/shared   # при необходимости
sudo -u deploy pm2 start obikhod
```

## Операции на сервере

```bash
sudo -u deploy pm2 status | logs obikhod --lines 100 | restart obikhod
sudo -u postgres psql obikhod
cat /home/deploy/obikhod/current/REVISION          # какой коммит на проде
df -h / && du -sh /home/deploy/obikhod/releases /var/backups/obikhod
```

nginx: `/etc/nginx/sites-available/obikhod.ru` (вне репо: `client_max_body_size 25m`,
`proxy_redirect`, www → apex, noindex до команды владельца).
