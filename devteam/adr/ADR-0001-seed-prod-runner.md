# ADR-0001: Способ запуска seed-скрипта на prod-VPS (US-1)

**Дата:** 2026-04-23
**Статус:** Accepted (оператор делегировал auto-apr, 2026-04-23)
**Автор:** tamd
**Контекст US:** US-1-seed-prod-db

## Контекст

Prod-VPS Обихода (`45.153.190.107`, Beget) развёрнут, `obikhod.ru` отдаёт 200 на
`/api/health?deep=1`, но БД пуста: 0 записей в `services / districts /
service-districts / cases / persons`. Публичный запуск и подача sitemap в
Яндекс.Вебмастер заблокированы.

US-1 (`devteam/specs/US-1-seed-prod-db/`) — закрытие этого блокера: одноразовый
seed-прогон, который наполняет БД 4 услугами × 7 пилотными районами (28
service-districts) + 1 mock-Case + 1 Persons + SeoSettings. `ba.md` и `sa.md`
утверждены оператором 2026-04-23. Открытый вопрос, оставленный `sa` для `tamd`
(§9 sa.md) — **как именно запускать seed в prod**.

Ограничения, которые формируют решение:

1. **Хрупкость CLI.** `pnpm seed` = `tsx --env-file=.env.local scripts/seed.ts`.
   Локально у оператора падает на `@next/env loadEnvConfig` под Next 16 / Payload
   3.83 / Node 24 (handoff 2026-04-23; комментарий в `site/app/api/seed/route.ts`
   подтверждает, что проблема известна). На VPS Node 22 (`nvm` + systemd для
   PM2) — поведение может отличаться, но риск повторения сохраняется.
2. **Идемпотентность = единственная защита от дублей.** Composite-uniq
   `(service, district)` и uniq по `slug` — только на уровне Payload-валидации
   (ADR для `dba`: подтвердить DB-constraint в follow-up). Повторный прогон
   безопасен только за счёт `findOneBySlug` / `find(where=and(...))`.
3. **Риск затирания ручных правок `cw`.** Seed создаёт placeholder-тексты; после
   релиза `cw` вправе редактировать их через `/admin`. Второй прогон seed не
   должен обновлять существующие строки (sa §5.3, AC-1.3.2).
4. **Риск запуска на dev-БД с prod-флагом и наоборот.** `do` и CI могут случайно
   получить `DATABASE_URI` prod-а при неправильной копипасте — нужен механизм,
   который распознаёт контекст до любого `INSERT`.
5. **HTTP-вариант `app/api/seed/route.ts` существует, но опасен.** Защищён
   только `x-revalidate-secret`, тем же, что использует `/api/revalidate`.
   Утечка `REVALIDATE_SECRET` даёт любому в интернете право писать в prod-БД.
   `sa` пометил route deprecated и требует удаления в follow-up US.
6. **Стек зафиксирован.** Никаких новых runtime-зависимостей (в частности
   `dotenv` — см. §«Альтернатива 3»), если можно обойтись встроенными
   средствами Node 22 (`--env-file`) или явным `export` в shell.
7. **Deploy pipeline — rsync + PM2 на Beget.** Релиз = `releases/<sha>/` →
   `current` symlink, env подтягивается через `ln -sfn shared/.env .env` в
   cwd релиза (см. `deploy.yml` шаг «link shared .env»).

## Решение

### Основное — `pnpm --dir site seed` через SSH в свежем релизе, env из `shared/.env`

Оператор (роль `do`, вручную, по записи в QA-отчёте) выполняет одноразовый
прогон:

```bash
ssh deploy@45.153.190.107
cd /home/deploy/obikhod/current
# shared/.env уже симлинкнут как site/.env деплоем (deploy.yml)
# но tsx --env-file в package.json смотрит на .env.local — поэтому
# экспортируем переменные вручную для текущей shell-сессии:
set -a
. ./.env          # подгружает DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL, ...
set +a
export OBIKHOD_SEED_CONFIRM=yes
# Без --env-file (иначе tsx попытается прочитать несуществующий .env.local):
node --import tsx scripts/seed.ts
```

Чтобы не требовать ручной правки `package.json` под prod, `be3/be4` добавляют
отдельный npm-скрипт **`seed:prod`**:

