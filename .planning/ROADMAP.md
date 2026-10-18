# Roadmap: Обиход — Milestone v1.0 Overtake-3

**Created:** 2026-05-15
**Granularity:** standard (5 phases)
**Coverage:** 32/32 v1 requirements mapped ✓
**Core Value:** Один лид через сайт стоит дешевле, чем у любого из 3 ключевых конкурентов (liwood.ru / arboristik.ru / arborist.su).

## Контекст

Brownfield-extension поверх Next.js 16 + Payload 3 + PostgreSQL 16 на Beget VPS. Один EPIC
`specs/EPIC-OVERTAKE-3-RESEARCH/` с 5 sub-folders (sustained pattern B1-B5 из EPIC-LIWOOD-OVERTAKE).
`.planning/` — стратегический REQ-layer; execution идёт в `specs/EPIC-OVERTAKE-3-RESEARCH/<phase>/`
+ `team/backlog.md`. Команда — 9 ролей (po, dev, fe, seo, cw, design, qa, devops, arch).

Phase 1 SETUP — sustained Day-0 operator batch выполнен 2026-05-15 (см. PROJECT.md Key Decisions),
поэтому повторного operator-gate в этой фазе нет. Phase 5 EXEC параллелен ко всем т.к. `site/`
файлы НЕ пересекаются с research stream (`seosite/+.planning/`).

## Phases

- [ ] **Phase 1: SETUP** — Lightweight bootstrap research EPIC, template и REQ-mapping (0.5 ЧД, PO solo)
- [ ] **Phase 2: BENCHMARK ARB + ARBSU PARALLEL** — Live decision-grade snapshots + 8-axis verdict для arboristik.ru и arborist.su (~4 ЧД, 2 parallel seo+po sessions)
- [ ] **Phase 3: CROSS ROADMAP** — Synthesis 3 benchmarks → ≤8 NEW US с cannibalisation matrix hard gate (~1 ЧД, sequential)
- [ ] **Phase 4: MONITOR 3X** — Расширение watcher.ts 1→3 конкурентов + dry-run ≥7 дней (~1.5 ЧД, sequential)
- [ ] **Phase 5: EXEC COMPLETE B2B-trust + Content-depth + sustained OVT/US closure** — Закрытие 14+ open работ, fully parallel ко всем other phases (~до конца окна milestone)

## Phase Details

### Phase 1: SETUP

**Goal**: Команда располагает working scaffolding для запуска benchmark + monitor + cross-roadmap streams: один EPIC-папка, template для benchmark-документов и mapping table REQ-ID → EPIC sub-phase.

**Depends on**: Nothing (первая phase, Day-0 operator batch уже выполнен 2026-05-15)
**Requirements**: (none — это organizational/bootstrap phase, артефакты Phase 1 не описаны в REQUIREMENTS.md; все 32 REQ-IDs покрыты Phases 2-5)
**Success Criteria** (what must be TRUE):
  1. `specs/EPIC-OVERTAKE-3-RESEARCH/intake.md` существует с AC + Hand-off log skeleton + ссылками на 5 sub-folders (B1-arboristik, B1-arborist-su, cross-roadmap, monitor-3x, exec-complete)
  2. `seosite/01-competitors/_TEMPLATE-vs-obikhod.md` существует с 8-axis verdict schema (sustained pattern из liwood-vs-obikhod-2026-05-W.md) + явная секция «what NOT to copy» (anti-patterns)
  3. Phase mapping table в этом ROADMAP.md ссылается на конкретные sub-folders, `.planning/STATE.md` обновлён `current_phase=1` → готов к Phase 2 kick-off
  4. Day-0 operator batch retrospective задокументирован в `specs/EPIC-OVERTAKE-3-RESEARCH/intake.md` Hand-off log (apruvлены: roadmap + RICE + 30k₽ budget envelope + Я.Бизнес ETA + P1 NEW US OVT-8/9 + LSI + 782н, P3 OVT-10/11 в v1.1)

