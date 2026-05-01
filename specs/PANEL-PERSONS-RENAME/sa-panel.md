---
us: PANEL-PERSONS-RENAME
title: Persons → Authors merge (variant b)
team: panel
po: popanel
type: refactor
priority: C
segment: admin
phase: spec-approved
role: sa-panel
status: dev-blocked-by-us-12-release
related: [US-12-admin-redesign, PANEL-UX-AUDIT]
created: 2026-05-01
updated: 2026-05-01
popanel_review: approved 2026-05-01 (autonomous mandate) — defaults sound, R3 mitigation matches US-12 W6 fixup pattern, 7 AC sufficient, dev start unblocks after US-12 closure
skills: [product-capability, design-system]
skills_activated: [product-capability, design-system]
---

# PANEL-PERSONS-RENAME — sa-panel + dba spec

**Автор:** sa-panel + dba
**Дата:** 2026-05-01
**Источник intake:** [`intake.md`](intake.md)
**Operator decision:** variant (b) merge with Authors. Default conflict
resolution для duplicate slug — keep newest + suffix `-2`. Autonomous mandate
по `feedback_autonomous_mode_full_mandate.md`.

---

## 1. Текущее состояние (factual reconnaissance 2026-05-01)

### 1.1 Schema diff

| Поле | Persons (`site/collections/Persons.ts`) | Authors (`site/collections/Authors.ts`) | Решение |
|---|---|---|---|
| `slug` | text, required, unique, index | text, required, unique, index, validate `^[a-z][a-z0-9-]{2,40}$` | **Authors wins.** Persons slugs валидируются через regex при миграции; failing → суффикс `-team`. |
| `firstName` / `lastName` | text, required | text, required, maxLength 60 | **Authors wins.** Truncate >60 chars (только `aleksey-semenov`, fits). |
| `jobTitle` | text, required | text, optional, maxLength 120 | **Authors wins.** Persons.jobTitle не пустой → переносится. Required снимаем (Authors.jobTitle optional). |
| `fullName` | — | text, autogen `${firstName} ${lastName}` через beforeChange | **Authors wins.** Автоматически заполнится при resave. |
| `bio` | richText (Lexical) | textarea, maxLength 600 | **DBA decision:** richText → plain text via Lexical extract (rootChildren → text). Truncate >600 с warning в migration log. Один Person (`Алексей Семёнов`, 168 chars plain) укладывается. |
| `photo` (upload→media) | photo | `avatar` (upload→media) | **Rename in migration:** `photo_id → avatar_id`. |
| `knowsAbout` | array `{ topic: text required }` | array `{ topic: text required maxLength 80 }`, maxRows 12 | **Authors wins.** Truncate topics >80, drop rows >12 с warning. |
| `sameAs` | array `{ url: text required }` | array `{ url: text required validate http(s):// }`, maxRows 8 | **DBA decision:** prefix `https://` если url начинается с `t.me/` или `vk.com/`. Drop rows >8 + invalid URLs с warning. |
| `credentials.year` | number | `credentials.issuedAt` (date) | **DBA decision:** `year=2018 → issuedAt='2018-01-01'`. NULL year → NULL issuedAt. |
| `credentials.name` / `issuer` | text required / text optional | text required maxLength 160 / text optional maxLength 120 | OK, fits. |
| `worksInDistricts` | relationship → districts, hasMany | — | **Add to Authors.** Новое поле в `tabs/Связи` или отдельный sidebar. **Decision:** добавить в tab «Связи» после credentials, optional, hasMany. **Миграция:** copy join rows из `persons_rels` (district links) → `authors_rels`. |
| `versions: { drafts: true }` | нет | да | После merge все Persons records переносятся как `_status: 'published'`, `_published_locale: null`. |
| `metaTitle` / `metaDescription` | — | text 60 / textarea 160 | NULL для перенесённых Persons (можно дозаполнить позже). |
| `canonicalOverride` / `robotsDirectives` | — | sidebar | NULL / default `['index','follow']` для перенесённых Persons. |

### 1.2 References (rg results)

**Collections:**
- `site/collections/Blog.ts:68` — `author { relationTo: 'persons', required: true }`
- `site/collections/Blog.ts:275` — `reviewedBy { relationTo: 'persons' }`
- `site/collections/Cases.ts:87` — `brigade { relationTo: 'persons', hasMany: true }`
- `site/collections/Cases.ts:244` — `reviewedBy { relationTo: 'persons' }`

**Config:**
- `site/payload.config.ts:16` — `import { Persons } from './collections/Persons'`
- `site/payload.config.ts:107` — `Persons` в `collections` array

