# Breadcrumbs · spec

**Статус:** v1.0 · approved 2026-04-24 · роль `ui` · утверждено `art`
**SEO-зависимость:** JSON-LD `BreadcrumbList` — обязательно для programmatic LP, даёт rich snippet в Яндексе и Google.

## Purpose

Навигационные хлебные крошки: путь от главной к текущей странице. Критично для programmatic SEO — пользователь видит где находится, Google/Яндекс индексируют структуру.

## Anatomy

```
Главная → Услуги → Арбористика → Раменское
```

Разделитель `→` или `/` — выбираем `→` (лучше в чертёжную эстетику, чем `/`).

## Структура на разных surface

| Страница | Crumb trail |
|---|---|
| `/` | — (не показываем на главной) |
| `/uslugi/` | Главная → Услуги |
| `/uslugi/arboristika/` | Главная → Услуги → Арбористика |
| `/uslugi/arboristika/ramenskoye/` | Главная → Услуги → Арбористика → Раменское |
| `/rajony/` | Главная → Районы |
| `/rajony/ramenskoye/` | Главная → Районы → Раменское |
| `/blog/` | Главная → Блог |
| `/blog/<slug>/` | Главная → Блог → {{title}} |
| `/cases/<slug>/` | Главная → Кейсы → {{title}} |

## Variants

| Variant | Когда |
|---|---|
| `default` | Выше h1 страницы, над контентом |
| `compact` | В footer на mobile (если нужно показать путь и наверху места нет) |

Нет варианта «внутри h1» — хлебные крошки всегда отдельны от заголовка.

## States

| State | Link |
|---|---|
| `default` | muted color, hover → primary |
| `current` | не ссылка, `<span aria-current="page">`, color ink |
| `hover` | color primary |

Разделители `→` — `color: var(--c-muted)`, всегда decorative.

## Token usage

```css
nav {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--c-muted);
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
nav a {
  color: var(--c-muted);
  text-decoration: none;
}
nav a:hover {
  color: var(--c-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
nav [aria-current="page"] {
  color: var(--c-ink);
}
nav .separator {
  color: var(--c-line);
  user-select: none;
}
```

Вертикальный margin: `{spacing.4}` (16 px) над и под. На desktop — над h1 только, под — 0.

## Copy

- **Главная** — не «Главная страница», не «Домой», не «Home»
- **Услуги** — не «Наши услуги», не «Каталог»
- **Районы** — не «География», не «Регионы»
- **Блог** — не «Статьи», не «Журнал»
- Кластеры в нижнем регистре: «Арбористика», «Крыши», «Мусор», «Демонтаж»
- Район без приставок: «Раменское», не «г. Раменское»

## A11y

- `<nav aria-label="Хлебные крошки">` вокруг всего.
- Внутри — `<ol>` с `<li>` на каждый уровень (упорядоченный список!).
- Последний элемент — `<span aria-current="page">` без `<a>`.
- Разделители `→` — `<span aria-hidden="true">` или вообще в CSS `::before`.
- Контраст muted `#8c8377` на bg = 3.3:1 — допустимо для body-sm (14px) как large text по WCAG.

## Responsive

- **Mobile (≤ 640):**
  - Показываем только последние 2 уровня: `… → Арбористика → Раменское`.
  - Первый `…` кликабельный → раскрывает полный путь.
  - Или вариант: скроллим горизонтально (`overflow-x: auto`) с visual-hint.
- **Tablet+:** полный путь.

## JSON-LD (обязательно)

Добавляем `BreadcrumbList` schema на каждую страницу где есть crumbs:

```tsx
// В generateMetadata или как отдельный компонент <Script type="application/ld+json">
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://obikhod.ru/' },
    { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://obikhod.ru/uslugi/' },
    { '@type': 'ListItem', position: 3, name: 'Арбористика', item: 'https://obikhod.ru/uslugi/arboristika/' },
    { '@type': 'ListItem', position: 4, name: 'Раменское' }, // последний без item (Google предпочитает)
  ],
}
```

**Правила:**
- Количество элементов = количество видимых crumbs (НЕ вся таксономия сайта).
- Имена точно совпадают с тем что видит пользователь.
- URL абсолютные, с `https://` и trailing slash.
- Последний элемент — можно без `item` (Google рекомендует, но допускается с ним).

## Edge cases

- **Главная страница `/`:** crumbs не показываем (или только один элемент — не имеет смысла).
- **404 / error:** crumbs на error-странице не показываем — нет осмысленного пути.
- **Динамический title (статья блога 100 символов):** truncate to 50 chars + `…`, full title в tooltip + JSON-LD.
- **Мульти-категорный контент** (статья в 2 категориях блога): crumbs по primary category, secondary — в body статьи.
- **Трейлинг-слеш:** все URL в JSON-LD с trailing slash, соответствует canonical-правилам сайта.

## Integration

### React-компонент (псевдо)

```tsx
<Breadcrumbs
  items={[
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/uslugi/' },
    { name: 'Арбористика', href: '/uslugi/arboristika/' },
    { name: 'Раменское' }, // no href → current
  ]}
/>
```

Server Component, данные из Payload collections (Services + Districts). Schema JSON-LD рендерим в том же компоненте через `<Script type="application/ld+json">` — Next.js сам оптимизирует.

## Anti-patterns

- ❌ Breadcrumbs на главной
- ❌ Разделитель `>` (выглядит как стрелка-обрез, `→` чище)
- ❌ Иконка-домик `🏠` вместо текста «Главная»
- ❌ Последний элемент как `<a href="#">` — должен быть `<span>`
- ❌ Без JSON-LD — теряем rich snippets в поисковиках

## DoD

- [x] Anatomy + variants + states + copy
- [x] A11y (nav + ol + aria-current)
- [x] Responsive (mobile truncate)
- [x] JSON-LD BreadcrumbList правила
- [x] Edge cases (главная / 404 / длинные заголовки)
- [ ] React `<Breadcrumbs>` компонент — **TODO P1** (зависимость для всех LP)
- [ ] E2E-тест: JSON-LD присутствует на всех LP через `axe` + `@google/structured-data-testing-tool` — TODO в CI
