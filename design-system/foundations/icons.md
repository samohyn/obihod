# Icons · foundation

**Статус:** v1.0 · approved 2026-04-24

## Стратегия

**Обиход — это чертёж, не иконография Material/Apple.** Базовая эстетика задана логотипом «Круг сезонов»: тонкие линии одной толщины, чистая геометрия, stroke-only, round line-cap, без теней и градиентов.

## Источники

### 1. Brand glyphs (primary — используем сначала)

4 глифа из знака Круга сезонов + сам знак:

| Glyph | Значение | SVG |
|---|---|---|
| NW ёлочка | Арбористика, лес, весна-осень | `agents/brand/logo/mark.svg` NW-группа |
| NE снежинка | Зима, чистка крыш, снег | NE-группа |
| SW план-грид | План, участок, объект | SW-группа |
| SE навес со стрелками | Вывоз, потоки, выноc | SE-группа |
| Круг + крест | Универсальный штамп / печать | outer + cross без квадрантов |

**Правило:** если смысл иконки пересекается с одной из 4 услуг — используем соответствующий glyph. Не рисуем новую ёлку если есть brand-ёлка.

### 2. Lucide React (secondary — общие UI иконки)

Для UI-действий где brand-glyph не подходит:
- Навигация (chevron, arrow, menu, close)
- Статусы (check, alert, info, x-circle)
- Действия (phone, message-circle, upload, download)
- Типы контента (file, image, calendar, map-pin)

**Пакет:** уже подключён shadcn/ui → `lucide-react`. Импорт `import { Phone } from 'lucide-react'`.

### 3. ServiceIcons — domain-специфичные иконки услуг

Отдельный набор в эстетике чертежа-циркуляра. Реестр и правила — [icons/services/README.md](../icons/services/README.md). Превью — [_sheet.png](../icons/services/_sheet.png).

Текущий набор v0.9 — 16 иконок: `spil`, `valka`, `stump`, `prune`, `kabling`, `spray`, `chipper`, `roof-snow`, `gutter`, `climber`, `boomlift`, `dumpster`, `demolition`, `fixed-price`, `fast-response`, `legal-shield`.

```tsx
import { SpilIcon } from '@/design-system/icons/services/ServiceIcons'
<SpilIcon className="h-5 w-5 text-primary" />
```

### 4. Пользовательские SVG (вне services) — по согласованию с `art`

Если нет в brand, нет в services и нет подходящего lucide — рисуем свой в эстетике чертежа. Добавляем в `design-system/icons/custom/` с spec-комментом.

## Визуальные правила

| Параметр | Значение |
|---|---|
| `stroke-width` | 1.5 px (default), 1.2 на 16-24 px, 2 на 48+ px |
| `stroke-linecap` | round |
| `stroke-linejoin` | round |
| `fill` | none (обычно) / currentColor только для filled-состояний |
| Box | Квадратный viewBox: 24×24 (default), 16×16 (tight), 48×48 (hero) |
| Color | `currentColor` — родитель задаёт цвет |
| Style | Outline, не filled (кроме статус-индикаторов типа `check-circle`) |

**Запрещено:**
- Градиенты
- Тени / drop-shadow
- Эмодзи как замена иконки
- Multi-color иконки (кроме brand-glyphs из Круга сезонов)
- Иконки с внутренним текстом

## Размеры

| Контекст | Size |
|---|---|
| Inline в body-тексте | 16 px |
| Inline в label | 18 px |
| В кнопке (рядом с label) | 18-20 px |
| Sidebar / nav | 20-24 px |
| Stand-alone action (IconButton) | 24 px |
| Hero / section header | 32-48 px |
| Feature-карточка (ServiceCard) | 48 px |

## A11y

- **Декоративные иконки** (рядом с текстом дублирующим смысл): `aria-hidden="true"`, никакого alt.
- **Функциональные иконки** (IconButton без текста): `<button aria-label="Закрыть">` + `<Icon aria-hidden />`.
- **Статус-иконки** (check/error рядом с сообщением): если icon ЕДИНСТВЕННЫЙ носитель смысла — `role="img"` + `aria-label`. Если дублирует текст — `aria-hidden`.
- **Contrast:** иконка как UI-элемент ≥ 3:1 на фоне (WCAG 1.4.11).
- **Touch-target** для IconButton ≥ 44×44 (даже если иконка 20 — padding вокруг).

## Anti-patterns (конкретно для Обихода)

- ❌ Эмодзи в body («🌳 Арбористика» — категорически нет, это TOV-фолл)
- ❌ «Зелёная точка + текст» как UI-бейдж (используем `var(--c-success)` бейдж, не emoji)
- ❌ Филэнные иконки шоппинг-корзины, «лайк» — Обиход не e-commerce
- ❌ Лесоруб с топором / бензопила — это конкуренты из `contex/04_competitor_tech_stacks.md`, наш визуальный язык другой
- ❌ Микс outline и filled в одной сетке — выбираем один стиль

## Примеры маппинга

| Задача | Источник | Что |
|---|---|---|
| Карточка «Арбористика» | brand | NW ёлочка |
| Кнопка «Позвонить» | lucide | `Phone` |
| Badge «Отправлено в Telegram» | lucide | `Send` (или `MessageCircle`) |
| «Срочный выезд» marker | custom (TBD) | Круг с восклицательным — по эстетике brand |
| Fallback avatar «Без фото» | brand | mark-simple (О в квадрате) |

## DoD

- [x] Правила стиля (stroke-width, cap, join, fill)
- [x] Матрица размеров
- [x] A11y-чеклист
- [x] Anti-patterns зафиксированы
- [ ] Storybook / визуальный реестр иконок — **TODO P2**