**Seed:**
- `site/scripts/seed.ts:719-756` — Persons block (Алексей Семёнов, slug `aleksey-semenov`)
- `site/app/api/seed/route.ts:656-694` — same idempotent block для cms/seed endpoint
- `site/app/api/seed/route.ts:25` — comment listing «5. Persons»

**Admin UI:**
- `site/components/admin/icons.tsx:592` — `persons: PersonsIcon` (icon registry)
- (`PersonsIcon` определён выше в том же файле, проверить точную строку при implementation)

**SEO / queries:**
- `site/lib/seo/queries.ts:224-280` — Authors-only blocks (`getPublishedAuthors`, `getAuthorBySlug`, `getAllAuthorSlugs`)
- `site/lib/seo/jsonld.ts:99,335-400` — Authors type + personSchema (Authors-only)
- `site/app/sitemap.ts:86,94,164,192,299-311` — Authors-only fetcher
- `site/app/(marketing)/avtory/page.tsx`, `[slug]/page.tsx` — Authors-only

**PageCatalog (admin widget):**
- `site/components/admin/PageCatalog.tsx:155` — Authors entry (no Persons row, OK)
- `site/app/(payload)/api/admin/page-catalog/csv/route.ts:22,33` — Authors entry

**Tests:**
- `site/tests/e2e/us6-wave2a-routes.spec.ts` — Authors-only routes smoke

**Apps/shop:** `apps/` directory **не существует** (verify: `ls /Users/a36/obikhod/apps/` returns ENOENT). Cross-workspace risk = 0.

### 1.3 Data inventory (production)

- **Authors records:** seeded в US-6 W2A (количество TBD при implementation
  через `psql … "SELECT COUNT(*) FROM authors;"`). Predictable: 0-3 в dev, 0-5 в
  prod на 2026-05-01.
- **Persons records:** 1 seeded (`aleksey-semenov`) + любые добавленные
  оператором через admin (predictable: 0-2 manual). Ground truth — `psql …
  "SELECT id, slug, last_name, first_name FROM persons;"` ДО миграции.

---

## 2. Migration plan

### 2.1 Conflict resolution rules (DBA defaults)

| Сценарий | Действие |
|---|---|
| `persons.slug` нет в `authors.slug` | INSERT INTO authors как новая запись, status='published'. |
| `persons.slug` совпадает с `authors.slug` (duplicate) | INSERT INTO authors с slug `<original>-2`, **keep newest** (по `updated_at`). Старая Authors запись остаётся. |
| `persons.slug` не проходит Authors regex `^[a-z][a-z0-9-]{2,40}$` (например cyrillic, длина 2 или >40) | suffix `-team`, normalize via `slugify()`. Лог в migration output. |
| `persons.bio` (richText) пустой | NULL в `authors.bio`. |
| `persons.bio` (richText) длиннее 600 chars plain | TRUNCATE на 597 + `...`, warning в лог. |
| `persons.credentials.year=NULL` | `authors.credentials.issued_at=NULL`. |
| `persons.same_as.url` без `https://` prefix | prepend `https://` (для `t.me/x`, `vk.com/x`). Если после prepend всё равно не http(s) → drop с warning. |

### 2.2 Migration script outline (`site/migrations/<timestamp>_persons_merge_into_authors.{up,down}.sql + .ts`)

**`<timestamp>_persons_merge_into_authors.ts`** (Payload migration TypeScript wrapper):
```ts
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import fs from 'fs'
import path from 'path'

export async function up({ payload, req }: MigrateUpArgs) {
  // Phase 1: data migration — Local API loop через payload.find('persons') →
  // payload.create('authors') с conflict-resolution. Лучше Local API чем
  // raw SQL, потому что:
  //   - hooks (fullName autogen, slug validate) выполняются автоматически
  //   - join tables (knows_about, same_as, credentials) собираются
  //     корректно через nested writes
  //   - bio richText → textarea extraction делается JS-ом из Lexical AST
  // ...
}

export async function down({ payload, req }: MigrateDownArgs) {
  // Restore Persons table from snapshot (см. 2.4 rollback).
}
```

