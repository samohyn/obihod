# Logo · spec

**Статус:** v1.0 · approved 2026-04-24 · роль `ui` · утверждено `art`
**Мастер-артефакты:** [agents/brand/logo/](../../../agents/brand/logo/) · usage — [usage.md](../../../agents/brand/logo/usage.md)
**Brand-гайд:** [brand-guide.html §02 Логотип](../../brand-guide.html)

## Purpose

Визуальная идентификация Обихода на всех surface'ах: marketing-сайт, Payload admin, favicon/PWA, OG-превью в соцсетях, коммуникации в Telegram/MAX/Wazzup, печать на спецодежде и технике.

## Концепция

**«Круг сезонов»** — инженерный чертёж-циркуляр. Внешний круг, крест делит на 4 квадранта годового цикла услуг: NW весна-осень (ёлочка), NE зима (снежинка-роза ветров), SW круглый год (план двора), SE круглый год (навес с вывозом).

**Archetype fit:** Ruler (схема, циркуляр, административная ясность) + Caregiver («круглый год держим двор в порядке»).

## Variants

| Вариант | Файл | Применение | Min-размер |
|---|---|---|---|
| `master` | [master.svg](../../../agents/brand/logo/master.svg) | Презентации, визитки, бланки, документы | 320 px |
| `mark` | [mark.svg](../../../agents/brand/logo/mark.svg) | OG-image, marketing-баннеры, большие avatar | 64 px (128 px идеал) |
| `horizontal` | [horizontal.svg](../../../agents/brand/logo/horizontal.svg) | Website header (desktop), email-подписи | 200 px ширина |
| `mark-simple` | [mark-simple.svg](../../../agents/brand/logo/mark-simple.svg) | Favicon, apple-touch, admin sidebar, Telegram/MAX avatar | 16 px |
| `mono` | [mono.svg](../../../agents/brand/logo/mono.svg) | Печать на бумаге, спецодежда, ч/б документы | 32 px |
| `inverse` | [inverse.svg](../../../agents/brand/logo/inverse.svg) | Тёмная тема, стикеры на тёмной технике | 32 px |

В коде React-компоненты рендерят **упрощённые inline SVG** оптимизированные под конкретный размер — не пересылают 50 KB мастер-SVG в браузер.

## States

Логотип — не интерактивный компонент в классическом смысле, но у него есть состояния применения:

| State | Поведение |
|---|---|
| `default` | `color: var(--c-primary)` (= `#2d5a3d`) |
| `inverse` | `color: var(--c-on-primary)` (= `#f0ead8`), на тёмно-зелёном фоне |
| `mono` | `color: var(--c-ink)` (= `#1c1c1c`), ч/б |
| `hover` (на якорной ссылке) | Не меняется. Interactive feedback даёт родительский `<a>` (underline / opacity), а не знак |
| `animated` (prop `animated` у `LogoMark`) | CSS-класс `.circle-mark` с плавной ротацией (≤ 30 c полный оборот, `prefers-reduced-motion` выключает) |

## Token usage

```css
/* Стандартное применение */
color: var(--c-primary);          /* #2d5a3d */

/* На тёмно-зелёном фоне */
background: var(--c-primary);
color: var(--c-on-primary);       /* #f0ead8 */

/* Ч/б вариант */
color: var(--c-ink);              /* #1c1c1c */
```

Шрифт wordmark: `'Inter','Helvetica Neue',Arial,sans-serif` · `font-weight: 800` · `letter-spacing: -0.03em`
Шрифт тэглайна: тот же стек · `font-weight: 500` · `letter-spacing: 0.18em` · `text-transform: uppercase`

Логотип **не использует** accent `#e6a23c` — янтарный только в окружении, не в самом знаке.

## Реализации в коде

### `LogoMark` — marketing (36–64 px)

**Файл:** [site/components/marketing/_shared/LogoMark.tsx](../../../site/components/marketing/_shared/LogoMark.tsx)

```tsx
<LogoMark size={36} animated />
```

**Props:**
| Prop | Тип | Default | Назначение |
|---|---|---|---|
| `size` | `number` | `36` | Рендерный размер в px (SVG viewBox 48, масштабируется) |
| `animated` | `boolean` | `false` | Применяет класс `.circle-mark` (плавная ротация) |

Цвет наследуется через `currentColor` — оборачивающий элемент задаёт `color: var(--c-primary)` / `var(--c-on-primary)` / `var(--c-ink)`.

### `BrandLogo` — Payload admin login (wordmark)

**Файл:** [site/components/admin/BrandLogo.tsx](../../../site/components/admin/BrandLogo.tsx)

Wordmark «ОБИХОД» 32/800 + тэглайн «круг сезонов · admin». Без знака — на login-surface места мало, полный знак сливается.

### `BrandIcon` — Payload admin sidebar (mark-simple, 28×28)

**Файл:** [site/components/admin/BrandIcon.tsx](../../../site/components/admin/BrandIcon.tsx)

`mark-simple`: квадрат rx6 `#2d5a3d` + белая кириллическая «О» Inter 18/700. Контраст ~8.9:1 (AAA large text).

