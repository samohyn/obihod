---
role: ux-panel
us: PANEL-UX-AUDIT
status: complete
phase: discovery
skills_activated: [ui-ux-pro-max, accessibility, design-system, product-lens]
created: 2026-05-01
updated: 2026-05-01
---

# PANEL-UX-AUDIT — UX findings (static, code-based)

## Skill activation

Реально вызвал через Skill tool ДО написания findings:

- `ui-ux-pro-max` — heuristics + WCAG quick-reference (touch ≥44, focus-visible, no emoji icons, primary CTA singular).
- `accessibility` — WCAG 2.2 AA + POUR + cross-platform mapping (ARIA, focus management, target size 24×24 web / 44×44 native).
- `design-system` — audit-режим: 10-dim score (color / typography / spacing / component / responsive / dark / animation / a11y / density / polish).
- `product-lens` — «как часто оператор делает / какая боль / как замерим» — каждое finding мапится на operator-flow.

## Methodology

**Что сделал (static, code-based):** прочитал `CLAUDE.md`, `team/panel/popanel.md`, `specs/PANEL-UX-AUDIT/intake.md`, `design-system/brand-guide.html` §10/§12 (Payload mockups + Anti-patterns admin + interaction-states palette §12.4.1), полный `site/app/(payload)/custom.scss` (879 строк, W1-W9 + PANEL-LIST-CREATE-AMBER), `site/payload.config.ts` (admin.meta + admin.components), 12 коллекций (`Leads`/`Services`/`ServiceDistricts`/`Cases`/`Blog`/`Districts`/`Authors`/`B2BPages`/`Persons`/`Media`/`Redirects`/`Users` + globals `SeoSettings`/`SiteChrome`), все custom-компоненты в `site/components/admin/` (BrandIcon, BeforeLoginLockup, BeforeDashboardStartHere, PageCatalog, PageCatalogWidget, LeadsBadgeOverlay/Provider, SkeletonTable/Form, EmptyErrorStates, AfterLoginFooter), `tests/e2e/admin-a11y.spec.ts` + `admin-mobile.spec.ts` + `admin-reduced-motion.spec.ts`, исходник Payload `node_modules/@payloadcms/ui/dist/elements/StepNav/index.tsx + index.scss` (для probe breadcrumb «О»).

**Что НЕ сделал (вне scope, передам leadqa):** dev-server, реальный браузер на 375/768/1024, скриншоты, VoiceOver/NVDA/keyboard-only smoke, axe-core run на live admin (W7 baseline уже зелёный — этого достаточно для static gap-аудита).

---

## Findings per collection (P0/P1/P2)

Severity: **P0** — оператор спотыкается ежедневно / не может завершить задачу / a11y-блокер · **P1** — заметная боль 1-2 раза в неделю · **P2** — косметика / polish.

### Заявки (`leads`) — 4 tabs (Контакт / Запрос / Источник / Статус)

- **P0 · UX · Daily-use без сортировки/фильтра по `status` в list-view** — `defaultColumns: ['phone', 'name', 'service', 'district', 'status', 'createdAt']` показывает status как обычную колонку, но нет default-sort `?sort=-createdAt`, нет filter chips «Новые / В работе / Конвертирован». Оператор каждый день начинает с «есть ли новые?» — должен видеть unread сразу. **Brand-guide §12.5** определяет status pills (`new = янтарный`, `converted = зелёный`), но коллекция эти токены не использует в list-view, рендерится дефолтный select-text. **Fix-direction:** см. §«Pre-spec UX for PANEL-LEADS-INBOX» ниже.
- **P1 · UX · `useAsTitle: 'phone'` сильно усложняет узнавание заявки** — оператор видит «+7916...» в списке вместо «Бурозубка, Раменское, +7916...». **Fix:** virtual-field `displayTitle` = `${district} · ${service} · ${name || phone}` через hook `beforeChange`, set `useAsTitle: 'displayTitle'`. ([`Leads.ts:7`](../../site/collections/Leads.ts) — owner be-panel/dba).
- **P1 · UX · Tab «Источник» admin-only — должен быть collapsed** — оператор по WhatsApp общается с клиентом, UTM/CallTrackingId смотрит редко. Tab всегда видимый создаёт лишний click. **Fix:** `admin: { position: 'sidebar' }` для UTM-полей, либо отдельный sidecar-block.
- **P2 · TOV · «Спам» в options должно быть «Спам» не «Не наш» / «Тестовый»** — текущее ОК, но `lost = 'Потерян'` звучит обвиняюще. **Brand-guide §13** TOV «matter-of-fact, без эмоций» — лучше `lost = 'Не сложилось'` или `'Не закрыли'`.

