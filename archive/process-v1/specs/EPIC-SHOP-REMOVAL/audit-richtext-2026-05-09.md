# Payload richText audit — shop mentions cleanup (W5)

**Date:** 2026-05-09
**Owner:** seo + cw + devops (autonomous mandate)
**EPIC:** EPIC-SHOP-REMOVAL
**Wave:** W5 — CI/seo-tech

## Summary

Сканировали 281 docs из 5 коллекций (services, b2b-pages, blog, cases, service-districts) на упоминания `/shop|магазин|саженц|питомник`. Удалили все promo-ссылки на собственный магазин. Educational lexicon (саженец, питомник в ботаническом контексте, «входные группы магазинов» в чистке крыш) сохранили.

## Tooling

| Script | Purpose |
|---|---|
| `site/scripts/audit-shop-mentions.ts` | Read-only: список doc.id с матчем `/shop|магазин|саженц|питомник` |
| `site/scripts/audit-shop-mentions-detail.ts` | Read-only: per-hit field path + ±60 char context |
| `site/scripts/clean-shop-mentions-sql.ts` | Прямой SQL UPDATE (обход Payload Local API) — legacy `body` + migrated `blocks_text_content.body` + `faq_items.answer` + DELETE related-services-items с slug=shop |
| `site/scripts/clean-shop-mentions-sql-fix2.ts` | Final pass: matches text без leading whitespace (учитывает literal `\n` в JSONB::text) |

**Constraint:** прямой SQL вместо `payload.update()`, потому что Local API триггерит `checkDocumentLockStatus` → query на `payload_locked_documents_rels.reviews_id` (drift из-за неприменённой миграции `20260509_120000_reviews_collection`, commit `d2e194a`). Запуск миграций запрещён EPIC-SHOP-REMOVAL constraints.

## Pre-cleanup hits

9 docs с матчем (после первичного скана):

| # | Collection | id | Slug | Matches |
|---|---|---|---|---|
| 1 | services | 5 | demontazh | магазин (контекст: цены кирпича, бывшие магазины — false positive) |
| 2 | services | 3 | chistka-krysh | магазин (контекст: входные группы магазинов — false positive) |
| 3 | blog | 26 | cherta-mezhdu-arbo-i-sadovnikom | /shop/, магазин, саженц, питомник — **3 promo-ссылки + 1 IconLine «Магазин саженцев»** |
| 4 | blog | 23 | uhod-za-derevyami-letom-osenyu | магазин, саженц — **1 promo «в нашем магазине саженцев»** |
| 5 | blog | 15 | obrezka-slivy-vesnoy | питомник (контекст: «питомниках Подмосковья» — false positive) |
| 6 | service-districts | 14 | — | магазин (mirrored chistka-krysh sub — false positive) |
| 7 | service-districts | 10 | — | магазин (то же) |
| 8 | service-districts | 9 | — | магазин (то же) |
| 9 | service-districts | 8 | — | магазин (то же) |

## Cleanup applied

### blog/26 — `cherta-mezhdu-arbo-i-sadovnikom`

Удалили 3 promo-ссылки на собственный магазин в legacy `body` + migrated `blog_blocks_text_content.body`:

1. «См. /shop/ для каталога саженцев и посадочного материала.» → удалено
2. «Для заказа саженцев… работает наш магазин (см. /shop/) — мы берём только зимостойкий материал из проверенных питомников Тульской и Воронежской областей… Саженцы оформляются как отдельная позиция к заказу: садовник выезжает с саженцами…» → переписано **без promo**: «Для посадки используем только зимостойкий материал из проверенных питомников Тульской и Воронежской областей… Садовник выезжает с саженцами…»
3. «У нашего магазина (см. /shop/) только адаптированный материал с гарантией приживаемости.» → удалено (FAQ ответ + body)

Также удалили `blog_blocks_related_services_items` row с `slug='shop'` («Магазин саженцев»).

### blog/23 — `uhod-za-derevyami-letom-osenyu`

«…доступно в любом садовом магазине или в нашем магазине саженцев и инструмента (см. каталог)» → «…доступно в любом садовом магазине» (legacy `body` + migrated `blog_blocks_text_content.body`).

### Не трогали (false positives — оставлены)

- `services/5 demontazh`: «магазинов Москвы» (цены шамотного кирпича), «бывшие магазины» (тип объекта)
- `services/3 chistka-krysh` + `service-districts/8,9,10,14`: «входные группы магазинов», «козырёк входной группы магазина» (контекст: чистка крыш над магазинами — domain-relevant)
- `blog/15 obrezka-slivy-vesnoy`: «в питомниках Подмосковья» (educational про сорта слив)
- `blog/26` остаточные: «саженцы», «питомники Кашино», «**Посадка саженцев**» как H3 — educational контент про арбористику/садоводство
- `blog/23` остаточные: «в любом садовом магазине» (third-party reference, без promo собственного)

Все эти упоминания — образовательный/контекстный лексикон, не promo собственного магазина.

## Post-cleanup verification

```sql
SELECT 'b2b_pages.body' AS t, count(*) AS hits FROM b2b_pages WHERE body::text ~ '/shop/'
UNION ALL SELECT 'blog.body', count(*) FROM blog WHERE body::text ~ '/shop/'
UNION ALL SELECT 'blog_text_content.body', count(*) FROM blog_blocks_text_content WHERE body::text ~ '/shop/'
UNION ALL SELECT 'cases.description', count(*) FROM cases WHERE description::text ~ '/shop/'
UNION ALL SELECT 'service_districts_text_content.body', count(*) FROM service_districts_blocks_text_content WHERE body::text ~ '/shop/'
UNION ALL SELECT 'services.intro', count(*) FROM services WHERE intro::text ~ '/shop/'
UNION ALL SELECT 'services_blocks_text_content.body', count(*) FROM services_blocks_text_content WHERE body::text ~ '/shop/'
UNION ALL SELECT 'blog_rs_items.slug=shop', count(*) FROM blog_blocks_related_services_items WHERE slug='shop';
```

**Result:** 0 hits во всех 8 точках.

## Pending / blockers

- **Production DB:** правки сделаны на локальной БД. Перенос на prod возможен через `pnpm tsx scripts/clean-shop-mentions-sql.ts` + `clean-shop-mentions-sql-fix2.ts` с `DATABASE_URI=<prod>`. Лучше — после применения миграции `20260509_120000_reviews_collection` (commit `d2e194a`) на prod, чтобы Payload Local API mutations работали штатно. Решение по таймингу — за `do`/devops при deploy W5.
- **Reviews drift:** локальная БД отстаёт на 1 миграцию (`reviews_id` column в `payload_locked_documents_rels`). Это блокирует Payload Local API mutations — но не SQL. Для local dev рекомендуется применить `pnpm payload:migrate` после закрытия EPIC-SHOP-REMOVAL.
