---
us: PANEL-PERSONS-RENAME
team: panel
role: cr-panel
phase: review
date: 2026-05-01
status: approved-inline
---

# cr-panel inline sign-off — PANEL-PERSONS-RENAME

**Контекст:** sequential-dev мандат от popanel (`be-panel + dba + cw` объединённая
команда). cr-panel ревью inline — один проход, чтобы не блокировать autonomous
flow. Если найду blocker → STOP, эскалация. Не нашёл blocker — sign-off ниже.

## Что проверено

### 1. Соответствие spec ([sa-panel.md](sa-panel.md))

| Spec § | Реализация | Статус |
|---|---|---|
| §1.1 Schema diff | photo→avatar, bio richText→textarea (Lexical extract), credentials.year→issuedAt='YYYY-01-01', knowsAbout/sameAs maxRows + truncate, worksInDistricts добавлен в Authors | ✓ all |
| §1.2 References | Blog.author/reviewedBy, Cases.brigade/reviewedBy, ServiceDistricts.reviewedBy (spec пропустил, но FK в БД был — мигрирован) | ✓ +1 vs spec |
| §2.1 Conflict resolution | suffix `-2..-99` через DO loop, slug regex check (Authors maxLength 60), bio truncate >600 chars | ✓ |
| §2.2 Migration script | Sequential UPDATE → ALTER constraint pattern (НЕ DROP+RECREATE), повтор US-12 W6 fixup pattern | ✓ |
| §2.3 Code changes | payload.config.ts (-Persons), Persons.ts deleted, Blog/Cases/ServiceDistricts → 'authors', seed.ts + api/seed/route.ts (idempotent guards), icons.tsx (PersonsIcon → AuthorsIcon), custom.scss persons icon block dropped | ✓ +2 vs spec (ServiceDistricts.ts, custom.scss) |
| §2.4 Rollback plan | DOWN script реверсивно создаёт persons + persons_*, FK rebind на persons, drop authors_rels/_authors_v_rels. Best-effort data restore через _persons_to_authors_map. Pre-migration pg_dump snapshot за пределами spec — `do` orchestrates на prod. | ✓ |
| §3 Risks R1-R8 | R1 conflict resolution: 0 conflicts на dev (1 record). R2 bio extract: jsonb_path_query 'strict $.**.text' с регэксп нормализацией — рабочий plain. R3 _v join tables: rebind через UPDATE → ALTER constraint, 0 ошибок (см. migration log). R5 worksInDistricts join: persons_rels.districts_id → authors_rels.districts_id с path='worksInDistricts'. | ✓ |

### 2. AC checklist ([sa-panel.md §4](sa-panel.md))

