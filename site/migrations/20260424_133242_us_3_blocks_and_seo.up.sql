-- US-3 UP: ServiceDistricts blocks + SEO fields + SiteChrome global + polymorphic rels
-- Extracted/reconciled from pg_dump of local US-3 schema vs. prod-dump 2026-04-24 15:21 UTC.
-- Prod-state at time of authoring: fully empty (0 rows in every business table,
-- 0 entries in payload_migrations). All destructive operations below are safe.
--
-- Scope summary:
--   • 12 new blocks tables (6 published + 6 drafts) + 8 block-enums + indexes + FKs
--   • 2 new polymorphic rels tables (service_districts_rels, _service_districts_v_rels)
--   • 5 new site_chrome tables (global) + 4 enums + indexes + FKs
--   • 8 new columns on service_districts (seo + og + audit) + 2 FKs + 2 indexes
--   • 8 new version_* columns on _service_districts_v + 2 FKs + 2 indexes + 1 enum
--   • DROP stale prod artefacts: seo_settings_same_as table, 9 organization_* columns
--     on seo_settings (migrated into site_chrome.requisites_* + persons schema, ADR-0002)

BEGIN;

-- ───────────────────────────── 1. Drop stale prod artefacts ─────────────────────────────
-- seo_settings_same_as on prod was created by an earlier db.push; the current
-- collections model stores sameAs inside organization_schema_override JSON instead.
-- Table is empty on prod; CASCADE removes 2 indexes + 1 FK + 1 PK automatically.

DROP TABLE IF EXISTS public.seo_settings_same_as CASCADE;

-- seo_settings organization_* columns dropped per ADR-0002 (SEO×SiteChrome dedup).
-- All values now live in persons (Organization schema) and site_chrome.requisites_*.

ALTER TABLE public.seo_settings
    DROP COLUMN IF EXISTS organization_legal_name,
    DROP COLUMN IF EXISTS organization_tax_id,
    DROP COLUMN IF EXISTS organization_ogrn,
    DROP COLUMN IF EXISTS organization_address_region,
    DROP COLUMN IF EXISTS organization_address_locality,
    DROP COLUMN IF EXISTS organization_street_address,
    DROP COLUMN IF EXISTS organization_postal_code,
    DROP COLUMN IF EXISTS organization_telephone,
    DROP COLUMN IF EXISTS organization_founding_date;

-- ───────────────────────────── 2. New ENUM types ─────────────────────────────

CREATE TYPE public.enum_service_districts_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);

CREATE TYPE public.enum__service_districts_v_version_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);

CREATE TYPE public.enum_service_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_service_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_service_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_service_districts_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__service_districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__service_districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__service_districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__service_districts_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_site_chrome_header_cta_kind AS ENUM (
    'anchor',
    'route',
    'external'
);

CREATE TYPE public.enum_site_chrome_header_menu_kind AS ENUM (
    'anchor',
    'route',
    'external'
);

CREATE TYPE public.enum_site_chrome_footer_columns_items_kind AS ENUM (
    'anchor',
    'route',
    'external'
);

CREATE TYPE public.enum_site_chrome_social_type AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'vk',
    'youtube',
    'dzen',
    'rutube',
    'telegram_channel'
);

-- ───────────────────────────── 3. service_districts — SEO + audit columns ─────────────────────────────

ALTER TABLE public.service_districts
    ADD COLUMN seo_title character varying,
    ADD COLUMN seo_description character varying,
    ADD COLUMN seo_h1 character varying,
    ADD COLUMN canonical_override character varying,
    ADD COLUMN robots public.enum_service_districts_robots DEFAULT 'index,follow'::public.enum_service_districts_robots,
    ADD COLUMN og_image_id integer,
    ADD COLUMN last_reviewed_at timestamp(3) with time zone,
    ADD COLUMN reviewed_by_id integer;

