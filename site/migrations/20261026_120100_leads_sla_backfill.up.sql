-- Заявки до 5.1. Закрытые — время закрытия = последнее изменение, срока ответа нет.
UPDATE "leads" SET "closed_at" = COALESCE("updated_at", "created_at")
 WHERE "closed_at" IS NULL AND "status" IN ('done', 'cancelled', 'spam');
-- С клиентом уже работали (статус не «Новая») — таймер остановлен на последнем изменении.
UPDATE "leads" SET "first_contact_at" = COALESCE("updated_at", "created_at")
 WHERE "first_contact_at" IS NULL AND "closed_at" IS NULL AND "status" <> 'new';
-- Срок — время заявки плюс «Перезвоним за» (без переноса на утро: эти заявки и так давние).
UPDATE "leads" SET "reply_due_at" = "created_at"
   + make_interval(mins => COALESCE((SELECT "callback_minutes"::int FROM "company" LIMIT 1), 10))
 WHERE "reply_due_at" IS NULL AND "closed_at" IS NULL;
