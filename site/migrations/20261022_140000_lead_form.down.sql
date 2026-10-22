-- Откат 20261022_140000_lead_form.
ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_lead_photos_fk";
DROP INDEX IF EXISTS "payload_locked_documents_rels_lead_photos_id_idx";
ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "lead_photos_id";
DROP TABLE IF EXISTS "leads_rels" CASCADE;
DROP TABLE IF EXISTS "lead_photos" CASCADE;
ALTER TABLE "leads" DROP COLUMN IF EXISTS "message";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "address";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "consent_at";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "consent_version";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "consent_text_hash";
