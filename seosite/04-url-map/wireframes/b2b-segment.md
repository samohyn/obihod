---
type: b2b-segment
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

# Wireframe: B2B Segment

## URL pattern
`/b2b/[slug]/` — 10 страниц (5 сегментов: uk-tszh / fm-operatoram / zastrojschikam / goszakaz / dogovor-na-sezon + 2 спец: shtrafy-gzhi-oati / dogovor + 4 кейс-страницы B2B).
Эталон W3 — `/b2b/uk-tszh/` (главный B2B-сегмент, 247 ст. УК РФ + 21 freq).

## Цель
B2B-конверсия + **уникальный B2B-крючок «штрафы ГЖИ/ОАТИ берём на себя по договору»** (0/17 конкурентов) + E-E-A-T через цитату оператора как реальный B2B-автор. Воронка: B2B segment → /b2b/dogovor/ → lead с организацией+ИНН.

## Источники в плане
- План §«Page Templates → 7. B2B Segment».
- Sitemap §«B2B-вертикаль».
- Differentiation matrix §«winning angle #3 штрафы ГЖИ/ОАТИ» + #5 «реальный B2B-автор оператор с VK/TG sameAs».

## Hierarchy (desktop ASCII wireframe)

```
+----------------------------------------------------------------------+
| Header / Site chrome                                                 |
+----------------------------------------------------------------------+
| [Breadcrumbs]  Главная › B2B › Для УК и ТСЖ                          |
+----------------------------------------------------------------------+
| [HERO — B2B variant]   col1 60%                  col2 40%            |
|  eyebrow: «B2B · Управляющие компании и ТСЖ»                         |
|  H1 (44/52): «Для УК и ТСЖ —                                         |
|   штрафы ГЖИ/ОАТИ берём на себя                                      |
|   по договору»                                                       |
|  Sub: «Сезонный или круглогодичный договор. Уборка                   |
|   территории, спил аварийных, чистка крыш зимой,                     |
|   вывоз КГМ. Работаем с УК Москвы и МО.»                             |
|  [CTA primary] Запросить договор                                     |
|  [CTA ghost]   Скачать тарифы (PDF)                                  |
|  trust-row: 247 ст. УК РФ · СРО · 152-ФЗ ·                           |
|             ~6 лет · 8 районов МО                                    |
|                                                  [hero image fal.ai  |
|                                                   b2bHeroPrompt:     |
|                                                   documentary, бриг. |
|                                                   с УК-документами;  |
|                                                   no-rukopozhatie    |
|                                                   §14 anti]          |
+----------------------------------------------------------------------+
| [TLDR aside]                                                         |
|  «Если коротко: подписываем договор с УК или ТСЖ, берём штрафы       |
|   ГЖИ/ОАТИ на себя по своей зоне ответственности. Сезон или год —    |
|   тарифы фиксированные, отчётность по 152-ФЗ.»                       |
+----------------------------------------------------------------------+
| [SERVICES-GRID — 4 pillar для B2B-клиента]                           |
|  H2: «Что делаем для УК и ТСЖ»                                       |
|  +----------+ +----------+ +----------+ +----------+                 |
|  | Вывоз КГМ| | Спил     | | Чистка   | | Демонтаж |                 |
|  | (норма-  | | аварий-  | | крыш и   | | старых   |                 |
|  |  тив УК) | | ных      | | сосулек  | | построек |                 |
|  | от 12 800| | от 8 400 | | от 14 200| | от 22 000|                 |
|  +----------+ +----------+ +----------+ +----------+                 |
|  Каждая card → link к /<service>/dlya-uk-tszh/ или к pillar          |
+----------------------------------------------------------------------+
| [TEXT-CONTENT col 2/3 + sticky TOC col 1/3]                          |
|  H2 «Что в нашем B2B-договоре»                                       |
|     ← FZ-152, СРО, схема разграничения зон, штрафы — кто платит      |
|  H2 «Тарифы абонентского обслуживания»                               |
|     ← TABLE: «тип объекта · услуги · сезон · цена месяц/год»          |
|       (нейро-формат)                                                 |
|  H2 «Юридическая ответственность — ст. 247 УК РФ, КоАП»              |
|     ← legal-anchor: что закон говорит, как мы распределяем           |
|  H2 «Как заключить договор»                                          |
|     ← пошаговая инструкция, документы от УК                          |
|  ~1500 слов                                                          |
+----------------------------------------------------------------------+
| [TEXT-CONTENT — author quote блок]                                   |
|  ┌──────────────────────────────────────────────┐                    |
|  │ "В договоре мы прямо разграничиваем зону:    │                    |
|  │  УК отвечает за общедомовое имущество,       │                    |
|  │  мы — за безопасность территории. Если       │                    |
|  │  ГЖИ выписывает штраф по нашей зоне —        │                    |
|  │  оплачиваем сами, без переговоров."          │                    |
|  │                                               │                    |
|  │  ┌─────┐                                      │                    |
|  │  │avtr │ Оператор Обихода                    │                    |
|  │  └─────┘ Reference: /avtory/<operator-slug>/ │                    |
|  └──────────────────────────────────────────────┘                    |
+----------------------------------------------------------------------+
| [MINI-CASE — 2 B2B-кейса]                                            |
|  H2: «Кейсы по УК/ТСЖ»                                               |
|  +-----+ +-----+   2 cards с фото объекта (фасад МКД, не лица),      |
|  |IMG  | |IMG  |   3-4 факта (УК · сезон · объём · экономия штрафа), |
|  |fact | |fact |   ссылка → /b2b/kejsy/uk-tszh/<slug>/               |
|  +-----+ +-----+                                                     |
+----------------------------------------------------------------------+
| [LEAD-FORM — B2B variant]                                            |
|  H2: «Запросить договор»                                             |
|  Поля: Организация* (text) · ИНН* (input mask 10/12 cifr) ·          |
|         Контактное лицо · Должность · Телефон* · Email · Объекты     |
|         (textarea) · consent 152-ФЗ                                  |
|  helper: «Подготовим договор и тарифы за 1 рабочий день.»            |
|  [CTA primary] Запросить →                                           |
+----------------------------------------------------------------------+
| [FAQ]                                                                |
|  H2: «B2B-вопросы»                                                   |
|  ▸ Что в договоре про штрафы ГЖИ?                                    |
|  ▸ Как платится — помесячно или по факту?                            |
|  ▸ Можем ли мы менять объём в течение года?                          |
|  ▸ Какие объекты обслуживаете в МО?                                  |
|  ▸ Можно ли по 44-ФЗ?                                                |
|  generateFaqPageSchema=true                                          |
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
|  CTA primary 100%    |
|  CTA ghost 100%      |
|  trust-row wrap      |
+----------------------+
| TLDR aside           |
+----------------------+
| SERVICES-GRID 2x2    |
| (4 pillar tiles      |
|  с B2B-ценами)       |
+----------------------+
| TOC accordion        |
+----------------------+
| TEXT-CONTENT 1col    |
| (с table scroll-x)   |
+----------------------+
| AUTHOR-QUOTE block   |
| (полная ширина)      |
+----------------------+
| MINI-CASE swipe 1.2  |
+----------------------+
| LEAD-FORM B2B        |
| (long form, group    |
|  fieldsets)          |
+----------------------+
| FAQ accordion        |
+----------------------+
| Footer               |
+----------------------+
```

