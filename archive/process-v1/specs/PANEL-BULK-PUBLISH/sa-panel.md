---
us: PANEL-BULK-PUBLISH
title: Bulk-publish + bulk-edit для Cases / Blog / Services / ServiceDistricts
team: panel
po: popanel
type: feature
priority: C
segment: admin
phase: review
role: sa-panel
status: dev-done
blocks: []
blocked_by: []
related: [PANEL-LEADS-INBOX, US-12-admin-redesign-wave5]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: false
---

# sa-panel — PANEL-BULK-PUBLISH

## Skill activation (фиксация)

- `design-system` — brand-guide §12.5 BulkActions chip-bar (mockup ~line 3050) + §12.4 button states (primary action в chip-bar).
- `api-design` — Payload native bulk operations (`PATCH /api/<collection>?where=...`) + `versions.drafts` + `_status` semantics.
- `product-capability` — оператор завершает контент-волну одним bulk-action вместо 10-20 кликов в edit-view.

## Цель

В list-view коллекций `Cases`, `Blog`, `Services`, `ServiceDistricts` добавить bulk-action toolbar с action'ами «Опубликовать», «Снять с публикации», «В архив». Оператор выделяет N rows checkboxes → chip-bar → action → confirmation modal (для ≥10) → выполнение.

## Acceptance Criteria

