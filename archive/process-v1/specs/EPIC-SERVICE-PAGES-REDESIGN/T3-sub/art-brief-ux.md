---
artifact: art-brief-ux
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T3_SUB
authors: ux + design
created: 2026-05-09
related:
  - team/adr/ADR-0021-service-page-master-template.md (customer journey 4-step)
  - design-system/brand-guide.html (v2.6 §notifications, §errors)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T3-sub/art-brief.md (general direction)
---

# T3 Sub-services — UX brief

## Customer journey (sustained ADR-0021 §customer journey 4-step)

T3 user уже scope'ed-down — пришёл за конкретным методом. Эмоциональная кривая ускоренная:

| Step | Эмоция | Section(s) | Цель шага T3 |
|------|--------|-----------|---------------|
| 1. Awareness | «Это та страница про метод» | hero (с district-pill) | За 2 секунды убедить «правильный метод + работаем у вас» |
| 2. Понимание | «Как мерят и сколько» | breadcrumbs → tldr → pricing parameter-based | Тех. specifics: диаметр / вес / м³ × цена |
| 3. Решение | «Им можно доверять для этого метода» | calculator pre-filled → process specifics → faq | Photo→смета с pre-filled tier; method-specific 4-7 шагов; 6-10 method FAQ |
| 4. Действие | «Поехали» | (cta-banner optional) → related-subs → neighbor-districts → lead-form | Inline CTA если есть; sibling-subs «нашёл лучше — туда»; district-chips «в моём районе» → final form |

T3 короче T2 (нет services-grid, optional mini-case + cta-banner). Меньше скролла = быстрее до lead-form.

## Click-path-audit checklist

### Hero
- [ ] Primary CTA «Загрузить фото» → file picker / scroll к calculator
- [ ] Secondary `tel:` link → диалер
- [ ] District-pill chips → переход на T4 SD URL `/uslugi/<pillar>/<city>/`
- [ ] Breadcrumbs 4 уровня все clickable

### Pricing parameter-based
- [ ] Tooltip info-icon → tap-toggle на mobile, hover на desktop
- [ ] CTA в каждой строке → scroll к calculator с pre-filled параметром

### Calculator pre-filled
- [ ] Calculator открывается с `defaultTier=<T3 sub slug>` ИЛИ pre-filled hint
- [ ] CRITICAL flow same as T2: photo upload → preview → submit → processing → result
- [ ] Result CTA → scroll к lead-form

### Process
- [ ] Каждый шаг scroll-reveal 300ms (reduced-motion sustained)
- [ ] Контент = method-specific (qa проверяет в content review)

### Mini-case (optional)
- [ ] Если present — «Полный кейс →» link работает
- [ ] Если absent — секция hidden (НЕ empty state)

### FAQ
- [ ] `<details>/<summary>` toggle sustained
- [ ] Контент = method-specific (qa проверяет content)

### Related-services (sibling-subs)
- [ ] Каждая card → переход на sibling T3 URL внутри того же pillar

### Neighbor-districts
- [ ] Каждый chip → переход на T4 SD URL `/uslugi/<pillar>/<city>/`
- [ ] Horizontal scroll mobile работает с swipe (sustained `gesture-feedback`)
- [ ] Touch-target ≥44pt на каждый chip

### Lead-form
- [ ] Same flow как T2 (sustained `#lead-form-full` 5-state)

### Sticky bottom-CTA bar
- [ ] Same как T2 (sustained mobile-first контракт)

## CTA hierarchy (T3)

| Уровень | CTA | Где |
|---------|-----|-----|
| Primary | «Загрузить фото / получить смету» | hero, calculator, lead-form, sticky bottom (mobile) |
| Secondary | `tel:+7-499-...` | hero, sticky bottom, footer |
| Tertiary | district-chips (T4 SD jump), sibling-subs, mini-case link | hero district-pill, related-services, neighbor-districts |

## Error / empty / loading states (sustained brand-guide §notifications + §errors)

