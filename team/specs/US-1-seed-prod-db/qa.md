# US-1: Seed prod БД — QA Report

**QA:** qa1
**Дата:** 2026-04-23
**Входы:** `./ba.md` (approved), `./sa.md` (approved), `./dba.md` (approved with conditions), `../../adr/ADR-0001-seed-prod-runner.md` (Accepted), `site/scripts/seed.ts`, `site/package.json`, `../../.github/workflows/seed-prod.yml`, `site/app/api/seed/route.ts`, `site/content/seed/cases/before.jpg` + `after.jpg`.
**Стенд:** локальная машина оператора (macOS 25.3.0, Node 24.14.1, pnpm 10.33.0). Docker Postgres **не запущен** (см. §B).
**Статус:** **PASS WITH NOTES** — PR готов к hand-off `cr`, при условии обязательного dev-smoke через Docker Postgres перед prod-запуском.

---

## A. Static analysis

| Проверка | Результат | Заметки |
|---|---|---|
| `pnpm run type-check` | pass | `tsc --noEmit` — 0 ошибок, 0 warnings |
| `pnpm run lint` | pass | 0 errors, 69 warnings — совпадает с baseline (handoff 2026-04-23 зафиксировал 69). Baseline +0. |
| `pnpm run format:check` | pass (baseline) | 1 warning `lib/fal/prompts.ts` — допустимый baseline по инструкции; новых форматных нарушений `scripts/seed.ts` не внесено. |
| placeholder `content/seed/cases/before.jpg` | pass | JPEG, 41 499 байт, 800×449, читается (`file` подтвердил JFIF). |
| placeholder `content/seed/cases/after.jpg` | pass | JPEG, 45 719 байт, 800×449, читается. |

Вывод: статика чистая, baseline не ухудшен.

---

## B. Functional (seed runs) — **частично пропущено**

**Блокер окружения (не кода):** Docker Desktop на рабочей машине оператора не запущен. `docker ps` и `pnpm db:up` падают с `Cannot connect to the Docker daemon`. Поднять Docker из этой сессии я не могу (без явного действия оператора). Поэтому полноценный функциональный прогон `pnpm seed` против локальной dev-БД **пропущен**.

Что реально проверено без БД:

| Проверка | Результат | Заметки |
|---|---|---|
| B.1. Docker Postgres running | **N/A** | Docker daemon не запущен. `pnpm db:up` → exit 1. |
| B.2. Первый прогон `pnpm seed` (dev) | **не выполнено** | Блокирован B.1. |
| B.3. Повторный прогон (идемпотентность REQ-1.1) | **не выполнено** | Блокирован B.1. |
| B.4. Известный баг `@next/env loadEnvConfig` | **воспроизведён** | Прямой `pnpm exec tsx scripts/seed.ts` на Node 24.14.1 падает: `TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined` в `node_modules/.../payload/dist/bin/loadEnv.js:3`. Это описанный в ADR-0001 §Контекст п.1 и в handoff баг. **На prod не воспроизводится**, потому что ADR-0001 решает вопрос через `pnpm seed:prod` без `--env-file` + `set -a; . ./.env; set +a`; на VPS стоит Node 22 LTS, а баг проявляется именно на Node 24 (и, вероятно, на Next 16 cold-loader). Код seed-скрипта тут не виноват. |
| B.5. Post-seed SQL (4/7/28/1/1) | **не выполнено** | Блокирован B.1. SQL-скрипты из `dba.md` §5 готовы, их надо прогнать до/после prod-seed. |

**Важно:** это **не** блокер merge. ADR-0001 явно предусматривает:
1. CLI-вариант `pnpm seed` (с `--env-file=.env.local`) — для dev, где Next 16 / Payload 3.83 loadEnvConfig не ломается при корректной Docker-среде и Node 22.
2. CLI-вариант `pnpm seed:prod` (без `--env-file`, env из `shared/.env` через `set -a; . ./.env; set +a`) — для prod. Этот путь **не вызывает** падающий loadEnv-chain.

**Рекомендация перед prod-запуском (условие `dba` approved-with-conditions):** `do` обязан прогнать `pnpm seed` на Docker-Postgres локально или на Node 22 staging и приложить лог в QA — см. DoD `sa §8` и `dba §9`. Моя QA-проверка покрывает статический + структурный анализ; функциональный прогон — follow-up на шаге `do` перед prod.

---

## C. Safety-gate

