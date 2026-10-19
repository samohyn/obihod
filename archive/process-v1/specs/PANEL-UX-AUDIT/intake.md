---
us: PANEL-UX-AUDIT
title: UX audit /admin — usability sweep + 3 точечных проверки
team: panel
po: popanel
type: research
priority: P1
segment: admin
phase: discovery
role: ux-panel
status: intake
blocks: [PANEL-HEADER-CHROME-POLISH, PANEL-LEADS-INBOX]
blocked_by: []
related: [US-12-admin-redesign, PANEL-FAVICON-BRAND]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [ui-ux-pro-max, accessibility, design-system, product-lens]
---

# PANEL-UX-AUDIT — UX audit /admin (post-US-12)

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** запрос оператора (2026-05-01) — параллельно с закрытием US-12 + 3 точечных нареканий по скриншотам
**Тип:** research / discovery / usability audit
**Срочность:** P1 — блокирует PANEL-HEADER-CHROME-POLISH spec и feed-ит UX-вводные в PANEL-LEADS-INBOX
**Сегмент:** admin (panel-сетка целиком)

---

## Skill activation (iron rule)

`ux-panel` активирует на старте: **`ui-ux-pro-max`** (UX guidelines + heuristics), **`accessibility`** (WCAG 2.2 AA — оператор использует ежедневно, длительные сессии), **`design-system`** (сверка всех экранов с brand-guide §12), **`product-lens`** (как часто оператор сталкивается / какая боль / как замерим). Активацию фиксирует в `note-uxpanel.md` строкой `Skills: <list>`.

---

## Исходный запрос оператора (2026-05-01)

> подключи к задаче ux (для лучшего опыта использования панели) пусть все изучит тоже проверит удобно ли этим пользоваться

Плюс 3 точечных нареканий по скриншотам:

1. **Favicon** — сейчас «чёрный круг с белым треугольником» (дефолтный Next.js). Не бренд. Проверить на ВСЕХ страницах сайта. → вынесено в отдельный US **PANEL-FAVICON-BRAND**, не scope этого audit.
2. **Кнопка переключения тёмной темы** — добавить в `/admin`, пока без логики (позже привяжем).
3. **Иконка «О» в breadcrumbs** (красный прямоугольник на скрине) — выглядит кривовато. Проверить не съехала ли.
4. **Иконка домика** — добавить в panel header (где красная стрелочка на скрине), возвращает на главную страницу сайта.

---

## Резюме задачи

`ux-panel` проходит ВСЁ `/admin` (login → dashboard → каждая из 7 коллекций → list-view → edit-view → mobile drawer @ 375px) и пишет usability findings — что мешает оператору в daily-use. **Это не «дизайн с нуля»**, это аудит post-US-12 с фокусом на gap'ы между brand-guide §12 и реальным prod после 11 Wave merge.

**Параллельно** — детальный отчёт по 3 точечным точкам оператора (см. ниже § Deliverables).

**Output:** `note-uxpanel.md` с findings, ранжированными по severity (P0/P1/P2). По итогам PO решает какие пойдут в PANEL-HEADER-CHROME-POLISH spec, какие — в новый US, какие — backlog.later.

---

