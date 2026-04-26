-- Down: rollback SEO override полей в Blog/B2BPages/Districts.

BEGIN;

-- districts
DROP TABLE IF EXISTS "districts_robots_directives";
DROP TYPE IF EXISTS "enum_districts_robots_directives";
ALTER TABLE "districts"
    DROP COLUMN IF EXISTS "breadcrumb_label",
    DROP COLUMN IF EXISTS "canonical_override";

-- b2b_pages
DROP TABLE IF EXISTS "b2b_pages_robots_directives";
DROP TYPE IF EXISTS "enum_b2b_pages_robots_directives";
ALTER TABLE "b2b_pages"
    DROP COLUMN IF EXISTS "breadcrumb_label",
    DROP COLUMN IF EXISTS "canonical_override";

-- blog
DROP TABLE IF EXISTS "blog_robots_directives";
DROP TYPE IF EXISTS "enum_blog_robots_directives";

ALTER TABLE "blog"
    DROP CONSTRAINT IF EXISTS "blog_reviewed_by_id_fk";

DROP INDEX IF EXISTS "blog_reviewed_by_idx";

ALTER TABLE "blog"
    DROP COLUMN IF EXISTS "reviewed_by_id",
    DROP COLUMN IF EXISTS "last_reviewed_at",
    DROP COLUMN IF EXISTS "breadcrumb_label",
    DROP COLUMN IF EXISTS "canonical_override";

COMMIT;
