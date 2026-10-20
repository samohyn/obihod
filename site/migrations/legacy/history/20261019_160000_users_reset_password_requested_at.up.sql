-- Payload 3.90 security release — поле users.resetPasswordRequestedAt.
--
-- Контекст: Payload 3.90.0 (критические security-исправления) добавляет auth-коллекциям поле
-- resetPasswordRequestedAt: сброс пароля снимает блокировку, forgot-password троттлится.
-- Для PostgreSQL нужна колонка. Получено через scripts/schema-diff.ts — из всей разницы конфиг↔БД
-- к обновлению относится только эта команда (остальное — давний дрейф, см. ADR-0016).
--
-- Idempotent: IF NOT EXISTS. Безопасно перезапускать.

BEGIN;

ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;

COMMIT;
