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

# sa-panel — PANEL-MEDIA-LIBRARY

## Skill activation (фиксация)

- `design-system` — brand-guide §12.4 grid view pattern + §11 cards.
- `api-design` — `/api/admin/media/orphans` endpoint + Payload media collection conventions.
- `product-capability` — оператор увидит «что загружено» одним взглядом, чистит S3 от мусора.

## Цель

`/admin/collections/media` представлен grid view с thumbnails, фильтрами (type / orphaned / date / uploader), orphan detection и bulk-cleanup. Per-asset detail drawer показывает «used-in».

## Acceptance Criteria

- **AC1 — Grid view:** Custom view зарегистрирован для `media` collection через `admin.components.views.list`. 4-column responsive grid (2 columns на mobile-chrome 375px). Thumbnail size — Payload `upload.imageSizes.thumbnail` (256×256 cover).
- **AC2 — Asset card:**
  - Image → thumbnail.
  - Non-image (PDF / video / docx) → generic line-art icon из 49-glyph набора §9 (или universal file-icon если нет в наборе).
  - Caption: filename (truncated 1 line), size (KB / MB), uploaded ago.
  - Hover state — overlay с «Открыть» + «Удалить» actions.
  - Orphaned badge (right-top corner, brand error tint #aa2c2c) если no references.
- **AC3 — Filters:**
  - `type`: image / video / document (multi-select).
  - `uploaded_by`: relationship users.
  - `uploaded_after`: date.
  - `orphaned: true|false` toggle (server-side через `/api/admin/media/orphans` aggregation).
- **AC4 — Detail drawer (click card):**
  - Big thumbnail (640px max).
  - Metadata: filename, mime, size, dimensions (если image), uploaded_by, uploaded_at, alt text (если image).
  - **Used-in** список: `[Cases / "Случай №42" → image] · [Blog / "Подготовка сада" → featuredImage]`. Если empty — badge «Не используется» + CTA «Удалить».
  - Actions: «Скачать», «Удалить» (с confirmation), «Закрыть».
- **AC5 — Bulk cleanup:** Filter `orphaned: true` + select all + bulk «Удалить N» (использует pattern из PANEL-BULK-PUBLISH). Confirmation modal: «Удалить N неиспользуемых файлов? Действие необратимо.». Удаление = DB row + S3 object (Payload native delete hook).
- **AC6 — Endpoint:** `POST /api/admin/media/orphans` body `{ids: [...]}` → returns `{orphans: [...id], total_checked: N}`. Внутри — для каждого `id`: проверка `payload.find({collection: <each_collection_with_image_field>, where: {<imageField>: {equals: id}}, limit: 1})`. Если все `find()` → 0 → orphan. RBAC admin-only.
- **AC7 — Performance:** Initial grid load p95 < 1s (50 thumbnails). Orphan check p95 < 3s for 100 ids (parallel `Promise.all` per-collection lookups; 7 коллекций × 100 ids = 700 быстрых index-hits).
- **AC8 — Tests + Evidence:**
  - Playwright: upload 3 images через edit-view Cases → 1 unused (не привязан) → `/admin/collections/media` → toggle filter `orphaned: true` → видим 1 → bulk-delete → confirm → grid обновился, S3 объект удалён (verify через mock S3).
  - Screenshots: `screen/panel-media-grid.png`, `screen/panel-media-detail-drawer.png`, `screen/panel-media-orphan-badge.png`.

## Brand-guide §12 mapping

- **§12.4 grid view** — admin grid pattern, gap, padding по token'ам.
- **§11 cards** — asset card states (rest / hover / focus-visible / selected for bulk).
- **§9 line-art icons** — generic file icon (если есть; иначе иконка-запрос к `art` через cpo, не блокер MVP).
- **§13 TOV** — «Не используется», «Удалить», confirmation modal копия.

## Архитектура / approach

**Frontend:** `<MediaGrid>` custom view в `site/app/(payload)/admin/components/media/MediaGrid.tsx`. Использует Payload `useListQuery` hook для data + filters. Для non-image card → `<FileIcon mime={...}>` с mapping mime → icon name (image-png, image-jpg, application-pdf, video-mp4 → generic-file).

**Backend:** Новый endpoint `site/app/(payload)/api/admin/media/orphans/route.ts`. Принимает `ids: string[]` (POST body, чтобы не упереться в URL length лимит при 1000+ ids). Делает per-collection lookup через Payload Local API parallel. Возвращает `orphans: string[]`.

**Schema:** `media` collection не меняем (используем существующие fields). При желании, в фазе 2 — добавить virtual field `usageCount` через `afterRead` hook, не в этом US.

**Storage:** Payload native delete hook удаляет S3 file автоматически (через configured storage adapter). Nothing custom to wire.

## Risks + mitigations

1. **Race condition (orphan flag stale)** — между orphan-check и delete-action оператор привязал media к новому document в другой tab → bulk-delete стер живой файл. Mitigation: re-check orphan status в endpoint `DELETE /api/media/<id>` before actual delete (guard); если live → 409 Conflict, показываем error toast «Файл используется в "...", удаление отменено».
2. **Орфан-aggregation overhead на больших data sets** — 10k media + 7 коллекций = до 70k Local API calls. Mitigation: AC6 указывает batch endpoint (`POST` с массивом ids), parallel internal; для filter-by-orphan `/admin/collections/media?orphaned=true` — server-side aggregation, не client-side filter; при > 1000 media показываем warning + paginate orphan check.
3. **Mime detection unreliable** — `image/jpeg` vs `image/jpg` vs missing mime. Mitigation: fallback на extension (`.jpg`, `.png`, `.pdf`), generic-file icon для unknown.
4. **S3 delete partial fail** — DB row удалён, S3 retry failed → orphan reverse (S3 object без DB ref). Mitigation: Payload built-in delete hook handles this; в случае S3 fail — DB rollback (Payload поведение); document в risk-section отдельно для observability.
5. **Permission: not all uploads are operator-deletable** — если в будущем добавятся multi-user roles, junior оператор не должен удалять uploads других. Mitigation: AC6 RBAC = admin-only сейчас; при появлении roles — обновляется access control в media collection.

## Out-of-scope

- Auto-cleanup background job (cron «удалить orphans старше 90 дней») — PO default NO; отдельный US.
- Image editor / crop / resize — отдельный US.
- Folder structure / tags для media — отдельный US.
- Drag-and-drop bulk upload — отдельный US (Payload native single-file upload используем).
- Watermarking / EXIF stripping — security-фича отдельно.

## Состав команды

- **sa-panel** (this) — spec.
- **be-panel** — endpoint + delete guard + RBAC.
- **fe-panel** — `<MediaGrid>` view + filters + detail drawer.
- **ux-panel** — visual review §12.4 grid + asset card states.
- **cw** — RU labels review.
- **qa-panel** — Playwright e2e + S3 mock + perf-test 100 ids.
- **cr-panel** — security review (RBAC, race condition guard), final review.

**НЕ нужны**: `tamd` (no ADR), `dba` (no schema change).

## Open questions

- ~~Не-image файлы?~~ closed (YES).
- ~~Auto-cleanup?~~ closed (NO).
- ~~Soft vs hard delete?~~ closed (hard-delete с confirmation).
- **Sub-task fe-panel (не блокер):** какой именно slot в Payload 3.84 для custom list view (`admin.components.views.list` подтверждён в W5/ADR-0010).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: batch spec request (autonomous mandate).
- 2026-05-01 · sa-panel → popanel: spec ready, dev-ready (no ADR).
- 2026-05-01 · popanel → sa-panel: self-approved per autonomous mandate, status dev-ready.