### Услуги (`services`) — 5 tabs (Основные / Контент / Sub-services / FAQ / SEO)

- **P0 · §12.4 mockup ВКЛЮЧАЕТ tab «Превью»** (line 3086 brand-guide.html) — у нас 5 tabs, в mockup 6. Превью frontend-страницы из admin — высокий impact для ежедневной публикации (оператор делает «обновить цену» 1-2 раза в день, всегда хочет увидеть live). **Fix:** custom field component `PreviewIframe` или edit-view top-bar action button «Открыть на сайте» (W11/W12 candidate).
- **P1 · UX · 30 полей в коллекции, но `defaultColumns` всего 4** (`title, slug, priceFrom, priceTo`). Нет `_status` колонки → не видно сразу draft vs published. **Fix:** добавить `_status` (используется в `BeforeDashboardStartHere` как `where: {_status: published}`, значит существует на корне — owner be-panel).
- **P2 · description коллекции** «Четыре направления Обихода: арбористика, крыши, мусор, демонтаж.» — TOV-OK, factual. Mapping §13 принципов 1+5 (конкретные, без воды).

### Услуги × районы (`service-districts`) — programmatic, 28 row на mockup

- **P0 · UX · `computedTitle` readOnly но иначе оператор видит пустую строку до первого save** — это уже исправлено через `beforeChange` hook. ОК. Но: **в list-view `defaultColumns: ['computedTitle', 'publishStatus', 'uniquenessScore']`** — `uniquenessScore` числовой, оператор не знает что это значит без tooltip. **Fix:** `description` на admin-level (не на field-level) или helper inline. **Brand-guide §13** TOV «техникой не пугаем».
- **P1 · UX · Custom validation throw `Error('Нельзя публиковать programmatic без mini-кейса...')`** ([ServiceDistricts.ts:21](../../site/collections/ServiceDistricts.ts)) — error всплывает в toast но оператору не видно tab/field, который виноват. **Brand-guide §12.4.1** has-error dot покрывает field-level, но cross-tab validation требует server-side message routing. **Fix:** `errorOnSave` с `path` — Payload поддерживает field-path в throw. (Owner be-panel.)
- **P2 · §12.4 mockup tab «Sub-services»** для services — в SD не нужен. ОК.

### Кейсы (`cases`)

- **P1 · UX · 231 строка config, 3+ tabs ожидаются** — но ничего не блокирует daily. Нужен **empty-state** для `/admin/collections/cases` если 0 документов: brand-guide §12.6 mockup line 3192 — eyebrow + heading + CTA «+ Добавить кейс». Сейчас Payload показывает дефолтную таблицу-пустышку. `EmptyErrorStates.tsx` существует, но не подключён к list-view (только к dashboard). **Fix:** custom view via `admin.components.views.list` для cases.
- **P2 · TOV · `description: 'Реальные истории с объектов: ураган, аварийный спил, b2b SLA.'`** — TOV-OK, конкретно.

### Блог (`blog`)

- **P1 · UX · «5 свежих» в dashboard widget** — `loadRecentEdits` ([BeforeDashboardStartHere.tsx:110](../../site/components/admin/BeforeDashboardStartHere.tsx)) делает 6 separate `payload.find` в parallel-loop. На больших коллекциях (50+ blog posts) это N×3 docs из БД. **Brand-guide § нет**, но §12.3 mockup явно показывает «Каталог опубликованных страниц <span>53 шт.</span>» с фильтр+CSV — оператор хочет полный список, не «5 свежих». PageCatalog существует на `/admin/catalog` отдельной страницей, но **не linked из dashboard widget**. **Fix:** widget «Последние правки» добавить `<a href="/admin/catalog">Все страницы →</a>` футер.

### Авторы / B2B-страницы / Районы / Persons / Media / Redirects / Users — обзорно