## Block composition

| # | Block | Обяз. | Контент | A11y annotations |
|---|---|---|---|---|
| 1 | breadcrumbs | ✓ | Главная → B2B → <Сегмент> | BreadcrumbList JSON-LD |
| 2 | hero (B2B variant) | ✓ | H1 «Для <УК/ТСЖ/...>» + USP «штрафы ГЖИ» + CTA | один `<h1>`, image alt B2B-документарный, CTA «Запросить» (не «Получить») |
| 3 | tldr | ✓ | B2B-ответ нейро-формат | aside aria-label |
| 4 | services-grid | ✓ | 4 pillar для B2B с B2B-ценами | section aria-labelledby, cards as `<a>` |
| 5 | text-content | ✓ | Договор + тарифы + 247 УК + как заключить | heading, table th-scope+caption |
| 6 | author-quote (внутри text-content или отдельный sub-block) | ✓ | Цитата оператора + ref на /avtory/ | `<blockquote>` + `<cite>` + link к /avtory/<slug>/ |
| 7 | mini-case | ✓ | 2 B2B-кейса (фасад МКД) | article, alt без лиц |
| 8 | lead-form (B2B variant) | ✓ | Организация+ИНН+должность+тел+email+objects | label/for, ИНН — pattern validation, fieldset+legend для groups |
| 9 | faq | ✓ | B2B-вопросы (договор, штрафы, оплата, 44-ФЗ) | aria-expanded/controls |

**Отличие от Pillar:** lead-form B2B (организация+ИНН+должность), services-grid с B2B-ценами, обязательный `author-quote` блок (E-E-A-T), `cta-banner` отсутствует (lead-form достаточно для B2B-сегмента).

## Winning angle vs топ-3 конкурентов

