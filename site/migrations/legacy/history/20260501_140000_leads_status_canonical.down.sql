-- 20260501_140000_leads_status_canonical (rollback)
-- Reverse mapping для status enum + drop archivedAt + drop partial index.
--
-- Note: НЕ удаляем canonical enum values (contacted, smeta, brigade, done,
-- cancelled) — Postgres не поддерживает ALTER TYPE DROP VALUE напрямую.
-- Old enum values сохраняются (см. up step 1 NOTE).

DROP INDEX IF EXISTS "leads_archived_at_idx";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "archived_at";

-- Step 1: Re-add OLD enum values (idempotent через IF NOT EXISTS) — это
-- handles dev push:true scenario где enum sразу был canonical.
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'in_amocrm';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'estimated';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'converted';
ALTER TYPE "enum_leads_status" ADD VALUE IF NOT EXISTS 'lost';

-- Step 2: Reverse mapping. 'brigade' lossy → 'in_amocrm' (best-effort).
UPDATE "leads" SET "status" = 'in_amocrm'::enum_leads_status WHERE "status"::text = 'contacted';
UPDATE "leads" SET "status" = 'in_amocrm'::enum_leads_status WHERE "status"::text = 'brigade';
UPDATE "leads" SET "status" = 'estimated'::enum_leads_status WHERE "status"::text = 'smeta';
UPDATE "leads" SET "status" = 'converted'::enum_leads_status WHERE "status"::text = 'done';
UPDATE "leads" SET "status" = 'lost'::enum_leads_status      WHERE "status"::text = 'cancelled';
