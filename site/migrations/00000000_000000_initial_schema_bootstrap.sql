--
-- PostgreSQL database dump
--

\restrict 9evp988cYQ6AgXPrdtVGEzjVQBIlJ7ij0GjrqIE7g8Bd4BSsDKJCtF1C0B621to

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: enum__authors_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__authors_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__authors_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__authors_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__authors_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__authors_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__authors_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__authors_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);


--
-- Name: enum__authors_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__authors_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__b2b_pages_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__b2b_pages_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__b2b_pages_v_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum__b2b_pages_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__b2b_pages_v_version_audience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_version_audience AS ENUM (
    'uk',
    'tszh',
    'uk-tszh',
    'fm',
    'zastroyshchik',
    'gostorgi'
);


--
-- Name: enum__b2b_pages_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive'
);


--
-- Name: enum__b2b_pages_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__b2b_pages_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__blog_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__blog_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__blog_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__blog_v_version_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_version_category AS ENUM (
    'arbo',
    'sneg',
    'musor',
    'demontazh',
    'b2b',
    'regulyatorika',
    'evergreen'
);


--
-- Name: enum__blog_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum__blog_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__blog_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__cases_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__cases_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__cases_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__cases_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__cases_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__cases_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__cases_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__cases_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum__cases_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__cases_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__districts_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__districts_v_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum__districts_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__districts_v_version_landmarks_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_version_landmarks_type AS ENUM (
    'kp',
    'mkr',
    'snt',
    'object'
);


--
-- Name: enum__districts_v_version_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_version_priority AS ENUM (
    'A',
    'B',
    'C'
);


--
-- Name: enum__districts_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);


--
-- Name: enum__districts_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__districts_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__service_districts_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__service_districts_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__service_districts_v_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum__service_districts_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__service_districts_v_version_publish_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_version_publish_status AS ENUM (
    'draft',
    'review',
    'published',
    'archived'
);


--
-- Name: enum__service_districts_v_version_robots; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_version_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);


--
-- Name: enum__service_districts_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__service_districts_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum__services_v_blocks_calculator_placeholder_service_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_blocks_calculator_placeholder_service_type AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);


--
-- Name: enum__services_v_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum__services_v_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum__services_v_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum__services_v_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum__services_v_version_price_unit; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_version_price_unit AS ENUM (
    'object',
    'tree',
    'm3',
    'shift',
    'm2'
);


--
-- Name: enum__services_v_version_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_version_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum__services_v_version_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum__services_v_version_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_authors_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_authors_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_authors_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_authors_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_authors_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_authors_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_authors_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_authors_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);


--
-- Name: enum_authors_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_authors_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_b2b_pages_audience; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_audience AS ENUM (
    'uk',
    'tszh',
    'uk-tszh',
    'fm',
    'zastroyshchik',
    'gostorgi'
);


--
-- Name: enum_b2b_pages_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_b2b_pages_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_b2b_pages_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum_b2b_pages_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_b2b_pages_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive'
);


--
-- Name: enum_b2b_pages_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_b2b_pages_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_blog_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_blog_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_blog_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_blog_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_category AS ENUM (
    'arbo',
    'sneg',
    'musor',
    'demontazh',
    'b2b',
    'regulyatorika',
    'evergreen'
);


--
-- Name: enum_blog_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum_blog_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_blog_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_cases_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_cases_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_cases_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_cases_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_cases_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_cases_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_cases_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_cases_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum_cases_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_cases_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_districts_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_districts_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum_districts_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_districts_landmarks_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_landmarks_type AS ENUM (
    'kp',
    'mkr',
    'snt',
    'object'
);


--
-- Name: enum_districts_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_priority AS ENUM (
    'A',
    'B',
    'C'
);


--
-- Name: enum_districts_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow'
);


--
-- Name: enum_districts_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_districts_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_leads_preferred_channel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_preferred_channel AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'phone'
);


--
-- Name: enum_leads_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_status AS ENUM (
    'new',
    'contacted',
    'smeta',
    'brigade',
    'done',
    'cancelled',
    'spam'
);


--
-- Name: enum_media_license; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_media_license AS ENUM (
    'proprietary',
    'cc-by',
    'public-domain'
);


--
-- Name: enum_redirects_status_code; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_redirects_status_code AS ENUM (
    '301',
    '302',
    '410'
);


--
-- Name: enum_service_districts_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_service_districts_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_service_districts_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum_service_districts_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_service_districts_publish_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_publish_status AS ENUM (
    'draft',
    'review',
    'published',
    'archived'
);


--
-- Name: enum_service_districts_robots; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_robots AS ENUM (
    'index,follow',
    'noindex,follow',
    'noindex,nofollow',
    'index,nofollow'
);


--
-- Name: enum_service_districts_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_service_districts_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_services_blocks_calculator_placeholder_service_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_blocks_calculator_placeholder_service_type AS ENUM (
    'spil',
    'musor',
    'krysha',
    'demontazh'
);


--
-- Name: enum_services_blocks_cta_banner_accent; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);


--
-- Name: enum_services_blocks_hero_seasonal_theme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);


--
-- Name: enum_services_blocks_lead_form_variant; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);


--
-- Name: enum_services_blocks_text_content_columns; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);


--
-- Name: enum_services_price_unit; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_price_unit AS ENUM (
    'object',
    'tree',
    'm3',
    'shift',
    'm2'
);


--
-- Name: enum_services_robots_directives; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_robots_directives AS ENUM (
    'index',
    'noindex',
    'follow',
    'nofollow',
    'noarchive',
    'nosnippet'
);


--
-- Name: enum_services_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_services_status AS ENUM (
    'draft',
    'published'
);


--
-- Name: enum_site_chrome_footer_columns_items_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_site_chrome_footer_columns_items_kind AS ENUM (
    'anchor',
    'route',
    'external'
);


--
-- Name: enum_site_chrome_header_cta_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_site_chrome_header_cta_kind AS ENUM (
    'anchor',
    'route',
    'external'
);


--
-- Name: enum_site_chrome_header_menu_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_site_chrome_header_menu_kind AS ENUM (
    'anchor',
    'route',
    'external'
);


--
-- Name: enum_site_chrome_social_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_site_chrome_social_type AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'vk',
    'youtube',
    'yandex-zen',
    'other'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'manager',
    'seo',
    'content'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _authors_v; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_breadcrumbs_id_seq OWNED BY public._authors_v_blocks_breadcrumbs.id;


--
-- Name: _authors_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _authors_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_breadcrumbs_items_id_seq OWNED BY public._authors_v_blocks_breadcrumbs_items.id;


--
-- Name: _authors_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_cta_banner_id_seq OWNED BY public._authors_v_blocks_cta_banner.id;


--
-- Name: _authors_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_hero_id_seq OWNED BY public._authors_v_blocks_hero.id;


--
-- Name: _authors_v_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_related_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_related_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_related_services_id_seq OWNED BY public._authors_v_blocks_related_services.id;


--
-- Name: _authors_v_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);


--
-- Name: _authors_v_blocks_related_services_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_related_services_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_related_services_items_id_seq OWNED BY public._authors_v_blocks_related_services_items.id;


--
-- Name: _authors_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _authors_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_blocks_text_content_id_seq OWNED BY public._authors_v_blocks_text_content.id;


--
-- Name: _authors_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_id_seq OWNED BY public._authors_v.id;


--
-- Name: _authors_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer
);


--
-- Name: _authors_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_rels_id_seq OWNED BY public._authors_v_rels.id;


--
-- Name: _authors_v_version_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_version_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    issuer character varying,
    issued_at timestamp(3) with time zone,
    _uuid character varying
);


--
-- Name: _authors_v_version_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_version_credentials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_version_credentials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_version_credentials_id_seq OWNED BY public._authors_v_version_credentials.id;


--
-- Name: _authors_v_version_knows_about; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_version_knows_about (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    topic character varying,
    _uuid character varying
);


--
-- Name: _authors_v_version_knows_about_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_version_knows_about_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_version_knows_about_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_version_knows_about_id_seq OWNED BY public._authors_v_version_knows_about.id;


--
-- Name: _authors_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__authors_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _authors_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_version_robots_directives_id_seq OWNED BY public._authors_v_version_robots_directives.id;


--
-- Name: _authors_v_version_same_as; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._authors_v_version_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    url character varying,
    _uuid character varying
);


--
-- Name: _authors_v_version_same_as_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._authors_v_version_same_as_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _authors_v_version_same_as_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._authors_v_version_same_as_id_seq OWNED BY public._authors_v_version_same_as.id;


--
-- Name: _b2b_pages_v; Type: TABLE; Schema: public; Owner: -
--

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
    version_breadcrumb_label character varying
);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_id_seq OWNED BY public._b2b_pages_v_blocks_breadcrumbs.id;


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._b2b_pages_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_breadcrumbs_items_id_seq OWNED BY public._b2b_pages_v_blocks_breadcrumbs_items.id;


--
-- Name: _b2b_pages_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_cta_banner_id_seq OWNED BY public._b2b_pages_v_blocks_cta_banner.id;


--
-- Name: _b2b_pages_v_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_faq_id_seq OWNED BY public._b2b_pages_v_blocks_faq.id;


--
-- Name: _b2b_pages_v_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._b2b_pages_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _b2b_pages_v_blocks_faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_faq_items_id_seq OWNED BY public._b2b_pages_v_blocks_faq_items.id;


--
-- Name: _b2b_pages_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_hero_id_seq OWNED BY public._b2b_pages_v_blocks_hero.id;


--
-- Name: _b2b_pages_v_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_lead_form_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_lead_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_lead_form_id_seq OWNED BY public._b2b_pages_v_blocks_lead_form.id;


--
-- Name: _b2b_pages_v_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_mini_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_mini_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_mini_case_id_seq OWNED BY public._b2b_pages_v_blocks_mini_case.id;


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._b2b_pages_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._b2b_pages_v_blocks_mini_case_inline_facts.id;


--
-- Name: _b2b_pages_v_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_services_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_services_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_services_grid_id_seq OWNED BY public._b2b_pages_v_blocks_services_grid.id;


--
-- Name: _b2b_pages_v_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_services_grid_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_services_grid_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_services_grid_items_id_seq OWNED BY public._b2b_pages_v_blocks_services_grid_items.id;


--
-- Name: _b2b_pages_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_text_content_id_seq OWNED BY public._b2b_pages_v_blocks_text_content.id;


--
-- Name: _b2b_pages_v_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _b2b_pages_v_blocks_tldr_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_blocks_tldr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_blocks_tldr_id_seq OWNED BY public._b2b_pages_v_blocks_tldr.id;


--
-- Name: _b2b_pages_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_id_seq OWNED BY public._b2b_pages_v.id;


--
-- Name: _b2b_pages_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._b2b_pages_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    cases_id integer,
    services_id integer
);


--
-- Name: _b2b_pages_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_rels_id_seq OWNED BY public._b2b_pages_v_rels.id;


--
-- Name: _b2b_pages_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._b2b_pages_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__b2b_pages_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _b2b_pages_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._b2b_pages_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _b2b_pages_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._b2b_pages_v_version_robots_directives_id_seq OWNED BY public._b2b_pages_v_version_robots_directives.id;


--
-- Name: _blog_v; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_breadcrumbs_id_seq OWNED BY public._blog_v_blocks_breadcrumbs.id;


--
-- Name: _blog_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _blog_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_breadcrumbs_items_id_seq OWNED BY public._blog_v_blocks_breadcrumbs_items.id;


--
-- Name: _blog_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_cta_banner_id_seq OWNED BY public._blog_v_blocks_cta_banner.id;


--
-- Name: _blog_v_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_faq_id_seq OWNED BY public._blog_v_blocks_faq.id;


--
-- Name: _blog_v_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _blog_v_blocks_faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_faq_items_id_seq OWNED BY public._blog_v_blocks_faq_items.id;


--
-- Name: _blog_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_hero_id_seq OWNED BY public._blog_v_blocks_hero.id;


--
-- Name: _blog_v_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_related_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_related_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_related_services_id_seq OWNED BY public._blog_v_blocks_related_services.id;


--
-- Name: _blog_v_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);


--
-- Name: _blog_v_blocks_related_services_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_related_services_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_related_services_items_id_seq OWNED BY public._blog_v_blocks_related_services_items.id;


--
-- Name: _blog_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_text_content_id_seq OWNED BY public._blog_v_blocks_text_content.id;


--
-- Name: _blog_v_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _blog_v_blocks_tldr_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_blocks_tldr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_blocks_tldr_id_seq OWNED BY public._blog_v_blocks_tldr.id;


--
-- Name: _blog_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_id_seq OWNED BY public._blog_v.id;


--
-- Name: _blog_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer,
    districts_id integer
);


--
-- Name: _blog_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_rels_id_seq OWNED BY public._blog_v_rels.id;


--
-- Name: _blog_v_version_faq_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_version_faq_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _blog_v_version_faq_block_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_version_faq_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_version_faq_block_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_version_faq_block_id_seq OWNED BY public._blog_v_version_faq_block.id;


--
-- Name: _blog_v_version_how_to_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_version_how_to_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    text jsonb,
    _uuid character varying
);


--
-- Name: _blog_v_version_how_to_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_version_how_to_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_version_how_to_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_version_how_to_steps_id_seq OWNED BY public._blog_v_version_how_to_steps.id;


--
-- Name: _blog_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._blog_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__blog_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _blog_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._blog_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _blog_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._blog_v_version_robots_directives_id_seq OWNED BY public._blog_v_version_robots_directives.id;


--
-- Name: _cases_v; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_breadcrumbs_id_seq OWNED BY public._cases_v_blocks_breadcrumbs.id;


--
-- Name: _cases_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _cases_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_breadcrumbs_items_id_seq OWNED BY public._cases_v_blocks_breadcrumbs_items.id;


--
-- Name: _cases_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_cta_banner_id_seq OWNED BY public._cases_v_blocks_cta_banner.id;


--
-- Name: _cases_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_hero_id_seq OWNED BY public._cases_v_blocks_hero.id;


--
-- Name: _cases_v_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_mini_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_mini_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_mini_case_id_seq OWNED BY public._cases_v_blocks_mini_case.id;


--
-- Name: _cases_v_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);


--
-- Name: _cases_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._cases_v_blocks_mini_case_inline_facts.id;


--
-- Name: _cases_v_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_related_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_related_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_related_services_id_seq OWNED BY public._cases_v_blocks_related_services.id;


--
-- Name: _cases_v_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);


--
-- Name: _cases_v_blocks_related_services_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_related_services_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_related_services_items_id_seq OWNED BY public._cases_v_blocks_related_services_items.id;


--
-- Name: _cases_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _cases_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_blocks_text_content_id_seq OWNED BY public._cases_v_blocks_text_content.id;


--
-- Name: _cases_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_id_seq OWNED BY public._cases_v.id;


--
-- Name: _cases_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    authors_id integer
);


--
-- Name: _cases_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_rels_id_seq OWNED BY public._cases_v_rels.id;


--
-- Name: _cases_v_version_photos_after; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_version_photos_after (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    caption character varying,
    _uuid character varying
);


--
-- Name: _cases_v_version_photos_after_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_version_photos_after_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_version_photos_after_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_version_photos_after_id_seq OWNED BY public._cases_v_version_photos_after.id;


--
-- Name: _cases_v_version_photos_before; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_version_photos_before (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    caption character varying,
    _uuid character varying
);


--
-- Name: _cases_v_version_photos_before_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_version_photos_before_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_version_photos_before_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_version_photos_before_id_seq OWNED BY public._cases_v_version_photos_before.id;


--
-- Name: _cases_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._cases_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__cases_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _cases_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._cases_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _cases_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._cases_v_version_robots_directives_id_seq OWNED BY public._cases_v_version_robots_directives.id;


--
-- Name: _districts_v; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_breadcrumbs_id_seq OWNED BY public._districts_v_blocks_breadcrumbs.id;


--
-- Name: _districts_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _districts_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_breadcrumbs_items_id_seq OWNED BY public._districts_v_blocks_breadcrumbs_items.id;


--
-- Name: _districts_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_hero_id_seq OWNED BY public._districts_v_blocks_hero.id;


--
-- Name: _districts_v_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_lead_form_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_lead_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_lead_form_id_seq OWNED BY public._districts_v_blocks_lead_form.id;


--
-- Name: _districts_v_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_mini_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_mini_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_mini_case_id_seq OWNED BY public._districts_v_blocks_mini_case.id;


--
-- Name: _districts_v_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);


--
-- Name: _districts_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._districts_v_blocks_mini_case_inline_facts.id;


--
-- Name: _districts_v_blocks_neighbor_districts; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_neighbor_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_neighbor_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_neighbor_districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_neighbor_districts_id_seq OWNED BY public._districts_v_blocks_neighbor_districts.id;


--
-- Name: _districts_v_blocks_neighbor_districts_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    slug character varying,
    distance character varying,
    _uuid character varying
);


--
-- Name: _districts_v_blocks_neighbor_districts_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_neighbor_districts_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_neighbor_districts_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_neighbor_districts_items_id_seq OWNED BY public._districts_v_blocks_neighbor_districts_items.id;


--
-- Name: _districts_v_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_services_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_services_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_services_grid_id_seq OWNED BY public._districts_v_blocks_services_grid.id;


--
-- Name: _districts_v_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_services_grid_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_services_grid_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_services_grid_items_id_seq OWNED BY public._districts_v_blocks_services_grid_items.id;


--
-- Name: _districts_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_text_content_id_seq OWNED BY public._districts_v_blocks_text_content.id;


--
-- Name: _districts_v_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _districts_v_blocks_tldr_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_blocks_tldr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_blocks_tldr_id_seq OWNED BY public._districts_v_blocks_tldr.id;


--
-- Name: _districts_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_id_seq OWNED BY public._districts_v.id;


--
-- Name: _districts_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer,
    services_id integer
);


--
-- Name: _districts_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_rels_id_seq OWNED BY public._districts_v_rels.id;


--
-- Name: _districts_v_version_landmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_version_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    type public.enum__districts_v_version_landmarks_type,
    _uuid character varying
);


--
-- Name: _districts_v_version_landmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_version_landmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_version_landmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_version_landmarks_id_seq OWNED BY public._districts_v_version_landmarks.id;


--
-- Name: _districts_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._districts_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__districts_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _districts_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._districts_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _districts_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._districts_v_version_robots_directives_id_seq OWNED BY public._districts_v_version_robots_directives.id;


--
-- Name: _service_districts_v; Type: TABLE; Schema: public; Owner: -
--

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
    version_sub_service_slug character varying
);


--
-- Name: _service_districts_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _service_districts_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq OWNED BY public._service_districts_v_blocks_cta_banner.id;


--
-- Name: _service_districts_v_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _service_districts_v_blocks_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_faq_id_seq OWNED BY public._service_districts_v_blocks_faq.id;


--
-- Name: _service_districts_v_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._service_districts_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _service_districts_v_blocks_faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_faq_items_id_seq OWNED BY public._service_districts_v_blocks_faq_items.id;


--
-- Name: _service_districts_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _service_districts_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_hero_id_seq OWNED BY public._service_districts_v_blocks_hero.id;


--
-- Name: _service_districts_v_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _service_districts_v_blocks_lead_form_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_lead_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_lead_form_id_seq OWNED BY public._service_districts_v_blocks_lead_form.id;


--
-- Name: _service_districts_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _service_districts_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_blocks_text_content_id_seq OWNED BY public._service_districts_v_blocks_text_content.id;


--
-- Name: _service_districts_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_id_seq OWNED BY public._service_districts_v.id;


--
-- Name: _service_districts_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._service_districts_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);


--
-- Name: _service_districts_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_rels_id_seq OWNED BY public._service_districts_v_rels.id;


--
-- Name: _service_districts_v_version_local_faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._service_districts_v_version_local_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _service_districts_v_version_local_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_version_local_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_version_local_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_version_local_faq_id_seq OWNED BY public._service_districts_v_version_local_faq.id;


--
-- Name: _service_districts_v_version_local_landmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._service_districts_v_version_local_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    landmark_name character varying,
    _uuid character varying
);


--
-- Name: _service_districts_v_version_local_landmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._service_districts_v_version_local_landmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _service_districts_v_version_local_landmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._service_districts_v_version_local_landmarks_id_seq OWNED BY public._service_districts_v_version_local_landmarks.id;


--
-- Name: _services_v; Type: TABLE; Schema: public; Owner: -
--

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
    version_breadcrumb_label character varying
);


--
-- Name: _services_v_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_breadcrumbs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_breadcrumbs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_breadcrumbs_id_seq OWNED BY public._services_v_blocks_breadcrumbs.id;


--
-- Name: _services_v_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);


