---
artifact: art-brief
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T2_PILLAR
authors: design + ux
created: 2026-05-09
skills_activated: [design-system, ui-ux-pro-max, frontend-design, accessibility]
related:
  - team/adr/ADR-0021-service-page-master-template.md (mapping table § → brand-guide)
  - design-system/brand-guide.html (v2.6, 7459 строк, 11 extensions merged)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (C1.b бенчмарк)
  - screen/EPIC-C/liwood-udalenie-pillar-{1440,375}.png (T2 reference)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief-ui.md (UI spec)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief-ux.md (UX spec)
applies_to:
  - /uslugi/vyvoz-musora/
  - /uslugi/arboristika/
  - /uslugi/chistka-krysh/
  - /uslugi/demontazh/
  - /uslugi/uborka-territorii/ (после ADR-0016 Phase 1)
  - /uslugi/landshaft/ (sustained ADR-0020, 5-й pillar)
url_count: 5-6 pillar URL
mockups_required: 3 desktop + 3 mobile
---

# T2 Pillar — Art-Brief (general direction)

## Контекст

T2 = «общая страница услуги» (например `/uslugi/vyvoz-musora/`). Это **MOFU-страница**: пользователь уже знает что нужно («вывоз мусора»), но ещё выбирает подрядчика. Задача — за один scroll показать пирамиду доверия (СРО / страховка / своя техника), перевести в калькулятор «фото→смета» и закрыть в lead-form. T2 = главный конверсионный mid-funnel, на vyvoz-musora пилотим A/B.

## Direction

**«Чёткая пирамида трастовых сигналов с photo→quote калькулятором в центре scroll'а»**.

Композиция = пирамида:
1. Hero (top, 100% viewport-фокус) — H1 + USP «фото за 10 минут» + photo-upload entry в hero
2. TL;DR + Pricing block — комфорт «сколько стоит» сразу после fold
3. Calculator (центр scroll) — главный конверсионный механизм
4. Process + mini-case + FAQ — proof и снятие возражений
5. Lead-form (final CTA) — закрытие

Эмоциональная кривая (sustained ADR-0021 §customer journey): Awareness → Понимание → Решение → Действие.

**Anti-direction (что НЕ делаем):** liwood-style 17-блочный dump с плоской иерархией (C1.b §1.2). Никаких 4 hero-CTA (только 1 primary photo-upload + 1 secondary phone). Никаких эко-зелёных листочков (`#dont`).

## Layout density

**Spacious** (премиум Caregiver+Ruler). Vertical rhythm 80-120px между секциями desktop, 48-64px mobile. White-space — главный визуальный приём (sustained brand-guide §spacing scale `--space-section`). Liwood спрессован «всё в кучу» — мы наоборот.

## Photography style

Sustained `design-system/brand-guide.html` §photography (документальный репортажный, естественный свет, без рукопожатий / щитов / медалей — `#dont`).

Для T2 pillar нужны:
- **Hero photo** (1 шт. на pillar URL) — реальная сцена работы пилларной услуги. Например: для `/vyvoz-musora/` — самосвал на стройплощадке с операторами в спецовке Обихода; для `/arboristika/` — арборист в страховке на дереве; для `/chistka-krysh/` — рабочий со снеговой лопатой на крыше с предохранением; для `/demontazh/` — экскаватор сносит сарай. Стиль: 35mm, естественный свет, без постановочной улыбки в камеру. **Не** stock photos.
- **Mini-case before/after** (2 шт. на pillar) — реальные «до/после» на фоне без логотипов конкурентов.

Photo budget на T2: **1 hero + 2 case + 0 district photos = 3 photos per pillar** × 6 pillar = 18 photos через fal.ai Nano Banana Pro в D2 wave.

## Section order (sustained ADR-0021 fixed order)