```jsonc
// site/package.json
"seed": "tsx --env-file=.env.local scripts/seed.ts",
"seed:prod": "tsx scripts/seed.ts"   // без --env-file; env экспортируется внешне
```

На prod оператор запускает `pnpm seed:prod` (после `set -a; . ./.env; set +a`).
На локали/CI используется существующий `pnpm seed` — обратно совместимо.

**Почему именно так:**

- Используется единственный источник истины для prod-env (`shared/.env`),
  уже симлинкнутый в `current/.env` деплоем. Ничего не дублируем.
- Обходим известный баг `@next/env loadEnvConfig`: не вызываем Next-env-loader
  вообще — `scripts/seed.ts` импортирует только `payload` + `payload.config.ts`,
  которые читают `process.env.DATABASE_URI` / `PAYLOAD_SECRET` напрямую (см.
  `payload.config.ts:48, 51`). `--env-file` у `tsx` — единственное место, где
  подключался `@next/env`-подобный loader через цепочку; убрав его, получаем
  чистый Node 22 ESM.
- Node 22 на VPS (nvm-managed, systemd для PM2) поддерживает `tsx` через loader
  и уже прогоняет prod-сборку. Дополнительных рантайм-зависимостей не добавляем.
- SSH-сессия — атомарна, логи пишутся в `~/.bash_history` + stdout перехватывается
  в QA-отчёт. Отсутствие промежуточных инфраструктурных слоёв (GitHub Actions,
  HTTP-роуты) означает, что единственная точка отказа — команда, которую ввёл
  человек; и у неё есть safety-gate (см. ниже).

### Fallback — `workflow_dispatch` step в отдельном workflow `.github/workflows/seed-prod.yml`

Триггер переключения: **если `pnpm seed:prod` падает на VPS из-за окружения**
(Node 22 all-of-sudden начинает ломать `tsx`, `payload` не резолвит config,
`getPayload` теряет таймаут при подключении к локальному Postgres через SSH с
неожиданным PATH). Критерии «падает» фиксируются в QA-отчёте: не прошёл
safety-gate — не fallback; не подключился к БД за 30 сек — fallback; Payload
бросил ошибку валидации на конкретной записи — не fallback (это баг кода seed,
чинит `be3/be4`).

Скелет fallback-workflow (`do` реализует по потребности, не сейчас):

```yaml
# .github/workflows/seed-prod.yml
on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Введи "seed-prod" для подтверждения'
        required: true
jobs:
  seed:
    runs-on: ubuntu-latest
    if: ${{ inputs.confirm == 'seed-prod' }}
    steps:
      - uses: actions/checkout@v4
      - name: SSH + run seed
        run: |
          ssh -i ~/.ssh/deploy_key ${{ secrets.BEGET_SSH_USER }}@${{ secrets.BEGET_SSH_HOST }} \
            "cd /home/deploy/obikhod/current && \
             set -a && . ./.env && set +a && \
             OBIKHOD_SEED_CONFIRM=yes pnpm seed:prod 2>&1 | tee -a /var/log/obikhod/seed-\$(date +%Y%m%dT%H%M%S).log"
```

Секреты SSH уже залиты (handoff 2026-04-23). Fallback **не** используется по
умолчанию — только если прямой SSH-прогон оказался невоспроизводимым.

HTTP-вариант `app/api/seed/route.ts` **исключён** (см. альтернативу 3).

### Safety-gate (встраивается в `scripts/seed.ts` `be3/be4`)

Комбинация двух проверок, обе обязательны:

```ts
// В начале main(), до getPayload(config):
const dbUri = process.env.DATABASE_URI ?? ''
const isProdDb =
  /(^|@|\/)(45\.153\.190\.107|db\.obikhod\.ru|obikhod\.ru)(:|\/|$)/.test(dbUri)
  || process.env.OBIKHOD_ENV === 'production'

if (isProdDb) {
  if (process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
    console.error(
      'ABORT: prod-БД обнаружена в DATABASE_URI, ' +
      'но OBIKHOD_SEED_CONFIRM=yes не выставлен. ' +
      'Запуск отменён без изменений в БД.',
    )
    process.exit(1)
  }
  console.log(`⚠ prod-режим: подтверждён через OBIKHOD_SEED_CONFIRM=yes`)
}
```

**Что именно блокирует каждая проверка:**

