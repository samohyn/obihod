# Pagination · spec

**Статус:** v1.0 · approved 2026-04-24 · роль `ui` · утверждено `art`
**SEO-зависимость:** `rel="next"` / `rel="prev"` + canonical rules — критично для programmatic индекс-страниц.

## Purpose

Навигация по страничным спискам: блог-архив, кейсы-архив, индекс районов (`/rajony/` — 28+), индекс услуг, B2B-дашборд таблицы, admin-коллекции Payload (override).

## Когда использовать какой тип

| Тип | Контекст | Плюсы | Минусы |
|---|---|---|---|
| **Numbered** (1 2 3 … 24) | Блог, кейсы, индекс районов | Глубокое SEO, предсказуемые URL | Требует знания total count |
| **Load more** (кнопка) | FAQ, список отзывов, фото-галерея | Меньше перезагрузок | Плохо для SEO (не индексируется) |
| **Infinite scroll** | — | — | **Запрещено в Обиходе** — ломает SEO, back-кнопку, a11y |
| **Prev/Next only** | Статья блога (читать дальше) | Простая навигация | Нет «перейти к странице N» |

**Дефолт для Обихода — `numbered` pagination.** SEO-трафик из Яндекса и Google — главный канал, infinite scroll и load-more для него мёртвые.

## Anatomy (numbered)

```
┌──────────────────────────────────────────────┐
│  ← Назад   1  2  3  …  24   Вперёд →         │
│                                              │
│  Страница 3 из 24                            │  ← caption muted
└──────────────────────────────────────────────┘
```

**Логика отображения:**
- Всегда: первая, последняя, текущая, ±2 от текущей
- Многоточия `…` там где пропуск
- Prev/Next кнопки — только если есть куда идти

## Variants

| Variant | Когда |
|---|---|
| `default` | Полная numbered pagination — блог, индексы |
| `compact` | Только prev/next + counter — мобильный вид для длинных списков |
| `prev-next-article` | На странице статьи — `← Предыдущая статья | Следующая →` с названиями |

## States

| State | Поведение |
|---|---|
| `default` | Ссылки активны (кроме текущей) |
| `current` | `aria-current="page"`, background `var(--c-primary)`, color `var(--c-on-primary)`, cursor default |
| `hover` | На не-текущей ссылке: background `var(--c-bg-alt)`, color `var(--c-primary)` |
| `focus-visible` | outline 2px accent |
| `disabled` | Prev на первой / Next на последней — opacity 0.4, `aria-disabled="true"` |

## Token usage

```css
/* ссылка страницы */
min-width: 44px;               /* touch-target */
height: 44px;
padding: 0 14px;
border-radius: var(--radius);
font-family: var(--font-mono);  /* tabular-nums для цифр */
font-variant-numeric: tabular-nums;
font-size: 15px;
font-weight: 500;
color: var(--c-ink);

/* current */
background: var(--c-primary);
color: var(--c-on-primary);

/* разделитель-multitочие */
color: var(--c-muted);
padding: 0 4px;
```

Gap между элементами: `{spacing.1}` = 4 px.

## Copy

- Prev/Next: **«← Назад»** / **«Вперёд →»** (не «Предыдущая» / «Следующая» — длинно)
- Counter: **«Страница 3 из 24»** (mobile compact) / **«24 кейса · страница 3»** (rich контекст)
- `aria-label` на ссылки: «Перейти на страницу 3», «Текущая страница 3»

## A11y

- **Semantic:** `<nav aria-label="Pagination">` вокруг всего компонента.
- **Current:** `aria-current="page"` на активной странице.
- **Hidden counter для SR:** `<span class="sr-only">Страница 3 из 24</span>` — даже если визуально скрыт на desktop.
- **Prev/Next disabled:** `aria-disabled="true"`, но **не** `<a tabindex="-1">` — оставляем в tab-order чтобы SR озвучил «ссылка недоступна».
- **Touch target ≥ 44 px** — min-width/height фиксирован.
- **Keyboard:** Tab по ссылкам, Enter активирует.

