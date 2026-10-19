---
artifact: art-brief
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T4_SD
authors: design + ux
created: 2026-05-09
skills_activated: [design-system, ui-ux-pro-max, frontend-design, accessibility]
related:
  - team/adr/ADR-0021-service-page-master-template.md (mapping table § → brand-guide)
  - design-system/brand-guide.html (v2.6, 7459 строк)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (C1.b §1.4 khimki-sd)
  - screen/EPIC-C/liwood-khimki-sd-{1440,375}.png (T4 reference)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T4-sd/art-brief-ui.md (UI spec)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T4-sd/art-brief-ux.md (UX spec)
applies_to:
  - /uslugi/<pillar>/<city>/  (150+ T4 URL — service × district)
url_count: ~150 T4 URL
mockups_required: 1 desktop + 1 mobile
priority: highest URL volume — 78% от всех 191 URL
---

# T4 SD (Service-District) — Art-Brief (general direction)

## Контекст

T4 = «услуга × район» (например `/uslugi/arboristika/himki/`, `/uslugi/vyvoz-musora/ramenskoe/`). **150+ URL — самый большой объём в EPIC**. Это **BOFU-страница**: пользователь уже почти готов (знает услугу + локацию). Задача — за 1-2 scroll показать «работаем у вас, вот landmark, вот цена, вот форма». Long-tail traffic + локальный intent — главные источники конверсии.

C1.b §1.4 показал: liwood T4 (`/himki/`) = generic clone T2 без city-photo, без landmark, без locale-вступления, JSON-LD = 0. **Это наша главная whitespace для long-tail SEO**: каннибализация SERP неизбежна, если каждый T4 одинаковый. Hyperlocal-content = победа.

## Direction

**«Hyperlocal hero с photo + landmark + locale-вступление + быстрый путь к calculator»**.

Композиция = быстрый локальный shortcut:
1. Hero с city-specific photo (узнаваемый landmark) + city-вступление 150+ слов
2. Pricing + calculator pre-filled (пользователь готов)
3. Process + mini-case с локальным кейсом + FAQ короткий
4. Neighbor-districts (соседи) → Lead-form

T4 — самый compact из трёх. Меньше скролла, больше hyperlocal-trust. T4 user не нуждается в обучении услуге — нуждается в подтверждении «работаем тут».

**Anti-direction:** generic T2-clone с замененным city-name (liwood baseline C1.b §1.4). Каждый T4 имеет уникальный city-photo + city-вступление + neighbor-districts + (опционально) локальный кейс.

## Layout density

**Compact** (плотнее T2/T3, но без потери whitespace). Vertical rhythm 56-80px desktop, 32-48px mobile. T4 короче — пользователь BOFU и хочет до lead-form быстрее.

## Photography style

Sustained brand-guide §photography (документальный репортажный) + city-context.

Для T4 нужны:
- **Hero photo** (1 шт. на T4 URL) — реальная сцена работы С УЗНАВАЕМЫМ городским landmark на фоне. Например: для `/arboristika/himki/` — арборист пилит дерево с видом на ЖК «Городские Резиденции» Химок; для `/vyvoz-musora/ramenskoe/` — самосвал на улице Раменского с видом на железнодорожную станцию; для `/chistka-krysh/zhukovskii/` — рабочий на крыше дома в Жуковском с авиамодельным силуэтом неба. **Landmark recognition — главное**.
- **Mini-case** (1 шт. на T4, required для T4) — локальный кейс «Сделали у Иванова в Химках за 4 часа» с before/after photo на фоне района. Required для T4 (sustained ADR-0021 matrix).

Photo budget на T4: **1 hero + 1 case = 2 photos per T4** × 150 T4 = **300 photos через fal.ai в D2 wave**. Это самая крупная photo-генерация EPIC-D.

**Прагматика:** часть T4 в одном районе могут reuse hero (например 5 услуг × Химки = 1 hero photo Химок reuse с разным cropping ИЛИ 5 уникальных photos). Design review решает в D2 на основе budget fal.ai. Default — каждый T4 unique.

## Section order (sustained ADR-0021 fixed order)

