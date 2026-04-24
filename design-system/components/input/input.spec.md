# Input & Form Field · spec

**Статус:** v1.0 · approved 2026-04-24
**Реализация:** поля react-hook-form + Zod в [site/components/marketing/sections/LeadForm.tsx](../../../site/components/marketing/sections/LeadForm.tsx) (и производных). Базовые стили — inline Tailwind, единого `<Input>` React-компонента пока нет — MVP.

## Purpose

Формы сбора заявок — основная конверсионная механика Обихода. Все 4 лид-канала (LeadForm, PhotoQuoteForm, CtaMessengers, Calculator) используют одни и те же поля: имя, телефон, адрес, мессенджер, комментарий.

## Types поля

| Тип | Когда | Валидация |
|---|---|---|
| `text` | Имя, адрес | required, min 2, max 100 |
| `tel` | Телефон | Zod `.regex(/^\+7 \d{3} \d{3}-\d{2}-\d{2}$/)` или ru-mask |
| `email` | B2B-контакт | опционально, standard email |
| `textarea` | Комментарий, описание задачи | max 1000, ≤ 5 строк по default |
| `select` | Канал связи (Telegram / MAX / WhatsApp / звонок) | enum |
| `file` | Фото объекта для «фото→смета» | см. [file-uploader.spec.md](../file-uploader/file-uploader.spec.md) |
| `checkbox` | Согласие на обработку ПДн | required true |

## Anatomy

```
┌─────────────────────────────────┐
│ Label                         * │  ← label (14/500) + required-звёздочка
│ ┌───────────────────────────┐  │
│ │ placeholder               │  │  ← input (16/400, height 48)
│ └───────────────────────────┘  │
│ Helper text / error           ℹ │  ← helper (12/400 muted) / error (12/500 error)
└─────────────────────────────────┘
```

**Spacing:**
- label → input: `{spacing.2}` = 8 px
- input → helper/error: `{spacing.2}` = 8 px
- между полями: `{spacing.6}` = 24 px (form-field-gap)

## States

| State | Border | Background | Text | Helper |
|---|---|---|---|---|
| `default` | 1 px `var(--c-line)` | `var(--c-card)` | `var(--c-ink)` | `var(--c-muted)` |
| `hover` | 1 px `var(--c-ink-soft)` | `var(--c-card)` | `var(--c-ink)` | — |
| `focus` | 2 px `var(--c-primary)` + focus-ring | `var(--c-card)` | `var(--c-ink)` | — |
| `error` | 2 px `var(--c-error)` | `var(--c-card)` | `var(--c-ink)` | `var(--c-error)` |
| `success` | 1 px `var(--c-success)` | `var(--c-card)` | `var(--c-ink)` | `var(--c-success)` |
| `disabled` | 1 px `var(--c-line)` | `var(--c-bg-alt)` | `var(--c-muted)` | `var(--c-muted)` |
| `filled` (read-only) | none | `var(--c-bg-alt)` | `var(--c-ink)` | — |

## Sizes

| Size | Input height | Padding | Font | Когда |
|---|---|---|---|---|
| default | 48 px | 14×16 | 16/400 | Стандарт — mobile friendly |
| large | 56 px | 16×20 | 17/400 | Hero форма, первое поле |
| compact | 40 px | 10×12 | 14/400 | В inline-поиске (TBD) |

**Не меньше 44 px высоты — WCAG touch-target.**

## Copy (TOV)

### Label

- **Do:** «Телефон», «Ваше имя», «Адрес объекта», «Комментарий»
- **Don't:** «Введите ваш номер телефона» (инструкция в label), «Имя и фамилия (необязательно)» (скобки-оговорки)

### Placeholder

- **Do:** конкретный пример формата — `+7 (985) 170-51-11`, `Раменское, Огородная 12`, `Спилить три берёзы у дома`
- **Don't:** «Введите телефон», «Ваш адрес», «Опишите задачу» — повторяет label без ценности

### Helper

- **Do:** «Позвоним с номера +7 985 170 51 11», «Фото или видео до 20 МБ»
- **Don't:** «Обязательное поле» (это задача `*` в label), «Пожалуйста, укажите точный адрес» («пожалуйста» — казённо)

### Error

- **Do:** «Номер без пробелов — 10 цифр после +7», «Файл больше 20 МБ — сожмите или пришлите в мессенджер»
- **Don't:** «Неверный формат», «Произошла ошибка», «Некорректное значение»

**Error всегда конкретный** — что именно не так + что сделать.

## Token usage

```css
/* default state */
padding: 14px 16px;              /* {spacing.3} + {spacing.4} */
border: 1px solid var(--c-line); /* #e6e1d6 */
border-radius: var(--radius);    /* 10 px */
background: var(--c-card);       /* #ffffff */
font-size: 16px;                 /* ⚠️ не меньше 16 — iOS auto-zoom */
min-height: 48px;
transition: border-color {motion.duration.fast} {motion.ease.standard};

/* focus */
border-color: var(--c-primary);
outline: 2px solid rgba(45, 90, 61, 0.2);
outline-offset: 0;

/* error */
border-color: var(--c-error);
```

## A11y

- **Label visible, связан с input через `<label htmlFor>` / `<input id>`** или оборачивание `<label>`. Никаких `placeholder-as-label`.
- **Required:** `*` в label + `aria-required="true"` на input. В error — `aria-invalid="true"` + `aria-describedby` на текст ошибки.
- **Autocomplete:** обязательно для стандартных полей — `autocomplete="name"` / `"tel"` / `"email"` / `"street-address"`.
- **Keyboard navigation:** tab-order — сверху вниз по форме, submit — последним в tab-order.
- **Mobile keyboards:** `inputmode` — `tel` для телефона, `email` для email, `numeric` для цифровых.
- **Focus-visible** — 2 px primary border + soft ring, обязательно viден.
- **Font-size ≥ 16 px** — иначе iOS автоматически зумирует.

## Responsive

- **Mobile (≤ 640):** все поля full-width, вертикальный стек.
- **Tablet (641-1023):** 2-колоночная сетка для коротких полей (имя / телефон рядом), textarea/адрес full-width.
- **Desktop:** такая же 2-колоночная сетка + больше воздуха (padding).

## Edge cases

- **Российский номер телефона:** принимаем `+7`, `8`, пробелы/дефисы/скобки, нормализуем в E.164 `+7XXXXXXXXXX` на backend.
- **Автофокус:** НЕ ставим `autoFocus` на первое поле формы — это ломает mobile-viewport (клавиатура сразу выезжает). Единственное исключение — форма в модалке.
- **Длинный адрес (Раменское, посёлок Быково, улица Садовая, дом 12 корпус 3):** textarea 2-строчная. Не обрезаем.
- **Duplicate submission:** submit button `disabled` пока `formState.isSubmitting`. После успеха — форма заменяется на success state (не просто toast) + ID заявки крупно, чтобы можно было сказать в Telegram.
- **Ошибка API (сеть, 500):** error toast + форма сохраняет введённое. **Не сбрасывать** введённые данные пользователя.

## DoD

- [x] Типы полей и валидации определены
- [x] States + tokens задокументированы
- [x] TOV-правила (label / placeholder / helper / error) зафиксированы
- [x] A11y-чеклист
- [ ] React `<Input>` / `<FormField>` компонент — **TODO P1** (когда появится 3+ форма)
- [ ] Zod-схема shared для всех лид-форм в `site/lib/forms/` — **TODO P1**