**Iron rules compliance:**
- brand-guide-first: **не применим** (нет UI работы)
- spec-before-code: ✓ intake.md = spec для downstream phases
- green CI before merge: ✓ Markdown PR проходит `format:check`
- qa real-browser smoke: **не применим** (нет UI)
- merge = qa + po + CI green: ✓ Markdown PR

**Plans**: TBD (создаются /gsd-plan-phase 1)

### Phase 2: BENCHMARK ARB + ARBSU PARALLEL

**Goal**: PO/operator располагают live decision-grade snapshots и 8-axis verdicts для arboristik.ru и arborist.su с подтверждением (или откатом) sustained 5/8 LEAD axes на свежих evidence, чтобы строить cross-roadmap на актуальных данных без drift >14 дней.

**Depends on**: Phase 1 (template + EPIC scaffolding обязательны для consistency артефактов)
**Requirements**: BENCH-01, BENCH-02, BENCH-03, BENCH-04
**Success Criteria** (what must be TRUE):
  1. Файлы `seosite/01-competitors/arboristik-snapshot-2026-05.json` и `seosite/01-competitors/arborist-su-snapshot-2026-05.json` существуют, оба содержат 13 URL × WebFetch + Keys.so delta + PSI mobile p75 (или explicit `pending` если operator не выдал PSI key) с `as_of` timestamp
  2. Файлы `seosite/01-competitors/arboristik-vs-obikhod-2026-05.md` и `seosite/01-competitors/arborist-su-vs-obikhod-2026-05.md` существуют, оба заполнены полной 8-axis матрицей × {competitor / obikhod / verdict (LEAD/PARITY/LAG) / gap size / leverage ref / proposed action} + секцией «what NOT to copy»
  3. Sustained 5/8 LEAD axes (Schema 100% / photo→quote AI / RUM / Authors с Person Schema / clean nav) подтверждены или откачены explicit verdict (если откат — флаг для Phase 3 cross-roadmap urgency)
  4. PO/operator может прочитать оба `<comp>-vs-obikhod.md` файла независимо друг от друга и принять решение по cross-leverage без дополнительного контекста
  5. parallel-safe execution подтверждён: 2 seo+po sessions работали без git-worktree (read-only артефакты в `seosite/01-competitors/`), 0 merge-конфликтов между PR

**Iron rules compliance:**
- brand-guide-first: **не применим** (нет UI работы)
- spec-before-code: ✓ sub-folder spec.md в `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arboristik/` + `B1-arborist-su/`
- green CI before merge: ✓ Markdown/JSON PR проходит `format:check` + JSON validator
- qa real-browser smoke: **не применим** (нет UI)
- merge = qa + po + CI green: ✓ artifact integrity check (snapshot.json schema, 8-axis presence)

**Plans**: TBD

### Phase 3: CROSS ROADMAP

**Goal**: PO/operator располагают единый decision-grade документ для milestone — `cross-overtake-roadmap-2026-05.md` со объединёнными leverage-points 3 benchmarks (liwood ⊕ arboristik ⊕ arborist.su), переведёнными в ≤8 NEW US с RICE ≥1.5 и cannibalisation-safe для existing 16 OVT-*/US-2..11.

**Depends on**: Phase 2 (cross-synthesis невозможен пока обе `*-vs-obikhod.md` не существуют)
**Requirements**: XROAD-01, XROAD-02, XROAD-03
**Success Criteria** (what must be TRUE):
  1. Файл `seosite/01-competitors/cross-overtake-roadmap-2026-05.md` существует с leverage matrix 3-way + RICE recompute + RACI + Gantt 8-12 нед (sustained pattern из `overtake-roadmap-2026-05.md`)
  2. Cannibalisation matrix hard gate пройден — для каждого NEW URL audit per ADR-0018 §13 (canonical + slug-discipline + SERP intent overlap manual check), 0 каннибализирующих новых URL допущены к merge
  3. В `team/backlog.md` секция «Cross-competitor overtake (cross-3)» содержит ≤8 NEW US, каждая с `covered-by: <existing-or-null>`, RICE ≥1.5, MoSCoW и owner; deduplication vs 16 sustained OVT-*/US-2..11 explicit per row
  4. Обновлён `.planning/ROADMAP.md` traceability и Phase 4 «MONITOR 3X» получает per-target threshold updates (если cross-roadmap выявил specifics arboristik/arborist.su отличающиеся от liwood baseline)