## SEO

### `rel="next"` / `rel="prev"` в `<head>`

```html
<!-- /blog/page/3 -->
<link rel="prev" href="https://obikhod.ru/blog/page/2" />
<link rel="next" href="https://obikhod.ru/blog/page/4" />
```

**Важно:** `rel="next"/prev"` в `<link>` — Google [больше не использует](https://developers.google.com/search/blog/2019/03/rel-next-prev-deprecated), но Яндекс и bing её читают. Для ruen-first проекта — обязательно.

### Canonical правило

- **Страница 1:** canonical = URL без `/page/1` (short). Например `/blog/` не `/blog/page/1/`.
- **Страница 2+:** canonical = полный URL `/blog/page/3/` (self-canonical).
- **Никогда canonical на страницу 1 с других страниц** — это старая ошибка, теряется индексация глубоких страниц.

### URL-pattern

- **Статичные:** `/blog/page/3/` (читаемо)
- Альтернатива `?page=3` — разрешена, но reduces SEO weight

### Noindex

- Страницы 2+ — `index, follow` по умолчанию.
- Если на странице < 3 результатов — `noindex, follow`.

## Responsive

| Breakpoint | Layout |
|---|---|
| ≤ 640 | `compact` variant — Prev/Next + «3 из 24» между |
| 641-1023 | `default` с сокращённым списком — первая, текущая ±1, последняя |
| ≥ 1024 | `default` полный — ±2 от текущей |

## Edge cases

- **Total = 1:** пагинация не показывается вовсе.
- **Total = 2:** показываем только prev/next, номеров не ставим (не «Страница 1 из 2»).
- **Deep linking /page/999** когда фактически 24 страницы — редирект на `/page/24` 301.
- **Отрицательный / нечисловой номер (`/page/abc`) — 404.**
- **Большой total (100+):** добавляем «Перейти к странице N» input-поле в `compact` варианте.
- **SSG / ISR:** generateStaticParams для первых 10 страниц, дальше ISR по запросу.

## Integration

### Next.js 16 App Router

```tsx
// app/blog/page/[page]/page.tsx
export async function generateStaticParams() {
  const total = await getBlogTotalPages()
  return Array.from({ length: Math.min(total, 10) }, (_, i) => ({ page: String(i + 1) }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  return {
    alternates: {
      canonical: page === '1' ? '/blog/' : `/blog/page/${page}/`,
    },
  }
}
```

### Compatible с

- [breadcrumbs.spec.md](../breadcrumbs/breadcrumbs.spec.md) — они вместе на индекс-страницах.
- [programmatic-landing.md](../../patterns/programmatic-landing.md) — для индекса районов внутри сервиса.

## Anti-patterns

- ❌ Infinite scroll — ломает SEO, back, a11y
- ❌ Кнопка «Показать ещё» вместо numbered на SEO-страницах
- ❌ `<button>` для переходов — только `<a href>` (keyboard + right-click «Открыть в новой вкладке» + SEO)
- ❌ `<span>` вместо ссылки для disabled prev/next — нарушает tab-order
- ❌ Огромные pagination (1-100 всё в ряд) — multitочия обязательны

## DoD

- [x] Anatomy + variants + states + copy
- [x] SEO-правила (rel=next/prev, canonical, noindex, URL-pattern)
- [x] A11y (aria-current, touch-target, keyboard, SR)
- [x] Responsive matrix
- [x] Edge cases (total=1, deep link, SSG/ISR)
- [ ] React `<Pagination>` компонент — **TODO P1** (для блога + индекса районов)
- [ ] Интеграция с Payload списками (backend возвращает `totalPages`, `currentPage`, `hasPrev`, `hasNext`) — согласовать с `be3`
