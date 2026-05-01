-- 20260501_140000_leads_status_canonical (rollback)
-- Reverse mapping для status enum + drop archivedAt + drop partial index.

DROP INDEX IF EXISTS "leads_archived_at_idx";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "archived_at";

-- Reverse mapping (lossy для 'brigade' — нет old equivalent, fall to 'in_amocrm')
UPDATE "leads" SET "status" = 'in_amocrm' WHERE "status" = 'contacted';
UPDATE "leads" SET "status" = 'in_amocrm' WHERE "status" = 'brigade';
UPDATE "leads" SET "status" = 'estimated' WHERE "status" = 'smeta';
UPDATE "leads" SET "status" = 'converted' WHERE "status" = 'done';
UPDATE "leads" SET "status" = 'lost'      WHERE "status" = 'cancelled';
