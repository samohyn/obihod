-- Районы: центр [долгота, широта] и расстояние от МКАД, км (план 09, этап 7.4). Было: у 22 районов заглушка —
-- центр Москвы и «30 км», из-за неё гео-страницы обещали аварийный выезд за 2 часа в Серпухов и Клин,
-- а «соседние районы» нельзя было посчитать. Источник — открытые таблицы расстояний (сверено с Perplexity 26.10.2026).
-- Обновляется и строка района, и его последняя версия: админка берёт за основу последнюю версию.
UPDATE "districts" SET "center_geo" = '[37.9581, 55.8094]'::jsonb, "distance_from_mkad" = 5 WHERE "slug" = 'balashikha';
UPDATE "_districts_v" SET "version_center_geo" = '[37.9581, 55.8094]'::jsonb, "version_distance_from_mkad" = 5 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'balashikha');
UPDATE "districts" SET "center_geo" = '[37.48, 55.15]'::jsonb, "distance_from_mkad" = 50 WHERE "slug" = 'chekhov';
UPDATE "_districts_v" SET "version_center_geo" = '[37.48, 55.15]'::jsonb, "version_distance_from_mkad" = 50 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'chekhov');
UPDATE "districts" SET "center_geo" = '[37.52, 56.34]'::jsonb, "distance_from_mkad" = 48 WHERE "slug" = 'dmitrov';
UPDATE "_districts_v" SET "version_center_geo" = '[37.52, 56.34]'::jsonb, "version_distance_from_mkad" = 48 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'dmitrov');
UPDATE "districts" SET "center_geo" = '[37.5, 55.95]'::jsonb, "distance_from_mkad" = 6 WHERE "slug" = 'dolgoprudnyj';
UPDATE "_districts_v" SET "version_center_geo" = '[37.5, 55.95]'::jsonb, "version_distance_from_mkad" = 6 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'dolgoprudnyj');
UPDATE "districts" SET "center_geo" = '[37.75, 55.44]'::jsonb, "distance_from_mkad" = 15 WHERE "slug" = 'domodedovo';
UPDATE "_districts_v" SET "version_center_geo" = '[37.75, 55.44]'::jsonb, "version_distance_from_mkad" = 15 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'domodedovo');
UPDATE "districts" SET "center_geo" = '[38.45, 55.79]'::jsonb, "distance_from_mkad" = 41 WHERE "slug" = 'elektrostal';
UPDATE "_districts_v" SET "version_center_geo" = '[38.45, 55.79]'::jsonb, "version_distance_from_mkad" = 41 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'elektrostal');
UPDATE "districts" SET "center_geo" = '[38.05, 55.96]'::jsonb, "distance_from_mkad" = 27 WHERE "slug" = 'fryazino';
UPDATE "_districts_v" SET "version_center_geo" = '[38.05, 55.96]'::jsonb, "version_distance_from_mkad" = 27 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'fryazino');
UPDATE "districts" SET "center_geo" = '[36.86, 55.92]'::jsonb, "distance_from_mkad" = 35 WHERE "slug" = 'istra';
UPDATE "_districts_v" SET "version_center_geo" = '[36.86, 55.92]'::jsonb, "version_distance_from_mkad" = 35 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'istra');
UPDATE "districts" SET "center_geo" = '[37.43, 55.9]'::jsonb, "distance_from_mkad" = 3 WHERE "slug" = 'khimki';
UPDATE "_districts_v" SET "version_center_geo" = '[37.43, 55.9]'::jsonb, "version_distance_from_mkad" = 3 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'khimki');
UPDATE "districts" SET "center_geo" = '[36.73, 56.33]'::jsonb, "distance_from_mkad" = 66 WHERE "slug" = 'klin';
UPDATE "_districts_v" SET "version_center_geo" = '[36.73, 56.33]'::jsonb, "version_distance_from_mkad" = 66 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'klin');
UPDATE "districts" SET "center_geo" = '[37.83, 55.91]'::jsonb, "distance_from_mkad" = 12 WHERE "slug" = 'korolyov';
UPDATE "_districts_v" SET "version_center_geo" = '[37.83, 55.91]'::jsonb, "version_distance_from_mkad" = 12 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'korolyov');
UPDATE "districts" SET "center_geo" = '[37.86, 55.66]'::jsonb, "distance_from_mkad" = 2 WHERE "slug" = 'kotelniki';
UPDATE "_districts_v" SET "version_center_geo" = '[37.86, 55.66]'::jsonb, "version_distance_from_mkad" = 2 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'kotelniki');
UPDATE "districts" SET "center_geo" = '[37.33, 55.82]'::jsonb, "distance_from_mkad" = 4 WHERE "slug" = 'krasnogorsk';
UPDATE "_districts_v" SET "version_center_geo" = '[37.33, 55.82]'::jsonb, "version_distance_from_mkad" = 4 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'krasnogorsk');
UPDATE "districts" SET "center_geo" = '[37.04, 55.6]'::jsonb, "distance_from_mkad" = 29 WHERE "slug" = 'krasnoznamensk';
UPDATE "_districts_v" SET "version_center_geo" = '[37.04, 55.6]'::jsonb, "version_distance_from_mkad" = 29 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'krasnoznamensk');
UPDATE "districts" SET "center_geo" = '[37.48, 56.01]'::jsonb, "distance_from_mkad" = 14 WHERE "slug" = 'lobnya';
UPDATE "_districts_v" SET "version_center_geo" = '[37.48, 56.01]'::jsonb, "version_distance_from_mkad" = 14 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'lobnya');
UPDATE "districts" SET "center_geo" = '[37.89, 55.68]'::jsonb, "distance_from_mkad" = 2 WHERE "slug" = 'lyubertsy';
UPDATE "_districts_v" SET "version_center_geo" = '[37.89, 55.68]'::jsonb, "version_distance_from_mkad" = 2 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'lyubertsy');
UPDATE "districts" SET "center_geo" = '[37.73, 55.91]'::jsonb, "distance_from_mkad" = 9 WHERE "slug" = 'mytishchi';
UPDATE "_districts_v" SET "version_center_geo" = '[37.73, 55.91]'::jsonb, "version_distance_from_mkad" = 9 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'mytishchi');
UPDATE "districts" SET "center_geo" = '[38.44, 55.87]'::jsonb, "distance_from_mkad" = 37 WHERE "slug" = 'noginsk';
UPDATE "_districts_v" SET "version_center_geo" = '[38.44, 55.87]'::jsonb, "version_distance_from_mkad" = 37 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'noginsk');
UPDATE "districts" SET "center_geo" = '[37.28, 55.68]'::jsonb, "distance_from_mkad" = 5 WHERE "slug" = 'odincovo';
UPDATE "_districts_v" SET "version_center_geo" = '[37.28, 55.68]'::jsonb, "version_distance_from_mkad" = 5 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'odincovo');
UPDATE "districts" SET "center_geo" = '[38.96, 55.81]'::jsonb, "distance_from_mkad" = 78 WHERE "slug" = 'orekhovo-zuevo';
UPDATE "_districts_v" SET "version_center_geo" = '[38.96, 55.81]'::jsonb, "version_distance_from_mkad" = 78 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'orekhovo-zuevo');
UPDATE "districts" SET "center_geo" = '[37.55, 55.43]'::jsonb, "distance_from_mkad" = 16 WHERE "slug" = 'podolsk';
UPDATE "_districts_v" SET "version_center_geo" = '[37.55, 55.43]'::jsonb, "version_distance_from_mkad" = 16 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'podolsk');
UPDATE "districts" SET "center_geo" = '[37.87, 56.02]'::jsonb, "distance_from_mkad" = 19 WHERE "slug" = 'pushkino';
UPDATE "_districts_v" SET "version_center_geo" = '[37.87, 56.02]'::jsonb, "version_distance_from_mkad" = 19 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'pushkino');
UPDATE "districts" SET "center_geo" = '[38.23, 55.57]'::jsonb, "distance_from_mkad" = 35 WHERE "slug" = 'ramenskoye';
UPDATE "_districts_v" SET "version_center_geo" = '[38.23, 55.57]'::jsonb, "version_distance_from_mkad" = 35 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'ramenskoye');
UPDATE "districts" SET "center_geo" = '[37.86, 55.76]'::jsonb, "distance_from_mkad" = 1 WHERE "slug" = 'reutov';
UPDATE "_districts_v" SET "version_center_geo" = '[37.86, 55.76]'::jsonb, "version_distance_from_mkad" = 1 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'reutov');
UPDATE "districts" SET "center_geo" = '[38.13, 56.3]'::jsonb, "distance_from_mkad" = 55 WHERE "slug" = 'sergiev-posad';
UPDATE "_districts_v" SET "version_center_geo" = '[38.13, 56.3]'::jsonb, "version_distance_from_mkad" = 55 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'sergiev-posad');
UPDATE "districts" SET "center_geo" = '[37.41, 54.92]'::jsonb, "distance_from_mkad" = 73 WHERE "slug" = 'serpukhov';
UPDATE "_districts_v" SET "version_center_geo" = '[37.41, 54.92]'::jsonb, "version_distance_from_mkad" = 73 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'serpukhov');
UPDATE "districts" SET "center_geo" = '[37.97, 55.93]'::jsonb, "distance_from_mkad" = 19 WHERE "slug" = 'shchelkovo';
UPDATE "_districts_v" SET "version_center_geo" = '[37.97, 55.93]'::jsonb, "version_distance_from_mkad" = 19 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'shchelkovo');
UPDATE "districts" SET "center_geo" = '[37.71, 55.55]'::jsonb, "distance_from_mkad" = 7 WHERE "slug" = 'vidnoe';
UPDATE "_districts_v" SET "version_center_geo" = '[37.71, 55.55]'::jsonb, "version_distance_from_mkad" = 7 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'vidnoe');
UPDATE "districts" SET "center_geo" = '[38.65, 55.32]'::jsonb, "distance_from_mkad" = 76 WHERE "slug" = 'voskresensk';
UPDATE "_districts_v" SET "version_center_geo" = '[38.65, 55.32]'::jsonb, "version_distance_from_mkad" = 76 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'voskresensk');
UPDATE "districts" SET "center_geo" = '[38.12, 55.6]'::jsonb, "distance_from_mkad" = 23 WHERE "slug" = 'zhukovsky';
UPDATE "_districts_v" SET "version_center_geo" = '[38.12, 55.6]'::jsonb, "version_distance_from_mkad" = 23 WHERE "latest" = true AND "parent_id" = (SELECT "id" FROM "districts" WHERE "slug" = 'zhukovsky');

-- Главная: «Полный прайс» ведёт на прайс, а не на список услуг (пробел 5 из contex/11_page_templates.md).
UPDATE "pages_blocks_price_tabs" SET "link_href" = '/uslugi/tseny/' WHERE "link_label" = 'Полный прайс' AND "link_href" = '/uslugi/';
UPDATE "_pages_v_blocks_price_tabs" SET "link_href" = '/uslugi/tseny/' WHERE "link_label" = 'Полный прайс' AND "link_href" = '/uslugi/';
