---
us: PANEL-LEADS-INBOX
title: UX-полировка коллекции Leads — status workflow + фильтры + быстрые действия
team: panel
po: popanel
type: feature
priority: P1
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [US-12-release-closure, PANEL-UX-AUDIT-pre-spec-input]
related: [US-8-leads-flow, PANEL-UX-AUDIT, US-12-W3-LeadsBadge]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [product-capability, blueprint, design-system]
---

# PANEL-LEADS-INBOX — Spec (sa-panel)

**Author:** sa-panel
**Date:** 2026-05-01
**Source of truth:** [brand-guide.html §12.5 (Status badges + Bulk action bar)](../../design-system/brand-guide.html) · [§12.4.1 Token-map](../../design-system/brand-guide.html) · [§32.4 (5+1 status)](../../design-system/brand-guide.html) · [ADR-0005](../../team/adr/ADR-0005-admin-customization-strategy.md) · [ADR-0010](../../team/adr/ADR-0010-payload-views-list-customization.md)
**Skill activation:** см. § Skill activation ниже

---

## Skill activation (iron rule)

`sa-panel` вызвал Skill tool на старте:

| Skill | Когда применяю | Что даёт |
|---|---|---|
| `product-capability` | § Capability statement + § Constraints + § Implementation contract | Превращает запрос оператора («хочу обрабатывать 30 заявок за 15 минут») в явные constraints (status enum, inline-change UX, audit history) до начала разбивки |
| `blueprint` | § Sub-tasks (3) + § Dev breakdown | Каждый sub-task — self-contained brief с dependency edges (A→B→C параллельно, общая миграция первой), exit criteria и rollback. Cold-start готовность для be-panel/fe-panel |
| `design-system` | § Brand-guide §12 mapping + AC | Sверка каждого визуального элемента (status pill / bulk bar / chips / row-actions) с конкретным §-anchor + token. Без «дизайнерских импровизаций» |

**Активация зафиксирована** этой таблицей. Если в процессе spec появится потребность в `architecture-decision-records` или `database-migrations` — sa-panel дополнительно активирует и зафиксирует через hand-off log.

---

## Capability statement (product-capability)

После релиза этого US **оператор** (admin/manager роли) получает: на главном daily-use экране `/admin/collections/leads` он видит **только активный inbox** (новые + в работе), быстрые-фильтр чипы переключают «срез» одним кликом, в строке таблицы статус меняется без открытия документа, спам/архив и массовая смена статуса работают через bulk action bar. **Outcome change:** среднее время обработки одной заявки операторoм падает с ~2 мин (открыть → таб → select → save → close) до ~10 сек (status pill click → confirm); 90% операций «принять / отклонить / спам» делается без выхода из list-view.

---

## Контекст текущего состояния

`/Users/a36/obikhod/site/collections/Leads.ts` — коллекция уже имеет:

- 4 unnamed tabs (Контакт / Запрос / Источник / Статус) — Wave 4 PAN-3
- `status` select с 6 значениями: `new`, `in_amocrm`, `estimated`, `converted`, `lost`, `spam` (row 146-153)
- `defaultColumns: ['phone', 'name', 'service', 'district', 'status', 'createdAt']` — status уже видим в list-view
- `access.read` — admin/manager only (row 13-15)
- `timestamps: true` (createdAt + updatedAt автоматом)

**Что уже работает (US-12 база):**
- Sidebar Leads badge counter (W3) — `/api/admin/leads/count?status=new` polling 30s
- LeadsEmpty в `components/admin/empty/LeadsEmpty.tsx` (W5, ADR-0010 — public export, не подключён к native list-view)
- custom.scss W1-W9 — палитра + токены + sidebar + row hover

**Что НЕ работает / болит оператора:**
- `status` enum semantics плывёт: `in_amocrm` присутствует но без US-13 не имеет смысла, нет `contacted` (хотя §32.4 brand-guide уже описал 5+1 канон), `lost` ≠ `rejected` ≠ `spam` смешаны
- Сменить статус = open doc → tab «Статус» → select → save (4 клика, ~30s)
- Нет фильтров: оператор видит все 50+ заявок включая `closed_won` 3-месячной давности
- Нет bulk: 5 спам-заявок отметить = 5 раз открыть/закрыть
- Нет audit history: кто и когда сменил статус — невозможно восстановить

---

## Цель и метрики успеха

**Цель:** превратить `/admin/collections/leads` в operative inbox оператора — sub-15-секундная обработка статусов, нулевая нужда открывать документ для типичных flow.

**Замеряем:**
- M1 (UX) — Playwright флоу «принять заявку» click-to-update ≤2 секунды (от click row-action до toast «Статус обновлён»)
- M2 (cognitive) — default list-view показывает ≤20 строк (active inbox), не 50+ (благодаря дефолтному фильтру `status NOT IN [closed_won, closed_lost, spam]`)
- M3 (audit) — для любой заявки видна история «кто менял статус и когда» (без этого amoCRM-sync US-13 будет слепой)
- M4 (operator self-report) — после 1 недели использования оператор подтверждает «обрабатываю быстрее» (subjective)

---

## Out of scope (явно)