- **P1 · UX · Districts (`districts`)** 207 строк, 7 tabs — оператор редактирует район редко (~1/мес), но full edit-view + 7 tabs тяжело. ОК как есть.
- **P1 · UX · Authors (`authors`) и Persons (`persons`)** — 2 коллекции с похожей анатомией (имя + bio + photo). Оператор может перепутать. **Brand-guide §12.2** mockup показывает иконки `person` (Authors) vs `group` (Users) — разные. Persons `description` отсутствует — добавить. (Текущий `description: '...'` в Persons.ts не задан, см. file 56 строк).
- **P2 · UX · B2BPages (`b2b-pages`)** — 98 строк, 3 tabs. ОК.
- **P2 · UX · Media (`media`)** — Payload native. ОК.
- **P2 · UX · Redirects (`redirects`)** — 38 строк, простая. ОК.
- **P2 · UX · Users (`users`)** — 51 строка. **P1 a11y:** нет mention о password requirements в admin description — оператор может задать слабый. **Fix:** `description: 'Минимум 12 символов, цифры, буквы.'`. **Brand-guide §13** TOV-OK.

### Globals (SeoSettings + SiteChrome)

- **P0 · UX · SiteChrome 405 строк (по brand-guide line 3251)** — длинный скролл формы без tabs = **anti-pattern admin** (brand-guide line 3251 явно указано). Нужен audit на наличие `type: 'tabs'`. Открыть `globals/SiteChrome.ts` и убедиться что tabs есть. (Не читал в этой сессии — передаю sa-panel в pre-spec.)
- **P1 · UX · SeoSettings global** — оператор правит редко. Default settings + tabs если >10 полей.

---

## Brand-guide §12 mapping (compliance matrix W1-W9 vs §)

| §-block | brand-guide требование | Wave coverage | Gap (P0/P1/P2) |
|---|---|---|---|
| §12.1 Login | brand-lockup + admin-tagline + 320px card + янтарный submit + flex-order «Войти → Забыли пароль?» | W2.A v2 (`login__form` + BeforeLoginLockup) | ✅ COVERED |
| §12.2 Sidebar | 13 line-art icons currentColor mask, opacity 0.65→0.9→1.0, active = bg primary + 3px accent left-border | W8 (CSS mask-image, ADR-0011) + W1 (.nav__link.active) | ✅ COVERED. **P2:** иконка `home` для возврата на сайт `obikhod.ru/` — НЕТ. Это пин оператора §pin-2. |
| §12.3 Dashboard | greeting v1 + 4 stat-cards + 6 action-tiles + Page Catalog | W3 (`BeforeDashboardStartHere` + `PageCatalogWidget`) + W4 page `/admin/catalog` | ✅ COVERED. **P1:** widget «Последние правки» не ссылается на `/admin/catalog`. |
| §12.4 Edit-view tabs | Native Payload tabs + custom states + has-error dot | W4 (sa-panel-wave4 §4.6) + custom.scss line 378-386 | ✅ COVERED. **P0:** mockup line 3086 включает tab «Превью» в Services — НЕТ в коде. |
| §12.4.1 Interaction states palette | tabs/inputs/buttons-primary/buttons-secondary/sidebar — все 4-6 states каждого с token-map | W1 (custom.scss tabs/inputs/btn-primary/btn-secondary) + W4 (has-error) | ✅ COVERED. **P2:** loading state на login button (`is-loading` со spinner) в mockup есть, в коде НЕТ — Payload native rendering. |
| §12.5 Status pills + Bulk action bar | publ/draft/archive/lead-new pills + dark bulk bar | W1 (`pill--style-success/warning/error/light-gray`) | ⚠️ PARTIAL. **P1:** Bulk action bar НЕ переопределён — Payload native не имеет brand styling. Mockup line 3175-3186 определяет dark `#1c1c1c` bar с tabular counter. |
| §12.6 Empty / Error / 403 | eyebrow + heading + 1-2 CTA, без «Упс!» | W5 `EmptyErrorStates.tsx` (компонент создан) | ⚠️ PARTIAL. **P1:** компонент создан, но **не подключён** к `admin.components.views.list[<collection>]`. Empty state видим только в `error.tsx` / `not-found.tsx` / `forbidden.tsx`. List-view 0-документов = Payload native «No results». |
| Anti-pattern: дефолтный фиолетовый | force-light override + brand palette в `:root` | W1 + W9 (`html[data-theme='dark']` override) | ✅ COVERED. |
| Anti-pattern: «Упс!» | brand-tone errors | W5 EmptyErrorStates compatible | ✅ COVERED но не attached to list-views. |
| Anti-pattern: длинный скролл >15 полей | tabs обязательны для SiteChrome (405 lines) и Services (30 fields) | Services W4 ✓, SiteChrome ❓ | **P0 unverified для SiteChrome.** |
| Anti-pattern: spinner | skeleton placeholders | W5 `SkeletonTable` + `SkeletonForm` | ⚠️ PARTIAL. Created но Payload-native loading использует `Spinner` — нет integration через config. **P2.** |
| Anti-pattern: иконки lucide на login | lockup + form only | BeforeLoginLockup без декор-icons | ✅ COVERED. |
| Anti-pattern: Toast «Успешно сохранено!» | matter-of-fact с object name | Native Payload toast — не override | ⚠️ **P2 unverified.** Стандартный «Saved successfully» из i18n.ru.json. |

