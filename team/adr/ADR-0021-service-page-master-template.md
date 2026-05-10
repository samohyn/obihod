---
adr: 0021
title: Service page master-template — единая структура T2/T3/T4 страниц `/uslugi/` с brand-guide-first iron rule
status: accepted
deciders: [arch, design, fe, po, operator]
date: 2026-05-09
related:
  - team/adr/ADR-0019-uslugi-routing-resolver.md (slug-resolver — куда инжектится этот template)
  - team/adr/ADR-0020-shop-sunset-landshaft-positioning.md (landshaft = 5-й pillar услуг)
  - team/adr/ADR-0003-blocks-pattern.md (sustained Payload blocks pattern)
  - design-system/brand-guide.html (v2.2 — source of truth для UI/UX, 4299 строк)
  - design-system/inventory-services-2026-05.md (deliverable C1.a — inventory готовых компонентов)
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md (deliverable C1.b — UX/UI бенчмарк liwood)
  - specs/EPIC-SERVICE-PAGES-UX/intake.md (deliverable C2)
  - site/blocks/index.ts (12 sustained Payload blocks)
  - site/blocks/master-template.ts (этот ADR определяет schema, файл реализует)
  - site/lib/seo/composer.ts (JSON-LD T2_PILLAR/T3_SUB/T4_SD — sustained US-3 done)
---

# ADR-0021 — Service page master-template: единая структура T2/T3/T4 с brand-guide-first iron rule

## Контекст

EPIC-SEO-USLUGI принёс на prod **191 service-URL** в три типа: 5 T2 pillar (`/<pillar>/`), 35 T3 sub-services (`/<pillar>/<sub>/`), 150 T4 service-districts (`/<pillar>/<city>/`). ADR-0019 зафиксировал routing-resolver. **Что не зафиксировано — структура самих страниц**: какие секции, в каком порядке, какие обязательные / опциональные на каждом из трёх типов, и как UI каждой секции маппится на `design-system/brand-guide.html` v2.2.

Сейчас каждая страница = свободный набор `blocks[]` в Payload документе. Risk:
1. **UX-расхождение** — Services / Districts / B2B-pages используют разные секции в разных порядках. Customer journey ломается, sticky-pattern «hero → понимание → решение → действие» не воспроизводится.
2. **Brand-guide drift** — без mapping table «секция → §brand-guide» команда генерирует ad-hoc UI «по памяти» (нарушение iron rule «design-system/ — единственный source of truth», memory: feedback_design_system_source_of_truth.md).
3. **Mobile broken** — без mobile-first контракта на каждый блок повторяем баг liwood (horizontal scroll 440px > 375px viewport, font 12px, sticky-header перекрывает hero — C1.b §5).
4. **Click-path фрагментирован** — без единой схемы кнопок/states (default/hover/pressed/focus/disabled/loading) пользователь сталкивается с inconsistent UX.

C1.a (`design-system/inventory-services-2026-05.md`) показал: 15 готовых компонентов покрывают 70% потребностей master-template, **13 секций требуют расширения brand-guide** (4 critical / 4 high / 5 medium). C1.b (`seosite/01-competitors/liwood-page-anatomy-2026-05.md`) показал: 6 копировательных приёмов liwood + 8 whitespace-возможностей + top-5 UX-улучшений (hero-photo-USP, mobile sticky-bottom-CTA, AggregateRating, JSON-LD 100%, 10-12 секций vs liwood-17).

Решение откладывалось двумя блокерами: (a) `landshaft` fate — закрыт ADR-0020 (5-й pillar услуг). (b) inventory + бенчмарк — закрыты C1.a + C1.b.

## Решение

**Принят master-template из 13 секций для всех `/uslugi/*` страниц с per-layer (T2/T3/T4) флагами `required` / `optional` / `hidden`, с iron rule «brand-guide-first» (каждая секция маппится на `§brand-guide` или явно требует расширения в C2.5 design wave), с mobile-first контрактом (sticky bottom-CTA bar 56px, 16px body min, 0 horizontal scroll, touch-target ≥44pt) и с единой customer journey 4-step (Hero → Понимание → Решение → Действие).**

### Структура master-template (13 секций, fixed order)

```
01. hero               — H1 + lead + CTA (T2/T3 photo-upload USP, T4 city-photo)
02. breadcrumbs        — visual + BreadcrumbList JSON-LD
03. tldr               — 3-5 пунктов «что входит / срок / цена от» + Speakable
04. services-grid      — sub-услуги pillar (T2 only)
05. pricing-block      — таблица «параметр × цена» + 3-tier (опц)
06. calculator         — photo→смета US-8 (Claude API) UI shell
07. process            — 4-7 пронумерованных шагов
08. mini-case          — 1 кейс с before/after photo + 1 metric
09. faq                — 6-10 вопросов + FAQPage JSON-LD
10. cta-banner         — inline между секциями + final pre-form
11. related-services   — 4-6 sibling-карточек
12. neighbor-districts — 4-6 sibling-районов (T3/T4 only)
13. lead-form          — phone + name + photo + 152-ФЗ + 5-state submit flow
```

