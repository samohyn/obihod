# US-1 · DBA Review — Seed prod БД

**Автор:** dba
**Дата:** 2026-04-23
**Входы:** `./ba.md`, `./sa.md`, `./intake.md`, `team/adr/ADR-0001-seed-prod-runner.md` (Accepted), `site/scripts/seed.ts`, `site/collections/{Services,Districts,ServiceDistricts,Cases,Persons}.ts`, `site/payload.config.ts`, `.claude/memory/handoff.md`.
**Контекст БД:** Postgres 16 на Beget VPS `45.153.190.107`, адаптер `@payloadcms/db-postgres` с `push: true` (`site/payload.config.ts:50-53`). Prod БД **пустая** (схема есть, данных нет) по состоянию на 2026-04-23. Бэкап-скрипт `/usr/local/bin/obikhod-backup.sh` крутится cron 03:00 MSK (daily×7 + weekly×4) в `/var/backups/obikhod/`.

---

## 1. Apr — **Approved with conditions**

Seed безопасен к запуску **после** выполнения pre-deploy checklist (см. §4). Критических блокеров на уровне БД нет: все нужные constraint'ы и индексы либо уже созданы Payload, либо не требуются для MVP-объёма (4 + 7 + 28 + 1 + 1 + 2 = 43 строки в 6 таблицах + 1 global).

Conditions (строго):

1. `pg_dump` полный до запуска (§4.3).
2. Предпрогон-аудит SQL из §4.2 на пустую БД — 6 коллекций должны вернуть `count=0`.
3. QA-отчёт копирует лог seed (stdout) в `team/specs/US-1-seed-prod-db/qa.md` — совпадает с DoD ADR-0001 и sa §8.

Никаких изменений схемы коллекций не требую — всё укладывается в существующую Payload-модель.

---

## 2. Constraints / Uniqueness

### 2.1. Проверено по коду

| Таблица | Поле / комбинация | Тип | Источник |
|---|---|---|---|
| `services` | `slug` | UNIQUE + index | `Services.ts:17-19` (`unique: true, index: true`) |
| `districts` | `slug` | UNIQUE + index | `Districts.ts:14` (`unique: true, index: true`) |
| `service_districts` | `(service, district)` | composite UNIQUE | `ServiceDistricts.ts:27` (`indexes: [{ fields: ['service','district'], unique: true }]`) |
| `service_districts.service` | FK → services | FK + index | `ServiceDistricts.ts:30-36` (`required, index: true`) |
| `service_districts.district` | FK → districts | FK + index | `ServiceDistricts.ts:37-43` (`required, index: true`) |
| `cases.slug` | UNIQUE + index | (по конвенции коллекций Payload с `unique: true`) |
| `persons.slug` | UNIQUE + index | (по конвенции) |

Composite UNIQUE на `(service, district)` — **критичен для REQ-1.1** (идемпотентность): повторный `create` упадёт `23505`, но код seed сначала делает `find(where=and([service.equals, district.equals]))` (sa §5.3) → вставка только при отсутствии.

### 2.2. Что хочу увидеть на prod до старта

Проверяется в §4.2 checklist через `\d+ service_districts` — подтверждение, что composite UNIQUE **реально создан** в Postgres, а не только декларирован в Payload-layer. Payload с `push: true` обычно создаёт index из `indexes: [{...}]`, но это SA §4.4 закрытая claim, требующая живого подтверждения.

### 2.3. Блокеры — **нет**

Всё, что нужно для идемпотентности и защиты от дублей, уже есть в коллекциях. Текста «`be3/be4` — добавьте constraint X» не выдаю.

---

## 3. Индексы

### 3.1. Существующие (создаются автоматически Payload при `push: true`)

