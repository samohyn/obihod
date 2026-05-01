-- PANEL-PERSONS-RENAME (variant b): merge Persons → Authors.
--
-- Spec: specs/PANEL-PERSONS-RENAME/sa-panel.md
-- Operator decision: variant (b), conflict resolution = keep newest + suffix `-2`.
--
-- Что делает миграция:
--   1. Создаёт mapping table _persons_to_authors_map (рабочая, дроп в конце).
--   2. Копирует persons → authors с conflict resolution (slug `-2`).
--   3. Копирует persons_credentials → authors_credentials (year → issued_at='YYYY-01-01').
--   4. Копирует persons_knows_about → authors_knows_about (truncate topic > 80,
--      drop rows >12).
--   5. Копирует persons_same_as → authors_same_as (prepend https://, drop invalid,
--      drop rows >8).
--   6. Копирует persons_rels (worksInDistricts) → authors_rels.
--   7. Rebinds FK references:
--      blog.author_id, blog.reviewed_by_id → authors.id
--      cases.reviewed_by_id → authors.id
--      cases_rels.persons_id → authors (через cases_rels.authors_id new col)
--      service_districts.reviewed_by_id → authors.id
--      _blog_v.version_author_id, version_reviewed_by_id → authors.id
--      _cases_v_rels.persons_id → authors (через authors_id new col)
--      _cases_v.version_reviewed_by_id → authors.id
--      _service_districts_v.version_reviewed_by_id → authors.id
--   8. DROPs persons + persons_* tables CASCADE.
--   9. DROPs payload_locked_documents_rels.persons_id column.
--
-- Pattern: sequential UPDATE → ALTER constraint (НЕ DROP+RECREATE — повтор
-- US-12 W6 SeoSettings v_join_tables_fixup pattern).
--
-- Rollback: DOWN-script восстанавливает persons table структуру, но данные
-- восстанавливаются ТОЛЬКО из pg_dump snapshot (см. spec §2.4).

BEGIN;

-- ───────────────────────── 1. Mapping table ─────────────────────────

