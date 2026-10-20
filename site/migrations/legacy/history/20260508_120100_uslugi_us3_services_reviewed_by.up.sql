-- US-3 EPIC-SEO-USLUGI: Services.reviewedBy relationship → authors.
--
-- E-E-A-T leverage для T2/T3: pillar-уровневая привязка автора-эксперта.
-- ON DELETE SET NULL — если автор удалён, ссылка обнуляется (Service не
-- ломается). Idempotent через IF NOT EXISTS на column + DO-block для FK.
--
-- Также добавляем версионную колонку в `_services_v` (Payload drafts/versions
-- pattern — sustained на ServiceDistricts.reviewed_by_id).

BEGIN;

-- 1. Базовая таблица.
ALTER TABLE "services"
  ADD COLUMN IF NOT EXISTS "reviewed_by_id" integer;

-- 2. FK constraint (defensive — DO IF NOT EXISTS на constraint имени).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'services_reviewed_by_id_authors_id_fk'
      AND conrelid = 'services'::regclass
  ) THEN
    ALTER TABLE "services"
      ADD CONSTRAINT "services_reviewed_by_id_authors_id_fk"
      FOREIGN KEY ("reviewed_by_id") REFERENCES "authors"("id") ON DELETE SET NULL;
  END IF;
END$$;

-- 3. Index для join-lookup (admin-list / E-E-A-T render).
CREATE INDEX IF NOT EXISTS "services_reviewed_by_idx"
  ON "services" ("reviewed_by_id");

-- 4. Snapshot version table (sustained Payload drafts pattern).
ALTER TABLE "_services_v"
  ADD COLUMN IF NOT EXISTS "version_reviewed_by_id" integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = '_services_v_version_reviewed_by_id_authors_id_fk'
      AND conrelid = '_services_v'::regclass
  ) THEN
    ALTER TABLE "_services_v"
      ADD CONSTRAINT "_services_v_version_reviewed_by_id_authors_id_fk"
      FOREIGN KEY ("version_reviewed_by_id") REFERENCES "authors"("id") ON DELETE SET NULL;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS "_services_v_version_reviewed_by_idx"
  ON "_services_v" ("version_reviewed_by_id");

COMMIT;
