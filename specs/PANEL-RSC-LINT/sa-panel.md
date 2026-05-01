---
us: PANEL-RSC-LINT
title: RSC border lint — type guard + ESLint rule + Playwright gate
team: panel
po: popanel
type: tooling
priority: S
segment: admin
phase: spec-approved
role: sa-panel
status: dev-ready
related: [US-12-retro, ADR-0015, PANEL-EMPTY-LIST-WIRING-RSC-FIX]
adr: ADR-0015 (Accepted 2026-05-01 popanel autonomous mandate)
created: 2026-05-01
updated: 2026-05-01
skills_activated: [product-capability, design-system]
---

# PANEL-RSC-LINT — Spec (sa-panel)

## Skill activation

- `product-capability` — formalize tooling capability (3 layers defense-in-depth)
- `design-system` — coordination с custom.scss / RSC architecture

## Цель

Prevent повторения incident RC-2 BLOCK (PR #120 → hotfix #122). Любой PR с RSC server-props spread в client component должен fail в CI ДО merge — не дожидаясь leadqa real-browser smoke (last-line safety).

## Architecture (per ADR-0015)

3 independent layers:

1. **Type guard utility** `site/lib/admin/rsc/pickClientProps.ts` — кодифицирует pattern из hotfix #122. Generic `pickClientProps<T extends keyof ServerProps>(props, allowlist: T[])`. Используется во всех server-component custom views.
2. **Custom ESLint rule** `eslint-plugin-obikhod/no-spread-server-props-in-client.ts` — статический check на AST level. Ловит `<ClientComp {...serverProps} />` patterns. Grandfather через `// eslint-disable-next-line obikhod/no-spread-server-props-in-client` для known-safe spreads.
3. **Playwright CI gate** `tests/e2e/rsc-border.spec.ts` — runtime smoke на коллекциях с `totalDocs > 0` для всех custom views. Fixture seed 1 doc per affected collection (Cases, Blog, Services, Authors, Leads, ServiceDistricts, Districts).

## AC (5)

- [ ] **AC1** Type guard `pickClientProps` exported из `site/lib/admin/rsc/`, typed strict, с unit tests (10+ cases)
- [ ] **AC2** ESLint rule `obikhod/no-spread-server-props-in-client` написан + integrated в `eslint.config.mjs`. Triggers ERROR на violation. Tests rule для positive/negative cases.
- [ ] **AC3** Playwright spec `tests/e2e/rsc-border.spec.ts` создан, fixture seed → проверяет 7 коллекций × `totalDocs > 0` рендерятся без 500.
- [ ] **AC4** CI workflow `ci.yml` triggers ESLint rule + Playwright spec. Fail → PR red.
- [ ] **AC5** Investigation step (be-panel pre-impl): проверить `eslint-plugin-react-server-components` на npm + `next lint --strict-rsc` в Next.js 16. Если доступны — adopt **в дополнение** (снижает custom rule maintenance), не вместо.

## Implementation phases

### Phase 1: Type guard (fe-panel + cr-panel) — 0.5 чд

- Refactor existing `pickClientProps` из `CollectionListWithEmpty.tsx` (hotfix #122) в shared utility
- Generic typed signature
- Unit tests (Vitest или Jest — что в проекте используется)

### Phase 2: Investigation step (be-panel) — 0.3 чд

- Check `eslint-plugin-react-server-components` npm availability (cnt downloads, last update, maintenance)
- Check Next.js 16 changelog для `--strict-rsc` либо аналогичных flags
- Решение: adopt-in-addition / адопт-instead / build-custom

### Phase 3: ESLint rule (fe-panel + tamd) — 1.5 чд

- Если custom rule: `eslint-plugin-obikhod/no-spread-server-props-in-client.ts` (на базе AST analysis)
- Tests: positive cases (server spread в client), negative cases (правильный pickClientProps usage), edge cases (deep nesting, conditional spread)
- Integrate в `eslint.config.mjs`

### Phase 4: Playwright CI gate (qa-panel + do) — 1 чд

- `tests/e2e/rsc-border.spec.ts` — fixture seed 1 doc per 7 коллекций
- Iterate через `/admin/collections/<slug>/` — assert response 200, не 500
- Add to `ci.yml` workflow (separate job либо в существующий)

### Phase 5: cr-panel + leadqa smoke

- Brand-guide compliance N/A (tooling)
- leadqa: regression check — ESLint catch синтетический violation в throwaway commit, Playwright catch синтетический 500 в throwaway commit

**Total:** 4-4.5 чд

## Risks + mitigations

- **R1:** Custom ESLint rule maintenance overhead. **Mitigation:** Investigation Phase 2 → если community plugin существует, adopt вместо custom.
- **R2:** Playwright fixture seed может конфликтовать с existing E2E spec'ами. **Mitigation:** Use isolated test DB (prefer Docker container) либо unique slug prefix `_rsc-test-*`.
- **R3:** False positive ESLint на legitimate spreads (например debug components). **Mitigation:** `// eslint-disable-next-line` escape hatch + документация когда spread OK.

## Out-of-scope

- Не lint все client components — фокус на server→client RSC border
- Не replace memory `feedback_leadqa_must_browser_smoke_before_push` — остаётся last-line safety net
- Не upstream PR в Next.js core (если built-in нет — custom is OK для проекта)

## Brand-guide §12 mapping

N/A — tooling, не UI.

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | spec request на базе ADR-0015 (autonomous mandate) |
| 2026-05-01 | sa-panel | popanel | spec ready, dev-ready (no further ADR — ADR-0015 покрывает) |
| 2026-05-01 | popanel | sa-panel | self-approved (autonomous mandate), status `dev-ready`, queued после current sequential dev wave |
