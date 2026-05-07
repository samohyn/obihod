---
us: US-3
title: Технический SEO + нейро-SEO каркас
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy)
type: tech-seo + nuro-seo
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo)
status: in_progress
blocks:
  - US-4 (mega-pricing нужен aggregateOffer schema)
  - US-5 (blog нужен Speakable + Citation summaries)
  - US-6 (B2B нужен LegalService + HowTo schema)
  - US-7 (programmatic SD нужен правило #13 H1 differentiation)
  - US-8 (lead-infra нужен ContactPoint schema)
  - US-9 (otzyvy нужен Review + AggregateRating schema)
blocked_by: []
related:
  - team/adr/ADR-0018-url-map-compete-3.md (правило #13 H1 differentiation)
  - seosite/strategy/02-url-map.json (5 pillars × 35 subs URL inventory)
created: 2026-05-06
updated: 2026-05-06
---

# US-3 — Технический SEO + нейро-SEO каркас

## Цель

Подготовить `lib/seo/` + новые routes + Payload hooks к URL-карте US-2. Один раз — для всех downstream US (US-4..US-9). Особый focus на **нейро-SEO** (LLM-friendly markup) — для AI-citation метрики #7 EPIC DoD.

## Скоуп

### IN

1. **`lib/seo/jsonld.ts` extend:** новые schema-helpers
   - `howToSchema(steps, name, totalTime?)` — для info-страниц (B2B, blog)
   - `speakableSchema(cssSelectors)` — отдельный helper для AI-ботов
   - `aggregateOfferSchema(offers, lowPrice, highPrice, priceCurrency)` — для `/uslugi/tseny/<pillar>/`
   - `reviewSchema(rating, body, author, datePublished)` — для `/otzyvy/`
   - `aggregateRatingSchema(ratingValue, reviewCount, bestRating)` — для `/otzyvy/`
   - `legalServiceSchema(serviceType, areaServed)` — для `/b2b/<doc>/`

2. **`lib/seo/citation.ts`** (новый, ≤80 строк) — citation-ready TL;DR builder
   - `buildCitationSummary({ question, answer, sources, slug })` → JSX-friendly object {html, speakable}
   - Используется на info-страницах в первом экране (`<aside data-llm-citation>`)
   - Speakable cssSelector — `[data-llm-citation] [itemprop="answer"]`

3. **`app/llms-full.txt/route.ts`** (новый, ≤180 строк) — full markdown по llmstxt.org full-context spec
   - Полная иерархия pillars + sub-pages с full intro
   - Все B2B-страницы с metaDescription
   - Top-10 cases с before/after photo refs
   - Recent 10 blog posts с TL;DR
   - USP block (foto-smeta + raschet-stoimosti)
   - E-E-A-T block (СРО + страховка + 5 авторов)
   - Cache 24h, dynamic = force-dynamic, Content-Type: text/markdown

4. **`app/llms.txt/route.ts`** extend (≤+30 строк):
   - Add `## Pricing` section — live `/uslugi/tseny/<pillar>/` URLs
   - Add `## Cases by service` — group cases by service slug
   - Add `## Local coverage` — Москва + МО список из Districts

5. **`app/sitemap.ts`** — REC #7 tamd review:
   - Add `'uborka-territorii': 0.85` в `PILLAR_PRIORITY` map
   - Bump `/blog/`, `/b2b/`, `/avtory/` priority в соответствии с ADR-0018 baseline (если ниже)

6. **`app/robots.ts`** — финальный аудит AI-bots (already comprehensive, minor verify)

7. **IndexNow afterChange verify** — для всех публикуемых коллекций:
   - Services / ServiceDistricts / Cases / Blog / B2BPages / Authors
   - Каждая на `afterChange` → POST `/api/revalidate?tag=<slug>&url=<url>` с x-revalidate-secret
   - Cross-pillar revalidate при изменении (`/`, `/sitemap.xml`, `/<pillar>/`)

### OUT

- Реальный контент в Payload (Services / B2BPages / Blog / Authors / Reviews) — US-4..US-11
- Reviews collection — US-9
- Yandex.Webmaster sitemap submit — US-10 (monitoring track)
- Topvisor проект setup — US-10
- E-E-A-T контент-валидация — US-11

## Артефакты US-3

| Файл | Тип | Описание |
|---|---|---|
| `site/lib/seo/jsonld.ts` | extend | +6 schema helpers |
| `site/lib/seo/citation.ts` | new | TL;DR aside builder |
| `site/app/llms-full.txt/route.ts` | new | Full content map для AI-ботов |
| `site/app/llms.txt/route.ts` | extend | Pricing + Cases + Local sections |
| `site/app/sitemap.ts` | extend | uborka-territorii priority |
| `site/app/robots.ts` | verify | финальный аудит |
| `site/app/api/revalidate/route.ts` | sustained | (no change, sustained работает) |

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | 6 new jsonld helpers exported + tested type-check | 🔵 |
| AC-2 | citation.ts builds valid HTML aside + Speakable schema | 🔵 |
| AC-3 | `/llms-full.txt` returns ≥3 KB markdown с pillars/B2B/cases/blog/USP/E-E-A-T | 🔵 |
| AC-4 | `/llms.txt` extended Pricing + Cases + Local sections | 🔵 |
| AC-5 | sitemap.ts включает `/uborka-territorii/` priority 0.85 | 🔵 |
| AC-6 | type-check + lint + format PASS локально | 🔵 |
| AC-7 | Local smoke `/llms.txt` и `/llms-full.txt` на dev возвращают валидный markdown | 🔵 |

## Hand-offs

| От | Кому | Когда | Что |
|---|---|---|---|
| poseo | seo-tech (proxy через poseo autonomous) | 2026-05-06 | Имплементация |
| poseo | leadqa | post-merge | Local verify production smoke |
| poseo | sa-seo (US-4..US-9) | post-merge | jsonld helpers + citation.ts ready для downstream specs |

## Definition of done

- [ ] 6 new jsonld helpers + citation.ts + 1 new route + 2 extended routes
- [ ] type-check + lint + format PASS
- [ ] CI зелёный на PR
- [ ] operator merge

## Hand-off log

- 2026-05-06 17:30 · poseo: US-3 spec + dev (single-author per autonomous mandate)
