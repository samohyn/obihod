---
us: US-4
title: Mega-pricing хаб /uslugi/tseny/ + 5 deep-pages per pillar
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy)
type: tech-seo + content + new-routes
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo)
status: in_progress
blocks:
  - US-7 (programmatic SD расширение нужно понимать pricing matrix)
blocked_by: []
related:
  - US-3 lib/seo/jsonld.ts (aggregateOfferSchema sustained ready)
  - ADR-0018 (правило #13 H1 pricing-intent vs pillar lead-intent)
  - seosite/strategy/02-url-map.json (mega_pricing_hub block)
created: 2026-05-06
updated: 2026-05-06
---

# US-4 — Mega-pricing хаб /uslugi/tseny/

## Цель

Создать единую pricing-страницу — зеркальный ответ на arboristik.ru `/tsenyi/` (33% их трафика, 455 it50). H1 pricing-intent отделён от pillar lead-intent (правило #13 ADR-0018) — снимает каннибализацию.

## Скоуп

### IN

1. **Root `/uslugi/tseny/page.tsx`** — overview-таблица всех 5 pillars с диапазонами цен «от-до», ссылками на pillar deep-pages
2. **Deep `/uslugi/tseny/[pillar]/page.tsx`** — детальная матрица одного pillar: 4-7 sub-services с ценами, units, lead-form
3. **JSON-LD:** `AggregateOffer` (root + per-pillar) + `BreadcrumbList`
4. **Sitemap.ts** — добавить 6 routes (root + 5 pillars) с priority 0.8
5. **Cross-link:** добавить footer link на `/uslugi/tseny/` (через SiteChrome) — отдельный followup, не блокер

### OUT

- Реальный контент `priceFrom`/`priceTo` для 17 new sub-services — sustained baselines в ADR-0018, финал per cw spread review (US-7 follow-up)
- Sub-pillar deep pages `/uslugi/tseny/<pillar>/<sub>/` — out of scope (excessive granularity без ROI proof)
- Calculator integration — US-8 `/kalkulyator/foto-smeta/`
- Reviews block на pricing-странице — US-9
- Lead-form A/B testing — US-8

## Implementation

### Route 1: `/uslugi/tseny/page.tsx`

**Шаблон:** stats-таблица с 5 строками pillars, для каждой:
- title + h1 «Цены: <pillar>»
- price range «от 700 до 35 000 ₽»
- count услуг внутри pillar
- top-3 sub-services с короткими ценами
- кнопка «Подробнее →» к `/uslugi/tseny/<slug>/`

H1: «Цены на услуги Обихода в Москве и МО — единый прайс 2026»

JSON-LD: AggregateOffer (combined всех pillar с lowPrice / highPrice) + BreadcrumbList.

Lead-form внизу страницы (UTM: `source=tseny&medium=root`).

### Route 2: `/uslugi/tseny/[pillar]/page.tsx`

**Шаблон:** детальная матрица одного pillar:
- H1: «Цены: <pillar>» (pricing-intent per ADR-0018 правило #13)
- Intro 2-3 предложения о ценообразовании
- Таблица: sub-name | от | до | unit | lead CTA
- FAQ из Service.faqGlobal
- Lead-form (UTM: `source=tseny&medium=<pillar>`)

JSON-LD: AggregateOffer (per pillar) + BreadcrumbList + LocalBusiness ref.

### Files

| Path | Type | Lines |
|---|---|---:|
| `site/app/(marketing)/uslugi/tseny/page.tsx` | new | ~150 |
| `site/app/(marketing)/uslugi/tseny/[pillar]/page.tsx` | new | ~180 |
| `site/lib/seo/queries.ts` | extend | +30 (getAllPillarsForPricing) |
| `site/app/sitemap.ts` | extend | +20 (tseny entries) |
| `site/lib/seo/metadata.ts` | extend | +20 (buildPricingMetadata) |

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | `/uslugi/tseny/` рендерится на dev (БД нужна — fallback noContent OK) | 🔵 |
| AC-2 | `/uslugi/tseny/<pillar>/` для всех 5 sustained pillars + uborka-territorii | 🔵 |
| AC-3 | AggregateOffer + BreadcrumbList в JSON-LD каждой страницы | 🔵 |
| AC-4 | sitemap.ts содержит 6 tseny entries с priority 0.8 | 🔵 |
| AC-5 | type-check + lint + format PASS | 🔵 |
| AC-6 | UTM `source=tseny` в lead-form | 🔵 |
| AC-7 | H1 pricing-intent (правило #13 ADR-0018) | 🔵 |

## Out for sustained → US-4 follow-up

- Контент-тюнинг (cw spread review, реальные priceFrom/To)
- Connecting к BlockRenderer (если cw захочет редактируемые блоки внутри pricing)
- Calculator widget integration (US-8)

## Hand-off log

- 2026-05-06 19:00 · poseo: US-4 spec + dev (single-author, autonomous)
