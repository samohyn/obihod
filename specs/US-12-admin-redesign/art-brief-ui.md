# Art-brief для `ui` — US-12 Admin Redesign

**От:** `art` (Design Director) · **Дата:** 2026-04-27 (вечер)
**Источник:** [`art-concept-v2.md`](./art-concept-v2.md), [`brand-guide.html` v1.8](../../../design-system/brand-guide.html) — секция «12 · Паблик → Payload» (живые HTML mockups).
**Базис:** [`art-concept v1`](../admin-visual/art-concept.md) уже закрыл палитру + типографику + token-map. Не переделывай.

## Что нужно сделать

Развернуть art-concept-v2 в pixel-perfect макеты + spec.md для `fe1`+`be4`. Все 8 экранов — Login + Dashboard (с Page Catalog) + List + Edit-tabs + Sidebar + Empty + 500 + 403.

## 0. Что использовать как референс

1. **brand-guide.html v1.8 §12** — там я сделал HTML mockups в живом виде. Структура и стиль готовы. Твоя задача — вытащить из мокапов pixel-precise spec для `fe1`+`be4`.
2. **art-concept-v2** — 13 разделов с anatomy, состояниями, таблицами компонентов.
3. **art-concept v1** — палитра + token-map (Payload `--theme-*` ↔ наши site `--c-*`). Не переписывай.
4. **`ui-ux-pro-max` skill** — матрица паттернов admin/CRM (использую). Хочу референсы Linear, Notion, Stripe, Pipedrive admin — но **не копируем**, берём только spacing/density principles.

## 1. Финальные макеты (8 экранов)

Каждый — desktop (1440 px) + tablet (1024 px) + mobile (375 px). Все состояния в одном файле макета.

### 1.1 Login (`/admin/login`)
- Anatomy art-concept-v2 §1 (центрированная карточка-форма 320 px ширина, lockup сверху, копирайт снизу).
- States: default / focused-input / loading-button / error-validation / success-redirect.
- Tokens: `--c-bg`, `--c-card`, `--c-line`, `--c-ink`, `--c-primary`, `--c-accent` (primary CTA), error из `--theme-error-500`.
- A11y: focus-visible 2px outline, aria-invalid на error.

### 1.2 Layout (sidebar + top-bar + canvas) — глобальный shell
- Sidebar 220 px expanded / 64 px collapsed (toggle сохраняется в localStorage).
- Top bar 48 px: breadcrumbs + search + profile.
- Canvas — page-specific.
- Tokens: sidebar bg `--c-bg-alt`, top bar bg `--c-card`, canvas bg `--c-bg`.
- States sidebar link: default / hover / active / focused / disabled.
- A11y: `<nav aria-label>`, `<main>`, skip-link.

### 1.3 Dashboard (`/admin`)
- Greeting (используем существующий `<BeforeDashboardStartHere>` из `site/components/admin/`, не переделываем).
- 4 stat-cards (новые заявки / уник 7д / публ страниц / ошибки CI).
- 6 action-tiles из v1 (`<DashboardTile>` уже написан).
- **Page Catalog widget** — anatomy art-concept-v2 §3.
- Tokens: stat-cards в `--c-card` с border `--c-line`, hover `--c-primary`.

### 1.4 Page Catalog widget (детально, как новый компонент)
- Анатомия:
  - Header bar: `<h3>КАТАЛОГ ОПУБЛИКОВАННЫХ СТРАНИЦ</h3> + counter «53 шт.» + filter ▾ + ⇩CSV`.
  - Table 4 колонки: `Раздел | URL | Обновлено | Статус`.
  - Group rows (Услуги / SD / Кейсы…) — section heading style + counter.
  - Sub rows: URL моно tabular-nums, дата моно tabular-nums, статус ✓ live или ⏱ revalidate-pending.
- Filter dropdown: 9 чекбоксов (Услуги / Sub-services / Районы / Programmatic SD / Кейсы / Блог / B2B / Авторы / Sitemap), с counter рядом.
- Hover row: bg `--c-bg-alt`, courser pointer, `→` icon в правой части.
- Click row → navigate `/admin/collections/<col>/<id>` edit.
- Состояния widget: loading (skeleton 5 строк), error (Error state карточка вместо table), empty (дашборд без публикаций — никогда не должно случиться, но fallback «Создайте первую страницу»).

### 1.5 List view (Services / Cases / Blog)
- Anatomy art-concept-v2 §4.
- Bulk action bar — design state на 3 строки выделены.
- Empty / Loading / Error внутри.
- Pagination — берём готовое из brand-guide «10».

### 1.6 Edit view с Tabs (детально)
- Anatomy art-concept-v2 §5.
- Tabs sticky top.
- Карта tabs по 10 коллекциям (см. таблицу в концепции).
- Has-error tab — красная точка справа от label.
- Превью tab — iframe 1024×768 desktop / 375×667 mobile, draft URL.
- Sticky footer-bar: Status toggle + Отмена + Сохранить (primary янтарный).

