# US-2 · DBA Review — `SiteChrome` global + дедупликация `SeoSettings`

**Автор:** dba
**Дата:** 2026-04-23
**Входы:** `./ba.md`, `./sa.md`, `./intake.md`, `team/adr/ADR-0002-site-chrome-dedup-seosettings.md` (Accepted, с оговоркой про ручной `pg_dump`), `site/globals/SeoSettings.ts`, `site/payload.config.ts`, `.claude/memory/handoff.md`.
**Контекст БД:** Postgres 16 на Beget VPS `45.153.190.107`, адаптер `postgresAdapter({ pool: {...}, push: true })` (`site/payload.config.ts:50-53`). Prod БД **пустая** (handoff 2026-04-23) — ни одного значения в `globals_seo_settings` и коллекциях-потребителях нет. Дев-БД локально содержит seed-данные (будут потеряны при первом `next dev` после мержа — оператор пересеет, не блокер).

---

## 1. Apr — **Approved with conditions**

`push: true` migration от US-2 безопасна на prod **потому что данных нет**: drop 9 колонок из `globals_seo_settings_organization` + drop таблицы массива `globals_seo_settings_same_as` + create таблиц `SiteChrome` — каждая из этих операций DDL-only на пустых структурах. Риск потери данных **= 0** на prod при условии, что pre-deploy `pg_dump` зафиксирует именно это состояние.

Conditions (строго, блокируют мерж PR в main):

1. Полный `pg_dump -Fc` pre-US2 (§2.1) — **не schema-only**, именно full dump (data + schema).
2. Проверка, что daily backup от 2026-04-23 / дня мержа лежит в `/var/backups/obikhod/daily/`.
3. Smoke `/api/health?deep=1` **до** деплоя, **сразу после** автоапплая миграции PM2, **после** seed `SiteChrome`.
4. Post-deploy SQL-аудит (§5) подтверждает: 9 колонок из `globals_seo_settings_organization` удалены, таблица `globals_seo_settings_same_as` дропнута, таблица `globals_site_chrome` и её child-таблицы (`_header_menu`, `_footer_columns`, `_footer_columns_items`, `_social`) созданы.

Код `SiteChrome` + изменения `SeoSettings` — не меняю, SA-контракт + ADR-0002 закрыты. Ни одного индекса руками не добавляем.

---

## 2. Миграция через `push: true` — оценка риска

### 2.1. Что делает Payload при старте после мержа

На основании `ADR-0002 §«План миграции Payload-схемы»` и моего чтения `SeoSettings.ts`:

**DROP (из `globals_seo_settings_organization` group — эти поля в Postgres хранятся плоскими колонками с префиксом `organization_`):**

- `organization_telephone` (text)
- `organization_legal_name` (text)
- `organization_tax_id` (text)
- `organization_ogrn` (text)
- `organization_address_region` (text)
- `organization_address_locality` (text)
- `organization_street_address` (text)
- `organization_postal_code` (text)
- `organization_founding_date` (date)

**DROP TABLE:**

- `globals_seo_settings_same_as` (Payload-array — отдельная таблица вида `(id PK, _parent_id FK → globals_seo_settings, _order int, url text)`).

**CREATE TABLE (`globals_site_chrome` + дочерние):**

- `globals_site_chrome` — single-row global: `header_cta_label`, `header_cta_kind`, `header_cta_anchor`, `header_cta_route`, `header_cta_url`, `footer_slogan`, `footer_privacy_url`, `footer_ofertA_url`, `footer_copyright_holder`, `contacts_phone_display`, `contacts_phone_e164`, `contacts_email`, `requisites_legal_name`, `requisites_inn`, `requisites_kpp`, `requisites_ogrn`, `requisites_legal_address`, `updated_at`, `created_at`. Точные имена колонок — на совести Payload-naming'а (snake_case + `<group>_<field>`), но это SA §4 data dictionary + schema-TS §5.
- `globals_site_chrome_header_menu` — array: `(id, _parent_id, _order, kind, label, anchor, route, url)`.
- `globals_site_chrome_footer_columns` — array: `(id, _parent_id, _order, title)`.
- `globals_site_chrome_footer_columns_items` — nested array под `columns[].items[]`: `(id, _parent_id FK → footer_columns.id, _order, kind, label, anchor, route, url)`.
- `globals_site_chrome_social` — array: `(id, _parent_id, _order, type, url, label)`.

