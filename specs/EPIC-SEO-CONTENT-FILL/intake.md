---
epic: EPIC-SEO-CONTENT-FILL
title: Наполнение services-сайта (без shop) с обгоном 17 конкурентов
team: seo
po: poseo
phase: gate
role: operator
status: ready-for-operator-approve
priority: P0
moscow: Must
rice: 96.5
created: 2026-05-01
updated: 2026-05-01
target_finish: 2026-08-07
related_plans:
  - /Users/a36/.claude/plans/team-seo-poseo-md-wise-flute.md
blocks: []
blocked_by: []
related:
  - EPIC-SEO-SHOP
  - EPIC-SEO-LANDSHAFT
---

# EPIC-SEO-CONTENT-FILL · Наполнение services-сайта

## Задача от оператора (2026-05-01)

> «Подготовь мне план и стратегию наполнения сайта. Наполняем всё что можем
> наполнить кроме раздела магазин (его потом). Картинки в fal.ai генерируем
> не ждём оператора. Подключай seo команду, скиллы, ещё кого надо.»
>
> Уточнения по ходу:
> - Конкурентная сверка: 17 конкурентов, % отставания, чтобы понимать где
>   догнали.
> - Цель не только лиды — **обогнать конкурентов и сделать продукт лучше**.
> - Шаблоны страниц с UX-валидацией и промежуточными превью на каждом
>   чек-пойнте.

## Главная цель

Не «просто наполнить» — **обогнать 17 конкурентов и сделать продукт лучше**.
Лиды — следствие. DoD-метрика к W14: опережение топ-3 конкурентов по ≥3 из
5 осей (URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage).

## Решения оператора

1. **Authors:** company-page «Бригада вывоза Обихода» + оператор как
   реальный B2B-автор с VK/TG `sameAs`.
2. **Темп districts:** 4 priority-A в Stage 1-2 + 4 priority-B в Stage 3.
3. **Тексты:** LLM-augmented (Claude Sonnet 4.6 + skill `claude-api`) →
   TOV-checker pre-filter → cw 100% review pillar/cornerstone + 20%
   sampling SD.
4. **Изображения:** fal.ai Nano Banana Pro для hero (без апрува, стиль
   через art W2).
5. **Архитектура:** Pure blocks — миграция всех коллекций на blocks[],
   финиш W14.
6. **Превью:** Live URL на staging + Playwright screenshots на каждом
   gate в `screen/`.

## Scope

**В скоупе:**
- 4 pillar (vyvoz-musora / arboristika / chistka-krysh / demontazh)
- 33 sub-services
- ~150 ServiceDistricts (priority-A) + ~60 priority-B
- 8 Districts (Одинцово, Красногорск, Мытищи, Раменское — A;
  Химки, Пушкино, Истра, Жуковский — B)
- 10 B2B-страниц + 12 Cases + 30 Blog + 8 статика + 2 Authors
- /foto-smeta/, /raschet-stoimosti/, /promyshlennyj-alpinizm/,
  /arenda-tehniki/, /park-tehniki/, /porubochnyj-bilet/
- 7 новых блоков (services-grid / mini-case / calculator placeholder /
  related-services / neighbor-districts / tldr / breadcrumbs)
- Миграция Services / Blog / Cases / B2BPages / Districts / Authors на
  blocks[]
- Storybook + 12 блоков + 8 типов страниц
- TOV-checker, lint:schema, sitemap финал, robots.txt, 8 целей
  Я.Метрики, Topvisor (200 ключей)
- 3 competitor benchmark-отчёта (W3 / W7 / W14) на 17 конкурентов +
  differentiation-matrix
- 4 staging-превью с Playwright screenshots (W3 / W7 / W11 / W14)

**Вне скоупа:**
- `apps/shop/` — отдельный EPIC-SEO-SHOP
- Дизайн ландшафта — отдельный EPIC-SEO-LANDSHAFT
- `/lp/<campaign>/` — отдельная задача от lp-site
- amoCRM (US-13) — blocked by аккаунт
- Wave 2.5 расширение до 30+ districts — после W14
- Полная B2B-программатика `/b2b/uk-tszh/<service>/` — отложена
- Calculator-блок реальная логика — placeholder в Stage 0
- Visual Regression CI (Chromatic / Percy) — после W14

