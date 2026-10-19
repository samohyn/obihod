# Art-concept v2 · Admin Panel Обихода — финальная итерация

**Роль:** `art` (Design Director) · **Дата:** 2026-04-27 (вечер)
**Статус:** черновик, готов к декомпозиции через `po` → `ux`+`ui`+`cw`+`fe1`+`be4`.
**Базис:** [`specs/admin-visual/art-concept.md`](../admin-visual/art-concept.md) v1 (2026-04-23).
**Эта итерация:** добавляет всё, чего в v1 не было — login screen, sidebar/layout визуал, page catalog widget, tabs pattern для длинных форм, mobile, пустые/ошибочные состояния.

## TL;DR изменений v1 → v2

v1 закрыл **что** (палитра, типографика, группировка меню, WCAG). v2 закрывает **как** оно выглядит на конкретных экранах. Ничего из v1 не отменяется — v2 это надстройка.

| v1 (2026-04-23) | v2 (2026-04-27) |
|---|---|
| Палитра + токены + группы | + 8 экранов с финальным layout |
| Logo (текст 200×60) + Icon (монограмма «О») | + Login screen с lockup + поле ввода |
| Mention о sidebar группах | + Sidebar collapsed/expanded/active/hover/mobile |
| «BeforeDashboard счётчик Leads» как опция | + **Page Catalog widget** (запрос оператора) — таблица опубликованных страниц по разделам |
| — | + Tabs pattern для SiteChrome (405 строк → 6 tabs), Services (30 полей → 4 tabs) |
| Status badges идейно | + Bulk-actions toolbar, status-bar visual |
| Empty/loading не описаны | + Empty / Loading / Error / Permission-denied states |

## 1. Login screen (новое)

**Сценарий:** оператор открывает `obikhod.ru/admin` → 302 на `/admin/login` → видит экран авторизации.

**Anatomy (desktop ≥ 768 px):**

```
┌─────────────────────────────────────────────┐
│                                             │
│           ОБИХОД                            │
│           порядок под ключ · admin          │
│                                             │
│           ┌─────────────────────┐           │
│           │ Email               │           │
│           │ [_______________]   │           │
│           │                     │           │
│           │ Пароль              │           │
│           │ [_______________]   │           │
│           │                     │           │
│           │ [Войти]             │           │
│           │                     │           │
│           │ Забыли пароль? →    │           │
│           └─────────────────────┘           │
│                                             │
│           © 2026 · Обиход                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Layout:**
- Кремовый фон `--c-bg` `#f7f5f0` (как и весь admin).
- По центру по горизонтали и вертикали, контент-блок шириной 360 px.
- Lockup сверху: `<BrandLogo>` (текст 32 px + tagline 11 px), отступ 48 px до карточки формы.
- Карточка формы: белый фон `--c-card` `#ffffff`, padding 32 px, border 1px `--c-line` `#e6e1d6`, radius 10 px, shadow `0 1px 2px rgba(0,0,0,0.04)`.
- Внизу 32 px от карточки — копирайт `© 2026 · Обиход` muted 12 px.

**Mobile (< 768 px):** карточка занимает весь viewport минус 16 px по бокам, lockup уменьшается до 24 px заголовок + 10 px tagline.

**Нет на login:** illustration / фото-фон / градиенты / «Sign in with Google». **Только бренд + форма.** Это инструмент сотрудника, не маркетинг.

**Состояния:**
- `default` — пустые поля, кнопка primary активна.
- `loading` — кнопка `[Войти →]` с inline спиннером (наш `<LoadingDots>`), поля disabled.
- `error` — под полем красный 12 px текст «Email или пароль неверны» (без «Упс! / Что-то пошло не так»). Карточка не сдвигается, не shake.
- `success` (instant redirect) — кнопка показывает чекмарк 200 ms → переход на `/admin`.

**Что хочет `cw`:** финальный текст error и hint под «Забыли пароль?». Сейчас в брифе draft.

## 2. Layout — общая рамка