**Iron rules compliance:**
- brand-guide-first: **не применим** (нет UI работы)
- spec-before-code: ✓ `specs/EPIC-OVERTAKE-3-RESEARCH/cross-roadmap/spec.md`
- green CI before merge: ✓ Markdown PR + backlog.md format check
- qa real-browser smoke: **не применим** (нет UI)
- merge = qa + po + CI green: ✓ cannibalisation matrix как qa-gate; po review backlog diff

**Plans**: TBD

### Phase 4: MONITOR 3X

**Goal**: SEO/operator получают автоматическое weekly drift detection vs 3 конкурентов (sitemap + URL-counts + JSON-LD coverage + per-target config) с liveness assertion и UTC-vs-MSK безопасностью, при этом prod cron включается только после ≥7 дней успешного dry-run без false-positives.

**Depends on**: Phase 3 (cross-roadmap может уточнить per-competitor thresholds; soft dep — теоретически parallel-ok, но PO держит sequential для избежания pre-mature thresholds → false alerts)
**Requirements**: MON-01, MON-02, MON-03, MON-04, MON-05
**Success Criteria** (what must be TRUE):
  1. `seosite/04-monitoring/targets.config.ts` существует с 3 competitors (liwood / arboristik / arborist_su) как separate config blocks (UA, throttle rps, retry, robots.txt allowlist, expected min content size); `watcher.ts` рефакторен на `TARGETS[]` loop без хардкода URL
  2. Snapshot schema мигрирована на `{competitors: {liwood, arboristik, arborist_su}, obikhod}` + backwards-compatible legacy reader для старых liwood-only snapshots; first weekly snapshot валидируется без ошибок против обоих schemas
  3. Watcher работает в `--dry-run` режиме ≥7 дней на 3 целях с 0 false-positives (`null` vs `<50% baseline` triggers immediate Telegram alert), затем `.github/workflows/seo-monitor.yml` обновлён (timeout 15min, alert filename `${DATE}-${COMP}-${TYPE}.md`, `gh issue create --label competitor:${KEY}`, cron `'0 5 * * 1' # 08:00 МСК Mon` explicit comment) и prod cron enabled
  4. Первый real cron run (post-dry-run) производит accurate diff для всех 3 targets — sitemap URL counts + JSON-LD coverage + key URL meta — без false-negative (если у конкурента реально изменения — алерт fires; если нет — 0 алертов)
  5. EXEC-13 (US-10 monitoring legacy single-competitor) закрывается «supersede» note в backlog без блокировки Phase 5 closure

