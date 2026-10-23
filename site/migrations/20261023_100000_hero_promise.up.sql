-- Первый экран: «Обещание под заголовком» у слайда (план 09, этап 2 — оффер на первом экране услуги). Expand.
ALTER TABLE "pages_blocks_hero_slider_slides" ADD COLUMN IF NOT EXISTS "promise" varchar;
ALTER TABLE "_pages_v_blocks_hero_slider_slides" ADD COLUMN IF NOT EXISTS "promise" varchar;
ALTER TABLE "sub_services_blocks_hero_slider_slides" ADD COLUMN IF NOT EXISTS "promise" varchar;
ALTER TABLE "_sub_services_v_blocks_hero_slider_slides" ADD COLUMN IF NOT EXISTS "promise" varchar;
-- Кнопка калькулятора по умолчанию — «Получить твёрдую смету»: калькулятор даёт ориентир, а не фиксирует цену.
ALTER TABLE "pages_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Получить твёрдую смету';
ALTER TABLE "_pages_v_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Получить твёрдую смету';
ALTER TABLE "sub_services_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Получить твёрдую смету';
ALTER TABLE "_sub_services_v_blocks_calculator_v3" ALTER COLUMN "cta_label" SET DEFAULT 'Получить твёрдую смету';