| Out | Почему / куда |
|---|---|
| amoCRM bidirectional sync | US-13 (OBI-25, blocked by аккаунт). Поле `amoCrmId` + `syncedAt` оставляем как есть, новых интеграций НЕ добавляем |
| Telegram-уведомления operator при новой заявке | US-8 PAN-9 ownership, **не наш scope**. Наш `LeadsBadge` уже показывает count |
| 2FA при изменении статуса (например `closed_won` → нужен дополнительный confirm) | Отдельный US PANEL-AUTH-2FA |
| AI-расчёт сметы по фото | отдельный US (Claude API skill) |
| Per-collection EmptyState регистрация в native list | Закрыта ADR-0010 — `LeadsEmpty` остаётся public export, native «Документы не найдены» — acceptable |
| Mobile-specific layout для list-view | W6 mobile responsiveness (CSS-only через custom.scss media-queries), не отдельный мобильный flow |
| Pagination/virtualization для >100 заявок | YAGNI на старте (50-150 заявок/неделя). Добавим если оператор запросит |
| Webhook на change-status в внешние системы | YAGNI до US-13 |

---

## Sub-tasks (3) · Blueprint breakdown

### A · Status workflow (database + API + UI status pill)

**Capability:** оператор видит status каждой заявки в таблице как цветную pill (по brand-guide §12.5 + §32.4), может сменить статус inline через dropdown в строке без открытия документа; каждое изменение пишется в audit history.

#### A.1 · Status enum — выравниваем под brand-guide §32.4

**Текущий enum (Leads.ts:146-153):**
```
new, in_amocrm, estimated, converted, lost, spam
```

**Канон §32.4 + .lead-status-badge классы (brand-guide:775-781):**
```
new, contacted, smeta, brigade, done, cancelled
```

**Решение:** мы **меняем enum** на канон §32.4, но сохраняем backward compat для US-13:

| Новый value | label (RU) | brand-guide класс | Семантика | Old → New mapping |
|---|---|---|---|---|
| `new` | Новая | `.lead-status-badge.new` | Только что пришла, не контактировали | `new` → `new` |
| `contacted` | На связи | `.lead-status-badge.contacted` | Менеджер связался, уточняем детали | `in_amocrm` → `contacted` (semantically близко: «в работе у менеджера») |
| `smeta` | Смета | `.lead-status-badge.smeta` | Смета согласована с клиентом | `estimated` → `smeta` |
| `brigade` | Бригада | `.lead-status-badge.brigade` | Бригада на объекте | (новый) — миграция: нет существующих документов |
| `done` | Завершена | `.lead-status-badge.done` | Объект закрыт | `converted` → `done` |
| `cancelled` | Отменена | `.lead-status-badge.cancelled` | Клиент отказался / не дозвонились (закрытая воронка) | `lost` → `cancelled` |
| `spam` | Спам | (отдельный — см. ниже) | Не реальная заявка | `spam` → `spam` |

**`spam` — отдельный токен:** в brand-guide §12.5 есть `.ad-badge.lead-new` (амбигуус) и `.ad-badge.draft` (амбер) — для «spam» добавляем 7-й вариант `.lead-status-badge.spam` через расширение `custom.scss` (token: `var(--c-error)` фон 0.10 alpha + `var(--c-error)` text). Token coverage в `design-system/tokens/colors.json` уже покрывает (`--brand-obihod-danger: #b54828`).

**`amoCrmId` + `syncedAt` поля:** оставляем без изменений — US-13 будет читать/писать их.

**Migration plan (DBA вовлечь):**
- Payload migration `2026-05-XX-leads-status-canonical.ts` со SQL UPDATE по mapping выше
- Idempotent (WHERE old-value, не дублирует если уже выполнена)
- Down-migration — обратный mapping (для rollback)
- **`tamd` review требуется** — есть ли семантический риск `in_amocrm → contacted`? Если в US-13 dev-команде планируют другую семантику — поднять до dev start

#### A.2 · Inline status pill в list-view (через `beforeListTable` slot)

**Constraint ADR-0010:** мы НЕ override'им `views.list.Component` целиком — это даст 500-1000 строк нашего кода. Вместо этого используем **CSS-only enhancement существующей status-колонки** + опционально `views.list.actions` slot для context-menu.

**Steps реализации:**

1. **Style-only улучшение native column** — текущая Payload select-column рендерится как plain text. Через `custom.scss` + selector по `[data-field-path="status"]` + `data-value` атрибуту (если Payload его выставляет — needs verification; иначе через MutationObserver pattern как W3 LeadsBadgeOverlay) превращаем в `.lead-status-badge`. CSS-only — нет JS-overhead.

2. **Inline-change через row-action dropdown** — добавляем `views.list.actions` slot который рендерит per-row context (но Payload `actions` это header-level, не row-level; row-level нужен через cell renderer). **Альтернатива:** добавляем `admin.components.RowLabel` НЕ применимо (это для arrays). **Рабочий путь:** custom column через custom field `cell` component для `status` — Payload 3 поддерживает `field.admin.components.Cell`. Регистрируем `<StatusPillCell>` который рендерит pill + click-handler → opens dropdown в portal → PATCH PATCH `/api/leads/{id}` через Payload REST с `{ status: newValue }`.

   **Verification needed (dev start):** проверить что `field.admin.components.Cell` action callback может писать через `useDocumentInfo` или прямой REST call. Если оператор хочет «оптимистичный update» без open doc — это требует client-component. **Plan B:** если Cell-component не позволяет write — fallback на header-level `actions` с pre-selected row + dropdown (хуже UX но рабочий).

