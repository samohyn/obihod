# Art-brief для `ux` — US-12 Admin Redesign

**От:** `art` (Design Director) · **Дата:** 2026-04-27 (вечер)
**Источник:** [`art-concept-v2.md`](./art-concept-v2.md) + [`brand-guide.html` v1.8 секция «12 · Паблик → Payload»](../../../design-system/brand-guide.html).
**Базис:** [`art-concept v1`](../admin-visual/art-concept.md) + [`US-3-admin-ux-redesign/ux-wireframes.md`](../US-3-admin-ux-redesign/ux-wireframes.md) (если есть прежние wireframes — переиспользуй, не переписывай).

## Что нужно сделать

Подготовить полный UX-пакет для редизайна Payload admin panel. v1 закрыл токены и группировку меню; v2 — финальный UX от login до publish.

## 1. Персона админа Обихода

Ровно одна персона (для MVP): **P-ADMIN-OPERATOR** — это сам оператор Георгий + 1-2 будущих контент-менеджера.

Опиши JTBD-карту, типичные сценарии, фрустрации. Артефакт — `personas-admin.md` или дополни `agents/ux/personas.md`.

**Что я знаю про эту персону (бери в основу):**
- Утром (08:30–10:00) принимает заявки за ночь → проверяет calltracking → раздаёт бригадам (offline). В админке: коллекция Leads, status «новая → в работе».
- Днём (12:00–14:00) обновляет цены/контент по сезону → правит Services, ServiceDistricts. Платит налог за прошлый месяц через 1С (вне admin).
- Вечером (19:00–21:00) загружает фото с объектов → создаёт/обновляет Cases, добавляет фото в Media collection.
- Раз в неделю — публикует новый Blog/B2BPage. Раз в месяц — большой content review.
- Контекст устройств: 80% desktop (Chrome on macOS, 1440 px), 15% iPad (Safari, 1024 px), 5% iPhone (для срочных заявок из дома).
- Технический уровень: понимает Markdown, slug, base SEO. Не знает HTML/CSS/JS. Знает что такое REST/JSON но не пишет.

## 2. CJM ключевых сценариев

Построй 3 CJM (без избытка):

**CJM-1 «Утро: принять заявку»** — START → открыть admin → login → dashboard → увидеть «3 новых заявок» в stat-card → кликнуть → list view Leads с фильтром «Новые» → открыть верхнюю → прочитать описание + посмотреть фото → нажать «Принять, в работе» → SMS бригадиру (вне admin) → закрыть.

**CJM-2 «День: обновить цену»** — START → admin → dashboard → клик «Обновить цену» action-tile → list view Services → кликнуть «Вывоз мусора» → edit-view → tab «Основные» → менять «Цена за объект» с 12 800 на 14 500 → Сохранить → toast «Услуга „Вывоз мусора" сохранена» → revalidate автоматически → проверить обновление на `obikhod.ru/vyvoz-musora/` (preview tab).

**CJM-3 «Вечер: опубликовать кейс»** — START → admin → коллекция Cases → «+ Добавить кейс» → tab «Основные» (slug, title, district relationship, service relationship, дата) → tab «История» (rich text — что было, что сделали) → tab «Галерея» (drag-n-drop 3-5 фото из Media или upload) → tab «SEO» (meta) → tab «Превью» — preview iframe с draft URL → переключить статус «Опубликован» → Сохранить → toast → проверить что появился в Page Catalog widget на dashboard.

Для каждого CJM:
- Touchpoints, actions, thoughts, emotions.
- **Pain points** — где можно потерять оператора (например в edit-view с 30 полями).
- **Opportunities** — где UX уже работает на нас (page catalog widget = быстрая ориентация).
- Время на каждый шаг (target).

## 3. Information Architecture

**Меню (5 групп с префиксами, из v1 + Лекадаптация)** — посмотри [art-concept v1 §5](../admin-visual/art-concept.md). Проверь что ничего не разъехалось:

```
01 · Заявки → Leads
02 · Контент → Services · Districts · ServiceDistricts · Cases · Blog · Authors · Persons · B2BPages
03 · Медиа → Media
04 · SEO → SeoSettings · Redirects
05 · Рамка сайта → SiteChrome
09 · Система → Users
```

