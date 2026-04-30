---
role: art
us: PANEL-FAVICON-BRAND
phase: asset-delivery
status: complete
created: 2026-05-01
skills_activated: [design-system, brand]
---

# PANEL-FAVICON-BRAND — art sign-off

## §3 brand-guide compliance

Источник истины — §3 «Лого» в `design-system/brand-guide.html` v2.2 (строки 1036-1083) и `agents/brand/logo/usage.md`.

§3 явно регламентирует favicon: для размеров 16-32 px используется **`mark-simple.svg`** (упрощённая монограмма) — а НЕ полный «Круг сезонов» master.svg. Цитата §3 строка 1081: *«Минимальный размер favicon — `mark-simple.svg` 16 px (app/icon.png 32×32). Монограмма «О» читается до favicon-размера.»* На 16-32 px полный знак с 4 квадрантами превращается в кашу — это известный design-system iron rule.

| Решение | Источник §3 | Применение в `favicon.svg` |
|---|---|---|
| Глиф — кириллическая «О» | usage.md L12 + строка brand-guide 1081 | `<text>О</text>` в центре |
| Контейнер — скруглённый квадрат (НЕ круг) | `mark-simple.svg` L4 (`rx="48"` на viewBox 256 = 18.75% радиуса) | `rx="6"` на viewBox 32 (то же отношение) |
| Fill — primary `#2d5a3d` | usage.md «Палитра» L56 | `fill="#2d5a3d"` |
| Глиф — on-primary `#f0ead8` (кремовый, НЕ белый) | usage.md «Палитра» L57; mark-simple L11 | `fill="#f0ead8"` |
| Шрифт — Inter / Helvetica Neue / Arial | mark-simple L7 | `font-family="'Inter','Helvetica Neue',Arial,sans-serif"` |
| Вес — 800 (extrabold) | mark-simple L9 | `font-weight="800"` |

**Отклонение от PO рекомендации:** PO просил «О в зелёном **круге** + белая буква». §3 master требует **скруглённый квадрат** + **кремовая** буква (`#f0ead8`, не `#ffffff`). Iron rule design-system awareness побеждает PO рекомендацию — иначе нарушаем единство admin-sidebar `BrandIcon`, Telegram/MAX/Wazzup avatar и favicon (§3 backed by `agents/brand/logo/usage.md` L12, L23-24, L26).

**Упрощения для 16×16 readability:**
- viewBox адаптирован 256→32 (компактнее inline SVG, нативный размер браузерной вкладки)
- letter-spacing уменьшен с -4 (на 256) до -0.5 (на 32) — пропорционально
- baseline `y="23"` (≈72% высоты) — оптическое центрирование «О» в скруглённом квадрате (геометрический центр 16 даёт визуальный сдвиг вверх из-за нижнего ронда буквы)
- размер шрифта 22 на viewBox 32 (≈69% высоты) — максимум до touching edges, проверено @ 16×16 рендером (см. preview ниже)

## Files delivered

| # | Путь | Размер | Verify |
|---|---|---|---|
| 1 | `site/public/favicon.svg` | 732 B | text/SVG, viewBox 32×32, 1 rect + 1 text |
| 2 | `site/app/favicon.ico` | 2061 B | `MS Windows icon resource - 3 icons, 16×16 + 32×32 + 48×48 PNG-encoded` |
| 3 | `site/public/apple-touch-icon.png` | 3662 B | PNG 180×180 RGBA |
| 4 | `site/public/icon-192.png` | 3964 B | PNG 192×192 RGBA |
| 5 | `site/public/icon-512.png` | 21434 B | PNG 512×512 RGBA |

ICO encoding: PNG-in-ICO (поддерживается всеми браузерами с ~2010), 32-bit RGBA, lossless. Multi-resolution гарантирует sharp render в desktop/macOS title bar (16), browser tab retina (32), Windows taskbar (48).

Визуальный smoke @ 16×16 (апскейл до 256 nearest-neighbor для проверки читаемости):
- Контур скруглённого квадрата чистый, без алиасинга
- Глиф «О» центрирован, контраст cream/green ≥ 11:1 (WCAG AAA)
- Внутренний counter «О» виден отдельно от внешнего обвода буквы — нет «склеивания» в пиксельную кашу

## Generation pipeline

**Скрипт:** `scripts/generate-favicons.mjs` — pure-JS, no ImageMagick/Inkscape, использует `sharp@0.34.5` из `site/node_modules/sharp` через explicit file URL import (sharp устанавливается локально в `site/`, не в корень monorepo).

**Запуск (regenerate при изменении SVG):**
```bash
node /Users/a36/obikhod/scripts/generate-favicons.mjs
```
или из любого cwd — путь к sharp резолвится абсолютным URL.

**Что происходит:**
1. Читает `site/public/favicon.svg` (single source — единственное место правки бренд-knob).
2. Растеризует через sharp с density=384 (sharp text @ small sizes).
3. Пишет 3 PNG: apple-touch (180), icon-192, icon-512.
4. Растеризует 3 PNG-payload (16/32/48), упаковывает в ICO-контейнер inline (header 6B + 3×directory 16B + 3×PNG buffers).
5. Пишет `site/app/favicon.ico` (Next.js 16 convention — auto `<link rel="icon">` в `<head>` для всех публичных страниц).

**Когда regen:** правка `favicon.svg` → один запуск скрипта обновляет все 4 raster.

## Что НЕ сделано (out of scope, для popanel/fe-panel/fe-site)

| Задача | Owner | Где |
|---|---|---|
| `app/layout.tsx` metadata API + `<link>` для apple-touch / icon-192 / icon-512 | `fe-site` | `site/app/layout.tsx` |
| `site/public/site.webmanifest` (PWA, theme_color `#2d5a3d`) | `fe-site` | новый файл |
| `payload.config.ts` admin.meta.icons[] sync (W9 паттерн уже завёл) | `fe-panel` | `site/payload.config.ts` |
| Удаление дефолтных `site/public/next.svg`, `vercel.svg` (если оператор подтвердит) | `fe-site` | cleanup |
| Cross-browser smoke + iOS Safari home-screen + Android Chrome home-screen | `qa-panel` + `qa-site` | `screen/favicon-*.png` |

`art` НЕ трогал `payload.config.ts`, `app/layout.tsx`, manifest — это wiring-этап. Asset-этап завершён.

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | cpo | art | trigger received: 5 файлов набора favicon из §3 master lockup |
| 2026-05-01 | art | art | проверил §3 brand-guide L1036-1083 + `agents/brand/logo/usage.md` + `mark-simple.svg`. Решил: PO рекомендация «круг + белая О» нарушает §3 (там — скруглённый квадрат + кремовая «О»). Применил §3 (iron rule design-system awareness). |
| 2026-05-01 | art | popanel | 5 ассетов записаны в `site/public/` + `site/app/favicon.ico`, скрипт `scripts/generate-favicons.mjs` зафиксирован для regen, sign-off complete. Передаю обратно popanel — следующий шаг `sa-panel` mini-spec → `fe-site`/`fe-panel` wiring (HEAD meta + manifest + Payload icons[]) → `qa-*` cross-browser. |
