-- Down: rollback SEO override fields. Все данные в этих колонках теряются.

BEGIN;

-- services
DROP TABLE IF EXISTS "_services_v_version_robots_directives";
DROP TABLE IF EXISTS "services_robots_directives";
DROP TYPE IF EXISTS "enum_services_robots_directives";

ALTER TABLE "_services_v"
    DROP COLUMN IF EXISTS "version_breadcrumb_label",
    DROP COLUMN IF EXISTS "version_canonical_override";

ALTER TABLE "services"
    DROP COLUMN IF EXISTS "breadcrumb_label",
    DROP COLUMN IF EXISTS "canonical_override";

-- cases
DROP TABLE IF EXISTS "cases_robots_directives";
DROP TYPE IF EXISTS "enum_cases_robots_directives";

ALTER TABLE "cases"
    DROP CONSTRAINT IF EXISTS "cases_reviewed_by_id_fk";

DROP INDEX IF EXISTS "cases_reviewed_by_idx";

ALTER TABLE "cases"
    DROP COLUMN IF EXISTS "reviewed_by_id",
    DROP COLUMN IF EXISTS "last_reviewed_at",
    DROP COLUMN IF EXISTS "breadcrumb_label",
    DROP COLUMN IF EXISTS "canonical_override";

COMMIT;