Order — **fixed для всех трёх layer**. Эмоциональная кривая C1.b §0 («Awareness → Solution → Proof → Action») воспроизводится на каждом URL без отклонений. Reorder только через новый ADR.

### Per-layer matrix

| # | Section            | T2_PILLAR | T3_SUB | T4_SD | Обоснование                                                                                                |
|---|--------------------|-----------|--------|-------|------------------------------------------------------------------------------------------------------------|
| 01 | hero              | required  | required  | required  | hero виден 100% посетителей. Variant per layer (см. mapping table) |
| 02 | breadcrumbs       | required  | required  | required  | BreadcrumbList JSON-LD обязателен (sustained US-3 composer.ts) |
| 03 | tldr              | required  | required  | required  | scan-friendly summary + нейровыдача-адаптивен (Speakable из US-3) |
| 04 | services-grid     | required  | hidden    | hidden    | T3/T4 — внутри одной услуги, sub-grid не нужен |
| 05 | pricing-block     | required  | required  | required  | pricing — главный mid-funnel trigger по C1.b §3 (liwood приём №4) |
| 06 | calculator        | required  | required  | required  | photo→смета USP — главный конверсионный механизм Обихода (intake AC-2) |
| 07 | process           | required  | required  | required  | customer journey explicit (intake §AC step 8) |
| 08 | mini-case         | required  | optional  | required  | T2/T4 — proof обязательный; T3 — компактный, кейс из T2 reused через related |
| 09 | faq               | required  | required  | required  | FAQPage JSON-LD на 100% URL (sustained US-3, intake AC-5) |
| 10 | cta-banner        | required  | optional  | required  | inline между process и mini-case; T3 — может скипаться (короткий URL) |
| 11 | related-services  | required  | required  | optional  | T2 — sibling-pillars (sustained NeighborDistricts pattern); T3 — sibling-subs внутри pillar; T4 — uses neighbor-districts вместо |
| 12 | neighbor-districts | hidden    | required  | required  | T2 — district-агностичен (вся МО); T3/T4 — district-aware |
| 13 | lead-form         | required  | required  | required  | главный канал лидов (intake AC-1, US-8 sustained) |

**Hidden ≠ удалён** — секция исключена для этого layer на уровне validator. Если в Payload doc есть `services-grid` блок и layer=T3_SUB → validation error.

### Mapping table «section → brand-guide §» (главный артефакт)

Каждая секция = либо ✅ ready (готов как-есть в brand-guide), либо ⚠️ requires-extension (design расширяет brand-guide.html в C2.5 wave **до** старта вёрстки EPIC-D).

