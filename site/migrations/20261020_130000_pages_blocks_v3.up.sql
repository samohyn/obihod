-- «Страницы» из блоков v3 + флаг «Иллюстрация» у медиа (план 09, этап 2). Сгенерировано pnpm schema:diff.
CREATE TYPE "public"."enum_pages_blocks_hero_slider_slides_primary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_hero_slider_strip_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_services_tiles_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_about_stats_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_equipment_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_projects_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_video_gallery_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_promotions_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_team_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_calculator_v3_services_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_calculator_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_steps_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_price_tabs_tabs_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_price_tabs_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_photo_cta_primary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_photo_cta_secondary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_reviews_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_documents_items_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_documents_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_b2b_plan_audiences_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_b2b_plan_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_tree_check_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_articles_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_objects_map_legend_color" AS ENUM('primary', 'success', 'muted', 'accent');
CREATE TYPE "public"."enum_pages_blocks_objects_map_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_guarantees_items_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_blocks_guarantees_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_faq_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum_pages_blocks_final_form_channels_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
CREATE TYPE "public"."enum__pages_v_blocks_hero_slider_slides_primary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_hero_slider_strip_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_services_tiles_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_about_stats_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_equipment_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_projects_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_video_gallery_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_promotions_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_team_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_calculator_v3_services_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_calculator_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_steps_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_price_tabs_tabs_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_price_tabs_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_photo_cta_primary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_photo_cta_secondary_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_reviews_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_documents_items_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_documents_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_b2b_plan_audiences_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_b2b_plan_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_tree_check_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_articles_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_objects_map_legend_color" AS ENUM('primary', 'success', 'muted', 'accent');
CREATE TYPE "public"."enum__pages_v_blocks_objects_map_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_guarantees_items_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_blocks_guarantees_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_faq_v3_tone" AS ENUM('default', 'alt', 'green', 'dark');
CREATE TYPE "public"."enum__pages_v_blocks_final_form_channels_icon" AS ENUM('phone', 'arrow', 'camera', 'check', 'checkCircle', 'plus', 'chevron', 'clock', 'file', 'pin', 'shield', 'cash', 'image', 'upload', 'message', 'send', 'building', 'alert', 'stamp', 'list', 'leaf', 'play', 'boomlift', 'brush', 'chipper', 'climber', 'demolition', 'dumpster', 'excavator', 'facade-clean', 'fast-response', 'fixed-price', 'gutter', 'kabling', 'lawn-mower', 'legal-shield', 'prune', 'roof-snow', 'snow-truck', 'spil', 'spray', 'stump', 'valka', 'winter-decor', 'plan');
CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
CREATE TABLE "pages_blocks_hero_slider_slides" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"kicker" varchar,
	"title" varchar,
	"lead" varchar,
	"primary_label" varchar,
	"primary_href" varchar,
	"primary_icon" "enum_pages_blocks_hero_slider_slides_primary_icon" DEFAULT 'camera',
	"secondary_label" varchar,
	"secondary_href" varchar,
	"image_id" integer
);

CREATE TABLE "pages_blocks_hero_slider_strip" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_pages_blocks_hero_slider_strip_icon" DEFAULT 'check',
	"title" varchar,
	"text" varchar
);

CREATE TABLE "pages_blocks_hero_slider" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"anchor" varchar,
	"badge_value" varchar,
	"badge_text" varchar,
	"badge_note" varchar,
	"autoplay_seconds" numeric DEFAULT 0,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_services_tiles_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"service_id" integer,
	"title" varchar,
	"price" varchar,
	"text" varchar,
	"href" varchar,
	"image_id" integer
);

CREATE TABLE "pages_blocks_services_tiles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_services_tiles_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_about_stats_checklist" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_about_stats_stats" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar
);

CREATE TABLE "pages_blocks_about_stats" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_about_stats_tone" DEFAULT 'default',
	"text" varchar,
	"banner_text" varchar,
	"banner_label" varchar,
	"banner_href" varchar DEFAULT '#calc',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_equipment_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"price" varchar,
	"href" varchar,
	"image_id" integer
);

CREATE TABLE "pages_blocks_equipment" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_equipment_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_projects_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"case_id" integer,
	"place" varchar,
	"duration" varchar,
	"title" varchar,
	"sum" varchar,
	"matched" boolean DEFAULT true,
	"before_id" integer,
	"after_id" integer,
	"after_label" varchar
);

CREATE TABLE "pages_blocks_projects" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_projects_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_video_gallery_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"duration" varchar,
	"poster_id" integer,
	"url" varchar
);

CREATE TABLE "pages_blocks_video_gallery" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_video_gallery_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_promotions_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar,
	"dark" boolean,
	"title" varchar,
	"text" varchar,
	"link_label" varchar,
	"link_href" varchar
);

CREATE TABLE "pages_blocks_promotions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_promotions_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_team_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"role" varchar,
	"text" varchar,
	"chip" varchar,
	"photo_id" integer
);

CREATE TABLE "pages_blocks_team" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_team_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_calculator_v3_services_kinds" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"base" numeric,
	"unit" varchar
);

CREATE TABLE "pages_blocks_calculator_v3_services_volumes" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"factor" numeric
);

CREATE TABLE "pages_blocks_calculator_v3_services_zones" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"factor" numeric
);

CREATE TABLE "pages_blocks_calculator_v3_services_included" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_calculator_v3_services" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"key" varchar,
	"label" varchar,
	"icon" "enum_pages_blocks_calculator_v3_services_icon" DEFAULT 'spil',
	"kind_label" varchar DEFAULT 'Способ',
	"volume_label" varchar DEFAULT 'Объём'
);

CREATE TABLE "pages_blocks_calculator_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_calculator_v3_tone" DEFAULT 'default',
	"lead" varchar,
	"cta_label" varchar DEFAULT 'Зафиксировать цену',
	"note" varchar,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_steps_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"time" varchar,
	"title" varchar,
	"text" varchar
);

CREATE TABLE "pages_blocks_steps" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_steps_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_price_tabs_tabs_columns" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_price_tabs_tabs_rows_values" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_price_tabs_tabs_rows" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"note" varchar
);

CREATE TABLE "pages_blocks_price_tabs_tabs_notes" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_price_tabs_tabs" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"icon" "enum_pages_blocks_price_tabs_tabs_icon" DEFAULT 'spil',
	"unit" varchar
);

CREATE TABLE "pages_blocks_price_tabs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_price_tabs_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_photo_cta" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"text" varchar,
	"image_id" integer,
	"primary_label" varchar,
	"primary_href" varchar,
	"primary_icon" "enum_pages_blocks_photo_cta_primary_icon" DEFAULT 'camera',
	"secondary_label" varchar,
	"secondary_href" varchar,
	"secondary_icon" "enum_pages_blocks_photo_cta_secondary_icon" DEFAULT 'camera',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_reviews_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_reviews_v3_tone" DEFAULT 'default',
	"limit" numeric DEFAULT 3,
	"rating_value" varchar,
	"rating_source" varchar DEFAULT 'Яндекс Карты',
	"rating_href" varchar,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_documents_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_pages_blocks_documents_items_icon" DEFAULT 'file',
	"title" varchar,
	"text" varchar,
	"meta_label" varchar,
	"meta_value" varchar
);

