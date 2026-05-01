-- PANEL-PERSONS-RENAME (variant b) — rollback DOWN.
--
-- ВНИМАНИЕ: rollback восстанавливает только SCHEMA persons, не DATA.
-- Для restore данных требуется pg_dump snapshot из spec §2.4 шаг 1.
--
-- Что делает DOWN:
--   1. Пересоздаёт persons + persons_* tables (пустые).
--   2. Восстанавливает FK constraints с persons:
--      blog.author_id, blog.reviewed_by_id, _blog_v.version_*
--      cases.reviewed_by_id, _cases_v.version_reviewed_by_id
--      cases_rels.persons_id (drop authors_id), _cases_v_rels.persons_id
--      service_districts.reviewed_by_id, _service_districts_v.*
--      payload_locked_documents_rels.persons_id
--   3. Optional: с помощью _persons_to_authors_map (если ещё существует),
--      "обратное" rebind: blog.author_id, etc. возвращаются на persons_id
--      (но persons table пустая, поэтому FK SET NULL).
--   4. DROP authors_rels (created в UP).
--
-- Для полного prod-rollback: восстанови pg_dump snapshot + git revert.

BEGIN;

-- ───────────────────────── 1. Recreate persons + persons_* ─────────────────────────

CREATE TABLE IF NOT EXISTS "persons" (
    "id" serial PRIMARY KEY,
    "slug" varchar NOT NULL,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "job_title" varchar NOT NULL,
    "photo_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
    "bio" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "persons_slug_idx" ON "persons" ("slug");
CREATE INDEX IF NOT EXISTS "persons_photo_idx" ON "persons" ("photo_id");
CREATE INDEX IF NOT EXISTS "persons_created_at_idx" ON "persons" ("created_at");
CREATE INDEX IF NOT EXISTS "persons_updated_at_idx" ON "persons" ("updated_at");

CREATE TABLE IF NOT EXISTS "persons_credentials" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "persons"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "name" varchar NOT NULL,
    "issuer" varchar,
    "year" numeric
);
CREATE INDEX IF NOT EXISTS "persons_credentials_order_idx" ON "persons_credentials" ("_order");
CREATE INDEX IF NOT EXISTS "persons_credentials_parent_id_idx" ON "persons_credentials" ("_parent_id");

CREATE TABLE IF NOT EXISTS "persons_knows_about" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "persons"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "topic" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "persons_knows_about_order_idx" ON "persons_knows_about" ("_order");
CREATE INDEX IF NOT EXISTS "persons_knows_about_parent_id_idx" ON "persons_knows_about" ("_parent_id");

CREATE TABLE IF NOT EXISTS "persons_same_as" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL REFERENCES "persons"("id") ON DELETE CASCADE,
    "id" varchar PRIMARY KEY,
    "url" varchar NOT NULL
);
CREATE INDEX IF NOT EXISTS "persons_same_as_order_idx" ON "persons_same_as" ("_order");
CREATE INDEX IF NOT EXISTS "persons_same_as_parent_id_idx" ON "persons_same_as" ("_parent_id");

CREATE TABLE IF NOT EXISTS "persons_rels" (
    "id" serial PRIMARY KEY,
    "order" integer,
    "parent_id" integer NOT NULL REFERENCES "persons"("id") ON DELETE CASCADE,
    "path" varchar NOT NULL,
    "districts_id" integer REFERENCES "districts"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "persons_rels_order_idx" ON "persons_rels" ("order");
CREATE INDEX IF NOT EXISTS "persons_rels_parent_idx" ON "persons_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "persons_rels_path_idx" ON "persons_rels" ("path");
CREATE INDEX IF NOT EXISTS "persons_rels_districts_id_idx" ON "persons_rels" ("districts_id");

-- ───────────────────────── 2. Restore data via inverse map (best-effort) ─────────────────────────

-- Если _persons_to_authors_map существует и authors table ещё содержит
-- мигрированные records — восстанавливаем persons. Это работает только если
-- между UP и DOWN не было новых Authors-записей с тем же slug.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        INSERT INTO persons (id, slug, first_name, last_name, job_title, photo_id, bio, created_at, updated_at)
        SELECT
            map.person_id,
            map.original_slug,
            COALESCE(a.first_name, ''),
            COALESCE(a.last_name, ''),
            COALESCE(a.job_title, ''),
            a.avatar_id,
            CASE
                WHEN a.bio IS NOT NULL
                THEN jsonb_build_object(
                    'root', jsonb_build_object(
                        'children', jsonb_build_array(
                            jsonb_build_object(
                                'children', jsonb_build_array(
                                    jsonb_build_object('text', a.bio, 'type', 'text', 'version', 1)
                                ),
                                'type', 'paragraph',
                                'version', 1
                            )
                        ),
                        'type', 'root',
                        'version', 1
                    )
                )
                ELSE NULL
            END,
            a.created_at,
            a.updated_at
        FROM _persons_to_authors_map map
        JOIN authors a ON a.id = map.author_id;
        -- Восстановить sequence
        PERFORM setval('persons_id_seq', COALESCE((SELECT MAX(id) FROM persons), 1));
    END IF;
END $$;

-- ───────────────────────── 3. Rebind FK references back to persons ─────────────────────────

-- 3a. blog.author_id
ALTER TABLE blog DROP CONSTRAINT IF EXISTS blog_author_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE blog SET author_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = blog.author_id
        )
        WHERE author_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE blog
    ADD CONSTRAINT blog_author_id_persons_id_fk
    FOREIGN KEY (author_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3b. blog.reviewed_by_id
ALTER TABLE blog DROP CONSTRAINT IF EXISTS blog_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE blog SET reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = blog.reviewed_by_id
        )
        WHERE reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE blog
    ADD CONSTRAINT blog_reviewed_by_id_persons_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3c. _blog_v.version_author_id