1. **Regex по `DATABASE_URI`** — защищает от случайного запуска против prod-БД
   из неправильного окружения (например, `do` по ошибке экспортировал prod-env
   в локальной shell). Если DSN содержит prod-хост — срабатывает strict-режим.
   Альтернативное срабатывание через `OBIKHOD_ENV=production` — резерв на случай
   смены IP/hostname prod-БД без правки regex (включается `do` через
   `shared/.env`).
2. **`OBIKHOD_SEED_CONFIRM=yes`** — защищает от повторного прогона на prod по
   инерции и от запуска из CI без явного input-подтверждения. Флаг ставится
   только в той SSH-сессии, где оператор/`do` сознательно вводит команду.

**Stdin-подтверждение отвергнуто:** не работает в неинтерактивном SSH / в
`workflow_dispatch` (stdin закрыт), даёт ложное чувство безопасности при copy-paste.

**Идемпотентность как третья линия защиты** — уже в коде (`findOneBySlug`,
composite-find). Safety-gate не проверяет «БД уже заполнена» — это должен
сказать лог SUMMARY (sa §5.6). Повторный прогон с флагом допустим и ожидаем
(AC-1.3.1).

### Где хранится артефакт запуска

**Двойная фиксация, без новых инфраструктурных слоёв:**

1. **stdout в файл на VPS.** Оператор/`do` перенаправляет stdout в
   `/var/log/obikhod/seed-<UTC-timestamp>.log` (директория создаётся `do` один
   раз, owner = `deploy:deploy`, chmod 750). Ротация — через существующий
   pm2-logrotate-паттерн (см. `deploy/README.md` §pm2-logrotate: 10 MB × 7
   файлов, gzip) — применяется вручную для этой поддиректории.

   ```bash
   OBIKHOD_SEED_CONFIRM=yes pnpm seed:prod 2>&1 \
     | tee -a /var/log/obikhod/seed-$(date -u +%Y%m%dT%H%M%SZ).log
   ```

2. **Копия лога в QA-отчёт US-1** (`devteam/specs/US-1-seed-prod-db/qa.md`):
   `qa1/qa2` копирует содержимое `seed-<timestamp>.log` в раздел «Прогон
   seed на prod». Это даёт неизменную версионированную запись, доступную
   всей команде без SSH.

**Отдельная таблица `seed_runs` в БД отвергнута** в рамках US-1: требует
миграции (противоречит REQ-4.1 «не меняем схему в US-1») и добавляет сложность
без выигрыша. Backlog: в будущей US, когда seed превратится в периодический
refresh staging-окружения, `dba` + `be3/be4` могут ввести `seed_runs`
(started_at, finished_at, actor, summary_json, success). Сейчас — не нужно.

### Rollback-план

**Шаг 0 (до прогона, обязателен):** `do` выполняет `/usr/local/bin/obikhod-backup.sh`
вручную (скрипт уже существует — `deploy/README.md` §«бэкапы»). Имя бэкапа
(формат `/var/backups/obikhod/daily/obikhod-<UTC>.dump`) фиксируется в QA-отчёте.
Бэкап держится минимум 7 дней (retention daily).

**Шаг 1 (если seed сломал данные):** Rollback — `pg_restore` из бэкапа,
процедура уже описана в `deploy/README.md`:

```bash
sudo -u postgres pg_restore -d obikhod --clean --if-exists \
  /var/backups/obikhod/daily/obikhod-<TS>.dump
```

**Специфика нашего случая:**

- БД была **пустая** до US-1, поэтому «восстановить до US-1» = `TRUNCATE` 6
  коллекций, затронутых seed. `dba` подтверждает перед прогоном, что pre-seed
  состояние = «пустые коллекции + заполненные `users` (админы)». Бэкап до
  US-1 — это фиксация этого состояния.
- PM2 останавливать для rollback **не надо**: seed не меняет схему (REQ-4.1),
  код релиза не зависит от объёма данных (sitemap.ts корректно обрабатывает
  пустой Payload — см. handoff §«sitemap тянет Services/Districts/programmatic»).
- После rollback повторный прогон безопасен: код seed-скрипта идемпотентен на
  пустой БД.

**Irreversible-точка:** нет. Все операции seed обратимы через pg_restore.

### Кто и когда запускает

- **Ответственный (R):** `do` (DevOps) — прямо по WORKFLOW §4 RACI фазы 11
  Release, но для seed это строго pre-release step.
