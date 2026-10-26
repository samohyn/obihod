-- Откат 20261026_120000_leads_sla.
DROP INDEX IF EXISTS "leads_reply_due_at_idx";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "closed_at";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "manager_comment";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "next_action_at";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "contact_result";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "first_contact_at";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "reply_due_at";
ALTER TABLE "company" DROP COLUMN IF EXISTS "reply_by_working_hours";
DROP TYPE IF EXISTS "public"."enum_leads_contact_result";
