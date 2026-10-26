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
изменился `site/**`). Сборка разделена (с 23.10.2026): GitHub Actions ставит пакеты и делает
тяжёлую компиляцию `next build --experimental-build-mode=compile` (без базы), затем шлёт архив
исходников вместе с `.next` (без кеша) по SSH ключом `DEPLOY_SSH_KEY` — в
`/root/.ssh/authorized_keys` он ограничен forced command и умеет только `deploy <sha> [prod|staging]`.
На сервере остаётся генерация страниц из базы прода (`--experimental-build-mode=generate`) —
секунды CPU и ~0,5 ГБ памяти вместо полной сборки на 2 CPU и до 3 ГБ рядом с работающим продом.
`NEXT_PUBLIC_SITE_URL` вшивается при компиляции: у прода и staging своё значение; сервер сверяет его
с `.env` цели и при расхождении собирает целиком сам.

**Staging и ручная выкатка** — тем же workflow:

```bash
deploy/manual-deploy.sh <ветка|sha> staging   # коммит в origin; ставит obikhod-deploy,
                                          # запускает «Deploy to staging» и ждёт
deploy/manual-deploy.sh                   # прод из origin/main тем же путём
BUILD_ON_SERVER=1 deploy/manual-deploy.sh <sha>   # запасной путь без GitHub: полная сборка на сервере
```

Все пути вызывают на сервере `/usr/local/sbin/obikhod-deploy` (`deploy/server/obikhod-deploy.sh`):
бэкап → распаковка → `pnpm install` → миграции БД (`pnpm migrate`) → генерация (или полная сборка;
с `nice`, чтобы не отнимать CPU у прода) → переключение `current` → `pm2 restart` → health-check
`/api/health/` (нет 200 за 60 с — откат кода) → чистка релизов. Ручной скрипт перед выкаткой ставит на
сервер версию `obikhod-deploy` из того же коммита; ключ CI этого не может — изменения
`deploy/server/` выкатить один раз через `manual-deploy.sh`.

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

## Таймеры панели заявок

План 09, этап 5.4 — [deploy/leads/](leads/). Только прод: на staging нет почты.

| Таймер | Когда | Что делает |
|---|---|---|
| `obikhod-leads-overdue` | раз в минуту | письмо «Просрочена заявка» на `LEAD_NOTIFY_EMAIL`: срок вышел, итог звонка не отмечен; одно письмо на заявку (`overdueNotifiedAt`), просрочки старше 6 часов не поднимает |
| `obikhod-leads-purge` | 05:00, после бэкапа | удаляет фото заявок, закрытых раньше срока «Фото закрытых заявок хранить, дней» («Компания и контакты» → «Заявки», не больше 30 — 152-ФЗ, ст. 21), ставит в заявке «Фото удалены» |

Оба дёргают `POST /api/internal/leads/{overdue,purge-photos}` с заголовком `x-obikhod-cron` = `LEADS_CRON_SECRET`
из `shared/.env`; без секрета адрес отвечает 403. Установка (после выкатки релиза с этими адресами):

```bash
tar -C deploy/leads -cz . | ssh root@89.111.141.79 \
  'rm -rf /tmp/obikhod-leads-src && mkdir /tmp/obikhod-leads-src && tar -xz -C /tmp/obikhod-leads-src && bash /tmp/obikhod-leads-src/install.sh'
```

Проверить: `systemctl list-timers 'obikhod-leads-*'`, журнал — `journalctl -u obikhod-leads-overdue -n 20`.
Запустить вручную: `obikhod-leads-run overdue` или `obikhod-leads-run purge-photos`.

## Операции на сервере

```bash
sudo -u deploy pm2 status | logs obikhod --lines 100 | restart obikhod
sudo -u postgres psql obikhod
cat /home/deploy/obikhod/current/REVISION          # какой коммит на проде
df -h / && du -sh /home/deploy/obikhod/releases /var/backups/obikhod
```

nginx: `/etc/nginx/sites-available/obikhod.ru` (вне репо: `client_max_body_size 25m`,
`proxy_redirect`, www → apex, noindex до команды владельца).

### Кеш страниц

Страницы кешируются (ISR, до 24 ч). Кеш всего сайта сбрасывается сам:
- **правка в админке** — публикация, снятие с публикации, удаление, глобалы, медиа
  (хуки `site/lib/admin/revalidateSite.ts`; сохранение черновика кеш не трогает);
- **seed и скрипты данных** — в конце сами делают POST `http://127.0.0.1:$PORT/api/revalidate/`
  (`site/scripts/_site-revalidate.ts`). Порт берётся из `PORT` в `shared/.env`: на проде `PORT=3000`,
  на staging `PORT=3001` (не копируется из прода — `deploy/staging/setup.sh`).

Вручную (после правки базы через psql): `cd /home/deploy/obikhod/current && sudo -u deploy pnpm revalidate:site`
(staging — то же в `/home/deploy/obikhod-staging/current`) или workflow «Revalidate ISR».
