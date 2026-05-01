-- 20260501_140000_leads_status_canonical — PANEL-LEADS-INBOX § A.1 + § C.3
-- Migrates Leads.status enum to brand-guide §32.4 canon (7 values) and adds
-- archivedAt for soft-delete (per ADR-0012 + dba review).
--
-- IMPORTANT (post-discovery 2026-05-01): Payload `select` field MAPS TO PostgreSQL
-- ENUM TYPE (`enum_leads_status`), NOT varchar. Local-verify обнаружил это —
-- updates to dba review note должны учесть.
--
-- Postgres 12+ позволяет ALTER TYPE ... ADD VALUE IF NOT EXISTS для
-- committed types (existing types — наш case, enum существует с initial schema).
-- Restriction «cannot run inside transaction» применяется только к types
-- созданным в той же tx — наш enum existing → safe.

-- Step 1: Add canonical enum values (idempotent через IF NOT EXISTS).
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'contacted';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'smeta';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'brigade';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'done';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'cancelled';

-- Step 2: data migration — old → canonical mapping.
-- Cast through ::text избегает enum-comparison surprises с дополнительными
-- enum values добавленными в той же tx.
UPDATE "leads" SET "status" = 'contacted'::enum_leads_status WHERE "status"::text = 'in_amocrm';
UPDATE "leads" SET "status" = 'smeta'::enum_leads_status     WHERE "status"::text = 'estimated';
UPDATE "leads" SET "status" = 'done'::enum_leads_status      WHERE "status"::text = 'converted';
UPDATE "leads" SET "status" = 'cancelled'::enum_leads_status WHERE "status"::text = 'lost';
-- 'new' и 'spam' → без изменений; 'brigade' — новый, не было pre-spec данных

-- NOTE: Old enum values (in_amocrm, estimated, converted, lost) остаются в типе
-- после миграции — Postgres не поддерживает ALTER TYPE DROP VALUE напрямую.
-- Cleanup deferred: они становятся orphaned labels, которые Payload не использует.
-- Безопасно. Future cleanup через recreate type pattern если станет важно.

-- Step 3: archivedAt column для soft-delete (§ C.3)
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "archived_at" timestamp(3) with time zone;

-- Step 4: partial index для default list-view фильтра (active inbox)
CREATE INDEX IF NOT EXISTS "leads_archived_at_idx"
  ON "leads" ("archived_at")
  WHERE "archived_at" IS NULL;