| # | Section            | brand-guide § (anchor + line) | Status                | Что нужно                                                                                       |
|---|--------------------|-------------------------------|-----------------------|-------------------------------------------------------------------------------------------------|
| 01 | hero              | НЕТ (есть только typography `#type:1162`) | ⚠️ requires-extension | **§Hero patterns** в `#components` (C2.5 wave): T2-hero (h-display + lead + 2 CTA + photo-upload USP), T3-hero (district-pill + photo сверху mobile), T4-hero (city-specific photo + city-вступление 150+ слов). 6 mockup (T2/T3/T4 × desktop/mobile). Photo через fal.ai Nano Banana Pro документальный стиль |
| 02 | breadcrumbs       | НЕТ                           | ⚠️ requires-extension | **§Breadcrumbs** в `#nav` или новый блок (C2.5): visual variant + BreadcrumbList JSON-LD snippet (composer.ts уже готов). 30-40 строк HTML |
| 03 | tldr              | НЕТ                           | ⚠️ requires-extension | **§TL;DR / Summary block** (C2.5): ul из 3-5 пунктов в card с border-left 4px primary, eyebrow «Кратко». Speakable атрибуты (sustained US-3) |
| 04 | services-grid     | partial: «Карточка услуги» `#components:1299-1311` | ⚠️ requires-extension | Карточка готова. Нужно **§Services Grid** layout-spec (C2.5): 3 col desktop / 2 col tablet / 1 col mobile, gap 16px, опц filter chips (radius-sm pill) |
| 05 | pricing-block     | НЕТ                           | ⚠️ requires-extension | **§Pricing table** (C2.5 critical): 3-col tier (Базовый / Стандарт / Под ключ) + tabular-nums (sustained `#type:1162` mono.tnum). Highlighted middle col, sticky on scroll опц. На mobile collapse в accordion-cards (C1.b §5 mobile) |
| 06 | calculator        | partial: form `#components:1291-1297` + 5-state flow `#notifications:2387` + skeleton `#notifications` + success-card `#notifications` | ⚠️ requires-extension | Состояния готовы. Нужна **§Calculator UI shell** (C2.5 critical): drag-drop area (idle / drag-over / uploading / processing / result), photo-thumbnail row с remove. Обёртка для US-8 Claude API |
| 07 | process           | НЕТ                           | ⚠️ requires-extension | **§Process steps** (C2.5 high): horizontal numbered (desktop 4-7 шагов) / vertical (mobile, номер 32px слева). Service-icon + title + 1-2 lines per step. Reuse Карточка услуги стиль |
| 08 | mini-case         | partial: case-icons `#icons:1487+` + Empty state `#notifications` | ⚠️ requires-extension | **§Mini-case teaser** (C2.5 high): icon + before/after photo (fal.ai) + 1 metric (числовой trust-сигнал) + link на полный кейс. T2 = horizontal, T4 = с city-photo |
| 09 | faq               | partial: `<details>` pattern в `#nav:2019` (mobile-accordion) | ⚠️ requires-extension | **§FAQ accordion** (C2.5 high): reuse mobile-accordion pattern из nav. Chevron rotation 180°, 6-10 вопросов. JSON-LD FAQPage уже в composer.ts |
| 10 | cta-banner        | ✅ pre-footer CTA `#site-chrome:3934+` (sustained §33.4.1) | ✅ ready (variant) + ⚠️ minor-extension | **§Inline CTA banner** variant (C2.5 medium): тот же markup pre-footer, другой spacing для inline-вставки между секциями. Caregiver-стиль copy «Готовы убрать дерево? Пришлите фото — рассчитаем смету за 10 минут» |
| 11 | related-services  | ✅ Карточка услуги `#components:1299` | ✅ ready              | reuse services-grid с заголовком h-l «Похожие услуги» |
| 12 | neighbor-districts | partial: district-icons `#icons:1417` (9 шт landmark) | ⚠️ requires-extension | **§District chips/grid** (C2.5 medium): pill с landmark-иконкой + название + расстояние «12 км». 3-6 chips в row. Расширение списка до 28+ районов через wsfreq US-4 (sustained) |
| 13 | lead-form         | partial: form `#components:1291` + 5-state flow `#notifications:2387` + success-card `#notifications` | ⚠️ requires-extension | **§Lead form (full)** (C2.5 critical): phone + name + photo upload (multi) + 152-ФЗ checkbox + submit. 5-state flow собран. Mobile-first (input height ≥44pt, autocomplete=tel/name, inputMode корректный) |

**Покрытие:** 13 секций → 2 ready (15%) + 11 requires-extension (85%). 4 critical / 4 high / 4 medium / 1 minor.

### Brand-guide расширения (детальная спека для C2.5 design wave)

**owner: design (`team/design.md`) + ui-ux-pro-max + design-system skills**

#### Critical — без них template не верстается (4 блока)

1. **§Hero service-page patterns** (`#components` extension или новый `#hero-patterns` section)
   - 6 mockup'ов: T2-pillar / T3-sub / T4-SD × desktop (1440px) + mobile (375px)
   - T2 variants: photo-upload entry в hero (USP «загрузите фото / получите смету за 10 минут»)
   - T3 variant: district-pill (если применимо) + photo сверху на mobile
   - T4 variant: city-specific photo (узнаваемый landmark) + 150+ слов city-вступления
   - States: default + hover-CTA + focus-visible на input + uploading-progress + error
   - Tokens: h-display + h-xl typography (`#type`) + radius-lg для photo card (`#shape`) + primary CTA (`#components:1271`)
   - Photo через fal.ai Nano Banana Pro документальный стиль (intake §fal.ai hybrid policy)
   - Anti-patterns guard: liwood-style 2-кнопки-без-формы (C1.b §1.2), эко-зелёный-листочек (`#dont`)

2. **§Calculator UI shell** (`#components` extension)
   - 5 состояний: idle / drag-over / uploading (skeleton) / processing (spinner ≥300ms через `#notifications` shimmer) / result (success-card из `#notifications`)
   - Drag-drop area: dashed border `--c-line`, 24/48 photo states (uploaded thumbnails row)
   - Photo-thumbnail row: 60x60px, remove icon top-right, `aria-label="Удалить фото"`
   - Mobile-first: full-width hero, photo-upload как single-tap action (camera / gallery alternative)
   - Reduced-motion: skeleton shimmer disabled при `prefers-reduced-motion`
   - Touch target ≥44pt на каждый interactive element
   - Reuse: 5-state flow `#notifications:2387` + success-card pattern + skeleton

