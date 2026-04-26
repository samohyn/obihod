-- Follow-up: array hasMany snapshot tables для Authors требуют формат
-- (id SERIAL PRIMARY KEY + _uuid varchar) вместо (id varchar PRIMARY KEY).
--
-- Контекст
-- ────────
-- В миграции 20260426_210000 я создал `_authors_v_version_{knows_about,
-- same_as,credentials}` по образцу основных таблиц (id varchar PK).
-- Но Payload для snapshot копий version-history использует другой формат:
--   - id integer SERIAL PRIMARY KEY (auto-incremented per snapshot row)
--   - _uuid varchar — стабильный UUID копия из основной коллекции для трекинга
-- Эталон: `_services_v_version_faq_global` (см. \d вывод).
--
-- Симптом на prod: Authors POST → HTTP 500 — column "_uuid" of relation
-- "_authors_v_version_knows_about" does not exist.
--
-- Применено вручную на prod через ssh+psql (ALTER, без DROP) +
-- INSERT в payload_migrations.

BEGIN;

-- knows_about: id varchar PK → integer SERIAL PK + _uuid + topic nullable
ALTER TABLE "_authors_v_version_knows_about" DROP CONSTRAINT IF EXISTS "_authors_v_version_knows_about_pkey";
ALTER TABLE "_authors_v_version_knows_about" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_knows_about" ADD COLUMN IF NOT EXISTS "id" serial PRIMARY KEY;
ALTER TABLE "_authors_v_version_knows_about" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
ALTER TABLE "_authors_v_version_knows_about" ALTER COLUMN "topic" DROP NOT NULL;

-- same_as
ALTER TABLE "_authors_v_version_same_as" DROP CONSTRAINT IF EXISTS "_authors_v_version_same_as_pkey";
ALTER TABLE "_authors_v_version_same_as" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_same_as" ADD COLUMN IF NOT EXISTS "id" serial PRIMARY KEY;
ALTER TABLE "_authors_v_version_same_as" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
ALTER TABLE "_authors_v_version_same_as" ALTER COLUMN "url" DROP NOT NULL;

-- credentials
ALTER TABLE "_authors_v_version_credentials" DROP CONSTRAINT IF EXISTS "_authors_v_version_credentials_pkey";
ALTER TABLE "_authors_v_version_credentials" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_credentials" ADD COLUMN IF NOT EXISTS "id" serial PRIMARY KEY;
ALTER TABLE "_authors_v_version_credentials" ADD COLUMN IF NOT EXISTS "_uuid" varchar;
ALTER TABLE "_authors_v_version_credentials" ALTER COLUMN "name" DROP NOT NULL;

COMMIT;
