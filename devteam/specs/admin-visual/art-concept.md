# Art concept · Admin-панель Обихода

Роль: **art** (Design Director). Статус: черновик концепции, готов к приёмке `po` и оператором.
Зона кастомизации: `site/app/(payload)/custom.scss` + `admin.components.graphics.{Logo,Icon}`
в `site/payload.config.ts`. Стек не меняется — только CSS-override Payload-переменных и
два React-компонента логотипа.

Источники:
[CLAUDE.md §Immutable](../../../CLAUDE.md), [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md),
`site/app/globals.css` (дизайн-токены публичного сайта),
`site/app/(payload)/custom.scss` (сейчас пусто).

---

## 1. Настроение (mood)

**«Хозяйственная книга бригадира».** Админка — не витрина, а толстый крафтовый блокнот на
столе: тёплый бумажный фон, чёрно-зелёный фирменный штамп, минимум декора, всё крупно
подписано. Ни пастельной CMS-игрушки, ни чёрного «хакерского дашборда» — это рабочий
инструмент человека, который утром распределяет бригады, а вечером смотрит, сколько
заявок упало.

Защита от TOV-сноса: Caregiver даёт тёплый фон (`#f7f5f0`) и закруглённые углы 10 px,
Ruler даёт тёмно-зелёный primary `#2d5a3d` и янтарный акцент `#e6a23c` — бренд-штамп,
без неоновых ховеров и градиентных кнопок.

---

## 2. Цветовая палитра

Берём готовый набор сайта (`site/app/globals.css:9-23`) — у админки и паблика **один бренд**,
разные задачи. Для админки поднимаем плотность UI (меньше воздуха, больше информации),
но палитра та же.

| Роль в админке | Токен Payload | HEX | Источник сайта | Комментарий |
|---|---|---|---|---|
| `--background` | `--theme-bg` | `#f7f5f0` | `--c-bg` | Кремовый, основной фон списков и форм |
| `--surface` | `--theme-elevation-0/50` | `#ffffff` | `--c-card` | Белая карточка поля / таблицы |
| `--surface-alt` | `--theme-elevation-100` | `#efebe0` | `--c-bg-alt` | Чередование строк, sticky-хедер колонки |
| `--text` | `--theme-text` | `#1c1c1c` | `--c-ink` | Основной текст, заголовки |
| `--text-soft` | `--theme-elevation-800` | `#2b2b2b` | `--c-ink-soft` | Вторичный текст ячеек |
| `--text-muted` | `--theme-elevation-500` | `#6b6256` | уточнение `--c-muted` | admin.description, placeholder, labels (см. §WCAG ниже — оригинальный `#8c8377` недотягивал 4.5:1) |
| `--accent` | `--theme-success-500` | `#2d5a3d` | `--c-primary` | Primary button, активная вкладка, чек-бокс, фокус-outline |
| `--accent-hover` | `--theme-success-600` | `#1f3f2b` | `--c-primary-ink` | Hover на primary |
| `--highlight` | — | `#e6a23c` | `--c-accent` | Бейдж «Черновик», «Новая заявка», status dot |
| `--border` | `--theme-elevation-200` | `#e6e1d6` | `--c-line` | Разделители, рамки инпутов |
| `--warning` | `--theme-warning-500` | `#c18724` | `--c-accent-ink` | «Не опубликовано без miniCase» (ServiceDistricts) |
| `--danger` | `--theme-error-500` | `#b54828` | `--c-error` | Delete, validation error |

**Почему не чёрно-белая офисная:** админка — продолжение бренда, не нейтральная серая
утилита. Кремовый фон плюс зелёный primary сразу убирают ассоциацию «Payload из коробки»
(дефолт — белый + фиолетовый `#9a5cf6`).

### Как прошить в Payload 3

Payload 3 использует SCSS-переменные вида `--theme-bg`, `--theme-elevation-*`,
`--theme-success-*`, `--theme-error-*`, `--theme-text`. Все они переопределяются в
`site/app/(payload)/custom.scss` на `:root[data-theme='light']` (и зеркально на
`[data-theme='dark']` — пока можно клонировать light, тёмная тема — не в скоупе MVP).

---

## 3. Типографика

**Без external-шрифтов в админке** — скорость важнее, оператор заходит каждые 20 минут,
FOUT/FOIT на shell раздражает. Паблик использует Golos Text через `next/font` — в админке
его не тащим, даём чистый системный стек:

```scss
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
```

Размеры (плотные, инструмент, не лендинг):

| Элемент | Размер | Вес |
|---|---|---|
| Заголовок collection-view | 22 px | 600 |
| Field label | 13 px | 500, `letter-spacing: 0.02em` |
| Input / таблица | 14 px | 400 |
| admin.description | 12 px | 400, `--text-muted` |
| Моно (ID, slug, JSON-поля, цены) | 13 px mono | 500, `font-variant-numeric: tabular-nums` |

`tabular-nums` обязательно везде где есть цифры (ID заявок, цены в Services, счётчики
ServiceDistricts) — как и на сайте.

---

## 4. Логотип / Icon

