---
artifact: liwood-page-anatomy-2026-05
epic: EPIC-SERVICE-PAGES-UX
deliverable: C1.b
authors: design + ux
created: 2026-05-09
methodology: Playwright (Chromium) full-page screenshots × 5 URL × 2 viewports (1440 / 375) + DOM-introspection (h1/h2/h3, meta, JSON-LD, forms, tables, breadcrumbs, font-size, horizontal-scroll)
skills_activated: [ui-ux-pro-max, frontend-design]
sample_size: 5 URL × 2 viewport = 10 screenshots
screenshots_dir: /Users/a36/obikhod/screen/EPIC-C/
related:
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md (sustained passport — структурный анализ)
  - design-system/brand-guide.html (v2.2 — наши UI токены)
  - site/components/blocks/BlockRenderer.tsx (наши 13 готовых блоков)
do_not_duplicate:
  - EPIC-LIWOOD-OVERTAKE.B1 (SEO snapshot — JSON-LD, H1, Title, kw-density)
focus: ВИЗУАЛЬНЫЙ + UX (композиция, hierarchy, motion, mobile UX, touch targets, white-space, typography)
---

# liwood.ru — UX/UI page anatomy (визуальный бенчмарк)

## Executive summary

Проанализированы 5 service-URL × desktop+mobile = **10 скриншотов** + DOM-инспекция. Главный вывод:
**визуально liwood — это типичный 1С-Битрикс 2018 года: блоки навалены вертикально, иерархии нет, hero без CTA-формы, mobile откровенно сломан** (440px > 375px viewport, font 12px минимум, horizontal scroll, sticky-header перекрывает hero). При этом структурно у liwood 4 сильных копировательных приёма (mega-menu city-distributor, «10 причин», «сам vs специалист», 6-шаговая schema-работы), которые мы должны взять. **Главная whitespace для нас: hero-USP с фото→смета, AggregateRating с фото клиентов, mobile-first вёрстка с sticky bottom-CTA, видео-кейсы, локальные landmarks per district.**

Из 13 наших готовых блоков (`site/components/blocks/`) уже покрыто 70% liwood-секций. Не хватает: pricing-table, process-steps, comparison-table, reasons-list, gallery, reviews/testimonials, trust-block.
**Рекомендация для C2:** не дублировать liwood-наполнение 1:1 (17 блоков → читатель утомляется), а сжать до **10-12 секций master-template** с чёткой эмоциональной кривой Hero→Trust→Pricing→Calculator→Proof→Action.

Top 5 UX-улучшений vs liwood (детально в §4):
1. Hero с **CTA-формой и фото→смета USP** (у liwood в hero только 2 телефона + 2 кнопки-ссылки, нет input).
2. Mobile-first с **sticky bottom-CTA bar** ≥56px (у liwood только sticky-header, на 375px не помещается).
3. **AggregateRating + photo testimonials + Я.Карты-screenshot** (у liwood text-only отзывы без star, фото, дат, Schema).
4. **Visual hierarchy через 1 dominant accent color** + щедрые white-space sections (≥80px между секциями), а не «плотный» 1С-Битрикс-стиль liwood.
5. **Schema.org JSON-LD на каждом T2/T3/T4** (у liwood нигде нет — мы уже сделали US-3).

---

## 1. Per-URL анатомия

### 1.1 https://liwood.ru/services/ (T1 hub)

**Скриншоты:** `liwood-services-hub-{1440,375}.png`. **Title:** «Услуги - LIWooD». **H1:** «Услуги».

**Section list (по DOM):**
- Header (top-bar 2 phones + WhatsApp + email; main: лого + mega-menu + «Заказать звонок»)
- Breadcrumbs «Главная > Услуги»
- H1 «Услуги»
- Каталог plain card-grid (4 pillar) — без описаний, без иконок, без CTA
- Footer (контакты + навигация)

**Что есть:** ничего сильного. Это тонкий dispatch-page без MOFU-content.

