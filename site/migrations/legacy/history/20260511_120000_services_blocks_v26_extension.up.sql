-- EPIC-SERVICE-PAGES-UX C5 wave B — CREATE TABLE для 2 v2.6 blocks на Services.
--
-- Цель: дать pillar-страницам (`/<pillar>/`, T2_PILLAR) реальные блоки
-- pricing-table + process-steps для редизайна (templateV2). Зеркало того, что
-- ServiceDistricts уже получил в C2.6 (`20260510_161708_sd_blocks_extension`).
--
-- Создаёт published + drafts таблицы:
--   • PricingTable  → services_blocks_pricing_table (+ _tiers, _tiers_features)
--   • ProcessSteps  → services_blocks_process_steps (+ _steps)
--   • drafts mirror → _services_v_blocks_pricing_table (+ _tiers, _tiers_features)
--                     _services_v_blocks_process_steps (+ _steps)
--
-- Multi-word block slugs: dash → underscore (pricing-table → pricing_table).
--
-- Idempotent на ВСЁМ:
--   - CREATE TYPE  → guarded DO $$ ... pg_type lookup ... CREATE TYPE
--   - CREATE TABLE / SEQUENCE  → IF NOT EXISTS
--   - ADD CONSTRAINT  → guarded DO $$ ... pg_constraint lookup ... ALTER TABLE
--   - CREATE INDEX  → IF NOT EXISTS

-- ════════════════════════════════════════════════════════════════════════════
-- 1. ENUM types
-- ════════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_pricing_table_variant') THEN
    CREATE TYPE public.enum_services_blocks_pricing_table_variant AS ENUM ('tiers', 'list', 'per-district');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_pricing_table_variant') THEN
    CREATE TYPE public.enum__services_v_blocks_pricing_table_variant AS ENUM ('tiers', 'list', 'per-district');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_process_steps_layout') THEN
    CREATE TYPE public.enum_services_blocks_process_steps_layout AS ENUM ('vertical', 'horizontal');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_process_steps_layout') THEN
    CREATE TYPE public.enum__services_v_blocks_process_steps_layout AS ENUM ('vertical', 'horizontal');
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. PUBLISHED tables
-- ════════════════════════════════════════════════════════════════════════════

-- ───────── PricingTable ─────────
CREATE TABLE IF NOT EXISTS public.services_blocks_pricing_table (
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

CREATE TABLE IF NOT EXISTS public.services_blocks_pricing_table_tiers (
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

CREATE TABLE IF NOT EXISTS public.services_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    value character varying
);

-- ───────── ProcessSteps ─────────
CREATE TABLE IF NOT EXISTS public.services_blocks_process_steps (
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

CREATE TABLE IF NOT EXISTS public.services_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying
);

-- ════════════════════════════════════════════════════════════════════════════
-- 3. DRAFTS mirror tables (_services_v_blocks_*)
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public._services_v_blocks_pricing_table (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id serial NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'pricing'::character varying,
    h2 character varying,
    helper character varying,
    variant public.enum__services_v_blocks_pricing_table_variant DEFAULT 'tiers'::public.enum__services_v_blocks_pricing_table_variant,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE IF NOT EXISTS public._services_v_blocks_pricing_table_tiers (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id serial NOT NULL,
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

CREATE TABLE IF NOT EXISTS public._services_v_blocks_pricing_table_tiers_features (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id serial NOT NULL,
    value character varying,
    _uuid character varying
);

CREATE TABLE IF NOT EXISTS public._services_v_blocks_process_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id serial NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying DEFAULT 'process'::character varying,
    h2 character varying DEFAULT 'Как мы работаем'::character varying,
    helper character varying,
    layout public.enum__services_v_blocks_process_steps_layout DEFAULT 'vertical'::public.enum__services_v_blocks_process_steps_layout,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE IF NOT EXISTS public._services_v_blocks_process_steps_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id serial NOT NULL,
    num character varying,
    title character varying,
    description character varying,
    eta character varying,
    _uuid character varying
);

-- ════════════════════════════════════════════════════════════════════════════
-- 4. PRIMARY KEYS  (guarded — Postgres не поддерживает IF NOT EXISTS на ADD CONSTRAINT)
-- ════════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  -- published
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_pkey') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table ADD CONSTRAINT services_blocks_pricing_table_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_tiers_pkey') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table_tiers ADD CONSTRAINT services_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_tiers_features_pkey') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table_tiers_features ADD CONSTRAINT services_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_process_steps_pkey') THEN
    ALTER TABLE ONLY public.services_blocks_process_steps ADD CONSTRAINT services_blocks_process_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_process_steps_steps_pkey') THEN
    ALTER TABLE ONLY public.services_blocks_process_steps_steps ADD CONSTRAINT services_blocks_process_steps_steps_pkey PRIMARY KEY (id);
  END IF;
  -- drafts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_pkey') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table ADD CONSTRAINT _services_v_blocks_pricing_table_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_tiers_pkey') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_tiers_features_pkey') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers_features ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_features_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_process_steps_pkey') THEN
    ALTER TABLE ONLY public._services_v_blocks_process_steps ADD CONSTRAINT _services_v_blocks_process_steps_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_process_steps_steps_pkey') THEN
    ALTER TABLE ONLY public._services_v_blocks_process_steps_steps ADD CONSTRAINT _services_v_blocks_process_steps_steps_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. FOREIGN KEYS  (guarded)
