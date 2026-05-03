# ADR-0016: Стратегия применения схемы и миграций на prod (sustained)

**Дата:** 2026-05-03
**Статус:** Proposed (operator approves later)
**Автор:** do + dba (cpo extended mandate W15 day 2)
**Контекст US:** EPIC-SEO-CONTENT-FILL Stage 4 prod-seed (PR #136 → #149, 10 неудачных попыток)
**Supersedes (частично):** sustained do.md §10 «Payload migrations TODO» (открыт с 2026-04-21)

## Контекст

Production-БД на Beget VPS (`45.153.190.107`) к моменту записи ADR — пустая
(0 records в Services/Districts/SD/Cases) или в drift-state после 10 попыток
seed-prod (PR #136 → #149). За последние 6 часов:

- 5-я попытка: `created=1/errors=13` → partial schema apply.
- 6-я: подтверждённый schema drift между local push:true и prod migrations.
- 9-я (PR #148): добавлен **bootstrap detection** в `deploy.yml` — workaround,
  не sustainable solution.
- 10-я (`seed-prod.yml` W15 P1): **DROP SCHEMA public CASCADE + recreate**
  через destructive op + ad-hoc raw SQL dump (542 KB
  `00000000_000000_initial_schema_bootstrap.sql`, generated через
  `pg_dump --schema-only` из dev/CI Postgres где `push:true`).

### Root cause analysis (architecture level)

1. **Payload binary `payload migrate` не работает на проде.**
   - Симптом: `getTSConfigPaths null` при попытке `pnpm payload migrate`.
   - Причина: prod node_modules собран `--prod --frozen-lockfile` →
     devDependencies (включая `tsx`) выкинуты. `payload` CLI ожидает
     tsx-loader для transpile `payload.config.ts`. Без tsx падает на
     resolve TS path aliases (`@/lib/*` через tsconfig paths).
   - Workaround в seed-prod.yml: `pnpm dlx tsx --require=$SHIM` — bypass
     Payload CLI entirely, но это про user-скрипты, не migrations.

2. **19 *.up.sql миграций не применяются чисто на пустую БД.**
   - Каждая миграция — diff против предыдущего state (Payload-generated
     `migrate:create` производит partial DDL: только delta).
   - Применять последовательно `psql -f` на пустую БД даёт `CREATE TYPE
     conflicts` и FK-references на ещё-не-созданные таблицы — миграция #N
     ожидает schema state после миграций #1..#N-1, но первой миграции,
     которая создаёт baseline, **не существует**.
   - Bootstrap snapshot (`00000000_*` raw dump) был добавлен как
     pseudo-migration zero, но не отслеживается Payload как миграция —
     отсюда workaround в `deploy.yml:435-442` (bootstrap detection: если
     `services_blocks_hero` существует && `payload_migrations` пуста →
     mark all *.up.sql as applied).

3. **`push:true` создаёт schema, который не matches prod-migration-applied
   state.**
   - `payload.config.ts:176`: `push: NODE_ENV !== 'production' &&
     PAYLOAD_DISABLE_PUSH !== '1'`.
   - Local/CI: `push:true` синхронизирует schema по Payload collections at
     runtime — это **drizzle-kit push** под капотом, без миграционного файла.
   - Prod: `push:false` — только raw SQL apply через deploy.yml.
   - Drift-источник: в local `push:true` молча добавляет колонку через
     drizzle introspect; в prod нет соответствующего *.up.sql → колонка
     отсутствует. Каждый `pg_dump --schema-only` из CI выдаёт snapshot
     **текущего push-state**, который может расходиться с суммой
     `00000000_bootstrap.sql + 1..N *.up.sql`.

**Триада блокеров взаимно усиливает друг друга:** Payload CLI сломан → не
можем generate diff migrations канонично → пишем ad-hoc *.up.sql вручную или
полагаемся на push:true → drift → bootstrap workaround → drift растёт.

## Решение

### Выбранная опция: **B (Pure raw SQL workflow) с упрощениями**

Отказываемся от `payload migrate` binary полностью на prod. **Bootstrap
schema dump становится first-class citizen**, *.up.sql миграции пишутся
вручную и применяются последовательно через psql. Local dev продолжает
использовать `push:true` для скорости; **prod-bootstrap snapshot
регенерируется по требованию (а не автоматически)** через явный CI step.

### Конкретный flow

1. **Schema source of truth = `migrations/00000000_initial_schema_bootstrap.sql`**
   (raw SQL dump, 542 KB, regenerable из CI Postgres где push:true применил
   текущие collections).
2. **Diff migrations** (`*.up.sql`) пишутся вручную dba перед merge PR со
   schema changes. Payload `migrate:create` **не используется** (binary
   broken). dba опирается на diff: `pg_dump --schema-only` до изменения vs
   после изменения collection field.
3. **Apply pipeline (deploy.yml):**
   - Idempotent: `payload_migrations` tracker таблица.
   - Если БД пустая (0 user-tables) → apply bootstrap.sql → mark all *.up.sql
     before bootstrap timestamp as applied (bootstrap = checkpoint).
   - Apply каждый *.up.sql после bootstrap timestamp в lexicographic order,
     skip если в tracker.
4. **Bootstrap regeneration script (новый):**
   `site/scripts/regen-bootstrap.ts` — runs in CI matrix, `push:true` против
   ephemeral Postgres, `pg_dump --schema-only` → пишет в
   `migrations/00000000_<timestamp>_initial_schema_bootstrap.sql`.
   Запускается dba **по необходимости** (после крупных collection refactor),
   commit вручную в PR с обоснованием.
5. **Seed-prod становится тривиальным:**
   - Schema уже на месте после deploy (применилась в `deploy.yml`).
   - `seed-prod.yml` запускает только user-scripts через
     `pnpm dlx tsx --require=$SHIM` — без DROP SCHEMA, без bootstrap.sql apply.
   - Idempotency — на уровне seed-script (sustained ADR-0001).

### Обоснование (tradeoffs)

| Критерий | Option A (proper migrate) | **Option B (raw SQL) ✓** | Option C (hybrid push) |
|---|---|---|---|
| Developer ergonomics | High если binary починят, Low пока сломан | Medium (manual diff *.up.sql) | High в local, fragile в prod |
| Risk | Medium-High (упрямый binary; неясно сколько фиксов tsx-shim) | Low (psql — battle-tested) | High (drift накапливается) |
| Time-to-deploy fix | 4-8h (bisect tsx shim, payload CLI internals, audit Payload upstream issues) | **2-3h (cleanup workflow + script)** | 1h (document workaround) — но техдолг растёт |
| Sustainability | Зависит от upstream (Payload + tsx) | **Self-contained** | Permanent workaround |
| Audit trail | Built-in через payload tracker | Custom через payload_migrations table (та же таблица) | Bootstrap detection маскирует drift |

**Решающий фактор:** Option A требует депенденс на upstream-фиксы Payload
binary + tsx ESM/CJS interop (ADR-0009). У нас уже sustained shim для
user-scripts (`_payload-cjs-shim.cjs`) — расширять его на migrate binary
рискованно (Payload CLI lifecycle ≠ user-script lifecycle, может ломаться
непредсказуемо). Option B принимает существующий рабочий путь (psql + raw
SQL) и **сужает** его до контролируемого: bootstrap regen — explicit,
*.up.sql — code-reviewed.

## Implementation plan

### Phase 1 — quick stabilization (2-3h, do + dba)

**Файлы:**
- `.github/workflows/deploy.yml` — упрощение apply step:
  - Detect empty DB (`COUNT(pg_tables WHERE schemaname='public')` = 0)
  - If empty: apply `00000000_*_initial_schema_bootstrap.sql` first → mark
    all *.up.sql with timestamp ≤ bootstrap as applied.
  - Apply *.up.sql with timestamp > bootstrap in order, skip-if-tracked.
  - **Удалить** sustained workaround «Bootstrap detection» (lines 432-442
    в текущем deploy.yml) — заменить на explicit empty-DB detection.
- `.github/workflows/seed-prod.yml` — упрощение:
  - **Удалить** «Apply schema (DROP + recreate, force-clean)» step
    (lines 121-158) — destructive op больше не нужен.
  - Schema apply делает deploy.yml. seed-prod.yml только запускает
    user-scripts (Stage 0/1/2/3 seed sequence) через
    `pnpm dlx tsx --require=$SHIM`.
- `team/common/dba.md` — добавить раздел «Manual diff *.up.sql workflow»:
  процедура для dba при schema changes (pg_dump до/после, generate diff,
  review в PR).
- `team/common/do.md §10` — пометить «Payload migrations TODO» как
  superseded by ADR-0016, обновить §10 пунктом про raw SQL pipeline.

**Verify commands:**
```bash
# В CI на каждом PR:
pnpm install --frozen-lockfile
pnpm db:up                                # Docker Postgres
PAYLOAD_DISABLE_PUSH=1 psql $DATABASE_URI -f site/migrations/00000000_*.sql
for f in site/migrations/*.up.sql; do
  psql $DATABASE_URI -v ON_ERROR_STOP=1 -f "$f"
done
# expected: zero errors, 233+ tables, payload_migrations пустая
# (т.к. tracker заполняется только в deploy.yml apply step)

# Smoke на prod после deploy:
curl -fsS https://obikhod.ru/api/health?deep=1 | jq .
ssh deploy@45.153.190.107 'psql $DATABASE_URI -c "SELECT count(*) FROM payload_migrations"'
# expected: 19+ rows (все *.up.sql applied)
ssh deploy@45.153.190.107 'psql $DATABASE_URI -c "SELECT count(*) FROM services"'
# expected: 4 (после seed)
```

**Acceptance:**
- 11-я попытка seed-prod с new pipeline: HTTP 200 на 211 URL.
- `pnpm dlx tsx scripts/seed-content-stage3.ts` завершается без errors на
  чистой VPS-БД (после empty-DB bootstrap).
- `payload_migrations` table содержит 19+ entries (все sustained *.up.sql).
- Local dev workflow не сломан: `pnpm db:up && pnpm dev` поднимает push:true
  без manual SQL.

### Phase 2 — bootstrap regen automation (3-4h, do)

**Файл:** `site/scripts/regen-bootstrap.ts` — новый script:

```typescript
// Pseudo-flow:
// 1. spawn ephemeral Docker Postgres
// 2. PAYLOAD_DISABLE_PUSH=0 NODE_ENV=development pnpm dev (briefly)
// 3. wait for push:true to apply
// 4. pg_dump --schema-only > migrations/00000000_<timestamp>_bootstrap.sql
// 5. mv старый bootstrap.sql в migrations/archive/
// 6. echo «Run: git add site/migrations/00000000_*.sql && git commit»
```

CI step `.github/workflows/regen-bootstrap.yml` (workflow_dispatch, manual
trigger by dba): runs script, opens PR with new bootstrap.sql.

**Acceptance:**
- dba может regenerate bootstrap one-command: `pnpm regen:bootstrap`.
- Diff на bootstrap visible в PR review (no surprise schema changes).

### Phase 3 — sustained ADR-update (1h, tamd + dba)

- ADR-0016 status: Proposed → Accepted (после operator approve).
- Update do.md §10: pointer на ADR-0016, remove «Payload migrations TODO».
- Update dba.md: добавить «Manual diff workflow» как formal раздел.
- Update CLAUDE.md tech-stack note: «Migrations: raw SQL via deploy.yml,
  bootstrap regen via dba script (no Payload CLI on prod)».

**Estimated total: 6-8 working hours** (Phase 1 — 2-3h critical path, Phase 2
+ 3 — следующий sprint).

## ADR path

`team/adr/ADR-0016-payload-migrations-prod-strategy.md` (this file)

## Альтернативы (rejected)

### Option A — Proper Payload migrate workflow

- Подход: fix tsx + Payload binary через расширенный shim, на prod
  использовать `pnpm payload migrate`.
- Pros: каноничный путь, audit trail встроен в Payload.
- Cons:
  - Payload CLI bug `getTSConfigPaths null` — root cause в Payload
    internals + tsx ESM/CJS interop (см. ADR-0009).
  - Не latest version имеет fix (Payload 3.84.1 latest на момент решения,
    bug uncloseable).
  - Расширять `_payload-cjs-shim.cjs` на CLI lifecycle — high risk: shim
    тестирован для user-scripts (`scripts/seed.ts`), не для CLI internal
    (`payload migrate` запускает Drizzle introspect + другие peer-deps).
  - Time-to-deploy: 4-8h debugging upstream + неясный probability of fix.
- **Вердикт:** rejected. Sustainable только когда Payload upstream fix
  landed; пересмотреть в follow-up ADR через 2-3 месяца.

### Option C — Hybrid push:true → snapshot → apply (W15 текущий, sustain workaround)

- Подход: оставить bootstrap detection в deploy.yml как «proper sustained
  pattern», документировать.
- Pros: zero changes, всё уже работает.
- Cons:
  - **Drift накапливается**: каждый раз когда local push:true вводит изменение,
    которое не попало в *.up.sql, prod расходится с local. Маскируется
    bootstrap detection — но при следующем seed-attempt drift проявляется
    (history на 10 попытках).
  - Bootstrap snapshot file (542 KB) живёт в git — каждый refresh = крупный
    diff в PR, code review по нему невозможен.
  - 7-я итерация семантики «sustainable» через 6 fix-up attempts. Operator
    iron rule «sustained ≠ workaround» — этот path фактически нарушает.
- **Вердикт:** rejected. Текущий путь — это и есть W15 sustain pattern,
  но он привёл к 10 попыткам. Закрепить его как «proper» = legitimize debt.

## Последствия

### Положительные

- **Single source of truth для schema:** `00000000_*_bootstrap.sql` +
  `*.up.sql` ≡ полное состояние prod-БД. Bootstrap regenerable из CI, не
  ручной артефакт.
- **Audit trail сохранён:** `payload_migrations` table tracker остаётся,
  каждая *.up.sql применена один раз (idempotent). История миграций
  читаема через `SELECT name FROM payload_migrations ORDER BY id`.
- **Зависимость от Payload binary удалена:** prod deploy не требует
  `payload migrate` или tsx-shim для CLI. Только psql — battle-tested
  Postgres tooling.
- **Drift detection становится естественной:** при regen bootstrap diff
  виден в PR; если diff > expected (т.е. push:true ввёл изменение, которое
  не было в *.up.sql), dba ловит на review до prod.
- **Local dev workflow не меняется:** push:true работает, как работало.

### Отрицательные / risks

- **Manual diff *.up.sql writing — burden на dba.** dba должен делать
  pg_dump до/после schema change и diff вручную. Mitigation: документ в
  dba.md, скрипт-помощник `scripts/diff-schema.ts` (Phase 2 backlog).
- **Bootstrap regen — manual trigger.** Если dba забыл regen после крупного
  refactor, новый push:true может вылезти drift. Mitigation: CI lint
  «schema-drift-check» в Phase 3 — проверяет hash(push:true result) vs
  hash(bootstrap + *.up.sql); fail PR при mismatch.
- **Один раз нужен «cold start» перенос с текущего prod.** 11-я попытка
  seed: prod-DB сейчас в drift-state после 10 попыток. Phase 1 deploy
  потребует одного финального DROP SCHEMA + apply bootstrap — но
  только один раз, не sustained pattern.
- **Bootstrap snapshot file (542 KB в git).** Не идеально для git history.
  Mitigation: archive старых bootstraps в `migrations/archive/` (gitignored
  через сжатие? или git-lfs если станет проблемой) — Phase 2 backlog.

## Quick win — recommendation для текущего Track A (10th seed retry)

**Если 10-я попытка (`seed-prod.yml` PR #149 с DROP SCHEMA + recreate)
проходит зелёной → 211 URL на проде → DONE для Stage 4.** Этот путь
**уже использует логику Option B (raw SQL bootstrap apply)** — фактически
эта попытка является de-facto implementation Phase 1 minus cleanup. Не
вмешиваться, **дать workflow run завершиться**.

**Если 10-я попытка падает (errors > 0 или count < 211):**

Самый быстрый path к 211 URL — **manual SSH apply** (НЕ через CI workflow):

```bash
ssh deploy@45.153.190.107
cd /home/deploy/obikhod/current
set -a; . ./.env; set +a
export OBIKHOD_SEED_CONFIRM=yes OBIKHOD_ENV=production PAYLOAD_DISABLE_PUSH=1

# Step 1: clean DB (последний раз manual; после Phase 1 implementation
# это делается one-shot через explicit do command, не sustained pattern)
psql "$DATABASE_URI" -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'

# Step 2: apply bootstrap (current 542 KB snapshot)
psql "$DATABASE_URI" -f migrations/00000000_000000_initial_schema_bootstrap.sql

# Step 3: mark *.up.sql as applied (skip — schema уже включает их)
for f in migrations/*.up.sql; do
  name=$(basename "$f" .up.sql)
  psql "$DATABASE_URI" -c "INSERT INTO payload_migrations (name, batch) SELECT '$name', 1 WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name='$name')"
done

# Step 4: run seed sequence (sustained ADR-0001 + Stage 1/2/3 scripts)
SHIM='./scripts/_payload-cjs-shim.cjs'
pnpm dlx tsx --require=$SHIM scripts/seed.ts
pnpm dlx tsx --require=$SHIM scripts/seed-authors.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-etalons.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-stage1.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-stage2.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-stage3.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-stage3-blog.ts
pnpm dlx tsx --require=$SHIM scripts/seed-content-stage3-cases.ts
pnpm dlx tsx --require=$SHIM scripts/post-bind-mini-case.ts || true

# Verify
curl -sS https://obikhod.ru/sitemap.xml | grep -c '<loc>'  # expected: 211+
psql "$DATABASE_URI" -c 'SELECT count(*) FROM service_districts'  # expected: ~125
```

**Это manual ad-hoc bypass.** После него — Phase 1 cleanup workflow files
делает paths чистым на следующий deploy.

## Risk assessment

Что может пойти не так после Phase 1 implementation:

1. **Empty-DB detection misfires.** Если seed-prod запущен на DB с
   user-данными (после live editing через /admin), новая логика «empty?» →
   apply bootstrap может сработать неверно. **Mitigation:** detection по
   количеству **system tables** (не user-data rows): `COUNT pg_tables WHERE
   schemaname='public' AND tablename NOT LIKE 'pg_%'`. Если 0 → empty,
   если > 0 → skip bootstrap. Sustained guard.

2. **Race condition между deploy.yml и seed-prod.yml.** Если operator
   запустит оба параллельно, deploy применяет migrations пока seed уже
   читает schema. **Mitigation:** GitHub Actions concurrency группа
   `deploy-beget` уже sustained в deploy.yml; добавить в seed-prod.yml
   тот же `concurrency.group: deploy-beget` — workflows будут queue.

3. **Bootstrap snapshot stale.** Если dba забыл regen после crucial
   collection change, prod drift вернётся. **Mitigation:** Phase 3 lint —
   CI step проверяет hash mismatch. До Phase 3 — manual reminder в
   dba.md DoD: «после schema change всегда regen bootstrap».

4. **Manual diff *.up.sql ошибки.** dba может пропустить колонку или
   написать неправильный default. **Mitigation:** PR review by tamd; smoke
   test на staging Postgres (Docker `pnpm db:up`) перед merge.

5. **Bootstrap file growing.** Сейчас 542 KB; через 6 месяцев может быть
   1+ MB. Не блокер для git, но diff неудобен. **Mitigation:** archive
   старых bootstraps в `migrations/archive/` (Phase 2).

**Самый большой риск:** Phase 1 не закроет EPIC-SEO-CONTENT-FILL Stage 4
если operator одобрит ADR на следующий день, а seed-prod нужен **сейчас**
для 211 URL launch. **Quick win bypass (см. выше) решает это** — manual
SSH в течение 30 минут даёт production-ready data; Phase 1 cleanup
делается асинхронно.