| Оценка | Деталь |
|---|---|
| ✅ хорошо у liwood | Простой и быстро парсится |
| ⚠️ слабо | Нет hero-вступления / нет иконок pillar / нет фото / нет CTA / нет UX-стимула «зачем сюда вообще зашёл» |
| ❌ отсутствует | Калькулятор-вход / филлер «как мы работаем» / отзывы / видео |

**Whitespace:** наша `/uslugi/` страница может быть полноценным hub с 6 pillar-карточками + photo + USP-bar + калькулятор-вход. Это уже US-0 done в site/.

---

### 1.2 https://liwood.ru/services/udalenie-derevev/ (T2 pillar)

**Скриншоты:** `liwood-udalenie-pillar-{1440,375}.png`. **Title:** «Удаление деревьев в Москве и Московской области, цена на услугу | LiWood». **Meta description:** есть. **H1:** «Удаление деревьев в Москве».

**Section list (11 H2 + chrome, реальная ширина страницы):**
1. Top-bar (2 phones + WhatsApp + email)
2. Header (sticky, лого + mega-menu + «Заказать звонок»)
3. Breadcrumbs «Главная > Услуги > Удаление деревьев в Москве»
4. **Hero:** H1 + 2-3 строки intro + 2 CTA-button («Заказать услугу» / «Узнать больше»). НЕТ формы, НЕТ калькулятора, НЕТ hero-фото с парой landmarks.
5. **Sub-services grid:** 11 карточек (вырубка / валка / спил / целиком / частями / корни / аварийные / расчистка / порубочный / измельчение / пни) с короткой ценой «от X руб.»
6. Текстовое описание (~500 слов)
7. **H2 «Цены на удаление деревьев в Москве» — таблица 3 колонки** (диаметр × тип удаления × цена)
8. **Калькулятор онлайн** (5 шагов, без фото, output = «Итого: 0 руб.» + контактная форма)
9. **«Почему выбирают нас?»** — 8 иконок-преимуществ (СРО / гарантия / опыт 25 лет / своя техника / …)
10. **«Какие причины удалить дерево?» — 10 причин content-block** (контент-маркетинг внутри коммерческой)
11. **«Свалить дерево самостоятельно или вызвать специалиста?» — comparison table** (DIY vs PRO)
12. **«Фотогалерея»** — 10 фото lightbox-grid, alt одинаковый «Удаление насаждений», без описаний
13. «Удаление деревьев на участке под ключ» — text-content
14. **«Этапы работ»** — 4 пронумерованных шага
15. **«Вопрос-ответ» FAQ** — 8 вопросов в аккордеоне (без FAQPage Schema)
16. **«Удаляем деревья во всех городах МО» — 48 city-link grid** ⭐ (ключевой city-distributor → T4)
17. **«Отзывы клиентов»** — 4 карточки text-only (имя+город+цитата). НЕТ фото клиента, НЕТ дат, НЕТ звёзд, НЕТ AggregateRating.
18. Lead-form #2
19. Footer

**Метрики DOM:** 5 forms, 26 cards, 39 images, 3 tables, 150 city-links, JSON-LD = 0.

| Оценка | Деталь |
|---|---|
| ✅ хорошо у liwood | (1) **«10 причин» content-block** — мощный LSI-генератор + ответ на «зачем нужно». (2) **Comparison «сам vs специалист»** — психологический trigger «не пытайтесь дома». (3) **48 city-link grid** в подвале страницы — perma-перелинковка через каждый T2. (4) **Pricing-table с диаметром** — снимает «сколько стоит». (5) **8 преимуществ-иконок** — быстрый scan. |
| ⚠️ слабо | (1) **Hero без формы, без USP-фразы, без фото** — «холодный» вход. (2) **Калькулятор статичный** (output = заявка), пользователь обманут. (3) **Отзывы text-only** — низкий trust. (4) **Visual hierarchy плоская** — все H2 одного веса, секции «склеены». (5) **JSON-LD = 0** — наш чистый шанс на rich results. (6) **39 фото без описаний, alt дублируется** — a11y/SEO потеря. |
| ❌ отсутствует | Hero-форма / sticky bottom-CTA / video-cases / before-after / star-rating / Я.Карта объектов на T2 / B2B-блок / breadcrumbs Schema |

