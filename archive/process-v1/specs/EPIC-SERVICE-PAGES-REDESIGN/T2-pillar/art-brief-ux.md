---
artifact: art-brief-ux
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T2_PILLAR
authors: ux + design
created: 2026-05-09
related:
  - team/adr/ADR-0021-service-page-master-template.md (customer journey 4-step)
  - design-system/brand-guide.html (v2.6 §notifications, §errors)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief.md (general direction)
---

# T2 Pillar — UX brief

## Customer journey (sustained ADR-0021 §customer journey 4-step)

| Step | Эмоция | Section(s) | Цель шага |
|------|--------|-----------|-----------|
| 1. Awareness | «Я попал на правильную страницу?» | hero | За 3 секунды H1 «Услуга в Москве и МО» + USP «фото за 10 минут» убеждают остаться |
| 2. Понимание | «Что входит / сколько стоит / куда жмякать?» | breadcrumbs → tldr → services-grid → pricing-block | Scan-friendly summary 3-5 пунктов; pricing-table с диаметром снимает «сколько» |
| 3. Решение | «Им можно доверять?» | calculator → process → mini-case → faq | Photo→смета как USP-trigger; 4-7 шагов explicit; реальный кейс с metric; снятие 6-10 возражений |
| 4. Действие | «Поехали оставлять заявку» | cta-banner → related-services → lead-form | Inline CTA реминдер; sibling-services как «нашёл лучше — туда»; final form с 5-state flow |

## Click-path-audit checklist (sustained click-path-audit skill)

Перед D7 audit — проверить КАЖДУЮ click-точку:

### Hero
- [ ] Primary CTA «Загрузить фото» → открывает file picker (`accept=image/*`) ИЛИ скроллит к calculator (decision в D3 — operator preference)
- [ ] Secondary `tel:` link → открывает диалер на mobile / clipboard на desktop
- [ ] Photo-upload drag-drop area → принимает drop, переходит в state «uploading»
- [ ] Breadcrumbs link «Услуги» → переход на `/uslugi/`

### Services-grid
- [ ] Каждая sub-карточка → переход на `/uslugi/<pillar>/<sub>/` (T3 SUB)
- [ ] Hover-state subtle shadow lift visible

### Pricing
- [ ] CTA «Выбрать тариф» в каждом tier → скролл к calculator с pre-filled tier param
- [ ] Mobile accordion expand/collapse работает на tap (≥44pt summary)

### Calculator (CRITICAL flow)
- [ ] File picker открывается → photo загружается → preview thumbnail появляется
- [ ] Multiple photos: каждый thumbnail имеет remove icon с `aria-label="Удалить фото"`
- [ ] Submit photo → state «processing» с spinner
- [ ] API success → state «result» с предварительной сметой
- [ ] API error → inline error «Не удалось — попробуйте ещё раз / позвоните» + retry button
- [ ] Result CTA «Перейти к заявке» → скролл к lead-form с pre-filled photo refs

### Process
- [ ] Каждый шаг scroll-reveal 300ms (sustained reduced-motion guard)
- [ ] Connector line visible между шагами

### Mini-case
- [ ] «Полный кейс →» link → `/kejsy/<slug>/`
- [ ] Before/after slider draggable (mouse + touch) ИЛИ tap-toggle на mobile

### FAQ
- [ ] `<details>/<summary>` toggle на click + Enter + Space
- [ ] Esc closes open details
- [ ] Chevron rotates 180° smoothly

### CTA-banner
- [ ] CTA «Пришлите фото» → скролл к calculator

### Related-services
- [ ] Каждая card → переход на sibling pillar URL

### Lead-form (CRITICAL flow)
- [ ] phone input принимает `tel:` format, на mobile открывает numeric keyboard
- [ ] name input — `autocomplete="name"`
- [ ] photo upload — multi, drag-drop работает
- [ ] 152-ФЗ checkbox required → submit без него блочит + error «Подтвердите согласие»
- [ ] Submit → state «submitting» → API call → state «success» (success-card replaces form) ИЛИ state «error» (inline error + retry)
- [ ] Success → Telegram-notification операторам (sustained US-8 backend)
- [ ] UTM сохраняются в Lead document (sustained US-8)

### Sticky bottom-CTA bar (mobile only)
- [ ] Появляется при scroll > 200px (smooth fade-in 300ms)
- [ ] Primary «Photo→смета» → скролл к calculator
- [ ] Secondary `tel:` → диалер
- [ ] Не перекрывает modal/sheet (z-index 100, modal ≥1000)

## CTA hierarchy

Sustained ui-ux-pro-max `primary-action` rule: 1 primary + 1 secondary per screen.

| Уровень | CTA | Где |
|---------|-----|-----|
| Primary | «Загрузить фото / получить смету» | hero, calculator, cta-banner, lead-form, sticky bottom (mobile) |
| Secondary | `tel:+7-499-...` | hero, sticky bottom (mobile), footer |
| Tertiary | «Похожие услуги», «Полный кейс», sub-карточка | services-grid, mini-case, related-services |

