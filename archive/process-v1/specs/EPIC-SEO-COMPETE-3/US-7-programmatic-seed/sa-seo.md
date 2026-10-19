---
us: US-7
title: Pillar uborka-territorii + 4 sub seed (новый pillar в Payload)
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy)
type: tech-seo + content + db-seed
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo)
status: in_progress
blocks:
  - US-4 deep `/uslugi/tseny/uborka-territorii/` (без pillar в БД → 404 ошибка)
  - US-5 info-articles c cross-link на uborka-territorii sub-pages
blocked_by: []
related:
  - team/adr/ADR-0018-url-map-compete-3.md (5-й pillar uborka-territorii approved)
  - seosite/strategy/02-url-map.json (4 new subs spec)
  - site/scripts/seed.ts (sustained ServiceSeed pattern)
created: 2026-05-06
updated: 2026-05-06
---

# US-7 — Pillar uborka-territorii + 4 sub seed

## Цель

Закрыть критический gap: новый pillar `/uborka-territorii/` (operator approved 2026-05-06) ещё нет в Payload — `/uslugi/tseny/uborka-territorii/` даёт 404 в US-4. Расширить `site/scripts/seed.ts` с 5-м pillar + 4 sub-services для unblock.

## Скоуп

### IN

1. **`site/scripts/seed.ts` extend:**
   - `ServiceSeed` type — добавить `'uborka-territorii'` в slug union
   - `SERVICES` array — добавить 5-й pillar entry с метаданными, 3 FAQ, 4 sub
2. **PriceUnit:** добавить `'sotka'` в union (для покос травы / выравнивание участка)
3. **4 new subs под `/uborka-territorii/`** (slug + title + h1 + priceFrom):
   - `vyravnivanie-uchastka` — Выравнивание участка (от 250 ₽/сотка) — cluster C43+C6+C9 wsk=745
   - `raschistka-uchastka` — Расчистка участка от деревьев и кустарников (от 800 ₽/сотка) — cluster C15 wsk=168
   - `pokos-travy` — Покос травы (от 80 ₽/сотка) — cluster C12 wsk=913
   - `vyvoz-porubochnyh-ostatkov` — Вывоз порубочных остатков (от 1 800 ₽/м³) — cluster C45_part

### OUT (sustained для US-7 follow-up)

- 17 new sub-pages под sustained 4 pillars (vyvoz-musora: 4 new, arboristika: 4 new, demontazh: 4 new, chistka-krysh: 4 new, plus 1) — sustained для cw spread review в Payload admin
- 150-250 ServiceDistricts bulk-seed (programmatic) — sustained для US-7 follow-up через `scripts/generate-sd-batch.ts`
- Контент-углубление intro / faqGlobal / leadTemplate — sustained для cw

## Implementation

### Edit: `site/scripts/seed.ts`

Добавить в массив SERVICES (5-й элемент после demontazh):

```typescript
{
  slug: 'uborka-territorii',
  title: 'Уборка территории',
  h1: 'Уборка территории',
  metaTitle: 'Уборка территории в Москве и МО — Обиход',
  metaDescription: 'Покос травы, выравнивание участка, расчистка от деревьев и кустарников, вывоз порубочных остатков. Смета по фото за 10 минут, фикс-цена за сотку.',
  intro: '...',  // ~280 символов
  priceFrom: 80,
  priceTo: 8000,
  priceUnit: 'sotka',
  faqGlobal: [...],  // 3 FAQ
  subServices: [...],  // 4 sub
  leadTemplate: (prep) => '...',
}
```

### Files

| Path | Type | Lines |
|---|---|---:|
| `site/scripts/seed.ts` | extend | +85 (1 new SERVICES entry) |
| Type extension `'uborka-territorii'` + `'sotka'` priceUnit | extend | +2 |

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | ServiceSeed type включает 'uborka-territorii' | 🔵 |
| AC-2 | priceUnit type включает 'sotka' | 🔵 |
| AC-3 | SERVICES array содержит 5-й pillar entry | 🔵 |
| AC-4 | 4 sub-services присутствуют (vyravnivanie / raschistka / pokos / vyvoz-porubochnyh) | 🔵 |
| AC-5 | type-check + lint + format PASS | 🔵 |
| AC-6 | После `pnpm seed` локально — `/uborka-territorii/` рендерится в dev | 🔵 leadqa post-merge |
| AC-7 | `/uslugi/tseny/uborka-territorii/` показывает 4 sub в pricing-table | 🔵 leadqa post-merge |

## Hand-offs

- **poseo → leadqa:** post-merge `pnpm seed` локально + smoke /uborka-territorii/ + /uslugi/tseny/uborka-territorii/
- **poseo → cms (Payload admin):** intro / faqGlobal / leadTemplate финал-тюнинг для production deploy
- **poseo → cw:** sustained backlog для 17 new sub под sustained 4 pillars (cw spread review)
- **poseo → seo-content (US-7 follow-up):** bulk-seed скрипт для 150-250 ServiceDistricts через `scripts/generate-sd-batch.ts` после прохождения leadqa

## Hand-off log

- 2026-05-06 19:50 · poseo: US-7 spec + dev (минимальный scope для unblock US-4 deep страницы)
