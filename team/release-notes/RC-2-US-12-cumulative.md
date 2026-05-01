---
rc: RC-2
cumulative_with: RC-1-phase-b
target: US-12
commit_sha: 00f0b33
deploy_status: deployed_2026-05-01_09:55
status: pending-leadqa
created: 2026-05-01
author: release
team: panel
---

# RC-2 — US-12 Admin Redesign — Cumulative (post RC-1)

**Cumulative:** RC-2 покрывает всё, что замержено в `main` после operator-approved RC-1 (`leadqa-RC-1-US-12-phase-b.md`, phase B). Содержит W6 → W7 → W8 → W9 + 8 panel-полировок 2026-04-30 / 2026-05-01.

**Окружение:** prod `https://obikhod.ru/admin` (308 → 200, nginx + Next.js 16 + Payload 3, force-light theme).
**Deploy:** автоматический GitHub Actions `deploy.yml`, последний success на `00f0b33` 2026-05-01 09:55 UTC.
**Статус:** `pending-leadqa` — ожидает real-browser smoke и operator approve по iron rule #6.

---

## 1. Scope (delta с RC-1, в порядке merge)

| PR | Commit | Что | Ключевые риски |
|---|---|---|---|
| [#106](https://github.com/samohyn/obihod/pull/106) | `d087a66` | US-12 W6 — Mobile responsive admin (login fullscreen, sidebar drawer, h-scroll, touch 44×44) | Mobile drawer state, touch-target regressions, viewport breakpoints |
| [#107](https://github.com/samohyn/obihod/pull/107) | `d68ad3e` | US-12 W7 — `@axe-core/playwright` + reduced-motion smoke + 5+ routes | a11y violations, animations при `prefers-reduced-motion` |
| [#109](https://github.com/samohyn/obihod/pull/109) | `9cc702f` | US-12 W8 — sidebar group order + 13 line-art иконок (CSS `mask-image`, ADR-0011) + hide ModularDashboard | `mask-image` browser support, sidebar IA |
| [#110](https://github.com/samohyn/obihod/pull/110) | `1458378` | US-12 W9 — force-light theme depth + BrandIcon 32→20 в step-nav + favicon meta | Тёмная тема внутри edit-view, breadcrumb визуал, favicon meta |
| [#111](https://github.com/samohyn/obihod/pull/111) | `a146b9c` | PANEL-LIST-CREATE-AMBER — list "Создать" pill amber primary CTA + reduced-motion | a11y contrast, focus-visible state |
| [#112](https://github.com/samohyn/obihod/pull/112) | `71ff97d` | PANEL-FAVICON-BRAND — бренд-favicon ОБИХОД (§3 master lockup) на весь периметр | Favicon в `/admin` + `/site`, apple-touch-icon |
| [#115](https://github.com/samohyn/obihod/pull/115) | `232efed` | PANEL-A11Y-TARGET-SIZE — row-actions ≥44×44 + axe `target-size` re-enable | WCAG 2.5.5 — был отключён в W7, теперь снова в check |
| [#116](https://github.com/samohyn/obihod/pull/116) | `229f909` | PANEL-SERVICES-PREVIEW-TAB — Tab «Превью» в Services edit-view (Phase 1) | Iframe loading, Services edit-view регресс |
| [#117](https://github.com/samohyn/obihod/pull/117) | `10443c8` | PANEL-HEADER-CHROME-POLISH — home-icon в sidebar + dark-toggle stub + breadcrumb «О» fix | 3 точки UI оператора в header/sidebar |
| [#119](https://github.com/samohyn/obihod/pull/119) | `aef1410` | PANEL-DRAFT-PREVIEW-ROUTE — draft preview URL sync | Draft mode roundtrip, токен валидации |
| [#120](https://github.com/samohyn/obihod/pull/120) | `d8bf1f8` | PANEL-EMPTY-LIST-WIRING — EmptyState wired в Cases + Blog list-view | EmptyState rendering при пустой коллекции |
| [#121](https://github.com/samohyn/obihod/pull/121) | `6230978` | PANEL-NAV-HOME-LINK-CLEANUP — sidebar квадрат + rename «Вернуться в панель» | Nav-link active state, hit area |

**Итого:** 12 PR, 4 wave-релиза US-12 (W6-W9) + 8 точечных полировок.

---

## 2. AC checklist для leadqa (real-browser smoke на проде)

Все проверки делаются на `https://obikhod.ru/admin`, авторизованным админом, в браузере Playwright Chromium (desktop 1280×900) + iPhone 13 emulation (390×844). Скриншоты класть в `screen/leadqa-RC-2-<zone>.png`.

### 2.1. Login (#112 favicon, baseline после RC-1)
- [ ] `/admin/login` рендерится (не пусто, регрессия RC-1 не повторилась)
- [ ] Lockup ОБИХОД + email + password + янтарная «Войти» visible
- [ ] Favicon в tab — бренд-лого ОБИХОД (#112), не дефолтный Payload
- [ ] `<link rel="apple-touch-icon">` ведёт на бренд-asset

### 2.2. Sidebar (#109 W8, #117, #121)
- [ ] Группы коллекций в правильном порядке (W8 sidebar IA)
- [ ] 13 line-art иконок отрисованы (CSS `mask-image`, ADR-0011) — НЕ квадратные плашки
- [ ] Иконки rendered в Chromium последней версии без fallback
- [ ] Home-icon в sidebar (#117) кликается → редиректит на `/admin`
- [ ] Sidebar квадрат (#121) — корректные размеры active state, без сдвигов
- [ ] Ссылка «Вернуться в панель» переименована (#121)
- [ ] ModularDashboard скрыт (#109), на dashboard виден кастомный widget «Свежие изменения»

### 2.3. List-view (#111 amber CTA, #115 a11y, #120 EmptyState)
- [ ] Кнопка «Создать» в любом list-view — amber pill primary CTA (#111)
- [ ] Контраст amber-on-white ≥4.5:1 (WCAG 1.4.3)
- [ ] Focus-visible на «Создать» при Tab navigation
- [ ] Row actions (edit/delete/duplicate) — touch target ≥44×44px (#115, WCAG 2.5.5)
- [ ] Cases list (пустая коллекция при свежем seed) → EmptyState (#120) с CTA «Создать»
- [ ] Blog list (пустая коллекция) → EmptyState (#120)

### 2.4. Edit-view (#110 W9, #116 Services Preview, #117 breadcrumb, #119 draft)
- [ ] Открытие любого Services document — нет тёмной темы внутри edit (#110 force-light)
- [ ] BrandIcon в step-nav рендерится размером 20px (#110), не 32px
- [ ] Breadcrumb отображает «О...» корректно (#117) — без обрезки и кракозябр
- [ ] Services edit-view: viден Tab «Превью» (#116, Phase 1)
- [ ] Tab «Превью» при клике загружает iframe без ошибок
- [ ] Draft preview button → URL `/api/draft-mode?...` корректно подписан (#119), возврат на same document

### 2.5. Mobile (#106 W6) — iPhone 13 / Pixel 5 emulation
- [ ] `/admin/login` fullscreen на mobile (без horizontal scroll)
- [ ] Sidebar превращается в drawer, hamburger button visible
- [ ] Drawer открывается/закрывается, overlay блокирует body scroll
- [ ] List-view rows — horizontal scroll внутри таблицы, не overflow всего viewport
- [ ] Touch-targets ≥44×44 на mobile

### 2.6. A11y axe routes (#107 W7, #115 target-size re-enable)
Прогнать `@axe-core/playwright` локально на `panel/integration` или прод-URL (logged-in cookie):
- [ ] `/admin/login` — 0 violations
- [ ] `/admin` (dashboard) — 0 violations
- [ ] `/admin/collections/services` (list) — 0 violations, включая `target-size`
- [ ] `/admin/collections/services/<id>` (edit) — 0 violations
- [ ] `/admin/collections/leads` (list, tabs) — 0 violations
- [ ] `target-size` rule **активен** (#115 re-enable) и проходит

### 2.7. Reduced-motion (#107, #111)
- [ ] OS toggle Reduce Motion ON → нет анимаций на сайдбаре, drawer, кнопках, transitions
- [ ] Pill «Создать» (#111) без bounce/scale при hover в reduced-motion
- [ ] Tabs переключаются без fade-анимации

### 2.8. Favicon (#112) — расширенный smoke
- [ ] `/admin/login` favicon = бренд ОБИХОД
- [ ] `/admin` (logged in) favicon = бренд ОБИХОД
- [ ] `/` (marketing site) favicon = бренд ОБИХОД (на весь периметр, не только admin)
- [ ] Apple touch icon (iOS Safari «Добавить на экран») — бренд lockup

---

## 3. Risk surface

| Зона | Риск | Mitigation / что проверить |
|---|---|---|
| **CSS `mask-image` (#109)** | Старые версии WebKit / Edge не поддерживают `mask-image: url()` без `-webkit-` префикса → 13 иконок отрендерятся как пустые квадраты | leadqa проверяет иконки в Chromium prod (текущая версия) + fallback в DevTools `Rendering → Emulate vision deficiencies / Disable -webkit- mask`. ADR-0011 декларирует `Chromium ≥ 120` — operator OK |
| **Force-light theme cascade (#110)** | Любой Payload-нативный компонент, ожидающий `--theme-*` токены тёмной темы, мог получить cream-fallback и сломать контраст (badges, tooltips) | leadqa визуально проверяет edit-view 3-х коллекций (Services / Leads / Blog), особенно секции с tabs, badges, validation toast |
| **Mobile drawer (#106)** | На viewport < 360px (старый Android) или > 768 < 1024 (планшеты) drawer может «застрять» open или overlap content | Пройти 3 viewport: 360×800 (Pixel 5 narrow), 768×1024 (iPad portrait), 1280×900 (desktop) |
| **Axe `target-size` re-enable (#115)** | Был disabled в W7 (#107) из-за false positives Payload native. Теперь снова active — может вылавливать violations в neighbour-views, не покрытых #115 | leadqa прогоняет axe на 5+ routes (см. §2.6). Если новые violations — фиксируем follow-up, не блокируем RC-2 если только в not-touched zones |
| **Favicon multi-zone (#112)** | apple-touch-icon, manifest.json, /admin /site — несколько точек подключения, один может остаться дефолтным | smoke 3 routes (login, admin, marketing) + DevTools Application → Manifest |
| **Draft preview roundtrip (#119)** | URL token sync — если draft mode не выходит обратно в normal, оператор остаётся в preview | leadqa открывает draft → выходит → проверяет что Services edit показывает live data |
| **EmptyState wiring (#120)** | Если коллекция НЕ пуста, EmptyState не должен рендериться → проверить что не overlapping реальный list | leadqa открывает list с 1+ записями (Services реальные данные) — list виден, EmptyState нет |
| **Sidebar nav state (#121)** | rename «Вернуться в панель» + квадрат размеры — мог сместиться active link indicator | hover/active Tab по 3 пунктам sidebar, проверить что active state visible |

---

## 4. Out-of-scope для RC-2 (НЕ проверять)

Эти позиции **не входят** в RC-2 — отдельные US, draft specs, или backlog. Если leadqa найдёт регрессию в этих зонах — это OK, не блокирует RC-2:

- **LEADS-INBOX** — отдельный US (spec в `specs/`, ещё не в dev)
- **AUTH-2FA / magic link** — Wave 2.B PAN-11, blocked, отдельный RC
- **PERSONS-RENAME** — отдельная US.next в backlog
- **SITECHROME draft** — spec написан (#118), но dev не стартовал
- **UX-AUDIT** — discovery-spec, не в коде
- **`/admin/catalog` full-page route** — Wave 3 part 2, отложено
- **DMARC SMTP setup** — Beget support ticket, не релиз-блокер
- **Per-collection EmptyState кроме Cases/Blog** — закрыто decision'ом popanel в US-12 phase-b
- **SkeletonTable / SkeletonForm** — dropped по ADR-0005 §3
- **CW admin.description audit** для остальных коллекций — Phase 1 закрыт #108, Phase 2 в backlog

---

## 5. Соответствие iron rules

| Rule | Статус |
|---|---|
| #1 Skill-check | release активирует `verification-loop` для составления RC-документа |
| #3 Design-system awareness | scope сверен с brand-guide §3 (favicon), §12 (admin), §1-14 (services TOV) |
| #5 do owns green CI | все 12 PR прошли CI зелёным до merge (master `00f0b33` is HEAD после `chore` post-merge) |
| #6 Release gate | RC-2 готов → ждёт `leadqa` → `operator` approve → `do` deploy-confirm. Deploy уже произошёл автоматически — operator approve превращается в **post-deploy validation gate**, не pre-deploy block |
| #7 PO orchestration | popanel ведёт hand-off, не запрашивает оператора для штатных переходов |

**Особенность RC-2:** deploy-after-merge уже case'нут автоматически workflow `deploy.yml` (как настроено в этом проекте). leadqa делает **post-deploy** real-browser smoke на проде — это ровно та схема, что описана в `feedback_leadqa_must_browser_smoke_before_push.md` (operator 2026-04-28). Operator approve = подтверждение что прод стабилен и можно закрыть US-12 wave fully.

---

## 6. Артефакты для leadqa

- Screenshots: класть в `screen/leadqa-RC-2-<zone>.png` (см. §2)
- Verify report: `team/release-notes/leadqa-RC-2-US-12-cumulative.md` (новый файл по конвенции `leadqa-<N>.md` из WORKFLOW §9.2)
- При BLOCK — указать конкретный PR и зону, не блокировать весь cumulative-release из-за единичной регрессии (можно selective revert)

---

## 7. Hand-off log

| Когда | Кто | Что |
|---|---|---|
| 2026-05-01 13:30 | release → leadqa | RC-2 ready for post-deploy real-browser smoke на https://obikhod.ru/admin (commit `00f0b33`, 12 PR cumulative с RC-1). AC checklist в §2, risk surface в §3, out-of-scope в §4. Verify report ожидается в `team/release-notes/leadqa-RC-2-US-12-cumulative.md`. |