### 1.7 Status badges + Bulk action bar
- 5 типов badge: Опубликован / Черновик / В архиве / Новая заявка / Ошибка.
- Pill 4 px radius, padding 4×8, font 11px Inter uppercase.
- Bulk action bar 1c1c1c фон, sticky bottom при селекте.

### 1.8 Empty / 500 / 403 states
- Anatomy art-concept-v2 §7. Та же концепция что error-pages «11.5» из публичного site.
- 3 cards в row на desktop, stack на mobile.

## 2. Spec.md для `fe1`+`be4`

Каждый компонент — отдельный `.spec.md` файл в `design-system/components/admin/`:

```
design-system/components/admin/
├── login/
│   └── admin-login.spec.md       # AdminLogin компонент
├── layout/
│   ├── admin-sidebar.spec.md     # AdminSidebar (220px / 64px)
│   ├── admin-topbar.spec.md      # AdminTopBar (breadcrumbs + search + profile)
│   └── admin-shell.spec.md       # Layout root
├── dashboard/
│   ├── stat-card.spec.md         # 4 cards
│   ├── action-tile.spec.md       # уже частично — обновить
│   └── page-catalog.spec.md      # NEW — основной компонент US-12
├── list/
│   ├── admin-list-view.spec.md   # стилизация native Payload
│   ├── filter-bar.spec.md
│   └── bulk-actions.spec.md
├── edit/
│   ├── admin-tabs.spec.md        # native Tabs field styling
│   ├── form-row.spec.md
│   └── status-footer.spec.md
└── states/
    ├── admin-empty.spec.md
    ├── admin-error.spec.md       # 500 / 403 / 404
    └── admin-loading.spec.md     # skeleton tables
```

