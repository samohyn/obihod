-- Rollback: вернуть array snapshot tables к формату (id varchar PK)
-- из первоначальной 20260426_210000 миграции.

BEGIN;

ALTER TABLE "_authors_v_version_credentials" DROP COLUMN IF EXISTS "_uuid";
ALTER TABLE "_authors_v_version_credentials" DROP CONSTRAINT IF EXISTS "_authors_v_version_credentials_pkey";
ALTER TABLE "_authors_v_version_credentials" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_credentials" ADD COLUMN "id" varchar PRIMARY KEY;

ALTER TABLE "_authors_v_version_same_as" DROP COLUMN IF EXISTS "_uuid";
ALTER TABLE "_authors_v_version_same_as" DROP CONSTRAINT IF EXISTS "_authors_v_version_same_as_pkey";
ALTER TABLE "_authors_v_version_same_as" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_same_as" ADD COLUMN "id" varchar PRIMARY KEY;

ALTER TABLE "_authors_v_version_knows_about" DROP COLUMN IF EXISTS "_uuid";
ALTER TABLE "_authors_v_version_knows_about" DROP CONSTRAINT IF EXISTS "_authors_v_version_knows_about_pkey";
ALTER TABLE "_authors_v_version_knows_about" DROP COLUMN IF EXISTS "id";
ALTER TABLE "_authors_v_version_knows_about" ADD COLUMN "id" varchar PRIMARY KEY;

COMMIT;
