-- Блок «Финальная форма»: «Сразу показывать фото и описание задачи» (план 09, этап 2). Expand.
ALTER TABLE "pages_blocks_final_form" ADD COLUMN IF NOT EXISTS "open_details" boolean DEFAULT false;
ALTER TABLE "_pages_v_blocks_final_form" ADD COLUMN IF NOT EXISTS "open_details" boolean DEFAULT false;
ALTER TABLE "sub_services_blocks_final_form" ADD COLUMN IF NOT EXISTS "open_details" boolean DEFAULT false;
ALTER TABLE "_sub_services_v_blocks_final_form" ADD COLUMN IF NOT EXISTS "open_details" boolean DEFAULT false;
