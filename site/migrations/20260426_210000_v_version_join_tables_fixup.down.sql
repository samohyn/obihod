-- Rollback fixup of versioned snapshot join tables.

BEGIN;

DROP INDEX IF EXISTS "payload_locked_documents_rels_authors_id_idx";
ALTER TABLE "payload_locked_documents_rels"
    DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_authors_fk";
ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "authors_id";

DROP TABLE IF EXISTS "_authors_v_version_credentials" CASCADE;
DROP TABLE IF EXISTS "_authors_v_version_same_as" CASCADE;
DROP TABLE IF EXISTS "_authors_v_version_knows_about" CASCADE;
DROP TABLE IF EXISTS "_authors_v_version_robots_directives" CASCADE;
DROP TABLE IF EXISTS "_districts_v_version_robots_directives" CASCADE;
DROP TABLE IF EXISTS "_b2b_pages_v_version_robots_directives" CASCADE;
DROP TABLE IF EXISTS "_blog_v_version_robots_directives" CASCADE;
DROP TABLE IF EXISTS "_cases_v_version_robots_directives" CASCADE;

COMMIT;