ALTER TABLE public._service_districts_v
    ADD COLUMN version_seo_title character varying,
    ADD COLUMN version_seo_description character varying,
    ADD COLUMN version_seo_h1 character varying,
    ADD COLUMN version_canonical_override character varying,
    ADD COLUMN version_robots public.enum__service_districts_v_version_robots DEFAULT 'index,follow'::public.enum__service_districts_v_version_robots,
    ADD COLUMN version_og_image_id integer,
    ADD COLUMN version_last_reviewed_at timestamp(3) with time zone,
    ADD COLUMN version_reviewed_by_id integer;

-- ───────────────────────────── 4. Polymorphic relationships tables ─────────────────────────────

CREATE TABLE public.service_districts_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);

CREATE SEQUENCE public.service_districts_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.service_districts_rels_id_seq OWNED BY public.service_districts_rels.id;
ALTER TABLE ONLY public.service_districts_rels ALTER COLUMN id SET DEFAULT nextval('public.service_districts_rels_id_seq'::regclass);

CREATE TABLE public._service_districts_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);

CREATE SEQUENCE public._service_districts_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_rels_id_seq OWNED BY public._service_districts_v_rels.id;
ALTER TABLE ONLY public._service_districts_v_rels ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_rels_id_seq'::regclass);

-- ───────────────────────────── 5. Blocks tables (published) ─────────────────────────────

CREATE TABLE public.service_districts_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    subtitle character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    seasonal_theme public.enum_service_districts_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_service_districts_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_service_districts_blocks_text_content_columns DEFAULT '1'::public.enum_service_districts_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum_service_districts_blocks_lead_form_variant DEFAULT 'short'::public.enum_service_districts_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_cta_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    body jsonb,
    cta_label character varying,
    cta_href character varying,
    accent public.enum_service_districts_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_service_districts_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Частые вопросы'::character varying,
    generate_faq_page_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

-- ───────────────────────────── 6. Blocks tables (drafts) ─────────────────────────────

CREATE TABLE public._service_districts_v_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    subtitle character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    seasonal_theme public.enum__service_districts_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__service_districts_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__service_districts_v_blocks_text_content_columns DEFAULT '1'::public.enum__service_districts_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum__service_districts_v_blocks_lead_form_variant DEFAULT 'short'::public.enum__service_districts_v_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_cta_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    body jsonb,
    cta_label character varying,
    cta_href character varying,
    accent public.enum__service_districts_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__service_districts_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Частые вопросы'::character varying,
    generate_faq_page_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

-- ───────────────────────────── 7. Blocks sequences (drafts-only, integer id) ─────────────────────────────

CREATE SEQUENCE public._service_districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_hero_id_seq OWNED BY public._service_districts_v_blocks_hero.id;
ALTER SEQUENCE public._service_districts_v_blocks_text_content_id_seq OWNED BY public._service_districts_v_blocks_text_content.id;
ALTER SEQUENCE public._service_districts_v_blocks_lead_form_id_seq OWNED BY public._service_districts_v_blocks_lead_form.id;
ALTER SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq OWNED BY public._service_districts_v_blocks_cta_banner.id;
ALTER SEQUENCE public._service_districts_v_blocks_faq_id_seq OWNED BY public._service_districts_v_blocks_faq.id;
ALTER SEQUENCE public._service_districts_v_blocks_faq_items_id_seq OWNED BY public._service_districts_v_blocks_faq_items.id;

ALTER TABLE ONLY public._service_districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_hero_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_text_content_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_lead_form_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_cta_banner_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_items_id_seq'::regclass);

-- ───────────────────────────── 8. site_chrome global ─────────────────────────────

