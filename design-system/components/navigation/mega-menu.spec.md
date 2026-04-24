# MegaMenu · spec

**Статус:** v0.9 · draft · роль `ui` · утверждено `art`
**Зависит от:** [typography.spec.md](../typography/typography.spec.md), [icons.md](../../foundations/icons.md), `design-system/icons/services/` (в разработке)
**Референс паттерна:** spilservis.ru, arborist.su ([contex/04_competitor_tech_stacks.md](../../../contex/04_competitor_tech_stacks.md)). **Эстетика — не референсная.** Копируем информационную архитектуру, не визуал.

## Purpose

Покрыть реальный каталог Обихода (40+ подуслуг в 4 кластерах) без переполнения header. Линейный nav-бар `[Главная] [Услуги] [Районы] [Блог] [Контакты]` не масштабируется — пользователь с запросом «удаление пня в Раменском» не видит путь.

## Концепция

**Не «зелёная плашка с белым текстом»** (анти-референс из живого примера конкурента). MegaMenu Обихода:
- Кремовый фон `var(--c-bg)`, не бренд-зелёный.
- Колонки разделены тонкими линиями `var(--c-line)` — не подчёркиванием, не цветом.
- Иконки услуг из [design-system/icons/services/](../../icons/services/) — stroke-only, currentColor.
- Никаких hover-заливок всей строки. Hover = подсветка ink + стрелка-указатель.
- **Эстетика чертежа-циркуляра**, как логотип.

## Anatomy

```
┌── HEADER ───────────────────────────────────────────────────────┐
│ [logo] Услуги ▾  Районы ▾  Кейсы  Цены  Блог  Контакты   [CTA] │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼  (hover / click)
┌─────────────────────────────────────────────────────────────────┐
│  Арбористика       │ Крыши              │ Мусор и демонтаж     │
│  ────────────      │ ──────────         │ ──────────────       │
│  [icon] Спил       │ [icon] Уборка снега│ [icon] Вывоз мусора  │
│  [icon] Валка      │ [icon] Чистка вод. │ [icon] Контейнер 7-30│
│  [icon] Корчевание │ [icon] Альпинизм   │ [icon] Демонтаж      │
│  [icon] Обрезка    │ [icon] Автовышка   │ [icon] Сараи, забор  │
│  [icon] Опрыскив.  │                    │ [icon] Расчистка     │
│  [icon] Каблинг    │                    │                      │
│  → Все услуги      │ → Все услуги       │ → Все услуги         │
│                                                                 │
│ ═══════════════════════════════════════════════════════════════ │
│ Featured: Раменское · зима-2026 · фикс 12 800 ₽ / объект        │
│ [ Оставить заявку ]                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Spacing:**
- Padding dropdown: `{spacing.8}` × `{spacing.10}` (32×40 px)
- Column-gap: `{spacing.10}` = 40 px
- Row-gap внутри колонки: `{spacing.3}` = 12 px
- Icon 20×20 + gap `{spacing.3}` = 12 px до текста

## Структура меню

| Trigger (header) | Dropdown content |
|---|---|
| Услуги ▾ | 3 колонки по кластерам + featured-блок |
| Районы ▾ | Список 7 пилотных районов (Одинцово, Красногорск, Мытищи, Химки, Истра, Пушкино, Раменское) + «Все районы МО» |
| Кейсы | Без dropdown — прямая ссылка |
| Цены | Без dropdown — прямая ссылка |
| Блог | Без dropdown (пока мало категорий) |
| Контакты | Без dropdown |

### Услуги — структура 3 колонок

**Колонка 1 · Арбористика (8 пунктов макс):** Спил · Валка · Удаление целиком · Удаление частями · Корчевание · Кронирование · Санитарная обрезка · Каблинг → «Все услуги арбористики»

**Колонка 2 · Крыши и территория (6 пунктов):** Уборка снега · Вывоз снега · Чистка водостоков · Промышленный альпинизм · Автовышка · Покос травы → «Все услуги»

**Колонка 3 · Мусор и демонтаж (6 пунктов):** Вывоз бытового · Вывоз строительного · Контейнеры 7-30 м³ · Демонтаж сараев · Демонтаж перегородок · Расчистка участка → «Все услуги»

**Featured row (внизу):** сезонный оффер или самый востребованный район («Раменское · фикс 12 800 ₽»). Меняется через Payload.

## States

| State | Поведение |
|---|---|
| `closed` (default) | Только триггер в header виден. Chevron ▾ rotation 0. |
| `open` (hover desktop / click mobile-tablet) | Dropdown появляется, `appear` motion = opacity 0→1 + `translateY(-4px → 0)` за `{duration.slow}` = 320 ms |
| `item-hover` | Ink `#1c1c1c` → primary `#2d5a3d`, иконка — тот же color через currentColor, slide иконки 2 px вправо или появление стрелки → |
| `item-focus` | outline-ring accent 2 px + offset 2 px |
| `item-active` (клик) | background `var(--c-bg-alt)` = `#efebe0` на 120 ms (мгновенный feedback) |