**Запрещено:** ≥2 primary CTA в одной секции (нарушение sustained `primary-action`).

## Error / empty / loading states (sustained brand-guide §notifications + §errors)

| State | Pattern | Где применяется |
|-------|---------|-----------------|
| Loading | skeleton shimmer (sustained `#notifications`), reduced-motion disabled | calculator processing, lead-form submitting |
| Empty | empty-state card с copy «Кейсы скоро будут — пришлите фото» (TOV-guard) | mini-case если нет данных |
| Error inline | `--c-error` border + helper text «что не так + что сделать» | lead-form fields, calculator API fail |
| Error toast | toast с retry button, `aria-live="polite"` | network error, server 5xx |
| Success | success-card replaces form (sustained `#notifications:2387` 5-state flow) | lead-form submit success |

## Wireframe (low-fi ASCII desktop 1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER (sticky 56px)        [Logo]  [Nav]  [Phone]  [CTA Заявка] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 01 HERO                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────────┐      │
│  │ H1 Услуга в Москве   │  │  PHOTO-UPLOAD CARD            │      │
│  │ Lead 2-3 строки USP  │  │  [drag-drop area]             │      │
│  │ [Primary] [Phone tel:]│  │  «Перетащите фото»            │      │
│  └──────────────────────┘  └──────────────────────────────┘      │
│                                                                  │
│ 02 BREADCRUMBS  Главная > Услуги > <Pillar>                      │
│                                                                  │
│ 03 TLDR ┌────────────────────────────────────────────────────┐    │
│         │ ▍ Кратко                                          │    │
│         │  • что входит                                     │    │
│         │  • срок                                           │    │
│         │  • цена от X руб.                                 │    │
│         └────────────────────────────────────────────────────┘    │
│                                                                  │
│ 04 SERVICES-GRID (T2 only)                                       │
│   [card] [card] [card]                                           │
│   [card] [card] [card]   3 col × 4-11 sub-услуг                  │
│                                                                  │
│ 05 PRICING-BLOCK                                                 │
│   ┌─────────┐ ┌──────────┐ ┌─────────┐                            │
│   │Базовый  │ │Стандарт ★│ │Под ключ │   3-tier highlighted middle│
│   │от X руб.│ │от Y руб. │ │от Z руб.│   tabular-nums            │
│   └─────────┘ └──────────┘ └─────────┘                            │
│                                                                  │
│ 06 CALCULATOR (центр scroll)                                     │
│   ┌────────────────────────────────────┐                          │
│   │ [drag-drop area]                   │                          │
│   │ или [Выбрать файлы] кнопка         │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ 07 PROCESS-STEPS  ⓵──⓶──⓷──⓸──⓹  horizontal 4-7 шагов            │
│                                                                  │
│ 08 MINI-CASE                                                     │
│   [before/after slider]   [icon + h-l + metric + link]           │
│                                                                  │
│ 09 FAQ                                                           │
│   ▶ Вопрос 1                                                     │
│   ▶ Вопрос 2                                                     │
│   ▼ Вопрос 3 (open)                                              │
│     ответ                                                        │
│                                                                  │
│ 10 CTA-BANNER «Готовы убрать? Пришлите фото — смета за 10 мин»  │
│                                                                  │
│ 11 RELATED-SERVICES (sibling pillars)                            │
│   [card] [card] [card] [card]                                    │
│                                                                  │
│ 13 LEAD-FORM                                                     │
│   ┌────────────────────────────────────┐                          │
│   │ [phone] [name]                     │                          │
│   │ [photo upload multi]               │                          │
│   │ [textarea коммент] (optional)      │                          │
│   │ ☐ 152-ФЗ                           │                          │
│   │ [Primary CTA «Отправить»]          │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

## A11y checklist (sustained accessibility skill + WCAG 2.2 AA)

- [ ] Контраст 4.5:1 для body, 3:1 для large text (sustained `color-contrast`)
- [ ] Все icon-only buttons имеют `aria-label` (sustained `aria-labels`)
- [ ] Photo-upload area доступна с keyboard: Tab focus → Enter/Space открывает file picker
- [ ] Calculator drag-drop area имеет alt input method (button «Выбрать файлы»)
- [ ] FAQ `<details>` semantics work с screen reader (sustained `<details>` semantics)
- [ ] Form errors aria-live="polite" + auto-focus на первый invalid field (sustained `focus-management`)
- [ ] Heading hierarchy h1 → h2 → h3 sequential, no skip (sustained `heading-hierarchy`)
- [ ] Keyboard nav covers все interactive elements, Tab order matches visual order
- [ ] Skip link «К основному контенту» visible on focus
- [ ] axe-core 0 critical errors (sustained verification gate)
- [ ] Touch ≥44pt × 44pt на каждой interactive (sustained `touch-target-size`)
- [ ] Reduced-motion guard на все scroll-reveal / shimmer (sustained `reduced-motion`)
- [ ] Dynamic Type не ломает layout на largest setting

## Hand-off

D1 → D2 (token sync). UX-guard в D7 brand-guide compliance audit.
