# Art-brief для `ui` — US-11 IA Extension

**От:** `art` (Design Director)
**Дата:** 2026-04-27
**Источник:** `design-system/brand-guide.html` v1.7 (live demo)
**CLAUDE.md immutable обновлён:** 4 → 6 направлений (+ Дизайн ландшафта, + Магазин)

## Контекст

Оператор 2026-04-27 в сессии расширил IA сайта с 4 до 6 направлений:
- 5-е направление — **«Дизайн ландшафта»** (flat-link, монолитная страница).
- 6-е направление — **«Магазин»** (mega-menu, 9 preliminary категорий саженцев).

В brand-guide.html v1.7 это уже сверстано в sandbox. Эта задача — **перенести в prod**.

## Задача 1 — Mega-menu «Магазин» в `Header.tsx`

### Файлы
- `site/components/marketing/Header.tsx` (текущий компонент, 392 строки)
- `site/components/marketing/Header.module.css`
- `site/components/icons/services/index.tsx` (эталон формата иконок)

### Что делать

**1.1.** Создать новую папку `site/components/icons/shop/index.tsx` по образцу `services/`. Вынести 9 SVG из brand-guide.html:

```
fruit-tree         — Плодовые деревья
columnar-tree      — Колоновидные деревья
fruit-bush         — Плодовые кустарники
decor-bush         — Декоративные кустарники
flowers            — Цветы
roses              — Розы
large-trees        — Крупномеры
deciduous-tree     — Лиственные деревья
coniferous-tree    — Хвойные деревья
```

Каждая иконка — компонент `<NameIcon size={20} />` с `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"`. SVG path-данные взять 1:1 из секции «Shop Icons · 9 иконок v0.1» в brand-guide.html (~строка 970+).

**1.2.** Обновить `Header.tsx`:

- Добавить импорт `from '@/components/icons/shop'`.
- В типы добавить `ShopColumn` (3 колонки: Деревья / Кустарники / Цветы).
- После колонки `MEGA_COLUMNS` (Услуги) добавить `SHOP_COLUMNS` массив:

```typescript
const SHOP_COLUMNS: ShopColumn[] = [
  {
    title: 'Деревья',
    items: [
      { href: '/magazin/plodovye-derevya/', label: 'Плодовые деревья', icon: FruitTreeIcon },
      { href: '/magazin/kolonovidnye/', label: 'Колоновидные', icon: ColumnarTreeIcon },
      { href: '/magazin/listvennye/', label: 'Лиственные', icon: DeciduousTreeIcon },
      { href: '/magazin/khvoynye/', label: 'Хвойные', icon: ConiferousTreeIcon },
      { href: '/magazin/krupnomery/', label: 'Крупномеры', icon: LargeTreesIcon },
    ],
    allHref: '/magazin/derevya/',
    allLabel: 'Все деревья',
  },
  {
    title: 'Кустарники',
    items: [
      { href: '/magazin/plodovye-kustarniki/', label: 'Плодовые кустарники', icon: FruitBushIcon },
      { href: '/magazin/dekorativnye-kustarniki/', label: 'Декоративные кустарники', icon: DecorBushIcon },
    ],
    allHref: '/magazin/kustarniki/',
    allLabel: 'Все кустарники',
  },
  {
    title: 'Цветы',
    items: [
      { href: '/magazin/cvety/', label: 'Цветы', icon: FlowersIcon },
      { href: '/magazin/rozy/', label: 'Розы', icon: RosesIcon },
    ],
    allHref: '/magazin/cvety-rozy/',
    allLabel: 'Весь каталог цветов',
  },
];
```

- Отрендерить группу `<div class={styles.group}>` с триггером «Магазин» и панелью идентично существующей mega «Услуги» (строки ~226–275 в Header.tsx).
- Featured-row внизу панели Магазина:
  «Сезон посадки 2026 · доставка по МО · посадка с гарантией приживаемости 1 год · смета за день» + CTA «В каталог».

**1.3.** Порядок пунктов в шапке (immutable до изменения PO):

```
[Логотип] · Услуги ▾ · Районы ▾ · Кейсы ▾ · Магазин ▾ · Дизайн ландшафта · Цены · Блог · Контакты · [Получить смету]
```

URL slugs preliminary — `ba`+`po` подтверждают со SEO `seo1` отдельно (см. `note-po.md` рядом).

### Acceptance criteria

- [ ] 9 shop-иконок есть как `<Component>` в `site/components/icons/shop/index.tsx` с tsdoc.
- [ ] Header.tsx рендерит mega-menu Магазин 1:1 как в brand-guide.html (3 колонки, featured row, mobile accordion).
- [ ] Type-check + lint + format:check зелёные.
- [ ] Playwright E2E: в `header.spec.ts` добавить тест «Магазин mega открывается на hover, содержит 9 пунктов, featured CTA ведёт в каталог».
- [ ] CWV не регрессирует (Lighthouse ≥ 90).