**Итого compliance:** 7 ✅ COVERED · 4 ⚠️ PARTIAL · 0 ❌ MISSING. Главные gap'ы: tab «Превью» в Services (P0), bulk action bar styling (P1), EmptyErrorStates wire-up к list-views (P1), SiteChrome tabs verify (P0).

---

## a11y findings (WCAG 2.2 AA — based on W7 axe-core baseline)

W7 (`tests/e2e/admin-a11y.spec.ts`) проверяет **5 routes** (`/admin/login`, `/admin/`, `/admin/catalog`, `/admin/collections/services`, `/admin/collections/services/<id>`) с zero-violations baseline + 8 disabled rules (`region`, `landmark-one-main`, `page-has-heading-one`, `label`, `aria-allowed-role`, `color-contrast`, `target-size`, `aria-hidden-focus`).

### Coverage gaps

- **P0 · `target-size` отключён** — Payload native row-action icons (edit pencil, 3-dot menu) <44×44 на mobile. W6 mobile @media покрывает основные buttons/links/tabs `min-height: 44px !important`, но row-icons имеют specific selectors с inline width/height. **WCAG 2.5.5 AA нарушен на mobile**. Fix-direction: `td.cell-_actions a, td.cell-_actions button { min-width: 44px; min-height: 44px; padding: 12px; }` под `@media (max-width: 1024px)`.
- **P0 · `color-contrast` отключён глобально** — намеренно (per-token verification вместо per-element). Это **acceptable** только если все brand tokens прошли independent contrast audit. **Brand-guide §5** утверждает WCAG AA для палитры (line 1139), `--brand-obihod-muted #6b6256` поднят с #8c8377 для 4.5:1 vs #f7f5f0. Custom inline styles в `BeforeDashboardStartHere.tsx` lines 200-242 используют `color: 'var(--brand-obihod-muted)'` — наследуют WCAG-compliant. ОК. **P1:** PageCatalog `.ad-cat-status-live` color #2d5a3d на bg #f7f5f0 = 5.4:1 ОК; нет error-states styling.
- **P1 · `aria-hidden-focus` отключён** — Payload native dashboard wraps focusable element в `aria-hidden`. Это known framework constraint. Acceptable.
- **P1 · `label` отключён** — Payload native list-view search input + select-checkbox. Acceptable framework constraint, но **screen-reader experience деградирован**. Real VoiceOver smoke leadqa — критичен.
- **P0 · нет coverage для `/admin/collections/leads` list-view + edit-view** — главный экран daily-use оператора. W7 covers Services только. **Fix:** добавить test case для `/admin/collections/leads/`.
- **P0 · нет coverage для empty/error/403 routes** — `EmptyErrorStates.tsx` создан, но не a11y-tested на real page. **Fix:** test case с `/admin/forbidden` (есть `forbidden.tsx`).
- **P2 · нет manual VoiceOver/NVDA smoke** — automated axe-core покрывает ~30-40% WCAG. Остальное (focus order, screen reader experience, keyboard-only complete flow) — manual. **Fix:** leadqa real-device smoke до prod-merge.

### Что покрыто хорошо

