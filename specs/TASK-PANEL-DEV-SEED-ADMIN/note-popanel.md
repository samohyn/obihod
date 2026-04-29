---
role: popanel
date: 2026-04-29
session: panel-backlog-rebuild + seed-admin urgency
---

# Записка popanel — PANEL-DEV-SEED-ADMIN approved

## Skill активация (iron rule)

Активирован `api-design` (REST script CLI contracts) — для seed-admin это применимо как к CLI, так и к idempotent ensure-user паттерну.

## Контекст

Оператор задал вопрос «есть ли в Docker создан admin user для локальных тестов?» в сессии rebuild беклога panel.

**Ответ был — нет:**
- `obikhod_postgres` не запущен сейчас.
- `scripts/seed.ts` сеет только контент (Services / Districts / Cases / People).
- В `.env.local` только `OPERATOR_EMAIL`, нет `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- `package.json` не имеет `seed:admin`.
- `firstUserConfig` в Payload не настроен — дефолт `/admin/create-first-user` UI вручную.

**Оператор:** «конечно A, как вы тестить то будете» — апрув на мини-спеку + dev.

## RICE

`Reach=5 (каждый local-verify), Impact=4 (блокирует W2.A smoke + W7 Playwright), Confidence=1.0 (validated by operator + memory CI backlog), Effort=0.3 ЧД`

`Score = (5 × 4 × 1.0) / 0.3 = 66.7`

→ Topmost RICE в panel-беклоге, выше всех Wave-задач US-12. Кладу в `now` **впереди W2.A**.

## Hand-off план

1. **be-panel** — реализация (`feature/seed-admin-local` ветка):
   - `site/scripts/seed-admin.ts` (≈40 строк, idempotent, `getPayload` Local API)
   - `site/package.json` (script entry)
   - `site/.env.example` (4 переменные с placeholder-дефолтами)
   - `site/AGENTS.md` (секция «Local admin bootstrap», 3-step quickstart)
2. **popanel** — local-verify ДО merge (`pnpm db:up && pnpm seed:admin && pnpm dev` + браузер) + screenshot в `screen/seed-admin-login-success.png`.
3. **do** — type-check + lint + format:check локально ДО push.
4. **cr-panel** — review (один раунд, malый surface).
5. **release** + **leadqa** — НЕ требуются (это dev-infra, не user-facing feature; pure dev tooling).
6. **PR** — squash merge в `panel/integration` → `main`.

## Что закрывается этой задачей

- ✅ Iron rule «leadqa real browser smoke ДО push» — теперь есть воспроизводимый admin user.
- ✅ Iron rule «PO local verification ДО merge» (memory `feedback_po_iron_rule_local_verify_and_cross_agents`) — pre-condition разблокирован.
- ✅ US-12 Wave 2.A Login UI smoke — есть с кем тестить email+password flow.
- ✅ US-12 Wave 7 Playwright — есть `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` для fixtures.
- ✅ Memory `project_cicd_backlog.md` — пункт «seed данных» вычёркивается частично (admin user — да, контент-seed уже есть в `seed.ts`).

## Open risks

- **Production safeguard:** скрипт не должен случайно запуститься на prod. Mitigation: `NODE_ENV === 'production'` без `--force` → exit 1 (AC-4).
- **TEST_USER коллизия:** если `TEST_USER_EMAIL === ADMIN_EMAIL` → второй create будет падать на unique violation. Mitigation: assert на старте (AC-2).
- **Password в `.env.example`:** placeholder только для local (`obikhod_dev_admin`), не реальный prod. Hook `protect-secrets` блокирует коммит реальных `.env.local`.

## Следующая сессия (popanel)

После закрытия PANEL-DEV-SEED-ADMIN — старт US-12 Wave 2.A dev (be-panel + fe-panel) на готовом seed-юзере.

---

## Closure log 2026-04-29

**Кто разблокировал:** tamd через ADR-0009 (path G — single-file CJS shim, 13 строк, патчит `@next/env` default-import от пути payload-узла). Не выбран ни один из 6 путей в intake — tamd нашёл лучший седьмой.

**Какие AC закрыты (financial-final, popanel local-verify 2026-04-29):**

- ✅ **AC-1.1** Idempotent admin bootstrap — `pnpm seed:admin` дважды: первый раз `created`, второй `skipping`. Прогон при существующих юзерах подтвердил skipping path.
- ✅ **AC-1.2** Test user — `test@obikhod.local` создан (`role: admin`, отдельный от ADMIN_EMAIL).
- ✅ **AC-1.3** Negative case — `ADMIN_EMAIL= pnpm seed:admin` → exit 1 + `[seed:admin] missing ADMIN_EMAIL or ADMIN_PASSWORD in env`.
- ✅ **AC-2** TEST_USER коллизия — assert на коллизию `TEST_USER_EMAIL === ADMIN_EMAIL` присутствует в коде, не триггерится в реальном кейсе (разные email).
- ✅ **AC-3** `.env.example` + AGENTS.md — 4 переменные с placeholder-дефолтами + секция «Local admin bootstrap» + ссылка на ADR-0009 для shim.
- ✅ **AC-4** Безопасность — password не выводится в stdout/stderr (только email + status); production без `--force` → exit 1 (код-уровень).
- ✅ **AC-5** CI / hooks — скрипт работает без Telegram/SMTP, не зависит от контент-seed; type-check + lint + format:check зелёные.

**Browser smoke:**
- `admin@obikhod.local` / `obikhod_dev_admin` → /admin dashboard рендерится корректно (Wave 1 custom.scss design intact).
- Скриншот: `screen/seed-admin-login-success.png` (~150KB, full-page).

**do iron rule pre-merge:**
- `pnpm type-check` — 0 errors.
- `pnpm lint` — 0 errors, 82 pre-existing warnings (не от наших правок, tamd подтвердил).
- `pnpm format:check` — All matched files use Prettier code style.

**Что закрывается этой задачей (final):**
- ✅ Iron rule «leadqa real browser smoke ДО push» — есть воспроизводимый admin user.
- ✅ Iron rule «PO local verification ДО merge» — popanel прогнал, screenshot есть.
- ✅ US-12 Wave 2.A Login UI smoke — pre-condition разблокирован.
- ✅ US-12 Wave 7 Playwright fixtures — есть `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`.
- ✅ Memory `project_cicd_backlog.md` — пункт «seed данных» закрыт частично (admin user — да; контент-seed работает runtime после shim, но имеет pre-existing issue с metaDescription у chistka-krysh — отдельная задача product).

**Что осталось:** cr-panel review + PR + merge через `do` (или оператор подтвердит локальный merge).