## Behavior

### Desktop

- **Hover + 120 ms delay** — защищаем от случайного открытия при проходе мышью.
- **Hover через menu-item → submenu** — остаётся открытым 300 ms после ухода курсора (grace period).
- **Escape** закрывает.
- **Click outside** закрывает.
- **Tab навигация:** `Tab` по триггерам, `Enter/Space/↓` раскрывает меню, `↑↓` по items, `Esc` закрывает и возвращает фокус на trigger.

### Mobile / Tablet (≤ 1023 px)

- Hover **не работает** — только `click` / `tap`.
- **Full-width accordion-style** вместо overlay-dropdown (пространство не позволяет 3 колонки).
- Trigger меняется на `<button aria-expanded>`. Chevron rotation 180° при open.
- Subgroups — аккордеоны внутри full-width nav-drawer.
- Swipe-to-close drawer opt-in (не критично).

### Keyboard-only

Полный keyboard support (см. [foundations/accessibility.md §Клавиатура](../../foundations/accessibility.md)):
- `Tab` → triggers
- `Enter/Space` → open menu
- `↓ ↑` → navigate items
- `→ ←` → между колонками (desktop) / не работает (mobile)
- `Home / End` → первый / последний item
- `Esc` → close + return focus
- **Focus-visible** обязательно

## Copy (TOV)

### Trigger labels

- **Услуги** (не «Наши услуги», не «Что мы делаем»)
- **Районы** (не «География», не «Где работаем»)
- **Кейсы** (не «Наши работы», не «Портфолио»)
- **Блог** (не «Статьи», не «Журнал»)
- **Контакты** (не «Связаться с нами»)

### Menu items (услуги)

Короткое название услуги + опциональная цена-якорь.

- **Do:** «Спил деревьев», «Корчевание пня», «Уборка снега с крыш», «Альпинизм»
- **Don't:** «Услуги по удалению деревьев», «Комплексный спил (с вывозом)» (детали — на LP, не в меню)

### Footer dropdown (featured)

- «Раменское · зима-2026 · фикс 12 800 ₽ / объект → заявка за 10 минут»

## Token usage

```css
/* dropdown surface */
background: var(--c-bg);          /* #f7f5f0 кремовый */
border: 1px solid var(--c-line);  /* #e6e1d6 */
border-radius: var(--radius-lg);  /* 16 */
box-shadow: var(--shadow-md);
padding: 32px 40px;

/* item default */
color: var(--c-ink);
padding: 10px 12px;
border-radius: var(--radius-sm);  /* 6 */
transition: color {duration.fast} {ease.standard},
            background {duration.fast} {ease.standard};

/* item hover */
color: var(--c-primary);
background: var(--c-bg-alt);

/* column separator */
border-right: 1px solid var(--c-line);  /* не цветовая полоса */
```

## A11y

