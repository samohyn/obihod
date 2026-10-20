-- 20260501_220000_audit_log_table — PANEL-AUDIT-LOG (ADR-0014 Strategy 3 Hybrid)
--
-- Custom audit_log table для PII collections (Leads, Users, Media, Redirects)
-- + security events (login/logout/RBAC/bulk-action) + globals (SiteChrome,
-- SeoSettings — пока не versioned).
--
-- Содержит:
--   - PII masking applied write-time (см. site/lib/admin/audit/maskPII.ts)
--   - 5 индексов: changed_at, (collection,changed_at), (user,changed_at),
--     (action,changed_at), (collection,doc_id,changed_at)
--   - extension pgcrypto для gen_random_uuid()
--
-- Retention: 365 дней rolling window, daily cron `scripts/audit/prune.ts`.
--
-- Idempotency: IF NOT EXISTS на extension и table.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS "audit_log" (
  "id"            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "collection"    text NOT NULL,
  "doc_id"        text,
  "user_id"       integer REFERENCES "users"("id") ON DELETE SET NULL,
  "action"        text NOT NULL,
  "changed_at"    timestamptz NOT NULL DEFAULT now(),
  "ip"            inet,
  "user_agent"    text,
  "diff"          jsonb NOT NULL DEFAULT '{}'::jsonb,
  "affected_ids"  text[] DEFAULT NULL,
  "metadata"      jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT "audit_log_action_check" CHECK (
    "action" IN (
      'create','update','delete',
      'publish','unpublish','archive',
      'login','logout','login_failed',
      'bulk_action','rbac_change'
    )
  )
);

CREATE INDEX IF NOT EXISTS "audit_log_changed_at_idx"
  ON "audit_log" ("changed_at" DESC);

CREATE INDEX IF NOT EXISTS "audit_log_collection_idx"
  ON "audit_log" ("collection", "changed_at" DESC);

CREATE INDEX IF NOT EXISTS "audit_log_user_idx"
  ON "audit_log" ("user_id", "changed_at" DESC);

CREATE INDEX IF NOT EXISTS "audit_log_action_idx"
  ON "audit_log" ("action", "changed_at" DESC);

CREATE INDEX IF NOT EXISTS "audit_log_doc_idx"
  ON "audit_log" ("collection", "doc_id", "changed_at" DESC);
