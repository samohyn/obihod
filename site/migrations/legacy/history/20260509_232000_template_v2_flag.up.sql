-- EPIC-SERVICE-PAGES-UX C4 — feature flag `useTemplateV2` на 3 коллекциях.
--
-- Контекст: per-URL flag для incremental rollout master-template (ADR-0021)
-- без downtime. Default false → sustained legacy rendering.
--
-- Затронутые таблицы:
--   - services             (T2_PILLAR layer)
--   - service_districts    (T4_SD layer)
--   - b2b_pages            (T2_PILLAR layer)
-- + version-таблицы (Payload drafts pattern — sustained на других boolean-полях):
--   - _services_v
--   - _service_districts_v
--   - _b2b_pages_v
--
-- ON DELETE: nope — это плоский boolean column, не FK.
-- Idempotent: IF NOT EXISTS на ADD COLUMN.

BEGIN;

-- ───────────────────────── 1. services ─────────────────────────

ALTER TABLE "services"
  ADD COLUMN IF NOT EXISTS "use_template_v2" boolean DEFAULT false;

ALTER TABLE "_services_v"
  ADD COLUMN IF NOT EXISTS "version_use_template_v2" boolean DEFAULT false;

-- ─────────────────────── 2. service_districts ───────────────────────

ALTER TABLE "service_districts"
  ADD COLUMN IF NOT EXISTS "use_template_v2" boolean DEFAULT false;

ALTER TABLE "_service_districts_v"
  ADD COLUMN IF NOT EXISTS "version_use_template_v2" boolean DEFAULT false;

-- ─────────────────────── 3. b2b_pages ───────────────────────

ALTER TABLE "b2b_pages"
  ADD COLUMN IF NOT EXISTS "use_template_v2" boolean DEFAULT false;

ALTER TABLE "_b2b_pages_v"
  ADD COLUMN IF NOT EXISTS "version_use_template_v2" boolean DEFAULT false;

COMMIT;
