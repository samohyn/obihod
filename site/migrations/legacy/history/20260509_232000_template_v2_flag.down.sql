-- EPIC-SERVICE-PAGES-UX C4 — DOWN: drop `use_template_v2` columns.
--
-- Идемпотентный rollback. Если data в колонке — drop её безусловно (boolean
-- flag, не data of value).

BEGIN;

ALTER TABLE "services"
  DROP COLUMN IF EXISTS "use_template_v2";

ALTER TABLE "_services_v"
  DROP COLUMN IF EXISTS "version_use_template_v2";

ALTER TABLE "service_districts"
  DROP COLUMN IF EXISTS "use_template_v2";

ALTER TABLE "_service_districts_v"
  DROP COLUMN IF EXISTS "version_use_template_v2";

ALTER TABLE "b2b_pages"
  DROP COLUMN IF EXISTS "use_template_v2";

ALTER TABLE "_b2b_pages_v"
  DROP COLUMN IF EXISTS "version_use_template_v2";

COMMIT;
