# ADR-0009: tsx + Payload Local API CJS-shim для @next/env default-import

**Дата:** 2026-04-29
**Статус:** Accepted
**Автор:** tamd
**Контекст US:** TASK-COMMON-SCRIPTS-RUNTIME-FIX (P0 infra-блокер для PANEL-DEV-SEED-ADMIN, US-12-W2.A local-verify, US-12-W7 Playwright fixtures, US-1 prod-seed re-run)

## Контекст

Все tsx-скрипты, использующие Payload Local API (`pnpm seed`, `pnpm seed:admin`,
`pnpm seed:prod`, `pnpm publish-services`, `pnpm publish-services:prod`), падают
на старте c:

```
TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default'
  as it is undefined.
  at .../payload/dist/bin/loadEnv.js:3
```

**Root cause:**

1. Payload 3.84.1 в `payload/dist/bin/loadEnv.js` (CJS-вывод TypeScript-исходника
   `loadEnv.ts`) использует:
   ```js
   import nextEnvImport from '@next/env'
   const { loadEnvConfig } = nextEnvImport
   ```
2. `@next/env` (обе версии — `15.5.15` peer-dep payload и `16.2.4` peer-dep next)
   опубликован как **CJS named-only**: `module.exports.loadEnvConfig` есть,
   `module.exports.default` отсутствует.
3. tsx 4.21.0 на Node 24, обрабатывая `import x from 'cjs-named-only-module'`,
   возвращает `default = undefined` (без synthetic `default = exports`).
   `pnpm exec tsx -e "import e from '@next/env'; console.log(typeof e)"` →
   `undefined`.
4. Destructure `const { loadEnvConfig } = undefined` падает.

**`pnpm dev` (Next.js Turbopack) не задет** — Next грузит env собственным
загрузчиком, не дёргая `payload/bin/loadEnv.js`.

**Latest payload === 3.84.1** на момент решения (npm registry,
`dist-tags.latest = 3.84.1`); фикса вверх по версиям нет.

## Решение

Используем **single-file CJS preload shim**
`site/scripts/_payload-cjs-shim.cjs`, подключаемый через
`tsx --require=./scripts/_payload-cjs-shim.cjs` в каждом scripts-команде
package.json, который импортирует Payload Local API.

Shim до загрузки payload:

