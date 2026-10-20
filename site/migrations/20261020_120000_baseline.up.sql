-- Базовая миграция: полная схема БД на 20.10.2026 (план 09, этап 1 — «Дрейф схемы»).
-- pg_dump --schema-only копии схемы прода после migrations/legacy/sync-to-baseline.sql;
-- служебные SET/\restrict убраны. Совпадает с payload.config.ts: `pnpm schema:diff --check`.
-- На новой БД создаёт всё с нуля; на старой не выполняется (scripts/migrate.ts отмечает её применённой).

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE TYPE public.enum__authors_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__authors_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__authors_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__authors_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);

CREATE TYPE public.enum__authors_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__b2b_pages_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__b2b_pages_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__b2b_pages_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__b2b_pages_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__b2b_pages_v_version_audience AS ENUM (
    'uk',
    'tszh',
    'uk-tszh',
    'fm',
    'zastroyshchik',
    'gostorgi'
);

CREATE TYPE public.enum__b2b_pages_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive'
);

CREATE TYPE public.enum__b2b_pages_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__blog_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__blog_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__blog_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__blog_v_version_category AS ENUM (
    'arbo',
    'sneg',
    'musor',
    'demontazh',
    'b2b',
    'regulyatorika',
    'evergreen'
);

CREATE TYPE public.enum__blog_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum__blog_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__cases_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__cases_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__cases_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__cases_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum__cases_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__districts_v_version_landmarks_type AS ENUM (
    'kp',
    'mkr',
    'snt',
    'object'
);

CREATE TYPE public.enum__districts_v_version_priority AS ENUM (
    'A',
    'B',
    'C'
);

CREATE TYPE public.enum__districts_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);

CREATE TYPE public.enum__districts_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__reviews_v_version_source AS ENUM (
    'yandex_maps',
    'yandex_business',
    'twogis',
    'avito',
    'site_form',
    'direct',
    'other'
);

CREATE TYPE public.enum__reviews_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__service_districts_v_blocks_calculator_placeholder_svc_t AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);

CREATE TYPE public.enum__service_districts_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__service_districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__service_districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__service_districts_v_blocks_pricing_table_variant AS ENUM (
    'tiers',
    'list',
    'per-district'
);

CREATE TYPE public.enum__service_districts_v_blocks_process_steps_layout AS ENUM (
    'vertical',
    'horizontal'
);

CREATE TYPE public.enum__service_districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__service_districts_v_version_publish_status AS ENUM (
    'draft',
    'review',
    'published',
    'archived'
);

CREATE TYPE public.enum__service_districts_v_version_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);

CREATE TYPE public.enum__service_districts_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum__services_v_blocks_calculator_placeholder_svc_t AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);

CREATE TYPE public.enum__services_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__services_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__services_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__services_v_blocks_pricing_table_variant AS ENUM (
    'tiers',
    'list',
    'per-district'
);

CREATE TYPE public.enum__services_v_blocks_process_steps_layout AS ENUM (
    'vertical',
    'horizontal'
);

CREATE TYPE public.enum__services_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__services_v_version_price_unit AS ENUM (
    'object',
    'tree',
    'm3',
    'shift',
    'm2'
);

CREATE TYPE public.enum__services_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum__services_v_version_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_authors_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_authors_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_authors_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_authors_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);

CREATE TYPE public.enum_authors_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_b2b_pages_audience AS ENUM (
    'uk',
    'tszh',
    'uk-tszh',
    'fm',
    'zastroyshchik',
    'gostorgi'
);

CREATE TYPE public.enum_b2b_pages_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_b2b_pages_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_b2b_pages_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_b2b_pages_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_b2b_pages_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive'
);

CREATE TYPE public.enum_b2b_pages_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_blog_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_blog_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_blog_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_blog_category AS ENUM (
    'arbo',
    'sneg',
    'musor',
    'demontazh',
    'b2b',
    'regulyatorika',
    'evergreen'
);

CREATE TYPE public.enum_blog_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum_blog_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_cases_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_cases_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_cases_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_cases_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum_cases_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_districts_landmarks_type AS ENUM (
    'kp',
    'mkr',
    'snt',
    'object'
);

CREATE TYPE public.enum_districts_priority AS ENUM (
    'A',
    'B',
    'C'
);

CREATE TYPE public.enum_districts_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);

CREATE TYPE public.enum_districts_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_leads_preferred_channel AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'phone'
);

CREATE TYPE public.enum_leads_status AS ENUM (
    'new',
    'contacted',
    'smeta',
    'brigade',
    'done',
    'cancelled',
    'spam'
);

CREATE TYPE public.enum_media_license AS ENUM (
    'proprietary',
    'cc-by',
    'public-domain'
);

CREATE TYPE public.enum_redirects_status_code AS ENUM (
    '301',
    '302',
    '410'
);

CREATE TYPE public.enum_reviews_source AS ENUM (
    'yandex_maps',
    'yandex_business',
    'twogis',
    'avito',
    'site_form',
    'direct',
    'other'
);

CREATE TYPE public.enum_reviews_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_rum_metrics_ab_variant AS ENUM (
    'v1',
    'v2'
);

CREATE TYPE public.enum_rum_metrics_name AS ENUM (
    'LCP',
    'CLS',
    'INP',
    'FID',
    'TTFB',
    'FCP'
);

CREATE TYPE public.enum_rum_metrics_navigation_type AS ENUM (
    'navigate',
    'reload',
    'back-forward',
    'back-forward-cache',
    'prerender'
);

CREATE TYPE public.enum_rum_metrics_rating AS ENUM (
    'good',
    'needs-improvement',
    'poor'
);

CREATE TYPE public.enum_service_districts_blocks_calculator_placeholder_svc_t AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);

CREATE TYPE public.enum_service_districts_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_service_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_service_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_service_districts_blocks_pricing_table_variant AS ENUM (
    'tiers',
    'list',
    'per-district'
);

CREATE TYPE public.enum_service_districts_blocks_process_steps_layout AS ENUM (
    'vertical',
    'horizontal'
);

CREATE TYPE public.enum_service_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_service_districts_publish_status AS ENUM (
    'draft',
    'review',
    'published',
    'archived'
);

CREATE TYPE public.enum_service_districts_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);

CREATE TYPE public.enum_service_districts_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_services_blocks_calculator_placeholder_svc_t AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);

CREATE TYPE public.enum_services_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum_services_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_services_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_services_blocks_pricing_table_variant AS ENUM (
    'tiers',
    'list',
    'per-district'
);

CREATE TYPE public.enum_services_blocks_process_steps_layout AS ENUM (
    'vertical',
    'horizontal'
);

CREATE TYPE public.enum_services_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_services_price_unit AS ENUM (
    'object',
    'tree',
    'm3',
    'shift',
    'm2'
);

CREATE TYPE public.enum_services_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);

CREATE TYPE public.enum_services_status AS ENUM (
    'draft',
    'published'
);

CREATE TYPE public.enum_site_chrome_footer_columns_items_kind AS ENUM (
    'anchor',
    'route',
    'external'
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

CREATE TYPE public.enum_site_chrome_social_type AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'vk',
    'youtube',
    'yandex-zen',
    'other'
);

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'manager',
    'seo',
    'content'
);

CREATE TABLE public._authors_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_first_name character varying,
    version_last_name character varying,
    version_full_name character varying,
    version_job_title character varying,
    version_bio character varying,
    version_avatar_id integer,
    version_meta_title character varying,
    version_meta_description character varying,
    version_canonical_override character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__authors_v_version_status DEFAULT 'draft'::public.enum__authors_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);

CREATE TABLE public._authors_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._authors_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_breadcrumbs_id_seq OWNED BY public._authors_v_blocks_breadcrumbs.id;

CREATE TABLE public._authors_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._authors_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_breadcrumbs_items_id_seq OWNED BY public._authors_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._authors_v_blocks_cta_banner (
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
    accent public.enum__authors_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__authors_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._authors_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_cta_banner_id_seq OWNED BY public._authors_v_blocks_cta_banner.id;

CREATE TABLE public._authors_v_blocks_hero (
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
    seasonal_theme public.enum__authors_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__authors_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._authors_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_hero_id_seq OWNED BY public._authors_v_blocks_hero.id;

CREATE TABLE public._authors_v_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._authors_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_related_services_id_seq OWNED BY public._authors_v_blocks_related_services.id;

CREATE TABLE public._authors_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._authors_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_related_services_items_id_seq OWNED BY public._authors_v_blocks_related_services_items.id;

CREATE TABLE public._authors_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__authors_v_blocks_text_content_columns DEFAULT '1'::public.enum__authors_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._authors_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_blocks_text_content_id_seq OWNED BY public._authors_v_blocks_text_content.id;

CREATE SEQUENCE public._authors_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_id_seq OWNED BY public._authors_v.id;

CREATE TABLE public._authors_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer
);

CREATE SEQUENCE public._authors_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_rels_id_seq OWNED BY public._authors_v_rels.id;

CREATE TABLE public._authors_v_version_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    issuer character varying,
    issued_at timestamp(3) with time zone,
    _uuid character varying
);

CREATE SEQUENCE public._authors_v_version_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_version_credentials_id_seq OWNED BY public._authors_v_version_credentials.id;

CREATE TABLE public._authors_v_version_knows_about (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    topic character varying,
    _uuid character varying
);

CREATE SEQUENCE public._authors_v_version_knows_about_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_version_knows_about_id_seq OWNED BY public._authors_v_version_knows_about.id;

CREATE TABLE public._authors_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__authors_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._authors_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_version_robots_directives_id_seq OWNED BY public._authors_v_version_robots_directives.id;

CREATE TABLE public._authors_v_version_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._authors_v_version_same_as_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._authors_v_version_same_as_id_seq OWNED BY public._authors_v_version_same_as.id;

CREATE TABLE public._b2b_pages_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_title character varying,
    version_h1 character varying,
    version_meta_title character varying,
    version_meta_description character varying,
    version_audience public.enum__b2b_pages_v_version_audience,
    version_body jsonb,
    version_form_config jsonb,
    version_contract_template_url character varying,
    version_krisha_shtraf boolean DEFAULT true,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__b2b_pages_v_version_status DEFAULT 'draft'::public.enum__b2b_pages_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    version_canonical_override character varying,
    version_breadcrumb_label character varying,
    version_use_template_v2 boolean DEFAULT false
);

CREATE TABLE public._b2b_pages_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_id_seq OWNED BY public._b2b_pages_v_blocks_breadcrumbs.id;

CREATE TABLE public._b2b_pages_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_items_id_seq OWNED BY public._b2b_pages_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._b2b_pages_v_blocks_cta_banner (
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
    accent public.enum__b2b_pages_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__b2b_pages_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_cta_banner_id_seq OWNED BY public._b2b_pages_v_blocks_cta_banner.id;

CREATE TABLE public._b2b_pages_v_blocks_faq (
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

CREATE SEQUENCE public._b2b_pages_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_faq_id_seq OWNED BY public._b2b_pages_v_blocks_faq.id;

CREATE TABLE public._b2b_pages_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_faq_items_id_seq OWNED BY public._b2b_pages_v_blocks_faq_items.id;

CREATE TABLE public._b2b_pages_v_blocks_hero (
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
    seasonal_theme public.enum__b2b_pages_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__b2b_pages_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_hero_id_seq OWNED BY public._b2b_pages_v_blocks_hero.id;

CREATE TABLE public._b2b_pages_v_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum__b2b_pages_v_blocks_lead_form_variant DEFAULT 'short'::public.enum__b2b_pages_v_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_lead_form_id_seq OWNED BY public._b2b_pages_v_blocks_lead_form.id;

CREATE TABLE public._b2b_pages_v_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_mini_case_id_seq OWNED BY public._b2b_pages_v_blocks_mini_case.id;

CREATE TABLE public._b2b_pages_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._b2b_pages_v_blocks_mini_case_inline_facts.id;

CREATE TABLE public._b2b_pages_v_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_services_grid_id_seq OWNED BY public._b2b_pages_v_blocks_services_grid.id;

CREATE TABLE public._b2b_pages_v_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_services_grid_items_id_seq OWNED BY public._b2b_pages_v_blocks_services_grid_items.id;

CREATE TABLE public._b2b_pages_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__b2b_pages_v_blocks_text_content_columns DEFAULT '1'::public.enum__b2b_pages_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_text_content_id_seq OWNED BY public._b2b_pages_v_blocks_text_content.id;

CREATE TABLE public._b2b_pages_v_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._b2b_pages_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_blocks_tldr_id_seq OWNED BY public._b2b_pages_v_blocks_tldr.id;

CREATE SEQUENCE public._b2b_pages_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_id_seq OWNED BY public._b2b_pages_v.id;

CREATE TABLE public._b2b_pages_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    cases_id integer,
    services_id integer
);

CREATE SEQUENCE public._b2b_pages_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_rels_id_seq OWNED BY public._b2b_pages_v_rels.id;

CREATE TABLE public._b2b_pages_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__b2b_pages_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._b2b_pages_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._b2b_pages_v_version_robots_directives_id_seq OWNED BY public._b2b_pages_v_version_robots_directives.id;

CREATE TABLE public._blog_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_title character varying,
    version_h1 character varying,
    version_intro character varying,
    version_body jsonb,
    version_author_id integer,
    version_category public.enum__blog_v_version_category,
    version_published_at timestamp(3) with time zone,
    version_modified_at timestamp(3) with time zone,
    version_hero_image_id integer,
    version_og_image_id integer,
    version_meta_title character varying,
    version_meta_description character varying,
    version_is_how_to boolean DEFAULT false,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__blog_v_version_status DEFAULT 'draft'::public.enum__blog_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean,
    version_canonical_override character varying,
    version_breadcrumb_label character varying,
    version_last_reviewed_at timestamp(3) with time zone,
    version_reviewed_by_id integer
);

CREATE TABLE public._blog_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_breadcrumbs_id_seq OWNED BY public._blog_v_blocks_breadcrumbs.id;

CREATE TABLE public._blog_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._blog_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_breadcrumbs_items_id_seq OWNED BY public._blog_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._blog_v_blocks_cta_banner (
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
    accent public.enum__blog_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__blog_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_cta_banner_id_seq OWNED BY public._blog_v_blocks_cta_banner.id;

CREATE TABLE public._blog_v_blocks_faq (
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

CREATE SEQUENCE public._blog_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_faq_id_seq OWNED BY public._blog_v_blocks_faq.id;

CREATE TABLE public._blog_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._blog_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_faq_items_id_seq OWNED BY public._blog_v_blocks_faq_items.id;

CREATE TABLE public._blog_v_blocks_hero (
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
    seasonal_theme public.enum__blog_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__blog_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_hero_id_seq OWNED BY public._blog_v_blocks_hero.id;

CREATE TABLE public._blog_v_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_related_services_id_seq OWNED BY public._blog_v_blocks_related_services.id;

CREATE TABLE public._blog_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._blog_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_related_services_items_id_seq OWNED BY public._blog_v_blocks_related_services_items.id;

CREATE TABLE public._blog_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__blog_v_blocks_text_content_columns DEFAULT '1'::public.enum__blog_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_text_content_id_seq OWNED BY public._blog_v_blocks_text_content.id;

CREATE TABLE public._blog_v_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._blog_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_blocks_tldr_id_seq OWNED BY public._blog_v_blocks_tldr.id;

CREATE SEQUENCE public._blog_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_id_seq OWNED BY public._blog_v.id;

CREATE TABLE public._blog_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer,
    districts_id integer
);

CREATE SEQUENCE public._blog_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_rels_id_seq OWNED BY public._blog_v_rels.id;

CREATE TABLE public._blog_v_version_faq_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._blog_v_version_faq_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_version_faq_block_id_seq OWNED BY public._blog_v_version_faq_block.id;

CREATE TABLE public._blog_v_version_how_to_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    text jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._blog_v_version_how_to_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_version_how_to_steps_id_seq OWNED BY public._blog_v_version_how_to_steps.id;

CREATE TABLE public._blog_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__blog_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._blog_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._blog_v_version_robots_directives_id_seq OWNED BY public._blog_v_version_robots_directives.id;

CREATE TABLE public._cases_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_title character varying,
    version_h1 character varying,
    version_service_id integer,
    version_district_id integer,
    version_date_completed timestamp(3) with time zone,
    version_description jsonb,
    version_video_url character varying,
    version_video_transcript character varying,
    version_duration_hours numeric,
    version_final_price numeric,
    version_meta_title character varying,
    version_meta_description character varying,
    version_og_image_id integer,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__cases_v_version_status DEFAULT 'draft'::public.enum__cases_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    version_canonical_override character varying,
    version_breadcrumb_label character varying,
    version_last_reviewed_at timestamp(3) with time zone,
    version_reviewed_by_id integer
);

CREATE TABLE public._cases_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_breadcrumbs_id_seq OWNED BY public._cases_v_blocks_breadcrumbs.id;

CREATE TABLE public._cases_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._cases_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_breadcrumbs_items_id_seq OWNED BY public._cases_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._cases_v_blocks_cta_banner (
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
    accent public.enum__cases_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__cases_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_cta_banner_id_seq OWNED BY public._cases_v_blocks_cta_banner.id;

CREATE TABLE public._cases_v_blocks_hero (
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
    seasonal_theme public.enum__cases_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__cases_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_hero_id_seq OWNED BY public._cases_v_blocks_hero.id;

CREATE TABLE public._cases_v_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_mini_case_id_seq OWNED BY public._cases_v_blocks_mini_case.id;

CREATE TABLE public._cases_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._cases_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._cases_v_blocks_mini_case_inline_facts.id;

CREATE TABLE public._cases_v_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_related_services_id_seq OWNED BY public._cases_v_blocks_related_services.id;

CREATE TABLE public._cases_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._cases_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_related_services_items_id_seq OWNED BY public._cases_v_blocks_related_services_items.id;

CREATE TABLE public._cases_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__cases_v_blocks_text_content_columns DEFAULT '1'::public.enum__cases_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._cases_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_blocks_text_content_id_seq OWNED BY public._cases_v_blocks_text_content.id;

CREATE SEQUENCE public._cases_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_id_seq OWNED BY public._cases_v.id;

CREATE TABLE public._cases_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    authors_id integer
);

CREATE SEQUENCE public._cases_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_rels_id_seq OWNED BY public._cases_v_rels.id;

CREATE TABLE public._cases_v_version_photos_after (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    caption character varying,
    _uuid character varying
);

CREATE SEQUENCE public._cases_v_version_photos_after_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_version_photos_after_id_seq OWNED BY public._cases_v_version_photos_after.id;

CREATE TABLE public._cases_v_version_photos_before (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    caption character varying,
    _uuid character varying
);

CREATE SEQUENCE public._cases_v_version_photos_before_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_version_photos_before_id_seq OWNED BY public._cases_v_version_photos_before.id;

CREATE TABLE public._cases_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__cases_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._cases_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._cases_v_version_robots_directives_id_seq OWNED BY public._cases_v_version_robots_directives.id;

CREATE TABLE public._districts_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_name_nominative character varying,
    version_name_prepositional character varying,
    version_name_dative character varying,
    version_name_genitive character varying,
    version_coverage_radius numeric,
    version_distance_from_mkad numeric,
    version_center_geo jsonb,
    version_courts_jurisdiction character varying,
    version_photo_geo_id integer,
    version_priority public.enum__districts_v_version_priority DEFAULT 'B'::public.enum__districts_v_version_priority,
    version_local_price_adjustment numeric DEFAULT 0,
    version_hero_image_id integer,
    version_meta_title character varying,
    version_meta_description character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__districts_v_version_status DEFAULT 'draft'::public.enum__districts_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    version_canonical_override character varying,
    version_breadcrumb_label character varying
);

CREATE TABLE public._districts_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_breadcrumbs_id_seq OWNED BY public._districts_v_blocks_breadcrumbs.id;

CREATE TABLE public._districts_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._districts_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_breadcrumbs_items_id_seq OWNED BY public._districts_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._districts_v_blocks_hero (
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
    seasonal_theme public.enum__districts_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__districts_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_hero_id_seq OWNED BY public._districts_v_blocks_hero.id;

CREATE TABLE public._districts_v_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum__districts_v_blocks_lead_form_variant DEFAULT 'short'::public.enum__districts_v_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_lead_form_id_seq OWNED BY public._districts_v_blocks_lead_form.id;

CREATE TABLE public._districts_v_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_mini_case_id_seq OWNED BY public._districts_v_blocks_mini_case.id;

CREATE TABLE public._districts_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._districts_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._districts_v_blocks_mini_case_inline_facts.id;

CREATE TABLE public._districts_v_blocks_neighbor_districts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Соседние районы'::character varying,
    service_slug character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_neighbor_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_neighbor_districts_id_seq OWNED BY public._districts_v_blocks_neighbor_districts.id;

CREATE TABLE public._districts_v_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    slug character varying,
    distance character varying,
    _uuid character varying
);

CREATE SEQUENCE public._districts_v_blocks_neighbor_districts_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_neighbor_districts_items_id_seq OWNED BY public._districts_v_blocks_neighbor_districts_items.id;

CREATE TABLE public._districts_v_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_services_grid_id_seq OWNED BY public._districts_v_blocks_services_grid.id;

CREATE TABLE public._districts_v_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._districts_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_services_grid_items_id_seq OWNED BY public._districts_v_blocks_services_grid_items.id;

CREATE TABLE public._districts_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__districts_v_blocks_text_content_columns DEFAULT '1'::public.enum__districts_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_text_content_id_seq OWNED BY public._districts_v_blocks_text_content.id;

CREATE TABLE public._districts_v_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._districts_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_blocks_tldr_id_seq OWNED BY public._districts_v_blocks_tldr.id;

CREATE SEQUENCE public._districts_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_id_seq OWNED BY public._districts_v.id;

CREATE TABLE public._districts_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer,
    services_id integer
);

CREATE SEQUENCE public._districts_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_rels_id_seq OWNED BY public._districts_v_rels.id;

CREATE TABLE public._districts_v_version_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    type public.enum__districts_v_version_landmarks_type,
    _uuid character varying
);

CREATE SEQUENCE public._districts_v_version_landmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_version_landmarks_id_seq OWNED BY public._districts_v_version_landmarks.id;

