# Использование логотипа «Обиход»

Финальный знак — **Круг сезонов**. Мастер-файл: [master.svg](master.svg).
Роль: `art` (Design Director). Дата утверждения: 2026-04-24.

## Состав пакета

| Файл | Размер SVG | Назначение |
|---|---|---|
| [master.svg](master.svg) | 1200×1200 | Полный lockup с подписями квадрантов и wordmark в центре — презентации, визитки, документы |
| [mark.svg](mark.svg) | 1200×1200 | Знак без текста — OG-мета, большие avatar, marketing-баннеры от ~128 px |
| [mark-simple.svg](mark-simple.svg) | 256×256 | Упрощённая монограмма «О» в квадрате — favicon, apple-touch, sidebar admin, avatar Telegram/MAX/Wazzup |
| [horizontal.svg](horizontal.svg) | 1600×480 | Горизонтальный lockup: знак + wordmark справа — email-подписи, website header большого размера |
| [mono.svg](mono.svg) | 1200×1200 | Чёрный master — печать на бумаге, спецодежда, техника, документы без цвета |
| [inverse.svg](inverse.svg) | 1200×1200 | Светлый знак на тёмно-зелёном фоне — тёмная тема, заставки, стикеры |

Производные PNG-экспорты (`master.png`, `mark.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `og-mark.png`) собираются скриптом [`site/scripts/render-logo-exports.ts`](../../../site/scripts/render-logo-exports.ts). При изменении SVG — перегенерировать.

## Выбор версии под контекст

| Контекст | Минимальный размер | Что использовать |
|---|---|---|
| Favicon браузера | 16 px | `mark-simple.svg` (в Next.js 16 — `site/app/icon.png` 32×32) |
| Apple touch icon | 180 px | `mark-simple.svg` (`site/app/apple-icon.png`) |
| Аватар Telegram / MAX / Wazzup | 160 px | `mark-simple.svg` |
| Payload admin sidebar | 28 px | `BrandIcon` компонент (= `mark-simple`) |
| Payload admin login | ~200×60 | `BrandLogo` компонент (wordmark + тэглайн) |
| Website header | 36-48 px | `LogoMark` компонент (упрощённый mark, inline SVG) |
| Website footer | 40 px | `LogoMark` компонент |
| Marketing OG-image | 1200×630 | `mark.svg` + wordmark отдельным слоем |
| Визитка, бланк | — | `master.svg` |
| Печать на спецодежде / технике | — | `mono.svg` |
| Стикер на тёмной машине | — | `inverse.svg` |

## Clear-space

Вокруг логотипа — свободное пространство не меньше **высоты глифа «О» в wordmark** во все стороны. На самом знаке-круге — не меньше **1/8 диаметра внешнего круга**.

Примеры:
- `master.svg` (viewBox 1200) — clear-space ≥ 70 px вокруг внешнего круга.
- `horizontal.svg` — clear-space ≥ высоты буквы «О» (~80 px при нативном размере).

## Минимальные размеры

| Вариант | Min размер | Почему |
|---|---|---|
| Полный знак `mark.svg` | 64 px | Ниже — 4 глифа квадрантов сливаются. 48 px — только в версии `LogoMark` компонента |
| Упрощённый `mark-simple.svg` | 16 px | Монограмма «О» читается до favicon-размера |
| Horizontal lockup | 200 px по ширине | Wordmark становится нечитаемым уже ниже |
| Master lockup | 320 px | Подписи квадрантов становятся нечитаемыми ниже |

## Палитра

| Роль | HEX | Где |
|---|---|---|
| Primary (бренд-зелёный) | `#2d5a3d` | Основной цвет знака и wordmark |
| On-primary (кремовый) | `#f0ead8` | Фон master, светлые штрихи на inverse |
| Ink (чёрный) | `#1c1c1c` | Mono-версия, когда цвет запрещён |
| Accent (янтарный) | `#e6a23c` | **Не использовать в самом логотипе.** Только как акцент в окружении |

Источник токенов — [`site/app/globals.css`](../../../site/app/globals.css).

## Запрещено

- ❌ Растягивать по одной оси (пропорции всегда сохраняются).
- ❌ Перекрашивать в цвета вне бренд-палитры.
- ❌ Ставить outline / обводку вокруг готового знака.
- ❌ Добавлять тень, glow, gradient по умолчанию.
- ❌ Размещать поверх низкоконтрастного фото без затемняющего слоя.
- ❌ Копировать декоративные элементы (круг, крест, глифы) по отдельности в чужие макеты — знак работает только целиком.
- ❌ Заменять кириллическое «ОБИХОД» на латинское `OBIKHOD` в wordmark как основной вариант (латинский — только для международного контекста).
- ❌ Возвращать к временным заглушкам (дефолтный Next.js favicon, Payload `/admin` P-logo).

## Интеграция в код

- **Marketing:** [`site/components/marketing/_shared/LogoMark.tsx`](../../../site/components/marketing/_shared/LogoMark.tsx) — inline SVG 48×48 с prop `size` и `animated`.
- **Payload admin:** [`site/components/admin/BrandLogo.tsx`](../../../site/components/admin/BrandLogo.tsx) + [`BrandIcon.tsx`](../../../site/components/admin/BrandIcon.tsx). Подхватываются через `admin.components.graphics` в [`payload.config.ts`](../../../site/payload.config.ts). После изменения — `pnpm generate:importmap` перед build (иначе importMap устаревает — см. learnings.md 2026-04-23).
- **Favicon / PWA:** [`site/app/icon.png`](../../../site/app/icon.png) + [`apple-icon.png`](../../../site/app/apple-icon.png) — Next.js 16 подхватывает автоматически по convention.

## Что дальше

- [ ] `design-system/brand-guide.html` — обновить статус с `v0.1 draft` на `v1.0 approved`.
- [ ] Обновить OG-image на всех landing pages — взять `og-mark.png` как базу и наложить контекстный заголовок.
- [ ] Визитки / бланки / коммерческие предложения в B2B — положить master-версию.
- [ ] ТМ-регистрация знака «ОБИХОД» у патентного поверенного — open-question из `CLAUDE.md`.
- [ ] Для фотографий бригад и техники на тёмном фоне использовать `inverse.svg` как стикер/нашивку.