```
┌──────────────────────────────────────────────────────────────┐
│ ┌─[O]─ОБИХОД──────────┐  ┌── breadcrumbs · search · профиль ─┐│
│ │                     │  │                                   ││
│ │ 01 · Заявки         │  │  <тело страницы>                  ││
│ │   • Lead'ы (12)     │  │                                   ││
│ │                     │  │                                   ││
│ │ 02 · Контент        │  │                                   ││
│ │   • Услуги          │  │                                   ││
│ │   • Районы          │  │                                   ││
│ │   • SD              │  │                                   ││
│ │   • Кейсы           │  │                                   ││
│ │   • Блог            │  │                                   ││
│ │   • Авторы          │  │                                   ││
│ │   • Персоны         │  │                                   ││
│ │   • B2B-страницы    │  │                                   ││
│ │                     │  │                                   ││
│ │ 03 · Медиа          │  │                                   ││
│ │ 04 · SEO            │  │                                   ││
│ │ 05 · Рамка сайта    │  │                                   ││
│ │ 09 · Система        │  │                                   ││
│ │                     │  │                                   ││
│ └─────────────────────┘  └───────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Sidebar:**
- Ширина expanded: 260 px. Collapsed: 64 px (только icons).
- Фон `--c-bg-alt` `#efebe0` — на 1 шаг темнее основного, чтобы не сливался.
- Поверх sidebar — список groups + collections.
- Group label: 12 px mono uppercase, letter-spacing 0.12em, color muted, padding 12px 16px 8px. Например `01 · ЗАЯВКИ`.
- Collection link: 14 px Inter, padding 8px 16px, цвет `--c-ink-soft`. Hover → bg `--c-card`. Active → bg `--c-primary`, text `#f7f5f0`, left border 3px `--c-accent` (янтарный).
- Counter рядом с активной коллекцией: моно 12 px tabular-nums в круге `--c-bg`. Например «Lead'ы (12)» где 12 — тёмное число на бежевом круге 18×18 px.
- Collapse-toggle в нижней части sidebar — вытащит sidebar в 64 px (только Icon `O` + chevron-only). Persisted в localStorage.

**Top bar (32-44 px высота):**
- Breadcrumbs `02 · Контент / Услуги / Спил деревьев` слева — 14 px Inter, разделитель ` / ` muted.
- Глобальный search (placeholder «Найти услугу, район, кейс…») справа от центра — input 280 px ширина, без border, фон `--c-bg-alt`, иконка лупы 14 px слева.
- Profile-dropdown справа: аватар-инициал (зелёный круг 28 px, белая буква имени) + chevron. На клик — dropdown «Мой профиль / Выйти».

**Main canvas:**
- Padding: 32 px desktop, 16 px mobile.
- Фон `--c-bg`.
- Внутри — page-specific содержимое (dashboard / list / edit / etc.).

**Mobile (< 1024 px):**
- Sidebar превращается в drawer: hamburger в top bar слева → выезжает поверх контента, оверлей 50% черного на canvas.
- Top bar остаётся, но без search (search → в drawer как первый элемент).

## 3. Dashboard + Page Catalog widget (запрос оператора)