CREATE TABLE public._districts_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__districts_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._districts_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._districts_v_version_robots_directives_id_seq OWNED BY public._districts_v_version_robots_directives.id;

CREATE TABLE public._reviews_v (
    id integer NOT NULL,
    parent_id integer,
    version_author_name character varying,
    version_rating numeric,
    version_text character varying,
    version_date_published timestamp(3) with time zone,
    version_service_id integer,
    version_district_id integer,
    version_source public.enum__reviews_v_version_source,
    version_source_url character varying,
    version_verified boolean DEFAULT false,
    version_pinned_to_homepage boolean DEFAULT false,
    version_priority numeric DEFAULT 0,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__reviews_v_version_status DEFAULT 'draft'::public.enum__reviews_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);

CREATE SEQUENCE public._reviews_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._reviews_v_id_seq OWNED BY public._reviews_v.id;

CREATE TABLE public._service_districts_v (
    id integer NOT NULL,
    parent_id integer,
    version_service_id integer,
    version_district_id integer,
    version_computed_title character varying,
    version_mini_case_id integer,
    version_local_price_note character varying,
    version_lead_paragraph jsonb,
    version_uniqueness_score numeric,
    version_publish_status public.enum__service_districts_v_version_publish_status DEFAULT 'draft'::public.enum__service_districts_v_version_publish_status,
    version_noindex_until_case boolean DEFAULT true,
    version_is_ord_marked boolean DEFAULT false,
    version_erid_token character varying,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__service_districts_v_version_status DEFAULT 'draft'::public.enum__service_districts_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    version_seo_title character varying,
    version_seo_description character varying,
    version_seo_h1 character varying,
    version_canonical_override character varying,
    version_robots public.enum__service_districts_v_version_robots DEFAULT 'index,follow'::public.enum__service_districts_v_version_robots,
    version_og_image_id integer,
    version_last_reviewed_at timestamp(3) with time zone,
    version_reviewed_by_id integer,
    version_sub_service_slug character varying,
    version_use_template_v2 boolean DEFAULT false
);

CREATE TABLE public._service_districts_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_breadcrumbs_id_seq OWNED BY public._service_districts_v_blocks_breadcrumbs.id;

CREATE TABLE public._service_districts_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_breadcrumbs_items_id_seq OWNED BY public._service_districts_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._service_districts_v_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum__service_districts_v_blocks_calculator_placeholder_svc_t,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_calculator_placeholder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_calculator_placeholder_id_seq OWNED BY public._service_districts_v_blocks_calculator_placeholder.id;

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

CREATE SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq OWNED BY public._service_districts_v_blocks_cta_banner.id;

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

CREATE SEQUENCE public._service_districts_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_faq_id_seq OWNED BY public._service_districts_v_blocks_faq.id;

CREATE TABLE public._service_districts_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_faq_items_id_seq OWNED BY public._service_districts_v_blocks_faq_items.id;

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

CREATE SEQUENCE public._service_districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_hero_id_seq OWNED BY public._service_districts_v_blocks_hero.id;

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

CREATE SEQUENCE public._service_districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_lead_form_id_seq OWNED BY public._service_districts_v_blocks_lead_form.id;

CREATE TABLE public._service_districts_v_blocks_neighbor_districts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Соседние районы'::character varying,
    service_slug character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_neighbor_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_neighbor_districts_id_seq OWNED BY public._service_districts_v_blocks_neighbor_districts.id;

CREATE TABLE public._service_districts_v_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    slug character varying,
    distance character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_neighbor_districts_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_neighbor_districts_items_id_seq OWNED BY public._service_districts_v_blocks_neighbor_districts_items.id;

CREATE TABLE public._service_districts_v_blocks_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'pricing'::character varying,
    h2 character varying,
    helper character varying,
    variant public.enum__service_districts_v_blocks_pricing_table_variant DEFAULT 'tiers'::public.enum__service_districts_v_blocks_pricing_table_variant,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_pricing_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_id_seq OWNED BY public._service_districts_v_blocks_pricing_table.id;

CREATE TABLE public._service_districts_v_blocks_pricing_table_tiers (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    price character varying,
    unit character varying,
    tagline character varying,
    highlighted boolean DEFAULT false,
    badge character varying DEFAULT 'Рекомендуем'::character varying,
    cta_label character varying DEFAULT 'Выбрать тариф'::character varying,
    cta_href character varying DEFAULT '#calculator'::character varying,
    _uuid character varying
);

CREATE TABLE public._service_districts_v_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_features_id_seq OWNED BY public._service_districts_v_blocks_pricing_table_tiers_features.id;

CREATE SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_id_seq OWNED BY public._service_districts_v_blocks_pricing_table_tiers.id;

CREATE TABLE public._service_districts_v_blocks_process_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'process'::character varying,
    h2 character varying DEFAULT 'Как мы работаем'::character varying,
    helper character varying,
    layout public.enum__service_districts_v_blocks_process_steps_layout DEFAULT 'vertical'::public.enum__service_districts_v_blocks_process_steps_layout,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_process_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_process_steps_id_seq OWNED BY public._service_districts_v_blocks_process_steps.id;

CREATE TABLE public._service_districts_v_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_process_steps_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_process_steps_steps_id_seq OWNED BY public._service_districts_v_blocks_process_steps_steps.id;

CREATE TABLE public._service_districts_v_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_related_services_id_seq OWNED BY public._service_districts_v_blocks_related_services.id;

CREATE TABLE public._service_districts_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_related_services_items_id_seq OWNED BY public._service_districts_v_blocks_related_services_items.id;

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

CREATE SEQUENCE public._service_districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_text_content_id_seq OWNED BY public._service_districts_v_blocks_text_content.id;

CREATE TABLE public._service_districts_v_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_tldr_id_seq OWNED BY public._service_districts_v_blocks_tldr.id;

CREATE SEQUENCE public._service_districts_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_id_seq OWNED BY public._service_districts_v.id;

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

CREATE TABLE public._service_districts_v_version_local_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_version_local_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_version_local_faq_id_seq OWNED BY public._service_districts_v_version_local_faq.id;

CREATE TABLE public._service_districts_v_version_local_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    landmark_name character varying,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_version_local_landmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_version_local_landmarks_id_seq OWNED BY public._service_districts_v_version_local_landmarks.id;

CREATE TABLE public._services_v (
    id integer NOT NULL,
    parent_id integer,
    version_slug character varying,
    version_title character varying,
    version_h1 character varying,
    version_meta_title character varying,
    version_meta_description character varying,
    version_intro jsonb,
    version_price_from numeric,
    version_price_to numeric,
    version_price_unit public.enum__services_v_version_price_unit,
    version_hero_image_id integer,
    version_og_image_id integer,
    version_schema_json_ld_override jsonb,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    version__status public.enum__services_v_version_status DEFAULT 'draft'::public.enum__services_v_version_status,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean,
    autosave boolean,
    version_canonical_override character varying,
    version_breadcrumb_label character varying,
    version_reviewed_by_id integer,
    version_use_template_v2 boolean DEFAULT false
);

CREATE TABLE public._services_v_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_breadcrumbs_id_seq OWNED BY public._services_v_blocks_breadcrumbs.id;

CREATE TABLE public._services_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_breadcrumbs_items_id_seq OWNED BY public._services_v_blocks_breadcrumbs_items.id;

CREATE TABLE public._services_v_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum__services_v_blocks_calculator_placeholder_svc_t,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_calculator_placeholder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_calculator_placeholder_id_seq OWNED BY public._services_v_blocks_calculator_placeholder.id;

CREATE TABLE public._services_v_blocks_cta_banner (
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
    accent public.enum__services_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__services_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_cta_banner_id_seq OWNED BY public._services_v_blocks_cta_banner.id;

CREATE TABLE public._services_v_blocks_faq (
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

CREATE SEQUENCE public._services_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_faq_id_seq OWNED BY public._services_v_blocks_faq.id;

CREATE TABLE public._services_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_faq_items_id_seq OWNED BY public._services_v_blocks_faq_items.id;

CREATE TABLE public._services_v_blocks_hero (
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
    seasonal_theme public.enum__services_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__services_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_hero_id_seq OWNED BY public._services_v_blocks_hero.id;

CREATE TABLE public._services_v_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum__services_v_blocks_lead_form_variant DEFAULT 'short'::public.enum__services_v_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_lead_form_id_seq OWNED BY public._services_v_blocks_lead_form.id;

CREATE TABLE public._services_v_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_mini_case_id_seq OWNED BY public._services_v_blocks_mini_case.id;

CREATE TABLE public._services_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._services_v_blocks_mini_case_inline_facts.id;

CREATE TABLE public._services_v_blocks_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'pricing'::character varying,
    h2 character varying,
    helper character varying,
    variant public.enum__services_v_blocks_pricing_table_variant DEFAULT 'tiers'::public.enum__services_v_blocks_pricing_table_variant,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_pricing_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_pricing_table_id_seq OWNED BY public._services_v_blocks_pricing_table.id;

CREATE TABLE public._services_v_blocks_pricing_table_tiers (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    price character varying,
    unit character varying,
    tagline character varying,
    highlighted boolean DEFAULT false,
    badge character varying DEFAULT 'Рекомендуем'::character varying,
    cta_label character varying DEFAULT 'Выбрать тариф'::character varying,
    cta_href character varying DEFAULT '#calculator'::character varying,
    _uuid character varying
);

CREATE TABLE public._services_v_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    value character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_pricing_table_tiers_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_pricing_table_tiers_features_id_seq OWNED BY public._services_v_blocks_pricing_table_tiers_features.id;

CREATE SEQUENCE public._services_v_blocks_pricing_table_tiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_pricing_table_tiers_id_seq OWNED BY public._services_v_blocks_pricing_table_tiers.id;

CREATE TABLE public._services_v_blocks_process_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'process'::character varying,
    h2 character varying DEFAULT 'Как мы работаем'::character varying,
    helper character varying,
    layout public.enum__services_v_blocks_process_steps_layout DEFAULT 'vertical'::public.enum__services_v_blocks_process_steps_layout,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_process_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_process_steps_id_seq OWNED BY public._services_v_blocks_process_steps.id;

CREATE TABLE public._services_v_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_process_steps_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_process_steps_steps_id_seq OWNED BY public._services_v_blocks_process_steps_steps.id;

CREATE TABLE public._services_v_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_related_services_id_seq OWNED BY public._services_v_blocks_related_services.id;

CREATE TABLE public._services_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_related_services_items_id_seq OWNED BY public._services_v_blocks_related_services_items.id;

CREATE TABLE public._services_v_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_services_grid_id_seq OWNED BY public._services_v_blocks_services_grid.id;

CREATE TABLE public._services_v_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_services_grid_items_id_seq OWNED BY public._services_v_blocks_services_grid_items.id;

CREATE TABLE public._services_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__services_v_blocks_text_content_columns DEFAULT '1'::public.enum__services_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_text_content_id_seq OWNED BY public._services_v_blocks_text_content.id;

CREATE TABLE public._services_v_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    _uuid character varying,
    block_name character varying
);

CREATE SEQUENCE public._services_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_blocks_tldr_id_seq OWNED BY public._services_v_blocks_tldr.id;

CREATE SEQUENCE public._services_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_id_seq OWNED BY public._services_v.id;

CREATE TABLE public._services_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);

CREATE SEQUENCE public._services_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_rels_id_seq OWNED BY public._services_v_rels.id;

CREATE TABLE public._services_v_version_faq_global (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_version_faq_global_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_version_faq_global_id_seq OWNED BY public._services_v_version_faq_global.id;

CREATE TABLE public._services_v_version_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    _uuid character varying
);

CREATE SEQUENCE public._services_v_version_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_version_gallery_id_seq OWNED BY public._services_v_version_gallery.id;

CREATE TABLE public._services_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__services_v_version_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public._services_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_version_robots_directives_id_seq OWNED BY public._services_v_version_robots_directives.id;

CREATE TABLE public._services_v_version_sub_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    price_from numeric,
    _uuid character varying,
    intro character varying,
    body jsonb,
    meta_title character varying,
    meta_description character varying
);

CREATE SEQUENCE public._services_v_version_sub_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._services_v_version_sub_services_id_seq OWNED BY public._services_v_version_sub_services.id;

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    collection text NOT NULL,
    doc_id text,
    user_id integer,
    action text NOT NULL,
    changed_at timestamp with time zone DEFAULT now() NOT NULL,
    ip inet,
    user_agent text,
    diff jsonb DEFAULT '{}'::jsonb NOT NULL,
    affected_ids text[],
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT audit_log_action_check CHECK ((action = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'publish'::text, 'unpublish'::text, 'archive'::text, 'login'::text, 'logout'::text, 'login_failed'::text, 'bulk_action'::text, 'rbac_change'::text])))
);

CREATE TABLE public.authors (
    id integer NOT NULL,
    slug character varying,
    first_name character varying,
    last_name character varying,
    full_name character varying,
    job_title character varying,
    bio character varying,
    avatar_id integer,
    meta_title character varying,
    meta_description character varying,
    canonical_override character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_authors_status DEFAULT 'draft'::public.enum_authors_status
);

CREATE TABLE public.authors_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.authors_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.authors_blocks_cta_banner (
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
    accent public.enum_authors_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_authors_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.authors_blocks_hero (
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
    seasonal_theme public.enum_authors_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_authors_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.authors_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE public.authors_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);

CREATE TABLE public.authors_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_authors_blocks_text_content_columns DEFAULT '1'::public.enum_authors_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.authors_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    issuer character varying,
    issued_at timestamp(3) with time zone
);

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;

CREATE TABLE public.authors_knows_about (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    topic character varying
);

CREATE TABLE public.authors_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer
);

CREATE SEQUENCE public.authors_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.authors_rels_id_seq OWNED BY public.authors_rels.id;

CREATE TABLE public.authors_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_authors_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.authors_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.authors_robots_directives_id_seq OWNED BY public.authors_robots_directives.id;

CREATE TABLE public.authors_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    url character varying
);

CREATE TABLE public.b2b_pages (
    id integer NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    meta_title character varying,
    meta_description character varying,
    audience public.enum_b2b_pages_audience,
    body jsonb,
    form_config jsonb,
    contract_template_url character varying,
    krisha_shtraf boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_b2b_pages_status DEFAULT 'draft'::public.enum_b2b_pages_status,
    canonical_override character varying,
    breadcrumb_label character varying,
    use_template_v2 boolean DEFAULT false
);

CREATE TABLE public.b2b_pages_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.b2b_pages_blocks_cta_banner (
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
    accent public.enum_b2b_pages_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_b2b_pages_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_faq (
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

CREATE TABLE public.b2b_pages_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.b2b_pages_blocks_hero (
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
    seasonal_theme public.enum_b2b_pages_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_b2b_pages_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum_b2b_pages_blocks_lead_form_variant DEFAULT 'short'::public.enum_b2b_pages_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);

CREATE TABLE public.b2b_pages_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);

CREATE TABLE public.b2b_pages_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_b2b_pages_blocks_text_content_columns DEFAULT '1'::public.enum_b2b_pages_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.b2b_pages_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    block_name character varying
);

CREATE SEQUENCE public.b2b_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.b2b_pages_id_seq OWNED BY public.b2b_pages.id;

CREATE TABLE public.b2b_pages_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    cases_id integer,
    services_id integer
);

CREATE SEQUENCE public.b2b_pages_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.b2b_pages_rels_id_seq OWNED BY public.b2b_pages_rels.id;

CREATE TABLE public.b2b_pages_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_b2b_pages_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.b2b_pages_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.b2b_pages_robots_directives_id_seq OWNED BY public.b2b_pages_robots_directives.id;

CREATE TABLE public.blog (
    id integer NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    intro character varying,
    body jsonb,
    author_id integer,
    category public.enum_blog_category,
    published_at timestamp(3) with time zone,
    modified_at timestamp(3) with time zone,
    hero_image_id integer,
    og_image_id integer,
    meta_title character varying,
    meta_description character varying,
    is_how_to boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_blog_status DEFAULT 'draft'::public.enum_blog_status,
    canonical_override character varying,
    breadcrumb_label character varying,
    last_reviewed_at timestamp(3) with time zone,
    reviewed_by_id integer
);

CREATE TABLE public.blog_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.blog_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.blog_blocks_cta_banner (
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
    accent public.enum_blog_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_blog_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.blog_blocks_faq (
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

CREATE TABLE public.blog_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.blog_blocks_hero (
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
    seasonal_theme public.enum_blog_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_blog_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.blog_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE public.blog_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);

CREATE TABLE public.blog_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_blog_blocks_text_content_columns DEFAULT '1'::public.enum_blog_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.blog_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    block_name character varying
);

CREATE TABLE public.blog_faq_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.blog_how_to_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    text jsonb
);

CREATE SEQUENCE public.blog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.blog_id_seq OWNED BY public.blog.id;

CREATE TABLE public.blog_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer,
    districts_id integer
);

CREATE SEQUENCE public.blog_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.blog_rels_id_seq OWNED BY public.blog_rels.id;

CREATE TABLE public.blog_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_blog_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.blog_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.blog_robots_directives_id_seq OWNED BY public.blog_robots_directives.id;

CREATE TABLE public.cases (
    id integer NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    service_id integer,
    district_id integer,
    date_completed timestamp(3) with time zone,
    description jsonb,
    video_url character varying,
    video_transcript character varying,
    duration_hours numeric,
    final_price numeric,
    meta_title character varying,
    meta_description character varying,
    og_image_id integer,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_cases_status DEFAULT 'draft'::public.enum_cases_status,
    canonical_override character varying,
    breadcrumb_label character varying,
    last_reviewed_at timestamp(3) with time zone,
    reviewed_by_id integer
);

CREATE TABLE public.cases_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.cases_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.cases_blocks_cta_banner (
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
    accent public.enum_cases_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_cases_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.cases_blocks_hero (
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
    seasonal_theme public.enum_cases_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_cases_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.cases_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    block_name character varying
);

CREATE TABLE public.cases_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);

CREATE TABLE public.cases_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE public.cases_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);

CREATE TABLE public.cases_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_cases_blocks_text_content_columns DEFAULT '1'::public.enum_cases_blocks_text_content_columns,
    block_name character varying
);

CREATE SEQUENCE public.cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cases_id_seq OWNED BY public.cases.id;

CREATE TABLE public.cases_photos_after (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    caption character varying
);

CREATE TABLE public.cases_photos_before (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    caption character varying
);

CREATE TABLE public.cases_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    authors_id integer
);

CREATE SEQUENCE public.cases_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cases_rels_id_seq OWNED BY public.cases_rels.id;

CREATE TABLE public.cases_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_cases_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.cases_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cases_robots_directives_id_seq OWNED BY public.cases_robots_directives.id;

CREATE TABLE public.districts (
    id integer NOT NULL,
    slug character varying,
    name_nominative character varying,
    name_prepositional character varying,
    name_dative character varying,
    name_genitive character varying,
    coverage_radius numeric,
    distance_from_mkad numeric,
    center_geo jsonb,
    courts_jurisdiction character varying,
    photo_geo_id integer,
    priority public.enum_districts_priority DEFAULT 'B'::public.enum_districts_priority,
    local_price_adjustment numeric DEFAULT 0,
    hero_image_id integer,
    meta_title character varying,
    meta_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_districts_status DEFAULT 'draft'::public.enum_districts_status,
    canonical_override character varying,
    breadcrumb_label character varying
);

CREATE TABLE public.districts_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.districts_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.districts_blocks_hero (
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
    seasonal_theme public.enum_districts_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_districts_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.districts_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum_districts_blocks_lead_form_variant DEFAULT 'short'::public.enum_districts_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    block_name character varying
);

CREATE TABLE public.districts_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    block_name character varying
);

CREATE TABLE public.districts_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);

CREATE TABLE public.districts_blocks_neighbor_districts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Соседние районы'::character varying,
    service_slug character varying,
    block_name character varying
);

CREATE TABLE public.districts_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    slug character varying,
    distance character varying
);

CREATE TABLE public.districts_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    block_name character varying
);

CREATE TABLE public.districts_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);

CREATE TABLE public.districts_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_districts_blocks_text_content_columns DEFAULT '1'::public.enum_districts_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.districts_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    block_name character varying
);

CREATE SEQUENCE public.districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.districts_id_seq OWNED BY public.districts.id;

CREATE TABLE public.districts_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    type public.enum_districts_landmarks_type
);

CREATE TABLE public.districts_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer,
    services_id integer
);

CREATE SEQUENCE public.districts_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.districts_rels_id_seq OWNED BY public.districts_rels.id;

CREATE TABLE public.districts_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_districts_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.districts_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.districts_robots_directives_id_seq OWNED BY public.districts_robots_directives.id;

CREATE TABLE public.homepage (
    id integer NOT NULL,
    hero_eyebrow character varying DEFAULT '§ 01 · Хозяйственные работы · Москва и МО'::character varying,
    hero_title_main character varying DEFAULT 'Удаление деревьев'::character varying NOT NULL,
    hero_title_accent character varying DEFAULT 'в Москве и МО'::character varying NOT NULL,
    hero_subhead character varying DEFAULT 'И ещё 3 направления: чистка крыш, вывоз мусора, демонтаж'::character varying,
    hero_lead character varying DEFAULT 'Фикс-цена за объект, страховка 5 млн ₽, штрафы ГЖИ берём на себя по договору.'::character varying,
    hero_photo_id integer,
    photo_smeta_example_id character varying DEFAULT '№ 0044'::character varying,
    photo_smeta_example_image_id integer,
    photo_smeta_example_caption character varying DEFAULT 'ФОТО · Аварийная берёза 18 м
СНТ Берёзовая роща, Истра'::character varying,
    photo_smeta_example_recognized character varying DEFAULT 'берёза, ~18 м, аварийный наклон 25°'::character varying,
    photo_smeta_example_range_min numeric DEFAULT 12800,
    photo_smeta_example_range_max numeric DEFAULT 16400,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);

CREATE TABLE public.homepage_documents (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    meta character varying NOT NULL,
    photo_id integer
);

CREATE TABLE public.homepage_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying NOT NULL,
    answer character varying NOT NULL
);

CREATE TABLE public.homepage_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    photo_id integer,
    caption character varying NOT NULL,
    alt character varying NOT NULL
);

CREATE TABLE public.homepage_hero_trust_bullets (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL
);

