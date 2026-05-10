-- EPIC-SERVICE-PAGES-REDESIGN D5 — A/B pilot variant tag на rum_metrics.
--
-- Контекст: D5 cookie split (`obikhod_ab_var=v1|v2`) на /vyvoz-musora/ — pilot
-- 7 дней. RumProvider добавляет `abVariant` в beacon payload только для pilot
-- URL. Здесь добавляем ENUM TYPE + nullable column + index для group-by
-- aggregation.
--
-- Idempotent: IF NOT EXISTS на ENUM, ADD COLUMN, INDEX. Безопасно перезапускать.

BEGIN;

-- ─────────────────────────── 1. ENUM TYPE ───────────────────────────

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rum_metrics_ab_variant') THEN
        CREATE TYPE "enum_rum_metrics_ab_variant" AS ENUM ('v1', 'v2');
    END IF;
END $$;

-- ─────────────────────────── 2. Column ───────────────────────────

ALTER TABLE "rum_metrics"
    ADD COLUMN IF NOT EXISTS "ab_variant" "enum_rum_metrics_ab_variant";

-- ─────────────────────────── 3. Index ───────────────────────────

CREATE INDEX IF NOT EXISTS "rum_metrics_ab_variant_idx"
    ON "rum_metrics" ("ab_variant");

COMMIT;
