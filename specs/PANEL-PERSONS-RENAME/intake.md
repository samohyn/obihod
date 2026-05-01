---
us: PANEL-PERSONS-RENAME
title: Persons → Authors merge (variant b) — одна коллекция «Авторы / Команда»
team: panel
po: popanel
type: refactor
priority: C
segment: admin
phase: intake
role: popanel
status: spec-requested
blocks: []
blocked_by: []
related: [US-12-admin-redesign, PANEL-UX-AUDIT]
created: 2026-05-01
updated: 2026-05-01
skills_activated: []
---

# PANEL-PERSONS-RENAME — Intake

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** оператор approved 2026-05-01 «вариант (b) merge with Authors» (memory `/Users/a36/.claude/projects/-Users-a36-obikhod/memory/project_panel_decisions_2026-05-01.md`).
**Тип:** refactor (cosmetic + data migration; UI меняется незначительно, БД меняется значимо).
**Срочность:** C — UX-noise в sidebar (две похожие иконки «Команда» + «Авторы»), не блокирует daily ops, но добавляет когнитивную нагрузку cms-роли.
**Сегмент:** admin (`/admin/collections/persons` + `/admin/collections/authors`).

---

## Контекст: 2 коллекции с overlap по семантике

В `site/payload.config.ts` зарегистрированы две коллекции с пересекающимся
смыслом «человек как E-E-A-T сигнал»:

- **Persons** (`site/collections/Persons.ts`, label «Сотрудник / Команда»,
  group `02 · Контент`) — изначально для legal/contact entities (по комментарию
  в `Authors.ts`: «Persons → для юрлица/ИНН/телефона, в Organization JSON-LD»).
  Фактически используется как **brigade / reviewedBy** в `Cases` и
  **author / reviewedBy** в `Blog`. На public-страницах не имеет своего route
  (нет `/komanda/`).
- **Authors** (`site/collections/Authors.ts`, label «Автор / Авторы»,
  group `02 · Контент`, добавлена 2026-04-26 миграцией
  `20260426_200000_authors_collection.up.sql`) — спроектирована шире: tabs UI
  (Основные/Био/Связи/SEO), `versions: { drafts: true }`, sidebar fields
  (canonicalOverride, robotsDirectives), `fullName` autogen, валидация slug.
  Используется ТОЛЬКО на `/avtory/<slug>/` (US-6 wave 2A) и в sitemap.

**Проблема:** в admin sidebar две иконки рядом для одной по сути сущности
«человек команды/автор», обе в group «02 · Контент». PageCatalog (US-12 W3)
показывает только Authors как public-pages — Persons вообще не имеют URL.
Иронично: `Blog.author` ссылается на `persons`, а не на `authors`, что
означает пара «author of the article» на самом деле живёт в коллекции
«сотрудники без публичной страницы». UX-боль и data-боль одновременно.

**Решение оператора:** объединить в одну коллекцию `Authors` (Authors шире —
покрывает blog + cases authorship + потенциально команду), label «Авторы /
Команда».

---

## Резюме задачи

`sa-panel` (с участием `dba` для миграционной части) пишет полный spec на
merge Persons → Authors:

1. **Schema diff** — какие поля Persons нужно перенести в Authors (новые
   колонки `worksInDistricts`, перенос `bio richText → ?`, маппинг
   `photo → avatar`, `credentials.year(number) → issuedAt(date)`).
2. **Migration plan** — Payload migration (`site/migrations/`) с conflict
   resolution (duplicate slug → suffix `-2`, default keep newest).
3. **Code changes** — `payload.config.ts`, `Blog.ts` (`relationTo: 'persons' →
   'authors'` в author + reviewedBy), `Cases.ts` (brigade + reviewedBy),
   `scripts/seed.ts` + `app/api/seed/route.ts` (Persons блок → Authors блок),
   удаление `Persons.ts`, удаление `PersonsIcon` в `components/admin/icons.tsx`.
4. **Label** — `admin.labels { singular: 'Автор / Сотрудник', plural: 'Авторы
   / Команда' }`.
5. **Risks** — seed idempotency, downtime окно для production миграции,
   Payload dropping `_blog_v_*` / `_cases_v_*` join tables после смены
   `relationTo` (US-12 W6 painful precedent), JSON-LD output.

**Output:** `sa-panel.md` с migration plan, AC (5-7), risks, rollback.

---

## Deliverables (spec фаза)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Spec sa-panel.md (schema diff + migration plan + AC + risks) | sa-panel + dba | `specs/PANEL-PERSONS-RENAME/sa-panel.md` |
| 2 | Hand-off log в spec | sa-panel | § Hand-off log в `sa-panel.md` |

---

## Out of scope (явно)

- **Rename Authors → «Команда»** — это вариант (a), оператор НЕ выбрал.
  Финальная label «Авторы / Команда».
- **Public-page переименование** — `/avtory/` остаётся, `/komanda/` НЕ
  создаётся.
- **WebAuthn / passkeys** для Authors — нерелевантно (это контент-сущность,
  не auth).
- **Роли / permissions** внутри Authors (типа «only admin can edit») —
  Payload access уже наследует `read: () => true` для obоих, оставляем как
  было.
- **Apps/shop integration** — apps/shop/ как отдельный workspace **ещё не
  существует** (verify reconnaissance: `apps/` directory отсутствует).
  Когда появится — shop делает свою decision (use site Authors через REST или
  своя БД).

---

## Зависимости

**Blocked by:** нет.

**Related (informational):**
- **US-12 admin-redesign** — Authors уже стилизованы под brand-guide §12,
  Persons получают тот же стиль через generic admin selectors. После merge
  все правки в админке естественно стянутся в один Authors view.
- **PANEL-UX-AUDIT** — этот rename один из пунктов списка sidebar IA
  cleanup (если такой существует).

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel + dba | intake assigned, прошу spec на merge Persons → Authors. Skill-check: `product-capability` + `database-migrations` + `design-system`. Operator approved variant (b) — autonomous mandate, open questions делаешь как PO defaults (default conflict resolution: keep newest record + suffix slug `-2`), не запрашиваешь оператора. Output — `sa-panel.md` в этой папке. После spec → popanel review → operator approve → передача в be-panel + dba для implementation. |
