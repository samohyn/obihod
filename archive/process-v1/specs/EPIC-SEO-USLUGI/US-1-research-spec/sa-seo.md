---
us: US-1
title: SA-SEO — техспек US-1 (контракты slug-resolver / JSON-LD composer / seed-скриптов / inventory)
team: seo
po: poseo
type: spec
priority: P0
segment: services
phase: spec
role: sa-seo
status: active
blocks: [US-2, US-3, US-4, US-5, US-6, US-7, US-8]
blocked_by: []
related:
  - specs/EPIC-SEO-USLUGI/intake.md
  - specs/EPIC-SEO-USLUGI/US-1-research-spec/ba.md
  - team/adr/ADR-0019-uslugi-routing-resolver.md (deliverable этого US)
  - site/lib/seo/jsonld.ts (sustained — будет расширяться в US-4)
  - site/collections/Services.ts:170 (sustained slug validate — расширим disjoint guard в US-3)
  - site/collections/Districts.ts:33 (sustained slug validate — расширим disjoint guard в US-3)
created: 2026-05-07
updated: 2026-05-07
skills_activated: [seo, search-first, product-capability]
---

# US-1 SA-SEO — техспек

## 1. Контракт slug-resolver (для US-4 imp)

**Файл, который будет переписан в US-4:** `site/app/(marketing)/[service]/[slug]/page.tsx` (sustained файл `[district]/page.tsx` переименуется через `git mv` для семантической чистоты — sustained URL остаются, только параметр Next.js).

### Сигнатура

```typescript
// site/app/(marketing)/[service]/[slug]/page.tsx
export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ service: string; slug: string }>;
}) {
  const { service, slug } = await params;

  // Резолюция в строгом порядке:
  // 1. sub-service (T3)
  const sub = await getSubServiceBySlug(service, slug);
  if (sub) return <SubServiceView service={sub.parent} sub={sub} />;

  // 2. service-district (T4 SD)
  const sd = await getServiceDistrict(service, slug);
  if (sd) return <ServiceDistrictView service={sd.service} district={sd.district} sd={sd} />;

  // 3. 404
  notFound();
}

export async function generateStaticParams() {
  const subParams = await getAllSubServiceParams(); // sustained
  const sdParams = await getAllServiceDistrictParams(); // новый — реализуется в US-4
  return [...subParams, ...sdParams];
}

export async function generateMetadata({ params }) {
  const { service, slug } = await params;
  const sub = await getSubServiceBySlug(service, slug);
  if (sub) return buildSubServiceMetadata(sub);
  const sd = await getServiceDistrict(service, slug);
  if (sd) return buildServiceDistrictMetadata(sd);
  return { title: 'Страница не найдена' };
}
```

### Гарантии правильной работы

- **Disjoint namespace**: namespace-audit US-1 + validate-hooks US-3 + `pnpm lint:slug` prebuild gate — три уровня защиты от collision.
- **Performance**: оба query ходят в кэшируемый Payload (sustained ISR 86400 для sub, 43200 для service-district). Кэш-ключи через `unstable_cache` теги `service-${slug}` + `service-district-${service}-${slug}`.
- **404 на orphan slug** — никаких redirect-cycles, sustained `notFound()` Next.js helper.

### Что нужно для US-4 (контракт)

US-4 имплементирует:
- Новые query functions: `getServiceDistrict(service, slug)`, `getAllServiceDistrictParams()`, `buildServiceDistrictMetadata(sd)`.
- Новый вью: `ServiceDistrictView` (импортирует `T4_SD` template из `site/components/templates/`).
- Sustained: `getSubServiceBySlug` (`site/lib/seo/queries.ts:139`), `SubServiceView` (`site/app/(marketing)/[service]/[district]/SubServiceView.tsx`).

## 2. Контракт JSON-LD composer (для US-4 imp)

**Файл (новый):** `site/lib/seo/composer.ts`

### Сигнатура

```typescript
type TemplateKind = 'T1_HUB' | 'T2_PILLAR' | 'T3_SUB' | 'T4_SD';

export function buildJsonLdForTemplate(
  template: TemplateKind,
  ctx: TemplateContext,
): Schema[];

interface TemplateContext {
  chrome: SiteChrome;            // sustained Organization data
  seo: SeoFields;                // sustained metadata
  pillars?: Service[];           // T1
  service?: Service;             // T2/T3/T4
  sub?: SubService;              // T3
  district?: District;           // T4
  sd?: ServiceDistrict;          // T4
  faqs?: { q: string; a: string }[];
  breadcrumbs?: BreadcrumbItem[];
  author?: Person;               // T4 E-E-A-T
}
```

