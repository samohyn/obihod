-- План 09, этап 1 — быстрые SEO-фиксы: данные контента.
--
-- Краулер (pnpm check:links https://obikhod.ru) нашёл 79 битых внутренних URL. Часть — в коде
-- (шапка, футер, главная — исправлены в коде), часть — в данных CMS. Эта миграция чинит данные:
--   1. неправильные адреса существующих страниц в карточках, «связанных услугах», хлебных
--      крошках, мини-кейсах и текстах → правильные (только на проверенные 200-страницы);
--   2. ссылки мини-кейсов на несуществующие кейсы → убираются (inline_link = NULL, без ссылки
--      блок рендерится как раньше); 2 карточки промальпа без страниц → удаляются;
--   3. дубль района «Жуковский»: zhukovskij (id 16, 5 гео-черновиков) сливается в zhukovsky
--      (id 2, 19 гео + 2 кейса); URL zhukovskij → 301 в next.config.ts;
--   4. «Дизайн ландшафта» публикуется (страница давно открыта, но в CMS числилась черновиком
--      и не попадала в sitemap); пост блога без slug и заголовка снимается с публикации;
--   5. выдуманные отзывы и рейтинги главной (копия макета) удаляются; из FAQ главной
--      убирается упоминание ИИ (смету по фото считает менеджер);
--   6. SiteChrome получает реальные контакты и адрес (один источник для сайта и JSON-LD).
-- Меняются и таблицы версий (_*_v), иначе следующая публикация из админки вернёт старое.
--
-- Idempotent: повторный запуск ничего не меняет.

BEGIN;

-- ───────── 1. Адреса существующих страниц ─────────
CREATE TEMP TABLE _seo_link_map (old_path text PRIMARY KEY, new_path text NOT NULL) ON COMMIT DROP;
INSERT INTO _seo_link_map (old_path, new_path) VALUES
    ('arboristika/avarijnoe',              'arboristika/avariynyy-spil'),
    ('demontazh/saraj',                    'demontazh/demontazh-saraya'),
    ('demontazh/dom',                      'demontazh/snos-doma'),
    ('arboristika/frezerovanie-pnya',      'arboristika/udalenie-pnya'),
    ('arboristika/korchevanie',            'arboristika/udalenie-pnya'),
    ('arboristika/vyrubka-derevev',        'arboristika/spil-derevev'),
    ('arboristika/porubochnyy-bilet',      'porubochnyj-bilet'),
    ('chistka-krysh/chastnyy-dom',         'chistka-krysh/chistka-krysh-chastnyy-dom'),
    ('chistka-krysh/mkd',                  'chistka-krysh/chistka-krysh-mkd'),
    ('chistka-krysh/ot-naledi',            'chistka-krysh/sbivanie-sosulek'),
    ('demontazh/bani',                     'demontazh/demontazh-bani'),
    ('demontazh/dachi',                    'demontazh/demontazh-dachi'),
    ('demontazh/saraya',                   'demontazh/demontazh-saraya'),
    ('demontazh/demontazh-zabora',         'demontazh/snos-zabora'),
    ('vyvoz-musora/kgm',                   'vyvoz-musora/krupnogabarit'),
    ('vyvoz-musora/porubochnye-ostatki',   'vyvoz-musora/vyvoz-porubochnyh'),
    ('vyvoz-musora/raschistka-uchastka',   'vyvoz-musora/uborka-uchastka'),
    ('vyvoz-musora/sadovyj',               'vyvoz-musora/vyvoz-sadovogo-musora'),
    ('vyvoz-musora/stroitelnyj',           'vyvoz-musora/vyvoz-stroymusora'),
    ('landshaft',                          'dizain-landshafta'),
    ('b2b/snt-kp',                         'b2b'),
    ('avtory/georgy-s',                    'o-kompanii'),
    ('b2b/kejsy/uk-tszh',                  'b2b/kejsy');

-- 1a. slug в карточках и «связанных услугах» (вида 'vyvoz-musora/kgm') — точное совпадение.
DO $$
DECLARE r record;
BEGIN
    FOR r IN SELECT table_name FROM information_schema.columns
             WHERE table_schema = 'public' AND column_name = 'slug'
               AND (table_name LIKE '%services\_grid\_items' OR table_name LIKE '%related\_services\_items')
    LOOP
        EXECUTE format(
            'UPDATE %I t SET slug = m.new_path FROM _seo_link_map m WHERE t.slug = m.old_path', r.table_name);
    END LOOP;
END $$;

-- 1b. Хлебные крошки страницы B2B «УК и ТСЖ» стояли под «Кейсами»: /b2b/kejsy/uk-tszh/.
DELETE FROM b2b_pages_blocks_breadcrumbs_items i
 USING b2b_pages_blocks_breadcrumbs b, b2b_pages p
 WHERE i._parent_id = b.id AND b._parent_id = p.id AND p.slug = 'uk-tszh' AND i.url = '/b2b/kejsy/';
DELETE FROM _b2b_pages_v_blocks_breadcrumbs_items i
 USING _b2b_pages_v_blocks_breadcrumbs b, _b2b_pages_v v
 WHERE i._parent_id = b.id AND b._parent_id = v.id AND v.version_slug = 'uk-tszh' AND i.url = '/b2b/kejsy/';
UPDATE b2b_pages_blocks_breadcrumbs_items SET url = '/b2b/uk-tszh/' WHERE url = '/b2b/kejsy/uk-tszh/';
UPDATE _b2b_pages_v_blocks_breadcrumbs_items SET url = '/b2b/uk-tszh/' WHERE url = '/b2b/kejsy/uk-tszh/';

-- 1c. Пути '/old/…' в любых текстовых полях (тексты, ссылки, мини-кейсы, крошки, подписи медиа).
--     Сначала — черновая пометка автора текста, попавшая в видимый текст B2B-страниц.
DO $$
DECLARE r record; m record; is_json boolean;
BEGIN
    FOR r IN SELECT table_name, column_name, data_type FROM information_schema.columns
             WHERE table_schema = 'public' AND data_type IN ('text', 'character varying', 'jsonb')
               AND table_name NOT IN ('audit_log', 'leads', 'users', 'rum_metrics', 'payload_migrations',
                                      'payload_preferences', 'payload_locked_documents')
    LOOP
        EXECUTE format(
            'UPDATE %I SET %I = regexp_replace(%I::text, %L, %L, %L)%s WHERE %I::text ~ %L',
            r.table_name, r.column_name, r.column_name,
            ' ?\(ссылка на /avtory/georgy-s/?\)', '', 'g',
            CASE WHEN r.data_type = 'jsonb' THEN '::jsonb' ELSE '' END,
            r.column_name, '\(ссылка на /avtory/georgy-s/?\)');
    END LOOP;

    FOR r IN SELECT table_name, column_name, data_type FROM information_schema.columns
             WHERE table_schema = 'public' AND data_type IN ('text', 'character varying', 'jsonb')
               AND table_name NOT IN ('audit_log', 'leads', 'users', 'rum_metrics', 'payload_migrations',
                                      'payload_preferences', 'payload_locked_documents')
               AND column_name NOT IN ('slug', 'version_slug')
    LOOP
        is_json := r.data_type = 'jsonb';
        FOR m IN SELECT old_path, new_path FROM _seo_link_map LOOP
            EXECUTE format(
                'UPDATE %I SET %I = regexp_replace(%I::text, %L, %L, %L)%s WHERE %I::text ~ %L',
                r.table_name, r.column_name, r.column_name,
                '/' || m.old_path || '(?=[/"?#)\s]|$)', '/' || m.new_path, 'g',
                CASE WHEN is_json THEN '::jsonb' ELSE '' END,
                r.column_name, '/' || m.old_path || '([/"?#)\s]|$)');
        END LOOP;
    END LOOP;
END $$;

-- ───────── 2. Ссылки на несуществующие кейсы и карточки без страниц ─────────
DO $$
DECLARE r record;
BEGIN
    FOR r IN SELECT table_name FROM information_schema.columns
             WHERE table_schema = 'public' AND column_name = 'inline_link'
    LOOP
        EXECUTE format(
            'UPDATE %I SET inline_link = NULL WHERE inline_link LIKE %L AND NOT EXISTS (
                 SELECT 1 FROM cases c WHERE inline_link = %L || c.slug || %L)',
            r.table_name, '/kejsy/%', '/kejsy/', '/');
    END LOOP;
