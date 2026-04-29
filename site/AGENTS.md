<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Local admin bootstrap

После `pnpm db:up` создай admin user одной командой — без ручного захода на
`/admin/create-first-user`. Идемпотентно: повторный запуск пропускает
существующих юзеров.

```bash
pnpm db:up && pnpm seed:admin && pnpm dev
```

Затем открой <http://localhost:3000/admin> и залогинься через `ADMIN_EMAIL` /
`ADMIN_PASSWORD` из `.env.local` (defaults см. в `.env.example`). Если задал
`TEST_USER_EMAIL` / `TEST_USER_PASSWORD` — создастся второй admin для
Playwright fixtures.

### tsx + Payload preload shim

Все scripts-команды, импортирующие Payload Local API (`pnpm seed`,
`pnpm seed:admin`, `pnpm seed:prod`, `pnpm publish-services`,
`pnpm publish-services:prod`), запускаются с
`tsx --require=./scripts/_payload-cjs-shim.cjs`. Shim патчит CJS default-import
для `@next/env` — иначе `payload/dist/bin/loadEnv.js` падает с
`Cannot destructure property 'loadEnvConfig' of 'import_env.default'`.
Подробности и условия удаления — в [ADR-0009](../team/adr/ADR-0009-tsx-payload-cjs-shim.md).