CREATE SEQUENCE public.homepage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.homepage_id_seq OWNED BY public.homepage.id;

CREATE TABLE public.homepage_pricing_rows (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    "desc" character varying NOT NULL,
    price_from numeric NOT NULL,
    unit character varying NOT NULL,
    link character varying NOT NULL
);

CREATE TABLE public.homepage_review_sources (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    rating numeric NOT NULL,
    review_count numeric NOT NULL,
    is_nps boolean DEFAULT false
);

CREATE TABLE public.homepage_reviews (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    author character varying NOT NULL,
    meta character varying NOT NULL,
    text character varying NOT NULL
);

CREATE TABLE public.homepage_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    sla character varying NOT NULL,
    description character varying NOT NULL
);

CREATE TABLE public.leads (
    id integer NOT NULL,
    phone character varying NOT NULL,
    name character varying,
    email character varying,
    source_page character varying,
    service_id integer,
    district_id integer,
    preferred_channel public.enum_leads_preferred_channel,
    estimate_draft_json jsonb,
    amo_crm_id character varying,
    utm_source character varying,
    utm_medium character varying,
    utm_campaign character varying,
    call_tracking_id character varying,
    status public.enum_leads_status DEFAULT 'new'::public.enum_leads_status,
    synced_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    archived_at timestamp(3) with time zone,
    status_history jsonb DEFAULT '[]'::jsonb
);

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;

CREATE TABLE public.leads_photos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    s3_key character varying,
    url character varying
);

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    caption character varying,
    geo_location jsonb,
    license public.enum_media_license DEFAULT 'proprietary'::public.enum_media_license,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric,
    sizes_thumb_url character varying,
    sizes_thumb_width numeric,
    sizes_thumb_height numeric,
    sizes_thumb_mime_type character varying,
    sizes_thumb_filesize numeric,
    sizes_thumb_filename character varying,
    sizes_card_url character varying,
    sizes_card_width numeric,
    sizes_card_height numeric,
    sizes_card_mime_type character varying,
    sizes_card_filesize numeric,
    sizes_card_filename character varying,
    sizes_hero_url character varying,
    sizes_hero_width numeric,
    sizes_hero_height numeric,
    sizes_hero_mime_type character varying,
    sizes_hero_filesize numeric,
    sizes_hero_filename character varying,
    sizes_og_url character varying,
    sizes_og_width numeric,
    sizes_og_height numeric,
    sizes_og_mime_type character varying,
    sizes_og_filesize numeric,
    sizes_og_filename character varying
);

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    services_id integer,
    districts_id integer,
    service_districts_id integer,
    cases_id integer,
    blog_id integer,
    b2b_pages_id integer,
    leads_id integer,
    redirects_id integer,
    authors_id integer,
    reviews_id integer,
    rum_metrics_id integer
);

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;

CREATE TABLE public.redirects (
    id integer NOT NULL,
    "from" character varying NOT NULL,
    "to" character varying NOT NULL,
    status_code public.enum_redirects_status_code DEFAULT '301'::public.enum_redirects_status_code,
    note character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.redirects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.redirects_id_seq OWNED BY public.redirects.id;

CREATE TABLE public.reviews (
    id integer NOT NULL,
    author_name character varying,
    rating numeric,
    text character varying,
    date_published timestamp(3) with time zone,
    service_id integer,
    district_id integer,
    source public.enum_reviews_source,
    source_url character varying,
    verified boolean DEFAULT false,
    pinned_to_homepage boolean DEFAULT false,
    priority numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_reviews_status DEFAULT 'draft'::public.enum_reviews_status
);

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;

CREATE TABLE public.rum_metrics (
    id integer NOT NULL,
    name public.enum_rum_metrics_name NOT NULL,
    value numeric NOT NULL,
    rating public.enum_rum_metrics_rating NOT NULL,
    page_url character varying NOT NULL,
    user_agent character varying,
    viewport_width numeric,
    navigation_type public.enum_rum_metrics_navigation_type,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    ab_variant public.enum_rum_metrics_ab_variant
);

CREATE SEQUENCE public.rum_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.rum_metrics_id_seq OWNED BY public.rum_metrics.id;

CREATE TABLE public.seo_settings (
    id integer NOT NULL,
    organization_name character varying DEFAULT 'Обиход'::character varying,
    local_business_price_range character varying DEFAULT '₽₽'::character varying,
    local_business_geo_radius_km numeric DEFAULT 150,
    local_business_opening_hours_opens character varying DEFAULT '08:00'::character varying,
    local_business_opening_hours_closes character varying DEFAULT '21:00'::character varying,
    verification_yandex_webmaster character varying,
    verification_google_search_console character varying,
    verification_mail_ru character varying,
    default_og_image_id integer,
    organization_schema_override jsonb,
    index_now_key character varying,
    robots_additional character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);

CREATE TABLE public.seo_settings_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    issuer character varying,
    document_url character varying
);

CREATE SEQUENCE public.seo_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.seo_settings_id_seq OWNED BY public.seo_settings.id;

CREATE TABLE public.service_districts (
    id integer NOT NULL,
    service_id integer,
    district_id integer,
    computed_title character varying,
    mini_case_id integer,
    local_price_note character varying,
    lead_paragraph jsonb,
    uniqueness_score numeric,
    publish_status public.enum_service_districts_publish_status DEFAULT 'draft'::public.enum_service_districts_publish_status,
    noindex_until_case boolean DEFAULT true,
    is_ord_marked boolean DEFAULT false,
    erid_token character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_service_districts_status DEFAULT 'draft'::public.enum_service_districts_status,
    seo_title character varying,
    seo_description character varying,
    seo_h1 character varying,
    canonical_override character varying,
    robots public.enum_service_districts_robots DEFAULT 'index,follow'::public.enum_service_districts_robots,
    og_image_id integer,
    last_reviewed_at timestamp(3) with time zone,
    reviewed_by_id integer,
    sub_service_slug character varying,
    use_template_v2 boolean DEFAULT false
);

CREATE TABLE public.service_districts_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.service_districts_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum_service_districts_blocks_calculator_placeholder_svc_t,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
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

CREATE TABLE public.service_districts_blocks_neighbor_districts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Соседние районы'::character varying,
    service_slug character varying,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    slug character varying,
    distance character varying
);

CREATE TABLE public.service_districts_blocks_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'pricing'::character varying,
    h2 character varying,
    helper character varying,
    variant public.enum_service_districts_blocks_pricing_table_variant DEFAULT 'tiers'::public.enum_service_districts_blocks_pricing_table_variant,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_pricing_table_tiers (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    price character varying,
    unit character varying,
    tagline character varying,
    highlighted boolean DEFAULT false,
    badge character varying DEFAULT 'Рекомендуем'::character varying,
    cta_label character varying DEFAULT 'Выбрать тариф'::character varying,
    cta_href character varying DEFAULT '#calculator'::character varying
);

CREATE TABLE public.service_districts_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    value character varying
);

CREATE TABLE public.service_districts_blocks_process_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'process'::character varying,
    h2 character varying DEFAULT 'Как мы работаем'::character varying,
    helper character varying,
    layout public.enum_service_districts_blocks_process_steps_layout DEFAULT 'vertical'::public.enum_service_districts_blocks_process_steps_layout,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying
);

CREATE TABLE public.service_districts_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
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

CREATE TABLE public.service_districts_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    block_name character varying
);

CREATE SEQUENCE public.service_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.service_districts_id_seq OWNED BY public.service_districts.id;

CREATE TABLE public.service_districts_local_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.service_districts_local_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    landmark_name character varying
);

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

CREATE TABLE public.services (
    id integer NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    meta_title character varying,
    meta_description character varying,
    intro jsonb,
    price_from numeric,
    price_to numeric,
    price_unit public.enum_services_price_unit,
    hero_image_id integer,
    og_image_id integer,
    schema_json_ld_override jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    _status public.enum_services_status DEFAULT 'draft'::public.enum_services_status,
    canonical_override character varying,
    breadcrumb_label character varying,
    reviewed_by_id integer,
    use_template_v2 boolean DEFAULT false
);

CREATE TABLE public.services_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.services_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

CREATE TABLE public.services_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum_services_blocks_calculator_placeholder_svc_t,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
    block_name character varying
);

CREATE TABLE public.services_blocks_cta_banner (
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
    accent public.enum_services_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_services_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.services_blocks_faq (
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

CREATE TABLE public.services_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.services_blocks_hero (
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
    seasonal_theme public.enum_services_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_services_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.services_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum_services_blocks_lead_form_variant DEFAULT 'short'::public.enum_services_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    block_name character varying
);

CREATE TABLE public.services_blocks_mini_case (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    case_ref_id integer,
    inline_title character varying,
    inline_photo_id integer,
    inline_link character varying,
    block_name character varying
);

CREATE TABLE public.services_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);

CREATE TABLE public.services_blocks_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'pricing'::character varying,
    h2 character varying,
    helper character varying,
    variant public.enum_services_blocks_pricing_table_variant DEFAULT 'tiers'::public.enum_services_blocks_pricing_table_variant,
    block_name character varying
);

CREATE TABLE public.services_blocks_pricing_table_tiers (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    price character varying,
    unit character varying,
    tagline character varying,
    highlighted boolean DEFAULT false,
    badge character varying DEFAULT 'Рекомендуем'::character varying,
    cta_label character varying DEFAULT 'Выбрать тариф'::character varying,
    cta_href character varying DEFAULT '#calculator'::character varying
);

CREATE TABLE public.services_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    value character varying
);

CREATE TABLE public.services_blocks_process_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'process'::character varying,
    h2 character varying DEFAULT 'Как мы работаем'::character varying,
    helper character varying,
    layout public.enum_services_blocks_process_steps_layout DEFAULT 'vertical'::public.enum_services_blocks_process_steps_layout,
    block_name character varying
);

CREATE TABLE public.services_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying
);

CREATE TABLE public.services_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE public.services_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);

CREATE TABLE public.services_blocks_services_grid (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    block_name character varying
);

CREATE TABLE public.services_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);

CREATE TABLE public.services_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_services_blocks_text_content_columns DEFAULT '1'::public.enum_services_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.services_blocks_tldr (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying DEFAULT 'Если коротко'::character varying,
    text character varying,
    body jsonb,
    block_name character varying
);

CREATE TABLE public.services_faq_global (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public.services_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer
);

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;

CREATE TABLE public.services_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);

CREATE SEQUENCE public.services_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.services_rels_id_seq OWNED BY public.services_rels.id;

CREATE TABLE public.services_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_services_robots_directives,
    id integer NOT NULL
);

CREATE SEQUENCE public.services_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.services_robots_directives_id_seq OWNED BY public.services_robots_directives.id;

CREATE TABLE public.services_sub_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    slug character varying,
    title character varying,
    h1 character varying,
    price_from numeric,
    intro character varying,
    body jsonb,
    meta_title character varying,
    meta_description character varying
);

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
    contacts_email character varying DEFAULT 'partner@obikhod.ru'::character varying,
    requisites_legal_name character varying,
    requisites_tax_id character varying DEFAULT '1111111111'::character varying NOT NULL,
    requisites_kpp character varying DEFAULT '111111111'::character varying,
    requisites_ogrn character varying DEFAULT '1111111111111'::character varying,
    requisites_address_region character varying DEFAULT 'Московская область'::character varying,
    requisites_address_locality character varying DEFAULT 'Жуковский'::character varying,
    requisites_street_address character varying DEFAULT 'ул. Амет-хан Султана, 15, к1'::character varying,
    requisites_postal_code character varying DEFAULT '140185'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);

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

CREATE SEQUENCE public.site_chrome_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.site_chrome_id_seq OWNED BY public.site_chrome.id;

CREATE TABLE public.site_chrome_social (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    type public.enum_site_chrome_social_type NOT NULL,
    url character varying NOT NULL
);

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    role public.enum_users_role DEFAULT 'admin'::public.enum_users_role NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone,
    telegram_chat_id character varying,
    totp_enabled boolean DEFAULT false,
    totp_secret_enc character varying,
    reset_password_requested_at timestamp(3) with time zone
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

CREATE TABLE public.users_recovery_codes (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    hash character varying NOT NULL,
    consumed_at timestamp(3) with time zone
);

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);

