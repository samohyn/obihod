-- US-6 wave 2B1: расширение subServices array контентными полями.
--
-- Добавляет в `services_sub_services` (и snapshot версионную копию)
-- поля для самостоятельных страниц /<service>/<slug>/:
--   - intro varchar (textarea answer-first для GEO/нейро-выдачи)
--   - body jsonb (lexical richText с полным контентом ~600-800 слов)
--   - meta_title varchar
--   - meta_description varchar
--
-- Без них sub-services хранят только slug/title/h1/priceFrom — этого мало
-- для индексируемой страницы. seo1 топ-7 sub-services закрывают ≈25%
-- wsfreq проекта (см. seo1-wave2b-priorities.md).

BEGIN;

-- Основная таблица
ALTER TABLE "services_sub_services" ADD COLUMN IF NOT EXISTS "intro" varchar;
ALTER TABLE "services_sub_services" ADD COLUMN IF NOT EXISTS "body" jsonb;
ALTER TABLE "services_sub_services" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
ALTER TABLE "services_sub_services" ADD COLUMN IF NOT EXISTS "meta_description" varchar;

-- Snapshot для версий (drafts: true в Services)
ALTER TABLE "_services_v_version_sub_services" ADD COLUMN IF NOT EXISTS "intro" varchar;
ALTER TABLE "_services_v_version_sub_services" ADD COLUMN IF NOT EXISTS "body" jsonb;
ALTER TABLE "_services_v_version_sub_services" ADD COLUMN IF NOT EXISTS "meta_title" varchar;
ALTER TABLE "_services_v_version_sub_services" ADD COLUMN IF NOT EXISTS "meta_description" varchar;

COMMIT;
