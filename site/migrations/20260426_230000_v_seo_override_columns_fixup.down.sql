-- Rollback fixup of version_* SEO override columns.

BEGIN;

ALTER TABLE "_service_districts_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";

ALTER TABLE "_districts_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";
ALTER TABLE "_districts_v" DROP COLUMN IF EXISTS "version_canonical_override";

DROP INDEX IF EXISTS "_cases_v_version_reviewed_by_idx";
ALTER TABLE "_cases_v" DROP CONSTRAINT IF EXISTS "_cases_v_version_reviewed_by_id_fk";
ALTER TABLE "_cases_v" DROP COLUMN IF EXISTS "version_reviewed_by_id";
ALTER TABLE "_cases_v" DROP COLUMN IF EXISTS "version_last_reviewed_at";
ALTER TABLE "_cases_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";
ALTER TABLE "_cases_v" DROP COLUMN IF EXISTS "version_canonical_override";

DROP INDEX IF EXISTS "_blog_v_version_reviewed_by_idx";
ALTER TABLE "_blog_v" DROP CONSTRAINT IF EXISTS "_blog_v_version_reviewed_by_id_fk";
ALTER TABLE "_blog_v" DROP COLUMN IF EXISTS "version_reviewed_by_id";
ALTER TABLE "_blog_v" DROP COLUMN IF EXISTS "version_last_reviewed_at";
ALTER TABLE "_blog_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";
ALTER TABLE "_blog_v" DROP COLUMN IF EXISTS "version_canonical_override";

ALTER TABLE "_b2b_pages_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";
ALTER TABLE "_b2b_pages_v" DROP COLUMN IF EXISTS "version_canonical_override";

ALTER TABLE "_authors_v" DROP COLUMN IF EXISTS "version_breadcrumb_label";

COMMIT;
