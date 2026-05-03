---
title: JSON-LD coverage audit + AI-readiness recommendations
owner: sa-seo
co-owners: [cms, seo-tech]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-3.3]
related:
  - "./sge-readiness.md"
  - "./llms-txt-spec.md"
  - "../06-eeat/eeat-hub-spec.md"
---

# JSON-LD coverage audit для AI-readiness

> Final audit JSON-LD на 211 published URL после Stage 2 W11 closure (lint:schema 0 errors / 31 warns закрыты Wave 0.3) и Stage 3 W13 closure (sustained 100% coverage). Цель — codified completeness baseline + recommendations для re-seed Stage 4 (HowTo / Review / VideoObject). Sustained iron rule: **schema MUST соответствовать реально присутствующему контенту** (sustained `seo` skill anti-patterns §4).

## 1. Sustained baseline — existing schemas (Stage 1+2+3)

### 1.1 · Coverage по типу URL

| URL type | Кол-во URL | Existing schemas | Coverage |
|---|---:|---|---:|
| pillar (`/{vyvoz-musora,arboristika,chistka-krysh,demontazh}/`) | 4 | Service + WebPage + BreadcrumbList + FAQPage + LocalBusiness | 100% |
| sub (~36 sub-pages) | 36 | Service + WebPage + BreadcrumbList + FAQPage | 100% |
| ServiceDistrict (~150) | 150 | Service + LocalBusiness + BreadcrumbList + FAQPage (incl. localFaq ≥2) | 100% |
| blog (31) | 31 | Article + BreadcrumbList + Person (author) + Organization (publisher) + FAQPage (info-posts only) | Article 100% / FAQPage 50% |
| cases (14) | 14 | Service + ImageObject (before/after) + Organization + BreadcrumbList | 100% |
| static — `/komanda/` | 1 | AboutPage + Person × N (5-7 авторов) + Organization | 100% |
| static — `/sro-licenzii/` | 1 | AboutPage + Organization (с лицензиями) | 100% |
| static — `/avtory/` | 1 | CollectionPage + Person × N | 100% |
| static — `/b2b/` + `/b2b/uk-tszh/` + `/b2b/dogovor/` | 3 | Service + Organization + BreadcrumbList + FAQPage | 100% |
| static — `/foto-smeta/` (USP) | 1 | Service + WebPage + HowTo (sustained Stage 1 — 1/211 имеет HowTo) | 100% |
| homepage `/` | 1 | Organization + WebSite + LocalBusiness + BreadcrumbList | 100% |

**Total:** 211 URL, 100% coverage хотя бы 1 JSON-LD блока.

### 1.2 · Lint:schema baseline (sustained Stage 2 W11 + Stage 3 W13)

- **0 errors** (sustained Wave 0.3 closure).
- **0 warns** (sustained — закрыты Stage 2 final audit).
- Schema validators: Google Rich Results Test + schema.org validator + Я.ВебМастер «Структурированные данные».

## 2. Audit — что хорошо, что gap

### 2.1 · Хорошо (sustained)

- **Service** на 100% pillar/sub/SD — корректный `@type Service` + `provider Organization`.
- **FAQPage** на 100% pillar/sub/SD + 50% blog — sustainable pattern Stage 1+2 (см. `./sge-readiness.md`).
- **LocalBusiness** на 4 pillar + 150 SD — правильный `address` + `areaServed` + `geo` (sustained Stage 2).
- **Person + Organization sameAs** sustained на blog + komanda — cross-domain author signal (см. `../06-eeat/eeat-hub-spec.md`).
- **BreadcrumbList** на 100% URL (sustained Stage 1).
- **ImageObject** на 100% cases (before/after photos с `width` + `height` + `caption`).

### 2.2 · Gap — что нет (sustained, но **рекомендации Stage 4**)

| Schema | Текущее coverage | Recommended target | Reason |
|---|---|---|---|
| `HowTo` | 1/211 (только `/foto-smeta/`) | +5-7 (2-3 cases + 2-3 blog) | AI-citation pattern для пошаговых инструкций |
| `Review` / `AggregateRating` | 0/14 cases | +14 cases (если operator подтверждает rating data) | Trust signal + SGE preferred |
| `VideoObject` | 0/211 | +N (post-EPIC, если оператор добавит видео) | Video-citation в AI Overviews |
| `Product` / `Offer` | 0/211 | n/a | Service business, not e-commerce (shop отдельно в `apps/shop`) |

## 3. Schema completeness score per URL type

| URL type | Required schemas | Coverage | Score |
|---|---|---:|---|
| pillar | Service + WebPage + BreadcrumbList + FAQPage + LocalBusiness | 5/5 | A+ |
| sub | Service + WebPage + BreadcrumbList + FAQPage | 4/4 | A+ |
| SD | Service + LocalBusiness + BreadcrumbList + FAQPage(localFaq ≥2) | 4/4 | A+ |
| blog (info) | Article + BreadcrumbList + Person + Organization + FAQPage | 5/5 | A+ |
| blog (commercial-bridge) | Article + BreadcrumbList + Person + Organization | 4/4 | A |
| cases | Service + ImageObject + Organization + BreadcrumbList | 4/4 | A (recommendation +Review +HowTo → A+) |
| static komanda / avtory | AboutPage + Person × N + Organization | 3/3 | A+ |
| static sro-licenzii | AboutPage + Organization | 2/2 | A+ |
| static foto-smeta | Service + WebPage + HowTo | 3/3 | A+ |
| static b2b / dogovor | Service + Organization + FAQPage + BreadcrumbList | 4/4 | A+ |
| homepage | Organization + WebSite + LocalBusiness + BreadcrumbList | 4/4 | A+ |

