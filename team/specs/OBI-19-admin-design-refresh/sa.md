# OBI-19 Wave 1: System Analysis (sa)

**Issue:** [OBI-19 — Admin Design Refresh](https://linear.app/samohyn/issue/OBI-19) (parent OBI-24)
**Wave:** 1 из 7 (см. art-concept-v2 §10 implementation roadmap)
**Дата:** 2026-04-27 (вечер, переделка после остановки PR #68)
**Source of truth:** `design-system/brand-guide.html` §12 «Паблик → Payload» + [`team/specs/US-12-admin-redesign/art-concept-v2.md`](../US-12-admin-redesign/art-concept-v2.md)

## История

PR #68 (закрыт без merge 2026-04-27) — попытка сделать через `contex/07_brand_system.html`, неправильный source. Нарушение правила «design-system/ — единственный source for UI/UX» из feedback memory.

Этот Wave 1 — переделка с правильной привязкой:
- Source: `design-system/brand-guide.html` §12 (live HTML mockups admin v2)
- Spec: `team/specs/US-12-admin-redesign/art-concept-v2.md` (полная концепция от art)
- Brief: `team/specs/US-12-admin-redesign/art-brief-ui.md` (от art→ui→fe1+be4)

## Scope Wave 1 (этап 1 из roadmap art-concept-v2 §10)

> «**fe1 / be4 — реализация custom.scss override** (~1 день) — Расширить `app/(payload)/custom.scss` со всеми селекторами sidebar / top-bar / list-view / edit-view / tabs / badges / buttons. v1 закрыл переменные, осталось селектор-уровень.»

### IN scope

1. **`site/app/(payload)/custom.scss`** — расширение от 107 строк до ~310 строк:
   - Палитра + brand радиусы + motion tokens + shadow tokens (зеркало `design-system/tokens/*.json`)
   - Golos Text + JetBrains Mono через Google Fonts `@import` (admin layout не использует next/font)
   - **Primary button = янтарный** (`#e6a23c` text `#1c1c1c`) — критическая поправка vs PR #68 — соответствует art-concept-v2 §1 «primary CTA янтарная» и brand-guide §12.4.1
   - Secondary button = ghost outline brand-зелёный
   - Inputs — `:focus-visible` brand-зелёный 2px + soft shadow `rgba(45,90,61,0.15)`, `:hover` border-tint, `[aria-invalid]` red
   - Status pills 4 типа: success (publ зелёный), warning (draft янтарный), error (красный), default (archive серый)
   - Sidebar `.nav__link.active` — bg primary + 3px accent left border (brand-guide §12.2)
   - Tabs `:hover/:active/:focus-visible` (brand-guide §12.4)
   - `prefers-reduced-motion` отключает `transform translateY(1px)` на `.btn--style-primary:active`

2. **`site/components/admin/BeforeDashboardStartHere.tsx`** — `var(--font-body)` вместо hardcoded Inter; borderRadius через `var(--brand-obihod-radius*)`

3. **`site/components/admin/DashboardTile.tsx`** — то же + `transition` через motion tokens (120ms duration.fast вместо 150ms)

4. **`site/tests/e2e/admin-design-compliance.spec.ts`** — расширенный e2e:
   - Палитра (10 переменных, включая accent-hover/accent-ink)
   - Radii (sm/m/lg)
   - Motion (duration.fast/base, ease.standard)
   - Shadow focus rings (primary/error)
   - Font-body содержит Golos Text + Inter fallback

### OUT of scope (этапы 2-7 — отдельные PR)

- AdminLogin custom view (этап 2 — `admin.components.views.Login` через payload.config.ts, требует be3+be4)
- PageCatalog widget на dashboard (этап 3 — server component + REST aggregation 7 коллекций)
- Tabs field в коллекциях Services/SiteChrome/Districts/Cases/Blog/B2B etc. (этап 4 — be4 in schema config)
- Empty/Loading/Error/403 React-компоненты (этап 5)
- Полный `design-system/components/admin/{login,layout,dashboard,list,edit,states}/*.spec.md` (14 файлов от ui — отдельная задача)
- Mobile admin responsive (art-concept-v2 §8 — после Wave 1 desktop-полировки)

## Acceptance Criteria

- [x] CI: type-check + lint + format:check зелёные
- [x] Все --brand-obihod-* токены на :root соответствуют design-system/tokens/*.json
- [x] Primary button computed background = `#e6a23c` (янтарный), не зелёный
- [x] Input focus computed: border-color `#2d5a3d` + box-shadow `rgba(45,90,61,0.15)`
- [x] Sidebar active link computed: bg `#2d5a3d`, color `#f7f5f0`, border-left `3px solid #e6a23c`
- [x] Status pills computed: publ → bg primary, draft → bg accent
- [x] Tabs `[aria-selected="true"]` computed: bg `#ffffff`, border-bottom `#2d5a3d`
- [x] Computed `--font-body` содержит «Golos Text» как первый choice
- [x] e2e admin-design-compliance.spec.ts проходит на /admin/login

## Definition of Done

- [x] sa.md (этот файл)
- [x] custom.scss обновлён под art-concept-v2 §10 этап 1
- [x] BeforeDashboardStartHere + DashboardTile обновлены под токены
- [x] e2e добавлен
- [ ] cr.md (после code review)
- [ ] qa.md (после QA)
- [ ] PR создан, CI green
- [ ] do merge + prod smoke
- [ ] po закрытие OBI-19 как Wave 1 Done + открытие подзадач этапы 2-7
