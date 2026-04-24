-- US-3 UP: Payload 3 blocks tables for ServiceDistricts
-- Extracted from pg_dump of local DB (baseline: US-3 new schema)

BEGIN;

CREATE TYPE public.enum_service_districts_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum_service_districts_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum_service_districts_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum_service_districts_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TYPE public.enum__service_districts_v_blocks_hero_seasonal_theme AS ENUM (
    'summer',
    'winter',
    'promo'
);

CREATE TYPE public.enum__service_districts_v_blocks_text_content_columns AS ENUM (
    '1',
    '2'
);

CREATE TYPE public.enum__service_districts_v_blocks_lead_form_variant AS ENUM (
    'short',
    'long'
);

CREATE TYPE public.enum__service_districts_v_blocks_cta_banner_accent AS ENUM (
    'primary',
    'warning',
    'success'
);

CREATE TABLE public.service_districts_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    subtitle character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    seasonal_theme public.enum_service_districts_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum_service_districts_blocks_hero_seasonal_theme,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum_service_districts_blocks_text_content_columns DEFAULT '1'::public.enum_service_districts_blocks_text_content_columns,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum_service_districts_blocks_lead_form_variant DEFAULT 'short'::public.enum_service_districts_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_cta_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    body jsonb,
    cta_label character varying,
    cta_href character varying,
    accent public.enum_service_districts_blocks_cta_banner_accent DEFAULT 'primary'::public.enum_service_districts_blocks_cta_banner_accent,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Частые вопросы'::character varying,
    generate_faq_page_schema boolean DEFAULT true,
    block_name character varying
);

CREATE TABLE public.service_districts_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL,
    question character varying,
    answer jsonb
);

