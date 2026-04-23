# US-1: Seed prod БД — Acceptance

**Автор:** out
**Дата:** 2026-04-23
**Входы:** `./intake.md`, `./ba.md` (approved оператором 2026-04-23), `./sa.md` (approved), `./dba.md` (approved with conditions), `./qa.md` (PASS WITH NOTES), `./cr.md` (APPROVE WITH COMMENTS), `../../adr/ADR-0001-seed-prod-runner.md` (Accepted), `site/scripts/seed.ts`, `site/package.json`, `site/content/seed/cases/{before,after}.jpg`, `.github/workflows/seed-prod.yml`.
**Окружение:** код-ревью + static-analysis артефактов; фактический prod-прогон seed — фаза 11 Release (зона `do` + `qa2`), по ADR-0001.
**Решение:** **CONDITIONAL APPROVE** — акцепт по коду и готовности к релизу. Merge в main разрешён; прогон seed на prod — при выполнении 4 условий §6.

Краткая логика решения: `ba` → 14 REQ утверждено оператором → `sa` перевёл в 23 AC → `dba` approved with conditions (нет блокеров БД) → `qa` PASS WITH NOTES (3 notes уровня «ответственность `do` на фазе 11») → `cr` APPROVE WITH COMMENTS (3 P2-nit, без блокеров). Scope integrity — не нарушен. TOV-фильтр — 0 стоп-слов. Риски — покрыты fallback-workflow и DBA pg_dump. Блокеров бизнес-acceptance нет.

---

## 1. Соответствие бизнес-цели (ba.md §1)

| Бизнес-цель | Закрыта кодом? | Комментарий |
|---|---|---|
| **Разблокировать публичный запуск** (404 → 200 на 28 programmatic-URL) | ✅ по коду | `scripts/seed.ts` после прогона создаёт 4 services + 7 districts + 28 service-districts. Роут `/[service]/[district]/page.tsx:72` не делает `notFound()` для draft-LP — sa §0.5. Фактическое 28×200 подтверждается только после prod-прогона (AC-1.1.2). |
| **Готовность кода к прогону** | ✅ | Safety-gate (ADR-0001 §Safety-gate) реализован посимвольно (seed.ts:443–460, cr §«чеклист п.2»). Placeholder-медиа 41/45 KB лежат в `site/content/seed/cases/`, а не в `/tmp/`. Fallback workflow `.github/workflows/seed-prod.yml` валиден (qa §H). |
| **Готовность к merge** | ✅ | type-check + lint + format:check — green (qa §A, baseline +0). `cr` APPROVE. Новых npm-зависимостей нет. |

**Вывод:** код разблокирует публичный запуск при выполнении prod-прогона. Бизнес-цель достигается не этим PR, а этим PR **плюс** одноразовой SSH-операцией `do` после merge (ADR-0001 §«Кто и когда запускает»).

---

## 2. AC-BA coverage (ba.md §8)

| AC-BA | Реализация | Комментарий |
|---|---|---|
| **AC-BA-1** (28 URL → HTTP 200) | ✅ по коду | seed.ts создаёт 28 SD; 27 draft + 1 published. Роут не дропает draft. Проверка `curl` — фаза 11 post-release. |
| **AC-BA-2** (без флага — abort, с флагом — пишет) | ✅ по коду | Safety-gate seed.ts:443–460. На Node 24 локально `@next/env` ломает цепочку до входа в `main()` — но и запись в БД не происходит (qa §C.1). На Node 22 prod-путь `pnpm seed:prod` без `--env-file` обходит баг. |
| **AC-BA-3** (ровно 1 mock-Case published, 27 draft + noindex) | ✅ по коду | seed.ts:740–803 + 909–942 (upgrade arbo×ramenskoye). Fallback при отсутствии медиа — graceful skip (cr §Praise). |
| **AC-BA-4** (SEO-поля для 4 Services + 7 Districts + 28 SD) | ✅ по коду | Шаблоны sa §5.4 реализованы, падежи sa §5.5 — 7/7 совпадение (qa §F). `metaDescription` 140–160 hard-limit Payload соблюдается. |
| **AC-BA-5** (sitemap ≥1 programmatic URL + 4 svc + 7 dst) | ✅ по коду | `sitemap.ts:62–64` фильтр `miniCase && !noindexUntilCase` → ровно arbo × ramenskoye. Проверка — post-release curl. |
| **AC-BA-6** (0 стоп-слов + каналы в ≥1 тексте на кластер) | ⚠️ partial | Grep 7 стоп-слов: 0 вхождений (qa §D, cr чеклист п.6). Каналы Telegram/MAX/WhatsApp — 13–15 вхождений, но **arbo-кластер не упоминает «телефон»** в intro/metaDescription/leadTemplate (cr P2-nit). Строгое прочтение «все 4 канала на каждый кластер» не соблюдено для arbo. SiteChrome.phoneDisplay глобально покрывает — принимаю как accept-with-nit. |
| **AC-BA-7** (идемпотентность: повтор → 0 изменений) | ✅ по коду | `findOneBySlug` + composite-find. Единственный `update` — upgrade arbo×ramenskoye, защищённый `if (!hasCase \|\| !isPublished)` (seed.ts:991–1023). Ручные правки `cw` защищены (AC-1.3.2). Фактическая проверка — второй прогон на фазе 11. |
| **AC-BA-8** (no Payload migrations) | ✅ | `site/migrations/` не изменён, `payload.config.ts:52` `push: true` сохраняется. Follow-up Issue «Payload migrations» — поручается `po` (§Hand-off). |