3. **Toast confirm** — после успешного PATCH показываем native Payload toast «Статус «Принята»» (через `useTranslation` + `toast.success`). При ошибке — toast.error с retry.

4. **Optimistic UI** — pill меняет цвет immediately, на failure возвращается + toast.error. Pattern stable из W3 LeadsBadgeOverlay (`useState` + try/catch).

#### A.3 · Audit history (статус-changes)

**Зачем:** оператор должен видеть «кто и когда менял статус» — критично для US-13 amoCRM-sync (любой sync-bug ловится через history).

**Решение:** Payload field `versions: true` для коллекции Leads НЕ подходит (versions — это draft/published, не audit). Используем **Hooks pattern**:

- Add `hooks.beforeChange` — если `data.status !== originalDoc.status`, push entry в новое поле `statusHistory: { status, changedBy, changedAt, reason? }` (массив, append-only)
- `statusHistory` — `array` поле в табе «Статус», readonly, sorted desc by `changedAt`
- В UI таба «Статус» (после select) добавляем readonly `<ul>` с историей: «Принята · admin · 2026-05-01 14:23»

**Migration:** добавить поле `statusHistory` в Leads, default `[]`. Existing документы получают пустой массив (audit стартует с момента релиза — это OK, history pre-release не восстанавливаем).

**Why not Payload native versions:** versions хранят полные снапшоты документа = overkill для одного поля + усложняет восстановление, indexing.

**Why not отдельная коллекция `LeadStatusEvents`:** YAGNI на старте (single-tenant, 50-150 заявок/неделя). Если объём вырастет до 1000+ — миграция в отдельную коллекцию через ADR-0012.

---

### B · Фильтры list-view

**Capability:** оператор видит default-срез «active inbox» (не закрытые); одним кликом переключается на «Новые» / «На связи» / «Спам» / «Все»; фильтрует по дате (сегодня / неделя / месяц / custom range) и source (yandex / google / vk / direct).

#### B.1 · Default filter — active inbox

**Изменение `Leads.ts:admin`:**
```typescript
admin: {
  // ...existing
  listSearchableFields: ['phone', 'name', 'utmSource'],  // searchable fields (см. B.4)
  // НЕ defaultListPage filter — Payload не поддерживает per-collection persistent default-фильтр через config
}
```

**Реальный механизм default-фильтра:** Payload поддерживает `admin.preview` URL params, но default-фильтр **не задаётся в config** — он применяется через URL (`/admin/collections/leads?where[status][not_in]=...`). **Решение:** в `views.list.actions` slot добавляем компонент `<LeadsQuickFilters />` который при mount проверяет URL (`useSearchParams`) — если фильтра нет, делает `router.replace('/admin/collections/leads?where[status][not_in]=done,cancelled,spam')`. На повторных заходах оператор сохраняет свой фильтр через bookmark.

**Verification needed:** сначала проверить если у Payload 3.84 есть нативный API для default-list-filter (через `defaultColumns`-стиле опцию). Если есть — используем; если нет — slot pattern.

#### B.2 · Quick-filter chips (chip-row сверху списка)

**Анатомия (по brand-guide §12.5 + анти-pattern «native dropdown filter» который замедляет):**

```
┌──────────────────────────────────────────────────────────────────┐
│ [Все] [Новые 12] [На связи 5] [Смета 2] [Бригада 1] [Спам 3]    │
└──────────────────────────────────────────────────────────────────┘
```

**Состояния chip:**
- default: `bg #efebe0, color #2b2b2b, border 1px #e6e1d6`
- active (selected): `bg #2d5a3d, color #f7f5f0, border #e6a23c-left-3px` (по аналогии с sidebar `.ad-sidebar-link.active` §12.2)
- hover: `bg #ffffff, color #1c1c1c`
- counter в chip — `.ad-counter` token (как в sidebar §12.2 line 2836)

**Подключение:** через `views.list.actions` slot (Payload 3 ADR-0010 verified API). Компонент `<LeadsQuickFilters />` (client-component):
- читает count для каждого статуса через batch endpoint `GET /api/admin/leads/count?status=new&status=contacted&...` (расширяем существующий `route.ts` чтобы принимал multi-status и возвращал `{ data: { counts: { new: 12, contacted: 5, ... } } }`)
- click chip → `router.push('?where[status][equals]=new')` (или `[not_in]` для «Все»)

**a11y:** chips — `<button role="tab">` (rolet=tablist), keyboard navigation Arrow Left/Right, `aria-selected` на active chip.

#### B.3 · Date-range фильтр

**Анатомия:**

```
[Дата ▾]  ← dropdown trigger
  ├── Сегодня
  ├── 7 дней
  ├── 30 дней
  ├── Custom...   ← открывает 2 date-input полей (с / по)
  └── Сбросить
```

