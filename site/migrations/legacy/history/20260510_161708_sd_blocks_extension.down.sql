-- DOWN migration для C2.6 — drop 6 SD blocks tables (reverse order, CASCADE).
--
-- Order: (1) array sub-tables → (2) main block tables → (3) sequences →
--        (4) enum types.  CASCADE подчищает зависимые objects.

BEGIN;

-- 1. Drop array sub-tables первыми (children FK на main)

-- drafts
DROP TABLE IF EXISTS public._service_districts_v_blocks_breadcrumbs_items                  CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_pricing_table_tiers_features       CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_pricing_table_tiers                CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_process_steps_steps                CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_neighbor_districts_items           CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_related_services_items             CASCADE;

-- published
DROP TABLE IF EXISTS public.service_districts_blocks_breadcrumbs_items                     CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_pricing_table_tiers_features          CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_pricing_table_tiers                   CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_process_steps_steps                   CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_neighbor_districts_items              CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_related_services_items                CASCADE;

-- 2. Drop main block tables

-- drafts
DROP TABLE IF EXISTS public._service_districts_v_blocks_breadcrumbs                        CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_tldr                               CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_pricing_table                      CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_process_steps                      CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_neighbor_districts                 CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_related_services                   CASCADE;

-- published
DROP TABLE IF EXISTS public.service_districts_blocks_breadcrumbs                           CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_tldr                                  CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_pricing_table                         CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_process_steps                         CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_neighbor_districts                    CASCADE;
DROP TABLE IF EXISTS public.service_districts_blocks_related_services                      CASCADE;

-- 3. Sequences (если CASCADE не подтянул)
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_breadcrumbs_id_seq                  CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_breadcrumbs_items_id_seq            CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_tldr_id_seq                         CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_pricing_table_id_seq               CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_pricing_table_tiers_id_seq         CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_pricing_table_tiers_features_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_process_steps_id_seq               CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_process_steps_steps_id_seq         CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_neighbor_districts_id_seq          CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_neighbor_districts_items_id_seq    CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_related_services_id_seq            CASCADE;
DROP SEQUENCE IF EXISTS public._service_districts_v_blocks_related_services_items_id_seq      CASCADE;

-- 4. Enums
DROP TYPE IF EXISTS public.enum_service_districts_blocks_pricing_table_variant     CASCADE;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_pricing_table_variant  CASCADE;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_process_steps_layout      CASCADE;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_process_steps_layout   CASCADE;

COMMIT;
