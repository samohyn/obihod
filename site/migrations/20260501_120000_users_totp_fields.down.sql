-- PANEL-AUTH-2FA rollback. Удаляет TOTP колонки + child table.
-- WARNING: после этого все настроенные 2FA теряются — пользователи должны
-- перевключить 2FA через профиль после следующего forward-apply.

BEGIN;

DROP TABLE IF EXISTS "users_recovery_codes" CASCADE;

ALTER TABLE "users"
    DROP COLUMN IF EXISTS "totp_secret_enc",
    DROP COLUMN IF EXISTS "totp_enabled";

COMMIT;
