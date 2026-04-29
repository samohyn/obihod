# US-6 wave 2A — UX + UI spec (3 routes × list+detail)

**Авторы:** ux + ui
**Статус:** approved (art)
**Дата:** 2026-04-27

## Scope

3 публичные ветки навигации, ранее созданные данные wave 1 (3 Authors + 5 Blog + 3 B2B) разблокируются для индексации:

| Ветка | List | Detail |
|---|---|---|
| Авторы | `/avtory/` | `/avtory/[slug]/` |
| Блог | `/blog/` | `/blog/[slug]/` |
| B2B | `/b2b/` | `/b2b/[slug]/` |

## Персоны (источник — `agents/ux/personas.md`)

- `/avtory/` — посетитель проверяет E-E-A-T (P-B2B-UK / P-B2C-DACHA при сомнениях)
- `/blog/` — поисковый трафик из нейро-кластера (любая персона)
- `/b2b/` — P-B2B-UK / P-B2B-FM / P-B2B-BUILD

## CJM ключевых сценариев (короткие)

### CJM-A: посетитель блог-статьи (нейро/google)
1. Поиск «штрафы ГЖИ за сосульки» → `/blog/shtrafy-gzhi-sosulki/`
2. Reading: lead → секции → links
3. Скролл к автору (E-E-A-T) → `/avtory/dmitriy-volkov-b2b/`
4. CTA в конце статьи: messenger или `/b2b/uk-tszh/` для углубления
5. **Цель:** конверсия в `/b2b/uk-tszh/` или прямой messenger.

### CJM-B: B2B покупатель (УК)
1. Search «договор УК с подрядчиком условия» → `/blog/dogovor-uk-podryadchik-5-punktov/`
2. Reading → cross-link на `/b2b/uk-tszh/`
3. На `/b2b/uk-tszh/` — описание услуг + кейс-block + CTA на messenger
4. **Цель:** запрос договора через `<CtaMessengers />`.

## Wireframes (без визуала, структура секций)

### `/avtory/` (list)
```
[Hero bg-bg-alt]
  Breadcrumbs · Главная / Авторы
  H1: «Эксперты Обихода»
  Lead: «Бригадиры, эксперты по договорам и арбористы — кто отвечает за качество работ.»

[Авторы grid 3-col на desktop, 1-col на mobile]
  AuthorCard × N
    avatar (круг, 96px) | fullName | jobTitle | knowsAbout (2-3 chip-tag)
    [link → /avtory/[slug]/]

[CtaMessengers] — единый паттерн
[Footer]
```

### `/avtory/[slug]/`
```
[Hero bg-bg-alt]
  Breadcrumbs · Главная / Авторы / [fullName]
  H1: fullName
  Lead: jobTitle

[Profile section]
  Колонка-1: avatar (200px) | sameAs[] (LinkedIn, Telegram если есть)
  Колонка-2:
    H2 «О специалисте» → bio
    H2 «Темы экспертизы» → knowsAbout как chip-list
    H2 «Сертификаты и образование» → credentials как list (name + issuer + issuedAt)

[Articles by author] (опционально wave 2B — связь Blog.author → Authors)
  «Статьи Дмитрия в блоге Обихода»
  BlogCard × N

[CtaMessengers]
[JsonLd: Person + BreadcrumbList]
```

### `/blog/` (list)
```
[Hero bg-bg-alt]
  Breadcrumbs · Главная / Блог
  H1: «Блог Обихода — справочник по 4 услугам»
  Lead: «Спил, чистка крыш, вывоз мусора, демонтаж — что делаем, как считаем, что важно знать перед заказом.»

[Filter: 7 категорий] (chip-кнопки, query ?category=arbo|sneg|musor|demontazh|b2b|regulyatorika|evergreen)

[Articles grid 2-col на desktop, 1 на mobile]
  ArticleCard × N
    heroImage (если есть) | title | intro (clamp-2) | meta: category + date + reviewedBy?
    [link → /blog/[slug]/]

[Pagination или «Показать ещё» — на старте без пагинации, лимит 50]
[CtaMessengers]
```

