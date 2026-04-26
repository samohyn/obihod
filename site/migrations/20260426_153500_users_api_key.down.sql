-- Down: rollback useAPIKey фичи. Также требует чтобы код был откачен на
-- `auth: true` (без useAPIKey), иначе Payload опять упадёт на missing columns.
--
-- Безопасность down: данные в этих колонках теряются. Если у каких-то юзеров
-- был сгенерирован API key — он перестанет работать. Перед down() оператор
-- должен ротировать все live ключи.

BEGIN;

DROP INDEX IF EXISTS "users_api_key_index_idx";

ALTER TABLE "users"
    DROP COLUMN IF EXISTS "api_key_index",
    DROP COLUMN IF EXISTS "api_key",
    DROP COLUMN IF EXISTS "enable_a_p_i_key";

COMMIT;
