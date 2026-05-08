-- Rollback US-3 Services.reviewedBy.
--
-- Drop в обратном порядке: index → FK → column.

BEGIN;

DROP INDEX IF EXISTS "_services_v_version_reviewed_by_idx";
ALTER TABLE "_services_v" DROP CONSTRAINT IF EXISTS "_services_v_version_reviewed_by_id_authors_id_fk";
ALTER TABLE "_services_v" DROP COLUMN IF EXISTS "version_reviewed_by_id";

DROP INDEX IF EXISTS "services_reviewed_by_idx";
ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_reviewed_by_id_authors_id_fk";
ALTER TABLE "services" DROP COLUMN IF EXISTS "reviewed_by_id";

COMMIT;
