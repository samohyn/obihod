---
us: homepage-classic-launch
epic: TASK-SITE-AD-HOC
title: Главная — Direction 2 «Конверсионный» в продакшен
team: product
po: podev
type: feature
priority: P1
segment: B2C+B2B
phase: dev
role: fe-site
status: dev-done-local-verify-pending
created: 2026-05-04
updated: 2026-05-04
blocks: []
blocked_by: []
related: [newui/homepage-classic.html]
---

# US · Главная — Direction 2 «Конверсионный» в продакшен

## Запрос оператора

«забирай homepage-classic.html в работу и ставь ее главной»

Дата: 2026-05-04. Дизайн-источник: `newui/homepage-classic.html` (v4, финализирован в сессии 2026-05-04).

## Контекст

В `newui/` создан и согласован с оператором полный статичный макет Direction 2 «Конверсионный»: 11 секций по структуре конкурентов (musor.moscow, liwood), Hero с form-card справа, открытый прайс, E-E-A-T документы, агрегированные рейтинги. Дизайн прошёл CRO+UX ревью (@lp-site + @ux). Задача: перевести в production Next.js.

Текущая главная: `site/app/(marketing)/page.tsx` — компонентная архитектура, 12 секций Direction 1.

## Mapping секций: текущее → новое

| # | Новый макет (homepage-classic) | Текущий компонент | Действие |
|---|---|---|---|
| 01 | Hero (H1 + trust bullets + **form-card справа**) | `Hero.tsx` | **ПЕРЕПИСАТЬ** — добавить form-card layout |
| 02 | Pillars 4-in-1 (`hp-pillar` grid) | `Services.tsx` | **РЕФАКТОРИНГ** — новая grid-раскладка с ценой |
| 03 | How (5 шагов, `hp-how-card`) | `How.tsx` | **РЕФАКТОРИНГ** — минорный, добавить SLA-бейджи |
| 04 | Pricing table (`hpc-price-row`) | — | **СОЗДАТЬ** `PricingTable.tsx` |
| 05 | Фото→смета + output-card | `Calculator.tsx` | **РЕФАКТОРИНГ** — заменить calculator на foto-smeta USP |
| 06 | Cases 6 шт. (3-col, before/after) | `Cases.tsx` | **РЕФАКТОРИНГ** — 6 кейсов вместо 3, B2B-тег |
| 07 | Reviews (stat-tiles + 6 cards) | `Reviews.tsx` | **РЕФАКТОРИНГ** — добавить агрегат-тайлы |
| 08 | E-E-A-T trust-cards (8 документов) | `Guarantees.tsx` | **РЕФАКТОРИНГ / ПЕРЕПИСАТЬ** — 8 карточек с doc-превью |
| 09 | Coverage chip-grid 12 районов | — | **СОЗДАТЬ** `Coverage.tsx` (chips по районам) |
| 10 | FAQ accordion | `FAQ.tsx` | **РЕФАКТОРИНГ** — плавная анимация, chevron |
| 11 | Footer-CTA dual (dropzone + форма) | `CtaFooter.tsx` | **РЕФАКТОРИНГ** — 2-column dual CTA |
| — | SeasonCalendar | `SeasonCalendar` | **УДАЛИТЬ** из главной |
| — | Subscription | `Subscription.tsx` | **УДАЛИТЬ** из главной |
| — | Team | `Team.tsx` | **УДАЛИТЬ** из главной |
| — | B2B (полная секция) | `B2B.tsx` | **УДАЛИТЬ** из главной (уже покрыто в Pillars + Hero lead) |

## Ключевые решения, требующие подтверждения

1. **B2B секция удаляется из главной?** — в новом макете B2B-аргументы распределены по Hero lead и Coverage. Отдельная B2B-секция убирается. Подтверди оператор.
2. **SeasonCalendar → архив?** — не вписывается в Direction 2. Компонент сохраняется, из главной убирается.
3. **Pricing table — данные hardcoded или из Payload?** — В макете цены статические. Если нужен CMS-control — потребуется новая Payload-коллекция `prices` (scope: `be-panel` + `dba`). Стартуем со статики.
4. **Coverage (12 районов) — данные из Payload `districts`?** — да, `districts` коллекция уже есть, подключаем.
5. **E-E-A-T документы — Payload media или static?** — стартуем с статическими SVG-плейсхолдерами, как в макете.

## Риски

- `Hero.tsx` — самый критичный компонент: появляется `LeadForm` внутри hero. Payload Leads коллекция уже есть (US-8). Переиспользуем `LeadForm.tsx`.
- FAQ анимация (JS height-transition) — нужна клиентская компонента (`'use client'`).
- Mobile-first: макет проверен на 960px+ через Playwright, нужна повторная проверка 375/414/768 в Next.js.

## Acceptance Criteria (черновик)

- [ ] `site/app/(marketing)/page.tsx` использует секции из homepage-classic, в порядке: Hero → Pillars → How → PricingTable → PhotoSmeta → Cases → Reviews → EEAT → Coverage → FAQ → CtaFooter
- [ ] Hero содержит `LeadForm` справа на ≥1024px, ниже Hero на <1024px
- [ ] PricingTable рендерит 7 строк со статическими ценами
- [ ] Coverage chips подключены к Payload `districts` коллекции
- [ ] FAQ открывается/закрывается плавно (height-transition)
- [ ] `pnpm type-check && pnpm lint` — 0 ошибок
- [ ] Lighthouse mobile ≥ 85 по Performance (не хуже текущего)

## Hand-off log

| Timestamp | From → To | Комментарий |
|---|---|---|
| 2026-05-04 | popanel → podev | intake готов, дизайн-референс `newui/homepage-classic.html` v4, оператор одобрил дизайн. Нужен sa-site + fe-site. |
