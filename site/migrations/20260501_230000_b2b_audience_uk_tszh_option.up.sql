-- US-0 W3 — добавление combined option `uk-tszh` в audience ENUM B2BPages.
--
-- Контекст: cw эталон `b2b-segment.json` использует value `uk-tszh` для combined
-- сегмента «УК + ТСЖ» (поскольку в B2B-копирайтинге УК и ТСЖ часто работают по
-- одному офферу — договор + штрафы ГЖИ + сезонность). Раздельные `uk` и `tszh`
-- остаются для специализированных страниц.
--
-- Idempotent: ADD VALUE IF NOT EXISTS — повторный запуск пропускается.
-- ENUM в Postgres не поддерживает удаление values без drop+recreate, поэтому
-- down — no-op (orphan label OK по reference_payload_select_postgres_enum.md).

ALTER TYPE enum_b2b_pages_audience ADD VALUE IF NOT EXISTS 'uk-tszh';
ALTER TYPE enum__b2b_pages_v_version_audience ADD VALUE IF NOT EXISTS 'uk-tszh';
