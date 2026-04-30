---
role: cpo
us: PANEL-FAVICON-BRAND
phase: cross-team-trigger
status: trigger-sent
created: 2026-05-01
updated: 2026-05-01
trigger_to: art (через design команду)
trigger_from: popanel (panel команда)
---

# PANEL-FAVICON-BRAND — cpo trigger в `art`

## Контекст trigger'а

`popanel` поднял через меня (`cpo`) cross-team trigger в `art` команды `design/`. Причина — favicon на всём периметре сайта (`/admin` + публичный сайт `obikhod.ru`) сейчас дефолтный Next.js (Vercel ▲ glyph), бренд-favicon ОБИХОД ни разу не был положен в репо.

**Источник:** запрос оператора 2026-05-01 на скрине `/admin/` («favicon сейчас не тот — на всех страницах сайта перепроверить, в панели сейчас чёрный круг с белым треугольником»).

**RICE 38, MoSCoW M, P0** — топ panel.next по приоритету. Удар по brand perception на B2C-вкладке + admin tab оператора.

## Что нужно от `art`

Создать набор бренд-favicon из §3 master lockup в `design-system/brand-guide.html`:

| # | Файл | Размер / формат | Source |
|---|---|---|---|
| 1 | `site/public/favicon.svg` | SVG, упрощённая адаптация §3 master lockup для 16×16 / 32×32 (читаемая «О» в круге, бренд-зелёный `#2d5a3d` или контурный) | §3 brand-guide |
| 2 | `site/app/favicon.ico` | ICO мульти-resolution (16/32/48) | export from svg |
| 3 | `site/public/apple-touch-icon.png` | PNG 180×180 | export |
| 4 | `site/public/icon-192.png` | PNG 192×192 (PWA / Android) | export |
| 5 | `site/public/icon-512.png` | PNG 512×512 (PWA / Android) | export |

**Стиль (PO рекомендация):** solid fill «О» в зелёном круге (бренд-primary `#2d5a3d`) — более читаемо @ 16×16. Контурный fallback опционален. Если `art` хочет 3 варианта на превью оператору — это OK, но не блокирует rollout (можно начать с одного и итерировать).

**Sign-off:** `art` подтверждает §3 compliance в кратком note-art.md в `specs/PANEL-FAVICON-BRAND/`.

## Зачем `cpo` участвует

`art` — отдельная команда `design/` (PO — `art` сам, у него mandate автора brand-guide.html). По iron rule cross-team trigger в `art` идёт через `cpo` (popanel НЕ обращается напрямую к чужой команде без owner-эскалации).

`cpo` функция здесь — единственный coordinator, фиксирует trigger, проверяет приоритеты `art` (нет ли у них блокирующего эпика, который сделает FAVICON-BRAND в очередь). Если `art` загружен (например, `brand-guide-landshaft.html` от `poseo` уже в работе) — `cpo` решает приоритет: FAVICON-BRAND vs landshaft brand-guide.

**`cpo` decision (предварительно):** FAVICON-BRAND имеет приоритет над `brand-guide-landshaft.html` discovery (последний — research, не блокирует deploy; FAVICON — production bug visibility). Если `art` параллельно может вести оба — оба идут параллельно. Если ресурс конфликтен — FAVICON first (0.2 чд `art`, не блокирует landshaft research).

## Параллельность

После SVG-asset от `art`:
- `fe-site` подкладывает в `site/app/layout.tsx` metadata API + `site/public/site.webmanifest`
- `fe-panel` синкает `site/payload.config.ts` admin.meta.icons[] (W9 паттерн)
- `qa-panel` + `qa-site` cross-browser smoke (Chrome / Safari / Firefox + iOS Safari home-screen + Android Chrome home-screen)
- Двойной review `cr-panel` + `cr-site` (cross-team)

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | cpo | поднял cross-team trigger в art (PANEL-FAVICON-BRAND) |
| 2026-05-01 | cpo | art (через design команду) | trigger sent: 5 файлов favicon-набора из §3 master lockup. Дедлайн 1 чд. Приоритет — выше landshaft brand-guide research (см. cpo decision выше). Sign-off — `note-art.md` в этой папке. |
| 2026-05-01 | cpo | popanel | trigger зафиксирован, art в курсе. Когда asset готов — popanel ведёт wiring (sa-panel mini-spec → fe-panel + fe-site). |
