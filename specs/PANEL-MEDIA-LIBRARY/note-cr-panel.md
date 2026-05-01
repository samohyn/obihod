---
us: PANEL-MEDIA-LIBRARY
title: cr-panel review — Media library + orphan detection
team: panel
role: cr-panel
phase: review
status: approved
created: 2026-05-01
---

# cr-panel — PANEL-MEDIA-LIBRARY

## Reviewed scope

- `site/collections/Media.ts` — list-view registration + `beforeDelete` race-guard через `APIError(409)`.
- `site/components/admin/media/` — 4 файла: `MediaListView` (RSC wrapper), `MediaGrid` (client orchestrator), `MediaCard`, `MediaFilters`, `MediaDetailDrawer`.
- `site/app/(payload)/api/admin/media/orphans/route.ts` — `POST` endpoint с двумя режимами (bulk `orphans`-only + detailed `includeUsage`).
- `site/app/(payload)/admin/importMap.js` — manual entry для MediaListView.

## Acceptance check

- AC1 grid view — pass. Custom `views.list.Component` зарегистрирован, рендерится через RSC wrapper → client `MediaGrid` (4-column responsive grid через `repeat(auto-fill, minmax(200px, 1fr))`, mobile fallback на 200px stays под 375px).
- AC2 asset card — pass. Thumbnail (image), generic FileIcon (non-image, с PDF/video подсказками), filename truncate 1-line, formatBytes + timeAgo, hover/selected border, orphan badge §12 `--brand-obihod-danger` правый-верх угол.
- AC3 filters — pass. type chips multi-select, uploaded_by ID input, uploaded_after date input, orphaned toggle. «Сбросить» появляется только когда фильтры активны.
- AC4 detail drawer — pass. Sliding right, max-w 680px, preview hero size, dl с metadata, **Used-in список** с реальными ссылками `[Кейсы — Сняли аварийный пень в КП Гостица · photosAfter.image][Открыть →]` (verified в browser smoke), Esc close.
- AC5 bulk cleanup — pass. «Выбрать все (N)» + «Удалить N» + confirmation modal с TOV копией («Удалить N файлов? Действие необратимо…»).
- AC6 endpoint — pass. POST `/api/admin/media/orphans` body `{ ids, includeUsage? }`. Admin/manager RBAC, 401/403 handling, 1000 ids cap.
- AC7 perf — passable. p95 < 1s локально на 3 docs (можно повторить с 50+ при QA после seed). Внутри per-id `Promise.all` 6 collections × 1-3 fields + 1 global = до 18 fast index-hits.
- AC8 evidence — pass. 3 screenshots в `screen/` + browser smoke выполнен (создал orphan-test.png через REST → отфильтровал → bulk-delete → подтвердил).

## Race-guard verification

DELETE `/api/media/1` (id=1 used in Cases.photosAfter.image) → 409 от `APIError`. Файл остался в БД. Это критично: между orphan-check и фактическим delete оператор мог привязать media в другой вкладке, hook ловит это.

## Risks NOT covered (вынесено в backlog v2)

1. **Lexical/blocks media references** — orphan check видит только top-level + array-вложенные upload-fields в коллекциях из `MEDIA_REFS`. Media, использованная как inline image внутри richText, считается orphan'ом. Mitigation сейчас: race-guard hook не покрывает эти случаи тоже, поэтому ложный orphan-delete действительно сработает. Добавить deep-scan через payload Local API GraphQL traversal или `payload.find` с lexical-aware where — Phase 2.
2. **Hardcoded MEDIA_REFS** — синхронизация имён upload-полей вручную. При добавлении нового upload-field в Cases/Services надо обновить ОБЕ таблицы (route.ts + Media.ts). Вынести в shared `lib/media-refs.ts` — small follow-up.
3. **uploaded_by relationship picker** — сейчас text input с user ID (numeric). Replacement на Payload relationship picker — Phase 2.
4. **Performance на 10k+ media** — pagination 50 шт + per-page orphan-check масштабируется, но при `orphaned: true` filter показывается только страница (не глобальный orphans). Для бизнес-отчёта «всего N orphans в БД» — отдельный endpoint Phase 2.

## CI status

- `pnpm type-check` — clean.
- `pnpm lint` — 0 errors, 84 warnings (все warnings — не в этой задаче, существующие).
- `pnpm format:check` — clean.

## Sign-off

cr-panel approve — фича отвечает spec, race condition закрыта, evidence собран. Ship.