END $$;

DELETE FROM services_blocks_services_grid_items
 WHERE slug IN ('promyshlennyj-alpinizm/fasad', 'promyshlennyj-alpinizm/krovlya');
DELETE FROM _services_v_blocks_services_grid_items
 WHERE slug IN ('promyshlennyj-alpinizm/fasad', 'promyshlennyj-alpinizm/krovlya');

-- ───────── 3. Жуковский: zhukovskij → zhukovsky ─────────
DO $$
DECLARE keep_id int; dup_id int;
BEGIN
    SELECT id INTO keep_id FROM districts WHERE slug = 'zhukovsky';
    SELECT id INTO dup_id FROM districts WHERE slug = 'zhukovskij';
    IF keep_id IS NULL OR dup_id IS NULL THEN
        RETURN;
    END IF;

    -- гео-черновики дубля, у которых у zhukovsky уже есть пара — удаляем (уникальный индекс)
    DELETE FROM _service_districts_v v USING service_districts sd
     WHERE v.parent_id = sd.id AND sd.district_id = dup_id
       AND EXISTS (SELECT 1 FROM service_districts k
                    WHERE k.district_id = keep_id AND k.service_id = sd.service_id
                      AND k.sub_service_slug IS NOT DISTINCT FROM sd.sub_service_slug);
    DELETE FROM service_districts sd
     WHERE sd.district_id = dup_id
       AND EXISTS (SELECT 1 FROM service_districts k
                    WHERE k.district_id = keep_id AND k.service_id = sd.service_id
                      AND k.sub_service_slug IS NOT DISTINCT FROM sd.sub_service_slug);
    -- остальные (уборка территории) переносим
    UPDATE service_districts SET district_id = keep_id WHERE district_id = dup_id;
    UPDATE _service_districts_v SET version_district_id = keep_id WHERE version_district_id = dup_id;

    UPDATE cases SET district_id = keep_id WHERE district_id = dup_id;
    UPDATE _cases_v SET version_district_id = keep_id WHERE version_district_id = dup_id;
    UPDATE reviews SET district_id = keep_id WHERE district_id = dup_id;
    UPDATE _reviews_v SET version_district_id = keep_id WHERE version_district_id = dup_id;
    UPDATE leads SET district_id = keep_id WHERE district_id = dup_id;
    UPDATE authors_rels SET districts_id = keep_id WHERE districts_id = dup_id;
    UPDATE _authors_v_rels SET districts_id = keep_id WHERE districts_id = dup_id;
    UPDATE blog_rels SET districts_id = keep_id WHERE districts_id = dup_id;
    UPDATE _blog_v_rels SET districts_id = keep_id WHERE districts_id = dup_id;
    DELETE FROM districts_rels WHERE districts_id = dup_id AND parent_id = keep_id;
    UPDATE districts_rels SET districts_id = keep_id WHERE districts_id = dup_id;
    DELETE FROM _districts_v_rels WHERE districts_id = dup_id;

    DELETE FROM _districts_v WHERE parent_id = dup_id;
    DELETE FROM districts WHERE id = dup_id;
