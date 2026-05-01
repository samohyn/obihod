---
us: PANEL-MEDIA-LIBRARY
title: Media browser + cleanup orphaned uploads
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
related: [PANEL-BULK-PUBLISH, US-12-admin-redesign-wave5]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, api-design, product-capability]
adr_required: false
---

# Intake — PANEL-MEDIA-LIBRARY

## Skill activation

- `design-system` — brand-guide §12 admin grid pattern + §11 lists/cards.
- `api-design` — Payload media collection REST + S3 storage adapter.
- `product-capability` — capability framing: оператор должен (1) browse all uploads с превью, (2) удалить unused.

## Резюме запроса

Текущий Payload admin показывает media только через relationship-pickers внутри edit-views (Cases image, Blog featuredImage). Standalone media browser — не сделан. Накапливаются orphaned uploads (загрузил → удалил document, файл в S3 остался). Brand-guide §12 mockup упоминает grid view (4-column thumbnail grid).

**Native:** Payload `media` collection (если уже есть) даёт list-view, но без thumbnail grid + без orphan detection.

## Scope

1. **Media browser:** `/admin/collections/media` показывает 4-column grid с thumbnails (вместо list rows).
2. **Filters:** type (image / video / document), uploaded by user, uploaded after date, **orphaned** (boolean — нет relationships ни в одной коллекции).
3. **Cleanup:** для `orphaned: true` — bulk-delete action с confirmation modal («Удалить N неиспользуемых файлов?»).
4. **Per-asset detail:** click thumbnail → drawer с metadata (size, dimensions, mime, uploaded-by, uploaded-at, **used-in** список documents).

## Tech notes

- Payload 3 имеет нативную `media` collection через `upload: true` + `staticDir`. Storage adapter — local FS (dev) или S3 (prod, см. tech stack).
- Orphan detection — query «нет references в ни одной collection». Реализация — server-side через `payload.find()` per-collection с `where: {<imageField>: {equals: media.id}}`. N+1 risk но only для cleanup-flow (рare action).
- Thumbnails — Payload built-in image sizes (`upload.imageSizes`) уже даёт `thumbnail` size. Используем.

## Deliverables

1. `sa-panel.md` (этот) — AC + UI spec + orphan detection contract.
2. `be-panel` — `/api/admin/media/orphans?ids[]=...` endpoint + (опционально) расширение media collection schema (`firstUsedAt`, `usageCount` virtual fields).
3. `fe-panel` — кастомная list view `<MediaGrid>` для media collection.
4. `qa-panel` — Playwright e2e: upload 3 → orphan один → cleanup один.

## Open questions

- ~~Поддержка не-image файлов (PDF, video)?~~ — **closed** (PO default): YES, generic file-icon thumbnail для non-image.
- ~~Auto-cleanup background job?~~ — **closed** (PO default): NO, ручное cleanup only (operator-controlled). Background job — отдельный US.
- ~~Soft-delete vs hard-delete?~~ — **closed** (PO default): hard-delete (S3 + DB row), но с confirmation modal обязательно.

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (Payload native + custom view, no ADR).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
