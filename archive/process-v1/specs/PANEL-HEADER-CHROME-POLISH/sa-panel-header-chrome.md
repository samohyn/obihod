---
us: PANEL-HEADER-CHROME-POLISH
title: Polish-волна header /admin — home-icon + dark-toggle stub + breadcrumb «О» fix
team: panel
po: popanel
type: feature + bug
priority: P1
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: []
related: [PANEL-UX-AUDIT, US-12-W8, US-12-W9, PANEL-DARK-THEME-LOGIC]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, ui-styling, frontend-patterns, accessibility]
---

# PANEL-HEADER-CHROME-POLISH — Spec

## Skill activation (iron rule)

Реально вызвал через Skill tool ДО написания spec:

- `design-system` — audit-режим: 10-dim score применяю к 3 sub-tasks (consistency / a11y / polish), token-mapping на §12.4.1.
- `ui-styling` — token-correct CSS, mask-image паттерн (как в W8), `currentColor` glyphs.
- `frontend-patterns` — Custom Hook `useToggle` для ThemeToggleStub, render-once pattern для server-component (NavHomeLink), composition over inheritance.
- `accessibility` — WCAG 2.2 AA: focus-visible, aria-label, target-size 24×24 web (44×44 на mobile из W6), aria-pressed для toggle, aria-hidden для декор-icon, prefers-reduced-motion-aware transitions.

## Контекст

UX audit ([note-uxpanel.md](../PANEL-UX-AUDIT/note-uxpanel.md)) выявил 3 точечных gap в header chrome /admin, эскалированных оператором 2026-05-01:

1. **Pin-1 — breadcrumb «О» «кривая»**: probe-диагноз ux-panel — конфликт размеров. `BrandIcon.tsx` рендерит SVG 20×20, но Payload native slot `.step-nav__home` = 18×18 desktop / 16×16 mid-break (verified в [`node_modules/@payloadcms/ui/dist/elements/StepNav/index.scss`](../../site/node_modules/@payloadcms/ui/dist/elements/StepNav/index.scss)). SVG больше slot → клиппинг 1-2px сверху-снизу + subpixel jitter `<text>` внутри `<circle>`. W9 commit assumed «20×20 верифицирован» — но измерял parent flexbox `.step-nav`, не сам slot.
2. **Pin-2 — нет «На главную сайта»**: brand-guide §12.2 sidebar mockup не предусматривает обратный путь на публичный `obikhod.ru/`. Оператор каждый день переключается «панель → сайт → панель», теряет ~5 секунд на ручной URL.
3. **Pin-3 — нет переключателя темы**: brand-guide §12 admin = single-light-mode (line 2779 «Тёмная тема — клон light до MVP-запуска»). Полная реализация dark-theme — отдельный US (`PANEL-DARK-THEME-LOGIC`, panel.later, blocked by токены §5 dark-mode не верифицированы). В этой волне — только UI-only stub: button с sun↔moon swap on click, БЕЗ persistence, БЕЗ реального theme apply. Это закрывает оператора визуально и резервирует placement, не открывая backend-работу.

Все 3 gap'а тематически связаны (header / top-bar / sidebar chrome), переключают ровно одну зону файлов (`custom.scss` + 2 новых компонента + 2 slot-wirings в `payload.config.ts`), идут на одном PR без cross-team координации. Объединяем в одну polish-волну.

## Цель

После merge оператор:

- Открывает `/admin/collections/services/<id>` — иконка «О» в breadcrumbs стоит ровно в круге, не «кривая» при zoom 100% и при mid-break (≤1024px).
- Видит в sidebar перед списком коллекций line-art иконку «домик» с подписью «На сайт». Клик открывает `obikhod.ru/` в новой вкладке. Mobile drawer (W6) — то же место в шапке drawer'а.
- Открывает settings-popup (gear-icon рядом с logout в sidebar) — видит пункт «Тёмная тема — coming soon» с sun-icon. Клик визуально подменяет на moon-icon. Перезагрузка страницы — снова sun (это design-decision, не баг).

