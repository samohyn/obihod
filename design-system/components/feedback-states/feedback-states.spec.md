# Feedback states · spec

**Статус:** v0.9 · draft · роль `ui` · утверждено `art`
**Зависит от:** [microcopy.md](../../foundations/microcopy.md), [accessibility.md](../../foundations/accessibility.md)

## Purpose

Унифицированные состояния обратной связи: Loading, Empty, Error, Success, Toast. Без унификации каждый fe пишет свой «упс» и система разъезжается.

## Taxonomy

| State | Где | Формат |
|---|---|---|
| **Loading / Skeleton** | В местах которые долго грузятся (кейсы, картинки) | Skeleton-блоки |
| **Loading / Spinner** | Button submit, inline в карточке | CSS spinner 16-24 px |
| **Empty** | Нет данных (нет кейсов в районе, нет заявок за день) | Иконка + heading + hint |
| **Error inline** | Ошибка валидации поля | См. [input.spec.md](../input/input.spec.md) |
| **Error full** | 404, 500, offline | Illustration + heading + CTA |
| **Success inline** | Форма отправлена | Замещение формы success-card |
| **Toast** | Неблокирующие сообщения | Top-right, 3-5 c, auto-dismiss |

## 1. Loading — Skeleton

**Когда:** медленный API / первая загрузка страницы / ожидание картинки.

**Design:**
- Блок формы карточки (width, height, padding) такой же как конечный → без layout shift (CLS).
- Заливка `var(--c-bg-alt)` = `#efebe0`.
- Shimmer animation: градиент слева-направо, `duration.slow` × 2 = 640 ms, infinite.
- `prefers-reduced-motion: reduce` → без shimmer, просто статическая заливка.

**A11y:** `aria-busy="true"` на родителе + `aria-label="Загружаем кейсы в Раменском"`.

**Запрещено:** spinner в центре секции вместо skeleton — skeleton точнее показывает future layout.

## 2. Loading — Spinner

**Когда:** submit button, мелкое inline-действие.

**Design:**
- Круг radius 8, stroke 2 px, 270° dash, `currentColor`.
- Rotate `duration.slower` = 480 ms, linear, infinite.
- В button — заменяет icon/label, button остаётся фиксированной ширины.

**A11y:** `aria-busy="true"` на button + `aria-label="Отправляем"` (заменяет текст который не виден).

## 3. Empty state

**Anatomy:**
```
┌──────────────────────────────┐
│       [Icon 48 muted]        │  ← brand-glyph или lucide-icon, muted color
│                              │
│   Кейсов пока нет            │  ← h-s
│   Добавим после ближайшего   │  ← body-sm muted, макс 2 строки
│   выезда в Раменское.        │
│                              │
│   [ Посмотреть другие ]      │  ← btn-ghost (optional)
└──────────────────────────────┘
```

**Varianты по контексту:**

| Контекст | Icon (brand) | Heading | Hint |
|---|---|---|---|
| Кейсы в районе | SE glyph (навес) | Кейсов пока нет | Добавим после ближайшего выезда в {{district}} |
| Заявки сегодня | SW glyph (план) | Заявок сегодня не было | Новые появятся здесь, обновлять вручную не нужно |
| FAQ пустой | NE glyph (снежинка) | Вопросов ещё не задавали | Напишите нам — добавим первый |
| Поиск без результатов | lucide `SearchX` | Ничего не нашли по «{{query}}» | Проверьте написание или [напишите нам напрямую](/cta) |

**Цвет:** `var(--c-muted)` для текста и icon. Фон — `var(--c-card)` или прозрачный, граница опциональна.

## 4. Error — full page

**Когда:** 404, 500, offline fallback, критический error boundary.

**Anatomy:**
```
┌────────────────────────────────────┐
│                                    │
│   [LogoMark.mark-simple 96 px]     │  ← knowingly broken bg (crossed out?)
│                                    │
│   Страница не нашлась              │  ← h-l
│                                    │
│   Возможно, ссылка устарела или    │  ← lead, 2-3 строки
│   мы переместили страницу. Вот что │
│   можно сделать.                   │
│                                    │
│   [ Главная ]   [ Позвонить ]      │  ← btn-primary + btn-ghost
│                                    │
└────────────────────────────────────┘
```

