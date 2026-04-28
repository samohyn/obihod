# ADR-0005 — Admin Customization Strategy (Payload 3 admin под brand-guide §12)

**Дата:** 2026-04-28
**Статус:** Accepted
**Автор:** tamd
**Контекст US:** [PAN-1 US-12 Admin Redesign](https://linear.app/samohyn/issue/PAN-1) → [PAN-2 ADR-0005](https://linear.app/samohyn/issue/PAN-2)
**Skill:** активирован `architecture-decision-records` (skill-check iron rule, см. [tamd.md §⚙️ Железное правило](../common/tamd.md))
**Related:**
- [design-system/brand-guide.html](../../design-system/brand-guide.html) §12
- [team/specs/US-12-admin-redesign/](../specs/US-12-admin-redesign/) — art-concept-v2 + 3 art-brief'а
- [site/app/(payload)/custom.scss](../../site/app/(payload)/custom.scss) — Wave 1 implementation
- [project memory: US-12 Admin Redesign мандат](../../.claude/memory/handoff.md)

---

## Контекст

**Payload 3.83.0** — встраиваемый CMS-фреймворк, поставляющий React-admin-приложение поверх Next.js 16. Стандартный admin-UI Payload использует фиолетовый `#9a5cf6` brand-набор и дефолтную типографику, которые не соответствуют brand-guide Обихода §12.

**Wave 1 OBI-19 уже закрыт** (2026-04-27): `site/app/(payload)/custom.scss` 107 → 375 строк (палитра, primary янтарный `#e6a23c`, focus brand-зелёный `#2d5a3d`, sidebar active 3px accent left-border, status pills 4 типа, tabs states, login carд 320px) + 9 React-компонентов в `site/components/admin/` (`BeforeLoginLockup`, `BeforeDashboardStartHere`, `PageCatalog`, `EmptyErrorStates`, `BrandLogo`, `DashboardTile` и др.).

**Waves 2-7 (PAN-3..PAN-8)** добавят: AdminLogin custom view с magic link, PageCatalog server-component (страница + widget + CSV + Leads badge polling), Tabs field в 10 коллекциях, финальный Empty/Error/Skeleton, mobile responsive, Playwright admin smoke.

**Чем это создаёт архитектурный риск:**

1. **SCSS-селекторы Payload не публичный API.** Имена классов `.payload__app`, `.btn--style-primary`, `.nav__link.active`, `.tabs-field__tab-button`, `.login__form`, `.template-default--login` — внутренняя структура. Любой minor 3.83 → 3.84 / patch 3.83.0 → 3.83.1 может переименовать класс или поменять DOM-структуру, и admin сломается невидимо (визуальный регресс без exception в runtime).
2. **`!important` в 8+ местах.** В `custom.scss` — на login submit, autofill, container width. Specificity-война растёт с каждым Wave; Payload upgrade может добавить свой `!important`, и наш caches-out.
3. **`admin.components.*` API стабилен, но не идеален.** `views.Login`, `BeforeDashboard`, `AfterLoginFooter` — официальные API, но при major bump (Payload 4.x) сигнатуры могут поменяться (props, типы).
4. **React 19 / Next 16 breaking changes** ([site/AGENTS.md](../../site/AGENTS.md)) — admin живёт в `app/(payload)/` route group и использует RSC + новые server actions. Это влияет на custom views (Wave 2 magic link + Wave 3 PageCatalog page).
5. **9 человеко-дней** инвестиций в Waves 2-7 без защиты — это технический долг, который команда panel будет фиксить **руками** при каждом Payload bump'е.

**Что нужно решить:**

- Какие части Payload admin override через CSS (намного дешевле в поддержке).
- Какие через React-компоненты (`admin.components.*`).
- Что **НЕ** трогаем (полагаемся на native).
- Как защитить SCSS-слой от Payload-апгрейдов (specificity, `:where()`, smoke-тесты).
- Как откатиться если Wave-N сломал admin.

---

## Решение

Принимаем **трёхуровневую стратегию кастомизации** Payload admin с чёткими границами + защитный контракт.

### Уровень 1 · CSS-only (custom.scss) — для всего что про **визуал**

| Что | Где override | Risk при апгрейде |
|---|---|---|
| Палитра (brand vars + Payload color-base / success / warning) | `:root` в `custom.scss` | низкий (CSS-переменные стабильны 6+ мес) |
| Радиусы (`--style-radius-s/m/l`) | `:root` | низкий |
| Типографика (Golos Text + JetBrains Mono) | `:root --font-body --font-mono` | низкий |
| Motion tokens (duration, ease) | `:root` | низкий |
| Shadow / focus rings | `:root` | низкий |
| Primary button янтарный + states (hover / active / focus / disabled) | `.payload__app .btn--style-primary` | средний (имя класса может смениться в major) |
| Secondary button ghost зелёный | `.payload__app .btn--style-secondary` | средний |
| Inputs / textarea / select states | `.payload__app input:focus-visible` etc. | низкий (стандартные HTML селекторы) |
| Status pills (4 типа) | `.payload__app .pill--style-*` | средний |
| Sidebar active link + 3px accent border | `.payload__app .nav__link.active` | средний |
| Tabs states (Wave 4) | `.payload__app .tabs-field__tab-button` | средний |
| Login card 320px + autofill | `.payload__app .login form` | средний (Payload может пересобрать login DOM) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` | низкий |

**Защита SCSS-слоя:**

1. **Namespacing через `.payload__app`** — все правила scope'ятся под root admin app class. Утечки в публичный сайт исключены.
2. **`:where()` для нестабильных payload-классов** в Wave 4+ (ниже spec'ов сейчас не нужно — текущий код уже работает).
3. **`!important` минимизировать.** Текущие 8+ использований только на login (где Payload использует inline стили на autofill и submit). Для новых Wave — запрет `!important` без явного reason-comment.
4. **Comment-anchors** в `custom.scss` (`/* art-concept-v2 §X */`, `/* brand-guide.html §12.X */`) — каждый блок ссылается на источник истины. После Payload bump'а — diff custom.scss vs source-of-truth, найти что съехало.

### Уровень 2 · React `admin.components.*` — для всего что про **UX и поведение**

| Что | API | Risk при апгрейде |
|---|---|---|
| Login lockup (master mark + admin-tagline) | `admin.components.beforeLogin` (`BeforeLoginLockup.tsx`) | низкий (стабильный slot) |
| Login footer (© 2026 Обиход) | `admin.components.afterLogin` (`AfterLoginFooter.tsx`) | низкий |
| Brand logo / icon в sidebar | `admin.components.graphics.Logo` / `.Icon` | низкий |
| Greeting + start-here на dashboard | `admin.components.beforeDashboard` (`BeforeDashboardStartHere.tsx`) | низкий |
| Action tiles на dashboard | `admin.components.beforeDashboard` (внутри greeting) | низкий |
| **AdminLogin custom view (Wave 2 magic link)** | `admin.components.views.Login` | **средний** (полный override, может потребовать пересборку при major) |
| **PageCatalog (Wave 3)** | `admin.components.beforeDashboard` (widget) + custom route `/admin/catalog` через Payload route system | средний |
| **Empty / Error / Skeleton (Wave 5)** | `admin.components.providers` или per-collection `admin.components.views.List.Empty` | средний |
| **Sidebar Leads badge counter (Wave 3)** | `admin.components.Nav` или collection `admin.useAsTitle` workaround | высокий (Payload не имеет официального slot для sidebar badge — потребуется patch через CSS injection или Nav override) |

**Защита React-слоя:**

1. **Один файл = один компонент.** Никаких смешанных компонентов в `site/components/admin/*`. Облегчает diff после bump'а.
2. **Тонкий слой над Payload-API.** Custom view = только верстка + наш state. Бизнес-логику (REST, валидация, БД) держим в Payload-collections / Next.js API routes (см. ниже).
3. **Никаких import'ов из `@payloadcms/ui` глубже первого уровня.** Только публичные exports (`Button`, `Field`, etc.). Внутренние — переписать своё (это и быстрее в реализации).
4. **Контракты через Payload TypeScript types** — `import type { CollectionConfig, AdminViewProps } from 'payload'`. При bump'е `tsc --noEmit` сразу падает.

### Уровень 3 · НЕ трогаем — полагаемся на native Payload

| Что | Почему не трогаем |
|---|---|
| **Layout** (sidebar / top bar / canvas grid) | Payload native layout — стабильный, мы только меняем визуал через CSS |
| **ListView core** (sort / filter / pagination / bulk-actions / drawer) | Бизнес-логика Payload ListView (URL state, query params, drawer create) — переписывать = терять features при каждом bump'е |
| **EditView core** (поля, валидация, save flow) | То же самое — пишем кастомные **Field**'ы, не EditView |
| **Auth flow внутри** (sessions, JWT, refresh) | Payload native auth — security-critical, делегируем maintainers Payload. Magic link (Wave 2) — **дополнение** через REST endpoint, не замена auth core |
| **Localization (i18n)** | `@payloadcms/translations` → ru locale из коробки |
| **Drag-and-drop, reordering, rich text editor** | `@payloadcms/richtext-lexical` — не трогаем |

### Versioning стратегия

**Patch (`3.83.0` → `3.83.1`):** auto-merge через Dependabot, smoke-тест в CI обязателен.
**Minor (`3.83` → `3.84`):** ручной merge с `qa-panel` smoke-test. Diff `custom.scss` vs upstream Payload `*.scss` через `node_modules/payload/dist/admin/scss/`. Если есть наш override на класс, который Payload переименовал — fix и regression-тест перед merge.
**Major (`3.x` → `4.x`):** **отдельная US** + новый ADR-NNNN (`Payload 4 migration strategy`). НЕ попадает в обычный sprint. Wave-window для миграции. Текст migration guide читаем заранее.

**CI guard (Wave 7 включает):**
- `site/tests/e2e/admin-design-compliance.spec.ts` (уже есть из Wave 1) — проверяет computed styles на критичных классах: палитра, focus-color, sidebar active border, primary button bg. Падение = block merge.
- `site/tests/e2e/admin-smoke.spec.ts` (Wave 7) — login flow, list view render, edit view tabs, dashboard PageCatalog. Падение = block merge.

### Rollback стратегия

Если Wave-N сломал prod admin (визуальный регресс или функциональный):

1. **Уровень 1 (CSS):** `git revert <commit-sha>` для блока в `custom.scss`. Деплой через `do` ≤5 мин.
2. **Уровень 2 (React):** удалить override из `payload.config.ts` (`admin.components.views.Login: undefined` — Payload падает на native). Деплой ≤5 мин.
3. **Полный rollback Wave-N:** `git revert -m 1 <merge-commit>` ветки `panel/integration` → main. `do` deploy. Время recovery ≤15 мин.
4. **Backup пользовательских данных не нужен** — admin кастомизация не трогает БД (миграции схем — отдельный gate `dba`).

**Время recovery target:** ≤15 мин от обнаружения до фикса в проде. Для этого `qa-panel` Playwright smoke + `release-mgr` гейт ловят 90%+ регрессий **до** merge.

---

## Альтернативы

### A1. Fork Payload UI (целиком)
- **Pros:** полный контроль, нет surprise при апгрейдах
- **Cons:** ×10 поддержка, security-fixes Payload не доходят, потеря всех будущих фич (новые field types, оптимизации)
- **Why not:** Обиход — small team (один оператор + 7 ролей panel). Поддерживать форк — это +1 FTE долгосрочно. Стратегия не выдержит экономически.

### A2. Полный custom view для всех 8 экранов
- **Pros:** `admin.components.views.*` для Login / List / Edit / Dashboard / Catalog / Empty — единая стилевая база
- **Cons:** теряем native ListView features (sort URL state, filters, bulk-actions, drawer create), бизнес-логику EditView (валидация, conditional fields, hooks before/afterChange) пишем заново
- **Why not:** `cpo` оценил re-implement ListView в ~3-4 чд, EditView в ~5-7 чд. Это удваивает scope US-12 (9 → 18-20 чд) ради косметики, которая решается CSS'ом.

### A3. Только CSS, без React-overrides
- **Pros:** минимум кода, апгрейды безопаснее всего
- **Cons:** **невозможно** реализовать magic link login (нужен replace email+password form), невозможен brand-lockup на login (нужен beforeLogin slot), невозможен PageCatalog widget (нужен beforeDashboard slot)
- **Why not:** не покрывает scope US-12. Решения оператора 2026-04-28 (Q1 magic link, Q2 PageCatalog page) требуют React-уровня.

### A4. Только React-overrides, без SCSS
- **Pros:** один уровень, проще ментально
- **Cons:** придётся override **каждый** компонент Payload (Field, Button, Pill, Tab, NavLink) ради smysла палитры, что увеличивает scope ×3-5 + теряем централизацию токенов в `:root`
- **Why not:** пропадает преимущество CSS-переменных как single source of truth (token map зеркально с `design-system/tokens/*.json`). Делать через React — нарушает [feedback memory: design-system единственный source for UI/UX](../../.claude/projects/-Users-a36-obikhod/memory/feedback_design_system_source_of_truth.md).

### A5. Strapi / Directus вместо Payload
- **Pros:** альтернативы с другим customization-моделем
- **Cons:** уже utверждено в [CLAUDE.md § Technology Stack](../../CLAUDE.md), миграция = месяцы работы
- **Why not:** out of scope ADR — стек зафиксирован, см. [tamd.md мандат](../common/tamd.md) («Не меняю зафиксированный стек»).

---

## Последствия

### Плюсы

1. **Чёткие границы** — fe-panel / be-panel знают где правят что (CSS / React / native). Меньше merge-конфликтов.
2. **Защита от bump'ов** — patch автоматичен (Dependabot + CI), minor под `qa-panel` smoke, major — отдельная US. Recovery ≤15 мин.
3. **Token-map стабилен** — `design-system/tokens/*.json` остаётся single source. После bump'а Payload — палитра остаётся под нашим контролем через `:root`.
4. **CI guard'ит** — `admin-design-compliance.spec.ts` падает раньше prod (Wave 7 расширит до login + catalog + edit-tabs).
5. **Rollback быстрый и атомарный** — каждый Wave = отдельный merge-commit, `git revert -m 1` восстанавливает prod.

### Минусы

1. **Сохраняется хрупкость** — Payload patch может сломать SCSS-селектор без нашего ведома между smoke-runs. Mitigation: smoke в CI на каждом PR, не только nightly.
2. **`!important` остаётся в login** — пока Payload использует inline-style на autofill / submit, мы тоже. Долг, который убираем при Payload 4 migration.
3. **Sidebar badge counter (Wave 3)** — нет официального slot, придётся CSS-injection через `::after` на `.nav__link[href*="/leads"]` или patch Nav component. Это самое **рискованное** место для будущих апгрейдов.
4. **Custom view (`views.Login`) — full override.** При major Payload (4.x) эта Wave 2 будет переписана с нуля. Принимаем, потому что magic link — стратегическое требование оператора.

### Risks и mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Payload patch ломает SCSS-class name | средняя | низкий (визуальный регресс) | CI Playwright `admin-design-compliance.spec.ts` на каждом PR + Dependabot policy: review ALL Payload bumps |
| Payload minor меняет DOM-структуру login | низкая | средний (login стилизация съезжает) | `:where()` обёртка для login-классов в Wave 2; smoke login flow перед merge |
| Major Payload 4 ломает `views.Login` API | высокая (через 6-12 мес) | высокий (переписать Wave 2) | Отдельная US + ADR на Payload 4 migration. Magic link backend (REST endpoint + `MagicLinkTokens` collection) переживёт — это наш слой, не Payload UI |
| `!important` chain в login | низкая | низкий | Smoke-тест login flow + visual regression Wave 7 |
| Sidebar badge counter (Wave 3) breaks при Payload Nav refactor | средняя | средний (badge не показывается) | Fallback на dashboard widget «Новые заявки: N» — graceful degradation |
| React 19 / Next 16 breaking change в admin route group | средняя | высокий (admin не запускается) | [site/AGENTS.md](../../site/AGENTS.md) гард: читать docs перед изменениями. Pin Next.js минор-версию в `package.json` — не auto-bump |

### Follow-ups

- [ ] Wave 2 spec (`sa-panel-wave2.md`) явно описывает где НЕ трогать Payload auth core (только REST endpoint + custom view).
- [ ] Wave 3 spec явно описывает sidebar badge fallback (если Payload Nav API недоступен — degrade в dashboard widget).
- [ ] Wave 7 (Polish) расширяет `admin-design-compliance.spec.ts` — добавляет login flow / catalog navigation / lead accept tests.
- [ ] `do` обновляет `.github/dependabot.yml` — для `payload` / `@payloadcms/*` в `site/package.json` ставит `update-types: ['version-update:semver-patch']` (только patch auto, minor — manual review).
- [ ] При запуске Wave 4 (Tabs в 10 коллекциях) — пересмотреть этот ADR на предмет реального риска, при необходимости — supersede через ADR-0006.

---

## Открытые вопросы

- [ ] **Sidebar badge counter** — финальный механизм определит `sa-panel` в spec'е Wave 3. Я как `tamd` рекомендую: попробовать сначала через native Payload `Nav` admin component, если не покрывает badges — CSS-injection через `::after` на `.nav__link[href*="/admin/collections/leads"]` с `data-count` атрибутом, который меняется через client-side polling. Final decision — за `sa-panel` в `sa-panel-wave3.md`.
- [ ] **Magic link через Telegram vs email** — оператор выбрал Telegram (Q1 2026-04-28). Я подтверждаю — это снимает зависимость от SMTP-сервера и интегрируется с уже существующим Telegram bot из US-8. Но: что если оператор временно без Telegram (роуминг, потеря телефона)? **Fallback channel** — email на `samohingeorgy@gmail.com` через Beget SMTP. Закрыть в `sa-panel-wave2.md`.
- [ ] **Mobile admin** (Wave 6) — Payload native mobile поддержка ограничена. Если CSS-only не покрывает list/edit на ≤640px — потребуется **mobile-specific custom view** через `admin.components.views.List`. Решение принимать в `sa-panel-wave6.md` после ux-panel wireframes. Этот ADR не запрещает mobile-specific override, но не одобряет преждевременно.
