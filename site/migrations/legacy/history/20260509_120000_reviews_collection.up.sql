-- Reviews collection (US-9 EPIC-SEO-COMPETE-3) — отзывы с привязкой к service/district/source.
--
-- Контекст: коллекция добавлена в payload.config.ts через `Reviews` импорт,
-- но *.up.sql миграции не было — drift через push:true в local/CI vs prod.
--
-- 2026-05-09 incident: publish-services workflow упал на
-- `column reviews_id does not exist` в payload_locked_documents_rels JOIN
-- (checkDocumentLockStatus → findMany). Это и есть proof point ADR-0016
-- root cause #3 (push:true не пишет *.up.sql, prod расходится с local).
--
-- Структура: см. site/collections/Reviews.ts (slug='reviews', versions=drafts).
-- Drafts → _reviews_v + payload_locked_documents_rels.reviews_id FK.

BEGIN;

-- ───────────────────────── 1. Main table reviews ─────────────────────────

CREATE TABLE IF NOT EXISTS "reviews" (
    "id" serial PRIMARY KEY,
    "author_name" varchar NOT NULL,
    "rating" numeric NOT NULL,
    "text" varchar NOT NULL,
    "date_published" timestamp(3) with time zone NOT NULL,
    "service_id" integer,
    "district_id" integer,
    "source" varchar,
    "source_url" varchar,
    "verified" boolean DEFAULT false,
    "pinned_to_homepage" boolean DEFAULT false,
    "priority" numeric DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" varchar DEFAULT 'draft'
);

CREATE INDEX IF NOT EXISTS "reviews_status_idx" ON "reviews" ("_status");
CREATE INDEX IF NOT EXISTS "reviews_updated_at_idx" ON "reviews" ("updated_at");
CREATE INDEX IF NOT EXISTS "reviews_service_id_idx" ON "reviews" ("service_id");
CREATE INDEX IF NOT EXISTS "reviews_district_id_idx" ON "reviews" ("district_id");

-- FK service_id → services.id (опциональный)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'reviews_service_id_fk'
    ) THEN
        ALTER TABLE "reviews"
            ADD CONSTRAINT "reviews_service_id_fk"
            FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL;
    END IF;
END$$;

-- FK district_id → districts.id (опциональный)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'reviews_district_id_fk'
    ) THEN
        ALTER TABLE "reviews"
            ADD CONSTRAINT "reviews_district_id_fk"
            FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL;
    END IF;
END$$;

-- ───────────────────────── 2. ENUM enum_reviews_source ─────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_reviews_source') THEN
        CREATE TYPE "enum_reviews_source" AS ENUM (
            'yandex_maps', 'yandex_business', 'twogis', 'avito', 'site_form', 'direct'
        );
    END IF;
END$$;

-- Apply enum to source column (если ещё varchar)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'source' AND udt_name = 'varchar'
    ) THEN
        ALTER TABLE "reviews"
            ALTER COLUMN "source" TYPE "enum_reviews_source"
            USING "source"::"enum_reviews_source";
    END IF;
END$$;

-- ───────────────────────── 3. _reviews_v (versions/drafts) ─────────────────────────

CREATE TABLE IF NOT EXISTS "_reviews_v" (
    "id" serial PRIMARY KEY,
    "parent_id" integer REFERENCES "reviews"("id") ON DELETE SET NULL,
    "version_author_name" varchar,
    "version_rating" numeric,
    "version_text" varchar,
    "version_date_published" timestamp(3) with time zone,
    "version_service_id" integer REFERENCES "services"("id") ON DELETE SET NULL,
    "version_district_id" integer REFERENCES "districts"("id") ON DELETE SET NULL,
    "version_source" "enum_reviews_source",
    "version_source_url" varchar,
    "version_verified" boolean DEFAULT false,
    "version_pinned_to_homepage" boolean DEFAULT false,
    "version_priority" numeric DEFAULT 0,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" varchar,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
);
CREATE INDEX IF NOT EXISTS "_reviews_v_parent_idx" ON "_reviews_v" ("parent_id");
CREATE INDEX IF NOT EXISTS "_reviews_v_latest_idx" ON "_reviews_v" ("latest");

-- ───────────────────────── 4. payload_locked_documents_rels.reviews_id ─────────────────────────
-- Это и есть колонка которой не было — Payload checkDocumentLockStatus падал.

ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "reviews_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_reviews_fk'
    ) THEN
        ALTER TABLE "payload_locked_documents_rels"
            ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk"
            FOREIGN KEY ("reviews_id") REFERENCES "reviews"("id") ON DELETE CASCADE;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reviews_id_idx"
    ON "payload_locked_documents_rels" ("reviews_id");

COMMIT;
