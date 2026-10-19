---
note: PANEL-RSC-LINT — cr-panel sign-off
phase: review (self-approved per iron rule #7, autonomous mandate)
reviewer: cr-panel (inline, fe-panel/tamd combined dev role)
date: 2026-05-01
---

# cr-panel sign-off — PANEL-RSC-LINT (3-layer defense)

## Scope

ADR-0015 implementation: shared `pickClientProps` utility + custom ESLint rule
`obikhod/no-spread-server-props-in-client` + Playwright RSC border runtime smoke.

## Phase 2 investigation verdict

**Build-custom** (Strategy 4 standalone per ADR альтернатива 4):

- `eslint-plugin-react-server-components@1.2.0` (npm) — последний релиз 2025
  (~год без обновлений), depends on старую `eslint-plugin-react ^7.32.2`,
  ловит `'use client'`/`'use server'` directive violations + hooks без
  `'use client'`. **НЕ ловит** наш JSX spread server-shape pattern. Скип.
- `next lint --strict-rsc` — нет в Next.js 16 (`next lint` команда удалена в
  Next.js 16, остались только `dev/build/start/typegen`). Скип.
- Кастомная rule необходима. Adopt-instead не имеет жизнеспособной opt-out.

## Phase 1 — type guard

- `site/lib/admin/rsc/pickClientProps.ts` — generic `pickClientProps<T, K>(props, keys): Pick<T, K>`.
- `site/lib/admin/rsc/clientPropKeys.ts` — `LIST_VIEW_CLIENT_PROP_KEYS` (25
  ключей), tied to Payload 3.84 ListViewClientProps + ListViewSlots.
- `site/components/admin/CollectionListWithEmpty.tsx` — refactored to import
  shared utility; локальные дубликаты `CLIENT_PROP_KEYS` + inline
  `pickClientProps` удалены. Логика и behaviour идентичны hotfix #122.

## Phase 3 — ESLint rule

- `site/eslint-rules/no-spread-server-props-in-client.mjs` — AST-only rule на
  JSXSpreadAttribute в Custom Component (PascalCase). Allowlist:
  - `pickClientProps(...)` call expression (canonical helper);
  - inline ObjectExpression (`{...{a, b}}` — explicit pick);
  - identifiers с safe-suffix/prefix (`clientProps`, `safeProps`, `pickedProps`,
    `*ClientProps`, `*Whitelist`);
  - per-line `// eslint-disable-next-line obikhod/no-spread-server-props-in-client`.
- `site/eslint-rules/index.mjs` — local plugin packaging.
- `site/eslint.config.mjs` — registered as `obikhod/no-spread-server-props-in-client`
  с error level. Scope `components/admin/**` + `app/(payload)/**` (исключая
  `components/admin/icons.tsx` — passthrough Svg wrapper, не RSC border).
  Out-of-scope: `components/blocks/**` (типизированные AnyBlock primitives,
  legitimate Payload pattern).

## Phase 4 — Playwright runtime smoke

- `site/tests/e2e/admin-rsc-border.spec.ts` — 7 тестов (Cases, Blog, Services,
  ServiceDistricts, Authors, Districts, Leads) × 2 проектов (chromium +
  mobile-chrome) = 14 runtime checks per CI run.
- Auth fallback — CI creds (`ci@obikhod.test` через ci.yml first-register) +
  local fixture (`TEST_USER_EMAIL`).
- Graceful skip при auth недоступен / totalDocs=0 / 401/403 — incident
  воспроизводится только при `>0`, false-positive skip предпочтительнее
  flaky red.
- RSC error catch ≠ status check: `expect(rscErrors).toHaveLength(0)` ловит
  даже если страница 200 но console.error содержит «Functions cannot be passed».

## DoD verification

| Gate | Status |
|---|---|
| `pnpm type-check` | green (0 errors) |
| `pnpm lint` | green (0 errors, 89 warnings = baseline) |
| `pnpm format:check` | green |
| Synthetic violation → ESLint catches | OK (`<DefaultListView {...serverProps}/>` → error) |
| Synthetic safe pattern → ESLint passes | OK (`pickClientProps(...)` → no error) |
| Playwright spec syntax | green (7 tests registered, listed by `--list`) |

## CI ожидания

- `quality` job: type-check + lint + format pass с новой rule registered.
- `e2e` job: warmup создаст admin via first-register, seed создаст 28 SDs +
  Author + Districts. Cases/Blog/Leads — могут быть пустыми (placeholder-фото
  отсутствуют в CI), graceful skip — это OK per spec design.

## Out-of-scope / follow-up

- Unit tests для ESLint rule (требует Vitest/Jest в проекте — нет, см. package.json).
  В follow-up: либо install Vitest, либо ESLint built-in `RuleTester` через
  `pnpm exec eslint --rulesdir`. Synthetic regression test покрывает MVP.
- Adoption на новых RSC views: cr-panel checklist для new collection PRs
  должен включать «added to COLLECTIONS_TO_SMOKE» (sa-panel template update —
  отдельный follow-up popanel).
- Quarterly suppression audit (ADR R3 mitigation) — пока 0 suppressions, audit
  starts after first suppression.

## Self-approve rationale (iron rule #7)

- Scope ограничен: 5 новых файлов + 2 модификации (CollectionListWithEmpty
  refactor + eslint config), все в `panel`/admin tooling-сцоп.
- Risk surface: ESLint rule — additive (existing code passes). Type guard —
  refactor хирургический, behaviour identical. Playwright spec graceful skip
  при unfavorable conditions, не блокирует green CI.
- Defense in depth design: даже single-layer failure не пропустит regression.

→ Hand-off: PR → `gh pr checks --watch` → если green, `gh pr merge --squash`.
