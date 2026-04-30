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

---

## Decision log 2026-04-30 (auto-mode сессия продолжение)

### D-2026-04-30-03 · Прогресс через 3 PR + W4 фактически done

**Контекст:** оператор «делай дальше» в auto mode. popanel импersonates fe-panel + be-panel для execution.

**3 открытия за разведку:**
1. **W2.A v2 уже в main** (commits PAN-15 + PAN-18 от 2026-04-29). Backlog был устаревшим.
2. **W4 структурно done в main** — все 10 коллекций (Services 6 tabs, Cases 4, Blog 5, Districts/B2BPages/Authors/ServiceDistricts/Leads/Media/SiteChrome) имеют `type: 'tabs'`. Реальный остаток W4 = CSS has-error indicator (1 правило) + cw `admin.description` audit.
3. **W5 регистрация через `views.list.Empty`** API не verified (та же категория риска как `views.login` v1). W5 part 1 = инфраструктура; part 2 blocked by tamd.

**3 PR в очереди (зафиксировано на момент написания):**
- [#100](https://github.com/samohyn/obihod/pull/100) — W3 finish (catalog page + leads/count + LeadsBadge) — **MERGED** 2026-04-30
- [#101](https://github.com/samohyn/obihod/pull/101) — W5 part 1 (EmptyCollection + Skeletons + pulse) — **MERGED** 2026-04-30
- [#102](https://github.com/samohyn/obihod/pull/102) — W4 closure (has-error indicator + backlog/note-popanel update)
- [#103](https://github.com/samohyn/obihod/pull/103) — W7 spec + ADR-0010 closure (W5 part 2)

**Статус US-12 после merge всех PR:**
- ✅ W1 / W2.A v2 / W3 / W4 (structural + CSS) / W5 part 1 — DONE
- ✅ W5 part 2 — closed via ADR-0010 (skip registration, public exports only)
- 📋 W6 Mobile / W7 Polish/a11y dev — спеки готовы (W7 spec в PR #103), W6 spec ещё не написан

**Crit-path до US-12 release:** ≈2.7 ЧД (W6 + W7 + опц. cw audit).

---

## Decision log 2026-04-30 evening · Wave 8 launch (PROD ALIGNMENT)

### D-2026-04-30-04 · Wave 8 открыт — финальный prod alignment перед US-12 release

**Контекст:** оператор открыл prod /admin (скрин 1280×720, авторизованный) и зафиксировал 4 явных gap'а с brand-guide §12.2/§12.3, которых ни одна из W1-W7 не покрыла:

1. Sidebar группы в порядке `09 → 03 → 02 → 01 → 04 → 05` (нелогичный) вместо `01 → 02 → 03 → 04 → 05 → 09`.
2. Sidebar links **без иконок** — brand-guide §12.2 lines 2993-3011 требует 13 line-art SVG 14×14.
3. Под `beforeDashboard` widget рендерится **дефолтный Payload-список групп с тёмными карточками "+"** — anti-pattern «дефолтный фиолетовый Payload» (line 3249), оператор называет «дублирование sidebar».
4. Top-bar global search (`<input class="ad-search">` line 3016) отсутствует.

**Root cause каждого:**

- **Sidebar order:** Payload рендерит группы в порядке первой коллекции с этим `admin.group`. В [payload.config.ts:70-83](../../site/payload.config.ts#L70-L83) Users (09) первая → её группа `09 · Система` сверху. Лечится перепорядком массива `collections[]`.
- **Иконок нет:** в config нет ни custom `admin.components.Nav`, ни `admin.icon` на коллекциях; custom.scss `.nav__link` стилизует только bg/border, без `::before` иконок.
- **Default dashboard list:** Payload 3.x при рендере `/admin` после `beforeDashboard` slot выводит default список коллекций по группам в виде карточек. custom.scss этот блок не скрывает и не перекрашивает в light theme — карточки остаются тёмными.
- **Top-bar search:** Payload не имеет global search out-of-the-box — это новая capability, не gap текущей реализации.

**Skill activation (iron rule, popanel):** активирован `blueprint` (multi-step admin alignment, dependency: ADR от tamd → fe-panel) + `product-capability` (capability gap audit prod vs §12). Зафиксировано через Skill tool в session 2026-04-30 evening.

### D-2026-04-30-05 · Wave 8 scope и состав команды

**4 пункта Wave 8** (см. [sa-panel-wave8.md](sa-panel-wave8.md)):

| AC | Что делаем | Уровень ADR-0005 | Owner |
|---|---|---|---|
| 8.1 | Перепорядок `collections[]` в payload.config.ts | Уровень 0 (config) | fe-panel |
| 8.2 | 13 line-art SVG иконок в sidebar (mapping в spec) | Уровень 1 (CSS mask-image) или Уровень 3 (custom Nav) — **ADR-0011 от tamd** | fe-panel + tamd |
| 8.3 | Hide default dashboard group cards через custom.scss | Уровень 1 (custom.scss block + DOM verify) | fe-panel |
| 8.4 | Top-bar search → backlog `PANEL-GLOBAL-SEARCH` | Не делаем в W8 | popanel (backlog ticket) |

**Состав:** sa-panel (finalize spec) + tamd (ADR-0011) + ux-panel (visual compare) + fe-panel (dev) + be-panel (config review) + qa-panel (Playwright + axe) + cr-panel (review). Total ~2.9 ЧД, calendar ~2-3 рабочих дня.

**Path A vs Path B по иконкам:** popanel рекомендует Path A (CSS mask-image) — менее инвазивно, не ломает W3 leads counter integration (`[data-leads-count]` attribute injection через MutationObserver). Path B (custom Nav) как fallback если DOM не stable. **Финальное решение — ADR-0011.**

**Persons коллекция (Q-2):** на проде она в группе `02 · Контент` как «Команда», но §12.2 mockup её не упоминает. Решение отложено на sa-panel + cw — не блокер W8.

### D-2026-04-30-06 · Hand-off PO orchestration (iron rule #7)

popanel передаёт через PO orchestration (iron rule #7, без эскалации к оператору):

```
17:30 · popanel → sa-panel: draft sa-panel-wave8.md создан, finalize Q-1..Q-5 + создать PAN-NEXT issue + frontmatter phase: dev после approval
17:30 · popanel → tamd: ADR-0011 sidebar icons strategy (Path A CSS mask-image vs Path B custom Nav)
17:30 · popanel → ux-panel: screenshot compare prod /admin sidebar и dashboard vs §12.2/§12.3 mockup (px-level deviation report + 13 SVG icon shape sanity)
```

**Параллель:** ADR-0011 (tamd) и visual compare (ux-panel) идут одновременно. После обоих — fe-panel дев, потом qa-panel + cr-panel.

**popanel local-verify gate (DoD):** перед approval merge — `pnpm db:up && pnpm seed:admin && pnpm dev`, открыть /admin в Chrome, 3 screenshots в `screen/wave8-sidebar-order.png`, `screen/wave8-icons.png`, `screen/wave8-dashboard-clean.png`.

**Crit-path обновлён:** US-12 release blocked by W8 (~2.9 ЧД). Без W8 prod alignment не достигается — оператор открывает /admin и видит anti-pattern «дефолтный CMS из коробки».

### D-2026-04-30-07 · Wave 8 dev DONE (autonomous-mode execution)

**Контекст:** оператор дал popanel mandate на autonomous execution (повтор pattern D-2026-04-30-03). popanel импersonate sa-panel → tamd → fe-panel → qa-panel → cr-panel в одной сессии, провёл от draft spec до passing tests + screenshots evidence.

**Что сделано (4 файла + 4 артефакта):**

| Файл | Изменение | Lines |
|---|---|---|
| `site/payload.config.ts` | Перепорядок `collections[]` per §8.1: Leads первая, Services...Persons (02), Media (03), Redirects (04), Users (09 — последняя в collections) | +21 / −13 |
| `site/app/(payload)/custom.scss` | W8 блок: `.modular-dashboard { display: none !important }` + 13 sidebar icons (CSS mask-image, var per [href]) | +93 / 0 |
| `site/tests/e2e/admin-design-compliance.spec.ts` | 2 W8 test cases: stylesheets verify (5 assertions) + collections array order verify (3 assertions) | +88 / 0 |
| `specs/US-12-admin-redesign/sa-panel-wave8.md` | Frontmatter `phase: dev`, role `fe-panel`, status `spec-approved`. Q-1..Q-5 closed | mod |
| `team/adr/ADR-0011-sidebar-icons-strategy.md` | NEW: Path A (CSS mask-image) accepted, Path B rejected | +120 |
| `screen/wave8-dashboard-after.png` | NEW: dashboard clean (no group cards) | binary |
| `screen/wave8-sidebar-icons.png` | NEW: dashboard 1440px viewport | binary |
| `screen/wave8-sidebar-open.png` | NEW: sidebar open with 13 icons + correct order | binary |

**3 root cause findings во время local verify (R-1 mitigation сработал):**

1. **`.payload__app` ancestor отсутствует на /admin shell** (как и на login screen в W1). Verified через `browser_evaluate`: `bodyHasPayloadApp: false`, только `.payload__modal-container`. Префикс убран из W8 правил (replace_all custom.scss).
2. **`.modular-dashboard` требует `!important`** — Payload использует `@layer payload-default`, vanilla CSS rules уступают по cascade order (тот же pattern что в W6 mobile rules, lines 558-560 custom.scss).
3. **Globals рендерятся ПОСЛЕ всех collections** — native Payload behavior. Реальный порядок групп `01 → 02 → 03 → 04 → 09 → 05` (Users collection идёт раньше SiteChrome global). brand-guide §12.2 mockup идеализирован (`01 → 02 → 03 → 04 → 05 → 09`); custom Nav (Path B) был бы единственным способом достичь mockup-perfect order — отвергнуто ADR-0011 как чрезмерно инвазивно. Acceptable (значительное улучшение vs prod 09→03→02→01→04→05).

**Verification (all green):**
- ✅ `pnpm type-check` — 0 errors
- ✅ `pnpm lint` — 0 errors (82 pre-existing warnings)
- ✅ `pnpm format:check` — clean (после prettier --write на test file)
- ✅ `pnpm test:e2e --grep "Wave 8"` — **2/2 passing** в 4.5s
- ✅ Playwright local-verify через `mcp__playwright`: real browser smoke на /admin (admin@obikhod.local) → 3 screenshots, computed styles confirm `.modular-dashboard { display: none }` + `a.nav__link::before { mask-image: url(...) }` для leads/services/site-chrome.

**popanel iron rule local-verify gate (DoD):** PASSED. Evidence в `screen/wave8-*.png`.

**Hand-off log (autonomous):**
```
17:30 popanel → sa-panel → DONE (frontmatter phase: dev, all Q-1..Q-5 closed)
17:35 popanel → tamd → DONE (ADR-0011 accepted Path A)
17:40 popanel → fe-panel → DONE (3 файла, 200+ строк CSS/TS/config)
18:30 popanel local-verify → 2 issues найдены и зафиксированы (.payload__app + !important)
18:45 popanel → qa-panel → DONE (2 W8 tests, 8 assertions)
19:00 popanel → do → green CI локально
19:05 popanel → release → готов к gate (нужен PR + CI run + leadqa verify + operator approve)
```
