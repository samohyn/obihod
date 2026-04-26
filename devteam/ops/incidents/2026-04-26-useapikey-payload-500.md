# Incident — useAPIKey: true сломал /api/users/login на проде

**Дата:** 2026-04-26
**Severity:** P0 (admin login down, оператор не может работать в /admin)
**Статус:** **Resolved через revert PR #42**
**Длительность:** ~10 минут (deploy #62 успех в 09:11 UTC → revert PR #42 merge ~09:18 UTC)

---

## TL;DR

PR #41 включил `auth: { useAPIKey: true }` в коллекции `users`. После auto-deploy `/api/users/login/` начал отдавать **HTTP 500** с generic `{"errors":[{"message":"Something went wrong."}]}`. Браузер оператора не мог открыть `/admin/login/`. Revert PR #42 восстановил `auth: true` → admin login заработал.

## Timeline

| UTC | Событие |
|---|---|
| 09:06 | Создан PR #41 (`auth: true` → `auth: { useAPIKey: true }`) |
| ~09:08 | Оператор merged PR #41 |
| 09:11 | deploy #62 success (`uptime=33s`, `db=ok`) |
| ~09:14 | Оператор пытается открыть `/admin/login/` → видит «This page couldn't load. ERROR 1705866672» |
| ~09:15 | `do` curl-проверка: `/api/users/login/` → **500** |
| ~09:16 | Создан revert PR #42, urgent merge запрошен |
| ~09:17 | Оператор merged PR #42 |
| ~09:23 | deploy #63 success → smoke `/api/users/login/` → 401 OK |

## Что упало

- `POST /api/users/login/` → 500 `{"errors":[{"message":"Something went wrong."}]}`
- `/admin/login/` SPA → JS падал на login API → "server error" в браузере
- Любой auth flow для коллекции `users` (которая теперь имеет `auth.useAPIKey: true`)

## Что НЕ упало

- `/` (home) → 200
- `/vyvoz-musora/`, `/arboristika/`, `/demontazh/` → 200 (pillar, OBI-16 fix живой)
- `/api/health?deep=1` → ok (Postgres ping проходит)
- `/api/services?depth=0` → 200 (REST для других коллекций работает)

## Root cause (гипотеза)

Payload 3.83 с `auth: { useAPIKey: true }` ожидает 3 дополнительных поля в schema у коллекции users:

- `apiKey` (text, hidden)
- `apiKeyIndex` (text, hidden, indexed)
- `enableAPIKey` (checkbox)

Текущий paradigm проекта — `push: true` в `payload.config.ts` (Payload автоматически синхронизирует schema на старте). На фазе deploy build-time `pnpm build` не запускает Payload init, поэтому schema-push происходит только при первом запросе на runtime после PM2 restart.

**Что предположительно произошло:**
1. Bundle развернут с новым кодом `auth: { useAPIKey: true }`
2. PM2 рестартован, Next.js + Payload стартуют
3. При первом обращении к коллекции `users` (login flow) Payload пытается прочитать запись юзера со схемой включающей `apiKeyIndex`
4. Drizzle SQL генерится с новой колонкой
5. **БД не имеет этих колонок** — schema push либо не выполнился (race condition?), либо упал тихо
6. Result → `{"errors":[{"message":"Something went wrong."}]}` (Payload скрывает SQL error для security)

**Не подтверждено** — точный SQL error виден только в PM2 logs на VPS, доступа SSH у `do` нет.

## Что сделано для recovery

1. Curl-диагностика: подтвердил 500 на `/api/users/login/`, остальные endpoints живые
2. Revert PR #42: `git revert 1e38ce3` → `auth: true` обратно
3. Auto-deploy #63 через push в main после merge revert
4. Smoke `/api/users/login/` → 401 (правильный auth-fail для wrong creds, не 500)

## Уроки

1. **`push: true` на prod Payload — анти-паттерн для изменений auth/users.** Любое изменение `auth: ...` config нужно делать **только** через явную миграцию (`pnpm payload migrate:create` + commit + apply на deploy). Безопаснее и предсказуемее. Это часть тех.долга по «Payload migrations» (см. [do.md §10](../../do.md#10-follow-ups-техдолг)).
2. **Тестировать auth flow в CI до merge.** `/api/users/login/` должен быть в smoke-тестах CI/CD до auto-deploy. Сейчас `ci.yml` Playwright не покрывает API auth.
3. **Lighthouse / smoke-проверка после deploy** должна включать `POST /api/users/login/` с заведомо неправильными credentials → ожидаем 401, **не 500**. Если 500 — auto-rollback через `deploy/rollback.sh`.
4. **Generic Payload errors («Something went wrong») скрывают root cause.** Нужен mechanism чтобы видеть полный SQL error в development/staging логах. На prod это правильно security-wise, но без SSH к PM2 logs disagnose невозможен.

## Followups

- [ ] **OBI-XX:** Покрыть smoke-тестами `/api/users/login/` в `ci.yml` и `deploy.yml` — auto-rollback при 500 на этом endpoint
- [ ] **OBI-XX:** ADR-0005 на Payload migrations — переезд с `push: true` на explicit migrations для prod
- [ ] **OBI-17 (cms-agent) → второй заход на API key**: написать explicit migration для добавления apiKey/apiKeyIndex/enableAPIKey полей перед `auth: { useAPIKey: true }`. До этого OBI-17 НЕ мерджить.
- [ ] **OBI-XX:** Подключить SSH-доступ для `do` (через workflow или sealed-secret) чтобы читать PM2 logs при инцидентах. Сейчас MTTR ограничен curl-уровнем диагностики.

## Подтверждение восстановления

- [x] `POST /api/users/login/` → 401 (smoke в deploy #63 после revert)
- [x] `/admin/login/` открывается в браузере без ошибки
- [x] Pillar страницы (`/vyvoz-musora/` и т.д.) → 200 (не пострадали)

## Ответственность

**`do` (incident lead, root cause):** написал `feat: auth.useAPIKey: true` без explicit migration, не учёл `push: true` race condition на prod. Не запустил smoke-тест `/api/users/login/` в фоне после deploy #62 — обнаружил инцидент только когда оператор сообщил.

**Митигация:** добавить smoke `/api/users/login/` в `deploy.yml` после health-check, fail deploy if not 200/401.