CREATE TABLE public.site_chrome (
    id integer NOT NULL,
    header_cta_label character varying DEFAULT 'Замер бесплатно'::character varying,
    header_cta_kind public.enum_site_chrome_header_cta_kind DEFAULT 'anchor'::public.enum_site_chrome_header_cta_kind,
    header_cta_anchor character varying DEFAULT 'calc'::character varying,
    header_cta_route character varying,
    header_cta_url character varying,
    footer_slogan character varying,
    footer_privacy_url character varying DEFAULT '/politika-konfidentsialnosti/'::character varying,
    footer_oferta_url character varying DEFAULT '/oferta/'::character varying,
    footer_copyright_prefix character varying DEFAULT '© Обиход,'::character varying,
    contacts_phone_display character varying DEFAULT '+7 (985) 170-51-11'::character varying NOT NULL,
    contacts_phone_e164 character varying DEFAULT '+79851705111'::character varying NOT NULL,
    contacts_email character varying,
    requisites_legal_name character varying,
    requisites_tax_id character varying DEFAULT '7847729123'::character varying NOT NULL,
    requisites_kpp character varying,
    requisites_ogrn character varying,
    requisites_address_region character varying,
    requisites_address_locality character varying,
    requisites_street_address character varying,
    requisites_postal_code character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);

CREATE SEQUENCE public.site_chrome_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.site_chrome_id_seq OWNED BY public.site_chrome.id;
ALTER TABLE ONLY public.site_chrome ALTER COLUMN id SET DEFAULT nextval('public.site_chrome_id_seq'::regclass);

CREATE TABLE public.site_chrome_footer_columns (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL
);

CREATE TABLE public.site_chrome_footer_columns_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    kind public.enum_site_chrome_footer_columns_items_kind DEFAULT 'anchor'::public.enum_site_chrome_footer_columns_items_kind NOT NULL,
    label character varying NOT NULL,
    anchor character varying,
    route character varying,
    url character varying
);

CREATE TABLE public.site_chrome_header_menu (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    kind public.enum_site_chrome_header_menu_kind DEFAULT 'anchor'::public.enum_site_chrome_header_menu_kind NOT NULL,
    label character varying NOT NULL,
    anchor character varying,
    route character varying,
    url character varying
);

CREATE TABLE public.site_chrome_social (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    type public.enum_site_chrome_social_type NOT NULL,
    url character varying NOT NULL
);

-- ───────────────────────────── 9. Primary keys ─────────────────────────────

ALTER TABLE ONLY public.service_districts_blocks_hero        ADD CONSTRAINT service_districts_blocks_hero_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_districts_blocks_text_content ADD CONSTRAINT service_districts_blocks_text_content_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_districts_blocks_lead_form   ADD CONSTRAINT service_districts_blocks_lead_form_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_districts_blocks_cta_banner  ADD CONSTRAINT service_districts_blocks_cta_banner_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_districts_blocks_faq         ADD CONSTRAINT service_districts_blocks_faq_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.service_districts_blocks_faq_items   ADD CONSTRAINT service_districts_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_hero        ADD CONSTRAINT _service_districts_v_blocks_hero_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_blocks_text_content ADD CONSTRAINT _service_districts_v_blocks_text_content_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_blocks_lead_form   ADD CONSTRAINT _service_districts_v_blocks_lead_form_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner  ADD CONSTRAINT _service_districts_v_blocks_cta_banner_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_blocks_faq         ADD CONSTRAINT _service_districts_v_blocks_faq_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_blocks_faq_items   ADD CONSTRAINT _service_districts_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_rels    ADD CONSTRAINT service_districts_rels_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._service_districts_v_rels ADD CONSTRAINT _service_districts_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome                        ADD CONSTRAINT site_chrome_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.site_chrome_footer_columns         ADD CONSTRAINT site_chrome_footer_columns_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.site_chrome_footer_columns_items   ADD CONSTRAINT site_chrome_footer_columns_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.site_chrome_header_menu            ADD CONSTRAINT site_chrome_header_menu_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.site_chrome_social                 ADD CONSTRAINT site_chrome_social_pkey PRIMARY KEY (id);

-- ───────────────────────────── 10. Foreign keys ─────────────────────────────

