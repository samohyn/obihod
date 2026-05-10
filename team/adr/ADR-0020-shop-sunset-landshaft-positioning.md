---
adr: 0020
title: Shop sunset (магазин саженцев — drop) + landshaft positioning (как 5-й pillar услуг)
status: accepted
deciders: [operator, po, arch]
date: 2026-05-09
related:
  - EPIC-SHOP-REMOVAL/intake.md
  - EPIC-SERVICE-PAGES-UX/intake.md (landshaft = 5-й pillar в master template)
  - design-system/brand-guide.html (удаление §15-29 в W3)
  - design-system/tov/shop.md (удаление в W3)
  - team/shop.md (archive в W2)
  - specs/EPIC-SEO-SHOP/ (archive в W2)
  - specs/EPIC-SEO-LANDSHAFT/ (часть переподшивается в EPIC-SERVICE-PAGES-UX)
  - specs/US-11-ia-extension/ (archive — 9 shop-иконок не используются)
  - team/archive/shop/ (target archive location)
  - specs/_archived/ (target archive location)
  - ~/.claude/plans/stateless-puzzling-valiant.md (программа Обиход 2.0)
supersedes:
  - project_shop_separate_team.md (memory)
  - project_shop_storage_decision.md (memory)
---

# ADR-0020 — Shop sunset & landshaft positioning

## Контекст

Проект Обиход развивался с двумя расширениями относительно core-услуг (4 pillar):
1. **Магазин саженцев и растений** — отдельная команда, своя Postgres, ЮKassa, monorepo `apps/shop/` (планировался scaffolding). На 2026-05-09 `apps/shop/` физически НЕ существует, но артефакты прорастают: `team/shop.md`, `team/archive/shop/` (7 ролей), `design-system/brand-guide.html` §15-29 (TOV+e-commerce компоненты), `design-system/tov/shop.md`, `specs/EPIC-SEO-SHOP/`, `specs/US-11-ia-extension/` (9 shop-иконок, мега-меню), shop секции в `team/backlog.md`, упоминания в `CLAUDE.md` (9 строк), Header.tsx мега-меню «Магазин» (lines 685-916), Footer.tsx «магазин саженцев», `site/components/blocks/types.ts` `IconLine = 'shop'`.
2. **Дизайн ландшафта** — самостоятельная услуга «под ключ» (проектирование + благоустройство + посадка). URL `/dizain-landshafta/` зашит в Header line 679 + Footer line 119. `specs/EPIC-SEO-LANDSHAFT/` discovery intake. Cross-link стратегия с shop (опылитель/каталог растений) запланирована.

Оператор 2026-05-09 принял bus-решение: **компания не будет заниматься магазином**. Цель — фокус на услугах + лиды + обгон liwood.ru. Магазин выводим. Параллельный вопрос — судьба landshaft.

## Решение

### 1. Shop sunset = ARCHIVE (не hard-delete)

Все shop-артефакты архивируются в `team/archive/shop/` и `specs/_archived/`. История стратегических решений (TOV Sage 50% / 9 категорий / B2B-опции / 5 голосовых сценариев / canon e-commerce компонентов в brand-guide) сохраняется в git и в archive-директориях. Стоимость хранения нулевая. Возврат к shop в будущем не потребует восстановления из git history.

**Действия по подсистемам:**

| Подсистема | Действие | Локация после |
|---|---|---|
| `team/shop.md` | move | `team/archive/shop/shop.md` |
| `team/archive/shop/` (7 ролей: poshop, be-shop, fe-shop, ux-shop, qa-shop, cr-shop, sa-shop) | keep как есть | `team/archive/shop/` |
| `design-system/brand-guide.html` §15-29 (id `shop-*`, ~3376-4786) | **DELETE** | удалены из brand-guide v2.3 |
| `design-system/tov/shop.md` | **DELETE** | удалён |
| `specs/EPIC-SEO-SHOP/` | move | `specs/_archived/EPIC-SEO-SHOP/` |
| `specs/US-11-ia-extension/` (9 shop-иконок + мега-меню) | move | `specs/_archived/US-11-ia-extension/` |
| `team/backlog.md` shop секции (5 записей) | edit | удалены |
| `CLAUDE.md` 9 упоминаний shop | edit | удалены / 10→9 ролей |
| `team/PROJECT_CONTEXT.md` | edit | 10→9 ролей |
| `Header.tsx` мега-меню «Магазин» (685-916) | edit | вырезано |
| `Footer.tsx` line 91 «магазин саженцев» | edit | удалено |
| `site/components/blocks/types.ts` line 32 `'shop'` | edit | удалено из `IconLine` |
| `apps/shop/` | n/a | физически нет — нечего удалять |
| `site/collections/` | n/a | shop-коллекций нет |
| `.github/workflows/` | n/a | shop в workflow нет |
| Pre-emptive 410 Gone для `/shop`, `/shop/*` | add | Payload `Redirects` |
| `site/app/llms.txt`/`llms-full.txt` | scan | 0 shop-mention после edit |
| Payload richText в Services/B2BPages/Blog | scan + clean | grep `/shop\|магазин\|саженц` чистится cw |

**Id-якоря НЕ перенумеровываются** в §1-14 / §30-33 / §34. Удалённые `shop-*` оставляют зазор. Внешние ссылки (например в archived доках `brand-guide.html#shop-pdp`) получат «прыжок в начало» — приемлемо для archive.

