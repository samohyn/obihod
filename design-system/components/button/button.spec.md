# Button · spec

**Статус:** v1.0 · approved 2026-04-24 · роль `ui` · утверждено `art`
**Реализация:** CSS-классы [`.btn` / `.btn-primary` / `.btn-accent` / `.btn-ghost` / `.btn-lg`](../../../site/app/globals.css) · используются напрямую в JSX, отдельного `<Button>` React-компонента пока нет (MVP — Tailwind-classes + className).

## Purpose

Основной интерактивный элемент для CTA и форм. Конверсионный путь сайта («заявка → смета → amoCRM») проходит через 3-4 кнопки на каждой LP.

## Variants

| Variant | Class | Когда | Пример |
|---|---|---|---|
| `primary` | `.btn .btn-primary` | Главный CTA на экране. **Один на viewport** | «Получить смету за 10 минут» |
| `accent` | `.btn .btn-accent` | Вторичный CTA, когда рядом с primary | «Позвонить сейчас» |
| `ghost` | `.btn .btn-ghost` | Третичное действие, отмена | «Подробнее», «Назад» |

**Запрещено:** больше двух цветных кнопок подряд. Если на секции 3+ CTA → две ghost + одна primary.

## Sizes

| Size | Class | Padding | Font-size | Min-height |
|---|---|---|---|---|
| default | `.btn` | 16×24 px | 16 px | 44 px (WCAG touch) |
| large | `.btn .btn-lg` | 20×32 px | 18 px | 48 px |

Mobile: **большие кнопки приоритет**. На 360-430 px viewport button должна заполнять минимум 60% ширины контейнера формы.

## States

| State | Behavior | Tokens |
|---|---|---|
| `default` | См. variant | — |
| `hover` | primary: `background: var(--c-primary-ink)` + `translateY(-1px)`. accent: `background: var(--c-accent-ink)`. ghost: `border-color + color: var(--c-primary)`. **Duration `{motion.duration.fast}` = 120ms** | `{motion.presets.hover}` |
| `active` (`:active`) | `transform: translateY(0)` (снимаем lift) — механический клик | — |
| `focus-visible` | `outline: 2px solid var(--c-accent); outline-offset: 2px;` — обязательно для WCAG 2.2 AA | — |
| `disabled` | `opacity: 0.4; cursor: not-allowed;` — НЕ делаем выглядит как ghost, чтобы не путать. Используется **только пока форма валидируется**, не для «скрытых» CTA | — |
| `loading` | Заменяем label на spinner + keep кнопка disabled. Spinner 16 px, currentColor | — |

## Token usage

```css
/* primary — бренд-зелёный */
background: var(--c-primary);      /* #2d5a3d */
color: var(--c-on-primary);        /* #f7f5f0 */
/* hover */
background: var(--c-primary-ink);  /* #1f3f2b */

/* accent — янтарный */
background: var(--c-accent);       /* #e6a23c */
color: var(--c-ink);               /* #1c1c1c — на янтаре текст тёмный */
/* hover */
background: var(--c-accent-ink);   /* #c18724 */

/* ghost */
border: 1px solid var(--c-line);   /* #e6e1d6 */
color: var(--c-ink);
/* hover */
border-color + color: var(--c-primary);
```

## Copy (TOV)

**Do** (действенно, matter-of-fact):
- «Получить смету»
- «Оставить заявку»
- «Позвонить в обиход»
- «Рассчитать стоимость»
- «Приедем — оценим»

**Don't** (анти-TOV, блокируются хуком):
- «Узнать больше» (что именно узнать?)
- «Отправить заявку» («отправить» формально-казённо)
- «Связаться с нами» (пассивно)
- «Получить консультацию» (казёнщина)
- «Оформить заказ» (не магазин)

Лимит длины: ≤ 28 символов. На mobile ≤ 20 символов, иначе перенос.

## A11y

- **Role:** `<button>` или `<a>` с `role="button"` если это link styled as button.
- **Touch-target:** `min-height: 44px` — уже в `.btn`. На полноширинных mobile-кнопках — `min-height: 48px`.
- **Focus:** всегда видим focus-visible ring. Не убирать `outline: none` без замены.
- **Loading:** `aria-busy="true"` + `aria-label="Обрабатываем запрос"` (или контекстное сообщение).
- **Disabled:** `aria-disabled="true"` + tooltip с причиной («Заполните телефон»).
- **Icon-only button:** обязателен `aria-label`.

## Responsive

| Breakpoint | Layout |
|---|---|
| ≤ 640 | Full-width (`w-full`) в форме; inline в header — short label |
| 641-1023 | Auto-width, inline |
| ≥ 1024 | Auto-width, inline, возможно side-by-side группа |

## Edge cases

- **Очень длинный label (20+ знаков на mobile):** перенос внутри button — в 2 строки, центрирование. Не сокращаем через `...`
- **Icon + label:** gap = `{spacing.2}` = 8 px. Иконка 18-20 px, currentColor.
- **Button inside card:** если карточка кликабельна целиком, внутренняя button должна быть ghost + `stopPropagation`.
- **Form submit button:** обязательно `type="submit"`, loading-state по умолчанию привязан к `formState.isSubmitting` (react-hook-form).
- **Anchor styled as button:** `<a href="..." className="btn btn-primary">` — валидно для навигационных CTA, но добавить `role="button"` если нужно консистентное поведение.

## DoD

- [x] CSS-классы в globals.css
- [x] Token usage задокументирован
- [x] Copy-правила (do/don't) зафиксированы
- [x] A11y-чеклист покрывает focus/touch/disabled/loading
- [ ] React-компонент `<Button>` — **TODO P1** (когда количество использований перевалит за 30 и захочется выделить loading/disabled логику в одно место)
- [ ] Storybook story — TODO (когда Storybook будет)

## Changelog

- **2026-04-24 · v1.0** — формализованы существующие CSS-классы + правила.