### `/blog/[slug]/`
```
[Hero bg-bg-alt]
  Breadcrumbs · Главная / Блог / [title]
  H1: title
  Meta-bar: category badge | publishedAt | author («автор: Алексей Семёнов» → /avtory/...) | reviewedBy?
  HeroImage 16:9 (если есть)

[Article content max-w-prose]
  intro как lead-абзац (textarea)
  RichTextRenderer (lexical) — body
  isHowTo=true → HowTo schema (steps уже в БД)

[FAQ block — если faqBlock.length > 0]
  H2 «Вопросы и ответы»
  AccordionItem × N

[Author card — small inline]
  «Об авторе» с link на /avtory/[slug]/

[Related articles — wave 2B]

[CtaMessengers]
[JsonLd: Article + Author + (FAQPage если faqBlock) + (HowTo если isHowTo) + BreadcrumbList]
```

### `/b2b/` (list/overview)
```
[Hero bg-primary text-on-primary py-16]
  Breadcrumbs · Главная / B2B
  H1: «Обиход для бизнеса»
  Lead-bg-primary-ink: «УК, ТСЖ, FM-операторы, застройщики, госзаказ. Сезонные и годовые контракты с переносом штрафов ГЖИ и ОАТИ.»
  CTA: «Запрос договора» → CtaMessengers с pre-filled темой

[5 audience-cards 5-col на desktop, 1 на mobile]
  - УК и ТСЖ → /b2b/uk-tszh/
  - FM-операторы → /b2b/fm-operatoram/ (placeholder если нет)
  - Застройщики
  - Госзаказ 44/223-ФЗ
  - Штрафы ГЖИ/ОАТИ → /b2b/shtrafy-gzhi-oati/ (отдельный спец-page)

[Что в договоре — 4 пункта icon-grid]
  фикс-цена | штрафы ГЖИ | страховка 10М | акт об утилизации

[Кейсы B2B - placeholder wave 2C]
[CtaMessengers — B2B-вариант]
```

### `/b2b/[slug]/`
```
[Hero bg-bg-alt]
  Breadcrumbs · Главная / B2B / [title]
  Audience badge: УК и ТСЖ / FM / ...
  H1: h1
  Lead intro (1-2 параграфа)

[Article content max-w-prose]
  RichTextRenderer (lexical) — body
  Подсветка цены / срока / условия — accent через b2b-stat-block (TBD)

[Если krishaShtraf=true — спец-callout]
  Callout-card: «Штрафы ГЖИ и ОАТИ — на Обиходе. Это пункт договора, не маркетинг.»

[Кейсы (casesShowcase) — wave 2B + cases data]

[CTA-формa — wave 2B (формы запроса договора)]
[CtaMessengers — B2B-вариант с темой «Запрос договора»]
[JsonLd: Service (если применимо) + BreadcrumbList]
```

## Component spec для `fe1/fe2`

### `AuthorCard.tsx` (новый)
Props: `{author: Author; variant: 'grid' | 'inline'}`. Состояния: default, hover (border-primary/40).

### `BlogCard.tsx` (новый)
Props: `{post: BlogPost}`. Если `heroImage` нет — placeholder с category-цветом.

### `ArticleCategoryBadge.tsx` (новый)
Props: `{category: 'arbo' | 'sneg' | ...}`. Маппинг category → label + accent-color.

### `B2BAudienceCard.tsx` (новый)
Props: `{title; description; href; icon?}`. Используется только на `/b2b/`.

### `<RichTextRenderer />` — переиспользуем существующий из `components/marketing/RichTextRenderer.tsx`.

## A11y требования

1. `<h1>` ровно 1 на каждой странице.
2. Все intеractive — `min-h-11 min-w-11`.
3. Card link всё-card-clickable, но focus-target — `<a>` обёрнутый в card (не overlay span).
4. Author avatar — `<img alt={fullName}>`.
5. RichTextRenderer уже даёт корректный heading levels.
6. Filter chips на `/blog/` — `<button>` с `aria-pressed`.

## Tokens used (whitelist)

Все стили — только через токены из `agents/brand/handoff.md`. **Запрещено**: `text-stone-*`, `text-orange-*`, `bg-amber-*` etc Tailwind палитру.

## DoD ux+ui

- [x] Wireframes 6 страниц
- [x] CJM 2 ключевых сценария
- [x] A11y чеклист
- [x] Component spec
- [x] Token whitelist согласован с art
