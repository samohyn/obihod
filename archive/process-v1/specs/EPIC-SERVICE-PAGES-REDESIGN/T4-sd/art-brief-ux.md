---
artifact: art-brief-ux
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T4_SD
authors: ux + design
created: 2026-05-09
related:
  - team/adr/ADR-0021-service-page-master-template.md (customer journey 4-step)
  - design-system/brand-guide.html (v2.6 §notifications, §errors)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T4-sd/art-brief.md (general direction)
---

# T4 SD (Service-District) — UX brief

## Customer journey (sustained ADR-0021 §customer journey 4-step)

T4 user — самый горячий: знает услугу + локацию, ищет «работают ли у меня». Эмоциональная кривая максимально ускоренная:

| Step | Эмоция | Section(s) | Цель шага T4 |
|------|--------|-----------|---------------|
| 1. Awareness | «Они работают в <City>?» | hero (city-photo + landmark + 150+ слов) | За 1 секунду: city-photo + H1 + local-trust badge → «да, у вас» |
| 2. Понимание | «Сколько в моём районе» | breadcrumbs → tldr → pricing с city-note | Pricing с note «актуально для <City>» — снимает «вдруг другая цена» |
| 3. Решение | «Вот реальный кейс рядом» | calculator pre-filled → process → mini-case с city-photo → faq с city-вопросами | Photo→смета с pre-filled city; локальный кейс с реальным landmark; 1-2 city-specific FAQ |
| 4. Действие | «Жмякаем» | cta-banner с city-token → neighbor-districts → lead-form | Inline CTA «Уберём в <City>?»; chips соседних районов (на случай ошибки выбора); final form |

T4 — самый compact (9 секций). BOFU user = быстрее до lead-form. Hyperlocal-trust = главный механизм конверсии.

## Click-path-audit checklist

### Hero
- [ ] Primary CTA «Загрузить фото» → file picker / scroll к calculator
- [ ] Secondary `tel:` link → диалер
- [ ] **City-вступление collapsible на mobile**: «Читать дальше» link → expand text smoothly
- [ ] Breadcrumbs 4 уровня все clickable
- [ ] Local-trust badge (если есть) — visible, scan-friendly

### Pricing с city-note
- [ ] City-note caption visible под таблицей
- [ ] Tooltip info-icon работает
- [ ] CTA в каждой строке → scroll к calculator с pre-filled city + tier

### Calculator pre-filled
- [ ] Calculator открывается с `defaultCity=<city slug>`
- [ ] CRITICAL flow: photo upload → preview → submit → processing → result
- [ ] Result CTA → scroll к lead-form (city pre-fill carries over)

### Process
- [ ] 4-7 шагов scroll-reveal (reduced-motion sustained)

### Mini-case (REQUIRED T4)
- [ ] City-photo loaded (sustained lazy-load)
- [ ] «<Имя> в <City>» caption visible
- [ ] «Полный кейс →» link → `/kejsy/<slug>/`
- [ ] Empty-state (если нет кейса) → CTA scroll к calculator

### CTA-banner
- [ ] City-token interpolated в copy («<City>»)
- [ ] CTA → scroll к calculator

### FAQ
- [ ] `<details>/<summary>` toggle sustained
- [ ] City-specific FAQ visible (qa проверяет content в D7)

### Neighbor-districts (CRITICAL T4)
- [ ] **Каждый chip → переход на T4 SD URL** `/uslugi/<pillar>/<neighbor-city>/`
- [ ] Расстояние «X км» точное (sustained wsfreq US-4)
- [ ] Horizontal scroll mobile работает swipe (sustained `gesture-feedback`)
- [ ] Touch-target ≥44pt
- [ ] Минимум 4 chips (sustained ADR-0021 §UI density)

### Lead-form
- [ ] Same flow как T2/T3 (sustained `#lead-form-full` 5-state)
- [ ] **City pre-filled hint** в comment field ИЛИ hidden meta (sustained UTM-style)

### Sticky bottom-CTA bar
- [ ] Same как T2/T3 (sustained mobile-first контракт)

## CTA hierarchy (T4)

| Уровень | CTA | Где |
|---------|-----|-----|
| Primary | «Загрузить фото / получить смету» | hero, calculator, cta-banner, lead-form, sticky bottom |
| Secondary | `tel:+7-499-...` | hero, sticky bottom, footer |
| Tertiary | neighbor-districts chips, mini-case link | neighbor-districts, mini-case |

T4 НЕ показывает related-services (sustained ADR-0021 matrix). Tertiary только district-chips + case-link.

## Error / empty / loading states (sustained brand-guide §notifications + §errors)

