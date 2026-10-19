---
us: US-2
title: SA-SEO US-2 — техспек 4 newui/ макетов (T1/T2/T3/T4)
team: seo
po: poseo
type: spec
priority: P0
phase: spec
role: sa-seo
status: active
created: 2026-05-08
updated: 2026-05-08
---

# US-2 SA-SEO — общий техспек 4 макетов

## Общие требования (ВСЕ 4 макета)

### Source of truth

- **Стили/токены/компоненты:** `design-system/brand-guide.html` v2.2 (services §1-14 + §33 site chrome canonical)
- **Shared CSS:** `newui/brand-guide-styles.css` + `newui/homepage-shared.css` (НЕ инлайнить — `<link rel="stylesheet">`)
- **Tokens:** `design-system/tokens/{colors,typography,spacing,radius,shadow,breakpoints,motion,typography-scale}.json` — зеркало `site/app/globals.css`

### CSS-конвенции

- Используем **CSS variables** из `:root` (`--c-primary`, `--c-accent`, `--c-ink`, `--c-bg`, `--c-line`, `--c-muted`, `--radius`, `--radius-sm`, `--radius-lg`)
- НЕ inline styles в HTML кроме `style="..."` для DEMO-данных в placeholders
- Локальные правила — только в `<style>` блоке внутри `<head>`, префикс класса `t1-` / `t2-` / `t3-` / `t4-` для изоляции
- Mobile-first: базовые правила без media-query, `@media (min-width: 768px)` для tablet+, `@media (min-width: 1024px)` для desktop

### Breakpoints (sustained `design-system/tokens/breakpoints.json`)

```
mobile-sm  360px   Android legacy minimum
mobile-md  390px   iPhone 13/14/15
mobile-lg  414px   iPhone Plus / Pro Max
tablet     768px   Портретный iPad
tablet-lg  1024px  Landscape iPad / desktop entry
```

**Test viewports US-2:** 375 (закрывает 360-414 mobile диапазон) / 414 (largest mobile) / 768 (tablet) / 1024 (desktop entry).

### Site chrome (sustained §33 brand-guide canonical)

Все 4 макета имеют ровно **один Header + один Footer**, идентичный для всего сайта:

- **Header:** sticky, white bg, logo «ОБИХОД» (кириллица), nav (5 pillar mega-menu для T2/T3/T4, простая навигация для T1), 2 phone-кнопки (Telegram + WhatsApp), CTA «Заказать»
- **Footer:** 4 колонки (Услуги / Магазин / О компании / Контакты), social icons (VK, Telegram, MAX), 152-ФЗ disclaimer, год copyright, ссылка на политику cookie

### TOV (sustained §13 brand-guide)

- Caregiver + Ruler — забота + порядок, не «продажный bro», не «чиновник»
- Глаголы конкретные: «приедем за 2 часа», «вывезем за смену», «увезём с участка»
- Без капcлока, без эмодзи, без «гарантия 100%», без «лучшие на рынке»

### Anti-Тильда (sustained §15 brand-guide Don't)

- Никаких градиентных героев с photoshopped людьми
- Никаких stock-фото с фронта (фото только реальных объектов / районов / сотрудников)
- Никаких sticky-всплывающих popup'ов «Не уходите!»
- Никаких CSS-tricks вроде skew-перспективы / parallax

### JSON-LD (sustained `site/lib/seo/jsonld.ts` patterns)

