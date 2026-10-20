-- Fixup: версионные snapshot join tables для select hasMany / array hasMany.
--
-- Контекст
-- ────────
-- В миграциях 20260426_180000 (Services+Cases SEO override) и 20260426_193000
-- (Blog+B2BPages+Districts SEO override) для основных коллекций созданы
-- robots_directives join tables, но забыты соответствующие
-- `_<table>_v_version_robots_directives` snapshot-таблицы для версионных
-- (versions+drafts) коллекций. Аналогично в 20260426_200000 (Authors)
-- забыты `_authors_v_version_{robots_directives,knows_about,same_as,credentials}`.
--
-- Симптом на prod: REST POST/PATCH возвращают `"Something went wrong"`.
-- В PM2 logs:
--   error: relation "_authors_v_version_robots_directives" does not exist
--   при INSERT в createVersion (Payload пишет snapshot текущего state в _v).
--
-- Эталон (сделан правильно в 180000): _services_v_version_robots_directives.
-- Копируем его structure для остальных.
--
-- Affects: REST writes на Cases, Blog, B2BPages, Districts, Authors.

BEGIN;

-- ───────── Cases ─────────
CREATE TABLE IF NOT EXISTS "_cases_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_cases_v"("id") ON DELETE CASCADE,
    "value" "enum_cases_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_cases_v_version_robots_directives_order_idx" ON "_cases_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_cases_v_version_robots_directives_parent_idx" ON "_cases_v_version_robots_directives" ("parent_id");

-- ───────── Blog ─────────
CREATE TABLE IF NOT EXISTS "_blog_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_blog_v"("id") ON DELETE CASCADE,
    "value" "enum_blog_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_blog_v_version_robots_directives_order_idx" ON "_blog_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_blog_v_version_robots_directives_parent_idx" ON "_blog_v_version_robots_directives" ("parent_id");

-- ───────── B2BPages ─────────
CREATE TABLE IF NOT EXISTS "_b2b_pages_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_b2b_pages_v"("id") ON DELETE CASCADE,
    "value" "enum_b2b_pages_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_b2b_pages_v_version_robots_directives_order_idx" ON "_b2b_pages_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_b2b_pages_v_version_robots_directives_parent_idx" ON "_b2b_pages_v_version_robots_directives" ("parent_id");

-- ───────── Districts ─────────
CREATE TABLE IF NOT EXISTS "_districts_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_districts_v"("id") ON DELETE CASCADE,
    "value" "enum_districts_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_districts_v_version_robots_directives_order_idx" ON "_districts_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_districts_v_version_robots_directives_parent_idx" ON "_districts_v_version_robots_directives" ("parent_id");

-- ───────── Authors: robots_directives (select hasMany) ─────────
CREATE TABLE IF NOT EXISTS "_authors_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_authors_v"("id") ON DELETE CASCADE,
    "value" "enum_authors_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_authors_v_version_robots_directives_order_idx" ON "_authors_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_authors_v_version_robots_directives_parent_idx" ON "_authors_v_version_robots_directives" ("parent_id");

-- ───────── Authors: knows_about (array hasMany) ─────────
CREATE TABLE IF NOT EXISTS "_authors_v_version_knows_about" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "_authors_v"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "topic" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "_authors_v_version_knows_about_order_idx" ON "_authors_v_version_knows_about" ("_order");
CREATE INDEX IF NOT EXISTS "_authors_v_version_knows_about_parent_idx" ON "_authors_v_version_knows_about" ("_parent_id");

-- ───────── Authors: same_as (array hasMany) ─────────
CREATE TABLE IF NOT EXISTS "_authors_v_version_same_as" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "_authors_v"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "url" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "_authors_v_version_same_as_order_idx" ON "_authors_v_version_same_as" ("_order");
CREATE INDEX IF NOT EXISTS "_authors_v_version_same_as_parent_idx" ON "_authors_v_version_same_as" ("_parent_id");

-- ───────── Authors: credentials (array hasMany) ─────────
CREATE TABLE IF NOT EXISTS "_authors_v_version_credentials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "_authors_v"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "name" varchar NOT NULL,
    "issuer" varchar,
    "issued_at" timestamp(3) with time zone
);
CREATE INDEX IF NOT EXISTS "_authors_v_version_credentials_order_idx" ON "_authors_v_version_credentials" ("_order");
CREATE INDEX IF NOT EXISTS "_authors_v_version_credentials_parent_idx" ON "_authors_v_version_credentials" ("_parent_id");

-- ───────── payload_locked_documents_rels: authors_id ─────────
-- Для каждой коллекции Payload расширяет служебную polymorphic таблицу
-- payload_locked_documents_rels колонкой <slug>_id + index + FK. В миграции
-- 200000_authors_collection это было пропущено → любой PATCH на любую
-- коллекцию падает на checkDocumentLockStatus, который опрашивает
-- locked_documents через всех зарегистрированных коллекций.

ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "authors_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_authors_fk'
    ) THEN
        ALTER TABLE "payload_locked_documents_rels"
            ADD CONSTRAINT "payload_locked_documents_rels_authors_fk"
            FOREIGN KEY ("authors_id") REFERENCES "authors"("id") ON DELETE CASCADE;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx"
    ON "payload_locked_documents_rels" ("authors_id");

COMMIT;
