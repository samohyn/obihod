-- US-0 W3 — down для b2b_audience_uk_tszh_option.
--
-- PostgreSQL ENUM не поддерживает удаление values без drop+recreate всего типа.
-- Per reference_payload_select_postgres_enum.md: orphan label «uk-tszh» в
-- catalog OK — Payload select field безопасно игнорирует unknown values.
--
-- Если требуется hard rollback с удалением value — нужно:
--   1. UPDATE b2b_pages SET audience='uk' WHERE audience='uk-tszh';
--   2. CREATE TYPE enum_b2b_pages_audience_new AS ENUM ('uk','tszh','fm','zastroyshchik','gostorgi');
--   3. ALTER TABLE b2b_pages ALTER COLUMN audience TYPE enum_b2b_pages_audience_new
--        USING audience::text::enum_b2b_pages_audience_new;
--   4. DROP TYPE enum_b2b_pages_audience;
--   5. ALTER TYPE enum_b2b_pages_audience_new RENAME TO enum_b2b_pages_audience;
-- Аналогично для enum__b2b_pages_v_version_audience.

-- no-op
SELECT 1;
