---
type: case
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

# Wireframe: Case

## URL pattern
`/kejsy/[slug]/` — 12 кейсов к W14 (B2C+B2B mix, по 2 на pillar).
Эталон W3 — `/kejsy/snyali-pen-v-gostice/` (mock-case из существующего seed).

## Цель
**E-E-A-T** (Experience и доверие через социальное доказательство) + конверсия в лид через «закажите похожую услугу». Кейсы прокидываются в SD как `mini-case` блок (снимает publish-gate). Уникальный формат — фото до/после + конкретные факты (срок · бригада · объём · цена факт).

## Источники в плане
- План §«Page Templates → 6. Case».
- Sitemap §«Кейсы (/kejsy/)».
- В Stage 0 `before-after` блок-тип опционально (план §«Что НЕ делаем» / sa-spec AC-3.4).

## Hierarchy (desktop ASCII wireframe, max-width 1280)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Кейсы › Сняли пень в Гостице                |
+----------------------------------------------------------------------+
| [HERO — case variant]                                                |
|  eyebrow: «Кейс · Арбористика · Одинцово»                            |
|  H1 (40/48): «Сняли пень тополя 1.2 м в Гостице за 4 часа»           |
|  Sub: «Усадьба, корень в фундамент. Бригада 3 чел., автовышка,       |
|   18 400 ₽ за объект.»                                               |
|  facts-strip (mini-case data):                                       |
|  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                 |
|  │Срок  │ │Бриг.│ │Объём│ │Цена │                                   |
|  │4 ч   │ │3 чел│ │1.2 м│ │18 400│                                   |
|  └──────┘ └──────┘ └──────┘ └──────┘                                 |
|  hero image: фото объекта или «после» (large, 16:9)                  |
+----------------------------------------------------------------------+
| [BEFORE-AFTER опц., если seed имеет фото]                            |
|  H2: «До и после»                                                    |
|  +-------+ +-------+                                                 |
|  | BEFORE| | AFTER |  Двухсторонний slider или 2 фото side-by-side   |
|  | photo | | photo |  на mobile — стек-вертикаль                     |
|  +-------+ +-------+                                                 |
|  caption: «25 апреля 2026 · усадьба ул. Гостица, Одинцово»           |
+----------------------------------------------------------------------+
| [TEXT-CONTENT — case narrative]                                      |
|  H2: «Задача»                                                        |
|     ← что было, риск (корень в фундамент → трещина), почему срочно   |
|  H2: «Решение»                                                       |
|     ← бригада 3 чел, техника (автовышка, корчеватель), порядок       |
|       работ                                                          |
|  H2: «Результат»                                                     |
|     ← фактические числа, документы, что осталось делать заказчику    |
|  ~600-1000 слов, конкретика, технические детали                      |
+----------------------------------------------------------------------+
| [MINI-CASE data block — структурированные факты]                     |
|  H2: «В цифрах»                                                      |
|  +------------------+ +------------------+ +------------------+      |
|  | Объект           | | Бригада          | | Техника          |      |
|  | усадьба, тополь  | | 3 чел., 4 часа   | | автовышка 22 м   |      |
|  | 1.2 м, корень    | | бригадир Алек.   | | корчеватель      |      |
|  +------------------+ +------------------+ +------------------+      |
|  +------------------+ +------------------+ +------------------+      |
|  | Срок             | | Цена             | | Документы        |      |
|  | 4 часа от приезда| | 18 400 ₽         | | акт-приёмки      |      |
|  | до закрытия      | | за объект        | | + СРО            |      |
|  +------------------+ +------------------+ +------------------+      |
+----------------------------------------------------------------------+
| [CTA-BANNER]                                                         |
|  variant: dark                                                       |
|  H2: «Закажите похожую услугу»                                       |
|  «Пришлите фото — рассчитаем за 10 минут»                            |
|  [CTA primary] /foto-smeta/ →                                        |
+----------------------------------------------------------------------+
| [RELATED-SERVICES]                                                   |
|  H2: «Услуги в этом кейсе»                                           |
|  3 cards: /arboristika/spil-derevev/ ·                                |
|           /arboristika/udalenie-pnya/ ·                               |
|           /arboristika/odincovo/                                     |
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
|  facts-strip 2x2     |
|  grid (4 facts)      |
|  hero image 16:9     |
+----------------------+
| BEFORE-AFTER stacked |
| (BEFORE на top,      |
|  AFTER bottom)       |
+----------------------+
| TEXT-CONTENT 1col    |
|  H2 stack            |
+----------------------+
| MINI-CASE 1col       |
| (6 cards stacked     |
|  или 2-col grid)     |
+----------------------+
| CTA-BANNER           |
+----------------------+
| RELATED-SERVICES     |
| swipe 1.2            |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Кейсы → <Кейс> | BreadcrumbList JSON-LD |
| 2 | hero (case variant) | ✓ | H1 объект+район+результат + facts-strip + hero image | один `<h1>`, alt описательный, facts-strip — `<dl>` с `<dt>/<dd>` для семантики |
| 3 | before-after | ◯ | 2 фото или slider | image alt «до» и «после», slider — keyboard arrows + announce role="region" + aria-valuenow |
| 4 | text-content | ✓ | Задача / Решение / Результат narrative | heading hierarchy |
| 5 | mini-case (data) | ✓ | 6 фактов в карточках | `<dl>` или structured `<table>`; key/value pairs |
| 6 | cta-banner | ✓ | «Закажите похожую» → /foto-smeta/ | dark variant, контраст |
| 7 | related-services | ✓ | 3 cards к pillar/sub/SD | section aria-labelledby |

