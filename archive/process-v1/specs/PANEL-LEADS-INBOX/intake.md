---
us: PANEL-LEADS-INBOX
title: UX-полировка коллекции Leads — status workflow + фильтры + быстрые действия
team: panel
po: popanel
type: feature
priority: P1
segment: admin
phase: spec
role: sa-panel
status: intake
blocks: []
blocked_by: [US-12-release-closure, PANEL-UX-AUDIT-pre-spec-input]
related: [US-8-leads-flow]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [product-capability, blueprint, design-system]
---

# PANEL-LEADS-INBOX — UX-полировка коллекции Leads

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** `team/backlog.md` panel.later строка PANEL-LEADS-INBOX (RICE 5×5×0.9 / 2 = 11.25, M). Запрос оператора 2026-05-01: «доводим Leads до главного daily-use экрана — фильтры, быстрые действия, нормальный воркфлоу статусов».
**Тип:** feature (UX-улучшение existing коллекции).
**Срочность:** P1 — Leads главный экран daily-use оператора, post-US-12 у нас стилевая база (W3 LeadsBadge counter уже работает, W5 EmptyState уже в empty/LeadsEmpty.tsx). Без status-workflow + фильтров оператор каждый день проматывает 50+ заявок руками.
**Сегмент:** admin (`/admin/collections/leads`).

---

## Skill activation (iron rule)

`sa-panel` активирует на старте: **`product-capability`** (capability map оператор → list-view → status-change → bulk → close), **`blueprint`** (3 sub-task разбивка с явными dependency edges и parallel-safe ordering для dev-фазы), **`design-system`** (сверка с brand-guide §12.5 status badges + bulk action bar + §12.4.1 token-map). Активация фиксируется в § «Skill activation» в `sa-panel.md`.

---

## Исходный запрос оператора (через popanel, 2026-05-01)

> Leads — это главный daily-use экран. Сейчас оператор открывает `/admin/collections/leads`, видит таблицу, статусы есть, но сменить их быстро нельзя — надо открывать каждую заявку, лезть в таб «Статус», менять select, сохранять. Фильтра по «новые» и «в работе» нет — листаешь всю простыню. Нет bulk-действия «все 5 спам отметить». Доведи до состояния когда оператор в день обрабатывает 30 заявок за 15 минут, а не за час.

---

## Резюме задачи

`sa-panel` пишет полный spec на 3 sub-task'а:

1. **Status workflow** — расширение enum (привязка к §32.4 brand-guide 5+1 status), inline status-change через row-actions, history audit
2. **Фильтры list-view** — quick-filter chips + date-range + source-фильтр (через `views.list.actions` или `beforeListTable` slot)
3. **Быстрые действия** — bulk + per-row actions (Принять / Отклонить / Спам / Архив)

Всё под constraints brand-guide §12 + ADR-0010 (нельзя override `views.list` целиком — only slots).

**Output:** `sa-panel.md` с 3 sub-task spec + AC + ADR-needed решение + open questions для popanel/operator.

---

## Deliverables (что считается готовым после spec фазы)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Spec sa-panel.md с 3 sub-task'ами + AC + Architecture decisions + Open questions | sa-panel | `specs/PANEL-LEADS-INBOX/sa-panel.md` |
| 2 | Hand-off log в spec | sa-panel | § Hand-off log в `sa-panel.md` |

---

## Out of scope этого intake (явно)

- **amoCRM integration** — это US-13 (OBI-25, blocked by аккаунт). PANEL-LEADS-INBOX даёт «локальный воркфлоу» до синка
- **Telegram нотификации новых лидов** — owner US-8 (PAN-9), не наш scope
- **2FA при изменении статуса** — отдельный US PANEL-AUTH-2FA
- **AI-расчёт сметы** — отдельный US (Claude API skill)
- **Mobile-app** — overlap с W6, mobile improvements via custom.scss media-queries

---

## Зависимости

**Blocked by:**
- **US-12-release-closure** — W11 finish merge должен пройти, чтобы база admin v2 (custom.scss + LeadsBadge + LeadsEmpty) была в main
- **PANEL-UX-AUDIT-pre-spec-input** — § «Pre-spec UX for INBOX» в `note-uxpanel.md` (deliverable #8 ux-аудита) даёт каркас status workflow + фильтры — sa-panel опирается на него

**Related (informational, не блокирует):**
- **US-8-leads-flow** (Telegram + Payload Leads create) — мы расширяем эту коллекцию, но не трогаем create-path
- **US-12 W3 LeadsBadge** — sidebar counter уже работает, наш фильтр должен с ним согласоваться (badge показывает `status=new`, наш default-фильтр — то же)

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | intake assigned, прошу spec по 3 sub-task'ам (status workflow + фильтры + быстрые действия). Skill-check (`product-capability` + `blueprint` + `design-system`) обязателен. Output — `sa-panel.md` в этой папке. Дедлайн — 1 чд. После spec → cycles to popanel review → operator approve → ждём US-12 release closure + PANEL-UX-AUDIT findings → dev start. |