END $$;

-- пути /<раздел>/zhukovskij/ в текстах и ссылках (slug кейсов вида «…-zhukovskij» не трогаем)
DO $$
DECLARE r record; is_json boolean;
BEGIN
    FOR r IN SELECT table_name, column_name, data_type FROM information_schema.columns
             WHERE table_schema = 'public' AND data_type IN ('text', 'character varying', 'jsonb')
               AND table_name NOT IN ('audit_log', 'leads', 'users', 'rum_metrics', 'payload_migrations',
                                      'payload_preferences', 'payload_locked_documents')
               AND column_name NOT IN ('version_slug')
    LOOP
        is_json := r.data_type = 'jsonb';
        EXECUTE format(
            'UPDATE %I SET %I = regexp_replace(%I::text, %L, %L, %L)%s WHERE %I::text ~ %L',
            r.table_name, r.column_name, r.column_name,
            '(^|/)(raiony|arboristika|chistka-krysh|demontazh|vyvoz-musora|uborka-territorii|dizain-landshafta)/zhukovskij(?=[/"?#)\s]|$)',
            '\1\2/zhukovsky', 'g',
            CASE WHEN is_json THEN '::jsonb' ELSE '' END,
            r.column_name,
            '(^|/)(raiony|arboristika|chistka-krysh|demontazh|vyvoz-musora|uborka-territorii|dizain-landshafta)/zhukovskij([/"?#)\s]|$)');
    END LOOP;