**Отличие от Pillar:** Hero включает `facts-strip` (mini-case на старте, не в конце), есть опциональный `before-after`, нет lead-form (заменяет на cta-banner), text-content — narrative-структура (Задача/Решение/Результат), не SEO-textbook.

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow** (нет detail кейсов, только общая галерея):
  - Каждый наш кейс — отдельный URL с narrative + facts-strip + before-after (опц.). У них — только thumbnails в gallery без narrative.

- **vs liwood.ru** (`/galereya/` 13 типов услуг — collection):
  - У них collection без individual case URL (галерея картинок); у нас отдельный URL за случай → JSON-LD `Article` + cross-link.
  - Cross-link в pillar/sub/SD (mini-case в SD blocks) — у liwood gallery silo.

- **vs cleaning-moscow.ru:** не имеют detail-кейсов в outcompete map.

- **vs promtehalp.ru** (`/work + /video`):
  - У них видео без структурированной narrative; у нас text-content + mini-case data (нейро-формат).

## Mobile considerations

- **Facts-strip 2×2 grid** в hero (не 1×4 horizontal — слишком узкие cells).
- **Before-after stacked vertically** на mobile (горизонтальный slider требует precision touch — анти-pattern). Если slider — `<input type="range">` с keyboard support.
- **Mini-case 6 facts:** 2-col grid на mobile (не 3-col).
- **Hero image lazy + width/height** для CLS<0.1.

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Facts-strip — `<dl><dt>Срок</dt><dd>4 часа</dd>...</dl>` (не divs)
- [ ] Before-after slider: keyboard arrows, `role="img"` с `aria-label="Сравнение до и после: ..."`, alternative text version (две alt-картинки)
- [ ] Hero image alt описательный (объект, район, действие)
- [ ] Mini-case data — `<dl>` или `<table>` с `<th scope>`
- [ ] Time `<time datetime="ISO">` для даты
- [ ] CTA-banner контраст
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion (slider auto-animation выключаем)
- [ ] Reflow 400%

## SEO annotations

