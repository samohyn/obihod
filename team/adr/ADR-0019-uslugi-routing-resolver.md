---
adr: 0019
title: /uslugi/ routing-resolver — slug-disjoint namespace для T3 sub-services и T4 service-districts
status: accepted
deciders: [poseo, sa-seo, tamd, operator]
date: 2026-05-08
related:
  - ADR-0018-url-map-compete-3 (зеркальный, не конфликтует)
  - EPIC-SEO-USLUGI/intake.md
  - EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md
  - site/app/(marketing)/[service]/[district]/page.tsx (sustained legacy misnomer параметра)
  - site/lib/seo/queries.ts (sustained `getSubServiceBySlug` + новый `getServiceDistrict`)
  - site/collections/Services.ts (sustained slug validate + новый disjoint-guard)
  - site/collections/Districts.ts (sustained slug validate + новый disjoint-guard)
---

# ADR-0019 — /uslugi/ routing-resolver: namespace-disjoint slugs для T3 и T4

## Контекст

EPIC-SEO-USLUGI планирует 191 URL в разделе /uslugi/:
- 1 hub (T1) — `/uslugi/`
- 5 pillar (T2) — `/<pillar>/`
- 35 sub-services (T3) — `/<pillar>/<sub-slug>/`
- 150 programmatic SD (T4) — `/<pillar>/<city-slug>/`

ADR-0018 §«SD route depth уточнено» зафиксировал **2-сегмент SD** `/<pillar>/<city>/`, не 3-сегмент. Это означает что T3 (`/<pillar>/<sub>/`) и T4 (`/<pillar>/<city>/`) **используют один и тот же URL-pattern** `[service]/[slug]/` на уровне Next.js routing.

Sustained маршрут `site/app/(marketing)/[service]/[district]/page.tsx` рендерит T3 sub-service (legacy misnomer параметра — `[district]` исторически выбран до решения о programmatic SD). При вводе T4 нам нужно либо:
- (A) использовать тот же файл как slug-resolver с приоритетной резолюцией;
- (B) ввести отдельный URL-prefix для T4 (например `/uslugi/<pillar>/<city>/`);
- (C) добавить визуальный маркер city-slug (например `/v-<city>/`);
- (D) перейти на 3-сегмент `/<pillar>/<sub>/<city>/` (отвергнуто ADR-0018).

## Решение

**Принят вариант A — единый slug-resolver `[service]/[slug]/page.tsx` с приоритетной резолюцией T3 → T4 → 404 + namespace-disjoint guard на уровне Payload + CI.**

### Архитектура

1. **Файл-маршрут** — `site/app/(marketing)/[service]/[slug]/page.tsx` (US-4 переименует sustained `[district]` → `[slug]` через `git mv`; URL не меняются).

2. **Резолюция** в строгом порядке:
   ```
   getSubServiceBySlug(service, slug) → если matched → render T3 SubServiceView
   else getServiceDistrict(service, slug) → если matched → render T4 ServiceDistrictView
   else notFound()
   ```

3. **Namespace-disjoint guard** на 3 уровнях:
   - **Payload validate-hook** на `Services.subServices[].slug` — collision с любым `Districts.slug` = validation error (`site/collections/Services.ts`).
   - **Зеркальный validate-hook** на `Districts.slug` — collision с любым `subServices[].slug` published Service = validation error (`site/collections/Districts.ts`).
   - **CI script `pnpm lint:slug`** в prebuild — fails build при collision (`site/scripts/lint-slug.ts`).

4. **`generateStaticParams`** объединяет sustained `getAllSubServiceParams()` + новый `getAllServiceDistrictParams()` — Next.js строит статические страницы для ВСЕХ известных URL во время build.

5. **Кэш-теги** `unstable_cache`:
   - `service-${pillarSlug}` — pillar T2
   - `service-sub-${pillarSlug}-${subSlug}` — sub T3
   - `service-district-${pillarSlug}-${citySlug}` — SD T4
   Инвалидация per-tag через afterChange hook коллекций.

### Альтернативы (отклонены)