- **Accountable (A):** `po` (решает, когда публичный запуск актуален; seed
  прогоняется за часы-сутки до подачи sitemap в Яндекс.Вебмастер).
- **Consulted (C):** `dba` (бэкап, проверка отсутствия конфликтов slug перед
  прогоном), `tamd` (этот ADR), `cr` (валидация кода seed-скрипта до prod-прогона).
- **Informed (I):** оператор (финальная отмашка), `qa1/qa2` (постпрогонная
  верификация по AC), `seo2` (готовность подавать sitemap).

**Триггер:** после merge PR с расширенным `scripts/seed.ts` в `main` +
успешный CI + apr `cr`. До первого pointing-а внешнего трафика на
`obikhod.ru` (Яндекс.Директ / Вебмастер). Одноразово; повторные прогоны —
для refresh staging-окружения или восстановления после инцидента.

### Совместимость с Node 22 на VPS

Ключевое: **не используем `--env-file`** на prod, обходим известный
несовместимый с Next 16 / Payload 3.83 путь инициализации.

Фактический вызов на VPS:

```
tsx scripts/seed.ts
```

`tsx` ≥ 4.21 (`site/package.json`) использует ESM-loader Node 22 напрямую, без
предзагрузки `@next/env`. `scripts/seed.ts` импортирует `payload.config.js`
(скомпилированный? — нет: `tsx` транспилирует `.ts` → `.js` в памяти); в
`payload.config.ts` нет вызовов `loadEnvConfig` / `@next/env`, только прямое
чтение `process.env.*` (строки 48, 51). Значит, если окружение уже
проэкспортировано (`set -a; . ./.env; set +a`), prod-seed работает без
«обходного» IP-allowlist HTTP-роута.

**Проверка на staging перед первым prod-прогоном обязательна.** `do` +
`be3/be4` прогоняют на локальном Docker Postgres, затем — если есть staging-VPS
с Node 22 — на нём (пока staging нет, см. open questions). Отчёт — в QA.

Если `tsx scripts/seed.ts` всё-таки падает на Node 22 по причине,
не связанной с `--env-file` (например, Payload 3.83 ломается в
standalone-запуске без Next.js runtime) — переходим на **fallback**
(`workflow_dispatch`-workflow, см. выше). Прецедент уже закрыт работающим
`app/api/seed/route.ts`, т.е. Payload внутри Next.js-процесса однозначно
работает; fallback-workflow использует этот же путь, но через SSH-прокси.
HTTP-эндпоинт напрямую **не открываем наружу** — см. альтернативу 3.

## Альтернативы

### А1. `pnpm seed` как есть (`tsx --env-file=.env.local`) через SSH

- **Плюсы:** ноль изменений в `package.json` и коде.
- **Минусы:**
  - Требует `.env.local` на VPS, но сейчас там `shared/.env` → `current/.env`.
    Нужно либо сделать симлинк `.env.local → .env`, либо копию.
  - `--env-file` у `tsx` под Node 22 + Next 16 — тот самый баг
    `@next/env loadEnvConfig` (handoff). Высокий риск повторить локальную
    историю на prod.
  - Семантически запутывает: `.env.local` — dev-convention Next.js, а здесь
    prod.
- **Вердикт:** отвергнуто. Новый скрипт `seed:prod` без `--env-file` решает
  проблему чище.

### А2. Экспорт env через pm2-env / копию .env в `seed:prod` script

Вариант: `pnpm exec dotenv -e .env -- tsx scripts/seed.ts` или собственный
wrapper `dotenv.config({ path: './.env' })` в начале `scripts/seed.ts`.

- **Плюсы:** не нужно `set -a; . ./.env; set +a`.
- **Минусы:**
  - `dotenv` — новая зависимость (runtime), её надо обосновывать по
    `tamd`-гейту (нет обоснования: `set -a; .` работает из коробки).
  - Next.js 16 сам подтягивает `.env` через `@next/env` — вводить второй
    loader (`dotenv`) = двойная инициализация, потенциальные конфликты
    приоритета.
  - Node 22 `--env-file=/path/to/.env` — встроенный аналог `dotenv` без
    зависимости. Но он не работает через `tsx --env-file` (см. А1).
    Прямой вызов `node --env-file=/home/deploy/obikhod/current/.env
    --import tsx scripts/seed.ts` технически возможен, но путает пайплайн и
    требует абсолютного пути.