### 2. Landshaft = 5-й pillar услуг (KEEP)

Landshaft (дизайн ландшафта) **остаётся** и переподшивается из «extension» в обычный pillar услуг наравне с vyvoz-musora, arboristika, chistka-krysh, demontazh, uborka-territorii.

**Аргументы:**
- Услуга «под ключ» (проектирование + благоустройство + посадка), органичная для архетипа Caregiver+Ruler — не требует отдельной TOV (Sage был только у shop).
- URL `/dizain-landshafta/` уже зашит в Header line 679 + Footer line 119 → keep, никакого 410.
- +1 pillar к 4 → потенциал 30+ programmatic SD (15 cities × landshaft) для EPIC-LIWOOD-OVERTAKE.B5 roadmap.
- Liwood имеет `/services/landshaftniy-dizayn-uchastka/` → паритет конкурентного покрытия.
- `specs/EPIC-SEO-LANDSHAFT/` partially supersedes — discovery (kw + URL-map) переходит в EPIC-LIWOOD.B5 + EPIC-SERVICE-PAGES-UX.C5; `brand-guide-landshaft.html` НЕ создаётся (один brand-guide v2.3 покрывает все services).

**Альтернатива (отвергнуто):** drop landshaft вместе с shop. Аргумент: меньше работы. Минус: теряем готовое URL-присутствие, конкурентный паритет с liwood, потенциал programmatic SD. Чистая регрессия.

### 3. US-11 art-brief 9 shop-иконок = ARCHIVE

`specs/US-11-ia-extension/art-brief-ui.md` — 9 line-art shop-иконок (контейнер, прививка, подвой, опылитель, зона) предполагалось вынести в `site/components/icons/shop/`. Не понадобятся. Archive.

**Альтернатива (отвергнуто):** перепрофилировать как «природные мотивы» для landshaft. Минус: иконки спроектированы под shop (плодовые/контейнерные термины), не под услугу landscape design. Generation новых иконок для landshaft (если потребуется) — через fal.ai по brand-guide §icons style (Nano Banana Pro, line-art monochrome 1.5px).

### 4. Cross-link policy

- **Удалено:** services ↔ shop, shop ↔ landshaft, plant catalog cross-links.
- **Сохранено:** services ↔ services внутри 5 pillar (включая landshaft). Например: arboristika «удаление дерева» ↔ landshaft «дизайн участка после расчистки» — сохраняется как обычный related-services link.
- Cross-link map в EPIC-SERVICE-PAGES-UX.C2 master template (related-services block, neighbor-districts block).

## Последствия

### Положительные

- Команда фокусируется на услугах (4+1 pillar) и обгоне liwood без размывания.
- Brand-guide.html v2.3 чище (без §15-29).
- 9 ролей вместо 10 в `team/PROJECT_CONTEXT.md`.
- Landshaft получает первоклассный статус — 5-й pillar в master template, programmatic SD, JSON-LD + E-E-A-T (parity с другими pillar).
- Footer/Header copy чище.

### Отрицательные / риски

- R1 (Низкая × Средний): SEO 404 если Я.Вебмастер успел просканировать `/shop*`. Mitigation: 410 Gone в Payload `Redirects`. Я.Вебмастер 7-day мониторинг.
- R4 (Средняя × Средний): cross-link orphan 404 в Payload richText (Services/B2B/Blog). Mitigation: проход всех Payload-документов через Local API регексп, cw чистит.
- R5 (Высокая × Низкий): broken anchors `brand-guide.html#shop-*` в archived/release-notes. Mitigation: id-якоря §1-14/§30-33 НЕ перенумеровываем; archive-доки получают «прыжок в начало» — приемлемо.

### Что супержено

- `project_shop_separate_team.md` (memory 2026-04-21 — shop в apps/shop monorepo)
- `project_shop_storage_decision.md` (memory 2026-04-28 — shop отдельная Postgres)
- `team/backlog.md` shop-секции (5 записей)
- `team/PROJECT_CONTEXT.md` 10-ролевой пункт
- Cross-team coordination Telegram/SMTP shop notifications (остаются для panel + product)

## Verification (W6 EPIC-SHOP-REMOVAL)

- `pnpm build && pnpm test:e2e --project=chromium` — зелёный
- `pnpm test:a11y` axe-core — 0 critical violations
- `grep -RIn "shop\|магазин\|саженц\|питомник" site/ design-system/ team/ contex/ specs/ --exclude-dir=archive --exclude-dir=_archived --exclude-dir=release-notes --exclude=*.archive` = 0 hits
- Я.Вебмастер 48h после deploy — 0 новых 5xx, 0 новых 410 (shop никогда не индексировался)
- Lighthouse mobile p75 LCP не падает >2% от baseline 2026-05-09
- Sitemap diff = 0 URL изменено
- `brand-guide.html` v2.3 визуально валиден, no broken anchors в `nav` блоке
- Playwright before/after Header/Footer в `screen/EPIC-A/`

## Hand-off log

- 2026-05-09 21:35 MSK · operator → po: decisions apruved (archive ✅, landshaft = 5-й pillar ✅, US-11 archive ✅)
- 2026-05-09 21:35 MSK · po → arch: ADR-0020 written, ready for arch review
- (next) arch → po: ADR-0020 review → status: `accepted` (waiting)
- (next) po → dev/fe/design/seo/cw/devops/qa: W2-W6 dispatch
