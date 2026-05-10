-- EPIC-SERVICE-PAGES-UX C2.6 issue 3 — Calculator (slug='calculator-placeholder')
-- 65-char enum name overflow на T4_SD parent → blocked Calculator в
-- ServiceDistricts.blockReferences (sustained note из 20260510_161708_sd_blocks_extension).
--
-- Approach (option A — Payload v3 `enumName` function override):
--   Calculator.serviceType field получает `enumName: ({tableName}) =>
--   'enum_' + tableName + '_svc_t'`. Имя ENUM TYPE становится:
--     • T2          enum_services_blocks_calculator_placeholder_svc_t            (49)
--     • T2 drafts   enum__services_v_blocks_calculator_placeholder_svc_t          (52)
--     • T4_SD       enum_service_districts_blocks_calculator_placeholder_svc_t    (58)
--     • T4_SD draft enum__service_districts_v_blocks_calculator_placeholder_svc_t (61)
--   Все ≤ 63 символа.
--
-- Этот UP делает 2 вещи:
--
--   1. RENAME существующих T2 enum-типов на новые короткие имена (ALTER TYPE
--      … RENAME TO …). Sustained `services_blocks_calculator_placeholder.
--      service_type` column unchanged — Postgres ENUM type rename атомарен,
--      column references обновляются по oid.
--
--   2. CREATE T4_SD calculator-placeholder tables (published + drafts) +
--      их короткие ENUM type'ы + FK + indexes. Эти таблицы не существуют
--      на prod (Calculator был исключён из ServiceDistricts.blockReferences
--      в hotfix #210).
--
-- Idempotent во ВСЁМ:
--   • RENAME guarded `pg_type lookup` (если уже переименован — skip)
--   • CREATE TYPE  guarded `pg_type lookup`
--   • CREATE TABLE / SEQUENCE  IF NOT EXISTS
--   • ADD CONSTRAINT  guarded `pg_constraint lookup`
--   • CREATE INDEX  IF NOT EXISTS

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. RENAME EXISTING T2 ENUM TYPES (sustained data unchanged)
-- ═══════════════════════════════════════════════════════════════════════════

-- T2 published: enum_services_blocks_calculator_placeholder_service_type (56)
--           →   enum_services_blocks_calculator_placeholder_svc_t        (49)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_calculator_placeholder_service_type')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_calculator_placeholder_svc_t') THEN
    ALTER TYPE public.enum_services_blocks_calculator_placeholder_service_type
      RENAME TO enum_services_blocks_calculator_placeholder_svc_t;
  END IF;
END $$;

-- T2 drafts: enum__services_v_blocks_calculator_placeholder_service_type (60)
--         →  enum__services_v_blocks_calculator_placeholder_svc_t         (52)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_calculator_placeholder_service_type')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_calculator_placeholder_svc_t') THEN
    ALTER TYPE public.enum__services_v_blocks_calculator_placeholder_service_type
      RENAME TO enum__services_v_blocks_calculator_placeholder_svc_t;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. CREATE T4_SD ENUM TYPES (new short names)
-- ═══════════════════════════════════════════════════════════════════════════

-- T4_SD published: enum_service_districts_blocks_calculator_placeholder_svc_t (58)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_service_districts_blocks_calculator_placeholder_svc_t') THEN
    CREATE TYPE public.enum_service_districts_blocks_calculator_placeholder_svc_t AS ENUM (
        'spil',
        'musor',
        'krysha',
        'demontazh'
    );
  END IF;
END $$;

-- T4_SD drafts: enum__service_districts_v_blocks_calculator_placeholder_svc_t (61)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__service_districts_v_blocks_calculator_placeholder_svc_t') THEN
    CREATE TYPE public.enum__service_districts_v_blocks_calculator_placeholder_svc_t AS ENUM (
        'spil',
        'musor',
        'krysha',
        'demontazh'
    );
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. CREATE T4_SD PUBLISHED TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.service_districts_blocks_calculator_placeholder (
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

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. CREATE T4_SD DRAFTS TABLE + SEQUENCE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public._service_districts_v_blocks_calculator_placeholder (
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

CREATE SEQUENCE IF NOT EXISTS public._service_districts_v_blocks_calculator_placeholder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_calculator_placeholder_id_seq
    OWNED BY public._service_districts_v_blocks_calculator_placeholder.id;

ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder
    ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_calculator_placeholder_id_seq'::regclass);

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. PRIMARY KEY CONSTRAINTS
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
                 WHERE conname = 'service_districts_blocks_calculator_placeholder_pkey') THEN
    ALTER TABLE ONLY public.service_districts_blocks_calculator_placeholder
      ADD CONSTRAINT service_districts_blocks_calculator_placeholder_pkey PRIMARY KEY (id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
                 WHERE conname = '_service_districts_v_blocks_calculator_placeholder_pkey') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder
      ADD CONSTRAINT _service_districts_v_blocks_calculator_placeholder_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. FOREIGN KEY CONSTRAINTS
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
                 WHERE conname = 'service_districts_blocks_calculator_placeholder_parent_id_fk') THEN
    ALTER TABLE ONLY public.service_districts_blocks_calculator_placeholder
      ADD CONSTRAINT service_districts_blocks_calculator_placeholder_parent_id_fk
      FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint
                 WHERE conname = '_service_districts_v_blocks_calculator_placeholder_parent_id_fk') THEN
    ALTER TABLE ONLY public._service_districts_v_blocks_calculator_placeholder
      ADD CONSTRAINT _service_districts_v_blocks_calculator_placeholder_parent_id_fk
      FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS service_districts_blocks_calculator_placeholder_order_idx
    ON public.service_districts_blocks_calculator_placeholder USING btree (_order);
CREATE INDEX IF NOT EXISTS service_districts_blocks_calculator_placeholder_parent_id_idx
    ON public.service_districts_blocks_calculator_placeholder USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_districts_blocks_calculator_placeholder_path_idx
    ON public.service_districts_blocks_calculator_placeholder USING btree (_path);

CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_calculator_placeholder_order_idx
    ON public._service_districts_v_blocks_calculator_placeholder USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_calculator_placeholder_parent_id_idx
    ON public._service_districts_v_blocks_calculator_placeholder USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_districts_v_blocks_calculator_placeholder_path_idx
    ON public._service_districts_v_blocks_calculator_placeholder USING btree (_path);
