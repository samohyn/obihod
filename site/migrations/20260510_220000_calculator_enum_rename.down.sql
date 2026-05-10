-- DOWN migration for 20260510_220000_calculator_enum_rename
--
-- Reverts:
--   1. Drops T4_SD calculator-placeholder published + drafts tables
--      (включая FK / PK / sequence / indexes — CASCADE).
--   2. Drops T4_SD short ENUM types (`enum_service_districts_blocks_…_svc_t`
--      и `enum__service_districts_v_blocks_…_svc_t`).
--   3. Renames T2 ENUM types обратно: `_svc_t` → `_service_type`.
--
-- Sustained ВНИМАНИЕ: до DOWN надо удалить Calculator из
-- ServiceDistricts.blockReferences в коде, иначе Payload будет ожидать
-- T4_SD таблиц которые этот DOWN дропает. Sustained data в T2 services_blocks_
-- calculator_placeholder остаётся целой (ALTER TYPE RENAME — не destructive).

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. DROP T4_SD INDEXES (IF EXISTS — idempotent)
-- ═══════════════════════════════════════════════════════════════════════════

DROP INDEX IF EXISTS public.service_districts_blocks_calculator_placeholder_order_idx;
DROP INDEX IF EXISTS public.service_districts_blocks_calculator_placeholder_parent_id_idx;
DROP INDEX IF EXISTS public.service_districts_blocks_calculator_placeholder_path_idx;
DROP INDEX IF EXISTS public._service_districts_v_blocks_calculator_placeholder_order_idx;
DROP INDEX IF EXISTS public._service_districts_v_blocks_calculator_placeholder_parent_id_idx;
DROP INDEX IF EXISTS public._service_districts_v_blocks_calculator_placeholder_path_idx;

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. DROP T4_SD TABLES (CASCADE drops FK / PK constraints + sequences)
-- ═══════════════════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS public.service_districts_blocks_calculator_placeholder CASCADE;
DROP TABLE IF EXISTS public._service_districts_v_blocks_calculator_placeholder CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. DROP T4_SD ENUM TYPES (no consumers after table drop)
-- ═══════════════════════════════════════════════════════════════════════════

DROP TYPE IF EXISTS public.enum_service_districts_blocks_calculator_placeholder_svc_t;
DROP TYPE IF EXISTS public.enum__service_districts_v_blocks_calculator_placeholder_svc_t;

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. RENAME T2 ENUM TYPES BACK TO ORIGINAL LONG NAMES
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_calculator_placeholder_svc_t')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_services_blocks_calculator_placeholder_service_type') THEN
    ALTER TYPE public.enum_services_blocks_calculator_placeholder_svc_t
      RENAME TO enum_services_blocks_calculator_placeholder_service_type;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_calculator_placeholder_svc_t')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__services_v_blocks_calculator_placeholder_service_type') THEN
    ALTER TYPE public.enum__services_v_blocks_calculator_placeholder_svc_t
      RENAME TO enum__services_v_blocks_calculator_placeholder_service_type;
  END IF;
END $$;