CREATE TABLE "pages_blocks_documents" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_documents_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_b2b_plan_kpis" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar
);

CREATE TABLE "pages_blocks_b2b_plan_audiences" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_pages_blocks_b2b_plan_audiences_icon" DEFAULT 'building',
	"title" varchar,
	"text" varchar
);

CREATE TABLE "pages_blocks_b2b_plan" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_b2b_plan_tone" DEFAULT 'dark',
	"text" varchar,
	"primary_label" varchar,
	"primary_href" varchar,
	"secondary_label" varchar,
	"secondary_href" varchar,
	"note_title" varchar,
	"note_text" varchar,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_tree_check_checklist" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_tree_check_consult_points" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_tree_check" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_tree_check_tone" DEFAULT 'default',
	"checklist_title" varchar DEFAULT 'Дерево пора убирать, если:',
	"consult_eyebrow" varchar,
	"consult_title" varchar,
	"consult_text" varchar,
	"consult_cta_label" varchar,
	"consult_cta_href" varchar,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_articles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_articles_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_objects_map_legend" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"label" varchar,
	"count" numeric,
	"color" "enum_pages_blocks_objects_map_legend_color" DEFAULT 'primary'
);

CREATE TABLE "pages_blocks_objects_map_districts" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar
);

CREATE TABLE "pages_blocks_objects_map_zones" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar
);

CREATE TABLE "pages_blocks_objects_map" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_objects_map_tone" DEFAULT 'default',
	"points" jsonb,
	"base_label" varchar,
	"base_angle" numeric,
	"base_km" numeric,
	"block_name" varchar
);

CREATE TABLE "pages_blocks_guarantees_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_pages_blocks_guarantees_items_icon" DEFAULT 'file',
	"title" varchar,
	"text" varchar,
	"condition_label" varchar,
	"condition_value" varchar
);

CREATE TABLE "pages_blocks_guarantees" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_guarantees_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_faq_v3_items" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"question" varchar,
	"answer" varchar
);

CREATE TABLE "pages_blocks_faq_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum_pages_blocks_faq_v3_tone" DEFAULT 'default',
	"block_name" varchar
);

CREATE TABLE "pages_blocks_final_form_channels" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"icon" "enum_pages_blocks_final_form_channels_icon" DEFAULT 'phone',
	"title" varchar,
	"text" varchar,
	"href" varchar
);

CREATE TABLE "pages_blocks_final_form" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar DEFAULT 'zayavka',
	"title" varchar,
	"lead" varchar,
	"background_id" integer,
	"form_title" varchar DEFAULT 'Заявка на смету',
	"source" varchar DEFAULT 'home-final',
	"block_name" varchar
);

CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"meta_title" varchar,
	"meta_description" varchar,
	"og_image_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"_status" "enum_pages_status" DEFAULT 'draft'
);

CREATE TABLE "pages_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"blog_id" integer
);

CREATE TABLE "_pages_v_blocks_hero_slider_slides" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"kicker" varchar,
	"title" varchar,
	"lead" varchar,
	"primary_label" varchar,
	"primary_href" varchar,
	"primary_icon" "enum__pages_v_blocks_hero_slider_slides_primary_icon" DEFAULT 'camera',
	"secondary_label" varchar,
	"secondary_href" varchar,
	"image_id" integer,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_hero_slider_strip" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__pages_v_blocks_hero_slider_strip_icon" DEFAULT 'check',
	"title" varchar,
	"text" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_hero_slider" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"anchor" varchar,
	"badge_value" varchar,
	"badge_text" varchar,
	"badge_note" varchar,
	"autoplay_seconds" numeric DEFAULT 0,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_services_tiles_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"title" varchar,
	"price" varchar,
	"text" varchar,
	"href" varchar,
	"image_id" integer,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_services_tiles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_services_tiles_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_about_stats_checklist" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_about_stats_stats" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_about_stats" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_about_stats_tone" DEFAULT 'default',
	"text" varchar,
	"banner_text" varchar,
	"banner_label" varchar,
	"banner_href" varchar DEFAULT '#calc',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_equipment_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"price" varchar,
	"href" varchar,
	"image_id" integer,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_equipment" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_equipment_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_projects_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"case_id" integer,
	"place" varchar,
	"duration" varchar,
	"title" varchar,
	"sum" varchar,
	"matched" boolean DEFAULT true,
	"before_id" integer,
	"after_id" integer,
	"after_label" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_projects" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_projects_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_video_gallery_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"text" varchar,
	"duration" varchar,
	"poster_id" integer,
	"url" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_video_gallery" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_video_gallery_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_promotions_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"dark" boolean,
	"title" varchar,
	"text" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_promotions" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_promotions_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_team_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar,
	"text" varchar,
	"chip" varchar,
	"photo_id" integer,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_team" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_team_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3_services_kinds" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"base" numeric,
	"unit" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3_services_volumes" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"factor" numeric,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3_services_zones" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"factor" numeric,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3_services_included" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3_services" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"label" varchar,
	"icon" "enum__pages_v_blocks_calculator_v3_services_icon" DEFAULT 'spil',
	"kind_label" varchar DEFAULT 'Способ',
	"volume_label" varchar DEFAULT 'Объём',
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_calculator_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_calculator_v3_tone" DEFAULT 'default',
	"lead" varchar,
	"cta_label" varchar DEFAULT 'Зафиксировать цену',
	"note" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_steps_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"time" varchar,
	"title" varchar,
	"text" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_steps" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_steps_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs_tabs_columns" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs_tabs_rows_values" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs_tabs_rows" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"note" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs_tabs_notes" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs_tabs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"icon" "enum__pages_v_blocks_price_tabs_tabs_icon" DEFAULT 'spil',
	"unit" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_price_tabs" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_price_tabs_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_photo_cta" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"text" varchar,
	"image_id" integer,
	"primary_label" varchar,
	"primary_href" varchar,
	"primary_icon" "enum__pages_v_blocks_photo_cta_primary_icon" DEFAULT 'camera',
	"secondary_label" varchar,
	"secondary_href" varchar,
	"secondary_icon" "enum__pages_v_blocks_photo_cta_secondary_icon" DEFAULT 'camera',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_reviews_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_reviews_v3_tone" DEFAULT 'default',
	"limit" numeric DEFAULT 3,
	"rating_value" varchar,
	"rating_source" varchar DEFAULT 'Яндекс Карты',
	"rating_href" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_documents_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__pages_v_blocks_documents_items_icon" DEFAULT 'file',
	"title" varchar,
	"text" varchar,
	"meta_label" varchar,
	"meta_value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_documents" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_documents_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_b2b_plan_kpis" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_b2b_plan_audiences" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__pages_v_blocks_b2b_plan_audiences_icon" DEFAULT 'building',
	"title" varchar,
	"text" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_b2b_plan" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_b2b_plan_tone" DEFAULT 'dark',
	"text" varchar,
	"primary_label" varchar,
	"primary_href" varchar,
	"secondary_label" varchar,
	"secondary_href" varchar,
	"note_title" varchar,
	"note_text" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_tree_check_checklist" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_tree_check_consult_points" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_tree_check" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_tree_check_tone" DEFAULT 'default',
	"checklist_title" varchar DEFAULT 'Дерево пора убирать, если:',
	"consult_eyebrow" varchar,
	"consult_title" varchar,
	"consult_text" varchar,
	"consult_cta_label" varchar,
	"consult_cta_href" varchar,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_articles" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_articles_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_objects_map_legend" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar,
	"count" numeric,
	"color" "enum__pages_v_blocks_objects_map_legend_color" DEFAULT 'primary',
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_objects_map_districts" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_objects_map_zones" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar,
	"label" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_objects_map" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_objects_map_tone" DEFAULT 'default',
	"points" jsonb,
	"base_label" varchar,
	"base_angle" numeric,
	"base_km" numeric,
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_guarantees_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__pages_v_blocks_guarantees_items_icon" DEFAULT 'file',
	"title" varchar,
	"text" varchar,
	"condition_label" varchar,
	"condition_value" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_guarantees" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_guarantees_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_faq_v3_items" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"question" varchar,
	"answer" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_faq_v3" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar,
	"title" varchar,
	"link_label" varchar,
	"link_href" varchar,
	"tone" "enum__pages_v_blocks_faq_v3_tone" DEFAULT 'default',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v_blocks_final_form_channels" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"icon" "enum__pages_v_blocks_final_form_channels_icon" DEFAULT 'phone',
	"title" varchar,
	"text" varchar,
	"href" varchar,
	"_uuid" varchar
);

