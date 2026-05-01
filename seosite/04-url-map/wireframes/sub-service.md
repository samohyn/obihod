---
type: sub-service
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

# Wireframe: Sub-Service

## URL pattern
`/[service]/[sub]/` — 33 страницы по 4 pillar (vyvoz-musora 9 sub, arboristika 12 sub, chistka-krysh 6 sub, demontazh 6 sub).
Эталон W3 — `/vyvoz-musora/staraya-mebel/` (4957 wsfreq, sub-cluster ADR-uМ-16).

## Цель
Глубокий SEO под sub-cluster (technology / process / materials) + конверсия. Воронка: pillar → sub-service → SD (programmatic). Sub-Service отличается от Pillar **узкой темой** (один тип объекта/материала, например «старая мебель») и **отсутствием services-grid** (это не индекс sub-категорий, это лист).

## Источники в плане
- План §«Page Templates → 2. Sub-Service» — таблица 8 блоков (6 обязательных).
- Cluster `seosite/03-clusters/vyvoz-musora.md` (sub `staraya-mebel` 4957 freq).
- Brand-guide §6/§7/§8/§13/§14.

## Hierarchy (desktop ASCII wireframe)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Вывоз мусора › Старая мебель                |
+----------------------------------------------------------------------+
| [HERO]   col1 60%                                col2 40%            |
|  eyebrow: «Вывоз мусора → Старая мебель»                             |
|  H1 (40/48): «Вывоз старой мебели —                                  |
|   12 800 ₽ за объект, приедем завтра»                                |
|  Sub (18/28): «Шкафы, диваны, кухни, кровати —                       |
|   разберём и заберём за один заезд»                                  |
|  [CTA primary] Получить смету по фото →                              |
|  [CTA ghost]   Позвонить                                             |
|  trust-row: фикс-цена · разбор включён ·                             |
|             8:00–22:00 МСК · 5 м³ ЗИЛ                                |
|                                                  [hero image fal.ai] |
+----------------------------------------------------------------------+
| [TLDR aside]                                                         |
|  «Если коротко: вывозим старую мебель из квартир, домов и офисов.    |
|   Разбираем на месте, грузим и увозим. 12 800 ₽ за объект до 5 м³.»  |
+----------------------------------------------------------------------+
| [TEXT-CONTENT col 2/3 + sticky TOC col 1/3]                          |
|  H2 «Что входит в вывоз мебели»                                      |
|  H2 «Как мы разбираем шкафы и диваны»                                |
|  H2 «Цена за объект — что считается объектом»                        |
|  H2 «Куда увозим (полигоны МО, акт-приёмки)»                         |
|  H2 «Когда не получится одним заездом»                               |
|  ~1500 слов, target keys из sub-cluster + LSI.                       |
|  ВНУТРИ text-content — таблица «материал → как везём → нужен ли      |
|  альпинизм/автовышка/доп. бригада» (нейро-формат, для Я.Нейро)       |
+----------------------------------------------------------------------+
| [LEAD-FORM]                                                          |
|  H2: «Получите смету за 10 минут»                                    |
|  serviceHint: «Старая мебель»                                        |
|  Поля: phone* · name · objects (textarea) · photos[] · consent       |
+----------------------------------------------------------------------+
| [MINI-CASE опц.]                                                     |
|  H2: «Кейсы по этому виду работ»                                     |
|  1-2 cards, фото cover + 4 факта + ссылка на /kejsy/<slug>/          |
+----------------------------------------------------------------------+
| [FAQ]                                                                |
|  H2: «Частые вопросы по вывозу старой мебели»                        |
|  ▸ Сколько стоит вывоз дивана / шкафа / кухни?                       |
|  ▸ Разберёте мебель сами?                                            |
|  ▸ Куда увозите? Дадите акт?                                         |
|  ▸ Можно ли заказать на сегодня?                                     |
|  generateFaqPageSchema=true                                          |
+----------------------------------------------------------------------+
| [RELATED-SERVICES]                                                   |
|  H2: «Соседние услуги в "Вывозе мусора"»                             |
|  3 cards: КГМ · Газель · Контейнер 8 м³                              |
|  (sub в том же pillar, не cross-pillar — это узкая воронка)          |
+----------------------------------------------------------------------+
| Footer (общий)                                                       |
+----------------------------------------------------------------------+
```

## Hierarchy (mobile ASCII wireframe)

```
+----------------------+
| Header sticky        |
+----------------------+
| Breadcrumbs truncate |
+----------------------+
| HERO stacked         |
|  H1 28/36            |
|  Sub                 |
|  hero image 16:9     |
|  CTA primary 100%    |
|  CTA ghost   100%    |
|  trust strip wrap    |
+----------------------+
| TLDR aside           |
+----------------------+
| TOC accordion        |
| (collapsed)          |
+----------------------+
| TEXT-CONTENT 1col    |
|  H2 stack, table     |
|  scroll-x на ном-х   |
+----------------------+
| LEAD-FORM            |
+----------------------+
| MINI-CASE 1col stack |
+----------------------+
| FAQ accordion        |
+----------------------+
| RELATED-SERVICES     |
| 1.2 swipe            |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Pillar → Sub | nav aria-label, BreadcrumbList JSON-LD |
| 2 | hero | ✓ | H1 sub-cluster + цена «12 800 ₽» + CTA | один `<h1>`, image alt описательный, CTA 44h focus-ring |
| 3 | tldr | ✓ | 2-3 предложения нейро-ответа | `<aside aria-label="Краткий ответ">` |
| 4 | text-content | ✓ | ~1500 слов, table material→tech, sticky TOC | heading hierarchy, table `<th scope="col">`, `<caption>` для таблицы |
| 5 | lead-form | ✓ | phone + name + objects + photos + consent | label/for, aria-required, role="alert" |
| 6 | mini-case | ◯ | 1-2 кейс-карточки | `<article>`, alt описывает объект |
| 7 | faq | ✓ | 4+ Q&A, FAQPage schema | aria-expanded/controls disclosure |
| 8 | related-services | ✓ | 3 карточки sub в этом pillar | `<section aria-labelledby>`, cards as `<a>` |

