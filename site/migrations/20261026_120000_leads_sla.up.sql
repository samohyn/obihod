-- Панель заявок, этап 5.1 (план 09): срок ответа и итог первого звонка. Expand.
CREATE TYPE "public"."enum_leads_contact_result" AS ENUM('reached', 'no_answer');
ALTER TABLE "company" ADD COLUMN "reply_by_working_hours" boolean DEFAULT true;
ALTER TABLE "leads" ADD COLUMN "reply_due_at" timestamp(3) with time zone;
ALTER TABLE "leads" ADD COLUMN "first_contact_at" timestamp(3) with time zone;
ALTER TABLE "leads" ADD COLUMN "contact_result" "enum_leads_contact_result";
ALTER TABLE "leads" ADD COLUMN "next_action_at" timestamp(3) with time zone;
ALTER TABLE "leads" ADD COLUMN "manager_comment" varchar;
ALTER TABLE "leads" ADD COLUMN "closed_at" timestamp(3) with time zone;
CREATE INDEX "leads_reply_due_at_idx" ON "leads" USING btree ("reply_due_at");
