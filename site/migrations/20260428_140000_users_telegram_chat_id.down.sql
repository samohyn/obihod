-- 20260428_140000_users_telegram_chat_id (rollback)
-- Removes telegramChatId field. Operator должен сделать /start боту заново
-- если когда-нибудь понадобится восстановить chat_id.

ALTER TABLE "users" DROP COLUMN IF EXISTS "telegram_chat_id";
