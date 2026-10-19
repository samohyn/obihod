---
us: US-2
title: URL-карта EPIC-SEO-COMPETE-3 + ADR-0018 finalize
team: seo
po: poseo
sa: poseo (autonomous, owner-вертикаль pending tamd review)
type: spec + adr
priority: P0
segment: services
phase: review
role: poseo → tamd
status: ready_for_review
blocks:
  - US-3 (нейро-SEO каркас) — нужны URL для canonical/jsonld templates
  - US-4 (mega-прайс) — нужны deep-pages slugs
  - US-5 (info-articles) — нужен blog URL pattern + 8 vis-champion slugs
  - US-6 (B2B) — sustained 6 slugs из ADR-0018
  - US-7 (programmatic SD + контент) — нужны pillar+sub slugs
  - US-8 (lead-infra) — нужны /kontakty/, /kalkulyator/foto-smeta/
  - US-9 (Reviews) — нужен /otzyvy/
blocked_by:
  - tamd ADR-0018 review (W2 deadline 2026-05-13)
  - podev approve cross-team нагрузки (3 новых routes /uslugi/tseny/, /kontakty/, /kalkulyator/foto-smeta/, /otzyvy/ + расширение sitemap.ts + Reviews collection в Payload)
related:
  - team/adr/ADR-0018-url-map-compete-3.md
  - seosite/strategy/02-url-map.json
  - seosite/strategy/01-semantic-core.md
  - seosite/02-keywords/derived/clusters-tfidf.csv
created: 2026-05-06
updated: 2026-05-06
---

# US-2 — URL-карта EPIC-SEO-COMPETE-3

## Цель

Зафиксировать полную URL-карту для всех 5 pillars + новых routes на основе US-1 семантики. Один источник истины для US-3..US-9. Отдельно — финализировать [ADR-0018](../../../team/adr/ADR-0018-url-map-compete-3.md).

## Скоуп

### IN

1. **5 pillars** (4 sustained + 1 new):
   - `/vyvoz-musora/`, `/arboristika/`, `/demontazh/`, `/chistka-krysh/` — sustained
   - `/uborka-territorii/` — **новый** (operator approved 2026-05-06)
2. **35 sub-pages** (18 sustained + 17 new) под каждый pillar
3. **Mega-pricing хаб** `/uslugi/tseny/` + 5 deep-страниц per pillar
4. **B2B-нормативка** `/b2b/<doc>/` × 6 (с PDF templates per Track A)
5. **Лид-инфраструктура** `/kontakty/`, `/kalkulyator/foto-smeta/`, `/otzyvy/`
6. **Programmatic SD** pattern `/<pillar>/<sub>/<city>/` (sustained, расширяется в US-7)
7. **30 blog-articles** с 8 anchor slug'ами (vis-champions liwood)
8. **Authors / Cases / Trust extensions** sustained pattern
9. **Canonical / sitemap priority / redirect rules** — 12 правил canonical в ADR-0018

### OUT

- Создание Payload документов (Services / ServiceDistricts / Cases / B2B / Authors / Reviews) — **US-3..US-9** (per-pillar)
- Реальный контент (texts, schema, blocks) — US-4..US-7
- IndexNow / llms.txt / Speakable — US-3
- Wordstat / Topvisor добор — US-2 follow-up
- Я.Карты / Я.Бизнес карточка — US-9

## Артефакты US-2

| Файл | Status | Описание |
|---|---|---|
| `team/adr/ADR-0018-url-map-compete-3.md` | ready_for_review | Архитектурное решение + 35 sub + canonical rules + redirect-карта |
| `seosite/strategy/02-url-map.json` | ✅ done | Машиночитаемая URL-инвентарь для seed-скриптов |
| `specs/EPIC-SEO-COMPETE-3/US-2-url-map/sa-seo.md` | этот файл | Spec для downstream US |

## Ключевые architectural decisions (зафиксированы в ADR-0018)

### D1. `/uborka-territorii/` как новый 5-й pillar

- **Approved by:** operator 2026-05-06
- **Rationale:** arboristik whitespace 30%+ (cluster C12+C43+C15 wsk=1979); semantic boundary с arboristika нечёткая, но intent (земляные работы vs зелёные насаждения) — разный
- **Implementation:** новый Service в Payload (slug=`uborka-territorii`, 4 new sub) + новые routes генерируются автоматически через sustained `app/(marketing)/[service]/page.tsx`

