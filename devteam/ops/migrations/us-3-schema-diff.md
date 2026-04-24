# US-3 — Schema diff (prod vs US-3) и план миграции

**Автор:** `dba`
**Дата:** 2026-04-24
**Входы:** `sa.md §9.2`, `be4-fields-checklist.md §15`, `pg_dump --schema-only`
локальной БД (snapshot /tmp/us3-new-schema.sql, 80 таблиц)
**Назначение:** обосновать SQL-миграцию перед переходом prod с `db.push: true`
на `db.push: false` + migrations runner в `deploy.yml`.

---

## 1. Diff — что меняется

### 1.1 Новые таблицы (12)

Все — backing-хранилища для поля `blocks: blocks[]` на коллекции
`service-districts` (sa.md §3, волна 1, 5 block-типов × 2 версии = 12 таблиц):

| # | Таблица (current) | Таблица (_v versioned) | Назначение |
|---|---|---|---|
| 1 | `service_districts_blocks_hero` | `_service_districts_v_blocks_hero` | Hero-блок (1 на страницу) |
| 2 | `service_districts_blocks_text_content` | `_service_districts_v_blocks_text_content` | Long-form SEO-текст |
| 3 | `service_districts_blocks_lead_form` | `_service_districts_v_blocks_lead_form` | Форма заявки → amoCRM |
| 4 | `service_districts_blocks_cta_banner` | `_service_districts_v_blocks_cta_banner` | CTA-баннер |
| 5 | `service_districts_blocks_faq` | `_service_districts_v_blocks_faq` | FAQ-контейнер |
| 6 | `service_districts_blocks_faq_items` | `_service_districts_v_blocks_faq_items` | Пары Q&A внутри FAQ |

### 1.2 Новые ENUM-типы (8)

| # | ENUM | Значения |
|---|---|---|
| 1 | `enum_service_districts_blocks_hero_seasonal_theme` | `summer` / `winter` / `promo` |
| 2 | `enum_service_districts_blocks_text_content_columns` | `1` / `2` |
| 3 | `enum_service_districts_blocks_lead_form_variant` | `short` / `long` |
| 4 | `enum_service_districts_blocks_cta_banner_accent` | `primary` / `warning` / `success` |
| 5-8 | `enum__service_districts_v_blocks_*` (x4) | То же для `_v`-таблиц |

### 1.3 Новые индексы (48)