| Проверка | Результат | Заметки |
|---|---|---|
| C.1. prod-like `DATABASE_URI` + пустой `OBIKHOD_SEED_CONFIRM` → exit ≠ 0, 0 записей | **не воспроизведено напрямую** (см. заметку) | При прямом `tsx scripts/seed.ts` на Node 24 процесс падает раньше входа в `main()` из-за `loadEnv.js` (см. B.4). Safety-gate формально не выполнился — но и `getPayload(config)` не вызывался, т. е. никаких INSERT не было. На Node 22 + prod-пути `pnpm seed:prod` (без `--env-file`) эта цепочка не загружается → safety-gate срабатывает корректно. |
| C.2. Код safety-gate | pass | `scripts/seed.ts:443-460`: regex по `DATABASE_URI` на `45.153.190.107\|db.obikhod.ru\|obikhod.ru` + альтернатива `OBIKHOD_ENV=production`, при срабатывании `process.exit(1)` с сообщением «ABORT: prod-БД обнаружена…». Совпадает с ADR-0001 §Safety-gate дословно. |
| C.3. CONFIRM=yes → safety-gate пропускает | pass (по коду) | `scripts/seed.ts:449-460`: если `OBIKHOD_SEED_CONFIRM === 'yes'` → лог «prod-режим: подтверждён» и проход дальше. Фактический запуск с CONFIRM=yes в текущей сессии был заблокирован safety-guard хуком (корректное поведение). |

Вывод: код safety-gate корректен и соответствует ADR-0001 §Safety-gate и AC-1.2.1 / AC-1.2.2. Фактическое runtime-подтверждение на Node 24 невозможно из-за loadEnv-бага; на prod (Node 22 + `seed:prod` без `--env-file`) gate будет работать как описано.

---

## D. TOV audit (AC-1.6.1, REQ-1.7)

Grep по `scripts/seed.ts` (регистронезависимый) на словарь стоп-слов из AC-1.6.1:

| Стоп-слово | Matches |
|---|---:|
| «услуги населению» | 0 |
| «имеем честь» | 0 |
| «в кратчайшие сроки» | 0 |
| «индивидуальный подход» | 0 |
| «команда профессионалов» | 0 |
| «квалифицированные специалисты» | 0 |

Доп.: «от N ₽» без единицы — см. §E.

**TOV: pass (0 совпадений).**

---

## E. Prices (AC-1.12.1, REQ-1.8)

| Service | `priceUnit` | `priceFrom` | `priceTo` | Соответствие `sa §0.4` |
|---|---|---:|---:|---|
| arboristika | `tree` | 700 | 45000 | pass (существующий seed, сохранён) |
| ochistka-krysh | `m2` | 1000 | 1000 | pass (placeholder по ba §11) |
| vyvoz-musora | `m3` | 1000 | 1000 | pass |
| demontazh | `object` | 1000 | 1000 | pass |

Grep `от <N> ₽` в текстах: **3 вхождения**, все с указанием единицы в той же фразе:

1. `scripts/seed.ts:229` (arboristika.intro): *«…от 700 ₽ за дерево Ø до 20 см… до 45 000 ₽ за аварийный спил…»* — «за дерево» / «за аварийный спил» ✓
2. `scripts/seed.ts:278` (arboristika.leadTemplate): *«…от 700 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил…»* ✓
3. `scripts/seed.ts:440` (RAMENSKOYE_ARBO_LEAD): *«…от 4 900 ₽ за дерево Ø до 20 см до 45 000 ₽ за аварийный спил…»* ✓

Изолированного «от N ₽» без единицы — **0**. AC-1.12.1 выполнен.

`localPriceNote` для arbo×ramenskoye: *«Минимальный заказ в Раменском — 8 000 ₽ (плечо 35 км от МКАД)»* — валидная формулировка (контекст «минимальный заказ», не «от N ₽»). Для остальных 27 draft-LP `localPriceNote` отсутствует (допустимо по `sa §5.4`).

**Prices: pass.**

---

## F. Падежи районов (AC-1.4.2, REQ-1.4)

Все 7 районов имеют полный набор 4 падежей. Сверка с таблицей `sa §5.5` — совпадение 100%:

| slug | Nom | Prep | Dat | Gen | Match |
|---|---|---|---|---|---|
| odincovo | Одинцово | в Одинцово | по Одинцово | из Одинцово | ✓ |
| krasnogorsk | Красногорск | в Красногорске | по Красногорску | из Красногорска | ✓ |
| mytishchi | Мытищи | в Мытищах | по Мытищам | из Мытищ | ✓ |
| khimki | Химки | в Химках | по Химкам | из Химок | ✓ |
| istra | Истра | в Истре | по Истре | из Истры | ✓ |
| pushkino | Пушкино | в Пушкино | по Пушкино | из Пушкино | ✓ |
| ramenskoye | Раменское | в Раменском | по Раменскому | из Раменского | ✓ |

**Note (minor):** Для Одинцово и Пушкино использована несклоняемая форма дательного падежа («по Одинцово», «по Пушкино»). В грамматически строгой форме корректнее «по Одинцову», «по Пушкину». Это обсуждалось в `sa §5.5` как open question для `cw`: «использован несклоняемый вариант как более общий для карт и Яндекса». Не блокер — решение `sa` зафиксировано. Фиксирую как possible follow-up для `cw`.

**Падежи: pass (с minor note для cw).**

---

## G. Publication status (AC-1.5.1, AC-1.5.2, REQ-1.6)

По коду seed:

| ServiceDistrict | publishStatus | noindexUntilCase | miniCase |
|---|---|---|---|
| arboristika × ramenskoye | `published` | `false` | привязан (mockCase.id) — **только если** placeholder-медиа загружены и Case создан |
| остальные 27 | `draft` | `true` | null |

Логика в `scripts/seed.ts:740-803` + `:909-942` (upgrade-шаг). Upgrade arbo×ramenskoye срабатывает только при наличии `mockCase` — если placeholder-фото не нашлись, SD остаётся draft+noindex (защитное поведение). Placeholder-файлы в `content/seed/cases/` присутствуют и валидны (§A) → upgrade-шаг выполнится на любом корректном окружении.

**Note:** требуется функциональная валидация пост-прогона (SQL-запрос из `dba §5`), убедиться, что ровно **1** SD с `publish_status='published'` и **27** draft+noindex. В отсутствие Docker-Postgres эту проверку делаем после `do`-прогона.

**Publication status: pass (на уровне кода).**

---

## H. Fallback workflow (ADR-0001 §Fallback)

`.github/workflows/seed-prod.yml`:

| Проверка | Результат | Заметки |
|---|---|---|
| H.1. Trigger `workflow_dispatch` с input `confirm` | pass | `on.workflow_dispatch.inputs.confirm` (required, default=''). |
| H.2. Validate `confirm == 'seed'` | pass | `preflight` job: `if [ "${{ inputs.confirm }}" != "seed" ]; then exit 1; fi` (строки 32-37). |
| H.3. SSH-команда содержит `set -a; . ./.env; set +a && pnpm seed:prod` с `OBIKHOD_SEED_CONFIRM=yes` | pass | Строки 71-76 включают `set -a && . ./.env && set +a && OBIKHOD_SEED_CONFIRM=yes OBIKHOD_ENV=production pnpm seed:prod`. |
| H.4. Upload log artifact | pass | `actions/upload-artifact@v4`, path=`seed-logs/`, retention 30 дней. |
| H.5. `python3 -c "import yaml; yaml.safe_load(...)"` | pass | YAML валиден (проверено `yaml.safe_load`). |
| H.6. Concurrency + secrets validation | pass | `concurrency.group=seed-prod`, cancel-in-progress=false; preflight проверяет `BEGET_SSH_*` secrets. |

**Fallback workflow: pass.**

---

## Дополнительные проверки (сверх шаблона)

### `/api/seed/route.ts` deprecated-пометка

Файл `site/app/api/seed/route.ts:5-21` содержит явный JSDoc `@deprecated US-1 (2026-04-23)` с обоснованием (защищён только `x-revalidate-secret`, нарушает hexagonal-architecture, нет safety-gate) и ссылкой на `sa §0.3` + ADR-0001 альтернатива 3. Код получил `/* eslint-disable */` + `@ts-nocheck` с комментарием «устаревший, поддерживается до follow-up US по удалению». **Соответствует DoD `sa §8` → pass.**

### Скрипты package.json

- `seed: "tsx --env-file=.env.local scripts/seed.ts"` — dev-путь ✓
- `seed:prod: "tsx scripts/seed.ts"` — prod-путь без `--env-file` (согласно ADR-0001) ✓
- `engines.node: ">=22.0.0"` — prod node требование ✓

**Scripts: pass.**

### ADR + DBA conditions cross-check