## Задача 2 — flat-link «Дизайн ландшафта»

### Файлы
- `site/components/marketing/Header.tsx`

### Что делать

После пункта «Магазин ▾» добавить flat-link:

```jsx
<Link className={styles.trigger} href="/dizain-landshafta/">Дизайн ландшафта</Link>
```

URL preliminary — финал согласовывает `seo1` + `po`.

Подменю не нужно (направление монолитное в первой итерации). Если позже добавим этапы (Замер → Проект → Посадка → Уход) — можно расширить во вторую итерацию через mega.

### Acceptance criteria

- [ ] flat-link виден между «Магазин» и «Цены».
- [ ] mobile accordion содержит секцию «Дизайн ландшафта».
- [ ] нет 404 на `/dizain-landshafta/` — заглушка page или редирект до релиза контентной страницы (контент — отдельный US от `cw`+`be4`).

## Задача 3 — Вынос district-иконок и case-иконок в `site/components/icons/`

### Контекст

В brand-guide.html v1.7 в section «08 · Иконография» теперь полный реестр 4 линеек (49 glyph'ов): Service · Shop · District · Case. Из них только Service вынесены в `components/icons/services/` как .tsx компоненты. Остальные **только** inline SVG в brand-guide и в Header.tsx — это техдолг от v1.6 (district) и от старта (case).

### Что делать

**3.1.** Создать `site/components/icons/districts/index.tsx` с 9 компонентами:

```
OdintsovoIcon       — узел шоссе (две диагонали + точка)
KrasnogorskIcon     — холм с домом
IstraIcon           — купол монастыря с крестом
KhimkiIcon          — самолёт
MytishchiIcon       — водонапорная башня + ж/д-шпалы
PushkinoIcon        — ёлка с рельсами
RamenskoeIcon       — мост через воду (полукруг + dashed линия)
ZhukovskyIcon       — силуэт самолёта-памятник (МАКС)
MoskvaIcon          — компас (все округа)
```

SVG-данные взять 1:1 из brand-guide.html section #icons «District Icons · 9 v0.9» (там точные path-ы как в mega-menu Районы).

**3.2.** Создать `site/components/icons/cases/index.tsx` с 9 компонентами:

```
StormCleanupIcon       — молния + штриховой ветер
EmergencyRemovalIcon   — падающее дерево
UrgentRoofIcon         — крыша + сосульки
PruningSeasonIcon      — садовые ножницы (2 круга + рукоятки)
WinterPrepIcon         — ёлка + ограждение
PostRenovationIcon     — кувалда + дом
UkContractIcon         — многоэтажка с окнами
CottageVillageIcon     — 2 коттеджа на земле
FmContractIcon         — бизнес-центр с фасадом окон
```

SVG-данные — из brand-guide.html section #icons «Case Topic Icons · 9 v0.9» (1:1 как в mega-menu Кейсы).

**3.3.** Обновить `Header.tsx` — заменить inline SVG в Районы dropdown на импорты `from '@/components/icons/districts'`. То же для inline SVG в Кейсы dropdown — `from '@/components/icons/cases'`.

**3.4.** Обновить `components/district-card/district-card.tsx` (если уже есть) — использовать `from '@/components/icons/districts'`.

**3.5.** Если есть `CaseCard` компонент / шаблон страницы кейса — использовать `from '@/components/icons/cases'` для эмблемы темы.

### Acceptance criteria

- [ ] 9 district-иконок + 9 case-иконок есть как компоненты в `components/icons/{districts,cases}/index.tsx` с tsdoc.
- [ ] Header.tsx без inline-SVG для районов и кейсов.
- [ ] Никакой визуальной регрессии (Playwright snapshot).
- [ ] Бандл-размер не вырос больше чем на 4 KB gzipped — иконки tree-shakable, импортируются по имени.

## Зависимости

- Перед merge — apply **changelog brand-guide.html v1.7** (готов).
- После merge — `cw` пишет тексты для `/dizain-landshafta/` и `/magazin/` посадочных (отдельный art-brief на странички — после согласования URL slugs).

## Не входит в этот brief

- Контент `/magazin/` категорий (Payload коллекция `Products`) — это эпик `be4` + `cw`.
- Контент `/dizain-landshafta/` — `cw` + `be4`.
- SEO мета и sitemap — `seo1`.
- Калькулятор «дизайн ландшафта» — отдельный US (если нужен).
