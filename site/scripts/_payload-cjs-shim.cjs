/**
 * Preload shim для tsx + Payload Local API.
 *
 * **Проблема (ADR-0009):** Payload 3.84.1 в `payload/dist/bin/loadEnv.js` пишет
 *
 *     import nextEnvImport from '@next/env'
 *     const { loadEnvConfig } = nextEnvImport
 *
 * `@next/env` (15.5.x и 16.2.x) — CJS named-only: `module.exports.loadEnvConfig`
 * есть, но `module.exports.default` отсутствует. tsx 4.21.0 на Node 24 при
 * default-импорте такого CJS-модуля возвращает `undefined` → destructure падает
 * с `Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is
 * undefined`.
 *
 * **Фикс:** до загрузки payload пре-резолвим `@next/env` от пути payload-пакета
 * (pnpm может держать несколько копий — payload видит свою через peer-deps), и
 * инжектим self-reference в `default`. Когда tsx-loader загрузит `loadEnv.js` и
 * сделает `require('@next/env')`, он получит закэшированный модуль с `default`
 * и destructure пройдёт.
 *
 * **Использование:** `tsx --require=./scripts/_payload-cjs-shim.cjs <script.ts>`.
 *
 * **Когда удалить:** после фикса в Payload core (proper namespace import) или
 * после фикса в @next/env (export `default`). Защита `if (!nextEnv.default)`
 * делает shim no-op автоматически.
 */
/* eslint-disable @typescript-eslint/no-require-imports -- CJS preload by design */
const Module = require('module')

// Resolve @next/env from payload's perspective (pnpm peer-deps).
// payload main entry резолвится в pnpm-store-узел, рядом с которым лежит
// его @next/env. createRequire с path к самому payload main даёт правильный
// peer-resolve (payload/package.json не в "exports", поэтому используем main).
const payloadEntry = require.resolve('payload')
const payloadRequire = Module.createRequire(payloadEntry)
const nextEnv = payloadRequire('@next/env')

if (nextEnv && !nextEnv.default) {
  nextEnv.default = nextEnv
}