### Per-template coverage

| Template | Schemas (count) | Sources |
|---|---|---|
| T1 hub | Organization + WebSite + ItemList + BreadcrumbList | sustained `organizationSchema` + `websiteSchema` + НОВЫЙ `t1HubItemListSchema` + sustained `breadcrumbListSchema` |
| T2 pillar | Organization + Service + AggregateRating + FAQPage + BreadcrumbList | sustained `organizationSchema` + НОВЫЙ `serviceWithRatingSchema` + sustained `faqPageSchema` + sustained `breadcrumbListSchema` |
| T3 sub | Organization + Service(sub-scoped) + FAQPage + BreadcrumbList | sustained `organizationSchema` + sustained `serviceSchema` + sustained `faqPageSchema` + sustained `breadcrumbListSchema` |
| T4 SD | Organization + LocalBusiness(district-scoped) + Service(district-scoped) + FAQPage + BreadcrumbList + Person | sustained `organizationSchema` + sustained `localBusinessSchema` + sustained `serviceSchema` + sustained `faqPageSchema` + sustained `breadcrumbListSchema` + sustained `personSchema` |

### 2 новых helpers в `site/lib/seo/jsonld.ts`

1. `serviceWithRatingSchema(service: Service, district?: District, rating?: AggregateRating): Schema` — объединяет sustained `serviceSchema` + inline `aggregateRating` (один JSON-LD блок вместо двух). Reduces page payload ~200 bytes на T2.
2. `t1HubItemListSchema(pillars: Service[]): Schema` — `ItemList` с url + name + priceFrom для каждого pillar; rich-snippet «Услуги в Москве и МО» в Yandex SERP.

## 3. Контракт seed-скриптов (для US-3 imp)

### `site/scripts/seed-cities.ts`

**Cel:** seed Districts +23 city (доводим до 30 total: 7 sustained + 23 new).

**Top-30 cities target list** (определяется в этом US-1 deliverable, фиксируется в `seosite/strategy/03-uslugi-url-inventory.json`):

Top-12 priority (Class-A для US-5):
1. Балашиха (balashikha)
2. Мытищи (mytishchi) — sustained
3. Раменское (ramenskoe) — sustained
4. Одинцово (odincovo) — sustained
5. Красногорск (krasnogorsk) — sustained
6. Подольск (podolsk)
7. Химки (khimki) — sustained
8. Королёв (korolyov)
9. Люберцы (lyubertsy)
10. Электросталь (elektrostal)
11. Реутов (reutov)
12. Долгопрудный (dolgoprudnyj)

Sustained-list 13-30 (Class-B для US-5):
13. Истра (istra) — sustained
14. Пушкино (pushkino) — sustained
15. Жуковский (zhukovskij) — sustained
16. Серпухов (serpukhov)
17. Сергиев-Посад (sergiev-posad)
18. Ногинск (noginsk)
19. Орехово-Зуево (orekhovo-zuevo)
20. Дмитров (dmitrov)
21. Чехов (chekhov)
22. Видное (vidnoe)
23. Домодедово (domodedovo)
24. Воскресенск (voskresensk)
25. Клин (klin)
26. Щёлково (shchelkovo)
27. Лобня (lobnya)
28. Жуковский (jukovskiy) — alias check
29. Котельники (kotelniki)
30. Реутов alias check

(Финальный список с alias-resolution и landmark-данными — в US-1 deliverable `seosite/strategy/03-uslugi-url-inventory.json`.)

**Slug-validation guard:** перед insert каждого city, скрипт делает SQL `SELECT slug FROM services_subservices WHERE slug = $1` — если row найдена, скрипт **fail с exit 1** и предложением альтернативного slug. Это перенесено в `pnpm lint:slug`.

### `site/scripts/seed-sd-bulk.ts`

**Cel:** bulk-seed 150 ServiceDistricts (5 pillar × 30 city). Каждая SD создаётся в `status: draft` + `noindexUntilCase: true` (sustained iron rule из ServiceDistricts.ts:17-30 — published только после mini-case). Контент (hero/FAQ) пустой — заполнится US-5.

### `site/scripts/seed-sd-content.ts` (для US-5)

**Cel:** Class-B SD генерация через Claude API.

