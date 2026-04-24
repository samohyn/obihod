# ServiceIcons · реестр

**Статус:** v0.9 draft · 16 иконок · 2026-04-24
**Компонент:** [ServiceIcons.tsx](ServiceIcons.tsx)
**Превью-sheet:** [_sheet.png](_sheet.png) · [_sheet.svg](_sheet.svg)

## Стиль

Единый для всего набора:
- `viewBox="0 0 24 24"`
- `stroke="currentColor"` (наследуется от родителя через `color: var(--c-primary)`)
- `stroke-width="1.5"` (1.2 на 16 px, 2 на 48+ px — через `strokeWidth` prop)
- `fill="none"` (кроме маленьких dot-акцентов типа узла каблинга, центра снежинки)
- `stroke-linecap="round"`, `stroke-linejoin="round"`
- `aria-hidden="true"` + `focusable={false}` — декоративные по умолчанию

## DNA

Эстетика Круга сезонов ([agents/brand/logo/master.svg](../../../agents/brand/logo/master.svg)): чертёжные линии, геометрия, никаких filled shape'ов, никаких градиентов. Stroke-dasharray используется для обозначения «динамических» элементов (трос каблинга, течение воды в водостоке).

## Каталог

### Арбористика (7)

| Key | Label | Использование |
|---|---|---|
| `spil` | Спил деревьев | ServiceCard арбористики, mega-menu |
| `valka` | Валка деревьев | Подкатегория «Удаление» |
| `stump` | Корчевание пней | Подкатегория «Удаление» |
| `prune` | Обрезка, кронирование | Кластер «Обрезка» |
| `kabling` | Каблинг / брейсинг | Подкатегория «Укрепление» |
| `spray` | Опрыскивание | Кластер «Лечение/защита» |
| `chipper` | Измельчение веток | Подкатегория «Вывоз щепы» |

### Крыши / территория (4)

| Key | Label | Использование |
|---|---|---|
| `roof-snow` | Уборка снега с крыш | Главный B2B-оффер зимой |
| `gutter` | Чистка водостоков | Осенний оффер |
| `climber` | Промышленный альпинизм | Технологическая карточка |
| `boomlift` | Автовышка | Технологическая карточка |

### Мусор / демонтаж (2)

| Key | Label | Использование |
|---|---|---|
| `dumpster` | Вывоз мусора, контейнер | Кластер «Мусор» |
| `demolition` | Демонтаж строений | Кластер «Демонтаж» |

### Общие (3)

| Key | Label | Использование |
|---|---|---|
| `fixed-price` | Фикс-цена за объект | УТП-бейдж, guarantees |
| `fast-response` | Смета за 10 минут | УТП-бейдж hero |
| `legal-shield` | Штрафы ГЖИ/ОАТИ берём | B2B-оффер |

## Использование

```tsx
import { SpilIcon, RoofSnowIcon } from '@/design-system/icons/services/ServiceIcons'

<span className="inline-flex items-center gap-2 text-primary">
  <SpilIcon width={20} height={20} />
  Спил деревьев
</span>
```

Или через реестр для динамического выбора:

```tsx
import { SERVICE_ICONS, type ServiceIconKey } from '@/design-system/icons/services/ServiceIcons'

const Icon = SERVICE_ICONS['spil'].Component
<Icon className="h-5 w-5 text-primary" />
```

## Размеры

- **16 px** inline в body-тексте — бледноватые штрихи, stroke-width 1.2 рекомендуется
- **20 px** inline в label, mega-menu items
- **24 px** default — buttons, chips
- **32-48 px** stand-alone — ServiceCard, USP-бейджи, feature blocks
- **64+ px** hero illustrations — stroke-width 2, можно добавить заливку

## A11y

По умолчанию все иконки `aria-hidden="true"`. Если иконка несёт единственный смысл (без текста рядом) — оборачиваем в `<span role="img" aria-label="Спил деревьев">` или передаём текст через sibling `<span class="sr-only">`.

## Критерии приёмки иконки (art DoD)

- [ ] Читается на 16 px и на 48 px без замыливания
- [ ] Работает в mono (ч/б) — без потери смысла
- [ ] Работает в inverse (светлая на тёмном) через currentColor
- [ ] Не копирует конкурентские визуальные клише (бензопила, топор, лесоруб)
- [ ] Связь с реальной услугой читается за 1 секунду (тест: показать оператору без подписи)
- [ ] Экспортирована в `.svg` мастер + попала в `ServiceIcons.tsx`

## TODO

- [ ] Улучшить `prune` (кронирование) — сейчас ножницы в углу смотрятся отделённо
- [ ] Улучшить `boomlift` — стрелa слишком тонкая, добавить толщины
- [ ] Добавить `snow-truck` (вывоз снега), `lawn-mower` (стрижка газона), `excavator` (выравнивание), `brush` (вырубка кустарников) — при необходимости на конкретных LP
- [ ] `winter-decor` (украшение к Новому году) + `facade-clean` (мойка фасадов) — P2
- [ ] Storybook story с all icons — TODO P2

## Changelog

- **2026-04-24 · v0.9 draft** — первый выпуск 16 иконок. Рендер-скрипт [`site/scripts/render-service-icons.ts`](../../../site/scripts/render-service-icons.ts).
