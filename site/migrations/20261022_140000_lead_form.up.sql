-- Форма заявки (план 09, этапы 2 и 5): «Что нужно сделать», «Адрес или район», согласие на ПДн
-- (время, редакция, отпечаток), фото к заявке — коллекция «Фото заявок». Expand: новые таблица и колонки.
CREATE TABLE "leads_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"lead_photos_id" integer
);
CREATE TABLE "lead_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"thumbnail_u_r_l" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric,
	"focal_x" numeric,
	"focal_y" numeric,
	"sizes_thumb_url" varchar,
	"sizes_thumb_width" numeric,
	"sizes_thumb_height" numeric,
	"sizes_thumb_mime_type" varchar,
	"sizes_thumb_filesize" numeric,
	"sizes_thumb_filename" varchar
);
ALTER TABLE "leads" ADD COLUMN "message" varchar;
ALTER TABLE "leads" ADD COLUMN "address" varchar;
ALTER TABLE "leads" ADD COLUMN "consent_at" timestamp(3) with time zone;
ALTER TABLE "leads" ADD COLUMN "consent_version" varchar;
ALTER TABLE "leads" ADD COLUMN "consent_text_hash" varchar;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_photos_id" integer;
ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_lead_photos_fk" FOREIGN KEY ("lead_photos_id") REFERENCES "public"."lead_photos"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "lead_photos" ADD CONSTRAINT "lead_photos_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
CREATE INDEX "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
CREATE INDEX "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
CREATE INDEX "leads_rels_lead_photos_id_idx" ON "leads_rels" USING btree ("lead_photos_id");
CREATE INDEX "lead_photos_lead_idx" ON "lead_photos" USING btree ("lead_id");
CREATE INDEX "lead_photos_updated_at_idx" ON "lead_photos" USING btree ("updated_at");
CREATE INDEX "lead_photos_created_at_idx" ON "lead_photos" USING btree ("created_at");
CREATE UNIQUE INDEX "lead_photos_filename_idx" ON "lead_photos" USING btree ("filename");
CREATE INDEX "lead_photos_sizes_thumb_sizes_thumb_filename_idx" ON "lead_photos" USING btree ("sizes_thumb_filename");
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_photos_fk" FOREIGN KEY ("lead_photos_id") REFERENCES "public"."lead_photos"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "payload_locked_documents_rels_lead_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_photos_id");
