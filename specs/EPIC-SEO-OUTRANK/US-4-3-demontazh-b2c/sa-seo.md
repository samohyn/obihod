---
us: US-4.3
title: Демонтаж B2C — расширение pillar 2 → 8 sub-services
epic: EPIC-SEO-OUTRANK
team: seo
po: poseo
sa: sa-seo
type: programmatic + content
priority: P0 (biggest gap — 4% covered, 55% commercial pool)
segment: services
phase: spec
role: sa-seo
status: ready-for-dev
blocks: []
blocked_by: []
related:
  - seosite/strategy/per-direction/demontazh-b2c.md
  - seosite/03-clusters/demontazh.md
  - seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv
created: 2026-05-04
updated: 2026-05-04
skills_activated: [seo, product-capability, search-first]
---

# US-4.3 · sa-seo: Демонтаж B2C — pillar расширение

## Контекст

Demontazh-b2c — **biggest gap** в Wave 3 audit. Только 4.0% covered (40/1004 ключей у конкурентов), при 55% commercial intent в pool — **highest ROI per hour effort**. У нас pillar `/demontazh/` имеет всего 2 sub, у конкурентов (demontazhmsk / snosim / snos24 / demonti) 6-12 sub каждый.

ВЧ «демонтаж» 3 587 wsk — у 3 конкурентов, у нас head-keyword не оптимизирован под full-match.

## Скоп

### Включено

1. **Pillar расширение** `/demontazh/` — H1 + Title + первый абзац под ВЧ-захват
2. **6 новых sub-services** под B2C-частный сектор:
   - `/demontazh/snos-doma/`
   - `/demontazh/snos-dachi/`
   - `/demontazh/snos-bani/`
   - `/demontazh/demontazh-zabora/`
   - `/demontazh/demontazh-fundamenta/`
   - `/demontazh/snos-garazha/`
3. **2 blog-bridges:**
   - `/blog/skolko-stoit-snos-doma/` (target wsk 40)
   - `/blog/snosit-li-mozhno-svoy-dom-bez-razresheniya/` (legal info)
4. **Cross-link** с `b2b.md` cluster для B2B-spillover (через секцию «промышленный демонтаж» в pillar)

### Не включено

- Промышленный демонтаж (заводы / цеха) — передан в `b2b.md` cluster, отдельная задача
- Programmatic material × object (как demontazhmsk.ru) — auto-gen risk; делаем 6 sub manually
- Демонтаж кирпичной дымовой трубы (B-tier) — Wave 4 long-tail

## URL архитектура

### ADR-uМ-N (новый)

**Status:** approved (sustained ADR-uМ-01 max 3 levels)

URL pattern: `/demontazh/<sub-service>/`. Не углубляемся в `/demontazh/<sub>/<material>/` (4-уровень) — это auto-gen path конкурентов, нам не подходит.

| URL | Slug rule | Cluster |
|---|---|---|
| `/demontazh/` | pillar | demontazh-b2c (header) |
| `/demontazh/snos-doma/` | sub | snos-doma |
| `/demontazh/snos-dachi/` | sub | snos-dachi |
| `/demontazh/snos-bani/` | sub | snos-bani |
| `/demontazh/demontazh-zabora/` | sub | demontazh-zabora |
| `/demontazh/demontazh-fundamenta/` | sub | demontazh-fundamenta |
| `/demontazh/snos-garazha/` | sub | snos-garazha |

**SD pattern (Wave 4 backlog):** `/demontazh/<sub>/<district>/` для priority-A districts (Раменское / Жуковский) — НЕ в этой US (отложено до Wave 4 чтобы не дублировать musor.moscow auto-gen risk).

## Семантическое ядро (per sub)

### Pillar `/demontazh/`

**Target ключи (head):**
- ВЧ: «демонтаж» (3 587 wsk, у 3 d)
- СЧ: «демонтаж цена» 28, «демонтаж цены» 10, «снос дома сколько стоит» 40
- НЧ: «снос частного дома цена» 15, «стоимость сноса дома» 11

**H1:** «Демонтаж в Москве и МО под ключ — снос дома, дачи, бани и хозпостроек»
**Title (≤60 chars):** «Демонтаж под ключ в Москве и МО — Обиход»
**Meta description (≤160):** «Демонтаж домов, дач, бань, заборов и хозпостроек в Москве и МО. Фото→смета за 10 минут. Договор, гарантия, вывоз отходов в подарок.»
**H2-блоки:** Что демонтируем · Цены · Этапы работ · Документы · FAQ
**Schema:** `Service` + `BreadcrumbList` + `FAQPage` + `Organization` + `LocalBusiness`

### `/demontazh/snos-doma/`

**Target ключи:**
- СЧ: «снос домов» 136 (у 3 d)
- НЧ: «снос дома сколько стоит» 40 (у 4 d), «сколько стоит демонтаж дома» 47, «снос частного дома цена» 15, «снести дом сколько стоит» 148, «разборка дома» 13

**Words target:** 1 800-2 200
**H1:** «Снос дома в Москве и МО под ключ»
**Schema:** `Service` + `Offer` (диапазон цен) + `BreadcrumbList` + `FAQPage`
**Cross-link:** `/demontazh/demontazh-fundamenta/` (после сноса дома часто фундамент тоже)

### `/demontazh/snos-dachi/`

**Target ключи:**
- НЧ: «снос дачи цена», «демонтаж дачного дома», «разборка дачного дома» (multi-tail из B-tier)
- USP-территориальный: «Раменское», «Жуковский», «Подмосковье»

**Words:** 1 500-1 800
**Cross-link:** `/raiony/ramenskoe/`, `/raiony/zhukovskij/`

