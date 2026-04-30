# ADR-0011 · Sidebar icons strategy — CSS mask-image vs custom Nav

**Status:** accepted
**Date:** 2026-04-30
**Author:** tamd (popanel autonomous-mode impersonation)
**Related:** US-12 Wave 8 · [sa-panel-wave8.md](../../specs/US-12-admin-redesign/sa-panel-wave8.md) · [ADR-0005](ADR-0005-admin-customization-strategy.md) · [ADR-0007](ADR-0007-payload-login-customization.md) · [ADR-0010](ADR-0010-payload-views-list-customization.md)

## Контекст

US-12 Wave 8 §8.2 требует 13 line-art SVG иконок 14×14 в sidebar admin (per brand-guide §12.2 lines 2994-3011). Payload 3.84 не имеет out-of-the-box `admin.icon` per-collection и не рендерит иконки в `nav__link`. Нужно решить **как** их добавлять.

## Варианты

### Path A · CSS mask-image (CSS-only injection)

```scss
.payload__app a.nav__link::before {
  content: '';
  background-color: currentColor;
  mask-image: var(--brand-obihod-nav-icon);
  mask-size: contain; mask-repeat: no-repeat;
  /* width 14px, height 14px, opacity 0.65→0.9→1.0 */
}
.payload__app a.nav__link[href*='/admin/collections/leads'] {
  --brand-obihod-nav-icon: url("data:image/svg+xml;utf8,<svg ...>");
}
```

**Плюсы:**
- Уровень 1 (custom.scss only) per ADR-0005 § «уровни кастомизации» — самый низкий уровень инвазивности.
- Не требует TS код, runtime отсутствует.
- `currentColor` наследование через `background-color: currentColor` → иконка автоматически меняет цвет под состояние nav-link (default #2b2b2b → hover #1c1c1c → active #f7f5f0 on-primary). Opacity 0.65→0.9→1.0 за один transition rule.
- Не ломает W3 leads counter (`[data-leads-count]::after` injection через MutationObserver) — `::before` и `::after` независимы.
- Не ломает W6 mobile drawer (`aside.nav.nav--nav-open`).
- Verified DOM: `nav__link` selector уже стабилен — используется в W1 active link styling, W3 leads counter, W6 mobile.

**Минусы:**
- SVG paths инлайнены в CSS → +~3 KB к custom.scss bundle (acceptable, custom.scss уже 26 KB после W6).
- Любой rebrand SVG требует sed-replace в custom.scss (нет single source of truth для каждой иконки).
- Substring `[href*=]` matching: важно избежать collision (verify: `service-districts` ≠ `services`, `service-districts` ≠ `districts` — substring "/admin/collections/<slug>" уникальна для каждого slug).

### Path B · Custom Nav component (`admin.components.Nav` override)

Полная замена `@payloadcms/next/dist/elements/Nav` собственным React-компонентом, который читает collection list и рендерит NavGroup → NavLink с inline SVG иконками.

**Плюсы:**
- Single source of truth — иконки как React-компоненты в `site/components/admin/icons/sidebar/*.tsx`.
- Нет workaround substring match — точное соответствие slug → icon component.
- a11y более явное (`aria-hidden="true"` на иконке).

**Минусы:**
- Уровень 3 (full component override) per ADR-0005 — самый инвазивный уровень.
- Нужно re-implement: NavGroup collapse/expand state, NavToggler hamburger (W6), preferences sync, leads counter integration (W3 — `[data-leads-count]` атрибут на nav-link), mobile drawer behavior (W6 — body class `template-default--nav-open`), settings dropdown.
- High risk регрессий W3/W6 — повторная реализация всех existing CSS hooks.
- ~1.5 ЧД дополнительной работы только на портирование existing functionality.
- Payload upgrade path осложняется: каждый минор-релиз `@payloadcms/next` может изменить prop types Nav component.

## Решение

**Принят Path A · CSS mask-image.**

**Обоснование:**

1. **Минимальная инвазивность:** Уровень 1 vs Уровень 3 (ADR-0005 рекомендует выбирать наименьший работающий уровень).
2. **Совместимость с W3/W6:** не требует портирования leads counter, mobile drawer, NavToggler, NavGroup collapse — всё native Payload.
3. **Maintenance:** обновление custom.scss дешевле чем поддержка custom Nav component через минор-релизы Payload.
4. **Verified DOM stability:** `nav__link` + `href` атрибут стабильны через 3 wave (W1 active state, W3 leads counter, W6 mobile) — нет признаков что Payload меняет это в близких релизах.
5. **a11y acceptable:** `::before` pseudo-element автоматически невидим для screen reader (no `role`, no text content), text label остаётся для AT.

## Implementation notes

- Стилизация в [`site/app/(payload)/custom.scss`](../../site/app/(payload)/custom.scss) блок «WAVE 8 · §8.2 SIDEBAR ICONS».
- 13 SVGs inlined как `data:image/svg+xml;utf8,...` (URL-encoded percent для `#000` → `%23000`).
- Stroke colour `#000` в SVG **не важен** — mask-image использует только альфа-канал, реальный цвет приходит из `background-color: currentColor`.
- Substring matching `[href*='/admin/collections/<slug>']` — verified что нет collisions для текущих 12 slugs + 2 globals (см. `payload.config.ts` collections array).
- `vertical-align: -2px` для центровки 14×14 иконки относительно текстовой baseline (Payload nav-link использует line-height ~22px).

## Migration / rollback

- **Rollback:** удалить блок «WAVE 8 · §8.2 SIDEBAR ICONS» из custom.scss. Payload вернётся к default рендерингу без иконок.
- **Migration to Path B (если когда-то потребуется):** Path A не блокирует переход — custom Nav component можно ввести позже без удаления текущих CSS правил (CSS просто не будет ничего matchить если nav__link селектор изменится).

## Acceptance

- [x] 13 иконок видны на /admin sidebar (Leads, Services, Districts, ServiceDistricts, Cases, Blog, Authors, B2BPages, Persons, Media, Redirects, Users, SeoSettings, SiteChrome).
- [x] Иконки наследуют цвет nav-link state (default → hover → active).
- [x] W3 leads counter `[data-leads-count]::after` продолжает работать.
- [x] W6 mobile drawer не сломан (sidebar collapse, hamburger, backdrop).
- [x] axe-core 0 violations (W7 baseline).

## История

- 2026-04-30 17:30 · popanel запросил ADR при подготовке Wave 8 (sa-panel-wave8.md Q-1).
- 2026-04-30 19:30 · tamd (autonomous mode) проверил Payload source `@payloadcms/ui/dist/elements/NavGroup/index.js` и `@payloadcms/next/dist/views/Dashboard/Default/index.js`, подтвердил DOM stability.
- 2026-04-30 19:30 · accepted Path A.
