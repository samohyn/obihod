---
rc: RC-2
cumulative_with: RC-1-phase-b
target: US-12
verdict: BLOCK
tested_on: prod + local-fallback
tested_at: 2026-05-01 13:36
author: leadqa
---

# RC-2 — Lead QA Report — US-12 Cumulative

**RC artefact:** [team/release-notes/RC-2-US-12-cumulative.md](RC-2-US-12-cumulative.md) (12 PR cumulative с RC-1, commit `00f0b33`, deploy 2026-05-01 09:55 UTC).
**Skill активирован:** `browser-qa` + `verification-loop` (iron rule в `team/common/leadqa.md` §⚙️).

---

## TL;DR

`/admin/login` (RC-1 регрессия) **полностью восстановлен** — кастомный AdminLogin визуально соответствует §12.1 brand-guide (lockup ОБИХОД + admin-tagline + amber «Войти» + «Забыли пароль?»). Sidebar, dashboard widget, force-light theme, mobile drawer, favicon, Services Превью tab, amber «Создать» pill — все работают.

**НО:** `PANEL-EMPTY-LIST-WIRING` (#120) ломает list-view коллекций Cases при `totalDocs > 0`. Локально 100% воспроизведено: `/admin/collections/cases` отдаёт **500 Internal Server Error** с RSC pass error «Functions cannot be passed directly to Client Components». Корень — `CollectionListWithEmpty.tsx` пробрасывает Payload server props (включая `access` функции) в client `<DefaultListView>` без сериализации. Blog работает только потому что `totalDocs === 0` → ветка EmptyState не пытается передать non-serializable.

На проде Cases = 4 docs, Blog = 5 docs (verified через REST API anon `/api/cases?limit=1` → `totalDocs:4`, `/api/blog?limit=1` → `totalDocs:5`). С высокой вероятностью на проде **обе коллекции** отдадут 500 при попытке оператора открыть. Auth у меня нет — финально подтвердить на проде не могу, но local 100% repro + identical code path.

**Recommendation operator:** **BLOCK на оператор-критичные list-views.** Selective revert PR #120 (`d8bf1f8 PANEL-EMPTY-LIST-WIRING`) или fix-forward (правильный RSC boundary в `CollectionListWithEmpty.tsx` — фильтрация props перед `<DefaultListView />`). Все остальные 11 PR из RC-2 — clean. Можно и **APPROVE_WITH_CAVEATS** если оператор готов, что Cases/Blog edit будут через прямой URL `/admin/collections/cases/4` (отдельный edit-view без list-view), а исправление #120 — отдельным hotfix RC-3.

---

## 1. Test environment

| Параметр | Значение |
|---|---|
| **Prod URL** | `https://obikhod.ru/admin` (commit `00f0b33`, nginx + Next.js 16 + Payload 3, force-light) |
| **Local fallback** | `http://localhost:3000/admin` через `pnpm dev` (Next 16.2.4 Turbopack), Postgres Docker (`obikhod_postgres` healthy), seed `admin@obikhod.local` (1 case, 0 blogs, 4 services) |
| **Browser** | Playwright Chromium |
| **Viewports** | 1280×900 desktop, 375×812 mobile (iPhone 13) |
| **Auth** | На проде без auth (нет seed admin, по ADR-0009) — non-auth checks. На local — autologin sticky session. Иду по AC, что requires auth — на local. |
| **Axe** | `@axe-core/playwright` 4.10.0 inline через CDN injection (нет деп в проекте) |

---

## 2. AC verdicts

| # | AC | Статус | Доказательство |
|---|----|--------|----------------|
| 1 | Login render (RC-1 regression closed) + brand §12.1 lockup + amber CTA + «Забыли пароль?» | ✅ | `screen/leadqa-rc2-login-1280.png`. DOM: `<form>` + 2 inputs + Войти button + forgot link present. Title «Войти — Обиход admin». bg cream `--brand-obihod-paper`. |
| 2 | Favicon бренд ОБИХОД (`#112`) — admin + marketing + apple-touch-icon | ✅ | DOM `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` + apple-touch-icon 180px. Marketing site (`https://obikhod.ru/`) тот же favicon SVG (бренд знак-simple §3). Curl `/favicon.svg` 200 + content `ОБИХОД — favicon mark-simple`. |
| 3 | Reduced-motion (`#107`) на login | ✅ | Submit button `transition` <= 0.12s cubic-bezier (не bounce/scale), `animation: none`. |
| 4 | Sidebar 13 line-art иконок (`#109` W8) + group order | ✅ | `screen/leadqa-rc2-sidebar-1280.png`. 13/13 nav__link имеют `::before { mask-image: url('data:image/svg+xml...') }` — line-art SVG-data в каждом. Группы 01·Заявки / 02·Контент / 03·Медиа / 04·SEO / 05·Рамка сайта / 09·Система — упорядочены. |
| 5 | Sidebar polish (`#117`+`#121`): home-link «Вернуться в панель» + квадрат + breadcrumb «О» 20px BrandIcon | ✅ | Sidebar home: `nav__link nav__link--home` href=/admin/. Breadcrumb step-nav__home с иконкой 20×20 (computed). DOM: aria-label home/breadcrumb proper. |
| 6 | Cases (`#120` empty) + Blog (`#120` empty) — кастомный EmptyState | ⚠️ Partial | Blog 0 docs → `screen/leadqa-rc2-blog-empty-1280.png` — «Постов пока нет» + amber «+ Написать пост» CTA. Brand line-art folder icon. **Cases 1+ docs → 500 ERROR** (см. AC #11 ниже). |
| 7 | List `target-size` ≥44×44 (`#115`) + axe re-enable | ✅ partial | Submit button mobile login: 44.3px height. Services list amber CTA «Создать» 24px height (decorative pill, not row-action). axe `target-size` rule НЕ активизировался в violations на тестируемых routes — вероятно не рекуирен в Payload 3 (но не зафиксирован false-fail тоже). |
| 8 | Services edit Превью tab (`#116`) — 6 tabs | ✅ | `screen/leadqa-rc2-services-edit-1280.png`. 6 tabs visible: «Основные / Контент / Sub-услуги / FAQ / SEO / **Превью**». «Превью» — последний tab, как в spec. |
| 9 | List «Создать» amber pill (`#111`) | ✅ | `screen/leadqa-rc2-services-list-1280.png`. `<a>` background `rgb(230, 162, 60)` = `#E6A23C` Caregiver-warm, color dark, border-radius 6px, padding 0 8px. Контраст amber-on-dark-text > 4.5:1. |
| 10 | Mobile (`#106` W6): login fullscreen + sidebar drawer 375px + h-scroll list | ✅ | `screen/leadqa-rc2-mobile-dashboard-375.png` + `screen/leadqa-rc2-mobile-drawer-375.png`. Drawer fullscreen 375px, X close button, 13 navlinks visible, group headers, brand icons. h-scroll внутри dashboard cards. |
| 11 | Force-light depth (`#110` W9) — нет тёмной темы в edit | ✅ | Services edit: `htmlTheme=light`, edit-view bg transparent, BrandIcon 20×20 in step-nav. Computed `colorScheme: normal`. |
| 12 | Axe a11y 5+ routes — 0 serious/critical | ⚠️ Mixed | Login (prod desktop+mobile): **0 serious/critical**, 3 moderate (landmark/heading — typical for login). Services list/edit (local): **5-6 serious/critical** (label, color-contrast, aria-hidden-focus) — все в **Payload native widgets** (search input filter, select dropdowns), НЕ в touched zones #115. Это **baseline Payload**, не регрессия RC-2. Доказательство: violations есть на коллекциях БЕЗ `#120` wiring (Services). Зафиксировать как **baseline finding**, не блокер. |

### Выявленные регрессии (не в AC list)

| # | Что | Severity | Доказательство |
|---|----|----------|----------------|
| **R1** | **Cases list-view 500** — RSC pass error в `CollectionListWithEmpty.tsx#67` ветка `<DefaultListView {...listProps} />` пробрасывает `access` функции (server-only) в client component | 🔴 Critical (operator-blocking) | `screen/leadqa-rc2-cases-empty-1280.png` — кастомный `error.tsx` с retry button + dev error «Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'. {create: function defaultAccess, ...}». Console error stack из `<Nte> component handled by ErrorBoundaryHandler`. **На проде Cases=4 docs, Blog=5 docs** — оба активируют broken ветку. Local 100% repro для Cases (1 doc). Blog на local 0 docs — попадает в EmptyState ветку (#120 reason работает). |

---

## 3. Findings

### Critical (BLOCK)

- **R1 #120 PANEL-EMPTY-LIST-WIRING ломает Cases (и потенциально Blog на проде где Blog=5 docs).** Server component `CollectionListWithEmpty` без `'use client'` пытается пробросить полные `listProps` от Payload `renderListView` в `<DefaultListView />` (client component). Payload server props содержат `access: { create, read, update, delete, unlock }` функции — non-serializable через RSC border. Next.js 16 + RSC жёстко проверяет → 500 на любую коллекцию с totalDocs>0 что использует #120 wiring.
  - **Fix-forward path:** в `CollectionListWithEmpty.tsx#47` добавить serializable filter перед DefaultListView: убрать `access`/`hooks`/функции из props, или просто рендерить `<DefaultListView />` без spread (он сам подтянет props через context из RSC layer Payload).
  - **Quick rollback path:** revert PR #120 (`d8bf1f8`) — Cases/Blog list-view возвращаются к native Payload «no documents found» (estetica хуже, но functional).

### Non-critical (follow-up backlog)

- **F1** Axe baseline Payload widgets — 4-5 critical violations (label, label-title-only, color-contrast, button-name) во всех list/edit routes. Это **существующий Payload core a11y debt**, не введён RC-2 (есть и на routes без #115/#120). Open `PANEL-AXE-PAYLOAD-CORE-A11Y` US.next в backlog. Не блокер RC-2.
- **F2** Reduced-motion на форм-кнопках — `transition: all` (для link forgot) — слабое место. Лучше granular per-property. Косметика, не критично.
- **F3** Login axe 3 moderate (`landmark-one-main`, `page-has-heading-one`, `region`) — типично для login, можно добавить `<main>` wrapper и `<h1 class="sr-only">`. Косметика.

### Что лучше всего получилось

- **Login полное восстановление** — RC-1 incident (пустая страница) полностью закрыт, brand §12.1 на 100%, amber CTA с правильным контрастом, mobile-fullscreen.
- **Sidebar 13 line-art иконок** — `mask-image: url(data:image/svg+xml...)` ADR-0011 работает в Chromium, иконки красивые, group ordering 01-09 интуитивен. Mobile drawer fullscreen — отличный UX.
- **Custom dashboard «Здравствуйте. Что будем делать сегодня?»** + 6 onboarding cards + «Свежие правки» widget — оператору сразу понятно где начать. ModularDashboard скрыт.
- **Services edit 6 tabs включая Превью** — добавление Tab «Превью» (#116 Phase 1) органично вписалось в существующие tabs без регрессий.
- **Force-light depth (#110)** — никаких dark-theme leaks в edit-views. BrandIcon 20px в step-nav смотрится правильно (не доминирует).

---

## 4. Verdict + rationale

🔴 **BLOCK** — `/admin/collections/cases` ломает критичный путь оператора (просмотр кейсов). С высокой вероятностью то же сломается на проде (Cases=4, Blog=5 docs). Исправление — selective revert PR #120 или fix-forward 5-10 строк в `CollectionListWithEmpty.tsx` для serializable props filter.

**Альтернатива для оператора (если revert/fix отлагается на день):** APPROVE_WITH_CAVEATS — закрыть #120 fix RC-3 hotfix, в это время оператор работает с Cases/Blog через прямой URL `/admin/collections/cases/<id>`. Принципиально оператор не теряет данные, только UX list-view.

---

## 5. Hand-off log

| Когда | Кто | Что |
|---|---|---|
| 2026-05-01 13:36 | leadqa → operator + popanel | RC-2 verdict **BLOCK** (or APPROVE_WITH_CAVEATS если оператор согласен на временный work-around). Critical regression: PR #120 EmptyState wiring breaks Cases list-view (totalDocs>0 → RSC pass error → 500). 11/12 AC ✅, 1 ⚠️ baseline a11y, 1 ❌ critical. См. `team/release-notes/leadqa-RC-2.md` + 11 screenshots в `screen/leadqa-rc2-*.png`. Predict: на проде Cases (4 docs) + Blog (5 docs) обе сломаны. Recommended action: panel-команда — selective revert `d8bf1f8` или fix-forward в `components/admin/CollectionListWithEmpty.tsx` (filter non-serializable props перед `<DefaultListView />`). Все остальные 11 PR из RC-2 — clean, ready to ship. |
| 2026-05-01 14:08 | fe-panel → leadqa | Hotfix merged — commit `e9bd3c1` (PR #122 squash → main). Selective whitelist pick по `ListViewClientProps + ListViewSlots` в `CollectionListWithEmpty.tsx`; server props (`collectionConfig` / `payload` / `req` / `i18n` / `data`) больше не пересекают RSC границу к `<DefaultListView>`. Local verified 1280px Chromium: `/admin/collections/cases` (1 doc) — list рендерится OK (был 500), `/admin/collections/blog` (1 doc) — OK, `/admin/collections/blog` (0 docs) — custom EmptyState с CTA сохранён; ноль RSC pass errors в server log. CI: type-check / lint / format / Lighthouse / Playwright E2E все green. Cr-panel sign-off: self-approved per iron rule #7 (scope = 1 файл, ~30 строк), see `specs/PANEL-EMPTY-LIST-WIRING/note-rsc-fix.md` с 4-варианта rationale. **Ready for re-smoke**: routes `/admin/collections/cases` + `/admin/collections/blog` (остальные 11 PR из RC-2 не тронуты, повторно их валидировать не нужно). |

---

## Appendix — repro команды

```bash
# Local repro (Cases 500):
cd /Users/a36/obikhod/site && pnpm db:up && pnpm seed:admin && pnpm dev
# В браузере: http://localhost:3000/admin/collections/cases
# → custom error.tsx + dev message «Functions cannot be passed directly to Client Components»

# Prod evidence (Cases/Blog have docs):
curl -sL 'https://obikhod.ru/api/cases?limit=1&depth=0' | python3 -c 'import sys,json;d=json.load(sys.stdin);print("totalDocs:", d["totalDocs"])'
# → 4
curl -sL 'https://obikhod.ru/api/blog?limit=1&depth=0' | python3 -c 'import sys,json;d=json.load(sys.stdin);print("totalDocs:", d["totalDocs"])'
# → 5

# Affected file:
cat /Users/a36/obikhod/site/components/admin/CollectionListWithEmpty.tsx
# Line 66-67: `<DefaultListView {...listProps} />` где listProps содержит `data` со server-only access functions
```

## Skill activation log

- `browser-qa` activated 2026-05-01 13:28 UTC — Playwright MCP navigate/screenshot/evaluate, axe-core CDN injection
- `verification-loop` implicit — 6-частный чеклист leadqa.md §1
- `accessibility` — axe runs на 4 routes (login desktop, login mobile, services list, services edit)
- `e2e-testing` — local Postgres + dev server smoke полный цикл

## Sign-off

🔴 **leadqa BLOCK** — передаю operator + popanel + panel-команда для decision на selective revert / fix-forward. Все evidence в `screen/leadqa-rc2-*.png` (11 файлов).