- **AC1 — Registration:** В 4 collection configs (`site/collections/{Cases,Blog,Services,ServiceDistricts}.ts`) добавлен `admin.components.list.toolbar` или native `admin.components.actions.list` с custom bulk actions компонентом. Используется Payload 3 native pattern (см. https://payloadcms.com/docs/admin/components#bulk-actions). Реализация — один shared компонент `<BulkPublishActions collectionSlug={...}>` в `site/app/(payload)/admin/components/bulk/`.
- **AC2 — Actions per collection:**
  - `Cases` / `Blog` / `Services` / `ServiceDistricts` → 3 actions: «Опубликовать» (`_status: published`), «Снять с публикации» (`_status: draft`), «В архив» (`_status: archived` если коллекция поддерживает; иначе action скрыт).
  - **Не добавляется:** «Удалить» (out-of-scope, см. PO default).
- **AC3 — UI states:**
  - Toolbar invisible когда нет selection.
  - Toolbar появляется поверх list-view header при `selectedDocs.length ≥ 1`.
  - Counter «Выбрано: N».
  - Action button states: rest / hover / active / disabled (`loading`) / has-error.
  - После action — toast «Опубликовано N материалов» (success) или «Не удалось опубликовать (попробуйте ещё)» (error) — TOV §13.
- **AC4 — Confirmation modal:** При `selectedDocs.length ≥ 10` показывается modal: title «Опубликовать N материалов?», body «Это действие изменит статус сразу для нескольких записей.», CTAs «Опубликовать» (primary амбер #e6a23c per §12.4.1) + «Отмена» (secondary). Эскейп / клик на overlay = «Отмена».
- **AC5 — Backend execution:** При confirm — `PATCH /api/<collection>?where[id][in]=<ids>` с `body: {_status: 'published'}`. Payload native обрабатывает versioning (`versions.drafts: true`). После — list refetch.
- **AC6 — RBAC:** Bulk action доступен только если `user.role` имеет write-access к коллекции. По умолчанию admin-only.
- **AC7 — Tests + Evidence:**
  - Playwright: login → `/admin/collections/cases` → select 5 rows → click «Опубликовать» → confirmation для 10+ skipped (5<10) → toast «Опубликовано 5 материалов» → refetch видит `_status: published` на всех 5.
  - Screenshot: `screen/panel-bulk-publish-toolbar.png`, `screen/panel-bulk-publish-confirm-modal.png`.

## Brand-guide §12 mapping

- **§12.5 BulkActions** — chip-bar pattern, brand colors, position над list-view header.
- **§12.4.1 Primary CTA pill (амбер)** — «Опубликовать» в confirmation = primary CTA.
- **§13 TOV** — labels («Опубликовать», «Снять с публикации», «В архив»), toast-копия, modal-копия. cw owns label review.
- **§11 Notifications/Toast** — success / error toast следует token'ам.

## Архитектура / approach

**Shared component:** `<BulkPublishActions>` принимает `collectionSlug` props, читает `selectedDocs` из Payload list context (через `useListQuery` или эквивалент Payload 3.84 hook). Action handlers — fetch к `/api/<slug>` с `where[id][in]`. Confirmation modal — переиспользуем shadcn-style dialog уже существующий в W5/W7 (или Payload native modal API).

**Backend:** Никакого нового API endpoint — всё через Payload built-in REST с RBAC через collection access control (уже настроены в `Cases.ts` etc.). Никаких новых миграций.

**Per-collection wiring:** В каждом из 4 configs:
```ts
admin: {
  components: {
    list: {
      toolbar: ['site/app/(payload)/admin/components/bulk/BulkPublishActions#default'],
    },
  },
}
```
(точный slot — research fe-panel, см. risks).

## Risks + mitigations

1. **Payload 3.84 slot mismatch** — `admin.components.list.toolbar` может не существовать в текущей версии (W5 уже сталкивался с `views.list.Empty` отсутствием — ADR-0010). Mitigation: fe-panel research-итерация в Payload 3.84 source перед wiring; fallback — `admin.components.beforeListTable`.
2. **N+1 при больших bulk (50+ items)** — Payload может выполнять per-item afterChange hooks (revalidate). Mitigation: AC7 включает load-test bulk 20 items < 5s; если slow — задействовать `where` aggregation вместо individual updates (отдельный sub-task).
3. **Stale list cache после bulk** — после PATCH list-view не показывает новый `_status` без refetch. Mitigation: trigger Payload list refetch hook после success (`useListQuery().refetch()` или эквивалент).
4. **Concurrent bulk + per-item edit** — оператор открыл case в одной tab, bulk-publish в другой → версия rollback. Mitigation: Payload версионирование (`versions.drafts`) обрабатывает concurrent updates безопасно; out-of-scope detailed conflict UX.
5. **No undo** — после bulk-publish single click не откатить. Mitigation: bulk-unpublish action существует, оператор делает revert одним же действием. PANEL-AUDIT-LOG (US-AUDIT-LOG) даст historical view позже.

## Out-of-scope

- Bulk-delete (PO default).
- Bulk-edit (assign category / tags / priority) — Phase 2, отдельный US `PANEL-BULK-EDIT`.
- Bulk action analytics («сколько bulk operations за неделю») — отдельный US.
- Undo / scheduled publish / time-to-publish — отдельные US.

## Состав команды

- **sa-panel** (this) — spec.
- **be-panel** — collection config wiring + RBAC verify.
- **fe-panel** — `<BulkPublishActions>` shared component + modal + toast.
- **cw** — RU labels review (action labels, modal copy, toast copy).
- **qa-panel** — Playwright e2e + load-test 20 items + screenshots.
- **ux-panel** — visual review §12.5 chip-bar parity.
- **cr-panel** — final review.

**НЕ нужны**: `tamd` (ADR не нужен), `dba` (no schema change), `dba` migration (no migration).

## Open questions

- ~~Bulk-delete?~~ closed (NO).
- ~~Bulk-edit в этот US?~~ closed (NO, Phase 2).
- ~~Confirmation threshold?~~ closed (≥10).
- **Sub-task fe-panel (не блокер):** какой именно slot Payload 3.84 даёт для bulk toolbar? Research перед wiring.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (Payload native, no ADR).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
- 2026-05-01 · be-panel/fe-panel/cw/qa-panel (combined) → cr-panel: PR ready,
  Payload 3.84 native bulk-bar + SCSS chip-bar + e2e test, smoke pass на всех
  4 коллекциях. Скриншоты в `screen/bulk-publish-*.png`. См. note-cr-panel.md.
- 2026-05-01 · cr-panel → release: approve, AC2/AC4 расходятся со spec в
  сторону «лучше» (always-confirm > ≥10-only; «В архив» out-of-scope).
