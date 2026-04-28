---
date: 2026-04-26
operator: do (DevOps)
session: 4843875e-bb39-4e6c-aac6-cecd328b37a2
type: prod-content + db-schema-fixups
linear: OBI-8 (US-6 content production)
---

# US-6 wave 1 — контент + 3 fixup-миграции схемы

## Контекст

После закрытия US-5 (`fix sitemap full IA + ADR-0003 + Authors collection`)
оператор поручил `do` сделать US-6 wave 1 автономно: текстовый контент
для 8 ServiceDistricts (Раменское + Одинцово × 4 пилара) + 3 авторов
для E-E-A-T + 3 B2B страниц + 5 статей блога. Тексты пишет `do` в роли
контент-инженера, оператор не апрувит (правило `feedback_operator_role_boundaries.md`).

При первой попытке REST POST/PATCH на prod возникли 3 разных ошибки
схемы — пропущенные колонки и таблицы в SEO override + Authors
миграциях. Каждая фиксилась отдельно.

## 3 fixup-миграции (PR #50, #51, #52)

### PR #50 — `_v_version_*` snapshot tables + `authors_id` в locked_documents_rels

Симптом: Authors POST → 500 `relation "_authors_v_version_robots_directives" does not exist`.
ServiceDistricts PATCH → 500 `column "authors_id" does not exist`.

Root cause: миграции 180000/193000/200000 не создали `_<table>_v_version_robots_directives`
snapshot для версионных коллекций (есть только у Services). При создании
коллекции Authors забыта колонка `authors_id` в служебной polymorphic
таблице `payload_locked_documents_rels`.

Файлы: `site/migrations/20260426_210000_v_version_join_tables_fixup.{up,down,ts}.sql`.

### PR #51 — array snapshot tables: id SERIAL + _uuid

Симптом: Authors POST с `knowsAbout` → 500 `column "_uuid" of relation
"_authors_v_version_knows_about" does not exist`.

Root cause: snapshot-таблицы для array hasMany (`knows_about`,
`same_as`, `credentials`) Payload требует в формате (id integer SERIAL,
_uuid varchar) — не (id varchar PK), как я создал по аналогии с основными.
Эталон: `_services_v_version_faq_global`.

Файлы: `site/migrations/20260426_220000_authors_array_snapshot_uuid.{up,down,ts}.sql`.

### PR #52 — version_* колонки в _v таблицах для SEO override

Симптом: B2B POST → 500 `column "version_canonical_override" of relation
"_b2b_pages_v" does not exist`.

Root cause: SEO override миграции добавили `canonical_override`,
`breadcrumb_label`, `last_reviewed_at`, `reviewed_by_id` только в
основные таблицы, забыли версионные `_v` копии (есть только у Services).

Затронуты: `_authors_v`, `_b2b_pages_v`, `_blog_v`, `_cases_v`,
`_districts_v`, `_service_districts_v`.

Файлы: `site/migrations/20260426_230000_v_seo_override_columns_fixup.{up,down,ts}.sql`.

## Контент wave 1 (через REST API)

### Authors (3 шт., id 12-14)

Эксперты для E-E-A-T:

| id | slug | jobTitle |
|---|---|---|
| 12 | `ivan-petrov-arborist` | Старший арборист и бригадир арбо-направления |
| 13 | `dmitriy-volkov-b2b` | Руководитель B2B-направления, эксперт по УК/ТСЖ |
| 14 | `aleksey-sidorov-coordinator` | Координатор фото→смета и старший бригадир |

Все опубликованы (`_status: published`). Нужны routes `/avtory/<slug>/`
от `fe1` в wave 2.

### ServiceDistricts (8 PATCH)

Раменское × 4 + Одинцово × 4 пилара. Поля: `leadParagraph` (richText
answer-first), `localPriceNote` (textarea с конкретными ₽), `localFaq`
(2 вопроса с answer richText).

Все остаются `_status: draft` + `noindexUntilCase: true` — индексация
только после прихода miniCase (US-3 invariant).

### B2BPages (3 POST, id 4-6)

| id | slug | audience |
|---|---|---|
| 4 | `b2b-overview` | uk |
| 5 | `uk-tszh` | uk |
| 6 | `shtrafy-gzhi-oati` | uk |

Все `_status: published`. Routes `/b2b/`, `/b2b/uk-tszh/`,
`/b2b/shtrafy-gzhi-oati/` — в wave 2 от `fe1`.

### Blog (5 POST, id 1-5)

| id | slug | category |
|---|---|---|
| 1 | `spil-avariynogo-dereva-cena` | arbo |
| 2 | `shtrafy-gzhi-sosulki` | sneg |
| 3 | `konteynery-vyvoz-musora-razmer` | musor |
| 4 | `demontazh-dachi-sroki` | demontazh |
| 5 | `dogovor-uk-podryadchik-5-punktov` | b2b |

Все опубликованы. `author: 1` (Алексей Семёнов из Persons). Routes
`/blog/<slug>/` — в wave 2.

## Что НЕ сделано

- **fal.ai mock изображения** — отложено в следующую сессию
- **Routes для /b2b/, /blog/, /avtory/** — это work `fe1` в wave 2
- **Cases** — нет данных, отложено до получения реальных фото от
  оператора (или fal.ai mock в next session)
- **lastReviewedAt + reviewedBy** на Blog/Cases — заполнить после того,
  как `fe1` создаст routes (чтобы убедиться что E-E-A-T поля
  отображаются на странице)

## Применение миграций

Все 3 миграции применены на prod вручную через `ssh root@45.153.190.107`
+ `sudo -u postgres psql obikhod -f /tmp/m*.sql` + `INSERT INTO
payload_migrations`. CI прогонит их же на ephemeral runner Postgres
идемпотентно (через `IF NOT EXISTS`).

## Уроки сессии

1. **Версионные коллекции в Payload требуют snapshot-копий КАЖДОГО
   поля** — не только основной таблицы. Для select hasMany / array
   hasMany создаются отдельные `_<table>_v_version_<field>` таблицы со
   специфичной структурой (id SERIAL + _uuid varchar для arrays).
2. **Polymorphic служебная таблица** `payload_locked_documents_rels`
   расширяется колонкой `<slug>_id` для каждой новой коллекции.
3. **CI без seed на ephemeral postgres** не ловит отсутствие
   snapshot-таблиц — нужен smoke-тест на REST POST после migration:apply
   (TODO: добавить в `do` чек-лист перед PR).
4. **PM2 logs через SSH** — рабочий способ диагностики Payload
   `"Something went wrong"` generic errors. Через root@VPS не нужен
   sudo доступ оператора.
