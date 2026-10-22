-- Откат 20261022_120000_geo_local_info.
DROP TABLE IF EXISTS "_service_districts_v_version_local_info" CASCADE;
DROP TABLE IF EXISTS "service_districts_local_info" CASCADE;
ALTER TABLE "page_templates" DROP COLUMN IF EXISTS "geo_info_title";
DROP TYPE IF EXISTS "public"."enum__service_districts_v_version_local_info_icon";
DROP TYPE IF EXISTS "public"."enum_service_districts_local_info_icon";
