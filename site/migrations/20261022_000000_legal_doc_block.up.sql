-- Блок «Текст документа» (legal-doc) в библиотеке v3: политика и согласие ПДн — документами «Страниц»
-- (план 09, этап 4.4b). Expand: только новые таблицы.
CREATE TABLE "pages_blocks_legal_doc" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar DEFAULT 'Документ',
	"title" varchar,
	"revision" varchar,
	"body" jsonb,
	"block_name" varchar
);
CREATE TABLE "_pages_v_blocks_legal_doc" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar DEFAULT 'Документ',
	"title" varchar,
	"revision" varchar,
	"body" jsonb,
	"_uuid" varchar,
	"block_name" varchar
);
CREATE TABLE "sub_services_blocks_legal_doc" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar DEFAULT 'Документ',
	"title" varchar,
	"revision" varchar,
	"body" jsonb,
	"block_name" varchar
);
CREATE TABLE "_sub_services_v_blocks_legal_doc" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar DEFAULT 'Документ',
	"title" varchar,
	"revision" varchar,
	"body" jsonb,
	"_uuid" varchar,
	"block_name" varchar
);
ALTER TABLE "pages_blocks_legal_doc" ADD CONSTRAINT "pages_blocks_legal_doc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_legal_doc" ADD CONSTRAINT "_pages_v_blocks_legal_doc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "sub_services_blocks_legal_doc" ADD CONSTRAINT "sub_services_blocks_legal_doc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sub_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_sub_services_v_blocks_legal_doc" ADD CONSTRAINT "_sub_services_v_blocks_legal_doc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sub_services_v"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_legal_doc_order_idx" ON "pages_blocks_legal_doc" USING btree ("_order");
CREATE INDEX "pages_blocks_legal_doc_parent_id_idx" ON "pages_blocks_legal_doc" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_legal_doc_path_idx" ON "pages_blocks_legal_doc" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_legal_doc_order_idx" ON "_pages_v_blocks_legal_doc" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_legal_doc_parent_id_idx" ON "_pages_v_blocks_legal_doc" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_legal_doc_path_idx" ON "_pages_v_blocks_legal_doc" USING btree ("_path");
CREATE INDEX "sub_services_blocks_legal_doc_order_idx" ON "sub_services_blocks_legal_doc" USING btree ("_order");
CREATE INDEX "sub_services_blocks_legal_doc_parent_id_idx" ON "sub_services_blocks_legal_doc" USING btree ("_parent_id");
CREATE INDEX "sub_services_blocks_legal_doc_path_idx" ON "sub_services_blocks_legal_doc" USING btree ("_path");
CREATE INDEX "_sub_services_v_blocks_legal_doc_order_idx" ON "_sub_services_v_blocks_legal_doc" USING btree ("_order");
CREATE INDEX "_sub_services_v_blocks_legal_doc_parent_id_idx" ON "_sub_services_v_blocks_legal_doc" USING btree ("_parent_id");
CREATE INDEX "_sub_services_v_blocks_legal_doc_path_idx" ON "_sub_services_v_blocks_legal_doc" USING btree ("_path");