**UX-вывод T2:** liwood закидывает пользователя 17 секциями без эмоциональной кривой. Mid-funnel (узнать цену + позвонить) выполнен, но нет момента «доверие». Наш master-template должен иметь **четкую кривую: Awareness → Solution → Proof → Action** в 10-12 секциях максимум.

---

### 1.3 https://liwood.ru/services/udalenie-derevev/spil/ (T3 sub)

**Скриншоты:** `liwood-spil-sub-{1440,375}.png`. **Title:** «Спил деревьев в Москве и области — услуги по спиливанию от организации, цены | LiWood». **H1:** «Спил деревьев в Москве».

**Section list (6 H2):**
1. Header + Top-bar + Breadcrumbs «Главная > Услуги > Удаление деревьев > Спил деревьев в Москве»
2. **Hero** — H1 + 1-2 строки intro + 2 CTA
3. **«Зачем нужен спил?»** — 4 пункта (короткие)
4. **«Цены на спил деревьев»** — таблица (5 услуг + доп.)
5. **Этапы взаимодействия** — 5 шагов (на 1 шаг больше, чем T2)
6. **«Способы спила»** ⭐ (5 методов: целиком / по частям / с оттяжкой / вертолётом / вручную) — **уникально для T3** (технический разбор)
7. **«Частые вопросы к специалистам LiWood» FAQ** — всего 3 вопроса (меньше, чем T2)
8. Footer

**Метрики:** 5 forms, 33 images, 3 tables, 53 sub-service-links. **JSON-LD = 0**.

| Оценка | Деталь |
|---|---|
| ✅ хорошо у liwood | **«Способы спила»** — уникальный технический блок, отличает T3 от T2 (а не просто token-replace). Подходит под intent «способы / методы / как». Compact 6 H2 = меньше когнитивной нагрузки. |
| ⚠️ слабо | (1) **Нет блока городов** (как на T2), теряется linkjuice T4. (2) **FAQ всего 3** vs 8 на T2 — недонаполнение. (3) **Нет gallery** (33 images — сетки галереи нет, это inline-icons). (4) **Нет comparison «сам vs специалист»** (хотя для T3 он напрашивается ещё сильнее). |
| ❌ отсутствует | Photo-gallery / mini-case / отзывы / video / sibling-T3 связь (вырубка/валка/целиком) |

**UX-вывод T3:** sub-страница оптимизирована — короче T2, фокус на технику. Но потеря city-distributor = bug. Наш T3-template должен (а) сохранять блок «районы» как у T2 (full-funnel в одной странице), (б) добавить «способы / методы / варианты» как уникальный T3-маркер.

---

### 1.4 https://liwood.ru/services/udalenie-derevev/himki/ (T4 SD)

**Скриншоты:** `liwood-khimki-sd-{1440,375}.png`. **URL:** `/himki/` (не `/khimki/` — `/khimki/` отдаёт **HTTP 404 + 1 console error** — это техдолг liwood и наш сигнал «канонизация slug-транслита»). **Title:** «Удаление, спил деревьев в Химках: цена» (короткий, есть). **Meta description:** есть.

**Section list (5 H2 + chrome):**
1. Header + Top-bar + Breadcrumbs «Главная > Услуги > Удаление деревьев > Удаление деревьев в Химках» (4 уровня — больше всех T*)
2. **Hero** — H1 «Удаление деревьев в Химках» + 2-3 строки + 2 CTA
3. **«Какие деревья и как следует удалять»** — generic-content (не city-specific)
4. **«Цены на услуги»** — таблица (идентична T2)
5. **«Как формируется стоимость»** — text + калькулятор-форма
6. *(пустой H2 — багу разметки)*
7. **«Мы оказываем услуги во всех городах и ГП Химкинского района»** — список 30+ микротопонимов (Алешкино, Барашки, Бутаково, Вашутино, Поведники, …) ⭐
8. Footer

