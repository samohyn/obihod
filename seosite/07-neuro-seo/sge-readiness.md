---
title: SGE / AI-overviews / SearchGPT readiness — analysis & cw revision plan
owner: sa-seo
co-owners: [cw, seo-tech]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-3.1]
related:
  - "../06-eeat/eeat-hub-spec.md"
  - "../08-monitoring/yandex-metrika-goals.md"
  - "./jsonld-completeness.md"
  - "./llms-txt-spec.md"
---

# SGE / AI-overviews / SearchGPT readiness

> Cross-engine LLM-citation readiness audit для 211 published URL и codified pattern на сustainable post-EPIC tracking. Стандарты: Google SGE (AI Overviews) · OpenAI SearchGPT · Anthropic claude.ai webfetch · Perplexity. Цель — обеспечить наш контент structurally citable во всех четырёх «AI-search» surface'ах.

## 1. Текущее состояние FAQ-blocks coverage (sustained Stage 1+2+3)

| Уровень URL | Кол-во URL | FAQ-блок (≥3 Q&A) | localFaq (≥2 на SD) | FAQPage JSON-LD |
|---|---:|---:|---:|---:|
| pillar (4) | 4 | 100% (4/4) | n/a | 100% |
| sub (~36) | 36 | 100% (36/36) | n/a | 100% |
| ServiceDistrict (~150) | 150 | 100% (150/150) | 100% (≥2 localFaq) | 100% |
| blog (31) | 31 | ~50% (16/31, info-posts only) | n/a | 50% |
| cases (14) | 14 | 0% (sustained — кейсы без FAQ pattern) | n/a | 0% |
| static (komanda / sro / b2b / dogovor / avtory) | 7 | 100% где релевантно (komanda + b2b + dogovor + sro имеют ≥3 Q&A) | n/a | 100% |

**Sustained baseline (Stage 2 W11 mid-check + Stage 3 W13 closure):**
- 100% pillar / sub / SD имеют FAQPage schema → Google SGE / Я.AI / SearchGPT могут парсить Q+A pairs.
- 100% SD имеют ≥2 localized Q (sustained `seosite/03-clusters/_q2_signal.json`) — это neuro-citation signal для local-intent queries.

## 2. SGE / AI-overviews / SearchGPT preferred patterns

### 2.1 · Google SGE (AI Overviews) — patterns (источник: Google SGE blog 2024-2025 + наши наблюдения SERP Q3 2025)

- **Q phrasing** — literal user query, не маркетинговый («сколько стоит вывезти контейнер 8 м³?» → НЕ «Стоимость вывоза мусорного контейнера»).
- **A structure** — *short answer first*: 1-2 предложения с **конкретным числом / диапазоном / условием** → длинное объяснение после.
- **Citation pattern** — SGE цитирует чаще структуры с явными `<dt>`/`<dd>` или `<details>` + FAQPage schema.
- **Cross-domain author signal** — SGE предпочитает источники с consistent `sameAs` author cross-domain (VK / TG / dzen / habr).

### 2.2 · OpenAI SearchGPT (preview 2024-2025)

- **Source preference** — markdown-доступные страницы (читает `<main>` content без js-render) → naked HTML pattern critical.
- **FAQ-pattern bonus** — short answers ranked higher in citation index.
- **Citation discoverability** — `llms.txt` (если есть) parsing — см. `./llms-txt-spec.md`.

### 2.3 · Anthropic claude.ai webfetch + Perplexity

- **No-cookie crawl** — не должно быть cookie-walls для контента.
- **Hreflang НЕ нужен** (sustained: мы single-language ru-RU).
- **Markdown body** — Lexical → HTML render → markdown-friendly через `<article>` semantics + `<dl>` блоки.

### 2.4 · Cross-cutting iron rule

> **«Short answer first, extended explanation after»** — applicable ко всем четырём AI-engines. Это primary axis для US-4 cw FAQ A-revision.

## 3. Анализ нашего pattern vs preferred

### Q (вопрос) — сustained OK

- Generally OK: 80-90% Q написаны literal-style (sustained cw style guide §2.3).
- ≥2 localFaq на каждом SD (sustained Stage 2 AC-2.5) — это +N для localized neuro-citation.
- **Минор:** ~10% Q в blog-постах сформулированы маркетингово («Почему стоит выбрать Обиход для вывоза мусора?») → low neuro-citation potential. Не блокер EPIC.