**Что закрепить от себя:**
- Порядок коллекций внутри группы 02 (по частоте правок, не алфавиту):
  Services → Districts → ServiceDistricts → Cases → Authors → Persons → Blog → B2BPages.
- Counter (число существующих документов) после каждой коллекции в sidebar — обязательно, не опция.
- Active-state visual: `--c-primary` bg + `--c-bg` text + 3px `--c-accent` left border (как в brand-guide v1.8 §12.2).

## 4. Wireframes (6 экранов)

В каждом wireframe — desktop (1440 px) + mobile (375 px).

**1. Login screen** (`/admin/login`)
- Anatomy из art-concept-v2 §1 (lockup сверху, форма-карточка центр, копирайт снизу).
- States: default / loading / error / success.
- A11y: skip-link нет (нет навигации до login), focus-visible на input + button, aria-invalid на ошибке, кнопка Submit reachable through Enter.

**2. Dashboard** (`/admin`)
- Greeting (BeforeDashboard сохраняем из v1 — 286 строк уже написано).
- 4 stat-cards (новые заявки / уник. за 7д / публ. страниц / ошибки CI).
- 6 action-tiles (из v1).
- **Page Catalog widget** — главная новинка, anatomy из art-concept-v2 §3.
- A11y: каждая карточка — `<a>` с явной ariaLabel «Открыть Lead-ов с 3 новыми». Page Catalog table — `<table>` с `<caption>` (sr-only) «53 опубликованных страниц по 9 разделам».

**3. List view** Cases (`/admin/collections/cases`)
- Header строка: breadcrumbs + CTA «+ Добавить» (primary).
- Filters bar: search input + status select + group select.
- Table: 5-7 колонок, sticky header, hover-bg.
- Empty state — anatomy из art-concept-v2 §7.1.
- Bulk action bar — sticky bottom при выборе ≥1.
- Pagination (наша из brand-guide «10»).
- A11y: keyboard select-all через `[Space]` на header checkbox, single select через `[Space]` на row, bulk-actions bar — focus-trap.

**4. Edit view** Service (`/admin/collections/services/<slug>`)
- Tabs row sticky top (6 tabs для Services, см. карта в art-concept-v2 §5).
- Form fields в активном tab.
- Status footer (Черновик / Опубликован) + кнопки Отмена / Сохранить.
- Превью-tab — embedded iframe с draft URL.
- A11y: tabs `role="tablist"`, переключение через `←/→`, Tab проваливается в первое поле tab. Required-fields с `aria-required`, ошибки `aria-describedby` на .help.

