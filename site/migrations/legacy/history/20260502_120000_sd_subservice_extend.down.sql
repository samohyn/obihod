-- Rollback US-3 Wave 0.1 SD subService extension.
--
-- Восстанавливает pair (service_id, district_id) UNIQUE и удаляет
-- sub_service_slug колонку. Если в момент rollback в БД уже есть
-- sub-level SD (sub_service_slug IS NOT NULL) — данные потеряются;
-- это acceptable для US-3 Wave 0.1 (свежий feature, нет real prod-data).

BEGIN;

DROP INDEX IF EXISTS service_districts_service_district_sub_uniq;
DROP INDEX IF EXISTS service_districts_service_district_pillar_uniq;
DROP INDEX IF EXISTS service_districts_sub_service_slug_idx;

-- Восстанавливаем pair-level unique. Если есть дубликаты — оставляем
-- разрулить вручную (rollback не делает DELETE).
CREATE UNIQUE INDEX IF NOT EXISTS service_districts_service_id_district_id_idx
  ON service_districts (service_id, district_id);

ALTER TABLE "_service_districts_v" DROP COLUMN IF EXISTS "version_sub_service_slug";
ALTER TABLE "service_districts"  DROP COLUMN IF EXISTS "sub_service_slug";

COMMIT;