- **vs musor.moscow / liwood.ru:** у них есть /b2b/ или /korporativnym/, но **никто не делает «штрафы ГЖИ/ОАТИ берём на себя по договору»** — это unique winning angle.
- **vs cleaning-moscow.ru** (B2B/B2C сегментация чемпион):
  - У них есть авторы как E-E-A-T, но без cross-domain VK/TG sameAs. У нас — оператор-автор с VK/TG `sameAs` + цитата на B2B-странице (двойной E-E-A-T-signal).
  - Их B2B-сегментация — общая (один /korporativnym/), наша — 5 сегментов + 2 спец-страницы (uk-tszh / fm / zastrojschikam / goszakaz / dogovor-na-sezon + dogovor + shtrafy-gzhi-oati).
- **vs grunlit-eco.ru** (если live audit покажет B2B-чемпиона по мусору):
  - Структура договора + author-quote + 4-в-1 cross-pillar для B2B — пока pending, гипотеза они только в одной услуге.

## Mobile considerations

- **Lead-form B2B длиннее** (10 полей vs 5 у B2C) — group в `<fieldset>` с `<legend>` («Организация», «Контакт», «Объект»).
- **Services-grid 2×2** с B2B-ценами; touch target 120×120px+.
- **Author-quote** на mobile — full-width card с `<blockquote>`, цитата 16/26 + автор-meta под цитатой.
- **Table тарифов** scroll-x с visible affordance.

## A11y checklist (WCAG 2.2 AA)

- [ ] Контраст ≥ 4.5:1
- [ ] 1 H1 → H2 → H3
- [ ] Skip-link
- [ ] Lead-form: ИНН pattern `\d{10}|\d{12}` с `aria-describedby` на helper «10 для юр.лица, 12 для ИП»
- [ ] Lead-form fieldsets с legend (Организация / Контакт / Объект)
- [ ] aria-required на required, aria-invalid + role="alert" на ошибках
- [ ] Author-quote: `<blockquote><p>...</p><cite><a href="/avtory/...">Оператор Обихода</a></cite></blockquote>`
- [ ] Hero image alt: «бригада с УК-документами на объекте» (без лиц)
- [ ] Mini-case alt: фасад МКД, не лица
- [ ] FAQ disclosure
- [ ] Touch ≥44px, gap ≥8px
- [ ] Reduced-motion
- [ ] Reflow 400%
- [ ] Скачать тарифы PDF: link с `aria-label="Скачать тарифы PDF, ~120 КБ"`, расширение в text

## SEO annotations

- **H1:** «Для <УК/ТСЖ/FM/...> — <USP>» с явным сегментом.
- **H2 supplement:** «договор с УК», «штрафы ГЖИ», «247 УК РФ», «44-ФЗ» — из cluster `b2b.md`.
- **JSON-LD:**
  - `Service` (B2B-вариант, `audience: BusinessAudience`).
  - `FAQPage`.
  - `BreadcrumbList`.
- **Author signal:** ссылка на `/avtory/<operator>/` с `rel="author"`, `<cite>` в blockquote.
- **Canonical:** self.
- **Internal links:** services-grid → 4 SD/sub; cross-link в text-content на `/b2b/dogovor/` и `/b2b/shtrafy-gzhi-oati/`.

## TOV constraints

- H1 формула «Для <Сегмент> — <USP>». USP жёсткий: «штрафы ГЖИ/ОАТИ берём на себя по договору».
- Tone — Caregiver+Ruler с акцентом Ruler (договор, тариф, отчётность). НЕ «индивидуальный подход для бизнеса», НЕ «гибкие условия». <!-- obihod:ok -->
- Конкретика: «10/12 цифр ИНН», «~6 лет», «247 УК РФ», «1 рабочий день».
- Author-quote: реальная фраза оператора (от cw + apruv оператора). НЕ типа «мы команда профессионалов».
- Lead-form helper: «1 рабочий день» — конкретно. НЕ «свяжемся в кратчайшие сроки». <!-- obihod:ok -->

## Эталонный URL для W3
`/b2b/uk-tszh/` (главный B2B-сегмент, 247 ст. УК РФ + 21 freq).

## Открытые вопросы для poseo / art