Метрика успеха операторская: «не возвращаюсь к этому в течение 30 дней» (нулевой post-merge feedback по этим 3 пинам — критерий closure).

## Sub-tasks

### A · Breadcrumb «О» alignment fix (Pin-1)

**Owner:** fe-panel · **Effort:** 0.15 чд

**Probe-summary** (из ux-panel):
- `BrandIcon.tsx` SVG 20×20 (verified [BrandIcon.tsx:18-26](../../site/components/admin/BrandIcon.tsx)).
- Payload native `.step-nav__home` slot 18×18 desktop, 16×16 на mid-break.
- Payload `.step-nav * { display: block }` применяется к `<span>` wrapper и `<svg>` — нет flex-centering.
- Не задан `vertical-align` / `align-items` на parent — visual baseline-offset.

**Fix-direction (CSS-only, custom.scss)**

Добавить новую секцию в `custom.scss` после §8.2 sidebar icons (после line ~834), под лейблом `WAVE 10 · HEADER CHROME POLISH (PANEL-HEADER-CHROME-POLISH §A)`:

```scss
/* §A · Breadcrumb «О» — расширяем slot 18×18 → 20×20 под BrandIcon SVG.
 * Probe ux-panel 2026-05-01: native .step-nav__home width/height 18px (desktop)
 * и 16px (mid-break) клиппят 20×20 SVG. Решение по решению оператора 2026-05-01:
 * расширить slot, не уменьшать SVG (SVG 20×20 нужен для viewBox центрирования
 * <text x=10 y=14> кириллической «О» weight 700 letterSpacing -0.02em).
 *
 * !important — reason: Payload @layer payload-default override
 * (verified W8/W9, аналогично mobile responsive overrides). */
.step-nav__home {
  width: 20px !important;
  height: 20px !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

/* SVG внутри slot: убираем `display: block` от Payload `.step-nav * { display: block }`
 * через явное flex-child + height/width 100% (SVG растёт под slot). */
.step-nav__home > span,
.step-nav__home > a > span {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.step-nav__home svg {
  display: block;
  width: 20px;
  height: 20px;
}

/* Mid-break (≤1024px) — Payload native ужимает slot до 16px.
 * Перебиваем: оставляем 20×20 даже на tablet — у нас target ≥44 уже покрыт W6
 * mobile rules для всех buttons/links, breadcrumb home — visual logo-mark,
 * читаемость > tablet-fitting. */
@media (max-width: 1024px) {
  .step-nav__home {
    width: 20px !important;
    height: 20px !important;
  }
  .step-nav__home svg {
    width: 20px;
    height: 20px;
  }
}
```

**Edge-cases:**
- Mobile ≤640px: W6 §6.1 не трогает breadcrumbs — наша 20×20 не конфликтует с table block-fallback.
- `prefers-reduced-motion`: BrandIcon без анимаций, fix не вводит transitions — никакого guardrails не требуется.
- `[data-theme='dark']`: BrandIcon использует CSS-vars `--brand-obihod-primary` / `--brand-obihod-on-primary`, force-light override уже покрывает.

**AC**

- **AC-A.1** На `/admin/`, `/admin/collections/leads/<id>`, `/admin/collections/services/<id>` иконка «О» в breadcrumbs визуально центрирована в круге, не клиппится сверху-снизу при zoom 100% / 200% / 400% (WCAG 1.4.4 SC reflow).
- **AC-A.2** На viewport 1024×768 (mid-break) — то же поведение, 20×20 не ужимается до 16×16.
- **AC-A.3** focus-visible на `.step-nav__home a` (Payload native pseudo-element rule сохранён) — outline вокруг 20×20 корректный, не перекошен.
- **AC-A.4** screenshot evidence от qa-panel: `screen/header-chrome-pin1-before.png` (текущее prod) + `screen/header-chrome-pin1-after.png` (PR build) с 4× zoom на breadcrumb area. Diff visible.
- **AC-A.5** Никаких regressions на /admin/login (там нет step-nav) и /admin/dashboard (тот же step-nav).

