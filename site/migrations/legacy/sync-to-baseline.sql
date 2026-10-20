-- Разовая синхронизация старой схемы (dev-push + ручные миграции до 20.10.2026) со схемой
-- из payload.config.ts — состоянием, которое создаёт базовая миграция 20261020_120000_baseline.
--
-- Запускает scripts/migrate.ts только на «старой» БД (нет записи о базовой миграции, но есть
-- таблица users) — в одной транзакции вместе с отметкой базовой миграции. На новой БД не нужна.
-- Получено `pnpm schema:diff` против копии схемы прода и вычитано вручную (план 09, этап 1 —
-- «Дрейф схемы»). Всё совместимо со старым кодом: таблица reviews пустая, колонки api_key
-- пустые и не используются с PR #236, остальное — индексы, типы без потери данных, DEFAULT.
-- Откат — восстановление из бэкапа перед выкаткой (pre-deploy).

SET LOCAL lock_timeout = '10s';

-- Отзывы: черновики (versions.drafts) — enum статуса, необязательные поля, FK по правилам Payload.
CREATE TYPE "public"."enum_reviews_status" AS ENUM('draft', 'published');
CREATE TYPE "public"."enum__reviews_v_version_source" AS ENUM('yandex_maps', 'yandex_business', 'twogis', 'avito', 'site_form', 'direct', 'other');
CREATE TYPE "public"."enum__reviews_v_version_status" AS ENUM('draft', 'published');
ALTER TYPE "public"."enum_reviews_source" ADD VALUE 'other';
ALTER TABLE "_reviews_v" DROP CONSTRAINT "_reviews_v_parent_id_fkey"; 
ALTER TABLE "_reviews_v" DROP CONSTRAINT "_reviews_v_version_district_id_fkey"; 
ALTER TABLE "_reviews_v" DROP CONSTRAINT "_reviews_v_version_service_id_fkey"; 
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_district_id_fk"; 
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_service_id_fk"; 
ALTER TABLE "_reviews_v" ALTER COLUMN "version_source" SET DATA TYPE "public"."enum__reviews_v_version_source" USING "version_source"::text::"public"."enum__reviews_v_version_source";
ALTER TABLE "_reviews_v" ALTER COLUMN "version_priority" SET DEFAULT 0;
ALTER TABLE "_reviews_v" ALTER COLUMN "version__status" SET DEFAULT 'draft'::"public"."enum__reviews_v_version_status";
ALTER TABLE "_reviews_v" ALTER COLUMN "version__status" SET DATA TYPE "public"."enum__reviews_v_version_status" USING "version__status"::"public"."enum__reviews_v_version_status";
ALTER TABLE "reviews" ALTER COLUMN "author_name" DROP NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "rating" DROP NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "text" DROP NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "date_published" DROP NOT NULL;
ALTER TABLE "reviews" ALTER COLUMN "priority" SET DEFAULT 0;
ALTER TABLE "reviews" ALTER COLUMN "_status" SET DEFAULT 'draft'::"public"."enum_reviews_status";
ALTER TABLE "reviews" ALTER COLUMN "_status" SET DATA TYPE "public"."enum_reviews_status" USING "_status"::"public"."enum_reviews_status";
ALTER TABLE "homepage_reviews" ALTER COLUMN "text" SET DATA TYPE varchar;
ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_parent_id_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reviews"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_service_id_services_id_fk" FOREIGN KEY ("version_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "_reviews_v" ADD CONSTRAINT "_reviews_v_version_district_id_districts_id_fk" FOREIGN KEY ("version_district_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_district_id_districts_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE set null ON UPDATE no action;

-- Индексы по правилам именования Payload (были созданы ручными миграциями).
DROP INDEX "version_service_version_district_idx";
DROP INDEX "_services_v_version_reviewed_by_idx";
DROP INDEX "homepage_steps_parent_idx";
DROP INDEX "homepage_hero_trust_bullets_parent_idx";
DROP INDEX "homepage_faq_parent_idx";
DROP INDEX "homepage_review_sources_parent_idx";
DROP INDEX "homepage_pricing_rows_parent_idx";
DROP INDEX "homepage_created_at_idx";
DROP INDEX "homepage_hero_photo_idx";
DROP INDEX "homepage_photo_smeta_example_image_idx";
DROP INDEX "homepage_updated_at_idx";
DROP INDEX "homepage_gallery_parent_idx";
DROP INDEX "reviews_district_id_idx";
DROP INDEX "reviews_service_id_idx";
DROP INDEX "reviews_status_idx";
DROP INDEX "homepage_reviews_parent_idx";
DROP INDEX "homepage_documents_parent_idx";
CREATE INDEX "_reviews_v_version_version_service_idx" ON "_reviews_v" USING btree ("version_service_id");
CREATE INDEX "_reviews_v_version_version_district_idx" ON "_reviews_v" USING btree ("version_district_id");
CREATE INDEX "_reviews_v_version_version_updated_at_idx" ON "_reviews_v" USING btree ("version_updated_at");
CREATE INDEX "_reviews_v_version_version_created_at_idx" ON "_reviews_v" USING btree ("version_created_at");
CREATE INDEX "_reviews_v_version_version__status_idx" ON "_reviews_v" USING btree ("version__status");
CREATE INDEX "_reviews_v_created_at_idx" ON "_reviews_v" USING btree ("created_at");
CREATE INDEX "_reviews_v_updated_at_idx" ON "_reviews_v" USING btree ("updated_at");
CREATE INDEX "_service_districts_v_version_version_sub_service_slug_idx" ON "_service_districts_v" USING btree ("version_sub_service_slug");
CREATE INDEX "version_service_version_district_version_subServiceSlug_idx" ON "_service_districts_v" USING btree ("version_service_id","version_district_id","version_sub_service_slug");
CREATE INDEX "_services_v_version_version_reviewed_by_idx" ON "_services_v" USING btree ("version_reviewed_by_id");
CREATE INDEX "homepage_steps_parent_id_idx" ON "homepage_steps" USING btree ("_parent_id");
CREATE INDEX "homepage_hero_trust_bullets_parent_id_idx" ON "homepage_hero_trust_bullets" USING btree ("_parent_id");
CREATE INDEX "homepage_faq_parent_id_idx" ON "homepage_faq" USING btree ("_parent_id");
CREATE INDEX "homepage_review_sources_parent_id_idx" ON "homepage_review_sources" USING btree ("_parent_id");
CREATE INDEX "homepage_pricing_rows_parent_id_idx" ON "homepage_pricing_rows" USING btree ("_parent_id");
CREATE INDEX "homepage_hero_hero_photo_idx" ON "homepage" USING btree ("hero_photo_id");
CREATE INDEX "homepage_photo_smeta_photo_smeta_example_image_idx" ON "homepage" USING btree ("photo_smeta_example_image_id");
CREATE INDEX "homepage_gallery_parent_id_idx" ON "homepage_gallery" USING btree ("_parent_id");
CREATE INDEX "reviews_service_idx" ON "reviews" USING btree ("service_id");
CREATE INDEX "reviews_district_idx" ON "reviews" USING btree ("district_id");
CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
CREATE INDEX "reviews__status_idx" ON "reviews" USING btree ("_status");
CREATE INDEX "homepage_reviews_parent_id_idx" ON "homepage_reviews" USING btree ("_parent_id");
CREATE INDEX "service_district_subServiceSlug_idx" ON "service_districts" USING btree ("service_id","district_id","sub_service_slug");
CREATE INDEX "homepage_documents_parent_id_idx" ON "homepage_documents" USING btree ("_parent_id");

-- Главная, районы, SEO, шапка/подвал, пользователи: типы и значения по умолчанию.
ALTER TABLE "_districts_v" ALTER COLUMN "version_local_price_adjustment" SET DEFAULT 0;
ALTER TABLE "districts" ALTER COLUMN "local_price_adjustment" SET DEFAULT 0;
ALTER TABLE "homepage_steps" ALTER COLUMN "description" SET DATA TYPE varchar;
ALTER TABLE "homepage_hero_trust_bullets" ALTER COLUMN "label" SET DATA TYPE varchar;
ALTER TABLE "homepage_faq" ALTER COLUMN "answer" SET DATA TYPE varchar;
ALTER TABLE "homepage_pricing_rows" ALTER COLUMN "desc" SET DATA TYPE varchar;
ALTER TABLE "homepage" ALTER COLUMN "hero_title_main" SET NOT NULL;
ALTER TABLE "homepage" ALTER COLUMN "hero_title_accent" SET NOT NULL;
ALTER TABLE "homepage" ALTER COLUMN "hero_subhead" SET DEFAULT 'И ещё 3 направления: чистка крыш, вывоз мусора, демонтаж';
ALTER TABLE "homepage" ALTER COLUMN "hero_lead" SET DATA TYPE varchar;
ALTER TABLE "homepage" ALTER COLUMN "hero_lead" SET DEFAULT 'Фикс-цена за объект, страховка 5 млн ₽, штрафы ГЖИ берём на себя по договору.';
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_caption" SET DEFAULT 'ФОТО · Аварийная берёза 18 м
СНТ Берёзовая роща, Истра';
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_recognized" SET DEFAULT 'берёза, ~18 м, аварийный наклон 25°';
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_range_min" SET DATA TYPE numeric;
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_range_min" SET DEFAULT 12800;
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_range_max" SET DATA TYPE numeric;
ALTER TABLE "homepage" ALTER COLUMN "photo_smeta_example_range_max" SET DEFAULT 16400;
ALTER TABLE "seo_settings" ALTER COLUMN "local_business_geo_radius_km" SET DEFAULT 150;
ALTER TABLE "site_chrome" ALTER COLUMN "contacts_email" SET DEFAULT 'partner@obikhod.ru';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_kpp" SET DEFAULT '111111111';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_ogrn" SET DEFAULT '1111111111111';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_address_region" SET DEFAULT 'Московская область';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_address_locality" SET DEFAULT 'Жуковский';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_street_address" SET DEFAULT 'ул. Амет-хан Султана, 15, к1';
ALTER TABLE "site_chrome" ALTER COLUMN "requisites_postal_code" SET DEFAULT '140185';
ALTER TABLE "users" ALTER COLUMN "login_attempts" SET DEFAULT 0;

-- API-ключи выключены с PR #236 (useAPIKey: false), колонки пустые.
ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
ALTER TABLE "users" DROP COLUMN "api_key";
ALTER TABLE "users" DROP COLUMN "api_key_index";
