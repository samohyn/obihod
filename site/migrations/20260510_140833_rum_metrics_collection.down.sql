-- RumMetrics collection — DOWN: drop table + ENUM TYPEs.
--
-- Идемпотентный rollback. RUM data — sample telemetry, не critical (per
-- collection design: «чистка через TTL job»).

BEGIN;

ALTER TABLE "payload_locked_documents_rels"
    DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_rum_metrics_fk";

DROP INDEX IF EXISTS "payload_locked_documents_rels_rum_metrics_id_idx";

ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "rum_metrics_id";

DROP TABLE IF EXISTS "rum_metrics" CASCADE;

DROP TYPE IF EXISTS "enum_rum_metrics_navigation_type";
DROP TYPE IF EXISTS "enum_rum_metrics_rating";
DROP TYPE IF EXISTS "enum_rum_metrics_name";

COMMIT;