**5. Empty state** (`/admin/collections/cases` без записей)
- Иконка-папка 56 px (line-art из brand-guide #icons).
- Заголовок 20 px Inter 600.
- 1-2 строки текста, max-width 320 px.
- 1 primary CTA «+ Добавить кейс».
- A11y: `<main>` с `aria-label="Пустой раздел Кейсы"`.

**6. Error state** (500 / 403)
- Та же anatomy что в #11.5 brand-guide site (eyebrow с кодом + заголовок-человек + 1-2 CTA).
- 500 / 403 / 404 — три карточки одинакового шаблона `<ErrorState code title text actions />`.

## 5. A11y контракт (расширение v1)

В дополнение к art-concept v1 §8 (WCAG AA контрасты):

- **Keyboard navigation:** Tab проваливается по tab-order login form → dashboard navigation → main content. Skip-to-content link в начале `<main>`.
- **Screen reader:**
  - Sidebar = `<nav aria-label="Главное меню админки">`.
  - Group labels (`01 · Заявки` etc.) — `<h2>` визуально-uppercase-mono но семантически heading.
  - Counter «12» в sidebar — `<span aria-label="12 записей">12</span>` чтобы reader не читал «двенадцать».
  - Stat-cards в dashboard — `<div role="region" aria-labelledby>` со ссылкой.
  - Tabs — `role="tablist"` + `role="tab"` + `aria-selected`.
- **Focus-visible** — `:focus-visible` outline 2px `--c-primary`, не убирать через `outline: none`.
- **Reduced motion** — отключить ховер-translateY на cards, оставить opacity-changes.
- **Touch targets** ≥ 44×44 px. На sidebar links сейчас 32 px высота — дополни padding до 44 на mobile.

## 5.1. Usability state-walkthrough (обязательный чеклист)

**Замечание оператора 2026-04-27:** в первой версии wireframe-брифа я не явно прописал прохождение всех interaction states. Каждый wireframe должен фиксировать какие состояния поддерживает каждый интерактивный элемент и что происходит при каждом из них.

Для каждого экрана пройди этот чеклист и помечай в `ux.md` явно:

| Элемент экрана | Default | Hover | Active/Selected | Pressed | Focus-visible | Disabled | Loading | Error/Empty |
|---|---|---|---|---|---|---|---|---|
| Sidebar link «Услуги» | + | + | + (current page) | — | + (keyboard) | — (нет disabled на nav) | — | — |
| Tab «SEO» в edit-view | + | + | + (selected) | + (mousedown) | + | + (если коллекция read-only) | — | + (has-error red dot) |
| Input «Slug» | + | + | + (filled) | — | + (keyboard) | + (если non-editable) | — | + (validation message) |
| Button «Сохранить» (primary) | + | + | — | + (mousedown) | + | + (когда форма не валидна) | + (in-flight POST) | — |
| Button «Отмена» (secondary) | + | + | — | + | + | — (всегда доступна) | — | — |
| Page Catalog row | + | + (bg highlight) | — (нет «active» row) | + (mousedown перед click) | + (keyboard) | — | — | — |
| Filter dropdown trigger | + | + | + (open) | + | + | — | — | — |

**Правила обязательны:**
- **`hover` ≠ `focus-visible`** — оператор может работать клавиатурой (Tab/Shift+Tab) — focus должен быть visible.
- **`disabled` элемент** не достаётся через Tab (`tabindex="-1"`), `aria-disabled="true"`, `pointer-events: none`. Но **screen reader должен прочитать** что элемент disabled (через aria-label или aria-describedby).
- **`loading` button** показывает spinner + label «Сохраняем…» (cw напишет финал) + блокирует повторный click. Esc отменяет (если возможно).
- **`pressed` (mousedown без mouseup)** — короткое состояние, не оставляем «залипания» если пользователь уехал курсором. На `mouseleave` сбрасываем pressed.

**Visual reference** — [`brand-guide.html` v1.8.1 §12.4.1 Interaction states palette](../../../design-system/brand-guide.html). Там 5 групп × 4-6 состояний = 26 примеров с token-map.

## 6. Definition of Done

- [ ] `personas-admin.md` или раздел в `agents/ux/personas.md` про P-ADMIN-OPERATOR.
- [ ] 3 CJM в `specs/US-12-admin-redesign/ux-cjm.md`.
- [ ] 6 wireframes (desktop + mobile) — формат на твой выбор (Figma / SVG / описание в Markdown). В первый итерации Markdown с ASCII или ссылка на Figma — ОК, точные пиксели для `ui` потом.
- [ ] IA подтверждена против art-concept v1 + v2.
- [ ] A11y чеклист пройден для каждого экрана.
- [ ] Передача макетов в `ui` через `art` (я approve).

## 7. Не входит в этот brief

- Visual design (цвета, иконки, токены) — это `ui` через `art-brief-ui.md`.
- Копирайт (тексты login error, empty messages, button labels) — это `cw` через `art-brief-cw.md`.
- Реализация в Next.js — это `fe1`+`be4`.
- Финальный согласованный набор Tabs по каждой коллекции — это `be4` после approval.

## 8. Зависимости

- **art-concept-v2** — мой анатомический документ. Любые отступления от него — обсуди со мной до hand-off в `ui`.
- **Page Catalog widget data source** — `be4` подтвердит REST aggregation pattern (это техническая часть).
- **CJM-3** опубликовать кейс — синхронизируйся с тем как это сейчас работает в Payload draft preview API (`fe1` или `be4` подскажет).

Любые open questions — ко мне (`art`), не напрямую к `po`.
