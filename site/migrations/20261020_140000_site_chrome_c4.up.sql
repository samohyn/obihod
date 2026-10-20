-- Шапка и подвал C4 (план 09, этап 2): меню, полоса над шапкой, колонки подвала, режим работы.
-- Только добавляет (expand): старый код эти таблицы не читает.

CREATE TYPE "public"."enum_site_chrome_header_utility_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TABLE "site_chrome_header_nav_children" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL,
	"text" varchar
);
CREATE TABLE "site_chrome_header_nav" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL
);
CREATE TABLE "site_chrome_header_mobile_extra" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL
);
CREATE TABLE "site_chrome_header_utility" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_site_chrome_header_utility_icon" DEFAULT 'pin' NOT NULL,
	"text" varchar NOT NULL
);
CREATE TABLE "site_chrome_footer_nav_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"href" varchar NOT NULL
);
CREATE TABLE "site_chrome_footer_nav" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL
);
ALTER TABLE "site_chrome" ADD COLUMN "contacts_hours" varchar DEFAULT 'Ежедневно 8:00–22:00 · заявки 24/7';
ALTER TABLE "site_chrome_header_nav_children" ADD CONSTRAINT "site_chrome_header_nav_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome_header_nav"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_chrome_header_nav" ADD CONSTRAINT "site_chrome_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_chrome_header_mobile_extra" ADD CONSTRAINT "site_chrome_header_mobile_extra_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_chrome_header_utility" ADD CONSTRAINT "site_chrome_header_utility_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_chrome_footer_nav_items" ADD CONSTRAINT "site_chrome_footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome_footer_nav"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "site_chrome_footer_nav" ADD CONSTRAINT "site_chrome_footer_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_chrome"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "site_chrome_header_nav_children_order_idx" ON "site_chrome_header_nav_children" USING btree ("_order");
CREATE INDEX "site_chrome_header_nav_children_parent_id_idx" ON "site_chrome_header_nav_children" USING btree ("_parent_id");
CREATE INDEX "site_chrome_header_nav_order_idx" ON "site_chrome_header_nav" USING btree ("_order");
CREATE INDEX "site_chrome_header_nav_parent_id_idx" ON "site_chrome_header_nav" USING btree ("_parent_id");
CREATE INDEX "site_chrome_header_mobile_extra_order_idx" ON "site_chrome_header_mobile_extra" USING btree ("_order");
CREATE INDEX "site_chrome_header_mobile_extra_parent_id_idx" ON "site_chrome_header_mobile_extra" USING btree ("_parent_id");
CREATE INDEX "site_chrome_header_utility_order_idx" ON "site_chrome_header_utility" USING btree ("_order");
CREATE INDEX "site_chrome_header_utility_parent_id_idx" ON "site_chrome_header_utility" USING btree ("_parent_id");
CREATE INDEX "site_chrome_footer_nav_items_order_idx" ON "site_chrome_footer_nav_items" USING btree ("_order");
CREATE INDEX "site_chrome_footer_nav_items_parent_id_idx" ON "site_chrome_footer_nav_items" USING btree ("_parent_id");
CREATE INDEX "site_chrome_footer_nav_order_idx" ON "site_chrome_footer_nav" USING btree ("_order");
CREATE INDEX "site_chrome_footer_nav_parent_id_idx" ON "site_chrome_footer_nav" USING btree ("_parent_id");