**Average: A+ / A** sustained — sustainable baseline для post-EPIC.

## 4. Recommendations — re-seed Stage 4 (post-EPIC)

### 4.1 · HowTo schema на 5-7 URL

Add HowTo JSON-LD на pages с явными step-by-step инструкциями. Sustained iron rule: **schema MUST match real content** — добавляем HowTo только где есть реальные `<ol>` шаги.

| # | URL | Тип контента | HowTo step count |
|---|---|---|---:|
| 1 | `/blog/<kak-zakazat-vyvoz-musora>` | «Как заказать вывоз мусора в 5 шагов» | 5 |
| 2 | `/blog/<kak-podgotovit-derevo-k-spilu>` | «Как подготовить участок к спилу» | 4 |
| 3 | `/blog/<kak-zaklyuchit-dogovor-uk>` | «Как заключить договор с УК» | 6 |
| 4 | `/kejsy/<case-13-cross-pillar>` | «Этапы комплексной уборки СНТ» | 5 |
| 5 | `/kejsy/<case-14-cross-pillar>` | «Этапы B2B комплексного подряда» | 6 |
| 6 (optional) | `/foto-smeta/` | sustained (1/211) — refresh с HowTo updated step descriptions | 4 |
| 7 (optional) | `/b2b/dogovor/` | «Как заключить договор: 4 шага» | 4 |

**HowTo schema example (cms re-seed):**

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Как заказать вывоз мусора в Обиход за 5 шагов",
  "totalTime": "PT10M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Сделать 2-3 фото объёма мусора",
      "text": "Сфотографируйте мусор с разных ракурсов, чтобы было видно объём и тип отходов."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Отправить фото в Telegram или WhatsApp",
      "text": "Отправьте фото на @obikhod_bot или WhatsApp +7-XXX-XXX-XX-XX с указанием адреса."
    }
  ]
}
```

### 4.2 · Review / AggregateRating на cases (TBD — оператор decision)

**Conditional recommendation:** добавить `AggregateRating` на 14 cases только если оператор подтверждает реальные ratings (sustained iron rule «schema MUST match real content»).

```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "47"
}
```

**Pending operator:** наличие реальных reviews (Я.Карты / 2GIS / Google Reviews). **TODO poseo:** escalation operator post-EPIC.

### 4.3 · VideoObject (post-EPIC, если video добавлен)

**Conditional recommendation:** добавить `VideoObject` на cases / pillars если оператор закажет video-shoots (post-EPIC).

```json
{
  "@type": "VideoObject",
  "name": "Демонтаж сарая: до и после",
  "description": "Кейс #5 — демонтаж сарая 4×6 м в СНТ Раменское",
  "thumbnailUrl": "https://obikhod.ru/cases/05/thumb.jpg",
  "uploadDate": "2026-05-15",
  "duration": "PT2M30S"
}
```

## 5. AI-readiness check (cross-engine)

| AI engine | Required schemas | Our coverage | Status |
|---|---|---|---|
| Google SGE / AI Overviews | FAQPage + Article + HowTo + LocalBusiness + Service | 100% (FAQPage / Article / Service / LocalBusiness) — gap HowTo | Partial — recommendation §4.1 |
| OpenAI SearchGPT | Article + FAQPage + HowTo + Organization | 100% (Article / FAQPage / Organization) — gap HowTo | Partial — recommendation §4.1 |
| Anthropic claude.ai webfetch | Article + Person + Organization + sameAs | 100% sustained | OK |
| Я.AI / Я.Поиск | Service + LocalBusiness + FAQPage + Person.author | 100% sustained | OK |
| Perplexity | FAQPage + Article + Person | 100% (FAQPage 50% blog — partial) | Partial — recommendation `./sge-readiness.md` §3.1 |

**Sustained iron rule:** Anthropic / OpenAI / Google имеют **разные требования** → используем **superset** (все 4 типа: Service / FAQPage / LocalBusiness / HowTo) → maximum compatibility.

## 6. Verification checklist (post-Stage 4 re-seed)

- [ ] `lint:schema` 0 errors после HowTo re-seed.
- [ ] Google Rich Results Test PASS на 5-7 HowTo URL.
- [ ] Я.ВебМастер «Структурированные данные» 0 errors после deploy.
- [ ] Все HowTo шаги имеют `position` + `name` + `text` (минимум).
- [ ] `totalTime` валиден ISO 8601 duration (e.g. `PT10M`).

## 7. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-3.3.a | jsonld-completeness audit written | sa-seo | Hard |
| AC-3.3.b | 5-7 HowTo schema specs documented (§4.1) | sa-seo | Hard |
| AC-3.3.c | cms re-seed HowTo на 5-7 URL (Stage 4 / W14 day 5 optional) | cms | Soft |
| AC-3.3.d | Review / AggregateRating defer pending operator | poseo escalation | Soft |
| AC-3.3.e | VideoObject defer post-EPIC | n/a | Soft |

**Hand-off:**
- sa-seo → cms (W14 day 5): HowTo schema specs + URL shortlist.
- cms → seo-tech (W14 day 5): re-seed JSON fixtures + lint:schema verify.
- seo-tech → qa-site (W14 day 6): Google Rich Results Test + Я.ВебМастер verify.