### D2. Sustained pillar slugs — НЕ переименовывать

- **Sustained:** `arboristika`, `chistka-krysh`, `vyvoz-musora`, `demontazh`
- **Rejected rename:** `chistka-krysh` → `uborka-snega-i-chistka-krysh` (обсуждалось в раннем drafts)
- **Rationale:** sustained `chistka-krysh` имеет 6 sustained sub-pages, переименование = 7 redirect-records + риск SEO drop. Semantic coverage снега обеспечивается через 4 new sub под `/chistka-krysh/`.

### D3. Sustained sub-slugs — НЕ переименовывать

- Sustained orthography (например `spil-dereviev` с 'и', не `spil-derevev`)
- 18 sustained subs остаются как есть
- 17 new subs создаются параллельно (не conflict)

### D4. Canonical separation pillar/sub vs pricing/pillar

- `/<pillar>/<sub>/` = lead intent (заказать)
- `/uslugi/tseny/<pillar>/` = pricing intent (сколько стоит)
- **No cross-canonical** — разные интенты, разные страницы

### D5. Programmatic SD canonical → self

- `/<pillar>/<sub>/<city>/` canonical = self (НЕ pillar/sub)
- Local-intent отличается от non-geo
- Sustained: `noindex` для draft SD без miniCase / localFaq < 2

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | ADR-0018 review tamd → approved | 🔵 pending W2 |
| AC-2 | URL-инвентарь JSON валиден (machine-readable, schema-ref) | ✅ done |
| AC-3 | 0 redirect-records — clean миграция | ✅ confirmed (audit `site/scripts/seed.ts`) |
| AC-4 | Каждый кластер из US-1 имеет ровно один target-URL | ✅ done (см. cluster column в JSON) |
| AC-5 | 12 canonical правил зафиксированы | ✅ done в ADR §Канонизация |
| AC-6 | Sitemap priority таблица для всех 8 типов URL | ✅ done в ADR + JSON |
| AC-7 | podev approve cross-team нагрузки (через cpo) | 🔵 pending W2 |

## Hand-offs (poseo orchestrates per iron rule #7)

| От | Кому | Когда | Что |
|---|---|---|---|
| poseo | tamd | 2026-05-06 → 2026-05-13 | Review ADR-0018 + URL-map JSON |
| poseo | cpo | 2026-05-06 | Notify о cross-team нагрузке podev (3 новых routes + Reviews collection) |
| poseo (после approves) | sa-seo (US-3..US-9) | W2 | Sub-specs для US-3..US-9 (входной материал — этот spec + ADR-0018) |
| poseo | seo-tech | W3 | sitemap.ts + canonical + jsonld расширение per ADR-0018 |
| poseo | cms | W3 | Создание Payload Services записей для 1 new pillar + 17 new sub-services |

## Open questions для tamd

1. **Pillar `/chistka-krysh/` extended scope:** semantic coverage уборки снега через sub-pages — приемлемо vs нужен formal rename? Risk-benefit.
2. **`/uslugi/tseny/<pillar>/`** — это новые routes или существующие (через ServicesGrid extension)? Влияет на podev оценку нагрузки.
3. **Reviews collection** — отдельная Payload collection или Globals.SiteChrome.reviews? Влияет на data-model + dba нагрузку.
4. **`vyvoz-sadovogo-musora` (sustained vyvoz-musora sub)** vs новая `/uborka-territorii/vyvoz-porubochnyh-ostatkov/` — есть semantic overlap. Cross-link или canonical-объединение?
5. **`uborka-uchastka` (sustained vyvoz-musora sub)** vs `/uborka-territorii/raschistka-uchastka/` — semantic overlap. Cross-link стратегия?

## Definition of done

- [x] ADR-0018 финализирован (status: ready_for_review)
- [x] URL-инвентарь JSON `02-url-map.json`
- [x] sa-seo spec (этот файл)
- [ ] tamd review + approve (или request changes) — W2
- [ ] cpo notify podev cross-team нагрузки — W2
- [ ] poseo handoff к sa-seo для US-3..US-9 — W2 после approves

## Hand-off log

- 2026-05-06 16:00 · poseo: US-2 spec created в одном PR с ADR-0018 финализацией
- 2026-05-06 16:00 · poseo → tamd: review request, deadline 2026-05-13 (W2)
- 2026-05-06 16:00 · poseo → cpo: cross-team notification (podev нагрузки)
