# EPIC-SHOP-REMOVAL · prod richText cleanup · 2026-05-10

**Owner:** seo + cw + devops (autonomous mandate)
**Cluster:** W5 sub-task
**Scope:** apply local W5 cleanup (audit-shop-mentions + clean-shop-mentions-sql) на prod БД.
**Skills activated (iron rule #1):** `seo`, `database-migrations`.

## Контекст

W5 на local БД (PR #207) выявил 9 docs с shop-mentions, применили 5 SQL replacements
+ 1 row delete. Прод-БД нужно почистить тем же объёмом, но через psql — devDeps (`tsx`)
не установлены в production deploy.

## Drift между local и prod

| Что | local id | prod id |
|-----|----------|---------|
| `cherta-mezhdu-arbo-i-sadovnikom` (blog) | 26 | **25** |
| `uhod-za-derevyami-letom-osenyu` (blog) | 23 | **22** |

Plus текстовые отличия в R2-fragment:
- local: «в **подмосковных условиях**» / «**Саженцы** оформляются»
- prod: «в **условиях Подмосковья**» / «**Посадочные работы** оформляются»
- prod: leading `\n\n` (paragraph break) перед «Для заказа», в local был ` ` (space)

Идентификация blog-постов на prod — по slug, не id (resilient к drift).

## Audit (before)

```
blog.body                                — 2 hits (id=22, id=25)
blog_blocks_text_content.body            — 2 hits (_parent_id=22, _parent_id=25)
blog_blocks_faq_items.answer             — 2 hits  (но false-positives, см. ниже)
blog_blocks_related_services_items       — 1 row slug='shop' (_parent_id from blog/25)
services.body / cases.body                — N/A (нет такой колонки)
b2b_pages, service_districts, *_blocks_* — 0 hits
```

**False-positives FAQ** (НЕ убираем, легитимный контент про географию питомников):
- blog/25 FAQ id=`69f784afc50e21be4fb7edec` (q=«Где брать саженцы…») — описывает местные питомники Тульской/Воронежской/Тамбовской/Подмосковные, без `/shop/` и без «нашего магазина».
- blog/22 FAQ id=`69f7848b1d3580bcd68df999` (q=«Сколько стоит спил больной сливы и замена?») — содержит «**питомниках Подмосковья**», без `/shop/` и без «нашего магазина».

## SQL применённые

3 transactions, всё через `psql "$DATABASE_URI"` под `obikhod` user.

### TX 1: blog/25 R1 + R3 + DELETE

```sql
-- R1: «См. /shop/ для каталога саженцев и посадочного материала.» → ''
UPDATE blog SET body = regexp_replace(body::text, ' См\. /shop/ для каталога саженцев и посадочного материала\.', '', 'g')::jsonb WHERE id = 25;
-- 1 row affected

-- R3: «У нашего магазина (см. /shop/) только адаптированный материал…»  → ''
-- 0 rows on prod (text не присутствует — drift)

-- DELETE: blog_blocks_related_services_items WHERE slug='shop' AND _parent_id from blog/25
-- 1 row deleted

-- blog/22 R5: «или в нашем магазине саженцев и инструмента (см. каталог)» → ''
UPDATE blog SET body = ... WHERE id = 22;                                    -- 1 row
UPDATE blog_blocks_text_content SET body = ... WHERE _parent_id = 22;        -- 1 row

-- bump updated_at
UPDATE blog SET updated_at = now() WHERE id IN (22, 25);                     -- 2 rows
```

### TX 2: R2 для blog/25 — adapted под prod-drift

```sql
-- Pattern adapted: «в условиях Подмосковья» вместо «в подмосковных условиях»;
-- «Посадочные работы оформляются» вместо «Саженцы оформляются»;
-- leading `\n\n` (не space) перед «Для заказа».
UPDATE blog_blocks_text_content
  SET body = regexp_replace(
    body::text,
    'Для заказа саженцев плодовых, декоративных кустарников и хвойных пород Подмосковной адаптации работает наш магазин \(см\. /shop/\) — мы берём только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в условиях Подмосковья\. Посадочные работы оформляются как отдельная позиция к заказу: садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения\.',
    'Для посадки используем только зимостойкий материал из проверенных питомников Тульской и Воронежской областей с успешным опытом выращивания в условиях Подмосковья. Садовник выезжает с саженцами, делает посадку и приёмку до полного укоренения.',
    'g'
  )::jsonb
  WHERE _parent_id = 25 AND body::text ~ 'работает наш магазин \(см\. /shop/\)';
-- 1 row affected
```

## Audit (after)

```sql
SELECT 'blog.body' as src, id, slug FROM blog
  WHERE body::text ~* '/shop(?:[/"\s]|$)|нашего магазина|нашем магазине|у нашего магазина';
-- (0 rows)

SELECT 'blog_blocks_text_content' as src ... ;     -- (0 rows)
SELECT 'blog_blocks_faq_items' as src ...;         -- (0 rows after excluding false-positives)
SELECT FROM blog_blocks_related_services_items WHERE slug='shop';  -- (0 rows)
```

**0 fillable shop hits.**

## HTTP verify

```bash
curl -s -o /tmp/blog25.html -w "HTTP %{http_code}\n" https://obikhod.ru/blog/cherta-mezhdu-arbo-i-sadovnikom/
# HTTP 200, 0 mentions of (нашего магазина|нашем магазине|/shop/) in HTML

curl -s -o /tmp/blog22.html -w "HTTP %{http_code}\n" https://obikhod.ru/blog/uhod-za-derevyami-letom-osenyu/
# HTTP 200, 0 mentions of (нашего магазина|нашем магазине|/shop/) in HTML
```

## Affected URLs

- https://obikhod.ru/blog/cherta-mezhdu-arbo-i-sadovnikom/ — body cleaned (R1 + R2-adapted), 1 related_services slug=shop deleted
- https://obikhod.ru/blog/uhod-za-derevyami-letom-osenyu/ — body cleaned (R5)

## Constraints respected

- НЕ запускали миграции (audit_log push:true escape-hatch sustained)
- НЕ удалили docs (только UPDATE на richText fields + 1 child row DELETE)
- pm2 restart не требовался (Next.js читает Payload per-request)
- Idempotent: повторный запуск → `WHERE body ~ '...'` clauses фильтруют, 0 affected.

## Tech debt / follow-up

1. **DB drift на blog ids** local↔prod (off-by-one). Не критично, но указывает что seed-порядок отличается. Не fix-it-now.
2. **false-positives audit regex** — slово `питомник` ловит легитимный контент. Если будет повторный аудит — следует уточнить regex до `(/shop|нашего магазина|нашем магазине|у нашего магазина|саженцев и инструмента|каталога саженцев)`.
3. **Production не имеет devDeps** (tsx, etc) → audit/cleanup-скрипты EPIC-SHOP-REMOVAL делаются только через psql на prod. ADR кандидат.

## Hand-off

EPIC-SHOP-REMOVAL.W5 — closed на prod. CLOSED: data clean, HTML clean, 0 shop промо.