- **Вердикт:** отвергнуто. `set -a; . ./.env; set +a` — стандартный POSIX-
  паттерн, нулевые зависимости, явная семантика.

### А3. HTTP-вызов `/api/seed` с IP-allowlist + secret header

- **Плюсы:** обходит любые проблемы с CLI / env: seed запускается внутри уже
  живого Next.js-процесса под PM2, `@payload-config` резолвится через alias,
  как в `app/api/seed/route.ts:3`.
- **Минусы:**
  - Route сейчас защищён только `x-revalidate-secret` — тем же, что и
    `/api/revalidate`. Утечка секрета = запись в prod-БД со стороны интернета.
    Эскалация риска несоразмерна выигрышу.
  - Даже с IP-allowlist: nginx-правило `allow <runner-ip>` требует либо
    статических runner-IP (GitHub Actions их не даёт — диапазон меняется),
    либо self-hosted runner, либо VPN. Сложность > пользы.
  - `sa` явно пометил route deprecated и требует удалить после US-1 (sa §8).
  - Нарушает `hexagonal-architecture`-принцип: seed — domain-level операция
    обслуживания БД, её канал — SSH-shell, а не публичный HTTP.
- **Вердикт:** отвергнуто. Route **удаляется** в follow-up US после US-1
  (уже в scope). Если fallback понадобится — используем SSH через GitHub
  Actions, а не открытый HTTP.

### А4. Отдельный step в существующем `.github/workflows/deploy.yml`

Встроить seed как step после `pm2 start`, триггерится только при
`workflow_dispatch` с отдельным input `run-seed=yes`.

- **Плюсы:** один pipeline для deploy + seed.
- **Минусы:**
  - Перемешивает ответственность: deploy (частая операция, автомат) и seed
    (одноразовая операция, ручная). Нарушает single-responsibility workflow.
  - Любая ошибка в seed-логике будет падать deploy-workflow. Сейчас deploy
    должен остаться максимально простым (handoff: «CI/CD полностью рабочий»).
  - Сложнее откатить: неудачный seed в середине deploy оставляет релиз в
    полупрогнанном состоянии.
- **Вердикт:** отвергнуто. Отдельный workflow `seed-prod.yml` (fallback)
  лучше, чем slot в `deploy.yml`.

### А5. Payload migrations (`payload migrate:create` + data-migration)

- **Плюсы:** каноничный способ Payload 3 для детерминированного наполнения БД;
  встроенное версионирование в `site/migrations/`.
- **Минусы:**
  - Нарушает REQ-4.1 (ba.md + sa.md): US-1 явно исключает переход на migration-
    workflow (сейчас `payload.config.ts` — `push: true`, не managed migrations).
  - Data-migrations в Payload выполняются при старте приложения (`pnpm start`),
    что при 28 + 4 + 7 + 1 записей и pm2 restart даёт задержку первого ответа
    после деплоя.
  - Откат data-migration — нетривиален; проще pg_restore.
- **Вердикт:** отвергнуто для US-1. Отдельная US «Payload migrations» уже
  зафиксирована как follow-up (ba §6, sa §9). Там, при наличии managed
  migrations, seed может быть переписан как migration — это будет отдельный
  ADR.

### А6. Ручной ввод записей через Payload Admin UI

- **Плюсы:** нет кода, минимум рисков для БД.
- **Минусы:**
  - 28 + 4 + 7 + 1 + 1 = 41 запись с длинными текстами, Lexical-полями,
    кросс-ссылками. Оценка — 6-8 часов ручной работы на каждый прогон.
  - Не воспроизводимо для staging-refresh (GOAL-4 ba.md).
  - Высокий риск человеческой ошибки в падежах, grep-валидации TOV и т.п.
- **Вердикт:** отвергнуто как основной способ. Как резерв после успешного
  seed — `cw` правит тексты через Admin UI (idempotency гарантирует
  сохранность правок).

## Последствия

### Плюсы

- **Минимум движущихся частей.** Один npm-скрипт (`seed:prod`), одна SSH-
  сессия, один env-источник (`shared/.env`). Нет новых зависимостей, нет
  открытых наружу эндпоинтов, нет дополнительных workflow в CI (до fallback).