### 2.2. Потеря данных

**Prod (`obikhod.ru`):**
- В `globals_seo_settings` и дочерних таблицах **ноль строк** (см. handoff — БД пустая, seed не прогонялся). Drop колонок и drop `same_as`-таблицы не теряют пользовательских данных, потому что их физически нет.
- В `users` могут быть админы — их не трогаем.

**Dev (локально у оператора / be3 / be4):**
- Может содержать seed-данные (scripts/seed.ts, scripts/seed-services.ts). При первом запуске `next dev` после `git pull` Payload увидит различие схем и drop'нет колонки/таблицу `same_as` **с потерей того, что там лежало**.
- По ADR-0002 §«Dev» п.3 это ожидаемое поведение. Оператор / be3 / be4 пересеет локально (`pnpm seed` + `pnpm seed:site-chrome`).
- **Это не блокер US-2.** Записываю в conditions: разработчики уведомлены, dev-данные считаются disposable.

### 2.3. Риск-оценка `push: true` на prod

| Риск | Вероятность | Влияние | Митигация |
|---|---|---|---|
| Payload не дропнет колонку из-за FK / constraint, упадёт на старте | **Низкая** (ни одной FK на `organization_*` колонки в схеме нет — это плоские текст-поля внутри group) | Высокое (PM2 не стартует, `/api/health` 502) | pre-US2 `pg_dump`, rollback = `pg_restore` + `git revert`; проверка на dev перед мержем (ADR-0002 §«Dev» п.3) |
| Payload переименует колонку вместо drop+create (рассинхрон имён в коде TS vs БД) | **Очень низкая** (Payload 3.83 drops на `push:true` не переименовывает) | Среднее | Post-deploy SQL-аудит §5; если замечено — drop руками по точному имени |
| `push: true` успешно пройдёт на dev, но упадёт на prod из-за тонкостей collation / version | **Очень низкая** (Postgres 16 обе стороны) | Высокое | pre-US2 dump, rollback, postmortem |
| PM2 перезапустится посреди миграции | **Низкая** (auto-deploy вручную workflow_dispatch, окно ~2 мин) | Среднее | Повторный пуск = Payload увидит завершённую миграцию, идемпотентно |
| Payload создаст array-таблицу без FK `_parent_id ... ON DELETE CASCADE` | **Очень низкая** (поведение по умолчанию Payload 3) | Низкое | Глобал один, parent никогда не удаляется |

**Вердикт:** риск приемлем при выполнении conditions §1.

---

## 3. Pre-deploy checklist (для `do`)

Команды выполняются **последовательно**, перед мержем PR US-2 в main (автодеплой = push в main → полный цикл Schema Change).

### 3.1. Подтвердить prod и статус daily backup

```bash
ssh deploy@45.153.190.107
sudo -u postgres psql -d obikhod -c "SELECT current_database(), inet_server_addr(), version();"
ls -lh /var/backups/obikhod/daily/ | tail -5
```

Ожидание: `obikhod` / `127.0.0.1` / Postgres 16, последний daily-файл < 24 ч.

### 3.2. **Обязательный** полный `pg_dump` pre-US2

```bash
sudo mkdir -p /var/backups/obikhod/pre-us2
TS=$(date -u +%Y%m%dT%H%M%SZ)

# Полный dump (data + schema), custom format — для pg_restore selective
sudo -u postgres pg_dump -Fc -d obikhod \
  -f /var/backups/obikhod/pre-us2/obikhod-pre-us2-${TS}.dump

# Дополнительно schema-only plain SQL для ручной инспекции до/после:
sudo -u postgres pg_dump --schema-only -d obikhod \
  -f /var/backups/obikhod/pre-us2/obikhod-pre-us2-${TS}.schema.sql

# Проверить размер и целостность
ls -lh /var/backups/obikhod/pre-us2/
sudo -u postgres pg_restore --list /var/backups/obikhod/pre-us2/obikhod-pre-us2-${TS}.dump | wc -l
```