| # | Section | Required | §brand-guide reference | Notes T4 |
|---|---------|----------|------------------------|----------|
| 01 | hero | required | `#service-hero` (line 4571) | T4 variant: H1 «<Услуга> в <Городе>» + city-specific photo (landmark) + city-вступление 150+ слов в lead area |
| 02 | breadcrumbs | required | `#breadcrumbs` (line 6128) | «Главная > Услуги > <Pillar> > <City>» (4 уровня). Mobile collapsible |
| 03 | tldr | required | `#tldr-block` (line 6256) | 3-5 пунктов «что делаем в этом районе / срок / цена от» |
| 04 | services-grid | **hidden** (T4) | n/a | Одна услуга — sub-grid не нужен |
| 05 | pricing-block | required | `#pricing-table` (line 5129) | Pricing с note «цены актуальны для <City>» |
| 06 | calculator | required | `#calculator-shell` (line 4757) | Pre-filled с `defaultCity=<city slug>` параметром |
| 07 | process | required | `#process-steps` (line 5278) | 4-7 шагов pillar-specific (можно reuse from pillar) |
| 08 | mini-case | **required** (T4) | `#mini-case` (line 5815) | Локальный кейс с city-photo. Required — locale-trust сигнал. Если кейса нет — empty-state «Скоро будет» |
| 09 | faq | required | `#faq-accordion` (line 5952) | 6-10 вопросов, минимум 1-2 city-specific («работаете в <city>?», «приедете в <ulitsa>?») |
| 10 | cta-banner | required | `#site-chrome:3934+` variant | Inline между process и mini-case. Caregiver copy «Уберём в <City>? Пришлите фото — смета за 10 минут» |
| 11 | related-services | **optional** (T4) | n/a | Skipped (T4 uses neighbor-districts вместо). Sustained ADR-0021 matrix |
| 12 | neighbor-districts | required (T4) | `#district-chips` (line 6363) | 4-6 ближайших районов с landmark-icon + расстояние «12 км». КРИТИЧЕСКАЯ секция T4 |
| 13 | lead-form | required | `#lead-form-full` (line 4922) | phone + name + photo + 152-ФЗ + 5-state submit flow |

**Total visible на T4:** 9 секций. Compact-фокус. Bypass services-grid + related-services — T4 user не разглядывает alternatives, он BOFU.

## Mobile-first contract

Sustained ADR-0021 §mobile-first контракт.

T4-специфичные guards:
- **Hero mobile**: city-photo сверху full-width (aspect-ratio 4:3), H1 + city-вступление collapsible на mobile (показ первых 80 слов + «Читать дальше»)
- **City-вступление 150+ слов** на desktop visible полностью; mobile — accordion-collapsed по умолчанию (sustained `progressive-disclosure`)
- **Sticky bottom-CTA bar 56px** sustained
- **Sticky-header** ≤56px sustained
- **Neighbor-districts** на mobile horizontal scroll (sustained chip-row pattern, не контент)
- **Touch ≥44pt** sustained
- **Reduced-motion** sustained
- **Local-trust badge** в hero (если применимо): «Сделали 12 проектов в <City>» — числовой trust-сигнал

## Photo budget

| Тип | Шт. на T4 | Шт. на 150 T4 | Source |
|-----|-----------|---------------|--------|
| Hero photo (city + landmark) | 1 | 150 (или ~50-100 с reuse per district) | fal.ai Nano Banana Pro |
| Case before/after (local) | 1 (required) | 150 (или ~30-50 если reuse + variations) | fal.ai Nano Banana Pro |
| District photos (для neighbor-chips) | 0 (используется icon из `#icons:1417`) | 0 | n/a |
| **Итого** | **2** | **~300 photos** (worst case) | D2 wave — самая крупная photo-генерация EPIC-D |

D2 wave priority: 6 топ-T4 (Раменское × 5 pillar + Жуковский × 5 pillar = 10 SD, sustained memory `project_first_districts.md`) — генерируем UNIQUE per SD. Остальные 140 T4 — design в D2 решает batch reuse strategy.

## Brand-guide-first iron rule (sustained)

Каждая секция выше имеет ✅ §brand-guide reference. Sustained ADR-0021 §iron rule.

T4-specific guard: **никаких generic city placeholders**. Если photo / city-вступление / mini-case generic для всех T4 → qa block. Каждый T4 hyperlocal-unique.

## Hand-off

D1 closure → D2 (token sync + AI assets). D2 owner: design + fe.

D5 A/B pilot НЕ на T4 (sustained intake AC-D5: pilot на T2 `/vyvoz-musora/`). T4 валятся в D6 roll-out волнами 30 URL/нед × 8 нед.