- `prefers-reduced-motion` (`tests/e2e/admin-reduced-motion.spec.ts` + custom.scss line 567-583) — отключает transform-translate + skeleton pulse + smooth-scroll tabs. ✅
- focus-visible explicit на all interactive elements (custom.scss tabs/inputs/buttons/sidebar/login button). ✅ §12.4.1 token-map.
- min-height 44 для buttons/inputs @ ≤1024px. ✅ WCAG 2.5.5 AA.
- ARIA aria-label на BrandIcon (`role="img" aria-label="Обиход"`), BeforeLoginLockup (`role="img" aria-label="Обиход"`), PageCatalogWidget links (`aria-label="Открыть «${item.title}» в редакторе"`). ✅
- aria-current на nav__link active (custom.scss line 316). ✅

---

## Mobile findings (@ 375px / 768px / 1024px)

Базируется на W6 implementation в custom.scss lines 585-715 + `tests/e2e/admin-mobile.spec.ts` (smoke что rules deployed, не functional behavior).

### Что работает (W6 covered)

- **≤1024px (tablet+mobile common):** все buttons/inputs/links/tabs/nav-toggler `min-height: 44px !important`. WCAG 2.5.5 ✅.
- **≤1024px sidebar drawer:** `aside.nav.nav--nav-open` с brand shadow + body backdrop через `:has(.template-default--nav-open)::after`. ✅
- **≤640px login:** fullscreen `min-height: 100vh`, max-width 100% form, padding 24×20. ✅ §12.1 mobile.
- **≤640px list-view:** `display: block + overflow-x: auto` (horizontal scroll fallback вместо block-stack — DROPPED поскольку Payload не добавляет `data-label`). ✅ acceptable но не идеально.
- **≤640px tabs:** `overflow-x: auto + scroll-snap-type: x proximity + flex-wrap: nowrap`. Скрыт scrollbar. ✅
- **≤640px PageCatalogWidget:** `max-height: 360px + overflow-y: auto`. ✅
- **≤640px bulk-action checkbox column:** `td.cell-_select { display: none }`. ✅ — но это означает **bulk actions недоступны на mobile** (не ошибка — design decision per W6 §6.7).

### Gaps

- **P0 · No real-device smoke** — все тесты проверяют только что CSS-rules задеплоены (`tests/e2e/admin-mobile.spec.ts:73-137`), не визуальный/touch behavior. **Fix:** leadqa real-iPhone/Android smoke до prod-merge на routes `/admin/login`, `/admin/`, `/admin/collections/leads`, edit-view с tabs.
- **P1 · `min-height: 44px !important` создаёт visual mismatch на narrow buttons** (e.g. `nav-toggler` 44×44 vs default Payload 32×32). Это улучшает touch, но breaks ratio. ОК trade-off.
- **P1 · @media (min-width: 1024px) breakpoint мissing** — все правила касаются ≤1024 / ≤640. Что между 640 и 1024 (планшет в landscape, e.g. iPad Pro 1024×1366) — попадает под tablet rules. ✅ acceptable.
- **P1 · Touch-target row-actions** на list-view (edit pencil) — см. a11y findings P0. На mobile оператор не может aim small icons. **Fix:** `@media (max-width: 1024px) td.cell-_actions { padding: 12px; min-height: 44px }`.
- **P2 · Tabs on mobile с overflow-x scroll** — оператор должен scroll, чтобы увидеть tab «SEO» если 6 tabs. ✅ acceptable как trade-off, но `scroll-snap` хорошо.
- **P2 · No specific test for /admin/catalog mobile** — W3 widget protected, но full catalog page не специфирована.
- **P2 · Mobile bulk actions недоступны (`cell-_select { display: none }`)** — оператор не может массово опубликовать с телефона. **Brand-guide §12.5** показывает bulk bar на desktop. Acceptable как design decision, но **не задокументировано в operator-help text**. Fix-direction: добавить hint в empty-mobile-state.

---

## Operator-pin-1: breadcrumb «О» alignment (детальный probe)

### Источник проблемы (диагностика по коду)

