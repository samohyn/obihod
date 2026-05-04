---
us: US-4.1
title: Вывоз мусора — 4 sub + 4 SD контейнера + pillar update
epic: EPIC-SEO-OUTRANK
team: seo
po: poseo
sa: sa-seo
type: programmatic + content
priority: P1
segment: services
phase: spec
role: sa-seo
status: ready-for-dev
related:
  - seosite/strategy/per-direction/vyvoz-musora.md
  - seosite/03-clusters/vyvoz-musora.md
created: 2026-05-04
updated: 2026-05-04
---

# US-4.1 · sa-seo: Вывоз мусора — расширение pillar

## Контекст

Wave 3 covered % = 9.7% (329/3 405). Champion = musor.moscow (10 827 it50 / 329 pagesInIndex). Структурный gap: у нас НЕТ sub-services для **КГМ** (крупногабарит) и **ТБО** — конкуренты получают трафик на отдельные страницы.

## Скоп

### 4 новых sub-services

| URL | Target ключи | Words | Schema |
|---|---|---|---|
| `/vyvoz-musora/kgm/` | «кгм» 1 678 + «кгм это» 203 + «контейнер для мусора крупногабаритного» 110 | 1 500-1 800 | Service + FAQPage + BreadcrumbList |
| `/vyvoz-musora/tbo/` | «вывоз тбо» 405 + «тбо вывоз» 326 + «тбо вывоз мусора» 68 + «вывоз мусора тбо» 49 | 1 500-1 800 | Service + FAQPage |
| `/vyvoz-musora/krupnogabarit/` | «вывоз мусора крупногабаритного» 306 | 1 200-1 500 + canonical → `/vyvoz-musora/kgm/` (синоним по русскому, primary slug КГМ) | Service |
| `/vyvoz-musora/konteyner/` | «контейнер заказать для мусора» 606 + «контейнер заказать» 111 + «контейнер под мусор заказать» 117 + «вывоз мусора контейнер» 291 | 1 800-2 200 (с разделом по объёмам) | Service + Offer + ItemList (4 SD) |

### 4 SD контейнеров (под `/vyvoz-musora/konteyner/`)

| URL | Target ключи | Words |
|---|---|---|
| `/vyvoz-musora/konteyner/5-kubov/` | «контейнер 5 кубов» (long-tail) | 800-1 200 |
| `/vyvoz-musora/konteyner/8-kubov/` | «контейнер 8 кубов» 277 + «контейнер для мусора 8 кубов» | 1 000-1 200 |
| `/vyvoz-musora/konteyner/20-kubov/` | «контейнер мусорный 20 кубов» 56 | 800-1 000 |
| `/vyvoz-musora/konteyner/27-kubov/` | «контейнер 27 кубов для мусора» 56 + «контейнер для мусора 27 кубов» 56 + «контейнер мусорный 27 кубов» | 1 000-1 200 |

**ADR-uМ exception:** sustained `max 3 levels` ADR-uМ-03 — здесь URL имеет 4 уровня (`/vyvoz-musora/konteyner/8-kubov/`). Это **специфичное расширение** для контейнерных SD по объёмам — типовой паттерн musor.moscow + mmusor.ru. Согласовать с tamd через ADR-uМ-19+ (4-уровень разрешён только для `<service>/<sub>/<size-or-variant>/`, не для `/<service>/<sub>/<district>/`).

### Pillar `/vyvoz-musora/` update

- H1: «Вывоз мусора в Москве и МО — КГМ, ТБО, строительный, контейнером»
- Title (≤60): «Вывоз мусора в Москве — Обиход»
- Meta desc: «Вывоз КГМ, ТБО, строительного мусора контейнерами 5/8/20/27 м³. Срочно по Москве и МО. Фото→смета 10 мин. Договор, документы полигона.»
- Pricing block (target «вывоз мусора сколько стоит» 250)
- FAQ section с 8 вопросами

### 1 blog-bridge

`/blog/chto-takoe-kgm/` (target «кгм это» 203 + «кгм» 1 678 partial) — info-bridge, cross-link на `/vyvoz-musora/kgm/`. Words: 1 500-2 000.

### 1 doc страница

`/dokumenty/fz-89-ob-othodakh/` (target «89фз об отходах производства и потребления» 89 wsk). Это E-E-A-T legal страница — sustained от ADR `/dokumenty/` namespace (если есть). Words: 1 800-2 200.

## Семантическое ядро

См. `seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv` (filter `cluster_hint=='vyvoz-musora'`).

## Schema

Все 4 sub + 4 SD имеют:
- `Service` (с areaServed Москва+МО)
- `Offer` или `AggregateOffer` (диапазоны цен)
- `BreadcrumbList`
- `FAQPage` (5+ items)

Pillar `/vyvoz-musora/` дополнительно: `CollectionPage` + `ItemList` всех sub.

`pnpm lint:schema --sample 11` (4 sub + 4 SD + pillar + blog + doc) → 0 errors / 0 warns.

## Acceptance criteria

| AC | Criterion |
|---|---|
| AC-1 | 4 sub published, 4 SD контейнеров published, navigation обновлена |
| AC-2 | Pillar H1+Title+desc обновлены (КГМ / ТБО / контейнер в outline) |
| AC-3 | 1 blog + 1 doc published |
| AC-4 | Schema 0 errors / 0 warns на 11 URL |
| AC-5 | Cross-link: pillar→sub, sub→pillar, /konteyner/→4 SD, SD→/konteyner/ parent |
| AC-6 | Photo→quote lead-form embed на pillar + 4 sub (sustained 100% USP) |
| AC-7 | Wave 3 covered % с 9.7% → ≥30% |
| AC-8 | ADR-uМ-19 (4-level URL discussion) merged |
| AC-9 | leadqa real-browser smoke по 11 URL |

## Estimation

- Content drafting 4 sub × 1 600 + 4 SD × 1 000 + pillar update + blog + doc = ~24h cw + seo-content
- Schema-coding + Payload publish: ~5h
- ADR-uМ-19 (4-level discussion с tamd): ~2h
- QA + leadqa: ~4h
- **Σ ~35h (≈ 1.5 weeks team-time)**

## Out of scope

- Programmatic «вывоз мусора в [город МО]» — auto-gen risk (musor.moscow 80% page loss)
- Стройматериалы / щебень / песок (товарная вертикаль) — out of scope
- Sub `/vyvoz-musora/spectehnika/<vehicle>/` — Wave 4 backlog
