# C4 — Migration Plan: master-template v2 rollout без downtime

**EPIC:** EPIC-SERVICE-PAGES-UX
**Wave:** C4
**ADR:** ADR-0021 (master-template)
**Date:** 2026-05-09
**Status:** ready

## Контекст

233 sustained URL (`/uslugi/<pillar>/`, `/uslugi/<pillar>/<sub>/`,
`/<pillar>/<city>/`) уже в prod. ADR-0021 фиксирует master-template из 13 секций
× 3 layer (T2_PILLAR / T3_SUB / T4_SD) с per-layer required/optional/hidden
matrix. C2 wave опубликовал spec, C3 wire-up Payload validators.

C4 wave добавляет **incremental migration mechanism**: per-URL feature flag
`template_v2` + resolver `getBlocksForLayer` + placeholder fill для missing
required sections. Flip flag → URL переключается на v2 рендеринг. Default
false → sustained legacy behavior без regression.

## Артефакты

| Файл                                                                | Назначение                                |
| ------------------------------------------------------------------- | ----------------------------------------- |
| `site/lib/master-template/getBlocksForLayer.ts`                     | resolver: reorder + filter + fill         |
| `site/lib/feature-flags/template-v2.ts`                             | env override + doc-level field reader     |
| `site/lib/master-template/__tests__/getBlocksForLayer.test.ts`      | 29 unit tests                             |
| `site/migrations/20260509_232000_template_v2_flag.{up,down,ts}.sql` | ALTER TABLE add column                    |
| `site/collections/{Services,ServiceDistricts,B2BPages}.ts`          | Payload field `useTemplateV2`             |
| `site/app/(marketing)/[service]/page.tsx`                           | T2 page-level integration                 |
| `site/components/blocks/placeholders/*.tsx`                         | TODO copy для 5+ critical sections (C5)   |

## Resolver контракт

```ts
getBlocksForLayer(
  layer: MasterTemplateLayer,           // T2_PILLAR | T3_SUB | T4_SD
  currentBlocks: DocumentBlock[],
  options: {
    templateV2: boolean,                // false = legacy passthrough
    fillMissingWithPlaceholder: boolean,
    onMissingRequired?: 'warn' | 'throw' | 'silent',
  }
): ResolvedBlock[]
```

Логика при `templateV2=true`:

1. Map `currentBlocks` → section через `SLUG_TO_SECTION`.
2. Drop unknown / hidden / duplicate sections.
3. Reorder под sustained master-template order (1..13).
4. Для каждой `required` section без matching block:
   - `fillMissingWithPlaceholder=true` → insert placeholder block с
     `_placeholder: true` маркером для рендерера.
   - `fillMissingWithPlaceholder=false` → skip (warn / throw / silent).

При `templateV2=false`: identity (return as-is), `_placeholder` не выставляется.

## Feature flag

```
isTemplateV2Enabled(doc) =
  env TEMPLATE_V2_GLOBAL_OVERRIDE='true'   → true
  env TEMPLATE_V2_GLOBAL_OVERRIDE='false'  → false
  env другое или unset                     → fall through
  doc.useTemplateV2 === true               → true
  default                                  → false
```

Flag хранится per-URL в Payload doc — boolean field `useTemplateV2` с
default=false. Migration adds column на 3 коллекциях
(Services / ServiceDistricts / B2BPages).

Override env позволяет qa включать v2 для всех URL разом без правок в админке —
для smoke / dev / regression-runs.

## Rollout phases

### Phase 0 — deploy resolver + flag false everywhere

**Goal:** infra ready, zero behavior change.

- Merge PR с resolver + flag + migration.
- `pnpm migrate:up` на prod (column добавлен с default false).
- 100% URL рендерятся sustained legacy.
- Verify: HTTP 200 на 5 sample URL × 3 layer (15 проб), Lighthouse не deg.

### Phase 1 — staging single URL

**Goal:** smoke новой v2 рендеринги на одном URL в isolated env.

