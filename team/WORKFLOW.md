# Обиход — Workflow команды

Живой регламент работы распределённой команды из **42 ролей в 7 командах** над
сайтом **Обиход** (арбористика, чистка крыш, вывоз мусора, демонтаж — Москва и МО)
и сопутствующими продуктами (магазин саженцев, админ-панель, SEO-программа).
Описывает жизненный цикл задачи от оператора до prod, зоны ответственности,
каналы коммуникации, артефакты и правило использования глобальных скилов.

> Источник истины для «кто над чем работает» и «куда передать». Приоритет при
> конфликтах: `CLAUDE.md` (корневой) → `team/PROJECT_CONTEXT.md` →
> `contex/*.md` → этот файл.

---

## 0. Контекст проекта

- **Продукт:** сайт [obikhod.ru](https://obikhod.ru) — подрядчик 4-в-1 для
  частных (B2C) и УК/ТСЖ/FM/застройщиков (B2B) в Москве и МО + расширение
  2026-04-27 (дизайн ландшафта flat-link + магазин саженцев в mega-menu).
- **Главная метрика:** квалифицированные заявки → amoCRM → бригадир. Воронка —
  форма + 4 калькулятора + «фото → смета за 10 мин».
- **Стек:** Next.js 16 (App Router, RSC, Turbopack, TS strict) + Payload CMS 3
  + PostgreSQL 16, хостинг Beget VPS, CI/CD через GitHub Actions + PM2. Детально —
  [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).
- **Код сайта:** `site/`. Магазин выделяется в `apps/shop/`. Живой prod с 2026-04-21.
- **Тесты:** Playwright (chromium + mobile-chrome) в `site/tests/`. CI-parity
  через `PLAYWRIGHT_EXTERNAL_SERVER=1`.
- **Язык:** контент — русский; код, идентификаторы, commit messages — английский.
- **Репозиторий:** `samohyn/obihod` (private), основная ветка `main`,
  + 4 integration-ветки (`design/integration`, `panel/integration`,
  `shop/integration`, `product/integration`).
- **Task-tracker:** внешний tracker **не используется** (Linear отключён
  2026-04-29 — см. [adr/ADR-0008-drop-linear-task-tracker.md](adr/ADR-0008-drop-linear-task-tracker.md)).
  Единственный источник истины для задачи — папка `specs/US-<N>-<slug>/`
  (`intake.md` + `ba.md` + `sa-<team>.md` + `qa-<team>.md` + `cr-<team>.md`).
  Беклог и приоритизация — в `team/backlog.md` (ведёт `cpo`).

---

## 1. Карта команды

Полный состав — **42 роли в 7 командах**. Все агенты работают на модели
**`opus-4-6`** с `reasoning_effort: max`. Профиль каждой роли — в соответствующем
файле `team/<dir>/<code>.md` (где `<dir>` — папка команды).

### 1.0. 7 команд верхнего уровня

| Папка | Команд-роли | Lead | Integration-ветка |
|---|---|---|---|
| `business/` (6) | cpo, ba, in, re, aemd, da | **cpo** (CPO) | main |
| `common/` (5) | tamd, dba, do, release, leadqa | — (shared) | main |
| `design/` (3) | art, ux, ui | **art** | `design/integration` |
| `product/` (8) | podev, sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site | **podev** | `product/integration` |
| `seo/` (6) | poseo, sa-seo, seo-content, seo-tech, cw, cms | **poseo** | main |
| `shop/` (7) | poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop | **poshop** | `shop/integration` |
| `panel/` (7) | popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel | **popanel** | `panel/integration` |

**Подчинение:**

- `cpo` ← оператор (Chief PO над всем продуктом).
- `podev`, `poseo`, `popanel`, `poshop`, `art` ← `cpo`.
- В каждой команде разработки все агенты ← свой PO (`podev` / `poseo` / `popanel`
  / `poshop`).
- `ux-shop` и `ux-panel` ведут UX-функционально под `art` (визуал и дизайн-токены),
  процессно — под своим PO (`poshop` / `popanel`).
- `common/` (tamd, dba, do, release, leadqa) — shared-роли, подключаются по
  запросу к любой команде через PO той команды.
- **Source of truth для admin-panel дизайна:** `design-system/brand-guide.html` §12
  ведёт команда `panel/`.
- **Owner Payload-коллекций:** **team `panel/`** (`be-panel` + `dba` из common).
  Команды `product/` и `shop/` читают данные через Payload Local API и НЕ правят
  схему коллекций без согласования с `popanel` + `dba`.

### 1.1. Контур «вход / выход»

| Код | Роль | Папка | Подчинение | Источник задач | Выход |
|-----|------|-------|-----------|----------------|-------|
| **in** | Intake Manager | business/ | cpo | Оператор (свободный текст) | Интейк-бриф → **ba** |
| **release** | Release Engineer (gate) | common/ | cpo | Связка `qa-X + cr-X` после dev/QA | Release Candidate + checklist соответствия → **leadqa** |
| **leadqa** | Lead QA (verify gate) | common/ | cpo | RC от `release` | Verify-отчёт → Оператор |

`release` и `leadqa` — **двухступенчатый gate** перед оператором. `release`
формирует Release Candidate и сверяет реализацию с ba/sa/AC/DoD/NFR. `leadqa`
самостоятельно разворачивает RC локально, прогоняет smoke + дизайн + функ/нефунк +
a11y, отчитывается оператору. **Оператор апрувит ТОЛЬКО после `leadqa`.** **`do`
НЕ деплоит без апрува оператора.**

### 1.2. business/ — продуктовая аналитика и планирование

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **cpo** | Chief Product Owner | Оператор | стратегия, кросс-команда | Программа, приоритизация всех PO команд, post-release retro |
| **ba** | Business Analyst (CBAP / BABOK v3) | cpo | **in** | Декомпозиция требований → Оператор → нужный PO команды |
| **in** | Intake Manager | cpo | Оператор | Интейк-бриф → **ba** |
| **re** | Research Analyst | cpo (через ba) | **ba** (опционально) | Рыночное/конкурентное исследование → **ba** |
| **aemd** | Analytics Engineer | cpo | cpo / PO команд | Event taxonomy, трекинг, разметка, отчёты → fe команд + **da/pa-site** |
| **da** | Data Analyst | cpo | cpo / PO команд | SQL/Python, проверка гипотез, дашборды, A/B-выводы |

### 1.3. common/ — shared-роли (DEV)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **tamd** | Technical Architect (solution-level) | cpo | PO команд | ADR, уточнения архитектуры, координация интеграций |
| **dba** | Database Administrator | tamd | be-panel / be-site / be-shop по запросу | Модели данных, ревью схем Payload, индексы, безопасность PG, бэкапы/рестор, согласование миграций |
| **do** | DevOps / SRE / Merge-train owner | tamd | PO команд + tamd | CI/CD, деплой на Beget, nginx, TLS, PM2, мониторинг, **owner merge train** между integration-ветками |
| **release** | Release Engineer | cpo | qa/cr команд | Release Candidate + сводный checklist соответствия |
| **leadqa** | Lead QA (verify gate) | cpo | RC от `release` | Verify-отчёт оператору, smoke + дизайн + a11y |

### 1.4. design/ — дизайн (lead: art)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **art** | Art Director (lead) | cpo | cpo + PO команд | Концепция, визуальный язык, TOV-визуал, токены DS → ui/ux команд |
| **ux** | UX / Product Designer | art | art (функционально), PO команд (процессно) | CJM, JTBD, IA, wireframes, usability-отчёты → ui / fe команд |
| **ui** | UI Designer | art | art (функционально), PO команд (процессно) | Макеты, дизайн-токены, компоненты ДС → fe команд |

> Команда `design/` пишет в `design-system/` (tokens, components, brand-guide.html
> §1–11) — единственный source of truth для UI/UX. Ветка `design/integration`
> мёрджится в main первой в порядке merge-train (см. §6).

### 1.5. product/ — сайт услуг (lead: podev)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **podev** | Product Owner — сайт услуг (lead) | cpo | cpo + ba | Беклог OBI, US-задания команде, демо оператору |
| **sa-site** | System Analyst — сайт | podev | podev | Полная спека: US, AC, UML, ERD, DoD → podev |
| **be-site** | Senior Backend (TS · Next.js API + Payload Local API) | podev | podev (спека от sa-site, схема через panel) | Код API сайта услуг, тесты → qa-site → cr-site |
| **fe-site** | Senior Frontend / Fullstack (TS, Next.js 16) | podev | podev | Код фронта сайта услуг, тесты → qa-site → cr-site |
| **lp-site** | Landing / CRO | podev | podev | Гипотезы конверсии, A/B-план → ux/ui/cw |
| **pa-site** | Product Analyst | podev | podev | Воронка, когорты, метрики заявок, ответ на «где теряем лиды» |
| **cr-site** | Code Reviewer (сайт) | podev | связка fe-site/be-site после qa-site | PR-ревью, блок/апрув → release |
| **qa-site** | Senior QA (сайт) | podev | podev (AC от sa-site), код от fe-site/be-site | Smoke + E2E + visual + edge → bug или Pass → cr-site |

### 1.6. seo/ — SEO-программа (lead: poseo)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **poseo** | Product Owner — SEO (lead) | cpo | cpo + ba | Беклог SEO, ARR-таргеты, US-задания seo-команде |
| **sa-seo** | System Analyst — SEO | poseo | poseo | Спека SEO-фич, требования к шаблонам, URL-картам |
| **seo-content** | SEO Strategist (Яндекс-first, нейро-SEO) | poseo | poseo | Стратегия, кластеры, URL-карта, семядро, E-E-A-T → cw / seo-tech |
| **seo-tech** | Technical SEO | poseo | poseo + sa-seo | SEO-слой кода: `generateMetadata`, JSON-LD, sitemap, robots, CWV → fe-site |
| **cw** | Copywriter | poseo | poseo | Тексты по TOV, проверка на SEO → cms / ui |
| **cms** | CMS Editor (Payload) | poseo | poseo | Контент в админке (Services, Districts, Cases, Blog), публикация по чек-листам |

### 1.7. shop/ — магазин саженцев (lead: poshop)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **poshop** | Product Owner — магазин (lead) | cpo | cpo + ba | Беклог SHOP, US-задания shop-команде |
| **sa-shop** | System Analyst — магазин | poshop | poshop | Спека магазина, каталог, корзина, оплата |
| **be-shop** | Senior Backend (TS) — магазин | poshop | poshop (схема через panel) | Код API магазина, интеграции платежей, тесты → qa-shop → cr-shop |
| **fe-shop** | Senior Frontend — магазин | poshop | poshop | Код фронта `apps/shop/`, тесты → qa-shop → cr-shop |
| **ux-shop** | UX — магазин | art (функц.) + poshop (процесс.) | poshop | UX магазина: каталог, фильтры, корзина, чекаут |
| **cr-shop** | Code Reviewer (магазин) | poshop | связка fe-shop/be-shop после qa-shop | PR-ревью, блок/апрув → release |
| **qa-shop** | Senior QA (магазин) | poshop | poshop | Smoke + E2E + платёжные сценарии → cr-shop |

### 1.8. panel/ — admin-панель Payload (lead: popanel)

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **popanel** | Product Owner — панель (lead) | cpo | cpo + ba | Беклог PANEL, US-задания panel-команде |
| **sa-panel** | System Analyst — панель | popanel | popanel | Спека админки, коллекций, прав доступа |
| **be-panel** | Senior Backend (TS · Payload core) — **owner Payload-коллекций** | popanel | popanel + dba | Схемы коллекций (`site/payload.config.ts`), миграции, кастомизация admin |
| **fe-panel** | Senior Frontend — admin UI | popanel | popanel | Кастомные компоненты `app/(payload)/admin/**`, integration с design-system §12 |
| **ux-panel** | UX — админка | art (функц.) + popanel (процесс.) | popanel | UX админки, паттерны form/list/dashboard |
| **cr-panel** | Code Reviewer (панель) | popanel | связка fe-panel/be-panel после qa-panel | PR-ревью, блок/апрув → release |
| **qa-panel** | Senior QA (панель) | popanel | popanel | Smoke + E2E админки, RBAC, edge cases → cr-panel |

> **Owner Payload-коллекций — `be-panel` + `dba`.** `product/` и `shop/` читают
> через Payload Local API, схему НЕ правят. Любое изменение коллекций — через
> `popanel` + `dba` ADR.

---

## 2. Основной pipeline (новый релиз-цикл)

```
[ba] REQ + AC + DoD ──────────────┐
[sa-X] спека + макеты ────────────┤
                                  ▼
[be-X | fe-X | lp-X | cms] ── implement в фича-ветке
                                  │
[qa-X] первичная проверка ───────►│  specs/US-N/qa-<team>.md
[cr-X] code review ─────────────►│  cr-approval (PR)
                                  ▼
                         PR в integration-ветку
                                  │
[do] merge-train: детектит конфликты
     shop/panel/product/design vs main
                                  ▼
                          [release] ← gate (common/)
              формирует RC + checklist соответствия ba/sa/AC/DoD/NFR
                                  │  team/release-notes/RC-N.md
                                  ▼
                          [leadqa] ← verify (common/)
              разворачивает RC локально → smoke + дизайн +
              функ/нефунк + a11y → отчёт оператору
                                  │  team/release-notes/leadqa-N.md
                                  ▼
                       [operator decision]
                       ├── reject → возврат к sa-X / PO команды
                       └── approve
                                  ▼
                            [do] deploy в prod + canary-watch
                                  ▼  team/release-notes/N.md
                            [cpo] post-release retro
                                   (метрики от aemd/da/pa-site)
```

**Жёсткие правила процесса:**

- `release` выпускает RC только **после `cr-X` approve**.
- `leadqa` начинает verify только **после `release` approve RC**.
- Оператор апрувит **ТОЛЬКО после `leadqa` отчёта**.
- `do` деплоит **ТОЛЬКО после апрува оператора**.
- Любой блокинг (фундаментальный bug, нарушение AC) → возврат к `sa-X` / PO команды.
- **PO команды самостоятельно переключает фазы между ролями своей команды**
  (dev → qa → review → gate) и подключает кросс-командных агентов через
  Hand-off log без эскалации к оператору. Если сомневается — спрашивает
  оператора (см. §5.4).

---

## 3. Фазы процесса

### Фаза 1. Intake

1. Оператор пишет произвольное сообщение → **in**.
2. **in** формирует интейк-бриф: 1–3 абзаца формулировки + бизнес-смысл +
   контекст + срок + критичность + открытые вопросы.
3. Передаёт бриф `→ ba`. Без утверждения оператора **ba** в работу не берёт.

### Фаза 2. Business Analysis

1. **ba** строит трассируемость: цель → gap → требование → решение → AC + DoD.
2. При необходимости подключает **re** для рыночного/конкурентного контекста.
3. Готовит артефакт: `specs/US-<N>-<slug>/ba.md`.
4. Возвращает на **утверждение оператору**. Оператор подтверждает — передаём
   `→ cpo`. **cpo** распределяет по PO команды (`podev` / `poseo` / `popanel` /
   `poshop`). Не подтверждает — правки.

### Фаза 3. Product Ownership (PO команды)

1. PO команды (`podev` / `poseo` / `popanel` / `poshop`) приоритизирует задачу
   по RICE/ICE относительно беклога своей команды.
2. Определяет состав исполнителей внутри команды.
3. Ставит задачу `sa-<team>` на спецификацию.

### Фаза 4. System Analysis

`sa-<team>` (sa-site / sa-seo / sa-panel / sa-shop) пишет спеку по шаблону:

- User Story (As a … I want … so that …),
- Acceptance Criteria (Given/When/Then),
- Use Case / UML Sequence,
- ERD (если задевает данные — согласуется с **dba** + **be-panel**),
- NFR (производительность, доступность, SEO, a11y),
- Definition of Done,
- Open questions.

Артефакт: `specs/US-<N>-<slug>/sa-<team>.md`. Возврат `→ PO команды` →
оператор утверждает (через cpo).

### Фаза 5. Architecture Gate (условная)

Если задача меняет границы системы, контракты API, интеграции, выбор библиотек
верхнего уровня — **tamd** даёт архитектурное решение + ADR
(`team/adr/ADR-<N>-<slug>.md`). Стек зафиксирован (Next.js 16 + Payload 3 +
Postgres 16 + Beget), пересмотр стека — только по явному запросу оператора.

Если задача касается Payload-коллекций — **be-panel** (owner схемы) + **dba**
параллельно дают схему и план миграции. Без ADR `tamd` разработка не стартует.
Без apr `dba` + `be-panel` не стартуют миграции.

### Фаза 6. Design

По решению PO команды: активирует **art** → **ux** / **ui** или специфический
**ux-shop** / **ux-panel** (если задача внутри shop/panel). **lp-site**
подключается для ключевых конверсионных экранов сайта услуг. **cw** синхронизируется
с **art** по TOV и с **seo-content** по ключам.

### Фаза 7. Implementation

> **⚙️ Iron rule (spec-before-code):** Implementation стартует ТОЛЬКО после Фазы 4 (System Analysis): `sa-<team>.md` approved PO команды + при необходимости Фаза 5 (Architecture) с ADR от `tamd`. Без одобренной спеки `fe-*`/`be-*`/`lp-*`/`cr-*`/`qa-*` не берут задачу. PO команды держит gate.

В каждой команде — **по одному инженеру на роль**: `fe-<team>` (фронт),
`be-<team>` (бэк), `seo-tech` (SEO-слой), `aemd` (разметка событий, кросс-команда),
`do` (инфраструктура, shared). Коммуникация — через PO команды; напрямую между
разработчиками — только по техническим деталям внутри уже согласованной спеки.

> Если задача требует параллели (ускорение спринта) — PO команды поднимает запрос
> к `cpo`; `cpo` может временно подключить инженера из shared `common/` или
> другой команды, фиксируя факт в frontmatter `sa-<team>.md` (`role:` поле +
> комментарий «temporary cross-team»).

### Фаза 8. QA

`qa-<team>` (qa-site / qa-shop / qa-panel) прогоняет по AC из спеки `sa-<team>`.
QA **не верит на слово**: даже если FE/BE говорит «проверил» — QA прогоняет
заново. Артефакт: `specs/US-<N>-<slug>/qa-<team>.md` (pass или bug report
с воспроизведением).

### Фаза 9. Code Review

`cr-<team>` (cr-site / cr-shop / cr-panel) проверяет: читаемость, безопасность,
соответствие `CLAUDE.md`, тесты, производительность, отсутствие мёртвого кода.
Блок / апрув. Артефакт — коммент в PR или `specs/US-<N>-<slug>/cr-<team>.md`.

### Фаза 10. Release Gate (release)

**release** (common/) собирает Release Candidate:
- сверяет реализацию с `ba.md` + `sa-<team>.md` + AC + DoD + NFR;
- проверяет, что все `cr-<team>` approve собраны;
- собирает PR в integration-ветке и готовит merge в main (через merge-train);
- пишет `team/release-notes/RC-<N>.md` с checklist соответствия.

Если что-то не совпадает — возврат к PO команды / `sa-<team>`.

### Фаза 11. Verify Gate (leadqa)

**leadqa** (common/) разворачивает RC локально (`apps/site/`, `apps/shop/`,
admin) и прогоняет:
- smoke по основным сценариям;
- дизайн-проверку против `design-system/brand-guide.html`;
- функциональные + нефункциональные NFR (CWV, a11y);
- a11y-чек по WCAG 2.2 AA.

Артефакт: `team/release-notes/leadqa-<N>.md`. Передача `→ Оператор` для решения.

### Фаза 12. Operator decision + Release

Оператор принимает решение: **approve / reject**.

- `reject` → возврат к PO команды через `cpo`.
- `approve` → **do** деплоит в prod + canary-watch. **cpo** инициирует
  post-release retro: пишет `team/release-notes/<N>.md`, забирает метрики от
  `aemd` / `da` / `pa-site`.

---

## 4. RACI по фазам (новая модель)

**Обозначения:** R — Responsible (исполняет), A — Accountable (отвечает), C —
Consulted (консультирует), I — Informed (информирован).

| Фаза                      | R                                  | A          | C                                    | I                       |
|---------------------------|------------------------------------|------------|--------------------------------------|-------------------------|
| 1. Intake                 | in                                 | Оператор   | —                                    | ba                      |
| 2. BA                     | ba                                 | Оператор   | re                                   | cpo                     |
| 3. PO planning            | PO команды                         | cpo        | ba, tamd                             | команда + cpo           |
| 4. SA                     | sa-`<team>`                        | PO команды | ba, tamd, ux/ui, dba, be-panel       | fe/be/qa/cr/do          |
| 5. Architecture           | tamd (+dba+be-panel при данных)    | cpo        | be-`<team>`, do, seo-tech            | fe-`<team>`, sa-`<team>` |
| 6. Design                 | art → ux, ui (или ux-shop/-panel)  | art / cpo  | ba, ux, cw, seo-content, lp-site     | fe-`<team>`             |
| 7. Implementation         | fe-`<team>`, be-`<team>`           | PO команды (gate `sa-<team>.md` approved) | sa-`<team>`, ui, ux, seo-tech, aemd, do, dba | qa-`<team>`, cr-`<team>` |
| 8. QA (team)              | qa-`<team>`                        | PO команды | sa-`<team>`, fe/be                   | cr-`<team>`             |
| 9. Code Review (team)     | cr-`<team>`                        | PO команды | fe/be, sa-`<team>`, dba              | release                 |
| 10. Release gate          | release                            | cpo        | PO команды, cr-`<team>`, qa-`<team>` | leadqa                  |
| 11. Verify gate           | leadqa                             | cpo        | release, ux, qa-`<team>`             | Оператор                |
| 12. Operator decision     | Оператор                           | Оператор   | cpo                                  | вся команда             |
| 13. Release (deploy)      | do                                 | cpo        | release, leadqa                      | вся команда             |
| 14. Post-release retro    | cpo (orchestrate); aemd/da/pa-site | cpo        | PO команд                            | Оператор, команда       |

---

## 5. Каналы коммуникации, эскалации и sticky agent sessions

### 5.1. Кто с кем общается напрямую

- **Оператор ↔ in, ba, cpo** — прямой канал.
- **cpo ↔ podev / poseo / popanel / poshop / art** — стратегия и кросс-команда.
- **PO команды ↔ своя команда** — единая точка контакта для исполнителей внутри
  команды.
- **sa-`<team>` ↔ ba, tamd, dba, be-panel, ui, ux** — напрямую по уточнениям
  требований / данных.
- **art ↔ ui, ux, ux-shop, ux-panel, cw** — напрямую по визуалу и TOV.
- **seo-content ↔ seo-tech, cw, cms** — напрямую по стратегии/реализации.
- **fe-`<team>` ↔ be-`<team>`, ui, seo-tech, aemd** — напрямую по техническим
  деталям внутри уже согласованной спеки. Изменение scope → через PO команды.
- **be-`<team>` ↔ be-panel + dba** — напрямую по схемам, индексам, миграциям
  Payload/Postgres.
- **qa-`<team>` ↔ fe/be своей команды, sa-`<team>`** — напрямую по
  воспроизведению багов.
- **release ↔ cr-`<team>` + qa-`<team>`** — сверка готовности к RC.
- **leadqa ↔ release** — приём RC.

### 5.2. Эскалация

```
Исполнитель команды → PO команды → cpo → Оператор
tamd / cr-<team> / dba (блокирующее решение) → PO команды → cpo
release / leadqa (блок RC) → cpo → Оператор
ba (противоречие в требованиях) → Оператор
```

### 5.3. Запрещено

- Обход **PO команды** при изменении scope задачи.
- Обход **cr-`<team>`** при мерже PR в integration-ветку.
- Обход **release + leadqa** при выходе RC к оператору.
- Обход **dba + be-panel** при изменении схемы Payload-коллекций / миграциях.
- Прямой диалог оператора с исполнителем (fe/be/qa/…) — всегда через `in` или
  `cpo` / PO команды.
- Деплой в prod без апрува оператора.

### 5.4. PO orchestration — передача между фазами и подключение агентов

**Iron rule (закреплён 2026-04-30):** PO команды (`podev` / `poseo` / `popanel`
/ `poshop` / `cpo`) **обязан и имеет право самостоятельно** подключать
компетентных агентов под контекст задачи и переключать фазы артефакта без
эскалации к оператору.

**Штатные переходы фаз внутри одной команды (PO решает сам):**

| Сигнал | Действие PO |
|---|---|
| `fe-<team>` / `be-<team>` пишет «готово» (dev) | передать в `qa-<team>` → `phase: qa` |
| `qa-<team>` `pass` | передать в `cr-<team>` → `phase: review` |
| `cr-<team>` `approve` | передать в `release` (common/) → `phase: gate` |
| Спека готова (`sa-<team>` approved) | назначить состав исполнителей (fe/be/lp/cms) → `phase: dev` |
| Нужен `tamd` (архитектура) / `dba` (схема) / `aemd` (события) / `do` (CI) | подключить напрямую через Hand-off log; параллельно — фаза не меняется |

Каждый переход фиксируется строкой в `## Hand-off log` артефакта:
`YYYY-MM-DD HH:MM · <from> → <to>: <1 фраза причины>`. Frontmatter
обновляется одновременно (`phase:`, `role:`, `updated:`).

**Когда PO ОБЯЗАН спросить оператора (а не переключать молча):**

- Cross-team конфликт ресурсов (нужен `fe-shop`, но он занят на `poshop`-задаче).
- Неясный owner: задача задевает 2+ команды, и не очевидно, чья она по scope.
- Риск нарушить scope другой команды (изменения в `apps/shop/` от `podev`,
  правки `payload.config.ts` без согласия `popanel` + `dba` — запрещено
  iron rule §5.3).
- Сомнение в выборе skill/роли (нужен ли `tamd` для ADR, или хватит
  `sa-<team>`).
- Реджект (`qa` / `cr` / `release` / `leadqa` блок) с **спорным AC/scope** —
  к оператору. Если причина блока техническая — возврат на доработку PO
  делает сам.

**Анти-паттерны (нарушение iron rule):**

- PO ждёт оператора для штатного перехода dev → qa → cr (бутылочное горлышко).
- PO молча подключает кросс-командного агента без записи в Hand-off log.
- PO «договаривается устно» в чате — переход не зафиксирован в артефакте.
- PO эскалирует к `cpo` каждый внутрикомандный hand-off (`cpo` нужен только
  для cross-team модерации и стратегии).

**Граница: что остаётся за оператором (НЕ переключает PO сам):**

- Approve `leadqa` отчёта → release (см. §2 main pipeline).
- Изменение приоритетов между эпиками cross-team.
- Любые `Immutable` решения из `CLAUDE.md` (бренд, стек, TOV, хостинг).

### 5.5. Sticky agent sessions

Оператор обращается к роли одним из способов:
- `@<code>` (например `@podev`, `@be-site`, `@ux-shop`),
- `/<code>` (slash-команда),
- просто «`<code>`, …» (упоминание кода в начале сообщения).

После активации Claude **переключается в роль и остаётся в ней** до явного
переключения. Каждый ответ в роли префиксируется маркером `[code]` (например
`[poseo]`, `[fe-shop]`).

**Возврат к Claude:**
- `/claude`,
- «Claude, переключись»,
- новая сессия (sticky-state теряется при старте новой беседы).

В роли активируются **только её skills** из `~/.claude/skills/` и применяются её
ограничения «Чем НЕ занимаюсь» из `team/<dir>/<code>.md`. Внутри одной сессии
можно последовательно переключаться между ролями: `@art` → `@ui` → `@fe-shop`.

---

## 6. Branch strategy и merge-train

### 6.1. Структура веток

```
main (prod)
 ├── design/integration   (lead: art)      design-system/, токены
 ├── shop/integration     (lead: poshop)   apps/shop/**
 ├── panel/integration    (lead: popanel)  site/payload.config.ts,
 │                                         app/(payload)/admin/**
 └── product/integration  (lead: podev)    фича-ветки сайта услуг
```

Команды `business/`, `common/`, `seo/` работают напрямую с `main` (через
короткие фича-ветки + PR), потому что не имеют активного UI-кода с риском конфликтов.

### 6.2. Owner merge-train: `do`

`do` (common/) — **owner merge-train**. Daily cron:

```
git fetch --all
для каждой integration-ветки:
  git merge-tree main <branch>  # детектит конфликты
```

При конфликте на **hot-paths**:
- `payload.config.ts`,
- `apps/shop/**`,
- `app/(payload)/admin/**`,
- `design-system/**`,
- `package.json`, `pnpm-lock.yaml`

`do` создаёт `team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` с описанием
конфликта и пингует **двух соответствующих PO** напрямую через сообщение
оператору (например `popanel` + `poshop` если конфликт в `payload.config.ts`).

### 6.3. Merge order на main

Жёсткая очередь при синхронизации:

```
design → panel → shop → product
```

Логика: дизайн-токены первыми (база для всех), затем схема Payload (база для
данных shop/product), затем магазин (`apps/shop`), затем сайт услуг.

Эту очередь обязан соблюдать `release` при подготовке RC, который тянет
несколько integration-веток одновременно.

---

## 7. Артефакты и папки

```
<repo-root>/
├── specs/                              # все артефакты задач (на корне репо, не внутри team/)
│   ├── README.md                       # обзор: эпики, текущие US, таблица backlog (опц.)
│   ├── EPIC-<N>-<slug>/                # обёртка эпика — для крупных программ из нескольких US
│   │   ├── README.md                   # цель эпика, состав US, статусы
│   │   └── US-<N>-<slug>/              # отдельная US внутри эпика
│   │       ├── intake.md               # бриф от in
│   │       ├── ba.md                   # бизнес-анализ, требования
│   │       ├── sa-<team>.md            # системная спека: US, AC, UML, ERD, DoD
│   │       ├── qa-<team>.md            # тест-отчёт от qa-site / qa-shop / qa-panel
│   │       ├── cr-<team>.md            # код-ревью (если не в PR)
│   │       └── leadqa.md               # verify-отчёт (если делается в спеке)
│   ├── TASK-<DOMAIN>-AD-HOC/           # обёртка для одиночных задач (баги, разовые ops, content-правки)
│   │   └── US-<N>-<slug>/              # та же структура артефактов внутри
│   │       └── ...
│   └── <legacy US-N-slug>/             # исторические US до 2026-04-29 (плоский список, без EPIC-обёртки)
└── team/
    ├── PROJECT_CONTEXT.md              # единый контекст (все агенты ссылаются сюда)
    ├── WORKFLOW.md                     # этот файл
    ├── README — legend.md              # исходная легенда команды от оператора
    ├── backlog.md                      # cross-team таблица беклога (priority, status, deps)
    ├── business/<code>.md              # cpo, ba, in, re, aemd, da
    ├── common/<code>.md                # tamd, dba, do, release, leadqa
    ├── design/<code>.md                # art, ux, ui
    ├── product/<code>.md               # podev, sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site
    ├── seo/<code>.md                   # poseo, sa-seo, seo-content, seo-tech, cw, cms
    ├── shop/<code>.md                  # poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop
    ├── panel/<code>.md                 # popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel
    ├── adr/
    │   └── ADR-<N>-<slug>.md           # архитектурные решения tamd
    └── release-notes/
        ├── RC-<N>.md                   # release candidate checklist (release)
        ├── leadqa-<N>.md               # verify-отчёт оператору (leadqa)
        └── <N>.md                      # пост-релизная заметка (cpo)
```

> **`specs/` — единственный источник истины задачи** (на уровне корня репо,
> вынесен из `team/` решением оператора 2026-04-29). В заголовке артефактов
> фиксируется `**US:** US-<N>` + frontmatter с `epic:`, `role:`, `phase:`.
> Внешний task-tracker не используется (см. ADR-0008).
>
> **Правила группировки внутри `specs/`:**
> - **Крупная программа из нескольких US** → обязательно `EPIC-<N>-<slug>/`.
> - **Одиночные задачи** (bugfix, разовый ops, content-правка) →
>   `TASK-<DOMAIN>-AD-HOC/` (например, `TASK-INFRA-AD-HOC/`,
>   `TASK-CONTENT-AD-HOC/`, `TASK-PANEL-AD-HOC/`).
> - **US никогда не лежит напрямую в `specs/`** для новых задач после
>   2026-04-29 — всегда через EPIC или TASK-AD-HOC обёртку. Исторические US
>   (US-1..US-12, OBI-19, PAN-9, admin-visual) остаются плоским списком как
>   archeological data.

---

## 7.5. Беклог и трекинг (без внешнего tracker'а)

С 2026-04-29 проект **не использует Linear** и любой другой внешний
task-tracker (см. [adr/ADR-0008-drop-linear-task-tracker.md](adr/ADR-0008-drop-linear-task-tracker.md)).
Беклог, статусы, фазы и hand-off ведутся в репозитории.

### 7.5.1. Где что живёт

| Слой | Где | Владелец |
|------|-----|----------|
| Беклог + приоритизация (P0..P3) | `team/backlog.md` (одна таблица: id, title, команда, PO, priority, status, deps) | `cpo` (cross-team), PO команды (внутри своей секции) |
| Артефакты задачи | `specs/EPIC-<N>-<slug>/US-<N>-<slug>/` (для эпиков) или `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/` (для одиночных) — `intake.md`, `ba.md`, `sa-<team>.md`, `qa-<team>.md`, `cr-<team>.md` | соответствующие роли |
| Обзор эпика | `specs/EPIC-<N>-<slug>/README.md` (цель, состав US, статусы) | `cpo` или owning PO команды |
| ADR | `team/adr/` | `tamd` |
| Research | `specs/<EPIC-или-TASK>/<US>/re.md` или `team/research/` | `re` |
| RC + verify report | `team/release-notes/RC-*.md`, `team/release-notes/leadqa-*.md` | `release` / `leadqa` |
| Release notes | `team/release-notes/<N>.md` | `cpo` |
| История hand-off-ов | Раздел `## Hand-off log` в самом артефакте (`sa-<team>.md` и т. п.) | роль, выполняющая hand-off |
| Merge-conflicts | `team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` | `do` |

### 7.5.2. Frontmatter артефактов

Каждый файл в `specs/<EPIC-или-TASK>/US-<N>-<slug>/` начинается с
YAML-frontmatter. Это заменяет Linear-labels:

```yaml
---
us: US-<N>
title: <семантический заголовок>
epic: EPIC-<N>-<slug>           # имя обёртки: EPIC-... или TASK-<DOMAIN>-AD-HOC
team: business | common | design | product | seo | shop | panel
po: cpo | podev | poseo | popanel | poshop
type: feature | bug | research | ops | content | design-refresh | improvement | migration
priority: P0 | P1 | P2 | P3
segment: b2c | b2b | cross | internal
phase: intake | spec | design | dev | qa | review | gate | verify | release
role: <одна или несколько ролей через запятую — кто сейчас работает>
status: backlog | in-progress | done | blocked | canceled
blocks: [US-<X>, US-<Y>]
blocked_by: [US-<Z>]
related: [US-<W>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

`epic:` обязательно для всех новых артефактов. Для исторических US (плоский
список в `specs/`) поле может отсутствовать или быть пустым.

Phase-значения по фазам §3:

| Фаза [WORKFLOW §3] | `phase:` | Типичный `role:` |
|---|---|---|
| 1. Intake | `intake` | `in` |
| 2. BA + 3. PO planning + 4. SA | `spec` | `ba`, `sa-<team>`, `cpo`, `podev`/`poseo`/`popanel`/`poshop` |
| 5. Architecture | `spec` | `tamd` (+ `dba`, `be-panel` при данных) |
| 6. Design | `design` | `art`, `ui`, `ux` (или `ux-shop`/`ux-panel`), `lp-site` |
| 7. Implementation | `dev` | `fe-<team>`, `be-<team>`, `seo-tech`, `seo-content`, `cw`, `cms`, `aemd`, `do` |
| 8. QA (team) | `qa` | `qa-<team>` |
| 9. Code Review (team) | `review` | `cr-<team>` |
| 10. Release gate | `gate` | `release` |
| 11. Verify gate | `verify` | `leadqa` |
| 12. Operator decision | `release` | (пусто — ждём оператора) |
| 13. Released | `release` + `status: done` | `cpo` (retro) |

### 7.5.3. Hand-off log внутри артефакта

В каждом артефакте поддерживается секция:

```markdown
## Hand-off log

- 2026-04-29 14:32 · `ba` → `podev`: `ba.md` готов, ожидает приоритизации в команду.
- 2026-04-29 16:10 · `podev` → `sa-site`: подняли в спринт, поручаем спеку.
```

Это заменяет Linear-комментарии. При смене фазы уходящая роль:
1. Дописывает строку в Hand-off log (timestamp + `from` → `to` + 1 фраза).
2. Обновляет frontmatter (`phase:`, `role:`, `updated:`).

### 7.5.4. Создание новой задачи

1. **`in` определяет EPIC или TASK-AD-HOC:**
   - Часть существующего эпика → кладёт в `specs/EPIC-<N>-<slug>/US-<N>-<slug>/`.
   - Новая программа из нескольких US → создаёт `specs/EPIC-<M>-<slug>/`
     с `README.md` (цель, состав US) и кладёт первый US внутрь.
   - Одиночная задача (bugfix, разовый ops, content-правка) → кладёт в
     `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/`. Если соответствующего
     `TASK-<DOMAIN>-AD-HOC/` ещё нет — создаёт. Допустимые `<DOMAIN>`:
     `INFRA`, `CONTENT`, `SEO`, `PANEL`, `SHOP`, `SITE`, `DESIGN`, `OPS`.
2. **`in`** создаёт `<выбранная-папка>/US-<N>-<slug>/intake.md` с frontmatter
   (`epic:`, `phase: intake`, `role: in`, `status: backlog`).
3. **`in`** добавляет строку в `team/backlog.md` (одна строка, человеко-читаемая).
4. После approve оператором — передача `→ ba`. `ba` начинает `ba.md` и обновляет
   frontmatter intake-артефакта (`phase: spec`, `role: ba`).
5. Cross-team задачи фиксируются в `related:` / `blocked_by:` обоих
   `sa-<team>.md` файлов.

### 7.5.5. Что НЕ делаем

- Не используем внешние трекеры (Linear, Jira, GitHub Projects, Trello).
- Не дублируем `intake.md` / `ba.md` в README или wiki — только репозиторий.
- Не ведём состояние задачи в чате — фактическое состояние = frontmatter
  артефакта. Чат — операторские решения и hand-off-сообщения.
- Не создаём задачу без `in` (формальный intake обязателен).
- Не кладём новые US напрямую в `specs/` без EPIC или TASK-AD-HOC обёртки.
- Не деплоим до апрува оператора.

---

## 8. Использование глобальных скилов

**Правило:** каждый агент **обязан** использовать скилы из `~/.claude/skills/`,
которые относятся к его зоне ответственности и применимы к текущей задаче.

### 8.1. Как это работает

1. В frontmatter каждого агента (`skills: [...]`) зафиксирован **его персональный
   набор**.
2. В теле агента — раздел `## Skills`, где каждый скил расписан.
3. При получении задачи агент **перед имплементацией** активирует 1–3 самых
   релевантных скила через `Skill` tool.
4. Если для задачи нужен скил из **чужой зоны ответственности** — агент
   эскалирует через PO команды.

### 8.2. Матрица «роль → ключевые скилы» (новая модель, 42 роли)

Полная матрица — в `~/.claude/CLAUDE.md` (раздел *Auto-Skill Selection by
Context*). Базовые назначения по командам:

| Команда / роль | Ключевые скилы |
|----------------|----------------|
| **business/in** | `search-first`, `codebase-onboarding` |
| **business/ba** | `product-capability`, `product-lens`, `market-research`, `deep-research` |
| **business/re** | `deep-research`, `exa-search`, `market-research` |
| **business/cpo** | `product-capability`, `product-lens`, `blueprint`, `project-flow-ops` |
| **business/aemd** | `dashboard-builder`, `knowledge-ops` |
| **business/da** | `postgres-patterns`, `clickhouse-io`, `dashboard-builder` |
| **common/tamd** | `architecture-decision-records`, `hexagonal-architecture`, `api-design`, `postgres-patterns`, `docker-patterns`, `deployment-patterns`, `nextjs-turbopack` |
| **common/dba** | `postgres-patterns`, `database-migrations`, `security-review` |
| **common/do** | `docker-patterns`, `deployment-patterns`, `github-ops`, `terminal-ops`, `canary-watch` |
| **common/release** | `verification-loop`, `product-lens`, `deployment-patterns` |
| **common/leadqa** | `verification-loop`, `e2e-testing`, `browser-qa`, `accessibility`, `ai-regression-testing` |
| **design/art** | `brand`, `brand-voice`, `design`, `design-system`, `ui-ux-pro-max` |
| **design/ux** | `ui-ux-pro-max`, `accessibility`, `design-system` |
| **design/ui** | `ui-ux-pro-max`, `ui-styling`, `design-system`, `accessibility`, `frontend-design` |
| **product/podev** | `product-capability`, `product-lens`, `blueprint`, `project-flow-ops` |
| **product/sa-site** | `api-design`, `architecture-decision-records`, `hexagonal-architecture` |
| **product/be-site** | `backend-patterns`, `api-design`, `postgres-patterns`, `tdd-workflow`, `nextjs-turbopack`, `claude-api` |
| **product/fe-site** | `frontend-patterns`, `frontend-design`, `nextjs-turbopack`, `ui-styling`, `e2e-testing`, `accessibility`, `tdd-workflow` |
| **product/lp-site** | `frontend-design`, `ui-ux-pro-max`, `brand-voice` |
| **product/pa-site** | `dashboard-builder`, `product-lens` |
| **product/cr-site** | `coding-standards`, `security-review`, `simplify`, `plankton-code-quality` |
| **product/qa-site** | `e2e-testing`, `browser-qa`, `click-path-audit`, `ai-regression-testing` |
| **seo/poseo** | `seo`, `product-capability`, `project-flow-ops` |
| **seo/sa-seo** | `seo`, `architecture-decision-records`, `api-design` |
| **seo/seo-content** | `seo`, `content-engine`, `deep-research` |
| **seo/seo-tech** | `seo`, `frontend-patterns`, `nextjs-turbopack` |
| **seo/cw** | `article-writing`, `brand-voice`, `content-engine`, `seo` |
| **seo/cms** | `knowledge-ops`, `content-engine` |
| **shop/poshop** | `product-capability`, `product-lens`, `project-flow-ops` |
| **shop/sa-shop** | `api-design`, `architecture-decision-records` |
| **shop/be-shop** | `backend-patterns`, `api-design`, `postgres-patterns`, `tdd-workflow`, `nextjs-turbopack` |
| **shop/fe-shop** | `frontend-patterns`, `nextjs-turbopack`, `ui-styling`, `e2e-testing` |
| **shop/ux-shop** | `ui-ux-pro-max`, `accessibility`, `design-system` |
| **shop/cr-shop** | `coding-standards`, `security-review`, `plankton-code-quality` |
| **shop/qa-shop** | `e2e-testing`, `browser-qa`, `click-path-audit` |
| **panel/popanel** | `product-capability`, `product-lens`, `project-flow-ops` |
| **panel/sa-panel** | `api-design`, `architecture-decision-records` |
| **panel/be-panel** | `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations`, `tdd-workflow` |
| **panel/fe-panel** | `frontend-patterns`, `ui-styling`, `accessibility` |
| **panel/ux-panel** | `ui-ux-pro-max`, `accessibility`, `design-system` |
| **panel/cr-panel** | `coding-standards`, `security-review`, `plankton-code-quality` |
| **panel/qa-panel** | `e2e-testing`, `browser-qa`, `accessibility` |

> При добавлении новых скилов в `~/.claude/skills/` — `cpo` решает, кому какие
> добавить в персональный список (через PO команды).

---

## 9. Release Notes — формат

### 9.1. RC checklist (release)

Файл: `team/release-notes/RC-<N>.md`. Владелец — **release**.

```markdown
# RC-<N>: <заголовок>

**US:** US-<N>
**Команда:** business / common / design / product / seo / shop / panel
**PR:** <url>
**Ветка:** <integration-branch>
**Дата RC:** YYYY-MM-DD

## Соответствие BA
- [ ] Цель из `ba.md` достигнута
- [ ] Open questions закрыты

## Соответствие SA
- [ ] AC-1..N — реализованы (с ссылками на код)
- [ ] DoD выполнен
- [ ] NFR (CWV, a11y, SEO) — в зелёной зоне

## Готовность артефактов
- [x] cr-<team> approve
- [x] qa-<team> pass
- [ ] Миграции (dba + be-panel) подтверждены (если применимо)

## Передача leadqa
Branch для verify: <…>
Команды развёртывания: <…>
```

### 9.2. Verify report (leadqa)

Файл: `team/release-notes/leadqa-<N>.md`. Владелец — **leadqa**.

```markdown
# leadqa-<N>: verify report

**RC:** RC-<N>
**Дата verify:** YYYY-MM-DD

## Smoke
- [ ] основные сценарии прошли

## Дизайн
- [ ] соответствие `design-system/brand-guide.html`
- [ ] токены без отклонений

## Функциональные NFR
- [ ] CWV (LCP, INP, CLS)
- [ ] a11y (WCAG 2.2 AA)

## Решение
**Передача оператору:** approve / conditional / reject (с обоснованием)
```

### 9.3. Release note (cpo, post-release)

Файл: `team/release-notes/<N>.md`. Владелец — **cpo**.

```markdown
# <N>: <заголовок>

**Статус:** Released / Rolled back
**Дата релиза:** YYYY-MM-DD
**Автор RN:** cpo
**US:** US-<N>
**Ветка:** <git-branch>
**Коммит / PR:** <sha / url>
**RC:** team/release-notes/RC-<N>.md
**Verify:** team/release-notes/leadqa-<N>.md

## Что изменилось
<2–5 пунктов, языком пользователя>

## Зачем
<бизнес-цель из ba.md, метрика, которую двигаем>

## Acceptance Criteria (из sa-<team>.md)
- [x] AC-1 — <описание>
- [x] AC-2 — <описание>

## Исполнители
- BA: ba
- SA: sa-<team>
- Design: art, ui, ux (или ux-shop / ux-panel)
- Dev: fe-<team>, be-<team>, seo-tech (мета), aemd (события)
- Schema (если миграции): be-panel, dba
- QA: qa-<team>
- CR: cr-<team>
- Release gate: release
- Verify gate: leadqa
- Deploy: do

## Риски и follow-ups
- <известные ограничения>
- <что в бэклоге на следующие релизы>

## Метрики для мониторинга post-release
- <aemd event / da query / pa-site cohort>
```

---

## 10. Сервисные роли: IN, RELEASE, LEADQA

### 10.1. IN (Intake Manager)

**Папка:** `business/`. **Подчинение:** `cpo`.

**Мандат:** принять сырой запрос оператора и превратить в бриф, достаточный для
работы BA. Не добавляет решений, только структурирует.

**Входы:** свободный текст оператора (в чате, голосом, ссылкой на документ).

**Выходы:** `specs/US-<N>-<slug>/intake.md`:

- Исходный текст оператора (как получено).
- Резюме запроса в 2–4 предложения.
- Тип задачи: `bug` / `feature` / `research` / `ops` / `content` /
  `design-refresh` / `migration`.
- Срочность: `blocker` / `high` / `normal` / `low`.
- Открытые вопросы к оператору (если есть) — до передачи `→ ba` дождаться
  ответов.
- Исходный контекст: ссылки на `contex/*.md`, предыдущие US, файлы в `site/` /
  `apps/shop/`, мокапы, `design-system/`.

### 10.2. RELEASE (Release Engineer / gate)

**Папка:** `common/`. **Подчинение:** `tamd`.

**Мандат:** последний фильтр **до** прогона leadqa. Сверяет реализацию с
бизнес-требованиями + спекой + AC + DoD + NFR. Собирает Release Candidate из
PR-ов в integration-ветках, готовит к merge в main по очереди design → panel →
shop → product.

**Входы:**
- Спеки от `sa-<team>`,
- Бизнес-анализ от `ba`,
- QA-отчёты от `qa-<team>`,
- CR-апрувы от `cr-<team>`,
- Реализация в integration-ветке.

**Выходы:** `team/release-notes/RC-<N>.md` (см. §9.1) +
- Решение: `approve RC` / `block` / `conditional approve` (с рисками).
- Передача `→ leadqa`.

### 10.3. LEADQA (Lead QA / verify gate)

**Папка:** `common/`. **Подчинение:** `tamd`.

**Мандат:** независимый verify перед оператором. Разворачивает RC локально,
прогоняет smoke + дизайн + функ/нефунк + a11y. Не повторяет AC-проверку — это
работа `qa-<team>`. Ловит то, что может проходить в команде, но падать в
интеграции (cross-team конфликты, regression в admin, поломка дизайн-токенов).

**Входы:**
- RC от `release`,
- Доступ к integration-веткам,
- Локальное окружение (`pnpm install`, Postgres, Payload).

**Выходы:** `team/release-notes/leadqa-<N>.md` (см. §9.2):

- Smoke-результат,
- Дизайн-сверка,
- Функциональные/нефункциональные результаты,
- a11y-чек,
- Решение: `approve` / `block` / `conditional`,
- Summary для оператора в 5–7 строк.

---

## 11. Инварианты проекта (жёсткие)

Эти инварианты наследуются от [CLAUDE.md](../CLAUDE.md) и
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) и обязательны для каждого исполнителя:

- Контент сайта — на **русском**, код и идентификаторы — на английском.
- Кодировка — **UTF-8**.
- Код сайта услуг живёт в `site/`, магазин — в `apps/shop/`, design-system — в
  `design-system/`. Корень — только конфиги.
- Стек зафиксирован (Next.js 16 + Payload 3 + Postgres 16 + Beget). Не
  предлагать Tilda / WordPress / Bitrix / MODX / Yii. Хук
  `.claude/hooks/protect-immutable.sh` блокирует подобные запросы.
- TOV — из [contex/03_brand_naming.md](../contex/03_brand_naming.md). Анти-TOV
  слова запрещены в `site/`, `apps/shop/`, `content/`, `assets/`.
- **Design-system awareness** — все 42 роли проекта обязаны сверяться с
  [`design-system/brand-guide.html`](../design-system/brand-guide.html) перед
  любой задачей с visual / UX / копирайт / TOV-следом. Команда `team/design/`
  (`art` → `ui` / `ux`) — авторы и сопровождающие brand-guide. **TOV split:**
  `brand-guide.html` (общий, для всех) · `brand-guide.html (§15-§29)` (магазин,
  дополнительно к общему, ведёт `team/shop/`) · `brand-guide-landshaft.html`
  (услуга «Дизайн ландшафта», follow-up — пока спрашивать `art` через `cpo`).
  Анти-паттерн — использовать `contex/07_brand_system.html` или старые
  snapshot-ы (incident OBI-19 2026-04-27, PR #68 закрыт). Iron rule зашит в
  каждый ролевой файл — секция `## ⚙️ Железное правило: design-system awareness`.
- Каналы коммуникации с клиентом — Telegram + MAX + WhatsApp (Wazzup24) + телефон.
- Фокус SEO — **Яндекс** (поиск + нейро-выдачи). Google — вторичный рынок.
- **Не** коммитить `node_modules/`, `playwright-report/`, `test-results/`,
  `.env`, `*.key`, `credentials.json`, `secrets/` (часть блокируется хуком
  `protect-secrets.sh`).
- **Не** добавлять npm-зависимости без апрува `tamd` + PO команды.
- **Не** менять схему Payload-коллекций без апрува `dba` + `be-panel`.
- **Не** пушить в main с `--no-verify` и `git reset --hard` (блок хуком
  `block-dangerous-bash.sh`).
- Перед `done` — `pnpm run type-check`, `pnpm run lint`, `pnpm run format:check`,
  `pnpm run test:e2e --project=chromium` должны быть зелёными. Детали —
  [deploy/README.md](../deploy/README.md).
- Никаких финтех-следов в агентах и спеках (банк / брокер / ЦБ РФ / KYC / AML).

Нарушение = возврат задачи в работу.

---

## 12. Definition of Done (общий)

Задача считается выполненной, когда:

- [ ] Код в `site/` / `apps/shop/` / `app/(payload)/admin/` соответствует спеке
      `sa-<team>.md`.
- [ ] Все AC закрыты, что подтверждено `qa-<team>`.
- [ ] `dba` + `be-panel` одобрили миграции (если задача затрагивала Payload-схему).
- [ ] `cr-<team>` дал `approve`.
- [ ] `release` собрал RC + RC-checklist.
- [ ] `leadqa` дал `approve` после verify.
- [ ] Оператор апрувнул.
- [ ] `do` выкатил в prod + canary-watch чист.
- [ ] `cpo` написал release note `<N>.md`.
- [ ] Метрики/события для `aemd` задеплоены (если задача их вводит).
- [ ] Мета-слой обновлён `seo-tech` (если задача добавила/изменила страницы).
- [ ] CI зелёный (type-check + lint + format + build + Playwright).

---

## 13. Как вносить изменения в этот файл

- Изменения workflow — через **cpo**, с апрувом оператора.
- Новые роли — добавить в [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) +
  [README — legend.md](README%20%E2%80%94%20legend.md) + создать
  `team/<dir>/<code>.md` + обновить §1 здесь + добавить разрешённое значение
  `role:` в §7.5.2 frontmatter.
- Новая команда — обновить §1.0 (таблица команд + branch) + §6 (merge order) +
  §7.5.2 (разрешённые значения `team:`) + frontmatter всех новых артефактов.
- Исправления опечаток — любой агент, PR в одну строку.
