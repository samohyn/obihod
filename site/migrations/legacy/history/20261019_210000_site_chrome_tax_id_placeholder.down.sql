-- Возвращает прежний DEFAULT колонки. Значение в строке не восстанавливается — чужой ИНН
-- в данные возвращать не нужно.

BEGIN;

ALTER TABLE "site_chrome" ALTER COLUMN "requisites_tax_id" SET DEFAULT '7847729123';

COMMIT;