---

## 3. REQ coverage (ba.md §4 — 14 REQ)

| REQ | MoSCoW | Реализован? | Заметка |
|---|---|---|---|
| REQ-1.1 (идемпотентность) | Must | ✅ | findOneBySlug / composite-find, 0 затирающих `update` (cr чеклист п.3). |
| REQ-1.2 (4×7 = 28) | Must | ✅ | Ровно 4/7/28 в seed.ts. |
| REQ-1.3 (SEO-минимум) | Must | ✅ | metaTitle/metaDescription/h1/intro/leadParagraph заполнены шаблонами sa §5.4. |
| REQ-1.4 (4 падежа) | Must | ✅ | 7/7 совпадение sa §5.5 (qa §F). Minor nit: «по Одинцово» вместо «по Одинцову» — намеренное решение sa, follow-up для `cw`. |
| REQ-1.5 (4 канала) | Must | ⚠️ accept-with-nit | 3 из 4 кластеров упоминают все 4 канала. arbo-кластер — только Telegram/MAX/WhatsApp. SiteChrome компенсирует глобально. |
| REQ-1.6 (1 mock-Case + 27 без) | Must | ✅ | Upgrade arbo×ramenskoye с защитой от повторов; 27 остаются draft+noindex. |
| REQ-1.7 (TOV) | Must | ✅ | Grep 7 стоп-слов: 0 вхождений (qa §D, cr чеклист п.6). |
| REQ-1.8 (фикс-цена) | Must | ✅ | Все «от N ₽» сопровождаются единицей («за дерево», «за объект») — qa §E. |
| REQ-2.1 (env-флаг prod) | Should | ✅ | ADR-0001 §Safety-gate посимвольно — seed.ts:443–460. |
| REQ-2.2 (SeoSettings placeholder) | Should | ✅ | `credentials` (4 шт.) + priceRange + openingHours + geoRadiusKm (seed.ts:488–499). |
| REQ-2.3 (placeholder-медиа) | Should | ✅ | before.jpg (41 499 B) + after.jpg (45 719 B), валидные JPEG 800×449, в репо. |
| REQ-3.1 (≥1 Persons) | Could | ✅ | Алексей Семёнов с worksInDistricts=[ramenskoye]. |
| REQ-3.2 (SUMMARY лог) | Could | ✅ | Формат sa §5.6 реализован. |
| REQ-4.1 (no migrations) | Won't | ✅ | `site/migrations/` пуст; `payload.config.ts` не тронут. Follow-up → `po`. |

**Итог:** 14/14 REQ закрыто. 2 Must с nit-ами уровня «accept-with-risk» (REQ-1.4 пунктуация, REQ-1.5 телефон в arbo) — покрываются глобально и открыты как follow-up для `cw`.

---

## 4. Scope integrity

