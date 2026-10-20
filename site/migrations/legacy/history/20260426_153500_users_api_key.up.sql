-- US/OBI-XX: enable Payload useAPIKey: true для коллекции users.
--
-- Контекст: 2026-04-26 P0 incident — PR #41 включил `auth: { useAPIKey: true }`
-- БЕЗ explicit migration. На prod schema-push не успел добавить поля до
-- login-handler, /api/users/login/ упал на 500. Revert PR #42.
--
-- Этот PR — второй заход: миграция применяется ДО PM2 restart (порядок step-ов
-- в deploy.yml), поэтому когда новый bundle стартует — поля уже в БД.
--
-- Имена колонок: согласно `to-snake-case@1.0.0` который использует
-- @payloadcms/db-postgres@3.83 для serialize field names в SQL columns:
--   enableAPIKey  → enable_a_p_i_key  (consecutive uppercase split as separate words)
--   apiKey        → api_key
--   apiKeyIndex   → api_key_index
--
-- Source: Payload 3 baseFields/apiKey.ts (3 поля).
-- Index по api_key_index — для performance lookup через REST API key auth.

BEGIN;

ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "enable_a_p_i_key" boolean,
    ADD COLUMN IF NOT EXISTS "api_key" varchar,
    ADD COLUMN IF NOT EXISTS "api_key_index" varchar;

-- Index для O(log n) lookup юзера по API key через
-- Authorization: users API-Key <key>. Payload вычисляет HMAC-SHA256 от ключа
-- и ищет совпадение в api_key_index.
CREATE INDEX IF NOT EXISTS "users_api_key_index_idx" ON "users" ("api_key_index");

COMMIT;