---

### B · Home-link в sidebar — `beforeNavLinks` slot (Pin-2 Variant A)

**Owner:** fe-panel · **Effort:** 0.35 чд

**Решение размещения (popanel + ux-panel):** Variant A — рядом с native collapse / в начале sidebar `nav__wrap`. Реализация: native Payload slot `admin.components.beforeNavLinks` (verified в [`@payloadcms/next/dist/elements/Nav/index.js:108-124,163`](../../site/node_modules/@payloadcms/next/dist/elements/Nav/index.js) — slot рендерится перед `<DefaultNavClient>` внутри `<nav class="nav__wrap">`). Это первый visible link в sidebar выше всех NavGroup'ов — exactly где оператор показал красную стрелочку.

**Glyph выбор:** brand-guide §9 (line 1356) перечисляет 4 линейки иконок по 22+9+9+9 = 49 line-art glyph'ов в едином стиле (`viewBox 0 0 24 24`, `stroke 1.5`, `currentColor`, `round`). Среди 13 admin-sidebar иконок в W8 (custom.scss lines 780-833) **уже есть `globe+search`** для SeoSettings. Для home-link используем **простой line-art house** в том же стиле (соответствует W8 visual language: rect + path roof + опциональная door):

```svg
<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'>
  <path d='M3 11 L12 4 L21 11'/>
  <path d='M5 10 L5 20 L19 20 L19 10'/>
  <path d='M10 20 L10 14 L14 14 L14 20'/>
</svg>
```

Это композитный «домик» — крыша + стены + дверь, читается на 14×14, currentColor — наследует sidebar text color (default `#2b2b2b` ink, hover `#1c1c1c`, active `#f7f5f0` on-primary). Стилистически идентичен `b2b-pages` (2-buildings) и `cases` (folder) glyphs из W8.

**Если оператор/art решит, что house недостаточно:** альтернатива — `arrow-out-to-site` (стрелка наружу), которую W8 не использует. Но house более брэндово (Обиход = «порядок дома») и не требует art-консультации. **Spec идёт с house, escalation не нужен.**

**Implementation**

1. Создать `site/components/admin/NavHomeLink.tsx` (server component, FC):

```tsx
import type { FC } from 'react'

/**
 * NavHomeLink — sidebar link «На сайт» для возврата на публичный obikhod.ru.
 *
 * Wired через admin.components.beforeNavLinks (payload.config.ts) — рендерится
 * первой записью внутри <nav class="nav__wrap"> перед native NavGroups.
 *
 * - target="_blank" + rel="noopener noreferrer" (security + UX: не теряем admin tab)
 * - aria-label полный («На сайт obikhod.ru, открыть в новой вкладке»)
 * - className `nav__link nav__link--home` — наследует W1+W8 sidebar styling
 *   (focus-visible, hover, opacity 0.65→0.9), но добавляем suffix для §A CSS hook
 * - SVG 14×14 line-art currentColor (W8 visual language)
 *
 * Spec: PANEL-HEADER-CHROME-POLISH §B.
 */
const NavHomeLink: FC = () => {
  const href = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://obikhod.ru/'
  return (
    <a
      className="nav__link nav__link--home"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="На сайт obikhod.ru, открыть в новой вкладке"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3 11 L12 4 L21 11" />
        <path d="M5 10 L5 20 L19 20 L19 10" />
        <path d="M10 20 L10 14 L14 14 L14 20" />
      </svg>
      <span className="nav__link-label">На сайт</span>
    </a>
  )
}

export default NavHomeLink
```

2. В `payload.config.ts`, в `admin.components`:

```ts
admin: {
  components: {
    // ...existing...
    beforeNavLinks: ['@/components/admin/NavHomeLink'],
  },
}
```

3. В `custom.scss`, после §A:

```scss
/* §B · Home-link в sidebar (Pin-2 Variant A).
 * Renders первым в .nav__wrap через beforeNavLinks slot. Наследует W1+W8
 * .nav__link styling (font, padding, opacity-on-states). Добавляем:
 *   - визуальный отступ ниже (group separator)
 *   - inline-flex для SVG + label gap
 *   - inline SVG (НЕ ::before mask-image как W8) — link не ведёт на коллекцию,
 *     не имеет href[*=collections/...] selector, и SVG нужен для target=_blank
 *     external-arrow visual cue. */
.nav__link--home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--brand-obihod-line);
  color: var(--brand-obihod-ink-soft);
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  transition: color var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard),
              background-color var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard);
}

.nav__link--home svg {
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard);
}

.nav__link--home:hover {
  color: var(--brand-obihod-primary);
  background-color: var(--brand-obihod-paper);
  text-decoration: none;
}
.nav__link--home:hover svg { opacity: 0.9; }

.nav__link--home:focus-visible {
  outline: none;
  box-shadow: var(--brand-obihod-shadow-focus-primary);
  border-radius: var(--brand-obihod-radius-sm);
}

/* Mobile (≤1024px) — touch target +1px gap to не залипал к following NavGroup. */
@media (max-width: 1024px) {
  .nav__link--home {
    min-height: 44px; /* WCAG 2.5.5, зеркало W6 §6.3 */
    padding: 12px;
  }
}
```

**AC**

- **AC-B.1** В sidebar `/admin/` (любая страница) первым видимым элементом списка стоит ссылка «На сайт» с house-icon слева, до первой NavGroup `Заявки`.
- **AC-B.2** Click на ссылку открывает `obikhod.ru/` (или `NEXT_PUBLIC_SITE_ORIGIN` если задан) в новой вкладке. Текущая admin tab не теряется.
- **AC-B.3** `target="_blank" rel="noopener noreferrer"` (security: предотвращает window.opener доступ).
- **AC-B.4** **a11y:** `aria-label="На сайт obikhod.ru, открыть в новой вкладке"` (полный context для screen-reader). SVG `aria-hidden="true" focusable="false"` (декор). Tab-order: ссылка получает фокус ДО первого NavGroup.
- **AC-B.5** focus-visible с brand-зелёным ring (`--brand-obihod-shadow-focus-primary`).
- **AC-B.6** **Mobile @ 375px** (W6 sidebar drawer): ссылка видима в открытом drawer, touch-target ≥44×44 (WCAG 2.5.5 AA).
- **AC-B.7** Cursor: `prefers-reduced-motion`: реализованный transition через design-system tokens (`--brand-obihod-duration-fast`) уже respect-aware (W6 §reduced-motion). Никаких extra rules.
- **AC-B.8** Никаких side-effect на остальные .nav__link (W1 + W8) — наш `--home` modifier НЕ перебивает existing rules.
- **AC-B.9** screenshot evidence от qa-panel: `screen/header-chrome-pin2-desktop.png` (1440×900) + `screen/header-chrome-pin2-mobile.png` (375×667 with open drawer).

---

### C · Dark-theme toggle UI-only stub в settings menu (Pin-3 Variant A)

**Owner:** fe-panel · **Effort:** 0.4 чд

**Решение размещения:** Variant A с уточнением через native Payload API. UX audit рекомендует «user-menu dropdown» — но Payload не имеет user-menu в admin (отличается от §30 site-header дизайна). **Эквивалент в admin = `admin.components.settingsMenu`** (verified в [`@payloadcms/next/dist/elements/Nav/SettingsMenuButton/index.js`](../../site/node_modules/@payloadcms/next/dist/elements/Nav/SettingsMenuButton/index.js)) — gear-icon popup в `nav__controls` рядом с Logout. Семантически это и есть admin-аналог user-menu (Discord/Slack/GitHub паттерн в Payload идиоматике).

**Альтернатива (afterNavLinks)** — отдельная строка в sidebar внизу. Отвергнута: загромождает sidebar, не идиоматично, повышает discovery noise (toggle темы — не daily action).

**Реализация: client component с `useToggle` hook**

1. Создать `site/components/admin/ThemeToggleStub.tsx`:

```tsx
'use client'

import { useState } from 'react'

/**
 * ThemeToggleStub — UI-only переключатель темы для admin.
 *
 * UI-only (по решению оператора 2026-05-01):
 *   - на click: визуальная подмена sun ↔ moon icon
 *   - НЕТ persistence (localStorage/cookie/Payload preferences)
 *   - НЕТ реального theme apply (data-theme attr НЕ меняется)
 *   - на reload — возвращается в default (sun = light)
 *
 * Полная dark-theme логика — отдельный US PANEL-DARK-THEME-LOGIC
 * (blocked by §5 brand-guide dark-mode tokens verification).
 *
 * Размещён в admin.components.settingsMenu — gear-popup в nav__controls.
 *
 * a11y:
 *   - role="menuitem" (родительский Popup из @payloadcms/ui это уже Menu)
 *   - aria-pressed отражает visual state (true = moon visible)
 *   - aria-label полный с «coming soon» — пользователь понимает, что persist отсутствует
 *
 * Spec: PANEL-HEADER-CHROME-POLISH §C.
 */
export default function ThemeToggleStub() {
  const [isDark, setIsDark] = useState(false)

  return (
    <button
      type="button"
      className="theme-toggle-stub"
      onClick={() => setIsDark((v) => !v)}
      aria-pressed={isDark}
      aria-label={
        isDark
          ? 'Тёмная тема (демо · переключение пока не сохраняется)'
          : 'Светлая тема (демо · переключение пока не сохраняется)'
      }
      title="Тёмная тема — coming soon"
    >
      {isDark ? (
        // Moon — line-art, brand-guide §9 stroke 1.5 currentColor
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true" focusable="false"
        >
          <path d="M20 14.5 A8 8 0 0 1 9.5 4 A8 8 0 1 0 20 14.5 Z" />
        </svg>
      ) : (
        // Sun — line-art, 8 rays + circle
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true" focusable="false"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2 L12 4" /><path d="M12 20 L12 22" />
          <path d="M2 12 L4 12" /><path d="M20 12 L22 12" />
          <path d="M5 5 L6.5 6.5" /><path d="M17.5 17.5 L19 19" />
          <path d="M5 19 L6.5 17.5" /><path d="M17.5 6.5 L19 5" />
        </svg>
      )}
      <span className="theme-toggle-stub__label">
        {isDark ? 'Тёмная тема' : 'Светлая тема'}
      </span>
    </button>
  )
}
```

2. В `payload.config.ts`, в `admin.components`:

```ts
admin: {
  components: {
    // ...existing...
    settingsMenu: ['@/components/admin/ThemeToggleStub'],
  },
}
```

> **Verify before merge** (do/fe-panel): `admin.components.settingsMenu` в Payload 3.x принимает массив компонентов, верифицировано через `node_modules/@payloadcms/next/dist/elements/Nav/SettingsMenuButton/index.js:18` (`if (!settingsMenu || settingsMenu.length === 0) return null` — null-safe), и `RenderServerComponent` wrapper в `Nav/index.js:79-90`. Если SettingsMenuButton не появляется в DOM при добавлении — fallback Plan B: рендерить через `afterNavLinks` отдельной строкой в sidebar внизу. **Решение fallback на fe-panel при первой DOM-проверке.**

3. В `custom.scss`, после §B:

```scss
/* §C · Theme toggle stub (Pin-3 Variant A · admin.settingsMenu).
 * UI-only — никаких реальных theme switching хуков (PANEL-DARK-THEME-LOGIC). */
.theme-toggle-stub {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  background: transparent;
  border: 0;
  border-radius: var(--brand-obihod-radius-sm);
  color: var(--brand-obihod-ink-soft);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard),
              color var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard);
}

.theme-toggle-stub svg {
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity var(--brand-obihod-duration-fast) var(--brand-obihod-ease-standard);
}

.theme-toggle-stub:hover {
  background-color: var(--brand-obihod-paper);
  color: var(--brand-obihod-primary);
}
.theme-toggle-stub:hover svg { opacity: 0.9; }

.theme-toggle-stub:focus-visible {
  outline: none;
  box-shadow: var(--brand-obihod-shadow-focus-primary);
}

/* Pressed state (aria-pressed=true) — moon visible — слегка enhance opacity */
.theme-toggle-stub[aria-pressed='true'] svg { opacity: 1; }
.theme-toggle-stub[aria-pressed='true'] {
  color: var(--brand-obihod-primary);
}

@media (max-width: 1024px) {
  .theme-toggle-stub {
    min-height: 44px; /* WCAG 2.5.5 */
  }
}
```