Имя файла фиксируется в `qa.md` US-2 (требование ADR-0002 §«Обязательный предохранитель перед деплоем»).

### 3.3. Подтвердить состояние до миграции

```bash
sudo -u postgres psql -d obikhod <<'SQL'
-- Поля, которые будут drop'нуты:
\d+ globals_seo_settings

-- Таблица, которая будет drop'нута:
\d+ globals_seo_settings_same_as

-- Убедиться, что в этих полях/таблицах ничего нет (prod БД пустая):
SELECT COUNT(*) AS seo_rows FROM globals_seo_settings;
SELECT COUNT(*) AS same_as_rows FROM globals_seo_settings_same_as;

-- Site-chrome таблиц ещё нет:
SELECT COUNT(*) AS site_chrome_tables
  FROM information_schema.tables
 WHERE table_name LIKE 'globals_site_chrome%';
SQL
```

Ожидание: все `COUNT(*) = 0` (`site_chrome_tables = 0`, остальные — 0). Если хоть одно > 0 — стоп, эскалация (означает, что у нас на prod есть данные, которые я не учёл в оценке).

### 3.4. Smoke до миграции

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/api/health?deep=1
# Ожидание: 200
```

---

## 4. Post-deploy checklist (для `do` + `qa` + `dba`)

Выполняется сразу после того, как `deploy.yml` отрапортует зелёный цикл и PM2 online.

### 4.1. Smoke после деплоя

```bash
# Базовый — Payload жив
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/api/health?deep=1
# Ожидание: 200. Если 502/500 — блок, откат по §6.
```

### 4.2. Подтвердить схему применена

```bash
sudo -u postgres psql -d obikhod <<'SQL'
-- Колонки из organization_* должны исчезнуть:
SELECT column_name FROM information_schema.columns
 WHERE table_name = 'globals_seo_settings'
   AND column_name LIKE 'organization_%'
 ORDER BY column_name;