ALTER TABLE ONLY public._authors_v ALTER COLUMN id SET DEFAULT nextval('public._authors_v_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_related_services_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_related_services_items_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_rels ALTER COLUMN id SET DEFAULT nextval('public._authors_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_version_credentials ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_credentials_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_version_knows_about ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_knows_about_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_version_same_as ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_same_as_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_faq_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_faq_items_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_lead_form_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_mini_case_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_services_grid_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_services_grid_items_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_tldr_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_rels ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v ALTER COLUMN id SET DEFAULT nextval('public._blog_v_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_faq_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_faq_items_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_related_services_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_related_services_items_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_tldr_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_rels ALTER COLUMN id SET DEFAULT nextval('public._blog_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_version_faq_block ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_faq_block_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_version_how_to_steps ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_how_to_steps_id_seq'::regclass);

ALTER TABLE ONLY public._blog_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v ALTER COLUMN id SET DEFAULT nextval('public._cases_v_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_mini_case_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_mini_case_inline_facts_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_related_services_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_related_services_items_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_rels ALTER COLUMN id SET DEFAULT nextval('public._cases_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_version_photos_after ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_photos_after_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_version_photos_before ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_photos_before_id_seq'::regclass);

ALTER TABLE ONLY public._cases_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v ALTER COLUMN id SET DEFAULT nextval('public._districts_v_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_lead_form_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_mini_case_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_mini_case_inline_facts_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_neighbor_districts_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_neighbor_districts_items_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_services_grid_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_services_grid_items_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_tldr_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_rels ALTER COLUMN id SET DEFAULT nextval('public._districts_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_version_landmarks ALTER COLUMN id SET DEFAULT nextval('public._districts_v_version_landmarks_id_seq'::regclass);

ALTER TABLE ONLY public._districts_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._districts_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._reviews_v ALTER COLUMN id SET DEFAULT nextval('public._reviews_v_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_calculator_placeholder_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_items_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_lead_form_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_neighbor_districts_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_neighbor_districts_items_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_tiers_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_tiers_features_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_process_steps_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_process_steps_steps_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_related_services_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_related_services_items_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_tldr_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_rels ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_version_local_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_version_local_faq_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_version_local_landmarks_id_seq'::regclass);

ALTER TABLE ONLY public._services_v ALTER COLUMN id SET DEFAULT nextval('public._services_v_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_breadcrumbs_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_breadcrumbs_items_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_calculator_placeholder_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_faq_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_faq_items_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_lead_form_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_mini_case_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_mini_case_inline_facts_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_pricing_table ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_pricing_table_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_pricing_table_tiers_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers_features ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_pricing_table_tiers_features_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_process_steps ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_process_steps_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_process_steps_steps ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_process_steps_steps_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_related_services_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_related_services_items_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_services_grid_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_services_grid_items_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_tldr_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_rels ALTER COLUMN id SET DEFAULT nextval('public._services_v_rels_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_version_faq_global ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_faq_global_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_version_gallery ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_gallery_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public._services_v_version_sub_services ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_sub_services_id_seq'::regclass);

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);

ALTER TABLE ONLY public.authors_rels ALTER COLUMN id SET DEFAULT nextval('public.authors_rels_id_seq'::regclass);

ALTER TABLE ONLY public.authors_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.authors_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.b2b_pages ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_id_seq'::regclass);

ALTER TABLE ONLY public.b2b_pages_rels ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_rels_id_seq'::regclass);

ALTER TABLE ONLY public.b2b_pages_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.blog ALTER COLUMN id SET DEFAULT nextval('public.blog_id_seq'::regclass);

ALTER TABLE ONLY public.blog_rels ALTER COLUMN id SET DEFAULT nextval('public.blog_rels_id_seq'::regclass);

ALTER TABLE ONLY public.blog_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.blog_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.cases ALTER COLUMN id SET DEFAULT nextval('public.cases_id_seq'::regclass);

ALTER TABLE ONLY public.cases_rels ALTER COLUMN id SET DEFAULT nextval('public.cases_rels_id_seq'::regclass);

ALTER TABLE ONLY public.cases_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.cases_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.districts ALTER COLUMN id SET DEFAULT nextval('public.districts_id_seq'::regclass);

ALTER TABLE ONLY public.districts_rels ALTER COLUMN id SET DEFAULT nextval('public.districts_rels_id_seq'::regclass);

ALTER TABLE ONLY public.districts_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.districts_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.homepage ALTER COLUMN id SET DEFAULT nextval('public.homepage_id_seq'::regclass);

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);

ALTER TABLE ONLY public.redirects ALTER COLUMN id SET DEFAULT nextval('public.redirects_id_seq'::regclass);

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);

ALTER TABLE ONLY public.rum_metrics ALTER COLUMN id SET DEFAULT nextval('public.rum_metrics_id_seq'::regclass);

ALTER TABLE ONLY public.seo_settings ALTER COLUMN id SET DEFAULT nextval('public.seo_settings_id_seq'::regclass);

ALTER TABLE ONLY public.service_districts ALTER COLUMN id SET DEFAULT nextval('public.service_districts_id_seq'::regclass);

ALTER TABLE ONLY public.service_districts_rels ALTER COLUMN id SET DEFAULT nextval('public.service_districts_rels_id_seq'::regclass);

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);

ALTER TABLE ONLY public.services_rels ALTER COLUMN id SET DEFAULT nextval('public.services_rels_id_seq'::regclass);

ALTER TABLE ONLY public.services_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.services_robots_directives_id_seq'::regclass);

ALTER TABLE ONLY public.site_chrome ALTER COLUMN id SET DEFAULT nextval('public.site_chrome_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_cta_banner
    ADD CONSTRAINT _authors_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_related_services_items
    ADD CONSTRAINT _authors_v_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_related_services
    ADD CONSTRAINT _authors_v_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_blocks_text_content
    ADD CONSTRAINT _authors_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_version_credentials
    ADD CONSTRAINT _authors_v_version_credentials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_version_knows_about
    ADD CONSTRAINT _authors_v_version_knows_about_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_version_robots_directives
    ADD CONSTRAINT _authors_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._authors_v_version_same_as
    ADD CONSTRAINT _authors_v_version_same_as_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner
    ADD CONSTRAINT _b2b_pages_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form
    ADD CONSTRAINT _b2b_pages_v_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content
    ADD CONSTRAINT _b2b_pages_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr
    ADD CONSTRAINT _b2b_pages_v_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v
    ADD CONSTRAINT _b2b_pages_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives
    ADD CONSTRAINT _b2b_pages_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_cta_banner
    ADD CONSTRAINT _blog_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_faq_items
    ADD CONSTRAINT _blog_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_faq
    ADD CONSTRAINT _blog_v_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_related_services_items
    ADD CONSTRAINT _blog_v_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_related_services
    ADD CONSTRAINT _blog_v_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_text_content
    ADD CONSTRAINT _blog_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_blocks_tldr
    ADD CONSTRAINT _blog_v_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_version_faq_block
    ADD CONSTRAINT _blog_v_version_faq_block_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_version_how_to_steps
    ADD CONSTRAINT _blog_v_version_how_to_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._blog_v_version_robots_directives
    ADD CONSTRAINT _blog_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_cta_banner
    ADD CONSTRAINT _cases_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_related_services_items
    ADD CONSTRAINT _cases_v_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_related_services
    ADD CONSTRAINT _cases_v_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_blocks_text_content
    ADD CONSTRAINT _cases_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._cases_v_version_robots_directives
    ADD CONSTRAINT _cases_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_lead_form
    ADD CONSTRAINT _districts_v_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items
    ADD CONSTRAINT _districts_v_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_services_grid
    ADD CONSTRAINT _districts_v_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_text_content
    ADD CONSTRAINT _districts_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_blocks_tldr
    ADD CONSTRAINT _districts_v_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_version_landmarks
    ADD CONSTRAINT _districts_v_version_landmarks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._districts_v_version_robots_directives
    ADD CONSTRAINT _districts_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._reviews_v
    ADD CONSTRAINT _reviews_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder
    ADD CONSTRAINT _service_districts_v_blocks_calculator_placeholder_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps
    ADD CONSTRAINT _service_districts_v_blocks_process_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps
    ADD CONSTRAINT _service_districts_v_blocks_process_steps_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items
    ADD CONSTRAINT _service_districts_v_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_related_services
    ADD CONSTRAINT _service_districts_v_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_tldr
    ADD CONSTRAINT _service_districts_v_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_version_local_faq
    ADD CONSTRAINT _service_districts_v_version_local_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks
    ADD CONSTRAINT _service_districts_v_version_local_landmarks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder
    ADD CONSTRAINT _services_v_blocks_calculator_placeholder_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_cta_banner
    ADD CONSTRAINT _services_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_faq_items
    ADD CONSTRAINT _services_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_faq
    ADD CONSTRAINT _services_v_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_lead_form
    ADD CONSTRAINT _services_v_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_pricing_table
    ADD CONSTRAINT _services_v_blocks_pricing_table_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers_features
    ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers
    ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_process_steps
    ADD CONSTRAINT _services_v_blocks_process_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_process_steps_steps
    ADD CONSTRAINT _services_v_blocks_process_steps_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_related_services_items
    ADD CONSTRAINT _services_v_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_related_services
    ADD CONSTRAINT _services_v_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_services_grid_items
    ADD CONSTRAINT _services_v_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_services_grid
    ADD CONSTRAINT _services_v_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_text_content
    ADD CONSTRAINT _services_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_blocks_tldr
    ADD CONSTRAINT _services_v_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_version_faq_global
    ADD CONSTRAINT _services_v_version_faq_global_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_version_robots_directives
    ADD CONSTRAINT _services_v_version_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._services_v_version_sub_services
    ADD CONSTRAINT _services_v_version_sub_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_breadcrumbs_items
    ADD CONSTRAINT authors_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_breadcrumbs
    ADD CONSTRAINT authors_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_cta_banner
    ADD CONSTRAINT authors_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_related_services_items
    ADD CONSTRAINT authors_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_related_services
    ADD CONSTRAINT authors_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_blocks_text_content
    ADD CONSTRAINT authors_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_credentials
    ADD CONSTRAINT authors_credentials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_knows_about
    ADD CONSTRAINT authors_knows_about_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_robots_directives
    ADD CONSTRAINT authors_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.authors_same_as
    ADD CONSTRAINT authors_same_as_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs_items
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_cta_banner
    ADD CONSTRAINT b2b_pages_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_faq_items
    ADD CONSTRAINT b2b_pages_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_faq
    ADD CONSTRAINT b2b_pages_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_lead_form
    ADD CONSTRAINT b2b_pages_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case_inline_facts
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid_items
    ADD CONSTRAINT b2b_pages_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid
    ADD CONSTRAINT b2b_pages_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_text_content
    ADD CONSTRAINT b2b_pages_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_blocks_tldr
    ADD CONSTRAINT b2b_pages_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages
    ADD CONSTRAINT b2b_pages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.b2b_pages_robots_directives
    ADD CONSTRAINT b2b_pages_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_breadcrumbs_items
    ADD CONSTRAINT blog_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_breadcrumbs
    ADD CONSTRAINT blog_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_cta_banner
    ADD CONSTRAINT blog_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_faq_items
    ADD CONSTRAINT blog_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_faq
    ADD CONSTRAINT blog_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_related_services_items
    ADD CONSTRAINT blog_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_related_services
    ADD CONSTRAINT blog_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_text_content
    ADD CONSTRAINT blog_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_blocks_tldr
    ADD CONSTRAINT blog_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_faq_block
    ADD CONSTRAINT blog_faq_block_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_how_to_steps
    ADD CONSTRAINT blog_how_to_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.blog_robots_directives
    ADD CONSTRAINT blog_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_breadcrumbs_items
    ADD CONSTRAINT cases_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_breadcrumbs
    ADD CONSTRAINT cases_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_cta_banner
    ADD CONSTRAINT cases_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_mini_case_inline_facts
    ADD CONSTRAINT cases_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_related_services_items
    ADD CONSTRAINT cases_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_related_services
    ADD CONSTRAINT cases_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_blocks_text_content
    ADD CONSTRAINT cases_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cases_robots_directives
    ADD CONSTRAINT cases_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_breadcrumbs_items
    ADD CONSTRAINT districts_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_breadcrumbs
    ADD CONSTRAINT districts_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_lead_form
    ADD CONSTRAINT districts_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_mini_case_inline_facts
    ADD CONSTRAINT districts_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_neighbor_districts_items
    ADD CONSTRAINT districts_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_neighbor_districts
    ADD CONSTRAINT districts_blocks_neighbor_districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_services_grid_items
    ADD CONSTRAINT districts_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_services_grid
    ADD CONSTRAINT districts_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_text_content
    ADD CONSTRAINT districts_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_blocks_tldr
    ADD CONSTRAINT districts_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_landmarks
    ADD CONSTRAINT districts_landmarks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.districts_robots_directives
    ADD CONSTRAINT districts_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_faq
    ADD CONSTRAINT homepage_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_hero_trust_bullets
    ADD CONSTRAINT homepage_hero_trust_bullets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_pricing_rows
    ADD CONSTRAINT homepage_pricing_rows_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_review_sources
    ADD CONSTRAINT homepage_review_sources_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_reviews
    ADD CONSTRAINT homepage_reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_steps
    ADD CONSTRAINT homepage_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.leads_photos
    ADD CONSTRAINT leads_photos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.rum_metrics
    ADD CONSTRAINT rum_metrics_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.seo_settings_credentials
    ADD CONSTRAINT seo_settings_credentials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs_items
    ADD CONSTRAINT service_districts_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs
    ADD CONSTRAINT service_districts_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_calculator_placeholder
    ADD CONSTRAINT service_districts_blocks_calculator_placeholder_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts_items
    ADD CONSTRAINT service_districts_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts
    ADD CONSTRAINT service_districts_blocks_neighbor_districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_pricing_table
    ADD CONSTRAINT service_districts_blocks_pricing_table_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers_features
    ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers
    ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_process_steps
    ADD CONSTRAINT service_districts_blocks_process_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_process_steps_steps
    ADD CONSTRAINT service_districts_blocks_process_steps_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_related_services_items
    ADD CONSTRAINT service_districts_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_related_services
    ADD CONSTRAINT service_districts_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_tldr
    ADD CONSTRAINT service_districts_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_local_faq
    ADD CONSTRAINT service_districts_local_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_local_landmarks
    ADD CONSTRAINT service_districts_local_landmarks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_breadcrumbs_items
    ADD CONSTRAINT services_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_breadcrumbs
    ADD CONSTRAINT services_blocks_breadcrumbs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_calculator_placeholder
    ADD CONSTRAINT services_blocks_calculator_placeholder_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_cta_banner
    ADD CONSTRAINT services_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_faq_items
    ADD CONSTRAINT services_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_faq
    ADD CONSTRAINT services_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_lead_form
    ADD CONSTRAINT services_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_mini_case_inline_facts
    ADD CONSTRAINT services_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_pricing_table
    ADD CONSTRAINT services_blocks_pricing_table_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_pricing_table_tiers_features
    ADD CONSTRAINT services_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_pricing_table_tiers
    ADD CONSTRAINT services_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_process_steps
    ADD CONSTRAINT services_blocks_process_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_process_steps_steps
    ADD CONSTRAINT services_blocks_process_steps_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_related_services_items
    ADD CONSTRAINT services_blocks_related_services_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_related_services
    ADD CONSTRAINT services_blocks_related_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_services_grid_items
    ADD CONSTRAINT services_blocks_services_grid_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_services_grid
    ADD CONSTRAINT services_blocks_services_grid_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_text_content
    ADD CONSTRAINT services_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_blocks_tldr
    ADD CONSTRAINT services_blocks_tldr_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_faq_global
    ADD CONSTRAINT services_faq_global_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_robots_directives
    ADD CONSTRAINT services_robots_directives_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.services_sub_services
    ADD CONSTRAINT services_sub_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome_footer_columns_items
    ADD CONSTRAINT site_chrome_footer_columns_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome_footer_columns
    ADD CONSTRAINT site_chrome_footer_columns_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome_header_menu
    ADD CONSTRAINT site_chrome_header_menu_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome
    ADD CONSTRAINT site_chrome_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_chrome_social
    ADD CONSTRAINT site_chrome_social_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users_recovery_codes
    ADD CONSTRAINT users_recovery_codes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);

CREATE INDEX _authors_v_blocks_breadcrumbs_items_order_idx ON public._authors_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _authors_v_blocks_breadcrumbs_items_parent_id_idx ON public._authors_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_breadcrumbs_order_idx ON public._authors_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _authors_v_blocks_breadcrumbs_parent_id_idx ON public._authors_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_breadcrumbs_path_idx ON public._authors_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _authors_v_blocks_cta_banner_order_idx ON public._authors_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _authors_v_blocks_cta_banner_parent_id_idx ON public._authors_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_cta_banner_path_idx ON public._authors_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _authors_v_blocks_hero_image_idx ON public._authors_v_blocks_hero USING btree (image_id);

CREATE INDEX _authors_v_blocks_hero_order_idx ON public._authors_v_blocks_hero USING btree (_order);

CREATE INDEX _authors_v_blocks_hero_parent_id_idx ON public._authors_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_hero_path_idx ON public._authors_v_blocks_hero USING btree (_path);

CREATE INDEX _authors_v_blocks_related_services_items_order_idx ON public._authors_v_blocks_related_services_items USING btree (_order);

CREATE INDEX _authors_v_blocks_related_services_items_parent_id_idx ON public._authors_v_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_related_services_order_idx ON public._authors_v_blocks_related_services USING btree (_order);

CREATE INDEX _authors_v_blocks_related_services_parent_id_idx ON public._authors_v_blocks_related_services USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_related_services_path_idx ON public._authors_v_blocks_related_services USING btree (_path);

CREATE INDEX _authors_v_blocks_text_content_order_idx ON public._authors_v_blocks_text_content USING btree (_order);

CREATE INDEX _authors_v_blocks_text_content_parent_id_idx ON public._authors_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _authors_v_blocks_text_content_path_idx ON public._authors_v_blocks_text_content USING btree (_path);

CREATE INDEX _authors_v_created_at_idx ON public._authors_v USING btree (created_at);

CREATE INDEX _authors_v_latest_idx ON public._authors_v USING btree (latest);

CREATE INDEX _authors_v_parent_idx ON public._authors_v USING btree (parent_id);

CREATE INDEX _authors_v_rels_districts_id_idx ON public._authors_v_rels USING btree (districts_id);

CREATE INDEX _authors_v_rels_order_idx ON public._authors_v_rels USING btree ("order");

CREATE INDEX _authors_v_rels_parent_idx ON public._authors_v_rels USING btree (parent_id);

CREATE INDEX _authors_v_rels_path_idx ON public._authors_v_rels USING btree (path);

CREATE INDEX _authors_v_updated_at_idx ON public._authors_v USING btree (updated_at);

CREATE INDEX _authors_v_version_credentials_order_idx ON public._authors_v_version_credentials USING btree (_order);

CREATE INDEX _authors_v_version_credentials_parent_id_idx ON public._authors_v_version_credentials USING btree (_parent_id);

CREATE INDEX _authors_v_version_knows_about_order_idx ON public._authors_v_version_knows_about USING btree (_order);

CREATE INDEX _authors_v_version_knows_about_parent_id_idx ON public._authors_v_version_knows_about USING btree (_parent_id);

CREATE INDEX _authors_v_version_robots_directives_order_idx ON public._authors_v_version_robots_directives USING btree ("order");

CREATE INDEX _authors_v_version_robots_directives_parent_idx ON public._authors_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _authors_v_version_same_as_order_idx ON public._authors_v_version_same_as USING btree (_order);

CREATE INDEX _authors_v_version_same_as_parent_id_idx ON public._authors_v_version_same_as USING btree (_parent_id);

CREATE INDEX _authors_v_version_version__status_idx ON public._authors_v USING btree (version__status);

CREATE INDEX _authors_v_version_version_avatar_idx ON public._authors_v USING btree (version_avatar_id);

CREATE INDEX _authors_v_version_version_created_at_idx ON public._authors_v USING btree (version_created_at);

CREATE INDEX _authors_v_version_version_slug_idx ON public._authors_v USING btree (version_slug);

CREATE INDEX _authors_v_version_version_updated_at_idx ON public._authors_v USING btree (version_updated_at);

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_items_order_idx ON public._b2b_pages_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_items_parent_id_idx ON public._b2b_pages_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_order_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_parent_id_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_path_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_cta_banner_order_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_cta_banner_parent_id_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_cta_banner_path_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_faq_items_order_idx ON public._b2b_pages_v_blocks_faq_items USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_faq_items_parent_id_idx ON public._b2b_pages_v_blocks_faq_items USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_faq_order_idx ON public._b2b_pages_v_blocks_faq USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_faq_parent_id_idx ON public._b2b_pages_v_blocks_faq USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_faq_path_idx ON public._b2b_pages_v_blocks_faq USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_hero_image_idx ON public._b2b_pages_v_blocks_hero USING btree (image_id);

CREATE INDEX _b2b_pages_v_blocks_hero_order_idx ON public._b2b_pages_v_blocks_hero USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_hero_parent_id_idx ON public._b2b_pages_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_hero_path_idx ON public._b2b_pages_v_blocks_hero USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_lead_form_order_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_lead_form_parent_id_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_lead_form_path_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_mini_case_case_ref_idx ON public._b2b_pages_v_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_facts_order_idx ON public._b2b_pages_v_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_idx ON public._b2b_pages_v_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_inline_photo_idx ON public._b2b_pages_v_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX _b2b_pages_v_blocks_mini_case_order_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_mini_case_parent_id_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_mini_case_path_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_services_grid_items_order_idx ON public._b2b_pages_v_blocks_services_grid_items USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_services_grid_items_parent_id_idx ON public._b2b_pages_v_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_services_grid_order_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_services_grid_parent_id_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_services_grid_path_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_text_content_order_idx ON public._b2b_pages_v_blocks_text_content USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_text_content_parent_id_idx ON public._b2b_pages_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_text_content_path_idx ON public._b2b_pages_v_blocks_text_content USING btree (_path);

CREATE INDEX _b2b_pages_v_blocks_tldr_order_idx ON public._b2b_pages_v_blocks_tldr USING btree (_order);

CREATE INDEX _b2b_pages_v_blocks_tldr_parent_id_idx ON public._b2b_pages_v_blocks_tldr USING btree (_parent_id);

CREATE INDEX _b2b_pages_v_blocks_tldr_path_idx ON public._b2b_pages_v_blocks_tldr USING btree (_path);

CREATE INDEX _b2b_pages_v_created_at_idx ON public._b2b_pages_v USING btree (created_at);

CREATE INDEX _b2b_pages_v_latest_idx ON public._b2b_pages_v USING btree (latest);

CREATE INDEX _b2b_pages_v_parent_idx ON public._b2b_pages_v USING btree (parent_id);

CREATE INDEX _b2b_pages_v_rels_cases_id_idx ON public._b2b_pages_v_rels USING btree (cases_id);

CREATE INDEX _b2b_pages_v_rels_order_idx ON public._b2b_pages_v_rels USING btree ("order");

CREATE INDEX _b2b_pages_v_rels_parent_idx ON public._b2b_pages_v_rels USING btree (parent_id);

CREATE INDEX _b2b_pages_v_rels_path_idx ON public._b2b_pages_v_rels USING btree (path);

CREATE INDEX _b2b_pages_v_rels_services_id_idx ON public._b2b_pages_v_rels USING btree (services_id);

CREATE INDEX _b2b_pages_v_updated_at_idx ON public._b2b_pages_v USING btree (updated_at);

CREATE INDEX _b2b_pages_v_version_robots_directives_order_idx ON public._b2b_pages_v_version_robots_directives USING btree ("order");

CREATE INDEX _b2b_pages_v_version_robots_directives_parent_idx ON public._b2b_pages_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _b2b_pages_v_version_version__status_idx ON public._b2b_pages_v USING btree (version__status);

CREATE INDEX _b2b_pages_v_version_version_created_at_idx ON public._b2b_pages_v USING btree (version_created_at);

CREATE INDEX _b2b_pages_v_version_version_slug_idx ON public._b2b_pages_v USING btree (version_slug);

CREATE INDEX _b2b_pages_v_version_version_updated_at_idx ON public._b2b_pages_v USING btree (version_updated_at);

CREATE INDEX _blog_v_autosave_idx ON public._blog_v USING btree (autosave);

CREATE INDEX _blog_v_blocks_breadcrumbs_items_order_idx ON public._blog_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _blog_v_blocks_breadcrumbs_items_parent_id_idx ON public._blog_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_breadcrumbs_order_idx ON public._blog_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _blog_v_blocks_breadcrumbs_parent_id_idx ON public._blog_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_breadcrumbs_path_idx ON public._blog_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _blog_v_blocks_cta_banner_order_idx ON public._blog_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _blog_v_blocks_cta_banner_parent_id_idx ON public._blog_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_cta_banner_path_idx ON public._blog_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _blog_v_blocks_faq_items_order_idx ON public._blog_v_blocks_faq_items USING btree (_order);

CREATE INDEX _blog_v_blocks_faq_items_parent_id_idx ON public._blog_v_blocks_faq_items USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_faq_order_idx ON public._blog_v_blocks_faq USING btree (_order);

CREATE INDEX _blog_v_blocks_faq_parent_id_idx ON public._blog_v_blocks_faq USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_faq_path_idx ON public._blog_v_blocks_faq USING btree (_path);

CREATE INDEX _blog_v_blocks_hero_image_idx ON public._blog_v_blocks_hero USING btree (image_id);

CREATE INDEX _blog_v_blocks_hero_order_idx ON public._blog_v_blocks_hero USING btree (_order);

CREATE INDEX _blog_v_blocks_hero_parent_id_idx ON public._blog_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_hero_path_idx ON public._blog_v_blocks_hero USING btree (_path);

CREATE INDEX _blog_v_blocks_related_services_items_order_idx ON public._blog_v_blocks_related_services_items USING btree (_order);

CREATE INDEX _blog_v_blocks_related_services_items_parent_id_idx ON public._blog_v_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_related_services_order_idx ON public._blog_v_blocks_related_services USING btree (_order);

CREATE INDEX _blog_v_blocks_related_services_parent_id_idx ON public._blog_v_blocks_related_services USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_related_services_path_idx ON public._blog_v_blocks_related_services USING btree (_path);

CREATE INDEX _blog_v_blocks_text_content_order_idx ON public._blog_v_blocks_text_content USING btree (_order);

CREATE INDEX _blog_v_blocks_text_content_parent_id_idx ON public._blog_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_text_content_path_idx ON public._blog_v_blocks_text_content USING btree (_path);

CREATE INDEX _blog_v_blocks_tldr_order_idx ON public._blog_v_blocks_tldr USING btree (_order);

CREATE INDEX _blog_v_blocks_tldr_parent_id_idx ON public._blog_v_blocks_tldr USING btree (_parent_id);

CREATE INDEX _blog_v_blocks_tldr_path_idx ON public._blog_v_blocks_tldr USING btree (_path);

CREATE INDEX _blog_v_created_at_idx ON public._blog_v USING btree (created_at);

CREATE INDEX _blog_v_latest_idx ON public._blog_v USING btree (latest);

CREATE INDEX _blog_v_parent_idx ON public._blog_v USING btree (parent_id);

CREATE INDEX _blog_v_rels_districts_id_idx ON public._blog_v_rels USING btree (districts_id);

CREATE INDEX _blog_v_rels_order_idx ON public._blog_v_rels USING btree ("order");

CREATE INDEX _blog_v_rels_parent_idx ON public._blog_v_rels USING btree (parent_id);

CREATE INDEX _blog_v_rels_path_idx ON public._blog_v_rels USING btree (path);

CREATE INDEX _blog_v_rels_services_id_idx ON public._blog_v_rels USING btree (services_id);

CREATE INDEX _blog_v_updated_at_idx ON public._blog_v USING btree (updated_at);

CREATE INDEX _blog_v_version_faq_block_order_idx ON public._blog_v_version_faq_block USING btree (_order);

CREATE INDEX _blog_v_version_faq_block_parent_id_idx ON public._blog_v_version_faq_block USING btree (_parent_id);

CREATE INDEX _blog_v_version_how_to_steps_order_idx ON public._blog_v_version_how_to_steps USING btree (_order);

CREATE INDEX _blog_v_version_how_to_steps_parent_id_idx ON public._blog_v_version_how_to_steps USING btree (_parent_id);

CREATE INDEX _blog_v_version_robots_directives_order_idx ON public._blog_v_version_robots_directives USING btree ("order");

CREATE INDEX _blog_v_version_robots_directives_parent_idx ON public._blog_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _blog_v_version_version__status_idx ON public._blog_v USING btree (version__status);

CREATE INDEX _blog_v_version_version_author_idx ON public._blog_v USING btree (version_author_id);

CREATE INDEX _blog_v_version_version_created_at_idx ON public._blog_v USING btree (version_created_at);

CREATE INDEX _blog_v_version_version_hero_image_idx ON public._blog_v USING btree (version_hero_image_id);

CREATE INDEX _blog_v_version_version_og_image_idx ON public._blog_v USING btree (version_og_image_id);

CREATE INDEX _blog_v_version_version_reviewed_by_idx ON public._blog_v USING btree (version_reviewed_by_id);

CREATE INDEX _blog_v_version_version_slug_idx ON public._blog_v USING btree (version_slug);

CREATE INDEX _blog_v_version_version_updated_at_idx ON public._blog_v USING btree (version_updated_at);

CREATE INDEX _cases_v_blocks_breadcrumbs_items_order_idx ON public._cases_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _cases_v_blocks_breadcrumbs_items_parent_id_idx ON public._cases_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_breadcrumbs_order_idx ON public._cases_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _cases_v_blocks_breadcrumbs_parent_id_idx ON public._cases_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_breadcrumbs_path_idx ON public._cases_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _cases_v_blocks_cta_banner_order_idx ON public._cases_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _cases_v_blocks_cta_banner_parent_id_idx ON public._cases_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_cta_banner_path_idx ON public._cases_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _cases_v_blocks_hero_image_idx ON public._cases_v_blocks_hero USING btree (image_id);

CREATE INDEX _cases_v_blocks_hero_order_idx ON public._cases_v_blocks_hero USING btree (_order);

CREATE INDEX _cases_v_blocks_hero_parent_id_idx ON public._cases_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_hero_path_idx ON public._cases_v_blocks_hero USING btree (_path);

CREATE INDEX _cases_v_blocks_mini_case_case_ref_idx ON public._cases_v_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX _cases_v_blocks_mini_case_inline_facts_order_idx ON public._cases_v_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX _cases_v_blocks_mini_case_inline_facts_parent_id_idx ON public._cases_v_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_mini_case_inline_inline_photo_idx ON public._cases_v_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX _cases_v_blocks_mini_case_order_idx ON public._cases_v_blocks_mini_case USING btree (_order);

CREATE INDEX _cases_v_blocks_mini_case_parent_id_idx ON public._cases_v_blocks_mini_case USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_mini_case_path_idx ON public._cases_v_blocks_mini_case USING btree (_path);

CREATE INDEX _cases_v_blocks_related_services_items_order_idx ON public._cases_v_blocks_related_services_items USING btree (_order);

CREATE INDEX _cases_v_blocks_related_services_items_parent_id_idx ON public._cases_v_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_related_services_order_idx ON public._cases_v_blocks_related_services USING btree (_order);

CREATE INDEX _cases_v_blocks_related_services_parent_id_idx ON public._cases_v_blocks_related_services USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_related_services_path_idx ON public._cases_v_blocks_related_services USING btree (_path);

CREATE INDEX _cases_v_blocks_text_content_order_idx ON public._cases_v_blocks_text_content USING btree (_order);

CREATE INDEX _cases_v_blocks_text_content_parent_id_idx ON public._cases_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _cases_v_blocks_text_content_path_idx ON public._cases_v_blocks_text_content USING btree (_path);

CREATE INDEX _cases_v_created_at_idx ON public._cases_v USING btree (created_at);

CREATE INDEX _cases_v_latest_idx ON public._cases_v USING btree (latest);

CREATE INDEX _cases_v_parent_idx ON public._cases_v USING btree (parent_id);

CREATE INDEX _cases_v_rels_authors_id_idx ON public._cases_v_rels USING btree (authors_id);

CREATE INDEX _cases_v_rels_order_idx ON public._cases_v_rels USING btree ("order");

CREATE INDEX _cases_v_rels_parent_idx ON public._cases_v_rels USING btree (parent_id);

CREATE INDEX _cases_v_rels_path_idx ON public._cases_v_rels USING btree (path);

CREATE INDEX _cases_v_updated_at_idx ON public._cases_v USING btree (updated_at);

CREATE INDEX _cases_v_version_photos_after_image_idx ON public._cases_v_version_photos_after USING btree (image_id);

CREATE INDEX _cases_v_version_photos_after_order_idx ON public._cases_v_version_photos_after USING btree (_order);

CREATE INDEX _cases_v_version_photos_after_parent_id_idx ON public._cases_v_version_photos_after USING btree (_parent_id);

CREATE INDEX _cases_v_version_photos_before_image_idx ON public._cases_v_version_photos_before USING btree (image_id);

CREATE INDEX _cases_v_version_photos_before_order_idx ON public._cases_v_version_photos_before USING btree (_order);

CREATE INDEX _cases_v_version_photos_before_parent_id_idx ON public._cases_v_version_photos_before USING btree (_parent_id);

CREATE INDEX _cases_v_version_robots_directives_order_idx ON public._cases_v_version_robots_directives USING btree ("order");

CREATE INDEX _cases_v_version_robots_directives_parent_idx ON public._cases_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _cases_v_version_version__status_idx ON public._cases_v USING btree (version__status);

CREATE INDEX _cases_v_version_version_created_at_idx ON public._cases_v USING btree (version_created_at);

CREATE INDEX _cases_v_version_version_district_idx ON public._cases_v USING btree (version_district_id);

CREATE INDEX _cases_v_version_version_og_image_idx ON public._cases_v USING btree (version_og_image_id);

CREATE INDEX _cases_v_version_version_reviewed_by_idx ON public._cases_v USING btree (version_reviewed_by_id);

CREATE INDEX _cases_v_version_version_service_idx ON public._cases_v USING btree (version_service_id);

CREATE INDEX _cases_v_version_version_slug_idx ON public._cases_v USING btree (version_slug);

CREATE INDEX _cases_v_version_version_updated_at_idx ON public._cases_v USING btree (version_updated_at);

CREATE INDEX _districts_v_blocks_breadcrumbs_items_order_idx ON public._districts_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _districts_v_blocks_breadcrumbs_items_parent_id_idx ON public._districts_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_breadcrumbs_order_idx ON public._districts_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _districts_v_blocks_breadcrumbs_parent_id_idx ON public._districts_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_breadcrumbs_path_idx ON public._districts_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _districts_v_blocks_hero_image_idx ON public._districts_v_blocks_hero USING btree (image_id);

CREATE INDEX _districts_v_blocks_hero_order_idx ON public._districts_v_blocks_hero USING btree (_order);

CREATE INDEX _districts_v_blocks_hero_parent_id_idx ON public._districts_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_hero_path_idx ON public._districts_v_blocks_hero USING btree (_path);

CREATE INDEX _districts_v_blocks_lead_form_order_idx ON public._districts_v_blocks_lead_form USING btree (_order);

CREATE INDEX _districts_v_blocks_lead_form_parent_id_idx ON public._districts_v_blocks_lead_form USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_lead_form_path_idx ON public._districts_v_blocks_lead_form USING btree (_path);

CREATE INDEX _districts_v_blocks_mini_case_case_ref_idx ON public._districts_v_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX _districts_v_blocks_mini_case_inline_facts_order_idx ON public._districts_v_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX _districts_v_blocks_mini_case_inline_facts_parent_id_idx ON public._districts_v_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_mini_case_inline_inline_photo_idx ON public._districts_v_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX _districts_v_blocks_mini_case_order_idx ON public._districts_v_blocks_mini_case USING btree (_order);

CREATE INDEX _districts_v_blocks_mini_case_parent_id_idx ON public._districts_v_blocks_mini_case USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_mini_case_path_idx ON public._districts_v_blocks_mini_case USING btree (_path);

CREATE INDEX _districts_v_blocks_neighbor_districts_items_order_idx ON public._districts_v_blocks_neighbor_districts_items USING btree (_order);

CREATE INDEX _districts_v_blocks_neighbor_districts_items_parent_id_idx ON public._districts_v_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_neighbor_districts_order_idx ON public._districts_v_blocks_neighbor_districts USING btree (_order);

CREATE INDEX _districts_v_blocks_neighbor_districts_parent_id_idx ON public._districts_v_blocks_neighbor_districts USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_neighbor_districts_path_idx ON public._districts_v_blocks_neighbor_districts USING btree (_path);

CREATE INDEX _districts_v_blocks_services_grid_items_order_idx ON public._districts_v_blocks_services_grid_items USING btree (_order);

CREATE INDEX _districts_v_blocks_services_grid_items_parent_id_idx ON public._districts_v_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_services_grid_order_idx ON public._districts_v_blocks_services_grid USING btree (_order);

CREATE INDEX _districts_v_blocks_services_grid_parent_id_idx ON public._districts_v_blocks_services_grid USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_services_grid_path_idx ON public._districts_v_blocks_services_grid USING btree (_path);

CREATE INDEX _districts_v_blocks_text_content_order_idx ON public._districts_v_blocks_text_content USING btree (_order);

CREATE INDEX _districts_v_blocks_text_content_parent_id_idx ON public._districts_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_text_content_path_idx ON public._districts_v_blocks_text_content USING btree (_path);

CREATE INDEX _districts_v_blocks_tldr_order_idx ON public._districts_v_blocks_tldr USING btree (_order);

CREATE INDEX _districts_v_blocks_tldr_parent_id_idx ON public._districts_v_blocks_tldr USING btree (_parent_id);

CREATE INDEX _districts_v_blocks_tldr_path_idx ON public._districts_v_blocks_tldr USING btree (_path);

CREATE INDEX _districts_v_created_at_idx ON public._districts_v USING btree (created_at);

CREATE INDEX _districts_v_latest_idx ON public._districts_v USING btree (latest);

CREATE INDEX _districts_v_parent_idx ON public._districts_v USING btree (parent_id);

CREATE INDEX _districts_v_rels_districts_id_idx ON public._districts_v_rels USING btree (districts_id);

CREATE INDEX _districts_v_rels_order_idx ON public._districts_v_rels USING btree ("order");

CREATE INDEX _districts_v_rels_parent_idx ON public._districts_v_rels USING btree (parent_id);

CREATE INDEX _districts_v_rels_path_idx ON public._districts_v_rels USING btree (path);

CREATE INDEX _districts_v_rels_services_id_idx ON public._districts_v_rels USING btree (services_id);

CREATE INDEX _districts_v_updated_at_idx ON public._districts_v USING btree (updated_at);

CREATE INDEX _districts_v_version_landmarks_order_idx ON public._districts_v_version_landmarks USING btree (_order);

CREATE INDEX _districts_v_version_landmarks_parent_id_idx ON public._districts_v_version_landmarks USING btree (_parent_id);

CREATE INDEX _districts_v_version_robots_directives_order_idx ON public._districts_v_version_robots_directives USING btree ("order");

CREATE INDEX _districts_v_version_robots_directives_parent_idx ON public._districts_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _districts_v_version_version__status_idx ON public._districts_v USING btree (version__status);

CREATE INDEX _districts_v_version_version_created_at_idx ON public._districts_v USING btree (version_created_at);

CREATE INDEX _districts_v_version_version_hero_image_idx ON public._districts_v USING btree (version_hero_image_id);

CREATE INDEX _districts_v_version_version_photo_geo_idx ON public._districts_v USING btree (version_photo_geo_id);

CREATE INDEX _districts_v_version_version_slug_idx ON public._districts_v USING btree (version_slug);

CREATE INDEX _districts_v_version_version_updated_at_idx ON public._districts_v USING btree (version_updated_at);

CREATE INDEX _reviews_v_created_at_idx ON public._reviews_v USING btree (created_at);

CREATE INDEX _reviews_v_latest_idx ON public._reviews_v USING btree (latest);

CREATE INDEX _reviews_v_parent_idx ON public._reviews_v USING btree (parent_id);

CREATE INDEX _reviews_v_updated_at_idx ON public._reviews_v USING btree (updated_at);

CREATE INDEX _reviews_v_version_version__status_idx ON public._reviews_v USING btree (version__status);

CREATE INDEX _reviews_v_version_version_created_at_idx ON public._reviews_v USING btree (version_created_at);

CREATE INDEX _reviews_v_version_version_district_idx ON public._reviews_v USING btree (version_district_id);

CREATE INDEX _reviews_v_version_version_service_idx ON public._reviews_v USING btree (version_service_id);

CREATE INDEX _reviews_v_version_version_updated_at_idx ON public._reviews_v USING btree (version_updated_at);

CREATE INDEX _service_districts_v_blocks_breadcrumbs_items_order_idx ON public._service_districts_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _service_districts_v_blocks_breadcrumbs_items_parent_id_idx ON public._service_districts_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_breadcrumbs_order_idx ON public._service_districts_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _service_districts_v_blocks_breadcrumbs_parent_id_idx ON public._service_districts_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_breadcrumbs_path_idx ON public._service_districts_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _service_districts_v_blocks_calculator_placeholder_order_idx ON public._service_districts_v_blocks_calculator_placeholder USING btree (_order);

CREATE INDEX _service_districts_v_blocks_calculator_placeholder_parent_id_id ON public._service_districts_v_blocks_calculator_placeholder USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_calculator_placeholder_path_idx ON public._service_districts_v_blocks_calculator_placeholder USING btree (_path);

CREATE INDEX _service_districts_v_blocks_cta_banner_order_idx ON public._service_districts_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _service_districts_v_blocks_cta_banner_parent_id_idx ON public._service_districts_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_cta_banner_path_idx ON public._service_districts_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _service_districts_v_blocks_faq_items_order_idx ON public._service_districts_v_blocks_faq_items USING btree (_order);

CREATE INDEX _service_districts_v_blocks_faq_items_parent_id_idx ON public._service_districts_v_blocks_faq_items USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_faq_order_idx ON public._service_districts_v_blocks_faq USING btree (_order);

CREATE INDEX _service_districts_v_blocks_faq_parent_id_idx ON public._service_districts_v_blocks_faq USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_faq_path_idx ON public._service_districts_v_blocks_faq USING btree (_path);

CREATE INDEX _service_districts_v_blocks_hero_image_idx ON public._service_districts_v_blocks_hero USING btree (image_id);

CREATE INDEX _service_districts_v_blocks_hero_order_idx ON public._service_districts_v_blocks_hero USING btree (_order);

CREATE INDEX _service_districts_v_blocks_hero_parent_id_idx ON public._service_districts_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_hero_path_idx ON public._service_districts_v_blocks_hero USING btree (_path);

CREATE INDEX _service_districts_v_blocks_lead_form_order_idx ON public._service_districts_v_blocks_lead_form USING btree (_order);

CREATE INDEX _service_districts_v_blocks_lead_form_parent_id_idx ON public._service_districts_v_blocks_lead_form USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_lead_form_path_idx ON public._service_districts_v_blocks_lead_form USING btree (_path);

CREATE INDEX _service_districts_v_blocks_neighbor_districts_items_order_idx ON public._service_districts_v_blocks_neighbor_districts_items USING btree (_order);

CREATE INDEX _service_districts_v_blocks_neighbor_districts_items_parent_id_ ON public._service_districts_v_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_neighbor_districts_order_idx ON public._service_districts_v_blocks_neighbor_districts USING btree (_order);

CREATE INDEX _service_districts_v_blocks_neighbor_districts_parent_id_idx ON public._service_districts_v_blocks_neighbor_districts USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_neighbor_districts_path_idx ON public._service_districts_v_blocks_neighbor_districts USING btree (_path);

CREATE INDEX _service_districts_v_blocks_pricing_table_order_idx ON public._service_districts_v_blocks_pricing_table USING btree (_order);

CREATE INDEX _service_districts_v_blocks_pricing_table_parent_id_idx ON public._service_districts_v_blocks_pricing_table USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_pricing_table_path_idx ON public._service_districts_v_blocks_pricing_table USING btree (_path);

CREATE INDEX _service_districts_v_blocks_pricing_table_tiers_features_order_ ON public._service_districts_v_blocks_pricing_table_tiers_features USING btree (_order);

CREATE INDEX _service_districts_v_blocks_pricing_table_tiers_features_parent ON public._service_districts_v_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_pricing_table_tiers_order_idx ON public._service_districts_v_blocks_pricing_table_tiers USING btree (_order);

CREATE INDEX _service_districts_v_blocks_pricing_table_tiers_parent_id_idx ON public._service_districts_v_blocks_pricing_table_tiers USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_process_steps_order_idx ON public._service_districts_v_blocks_process_steps USING btree (_order);

CREATE INDEX _service_districts_v_blocks_process_steps_parent_id_idx ON public._service_districts_v_blocks_process_steps USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_process_steps_path_idx ON public._service_districts_v_blocks_process_steps USING btree (_path);

CREATE INDEX _service_districts_v_blocks_process_steps_steps_order_idx ON public._service_districts_v_blocks_process_steps_steps USING btree (_order);

CREATE INDEX _service_districts_v_blocks_process_steps_steps_parent_id_idx ON public._service_districts_v_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_related_services_items_order_idx ON public._service_districts_v_blocks_related_services_items USING btree (_order);

CREATE INDEX _service_districts_v_blocks_related_services_items_parent_id_id ON public._service_districts_v_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_related_services_order_idx ON public._service_districts_v_blocks_related_services USING btree (_order);

CREATE INDEX _service_districts_v_blocks_related_services_parent_id_idx ON public._service_districts_v_blocks_related_services USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_related_services_path_idx ON public._service_districts_v_blocks_related_services USING btree (_path);

CREATE INDEX _service_districts_v_blocks_text_content_order_idx ON public._service_districts_v_blocks_text_content USING btree (_order);

CREATE INDEX _service_districts_v_blocks_text_content_parent_id_idx ON public._service_districts_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_text_content_path_idx ON public._service_districts_v_blocks_text_content USING btree (_path);

CREATE INDEX _service_districts_v_blocks_tldr_order_idx ON public._service_districts_v_blocks_tldr USING btree (_order);

CREATE INDEX _service_districts_v_blocks_tldr_parent_id_idx ON public._service_districts_v_blocks_tldr USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_tldr_path_idx ON public._service_districts_v_blocks_tldr USING btree (_path);

CREATE INDEX _service_districts_v_created_at_idx ON public._service_districts_v USING btree (created_at);

CREATE INDEX _service_districts_v_latest_idx ON public._service_districts_v USING btree (latest);

CREATE INDEX _service_districts_v_parent_idx ON public._service_districts_v USING btree (parent_id);

CREATE INDEX _service_districts_v_rels_order_idx ON public._service_districts_v_rels USING btree ("order");

CREATE INDEX _service_districts_v_rels_parent_idx ON public._service_districts_v_rels USING btree (parent_id);

CREATE INDEX _service_districts_v_rels_path_idx ON public._service_districts_v_rels USING btree (path);

CREATE INDEX _service_districts_v_rels_services_id_idx ON public._service_districts_v_rels USING btree (services_id);

CREATE INDEX _service_districts_v_updated_at_idx ON public._service_districts_v USING btree (updated_at);

CREATE INDEX _service_districts_v_version_local_faq_order_idx ON public._service_districts_v_version_local_faq USING btree (_order);

CREATE INDEX _service_districts_v_version_local_faq_parent_id_idx ON public._service_districts_v_version_local_faq USING btree (_parent_id);

CREATE INDEX _service_districts_v_version_local_landmarks_order_idx ON public._service_districts_v_version_local_landmarks USING btree (_order);

CREATE INDEX _service_districts_v_version_local_landmarks_parent_id_idx ON public._service_districts_v_version_local_landmarks USING btree (_parent_id);

CREATE INDEX _service_districts_v_version_version__status_idx ON public._service_districts_v USING btree (version__status);

CREATE INDEX _service_districts_v_version_version_created_at_idx ON public._service_districts_v USING btree (version_created_at);

CREATE INDEX _service_districts_v_version_version_district_idx ON public._service_districts_v USING btree (version_district_id);

CREATE INDEX _service_districts_v_version_version_mini_case_idx ON public._service_districts_v USING btree (version_mini_case_id);

CREATE INDEX _service_districts_v_version_version_og_image_idx ON public._service_districts_v USING btree (version_og_image_id);

CREATE INDEX _service_districts_v_version_version_reviewed_by_idx ON public._service_districts_v USING btree (version_reviewed_by_id);

CREATE INDEX _service_districts_v_version_version_service_idx ON public._service_districts_v USING btree (version_service_id);

CREATE INDEX _service_districts_v_version_version_sub_service_slug_idx ON public._service_districts_v USING btree (version_sub_service_slug);

CREATE INDEX _service_districts_v_version_version_updated_at_idx ON public._service_districts_v USING btree (version_updated_at);

CREATE INDEX _services_v_autosave_idx ON public._services_v USING btree (autosave);

CREATE INDEX _services_v_blocks_breadcrumbs_items_order_idx ON public._services_v_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX _services_v_blocks_breadcrumbs_items_parent_id_idx ON public._services_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX _services_v_blocks_breadcrumbs_order_idx ON public._services_v_blocks_breadcrumbs USING btree (_order);

CREATE INDEX _services_v_blocks_breadcrumbs_parent_id_idx ON public._services_v_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX _services_v_blocks_breadcrumbs_path_idx ON public._services_v_blocks_breadcrumbs USING btree (_path);

CREATE INDEX _services_v_blocks_calculator_placeholder_order_idx ON public._services_v_blocks_calculator_placeholder USING btree (_order);

CREATE INDEX _services_v_blocks_calculator_placeholder_parent_id_idx ON public._services_v_blocks_calculator_placeholder USING btree (_parent_id);

CREATE INDEX _services_v_blocks_calculator_placeholder_path_idx ON public._services_v_blocks_calculator_placeholder USING btree (_path);

CREATE INDEX _services_v_blocks_cta_banner_order_idx ON public._services_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _services_v_blocks_cta_banner_parent_id_idx ON public._services_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _services_v_blocks_cta_banner_path_idx ON public._services_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _services_v_blocks_faq_items_order_idx ON public._services_v_blocks_faq_items USING btree (_order);

CREATE INDEX _services_v_blocks_faq_items_parent_id_idx ON public._services_v_blocks_faq_items USING btree (_parent_id);

CREATE INDEX _services_v_blocks_faq_order_idx ON public._services_v_blocks_faq USING btree (_order);

CREATE INDEX _services_v_blocks_faq_parent_id_idx ON public._services_v_blocks_faq USING btree (_parent_id);

CREATE INDEX _services_v_blocks_faq_path_idx ON public._services_v_blocks_faq USING btree (_path);

CREATE INDEX _services_v_blocks_hero_image_idx ON public._services_v_blocks_hero USING btree (image_id);

CREATE INDEX _services_v_blocks_hero_order_idx ON public._services_v_blocks_hero USING btree (_order);

CREATE INDEX _services_v_blocks_hero_parent_id_idx ON public._services_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _services_v_blocks_hero_path_idx ON public._services_v_blocks_hero USING btree (_path);

CREATE INDEX _services_v_blocks_lead_form_order_idx ON public._services_v_blocks_lead_form USING btree (_order);

CREATE INDEX _services_v_blocks_lead_form_parent_id_idx ON public._services_v_blocks_lead_form USING btree (_parent_id);

CREATE INDEX _services_v_blocks_lead_form_path_idx ON public._services_v_blocks_lead_form USING btree (_path);

CREATE INDEX _services_v_blocks_mini_case_case_ref_idx ON public._services_v_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX _services_v_blocks_mini_case_inline_facts_order_idx ON public._services_v_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX _services_v_blocks_mini_case_inline_facts_parent_id_idx ON public._services_v_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX _services_v_blocks_mini_case_inline_inline_photo_idx ON public._services_v_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX _services_v_blocks_mini_case_order_idx ON public._services_v_blocks_mini_case USING btree (_order);

CREATE INDEX _services_v_blocks_mini_case_parent_id_idx ON public._services_v_blocks_mini_case USING btree (_parent_id);

CREATE INDEX _services_v_blocks_mini_case_path_idx ON public._services_v_blocks_mini_case USING btree (_path);

CREATE INDEX _services_v_blocks_pricing_table_order_idx ON public._services_v_blocks_pricing_table USING btree (_order);

CREATE INDEX _services_v_blocks_pricing_table_parent_id_idx ON public._services_v_blocks_pricing_table USING btree (_parent_id);

CREATE INDEX _services_v_blocks_pricing_table_path_idx ON public._services_v_blocks_pricing_table USING btree (_path);

CREATE INDEX _services_v_blocks_pricing_table_tiers_features_order_idx ON public._services_v_blocks_pricing_table_tiers_features USING btree (_order);

CREATE INDEX _services_v_blocks_pricing_table_tiers_features_parent_id_idx ON public._services_v_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX _services_v_blocks_pricing_table_tiers_order_idx ON public._services_v_blocks_pricing_table_tiers USING btree (_order);

CREATE INDEX _services_v_blocks_pricing_table_tiers_parent_id_idx ON public._services_v_blocks_pricing_table_tiers USING btree (_parent_id);

CREATE INDEX _services_v_blocks_process_steps_order_idx ON public._services_v_blocks_process_steps USING btree (_order);

CREATE INDEX _services_v_blocks_process_steps_parent_id_idx ON public._services_v_blocks_process_steps USING btree (_parent_id);

CREATE INDEX _services_v_blocks_process_steps_path_idx ON public._services_v_blocks_process_steps USING btree (_path);

CREATE INDEX _services_v_blocks_process_steps_steps_order_idx ON public._services_v_blocks_process_steps_steps USING btree (_order);

CREATE INDEX _services_v_blocks_process_steps_steps_parent_id_idx ON public._services_v_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX _services_v_blocks_related_services_items_order_idx ON public._services_v_blocks_related_services_items USING btree (_order);

CREATE INDEX _services_v_blocks_related_services_items_parent_id_idx ON public._services_v_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX _services_v_blocks_related_services_order_idx ON public._services_v_blocks_related_services USING btree (_order);

CREATE INDEX _services_v_blocks_related_services_parent_id_idx ON public._services_v_blocks_related_services USING btree (_parent_id);

CREATE INDEX _services_v_blocks_related_services_path_idx ON public._services_v_blocks_related_services USING btree (_path);

CREATE INDEX _services_v_blocks_services_grid_items_order_idx ON public._services_v_blocks_services_grid_items USING btree (_order);

CREATE INDEX _services_v_blocks_services_grid_items_parent_id_idx ON public._services_v_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX _services_v_blocks_services_grid_order_idx ON public._services_v_blocks_services_grid USING btree (_order);

CREATE INDEX _services_v_blocks_services_grid_parent_id_idx ON public._services_v_blocks_services_grid USING btree (_parent_id);

CREATE INDEX _services_v_blocks_services_grid_path_idx ON public._services_v_blocks_services_grid USING btree (_path);

CREATE INDEX _services_v_blocks_text_content_order_idx ON public._services_v_blocks_text_content USING btree (_order);

CREATE INDEX _services_v_blocks_text_content_parent_id_idx ON public._services_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _services_v_blocks_text_content_path_idx ON public._services_v_blocks_text_content USING btree (_path);

CREATE INDEX _services_v_blocks_tldr_order_idx ON public._services_v_blocks_tldr USING btree (_order);

CREATE INDEX _services_v_blocks_tldr_parent_id_idx ON public._services_v_blocks_tldr USING btree (_parent_id);

CREATE INDEX _services_v_blocks_tldr_path_idx ON public._services_v_blocks_tldr USING btree (_path);

CREATE INDEX _services_v_created_at_idx ON public._services_v USING btree (created_at);

CREATE INDEX _services_v_latest_idx ON public._services_v USING btree (latest);

CREATE INDEX _services_v_parent_idx ON public._services_v USING btree (parent_id);

CREATE INDEX _services_v_rels_order_idx ON public._services_v_rels USING btree ("order");

CREATE INDEX _services_v_rels_parent_idx ON public._services_v_rels USING btree (parent_id);

CREATE INDEX _services_v_rels_path_idx ON public._services_v_rels USING btree (path);

CREATE INDEX _services_v_rels_services_id_idx ON public._services_v_rels USING btree (services_id);

CREATE INDEX _services_v_updated_at_idx ON public._services_v USING btree (updated_at);

CREATE INDEX _services_v_version_faq_global_order_idx ON public._services_v_version_faq_global USING btree (_order);

CREATE INDEX _services_v_version_faq_global_parent_id_idx ON public._services_v_version_faq_global USING btree (_parent_id);

CREATE INDEX _services_v_version_gallery_image_idx ON public._services_v_version_gallery USING btree (image_id);

CREATE INDEX _services_v_version_gallery_order_idx ON public._services_v_version_gallery USING btree (_order);

CREATE INDEX _services_v_version_gallery_parent_id_idx ON public._services_v_version_gallery USING btree (_parent_id);

CREATE INDEX _services_v_version_robots_directives_order_idx ON public._services_v_version_robots_directives USING btree ("order");

CREATE INDEX _services_v_version_robots_directives_parent_idx ON public._services_v_version_robots_directives USING btree (parent_id);

CREATE INDEX _services_v_version_sub_services_order_idx ON public._services_v_version_sub_services USING btree (_order);

CREATE INDEX _services_v_version_sub_services_parent_id_idx ON public._services_v_version_sub_services USING btree (_parent_id);

CREATE INDEX _services_v_version_version__status_idx ON public._services_v USING btree (version__status);

CREATE INDEX _services_v_version_version_created_at_idx ON public._services_v USING btree (version_created_at);

CREATE INDEX _services_v_version_version_hero_image_idx ON public._services_v USING btree (version_hero_image_id);

CREATE INDEX _services_v_version_version_og_image_idx ON public._services_v USING btree (version_og_image_id);

CREATE INDEX _services_v_version_version_reviewed_by_idx ON public._services_v USING btree (version_reviewed_by_id);

CREATE INDEX _services_v_version_version_slug_idx ON public._services_v USING btree (version_slug);

CREATE INDEX _services_v_version_version_updated_at_idx ON public._services_v USING btree (version_updated_at);

CREATE INDEX audit_log_action_idx ON public.audit_log USING btree (action, changed_at DESC);

CREATE INDEX audit_log_changed_at_idx ON public.audit_log USING btree (changed_at DESC);

CREATE INDEX audit_log_collection_idx ON public.audit_log USING btree (collection, changed_at DESC);

CREATE INDEX audit_log_doc_idx ON public.audit_log USING btree (collection, doc_id, changed_at DESC);

CREATE INDEX audit_log_user_idx ON public.audit_log USING btree (user_id, changed_at DESC);

CREATE INDEX authors__status_idx ON public.authors USING btree (_status);

CREATE INDEX authors_avatar_idx ON public.authors USING btree (avatar_id);

CREATE INDEX authors_blocks_breadcrumbs_items_order_idx ON public.authors_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX authors_blocks_breadcrumbs_items_parent_id_idx ON public.authors_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX authors_blocks_breadcrumbs_order_idx ON public.authors_blocks_breadcrumbs USING btree (_order);

CREATE INDEX authors_blocks_breadcrumbs_parent_id_idx ON public.authors_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX authors_blocks_breadcrumbs_path_idx ON public.authors_blocks_breadcrumbs USING btree (_path);

CREATE INDEX authors_blocks_cta_banner_order_idx ON public.authors_blocks_cta_banner USING btree (_order);

CREATE INDEX authors_blocks_cta_banner_parent_id_idx ON public.authors_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX authors_blocks_cta_banner_path_idx ON public.authors_blocks_cta_banner USING btree (_path);

CREATE INDEX authors_blocks_hero_image_idx ON public.authors_blocks_hero USING btree (image_id);

CREATE INDEX authors_blocks_hero_order_idx ON public.authors_blocks_hero USING btree (_order);

CREATE INDEX authors_blocks_hero_parent_id_idx ON public.authors_blocks_hero USING btree (_parent_id);

CREATE INDEX authors_blocks_hero_path_idx ON public.authors_blocks_hero USING btree (_path);

CREATE INDEX authors_blocks_related_services_items_order_idx ON public.authors_blocks_related_services_items USING btree (_order);

CREATE INDEX authors_blocks_related_services_items_parent_id_idx ON public.authors_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX authors_blocks_related_services_order_idx ON public.authors_blocks_related_services USING btree (_order);

CREATE INDEX authors_blocks_related_services_parent_id_idx ON public.authors_blocks_related_services USING btree (_parent_id);

CREATE INDEX authors_blocks_related_services_path_idx ON public.authors_blocks_related_services USING btree (_path);

CREATE INDEX authors_blocks_text_content_order_idx ON public.authors_blocks_text_content USING btree (_order);

CREATE INDEX authors_blocks_text_content_parent_id_idx ON public.authors_blocks_text_content USING btree (_parent_id);

CREATE INDEX authors_blocks_text_content_path_idx ON public.authors_blocks_text_content USING btree (_path);

CREATE INDEX authors_created_at_idx ON public.authors USING btree (created_at);

CREATE INDEX authors_credentials_order_idx ON public.authors_credentials USING btree (_order);

CREATE INDEX authors_credentials_parent_id_idx ON public.authors_credentials USING btree (_parent_id);

CREATE INDEX authors_knows_about_order_idx ON public.authors_knows_about USING btree (_order);

CREATE INDEX authors_knows_about_parent_id_idx ON public.authors_knows_about USING btree (_parent_id);

CREATE INDEX authors_rels_districts_id_idx ON public.authors_rels USING btree (districts_id);

CREATE INDEX authors_rels_order_idx ON public.authors_rels USING btree ("order");

CREATE INDEX authors_rels_parent_idx ON public.authors_rels USING btree (parent_id);

CREATE INDEX authors_rels_path_idx ON public.authors_rels USING btree (path);

CREATE INDEX authors_robots_directives_order_idx ON public.authors_robots_directives USING btree ("order");

CREATE INDEX authors_robots_directives_parent_idx ON public.authors_robots_directives USING btree (parent_id);

CREATE INDEX authors_same_as_order_idx ON public.authors_same_as USING btree (_order);

CREATE INDEX authors_same_as_parent_id_idx ON public.authors_same_as USING btree (_parent_id);

CREATE UNIQUE INDEX authors_slug_idx ON public.authors USING btree (slug);

CREATE INDEX authors_updated_at_idx ON public.authors USING btree (updated_at);

CREATE INDEX b2b_pages__status_idx ON public.b2b_pages USING btree (_status);

CREATE INDEX b2b_pages_blocks_breadcrumbs_items_order_idx ON public.b2b_pages_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX b2b_pages_blocks_breadcrumbs_items_parent_id_idx ON public.b2b_pages_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_breadcrumbs_order_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_order);

