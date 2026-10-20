-- US-3 DOWN: reverse US-3 schema changes (irreversible for blocks/site_chrome data).
-- Restores prod's pre-US-3 shape: seo_settings organization_* columns +
-- seo_settings_same_as table. DROPs all blocks/rels/site_chrome tables and their
-- enums. After DOWN, any data inserted into those tables is permanently lost.

BEGIN;

-- ───────────── 1. Drop indexes, FKs, PKs via CASCADE on table drops ─────────────
-- (all CREATE INDEX / ALTER TABLE ... ADD CONSTRAINT statements on tables we
--  drop below get removed automatically)

-- ───────────── 2. Drop blocks tables (drafts first — CASCADE for faq→faq_items) ─────────────

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

-- ───────────── 3. Drop rels tables ─────────────

DROP TABLE IF EXISTS public._service_districts_v_rels CASCADE;
DROP TABLE IF EXISTS public.service_districts_rels CASCADE;

-- ───────────── 4. Drop site_chrome tables (children first) ─────────────

DROP TABLE IF EXISTS public.site_chrome_social CASCADE;
DROP TABLE IF EXISTS public.site_chrome_header_menu CASCADE;
DROP TABLE IF EXISTS public.site_chrome_footer_columns_items CASCADE;
DROP TABLE IF EXISTS public.site_chrome_footer_columns CASCADE;
DROP TABLE IF EXISTS public.site_chrome CASCADE;

-- ───────────── 5. Remove SEO/audit columns from service_districts + _v ─────────────

ALTER TABLE public._service_districts_v
    DROP COLUMN IF EXISTS version_seo_title,
    DROP COLUMN IF EXISTS version_seo_description,
    DROP COLUMN IF EXISTS version_seo_h1,
    DROP COLUMN IF EXISTS version_canonical_override,
    DROP COLUMN IF EXISTS version_robots,
    DROP COLUMN IF EXISTS version_og_image_id,
    DROP COLUMN IF EXISTS version_last_reviewed_at,
    DROP COLUMN IF EXISTS version_reviewed_by_id;

ALTER TABLE public.service_districts
    DROP COLUMN IF EXISTS seo_title,
    DROP COLUMN IF EXISTS seo_description,
    DROP COLUMN IF EXISTS seo_h1,
    DROP COLUMN IF EXISTS canonical_override,
    DROP COLUMN IF EXISTS robots,
    DROP COLUMN IF EXISTS og_image_id,
    DROP COLUMN IF EXISTS last_reviewed_at,
    DROP COLUMN IF EXISTS reviewed_by_id;

-- ───────────── 6. Drop ENUM types ─────────────

DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_cta_banner_accent;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_lead_form_variant;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_text_content_columns;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_hero_seasonal_theme;
DROP TYPE IF EXISTS public.enum__service_districts_v_version_robots;

DROP TYPE IF EXISTS public.enum_service_districts_blocks_cta_banner_accent;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_lead_form_variant;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_text_content_columns;
DROP TYPE IF EXISTS public.enum_service_districts_blocks_hero_seasonal_theme;
DROP TYPE IF EXISTS public.enum_service_districts_robots;

DROP TYPE IF EXISTS public.enum_site_chrome_social_type;
DROP TYPE IF EXISTS public.enum_site_chrome_footer_columns_items_kind;
DROP TYPE IF EXISTS public.enum_site_chrome_header_menu_kind;
DROP TYPE IF EXISTS public.enum_site_chrome_header_cta_kind;

-- ───────────── 7. Restore dropped seo_settings organization_* columns ─────────────

ALTER TABLE public.seo_settings
    ADD COLUMN IF NOT EXISTS organization_legal_name character varying DEFAULT 'Общество с ограниченной ответственностью «Обиход»'::character varying,
    ADD COLUMN IF NOT EXISTS organization_tax_id character varying DEFAULT '7847729123'::character varying,
    ADD COLUMN IF NOT EXISTS organization_ogrn character varying,
    ADD COLUMN IF NOT EXISTS organization_address_region character varying DEFAULT 'Санкт-Петербург'::character varying,
    ADD COLUMN IF NOT EXISTS organization_address_locality character varying DEFAULT 'Санкт-Петербург'::character varying,
    ADD COLUMN IF NOT EXISTS organization_street_address character varying,
    ADD COLUMN IF NOT EXISTS organization_postal_code character varying,
    ADD COLUMN IF NOT EXISTS organization_telephone character varying,
    ADD COLUMN IF NOT EXISTS organization_founding_date timestamp(3) with time zone;

-- ───────────── 8. Restore seo_settings_same_as table + indexes + FK ─────────────

CREATE TABLE IF NOT EXISTS public.seo_settings_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    url character varying NOT NULL
);

ALTER TABLE ONLY public.seo_settings_same_as
    ADD CONSTRAINT seo_settings_same_as_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.seo_settings_same_as
    ADD CONSTRAINT seo_settings_same_as_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.seo_settings(id) ON DELETE CASCADE;
CREATE INDEX seo_settings_same_as_order_idx     ON public.seo_settings_same_as USING btree (_order);
CREATE INDEX seo_settings_same_as_parent_id_idx ON public.seo_settings_same_as USING btree (_parent_id);

COMMIT;
