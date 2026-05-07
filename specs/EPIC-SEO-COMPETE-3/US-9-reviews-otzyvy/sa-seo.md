---
us: US-9
title: Reviews collection + /otzyvy/ + AggregateRating schema
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy + dba migration delegation)
type: tech-seo + new-collection + new-route
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo)
status: in_progress
blocks:
  - US-11 (Trust-блок footer ссылается на /otzyvy/)
blocked_by: []
related:
  - US-3 lib/seo/jsonld.ts (reviewSchema + aggregateRatingSchema sustained ready)
  - tamd-proxy review REC #6 (новая Reviews collection, не Homepage extension)
  - sustained Globals.Homepage.reviews (6 sustained отзывов)
created: 2026-05-06
updated: 2026-05-06
---

# US-9 — Reviews + /otzyvy/

## Цель

Создать Reviews collection + `/otzyvy/` route — закрывает gap для AggregateRating + Review schema (E-E-A-T axis из EPIC DoD AC-7 AI-citation).

## Скоуп

### IN

1. **`site/collections/Reviews.ts`** — новая Payload Collection:
   - Tab1 «Основные»: authorName, rating (1-5), text, datePublished
   - Tab2 «Контекст»: service relationship, district relationship, source select (Я.Карты / 2ГИС / Авито / форма / direct), sourceUrl
   - Tab3 «Verification»: verified (checkbox), pinnedToHomepage (для будущей migration), priority (sort)
   - `versions: { drafts: true }` (sustained pattern)
   - `afterChange` hook: revalidate `/otzyvy/` + `/sitemap.xml` (fire-and-forget pattern, sustained from Cases/Blog)

2. **`site/payload.config.ts`** — register Reviews в collections array (порядок: после Authors / B2BPages, перед Media)

3. **`site/app/(marketing)/otzyvy/page.tsx`** — list page:
   - Hero с аггрегатом (среднее + count)
   - List of reviews (rating stars + author + date + text + meta)
   - Lead-form CTA внизу
   - Cross-link на `/kalkulyator/foto-smeta/`
   - Schema: BreadcrumbList + AggregateRating + Review[] (top-50)

4. **`site/app/sitemap.ts`** — add `/otzyvy/` entry priority 0.6 weekly

### OUT (sustained для US-9 follow-up)

- **dba data-migration** sustained `Homepage.reviews[]` array → Reviews collection rows (REC #6 tamd review). Это требует Payload migration + script — выполнит dba после merge этого PR.
- **Homepage.tsx switch** с embedded reviews на Reviews collection — отдельный PR после dba migration done (риск breaking homepage). Sustained до W8.
- **Я.Карты integration** — sustained до operator setup карточки (US-9 Я.Карты track).
- **Reviews import script** (parser Я.Карты / 2ГИС reviews → Payload) — отдельный track, не блокирует EPIC DoD.

## Implementation

### Files

| Path | Type | Lines |
|---|---|---:|
| `site/collections/Reviews.ts` | new | ~150 |
| `site/payload.config.ts` | extend | +2 (import + collections array) |
| `site/app/(marketing)/otzyvy/page.tsx` | new | ~210 |
| `site/app/sitemap.ts` | extend | +9 (otzyvy entry) |

### Schema mapping (используем US-3 sustained helpers)

- `aggregateRatingSchema` → AggregateRating @ /otzyvy/ (среднее + count)
- `reviewSchema` (массив, top-50) → Review[] на странице
- `breadcrumbListSchema` → BreadcrumbList
- (Sustained) `localBusinessSchema` имеет `aggregateRating` поле — можно расширить позже когда reviews опубликованы

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | Reviews collection создан + register в payload.config | 🔵 |
| AC-2 | `/otzyvy/` рендерится (даже с 0 reviews — empty state) | 🔵 |
| AC-3 | AggregateRating schema если ≥1 review (иначе skip) | 🔵 |
| AC-4 | Review schemas массив top-50 reviews | 🔵 |
| AC-5 | `/otzyvy/` в sitemap.xml priority 0.6 | 🔵 |
| AC-6 | type-check + lint + format PASS | 🔵 |
| AC-7 | afterChange hook: revalidate `/otzyvy/` + sitemap при save | 🔵 |
| AC-8 | dba migration выполнена (homepage_reviews → reviews collection) | 🔵 sustained |
| AC-9 | ≥10 отзывов опубликовано (sustained: cms через Payload admin или import script) | 🔵 sustained |

## Hand-offs

- **poseo → leadqa:** post-merge `pnpm payload migrate:create reviews` + `pnpm payload migrate` локально, smoke `/otzyvy/` (empty state), затем добавить 1-2 mock reviews через admin → проверить AggregateRating рендерится
- **poseo → dba:** Phase 2 — data-migration sustained `homepage_reviews[]` array → Reviews collection rows. Нужен migration script с idempotency.
- **poseo → cms:** Phase 3 — после dba migration → массовый импорт отзывов с Я.Карт (когда оператор подключит) + 2ГИС / Авито через Payload admin или CSV import script
- **poseo → seo-content (Phase 4):** Homepage.tsx switch с embedded reviews на Reviews collection — отдельный PR после Phase 2

## Hand-off log

- 2026-05-06 21:00 · poseo: US-9 spec + dev (autonomous, минимальный scope — collection + route + schema; sustained data-migration для dba follow-up)
