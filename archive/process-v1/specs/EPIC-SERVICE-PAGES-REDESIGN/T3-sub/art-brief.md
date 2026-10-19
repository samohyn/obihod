---
artifact: art-brief
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T3_SUB
authors: design + ux
created: 2026-05-09
skills_activated: [design-system, ui-ux-pro-max, frontend-design, accessibility]
related:
  - team/adr/ADR-0021-service-page-master-template.md (mapping table § → brand-guide)
  - design-system/brand-guide.html (v2.6, 7459 строк, 11 extensions merged)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (C1.b §1.3 spil-sub)
  - screen/EPIC-C/liwood-spil-sub-{1440,375}.png (T3 reference)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T3-sub/art-brief-ui.md (UI spec)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T3-sub/art-brief-ux.md (UX spec)
applies_to:
  - /uslugi/<pillar>/<sub>/  (35 sub-сервисов: spil, korchevanie, izmelchenie, ...)
url_count: ~35 T3 URL
mockups_required: 2 desktop + 2 mobile
---

# T3 Sub-services — Art-Brief (general direction)

## Контекст

T3 = «способы / методы / типы внутри pillar» (например `/uslugi/arboristika/spil-derev/`, `/uslugi/vyvoz-musora/krupnogabaritny/`). Это **MOFU-страница для пользователя, который уже выбрал pillar и уточняет метод**. Задача — за один scroll показать чем этот метод отличается от других, дать тех. деталь (parameter × price), переключить в калькулятор. T3 проще T2 (нет sub-grid внутри), но требует district-aware variant если применимо.

C1.b §1.3 показал: liwood T3 (например `/spil-derev/`) =  near-clone T2 с замененными словами «удаление» → «спил». Каннибализация SERP. Мы делаем T3 с **уникальным углом метода** — это конкурентное преимущество.

## Direction

**«Метод-фокус: один specific approach + parameter pricing + calculator с pre-filled tier»**.

Композиция = method-detail focus:
1. Hero с district-pill (если применимо) — H1 «<Метод> в Москве и МО»
2. TL;DR + Pricing — тех. specifics метода
3. Calculator pre-filled на этот sub
4. Process + mini-case (optional T3) + FAQ — proof
5. Neighbor-districts (T3 district-aware) → Lead-form

T3 УЖЕ scopes-down — пользователь знает что ищет. Не повторяем pillar-introduction. Сразу specifics.

**Anti-direction:** T2-clone с замененными словами (liwood baseline). Каждый T3 имеет уникальные «способы» / «методы» / «типы» которые отличают его от sibling-T3.

## Layout density

**Standard** (между T2 spacious и T4 compact). Vertical rhythm 64-96px desktop, 40-56px mobile. T3 короче T2 (нет services-grid, optional mini-case), но не compact как T4.

## Photography style

Sustained brand-guide §photography (документальный репортажный).

Для T3 нужны:
- **Hero photo** (1 шт. на T3 URL) — реальная сцена СПЕЦИФИЧЕСКОГО метода. Например: для `/spil-derev/` — арборист пилит ствол на канатах (а не «дерево вообще»); для `/krupnogabaritny/` — погрузчик грузит холодильник в самосвал (не «мусор вообще»). Detail-фокус метода — главное.
- **Mini-case before/after** (1 шт. на T3, optional) — если кейс есть, photo. Если нет — empty-state из `#notifications` («Кейсы скоро будут»).

Photo budget на T3: **1 hero + 0-1 case = 1-2 photos per T3** × 35 T3 ≈ 35-70 photos через fal.ai в D2 wave.

## Section order (sustained ADR-0021 fixed order)

| # | Section | Required | §brand-guide reference | Notes T3 |
|---|---------|----------|------------------------|----------|
| 01 | hero | required | `#service-hero` (line 4571) | T3 variant: H1 «<Метод> в <pillar>» + district-pill (если применимо: «Москва и МО») + 1 primary CTA + photo сверху mobile |
| 02 | breadcrumbs | required | `#breadcrumbs` (line 6128) | «Главная > Услуги > <Pillar> > <Sub>» (4 уровня) |
| 03 | tldr | required | `#tldr-block` (line 6256) | 3-5 пунктов «что специфично для метода». Speakable |
| 04 | services-grid | **hidden** (T3) | n/a | Внутри одной услуги — sub-grid не нужен |
| 05 | pricing-block | required | `#pricing-table` (line 5129) | Parameter-based (диаметр / вес / м³) × цена. T3 specifics — точная сетка |
| 06 | calculator | required | `#calculator-shell` (line 4757) | Calculator с pre-filled `tier=<sub>` параметром |
| 07 | process | required | `#process-steps` (line 5278) | 4-7 шагов СПЕЦИФИЧЕСКИХ для метода (не generic pillar steps) |
| 08 | mini-case | **optional** (T3) | `#mini-case` (line 5815) | Если есть — компактный horizontal. Если нет — секция скипается. Кейс из T2 reused через related |
| 09 | faq | required | `#faq-accordion` (line 5952) | 6-10 вопросов специфичных для метода |
| 10 | cta-banner | **optional** (T3) | `#site-chrome:3934+` variant | Может скипаться (короткий URL T3). Если включён — между process и faq |
| 11 | related-services | required | `#components` Карточка услуги reuse | Sibling-subs внутри pillar (другие методы того же pillar). 4-6 cards |
| 12 | neighbor-districts | required (T3) | `#district-chips` (line 6363) | District-aware. 4-6 chips с landmark-icon + название + расстояние |
| 13 | lead-form | required | `#lead-form-full` (line 4922) | phone + name + photo + 152-ФЗ + 5-state submit flow |

**Total visible на T3:** 9-11 секций (без services-grid, optional mini-case + cta-banner). Compact vs T2 без потери конверсии.

## Mobile-first contract

Sustained ADR-0021 §mobile-first контракт + brand-guide §responsive (375 / 414 / 768 / 1024).

T3-специфичные guards:
- **Hero mobile**: photo сверху (нагляднее метода) + H1 + lead + 1 CTA. Photo aspect-ratio 4:3 на mobile, full-width
- **District-pill** в hero — mobile horizontal scroll allowed для chip-row (но НЕ horizontal scroll контента — sustained guard)
- **Pricing parameter-based** на ≤640px → accordion-cards с диаметром/весом в `<summary>`
- **Sticky bottom-CTA bar 56px** sustained
- **Sticky-header** ≤56px sustained
- **Touch ≥44pt** sustained
- **Reduced-motion** sustained

## Photo budget

| Тип | Шт. на T3 | Шт. на 35 T3 | Source |
|-----|-----------|--------------|--------|
| Hero photo | 1 | 35 | fal.ai Nano Banana Pro |
| Case before/after (optional) | 0-1 | ~20 (примерно 60% T3 имеют кейсы) | fal.ai Nano Banana Pro |
| District photos | 0 (используются sustained district-icons из `#icons:1417`) | 0 | n/a |
| **Итого** | **1-2** | **~55 photos** | D2 wave |

Часть hero может reuse'иться между T3 одного pillar если визуально похожи (например, 3 типа «спил» — один photo с зумом на ствол). Design review решает.

## Brand-guide-first iron rule (sustained)

Каждая секция выше имеет ✅ §brand-guide reference. Sustained ADR-0021 §iron rule — qa block PR при отсутствии reference.

T3-specific guard: **никаких T2-clones**. Каждый T3 = unique angle of method (proof в content review до D3 fe wave).

## Hand-off

D1 closure → D2 (token sync + AI assets). D2 owner: design + fe.