1. Резолвит `@next/env` от пути `payload`-пакета (через
   `Module.createRequire(require.resolve('payload'))`) — это даёт **ту самую**
   физическую копию `@next/env`, которую увидит `payload/dist/bin/loadEnv.js`
   при своём `require('@next/env')` (в pnpm-store их две — 15.5.15 для payload
   и 16.2.4 для next; нам нужна payload's).
2. Если у CJS-модуля нет `default`-ключа — пишет `module.exports.default = module.exports`
   (self-reference). Когда payload-loadEnv делает default-import, tsx-loader
   возвращает закэшированный объект с этим self-default, destructure находит
   `loadEnvConfig`, всё работает.
3. Защита `if (!nextEnv.default)` делает shim no-op как только первоисточник
   починят (Payload поправит import либо @next/env добавит `default` export).

Shim применяется к 5 scripts: `seed`, `seed:prod`, `seed:admin`,
`publish-services`, `publish-services:prod`. Скрипт `fal:gen` без shim —
он не использует Payload.

## Альтернативы

Все 6 путей из `specs/TASK-COMMON-SCRIPTS-RUNTIME-FIX/intake.md` были
рассмотрены и отвергнуты в пользу path G (CJS shim):

### A. Bump Payload до версии с фиксом

- **Pros**: «правильный» upstream-фикс, ноль maintenance.
- **Cons / why not**: latest = 3.84.1 (уже стоит). В changelog 3.83→3.84.1
  нет упоминания фикса этой ESM/CJS interop проблемы. Нет версии для bump.

### B. dotenv-shim до импорта payload

- **Cons / why not**: загрузка env происходит, но destructure случается ДО
  любой нашей строки кода — payload `bin/loadEnv.js` срабатывает на самом
  `import 'payload'`. dotenv не обходит destructure.

### C. Заменить tsx на bun

- **Cons / why not**: memory `project_tooling.md` явно запрещает bun для Payload
  (известные runtime-инциденты с Drizzle/Postgres-адаптером в bun); смена
  тулинга требует ре-апрува оператора и outside scope текущего P0-фикса.

### D. HTTP REST через `pnpm dev`

- **Pros**: обходит payload bin/loadEnv.js — мы не импортим payload в скрипте.
- **Cons / why not**: требует поднятого dev-сервера в pre-step (порт 3000
  должен быть свободен), теряется атомарность Local API (одна транзакция
  → много HTTP round-trip), `seed:prod` пришлось бы переписать на отдельный
  flow (на проде нет dev-сервера). Большая инвазивность (переписать ~1100
  строк в `seed.ts`, ~70 в `seed-admin.ts`), высокий риск регрессий US-1
  prod-seed.

### E. `pnpm patch` payload bin/loadEnv.js

- **Cons / why not**: модификация node_modules-источника. Patch ломается при
  каждом bump Payload (нужно re-roll), `pnpm install --frozen-lockfile` в CI
  тащит patch как артефакт; высокий maintenance burden.

### F. `payload run` CLI обёртка

- **Cons / why not**: в Payload 3.x нет CLI-команды для произвольных
  user-скриптов (`payload` CLI ограничен `migrate`, `generate:types`,
  `generate:importmap`).

### G (выбран). Single-file CJS preload shim

- **Pros**:
  - 1 файл, 13 строк рабочего кода без модификации node_modules.
  - Один shim для всех 5 скриптов (`seed`, `seed:prod`, `seed:admin`,
    `publish-services`, `publish-services:prod`).
  - `seed:prod` (US-1 production flow) защищён от той же проблемы — раньше
    тоже бы упал.
  - Авто-инвалидация: `if (!nextEnv.default)` делает shim no-op как только
    Payload или @next/env починят upstream.
  - Нулевая инвазивность в код самих скриптов — `seed.ts` / `seed-admin.ts` /
    `publish-services.ts` не тронуты.
  - Локализованный maintenance — комментарий в shim указывает условие
    удаления.
- **Cons**:
  - Дополнительная косвенность для нового разработчика: «почему `--require`
    шим?» — JSDoc в файле объясняет.
  - Shim CJS, не TS — но это единственный способ для CJS-preload через
    `--require`. ESLint-правило `@typescript-eslint/no-require-imports`
    отключено локально через `eslint-disable` с комментарием-обоснованием.

## Последствия

### Плюсы

- PANEL-DEV-SEED-ADMIN разблокирован — `pnpm seed:admin` создаёт
  admin + test-user идемпотентно.
- US-1 prod-seed `pnpm seed:prod` снова можно запустить (раньше тоже бы
  упал, но не было повода проверить — теперь защищено).
- US-12 W2.A local-verify работает — leadqa может seed'нуть admin без
  ручного `/admin/create-first-user`.
- US-12 W7 Playwright фикстуры могут использовать seed'нутого `test-user`.
- Type-check / lint / format:check — зелёные.

### Минусы / риски

- **Pre-existing data issue в `pnpm seed`**: Service `chistka-krysh` в
  intake-данных имеет meta description, который не проходит Payload
  validation. К нашему фиксу не относится (proof: shim прошёл, payload
  загружен, валидация запустилась — это не инфра-баг). Открытый ticket
  для команды product / SEO: `TASK-PRODUCT-SEED-METADATA-FIX` — обновить
  длину meta description у chistka-krysh в `scripts/seed.ts` под лимит
  Services collection (160 chars).
- **Shim — workaround, не root-fix**: если Payload 3.85+ изменит
  `bin/loadEnv.js` несовместимо (например, перейдёт на
  `import * as nextEnv from '@next/env'`) — shim останется no-op, ничего
  не сломается, но shim можно будет удалить и упростить scripts-команды.
- **Привязка к pnpm-структуре node_modules**: `require.resolve('payload')`
  работает в любом package manager (npm/yarn/pnpm), но логика «у payload
  своя peer-копия @next/env» — pnpm-specific. На npm/yarn будет одна
  плоская копия, что тоже OK (shim запатчит её).

### Follow-ups

- **TASK-PRODUCT-SEED-METADATA-FIX** (новая) — починить длину meta
  description у Service `chistka-krysh` в seed.ts (поручаю команде product,
  не блокирует текущий релиз).
- **Watch upstream**: если Payload >= 3.85 или @next/env >= 16.3 починят
  ESM-default-import — удалить shim и `--require` флаги из 5 scripts
  команд package.json.
- **Apply to apps/shop**: когда команда shop начнёт scripts с Payload
  Local API (если решит использовать payload как admin для своих
  collections — пока ADR-0006 решил иначе, своя Drizzle), та же проблема
  появится. Shim переиспользуем при необходимости.

## Артефакты

- `site/scripts/_payload-cjs-shim.cjs` — preload shim (новый).
- `site/package.json` scripts-секция: 5 команд получили
  `--require=./scripts/_payload-cjs-shim.cjs` префикс.
- `site/AGENTS.md` — упоминание shim в "Local admin bootstrap" (если
  оператор/разработчик увидит ошибку без shim — отсылка сюда).

## Verification

```bash
pnpm db:up
pnpm seed:admin   # создаёт admin + test-user, идемпотентно повторим
pnpm seed:admin   # пропускает оба → "already exists, skipping"
pnpm seed         # запускается, обрабатывает все коллекции (1 pre-existing
                  #   data error в chistka-krysh — отдельная задача)
pnpm type-check   # OK
pnpm lint         # 0 errors (82 pre-existing warnings)
pnpm format:check # All matched files use Prettier code style!
```

Прогон 2026-04-29 через tamd.