**`<timestamp>_persons_merge_into_authors.up.sql`** (post-data DDL):
```sql
-- 1. Add worksInDistricts join table for authors (mirrors persons_rels).
CREATE TABLE IF NOT EXISTS "authors_rels" ( ... );  -- если ещё нет
-- (Payload может сам создать через push в dev; на проде через миграцию.)

-- 2. Rename FK columns в Blog/Cases versions tables — NO. Мы НЕ rename
-- existing колонки blog.author_id (у неё FK persons). Вместо этого:
--   а) сначала data-migration копирует persons → authors с persistent
--      mapping в temp table _persons_to_authors_map (id_persons, id_authors).
--   б) UPDATE blog SET author_id = map.id_authors FROM _persons_to_authors_map
--      WHERE blog.author_id = map.id_persons.
--   в) ALTER TABLE blog DROP CONSTRAINT blog_author_id_fk_persons;
--   г) ALTER TABLE blog ADD CONSTRAINT blog_author_id_fk_authors FOREIGN KEY
--      (author_id) REFERENCES authors(id);
--   д) То же для blog.reviewed_by_id, cases.reviewed_by_id.
--   е) Для Cases.brigade (hasMany) — UPDATE cases_rels (или
--      cases_brigade_rels, точное имя — verify через psql \dt) аналогично.
-- (Конкретный SQL пишет dba при implementation, после `psql -c '\d blog'`.)

-- 3. DROP Persons tables в самом конце after verify:
--    DROP TABLE persons_rels CASCADE;
--    DROP TABLE persons_credentials CASCADE;
--    DROP TABLE persons_same_as CASCADE;
--    DROP TABLE persons_knows_about CASCADE;
--    DROP TABLE persons CASCADE;
-- (CASCADE — потому что версии Blog/Cases уже rebound в шаге 2 на authors.)
```

**`<timestamp>_persons_merge_into_authors.down.sql`** (rollback DDL):
```sql
-- Если миграция падает на проде — restore из pg_dump snapshot (см. 2.4).
-- DOWN-script ограниченный: пересоздаёт пустую структуру persons, но
-- данные восстанавливаются ТОЛЬКО из pre-migration snapshot.
```

### 2.3 Code changes (be-panel implementation после spec approve)

| Файл | Изменение |
|---|---|
| `site/payload.config.ts` | Удалить `import { Persons }` (line 16) и `Persons` (line 107) из collections array. |
| `site/collections/Persons.ts` | **Удалить файл** (после успешного `pnpm migrate` + verify в dev). |
| `site/collections/Authors.ts` | Добавить `worksInDistricts` field в tab «Связи» после credentials. Обновить `labels` → `{ singular: 'Автор / Сотрудник', plural: 'Авторы / Команда' }`. Обновить `admin.description` (объединить «Авторы статей и эксперты для E-E-A-T» + «Команда: арбористы, бригадиры, промальпинисты»). Обновить doc-comment вверху файла (убрать обещание «Persons — для legal/contact entities» т.к. legal/contact теперь живут в `globals/SiteChrome.requisites`). |
| `site/collections/Blog.ts:68` | `relationTo: 'persons' → 'authors'` для `author`. |
| `site/collections/Blog.ts:275` | `relationTo: 'persons' → 'authors'` для `reviewedBy`. |
| `site/collections/Cases.ts:87` | `relationTo: 'persons' → 'authors'` для `brigade`. |
| `site/collections/Cases.ts:244` | `relationTo: 'persons' → 'authors'` для `reviewedBy`. |
| `site/scripts/seed.ts:719-756` | Persons block → Authors block. Использовать `aleksey-semenov` slug + `firstName/lastName/jobTitle/bio (textarea!) /knowsAbout/sameAs/credentials/worksInDistricts`. Idempotent через `findOneBySlug(payload, 'authors', 'aleksey-semenov')`. |
| `site/app/api/seed/route.ts:656-694` | Та же замена. Обновить comment line 25. |
| `site/components/admin/icons.tsx` | Удалить `PersonsIcon` definition + entry `persons: PersonsIcon` (line 592). Authors icon уже есть (verify при implementation). |

### 2.4 Rollback plan

1. **Pre-migration snapshot (mandatory):** `dba` выполняет `pg_dump -t persons
   -t persons_rels -t persons_credentials -t persons_same_as
   -t persons_knows_about` ДО `pnpm migrate` на проде. Snapshot хранится в
   `~/backups/PANEL-PERSONS-RENAME-<timestamp>.sql` на VPS (`do` orchestrates).
2. **Trigger rollback:** если post-deploy smoke падает (`/admin` 500,
   `/avtory/<slug>/` 404, broken Blog/Cases) → `do` запускает rollback:
   - `pnpm payload migrate:down` → выполняет DOWN.sql (восстанавливает пустые
     Persons tables + переключает FKs обратно на persons если возможно).
   - `psql $DATABASE_URI -f ~/backups/PANEL-PERSONS-RENAME-<timestamp>.sql` →
     restore data в Persons tables.
   - `git revert <merge-commit>` для code changes (Blog/Cases relationTo
     возвращаются к `persons`).
