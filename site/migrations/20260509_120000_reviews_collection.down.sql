-- Reverse of 20260509_120000_reviews_collection.up.sql

BEGIN;

DROP INDEX IF EXISTS "payload_locked_documents_rels_reviews_id_idx";
ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_reviews_fk";
ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "reviews_id";

DROP TABLE IF EXISTS "_reviews_v" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TYPE IF EXISTS "enum_reviews_source";

COMMIT;
