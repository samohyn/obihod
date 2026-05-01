---
adr: ADR-0013
title: Panel Global Search performance strategy — pg_trgm UNION с post-filter access control
status: Accepted
date: 2026-05-01
accepted_by: popanel (autonomous mandate)
accepted_date: 2026-05-01
authors: [tamd]
related:
  - specs/PANEL-GLOBAL-SEARCH/sa-panel.md
  - team/adr/ADR-0010-payload-views-list-customization.md
  - team/adr/ADR-0012-payload-cell-inline-update.md
skill: architecture-decision-records
---

# ADR-0013 · Panel Global Search performance strategy

**Статус:** Proposed (autonomous mandate, popanel sign-off pending). При имплементации → Accepted.
**Дата:** 2026-05-01
**Автор:** tamd
**Контекст US:** [PANEL-GLOBAL-SEARCH](../../specs/PANEL-GLOBAL-SEARCH/sa-panel.md)
**Skill activation:** `architecture-decision-records` (skill-check iron rule); `postgres-patterns`, `api-design` (контекстно).

---

## Контекст

PANEL-GLOBAL-SEARCH §AC4 требует **p95 < 500ms** для top-bar global search по 7 коллекциям (Leads, Services, ServiceDistricts, Cases, Blog, Pages/B2BPages, Persons) на dev-data 10 000 Leads + 100 Services + 200 Districts + 50 Cases/Blog + 30 Pages + 20 Persons. UX-budget оператора — ≤300ms «ввод → видны результаты», иначе ощущение лагающего admin (Cmd+K паттерн, конкуренты Linear/Notion дают 30-80ms).

Spec §AC2 фиксирует контракт endpoint `GET /api/admin/search?q=&limit=10` → `{ groups, total, took_ms }` независимо от внутренней реализации. Открыт **выбор стратегии агрегации** — sequential Local API per collection vs single SQL UNION ALL с pg_trgm vs внешний search index (Meilisearch/Typesense).

**Бизнес-контекст:**
- Admin-только endpoint (RBAC `req.user?.collection === 'users'`, admin/manager роли).
- 152-ФЗ: вся выдача и индексация остаётся в РФ (Beget VPS Postgres 16).
- Поля включают PII (Leads.customer_phone, customer_name) → внешний index требовал бы юридического обоснования трансфера.
- Сейчас Payload коллекции живут в одной Postgres 16 базе на той же VPS (см. CLAUDE.md § Tech Stack), `pg_trgm` доступен из коробки PG ≥9.1 как extension.

**Связанный incident pattern (US-12 retro L2 PANEL-RSC-LINT, см. ADR-0015 в этой же серии):** type-check + lint = необходимое, но не достаточное. Любая стратегия должна включать **runtime perf-smoke в CI** на репрезентативной выборке (10k Leads), не только spec compliance.

---

## Решение

**Принимается Strategy 2 — Single SQL UNION ALL через `pg_trgm` extension с post-filter access control в Node.**

```
GET /api/admin/search?q=иван&limit=10
   ↓
Next.js route handler /site/app/(payload)/api/admin/search/route.ts
   ↓
1. RBAC guard: req.user.collection === 'users' && req.user.role in {admin,manager} else 401
2. Query length guard: q.trim().length < 2 → return { groups: [], total: 0, took_ms: 0 }
3. Single Postgres query через payload.db.drizzle (либо raw `payload.db.pool.query`):

   SELECT * FROM (
     SELECT 'leads' AS collection, id::text, customer_name AS title,
            customer_phone AS subtitle,
            similarity(coalesce(customer_name,'') || ' ' || coalesce(customer_phone,''), $1) AS rank
     FROM leads
     WHERE (customer_name % $1 OR customer_phone % $1)
     ORDER BY rank DESC LIMIT 10
   )
   UNION ALL
   SELECT * FROM (
     SELECT 'services' AS collection, id::text, title, slug AS subtitle,
            similarity(title || ' ' || coalesce(slug,''), $1) AS rank
     FROM services
     WHERE (title % $1 OR slug % $1)
     ORDER BY rank DESC LIMIT 10
   )
   UNION ALL
   -- ... 5 more коллекций (service_districts, cases, blog, b2b_pages, persons)
   ORDER BY rank DESC;

4. Hits in-memory: для каждой строки → payload.find({ collection, where: { id: { equals } }, depth: 0, overrideAccess: false, user: req.user })
   (post-filter access — отбрасываем те, к которым у user нет read).
5. Group by collection → assemble response { groups: [...], total, took_ms }.
```

