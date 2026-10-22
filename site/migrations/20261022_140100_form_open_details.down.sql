-- Откат 20261022_140100_form_open_details.
ALTER TABLE "pages_blocks_final_form" DROP COLUMN IF EXISTS "open_details";
ALTER TABLE "_pages_v_blocks_final_form" DROP COLUMN IF EXISTS "open_details";
ALTER TABLE "sub_services_blocks_final_form" DROP COLUMN IF EXISTS "open_details";
ALTER TABLE "_sub_services_v_blocks_final_form" DROP COLUMN IF EXISTS "open_details";