- **Обход известного бага** `@next/env loadEnvConfig` — без попыток его
  «починить», просто не активируя проблемный код-путь.
- **Safety-gate двусторонний.** Regex ловит prod-хост → требует флаг.
  Пропустить нельзя ни случайным `export`-ом, ни забытым `OBIKHOD_SEED_CONFIRM`.
- **Reversible.** Бэкап до прогона + pg_restore = полный rollback за < 5 мин.
  Irreversible-точек нет.
- **Совместимо с follow-up.** Когда придёт US «Payload migrations» и US
  «удалить `/api/seed/route.ts`» — текущий механизм не конфликтует: seed-
  скрипт остаётся как утилита для refresh staging, путь деактивации route-а
  не трогает prod-процедуру.
- **Фиксирует решение по `/api/seed`.** Route признан deprecated в этом ADR;
  его удаление — follow-up US.

### Минусы / риски

- **Ручной шаг.** `do` должен ввести набор команд корректно. Митигация: в
  QA-отчёте зафиксирован точный блок команд (копипаст из ADR §«Основное»);
  safety-gate в коде — последний рубеж.
- **Доверие к `shared/.env` на VPS.** Если `.env` на VPS содержит не-prod
  `DATABASE_URI` (например, ошибочно указывает на staging), то regex ничего
  не блокирует и seed может прогнаться на не-prod. Митигация: `dba` перед
  прогоном делает `psql -c "SELECT current_database();"` и сверяет вывод
  с `obikhod` (prod), фиксирует в QA.
- **Fallback не реализован до момента нужды.** Если прямой SSH-прогон упадёт
  и оператор в этот момент находится вне окна работы — время до следующего
  окна. Митигация: скелет fallback-workflow в этом ADR + секреты SSH
  уже залиты → реализация `do` занимает < 30 минут.
- **Логи seed живут на VPS.** Копия в `qa.md` решает вопрос долгосрочного
  хранения, но требует ручного шага от `qa1/qa2`. Митигация: включить этот
  шаг в DoD US-1 (он уже в `sa §8`).
- **Regex по IP/hostname хрупок** к будущей миграции БД (замена VPS, смена
  DNS). Митигация: `OBIKHOD_ENV=production` в `shared/.env` как
  альтернативный триггер strict-режима — `do` ставит при первоначальной
  конфигурации VPS, и regex превращается в defence-in-depth, а не primary
  guard.

### Follow-ups

- [ ] **`be3/be4`:** добавить `seed:prod` в `site/package.json`, реализовать
      safety-gate в `scripts/seed.ts` (см. блок в §«Решение»).
- [ ] **`do`:** создать `/var/log/obikhod/` с правами `deploy:deploy 0750` на
      VPS. Прогнать первый seed на staging / Docker Postgres перед prod.
- [ ] **`do`:** подготовить скелет `.github/workflows/seed-prod.yml`
      (не активировать, держать в репо как black-box fallback).
- [ ] **`dba`:** перед первым prod-прогоном — ручной `/usr/local/bin/obikhod-backup.sh`,
      `psql -c 'SELECT slug FROM services; SELECT slug FROM districts;'`,
      подтверждение нулевого пересечения со slug из `sa §0.2`.
- [ ] **`po`:** завести follow-up US «Удалить `app/api/seed/route.ts`»
      после закрытия US-1 (scope в `sa §8`).
- [ ] **`po`:** завести follow-up US «Payload migrations» (supersedes этот
      ADR в части механизма seed, когда managed migrations активны).
- [ ] **`tamd`:** пересмотреть этот ADR при переходе на Payload migrations —
      статус `Superseded by ADR-<N>`.

## Открытые вопросы

- [ ] `OBIKHOD_ENV=production` в `shared/.env` — ставит `do` сейчас или
      ждём реального CI-инцидента? Рекомендация `tamd`: поставить сейчас,
      пока настраиваем первый прогон.
- [ ] Размер `/var/log/obikhod/seed-*.log` — нужна ли автоматическая
      ротация или хватит ручной очистки раз в 3 месяца (seed-прогонов
      ожидается < 10 в год)? Рекомендация `tamd`: ручная очистка, ротация —
      overkill для текущей частоты.
- [ ] Подписать DoD US-1 пунктом «`qa` вставил лог seed в qa.md» — `po`
      добавляет в checklist US-1 Definition of Done.