**AC**

- **AC-C.1** В sidebar `/admin/` (любая страница) кнопка gear (settings-menu) рендерится в `nav__controls` рядом с logout (native Payload UI). Если ещё не было items в settingsMenu — теперь появляется.
- **AC-C.2** Click на gear → popup с пунктом «Светлая тема» + sun-icon.
- **AC-C.3** Click на пункт → визуальная подмена на «Тёмная тема» + moon-icon. Popup остаётся открытым (Payload native Popup behavior).
- **AC-C.4** Reload страницы (F5) → возвращается в default «Светлая тема» (sun) — это design decision, не баг (зафиксировано в `aria-label` «переключение пока не сохраняется» + `title` «coming soon»).
- **AC-C.5** **`data-theme` attr на `<html>` НЕ меняется** — никакого реального theme apply. Подтверждается DOM debug.
- **AC-C.6** **a11y:** `aria-pressed` отражает state (`false` default, `true` после click). `aria-label` содержит pojasненние «переключение пока не сохраняется». SVG `aria-hidden="true" focusable="false"`.
- **AC-C.7** focus-visible с brand-зелёным ring.
- **AC-C.8** **Mobile @ 375px:** toggle доступен через open drawer → tap gear → popup. Touch target ≥44×44.
- **AC-C.9** **`prefers-reduced-motion`:** transitions через `--brand-obihod-duration-fast` token (uses W6 reduced-motion guardrails). Никаких extra rules.
- **AC-C.10** screenshot evidence: `screen/header-chrome-pin3-light.png` (default) + `screen/header-chrome-pin3-dark.png` (после click) + `screen/header-chrome-pin3-popup-open.png` (gear popup full).

---

## Brand-guide §12 mapping

| Sub-task | §-секция brand-guide | Tokens / правила | Source |
|---|---|---|---|
| **A · Breadcrumb fix** | §12.4 Edit-view tabs (mockup line 3078 breadcrumb-area) | `--brand-obihod-primary` (circle), `--brand-obihod-on-primary` (letter). Без новых tokens. | brand-guide.html:3078, BrandIcon.tsx:27,35 |
| **A · Breadcrumb fix** | §12.4.1 Interaction states palette — focus-visible | Payload native pseudo-element rule сохранён | StepNav/index.scss:18-31 |
| **B · Home-link** | §9 Иконография · 49 line-art glyph'ов | `viewBox 0 0 24 24, stroke 1.5, currentColor, round` — house follows spec | brand-guide.html:1356 |
| **B · Home-link** | §12.2 Sidebar | Sidebar 220px, opacity 0.65→0.9 на icon, ink-soft text default | brand-guide.html:2982 |
| **B · Home-link** | §12.4.1 Sidebar links states | hover `--brand-obihod-paper` bg + `--brand-obihod-primary` text. focus-visible `--brand-obihod-shadow-focus-primary` | custom.scss:306-323 (W1) |
| **B · Home-link** | §6 mobile (W6 §6.3) | min-height 44px на ≤1024px (WCAG 2.5.5) | custom.scss:599-642 |
| **C · Theme toggle stub** | §12.2 Sidebar (settings-menu — admin-аналог user-menu §30) | Идентичный pattern: ink-soft default, paper hover, primary on pressed/active | brand-guide.html:2982, §30 line 4825 |
| **C · Theme toggle stub** | §9 Иконография — sun/moon | Single line-art в той же spec как W8 sidebar icons | brand-guide.html:1356 |
| **C · Theme toggle stub** | §12.4.1 token map (button-secondary state) | hover bg paper + primary text, focus-visible green ring | custom.scss:233-251 (W1) |
| **C · Theme toggle stub** | TOV §13 «matter-of-fact, без эмоций» | aria-label «переключение пока не сохраняется» — factual, не «🚧 Скоро будет!» | brand-guide.html:5694 |

