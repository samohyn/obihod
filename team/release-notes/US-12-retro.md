---
us: US-12
target: admin redesign
shipped_at: 2026-05-01
status: closed
prs_count: 13
author: cpo
created: 2026-05-01
---

# US-12 Admin Redesign — Post-Release Retro

**Программа:** US-12 Admin Redesign (мандат оператора 2026-04-28 — полный редизайн `/admin` под brand-guide §12).
**Closure:** 2026-05-01 ~11:15 UTC, operator approve по [`leadqa-RC-3-hotfix.md`](leadqa-RC-3-hotfix.md).
**Команда:** panel (popanel + sa-panel + ux-panel + fe-panel + be-panel + cr-panel + qa-panel + leadqa + release + do).
**Skill активирован cpo:** `project-flow-ops` (для retro-сводки cross-phase pipeline'а).

---

## 1. Сводка релиза

**Что shipped (13 PR cumulative, 2 RC + hotfix):**

| RC | PR | Доставка |
|---|---|---|
| **RC-1 (phase B)** | W1-W5 + PAN-15/PAN-18 + PR #99-#101 | custom.scss 375 строк, ADR-0005, login UI, tabs, dashboard catalog, EmptyState/Skeleton (закрыт ADR-0010 для views.list API) |
| **RC-2 (cumulative, 12 PR)** | #106 W6, #107 W7, #109 W8, #110 W9, #111 LIST-AMBER, #112 FAVICON, #115 A11Y-TARGET-SIZE, #116 SERVICES-PREVIEW-TAB, #117 HEADER-CHROME-POLISH, #119 DRAFT-PREVIEW-ROUTE, #120 EMPTY-LIST-WIRING, #121 NAV-HOME-LINK-CLEANUP | mobile responsive admin, axe-playwright integration, sidebar IA + 13 line-art иконок, force-light depth, amber primary CTA, бренд favicon на весь периметр, Превью tab в Services, EmptyState wired, sidebar polish |
| **RC-3 hotfix** | #122 (squash `e9bd3c1`) | RSC border fix `CollectionListWithEmpty.tsx` — закрывает 500 на коллекциях с `totalDocs > 0` |

**Бизнес-impact для оператора:**
- `/admin` теперь полностью brand-guide §12 compliant (lockup ОБИХОД, amber primary CTA, line-art icon set, force-light depth, custom dashboard widget «Свежие правки»).
- Mobile-ready: drawer sidebar 375px, fullscreen login, h-scroll внутри list-view, touch-targets 44×44 WCAG 2.5.5.
- A11y AA baseline: axe-playwright интегрирован, 5+ routes покрыты smoke'ом, `target-size` rule re-enabled.
- 13 line-art иконок sidebar (CSS `mask-image`, ADR-0011) вместо дефолтных Payload плашек.
- Empty/Loading states в Cases + Blog list-view (с recovery после RSC fix).
- Force-light depth — никаких dark-theme leaks внутри edit-views.
- Operator теперь имеет один консистентный Caregiver+Ruler experience от login до выхода.

---

## 2. What worked

1. **Autonomous mandate (popanel закрыл 7 PR overnight 2026-04-30 → 2026-05-01).** Iron rule #7 (PO orchestration без эскалации) показал зрелость — popanel самостоятельно вёл dev→qa→cr→gate hand-off'ы, оператор не был bottleneck'ом для штатных переходов. 7 follow-ups (#115, #116, #117, #119, #120, #121, #122) ушли в main без single ping в operator-канал.
2. **Pre-deploy CI green pattern (`do`).** Все 12 PR из RC-2 прошли type-check + lint + format + Lighthouse + Playwright E2E зелёным до merge. Iron rule #5 (do owns green CI) ни разу не нарушен — ноль красных checks для оператора.
3. **`leadqa` real-browser smoke поймал critical regression #120 ДО operator approve.** Iron rule #6 (release gate с обязательным leadqa перед operator) сработал штатно: leadqa-RC-2 идентифицировал 500 на `/admin/collections/cases` (RSC pass error — `access` функции в client component) до того как оператор увидел красную панель. BLOCK + selective fix-forward path был дан в одном отчёте. Это ровно тот сценарий, ради которого iron rule #6 был введён 2026-04-28.
4. **Sequential pipeline release → leadqa → operator → cpo retro.** Двухступенчатый релиз-цикл (введён 2026-04-28) выстоял первый «настоящий» BLOCK + hotfix без хаоса. RC-2 BLOCK → fe-panel hotfix #122 → leadqa-RC-3 APPROVE → operator approve → cpo retro — всё за 1.5-2 часа в одну сессию, ноль потерянных артефактов, hand-off log в каждом артефакте.
5. **Hotfix архитектурно качественный, не band-aid.** fe-panel сделал explicit whitelist `CLIENT_PROP_KEYS` (25 ключей `ListViewClientProps + ListViewSlots`) с jsdoc-rationale + ссылкой на RC-2 incident + reference на `payload/dist/index.bundled.d.ts:7849-7854`. Cr-panel self-approved per iron rule #7 (scope = 1 файл, ~30 строк) с 4-варианта rationale в `note-rsc-fix.md`. Это правильное долгосрочное решение, не временная заплатка.

---

## 3. What hurt

1. **RC-2 BLOCK на EMPTY-LIST-WIRING (#120)** — type-check OK, lint OK, format OK, Lighthouse OK, Playwright E2E OK, но runtime RSC border throws при `totalDocs > 0`. `CollectionListWithEmpty.tsx` пробрасывал полные Payload server props (включая `access: { create, read, update, delete, unlock }` функции) в client `<DefaultListView>` через spread без сериализации. Blog работал случайно (`totalDocs === 0` → ветка EmptyState не пыталась передать non-serializable). На проде Cases=4, Blog=5 — обе коллекции были бы 500 для оператора.
2. **Повторение pattern 2026-04-28 incident (RC-1 login empty page).** Это второй раз за неделю когда static analysis green, build OK, но runtime regression выходит на прод. Memory `feedback_leadqa_must_browser_smoke_before_push.md` была создана **именно для предотвращения такой ситуации** — но fe-panel при подготовке PR #120 не запустил local-browser smoke с реальной коллекцией где `totalDocs > 0`, только type-check + unit. Memory как организационное правило **недостаточно** — нужен tooling, который заставит проверить.
3. **Iron rule #4 (PO local-verify перед merge) формально соблюдён, фактически — нет.** popanel approved #120 на основании spec-conformance + green CI, без real-browser smoke сценария «коллекция с 1+ doc». Сам по себе iron rule корректен; проблема в том, что для RSC-components scope «local-verify» не был операционализирован — popanel не знал что для этого класса компонентов нужно проверять не только пустую ветку.
4. **RC-2 → RC-3 cycle стоил ~1.5-2 часа wasted execution.** Время оператора + leadqa + fe-panel + cr-panel на BLOCK-discovery + diagnosis + fix + re-test. Preventable, если pre-PR local browser-smoke было бы обязательным для RSC-touch'нутых components. Memory есть → нужен hook/lint, который её принуждает.

---

## 4. Lessons + tooling proposals

### L1 — Iron rule #4 нужно операционализировать для RSC-scope

popanel must verify EmptyState wiring и любые server/client component boundaries **в real browser** с **non-empty data**, не только spec-conformance + type-check. Add to `team/panel/popanel.md`:

> Для PR-ов fe-panel/be-panel, затрагивающих RSC components (`use client` boundary, server props pass-through, `<DefaultListView>` / Payload custom views) — обязательная local browser-smoke сценарий «коллекция с totalDocs > 0» + console.error check ДО approve. Type-check недостаточно — RSC errors часто runtime-only.

**Owner:** popanel (sa-panel.md template update + DoD checklist).
**ETA:** at-rest sprint.

### L2 — ADR proposal: RSC-border lint (server props serializability)

Tamd evaluation needed: возможно ли eslint rule / TypeScript strict-mode flag, которое ловит spread server-props в client component? React 19 / Next.js 16 имеют warning'и в dev-mode, но они доступны только в браузере, не в CI. Возможные направления:

- `eslint-plugin-react-server-components` — есть базовый детектор function-prop pass-through.
- Custom AST rule для ECC-stack: запретить `{...listProps}` в JSX где target имеет `'use client'` directive в файле import-source.
- CI gate в Playwright E2E: smoke на каждой коллекции с `totalDocs > 0` (1 fixture row) + assert на `console.error` count.

**Owner:** tamd (ADR draft) + cr-panel (RFC review).
**ETA:** 2-3 чд (исследование + ADR + если зелёный сигнал — реализация в do CI).

### L3 — Memory недостаточно как gate, нужен tooling/hook

`feedback_leadqa_must_browser_smoke_before_push.md` (2026-04-28) была написана именно для предотвращения этого класса bug'ов. Memory как организационное правило сработала для leadqa (он сделал real-browser smoke и поймал #120 в RC-2), но не сработала для fe-panel при подготовке PR #120 (он не запускал local browser-smoke с непустой коллекцией). Это структурный gap: leadqa — single point of truth для browser verification, но он включается в gate-фазе, когда поздно.

**Решение:** перенести часть browser-smoke ответственности на pre-PR phase через tooling:

- Pre-commit / pre-push hook для fe-panel/be-panel веток: автоматический запуск Playwright smoke на 3-5 critical routes перед `git push`.
- CI step «smoke against ephemeral preview» — в дополнение к type-check + lint + Lighthouse.
- Документировать pattern в `team/panel/sa-panel.md` template как DoD требование для RSC components.

**Owner:** do (tooling) + tamd (CI gate ADR) + popanel (DoD enforcement).
**ETA:** при работе над L2 ADR.

---

## 5. Follow-up cards (для popanel в backlog)

### PANEL-RSC-LINT (`later`, M = S, RICE pending tamd ADR eval)

Lint / static analysis rule, ловящая spread server-props в client-component через RSC border. ADR-evaluation через tamd, потом возможно lint-rule + CI gate. Превентивный, должен исключить повторение `#120 → #122 hotfix`.

- **Reach:** 3 (каждый раз когда panel/product/shop трогает Payload custom views или RSC boundary)
- **Impact:** 4 (предотвращает runtime regression на проде)
- **Confidence:** 0.5 (зависит от того, существует ли подходящий lint-rule и насколько устойчиво его поведение)
- **Effort:** ADR 1 чд + реализация tbd
- **MoSCoW:** S
- **Owner:** tamd (ADR) + cr-panel (review) + do (если CI-gate)

### PANEL-AXE-PAYLOAD-CORE-A11Y (`later`, M = S, RICE 16.8)

В `leadqa-RC-3-hotfix.md` зафиксирована 1 critical violation (4 nodes) — Payload native row-checkbox `<input type="checkbox" id="_R_…" class="checkbox-input__input">` без `aria-label`. Это **Payload core debt** (не введён US-12, существует во всех list-views). Аналогично в leadqa-RC-2 baseline были label / color-contrast / aria-hidden-focus violations в Payload native widgets. Варианты:

- Upstream PR в Payload 3 (`payloadcms/payload`) — добавить `aria-label="Выбрать строку"` к row-checkbox.
- Local CSS / DOM override через `custom.scss` или Payload component slot.
- Принять как baseline и зафиксировать в ADR.

- **Reach:** 3 (каждый list-view оператора)
- **Impact:** 4 (a11y AA нарушение, 4 nodes на коллекцию)
- **Confidence:** 0.7
- **Effort:** 0.5 чд (если local override) или 2-3 чд (upstream PR + waiting for merge)
- **RICE:** 3 × 4 × 0.7 / 0.5 = **16.8**
- **MoSCoW:** S
- **Owner:** ux-panel (decision: upstream vs local) + fe-panel (impl) + cr-panel (review)

Оба — **Should** priority, не Must. US-12 закрыт, оператор не блокирован.

---

## 6. Метрики closure

| Метрика | Значение |
|---|---|
| **Total PR shipped** | 13 (12 RC-2 + 1 hotfix) |
| **RC циклов** | 3 (RC-1 phase B, RC-2 cumulative, RC-3 hotfix) |
| **BLOCK incidents** | 1 (RC-2 #120 RSC border) |
| **Hotfix delivery time** | ~32 минуты (BLOCK 13:36 → hotfix merged 14:08 UTC) |
| **Total cycle time RC-2** | ~6 часов (deploy 09:55 → APPROVE 11:01 UTC) |
| **Operator interventions** | 0 для штатных переходов; 1 для approve RC-3 hotfix (по iron rule #6) |
| **Memory triggered** | `feedback_leadqa_must_browser_smoke_before_push.md` сработал в leadqa, не сработал в fe-panel pre-PR |

---

## 7. Hand-off log

| Когда | Кто | Что |
|---|---|---|
| 2026-05-01 11:16 UTC | cpo → popanel | US-12 closed, retro published, 2 follow-ups (PANEL-RSC-LINT + PANEL-AXE-PAYLOAD-CORE-A11Y) добавлены в panel/Later, 3 spec'а (LEADS-INBOX + AUTH-2FA + PERSONS-RENAME) сняты с `dev-blocked-by-us-12-release` → `dev-ready`. Готов к autonomous dispatch на usual cadence. |
