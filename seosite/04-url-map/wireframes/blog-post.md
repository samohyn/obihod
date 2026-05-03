---
type: blog-post
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

# Wireframe: Blog Post

## URL pattern
`/blog/[slug]/` — 30 статей к W14 (cornerstone в US-1, M2 в US-3, M3 в US-5).
Эталон W3 — `/blog/chto-takoe-4-v-1/` (#1 темника).

## Цель
Info-SEO + **нейро-цитируемость** (Я.Нейро / Алиса / Perplexity / Google AI Overview через TLDR + FAQ + таблицы) + cross-link на pillar/sub. Каждая статья — точка входа в воронку, ведёт к /<pillar>/ или к /foto-smeta/.

## Источники в плане
- План §«Page Templates → 5. Blog Post».
- Sitemap §«Блог» (60-100 статей за год, темник Wave 2 22 кластера).
- Brand-guide §6 Type, §13 TOV, §14 Don't.

## Hierarchy (desktop ASCII wireframe, max-width 1280, 3-col article 800-960 + sidebar 320)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › Блог › Что такое 4-в-1                      |
+----------------------------------------------------------------------+
| [HERO — author-led, max-w 960 col 2/3 + author-card sidebar 1/3]     |
|  eyebrow: «Блог · 4-в-1»                                             |
|  H1 (40/48 -0.02): «Что такое "4-в-1" у Обихода —                    |
|   как одна бригада закрывает 4 работы»                               |
|  meta-row:  ┌─────────────┐                                          |
|             │author-avatar│ Бригада вывоза Обихода                   |
|             │silhouette   │ 25 апреля 2026 · 8 мин чтения            |
|             └─────────────┘                                          |
|  cover image (16:9, max-w 960, fal.ai)                               |
+----------------------------------------------------------------------+
| [TLDR aside]   ← ключ для нейро-SEO                                  |
|  «Если коротко: 4-в-1 — это когда одна бригада приезжает с           |
|   нужной техникой и закрывает 4 разных работы за один выезд:         |
|   мусор, деревья, крыши, демонтаж. Обходится дешевле, чем            |
|   звать 4 подрядчиков.»                                              |
+----------------------------------------------------------------------+
| [TEXT-CONTENT col 2/3 + sticky TOC col 1/3]                          |
|  H2 «Откуда взялось 4-в-1»                                           |
|  H2 «Какие 4 работы входят»                                          |
|     ← TABLE: «работа · техника · бригада · цена-якорь»               |
|       (нейро-формат для Я.Нейро snippet)                              |
|  H2 «Когда 4-в-1 окупается, а когда — нет»                           |
|  H2 «Сколько стоит» ← конкретные числа («12 800 ₽ за объект»)        |
|  H2 «Документы и СРО»                                                |
|  ≥800 слов (1200-1800 целевое), H2 с supplement keys                 |
+----------------------------------------------------------------------+
| [FAQ]                                                                |
|  H2: «Частые вопросы про 4-в-1»                                      |
|  ▸ Можно заказать только 1 работу?                                   |
|  ▸ Что входит в фикс-цену?                                           |
|  ▸ Кто платит за полигон?                                            |
|  ▸ Как заказать 4-в-1?                                               |
|  3-5 Q&A в конце статьи, generateFaqPageSchema=true                  |
+----------------------------------------------------------------------+
| [CTA-BANNER]                                                         |
|  variant: dark, accent: warning                                      |
|  H2: «Получите смету за 10 минут»                                    |
|  «Пришлите фото объекта — рассчитаем по 4 работам сразу»             |
|  [CTA primary] /foto-smeta/ →                                        |
+----------------------------------------------------------------------+
| [RELATED-SERVICES]   ← cross-link на pillar                          |
|  H2: «Что делаем по этим работам»                                    |
|  3 cards: /vyvoz-musora/ · /arboristika/ · /chistka-krysh/           |
+----------------------------------------------------------------------+
| [RELATED-POSTS опц.]                                                 |
|  H2: «Похожие статьи»                                                |
|  2-3 cards: /blog/<slug>/                                            |
+----------------------------------------------------------------------+
| Footer (общий)                                                       |
+----------------------------------------------------------------------+
```

## Hierarchy (mobile ASCII wireframe, ≤640px)

```
+----------------------+
| Header sticky        |
+----------------------+
| Breadcrumbs          |
+----------------------+
| HERO stacked         |
|  H1 28/36            |
|  meta-row (avatar +  |
|  author + date +     |
|  reading-time)       |
|  cover image 16:9    |
|  alt описательный    |
+----------------------+
| TLDR aside           |
+----------------------+
| TOC accordion        |
| (collapsed default)  |
+----------------------+
| TEXT-CONTENT 1col    |
| body 16/26 line-len  |
| 35-60 ch             |
| H2 stack, table      |
| scroll-x              |
+----------------------+
| FAQ accordion        |
+----------------------+
| CTA-BANNER stacked   |
+----------------------+
| RELATED-SERVICES     |
| swipe 1.2            |
+----------------------+
| RELATED-POSTS swipe  |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → Блог → <Статья> | BreadcrumbList JSON-LD |
| 2 | hero (blog variant) | ✓ | H1 + author-meta + date + reading-time + cover image | один `<h1>`, image alt описательный, time `<time datetime="ISO">` |
| 3 | tldr | ✓ | 2-3 предложения нейро-ответа | aside aria-label |
| 4 | text-content | ✓ | ≥800 слов, H2/H3, table нейро-формат, sticky TOC | heading, table th-scope+caption, lang ru |
| 5 | faq | ✓ | 3-5 Q&A в конце, FAQPage schema | aria-expanded/controls |
| 6 | cta-banner | ✓ | Смета 10 минут → /foto-smeta/ | dark variant контраст ≥4.5:1 |
| 7 | related-services | ✓ | 2-3 card → pillar/sub | section aria-labelledby, cards as `<a>` |
| 8 | related-posts | ◯ | 2-3 card → /blog/ | section aria-labelledby |

**Отличие от Pillar:** hero — author-led (avatar + meta + reading-time), нет lead-form (вместо неё cta-banner на /foto-smeta/), нет mini-case (это статья, не услуга), есть `related-posts`.

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow** (103 blog + 1051 новость, но автоген):
  - Каждая наша статья — author-led (автор-объект + photo silhouette + cross-domain VK/TG sameAs); их статьи без авторов. **E-E-A-T выше.**
  - Структура TLDR + table + FAQ системно — 100% нейро-формат; их без TLDR/таблиц.
  - Cross-link на pillar/SD из каждой статьи; их blog — silo.

- **vs liwood.ru** (85 blog — контент-эталон арбо):
  - Стартуем 30 статей → к M9 целимся 85 (паритет + 4-в-1 cross-pillar). На каждой — обязательный `cta-banner` на `/foto-smeta/`; у liwood blog без USP-CTA.
  - Author-meta с silhouette + cross-domain — у liwood нет авторов.

- **vs fasadrf.ru** (148 blog — контент-эталон extra-niche):
  - 100% TLDR + FAQ + таблицы (нейро-формат) — fasadrf близко, но не системно.
  - Каждая статья — cta-banner на /foto-smeta/ (USP), у fasadrf нет аналога.

## Mobile considerations

- **Hero stacked:** H1 → meta-row (avatar 40px + author-name + date + reading-time на 2 строках) → cover image (16:9 fixed aspect, lazy).
- **TOC accordion** после TLDR (sticky header опционально через intersection-observer).
- **Table** в text-content: scroll-x с visible affordance, `<caption>` для контекста.
- **Reading-time:** «8 мин чтения» — рассчитан из word-count (≈250 wpm).

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Hero `<time datetime="2026-04-25">` для машин-парсера
- [ ] Cover image alt описательный, или `role="presentation"` если decorative
- [ ] Author avatar — `<img alt="Аватар: Бригада вывоза Обихода">` (silhouette)
- [ ] Author name — link к `/avtory/brigada-vyvoza-obihoda/`
- [ ] FAQ disclosure
- [ ] Table th-scope + caption
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion
- [ ] Reflow 400%

## SEO annotations

- **H1:** info-key из темника (например, «Что такое 4-в-1 у Обихода»). Длиннее чем pillar H1, может содержать вопрос.
- **H2 supplement keys:** из cluster `neuro-info.md`.
- **JSON-LD:**
  - `Article` (`headline`, `author: {Person/Organization}`, `datePublished`, `dateModified`, `publisher: Organization Обиход`, `image`).
  - `FAQPage` (через faq-блок).
  - `BreadcrumbList`.
- **Canonical:** self.
- **og/twitter:** с cover image 1200×630.
- **Author:** ссылка на `/avtory/<slug>/` (внутренний backlink, E-E-A-T).
- **Internal links:** related-services 2-3 на pillar/sub; related-posts 2-3 на /blog/<slug>/.

## TOV constraints

- H1 — без «вы / ваш» (Caregiver TOV — мы делаем, а не «вы получите»).
- TLDR с конкретикой («одна бригада», «4 работы», «12 800 ₽» если уместно).
- В text-content числа конкретно («~6 лет», «8 районов», «250 объектов в год» — если есть данные; если нет — без выдуманных).
- НЕ: «индивидуальный подход», «оперативно», «качественно», «спектр услуг». <!-- obihod:ok -->
- НЕ восклицания, НЕ эмодзи, НЕ capslock.

## Эталонный URL для W3
`/blog/chto-takoe-4-v-1/` (#1 темника, brand-cluster 7947 freq на «4 в 1 услуги»).

## Открытые вопросы для poseo / art

1. **Reading-time расчёт:** автоматически из word-count или вручную в Payload? Рекомендация ux: автоматически (250 wpm RU), отображать round-up до min.
2. **Author avatar в hero — silhouette circle 40px** или quadrate? Рекомендация ux: circle (стандартный pattern), фон карточки `--c-card`, image silhouette `companyAuthorAvatarPrompt` fal.ai.
3. **Sticky TOC desktop** — обязательно или опционально для блога? Рекомендация ux: для постов ≥1200 слов — обязательно (улучшает scan-ability и dwell-time).
4. **CTA-banner на /foto-smeta/ vs lead-form inline:** в эталоне `/blog/chto-takoe-4-v-1/` — что выбираем? Рекомендация ux: cta-banner (single CTA, focus, не отвлекает от чтения; lead-form встроенная — стандартный анти-pattern для blog UX, лучше переход на dedicated USP-pillar).

## Art review · 2026-05-01

**Status:** approved (clean).

**Что apruv'нуто:**
- Author-led hero (avatar silhouette + meta-row) — соответствует §14 «без лиц», §13 TOV (Caregiver «бригада», не «личный гуру»).
- TLDR + table + FAQ нейро-формат — system-wide блок-композиция OK.
- CTA-banner на /foto-smeta/ (вместо inline lead-form) — apruv (anti-pattern lead-form в блог-статье согласуется с UX best practice).

**Visual guidance:**
- Cover image 16:9, max-w 960, `--radius` 10px, lazy-loaded с width/height для CLS<0.1.
- Avatar silhouette circle 40px desktop / mobile, фон `--c-card`, `companyAuthorAvatarPrompt` fal.ai.
- Reading-time mono 12px `--c-muted` (§6 mono-numbers, JetBrains Mono).
- TOC sticky desktop ≥1200 слов — обязательно (apruv ux рекомендации).
- CTA-banner: dark variant `--c-ink` background, accent border-left 4px `--c-accent`, контраст ≥4.5:1 для white-on-ink.

**fal-prompt direction для cover:**
- Документальный иллюстративный стиль (§14 «фотостиль документальный»).
- **Без рукопожатий** (§14 anti).
- **Без эмодзи-декораторов** в title (§14 anti, §13 TOV).
- Без капслока H1 (§14 anti).