CREATE TABLE IF NOT EXISTS "_persons_to_authors_map" (
    "person_id" integer PRIMARY KEY,
    "author_id" integer NOT NULL,
    "original_slug" varchar NOT NULL,
    "final_slug" varchar NOT NULL,
    "suffix_applied" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ───────────────────────── 2. authors_rels (worksInDistricts) ─────────────────────────

-- Authors не имела join table (worksInDistricts — новое поле в коллекции).
-- Создаём как mirror persons_rels, но с parent_id → authors.

CREATE TABLE IF NOT EXISTS "authors_rels" (
    "id" serial PRIMARY KEY,
    "order" integer,
    "parent_id" integer NOT NULL REFERENCES "authors"("id") ON DELETE CASCADE,
    "path" varchar NOT NULL,
    "districts_id" integer REFERENCES "districts"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "authors_rels_order_idx" ON "authors_rels" ("order");
CREATE INDEX IF NOT EXISTS "authors_rels_parent_idx" ON "authors_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "authors_rels_path_idx" ON "authors_rels" ("path");
CREATE INDEX IF NOT EXISTS "authors_rels_districts_id_idx" ON "authors_rels" ("districts_id");

-- _authors_v_rels — version snapshot rels (для versions+drafts на Authors).
-- Payload создаёт автоматически в push:true, но на prod (push:false) требует
-- явное создание (см. US-12 W6 v_join_tables_fixup pattern).
CREATE TABLE IF NOT EXISTS "_authors_v_rels" (
    "id" serial PRIMARY KEY,
    "order" integer,
    "parent_id" integer NOT NULL REFERENCES "_authors_v"("id") ON DELETE CASCADE,
    "path" varchar NOT NULL,
    "districts_id" integer REFERENCES "districts"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "_authors_v_rels_order_idx" ON "_authors_v_rels" ("order");
CREATE INDEX IF NOT EXISTS "_authors_v_rels_parent_idx" ON "_authors_v_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "_authors_v_rels_path_idx" ON "_authors_v_rels" ("path");
CREATE INDEX IF NOT EXISTS "_authors_v_rels_districts_id_idx" ON "_authors_v_rels" ("districts_id");

-- ───────────────────────── 3. INSERT persons → authors with conflict resolution ─────────────────────────

DO $$
DECLARE
    p RECORD;
    final_slug varchar;
    suffix_used boolean;
    new_author_id integer;
    bio_plain text;
BEGIN
    FOR p IN
        SELECT id, slug, first_name, last_name, job_title, photo_id, bio,
               created_at, updated_at
        FROM persons
        ORDER BY id
    LOOP
        -- Conflict resolution: если slug уже занят в authors → suffix `-2`,
        -- `-3`, `-4`, ... пока не найдётся свободный.
        final_slug := p.slug;
        suffix_used := false;
        IF EXISTS (SELECT 1 FROM authors WHERE slug = final_slug) THEN
            FOR i IN 2..99 LOOP
                final_slug := p.slug || '-' || i;
                IF NOT EXISTS (SELECT 1 FROM authors WHERE slug = final_slug) THEN
                    suffix_used := true;
                    EXIT;
                END IF;
            END LOOP;
        END IF;

        -- Truncate firstName/lastName/jobTitle to maxLength.
        -- bio: extract plain text from Lexical AST.
        -- Lexical structure: { root: { children: [{ children: [{ text: "..." }] }] } }
        -- Если bio NULL или невалидный JSON — NULL в authors.bio.
        bio_plain := NULL;
        IF p.bio IS NOT NULL AND jsonb_typeof(p.bio) = 'object' THEN
            BEGIN
                -- Concatenate all text nodes from Lexical AST recursively.
                -- Используем jsonb_path_query для извлечения всех "text" значений.
                SELECT string_agg(value::text, ' ')
                INTO bio_plain
                FROM jsonb_path_query(
                    p.bio,
                    'strict $.**.text'
                ) AS t(value)
                WHERE jsonb_typeof(value) = 'string';
                -- Обрезаем кавычки от jsonb→text, нормализуем пробелы.
                IF bio_plain IS NOT NULL THEN
                    bio_plain := regexp_replace(bio_plain, '^"|"$', '', 'g');
                    bio_plain := regexp_replace(bio_plain, '\\"', '"', 'g');
                    bio_plain := regexp_replace(bio_plain, '\s+', ' ', 'g');
                    bio_plain := trim(bio_plain);
                    IF length(bio_plain) > 600 THEN
                        bio_plain := substring(bio_plain from 1 for 597) || '...';
                        RAISE NOTICE 'Person id=% slug=%: bio truncated to 600 chars', p.id, p.slug;
                    END IF;
                    IF bio_plain = '' THEN
                        bio_plain := NULL;
                    END IF;
                END IF;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Person id=% slug=%: bio extract failed (%), set NULL', p.id, p.slug, SQLERRM;
                bio_plain := NULL;
            END;
        END IF;

        INSERT INTO authors (
            slug, first_name, last_name, full_name, job_title, bio, avatar_id,
            created_at, updated_at, _status
        ) VALUES (
            final_slug,
            substring(p.first_name from 1 for 60),
            substring(p.last_name from 1 for 60),
            substring(p.first_name || ' ' || p.last_name from 1 for 120),
            CASE WHEN p.job_title IS NOT NULL
                 THEN substring(p.job_title from 1 for 120)
                 ELSE NULL END,
            bio_plain,
            p.photo_id,
            p.created_at,
            p.updated_at,
            'published'
        ) RETURNING id INTO new_author_id;

        INSERT INTO _persons_to_authors_map (person_id, author_id, original_slug, final_slug, suffix_applied)
        VALUES (p.id, new_author_id, p.slug, final_slug, suffix_used);

        IF suffix_used THEN
            RAISE NOTICE 'Person id=% slug=% → author id=% slug=% (suffix applied)', p.id, p.slug, new_author_id, final_slug;
        END IF;
    END LOOP;
END $$;

-- ───────────────────────── 4. Copy persons_credentials → authors_credentials ─────────────────────────

INSERT INTO authors_credentials (_order, _parent_id, id, name, issuer, issued_at)
SELECT
    pc._order,
    map.author_id,
    gen_random_uuid()::varchar,
    substring(pc.name from 1 for 160),
    CASE WHEN pc.issuer IS NOT NULL THEN substring(pc.issuer from 1 for 120) ELSE NULL END,
    CASE WHEN pc.year IS NOT NULL
         THEN make_timestamptz(pc.year::int, 1, 1, 0, 0, 0, 'UTC')
         ELSE NULL END
FROM persons_credentials pc
JOIN _persons_to_authors_map map ON map.person_id = pc._parent_id
WHERE pc._order < 8;  -- maxRows: 8

-- ───────────────────────── 5. Copy persons_knows_about → authors_knows_about ─────────────────────────

INSERT INTO authors_knows_about (_order, _parent_id, id, topic)
SELECT
    pk._order,
    map.author_id,
    gen_random_uuid()::varchar,
    substring(pk.topic from 1 for 80)
FROM persons_knows_about pk
JOIN _persons_to_authors_map map ON map.person_id = pk._parent_id
WHERE pk._order < 12;  -- maxRows: 12

-- ───────────────────────── 6. Copy persons_same_as → authors_same_as ─────────────────────────

INSERT INTO authors_same_as (_order, _parent_id, id, url)
SELECT
    ps._order,
    map.author_id,
    gen_random_uuid()::varchar,
    CASE
        WHEN ps.url ~ '^https?://' THEN ps.url
        WHEN ps.url ~ '^(t\.me|vk\.com|wa\.me|telegram\.me)/' THEN 'https://' || ps.url
        ELSE NULL
    END AS final_url
FROM persons_same_as ps
JOIN _persons_to_authors_map map ON map.person_id = ps._parent_id
WHERE ps._order < 8  -- maxRows: 8
  AND (
    ps.url ~ '^https?://'
    OR ps.url ~ '^(t\.me|vk\.com|wa\.me|telegram\.me)/'
  );

-- ───────────────────────── 7. Copy persons_rels (worksInDistricts) → authors_rels ─────────────────────────

INSERT INTO authors_rels ("order", parent_id, path, districts_id)
SELECT
    pr."order",
    map.author_id,
    'worksInDistricts',
    pr.districts_id
FROM persons_rels pr
JOIN _persons_to_authors_map map ON map.person_id = pr.parent_id
WHERE pr.districts_id IS NOT NULL;

-- ───────────────────────── 8. Rebind FK references ─────────────────────────

-- 8a. blog.author_id (currently NOT NULL is enforced by Payload, FK is NULL on persons drop)
ALTER TABLE blog DROP CONSTRAINT IF EXISTS blog_author_id_persons_id_fk;
UPDATE blog SET author_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = blog.author_id
)
WHERE author_id IS NOT NULL;
ALTER TABLE blog
    ADD CONSTRAINT blog_author_id_authors_id_fk
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL;
DROP INDEX IF EXISTS blog_author_idx;
CREATE INDEX IF NOT EXISTS blog_author_idx ON blog (author_id);

-- 8b. blog.reviewed_by_id
ALTER TABLE blog DROP CONSTRAINT IF EXISTS blog_reviewed_by_id_persons_id_fk;
UPDATE blog SET reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = blog.reviewed_by_id
)
WHERE reviewed_by_id IS NOT NULL;
ALTER TABLE blog
    ADD CONSTRAINT blog_reviewed_by_id_authors_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;
DROP INDEX IF EXISTS blog_reviewed_by_idx;
CREATE INDEX IF NOT EXISTS blog_reviewed_by_idx ON blog (reviewed_by_id);

-- 8c. _blog_v.version_author_id
ALTER TABLE _blog_v DROP CONSTRAINT IF EXISTS _blog_v_version_author_id_persons_id_fk;
UPDATE _blog_v SET version_author_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = _blog_v.version_author_id
)
WHERE version_author_id IS NOT NULL;
ALTER TABLE _blog_v
    ADD CONSTRAINT _blog_v_version_author_id_authors_id_fk
    FOREIGN KEY (version_author_id) REFERENCES authors(id) ON DELETE SET NULL;

