---
us: PANEL-LEADS-INBOX
role: tamd+dba
phase: review
status: APPROVE-WITH-CONDITIONS
created: 2026-05-01
skills_activated: [architecture-decision-records, database-migrations, postgres-patterns, security-review]
---

# PANEL-LEADS-INBOX — tamd + dba review

**Авторы:** tamd (architecture) + dba (database)
**Источник:** [sa-panel.md](sa-panel.md) v1 (popanel approved 2026-05-01 «иди по PO defaults»)
**Скоп ревью:** Q2 enum semantics + US-13 conflict + Q5 jsonb storage + 3 миграции + rollback plan + indexing
**Iron rule check:** обе роли активировали свои skills (tamd: `architecture-decision-records`; dba: `database-migrations` + `postgres-patterns`); leadqa iron rule #6 (real-browser smoke ДО push) явно прописан в acceptance.

---

## tamd verdict — **APPROVE с открытием ADR-0012**

**Rationale:**

1. **Q2 enum migration `in_amocrm → contacted` — APPROVED (semantically correct).**
   - `in_amocrm` — это **sync-flag, а не workflow status**. Sync-state живёт в `syncedAt` + `amoCrmId` полях (уже существуют, US-13 их будет писать).
   - Workflow status (new/contacted/smeta/brigade/done/cancelled/spam) ortogonal к amoCRM sync-state.
   - **US-13 не блокируется** — adapter layer в US-13 будет mapping'овать наши 7 status'ов в amoCRM pipeline stages (Первичный контакт / Принимают решение / etc.) через таблицу.
   - **Дополнительный bonus:** освобождение workflow от sync concerns упрощает US-13 design (clean separation).
   - **Рекомендация (опционально, не для этого US):** в US-13 добавить computed field `amoSynced: Boolean(amoCrmId)` для visual indicator в admin UI без putting в status enum.

2. **Q5 `statusHistory: jsonb[]` vs Payload native versions — APPROVED.**
   - Payload `versions: true` хранит полные снапшоты документа (фото, estimateDraftJson, all fields) → overkill для tracking single field.
   - `versions` создают `_leads_v` + 3-5 join tables → удар по сложности схемы и риск pattern US-12 W6 SeoSettings v_join_tables_fixup при будущих field additions.
   - **Verified:** Leads.ts currently НЕ имеет `versions: true` (`grep -n "versions\|drafts" Leads.ts` → empty), значит **нет existing `_leads_v*` tables → нет risk pattern US-12 W6 для этой миграции** (см. dba § Risk).
   - jsonb array embedded — single query без JOIN, индексы GIN опционально (см. dba § Performance).

3. **ADR-0012 OPENED** — `/Users/a36/obikhod/team/adr/ADR-0012-payload-cell-inline-update.md`.
   - **Why:** архитектура non-trivial (custom field Cell + REST inline-update + virtual field + hooks для audit history). Это категория lessons learned US-12 W2.A v1 (ADR-0007 — `views.login.beforeLogin` API ассумировался → не существует → переписали).
   - **Что фиксирует:** verified Payload API (Cell + virtual + hooks), Plan A + Plan B для virtual field, optimistic UI rollback strategy, US-13 conflict resolution, real-browser smoke gate.
   - **Без ADR-0012 риск:** be-panel/fe-panel в dev-фазе ассумирует API без verification → runtime failure после type-check OK (повтор pattern leadqa memory `feedback_leadqa_must_browser_smoke_before_push`).

**Conditions перед dev start:**

- [ ] sa-panel.md § Architecture decisions обновить: «ADR-needed = no» → ссылка на ADR-0012.
- [ ] be-panel + fe-panel прочитать ADR-0012 ДО prototype, зафиксировать skill activation в hand-off log.
- [ ] Plan A vs Plan B для virtual field Cell — решение в первые ~30 минут dev-фазы через быстрый prototype в local dev.

---

## dba verdict — **APPROVE migration plan**

**Rationale:** объём данных тривиален (50-150 leads × ~3-5 status changes = ~500 events), zero-downtime гарантирован за счёт nullable defaults и CONCURRENTLY indexes. 152-ФЗ риски минимальны (миграция не трогает PII).

### Migration plan (3 файла, sequential apply)

#### Migration 1: `20260502_120000_leads_status_canonical.ts`

