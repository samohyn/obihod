-- 20260428_140000_users_telegram_chat_id — PAN-9 finish
-- Adds telegramChatId field to users for magic-link login (Wave 2.B).

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telegram_chat_id" varchar;