CREATE TABLE public._service_districts_v_blocks_hero (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    subtitle character varying,
    image_id integer,
    cta_label character varying,
    cta_href character varying,
    seasonal_theme public.enum__service_districts_v_blocks_hero_seasonal_theme DEFAULT 'summer'::public.enum__service_districts_v_blocks_hero_seasonal_theme,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_text_content (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    eyebrow character varying,
    heading character varying,
    body jsonb,
    columns public.enum__service_districts_v_blocks_text_content_columns DEFAULT '1'::public.enum__service_districts_v_blocks_text_content_columns,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_lead_form (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    variant public.enum__service_districts_v_blocks_lead_form_variant DEFAULT 'short'::public.enum__service_districts_v_blocks_lead_form_variant,
    heading character varying,
    subheading character varying,
    submit_label character varying DEFAULT 'Отправить'::character varying,
    success_message character varying DEFAULT 'Спасибо, перезвоним за 15 минут.'::character varying,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_cta_banner (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    title character varying,
    body jsonb,
    cta_label character varying,
    cta_href character varying,
    accent public.enum__service_districts_v_blocks_cta_banner_accent DEFAULT 'primary'::public.enum__service_districts_v_blocks_cta_banner_accent,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    enabled boolean DEFAULT true,
    anchor character varying,
    heading character varying DEFAULT 'Частые вопросы'::character varying,
    generate_faq_page_schema boolean DEFAULT true,
    _uuid character varying,
    block_name character varying
);

CREATE TABLE public._service_districts_v_blocks_faq_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    question character varying,
    answer jsonb,
    _uuid character varying
);

CREATE SEQUENCE public._service_districts_v_blocks_hero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_text_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_lead_form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public._service_districts_v_blocks_faq_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._service_districts_v_blocks_hero_id_seq OWNED BY public._service_districts_v_blocks_hero.id;

ALTER SEQUENCE public._service_districts_v_blocks_text_content_id_seq OWNED BY public._service_districts_v_blocks_text_content.id;

ALTER SEQUENCE public._service_districts_v_blocks_lead_form_id_seq OWNED BY public._service_districts_v_blocks_lead_form.id;

ALTER SEQUENCE public._service_districts_v_blocks_cta_banner_id_seq OWNED BY public._service_districts_v_blocks_cta_banner.id;

ALTER SEQUENCE public._service_districts_v_blocks_faq_id_seq OWNED BY public._service_districts_v_blocks_faq.id;

ALTER SEQUENCE public._service_districts_v_blocks_faq_items_id_seq OWNED BY public._service_districts_v_blocks_faq_items.id;

ALTER TABLE ONLY public._service_districts_v_blocks_hero ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_hero_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_text_content ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_text_content_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_lead_form_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_cta_banner_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_id_seq'::regclass);

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items ALTER COLUMN id SET DEFAULT nextval('public._service_districts_v_blocks_faq_items_id_seq'::regclass);

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.service_districts_blocks_hero
    ADD CONSTRAINT service_districts_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_text_content
    ADD CONSTRAINT service_districts_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_lead_form
    ADD CONSTRAINT service_districts_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_cta_banner
    ADD CONSTRAINT service_districts_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_faq
    ADD CONSTRAINT service_districts_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.service_districts_blocks_faq_items
    ADD CONSTRAINT service_districts_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_districts_blocks_faq(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;

ALTER TABLE ONLY public._service_districts_v_blocks_hero
    ADD CONSTRAINT _service_districts_v_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_text_content
    ADD CONSTRAINT _service_districts_v_blocks_text_content_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_lead_form
    ADD CONSTRAINT _service_districts_v_blocks_lead_form_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_cta_banner
    ADD CONSTRAINT _service_districts_v_blocks_cta_banner_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_faq
    ADD CONSTRAINT _service_districts_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public._service_districts_v_blocks_faq_items
    ADD CONSTRAINT _service_districts_v_blocks_faq_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_districts_v_blocks_faq(id) ON DELETE CASCADE;

CREATE INDEX service_districts_blocks_hero_image_idx ON public.service_districts_blocks_hero USING btree (image_id);

CREATE INDEX service_districts_blocks_hero_order_idx ON public.service_districts_blocks_hero USING btree (_order);

CREATE INDEX service_districts_blocks_hero_parent_id_idx ON public.service_districts_blocks_hero USING btree (_parent_id);

CREATE INDEX service_districts_blocks_hero_path_idx ON public.service_districts_blocks_hero USING btree (_path);

CREATE INDEX service_districts_blocks_text_content_order_idx ON public.service_districts_blocks_text_content USING btree (_order);

CREATE INDEX service_districts_blocks_text_content_parent_id_idx ON public.service_districts_blocks_text_content USING btree (_parent_id);

CREATE INDEX service_districts_blocks_text_content_path_idx ON public.service_districts_blocks_text_content USING btree (_path);

CREATE INDEX service_districts_blocks_lead_form_order_idx ON public.service_districts_blocks_lead_form USING btree (_order);

CREATE INDEX service_districts_blocks_lead_form_parent_id_idx ON public.service_districts_blocks_lead_form USING btree (_parent_id);

CREATE INDEX service_districts_blocks_lead_form_path_idx ON public.service_districts_blocks_lead_form USING btree (_path);

CREATE INDEX service_districts_blocks_cta_banner_order_idx ON public.service_districts_blocks_cta_banner USING btree (_order);

CREATE INDEX service_districts_blocks_cta_banner_parent_id_idx ON public.service_districts_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX service_districts_blocks_cta_banner_path_idx ON public.service_districts_blocks_cta_banner USING btree (_path);

CREATE INDEX service_districts_blocks_faq_order_idx ON public.service_districts_blocks_faq USING btree (_order);

CREATE INDEX service_districts_blocks_faq_parent_id_idx ON public.service_districts_blocks_faq USING btree (_parent_id);

CREATE INDEX service_districts_blocks_faq_path_idx ON public.service_districts_blocks_faq USING btree (_path);

CREATE INDEX service_districts_blocks_faq_items_order_idx ON public.service_districts_blocks_faq_items USING btree (_order);

CREATE INDEX service_districts_blocks_faq_items_parent_id_idx ON public.service_districts_blocks_faq_items USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_hero_image_idx ON public._service_districts_v_blocks_hero USING btree (image_id);

CREATE INDEX _service_districts_v_blocks_hero_order_idx ON public._service_districts_v_blocks_hero USING btree (_order);

CREATE INDEX _service_districts_v_blocks_hero_parent_id_idx ON public._service_districts_v_blocks_hero USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_hero_path_idx ON public._service_districts_v_blocks_hero USING btree (_path);

CREATE INDEX _service_districts_v_blocks_text_content_order_idx ON public._service_districts_v_blocks_text_content USING btree (_order);

CREATE INDEX _service_districts_v_blocks_text_content_parent_id_idx ON public._service_districts_v_blocks_text_content USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_text_content_path_idx ON public._service_districts_v_blocks_text_content USING btree (_path);

CREATE INDEX _service_districts_v_blocks_lead_form_order_idx ON public._service_districts_v_blocks_lead_form USING btree (_order);

CREATE INDEX _service_districts_v_blocks_lead_form_parent_id_idx ON public._service_districts_v_blocks_lead_form USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_lead_form_path_idx ON public._service_districts_v_blocks_lead_form USING btree (_path);

CREATE INDEX _service_districts_v_blocks_cta_banner_order_idx ON public._service_districts_v_blocks_cta_banner USING btree (_order);

CREATE INDEX _service_districts_v_blocks_cta_banner_parent_id_idx ON public._service_districts_v_blocks_cta_banner USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_cta_banner_path_idx ON public._service_districts_v_blocks_cta_banner USING btree (_path);

CREATE INDEX _service_districts_v_blocks_faq_order_idx ON public._service_districts_v_blocks_faq USING btree (_order);

CREATE INDEX _service_districts_v_blocks_faq_parent_id_idx ON public._service_districts_v_blocks_faq USING btree (_parent_id);

CREATE INDEX _service_districts_v_blocks_faq_path_idx ON public._service_districts_v_blocks_faq USING btree (_path);

CREATE INDEX _service_districts_v_blocks_faq_items_order_idx ON public._service_districts_v_blocks_faq_items USING btree (_order);

CREATE INDEX _service_districts_v_blocks_faq_items_parent_id_idx ON public._service_districts_v_blocks_faq_items USING btree (_parent_id);

COMMIT;