Каждый макет имеет в `<head>` JSON-LD блок'и **с placeholder data** (структура верна, данные stub):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Вывоз мусора",
  "provider": { "@type": "Organization", "name": "Обиход" },
  ...
}
</script>
```

US-4 (tech) заменит placeholder на dynamic data из Payload через `composer.ts` (sustained sa-seo.md US-1 §2).

### CTA «Фото → смета» (sustained leverage 4 liwood-passport)

Все 4 макета имеют entry-point CTA на `/kalkulyator/foto-smeta/`:
- T1 hub: главная hero CTA
- T2/T3/T4: hero + повтор в bottom-CTA блоке

### Accessibility (sustained §11 brand-guide errors / WCAG 2.2 AA)

- `<button type="button">` для всех clickable elements (не `<div>`)
- `aria-label` на icon-only buttons
- `<nav>` с `aria-label="Главная навигация"` etc
- focus visible state (`outline: 2px solid var(--c-primary)`)
- `<img alt="...">` обязательно (decorative — `alt=""`)
- color contrast ≥4.5:1 для body text (sustained `design-system/tokens/colors.json` уже passes)

## Per-template detail

### T1 Hub — `newui/uslugi-hub.html`

**URL pattern:** `/uslugi/`
**Цель:** entry-point в раздел услуг, 5 pillar карточек как liwood/services/, но с JSON-LD ItemList + AggregateRating + breadcrumbs.

**Блоки сверху вниз:**
1. Header (sustained chrome)
2. Breadcrumbs: Главная → Услуги
3. Hero: H1 «Услуги для дома, дачи и B2B», 1-2 предложения intro, 2 CTA (главная: «Загрузите фото — получите смету»; вторичная: «Позвонить +7…»)
4. **5 pillar grid cards** (3 col desktop / 2 col tablet / 1 col mobile):
   - Иконка (line-art из brand-guide §8 icons, 22 services-icons available)
   - H2/h3 название pillar
   - 1 предложение про pillar
   - priceFrom badge («от 1 500 ₽»)
   - 4-6 sub-услуги списком ссылок (preview)
   - CTA «Подробнее»
5. **Why us bar** — 4 trust-карточки (лицензия 152-ФЗ / договор с актами / 24/7 / 7+ лет опыт)
6. **AggregateRating block** — звёзды + цифра «4.9/5 на основе 247 отзывов» + ссылка на /otzyvy/
7. **Photo→smета CTA** — повтор главного CTA с превью продукта
8. Footer (sustained chrome)

**JSON-LD:** Organization + WebSite + ItemList(5 pillars) + BreadcrumbList

### T2 Pillar — `newui/uslugi-pillar.html`

**URL pattern:** `/<pillar>/` (демо: `/vyvoz-musora/`)
**Цель:** MOFU выбор услуги. Конкурент liwood T2 — 2500-3000 слов, у нас столько же объёма + JSON-LD + AggregateRating + Author.

**Блоки сверху вниз:**
1. Header
2. Breadcrumbs: Главная → Услуги → Вывоз мусора
3. Hero: H1 «Вывоз мусора в Москве и МО», lead-paragraph (~80 слов), 2 CTA (фото→смета + телефон)
4. Key metrics plate: 3 ячейки (от X ₽ / выезд от 2ч / Москва + 30 районов МО)
5. **Sub-services grid** — 8-10 карточек sub-услуг с превью + priceFrom (как liwood T2 §«грид sub-услуг»)
6. **Photo→smета CTA** (mid-page)
7. **Pricing matrix** — таблица «вид мусора × объём → цена» (4-8 строк)
8. **Process block** — 4-5 шагов процесса работы (1. Звонок → 2. Выезд → 3. Расчёт → 4. Работа → 5. Документы)
9. **Why us block** — 6-8 trust-карточек (sustained liwood T2 «Почему мы»)
10. **«10 причин» content-marketing block** — 10 коротких параграфов про преимущества (LSI +800 слов)
11. **«Сам vs специалист» compare table** (sustained liwood T2 leverage)
12. **FAQ section** — 6-8 вопросов аккордеон (с JSON-LD FAQPage)
13. **Cases gallery** — 6-9 фото-карточек реальных объектов (с описанием района/задачи)
14. **City list block** — 30 city-ссылок «<сервис> в <городе>» (links to T4 SD)
15. **AggregateRating + 3-4 review-cards** (sustained leverage 5)
16. **Author block** — фото + имя + должность + «Reviewed by ...» дата (E-E-A-T)
17. **Final CTA** — повторная форма
18. Footer

**JSON-LD:** Organization + Service(pillar) + AggregateRating + FAQPage + BreadcrumbList

### T3 Sub — `newui/uslugi-sub.html`

**URL pattern:** `/<pillar>/<sub>/` (демо: `/vyvoz-musora/vyvoz-stroymusora/`)
**Цель:** конкретный intent. Liwood T3 — 1800-2000 слов без city-ссылок. У нас столько же + JSON-LD + Author + AggregateRating.

**Блоки сверху вниз:**
1. Header
2. Breadcrumbs: Главная → Услуги → Вывоз мусора → Вывоз строительного мусора
3. Hero: H1 sub-specific, lead ~60 слов, 2 CTA
4. **«Зачем нужен» block** — 1 параграф + 4 ситуации
5. Pricing block (sub-specific table)
6. **Photo→smета CTA**
7. **Methods block** — 5 методов выполнения (T3 unique vs T2 — sustained liwood leverage)
8. Process steps (4-5)
9. **Why us** (4-6 trust)
10. Cases (4-6 фото)
11. FAQ (3-5 вопросов)
12. **AggregateRating + 2 review-cards**
13. **Related sub-services** — 3 sub-услуги из same pillar (cross-link)
14. **Author block** (E-E-A-T)
15. Final CTA
16. Footer

**JSON-LD:** Organization + Service(sub-scoped) + FAQPage + BreadcrumbList

### T4 SD — `newui/uslugi-service-district.html`

**URL pattern:** `/<pillar>/<city>/` (демо: `/vyvoz-musora/balashikha/`)
**Цель:** programmatic SD, **главный leverage обгона** (5 pillar × 30 city = 150 SD vs liwood 47 SD). Anti-thin-content гарантии.

**Блоки сверху вниз (15+ секций):**
1. Header
2. Breadcrumbs: Главная → Услуги → Вывоз мусора → Балашиха
3. Hero split-layout (text left, photo placeholder right): H1 «Вывоз мусора в Балашихе», lead ≥150 слов с city + landmark mentions, 2 CTA + 3 phone-buttons
4. **Key metrics plate** — 3 ячейки (от X ₽ / выезд за 2ч / 30+ микрорайонов Балашихи)
5. **Service types** — 7-8 карточек типов (бытовой / стройМ / КГМ / контейнер / снег / грунт)
6. **Photo→smета CTA** (city pre-filled)
7. **Pricing matrix** — дифференцированный прайс с city-specific markup note
8. **Process block** — 4-5 шагов (city-specific сроки выезда)
9. **Why us** — trust + b2b логотипы УК города
10. **FAQ** — 6-10 вопросов city-specific (УК, ПМЖ, контейнерные площадки)
11. **Hyper-local geography** — список 25+ микрорайонов Балашихи (Железнодорожный, Дзержинский, Купавна, etc.) + landmarks (центральная площадь, ж/д станция, etc.)
12. **AggregateRating + 4 city-specific review-cards** (с фото отзывов от клиентов в Балашихе)
13. **B2B CTA block** — отдельная форма для УК/ТСЖ (безнал, договор, документы)
14. **Author block** — фото + имя + должность + «Текст подготовлен <author>, обновлено YYYY-MM-DD» (E-E-A-T)
15. **Related cities** — 5 соседних городов (Реутов, Железнодорожный, Люберцы, Электросталь, Ногинск) cross-link
16. Final CTA — повтор формы + мессенджеры
17. Footer

**JSON-LD:** Organization + LocalBusiness(district-scoped, address Балашиха) + Service(district-scoped) + FAQPage + BreadcrumbList + Person(Author)

**Placeholder convention для tokens (US-4 заменит):**
- `{{service}}` / `{{Service}}` — slug / Capitalized
- `{{district}}` / `{{District}}` / `{{Districtprep}}` — slug / Nominative / Prepositional
- `{{authorName}}`, `{{authorRole}}`, `{{lastReviewedAt}}`
- `{{microDistrictsList}}` — 25+ микрорайонов
- `{{localPriceRange}}`, `{{localResponseTime}}`

## AC матрица per template

| AC | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| Файл создан | ✓ | ✓ | ✓ | ✓ |
| H1 один на странице | ✓ | ✓ | ✓ | ✓ |
| `<meta name="viewport">` mobile-first | ✓ | ✓ | ✓ | ✓ |
| `<link rel="canonical">` placeholder | ✓ | ✓ | ✓ | ✓ |
| Open Graph tags | ✓ | ✓ | ✓ | ✓ |
| Header + Footer sustained chrome | ✓ | ✓ | ✓ | ✓ |
| JSON-LD блоки правильной структуры | 4 schemas | 5 schemas | 4 schemas | 6 schemas |
| Breadcrumbs visual | ✓ | ✓ | ✓ | ✓ |
| Photo→smета CTA | ✓ | ✓ | ✓ | ✓ |
| AggregateRating visual | — | ✓ | ✓ | ✓ |
| Author block | — | ✓ | ✓ | ✓ |
| 30 city-ссылок | — | ✓ | — | — |
| 25+ микрорайонов | — | — | — | ✓ |
| Hero ≥150 слов с city | — | — | — | ✓ |
| Mobile-first 375/414/768/1024 | ✓ | ✓ | ✓ | ✓ |

## Hand-off log

```
2026-05-08 · sa-seo: US-2 sa-seo.md done, передача в art (4 art briefs)
```
