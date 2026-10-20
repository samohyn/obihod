-- План 09, этап 1 — чужой ИНН в разметке.
--
-- Начальная схема (00000000_000000_initial_schema_bootstrap) задала site_chrome.requisites_tax_id
-- DEFAULT '7847729123' — реально выглядящий ИНН, не наш. Строка SiteChrome, созданная миграцией
-- 20261019_200000, получила его, и он ушёл в JSON-LD Organization.taxID.
-- Заглушка проекта — '1111111111' (как defaultValue в globals/SiteChrome.ts): сайт её не показывает
-- (lib/chrome.ts getContacts, lib/seo/jsonld.ts realRequisite). Владелец впишет настоящий ИНН в админке.
--
-- Idempotent.

BEGIN;

ALTER TABLE "site_chrome" ALTER COLUMN "requisites_tax_id" SET DEFAULT '1111111111';

UPDATE "site_chrome" SET "requisites_tax_id" = '1111111111' WHERE "requisites_tax_id" = '7847729123';

COMMIT;