### A (ответ) — partial gap (главная axis улучшения US-4)

- **30-40% A слишком длинные** (≥150 слов, нет «short answer first» pattern):
  - Pillar pages: ~25% A длиннее 150 слов (8/32 representative Q&A).
  - SD pages: ~35% A длиннее 150 слов (sample 50 representative SD).
  - blog: ~50% A длиннее (info-style → длинные A by-design — partial gap, не критично).
- **Конкретика OK:** 80% A содержат число / диапазон / закон / город (sustained cw style guide §3.4 «Concrete-data-first»).

### Cross-domain `sameAs` (E-E-A-T связка) — partial gap

- **Person.sameAs** sustained на 4-5 авторов (VK / TG / dzen) — см. `../06-eeat/eeat-hub-spec.md` §4.
- **Organization.sameAs** sustained (VK + TG + dzen + WhatsApp Business) — см. `../06-eeat/eeat-hub-spec.md` §3.
- **Gap:** не все блог-посты включают Person reference в Article schema. **Recommendation US-4:** cms re-seed обязательно `Article.author = Person ref` (W14 day 5 cms TODO).

## 4. Recommendation US-4 W14 day 4 — cw FAQ A-revision sample 20 URL

### 4.1 · Sample shortlist (20 URL)

| # | URL | Reason | Owner |
|---|---|---|---|
| 1 | `/vyvoz-musora/` | Pillar 1 — flagship, ~12 Q&A | cw |
| 2 | `/arboristika/` | Pillar 2 — sustainability angle | cw |
| 3 | `/chistka-krysh/` | Pillar 3 — seasonal | cw |
| 4 | `/demontazh/` | Pillar 4 — heavy | cw |
| 5 | `/vyvoz-musora/kontejner-8m3/` | Sub — high-volume keyword | cw |
| 6 | `/vyvoz-musora/snt/` | Sub — B2C high intent | cw |
| 7 | `/arboristika/spil-derevev/` | Sub — high search volume | cw |
| 8 | `/chistka-krysh/snt/` | Sub — seasonal intent | cw |
| 9 | `/demontazh/sarai/` | Sub — concrete query | cw |
| 10-13 | 4 priority-A SD: Москва ВАО / Раменское / Жуковский / Пушкино — vyvoz-musora / arboristika | Top-priority SD (sustained) | cw |
| 14-17 | 4 priority-B SD: Балашиха / Мытищи / Химки / Подольск — chistka-krysh / demontazh | priority-B coverage | cw |
| 18 | `/b2b/uk-tszh/` | B2B page (sustained) | cw |
| 19 | `/b2b/dogovor/` | B2B trust signal | cw |
| 20 | `/blog/<top-info-post>` | Top blog post (sustained) | cw |

### 4.2 · A-revision pattern (cw checklist)

Для каждого Q → restructure A под:

```text
[Short answer 1-2 sentence с конкретным числом / диапазоном / условием.]

[Extended explanation 3-7 sentence — нюансы / законы / kase-references.]
```

**Example (BEFORE):**

> **Q:** Сколько стоит вывоз контейнера 8 м³ из СНТ?
>
> **A:** Стоимость вывоза мусора зависит от множества факторов: расположение СНТ, тип отходов, расстояние до полигона, нужен ли подъезд спецтехники, время года и так далее. Мы стараемся предложить лучшие цены и работаем с разными СНТ Подмосковья. У нас есть собственная техника и опытные водители. (≥150 слов continued...)

**Example (AFTER):**

> **Q:** Сколько стоит вывоз контейнера 8 м³ из СНТ?
>
> **A:** **От 6 500 до 11 000 ₽** за контейнер 8 м³ в СНТ Подмосковья (зависит от расстояния до полигона ФККО IV класса).
>
> Финальная цена зависит от: (1) расстояния от СНТ до полигона ТКО (типичный диапазон 15-60 км), (2) необходимости подъезда узкой техники (СНТ-узкие въезды +1500 ₽), (3) сезонности (пик апрель-октябрь). Договор с штрафами ГЖИ/ОАТИ на нашей стороне (см. `/b2b/dogovor/`). Фото→смета за 10 минут — отправьте 2-3 фото в Telegram/WhatsApp.

**Acceptance per A-revised Q:** (1) `<2 sentence` + конкретное число / диапазон / закон / город в первой strophe; (2) `3-7 sentence` extended explanation после; (3) inline cross-link на pillar / sub / b2b если релевантно; (4) `<150 слов total`.