```
┌──────────────────────────────────────────────────────────────┐
│ Здравствуйте, Георгий. Сегодня в обиходе:                    │
│                                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│ │  3     │ │  +1.2k │ │  53    │ │  zero  │                  │
│ │ новые  │ │ уник.  │ │ публ.  │ │ ошибок │                  │
│ │ заявки │ │ за 7д  │ │ страниц│ │ CI     │                  │
│ └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                              │
│ Что делаем сегодня:                                          │
│ ┌────────┐ ┌────────┐ ┌────────┐                             │
│ │ Принять│ │ Обновить│ │ Опубл.│ ... (6 tiles из v1)         │
│ │ заявку │ │  цену  │ │  кейс │                              │
│ └────────┘ └────────┘ └────────┘                             │
│                                                              │
│ ─────────────────────────────────────────────────────────    │
│                                                              │
│ КАТАЛОГ ОПУБЛИКОВАННЫХ СТРАНИЦ ↘ 53 шт.    [фильтр ▾] [⇩CSV] │
│                                                              │
│ Раздел     │ URL                          │ Обновлено │ ▸    │
│ ───────────┼──────────────────────────────┼───────────┼──   │
│ Услуги (4) │ /vyvoz-musora/               │ 04-26 ✓   │ →    │
│            │ /arboristika/                │ 04-25 ✓   │ →    │
│ Sub-services│ /arboristika/spil-derevev/  │ 04-25 ✓   │ →    │
│ Районы (8) │ /arboristika/odintsovo/      │ 04-27 ✓   │ →    │
│ Кейсы (4)  │ /kejsy/burja-2025-zhukovsky/ │ 04-27 ✓   │ →    │
│ Блог (5)   │ /blog/kogda-spilivat-...     │ 04-25 ✓   │ →    │
│ B2B (3)    │ /b2b/uk-tszh/                │ 04-25 ✓   │ →    │
│ Авторы (3) │ /avtory/grigorij-samohin/    │ 04-25 ✓   │ →    │
│ Sitemap    │ /sitemap.xml (43 URL)        │ live      │ →    │
└──────────────────────────────────────────────────────────────┘
```

**Page Catalog widget (новое, ключевой запрос оператора):**

- Таблица всех опубликованных страниц сайта группированных по типу контента.
- Группы: **Услуги · Sub-services · Районы · Кейсы · Блог · B2B · Авторы · Programmatic SD**.
- Колонки: `Раздел`, `URL` (моно, 13 px tabular-nums), `Обновлено` (дата + статус-чекмарк ✓ если live, ⏱ если в очереди revalidate), `→` ведёт на edit-view коллекции.
- Sticky header строка с кнопкой `[фильтр ▾]` (по разделам, по дате) и `[⇩CSV]` (экспорт списка).
- Источник данных: REST `/api/services?where[_status][equals]=published&limit=100&depth=0` × 7 коллекций → агрегируется в server component `<PageCatalog>`. Кэш 60 сек.
- Total counter сверху виджета: «53 шт.» tabular-nums, с разбивкой по группам (Услуги (4) / SD (28) / Кейсы (4)…).
- Пустая группа — скрывается из списка (не показываем «Persons (0)»).

**Зачем это виджет, а не отдельная страница:** оператор приходит в admin утром → сразу видит «что я выпустил» вместо того чтобы шарить по 8 коллекциям. По сути — личный sitemap для админа.

## 4. List view коллекции (Services / Cases / Blog)

```
┌──────────────────────────────────────────────────────────────┐
│ 02 · Контент / Услуги                          [+ Добавить]  │
│                                                              │
│ [Поиск 🔍 ] [Статус: все ▾] [Группа ▾]    Найдено: 4         │
│                                                              │
│ ☐ │ Title           │ Slug          │ Обновлено │ Статус     │
│ ──┼─────────────────┼───────────────┼───────────┼──────────  │
│ ☐ │ Вывоз мусора    │ vyvoz-musora  │ 04-26     │ ✓ Опубл.   │
│ ☐ │ Арбористика     │ arboristika   │ 04-25     │ ✓ Опубл.   │
│ ☐ │ Чистка крыш     │ chistka-krysh │ 04-25     │ ✓ Опубл.   │
│ ☐ │ Демонтаж        │ demontazh     │ 04-25     │ ✓ Опубл.   │
│                                                              │
│ ◀ 1 ▶  · 50 в строке                                         │
└──────────────────────────────────────────────────────────────┘
```

**Particularly:**
- Header строка: breadcrumbs + CTA `[+ Добавить]` справа (primary button янтарный).
- Filters bar: search input + 1-2 select-фильтра + counter «Найдено: N» tabular-nums.
- Table: первая колонка checkbox-выделение (для bulk action). Hover на строку — `--c-bg-alt` background. Клик → edit-view.
- Status column: бейджи по spec из v1 §7.3 — янтарь для черновика, зелёный для опубликованного, серый для архива.
- При выделении ≥1 строки появляется **bulk action bar** в нижней части canvas:
  ```
  [3 выбраны] [Опубликовать] [В архив] [Удалить] [×]
  ```
