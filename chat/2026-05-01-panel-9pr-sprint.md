# 2026-05-01 · panel · 9 PR sprint (operator 3 pins + ux audit follow-ups)

**Длительность:** ~4-5 часов wall-clock (sticky session: `popanel`)
**Основная роль:** popanel
**Подключённые subagents:** ux-panel · sa-panel ×3 · art · fe-panel + qa-panel ×4 · fe-site · cr-panel + cr-site + do
**Контекст старта:** post-merge PANEL-LIST-CREATE-AMBER (PR #111), US-12 admin redesign закрыт в main (`9cc702f`), ждёт deploy → leadqa → operator → do.

---

## Summary

Оператор задал **3 точечных нарекания на скриншотах** `/admin` (favicon чёрный круг с белым треугольником = дефолтный Next.js Vercel ▲, breadcrumb «О» кривовата, отсутствует переключатель тёмной темы и иконка домика) + просил подключить **ux-panel** для usability аудита всей панели.

Реализовано **9 PR за сессию** через многоэтапный pipeline (intake → spec → dev → CI → merge), с использованием sticky-роли `popanel` + delegation в subagents. Все 3 пина оператора закрыты, плюс закрыты 4 P0/P1 follow-up'а из ux-panel audit, плюс 1 bug fix spotted by SERVICES-PREVIEW-TAB dev.

Iron rules соблюдены: spec-before-code (все 6 code PR имели approved sa-panel.md или intake), design-system awareness (каждое UI решение мапилось на §-секцию brand-guide.html), PO local-verify pre-push (type-check + lint + format:check), do owns merges при зелёном CI, PO orchestration (#7 — самостоятельная передача между фазами без эскалации к оператору).

---

## Operator raw quotes (ключевые)

> «да закрываем us 12 параллельно делаем остальные задачи по приоритету + обрати внимание что favicon сейчас не тот - на всех страницах сайта перероверить (в панели щас черный круг с белым треугольником) + я бы добавил переключатель темной темы кнопку в личный кабинет /admin (но пока сделаем ее не рабочей, позже привяжем логику) + на скриншоте я показываю икноку в красном прямоугольнике как будто она кривовата (проверить не съехала ли она) + я бы добавил куда то где показывает красная стрелочка на скрине в панели иконку домика которая бы вовзращала на главную страницу. подключи к задаче ux (для лучшего опыта использования панели)»

> «работаем да как ты предлагаешь»

> «a - иди по PO defaults / в - запускай sa-panel для sa-panel-header-chrome.md / c - следом popanel поручает задачу art, art ее делает и передает popanel, далее это поручается команде внедрить (кто сделаем на усмотрение popanel). оператор ждет результат»

> «вариант 2» (на «как мерджим — single PR / split / your way»)

> «подключить do для merge при зелёном CI или продолжить парсить P0 follow-ups в new spec'и»

> «делаем по порядку» (на A/B/C/D финальный chain)

---

## Final decisions (chronological)

1. **Декомпозиция операторских пинов в 4 US** (popanel decision):
   - PANEL-FAVICON-BRAND (P0, RICE 38) — favicon visible удар по brand perception
   - PANEL-UX-AUDIT (process M) — single source для UX findings
   - PANEL-HEADER-CHROME-POLISH (RICE 8.5) — 3 пина в одну волну (тематически header)
   - + параллельный PANEL-LEADS-INBOX spec (RICE 11.25, не часть пинов, но top backlog)

2. **§3 deviation от PO recommendation в FAVICON-BRAND** (art decision, popanel approve post-fact):
   - PO рекомендовал «зелёный круг + белая „О"», art применил §3 master lockup (скруглённый квадрат + кремовая «О»). **Iron rule design-system awareness > PO recommendation** — корректное поведение.

3. **PO defaults для всех 8 INBOX Q's** (popanel decision):
   - Q1 spam pill: серый `--c-muted` (spam ≠ ошибка)
   - Q2: `in_amocrm → contacted` объединить (amoCRM = US-13, не workflow-status)
   - Q3: ⋯-dropdown per-row (discoverability > компактность)
   - Q4-Q8: sa-panel defaults

4. **Native Payload slots для HEADER-CHROME-POLISH** (sa-panel insight):
   - `beforeNavLinks` для home-icon, `settingsMenu` для dark-toggle, CSS-only fix для breadcrumb «О». ADR не требуется. ~180 строк CSS + 3 React components.

5. **Разделение на 3 PR (вариант 2, оператор approved)**:
   - #112 feat (FAVICON code) / #113 docs specs / #114 docs backlog. Focused review-cost.

6. **Тест-guard sync W9 → PANEL-FAVICON-BRAND** (do/cr block + popanel fix):
   - PR #112 заблокирован Playwright `admin-design-compliance.spec.ts:456` (W9 era guard под старую конфигурацию `image/png` + `/icon.png`). Fix 1 файл / 5 строк / 1 commit, re-CI зелёный, re-merge.

7. **Real-truth corrections от subagents** (3 случая):
   - SERVICES-PREVIEW-TAB: `?_draft=1` route не существует → applied **signed preview API** (`/api/preview-sign` + `/api/preview` с `draftMode()`); реальный URL `/<slug>/`, не `/uslugi/<slug>/`. Это сильнее aspirational spec.
   - A11Y-TARGET-SIZE: aspirational селекторы из spec (`cell-actions`, `row-actions`, `thumbnail-action`) НЕ существуют в Payload 3.84 — реальный target `.popup-button` + `.checkbox-input`.
   - HEADER-CHROME-POLISH: `settingsMenu` API verified в `@payloadcms/next` source — fallback Plan B на `afterNavLinks` не понадобился.

8. **`art` cross-team trigger через `cpo`** (правильный flow):
   - popanel поднял через `note-cpo.md` → `art` подхватил через subagent → sign-off в `note-art.md`.

---

## Созданные / изменённые артефакты

### 9 PR на main

| # | Commit | Тип | Файлы | Описание |
|---|---|---|---:|---|
| 112 | `71ff97d` | feat | 15 | PANEL-FAVICON-BRAND — бренд-favicon §3 master lockup |
| 113 | `3f14f96` | docs | 6 | specs UX-AUDIT + LEADS-INBOX + HEADER-CHROME-POLISH |
| 114 | `966370a` | docs | 1 | backlog refresh — 3 new US.next + 4 new US.later |
| 115 | `232efed` | fix | 2 | A11Y-TARGET-SIZE — row-actions ≥44×44 + axe re-enable |
| 116 | `229f909` | feat | 4 | SERVICES-PREVIEW-TAB Phase 1 — Превью tab + signed preview API |
| 117 | `10443c8` | feat | 6 | HEADER-CHROME-POLISH — home-icon + dark-toggle + breadcrumb «О» |
| 118 | `af6f625` | docs | 9 | pending specs (4 mini-spec + cr-review note) |
| 119 | `aef1410` | fix | 1 | DRAFT-PREVIEW-ROUTE — `/uslugi/*` → `/<slug>/*` |
| 120 | `d8bf1f8` | feat | 5 | EMPTY-LIST-WIRING — Cases + Blog list-view EmptyState |

**Total LOC delta:** ~+3500 LOC (specs) + ~+700 LOC (code) + ~-30 LOC (orphan removed)

### Specs созданы и в main

- `specs/PANEL-FAVICON-BRAND/{intake,note-cpo,note-art,note-fe-wiring,note-merge-2026-05-01}.md`
- `specs/PANEL-UX-AUDIT/{intake,note-uxpanel}.md` (note 353 строки, 12 P0 / 18 P1 / 15 P2)
- `specs/PANEL-LEADS-INBOX/{intake,sa-panel}.md` (sa-panel 490 строк, 8 PO decisions)
- `specs/PANEL-HEADER-CHROME-POLISH/{intake,sa-panel-header-chrome}.md` (562 строки)
- `specs/PANEL-A11Y-TARGET-SIZE/{intake,sa-panel}.md`
- `specs/PANEL-SERVICES-PREVIEW-TAB/{intake,sa-panel}.md`
- `specs/PANEL-EMPTY-LIST-WIRING/{intake,sa-panel}.md`
- `specs/PANEL-SITECHROME-RESTRUCTURE/{intake,sa-panel}.md`

### Code на main (по файлам)

- `site/app/(payload)/custom.scss` — добавлено WAVE 10 § A (breadcrumb fix) + §B (home-link styles) + §C (theme-toggle styles) + WCAG 2.5.5 row-actions section (~+200 строк всего)
- `site/components/admin/NavHomeLink.tsx` — new
- `site/components/admin/ThemeToggleStub.tsx` — new
- `site/components/admin/ServicePreviewPanel.tsx` — new
- `site/components/admin/CollectionListWithEmpty.tsx` — new
- `site/collections/Services.ts` — tab merge «Связи» → «Sub-услуги» + new tab «Превью»
- `site/collections/Cases.ts` + `Blog.ts` — `views.list.Component` registration
- `site/payload.config.ts` — admin.meta.icons sync + 2 new slots (`beforeNavLinks`, `settingsMenu`)
- `site/app/(marketing)/layout.tsx` — metadata.icons + manifest
- `site/app/(payload)/admin/importMap.js` — manual entries (per ADR-0009)
- `site/app/favicon.ico` — replaced (бренд multi-res 16/32/48)
- `site/public/{favicon.svg, apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest}` — new
- `site/lib/admin/preview-routes.ts` — `/uslugi/*` → `/<slug>/*` fix
- `site/tests/e2e/admin-{a11y, design-compliance, services-preview, header-chrome-polish, empty-list-wiring}.spec.ts` — re-enabled axe target-size + 4 new test files
- `scripts/generate-favicons.mjs` — new (sharp pipeline)
- **Removed:** `site/app/{icon, apple-icon}.png` (US-3 orphan, перекрывали metadata через Next.js auto-convention)

### team/backlog.md изменения (через PR #114)

- panel.next пересобран (5 строк parallel-волна)
- panel.later: +4 new US (A11Y-TARGET-SIZE / SERVICES-PREVIEW-TAB / EMPTY-LIST-WIRING / SITECHROME-RESTRUCTURE)
- last_update: 2026-05-01

---

## Open follow-ups

### Pending dev (specs готовы)

1. **PANEL-LEADS-INBOX** (RICE 11.25, M, 2 чд) — ждёт `tamd` Q2 enum review (vs US-13 amoCRM) + `dba` migration plan review (3 миграции + jsonb `statusHistory`).
2. **PANEL-SITECHROME-RESTRUCTURE** (RICE 4.2, C, 1.5 чд) — ждёт popanel approve.
3. **ADR-0010 supplement** (от tamd) — формальное закрытие Альтернативы 1 scoped pattern (закрыто частично через PR #120).

### Pending deploy chain (по iron rule #6)

5 code PR на main, не deployed:
- #112 FAVICON-BRAND
- #115 A11Y-TARGET-SIZE
- #116 SERVICES-PREVIEW-TAB
- #117 HEADER-CHROME-POLISH
- #119 DRAFT-PREVIEW-ROUTE
- #120 EMPTY-LIST-WIRING

Plus US-12 release closure (`9cc702f`) ждёт RC-2.

Path: `release` пишет RC-2 (compendium 6 PR + W6/W7/W8/W9) → `leadqa` real-browser smoke на staging (особенно: Pin-1/2/3 manual verify + favicon в tab + apple-touch home-screen + axe target-size pass) → operator approve → `do` deploy.

### Spotted issues (не блокеры)

- **leadqa должен real-device smoke** — особенно Pin-3 dark-toggle visibility в `settingsMenu` gear-popup на конкретной версии Payload 3.84+ (если slot rendering изменился — fallback Plan B на `afterNavLinks` готов).
- **EMPTY-LIST-WIRING e2e** — graceful-skip при наличии seed-data в Cases/Blog. CI ephemeral postgres работает; local dev может потребовать temp cleanup.
- **PANEL-DRAFT-PREVIEW-ROUTE follow-up:** `ServicePreviewPanel.tsx:27` имеет doc-комментарий с упоминанием bug — оставлен как историческая справка (вне scope #119, в #116 уже).

---

## Subagent stats (per session telemetry)

| Subagent | Calls | Total tokens (approx) | Total wall-time |
|---|---:|---:|---:|
| ux-panel | 1 | 187k | 6m |
| sa-panel | 3 | 110k + 152k + 107k | ~6m + 6m + 6m |
| art | 1 | 74k | 2m51s |
| fe-panel + qa-panel (combined) | 4 | ~430k total | ~13m total |
| fe-site (single) | 1 | 59k | 1m44s |
| cr-panel + cr-site + do (combined) | 1 | 95k | 3m6s |

Итого ~1.2M tokens delegation overhead, экономия parent-context'а — high.

---

## Iron rules — соблюдено

- **#1 Skill-check** — каждый subagent активировал skills через Skill tool + фиксировал в frontmatter
- **#2 Spec-before-code** — все 6 code PR имели sa-panel.md или intake approved до dev
- **#3 Design-system awareness** — каждая UI правка мапилась на §-секцию brand-guide.html
- **#4 PO local-verify** — popanel local CI green pre-push для каждого PR
- **#5 do owns green CI before merge** — все merges через `gh pr merge --squash` после CI зелёного
- **#6 Release gate** — НЕТ deploy в этой сессии, всё ждёт `release` + `leadqa` + operator approve
- **#7 PO orchestration** — popanel самостоятельно подключал агентов без эскалации к оператору (только cross-team в `art` через `cpo` trigger note)

---

## Связанные источники

- [team/backlog.md panel секция](../team/backlog.md) — обновлена через PR #114
- [.claude/memory/handoff.md](../.claude/memory/handoff.md) — короткий статус (требует update)
- [specs/PANEL-UX-AUDIT/note-uxpanel.md](../specs/PANEL-UX-AUDIT/note-uxpanel.md) — full UX audit findings
- [specs/PANEL-FAVICON-BRAND/note-merge-2026-05-01.md](../specs/PANEL-FAVICON-BRAND/note-merge-2026-05-01.md) — cr/do merge audit (первый do-cycle)