---

## Architecture decisions

### Realization approach

3 fixes реализуются **тремя разными механизмами** — выбраны под минимальную инвазивность к Payload:

1. **§A breadcrumb fix** — **CSS-only patch** (~30 строк в custom.scss). Никакого нового component, никаких payload.config.ts изменений. Просто переопределение native `.step-nav__home` slot с `!important` (acceptable per W6/W8 precedent для Payload `@layer payload-default` overrides).

2. **§B home-link** — **Server component + native slot** (`admin.components.beforeNavLinks`). Никакого MutationObserver, никакого DOM hack. Чистый Payload API. Паттерн: рассмотрен и отвергнут MutationObserver (как в LeadsBadgeProvider) — slot работает, и это лучше.

3. **§C theme-toggle stub** — **Client component + native slot** (`admin.components.settingsMenu`). `'use client'` нужен для `useState` (visual state без persistence). Паттерн composition: state local-only, никакого Context / Provider.

**ADR-needed?** Нет. Этот US не вводит новых архитектурных решений:
- W3 LeadsBadge установил паттерн «slot-injection через payload.config.ts components». §B и §C re-use этого паттерна, но через **разные slots** (beforeNavLinks vs settingsMenu вместо providers). Не новая архитектура — расширение известных Payload API.
- W8 ADR-0011 установил «CSS mask-image для glyph'ов». §B **сознательно отказывается** от этого паттерна (использует inline SVG в TSX) — потому что link не имеет collection-href селектора (`/admin/collections/X`), и inline-SVG проще для одного компонента. Это микро-decision внутри одной компоненты, не ADR-уровень.
- §A — patch existing W9 alignment. Не нужен ADR.

**Если sa-panel находит spec-blocker** (например, `settingsMenu` API сломан в Payload 3.83 или RenderServerComponent падает на client-only ThemeToggleStub) → escalate `tamd` через cpo, fallback Plan B на `afterNavLinks` строку в sidebar.

### Migration

Нет — UI-only changes, никаких schema-level / БД миграций. `do` гонит `pnpm type-check + lint + format:check`, `qa-panel` axe + screenshot. Никаких dba.

### Custom components vs slots (ADR-0010 reminder)

ADR-0010 ([team/adr/ADR-0010-...](../../team/adr/) — verify path) запрещает `views.list.Component` override (custom views ломают server-streaming). Этот US не трогает views — только `graphics`, `beforeNavLinks`, `settingsMenu` slots, которые ADR-0010 явно разрешает (server-component-aware, не views).

---

## Acceptance Criteria (cross-cutting)

В дополнение к AC внутри каждой sub-task:

- **AC-X.1 a11y axe-core baseline:** W7 axe-core run на 5 routes (login, dashboard, catalog, services list, services edit) остаётся **0 violations**. Если новый component вводит violation — фикс БЕЗ relax disabled-rules.
- **AC-X.2 a11y manual VoiceOver smoke** (leadqa, не qa-panel): на `/admin/`
  - Tab порядок: после skip-link → home-link «На сайт» (читается «На сайт obikhod.ru, открыть в новой вкладке, ссылка») → первая NavGroup Заявки.
  - Cmd+Click home-link → opens new tab, focus stays in admin tab.
  - Esc на open settings-popup → closes popup, focus returns на gear-button.
- **AC-X.3 mobile @ 375px** (qa-panel + leadqa real-device):
  - Open drawer (hamburger) → home-link visible первым в списке.
  - Tap gear → popup открывается, ThemeToggleStub видим, touch-target ≥44.
  - Breadcrumb «О» на /admin/collections/services/<id> — корректно центрирован.