| # | Вариант | Почему отклонён |
|---|---|---|
| **B** | `/uslugi/<pillar>/<city>/` для T4 (отдельный prefix) | Создаёт ДВА URL-pattern для одной услуги (`/arboristika/` vs `/uslugi/arboristika/`) → каннибализация (правило #13 ADR-0018), нужна canonical-логика, ломает sustained `chistka-krysh/` SEO baseline. Yandex путается между двумя путями. |
| **C** | `/<pillar>/v-<city>/` (visual marker) | Не sustained kebab-case convention (правило #11 ADR-0018), создаёт визуальный шум, ломает breadcrumb naming, понижает CTR в SERP («v-balashihe» нечитаемо). |
| **D** | 3-сегмент `/<pillar>/<sub>/<city>/` | Прямо отвергнуто ADR-0018 §«SD route depth уточнено». Out-of-scope EPIC-SEO-COMPETE-3 + EPIC-SEO-USLUGI. Возможен в future US-2 follow-up. |
| **E** | Раздельные файлы `[district]/page.tsx` (T3) + `(district)/[city]/page.tsx` (T4) — Next.js parallel routes | Next.js parallel routes не работают для двух segments на одном уровне URL — это для UI-композиции (sidebar+main), не для routing. Architectural mismatch. |

## Гарантии и инварианты

1. **Disjoint namespace** — для всех `(pillar, slug)` пар выполняется ровно одно из двух:
   - `slug ∈ pillar.subServices[].slug` (T3)
   - `slug ∈ Districts.slug AND ServiceDistricts.exists(pillar, district)` (T4)
   - НЕ оба одновременно, иначе validation/lint fail.

2. **0 redirects при routing** — резолвер делает максимум 1 hop (либо T3 render, либо T4 render, либо 404). Никаких redirect-chains.

3. **Self-canonical** — каждый URL имеет canonical = self (sustained правило #1 ADR-0018). resolver не строит canonical через слом structure.

4. **Cache safety** — три разных cache-tag namespace гарантируют, что инвалидация одной коллекции не сбрасывает чужой кэш.

5. **Static generation** — все 191 URL предгенерируются при build (sustained ISR с revalidate).

## Последствия

### Положительные

- **Минимум refactoring** — sustained файл переименовывается параметром, URL не меняются, нет редиректов.
- **Нет каннибализации** — один URL-pattern, один canonical, один индекс в Yandex/Google.
- **Простая ментальная модель** — «pillar/slug → если slug это sub → T3, если slug это city → T4» — легко объяснить новому инженеру.
- **Совместимость с ADR-0018** — 2-сегмент SD без отклонений.
- **Sustained 35 sub-pages работают** — никаких regression-рисков для sustained traffic.

### Отрицательные / митигированные

- **Одна точка отказа** — один resolver обслуживает 185 URL (35 sub + 150 SD); баг = весь раздел падает. **Mitigation**: Playwright E2E spec `tests/e2e/uslugi-routing.spec.ts` (US-6) для каждого из 185 URL — assert HTTP 200 + correct template. Lighthouse CI gate.
- **Slug-collision risk** при будущем добавлении sub-services или cities. **Mitigation**: 3-уровневая защита (Payload validate + lint:slug CI gate + namespace-audit отчёт перед каждым US-3-style sprint).
- **Performance** — два DB query на каждый URL вместо одного. **Mitigation**: оба query кэшируются в Next.js ISR, hit ratio ожидается ≥95% после прогрева. Sustained `unstable_cache` patterns.

## Реализация

### US-1 (этот US — спека)
- ADR-0019 ← этот файл
- Namespace-audit `specs/EPIC-SEO-USLUGI/US-1-research-spec/namespace-audit.md` — read-only check existing 35 sub-slugs vs 30 city-slugs target list

### US-3 (Payload + scripts)
- Validate-hooks в `Services.ts` + `Districts.ts`
- `site/scripts/lint-slug.ts` + `pnpm lint:slug` в `prebuild`

### US-4 (routing imp)
- `git mv site/app/(marketing)/[service]/[district]/ site/app/(marketing)/[service]/[slug]/`
- Переписать `page.tsx` как resolver
- Новые query: `getServiceDistrict`, `getAllServiceDistrictParams`, `buildServiceDistrictMetadata`
- Новый view: `ServiceDistrictView` (T4 template)

### US-6 (verify)
- `tests/e2e/uslugi-routing.spec.ts` — для каждого URL из inventory: assert template = expectedTemplate

## Сравнение с ADR-0018

ADR-0019 **не противоречит** ADR-0018, а **детализирует** его §«SD route depth уточнено»:
- ADR-0018: «Programmatic SD — 2-сегмент `/<pillar>/<city>/`» (high-level)
- ADR-0019: «Реализация 2-сегмент через slug-resolver с T3/T4 disjoint namespace» (low-level)

ADR-0019 является зеркальным extension'ом, не replacement.

## Status: accepted

Date: 2026-05-08
Signed-off:
- poseo (PO SEO) — author
- sa-seo (SA SEO) — техреvиев AC
- tamd (TA Architecture) — consult: routing-resolver pattern, disjoint namespace guard
- operator — бизнес-апрув (через approved plan `/Users/a36/.claude/plans/team-seo-poseo-md-joyful-globe.md` 2026-05-07)

## Hand-off log

```
2026-05-08 · sa-seo → tamd: ADR-0019 draft на consult по routing-resolver pattern
2026-05-08 · tamd → sa-seo: pattern OK, добавлен пункт о cache-tags namespace и parallel routes отказе
2026-05-08 · sa-seo → poseo: ADR-0019 final, status: accepted
```
