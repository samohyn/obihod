---
us: US-4.2
title: Арбористика — A1 «арборист» pillar-bridge + 4 sub + 3 blog
epic: EPIC-SEO-OUTRANK
team: seo
po: poseo
sa: sa-seo
type: programmatic + content
priority: P1 (содержит единственный A1 в датасете)
segment: services
phase: spec
role: sa-seo
status: ready-for-dev
related:
  - seosite/strategy/per-direction/arboristika.md
  - seosite/03-clusters/arboristika.md
created: 2026-05-04
updated: 2026-05-04
---

# US-4.2 · sa-seo: Арбористика — pillar расширение

## Контекст

Wave 3 covered % = 11.9% (303/2 536). **A1 = 1 ключ во всём датасете** — «арборист» 1 020 wsk у 6 конкурентов, у нас НЕТ info-pillar. Champion = liwood.ru (158 / 5 145), arboristik.ru (69 / 1 393).

«Короед штукатурка» (out of vertical, фасадная штукатурка) — exclude из target. «Жук короед» (3 295) + «короед жук» (3 045) — наша вертикаль через override (см. `_clustering-decisions.md`).

## Скоп

### A1 page (priority-1)

**`/arboristika/arborist/`** (или `/poleznoe/kto-takoy-arborist/` — slug TBD ADR-uМ-19+)

| Aspect | Detail |
|---|---|
| Target ключи | «арборист» 1 020 / «арбористика» 366 / «арборист это кто» 339×2 / «арбористы» 160 / «арбористы это/кто это» 247+226+160+127×2 / «арбористика что это» 136 |
| Total combined wsk | ~3 200 (semantic cluster) |
| Words | 2 500-3 000 (info-pillar + конверсионный CTA в конце) |
| H1 | «Арборист — кто это и чем занимается» |
| Title | «Кто такой арборист — услуги и цены | Обиход» |
| Schema | `Article` + `BreadcrumbList` + `FAQPage` + `Person` для авторов (E-E-A-T track A) |
| CTA | Lead-form в hero + после блока «как работает арборист» + final CTA «вызвать на участок» |
| Cross-link | 6 sub нашего `/arboristika/`, +`/foto-smeta/`, +`/komanda/` (E-E-A-T) |
| Authors | Person→Organization JSON-LD на 1-2 авторах из team page |
| Expected position | топ-10 за 2 месяца (6 конкурентов уже там; мы — глубже pillar) |

### 4 новых sub-services

| URL | Target ключи | Words | Cross-link |
|---|---|---|---|
| `/arboristika/spil-derevev/tseny/` | «сколько стоит дерево спилить» 290 (у 6 d) | 1 200-1 500 | parent /spil-derevev/ |
| `/arboristika/opilovka/` | «опиловка деревьев» 203 (у 6 d) + «опиловка» 104 + «опил деревьев» 81 + «опилка деревьев» 82 + «опиловка деревьев что это такое» 74 | 1 500-1 800 | /spil-derevev/ как related; canonical (если synonym) к /spil-derevev/ — обсудить с tamd |
| `/arboristika/obrabotka-ot-koroeda/` | «жук короед» 3 295 + «короед жук» 3 045 + «обработка от короеда» 227 + «короеды жуки» 466 + «жуки короеды» 424 + «короед типограф» 431 + «от короеда препараты на деревьях» 79 | 2 000-2 500 (high-priority sub) | / + blog `/blog/zashchita-ot-koroeda/` |
| `/arboristika/arenda-izmelchitelya/` | «измельчитель веток аренда» 235 + «измельчитель веток в аренду» 199 + «садовый измельчитель в аренду» 117 + «садовый измельчитель аренда» 101 + «аренда измельчитель веток» 102 | 1 500-1 800 | / + cross-link на /arboristika/spil-derevev/ |

**Note по «короед»:** обязательная exclusion декоративной фасадной штукатурки через canonical / 301 / `noindex`-правила:
- Поисковая фраза «короед» (5 348 wsk) — split intent: ~80% штукатурка, ~20% жук. У нас в URL slug `obrabotka-ot-koroeda` (от-вредителя clear), не «koroed» — это отделит fasad-intent users.
- Target долгосрочно: позиция 5-15 по «жук короед» (3 295) + топ-3 по «обработка от короеда» (227 + 79).

### 3 blog-bridges

| URL | Target | Words |
|---|---|---|
| `/blog/kak-spilit-derevo-pravilno/` | «как спилить дерево» 140 + «как правильно пилить дерево» 87 + «как спилить дерево на участке» 74 | 2 000-2 500 |
| `/blog/zashchita-ot-koroeda/` | «обработка от короеда» 227 + «защита от короеда» + «как избавиться от жука короеда» (long-tail) | 2 500-3 000 |
| `/blog/mozhno-li-spilit-derevo-na-svoem-uchastke/` | «можно ли на своём участке спиливать деревья» 74 + «можно ли спилить дерево» 73 + «порубочный билет как получить» 111 (cross-direction) | 2 500-3 000 |

### USP «выравнивание участка» расширение

Sustained от Stage 3 — продолжить углублять `/arboristika/vyravnivanie-uchastka/` до 5 000 слов (champion в Wave 1 — wsk 5 523). Не в этой US, но ссылку из A1 page обязательно.

## Schema

A1 page: `Article` + `BreadcrumbList` + `FAQPage` + `Person` JSON-LD на авторах.
4 sub: `Service` + `Offer` + `BreadcrumbList` + `FAQPage`.
3 blog: `BlogPosting` + `Article` + `Person` (author) + `BreadcrumbList`.

`pnpm lint:schema --sample 8` → 0 errors / 0 warns.

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC-1 | A1 `/arboristika/arborist/` published в Payload + добавлен в /arboristika/ navigation |
| AC-2 | 4 sub published + cross-link с pillar |
| AC-3 | 3 blog published в /blog/ |
| AC-4 | Schema 0/0 errors на 8 URL |
| AC-5 | Photo→quote lead-form на A1 + 4 sub |
| AC-6 | A1 page имеет Person JSON-LD на 2 авторах (E-E-A-T sustained) |
| AC-7 | Wave 3 covered % с 11.9% → ≥30% |
| AC-8 | A1 «арборист» — топ-10 Я через 2 месяца monitoring |
| AC-9 | «жук короед» — топ-15 за 3 месяца (sub /obrabotka-ot-koroeda/) |
| AC-10 | leadqa real-browser smoke по 8 URL |

## Estimation

- A1 page: ~5h cw drafting (2500 слов с research + Person schema)
- 4 sub × 1 700 слов = ~12h cw
- 3 blog × 2 500 слов = ~12h cw
- Schema-coding + cms publish: ~6h
- QA + leadqa: ~5h
- **Σ ~40h (≈ 2 weeks team-time)**

## Out of scope

- Programmatic district SD `/arboristika/<sub>/<district>/` — sustained Wave 1 на 4 priority-A
- DIY-blog «обрезка яблони весной» (5 457 wsk, 1 d) — Wave 4 priority (high wsk, но 1 domain — низкая ценность для intersect strategy)
- Sub `/arboristika/koroed-shtukaturka/` — **out of vertical (фасадная штукатурка), exclude**
