-- 20260501_140000_leads_status_canonical — PANEL-LEADS-INBOX § A.1 + § C.3
-- Migrates Leads.status enum to brand-guide §32.4 canon (7 values) and adds
-- archivedAt for soft-delete (per ADR-0012 + dba review).
--
-- Payload `select` field stores values as varchar — нет Postgres ENUM type,
-- значит rename = simple UPDATE, без ALTER TYPE locks.

-- Step 1: data migration — old → canonical mapping (idempotent через WHERE)
UPDATE "leads" SET "status" = 'contacted' WHERE "status" = 'in_amocrm';
UPDATE "leads" SET "status" = 'smeta'     WHERE "status" = 'estimated';
UPDATE "leads" SET "status" = 'done'      WHERE "status" = 'converted';
UPDATE "leads" SET "status" = 'cancelled' WHERE "status" = 'lost';
-- 'new' и 'spam' → без изменений; 'brigade' — новый, не было pre-spec данных

-- Step 2: archivedAt column для soft-delete (§ C.3)
-- Nullable, без дефолта — мгновенный ALTER в Postgres 11+, без table rewrite
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "archived_at" timestamp(3) with time zone;

-- Step 3: partial index для default list-view фильтра (active inbox)
-- WHERE archived_at IS NULL покрывает ~95% queries (active inbox view)
CREATE INDEX IF NOT EXISTS "leads_archived_at_idx"
  ON "leads" ("archived_at")
  WHERE "archived_at" IS NULL;
-- NOTE: CREATE INDEX без CONCURRENTLY потому что Payload migrate runs внутри
-- транзакции (CONCURRENTLY запрещён в transaction blocks). На текущем объёме
-- (50-150 rows) lock минимален (<100ms). Если в будущем volume вырастет —
-- мигрировать с CONCURRENTLY через отдельный non-tx скрипт.
