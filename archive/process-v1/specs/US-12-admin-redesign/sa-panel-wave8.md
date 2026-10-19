---
us: US-12
wave: 8
title: "Admin v2 prod alignment — sidebar order + icons + dashboard cleanup"
team: panel
po: popanel
type: feature
priority: P0
segment: admin
phase: dev
role: fe-panel
status: spec-approved (popanel autonomous-mode 2026-04-30, all Q-1..Q-5 closed)
blocks: [US-12 release]
blocked_by: []
related: [W1, W3, W5-part1, W7]
created: 2026-04-30
updated: 2026-04-30
---

# sa-panel — Wave 8 · Admin v2 prod alignment

**Issue:** PAN-NEXT (sa-panel назначит)
**Wave:** 8 — финальный prod-alignment перед US-12 release
**Source of truth:** [brand-guide.html §12.2 + §12.3](../../design-system/brand-guide.html) · [art-concept-v2.md §2-§3](art-concept-v2.md) · [ADR-0005](../../team/adr/ADR-0005-admin-customization-strategy.md)
**Status:** `draft` (popanel 2026-04-30, sa-panel finalize pending)
**Skills активированы (popanel):** `blueprint` (multi-step admin alignment), `product-capability` (capability gap audit)
**Author:** popanel
**Date:** 2026-04-30

---

## Контекст

US-12 формально закрыт после merge W1 + W2.A v2 + W3 + W4 (structural+CSS) + W5 part 1 + W6 + W7 в `main` (последние коммиты до cf8cd4e — 2026-04-30). Но **визуальная сверка prod /admin с brand-guide §12.2/§12.3 даёт 4 явных gap'а**, которые ни одна из W1-W7 not покрыла (sa-panel-wave7 проверял палитру/радиусы/lockup/widget, но не порядок sidebar / icons / cleanup default dashboard).

**Скрин оператора 2026-04-30** (1280×720, авторизованный admin, route `/admin`):
- Sidebar: группы идут **09 · Система → 03 · Медиа → 02 · Контент → 01 · Заявки → 04 · SEO → 05 · Рамка сайта** (нелогичный порядок).
- Sidebar links **без иконок** (brand-guide §12.2 lines 2993-3011 требует 13 line-art SVG 14×14 currentColor).
- Под `beforeDashboard` widget на странице `/admin` рендерится **дефолтный Payload-список групп с тёмными карточками "+"** — оператор называет это «дублированием бокового меню».
- Top-bar поиск (input.ad-search в mockup §12.2 line 3016) **отсутствует** — выносим в backlog.

Wave 8 закрывает эти 4 пункта через минимально-инвазивные изменения (perevorder коллекций + CSS-only layer + опц. custom Nav если ADR одобрит). Без этого release «оператор не вспомнит как старая выглядела» (note-popanel.md D-2026-04-30-03) **не работает** — старые остатки видны.

---

## ADR-0005 уровень кастомизации

| Подсистема | Уровень | Обоснование |
|---|---|---|
| Перепорядок `collections[]` в payload.config.ts | **Уровень 0** (config) | Без code/CSS изменений, просто массив. |
| Hide default dashboard group cards | **Уровень 1** (custom.scss) | CSS rule `.dashboard__group { display: none }` или эквивалент Payload 3.x DOM. |
| Sidebar icons (path A — CSS mask-image) | **Уровень 1** (custom.scss) | `[href*="/collections/X"]::before { mask-image: url(...) }`. |
| Sidebar icons (path B — custom Nav component) | **Уровень 3** (override admin.components.Nav) | Полная замена дефолтного nav, сохраняя collapsed state. |

Path A vs B → **ADR-0011 (новый, нужен от tamd)**. См. Q-1 ниже.

---

## Scope IN

### 8.1 · Sidebar group order — корректный 01→02→03→04→05→09

