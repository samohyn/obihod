---
type: programmatic-sd
us: US-0
created: 2026-05-01
updated: 2026-05-01
sa: ux
status: draft
phase: spec
priority: P0
moscow: Must
art_apruv: approved
art_apruv_date: 2026-05-01
poseo_apruv: pending
---

# Wireframe: Programmatic SD (Service × District)

## URL pattern
`/[service]/[district]/` или `/[service]/[sub]/[district]/` — ~150 страниц через коллекцию `ServiceDistricts` (Wave 1: 8 districts × 4 pillar × несколько sub = ~150).
Эталон W3 — `/vyvoz-musora/odincovo/` (644 wsfreq Одинцово).

## Цель
Programmatic-индексация под локальные запросы («вывоз мусора Одинцово», «спил деревьев Красногорск») + локальная конверсия. **Главный анти-Scaled-Content-Abuse приём:** 50% shared base + 50% district-specific блоки. **Publish-gate активен:** 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq — без всех 5 элементов publish невозможен.

## Источники в плане
- План §«Page Templates → 3. Programmatic SD».
- План §«Critical risks → R1: Scaled Content Abuse» — митигация.
- `site/lib/admin/publish-gate.ts` — текущая логика gate.
- Brand-guide §6/§7/§8/§9 (district icons line 9), §13, §14.

## Hierarchy (desktop ASCII wireframe)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Вывоз мусора › Одинцово                     |
+----------------------------------------------------------------------+
| [HERO]   col1 60%                                col2 40%            |
|  eyebrow: «Вывоз мусора · Одинцово»                                  |
|  H1 (40/48): «Вывоз мусора в Одинцово —                              |
|   12 800 ₽ за объект, бригада за 24 ч»                               |
|  Sub: «Стройка, КГМ, мебель, садовый — по всему                      |
|   Одинцовскому округу. ~6 лет в районе.»                             |
|  [CTA primary] Смета по фото →                                       |
|  [CTA ghost]   Позвонить                                             |
|  trust-row: 24 ч выезд · ~6 лет · район-привязка                     |
|                                                  [hero image fal.ai  |
|                                                   с landmark         |
|                                                   Одинцово —         |
|                                                   доминанта района]  |
+----------------------------------------------------------------------+
| [TLDR aside]                                                         |
|  «Если коротко: вывозим мусор по Одинцово и Одинцовскому округу.     |
|   12 800 ₽ за объект до 5 м³, выезд за 24 часа, акт-приёмки и        |
|   полигон в зоне МО.»                                                |
+----------------------------------------------------------------------+
| [TEXT-CONTENT — 50% shared base + 50% district-specific]             |
|  H2 «Куда выезжаем по Одинцово»                                      |
|     ← district-specific: микрорайоны (Трёхгорка, Лесной                |
|       городок, Назарьево), время выезда от Одинцово до точки         |
|  H2 «Цена и что включено»                                            |
|     ← shared base: фикс-цена 12 800 ₽, что входит, акт-приёмки       |
|  H2 «Полигон МО — куда увозим из Одинцово»                           |
|     ← district-specific: ближайший полигон, ~километраж              |
|  H2 «Законодательство МО (152-ФЗ, КоАП Москва+МО)»                   |
|     ← shared base                                                    |
|  ~1200 слов, ≥300 слов в district-specific блоках                    |
|  Slot для уникальности: микрорайоны, время выезда, полигон           |
|  ближайший — все district-specific data из Districts collection      |
+----------------------------------------------------------------------+
| [MINI-CASE]   ← publish-gate REQUIRES                                |
|  H2: «Свежие объекты в Одинцово»                                     |
|  +----+ +----+   1-2 кейс-карточки в Одинцово/округе                 |
|  |IMG | |IMG |   3-4 факта (срок · бригада · объём · цена)            |
|  |fact| |fact|   ссылка → /kejsy/<slug>/                             |
|  +----+ +----+                                                       |
|  Если нет real case — обобщённый кейс с честным labelling            |
|  «обобщённый объект».                                                |
+----------------------------------------------------------------------+
| [FAQ — ≥2 localFaq]   ← publish-gate REQUIRES ≥2                     |
|  H2: «Частые вопросы по вывозу мусора в Одинцово»                    |
|  ▸ Какой полигон ближе всего к Одинцово?  ← localFaq                 |
|  ▸ Сколько идёт машина от Одинцово?       ← localFaq                 |
|  ▸ Можно ли заказать на сегодня?          ← shared                   |
|  ▸ Какие документы вы выдаёте?            ← shared                   |
|  generateFaqPageSchema=true                                          |
+----------------------------------------------------------------------+
| [LEAD-FORM ИЛИ CTA-BANNER]   ← publish-gate REQUIRES 1 contact       |
|  serviceHint: «Вывоз мусора», districtHint: «Одинцово» (preset)      |
|  H2: «Заявка по Одинцово»                                            |
|  Поля: phone* · objects · photos · consent                           |
+----------------------------------------------------------------------+
| [NEIGHBOR-DISTRICTS]                                                 |
|  H2: «Если вам в соседний район»                                     |
|  3 cards (Districts.relatedDistricts):                               |
|  Красногорск · Голицыно · Звенигород                                 |
|  → /vyvoz-musora/<neighbor-slug>/                                    |
+----------------------------------------------------------------------+
| Footer (общий)                                                       |
+----------------------------------------------------------------------+
```

## Hierarchy (mobile ASCII wireframe)

```
+----------------------+
| Header sticky        |
+----------------------+
| Breadcrumbs          |
+----------------------+
| HERO stacked         |
|  H1 28/36            |
|  Sub                 |
|  hero image (district|
|   landmark)          |
|  CTA primary 100%    |
|  CTA ghost 100%      |
+----------------------+
| TLDR aside           |
+----------------------+
| TOC accordion        |
+----------------------+
| TEXT-CONTENT 1col    |
| (district-specific   |
|  блок first после    |
|  H2 «Куда выезжаем», |
|  shared base после)  |
+----------------------+
| MINI-CASE swipe-row  |
+----------------------+
| FAQ accordion        |
| (localFaq первыми)   |
+----------------------+
| LEAD-FORM            |
+----------------------+
| NEIGHBOR-DISTRICTS   |
| swipe 1.2 cards      |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | publish-gate | Контент | A11y annotations |
|---|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | — | Главная → Pillar → District | BreadcrumbList JSON-LD |
| 2 | hero | ✓ | gate: 1 hero | H1 «<Услуга> в <Район>» + локальная цена + CTA + landmark image | один `<h1>`, image alt с district-name |
| 3 | tldr | ✓ | — | Локальный прямой ответ | aside aria-label |
| 4 | text-content | ✓ | gate: ≥300 слов | 50% shared + 50% district-specific (~1200 слов суммарно), TOC | heading hierarchy, lang ru |
| 5 | mini-case | ✓ | gate: ≥1 mini-case | Реальный или обобщённый кейс в районе с честным labelling | article, alt описывает объект |
| 6 | faq | ✓ | gate: ≥2 localFaq | 2+ localFaq + 2-3 shared, FAQPage schema | aria-expanded/controls |
| 7 | lead-form ИЛИ cta-banner | ✓ | gate: 1 contact | Lead-form с districtHint preset, ИЛИ cta-banner на якорь #lead-form | label/for, aria-required |
| 8 | neighbor-districts | ✓ | — | 3 ближайших района из `District.relatedDistricts` | section aria-labelledby, cards as `<a>` |

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow** (URL чемпион ~1387 URL, 137 гео):
  - У них district = только текст (Boilerplate) + форма; у нас — `mini-case` + `≥2 localFaq` + `neighbor-districts` + `tldr` + 50% district-specific text. **Глубина ×4** на каждом SD.
  - Они делают 1 услуга × 109 районов; мы — 4 услуги × 8 districts (Wave 1) → ~150 SD; никто из 17 не делает 4 услуги × N.
  - Hero image с landmark района (`districtHeroPrompt` fal.ai) — у них generic-фото или калькулятор.

