# Typography · spec

**Статус:** v1.0 · approved 2026-04-24
**Токены:** [tokens/typography-scale.json](../../tokens/typography-scale.json)
**Реализация:** CSS-классы [`.h-display` / `.h-xl` / `.h-l` / `.h-m` / `.h-s` / `.lead` / `.eyebrow` / `.mono` / `.tnum`](../../../site/app/globals.css)

## Purpose

Единая типографическая шкала для marketing-сайта и admin. Задаёт визуальный ритм страницы и «голос» Обихода на уровне начертаний — плотно, matter-of-fact, чертёжно.

## Семейства

| Family | CSS var | Когда |
|---|---|---|
| Display/Sans | `var(--font-display)` = Golos Text · Inter · system | Всё по умолчанию — и заголовки, и body |
| Mono | `var(--font-mono)` = JetBrains Mono | Цены `12 800 ₽`, ID заявок, slug, технические строки |

**Почему Golos Text** (уже в `layout.tsx` через `next/font`) — спроектирован под кириллицу, хорошие heavy weights, открытая лицензия.

## Шкала

| Токен | CSS | Use |
|---|---|---|
| `display` | `.h-display` · `clamp(48, 8vw, 96)` / 700 | Hero H1, 1 на страницу |
| `h-xl` | `.h-xl` · `clamp(36, 6vw, 64)` / 700 | H1 внутренних страниц |
| `h-l` | `.h-l` · `clamp(28, 4vw, 44)` / 600 | H2 секций |
| `h-m` | `.h-m` · `clamp(22, 2.5vw, 28)` / 600 | H3 карточек |
| `h-s` | `.h-s` · `20 / 600` | H4 мини-заголовков |
| `lead` | `.lead` · `clamp(17, 1.8vw, 22)` · text-wrap: pretty | Подзаголовок, описание секции |
| `body` | default | 17/400 — основной текст |
| `body-sm` | — | 15/400 — footer, captions |
| `eyebrow` | `.eyebrow` · 12/mono/uppercase/tracking | Надзаголовок «01 · Identity» |
| `label` | — | 14/500 — подпись поля |
| `caption` | — | 12/400 — helper text |
| `mono` / `.tnum` | `.mono` / `.tnum` | Цены, ID с tabular-nums |

## Правила

### Hierarchy

- **1 display на страницу.** Если нужно два «больших» — один display, второй h-xl.
- **Пропуск уровней запрещён.** После display — h-l, не сразу h-s.
- **Eyebrow + heading** — базовая пара: eyebrow задаёт категорию, heading — содержание. Eyebrow всегда ВЫШЕ heading.

### text-wrap

- `h-display` / `h-xl` / `h-l` / `h-m` — `text-wrap: balance` (заголовки не должны ломаться пополам с коротким хвостом).
- `lead` — `text-wrap: pretty` (подзаголовок не ломается жёстко).
- `body` — default.

### Цифры и tabular-nums

Везде где отображаются числа **в ряд** (цена в списке, счётчик в счётчике, размер объекта) — обязательно `font-variant-numeric: tabular-nums`. Базовый body в globals.css имеет `font-feature-settings: 'tnum' 0` — **отключает** `tnum`, это осознанно для проз-текста. Включается через класс `.tnum` или `.mono`.

```html
<span class="tnum">12 800 ₽</span>   <!-- цена, числа не прыгают -->
<span class="mono">OBI-2026-00042</span>   <!-- ID заявки -->
```

### Вёрстка цен

Формат: `12 800 ₽` — пробел-разделитель тысяч (nbsp), рубль после пробела. Запрещено: `12800руб`, `12 800 рублей`, `от 12 800 ₽` (Обиход = фикс-цена, не «от»).

## Копирайт-правила (на уровне начертаний)

| Контекст | Форма | Почему |
|---|---|---|
| H1 / H2 | Полный без сокращений | Первое впечатление, без экономии |
| Заголовки карточек | Короткий — 2-4 слова | Сканируется взглядом за 0.3 с |
| Body | Полное предложение с точкой | Текст-аргумент, не тезис |
| Eyebrow | ≤ 3 слова, uppercase | Пристройка категории, не содержание |
| Кнопки | ≤ 28 знаков, без точки | См. [button.spec.md §Copy (TOV)](../button/button.spec.md) |

Анти-TOV слова (блокируются хуком `.claude/hooks/protect-immutable.sh`) — нельзя в любом начертании, включая capslock Eyebrow.

## A11y

- **Контраст:** body `#1c1c1c` на `#f7f5f0` = **~16.8:1** (AAA). Все заголовки — те же ink, контраст тот же.
- **Muted `#8c8377`:** на body-размере `3.3:1` — ниже WCAG AA 4.5:1. Используем **только на large text** (clamp 18+ px или ≥ 14 bold) по исключению WCAG «large text» → 3:1.
- **Не использовать size < 12 px** как body — только в eyebrow/caption.
- **Line-height** body — 1.55. Для мобильных heading — не опускаем ниже 1.02 (`.h-xl`).
- **text-wrap** — balance/pretty работают в Chrome 114+, Safari 17.4+. Fallback — normal, не ломает.

## Responsive

Все clamp-размеры автоматически масштабируются от mobile к desktop. Ручных media-queries для типографики **не пишем** — если нужен размер которого нет в шкале, обсуждаем с `art` до добавления нового токена.

## Edge cases

- **Очень длинные слова (Раменское-Огородниковское-шоссе):** `overflow-wrap: break-word` + `hyphens: auto; -webkit-hyphens: auto;` на основном body. Для заголовков — не переносим hyphen'ом, доверяем balance.
- **Цены в мобильной карточке:** если 8-знак цена не влезает — уменьшаем до `body-sm.tnum` (15 px), но не ломаем.
- **Русский + латинский mix** («B2B», «УК», «amoCRM» в body) — без спец-стилизации, Golos Text справляется.

## DoD

- [x] Все scale-токены в [typography-scale.json](../../tokens/typography-scale.json)
- [x] CSS-классы в globals.css соответствуют токенам
- [x] Правила hierarchy / wrap / tabular-nums зафиксированы
- [x] A11y-контраст проверен (AAA body, AA large text)
- [ ] Визуальная reference-страница `/styleguide` — **TODO P1**
- [ ] Ревизия всех LP на соответствие (аудит после первого релиза)