**Применение:** `where[createdAt][greater_than_equal]=ISO`. URL-state, persisted через bookmark.

**Default:** нет date-фильтра (видимы все периоды) — потому что quick-filter «Спам» оператор хочет видеть весь архив, не только последний месяц.

#### B.4 · Source-фильтр

**Анатомия:** dropdown «Источник» с динамическим списком уникальных `utmSource` значений (`yandex`, `google`, `vk`, `direct`, `null`).

**Реализация:** dropdown заполняется через `GET /api/admin/leads/utm-sources` (новый endpoint, возвращает `DISTINCT utmSource WHERE utmSource IS NOT NULL ORDER BY count DESC LIMIT 20`). Cached 5 мин (sources не меняются часто).

**a11y:** native `<select>` или ARIA-combobox. Keyboard-accessible.

#### B.5 · Search field (existing Payload — расширяем)

Payload native search уже работает через `listSearchableFields`. Расширяем:
```typescript
listSearchableFields: ['phone', 'name', 'utmSource', 'utmCampaign']
```

Поиск не дополняется фильтрами — он orthogonal (search across all fields, фильтры применяются дополнительно через AND).

---

### C · Быстрые действия (bulk + per-row)

**Capability:** оператор выбирает 1-N заявок чек-боксами, в bulk action bar (sticky bottom по §12.5) видит варианты «Принять / На связи / Спам / Архив»; в строке также есть row-action menu «⋯» с теми же опциями для одной заявки.

#### C.1 · Bulk action bar (через `views.list.actions` или native Payload)

**Native Payload 3 уже даёт bulk:**
- Из коробки checkboxes per row
- При выборе → bottom bar с действиями: Edit, Delete, Publish/Unpublish (для коллекций с drafts)

**Что добавляем:**
- Custom bulk action «Изменить статус» — открывает modal с status-dropdown → applies к всем выбранным через batch PATCH `/api/leads?where[id][in]=...`
- Custom bulk «В архив» — soft-delete через новое поле `archived: boolean` (Payload не имеет нативного soft-delete; добавляем boolean field). Архивированные не показываются по default, видны через quick-filter «Архив» (новый chip)
- Custom bulk «Отметить спам» — shortcut к change-status `spam` + archived `true` одним PATCH

**API:** добавляем `admin.components.actions` для коллекции (Payload 3 supports custom bulk actions через `actions: CustomComponent[]` на collection-level). Реализация — client-component с `useSelection` Payload hook.

**Visual style:** native Payload bulk bar уже sticky-bottom — мы не переписываем, только добавляем custom buttons. Если style не соответствует §12.5 (`.ad-bulk` token: `bg #1c1c1c, color #f7f5f0, padding 10px 20px`) — extend через `custom.scss` `.payload__bulk-actions { ... }` selectors.

#### C.2 · Per-row actions (3-dot menu)

**Анатомия:**

```
| phone   | name | service | status | created  | ⋯  |
|         |      |         |        |          | ↓  | ← click open dropdown
                                                |  - Принять
                                                |  - На связи
                                                |  - Смета
                                                |  - Бригада
                                                |  - Завершить
                                                |  - Отменить
                                                |  ──────────
                                                |  - Спам
                                                |  - Архив
                                                |  - Открыть полностью →
```

**Реализация:** custom field `actions` cell — добавляем поле `_actions` (virtual, не в DB) с `cell` компонентом `<RowActionsCell row={row} />`. Click → dropdown в portal (избегаем z-index столкновений).

**Альтернатива (Plan B):** если virtual field не работает в Payload 3 list-view — расширяем `cell` компонент существующей `status` колонки чтобы кроме pill рендерил «⋯» иконку справа. Trade-off: status-cell становится визуально перегруженной.

#### C.3 · Soft-delete (`archived: boolean` field)

**Зачем:** «Удалить» в Payload — hard delete (необратимо). Оператор может случайно удалить реальную заявку. Soft-delete `archived: true` сохраняет данные но скрывает из default-views.

**Schema:**
- Field `archived: boolean` default `false` (в табе «Статус»)
- `access.read` остаётся admin/manager only
- Default фильтр (B.1) добавляет `where[archived][equals]=false`
- Quick-filter «Архив» показывает `where[archived][equals]=true`

**Hard-delete не убираем** — оператор всё ещё может «Удалить» через native Payload bulk «Delete» (за это отвечает Payload native UI). Soft-delete — additive, не replace.

#### C.4 · Confirmation для destructive actions

- «Спам» → confirm modal «Отметить N заявок как спам? Это переместит их в архив. Действие обратимо.»
- «В архив» — без confirm (легко обратимо)
- «Принять / На связи / Смета / Бригада / Завершить / Отменить» — без confirm (быстрая операция, обратимая через row-action)
- «Удалить» (native hard-delete) — Payload native confirm уже есть

---

## Brand-guide §12 mapping (design-system iron rule)

Каждый визуальный элемент → §-anchor → token. Таблица — для cr-panel review checklist.