- **vs liwood.ru** (контент-глубина чемпион):
  - У них 40 districts × 1 service (только спил), у нас 8 × 4 = 32 SD только в pillar арбо. Глубина выше: они дают только текст + калькулятор; мы — text + mini-case + localFaq + neighbor-districts.
  - URL короче на 1 сегмент: `/spil-derevev/odincovo/` vs у них `/services/udalenie-derevev/odincovo/`.

- **vs cleaning-moscow.ru:** не играют в programmatic district-уровне (только pillar/sub).

## Mobile considerations

- **Hero image с landmark** Одинцово (доминанта района — например Барвиха-парк / Усадьба Голицыно) — fal.ai `districtHeroPrompt` с lazy load + width/height для CLS<0.1.
- **TOC** показывает H2-якоря; localFaq и neighbor-districts — accordion на mobile.
- **Mini-case swipe-row** на mobile, snap-x.
- **Neighbor-districts** swipe-row.
- **Touch ≥44px**, gap ≥8px.
- **District-specific блоки** видны выше fold-line (под H2 «Куда выезжаем» — микрорайоны и время сразу после hero на mobile).

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Форма labels for/id; districtHint preset не блокирует — input editable
- [ ] Focus-ring везде
- [ ] Hero image alt: «Одинцово, район выезда бригады Обихода — landmark <name>»
- [ ] FAQ disclosure (localFaq + shared отличимы визуально и не отличимы для SR)
- [ ] Mini-case article + alt
- [ ] Neighbor-districts cards as `<a>` (link-card pattern, не nested links)
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion
- [ ] Reflow 400%