## US в этом эпике

| US | Stage | Период | Owner-PO | Phase |
|---|---|---|---|---|
| **US-0-templates-ux-migration** | Stage 0 | W1-W3 | poseo + popanel | done |
| **US-1-pillars-pilot** | Stage 1 | W4-W7 | poseo | done |
| **US-2-sub-and-programmatic** | Stage 2 | W8-W11 | poseo | done (включает B2B + Cases pack — US-3-b2b-cases-extras свёрнут в US-2) |
| **US-3-priority-b-districts** | Stage 3 | W12-W13 | poseo | done · 211 URL closure 66.1% к liwood |
| **US-4-eeat-monitoring** | Stage 3 | W14 | poseo | done · operator gate ack pending |
| **US-6-competitor-benchmark** | сквозная | W3 / W7 / W11 / W14 | poseo | done · benchmark-W14.md + differentiation v4 |

## Cross-team зависимости

- **popanel + be-panel + dba** (Stage 0): миграция 6 коллекций на blocks[]
- **art** (Stage 0): apruv wireframes, fal-prompts стиль, цветовых макетов
- **ux** (Stage 0): 8 wireframes + UX-валидация эталонов
- **ui** (Stage 0): 7 новых блоков + Storybook + цветовые макеты
- **fe-site / podev** (Stage 0): реализация блоков + BlockRenderer ext
- **re** (сквозная): deep-профили 17 конкурентов
- **qa-site / cr-site** (на каждом gate): screenshots + axe + code review

## Артефакты

- **План:** `/Users/a36/.claude/plans/team-seo-poseo-md-wise-flute.md`
  (apruv оператора 2026-05-01)
- **Sitemap IA:** [seosite/04-url-map/sitemap-tree.md](../../seosite/04-url-map/sitemap-tree.md) v0.4 APPROVED
- **Семядро:** [seosite/03-clusters/](../../seosite/03-clusters/) — 1601
  ключ, 252 кластера, 8 pillar
- **Темник блога:** [seosite/05-content-plan/blog-topics.md](../../seosite/05-content-plan/blog-topics.md) — 30 статей
- **Конкуренты:** [seosite/01-competitors/shortlist.md](../../seosite/01-competitors/shortlist.md) — 17 трекаемых
- **Brand TOV:** [design-system/brand-guide.html](../../design-system/brand-guide.html) §13/§14

## Hand-off log

- `2026-05-01 · poseo`: создан intake на основе одобренного плана.
  Следующий шаг — sa-seo пишет sa-spec для US-0-templates-ux-migration
  (Stage 0 W1-W3). Подключение sa-seo через Agent после отмашки оператора
  по запуску W1.
- `2026-05-02 · poseo` (autonomous mandate): Stage 0+1+2 закрыты в одной
  сессии (50+ commits, ~250 URL, 125k слов, DoD W11 PASS — 3 confirmed
  winning angles из 5). US-3-b2b-cases-extras свёрнут в US-2 (B2B + Cases
  pack сделаны в US-2 Run 2-3). Создан **Stage 3 intake-пакет**:
  - [US-3-priority-b-districts/intake.md](US-3-priority-b-districts/intake.md)
    — W12-W13: 4 priority-B districts + ~60 SD batch + Blog M3 + 6 cases +
    Wave 0 mini-fix sprint (84 sub-level SD route + 3 missing routes).
  - [US-4-eeat-monitoring/intake.md](US-4-eeat-monitoring/intake.md) — W14:
    E-E-A-T hub + neuro-SEO + monitoring + final SEO-tech sweep + W14
    Competitor Benchmark Final + operator-gate-W14.md.

  Следующий шаг — `sa-seo` пишет `sa-seo.md` для US-3 (приоритетно — Wave 0
  mini-fix blocker для be-panel/fe-site через podev) + US-4 параллельно.
  Подключение sa-seo через Agent (autonomous, без operator approval per
  mandate). Operator gate W14 финальный (memory
  `project_poseo_autonomous_mandate_2026-05-02`).