### 4.3 · Citation pattern для AI-citation discovery (Lexical → HTML)

В Lexical body FAQ блок renders как:

```html
<section class="faq" itemscope itemtype="https://schema.org/FAQPage">
  <h2>Частые вопросы</h2>
  <dl>
    <dt itemprop="name">Сколько стоит вывоз контейнера 8 м³ из СНТ?</dt>
    <dd itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
      <strong>От 6 500 до 11 000 ₽</strong> за контейнер 8 м³ в СНТ Подмосковья.
      <p>Финальная цена зависит от: …</p>
    </dd>
  </dl>
</section>
```

**Why этот pattern:**
- `<dl>/<dt>/<dd>` — semantic HTML, citable AI-engines (Anthropic / OpenAI / Google SGE).
- `<strong>` для short-answer — visual + machine-readable signal.
- Микро-разметка `itemscope/itemprop` дублирует FAQPage JSON-LD (defense-in-depth).
- FAQPage JSON-LD остаётся обязательным (sustained Stage 2 AC-8).

## 5. Top-N global FAQ (recommendation US-4 / Stage 4)

Помимо local-FAQ на SD pages, добавить **top-15 global FAQ** на homepage `/` ИЛИ на `/voprosy-otvety/` (отдельная страница), охватывающие general queries:

| # | Q (literal user phrasing) | Target keyword | Suggested URL |
|---|---|---|---|
| 1 | Сколько стоит вывоз мусора в Москве и МО? | «вывоз мусора цена москва» | `/vyvoz-musora/` |
| 2 | Какой контейнер мне нужен для вывоза строительного мусора? | «контейнер для строительного мусора» | `/vyvoz-musora/stroitelnyj/` |
| 3 | Можно ли вывозить мусор ФККО I-IV класса законно? | «вывоз мусора фкко» | `/vyvoz-musora/fkko/` |
| 4 | Сколько стоит спил большого дерева в Подмосковье? | «спил дерева цена» | `/arboristika/spil-derevev/` |
| 5 | Когда лучше всего чистить крышу от снега? | «когда чистить крышу от снега» | `/chistka-krysh/` |
| 6 | Можно ли работать с УК без 44-ФЗ? | «работа с ук тсж договор» | `/b2b/uk-tszh/` |
| 7 | Что такое «фото→смета» и как это работает? | «фото смета вывоз мусора» | `/foto-smeta/` |
| 8 | Сколько времени занимает демонтаж сарая? | «демонтаж сарая сроки» | `/demontazh/sarai/` |
| 9 | Какие документы выдаёте после вывоза мусора? | «акт вывоза мусора» | `/dogovor/` |
| 10 | Работаете ли в выходные и ночью? | «вывоз мусора ночью» | `/` (homepage) |
| 11 | Есть ли СРО и какие лицензии? | «вывоз мусора лицензия» | `/sro-licenzii/` |
| 12 | Сколько стоит обработка сада от вредителей? | «обработка сада цена» | `/arboristika/obrabotka/` |
| 13 | Можно ли заключить долгосрочный договор для УК? | «договор вывоз мусора долгосрочный» | `/b2b/dogovor/` |
| 14 | Сколько стоит уборка снега с крыши частного дома? | «чистка крыши частный дом цена» | `/chistka-krysh/` |
| 15 | Чем «Обиход» отличается от cleaning-moscow / эко-центров? | «обиход отзывы» | `/` (homepage) |

**Implementation note (Stage 4 / US-4 optional):**
- Если cw bandwidth позволяет в W14 day 4 — top-15 global FAQ render на homepage `/` под hero-block.
- Иначе defer на Stage 4 / post-EPIC.

## 6. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-3.1.a | sample 20 URL FAQ A-revision per pattern §4.2 | cw | Hard |
| AC-3.1.b | citation pattern §4.3 sustained на all revised URL | cms (re-seed) | Hard |
| AC-3.1.c | top-15 global FAQ §5 (Stage 4 optional) | cw + cms | Soft |
| AC-3.1.d | A-revision sample 20 verified by qa-site через DevTools FAQPage parser | qa-site | Hard |

**Hand-off:**
- sa-seo → cw (W14 day 4): sample 20 URL + revision pattern + AC checklist.
- cw → cms (W14 day 5): revised JSON fixtures для re-seed.
- cms → qa-site (W14 day 6): verify FAQPage schema + citation pattern на staging.
