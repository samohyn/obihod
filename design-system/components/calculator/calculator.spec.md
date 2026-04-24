# Calculator · spec

**Статус:** v0.9 · draft · роль `ui` · утверждено `art`
**Реализация:** [site/components/marketing/sections/Calculator.tsx](../../../site/components/marketing/sections/Calculator.tsx) (живёт в коде) — требует refresh под spec.

## Purpose

Интерактивный калькулятор стоимости услуги по параметрам объекта. Конверсионный инструмент — **если пользователь не готов прислать фото**, калькулятор даёт ориентир «от ₽ за ваш объект» → снимает страх «перестарались, ценник ×3» → заявка.

**4 калькулятора** — по одному на кластер. Единая anatomy, разные inputs и ценовые модели.

## Anatomy

```
┌────────────────────────────────────────────┐
│ EYEBROW: 04 · Калькулятор                  │
│ H2: Посчитайте стоимость спила             │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ Высота дерева                        │  │  ← label
│ │ [ slider ──────●──────── ] 18 м      │  │  ← input with live-value
│ │                                      │  │
│ │ Диаметр ствола                       │  │
│ │ ○ до 30 см  ● 30-50 см  ○ 50+ см     │  │  ← radio-group
│ │                                      │  │
│ │ Способ валки                         │  │
│ │ ☑ Целиком (есть место свалить)      │  │  ← checkbox
│ │ ☑ По частям (альпинисты)            │  │
│ │ ☐ С автовышки                        │  │
│ │                                      │  │
│ │ Утилизация                           │  │
│ │ ● Вывезем          ○ Оставим на      │  │
│ │                       участке         │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ────────────────────────────────────────  │
│                                            │
│ Примерная стоимость:                       │
│ 18 400 ₽    — 24 200 ₽       ← mono tnum  │
│ за объект                                  │
│                                            │
│ [ Уточнить цену по фото → ]                │  ← btn-primary
│                                            │
│ Примерно, точная — после выезда оценщика   │  ← caption muted
└────────────────────────────────────────────┘
```

## Варианты по кластерам

### 4.1. Калькулятор арбористики (спил)

**Входы:**
- `treeHeight` · слайдер 3-35 м, шаг 1 м
- `trunkDiameter` · radio: `до 30см | 30-50см | 50+см`
- `fellingMethod` · multi-checkbox: `целиком | по частям | автовышка`
- `disposal` · radio: `вывезем | оставим`
- `stumpRemoval` · checkbox: `удалить пень`

**Формула (базовая, калибруется от реальных заявок):**
```
base = 8_000
heightFactor = treeHeight * 400
diameterFactor = { 'до 30': 0, '30-50': 5000, '50+': 15000 }[trunkDiameter]
methodFactor = sum of (parts: 3000, boomlift: 8000)
disposalFactor = disposal === 'вывезем' ? 4000 : 0
stumpFactor = stumpRemoval ? 6000 : 0

price = base + heightFactor + diameterFactor + methodFactor + disposalFactor + stumpFactor
priceRange = [price * 0.85, price * 1.15]  // ±15% амплитуда
```

### 4.2. Калькулятор крыш (уборка снега)

**Входы:**
- `roofAreaSqm` · слайдер 20-500 м², шаг 10
- `roofType` · radio: `скатная | плоская | ломаная`
- `icicles` · checkbox: `есть сосульки (опасная наледь)`
- `accessHeight` · radio: `1-2 этажа | 3-4 этажа | 5+ этажей`

### 4.3. Калькулятор вывоза мусора

**Входы:**
- `volumeM3` · слайдер 1-30 м³, шаг 1
- `wasteType` · radio: `бытовой | строительный | смешанный`
- `loading` · checkbox: `нужна погрузка от бригады`
- `distance` · автопосчёт через yandex-maps API (район → МКАД)

### 4.4. Калькулятор демонтажа

**Входы:**
- `objectType` · radio: `сарай | перегородка | забор | терраса | беседка`
- `areaSqm` · слайдер 1-100 м²
- `material` · radio: `дерево | кирпич | бетон | металл | смешанный`
- `disposal` · checkbox: `вывоз остатков`

## States

| State | Поведение |
|---|---|
| `default` | Все inputs в дефолтных позициях, price скрыт или placeholder |
| `calculating` | Debounced 300ms после изменения input → показ результата |
| `result` | Цена + диапазон + CTA активны |
| `above-fix` | Расчёт > фикс-цены (12 800 ₽) → плашка «Ваш объект крупнее стандартного, точная цена после выезда» |
| `below-fix` | Расчёт ниже фикс-цены → округляем ДО фикс-цены (12 800 ₽ минимум) |

## Token usage

