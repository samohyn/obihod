--
-- Phase 3 migration — Homepage global (ADR-0017)
--
-- Создаёт таблицы для Payload global "homepage" (slug='homepage'):
--   - homepage              — основная row (scalar fields из hero, photoSmeta groups)
--   - homepage_hero_trust_bullets  — array (3 items)
--   - homepage_steps        — array (5 items)
--   - homepage_pricing_rows — array (7 items)
--   - homepage_review_sources — array (4 items)
--   - homepage_reviews      — array (6 items)
--   - homepage_documents    — array (8 items, FK→media)
--   - homepage_faq          — array (8 items)
--   - homepage_gallery      — array (8 items, FK→media)
--
-- Pattern: site_chrome (initial_schema_bootstrap.sql) + media FK по образцу
-- _media_id колонок других globals.

-- ============================================================
-- Main row table
-- ============================================================

CREATE TABLE public.homepage (
    id integer NOT NULL,
    hero_eyebrow character varying DEFAULT '§ 01 · Хозяйственные работы · Москва и МО'::character varying,
    hero_title_main character varying DEFAULT 'Удаление деревьев'::character varying,
    hero_title_accent character varying DEFAULT 'в Москве и МО'::character varying,
    hero_subhead character varying,
    hero_lead text,
    hero_photo_id integer,
    photo_smeta_example_id character varying DEFAULT '№ 0044'::character varying,
    photo_smeta_example_image_id integer,
    photo_smeta_example_caption character varying,
    photo_smeta_example_recognized character varying,
    photo_smeta_example_range_min integer DEFAULT 12800,
    photo_smeta_example_range_max integer DEFAULT 16400,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);

CREATE SEQUENCE public.homepage_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.homepage_id_seq OWNED BY public.homepage.id;
ALTER TABLE ONLY public.homepage ALTER COLUMN id SET DEFAULT nextval('public.homepage_id_seq'::regclass);
ALTER TABLE ONLY public.homepage ADD CONSTRAINT homepage_pkey PRIMARY KEY (id);