CREATE INDEX b2b_pages_blocks_breadcrumbs_parent_id_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_breadcrumbs_path_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_path);

CREATE INDEX b2b_pages_blocks_cta_banner_order_idx ON public.b2b_pages_blocks_cta_banner USING btree (_order);

CREATE INDEX b2b_pages_blocks_cta_banner_parent_id_idx ON public.b2b_pages_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_cta_banner_path_idx ON public.b2b_pages_blocks_cta_banner USING btree (_path);

CREATE INDEX b2b_pages_blocks_faq_items_order_idx ON public.b2b_pages_blocks_faq_items USING btree (_order);

CREATE INDEX b2b_pages_blocks_faq_items_parent_id_idx ON public.b2b_pages_blocks_faq_items USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_faq_order_idx ON public.b2b_pages_blocks_faq USING btree (_order);

CREATE INDEX b2b_pages_blocks_faq_parent_id_idx ON public.b2b_pages_blocks_faq USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_faq_path_idx ON public.b2b_pages_blocks_faq USING btree (_path);

CREATE INDEX b2b_pages_blocks_hero_image_idx ON public.b2b_pages_blocks_hero USING btree (image_id);

CREATE INDEX b2b_pages_blocks_hero_order_idx ON public.b2b_pages_blocks_hero USING btree (_order);

