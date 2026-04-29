---
role: popanel
date: 2026-04-28
session: us-12 epic launch
---

# Записка popanel — US-12 Admin Redesign запущен

## Skill активация (iron rule)

Активирован `blueprint` skill для US-12 (multi-session, multi-agent, ~9 человеко-дней, 7 sub-issues). Зафиксировано через Skill tool в session `cea01ef6-921b-43b8-8a27-d3bf1b7fa979`.

**Почему blueprint:** US-12 — это крупный multi-session, multi-agent epic (~9 чд, 7 ролей команды panel + 4 cross-team consult). Blueprint обеспечивает:
- Cold-start execution каждого Wave (sa-panel.md + AC + verification commands)
- Dependency-aware ordering (Wave 2 blocked by ADR-0005)
- Parallel-step detection (Waves 3, 4, 5 параллельны)
- Plan mutation protocol (split/insert/skip/reorder)

## Что закрыто в этой сессии

### 1. Подтверждение мандата от оператора

Оператор повторно подтвердил 2026-04-28: текущий live `/admin` полностью переделывается под `design-system/brand-guide.html` §12. Сохранено в memory `project_us12_admin_redesign_mandate.md`.

### 2. Открытые вопросы от art закрыты

5 вопросов из [art-concept-v2.md §11](./art-concept-v2.md) → закрыто оператором:

| # | Вопрос | Решение оператора | Влияние на scope |
|---|---|---|---|
| 1 | Login auth | ~~**Magic link через Telegram**~~ → **email+password (Wave 2.A only)**, magic link **drop** 2026-04-29 (см. секцию «Decision log» ниже) | Wave 2.B cancelled, PAN-9/PAN-10 уходят в US-8 |
| 2 | PageCatalog | **Отдельная страница `/admin/catalog` + widget на dashboard** | Wave 3: full-page route + top-6 widget |
| 3 | CSV export | **Сразу в этой US** | Wave 3 включает `/api/admin/page-catalog.csv` |
| 4 | Profile dropdown | **Минимум `Мой профиль` + `Выйти`** | без расширений |
| 5 | Leads badge counter | **В этой US** (~0.3 чд) | Wave 3 включает sidebar polling 30s |

### 3. Linear epic + 7 sub-issues созданы