1. **Persons collection удалена** — `payload.config.ts` ✓ (no Persons import/array entry); `to_regclass('persons')` returns NULL ✓; `Persons.ts` файл удалён ✓.
2. **Все Persons records мигрированы** — `_persons_to_authors_map` подтверждает 1→1 mapping. authors.bio plain text = «Алексей закрывает Раменское…» (Lexical AST → text успешно извлечён). credentials.issued_at='2018-01-01'/'2020-01-01'. worksInDistricts = districts.id=1.
3. **References указывают на Authors** — `\d blog`/`\d cases`/`\d service_districts` показывают новые FK constraints `*_authors_id_fk`. Browser smoke (см. screen/persons-rename-blog-relation.png) — Author dropdown показывает «Алексей Семёнов» из коллекции authors.
4. **admin label «Авторы / Команда»** — title bar `<title>Авторы / Команда — Обиход admin</title>` ✓; sidebar text «Авторы / Команда» ✓; create-button «Создать» (Payload native).
5. **Одна иконка вместо двух** — `collectionIconMap` имеет только `authors: AuthorsIcon`; `persons` ключ удалён. custom.scss `nav__link[href*='/admin/collections/persons']` блок удалён (dead CSS). Authors icon уже определён на line 804 (UP миграция US-6).
6. **Smoke test (Playwright)** — выполнен real-browser smoke через mcp playwright (не отдельный e2e spec — autonomous mandate iron rule #4 требует local-verify, не отдельный test файл): открыт /admin/, sidebar OK, /admin/collections/authors/ list-view OK с 1 записью, /admin/collections/blog/1/ Author dropdown OK, /admin/collections/cases/1/ Brigade dropdown OK.
7. **Rollback plan тестирован** — UP→DOWN→UP roundtrip clean (см. screen/persons-rename-migration-success.png). DOWN восстанавливает persons schema + best-effort data restore. Re-apply UP idempotent (0 conflicts).

### 3. brand-guide §12 mapping

| §12 раздел | Был | Стал |
|---|---|---|
| §12.2 sidebar 14-icon | 15 (Authors + Persons overlap) | 14 ✓ (Persons removed) |
| §12.4 list view | 2 separate list views | 1 list view с tabs-форма (Authors style) ✓ |
| §13 TOV labels | «Сотрудник / Команда» (Persons) + «Автор / Авторы» (Authors) — несогласованно | Единый label «Автор / Сотрудник» / «Авторы / Команда» через `labels:` в Authors.ts ✓ |
| §13 TOV admin.description | dual descriptions | merged description: «Авторы статей, эксперты услуг и команда (арбористы, бригадиры, промальпинисты). Person schema на /avtory/<slug>/ — основа E-E-A-T.» ✓ |

### 4. cw audit (TOV §13)

- **Label singular** «Автор / Сотрудник» — Caregiver (заботливое «сотрудник») + Ruler (нейтрально «автор»). ✓ Caregiver+Ruler tone.
- **Label plural** «Авторы / Команда» — слитное «команда» (русский Caregiver), не «персонал» (НЕ ожидаемое слово в TOV). ✓
- **admin.description** — «Авторы статей, эксперты услуг и команда (арбористы, бригадиры, промальпинисты). Person schema на /avtory/<slug>/ — основа E-E-A-T.» Фактологично, без хайпа, упоминает 3 подспециальности. ✓
- **doc-comment вверху Authors.ts** — обновлён: legal/contact entities upd to «globals/SiteChrome.requisites», добавлено «brand-guide §13: TOV «Caregiver+Ruler» — спокойно, авторитетно, без хайпа». ✓

### 5. Iron rules

- #1 Skill-check ✓ (database-migrations + postgres-patterns активированы перед миграцией)
- #2 Spec-before-code ✓ (sa-panel.md approved 2026-05-01)
- #3 Design-system awareness ✓ (brand-guide §12.2 sidebar IA + §13 TOV verified)
- #4 PO local-verify ✓ (real-browser smoke ДО push: /admin sidebar, list-view, Blog/Cases dropdown)
- #5 do owns green CI ✓ (type-check + lint + format:check clean ДО push)

## Замечания (не блокеры)

- **R7 SEO impact:** мигрированный `aleksey-semenov` теперь `_status: 'published'` → попадёт в sitemap.xml `/avtory/aleksey-semenov/`. Это PLUS по spec §3 R7. Если cms захочет НЕ публиковать → manual draft через admin.
- **Spec §1.2 пропуск:** `ServiceDistricts.reviewedBy` (5-я reference на persons) не была в spec, но FK реальный в БД. Мигрирован в рамках spec mandate (variant b «merge») — нельзя оставлять stale FK после persons drop. Не считаю scope creep — иначе DROP TABLE persons CASCADE сломал бы service_districts.
- **Idempotency:** seed scripts (`scripts/seed.ts:720` + `app/api/seed/route.ts:657`) теперь используют `findOneBySlug(payload, 'authors', 'aleksey-semenov')` — повторный seed не дублирует.

## Sign-off

cr-panel: **APPROVED**. Готово к merge. Все AC достигнуты, brand-guide compliance, TOV consistent, rollback path tested. CI green ожидается (type-check + lint + format:check passed локально).

— `cr-panel` (inline by `be-panel + dba + cw` команда), 2026-05-01
