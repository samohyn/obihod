-- US-3 Wave 0.1: расширение service_districts для 4-уровневой иерархии URL.
--
-- ДО: pair (service_id, district_id) UNIQUE → SD только pillar-level
-- ПОСЛЕ: triple (service_id, district_id, sub_service_slug) UNIQUE → SD
-- может быть и pillar-level (sub_service_slug=NULL) и sub-level (sub_service_slug='kontejner').
--
-- Архитектурное замечание (be-panel/dba 2026-05-02): спека US-3 рекомендовала
-- relationship relationTo: 'sub-services', но collection `sub-services` НЕ
-- существует — sub-услуги хранятся как inline array в Services.subServices.
-- Поэтому используем text-поле sub_service_slug, которое matches
-- services.subServices[].slug. Это упрощает schema (нет лишнего FK на
-- виртуальную collection) и следует фактической data-model.
--
-- NULL-семантика: NULL != NULL в Postgres unique constraint, поэтому
-- (svc=1,dst=2,sub=NULL) встречается ровно один раз только если
-- мы добавим partial unique index на pair WHERE sub_service_slug IS NULL.
-- Это предотвратит дубликаты pillar-level SD после миграции.

BEGIN;

-- 1. Добавляем nullable text-колонку (idempotent).
ALTER TABLE "service_districts"
  ADD COLUMN IF NOT EXISTS "sub_service_slug" varchar;

-- 2. И на snapshot version-таблицу.
ALTER TABLE "_service_districts_v"
  ADD COLUMN IF NOT EXISTS "version_sub_service_slug" varchar;

-- 3. Дроп старых unique constraint/index на pair (service_id, district_id).
--    Payload v3 генерирует имена в формате `<table>_<col>_<col>_unique` или
--    `<table>_<col>_<col>_idx` (фактически `service_district_idx`). Делаем
--    defensive lookup через pg_catalog. Используем set-сравнение через
--    `<@`/`@>` (ARRAY ordering — service|district vs district|service —
--    зависит от colorder в DDL и отличается между версиями Payload).
--    Также пропускаем НАШИ partial unique indexes (WHERE-clause присутствует),
--    чтобы re-run не дропнул то, что мы только что создали.
DO $$
DECLARE
  cname text;
  cols name[];
BEGIN
  -- Constraint форма
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'service_districts'::regclass
    AND contype = 'u'
    AND array_length(conkey, 1) = 2
    AND (
      SELECT array_agg(attname) FROM pg_attribute
      WHERE attrelid = conrelid AND attnum = ANY(conkey)
    ) <@ ARRAY['district_id', 'service_id']::name[]
    AND (
      SELECT array_agg(attname) FROM pg_attribute
      WHERE attrelid = conrelid AND attnum = ANY(conkey)
    ) @> ARRAY['district_id', 'service_id']::name[]
  LIMIT 1;
  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE service_districts DROP CONSTRAINT IF EXISTS %I', cname);
  END IF;

  -- Index форма (без constraint). Pg_index.indpred IS NULL отсекает наши
  -- partial unique indexes (у них indpred = WHERE-clause не NULL).
  FOR cname IN
    SELECT i.relname FROM pg_index x
    JOIN pg_class i ON i.oid = x.indexrelid
    WHERE x.indrelid = 'service_districts'::regclass
      AND x.indisunique
      AND x.indpred IS NULL
      AND (
        SELECT array_agg(a.attname) FROM pg_attribute a
        WHERE a.attrelid = x.indrelid AND a.attnum = ANY(x.indkey::int[])
      ) <@ ARRAY['district_id', 'service_id']::name[]
      AND (
        SELECT array_agg(a.attname) FROM pg_attribute a
        WHERE a.attrelid = x.indrelid AND a.attnum = ANY(x.indkey::int[])
      ) @> ARRAY['district_id', 'service_id']::name[]
  LOOP
    EXECUTE format('DROP INDEX IF EXISTS %I', cname);
  END LOOP;
END$$;

-- 4. Triple unique через partial indexes:
--    a) Pillar-level (sub_service_slug IS NULL) — ровно один SD на пару.
CREATE UNIQUE INDEX IF NOT EXISTS service_districts_service_district_pillar_uniq
  ON service_districts (service_id, district_id)
  WHERE sub_service_slug IS NULL;

--    b) Sub-level (sub_service_slug IS NOT NULL) — triple unique.
CREATE UNIQUE INDEX IF NOT EXISTS service_districts_service_district_sub_uniq
  ON service_districts (service_id, district_id, sub_service_slug)
  WHERE sub_service_slug IS NOT NULL;

-- 5. Обычный non-unique index для запросов по sub_service_slug.
CREATE INDEX IF NOT EXISTS service_districts_sub_service_slug_idx
  ON service_districts (sub_service_slug)
  WHERE sub_service_slug IS NOT NULL;

COMMIT;