| # | Section | Required | §brand-guide reference | Notes |
|---|---------|----------|------------------------|-------|
| 01 | hero | required | `#service-hero` (line 4571) | T2 variant: H1 «Услуга в Москве и МО» + lead 2-3 строки + 1 primary CTA «Загрузить фото» + 1 secondary `tel:` + photo-upload entry visible above fold |
| 02 | breadcrumbs | required | `#breadcrumbs` (line 6128) | «Главная > Услуги > <Pillar>» + BreadcrumbList JSON-LD (sustained composer.ts) |
| 03 | tldr | required | `#tldr-block` (line 6256) | 3-5 пунктов «что входит / срок / цена от» в card с border-left 4px primary, eyebrow «Кратко». Speakable (sustained US-3) |
| 04 | services-grid | **required** (T2 only) | `#components` Карточка услуги (line 1299, sustained) | 3 col desktop / 2 col tablet / 1 col mobile, 4-11 sub-карточек pillar, gap 16px |
| 05 | pricing-block | required | `#pricing-table` (line 5129) | 3-col tier (Базовый / Стандарт / Под ключ), highlighted middle, tabular-nums. Mobile → accordion-cards |
| 06 | calculator | required | `#calculator-shell` (line 4757) | Drag-drop area + 5 states (idle/drag-over/uploading/processing/result). Photo→смета USP — главный конверсионный механизм |
| 07 | process | required | `#process-steps` (line 5278) | 4-7 пронумерованных шагов horizontal desktop / vertical mobile (номер 32px слева) |
| 08 | mini-case | required | `#mini-case` (line 5815) | 1 кейс horizontal: icon + before/after photo + 1 metric + link на `/kejsy/<slug>/` |
| 09 | faq | required | `#faq-accordion` (line 5952) | 6-10 вопросов в `<details>` accordion. FAQPage JSON-LD sustained |
| 10 | cta-banner | required | `#site-chrome:3934+` variant + `#components` extension | Inline между process и mini-case. Caregiver copy «Готовы убрать? Пришлите фото — рассчитаем смету за 10 минут» |
| 11 | related-services | required | `#components` Карточка услуги reuse | 4-6 sibling-pillar карточек («Похожие услуги»). T2 pull other pillars |
| 12 | neighbor-districts | **hidden** (T2) | n/a | T2 = district-агностичен (вся МО) — секция исключена |
| 13 | lead-form | required | `#lead-form-full` (line 4922) | phone + name + photo upload (multi) + 152-ФЗ + 5-state submit flow |

**Total visible на T2:** 12 секций (без neighbor-districts). Liwood показывает 17 — мы compact 12 с чёткой кривой.

## Mobile-first contract

Sustained ADR-0021 §mobile-first контракт + brand-guide §responsive (375 / 414 / 768 / 1024).

Обязательные guards для T2:
- **Sticky bottom-CTA bar 56px** на mobile при `scroll > 200px` — primary «Photo→смета» + secondary `tel:`. z-index 100. Sustained `#sticky-bottom-cta` extension в brand-guide v2.6
- **Hero compact mobile**: 1 H1 + 2-3 строки lead + 1 primary CTA + photo-upload entry. **0 двойных телефонов в hero** (liwood baseline проблема — C1.b §1.2)
- **Pricing-table** на ≤640px → accordion-cards с диаметром / параметром в заголовке
- **Process-steps** vertical с номером 32px слева
- **Calculator** photo-upload занимает full-width на mobile, single-tap action (camera или gallery)
- **FAQ** аккордеон по умолчанию, ≥16px font (избегаем iOS auto-zoom)
- **Sticky-header** ≤56px (не 88 как liwood)
- **Reduced-motion** guard на scroll-reveal (sustained `prefers-reduced-motion`)
- **Touch-target** ≥44pt на каждый interactive (sustained ui-ux-pro-max `touch-target-size`)

## Photo budget

| Тип | Шт. на pillar | Шт. на 6 pillar | Source |
|-----|--------------|-----------------|--------|
| Hero photo | 1 | 6 | fal.ai Nano Banana Pro, brand-guide §photography |
| Case before/after | 2 | 12 | fal.ai Nano Banana Pro, документальный |
| District photos | 0 (hidden T2) | 0 | n/a |
| **Итого** | **3** | **18 photos** | D2 wave |

Все photos идут через design review до публикации (sustained ADR-0021 §AC D2). Fallback dev/staging — picsum-stub. Production — pre-generated batch.

## Brand-guide-first iron rule (sustained)

Каждая секция выше имеет ✅ §brand-guide reference. Если в D3 fe wave fe верстает блок без soответствующей §brand-guide — qa **block PR** (sustained ADR-0021 §iron rule, team/qa.md review-checklist).

Запрещено:
- Inline-стили / ad-hoc Tailwind утилиты вне токенов brand-guide v2.6
- Кастомные классы вне утверждённых в brand-guide
- «Дизайнерские импровизации» — каждый паттерн сначала PR в brand-guide.html, только потом mockup

## Hand-off

D1 closure → D2 (token sync + AI assets). D2 owner: design + fe.