--
-- Name: _services_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_breadcrumbs_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_breadcrumbs_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_breadcrumbs_items_id_seq OWNED BY public._services_v_blocks_breadcrumbs_items.id;


--
-- Name: _services_v_blocks_calculator_placeholder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum__services_v_blocks_calculator_placeholder_service_type,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
    _uuid character varying,
    block_name character varying
);


--
-- Name: _services_v_blocks_calculator_placeholder_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_calculator_placeholder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_calculator_placeholder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_calculator_placeholder_id_seq OWNED BY public._services_v_blocks_calculator_placeholder.id;


--
-- Name: _services_v_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_cta_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_cta_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_cta_banner_id_seq OWNED BY public._services_v_blocks_cta_banner.id;


--
-- Name: _services_v_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_faq_id_seq OWNED BY public._services_v_blocks_faq.id;


--
-- Name: _services_v_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _services_v_blocks_faq_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_faq_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_faq_items_id_seq OWNED BY public._services_v_blocks_faq_items.id;


--
-- Name: _services_v_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_hero_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_hero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_hero_id_seq OWNED BY public._services_v_blocks_hero.id;


--
-- Name: _services_v_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_lead_form_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_lead_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_lead_form_id_seq OWNED BY public._services_v_blocks_lead_form.id;


--
-- Name: _services_v_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_mini_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_mini_case_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_mini_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_mini_case_id_seq OWNED BY public._services_v_blocks_mini_case.id;


--
-- Name: _services_v_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    label character varying,
    value character varying,
    _uuid character varying
);


--
-- Name: _services_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_mini_case_inline_facts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_mini_case_inline_facts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_mini_case_inline_facts_id_seq OWNED BY public._services_v_blocks_mini_case_inline_facts.id;


--
-- Name: _services_v_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_related_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_related_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_related_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_related_services_id_seq OWNED BY public._services_v_blocks_related_services.id;


--
-- Name: _services_v_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);


--
-- Name: _services_v_blocks_related_services_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_related_services_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_related_services_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_related_services_items_id_seq OWNED BY public._services_v_blocks_related_services_items.id;


--
-- Name: _services_v_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_services_grid_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_services_grid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_services_grid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_services_grid_id_seq OWNED BY public._services_v_blocks_services_grid.id;


--
-- Name: _services_v_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_services_grid_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_services_grid_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_services_grid_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_services_grid_items_id_seq OWNED BY public._services_v_blocks_services_grid_items.id;


--
-- Name: _services_v_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_text_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_text_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_text_content_id_seq OWNED BY public._services_v_blocks_text_content.id;


--
-- Name: _services_v_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_blocks_tldr_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_blocks_tldr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_blocks_tldr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_blocks_tldr_id_seq OWNED BY public._services_v_blocks_tldr.id;


--
-- Name: _services_v_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_id_seq OWNED BY public._services_v.id;


--
-- Name: _services_v_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);


--
-- Name: _services_v_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_rels_id_seq OWNED BY public._services_v_rels.id;


--
-- Name: _services_v_version_faq_global; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_version_faq_global (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);


--
-- Name: _services_v_version_faq_global_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_version_faq_global_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_version_faq_global_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_version_faq_global_id_seq OWNED BY public._services_v_version_faq_global.id;


--
-- Name: _services_v_version_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_version_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    image_id integer,
    _uuid character varying
);


--
-- Name: _services_v_version_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_version_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_version_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_version_gallery_id_seq OWNED BY public._services_v_version_gallery.id;


--
-- Name: _services_v_version_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._services_v_version_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum__services_v_version_robots_directives,
    id integer NOT NULL
);


--
-- Name: _services_v_version_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_version_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_version_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_version_robots_directives_id_seq OWNED BY public._services_v_version_robots_directives.id;


--
-- Name: _services_v_version_sub_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: _services_v_version_sub_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public._services_v_version_sub_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: _services_v_version_sub_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public._services_v_version_sub_services_id_seq OWNED BY public._services_v_version_sub_services.id;


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: authors_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);


--
-- Name: authors_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: authors_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    issuer character varying,
    issued_at timestamp(3) with time zone
);


--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: authors_knows_about; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_knows_about (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    topic character varying
);


--
-- Name: authors_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer
);


--
-- Name: authors_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_rels_id_seq OWNED BY public.authors_rels.id;


--
-- Name: authors_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_authors_robots_directives,
    id integer NOT NULL
);


--
-- Name: authors_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authors_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authors_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authors_robots_directives_id_seq OWNED BY public.authors_robots_directives.id;


--
-- Name: authors_same_as; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authors_same_as (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    url character varying
);


--
-- Name: b2b_pages; Type: TABLE; Schema: public; Owner: -
--

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
    breadcrumb_label character varying
);


--
-- Name: b2b_pages_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: b2b_pages_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: b2b_pages_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);


--
-- Name: b2b_pages_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);


--
-- Name: b2b_pages_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: b2b_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.b2b_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: b2b_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.b2b_pages_id_seq OWNED BY public.b2b_pages.id;


--
-- Name: b2b_pages_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    cases_id integer,
    services_id integer
);


--
-- Name: b2b_pages_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.b2b_pages_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: b2b_pages_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.b2b_pages_rels_id_seq OWNED BY public.b2b_pages_rels.id;


--
-- Name: b2b_pages_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.b2b_pages_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_b2b_pages_robots_directives,
    id integer NOT NULL
);


--
-- Name: b2b_pages_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.b2b_pages_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: b2b_pages_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.b2b_pages_robots_directives_id_seq OWNED BY public.b2b_pages_robots_directives.id;


--
-- Name: blog; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: blog_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: blog_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);


--
-- Name: blog_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: blog_faq_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_faq_block (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: blog_how_to_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_how_to_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    text jsonb
);


--
-- Name: blog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_id_seq OWNED BY public.blog.id;


--
-- Name: blog_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer,
    districts_id integer
);


--
-- Name: blog_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_rels_id_seq OWNED BY public.blog_rels.id;


--
-- Name: blog_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_blog_robots_directives,
    id integer NOT NULL
);


--
-- Name: blog_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_robots_directives_id_seq OWNED BY public.blog_robots_directives.id;


--
-- Name: cases; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: cases_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);


--
-- Name: cases_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);


--
-- Name: cases_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: cases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cases_id_seq OWNED BY public.cases.id;


--
-- Name: cases_photos_after; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_photos_after (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    caption character varying
);


--
-- Name: cases_photos_before; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_photos_before (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer,
    caption character varying
);


--
-- Name: cases_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    authors_id integer
);


--
-- Name: cases_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cases_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cases_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cases_rels_id_seq OWNED BY public.cases_rels.id;


--
-- Name: cases_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cases_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_cases_robots_directives,
    id integer NOT NULL
);


--
-- Name: cases_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cases_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cases_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cases_robots_directives_id_seq OWNED BY public.cases_robots_directives.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: districts_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);


--
-- Name: districts_blocks_neighbor_districts; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_neighbor_districts_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    slug character varying,
    distance character varying
);


--
-- Name: districts_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);


--
-- Name: districts_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.districts_id_seq OWNED BY public.districts.id;


--
-- Name: districts_landmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    type public.enum_districts_landmarks_type
);


--
-- Name: districts_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    districts_id integer,
    services_id integer
);


--
-- Name: districts_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.districts_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: districts_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.districts_rels_id_seq OWNED BY public.districts_rels.id;


--
-- Name: districts_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.districts_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_districts_robots_directives,
    id integer NOT NULL
);


--
-- Name: districts_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.districts_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: districts_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.districts_robots_directives_id_seq OWNED BY public.districts_robots_directives.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: leads_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads_photos (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    s3_key character varying,
    url character varying
);


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

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
    authors_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: redirects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redirects (
    id integer NOT NULL,
    "from" character varying NOT NULL,
    "to" character varying NOT NULL,
    status_code public.enum_redirects_status_code DEFAULT '301'::public.enum_redirects_status_code,
    note character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: redirects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.redirects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: redirects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.redirects_id_seq OWNED BY public.redirects.id;


--
-- Name: seo_settings; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: seo_settings_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_settings_credentials (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    issuer character varying,
    document_url character varying
);


--
-- Name: seo_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_settings_id_seq OWNED BY public.seo_settings.id;


--
-- Name: service_districts; Type: TABLE; Schema: public; Owner: -
--

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
    sub_service_slug character varying
);


--
-- Name: service_districts_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: service_districts_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: service_districts_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_districts_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: service_districts_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: service_districts_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: service_districts_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: service_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_districts_id_seq OWNED BY public.service_districts.id;


--
-- Name: service_districts_local_faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_districts_local_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: service_districts_local_landmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_districts_local_landmarks (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    landmark_name character varying
);


--
-- Name: service_districts_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_districts_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);


--
-- Name: service_districts_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_districts_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_districts_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_districts_rels_id_seq OWNED BY public.service_districts_rels.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

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
    breadcrumb_label character varying
);


--
-- Name: services_blocks_breadcrumbs; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_breadcrumbs_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);


--
-- Name: services_blocks_calculator_placeholder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_calculator_placeholder (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying,
    body character varying,
    service_type public.enum_services_blocks_calculator_placeholder_service_type,
    cta_label character varying DEFAULT 'Запросить смету через фото'::character varying,
    cta_href character varying DEFAULT '/foto-smeta/'::character varying,
    block_name character varying
);


--
-- Name: services_blocks_cta_banner; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_faq; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_faq_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: services_blocks_hero; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_lead_form; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_mini_case; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_mini_case_inline_facts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_mini_case_inline_facts (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    label character varying,
    value character varying
);


--
-- Name: services_blocks_related_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_related_services_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);


--
-- Name: services_blocks_services_grid; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_services_grid_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_blocks_services_grid_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    icon character varying,
    summary character varying
);


--
-- Name: services_blocks_text_content; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_blocks_tldr; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: services_faq_global; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_faq_global (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);


--
-- Name: services_gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: services_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    services_id integer
);


--
-- Name: services_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_rels_id_seq OWNED BY public.services_rels.id;


--
-- Name: services_robots_directives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services_robots_directives (
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    value public.enum_services_robots_directives,
    id integer NOT NULL
);


--
-- Name: services_robots_directives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_robots_directives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_robots_directives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_robots_directives_id_seq OWNED BY public.services_robots_directives.id;


--
-- Name: services_sub_services; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: site_chrome; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: site_chrome_footer_columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_chrome_footer_columns (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL
);


--
-- Name: site_chrome_footer_columns_items; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: site_chrome_header_menu; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: site_chrome_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_chrome_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_chrome_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_chrome_id_seq OWNED BY public.site_chrome.id;


