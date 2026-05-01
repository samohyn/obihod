---
type: pillar-service
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

# Wireframe: Pillar Service

## URL pattern
`/[service]/` — 4 страницы: `/vyvoz-musora/`, `/arboristika/`, `/chistka-krysh/`, `/demontazh/`.
Эталон W3 — `/vyvoz-musora/` (102 789 wsfreq, самая денежная посадочная проекта).

## Цель
SEO-якорь под главные head-ключи pillar (вывоз мусора / арбористика / чистка крыш / демонтаж) **и** конверсия в лид через USP «фото→смета за 10 минут». 4-в-1 cross-sell в hero — главный отличительный приём от 17 узко-нишевых конкурентов.

## Источники в плане
- План §«Page Templates → 1. Pillar Service» — таблица из 10 блоков (7 обязательных + 3 опциональных).
- План §«Competitive Differentiation Strategy» + `seosite/01-competitors/differentiation-matrix.md`.
- Sitemap `seosite/04-url-map/sitemap-tree.md` § Outcompete priority v0.3.
- Brand-guide §6 Type, §7 Shape, §8 Components, §9 Icons (services line, 22 glyph'а), §13 TOV, §14 Don't.

## Hierarchy (desktop ASCII wireframe, max-width 1280, padding 80)

```
+----------------------------------------------------------------------+
| Site chrome: Header (logo + mega-menu Услуги/Районы/B2B/Блог + CTA  |
| «Получить смету»)                                                    |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Услуги › Вывоз мусора                       |
+----------------------------------------------------------------------+
|                                                                      |
| [HERO]   col1 60%                                col2 40%            |
|  eyebrow: «Вывоз мусора Москва и МО»                                 |
|  H1 (48/56 Golos Text 700, letter -0.02):                            |
|  «Вывоз мусора. Объект под ключ                                      |
|   за 10 минут после фото.»                                           |
|  Sub (18/28 Golos 400 ink-soft):                                     |
|  «Стройка, КГМ, мебель, садовый —      [hero image fal.ai           |
|   12 800 ₽ за объект, бригада           Nano Banana Pro,             |
|   приедет завтра.»                       documentary-style,          |
|                                          без рукопожатий]            |
|  [CTA primary 44h] Получить смету                                    |
|     по фото →                                                        |
|  [CTA ghost]    Позвонить: +7 (...)                                  |
|  trust-row: 4 strip · СРО · 152-ФЗ ·                                 |
|             ~6 лет · 8+ районов МО                                   |
+----------------------------------------------------------------------+
| [TLDR <aside aria-label="Краткий ответ">]                            |
|  «Если коротко» / «TL;DR»                                            |
|  «Вывоз любого мусора по Москве и области от 12 800 ₽ за             |
|  объект. Стройка, мебель, КГМ, садовый. Приедем завтра,              |
|  смета — за 10 минут по фото.»                                       |
+----------------------------------------------------------------------+
| [SERVICES-GRID]                                                      |
|  H2: «Что вывозим»                                                   |
|  +----+ +----+ +----+ +----+   ↓ row 2                               |
|  |Стр-| |КГМ | |Меб-| |Газ-|                                         |
|  |мус.| |    | |ель | |ель |                                         |
|  +----+ +----+ +----+ +----+                                         |
|  +----+ +----+ +----+ +----+                                         |
|  |Сад.| |Конт| |Поруб| |УК/ |                                        |
|  |мус.| |8/20| |. ост.| |ТСЖ|                                        |
|  +----+ +----+ +----+ +----+                                         |
|  Каждая карточка: icon (services line §9) + H3 + 1-line + цена-якорь |
|  (mono, tabular-nums) + arrow → /vyvoz-musora/<sub>/                 |
+----------------------------------------------------------------------+
| [TEXT-CONTENT col 2/3 + sticky TOC col 1/3]                          |
|  H2: «Как мы работаем» · «Что входит в цену» ·                       |
|       «Сроки и регламент» · «Документы и СРО»                        |
|  ≥800 слов, target keys из cluster vyvoz-musora.md, конкретные       |
|  цифры (12 800 ₽, ~6 лет, 8 районов, 5 м³ ЗИЛ).                      |
|  Sticky TOC desktop ≥1024 (sidebar 240px), на mobile сворачивается   |
|  в accordion-toc после hero.                                         |
+----------------------------------------------------------------------+
| [LEAD-FORM]                                                          |
|  H2: «Получите смету за 10 минут»                                    |
|  Поля: Телефон* (tel inputmode) · Имя · Что вывозим (select)         |
|  · Фото объекта (multi-upload, accessible)                           |
|  serviceHint: «Вывоз мусора» (заполнено)                             |
|  consent-text: 152-ФЗ check + ссылка на /policy/                     |
|  [CTA Получить смету →] (44h, focus-ring 2px accent)                 |
|  helper: «Перезвоним в 8:00–22:00 МСК · смета за 10 минут»           |
+----------------------------------------------------------------------+
| [MINI-CASE опц.]                                                     |
|  H2: «Свежие объекты»                                                |
|  +----+ +----+   2-3 mini-case с фото cover, 3-4 факта               |
|  |IMG | |IMG |   (срок · бригада · объём · цена), ссылка             |
|  |fact| |fact|   → /kejsy/<slug>/                                    |
|  +----+ +----+                                                       |
+----------------------------------------------------------------------+
| [CTA-BANNER]                                                         |
|  variant: dark (--c-ink), accent: warning                            |
|  H2: «Закажите выезд бригады»                                        |
|  «Москва и МО · 8:00–22:00 МСК · смета за 10 минут»                  |
|  [CTA primary] Оставить заявку → (anchor #lead-form)                 |
+----------------------------------------------------------------------+
| [FAQ]                                                                |
|  H2: «Частые вопросы по вывозу мусора»                               |
|  ▸ Сколько стоит вывоз мусора в Подмосковье?                         |
|  ▸ Можно ли заказать вывоз сегодня?                                  |
|  ▸ Какие документы вы выдаёте?                                       |
|  ▸ Что если мусор не входит в один заезд?                            |
|  ▸ Кто платит за полигон?                                            |
|  generateFaqPageSchema=true → JSON-LD FAQPage                        |
+----------------------------------------------------------------------+
| [RELATED-SERVICES опц.]                                              |
|  H2: «Также берём на себя»                                           |
|  3 cards → /arboristika/, /chistka-krysh/, /demontazh/               |
|  (4-в-1 cross-sell, главный winning angle)                           |
+----------------------------------------------------------------------+
| Footer (общий)                                                       |
+----------------------------------------------------------------------+
```

## Hierarchy (mobile ASCII wireframe, ≤640px, padding 20)

```
+----------------------+
| Header sticky        |
| logo · burger        |
+----------------------+
| Breadcrumbs (truncate|
| Главная › … › Pillar)|
+----------------------+
| HERO stacked         |
|  eyebrow             |
|  H1 (32/40, -0.02)   |
|  Sub (16/24)         |
|  hero image (16:9    |
|  aspect-ratio фикс,  |
|  CLS<0.1)            |
|  CTA primary 100% 48h|
|  CTA ghost  100% 48h |
|  trust-strip wrap    |
+----------------------+
| TLDR aside           |
+----------------------+
| SERVICES-GRID        |
|  swipe-row 1.2 cards |
|  visible (chevron    |
|  hint), snap-x       |
|  fallback: 2-col     |
+----------------------+
| TOC accordion        |
| (collapsed default)  |
+----------------------+
| TEXT-CONTENT 1 col   |
|  H2 stack            |
|  body 16/26 line-len |
|  35-60 ch            |
+----------------------+
| LEAD-FORM            |
|  inputs full-w 48h   |
|  phone keyboard tel  |
|  upload tap-friendly |
|  CTA full-w 48h      |
+----------------------+
| MINI-CASE swipe-row  |
+----------------------+
| CTA-BANNER stacked   |
+----------------------+
| FAQ accordion        |
+----------------------+
| RELATED-SERVICES col |
| 1.2 swipe            |
+----------------------+
| Footer collapsed acc |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Услуги → <Pillar> | `<nav aria-label="Хлебные крошки">`, `aria-current="page"` на последнем; BreadcrumbList JSON-LD |
| 2 | hero | ✓ | H1 + sub-USP + 2 CTA + hero image | `<h1>` ровно один; CTA — `<a class="btn btn-primary">` с focus-visible 2px accent; image `<img alt="...">` (descriptive) или `role="presentation"` если decorative; min touch target 44px |
| 3 | tldr | ✓ | 2-3 предложения | `<aside aria-label="Краткий ответ">`, eyebrow «Если коротко» |
| 4 | services-grid | ✓ | 4-9 sub-services карточек | `<section aria-labelledby="services-grid-h2">`; каждая карточка — `<a>` обернутая, иконка `aria-hidden="true"` (декоративная, текст рядом), title H3, focus-ring; touch 44px+, gap ≥12px |
| 5 | text-content | ✓ | ≥800 слов, H2/H3 hierarchy, sticky TOC | Heading hierarchy строгая; TOC — `<nav aria-label="Содержание">`; lang="ru" |
| 6 | lead-form | ✓ | phone + name + service + photo + consent | `<form>` с `aria-labelledby`; `<label for="...">` явный; `aria-required="true"` + `aria-invalid` при ошибке; ошибка `role="alert"` + `aria-live="polite"`; success `aria-live="polite"`; focus first invalid |
| 7 | mini-case | ◯ | 2-3 cards | `<article>` per card; image alt описывающий объект |
| 8 | cta-banner | ✓ | H2 + sub + CTA | dark variant — контраст ≥4.5:1; CTA 44h |
| 9 | faq | ✓ | 5+ Q&A, FAQPage schema | disclosure pattern: button `aria-expanded` + `aria-controls`; H2 `<h2 id="faq-...">`; нативный `<details>`/`<summary>` ИЛИ кастом с aria |
| 10 | related-services | ◯ | 3 cards cross-pillar | `<section aria-labelledby>`; cards — `<a>` обернутая |

## Winning angle vs топ-3 конкурентов

См. `seosite/01-competitors/differentiation-matrix.md` (топ-3 baseline: musor.moscow + liwood.ru + cleaning-moscow.ru).

- **vs musor.moscow** (URL-объём чемпион ~1387 URL, 137 гео):
  - Hero «4-в-1» в strip + блок `related-services` cross-pillar — у них только узкая ниша «вывоз мусора» (0/17 делает 4-в-1).
  - `lead-form` с фото-upload (USP «фото→смета за 10 минут») — у них калькулятор-выпадайки, нет фото-flow.
  - `tldr` нейро-формат (Я.Нейро / Алиса / Perplexity цитируемость) — у них статьи без TLDR.

- **vs liwood.ru** (контент-глубина чемпион, 85 blog + 29 sub-обрезка по породам):
  - `services-grid` — 8 sub-карточек на pillar (vs у liwood pillar — flat-страница без sub-grid). 4-в-1 cross-pillar блок — у них только арбо, нет вывоза мусора.
  - `mini-case` блок и `cta-banner` mid-page — у них онлайн-консультация + калькулятор, но нет mid-page case-блока.
  - `tldr` блок системно — у них блог глубже, но pillar-страница без нейро-формата.

- **vs cleaning-moscow.ru** (E-E-A-T чемпион, отдельные авторы):
  - Pillar `text-content` ссылается на `/avtory/brigada-vyvoza-obihoda/` (компания + оператор с VK/TG sameAs) — у них авторы есть, но без cross-domain якорей.
  - Конкретные цифры в hero и text-content («12 800 ₽ за объект», «~6 лет») — у них «индивидуальный подход» (анти-TOV §14).

## Mobile considerations

- **Hero stacked:** image после CTA (не до) — H1 первый экран mobile, image под CTA для скорости first paint.
- **Services-grid:** swipe-row 1.2 cards visible (peek-affordance), snap-x mandatory, chevron-hint правый край; fallback на 2-col grid если CSS scroll-snap не поддержан.
- **Text-content TOC:** accordion после hero (collapsed by default), open icon `▾` rotate.
- **Touch targets:** все CTA, faq-summary, services-grid card, breadcrumbs links ≥ 44×44px (CSS `min-height: 44px` + padding).
- **Inter-target gap ≥8px** во всех блоках.
- **Lead-form mobile:** input min-height 48px, type="tel"/`inputmode="numeric"` для phone, `accept="image/*"` для upload (нативный file picker).
- **Sticky CTA на mobile** (опционально): «Получить смету» bottom sticky после scroll за hero (z-index 100, safe-area-inset-bottom respect, dismiss-on-scroll-up).

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст hero ink-strong на cream-bg ≥ 4.5:1 (нормальный текст), CTA primary white-on-primary ≥ 4.5:1
- [ ] Все интерактивные элементы клавиатурно-доступны (Tab order = visual order)
- [ ] `<a href="#main">` skip-link первый focusable element, скрыт `.sr-only` до focus
- [ ] Heading hierarchy: 1 H1 (hero) → H2 (services-grid, text-content, lead-form, mini-case, cta-banner, faq, related-services) → H3 без пропусков
- [ ] Form labels связаны с input через `for/id`; placeholder ≠ label
- [ ] Focus-ring видим (2px accent outline-offset 2px) на всех CTA, links, inputs
- [ ] aria-labels на иконках без текста (services-grid card icons — `aria-hidden="true"` так как текст рядом)
- [ ] FAQ: `<button aria-expanded aria-controls>` или `<details><summary>`
- [ ] Hero image: alt описательный («бригада Обихода грузит контейнер строительного мусора, район Одинцово»), не «Image of...» (избыточно — SR озвучивает «изображение»)
- [ ] Min target size 44×44px (WCAG 2.2 SC 2.5.8)
- [ ] Reduced-motion: hero image без auto-parallax, CTA hover-scale ≤1.02 если `prefers-reduced-motion: reduce`
- [ ] Lead-form ошибки: `role="alert"` + `aria-live="polite"`, focus first invalid после submit
- [ ] Lang attribute: `<html lang="ru">`
- [ ] Reflow до 400% zoom без horizontal scroll (line-length 35-60 ch mobile)

## SEO annotations (для seo-tech)

- **H1 в hero:** содержит target head-key точно («Вывоз мусора. Объект под ключ за 10 минут после фото.» — head «вывоз мусора» + USP). Density head-key в text-content ≤ 2%.
- **H2 в text-content:** supplement keys из cluster (vyvoz-musora.md): «вывоз строительного мусора», «вывоз мусора с грузчиками», «контейнер 8 м³», и т.п. — по cluster wsfreq.
- **FAQ-блок:** `generateFaqPageSchema: true` → JSON-LD `FAQPage` с `mainEntity[].acceptedAnswer.text`.
- **Breadcrumbs:** JSON-LD `BreadcrumbList` через `site/lib/seo/jsonld.ts`.
- **Service schema:** на всю страницу — `Service` с `provider: Organization (Обиход)`, `areaServed: Москва+МО`, `serviceType: «Вывоз мусора»`.
- **Canonical:** `<link rel="canonical" href="https://obikhod.ru/vyvoz-musora/">`, без trailing-slash вариантов.
- **og:title / og:description / og:image** обязательны (image — hero fal.ai 1200×630).
- **TLDR блок:** `<aside aria-label="Краткий ответ">` — нейро-цитируемость (Я.Нейро / Алиса / Perplexity).

## TOV constraints (brand-guide §13/§14)

**Использовать (§13 Caregiver+Ruler, immutable):**
- «обиход», «хозяйство», «объект», «порядок», «сделаем», «приедем», «закроем»
- Конкретные цифры: «12 800 ₽ за объект», «~6 лет», «8 районов МО», «5 м³», «8:00–22:00 МСК», «10 минут».
- Документы: «СРО», «152-ФЗ», «полигон МО», «акт-приёмки».

**НЕ использовать (§14 Don't, anti-TOV):**
- «услуги населению», «индивидуальный подход», «гарантируем качество», «мы дорожим репутацией»
- «от 1 000 ₽», «от X ₽» (без конкретики) — заменяем точной ценой
- «в кратчайшие сроки», «как можно скорее», «в удобное для вас время»
- «твёрдые коммунальные отходы», «древесно-кустарниковая растительность» (B2C — заменяем «мусор», «деревья»)
- «звоните узнавайте», «обращайтесь», «оставьте заявку — мы свяжемся»
- Capslock H1, восклицательные знаки в hero, эмодзи-декораторы (🌳).

**TOV-критические места wireframe:**
1. Hero H1 — без анти-TOV, точная цифра в sub.
2. CTA labels — глагол + объект («Получить смету по фото →», не «Узнать больше»).
3. Lead-form helper — конкретное время («8:00–22:00 МСК · смета за 10 минут»).
4. CTA-banner — без «свяжемся».
5. FAQ answers — конкретные цифры и сроки.

## Эталонный URL для W3
`/vyvoz-musora/` (главный денежный pillar, 102 789 wsfreq на head-ключе).

## Открытые вопросы для poseo / art

1. **Sticky bottom CTA на mobile** — делаем в Stage 0 эталоне или backlog? (UX win для CR, но отвлечение от content; эталон без sticky оставляет place чистым). Рекомендация ux: в Stage 0 без sticky, добавить в US-1 после A/B на /vyvoz-musora/odincovo/.
2. **TOC sticky desktop** — реализовать в эталоне или fe-site может отложить в US-1? Без TOC pillar читается, но scroll длинный (3000 слов в US-1). Рекомендация ux: в эталоне обязательно (TOC из 4-6 H2-якорей, кода ~50 строк).
3. **Hero col1/col2 split 60/40 vs 50/50** — у liwood 50/50, у musor.moscow no-image. Рекомендация ux: 60/40 для текстового приоритета, image — supporting.
4. **Trust-row под CTA в hero** — какие 4 элемента? (СРО · 152-ФЗ · ~6 лет · 8 районов МО) — apruv `art` нужен на формулировки.

## Art review · 2026-05-01

**Status:** approved (clean).

**Что apruv'нуто:**
- Block-композиция, hierarchy, mobile/desktop split, A11y checklist — все OK.
- Trust-row 4 элемента «4-в-1 strip · СРО · 152-ФЗ · ~6 лет · 8+ районов МО» — TOV §13 выдерживает (конкретика, документы, годы).
- Hero col1/col2 split **60/40** (текстовый приоритет; 50/50 у liwood — паттерн конкурента, не наш).
- TOC sticky desktop — обязательно (как ux рекомендовал).

**Решения по открытым вопросам ux:**
- **Sticky bottom CTA mobile** — W11+ backlog (не Stage 0). Эталон без sticky оставляет place чистым; sticky без A/B baseline — слепое решение.
- **Hero col1/col2 split** — 60/40 (apruv).

**Visual guidance:**
- Hero CTA primary: `--c-primary` #2d5a3d, hover `--c-primary-ink` #1f3f2b (см. §14 «не неоновые ховеры»).
- CTA ghost: text `--c-primary`, border 1px `--c-line`, focus-ring 2px `--c-accent`.
- Card radius — `--radius` 10px (services-grid + mini-case + cta-banner).
- Иконки services-grid — services line из §9 (22 glyph'а), `aria-hidden="true"`, цвет `--c-ink-soft`.
- Mono-numbers (12 800 ₽, 5 м³) — JetBrains Mono, tabular-nums (§6).

**fal-prompt direction для hero:**
- Документальный стиль (§14 «без stock с рукавицами», без «catalog-shot на белом»).
- Бригада в работе на реальном объекте — **без рукопожатий** (§14 anti).
- Палитра кадра — землистая, без эко-зелени-с-листочком (§14 anti).
- `sa-panel` / fal-prompt validation — в Track C по `pillarHeroPrompt`.
