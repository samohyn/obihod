# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-04-27, ночь)

### Свежайшее: OBI-24 admin full mockup pass deployed (2026-04-27 ночь)

PR [#75](https://github.com/samohyn/obihod/pull/75) merged как `afaa991` → main → auto-deploy success.

**Что задеплоено** (точно по `design-system/brand-guide.html §12`):

| §brand-guide | После PR #75 |
|---|---|
| §12.1 Login | Master lockup: inline SVG «Круг сезонов» 56×56 + wordmark «ОБИХОД» 36px + admin-tagline mono uppercase + footer copyright |
| §12.4 Authors | 4 tabs (Основные/Био/Связи/SEO) |
| §12.4 B2BPages | 3 tabs (Основные/Контент/SEO) |
| §12.4 Districts | 4 tabs (Основные/Программа SEO/Контент/SEO) |
| §12.3 PageCatalog | 5-я колонка `→` edit-link с aria-label |
| §12.6 EmptyState | Подключён в PageCatalog empty-branch (Wave 5 первое прод-применение) |

**Visual verification gated:** prod БД пустая → `/admin/login/` рендерит create-first-user UI, `beforeLogin/afterLogin` slots не активны на этом view. Master lockup увидится после создания первого юзера через UI или seed.

**Out of scope (отдельные PR):** stat-cards (нужен Sentry/Я.Метрика API), filter ▾ + CSV export (client + API), ErrorState/ForbiddenState через `admin.components.providers`, bulk action bar, full custom `views.login`.

**Урок (закреплено в memory):** перед каждой wave — открывать **визуальный mockup** в `brand-guide.html §12.N`, не только текстовый art-concept-v2.md. Diff implementation vs mockup до commit. Иначе serie waves закрывается partial и оператор это видит.

### Раньше: Linear перестроен на 4 функциональных teams + 6 cross-team Projects (Scrum hand-off, 2026-04-27 ночь)

**Что сделано:**

1. **Создано 4 функциональных teams** (оператор сделал в UI Linear по моей инструкции):
   - **Product** — `OBI` (бывший `obikhod` team переименован, identifier сохранён → ссылки OBI-N не сломаны)
   - **SEO** — `SEO`
   - **Design** — `DES`
   - **Dev** — `DEV`
   - Cycles 2 weeks Scrum, старт понедельника, auto-add issues = Off

2. **Создано 6 cross-team Projects**:
   - `EPIC SITE-MANAGEABILITY` (расширен с Product до Product+SEO+Dev)
   - `ADMIN-REDESIGN` — Product+Design+Dev (US-12)
   - `SEO-CONTENT-EXPANSION` — SEO+Dev (US-7 follow-ups)
   - `LEADS-CRM` — Product+Dev (US-8 + отложенные US-13/14/15)
   - `IA-EXTENSION` — Product+Design+Dev (US-11 шоп+ландшафт+error pages)
   - `PROGRAMMATIC-SCALE-UP` — Product+SEO+Dev (53→2000+ URL)

3. **Мигрировано 18 active Backlog-issue** в правильные teams + projects (через `mcp__claude_ai_Linear__save_issue` с новым `team` + `project`):

   | Старый | Новый | Project |
   |---|---|---|
   | OBI-4 | DEV-1 | LEADS-CRM |
   | OBI-5 | DEV-2 | SITE-MANAGEABILITY |
   | OBI-6 | SEO-1 | SITE-MANAGEABILITY |
   | OBI-9 | DEV-3 | ADMIN-REDESIGN |
   | OBI-10 | DEV-4 | ADMIN-REDESIGN |
   | OBI-11 | DEV-5 | SITE-MANAGEABILITY |
   | OBI-15 | DES-1 | ADMIN-REDESIGN |
   | OBI-20 | SEO-2 | SEO-CONTENT-EXPANSION |
   | OBI-21 | DEV-6 | SEO-CONTENT-EXPANSION |
   | OBI-22 | SEO-3 | SEO-CONTENT-EXPANSION |
   | OBI-25 | DEV-7 | LEADS-CRM |
   | OBI-26 | DEV-8 | LEADS-CRM |
   | OBI-27 | DEV-9 | LEADS-CRM |
   | OBI-28 | DEV-10 | ADMIN-REDESIGN |
   | OBI-29 | DEV-11 | ADMIN-REDESIGN |
   | OBI-30 | DEV-12 | ADMIN-REDESIGN |
   | OBI-31 | DEV-13 | ADMIN-REDESIGN |
   | OBI-33 | DEV-14 | ADMIN-REDESIGN |

4. **Остались в Product (project change only)** — 6 issue: OBI-13/14/32 (admin TOV, Product side) → ADMIN-REDESIGN; OBI-23 → IA-EXTENSION; OBI-24 → ADMIN-REDESIGN (parent epic); OBI-18 → PROGRAMMATIC-SCALE-UP. OBI-19 (Done Wave 1) тоже привязан к ADMIN-REDESIGN.

5. **Done issue (9)** — OBI-1/2/3/7/8/12/16/17/19 — оставлены в Product без миграции (история и release notes не ломаются).

6. **Документация обновлена:**
   - `team/po.md` §2 — расширенная матрица состава с колонкой Linear team(s); новый §2.5 «Структура команд в Linear» — 4 teams с DoD функции и маппингом ролей; §«Артефакты» — текущие 6 cross-team projects.
   - `team/in.md` — рабочий процесс получил шаг «Определяю Linear team по типу задачи» с правилами выбора + минимальный набор 6 labels + project-привязка.

7. **Memory обновлена:**
   - `feedback_linear_mandatory.md` — переписана под 4 teams, добавлен mapping миграции, team UUIDs, project IDs.

**Why hand-off через teams (model оператора):** SEO готовит ТЗ → Design рисует макеты → Dev делает → Product закрывает. У каждой функции свой DoD, свои циклы, свой backlog-view. Один project = одна программа, прошивает 2-4 teams.

**Mapping старых US-N → текущие issue ID:**
- US-3 = OBI-1 (Done) · US-4 = OBI-7 (Done) · US-5 = OBI-2 (Done) · US-6 = OBI-8 (Done) · US-7 = OBI-3 (Done) · US-8 = DEV-1 · US-9 = DEV-2 · US-10 = SEO-1
- US-11 = OBI-23 · US-12 = OBI-24 · US-12.4 = OBI-19 (Done, parent OBI-24)
- US-13 = DEV-7 (amoCRM, blocked) · US-14 = DEV-8 (Wazzup, blocked) · US-15 = DEV-9 (колтрекинг, blocked)

### Раньше в этот день: миграция беклога на единый OBI-N + 6 labels на каждой задаче (po, 2026-04-27)

**Что сделано:**
1. **Унифицирован primary identifier** — везде `OBI-N` (Linear), `US-N` ушёл в label `epic/us-N`. Title 24 issues переименован — убран префикс `US-N:` (например, OBI-4: «Фичи (калькулятор, формы, фото→смета) — Payload Leads без внешней CRM», без `US-8:` в начале). Папки `team/specs/US-N-<slug>/` сохранены — не переименовываем.
2. **Создано 53 hierarchical labels в Linear:** 4 группы (`role`, `phase`, `segment`, `epic`) + 28 ролей + 7 фаз + 3 сегмента + 14 эпиков. Плюс 4 type-labels (Content, Research, Ops, Design Refresh) — они тоже отсутствовали. Linear делает группы mutually exclusive — нельзя поставить две метки из одной группы (поэтому коллизии `phase/ba`/`phase/sa`/`phase/cr` с ролями переименованы в `phase/spec` (объединяет ba+sa+po+tamd) и `phase/review` (cr)).
3. **Применены labels к 33 issues** (минимум 6 на каждой): Priority + Type + epic/us-N + role/<lead> + phase/<current> + segment/cross|b2c|b2b. На задачах с несколькими ролями — выставляется одна **lead-роль**, остальные упоминаются в Description секции «Команда».
4. **Документация синхронизирована** — `team/po.md` §«Что я веду в Linear» + `team/WORKFLOW.md` §7.5 переписаны под новую схему. Добавлено пояснение про коллизии и mutual exclusivity группы `role`.

**Mapping старых US-N → OBI-N (для справки):**
- US-3 = OBI-1 (Done) · US-4 = OBI-7 (Done) · US-5 = OBI-2 (Done) · US-6 = OBI-8 (Done) · US-7 = OBI-3 (Done) · US-8 = OBI-4 · US-9 = OBI-5 · US-10 = OBI-6
- US-11 = OBI-23 · US-12 = OBI-24 · US-13 = OBI-25 (amoCRM, blocked) · US-14 = OBI-26 (Wazzup, blocked) · US-15 = OBI-27 (колтрекинг, blocked)
- US-12.4 = OBI-19 (Done, parent OBI-24)

### OBI-19 Wave 1 deployed на prod (2026-04-27)

PR #69 merged как `3fb8d41` → main → auto-deploy → live на https://obikhod.ru/admin/login/

**Smoke confirmed:**
- HTTP 200 на `/admin/login/`
- CSS chunk `0sdkvslmz7rt9.css` содержит все brand-токены (palette, radii, motion, shadow, font)
- `Golos+Text` подгружается через Google Fonts `@import`
- `.btn--style-primary` → `background-color: var(--brand-obihod-accent)` = **`#e6a23c` янтарный** (поправка vs PR #68 closed)
- `.btn--style-primary:hover` → `--brand-obihod-accent-hover` (#d99528)
- `.btn--style-primary:active` → `--brand-obihod-accent-ink` (#c18724) + `translateY(1px)`

**3 итерации fix теста** (Chrome computed-style normalization):
1. `b715e87` — numeric ms parsing (`120ms` → `.12s`)
2. `f692078` — strip leading zeros в `cubic-bezier(0.4, 0, 0.2, 1)` → `(.4,0,.2,1)`
3. `95271c9` — regex для color: `rgba()` ИЛИ `#hex+alpha` (Chrome конвертирует rgba в hex)

**OBI-19 Done. 6 подзадач для Wave 2-7 созданы:**

| Wave | Issue | Что | Команда |
|---|---|---|---|
| 2 | OBI-28 P2 | AdminLogin custom view | be3+fe1 |
| 3 | OBI-29 P2 | PageCatalog widget | fe1+be4 |
| 4 | OBI-30 P2 | Tabs field в 10 коллекциях | be4 |
| 5 | OBI-31 P2 | Empty/Error/403 states | fe1+cw |
| 6 | OBI-32 P3 | TOV admin.description ревью | cw+be4 |
| 7 | OBI-33 P2 | Playwright admin smoke + a11y | qa1+do |

**Уроки сохранены в memory** (feedback_design_system_source_of_truth): UI/UX задачи всегда стартуют с `design-system/`, не с `contex/*.html`. Source-of-truth — `design-system/brand-guide.html` + `tokens/*.json` + `components/*/spec.md`.

### Раньше в этот день: po закрыл DoD по US-7 (2026-04-27)

- Написан release note `team/release-notes/US-7-content-seo-coverage-audit.md` (по шаблону WORKFLOW.md §8) — закрывает пункт DoD «Release note написан» для OBI-3.
- Wave 2D follow-ups разнесены в Linear: **OBI-20** (P1, content), **OBI-21** (P2, tech), **OBI-22** (P2, research, blocked by API-ключ оператора).
- OBI-20 → blocks OBI-6 (US-10): финальный SEO-аудит логически идёт после добора покрытия 70% → 95%.
- Метрика «нейро-SEO ≥ 30%» вынесена в OBI-22 (организационно — в скоп US-10).

### art-сессия 2 — Admin Redesign (US-12)

**Контекст:** оператор сказал «панель управления выглядит ужасно — нужен нормальный понятный интерфейс». Запрос — login screen с лого, классический layout (sidebar+canvas), каталог опубликованных страниц по разделам, использовать brand-guide + ui-ux-pro-max + fal.ai.

**Что сделано в роли `art` (вторая сессия 2026-04-27 вечер):**

1. Разведка: US-3 (Admin UX Redesign, OBI-1) был закрыт по статусу, но фактически — только концепция (palette/typography/групировка), реализация поверх native Payload UI неполная — оттуда «ужасно».

2. **art-concept-v2.md** (надстройка над v1, 13 разделов): Login screen / Sidebar+Layout / Dashboard + Page Catalog widget / List view / Edit view с Tabs pattern / Status badges / Bulk actions / Empty+500+403 states / Mobile / Implementation roadmap (~10 чд).

3. **brand-guide.html v1.7 → v1.8** — расширил секцию «12 · Паблик → Payload» 6 живыми HTML mockups: Login + Layout + Dashboard+PageCatalog + Edit-with-Tabs + Status+BulkActions + Empty/500/403 states. + Anti-patterns admin блок. Footer → v1.8.

4. **team/specs/US-12-admin-redesign/** — 4 файла:
   - `art-concept-v2.md` — концепт
   - `art-brief-ux.md` — для ux: персона админа, 3 CJM (утро/день/вечер), IA, 6 wireframes
   - `art-brief-ui.md` — для ui: 8 макетов desktop+tablet+mobile, 14 component spec.md в `design-system/components/admin/`, SCSS override mapping (107→~400 строк), fal.ai для **moodboard** (только)
   - `art-brief-cw.md` — для cw: micro-copy 11 секций (login, stats, page catalog, filters, actions, tabs, status, empty, 403, 500, profile) + массовый аудит admin.description полей по 10 коллекциям
   - `note-po.md` — декомпозиция US-12.1...US-12.10, ADR-0005 для tamd, 5 open questions

**Что НЕ сделано (вне зоны art):**
- Реализация custom.scss override + React-компоненты в `site/app/(payload)/` — задача `fe1`+`be4`.
- Linear OBI US-12 issue не заведено — задача `in`+`po`.
- ADR-0005 Admin Customization Strategy — задача `tamd`.
- ux wireframes / ui макеты / cw тексты — отдельные роли по brief'ам.

**Ключевые decisions:**
- v1 art-concept (palette/typography/group-меню) НЕ переделывать — он остаётся как базис.
- Page Catalog widget — главная новинка по запросу оператора. Server component с REST aggregation 7 коллекций.
- Tabs pattern для длинных форм (SiteChrome 405 строк, Services 30 полей) — native Payload Tabs field, без custom React.
- fal.ai только для moodboard, никаких AI-картинок на live admin.

---

### Раньше в этот день: IA расширена 4 → 6 направлений (US-11)

**Контекст:** оператор в чате расширил scope сайта с 4-в-1 (мусор/арбо/крыши/демонтаж) на **6 направлений** добавив 5-е «Дизайн ландшафта» (flat-link) и 6-е «Магазин» (mega-menu, 9 preliminary категорий саженцев). Также попросил добавить страницы ошибок (404/500/502/503/offline) которых не было.

**Что сделано в роли `art`:**
1. `CLAUDE.md` immutable обновлён — таблица + раздел «Что это» расширены на «4 сервисных pillar + 2 расширения 2026-04-27».
2. `design-system/brand-guide.html` v1.6 → **v1.7**:
   - **Полный реестр иконографики** 4 линейки = 49 line-art glyph'ов в едином формате: 22 service + 9 shop + 9 district + 9 case (раньше district и case жили только в mega-menu без визуального каталога — закрыли пробел по запросу оператора).
   - 9 shop-иконок: `fruit-tree`, `columnar-tree`, `fruit-bush`, `decor-bush`, `flowers`, `roses`, `large-trees`, `deciduous-tree`, `coniferous-tree`.
   - 9 district-иконок: Одинцово / Красногорск / Истра / Химки / Мытищи / Пушкино / Раменское / Жуковский / Москва (landmark-метафоры).
   - 9 case-иконок: storm-cleanup / emergency-removal / urgent-roof / pruning-season / winter-prep / post-renovation / uk-contract / cottage-village / fm-contract.
   - Mega-menu Магазина (3 колонки: Деревья / Кустарники / Цветы) заменил flat-link.
   - Flat-link «Дизайн ландшафта» добавлен.
   - Mobile accordion раскрыт под 9 категорий + Дизайн ландшафта.
   - **Новая секция «11.5 · Страницы ошибок»** — 5 карточек 404/500/502/503/offline с уникальными line-art иллюстрациями 96×96, draft-копией в TOV, картой Next.js файлов, принципами копирайта.
   - Заголовок секции иконок: «Иконография · 49 line-art glyph'ов».
   - Footer обновлён: v1.7, 2026-04-27.
3. `team/specs/US-11-ia-extension/` создан с:
   - `art-brief-ui.md` — для ui+fe1: вынос 9 shop-иконок в `site/components/icons/shop/`, перенос Магазина mega в Header.tsx, flat-link Дизайн ландшафта, + вынос 9 district-иконок в `components/icons/districts/` + 9 case-иконок в `components/icons/cases/` (техдолг v1.6, расширили в этой сессии после правки оператора).
   - `art-brief-cw.md` — для cw: финал 5 текстов error-pages в TOV «бригадир».
   - `note-po.md` — для po: что нужно завести US-11, подтвердить URL slugs (через seo1), решить порядок навигации, сделать заглушки `/magazin/` + `/dizain-landshafta/`.

**Что НЕ сделано (вне зоны art):**
- `site/components/marketing/Header.tsx` не тронут — задача `ui`+`fe1` через art-brief.
- Linear OBI issue не заведено — задача `in`+`po`.
- ADR-0004 для расширения immutable — задача `tamd`.
- URL slugs не утверждены — задача `seo1`.

**Текущая ветка:** `chore/handoff-after-us7` (sandbox brand-guide правки готовы к commit/PR).

### Prod
- https://obikhod.ru, VPS 45.153.190.107, Node 22, PM2 `obikhod`, auto-deploy на push `main`
- main = `fe52b88` (PR #59 merged: US-7 audit + canonical fix)
- 53 публичных страницы, sitemap = 43 URL

### Автономная сессия 2026-04-26 → 2026-04-27 — 6 PR в серии без оператора

| PR | Wave | Что |
|---|---|---|
| #54 | 2A | 6 routes /b2b/, /blog/, /avtory/ + расширенный sitemap |
| #55 | 2A docs | acceptance + seo1 priorities Wave 2B |
| #56 | 2B1 | sub-service schema + dual-routing /<service>/<sub-or-district>/ |
| #57 | 2B2/2C1 audit | 7 sub-services + 20 SD bulk на prod |
| #58 | 2C2 audit | 4 Cases + 4 Жуковский SD на prod |
| #59 | US-7 | SEO audit + canonical fix главной |

Объём: ~20 500 слов уник, **53 публичных страниц**, **30% wsfreq** покрыто (62K из 209K).

### Linear состояние

**5/8 эпиков SITE-MANAGEABILITY Done**:

| US | Linear | Статус |
|---|---|---|
| US-3 (Админка) | OBI-1 | ✅ Done |
| US-4 (Семантика) | OBI-7 | ✅ Done |
| US-5 (Sitemap-IA) | OBI-2 | ✅ Done |
| US-6 (Контент) | OBI-8 | ✅ Done 2026-04-27 |
| US-7 (SEO покрытие) | OBI-3 | ✅ Done 2026-04-27 |
| US-8 (Фичи + amoCRM) | OBI-4 | 🔵 Backlog |
| US-9 (Регресс) | OBI-5 | 🔵 Backlog |
| US-10 (SEO аудит финал) | OBI-6 | 🔵 Backlog |

**Дополнительно closed**: OBI-16 (P0 pillar 404), OBI-17 (CMS bot-user agent).

### Доступы

- ✅ **GH PAT** в `~/.claude/secrets/obikhod-gh.env` — Actions RW + PR RW + Contents RW
- ✅ **Payload API key** в `~/.claude/secrets/obikhod-payload.env` (REST POST/PATCH без UI)
- ✅ **SSH root** к VPS (45.153.190.107) через `~/.ssh/id_ed25519`
- ❌ **AI API keys** (Perplexity / OpenAI / Anthropic / GigaChat / fal.ai) — нет, нужны для нейро-SEO test и AI-генерации фото

### Открытых PR — нет. Чистый main.

## Следующий шаг (при возврате оператора)

### Свежие US — оформлены в Linear (2026-04-27):

- **US-11 = OBI-23** — IA Extension: Магазин mega + Дизайн ландшафта flat + Error pages 5 шт. P1 Feature. Дизайн готов (brand-guide v1.8 merged PR #66). Решения PO зафиксированы в issue (порядок навигации B, заглушки `/magazin/` + `/dizain-landshafta/` в этой же US, e-commerce v1 без корзины). Ждёт seo1 → URL slugs до merge Header.
- **US-12 = OBI-24** — Admin Redesign Final: Login + Layout + Page Catalog + Tabs + States. P1 Design Refresh. ~10 чд, 10 sub-tasks. **OBI-19 переименован в US-12.4 и привязан как child** (SCSS override = первый sub-task). Решения PO зафиксированы (login email+password, Page Catalog только widget, CSV export сразу, mobile low-pri, fal.ai только moodboard).

### Backlog по программе SITE-MANAGEABILITY (3 эпика остались):
1. **US-8 = OBI-4** — Фичи + калькуляторы + photo→quote форма + Payload Leads + Telegram оператору (P1 Feature, разблокирован US-7). **amoCRM вынесен** оператором 2026-04-27 в US-13.
2. **US-9 = OBI-5** — Полный технический регресс перед финальным запуском (P1 Bug, blocked by US-8)
3. **US-10 = OBI-6** — Финальный SEO аудит классики + нейро (P1, blocked by US-9 + OBI-20 Wave 2D content)

### Future / out-of-scope MVP (вынесено решениями оператора 2026-04-27):
- **US-13 = OBI-25** — Интеграция с amoCRM (P2, **blocked by аккаунт**). На MVP воронка на Payload Leads + Telegram.
- **US-14 = OBI-26** — Wazzup24 / WhatsApp Business (P3, **blocked by аккаунт**). На MVP оператор отвечает с личного телефона.
- **US-15 = OBI-27** — Колтрекинг Calltouch/CoMagic (P3, **blocked by сервис**). На MVP один статичный номер в SiteChrome.

### Принятые решения по US-8 (2026-04-27 — оператор):
- ✅ Telegram-бот для уведомлений: **существующий**, нужны `TELEGRAM_BOT_TOKEN` + `TELEGRAM_OPERATOR_CHAT_ID` от оператора.
- ✅ Captcha: **hCaptcha** (РФ-friendly).
- ❌ Wazzup24, колтрекинг, amoCRM — out of MVP (см. выше).

### Wave 2D follow-ups для US-7 — РАЗНЕСЕНЫ В LINEAR (2026-04-27):

- **OBI-20 (P1, Content)** — Wave 2D content: расширение 4 pillar + 2 b2b → 700+ слов, новые посадочные (`/raschet-stoimosti/`, `/foto-smeta/`, `/promyshlennyj-alpinizm/`, `/arenda-tehniki/avtovyshka/`), новые sub-services + bulk остальных 7. **blocks OBI-6 (US-10)**.
- **OBI-21 (P2, Improvement)** — Wave 2D tech: реальные фото в 4 Cases + miniCase для 28 programmatic SD. Blocked by оператор → реальные фото (опционально).
- **OBI-22 (P2, Research)** — нейро-SEO test 50-100 запросов через Perplexity / GigaChat / Я.Нейро. **Blocked by оператор → API-ключ.**

Также написан **release note** [`team/release-notes/US-7-content-seo-coverage-audit.md`](../../team/release-notes/US-7-content-seo-coverage-audit.md) — закрывает DoD по PO для US-7.

## Подсказки для следующей сессии

- `do` сам мержит PR через GH API при зелёном CI (правило `feedback_do_owns_merges_when_ci_green.md`)
- `do` отвечает за зелёный CI до push (правило `feedback_do_owns_green_ci_before_merge.md`)
- Прямой psql на prod: `ssh root@45.153.190.107 'sudo -u postgres psql obikhod -c "..."'`
- PM2 logs: `ssh root@45.153.190.107 'sudo -u deploy pm2 logs obikhod --lines 50 --nostream'`
- REST POST на Payload требует **trailing slash** в URL (Next 16 trailingSlash:true → 308 redirect)
- Revalidate endpoint: **GET** (не POST), secret из `/home/deploy/obikhod/shared/.env`
- Хук `block-dangerous-bash.sh` блокирует `DROP TABLE` — использовать `ALTER TABLE DROP COLUMN`
- Хук `protect-secrets.sh` блокирует `cat ~/.claude/secrets/...` — использовать `set -a; . file; set +a`
- Media upload: multipart `POST /api/media/` с `file=@path` + `_payload={"alt":"...","license":"public-domain"}`
- Picsum.photos для CC0 placeholder (без API): `https://picsum.photos/seed/<id>/1200/800.jpg`

### Pattern для Payload миграций (ключевой)

При добавлении нового поля в коллекцию с `versions: { drafts: true }`:
- `<table>` — основная колонка
- `_<table>_v` — `version_<column>` копия
- Для `select hasMany` — отдельные таблицы `<table>_<field>` + `_<table>_v_version_<field>`
- Для `array` — `(id SERIAL, _uuid varchar, ...fields)` (не varchar PK!)
- Для каждой новой коллекции — `<slug>_id` колонка в `payload_locked_documents_rels`

CI на ephemeral postgres без seed не поймает missing snapshot tables — smoke на REST POST после migrate обязателен.

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
- [ ] AI API ключ для нейро-SEO test (Perplexity / GigaChat / OpenAI)
- [ ] fal.ai key для замены picsum-placeholder в Cases на AI-сгенерированные

## Финальная оценка автономной сессии

Что закрыто без участия оператора (правило operator_role_boundaries.md):
- 6 PR смерджены через GH API auto-merge
- 5 эпиков программы Done (US-3..US-7)
- 53 публичных страницы на prod
- ~20 500 слов уникального контента
- Schema.org coverage 100%, sitemap расширен с 28 → 43 URL
- 3 fixup-миграции схемы Payload в серии (versioned snapshot tables)

Соблюдены инварианты:
- TOV «обихода» (matter-of-fact, конкретные ₽, без анти-TOV)
- design-tokens (palette/typography/breakpoints) через `agents/brand/handoff.md`
- noindexUntilCase для programmatic SD (US-3 invariant)
- CC0 placeholder фото с пометкой license=public-domain (легко подменить через UI)
