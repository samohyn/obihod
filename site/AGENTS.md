<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Local admin bootstrap

После `pnpm db:up` создай схему миграциями и admin user — без ручного захода на
`/admin/create-first-user`. Идемпотентно: повторный запуск пропускает
существующих юзеров и применённые миграции.

```bash
pnpm db:up && pnpm migrate && pnpm seed:admin && pnpm dev
```

## Схема БД — только миграциями

push выключен (`payload.config.ts`; для одноразовой БД — `PAYLOAD_DEV_PUSH=1`). Изменил
коллекцию/поле/блок → `pnpm schema:diff` → миграция `migrations/<ts>_<имя>.ts` + `.up.sql` +
`.down.sql` (образец — любая из `migrations/legacy/history`) → `pnpm migrate` → `pnpm schema:diff --check`
должен сказать «совпадает». CI делает то же с нуля. Миграция обязана работать со старым кодом
(expand → contract), на сервере она применяется до переключения релиза — `deploy/README.md`.
Локальная БД старше 20.10.2026 приводится к базовой схеме тем же `pnpm migrate`; если `--check`
показывает расхождения — залей свежую копию staging.

Затем открой <http://localhost:3000/admin> и залогинься через `ADMIN_EMAIL` /
`ADMIN_PASSWORD` из `.env.local` (defaults см. в `.env.example`). Если задал
`TEST_USER_EMAIL` / `TEST_USER_PASSWORD` — создастся второй admin для
Playwright fixtures.

### tsx + Payload preload shim

Все scripts-команды, импортирующие Payload Local API (`pnpm seed:admin`,
`pnpm schema:diff`, `pnpm lint:slug`, `pnpm audit:prune`), запускаются с
`tsx --require=./scripts/_payload-cjs-shim.cjs`. Shim патчит CJS default-import
для `@next/env` — иначе `payload/dist/bin/loadEnv.js` падает с
`Cannot destructure property 'loadEnvConfig' of 'import_env.default'`.
Подробности и условия удаления — в [ADR-0009](../team/adr/ADR-0009-tsx-payload-cjs-shim.md).