CREATE INDEX b2b_pages_blocks_hero_parent_id_idx ON public.b2b_pages_blocks_hero USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_hero_path_idx ON public.b2b_pages_blocks_hero USING btree (_path);

CREATE INDEX b2b_pages_blocks_lead_form_order_idx ON public.b2b_pages_blocks_lead_form USING btree (_order);

CREATE INDEX b2b_pages_blocks_lead_form_parent_id_idx ON public.b2b_pages_blocks_lead_form USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_lead_form_path_idx ON public.b2b_pages_blocks_lead_form USING btree (_path);

CREATE INDEX b2b_pages_blocks_mini_case_case_ref_idx ON public.b2b_pages_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX b2b_pages_blocks_mini_case_inline_facts_order_idx ON public.b2b_pages_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX b2b_pages_blocks_mini_case_inline_facts_parent_id_idx ON public.b2b_pages_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_mini_case_inline_inline_photo_idx ON public.b2b_pages_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX b2b_pages_blocks_mini_case_order_idx ON public.b2b_pages_blocks_mini_case USING btree (_order);

CREATE INDEX b2b_pages_blocks_mini_case_parent_id_idx ON public.b2b_pages_blocks_mini_case USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_mini_case_path_idx ON public.b2b_pages_blocks_mini_case USING btree (_path);

CREATE INDEX b2b_pages_blocks_services_grid_items_order_idx ON public.b2b_pages_blocks_services_grid_items USING btree (_order);

CREATE INDEX b2b_pages_blocks_services_grid_items_parent_id_idx ON public.b2b_pages_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_services_grid_order_idx ON public.b2b_pages_blocks_services_grid USING btree (_order);

CREATE INDEX b2b_pages_blocks_services_grid_parent_id_idx ON public.b2b_pages_blocks_services_grid USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_services_grid_path_idx ON public.b2b_pages_blocks_services_grid USING btree (_path);

CREATE INDEX b2b_pages_blocks_text_content_order_idx ON public.b2b_pages_blocks_text_content USING btree (_order);

CREATE INDEX b2b_pages_blocks_text_content_parent_id_idx ON public.b2b_pages_blocks_text_content USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_text_content_path_idx ON public.b2b_pages_blocks_text_content USING btree (_path);

CREATE INDEX b2b_pages_blocks_tldr_order_idx ON public.b2b_pages_blocks_tldr USING btree (_order);

CREATE INDEX b2b_pages_blocks_tldr_parent_id_idx ON public.b2b_pages_blocks_tldr USING btree (_parent_id);

CREATE INDEX b2b_pages_blocks_tldr_path_idx ON public.b2b_pages_blocks_tldr USING btree (_path);

CREATE INDEX b2b_pages_created_at_idx ON public.b2b_pages USING btree (created_at);

CREATE INDEX b2b_pages_rels_cases_id_idx ON public.b2b_pages_rels USING btree (cases_id);

CREATE INDEX b2b_pages_rels_order_idx ON public.b2b_pages_rels USING btree ("order");

CREATE INDEX b2b_pages_rels_parent_idx ON public.b2b_pages_rels USING btree (parent_id);

CREATE INDEX b2b_pages_rels_path_idx ON public.b2b_pages_rels USING btree (path);

CREATE INDEX b2b_pages_rels_services_id_idx ON public.b2b_pages_rels USING btree (services_id);

CREATE INDEX b2b_pages_robots_directives_order_idx ON public.b2b_pages_robots_directives USING btree ("order");

CREATE INDEX b2b_pages_robots_directives_parent_idx ON public.b2b_pages_robots_directives USING btree (parent_id);

CREATE UNIQUE INDEX b2b_pages_slug_idx ON public.b2b_pages USING btree (slug);

CREATE INDEX b2b_pages_updated_at_idx ON public.b2b_pages USING btree (updated_at);

CREATE INDEX blog__status_idx ON public.blog USING btree (_status);

CREATE INDEX blog_author_idx ON public.blog USING btree (author_id);

CREATE INDEX blog_blocks_breadcrumbs_items_order_idx ON public.blog_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX blog_blocks_breadcrumbs_items_parent_id_idx ON public.blog_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX blog_blocks_breadcrumbs_order_idx ON public.blog_blocks_breadcrumbs USING btree (_order);

CREATE INDEX blog_blocks_breadcrumbs_parent_id_idx ON public.blog_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX blog_blocks_breadcrumbs_path_idx ON public.blog_blocks_breadcrumbs USING btree (_path);

CREATE INDEX blog_blocks_cta_banner_order_idx ON public.blog_blocks_cta_banner USING btree (_order);

CREATE INDEX blog_blocks_cta_banner_parent_id_idx ON public.blog_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX blog_blocks_cta_banner_path_idx ON public.blog_blocks_cta_banner USING btree (_path);

CREATE INDEX blog_blocks_faq_items_order_idx ON public.blog_blocks_faq_items USING btree (_order);

CREATE INDEX blog_blocks_faq_items_parent_id_idx ON public.blog_blocks_faq_items USING btree (_parent_id);

CREATE INDEX blog_blocks_faq_order_idx ON public.blog_blocks_faq USING btree (_order);

CREATE INDEX blog_blocks_faq_parent_id_idx ON public.blog_blocks_faq USING btree (_parent_id);

CREATE INDEX blog_blocks_faq_path_idx ON public.blog_blocks_faq USING btree (_path);

CREATE INDEX blog_blocks_hero_image_idx ON public.blog_blocks_hero USING btree (image_id);

CREATE INDEX blog_blocks_hero_order_idx ON public.blog_blocks_hero USING btree (_order);

CREATE INDEX blog_blocks_hero_parent_id_idx ON public.blog_blocks_hero USING btree (_parent_id);

CREATE INDEX blog_blocks_hero_path_idx ON public.blog_blocks_hero USING btree (_path);

CREATE INDEX blog_blocks_related_services_items_order_idx ON public.blog_blocks_related_services_items USING btree (_order);

CREATE INDEX blog_blocks_related_services_items_parent_id_idx ON public.blog_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX blog_blocks_related_services_order_idx ON public.blog_blocks_related_services USING btree (_order);

CREATE INDEX blog_blocks_related_services_parent_id_idx ON public.blog_blocks_related_services USING btree (_parent_id);

CREATE INDEX blog_blocks_related_services_path_idx ON public.blog_blocks_related_services USING btree (_path);

CREATE INDEX blog_blocks_text_content_order_idx ON public.blog_blocks_text_content USING btree (_order);

CREATE INDEX blog_blocks_text_content_parent_id_idx ON public.blog_blocks_text_content USING btree (_parent_id);

CREATE INDEX blog_blocks_text_content_path_idx ON public.blog_blocks_text_content USING btree (_path);

CREATE INDEX blog_blocks_tldr_order_idx ON public.blog_blocks_tldr USING btree (_order);

CREATE INDEX blog_blocks_tldr_parent_id_idx ON public.blog_blocks_tldr USING btree (_parent_id);

CREATE INDEX blog_blocks_tldr_path_idx ON public.blog_blocks_tldr USING btree (_path);

CREATE INDEX blog_created_at_idx ON public.blog USING btree (created_at);

CREATE INDEX blog_faq_block_order_idx ON public.blog_faq_block USING btree (_order);

CREATE INDEX blog_faq_block_parent_id_idx ON public.blog_faq_block USING btree (_parent_id);

CREATE INDEX blog_hero_image_idx ON public.blog USING btree (hero_image_id);

CREATE INDEX blog_how_to_steps_order_idx ON public.blog_how_to_steps USING btree (_order);

CREATE INDEX blog_how_to_steps_parent_id_idx ON public.blog_how_to_steps USING btree (_parent_id);

CREATE INDEX blog_og_image_idx ON public.blog USING btree (og_image_id);

CREATE INDEX blog_rels_districts_id_idx ON public.blog_rels USING btree (districts_id);

CREATE INDEX blog_rels_order_idx ON public.blog_rels USING btree ("order");

CREATE INDEX blog_rels_parent_idx ON public.blog_rels USING btree (parent_id);

CREATE INDEX blog_rels_path_idx ON public.blog_rels USING btree (path);

CREATE INDEX blog_rels_services_id_idx ON public.blog_rels USING btree (services_id);

CREATE INDEX blog_reviewed_by_idx ON public.blog USING btree (reviewed_by_id);

CREATE INDEX blog_robots_directives_order_idx ON public.blog_robots_directives USING btree ("order");

CREATE INDEX blog_robots_directives_parent_idx ON public.blog_robots_directives USING btree (parent_id);

CREATE UNIQUE INDEX blog_slug_idx ON public.blog USING btree (slug);

CREATE INDEX blog_updated_at_idx ON public.blog USING btree (updated_at);

CREATE INDEX cases__status_idx ON public.cases USING btree (_status);

CREATE INDEX cases_blocks_breadcrumbs_items_order_idx ON public.cases_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX cases_blocks_breadcrumbs_items_parent_id_idx ON public.cases_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX cases_blocks_breadcrumbs_order_idx ON public.cases_blocks_breadcrumbs USING btree (_order);

CREATE INDEX cases_blocks_breadcrumbs_parent_id_idx ON public.cases_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX cases_blocks_breadcrumbs_path_idx ON public.cases_blocks_breadcrumbs USING btree (_path);

CREATE INDEX cases_blocks_cta_banner_order_idx ON public.cases_blocks_cta_banner USING btree (_order);

CREATE INDEX cases_blocks_cta_banner_parent_id_idx ON public.cases_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX cases_blocks_cta_banner_path_idx ON public.cases_blocks_cta_banner USING btree (_path);

CREATE INDEX cases_blocks_hero_image_idx ON public.cases_blocks_hero USING btree (image_id);

CREATE INDEX cases_blocks_hero_order_idx ON public.cases_blocks_hero USING btree (_order);

CREATE INDEX cases_blocks_hero_parent_id_idx ON public.cases_blocks_hero USING btree (_parent_id);

CREATE INDEX cases_blocks_hero_path_idx ON public.cases_blocks_hero USING btree (_path);

CREATE INDEX cases_blocks_mini_case_case_ref_idx ON public.cases_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX cases_blocks_mini_case_inline_facts_order_idx ON public.cases_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX cases_blocks_mini_case_inline_facts_parent_id_idx ON public.cases_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX cases_blocks_mini_case_inline_inline_photo_idx ON public.cases_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX cases_blocks_mini_case_order_idx ON public.cases_blocks_mini_case USING btree (_order);

CREATE INDEX cases_blocks_mini_case_parent_id_idx ON public.cases_blocks_mini_case USING btree (_parent_id);

CREATE INDEX cases_blocks_mini_case_path_idx ON public.cases_blocks_mini_case USING btree (_path);

CREATE INDEX cases_blocks_related_services_items_order_idx ON public.cases_blocks_related_services_items USING btree (_order);

CREATE INDEX cases_blocks_related_services_items_parent_id_idx ON public.cases_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX cases_blocks_related_services_order_idx ON public.cases_blocks_related_services USING btree (_order);

CREATE INDEX cases_blocks_related_services_parent_id_idx ON public.cases_blocks_related_services USING btree (_parent_id);

CREATE INDEX cases_blocks_related_services_path_idx ON public.cases_blocks_related_services USING btree (_path);

CREATE INDEX cases_blocks_text_content_order_idx ON public.cases_blocks_text_content USING btree (_order);

CREATE INDEX cases_blocks_text_content_parent_id_idx ON public.cases_blocks_text_content USING btree (_parent_id);

CREATE INDEX cases_blocks_text_content_path_idx ON public.cases_blocks_text_content USING btree (_path);

CREATE INDEX cases_created_at_idx ON public.cases USING btree (created_at);

CREATE INDEX cases_district_idx ON public.cases USING btree (district_id);

CREATE INDEX cases_og_image_idx ON public.cases USING btree (og_image_id);

CREATE INDEX cases_photos_after_image_idx ON public.cases_photos_after USING btree (image_id);

CREATE INDEX cases_photos_after_order_idx ON public.cases_photos_after USING btree (_order);

CREATE INDEX cases_photos_after_parent_id_idx ON public.cases_photos_after USING btree (_parent_id);

CREATE INDEX cases_photos_before_image_idx ON public.cases_photos_before USING btree (image_id);

CREATE INDEX cases_photos_before_order_idx ON public.cases_photos_before USING btree (_order);