- ✅ **be3 НЕ трогал миграции.** `git diff site/migrations/` — пусто. `payload.config.ts:52` (`push: true`) сохраняется. REQ-4.1 (Won't) соблюдён (qa §Cross-check, cr чеклист п.10).
- ✅ **Реальные тексты НЕ подменены.** Шаблоны `ochistka-krysh` / `vyvoz-musora` / `demontazh` — placeholder, за рамки sa §5.4 не выходят. Реальный текст `cw` — отдельная follow-up US (ba.md §6).
- ✅ **Cases — 1 mock.** `snyali-pen-gostitsa-2026` — существующий из коммита c2f5072. Расширение до 3–5 — Won't this release.
- ✅ **`/api/seed/route.ts` deprecated корректно.** JSDoc + `@ts-nocheck`; удаление — follow-up US (sa §8, ADR-0001 follow-up).
- ✅ **Новых npm-зависимостей нет.** `dotenv`-паттерн отвергнут в ADR-0001 A2 в пользу `set -a; . ./.env`.

Scope creep не обнаружен.

---

## 5. NFR

| NFR | Статус | Источник |
|---|---|---|
| **TOV-фильтр** | ✅ | 0 стоп-слов по 7-словарю (qa §D, cr чеклист п.6). |
| **Формат цен** | ✅ | 3 вхождения «от N ₽» — все с единицей в той же фразе (qa §E). Изолированного «от 1 000 ₽» — 0. |
| **4 канала на кластер** | ⚠️ 3/4 | arbo: Telegram/MAX/WhatsApp (без «телефон»). Остальные 3 кластера — полностью. SiteChrome.phoneDisplay компенсирует. Nit → `cw` follow-up. |
| **Reliability / idempotency** | ✅ | 0 merge-полей, единственный `update` защищён guard-условием. |
| **Safety** | ✅ | ADR-0001 §Safety-gate посимвольно; regex + OBIKHOD_ENV двусторонний; `/api/seed` deprecated. |
| **Observability** | ✅ | SUMMARY формат sa §5.6 + двойная фиксация лога (stdout + qa.md, ADR-0001 §«Где хранится артефакт»). |
| **Security (secrets)** | ✅ | Секреты не логируются; `.env` в git нет; BEGET_SSH_* через `${{ secrets.* }}` (cr чеклист п.2, 5). |
| **Data protection (152-ФЗ)** | ✅ | БД на Beget VPS РФ; `taxId: 7847729123` — placeholder по MEMORY `project_inn_temp.md`, не ПДн. |
| **Performance** | N/A | Разовый скрипт, ориентир <60 сек на пустой БД. |
| **CI green** | ✅ | type-check + lint + format:check — green, baseline +0 (qa §A). |

---

## 6. Release-ready checklist

- [x] `ba` approved оператором 2026-04-23.
- [x] `sa` approved, 23 AC сформулированы.
- [x] `dba` approved with conditions (4 условия — зона `do` на фазе 11).
- [x] `qa1` PASS WITH NOTES (3 notes — не блокер merge).
- [x] `cr` APPROVE WITH COMMENTS (3 P2-nit — не блокер merge).
- [x] ADR-0001 Accepted, реализация посимвольно совпадает.
- [x] Safety-gate в коде проверен (seed.ts:443–460).
- [x] Placeholder-медиа в репо (`site/content/seed/cases/{before,after}.jpg`).
- [x] Fallback workflow валиден (qa §H).
- [x] `/api/seed/route.ts` deprecated корректно.
- [x] Scope integrity — не нарушен (REQ-4.1 соблюдён).
- [ ] **Оператор ознакомлен с post-merge шагами §7/§8** (этот отчёт — основа).
- [ ] Pre-deploy checklist `dba §4` (pg_dump -Fc + SQL counts + `\d+`) — **перед prod-прогоном seed, зона `do`**.
- [ ] Dev-smoke через Docker Postgres (`pnpm db:up` → `pnpm seed` × 2) — **перед prod-прогоном, зона `do`**.
- [ ] Post-seed verification `dba §9` + 28×200 smoke — **после prod-прогона, зона `qa1/qa2`**.

---

## 7. Summary для оператора (post-merge actions)

**US-1 приняла acceptance с вердиктом CONDITIONAL APPROVE.** Блокеров для merge в `main` нет: код seed расширен до 4 кластеров × 7 пилотных районов, safety-gate посимвольно реализует ADR-0001, placeholder-медиа закоммичены, fallback-workflow готов. Merge PR разрешён. **Фактический запуск seed на prod — отдельный ручной шаг `do` по ADR-0001**, потому что на pipeline'е нет автоматической seed-операции (это by design, чтобы случайный push не наполнил БД). После merge auto-deploy подхватит новый код seed-скрипта, но данные в БД появятся **только** после запуска `pnpm seed:prod` по SSH. До этого шага публичный запуск остаётся заблокирован.

### 8. Post-merge actions (для `do`, в порядке)

1. **Dev-smoke:** `pnpm db:up` → `pnpm seed` (×2 для идемпотентности) → лог в qa.md §B.
2. **Pre-deploy (dba §4):** SSH на VPS → `sudo -u postgres pg_dump -Fc -d obikhod -f /var/backups/obikhod/pre-seed/obikhod-pre-seed-$(date -u +%Y%m%dT%H%M%SZ).dump` + SQL из dba §4.2 (count=0 + `\d+ service_districts`).
3. **Prod-прогон:** `cd /home/deploy/obikhod/current && set -a; . ./.env; set +a && OBIKHOD_SEED_CONFIRM=yes OBIKHOD_ENV=production pnpm seed:prod 2>&1 | tee /var/log/obikhod/seed-$(date -u +%Y%m%dT%H%M%SZ).log`.
4. **Post-seed verification (dba §9, qa2):** 28×`curl -I` (все 200), SQL count (4/7/28/1/1), `curl /sitemap.xml` (есть `/arboristika/ramenskoye/`), лог seed → qa.md.
5. **Если prod-прогон упал** (Node 22 + tsx-loader): fallback через GitHub Actions `seed-prod.yml` (workflow_dispatch, input `confirm=seed`).

### Ответ на вопрос от `cr`

**Accept по коду до prod-прогона.** По WORKFLOW §10 `out` даёт acceptance до фактического релиза (это condition для `po` на выкатку). Prod-прогон seed + post-release smoke — фаза 11, зона `do` + `qa2`. Ждать prod-прогона в рамках этого acceptance не нужно — иначе на фазе 10 зависнем.

---

## 9. Follow-ups (conditional)

- [ ] **US-2 Payload migrations.** Блокер снят. Завести Issue в Linear — `po`.
- [ ] **US-3 Удалить `/api/seed/route.ts`.** Deprecated корректно; удалить после стабилизации seed — `po` ставит в backlog.
- [ ] **US-4 Реальные тексты 28 LP + «телефон» в arbo-кластере (AC-BA-6 nit).** Ведёт `cw`.
- [ ] **US-5 Wave-2 география (5 районов) + 50+ услуг.** Ba.md §6 Won't.
- [ ] **US-6 Grammar-fix: «по Одинцову» / «по Пушкину».** Правка sa §5.5 + re-seed — `cw`.
- [ ] **US-7 `fe2` скрыть жёлтую плашку статуса для анонимных посетителей на draft-LP.** sa §9 open question.
- [ ] **US-8 Payload indexes:** GIN на leadParagraph + B-tree на (publish_status, noindex_until_case) — dba §3.3 backlog, когда > 200 LP.

---

## 10. Риски post-release (с митигацией)

| # | Риск | P | Митигация |
|---|---|:-:|---|
| 1 | `pnpm seed:prod` падает на Node 22 из-за Payload 3.83 standalone-пути | M | Fallback workflow `.github/workflows/seed-prod.yml` (готов, secrets залиты). |
| 2 | Placeholder-медиа не проходят Payload media-validation (Sharp) | L | seed.ts:911–915 graceful skip → arbo×ramenskoye останется draft+noindex (защитное поведение, cr §Praise). Повторный прогон после фикса — идемпотентен. |
| 3 | `do` забыл сделать pg_dump → нет отката при инциденте | L | Checklist §7 п.2. Daily backup 03:00 MSK — partial safety-net (RPO 24 ч). |
| 4 | `DATABASE_URI` в `shared/.env` указывает на staging — regex не срабатывает | L | dba §4.1 требует `psql -c 'SELECT current_database()'` перед seed, фиксировать в qa.md (ADR-0001 §Минусы). |
| 5 | Повторный прогон обновил то, что `cw` поправил через /admin | L | `findOneBySlug`-skip + 0 merge-полей + guard на upgrade → фундаментально невозможно (cr §3). |

**Топ-1 риск:** Node 22 `tsx` на VPS падает в реальной prod-среде (ранее не воспроизведено на staging, staging нет). Фактическая проверка — первый прогон `do`. Митигация: fallback workflow в 30 минут активируется.

---

## 11. Вердикт

**CONDITIONAL APPROVE** — релиз в main разрешён. Прогон seed на prod — при условиях §6 и §8 (зона `do` + `qa2` на фазе 11).

Подпись: **out**, 2026-04-23.

---

## Hand-off

- → **`po`** — написать release notes `devteam/release-notes/US-1-seed-prod-db.md` (шаблон WORKFLOW §8), завести 7 follow-up Issues (§9), перевести OBI-<N> в Done после post-seed verification.
- → **`do`** — post-merge actions §8 (dev-smoke → pg_dump → prod-прогон → лог в qa.md).
- → **`qa2`** — post-seed verification `dba §9` (28×200 + SQL + sitemap) на фазе 11, обновить qa.md.
- → **оператор** — после успешного post-seed verification подать sitemap в Яндекс.Вебмастер (follow-up US-SEO-Launch).