ALTER TABLE _blog_v DROP CONSTRAINT IF EXISTS _blog_v_version_author_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE _blog_v SET version_author_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = _blog_v.version_author_id
        )
        WHERE version_author_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE _blog_v
    ADD CONSTRAINT _blog_v_version_author_id_persons_id_fk
    FOREIGN KEY (version_author_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3d. _blog_v.version_reviewed_by_id
ALTER TABLE _blog_v DROP CONSTRAINT IF EXISTS _blog_v_version_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE _blog_v SET version_reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = _blog_v.version_reviewed_by_id
        )
        WHERE version_reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE _blog_v
    ADD CONSTRAINT _blog_v_version_reviewed_by_id_persons_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3e. cases.reviewed_by_id
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE cases SET reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = cases.reviewed_by_id
        )
        WHERE reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE cases
    ADD CONSTRAINT cases_reviewed_by_id_persons_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3f. _cases_v.version_reviewed_by_id
ALTER TABLE _cases_v DROP CONSTRAINT IF EXISTS _cases_v_version_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE _cases_v SET version_reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = _cases_v.version_reviewed_by_id
        )
        WHERE version_reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE _cases_v
    ADD CONSTRAINT _cases_v_version_reviewed_by_id_persons_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3g. cases_rels.persons_id (restore from authors_id)
ALTER TABLE cases_rels DROP CONSTRAINT IF EXISTS cases_rels_authors_fk;
ALTER TABLE cases_rels ADD COLUMN IF NOT EXISTS persons_id integer;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE cases_rels SET persons_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = cases_rels.authors_id
        )
        WHERE authors_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE cases_rels
    ADD CONSTRAINT cases_rels_persons_fk
    FOREIGN KEY (persons_id) REFERENCES persons(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS cases_rels_persons_id_idx ON cases_rels (persons_id);
ALTER TABLE cases_rels DROP COLUMN IF EXISTS authors_id;
DROP INDEX IF EXISTS cases_rels_authors_id_idx;

-- 3h. _cases_v_rels.persons_id (restore from authors_id)
ALTER TABLE _cases_v_rels DROP CONSTRAINT IF EXISTS _cases_v_rels_authors_fk;
ALTER TABLE _cases_v_rels ADD COLUMN IF NOT EXISTS persons_id integer;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE _cases_v_rels SET persons_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = _cases_v_rels.authors_id
        )
        WHERE authors_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE _cases_v_rels
    ADD CONSTRAINT _cases_v_rels_persons_fk
    FOREIGN KEY (persons_id) REFERENCES persons(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS _cases_v_rels_persons_id_idx ON _cases_v_rels (persons_id);
ALTER TABLE _cases_v_rels DROP COLUMN IF EXISTS authors_id;
DROP INDEX IF EXISTS _cases_v_rels_authors_id_idx;

-- 3i. service_districts.reviewed_by_id
ALTER TABLE service_districts DROP CONSTRAINT IF EXISTS service_districts_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE service_districts SET reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = service_districts.reviewed_by_id
        )
        WHERE reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE service_districts
    ADD CONSTRAINT service_districts_reviewed_by_id_persons_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- 3j. _service_districts_v.version_reviewed_by_id
ALTER TABLE _service_districts_v DROP CONSTRAINT IF EXISTS _service_districts_v_version_reviewed_by_id_authors_id_fk;
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '_persons_to_authors_map') THEN
        UPDATE _service_districts_v SET version_reviewed_by_id = (
            SELECT person_id FROM _persons_to_authors_map WHERE author_id = _service_districts_v.version_reviewed_by_id
        )
        WHERE version_reviewed_by_id IS NOT NULL;
    END IF;
END $$;
ALTER TABLE _service_districts_v
    ADD CONSTRAINT _service_districts_v_version_reviewed_by_id_persons_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES persons(id) ON DELETE SET NULL;

-- ───────────────────────── 4. Restore payload_locked_documents_rels.persons_id ─────────────────────────

ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS persons_id integer;
ALTER TABLE payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_persons_fk
    FOREIGN KEY (persons_id) REFERENCES persons(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_persons_id_idx
    ON payload_locked_documents_rels (persons_id);

-- ───────────────────────── 5. DROP authors_rels + mapping table ─────────────────────────

-- authors_rels был создан только в UP миграции (worksInDistricts добавлен к
-- Authors в этой же US). DOWN убирает его — Authors теряет worksInDistricts data.
-- Если до миграции Authors не имели worksInDistricts (was true), это safe.

DROP TABLE IF EXISTS authors_rels CASCADE;
DROP TABLE IF EXISTS _authors_v_rels CASCADE;
DROP TABLE IF EXISTS _persons_to_authors_map CASCADE;

COMMIT;
