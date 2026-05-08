---
domain: liwood.ru
analyzed: 2026-05-08
analyst: poseo + sa-seo (research-agent assist)
purpose: финальный паспорт `/services/`-раздела для EPIC-SEO-USLUGI (5 leverage'ов обгона)
extends: seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md
cms: 1С-Битрикс
sample_size: 17 URL deep-fetched (live 2026-05-07) + 5 sitemap-индексов + sitemap-iblock-8.xml (169 URL)
---

# Liwood `/services/` — финальный паспорт для EPIC-SEO-USLUGI

## Зачем этот документ

Sustained `liwood-page-templates-analysis-2026-05-07.md` — **общий паспорт** под EPIC-SEO-COMPETE-3 (12 типов шаблонов всего сайта). Этот документ — **расширение под наш эпик**, фокус только на разделе `/services/` и 5 leverage'ах обгона.

## 1. Точное число URL в `/services/` — 169

Из `https://www.liwood.ru/sitemap-iblock-8.xml` (live 2026-05-07):

| Уровень | Количество | Пример |
|---|---:|---|
| pillar (depth-1) | 17 | `/services/udalenie-derevev/` |
| sub-services (depth-2) | 105 | `/services/udalenie-derevev/spil/` |
| programmatic SD (depth-2) | 47 | `/services/udalenie-derevev/himki/` |
| **Total** | **169** | — |

**Важно:** 17 pillar в sitemap, но в hub-странице `/services/` грид показывает **15 карточек** (2 pillar — `arboristika` (umbrella) и `uborka-territorii` (leaf без саб-услуг) — не вынесены в hub-грид).

## 2. Полный inventory pillar (17 шт)

| # | URL | Заголовок | Sub-services | Cities |
|---|-----|-----------|---:|---:|
| 1 | `/services/udalenie-derevev/` | Удаление деревьев | **11** | **47** ⭐ |
| 2 | `/services/obrezka-derevev/` | Обрезка деревьев | 25 | 0 |
| 3 | `/services/opryskivanie-derevev/` | Опрыскивание | 4 | 0 |
| 4 | `/services/lechenie-derevev/` | Лечение деревьев | 5 | 0 |
| 5 | `/services/promyshlennyy-alpinizm/` | Промальп | 9 | 0 |
| 6 | `/services/diagnostics/` | Диагностика | мало | 0 |
| 7 | `/services/ukreplenie-derevev/` | Укрепление | мало | 0 |
| 8 | `/services/obrabotka-uchastka-ot-kleshchej/` | От клещей | 0 (leaf) | 0 |
| 9 | `/services/udalenie-pney/` | Удаление пней | несколько | 0 |
| 10 | `/services/kronirovanie-derevev/` | Кронирование | 0 (leaf) | 0 |
| 11 | `/services/poluchenie-porubochnogo-bileta/` | Порубочный билет | 0 (leaf) | 0 |
| 12 | `/services/onlayn-konsultatsiya/` | Онлайн-консультация | 0 (leaf) | 0 |
| 13 | `/services/uborka-territorii/` | Уборка территории | 0 (leaf) | 0 |
| 14 | `/services/landshaftniy-dizayn-uchastka/` | Ландшафтный дизайн | 0 (leaf) | 0 |
| 15 | `/services/arboristika/` | Арбористика (umbrella) | 0 (leaf) | 0 |
| 16 | (не в hub-гриде) | — | — | — |
| 17 | (не в hub-гриде) | — | — | — |

**Концентрация трафика:** 47 из 47 city-страниц только под `/services/udalenie-derevev/` — **100%** programmatic SD у liwood под одной услугой. Остальные 14 (или 16) pillar'ов — БЕЗ программатики.

## 3. Шаблоны `/services/` — 4 типа

Sustained паспорт §2 описывает 12 шаблонов всего сайта. Релевантны для нас 4:

### Hub `/services/` (1 URL)

- DOM: breadcrumbs · H1 «Промышленный альпинизм и современная арбористика» · 15 карточек pillar · footer/header chrome
- Контента: 0 (только грид)
- JSON-LD: 0
- Воронка: top-of-funnel, навигация в pillar

### T2 Pillar `/services/<pillar>/` (17 URL)

DOM сверху вниз:
- breadcrumbs (нет JSON-LD)
- hero — H1 + 2 CTA «Заказать» + «Спросить»
- грид sub-услуг (11 карточек для `udalenie-derevev`) с превью-картинкой и priceFrom
- лонгрид «Зачем нужно X» (~500 слов)
- Price-table (диаметр × тип)
- 5-step калькулятор (форма-симулятор, не реальный расчёт)
- 8 trust-карточек «Почему мы»
- «10 причин удалить» (LSI +800 слов)
- «Сам vs специалист» (compare-table)
- этапы работы
- FAQ 8q (без JSON-LD!)
- галерея 10
- **48 city-ссылок** (только под `udalenie-derevev/`!)
- 4 отзыва без JSON-LD AggregateRating
- форма (×3 instances per page)
- ~2500-3000 слов

**JSON-LD:** **0**. Ни один schema-тип не реализован.
**Title pattern:** «Title pillar — Москва и МО | Liwood» (наблюдение).

### T3 Sub-service `/services/<pillar>/<sub>/` (~105 URL)

DOM сверху вниз:
- hero + 2 CTA
- «Зачем нужен»
- Price-table
- калькулятор (тот же, generic)
- 6 trust-карточек
- галерея 7
- этапы работы
- **методы (5)** — уникальный блок T3
- FAQ 3q (без JSON-LD)
- форма
- ~1800-2000 слов

**Особенность:** T3 НЕ содержит ссылок на города. City-перелинковка только из T2.
**JSON-LD:** **0**.

### T4 Programmatic Service×City `/services/<pillar>/<city>/` (47 URL — ⭐ конкурентский leverage)

DOM сверху вниз:
- breadcrumbs
- hero (city в H1, generic вступление)
- generic-методы (одинаковые на всех city)
- промо-15% (одинаковая)
- price-table (одинаковая с T2)
- калькулятор (одинаковый)
- форма
- 6 trust-карточек (generic)
- generic-галерея (без локальных фото!)
- «как формируется стоимость» (одинаковый)
- **список 30+ микрорайонов** района (единственный city-specific блок)
- форма
- ~1500-1800 слов
- City-specific доля: ~8-12% (H1 + intro + микрорайоны)

**JSON-LD:** **0**.
**Title:** часто пустой или generic (наблюдение из артефакта sustained — 28% URL не индексируются у liwood именно из-за пустых Title).

## 4. Sustained chrome (на ВСЕХ страницах)

- Sticky header: 2 телефона + WhatsApp + Telegram (но не Telegram-bot!)
- Mega-menu pillar'ов с **city-distributor** под `udalenie-derevev` (47 city-ссылок)
- Единая форма «Задать вопрос»: Имя* / Тел* / Email / Сообщение / капча
- Cookie-consent (sticky)
- Footer 2 колонки

## 5. Наши 5 leverage'ов обгона — детальное mapping

### Leverage 1: JSON-LD coverage

| Где у liwood | Что у нас (target) | Impact |
|---|---|---|
| 0 schema на 169 URL | Service+LocalBusiness+AggregateRating+FAQPage+BreadcrumbList+Person на 191 URL | Yandex/Google rich-snippets, +CTR +12-18% (sustained industry data) |

**Реализация:** US-4 `composer.ts` + 2 helper в `jsonld.ts`. Detail в `sa-seo.md` §2.

### Leverage 2: Programmatic SD coverage 5/5 vs 1/15

| Параметр | Liwood | Обиход target | Δ |
|---|---:|---:|---|
| Pillars с programmatic SD | 1 (только удаление деревьев) | 5 (все pillar) | +400% |
| Total SD URLs | 47 | 150 | +220% |
| Cities per pillar | 47 | 30 (×5 = 150) | различная стратегия — wider vs deeper |

**Whitespace impact:** на запросы вида `<обрезка|опрыскивание|чистка крыш|вывоз мусора|демонтаж> + <город>` у liwood **нулевая страница** (T2 pillar — generic, без city). У нас — taргет SD на каждую комбинацию.

**Конкурентский эффект:** 5 pillar × 30 cities = 150 SD; arborist.su и arboristik.ru тоже не делают city-SD — это полный whitespace в нише.

### Leverage 3: Anti-thin-content

| Параметр | Liwood T4 | Обиход T4 target |
|---|---|---|
| City-specific доля контента | 8-12% (H1+intro+микрорайоны) | 25-30%+ (hero ≥150 слов с landmarks + 3 city-FAQ + локальная цена + mini-case) |
| Локальные фото | нет (generic-галерея) | да (gallery[] из Services + photoGeo EXIF из Districts) |
| AggregateRating per SD | нет | да (из reviews per district + global fallback) |
| `noindexUntilCase` gate | нет (все 47 в индексе, но 28% без Title) | да (sustained требование `requireGatesForPublish`) |
| `uniquenessScore≥60%` enforce | нет | да (US-3 beforeValidate hook) |

**Защита от Yandex penalty:** наши 90 Class-B SD проходят manual review cw + brand-voice skill check. Liwood penalty risk у нас минимизирован.

### Leverage 4: Калькулятор «фото→смета» через Claude API

Liwood `/info/calculator/` — статичный 5-step симулятор (форма с заглушкой расчёта). У нас sustained `/kalkulyator/foto-smeta/` (US-8 EPIC-SEO-COMPETE-3 deployed) — реальный AI-расчёт через Claude API + prompt cache.

**Mapping в EPIC-SEO-USLUGI:**
- T2 pillar: CTA «Загрузите фото — получите смету» (sustained) встроен в hero
- T4 SD: тот же CTA + city-pre-filled (district-aware расчёт)
- T1 hub: главная CTA на калькулятор как entry-point

### Leverage 5: E-E-A-T (Author + Modified date + reviewedBy)

Liwood:
- Блог 80-90 статей **без author**, **без published-date**, **без modified-date**
- Услуги без `reviewedBy`
- Нет Person schema нигде

Обиход target:
- T4 SD: `reviewedBy` (sustained `ServiceDistricts.ts:251`) → Author Person в JSON-LD
- T2 pillar: добавить `reviewedBy` relationship в US-3 (Services collection extension)
- T3 sub: same reviewedBy от parent service
- Все URL: `lastReviewedAt` → `Article.dateModified` (Yandex hint для freshness signals)

## 6. Сильные стороны liwood (учим, копируем)

1. **Mega-menu как city-distributor** (47 city-ссылок в выпадашке) — даёт SEO-перелинковку с каждой страницы. **Берём.**
2. **«10 причин» + «сам vs специалист»** на T2 pillar — content-marketing внутри commercial-страницы. **Берём, расширяем под brand-voice.**
3. **30+ микрорайонов в подвале city-страниц** — hyper-local long-tail. **Берём, с реальными landmarks из Districts collection.**
4. **Калькулятор как воронка** (даже статичный). **Берём, делаем реальным через Claude API.**
5. **Я.Карта объектов** на главной — visual social proof. **Берём в US-2 макетах.**
6. **Title с телефоном** на главной — рост CTR. **Берём в US-4 metadata.ts.**

## 7. Слабые стороны liwood (наши точки обгона)

1. **JSON-LD = 0** на 169 URL — главный leverage обгона.
2. **T4 Title часто пустой** → 28% URL не индексируются.
3. **city-страницы только под 1 услугу** (47 URL у liwood; 14 других pillar — 0 city). 5 pillar × 30 city = 150 = +220% URL volume у нас.
4. **HTTP 404 на `/balashikha/`** при наличии в mega-menu — техдолг. Проверяем при US-3 seed что наш balashikha не получит ту же судьбу.
5. **Reviews без AggregateRating + без фото + без дат** — SEO-zero.
6. **Блог без Author/Article schema** — E-E-A-T 0/10.
7. **Калькулятор статичный** (заглушка) — наш `/kalkulyator/foto-smeta/` реальный.
8. **Галерея без «до/после», без описания клиента/района** — кейс-формат отсутствует.
9. **City-страницы без локальных фото** — generic. Наш target: `photoGeo` EXIF + локальные кейсы из `ServiceDistricts.miniCase`.
10. **Адрес офиса liwood в Москве** на city-страницах — снижает E-E-A-T на city-уровне. Наш ход: `LocalBusiness` schema с district-scoped адресом + телефоном.

**Liwood SEO-зрелость T4: 4/10**. **Наш target T4: 9+/10** при 100% JSON-LD coverage + 25-30% city-specific контента.

## 8. Контрольные позиции для US-8 monitoring (week-4 после deploy)

После того как 191 URL индексируются Yandex/Google (week-1 → IndexNow ping → week-4 stable), отслеживаем top-80 commercial keys (sustained `seosite/02-keywords/raw/` filtered by intent=commercial AND wsk≥3) — где по 80+ ключам мы должны быть в top-10. Отдельно для SD-keys (vyvoz-musora-balashikha pattern) — ожидаем top-3 для wsfreq≥500.

Sustained baseline (Keys.so 2026-05-06):
- liwood: 5097 keys в топ-50
- Обиход: ~2300 keys в top-50 (после Stage 1-3 SEO-CONTENT-FILL)
- Target W22: 4500+ keys в top-50, в т.ч. ≥80 в top-10

## Hand-off log

```
2026-05-07 · research-agent: sustained liwood-page-templates-analysis-2026-05-07.md (общий паспорт под EPIC-SEO-COMPETE-3)
2026-05-08 · poseo + sa-seo: extend под EPIC-SEO-USLUGI focus, добавлены 17-pillar inventory, T2/T3/T4 DOM-paspport, 5 leverage detail, 10 weakness checklist
2026-05-08 · sa-seo → poseo: passport-final готов
```
