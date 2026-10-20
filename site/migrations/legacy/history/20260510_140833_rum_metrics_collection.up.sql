-- RumMetrics collection (OVT-3, EPIC-LIWOOD-OVERTAKE) — RUM сэмплы Core Web Vitals.
--
-- Контекст: коллекция добавлена в payload.config.ts через `RumMetrics` импорт,
-- но *.up.sql миграции не создавалось (push:true в local). Production drift —
-- POST /api/rum silent fail (target table missing).
--
-- Структура: см. site/collections/RumMetrics.ts (slug='rum-metrics', no drafts).
-- Select fields → ENUM TYPE pattern (sustained Payload convention).
-- Anonymous create + admin read; ничего PII не хранится (152-ФЗ compliant).

BEGIN;

-- ─────────────────────────── 1. ENUM TYPES ───────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rum_metrics_name') THEN
        CREATE TYPE "enum_rum_metrics_name" AS ENUM (
            'LCP', 'CLS', 'INP', 'FID', 'TTFB', 'FCP'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rum_metrics_rating') THEN
        CREATE TYPE "enum_rum_metrics_rating" AS ENUM (
            'good', 'needs-improvement', 'poor'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rum_metrics_navigation_type') THEN
        CREATE TYPE "enum_rum_metrics_navigation_type" AS ENUM (
            'navigate', 'reload', 'back-forward', 'back-forward-cache', 'prerender'
        );
    END IF;
END $$;

-- ─────────────────────────── 2. Main table rum_metrics ───────────────────────────

CREATE TABLE IF NOT EXISTS "rum_metrics" (
    "id" serial PRIMARY KEY,
    "name" "enum_rum_metrics_name" NOT NULL,
    "value" numeric NOT NULL,
    "rating" "enum_rum_metrics_rating" NOT NULL,
    "page_url" varchar NOT NULL,
    "user_agent" varchar,
    "viewport_width" numeric,
    "navigation_type" "enum_rum_metrics_navigation_type",
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

-- ─────────────────────────── 3. Indexes ───────────────────────────

CREATE INDEX IF NOT EXISTS "rum_metrics_name_idx" ON "rum_metrics" ("name");
CREATE INDEX IF NOT EXISTS "rum_metrics_rating_idx" ON "rum_metrics" ("rating");
CREATE INDEX IF NOT EXISTS "rum_metrics_page_url_idx" ON "rum_metrics" ("page_url");
CREATE INDEX IF NOT EXISTS "rum_metrics_created_at_idx" ON "rum_metrics" ("created_at");
CREATE INDEX IF NOT EXISTS "rum_metrics_updated_at_idx" ON "rum_metrics" ("updated_at");

-- ─────────────────────────── 4. payload_locked_documents_rels.rum_metrics_id ───────────────────────────
-- Каждая Payload collection требует FK column в payload_locked_documents_rels
-- (sustained 2026-05-09 reviews fix на ту же ADR-0016 root cause #3).
-- Без неё Payload `checkDocumentLockStatus` падает на любом create/update/delete.

ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "rum_metrics_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'payload_locked_documents_rels_rum_metrics_fk'
    ) THEN
        ALTER TABLE "payload_locked_documents_rels"
            ADD CONSTRAINT "payload_locked_documents_rels_rum_metrics_fk"
            FOREIGN KEY ("rum_metrics_id") REFERENCES "rum_metrics"("id") ON DELETE CASCADE;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_rum_metrics_id_idx"
    ON "payload_locked_documents_rels" ("rum_metrics_id");

COMMIT;