**Варианты:**

| Status | Heading | Hint |
|---|---|---|
| 404 | Страница не нашлась | Возможно, ссылка устарела. Вот что можно сделать. |
| 500 | Что-то сломалось на нашей стороне | Починим в ближайший час. Пока — позвоните или напишите в Telegram. |
| Offline | Интернет пропал | Проверьте соединение или откройте эту страницу позже. |

**Запрещено:** «Упс!», «Ой!», юмор, извинения «мы очень сожалеем».

## 5. Error toast

**Anatomy:**
```
┌──────────────────────────────────────────┐
│ [!] Заявка не ушла — проверьте интернет  │
│     [Написать в Telegram] [×]            │
└──────────────────────────────────────────┘
```

**Design:**
- Position: top-center mobile, top-right desktop (16 px от края).
- Width: max 420 px, padding `{spacing.4}` = 16 px.
- Border-radius: `{radius.md}` = 10 px.
- Border-left: 4 px `var(--c-error)`.
- Background: `var(--c-card)`, shadow `{shadow.lg}`.
- Duration: по умолчанию **не закрывается auto** (assertive error). Закрывается по клику ×.
- Inline action (optional): `Написать в Telegram` — ghost button small.

**A11y:** `role="alert"`, `aria-live="assertive"`. Фокус **не** перехватывается — пользователь может читать дальше, но toast прочитается screen reader'ом сразу.

## 6. Success inline (замещение формы)

См. [photo-quote-form.spec.md §State 4 · Success](../photo-quote-form/photo-quote-form.spec.md).

**Формула:** `ID заявки + что дальше + 2 CTA (открыть мессенджер / позвонить)`.

## 7. Success toast

**Когда:** неблокирующее подтверждение — «Черновик сохранён», «Фото добавлено».

**Design:**
- Похож на error toast, но border-left `var(--c-success)`.
- Auto-dismiss через 3 секунды (polite).
- Icon: `lucide.CheckCircle`.

**A11y:** `role="status"`, `aria-live="polite"`.

## Token usage

```css
/* base toast */
background: var(--c-card);
border-radius: var(--radius);      /* 10 */
box-shadow: var(--shadow-lg);
padding: 16px 20px;
border-left: 4px solid; /* color depends on variant */
transition: transform {motion.duration.slow} {motion.ease.decelerate},
            opacity {motion.duration.slow} {motion.ease.decelerate};

/* error */
border-left-color: var(--c-error);

/* success */
border-left-color: var(--c-success);

/* warning (янтарный) */
border-left-color: var(--c-accent);

/* skeleton */
background: var(--c-bg-alt);
background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
background-size: 200% 100%;
animation: shimmer 640ms linear infinite;
```

## Responsive

- Mobile: toast **full-width minus 16 px padding**, top 12 px. Не перекрывает status-bar.
- Tablet+: 420 px max, top-right 16 px.
- Empty state: на mobile меньше padding (`{spacing.6}`), на desktop `{spacing.10}`.

## Edge cases

- **Multiple toasts:** stack-style, новый снизу / сверху. Max 3 одновременно, остальные в очередь.
- **Toast во время modal:** toast ВСЕГДА над modal (z-index), не под.
- **Empty state с CTA ведущим к контакту:** tel:link на mobile, mailto: или скролл к форме на desktop.
- **Skeleton слишком быстро пропал (API вернул за < 200 ms):** без delayMin — не показываем skeleton, чтобы не было flicker. Обсуждать с fe — react-suspense + `useDeferredValue`.

## DoD

- [x] Anatomy и варианты для 7 состояний
- [x] TOV в copy (см. microcopy.md)
- [x] A11y (role, aria-live, aria-busy)
- [x] Token usage
- [ ] React `<Toast>` + `<Skeleton>` + `<EmptyState>` компоненты — **TODO P1**
- [ ] Error boundary для Next.js App Router — TODO
