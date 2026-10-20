-- Payload 3.90 security release — rollback users.resetPasswordRequestedAt.
-- Нужен только при откате на Payload < 3.90. IF EXISTS.

BEGIN;

ALTER TABLE "users"
    DROP COLUMN IF EXISTS "reset_password_requested_at";

COMMIT;