**Контракт API call** (использует `claude-api` skill):
- Model: `claude-sonnet-4-6`
- System prompt (cached): brand-voice §13 Caregiver+Ruler из brand-guide v2.2 + anti-thin-content rules + structured output schema
- Per-SD input: `{pillar: Service, city: District, landmarks: string[], localPriceAdjustment: number, neighborDistricts: District[]}`
- Output: `{leadParagraph: string, faqs: {q, a}[3+], localPriceNote: string}` (Zod-validated)
- Prompt cache hit ratio target: ≥80% (через cache_control breakpoints)

## 4. Контракт URL inventory (формат)

`seosite/strategy/03-uslugi-url-inventory.json`:

```json
{
  "version": "1.0",
  "generated": "2026-05-07",
  "totalUrls": 191,
  "breakdown": {
    "T1_HUB": 1,
    "T2_PILLAR": 5,
    "T3_SUB": 35,
    "T4_SD": 150
  },
  "urls": [
    {
      "url": "/uslugi/",
      "pattern": "T1_HUB",
      "pillar": null,
      "subOrCity": null,
      "cluster": "uslugi-hub",
      "sitemapPriority": 0.9,
      "sitemapChangefreq": "weekly",
      "expectedTemplate": "T1_HUB"
    },
    {
      "url": "/vyvoz-musora/",
      "pattern": "T2_PILLAR",
      "pillar": "vyvoz-musora",
      "subOrCity": null,
      "cluster": "vyvoz-musora-pillar",
      "sitemapPriority": 0.9,
      "sitemapChangefreq": "weekly",
      "expectedTemplate": "T2_PILLAR"
    },
    {
      "url": "/vyvoz-musora/balashikha/",
      "pattern": "T4_SD",
      "pillar": "vyvoz-musora",
      "subOrCity": "balashikha",
      "cluster": "vyvoz-musora-balashikha",
      "sitemapPriority": 0.8,
      "sitemapChangefreq": "monthly",
      "expectedTemplate": "T4_SD"
    }
  ]
}
```

## 5. Контракт target-keys CSV (формат)

`seosite/02-keywords/derived/target-keys-191.csv`:

```csv
url,primaryKey,wsfreq,wsk,intent,currentTopvisorPos,cluster
/uslugi/,услуги для дома и дачи москва,8900,72,navigational,,uslugi-hub
/vyvoz-musora/,вывоз мусора москва,12000,89,commercial,,vyvoz-musora-pillar
/vyvoz-musora/balashikha/,вывоз мусора балашиха,1100,42,commercial,,vyvoz-musora-balashikha
```

Минимум 1 primaryKey per URL = ≥191 строк. Source: sustained `seosite/02-keywords/raw/` от EPIC-SEO-COMPETE-3 US-1 (4685 unique keys, 438 commercial). US-1 делает mapping (URL → key), не повторный pull.

## 6. Acceptance Criteria

| # | AC | Verify |
|---|---|---|
| 1 | intake.md создан с 8 US + DoD ✅ | `ls specs/EPIC-SEO-USLUGI/intake.md` |
| 2 | ba.md + sa-seo.md созданы ✅ (этот файл) | `ls specs/EPIC-SEO-USLUGI/US-1-research-spec/{ba,sa-seo}.md` |
| 3 | ADR-0019 создан, status: accepted, signed-off poseo + tamd consult | `cat team/adr/ADR-0019-uslugi-routing-resolver.md \| grep status` |
| 4 | namespace-audit.md создан, **0 collisions ИЛИ план rename** | `cat specs/EPIC-SEO-USLUGI/US-1-research-spec/namespace-audit.md \| grep -E "PASS\|FAIL"` |
| 5 | liwood-services-passport-final.md покрывает 4 шаблона + 5 leverage'ов | `wc -l seosite/01-competitors/liwood-services-passport-final.md` ≥ 200 строк |
| 6 | URL inventory JSON содержит ровно 191 URL | `jq '.urls \| length' seosite/strategy/03-uslugi-url-inventory.json` = 191 |
| 7 | Target keys CSV содержит ≥191 строк (без header) | `tail -n +2 seosite/02-keywords/derived/target-keys-191.csv \| wc -l` ≥ 191 |
| 8 | team/backlog.md содержит секцию EPIC-SEO-USLUGI | `grep "EPIC-SEO-USLUGI" team/backlog.md` |

## 7. Hand-off log

```
2026-05-07 · poseo → ba: dispatch US-1
2026-05-07 · ba → sa-seo: ba.md готов, переход на sa-seo.md
2026-05-07 · sa-seo → poseo: sa-seo.md готов, переход на ADR-0019 + remaining deliverables
```