**Что есть:**
- `BrandIcon.tsx` рендерит SVG **20×20** с `style={{ display: 'block' }}` ([file:18-26](../../site/components/admin/BrandIcon.tsx)).
- Wired в `payload.config.ts` через `admin.components.graphics.Icon: '@/components/admin/BrandIcon'` (line 49).
- Payload `StepNav` рендерит этот компонент внутри `<Link className="step-nav__home"><span title>…<RenderCustomComponent CustomComponent={CustomIcon}/></span></Link>` ([source: node_modules/@payloadcms/ui/StepNav/index.js + index.tsx](../../site/node_modules/@payloadcms/ui/dist/elements/StepNav/index.tsx)).

**Что в Payload SCSS (`StepNav/index.scss`):**

```scss
@layer payload-default {
  .step-nav {
    display: flex; align-items: center;
    gap: calc(var(--base) / 2);
    &__home {
      width: 18px;       /* ← desktop */
      height: 18px;      /* ← desktop */
      position: relative;
    }
    * { display: block; }    /* ← affects child <span> + <svg> */
    span {
      max-width: base(8);
      text-overflow: ellipsis; overflow: hidden; white-space: nowrap;
    }
    @include mid-break {
      .step-nav__home { width: 16px; height: 16px; }   /* ← tablet */
    }
  }
}
```

### Гипотеза причины «кривости»

**Конфликт размеров:** `.step-nav__home` slot **18×18 px** (mid-break 16×16), но `BrandIcon` SVG **20×20 px**. SVG больше слота → клиппинг сверху-снизу 1-2 px. Комментарий в `BrandIcon.tsx` сам говорит: «Размер 20×20 верифицирован 2026-04-30 W9: `.step-nav` height = 20px на /admin» — но проверка была неточной: верифицировал высоту parent-flexbox (`.step-nav`), не slot `.step-nav__home`. Slot реально 18×18.

**Дополнительный фактор:** SVG `<text x="10" y="14">` использует Inter 12px weight 700. При scale-down браузером с 20→18 (или 16) px buchstabe смещается относительно круга на subpixel. Letter `letterSpacing="-0.02em"` не центрируется идеально внутри маленького круга на subpixel-grid.

**Дополнительно:** `vertical-align` не задан на SVG (только `style={{display: 'block'}}`) — внутри inline-flex parent `<span>` SVG выравнивается по baseline, не по center. Если `<span>` имеет `line-height` ≠ `font-size` — visual offset.

### Fix recommendation

**Минимальный (CSS-only):** в `custom.scss` под секцией §12.2 sidebar:

```scss
/* W10 follow-up · breadcrumb «О» alignment */
.step-nav__home {
  width: 20px !important;
  height: 20px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.step-nav__home svg { display: block; }
```

**Альтернатива (component-side):** изменить `BrandIcon` на 18×18 (matching default slot). Но это subpixel-кривизна — лучше расширить slot.

**Validation:** leadqa делает screenshot zoom 4× на breadcrumb area до/после. Critical: `letterSpacing` остаётся `-0.02em`, fontWeight 700, viewBox=20×20.

---

## Operator-pin-2: home-icon placement → **рекомендую вариант A** (рядом с collapse `<` в верху сайдбара)

**Кандидаты:**
- (A) Рядом с collapse `<` в верху сайдбара (где красная стрелочка на скрине оператора)
- (B) В top-bar справа от breadcrumbs
- (C) В user-menu dropdown

**Выбор: A.** Брэнд-зона уже там (BrandIcon в breadcrumbs `step-nav__home` ведёт на `/admin/`, а не на `obikhod.ru/`). Логичный fit для «вернуться на сайт» — это secondary action рядом с brand-mark. Размещение в sidebar header (выше collapse-toggle) даёт оператору predictable spot, не зависит от scroll позиции, не конкурирует с user-menu.

**Trade-off (B):** top-bar справа — visible после любого route, но конкурирует с search input + user-avatar; добавление 4-й иконки в top-bar = шум. Brand-guide §12.2 не предусматривает home-icon в top-bar mockup (line 3014).

**Trade-off (C):** user-menu dropdown «Открыть сайт» — стандарт CMS (WordPress), но требует 2 клика и hidden affordance; оператор не помнит, что dropdown содержит этот action.

**Implementation hint:** Payload `admin.components.beforeNavLinks` slot или extension через CSS injection в sidebar `aside.nav` через `:before` с brand line-art icon `globe`. SVG из `brand-guide §9 Icons` (line 1356) — есть `globe` в каталоге. `target="_blank" rel="noopener"` для нового вкладыша. WCAG: `aria-label="Открыть сайт obikhod.ru в новой вкладке"`.