- **H1:** результат в формуле «<Действие> <объект> в <Район> за <срок>». Конкретика — нейро-цитируемость.
- **H2:** «Задача / Решение / Результат» — стандартная narrative-структура (помогает Я.Нейро).
- **JSON-LD:** `Article` (subtype `Report`?) + `BreadcrumbList`. Опционально `Service` как ссылку.
- **Canonical:** self.
- **og/twitter:** image — фото «после» (визуально сильнее «до»).
- **Internal links:** related-services 3 → pillar/sub; mini-case data link на /raiony/<district>/.
- **Cases используются как `mini-case` блок в SD** — schema-связка через relationship в Payload.

## TOV constraints

- H1 — конкретные числа (объём, срок, район). НЕ «успешно выполнили проект».
- Narrative: «приехали», «сделали», «закрыли». НЕ «осуществили работы».
- Цены конкретно («18 400 ₽ за объект»). НЕ «разумная стоимость».
- Документы конкретно («акт-приёмки», «СРО»). НЕ «полный пакет документов».
- Фото alt: что на фото объективно, без «отличный результат».

## Эталонный URL для W3
`/kejsy/snyali-pen-v-gostice/` (mock-case из seed; в US-3 пакет 12 cases).

## Открытые вопросы для poseo / art

1. **Before-after блок в Stage 0 — обязательно или опционально?** Sa-spec AC-3.4: блок-тип зарегистрирован в `Cases.blocks` union, но опционально использован. Рекомендация ux: для эталона `/kejsy/snyali-pen-v-gostice/` — если есть фото в seed — добавляем; если нет — пропускаем (не делать постановочные фото для одного эталона).
2. **Facts-strip в hero (4 факта)** — 2-row или separate block ниже hero? Рекомендация ux: внутри hero (визуально один блок «герой-карточка», facts усиливают H1). Mini-case data блок — расширенная версия ниже text-content.
3. **CTA-banner vs lead-form inline в case:** Рекомендация ux: cta-banner (как blog) — case это «история», не услуга-страница; CR через переход на /foto-smeta/.
4. **Author на case** — добавлять meta «Автор: <Бригада/Оператор>» как в blog? Рекомендация ux: для B2B-кейсов — да (оператор как автор для E-E-A-T); для B2C — нет (сокращает signal-to-noise; case говорит сам за себя через facts).

## Art review · 2026-05-01

**Status:** approved (clean).

**Что apruv'нуто:**
- Hero с facts-strip (4 факта: Срок · Бригада · Объём · Цена) — отлично работает как «герой-карточка», facts-strip усиливает H1.
- Narrative Задача/Решение/Результат — стандартная structure, согласуется с §13 TOV (matter-of-fact).
- Before-after блок опционально — apruv (Stage 0 не делать постановочные фото для одного эталона; если seed имеет реальное «до» — добавляем).

**Visual guidance:**
- Facts-strip 4 cards в hero: aspect 1:1 desktop, 2×2 grid mobile. Padding 16px, `--radius-sm` 6px (компактнее cards), `<dl>` с `<dt>` mono 11px `--c-muted` + `<dd>` mono 18px `--c-ink`.
- Mini-case data block (6 cards): `--radius` 10px, padding 20px, `--c-card` background, `<dl>` semantic.
- Hero image «после» (визуально сильнее «до») — large 16:9, `--radius` 10px, lazy + dimensions.
- Before-after slider если есть: keyboard arrows, `<input type="range">` с `accent-color: var(--c-primary)`, divider 2px `--c-card`.

**fal-prompt direction:**
- Документальный стиль реального объекта (для эталона `/kejsy/snyali-pen-v-gostice/` — пень тополя в усадьбе после спила, без бригады в кадре или бригада со спины/в работе).
- Цена 18 400 ₽ в hero — JetBrains Mono inline (§6 mono-numbers).
- **Без эмодзи-декораторов** (§14 anti).
- Author meta: для B2B-кейса — operator со ссылкой на /avtory/<slug>/; для B2C — без author meta (apruv ux рекомендации).