CREATE INDEX cases_photos_before_parent_id_idx ON public.cases_photos_before USING btree (_parent_id);

CREATE INDEX cases_rels_authors_id_idx ON public.cases_rels USING btree (authors_id);

CREATE INDEX cases_rels_order_idx ON public.cases_rels USING btree ("order");

CREATE INDEX cases_rels_parent_idx ON public.cases_rels USING btree (parent_id);

CREATE INDEX cases_rels_path_idx ON public.cases_rels USING btree (path);

CREATE INDEX cases_reviewed_by_idx ON public.cases USING btree (reviewed_by_id);

CREATE INDEX cases_robots_directives_order_idx ON public.cases_robots_directives USING btree ("order");

CREATE INDEX cases_robots_directives_parent_idx ON public.cases_robots_directives USING btree (parent_id);

CREATE INDEX cases_service_idx ON public.cases USING btree (service_id);

CREATE UNIQUE INDEX cases_slug_idx ON public.cases USING btree (slug);

CREATE INDEX cases_updated_at_idx ON public.cases USING btree (updated_at);

CREATE INDEX districts__status_idx ON public.districts USING btree (_status);

CREATE INDEX districts_blocks_breadcrumbs_items_order_idx ON public.districts_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX districts_blocks_breadcrumbs_items_parent_id_idx ON public.districts_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX districts_blocks_breadcrumbs_order_idx ON public.districts_blocks_breadcrumbs USING btree (_order);

CREATE INDEX districts_blocks_breadcrumbs_parent_id_idx ON public.districts_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX districts_blocks_breadcrumbs_path_idx ON public.districts_blocks_breadcrumbs USING btree (_path);

CREATE INDEX districts_blocks_hero_image_idx ON public.districts_blocks_hero USING btree (image_id);

CREATE INDEX districts_blocks_hero_order_idx ON public.districts_blocks_hero USING btree (_order);

CREATE INDEX districts_blocks_hero_parent_id_idx ON public.districts_blocks_hero USING btree (_parent_id);

CREATE INDEX districts_blocks_hero_path_idx ON public.districts_blocks_hero USING btree (_path);

CREATE INDEX districts_blocks_lead_form_order_idx ON public.districts_blocks_lead_form USING btree (_order);

CREATE INDEX districts_blocks_lead_form_parent_id_idx ON public.districts_blocks_lead_form USING btree (_parent_id);

CREATE INDEX districts_blocks_lead_form_path_idx ON public.districts_blocks_lead_form USING btree (_path);

CREATE INDEX districts_blocks_mini_case_case_ref_idx ON public.districts_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX districts_blocks_mini_case_inline_facts_order_idx ON public.districts_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX districts_blocks_mini_case_inline_facts_parent_id_idx ON public.districts_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX districts_blocks_mini_case_inline_inline_photo_idx ON public.districts_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX districts_blocks_mini_case_order_idx ON public.districts_blocks_mini_case USING btree (_order);

CREATE INDEX districts_blocks_mini_case_parent_id_idx ON public.districts_blocks_mini_case USING btree (_parent_id);

CREATE INDEX districts_blocks_mini_case_path_idx ON public.districts_blocks_mini_case USING btree (_path);

CREATE INDEX districts_blocks_neighbor_districts_items_order_idx ON public.districts_blocks_neighbor_districts_items USING btree (_order);

CREATE INDEX districts_blocks_neighbor_districts_items_parent_id_idx ON public.districts_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX districts_blocks_neighbor_districts_order_idx ON public.districts_blocks_neighbor_districts USING btree (_order);

CREATE INDEX districts_blocks_neighbor_districts_parent_id_idx ON public.districts_blocks_neighbor_districts USING btree (_parent_id);

CREATE INDEX districts_blocks_neighbor_districts_path_idx ON public.districts_blocks_neighbor_districts USING btree (_path);

CREATE INDEX districts_blocks_services_grid_items_order_idx ON public.districts_blocks_services_grid_items USING btree (_order);

CREATE INDEX districts_blocks_services_grid_items_parent_id_idx ON public.districts_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX districts_blocks_services_grid_order_idx ON public.districts_blocks_services_grid USING btree (_order);

CREATE INDEX districts_blocks_services_grid_parent_id_idx ON public.districts_blocks_services_grid USING btree (_parent_id);

CREATE INDEX districts_blocks_services_grid_path_idx ON public.districts_blocks_services_grid USING btree (_path);

CREATE INDEX districts_blocks_text_content_order_idx ON public.districts_blocks_text_content USING btree (_order);

CREATE INDEX districts_blocks_text_content_parent_id_idx ON public.districts_blocks_text_content USING btree (_parent_id);

CREATE INDEX districts_blocks_text_content_path_idx ON public.districts_blocks_text_content USING btree (_path);

CREATE INDEX districts_blocks_tldr_order_idx ON public.districts_blocks_tldr USING btree (_order);

CREATE INDEX districts_blocks_tldr_parent_id_idx ON public.districts_blocks_tldr USING btree (_parent_id);

CREATE INDEX districts_blocks_tldr_path_idx ON public.districts_blocks_tldr USING btree (_path);

CREATE INDEX districts_created_at_idx ON public.districts USING btree (created_at);

CREATE INDEX districts_hero_image_idx ON public.districts USING btree (hero_image_id);

CREATE INDEX districts_landmarks_order_idx ON public.districts_landmarks USING btree (_order);

CREATE INDEX districts_landmarks_parent_id_idx ON public.districts_landmarks USING btree (_parent_id);

CREATE INDEX districts_photo_geo_idx ON public.districts USING btree (photo_geo_id);

CREATE INDEX districts_rels_districts_id_idx ON public.districts_rels USING btree (districts_id);

CREATE INDEX districts_rels_order_idx ON public.districts_rels USING btree ("order");

CREATE INDEX districts_rels_parent_idx ON public.districts_rels USING btree (parent_id);

CREATE INDEX districts_rels_path_idx ON public.districts_rels USING btree (path);

CREATE INDEX districts_rels_services_id_idx ON public.districts_rels USING btree (services_id);

CREATE INDEX districts_robots_directives_order_idx ON public.districts_robots_directives USING btree ("order");

CREATE INDEX districts_robots_directives_parent_idx ON public.districts_robots_directives USING btree (parent_id);

CREATE UNIQUE INDEX districts_slug_idx ON public.districts USING btree (slug);

CREATE INDEX districts_updated_at_idx ON public.districts USING btree (updated_at);

CREATE INDEX homepage_documents_order_idx ON public.homepage_documents USING btree (_order);

CREATE INDEX homepage_documents_parent_id_idx ON public.homepage_documents USING btree (_parent_id);

CREATE INDEX homepage_documents_photo_idx ON public.homepage_documents USING btree (photo_id);

CREATE INDEX homepage_faq_order_idx ON public.homepage_faq USING btree (_order);

CREATE INDEX homepage_faq_parent_id_idx ON public.homepage_faq USING btree (_parent_id);

CREATE INDEX homepage_gallery_order_idx ON public.homepage_gallery USING btree (_order);

CREATE INDEX homepage_gallery_parent_id_idx ON public.homepage_gallery USING btree (_parent_id);

CREATE INDEX homepage_gallery_photo_idx ON public.homepage_gallery USING btree (photo_id);

CREATE INDEX homepage_hero_hero_photo_idx ON public.homepage USING btree (hero_photo_id);

CREATE INDEX homepage_hero_trust_bullets_order_idx ON public.homepage_hero_trust_bullets USING btree (_order);

CREATE INDEX homepage_hero_trust_bullets_parent_id_idx ON public.homepage_hero_trust_bullets USING btree (_parent_id);

CREATE INDEX homepage_photo_smeta_photo_smeta_example_image_idx ON public.homepage USING btree (photo_smeta_example_image_id);

CREATE INDEX homepage_pricing_rows_order_idx ON public.homepage_pricing_rows USING btree (_order);

CREATE INDEX homepage_pricing_rows_parent_id_idx ON public.homepage_pricing_rows USING btree (_parent_id);

CREATE INDEX homepage_review_sources_order_idx ON public.homepage_review_sources USING btree (_order);

CREATE INDEX homepage_review_sources_parent_id_idx ON public.homepage_review_sources USING btree (_parent_id);

CREATE INDEX homepage_reviews_order_idx ON public.homepage_reviews USING btree (_order);

CREATE INDEX homepage_reviews_parent_id_idx ON public.homepage_reviews USING btree (_parent_id);

CREATE INDEX homepage_steps_order_idx ON public.homepage_steps USING btree (_order);

CREATE INDEX homepage_steps_parent_id_idx ON public.homepage_steps USING btree (_parent_id);

CREATE INDEX idx_service_districts_district_service ON public.service_districts USING btree (district_id, service_id);

CREATE INDEX leads_created_at_idx ON public.leads USING btree (created_at);

CREATE INDEX leads_district_idx ON public.leads USING btree (district_id);

CREATE INDEX leads_phone_idx ON public.leads USING btree (phone);

CREATE INDEX leads_photos_order_idx ON public.leads_photos USING btree (_order);

CREATE INDEX leads_photos_parent_id_idx ON public.leads_photos USING btree (_parent_id);

CREATE INDEX leads_service_idx ON public.leads USING btree (service_id);

CREATE INDEX leads_updated_at_idx ON public.leads USING btree (updated_at);

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);

CREATE INDEX media_sizes_card_sizes_card_filename_idx ON public.media USING btree (sizes_card_filename);

CREATE INDEX media_sizes_hero_sizes_hero_filename_idx ON public.media USING btree (sizes_hero_filename);

CREATE INDEX media_sizes_og_sizes_og_filename_idx ON public.media USING btree (sizes_og_filename);

CREATE INDEX media_sizes_thumb_sizes_thumb_filename_idx ON public.media USING btree (sizes_thumb_filename);

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);

CREATE INDEX payload_locked_documents_rels_authors_id_idx ON public.payload_locked_documents_rels USING btree (authors_id);

CREATE INDEX payload_locked_documents_rels_b2b_pages_id_idx ON public.payload_locked_documents_rels USING btree (b2b_pages_id);

CREATE INDEX payload_locked_documents_rels_blog_id_idx ON public.payload_locked_documents_rels USING btree (blog_id);

CREATE INDEX payload_locked_documents_rels_cases_id_idx ON public.payload_locked_documents_rels USING btree (cases_id);

CREATE INDEX payload_locked_documents_rels_districts_id_idx ON public.payload_locked_documents_rels USING btree (districts_id);

CREATE INDEX payload_locked_documents_rels_leads_id_idx ON public.payload_locked_documents_rels USING btree (leads_id);

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);

CREATE INDEX payload_locked_documents_rels_redirects_id_idx ON public.payload_locked_documents_rels USING btree (redirects_id);

CREATE INDEX payload_locked_documents_rels_reviews_id_idx ON public.payload_locked_documents_rels USING btree (reviews_id);

CREATE INDEX payload_locked_documents_rels_rum_metrics_id_idx ON public.payload_locked_documents_rels USING btree (rum_metrics_id);

CREATE INDEX payload_locked_documents_rels_service_districts_id_idx ON public.payload_locked_documents_rels USING btree (service_districts_id);

CREATE INDEX payload_locked_documents_rels_services_id_idx ON public.payload_locked_documents_rels USING btree (services_id);

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);

CREATE INDEX redirects_created_at_idx ON public.redirects USING btree (created_at);

CREATE UNIQUE INDEX redirects_from_idx ON public.redirects USING btree ("from");

CREATE INDEX redirects_updated_at_idx ON public.redirects USING btree (updated_at);

CREATE INDEX reviews__status_idx ON public.reviews USING btree (_status);

CREATE INDEX reviews_created_at_idx ON public.reviews USING btree (created_at);

CREATE INDEX reviews_district_idx ON public.reviews USING btree (district_id);

CREATE INDEX reviews_service_idx ON public.reviews USING btree (service_id);

CREATE INDEX reviews_updated_at_idx ON public.reviews USING btree (updated_at);

CREATE INDEX rum_metrics_ab_variant_idx ON public.rum_metrics USING btree (ab_variant);

CREATE INDEX rum_metrics_created_at_idx ON public.rum_metrics USING btree (created_at);

CREATE INDEX rum_metrics_name_idx ON public.rum_metrics USING btree (name);

CREATE INDEX rum_metrics_page_url_idx ON public.rum_metrics USING btree (page_url);

CREATE INDEX rum_metrics_rating_idx ON public.rum_metrics USING btree (rating);

CREATE INDEX rum_metrics_updated_at_idx ON public.rum_metrics USING btree (updated_at);

CREATE INDEX seo_settings_credentials_order_idx ON public.seo_settings_credentials USING btree (_order);

CREATE INDEX seo_settings_credentials_parent_id_idx ON public.seo_settings_credentials USING btree (_parent_id);

CREATE INDEX seo_settings_default_og_image_idx ON public.seo_settings USING btree (default_og_image_id);

CREATE INDEX "service_district_subServiceSlug_idx" ON public.service_districts USING btree (service_id, district_id, sub_service_slug);

CREATE INDEX service_districts__status_idx ON public.service_districts USING btree (_status);

CREATE INDEX service_districts_blocks_breadcrumbs_items_order_idx ON public.service_districts_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX service_districts_blocks_breadcrumbs_items_parent_id_idx ON public.service_districts_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX service_districts_blocks_breadcrumbs_order_idx ON public.service_districts_blocks_breadcrumbs USING btree (_order);

CREATE INDEX service_districts_blocks_breadcrumbs_parent_id_idx ON public.service_districts_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX service_districts_blocks_breadcrumbs_path_idx ON public.service_districts_blocks_breadcrumbs USING btree (_path);

CREATE INDEX service_districts_blocks_calculator_placeholder_order_idx ON public.service_districts_blocks_calculator_placeholder USING btree (_order);

CREATE INDEX service_districts_blocks_calculator_placeholder_parent_id_idx ON public.service_districts_blocks_calculator_placeholder USING btree (_parent_id);

CREATE INDEX service_districts_blocks_calculator_placeholder_path_idx ON public.service_districts_blocks_calculator_placeholder USING btree (_path);

CREATE INDEX service_districts_blocks_cta_banner_order_idx ON public.service_districts_blocks_cta_banner USING btree (_order);

CREATE INDEX service_districts_blocks_cta_banner_parent_id_idx ON public.service_districts_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX service_districts_blocks_cta_banner_path_idx ON public.service_districts_blocks_cta_banner USING btree (_path);

CREATE INDEX service_districts_blocks_faq_items_order_idx ON public.service_districts_blocks_faq_items USING btree (_order);

CREATE INDEX service_districts_blocks_faq_items_parent_id_idx ON public.service_districts_blocks_faq_items USING btree (_parent_id);

CREATE INDEX service_districts_blocks_faq_order_idx ON public.service_districts_blocks_faq USING btree (_order);

CREATE INDEX service_districts_blocks_faq_parent_id_idx ON public.service_districts_blocks_faq USING btree (_parent_id);

CREATE INDEX service_districts_blocks_faq_path_idx ON public.service_districts_blocks_faq USING btree (_path);

CREATE INDEX service_districts_blocks_hero_image_idx ON public.service_districts_blocks_hero USING btree (image_id);

CREATE INDEX service_districts_blocks_hero_order_idx ON public.service_districts_blocks_hero USING btree (_order);

CREATE INDEX service_districts_blocks_hero_parent_id_idx ON public.service_districts_blocks_hero USING btree (_parent_id);

CREATE INDEX service_districts_blocks_hero_path_idx ON public.service_districts_blocks_hero USING btree (_path);

CREATE INDEX service_districts_blocks_lead_form_order_idx ON public.service_districts_blocks_lead_form USING btree (_order);

CREATE INDEX service_districts_blocks_lead_form_parent_id_idx ON public.service_districts_blocks_lead_form USING btree (_parent_id);

CREATE INDEX service_districts_blocks_lead_form_path_idx ON public.service_districts_blocks_lead_form USING btree (_path);

CREATE INDEX service_districts_blocks_neighbor_districts_items_order_idx ON public.service_districts_blocks_neighbor_districts_items USING btree (_order);

CREATE INDEX service_districts_blocks_neighbor_districts_items_parent_id_idx ON public.service_districts_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX service_districts_blocks_neighbor_districts_order_idx ON public.service_districts_blocks_neighbor_districts USING btree (_order);

CREATE INDEX service_districts_blocks_neighbor_districts_parent_id_idx ON public.service_districts_blocks_neighbor_districts USING btree (_parent_id);

CREATE INDEX service_districts_blocks_neighbor_districts_path_idx ON public.service_districts_blocks_neighbor_districts USING btree (_path);

CREATE INDEX service_districts_blocks_pricing_table_order_idx ON public.service_districts_blocks_pricing_table USING btree (_order);

CREATE INDEX service_districts_blocks_pricing_table_parent_id_idx ON public.service_districts_blocks_pricing_table USING btree (_parent_id);

CREATE INDEX service_districts_blocks_pricing_table_path_idx ON public.service_districts_blocks_pricing_table USING btree (_path);

CREATE INDEX service_districts_blocks_pricing_table_tiers_features_order_idx ON public.service_districts_blocks_pricing_table_tiers_features USING btree (_order);

CREATE INDEX service_districts_blocks_pricing_table_tiers_features_parent_id ON public.service_districts_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX service_districts_blocks_pricing_table_tiers_order_idx ON public.service_districts_blocks_pricing_table_tiers USING btree (_order);

CREATE INDEX service_districts_blocks_pricing_table_tiers_parent_id_idx ON public.service_districts_blocks_pricing_table_tiers USING btree (_parent_id);

CREATE INDEX service_districts_blocks_process_steps_order_idx ON public.service_districts_blocks_process_steps USING btree (_order);

CREATE INDEX service_districts_blocks_process_steps_parent_id_idx ON public.service_districts_blocks_process_steps USING btree (_parent_id);

CREATE INDEX service_districts_blocks_process_steps_path_idx ON public.service_districts_blocks_process_steps USING btree (_path);

CREATE INDEX service_districts_blocks_process_steps_steps_order_idx ON public.service_districts_blocks_process_steps_steps USING btree (_order);

CREATE INDEX service_districts_blocks_process_steps_steps_parent_id_idx ON public.service_districts_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX service_districts_blocks_related_services_items_order_idx ON public.service_districts_blocks_related_services_items USING btree (_order);

CREATE INDEX service_districts_blocks_related_services_items_parent_id_idx ON public.service_districts_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX service_districts_blocks_related_services_order_idx ON public.service_districts_blocks_related_services USING btree (_order);

CREATE INDEX service_districts_blocks_related_services_parent_id_idx ON public.service_districts_blocks_related_services USING btree (_parent_id);

CREATE INDEX service_districts_blocks_related_services_path_idx ON public.service_districts_blocks_related_services USING btree (_path);

CREATE INDEX service_districts_blocks_text_content_order_idx ON public.service_districts_blocks_text_content USING btree (_order);

CREATE INDEX service_districts_blocks_text_content_parent_id_idx ON public.service_districts_blocks_text_content USING btree (_parent_id);

CREATE INDEX service_districts_blocks_text_content_path_idx ON public.service_districts_blocks_text_content USING btree (_path);

CREATE INDEX service_districts_blocks_tldr_order_idx ON public.service_districts_blocks_tldr USING btree (_order);

CREATE INDEX service_districts_blocks_tldr_parent_id_idx ON public.service_districts_blocks_tldr USING btree (_parent_id);

CREATE INDEX service_districts_blocks_tldr_path_idx ON public.service_districts_blocks_tldr USING btree (_path);

CREATE INDEX service_districts_created_at_idx ON public.service_districts USING btree (created_at);

CREATE INDEX service_districts_district_idx ON public.service_districts USING btree (district_id);

CREATE INDEX service_districts_local_faq_order_idx ON public.service_districts_local_faq USING btree (_order);

CREATE INDEX service_districts_local_faq_parent_id_idx ON public.service_districts_local_faq USING btree (_parent_id);

CREATE INDEX service_districts_local_landmarks_order_idx ON public.service_districts_local_landmarks USING btree (_order);

CREATE INDEX service_districts_local_landmarks_parent_id_idx ON public.service_districts_local_landmarks USING btree (_parent_id);

CREATE INDEX service_districts_mini_case_idx ON public.service_districts USING btree (mini_case_id);

CREATE INDEX service_districts_og_image_idx ON public.service_districts USING btree (og_image_id);

CREATE INDEX service_districts_rels_order_idx ON public.service_districts_rels USING btree ("order");

CREATE INDEX service_districts_rels_parent_idx ON public.service_districts_rels USING btree (parent_id);

CREATE INDEX service_districts_rels_path_idx ON public.service_districts_rels USING btree (path);

CREATE INDEX service_districts_rels_services_id_idx ON public.service_districts_rels USING btree (services_id);

CREATE INDEX service_districts_reviewed_by_idx ON public.service_districts USING btree (reviewed_by_id);

CREATE UNIQUE INDEX service_districts_service_district_pillar_uniq ON public.service_districts USING btree (service_id, district_id) WHERE (sub_service_slug IS NULL);

CREATE UNIQUE INDEX service_districts_service_district_sub_uniq ON public.service_districts USING btree (service_id, district_id, sub_service_slug) WHERE (sub_service_slug IS NOT NULL);

CREATE INDEX service_districts_service_idx ON public.service_districts USING btree (service_id);

CREATE INDEX service_districts_sub_service_slug_idx ON public.service_districts USING btree (sub_service_slug) WHERE (sub_service_slug IS NOT NULL);

CREATE INDEX service_districts_updated_at_idx ON public.service_districts USING btree (updated_at);

CREATE INDEX services__status_idx ON public.services USING btree (_status);

CREATE INDEX services_blocks_breadcrumbs_items_order_idx ON public.services_blocks_breadcrumbs_items USING btree (_order);

CREATE INDEX services_blocks_breadcrumbs_items_parent_id_idx ON public.services_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX services_blocks_breadcrumbs_order_idx ON public.services_blocks_breadcrumbs USING btree (_order);

CREATE INDEX services_blocks_breadcrumbs_parent_id_idx ON public.services_blocks_breadcrumbs USING btree (_parent_id);

CREATE INDEX services_blocks_breadcrumbs_path_idx ON public.services_blocks_breadcrumbs USING btree (_path);

