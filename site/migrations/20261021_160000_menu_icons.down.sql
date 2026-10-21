-- Откат 20261021_160000_menu_icons.
ALTER TABLE "site_chrome_header_nav_children" DROP COLUMN IF EXISTS "icon";
DROP TYPE IF EXISTS "public"."enum_site_chrome_header_nav_children_icon";
