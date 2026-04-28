# Записка для `po` — US-12 Admin Redesign

**От:** `art` (Design Director)
**Дата:** 2026-04-27 (вечер, после art-сессии)
**Статус:** требует оформления intake.md + Linear OBI issue + декомпозиции по ролям.

## Что произошло

Оператор 2026-04-27 (вечер) указал на текущее состояние Payload admin panel: «выглядит ужасно». Запросил:

1. Стартовая страница авторизации с логотипом.
2. Понятный интерфейс с боковым меню слева + контентом справа (классика).
3. **Каталог опубликованных страниц** — какие страницы есть на сайте + к каким разделам относятся.
4. Все остальные функции, которые сейчас есть в админке.
5. С использованием brand-guide и dev-команды (`ux` + `ui`), скиллов `fal.ai` и `ui-ux-pro-max`.

## Контекст: что уже было

- **US-3 (OBI-1) Admin UX Redesign** — закрыт по статусу, но фактически реализована только концепция:
  - art-concept.md v1 (палитра, типографика, группировка меню) ✓
  - BrandLogo / BrandIcon / BeforeDashboardStartHere / DashboardTile React-компоненты ✓
  - 107 строк `custom.scss` с переменными темы ✓
  - HHL coverage UI override — **минимальный**, дефолтный Payload UI просвечивает.

- Поэтому оператор и видит «ужасно» — концепт есть, реализация поверх native Payload неполная.

## Что я сделал как `art` в этой сессии

1. **art-concept-v2.md** — расширение v1, 13 разделов:
   - Login screen (новое)
   - Sidebar / Layout (визуал)
   - Dashboard + **Page Catalog widget** (новое, главный запрос оператора)
   - List view с bulk-actions
   - Edit view с **Tabs pattern** (для длинных форм SiteChrome 405 строк, Services 30 полей)
   - Status badges
   - Empty / 500 / 403 states
   - Mobile admin (раньше «не трогаем»)
   - Implementation roadmap (~10 чд)

2. **brand-guide.html v1.7 → v1.8** — расширил секцию «12 · Паблик → Payload» 6 живыми HTML mockups: Login, Layout, Dashboard+PageCatalog, Edit-with-Tabs, Status+BulkActions, Empty/500/403. Footer обновлён до v1.8.

3. **art-brief-ux.md** — для `ux`: персона админа, 3 CJM, IA проверка, 6 wireframes (desktop+mobile), a11y контракт.

4. **art-brief-ui.md** — для `ui`: финальные макеты на 8 экранов, 14 component spec.md в `design-system/components/admin/`, SCSS override mapping (selector level), fal.ai применение для **moodboard** (одного, не для prod).

5. **art-brief-cw.md** — для `cw`: micro-copy 11 секций (Login + Stats + Page Catalog + Filters + Actions + Tabs + Status + Empty + 403 + 500 + Profile), массовый аудит admin.description полей по 10 коллекциям.

## Что нужно от тебя (`po`)

### 1. Завести US-12 в Linear (team OBI)

Минимальный intake (`intake.md`):

```
US-12 Admin Redesign Final · UI override + Login + Layout + Page Catalog + Tabs + States

Бизнес-цель: оператор просит понятный admin вместо текущего «ужасного». Это критично — оператор каждое утро принимает заявки, дневное обновление контента и вечернюю публикацию кейсов через эту панель. Текущий ход через дефолтный Payload UI замедляет работу и раздражает.

Не делать в этой US: новых полей в коллекциях (это US-3 уже сделал), новых features (websocket leads, magic link login). Чисто visual + UX layer над тем что есть.

Pre-intake:
- Дизайн готов (art-concept-v2 + brand-guide v1.8 mockups)
- Art-brief ui — есть
- Art-brief cw — есть
- Art-brief ux — есть
```

### 2. Декомпозиция по ролям (через под-задачи US-12)

