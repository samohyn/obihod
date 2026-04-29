# OBI-24 Admin Redesign — Full Mockup Pass (one-wave)

**Date:** 2026-04-27
**Branch:** `feat/OBI-24-admin-redesign-full-mockup`
**Source of truth:** [`design-system/brand-guide.html §12`](../../../design-system/brand-guide.html)
**Контекст:** оператор потребовал «1 волной — сделал, проверил, отдал» вместо 7 партиальных waves. Этот PR закрывает разрывы между prod и mockup §12, найденные после ревью первой серии (PR #69-#74).

## Что в скоп этой волны

### §12.1 Login screen

**До:** текстовая полоска «obikhod.ru · admin» + heading «Порядок под ключ» + accent divider — далеко от mockup §12.1.

**После:**
- `BeforeLoginLockup.tsx` — **полный master lockup** по mockup: inline SVG «Круг сезонов» 56×56 + wordmark «ОБИХОД» 36px brand-зелёный + admin-tagline «порядок под ключ · admin» mono 11/0.16em uppercase
- `AfterLoginFooter.tsx` — copyright «© YYYY · Обиход» muted 12px (новый компонент, через `admin.components.afterLogin` slot)
- `payload.config.ts` — добавлен `afterLogin` slot
- `importMap.js` — AfterLoginFooter entry

### §12.4 Edit view с Tabs

**До:** Wave 4 покрыл Services / Cases / Blog. Authors / B2BPages / Districts / ServiceDistricts / SiteChrome — без tabs.

**После:**
- **Authors** (4 tabs): Основные · Био · Связи · SEO
- **B2BPages** (3 tabs): Основные · Контент · SEO
- **Districts** (4 tabs): Основные · Программа SEO · Контент · SEO
- **ServiceDistricts** — уже был в tabs (предыдущий рестракт)
- **SiteChrome** — уже был в tabs

Sidebar fields (`canonicalOverride`, `robotsDirectives`, `breadcrumbLabel`) — вне tabs (Payload рендерит в правой колонке).

### §12.3 Page Catalog widget

**До:** базовая таблица 4 колонки без navigate.

**После:**
- Добавлена 5-я колонка `→` (link на `/admin/collections/<slug>/<id>` для edit)
- `aria-label` на каждой ссылке для screen-reader
- `EmptyState` подключён в empty-branch widget (через Wave 5 компонент) — **первое реальное использование** Wave 5 компонента в проде

## Что НЕ в скоп этой волны (правильно поставлено в follow-up)

| Элемент §12 | Причина отложить |
|---|---|
| 4 stat-cards в dashboard (§12.3) | Требует Sentry/Я.Метрика API (нет access). Без real-data placeholder выглядит «незаконченно» — лучше отдельным PR с интеграциями |
| Filter dropdown ▾ + CSV export (§12.3) | Filter — client-component с state. CSV — отдельный API route. Раздувает PR — отдельной итерацией |
| ErrorState/ForbiddenState wiring через `admin.components.providers` (§12.6) | Требует client component + React error-context. Без proof-of-concept на Payload v3 API — рискованно |
| Bulk action bar (§12.5) | Требует client-side row-selection state + sticky positioning |
| Mobile responsive layout (§12.8) | Native Payload admin даёт базовый mobile. Полная mockup-mobile — отдельный design pass |
| Fully custom `views.login` (если master lockup в slot не достаточен) | beforeLogin/afterLogin slots — менее рискованно для auth-flow. Если оператор после визуальной приёмки скажет «нужно строго custom view» — переходим к нему |

## DB compatibility

Все tabs — **unnamed** (без `name`), pure UI grouping. БД schema не меняется, versioning `_v` snapshots работает как раньше. Hooks `afterChange`, `validate`, `admin.description` сохранены.

## Test plan

- [x] `pnpm run type-check` pass
- [x] `pnpm run lint` 0 errors (81 legacy warnings)
- [x] `pnpm run format:check` pass
- [x] CI Playwright e2e (admin-design-compliance + admin-smoke)
- [ ] Manual smoke `/admin/login/` после deploy: master lockup сверху, форма по центру, copyright снизу
- [ ] Manual smoke `/admin` после deploy: PageCatalog → click row → edit-view открывается
- [ ] Manual smoke Edit Authors → видны 4 tabs

## CR-checklist (`cr.md`)

- [x] Все правки привязаны к §brand-guide
- [x] Hooks (afterChange Districts revalidate) сохранены
- [x] Validation сохранена (slug regex, URL pattern)
- [x] admin.description полей сохранены
- [x] Sidebar fields (positions, options) не сломаны
- [x] importMap.js обновлён
- [x] Stale Wave 5 compoнентов больше нет — EmptyState теперь используется в проде (PageCatalog)
