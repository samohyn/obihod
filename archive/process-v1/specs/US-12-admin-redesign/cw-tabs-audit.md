---
title: cw — admin.description audit (US-12 W4 §4.4 deliverable)
owner: cw
date: 2026-04-30
spec_ref: specs/US-12-admin-redesign/sa-panel-wave4.md §4.4
status: phase-1 done (4 collections), phase-2 roadmap
---

# cw audit — `admin.description` для всех fields в 11 коллекциях

**Спека:** [sa-panel-wave4.md §4.4](sa-panel-wave4.md). TOV: серьёзный без казёнщины ([brand-guide.html §13](../../design-system/brand-guide.html)). ≤140 символов. Объясняет НЕ что это поле, а **зачем** — полезно для оператора.

---

## Inventory (на 2026-04-30 до этого audit)

| Коллекция | Fields | Описаний | Missing | Priority |
|---|---|---|---|---|
| **Leads** | 17 | 5 → 17 | 12 → **0** | ✅ done |
| **Services** | 28 | 12 → 28 | 16 → **0** | ✅ done |
| **Cases** | 25 | 12 → 25 | 13 → **0** | ✅ done |
| **Blog** | 26 | 11 → 26 | 15 → **0** | ✅ done |
| Districts | 22 | 16 | 6 | medium |
| ServiceDistricts | 24 | 29 (counts tab descriptions) | 0-3 | done (mostly) |
| Authors | 19 | 15 | 4 | medium |
| B2BPages | 13 | 5 | 8 | medium |
| Persons | 15 | 2 | 13 | low (внутренняя коллекция) |
| Media | 8 | 4 | 4 | low (auto-fields) |
| Redirects | 4 | 4 | 0 | ✅ done |

**Phase 1 — applied (этот PR):** 56 новых описаний на 4 high-frequency коллекциях, которые оператор использует ежедневно.

**Phase 2 — roadmap (отдельные PR при потребности):** 31 описание на 5 less-frequent коллекциях.

---

## Phase 1 — applied descriptions (this PR)

### Leads (12 added)

| Field | Description |
|---|---|
| `phone` | Главный канал связи — звоним сюда первым делом. |
| `name` | Как обращаться к клиенту. Если пусто — узнаешь при звонке. |
| `email` | Для отправки сметы и подтверждений. Опционально. |
| `preferredChannel` | Куда писать вместо звонка — клиент сам выбрал на сайте. |
| `service` | Услуга из заявки — нужна для роутинга бригаде и расчёта. |
| `district` | Район объекта — определяет логистику и стоимость выезда. |
| `photos` | Фото объекта от клиента — основа для AI-черновика сметы. |
| `photos.s3Key` | Ключ объекта в S3 — внутреннее, не редактировать. |
| `photos.url` | Публичный URL фото — для предпросмотра. |
| `estimateDraftJson` | AI-черновик сметы по фото. Финальную утверждает оператор. |
| `sourcePage` | URL страницы, с которой пришла заявка. |
| `utmSource` | UTM source — рекламный канал (yandex, google, vk). |
| `utmMedium` | UTM medium — тип трафика (cpc, cpm, organic). |
| `utmCampaign` | UTM campaign — название рекламной кампании. |
| `callTrackingId` | ID звонка из Calltouch/CoMagic — связь с записью разговора. |
| `status` | Этап воронки. Новый → перезвонил → смета → договор/потеря. |
| `amoCrmId` | ID сделки в amoCRM — для двусторонней синхронизации. |
| `syncedAt` | Когда последний раз синхронизировалось с amoCRM. |

### Services (16 added)

Tab «Основные»: slug / title / h1 / priceFrom / priceTo / priceUnit (все 6 полей).
Tab «Контент»: intro / heroImage / gallery (все 3).
Tab «Sub-услуги»: subServices.slug/title/h1/priceFrom/metaTitle/metaDescription (6 nested).
Tab «FAQ»: faqGlobal + question/answer (3).
Tab «SEO»: metaTitle/metaDescription/ogImage/schemaJsonLdOverride (4).
Tab «Связи»: relatedServices (1).

Tone примеры: «Часть URL: /<slug>/. Меняешь — старый URL умрёт, нужен redirect.» / «Главное фото услуги — наш реальный объект, не сток.»

### Cases (13 added)

Tab «Основные»: slug / title / h1 / service / district / dateCompleted / brigade (7).
Tab «История»: description / videoUrl / videoTranscript / durationHours / finalPrice (5).
Tab «Галерея»: photosBefore + photosAfter + image/caption nested (5 + nested).
Tab «SEO»: metaTitle / metaDescription / ogImage (3).

### Blog (15 added)

Tab «Основные»: slug / title / h1 / author / category / publishedAt / modifiedAt (7).
Tab «Контент»: intro / body / heroImage / ogImage (4).
Tab «How-to»: isHowTo / howToSteps + name/text nested (4 nested).
Tab «FAQ»: faqBlock + question/answer nested (3).
Tab «SEO»: metaTitle / metaDescription / tagsServices / tagsDistricts (4).

---

## Phase 2 — roadmap (deferred)

### Districts (6 missing) — medium priority

Поля без description: nominative, accusative, prepositional, genitive (case forms), populationThousand, areaKm2 (или подобное).

**Recommended descriptions:**

| Field | Proposed |
|---|---|
| `nameNominative` | Именительный: «Раменское». Для заголовков и breadcrumbs. |
| `nameAccusative` | Винительный: «в Раменском». Для текста «Услуги в …». |
| `namePrepositional` | Предложный: «о Раменском». Для intro-текстов. |
| `nameGenitive` | Родительный: «из Раменского». Для отзывов и адресов. |
| `populationThousand` | Население в тысячах — для расчёта спроса и каталога. |
| `areaKm2` | Площадь в км² — справочно, для GEO-снippet. |

### B2BPages (8 missing) — medium

Recommended approach: open Read collection, добавить description по аналогии с Services pattern (slug/title/h1/segments per УК/ТСЖ/FM).

### Authors (4 missing) — medium

Recommended: photo / role / expertise / bio TOV-aware descriptions.

### Persons (13 missing) — low

Внутренняя коллекция (бригада, контакты сотрудников). Operator не часто открывает. Defer до запроса.

### Media (4 missing) — low

Auto-managed Payload fields (filename, mimeType, filesize, url). Стандартные descriptions.

### ServiceDistricts (0-3 missing) — mostly done

Уже хорошо описана через tab descriptions.

### Redirects (0 missing) — done

---

## Tone guidelines применены

✅ Серьёзный без казёнщины:
- «Главный канал связи — звоним сюда первым делом» вместо «Поле для номера телефона клиента».
- «AI-черновик сметы по фото. Финальную утверждает оператор» вместо «Автоматически сгенерированная JSON структура сметы».

✅ «Зачем», не «что»:
- «Для отправки сметы и подтверждений» вместо «Email клиента».
- «Меняешь — старый URL умрёт, нужен redirect» вместо «URL slug в kebab-case».

✅ ≤140 символов: все 56 новых descriptions укладываются.

✅ Без emoji / capslock / Тильда-эстетики (brand-guide §14 Don't).

---

## Hand-off log

| Timestamp | From | To | Что |
|---|---|---|---|
| 2026-04-30 | cw (impersonated by popanel) | popanel | Phase 1 done — 56 descriptions на 4 high-frequency collections |
| 2026-04-30 | popanel | cr-panel | review TOV compliance + tab structure preserved |
| 2026-04-30 (post-merge) | cw | popanel | Phase 2 (deferred) — 31 description на 5 less-frequent collections |