-- 8d. _blog_v.version_reviewed_by_id
ALTER TABLE _blog_v DROP CONSTRAINT IF EXISTS _blog_v_version_reviewed_by_id_persons_id_fk;
UPDATE _blog_v SET version_reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = _blog_v.version_reviewed_by_id
)
WHERE version_reviewed_by_id IS NOT NULL;
ALTER TABLE _blog_v
    ADD CONSTRAINT _blog_v_version_reviewed_by_id_authors_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;

-- 8e. cases.reviewed_by_id
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_reviewed_by_id_persons_id_fk;
UPDATE cases SET reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = cases.reviewed_by_id
)
WHERE reviewed_by_id IS NOT NULL;
ALTER TABLE cases
    ADD CONSTRAINT cases_reviewed_by_id_authors_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;
DROP INDEX IF EXISTS cases_reviewed_by_idx;
CREATE INDEX IF NOT EXISTS cases_reviewed_by_idx ON cases (reviewed_by_id);

-- 8f. _cases_v.version_reviewed_by_id
ALTER TABLE _cases_v DROP CONSTRAINT IF EXISTS _cases_v_version_reviewed_by_id_persons_id_fk;
UPDATE _cases_v SET version_reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = _cases_v.version_reviewed_by_id
)
WHERE version_reviewed_by_id IS NOT NULL;
ALTER TABLE _cases_v
    ADD CONSTRAINT _cases_v_version_reviewed_by_id_authors_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;

-- 8g. cases_rels.persons_id (brigade hasMany) → cases_rels.authors_id
ALTER TABLE cases_rels DROP CONSTRAINT IF EXISTS cases_rels_persons_fk;
ALTER TABLE cases_rels ADD COLUMN IF NOT EXISTS authors_id integer;
UPDATE cases_rels SET authors_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = cases_rels.persons_id
)
WHERE persons_id IS NOT NULL;
ALTER TABLE cases_rels
    ADD CONSTRAINT cases_rels_authors_fk
    FOREIGN KEY (authors_id) REFERENCES authors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS cases_rels_authors_id_idx ON cases_rels (authors_id);
