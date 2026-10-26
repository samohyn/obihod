-- Панель заявок, этап 5.4 (план 09): письмо о просрочке и срок хранения фото. Expand.
ALTER TABLE "company" ADD COLUMN "lead_photo_retention_days" numeric DEFAULT 30 NOT NULL;
ALTER TABLE "leads" ADD COLUMN "overdue_notified_at" timestamp(3) with time zone;
ALTER TABLE "leads" ADD COLUMN "photos_deleted_at" timestamp(3) with time zone;