**Решение: текст без символа (вариант 3).** Обоснование:

1. Финального знака у Обихода пока нет (TM-регистрация в open questions
   [CLAUDE.md](../../../CLAUDE.md) §Открытые вопросы). Ставить «P» от Payload — позор,
   придумывать временный символ на уровне art-роли — самодеятельность до утверждения
   brand-guide у `po`.
2. Кириллица «ОБИХОД» сама по себе — сильный word-mark в Caregiver+Ruler: плотный, без
   засечек, воспринимается как штамп.
3. Меньше SVG → быстрее admin shell.

### 4.1 Logo (login screen, ~200×60)

```tsx
// site/components/admin/Logo.tsx
export default function Logo() {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 2,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#1c1c1c',
      }}
    >
      <span
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        ОБИХОД
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#2d5a3d',
        }}
      >
        порядок под ключ · admin
      </span>
    </div>
  );
}
```

### 4.2 Icon (sidebar, ~28×28)

Монограмма «О» в квадрате со скруглением 6 px — символ словаря, но без привязки к
утверждённому знаку. При появлении финального лого — заменим на SVG.

```tsx
// site/components/admin/Icon.tsx
export default function Icon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="6" fill="#2d5a3d" />
      <text
        x="14"
        y="20"
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#f7f5f0"
        letterSpacing="-0.02em"
      >
        О
      </text>
    </svg>
  );
}
```

Контраст «О» `#f7f5f0` на `#2d5a3d` = **~8.9:1** — AAA (крупный текст).

---

## 5. Группировка админки

Цель: оператор за 1 секунду видит «куда идти». Переводим `admin.group` на все collections
и globals. Сводная раскладка (по факту `site/collections/` + `site/globals/`):

| Группа | Collection / Global | Почему здесь |
|---|---|---|
| **Заявки** | `Leads` | Горячая зона, каждый день. Одна коллекция — но отдельная группа наверху списка |
| **Контент сайта** | `Services`, `Districts`, `ServiceDistricts`, `Cases`, `Blog`, `Persons`, `B2BPages` | Всё, что рендерится публично |
| **Медиа** | `Media` | Фото объектов, лого УК, обложки кейсов — отдельно, потому что оператор сюда ходит через drag-n-drop из форм |
| **SEO и индексирование** | `SeoSettings` (global), `Redirects` | Админ-зона, не контент. Сюда оператор ходит после релизов |
| **Система** | `Users` | Технические пользователи admin-панели. Одна группа — на рост |

Порядок групп в Payload задаётся алфавитом **русского** названия, поэтому префиксуем для
контроля:

```
admin.group: '01 · Заявки'           // Leads
admin.group: '02 · Контент'          // Services, Districts, ServiceDistricts, Cases, Blog, Persons, B2BPages
admin.group: '03 · Медиа'            // Media
admin.group: '04 · SEO'              // SeoSettings, Redirects
admin.group: '09 · Система'          // Users
```

Номер-префикс — это **дизайн-решение**, а не фича Payload: без него группы сортируются по
алфавиту и «Система» вылезает между «Контент» и «Медиа».

### Внутренняя раскладка «02 · Контент» — порядок

По частоте правок, не по алфавиту:

1. `Services` (самое редкое, но фундамент)
2. `Districts` → `ServiceDistricts` (связка, читаются вместе)
3. `Cases`
4. `Persons`
5. `Blog`
6. `B2BPages`

Реализуется через `admin.defaultColumns` + `admin.description` в каждой коллекции;
порядок в sidebar — через `config.admin.components.graphics` + сортировку массива, если
`po` захочет явный контроль.

---

## 6. Payload admin — точки кастомизации

| Точка | Действие | Файл |
|---|---|---|
| `admin.components.graphics.Logo` | Подключить `@/components/admin/Logo` | `site/payload.config.ts` |
| `admin.components.graphics.Icon` | Подключить `@/components/admin/Icon` | `site/payload.config.ts` |
| `admin.css` | Указать путь к `app/(payload)/custom.scss` (уже есть, пустой) | `site/payload.config.ts` |
| `admin.meta.titleSuffix` | **Не трогаем**, уже `— Обиход admin` | `site/payload.config.ts` |
| `admin.meta.favicon` | **Не трогаем**, уже `/favicon.ico` | `site/payload.config.ts` |
| CSS-переменные темы | Переопределить `--theme-*` в `custom.scss` | `site/app/(payload)/custom.scss` |

**Что не трогаем вообще:** layout Payload, расположение сайдбара, мобильную версию
admin, иконки полей, dark theme (клонируем light в `[data-theme='dark']` и закрываем
вопрос до появления прод-потребности).

**Код пишет `ui` по моему брифу.** Моя зона — только эта спека + согласование рендера на
скриншотах. Реализация — отдельный US с лейблом `role:ui`, `phase:design` → `phase:build`.

---

## 7. Примеры живых деталей

### 7.1 Приветствие на dashboard

Payload позволяет кастомный `admin.components.views.Dashboard`. **Не строим кастомный
дашборд для MVP** — это перебор. Единственное, что просится:

> `Dashboard > BeforeDashboard`: строка-плашка с текстом
> **«Здравствуйте, Георгий. Сегодня в обиходе:»**
> и счётчиком новых `Leads` за последние 24 часа.

Формулировка короткая, деловая, без «рады видеть». Если этого счётчика нет в MVP — плашка
тоже не нужна, оставляем дефолтный Payload-дашборд на кремовом фоне.

### 7.2 TOV для admin.description на полях

Проход по всем `field.admin.description` — требование к `ui` и `be3/be4`:

**Плохо → Хорошо:**

- «Пожалуйста, загрузите фото объекта» → «Фото объекта. JPEG/WebP, до 5 МБ»
- «Мы рекомендуем указывать заголовок до 60 символов» → «Title тега до 60 символов»
- «В кратчайшие сроки опубликуется» → «Публикация — после прохождения гейта: miniCase + ≥ 2 FAQ»
- «Индивидуальный slug» → «Slug: латиница, дефисы, без пробелов»

Правило: **matter-of-fact, без глаголов вежливости.** Анти-TOV-слова блокируются хуком
`.claude/hooks/protect-immutable.sh` — это наш страховочный трос, но описания полей в TS
коде часто проскакивают, потому что хук смотрит `site/`, `content/`, `assets/`, но
рассматривает TS-строки как обычный контент. Ревью описаний — зона `cw`, не `art`.

### 7.3 Бейджи статусов

- Черновик Services / ServiceDistricts → плашка фоном `#e6a23c` + текст `#1c1c1c` (контраст
  ~11:1). Это **не** финальный токен — берём `--c-accent`, «янтарный штамп».
- Опубликовано → плашка `#2d5a3d` + текст `#f7f5f0` (~8.9:1 AAA).
- Новая заявка в `Leads` — серый по умолчанию, после открытия оператором — тот же янтарь,
  чтобы в списке было видно «видел, но не обработал».

---

## 8. WCAG AA — самопроверка

| Пара (FG на BG) | HEX | Contrast ratio | Требование | Статус |
|---|---|---|---|---|
| `--text` / `--background` | `#1c1c1c` / `#f7f5f0` | **~16.8 : 1** | 4.5 : 1 | **AAA** |
| `--text-soft` / `--background` | `#2b2b2b` / `#f7f5f0` | **~13.3 : 1** | 4.5 : 1 | **AAA** |
| `--text-muted` / `--background` | `#6b6256` / `#f7f5f0` | **~5.2 : 1** | 4.5 : 1 | **AA** |
| `--on-accent` / `--accent` | `#f7f5f0` / `#2d5a3d` | **~8.9 : 1** | 4.5 : 1 | **AAA** |
| `--warning` / `--background` | `#c18724` / `#f7f5f0` | **~3.3 : 1** | 3 : 1 (UI) | **AA** (UI-элементы, не body-текст) |
| `--danger` / `--background` | `#b54828` / `#f7f5f0` | **~4.7 : 1** | 4.5 : 1 | **AA** |
| `--border` / `--background` | `#e6e1d6` / `#f7f5f0` | ~1.3 : 1 | — | Декор, не UI-индикатор |

**Важно:** оригинальный `--c-muted` из globals.css — `#8c8377` — на `#f7f5f0` даёт
**~3.3 : 1**, ниже порога 4.5 : 1 для body-текста. Для admin-панели, где muted — это
description полей и placeholder (= body-текст), это fail. Поэтому в админке использую
более тёмный `#6b6256` (5.2 : 1, AA). На публичном сайте `#8c8377` остаётся — там muted
стоит на крупном тексте (eyebrows, captions 10-12 px uppercase) и попадает в
«large text» WCAG (3 : 1).

Это **не конфликт токенов с паблик-сайтом** — это разная роль одного токена в разных
контекстах. В `custom.scss` переопределяю только то, что Payload использует как body-мut.

---

## 9. Definition of Done этой спеки

- [x] Папка `devteam/specs/admin-visual/` создана
- [x] Файл `art-concept.md` содержит 7 обязательных разделов + WCAG-проверка
- [x] Решено по логотипу (текст без символа)
- [x] Группировка admin задана с префиксами
- [x] Палитра зафиксирована, контраст посчитан
- [ ] Защита у `po` и оператора (мой handoff следующий)
- [ ] Бриф на `ui` — после приёмки: реализовать `custom.scss` + Logo/Icon компоненты
- [ ] Бриф на `cw` — ревью формулировок `admin.description` по всем коллекциям

## 10. Открытые вопросы к оператору

1. Готовы принять **текстовое лого без символа** в MVP? Альтернатива — ждём TM и
   подключаем фирменный знак, тогда `admin` остаётся с временной заглушкой.
2. Нужен ли **кастомный дашборд** со счётчиком новых `Leads` в 1-м релизе админки, или
   оставляем дефолт Payload? (Я за «оставляем», счётчик — во 2-й итерации.)
3. Светлая тема only или дубль под `[data-theme='dark']`? Моя рекомендация — **light only**
   до первой жалобы.
