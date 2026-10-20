-- Откат 20261020_140000_site_chrome_c4.
DROP TABLE IF EXISTS "site_chrome_header_nav_children" CASCADE;
DROP TABLE IF EXISTS "site_chrome_header_nav" CASCADE;
DROP TABLE IF EXISTS "site_chrome_header_mobile_extra" CASCADE;
DROP TABLE IF EXISTS "site_chrome_header_utility" CASCADE;
DROP TABLE IF EXISTS "site_chrome_footer_nav_items" CASCADE;
DROP TABLE IF EXISTS "site_chrome_footer_nav" CASCADE;
ALTER TABLE "site_chrome" DROP COLUMN IF EXISTS "contacts_hours";
DROP TYPE IF EXISTS "public"."enum_site_chrome_header_utility_icon";
