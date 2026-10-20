-- 20260501_140100_leads_status_history (rollback)
-- Drops status_history column. Audit trail теряется — это OK для rollback,
-- т.к. источник истины статуса — само поле leads.status.

ALTER TABLE "leads" DROP COLUMN IF EXISTS "status_history";