END $$;

-- ───────── 4. Публикация ─────────
UPDATE _services_v SET version__status = 'published'
 WHERE latest = true AND version__status = 'draft'
   AND parent_id IN (SELECT id FROM services WHERE slug = 'dizain-landshafta' AND _status = 'draft');
UPDATE services SET _status = 'published' WHERE slug = 'dizain-landshafta' AND _status = 'draft';

UPDATE blog SET _status = 'draft'
 WHERE _status = 'published' AND (slug IS NULL OR slug = '') AND (title IS NULL OR title = '');

-- ───────── 5. Выдуманные отзывы и рейтинги главной ─────────
DELETE FROM homepage_reviews;
DELETE FROM homepage_review_sources;

-- ───────── 5a. Упоминание ИИ в FAQ главной (правило владельца: клиенту ИИ не упоминаем) ─────────
UPDATE homepage_faq
   SET answer = replace(answer, 'AI распознаёт тип, размеры, состояние; диспетчер уточняет вручную. В течение 10 минут возвращается диапазон цены, зафиксированный на 14 дней.', 'Менеджер оценит тип объекта, размеры и состояние и в течение 10 минут пришлёт диапазон цены, зафиксированный на 14 дней.')
 WHERE answer LIKE '%AI распознаёт тип, размеры, состояние%';

-- ───────── 6. Контакты в SiteChrome ─────────
INSERT INTO site_chrome (contacts_phone_display, contacts_phone_e164, contacts_email,
                         requisites_address_region, requisites_address_locality,
                         requisites_street_address, requisites_postal_code,
                         footer_privacy_url, updated_at, created_at)
SELECT '+7 (985) 170-51-11', '+79851705111', 'partner@obikhod.ru',
       'Московская область', 'Жуковский', 'ул. Амет-хан Султана, 15, к1', '140185',
       '/politika-konfidentsialnosti/', now(), now()
 WHERE NOT EXISTS (SELECT 1 FROM site_chrome);

UPDATE site_chrome SET
    contacts_phone_display = COALESCE(NULLIF(contacts_phone_display, ''), '+7 (985) 170-51-11'),
    contacts_phone_e164 = COALESCE(NULLIF(contacts_phone_e164, ''), '+79851705111'),
    contacts_email = CASE WHEN contacts_email IS NULL OR contacts_email IN ('', 'hi@obikhod.ru', 'hello@obikhod.ru')
                          THEN 'partner@obikhod.ru' ELSE contacts_email END,
    requisites_address_region = COALESCE(NULLIF(requisites_address_region, ''), 'Московская область'),
    requisites_address_locality = COALESCE(NULLIF(requisites_address_locality, ''), 'Жуковский'),
    requisites_street_address = COALESCE(NULLIF(requisites_street_address, ''), 'ул. Амет-хан Султана, 15, к1'),
    requisites_postal_code = COALESCE(NULLIF(requisites_postal_code, ''), '140185');

COMMIT;
