---
task: COMMON-SCRIPTS-RUNTIME-FIX
title: pnpm seed / seed:admin падают на @next/env CJS-default destructure (Payload 3.84.1 + tsx 4.21.0 + Node 24)
team: common
po: тех-лид (tamd) + do
type: infra-bug
priority: P0
phase: implemented
status: resolved
resolved_by: ADR-0009 (tamd 2026-04-29, path G — CJS preload shim)
resolved_files: [site/scripts/_payload-cjs-shim.cjs, site/package.json, site/AGENTS.md, team/adr/ADR-0009-tsx-payload-cjs-shim.md]
blocks: [PANEL-DEV-SEED-ADMIN, US-12-W2.A-local-verify, US-12-W7-playwright, US-1-seed-prod-db-rerun]
related: [PANEL-DEV-SEED-ADMIN]
created: 2026-04-29
discovered_by: popanel
discovered_during: PANEL-DEV-SEED-ADMIN local-verify
---

# COMMON-SCRIPTS-RUNTIME-FIX · pnpm seed* tsx-скрипты сломаны

## Симптом

Все tsx-скрипты, импортирующие `getPayload` из Payload Local API, падают на старте:

```
TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined.
    at loadedEnvFiles (.../payload/dist/bin/loadEnv.js:3:9)
    at Object.<anonymous> (.../payload/dist/bin/loadEnv.js:6:21)
    at Module._compile ...
    at Object.transformer (.../tsx@4.21.0/.../register-D46fvsV_.cjs:3:1104)
    at <anonymous> (.../payload/dist/exports/node.js:4:25)
```

Воспроизведение:
```
pnpm db:up
pnpm seed             # (или pnpm seed:admin) — оба падают
```

## Корень

В `payload/dist/bin/loadEnv.js`:
```js
import nextEnvImport from '@next/env';
const { loadEnvConfig } = nextEnvImport;
```

`@next/env@15.5.15` (тот, что Payload 3.84.1 тянет как peer-dep) — **CJS named-only**. `module.exports.default = undefined`. tsx 4.21.0 на Node 24 при интерпретации `import nextEnvImport from '@next/env'` через CJS-loader делает `const nextEnvImport = require('@next/env').default` → `undefined` → destructure падает.

Подтверждение:
```bash
$ node -e "const m=require('@next/env'); console.log('default:',typeof m.default,'loadEnvConfig:',typeof m.loadEnvConfig)"
default: undefined loadEnvConfig: function
```

## Что НЕ сломано

- `pnpm dev` (Next.js Turbopack) — работает, `/admin/login` рендерится корректно (проверено popanel 2026-04-29 через Playwright, `screen/seed-admin-login-renders.png`).
- `pnpm type-check`, `pnpm lint`, `pnpm format:check` — зелёные.
- БД доступна, миграции на месте, существующий user `samohingeorgy@gmail.com` логинится через UI.

## Что блокируется

- **PANEL-DEV-SEED-ADMIN** — seed-admin.ts код корректный (review зелёный), но runtime smoke невозможен.
- **US-12 Wave 2.A local-verify** — leadqa не может воспроизводимо логиниться без seed.
- **US-12 Wave 7 Playwright** — fixture test-user не создаётся.
- **US-1 seed prod re-run** — если когда-нибудь нужно будет пересеить prod через `pnpm seed:prod`, тоже падёт.

## Возможные пути решения (для tamd / do оценить)

**A. Обновить Payload до >=3.85 (если они уже починили).** Проверить changelog. Минимальный риск, если регрессий нет.

**B. Поправить tsx CLI invocation на `node --import tsx`** + явно подгружать env через `dotenv/config` ДО импорта `payload`:
```ts
import 'dotenv/config'  // payload bin/loadEnv ещё стригерится, но env уже загружен
import { getPayload } from 'payload'
```
Не факт что обходит сам destructure-bug.

**C. Заменить tsx на bun runtime** для скриптов: `bun --env-file=.env.local scripts/seed.ts`. memory `project_tooling.md` запрещает bun для Payload — нужен ре-апрув от оператора.

**D. Не использовать Local API в скриптах — обращаться через HTTP REST к локально запущенному dev-серверу.** `POST /api/users` через fetch. Минус: требует поднятого dev-сервера в pre-step.

**E. Patch payload's bin/loadEnv через pnpm patch** — chиркнуть `import nextEnvImport from '@next/env'` → `import * as nextEnvImport from '@next/env'`. Минус: maintenance burden, ломается при апдейте Payload.

**F. Создать обёртку через `payload run` CLI** — если у Payload есть CLI-команда для custom скриптов. Не уверен что есть.

## Рекомендация popanel

**Сначала A** (обновить Payload, проверить чейнджлоги). Если не поможет — **D** (HTTP REST через dev-сервер) как самое прагматичное и минимально-инвазивное.

Если **B/C/D/E** требуют изменений в архитектуре скриптов — нужен ADR от tamd.

## Acceptance Criteria

- [ ] `pnpm seed` не падает на старте (любой подходящий tsx/runtime workaround).
- [ ] `pnpm seed:admin` создаёт admin user из ENV без ручного захода на `/admin/create-first-user`.
- [ ] `pnpm seed:prod` (production safety-gate) тоже работает (regression check для US-1).
- [ ] `pnpm type-check && pnpm lint && pnpm format:check` остаются зелёными.
- [ ] Документация в `site/AGENTS.md` обновлена (если изменился способ запуска).

## Hand-off

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-04-29 | popanel | tamd + do | **escalation P0** — все tsx-скрипты Payload Local API сломаны; нужен фикс или ADR. До решения PANEL-DEV-SEED-ADMIN остаётся `blocked`, popanel НЕ может прогнать local-verify. |