-- Ожидание: только organization_name (остальные 9 drop'нуты).

-- Таблица same_as должна исчезнуть:
SELECT to_regclass('public.globals_seo_settings_same_as');
-- Ожидание: NULL.

-- Таблицы SiteChrome должны появиться:
SELECT table_name FROM information_schema.tables
 WHERE table_name LIKE 'globals_site_chrome%'
 ORDER BY table_name;
-- Ожидание: минимум 5 строк — globals_site_chrome + _header_menu + _footer_columns
--   + _footer_columns_items + _social. Точные имена — по Payload-naming'у.

-- FK child-таблиц:
SELECT conname, pg_get_constraintdef(c.oid)
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
 WHERE t.relname LIKE 'globals_site_chrome%'
   AND c.contype = 'f';
-- Ожидание: для каждой array-таблицы FK _parent_id → globals_site_chrome (или parent array) с ON DELETE CASCADE.
SQL
```

### 4.3. Seed `SiteChrome` (запускает `do` / `be3`)

```bash
ssh deploy@45.153.190.107
cd /home/deploy/obikhod/current
set -a; . ./.env; set +a
NODE_ENV=production node --import tsx scripts/seed-site-chrome.ts \
  2>&1 | tee -a /var/log/obikhod/seed-site-chrome-$(date -u +%Y%m%dT%H%M%SZ).log
```

Seed идемпотентный (ADR-0002 + sa §US-2.12 AC-12.2) — повторный запуск не создаёт дубли (global по дизайну одна строка).

### 4.4. Проверить, что global заполнен

```bash
sudo -u postgres psql -d obikhod <<'SQL'
SELECT contacts_phone_display, contacts_phone_e164, requisites_inn
  FROM globals_site_chrome LIMIT 1;
-- Ожидание: '+7 (985) 170-51-11', '+79851705111', '7847729123'.

SELECT COUNT(*) FROM globals_site_chrome_header_menu;
-- Ожидание: 6 (Услуги / Калькулятор / Как это работает / Кейсы / Абонемент / FAQ).

SELECT COUNT(*) FROM globals_site_chrome_footer_columns;
-- Ожидание: 3 (Услуги / Компания / Контакты).
SQL
```

### 4.5. Smoke UI + JSON-LD

```bash
# Страница отвечает
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/
# Ожидание: 200

# JSON-LD содержит новый телефон и taxID
curl -sS https://obikhod.ru/ | grep -A 25 'application/ld+json' | head -60
# Ожидание: "telephone":"+79851705111", "taxID":"7847729123", "sameAs":[...]
```

---

## 5. Схема `SiteChrome` — нужны ли индексы?

### 5.1. На уровне самого global

`globals_site_chrome` — **single-row** таблица. Индексы **не нужны**: любой запрос к global — `SELECT ... FROM globals_site_chrome LIMIT 1;`, seq-scan по 1 строке мгновенный.

### 5.2. На child-таблицах массивов

Payload автоматически создаёт:
- PK на `id` каждой array-таблицы.
- FK index на `_parent_id` (для `ORDER BY _order` при чтении).

Это достаточно. **Дополнительно руками не добавляем** — подтверждаю открытый вопрос `DBA-Q1` из ba.md §9 (индексы на global не нужны) и Q2 из ADR-0002 §«Открытые вопросы».

### 5.3. Constraint'ы на уровне БД vs Payload validation

Разбираю поля, где ba/sa обсуждали BD-level CHECK:

- **`SiteChrome.contacts.phoneE164`** — формат E.164, regex `^\+7\d{10}$`.
  - **Решение:** **Payload-level validation** (SA §5, `validate` на поле) — проще, ошибки показываются в admin UI как inline. DB-level CHECK — overkill, ломает миграции (добавить constraint → данные перестанут приниматься legacy-клиентами), сложнее менять при смене формата. Подтверждаю рекомендацию SA.
- **`SiteChrome.requisites.inn`** — regex `^\d{10,12}$`. **Payload-level**, тот же аргумент.
- **`SiteChrome.social[].type`** — enum `telegram|max|whatsapp|vk|youtube|yandex-zen|other`.
  - **Решение:** Payload-level (`select` с `options`). Postgres ENUM-тип не используем — добавление нового значения в Postgres ENUM требует `ALTER TYPE`, тогда как Payload select меняется правкой TS-файла. Для быстро эволюционирующего справочника — **Payload-level лучше**.
- **`SiteChrome.header.menu[].kind`** — union `anchor|route|external` + conditional validation.
  - **Решение:** Payload-level (`validateMenuItem` в SA §5 TS-сниппете). DB-check на union — сложно и бесполезно.

**Итог:** ни одного CHECK constraint / ENUM type руками не создаём. Всё держим в Payload validation.

---

## 6. Rollback

### 6.1. Primary — `git revert` + `pg_restore`

```bash
# 1. Немедленно откатить код (работает против живого deploy.yml на push)
git revert <SHA US-2 PR>
git push origin main
# Auto-deploy выкатит предыдущий билд (без SiteChrome.ts, со старым SeoSettings.ts).

# 2. Параллельно восстановить схему БД (на случай, если push:true успел drop'нуть колонки,
#    а код уже не знает про них — PM2 упадёт на старте)
ssh deploy@45.153.190.107 'pm2 stop obikhod'
sudo -u postgres pg_restore -d obikhod --clean --if-exists --no-owner --no-privileges \
  /var/backups/obikhod/pre-us2/obikhod-pre-us2-<TS>.dump
ssh deploy@45.153.190.107 'pm2 start obikhod'

# 3. Smoke
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/api/health?deep=1
# Ожидание: 200
```

RTO ≤ 20 мин (совпадает с ADR-0002 §Rollback).
RPO = 0 (оператор ещё не успел получить правки в SiteChrome на prod).

### 6.2. Reversibility

**Reversible** — пока prod БД пустая и сайт не проиндексирован. После первой B2B-активности с реальным `inn`/`legalName`/`legalAddress` в SiteChrome — нужен отдельный dump перед любым следующим rollback'ом (это уже не US-2 scope).

### 6.3. Irreversible-точки в US-2

Нет. Даже если `push: true` дропнул колонки и кто-то успел записать в SiteChrome — `pg_restore` из pre-US2 dump'а восстановит schema + данные SeoSettings, а SiteChrome-данные будут утеряны (но они placeholder из seed'а, пересеиваются за минуту).

---

## 7. Топ-1 риск

**Риск:** `push: true` на prod выкатывается **автоматически при push в main** (handoff 2026-04-21: «Deploy переведён на auto — `push: branches: [main]`»). Это значит, что мерж PR → через 2-5 минут Payload на prod уже применяет drop+create к схеме БД. Если `do` забыл сделать pre-US2 `pg_dump` до мержа — rollback сложнее (daily-backup от 03:00 MSK может отстать на ~20 часов).

**Митигация:**
1. Pre-US2 `pg_dump -Fc` (§3.2) — в блокер-чеклист `po` **перед мержем PR**, не перед деплоем.
2. В PR-description у `be3/be4` — чек-бокс «dba подтвердил pre-US2 dump сделан, имя файла: …» (обязательное поле).
3. Future: переход с `push: true` на managed migrations + review step в CI — **follow-up US** (упомянут в ADR-0002 §Связь).

**Следствие:** `dba` не даёт apr, пока `do` не подтвердил pre-US2 dump в PR.

---

## 8. Ответы на open questions к DBA из ba.md §9 + ADR-0002

- [x] **DBA-Q1 (ba §9):** индексы на global не нужны (§5.1). Подтверждаю.
- [x] **DBA-Q2 (ba §9):** миграция удаления `SeoSettings.organization.telephone` и `SeoSettings.sameAs` — **безопасна на пустой prod-БД**. План = `copy → verify → drop` избыточен (нечего копировать). Payload `push:true` сам выполнит drop при первом старте процесса после мержа. Dev-потеря данных — ожидаема (§2.2).
- [x] **DBA-Q3 (ba §9):** seed `SiteChrome` — идемпотентный, global = 1 строка, повторный `payload.updateGlobal({slug:'site-chrome', data:{...}})` = upsert без дублей. Запуск через SSH после деплоя (§4.3), согласован с `be3/be4`.
- [x] **Q2 (ADR-0002):** подтверждаю — `push: true` корректно drop'ает таблицу `globals_seo_settings_same_as` с CASCADE, т.к. FK `_parent_id` идёт от `same_as` к `globals_seo_settings`, а не наоборот. Проверка обязательна на dev (ADR-0002 §«Dev» п.3) до мержа.
- [x] **Q4 (ADR-0002):** `pg_dump` перед деплоем PR'а US-2 добавлен в чек-лист §3.2. Одноразовый шаг, не в `deploy.yml`.

---

## 9. Решение

**✅ Approved with conditions** при выполнении §1:

1. Pre-US2 `pg_dump -Fc` (§3.2) сделан, имя файла зафиксировано в PR-description и `qa.md`.
2. Pre-deploy аудит §3.3 прошёл (0 строк, 0 таблиц site_chrome).
3. Post-deploy аудит §4.2 подтвердил: 9 колонок drop, `same_as` таблица drop, 5+ таблиц `globals_site_chrome*` создано.
4. Seed `SiteChrome` прогнан, §4.4 подтвердил заполненность.
5. Smoke §4.1 + §4.5 = 200 + JSON-LD содержит новый телефон/ИНН.
6. Разработчики уведомлены о потере локальных dev-seed'ов после `git pull` (не блокер, но handoff на be3/be4).

Ни одного constraint / index / CHECK руками не создаём.

---

## Подпись

**dba**, 2026-04-23. Hand-off `→ po`: `dba.md` готов. Условия §1 — блокеры мержа PR (без pre-US2 dump → no-go). Повторного ревью `dba` не требует до появления реального контента в SiteChrome/SeoSettings (это изменит risk-profile будущих миграций).
