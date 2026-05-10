-- EPIC-SERVICE-PAGES-REDESIGN D5 — rollback A/B pilot tag.
-- Drop column → drop ENUM type. IF EXISTS на всё.

BEGIN;

DROP INDEX IF EXISTS "rum_metrics_ab_variant_idx";

ALTER TABLE "rum_metrics"
    DROP COLUMN IF EXISTS "ab_variant";

DROP TYPE IF EXISTS "enum_rum_metrics_ab_variant";

COMMIT;