- 6 PK на `id` (varchar для current, integer для `_v`)
- 30 btree на `_order`, `_parent_id`, `_path`, `image_id` (для FK-producer'ов)
- FK constraints:
  - `service_districts_blocks_*._parent_id` → `service_districts.id` ON DELETE CASCADE
  - `service_districts_blocks_hero.image_id` → `media.id` ON DELETE SET NULL
  - `_service_districts_v_blocks_*._parent_id` → `_service_districts_v.id` ON DELETE CASCADE
  - `service_districts_blocks_faq_items._parent_id` → `service_districts_blocks_faq.id` ON DELETE CASCADE

### 1.4 Колонки удалены

**НЕ УДАЛЯЕМ НИЧЕГО В US-3.** Согласно sa.md §9.1 zero-downtime: старые поля
(`intro`, `body`, `leadParagraph`, `faqGlobal`, `casesShowcase`, `howToSteps`)
**сохраняются**, рендер продолжает работать параллельно.

### 1.5 Колонки модифицированы

| Колонка | Было (prod, pre-US-3) | Стало (US-3) | Риск на prod |
|---|---|---|---|
| `services.price_to` | nullable (через `db.push`) | nullable (через migration) | Нулевой — тип не меняется |
| `cases_photos_before` table | `minRows: 1` на уровне app | без изменений в схеме | Нулевой |
| `cases_photos_after` table | `minRows: 1` на уровне app | без изменений в схеме | Нулевой |

**Важно:** Payload 3 + `db.push: true` НЕ генерирует `NOT NULL` на required-полях
(see be4-fields-checklist §15 п.1). Это значит что `required: true` enforc'ится
только на уровне application (Payload validation), не на уровне DB. Поэтому
`REQ-7.2` (сделать `priceTo` опциональным) — это изменение в TS-схеме коллекции,
миграция БД не требуется.

### 1.6 Изменения в Globals

**`seo_settings`** (проверено `\d seo_settings` на локальной БД):
- Поля `organization_*` (кроме `organization_name`, `organization_schema_override`)
  **УЖЕ УДАЛЕНЫ** — это произошло в US-2 (ADR-0002 SeoSettings × SiteChrome dedup,
  коммит `bb0f6f8`). В US-3 НИЧЕГО не меняется.
- Если на prod эти колонки ещё есть (т.е. prod отстал на US-2) — нужна отдельная
  проверка, NOT blocker для US-3.

**`site_chrome`** — без изменений в US-3.

### 1.7 Сводка

| Категория | Count |
|---:|---:|
| Новых таблиц | 12 |
| Новых ENUM | 8 |
| Новых индексов | 48 |
| Новых FK | 10 |
| Новых PK | 12 |
| Удалённых колонок | 0 |
| Модифицированных колонок | 0 (на уровне DB) |
| DATA LOSS на prod | **0 строк** (если блоки ещё не наполнялись) |

---

## 2. Почему не через `payload migrate:create`

**Блокер:** Payload 3.83.0 CLI `payload migrate:create` в связке с Node 22 +
pnpm + `tsx/esm/api` не резолвит sibling TS-imports в `payload.config.ts`
(конкретно: `import { Users } from './collections/Users'` без расширения не
находится из `tsImport('dist/bin/index.js')` контекста). Пробовали:

- `pnpm payload migrate:create` (host, Node 24) → `ERR_MODULE_NOT_FOUND`
- Node 22 в docker + tsx через `NODE_OPTIONS` → `ERR_REQUIRE_CYCLE_MODULE`
- Node 22 + `--use-swc` → `SyntaxError: ... does not provide an export`
- Node 20 → `TypeError: Illegal constructor` (undici/CacheStorage incompat)

**Альтернативное решение (применяем):** собираем SQL вручную, извлекая DDL из
`pg_dump --schema-only` локальной БД (которая уже содержит US-3 через `push: true`
режим). Payload-совместимая TS-обёртка читает SQL-файл и делегирует через
`db.execute(sql.raw(...))`. Такой подход **безопаснее** автогенерации — каждый
DDL под ревью `dba`, нет сюрпризов.

**Долгосрочно (вне US-3 scope):** `tamd` + `be4` делают PoC в CI-контексте
(где Next уже скомпилирован), чтобы `payload migrate:create` работал в build-шаге
`deploy.yml`. В текущем релизе — SQL вручную.

---

## 3. Файлы миграции

| Файл | Назначение | Размер |
|---|---|---:|
| `site/migrations/20260424_133242_us_3_blocks_and_seo.ts` | Payload TS wrapper (up/down) | ~1 KB |
| `site/migrations/20260424_133242_us_3_blocks_and_seo.up.sql` | 100 DDL statements (tables + enums + indexes + FK) | 19 KB |
| `site/migrations/20260424_133242_us_3_blocks_and_seo.down.sql` | 20 DROP statements (tables CASCADE + enums) | 1.5 KB |
| `devteam/ops/migrations/us-3-blocks-up.sql` | Копия up-SQL для ревью (не executable) | 19 KB |
| `devteam/ops/migrations/us-3-blocks-down.sql` | Копия down-SQL для ревью | 1.5 KB |

---

## 4. Результаты тестов на чистой БД

### 4.1 Setup

1. `CREATE DATABASE obikhod_migtest;`
2. Залит full US-3 snapshot `pg_dump` (7247 LOC) → 80 таблиц, 43 ENUM, 299 индексов
3. `DOWN` применён → 68 таблиц, 35 ENUM, 251 индекс (имитация prod pre-US-3)

### 4.2 Результаты

| Тест | Результат | Комментарий |
|---|---|---|
| Apply UP (after DOWN) | **PASS** | 100 DDL statements, 12 tables, 8 enums, 48 indexes |
| DOWN после UP | **PASS** | 12 → 0 blocks tables, 8 → 0 enums, CASCADE работает |
| Cycle UP → DOWN → UP | **PASS** | Повторное применение чистое |
| Idempotency (UP дважды подряд) | **FAIL** (ожидаемо) | `type already exists` — прод-safe т.к. `payload_migrations` tracker предотвращает повторный запуск |
| FK integrity после UP | **PASS** | `\d service_districts_blocks_hero` показывает FK на `service_districts` и `media` |

---

## 5. Prod-safety checklist

| # | Требование | Вердикт | Комментарий |
|---|---|:---:|---|
| 1 | Reversible (down работает) | ✅ | DOWN протестирован, все объекты удаляются |
| 2 | Destructive? | ⚠️ **conditional** | DOWN = data-loss если блоки наполнялись. До первого продакшн-UP данных нет → безопасно |
| 3 | Idempotent (apply дважды без ошибки) | ⚠️ **партиально** | Payload `payload_migrations` tracker делает это неактуальным; ручной повторный запуск упадёт на `type already exists` |
| 4 | Concurrent-safe (DDL в одной транзакции) | ✅ | Весь UP/DOWN обёрнут в `BEGIN; … COMMIT;` |
| 5 | Performance (блокирующие ALTER на большой таблице) | ✅ | Все операции — `CREATE TABLE` новых таблиц. Ноль ALTER на существующих (в частности `service_districts` не трогается) |
| 6 | FK в правильном порядке | ✅ | Протестировано: `parent` таблица (service_districts) уже существует, новые FK добавляются без конфликта |
| 7 | Backup prerequisite | ✅ **обязателен** | `gh workflow run prod-backup.yml -f reason=pre-us-3-blocks` до применения |
| 8 | 152-ФЗ / ПДн риск | ✅ | Ни одна новая таблица не содержит ПДн. `leads` не затрагивается |
| 9 | Connection-pool / lock risk | ✅ | Новые таблицы, без LOCK на существующих |
| 10 | Rollback time | ~1 сек | 12 DROP CASCADE на пустых таблицах |

**Вердикт:** **GREEN для prod**, при соблюдении п.7 (backup) и п.3 workflow
(миграция не прогоняется повторно вручную без up-trackeŕ check).

---

## 6. Рекомендуемый deploy-flow

### 6.1 Однократный переход с `db.push: true` на `migrate`

1. **Оператор/do:** запускает `gh workflow run prod-backup.yml -f reason=pre-us-3-blocks-migration`
2. Ожидает подтверждения что дамп ≥ X MB на `${BP}/backups/`
3. Мержит US-3 PR с файлами:
   - `site/migrations/20260424_133242_us_3_blocks_and_seo.{ts,up.sql,down.sql}`
   - `site/payload.config.ts`: `push: true` → `push: false`
   - `.github/workflows/deploy.yml`: добавить шаг `pnpm payload migrate`
     **перед** `pm2 reload` (но **после** `pnpm build`)
4. Prod-деплой применяет миграцию через `payload_migrations` tracker автоматически
5. В случае rollback — вернуть PR + прогнать миграцию down вручную через
   `pnpm payload migrate:down` на VPS (или ручной `psql -f down.sql` если
   Payload CLI недоступен)

### 6.2 Флаг для next-релизов

После мержа все следующие изменения схемы **ДОЛЖНЫ** проходить через
`payload migrate:create` или (пока CLI-blocker не снят) — ручной SQL с той же
структурой `{ts}_{timestamp}_{name}.{up,down}.sql` + TS wrapper.

---

## 7. Предложение по timing деплоя

**Вариант A — миграция отдельным этапом (РЕКОМЕНДУЕМ):**

1. Отдельный PR «DB migration: US-3 blocks schema + push→false». Применить раньше.
2. В этом PR — только: migration файлы + `push: false` + deploy.yml шаг.
3. После успешного деплоя (schema применена, сайт живой) — мержить implementation
   US-3 (blocks[] field в collections + компоненты admin).
4. Профит: если имплементация US-3 найдёт проблемы и нужно откатить код — схема
   уже применена и не мешает, блок-таблицы остаются пустыми.

**Вариант B — миграция + код одним релизом:**

1. Один PR со всем.
2. Риск: если схема применилась но код упал на `pm2 start` — БД в новом состоянии,
   код старый. Восстановление сложнее (rollback миграции + rollback кода).

**Моё (dba) решение:** **Вариант A.** Это первая «настоящая» миграция на проекте
(после `pg_dump --schema-only` хака 2026-04-21), её стоит применить изолированно,
сразу зафиксировав новый deploy-контракт. Риск минимальный, profit — больший.

---

## 8. Что требуется от оператора / do / tamd

### 8.1 Blockers для применения на prod

- [ ] **Бэкап prod до миграции** — `gh workflow run prod-backup.yml -f reason=pre-us-3-blocks`
  (`do` выполняет, отчёт в Linear).
- [ ] **Верификация prod-schema диффа** — `pg_dump --schema-only` prod-БД в
  `/tmp/prod-schema.sql` + сравнение с `/tmp/us3-new-schema.sql` через
  `diff -u`. Это даёт точный список ALTER'ов которые понадобятся если prod
  отстал на US-1/US-2 (`do` + `dba`, 30 мин).
- [ ] **`payload.config.ts` смена `push: true` → `push: false`** — PR от `be4`,
  ревью `dba` (в этой спеке не коммитим, только подготовлено).
- [ ] **`deploy.yml` шаг `pnpm payload migrate`** — PR от `do` + `be4`, ревью
  `dba` + `tamd`.

### 8.2 Open questions

- `tamd` ADR: как решаем проблему `payload migrate:create` + Node 22 + tsx для
  будущих миграций? Либо (а) сборка в CI-контексте (после `next build`), либо
  (б) ручной SQL + TS wrapper навсегда (как сейчас). Решение — в ADR-0005.
- `do` нужен ли staging-стенд для pre-prod-валидации миграций? Сейчас
  `obikhod_migtest` БД локально — достаточно для smoke, но если команда вырастет —
  отдельный staging VPS оправдан.

### 8.3 MAINTENANCE window

Миграция DDL-only на новых таблицах → **downtime = 0 сек**. Можно применять в
рабочее время без MAINTENANCE window. Блокировок на существующие таблицы нет.

---

## 9. Команды для проверки после применения

```bash
# на prod после миграции
psql "$DATABASE_URI" -c "SELECT count(*) FROM information_schema.tables WHERE table_name LIKE '%blocks%';"
# expect: 12

psql "$DATABASE_URI" -c "SELECT count(*) FROM pg_type WHERE typname LIKE 'enum%blocks%';"
# expect: 8

# Payload tracker
psql "$DATABASE_URI" -c "SELECT name, batch FROM payload_migrations ORDER BY id DESC LIMIT 3;"
# expect: 20260424_133242_us_3_blocks_and_seo | <latest batch>

# Health check
curl -s https://obikhod.ru/api/health?deep=1 | jq
# expect: {"status":"ok", "db": "connected", ...}
```

---

## 10. Rollback script (для emergency)

Если после миграции prod упал и `payload migrate:down` недоступен:

```bash
# На VPS под deploy-user
psql "$DATABASE_URI" -v ON_ERROR_STOP=1 \
  -f /var/www/obikhod/releases/current/site/migrations/20260424_133242_us_3_blocks_and_seo.down.sql

# Manually mark migration as rolled back
psql "$DATABASE_URI" -c \
  "DELETE FROM payload_migrations WHERE name = '20260424_133242_us_3_blocks_and_seo';"
```

---

## Prod-vs-new verification 2026-04-24

### Входы
- `/tmp/prod-schema.sql` — `pg_restore --schema-only` prod-dump 2026-04-24 15:21 UTC (6826 LOC, 62 таблицы)
- `/tmp/us3-new-schema.sql` — локальная US-3 `pg_dump --schema-only` (7247 LOC, 80 таблиц)
- `/tmp/prod-full-dump.sql` — custom-format prod-dump, загружен в docker postgres:16-alpine для data-counts

### Факт: prod — полностью пустая БД

Загрузил prod-dump в изолированную БД `prod_inspect`, посчитал строки:

| Таблица | Строк |
|---|---:|
| seo_settings | 0 |
| seo_settings_same_as | 0 |
| seo_settings_credentials | 0 |
| service_districts | 0 |
| _service_districts_v | 0 |
| services | 0 |
| districts | 0 |
| leads | 0 |
| media | 0 |
| payload_migrations | 0 |

**Следствие:** риск data-loss на prod при миграции = **0 строк**. DROP/ALTER на
любых таблицах безопасны. `payload_migrations` пустая → prod ещё ни разу не
прогонял migrations runner (сейчас живёт в `db.push: true` режиме).

### Финальный diff prod (62 таблицы) → us3-new (80 таблиц)

**Новых таблиц (+19):**

- 12 blocks-таблиц (6 published + 6 drafts) — *уже были в первоначальном up.sql*
- 2 polymorphic rels — `service_districts_rels`, `_service_districts_v_rels` — **НЕ БЫЛО в up.sql**
- 5 site_chrome: `site_chrome` + `site_chrome_footer_columns` + `site_chrome_footer_columns_items` + `site_chrome_header_menu` + `site_chrome_social` — **НЕ БЫЛО в up.sql**

**Удалённых из prod (-1):**

- `seo_settings_same_as` (empty) — в new-схеме заменено на JSON-поле
  `organization_schema_override`.sameAs.

**Модифицированных таблиц:**

| Таблица | Изменение | Было в up.sql? |
|---|---|:---:|
| `service_districts` | +8 колонок (seo_title, seo_description, seo_h1, canonical_override, robots, og_image_id, last_reviewed_at, reviewed_by_id) + 2 FK + 2 idx | ❌ |
| `_service_districts_v` | +8 version_* колонок + 2 FK + 2 idx | ❌ |
| `seo_settings` | -9 колонок (`organization_legal_name`, `organization_tax_id`, `organization_ogrn`, `organization_address_*`, `organization_street_address`, `organization_postal_code`, `organization_telephone`, `organization_founding_date`) | ❌ |

**ENUM (+14 новых, -0):**

- `enum_service_districts_robots` + `enum__service_districts_v_version_robots` — **НЕ БЫЛО в up.sql**
- 8 block-enum (4 published + 4 drafts) — *было*
- 4 site_chrome enum (`header_cta_kind`, `header_menu_kind`, `footer_columns_items_kind`, `social_type`) — **НЕ БЫЛО в up.sql**

**FK (+45, -2):**

- Добавили: все FK под новые таблицы + 4 FK на service_districts/_service_districts_v (og_image_id → media, reviewed_by_id → persons)
- Удалили: `seo_settings_same_as_pkey`, `seo_settings_same_as_parent_id_fk`

**Indexes (+55, -2):**

- Добавили: 50 индексов под новые таблицы + 4 под новые колонки service_districts/_v + 1 под new.
- Удалили: `seo_settings_same_as_order_idx`, `seo_settings_same_as_parent_id_idx`

### Сверка с начальной версией миграции (20260424_133242)

**Оригинальный `up.sql` покрывал только 12 blocks-таблиц (19 KB).**
После сверки с реальным prod-dump выявлено: **18 out of 30** групп DDL-операций
отсутствовали. Миграция была переписана и теперь соответствует реальному diff.

### Переписанный up.sql (39 KB): содержимое

Секции 1–11, всё в одной транзакции `BEGIN; … COMMIT;`:

1. **Drop stale prod artefacts** (seo_settings_same_as + 9 columns on seo_settings)
2. **New ENUM types** (14 штук)
3. **ALTER service_districts + _v** (8+8 колонок)
4. **Polymorphic rels tables** (2 таблицы + sequences)
5. **Blocks tables published** (6 таблиц)
6. **Blocks tables drafts** (6 таблиц)
7. **Blocks sequences** (6 штук, integer id для drafts)
8. **site_chrome global** (5 таблиц + 1 sequence)
9. **Primary keys** (21 PK)
10. **Foreign keys** (24 FK)
11. **Indexes** (54 индекса)

### Тесты на prod-snapshot (docker postgres:16-alpine, clone prod)

| Тест | Результат |
|---|:---:|
| `pg_restore` prod-dump → 62 таблицы, 0 строк во всех таблицах | ✅ |
| UP → 80 таблиц, exit 0, 0 ошибок | ✅ |
| Post-UP: таблицы/колонки идентичны us3_ref | ✅ |
| Post-UP: FK идентичны us3_ref (diff empty) | ✅ |
| Post-UP: индексы идентичны us3_ref (diff empty) | ✅ |
| Post-UP: ENUM идентичны us3_ref (diff empty) | ✅ |
| DOWN → 62 таблицы, восстановлены `seo_settings.organization_*` + `seo_settings_same_as` | ✅ |
| Cycle UP→DOWN→UP: clean, схема снова идентична us3_ref | ✅ |

### Финальный вердикт: **GO** на применение миграции на prod

Основания:
1. **0 data-loss риск** — prod пустой, даже destructive DROPs безопасны.
2. **Полная reversibility** — DOWN восстанавливает исходную prod-схему бит-в-бит по именам объектов.
3. **Идемпотентность обеспечена** `payload_migrations` tracker'ом (который сейчас пустой → миграция прогонится ровно один раз).
4. **Атомарность** — вся DDL в одной транзакции, rollback автоматический на любой ошибке.
5. **Reproducibility** — миграция проверена на идентичном клоне prod-БД и даёт результат, byte-for-byte совпадающий с reference `us3-new-schema.sql`.

### Runbook для оператора (оператор + `do`)

```bash
# 1. Backup (обязательно, несмотря на пустой prod — установка правильного habit)
gh workflow run prod-backup.yml -f reason=pre-us-3-migration
# Дождаться completion + проверить что дамп ≥ ~300 KB в $BP/backups/

# 2. Мерж PR с:
#    • site/migrations/20260424_133242_us_3_blocks_and_seo.{ts,up.sql,down.sql}
#    • site/payload.config.ts: push: true → false  (be4 готовит отдельным PR)
#    • .github/workflows/deploy.yml: добавить "pnpm payload migrate"
#      между "pnpm build" и "pm2 reload"  (do готовит)

# 3. Prod-деплой: deploy.yml применит миграцию через payload_migrations tracker.

# 4. Верификация после деплоя:
psql "$DATABASE_URI" -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"  # 80
psql "$DATABASE_URI" -c "SELECT count(*) FROM pg_type WHERE typnamespace='public'::regnamespace AND typtype='e';"
psql "$DATABASE_URI" -c "SELECT name, batch FROM payload_migrations;"  # 20260424_133242_us_3_blocks_and_seo
curl -s https://obikhod.ru/api/health?deep=1 | jq

# 5. Emergency rollback (если после миграции сайт упал):
#    на VPS под deploy-user:
psql "$DATABASE_URI" -v ON_ERROR_STOP=1 \
  -f /var/www/obikhod/releases/current/site/migrations/20260424_133242_us_3_blocks_and_seo.down.sql
psql "$DATABASE_URI" -c "DELETE FROM payload_migrations WHERE name='20260424_133242_us_3_blocks_and_seo';"
# затем pm2 reload obikhod-site или redeploy предыдущего релиза
```

### Непокрытые US-3 open-items

- [ ] PR `push: true → false` в `payload.config.ts` (owner: `be4`)
- [ ] PR `pnpm payload migrate` шаг в `deploy.yml` (owner: `do`)
- [ ] Cleanup тестовых БД в локальном docker: `prod_inspect`, `prod_test_v2`, `prod_test_v3`, `us3_ref` (hook блокирует `DROP DATABASE` на уровне bash — оператор выполняет вручную)

---

## Changelog

- **2026-04-24** (dba) — initial diff + SQL migration + prod-safety checklist.
- **2026-04-24** (dba, №2) — prod-vs-new verification: обнаружены 18 пропущенных
  групп DDL (ALTER + site_chrome + rels + seo_settings cleanup). Миграция
  переписана до 39 KB, протестирована на клоне prod (62 → 80 → 62 → 80 циклом).
  Установлен факт пустой prod-БД → data-loss риск равен нулю. Финальный вердикт: GO.