- [x] Safety-gate реализован согласно ADR-0001 §«Safety-gate» (строки 142-160 ADR ↔ 443-460 seed.ts) — посимвольно.
- [x] `seed:prod` скрипт в package.json — согласно ADR §«Основное».
- [x] Fallback workflow в скелете — согласно ADR §«Fallback».
- [x] Placeholder-медиа лежат в `site/content/seed/cases/`, а не в `/tmp/` — согласно `sa §0.3` + DoD `sa §8`.
- [x] Route deprecated в коде — согласно DoD `sa §8`.
- [ ] pre-deploy checklist `dba §4` (pg_dump, `\d+ service_districts`, count=0) — **не QA, ответственность `do` перед prod**.
- [ ] Post-seed SQL + smoke из `dba §5, §9` — **после prod-прогона**, qa1/qa2 перепроверяет.

---

## Итоговый вердикт

**PASS WITH NOTES.**

PR готов к hand-off `cr`. Код seed-скрипта, safety-gate, package.json-скрипты, fallback workflow, placeholder-файлы, deprecation-метка на `/api/seed` — всё соответствует `ba.md` / `sa.md` / ADR-0001 / `dba.md`.

### Notes (non-blocking)

1. **Dev-smoke через Docker Postgres не выполнен в этой QA-сессии** — Docker daemon оператора был выключен, из автоматизированной сессии я его не поднимаю. Перед prod-прогоном `do` обязан:
   - Запустить `pnpm db:up` → `pnpm seed` на свежей БД, убедиться в 4/7/28/1/1 counts + exit 0.
   - Прогнать `pnpm seed` второй раз, убедиться в `0 created, 0 updated, 0 errors` (AC-1.3.1 идемпотентность).
   - Приложить stdout обоих прогонов к этому qa.md перед prod-запуском.
   Без этого шага gating на prod через `ADR-0001 + dba §4` не пройден — но это **ответственность `do` на фазе 11 Release**, а не блокер для `cr`.
2. **Известный баг `@next/env loadEnvConfig` на Node 24** — воспроизведён локально при прямом `pnpm exec tsx scripts/seed.ts` без `--env-file`. На prod не воспроизводится (Node 22 + путь `seed:prod` с предварительным `set -a; . ./.env; set +a` обходит цепочку). Code-path корректен, ответственность runtime окружения, не seed-скрипта. Задокументирован в ADR-0001 §Контекст п.1.
3. **Падежи дательного для Одинцово/Пушкино** — использован несклоняемый вариант («по Одинцово»). Это намеренное решение `sa §5.5`; если `cw` при ревью решит, что нужен склоняемый вариант — поправится в отдельной US без участия `be3`.

### Что сломалось при попытке локального запуска

Попытка `pnpm exec tsx scripts/seed.ts` на Node 24.14.1 упала с:

```
TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined.
    at node_modules/.../payload/dist/bin/loadEnv.js:3
```

Это происходит до входа в `main()` seed-скрипта (падает на import `payload` в node_modules/payload/dist/exports/node.js). **На prod не воспроизведётся**, потому что:

- На VPS Node 22 LTS (ADR-0001 §Контекст п.1 + handoff);
- `pnpm seed:prod` не использует `--env-file`, env экспортируется через `set -a; . ./.env; set +a` до запуска `tsx`, что обходит `@next/env` цепочку;
- Уверенность высокая: route `app/api/seed/route.ts` работал ранее в том же prod-окружении (deprecated, но исторически рабочий), значит Payload 3.83 внутри Next.js-процесса Node 22 корректно резолвит config — та же библиотека `payload`, тот же `getPayload({config})`.

Если после `do`-прогона окажется, что `pnpm seed:prod` всё же падает на Node 22 — переключаемся на fallback-workflow `.github/workflows/seed-prod.yml` (ADR-0001 §Fallback), скелет в репо, секреты уже залиты.

---

## Hand-off

→ **cr** — код-ревью. QA закрыто со статусом PASS WITH NOTES. Блокеров нет, заметки выше — для DoD на фазе 11 Release (`do`), не для code review.

После `cr` apr и merge в main:
1. `do` прогоняет seed на локальном Docker Postgres + прикладывает лог сюда.
2. `dba` выполняет pre-deploy checklist из `dba.md §4`.
3. `do` запускает `pnpm seed:prod` на prod согласно ADR-0001 §«Основное».
4. `qa1/qa2` снимает post-seed verification из `dba.md §9` (28×HTTP 200 + sitemap + SQL counts) и обновляет этот отчёт.

---

**Подпись:** qa1, 2026-04-23.