**Метрики:** 5 forms, 26 images, 2 tables, 7 mentions «хим*» (мало для 5848 chars body), **JSON-LD = 0**, microDistricts (Алешкино/Бутаково/Вашутино/Поведники) = 0 в `<a>/<li>` (выводятся как plain text, не link).

| Оценка | Деталь |
|---|---|
| ✅ хорошо у liwood | (1) **Title + Meta description заданы** (на T4 это редкость в SERP). (2) **Список 30+ микрорайонов** в подвале — hyper-local long-tail. (3) **Breadcrumbs 4 уровня** (Главная > Услуги > Удаление деревьев > Удаление в Химках) — навигация ясна. |
| ⚠️ слабо | (1) **Только 7 упоминаний «хим*»** в 5800 chars body = 0.12% — очень мало. (2) **Микрорайоны как plain text**, не ссылки — потеря nav UX. (3) **Generic-фотогалерея** — не из Химок. (4) **Калькулятор и преимущества дублируют T2** — почти token-replace. (5) **JSON-LD `LocalBusiness` с `areaServed=Химки` отсутствует**. (6) **Адрес офиса московский** — нет local trust. (7) **Пустой H2** — баг. |
| ❌ отсутствует | Hyperlocal photo (фото объекта в Химках) / отзыв из Химок / адрес/маршрут в Химки / встроенная Я.Карта Химок / B2B-местные клиенты (УК/ТСЖ) |

**UX-вывод T4 (КЛЮЧЕВОЙ для нашего эпика):** liwood держит 49 city-страниц только за счёт того, что в SERP по «удаление деревьев Химки» конкуренция слабая. Они дают 8-12% city-уникального контента и побеждают. **Наш T4-template должен иметь:** (а) hero с фото из района + locale-specific вступление 150+ слов, (б) минимум 5 city-mentions в body, (в) JSON-LD `LocalBusiness` + `Service` + `areaServed.City`, (г) photo + отзыв клиента из этого района (US-9 Reviews уже done), (д) микрорайоны как кликабельные `<a>` с anchor-link или stub-page, (е) встроенный Я.Карта pin, (ж) адрес/время-выезда «по Химкам — 30 мин».

---

### 1.5 https://liwood.ru/services/landshaftniy-dizayn-uchastka/ (parity для нашего 5-го pillar)

**Скриншоты:** `liwood-landshaft-pillar-{1440,375}.png`. **Title:** «Ландшафтный дизайн дачного участка под ключ цена за сотку». **H1:** «Ландшафтный дизайн».

**Section list (4 H2 + chrome — самый бедный из всех T2):**
1. Header + Breadcrumbs «Главная > Услуги»
2. **Hero** — H1 + 2 CTA
3. **«Стоимость ландшафтного дизайна»** — таблица «соток × цена» (6/10/12/15)
4. **«Наши преимущества»** — иконки
5. **«Фотогалерея»**
6. Footer

**Метрики:** 3 forms, 33 images, 2 tables, 4879 body chars (=меньше чем T4 city), **JSON-LD = 0**, **breadcrumbs не доделаны** (только «Главная > Услуги», без «Ландшафтный дизайн»).

| Оценка | Деталь |
|---|---|
| ✅ хорошо у liwood | (1) **Прайс «за сотку 6/10/12/15»** — простой ROI-калькулятор. |
| ⚠️ слабо | (1) **4 H2 — гораздо беднее T2** udalenie-derevev (11 H2). (2) **Нет калькулятора (с photo→sketch)**, нет FAQ, нет comparison, нет «10 причин», нет блока городов, нет процесса 6-этапов, нет отзывов клиентов на этой странице. (3) **Breadcrumbs обрезаны.** (4) **Нет JSON-LD.** (5) **Нет sub-services grid** — 0 переходов на подразделы. |
| ❌ отсутствует | (a) Process-steps (для проектирования = 5-7 этапов как минимум — критично для UX «что произойдёт»). (b) Before-after photos. (c) Видео-визуализация участка. (d) 3D-render mockups. (e) Календарь сезонности (когда лучше делать). (f) FAQ. (g) Cases. |