1. **Author-quote блок: внутри text-content (Lexical blockquote) или отдельный sub-block?** Рекомендация ux: внутри text-content (Lexical поддерживает `<blockquote>` + cite). Отдельный блок излишен для одного quote на странице.
2. **Lead-form B2B длинная (10 полей)** — risk drop-off; A/B на `wizard-flow` (3 шага по 3-4 поля)? Рекомендация ux: для эталона W3 — single page form с fieldsets (B2B-юзер ожидает full-form, не impatient как B2C); wizard — backlog после Я.Метрика signal.
3. **Скачать тарифы PDF** — есть ли PDF? Если нет — заменить на «Получить тарифы на email» через lead-form trigger. Рекомендация ux: для эталона — на email через `lead-form` с `marketing_consent: tariffs-by-email` flag.
4. **Author-quote — оператор реальный или placeholder W2?** Sa-spec memory `project_us8_no_amocrm_mvp` + reading sa-seo §11 — placeholder «Georgy S.» до W2 W3. Quote-фраза — apruv оператором обязателен (privacy + бренд).

## Art review · 2026-05-01

**Status:** approved-with-changes.

**Что apruv'нуто:**
- B2B-вариант hero с lead-form (10 полей с fieldsets), 4-в-1 services-grid с B2B-ценами, обязательный author-quote блок — все согласуется с §13 TOV (Ruler-акцент: договор, тариф, отчётность).
- USP «штрафы ГЖИ/ОАТИ берём на себя по договору» как H1 — **immutable winning angle #3** (oператор закрепил), apruv.

## Art changes

### 1. Author-quote tone — переписать формулировку (R2 решение: вариант C)

**Текущая фраза в wireframe (строки 86-90):**

> «В договоре мы прямо разграничиваем зону: УК отвечает за общедомовое имущество, мы — за безопасность территории. Если ГЖИ выписывает штраф по нашей зоне — оплачиваем сами, без переговоров.»

**Проблема для §13 TOV (Caregiver+Ruler баланс):**
- Первая часть OK (matter-of-fact договорная конкретика — Ruler).
- Концовка «без переговоров» — звучит как **угроза/защитная стойка**, ближе к ЧОП/застройщику премиум-сегмента (§14 anti «Рыцарь / щит / герб»).
- B2B-Caregiver — спокойная ответственность, не «не торгуемся, точка». Цитата должна звучать как уверенная норма, не как «вызов на ринг».

**Финальная формулировка (`art` apruv pending → cw → operator):**

> «В договоре мы прямо разграничиваем зону: УК отвечает за общедомовое имущество, мы — за безопасность территории. Если штраф приходит по нашей зоне — оплачиваем по своему счёту, без перевыставления УК.»

**Обоснование:**
- Сохраняем **USP «штрафы берём на себя»** (immutable, не теряем B2B-крючок).
- Меняем «без переговоров» → «без перевыставления УК» — конкретный механизм (УК часто страдают от перевыставления штрафов от подрядчика, наша гарантия — это не делаем). Это Caregiver-конкретика, не Ruler-угроза.
- «По своему счёту» — добавляет финансово-юридическую конкретику (§13 TOV).

**Action item:** `cw` финализирует фразу под apruv оператора в W2/W3. До apruv'a — placeholder "(финальная формулировка цитаты — apruv операторa)" в эталоне `/b2b/uk-tszh/`. Цитата НЕ публикуется на staging без apruv'a оператора (privacy + бренд).

### 2. Author-quote визуальная компоновка

- `<blockquote>` 4px left-border `--c-primary`, padding 24px, `--c-card` background, `--radius` 10px.
- Цитата body 18/30 Golos 400 (на 1px крупнее обычного body, выделение).
- `<cite>` с author-meta (silhouette 40px circle + name + jobTitle + link к /avtory/<slug>/) — mono 13px `--c-muted` для job, Golos 14px для name.
- Без кавычек-декораторов (типа крупная « в углу) — анти Caregiver-сдержанность.

### 3. Trust-row hero

«247 ст. УК РФ · СРО · 152-ФЗ · ~6 лет · 8 районов МО» — **пять элементов**, многовато для visual-balance. Сократить до 4:
- «247 УК РФ · СРО · 152-ФЗ · ~6 лет в районах МО» (объединить «8 районов» с «~6 лет»).

### 4. Скачать тарифы PDF — правка label

CTA ghost «Скачать тарифы (PDF)» — корректнее «**Получить тарифы PDF**» (Caregiver «получить» vs Ruler «скачать»; в B2B-форме helper уже про «Подготовим договор и тарифы за 1 рабочий день»).

**Visual guidance:**
- Lead-form B2B fieldset border 1px `--c-line`, `<legend>` Golos 600 14px с padding 0 8px (стандарт §8 Components).
- ИНН input pattern с mono font-family `--font-mono` (§6).

**Backlog для design/integration:** добавить в brand-guide §8 (Components) под-секцию «B2B lead-form» — анатомия поля Организация+ИНН+должность с pattern validation, fieldset/legend семантика. Сейчас §8 только про generic input/button, B2B-specific patterns не зафиксированы.