T4-specific:
- **Mini-case absent** → empty-state visible с copy «Кейсы в <City> скоро будут — пришлите фото, рассчитаем смету» + CTA scroll к calculator (sustained `error-recovery`)
- **Neighbor-districts: < 4 chips** → секция hidden + cw flag + design fallback на «расширим список» (sustained wsfreq US-4)
- **City-photo failed to load** → fallback на pillar generic photo (lazy-load `onerror`)
- **City-вступление < 150 слов** → cw flag в content review (BOFU SEO requires unique content per T4)

## Wireframe (low-fi ASCII desktop 1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER (sticky 56px)                                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ 01 HERO (city-photo + landmark)                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ [HERO PHOTO 16:9 — ВИД <City> с landmark]                  │  │
│  │  H1 <Услуга> в <Городе>                                    │  │
│  │  [Local-trust badge: «12 проектов в <City>»]               │  │
│  │  Lead 150+ слов city-вступление о районе                   │  │
│  │  [Primary CTA] [Phone tel:]                                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ 02 BREADCRUMBS  Главная > Услуги > <Pillar> > <City>             │
│                                                                  │
│ 03 TLDR                                                          │
│         ┌────────────────────────────────────────────────────┐    │
│         │ ▍ Кратко                                          │    │
│         │  • что делаем в <City>                            │    │
│         │  • срок                                           │    │
│         │  • цена от X руб.                                 │    │
│         └────────────────────────────────────────────────────┘    │
│                                                                  │
│   (04 services-grid HIDDEN T4)                                   │
│                                                                  │
│ 05 PRICING                                                       │
│   ┌─────────┐ ┌──────────┐ ┌─────────┐                            │
│   │Базовый  │ │Стандарт ★│ │Под ключ │                            │
│   │от X руб.│ │от Y руб. │ │от Z руб.│                            │
│   └─────────┘ └──────────┘ └─────────┘                            │
│   * цены актуальны для <City> и района                            │
│                                                                  │
│ 06 CALCULATOR pre-filled                                          │
│   ┌────────────────────────────────────┐                          │
│   │ defaultCity=<city slug>            │                          │
│   │ [drag-drop area]                   │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ 07 PROCESS-STEPS  ⓵──⓶──⓷──⓸──⓹                                 │
│                                                                  │
│ 08 MINI-CASE (REQUIRED T4)                                        │
│   ┌────────────────────────────────────┐                          │
│   │  [CITY-PHOTO 16:9 с landmark района]│                          │
│   │  «Иванов в <City>, ул. Ленина»     │                          │
│   │  metric: «срезали за 4 часа»       │                          │
│   │  [Полный кейс →]                   │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ 10 CTA-BANNER «Уберём в <City>? Пришлите фото — смета 10 мин»    │
│                                                                  │
│ 09 FAQ (с city-specific вопросами)                                │
│   ▶ Работаете ли в <City>?                                        │
│   ▶ Приедете на ул. <ulitsa>?                                     │
│   ▶ ...                                                           │
│                                                                  │
│   (11 related-services HIDDEN T4)                                │
│                                                                  │
│ 12 NEIGHBOR-DISTRICTS (CRITICAL)                                 │
│   [chip 12км] [chip 18км] [chip 25км] [chip 40км] [chip 55км]    │
│                                                                  │
│ 13 LEAD-FORM (city pre-filled)                                   │
│   ┌────────────────────────────────────┐                          │
│   │ phone, name, photo, 152-ФЗ, submit │                          │
│   │ [hidden: city=<city slug>]         │                          │
│   └────────────────────────────────────┘                          │
│                                                                  │
│ FOOTER                                                           │
└──────────────────────────────────────────────────────────────────┘
```

## A11y checklist

Same baseline как T2/T3 (WCAG 2.2 AA, axe-core 0 critical). T4-specific:

- [ ] Hero photo (full-bleed) имеет text-overlay contrast ≥4.5:1 (sustained `color-contrast`)
- [ ] Hero photo `alt` text включает city + service + landmark («Удаление дерева в Химках, вид на ЖК Городские Резиденции» — НЕ generic «Услуга»)
- [ ] City-вступление collapsible на mobile использует semantic `<details>/<summary>` ИЛИ button-toggle с `aria-expanded`
- [ ] Mini-case city-photo `alt` включает имя + city + улицу
- [ ] Neighbor-districts chips: каждый `<a>` имеет full aria-label «Перейти к <pillar> в <neighbor-city>, <X> км от <current-city>»
- [ ] FAQ city-specific вопросы semantic `<details>` sustained
- [ ] Breadcrumbs 4 уровня semantic
- [ ] Все остальное sustained как T2/T3

## Hand-off

D1 → D2 (token sync + 300 photos batch). UX-guard в D7 brand-guide compliance audit.