--
-- Name: site_chrome_social; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_chrome_social (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    type public.enum_site_chrome_social_type NOT NULL,
    url character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

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
    enable_a_p_i_key boolean,
    api_key character varying,
    api_key_index character varying,
    totp_enabled boolean DEFAULT false,
    totp_secret_enc character varying
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_recovery_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_recovery_codes (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    hash character varying NOT NULL,
    consumed_at timestamp(3) with time zone
);


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: _authors_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v ALTER COLUMN id SET DEFAULT nextval('public._authors_v_id_seq'::regclass);


--
-- Name: _authors_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _authors_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _authors_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _authors_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_hero_id_seq'::regclass);


--
-- Name: _authors_v_blocks_related_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_related_services_id_seq'::regclass);


--
-- Name: _authors_v_blocks_related_services_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_related_services_items_id_seq'::regclass);


--
-- Name: _authors_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._authors_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _authors_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_rels ALTER COLUMN id SET DEFAULT nextval('public._authors_v_rels_id_seq'::regclass);


--
-- Name: _authors_v_version_credentials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_credentials ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_credentials_id_seq'::regclass);


--
-- Name: _authors_v_version_knows_about id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_knows_about ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_knows_about_id_seq'::regclass);


--
-- Name: _authors_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _authors_v_version_same_as id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_same_as ALTER COLUMN id SET DEFAULT nextval('public._authors_v_version_same_as_id_seq'::regclass);


--
-- Name: _b2b_pages_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_faq_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_faq_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_faq_items_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_hero_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_lead_form id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_lead_form_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_mini_case id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_mini_case_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_mini_case_inline_facts_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_services_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_services_grid_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_services_grid_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_services_grid_items_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _b2b_pages_v_blocks_tldr id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_blocks_tldr_id_seq'::regclass);


--
-- Name: _b2b_pages_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_rels ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_rels_id_seq'::regclass);


--
-- Name: _b2b_pages_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._b2b_pages_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _blog_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v ALTER COLUMN id SET DEFAULT nextval('public._blog_v_id_seq'::regclass);


--
-- Name: _blog_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _blog_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _blog_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _blog_v_blocks_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_faq_id_seq'::regclass);


--
-- Name: _blog_v_blocks_faq_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_faq_items_id_seq'::regclass);


--
-- Name: _blog_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_hero_id_seq'::regclass);


--
-- Name: _blog_v_blocks_related_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_related_services_id_seq'::regclass);


--
-- Name: _blog_v_blocks_related_services_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_related_services_items_id_seq'::regclass);


--
-- Name: _blog_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _blog_v_blocks_tldr id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._blog_v_blocks_tldr_id_seq'::regclass);


--
-- Name: _blog_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_rels ALTER COLUMN id SET DEFAULT nextval('public._blog_v_rels_id_seq'::regclass);


--
-- Name: _blog_v_version_faq_block id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_faq_block ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_faq_block_id_seq'::regclass);


--
-- Name: _blog_v_version_how_to_steps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_how_to_steps ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_how_to_steps_id_seq'::regclass);


--
-- Name: _blog_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._blog_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _cases_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v ALTER COLUMN id SET DEFAULT nextval('public._cases_v_id_seq'::regclass);


--
-- Name: _cases_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _cases_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _cases_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _cases_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_hero_id_seq'::regclass);


--
-- Name: _cases_v_blocks_mini_case id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_mini_case_id_seq'::regclass);


--
-- Name: _cases_v_blocks_mini_case_inline_facts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_mini_case_inline_facts_id_seq'::regclass);


--
-- Name: _cases_v_blocks_related_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_related_services_id_seq'::regclass);


--
-- Name: _cases_v_blocks_related_services_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_related_services_items_id_seq'::regclass);


--
-- Name: _cases_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._cases_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _cases_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_rels ALTER COLUMN id SET DEFAULT nextval('public._cases_v_rels_id_seq'::regclass);


--
-- Name: _cases_v_version_photos_after id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_after ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_photos_after_id_seq'::regclass);


--
-- Name: _cases_v_version_photos_before id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_before ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_photos_before_id_seq'::regclass);


--
-- Name: _cases_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._cases_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _districts_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v ALTER COLUMN id SET DEFAULT nextval('public._districts_v_id_seq'::regclass);


--
-- Name: _districts_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _districts_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _districts_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_hero_id_seq'::regclass);


--
-- Name: _districts_v_blocks_lead_form id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_lead_form_id_seq'::regclass);


--
-- Name: _districts_v_blocks_mini_case id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_mini_case_id_seq'::regclass);


--
-- Name: _districts_v_blocks_mini_case_inline_facts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_mini_case_inline_facts_id_seq'::regclass);


--
-- Name: _districts_v_blocks_neighbor_districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_neighbor_districts_id_seq'::regclass);


--
-- Name: _districts_v_blocks_neighbor_districts_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_neighbor_districts_items_id_seq'::regclass);


--
-- Name: _districts_v_blocks_services_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_services_grid_id_seq'::regclass);


--
-- Name: _districts_v_blocks_services_grid_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_services_grid_items_id_seq'::regclass);


--
-- Name: _districts_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _districts_v_blocks_tldr id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._districts_v_blocks_tldr_id_seq'::regclass);


--
-- Name: _districts_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_rels ALTER COLUMN id SET DEFAULT nextval('public._districts_v_rels_id_seq'::regclass);


--
-- Name: _districts_v_version_landmarks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_landmarks ALTER COLUMN id SET DEFAULT nextval('public._districts_v_version_landmarks_id_seq'::regclass);


--
-- Name: _districts_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._districts_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _service_districts_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_faq_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_items_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_hero_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_lead_form id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_lead_form_id_seq'::regclass);


--
-- Name: _service_districts_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _service_districts_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_rels ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_rels_id_seq'::regclass);


--
-- Name: _service_districts_v_version_local_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_version_local_faq_id_seq'::regclass);


--
-- Name: _service_districts_v_version_local_landmarks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_version_local_landmarks_id_seq'::regclass);


--
-- Name: _services_v id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v ALTER COLUMN id SET DEFAULT nextval('public._services_v_id_seq'::regclass);


--
-- Name: _services_v_blocks_breadcrumbs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_breadcrumbs_id_seq'::regclass);


--
-- Name: _services_v_blocks_breadcrumbs_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_breadcrumbs_items_id_seq'::regclass);


--
-- Name: _services_v_blocks_calculator_placeholder id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_calculator_placeholder_id_seq'::regclass);


--
-- Name: _services_v_blocks_cta_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_cta_banner_id_seq'::regclass);


--
-- Name: _services_v_blocks_faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_faq_id_seq'::regclass);


--
-- Name: _services_v_blocks_faq_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_faq_items_id_seq'::regclass);


--
-- Name: _services_v_blocks_hero id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_hero_id_seq'::regclass);


--
-- Name: _services_v_blocks_lead_form id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_lead_form_id_seq'::regclass);


--
-- Name: _services_v_blocks_mini_case id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_mini_case_id_seq'::regclass);


--
-- Name: _services_v_blocks_mini_case_inline_facts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_mini_case_inline_facts_id_seq'::regclass);


--
-- Name: _services_v_blocks_related_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_related_services_id_seq'::regclass);


--
-- Name: _services_v_blocks_related_services_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_related_services_items_id_seq'::regclass);


--
-- Name: _services_v_blocks_services_grid id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_services_grid_id_seq'::regclass);


--
-- Name: _services_v_blocks_services_grid_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid_items ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_services_grid_items_id_seq'::regclass);


--
-- Name: _services_v_blocks_text_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_text_content_id_seq'::regclass);


--
-- Name: _services_v_blocks_tldr id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_tldr ALTER COLUMN id SET DEFAULT nextval('public._services_v_blocks_tldr_id_seq'::regclass);


--
-- Name: _services_v_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_rels ALTER COLUMN id SET DEFAULT nextval('public._services_v_rels_id_seq'::regclass);


--
-- Name: _services_v_version_faq_global id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_faq_global ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_faq_global_id_seq'::regclass);


--
-- Name: _services_v_version_gallery id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_gallery ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_gallery_id_seq'::regclass);


--
-- Name: _services_v_version_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_robots_directives ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_robots_directives_id_seq'::regclass);


--
-- Name: _services_v_version_sub_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_sub_services ALTER COLUMN id SET DEFAULT nextval('public._services_v_version_sub_services_id_seq'::regclass);


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: authors_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_rels ALTER COLUMN id SET DEFAULT nextval('public.authors_rels_id_seq'::regclass);


--
-- Name: authors_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.authors_robots_directives_id_seq'::regclass);


--
-- Name: b2b_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_id_seq'::regclass);


--
-- Name: b2b_pages_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_rels ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_rels_id_seq'::regclass);


--
-- Name: b2b_pages_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.b2b_pages_robots_directives_id_seq'::regclass);


--
-- Name: blog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog ALTER COLUMN id SET DEFAULT nextval('public.blog_id_seq'::regclass);


--
-- Name: blog_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_rels ALTER COLUMN id SET DEFAULT nextval('public.blog_rels_id_seq'::regclass);


--
-- Name: blog_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.blog_robots_directives_id_seq'::regclass);


--
-- Name: cases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases ALTER COLUMN id SET DEFAULT nextval('public.cases_id_seq'::regclass);


--
-- Name: cases_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_rels ALTER COLUMN id SET DEFAULT nextval('public.cases_rels_id_seq'::regclass);


--
-- Name: cases_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.cases_robots_directives_id_seq'::regclass);


--
-- Name: districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts ALTER COLUMN id SET DEFAULT nextval('public.districts_id_seq'::regclass);


--
-- Name: districts_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_rels ALTER COLUMN id SET DEFAULT nextval('public.districts_rels_id_seq'::regclass);


--
-- Name: districts_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.districts_robots_directives_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: redirects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirects ALTER COLUMN id SET DEFAULT nextval('public.redirects_id_seq'::regclass);


--
-- Name: seo_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings ALTER COLUMN id SET DEFAULT nextval('public.seo_settings_id_seq'::regclass);


--
-- Name: service_districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts ALTER COLUMN id SET DEFAULT nextval('public.service_districts_id_seq'::regclass);


--
-- Name: service_districts_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_rels ALTER COLUMN id SET DEFAULT nextval('public.service_districts_rels_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: services_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels ALTER COLUMN id SET DEFAULT nextval('public.services_rels_id_seq'::regclass);


--
-- Name: services_robots_directives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_robots_directives ALTER COLUMN id SET DEFAULT nextval('public.services_robots_directives_id_seq'::regclass);


--
-- Name: site_chrome id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome ALTER COLUMN id SET DEFAULT nextval('public.site_chrome_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: _authors_v_blocks_breadcrumbs_items _authors_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_breadcrumbs _authors_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_cta_banner _authors_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_cta_banner
    ADD CONSTRAINT _authors_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_hero _authors_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_related_services_items _authors_v_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services_items
    ADD CONSTRAINT _authors_v_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_related_services _authors_v_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services
    ADD CONSTRAINT _authors_v_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_text_content _authors_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_text_content
    ADD CONSTRAINT _authors_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _authors_v _authors_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_rels _authors_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_version_credentials _authors_v_version_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_credentials
    ADD CONSTRAINT _authors_v_version_credentials_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_version_knows_about _authors_v_version_knows_about_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_knows_about
    ADD CONSTRAINT _authors_v_version_knows_about_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_version_robots_directives _authors_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_robots_directives
    ADD CONSTRAINT _authors_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_version_same_as _authors_v_version_same_as_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_same_as
    ADD CONSTRAINT _authors_v_version_same_as_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items _b2b_pages_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs _b2b_pages_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_cta_banner _b2b_pages_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner
    ADD CONSTRAINT _b2b_pages_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_faq_items _b2b_pages_v_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_faq _b2b_pages_v_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_hero _b2b_pages_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_lead_form _b2b_pages_v_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form
    ADD CONSTRAINT _b2b_pages_v_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts _b2b_pages_v_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_mini_case _b2b_pages_v_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_services_grid_items _b2b_pages_v_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_services_grid _b2b_pages_v_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_text_content _b2b_pages_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content
    ADD CONSTRAINT _b2b_pages_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_blocks_tldr _b2b_pages_v_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr
    ADD CONSTRAINT _b2b_pages_v_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v _b2b_pages_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v
    ADD CONSTRAINT _b2b_pages_v_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_rels _b2b_pages_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _b2b_pages_v_version_robots_directives _b2b_pages_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives
    ADD CONSTRAINT _b2b_pages_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_breadcrumbs_items _blog_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_breadcrumbs _blog_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_cta_banner _blog_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_cta_banner
    ADD CONSTRAINT _blog_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_faq_items _blog_v_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq_items
    ADD CONSTRAINT _blog_v_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_faq _blog_v_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq
    ADD CONSTRAINT _blog_v_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_hero _blog_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_related_services_items _blog_v_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services_items
    ADD CONSTRAINT _blog_v_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_related_services _blog_v_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services
    ADD CONSTRAINT _blog_v_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_text_content _blog_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_text_content
    ADD CONSTRAINT _blog_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_blocks_tldr _blog_v_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_tldr
    ADD CONSTRAINT _blog_v_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: _blog_v _blog_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_rels _blog_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_version_faq_block _blog_v_version_faq_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_faq_block
    ADD CONSTRAINT _blog_v_version_faq_block_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_version_how_to_steps _blog_v_version_how_to_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_how_to_steps
    ADD CONSTRAINT _blog_v_version_how_to_steps_pkey PRIMARY KEY (id);


--
-- Name: _blog_v_version_robots_directives _blog_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_robots_directives
    ADD CONSTRAINT _blog_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_breadcrumbs_items _cases_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_breadcrumbs _cases_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_cta_banner _cases_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_cta_banner
    ADD CONSTRAINT _cases_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_hero _cases_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_mini_case_inline_facts _cases_v_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_mini_case _cases_v_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_related_services_items _cases_v_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services_items
    ADD CONSTRAINT _cases_v_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_related_services _cases_v_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services
    ADD CONSTRAINT _cases_v_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_blocks_text_content _cases_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_text_content
    ADD CONSTRAINT _cases_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _cases_v _cases_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_rels _cases_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_version_photos_after _cases_v_version_photos_after_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_version_photos_before _cases_v_version_photos_before_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_pkey PRIMARY KEY (id);


--
-- Name: _cases_v_version_robots_directives _cases_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_robots_directives
    ADD CONSTRAINT _cases_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_breadcrumbs_items _districts_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_breadcrumbs _districts_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_hero _districts_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_lead_form _districts_v_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_lead_form
    ADD CONSTRAINT _districts_v_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_mini_case_inline_facts _districts_v_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_mini_case _districts_v_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_neighbor_districts_items _districts_v_blocks_neighbor_districts_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_neighbor_districts _districts_v_blocks_neighbor_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_services_grid_items _districts_v_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items
    ADD CONSTRAINT _districts_v_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_services_grid _districts_v_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid
    ADD CONSTRAINT _districts_v_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_text_content _districts_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_text_content
    ADD CONSTRAINT _districts_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_blocks_tldr _districts_v_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_tldr
    ADD CONSTRAINT _districts_v_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: _districts_v _districts_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_rels _districts_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_version_landmarks _districts_v_version_landmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_landmarks
    ADD CONSTRAINT _districts_v_version_landmarks_pkey PRIMARY KEY (id);


--
-- Name: _districts_v_version_robots_directives _districts_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_robots_directives
    ADD CONSTRAINT _districts_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_cta_banner _service_districts_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_faq_items _service_districts_v_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_faq _service_districts_v_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_hero _service_districts_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_lead_form _service_districts_v_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_blocks_text_content _service_districts_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v _service_districts_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_rels _service_districts_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_version_local_faq _service_districts_v_version_local_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_faq
    ADD CONSTRAINT _service_districts_v_version_local_faq_pkey PRIMARY KEY (id);


--
-- Name: _service_districts_v_version_local_landmarks _service_districts_v_version_local_landmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks
    ADD CONSTRAINT _service_districts_v_version_local_landmarks_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_breadcrumbs_items _services_v_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_breadcrumbs _services_v_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_calculator_placeholder _services_v_blocks_calculator_placeholder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder
    ADD CONSTRAINT _services_v_blocks_calculator_placeholder_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_cta_banner _services_v_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_cta_banner
    ADD CONSTRAINT _services_v_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_faq_items _services_v_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq_items
    ADD CONSTRAINT _services_v_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_faq _services_v_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq
    ADD CONSTRAINT _services_v_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_hero _services_v_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_lead_form _services_v_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_lead_form
    ADD CONSTRAINT _services_v_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_mini_case_inline_facts _services_v_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_mini_case _services_v_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_related_services_items _services_v_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services_items
    ADD CONSTRAINT _services_v_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_related_services _services_v_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services
    ADD CONSTRAINT _services_v_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_services_grid_items _services_v_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid_items
    ADD CONSTRAINT _services_v_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_services_grid _services_v_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid
    ADD CONSTRAINT _services_v_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_text_content _services_v_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_text_content
    ADD CONSTRAINT _services_v_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: _services_v_blocks_tldr _services_v_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_tldr
    ADD CONSTRAINT _services_v_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: _services_v _services_v_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_pkey PRIMARY KEY (id);


--
-- Name: _services_v_rels _services_v_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_pkey PRIMARY KEY (id);


--
-- Name: _services_v_version_faq_global _services_v_version_faq_global_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_faq_global
    ADD CONSTRAINT _services_v_version_faq_global_pkey PRIMARY KEY (id);


--
-- Name: _services_v_version_gallery _services_v_version_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_pkey PRIMARY KEY (id);


--
-- Name: _services_v_version_robots_directives _services_v_version_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_robots_directives
    ADD CONSTRAINT _services_v_version_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: _services_v_version_sub_services _services_v_version_sub_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_sub_services
    ADD CONSTRAINT _services_v_version_sub_services_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_breadcrumbs_items authors_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_breadcrumbs_items
    ADD CONSTRAINT authors_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_breadcrumbs authors_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_breadcrumbs
    ADD CONSTRAINT authors_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_cta_banner authors_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_cta_banner
    ADD CONSTRAINT authors_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_hero authors_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_related_services_items authors_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_related_services_items
    ADD CONSTRAINT authors_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_related_services authors_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_related_services
    ADD CONSTRAINT authors_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: authors_blocks_text_content authors_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_text_content
    ADD CONSTRAINT authors_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: authors_credentials authors_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_credentials
    ADD CONSTRAINT authors_credentials_pkey PRIMARY KEY (id);


--
-- Name: authors_knows_about authors_knows_about_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_knows_about
    ADD CONSTRAINT authors_knows_about_pkey PRIMARY KEY (id);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: authors_rels authors_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_pkey PRIMARY KEY (id);


--
-- Name: authors_robots_directives authors_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_robots_directives
    ADD CONSTRAINT authors_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: authors_same_as authors_same_as_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_same_as
    ADD CONSTRAINT authors_same_as_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_breadcrumbs_items b2b_pages_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs_items
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_breadcrumbs b2b_pages_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_cta_banner b2b_pages_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_cta_banner
    ADD CONSTRAINT b2b_pages_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_faq_items b2b_pages_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_faq_items
    ADD CONSTRAINT b2b_pages_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_faq b2b_pages_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_faq
    ADD CONSTRAINT b2b_pages_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_hero b2b_pages_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_lead_form b2b_pages_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_lead_form
    ADD CONSTRAINT b2b_pages_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_mini_case_inline_facts b2b_pages_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case_inline_facts
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_mini_case b2b_pages_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_services_grid_items b2b_pages_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid_items
    ADD CONSTRAINT b2b_pages_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_services_grid b2b_pages_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid
    ADD CONSTRAINT b2b_pages_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_text_content b2b_pages_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_text_content
    ADD CONSTRAINT b2b_pages_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_blocks_tldr b2b_pages_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_tldr
    ADD CONSTRAINT b2b_pages_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages b2b_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages
    ADD CONSTRAINT b2b_pages_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_rels b2b_pages_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_pkey PRIMARY KEY (id);


--
-- Name: b2b_pages_robots_directives b2b_pages_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_robots_directives
    ADD CONSTRAINT b2b_pages_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_breadcrumbs_items blog_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_breadcrumbs_items
    ADD CONSTRAINT blog_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_breadcrumbs blog_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_breadcrumbs
    ADD CONSTRAINT blog_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_cta_banner blog_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_cta_banner
    ADD CONSTRAINT blog_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_faq_items blog_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_faq_items
    ADD CONSTRAINT blog_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_faq blog_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_faq
    ADD CONSTRAINT blog_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_hero blog_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_related_services_items blog_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_related_services_items
    ADD CONSTRAINT blog_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_related_services blog_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_related_services
    ADD CONSTRAINT blog_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_text_content blog_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_text_content
    ADD CONSTRAINT blog_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: blog_blocks_tldr blog_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_tldr
    ADD CONSTRAINT blog_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: blog_faq_block blog_faq_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_faq_block
    ADD CONSTRAINT blog_faq_block_pkey PRIMARY KEY (id);


--
-- Name: blog_how_to_steps blog_how_to_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_how_to_steps
    ADD CONSTRAINT blog_how_to_steps_pkey PRIMARY KEY (id);


--
-- Name: blog blog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (id);


--
-- Name: blog_rels blog_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_pkey PRIMARY KEY (id);


--
-- Name: blog_robots_directives blog_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_robots_directives
    ADD CONSTRAINT blog_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_breadcrumbs_items cases_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_breadcrumbs_items
    ADD CONSTRAINT cases_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_breadcrumbs cases_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_breadcrumbs
    ADD CONSTRAINT cases_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_cta_banner cases_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_cta_banner
    ADD CONSTRAINT cases_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_hero cases_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_mini_case_inline_facts cases_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case_inline_facts
    ADD CONSTRAINT cases_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_mini_case cases_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_related_services_items cases_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_related_services_items
    ADD CONSTRAINT cases_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_related_services cases_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_related_services
    ADD CONSTRAINT cases_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: cases_blocks_text_content cases_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_text_content
    ADD CONSTRAINT cases_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: cases_photos_after cases_photos_after_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_pkey PRIMARY KEY (id);


--
-- Name: cases_photos_before cases_photos_before_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: cases_rels cases_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_pkey PRIMARY KEY (id);


--
-- Name: cases_robots_directives cases_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_robots_directives
    ADD CONSTRAINT cases_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_breadcrumbs_items districts_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_breadcrumbs_items
    ADD CONSTRAINT districts_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_breadcrumbs districts_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_breadcrumbs
    ADD CONSTRAINT districts_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_hero districts_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_lead_form districts_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_lead_form
    ADD CONSTRAINT districts_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_mini_case_inline_facts districts_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case_inline_facts
    ADD CONSTRAINT districts_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_mini_case districts_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_neighbor_districts_items districts_blocks_neighbor_districts_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_neighbor_districts_items
    ADD CONSTRAINT districts_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_neighbor_districts districts_blocks_neighbor_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_neighbor_districts
    ADD CONSTRAINT districts_blocks_neighbor_districts_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_services_grid_items districts_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_services_grid_items
    ADD CONSTRAINT districts_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_services_grid districts_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_services_grid
    ADD CONSTRAINT districts_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_text_content districts_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_text_content
    ADD CONSTRAINT districts_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: districts_blocks_tldr districts_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_tldr
    ADD CONSTRAINT districts_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: districts_landmarks districts_landmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_landmarks
    ADD CONSTRAINT districts_landmarks_pkey PRIMARY KEY (id);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: districts_rels districts_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_pkey PRIMARY KEY (id);


--
-- Name: districts_robots_directives districts_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_robots_directives
    ADD CONSTRAINT districts_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: leads_photos leads_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads_photos
    ADD CONSTRAINT leads_photos_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: redirects redirects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);


--
-- Name: seo_settings_credentials seo_settings_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings_credentials
    ADD CONSTRAINT seo_settings_credentials_pkey PRIMARY KEY (id);


--
-- Name: seo_settings seo_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_cta_banner service_districts_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_faq_items service_districts_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_faq service_districts_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_hero service_districts_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_lead_form service_districts_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: service_districts_blocks_text_content service_districts_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: service_districts_local_faq service_districts_local_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_local_faq
    ADD CONSTRAINT service_districts_local_faq_pkey PRIMARY KEY (id);


--
-- Name: service_districts_local_landmarks service_districts_local_landmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_local_landmarks
    ADD CONSTRAINT service_districts_local_landmarks_pkey PRIMARY KEY (id);


--
-- Name: service_districts service_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_pkey PRIMARY KEY (id);


--
-- Name: service_districts_rels service_districts_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_breadcrumbs_items services_blocks_breadcrumbs_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_breadcrumbs_items
    ADD CONSTRAINT services_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_breadcrumbs services_blocks_breadcrumbs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_breadcrumbs
    ADD CONSTRAINT services_blocks_breadcrumbs_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_calculator_placeholder services_blocks_calculator_placeholder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_calculator_placeholder
    ADD CONSTRAINT services_blocks_calculator_placeholder_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_cta_banner services_blocks_cta_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_cta_banner
    ADD CONSTRAINT services_blocks_cta_banner_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_faq_items services_blocks_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_faq_items
    ADD CONSTRAINT services_blocks_faq_items_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_faq services_blocks_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_faq
    ADD CONSTRAINT services_blocks_faq_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_hero services_blocks_hero_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_lead_form services_blocks_lead_form_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_lead_form
    ADD CONSTRAINT services_blocks_lead_form_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_mini_case_inline_facts services_blocks_mini_case_inline_facts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case_inline_facts
    ADD CONSTRAINT services_blocks_mini_case_inline_facts_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_mini_case services_blocks_mini_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_related_services_items services_blocks_related_services_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_related_services_items
    ADD CONSTRAINT services_blocks_related_services_items_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_related_services services_blocks_related_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_related_services
    ADD CONSTRAINT services_blocks_related_services_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_services_grid_items services_blocks_services_grid_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_services_grid_items
    ADD CONSTRAINT services_blocks_services_grid_items_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_services_grid services_blocks_services_grid_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_services_grid
    ADD CONSTRAINT services_blocks_services_grid_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_text_content services_blocks_text_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_text_content
    ADD CONSTRAINT services_blocks_text_content_pkey PRIMARY KEY (id);


--
-- Name: services_blocks_tldr services_blocks_tldr_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_tldr
    ADD CONSTRAINT services_blocks_tldr_pkey PRIMARY KEY (id);


--
-- Name: services_faq_global services_faq_global_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_faq_global
    ADD CONSTRAINT services_faq_global_pkey PRIMARY KEY (id);


--
-- Name: services_gallery services_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services_rels services_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_pkey PRIMARY KEY (id);


--
-- Name: services_robots_directives services_robots_directives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_robots_directives
    ADD CONSTRAINT services_robots_directives_pkey PRIMARY KEY (id);


--
-- Name: services_sub_services services_sub_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_sub_services
    ADD CONSTRAINT services_sub_services_pkey PRIMARY KEY (id);


--
-- Name: site_chrome_footer_columns_items site_chrome_footer_columns_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_footer_columns_items
    ADD CONSTRAINT site_chrome_footer_columns_items_pkey PRIMARY KEY (id);


--
-- Name: site_chrome_footer_columns site_chrome_footer_columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_footer_columns
    ADD CONSTRAINT site_chrome_footer_columns_pkey PRIMARY KEY (id);


--
-- Name: site_chrome_header_menu site_chrome_header_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_header_menu
    ADD CONSTRAINT site_chrome_header_menu_pkey PRIMARY KEY (id);


--
-- Name: site_chrome site_chrome_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome
    ADD CONSTRAINT site_chrome_pkey PRIMARY KEY (id);


--
-- Name: site_chrome_social site_chrome_social_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_social
    ADD CONSTRAINT site_chrome_social_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_recovery_codes users_recovery_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_recovery_codes
    ADD CONSTRAINT users_recovery_codes_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: _authors_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_breadcrumbs_items_order_idx ON public._authors_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _authors_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_breadcrumbs_items_parent_id_idx ON public._authors_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _authors_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_breadcrumbs_order_idx ON public._authors_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _authors_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_breadcrumbs_parent_id_idx ON public._authors_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _authors_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_breadcrumbs_path_idx ON public._authors_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _authors_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_cta_banner_order_idx ON public._authors_v_blocks_cta_banner USING btree (_order);


--
-- Name: _authors_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_cta_banner_parent_id_idx ON public._authors_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _authors_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_cta_banner_path_idx ON public._authors_v_blocks_cta_banner USING btree (_path);


--
-- Name: _authors_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_hero_image_idx ON public._authors_v_blocks_hero USING btree (image_id);


--
-- Name: _authors_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_hero_order_idx ON public._authors_v_blocks_hero USING btree (_order);


--
-- Name: _authors_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_hero_parent_id_idx ON public._authors_v_blocks_hero USING btree (_parent_id);


--
-- Name: _authors_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_hero_path_idx ON public._authors_v_blocks_hero USING btree (_path);


--
-- Name: _authors_v_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_related_services_items_order_idx ON public._authors_v_blocks_related_services_items USING btree (_order);


--
-- Name: _authors_v_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_related_services_items_parent_id_idx ON public._authors_v_blocks_related_services_items USING btree (_parent_id);


--
-- Name: _authors_v_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_related_services_order_idx ON public._authors_v_blocks_related_services USING btree (_order);


--
-- Name: _authors_v_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_related_services_parent_id_idx ON public._authors_v_blocks_related_services USING btree (_parent_id);


--
-- Name: _authors_v_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_related_services_path_idx ON public._authors_v_blocks_related_services USING btree (_path);


--
-- Name: _authors_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_text_content_order_idx ON public._authors_v_blocks_text_content USING btree (_order);


--
-- Name: _authors_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_text_content_parent_id_idx ON public._authors_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _authors_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_blocks_text_content_path_idx ON public._authors_v_blocks_text_content USING btree (_path);


--
-- Name: _authors_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_created_at_idx ON public._authors_v USING btree (created_at);


--
-- Name: _authors_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_latest_idx ON public._authors_v USING btree (latest);


--
-- Name: _authors_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_parent_idx ON public._authors_v USING btree (parent_id);


--
-- Name: _authors_v_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_rels_districts_id_idx ON public._authors_v_rels USING btree (districts_id);


--
-- Name: _authors_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_rels_order_idx ON public._authors_v_rels USING btree ("order");


--
-- Name: _authors_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_rels_parent_idx ON public._authors_v_rels USING btree (parent_id);


--
-- Name: _authors_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_rels_path_idx ON public._authors_v_rels USING btree (path);


--
-- Name: _authors_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_updated_at_idx ON public._authors_v USING btree (updated_at);


--
-- Name: _authors_v_version_credentials_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_credentials_order_idx ON public._authors_v_version_credentials USING btree (_order);


--
-- Name: _authors_v_version_credentials_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_credentials_parent_id_idx ON public._authors_v_version_credentials USING btree (_parent_id);


--
-- Name: _authors_v_version_knows_about_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_knows_about_order_idx ON public._authors_v_version_knows_about USING btree (_order);


--
-- Name: _authors_v_version_knows_about_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_knows_about_parent_id_idx ON public._authors_v_version_knows_about USING btree (_parent_id);


--
-- Name: _authors_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_robots_directives_order_idx ON public._authors_v_version_robots_directives USING btree ("order");


--
-- Name: _authors_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_robots_directives_parent_idx ON public._authors_v_version_robots_directives USING btree (parent_id);


--
-- Name: _authors_v_version_same_as_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_same_as_order_idx ON public._authors_v_version_same_as USING btree (_order);


--
-- Name: _authors_v_version_same_as_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_same_as_parent_id_idx ON public._authors_v_version_same_as USING btree (_parent_id);


--
-- Name: _authors_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_version__status_idx ON public._authors_v USING btree (version__status);


--
-- Name: _authors_v_version_version_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_version_avatar_idx ON public._authors_v USING btree (version_avatar_id);


--
-- Name: _authors_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_version_created_at_idx ON public._authors_v USING btree (version_created_at);


--
-- Name: _authors_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_version_slug_idx ON public._authors_v USING btree (version_slug);


--
-- Name: _authors_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _authors_v_version_version_updated_at_idx ON public._authors_v USING btree (version_updated_at);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_items_order_idx ON public._b2b_pages_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_items_parent_id_idx ON public._b2b_pages_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_order_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_parent_id_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_breadcrumbs_path_idx ON public._b2b_pages_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_cta_banner_order_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_cta_banner_parent_id_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_cta_banner_path_idx ON public._b2b_pages_v_blocks_cta_banner USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_faq_items_order_idx ON public._b2b_pages_v_blocks_faq_items USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_faq_items_parent_id_idx ON public._b2b_pages_v_blocks_faq_items USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_faq_order_idx ON public._b2b_pages_v_blocks_faq USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_faq_parent_id_idx ON public._b2b_pages_v_blocks_faq USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_faq_path_idx ON public._b2b_pages_v_blocks_faq USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_hero_image_idx ON public._b2b_pages_v_blocks_hero USING btree (image_id);


--
-- Name: _b2b_pages_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_hero_order_idx ON public._b2b_pages_v_blocks_hero USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_hero_parent_id_idx ON public._b2b_pages_v_blocks_hero USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_hero_path_idx ON public._b2b_pages_v_blocks_hero USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_lead_form_order_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_lead_form_parent_id_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_lead_form_path_idx ON public._b2b_pages_v_blocks_lead_form USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_case_ref_idx ON public._b2b_pages_v_blocks_mini_case USING btree (case_ref_id);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_facts_order_idx ON public._b2b_pages_v_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_idx ON public._b2b_pages_v_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_inline_inline_photo_idx ON public._b2b_pages_v_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: _b2b_pages_v_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_order_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_parent_id_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_mini_case_path_idx ON public._b2b_pages_v_blocks_mini_case USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_services_grid_items_order_idx ON public._b2b_pages_v_blocks_services_grid_items USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_services_grid_items_parent_id_idx ON public._b2b_pages_v_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_services_grid_order_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_services_grid_parent_id_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_services_grid_path_idx ON public._b2b_pages_v_blocks_services_grid USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_text_content_order_idx ON public._b2b_pages_v_blocks_text_content USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_text_content_parent_id_idx ON public._b2b_pages_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_text_content_path_idx ON public._b2b_pages_v_blocks_text_content USING btree (_path);


--
-- Name: _b2b_pages_v_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_tldr_order_idx ON public._b2b_pages_v_blocks_tldr USING btree (_order);


--
-- Name: _b2b_pages_v_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_tldr_parent_id_idx ON public._b2b_pages_v_blocks_tldr USING btree (_parent_id);


--
-- Name: _b2b_pages_v_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_blocks_tldr_path_idx ON public._b2b_pages_v_blocks_tldr USING btree (_path);


--
-- Name: _b2b_pages_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_created_at_idx ON public._b2b_pages_v USING btree (created_at);


--
-- Name: _b2b_pages_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_latest_idx ON public._b2b_pages_v USING btree (latest);


--
-- Name: _b2b_pages_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_parent_idx ON public._b2b_pages_v USING btree (parent_id);


--
-- Name: _b2b_pages_v_rels_cases_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_rels_cases_id_idx ON public._b2b_pages_v_rels USING btree (cases_id);


--
-- Name: _b2b_pages_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_rels_order_idx ON public._b2b_pages_v_rels USING btree ("order");


--
-- Name: _b2b_pages_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_rels_parent_idx ON public._b2b_pages_v_rels USING btree (parent_id);


--
-- Name: _b2b_pages_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_rels_path_idx ON public._b2b_pages_v_rels USING btree (path);


--
-- Name: _b2b_pages_v_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_rels_services_id_idx ON public._b2b_pages_v_rels USING btree (services_id);


--
-- Name: _b2b_pages_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_updated_at_idx ON public._b2b_pages_v USING btree (updated_at);


--
-- Name: _b2b_pages_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_robots_directives_order_idx ON public._b2b_pages_v_version_robots_directives USING btree ("order");


--
-- Name: _b2b_pages_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_robots_directives_parent_idx ON public._b2b_pages_v_version_robots_directives USING btree (parent_id);


--
-- Name: _b2b_pages_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_version__status_idx ON public._b2b_pages_v USING btree (version__status);


--
-- Name: _b2b_pages_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_version_created_at_idx ON public._b2b_pages_v USING btree (version_created_at);


--
-- Name: _b2b_pages_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_version_slug_idx ON public._b2b_pages_v USING btree (version_slug);


--
-- Name: _b2b_pages_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _b2b_pages_v_version_version_updated_at_idx ON public._b2b_pages_v USING btree (version_updated_at);


--
-- Name: _blog_v_autosave_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_autosave_idx ON public._blog_v USING btree (autosave);


--
-- Name: _blog_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_breadcrumbs_items_order_idx ON public._blog_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _blog_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_breadcrumbs_items_parent_id_idx ON public._blog_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _blog_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_breadcrumbs_order_idx ON public._blog_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _blog_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_breadcrumbs_parent_id_idx ON public._blog_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _blog_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_breadcrumbs_path_idx ON public._blog_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _blog_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_cta_banner_order_idx ON public._blog_v_blocks_cta_banner USING btree (_order);


--
-- Name: _blog_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_cta_banner_parent_id_idx ON public._blog_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _blog_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_cta_banner_path_idx ON public._blog_v_blocks_cta_banner USING btree (_path);


--
-- Name: _blog_v_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_faq_items_order_idx ON public._blog_v_blocks_faq_items USING btree (_order);


--
-- Name: _blog_v_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_faq_items_parent_id_idx ON public._blog_v_blocks_faq_items USING btree (_parent_id);


--
-- Name: _blog_v_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_faq_order_idx ON public._blog_v_blocks_faq USING btree (_order);


--
-- Name: _blog_v_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_faq_parent_id_idx ON public._blog_v_blocks_faq USING btree (_parent_id);


--
-- Name: _blog_v_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_faq_path_idx ON public._blog_v_blocks_faq USING btree (_path);


--
-- Name: _blog_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_hero_image_idx ON public._blog_v_blocks_hero USING btree (image_id);


--
-- Name: _blog_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_hero_order_idx ON public._blog_v_blocks_hero USING btree (_order);


--
-- Name: _blog_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_hero_parent_id_idx ON public._blog_v_blocks_hero USING btree (_parent_id);


--
-- Name: _blog_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_hero_path_idx ON public._blog_v_blocks_hero USING btree (_path);


--
-- Name: _blog_v_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_related_services_items_order_idx ON public._blog_v_blocks_related_services_items USING btree (_order);


--
-- Name: _blog_v_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_related_services_items_parent_id_idx ON public._blog_v_blocks_related_services_items USING btree (_parent_id);


--
-- Name: _blog_v_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_related_services_order_idx ON public._blog_v_blocks_related_services USING btree (_order);


--
-- Name: _blog_v_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_related_services_parent_id_idx ON public._blog_v_blocks_related_services USING btree (_parent_id);


--
-- Name: _blog_v_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_related_services_path_idx ON public._blog_v_blocks_related_services USING btree (_path);


--
-- Name: _blog_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_text_content_order_idx ON public._blog_v_blocks_text_content USING btree (_order);


--
-- Name: _blog_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_text_content_parent_id_idx ON public._blog_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _blog_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_text_content_path_idx ON public._blog_v_blocks_text_content USING btree (_path);


--
-- Name: _blog_v_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_tldr_order_idx ON public._blog_v_blocks_tldr USING btree (_order);


--
-- Name: _blog_v_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_tldr_parent_id_idx ON public._blog_v_blocks_tldr USING btree (_parent_id);


--
-- Name: _blog_v_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_blocks_tldr_path_idx ON public._blog_v_blocks_tldr USING btree (_path);


--
-- Name: _blog_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_created_at_idx ON public._blog_v USING btree (created_at);


--
-- Name: _blog_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_latest_idx ON public._blog_v USING btree (latest);


--
-- Name: _blog_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_parent_idx ON public._blog_v USING btree (parent_id);


--
-- Name: _blog_v_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_rels_districts_id_idx ON public._blog_v_rels USING btree (districts_id);


--
-- Name: _blog_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_rels_order_idx ON public._blog_v_rels USING btree ("order");


--
-- Name: _blog_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_rels_parent_idx ON public._blog_v_rels USING btree (parent_id);


--
-- Name: _blog_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_rels_path_idx ON public._blog_v_rels USING btree (path);


--
-- Name: _blog_v_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_rels_services_id_idx ON public._blog_v_rels USING btree (services_id);


--
-- Name: _blog_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_updated_at_idx ON public._blog_v USING btree (updated_at);


--
-- Name: _blog_v_version_faq_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_faq_block_order_idx ON public._blog_v_version_faq_block USING btree (_order);


--
-- Name: _blog_v_version_faq_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_faq_block_parent_id_idx ON public._blog_v_version_faq_block USING btree (_parent_id);


--
-- Name: _blog_v_version_how_to_steps_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_how_to_steps_order_idx ON public._blog_v_version_how_to_steps USING btree (_order);


--
-- Name: _blog_v_version_how_to_steps_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_how_to_steps_parent_id_idx ON public._blog_v_version_how_to_steps USING btree (_parent_id);


--
-- Name: _blog_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_robots_directives_order_idx ON public._blog_v_version_robots_directives USING btree ("order");


--
-- Name: _blog_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_robots_directives_parent_idx ON public._blog_v_version_robots_directives USING btree (parent_id);


--
-- Name: _blog_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version__status_idx ON public._blog_v USING btree (version__status);


--
-- Name: _blog_v_version_version_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_author_idx ON public._blog_v USING btree (version_author_id);


--
-- Name: _blog_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_created_at_idx ON public._blog_v USING btree (version_created_at);


--
-- Name: _blog_v_version_version_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_hero_image_idx ON public._blog_v USING btree (version_hero_image_id);


--
-- Name: _blog_v_version_version_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_og_image_idx ON public._blog_v USING btree (version_og_image_id);


--
-- Name: _blog_v_version_version_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_reviewed_by_idx ON public._blog_v USING btree (version_reviewed_by_id);


--
-- Name: _blog_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_slug_idx ON public._blog_v USING btree (version_slug);


--
-- Name: _blog_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _blog_v_version_version_updated_at_idx ON public._blog_v USING btree (version_updated_at);


--
-- Name: _cases_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_breadcrumbs_items_order_idx ON public._cases_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _cases_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_breadcrumbs_items_parent_id_idx ON public._cases_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _cases_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_breadcrumbs_order_idx ON public._cases_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _cases_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_breadcrumbs_parent_id_idx ON public._cases_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _cases_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_breadcrumbs_path_idx ON public._cases_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _cases_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_cta_banner_order_idx ON public._cases_v_blocks_cta_banner USING btree (_order);


--
-- Name: _cases_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_cta_banner_parent_id_idx ON public._cases_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _cases_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_cta_banner_path_idx ON public._cases_v_blocks_cta_banner USING btree (_path);


--
-- Name: _cases_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_hero_image_idx ON public._cases_v_blocks_hero USING btree (image_id);


--
-- Name: _cases_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_hero_order_idx ON public._cases_v_blocks_hero USING btree (_order);


--
-- Name: _cases_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_hero_parent_id_idx ON public._cases_v_blocks_hero USING btree (_parent_id);


--
-- Name: _cases_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_hero_path_idx ON public._cases_v_blocks_hero USING btree (_path);


--
-- Name: _cases_v_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_case_ref_idx ON public._cases_v_blocks_mini_case USING btree (case_ref_id);


--
-- Name: _cases_v_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_inline_facts_order_idx ON public._cases_v_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: _cases_v_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_inline_facts_parent_id_idx ON public._cases_v_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: _cases_v_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_inline_inline_photo_idx ON public._cases_v_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: _cases_v_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_order_idx ON public._cases_v_blocks_mini_case USING btree (_order);


--
-- Name: _cases_v_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_parent_id_idx ON public._cases_v_blocks_mini_case USING btree (_parent_id);


--
-- Name: _cases_v_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_mini_case_path_idx ON public._cases_v_blocks_mini_case USING btree (_path);


--
-- Name: _cases_v_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_related_services_items_order_idx ON public._cases_v_blocks_related_services_items USING btree (_order);


--
-- Name: _cases_v_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_related_services_items_parent_id_idx ON public._cases_v_blocks_related_services_items USING btree (_parent_id);


--
-- Name: _cases_v_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_related_services_order_idx ON public._cases_v_blocks_related_services USING btree (_order);


--
-- Name: _cases_v_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_related_services_parent_id_idx ON public._cases_v_blocks_related_services USING btree (_parent_id);


--
-- Name: _cases_v_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_related_services_path_idx ON public._cases_v_blocks_related_services USING btree (_path);


--
-- Name: _cases_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_text_content_order_idx ON public._cases_v_blocks_text_content USING btree (_order);


--
-- Name: _cases_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_text_content_parent_id_idx ON public._cases_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _cases_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_blocks_text_content_path_idx ON public._cases_v_blocks_text_content USING btree (_path);


--
-- Name: _cases_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_created_at_idx ON public._cases_v USING btree (created_at);


--
-- Name: _cases_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_latest_idx ON public._cases_v USING btree (latest);


--
-- Name: _cases_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_parent_idx ON public._cases_v USING btree (parent_id);


--
-- Name: _cases_v_rels_authors_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_rels_authors_id_idx ON public._cases_v_rels USING btree (authors_id);


--
-- Name: _cases_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_rels_order_idx ON public._cases_v_rels USING btree ("order");


--
-- Name: _cases_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_rels_parent_idx ON public._cases_v_rels USING btree (parent_id);


--
-- Name: _cases_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_rels_path_idx ON public._cases_v_rels USING btree (path);


--
-- Name: _cases_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_updated_at_idx ON public._cases_v USING btree (updated_at);


--
-- Name: _cases_v_version_photos_after_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_after_image_idx ON public._cases_v_version_photos_after USING btree (image_id);


--
-- Name: _cases_v_version_photos_after_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_after_order_idx ON public._cases_v_version_photos_after USING btree (_order);


--
-- Name: _cases_v_version_photos_after_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_after_parent_id_idx ON public._cases_v_version_photos_after USING btree (_parent_id);


--
-- Name: _cases_v_version_photos_before_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_before_image_idx ON public._cases_v_version_photos_before USING btree (image_id);


--
-- Name: _cases_v_version_photos_before_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_before_order_idx ON public._cases_v_version_photos_before USING btree (_order);


--
-- Name: _cases_v_version_photos_before_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_photos_before_parent_id_idx ON public._cases_v_version_photos_before USING btree (_parent_id);


--
-- Name: _cases_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_robots_directives_order_idx ON public._cases_v_version_robots_directives USING btree ("order");


--
-- Name: _cases_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_robots_directives_parent_idx ON public._cases_v_version_robots_directives USING btree (parent_id);


--
-- Name: _cases_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version__status_idx ON public._cases_v USING btree (version__status);


--
-- Name: _cases_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_created_at_idx ON public._cases_v USING btree (version_created_at);


--
-- Name: _cases_v_version_version_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_district_idx ON public._cases_v USING btree (version_district_id);


--
-- Name: _cases_v_version_version_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_og_image_idx ON public._cases_v USING btree (version_og_image_id);


--
-- Name: _cases_v_version_version_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_reviewed_by_idx ON public._cases_v USING btree (version_reviewed_by_id);


--
-- Name: _cases_v_version_version_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_service_idx ON public._cases_v USING btree (version_service_id);


--
-- Name: _cases_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_slug_idx ON public._cases_v USING btree (version_slug);


--
-- Name: _cases_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _cases_v_version_version_updated_at_idx ON public._cases_v USING btree (version_updated_at);


--
-- Name: _districts_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_breadcrumbs_items_order_idx ON public._districts_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _districts_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_breadcrumbs_items_parent_id_idx ON public._districts_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _districts_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_breadcrumbs_order_idx ON public._districts_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _districts_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_breadcrumbs_parent_id_idx ON public._districts_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _districts_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_breadcrumbs_path_idx ON public._districts_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _districts_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_hero_image_idx ON public._districts_v_blocks_hero USING btree (image_id);


--
-- Name: _districts_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_hero_order_idx ON public._districts_v_blocks_hero USING btree (_order);


--
-- Name: _districts_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_hero_parent_id_idx ON public._districts_v_blocks_hero USING btree (_parent_id);


--
-- Name: _districts_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_hero_path_idx ON public._districts_v_blocks_hero USING btree (_path);


--
-- Name: _districts_v_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_lead_form_order_idx ON public._districts_v_blocks_lead_form USING btree (_order);


--
-- Name: _districts_v_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_lead_form_parent_id_idx ON public._districts_v_blocks_lead_form USING btree (_parent_id);


--
-- Name: _districts_v_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_lead_form_path_idx ON public._districts_v_blocks_lead_form USING btree (_path);


--
-- Name: _districts_v_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_case_ref_idx ON public._districts_v_blocks_mini_case USING btree (case_ref_id);


--
-- Name: _districts_v_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_inline_facts_order_idx ON public._districts_v_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: _districts_v_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_inline_facts_parent_id_idx ON public._districts_v_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: _districts_v_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_inline_inline_photo_idx ON public._districts_v_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: _districts_v_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_order_idx ON public._districts_v_blocks_mini_case USING btree (_order);


--
-- Name: _districts_v_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_parent_id_idx ON public._districts_v_blocks_mini_case USING btree (_parent_id);


--
-- Name: _districts_v_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_mini_case_path_idx ON public._districts_v_blocks_mini_case USING btree (_path);


--
-- Name: _districts_v_blocks_neighbor_districts_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_neighbor_districts_items_order_idx ON public._districts_v_blocks_neighbor_districts_items USING btree (_order);


--
-- Name: _districts_v_blocks_neighbor_districts_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_neighbor_districts_items_parent_id_idx ON public._districts_v_blocks_neighbor_districts_items USING btree (_parent_id);


--
-- Name: _districts_v_blocks_neighbor_districts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_neighbor_districts_order_idx ON public._districts_v_blocks_neighbor_districts USING btree (_order);


--
-- Name: _districts_v_blocks_neighbor_districts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_neighbor_districts_parent_id_idx ON public._districts_v_blocks_neighbor_districts USING btree (_parent_id);


--
-- Name: _districts_v_blocks_neighbor_districts_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_neighbor_districts_path_idx ON public._districts_v_blocks_neighbor_districts USING btree (_path);


--
-- Name: _districts_v_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_services_grid_items_order_idx ON public._districts_v_blocks_services_grid_items USING btree (_order);


--
-- Name: _districts_v_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_services_grid_items_parent_id_idx ON public._districts_v_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: _districts_v_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_services_grid_order_idx ON public._districts_v_blocks_services_grid USING btree (_order);


--
-- Name: _districts_v_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_services_grid_parent_id_idx ON public._districts_v_blocks_services_grid USING btree (_parent_id);


--
-- Name: _districts_v_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_services_grid_path_idx ON public._districts_v_blocks_services_grid USING btree (_path);


--
-- Name: _districts_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_text_content_order_idx ON public._districts_v_blocks_text_content USING btree (_order);


--
-- Name: _districts_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_text_content_parent_id_idx ON public._districts_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _districts_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_text_content_path_idx ON public._districts_v_blocks_text_content USING btree (_path);


--
-- Name: _districts_v_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_tldr_order_idx ON public._districts_v_blocks_tldr USING btree (_order);


--
-- Name: _districts_v_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_tldr_parent_id_idx ON public._districts_v_blocks_tldr USING btree (_parent_id);


--
-- Name: _districts_v_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_blocks_tldr_path_idx ON public._districts_v_blocks_tldr USING btree (_path);


--
-- Name: _districts_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_created_at_idx ON public._districts_v USING btree (created_at);


--
-- Name: _districts_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_latest_idx ON public._districts_v USING btree (latest);


--
-- Name: _districts_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_parent_idx ON public._districts_v USING btree (parent_id);


--
-- Name: _districts_v_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_rels_districts_id_idx ON public._districts_v_rels USING btree (districts_id);


--
-- Name: _districts_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_rels_order_idx ON public._districts_v_rels USING btree ("order");


--
-- Name: _districts_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_rels_parent_idx ON public._districts_v_rels USING btree (parent_id);


--
-- Name: _districts_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_rels_path_idx ON public._districts_v_rels USING btree (path);


--
-- Name: _districts_v_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_rels_services_id_idx ON public._districts_v_rels USING btree (services_id);


--
-- Name: _districts_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_updated_at_idx ON public._districts_v USING btree (updated_at);


--
-- Name: _districts_v_version_landmarks_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_landmarks_order_idx ON public._districts_v_version_landmarks USING btree (_order);


--
-- Name: _districts_v_version_landmarks_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_landmarks_parent_id_idx ON public._districts_v_version_landmarks USING btree (_parent_id);


--
-- Name: _districts_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_robots_directives_order_idx ON public._districts_v_version_robots_directives USING btree ("order");


--
-- Name: _districts_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_robots_directives_parent_idx ON public._districts_v_version_robots_directives USING btree (parent_id);


--
-- Name: _districts_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version__status_idx ON public._districts_v USING btree (version__status);


--
-- Name: _districts_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version_created_at_idx ON public._districts_v USING btree (version_created_at);


--
-- Name: _districts_v_version_version_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version_hero_image_idx ON public._districts_v USING btree (version_hero_image_id);


--
-- Name: _districts_v_version_version_photo_geo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version_photo_geo_idx ON public._districts_v USING btree (version_photo_geo_id);


--
-- Name: _districts_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version_slug_idx ON public._districts_v USING btree (version_slug);


--
-- Name: _districts_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _districts_v_version_version_updated_at_idx ON public._districts_v USING btree (version_updated_at);


--
-- Name: _service_districts_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_cta_banner_order_idx ON public._service_districts_v_blocks_cta_banner USING btree (_order);


--
-- Name: _service_districts_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_cta_banner_parent_id_idx ON public._service_districts_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_cta_banner_path_idx ON public._service_districts_v_blocks_cta_banner USING btree (_path);


--
-- Name: _service_districts_v_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_faq_items_order_idx ON public._service_districts_v_blocks_faq_items USING btree (_order);


--
-- Name: _service_districts_v_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_faq_items_parent_id_idx ON public._service_districts_v_blocks_faq_items USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_faq_order_idx ON public._service_districts_v_blocks_faq USING btree (_order);


--
-- Name: _service_districts_v_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_faq_parent_id_idx ON public._service_districts_v_blocks_faq USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_faq_path_idx ON public._service_districts_v_blocks_faq USING btree (_path);


--
-- Name: _service_districts_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_hero_image_idx ON public._service_districts_v_blocks_hero USING btree (image_id);


--
-- Name: _service_districts_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_hero_order_idx ON public._service_districts_v_blocks_hero USING btree (_order);


--
-- Name: _service_districts_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_hero_parent_id_idx ON public._service_districts_v_blocks_hero USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_hero_path_idx ON public._service_districts_v_blocks_hero USING btree (_path);


--
-- Name: _service_districts_v_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_lead_form_order_idx ON public._service_districts_v_blocks_lead_form USING btree (_order);


--
-- Name: _service_districts_v_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_lead_form_parent_id_idx ON public._service_districts_v_blocks_lead_form USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_lead_form_path_idx ON public._service_districts_v_blocks_lead_form USING btree (_path);


--
-- Name: _service_districts_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_text_content_order_idx ON public._service_districts_v_blocks_text_content USING btree (_order);


--
-- Name: _service_districts_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_text_content_parent_id_idx ON public._service_districts_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _service_districts_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_blocks_text_content_path_idx ON public._service_districts_v_blocks_text_content USING btree (_path);


--
-- Name: _service_districts_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_created_at_idx ON public._service_districts_v USING btree (created_at);


--
-- Name: _service_districts_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_latest_idx ON public._service_districts_v USING btree (latest);


--
-- Name: _service_districts_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_parent_idx ON public._service_districts_v USING btree (parent_id);


--
-- Name: _service_districts_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_rels_order_idx ON public._service_districts_v_rels USING btree ("order");


--
-- Name: _service_districts_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_rels_parent_idx ON public._service_districts_v_rels USING btree (parent_id);


--
-- Name: _service_districts_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_rels_path_idx ON public._service_districts_v_rels USING btree (path);


--
-- Name: _service_districts_v_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_rels_services_id_idx ON public._service_districts_v_rels USING btree (services_id);


--
-- Name: _service_districts_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_updated_at_idx ON public._service_districts_v USING btree (updated_at);


--
-- Name: _service_districts_v_version_local_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_local_faq_order_idx ON public._service_districts_v_version_local_faq USING btree (_order);


--
-- Name: _service_districts_v_version_local_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_local_faq_parent_id_idx ON public._service_districts_v_version_local_faq USING btree (_parent_id);


--
-- Name: _service_districts_v_version_local_landmarks_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_local_landmarks_order_idx ON public._service_districts_v_version_local_landmarks USING btree (_order);


--
-- Name: _service_districts_v_version_local_landmarks_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_local_landmarks_parent_id_idx ON public._service_districts_v_version_local_landmarks USING btree (_parent_id);


--
-- Name: _service_districts_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version__status_idx ON public._service_districts_v USING btree (version__status);


--
-- Name: _service_districts_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_created_at_idx ON public._service_districts_v USING btree (version_created_at);


--
-- Name: _service_districts_v_version_version_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_district_idx ON public._service_districts_v USING btree (version_district_id);


--
-- Name: _service_districts_v_version_version_mini_case_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_mini_case_idx ON public._service_districts_v USING btree (version_mini_case_id);


--
-- Name: _service_districts_v_version_version_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_og_image_idx ON public._service_districts_v USING btree (version_og_image_id);


--
-- Name: _service_districts_v_version_version_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_reviewed_by_idx ON public._service_districts_v USING btree (version_reviewed_by_id);


--
-- Name: _service_districts_v_version_version_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_service_idx ON public._service_districts_v USING btree (version_service_id);


--
-- Name: _service_districts_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _service_districts_v_version_version_updated_at_idx ON public._service_districts_v USING btree (version_updated_at);


--
-- Name: _services_v_autosave_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_autosave_idx ON public._services_v USING btree (autosave);


--
-- Name: _services_v_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_breadcrumbs_items_order_idx ON public._services_v_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: _services_v_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_breadcrumbs_items_parent_id_idx ON public._services_v_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: _services_v_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_breadcrumbs_order_idx ON public._services_v_blocks_breadcrumbs USING btree (_order);


--
-- Name: _services_v_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_breadcrumbs_parent_id_idx ON public._services_v_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: _services_v_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_breadcrumbs_path_idx ON public._services_v_blocks_breadcrumbs USING btree (_path);


--
-- Name: _services_v_blocks_calculator_placeholder_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_calculator_placeholder_order_idx ON public._services_v_blocks_calculator_placeholder USING btree (_order);


--
-- Name: _services_v_blocks_calculator_placeholder_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_calculator_placeholder_parent_id_idx ON public._services_v_blocks_calculator_placeholder USING btree (_parent_id);


--
-- Name: _services_v_blocks_calculator_placeholder_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_calculator_placeholder_path_idx ON public._services_v_blocks_calculator_placeholder USING btree (_path);


--
-- Name: _services_v_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_cta_banner_order_idx ON public._services_v_blocks_cta_banner USING btree (_order);


--
-- Name: _services_v_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_cta_banner_parent_id_idx ON public._services_v_blocks_cta_banner USING btree (_parent_id);


--
-- Name: _services_v_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_cta_banner_path_idx ON public._services_v_blocks_cta_banner USING btree (_path);


--
-- Name: _services_v_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_faq_items_order_idx ON public._services_v_blocks_faq_items USING btree (_order);


--
-- Name: _services_v_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_faq_items_parent_id_idx ON public._services_v_blocks_faq_items USING btree (_parent_id);


--
-- Name: _services_v_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_faq_order_idx ON public._services_v_blocks_faq USING btree (_order);


--
-- Name: _services_v_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_faq_parent_id_idx ON public._services_v_blocks_faq USING btree (_parent_id);


--
-- Name: _services_v_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_faq_path_idx ON public._services_v_blocks_faq USING btree (_path);


--
-- Name: _services_v_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_hero_image_idx ON public._services_v_blocks_hero USING btree (image_id);


--
-- Name: _services_v_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_hero_order_idx ON public._services_v_blocks_hero USING btree (_order);


--
-- Name: _services_v_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_hero_parent_id_idx ON public._services_v_blocks_hero USING btree (_parent_id);


--
-- Name: _services_v_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_hero_path_idx ON public._services_v_blocks_hero USING btree (_path);


--
-- Name: _services_v_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_lead_form_order_idx ON public._services_v_blocks_lead_form USING btree (_order);


--
-- Name: _services_v_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_lead_form_parent_id_idx ON public._services_v_blocks_lead_form USING btree (_parent_id);


--
-- Name: _services_v_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_lead_form_path_idx ON public._services_v_blocks_lead_form USING btree (_path);


--
-- Name: _services_v_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_case_ref_idx ON public._services_v_blocks_mini_case USING btree (case_ref_id);


--
-- Name: _services_v_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_inline_facts_order_idx ON public._services_v_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: _services_v_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_inline_facts_parent_id_idx ON public._services_v_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: _services_v_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_inline_inline_photo_idx ON public._services_v_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: _services_v_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_order_idx ON public._services_v_blocks_mini_case USING btree (_order);


--
-- Name: _services_v_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_parent_id_idx ON public._services_v_blocks_mini_case USING btree (_parent_id);


--
-- Name: _services_v_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_mini_case_path_idx ON public._services_v_blocks_mini_case USING btree (_path);


--
-- Name: _services_v_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_related_services_items_order_idx ON public._services_v_blocks_related_services_items USING btree (_order);


--
-- Name: _services_v_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_related_services_items_parent_id_idx ON public._services_v_blocks_related_services_items USING btree (_parent_id);


--
-- Name: _services_v_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_related_services_order_idx ON public._services_v_blocks_related_services USING btree (_order);


--
-- Name: _services_v_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_related_services_parent_id_idx ON public._services_v_blocks_related_services USING btree (_parent_id);


--
-- Name: _services_v_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_related_services_path_idx ON public._services_v_blocks_related_services USING btree (_path);


--
-- Name: _services_v_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_services_grid_items_order_idx ON public._services_v_blocks_services_grid_items USING btree (_order);


--
-- Name: _services_v_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_services_grid_items_parent_id_idx ON public._services_v_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: _services_v_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_services_grid_order_idx ON public._services_v_blocks_services_grid USING btree (_order);


--
-- Name: _services_v_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_services_grid_parent_id_idx ON public._services_v_blocks_services_grid USING btree (_parent_id);


--
-- Name: _services_v_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_services_grid_path_idx ON public._services_v_blocks_services_grid USING btree (_path);


--
-- Name: _services_v_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_text_content_order_idx ON public._services_v_blocks_text_content USING btree (_order);


--
-- Name: _services_v_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_text_content_parent_id_idx ON public._services_v_blocks_text_content USING btree (_parent_id);


--
-- Name: _services_v_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_text_content_path_idx ON public._services_v_blocks_text_content USING btree (_path);


--
-- Name: _services_v_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_tldr_order_idx ON public._services_v_blocks_tldr USING btree (_order);


--
-- Name: _services_v_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_tldr_parent_id_idx ON public._services_v_blocks_tldr USING btree (_parent_id);


--
-- Name: _services_v_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_blocks_tldr_path_idx ON public._services_v_blocks_tldr USING btree (_path);


--
-- Name: _services_v_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_created_at_idx ON public._services_v USING btree (created_at);


--
-- Name: _services_v_latest_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_latest_idx ON public._services_v USING btree (latest);


--
-- Name: _services_v_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_parent_idx ON public._services_v USING btree (parent_id);


--
-- Name: _services_v_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_rels_order_idx ON public._services_v_rels USING btree ("order");


--
-- Name: _services_v_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_rels_parent_idx ON public._services_v_rels USING btree (parent_id);


--
-- Name: _services_v_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_rels_path_idx ON public._services_v_rels USING btree (path);


--
-- Name: _services_v_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_rels_services_id_idx ON public._services_v_rels USING btree (services_id);


--
-- Name: _services_v_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_updated_at_idx ON public._services_v USING btree (updated_at);


--
-- Name: _services_v_version_faq_global_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_faq_global_order_idx ON public._services_v_version_faq_global USING btree (_order);


--
-- Name: _services_v_version_faq_global_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_faq_global_parent_id_idx ON public._services_v_version_faq_global USING btree (_parent_id);


--
-- Name: _services_v_version_gallery_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_gallery_image_idx ON public._services_v_version_gallery USING btree (image_id);


--
-- Name: _services_v_version_gallery_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_gallery_order_idx ON public._services_v_version_gallery USING btree (_order);


--
-- Name: _services_v_version_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_gallery_parent_id_idx ON public._services_v_version_gallery USING btree (_parent_id);


--
-- Name: _services_v_version_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_robots_directives_order_idx ON public._services_v_version_robots_directives USING btree ("order");


--
-- Name: _services_v_version_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_robots_directives_parent_idx ON public._services_v_version_robots_directives USING btree (parent_id);


--
-- Name: _services_v_version_sub_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_sub_services_order_idx ON public._services_v_version_sub_services USING btree (_order);


--
-- Name: _services_v_version_sub_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_sub_services_parent_id_idx ON public._services_v_version_sub_services USING btree (_parent_id);


--
-- Name: _services_v_version_version__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version__status_idx ON public._services_v USING btree (version__status);


--
-- Name: _services_v_version_version_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version_created_at_idx ON public._services_v USING btree (version_created_at);


--
-- Name: _services_v_version_version_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version_hero_image_idx ON public._services_v USING btree (version_hero_image_id);


--
-- Name: _services_v_version_version_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version_og_image_idx ON public._services_v USING btree (version_og_image_id);


--
-- Name: _services_v_version_version_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version_slug_idx ON public._services_v USING btree (version_slug);


--
-- Name: _services_v_version_version_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX _services_v_version_version_updated_at_idx ON public._services_v USING btree (version_updated_at);


--
-- Name: audit_log_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_action_idx ON public.audit_log USING btree (action, changed_at DESC);


--
-- Name: audit_log_changed_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_changed_at_idx ON public.audit_log USING btree (changed_at DESC);


--
-- Name: audit_log_collection_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_collection_idx ON public.audit_log USING btree (collection, changed_at DESC);


--
-- Name: audit_log_doc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_doc_idx ON public.audit_log USING btree (collection, doc_id, changed_at DESC);


--
-- Name: audit_log_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_user_idx ON public.audit_log USING btree (user_id, changed_at DESC);


--
-- Name: authors__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors__status_idx ON public.authors USING btree (_status);


--
-- Name: authors_avatar_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_avatar_idx ON public.authors USING btree (avatar_id);


--
-- Name: authors_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_breadcrumbs_items_order_idx ON public.authors_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: authors_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_breadcrumbs_items_parent_id_idx ON public.authors_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: authors_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_breadcrumbs_order_idx ON public.authors_blocks_breadcrumbs USING btree (_order);


--
-- Name: authors_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_breadcrumbs_parent_id_idx ON public.authors_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: authors_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_breadcrumbs_path_idx ON public.authors_blocks_breadcrumbs USING btree (_path);


--
-- Name: authors_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_cta_banner_order_idx ON public.authors_blocks_cta_banner USING btree (_order);


--
-- Name: authors_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_cta_banner_parent_id_idx ON public.authors_blocks_cta_banner USING btree (_parent_id);


--
-- Name: authors_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_cta_banner_path_idx ON public.authors_blocks_cta_banner USING btree (_path);


--
-- Name: authors_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_hero_image_idx ON public.authors_blocks_hero USING btree (image_id);


--
-- Name: authors_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_hero_order_idx ON public.authors_blocks_hero USING btree (_order);


--
-- Name: authors_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_hero_parent_id_idx ON public.authors_blocks_hero USING btree (_parent_id);


--
-- Name: authors_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_hero_path_idx ON public.authors_blocks_hero USING btree (_path);


--
-- Name: authors_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_related_services_items_order_idx ON public.authors_blocks_related_services_items USING btree (_order);


--
-- Name: authors_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_related_services_items_parent_id_idx ON public.authors_blocks_related_services_items USING btree (_parent_id);


--
-- Name: authors_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_related_services_order_idx ON public.authors_blocks_related_services USING btree (_order);


--
-- Name: authors_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_related_services_parent_id_idx ON public.authors_blocks_related_services USING btree (_parent_id);


--
-- Name: authors_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_related_services_path_idx ON public.authors_blocks_related_services USING btree (_path);


--
-- Name: authors_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_text_content_order_idx ON public.authors_blocks_text_content USING btree (_order);


--
-- Name: authors_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_text_content_parent_id_idx ON public.authors_blocks_text_content USING btree (_parent_id);


--
-- Name: authors_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_blocks_text_content_path_idx ON public.authors_blocks_text_content USING btree (_path);


--
-- Name: authors_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_created_at_idx ON public.authors USING btree (created_at);


--
-- Name: authors_credentials_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_credentials_order_idx ON public.authors_credentials USING btree (_order);


--
-- Name: authors_credentials_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_credentials_parent_id_idx ON public.authors_credentials USING btree (_parent_id);


--
-- Name: authors_knows_about_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_knows_about_order_idx ON public.authors_knows_about USING btree (_order);


--
-- Name: authors_knows_about_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_knows_about_parent_id_idx ON public.authors_knows_about USING btree (_parent_id);


--
-- Name: authors_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_rels_districts_id_idx ON public.authors_rels USING btree (districts_id);


--
-- Name: authors_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_rels_order_idx ON public.authors_rels USING btree ("order");


--
-- Name: authors_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_rels_parent_idx ON public.authors_rels USING btree (parent_id);


--
-- Name: authors_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_rels_path_idx ON public.authors_rels USING btree (path);


--
-- Name: authors_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_robots_directives_order_idx ON public.authors_robots_directives USING btree ("order");


--
-- Name: authors_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_robots_directives_parent_idx ON public.authors_robots_directives USING btree (parent_id);


--
-- Name: authors_same_as_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_same_as_order_idx ON public.authors_same_as USING btree (_order);


--
-- Name: authors_same_as_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_same_as_parent_id_idx ON public.authors_same_as USING btree (_parent_id);


--
-- Name: authors_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX authors_slug_idx ON public.authors USING btree (slug);


--
-- Name: authors_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX authors_updated_at_idx ON public.authors USING btree (updated_at);


--
-- Name: b2b_pages__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages__status_idx ON public.b2b_pages USING btree (_status);


--
-- Name: b2b_pages_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_breadcrumbs_items_order_idx ON public.b2b_pages_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: b2b_pages_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_breadcrumbs_items_parent_id_idx ON public.b2b_pages_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_breadcrumbs_order_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_order);


--
-- Name: b2b_pages_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_breadcrumbs_parent_id_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_breadcrumbs_path_idx ON public.b2b_pages_blocks_breadcrumbs USING btree (_path);


--
-- Name: b2b_pages_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_cta_banner_order_idx ON public.b2b_pages_blocks_cta_banner USING btree (_order);


--
-- Name: b2b_pages_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_cta_banner_parent_id_idx ON public.b2b_pages_blocks_cta_banner USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_cta_banner_path_idx ON public.b2b_pages_blocks_cta_banner USING btree (_path);


--
-- Name: b2b_pages_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_faq_items_order_idx ON public.b2b_pages_blocks_faq_items USING btree (_order);


--
-- Name: b2b_pages_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_faq_items_parent_id_idx ON public.b2b_pages_blocks_faq_items USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_faq_order_idx ON public.b2b_pages_blocks_faq USING btree (_order);


--
-- Name: b2b_pages_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_faq_parent_id_idx ON public.b2b_pages_blocks_faq USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_faq_path_idx ON public.b2b_pages_blocks_faq USING btree (_path);


--
-- Name: b2b_pages_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_hero_image_idx ON public.b2b_pages_blocks_hero USING btree (image_id);


--
-- Name: b2b_pages_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_hero_order_idx ON public.b2b_pages_blocks_hero USING btree (_order);


--
-- Name: b2b_pages_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_hero_parent_id_idx ON public.b2b_pages_blocks_hero USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_hero_path_idx ON public.b2b_pages_blocks_hero USING btree (_path);


--
-- Name: b2b_pages_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_lead_form_order_idx ON public.b2b_pages_blocks_lead_form USING btree (_order);


--
-- Name: b2b_pages_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_lead_form_parent_id_idx ON public.b2b_pages_blocks_lead_form USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_lead_form_path_idx ON public.b2b_pages_blocks_lead_form USING btree (_path);


--
-- Name: b2b_pages_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_case_ref_idx ON public.b2b_pages_blocks_mini_case USING btree (case_ref_id);


--
-- Name: b2b_pages_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_inline_facts_order_idx ON public.b2b_pages_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: b2b_pages_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_inline_facts_parent_id_idx ON public.b2b_pages_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_inline_inline_photo_idx ON public.b2b_pages_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: b2b_pages_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_order_idx ON public.b2b_pages_blocks_mini_case USING btree (_order);


--
-- Name: b2b_pages_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_parent_id_idx ON public.b2b_pages_blocks_mini_case USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_mini_case_path_idx ON public.b2b_pages_blocks_mini_case USING btree (_path);


--
-- Name: b2b_pages_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_services_grid_items_order_idx ON public.b2b_pages_blocks_services_grid_items USING btree (_order);


--
-- Name: b2b_pages_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_services_grid_items_parent_id_idx ON public.b2b_pages_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_services_grid_order_idx ON public.b2b_pages_blocks_services_grid USING btree (_order);


--
-- Name: b2b_pages_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_services_grid_parent_id_idx ON public.b2b_pages_blocks_services_grid USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_services_grid_path_idx ON public.b2b_pages_blocks_services_grid USING btree (_path);


--
-- Name: b2b_pages_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_text_content_order_idx ON public.b2b_pages_blocks_text_content USING btree (_order);


--
-- Name: b2b_pages_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_text_content_parent_id_idx ON public.b2b_pages_blocks_text_content USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_text_content_path_idx ON public.b2b_pages_blocks_text_content USING btree (_path);


--
-- Name: b2b_pages_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_tldr_order_idx ON public.b2b_pages_blocks_tldr USING btree (_order);


--
-- Name: b2b_pages_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_tldr_parent_id_idx ON public.b2b_pages_blocks_tldr USING btree (_parent_id);


--
-- Name: b2b_pages_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_blocks_tldr_path_idx ON public.b2b_pages_blocks_tldr USING btree (_path);


--
-- Name: b2b_pages_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_created_at_idx ON public.b2b_pages USING btree (created_at);


--
-- Name: b2b_pages_rels_cases_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_rels_cases_id_idx ON public.b2b_pages_rels USING btree (cases_id);


--
-- Name: b2b_pages_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_rels_order_idx ON public.b2b_pages_rels USING btree ("order");


--
-- Name: b2b_pages_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_rels_parent_idx ON public.b2b_pages_rels USING btree (parent_id);


--
-- Name: b2b_pages_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_rels_path_idx ON public.b2b_pages_rels USING btree (path);


--
-- Name: b2b_pages_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_rels_services_id_idx ON public.b2b_pages_rels USING btree (services_id);


--
-- Name: b2b_pages_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_robots_directives_order_idx ON public.b2b_pages_robots_directives USING btree ("order");


--
-- Name: b2b_pages_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_robots_directives_parent_idx ON public.b2b_pages_robots_directives USING btree (parent_id);


--
-- Name: b2b_pages_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX b2b_pages_slug_idx ON public.b2b_pages USING btree (slug);


--
-- Name: b2b_pages_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX b2b_pages_updated_at_idx ON public.b2b_pages USING btree (updated_at);


--
-- Name: blog__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog__status_idx ON public.blog USING btree (_status);


--
-- Name: blog_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_author_idx ON public.blog USING btree (author_id);


--
-- Name: blog_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_breadcrumbs_items_order_idx ON public.blog_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: blog_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_breadcrumbs_items_parent_id_idx ON public.blog_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: blog_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_breadcrumbs_order_idx ON public.blog_blocks_breadcrumbs USING btree (_order);


--
-- Name: blog_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_breadcrumbs_parent_id_idx ON public.blog_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: blog_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_breadcrumbs_path_idx ON public.blog_blocks_breadcrumbs USING btree (_path);


--
-- Name: blog_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_cta_banner_order_idx ON public.blog_blocks_cta_banner USING btree (_order);


--
-- Name: blog_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_cta_banner_parent_id_idx ON public.blog_blocks_cta_banner USING btree (_parent_id);


--
-- Name: blog_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_cta_banner_path_idx ON public.blog_blocks_cta_banner USING btree (_path);


--
-- Name: blog_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_faq_items_order_idx ON public.blog_blocks_faq_items USING btree (_order);


--
-- Name: blog_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_faq_items_parent_id_idx ON public.blog_blocks_faq_items USING btree (_parent_id);


--
-- Name: blog_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_faq_order_idx ON public.blog_blocks_faq USING btree (_order);


--
-- Name: blog_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_faq_parent_id_idx ON public.blog_blocks_faq USING btree (_parent_id);


--
-- Name: blog_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_faq_path_idx ON public.blog_blocks_faq USING btree (_path);


--
-- Name: blog_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_hero_image_idx ON public.blog_blocks_hero USING btree (image_id);


--
-- Name: blog_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_hero_order_idx ON public.blog_blocks_hero USING btree (_order);


--
-- Name: blog_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_hero_parent_id_idx ON public.blog_blocks_hero USING btree (_parent_id);


--
-- Name: blog_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_hero_path_idx ON public.blog_blocks_hero USING btree (_path);


--
-- Name: blog_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_related_services_items_order_idx ON public.blog_blocks_related_services_items USING btree (_order);


--
-- Name: blog_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_related_services_items_parent_id_idx ON public.blog_blocks_related_services_items USING btree (_parent_id);


--
-- Name: blog_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_related_services_order_idx ON public.blog_blocks_related_services USING btree (_order);


--
-- Name: blog_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_related_services_parent_id_idx ON public.blog_blocks_related_services USING btree (_parent_id);


--
-- Name: blog_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_related_services_path_idx ON public.blog_blocks_related_services USING btree (_path);


--
-- Name: blog_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_text_content_order_idx ON public.blog_blocks_text_content USING btree (_order);


--
-- Name: blog_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_text_content_parent_id_idx ON public.blog_blocks_text_content USING btree (_parent_id);


--
-- Name: blog_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_text_content_path_idx ON public.blog_blocks_text_content USING btree (_path);


--
-- Name: blog_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_tldr_order_idx ON public.blog_blocks_tldr USING btree (_order);


--
-- Name: blog_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_tldr_parent_id_idx ON public.blog_blocks_tldr USING btree (_parent_id);


--
-- Name: blog_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_blocks_tldr_path_idx ON public.blog_blocks_tldr USING btree (_path);


--
-- Name: blog_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_created_at_idx ON public.blog USING btree (created_at);


--
-- Name: blog_faq_block_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_faq_block_order_idx ON public.blog_faq_block USING btree (_order);


--
-- Name: blog_faq_block_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_faq_block_parent_id_idx ON public.blog_faq_block USING btree (_parent_id);


--
-- Name: blog_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_hero_image_idx ON public.blog USING btree (hero_image_id);


--
-- Name: blog_how_to_steps_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_how_to_steps_order_idx ON public.blog_how_to_steps USING btree (_order);


--
-- Name: blog_how_to_steps_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_how_to_steps_parent_id_idx ON public.blog_how_to_steps USING btree (_parent_id);


--
-- Name: blog_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_og_image_idx ON public.blog USING btree (og_image_id);


--
-- Name: blog_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_rels_districts_id_idx ON public.blog_rels USING btree (districts_id);


--
-- Name: blog_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_rels_order_idx ON public.blog_rels USING btree ("order");


--
-- Name: blog_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_rels_parent_idx ON public.blog_rels USING btree (parent_id);


--
-- Name: blog_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_rels_path_idx ON public.blog_rels USING btree (path);


--
-- Name: blog_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_rels_services_id_idx ON public.blog_rels USING btree (services_id);


--
-- Name: blog_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_reviewed_by_idx ON public.blog USING btree (reviewed_by_id);


--
-- Name: blog_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_robots_directives_order_idx ON public.blog_robots_directives USING btree ("order");


--
-- Name: blog_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_robots_directives_parent_idx ON public.blog_robots_directives USING btree (parent_id);


--
-- Name: blog_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX blog_slug_idx ON public.blog USING btree (slug);


--
-- Name: blog_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blog_updated_at_idx ON public.blog USING btree (updated_at);


--
-- Name: cases__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases__status_idx ON public.cases USING btree (_status);


--
-- Name: cases_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_breadcrumbs_items_order_idx ON public.cases_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: cases_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_breadcrumbs_items_parent_id_idx ON public.cases_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: cases_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_breadcrumbs_order_idx ON public.cases_blocks_breadcrumbs USING btree (_order);


--
-- Name: cases_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_breadcrumbs_parent_id_idx ON public.cases_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: cases_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_breadcrumbs_path_idx ON public.cases_blocks_breadcrumbs USING btree (_path);


--
-- Name: cases_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_cta_banner_order_idx ON public.cases_blocks_cta_banner USING btree (_order);


--
-- Name: cases_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_cta_banner_parent_id_idx ON public.cases_blocks_cta_banner USING btree (_parent_id);


--
-- Name: cases_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_cta_banner_path_idx ON public.cases_blocks_cta_banner USING btree (_path);


--
-- Name: cases_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_hero_image_idx ON public.cases_blocks_hero USING btree (image_id);


--
-- Name: cases_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_hero_order_idx ON public.cases_blocks_hero USING btree (_order);


--
-- Name: cases_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_hero_parent_id_idx ON public.cases_blocks_hero USING btree (_parent_id);


--
-- Name: cases_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_hero_path_idx ON public.cases_blocks_hero USING btree (_path);


--
-- Name: cases_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_case_ref_idx ON public.cases_blocks_mini_case USING btree (case_ref_id);


--
-- Name: cases_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_inline_facts_order_idx ON public.cases_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: cases_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_inline_facts_parent_id_idx ON public.cases_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: cases_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_inline_inline_photo_idx ON public.cases_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: cases_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_order_idx ON public.cases_blocks_mini_case USING btree (_order);


--
-- Name: cases_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_parent_id_idx ON public.cases_blocks_mini_case USING btree (_parent_id);


--
-- Name: cases_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_mini_case_path_idx ON public.cases_blocks_mini_case USING btree (_path);


--
-- Name: cases_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_related_services_items_order_idx ON public.cases_blocks_related_services_items USING btree (_order);


--
-- Name: cases_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_related_services_items_parent_id_idx ON public.cases_blocks_related_services_items USING btree (_parent_id);


--
-- Name: cases_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_related_services_order_idx ON public.cases_blocks_related_services USING btree (_order);


--
-- Name: cases_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_related_services_parent_id_idx ON public.cases_blocks_related_services USING btree (_parent_id);


--
-- Name: cases_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_related_services_path_idx ON public.cases_blocks_related_services USING btree (_path);


--
-- Name: cases_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_text_content_order_idx ON public.cases_blocks_text_content USING btree (_order);


--
-- Name: cases_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_text_content_parent_id_idx ON public.cases_blocks_text_content USING btree (_parent_id);


--
-- Name: cases_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_blocks_text_content_path_idx ON public.cases_blocks_text_content USING btree (_path);


--
-- Name: cases_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_created_at_idx ON public.cases USING btree (created_at);


--
-- Name: cases_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_district_idx ON public.cases USING btree (district_id);


--
-- Name: cases_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_og_image_idx ON public.cases USING btree (og_image_id);


--
-- Name: cases_photos_after_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_after_image_idx ON public.cases_photos_after USING btree (image_id);


--
-- Name: cases_photos_after_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_after_order_idx ON public.cases_photos_after USING btree (_order);


--
-- Name: cases_photos_after_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_after_parent_id_idx ON public.cases_photos_after USING btree (_parent_id);


--
-- Name: cases_photos_before_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_before_image_idx ON public.cases_photos_before USING btree (image_id);


--
-- Name: cases_photos_before_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_before_order_idx ON public.cases_photos_before USING btree (_order);


--
-- Name: cases_photos_before_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_photos_before_parent_id_idx ON public.cases_photos_before USING btree (_parent_id);


--
-- Name: cases_rels_authors_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_rels_authors_id_idx ON public.cases_rels USING btree (authors_id);


--
-- Name: cases_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_rels_order_idx ON public.cases_rels USING btree ("order");


--
-- Name: cases_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_rels_parent_idx ON public.cases_rels USING btree (parent_id);


--
-- Name: cases_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_rels_path_idx ON public.cases_rels USING btree (path);


--
-- Name: cases_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_reviewed_by_idx ON public.cases USING btree (reviewed_by_id);


--
-- Name: cases_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_robots_directives_order_idx ON public.cases_robots_directives USING btree ("order");


--
-- Name: cases_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_robots_directives_parent_idx ON public.cases_robots_directives USING btree (parent_id);


--
-- Name: cases_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_service_idx ON public.cases USING btree (service_id);


--
-- Name: cases_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX cases_slug_idx ON public.cases USING btree (slug);


--
-- Name: cases_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cases_updated_at_idx ON public.cases USING btree (updated_at);


--
-- Name: districts__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts__status_idx ON public.districts USING btree (_status);


--
-- Name: districts_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_breadcrumbs_items_order_idx ON public.districts_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: districts_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_breadcrumbs_items_parent_id_idx ON public.districts_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: districts_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_breadcrumbs_order_idx ON public.districts_blocks_breadcrumbs USING btree (_order);


--
-- Name: districts_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_breadcrumbs_parent_id_idx ON public.districts_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: districts_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_breadcrumbs_path_idx ON public.districts_blocks_breadcrumbs USING btree (_path);


--
-- Name: districts_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_hero_image_idx ON public.districts_blocks_hero USING btree (image_id);


--
-- Name: districts_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_hero_order_idx ON public.districts_blocks_hero USING btree (_order);


--
-- Name: districts_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_hero_parent_id_idx ON public.districts_blocks_hero USING btree (_parent_id);


--
-- Name: districts_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_hero_path_idx ON public.districts_blocks_hero USING btree (_path);


--
-- Name: districts_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_lead_form_order_idx ON public.districts_blocks_lead_form USING btree (_order);


--
-- Name: districts_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_lead_form_parent_id_idx ON public.districts_blocks_lead_form USING btree (_parent_id);


--
-- Name: districts_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_lead_form_path_idx ON public.districts_blocks_lead_form USING btree (_path);


--
-- Name: districts_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_case_ref_idx ON public.districts_blocks_mini_case USING btree (case_ref_id);


--
-- Name: districts_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_inline_facts_order_idx ON public.districts_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: districts_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_inline_facts_parent_id_idx ON public.districts_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: districts_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_inline_inline_photo_idx ON public.districts_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: districts_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_order_idx ON public.districts_blocks_mini_case USING btree (_order);


--
-- Name: districts_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_parent_id_idx ON public.districts_blocks_mini_case USING btree (_parent_id);


--
-- Name: districts_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_mini_case_path_idx ON public.districts_blocks_mini_case USING btree (_path);


--
-- Name: districts_blocks_neighbor_districts_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_neighbor_districts_items_order_idx ON public.districts_blocks_neighbor_districts_items USING btree (_order);


--
-- Name: districts_blocks_neighbor_districts_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_neighbor_districts_items_parent_id_idx ON public.districts_blocks_neighbor_districts_items USING btree (_parent_id);


--
-- Name: districts_blocks_neighbor_districts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_neighbor_districts_order_idx ON public.districts_blocks_neighbor_districts USING btree (_order);


--
-- Name: districts_blocks_neighbor_districts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_neighbor_districts_parent_id_idx ON public.districts_blocks_neighbor_districts USING btree (_parent_id);


--
-- Name: districts_blocks_neighbor_districts_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_neighbor_districts_path_idx ON public.districts_blocks_neighbor_districts USING btree (_path);


--
-- Name: districts_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_services_grid_items_order_idx ON public.districts_blocks_services_grid_items USING btree (_order);


--
-- Name: districts_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_services_grid_items_parent_id_idx ON public.districts_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: districts_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_services_grid_order_idx ON public.districts_blocks_services_grid USING btree (_order);


--
-- Name: districts_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_services_grid_parent_id_idx ON public.districts_blocks_services_grid USING btree (_parent_id);


--
-- Name: districts_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_services_grid_path_idx ON public.districts_blocks_services_grid USING btree (_path);


--
-- Name: districts_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_text_content_order_idx ON public.districts_blocks_text_content USING btree (_order);


--
-- Name: districts_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_text_content_parent_id_idx ON public.districts_blocks_text_content USING btree (_parent_id);


--
-- Name: districts_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_text_content_path_idx ON public.districts_blocks_text_content USING btree (_path);


--
-- Name: districts_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_tldr_order_idx ON public.districts_blocks_tldr USING btree (_order);


--
-- Name: districts_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_tldr_parent_id_idx ON public.districts_blocks_tldr USING btree (_parent_id);


--
-- Name: districts_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_blocks_tldr_path_idx ON public.districts_blocks_tldr USING btree (_path);


--
-- Name: districts_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_created_at_idx ON public.districts USING btree (created_at);


--
-- Name: districts_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_hero_image_idx ON public.districts USING btree (hero_image_id);


--
-- Name: districts_landmarks_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_landmarks_order_idx ON public.districts_landmarks USING btree (_order);


--
-- Name: districts_landmarks_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_landmarks_parent_id_idx ON public.districts_landmarks USING btree (_parent_id);


--
-- Name: districts_photo_geo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_photo_geo_idx ON public.districts USING btree (photo_geo_id);


--
-- Name: districts_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_rels_districts_id_idx ON public.districts_rels USING btree (districts_id);


--
-- Name: districts_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_rels_order_idx ON public.districts_rels USING btree ("order");


--
-- Name: districts_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_rels_parent_idx ON public.districts_rels USING btree (parent_id);


--
-- Name: districts_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_rels_path_idx ON public.districts_rels USING btree (path);


--
-- Name: districts_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_rels_services_id_idx ON public.districts_rels USING btree (services_id);


--
-- Name: districts_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_robots_directives_order_idx ON public.districts_robots_directives USING btree ("order");


--
-- Name: districts_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_robots_directives_parent_idx ON public.districts_robots_directives USING btree (parent_id);


--
-- Name: districts_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX districts_slug_idx ON public.districts USING btree (slug);


--
-- Name: districts_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX districts_updated_at_idx ON public.districts USING btree (updated_at);


--
-- Name: leads_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_created_at_idx ON public.leads USING btree (created_at);


--
-- Name: leads_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_district_idx ON public.leads USING btree (district_id);


--
-- Name: leads_phone_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_phone_idx ON public.leads USING btree (phone);


--
-- Name: leads_photos_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_photos_order_idx ON public.leads_photos USING btree (_order);


--
-- Name: leads_photos_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_photos_parent_id_idx ON public.leads_photos USING btree (_parent_id);


--
-- Name: leads_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_service_idx ON public.leads USING btree (service_id);


--
-- Name: leads_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_updated_at_idx ON public.leads USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_sizes_card_sizes_card_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_card_sizes_card_filename_idx ON public.media USING btree (sizes_card_filename);


--
-- Name: media_sizes_hero_sizes_hero_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_hero_sizes_hero_filename_idx ON public.media USING btree (sizes_hero_filename);


--
-- Name: media_sizes_og_sizes_og_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_og_sizes_og_filename_idx ON public.media USING btree (sizes_og_filename);


--
-- Name: media_sizes_thumb_sizes_thumb_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_sizes_thumb_sizes_thumb_filename_idx ON public.media USING btree (sizes_thumb_filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_authors_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_authors_id_idx ON public.payload_locked_documents_rels USING btree (authors_id);


--
-- Name: payload_locked_documents_rels_b2b_pages_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_b2b_pages_id_idx ON public.payload_locked_documents_rels USING btree (b2b_pages_id);


--
-- Name: payload_locked_documents_rels_blog_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_blog_id_idx ON public.payload_locked_documents_rels USING btree (blog_id);


--
-- Name: payload_locked_documents_rels_cases_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_cases_id_idx ON public.payload_locked_documents_rels USING btree (cases_id);


--
-- Name: payload_locked_documents_rels_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_districts_id_idx ON public.payload_locked_documents_rels USING btree (districts_id);


--
-- Name: payload_locked_documents_rels_leads_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_leads_id_idx ON public.payload_locked_documents_rels USING btree (leads_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_redirects_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_redirects_id_idx ON public.payload_locked_documents_rels USING btree (redirects_id);


--
-- Name: payload_locked_documents_rels_service_districts_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_service_districts_id_idx ON public.payload_locked_documents_rels USING btree (service_districts_id);


--
-- Name: payload_locked_documents_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_services_id_idx ON public.payload_locked_documents_rels USING btree (services_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: redirects_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX redirects_created_at_idx ON public.redirects USING btree (created_at);


--
-- Name: redirects_from_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX redirects_from_idx ON public.redirects USING btree ("from");


--
-- Name: redirects_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX redirects_updated_at_idx ON public.redirects USING btree (updated_at);


--
-- Name: seo_settings_credentials_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX seo_settings_credentials_order_idx ON public.seo_settings_credentials USING btree (_order);


--
-- Name: seo_settings_credentials_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX seo_settings_credentials_parent_id_idx ON public.seo_settings_credentials USING btree (_parent_id);


--
-- Name: seo_settings_default_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX seo_settings_default_og_image_idx ON public.seo_settings USING btree (default_og_image_id);


--
-- Name: service_districts__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts__status_idx ON public.service_districts USING btree (_status);


--
-- Name: service_districts_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_cta_banner_order_idx ON public.service_districts_blocks_cta_banner USING btree (_order);


--
-- Name: service_districts_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_cta_banner_parent_id_idx ON public.service_districts_blocks_cta_banner USING btree (_parent_id);


--
-- Name: service_districts_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_cta_banner_path_idx ON public.service_districts_blocks_cta_banner USING btree (_path);


--
-- Name: service_districts_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_faq_items_order_idx ON public.service_districts_blocks_faq_items USING btree (_order);


--
-- Name: service_districts_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_faq_items_parent_id_idx ON public.service_districts_blocks_faq_items USING btree (_parent_id);


--
-- Name: service_districts_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_faq_order_idx ON public.service_districts_blocks_faq USING btree (_order);


--
-- Name: service_districts_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_faq_parent_id_idx ON public.service_districts_blocks_faq USING btree (_parent_id);


--
-- Name: service_districts_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_faq_path_idx ON public.service_districts_blocks_faq USING btree (_path);


--
-- Name: service_districts_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_hero_image_idx ON public.service_districts_blocks_hero USING btree (image_id);


--
-- Name: service_districts_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_hero_order_idx ON public.service_districts_blocks_hero USING btree (_order);


--
-- Name: service_districts_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_hero_parent_id_idx ON public.service_districts_blocks_hero USING btree (_parent_id);


--
-- Name: service_districts_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_hero_path_idx ON public.service_districts_blocks_hero USING btree (_path);


--
-- Name: service_districts_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_lead_form_order_idx ON public.service_districts_blocks_lead_form USING btree (_order);


--
-- Name: service_districts_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_lead_form_parent_id_idx ON public.service_districts_blocks_lead_form USING btree (_parent_id);


--
-- Name: service_districts_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_lead_form_path_idx ON public.service_districts_blocks_lead_form USING btree (_path);


--
-- Name: service_districts_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_text_content_order_idx ON public.service_districts_blocks_text_content USING btree (_order);


--
-- Name: service_districts_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_text_content_parent_id_idx ON public.service_districts_blocks_text_content USING btree (_parent_id);


--
-- Name: service_districts_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_blocks_text_content_path_idx ON public.service_districts_blocks_text_content USING btree (_path);


--
-- Name: service_districts_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_created_at_idx ON public.service_districts USING btree (created_at);


--
-- Name: service_districts_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_district_idx ON public.service_districts USING btree (district_id);


--
-- Name: service_districts_local_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_local_faq_order_idx ON public.service_districts_local_faq USING btree (_order);


--
-- Name: service_districts_local_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_local_faq_parent_id_idx ON public.service_districts_local_faq USING btree (_parent_id);


--
-- Name: service_districts_local_landmarks_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_local_landmarks_order_idx ON public.service_districts_local_landmarks USING btree (_order);


--
-- Name: service_districts_local_landmarks_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_local_landmarks_parent_id_idx ON public.service_districts_local_landmarks USING btree (_parent_id);


--
-- Name: service_districts_mini_case_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_mini_case_idx ON public.service_districts USING btree (mini_case_id);


--
-- Name: service_districts_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_og_image_idx ON public.service_districts USING btree (og_image_id);


--
-- Name: service_districts_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_rels_order_idx ON public.service_districts_rels USING btree ("order");


--
-- Name: service_districts_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_rels_parent_idx ON public.service_districts_rels USING btree (parent_id);


--
-- Name: service_districts_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_rels_path_idx ON public.service_districts_rels USING btree (path);


--
-- Name: service_districts_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_rels_services_id_idx ON public.service_districts_rels USING btree (services_id);


--
-- Name: service_districts_reviewed_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_reviewed_by_idx ON public.service_districts USING btree (reviewed_by_id);


--
-- Name: service_districts_service_district_pillar_uniq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX service_districts_service_district_pillar_uniq ON public.service_districts USING btree (service_id, district_id) WHERE (sub_service_slug IS NULL);


--
-- Name: service_districts_service_district_sub_uniq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX service_districts_service_district_sub_uniq ON public.service_districts USING btree (service_id, district_id, sub_service_slug) WHERE (sub_service_slug IS NOT NULL);


--
-- Name: service_districts_service_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_service_idx ON public.service_districts USING btree (service_id);


--
-- Name: service_districts_sub_service_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_sub_service_slug_idx ON public.service_districts USING btree (sub_service_slug) WHERE (sub_service_slug IS NOT NULL);


--
-- Name: service_districts_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_districts_updated_at_idx ON public.service_districts USING btree (updated_at);


--
-- Name: services__status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services__status_idx ON public.services USING btree (_status);


--
-- Name: services_blocks_breadcrumbs_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_breadcrumbs_items_order_idx ON public.services_blocks_breadcrumbs_items USING btree (_order);


--
-- Name: services_blocks_breadcrumbs_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_breadcrumbs_items_parent_id_idx ON public.services_blocks_breadcrumbs_items USING btree (_parent_id);


--
-- Name: services_blocks_breadcrumbs_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_breadcrumbs_order_idx ON public.services_blocks_breadcrumbs USING btree (_order);


--
-- Name: services_blocks_breadcrumbs_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_breadcrumbs_parent_id_idx ON public.services_blocks_breadcrumbs USING btree (_parent_id);


--
-- Name: services_blocks_breadcrumbs_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_breadcrumbs_path_idx ON public.services_blocks_breadcrumbs USING btree (_path);


--
-- Name: services_blocks_calculator_placeholder_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_calculator_placeholder_order_idx ON public.services_blocks_calculator_placeholder USING btree (_order);


--
-- Name: services_blocks_calculator_placeholder_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_calculator_placeholder_parent_id_idx ON public.services_blocks_calculator_placeholder USING btree (_parent_id);


--
-- Name: services_blocks_calculator_placeholder_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_calculator_placeholder_path_idx ON public.services_blocks_calculator_placeholder USING btree (_path);


--
-- Name: services_blocks_cta_banner_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_cta_banner_order_idx ON public.services_blocks_cta_banner USING btree (_order);


--
-- Name: services_blocks_cta_banner_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_cta_banner_parent_id_idx ON public.services_blocks_cta_banner USING btree (_parent_id);


--
-- Name: services_blocks_cta_banner_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_cta_banner_path_idx ON public.services_blocks_cta_banner USING btree (_path);


--
-- Name: services_blocks_faq_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_faq_items_order_idx ON public.services_blocks_faq_items USING btree (_order);


--
-- Name: services_blocks_faq_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_faq_items_parent_id_idx ON public.services_blocks_faq_items USING btree (_parent_id);


--
-- Name: services_blocks_faq_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_faq_order_idx ON public.services_blocks_faq USING btree (_order);


--
-- Name: services_blocks_faq_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_faq_parent_id_idx ON public.services_blocks_faq USING btree (_parent_id);


--
-- Name: services_blocks_faq_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_faq_path_idx ON public.services_blocks_faq USING btree (_path);


--
-- Name: services_blocks_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_hero_image_idx ON public.services_blocks_hero USING btree (image_id);


--
-- Name: services_blocks_hero_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_hero_order_idx ON public.services_blocks_hero USING btree (_order);


--
-- Name: services_blocks_hero_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_hero_parent_id_idx ON public.services_blocks_hero USING btree (_parent_id);


--
-- Name: services_blocks_hero_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_hero_path_idx ON public.services_blocks_hero USING btree (_path);


--
-- Name: services_blocks_lead_form_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_lead_form_order_idx ON public.services_blocks_lead_form USING btree (_order);


--
-- Name: services_blocks_lead_form_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_lead_form_parent_id_idx ON public.services_blocks_lead_form USING btree (_parent_id);


--
-- Name: services_blocks_lead_form_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_lead_form_path_idx ON public.services_blocks_lead_form USING btree (_path);


--
-- Name: services_blocks_mini_case_case_ref_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_case_ref_idx ON public.services_blocks_mini_case USING btree (case_ref_id);


--
-- Name: services_blocks_mini_case_inline_facts_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_inline_facts_order_idx ON public.services_blocks_mini_case_inline_facts USING btree (_order);


--
-- Name: services_blocks_mini_case_inline_facts_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_inline_facts_parent_id_idx ON public.services_blocks_mini_case_inline_facts USING btree (_parent_id);


--
-- Name: services_blocks_mini_case_inline_inline_photo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_inline_inline_photo_idx ON public.services_blocks_mini_case USING btree (inline_photo_id);


--
-- Name: services_blocks_mini_case_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_order_idx ON public.services_blocks_mini_case USING btree (_order);


--
-- Name: services_blocks_mini_case_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_parent_id_idx ON public.services_blocks_mini_case USING btree (_parent_id);


--
-- Name: services_blocks_mini_case_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_mini_case_path_idx ON public.services_blocks_mini_case USING btree (_path);


--
-- Name: services_blocks_related_services_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_related_services_items_order_idx ON public.services_blocks_related_services_items USING btree (_order);


--
-- Name: services_blocks_related_services_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_related_services_items_parent_id_idx ON public.services_blocks_related_services_items USING btree (_parent_id);


--
-- Name: services_blocks_related_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_related_services_order_idx ON public.services_blocks_related_services USING btree (_order);


--
-- Name: services_blocks_related_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_related_services_parent_id_idx ON public.services_blocks_related_services USING btree (_parent_id);


--
-- Name: services_blocks_related_services_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_related_services_path_idx ON public.services_blocks_related_services USING btree (_path);


--
-- Name: services_blocks_services_grid_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_services_grid_items_order_idx ON public.services_blocks_services_grid_items USING btree (_order);


--
-- Name: services_blocks_services_grid_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_services_grid_items_parent_id_idx ON public.services_blocks_services_grid_items USING btree (_parent_id);


--
-- Name: services_blocks_services_grid_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_services_grid_order_idx ON public.services_blocks_services_grid USING btree (_order);


--
-- Name: services_blocks_services_grid_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_services_grid_parent_id_idx ON public.services_blocks_services_grid USING btree (_parent_id);


--
-- Name: services_blocks_services_grid_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_services_grid_path_idx ON public.services_blocks_services_grid USING btree (_path);


--
-- Name: services_blocks_text_content_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_text_content_order_idx ON public.services_blocks_text_content USING btree (_order);


--
-- Name: services_blocks_text_content_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_text_content_parent_id_idx ON public.services_blocks_text_content USING btree (_parent_id);


--
-- Name: services_blocks_text_content_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_text_content_path_idx ON public.services_blocks_text_content USING btree (_path);


--
-- Name: services_blocks_tldr_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_tldr_order_idx ON public.services_blocks_tldr USING btree (_order);


--
-- Name: services_blocks_tldr_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_tldr_parent_id_idx ON public.services_blocks_tldr USING btree (_parent_id);


--
-- Name: services_blocks_tldr_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_blocks_tldr_path_idx ON public.services_blocks_tldr USING btree (_path);


--
-- Name: services_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_created_at_idx ON public.services USING btree (created_at);


--
-- Name: services_faq_global_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_faq_global_order_idx ON public.services_faq_global USING btree (_order);


--
-- Name: services_faq_global_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_faq_global_parent_id_idx ON public.services_faq_global USING btree (_parent_id);


--
-- Name: services_gallery_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_gallery_image_idx ON public.services_gallery USING btree (image_id);


--
-- Name: services_gallery_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_gallery_order_idx ON public.services_gallery USING btree (_order);


--
-- Name: services_gallery_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_gallery_parent_id_idx ON public.services_gallery USING btree (_parent_id);


--
-- Name: services_hero_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_hero_image_idx ON public.services USING btree (hero_image_id);


--
-- Name: services_og_image_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_og_image_idx ON public.services USING btree (og_image_id);


--
-- Name: services_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_order_idx ON public.services_rels USING btree ("order");


--
-- Name: services_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_parent_idx ON public.services_rels USING btree (parent_id);


--
-- Name: services_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_path_idx ON public.services_rels USING btree (path);


--
-- Name: services_rels_services_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_rels_services_id_idx ON public.services_rels USING btree (services_id);


--
-- Name: services_robots_directives_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_robots_directives_order_idx ON public.services_robots_directives USING btree ("order");


--
-- Name: services_robots_directives_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_robots_directives_parent_idx ON public.services_robots_directives USING btree (parent_id);


--
-- Name: services_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX services_slug_idx ON public.services USING btree (slug);


--
-- Name: services_sub_services_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_sub_services_order_idx ON public.services_sub_services USING btree (_order);


--
-- Name: services_sub_services_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_sub_services_parent_id_idx ON public.services_sub_services USING btree (_parent_id);


--
-- Name: services_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_updated_at_idx ON public.services USING btree (updated_at);


--
-- Name: site_chrome_footer_columns_items_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_footer_columns_items_order_idx ON public.site_chrome_footer_columns_items USING btree (_order);


--
-- Name: site_chrome_footer_columns_items_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_footer_columns_items_parent_id_idx ON public.site_chrome_footer_columns_items USING btree (_parent_id);


--
-- Name: site_chrome_footer_columns_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_footer_columns_order_idx ON public.site_chrome_footer_columns USING btree (_order);


--
-- Name: site_chrome_footer_columns_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_footer_columns_parent_id_idx ON public.site_chrome_footer_columns USING btree (_parent_id);


--
-- Name: site_chrome_header_menu_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_header_menu_order_idx ON public.site_chrome_header_menu USING btree (_order);


--
-- Name: site_chrome_header_menu_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_header_menu_parent_id_idx ON public.site_chrome_header_menu USING btree (_parent_id);


--
-- Name: site_chrome_social_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_social_order_idx ON public.site_chrome_social USING btree (_order);


--
-- Name: site_chrome_social_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX site_chrome_social_parent_id_idx ON public.site_chrome_social USING btree (_parent_id);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_recovery_codes_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_recovery_codes_order_idx ON public.users_recovery_codes USING btree (_order);


--
-- Name: users_recovery_codes_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_recovery_codes_parent_id_idx ON public.users_recovery_codes USING btree (_parent_id);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: version_service_version_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX version_service_version_district_idx ON public._service_districts_v USING btree (version_service_id, version_district_id);


--
-- Name: _authors_v_blocks_breadcrumbs_items _authors_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_breadcrumbs _authors_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_breadcrumbs
    ADD CONSTRAINT _authors_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_cta_banner _authors_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_cta_banner
    ADD CONSTRAINT _authors_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_hero _authors_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _authors_v_blocks_hero _authors_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_hero
    ADD CONSTRAINT _authors_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_related_services_items _authors_v_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services_items
    ADD CONSTRAINT _authors_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_related_services _authors_v_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_related_services
    ADD CONSTRAINT _authors_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_blocks_text_content _authors_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_blocks_text_content
    ADD CONSTRAINT _authors_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v _authors_v_parent_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_parent_id_authors_id_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: _authors_v_rels _authors_v_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: _authors_v_rels _authors_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_rels
    ADD CONSTRAINT _authors_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v _authors_v_version_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v
    ADD CONSTRAINT _authors_v_version_avatar_id_media_id_fk FOREIGN KEY (version_avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _authors_v_version_credentials _authors_v_version_credentials_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_credentials
    ADD CONSTRAINT _authors_v_version_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_version_knows_about _authors_v_version_knows_about_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_knows_about
    ADD CONSTRAINT _authors_v_version_knows_about_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_version_robots_directives _authors_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_robots_directives
    ADD CONSTRAINT _authors_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _authors_v_version_same_as _authors_v_version_same_as_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._authors_v_version_same_as
    ADD CONSTRAINT _authors_v_version_same_as_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._authors_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_breadcrumbs_items _b2b_pages_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_breadcrumbs _b2b_pages_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_breadcrumbs
    ADD CONSTRAINT _b2b_pages_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_cta_banner _b2b_pages_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_cta_banner
    ADD CONSTRAINT _b2b_pages_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_faq_items _b2b_pages_v_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq_items
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_faq _b2b_pages_v_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_faq
    ADD CONSTRAINT _b2b_pages_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_hero _b2b_pages_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _b2b_pages_v_blocks_hero _b2b_pages_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_hero
    ADD CONSTRAINT _b2b_pages_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_lead_form _b2b_pages_v_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_lead_form
    ADD CONSTRAINT _b2b_pages_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_mini_case _b2b_pages_v_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _b2b_pages_v_blocks_mini_case_inline_facts _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_mini_case _b2b_pages_v_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _b2b_pages_v_blocks_mini_case _b2b_pages_v_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_mini_case
    ADD CONSTRAINT _b2b_pages_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_services_grid_items _b2b_pages_v_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid_items
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_services_grid _b2b_pages_v_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_services_grid
    ADD CONSTRAINT _b2b_pages_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_text_content _b2b_pages_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_text_content
    ADD CONSTRAINT _b2b_pages_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_blocks_tldr _b2b_pages_v_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_blocks_tldr
    ADD CONSTRAINT _b2b_pages_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v _b2b_pages_v_parent_id_b2b_pages_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v
    ADD CONSTRAINT _b2b_pages_v_parent_id_b2b_pages_id_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE SET NULL;


--
-- Name: _b2b_pages_v_rels _b2b_pages_v_rels_cases_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_rels _b2b_pages_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_rels _b2b_pages_v_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_rels
    ADD CONSTRAINT _b2b_pages_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: _b2b_pages_v_version_robots_directives _b2b_pages_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._b2b_pages_v_version_robots_directives
    ADD CONSTRAINT _b2b_pages_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._b2b_pages_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_breadcrumbs_items _blog_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_breadcrumbs _blog_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_breadcrumbs
    ADD CONSTRAINT _blog_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_cta_banner _blog_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_cta_banner
    ADD CONSTRAINT _blog_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_faq_items _blog_v_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq_items
    ADD CONSTRAINT _blog_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_faq _blog_v_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_faq
    ADD CONSTRAINT _blog_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_hero _blog_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _blog_v_blocks_hero _blog_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_hero
    ADD CONSTRAINT _blog_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_related_services_items _blog_v_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services_items
    ADD CONSTRAINT _blog_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_related_services _blog_v_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_related_services
    ADD CONSTRAINT _blog_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_text_content _blog_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_text_content
    ADD CONSTRAINT _blog_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_blocks_tldr _blog_v_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_blocks_tldr
    ADD CONSTRAINT _blog_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v _blog_v_parent_id_blog_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_parent_id_blog_id_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE SET NULL;


--
-- Name: _blog_v_rels _blog_v_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: _blog_v_rels _blog_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v_rels _blog_v_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_rels
    ADD CONSTRAINT _blog_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: _blog_v _blog_v_version_author_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_author_id_authors_id_fk FOREIGN KEY (version_author_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: _blog_v_version_faq_block _blog_v_version_faq_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_faq_block
    ADD CONSTRAINT _blog_v_version_faq_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v _blog_v_version_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _blog_v_version_how_to_steps _blog_v_version_how_to_steps_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_how_to_steps
    ADD CONSTRAINT _blog_v_version_how_to_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _blog_v _blog_v_version_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _blog_v _blog_v_version_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v
    ADD CONSTRAINT _blog_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: _blog_v_version_robots_directives _blog_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._blog_v_version_robots_directives
    ADD CONSTRAINT _blog_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._blog_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_breadcrumbs_items _cases_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_breadcrumbs _cases_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_breadcrumbs
    ADD CONSTRAINT _cases_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_cta_banner _cases_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_cta_banner
    ADD CONSTRAINT _cases_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_hero _cases_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _cases_v_blocks_hero _cases_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_hero
    ADD CONSTRAINT _cases_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_mini_case _cases_v_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _cases_v_blocks_mini_case_inline_facts _cases_v_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_mini_case _cases_v_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _cases_v_blocks_mini_case _cases_v_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_mini_case
    ADD CONSTRAINT _cases_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_related_services_items _cases_v_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services_items
    ADD CONSTRAINT _cases_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_related_services _cases_v_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_related_services
    ADD CONSTRAINT _cases_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_blocks_text_content _cases_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_blocks_text_content
    ADD CONSTRAINT _cases_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v _cases_v_parent_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_parent_id_cases_id_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _cases_v_rels _cases_v_rels_authors_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: _cases_v_rels _cases_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_rels
    ADD CONSTRAINT _cases_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v _cases_v_version_district_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_district_id_districts_id_fk FOREIGN KEY (version_district_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: _cases_v _cases_v_version_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _cases_v_version_photos_after _cases_v_version_photos_after_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _cases_v_version_photos_after _cases_v_version_photos_after_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_after
    ADD CONSTRAINT _cases_v_version_photos_after_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v_version_photos_before _cases_v_version_photos_before_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _cases_v_version_photos_before _cases_v_version_photos_before_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_photos_before
    ADD CONSTRAINT _cases_v_version_photos_before_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v _cases_v_version_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: _cases_v_version_robots_directives _cases_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v_version_robots_directives
    ADD CONSTRAINT _cases_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._cases_v(id) ON DELETE CASCADE;


--
-- Name: _cases_v _cases_v_version_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._cases_v
    ADD CONSTRAINT _cases_v_version_service_id_services_id_fk FOREIGN KEY (version_service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: _districts_v_blocks_breadcrumbs_items _districts_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_breadcrumbs _districts_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_breadcrumbs
    ADD CONSTRAINT _districts_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_hero _districts_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _districts_v_blocks_hero _districts_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_hero
    ADD CONSTRAINT _districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_lead_form _districts_v_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_lead_form
    ADD CONSTRAINT _districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_mini_case _districts_v_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _districts_v_blocks_mini_case_inline_facts _districts_v_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_mini_case _districts_v_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _districts_v_blocks_mini_case _districts_v_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_mini_case
    ADD CONSTRAINT _districts_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_neighbor_districts_items _districts_v_blocks_neighbor_districts_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts_items
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_neighbor_districts(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_neighbor_districts _districts_v_blocks_neighbor_districts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_neighbor_districts
    ADD CONSTRAINT _districts_v_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_services_grid_items _districts_v_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid_items
    ADD CONSTRAINT _districts_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_services_grid _districts_v_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_services_grid
    ADD CONSTRAINT _districts_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_text_content _districts_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_text_content
    ADD CONSTRAINT _districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_blocks_tldr _districts_v_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_blocks_tldr
    ADD CONSTRAINT _districts_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v _districts_v_parent_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_parent_id_districts_id_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: _districts_v_rels _districts_v_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: _districts_v_rels _districts_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v_rels _districts_v_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_rels
    ADD CONSTRAINT _districts_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: _districts_v _districts_v_version_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _districts_v_version_landmarks _districts_v_version_landmarks_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_landmarks
    ADD CONSTRAINT _districts_v_version_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _districts_v _districts_v_version_photo_geo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v
    ADD CONSTRAINT _districts_v_version_photo_geo_id_media_id_fk FOREIGN KEY (version_photo_geo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _districts_v_version_robots_directives _districts_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._districts_v_version_robots_directives
    ADD CONSTRAINT _districts_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_cta_banner _service_districts_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_faq_items _service_districts_v_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_faq _service_districts_v_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_hero _service_districts_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v_blocks_hero _service_districts_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_lead_form _service_districts_v_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_blocks_text_content _service_districts_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v _service_districts_v_parent_id_service_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_parent_id_service_districts_id_fk FOREIGN KEY (parent_id) REFERENCES public.service_districts(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v_rels _service_districts_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_rels _service_districts_v_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_rels
    ADD CONSTRAINT _service_districts_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v _service_districts_v_version_district_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_district_id_districts_id_fk FOREIGN KEY (version_district_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v_version_local_faq _service_districts_v_version_local_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_faq
    ADD CONSTRAINT _service_districts_v_version_local_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v_version_local_landmarks _service_districts_v_version_local_landmarks_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v_version_local_landmarks
    ADD CONSTRAINT _service_districts_v_version_local_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;


--
-- Name: _service_districts_v _service_districts_v_version_mini_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_mini_case_id_cases_id_fk FOREIGN KEY (version_mini_case_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v _service_districts_v_version_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v _service_districts_v_version_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_reviewed_by_id_authors_id_fk FOREIGN KEY (version_reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: _service_districts_v _service_districts_v_version_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._service_districts_v
    ADD CONSTRAINT _service_districts_v_version_service_id_services_id_fk FOREIGN KEY (version_service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: _services_v_blocks_breadcrumbs_items _services_v_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs_items
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_breadcrumbs _services_v_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_breadcrumbs
    ADD CONSTRAINT _services_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_calculator_placeholder _services_v_blocks_calculator_placeholder_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_calculator_placeholder
    ADD CONSTRAINT _services_v_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_cta_banner _services_v_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_cta_banner
    ADD CONSTRAINT _services_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_faq_items _services_v_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq_items
    ADD CONSTRAINT _services_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_faq _services_v_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_faq
    ADD CONSTRAINT _services_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_hero _services_v_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _services_v_blocks_hero _services_v_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_hero
    ADD CONSTRAINT _services_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_lead_form _services_v_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_lead_form
    ADD CONSTRAINT _services_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_mini_case _services_v_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: _services_v_blocks_mini_case_inline_facts _services_v_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case_inline_facts
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_mini_case _services_v_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _services_v_blocks_mini_case _services_v_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_mini_case
    ADD CONSTRAINT _services_v_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_related_services_items _services_v_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services_items
    ADD CONSTRAINT _services_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_related_services _services_v_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_related_services
    ADD CONSTRAINT _services_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_services_grid_items _services_v_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid_items
    ADD CONSTRAINT _services_v_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_services_grid _services_v_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_services_grid
    ADD CONSTRAINT _services_v_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_text_content _services_v_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_text_content
    ADD CONSTRAINT _services_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_blocks_tldr _services_v_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_blocks_tldr
    ADD CONSTRAINT _services_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v _services_v_parent_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_parent_id_services_id_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: _services_v_rels _services_v_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_rels _services_v_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_rels
    ADD CONSTRAINT _services_v_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: _services_v_version_faq_global _services_v_version_faq_global_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_faq_global
    ADD CONSTRAINT _services_v_version_faq_global_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_version_gallery _services_v_version_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _services_v_version_gallery _services_v_version_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_gallery
    ADD CONSTRAINT _services_v_version_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v _services_v_version_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_version_hero_image_id_media_id_fk FOREIGN KEY (version_hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _services_v _services_v_version_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v
    ADD CONSTRAINT _services_v_version_og_image_id_media_id_fk FOREIGN KEY (version_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: _services_v_version_robots_directives _services_v_version_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_robots_directives
    ADD CONSTRAINT _services_v_version_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: _services_v_version_sub_services _services_v_version_sub_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._services_v_version_sub_services
    ADD CONSTRAINT _services_v_version_sub_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: authors authors_avatar_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_avatar_id_media_id_fk FOREIGN KEY (avatar_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: authors_blocks_breadcrumbs_items authors_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_breadcrumbs_items
    ADD CONSTRAINT authors_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_breadcrumbs authors_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_breadcrumbs
    ADD CONSTRAINT authors_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_cta_banner authors_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_cta_banner
    ADD CONSTRAINT authors_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_hero authors_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: authors_blocks_hero authors_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_hero
    ADD CONSTRAINT authors_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_related_services_items authors_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_related_services_items
    ADD CONSTRAINT authors_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_related_services authors_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_related_services
    ADD CONSTRAINT authors_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_blocks_text_content authors_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_blocks_text_content
    ADD CONSTRAINT authors_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_credentials authors_credentials_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_credentials
    ADD CONSTRAINT authors_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_knows_about authors_knows_about_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_knows_about
    ADD CONSTRAINT authors_knows_about_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_rels authors_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: authors_rels authors_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_rels
    ADD CONSTRAINT authors_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_robots_directives authors_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_robots_directives
    ADD CONSTRAINT authors_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: authors_same_as authors_same_as_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authors_same_as
    ADD CONSTRAINT authors_same_as_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_breadcrumbs_items b2b_pages_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs_items
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_breadcrumbs b2b_pages_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_breadcrumbs
    ADD CONSTRAINT b2b_pages_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_cta_banner b2b_pages_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_cta_banner
    ADD CONSTRAINT b2b_pages_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_faq_items b2b_pages_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_faq_items
    ADD CONSTRAINT b2b_pages_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_faq b2b_pages_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_faq
    ADD CONSTRAINT b2b_pages_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_hero b2b_pages_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: b2b_pages_blocks_hero b2b_pages_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_hero
    ADD CONSTRAINT b2b_pages_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_lead_form b2b_pages_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_lead_form
    ADD CONSTRAINT b2b_pages_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_mini_case b2b_pages_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: b2b_pages_blocks_mini_case_inline_facts b2b_pages_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case_inline_facts
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_mini_case b2b_pages_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: b2b_pages_blocks_mini_case b2b_pages_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_mini_case
    ADD CONSTRAINT b2b_pages_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_services_grid_items b2b_pages_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid_items
    ADD CONSTRAINT b2b_pages_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_services_grid b2b_pages_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_services_grid
    ADD CONSTRAINT b2b_pages_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_text_content b2b_pages_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_text_content
    ADD CONSTRAINT b2b_pages_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_blocks_tldr b2b_pages_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_blocks_tldr
    ADD CONSTRAINT b2b_pages_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_rels b2b_pages_rels_cases_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_rels b2b_pages_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_rels b2b_pages_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_rels
    ADD CONSTRAINT b2b_pages_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: b2b_pages_robots_directives b2b_pages_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.b2b_pages_robots_directives
    ADD CONSTRAINT b2b_pages_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: blog blog_author_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_author_id_authors_id_fk FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: blog_blocks_breadcrumbs_items blog_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_breadcrumbs_items
    ADD CONSTRAINT blog_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_breadcrumbs blog_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_breadcrumbs
    ADD CONSTRAINT blog_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_cta_banner blog_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_cta_banner
    ADD CONSTRAINT blog_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_faq_items blog_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_faq_items
    ADD CONSTRAINT blog_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_faq blog_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_faq
    ADD CONSTRAINT blog_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_hero blog_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blog_blocks_hero blog_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_hero
    ADD CONSTRAINT blog_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_related_services_items blog_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_related_services_items
    ADD CONSTRAINT blog_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_related_services blog_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_related_services
    ADD CONSTRAINT blog_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_text_content blog_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_text_content
    ADD CONSTRAINT blog_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_blocks_tldr blog_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blocks_tldr
    ADD CONSTRAINT blog_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_faq_block blog_faq_block_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_faq_block
    ADD CONSTRAINT blog_faq_block_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog blog_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blog_how_to_steps blog_how_to_steps_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_how_to_steps
    ADD CONSTRAINT blog_how_to_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog blog_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: blog_rels blog_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: blog_rels blog_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: blog_rels blog_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_rels
    ADD CONSTRAINT blog_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: blog blog_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: blog_robots_directives blog_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_robots_directives
    ADD CONSTRAINT blog_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_breadcrumbs_items cases_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_breadcrumbs_items
    ADD CONSTRAINT cases_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_breadcrumbs cases_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_breadcrumbs
    ADD CONSTRAINT cases_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_cta_banner cases_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_cta_banner
    ADD CONSTRAINT cases_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_hero cases_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: cases_blocks_hero cases_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_hero
    ADD CONSTRAINT cases_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_mini_case cases_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: cases_blocks_mini_case_inline_facts cases_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case_inline_facts
    ADD CONSTRAINT cases_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_mini_case cases_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: cases_blocks_mini_case cases_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_mini_case
    ADD CONSTRAINT cases_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_related_services_items cases_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_related_services_items
    ADD CONSTRAINT cases_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_related_services cases_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_related_services
    ADD CONSTRAINT cases_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_blocks_text_content cases_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_blocks_text_content
    ADD CONSTRAINT cases_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases cases_district_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: cases cases_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: cases_photos_after cases_photos_after_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: cases_photos_after cases_photos_after_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_after
    ADD CONSTRAINT cases_photos_after_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_photos_before cases_photos_before_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: cases_photos_before cases_photos_before_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_photos_before
    ADD CONSTRAINT cases_photos_before_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases_rels cases_rels_authors_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: cases_rels cases_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_rels
    ADD CONSTRAINT cases_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases cases_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: cases_robots_directives cases_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases_robots_directives
    ADD CONSTRAINT cases_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases cases_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: districts_blocks_breadcrumbs_items districts_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_breadcrumbs_items
    ADD CONSTRAINT districts_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_breadcrumbs districts_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_breadcrumbs
    ADD CONSTRAINT districts_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_hero districts_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: districts_blocks_hero districts_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_hero
    ADD CONSTRAINT districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_lead_form districts_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_lead_form
    ADD CONSTRAINT districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_mini_case districts_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: districts_blocks_mini_case_inline_facts districts_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case_inline_facts
    ADD CONSTRAINT districts_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_mini_case districts_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: districts_blocks_mini_case districts_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_mini_case
    ADD CONSTRAINT districts_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_neighbor_districts_items districts_blocks_neighbor_districts_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_neighbor_districts_items
    ADD CONSTRAINT districts_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_neighbor_districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_neighbor_districts districts_blocks_neighbor_districts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_neighbor_districts
    ADD CONSTRAINT districts_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_services_grid_items districts_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_services_grid_items
    ADD CONSTRAINT districts_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_services_grid districts_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_services_grid
    ADD CONSTRAINT districts_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_text_content districts_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_text_content
    ADD CONSTRAINT districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_blocks_tldr districts_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_blocks_tldr
    ADD CONSTRAINT districts_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts districts_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: districts_landmarks districts_landmarks_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_landmarks
    ADD CONSTRAINT districts_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts districts_photo_geo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_photo_geo_id_media_id_fk FOREIGN KEY (photo_geo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: districts_rels districts_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_rels districts_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: districts_rels districts_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_rels
    ADD CONSTRAINT districts_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: districts_robots_directives districts_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.districts_robots_directives
    ADD CONSTRAINT districts_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: leads leads_district_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: leads_photos leads_photos_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads_photos
    ADD CONSTRAINT leads_photos_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: leads leads_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_authors_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_authors_fk FOREIGN KEY (authors_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_b2b_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_b2b_pages_fk FOREIGN KEY (b2b_pages_id) REFERENCES public.b2b_pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_blog_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_blog_fk FOREIGN KEY (blog_id) REFERENCES public.blog(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_cases_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_cases_fk FOREIGN KEY (cases_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_districts_fk FOREIGN KEY (districts_id) REFERENCES public.districts(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_leads_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_leads_fk FOREIGN KEY (leads_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_redirects_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_redirects_fk FOREIGN KEY (redirects_id) REFERENCES public.redirects(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_service_districts_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_service_districts_fk FOREIGN KEY (service_districts_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: seo_settings_credentials seo_settings_credentials_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings_credentials
    ADD CONSTRAINT seo_settings_credentials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.seo_settings(id) ON DELETE CASCADE;


--
-- Name: seo_settings seo_settings_default_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_settings
    ADD CONSTRAINT seo_settings_default_og_image_id_media_id_fk FOREIGN KEY (default_og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: service_districts_blocks_cta_banner service_districts_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_blocks_faq_items service_districts_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: service_districts_blocks_faq service_districts_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_blocks_hero service_districts_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: service_districts_blocks_hero service_districts_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_blocks_lead_form service_districts_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_blocks_text_content service_districts_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts service_districts_district_id_districts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_district_id_districts_id_fk FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;


--
-- Name: service_districts_local_faq service_districts_local_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_local_faq
    ADD CONSTRAINT service_districts_local_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_local_landmarks service_districts_local_landmarks_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_local_landmarks
    ADD CONSTRAINT service_districts_local_landmarks_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts service_districts_mini_case_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_mini_case_id_cases_id_fk FOREIGN KEY (mini_case_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: service_districts service_districts_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: service_districts_rels service_districts_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;


--
-- Name: service_districts_rels service_districts_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts_rels
    ADD CONSTRAINT service_districts_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: service_districts service_districts_reviewed_by_id_authors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_reviewed_by_id_authors_id_fk FOREIGN KEY (reviewed_by_id) REFERENCES public.authors(id) ON DELETE SET NULL;


--
-- Name: service_districts service_districts_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_districts
    ADD CONSTRAINT service_districts_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: services_blocks_breadcrumbs_items services_blocks_breadcrumbs_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_breadcrumbs_items
    ADD CONSTRAINT services_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_breadcrumbs(id) ON DELETE CASCADE;


--
-- Name: services_blocks_breadcrumbs services_blocks_breadcrumbs_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_breadcrumbs
    ADD CONSTRAINT services_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_calculator_placeholder services_blocks_calculator_placeholder_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_calculator_placeholder
    ADD CONSTRAINT services_blocks_calculator_placeholder_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_cta_banner services_blocks_cta_banner_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_cta_banner
    ADD CONSTRAINT services_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_faq_items services_blocks_faq_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_faq_items
    ADD CONSTRAINT services_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_faq(id) ON DELETE CASCADE;


--
-- Name: services_blocks_faq services_blocks_faq_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_faq
    ADD CONSTRAINT services_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_hero services_blocks_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_blocks_hero services_blocks_hero_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_hero
    ADD CONSTRAINT services_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_lead_form services_blocks_lead_form_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_lead_form
    ADD CONSTRAINT services_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_mini_case services_blocks_mini_case_case_ref_id_cases_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_case_ref_id_cases_id_fk FOREIGN KEY (case_ref_id) REFERENCES public.cases(id) ON DELETE SET NULL;


--
-- Name: services_blocks_mini_case_inline_facts services_blocks_mini_case_inline_facts_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case_inline_facts
    ADD CONSTRAINT services_blocks_mini_case_inline_facts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_mini_case(id) ON DELETE CASCADE;


--
-- Name: services_blocks_mini_case services_blocks_mini_case_inline_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_inline_photo_id_media_id_fk FOREIGN KEY (inline_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_blocks_mini_case services_blocks_mini_case_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_mini_case
    ADD CONSTRAINT services_blocks_mini_case_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_related_services_items services_blocks_related_services_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_related_services_items
    ADD CONSTRAINT services_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_related_services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_related_services services_blocks_related_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_related_services
    ADD CONSTRAINT services_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_services_grid_items services_blocks_services_grid_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_services_grid_items
    ADD CONSTRAINT services_blocks_services_grid_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_services_grid(id) ON DELETE CASCADE;


--
-- Name: services_blocks_services_grid services_blocks_services_grid_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_services_grid
    ADD CONSTRAINT services_blocks_services_grid_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_text_content services_blocks_text_content_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_text_content
    ADD CONSTRAINT services_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_blocks_tldr services_blocks_tldr_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_blocks_tldr
    ADD CONSTRAINT services_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_faq_global services_faq_global_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_faq_global
    ADD CONSTRAINT services_faq_global_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_gallery services_gallery_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_gallery services_gallery_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_gallery
    ADD CONSTRAINT services_gallery_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services services_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services services_og_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_og_image_id_media_id_fk FOREIGN KEY (og_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: services_rels services_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_rels services_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_rels
    ADD CONSTRAINT services_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_robots_directives services_robots_directives_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_robots_directives
    ADD CONSTRAINT services_robots_directives_parent_fk FOREIGN KEY (parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: services_sub_services services_sub_services_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services_sub_services
    ADD CONSTRAINT services_sub_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: site_chrome_footer_columns_items site_chrome_footer_columns_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_footer_columns_items
    ADD CONSTRAINT site_chrome_footer_columns_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome_footer_columns(id) ON DELETE CASCADE;


--
-- Name: site_chrome_footer_columns site_chrome_footer_columns_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_footer_columns
    ADD CONSTRAINT site_chrome_footer_columns_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;


--
-- Name: site_chrome_header_menu site_chrome_header_menu_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_header_menu
    ADD CONSTRAINT site_chrome_header_menu_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;


--
-- Name: site_chrome_social site_chrome_social_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_chrome_social
    ADD CONSTRAINT site_chrome_social_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.site_chrome(id) ON DELETE CASCADE;


--
-- Name: users_recovery_codes users_recovery_codes_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_recovery_codes
    ADD CONSTRAINT users_recovery_codes_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9evp988cYQ6AgXPrdtVGEzjVQBIlJ7ij0GjrqIE7g8Bd4BSsDKJCtF1C0B621to

