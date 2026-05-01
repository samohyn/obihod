---
us: PANEL-BULK-PUBLISH
title: Bulk-publish + bulk-edit для Cases / Blog / Services / ServiceDistricts
team: panel
po: popanel
type: feature
priority: C
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
blocks: []
blocked_by: []
related: [PANEL-LEADS-INBOX, US-12-admin-redesign-wave5]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: false
---

# Intake — PANEL-BULK-PUBLISH

## Skill activation

- `design-system` — brand-guide §12.5 BulkActions component (chip-bar над list-view, brand colors).
- `api-design` — Payload native bulk operations contract (`drafts` enabled, `_status` field semantics).
- `product-capability` — оператор массово закрывает контент-волны (10-20 cases/blog за раз перед SEO-релизом).

## Резюме запроса

Сейчас оператор после контент-волны открывает per-item edit-view 10-20 раз для смены `_status: draft → published`. Payload 3 имеет нативную поддержку bulk operations через `admin.components.list.toolbar` и REST `PATCH /api/<collection>?where=...` с `{_status: 'published'}`. Brand-guide §12.5 BulkActions chip-bar (mockup ~line 3050) описывает UI-паттерн.

Документация: https://payloadcms.com/docs/admin/components#bulk-actions (custom bulk actions через `admin.components.list.toolbar` или встроенные через `versions.drafts: true`).

## Целевые коллекции

- `Cases` (drafts enabled) — bulk-publish, bulk-unpublish, bulk-archive
- `Blog` (drafts enabled) — bulk-publish, bulk-unpublish, bulk-archive
- `Services` (drafts enabled) — bulk-publish, bulk-unpublish (osторожнее: services published влияют на SEO sitemap)
- `ServiceDistricts` (drafts enabled) — bulk-publish, bulk-unpublish (programmatic SEO pages)

## Bulk-edit (расширенный scope)

- `Cases` / `Blog` → bulk assign `category` или `tags`
- `Services` / `ServiceDistricts` → bulk update `priorityOrder` (для sidebar sorting)

Bulk-edit — Phase 2; в этом US ограничиваемся bulk-publish (явно проще, native support выше).

## Deliverables

1. `sa-panel.md` (этот) — AC + UI spec + Payload API contract.
2. `be-panel` — registration of bulk actions в 4 collection configs.
3. `cw` (CMS Editor) — RU labels для bulk actions: «Опубликовать», «Снять с публикации», «В архив», confirmation modals.
4. `qa-panel` — Playwright e2e на bulk publish 5 cases.

## Open questions

- ~~Bulk-delete тоже включаем?~~ — **closed** (PO default): NO. Soft-delete уже в PANEL-LEADS-INBOX, а для контента delete = разрушающее, требует confirm modal + audit log → отдельный US после PANEL-AUDIT-LOG.
- ~~Bulk-edit Phase 2 в этот US?~~ — **closed** (PO default): NO, Phase 2 separate US (PANEL-BULK-EDIT) после PANEL-BULK-PUBLISH ship.
- ~~Confirmation modal для bulk-publish?~~ — **closed** (PO default): YES для ≥10 items («Опубликовать N материалов?»); <10 без modal.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (Payload native API, no ADR needed).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