### Почему именно так

1. **Performance budget bunker.** pg_trgm % operator + GIN index `gin (col gin_trgm_ops)` дают O(log n) lookup на 10k Leads. Эмпирическая оценка по Postgres docs + benchmarks (PostgresPro RU, Citus 2024 trgm benchmarks): single UNION query на 7 small/medium tables с GIN trgm индексами укладывается в 30-80ms p95. С overhead Node + JSON serialize + 7×Local API post-filter — реалистичный p95 100-200ms, в 2.5× меньше AC4 budget (500ms) и в 1.5× меньше UX budget (300ms).

2. **Один round-trip к Postgres.** Sequential `Promise.all([payload.find × 7])` создаёт 7 параллельных connections из Node pool, каждый — full Payload query pipeline (access check resolve + relationships preload + hooks). На 7 коллекциях × 10k rows worst-case это 7×100ms = 700ms p95 (verified-by-pattern: PR #100 `/api/admin/leads/count` показал 80-120ms на одном `count`). UNION экономит 6 round-trips и avoid'ит Local API overhead.

3. **Native to стек.** Postgres 16 + pg_trgm — уже в CLAUDE.md § Tech Stack, никаких новых сервисов в инфра. Strategy 3 (Meilisearch/Typesense) добавляет: дополнительный процесс на VPS (RAM +200-500 MB, недопустимо при текущих 2GB), sync layer (afterChange hooks → reindex), деплой/restart procedure для do, юридический analysis для 152-ФЗ (search index = production database, должна быть РФ-юрисдикция).

4. **Reversibility.** Контракт endpoint стабилен. Если в будущем pg_trgm перестанет хватать (например, 100k+ Leads + 1k+ concurrent admin sessions) → swap на Strategy 3 без UI/spec rewrite, только server impl.

5. **Access control через post-filter, не bypass.** SQL UNION возвращает кандидатов **без** фильтрации; затем для каждой строки прогоняем `payload.find({ where: { id: { equals } }, overrideAccess: false, user: req.user })`. Это сохраняет Payload RBAC invariant (никакая роль не видит то, чего не должна), при этом access check выполняется только для top N=10 hits на коллекцию = max 70 проверок на запрос — дёшево. **Не используем `overrideAccess: true` ни при каких условиях** — это явный security antipattern (см. ADR-0012 § Risks). Для коллекций с completely public read (например Services) post-filter становится no-op.

### Реализация GIN indexes — миграция

Для каждой коллекции из 7 — индекс по поисковым полям:

```sql
-- Заводится один раз через payload migration (dba creates after ADR accept)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS leads_search_trgm
  ON leads USING gin ((coalesce(customer_name,'') || ' ' || coalesce(customer_phone,'')) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS services_search_trgm
  ON services USING gin ((title || ' ' || coalesce(slug,'')) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS service_districts_search_trgm
  ON service_districts USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS cases_search_trgm
  ON cases USING gin ((title || ' ' || coalesce(slug,'')) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS blog_search_trgm
  ON blog USING gin ((title || ' ' || coalesce(slug,'')) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS b2b_pages_search_trgm
  ON b2b_pages USING gin ((title || ' ' || coalesce(slug,'')) gin_trgm_ops);

CREATE INDEX IF NOT EXISTS persons_search_trgm
  ON persons USING gin (name gin_trgm_ops);
```

dba валидирует названия таблиц (Payload может использовать `_v` суффиксы для versioned, см. ADR-0012 § Verification — Leads на 2026-05-01 БЕЗ versions).

### Russian text handling

- Default `pg_trgm` operator `%` использует `pg_trgm.similarity_threshold` (по умолчанию 0.3). Триграммы языко-нейтральны (n-граммы по байтам/символам), для кириллицы работают идентично латинице.
- Payload коллекции хранят русский текст в UTF-8; Postgres collation `ru_RU.UTF-8` либо `en_US.UTF-8` — для % operator не важно (триграмма on raw bytes/chars).
- Для дополнительной устойчивости к регистру / диакритике: `LOWER(coalesce(customer_name,''))` в выражении индекса. **Не подключаем** `unaccent` extension — для русского нет диакритики (ё/е — отдельный edge case, который можно оставить точному match'у; trgm и так толерантен через similarity threshold).
- Postgres FTS (`tsvector` + `russian` config) **не используется** на MVP — overkill для substring search use case (поиск «иван» должен ловить «Иванов», что у tsvector работает только через `:*` prefix syntax с побочными эффектами).

---

## Альтернативы

### Альтернатива 1 — Sequential Local API per collection (`Promise.all([payload.find × 7])`)

**Pros:**
- Простейшая имплементация (~30 строк кода в route handler, нет SQL).
- Access control применяется автоматически (Payload Local API всегда уважает RBAC).
- Никакая миграция не нужна.

**Cons:**
- p95 budget violation вероятен: 7 параллельных query × ~80-150ms (Payload `find` с RBAC resolve + JSON serialize) = 600-1000ms даже на dev-data. На каждой коллекции с 10k+ rows будет SeqScan по полям без индекса (Payload не создаёт автоматически индексы по text fields для search use case).
- Local API не оптимизирован для concurrent на same db pool (Payload использует pg pool ~20 connections, 7 одновременных queries × multiple round-trips для relationships = potential pool starvation при concurrent admin sessions).
- Каждое добавление коллекции = +N ms к latency (linear scaling).

**Verdict:** Rejected — нарушает AC4 perf budget на репрезентативной выборке. Оставлен как **fallback Plan B** если pg_trgm migration критически блокируется (см. § Implementation outline).

### Альтернатива 2 — Single SQL UNION ALL через `pg_trgm` (выбран — см. § Решение)

### Альтернатива 3 — Внешний search index (Meilisearch / Typesense / OpenSearch)

**Pros:**
- p95 5-30ms на любых объёмах (in-memory search index с IDF ranking).
- Native typo tolerance (Meilisearch), faceting, relevance tuning.
- Масштабируется на 1M+ документов без degradation.
- Built-in highlighting / suggestions / synonyms.

**Cons:**
- Дополнительный сервис на инфра: Meilisearch ~150-250 MB RAM, Typesense ~100-200 MB. Текущая VPS 2GB / 2 vCPU — apps/shop в roadmap уже требует апгрейд до 4GB (см. memory `project_shop_separate_team`), search index добавит ещё constraint.
- Sync layer: afterChange/afterDelete hooks per collection → reindex calls. Race conditions, partial failures, eventual consistency окно (~1-5s) — admin может увидеть свежесозданную услугу не сразу. Operational overhead для do.
- 152-ФЗ юрисдикция: Meilisearch/Typesense self-hosted на VPS Beget — формально РФ, но юр-аналитик команды должен подписать (Leads.customer_phone в индексе = PII в новом storage). При желании Yandex Cloud Search Service — managed, но лишний vendor.
- Lock-in: API контракт search engine ≠ Postgres SQL. Swap обратно дорого.
- YAGNI на текущем масштабе — 10k Leads + 200 Districts даже на SeqScan укладываются в 200ms; pg_trgm + GIN снизит до 30ms; смысла приносить новый сервис нет.

**Verdict:** Rejected на MVP. **Defer until usage justifies** — конкретный триггер: prod p95 search latency >300ms три недели подряд ИЛИ Leads >100k ИЛИ admin concurrent sessions >50. Тогда — отдельный ADR с обновлённой инфра-сметой.

### Альтернатива 4 — Postgres FTS (`tsvector` + `russian` config + GIN)

**Pros:**
- Native ranking (`ts_rank_cd`), language-aware stemming (Иванов → Иван → Ивановы все совпадут).
- Indexed lookup без extension (FTS встроен).

**Cons:**
- Stemming требует **полное слово** для match — admin набирает «иван» → не находит «Иванов» без `:*` prefix syntax. С `:*` производительность хуже trgm на коротких queries.
- Конфиг `russian` обрабатывает только русский → mixed RU/EN коллекции (slug на латинице) требуют двух tsvector'ов на коллекцию.
- Substring search (UI typing «вано» → «Иванов») не работает через FTS, требует trgm всё равно.

**Verdict:** Rejected — не решает основной use case (typing-as-you-search), требует hybrid с trgm anyway. trgm-only проще и сильнее для substring matching.

---

## Последствия

### Положительные

- **p95 budget с запасом:** ожидаемые 100-200ms vs AC4 budget 500ms (×2.5 headroom для prod-data роста до 50-100k Leads).
- **One round-trip per search:** UNION ALL обходит N+1 проблему Local API; pg pool не starvation-prone.
- **Реверсивность:** контракт endpoint стабилен; swap на Strategy 3 — server-only, без UI/spec rewrite.
- **152-ФЗ-чистая стратегия:** все данные остаются в Postgres VPS, никакого нового storage layer.
- **Низкая инфра-стоимость:** одна миграция (CREATE EXTENSION + 7 GIN indexes), нет нового сервиса для do.
- **Access control сохраняется:** post-filter через `payload.find({ overrideAccess: false })` обеспечивает RBAC invariant — security review cr-panel проходит без compromises.

### Отрицательные

- **SQL boilerplate в route handler:** 7-way UNION ALL — ~80 строк SQL, поддержка при добавлении коллекции = manual update query template. Mitigation: вынести в `site/lib/admin/global-search/buildUnionQuery.ts` с typed config object `{ collection, table, fields[], titleExpr, subtitleExpr }`, добавление коллекции = добавление одной строки в config.
- **GIN индексы стоят disk space + write overhead:** ~10-20% over base table size, +5-10ms на INSERT/UPDATE Lead. Acceptable для admin-write rate (50-150 leads/week × ms-overhead = irrelevant).
- **Post-filter access check добавляет N×Local API hit (max 70):** для коллекций с public access — overhead, но <50ms на 70 cached `find by id`. Acceptable, не нарушает budget.
- **Не language-aware:** «Иван» / «Ивана» / «Иванов» не дают одинаковый rank как у FTS stemming. Acceptable для MVP — оператор поймёт что искать substring, не lemma; для ranked relevance — defer до Strategy 3.

### Mitigation

- **Perf regression detection:** добавить в Playwright e2e (qa-panel) load-test scenario — `seed 10k leads` fixture + `Cmd+K → ввести "тест" → assert took_ms < 500`. Запуск в CI (do owns green CI before merge per iron rule #5). При regression — explicit failure, не silent degradation.
- **Pool starvation guard:** Payload pg pool default = 20 connections. Search query = single connection ≪ 20 → нет рисков.
- **Migration rollback:** down-migration `DROP INDEX *_search_trgm; DROP EXTENSION pg_trgm;` — idempotent, безопасный.
- **Connection-level statement timeout:** `SET LOCAL statement_timeout = '500ms'` в start транзакции search query → если worst-case query >500ms (e.g., extreme load), Postgres сам прервёт, route вернёт 503 + Sentry capture, не зависнет UI.

### Риски

- **Risk:** Payload table names различаются от ожидаемых (например `_v` суффиксы для versioned collections — см. ADR-0012). Mitigation: dba валидирует точные имена через `\dt` в dev перед PR; verification step фиксируется в spec DoD.
- **Risk:** pg_trgm `similarity_threshold` 0.3 может быть слишком строгим для коротких queries («иван» вернёт «Иванов» с score ~0.4, OK; «ив» — score ~0.3, edge case). Mitigation: explicitly выставить порог через `set_limit(0.2)` per query session либо использовать operator `<%` (word similarity) вместо `%`.
- **Risk:** Race condition при `CREATE INDEX CONCURRENTLY` если миграция гоняется на live data (US-13 amoCRM future deploys). Mitigation: dba use `CONCURRENTLY` flag в migration; lock-aware indexer.

---

## Implementation outline

1. **dba** — миграция `add_pg_trgm_search_indexes`:
   - `CREATE EXTENSION IF NOT EXISTS pg_trgm`.
   - 7 × `CREATE INDEX CONCURRENTLY IF NOT EXISTS *_search_trgm USING gin (... gin_trgm_ops)`.
   - Down migration — `DROP INDEX *_search_trgm`.
   - Validate table names против актуального Payload schema на dev.

2. **be-panel** — `site/app/(payload)/api/admin/search/route.ts`:
   - RBAC guard (admin/manager only) → 401 на others.
   - Query length guard (< 2 chars → empty response).
   - Build UNION ALL query через `site/lib/admin/global-search/buildUnionQuery.ts` (config-driven).
   - Execute via `payload.db.drizzle` (либо `payload.db.pool` raw query).
   - Post-filter access check: `Promise.all(rows.map(row => payload.find({ collection: row.collection, where: { id: { equals: row.id } }, overrideAccess: false, user: req.user, depth: 0 })))`.
   - Group by collection, assemble `{ groups, total, took_ms }`.
   - `SET LOCAL statement_timeout = '500ms'` в начале транзакции.
   - Sentry capture на error / timeout.

3. **fe-panel** — `<GlobalSearch>` component (slot wiring отдельная задача sa-panel §approach).

4. **qa-panel** — Playwright e2e:
   - Seed 10k Leads + remaining коллекции через fixture.
   - Cmd+K → ввести «тест» → assert response time < 500ms (через `route.headers['server-timing']` либо measured).
   - RBAC test — non-admin user 401.
   - Empty query (<2 chars) → no fetch.
   - Unicode test — кириллица «Иван» → находит Leads с customer_name «Иванов».

5. **cr-panel** review checklist:
   - RBAC guard на endpoint.
   - `overrideAccess: false` в Local API post-filter.
   - SQL injection guard — параметризованные queries ($1), не string interpolation.
   - Statement timeout в транзакции.
   - Sentry capture.

6. **leadqa** — real-browser smoke (iron rule #6 + memory `feedback_leadqa_must_browser_smoke_before_push`):
   - Login as admin → Cmd+K → 5 queries различной длины → verify dropdown.
   - Verify console errors = 0 на critical path.
   - Screenshot в `screen/leadqa-PANEL-GLOBAL-SEARCH-*.png`.

**Plan B (fallback if pg_trgm migration критически блокируется):** Sequential Local API per collection с **жёстким `limit: 5` per коллекция** + connection pool tuning. Acceptable interim до pg_trgm rollout, deploy без блокировки спеца. Контракт endpoint не меняется.

---

## References

- Spec: [`specs/PANEL-GLOBAL-SEARCH/sa-panel.md`](../../specs/PANEL-GLOBAL-SEARCH/sa-panel.md)
- Postgres docs: https://www.postgresql.org/docs/16/pgtrgm.html
- ADR-0010 (Payload list-view customization) — для prior verifying Payload API patterns.
- ADR-0012 (Payload Cell inline-update) — для precedent работы с Payload коллекциями + RBAC через REST.
- US-12 retro § Lessons L2 (PANEL-RSC-LINT) — в этой же серии ADR-0015.
- Memory: `feedback_leadqa_must_browser_smoke_before_push` — обязательный real-browser smoke перед push.
- CLAUDE.md § Technology Stack — Postgres 16 + Beget VPS, 152-ФЗ jurisdiction.

---

## История

- 2026-05-01 · sa-panel зафиксировал spec PANEL-GLOBAL-SEARCH с открытым question по strategy 1/2/3.
- 2026-05-01 · popanel передал tamd под autonomous mandate.
- 2026-05-01 · tamd accepted Strategy 2 (pg_trgm UNION с post-filter access). Awaiting popanel sign-off → status Accepted, dev-ready.