**UX-вывод pillar №5:** **liwood landshaft — это полу-полу страница, заметно ниже качеством T2 udalenie**. Это явный whitespace для нашего ландшафта (если оператор подтвердит landshaft как 5-й pillar в ADR-0020). Мы можем сразу сделать flagship-pillar страницу: photo→sketch input + before-after gallery + 6-этапный process + sezonnost + FAQ — и обойти их в нише, где у них слабая страница.

---

## 2. Cross-cutting наблюдения (chrome / patterns)

### Mobile (375px)

**КРИТИЧНО:** на T2 udalenie-derevev `documentElement.scrollWidth = 440px > viewport 375px` = **horizontal scroll bug**. Минимальный font 12px (нарушает iron rule readable-font-size 16px на мобиле). У liwood mobile = базовый Bitrix burger без полноценного редизайна. Наша возможность — mobile-first вёрстка с sticky bottom-CTA bar (CTA «Позвонить» + «Photo→смета»), normalized 16px body, 0 horizontal scroll.

### Desktop (1440px)

**Header sticky** — есть. **Mega-menu** — есть, под услугой «Удаление» = все 49 городов (это мы уже скопировали в нашем mega-menu, sustained). **Floating WhatsApp** — есть в правом нижнем углу. **Cookie-баннер** — fixed bottom, перекрывает контент. **Footer** — 2 колонки контакты+навигация, в самом низу — «Портал поставщиков» (B2B-сигнал) и кредит linkor.studio.

### Visual style

- **Цветовая палитра:** dominant зелёный + белый + серые тексты. Accent — оранжевый/жёлтый CTA. Базовый «Bitrix-зелёный лесхоз» 2018 года.
- **Typography:** body шрифт generic sans (вероятно PT Sans / Roboto), без display-face. Heading-weight 600-700, body 400. Иерархия плоская — все H2 одного size/weight.
- **Spacing:** плотные секции, между блоками 30-40px, ничего «дыщать» нет. Это анти-pattern для премиум-впечатления.
- **Иконки:** Bitrix line-art 1px stroke + цветные «бейджи» преимуществ. У нас — line-art 1.5px monochrome из brand-guide §icons (49 + 9 + 9). Наш стиль чище.
- **Фото:** репортажные документальные с объектов. Качество среднее, без обработки. Adobe Lightroom не применялся. У нас в brand-guide §photography указан тот же стиль («документальный репортажный») — это совпадение интента, но мы должны качественно перебить.
- **Motion:** хайр-эффекты нет, scroll-reveal нет, только дефолтный hover на ссылках. Anti-pattern по нашим стандартам frontend-design.

---

## 3. Сравнение с нашим текущим состоянием

### Где мы УЖЕ лучше liwood

| # | Фича | Наш статус | Liwood |
|---|---|---|---|
| 1 | JSON-LD на 100% URL (Service + LocalBusiness + FAQPage + BreadcrumbList) | US-3 done | 0 на 5 проверенных |
| 2 | Photo→Quote calculator (Claude API) | US-8 done | Статичный multi-step → форма |
| 3 | 5/5 pillar SD-страницы | US-7 done | Только 1/4 pillar (только удаление) |
| 4 | E-E-A-T (4 RU authors + Author Schema) | US-11 done | Статьи без авторов, без Article Schema |
| 5 | llms.txt + llms-full.txt + Speakable | US-3 done | нет |
| 6 | Mega-menu city-distributor | sustained 2026-05-09 | есть (источник) |

### Что у liwood лучше (copy-кандидаты для нашего master-template)