- `services.slug` — B-tree unique (из `unique: true, index: true`).
- `districts.slug` — B-tree unique.
- `service_districts.service` — B-tree FK index.
- `service_districts.district` — B-tree FK index.
- `service_districts.(service, district)` — composite unique (покрывает lookup seed'а `find(where=and(...))`).

UNIQUE constraint автоматически материализует B-tree index — дополнительный отдельный index на slug **не нужен**.

### 3.2. Не требуются в US-1

- FTS / GIN на `services.meta_title` / `services.meta_description` / `service_districts.lead_paragraph` — **follow-up для `seo1`** (backlog). 43 записи не дают нагрузки, FTS на коротких полях без поискового UI — преждевременная оптимизация.
- Индекс на `service_districts.publish_status` — **follow-up** (sa §4.4 п.4, `getPublishedServiceDistricts`). Тоже не US-1: фильтр на 28 строках обрабатывается seq-scan за микросекунды.
- BRIN на `created_at` любой таблицы — не актуален до 10k+ строк.

### 3.3. Follow-up для `seo1` / `dba` — записать в backlog

- [ ] GIN / trigram index на `services.metaDescription` + `service_districts.leadParagraph` — **после** появления реального контент-объёма (wave-2, > 200 LP).
- [ ] B-tree index на `service_districts(publish_status, noindex_until_case)` — когда `getPublishedServiceDistricts` начнёт дёргаться в generateStaticParams на > 200 LP.

В рамках US-1 — **ничего создавать руками не надо.**

---

## 4. Pre-deploy checklist (для `do`)

Команды даны в порядке выполнения. Каждую запустить и результат скопировать в `qa.md`.

### 4.1. Убедиться, что мы на prod

```bash
ssh deploy@45.153.190.107
sudo -u postgres psql -d obikhod -c "SELECT current_database(), inet_server_addr(), version();"
```

Ожидание: `current_database = obikhod`, `inet_server_addr = 127.0.0.1` (локальный Postgres на VPS), Postgres 16.x.

### 4.2. Предпрогон-аудит пустоты коллекций и отсутствия конфликта slug

```bash
sudo -u postgres psql -d obikhod <<'SQL'
SELECT 'services' AS tbl, COUNT(*) AS rows FROM services
UNION ALL SELECT 'districts', COUNT(*) FROM districts
UNION ALL SELECT 'service_districts', COUNT(*) FROM service_districts
UNION ALL SELECT 'cases', COUNT(*) FROM cases
UNION ALL SELECT 'persons', COUNT(*) FROM persons
UNION ALL SELECT 'media', COUNT(*) FROM media;

-- Нулевое пересечение по slug (на случай, если кто-то руками через admin уже что-то создал):
SELECT slug FROM services
  WHERE slug IN ('arboristika','ochistka-krysh','vyvoz-musora','demontazh');
SELECT slug FROM districts
  WHERE slug IN ('odincovo','krasnogorsk','mytishchi','khimki','istra','pushkino','ramenskoye');
SELECT slug FROM persons WHERE slug = 'aleksey-semenov';
SELECT slug FROM cases WHERE slug = 'snyali-pen-gostitsa-2026';

-- Подтвердить composite UNIQUE на service_districts (sa §4.4 п.1):
\d+ service_districts
SQL
```

**Ожидаемые результаты:**

- Все `COUNT(*) = 0` (users может быть непустой — не трогаем).
- Ни одна из 3 `SELECT slug ...` ничего не возвращает.
- В `\d+ service_districts` видим строку вида `"service_districts_service_idx_district_idx_key" UNIQUE, btree (service_id, district_id)` (имя index'а может отличаться — главное `UNIQUE` по двум FK).

**Если хоть одно условие нарушено — стоп, эскалация `dba` → `po`.** Это признак, что БД уже не «чистая пустая», и план меняется.

### 4.3. Обязательный `pg_dump` перед seed

```bash
# Вручную, не через cron, чтобы получить именованный слепок
sudo mkdir -p /var/backups/obikhod/pre-seed
sudo -u postgres pg_dump -Fc -d obikhod \
  -f /var/backups/obikhod/pre-seed/obikhod-pre-seed-$(date -u +%Y%m%dT%H%M%SZ).dump

# Проверить размер и целостность
ls -lh /var/backups/obikhod/pre-seed/
sudo -u postgres pg_restore --list /var/backups/obikhod/pre-seed/obikhod-pre-seed-*.dump | head -20
```

Флаг `-Fc` (custom format) — обязателен: `pg_restore` умеет делать selective restore, plain SQL — нет. Имя файла с UTC-timestamp фиксируется в `qa.md`.

Daily backup `/usr/local/bin/obikhod-backup.sh` запускался сегодня в 03:00 MSK — но **этого мало**: нужен слепок именно перед seed'ом (RPO = 0 для seed-операции). `pre-seed` dump не заменяет daily, а дополняет.

### 4.4. Подтвердить daily backup жив

```bash
ls -lh /var/backups/obikhod/daily/ | tail -5
# Ожидание: последний файл <сегодня>, размер > 10 KB (схема + users)
```

### 4.5. Smoke до прогона

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/api/health?deep=1
# Ожидание: 200
```

---

## 5. Ожидаемые row counts после прогона

| Таблица | До seed | После 1-го прогона | После 2-го прогона (AC-1.3.1) |
|---|---:|---:|---:|
| `services` | 0 | 4 | 4 |
| `districts` | 0 | 7 | 7 |
| `service_districts` | 0 | 28 | 28 |
| `cases` | 0 | 1 | 1 |
| `persons` | 0 | 1 | 1 |
| `media` | 0 | 2 | 2 |
| `globals_seo_settings` | 0-1 | 1 | 1 |

Плюс служебные `_versions` / `_rels` / `_locales` таблицы, которые Payload ведёт сам — их `COUNT(*)` не проверяем (объём ≥ основных в 2-3 раза это нормально для Payload 3 с `versions.drafts`).

Пост-прогонная SQL-проверка (для `qa.md`):

```sql
SELECT 'services' AS tbl, COUNT(*) AS rows FROM services
UNION ALL SELECT 'districts', COUNT(*) FROM districts
UNION ALL SELECT 'service_districts', COUNT(*) FROM service_districts
UNION ALL SELECT 'cases', COUNT(*) FROM cases
UNION ALL SELECT 'persons', COUNT(*) FROM persons
UNION ALL SELECT 'media', COUNT(*) FROM media;

-- Убедиться, что ровно 1 published SD с miniCase:
SELECT sd.id, s.slug AS svc, d.slug AS dst, sd.publish_status, sd.no_index_until_case, sd.mini_case_id
  FROM service_districts sd
  JOIN services s ON s.id = sd.service_id
  JOIN districts d ON d.id = sd.district_id
 ORDER BY s.slug, d.slug;
-- Ожидание: 28 строк, из них ровно 1 с publish_status='published' и mini_case_id != NULL (arbo × ramenskoye),
-- 27 draft + noindex_until_case=true + mini_case_id=NULL.
```

### Smoke-check после прогона (для `qa`)

```bash
for svc in arboristika ochistka-krysh vyvoz-musora demontazh; do
  for dst in odincovo krasnogorsk mytishchi khimki istra pushkino ramenskoye; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "https://obikhod.ru/${svc}/${dst}/")
    echo "${svc}/${dst}: ${code}"
  done
done
# Ожидание: 28 × 200. Если хотя бы один 404/500 — блокер.
```

---

## 6. Rollback

### 6.1. Primary — `pg_restore` из pre-seed dump

```bash
# Остановить PM2, чтобы не писал в БД во время restore
ssh deploy@45.153.190.107 'pm2 stop obikhod'

# Restore с --clean --if-exists (дропает всё и накатывает обратно)
sudo -u postgres pg_restore -d obikhod --clean --if-exists --no-owner --no-privileges \
  /var/backups/obikhod/pre-seed/obikhod-pre-seed-<UTC>.dump

# Поднять PM2
ssh deploy@45.153.190.107 'pm2 start obikhod'

# Smoke
curl -s -o /dev/null -w "%{http_code}\n" https://obikhod.ru/api/health?deep=1
```

RTO: ≤ 10 минут (43 записи restore'ятся мгновенно; лимитирующий фактор — PM2 restart + прогрев Next 16).

### 6.2. Alternative — `TRUNCATE ... CASCADE` (**не рекомендую**)

Теоретически возможно:

```sql
BEGIN;
TRUNCATE service_districts, cases, persons, services, districts, media RESTART IDENTITY CASCADE;
UPDATE globals_seo_settings SET organization_telephone = NULL WHERE id = 1;
COMMIT;
```

Но:
- Не гарантирует восстановление `globals_seo_settings` к pre-seed (поля могут быть затронуты `updateGlobal`).
- Не защищает от промежуточных ручных правок оператора через `/admin` между seed и rollback.
- `CASCADE` на случайной лишней таблице = потеря связей.

**Правило:** rollback = `pg_restore`. `TRUNCATE` — только если `pg_restore` почему-то не идёт, с apr `dba` + `po`, с предшествующим ручным `pg_dump` фактического состояния перед TRUNCATE.

### 6.3. Irreversible-точки

Нет. Все операции seed обратимы, потому что pre-seed состояние = «пустая БД», которая отлично восстанавливается из dump'а.

---

## 7. Топ-1 риск

**Риск:** `push: true` на prod (`payload.config.ts:52`) означает, что Payload при старте процесса может попытаться «поправить» схему, если что-то разъедется (Payload обновился, коллекция поменялась). В US-1 схема **не меняется**, но я фиксирую: если перед/во время/после seed PM2 перезапустится и Payload решит что-то drop'нуть из-за рассинхрона кода и БД — seed потеряет смысл.

**Митигация:**
- Pre-deploy `pg_dump -Fc` (§4.3) — primary защита.
- Seed запускается **после** стабилизации PM2 (smoke `/api/health?deep=1` = 200), не во время деплоя.
- В US-2 появится SiteChrome → schema change → pre-US2 dump делаем повторно (это уже не US-1).

**Следствие:** переход на Payload managed migrations — отдельный follow-up US, подтверждён ADR-0001 §Альтернативы A5 и backlog'ом `dba`/`be3`.

---

## 8. Ответы на open questions к DBA из sa.md §9

- [x] **Composite UNIQUE на `(service, district)`** — подтверждается через `\d+ service_districts` в §4.2. Если Payload почему-то не создал DB-constraint (только валидация в app-layer) — фиксируем и создаём руками:
  ```sql
  CREATE UNIQUE INDEX IF NOT EXISTS service_districts_service_district_uniq
    ON service_districts(service_id, district_id);
  ```
  Но ожидаю, что Payload справится сам (паттерн `indexes: [{unique:true}]` используется в Payload 3.83 и работает).
- [x] **Пересечение slug** — проверяется в §4.2. Ожидание: 0 строк.
- [x] **Ручной backup** перед seed — §4.3, `pg_dump -Fc` в `/var/backups/obikhod/pre-seed/`. Имя файла → `qa.md`.
- [x] **Индекс на `service_districts.publish_status`** — **вне US-1**, follow-up §3.3.

---

## 9. Post-seed verification (минимум для `qa` и `dba`)

- [ ] SQL §5 даёт ожидаемые counts + ровно 1 published SD.
- [ ] 28/28 URL из §5 smoke → 200.
- [ ] `/api/health?deep=1` → 200.
- [ ] `sitemap.xml` содержит `/arboristika/ramenskoye/` (sa AC-1.5.4).
- [ ] Pre-seed dump лежит в `/var/backups/obikhod/pre-seed/`, размер > 10 KB, `pg_restore --list` не жалуется.
- [ ] Следующий daily backup (03:00 MSK) прошёл — проверить наутро.

---

## 10. Решение

**✅ Approved — ready for be3 implementation**, при выполнении conditions:

1. Pre-deploy checklist §4 выполнен `do`, логи в `qa.md`.
2. Composite UNIQUE на `service_districts(service_id, district_id)` подтверждён через `\d+`.
3. `pg_dump -Fc` pre-seed сделан и проверен `pg_restore --list`.
4. 0 пересечений по slug (§4.2).
5. Post-seed verification §9 прошла.

Изменений в коде коллекций не требуется. Блокер — нет.

---

## Подпись

**dba**, 2026-04-23. Hand-off `→ po`: `dba.md` готов. Условия списком выше; если `do` выполняет их перед прогоном — `dba` не требует повторного ревью до смены схемы (US-2 — отдельный артефакт).
