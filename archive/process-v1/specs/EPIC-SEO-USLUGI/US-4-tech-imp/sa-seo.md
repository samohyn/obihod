---
us: US-4
title: SA-SEO US-4 — Tech (slug-resolver + 4 page-template + JSON-LD composer + 2 helpers)
team: seo + product (podev)
po: poseo
type: code
priority: P0
phase: dev
role: sa-seo
status: active
blocks: [US-5, US-6, US-7, US-8]
blocked_by: [US-2, US-3]
related:
  - team/adr/ADR-0019-uslugi-routing-resolver.md
  - specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md
  - specs/EPIC-SEO-USLUGI/US-2-newui-templates/sa-seo.md
  - newui/uslugi-hub.html (T1 source)
  - newui/uslugi-pillar.html (T2 source)
  - newui/uslugi-sub.html (T3 source)
  - newui/uslugi-service-district.html (T4 source)
  - site/lib/seo/jsonld.ts (sustained)
  - site/lib/seo/queries.ts (sustained)
  - site/app/(marketing)/[service]/page.tsx (sustained T2 — будет redesign)
  - site/app/(marketing)/[service]/[district]/page.tsx (sustained legacy misnomer — git mv → [slug])
created: 2026-05-08
---

# US-4 SA-SEO — Tech imp

## Цель

Превратить визуальный язык newui/ макетов и DB-структуру US-3 в живые URL `/uslugi/`, `/<pillar>/`, `/<pillar>/<sub>/`, `/<pillar>/<city>/` через slug-resolver Next.js.

## Deliverables (порядок имплементации)

### 1. Routing structure rename

```bash
git mv site/app/(marketing)/[service]/[district]/ site/app/(marketing)/[service]/[slug]/
```

Sustained `[district]` legacy misnomer (рендерил sub-services). Переименование в `[slug]` отражает реальную семантику. URL не меняются.

### 2. T1 hub `/uslugi/`

- **Файл:** `site/app/(marketing)/uslugi/page.tsx` (новый)
- **Source HTML:** `newui/uslugi-hub.html`
- **Контракт:**
  - `getAllPillarsForUslugiHub()` — extension `getAllPillarsForPricing()` (sustained `queries.ts:N`) → `{slug, title, h1, priceFrom, intro, subServices: [{slug, title, priceFrom}]}[]`
  - JSON-LD: `buildJsonLdForTemplate('T1_HUB', {pillars, chrome, seo})` через composer
  - Metadata: title «Услуги — Обиход», canonical `/uslugi/`, OG, twitter:card

### 3. T2 pillar `/<pillar>/`

- **Файл:** sustained `site/app/(marketing)/[service]/page.tsx` — redesign
- **Source HTML:** `newui/uslugi-pillar.html`
- Сохранить sustained block-driven path (sustained `service.blocks[]` рендерит BlockRenderer) как **fallback**
- **Новый default path** — рендерим T2 template из newui (если sustained `service.blocks` пустой или legacy)
- **Дополнительно:** city-list block — 30 ссылок на T4 SD URL

### 4. T3 sub `/<pillar>/<sub>/`

- **Файл:** sustained `[slug]/SubServiceView.tsx` — redesign под `newui/uslugi-sub.html`
- Methods block (5 cards) — T3 differentiator

### 5. T4 SD `/<pillar>/<city>/`

- **Файл:** новый `site/app/(marketing)/[service]/[slug]/ServiceDistrictView.tsx`
- **Source HTML:** `newui/uslugi-service-district.html`
- **Token replace:** `{{service}} → service.slug, {{Service}} → service.title, {{district}} → district.slug, {{District}} → district.nameNominative, {{Districtprep}} → district.namePrepositional, {{authorName}} → service.reviewedBy.fullName, {{lastReviewedAt}} → sd.lastReviewedAt, {{microDistrictsList}} → district.landmarks, {{localPriceFrom}} → service.priceFrom × (1 + district.localPriceAdjustment/100), {{localResponseTime}} → "2 часа", {{cityPriceNote}} → service-district scoped pricing note`

### 6. Slug-resolver

**Файл:** `site/app/(marketing)/[service]/[slug]/page.tsx` (rewrite)

```typescript
export default async function ServiceSlugPage({ params }: { params: Promise<{ service: string; slug: string }> }) {
  const { service, slug } = await params;

  // 1. Try sub-service (T3)
  const sub = await getSubServiceBySlug(service, slug);
  if (sub) return <SubServiceView service={sub.parent} sub={sub} />;

  // 2. Try service-district (T4)
  const sd = await getServiceDistrict(service, slug);
  if (sd) return <ServiceDistrictView service={sd.service} district={sd.district} sd={sd} />;

  // 3. 404
  notFound();
}

export async function generateStaticParams() {
  const subParams = await getAllSubServiceParams(); // sustained
  const sdParams = await getAllServiceDistrictParams(); // new
  return [...subParams, ...sdParams];
}

export async function generateMetadata({ params }) {
  const { service, slug } = await params;
  const sub = await getSubServiceBySlug(service, slug);
  if (sub) return buildSubServiceMetadata(sub); // sustained
  const sd = await getServiceDistrict(service, slug);
  if (sd) return buildServiceDistrictMetadata(sd);
  return { title: 'Не найдено' };
}
```

