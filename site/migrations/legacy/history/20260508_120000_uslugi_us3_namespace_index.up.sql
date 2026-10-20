-- US-3 EPIC-SEO-USLUGI: namespace performance index.
--
-- Sustained schema (sd_subservice_extend.up.sql) уже содержит:
--   • partial unique index pillar-level (service_id, district_id) WHERE sub_service_slug IS NULL
--   • partial unique index sub-level (service_id, district_id, sub_service_slug)
--   • non-unique index sub_service_slug WHERE NOT NULL
--
-- US-3 добавляет non-unique composite index на (district_id, service_id) —
-- нужен для resolver `[service]/[slug]/page.tsx` который ищет SD по
-- (pillar, district_slug→district_id). Sustained `service_districts_district_idx`
-- (single col) и `service_districts_service_idx` (single col) дают bitmap-and,
-- но композитный индекс быстрее на bulk (5×30=150 SD).
--
-- Idempotent: IF NOT EXISTS. Down-migration дропает.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_service_districts_district_service
  ON service_districts (district_id, service_id);

COMMIT;