3. **§Lead form (full)** (`#components` extension)
   - Inputs: phone (autocomplete=tel, type=tel, inputMode=tel) + name (autocomplete=name) + photo upload (multi, accept=image/*) + 152-ФЗ checkbox (required) + textarea коммент (optional, 240 chars)
   - States: default + filled + focus-visible (2px accent) + error inline (`#notifications` red border + helper text «что не так + что сделать») + disabled (на submit) + submitting (spinner на button) + success (целиком заменяется success-card)
   - Mobile-first: 1 column, label above field, input height ≥44pt, error focus auto-jump
   - Anti-TOV guard (`#tov`): запрещены sustained anti-TOV phrases — `dont`-список из brand-guide §13-14 (включая «упс» в error и шаблонные timing-формулы в helper)
   - 5-state flow: Idle → Filled → Submitting → Success → Error (sustained `#notifications:2387`)

4. **§Pricing table** (`#components` extension)
   - 3-col tier desktop (Базовый / Стандарт / Под ключ), highlighted middle col (`--c-bg-alt`)
   - Tabular-nums для цен (sustained `#type:1162` mono.tnum)
   - Mobile: collapse в accordion-cards (каждая строка = card с диаметром / параметром + цена + collapsible features list)
   - Tooltip на каждой feature row (info-icon, click-toggle на mobile)
   - States: default + hovered tier (subtle shadow lift) + recommended badge (live-style `#components:1282-1289`)
   - Touch target ≥44pt на CTA внутри каждого tier

#### High — без них template работает, но качество страдает (4 блока)

5. **§Process steps** (`#components` extension)
   - Horizontal numbered (desktop, 4-7 шагов в одну строку)
   - Vertical (mobile, номер 32px слева, h-s + 1-2 lines body)
   - Service-icon из `#icons:1314` line-art 1.5px stroke
   - Spacing scale (`#shape`): gap 24px desktop, 16px mobile
   - Reduce-motion guard: scroll-reveal animation 300ms ease-out, disabled при `prefers-reduced-motion`

6. **§Trust/credentials block** (`#components` extension; не в master-template flow, но invoked внутри hero / pricing / cta-banner)
   - 3-4 plate с документ-иконами + цифрой («СРО до 1 млрд», «Страховка 10 млн», «ГЛОНАСС»)
   - Anti-pattern guard `#dont`: рукопожатия / щиты / медали — запрещены
   - States: static + hover-zoom на сертификат (lightbox)

7. **§Mini-case teaser** (`#components` extension)
   - Layout: icon + before/after photo (split 50/50 horizontal slider или 2 photo + caption) + 1 metric (числовой) + link на `/kejsy/<slug>/`
   - Photo через fal.ai (case-photos lib, intake §fal.ai)
   - Empty state из `#notifications` если нет кейсов в районе/услуге («Кейсы скоро будут — пришлите фото, рассчитаем смету»)

8. **§FAQ accordion** (`#nav` reuse + extension)
   - Reuse mobile-mega-menu `<details>/<summary>` pattern (`#nav:2019`)
   - Chevron rotation 180° на open
   - Touch target ≥44pt на каждый summary
   - JSON-LD FAQPage уже в composer.ts (sustained US-3) — fe инжектит без re-implementation
   - Keyboard: Enter/Space toggle, Esc close, sustained `<details>` semantics

#### Medium — nice-to-have, не блокеры (4 блока)

9. **§Breadcrumbs** (`#nav` extension): visual + BreadcrumbList JSON-LD (composer.ts done). Mobile — collapsible если ≥4 уровня (T4 SD).

10. **§TL;DR / Summary block** (`#components` extension): card с border-left 4px primary, eyebrow «Кратко», 3-5 пунктов ul. Speakable атрибут на критичных пунктах для нейровыдачи.

11. **§District chips/grid** (`#icons` reuse + extension): pill с landmark-иконкой (`#icons:1417`) + название + расстояние «12 км». 3-6 chips в row.

12. **§Inline CTA banner** (`#site-chrome:3934+` variant): тот же markup pre-footer, другой spacing (margin: 80px 0 inline vs final pre-footer). Caregiver copy «Готовы убрать дерево? Пришлите фото — рассчитаем смету за 10 минут».

### JSON-LD inject — validate, not ad-hoc

`site/lib/seo/composer.ts` (sustained US-3 done) уже определяет `TemplateKind = 'T1_HUB' | 'T2_PILLAR' | 'T3_SUB' | 'T4_SD'` и `buildJsonLdForTemplate()`. Контракт schema-coverage:

- **T2_PILLAR**: 5 узлов (Organization, Service+AggregateRating, FAQPage, BreadcrumbList, +1 опц)
- **T3_SUB**: 4 узла (Organization, Service, FAQPage, BreadcrumbList)
- **T4_SD**: 6 узлов (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList, Person/Author)

**Iron rule:** master-template ОБЯЗАН использовать `buildJsonLdForTemplate(layer, ctx)` — никаких ad-hoc `<script type="application/ld+json">` в новых блоках. Validator `validateMasterTemplate()` проверяет наличие обязательных секций (faq, breadcrumbs) для composer'а.

### Customer journey — explicit 4-step с маппингом на блоки

```
Step 1 — Hero (Awareness)        → hero
Step 2 — Понимание (Comprehension)→ tldr → services-grid (T2) → pricing-block
Step 3 — Решение (Trust)          → calculator → process → mini-case → faq
Step 4 — Действие (Action)        → cta-banner → related-services / neighbor-districts → lead-form
```

Этот маппинг — guard для design review: если в C2.5 wave добавляется новая секция, она ОБЯЗАНА маппиться на один из 4 step. Иначе — отвергнуто (out-of-pattern).

### Mobile-first контракт

Per C1.b §5 (liwood mobile-broken: 440px > 375px viewport, font 12px, sticky-header перекрывает hero):

1. **Sticky bottom-CTA bar 56px** (mobile only, появляется при `scroll > 200px`):
   - Primary CTA «Photo→смета» (выделено accent)
   - Secondary CTA «Позвонить» (`tel:` link)
   - z-index 100, не перекрывает modal/sheet
2. **Hero compact mobile**: H1 + 2-3 строки lead + 1 primary CTA (photo-upload). 0 двойных телефонов в hero (они в sticky bottom).
3. **Pricing-table** на ≤640px → accordion-cards.
4. **Process-steps** vertical с номером 32px слева.
5. **Calculator** photo-upload занимает full-width.
6. **City-distributor / neighbor-districts** collapsible accordion на mobile.
7. **FAQ** аккордеон по умолчанию, ≥16px font (избегаем iOS auto-zoom), ≥44pt tap-area.
8. **LeadForm** 1-column, label above field, ≥44pt input height, semantic input types.
9. **Sticky-header** ≤56px (не 88 как у liwood).
10. **Reduced-motion** guard на все scroll-reveal animations.

Mobile breakpoints: **375 / 414 / 768 / 1024** (sustained brand-guide `#shape` spacing scale).

### Iron rule — brand-guide-first

> **Запрещено генерить ad-hoc UI в master-template.** Каждая секция должна либо использовать sustained `§brand-guide` компонент, либо проходить через C2.5 design wave (PR в `design-system/brand-guide.html` ДО старта вёрстки в `site/components/blocks/`). Если в С2.5 wave fe верстает блок без соответствующего §brand-guide — qa block PR на review.

Этот iron rule добавляется в:
- `team/design.md` skill-check (sustained design-system skill)
- `team/fe.md` PR-checklist
- `team/qa.md` review-checklist (block PR при отсутствии §brand-guide reference в commit message)

## Альтернативы (отклонены)

### Альтернатива A: Один template T2_PILLAR + token-replace для T3/T4
- **Pros**: минимум кода, один resolver
- **Cons**: T3 sub теряет «способы / методы» (liwood приём C1.b §1.3 — единственное реальное отличие T3 от T2 за пределами token); T4 SD теряет city-photo, locale-вступление, neighbor-districts uniqueness. Каннибализация в SERP за счёт identical контента.
- **Why not**: liwood T4 (`/himki/`) делает именно так и проигрывает в SERP — generic фотогалерея, дубль преимуществ T2, JSON-LD=0 (C1.b §1.4). Мы намеренно отличаемся per-layer для long-tail traffic.

### Альтернатива B: Полное копирование liwood 17-block dump
- **Pros**: SEO-плотность, full LSI coverage
- **Cons**: emotional curve ломается («навалено 17 блоков» — C1.b §1.2); читатель утомляется → bounce-rate растёт; mobile UX страдает (более длинная страница = больше horizontal scroll рисков); sustained brand-guide-first правило ломается («10 причин» + «comparison» = 2 новых блока требуют расширения).
- **Why not**: C1.b §0 рекомендует 10-12 секций vs 17. Мы зафиксировали 13 с 2 опциональными в T3 (mini-case + cta-banner) → 11 минимум на T3.

### Альтернатива C: Без `hidden` flag — каждый layer имеет свой template-файл
- **Pros**: явный, нет condition-логики
- **Cons**: 3 файла для maintenance, divergence-risk (фикс в T2_PILLAR забудут протащить в T3_SUB), Zod schema duplication.
- **Why not**: один master с per-layer matrix компактнее. Hidden ≠ unsupported; validator явно отбивает невалидные блоки.

### Альтернатива D: Block-level customization per документ (free-form)
- **Pros**: maximum flexibility для PO
- **Cons**: каждый из 191 URL может разъехаться. Customer journey теряется. Тестировать E2E невозможно (нет контракта).
- **Why not**: precisely то, что мы решаем этим ADR. Free-form — sustained состояние, мы из него выходим.

### Альтернатива E: Использовать Zod runtime для validator
- **Pros**: standard industry pattern, expressive schema (refine/transform)
- **Cons**: zod не sustained dependency в `site/package.json`. Pnpm hoisting не делает zod top-level reachable (находится только в `.pnpm/zod@4.3.6/`). Constraint intake'а: «Без `pnpm install`».
- **Why not**: реализуем validator через TS literal types + plain runtime validator function. Архитектурно эквивалентно (compile-time type safety + runtime check), без новой dep. Если в будущем PO решит добавить zod в `site/package.json` — миграция тривиальная (тип-однозначное mapping).

## Гарантии и инварианты

1. **Template-coverage** — для каждого `(layer, document)` validator проверяет:
   - Все `required` секции присутствуют в `blocks[]` (порядок не важен на стадии Payload — resolver упорядочит)
   - Ни одна `hidden` секция не присутствует
   - Order index возрастающий (resolver выводит секции в fixed order через `getOrderIndex(section, layer)`)

2. **Brand-guide-first** — каждая секция template имеет либо `brand_guide_anchor: '#components:1299'` (sustained ready), либо `requires_extension: 'C2.5 §Hero patterns'` (явный gap). Schema metadata содержит этот mapping для qa review tooling.

3. **JSON-LD coverage** — обязательное наличие `breadcrumbs` + `faq` секций гарантирует, что `composer.ts` соберёт BreadcrumbList + FAQPage. Validator fail если отсутствуют.

4. **Mobile-first** — каждая секция в C2.5 design wave спекается с mobile mockup ДО desktop (intake §AC mobile-first). Touch-target ≥44pt — guard в qa review.

5. **Single-CTA-per-screen** — в каждой секции максимум 1 primary CTA + 1 secondary (sustained ui-ux-pro-max `primary-action` rule). Hero / cta-banner / lead-form — каждая 1 primary CTA. Sticky bottom-CTA bar (mobile) — отдельный layer (z-index 100), не дублируется.

6. **0 ad-hoc UI** — fe в EPIC-D wave может верстать ТОЛЬКО блоки, для которых в brand-guide.html есть соответствующая § (либо C2.5 wave добавил, либо sustained ready). Нарушение — block PR.

## Последствия

### Положительные

- **UX cohesion** — все 191 URL имеют идентичную customer journey 4-step. Bounce-rate ожидается ниже liwood за счёт чёткой эмоциональной кривой.
- **Brand-guide compliance** — iron rule гарантирует, что 100% UI приходит из design-system. Anti-TOV / Anti-visual защищён hooks (`protect-immutable.sh`).
- **JSON-LD 100%** — sustained composer.ts × required breadcrumbs+faq = guaranteed schema coverage. Rich Results Test → 0 errors.
- **Mobile UX превосходит liwood** — sticky bottom-CTA + 16px body + 0 horizontal scroll + ≥44pt touch targets. Конкретный whitespace из C1.b §5.
- **Maintenance scalable** — добавить новый pillar = добавить 1 запись в Services + новые SD; template применится автоматом через resolver.
- **Code-review automation** — Payload validator + Zod-style schema позволяет CI-блок при попытке merge документа с invalid blocks[].

### Отрицательные / митигированные

- **Big design wave (C2.5)** — 11 brand-guide расширений (4 critical + 4 high + 3 medium) перед стартом EPIC-D. **Mitigation**: priority-driven rollout, critical 4 блока — gate для D1 launch, high — gate для D2, medium — допускаются позже без блокировки.
- **Schema migration risk (C3)** — sustained Services/Districts/B2BPages/Districts/Cases collections могут содержать blocks[] не соответствующие master-template. **Mitigation**: C4 wave запускает resolver `getBlocksForLayer` с feature flag `template_v2` per-URL, постепенный rollout 30/нед. Sustained данные не теряются.
- **Validator strictness vs Payload editor UX** — слишком жёсткий validator может блокировать обновления контента. **Mitigation**: validator работает на уровне `validateMasterTemplate(blocks, layer)` функции (не Payload field validation), вызывается из publish hook + CI. Editors могут drafts с любым набором; publish — только валидные.
- **fal.ai dependency для photos** — hero-photos / case-photos / district-photos требуют fal.ai генерации (intake §fal.ai). **Mitigation**: фолбек на picsum в dev / staging; production — design pre-generates batch перед EPIC-D launch.

### Риски

- **Risk:** brand-guide расширения (C2.5) могут разойтись с реальной вёрсткой EPIC-D — design рисует, fe реализует «по-своему». **Mitigation:** PR в `site/components/blocks/<NewBlock>.tsx` ОБЯЗАН ссылаться на `§brand-guide:line` в commit message; qa блочит без reference.
- **Risk:** customer journey 4-step может конфликтовать с будущими A/B-тестами (CRO команда захочет переставить блоки). **Mitigation:** новый ADR-NNNN с обновлением matrix; этот ADR явно фиксирует «reorder только через новый ADR».
- **Risk:** mobile-first контракт ужесточит дизайн — некоторые liwood-style плотные секции невозможны. **Mitigation:** именно то, что мы хотим (premium feel, anti-Bitrix-2018). Trade-off accepted.

## Реализация

### C2 (этот wave — спека)
- ADR-0021 ← этот файл
- `site/blocks/master-template.ts` — TS schema + validator factory (no zod dep — sustained constraint)
- Hand-off log в `specs/EPIC-SERVICE-PAGES-UX/intake.md`

### C2.5 (design wave — расширение brand-guide)
- 4 critical блока (Hero / Calculator UI / Lead form / Pricing) — gate для C3
- 4 high блока (Process / Trust / Mini-case / FAQ) — gate для C3 acceptance
- 4 medium блока (Breadcrumbs / TL;DR / District chips / Inline CTA) — допустимы после C3 launch
- Per-§ — отдельный mockup в `design-system/brand-guide.html` с live-preview (sustained pattern §nav / §notifications)

### C3 (Payload schema reference)
- Импорт `validateMasterTemplate` в `Services.ts` / `ServiceDistricts.ts` / `B2BPages.ts` / `Districts.ts` / `Cases.ts` publish hook
- Migration UP/DOWN/UP roundtrip: добавление validation hook не меняет схему БД — миграция тривиальная

### C4 (resolver — миграция данных)
- Новый файл `site/lib/blocks/resolver.ts` — `getBlocksForLayer(layer, currentBlocks, masterTemplate)` reorder + fills missing с placeholder
- Feature flag `template_v2` per-URL в Payload doc
- Rollout 30 URL/неделя (~7 недель для 191 URL)

### C5 (content-fill missing required)
- ~233 URL × ~3 missing avg × ~150 words ≈ 100k слов
- AI-draft через Claude Sonnet 4.6 + prompt caching (sustained skill `claude-api`)
- cw редактура (TOV-guard, sustained anti-TOV phrases из `#tov` §13-14)

### C6 (verify)
- `tests/e2e/master-template.spec.ts` — для каждого URL из inventory: assert все required секции присутствуют, hidden — нет, JSON-LD = expected coverage
- Lighthouse CI gate: a11y ≥ 95, performance ≥ 80, SEO = 100
- Click-path-audit (sustained skill) — все CTA / breadcrumbs / FAQ accordion / pricing tooltip / calculator photo-upload работают

## Сравнение с другими ADR

- **ADR-0019** (slug-resolver): этот ADR — **орthogonal** complement. ADR-0019 = «куда направить URL». ADR-0021 = «что показать когда направили».
- **ADR-0003** (blocks pattern): sustained Payload blocks pattern. ADR-0021 — **рестрикция** ADR-0003: «не любой набор блоков, а конкретный master-template».
- **ADR-0017** (homepage content source): sibling — homepage = T1 hub, отдельный template (4 узла JSON-LD). Не покрывается этим ADR (intake out-of-scope §«Главная страница — отдельный EPIC»).
- **ADR-0020** (shop sunset, landshaft = 5-й pillar): sustained — landshaft = T2_PILLAR layer. Master-template применяется к landshaft без отклонений.

## Status: accepted

Date: 2026-05-09
Signed-off:
- arch — author (architecture: schema design, validator factory, resolver hand-off)
- design — co-author (mapping table «section → §brand-guide», C2.5 wave plan)
- fe — co-author (Mobile-first контракт, sticky bottom-CTA, breakpoint matrix)
- po — operator-mandated approve (sustained autonomous mandate EPIC-SERVICE-PAGES-UX)
- operator — pending business apruv (через intake hand-off)

## Amendment 1 (2026-05-10): text-content section + D3 slug aliases

**Status:** accepted (sustained autonomous mandate, additive only — без reorder и без новых required).

**Context:** C5 wave A audit (vyvoz-musora pillar fill-missing) выявил 2 sustained блокера для master-template-gate:
1. T2 pillar `text-content` (sustained legacy long-form richText body) триггерил `UNKNOWN_BLOCK` → `valid=false` → publish-fail. Block sustained в `site/blocks/TextContent.ts` и присутствует в Services / B2BPages / ServiceDistricts blockReferences.
2. EPIC-SERVICE-PAGES-REDESIGN D3 wave A добавил блоки `PricingTable` (slug `pricing-table`) и `ProcessSteps` (slug `process-steps`), которые не совпадают с master-template ожиданием slug'ов `pricing-block` и `process` → drift между Payload blocks library и SLUG_TO_SECTION map.

**Решение:**
- **Section `text-content` (order=4, новая):** добавлена между `tldr` (3) и `services-grid` (5). Per-layer presence: T2_PILLAR=`optional`, T3_SUB=`optional`, T4_SD=`hidden`. Long-form richText body (`#components` brand-guide §). Journey step=2 (Comprehension). Не required нигде → sustained pillar/sub без text-content остаются валидными. Hidden на T4_SD — programmatic SD имеет leadParagraph + localFaq + landmarks для locale-content.
- **Slug aliases:** `pricing-table` → `pricing-block`, `process-steps` → `process` в SLUG_TO_SECTION. Sustained `pricing-block` и `process` slugs остаются (для C3 future blocks).
- **Total sections: 13 → 14.** Order monotonic 1..14 sustained. Reorder не было: text-content вставлен по journey-логике, остальные order'ы сдвинуты +1.

**Mapping table delta (только text-content):**

| # | Section            | T2_PILLAR | T3_SUB | T4_SD | brand_guide   | Обоснование                                               |
|---|--------------------|-----------|--------|-------|---------------|-----------------------------------------------------------|
| 04 | text-content      | optional  | optional | hidden | `#components` (ready) | Long-form SEO-копия pillar/sub. Sustained legacy unblock. |

**Альтернативы (rejected):**
- Alias `text-content` → `tldr` (PO recommendation в task brief): rejected — semantically не равны (tldr = 3-5 bullets scan-friendly; text-content = long-form richText). Mixing их в одну section ломает selfValidate (две secций с одним slug-mapping → SLUG_TO_SECTION orphan check).
- Сделать `UNKNOWN_BLOCK` warning-only (не ошибка): rejected — ослабляет gate и пропустит реально неизвестные блоки в prod. Лучше явно зарегистрировать sustained legacy block.
- Добавить `text-content` в blocks blacklist (запрет на T2 при publish): rejected — текущие prod-страницы используют его, миграция блокирует deploy.

**Consequences:**
- **Positive:** vyvoz-musora T2 pillar publish unblocked. C5 wave A backlog issue 1 закрыт. ServiceDistricts.blockReferences расширен — 7 ранее non-fillable required sections (pricing-block / process / breadcrumbs / tldr / calculator / neighbor-districts / related-services) теперь fillable через D3 blocks (PricingTable / ProcessSteps / etc) или sustained blocks (Tldr / Breadcrumbs / Calculator / etc).
- **Negative:** master-template growth 13 → 14 (минор; order — invariant сохранён).
- **Risks:** новый `text-content` order=4 сместил все order ≥5 на +1 — потребители `getOrderIndex(section)` получают новые числа. Sustained C4 resolver (`getBlocksForLayer`) использует order для sort'а — re-tested 59/59 passed.

**C5 wave A backlog item 3** (28/31 SD без miniCase + 7 localFaq<2) — НЕ покрыт этим Amendment. Это soft publish-gate (`requireGatesForPublish`) по content-fill, не code/schema. Остаётся в backlog для cw next wave.

## Hand-off log

```
2026-05-09 22:17 MSK · arch+design+fe → po: ADR-0021 final draft. master-template.ts schema written. 11 brand-guide расширений в C2.5 backlog (4 critical / 4 high / 3 medium). Operator apruv pending.
2026-05-10 09:15 MSK · arch+dev → po: Amendment 1 accepted. C5 wave A backlog issue 1+2 closed. text-content section добавлена (order=4, optional T2/T3, hidden T4); pricing-table + process-steps slug aliases в SLUG_TO_SECTION; ServiceDistricts.blockReferences расширен с 5 → 12 (Hero, Breadcrumbs, Tldr, TextContent, PricingTable, Calculator, ProcessSteps, Faq, CtaBanner, NeighborDistricts, RelatedServices, LeadForm). Tests: 59/59 passing (sustained 49 + 4 новых RED→GREEN). Type-check 0 errors. NO migration (Payload blocks JSON, ALTER TABLE не нужен). Issue 3 (28/31 SD без miniCase) — soft publish-gate, content backlog.
```