Same patterns как T2 (sustained `#notifications` 5-state flow).

T3-specific:
- **Mini-case absent** → секция hidden, НЕ empty-state
- **Neighbor-districts: < 3 chips** → секция hidden (не показываем 1 chip, выглядит broken)
- **Pricing: data missing** → секция hidden + cw flag в content review

## Wireframe (low-fi ASCII desktop 1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER (sticky 56px)                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 01 HERO                                                          │
│  Работаем в: [Москва] [Химки] [Раменское] [Жуковский]            │
│  ┌──────────────────────┐  ┌──────────────────────────────┐      │
│  │ H1 <Метод> в пиллар   │  │  PHOTO (метод-specific)       │      │
│  │ Lead 2-3 строки       │  │                                │      │
│  │ [Primary] [Phone tel:]│  │                                │      │
│  └──────────────────────┘  └──────────────────────────────┘      │
│                                                                  │
│ 02 BREADCRUMBS  Главная > Услуги > <Pillar> > <Sub>              │
│                                                                  │
│ 03 TLDR                                                          │
│         ┌────────────────────────────────────────────────────┐    │
│         │ ▍ Кратко                                          │    │
│         │  • что специфично для метода                      │    │
│         │  • срок                                           │    │
│         │  • цена от X руб.                                 │    │
│         └────────────────────────────────────────────────────┘    │
│                                                                  │
│   (04 services-grid HIDDEN T3)                                   │
│                                                                  │
│ 05 PRICING parameter × value × price                             │
│   ┌────────────────────────────────────────────────────┐          │
│   │ Диаметр (см)   Стандарт   Аварийный   Под ключ    │          │
│   │ 15              X руб     Y руб       Z руб       │          │
│   │ 25              ...                                │          │
│   │ 40              ...                                │          │
│   └────────────────────────────────────────────────────┘          │
│                                                                  │
│ 06 CALCULATOR pre-filled                                          │
│   ┌────────────────────────────────────┐                          │
│   │ [drag-drop area]                   │                          │
│   │ defaultTier=<sub>                  │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ 07 PROCESS-STEPS (method-specific)                               │
│   ⓵──⓶──⓷──⓸──⓹  4-7 шагов                                      │
│                                                                  │
│   (08 mini-case OPTIONAL — может быть hidden)                    │
│                                                                  │
│ 09 FAQ (method-specific)                                         │
│   ▶ Вопрос 1                                                     │
│   ▶ Вопрос 2                                                     │
│                                                                  │
│   (10 cta-banner OPTIONAL)                                       │
│                                                                  │
│ 11 RELATED-SUBS (sibling-subs внутри pillar)                     │
│   [card] [card] [card] [card]                                    │
│                                                                  │
│ 12 NEIGHBOR-DISTRICTS                                            │
│   [chip 12км] [chip 18км] [chip 25км] [chip 40км]                │
│                                                                  │
│ 13 LEAD-FORM                                                     │
│   ┌────────────────────────────────────┐                          │
│   │ phone, name, photo, 152-ФЗ, submit │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

## A11y checklist

Same baseline как T2 (WCAG 2.2 AA, axe-core 0 critical). T3-specific:

- [ ] Breadcrumbs 4 уровня все имеют semantic markup (`<nav aria-label="Хлебные крошки">`)
- [ ] District-pill chips — `role="list"` родитель + `<a>` каждый chip с aria-label «Перейти на <city>»
- [ ] Pricing parameter-table — `<th scope="col">` + `<th scope="row">` для screen reader nav
- [ ] Tooltip info-icon: focusable, `aria-describedby` link на tooltip content
- [ ] Mobile horizontal-scroll chips: keyboard nav через arrow keys ИЛИ `aria-roledescription="carousel"` (sustained `gesture-alternative`)
- [ ] Все остальное sustained как T2

## Hand-off

D1 → D2 (token sync). UX-guard в D7 brand-guide compliance audit.