CREATE INDEX services_blocks_calculator_placeholder_order_idx ON public.services_blocks_calculator_placeholder USING btree (_order);

CREATE INDEX services_blocks_calculator_placeholder_parent_id_idx ON public.services_blocks_calculator_placeholder USING btree (_parent_id);

CREATE INDEX services_blocks_calculator_placeholder_path_idx ON public.services_blocks_calculator_placeholder USING btree (_path);

CREATE INDEX services_blocks_cta_banner_order_idx ON public.services_blocks_cta_banner USING btree (_order);

CREATE INDEX services_blocks_cta_banner_parent_id_idx ON public.services_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX services_blocks_cta_banner_path_idx ON public.services_blocks_cta_banner USING btree (_path);

CREATE INDEX services_blocks_faq_items_order_idx ON public.services_blocks_faq_items USING btree (_order);

CREATE INDEX services_blocks_faq_items_parent_id_idx ON public.services_blocks_faq_items USING btree (_parent_id);

CREATE INDEX services_blocks_faq_order_idx ON public.services_blocks_faq USING btree (_order);

CREATE INDEX services_blocks_faq_parent_id_idx ON public.services_blocks_faq USING btree (_parent_id);

CREATE INDEX services_blocks_faq_path_idx ON public.services_blocks_faq USING btree (_path);

CREATE INDEX services_blocks_hero_image_idx ON public.services_blocks_hero USING btree (image_id);

CREATE INDEX services_blocks_hero_order_idx ON public.services_blocks_hero USING btree (_order);

CREATE INDEX services_blocks_hero_parent_id_idx ON public.services_blocks_hero USING btree (_parent_id);

CREATE INDEX services_blocks_hero_path_idx ON public.services_blocks_hero USING btree (_path);

CREATE INDEX services_blocks_lead_form_order_idx ON public.services_blocks_lead_form USING btree (_order);

CREATE INDEX services_blocks_lead_form_parent_id_idx ON public.services_blocks_lead_form USING btree (_parent_id);

CREATE INDEX services_blocks_lead_form_path_idx ON public.services_blocks_lead_form USING btree (_path);

CREATE INDEX services_blocks_mini_case_case_ref_idx ON public.services_blocks_mini_case USING btree (case_ref_id);

CREATE INDEX services_blocks_mini_case_inline_facts_order_idx ON public.services_blocks_mini_case_inline_facts USING btree (_order);

CREATE INDEX services_blocks_mini_case_inline_facts_parent_id_idx ON public.services_blocks_mini_case_inline_facts USING btree (_parent_id);

CREATE INDEX services_blocks_mini_case_inline_inline_photo_idx ON public.services_blocks_mini_case USING btree (inline_photo_id);

CREATE INDEX services_blocks_mini_case_order_idx ON public.services_blocks_mini_case USING btree (_order);

CREATE INDEX services_blocks_mini_case_parent_id_idx ON public.services_blocks_mini_case USING btree (_parent_id);

CREATE INDEX services_blocks_mini_case_path_idx ON public.services_blocks_mini_case USING btree (_path);

CREATE INDEX services_blocks_pricing_table_order_idx ON public.services_blocks_pricing_table USING btree (_order);

CREATE INDEX services_blocks_pricing_table_parent_id_idx ON public.services_blocks_pricing_table USING btree (_parent_id);

CREATE INDEX services_blocks_pricing_table_path_idx ON public.services_blocks_pricing_table USING btree (_path);

CREATE INDEX services_blocks_pricing_table_tiers_features_order_idx ON public.services_blocks_pricing_table_tiers_features USING btree (_order);

CREATE INDEX services_blocks_pricing_table_tiers_features_parent_id_idx ON public.services_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX services_blocks_pricing_table_tiers_order_idx ON public.services_blocks_pricing_table_tiers USING btree (_order);

CREATE INDEX services_blocks_pricing_table_tiers_parent_id_idx ON public.services_blocks_pricing_table_tiers USING btree (_parent_id);

CREATE INDEX services_blocks_process_steps_order_idx ON public.services_blocks_process_steps USING btree (_order);

CREATE INDEX services_blocks_process_steps_parent_id_idx ON public.services_blocks_process_steps USING btree (_parent_id);

CREATE INDEX services_blocks_process_steps_path_idx ON public.services_blocks_process_steps USING btree (_path);

CREATE INDEX services_blocks_process_steps_steps_order_idx ON public.services_blocks_process_steps_steps USING btree (_order);

CREATE INDEX services_blocks_process_steps_steps_parent_id_idx ON public.services_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX services_blocks_related_services_items_order_idx ON public.services_blocks_related_services_items USING btree (_order);

CREATE INDEX services_blocks_related_services_items_parent_id_idx ON public.services_blocks_related_services_items USING btree (_parent_id);

CREATE INDEX services_blocks_related_services_order_idx ON public.services_blocks_related_services USING btree (_order);

CREATE INDEX services_blocks_related_services_parent_id_idx ON public.services_blocks_related_services USING btree (_parent_id);

CREATE INDEX services_blocks_related_services_path_idx ON public.services_blocks_related_services USING btree (_path);

CREATE INDEX services_blocks_services_grid_items_order_idx ON public.services_blocks_services_grid_items USING btree (_order);

CREATE INDEX services_blocks_services_grid_items_parent_id_idx ON public.services_blocks_services_grid_items USING btree (_parent_id);

CREATE INDEX services_blocks_services_grid_order_idx ON public.services_blocks_services_grid USING btree (_order);

CREATE INDEX services_blocks_services_grid_parent_id_idx ON public.services_blocks_services_grid USING btree (_parent_id);

CREATE INDEX services_blocks_services_grid_path_idx ON public.services_blocks_services_grid USING btree (_path);

CREATE INDEX services_blocks_text_content_order_idx ON public.services_blocks_text_content USING btree (_order);

CREATE INDEX services_blocks_text_content_parent_id_idx ON public.services_blocks_text_content USING btree (_parent_id);

CREATE INDEX services_blocks_text_content_path_idx ON public.services_blocks_text_content USING btree (_path);

CREATE INDEX services_blocks_tldr_order_idx ON public.services_blocks_tldr USING btree (_order);

CREATE INDEX services_blocks_tldr_parent_id_idx ON public.services_blocks_tldr USING btree (_parent_id);

CREATE INDEX services_blocks_tldr_path_idx ON public.services_blocks_tldr USING btree (_path);

CREATE INDEX services_created_at_idx ON public.services USING btree (created_at);

CREATE INDEX services_faq_global_order_idx ON public.services_faq_global USING btree (_order);

CREATE INDEX services_faq_global_parent_id_idx ON public.services_faq_global USING btree (_parent_id);

CREATE INDEX services_gallery_image_idx ON public.services_gallery USING btree (image_id);

CREATE INDEX services_gallery_order_idx ON public.services_gallery USING btree (_order);

CREATE INDEX services_gallery_parent_id_idx ON public.services_gallery USING btree (_parent_id);

CREATE INDEX services_hero_image_idx ON public.services USING btree (hero_image_id);

CREATE INDEX services_og_image_idx ON public.services USING btree (og_image_id);

CREATE INDEX services_rels_order_idx ON public.services_rels USING btree ("order");

CREATE INDEX services_rels_parent_idx ON public.services_rels USING btree (parent_id);

CREATE INDEX services_rels_path_idx ON public.services_rels USING btree (path);

CREATE INDEX services_rels_services_id_idx ON public.services_rels USING btree (services_id);

CREATE INDEX services_reviewed_by_idx ON public.services USING btree (reviewed_by_id);

CREATE INDEX services_robots_directives_order_idx ON public.services_robots_directives USING btree ("order");

CREATE INDEX services_robots_directives_parent_idx ON public.services_robots_directives USING btree (parent_id);

CREATE UNIQUE INDEX services_slug_idx ON public.services USING btree (slug);

CREATE INDEX services_sub_services_order_idx ON public.services_sub_services USING btree (_order);

CREATE INDEX services_sub_services_parent_id_idx ON public.services_sub_services USING btree (_parent_id);

CREATE INDEX services_updated_at_idx ON public.services USING btree (updated_at);

CREATE INDEX site_chrome_footer_columns_items_order_idx ON public.site_chrome_footer_columns_items USING btree (_order);

CREATE INDEX site_chrome_footer_columns_items_parent_id_idx ON public.site_chrome_footer_columns_items USING btree (_parent_id);

CREATE INDEX site_chrome_footer_columns_order_idx ON public.site_chrome_footer_columns USING btree (_order);

CREATE INDEX site_chrome_footer_columns_parent_id_idx ON public.site_chrome_footer_columns USING btree (_parent_id);

CREATE INDEX site_chrome_header_menu_order_idx ON public.site_chrome_header_menu USING btree (_order);

CREATE INDEX site_chrome_header_menu_parent_id_idx ON public.site_chrome_header_menu USING btree (_parent_id);

CREATE INDEX site_chrome_social_order_idx ON public.site_chrome_social USING btree (_order);

CREATE INDEX site_chrome_social_parent_id_idx ON public.site_chrome_social USING btree (_parent_id);

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);

CREATE INDEX users_recovery_codes_order_idx ON public.users_recovery_codes USING btree (_order);

CREATE INDEX users_recovery_codes_parent_id_idx ON public.users_recovery_codes USING btree (_parent_id);

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);

CREATE INDEX "version_service_version_district_version_subServiceSlug_idx" ON public._service_districts_v USING btree (version_service_id, version_district_id, version_sub_service_slug);

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_cta_banner
    ADD CONSTRAINT _authors_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_related_services_items
    ADD CONSTRAINT _authors_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_related_services
    ADD CONSTRAINT _authors_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_blocks_text_content
    ADD CONSTRAINT _authors_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_parent_id_authors_id_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_version_avatar_id_media_id_fk FOREIGN KEY (version_avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._authors_v_version_credentials
    ADD CONSTRAINT _authors_v_version_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_version_knows_about
    ADD CONSTRAINT _authors_v_version_knows_about_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_version_robots_directives
    ADD CONSTRAINT _authors_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._authors_v_version_same_as
    ADD CONSTRAINT _authors_v_version_same_as_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner
    ADD CONSTRAINT _b2b_pages_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form
    ADD CONSTRAINT _b2b_pages_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content
    ADD CONSTRAINT _b2b_pages_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr
    ADD CONSTRAINT _b2b_pages_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v
    ADD CONSTRAINT _b2b_pages_v_parent_id_b2b_pages_id_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives
    ADD CONSTRAINT _b2b_pages_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_cta_banner
    ADD CONSTRAINT _blog_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_faq_items
    ADD CONSTRAINT _blog_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_faq
    ADD CONSTRAINT _blog_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_related_services_items
    ADD CONSTRAINT _blog_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_related_services
    ADD CONSTRAINT _blog_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_text_content
    ADD CONSTRAINT _blog_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_blocks_tldr
    ADD CONSTRAINT _blog_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_parent_id_blog_id_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_author_id_authors_id_fk FOREIGN KEY (version_author_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v_version_faq_block
    ADD CONSTRAINT _blog_v_version_faq_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v_version_how_to_steps
    ADD CONSTRAINT _blog_v_version_how_to_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._blog_v_version_robots_directives
    ADD CONSTRAINT _blog_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_cta_banner
    ADD CONSTRAINT _cases_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_related_services_items
    ADD CONSTRAINT _cases_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_related_services
    ADD CONSTRAINT _cases_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_blocks_text_content
    ADD CONSTRAINT _cases_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_parent_id_cases_id_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_district_id_districts_id_fk FOREIGN KEY (version_district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._cases_v_version_robots_directives
    ADD CONSTRAINT _cases_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_service_id_services_id_fk FOREIGN KEY (version_service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_lead_form
    ADD CONSTRAINT _districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_neighbor_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items
    ADD CONSTRAINT _districts_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_services_grid
    ADD CONSTRAINT _districts_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_text_content
    ADD CONSTRAINT _districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_blocks_tldr
    ADD CONSTRAINT _districts_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_parent_id_districts_id_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_version_landmarks
    ADD CONSTRAINT _districts_v_version_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_version_photo_geo_id_media_id_fk FOREIGN KEY (version_photo_geo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._districts_v_version_robots_directives
    ADD CONSTRAINT _districts_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._reviews_v
    ADD CONSTRAINT _reviews_v_parent_id_reviews_id_fk FOREIGN KEY (parent_id) REFERENCES public.reviews(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._reviews_v
    ADD CONSTRAINT _reviews_v_version_district_id_districts_id_fk FOREIGN KEY (version_district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._reviews_v
    ADD CONSTRAINT _reviews_v_version_service_id_services_id_fk FOREIGN KEY (version_service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder
    ADD CONSTRAINT _service_districts_v_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_items_parent_id_ FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_neighbor_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_features_parent FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_pricing_table_tiers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers
    ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_pricing_table(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps
    ADD CONSTRAINT _service_districts_v_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps
    ADD CONSTRAINT _service_districts_v_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_process_steps(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items
    ADD CONSTRAINT _service_districts_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_related_services
    ADD CONSTRAINT _service_districts_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_tldr
    ADD CONSTRAINT _service_districts_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_parent_id_service_districts_id_fk FOREIGN KEY (parent_id) REFERENCES public.service_districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_district_id_districts_id_fk FOREIGN KEY (version_district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v_version_local_faq
    ADD CONSTRAINT _service_districts_v_version_local_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks
    ADD CONSTRAINT _service_districts_v_version_local_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_mini_case_id_cases_id_fk FOREIGN KEY (version_mini_case_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_service_id_services_id_fk FOREIGN KEY (version_service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder
    ADD CONSTRAINT _services_v_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_cta_banner
    ADD CONSTRAINT _services_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_faq_items
    ADD CONSTRAINT _services_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_faq
    ADD CONSTRAINT _services_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_lead_form
    ADD CONSTRAINT _services_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_pricing_table
    ADD CONSTRAINT _services_v_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers_features
    ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_pricing_table_tiers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers
    ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_pricing_table(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_process_steps
    ADD CONSTRAINT _services_v_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_process_steps_steps
    ADD CONSTRAINT _services_v_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_process_steps(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_related_services_items
    ADD CONSTRAINT _services_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_related_services
    ADD CONSTRAINT _services_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_services_grid_items
    ADD CONSTRAINT _services_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_services_grid
    ADD CONSTRAINT _services_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_text_content
    ADD CONSTRAINT _services_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_blocks_tldr
    ADD CONSTRAINT _services_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_parent_id_services_id_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_version_faq_global
    ADD CONSTRAINT _services_v_version_faq_global_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._services_v_version_robots_directives
    ADD CONSTRAINT _services_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._services_v_version_sub_services
    ADD CONSTRAINT _services_v_version_sub_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.authors_blocks_breadcrumbs_items
    ADD CONSTRAINT authors_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_breadcrumbs
    ADD CONSTRAINT authors_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_cta_banner
    ADD CONSTRAINT authors_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_related_services_items
    ADD CONSTRAINT authors_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_related_services
    ADD CONSTRAINT authors_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_blocks_text_content
    ADD CONSTRAINT authors_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_credentials
    ADD CONSTRAINT authors_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_knows_about
    ADD CONSTRAINT authors_knows_about_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_robots_directives
    ADD CONSTRAINT authors_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.authors_same_as
    ADD CONSTRAINT authors_same_as_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs_items
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_cta_banner
    ADD CONSTRAINT b2b_pages_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_faq_items
    ADD CONSTRAINT b2b_pages_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_faq
    ADD CONSTRAINT b2b_pages_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_lead_form
    ADD CONSTRAINT b2b_pages_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case_inline_facts
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid_items
    ADD CONSTRAINT b2b_pages_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid
    ADD CONSTRAINT b2b_pages_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_text_content
    ADD CONSTRAINT b2b_pages_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_blocks_tldr
    ADD CONSTRAINT b2b_pages_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.b2b_pages_robots_directives
    ADD CONSTRAINT b2b_pages_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_author_id_authors_id_fk FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_blocks_breadcrumbs_items
    ADD CONSTRAINT blog_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_breadcrumbs
    ADD CONSTRAINT blog_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_cta_banner
    ADD CONSTRAINT blog_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_faq_items
    ADD CONSTRAINT blog_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_faq
    ADD CONSTRAINT blog_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_related_services_items
    ADD CONSTRAINT blog_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_related_services
    ADD CONSTRAINT blog_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_text_content
    ADD CONSTRAINT blog_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_blocks_tldr
    ADD CONSTRAINT blog_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_faq_block
    ADD CONSTRAINT blog_faq_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_how_to_steps
    ADD CONSTRAINT blog_how_to_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.blog_robots_directives
    ADD CONSTRAINT blog_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_breadcrumbs_items
    ADD CONSTRAINT cases_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_breadcrumbs
    ADD CONSTRAINT cases_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_cta_banner
    ADD CONSTRAINT cases_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_blocks_mini_case_inline_facts
    ADD CONSTRAINT cases_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_related_services_items
    ADD CONSTRAINT cases_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_related_services
    ADD CONSTRAINT cases_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_blocks_text_content
    ADD CONSTRAINT cases_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.cases_robots_directives
    ADD CONSTRAINT cases_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_blocks_breadcrumbs_items
    ADD CONSTRAINT districts_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_breadcrumbs
    ADD CONSTRAINT districts_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_lead_form
    ADD CONSTRAINT districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_blocks_mini_case_inline_facts
    ADD CONSTRAINT districts_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_neighbor_districts_items
    ADD CONSTRAINT districts_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_neighbor_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_neighbor_districts
    ADD CONSTRAINT districts_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_services_grid_items
    ADD CONSTRAINT districts_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_services_grid
    ADD CONSTRAINT districts_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_text_content
    ADD CONSTRAINT districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_blocks_tldr
    ADD CONSTRAINT districts_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_landmarks
    ADD CONSTRAINT districts_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_photo_geo_id_media_id_fk FOREIGN KEY (photo_geo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.districts_robots_directives
    ADD CONSTRAINT districts_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_photo_id_media_id_fk FOREIGN KEY (photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.homepage_faq
    ADD CONSTRAINT homepage_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_photo_id_media_id_fk FOREIGN KEY (photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_hero_photo_id_media_id_fk FOREIGN KEY (hero_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.homepage_hero_trust_bullets
    ADD CONSTRAINT homepage_hero_trust_bullets_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_photo_smeta_example_image_id_media_id_fk FOREIGN KEY (photo_smeta_example_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.homepage_pricing_rows
    ADD CONSTRAINT homepage_pricing_rows_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_review_sources
    ADD CONSTRAINT homepage_review_sources_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_reviews
    ADD CONSTRAINT homepage_reviews_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_steps
    ADD CONSTRAINT homepage_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.leads_photos
    ADD CONSTRAINT leads_photos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.leads(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_b2b_pages_fk FOREIGN KEY (b2b_pages_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blog(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_leads_fk FOREIGN KEY (leads_id) REFERENCES public.leads(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_redirects_fk FOREIGN KEY (redirects_id) REFERENCES public.redirects(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_reviews_fk FOREIGN KEY (reviews_id) REFERENCES public.reviews(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_rum_metrics_fk FOREIGN KEY (rum_metrics_id) REFERENCES public.rum_metrics(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_service_districts_fk FOREIGN KEY (service_districts_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.seo_settings_credentials
    ADD CONSTRAINT seo_settings_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.seo_settings(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_default_og_image_id_media_id_fk FOREIGN KEY (default_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs_items
    ADD CONSTRAINT service_districts_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs
    ADD CONSTRAINT service_districts_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_calculator_placeholder
    ADD CONSTRAINT service_districts_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts_items
    ADD CONSTRAINT service_districts_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_neighbor_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts
    ADD CONSTRAINT service_districts_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_pricing_table
    ADD CONSTRAINT service_districts_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers_features
    ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_features_parent_id FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_pricing_table_tiers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers
    ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_pricing_table(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_process_steps
    ADD CONSTRAINT service_districts_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_process_steps_steps
    ADD CONSTRAINT service_districts_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_process_steps(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_related_services_items
    ADD CONSTRAINT service_districts_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_related_services
    ADD CONSTRAINT service_districts_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_tldr
    ADD CONSTRAINT service_districts_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts_local_faq
    ADD CONSTRAINT service_districts_local_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_local_landmarks
    ADD CONSTRAINT service_districts_local_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_mini_case_id_cases_id_fk FOREIGN KEY (mini_case_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_blocks_breadcrumbs_items
    ADD CONSTRAINT services_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_breadcrumbs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_breadcrumbs
    ADD CONSTRAINT services_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_calculator_placeholder
    ADD CONSTRAINT services_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_cta_banner
    ADD CONSTRAINT services_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_faq_items
    ADD CONSTRAINT services_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_faq
    ADD CONSTRAINT services_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_lead_form
    ADD CONSTRAINT services_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_blocks_mini_case_inline_facts
    ADD CONSTRAINT services_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_mini_case(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_pricing_table
    ADD CONSTRAINT services_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_pricing_table_tiers_features
    ADD CONSTRAINT services_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_pricing_table_tiers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_pricing_table_tiers
    ADD CONSTRAINT services_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_pricing_table(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_process_steps
    ADD CONSTRAINT services_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_process_steps_steps
    ADD CONSTRAINT services_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_process_steps(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_related_services_items
    ADD CONSTRAINT services_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_related_services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_related_services
    ADD CONSTRAINT services_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_services_grid_items
    ADD CONSTRAINT services_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_services_grid(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_services_grid
    ADD CONSTRAINT services_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_text_content
    ADD CONSTRAINT services_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_blocks_tldr
    ADD CONSTRAINT services_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_faq_global
    ADD CONSTRAINT services_faq_global_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.services_robots_directives
    ADD CONSTRAINT services_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.services_sub_services
    ADD CONSTRAINT services_sub_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.site_chrome_footer_columns_items
    ADD CONSTRAINT site_chrome_footer_columns_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome_footer_columns(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.site_chrome_footer_columns
    ADD CONSTRAINT site_chrome_footer_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.site_chrome_header_menu
    ADD CONSTRAINT site_chrome_header_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.site_chrome_social
    ADD CONSTRAINT site_chrome_social_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.users_recovery_codes
    ADD CONSTRAINT users_recovery_codes_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;