-- FK на media (hero photo + photoSmeta example image)
ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_hero_photo_id_media_id_fk
    FOREIGN KEY (hero_photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.homepage
    ADD CONSTRAINT homepage_photo_smeta_example_image_id_media_id_fk
    FOREIGN KEY (photo_smeta_example_image_id) REFERENCES public.media(id) ON DELETE SET NULL;

CREATE INDEX homepage_hero_photo_idx ON public.homepage(hero_photo_id);
CREATE INDEX homepage_photo_smeta_example_image_idx ON public.homepage(photo_smeta_example_image_id);
CREATE INDEX homepage_updated_at_idx ON public.homepage(updated_at);
CREATE INDEX homepage_created_at_idx ON public.homepage(created_at);

-- ============================================================
-- Array: hero.trustBullets (3 items)
-- ============================================================

CREATE TABLE public.homepage_hero_trust_bullets (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    value character varying NOT NULL,
    label text NOT NULL
);

ALTER TABLE ONLY public.homepage_hero_trust_bullets
    ADD CONSTRAINT homepage_hero_trust_bullets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_hero_trust_bullets
    ADD CONSTRAINT homepage_hero_trust_bullets_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_hero_trust_bullets_parent_idx ON public.homepage_hero_trust_bullets(_parent_id);
CREATE INDEX homepage_hero_trust_bullets_order_idx ON public.homepage_hero_trust_bullets(_order);

-- ============================================================
-- Array: steps (5 items)
-- ============================================================

CREATE TABLE public.homepage_steps (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    sla character varying NOT NULL,
    description text NOT NULL
);

ALTER TABLE ONLY public.homepage_steps
    ADD CONSTRAINT homepage_steps_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_steps
    ADD CONSTRAINT homepage_steps_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_steps_parent_idx ON public.homepage_steps(_parent_id);
CREATE INDEX homepage_steps_order_idx ON public.homepage_steps(_order);

-- ============================================================
-- Array: pricingRows (7 items)
-- "desc" — reserved-ish identifier in PG; quote at usage. Field name: desc_field
-- (но Payload генерирует таким же именем как field name — оставляем "desc" with quotes)
-- ============================================================

CREATE TABLE public.homepage_pricing_rows (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    "desc" text NOT NULL,
    price_from numeric NOT NULL,
    unit character varying NOT NULL,
    link character varying NOT NULL
);

ALTER TABLE ONLY public.homepage_pricing_rows
    ADD CONSTRAINT homepage_pricing_rows_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_pricing_rows
    ADD CONSTRAINT homepage_pricing_rows_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_pricing_rows_parent_idx ON public.homepage_pricing_rows(_parent_id);
CREATE INDEX homepage_pricing_rows_order_idx ON public.homepage_pricing_rows(_order);

-- ============================================================
-- Array: reviewSources (4 items)
-- ============================================================

CREATE TABLE public.homepage_review_sources (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying NOT NULL,
    rating numeric NOT NULL,
    review_count numeric NOT NULL,
    is_nps boolean DEFAULT false
);

ALTER TABLE ONLY public.homepage_review_sources
    ADD CONSTRAINT homepage_review_sources_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_review_sources
    ADD CONSTRAINT homepage_review_sources_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_review_sources_parent_idx ON public.homepage_review_sources(_parent_id);
CREATE INDEX homepage_review_sources_order_idx ON public.homepage_review_sources(_order);

-- ============================================================
-- Array: reviews (6 items)
-- ============================================================

CREATE TABLE public.homepage_reviews (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    author character varying NOT NULL,
    meta character varying NOT NULL,
    text text NOT NULL
);

ALTER TABLE ONLY public.homepage_reviews
    ADD CONSTRAINT homepage_reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_reviews
    ADD CONSTRAINT homepage_reviews_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_reviews_parent_idx ON public.homepage_reviews(_parent_id);
CREATE INDEX homepage_reviews_order_idx ON public.homepage_reviews(_order);

-- ============================================================
-- Array: documents (8 items, photo→media)
-- ============================================================

CREATE TABLE public.homepage_documents (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    title character varying NOT NULL,
    meta character varying NOT NULL,
    photo_id integer
);

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_documents
    ADD CONSTRAINT homepage_documents_photo_id_media_id_fk
    FOREIGN KEY (photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

CREATE INDEX homepage_documents_parent_idx ON public.homepage_documents(_parent_id);
CREATE INDEX homepage_documents_order_idx ON public.homepage_documents(_order);
CREATE INDEX homepage_documents_photo_idx ON public.homepage_documents(photo_id);

-- ============================================================
-- Array: faq (8 items)
-- ============================================================

CREATE TABLE public.homepage_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    question character varying NOT NULL,
    answer text NOT NULL
);

ALTER TABLE ONLY public.homepage_faq
    ADD CONSTRAINT homepage_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_faq
    ADD CONSTRAINT homepage_faq_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

CREATE INDEX homepage_faq_parent_idx ON public.homepage_faq(_parent_id);
CREATE INDEX homepage_faq_order_idx ON public.homepage_faq(_order);

-- ============================================================
-- Array: gallery (8 items, photo→media)
-- ============================================================

CREATE TABLE public.homepage_gallery (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    photo_id integer,
    caption character varying NOT NULL,
    alt character varying NOT NULL
);

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_parent_id_fk
    FOREIGN KEY (_parent_id) REFERENCES public.homepage(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.homepage_gallery
    ADD CONSTRAINT homepage_gallery_photo_id_media_id_fk
    FOREIGN KEY (photo_id) REFERENCES public.media(id) ON DELETE SET NULL;

CREATE INDEX homepage_gallery_parent_idx ON public.homepage_gallery(_parent_id);
CREATE INDEX homepage_gallery_order_idx ON public.homepage_gallery(_order);
CREATE INDEX homepage_gallery_photo_idx ON public.homepage_gallery(photo_id);