- **AC-X.4 brand-guide §12.4.1 token compliance:** все 3 sub-tasks используют ТОЛЬКО tokens из W1/W8 палитры (`--brand-obihod-*`, `--theme-*`). Никаких inline #-цветов вне CSS-vars (AcL для cr-panel review).
- **AC-X.5 reduced-motion respect:** ни в одном component нет animations НЕ-через design-system tokens (`--brand-obihod-duration-*`). W6 §reduced-motion guardrails покрывают.
- **AC-X.6 dark-mode force-light invariant:** force-light override (custom.scss:128-183) не сломан. На `[data-theme='dark']` (если оператор / test toggles native Payload theme) — все 3 fixes выглядят идентично light.
- **AC-X.7 RTL / RU strings:** «На сайт» и «Светлая тема / Тёмная тема» в коде — hardcoded ru-RU. Не нужна i18n key (за рамки W2.A). Если будущий US US-XX добавит i18n — будут replaced на ключи.

---

## Состав команды

| Роль | Задача | Чд |
|---|---|---|
| `sa-panel` | Этот spec (sa-panel-header-chrome.md) — 3 sub-tasks AC + brand-guide §12 mapping + arch decisions + slot research | 0.4 |
| `fe-panel` | §A custom.scss patch (30 строк) + §B NavHomeLink.tsx + slot wiring + §C ThemeToggleStub.tsx + slot wiring + custom.scss styles (~150 строк new) | 0.7 |
| `qa-panel` | axe-core baseline preserve + mobile @ 375 / 768 / 1024 smoke + 6 screenshots evidence + brand-guide §12.4.1 token compliance check | 0.2 |
| `cr-panel` | Code review + spec compliance check (token usage, slot API correctness, no MutationObserver) | 0.1 |
| **`leadqa`** | Real-device VoiceOver smoke + Cmd+Click home-link verification + Esc-on-popup focus-return + screenshot evidence на live build | 0.2 |
| **Cross-team** | | |
| `art` (если popanel сомневается в house-glyph) | Sign-off on house SVG path — opt-in, **не блокер** spec'а | 0.05 |
| **Итого** | | **~1.55 чд** |

**Timeline:** 2-3 рабочих дня.

---

## Open questions to operator

Закрыты в рамках spec:

- ~~Pin-1 fix-direction~~ — CSS slot expand 18→20 (popanel decision 2026-05-01).
- ~~Pin-2 placement~~ — Variant A через `beforeNavLinks` slot.
- ~~Pin-2 glyph~~ — line-art house composite (path roof + rect walls + door), no art consult needed.
- ~~Pin-3 placement~~ — Variant A через `settingsMenu` slot (admin-аналог user-menu из site §30).
- ~~Pin-3 persistence/apply~~ — UI-only, никакого theme swap (отдельный US PANEL-DARK-THEME-LOGIC).

**Остаются для operator (опционально, если хочет):**

- **Q1.** Текст home-link — сейчас «На сайт». Альтернативы: «На главную», «obikhod.ru». PO рекомендация: «На сайт» (короткое, не задвоено с native «Главная» страницы admin).
- **Q2.** Текст dark-toggle stub label при `aria-pressed=true` — сейчас «Тёмная тема». Альтернатива: «Тёмная тема (скоро)» — явнее показывает stub-status. PO рекомендация: оставить «Тёмная тема» в visible label, статус «coming soon» в `title` tooltip + `aria-label`.

Если оператор не закрывает Q1/Q2 — spec идёт с PO defaults (это default policy «PO orchestration» iron rule #7).

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | intake assigned после ux-panel UX audit (PANEL-UX-AUDIT note-uxpanel.md complete с А/В/С rec'ами по 3 пинам). |
| 2026-05-01 | sa-panel | popanel | spec draft готов (3 sub-tasks с детальным AC + arch decisions + brand-guide §12 mapping + 4 skills activated). Slot-researched: `beforeNavLinks` для §B, `settingsMenu` для §C — verified в Payload source. House-glyph выбран без art-consult (composite line-art в §9 spec). Готов к PO review → fe-panel implementation. |
