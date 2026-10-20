--
-- Down migration — drop Homepage global tables
-- Order: array tables first, then main row table (FK dependency order)
--

DROP TABLE IF EXISTS public.homepage_gallery CASCADE;
DROP TABLE IF EXISTS public.homepage_faq CASCADE;
DROP TABLE IF EXISTS public.homepage_documents CASCADE;
DROP TABLE IF EXISTS public.homepage_reviews CASCADE;
DROP TABLE IF EXISTS public.homepage_review_sources CASCADE;
DROP TABLE IF EXISTS public.homepage_pricing_rows CASCADE;
DROP TABLE IF EXISTS public.homepage_steps CASCADE;
DROP TABLE IF EXISTS public.homepage_hero_trust_bullets CASCADE;
DROP TABLE IF EXISTS public.homepage CASCADE;
DROP SEQUENCE IF EXISTS public.homepage_id_seq CASCADE;