-- Update path: 'brigade' остаётся (это field name, не collection slug)
UPDATE cases_rels SET path = 'brigade' WHERE path = 'brigade' AND authors_id IS NOT NULL;
ALTER TABLE cases_rels DROP COLUMN IF EXISTS persons_id;
DROP INDEX IF EXISTS cases_rels_persons_id_idx;

-- 8h. _cases_v_rels.persons_id (brigade versions) → _cases_v_rels.authors_id
ALTER TABLE _cases_v_rels DROP CONSTRAINT IF EXISTS _cases_v_rels_persons_fk;
ALTER TABLE _cases_v_rels ADD COLUMN IF NOT EXISTS authors_id integer;
UPDATE _cases_v_rels SET authors_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = _cases_v_rels.persons_id
)
WHERE persons_id IS NOT NULL;
ALTER TABLE _cases_v_rels
    ADD CONSTRAINT _cases_v_rels_authors_fk
    FOREIGN KEY (authors_id) REFERENCES authors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS _cases_v_rels_authors_id_idx ON _cases_v_rels (authors_id);
ALTER TABLE _cases_v_rels DROP COLUMN IF EXISTS persons_id;
DROP INDEX IF EXISTS _cases_v_rels_persons_id_idx;

-- 8i. service_districts.reviewed_by_id (spec пропустил, но FK реален в БД)
ALTER TABLE service_districts DROP CONSTRAINT IF EXISTS service_districts_reviewed_by_id_persons_id_fk;
UPDATE service_districts SET reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = service_districts.reviewed_by_id
)
WHERE reviewed_by_id IS NOT NULL;
ALTER TABLE service_districts
    ADD CONSTRAINT service_districts_reviewed_by_id_authors_id_fk
    FOREIGN KEY (reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;
DROP INDEX IF EXISTS service_districts_reviewed_by_idx;
CREATE INDEX IF NOT EXISTS service_districts_reviewed_by_idx ON service_districts (reviewed_by_id);

-- 8j. _service_districts_v.version_reviewed_by_id
ALTER TABLE _service_districts_v DROP CONSTRAINT IF EXISTS _service_districts_v_version_reviewed_by_id_persons_id_fk;
UPDATE _service_districts_v SET version_reviewed_by_id = (
    SELECT author_id FROM _persons_to_authors_map WHERE person_id = _service_districts_v.version_reviewed_by_id
)
WHERE version_reviewed_by_id IS NOT NULL;
ALTER TABLE _service_districts_v
    ADD CONSTRAINT _service_districts_v_version_reviewed_by_id_authors_id_fk
    FOREIGN KEY (version_reviewed_by_id) REFERENCES authors(id) ON DELETE SET NULL;

-- ───────────────────────── 9. payload_locked_documents_rels: drop persons_id ─────────────────────────

ALTER TABLE payload_locked_documents_rels
    DROP CONSTRAINT IF EXISTS payload_locked_documents_rels_persons_fk;
ALTER TABLE payload_locked_documents_rels DROP COLUMN IF EXISTS persons_id;
DROP INDEX IF EXISTS payload_locked_documents_rels_persons_id_idx;

-- ───────────────────────── 10. DROP persons + persons_* tables ─────────────────────────

DROP TABLE IF EXISTS persons_credentials CASCADE;
DROP TABLE IF EXISTS persons_knows_about CASCADE;
DROP TABLE IF EXISTS persons_same_as CASCADE;
DROP TABLE IF EXISTS persons_rels CASCADE;
DROP TABLE IF EXISTS persons CASCADE;

-- ───────────────────────── 11. Audit summary ─────────────────────────

DO $$
DECLARE
    map_count integer;
    suffix_count integer;
BEGIN
    SELECT COUNT(*) INTO map_count FROM _persons_to_authors_map;
    SELECT COUNT(*) INTO suffix_count FROM _persons_to_authors_map WHERE suffix_applied;
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE 'PANEL-PERSONS-RENAME migration complete:';
    RAISE NOTICE '  Persons migrated to Authors: %', map_count;
    RAISE NOTICE '  Slug conflicts resolved (suffix -2..-99): %', suffix_count;
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
END $$;

-- Drop mapping table — иначе Payload push:true introspect может посчитать его
-- candidate для rename в _authors_v_rels. Audit-output сохранён в migrate
-- output log (см. spec §2.5 deployment sequence).
DROP TABLE IF EXISTS _persons_to_authors_map CASCADE;

COMMIT;