-- service_districts SEO/audit FKs
ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_reviewed_by_id_persons_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.persons(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_reviewed_by_id_persons_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.persons(id) ON DELETE SET NULL;

-- blocks FKs (published)
ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_faq(id) ON DELETE CASCADE;

-- blocks FKs (drafts)
ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_faq(id) ON DELETE CASCADE;

-- rels FKs
ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

-- site_chrome FKs
ALTER TABLE ONLY public.site_chrome_footer_columns
    ADD CONSTRAINT site_chrome_footer_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.site_chrome_footer_columns_items
    ADD CONSTRAINT site_chrome_footer_columns_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome_footer_columns(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.site_chrome_header_menu
    ADD CONSTRAINT site_chrome_header_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.site_chrome_social
    ADD CONSTRAINT site_chrome_social_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;

-- ───────────────────────────── 11. Indexes ─────────────────────────────

-- service_districts new indexes
CREATE INDEX service_districts_og_image_idx    ON public.service_districts USING btree (og_image_id);
CREATE INDEX service_districts_reviewed_by_idx ON public.service_districts USING btree (reviewed_by_id);
CREATE INDEX _service_districts_v_version_version_og_image_idx    ON public._service_districts_v USING btree (version_og_image_id);
CREATE INDEX _service_districts_v_version_version_reviewed_by_idx ON public._service_districts_v USING btree (version_reviewed_by_id);

-- blocks indexes (published)
CREATE INDEX service_districts_blocks_hero_image_idx       ON public.service_districts_blocks_hero USING btree (image_id);
CREATE INDEX service_districts_blocks_hero_order_idx       ON public.service_districts_blocks_hero USING btree (_order);
CREATE INDEX service_districts_blocks_hero_parent_id_idx   ON public.service_districts_blocks_hero USING btree (_parent_id);
CREATE INDEX service_districts_blocks_hero_path_idx        ON public.service_districts_blocks_hero USING btree (_path);

CREATE INDEX service_districts_blocks_text_content_order_idx     ON public.service_districts_blocks_text_content USING btree (_order);
CREATE INDEX service_districts_blocks_text_content_parent_id_idx ON public.service_districts_blocks_text_content USING btree (_parent_id);
CREATE INDEX service_districts_blocks_text_content_path_idx      ON public.service_districts_blocks_text_content USING btree (_path);

CREATE INDEX service_districts_blocks_lead_form_order_idx     ON public.service_districts_blocks_lead_form USING btree (_order);
CREATE INDEX service_districts_blocks_lead_form_parent_id_idx ON public.service_districts_blocks_lead_form USING btree (_parent_id);
CREATE INDEX service_districts_blocks_lead_form_path_idx      ON public.service_districts_blocks_lead_form USING btree (_path);

CREATE INDEX service_districts_blocks_cta_banner_order_idx     ON public.service_districts_blocks_cta_banner USING btree (_order);
CREATE INDEX service_districts_blocks_cta_banner_parent_id_idx ON public.service_districts_blocks_cta_banner USING btree (_parent_id);
CREATE INDEX service_districts_blocks_cta_banner_path_idx      ON public.service_districts_blocks_cta_banner USING btree (_path);

CREATE INDEX service_districts_blocks_faq_order_idx     ON public.service_districts_blocks_faq USING btree (_order);
CREATE INDEX service_districts_blocks_faq_parent_id_idx ON public.service_districts_blocks_faq USING btree (_parent_id);
CREATE INDEX service_districts_blocks_faq_path_idx      ON public.service_districts_blocks_faq USING btree (_path);

CREATE INDEX service_districts_blocks_faq_items_order_idx     ON public.service_districts_blocks_faq_items USING btree (_order);
CREATE INDEX service_districts_blocks_faq_items_parent_id_idx ON public.service_districts_blocks_faq_items USING btree (_parent_id);

-- blocks indexes (drafts)
CREATE INDEX _service_districts_v_blocks_hero_image_idx       ON public._service_districts_v_blocks_hero USING btree (image_id);
CREATE INDEX _service_districts_v_blocks_hero_order_idx       ON public._service_districts_v_blocks_hero USING btree (_order);
CREATE INDEX _service_districts_v_blocks_hero_parent_id_idx   ON public._service_districts_v_blocks_hero USING btree (_parent_id);
CREATE INDEX _service_districts_v_blocks_hero_path_idx        ON public._service_districts_v_blocks_hero USING btree (_path);

CREATE INDEX _service_districts_v_blocks_text_content_order_idx     ON public._service_districts_v_blocks_text_content USING btree (_order);
CREATE INDEX _service_districts_v_blocks_text_content_parent_id_idx ON public._service_districts_v_blocks_text_content USING btree (_parent_id);
CREATE INDEX _service_districts_v_blocks_text_content_path_idx      ON public._service_districts_v_blocks_text_content USING btree (_path);

CREATE INDEX _service_districts_v_blocks_lead_form_order_idx     ON public._service_districts_v_blocks_lead_form USING btree (_order);
CREATE INDEX _service_districts_v_blocks_lead_form_parent_id_idx ON public._service_districts_v_blocks_lead_form USING btree (_parent_id);
CREATE INDEX _service_districts_v_blocks_lead_form_path_idx      ON public._service_districts_v_blocks_lead_form USING btree (_path);

CREATE INDEX _service_districts_v_blocks_cta_banner_order_idx     ON public._service_districts_v_blocks_cta_banner USING btree (_order);
CREATE INDEX _service_districts_v_blocks_cta_banner_parent_id_idx ON public._service_districts_v_blocks_cta_banner USING btree (_parent_id);
CREATE INDEX _service_districts_v_blocks_cta_banner_path_idx      ON public._service_districts_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _service_districts_v_blocks_faq_order_idx     ON public._service_districts_v_blocks_faq USING btree (_order);
CREATE INDEX _service_districts_v_blocks_faq_parent_id_idx ON public._service_districts_v_blocks_faq USING btree (_parent_id);
CREATE INDEX _service_districts_v_blocks_faq_path_idx      ON public._service_districts_v_blocks_faq USING btree (_path);

CREATE INDEX _service_districts_v_blocks_faq_items_order_idx     ON public._service_districts_v_blocks_faq_items USING btree (_order);
CREATE INDEX _service_districts_v_blocks_faq_items_parent_id_idx ON public._service_districts_v_blocks_faq_items USING btree (_parent_id);

-- rels indexes
CREATE INDEX service_districts_rels_order_idx       ON public.service_districts_rels USING btree ("order");
CREATE INDEX service_districts_rels_parent_idx      ON public.service_districts_rels USING btree (parent_id);
CREATE INDEX service_districts_rels_path_idx        ON public.service_districts_rels USING btree (path);
CREATE INDEX service_districts_rels_services_id_idx ON public.service_districts_rels USING btree (services_id);

CREATE INDEX _service_districts_v_rels_order_idx       ON public._service_districts_v_rels USING btree ("order");
CREATE INDEX _service_districts_v_rels_parent_idx      ON public._service_districts_v_rels USING btree (parent_id);
CREATE INDEX _service_districts_v_rels_path_idx        ON public._service_districts_v_rels USING btree (path);
CREATE INDEX _service_districts_v_rels_services_id_idx ON public._service_districts_v_rels USING btree (services_id);

-- site_chrome indexes
CREATE INDEX site_chrome_footer_columns_order_idx            ON public.site_chrome_footer_columns USING btree (_order);
CREATE INDEX site_chrome_footer_columns_parent_id_idx        ON public.site_chrome_footer_columns USING btree (_parent_id);
CREATE INDEX site_chrome_footer_columns_items_order_idx      ON public.site_chrome_footer_columns_items USING btree (_order);
CREATE INDEX site_chrome_footer_columns_items_parent_id_idx  ON public.site_chrome_footer_columns_items USING btree (_parent_id);
CREATE INDEX site_chrome_header_menu_order_idx               ON public.site_chrome_header_menu USING btree (_order);
CREATE INDEX site_chrome_header_menu_parent_id_idx           ON public.site_chrome_header_menu USING btree (_parent_id);
CREATE INDEX site_chrome_social_order_idx                    ON public.site_chrome_social USING btree (_order);
CREATE INDEX site_chrome_social_parent_id_idx                ON public.site_chrome_social USING btree (_parent_id);

COMMIT;
