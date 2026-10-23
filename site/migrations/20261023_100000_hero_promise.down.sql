-- Откат 20261023_100000_hero_promise.
ALTER TABLE "pages_blocks_hero_slider_slides" DROP COLUMN IF EXISTS "promise";
ALTER TABLE "_pages_v_blocks_hero_slider_slides" DROP COLUMN IF EXISTS "promise";
ALTER TABLE "sub_services_blocks_hero_slider_slides" DROP COLUMN IF EXISTS "promise";
ALTER TABLE "_sub_services_v_blocks_hero_slider_slides" DROP COLUMN IF EXISTS "promise";
ALTER TABLE "pages_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Зафиксировать цену';
ALTER TABLE "_pages_v_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Зафиксировать цену';
ALTER TABLE "sub_services_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Зафиксировать цену';
ALTER TABLE "_sub_services_v_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Зафиксировать цену';