-- ════════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
  -- published parent FKs → services(id)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_parent_id_fk') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table ADD CONSTRAINT services_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_process_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public.services_blocks_process_steps ADD CONSTRAINT services_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services(id) ON DELETE CASCADE;
  END IF;
  -- published nested FKs
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_tiers_parent_id_fk') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table_tiers ADD CONSTRAINT services_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_pricing_table(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_pricing_table_tiers_features_parent_id_fk') THEN
    ALTER TABLE ONLY public.services_blocks_pricing_table_tiers_features ADD CONSTRAINT services_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_pricing_table_tiers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_blocks_process_steps_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public.services_blocks_process_steps_steps ADD CONSTRAINT services_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.services_blocks_process_steps(id) ON DELETE CASCADE;
  END IF;
  -- drafts parent FKs → _services_v(id)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_parent_id_fk') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table ADD CONSTRAINT _services_v_blocks_pricing_table_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_process_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public._services_v_blocks_process_steps ADD CONSTRAINT _services_v_blocks_process_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v(id) ON DELETE CASCADE;
  END IF;
  -- drafts nested FKs
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_tiers_parent_id_fk') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_pricing_table(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_pricing_table_tiers_features_parent_id_fk') THEN
    ALTER TABLE ONLY public._services_v_blocks_pricing_table_tiers_features ADD CONSTRAINT _services_v_blocks_pricing_table_tiers_features_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_pricing_table_tiers(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_services_v_blocks_process_steps_steps_parent_id_fk') THEN
    ALTER TABLE ONLY public._services_v_blocks_process_steps_steps ADD CONSTRAINT _services_v_blocks_process_steps_steps_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._services_v_blocks_process_steps(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 6. INDEXES
-- ════════════════════════════════════════════════════════════════════════════
-- published
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_order_idx     ON public.services_blocks_pricing_table USING btree (_order);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_parent_id_idx ON public.services_blocks_pricing_table USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_path_idx      ON public.services_blocks_pricing_table USING btree (_path);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_tiers_order_idx     ON public.services_blocks_pricing_table_tiers USING btree (_order);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_tiers_parent_id_idx ON public.services_blocks_pricing_table_tiers USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_tiers_features_order_idx     ON public.services_blocks_pricing_table_tiers_features USING btree (_order);
CREATE INDEX IF NOT EXISTS services_blocks_pricing_table_tiers_features_parent_id_idx ON public.services_blocks_pricing_table_tiers_features USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS services_blocks_process_steps_order_idx     ON public.services_blocks_process_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS services_blocks_process_steps_parent_id_idx ON public.services_blocks_process_steps USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS services_blocks_process_steps_path_idx      ON public.services_blocks_process_steps USING btree (_path);
CREATE INDEX IF NOT EXISTS services_blocks_process_steps_steps_order_idx     ON public.services_blocks_process_steps_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS services_blocks_process_steps_steps_parent_id_idx ON public.services_blocks_process_steps_steps USING btree (_parent_id);
-- drafts
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_order_idx     ON public._services_v_blocks_pricing_table USING btree (_order);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_parent_id_idx ON public._services_v_blocks_pricing_table USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_path_idx      ON public._services_v_blocks_pricing_table USING btree (_path);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_tiers_order_idx     ON public._services_v_blocks_pricing_table_tiers USING btree (_order);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_tiers_parent_id_idx ON public._services_v_blocks_pricing_table_tiers USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_tiers_features_order_idx     ON public._services_v_blocks_pricing_table_tiers_features USING btree (_order);
CREATE INDEX IF NOT EXISTS _services_v_blocks_pricing_table_tiers_features_parent_id_idx ON public._services_v_blocks_pricing_table_tiers_features USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _services_v_blocks_process_steps_order_idx     ON public._services_v_blocks_process_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS _services_v_blocks_process_steps_parent_id_idx ON public._services_v_blocks_process_steps USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _services_v_blocks_process_steps_path_idx      ON public._services_v_blocks_process_steps USING btree (_path);
CREATE INDEX IF NOT EXISTS _services_v_blocks_process_steps_steps_order_idx     ON public._services_v_blocks_process_steps_steps USING btree (_order);
CREATE INDEX IF NOT EXISTS _services_v_blocks_process_steps_steps_parent_id_idx ON public._services_v_blocks_process_steps_steps USING btree (_parent_id);
