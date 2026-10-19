---
artifact: art-brief-ui
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T4_SD
authors: design + fe
created: 2026-05-09
related:
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T4-sd/art-brief.md (general direction)
  - design-system/brand-guide.html (v2.6)
---

# T4 SD (Service-District) — UI brief

## Mockup count

**1 desktop + 1 mobile = 2 mockup'ов** (sustained intake AC-1 D1).

T4 simpler чем T2/T3 — pattern повторяется, нужен 1 reference desktop + 1 reference mobile. Остальные 150 URL рендерятся теми же блоками с разным контентом.

| # | Viewport | Что показывает | Цель |
|---|----------|-----------------|------|
| M1 | 1440px desktop | Полный SD page: hero (city-photo + landmark + 150+ слов вступление) + breadcrumbs + tldr + pricing + calculator pre-filled + process + mini-case с локальным кейсом + cta-banner + faq + neighbor-districts + lead-form | Pixel-perfect T4 reference, hyperlocal trust visible |
| M2 | 375px mobile | Полный SD: hero compact (photo сверху + H1 + collapsible 150 слов) + sticky bottom-CTA + всё ниже vertical 1-col | Mobile compact flow, hyperlocal без horizontal scroll |

## Token sync (sustained brand-guide v2.6)

Same tokens как T2/T3 (sustained). Никаких новых токенов не требуется.

T4-specific token usage:
- `--space-section` reduced для compact density (T4 = 56-80px desktop vs T2 80-120px)
- `--c-bg-alt` для hero-photo overlay (если photo нуждается в text contrast)

## New tokens

**Не нужны.** C2.5 wave merged 11 extensions покрывает T4.

## Component spec list

### Hero (T4 variant) — `#service-hero` (line 4571, T4 variant)

- **Layout grid:** desktop 12-col, photo full-bleed (col 1-12 background photo) ИЛИ split (col 1-7 текст overlay + col 8-12 photo card). Decision в D2 design review based на photo quality
- **City-вступление 150+ слов:** в lead area, под H1. Desktop visible полностью. Mobile **collapsible** — показ первых 80 слов + «Читать дальше» link, expand reveals оставшиеся 70+ слов
- **Local-trust badge** (optional): pill «Сделали 12 проектов в <City>», eyebrow style + tabular-nums
- **CTA:** 1 primary «Загрузить фото» + 1 secondary `tel:`
- **Hero photo:** aspect-ratio 16:9 desktop (для landmark visibility), 4:3 mobile (для compact). Photo overlay `--c-bg-alt` 40% opacity если text contrast нужен (sustained `color-contrast` 4.5:1)

### Breadcrumbs (4 уровня)

- Same как T3 (sustained `#breadcrumbs`, mobile collapsible с эллипсисом)
- T4: «Главная > Услуги > <Pillar> > <City>»

### Pricing-block с city-note

- Same component sustained (`#pricing-table`)
- **City-note:** caption под таблицей «Цены актуальны для <City> и района» — eyebrow style
- Mobile accordion-cards sustained

### Calculator pre-filled

- Same component sustained (`#calculator-shell`)
- T4: `defaultCity=<city slug>` через URL param ИЛИ prop
- 5 states sustained

### Process (4-7 шагов pillar-specific)

- Same component sustained (`#process-steps`)
- Контент = pillar-specific (можно reuse from pillar T2 — НЕ city-specific generally)

### Mini-case (REQUIRED T4) — `#mini-case` (line 5815)

- **Layout T4:** vertical с city-photo (не horizontal как T2) — фокус на локальный proof
- **City-photo:** 16:9 photo с узнаваемым landmark района
- **Layout:** photo full-width + caption «<Имя> в <City>, <ulitsa>» + metric + link на полный кейс
- **Empty-state** (если real кейса нет): card с empty-state pattern (sustained `#notifications`) + copy «Кейсы в <City> скоро будут — пришлите фото, рассчитаем смету» + CTA scroll к calculator

### CTA-banner (required T4)

- Sustained `#site-chrome:3934+` variant
- Caregiver copy: «Уберём в <City>? Пришлите фото — рассчитаем смету за 10 минут» (city-token interpolation)

### FAQ (city-specific)

- Same component sustained (`#faq-accordion`)
- T4: 6-10 вопросов, **минимум 1-2 city-specific** («работаете ли в <City>?», «приедете на <ulitsa>?», «сколько стоит выезд в <City>?»)

### Neighbor-districts (CRITICAL T4) — `#district-chips` (line 6363)

- **Layout:** 4-6 chips ближайших районов в row desktop, horizontal scroll mobile
- **Chip:** pill с landmark-иконкой (`#icons:1417`) + название района + расстояние «12 км» от текущего T4 city
- **Расстояние:** computed по wsfreq (sustained US-4) ИЛИ static в Districts collection
- **Hover:** subtle shadow lift
- **Touch ≥44pt** на каждый chip
- **Mobile horizontal scroll:** allowed (sustained chip-row pattern)

### Lead-form

- Same as T2/T3 (sustained `#lead-form-full`)

## fal.ai allowance

- **Nano Banana 2** для черновых hero-вариантов в D1 — 6 топ-T4 SD (Раменское × 5 pillar = 5 reference + Жуковский × 5 pillar = 5 reference, итого ~10) для иллюстрации D1 mockup'ов
- **НЕ финальные** 300 photos — это D2 wave с design review batch

## Анти-паттерны

- Generic T2-clone hero без city-photo (liwood baseline C1.b §1.4)
- City placeholder photo (Москва-вид на всех 150 T4)
- City-вступление 150 слов без collapse на mobile (нарушение `progressive-disclosure`)
- Mini-case generic вне района (T4 mini-case — обязательно с city-context)
- Neighbor-districts hidden или ≤2 chips (выглядит broken — должно быть 4-6)

## Hand-off

D1 → D2 (token sync + 300 photos batch). D3 owner: fe.
