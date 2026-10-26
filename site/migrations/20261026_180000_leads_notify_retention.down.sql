-- Откат 20261026_180000_leads_notify_retention.
ALTER TABLE "leads" DROP COLUMN IF EXISTS "photos_deleted_at";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "overdue_notified_at";
ALTER TABLE "company" DROP COLUMN IF EXISTS "lead_photo_retention_days";