### Favicon / Apple touch

Next.js 16 convention:
- [site/app/icon.png](../../../site/app/icon.png) 32×32 — favicon
- [site/app/apple-icon.png](../../../site/app/apple-icon.png) 180×180 — iOS home-screen

Обе генерируются из `mark-simple.svg` через [site/scripts/render-logo-exports.ts](../../../site/scripts/render-logo-exports.ts). Перегенерировать при изменении мастер-SVG.

## Accessibility

- **aria-hidden="true"** на всех декоративных SVG — знак повторяет текстовый wordmark «ОБИХОД» рядом; читалка не должна его озвучивать отдельно.
- **SVG содержит `<title>` и `<desc>`** в мастер-файлах (`master.svg`, `mark.svg`) — для случаев когда логотип используется в изоляции без соседнего текста.
- **Контраст:** `#2d5a3d` на `#f0ead8` = **~8.1:1** (AAA для body). На `#ffffff` = **~7.4:1** (AAA для body). Inverse `#f0ead8` на `#2d5a3d` = тот же контраст.
- **Reduced motion:** `animated` prop `LogoMark` выключается через CSS `@media (prefers-reduced-motion: reduce)` в `globals.css` — пользователь с чувствительностью к анимации получает статический знак.
- **Min touch-target:** логотип в header часто якорная ссылка. Обёртка `<a>` должна иметь `min-width/height: 44 px` (WCAG 2.2 AA).

## Responsive

| Breakpoint | Surface | Вариант | Размер |
|---|---|---|---|
| mobile (≤ 767 px) | header | `LogoMark` | 32 px |
| mobile | footer | `LogoMark` | 40 px |
| tablet (768–1023 px) | header | `LogoMark` | 36 px |
| tablet | footer | `LogoMark` + wordmark рядом | 40 px |
| desktop (≥ 1024 px) | header | `LogoMark` + wordmark рядом (в перспективе — `horizontal` lockup) | 40 px |
| desktop | footer | `LogoMark` + wordmark | 48 px |
| любой | admin login | `BrandLogo` (wordmark) | 200×60 |
| любой | admin sidebar | `BrandIcon` | 28×28 |

Мастер-SVG не используется в рантайме (размер файла, шрифты). Только в статических surface'ах (документы, OG-image, презентации).

## Edge cases

- **OG-image social превью:** `og-mark.png` 1200×1200 — центрированный знак, по бокам wordmark и заголовок страницы как overlay. Генерируется в OG endpoint (TODO — см. ниже).
- **Очень узкий mobile header (< 320 px, legacy Android):** показываем только `LogoMark` 32 px, wordmark скрыт `hidden sm:inline`.
- **Тёмная тема (prefers-color-scheme: dark):** CSS-переопределение `color: var(--c-on-primary)` на `LogoMark`, фон окружения — `var(--c-primary)` или тёмно-серый. Тёмная тема MVP — опциональна, по умолчанию не включена.
- **Печать (print stylesheet):** логотип выводится в `mono` (`color: var(--c-ink)`). Можно подключить `@media print { .logo { color: #1c1c1c; } }`.
- **Контраст на низкоконтрастном фоне (фото):** если знак ложится на пёстрое фото — ставим заливку круга кремовым `#f0ead8` как плашку. В мастере заложено, просто используется как обёртка.

## Definition of Done (spec)

- [x] Мастер-SVG утверждены `art`.
- [x] React-компоненты `LogoMark`, `BrandLogo`, `BrandIcon` существуют и рендерятся.
- [x] Next.js 16 favicon convention — `icon.png` + `apple-icon.png` сгенерированы.
- [x] TypeScript type-check проходит.
- [x] Usage-guide [agents/brand/logo/usage.md](../../../agents/brand/logo/usage.md) закрывает min-размеры, clear-space, запрещённое.
- [x] Brand-гайд [brand-guide.html](../../brand-guide.html) обновлён v0.1 → v1.0.
- [ ] **TODO (следующая итерация):** OG-image endpoint для landing pages на базе `og-mark.png`.
- [ ] **TODO:** Storybook story для `LogoMark` / `BrandLogo` / `BrandIcon` (когда Storybook будет установлен — сейчас нет).
- [ ] **TODO:** E2E-тест, который проверяет что в HTML страниц нет дефолтного Payload P-логотипа или дефолтного Next.js favicon (защита от регрессий importMap).

## Changelog

- **2026-04-24 · v1.0** — утверждён «Круг сезонов». Заменены `LogoMark`, `BrandLogo.tsx` (тэглайн `порядок под ключ · admin` → `круг сезонов · admin`, weight 700 → 800). Удалён дефолтный `favicon.ico`, добавлены `icon.png` + `apple-icon.png`.
- **2026-04-23 · v0.1 draft** — временное решение «wordmark без символа + монограмма О» в admin (см. [devteam/specs/admin-visual/art-concept.md](../../../devteam/specs/admin-visual/art-concept.md)). Оставалось до утверждения финального знака.