**Purpose:** rename status enum values + add `archivedAt` column. Schema change + data migration в одном файле — допустимо потому что (a) обе операции для одной коллекции, (b) data migration обратима через WHERE-clauses.

**up.sql:**

```sql
-- 20260502_120000_leads_status_canonical
-- PANEL-LEADS-INBOX § A.1 + § C.3
-- Step 1: data migration статусов (idempotent через WHERE old-value)
UPDATE "leads" SET "status" = 'contacted'  WHERE "status" = 'in_amocrm';
UPDATE "leads" SET "status" = 'smeta'      WHERE "status" = 'estimated';
UPDATE "leads" SET "status" = 'done'       WHERE "status" = 'converted';
UPDATE "leads" SET "status" = 'cancelled'  WHERE "status" = 'lost';
-- 'new' → 'new', 'spam' → 'spam' — без изменений

-- Step 2: add archivedAt for soft-delete (§ C.3)
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "archived_at" timestamptz;

-- Step 3: index для frequent filter (default list-view skip archived)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "leads_archived_at_idx"
  ON "leads" ("archived_at")
  WHERE "archived_at" IS NULL;
-- Partial index — оптимизирует наиболее частый case (active inbox, ~95% rows)
```

**down.sql:**

```sql
-- 20260502_120000_leads_status_canonical (rollback)
DROP INDEX IF EXISTS "leads_archived_at_idx";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "archived_at";

-- Reverse status mapping (lossy для 'brigade' — нет old equivalent, fall to 'contacted')
UPDATE "leads" SET "status" = 'in_amocrm' WHERE "status" = 'contacted';
UPDATE "leads" SET "status" = 'in_amocrm' WHERE "status" = 'brigade';   -- best effort
UPDATE "leads" SET "status" = 'estimated' WHERE "status" = 'smeta';
UPDATE "leads" SET "status" = 'converted' WHERE "status" = 'done';
UPDATE "leads" SET "status" = 'lost'      WHERE "status" = 'cancelled';
```

**ts wrapper:** копия паттерна `20260428_140000_users_telegram_chat_id.ts` (readSql helper, MigrateUpArgs/MigrateDownArgs).

**ВАЖНО (Postgres-specific):** Payload `select` field хранится как `varchar` в БД (НЕ Postgres ENUM type), значит **enum extension НЕ требует ALTER TYPE** — только UPDATE rows. Это упрощает миграцию (no `ALTER TYPE ADD VALUE` lock concerns).

**Verification:**

```sql
-- pre-apply: count distribution old statuses
SELECT status, COUNT(*) FROM leads GROUP BY status;

-- post-apply: should be ONLY {new, contacted, smeta, brigade, done, cancelled, spam}
SELECT status, COUNT(*) FROM leads GROUP BY status;
SELECT COUNT(*) FROM leads WHERE status NOT IN
  ('new','contacted','smeta','brigade','done','cancelled','spam');
-- Expected: 0
```

#### Migration 2: `20260502_120100_leads_status_history.ts`

**Purpose:** add `status_history` jsonb column.

**up.sql:**

```sql
-- 20260502_120100_leads_status_history
-- PANEL-LEADS-INBOX § A.3 + ADR-0012

-- jsonb (NOT json) — поддерживает GIN-индекс если понадобится в будущем
-- DEFAULT '[]'::jsonb — instant в Postgres 11+, no full table rewrite
ALTER TABLE "leads"
  ADD COLUMN IF NOT EXISTS "status_history" jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill для existing rows — synthetic «миграция была» entry
-- Это позволяет history list быть not-empty даже для pre-spec leads
UPDATE "leads"
  SET "status_history" = jsonb_build_array(
    jsonb_build_object(
      'from', NULL,
      'to', "status",
      'changedBy', NULL,
      'changedAt', COALESCE("updated_at", "created_at", NOW())::text,
      'note', 'migration: pre-PANEL-LEADS-INBOX baseline'
    )
  )
  WHERE "status_history" = '[]'::jsonb;
```

**down.sql:**

```sql
-- 20260502_120100_leads_status_history (rollback)
ALTER TABLE "leads" DROP COLUMN IF EXISTS "status_history";
```

**Note:** Payload `json` field maps to **jsonb** в Postgres (не `json`) — verified в Payload's drizzle adapter source. Используем `jsonb` напрямую в SQL для clarity.

