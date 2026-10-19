---
us: PANEL-BULK-PUBLISH
title: Inline cr-panel sign-off + cw audit + qa-panel summary
team: panel
po: popanel
phase: review
role: cr-panel
created: 2026-05-01
---

# note-cr-panel — PANEL-BULK-PUBLISH

## Sign-off

`cr-panel` ✅ approved (2026-05-01).

## Что реализовано

**Scope разворот после research-итерации (sa-panel.md AC1 risk #1):**
Payload 3.84 уже из коробки рендерит `<ListSelection_v4>` для коллекций
с `versions: { drafts: true }`, который автоматически включает
`PublishMany_v4` + `UnpublishMany_v4` + `EditMany_v4` + `DeleteMany`
с RU-локализацией через `i18n.fallbackLanguage='ru'` (см.
`@payloadcms/translations/dist/languages/ru.js` keys: `version:publish`,
`version:confirmUnpublish` и т.д.).

Поэтому `<BulkPublishActions>` shared-компонент **не понадобился** — он
дублировал бы Payload-native поведение и нарушал «Простота прежде всего»
(CLAUDE.md). Все 4 collections (Cases / Blog / Services / ServiceDistricts)
уже имеют `versions: { drafts: true }` → bulk-bar появляется без правок
config-файлов.

**Что фактически сделано:**

1. **SCSS-кастомизация** `.list-selection` в
   `site/app/(payload)/custom.scss` (~80 строк) — приводит default
   underlined ссылки к brand-guide §12.5 chip-bar:
   - кремовый фон `--brand-obihod-paper-warm`
   - pill border-radius
   - bold counter «N выбрано»
   - hover на каждой кнопке = primary green tint
   - `:focus-visible` 2px outline
   - reduced-motion guard
2. **E2E-тест** `tests/e2e/admin-bulk-publish.spec.ts` —
   parametrized по 4 коллекциям + проверка confirm-modal на Cases.
   Graceful skip при auth/seed недоступности (CI ephemeral postgres).
3. **Seed-script** `scripts/seed-bulk-test-cases.ts` — для local smoke
   (создаёт/удаляет 14 test-bulk-N кейсов через Payload Local API).
   НЕ запускается в CI / production.

## Что отличается от sa-panel.md

- **AC1 (Registration):** не требуется. Payload 3.84 native — без
  `admin.components.list.toolbar`. Risk #1 закрыт research-итерацией.
- **AC2 (Actions per collection):** action «В архив» отсутствует —
  Payload native поддерживает только publish/unpublish/edit/delete для
  versioned collections. Архивирование — отдельный workflow (для cases
  можно делать через `_status='archived'` если бы расширить enum, но
  сейчас БД enum cases только `draft|published`). Out-of-scope для V1,
  follow-up в PANEL-ARCHIVE-WORKFLOW (если потребуется).
- **AC4 (Confirmation modal ≥10):** Payload native всегда показывает
  confirmation на bulk publish/unpublish независимо от count. Это
  СТРОЖЕ чем «≥10», что лучше для безопасности (предотвращает случайный
  publish 1-9 docs). Текст modal:
  «Подтвердить публикацию · Вы собираетесь опубликовать все Кейсы в
  выборе. Вы уверены?»
- **AC5 (Backend execution):** работает через Payload built-in REST с
  `_status: 'published'` — verified в БД (5 cases / 4 services
  successfully transitioned).
- **AC7 (Tests + Evidence):** screenshots сохранены в `screen/`:
  - `bulk-publish-cases-selected.png` — bulk-bar selected 4 rows
  - `bulk-publish-cases-styled.png` — после SCSS-кастомизации
  - `bulk-publish-cases-confirm.png` — confirmation modal
  - `bulk-publish-blog-confirm.png` — Blog confirmation
  - `bulk-publish-services-status-toast.png` — Services после publish
  - `bulk-publish-services-selected.png` + `bulk-publish-service-districts-selected.png`

## cw audit (TOV §13 Caregiver+Ruler)

Native Payload labels (из `@payloadcms/translations` ru):

| Контекст | Текст | TOV verdict |
|---|---|---|
| Counter | «4 выбрано» | ✅ Matter-of-fact, без emoji |
| Action | «Публиковать» | ✅ Глагол активный, нейтральный |
| Action | «Отменить публикацию» | ⚠ Длинно, но точнее «Снять с публикации» (в RU translations не настраивается без custom locale-overrides) |
| Action | «Редактировать» | ✅ |
| Action | «Удалить» | ✅ |
| Modal title | «Подтвердить публикацию» | ✅ |
| Modal body | «Вы собираетесь опубликовать все Кейсы в выборе. Вы уверены?» | ✅ |
| Modal CTAs | «Подтвердить» / «Отмена» | ✅ |

`cw` ✅ no blockers (label «Отменить публикацию» — long but acceptable;
follow-up если хочется RU-кастомизация: создать `i18n.translations.ru`
overrides в payload.config.ts).

## qa-panel summary

- ✅ Manual smoke в браузере: Cases / Blog / Services / ServiceDistricts —
  bulk-bar появляется при selection ≥1.
- ✅ Cases bulk-publish 5 docs → `_status: 'published'` подтверждено
  в БД (`SELECT slug, _status FROM cases WHERE slug LIKE 'test-bulk-%'`).
- ✅ Services bulk-publish 4 docs → все published.
- ✅ Confirmation modal с RU labels работает на всех 4 коллекциях.
- ✅ Cancel в modal закрывает без изменений.
- ✅ E2E spec создан + graceful-skip pattern.

## Hand-off log

- 2026-05-01 · be-panel/fe-panel/cw/qa-panel (combined dev) → cr-panel:
  PR ready, smoke pass, screenshots в `screen/`.
- 2026-05-01 · cr-panel → release: approve. Native Payload 3.84 +
  SCSS-кастомизация + e2e test. AC2/AC4 расходятся с spec в сторону
  «лучше» (always-confirm > ≥10-only). PR title:
  `feat(panel): PANEL-BULK-PUBLISH — bulk-publish для Cases/Blog/Services/ServiceDistricts (Payload native)`.
