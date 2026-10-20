-- US-5 REQ-5.7 follow-up: SEO override поля для Blog, B2BPages, Districts.
--
-- Зеркалит миграцию 20260426_180000_seo_override_fields.up.sql (Services + Cases).
-- Имена snake_case через `to-snake-case@1.0.0` (Payload @3.83 convention).
--
-- Поля на каждой коллекции:
--   canonical_override (varchar)
--   robots_directives  (select hasMany → отдельная таблица <coll>_robots_directives)
--   breadcrumb_label   (varchar)
--
-- Blog дополнительно: last_reviewed_at + reviewed_by_id (FK → persons) — E-E-A-T.
--
-- Drafts:
--   blog: versions: { drafts: { autosave: true } } → есть _blog_v
--   b2b_pages: versions: { drafts: true } → есть _b2b_pages_v
--   districts: versions: { drafts: true } → есть _districts_v

BEGIN;

-- ───────────────────────── 1. blog ─────────────────────────

ALTER TABLE "blog"
    ADD COLUMN IF NOT EXISTS "canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "breadcrumb_label" varchar,
    ADD COLUMN IF NOT EXISTS "last_reviewed_at" timestamp(3) with time zone,
    ADD COLUMN IF NOT EXISTS "reviewed_by_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'blog_reviewed_by_id_fk'
    ) THEN
        ALTER TABLE "blog"
            ADD CONSTRAINT "blog_reviewed_by_id_fk"
            FOREIGN KEY ("reviewed_by_id") REFERENCES "persons"("id") ON DELETE SET NULL;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "blog_reviewed_by_idx" ON "blog" ("reviewed_by_id");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_blog_robots_directives') THEN
        CREATE TYPE "enum_blog_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "blog_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "blog"("id") ON DELETE CASCADE,
    "value" "enum_blog_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "blog_robots_directives_order_idx" ON "blog_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "blog_robots_directives_parent_idx" ON "blog_robots_directives" ("parent_id");

-- ───────────────────────── 2. b2b_pages ─────────────────────────

ALTER TABLE "b2b_pages"
    ADD COLUMN IF NOT EXISTS "canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "breadcrumb_label" varchar;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_b2b_pages_robots_directives') THEN
        CREATE TYPE "enum_b2b_pages_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow', 'noarchive'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "b2b_pages_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "b2b_pages"("id") ON DELETE CASCADE,
    "value" "enum_b2b_pages_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "b2b_pages_robots_directives_order_idx" ON "b2b_pages_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "b2b_pages_robots_directives_parent_idx" ON "b2b_pages_robots_directives" ("parent_id");

-- ───────────────────────── 3. districts ─────────────────────────

ALTER TABLE "districts"
    ADD COLUMN IF NOT EXISTS "canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "breadcrumb_label" varchar;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_districts_robots_directives') THEN
        CREATE TYPE "enum_districts_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "districts_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "districts"("id") ON DELETE CASCADE,
    "value" "enum_districts_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "districts_robots_directives_order_idx" ON "districts_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "districts_robots_directives_parent_idx" ON "districts_robots_directives" ("parent_id");

COMMIT;
