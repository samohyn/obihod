---
us: PANEL-DASHBOARD-V2
title: Кастомизируемый dashboard (drag-drop widgets)
team: panel
po: popanel
type: feature
priority: W
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
related: [US-12-admin-redesign-wave3, PANEL-LEADS-INBOX, PANEL-AUDIT-LOG, PANEL-MEDIA-LIBRARY]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: false
---

# sa-panel — PANEL-DASHBOARD-V2

## Skill activation (фиксация)

- `design-system` — brand-guide §11 cards + §12 dashboard region + §12.4 widget interaction states (rest / dragging / drop-target / hidden).
- `api-design` — `users.dashboardLayout` schema + idempotent PATCH semantics + RBAC (user owns own layout).
- `product-capability` — capability framing: оператор сам выбирает priority информации на стартовом экране; дешёво расширять новыми widgets без UI rewrite.

## Цель

Стартовый экран `/admin` (после login) показывает widgets из per-user layout. Оператор может drag-drop reorder, hide/show widgets через «Настроить дашборд» menu. Layout persists на user level.

## Acceptance Criteria

- **AC1 — User schema:** `users` collection (`site/collections/Users.ts`) расширена полем:
```ts
{
  name: 'dashboardLayout',
  type: 'json',
  defaultValue: { widgetIds: [], hiddenIds: [] },
  admin: { hidden: true }, // не показываем в edit-view, управляется только UI dashboard'а
}
```
Migration не требуется (json field), но `dba` ревьюит на всякий случай.
- **AC2 — Widget registry:** Static TS array в `site/app/(payload)/admin/dashboard/widgets.ts`:
```ts
export type DashboardWidget = {
  id: string;
  title: string;
  icon?: string; // line-art icon name из §9
  defaultEnabled: boolean;
  Component: React.ComponentType;
};

export const widgets: DashboardWidget[] = [
  { id: 'recent-edits', title: 'Свежие правки', defaultEnabled: true, Component: RecentEditsWidget },
  { id: 'new-leads', title: 'Новые лиды', defaultEnabled: true, Component: NewLeadsWidget },
  { id: 'seo-health', title: 'SEO health', defaultEnabled: true, Component: SeoHealthWidget },
  { id: 'storage', title: 'Storage', defaultEnabled: false, Component: StorageWidget },
  { id: 'weekly-activity', title: 'Активность за неделю', defaultEnabled: false, Component: WeeklyActivityWidget },
];
```
- **AC3 — Default layout:** Если у user `dashboardLayout.widgetIds` empty или null → используется default order из registry filtered by `defaultEnabled: true`. Это гарантирует backward-compat и first-login UX.
- **AC4 — Drag-drop:** Native HTML5 drag-and-drop (draggable=true + dragstart/dragover/drop events). `dragging` class + opacity 0.5; `drop-target` highlighted border per brand token. Touch fallback на mobile-chrome — long-press 500ms (через `pointerdown` + setTimeout).
- **AC5 — Show/hide menu:** Top-right «Настроить дашборд» button → drawer/modal со списком all widgets из registry, чекбоксы для show/hide. Сохранение → PATCH `/api/users/<me>` с обновлённым `hiddenIds`.
- **AC6 — Persistence:** При drag-drop end → debounced (500ms) PATCH `/api/users/<me>` с `dashboardLayout: { widgetIds, hiddenIds }`. RBAC: user может PATCH only own (`req.user.id === doc.id`).
- **AC7 — Deprecated widget handling:** При render — фильтруем `widgetIds` через `widgets[]` registry. Если widget id отсутствует — silently skip + `Sentry.captureMessage('dashboard.deprecated_widget', {extra: {id}})`.
- **AC8 — Tests + Evidence:**
  - Playwright: login → `/admin` → видим default 3 widgets → click «Настроить» → enable «Storage» → видим 4 widgets → drag «Storage» в первую позицию → reload → порядок сохранён.
  - Screenshot: `screen/panel-dashboard-default.png`, `screen/panel-dashboard-customize-modal.png`, `screen/panel-dashboard-dragging.png`.

## Brand-guide §12 mapping