## Deliverables (что считается готовым)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Usability findings по 7 коллекциям (Заявки, Услуги, Районы, Услуги×районы, Кейсы, Блог, Авторы, B2B-страницы, Команда, Медиа, Редиректы, SEO Settings, Users, Site Chrome) — по каждой: P0/P1/P2 список с screenshot evidence | ux-panel | `specs/PANEL-UX-AUDIT/note-uxpanel.md` § «Findings per collection» |
| 2 | Anchor-аудит §12 brand-guide vs prod admin | ux-panel | в том же файле § «Brand-guide §12 mapping» |
| 3 | a11y-аудит WCAG 2.2 AA (контраст / focus-visible / reduced-motion / keyboard-nav / aria-labels) — на основе W7 axe-core baseline | ux-panel | в том же файле § «a11y findings» |
| 4 | Mobile audit @ 375px / 768px / 1024px — drawer, list-view h-scroll, tabs, форма edit | ux-panel | в том же файле § «Mobile findings» |
| 5 | **Breadcrumb «О» alignment** — детальный probe (DOM inspect + screenshot zoom). Источник проблемы: BrandIcon SVG / round container / typography baseline / margin? | ux-panel | в том же файле § «Operator-pin-1: breadcrumb-O» |
| 6 | **Home-icon spot recommendation** — где в top-bar разместить иконку домика → `obikhod.ru/`. Кандидаты: (a) рядом с collapse `<` в верху сайдбара (где красная стрелочка), (b) в top-bar справа от breadcrumbs, (c) в user-menu dropdown. PO ждёт **A/B/C-рекомендацию** с ux-обоснованием. | ux-panel | в том же файле § «Operator-pin-2: home-icon» |
| 7 | **Dark-theme toggle placement recommendation** — где разместить кнопку переключения темы (UI-only stub, без логики). Кандидаты: (a) user-menu dropdown (классика — Discord/Slack/GitHub), (b) top-bar отдельная кнопка, (c) в settings `/admin/users/<self>/preferences` (требует backend). PO ждёт **A/B/C-рекомендацию**. | ux-panel | в том же файле § «Operator-pin-3: dark-toggle» |
| 8 | UX recommendations для PANEL-LEADS-INBOX (заранее, чтобы sa-panel мог писать spec параллельно) — каркас status workflow, фильтры, быстрые действия | ux-panel | в том же файле § «Pre-spec UX for INBOX» |
| 9 | Hand-off log: ux-panel → popanel с findings ranked + А/В/С-рекомендациями по пинам оператора | ux-panel | § Hand-off log этого файла |

---

## Ключевые вопросы, на которые audit даёт ответы

1. **Какие коллекции наиболее перегружены/недоустроены для daily-use оператора?**
   Reach×Impact-приоритизация для следующих panel.later задач.
2. **§12 brand-guide compliance — есть ли gap'ы post-W9?**
   Особое внимание: §12.1 Login (post-W2.A v2), §12.2 Sidebar (post-W8/W9 icons), §12.3 Link states, §12.4 Interaction states, §12.4.1 Token-map. На каких экранах prod расходится с §12?
3. **a11y baseline после W7** — ковры выявили только то что axe-core может. Manual-аудит: keyboard-only navigation full path, screen-reader VoiceOver smoke на 1-2 коллекциях.
4. **Mobile readiness post-W6** — реально ли оператор может работать с телефона? Какие коллекции/действия не покрыты?
5. **3 пина оператора** — детальный probe + А/В/С-рекомендация для каждого.

---

## Состав команды и расчёт нагрузки

| Роль | Задача | Чд |
|---|---|---|
| `ux-panel` | Полный audit /admin + 3 пина оператора + a11y manual + mobile + pre-spec INBOX | 0.5 |
| **Cross-team consult** |||
| `art` | Если ux-panel найдёт gap в §12 brand-guide (новые компоненты / новые токены) — поднимаю через `cpo` | 0 (вне scope этого audit) |
| **Итого** | | **~0.5 чд** |

**Timeline:** 1 рабочий день. По итогам — split-decisions PO в backlog.next.

---

## Open questions to operator

(Нет открытых вопросов на старте audit — все 4 запроса оператора понятны. Если ux-panel найдёт спорные точки — поднимет через `cpo` или попросит operator-input через popanel.)

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | ux-panel | intake.md готов. Прошу: usability sweep всего /admin + детальный probe 3 пинов оператора + pre-spec UX для INBOX. Output — `note-uxpanel.md` в этой папке. Дедлайн — 1 чд. Skill-check (`ui-ux-pro-max` + `accessibility` + `design-system` + `product-lens`) + фиксация в note-uxpanel.md обязательна. |