**Отличие от Pillar:** **нет `services-grid`** (нет необходимости — sub лист), **нет `cta-banner`** mid-page (короче страница, lead-form достаточно), **нет cross-pillar `related-services`** (related только внутри pillar для углубления воронки).

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow:** у них «вывоз старой мебели» — это часть общей `/`-страницы или /uslugi/<sub>/ без таблицы материал→технология. У нас — отдельный URL с таблицей, нейро-формат, лид-форма с фото-upload.
- **vs liwood.ru:** у них 29 sub-обрезка по породам (отличный паттерн глубины) — копируем формат на arboristika sub. Здесь (вывоз мусора) liwood не играет, но паттерн «sub лист с таблицей» применим везде.
- **vs cleaning-moscow.ru:** у них статьи на корне (антипаттерн), у нас строгая иерархия pillar/sub/SD. Sub имеет JSON-LD `Service` + `FAQPage` (у них только Article на статьях).

## Mobile considerations

- **Таблица «материал → технология»:** scroll-x с `overflow-x: auto`, `<caption>` для контекста, индикация «свайп →» при overflow.
- **Hero stacked + H1 28-32px** (короче чем pillar — sub-узкая тема).
- **Sticky bottom CTA** опционально (как pillar).
- **Touch targets ≥44px**, gap ≥8px.

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1 (normal) / 3:1 (large)
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Form labels for/id, aria-required
- [ ] Focus-ring 2px на всех интерактивах
- [ ] Image alt описательный
- [ ] Таблица: `<th scope="col">`, `<caption>` обязательно
- [ ] FAQ disclosure
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion respect
- [ ] Reflow 400% без h-scroll

## SEO annotations

- **H1:** содержит sub head-key («Вывоз старой мебели — 12 800 ₽ за объект, приедем завтра»). Точная цена в H1 — нейро-цитируемость.
- **H2 supplement keys:** «разбор шкафов», «вывоз дивана», «акт-приёмки», «полигон МО» — из sub-cluster.
- **JSON-LD Service:** на странице — Service с `provider`, `serviceType`, `areaServed`.
- **FAQPage** через faq-блок.
- **BreadcrumbList** через breadcrumbs-блок.
- **Canonical** = self.
- **internal links:** в text-content + related-services — на `/vyvoz-musora/staraya-mebel/<district>/` (8 SD), на `/vyvoz-musora/` (pillar), на 3 sibling sub.

## TOV constraints

- Hero H1 с конкретной ценой («12 800 ₽ за объект») — без «от X ₽».
- В text-content конкретика везде: «5 м³», «ЗИЛ», «8:00–22:00», «полигон МО».
- НЕ: «индивидуальный подход», «удобное время», «по выгодным ценам».
- TOV-критические: H1 sub, table-cells (materials → tech), FAQ answers (числа, сроки).

## Эталонный URL для W3
`/vyvoz-musora/staraya-mebel/` (4957 wsfreq, sub-cluster ADR-uМ-16).

## Открытые вопросы для poseo / art

1. **Mini-case в эталоне sub-Service:** есть ли свежий case «вывоз старой мебели»? Если нет — `mini-case` опционально (не блокирует publish-gate, gate активен только на SD). Рекомендация ux: для эталона W3 — добавить mock-case через seed (как `/kejsy/snyali-pen-v-gostice/`).
2. **Таблица «материал → технология»:** в text-content (Lexical) или новый sub-block? Рекомендация ux: внутри text-content (Lexical поддерживает table-node). Доп. блок не оправдан для одной таблицы на страницу.
3. **Цена в H1 — всегда или гибко?** «12 800 ₽» в H1 жёстко — отлично для нейро-цитируемости, но если оператор поднимает цену на этот sub — переписывание H1 у 33 sub. Рекомендация ux: H1 формула «<sub-action> — <price> за объект, <USP>», цена через field в Service collection (динамика без кодо-релиза).

## Art review · 2026-05-01

**Status:** approved (clean).

**Что apruv'нуто:**
- Block-композиция (8 блоков, нет services-grid и нет cta-banner — корректно отличается от Pillar).
- Таблица «материал → технология» в text-content — нейро-формат, согласуется с §13 TOV (конкретика, без бюрократии).
- Hero col1/col2 split **60/40** (как pillar).

**Visual guidance:**
- Hero H1 40/48 Golos Text 700 letter -0.02 — соответствует §6 Type шкале.
- Таблица — `--radius-sm` 6px (компактнее main cards), `<th>` `--c-bg-alt`, ячейки `--c-card`, scroll-x affordance c chevron-hint.
- Internal-link arrow в hero CTA — line-style §9, не FontAwesome (§14 «дефолтные FA-иконки» anti).
- Цена 12 800 ₽ в H1 — JetBrains Mono inline-token (§6 mono-numbers), не Golos.

**fal-prompt direction для hero:**
- Конкретный sub-объект (например для `staraya-mebel/` — старый шкаф/диван в коридоре дома, не studio-shot).
- Документальный стиль; **без stock-фото с рукавицами** (§14 anti).
- Без эмодзи-декораторов в alt-тексте.
