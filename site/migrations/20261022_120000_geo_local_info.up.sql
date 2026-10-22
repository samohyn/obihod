-- «Что важно в районе» — карточки местных сведений в записи «Услуги × район» и заголовок блока
-- в «Шаблонах страниц» (план 09, этап 6). Expand: новые таблицы и колонка со значением по умолчанию.
CREATE TYPE "public"."enum_service_districts_local_info_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__service_districts_v_version_local_info_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TABLE "service_districts_local_info" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_service_districts_local_info_icon" DEFAULT 'pin',
	"title" varchar,
	"text" varchar,
	"meta_label" varchar,
	"meta_value" varchar
);
CREATE TABLE "_service_districts_v_version_local_info" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__service_districts_v_version_local_info_icon" DEFAULT 'pin',
	"title" varchar,
	"text" varchar,
	"meta_label" varchar,
	"meta_value" varchar,
	"_uuid" varchar
);
ALTER TABLE "page_templates" ADD COLUMN "geo_info_title" varchar DEFAULT 'Что важно знать {в районе}' NOT NULL;
ALTER TABLE "service_districts_local_info" ADD CONSTRAINT "service_districts_local_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_districts"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_service_districts_v_version_local_info" ADD CONSTRAINT "_service_districts_v_version_local_info_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_districts_v"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "service_districts_local_info_order_idx" ON "service_districts_local_info" USING btree ("_order");
CREATE INDEX "service_districts_local_info_parent_id_idx" ON "service_districts_local_info" USING btree ("_parent_id");
CREATE INDEX "_service_districts_v_version_local_info_order_idx" ON "_service_districts_v_version_local_info" USING btree ("_order");
CREATE INDEX "_service_districts_v_version_local_info_parent_id_idx" ON "_service_districts_v_version_local_info" USING btree ("_parent_id");