## SEO annotations

- **H1:** «<Услуга> в <Район>» — точная конструкция head-key («вывоз мусора одинцово», «спил деревьев красногорск»).
- **H2 supplement** в district-specific блоках: «полигон <ближайший>», «выезд от <Район>», микрорайоны (Trехгорка / Лесной городок / Назарьево).
- **JSON-LD:** `Service` + `LocalBusiness` (с `address.addressLocality: <Район>`, `geo: <coords>`) + `FAQPage` + `BreadcrumbList`.
- **Canonical:** self.
- **Internal links:** в neighbor-districts → 3 SD-страницы, в mini-case → /kejsy/, в text-content → /raiony/<district>/ (district hub).
- **Schema markup в lead-form:** ContactPoint с областью обслуживания.

## TOV constraints

- H1 — district-name точно, без «Москва+МО» обобщения.
- Hero sub: конкретика по району («~6 лет в районе», «по всему Одинцовскому округу»).
- НЕ: «работаем по всей Москве и области» (анти-локальность), «индивидуальный подход», «выезжаем оперативно». <!-- obihod:ok -->
- localFaq answers: точные landmark-метки, километраж, время.
- Mini-case с честным labelling если обобщённый: «обобщённый объект» — не выдумывать конкретный адрес.

## Эталонный URL для W3
`/vyvoz-musora/odincovo/` (Одинцово 644 wsfreq — единственный district с явным сигналом из 8 пилотных).

## Открытые вопросы для poseo / art

1. **Hero image с landmark района** — fal.ai `districtHeroPrompt` готов в US-0 Track C, но style apruv `art` обязателен (W2). Что если landmark не узнаётся? Рекомендация ux: для эталона W3 — Одинцово легко (Барвиха-парк), для остальных 7 — стилизация «бригада в работе на фоне района» с лёгкой landmark-намёткой. Не натуралистическое фото landmark — это privacy + бренд (Caregiver не «постановочные туристические фото»).
2. **Обобщённый mini-case на SD** — приемлемо для publish-gate, или каждый SD требует real case? Real case на 150 SD невозможен. Рекомендация ux: обобщённый OK с честным labelling «обобщённый объект» в caption + ссылка на /kejsy/ с реальными.
3. **Cta-banner vs lead-form** — какой по умолчанию для эталона `/vyvoz-musora/odincovo/`? Рекомендация ux: lead-form (выше CR на programmatic). Cta-banner — fallback если страница перегружена и lead-form требует scroll.
4. **District-specific блоки в Lexical (text-content) или separate block?** Если в Lexical — гибче для cw, но publish-gate проверяет через regex/heuristic. Рекомендация ux: в Lexical, gate проверяет H2 содержит district-slug в первых N блоках. (Решение требует apruv `tamd` или `be-panel` на implementation publish-gate.)

## Art review · 2026-05-01

**Status:** approved (clean).

**Что apruv'нуто:**
- 50% shared + 50% district-specific structure — соответствует §13 TOV (конкретика про район = matter-of-fact, не «индивидуальный подход»). <!-- obihod:ok -->
- Publish-gate состав (1 hero + 1 text ≥300 + 1 contact + mini-case + ≥2 localFaq) — выдерживает.
- Обобщённый mini-case с честным labelling «обобщённый объект» — apruv. **TOV-критично:** не выдумывать конкретные адреса/имена.

**Visual guidance:**
- Hero CTA primary («Смета по фото →») — стрелка inline в кнопке, не отдельная icon-cell.
- Trust-row 3 элемента (vs pillar 4) — короче для programmatic (район-сигнал важнее общих документов).
- Neighbor-districts cards: line-icon §9 districts (9 glyph'ов), радиус `--radius` 10px.

**fal-prompt direction для hero (R1 — landmark only):**
- **Только landmark района** (например для Одинцово — Усадьба Голицыно / Барвиха-парк), без бригады в кадре.
- Обоснование: гибрид «landmark + бригада» быстро деградирует в постановочный туристический shot, что ломает §14 «без stock-фото с рукавицами» и подрывает Caregiver-archetype (мы не «фото-репортаж», мы выезжающая бригада).
- Гео-сигнал в тексте (eyebrow «Вывоз мусора · Одинцово», H1 с district-name, alt-image «Одинцово, район выезда — landmark <name>»).
- Style: документальный, дневной свет, землистая палитра, минимум 25% sky/foliage. Без эко-зелени с листочком (§14 anti).
- `districtHeroPrompt` в `site/lib/fal/prompts.ts` — переделать в «landmark only» direction (Track C).