**Проблема:** Payload рендерит группы в порядке первой коллекции с этим `admin.group` строковым значением. Текущий [payload.config.ts:70-83](../../site/payload.config.ts#L70-L83):

```ts
collections: [Users, Media, Services, Districts, ServiceDistricts,
              Cases, Persons, Authors, Blog, B2BPages, Leads, Redirects],
globals: [SeoSettings, SiteChrome],
```

Users (09) первая → группа `09 · Система` рендерится сверху. Дальше Media (03), потом Services (02), потом Leads (01). Globals SeoSettings (04) и SiteChrome (05) — порядок ОК.

**Решение:** перепорядочить `collections[]`:

```ts
collections: [
  // 01 · Заявки
  Leads,
  // 02 · Контент (порядок per brand-guide §12.2 mockup)
  Services, Districts, ServiceDistricts, Cases, Blog, Authors, B2BPages,
  // 03 · Медиа
  Media,
  // 04 · SEO
  Redirects,
  // 09 · Система
  Users,
],
```

**Persons:** §12.2 mockup её не упоминает (там только Authors). На проде она в группе `02 · Контент` (см. скрин «Команда»). См. **Q-2**.

### 8.2 · Sidebar icons (13 line-art SVG 14×14 currentColor)

**Проблема:** brand-guide §12.2 lines 2993-3011 показывает 13 ассоциативных иконок: inbox · 4-square · pin · pin+grid · folder · page · person · 2-buildings · image · globe+search · arrows · frame · group. На проде все nav__link рендерятся **без иконок**, только текст.

**Mapping (collection-slug → icon):**

| Коллекция/глобал | URL слаг | SVG-имя | Источник в brand-guide |
|---|---|---|---|
| Leads | `leads` | inbox (стрелка ↓ в коробку) | line 2994 |
| Services | `services` | 4-square (4 квадрата 2×2) | line 2996 |
| Districts | `districts` | pin (капля + точка) | line 2997 |
| ServiceDistricts | `service-districts` | pin+grid (капля + крестик) | line 2998 |
| Cases | `cases` | folder (папка) | line 2999 |
| Blog | `blog` | page (документ с линиями) | line 3000 |
| Authors | `authors` | person (кругголова + плечи) | line 3001 |
| B2BPages | `b2b-pages` | 2-buildings (2 здания) | line 3002 |
| Media | `media` | image (rect + dots + горы) | line 3004 |
| SeoSettings (global) | `seo-settings` | globe+search (глобус + лупа) | line 3006 |
| Redirects | `redirects` | arrows (стрелки → ←) | line 3007 |
| SiteChrome (global) | `site-chrome` | frame (rect + dots + dashed) | line 3009 |
| Users | `users` | group (2 person silhouettes) | line 3011 |

**Path A (CSS-only mask-image):**
- Каждая SVG path сохраняется как `data:image/svg+xml;base64,...` URL в `--brand-obihod-icon-leads` CSS variable.
- Селектор: `.payload__app a.nav__link[href*="/collections/leads"]::before { mask-image: var(--brand-obihod-icon-leads); ... }` для коллекций.
- Для globals: `[href*="/globals/seo-settings"]::before`.
- Размер 14×14, gap 8px, opacity 0.65 default → 0.9 hover → 1.0 active (token map line 3163).

**Path B (custom Nav):** override `admin.components.Nav = '@/components/admin/Nav'` — full re-implement. Дороже, но честно (collapsed sidebar 64px §12.2 требует full control over rendering).

**Recommendation popanel: Path A** — если DOM stable (verify fe-panel) и mask-image works for currentColor inheritance. Path B как fallback. **Решает ADR-0011 от tamd.**

**Acceptance:** иконка слева от label, gap 8px, **decorative** (`background-image` на pseudo-element автоматически без role/aria — chase OK). text label остаётся для screen reader.

### 8.3 · Hide default dashboard group cards

**Проблема:** Payload 3.x при рендере `/admin` route выводит после `beforeDashboard` slot список коллекций по группам в виде карточек с "+" (DOM селектор требует verify — гипотеза `.dashboard__group` или `.dashboard__group-list`). На скрине эти карточки **тёмные** на cream фоне (anti-pattern «дефолтный фиолетовый Payload» line 3249) и дублируют sidebar.

**Решение:**

1. **fe-panel verify DOM:** открыть live admin /admin в Chrome DevTools, найти точный селектор default dashboard group container (наблюдение: возможно `.dashboard` > `[class*="group"]` или `.collection-list`).
2. **custom.scss блок «DASHBOARD CLEANUP» (новый):**
   ```scss
   /* §12.3 brand-guide: dashboard = greeting + stat-cards + tiles + PageCatalogWidget.
    * Default Payload group list дублирует sidebar — скрываем. */
   .payload__app .dashboard__group,         /* TODO verify */
   .payload__app .dashboard__group-list {   /* TODO verify */
     display: none;
   }
   ```
3. **fallback if селектор ловит больше нужного:** target только direct children of `.dashboard__main` после `afterDashboard` slot.

**Альтернатива:** перекрасить default cards в light theme + добавить иконки. **Отвергнута popanel** — это duplication of sidebar (anti-pattern). Brand-guide §12.3 явно описывает dashboard без group-list.

**Acceptance:** на /admin под greeting/stats/tiles и PageCatalogWidget **нет** карточек коллекций по группам с "+". Visual: фон cream, только белые карточки с beige border.

### 8.4 · Top-bar search field — backlog (out-of-scope W8)

**Решение:** создать backlog item `PANEL-GLOBAL-SEARCH` (RICE TBD), не делать в W8. Reason: глобальный поиск по контенту — отдельная capability (Payload не имеет out-of-the-box, нужно построить REST aggregation как в W3 PageCatalog), эффорт ~2-3 ЧД, не блокирует release.

---

## Out-of-scope (явно)

- Top-bar global search → backlog (W8.4 deferred).
- Persons коллекция: ребрендинг или удаление → отдельный мини-issue (см. Q-2).
- Mobile-specific tweaks (W6 baseline must hold) — qa-panel re-runs admin-mobile.spec.
- Dark theme — закрыто Wave 1 + ADR-0007 (only light).
- Account view, profile dropdown, breadcrumbs styling — §12.2 покрывает в mockup, но prod уже близко; не P0 для W8.

---

## Acceptance criteria

### AC W8-1.1 Sidebar group order
- [ ] На /admin sidebar группы сверху-вниз: **01 · Заявки → 02 · Контент → 03 · Медиа → 04 · SEO → 05 · Рамка сайта → 09 · Система**.
- [ ] В 02 · Контент порядок: Услуги → Районы → Услуги×районы → Кейсы → Блог → Авторы → B2B-страницы (+ Persons если оставлена, см. Q-2).
- [ ] Verify: Playwright `admin-design-compliance.spec.ts` — `await expect(page.locator('.nav-group__indicator')).toContainText(['01 · Заявки', '02 · Контент', ...])` в порядке (или текстовый snapshot).

### AC W8-2.1 Sidebar icons present
- [ ] Каждая из 13 sidebar links имеет line-art SVG 14×14 currentColor слева от label, gap 8px (token map §12.2 line 3163).
- [ ] Иконки соответствуют mapping table выше (8.2). Visual sanity: ux-panel screenshot prod sidebar vs §12.2 mockup, совпадение SVG paths по shape.
- [ ] Opacity transition 0.65 default → 0.9 hover → 1.0 active.
- [ ] a11y: иконка декоративная (`aria-hidden="true"` если custom Nav, или `background-image` на pseudo-element для CSS-path). text label остаётся для screen reader. Axe 0 violations.

### AC W8-3.1 Default dashboard group list hidden
- [ ] На /admin под `beforeDashboard` (greeting + stat-cards + action-tiles) и `afterDashboard` (PageCatalogWidget) **нет** дефолтного списка коллекций по группам с тёмными карточками "+".
- [ ] Visual: фон cream (#f7f5f0), карточки только белые с beige border (no #1c1c1c filled cards).
- [ ] Verify: Playwright `admin-design-compliance.spec.ts` — `await expect(page.locator('.dashboard__group')).toHaveCount(0)` (или verified селектор).

### AC W8 общие
- [ ] **brand-guide §12.2/§12.3 compliance:** ux-panel screenshot prod vs mockup, deviation ≤ 4px (icon size, sidebar width, group gap). Отчёт — `qa-panel-wave8.md` секция «Brand-guide §12 mapping».
- [ ] **a11y axe-core:** 0 violations на /admin (W7 baseline сохраняется). Iconки не должны добавлять "image-without-alt" violation.
- [ ] **Mobile (W6 baseline must hold):** re-run admin-mobile.spec, sidebar drawer на ≤640px показывает иконки + ordering как desktop.
- [ ] **Type-check + lint + format:** zero errors (do owns green CI before merge).
- [ ] **Local-verify (popanel iron rule):** popanel разворачивает PR локально, открывает /admin в Chrome, screenshot evidence в `screen/wave8-sidebar-order.png`, `screen/wave8-icons.png`, `screen/wave8-dashboard-clean.png`.

---

## Состав команды и оценки

| Роль | Задача | Effort | Зависимость |
|---|---|---|---|
| **sa-panel** | Финализировать spec (close Q-1..Q-4 с tamd/popanel), задать PAN-NEXT issue, фиксировать Hand-off log | 0.3 ЧД | этот файл |
| **tamd** | ADR-0011: Path A (CSS mask-image) vs Path B (custom Nav) для иконок. Решение по DOM stability + maintainability. | 0.3 ЧД | sa-panel approved |
| **ux-panel** | Screenshot compare prod vs §12.2 mockup; sanity на 13 SVG иконок; mobile sidebar drawer compatibility | 0.3 ЧД | spec approved |
| **fe-panel** | (a) перепорядок `collections[]` в payload.config.ts; (b) реализация иконок per ADR-0011; (c) hide default dashboard group cards в custom.scss; (d) DOM verify через DevTools перед каждым CSS блоком | 1.2 ЧД | ADR-0011 + spec approved |
| **be-panel** | Code review changes в payload.config.ts (порядок коллекций безопасен — никаких schema changes / migrations) | 0.1 ЧД | fe-panel PR |
| **qa-panel** | Расширить `admin-design-compliance.spec.ts` под W8: order check + icon-presence locators + dashboard cleanup assertion. Re-run mobile spec. | 0.5 ЧД | dev done |
| **cr-panel** | brand-guide §12.2/§12.3 compliance review + a11y axe verify + popanel screenshot evidence audit | 0.2 ЧД | qa pass |

**Total:** ~2.9 ЧД от ADR до merge. Calendar (parallel ux + tamd, sequential dev): **~2-3 рабочих дня**.

---

## Dependencies / Risks

- **R-1 (Medium):** Payload 3.84 DOM может не выставлять stable селектор `.dashboard__group` или `[data-collection-slug]` — нужен verify через DevTools перед CSS реализацией. Mitigation: fe-panel делает DOM debug screenshot первым шагом, фиксирует селекторы в комментариях custom.scss (как уже делал на W6, см. lines 547-553).
- **R-2 (Low):** mask-image для иконок может не наследовать currentColor правильно во всех браузерах (Safari edge case). Mitigation: fallback `background-image` с предзаданными цветами через CSS variables (3 варианта: default ink-soft, hover primary, active on-primary).
- **R-3 (Medium):** Custom Nav component (Path B) — полная замена дефолтного nav, нужен re-implement collapsed state (64px sidebar §12.2), accordion sections, leads counter (Wave 3 PAN-6 part 3 — `[data-leads-count]` injection через MutationObserver). Может сломать W3.5 leads counter integration. Mitigation: ADR-0011 explicit migration plan + fe-panel порт W3.5 кода в новый компонент.
- **R-4 (Low):** Перепорядок коллекций в payload.config.ts — нет schema changes / migrations, безопасно. dba consult **не нужен**.
- **R-5 (Medium):** mobile drawer (W6) использует селектор `aside.nav.nav--nav-open` — если Path B меняет DOM, ломаем W6. Mitigation: fe-panel re-runs admin-mobile.spec локально перед PR.

---

## Open questions — CLOSED 2026-04-30 (popanel autonomous-mode)

1. **Q-1 [tamd] CLOSED:** Path A (CSS mask-image) выбран — см. [ADR-0011](../../team/adr/ADR-0011-sidebar-icons-strategy.md). Reason: Уровень 1 (custom.scss only) per ADR-0005, не ломает W3 leads counter и W6 mobile drawer, verified DOM stability через 3 wave.
2. **Q-2 [popanel + cw] CLOSED:** Persons коллекция остаётся в 02 · Контент (порядок: ...Authors, B2BPages, **Persons** последней в группе). Иконка — `group` (та же что Users) до решения cw. Refactor "Персоны → Команда" → backlog `PANEL-PERSONS-RENAME` (RICE TBD).
3. **Q-3 [popanel] CLOSED:** Top-bar search → backlog `PANEL-GLOBAL-SEARCH` (RICE TBD), отдельная сессия. Не делаем в W8.
4. **Q-4 [sa-panel + qa-panel] CLOSED:** Manual ux-panel screenshot review (популярнее чем pixel-diff baseline — меньше flake, быстрее, см. evidence в `screen/wave8-*.png`). Playwright spec проверяет structural locators (count, presence, order), не pixel-baseline.
5. **Q-5 [fe-panel] CLOSED:** Default dashboard cards селектор verified — `.modular-dashboard` (источник: `node_modules/@payloadcms/next/dist/views/Dashboard/Default/index.js` + `Default/ModularDashboard/index.client.js:133` className `modular-dashboard`). НЕ `.dashboard__group`. Реализовано в custom.scss блок «§8.3».

---

## Hand-off log

```
2026-04-30 17:00 · operator → popanel: запрос Wave 8 alignment по скрину prod /admin (порядок sidebar 09→03→02→01→04→05, отсутствие иконок, дублирование sidebar в виде тёмных карточек на dashboard). Подключи команду panel + ux + qa.

2026-04-30 17:30 · popanel → sa-panel: создан draft sa-panel-wave8.md. Verify требуется: Q-1..Q-5. После approval — задавай PAN-NEXT issue, передавай в tamd для ADR-0011, далее ux-panel + fe-panel параллельно. popanel skill-activation: blueprint + product-capability (note-popanel.md обновлён).

2026-04-30 17:30 · popanel → tamd (через sa-panel orchestration): ADR-0011 «Sidebar icons strategy: CSS mask-image vs custom Nav component». Inputs: §12.2 mockup, ADR-0005 §1, W3 leads counter integration risk (R-3). Output: 1 страница + recommendation.

2026-04-30 17:30 · popanel → ux-panel (через sa-panel orchestration): screenshot compare prod /admin sidebar и dashboard vs §12.2/§12.3 mockup. Output: deviation report (px-level) + 13 SVG icon shape sanity.
```

---

## Definition of Done (для popanel gate)

- [ ] sa-panel: spec finalized, AC clear, Q-1..Q-5 closed, frontmatter `phase: dev`.
- [ ] tamd: ADR-0011 merged в team/adr/, recommendation Path A или Path B.
- [ ] fe-panel: PR с диффом payload.config.ts (collection order) + custom.scss (icons + dashboard cleanup) + опц. components/admin/Nav.tsx (если Path B).
- [ ] qa-panel: admin-design-compliance.spec.ts расширен под W8 AC, axe-core 0 violations, mobile spec не сломан.
- [ ] cr-panel: brand-guide §12.2/§12.3 visual review approve, a11y verified.
- [ ] popanel local-verify: pnpm db:up && pnpm seed:admin && pnpm dev → /admin → 3 screenshots в screen/wave8-*.png.
- [ ] release-gate: RC-N.md от release, leadqa-N.md от leadqa.
- [ ] оператор approve, do deploy.

---

## Связанные артефакты

- [art-concept-v2.md](art-concept-v2.md) §2 (Sidebar) + §3 (Dashboard) — anatomy.
- [sa-panel-wave1 (history) — custom.scss baseline](../../site/app/(payload)/custom.scss) lines 262-282 (sidebar active link), lines 25-116 (tokens).
- [brand-guide.html §12.2](../../design-system/brand-guide.html) lines 2981-3026 — Sidebar mockup + token map line 3163.
- [brand-guide.html §12.3](../../design-system/brand-guide.html) lines 3028-3070 — Dashboard mockup (без group-list).
- [brand-guide.html anti-patterns admin](../../design-system/brand-guide.html) lines 3247-3254 — «дефолтный фиолетовый» line 3249.
- [ADR-0005](../../team/adr/ADR-0005-admin-customization-strategy.md) — уровни кастомизации.
- [note-popanel.md](note-popanel.md) — PO log.