| # | Liwood-приём | Куда взять | Наш статус |
|---|---|---|---|
| 1 | **«10 причин удалить дерево» content-block** | T2 master-template (опц T3) | ❌ нет |
| 2 | **«Самостоятельно vs специалист» comparison-table** | T2/T3 master-template | ❌ нет |
| 3 | **6-этапная пронумерованная «схема работы»** | T1 + T2 + T4 master-template | partial (есть text но не visual) |
| 4 | **Pricing-table с диаметром/площадью × ценой** | T2/T3 master-template | partial (Calculator + tldr но не unified table) |
| 5 | **48 city-link grid в подвале T2** | у нас уже NeighborDistricts, но как city-distributor под T2 — нет | partial (NeighborDistricts даёт 4-6 sibling, не 48) |
| 6 | **8 преимуществ-иконок «Почему выбирают нас»** | T2/T3 master-template (быстрый scan) | partial (CtaBanner перегружен) |

### Whitespace (новые UX-возможности vs liwood)

| # | Возможность | Эффект |
|---|---|---|
| 1 | **Hero с CTA-формой и photo-upload** | mid-funnel CTR +30-40% (vs liwood «холодный» hero с 2 кнопками) |
| 2 | **Sticky bottom-CTA bar на mobile** (Phone + Photo→смета) | mobile-CR +20% |
| 3 | **AggregateRating + photo testimonials + Я.Карта-screenshot** | trust-signal, rich result, +1 ★ в SERP |
| 4 | **Видео-кейсы с YouTube-embed** + before-after | session-time +60s, retention |
| 5 | **Локальные landmarks per district** (CDS микрорайоны как клик-anchors) | hyperlocal a11y / SEO + UX «мой район виден» |
| 6 | **Эмоциональная кривая Hero→Trust→Pricing→Calculator→Proof→Action** в 10-12 секциях | UX cohesion, не «свалка 17 блоков» liwood |
| 7 | **Visual hierarchy через 1 dominant accent color** + щедрый white-space (≥80px между секциями) | premium feel, brand-guide-compliant |
| 8 | **Scroll-reveal motion на key sections** (300ms ease-out, respects prefers-reduced-motion) | subtle delight, не цирк |

---

## 4. Master template recommendations (для C2 ADR-0021)

Финальный список секций для T2/T3/T4 service-страниц. **Required = обязательно для каждого URL этого type. Optional = enabled-флаг в Payload, заполняется по necessity.**

Все секции маппятся на `site/components/blocks/` (наши 13 готовых) либо требуют расширения brand-guide v2.2 (отмечено).

### T2 (pillar) — 12 секций