- Pagination — наша из brand-guide v1.7 «10 · Пагинация» (numbered + prev/next).

## 5. Edit view с tabs pattern (новое)

**Проблема:** SiteChrome имеет 405 строк конфигурации — длинный скролл, оператор теряется. Services — 30 полей. Не помещается на экран.

**Решение:** длинные формы разбиваются на **tabs**. Payload поддерживает `Tabs field` — используем native:

```
┌──────────────────────────────────────────────────────────────┐
│ 02 · Контент / Услуги / Вывоз мусора              [Сохранить]│
│                                                              │
│ ╔═════╗                                                      │
│ ║Осн.║ Контент │ SEO │ Sub-services │ FAQ │ Превью           │
│ ╚═════╝                                                      │
│                                                              │
│ Slug                                                         │
│ [vyvoz-musora________________]                               │
│ Latin, дефисы, без пробелов                                  │
│                                                              │
│ Title (h1)                                                   │
│ [Вывоз мусора________________________]                        │
│                                                              │
│ Цена за объект (₽)                                           │
│ [12 800] [за объект ▾]                                       │
│                                                              │
│ ...                                                          │
│                                                              │
│ ─────────────────────────────────────────                    │
│ Статус: ◯ Черновик    ● Опубликован                          │
│                                          [Отмена] [Сохранить]│
└──────────────────────────────────────────────────────────────┘
```

**Tabs visual:**
- Каждый tab — pill-кнопка 13 px Inter, padding 8px 16px, radius 6 px.
- Active: bg `--c-card` (белый), border-bottom 2px `--c-primary` (зелёный), text `--c-ink`.
- Inactive: bg transparent, text `--c-ink-soft`.
- Hover на inactive: bg `--c-bg-alt`, text `--c-primary`.
- Если есть ошибки валидации в tab — красный точка-индикатор справа от label «SEO •».
- Sticky при скролле — tabs остаются в верхней части canvas.

**Карта tabs по коллекциям:**

| Коллекция | Tabs |
|---|---|
| Services | Основные · Контент · Sub-services · FAQ · SEO · Превью |
| Districts | Основные · Контент · Программа SEO · Превью |
| ServiceDistricts | Основные · Контент · MiniCase · FAQ · SEO · Превью |
| Cases | Основные · История · Галерея · SEO · Превью |
| Blog | Основные · Контент · How-to · FAQ · SEO · Превью |
| Authors / Persons | Основные · Био · Связи · Превью |
| B2BPages | Основные · Контент · SEO · Превью |
| Leads | Основные · Контакт · Услуга · Файлы · CRM-sync |
| SiteChrome (global) | Header · Footer · Контакты · Соцсети · Trust-bar · Hooks |
| SeoSettings (global) | По умолчанию · Robots · Sitemap · Schema |

**Превью-tab:** последний tab в каждой коллекции — embedded iframe `target="_blank"` или mini-preview на правую часть экрана. Открывает соответствующую страницу `obikhod.ru` в `?draft=true&secret=...` режиме (Payload draft preview API).

## 6. Status / Bulk action / Toasts

**Статус-бейджи** (из v1 §7.3, теперь визуально):

| Статус | Bg | Text | Контраст |
|---|---|---|---|
| Опубликовано | `#2d5a3d` (primary) | `#f7f5f0` | 8.9:1 AAA |
| Черновик | `#e6a23c` (accent) | `#1c1c1c` | 11:1 AAA |
| В архиве | `#e6e1d6` (line) | `#6b6256` (muted) | 4.5:1 AA |
| Новая заявка (Leads) | `#c18724` (warning) | `#f7f5f0` | 4.5:1 AA |
| Ошибка | `#b54828` (danger) | `#f7f5f0` | 4.7:1 AA |