| Элемент | brand-guide § | Token / класс | custom.scss target |
|---|---|---|---|
| Status pill `new` (зелёный 0.10) | §12.5 + §32.4 + brand-guide:775-776 | `.lead-status-badge.new` (`bg rgba(45,90,61,0.10), color var(--c-primary)`) | `--brand-obihod-primary` |
| Status pill `contacted` (амбер 0.14) | §12.5 + §32.4 + brand-guide:777 | `.lead-status-badge.contacted` (`bg rgba(230,162,60,0.14), color var(--c-accent-ink)`) | `--brand-obihod-accent-ink` |
| Status pill `smeta` (success 0.14) | §12.5 + §32.4 + brand-guide:778 | `.lead-status-badge.smeta` | `--c-success` |
| Status pill `brigade` (primary 0.18) | §12.5 + §32.4 + brand-guide:779 | `.lead-status-badge.brigade` | `--brand-obihod-primary` |
| Status pill `done` (success 0.20) | §12.5 + §32.4 + brand-guide:780 | `.lead-status-badge.done` | `--c-success` |
| Status pill `cancelled` (muted) | §12.5 + §32.4 + brand-guide:781 | `.lead-status-badge.cancelled` | `--c-muted` |
| Status pill `spam` (новый — amber или error?) | §12.5 + добавляется в этом US | `.lead-status-badge.spam` (новый) | `--brand-obihod-danger` (предлагаем) — **OPEN Q1** |
| Quick-filter chip default | §12.2 sidebar pattern (chip ≈ tab/sidebar-link) | `bg #efebe0, color #2b2b2b, border 1px #e6e1d6` | tokens существуют |
| Quick-filter chip active | §12.2 active-state | `bg var(--c-primary), color var(--c-on-primary), border-left 3px var(--c-accent)` | tokens существуют |
| Quick-filter chip counter | §12.2 line 2836 `.ad-counter` | `bg #f7f5f0, color #1c1c1c, font-mono, padding 1px 7px, border-radius 9px` | tokens существуют |
| Bulk action bar | §12.5 + brand-guide:2947-2952 `.ad-bulk` | `bg #1c1c1c, color #f7f5f0, padding 10px 20px, border-radius 6px, sticky-bottom` | extend `.payload__bulk-actions` |
| Bulk action `danger` (Удалить / Спам) | §12.5 line 2951 | `color #e6a23c` (амбер attention, не красный) | `--brand-obihod-accent` |
| Row-action dropdown trigger «⋯» | §12.4 row hover + §12.4.1 token-map | aria-label «Действия со заявкой», 14×14px icon, opacity 0.65 → 0.9 hover | `--brand-obihod-muted` |
| Row-action dropdown menu | §11 notifications + §12.6 patterns | `bg var(--c-card), border 1px var(--c-line), shadow elevation-2, radius var(--radius-sm)` | tokens существуют |
| Date-range custom modal | §12.6 (modal pattern) | native Payload modal style + наши accents | reuse Payload defaults |
| Toast confirm «Статус обновлён» | §11 notifications | matter-of-fact: «Заявка „+7 (916) 123…" — статус «Принята»» (НЕ «Успешно сохранено!») | reuse Payload toast |
| Confirmation modal «Отметить спам?» | §12.6 | `.ad-state` pattern + 2 buttons primary/secondary | reuse |
| Status history list (таб Статус) | §12.4 (long forms) | `<ul>` typography + `font-mono` для timestamp | tokens существуют |

**Anti-patterns (из §12 «Anti-patterns admin» line 3247):**
- НЕ добавляем "Успешно!" toast → используем «Статус «Принята»» с конкретикой
- НЕ используем фиолетовый Payload native colors → все статусы через наши `.lead-status-badge.*`
- НЕ spinner при PATCH → optimistic UI с pill mood-change immediately, on-error rollback + toast.error

---

## Architecture decisions

### ADR-needed? — **Возможно, 2 кандидата**

#### ADR кандидат №1 — Status enum migration semantics

**Почему рассматриваем:** mapping `in_amocrm → contacted` имеет семантический drift — `in_amocrm` означает «отправлено в amoCRM», `contacted` означает «менеджер связался с клиентом». Оператор может различать эти состояния (заявка в amoCRM ≠ менеджер связался).

**Решение sa-panel:** **ADR не нужен в spec фазе**, но **`tamd` review требуется до dev start**. Если tamd подтвердит риск — открываем ADR-0012 с альтернативой «keep `in_amocrm` value, добавить `contacted` parallel». Если оператор подтвердит «нам важно различать» — фиксируем 7-status enum (`new, in_amocrm, contacted, smeta, brigade, done, cancelled, spam`).

**OPEN Q2 для popanel/operator:** различаем ли «в amoCRM» и «менеджер связался»?

#### ADR кандидат №2 — Audit history mechanism (custom hook vs native versions)

**Почему рассматриваем:** Payload native `versions: true` хранит полные снапшоты — это альтернатива нашему custom `statusHistory` array.

**Решение sa-panel:** **ADR не нужен — оба пути исследованы в § A.3**, custom array выбран как simpler + cheaper storage. Если в dev-фазе be-panel найдёт edge case (concurrent updates, race condition) — open ADR-0012 на тот момент.

