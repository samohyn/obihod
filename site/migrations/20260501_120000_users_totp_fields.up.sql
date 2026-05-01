-- PANEL-AUTH-2FA — TOTP 2FA fields в users + child table users_recovery_codes.
--
-- Spec: specs/PANEL-AUTH-2FA/sa-panel.md AC-1.
--
-- Backwards compat:
--   - totp_enabled DEFAULT false → existing users + seed admin продолжают
--     логиниться через email+password без второго шага.
--   - totp_secret_enc nullable.
--   - users_recovery_codes — пустая таблица; user заполняет при setup.
--
-- Zero-downtime: ADD COLUMN с DEFAULT false на postgres 16 — fast (instant
-- metadata-only для boolean per Postgres 11+).
--
-- Snake-case naming (to-snake-case@1.0.0):
--   totpEnabled    → totp_enabled
--   totpSecretEnc  → totp_secret_enc
--   recoveryCodes  → recovery_codes  (Payload array → child table users_recovery_codes)
--   consumedAt     → consumed_at
--
-- Idempotent: IF NOT EXISTS защищает от повторного apply.

BEGIN;

ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "totp_enabled" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "totp_secret_enc" varchar;

CREATE TABLE IF NOT EXISTS "users_recovery_codes" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY,
    "hash" varchar NOT NULL,
    "consumed_at" timestamp(3) with time zone
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'users_recovery_codes_parent_id_fk'
    ) THEN
        ALTER TABLE "users_recovery_codes"
            ADD CONSTRAINT "users_recovery_codes_parent_id_fk"
            FOREIGN KEY ("_parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "users_recovery_codes_order_idx" ON "users_recovery_codes" ("_order");
CREATE INDEX IF NOT EXISTS "users_recovery_codes_parent_id_idx" ON "users_recovery_codes" ("_parent_id");

COMMIT;