Все бейджи — pill 4 px radius, padding 4px 8px, font-size 11 px Inter uppercase letter-spacing 0.06em. Не больше иконок!

**Bulk action bar:** появляется снизу canvas при выделении 1+ строк, фиксированная позиция, фон `--c-ink` `#1c1c1c`, текст `#f7f5f0`, кнопки primary/secondary.

**Toasts** (из brand-guide.html «11 · Уведомления»): использовать готовый паттерн без изменений. Действия пишутся как «Услуга „Вывоз мусора" сохранена» (matter-of-fact, не «Успешно сохранено!»).

## 7. Empty / Loading / Error / Permission states

### 7.1 Empty (например пустой список Cases)

```
              [иконка-папка из brand-guide]
              
              Кейсов пока нет.
              Добавьте первый — он попадёт в каталог
              сайта и в виджет dashboard.

              [+ Добавить кейс]
```

- Центрирован, 320 px max-width.
- Иконка 48 px из `components/icons/` (cases-empty или domain-specific).
- Заголовок 18 px Inter 600.
- Текст 13 px muted.
- Primary CTA снизу.

### 7.2 Loading

- Skeleton-плейсхолдеры из brand-guide «11 · Уведомления» (skeleton bar).
- Не "spinner круглый" — это анти-pattern.
- Skeleton table: 5 строк × 4 колонки animated.

### 7.3 Error (server error, 500)

- Та же концепция что error-pages в `/site/`: eyebrow с кодом + заголовок-человек + CTA.
- Фон canvas, без ухода на отдельную страницу.

```
              SERVER ERROR · 500
              Не удалось загрузить кейсы

              Скорее всего — временная проблема.
              Попробуйте обновить страницу.

              [Обновить]   [На дашборд]
```

### 7.4 Permission denied (403)

```
              ACCESS · 403
              У вас нет прав на эту коллекцию

              Спросите у администратора (Георгий) — выдадут.

              [На дашборд]
```

## 8. Mobile admin (новое — было «не трогаем» в v1)

**Реальность:** оператор ходит в admin с телефона редко, но иногда — принять заявку из дома. Минимально-приемлемая мобильная версия:

- **Login** — full-screen, карточка ширина 100% - 16px по бокам.
- **Layout** — sidebar в drawer (hamburger), top bar остаётся, search в drawer.
- **List view** — превращается в карточки 1-колонкой, ключевые поля (title, status, дата) видны, остальное за `chevron`.
- **Edit view** — tabs становятся горизонтальным scrolling row (свайп), формы идут одной колонкой.
- **Page Catalog widget** — collapse в один раздел = одна карточка-аккордеон.
- **Bulk-action bar** — отключаем на мобиле (выделение чек-боксами не делаем).

**Брейкпоинты:** одна точка `< 1024 px` → mobile mode. Tablet (768-1024 px) — между mobile и desktop, sidebar collapsed по умолчанию, top bar полный. Тестировать на 360 / 414 / 768 / 1024 / 1440.

## 9. Что НЕ делаем в этой итерации

- **Custom dashboard view** через `admin.components.views.Dashboard` (полная замена дефолтного Payload Dashboard) — слишком инвазивно. Используем `admin.components.beforeDashboard` (extension) + `afterDashboard` для page catalog widget.
- **Custom List View** — Payload `useTableColumns` + `admin.defaultColumns` + наш SCSS дают 90% нужного. Не переписываем List Component целиком.
- **Custom Edit View** — `admin.components.views.Edit` не трогаем; используем native Payload tabs field в каждой коллекции, переопределяем CSS.
- **Темная тема** — клонируем light в `[data-theme='dark']` без полноценной разработки темной палитры (как и v1).
- **Иконки полей в формах** — дефолт Payload (chevron, calendar, image-placeholder).
- **Realtime updates** (websocket нотификации новых leads) — это US-13 потенциальный.

## 10. Implementation roadmap (для `po`)

После approval концепции — декомпозиция на под-задачи:

1. **fe1 / be4 — реализация custom.scss override** (~1 день)
   - Расширить `app/(payload)/custom.scss` со всеми селекторами sidebar / top-bar / list-view / edit-view / tabs / badges / buttons. v1 закрыл переменные, осталось селектор-уровень.

2. **fe1 — Login screen redesign** (~0.5 дня)
   - `admin.components.views.Login` подключить custom компонент `<AdminLogin>` или через CSS override.

3. **fe1 + be4 — Page Catalog widget** (~1 день)
   - `<PageCatalog>` server component
   - Подключить через `admin.components.afterDashboard`
   - REST aggregation 7 коллекций
   - Фильтр + CSV export

4. **be4 — Tabs field в Services / Districts / SiteChrome / etc.** (~0.5 дня × 10 коллекций = 5 дней)
   - Native Payload `Tabs field` в schema, без custom React.

5. **cw — TOV ревью admin.description полей** (~0.5 дня)
   - Обходим все коллекции, переписываем descriptions под TOV.

6. **fe1 — Empty/Loading/Error states компоненты** (~1 день)
   - `<EmptyState>`, `<ErrorState>` (переиспользуем из site/), `<SkeletonTable>`.

7. **qa1 — Playwright admin smoke** (~0.5 дня)
   - Login → dashboard → найти page → edit → publish → logout. Lighthouse admin.

**Итого:** ~10 человеко-дней на 1-2 человек, спокойно за 2 недели.

## 11. Open questions для `po` / оператора

1. **Login form ввода:** email + password или email + magic link? (Сейчас Payload по дефолту email+password — оставляем, но если хочешь magic link — это другой US.)
2. **Page Catalog widget — на дашборде только** или **отдельная страница `/admin/catalog`** тоже? Я закладываю **только виджет на dashboard** для MVP.
3. **CSV export** в Page Catalog — нужен сразу или v2? Я заложил «нужен сразу» — это 30 строк кода.
4. **Profile dropdown — что в нём:** только «Выйти», или + «Сменить пароль», «Языки», «Темы»? Я заложил минимум: «Мой профиль» (placeholder), «Выйти».
5. **Уведомления о новых Leads (badge на пункте меню):** в этой итерации или US-13?

## 12. Риски

- **Payload версия может ломать кастомизации.** В v1 поддерживается Payload 3.x, при апгрейде проверять `admin.components.*` API.
- **SCSS селекторы Payload — нестабильные.** Они могут менять `[class*="payload-..."]` в minor-версиях. Подпись на специфичность через `:where()` чтобы не дрожать.
- **Mobile admin — не приоритет**, но тестировать минимально (360 px). Не выкатывать «admin не работает на телефоне» — это выглядит непрофессионально.
- **Replacing Payload native logic — feature creep.** Не пытаться переписывать всё. Tabs / Sidebar / Login / Dashboard widget — точечные изменения.

## 13. Definition of Done v2

- [x] Концепт login зафиксирован.
- [x] Layout (sidebar / top-bar / canvas) описан.
- [x] Page catalog widget описан (anatomy + источник данных).
- [x] Tabs pattern для длинных форм описан.
- [x] Status / bulk-action / empty / loading / error / 403 states описаны.
- [x] Mobile admin minimum описан.
- [ ] **Brand-guide.html v1.8** содержит визуальные mockups этих экранов.
- [ ] **art-brief-ux.md** написан и передан в `ux`.
- [ ] **art-brief-ui.md** написан и передан в `ui`.
- [ ] **art-brief-cw.md** написан и передан в `cw`.
- [ ] **note-po.md** написан, US-12 передан `po` для оформления в Linear.
- [ ] Approval оператора получен.

Источники: [art-concept v1](../admin-visual/art-concept.md), [brand-guide v1.7](../../../design-system/brand-guide.html), [US-3 ux-wireframes](../US-3-admin-ux-redesign/ux-wireframes.md), [US-3 ui-mockups](../US-3-admin-ux-redesign/ui-mockups.md), [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md), [CLAUDE.md](../../../CLAUDE.md).
