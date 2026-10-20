-- Rollback wave 2B1 sub-service content fields.

BEGIN;

ALTER TABLE "_services_v_version_sub_services" DROP COLUMN IF EXISTS "meta_description";
ALTER TABLE "_services_v_version_sub_services" DROP COLUMN IF EXISTS "meta_title";
ALTER TABLE "_services_v_version_sub_services" DROP COLUMN IF EXISTS "body";
ALTER TABLE "_services_v_version_sub_services" DROP COLUMN IF EXISTS "intro";

ALTER TABLE "services_sub_services" DROP COLUMN IF EXISTS "meta_description";
ALTER TABLE "services_sub_services" DROP COLUMN IF EXISTS "meta_title";
ALTER TABLE "services_sub_services" DROP COLUMN IF EXISTS "body";
ALTER TABLE "services_sub_services" DROP COLUMN IF EXISTS "intro";

COMMIT;