**Итог:** **ADR-needed = no для spec phase**, но 2 escalation points перед dev start (Q1 + Q2 + tamd review status enum).

### Migrations

**Required:**

1. `2026-05-XX-leads-status-canonical.ts` — UPDATE existing rows по mapping выше (idempotent, with WHERE)
2. `2026-05-XX-leads-add-archived.ts` — ALTER TABLE add `archived BOOLEAN DEFAULT false`
3. `2026-05-XX-leads-add-status-history.ts` — ALTER TABLE add `status_history JSONB DEFAULT '[]'`

**Down-migrations (rollback):**
- Statuses: обратный mapping (но `brigade` не имеет old-equivalent → данные из `brigade` мигрируют в `contacted`)
- Archived/history: drop column

**DBA review:** `dba` обязательно review migration plan (особенно concurrent locking при ALTER на prod БД с 50-150 records). На таком объёме block минимальный, но zero-downtime — обязателен (`db:up` deploy не должен ломать sessions оператора).

### Custom components vs Payload slots (по ADR-0010)

| Component | Mechanism | Why |
|---|---|---|
| `<StatusPillCell>` | Field `status.admin.components.Cell` | Per-row rendering — подходит для замены plain text на pill |
| `<RowActionsCell>` | Virtual field `_actions.admin.components.Cell` (verify if works в Payload 3 list-view) или fallback в `<StatusPillCell>` | Inline actions без open doc |
| `<LeadsQuickFilters>` | `views.list.actions` slot (header-row) | Уже verified ADR-0010 — actions slot работает |
| `<LeadsBulkActions>` | `actions: CustomComponent[]` на collection-level или extend bulk bar through DOM | Native Payload bulk bar bottom-sticky — мы добавляем кнопки |
| Bulk action modal (`<ChangeStatusModal>`) | Plain client-component открываемый из Bulk button | Standard React — не Payload-specific |
| Date-range dropdown | Plain client-component внутри `<LeadsQuickFilters>` | Standard React |
| Status pill style | CSS-only через `custom.scss` | Минимальный JS, max compatibility |
| Audit history `<ul>` в табе | Field `statusHistory.admin.components.Field` (read-only render) | Native Payload field rendering pipeline |

**Все компоненты — Уровень 2 ADR-0005** (React, server и/или client). Endpoint расширения — Уровень 3.

---

## Acceptance Criteria

### AC §A · Status workflow

- **AC-A.1.1** Migration `leads-status-canonical` запущена, все existing документы имеют один из {new, contacted, smeta, brigade, done, cancelled, spam}; нет orphan-statuses
- **AC-A.1.2** Down-migration работает (verified в dev — apply → rollback → state корректное)
- **AC-A.2.1** В list-view колонка status рендерится как `.lead-status-badge.<value>` pill (не plain text); цвета совпадают с brand-guide §12.5/§32.4 token-map (visual ревью cr-panel + ux-panel)
- **AC-A.2.2** Click на pill открывает dropdown с 7 опциями; select любой → PATCH `/api/leads/{id}` → toast «Статус «<новый label>»» (или toast.error на failure)
- **AC-A.2.3** Click-to-update ≤2 секунды (M1 метрика) — Playwright тест
- **AC-A.2.4** Optimistic UI: pill меняет цвет immediately, на failure возвращается + toast.error
- **AC-A.3.1** При смене status — entry автоматически добавляется в `statusHistory` array c `{status, changedBy: req.user.id, changedAt: new Date()}` (тест unit/integration)
- **AC-A.3.2** В табе «Статус» отображается `<ul>` history (read-only, sorted desc by changedAt) — последняя смена сверху
- **AC-A.3.3** История не редактируется через UI (admin.readOnly: true для поля)

### AC §B · Фильтры list-view

- **AC-B.1.1** При первом заходе на `/admin/collections/leads` URL автоматически содержит `?where[status][not_in]=done,cancelled,spam&where[archived][equals]=false` (или эквивалент Payload syntax) — оператор видит active inbox
- **AC-B.1.2** Sidebar Leads badge counter (W3) использует тот же default = consistency между «12 в badge» и «12 в list-view»
- **AC-B.2.1** Quick-filter chips отображаются в header list-view (через `views.list.actions` slot), 7 chips: «Все», «Новые N», «На связи N», «Смета N», «Бригада N», «Спам N», «Архив N»
- **AC-B.2.2** Chip counters обновляются при load + после PATCH (опционально через React Query refetch)
- **AC-B.2.3** Click chip → URL update → list reload с фильтром; active chip имеет `aria-selected="true"` + brand-active style
- **AC-B.2.4** Keyboard nav: Tab to chips, Arrow Left/Right переключает active, Enter применяет
- **AC-B.3.1** Date-range dropdown работает: «Сегодня» = `createdAt >= today 00:00`, «7 дней» = `createdAt >= now - 7d`, etc.
- **AC-B.3.2** Custom range — 2 date inputs (с / по), submit → URL update
- **AC-B.4.1** Source-фильтр dropdown заполняется через `/api/admin/leads/utm-sources` (DISTINCT utmSource), кэширование 5 мин
- **AC-B.5.1** Search field native Payload расширен на `[phone, name, utmSource, utmCampaign]`