- Card container: `{radius.xl}` + `{spacing.6}` padding + `background: var(--c-card)` + border `var(--c-line)`
- Slider track: `var(--c-line)` (thin), thumb `var(--c-primary)` (circle r=10)
- Radio checked: `var(--c-primary)` fill
- Price display: `font-family: var(--font-mono)` + `font-variant-numeric: tabular-nums` + `font-size: 28-36px` + `color: var(--c-primary)`
- Range separator: em-dash `—` (не hyphen), color muted

## Copy (TOV)

### Labels
- **Do:** «Высота дерева», «Площадь крыши», «Объём мусора»
- **Don't:** «Укажите высоту», «Параметры вашего дерева»

### Результат
- **Do:** «Примерная стоимость: 18 400 — 24 200 ₽ за объект», «Ориентир: от 12 800 ₽»
- **Don't:** «Приблизительно», «Ваша цена составит»

### Caption под ценой
- «Примерно, точная — после выезда оценщика»
- «Окончательно согласуем по фото в Telegram за 10 минут»
- **Don't:** «Цена указана ориентировочно и может быть изменена» (канцелярит)

### CTA
- «Уточнить цену по фото →» (ведёт на PhotoQuoteForm anchor)
- «Вызвать бригаду — закрепим цену»

## A11y

- **Slider:** `<input type="range">` с видимым текущим значением справа. `aria-valuetext` для screen reader: «18 метров».
- **Radio-group:** `<fieldset><legend>Диаметр ствола</legend>...</fieldset>`, `role="radiogroup"` если через div.
- **Checkbox:** обычный `<input type="checkbox">` + `<label>`. Независимые чекбоксы для multi-select.
- **Live price:** `<div role="status" aria-live="polite">` — SR озвучит обновление после debounce.
- **Keyboard:** Tab между всеми inputs, arrow keys на slider/radio.

## Responsive

| Breakpoint | Layout |
|---|---|
| ≤ 767 | Вертикальный стек: inputs → price → CTA. Sliders full-width |
| 768-1023 | 2 колонки: inputs слева, price+CTA справа (sticky) |
| ≥ 1024 | 2 колонки + больше воздуха, `max-width: 960 px` центрирован |

## Edge cases

- **Экстремальные параметры** (дерево 35 м + диаметр 50+см + все методы): плашка «Такой объект требует индивидуального расчёта → позвоните».
- **Пользователь не трогал калькулятор, нажал CTA:** защита — кнопка disabled до первого изменения, или CTA переходит в «Расскажите об объекте» lead-form.
- **Несовместимые комбинации** (площадь 500 м² + 5+ этажей): валидация на уровне UI + сообщение «Проверьте параметры».
- **Debounce:** 300ms после последнего изменения → расчёт. Не на каждый пиксель слайдера.
- **Hydration mismatch:** калькулятор — Client Component. Server render показывает disabled state с placeholder, гидрация активирует.

## Analytics (через aemd)

События:
- `calc_opened` — секция в viewport
- `calc_input_changed` — параметры калькулятора (debounced)
- `calc_result_shown` — показан первый расчёт (quality-marker)
- `calc_cta_click` — переход в PhotoQuoteForm / звонок

Цель в Я.Метрика: `calc_cta_click` → macro-цель «заявка».

## Integration

### Данные

**Цены в Payload:**
- Collection `Services` · поле `baseRates` (JSON) — базовые ставки для формулы
- Global `PriceConfig` — коэффициенты сезонности, district-modifiers
- Обновление через Payload → инвалидация кеша на LP

### A/B-тесты (после первого MVP)

1. **Range vs точная цена:** «18 400 — 24 200 ₽» vs «~21 000 ₽» — что лучше конвертит
2. **«Примерно» vs «Ориентировочно»:** TOV
3. **CTA text:** «Уточнить по фото» vs «Зафиксировать цену»

## Anti-patterns

- ❌ Точная цена «18 423 ₽» с точностью до рубля — false-precision, не доверяют
- ❌ Раскрытие формулы в UI — наша кухня, не клиента
- ❌ Прогресс-бар «расчёт 3%... 97%... 100%» — цена считается за 1ms, визуально-обман
- ❌ «Получите скидку 15% за заявку сегодня!» — анти-TOV, Обиход = фикс-цена
- ❌ Слишком много inputs (>7 на калькулятор) — decision fatigue

## DoD

- [x] Anatomy единая для 4 калькуляторов
- [x] Формулы + входы для каждого кластера
- [x] States + tokens + copy
- [x] A11y (slider aria-valuetext, radiogroup, live region)
- [x] Responsive matrix
- [x] Analytics events
- [x] Integration с Payload
- [ ] React `<Calculator cluster={...}>` компонент — **TODO P1** (текущая реализация Calculator.tsx требует рефакторинга под spec)
- [ ] Калибровка формул по первым 50 реальным заявкам — **TODO** после запуска
- [ ] A/B-тесты — после 1000 пользователей