3. **Test rollback на staging:** `qa-panel` обязан прогнать full
   migrate-up + migrate-down на копии prod БД ДО merge release PR.

### 2.5 Deployment sequence (do orchestration)

1. `do` отключает `push: true` для production deploy (уже отключено через
   `NODE_ENV !== 'production'` в `payload.config.ts:126`).
2. `do` снимает pg_dump snapshot (см. 2.4 шаг 1).
3. `do` деплоит код (Blog/Cases с новым `relationTo: 'authors'`, без Persons
   import).
4. **WAIT** — деплой НЕ запускается в production без апрува оператора по
   iron rule #6.
5. После апрува: `pnpm migrate` выполняется отдельным step в `deploy.yml`
   через psql (см. payload.config.ts:124-127 contract).
6. Post-deploy smoke: `/admin/collections/authors` показывает старые Authors
   + перенесённые Persons; `/blog/<slug>/` JSON-LD `author.name` отображает
   корректно; `/avtory/aleksey-semenov/` доступен (новый route для
   перенесённого Person).

---

## 3. Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Seed/migration logic ломает Persons.slug → Authors.slug при duplicate (`aleksey-semenov` существует в обеих коллекциях после dual seed) | High | Идемпотентность seed.ts через `findOneBySlug('authors', 'aleksey-semenov')` ДО create. Migration conflict resolution (см. 2.1) суффиксит `-2`. |
| R2 | `bio richText → textarea` теряет форматирование (bold, lists) | Medium | Plain text extract через Lexical AST walk (rootChildren → text concatenation). Один Person (Алексей Семёнов) — короткий plain text, риск 0%. Если cms добавит rich Persons между spec и implement — reconnaissance дублируется при implementation. |
| R3 | Payload `_blog_v_*` / `_cases_v_*` join tables ломаются при смене `relationTo` (US-12 W6 painful precedent с SeoSettings v_join_tables_fixup) | High | DBA выполняет sequential UPDATE → ALTER constraint вместо DROP+RECREATE. Payload version tables НЕ удаляются — только их FK constraints rebind. `qa-panel` smoke включает «old draft Blog post с author=`aleksey-semenov` остаётся доступным после миграции». |
| R4 | cms-роли активно работают в `Persons` параллельно — их правки потеряются между snapshot и migration | Medium | `do` запускает миграцию в окно «низкой активности» (вечер вс по МСК). Уведомление оператору ДО старта. |
| R5 | `worksInDistricts` join table миграция теряет ссылки на districts | Medium | Mapping table `_persons_to_authors_map` живёт через всю миграцию; UPDATE `persons_rels SET parent_id` использует map. Verify через row count: `SELECT COUNT(*) FROM persons_rels` ДО == `SELECT COUNT(*) FROM authors_rels WHERE field_name='worksInDistricts'` ПОСЛЕ. |
| R6 | cw-тексты (admin.description / labels) останутся с упоминанием «Persons» | Low | Spec уже определяет новый label «Авторы / Команда» и новый description. cw приглашается через handoff после dev-готовности для финальной TOV-полировки. |
| R7 | SEO impact: новый `/avtory/<slug>/` для перенесённого `aleksey-semenov` | Low | По iron rule «свежесть» это PLUS — Person получает publishable route + Person JSON-LD. Sitemap.ts автоматически подхватит. Но: если оператор не хочет «сотрудник = публичный автор» для конкретных записей — `_status: 'draft'` оставляет их вне sitemap. Migration по умолчанию ставит `_status: 'published'`; cms может drafted-down вручную после миграции. |
| R8 | Apps/shop integration risk | Zero | `apps/` directory не существует на 2026-05-01 (verify: ENOENT). Когда появится — сделают decision независимо. |

---

## 4. Acceptance Criteria

1. **Persons collection удалена:** `site/collections/Persons.ts` отсутствует;
   `payload.config.ts` не импортирует `Persons`; `/admin/collections/persons`
   возвращает 404.
2. **Все Persons records мигрированы в Authors без потери данных:** для
   каждого Persons (slug, firstName, lastName, jobTitle, bio plain text,
   photo→avatar, knowsAbout, sameAs, credentials с `year→issuedAt='YYYY-01-01'`,
   worksInDistricts) — соответствующая запись в `authors`. Verify:
   `SELECT COUNT(*) FROM authors WHERE id IN (SELECT new_id FROM
   _persons_to_authors_map)` равен pre-migration `SELECT COUNT(*) FROM persons`.
