# site/blocks/

Payload blocks для service-страниц `/uslugi/*` (T2/T3/T4) + B2B landings.

## Master template (ADR-0021)

Источник правды — [`master-template.ts`](./master-template.ts). Реализует
ADR-0021 (`team/adr/ADR-0021-service-page-master-template.md`):

- 13 секций в фиксированном order
- per-layer matrix `T2_PILLAR / T3_SUB / T4_SD` с `required / optional / hidden`
- mapping каждой секции на §brand-guide.html
- runtime validator (без zod runtime — sustained constraint
  `site/package.json`)

### Layer enum

| Layer        | URL pattern         | Кол-во | Источник             |
| ------------ | ------------------- | ------ | -------------------- |
| `T2_PILLAR`  | `/<pillar>/`        | 5      | Services             |
| `T3_SUB`     | `/<pillar>/<sub>/`  | 35     | Services.subServices |
| `T4_SD`      | `/<pillar>/<city>/` | 150    | ServiceDistricts     |
| `T2_PILLAR*` | `/b2b/<slug>/`      | 6      | B2BPages             |

`T1_HUB` (homepage) — отдельный template, **не покрывается** master-template.

### Sections matrix (13 × 3)

| #   | Section            | T2_PILLAR | T3_SUB   | T4_SD    | Brand-guide                 |
| --- | ------------------ | --------- | -------- | -------- | --------------------------- |
| 1   | hero               | required  | required | required | §service-hero (v2.4)        |
| 2   | breadcrumbs        | required  | required | required | §nav (extension medium)     |
| 3   | tldr               | required  | required | required | §components (extension)     |
| 4   | services-grid      | required  | hidden   | hidden   | §components:1299            |
| 5   | pricing-block      | required  | required | required | §pricing-table (v2.4)       |
| 6   | calculator         | required  | required | required | §calculator-shell (v2.4)    |
| 7   | process            | required  | required | required | §process-steps (v2.5)       |
| 8   | mini-case          | required  | optional | required | §mini-case (v2.5)           |
| 9   | faq                | required  | required | required | §faq-accordion (v2.5)       |
| 10  | cta-banner         | required  | optional | required | §site-chrome:3934 (ready)   |
| 11  | related-services   | required  | required | optional | §components:1299 (ready)    |
| 12  | neighbor-districts | hidden    | required | required | §district chips (extension) |
| 13  | lead-form          | required  | required | required | §lead-form-full (v2.4)      |

Полная matrix с brand-guide line-references — в `master-template.ts`
константе `masterTemplate`.

NB: section name `calculator` ↔ Payload block slug `calculator-placeholder`
(см. `Calculator.ts`). Mapping в `SLUG_TO_SECTION` обрабатывает drift.

## Validation flow

```
Payload doc
    ↓
collection.hooks.beforeValidate
    ↓
buildMasterTemplateGate({ layerResolver })  ← lib/admin/master-template-gate.ts
    ↓
validateBlocksAgainstTemplate(layer, doc.blocks)
    ↓
{ valid: boolean, errors: string[] }
    ↓
valid=false → throw Error(RU-сообщение) → Payload admin показывает редактору
valid=true  → data passes through, save proceeds
```

**Когда срабатывает:**

- Только при публикации (`publishStatus === 'published'` или Payload
  `_status === 'published'` если коллекция использует drafts API без custom
  publishStatus).
- Sustained docs остаются валидными — гейт additive.

**Что проверяет:**

- Все required секции для layer присутствуют (иначе `MISSING_REQUIRED`)
- Hidden секции для layer отсутствуют (иначе `PRESENT_HIDDEN`)
- Нет дубликатов (иначе `DUPLICATE_SECTION`)
- Unknown block (вне master-template, например legacy `text-content`)
  репортится как `UNKNOWN_BLOCK` — debug-only, не блокирует publish

**Что НЕ проверяет (out-of-scope):**

- §brand-guide reference актуальность (PR-review qa role)
- Order секций в `blocks[]` Payload-документе (resolver C4 wave reorder'ит)
- Контент внутри секций (300 слов, форма, mini-case — это
  `lib/admin/publish-gate.ts`)

## Subscribed коллекции

Hook подключён через `buildMasterTemplateGate({...})` в:

| Collection         | Layer       | Notes                                          |
| ------------------ | ----------- | ---------------------------------------------- |
| `Services`         | `T2_PILLAR` | `alsoCheckPayloadStatus=true` (drafts API)     |
| `ServiceDistricts` | `T4_SD`     | После `requireGatesForPublish` + `publishGate` |
| `B2BPages`         | `T2_PILLAR` | `alsoCheckPayloadStatus=true` (drafts API)     |

`Districts` и `Cases` — НЕ покрываются (master-template = `/uslugi/*` only,
ADR-0021 §«Scope»).

## Как добавить новую секцию

1. **Brand-guide first** — секция должна маппиться на §
   `design-system/brand-guide.html`. Если нет — design расширяет brand-guide
   (PR в `design-system/`).
2. Создать новый ADR (например, `ADR-0022-section-X.md`) с rationale +
   per-layer presence matrix.
3. Создать Payload Block (`site/blocks/X.ts`) — slug kebab-case.
4. Добавить запись в `masterTemplate` const с правильным `order`,
   `presence`, `brand_guide`, `journey_step`.
5. Зарегистрировать slug → section в `SLUG_TO_SECTION`.
6. Подключить блок в `blockReferences` нужных коллекций (Services /
   ServiceDistricts / B2BPages).
7. Добавить тест в `__tests__/master-template.test.ts`:
   - secion в required-set для applicable layer
   - secion в hidden-set для inapplicable layer
8. `pnpm type-check && pnpm lint && pnpm test:unit` — все зелёные.
9. Update этого README — Sections matrix table + Brand-guide reference.

## Запуск тестов

```bash
pnpm --filter site test:unit
# → 20+ tests passing, runtime ~180ms
```

Под капотом: `tsx --test blocks/__tests__/master-template.test.ts` через
node:test runner. vitest/jest НЕ установлены (sustained constraint).

## Связь с другими файлами

- ADR-0021 — `team/adr/ADR-0021-service-page-master-template.md`
- Brand-guide — `design-system/brand-guide.html` v2.5+
- Inventory — `design-system/inventory-services-2026-05.md`
- Liwood anatomy — `seosite/01-competitors/liwood-page-anatomy-2026-05.md`
- composer.ts (JSON-LD) — `site/lib/seo/composer.ts` (US-3 done)
- C4 resolver (TODO) — `site/lib/blocks/resolver.ts` (`getBlocksForLayer`)
- Publish-gate sibling — `site/lib/admin/publish-gate.ts` (300-word check)