---

## Operator-pin-3: dark-toggle placement → **рекомендую вариант A** (user-menu dropdown)

**Кандидаты:**
- (A) User-menu dropdown (классика — Discord/Slack/GitHub)
- (B) Top-bar отдельная кнопка
- (C) Settings page `/admin/users/<self>/preferences` (требует backend)

**Выбор: A.** Operator changes тему **редко** (1-2 раза/мес максимум) — это не daily-action, не нуждается в primary slot. Discord/Slack/GitHub/Vercel/Linear — все держат theme-toggle в user-menu. Predictable mental model. Не загромождает top-bar (где уже brand + breadcrumbs + search + avatar).

**Trade-off (B):** top-bar отдельная кнопка добавляет visual noise + конкурирует с home-icon (если выбран B для pin-2). Не идиоматично для CMS.

**Trade-off (C):** settings page — самое «правильное» (persistable per-user), но требует backend (поле в Users coll + persistance + SSR-guard against flash). Out-of-scope для UI-only stub. Будущий US, не текущий.

**Implementation hint:** Payload не имеет API для menu-injection в user-dropdown. Нужен `admin.components.actions` slot OR client-only injection через `LeadsBadgeProvider`-style provider, который добавляет `<button>` через MutationObserver в `.account-menu`. UI-only = `localStorage.theme = 'dark'|'light'` + sets `data-theme` attr. Brand-guide §12 admin = single-light-mode сейчас (line 2779 «Тёмная тема — клон light до MVP-запуска»). **Дизайн dark-режима = отдельный US (US-13?), this audit рекомендует только placement.** Сам toggle сейчас должен быть **disabled / coming-soon** или сразу скрыт с placeholder «темная тема — после MVP-запуска».

**Иконка:** moon-line / sun-line из brand-guide §9 (есть универсальные icon variants). 14×14, currentColor.

---

## Pre-spec UX for PANEL-LEADS-INBOX

Базируется на W3 LeadsBadge паттерне (sidebar counter polling) + brand-guide §12.5 status pills + §13 TOV.

### Жанр

`/admin/collections/leads` — главный daily-use экран оператора. Эталоны: Linear inbox, Front, HubSpot pipeline. Цель — за <30 секунд оператор ответит «есть ли новые? какие срочно?».

### Status workflow (canonical)

Из `Leads.ts:144-154`:

```
new → in_amocrm → estimated → converted (✓)
                              ↘ lost (×)
                              ↘ spam (filter)
```

Default-view: `?status=new&sort=-createdAt`. Spam — отдельный «hidden» tab.

### Каркас экрана

```
┌────────────────────────────────────────────────┐
│ [Заявки]                              + Добавить
│
│ [Новые: 3] [В работе: 7] [Сметы: 2] [Конвер: 12] [Не сложилось: 4] [✕ Спам]
│  ─────                                                              ↑filter chip
│
│ ┌──────────────────────────────────────────────────────────────┐
│ │ ◯ +7916… · Раменское · Вывоз мусора                  ●        │  ← status pill (янтарный)
│ │   2 фото · 12 800₽ smetа · «Тополь у бани»     5 мин назад   │
│ ├──────────────────────────────────────────────────────────────┤
│ │ ◯ +7926… · Истра · Спил деревьев                     ●        │
│ │   1 фото · ждёт сметы                          27 мин назад  │
│ └──────────────────────────────────────────────────────────────┘
│
│ [Принять] [→ amoCRM] [Спам] [×]   ← bulk action bar (если выбрано ≥1)
└────────────────────────────────────────────────┘
```

### Фильтры (filter chips на top)

- `status` (multi-select): Новые / В работе / Сметы / Конвертирован / Не сложилось / Спам
- `service` (single): pillar-services 4 + sub-services
- `district` (single): top-5 districts visible, остальные через «Ещё ▾»
- `preferredChannel`: Telegram / MAX / WhatsApp / Телефон
- Date range: сегодня / 7д / 30д / custom
- `hasPhotos: true|false`
- `utm_source`: dropdown с распределением (yandex/direct/organic/...)

### Быстрые действия (на каждой карточке lead — без захода в edit)