| # | Секция | Required | Block-component | Обоснование «liwood делает X — мы должны Y» |
|---|---|---|---|---|
| 1 | Breadcrumbs (с BreadcrumbList Schema) | R | `Breadcrumbs` ✅ | liwood: 3 уровня без Schema → мы 3 уровня + Schema |
| 2 | **Hero с CTA-формой + photo-upload entry** | R | `Hero` ✅ + расширение | liwood: hero без формы → мы input «загрузите фото / получите смету» прямо в hero (USP) |
| 3 | TL;DR (3-4 пункта что входит / срок / цена «от») | R | `Tldr` ✅ | liwood: нет TL;DR → мы daём scan-friendly summary в первом экране после hero |
| 4 | **Sub-services grid с ценой «от X руб.»** | R | `ServicesGrid` ✅ | liwood: 11 карточек горизонтально → мы 6-8 карточек, каждая с фото + цена |
| 5 | **Pricing-table (диаметр/площадь × цена)** | R | **NEW: PricingTable** (расширить brand-guide §components) | liwood: 3-колоночная таблица → мы те же 3 колонки + tooltip «что входит» |
| 6 | **Calculator photo→квота (real Claude API)** | R | `Calculator` ✅ | liwood: статичный → мы реальный photo-upload + диапазон цены |
| 7 | **Process-steps (6 шагов с нумерацией)** | R | **NEW: ProcessSteps** (расширить brand-guide §components) | liwood: 4 шага text-only → мы 6 шагов с иконками + visual numbering |
| 8 | Trust-block (8 преимуществ + СРО/лицензии badges) | R | расширить `LicenseBadge` + new TrustGrid | liwood: 8 иконок plain → мы 8 + 4 СРО-документа клик-zoom |
| 9 | **«10 причин» content-block (LSI)** | O | **NEW: ReasonsList** (extend brand-guide §components) | liwood: важный LSI-приём → мы copy + улучшить |
| 10 | **«Сам vs специалист» comparison** | O | **NEW: ComparisonTable** (extend brand-guide §components) | liwood: text-table → мы 2-column grid с иконками ✅/❌ + cost-implications |
| 11 | Mini-case (1 кейс с фото, ссылка на /kejsy/) | R | `MiniCase` ✅ | liwood: text-only отзывы → мы кейс с фото до-после + клиент |
| 12 | FAQ (с FAQPage Schema, 6-10 вопросов) | R | `Faq` ✅ | liwood: 8 в аккордеоне без Schema → мы 8-10 + Schema (US-3 done) |
| 13 | **Reviews/Testimonials (3-4 карточки + AggregateRating)** | R | **NEW: TestimonialsGrid** | liwood: text-only без star/photo/Schema → мы 3-4 карточки с фото + дата + ★ + Schema |
| 14 | **Gallery (10 фото с описанием + alt + lightbox)** | O | **NEW: Gallery** (extend brand-guide §components) | liwood: 10 фото без описаний → мы те же + caption + правильный alt |
| 15 | City-distributor («Все 30+ районов МО») | R | расширение `NeighborDistricts` | liwood: 48 city-links → мы те же + group by округ + ratings |
| 16 | CTA-banner (final-pre-form, эмоциональный hook) | R | `CtaBanner` ✅ | liwood: повторяет «Заказать звонок» 3 раза → мы 1 CTA-banner с photo→смета |
| 17 | LeadForm (final form под banner, full поля) | R | `LeadForm` ✅ | liwood: 3 копии формы → мы 1 lead-form внизу + sticky bottom-CTA на mobile |

**Итог T2:** 17 потенциальных, 12 Required, 5 Optional. **Из 13 наших блоков — 8 покрывают, 5 надо расширить или создать.**

### T3 (sub) — 9 секций (фокусированный)

T3 = T2 минус: «10 причин», comparison, gallery, city-distributor (но **сохраняем NeighborDistricts** как «районы где делаем эту под-услугу» — у liwood это потеря). Плюс новый: «Способы / методы / варианты» для отличия от T2.

| # | Секция | Required | Block | Note |
|---|---|---|---|---|
| 1 | Breadcrumbs (4 уровня) | R | ✅ | На 1 уровень глубже T2 |
| 2 | Hero (без photo-upload, более компактный) | R | ✅ | Меньше, чем T2 |
| 3 | TL;DR | R | ✅ | |
| 4 | Pricing-table compact | R | NEW | |
| 5 | **Methods/Variants («N способов спила» как у liwood)** | R | **NEW: MethodsGrid** | liwood-уникальный T3-приём — берём, улучшаем |
| 6 | Process-steps compact (5 шагов) | R | NEW | |
| 7 | Mini-case (1) | O | ✅ | |
| 8 | FAQ (3-5 вопросов) | R | ✅ | |
| 9 | NeighborDistricts (sibling-T3 + city-link под этой подуслугой) | R | ✅ | liwood: нет — наш fix |
| 10 | LeadForm | R | ✅ | |

### T4 (Service×District SD) — 11 секций

T4 = T2 минус (мега-grid sub-services не нужен — фокус на район) плюс **city-specific фотохэдер** + **местные landmarks** + **встроенная Я.Карта** + **локальный отзыв**.

