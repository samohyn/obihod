-- US-3 DOWN: drop blocks tables/enums (irreversible for data)

BEGIN;

DROP TABLE IF EXISTS public._service_districts_v_blocks_faq_items CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_faq CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_cta_banner CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_lead_form CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_text_content CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_hero CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_faq_items CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_faq CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_cta_banner CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_lead_form CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_text_content CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_hero CASCADE;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_cta_banner_accent;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_lead_form_variant;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_text_content_columns;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_hero_seasonal_theme;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_cta_banner_accent;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_lead_form_variant;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_text_content_columns;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_hero_seasonal_theme;

COMMIT;
