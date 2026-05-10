-- EPIC-SERVICE-PAGES-UX C2.6 — CREATE TABLE migrations для 6 SD blocks.
--
-- Контекст: PR #209 wave B попытка extend ServiceDistricts.blockReferences
-- упала на prod regression: `relation "service_districts_blocks_breadcrumbs"
-- does not exist`. Schema sync работал только локально (pnpm dev push), на
-- prod таблицы отсутствовали → /vyvoz-musora/khimki/ + 30 SD pages → 404.
-- Hotfix #210 сделал revert ServiceDistricts.blockReferences к 5 sustained
-- blocks (Hero / TextContent / LeadForm / CtaBanner / Faq).
--
-- Эта миграция — proper schema migration для добавления 6 новых SD blocks:
--   • Breadcrumbs        (slug='breadcrumbs')
--   • Tldr               (slug='tldr')
--   • PricingTable       (slug='pricing-table')
--   • ProcessSteps       (slug='process-steps')
--   • NeighborDistricts  (slug='neighbor-districts')
--   • RelatedServices    (slug='related-services')
--
-- 7-й block (Calculator slug='calculator-placeholder') — НЕ включён здесь.
-- Sustained 63-char enum issue: `enum_service_districts_blocks_calculator_
-- placeholder_service_type` = 65 chars > Postgres NAMEDATALEN 63. Backlog:
-- separate fix через Payload v3 enumName override field option.
--
-- Naming convention (sustained Payload v3, см. 20260424_133242_us_3_blocks_and_seo):
--   • Multi-word block slugs: dash → underscore (pricing-table → pricing_table)
--   • Published table:   service_districts_blocks_<block>
--   • Draft table:       _service_districts_v_blocks_<block>
--   • Array sub-tables:  <table>_<array_field>  (с _parent_id varchar для
--                        published / integer для drafts — sustained pattern)
--   • PK published id:   character varying  (Payload Block id format)
--   • PK draft id:       integer + sequence + nextval default
--   • Enums:
--       enum_service_districts_blocks_<block>_<field>      — published
--       enum__service_districts_v_blocks_<block>_<field>   — drafts
--   • Все таблицы получают (_order, _parent_id, _path, id, enabled, anchor,
--     <block-fields>, block_name) на main row + array-rows.
--
-- Idempotent:
--   - CREATE TYPE → guarded `DO $$ ... pg_type lookup ... CREATE TYPE`
--   - CREATE TABLE → IF NOT EXISTS
--   - CREATE INDEX → IF NOT EXISTS
--   - ADD CONSTRAINT → guarded `DO $$ ... information_schema.table_constraints
--     ... ALTER TABLE ADD CONSTRAINT`  (Postgres не поддерживает
--     `IF NOT EXISTS` на ADD CONSTRAINT).