### AC §C · Быстрые действия

- **AC-C.1.1** Custom bulk action «Изменить статус» доступен в native bulk bar при выборе ≥1 row; открывает modal с status select; submit → batch PATCH
- **AC-C.1.2** Custom bulk action «В архив» работает (archived=true, без confirm)
- **AC-C.1.3** Custom bulk action «Спам» работает (status=spam + archived=true) с confirm modal «Отметить N заявок как спам? Действие обратимо.»
- **AC-C.2.1** Per-row dropdown «⋯» отображается в каждой строке (или на hover, если performance иначе)
- **AC-C.2.2** Click → dropdown с теми же 7 status опциями + Архив + «Открыть полностью →»
- **AC-C.2.3** Dropdown в portal (не обрезается table overflow)
- **AC-C.3.1** Soft-delete `archived` field видим в табе «Статус», default false; toggle в edit-view работает
- **AC-C.3.2** Default-фильтр исключает `archived=true`; quick-filter «Архив» показывает только `archived=true`
- **AC-C.4.1** Confirm modal для «Спам» использует §12.6 pattern (eyebrow + title + 2 buttons)

### AC §Cross — общие

- **AC-X.1** Все status pills + chips + bulk bar соответствуют brand-guide §12.5 / §12.4.1 token-map (cr-panel ревью)
- **AC-X.2** WCAG 2.2 AA: focus-visible на всех interactive (chips, dropdown, row-actions); color-contrast ≥4.5:1; aria-labels на иконках; reduced-motion отключает transitions
- **AC-X.3** Type-check + lint + format:check зелёные (`do` iron rule до push)
- **AC-X.4** Playwright smoke: (a) login → /admin/collections/leads → видим default-фильтр active inbox; (b) click row status pill → change → toast; (c) select 3 rows → bulk «Спам» → confirm → 3 row archived; (d) chip «Архив» → видим архивированные
- **AC-X.5** Performance: list-view LCP ≤2.5s при 50 заявках; pill render не блокирует main thread (CSS-only baseline)
- **AC-X.6** Migration zero-downtime (verified `dba` review)
- **AC-X.7** `cr-panel` approve
- **AC-X.8** `qa-panel` approve (все AC) + `leadqa` browser smoke ДО push (iron rule #6)

---

## Состав команды и нагрузка

| Роль | Задача | Чд |
|---|---|---|
| `sa-panel` | Этот spec + Q&A с popanel | 0.4 (готово) |
| `tamd` | Review status enum migration semantics (Q2) + ADR-needed final call | 0.1 (cross-team consult) |
| `dba` | Migration plan review (3 миграции, zero-downtime + rollback) | 0.2 |
| `ux-panel` | Pre-spec UX (deliverable #8 PANEL-UX-AUDIT) — feed-ит в этот spec; visual ревью pills/chips/dropdown в dev-фазе | 0.1 (уже в audit) + 0.2 (visual review) |
| `be-panel` | Migrations × 3 + endpoint expansion (`leads/count` multi-status, `leads/utm-sources`) + hooks (`beforeChange` для history) + integration tests | 0.7 |
| `fe-panel` | `<StatusPillCell>` + `<RowActionsCell>` + `<LeadsQuickFilters>` + bulk-actions + date-range + custom.scss extension + status-history field render | 1.2 |
| `qa-panel` | Playwright smoke (4 сценария AC-X.4) + a11y axe-core regression + manual VoiceOver smoke на chips | 0.3 |
| `cr-panel` | Code review + brand-guide §12 mapping checklist | 0.2 |
| `leadqa` | Local browser smoke ДО push (iron rule #6) + RC-N report | 0.2 |
| **Итого** | | **~3.8 чд** |

**Timeline:** spec phase — 1 чд. Dev phase (после US-12 closure + UX-AUDIT findings + Q1+Q2 resolved) — ~2 рабочих дня (be + fe parallel) + qa/cr — ~3.8 чд suma.

---

## Open questions to operator (через popanel)

| # | Вопрос | Зачем спрашиваем | Default если не ответят |
|---|---|---|---|
| **Q1** | `spam` status — какой цвет pill? Кандидаты: (a) `var(--c-error)` red фон 0.10 (sharp danger), (b) `var(--c-accent-ink)` амбер 0.14 (mild attention), (c) `var(--c-muted)` neutral grey | brand-guide не определяет `.lead-status-badge.spam` явно — только остальные 6 | (a) `--c-error` 0.10 — самый отличимый от других, оператор не путает с cancelled |
| **Q2** | `in_amocrm` vs `contacted` — оператор различает эти состояния? Если да — оставляем 7+1 enum (new, in_amocrm, contacted, smeta, brigade, done, cancelled, spam = 8 опций); если нет — `in_amocrm → contacted` migrate | Вопрос semantics — без него US-13 dev может попасть в conflict | (b) НЕ различаем — `in_amocrm → contacted` migrate (упрощает enum) |
| **Q3** | Per-row actions — отдельный «⋯» dropdown в каждой row vs click на pill открывает change-status menu (combined)? | UX trade-off: отдельный «⋯» — больше визуального шума; combined — менее очевидно но компактнее | (b) combined: click pill = dropdown (минимизируем UI clutter) |
| **Q4** | Soft-delete vs hard-delete — оставляем native Payload «Удалить» (hard) кнопку или скрываем её, оставляя только наш «Архив»? | Иначе оператор может случайно удалить заявку и потерять PII (152-ФЗ риск) | Оставляем native — оператор обычно не ошибается; добавляем custom.scss `:hover` warning text «Это hard-delete, лучше используйте „Архив"» |
| **Q5** | Audit history — показываем history ВСЕХ изменений документа (Payload native versions) или ТОЛЬКО status-changes (наш custom array)? | Native versions — overkill (фото, photo-changes etc.). Custom array — проще, focused | (a) только status-changes — focused, cheaper |
| **Q6** | Date-range default — нет фильтра (видимы все периоды) vs «30 дней» по умолчанию? | Trade-off: оператор видит всё (включая `closed_won` 6 месяцев назад) vs скрываем старое автоматом | (a) нет default — фильтрация по статусу уже скрывает закрытые; date только опционально |
| **Q7** | Quick-filter chip «Все» — что показывает: ВСЕ статусы (включая `done/cancelled/spam`) или ВСЕ status кроме архив? | Если включает `done/cancelled/spam` — оператор видит длинный список; если без них — есть ли смысл в «Все»? | (b) все КРОМЕ archived — оператор использует «Все» когда ищет конкретную, не архивную |
| **Q8** | Inline status change через pill click — нужен ли confirm перед сменой `done`/`cancelled` (final-state статусы)? | Trade-off: оператор может ошибиться кликом и закрыть заявку | (a) НЕТ confirm — изменение обратимо через тот же pill; toast достаточно |

**Эти 8 вопросов закрываются перед dev start.** Без Q1-Q3 sa-panel не может финализировать enum и UI; Q4-Q8 могут быть «default + iterate after operator usage».

---

## PO decisions 2026-05-01 (popanel — operator approved «иди по PO defaults»)

Оператор 2026-05-01 апрувнул `popanel`-defaults для всех 8 Q (без переоткрытия). Spec status переходит `spec-draft` → `spec-approved` после `tamd` (Q2 enum semantics) + `dba` (migration plan) review.

| # | Финальное решение PO | Обоснование |
|---|---|---|
| **Q1** | **(c) `var(--c-muted)` neutral grey** для `spam` pill | Spam ≠ ошибка системы; нейтральный серый отличает от `cancelled` (амбер/красный) и не пугает оператора. Token-correct по §12.4.1. |
| **Q2** | **(b) объединить `in_amocrm → contacted`** | amoCRM-интеграция = US-13 (отдельный flow), не workflow-status. Status enum остаётся 7 опций: `new / contacted / smeta / brigade / done / cancelled / spam`. Migration: `in_amocrm` → `contacted`, `estimated → smeta`, `converted → done`, `lost → cancelled`. |
| **Q3** | **(a) отдельный «⋯» dropdown в каждой row** | Discoverability важнее компактности — combined click-on-pill теряется (оператор может не догадаться кликать на статус-pill для смены). Native paradigm Payload, оператор уже видел в W3 LeadsBadge. |
| **Q4** | sa-panel default — **оставляем native «Удалить»** + custom.scss `:hover` warning «Это hard-delete, лучше „Архив"» | 152-ФЗ-риск минимален (оператор обычно не ошибается); скрытие native кнопки = breaking Payload UX. |
| **Q5** | sa-panel default — **(a) только status-changes** в `statusHistory: jsonb[]` | Native Payload `versions` = overkill (фото, photo-changes etc.); custom array — focused, cheaper, faster. |
| **Q6** | sa-panel default — **(a) нет default date-range** | Фильтрация по статусу уже скрывает закрытые; date только опционально через date-range field. |
| **Q7** | sa-panel default — **(b) «Все» КРОМЕ archived** | Оператор использует «Все» когда ищет конкретную не-архивную; включение archived создаёт длинный список. |
| **Q8** | sa-panel default — **(a) НЕТ confirm на pill click** | Изменение обратимо через тот же pill; toast достаточно. Confirm только на bulk-actions C.1. |

**Status:** `spec-approved by popanel` 2026-05-01. Pending: `tamd` Q2 review (enum semantics + amoCRM US-13 conflict check) + `dba` migration plan review (Q5 jsonb storage + 3 миграции). После двух reviews — `spec-finalized`, ждём US-12 release closure → dev start.

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | intake assigned, прошу spec по 3 sub-task'ам. Skill-check (`product-capability` + `blueprint` + `design-system`) + фиксация активации обязательна |
| 2026-05-01 | sa-panel | popanel | spec draft готов (этот файл). Ждёт: (1) PO review, (2) UX findings input из `note-uxpanel.md` § «Pre-spec UX for INBOX» — feed обратно в spec корректировками, (3) operator answer на Q1-Q8, (4) `tamd` review status enum (Q2 escalation), (5) `dba` review migration plan. После всех 5 — status `spec-approved` → ждём US-12 release closure → dev start |
