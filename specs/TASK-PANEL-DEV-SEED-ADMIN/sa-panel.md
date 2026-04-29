---
task: PANEL-DEV-SEED-ADMIN
title: Seed admin user для local dev + Playwright fixtures
team: panel
po: popanel
type: dev-infra
priority: P0
phase: dev
role: sa-panel
status: approved
blocks: [US-12-W2.A-local-verify, US-12-W7-playwright]
blocked_by: []
related: [US-12-W2.A, US-12-W7, project_cicd_backlog]
created: 2026-04-29
updated: 2026-04-29
skills: [api-design]
---

# sa-panel — PANEL-DEV-SEED-ADMIN · Seed admin user для local dev + Playwright

**Status:** `verify-passed · ready-to-merge` (popanel 2026-04-29) — sa approved, be-panel реализация завершена, infra-блокер закрыт ADR-0009 (tamd), local-verify все 5 AC зелёные, browser smoke в `screen/seed-admin-login-success.png`, do-checks (type-check + lint + format) зелёные. Готово к cr-panel review + merge.
**Author:** sa-panel
**Effort:** 0.3 ЧД (be-panel)
**Branch:** `panel/integration` (под-ветка `feature/seed-admin-local`)

---

## Зачем

Сейчас после `pnpm db:up` оператор / leadqa / qa-panel вручную создают admin user через `/admin/create-first-user`. Это:
- ломает iron rule **leadqa local-verify ДО push** (memory `feedback_leadqa_must_browser_smoke_before_push.md`) — повторная регистрация = риск пропустить regression;
- блокирует **Wave 2.A Login UI** smoke (некому логиниться detect-able password'ом);
- блокирует **Wave 7 Playwright admin** (нужен изолированный test user с известным паролем + idempotent setup);
- значился в memory `project_cicd_backlog.md` как «seed данных» — отложен, теперь становится критичным.

## Acceptance Criteria

### AC-1 · Idempotent admin bootstrap
- [ ] `pnpm seed:admin` создаёт admin user из `ADMIN_EMAIL` + `ADMIN_PASSWORD` env, если не существует.
- [ ] Повторный запуск `pnpm seed:admin` → выходит с кодом 0, печатает `[seed:admin] user already exists, skipping`, не создаёт дубль.
- [ ] Если `ADMIN_EMAIL` или `ADMIN_PASSWORD` не заданы → выходит с кодом 1, печатает `[seed:admin] missing ADMIN_EMAIL or ADMIN_PASSWORD in env`.
- [ ] Создаваемый user имеет `role: admin` (см. `site/collections/Users.ts`).

### AC-2 · Test user для Playwright
- [ ] Если заданы `TEST_USER_EMAIL` + `TEST_USER_PASSWORD` — создаётся второй user с `role: admin`, idempotent.
- [ ] Email test-user'а **обязан отличаться** от `ADMIN_EMAIL` (assert на старте, exit 1 при коллизии).

### AC-3 · `.env.example` + документация
- [ ] В `site/.env.example` добавлены placeholder-значения:
  ```
  # Local dev: запускается через `pnpm seed:admin` после `pnpm db:up`
  ADMIN_EMAIL=admin@obikhod.local
  ADMIN_PASSWORD=obikhod_dev_admin
  TEST_USER_EMAIL=test@obikhod.local
  TEST_USER_PASSWORD=obikhod_dev_test
  ```
  Реальные `.env.local` значения **не коммитятся** (hook `protect-secrets`).
- [ ] В `site/AGENTS.md` секция «Local admin bootstrap» — 3 шага: `pnpm db:up && pnpm seed:admin && pnpm dev` → открыть `http://localhost:3000/admin` → залогиниться `ADMIN_EMAIL`.
- [ ] README команды seed обновлён в верхнем `README.md` репо (если есть Quick Start) — иначе skip.

### AC-4 · Безопасность
- [ ] Скрипт **не выводит password в stdout/stderr** (только email + status `created` / `exists`).
- [ ] `seed:admin` падает с явной ошибкой если `NODE_ENV === 'production'` без флага `--force` (защита от случайного запуска на prod).

### AC-5 · CI / hooks
- [ ] `pnpm seed:admin` запускается без ошибок в окружении `pnpm db:up && pnpm seed:admin` без других сервисов (Telegram / SMTP не нужны).
- [ ] Скрипт **не зависит** от seed-данных контента (Services / Districts / Cases) — может выполняться до и после `pnpm seed`.

## Scope IN

### Файлы

| Файл | Действие | Что |
|---|---|---|
| `site/scripts/seed-admin.ts` | **NEW** | основной скрипт, `getPayload({ config }) → payload.create({ collection: 'users', data: {...} })` с try/catch на duplicate email |
| `site/package.json` | **EDIT** | добавить `"seed:admin": "tsx --env-file=.env.local scripts/seed-admin.ts"` (по аналогии с `seed`) |
| `site/.env.example` | **EDIT** | добавить 4 переменные с дефолтами для local |
| `site/AGENTS.md` | **EDIT** | секция «Local admin bootstrap» в начале (после сборки), 3-step quickstart |

### Алгоритм скрипта (≈40 строк)

```ts
// site/scripts/seed-admin.ts
import { getPayload } from 'payload'
import config from '../payload.config'

async function ensureUser(payload, email: string, password: string, label: string) {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.docs.length > 0) {
    console.log(`[seed:admin] ${label} already exists (${email}), skipping`)
    return
  }
  await payload.create({ collection: 'users', data: { email, password, role: 'admin' } })
  console.log(`[seed:admin] ${label} created (${email})`)
}

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
    console.error('[seed:admin] refusing to run in NODE_ENV=production without --force')
    process.exit(1)
  }
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) {
    console.error('[seed:admin] missing ADMIN_EMAIL or ADMIN_PASSWORD in env')
    process.exit(1)
  }
  const testEmail = process.env.TEST_USER_EMAIL
  const testPassword = process.env.TEST_USER_PASSWORD
  if (testEmail && testEmail === adminEmail) {
    console.error('[seed:admin] TEST_USER_EMAIL must differ from ADMIN_EMAIL')
    process.exit(1)
  }
  const payload = await getPayload({ config })
  await ensureUser(payload, adminEmail, adminPassword, 'admin')
  if (testEmail && testPassword) {
    await ensureUser(payload, testEmail, testPassword, 'test-user')
  }
  process.exit(0)
}

main().catch((e) => { console.error('[seed:admin] failed:', e); process.exit(1) })
```

## Scope OUT

- НЕ создаём пользователей с другими `role` (manager / seo / content) — отдельная задача под cw / poseo если потребуется.
- НЕ трогаем `Users` collection schema — берём как есть.
- НЕ заводим API key — оператор создаст вручную через `/admin` после первого логина (или отдельная задача).
- НЕ автоматизируем `seed:admin` в CI — это runtime для local + manual для leadqa, не часть `pnpm test`.

## Verification (popanel local-verify ДО merge)

```bash
# 1. Чистый старт
docker compose -f site/docker-compose.yml down -v
pnpm --dir site db:up

# 2. Seed admin
pnpm --dir site seed:admin
# Expected: [seed:admin] admin created (admin@obikhod.local)
#           [seed:admin] test-user created (test@obikhod.local)

# 3. Idempotency
pnpm --dir site seed:admin
# Expected: [seed:admin] admin already exists (admin@obikhod.local), skipping
#           [seed:admin] test-user already exists (test@obikhod.local), skipping

# 4. Dev server + browser smoke
pnpm --dir site dev &
# Open http://localhost:3000/admin → залогиниться admin@obikhod.local / obikhod_dev_admin
# Expected: попадаем в /admin dashboard, НЕ редирект на /admin/create-first-user

# 5. Negative case (missing env)
ADMIN_EMAIL= pnpm --dir site seed:admin
# Expected: exit 1 + "[seed:admin] missing ADMIN_EMAIL or ADMIN_PASSWORD in env"
```

Browser screenshot обязателен → `screen/seed-admin-login-success.png`.

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-04-29 | popanel | sa-panel | Запрос на спеку (1 час до этого: оператор спросил «есть ли seed user?», popanel рекомендовал A — мини-спека + dev) |
| 2026-04-29 | sa-panel | popanel | Спека готова, AC сформулированы |
| 2026-04-29 | popanel | be-panel | **APPROVED** — реализация (`feature/seed-admin-local` ветка), оператор апрувнул scope «конечно A, как вы тестить то будете» |
| 2026-04-29 | be-panel | popanel | Code DONE (4 файла), `pnpm type-check` зелёный, не коммичено — попроси popanel прогнать local-verify |
| 2026-04-29 | popanel | tamd + do | **BLOCKED** при local-verify: `pnpm seed:admin` падает на `@next/env` CJS-default destructure в `payload/dist/bin/loadEnv.js`. Тот же баг ломает `pnpm seed`. Открыт intake [COMMON-SCRIPTS-RUNTIME-FIX](../TASK-COMMON-SCRIPTS-RUNTIME-FIX/intake.md) (P0). Merge запрещён до фикса. UI `/admin/login` рендерится корректно (Wave 1 custom.scss работает) — `screen/seed-admin-login-renders.png`. |
| 2026-04-29 | tamd | popanel | **ADR-0009 принят** — path G (CJS preload shim `scripts/_payload-cjs-shim.cjs`, 13 строк). 5 scripts получили `tsx --require=./scripts/_payload-cjs-shim.cjs` префикс. Runtime-verify прошёл: `pnpm seed:admin` создал admin + test-user, повторный запуск skipping, `pnpm seed` тоже стартует (отдельный pre-existing issue с metaDescription у chistka-krysh — не блокер). |
| 2026-04-29 | popanel | cr-panel | **Local-verify ALL GREEN** — AC-1.1 idempotency `skipping` ✅, AC-1.3 negative case exit 1 ✅, browser smoke admin@obikhod.local залогинился в /admin dashboard ✅ (`screen/seed-admin-login-success.png`), do-checks (type-check 0 errors, lint 0 errors, format OK) ✅. Передаю на cr-panel review. |

## Definition of Done

- [ ] AC-1, AC-2, AC-3, AC-4, AC-5 — все зелёные
- [ ] popanel local-verify прошёл, screenshot в `screen/seed-admin-login-success.png`
- [ ] `do` локально: `pnpm --dir site type-check && pnpm --dir site lint && pnpm --dir site format:check` — зелёные
- [ ] cr-panel review (один раунд)
- [ ] PR `feature/seed-admin-local` → `panel/integration` → `main` (squash merge, conventional commit `feat(panel): add seed-admin script for local dev`)
- [ ] memory `project_cicd_backlog.md` — пункт «seed данных» вычёркивается
- [ ] handoff в `.claude/memory/handoff.md` обновлён