- **Semantics:** `<nav aria-label="primary">` в header. MegaMenu сам по себе — `<ul role="menubar">` + `<li role="menuitem">` + вложенные `<ul role="menu">`.
- **aria-haspopup="true"** на триггере с dropdown, **aria-expanded** синхронизируется.
- **aria-controls** связывает trigger с dropdown-id.
- **Focus trap** НЕ применяем для mega-menu (это не modal) — `Tab` выводит из меню в следующий item header'а.
- **Skip link** «Пропустить навигацию» в самом начале header (см. [accessibility.md](../../foundations/accessibility.md)).
- **Motion:** `prefers-reduced-motion` — меню появляется без translate, только opacity → 1.
- **Reader label для chevron:** `aria-hidden="true"` — не озвучивается, состояние передаётся через `aria-expanded`.

## Responsive

| Breakpoint | Layout |
|---|---|
| ≤ 1023 | Full-width accordion drawer, трезвычайно вертикальный |
| 1024-1279 | 2-колоночный dropdown (Арбористика + Крыши / Мусор-Демонтаж склеены) |
| ≥ 1280 | 3-колоночный dropdown (как Anatomy) |

Desktop max-width dropdown: 960-1120 px в зависимости от viewport. Не на full-width — сохраняем воздух по бокам.

## Edge cases

- **Touch-desktop (iPad Pro с клавиатурой, hybrid):** используем `@media (hover: hover)` query. Hover включается только на настоящей мыши. Touch на iPad → click behavior.
- **Очень длинное название района** (Поселение Кокошкинское): `line-clamp: 1` + title-tooltip.
- **Cold-scroll navigate:** если пользователь скроллит во время открытого меню — закрываем (не держим поверх scroll-контента).
- **Sticky header:** dropdown открывается ВНИЗ от header'а, даже когда header sticky в середине страницы. Max-height = `100vh - headerHeight - 40px`, внутренний scroll если переполнение.
- **Router transition:** при клике на item меню закрывается + Next.js Link pre-fetch + push. Не оставляем открытым после navigation.
- **Меняется каталог (Payload):** список услуг генерируется `generateStaticParams` или SSR-подтягивается. MegaMenu — Server Component в App Router, гидрация для интерактивности только trigger'а.

## Interaction с поиском

Если в header есть поиск (см. живой пример конкурента — `🔍` иконка справа) — он **отдельный trigger**, не внутри Услуги/Районы. Для MVP поиск можно отложить в P2 (пользователи LP обычно не ищут).

## Integration

- **Next.js 16 App Router:** server component для рендера, client component только для interactive state (open/close).
- **Данные:** Services + Districts из Payload LocalAPI, кэш `unstable_cache` или RSC data fetching.
- **Prefetch:** `Link prefetch={true}` на top-5 items (data-driven, Я.Метрика).
- **Analytics:** события `nav_menu_open`, `nav_menu_item_click` с `role` и `path` — через `aemd` агента.

## Anti-patterns (Обиход-specific)

- ❌ **Зелёная плашка-header** как у конкурента на живом примере — категорически (ломает чертёжную эстетику)
- ❌ Hover-заливка всей строки зелёным — подсветка только ink + иконка
- ❌ Эмодзи-декораторы перед items (🌳 Арбористика)
- ❌ Многоуровневые dropdowns глубже 2 (не выдерживает TOV matter-of-fact — слишком много кликов)
- ❌ «Популярные услуги» блок с произвольным рейтингом (у Обихода все услуги равно важны в своём сезоне)
- ❌ Sticky full-width drawer на desktop (забирает главный focal area)

## DoD

- [x] Anatomy 3-колоночная + структура данных
- [x] States + behavior (desktop/mobile/keyboard)
- [x] A11y полная разметка
- [x] Copy TOV для triggers и items
- [x] Token usage
- [ ] React `<MegaMenu>` компонент — **TODO** (отдельный US для `ui`+`fe` — spec готов)
- [ ] Интеграция с Payload Services/Districts collections — TODO
- [ ] Mobile drawer UX-протокол (hamburger, close, swipe) — TODO в следующей итерации
- [ ] A/B-тест «Услуги ▾ vs Каталог ▾» label — после первых 1000 пользователей