- **§12 dashboard region** — grid-area, gap, padding по token'ам.
- **§11 cards** — widget card states (rest / hover / dragging / drop-target / hidden).
- **§12.4.1 primary CTA** — «Сохранить» в customize-modal = primary амбер pill.
- **§13 TOV** — widget titles на русском, «Настроить дашборд», customize-modal copy.
- **§9 line-art icons** — 5 widget icons (если нужны) — pull request к `art` через cpo, не блокер для MVP.

## Архитектура / approach

**State management:** Local React state (`useReducer`) для drag-drop в реальном времени, debounced sync to server. После optimistic update — если PATCH fails → revert + toast «Не удалось сохранить дашборд».

**Default behavior:** Pure-derived из registry (никаких magic constants). Это критично, чтобы добавление нового widget в registry не требовало data migration для existing users.

**Re-use existing widgets:**
- `RecentEditsWidget` — уже сделан в W3 (PR #100), просто оборачиваем в registry entry.
- `NewLeadsWidget` — переиспользует `/api/admin/leads/count` endpoint из W3 + сетка last 5 leads (cheap).
- `SeoHealthWidget` — простой Local API `payload.find({collection: 'services', where: {_status: {not_equals: 'published'}}, limit: 0})` для count.
- `StorageWidget` — paired с PANEL-MEDIA-LIBRARY (зависит от его endpoint `POST /api/admin/media/orphans` для orphan count). Если MEDIA-LIBRARY ещё не shipped → widget показывает «Скоро».
- `WeeklyActivityWidget` — paired с PANEL-AUDIT-LOG (зависит от audit endpoint). Если AUDIT-LOG не shipped → widget показывает «Скоро».

**Coupling guard:** Widget которые зависят от других US должны deg-ade gracefully (показывают placeholder, не ломают dashboard). PR'ы UN-coupled.

## Risks + mitigations

1. **Native HTML5 drag-drop UX непредсказуем на mobile-chrome** — touch events не triggrer dragstart. Mitigation: AC4 touch fallback long-press 500ms; если не работает чисто — escalation на `react-grid-layout` (Phase 2 ADR).
2. **Optimistic update collisions** — две вкладки одного user одновременно reorder. Mitigation: server-side last-write-wins (Payload native), client → Sentry warning + reload prompt после 409.
3. **Performance — все widgets fetch при каждом login** — 5 widgets × API call = 5 requests на render. Mitigation: каждый widget owns свой fetch с `<Suspense>` boundary; не ждём один блокирующий aggregator. Если > 10 widgets в Phase 2 — добавим aggregation endpoint.
4. **`users.dashboardLayout` rogue write** — non-admin user через crafted PATCH меняет layout другого. Mitigation: AC6 RBAC strict — `req.user.id === doc.id` проверяется в `Users.access.update`.
5. **Widget IDs не уникальны / collision с deprecated** — Mitigation: TS const string union для `id` field; deprecation = переименование в `id-v2`, старый id silently skipped (AC7).

## Out-of-scope

- Widget config (params per widget — «новые лиды за 24h vs 7d») — Phase 2.
- Resize widgets (1×1 / 2×1 / 2×2) — Phase 2.
- Per-collection / per-role default layouts — Phase 2.
- Widget marketplace / dynamic widgets via Payload plugin — премature.
- Real-time updates (SSE) на widgets — отдельный US.
- Widget analytics («какие widgets чаще всего hidden») — отдельный US.

## Состав команды

- **sa-panel** (this) — spec.
- **be-panel** — `users.dashboardLayout` field + RBAC + `Users.access.update` guard.
- **fe-panel** — drag-drop UI + widget registry + customize modal + 5 widget components (3 — re-use existing data sources).
- **dba** — schema add JSON field consult (no migration ожидается, но verify).
- **ux-panel** — visual review §11 + §12 + dragging states.
- **cw** — RU labels review.
- **qa-panel** — Playwright + persistence test + mobile drag fallback test.
- **cr-panel** — security review (RBAC), final review.

**НЕ нужны**: `tamd` (no ADR), `art` (icons can be added in Phase 2 если 49-glyph set нет нужных).

## Open questions

- ~~Drag-drop native vs lib?~~ closed (native).
- ~~Phase 1 scope?~~ closed (show/hide + reorder).
- ~~Per-user vs global?~~ closed (per-user).
- ~~Deprecated widget handling?~~ closed (silently skip + Sentry warn).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate). Priority W — spec впрок.
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (queueable после M/S/C закрытия).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
