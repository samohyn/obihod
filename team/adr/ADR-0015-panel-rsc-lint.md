---
adr: ADR-0015
title: Panel RSC border lint — type guard `pickClientProps()` + ESLint custom rule no-spread-server-props
status: Accepted
date: 2026-05-01
accepted_by: popanel (autonomous mandate)
accepted_date: 2026-05-01
authors: [tamd]
related:
  - team/release-notes/US-12-retro.md
  - team/adr/ADR-0010-payload-views-list-customization.md
  - team/adr/ADR-0013-panel-global-search-performance.md
  - team/adr/ADR-0014-panel-audit-log-storage.md
skill: architecture-decision-records
---

# ADR-0015 · Panel RSC border lint — type guard + ESLint rule

**Статус:** Proposed (autonomous mandate, popanel sign-off pending). При имплементации → Accepted.
**Дата:** 2026-05-01
**Автор:** tamd
**Контекст US:** US-12 retro § Lessons L2 (PANEL-RSC-LINT) — preventive follow-up для предотвращения повторения incident PR #120 → #122 hotfix.
**Skill activation:** `architecture-decision-records` (skill-check iron rule); `nextjs-turbopack`, `frontend-patterns` (контекстно).

---

## Контекст

**Incident pattern (RC-2 PR #120 EMPTY-LIST-WIRING):**
- `site/components/admin/CollectionListWithEmpty.tsx` — server component (RSC).
- Спредил полные Payload server props (включая `access: { create, read, update, delete, unlock }` функции) в client `<DefaultListView>` через `<DefaultListView {...listProps} />`.
- **Type-check OK** (Payload tipes допускают spread по structural typing).
- **Lint OK** (no rule запрещает).
- **Format OK.**
- **Build OK** (Next.js 16 build не валится, Turbopack пропускает).
- **Lighthouse OK** (запускается на пустых данных).
- **Playwright E2E OK** (старые тесты не покрывали `totalDocs > 0` сценарий для Cases / Blog).
- **Runtime fail** на коллекциях с `totalDocs > 0`: RSC border throws `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server"`. 500 на `/admin/collections/cases` (4 docs) и `/admin/collections/blog` (5 docs).
- Blog работал случайно при `totalDocs === 0` — branch с EmptyState не пыталась передать non-serializable props.

**Hotfix PR #122 (squash `e9bd3c1`):**
- fe-panel создал `pickClientProps()` utility — **explicit whitelist** `CLIENT_PROP_KEYS` (25 ключей `ListViewClientProps + ListViewSlots`) + jsdoc-rationale + ссылка на RC-2 incident + reference на `payload/dist/index.bundled.d.ts:7849-7854`.
- Cr-panel approved per iron rule #7 (scope = 1 файл, ~30 строк).

**Memory contributing:**
- `feedback_leadqa_must_browser_smoke_before_push` (2026-04-28) — была написана для предотвращения именно этого класса bug'ов. Memory как **организационное правило** сработала для leadqa (он поймал #120 в gate-фазе через real-browser smoke), но не сработала для fe-panel при подготовке PR #120 (нет force через tooling).
- Это структурный gap: leadqa — single point of truth для browser verification, но он включается в gate-фазе, когда поздно (BLOCK + RC-3 cycle стоил ~1.5-2 часа).

**Следствие:** US-12 retro L2 запросил tamd ADR на «возможно ли eslint rule / TypeScript strict-mode flag, которое ловит spread server-props в client component». Это ADR — ответ.

**RICE из retro:** Reach 3 × Impact 4 × Confidence 0.5 / Effort tbd = baseline pending. Reach 3 = каждый раз когда panel/product/shop трогает Payload custom views. Impact 4 = предотвращает runtime regression на проде.

---

## Решение

**Принимается Strategy 4 — Hybrid: type-level guard `pickClientProps()` utility + ESLint custom rule `obikhod/no-spread-server-props-in-client` + CI gate в Playwright smoke на коллекциях с `totalDocs > 0`.**

### Компонент 1 — Type guard `pickClientProps()` (уже частично shipped в hotfix #122)

```ts
// site/lib/admin/rsc/pickClientProps.ts
/**
 * Type-safe whitelist для props пробрасываемых в client component через RSC border.
 * Payload server props содержат функции (access.create, access.read, ...), которые
 * не сериализуемы и throw'ают `Functions cannot be passed to Client Components`.
 *
 * @see ADR-0015 — RSC border lint
 * @see RC-2 PR #120 incident, hotfix #122 (e9bd3c1)
 * @see node_modules/payload/dist/index.bundled.d.ts:7849-7854 (ListViewClientProps + ListViewSlots)
 */
export function pickClientProps<T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in props) result[key] = props[key];
  }
  return result;
}

// Usage:
import { CLIENT_PROP_KEYS } from '@/lib/admin/rsc/clientPropKeys';
const clientProps = pickClientProps(serverProps, CLIENT_PROP_KEYS);
return <DefaultListView {...clientProps} />;
```

```ts
// site/lib/admin/rsc/clientPropKeys.ts
import type { ListViewClientProps, ListViewSlots } from 'payload';

/**
 * Полный whitelist client-safe props для Payload list view.
 * Verified против Payload 3.84 type definitions.
 * При bump Payload — re-verify против новой версии.
 */
export const CLIENT_PROP_KEYS = [
  // ListViewClientProps
  'collectionSlug',
  'columnState',
  'data',
  'defaultColumnsToShow',
  'enableRowSelections',
  'hasCreatePermission',
  'newDocumentURL',
  'preferenceKey',
  // ... 25 keys total — см. hotfix #122
] as const;
```

### Компонент 2 — ESLint custom rule `obikhod/no-spread-server-props-in-client`

```js
// site/eslint-rules/no-spread-server-props-in-client.js
'use strict';

/**
 * Запрещает JSX spread в client components (где target — компонент,
 * который сам объявлен с 'use client' либо импортирован из файла с 'use client').
 *
 * Allowed: spread из объектов, прошедших pickClientProps() либо явный pick через {a, b, c} = obj.
 *
 * Suppress: // eslint-disable-next-line obikhod/no-spread-server-props-in-client
 *
 * @see ADR-0015
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid JSX spread of server props into client components across RSC border',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [],
    messages: {
      spreadIntoClient:
        'Avoid spreading raw server props into client component "{{name}}". Use pickClientProps(serverProps, CLIENT_PROP_KEYS) — see ADR-0015.',
    },
  },
  create(context) {
    return {
      JSXSpreadAttribute(node) {
        // Heuristic: parent JSX element is a Custom Component (uppercase first letter)
        const parent = node.parent;
        if (!parent || parent.type !== 'JSXOpeningElement') return;
        const elName = parent.name;
        if (elName.type !== 'JSXIdentifier') return;
        if (!/^[A-Z]/.test(elName.name)) return;

        // Check if spread argument is identifier matching server-side conventions:
        //   - props named *ServerProps, *ListProps, *Props (без guard)
        //   - НЕ identifier named clientProps, *ClientProps (assumed safe — passed pickClientProps)
        //   - НЕ ObjectExpression (inline {a, b, c} — explicit, безопасно)
        const arg = node.argument;
        if (arg.type !== 'Identifier') return;
        if (/^(client|safe|picked)/i.test(arg.name)) return;
        if (/clientProps$/i.test(arg.name)) return;

        // Check if target component imported from file with 'use client' OR имеет 'use client' в той же file
        // (full implementation: ESLint module-resolution + AST walk на import target file's first directive).
        // MVP: ругаемся на все uppercase JSX spreads с server-shape names; suppress per-line.

        context.report({
          node,
          messageId: 'spreadIntoClient',
          data: { name: elName.name },
        });
      },
    };
  },
};
```

**Регистрация в `.eslintrc.cjs`:**

```js
const path = require('path');

module.exports = {
  // ...existing config
  plugins: [...existing, '@local'],
  // или через rulePaths (если без полноценного plugin):
  rulePaths: [path.join(__dirname, 'eslint-rules')],
  rules: {
    // ...existing
    'obikhod/no-spread-server-props-in-client': 'error',
  },
};
```

(Implementation note: для full plugin packaging — обернуть в local npm package `eslint-plugin-obikhod` либо использовать `eslint-plugin-local-rules` ([npm](https://www.npmjs.com/package/eslint-plugin-local-rules)) — meta-plugin который читает rules из локальной директории. cr-panel + do выбирают пакетинг в dev-фазе.)

### Компонент 3 — CI gate Playwright smoke на `totalDocs > 0`

Расширение существующих E2E тестов в `site/e2e/admin/` (либо `tests/admin/`):

```ts
// site/e2e/admin/list-views-non-empty.spec.ts
import { test, expect } from '@playwright/test';

const COLLECTIONS_TO_SMOKE = [
  'cases',
  'blog',
  'services',
  'service-districts',
  'b2b-pages',
  'persons',
  // 'leads' добавляется когда seed Lead в fixture (US-?)
];

for (const slug of COLLECTIONS_TO_SMOKE) {
  test(`list view ${slug} renders без runtime errors при totalDocs > 0`, async ({ page }) => {
    // Pre: seed fixture создаёт минимум 1 doc per collection (один раз в test setup)
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    const res = await page.goto(`/admin/collections/${slug}`);
    expect(res?.status()).toBe(200);

    // Verify table rendered (хотя бы 1 row)
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Critical: no Functions-passed-to-Client errors
    const rscErrors = errors.filter((e) =>
      e.includes('Functions cannot be passed directly to Client Components'),
    );
    expect(rscErrors, `RSC border violation: ${rscErrors.join('\n')}`).toHaveLength(0);

    // Acceptable noise: 0 console errors total для list view
    expect(errors).toHaveLength(0);
  });
}
```

Запуск в CI (`do owns green CI before merge` per iron rule #5) — добавить step в `.github/workflows/ci.yml`:
```yaml
- name: E2E admin list views (non-empty smoke)
  run: pnpm --filter site test:e2e -- --project=chromium --grep "list view.*totalDocs"
```

### Покрытие incident pattern

| Mechanism | Catches | Cost | When |
|---|---|---|---|
| `pickClientProps()` type guard | Programmer must explicitly opt-in to safe spread | ~5 LoC per usage | Write-time, manual but visible |
| ESLint rule | Static-detect spread из server-shape variables | <1s in CI | Pre-merge, automatic |
| Playwright totalDocs>0 smoke | Runtime detection на seeded fixture, mirrors prod | ~30-60s в CI | Pre-merge, automatic |
| leadqa real-browser smoke | Last-line catch на staging/prod | Manual ~10 min | Gate phase, organizational |

**Defense in depth:** даже если ESLint rule выдаст false-negative (heuristic name-based), Playwright smoke перехватит. Memory `feedback_leadqa_must_browser_smoke_before_push` остаётся as safety net на gate phase.

---

## Альтернативы

### Альтернатива 1 — `eslint-plugin-react-server-components` (community plugin)

**Pros:**
- Community-maintained — низкая поддержка с нашей стороны.
- Built-in detection RSC patterns (use server, use client directives).
- Может покрывать больше edge cases чем custom rule.

**Cons:**
- **Плагин с таким именем не подтверждён existing on npm на 2026-05-01 (autonomous mandate, без internet research в этой сессии).** Нужна проверка: при наличии — adopt; при отсутствии — N/A.
- Generic plugin может не ловить именно Payload-specific shape (`access` функция в `<DefaultListView>` props).
- Если плагин экспериментальный — риск breaking changes / abandonware.
- Не даёт CI gate runtime detection — только static.

**Verdict:** Investigate first (см. § Implementation outline шаг 1). Если плагин существует и ловит наш pattern — adopt **в дополнение** к custom rule (не вместо), снижает custom code maintenance. Если нет — Strategy 4 standalone.

### Альтернатива 2 — Custom CI gate без ESLint (только AST script + Playwright)

**Pros:**
- Один tool (Playwright) для всей detection.
- Меньше code (нет custom ESLint rule).

**Cons:**
- **Lint-time feedback теряется** — programmer узнаёт о проблеме в CI после push, не в IDE.
- Без ESLint gate любой PR с violation проходит до E2E phase (slow feedback).
- AST script standalone без ESLint integration — meta-tooling (нужно вешать на pre-commit), хрупко.

**Verdict:** Rejected — IDE feedback для разработчика критичен (быстрее цикл). Playwright оставлен как **complement**, не replacement.

### Альтернатива 3 — Next.js 16 built-in linter (`next lint --strict-rsc`)

**Pros:**
- Zero maintenance — Vercel maintains.
- Глубокая integration с Next.js (знает 'use client' / 'use server' directives).

**Cons:**
- **Существование флага `--strict-rsc` на 2026-05-01 не верифицировано** в этой autonomous-сессии. Next.js 16 changelog need check by do/be-panel.
- Если флаг существует но broad scope — может выдавать false positives на legitimate patterns (например, pickClientProps spread).
- Lock-in в Next.js linter (если в будущем поменяем на pure Vite/Remix — linter уйдёт).

**Verdict:** Investigate first (parallel шагу 1). Если флаг существует и работает на наш кейс — adopt **в дополнение**, снижает наш ESLint maintenance до zero для RSC class. Если нет / broad / experimental — Strategy 4 standalone.

### Альтернатива 4 — Hybrid: type guard + ESLint rule + Playwright smoke (выбран — см. § Решение)

### Альтернатива 5 — Memory only + leadqa enforcement

**Pros:**
- Zero tooling.

**Cons:**
- **Уже provably недостаточно** — incident #120 произошёл при наличии memory. Organizational rule не блокирует push.
- Leadqa catches на gate phase = поздно (RC-2 → RC-3 cycle стоил 1.5-2 часа).

**Verdict:** Rejected — статус-кво этого ADR. Memory остаётся as safety net, но не sole gate.

---

## Последствия

### Положительные

- **Defense in depth:** type guard (manual opt-in) + ESLint (static catch) + Playwright totalDocs>0 (runtime catch) — 3 independent layers, любой single failure не пропустит regression.
- **Fast feedback in IDE** — ESLint rule показывает inline ошибку на write-time.
- **Mandatory CI gate** — Playwright step добавляется в `ci.yml`, do owns green CI per iron rule #5.
- **Reuse hotfix #122 work** — `pickClientProps` уже shipped, ADR кодифицирует pattern + расширяет.
- **Rule-suppress mechanism** для known-safe spreads — `// eslint-disable-next-line obikhod/no-spread-server-props-in-client` с jsdoc-rationale (cr-panel review enforces rationale).
- **Снижает RSC class regression risk до near-zero** для panel/product/shop при работе с Payload custom views.
- **CI fast** — ESLint rule O(N file count), <1s overhead. Playwright totalDocs smoke ~30-60s (acceptable per iron rule #5 budget).

### Отрицательные

- **Custom ESLint rule maintenance** — heuristic-based (variable name patterns), false positives возможны. Mitigation: грандфатер через `// eslint-disable-next-line` + cr-panel review enforces jsdoc-rationale.
- **Playwright fixture seed maintenance** — каждая новая коллекция = +1 seed + +1 test entry. Mitigation: data-driven test (loop через `COLLECTIONS_TO_SMOKE` config).
- **ESLint rule packaging boilerplate** — local rule plugin setup ~50-100 строк. Mitigation: `eslint-plugin-local-rules` npm — minimal wrapper.
- **`pickClientProps()` adoption requires manual update** old code — ~3-5 places в `site/components/admin/*` где сейчас может быть raw spread. Audit step ниже.

### Mitigation

- **Grandfather existing violations:** при первом roll-out ESLint rule может ругнуться на existing `<X {...props} />` patterns. Решение: scan + fix (≤5 places ожидается) ИЛИ explicit `// eslint-disable-next-line ... — see follow-up issue` с TODO. cr-panel review enforces fix-forward.
- **False positive escape hatch:** suppress comment **обязательно с jsdoc rationale** (cr-panel checklist). Audit raw counts of suppressions ежеквартально (если >20 — investigate rule heuristics).
- **Performance budget CI:** Playwright totalDocs>0 step ~30-60s. Если CI total >5 минут — investigate (parallelize, sharding).
- **Dependency on Payload type stability:** `CLIENT_PROP_KEYS` whitelist verified per Payload version. На каждый Payload bump — `cr-panel` checklist re-verifies whitelist (1 min check).

### Риски

- **Risk:** ESLint rule heuristic выдаёт false negatives для exotic spread patterns (например, computed keys, conditional spread). Mitigation: defense in depth — Playwright totalDocs>0 покроет runtime; leadqa real-browser smoke на gate phase — last line.
- **Risk:** New collection added без updated Playwright smoke array → false negative window. Mitigation: cr-panel review checklist для new collection PRs включает «added to COLLECTIONS_TO_SMOKE».
- **Risk:** Payload bump меняет `ListViewClientProps` shape → `CLIENT_PROP_KEYS` desync, new client-needed prop missing. Mitigation: type-check fail (TS structural — `<DefaultListView>` будет требовать prop, фейлит build) → дев замечает в local + CI.
- **Risk:** ESLint config conflict с monorepo (apps/shop отдельная команда). Mitigation: rule scoped to `site/**` через ESLint overrides; apps/shop adopts независимо если нужно.
- **Risk:** Custom rule blocks legitimate Payload internal spread (например, `<RenderFields {...field} />` где field server-shape но Payload ожидает). Mitigation: suppress per-line с jsdoc + cr-panel reviews quarterly suppression list.

---

## Implementation outline

1. **Investigation (be-panel + tamd, ~0.5 чд):**
   - Verify exists `eslint-plugin-react-server-components` on npm — `npm view eslint-plugin-react-server-components`. If yes: read changelog, evaluate fit для Payload pattern.
   - Verify exists `next lint --strict-rsc` flag в Next.js 16 — read `.next/next-server` source либо `next lint --help` output.
   - Decision: standalone Strategy 4 OR adopt one/both **в дополнение** к custom rule.
   - Document в spec PANEL-RSC-LINT (sa-panel созданный popanel'ом по этому follow-up).

2. **Audit existing violations (be-panel, ~0.5 чд):**
   - `grep -rE "<[A-Z][a-zA-Z]*\s+\{\.\.\." site/components/admin/ site/app/(payload)/`.
   - List ~3-5 places, audit per-place — safe (already pickClientProps applied) или needs fix.
   - Fix-forward или explicit suppress с jsdoc.

3. **Implement custom ESLint rule (be-panel + cr-panel, ~1 чд):**
   - Setup `eslint-plugin-local-rules` либо local plugin packaging (decision in cr-panel review).
   - `site/eslint-rules/no-spread-server-props-in-client.js`.
   - Unit-tests для rule (`pnpm test eslint-rules`) — happy path + suppress + edge cases.
   - Register в `.eslintrc.cjs` rules.

4. **Promote `pickClientProps` к canonical pattern (be-panel + cr-panel, ~0.5 чд):**
   - Move from inline в hotfix #122 → `site/lib/admin/rsc/pickClientProps.ts` + `clientPropKeys.ts`.
   - Update existing usages.
   - Document в `site/lib/admin/rsc/README.md` (или JSDoc) с reference на ADR-0015.

5. **Add Playwright totalDocs>0 smoke (qa-panel, ~1 чд):**
   - Seed fixture: 1 doc per collection (Cases, Blog, Services, ServiceDistricts, B2BPages, Persons, Districts).
   - Test file `site/e2e/admin/list-views-non-empty.spec.ts` per template выше.
   - Add CI step `pnpm --filter site test:e2e -- --grep "list view.*totalDocs"` в `.github/workflows/ci.yml`.

6. **cr-panel review checklist update (~0.25 чд):**
   - New PR template item: «Touched RSC components? Verified pickClientProps usage + Playwright totalDocs smoke green?»
   - Suppress comments require jsdoc rationale.

7. **Sa-panel template update (popanel orchestrates, ~0.25 чд):**
   - DoD checklist для PR-ов fe-panel/be-panel touching RSC: «Lint passes obikhod/no-spread-server-props-in-client + Playwright list-view smoke green».

8. **leadqa onboarding update (popanel + leadqa, ~0.25 чд):**
   - Real-browser smoke остаётся mandatory per iron rule #6 + memory `feedback_leadqa_must_browser_smoke_before_push` — но теперь with two new tooling layers, leadqa shifts emphasis на UX/visual regression, не на RSC class detection (covered by tooling).

**Total ETA:** ~4-4.5 чд (investigation + impl + adoption + tests + docs).

---

## References

- US-12 retro § 4 Lessons L2 — origin запроса этого ADR.
- US-12 retro § 3.1 — RC-2 BLOCK incident detail.
- US-12 retro § 5 — PANEL-RSC-LINT backlog card (RICE 3×4×0.5/Effort).
- PR #120 (EMPTY-LIST-WIRING) — incident PR.
- PR #122 squash `e9bd3c1` — hotfix создавший `pickClientProps()`.
- Memory: `feedback_leadqa_must_browser_smoke_before_push` (2026-04-28).
- ADR-0010 — precedent для Payload list view customization.
- React docs: https://react.dev/reference/rsc/server-components — Functions cannot be passed directly to Client Components.
- ESLint Custom Rule docs: https://eslint.org/docs/latest/extend/custom-rules.

---

## История

- 2026-04-30 → 2026-05-01 · RC-2 #120 incident → RC-3 #122 hotfix → US-12 closed.
- 2026-05-01 ~11:15 UTC · cpo retro published (US-12-retro.md), L2 запрос tamd ADR с RICE 3×4×0.5/effort.
- 2026-05-01 · popanel передал tamd под autonomous mandate.
- 2026-05-01 · tamd accepted Strategy 4 (Hybrid type guard + ESLint custom rule + Playwright totalDocs>0 smoke + grandfather suppression). Awaiting popanel sign-off → status Accepted, dev-ready.