Каждый spec — структура из brand-guide v1.7 ([components/*.spec.md](../../../design-system/components/)):
- Purpose
- Variants + States
- Token usage
- Behavior (events, side-effects)
- A11y (ARIA, keyboard, screen reader)
- Responsive breakpoints
- Edge cases (long text, 0 items, error)

## 3. SCSS override extension

`art-concept v1` дал переменные `--theme-*` (root level). v2 нужны selector-level overrides. **Расширь `site/app/(payload)/custom.scss`** (~107 строк сейчас → ~400 строк в v2):

- `.payload__sidebar` — fixes (bg, padding, font).
- `.payload__sidebar-link` — default/hover/active/focused.
- `.payload__sidebar-group` — group labels.
- `.payload__topbar` (если Payload так называет).
- `.payload__breadcrumbs`.
- `.payload__list-view` — стилизация table.
- `.payload__edit-view` + `.payload__tabs`.
- `.payload__button` variants.
- `.payload__badge` (status pills).
- `.payload__form-row`.
- States: `:hover`, `:focus-visible`, `[aria-selected]`, `[disabled]`.

**Внимание:** Payload селекторы могут меняться между minor-версиями. Используй `:where()` для специфичности 0 + защита `[class*="payload-"]` глобально:

```scss
:where([class*="payload__sidebar-link"]) {
  // ...
}
```

## 4. Custom React-компоненты

**Не пишешь сама** — это `fe1` зона. Но **spec у тебя**:

- `<AdminLogin />` — переопределение `admin.components.views.Login` в `payload.config.ts`.
- `<PageCatalog />` — server component для `admin.components.afterDashboard`.
- `<EmptyState />`, `<ErrorState />` — дополнят существующий `<BeforeDashboardStartHere />`.
- `<AdminSidebarBrand />` — может быть; уже есть `BrandLogo`+`BrandIcon`, проверь нужны ли изменения.

## 5. Definition of Done

- [ ] 8 макетов на 3 брейкпоинтах со всеми состояниями.
- [ ] 14 component spec.md файлов в `design-system/components/admin/`.
- [ ] SCSS override map (selectors → tokens) — таблица.
- [ ] A11y: контраст AA, focus-ring, touch ≥ 44 px на mobile, keyboard navigation map.
- [ ] **Interaction-states palette** для всех 5 групп интерактивных элементов admin (см. §5.1) — обязательно для каждого spec.
- [ ] Approval от `art` (меня).
- [ ] Передача в `fe1`+`be4` через `po`.

## 5.1. Interaction-states palette (обязательный deliverable)

**Замечание оператора 2026-04-27 (вторая art-сессия):** в первой версии brief 12.4 были видны только default/active/has-error. Этого недостаточно. Каждое spec **обязано** содержать отдельный раздел `§States` с матрицей. Эталон визуальной палитры — [`brand-guide.html` v1.8.1 §12.4.1 Interaction states palette](../../../design-system/brand-guide.html).

### 5 групп интерактивных элементов admin — все states

| Группа | Состояния (минимум) | Триггер CSS | Token override |
|---|---|---|---|
| **Tabs** | default / hover / active (selected) / pressed (mousedown) / focus-visible / has-error / disabled | `:hover`, `[aria-selected="true"]`, `:active`, `:focus-visible`, `[aria-invalid]`, `[disabled]` | bg / color / border-bottom / weight / opacity / outline |
| **Inputs** | default / hover / focus / filled / disabled / error+message | `:hover`, `:focus`, `[disabled]`, `[aria-invalid]` | bg / border / box-shadow / color / cursor + помощник `[aria-describedby]` |
| **Button primary** | default / hover / pressed / focus-visible / loading / disabled | `:hover`, `:active`, `:focus-visible`, `[aria-busy]`, `[disabled]` | bg / transform / shadow / spinner |
| **Button secondary (ghost)** | default / hover / pressed / focus-visible / disabled | те же без loading | bg / border / color |
| **Sidebar links** | default / hover / active (current route) / focus-visible | `:hover`, `[aria-current="page"]`, `:focus-visible` | bg / color / icon-opacity / left-border |

### Правила

1. **`:focus-visible` ≠ `:focus`** — для mouse-юзера outline после клика не показываем (`:focus-visible` only). Для keyboard — показываем 2px outline `--c-primary` offset 2px.
2. **Transitions:** 120 ms ease на color/bg/border, 80 ms на transform (pressed). Никаких 300 ms+ — admin требует моментальной реакции.
3. **Reduced-motion** (`prefers-reduced-motion: reduce`) — отключаем transform-translate, оставляем opacity/color changes.
4. **Disabled** — не только визуально, но `pointer-events: none` + `aria-disabled="true"` + `cursor: not-allowed`.
5. **Loading** — `[aria-busy="true"]` + spinner 12×12 `currentColor` + `cursor: progress` + блокировка click через `pointer-events: none` (но button остаётся keyboard-focusable для отмены через Esc).
6. **Has-error tab** — красная точка 6×6 `#b54828` справа от label через `::after`. Tab остаётся кликабельным (на ошибочный tab надо иметь возможность зайти и поправить).

### Что в spec.md обязательно

```markdown
## §States

| State | Trigger | bg | text | border | shadow | extra |
|---|---|---|---|---|---|---|
| default | — | #ffffff | #1c1c1c | #e6e1d6 | none | — |
| hover | :hover | — | — | #c4bdaf | — | — |
| focus-visible | :focus-visible | — | — | #2d5a3d | 0 0 0 3px rgba(45,90,61,0.15) | — |
| disabled | [disabled] | #efebe0 | #6b6256 | — | — | cursor: not-allowed; pointer-events: none |
| error | [aria-invalid="true"] | — | — | #b54828 | 0 0 0 3px rgba(181,72,40,0.12) | + helper red |
```

Для каждого состояния — пример HTML/CSS/класс. Без этого spec неполон.

## 6. Не делай

- **Не меняй v1 art-concept** (палитра / типографика / token-map). Если нужно дополнить — говори со мной.
- **Не переписывай Layout Payload** — мы используем native Layout + CSS overrides.
- **Не вводи новые цвета**, всё из палитры v1 (если нужен новый — обоснуй, добавим как exception в `agents/brand/exceptions.md`).
- **Не лезь в реализацию** (`.tsx` фaйлы) — только spec.

## 7. fal.ai применение

**Один точечный кейс** — moodboard для finalisation login screen visual.

Сгенерируй через `fal-ai-media` skill 4-6 reference изображений промптом «admin panel login screen, beige + green color scheme, minimal, professional CRM, no illustrations» — это для **внутреннего moodboard**, не для prod. Сложи в `agents/brand/moodboard-admin.md`. Потом я ревью моделей и финализирую направление.

Никаких AI-картинок на самом login screen — design system запрещает (anti-pattern из brand-guide v1.8 §Anti-patterns admin).

## 8. Координация

- Жду от тебя сначала **AdminLogin + Layout + Dashboard** (3 экрана) → ревью → потом остальные 5.
- Параллельно `cw` пишет copy для login error / empty / errors → когда у меня будет — пришлю тебе.
- `ux` отдаст wireframes раньше тебя — синхронизируйся с ним.
- Финал передаётся `po` для оформления PR `fe1`+`be4`.

## 9. Источники

- [art-concept-v2.md](./art-concept-v2.md) — детальный концепт.
- [brand-guide.html v1.8 §12](../../../design-system/brand-guide.html) — живые mockups.
- [art-concept v1](../admin-visual/art-concept.md) — палитра + типографика + token-map (НЕ переделывай).
- [US-3-admin-ux-redesign/ui-mockups.md](../US-3-admin-ux-redesign/ui-mockups.md) — старые мокапы, посмотри на полезное.
- [site/app/(payload)/custom.scss](../../../site/app/(payload)/custom.scss) — текущий 107-строчный SCSS (v1 переменные, расширяешь до v2 селекторов).
- [site/components/admin/](../../../site/components/admin/) — существующие React-компоненты (Logo, Icon, BeforeDashboard, DashboardTile, icons.tsx). Reuse, не переписывай.
- `~/.claude/skills/ui-ux-pro-max/` — матрица паттернов admin/CRM.