CREATE TABLE "_pages_v_blocks_final_form" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true,
	"eyebrow" varchar,
	"anchor" varchar DEFAULT 'zayavka',
	"title" varchar,
	"lead" varchar,
	"background_id" integer,
	"form_title" varchar DEFAULT 'Заявка на смету',
	"source" varchar DEFAULT 'home-final',
	"_uuid" varchar,
	"block_name" varchar
);

CREATE TABLE "_pages_v" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"version_title" varchar,
	"version_slug" varchar,
	"version_meta_title" varchar,
	"version_meta_description" varchar,
	"version_og_image_id" integer,
	"version_updated_at" timestamp(3) with time zone,
	"version_created_at" timestamp(3) with time zone,
	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"latest" boolean,
	"autosave" boolean
);

CREATE TABLE "_pages_v_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"blog_id" integer
);

ALTER TABLE "media" ADD COLUMN "illustration" boolean DEFAULT false;
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_hero_slider_slides" ADD CONSTRAINT "pages_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_hero_slider_strip" ADD CONSTRAINT "pages_blocks_hero_slider_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_hero_slider" ADD CONSTRAINT "pages_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_services_tiles_items" ADD CONSTRAINT "pages_blocks_services_tiles_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_services_tiles_items" ADD CONSTRAINT "pages_blocks_services_tiles_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_services_tiles_items" ADD CONSTRAINT "pages_blocks_services_tiles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_tiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_services_tiles" ADD CONSTRAINT "pages_blocks_services_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_about_stats_checklist" ADD CONSTRAINT "pages_blocks_about_stats_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_stats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_about_stats_stats" ADD CONSTRAINT "pages_blocks_about_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_stats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_about_stats" ADD CONSTRAINT "pages_blocks_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_equipment_items" ADD CONSTRAINT "pages_blocks_equipment_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_equipment_items" ADD CONSTRAINT "pages_blocks_equipment_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_equipment"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_equipment" ADD CONSTRAINT "pages_blocks_equipment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_projects_items" ADD CONSTRAINT "pages_blocks_projects_items_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_projects_items" ADD CONSTRAINT "pages_blocks_projects_items_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_projects_items" ADD CONSTRAINT "pages_blocks_projects_items_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_projects_items" ADD CONSTRAINT "pages_blocks_projects_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_projects" ADD CONSTRAINT "pages_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_video_gallery_items" ADD CONSTRAINT "pages_blocks_video_gallery_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_video_gallery_items" ADD CONSTRAINT "pages_blocks_video_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video_gallery"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_video_gallery" ADD CONSTRAINT "pages_blocks_video_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_promotions_items" ADD CONSTRAINT "pages_blocks_promotions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promotions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_promotions" ADD CONSTRAINT "pages_blocks_promotions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_team_items" ADD CONSTRAINT "pages_blocks_team_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_team_items" ADD CONSTRAINT "pages_blocks_team_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3_services_kinds" ADD CONSTRAINT "pages_blocks_calculator_v3_services_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3_services_volumes" ADD CONSTRAINT "pages_blocks_calculator_v3_services_volumes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3_services_zones" ADD CONSTRAINT "pages_blocks_calculator_v3_services_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3_services_included" ADD CONSTRAINT "pages_blocks_calculator_v3_services_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3_services" ADD CONSTRAINT "pages_blocks_calculator_v3_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_calculator_v3"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_calculator_v3" ADD CONSTRAINT "pages_blocks_calculator_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_steps_items" ADD CONSTRAINT "pages_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_steps" ADD CONSTRAINT "pages_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs_tabs_columns" ADD CONSTRAINT "pages_blocks_price_tabs_tabs_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs_tabs_rows_values" ADD CONSTRAINT "pages_blocks_price_tabs_tabs_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_tabs_tabs_rows"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs_tabs_rows" ADD CONSTRAINT "pages_blocks_price_tabs_tabs_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs_tabs_notes" ADD CONSTRAINT "pages_blocks_price_tabs_tabs_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs_tabs" ADD CONSTRAINT "pages_blocks_price_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_price_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_price_tabs" ADD CONSTRAINT "pages_blocks_price_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_photo_cta" ADD CONSTRAINT "pages_blocks_photo_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_photo_cta" ADD CONSTRAINT "pages_blocks_photo_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_reviews_v3" ADD CONSTRAINT "pages_blocks_reviews_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_documents_items" ADD CONSTRAINT "pages_blocks_documents_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_documents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_documents" ADD CONSTRAINT "pages_blocks_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_b2b_plan_kpis" ADD CONSTRAINT "pages_blocks_b2b_plan_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b2b_plan"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_b2b_plan_audiences" ADD CONSTRAINT "pages_blocks_b2b_plan_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b2b_plan"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_b2b_plan" ADD CONSTRAINT "pages_blocks_b2b_plan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_tree_check_checklist" ADD CONSTRAINT "pages_blocks_tree_check_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tree_check"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_tree_check_consult_points" ADD CONSTRAINT "pages_blocks_tree_check_consult_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tree_check"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_tree_check" ADD CONSTRAINT "pages_blocks_tree_check_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_articles" ADD CONSTRAINT "pages_blocks_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_objects_map_legend" ADD CONSTRAINT "pages_blocks_objects_map_legend_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_objects_map_districts" ADD CONSTRAINT "pages_blocks_objects_map_districts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_objects_map_zones" ADD CONSTRAINT "pages_blocks_objects_map_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_objects_map" ADD CONSTRAINT "pages_blocks_objects_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_guarantees_items" ADD CONSTRAINT "pages_blocks_guarantees_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_guarantees"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_guarantees" ADD CONSTRAINT "pages_blocks_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_faq_v3_items" ADD CONSTRAINT "pages_blocks_faq_v3_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_v3"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_faq_v3" ADD CONSTRAINT "pages_blocks_faq_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_final_form_channels" ADD CONSTRAINT "pages_blocks_final_form_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_final_form"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_blocks_final_form" ADD CONSTRAINT "pages_blocks_final_form_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_blocks_final_form" ADD CONSTRAINT "pages_blocks_final_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_hero_slider_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_hero_slider_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_hero_slider_strip" ADD CONSTRAINT "_pages_v_blocks_hero_slider_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_hero_slider" ADD CONSTRAINT "_pages_v_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_services_tiles_items" ADD CONSTRAINT "_pages_v_blocks_services_tiles_items_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_services_tiles_items" ADD CONSTRAINT "_pages_v_blocks_services_tiles_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_services_tiles_items" ADD CONSTRAINT "_pages_v_blocks_services_tiles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_tiles"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_services_tiles" ADD CONSTRAINT "_pages_v_blocks_services_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_about_stats_checklist" ADD CONSTRAINT "_pages_v_blocks_about_stats_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_stats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_about_stats_stats" ADD CONSTRAINT "_pages_v_blocks_about_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_stats"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_about_stats" ADD CONSTRAINT "_pages_v_blocks_about_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_equipment_items" ADD CONSTRAINT "_pages_v_blocks_equipment_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_equipment_items" ADD CONSTRAINT "_pages_v_blocks_equipment_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_equipment"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_equipment" ADD CONSTRAINT "_pages_v_blocks_equipment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_projects_items" ADD CONSTRAINT "_pages_v_blocks_projects_items_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_projects_items" ADD CONSTRAINT "_pages_v_blocks_projects_items_before_id_media_id_fk" FOREIGN KEY ("before_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_projects_items" ADD CONSTRAINT "_pages_v_blocks_projects_items_after_id_media_id_fk" FOREIGN KEY ("after_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_projects_items" ADD CONSTRAINT "_pages_v_blocks_projects_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_projects" ADD CONSTRAINT "_pages_v_blocks_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_video_gallery_items" ADD CONSTRAINT "_pages_v_blocks_video_gallery_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_video_gallery_items" ADD CONSTRAINT "_pages_v_blocks_video_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video_gallery"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_video_gallery" ADD CONSTRAINT "_pages_v_blocks_video_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_promotions_items" ADD CONSTRAINT "_pages_v_blocks_promotions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promotions"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_promotions" ADD CONSTRAINT "_pages_v_blocks_promotions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_team_items" ADD CONSTRAINT "_pages_v_blocks_team_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_team_items" ADD CONSTRAINT "_pages_v_blocks_team_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3_services_kinds" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_services_kinds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3_services_volumes" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_services_volumes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3_services_zones" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_services_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3_services_included" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_services_included_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calculator_v3_services"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3_services" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_calculator_v3"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_calculator_v3" ADD CONSTRAINT "_pages_v_blocks_calculator_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_steps_items" ADD CONSTRAINT "_pages_v_blocks_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_steps"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_steps" ADD CONSTRAINT "_pages_v_blocks_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs_tabs_columns" ADD CONSTRAINT "_pages_v_blocks_price_tabs_tabs_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs_tabs_rows_values" ADD CONSTRAINT "_pages_v_blocks_price_tabs_tabs_rows_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_tabs_tabs_rows"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs_tabs_rows" ADD CONSTRAINT "_pages_v_blocks_price_tabs_tabs_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs_tabs_notes" ADD CONSTRAINT "_pages_v_blocks_price_tabs_tabs_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_tabs_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_price_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_price_tabs"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_price_tabs" ADD CONSTRAINT "_pages_v_blocks_price_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_photo_cta" ADD CONSTRAINT "_pages_v_blocks_photo_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_photo_cta" ADD CONSTRAINT "_pages_v_blocks_photo_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_reviews_v3" ADD CONSTRAINT "_pages_v_blocks_reviews_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_documents_items" ADD CONSTRAINT "_pages_v_blocks_documents_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_documents"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_documents" ADD CONSTRAINT "_pages_v_blocks_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_b2b_plan_kpis" ADD CONSTRAINT "_pages_v_blocks_b2b_plan_kpis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b2b_plan"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_b2b_plan_audiences" ADD CONSTRAINT "_pages_v_blocks_b2b_plan_audiences_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b2b_plan"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_b2b_plan" ADD CONSTRAINT "_pages_v_blocks_b2b_plan_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_tree_check_checklist" ADD CONSTRAINT "_pages_v_blocks_tree_check_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tree_check"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_tree_check_consult_points" ADD CONSTRAINT "_pages_v_blocks_tree_check_consult_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tree_check"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_tree_check" ADD CONSTRAINT "_pages_v_blocks_tree_check_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_articles" ADD CONSTRAINT "_pages_v_blocks_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_objects_map_legend" ADD CONSTRAINT "_pages_v_blocks_objects_map_legend_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_objects_map_districts" ADD CONSTRAINT "_pages_v_blocks_objects_map_districts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_objects_map_zones" ADD CONSTRAINT "_pages_v_blocks_objects_map_zones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_objects_map"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_objects_map" ADD CONSTRAINT "_pages_v_blocks_objects_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_guarantees_items" ADD CONSTRAINT "_pages_v_blocks_guarantees_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_guarantees"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_guarantees" ADD CONSTRAINT "_pages_v_blocks_guarantees_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_faq_v3_items" ADD CONSTRAINT "_pages_v_blocks_faq_v3_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_v3"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_faq_v3" ADD CONSTRAINT "_pages_v_blocks_faq_v3_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_final_form_channels" ADD CONSTRAINT "_pages_v_blocks_final_form_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_final_form"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_final_form" ADD CONSTRAINT "_pages_v_blocks_final_form_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_blocks_final_form" ADD CONSTRAINT "_pages_v_blocks_final_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "pages_blocks_hero_slider_slides_order_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_order");
CREATE INDEX "pages_blocks_hero_slider_slides_parent_id_idx" ON "pages_blocks_hero_slider_slides" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_hero_slider_slides_image_idx" ON "pages_blocks_hero_slider_slides" USING btree ("image_id");
CREATE INDEX "pages_blocks_hero_slider_strip_order_idx" ON "pages_blocks_hero_slider_strip" USING btree ("_order");
CREATE INDEX "pages_blocks_hero_slider_strip_parent_id_idx" ON "pages_blocks_hero_slider_strip" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_hero_slider_order_idx" ON "pages_blocks_hero_slider" USING btree ("_order");
CREATE INDEX "pages_blocks_hero_slider_parent_id_idx" ON "pages_blocks_hero_slider" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_hero_slider_path_idx" ON "pages_blocks_hero_slider" USING btree ("_path");
CREATE INDEX "pages_blocks_services_tiles_items_order_idx" ON "pages_blocks_services_tiles_items" USING btree ("_order");
CREATE INDEX "pages_blocks_services_tiles_items_parent_id_idx" ON "pages_blocks_services_tiles_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_services_tiles_items_service_idx" ON "pages_blocks_services_tiles_items" USING btree ("service_id");
CREATE INDEX "pages_blocks_services_tiles_items_image_idx" ON "pages_blocks_services_tiles_items" USING btree ("image_id");
CREATE INDEX "pages_blocks_services_tiles_order_idx" ON "pages_blocks_services_tiles" USING btree ("_order");
CREATE INDEX "pages_blocks_services_tiles_parent_id_idx" ON "pages_blocks_services_tiles" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_services_tiles_path_idx" ON "pages_blocks_services_tiles" USING btree ("_path");
CREATE INDEX "pages_blocks_about_stats_checklist_order_idx" ON "pages_blocks_about_stats_checklist" USING btree ("_order");
CREATE INDEX "pages_blocks_about_stats_checklist_parent_id_idx" ON "pages_blocks_about_stats_checklist" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_about_stats_stats_order_idx" ON "pages_blocks_about_stats_stats" USING btree ("_order");
CREATE INDEX "pages_blocks_about_stats_stats_parent_id_idx" ON "pages_blocks_about_stats_stats" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_about_stats_order_idx" ON "pages_blocks_about_stats" USING btree ("_order");
CREATE INDEX "pages_blocks_about_stats_parent_id_idx" ON "pages_blocks_about_stats" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_about_stats_path_idx" ON "pages_blocks_about_stats" USING btree ("_path");
CREATE INDEX "pages_blocks_equipment_items_order_idx" ON "pages_blocks_equipment_items" USING btree ("_order");
CREATE INDEX "pages_blocks_equipment_items_parent_id_idx" ON "pages_blocks_equipment_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_equipment_items_image_idx" ON "pages_blocks_equipment_items" USING btree ("image_id");
CREATE INDEX "pages_blocks_equipment_order_idx" ON "pages_blocks_equipment" USING btree ("_order");
CREATE INDEX "pages_blocks_equipment_parent_id_idx" ON "pages_blocks_equipment" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_equipment_path_idx" ON "pages_blocks_equipment" USING btree ("_path");
CREATE INDEX "pages_blocks_projects_items_order_idx" ON "pages_blocks_projects_items" USING btree ("_order");
CREATE INDEX "pages_blocks_projects_items_parent_id_idx" ON "pages_blocks_projects_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_projects_items_case_idx" ON "pages_blocks_projects_items" USING btree ("case_id");
CREATE INDEX "pages_blocks_projects_items_before_idx" ON "pages_blocks_projects_items" USING btree ("before_id");
CREATE INDEX "pages_blocks_projects_items_after_idx" ON "pages_blocks_projects_items" USING btree ("after_id");
CREATE INDEX "pages_blocks_projects_order_idx" ON "pages_blocks_projects" USING btree ("_order");
CREATE INDEX "pages_blocks_projects_parent_id_idx" ON "pages_blocks_projects" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_projects_path_idx" ON "pages_blocks_projects" USING btree ("_path");
CREATE INDEX "pages_blocks_video_gallery_items_order_idx" ON "pages_blocks_video_gallery_items" USING btree ("_order");
CREATE INDEX "pages_blocks_video_gallery_items_parent_id_idx" ON "pages_blocks_video_gallery_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_video_gallery_items_poster_idx" ON "pages_blocks_video_gallery_items" USING btree ("poster_id");
CREATE INDEX "pages_blocks_video_gallery_order_idx" ON "pages_blocks_video_gallery" USING btree ("_order");
CREATE INDEX "pages_blocks_video_gallery_parent_id_idx" ON "pages_blocks_video_gallery" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_video_gallery_path_idx" ON "pages_blocks_video_gallery" USING btree ("_path");
CREATE INDEX "pages_blocks_promotions_items_order_idx" ON "pages_blocks_promotions_items" USING btree ("_order");
CREATE INDEX "pages_blocks_promotions_items_parent_id_idx" ON "pages_blocks_promotions_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_promotions_order_idx" ON "pages_blocks_promotions" USING btree ("_order");
CREATE INDEX "pages_blocks_promotions_parent_id_idx" ON "pages_blocks_promotions" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_promotions_path_idx" ON "pages_blocks_promotions" USING btree ("_path");
CREATE INDEX "pages_blocks_team_items_order_idx" ON "pages_blocks_team_items" USING btree ("_order");
CREATE INDEX "pages_blocks_team_items_parent_id_idx" ON "pages_blocks_team_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_team_items_photo_idx" ON "pages_blocks_team_items" USING btree ("photo_id");
CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
CREATE INDEX "pages_blocks_calculator_v3_services_kinds_order_idx" ON "pages_blocks_calculator_v3_services_kinds" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_services_kinds_parent_id_idx" ON "pages_blocks_calculator_v3_services_kinds" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_services_volumes_order_idx" ON "pages_blocks_calculator_v3_services_volumes" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_services_volumes_parent_id_idx" ON "pages_blocks_calculator_v3_services_volumes" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_services_zones_order_idx" ON "pages_blocks_calculator_v3_services_zones" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_services_zones_parent_id_idx" ON "pages_blocks_calculator_v3_services_zones" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_services_included_order_idx" ON "pages_blocks_calculator_v3_services_included" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_services_included_parent_id_idx" ON "pages_blocks_calculator_v3_services_included" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_services_order_idx" ON "pages_blocks_calculator_v3_services" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_services_parent_id_idx" ON "pages_blocks_calculator_v3_services" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_order_idx" ON "pages_blocks_calculator_v3" USING btree ("_order");
CREATE INDEX "pages_blocks_calculator_v3_parent_id_idx" ON "pages_blocks_calculator_v3" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_calculator_v3_path_idx" ON "pages_blocks_calculator_v3" USING btree ("_path");
CREATE INDEX "pages_blocks_steps_items_order_idx" ON "pages_blocks_steps_items" USING btree ("_order");
CREATE INDEX "pages_blocks_steps_items_parent_id_idx" ON "pages_blocks_steps_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_steps_order_idx" ON "pages_blocks_steps" USING btree ("_order");
CREATE INDEX "pages_blocks_steps_parent_id_idx" ON "pages_blocks_steps" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_steps_path_idx" ON "pages_blocks_steps" USING btree ("_path");
CREATE INDEX "pages_blocks_price_tabs_tabs_columns_order_idx" ON "pages_blocks_price_tabs_tabs_columns" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_tabs_columns_parent_id_idx" ON "pages_blocks_price_tabs_tabs_columns" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_tabs_rows_values_order_idx" ON "pages_blocks_price_tabs_tabs_rows_values" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_tabs_rows_values_parent_id_idx" ON "pages_blocks_price_tabs_tabs_rows_values" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_tabs_rows_order_idx" ON "pages_blocks_price_tabs_tabs_rows" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_tabs_rows_parent_id_idx" ON "pages_blocks_price_tabs_tabs_rows" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_tabs_notes_order_idx" ON "pages_blocks_price_tabs_tabs_notes" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_tabs_notes_parent_id_idx" ON "pages_blocks_price_tabs_tabs_notes" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_tabs_order_idx" ON "pages_blocks_price_tabs_tabs" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_tabs_parent_id_idx" ON "pages_blocks_price_tabs_tabs" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_order_idx" ON "pages_blocks_price_tabs" USING btree ("_order");
CREATE INDEX "pages_blocks_price_tabs_parent_id_idx" ON "pages_blocks_price_tabs" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_price_tabs_path_idx" ON "pages_blocks_price_tabs" USING btree ("_path");
CREATE INDEX "pages_blocks_photo_cta_order_idx" ON "pages_blocks_photo_cta" USING btree ("_order");
CREATE INDEX "pages_blocks_photo_cta_parent_id_idx" ON "pages_blocks_photo_cta" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_photo_cta_path_idx" ON "pages_blocks_photo_cta" USING btree ("_path");
CREATE INDEX "pages_blocks_photo_cta_image_idx" ON "pages_blocks_photo_cta" USING btree ("image_id");
CREATE INDEX "pages_blocks_reviews_v3_order_idx" ON "pages_blocks_reviews_v3" USING btree ("_order");
CREATE INDEX "pages_blocks_reviews_v3_parent_id_idx" ON "pages_blocks_reviews_v3" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_reviews_v3_path_idx" ON "pages_blocks_reviews_v3" USING btree ("_path");
CREATE INDEX "pages_blocks_documents_items_order_idx" ON "pages_blocks_documents_items" USING btree ("_order");
CREATE INDEX "pages_blocks_documents_items_parent_id_idx" ON "pages_blocks_documents_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_documents_order_idx" ON "pages_blocks_documents" USING btree ("_order");
CREATE INDEX "pages_blocks_documents_parent_id_idx" ON "pages_blocks_documents" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_documents_path_idx" ON "pages_blocks_documents" USING btree ("_path");
CREATE INDEX "pages_blocks_b2b_plan_kpis_order_idx" ON "pages_blocks_b2b_plan_kpis" USING btree ("_order");
CREATE INDEX "pages_blocks_b2b_plan_kpis_parent_id_idx" ON "pages_blocks_b2b_plan_kpis" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_b2b_plan_audiences_order_idx" ON "pages_blocks_b2b_plan_audiences" USING btree ("_order");
CREATE INDEX "pages_blocks_b2b_plan_audiences_parent_id_idx" ON "pages_blocks_b2b_plan_audiences" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_b2b_plan_order_idx" ON "pages_blocks_b2b_plan" USING btree ("_order");
CREATE INDEX "pages_blocks_b2b_plan_parent_id_idx" ON "pages_blocks_b2b_plan" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_b2b_plan_path_idx" ON "pages_blocks_b2b_plan" USING btree ("_path");
CREATE INDEX "pages_blocks_tree_check_checklist_order_idx" ON "pages_blocks_tree_check_checklist" USING btree ("_order");
CREATE INDEX "pages_blocks_tree_check_checklist_parent_id_idx" ON "pages_blocks_tree_check_checklist" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_tree_check_consult_points_order_idx" ON "pages_blocks_tree_check_consult_points" USING btree ("_order");
CREATE INDEX "pages_blocks_tree_check_consult_points_parent_id_idx" ON "pages_blocks_tree_check_consult_points" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_tree_check_order_idx" ON "pages_blocks_tree_check" USING btree ("_order");
CREATE INDEX "pages_blocks_tree_check_parent_id_idx" ON "pages_blocks_tree_check" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_tree_check_path_idx" ON "pages_blocks_tree_check" USING btree ("_path");
CREATE INDEX "pages_blocks_articles_order_idx" ON "pages_blocks_articles" USING btree ("_order");
CREATE INDEX "pages_blocks_articles_parent_id_idx" ON "pages_blocks_articles" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_articles_path_idx" ON "pages_blocks_articles" USING btree ("_path");
CREATE INDEX "pages_blocks_objects_map_legend_order_idx" ON "pages_blocks_objects_map_legend" USING btree ("_order");
CREATE INDEX "pages_blocks_objects_map_legend_parent_id_idx" ON "pages_blocks_objects_map_legend" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_objects_map_districts_order_idx" ON "pages_blocks_objects_map_districts" USING btree ("_order");
CREATE INDEX "pages_blocks_objects_map_districts_parent_id_idx" ON "pages_blocks_objects_map_districts" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_objects_map_zones_order_idx" ON "pages_blocks_objects_map_zones" USING btree ("_order");
CREATE INDEX "pages_blocks_objects_map_zones_parent_id_idx" ON "pages_blocks_objects_map_zones" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_objects_map_order_idx" ON "pages_blocks_objects_map" USING btree ("_order");
CREATE INDEX "pages_blocks_objects_map_parent_id_idx" ON "pages_blocks_objects_map" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_objects_map_path_idx" ON "pages_blocks_objects_map" USING btree ("_path");
CREATE INDEX "pages_blocks_guarantees_items_order_idx" ON "pages_blocks_guarantees_items" USING btree ("_order");
CREATE INDEX "pages_blocks_guarantees_items_parent_id_idx" ON "pages_blocks_guarantees_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_guarantees_order_idx" ON "pages_blocks_guarantees" USING btree ("_order");
CREATE INDEX "pages_blocks_guarantees_parent_id_idx" ON "pages_blocks_guarantees" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_guarantees_path_idx" ON "pages_blocks_guarantees" USING btree ("_path");
CREATE INDEX "pages_blocks_faq_v3_items_order_idx" ON "pages_blocks_faq_v3_items" USING btree ("_order");
CREATE INDEX "pages_blocks_faq_v3_items_parent_id_idx" ON "pages_blocks_faq_v3_items" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_faq_v3_order_idx" ON "pages_blocks_faq_v3" USING btree ("_order");
CREATE INDEX "pages_blocks_faq_v3_parent_id_idx" ON "pages_blocks_faq_v3" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_faq_v3_path_idx" ON "pages_blocks_faq_v3" USING btree ("_path");
CREATE INDEX "pages_blocks_final_form_channels_order_idx" ON "pages_blocks_final_form_channels" USING btree ("_order");
CREATE INDEX "pages_blocks_final_form_channels_parent_id_idx" ON "pages_blocks_final_form_channels" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_final_form_order_idx" ON "pages_blocks_final_form" USING btree ("_order");
CREATE INDEX "pages_blocks_final_form_parent_id_idx" ON "pages_blocks_final_form" USING btree ("_parent_id");
CREATE INDEX "pages_blocks_final_form_path_idx" ON "pages_blocks_final_form" USING btree ("_path");
CREATE INDEX "pages_blocks_final_form_background_idx" ON "pages_blocks_final_form" USING btree ("background_id");
CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
CREATE INDEX "pages_og_image_idx" ON "pages" USING btree ("og_image_id");
CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
CREATE INDEX "pages_rels_blog_id_idx" ON "pages_rels" USING btree ("blog_id");
CREATE INDEX "_pages_v_blocks_hero_slider_slides_order_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_hero_slider_slides_parent_id_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_hero_slider_slides_image_idx" ON "_pages_v_blocks_hero_slider_slides" USING btree ("image_id");
CREATE INDEX "_pages_v_blocks_hero_slider_strip_order_idx" ON "_pages_v_blocks_hero_slider_strip" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_hero_slider_strip_parent_id_idx" ON "_pages_v_blocks_hero_slider_strip" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_hero_slider_order_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_hero_slider_parent_id_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_hero_slider_path_idx" ON "_pages_v_blocks_hero_slider" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_services_tiles_items_order_idx" ON "_pages_v_blocks_services_tiles_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_services_tiles_items_parent_id_idx" ON "_pages_v_blocks_services_tiles_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_services_tiles_items_service_idx" ON "_pages_v_blocks_services_tiles_items" USING btree ("service_id");
CREATE INDEX "_pages_v_blocks_services_tiles_items_image_idx" ON "_pages_v_blocks_services_tiles_items" USING btree ("image_id");
CREATE INDEX "_pages_v_blocks_services_tiles_order_idx" ON "_pages_v_blocks_services_tiles" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_services_tiles_parent_id_idx" ON "_pages_v_blocks_services_tiles" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_services_tiles_path_idx" ON "_pages_v_blocks_services_tiles" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_about_stats_checklist_order_idx" ON "_pages_v_blocks_about_stats_checklist" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_about_stats_checklist_parent_id_idx" ON "_pages_v_blocks_about_stats_checklist" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_about_stats_stats_order_idx" ON "_pages_v_blocks_about_stats_stats" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_about_stats_stats_parent_id_idx" ON "_pages_v_blocks_about_stats_stats" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_about_stats_order_idx" ON "_pages_v_blocks_about_stats" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_about_stats_parent_id_idx" ON "_pages_v_blocks_about_stats" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_about_stats_path_idx" ON "_pages_v_blocks_about_stats" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_equipment_items_order_idx" ON "_pages_v_blocks_equipment_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_equipment_items_parent_id_idx" ON "_pages_v_blocks_equipment_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_equipment_items_image_idx" ON "_pages_v_blocks_equipment_items" USING btree ("image_id");
CREATE INDEX "_pages_v_blocks_equipment_order_idx" ON "_pages_v_blocks_equipment" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_equipment_parent_id_idx" ON "_pages_v_blocks_equipment" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_equipment_path_idx" ON "_pages_v_blocks_equipment" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_projects_items_order_idx" ON "_pages_v_blocks_projects_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_projects_items_parent_id_idx" ON "_pages_v_blocks_projects_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_projects_items_case_idx" ON "_pages_v_blocks_projects_items" USING btree ("case_id");
CREATE INDEX "_pages_v_blocks_projects_items_before_idx" ON "_pages_v_blocks_projects_items" USING btree ("before_id");
CREATE INDEX "_pages_v_blocks_projects_items_after_idx" ON "_pages_v_blocks_projects_items" USING btree ("after_id");
CREATE INDEX "_pages_v_blocks_projects_order_idx" ON "_pages_v_blocks_projects" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_projects_parent_id_idx" ON "_pages_v_blocks_projects" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_projects_path_idx" ON "_pages_v_blocks_projects" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_video_gallery_items_order_idx" ON "_pages_v_blocks_video_gallery_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_video_gallery_items_parent_id_idx" ON "_pages_v_blocks_video_gallery_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_video_gallery_items_poster_idx" ON "_pages_v_blocks_video_gallery_items" USING btree ("poster_id");
CREATE INDEX "_pages_v_blocks_video_gallery_order_idx" ON "_pages_v_blocks_video_gallery" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_video_gallery_parent_id_idx" ON "_pages_v_blocks_video_gallery" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_video_gallery_path_idx" ON "_pages_v_blocks_video_gallery" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_promotions_items_order_idx" ON "_pages_v_blocks_promotions_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_promotions_items_parent_id_idx" ON "_pages_v_blocks_promotions_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_promotions_order_idx" ON "_pages_v_blocks_promotions" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_promotions_parent_id_idx" ON "_pages_v_blocks_promotions" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_promotions_path_idx" ON "_pages_v_blocks_promotions" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_team_items_order_idx" ON "_pages_v_blocks_team_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_team_items_parent_id_idx" ON "_pages_v_blocks_team_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_team_items_photo_idx" ON "_pages_v_blocks_team_items" USING btree ("photo_id");
CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_kinds_order_idx" ON "_pages_v_blocks_calculator_v3_services_kinds" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_kinds_parent_id_idx" ON "_pages_v_blocks_calculator_v3_services_kinds" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_volumes_order_idx" ON "_pages_v_blocks_calculator_v3_services_volumes" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_volumes_parent_id_idx" ON "_pages_v_blocks_calculator_v3_services_volumes" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_zones_order_idx" ON "_pages_v_blocks_calculator_v3_services_zones" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_zones_parent_id_idx" ON "_pages_v_blocks_calculator_v3_services_zones" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_included_order_idx" ON "_pages_v_blocks_calculator_v3_services_included" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_included_parent_id_idx" ON "_pages_v_blocks_calculator_v3_services_included" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_order_idx" ON "_pages_v_blocks_calculator_v3_services" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_services_parent_id_idx" ON "_pages_v_blocks_calculator_v3_services" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_order_idx" ON "_pages_v_blocks_calculator_v3" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_calculator_v3_parent_id_idx" ON "_pages_v_blocks_calculator_v3" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_calculator_v3_path_idx" ON "_pages_v_blocks_calculator_v3" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_steps_items_order_idx" ON "_pages_v_blocks_steps_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_steps_items_parent_id_idx" ON "_pages_v_blocks_steps_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_steps_order_idx" ON "_pages_v_blocks_steps" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_steps_parent_id_idx" ON "_pages_v_blocks_steps" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_steps_path_idx" ON "_pages_v_blocks_steps" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_columns_order_idx" ON "_pages_v_blocks_price_tabs_tabs_columns" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_columns_parent_id_idx" ON "_pages_v_blocks_price_tabs_tabs_columns" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_rows_values_order_idx" ON "_pages_v_blocks_price_tabs_tabs_rows_values" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_rows_values_parent_id_idx" ON "_pages_v_blocks_price_tabs_tabs_rows_values" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_rows_order_idx" ON "_pages_v_blocks_price_tabs_tabs_rows" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_rows_parent_id_idx" ON "_pages_v_blocks_price_tabs_tabs_rows" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_notes_order_idx" ON "_pages_v_blocks_price_tabs_tabs_notes" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_notes_parent_id_idx" ON "_pages_v_blocks_price_tabs_tabs_notes" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_order_idx" ON "_pages_v_blocks_price_tabs_tabs" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_price_tabs_tabs" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_order_idx" ON "_pages_v_blocks_price_tabs" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_price_tabs_parent_id_idx" ON "_pages_v_blocks_price_tabs" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_price_tabs_path_idx" ON "_pages_v_blocks_price_tabs" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_photo_cta_order_idx" ON "_pages_v_blocks_photo_cta" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_photo_cta_parent_id_idx" ON "_pages_v_blocks_photo_cta" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_photo_cta_path_idx" ON "_pages_v_blocks_photo_cta" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_photo_cta_image_idx" ON "_pages_v_blocks_photo_cta" USING btree ("image_id");
CREATE INDEX "_pages_v_blocks_reviews_v3_order_idx" ON "_pages_v_blocks_reviews_v3" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_reviews_v3_parent_id_idx" ON "_pages_v_blocks_reviews_v3" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_reviews_v3_path_idx" ON "_pages_v_blocks_reviews_v3" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_documents_items_order_idx" ON "_pages_v_blocks_documents_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_documents_items_parent_id_idx" ON "_pages_v_blocks_documents_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_documents_order_idx" ON "_pages_v_blocks_documents" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_documents_parent_id_idx" ON "_pages_v_blocks_documents" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_documents_path_idx" ON "_pages_v_blocks_documents" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_b2b_plan_kpis_order_idx" ON "_pages_v_blocks_b2b_plan_kpis" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_b2b_plan_kpis_parent_id_idx" ON "_pages_v_blocks_b2b_plan_kpis" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_b2b_plan_audiences_order_idx" ON "_pages_v_blocks_b2b_plan_audiences" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_b2b_plan_audiences_parent_id_idx" ON "_pages_v_blocks_b2b_plan_audiences" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_b2b_plan_order_idx" ON "_pages_v_blocks_b2b_plan" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_b2b_plan_parent_id_idx" ON "_pages_v_blocks_b2b_plan" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_b2b_plan_path_idx" ON "_pages_v_blocks_b2b_plan" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_tree_check_checklist_order_idx" ON "_pages_v_blocks_tree_check_checklist" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_tree_check_checklist_parent_id_idx" ON "_pages_v_blocks_tree_check_checklist" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_tree_check_consult_points_order_idx" ON "_pages_v_blocks_tree_check_consult_points" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_tree_check_consult_points_parent_id_idx" ON "_pages_v_blocks_tree_check_consult_points" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_tree_check_order_idx" ON "_pages_v_blocks_tree_check" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_tree_check_parent_id_idx" ON "_pages_v_blocks_tree_check" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_tree_check_path_idx" ON "_pages_v_blocks_tree_check" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_articles_order_idx" ON "_pages_v_blocks_articles" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_articles_parent_id_idx" ON "_pages_v_blocks_articles" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_articles_path_idx" ON "_pages_v_blocks_articles" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_objects_map_legend_order_idx" ON "_pages_v_blocks_objects_map_legend" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_objects_map_legend_parent_id_idx" ON "_pages_v_blocks_objects_map_legend" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_objects_map_districts_order_idx" ON "_pages_v_blocks_objects_map_districts" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_objects_map_districts_parent_id_idx" ON "_pages_v_blocks_objects_map_districts" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_objects_map_zones_order_idx" ON "_pages_v_blocks_objects_map_zones" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_objects_map_zones_parent_id_idx" ON "_pages_v_blocks_objects_map_zones" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_objects_map_order_idx" ON "_pages_v_blocks_objects_map" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_objects_map_parent_id_idx" ON "_pages_v_blocks_objects_map" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_objects_map_path_idx" ON "_pages_v_blocks_objects_map" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_guarantees_items_order_idx" ON "_pages_v_blocks_guarantees_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_guarantees_items_parent_id_idx" ON "_pages_v_blocks_guarantees_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_guarantees_order_idx" ON "_pages_v_blocks_guarantees" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_guarantees_parent_id_idx" ON "_pages_v_blocks_guarantees" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_guarantees_path_idx" ON "_pages_v_blocks_guarantees" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_faq_v3_items_order_idx" ON "_pages_v_blocks_faq_v3_items" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_faq_v3_items_parent_id_idx" ON "_pages_v_blocks_faq_v3_items" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_faq_v3_order_idx" ON "_pages_v_blocks_faq_v3" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_faq_v3_parent_id_idx" ON "_pages_v_blocks_faq_v3" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_faq_v3_path_idx" ON "_pages_v_blocks_faq_v3" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_final_form_channels_order_idx" ON "_pages_v_blocks_final_form_channels" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_final_form_channels_parent_id_idx" ON "_pages_v_blocks_final_form_channels" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_final_form_order_idx" ON "_pages_v_blocks_final_form" USING btree ("_order");
CREATE INDEX "_pages_v_blocks_final_form_parent_id_idx" ON "_pages_v_blocks_final_form" USING btree ("_parent_id");
CREATE INDEX "_pages_v_blocks_final_form_path_idx" ON "_pages_v_blocks_final_form" USING btree ("_path");
CREATE INDEX "_pages_v_blocks_final_form_background_idx" ON "_pages_v_blocks_final_form" USING btree ("background_id");
CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
CREATE INDEX "_pages_v_version_version_og_image_idx" ON "_pages_v" USING btree ("version_og_image_id");
CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
CREATE INDEX "_pages_v_rels_blog_id_idx" ON "_pages_v_rels" USING btree ("blog_id");
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
