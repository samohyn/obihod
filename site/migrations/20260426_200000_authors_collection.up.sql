-- US-5 REQ-5.5 follow-up: коллекция Authors для E-E-A-T авторов статей.
--
-- Раздельно от Persons (legal/contact) — semantic split:
--   Persons → Organization JSON-LD + reviewedBy для Cases/Blog
--   Authors → Person JSON-LD на /avtory/<slug>/, авторы статей блога
--
-- Контракт с jsonld.ts → personSchema(): см. поля Authors.ts §personSchema.
--
-- Drafts включены (versions: { drafts: true }) → создаётся таблица _authors_v.

BEGIN;

-- ───────────────────────── 1. Main table authors ─────────────────────────

CREATE TABLE IF NOT EXISTS "authors" (
    "id" serial PRIMARY KEY,
    "slug" varchar NOT NULL,
    "first_name" varchar,
    "last_name" varchar,
    "full_name" varchar,
    "job_title" varchar,
    "bio" varchar,
    "avatar_id" integer,
    "meta_title" varchar,
    "meta_description" varchar,
    "canonical_override" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" varchar DEFAULT 'draft'
);

CREATE UNIQUE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" ("slug");
CREATE INDEX IF NOT EXISTS "authors_status_idx" ON "authors" ("_status");
CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" ("updated_at");

-- FK avatar_id → media.id (опциональный)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'authors_avatar_id_fk'
    ) THEN
        ALTER TABLE "authors"
            ADD CONSTRAINT "authors_avatar_id_fk"
            FOREIGN KEY ("avatar_id") REFERENCES "media"("id") ON DELETE SET NULL;
    END IF;
END$$;
CREATE INDEX IF NOT EXISTS "authors_avatar_idx" ON "authors" ("avatar_id");

-- ───────────────────────── 2. authors_robots_directives (select hasMany) ─────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_authors_robots_directives') THEN
        CREATE TYPE "enum_authors_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "authors_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
    "value" "enum_authors_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "authors_robots_directives_order_idx" ON "authors_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "authors_robots_directives_parent_idx" ON "authors_robots_directives" ("parent_id");

-- ───────────────────────── 3. authors_knows_about (array hasMany) ─────────────────────────

CREATE TABLE IF NOT EXISTS "authors_knows_about" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "topic" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "authors_knows_about_order_idx" ON "authors_knows_about" ("_order");
CREATE INDEX IF NOT EXISTS "authors_knows_about_parent_idx" ON "authors_knows_about" ("_parent_id");

-- ───────────────────────── 4. authors_same_as (array hasMany) ─────────────────────────

CREATE TABLE IF NOT EXISTS "authors_same_as" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "url" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "authors_same_as_order_idx" ON "authors_same_as" ("_order");
CREATE INDEX IF NOT EXISTS "authors_same_as_parent_idx" ON "authors_same_as" ("_parent_id");

-- ───────────────────────── 5. authors_credentials (array hasMany) ─────────────────────────

CREATE TABLE IF NOT EXISTS "authors_credentials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "name" varchar NOT NULL,
    "issuer" varchar,
    "issued_at" timestamp(3) with time zone
);
CREATE INDEX IF NOT EXISTS "authors_credentials_order_idx" ON "authors_credentials" ("_order");
CREATE INDEX IF NOT EXISTS "authors_credentials_parent_idx" ON "authors_credentials" ("_parent_id");

-- ───────────────────────── 6. _authors_v (versions) ─────────────────────────

-- Payload автогенерирует _authors_v через push:true в dev/CI. На prod
-- (push:false) Payload требует ту же схему — создаём явно.

CREATE TABLE IF NOT EXISTS "_authors_v" (
    "id" serial PRIMARY KEY,
    "parent_id" integer REFERENCES "authors"("id") ON DELETE SET NULL,
    "version_slug" varchar,
    "version_first_name" varchar,
    "version_last_name" varchar,
    "version_full_name" varchar,
    "version_job_title" varchar,
    "version_bio" varchar,
    "version_avatar_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
    "version_meta_title" varchar,
    "version_meta_description" varchar,
    "version_canonical_override" varchar,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" varchar,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
);
CREATE INDEX IF NOT EXISTS "_authors_v_parent_idx" ON "_authors_v" ("parent_id");
CREATE INDEX IF NOT EXISTS "_authors_v_latest_idx" ON "_authors_v" ("latest");

COMMIT;
