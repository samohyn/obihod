-- US-5 REQ-5.7: SEO override + E-E-A-T поля для Services и Cases.
--
-- Добавляет точечные override-поля для редких случаев когда автогенерируемый
-- canonical, robots-директивы или breadcrumb-label нуждаются в корректировке
-- без изменения главных полей (title, h1, metaTitle и т.д.).
--
-- Имена snake_case через `to-snake-case@1.0.0` (см. learnings 2026-04-26):
--   canonicalOverride → canonical_override
--   robotsDirectives  → robots_directives (но это select hasMany → отдельная таблица services_robots_directives)
--   breadcrumbLabel   → breadcrumb_label
--   lastReviewedAt    → last_reviewed_at
--   reviewedBy        → reviewed_by_id (FK → persons)
--
-- Drafts: services и cases имеют versions: { drafts: ... } → нужны поля и в _services_v / _cases_v.

BEGIN;

-- ───────────────────────── 1. services ─────────────────────────

ALTER TABLE "services"
    ADD COLUMN IF NOT EXISTS "canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "breadcrumb_label" varchar;

-- robots_directives — select hasMany. Drizzle/Payload создаёт отдельную
-- таблицу `services_robots_directives` с FK на services.id и колонкой
-- value (enum). Создаём её явно с enum типом.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_robots_directives') THEN
        CREATE TYPE "enum_services_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "services_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "services"("id") ON DELETE CASCADE,
    "value" "enum_services_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "services_robots_directives_order_idx" ON "services_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "services_robots_directives_parent_idx" ON "services_robots_directives" ("parent_id");

-- versions table _services_v
ALTER TABLE "_services_v"
    ADD COLUMN IF NOT EXISTS "version_canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "version_breadcrumb_label" varchar;

CREATE TABLE IF NOT EXISTS "_services_v_version_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "_services_v"("id") ON DELETE CASCADE,
    "value" "enum_services_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "_services_v_version_robots_directives_order_idx" ON "_services_v_version_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "_services_v_version_robots_directives_parent_idx" ON "_services_v_version_robots_directives" ("parent_id");

-- ───────────────────────── 2. cases ─────────────────────────

ALTER TABLE "cases"
    ADD COLUMN IF NOT EXISTS "canonical_override" varchar,
    ADD COLUMN IF NOT EXISTS "breadcrumb_label" varchar,
    ADD COLUMN IF NOT EXISTS "last_reviewed_at" timestamp(3) with time zone,
    ADD COLUMN IF NOT EXISTS "reviewed_by_id" integer;

-- FK на persons.id для reviewed_by_id (мягко через DO, чтобы не упасть если уже есть)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'cases_reviewed_by_id_fk'
    ) THEN
        ALTER TABLE "cases"
            ADD CONSTRAINT "cases_reviewed_by_id_fk"
            FOREIGN KEY ("reviewed_by_id") REFERENCES "persons"("id") ON DELETE SET NULL;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS "cases_reviewed_by_idx" ON "cases" ("reviewed_by_id");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cases_robots_directives') THEN
        CREATE TYPE "enum_cases_robots_directives" AS ENUM (
            'index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS "cases_robots_directives" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL REFERENCES "cases"("id") ON DELETE CASCADE,
    "value" "enum_cases_robots_directives" NOT NULL,
    "id" serial PRIMARY KEY
);
CREATE INDEX IF NOT EXISTS "cases_robots_directives_order_idx" ON "cases_robots_directives" ("order");
CREATE INDEX IF NOT EXISTS "cases_robots_directives_parent_idx" ON "cases_robots_directives" ("parent_id");

COMMIT;