#### Migration 3 (опциональная, для performance): `20260502_120200_leads_status_index.ts`

**Purpose:** composite index для default-фильтра list-view (`WHERE status NOT IN (...) AND archived_at IS NULL ORDER BY created_at DESC`).

**up.sql:**

```sql
-- 20260502_120200_leads_status_index
-- Composite covering index для default list-view query

CREATE INDEX CONCURRENTLY IF NOT EXISTS "leads_active_inbox_idx"
  ON "leads" ("status", "created_at" DESC)
  WHERE "archived_at" IS NULL;
-- Partial composite index:
--   - Equality + range: status (eq, NOT IN handled by sequential scan over 7 values) + created_at (sort)
--   - Partial WHERE archived_at IS NULL — оптимизирует ~95% queries (active inbox)
--   - Покрывает: SELECT * FROM leads WHERE status IN (...) AND archived_at IS NULL ORDER BY created_at DESC LIMIT 50
```

**down.sql:**

```sql
DROP INDEX IF EXISTS "leads_active_inbox_idx";
```

**Decision:** **defer Migration 3 на YAGNI** — для 50-150 rows index overhead > benefit. Включить когда volume превысит 1000 rows (estimate ~6 месяцев). Be-panel в dev-фазе **не создаёт** этот index, фиксирует TODO в `team/backlog.md`.

### Indexes summary

| Index | Type | Когда создаём | Purpose |
|---|---|---|---|
| `leads_phone_idx` (existing) | B-tree | already exists (Leads.ts:31 `index: true`) | Phone search/dedup |
| `leads_archived_at_idx` | B-tree partial (`WHERE archived_at IS NULL`) | Migration 1 | Default list-view skip archived |
| `leads_active_inbox_idx` | B-tree composite partial | **deferred** (Migration 3, YAGNI) | Active inbox compound query |
| `leads_status_history_gin_idx` | GIN | **deferred** (future US) | Search by historical status (e.g. «leads that were ever in `smeta`») |

**Не создаём** GIN на `status_history` jsonb — нет use case в текущем US (history только rendering в edit view, не search).

### Rollback plan

**Сценарий 1: Migration 1 fails в проде (data migration ошибка)**

- Down-migration: revert UPDATE через reverse mapping (выше). `brigade → contacted` lossy — но это OK (новый status, нет данных pre-spec).
- Сценарий «частичный fail»: Postgres транзакция автоматически откатит UPDATE (Payload migrate использует BEGIN/COMMIT). Нет partial state.

**Сценарий 2: Migration 2 fails (jsonb backfill loop too slow на больших таблицах)**

- На 50-150 rows backfill завершится за <100ms. На текущем объёме risk = 0.
- Если в будущем объём вырастет: backfill можно вынести в отдельную миграцию (separate schema + data per database-migrations skill recommendation), batch 1000 rows.

**Сценарий 3: Application code breaks после миграции (Cell components не работают)**

- Application revert через PR revert — не требует down-migration (схема forward-compatible с старым кодом, поскольку нет required NOT NULL без default).
- Old Leads admin UI продолжит работать с новыми status values (просто покажет «contacted» вместо «in amoCRM», но select всё ещё рендерится).

**Сценарий 4: Полный rollback (revert и schema, и code)**

```bash
# В порядке, обратном apply:
pnpm payload migrate:down  # rollback Migration 2 (статус history)
pnpm payload migrate:down  # rollback Migration 1 (status canonical + archived_at)
git revert <PR commit>     # rollback application code
pnpm db:up && pnpm dev     # verify
```

### Timing

- **US-12 closed** ✅ (verified в memory `project_program_progress_2026-04-27` + recent commits 00f0b33).
- **Prod free** — нет блокирующих миграций в polling deploy queue.
- **Recommended window:** apply миграций сразу после merge PR (zero-downtime, Beget VPS uptime не affected — таблицы блокируются <100ms).
- **deploy.yml step:** уже включает `pnpm payload migrate` (verified pattern из ADR-0009 context). Миграции применятся автоматически при deploy.

### Risk: pattern US-12 W6 SeoSettings v_join_tables_fixup

**Verified:** Leads.ts currently does NOT have `versions: true` или `drafts: true` config. Значит:
- Нет existing `_leads_v` table.
- Нет existing `_leads_v_version_*` join tables.
- Этот US не добавляет `versions: true`.
- **Risk = 0** для current US.

