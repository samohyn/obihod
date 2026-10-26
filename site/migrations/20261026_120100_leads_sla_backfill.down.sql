-- Откат 20261026_120100_leads_sla_backfill: колонки удаляет откат 20261026_120000_leads_sla.
UPDATE "leads" SET "reply_due_at" = NULL, "first_contact_at" = NULL, "closed_at" = NULL;