BEGIN;

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. ENUM TYPES (idempotent, без IF NOT EXISTS — Postgres pre-15 patterns)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_service_districts_blocks_pricing_table_variant') THEN
    CREATE TYPE public.enum_service_districts_blocks_pricing_table_variant AS ENUM (
      'tiers', 'list', 'per-district'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__service_districts_v_blocks_pricing_table_variant') THEN
    CREATE TYPE public.enum__service_districts_v_blocks_pricing_table_variant AS ENUM (
      'tiers', 'list', 'per-district'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_service_districts_blocks_process_steps_layout') THEN
    CREATE TYPE public.enum_service_districts_blocks_process_steps_layout AS ENUM (
      'vertical', 'horizontal'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__service_districts_v_blocks_process_steps_layout') THEN
    CREATE TYPE public.enum__service_districts_v_blocks_process_steps_layout AS ENUM (
      'vertical', 'horizontal'
    );
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. PUBLISHED BLOCKS TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────── Breadcrumbs ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_breadcrumbs (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    generate_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    url character varying
);

-- ───────── Tldr ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_tldr (
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

-- ───────── PricingTable ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_pricing_table (
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

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_pricing_table_tiers (
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

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    value character varying
);

-- ───────── ProcessSteps ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_process_steps (
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

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying
);

-- ───────── NeighborDistricts ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_neighbor_districts (
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

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    name character varying,
    slug character varying,
    distance character varying
);

-- ───────── RelatedServices ─────────
CREATE TABLE IF NOT EXISTS public.service_districts_blocks_related_services (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Похожие услуги'::character varying,
    block_name character varying
);

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    title character varying,
    slug character varying,
    summary character varying
);

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. DRAFTS BLOCKS TABLES (_service_districts_v_blocks_*)
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────── Breadcrumbs ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_breadcrumbs (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_breadcrumbs_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    url character varying,
    _uuid character varying
);

-- ───────── Tldr ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_tldr (
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

-- ───────── PricingTable ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_pricing_table (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_pricing_table_tiers (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    value character varying,
    _uuid character varying
);

-- ───────── ProcessSteps ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_process_steps (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying,
    _uuid character varying
);

-- ───────── NeighborDistricts ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_neighbor_districts (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_neighbor_districts_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    slug character varying,
    distance character varying,
    _uuid character varying
);

-- ───────── RelatedServices ─────────
CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_related_services (
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

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_related_services_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    title character varying,
    slug character varying,
    summary character varying,
    _uuid character varying
);

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. SEQUENCES + DEFAULTS for drafts integer ids
-- ═══════════════════════════════════════════════════════════════════════════

CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_breadcrumbs_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_breadcrumbs_items_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_tldr_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_pricing_table_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_pricing_table_tiers_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_pricing_table_tiers_features_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_process_steps_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_process_steps_steps_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_neighbor_districts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_neighbor_districts_items_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_related_services_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_related_services_items_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_breadcrumbs_id_seq                    OWNED BY public._service_districts_v_blocks_breadcrumbs.id;
ALTER SEQUENCE public._service_districts_v_blocks_breadcrumbs_items_id_seq              OWNED BY public._service_districts_v_blocks_breadcrumbs_items.id;
ALTER SEQUENCE public._service_districts_v_blocks_tldr_id_seq                           OWNED BY public._service_districts_v_blocks_tldr.id;
ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_id_seq                  OWNED BY public._service_districts_v_blocks_pricing_table.id;
ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_id_seq            OWNED BY public._service_districts_v_blocks_pricing_table_tiers.id;
ALTER SEQUENCE public._service_districts_v_blocks_pricing_table_tiers_features_id_seq   OWNED BY public._service_districts_v_blocks_pricing_table_tiers_features.id;
ALTER SEQUENCE public._service_districts_v_blocks_process_steps_id_seq                  OWNED BY public._service_districts_v_blocks_process_steps.id;
ALTER SEQUENCE public._service_districts_v_blocks_process_steps_steps_id_seq            OWNED BY public._service_districts_v_blocks_process_steps_steps.id;
ALTER SEQUENCE public._service_districts_v_blocks_neighbor_districts_id_seq             OWNED BY public._service_districts_v_blocks_neighbor_districts.id;
ALTER SEQUENCE public._service_districts_v_blocks_neighbor_districts_items_id_seq       OWNED BY public._service_districts_v_blocks_neighbor_districts_items.id;
ALTER SEQUENCE public._service_districts_v_blocks_related_services_id_seq               OWNED BY public._service_districts_v_blocks_related_services.id;
ALTER SEQUENCE public._service_districts_v_blocks_related_services_items_id_seq         OWNED BY public._service_districts_v_blocks_related_services_items.id;

ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs                    ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_breadcrumbs_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items              ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_breadcrumbs_items_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_tldr                           ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_tldr_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table                  ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers            ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_tiers_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features   ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_pricing_table_tiers_features_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_process_steps                  ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_process_steps_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps            ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_process_steps_steps_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts             ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_neighbor_districts_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items       ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_neighbor_districts_items_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_related_services               ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_related_services_id_seq'::regclass);
ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items         ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_related_services_items_id_seq'::regclass);

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. PRIMARY KEYS  (guarded — Postgres не поддерживает IF NOT EXISTS на ADD CONSTRAINT)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_breadcrumbs_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs ADD CONSTRAINT service_districts_blocks_breadcrumbs_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_breadcrumbs_items_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs_items ADD CONSTRAINT service_districts_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_tldr_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_tldr ADD CONSTRAINT service_districts_blocks_tldr_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table ADD CONSTRAINT service_districts_blocks_pricing_table_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_tiers_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_tiers_features_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers_features ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_process_steps_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_process_steps ADD CONSTRAINT service_districts_blocks_process_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_process_steps_steps_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_process_steps_steps ADD CONSTRAINT service_districts_blocks_process_steps_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_neighbor_districts_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts ADD CONSTRAINT service_districts_blocks_neighbor_districts_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_neighbor_districts_items_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts_items ADD CONSTRAINT service_districts_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_related_services_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_related_services ADD CONSTRAINT service_districts_blocks_related_services_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_related_services_items_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_related_services_items ADD CONSTRAINT service_districts_blocks_related_services_items_pkey PRIMARY KEY (id);
  END IF;

  -- drafts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_breadcrumbs_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_breadcrumbs_items_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_items_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_tldr_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_tldr ADD CONSTRAINT _service_districts_v_blocks_tldr_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table ADD CONSTRAINT _service_districts_v_blocks_pricing_table_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_tiers_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_tiers_features_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_process_steps_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_process_steps ADD CONSTRAINT _service_districts_v_blocks_process_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_process_steps_steps_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps ADD CONSTRAINT _service_districts_v_blocks_process_steps_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_neighbor_districts_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_neighbor_districts_items_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_items_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_related_services_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_related_services ADD CONSTRAINT _service_districts_v_blocks_related_services_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_related_services_items_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items ADD CONSTRAINT _service_districts_v_blocks_related_services_items_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. FOREIGN KEYS  (guarded)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
  -- published — _parent_id integer → service_districts.id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_breadcrumbs_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs ADD CONSTRAINT service_districts_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_tldr_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_tldr ADD CONSTRAINT service_districts_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table ADD CONSTRAINT service_districts_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_process_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_process_steps ADD CONSTRAINT service_districts_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_neighbor_districts_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts ADD CONSTRAINT service_districts_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_related_services_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_related_services ADD CONSTRAINT service_districts_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;

  -- published — array sub-tables _parent_id varchar → main.id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_breadcrumbs_items_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_breadcrumbs_items ADD CONSTRAINT service_districts_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_breadcrumbs(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_tiers_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_pricing_table(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_pricing_table_tiers_features_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_pricing_table_tiers_features ADD CONSTRAINT service_districts_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_pricing_table_tiers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_process_steps_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_process_steps_steps ADD CONSTRAINT service_districts_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_process_steps(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_neighbor_districts_items_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_neighbor_districts_items ADD CONSTRAINT service_districts_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_neighbor_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'service_districts_blocks_related_services_items_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_related_services_items ADD CONSTRAINT service_districts_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_related_services(id) ON DELETE CASCADE;
  END IF;

  -- drafts — _parent_id integer → _service_districts_v.id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_breadcrumbs_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_tldr_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_tldr ADD CONSTRAINT _service_districts_v_blocks_tldr_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table ADD CONSTRAINT _service_districts_v_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_process_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_process_steps ADD CONSTRAINT _service_districts_v_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_neighbor_districts_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_related_services_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_related_services ADD CONSTRAINT _service_districts_v_blocks_related_services_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;

  -- drafts — array sub-tables _parent_id integer → main.id
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_breadcrumbs_items_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_breadcrumbs_items ADD CONSTRAINT _service_districts_v_blocks_breadcrumbs_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_breadcrumbs(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_tiers_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_pricing_table(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_pricing_table_tiers_features_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_pricing_table_tiers_features ADD CONSTRAINT _service_districts_v_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_pricing_table_tiers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_process_steps_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_process_steps_steps ADD CONSTRAINT _service_districts_v_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_process_steps(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_neighbor_districts_items_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_neighbor_districts_items ADD CONSTRAINT _service_districts_v_blocks_neighbor_districts_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_neighbor_districts(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_service_districts_v_blocks_related_services_items_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_related_services_items ADD CONSTRAINT _service_districts_v_blocks_related_services_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_related_services(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. INDEXES — _order, _parent_id, _path
-- ═══════════════════════════════════════════════════════════════════════════

-- published
CREATE INDEX IF NOT EXISTS service_districts_blocks_breadcrumbs_order_idx     ON public.service_districts_blocks_breadcrumbs USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_breadcrumbs_parent_id_idx ON public.service_districts_blocks_breadcrumbs USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_breadcrumbs_path_idx      ON public.service_districts_blocks_breadcrumbs USING btree (_path);
CREATE INDEX IF NOT EXISTS service_districts_blocks_breadcrumbs_items_order_idx     ON public.service_districts_blocks_breadcrumbs_items USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_breadcrumbs_items_parent_id_idx ON public.service_districts_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS service_districts_blocks_tldr_order_idx     ON public.service_districts_blocks_tldr USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_tldr_parent_id_idx ON public.service_districts_blocks_tldr USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_tldr_path_idx      ON public.service_districts_blocks_tldr USING btree (_path);

CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_order_idx     ON public.service_districts_blocks_pricing_table USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_parent_id_idx ON public.service_districts_blocks_pricing_table USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_path_idx      ON public.service_districts_blocks_pricing_table USING btree (_path);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_tiers_order_idx     ON public.service_districts_blocks_pricing_table_tiers USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_tiers_parent_id_idx ON public.service_districts_blocks_pricing_table_tiers USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_tiers_features_order_idx     ON public.service_districts_blocks_pricing_table_tiers_features USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_pricing_table_tiers_features_parent_id_idx ON public.service_districts_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS service_districts_blocks_process_steps_order_idx     ON public.service_districts_blocks_process_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_process_steps_parent_id_idx ON public.service_districts_blocks_process_steps USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_process_steps_path_idx      ON public.service_districts_blocks_process_steps USING btree (_path);
CREATE INDEX IF NOT EXISTS service_districts_blocks_process_steps_steps_order_idx     ON public.service_districts_blocks_process_steps_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_process_steps_steps_parent_id_idx ON public.service_districts_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS service_districts_blocks_neighbor_districts_order_idx     ON public.service_districts_blocks_neighbor_districts USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_neighbor_districts_parent_id_idx ON public.service_districts_blocks_neighbor_districts USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_neighbor_districts_path_idx      ON public.service_districts_blocks_neighbor_districts USING btree (_path);
CREATE INDEX IF NOT EXISTS service_districts_blocks_neighbor_districts_items_order_idx     ON public.service_districts_blocks_neighbor_districts_items USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_neighbor_districts_items_parent_id_idx ON public.service_districts_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS service_districts_blocks_related_services_order_idx     ON public.service_districts_blocks_related_services USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_related_services_parent_id_idx ON public.service_districts_blocks_related_services USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_related_services_path_idx      ON public.service_districts_blocks_related_services USING btree (_path);
CREATE INDEX IF NOT EXISTS service_districts_blocks_related_services_items_order_idx     ON public.service_districts_blocks_related_services_items USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_related_services_items_parent_id_idx ON public.service_districts_blocks_related_services_items USING btree (_parent_id);

-- drafts
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_breadcrumbs_order_idx     ON public._service_districts_v_blocks_breadcrumbs USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_breadcrumbs_parent_id_idx ON public._service_districts_v_blocks_breadcrumbs USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_breadcrumbs_path_idx      ON public._service_districts_v_blocks_breadcrumbs USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_breadcrumbs_items_order_idx     ON public._service_districts_v_blocks_breadcrumbs_items USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_breadcrumbs_items_parent_id_idx ON public._service_districts_v_blocks_breadcrumbs_items USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_tldr_order_idx     ON public._service_districts_v_blocks_tldr USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_tldr_parent_id_idx ON public._service_districts_v_blocks_tldr USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_tldr_path_idx      ON public._service_districts_v_blocks_tldr USING btree (_path);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_order_idx     ON public._service_districts_v_blocks_pricing_table USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_parent_id_idx ON public._service_districts_v_blocks_pricing_table USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_path_idx      ON public._service_districts_v_blocks_pricing_table USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_tiers_order_idx     ON public._service_districts_v_blocks_pricing_table_tiers USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_tiers_parent_id_idx ON public._service_districts_v_blocks_pricing_table_tiers USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_tiers_features_order_idx     ON public._service_districts_v_blocks_pricing_table_tiers_features USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_pricing_table_tiers_features_parent_id_idx ON public._service_districts_v_blocks_pricing_table_tiers_features USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_process_steps_order_idx     ON public._service_districts_v_blocks_process_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_process_steps_parent_id_idx ON public._service_districts_v_blocks_process_steps USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_process_steps_path_idx      ON public._service_districts_v_blocks_process_steps USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_process_steps_steps_order_idx     ON public._service_districts_v_blocks_process_steps_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_process_steps_steps_parent_id_idx ON public._service_districts_v_blocks_process_steps_steps USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_neighbor_districts_order_idx     ON public._service_districts_v_blocks_neighbor_districts USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_neighbor_districts_parent_id_idx ON public._service_districts_v_blocks_neighbor_districts USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_neighbor_districts_path_idx      ON public._service_districts_v_blocks_neighbor_districts USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_neighbor_districts_items_order_idx     ON public._service_districts_v_blocks_neighbor_districts_items USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_neighbor_districts_items_parent_id_idx ON public._service_districts_v_blocks_neighbor_districts_items USING btree (_parent_id);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_related_services_order_idx     ON public._service_districts_v_blocks_related_services USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_related_services_parent_id_idx ON public._service_districts_v_blocks_related_services USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_related_services_path_idx      ON public._service_districts_v_blocks_related_services USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_related_services_items_order_idx     ON public._service_districts_v_blocks_related_services_items USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_related_services_items_parent_id_idx ON public._service_districts_v_blocks_related_services_items USING btree (_parent_id);

COMMIT;