### 7. Queries расширение `site/lib/seo/queries.ts`

Новые экспорты:
- `getServiceDistrict(serviceSlug: string, citySlug: string): Promise<{service, district, sd} | null>`
- `getAllServiceDistrictParams(): Promise<{service: string, slug: string}[]>` — для generateStaticParams
- `buildServiceDistrictMetadata(sd): Metadata` — title/description/canonical/OG из service+district

Использовать sustained `unstable_cache` patterns (ISR 43200 для SD, 86400 для sub, 3600 для hub).

### 8. JSON-LD composer

**Файл:** `site/lib/seo/composer.ts` (новый)

```typescript
export type TemplateKind = 'T1_HUB' | 'T2_PILLAR' | 'T3_SUB' | 'T4_SD';

export function buildJsonLdForTemplate(template: TemplateKind, ctx: TemplateContext): Schema[] { ... }
```

Per-template:
- T1_HUB → [organizationSchema, websiteSchema, t1HubItemListSchema(pillars), breadcrumbListSchema]
- T2_PILLAR → [organizationSchema, serviceWithRatingSchema(service, undefined, rating), faqPageSchema(faqs), breadcrumbListSchema]
- T3_SUB → [organizationSchema, serviceSchema(sub-scoped), faqPageSchema(sub.faqs), breadcrumbListSchema]
- T4_SD → [organizationSchema, localBusinessSchema(district), serviceSchema(district-scoped), faqPageSchema(localFaq), breadcrumbListSchema, personSchema(author)]

### 9. Новые helpers в `site/lib/seo/jsonld.ts`

- `serviceWithRatingSchema(service, district?, rating?): Schema` — Service + inline AggregateRating
- `t1HubItemListSchema(pillars: ServiceLite[]): Schema` — ItemList с url+name+priceFrom

## Acceptance Criteria

| # | AC | Verify |
|---|---|---|
| 1 | `app/(marketing)/uslugi/page.tsx` существует, рендерит T1 hub | `pnpm dev` + curl /uslugi/ → HTTP 200 + 5 pillar grid HTML |
| 2 | `[service]/[slug]/page.tsx` — slug-resolver T3 → T4 → 404 | curl /vyvoz-musora/vyvoz-stroymusora/ → T3, /vyvoz-musora/balashikha/ → T4, /vyvoz-musora/qwerty999/ → 404 |
| 3 | T2 pillar redesign под brand-guide | curl /vyvoz-musora/ → 18 секций + 30 city-ссылок visible |
| 4 | T3 sub redesign | curl /vyvoz-musora/vyvoz-stroymusora/ → 5 methods + 4 FAQ |
| 5 | T4 SD render | curl /vyvoz-musora/balashikha/ → hero ≥150 слов с city + 25 микрорайонов + 8 FAQ + Author |
| 6 | JSON-LD coverage 100%: T1=4, T2=5, T3=4, T4=6 | parse `<script type=application/ld+json>` per URL |
| 7 | `pnpm type-check` exit 0 | sustained CI gate |
| 8 | `pnpm format:check` exit 0 | sustained |
| 9 | sustained sub-pages работают (35 sub × all viewable) | regression: sustained 22 sub-services + their URLs HTTP 200 |
| 10 | All 150 SD URLs работают (5 pillar × 30 cities) | sample 5 random SDs HTTP 200 |
| 11 | `pnpm lint:slug` exit 0 (sustained verification) | running sustained gate |

## Out-of-scope

- Реальный контент per SD — это US-5 (placeholder OK, lorem-style; US-5 заполнит)
- Lighthouse CI gate — это US-6
- Production deploy — это US-7

## Risks

| # | Risk | Mitigation |
|---|---|---|
| 1 | Slug-resolver double-query overhead на каждый request | sustained `unstable_cache` ISR (43200/86400 sec) — после warmup ~95% hit rate |
| 2 | Token-replace для T4 — длинный switch | JSDoc + helper function `interpolateT4Tokens(html, ctx)` для testability |
| 3 | T1 hub `/uslugi/` конфликтует с sustained `/uslugi/tseny/` | Next.js routing: `/uslugi/page.tsx` + `/uslugi/tseny/page.tsx` — родственные, не конфликтуют |
| 4 | newui/ HTML → React JSX conversion может потерять структуру | Сохранить inline `<style>` блоки как есть; React semantic элементы 1-в-1 |

## Hand-off log

```
2026-05-08 · poseo: dispatch US-4 (largest code-release эпика)
2026-05-08 · sa-seo: sa-seo.md US-4 готов
```