| Sub-task | Роль | Объём | Зависимость |
|---|---|---|---|
| US-12.1 ux-personas + 3 CJM + 6 wireframes | `ux` | 1 день | art-brief-ux.md |
| US-12.2 финал макетов 8 экранов + 14 specs | `ui` | 3 дня | art-brief-ui.md, ux-wireframes |
| US-12.3 финал copy 11 секций + admin.description audit | `cw` | 1 день | art-brief-cw.md |
| US-12.4 SCSS override extension `custom.scss` (107 → ~400 строк) | `fe1`+`be4` | 1 день | ui spec.md готов |
| US-12.5 `<AdminLogin>` component override | `fe1` | 0.5 дня | ui spec login |
| US-12.6 `<PageCatalog>` server component (REST aggregation 7 коллекций) | `be4` | 1 день | ui spec page-catalog |
| US-12.7 Tabs field в 10 коллекциях (Services / SiteChrome / etc.) | `be4` | 1.5 дня | cw tabs labels |
| US-12.8 `<EmptyState>` `<ErrorState>` `<SkeletonTable>` | `fe1` | 1 день | ui spec states |
| US-12.9 Playwright admin smoke + Lighthouse | `qa1` | 0.5 дня | всё выше готово |
| US-12.10 ADR-0005 Admin Customization Strategy | `tamd` | 0.5 дня | до начала US-12.4 |

**Итого:** ~10 человеко-дней. Параллелится: art-briefs готовы → ux+ui+cw работают одновременно → потом fe1+be4. ~2 недели календарно.

### 3. ADR-0005 — задача `tamd` до начала реализации

Нужен ADR `Admin Customization Strategy` с пунктами:
- Какие части Payload admin override через CSS-only (custom.scss).
- Какие через `admin.components.*` (Logo, Icon, beforeDashboard, afterDashboard, views.Login, views.Edit).
- Что НЕ override (Layout, ListView, EditView с tabs — native Payload).
- SCSS specificity strategy (`:where()` для нестабильных payload-классов).
- Versioning стратегия Payload — что делать при минорах.

### 4. Open questions от меня для оператора

В [art-concept-v2 §11](./art-concept-v2.md#11-open-questions-для-po--оператора):

1. Login auth — email+password (default) или magic link (другой US)?
2. Page Catalog widget — только на dashboard или + отдельная страница `/admin/catalog`? Я заложил «только виджет».
3. CSV export в Page Catalog — сразу или v2? Я заложил «сразу» (30 строк кода).
4. Profile dropdown — что в нём? Минимум `Мой профиль` + `Выйти`. Хочешь больше?
5. Уведомления о новых Leads (badge на меню) — в этой итерации или US-13?

### 5. Риски / open scope

- **Регрессия на проде** — admin сейчас работает и оператор каждый день им пользуется. SCSS override может сломать какие-то state'ы. Тестировать на staging-домене (если есть) или branch-preview.
- **Payload версия** — major апгрейды могут сломать кастомизации (CSS селекторы). ADR-0005 должен описать защитную стратегию.
- **Mobile admin** — не уверен что приоритетен; если оператор не пользуется с iPhone — можем отложить во v3.
- **Custom List View** мы НЕ переписываем — но если CSS overrides не дают нужного результата (например cells не центрируются нормально), `fe1` может предложить custom компонент. Это будет out-of-scope для US-12.

### 6. fal.ai

Использовать для **одной точечной задачи** — moodboard login design (4-6 reference картинок). НЕ для прод-картинок (anti-pattern dataguide v1.8 §Anti-patterns admin). Это в `art-brief-ui.md §7`.

## Что я НЕ сделал (вне зоны art)

- Linear OBI issue — твоя зона + `in`.
- ADR-0005 — `tamd`.
- Custom React components в `site/` — `fe1`+`be4`.
- Финал текстов — `cw`.
- Playwright тесты — `qa1`.
- Реализация SCSS селекторов — `fe1`+`be4`.

## Файлы

```
team/specs/US-12-admin-redesign/
├── art-concept-v2.md      # 13 разделов с anatomy
├── art-brief-ux.md        # для ux+wireframes
├── art-brief-ui.md        # для ui+spec.md
├── art-brief-cw.md        # для cw+admin.description audit
└── note-po.md             # этот файл

design-system/brand-guide.html   # v1.8 — секция «12 · Паблик → Payload» расширена 6 mockups
```

Связанные:
- [`team/specs/admin-visual/art-concept.md`](../admin-visual/art-concept.md) — v1 (не переделывать).
- [`team/specs/US-3-admin-ux-redesign/`](../US-3-admin-ux-redesign/) — старые ux-wireframes / ui-mockups / be4-fields-checklist (re-use где можно).
