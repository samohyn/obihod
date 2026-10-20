-- 20260501_140100_leads_status_history — PANEL-LEADS-INBOX § A.3 + ADR-0012
-- Adds status_history jsonb column для audit trail смен статуса.
-- Backfill — synthetic baseline entry для existing leads.

-- jsonb (NOT json) — поддерживает GIN индекс если в будущем понадобится поиск.
-- DEFAULT '[]'::jsonb — instant в Postgres 11+, без full table rewrite.
ALTER TABLE "leads"
  ADD COLUMN IF NOT EXISTS "status_history" jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill: synthetic «migration baseline» entry для existing rows.
-- Это даёт StatusHistoryField не-пустой timeline даже для pre-spec заявок.
UPDATE "leads"
  SET "status_history" = jsonb_build_array(
    jsonb_build_object(
      'from', NULL,
      'to', "status",
      'changedBy', NULL,
      'changedAt', COALESCE("updated_at", "created_at", NOW())::text,
      'note', 'migration: pre-PANEL-LEADS-INBOX baseline'
    )
  )
  WHERE "status_history" = '[]'::jsonb;