### `/demontazh/snos-bani/`

**Target ключи:**
- НЧ: «демонтаж бани сколько стоит» 14, «снос бани»

**Words:** 1 200-1 500
**Note:** относительно низкий wsk — short content, фокус на конверсию (USP «фото→смета 10 минут»)

### `/demontazh/demontazh-zabora/`

**Target ключи:**
- НЧ: «демонтаж забора», «снос забора», «убрать старый забор», «разборка забора»

**Words:** 1 200-1 500

### `/demontazh/demontazh-fundamenta/`

**Target ключи:**
- НЧ: «демонтаж фундамента» 51 (у 3 d), «демонтаж фундамента цена» 20 (у 3 d), «сколько стоит демонтаж фундамента» 15

**Words:** 1 500-1 800
**Schema-extra:** `HowTo` (этапы — частая SERP-feature под этот ключ)

### `/demontazh/snos-garazha/`

**Target ключи:**
- НЧ: «снос гаража», «демонтаж гаража», «снести гараж»

**Words:** 1 200-1 500

### Blog-bridge `/blog/skolko-stoit-snos-doma/`

**Target ключи:**
- НЧ: «снос дома сколько стоит» 40, «сколько стоит снести дом» 108
- Cross-link CTA: `/demontazh/snos-doma/`

**Words:** 2 000-2 500 (информационный с конверсионным CTA в конце)

### Blog-bridge `/blog/snosit-li-mozhno-svoy-dom-bez-razresheniya/`

**Target ключи:**
- НЧ: «можно ли снести свой дом без разрешения», «нужно ли разрешение на снос дома», «уведомление о сносе»
- Legal-content E-E-A-T (cross-link с `/dokumenty/` если будем делать)

**Words:** 2 000-2 500

## Schema требования (для всех 6 sub + pillar)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "<URL>#service",
      "name": "<Название услуги>",
      "provider": { "@id": "https://obikhod.ru/#organization" },
      "areaServed": ["Москва", "Московская область"],
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "RUB",
        "lowPrice": "<min>",
        "highPrice": "<max>"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://obikhod.ru/" },
        { "@type": "ListItem", "position": 2, "name": "Демонтаж", "item": "https://obikhod.ru/demontazh/" },
        { "@type": "ListItem", "position": 3, "name": "<sub-name>", "item": "<URL>" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [/* min 5 FAQ items per sub */]
    }
  ]
}
```

`pnpm lint:schema --sample 7` (6 sub + pillar) → 0 errors / 0 warns обязательно.

## TOV (design-system §13 Caregiver+Ruler)

- **Caregiver:** «Берём на себя все хлопоты», «Договор + гарантия 3 года», «Вывоз отходов в подарок»
- **Ruler:** «Под ключ», «Документально оформим», «СРО-допуск»
- **Не использовать:** «опытные мастера», «низкие цены», «качественно и быстро» (clich  Тильда-эстетики, anti-pattern §14)

## Acceptance criteria

| AC | Critirion |
|---|---|
| **AC-1** | 6 новых sub published в Payload (CMS) + opublikovany на /demontazh/ навигации |
| **AC-2** | Pillar `/demontazh/` H1+Title+description обновлены под full-match ВЧ «демонтаж» |
| **AC-3** | 2 blog-bridge published в `/blog/` |
| **AC-4** | `pnpm lint:schema --sample 9` → 0 errors / 0 warns |
| **AC-5** | Cross-link sections: pillar→6 sub + sub→pillar + sub↔related sub (snos-doma↔demontazh-fundamenta) |
| **AC-6** | Schema: каждый sub имеет Service + Offer + BreadcrumbList + FAQPage (5+ FAQ items each) |
| **AC-7** | Photo→quote lead-form embed на pillar + 6 sub (sustained 100% USP) |
| **AC-8** | Wave 3 covered % с 4.0% → ≥25% (~250 ключей в нашем pool после расширения) |
| **AC-9** | leadqa real-browser smoke по 7 URL (pillar + 6 sub) — все рендерятся, lead-form работает, schema validated в Я.ВебМастер preview |

## Hand-off plan

```
sa-seo (этот файл) ──→ poseo approve
   ↓
poseo → seo-content + cw: 6 sub-services + 2 blog content drafting (по этому sa)
   ↓
seo-content → cms (через poseo): published в Payload
   ↓
cms → seo-tech: schema validate
   ↓
seo-tech → qa-site: real-browser smoke check
   ↓
qa-site → cr-site: code review (если новые компоненты)
   ↓
cr-site → release: RC-N gate
   ↓
release → leadqa: verify локально → operator approve → do deploy
```

## Estimation

| Step | Effort | Owner |
|---|---|---|
| Content drafting 6 sub × 1 500 слов | 12h | cw + seo-content |
| Content drafting 2 blog × 2 000 слов | 6h | cw |
| Schema-coding (Payload schema fields) | 2h | seo-tech |
| Pillar update (H1/Title/desc/H2-блоки) | 2h | seo-content + cw |
| Cross-link sections | 1h | seo-content |
| Publish в CMS | 2h | cms |
| QA + leadqa | 4h | qa-site + leadqa |
| **Σ** | **~29h (≈ 1.5 weeks team-time)** | distributed |

## Out of scope (Wave 4 backlog)

- Programmatic SD `/demontazh/<sub>/<district>/` — отложено
- Sub `/demontazh/dymovaya-truba/` — wsk 12 (НЧ low) — Wave 4
- Promyshlenny демонтаж spillover — `b2b.md` отдельная US
- Реальные 14+ кейсов с фото — нужны от operator для AC-усиления
