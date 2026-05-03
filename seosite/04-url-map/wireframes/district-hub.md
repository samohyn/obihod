---
type: district-hub
us: US-0
created: 2026-05-01
updated: 2026-05-01
sa: ux
status: draft
phase: spec
priority: P0
moscow: Must
art_apruv: approved-with-changes
art_apruv_date: 2026-05-01
poseo_apruv: pending
---

# Wireframe: District Hub

## URL pattern
`/raiony/[district]/` — 8 страниц (Одинцово, Красногорск, Мытищи, Раменское — priority-A; Химки, Пушкино, Истра, Жуковский — priority-B).
Эталон W3 — `/raiony/odincovo/`.

## Цель
Гео-pillar района + LocalBusiness schema-якорь + cross-link на 4 услуги в районе. Закрывает запрос «<обиход / подрядчик> в <Районе>» (комплексный, не привязан к одной услуге). Никто из 17 конкурентов так не делает (musor.moscow — service-led, liwood — district × 1 service). Это **уникальный winning angle URL-структуры**.

## Источники в плане
- План §«Page Templates → 4. District Hub».
- Sitemap §«Гео-pillar /raiony/».
- District icons brand-guide §9 (line 9 glyph'ов: 8 районов МО + Москва).

## Hierarchy (desktop ASCII wireframe)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Районы › Одинцово                           |
+----------------------------------------------------------------------+
| [HERO]   col1 60%                                col2 40%            |
|  eyebrow: «Район · Одинцово»                                         |
|  H1 (44/52): «Обиход в Одинцово —                                    |
|   мусор, деревья, крыши, демонтаж»                                   |
|  Sub (18/28): «4 услуги по Одинцовскому округу                       |
|   с одной бригадой. ~6 лет в районе, выезд за 24 часа.»              |
|  [CTA primary] Смета по фото →                                       |
|  [CTA ghost]   Позвонить                                             |
|  trust-row: 4 strip · ~6 лет · 24 ч выезд ·                          |
|             полигон МО                                               |
|                                                  [hero image fal.ai  |
|                                                   с landmark         |
|                                                   Одинцово +         |
|                                                   бригада в работе]  |
+----------------------------------------------------------------------+
| [TLDR aside]                                                         |
|  «Если коротко: в Одинцово и Одинцовском округе делаем 4 работы      |
|   под ключ — вывоз мусора, спил/арбо, чистку крыш, демонтаж.         |
|   Бригада за 24 часа, акт-приёмки, полигон в зоне МО.»               |
+----------------------------------------------------------------------+
| [SERVICES-GRID — 4 pillar в районе]                                  |
|  H2: «Что делаем в Одинцово»                                         |
|  +-----------+ +-----------+                                          |
|  | icon-vyvoz| | icon-arbo |                                          |
|  | Вывоз     | | Арбо-     |                                          |
|  | мусора    | | ристика   |                                          |
|  | от 12 800 | | от 12 800 |                                          |
|  | → /vyvoz- | | → /arbor- |                                          |
|  | musora/   | | istika/   |                                          |
|  | odincovo/ | | odincovo/ |                                          |
|  +-----------+ +-----------+                                          |
|  +-----------+ +-----------+                                          |
|  | icon-roof | | icon-demo |                                          |
|  | Чистка    | | Демонтаж  |                                          |
|  | крыш      | |           |                                          |
|  | → /chist- | | → /demon- |                                          |
|  | ka-krysh/ | | tazh/     |                                          |
|  | odincovo/ | | odincovo/ |                                          |
|  +-----------+ +-----------+                                          |
|  Каждая карточка — link к SD `/<service>/odincovo/`                  |
+----------------------------------------------------------------------+
| [TEXT-CONTENT col 2/3 + sticky TOC col 1/3]                          |
|  H2 «Локальная команда в Одинцово»                                   |
|     ← бригадир, опыт, парк техники в районе                          |
|  H2 «Особенности района — что мы знаем»                              |
|     ← полигоны (ближайший, км), правила СНТ Одинцовский округ,       |
|       сезонные паттерны (бурелом, листва, сосульки)                  |
|  H2 «Документы и СРО»                                                |
|     ← shared base                                                    |
|  ~1500 слов, district-specific ≥40%                                  |
+----------------------------------------------------------------------+
| [MINI-CASE опц.]                                                     |
|  H2: «Кейсы в Одинцово»                                              |
|  2-3 cards (фото · 4 факта · ссылка)                                 |
+----------------------------------------------------------------------+
| [LEAD-FORM]                                                          |
|  H2: «Заявка из Одинцово»                                            |
|  districtHint: «Одинцово» (preset)                                   |
|  serviceHint: select из 4 pillar (default — empty, юзер выбирает)    |
|  Поля: phone* · service · objects · photos · consent                 |
+----------------------------------------------------------------------+
| [NEIGHBOR-DISTRICTS]                                                 |
|  H2: «Если вам в соседний район»                                     |
|  3 cards: Красногорск · Голицыно · Звенигород                        |
|  → /raiony/<neighbor-slug>/                                          |
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
|  hero image          |
|  CTA primary/ghost   |
+----------------------+
| TLDR aside           |
+----------------------+
| SERVICES-GRID 2x2    |
| (4 pillar tiles)     |
+----------------------+
| TOC accordion        |
+----------------------+
| TEXT-CONTENT 1col    |
+----------------------+
| MINI-CASE swipe      |
+----------------------+
| LEAD-FORM            |
+----------------------+
| NEIGHBOR-DISTRICTS   |
| swipe 1.2            |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Районы → <Район> | BreadcrumbList JSON-LD |
| 2 | hero | ✓ | H1 «Обиход в <Район>» + 4-в-1 USP + CTA + landmark image | один `<h1>`, image alt district-name |
| 3 | tldr | ✓ | 4-в-1 в районе, нейро-формат | aside aria-label |
| 4 | services-grid | ✓ | **4 pillar** карточки (специальный вариант: только 4 + крупнее) с district-link | section aria-labelledby, cards as `<a>` к SD |
| 5 | text-content | ✓ | Локальная команда + район-specific + СРО | heading hierarchy |
| 6 | mini-case | ◯ | 2-3 кейс-карточки в районе | article, alt |
| 7 | lead-form | ✓ | districtHint preset, serviceHint select | label/for, aria-required, role="alert" |
| 8 | neighbor-districts | ✓ | 3 cards к /raiony/<neighbor>/ (НЕ к SD) | section aria-labelledby |

**Отличие от Pillar-Service:** `services-grid` показывает **4 pillar** (не 9 sub под одним pillar) — это «карточка района», hub. **Отличие от SD:** `services-grid` 4 pillar (vs SD: нет grid, neighbor-districts ведёт к SD того же service); district hub — сборная.

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow:** у них есть `/rajony-obsluzhivanija/<район>/` с 1 услугой; нашa District Hub = 4 услуги в одном районе через `services-grid` — **0/17 не делает**.
- **vs liwood.ru:** у них district = только spil-derev (один сервис). У нас district hub агрегирует 4 услуги; voronka шире.
- **vs cleaning-moscow.ru:** не играют в district-структуре.

**Уникальный winning angle:** «4 услуги в одном районе с одной бригадой» — комплексный гео-якорь, прямое отражение «4-в-1» позиционирования бренда.

## Mobile considerations

- **Services-grid 2×2:** 4 крупные карточки (по 1 pillar), не swipe-row а grid. Touch target весь tile (≥120×120px), не только текст.
- **Hero landmark image:** lazy load (below first viewport если LCP — H1+sub).
- **Neighbor-districts:** swipe-row 1.2.

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Services-grid card — link-card pattern (whole tile interactive, не только текст), `<a>` оборачивает; внутри card — нет nested `<a>` или `<button>`
- [ ] Hero image alt описательный: «Одинцово, район выезда — landmark Одинцовское шоссе»
- [ ] Form labels for/id, aria-required
- [ ] Focus-ring везде
- [ ] FAQ опционально (если есть на странице)
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion
- [ ] Reflow 400%

## SEO annotations

- **H1:** «Обиход в <Район> — мусор, деревья, крыши, демонтаж» — закрывает 4-в-1 запрос + brand + район.
- **H2 supplement:** «локальная команда в <Район>», «полигон <ближайший>», «правила СНТ <округ>».
- **JSON-LD:** `LocalBusiness` (главное, с `address.addressLocality: <Район>`, `geo`, `areaServed`, `openingHours`, `telephone`, `priceRange`) + `BreadcrumbList`.
- **Canonical:** self.
- **Internal links:** services-grid → 4 SD; neighbor-districts → 3 district hubs; text-content → /sro-licenzii/, /komanda/.

## TOV constraints

- H1 формула «Обиход в <Район>» — без «Услуги в <Район>».
- В text-content «локальная команда» — конкретика (бригадир имя? — backlog after Authors seed real name).
- НЕ: «комплексное обслуживание», «спектр услуг», «во всех районах Подмосковья».
- District landmark в alt + text — без stock-фотогалереи (анти §14).

## Эталонный URL для W3
`/raiony/odincovo/` (Одинцово 14 KW в pool, sanity-checked, sitemap-tree §«Гео-pillar» — priority #1).

## Открытые вопросы для poseo / art

1. **Services-grid 4 pillar — визуальная реализация:** 2×2 крупные tile или 1×4 row на desktop? Mobile определённо 2×2. Рекомендация ux: desktop 2×2 (более «hub»-like, чем длинный 1×4 row), tile aspect 1:1.
2. **Hero image с landmark + бригадой одновременно** или только landmark? Рекомендация ux: landmark + лёгкий silhouette бригады (бренд-Caregiver, не «маленькая фигурка человека на фоне знаменитости»). fal.ai `districtHeroPrompt` style apruv от `art` W2.
3. **«Локальный бригадир имя»** в text-content — сейчас blocked Authors seed (real name placeholder W2). Рекомендация ux: для эталона W3 — placeholder «бригадир Александр» + после получения реального имени — замена через CMS.
4. **LocalBusiness schema multiplicity:** 8 districts × 1 LocalBusiness каждый = 8 schema entities на сайте. Это допустимо? Рекомендация ux: обсудить с `seo-tech` — корректнее `Organization` (Обиход) + 8 `LocalBusiness` через `subOrganization` или `branch` свойство.

## Art review · 2026-05-01

**Status:** approved-with-changes.

**Что apruv'нуто:**
- 4-в-1 services-grid (2×2 desktop + 2×2 mobile, tile aspect 1:1) — корректно работает как «hub-карточка района», 0/17 конкурентов так не делает.
- Block-композиция, A11y checklist, district-icons line §9 — все OK.
- Sub-bio с placeholder «бригадир Александр» — допустимо до получения реального имени (W2/W3).

## Art changes

### 1. Hero image — landmark only (R1 решение: вариант B)

ux предложил «landmark + бригада в работе одновременно» — **отклонено**.

**Обоснование:**
- §14 Don't: «Стоковые фото с рукавицами — фотостиль документальный, реальные бригады на реальных объектах». Гибрид «бригада на фоне Усадьбы Голицыно» неизбежно деградирует в catalog-shot туристического формата.
- Caregiver-archetype: мы не «фото-репортаж с гордостью на достопримечательности», мы выезжающая бригада. Постановочное «маленькая фигурка человека на фоне знаменитости» — анти-Caregiver.

**Финальное решение:** **только landmark района** (Усадьба Голицыно / Одинцовское шоссе / другой узнаваемый ориентир) без бригады в кадре. Гео-сигнал держится через eyebrow + H1 + alt-text + текст hero-sub.

**Action item:**
- `districtHeroPrompt` в `site/lib/fal/prompts.ts` переделать на landmark-only direction (Track C).
- Style: документальный, дневной/утренний свет, землистая палитра, минимум 25% sky/foliage, без людей в кадре, без сезонной экстремальности (бурелом / снежная буря).
- Не натуралистическое туристическое фото landmark — privacy + бренд (мы не «открытка», мы каталог сервиса).

### 2. Trust-row hero — добавить eyebrow «4 strip» visual

Trust-row после CTA: «4 strip · ~6 лет · 24 ч выезд · полигон МО» — **«4 strip»** должен быть визуально отличаем (4 точки в линию = «4-в-1»). Спецификация:
- 4 dot pattern: `--c-primary` filled circle 8px, gap 4px (mono-spacing).
- Подпись «4 услуги» mono 11px после dots.
- На mobile — wrap, но не разрывать «4 strip» от подписи.

### 3. Sub-organization label для services-grid

Каждый из 4 tiles `services-grid` показывает **link к SD района** («/<service>/odincovo/»). На tile добавить mono-label «в Одинцово» под основным заголовком pillar — это закрепляет 4-в-1 cross-link на район. Сейчас в wireframe указано только название pillar — **уточнить визуально** через micro-eyebrow.

**Visual guidance:**
- Tile aspect 1:1, padding 20px, иконка 32×32 line §9 services сверху, H3 (Golos 600 18px), mono-eyebrow «в Одинцово» 11px `--c-muted`, цена «от 12 800» mono 13px `--c-ink`.
- Hover: border-color `--c-primary`, no scale (§14 «без неоновых ховеров»).
- Радиус `--radius` 10px.

**fal-prompt direction:** см. R1 выше — landmark only.

**Backlog для design/integration:** добавить в brand-guide §9 (Icons) подсекцию «districts line — соответствие 8 districts MO» с mapping district-slug → glyph-id. Сейчас §9 декларирует 9 glyph'ов districts, но без явного pinning к slug'ам Wave 1.

**Эскалация:** LocalBusiness schema multiplicity (вопрос #4 от ux) — **delegate to `seo-tech`**, не зона art.