**Iron rules compliance:**
- brand-guide-first: **не применим** (no UI)
- spec-before-code: ✓ `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/spec.md` + sa-seo.md
- green CI before merge: ✓ type-check + lint + format:check на watcher.ts + targets.config.ts (TS strict); unit-tests на parse fixtures обязательны
- qa real-browser smoke: **не применим** (watcher не меняет публичные endpoints; smoke = `pnpm tsx seosite/04-monitoring/watcher.ts --dry-run` + `--force-alert` validation локально)
- merge = qa + po + CI green: ✓ dry-run ≥7d gate, qa проверяет snapshot.json + alerts/*.md integrity

**Plans**: TBD

### Phase 5: EXEC COMPLETE B2B-trust + Content-depth + sustained OVT/US closure

**Goal**: B2C/B2B-визитор obikhod.ru получает 2 новых first-mover B2B-страницы (абонентка + штрафы ГЖИ), regulatorный язык в hero (782н + страховка ГО 10 млн), content-depth блоки (LSI «10 причин» + «сам vs специалист») в T2 master-template на 5 pillar, а sustained OVT-1..7 + US-2..11 закрываются до DoD — закрывая LAG ось 8 (B2B/local) и content-depth LAG vs liwood 3500w.

**Depends on**: Nothing (fully parallel ко всем Phase 1-4 — `site/` файлы НЕ пересекаются с research stream `seosite/+.planning/`; разные agents stream)
**Requirements**: B2B-01, B2B-02, B2B-03, B2B-04, CONT-01, CONT-02, EXEC-01, EXEC-02, EXEC-03, EXEC-04, EXEC-05, EXEC-06, EXEC-07, EXEC-08, EXEC-09, EXEC-10, EXEC-11, EXEC-12, EXEC-13, EXEC-14
**Success Criteria** (what must be TRUE):
  1. B2B-01: `/b2b/abonement/` страница HTTP 200 в prod с 3 тарифами абонентки (45k/120k/220-450k ₽/мес) + договор-шаблон PDF + reference на страховку ГО 15 млн; **blocked-by-operator-flag**: B2B-04 (страховой полис ГО 15 млн / регистрация ЮЛ — operator action)
  2. B2B-02: `/b2b/` flagship hero «Штрафы ГЖИ/ОАТИ берём на себя» deployed в prod с regulatorным сопровождением + 3 ниши messaging (first-mover паттерн alpbond.org)
  3. CONT-01 + CONT-02: LSI-блоки «10 причин выбрать специалиста» (5 pillar) + «Сам vs специалист» (3 pillar applicable) обновлены в T2 master-template — content-depth LAG vs liwood 3500w закрыт; mobile-first qa gate 375/414/768/1024 пройден
  4. ≥10 EXEC reqs (EXEC-01..14, excluding EXEC-13 which supersedes by MON-01..05) merged в main до DoD; EXEC-03 (OVT-4 Я.Карты) и EXEC-04 (OVT-5 video) — **blocked-by-operator-flag** (Я.Бизнес setup + photo footage)
  5. OVT-MKT budget envelope ≤30k₽ соблюдён (Day-0 sustained decision); EXEC-13 закрыт с «supersede by MON-01..05» note без блокировки milestone closure

**Iron rules compliance:**
- brand-guide-first: ✓ CONT-01/02 + B2B-01/02/03 — UI компоненты ТОЛЬКО из brand-guide v2.3; если §LSI-блок нет в guide → design сначала PR в brand-guide, потом fe верстает (iron rule «brand-guide-first»)
- spec-before-code: ✓ каждый sustained OVT/US имеет sa-<team>.md в `specs/EPIC-LIWOOD-OVERTAKE/` или `specs/EPIC-SEO-COMPETE-3/`; NEW B2B-*/CONT-* требуют sa-fe.md/sa-cw.md/sa-design.md перед dev
- green CI before merge: ✓ type-check + lint + format:check на site/ изменениях (TS strict, Tailwind, shadcn/ui)
- qa real-browser smoke: ✓ ОБЯЗАТЕЛЬНО для B2B-01, B2B-02, B2B-03, CONT-01, CONT-02 (UI changes на 5 pillar + 2 новых routes); mobile-first 375/414/768/1024 viewport audit; horizontal scroll / font <16px / sticky >56px = block merge
- merge = qa + po + CI green: ✓ standard 3-gate, devops merge

**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. SETUP | 0/1 | Not started | - |
| 2. BENCHMARK ARB + ARBSU PARALLEL | 0/2 | Not started | - |
| 3. CROSS ROADMAP | 0/1 | Not started | - |
| 4. MONITOR 3X | 0/1 | Not started | - |
| 5. EXEC COMPLETE | 0/5 | Not started | - |

## REQ-ID → Phase → EPIC/sub-folder mapping

