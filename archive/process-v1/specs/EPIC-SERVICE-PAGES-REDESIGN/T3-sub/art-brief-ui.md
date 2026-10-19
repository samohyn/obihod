---
artifact: art-brief-ui
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T3_SUB
authors: design + fe
created: 2026-05-09
related:
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T3-sub/art-brief.md (general direction)
  - design-system/brand-guide.html (v2.6)
---

# T3 Sub-services — UI brief

## Mockup count

**2 desktop + 2 mobile = 4 mockup'ов** (sustained intake AC-1 D1).

| # | Viewport | Что показывает | Цель |
|---|----------|-----------------|------|
| M1 | 1440px desktop | Hero (district-pill) + breadcrumbs (4 уровня) + tldr + pricing parameter-based above fold | Method-specific entry |
| M2 | 1440px desktop | Calculator pre-filled + process specifics + faq + neighbor-districts + lead-form | Mid-funnel + closure |
| M3 | 375px mobile | Hero with photo сверху + breadcrumbs + tldr + pricing accordion (vertical 1-col) + sticky bottom-CTA visible | Mobile entry, photo-first для метода |
| M4 | 375px mobile | Calculator full-width + process vertical + faq + neighbor-districts horizontal-scroll-chips + lead-form 1-col | Mobile flow до конца |

## Token sync (sustained brand-guide v2.6)

Same tokens как T2 (sustained). Никаких новых токенов не требуется.

## New tokens

**Не нужны.** C2.5 wave merged 11 extensions. T3 покрыт (sustained `#district-chips`, `#service-hero` T3 variant).

## Component spec list

### Hero (T3 variant) — `#service-hero` (line 4571, T3 variant)

- **Layout grid:** desktop 12-col (col 1-7 текст + USP, col 8-12 photo). Mobile **photo сверху** (aspect-ratio 4:3 full-width) + текст ниже
- **District-pill row** (если applicable): chips горизонтальный row выше H1, eyebrow «Работаем в:» + 3-6 районов. Mobile — horizontal scroll allowed для chip-row (но не контента)
- **CTA:** 1 primary «Загрузить фото» + 1 secondary `tel:`
- **Focus state:** primary CTA — 2px accent ring outset, district-pill — 2px accent ring on focus

### Breadcrumbs (4 уровня)

- **Pattern:** sustained `#breadcrumbs` (line 6128)
- **Mobile:** collapsible если ≥4 уровня (T3) — sustained ADR-0021 §medium#9. На mobile показываем «Главная > ... > <Sub>» с эллипсисом «...»

### Pricing-block (parameter-based)

- **Layout desktop:** table parameter × value × price. Например: «Диаметр (см) × Стандартный спил × Аварийный»
- **Numbers:** `tabular-nums` sustained
- **Mobile (≤640px):** collapse в accordion-cards с диаметром / параметром в `<summary>`, цены в `<details>`
- **Tooltip:** info-icon рядом с параметром, click-toggle на mobile

### Calculator pre-filled — `#calculator-shell` (line 4757)

- Same component как T2, но рендерится с `defaultTier=<T3 sub slug>` через URL param ИЛИ прямое prop
- Drag-drop area + 5 states (sustained)

### Process (specific steps for method)

- Same component как T2 (sustained `#process-steps`)
- Контент = method-specific (не generic pillar steps) — owner cw в D3
- Horizontal desktop / vertical mobile

### Mini-case (optional)

- Same component как T2 (sustained `#mini-case`)
- Если нет данных в Payload — секция скипается (validator allows optional)
- Empty-state НЕ показывается — section просто hidden

### FAQ (method-specific)

- Same component sustained (`#faq-accordion`)
- 6-10 method-specific вопросов

### Neighbor-districts — `#district-chips` (line 6363)

- **Layout:** 4-6 chips в row desktop, horizontal scroll mobile
- **Chip:** pill с landmark-иконкой (`#icons:1417`, sustained 9 шт + расширяется по wsfreq US-4) + название + расстояние «12 км»
- **Border-radius:** `--radius-sm` (8px pill)
- **Hover:** subtle shadow lift
- **Mobile:** horizontal scroll allowed (это chip-row, не контент)
- **Touch ≥44pt** на каждый chip

### Lead-form

- Same as T2 (sustained `#lead-form-full`)

## fal.ai allowance

- **Nano Banana 2** для черновых hero-вариантов 35 T3 (3-5 итераций per sub) в D1
- НЕ финальные mockups (D2 token sync)

## Анти-паттерны

- T2-clone hero без method-specifics (liwood baseline C1.b §1.3)
- Generic pillar process steps (must be method-specific)
- District-pill scroll который ломает viewport контент
- Pricing-table desktop без mobile-accordion fallback

## Hand-off

D1 → D2 (token sync). D3 owner: fe.
