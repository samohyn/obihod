---
epic: BUG-MOBILE
slug: bug-mobile
title: Прод — мобильная верстка + битые ссылки + правовые 404
team: product
po: podev
type: bug
priority: parked
segment: cross
phase: intake
status: parked
created: 2026-04-29
updated: 2026-04-29
related: [EPIC-SITE-MANAGEABILITY, US-9-full-regression]
---

# EPIC BUG-MOBILE — баги прода (мобильная верстка + 404)

**Статус:** `parked` — оператор зафиксировал и отложил 2026-04-29.
**Owner:** podev (передам исполнителям при разморозке).
**Триггер старта:** явный запрос оператора либо включение в US-9 (full-regression).

## Контекст

29 апреля 2026 podev (по запросу оператора) выполнил real-browser smoke
прода `https://obikhod.ru/` на iPhone 13 viewport (390×844) через Playwright
+ batch HEAD-проверку всех ссылок с главной. Найдены 3 группы дефектов.
Главная отдаёт 200, JS errors 0, пререндер кэшируется — функционально сайт
жив, но **визуальная и юридическая поверхность не годится для лидогенерации**.

Артефакты smoke:
- [screen/prod-mobile-home-top.png](../../screen/prod-mobile-home-top.png)
- [screen/prod-mobile-home-full.png](../../screen/prod-mobile-home-full.png)
- [screen/prod-mobile-arboristika.png](../../screen/prod-mobile-arboristika.png)
- [screen/prod-mobile-ramenskoye.png](../../screen/prod-mobile-ramenskoye.png)
- [screen/prod-mobile-kejsy.png](../../screen/prod-mobile-kejsy.png)
- [screen/prod-mobile-blog.png](../../screen/prod-mobile-blog.png)
- [screen/prod-mobile-menu-open.png](../../screen/prod-mobile-menu-open.png)
- [screen/prod-mobile-calc-overflow.png](../../screen/prod-mobile-calc-overflow.png)

## Найденные дефекты

### 1. P0 · Горизонтальный overflow на главной (мобила свайпается вбок)

`document.scrollWidth = 433px` при `window.innerWidth = 390px` → **+43px overflow**.

| Селектор | Ширина | Раздел | Что делать |
|---|---|---|---|
| `.season-cal-grid` | 560px | сезонный календарь | сжать в карусель/grid 2-cols под `@media (max-width: 480px)` |
| `.rings-bg` SVG | 900px | декоративный фон | `max-width:100%` либо `overflow:hidden` на родителе |
| `.calc-left`, `.calc-right` | 386px каждая (рядом) | калькулятор `#calc` | схлопнуть в 1 колонку на мобиле; видно как «Срочно, 24 часа» обрезается справа |

Все pillar / район / кейсы / блог — `overflow=0`. **Проблема локальна на главной.**

### 2. P0 · 15 битых ссылок с главной (404)

**Sub-услуги (12) — анкоры есть, страниц нет:**
- `/arboristika/spil-derevev/`, `/arboristika/valka-derevev/`, `/arboristika/spil-alpinistami/`,
  `/arboristika/kronirovanie/`, `/arboristika/sanitarnaya-obrezka/`, `/arboristika/kabling/`,
  `/arboristika/pokos-travy/`
- `/chistka-krysh/ot-snega/`, `/chistka-krysh/sbivanie-sosulek/`, `/chistka-krysh/chastnyy-dom/`
- `/demontazh/demontazh-saraya/`, `/demontazh/demontazh-bani/`, `/demontazh/raschistka-uchastka/`
- `/promyshlennyj-alpinizm/`, `/arenda-tehniki/avtovyshka/`

**Район (1):**
- `/raiony/odintsovo/` (остальные 6 районов работают, включая `/raiony/ramenskoye/` — programmatic M1).

Возможное пересечение с EPIC-SITE-MANAGEABILITY US-5/US-6 (sitemap + content production):
если эти страницы — programmatic-LP в плане, **нужно решить** убирать/оставлять
ссылки до релиза US-6, либо чистить главную сейчас.

### 3. 🟡 P1 · Юр-риск: правовые страницы 404 (нарушение 152-ФЗ)

- `/politika-konfidentsialnosti/` → 404
- `/oferta/` → 404

Ссылки на них есть в футере, при этом на сайте работают формы заявки и калькулятор,
собирающие ПДн (имя, телефон). Без публикации этих документов **сбор ПДн нелегален**.

**Варианты:**
- (a) опубликовать MD-страницы с шаблонами «Политика конфиденциальности» и «Оферта»
  (текст готовится `cw` + ревью оператора);
- (b) временно скрыть формы (CTA «Получить смету», калькулятор `#calc`,
  телефон оставить как fallback);
- (c) объединить с US-9 full-regression и закрыть пакетом перед релизом маркетинга.

### 4. P3 · Console warnings (косметика)

- `link rel=preload` для `_next/static/chunks/0jvs8zfdmictu.css` загружается, но
  не используется — лишний preload-тег в `<head>`. Влияния на UX нет.

## Что работает (для контекста — НЕ ломать при разморозке)

- HTTPS, prerender HIT, 200 на главной, 0 JS errors.
- Hero / лого / основные CTA на главной.
- Мобильное меню (Услуги / Районы / Кейсы / Цены / Блог / Контакты), accordion на «Услуги», «Районы».
- Все 4 pillar (`/vyvoz-musora/`, `/arboristika/`, `/chistka-krysh/`, `/demontazh/`) — 200.
- 6 из 7 районов — 200.
- `/vyvoz-musora/staraya-mebel/`, `/vyvoz-musora/vyvoz-stroymusora/`, `/vyvoz-musora/kontejner/`,
  `/arboristika/avariynyy-spil/`, `/arboristika/udalenie-pnya/` — 200.
- `/kejsy/`, `/blog/` — 200 (пустые состояния — норм, US-6 заполнит).

## План при разморозке (черновик, не брать в работу сейчас)

| # | Задача | Роли | Связь |
|---|---|---|---|
| 1 | Спека CSS-фикса главной (`season-cal-grid`, `rings-bg`, `calc-left/right` под mobile) | sa-site → fe-site → qa-site | brand-guide §7 Shape |
| 2 | Решение по 15 битым ссылкам: чистить главную / создавать LP | podev + sa-seo | EPIC-SITE-MANAGEABILITY US-5, US-6 |
| 3 | Правовые страницы (politika + oferta) | cw → sa-site → fe-site | 152-ФЗ, contex/ |
| 4 | Удалить лишний preload | fe-site | Next.js конфиг |
| 5 | Real-browser smoke на 4 viewport (390 / 414 / 768 / 1280) после фикса | qa-site + leadqa | iron rule №4 (PO local-verify) |

## Hand-off log

- **2026-04-29** · podev · **action: создан intake, статус `parked`** ·
  оператор запросил smoke прода → найдено 3 группы дефектов (overflow 43px на главной,
  15× 404 с главной включая politika/oferta, console warnings) → оператор зафиксировал
  и отложил, разморозка по явному запросу либо в рамках US-9 full-regression.