| REQ-ID | Phase | EPIC sub-folder | Existing or NEW execution |
|--------|-------|----------------|----------------------------|
| BENCH-01 | 2 | `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arboristik/` | NEW |
| BENCH-02 | 2 | `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arboristik/` | NEW |
| BENCH-03 | 2 | `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arborist-su/` | NEW |
| BENCH-04 | 2 | `specs/EPIC-OVERTAKE-3-RESEARCH/B1-arborist-su/` | NEW |
| XROAD-01 | 3 | `specs/EPIC-OVERTAKE-3-RESEARCH/cross-roadmap/` | NEW |
| XROAD-02 | 3 | `specs/EPIC-OVERTAKE-3-RESEARCH/cross-roadmap/` | NEW (cannibalisation matrix) |
| XROAD-03 | 3 | `specs/EPIC-OVERTAKE-3-RESEARCH/cross-roadmap/` | NEW (backlog diff) |
| MON-01 | 4 | `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/` | NEW (refactor watcher.ts) |
| MON-02 | 4 | `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/` | NEW (schema migration) |
| MON-03 | 4 | `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/` | NEW (per-target config) |
| MON-04 | 4 | `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/` | NEW (yml + labels) |
| MON-05 | 4 | `specs/EPIC-OVERTAKE-3-RESEARCH/monitor-3x/` | NEW (dry-run gate) |
| B2B-01 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-8/` | NEW (apruved Day-0) |
| B2B-02 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-9/` | NEW (apruved Day-0) |
| B2B-03 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/B2B-licenses-782n/` | NEW (apruved Day-0) |
| B2B-04 | 5 | (operator action — страховой полис ГО 15 млн + регистрация ЮЛ) | EXTERNAL (hard prereq для B2B-01+02) |
| CONT-01 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/CONT-LSI-10-reasons/` | NEW (apruved Day-0) |
| CONT-02 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/CONT-LSI-self-vs-pro/` | NEW (apruved Day-0) |
| EXEC-01 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-1/` | EXISTING |
| EXEC-02 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-2/` (+ EPIC-SEO-COMPETE-3 US-6) | EXISTING (covered-by) |
| EXEC-03 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-4/` | EXISTING (blocked-by-operator Я.Бизнес) |
| EXEC-04 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-5/` | EXISTING (blocked-by-operator footage) |
| EXEC-05 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-6/` | EXISTING |
| EXEC-06 | 5 | `specs/EPIC-LIWOOD-OVERTAKE/OVT-7/` (sub OVT-1) | EXISTING |
| EXEC-07 | 5 | `specs/EPIC-SEO-COMPETE-3/US-2-url-map/` | EXISTING |
| EXEC-08 | 5 | `specs/EPIC-SEO-COMPETE-3/US-3/` | EXISTING |
| EXEC-09 | 5 | `specs/EPIC-SEO-COMPETE-3/US-4/` | EXISTING |
| EXEC-10 | 5 | `specs/EPIC-SEO-COMPETE-3/US-7/` | EXISTING |
| EXEC-11 | 5 | `specs/EPIC-SEO-COMPETE-3/US-8/` | EXISTING |
| EXEC-12 | 5 | `specs/EPIC-SEO-COMPETE-3/US-9/` (+ OVT-6) | EXISTING |
| EXEC-13 | 5 | `specs/EPIC-SEO-COMPETE-3/US-10/` | EXISTING (supersedes by MON-01..05 — close with note) |
| EXEC-14 | 5 | `specs/EPIC-SEO-COMPETE-3/US-11/` | EXISTING |

## Notes

- **Phase 1 SETUP не покрывает REQ-IDs из REQUIREMENTS.md** — это organizational bootstrap (template + intake + Day-0 retrospective). 32 v1 requirements полностью покрыты Phases 2-5.
- **Phase 5 параллелен ко всем других** — единственная phase с UI changes (B2B-01/02/03 + CONT-01/02); требует brand-guide-first + qa real-browser smoke gate.
- **EXEC-13 closure path** — `team/backlog.md` US-10 row помечается `done` с note «superseded by MON-01..05 (Phase 4)»; не блокирует milestone closure.
- **Operator actions hard prereqs** — B2B-04 (страховой полис ГО 15 млн + ЮЛ), EXEC-03 (Я.Бизнес owner setup), EXEC-04 (video footage coordination); все идут в Wave-mid operator batch session (sustained Day-0 / Wave-mid / Final-gate pattern).
- **Day-0 sustained decisions** (apruved 2026-05-15): P1 NEW US (OVT-8/9 + LSI + 782н) IN, P3 (OVT-10/11) OUT в v1.1, OVT-MKT budget envelope ≤30k₽.

---
*Roadmap created: 2026-05-15*
*Based on: PROJECT.md (32 REQ-IDs) + research/SUMMARY.md (HIGH confidence) + Day-0 operator batch 2026-05-15*
