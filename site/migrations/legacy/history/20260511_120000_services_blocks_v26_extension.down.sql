-- DOWN — reverse order: nested tables → parent tables → enums.
-- DROP CASCADE покрывает FK; IF EXISTS делает idempotent.

DROP TABLE IF EXISTS public._services_v_blocks_process_steps_steps CASCADE;
DROP TABLE IF EXISTS public._services_v_blocks_process_steps CASCADE;
DROP TABLE IF EXISTS public._services_v_blocks_pricing_table_tiers_features CASCADE;
DROP TABLE IF EXISTS public._services_v_blocks_pricing_table_tiers CASCADE;
DROP TABLE IF EXISTS public._services_v_blocks_pricing_table CASCADE;

DROP TABLE IF EXISTS public.services_blocks_process_steps_steps CASCADE;
DROP TABLE IF EXISTS public.services_blocks_process_steps CASCADE;
DROP TABLE IF EXISTS public.services_blocks_pricing_table_tiers_features CASCADE;
DROP TABLE IF EXISTS public.services_blocks_pricing_table_tiers CASCADE;
DROP TABLE IF EXISTS public.services_blocks_pricing_table CASCADE;

DROP TYPE IF EXISTS public.enum__services_v_blocks_process_steps_layout;
DROP TYPE IF EXISTS public.enum_services_blocks_process_steps_layout;
DROP TYPE IF EXISTS public.enum__services_v_blocks_pricing_table_variant;
DROP TYPE IF EXISTS public.enum_services_blocks_pricing_table_variant;