**Если в будущем US** добавит `versions: true` к Leads → tamd review обязателен + следовать паттерну `20260426_210000_v_version_join_tables_fixup` (sequential CREATE TABLE для каждой `_v_version_<array_field>` таблицы).

### Security & 152-ФЗ check (security-review skill)

- Миграции не expose новые PII (status_history содержит только status values + user IDs + timestamps).
- `archived_at` — soft-delete preserves PII (152-ФЗ позволяет хранить до явного запроса субъекта). Hard-delete остаётся доступен через native Payload UI (per Q4 decision).
- RBAC: `Leads.access.read` ограничивает admin/manager only — миграции не меняют access rules.
- `status_history.changedBy` хранит user.id (foreign key к users.id, integer) — не email. Безопасно для логов.

---

## Action items для be-panel

1. **Прочитать ADR-0012** до start dev. Зафиксировать skill activation в hand-off log спека.
2. **Создать 2 миграции** (Migration 1 + Migration 2 выше) через `pnpm payload migrate:create`:
   - `20260502_120000_leads_status_canonical` (status rename + archived_at + partial index)
   - `20260502_120100_leads_status_history` (jsonb + backfill)
   - **НЕ создавать** Migration 3 (composite index — deferred, добавить TODO в `team/backlog.md`).
3. **Update `Leads.ts` schema:**
   - Status enum: 7 опций (new/contacted/smeta/brigade/done/cancelled/spam) с RU labels.
   - Add `statusHistory: json` field (readOnly, default `[]`, кастомный Field component для render).
   - Add `archivedAt: date` field в табе «Статус» (admin only).
   - Add `_actions: text` virtual field (если Plan A) с Cell component.
   - Update status field: add `Cell: '@/components/admin/leads/StatusPillCell'`.
4. **Add `hooks.beforeChange`** для status change → append entry в statusHistory (см. ADR-0012 § 3 code sample).
5. **Endpoint expansion:**
   - Расширить `/api/admin/leads/count` — accept `?status=new&status=contacted&...` multi-value, return `{ counts: { new: 12, contacted: 5, ... } }`.
   - Создать `/api/admin/leads/utm-sources` — DISTINCT utmSource WHERE NOT NULL ORDER BY count DESC LIMIT 20, cached 5 min.
6. **Verification ДО push:**
   - Migration apply local: `pnpm payload migrate` → verify enum distribution через psql.
   - Migration rollback local: `pnpm payload migrate:down` → verify reverse mapping.
   - Type-check + lint + format:check (iron rule #5 — `do` requires green CI).
7. **Hand-off cr-panel** только после local-verify (PO iron rule #4).

## Action items для popanel

1. **Update sa-panel.md § Architecture decisions** — изменить «ADR-needed = no» на ссылку на ADR-0012.
2. **Schedule dev orchestration:**
   - be-panel (миграции + schema + hooks + endpoints) — параллельно fe-panel.
   - fe-panel (StatusPillCell + RowActionsCell + LeadsQuickFilters + bulk actions + custom.scss extension + StatusHistoryField) — параллельно be-panel.
   - ux-panel — visual review pills/chips/dropdown в dev-фазе (после first prototype).
   - qa-panel — Playwright smoke (4 сценария AC-X.4) + axe-core regression — после dev complete.
   - cr-panel — code review + brand-guide §12 mapping checklist.
   - leadqa — real-browser smoke ДО push (iron rule #6).
3. **Update `team/backlog.md`** — добавить TODO «Migration 3: leads_active_inbox_idx (defer until volume >1000 rows)».
4. **Hand-off log entry в sa-panel.md § Hand-off log** — добавить строку: «2026-05-01 · tamd+dba → popanel · review APPROVE-WITH-CONDITIONS · ADR-0012 opened · ready be-panel + fe-panel orchestration».

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | tamd+dba | review request: Q2 enum semantics + US-13 conflict + Q5 jsonb storage + 3 миграции + rollback |
| 2026-05-01 | tamd+dba | popanel | **review complete · status APPROVE-WITH-CONDITIONS** · ADR-0012 opened (`team/adr/ADR-0012-payload-cell-inline-update.md`) · 7 action items для be-panel · 4 action items для popanel · ready передавать be-panel + fe-panel parallel orchestration после popanel update sa-panel § Architecture decisions |