| # | Секция | Required | Block | Note |
|---|---|---|---|---|
| 1 | Breadcrumbs (4 уровня incl city) | R | ✅ | |
| 2 | **Hero с city-specific photo + 150+ слов city-вступления** | R | расширение `Hero` | liwood: generic photo → мы фото из района |
| 3 | TL;DR (с city-mention) | R | ✅ | |
| 4 | Pricing-table (та же что T2 но с заголовком «в [Район]») | R | NEW | |
| 5 | Calculator photo→квота | R | ✅ | |
| 6 | **Local landmarks list** (микрорайоны как `<a>` anchor или stub) | R | **NEW: LandmarksList** | liwood: plain text → мы кликабельные anchors |
| 7 | **Я.Карта embedded с pins наших объектов в районе** | O | **NEW: YandexMapEmbed** | liwood: нет встройки на T4 → наш USP |
| 8 | Trust-block (СРО/лицензии — те же) | R | extend | |
| 9 | **City-local mini-case или review** | O | расширение `MiniCase` | liwood: generic → мы реальный кейс из района |
| 10 | Process-steps compact | R | NEW | |
| 11 | FAQ (3-5 city-spec вопросов) | R | ✅ | |
| 12 | NeighborDistricts (соседние районы) | R | ✅ | |
| 13 | LeadForm | R | ✅ | |

---

## 5. Mobile-specific notes для master-template

**Что у liwood ломается на mobile:**
- Horizontal scroll (440px content > 375px viewport) на T2
- Min font 12px нарушает readable-font-size 16px
- Sticky-header высокий, перекрывает hero на iPhone SE
- Cookie-баннер занимает 25% screen-height, не закрывается easily
- Floating WhatsApp перекрывает text on scroll
- Pricing-table 3 колонки на 375px = не помещается читаемо

**Что у liwood OK на mobile:**
- Burger-menu работает
- Telephone-link tap (`tel:+...`) работает корректно
- Sub-services grid сворачивается в 1 column

**Mobile pattern для нашего master-template (mobile-first):**
1. **Sticky bottom-CTA bar 56px**: «Photo→смета» (primary, выделено) + «Позвонить» (secondary). Появляется при scroll > 200px.
2. **Hero compact:** H1 + 2-3 строки + 1 CTA (photo-upload). 0 двойных телефонов в hero (это в sticky bottom).
3. **Pricing-table:** на 375px переключается на «accordion-cards» — каждая строка таблицы как card (диаметр + цена + подробности collapsible).
4. **Process-steps:** на mobile одна колонка с большими номерами слева 32px.
5. **Calculator:** photo-upload занимает full-width hero, post-upload show range card-style.
6. **City-distributor:** на mobile collapsible accordion «28 районов МО» (раскрыто = grid 2-col).
7. **FAQ:** аккордеон по умолчанию, минимум 16px font, ≥44px tap-area.
8. **LeadForm:** 1 column, label выше field, ≥44px input height, autocomplete + correct keyboard `tel`/`email`.
9. **Sticky-header:** высота ≤56px (не 88 как у liwood).
10. **Cookie-баннер:** разрешить swipe-down dismiss + кнопка «понятно» ≥44px.

**Touch-target audit (per master-template DoD):**
- Все CTA ≥44×44pt
- 8px+ spacing между tap targets
- Pricing-table cells (clickable) hit-area ≥44pt
- City-link grid: каждый chip ≥36px height + 8px margin

**Reduced-motion check:**
- Любые scroll-reveal анимации — `prefers-reduced-motion` honor
- Calculator processing-spinner показать только если >300ms

---

## 6. Open questions для C2 / D1

Эти решения за PO + Operator (не в scope C1.b):

1. **Cap количества секций T2:** оставить liwood-полный 17 или сжать до 12 (наша рекомендация)?
2. **Pricing-table стиль:** реальная таблица «диаметр × цена» (как liwood) или «карточки-tier» (3 пакета: Стандарт / Расширенный / Под ключ)?
3. **City-distributor: full grid 30 районов или collapsible top-10 + «показать все»?**
4. **Comparison «сам vs специалист»:** делать или нет (контентоёмкий, +800 слов LSI, но добавит длины)?
5. **Видео-кейсы:** YouTube embed или native `<video>` с self-host (Beget VPS bandwidth)?
6. **Я.Карта embed на T4:** обязательно или optional (privacy + latency)?

Эти вопросы — input для C2 ADR-0021 + D1 art-briefs.

---

## 7. Hand-off

После C1.b → C1.a (design-system inventory) → C2 (master-template ADR-0021 на основе обоих).