3. **Все references в Blog и Cases указывают на Authors:** `Blog.author`,
   `Blog.reviewedBy`, `Cases.brigade`, `Cases.reviewedBy` имеют
   `relationTo: 'authors'`; FK constraints в `blog`/`cases` ссылаются на
   `authors(id)`; ни одна старая запись Blog/Cases не показывает «broken
   reference» в `/admin`.
4. **admin label «Авторы / Команда» отображается:** в sidebar group «02 ·
   Контент» одна строка «Авторы / Команда» (вместо «Авторы» + «Команда»);
   в edit-view header — «Авторы / Команда»; в create-button — «Создать
   Автор / Сотрудник».
5. **Sidebar показывает одну иконку вместо двух:** `PersonsIcon` удалена
   из `components/admin/icons.tsx`; в DOM `/admin` отсутствует selector
   `[data-collection="persons"]`; brand-guide §12.2 14-icon list
   соответствует.
6. **Smoke test (Playwright `tests/e2e/panel-persons-rename.spec.ts`):**
   логин в /admin → клик «Авторы / Команда» в sidebar → создание нового
   Author (firstName, lastName, slug, jobTitle) → save → запись появляется в
   list view → edit existing мигрированного `aleksey-semenov` → save без
   ошибок → public-страница `/avtory/aleksey-semenov/` рендерится.
7. **Rollback plan документирован и протестирован на staging:** `qa-panel`
   прогнал `pnpm migrate` + `pnpm migrate:down` + restore из pg_dump на
   копии prod БД; результат — БД в pre-migration состоянии бит-в-бит
   (verify: `pg_dump --schema-only` diff пустой).

---

## 5. Brand-guide §12 mapping

| §12 раздел | Текущее (2 коллекции) | После merge |
|---|---|---|
| §12.2 sidebar 14-icon list | 14 icons включая Persons (15-я лишняя) | 14 icons чисто, одна Authors-icon в group «02 · Контент» |
| §12.4 list view | 2 separate list views с overlapping data | 1 list view с `defaultColumns: ['fullName','jobTitle','slug']` |
| §12.4.1 create-edit form | 2 separate forms (Persons плоский, Authors с tabs) | 1 form с tabs (Authors style) |
| §13 TOV labels | «Сотрудник / Команда» (Persons) + «Автор / Авторы» (Authors) — несогласованно | Единая label «Автор / Сотрудник» / «Авторы / Команда» — отражает merged семантику |

cw-handoff: после dev-готовности приглашается `cw` для review labels +
`admin.description` на соответствие brand-guide §13 (Caregiver+Ruler TOV).

---

## 6. Out-of-scope

- **Rename Authors → «Команда»** (вариант a) — оператор не выбрал.
- **WebAuthn / passkeys** для Authors — нерелевантно.
- **Роли / permissions** внутри Authors (типа «only admin can edit Authors») —
  Payload access `{ read: () => true }` сохраняется как было.
- **Public-page переименования** (`/avtory/` → `/komanda/` или дублирование
  route) — `/avtory/<slug>/` остаётся единственным public-route для
  Authors/Persons.
- **`apps/shop` integration** — cross-workspace decision вне scope этой US;
  будет принято при создании apps/shop/.
- **Backfill `metaTitle` / `metaDescription` / `canonicalOverride`** для
  перенесённых Persons — оставляем NULL, cms может дозаполнить через
  admin позже (или передать `cw` отдельной задачей).
- **Удаление Persons-related migrations** (`20260426_200000_authors_collection.up.sql`)
  из истории — миграции append-only, не трогаем.

---

## 7. Open questions

**Нет.** Operator approved variant (b) 2026-05-01 (memory
`/Users/a36/.claude/projects/-Users-a36-obikhod/memory/project_panel_decisions_2026-05-01.md`).
Default conflict resolution — keep newest record + suffix slug `-2` (DBA
default). Все остальные defaults задокументированы в §2.1 conflict resolution.

---

## 8. Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 12:55 | popanel | sa-panel + dba | spec request (autonomous mandate) — merge Persons → Authors variant (b). |
| 2026-05-01 13:10 | sa-panel + dba | popanel | spec ready for review. Reconnaissance complete (apps/shop отсутствует, factual schema diff собран, refs полностью отинвентаризированы). Готов передавать be-panel + dba для implementation после popanel approve. |