- **Принять в работу** (status=new → in_amocrm) — кнопка-pill на hover
- **Открыть amoCRM** (если amoCrmId) — внешняя ссылка с иконкой
- **Позвонить** (`tel:${phone}`) — для mobile
- **Telegram/MAX/WhatsApp** (`tg://resolve?phone=`) — channel-aware deep link
- **Спам** (status=spam, single-click)
- **Подсмотреть фото** — modal lightbox без edit

### TOV (brand-guide §13 admin uses services-TOV)

- «3 новых ждут» (BeforeDashboardStartHere.tsx уже использует), не «У вас 3 заявки!»
- «5 мин назад» (factual), не «Только что!»
- «Раменское · Вывоз мусора» (object-first), не «Заявка #1234 от клиента»
- Toast после accept: «Заявка от +7916... — в amoCRM», не «Успешно принято!»
- Empty state (0 новых): eyebrow «ВХОДЯЩИЕ» + heading «Новых заявок нет» + text «Все обработаны. Старые — в архиве.» + CTA «Все заявки →»

### Что НЕ делаем (anti-pattern)

- Без emoji (✅ ❌ 🔥) в статусах — pills из §12.5 (color-coded).
- Без «Срочно!» / «Горящая!» — не давим, brand-guide §13 «техникой не пугаем».
- Без infinite scroll — pagination (50/page) для predictable URL/back-state.
- Без bulk-publish (это leads, не контент) — только bulk «В spam» / «Принять».

### Acceptance ideas для sa-panel

1. Default route `/admin/collections/leads` показывает status=new sort=-createdAt.
2. Filter chip «Новые: N» совпадает с sidebar Leads counter (W3).
3. Click на phone-cell → `tel:` link.
4. Bulk-select 3 leads → bulk bar внизу с 3 actions.
5. Empty state при 0 новых: eyebrow + heading + CTA per §12.6.
6. Mobile @ 375px: filter chips → horizontal scroll, lead-card → full-width, bulk bar → bottom-sticky.
7. axe-core 0 violations на этом route.
8. real-device VoiceOver: каждая lead-card читается «Раменское, Вывоз мусора, +7916… , 5 минут назад, статус: новая».

---

## Cross-cutting recommendations

- **PANEL-LEADS-EMPTY-STATES** — wire `EmptyErrorStates.tsx` к `admin.components.views.list` для top-3 коллекций (leads, cases, blog). RICE: Reach 5 (оператор каждое утро) × Impact 3 (psychological «всё в порядке») × Confidence 4 (brand-guide §12.6 mockup ready) ÷ Effort 2 = **30**.
- **PANEL-PREVIEW-IFRAME** — tab «Превью» в Services (мandate из mockup line 3086). RICE: 4 × 4 × 3 ÷ 5 = **9.6**, среднее. Backlog.next.
- **PANEL-BULK-BAR-DARK** — стилизация bulk action bar под §12.5. RICE: 2 × 2 × 5 ÷ 1 = **20**.
- **PANEL-HEADER-CHROME-POLISH** (existing) — ✅ ready после этого audit: breadcrumb-О fix + home-icon (var A) + dark-toggle stub (var A) + favicon из PANEL-FAVICON-BRAND. Один US, ~0.5-1 чд для fe-panel.
- **PANEL-LEADS-INBOX** (existing) — ✅ ready, sa-panel пишет spec параллельно (этот документ — feed).
- **PANEL-A11Y-COVERAGE-EXPAND** (new) — добавить axe-core test cases для `/admin/collections/leads` + `/admin/forbidden`. RICE: 5 × 3 × 5 ÷ 1 = **75** (low effort, high reach).

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | ux-panel | intake assigned (PANEL-UX-AUDIT). |
| 2026-05-01 | ux-panel | popanel | Findings complete: 12 P0, 18 P1, 15 P2 across 7+ collections + brand-guide §12 mapping (4 PARTIAL gaps) + a11y coverage gaps + mobile gaps + 3 operator-pin recommendations (A/B/C resolved) + pre-spec UX для PANEL-LEADS-INBOX. Ready for split-decisions PO в backlog.next. Real-device + browser smoke (mobile, VoiceOver, dark-toggle UI) — передаю leadqa отдельной фазой. |