**Epic:** [PAN-1 US-12 Admin Redesign](https://linear.app/samohyn/issue/PAN-1) — labels `popanel`, `Feature`, `P1`, `Design System`, `intake`. Branch — `panel/integration`.

**Sub-issues (parent PAN-1):**

| ID | Wave | Что | Owner | Объём | Зависимости |
|---|---|---|---|---|---|
| [PAN-2](https://linear.app/samohyn/issue/PAN-2) | 0 | ADR-0005 Admin Customization Strategy | tamd | 0.5 чд | none |
| [PAN-5](https://linear.app/samohyn/issue/PAN-5) | 2 | AdminLogin magic link через Telegram | be-panel + fe-panel | 2 чд | blocked by PAN-2 |
| [PAN-6](https://linear.app/samohyn/issue/PAN-6) | 3 | PageCatalog page + widget + CSV + Leads badge | be-panel + fe-panel | 1.5 чд | none (parallel) |
| [PAN-3](https://linear.app/samohyn/issue/PAN-3) | 4 | Tabs field в 10 коллекциях | be-panel + cw | 1.5 чд | none (parallel) |
| [PAN-4](https://linear.app/samohyn/issue/PAN-4) | 5 | Empty/Error/Skeleton финал | fe-panel | 1 чд | none (parallel) |
| [PAN-7](https://linear.app/samohyn/issue/PAN-7) | 6 | Mobile admin responsive | fe-panel + ux-panel | 1.5 чд | Waves 2-5 done |
| [PAN-8](https://linear.app/samohyn/issue/PAN-8) | 7 | Polish + a11y + Playwright admin smoke | qa-panel + cr-panel | 1 чд | Waves 2-6 done |

**Итого:** 9 человеко-дней, ~2 недели календарно при параллелизации.

### 4. Параллельный режим с US-8 утверждён

Команда panel изолирована от product (`panel/integration` vs `product/integration`, разные части кодбазы — `app/(payload)/**` + `components/admin/**` vs прочие). Конфликты в коде исключены. SITE-MANAGEABILITY iron rule (sequential) на cross-team границу не распространяется.

## Roadmap выполнения

### Phase A · Spec-before-code gate (parallel, ~2-3 дня)

**Запускаются параллельно:**
- `tamd` пишет ADR-0005 (PAN-2) — 0.5 чд
- `sa-panel` пишет sa-panel-wave3.md (PAN-6 PageCatalog) — 0.5 чд
- `sa-panel` пишет sa-panel-wave4.md (PAN-3 Tabs) — 0.5 чд
- `sa-panel` пишет sa-panel-wave5.md (PAN-4 Empty/Error) — 0.5 чд
- `cw` собирает tabs labels + admin.description audit для Wave 4 — 0.3 чд

**Я (popanel):** approve каждый sa-panel-wave-N.md, затем меняю Linear label `phase:spec` → `phase:dev`.

### Phase B · Dev parallel (~5 дней)

**Параллельные потоки:**
- be-panel + fe-panel: Wave 2 (AdminLogin) — стартует после PAN-2 ADR done
- be-panel: Wave 3 (PageCatalog REST) — параллельно
- be-panel: Wave 4 (Tabs schema) — параллельно
- fe-panel: Wave 3 (PageCatalog UI) — параллельно
- fe-panel: Wave 5 (Empty/Error) — параллельно

После dev каждого Wave: `cr-panel` review → `qa-panel` test → merge в `panel/integration`.

### Phase C · Mobile + Polish (~2 дня)

- Wave 6 (Mobile) — после Waves 2-5 в `panel/integration`
- Wave 7 (Polish + Playwright) — после Wave 6

### Phase D · Release (~0.5 дня)

- `release-mgr` собирает RC-N.md (PAN-1 epic complete)
- `leadqa` verify локально → leadqa-N.md
- Оператор approve
- `do` deploy panel/integration → main

## Что я держу как gate (popanel iron rules)

1. **spec-before-code:** ни один Wave не идёт в dev без approved sa-panel-wave-N.md.
2. **brand-guide §12 = single source of truth:** правки UI только через `design-system/brand-guide.html` (урок PR #68 — никаких `contex/*.html`).
3. **a11y WCAG 2.2 AA + reduced-motion:** обязательно во всех Waves (admin = ежедневный tool оператора).
4. **payload schema owner:** все правки коллекций (Wave 4 tabs, Wave 2 MagicLinkTokens) — через be-panel + dba; product/shop читают через Local API без правок схем.
5. **token-map compliance:** primary янтарный `#e6a23c`, focus brand-зелёный `#2d5a3d`, sidebar active 3px accent left-border. Playwright `admin-design-compliance.spec.ts` гард.

## Что нужно от других PO

- **podev (US-8):** статус Telegram-бота (есть ли connect к оператору). Если ещё не — Wave 2 magic link blocked.
- **cpo:** approval разделения капасити `team panel` под US-12 параллельно с US-8 в product team.
- **art:** validation final implementation после Phase B каждого Wave (визуал ревью vs §12 mockup).

## Open risks

- **Wave 4 (Tabs in 10 collections)** — затрагивает Payload schema. Минор регрессия может сломать существующие edit-views. Mitigation: ADR-0005 описывает SCSS-specificity strategy (`:where()`), e2e admin smoke перед merge.
- **Wave 2 (Magic link)** — security-sensitive (token brute-force, replay). Mitigation: brute-force protection 5/IP/hour, TTL 10 мин, single-use.
- **Mobile admin (Wave 6)** — Payload native mobile поддержка ограничена. Может потребоваться custom view для list/edit на ≤640px вместо CSS-only. Принимать решение в sa-panel-wave6.md.

## Файлы

```
specs/US-12-admin-redesign/
├── art-concept-v2.md           # 13 разделов, источник scope
├── art-brief-ui.md             # для ui+spec.md
├── art-brief-ux.md             # для ux+wireframes
├── art-brief-cw.md             # для cw+admin.description audit
├── note-po.md                  # записка от art (старый PO)
└── note-popanel.md             # этот файл — записка popanel после v2 рестракта
```

**TODO для следующей сессии (popanel):**
1. Запустить `tamd` на ADR-0005 (PAN-2)
2. Запустить `sa-panel` на спеки Wave 2/3/4/5 параллельно
3. Координация с `podev` по Telegram-боту (US-8 статус)
4. Создать Linear sub-issue для US-12.0 — финальный polish текущей ветки `fix/admin-stat-cards-12-3` (Wave 1 polish, не из roadmap, но висит)

---

## Decision log 2026-04-29

### D-2026-04-29-01 · Drop Wave 2.B (Magic link)

**Контекст:** оператор задал в сессии: «а зачем нам magic link в итоге?». popanel дал честный разбор за/против, рекомендация — drop. Оператор подтвердил.

**Что меняется:**
- `sa-panel-wave2b.md` → `status: cancelled` (спека сохранена как архив).
- US-12 auth-scope = только Wave 2.A (email+password Login UI поверх native Payload).
- **PAN-9** (Telegram bot) → ownership переходит в **US-8** (lead notifications, podev).
- **PAN-10** (SMTP) → ownership переходит в **US-8** (email формы заявок) либо «общая инфраструктура» под `do`.
- **PAN-11** (Wave 2.B) → closed wont-do.

**Почему drop:**
1. Wave 2.A полностью закрывает UX-боль «admin выглядит ужасно» — auth-механика без password не часть «admin redesign».
2. 2 ЧД + два блокера + новая collection + custom auth strategy + token в URL — слишком дорого для одного оператора-пользователя.
3. Реальная защита от credential phishing — TOTP 2FA (1 ЧД, одна коллекция), а не magic link через Telegram.
4. Telegram bot нужен под US-8, привязка к admin auth = coupling двух разных feature-lanes.

**Karpathy #2 (простота прежде всего):** меньше surface = меньше регрессий + быстрее релиз US-12.

**Что добавлено в panel-беклог как замена:**
- `PANEL-AUTH-2FA` — TOTP 2FA коллекция + endpoint setup (опционально, не блокер US-12 release). RICE = 4 / 3 / 4 / 1, Should-have.

### Скоуп US-12 после drop

| Wave | Что | Статус | Owner | Объём |
|---|---|---|---|---|
| 0 | ADR-0005 | в работе у tamd | tamd | 0.5 чд |
| 1 | custom.scss admin design refresh | **Done** | (Wave 1 closed) | — |
| 2.A | Login UI (email+password) | **dev-ready**, sa-panel approved | be-panel + fe-panel | 1 чд (down from 2) |
| ~~2.B~~ | ~~Magic link~~ | **cancelled 2026-04-29** | — | — |
| 3 | PageCatalog page + widget + CSV + Leads badge | sa-panel approved | be-panel + fe-panel | 1.5 чд |
| 4 | Tabs field в 10 коллекциях | sa-panel approved (pending cw + be-panel audit) | be-panel + cw | 1.5 чд |
| 5 | EmptyState/ErrorState/SkeletonTable финал | sa-panel approved (pending cw) | fe-panel | 1 чд |
| 6 | Mobile admin responsive | спека не написана | fe-panel + ux-panel | 1.5 чд |
| 7 | Polish + a11y + Playwright | спека не написана | qa-panel + cr-panel | 1 чд |

**Итого после drop:** 8 человеко-дней (было 9), снято 2 блокера (PAN-9, PAN-10).

---

## Decision log 2026-04-30

### D-2026-04-30-01 · W3 PageCatalog hand-off в dev (popanel iron-rule «следуем твоим рекомендациям»)

**Контекст:** оператор задал «можем ли дальше по panel?» после merge PR #99 (seed-admin + ADR-0009 shim). popanel предложил W0 ADR-0005 (tamd) + W3 PageCatalog (be-panel + fe-panel) параллельно. Оператор: «следуем твоим рекомендациям».

**Открытие при разведке:** `team/adr/ADR-0005-admin-customization-strategy.md` уже **Accepted 2026-04-28** (partially superseded by ADR-0007 для Login UI mechanism — это касается только W2.A, не W3). Backlog показывал устаревший статус «в работе у tamd». То есть W0 фактически закрыт.

**Что сделано в этой сессии (popanel coordination only, не code):**

1. **`team/backlog.md` обновлён:**
   - W0 ADR-0005 → перенесён в Done (2026-04-28 Accepted, partially superseded by ADR-0007).
   - W3 → status `now`, hand-off `popanel → be-panel + fe-panel`, ветка `feature/us-12-w3-page-catalog` от main.
   - W2.A → status `unblocked` (был blocked by W0 + seed-admin, оба сняты), ждёт go от оператора.
   - PANEL-DEV-SEED-ADMIN → перенесён в Done (PR #99 MERGED 2026-04-29).
   - Branch convention в шапке: «feature-ветки от main по pattern PR #99» (вместо мифической `panel/integration` — её физически нет в origin, проверено `git branch -a`).

2. **`sa-panel-wave3.md` Hand-off log дополнен:**
   - 2026-04-30 entry popanel → be-panel + fe-panel с iron-rules + DoD + skill-check (`frontend-patterns` + `nextjs-turbopack` для fe-panel; `backend-patterns` + `api-design` для be-panel) + указанием ADR-0005 уровней + branch + PR target main.

3. **W3 spec уже approved popanel 2026-04-28 (Q1-Q4 закрыты)** — gate spec-before-code пройден, dev может стартовать.

**Открытый вопрос для оператора (отдан в чат):** добавлять ли W2.A Login UI параллельно с W3 (теперь, когда W2.A разблокирован), или сначала закрыть W3 → потом W2.A → потом W4/W5? Trade-off: параллель экономит ~1 день календарно, но be-panel + fe-panel будут разрываться между двумя ветками.

### D-2026-04-30-02 · Вариант B принят, W2.A v2 launched

**Решение оператора:** «давай B». Параллельно W2.A + W3 в две feature-ветки.

**Уточнение скоупа W2.A:** в моём предложении B было «be-panel + fe-panel разделяются между двумя ветками», но canonical spec — **`sa-panel-wave2a-v2.md`** (CSS-only Approach E через ADR-0007) — это **только fe-panel** + qa-panel (Playwright spec) + cr-panel. be-panel в W2.A не участвует. В итоге реальный split:
- **be-panel** — целиком на W3 backend (CSV endpoint + leads/count + integration tests). Никаких разрываний.
- **fe-panel** — последовательно: сначала W2.A v2 (~0.7 ЧД, маленький scope CSS) → merge → подхватывает W3 frontend (~1 ЧД).
- **qa-panel** — параллельно: Playwright admin-login spec (для W2.A) + Playwright catalog smoke (для W3).
- **cr-panel** — review при готовности каждого PR.

**Calendar impact (vs вариант A «sequential W3 → W2.A»):**
- A: W3 (1.5 ЧД) → W2.A (0.7 ЧД) = ~2.2 ЧД линейно.
- B: be-panel и fe-panel параллельно. Crit path = max(be-panel W3 backend, fe-panel W2.A + W3 frontend) ≈ max(0.5, 0.7+1.0) = 1.7 ЧД. **Экономия ~0.5 ЧД календарно.**

**Что обновлено в этой сессии (B вариант):**

1. `sa-panel-wave2a-v2.md` — Hand-off log с записью popanel → fe-panel + iron-rules (skill-check `frontend-patterns` + `ui-styling`, ADR-0007 Approach E, local-verify ДО push, brand-guide §12.1, a11y WCAG 2.2 AA).
2. `team/backlog.md` Now table — добавлен W2.A в первой строке (RICE 28.6, выше чем W3=15) + W3 во второй; команды per-Wave чётко: W2.A=fe-panel only, W3=be-panel+fe-panel.

**Ответ на вопрос оператора «в какой задаче будет понятно что редизайн случится»:**

| Wave | Чеовек видит после merge | «Ощущение редизайна» |
|---|---|---|
| W1 ✅ DONE 2026-04-27 | Палитра янтарный + brand-зелёный, sidebar 3px accent, status pills | **Foundation** — «цветá наши, не Payload-фиолетовые». Уже видно в проде. |
| **W2.A v2** | Login screen: lockup + tagline + brand carд + cream bg | **Первый wow** — оператор открывает /admin/login и видит «свою» компанию. Touchpoint №1. |
| **W3** | Dashboard widget «Свежие изменения» + новая страница /admin/catalog + Leads badge counter | **Wow №2 — функциональный.** «У меня появились инструменты которых не было». Productivity gain, not just visual. |
| W4 | Tabs во всех 10 коллекциях вместо длинного скролла | **Wow №3 — ergonomic.** Каждое редактирование становится приятнее. |
| W5 | EmptyState/ErrorState/SkeletonTable | Polish. Закрывает «фиолетовые остатки» в граничных состояниях. |
| W6 | Mobile responsive | Если оператор использует с телефона — wow. Иначе invisible. |
| W7 | a11y + Playwright admin-design-compliance.spec | Невидимо для оператора, но это release-gate. |

**Milestone «полностью новая админка» (как ощущение)** — после merge **W2.A + W3 + W4 в main**. Это ≈4 ЧД от старта параллельно, ≈4 календарных дня. На этом этапе оператор откроет admin и не вспомнит как старая выглядела.

**Полное закрытие US-12** — + W5/W6/W7 (≈3.5 ЧД, +3 дня). Это release.

**Что НЕ сделано в этой сессии (coordination scope, не dev):**
- Ветка `feature/us-12-w3-page-catalog` физически не создана — это работа be-panel/fe-panel в их сессии (создаётся от main через `git checkout -b feature/us-12-w3-page-catalog main`).
- Никакого кода не написано (popanel — координирует, gate, и DoD; реализация — be-panel + fe-panel).
- Hand-off log в backlog'е — фиксация, не runtime-уведомление; оператор переключит роль через `@be-panel` или `@fe-panel` для старта.