- Включить `useTemplateV2=true` на staging copy `/vyvoz-musora/`.
- qa real-browser smoke (375 / 414 / 768 / 1024 viewports).
- Click-path-audit: hero CTA → calculator → lead-form working.
- Visual diff vs sustained baseline screenshot.
- Если placeholder заметен — собрать TODO copy через C5.

**Exit gate:** qa approve + 0 broken click-paths + Schema.org Rich Results 0
errors + brand-guide compliance signed off design.

### Phase 2 — prod pilot `/vyvoz-musora/`

**Goal:** A/B 7 days на одном pillar, метрики vs baseline.

- Включить `useTemplateV2=true` на `/vyvoz-musora/` через Payload admin save.
- A/B compare:
  - bounce rate (Я.Метрика)
  - lead conversion (Payload Leads + Telegram count)
  - lighthouse perf score
  - schema coverage (composer.ts already 100%)
- Если bounce ↑ или conversion ↓ > 10% → `useTemplateV2=false` (rollback в 1 click).

**Exit gate:** stable / improved metrics за 7 days → proceed Phase 3.

### Phase 3 — staged per-pillar rollout

**Goal:** прокатить v2 на 233 URL за ~8 недель.

| Неделя | Layer    | URL/нед     | Pillar / scope                                    |
| ------ | -------- | ----------- | ------------------------------------------------- |
| W1     | T2       | 5           | All pillars (5 шт)                                |
| W2     | T3       | 30          | Sub-services pillars 1-2                          |
| W3     | T3       | 30          | Sub-services pillars 3-5                          |
| W4-W8  | T4       | 30 / week   | service × district (~150 URL)                     |

Per-неделя workflow:
1. po — список URL для batch.
2. cw — content fill для sections где placeholder бы появился (C5 dependency).
3. dev / fe — flip flag через Payload bulk update API.
4. qa — smoke 5 sample URL × viewports.
5. seo — Я.Метрика snapshot после 24h.

### Rollback

**Trigger:** any URL показывает деградацию метрик / broken UI.

**Action:** через Payload admin → найти doc → uncheck `useTemplateV2` → save.
Effect: ISR revalidate за 60s, return to sustained legacy rendering. Без
кодовых изменений / без rollback миграции.

**Hard rollback** (полное отключение feature):
```bash
TEMPLATE_V2_GLOBAL_OVERRIDE=false pnpm start
```
Override доминирует над doc-level flag для всех 233 URL разом.

## T3/T4 integration note

На момент C4 commit:
- **T2 pillar** (`app/(marketing)/[service]/page.tsx`) — uses BlockRenderer +
  resolver. Готов к flag flip.
- **T3 sub-service** (`SubServiceView.tsx`) — sustained custom JSX без
  BlockRenderer. Resolver wire-up произойдёт в EPIC-D (redesign) или в Phase 2
  rollout если решим раньше seed-ить blocks[] для T3.
- **T4 service-district** (`ServiceDistrictView.tsx`) — то же что T3.

Cross-team handoff: дизайн / cw готовят blocks[] для T3/T4 в C5
(content-fill). После seed Payload `useTemplateV2=true` flip достаточно.

## Smoke / verification

- `pnpm test:unit` — 49/49 passing (включая 29 новых getBlocksForLayer tests).
- `pnpm type-check` — 0 errors.
- `pnpm lint` (на изменённых файлах) — clean.
- Manual: открыть `/vyvoz-musora/` без flag → identical baseline; включить flag
  → master-template order + placeholders для missing required.

## Open questions для po / operator

1. Метрики A/B Phase 2 — sustained Я.Метрика goals достаточно? Или нужен
   custom dashboard (skill `dashboard-builder`)?
2. T3/T4 blocks[] seed timing — в EPIC-D redesign или раньше?
3. Placeholder copy для 13 sections — кто owner: cw или design (TODO copy
   sustained brand-guide §«Empty states»)?

## Hand-off

После С4 merge — gate переходит к **EPIC-D** (visual redesign) для T2/T3/T4 +
**C5** (content-fill для placeholders). Прямой trigger Phase 1 — operator
apruv after this PR.
