-- Fixup: добавление version_* колонок в _v таблицы для SEO override полей.
--
-- Контекст
-- ────────
-- В миграциях SEO override (180000 Services+Cases, 193000 Blog/B2B/Districts,
-- 200000 Authors, US-3 base) для основных таблиц добавлены canonical_override,
-- breadcrumb_label, last_reviewed_at, reviewed_by_id. Для версионных таблиц
-- _<table>_v соответствующие version_* колонки забыты везде кроме _services_v.
--
-- Симптом на prod: B2B POST → HTTP 500 — column "version_canonical_override"
-- of relation "_b2b_pages_v" does not exist. Любой POST/PATCH в коллекции
-- с versions+drafts упадёт при попытке Payload записать snapshot.
--
-- Применяется вручную на prod через psql + INSERT в payload_migrations.

BEGIN;

-- ───── _authors_v ─── только version_breadcrumb_label ─────
ALTER TABLE "_authors_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;

-- ───── _b2b_pages_v ─── canonical_override + breadcrumb_label ─────
ALTER TABLE "_b2b_pages_v" ADD COLUMN IF NOT EXISTS "version_canonical_override" varchar;
ALTER TABLE "_b2b_pages_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;

-- ───── _blog_v ─── canonical_override + breadcrumb_label + reviewedBy + lastReviewedAt ─────
ALTER TABLE "_blog_v" ADD COLUMN IF NOT EXISTS "version_canonical_override" varchar;
ALTER TABLE "_blog_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;
ALTER TABLE "_blog_v" ADD COLUMN IF NOT EXISTS "version_last_reviewed_at" timestamp(3) with time zone;
ALTER TABLE "_blog_v" ADD COLUMN IF NOT EXISTS "version_reviewed_by_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = '_blog_v_version_reviewed_by_id_fk') THEN
        ALTER TABLE "_blog_v"
            ADD CONSTRAINT "_blog_v_version_reviewed_by_id_fk"
            FOREIGN KEY ("version_reviewed_by_id") REFERENCES "persons"("id") ON DELETE SET NULL;
    END IF;
END$$;
CREATE INDEX IF NOT EXISTS "_blog_v_version_reviewed_by_idx" ON "_blog_v" ("version_reviewed_by_id");

-- ───── _cases_v ─── canonical_override + breadcrumb_label + reviewedBy + lastReviewedAt ─────
ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_canonical_override" varchar;
ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;
ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_last_reviewed_at" timestamp(3) with time zone;
ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_reviewed_by_id" integer;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = '_cases_v_version_reviewed_by_id_fk') THEN
        ALTER TABLE "_cases_v"
            ADD CONSTRAINT "_cases_v_version_reviewed_by_id_fk"
            FOREIGN KEY ("version_reviewed_by_id") REFERENCES "persons"("id") ON DELETE SET NULL;
    END IF;
END$$;
CREATE INDEX IF NOT EXISTS "_cases_v_version_reviewed_by_idx" ON "_cases_v" ("version_reviewed_by_id");

-- ───── _districts_v ─── canonical_override + breadcrumb_label ─────
ALTER TABLE "_districts_v" ADD COLUMN IF NOT EXISTS "version_canonical_override" varchar;
ALTER TABLE "_districts_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;

-- ───── _service_districts_v ─── только version_breadcrumb_label (canonical_override уже есть) ─────
ALTER TABLE "_service_districts_v" ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;

COMMIT;
