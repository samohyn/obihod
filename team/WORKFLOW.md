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
- **Linear:** workspace `samohyn`, **6 team keys**: `OBI` (Product сайта услуг),
  `SEO`, `DES` (Design), `DEV` (общий dev/ops), **`SHOP`** (магазин), **`PANEL`**
  (admin-панель Payload).

---

## 1. Карта команды

Полный состав — **42 роли в 7 командах**. Все агенты работают на модели
**`opus-4-6`** с `reasoning_effort: max`. Профиль каждой роли — в соответствующем
файле `team/<dir>/<code>.md` (где `<dir>` — папка команды).

### 1.0. 7 команд верхнего уровня

| Папка | Команд-роли | Lead | Integration-ветка | Linear team |
|---|---|---|---|---|
| `business/` (6) | cpo, ba, in, re, aemd, da | **cpo** (CPO) | main | OBI |
| `common/` (5) | tamd, dba, do, release, leadqa | — (shared) | main | DEV |
| `design/` (3) | art, ux, ui | **art** | `design/integration` | DES |
| `product/` (8) | podev, sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site | **podev** | `product/integration` | OBI |
| `seo/` (6) | poseo, sa-seo, seo-content, seo-tech, cw, cms | **poseo** | main | SEO |
| `shop/` (7) | poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop | **poshop** | `shop/integration` | SHOP |
| `panel/` (7) | popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel | **popanel** | `panel/integration` | PANEL |

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
[qa-X] первичная проверка ───────►│  team/specs/US-N/qa-<team>.md
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
3. Готовит артефакт: `team/specs/US-<N>-<slug>/ba.md`.
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

Артефакт: `team/specs/US-<N>-<slug>/sa-<team>.md`. Возврат `→ PO команды` →
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

В каждой команде — **по одному инженеру на роль**: `fe-<team>` (фронт),
`be-<team>` (бэк), `seo-tech` (SEO-слой), `aemd` (разметка событий, кросс-команда),
`do` (инфраструктура, shared). Коммуникация — через PO команды; напрямую между
разработчиками — только по техническим деталям внутри уже согласованной спеки.

> Если задача требует параллели (ускорение спринта) — PO команды поднимает запрос
> к `cpo`; `cpo` может временно подключить инженера из shared `common/` или
> другой команды, явно фиксируя в Linear через `role:` label.

### Фаза 8. QA

`qa-<team>` (qa-site / qa-shop / qa-panel) прогоняет по AC из спеки `sa-<team>`.
QA **не верит на слово**: даже если FE/BE говорит «проверил» — QA прогоняет
заново. Артефакт: `team/specs/US-<N>-<slug>/qa-<team>.md` (pass или bug report
с воспроизведением).

### Фаза 9. Code Review

`cr-<team>` (cr-site / cr-shop / cr-panel) проверяет: читаемость, безопасность,
соответствие `CLAUDE.md`, тесты, производительность, отсутствие мёртвого кода.
Блок / апрув. Артефакт — коммент в PR или `team/specs/US-<N>-<slug>/cr-<team>.md`.

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
| 7. Implementation         | fe-`<team>`, be-`<team>`           | PO команды | sa-`<team>`, ui, ux, seo-tech, aemd, do, dba | qa-`<team>`, cr-`<team>` |
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

### 5.4. Sticky agent sessions

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

`do` создаёт Linear-issue с label `merge-conflict` и пингует **двух
соответствующих PO** (например `popanel` + `poshop` если конфликт в
`payload.config.ts`).

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
team/
├── PROJECT_CONTEXT.md       # единый контекст (все агенты ссылаются сюда)
├── WORKFLOW.md              # этот файл
├── README — legend.md       # исходная легенда команды от оператора
├── business/<code>.md       # cpo, ba, in, re, aemd, da
├── common/<code>.md         # tamd, dba, do, release, leadqa
├── design/<code>.md         # art, ux, ui
├── product/<code>.md        # podev, sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site
├── seo/<code>.md            # poseo, sa-seo, seo-content, seo-tech, cw, cms
├── shop/<code>.md           # poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop
├── panel/<code>.md          # popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel
├── specs/
│   └── US-<N>-<slug>/
│       ├── intake.md        # бриф от in
│       ├── ba.md            # бизнес-анализ, требования
│       ├── sa-<team>.md     # системная спека: US, AC, UML, ERD, DoD
│       ├── qa-<team>.md     # тест-отчёт от qa-site / qa-shop / qa-panel
│       ├── cr-<team>.md     # код-ревью (если не в PR)
│       └── leadqa.md        # verify-отчёт (если делается в спеке)
├── adr/
│   └── ADR-<N>-<slug>.md    # архитектурные решения tamd
└── release-notes/
    ├── RC-<N>.md            # release candidate checklist (release)
    ├── leadqa-<N>.md        # verify-отчёт оператору (leadqa)
    └── <N>.md               # пост-релизная заметка (cpo)
```

> Папки `team/specs/US-<N>-<slug>/` сохраняются как исторические директории; в
> заголовке артефактов фиксируется `**Linear Issue:** OBI-<N>` / `SHOP-<N>` /
> `PANEL-<N>` / `SEO-<N>` / `DES-<N>` / `DEV-<N>` без `US-<N>`-дублирования.

---

## 7.5. Интеграция с Linear

Linear — **операторское окно и источник истины для беклога**. Каждая задача
зеркалируется как Issue в одной из 6 teams.

### 7.5.1. Linear team keys

| Team key | Команда | Что внутри |
|----------|---------|------------|
| **OBI** | business/ + product/ | Стратегия, BA, продуктовые US сайта услуг |
| **SEO** | seo/ | SEO-программа, программные посадочные, контент |
| **DES** | design/ | Design-system, токены, brand-guide |
| **DEV** | common/ | Инфра, ADR, RC, deploy, merge-conflicts |
| **SHOP** | shop/ | Магазин саженцев (`apps/shop`) |
| **PANEL** | panel/ | Admin Payload, коллекции, RBAC |

Cross-team задачи — sub-issue в нужных teams через `parentId`. Hand-off между
teams — через relations `blocks` / `blocked by`.

### 7.5.2. Что где живёт

| Слой | Где | Владелец |
|------|-----|----------|
| Беклог (приоритизация, статусы) | Linear (OBI/SEO/DES/DEV/SHOP/PANEL) | соответствующий PO команды; кросс-команда — cpo |
| Артефакты (intake, ba, sa-`<team>`, qa-`<team>`, cr-`<team>`) | `team/specs/US-<N>-<slug>/` | соответствующие роли |
| ADR | `team/adr/` | tamd |
| Research | `team/specs/US-<N>-<slug>/re.md` или `team/research/` | re |
| RC + leadqa report | `team/release-notes/RC-*.md`, `team/release-notes/leadqa-*.md` | release / leadqa |
| Release notes | `team/release-notes/<N>.md` | cpo |
| История hand-off-ов | Комментарии в Linear Issue | все роли |

Правило: **Linear не дублирует содержимое артефактов**. В description Issue —
резюме + ссылки (относительные пути в репо).

### 7.5.3. Маппинг: фаза ↔ Linear state / labels

В каждой команде используем 4 рабочих state-а: `Backlog` / `Todo` / `In Progress`
/ `Done`. **Assignee в Linear всегда — оператор (фаундер проекта).** Роль,
ведущая задачу в текущей фазе, маркируется через label `role/<code>`. Фаза —
через label `phase/<name>`.

Между `review` и `release` добавлены два новых state-метки: **`gate`** (release
работает) и **`verify`** (leadqa). Они укладываются в Linear state `In Progress`
и различаются label `phase/*`.

| Фаза [WORKFLOW §3] | Linear state | Label `phase/*` | Label `role/*` (пример) |
|---------------------|--------------|------------|---------------------|
| 1. Intake | Backlog | `phase/intake` | `role/in` |
| 2. BA + 3. PO planning + 4. SA | In Progress | `phase/spec` | `role/ba`, `role/sa-site` (или `sa-shop` / `sa-panel` / `sa-seo`), `role/cpo`, `role/podev` (или `poseo` / `popanel` / `poshop`) |
| 5. Architecture | In Progress | `phase/spec` | `role/tamd` (+ `role/dba`, `role/be-panel` при данных) |
| 6. Design | In Progress | `phase/design` | `role/art`, `role/ui`, `role/ux` (или `ux-shop` / `ux-panel`), `role/lp-site` |
| 7. Implementation | In Progress | `phase/dev` | `role/fe-site`/`fe-shop`/`fe-panel`, `role/be-site`/`be-shop`/`be-panel`, `role/seo-tech`, `role/seo-content`, `role/cw`, `role/cms`, `role/aemd`, `role/do` |
| 8. QA (team) | In Progress | `phase/qa` | `role/qa-site` / `role/qa-shop` / `role/qa-panel` |
| 9. Code Review (team) | In Progress | `phase/review` | `role/cr-site` / `role/cr-shop` / `role/cr-panel` |
| 10. Release gate | In Progress | `phase/gate` | `role/release` |
| 11. Verify gate | In Progress | `phase/verify` | `role/leadqa` |
| 12. Operator decision | In Progress | `phase/release` | (нет role-метки — ждём оператора) |
| 13. Released | Done | `phase/release` | `role/cpo` (закрытие + retro) |
| Canceled / Parked | Canceled / Duplicate | — | — |

**Правило лейблов на hand-off:**

- `phase/*` — один активный, меняется при смене фазы.
- `role/*` — может быть **несколько одновременно**, когда несколько ролей
  работают параллельно в рамках одной фазы (например, в `phase/dev` могут висеть
  `role/fe-site` + `role/be-site` + `role/seo-tech` + `role/aemd` сразу).
- **Assignee не меняется на протяжении всего жизненного цикла Issue — всегда
  оператор.**

### 7.5.4. Каталог labels (обновлён 2026-04-28 под 42-ролевую модель)

Linear-labels организованы в **5 hierarchical групп** + плоские type-labels.

**Type-labels** (плоские, тип задачи): `Feature` · `Bug` · `Research` · `Ops` ·
`Content` · `Design Refresh` · `Improvement` · `Design System` · `Tech Debt` ·
`Migration` (специально для bulk-rename и команд-миграции).

**Priority** (плоские): `P0` (blocker) · `P1` (high) · `P2` (normal) · `P3` (low).

**Group `role`** (42 кода + cpo/leadqa/release как mutually exclusive — **одна**
ведущая роль на issue):

`in` · `ba` · `re` · `cpo` · `aemd` · `da` ·
`tamd` · `dba` · `do` · `release` · `leadqa` ·
`art` · `ux` · `ui` ·
`podev` · `sa-site` · `be-site` · `fe-site` · `lp-site` · `pa-site` · `cr-site` · `qa-site` ·
`poseo` · `sa-seo` · `seo-content` · `seo-tech` · `cw` · `cms` ·
`poshop` · `sa-shop` · `be-shop` · `fe-shop` · `ux-shop` · `cr-shop` · `qa-shop` ·
`popanel` · `sa-panel` · `be-panel` · `fe-panel` · `ux-panel` · `cr-panel` · `qa-panel`.

**Group `phase`** (одна метка одновременно): `intake` · `spec` (объединение
ba + sa-`<team>` + PO команды + tamd) · `design` · `dev` · `qa` · `review` (cr) ·
**`gate`** (release) · **`verify`** (leadqa) · `release`.

**Group `segment`** (одна метка): `b2c` · `b2b` · `cross` · `internal` (для
panel/internal-tools).

**Group `epic`** (одна или несколько меток для группировки): `us-3..us-15` · …
актуальный список ведёт `cpo`.

**Минимальный набор labels на каждом issue (6):** Priority + Type + epic + role +
phase + segment.

### 7.5.5. Bulk-rename labels (миграция 30→42 ролей)

При миграции старые role-labels пересажены на новые. Это **контекст для
документа**, не runtime-команда — переименование выполняется отдельным US за
`do` + `cpo`.

| Старый label | Новый label |
|---|---|
| `role:po` | `role:cpo` + `role:podev` (split — старые задачи сайта получают `podev`, кросс-командные — `cpo`) |
| `role:out` | `role:release` (acceptance-функция переехала в release-gate) |
| `role:fe1` / `role:fe2` | `role:fe-site` (если задача про сайт услуг) или `role:fe-shop` / `role:fe-panel` |
| `role:be3` / `role:be4` | `role:be-site` / `role:be-panel` / `role:be-shop` (по контексту) |
| `role:be1` / `role:be2` (Go-резерв) | `role:be-site` (резерв снят, Go-инженеров нет в новой структуре) |
| `role:qa1` / `role:qa2` | `role:qa-site` / `role:qa-shop` / `role:qa-panel` |
| `role:seo1` | `role:seo-content` |
| `role:seo2` | `role:seo-tech` |
| `role:sa` | `role:sa-site` / `role:sa-shop` / `role:sa-panel` / `role:sa-seo` |
| `role:cr` | `role:cr-site` / `role:cr-shop` / `role:cr-panel` |

**Новые labels к созданию:** `role:leadqa`, `role:release`, `role:poseo`,
`role:popanel`, `role:poshop`, `role:cpo`, `role:podev`, `role:ux-shop`,
`role:ux-panel`, `role:pa-site`, `role:cms`, и все `role:*-shop`, `role:*-panel`,
`role:*-seo`, `role:*-site`. Plus phase-метки `gate` + `verify`.

### 7.5.6. Правила работы с Issue

1. **Создание.** `in` создаёт Issue при оформлении `intake.md` в team **OBI**
   (по умолчанию). Если сразу понятно, что задача shop/panel/seo — `cpo` после BA
   переносит в нужную team. Title = `<семантический заголовок>` (без `US-<N>:`
   префикса). State = Backlog. **Assignee = оператор.** Labels (минимум 6):
   priority + type + `epic/us-<N>` (если эпик) + `role/in` + `phase/intake` +
   `segment/<…>`.
2. **Описание.** Description Issue — шаблон из §7.5.7.
3. **Hand-off.** Каждый переход между ролями фиксируется комментарием в Issue:
   «`ba` → `cpo`: `ba.md` готов, pending approve», со ссылкой на коммит / файл.
4. **Смена фазы.** При переходе в следующую фазу текущий исполнитель меняет
   `phase/*`, снимает свой `role/*`, добавляет `role/*` новой роли. **Assignee
   не трогаем.**
5. **Параллель по коду.** В `phase/dev` могут висеть несколько `role/*` —
   например, `role/fe-site` + `role/be-site` + `role/seo-tech` + `role/aemd`
   одновременно.
6. **Release gate.** При переходе `review → gate` команда добавляет
   `phase/gate` + `role/release`. `release` собирает RC, на success меняет на
   `phase/verify` + `role/leadqa`.
7. **Verify gate.** `leadqa` после прогона ставит `phase/release` (без role —
   ждём оператора).
8. **Закрытие.** При релизе `cpo` ставит Done, прикладывает ссылку на release
   note.
9. **Cross-team.** Sub-issue в другой team через Linear `parentId`.

### 7.5.7. Шаблон description Issue

Title пишется **без** `US-<N>:` префикса — связь с эпиком фиксируется через
`epic/us-<N>` label.

```markdown
# <семантический заголовок>

**Тип:** <Feature / Bug / Research / Ops / Content / Design Refresh / Improvement / Migration>
**Приоритет:** <P0 / P1 / P2 / P3>
**Эпик:** <us-N> (если применимо, иначе пусто или `programmatic`)
**Сегмент:** <b2c / b2b / cross / internal>
**Команда:** <OBI / SEO / DES / DEV / SHOP / PANEL>
**Lead PO:** <cpo / podev / poseo / popanel / poshop>
**Assignee:** @оператор (не меняется)

## Контекст
<2–4 предложения, бизнес-смысл>

## Артефакты (относительно корня репо)
- Intake: `team/specs/US-<N>-<slug>/intake.md`
- BA: `team/specs/US-<N>-<slug>/ba.md`
- SA: `team/specs/US-<N>-<slug>/sa-<team>.md`
- ADR (если есть): `team/adr/ADR-<M>-<slug>.md`
- QA report: `team/specs/US-<N>-<slug>/qa-<team>.md`
- RC: `team/release-notes/RC-<N>.md`
- Verify: `team/release-notes/leadqa-<N>.md`
- Release note (после релиза): `team/release-notes/<N>.md`

## Workflow
Фаза по `team/WORKFLOW.md`: <№ фазы, имя>.
Текущий статус: <одна строка>.
Активные роли: <role/X, role/Y>.

## Связи
- Parent: OBI-<X> / SHOP-<X> / PANEL-<X> (если sub-task)
- Blocks: OBI-<X>, SHOP-<Y>
- Blocked by: PANEL-<Z>
- Related: SEO-<W>
```

### 7.5.8. Инициатор каждого действия

| Действие | Делает |
|----------|--------|
| Создание Issue в Linear | `in` (при intake) |
| Перевод Issue в team SHOP/PANEL/SEO/DES | `cpo` после BA |
| Изменение `phase/*` / `role/*` при hand-off | уходящая роль |
| Комментарий-hand-off со ссылкой на артефакт | уходящая роль |
| Переход в `phase/gate` | `cr-<team>` после approve |
| Переход в `phase/verify` | `release` после RC pass |
| Переход в `phase/release` | `leadqa` после verify pass |
| Управление приоритетами Pn | PO команды (для своей team), `cpo` (для кросс) |
| Ссылки `blocks` / `blocked by` | `sa-<team>` (на уровне спеки) или PO команды (на уровне беклога) |
| Закрытие | `cpo` (при релизе) |

### 7.5.9. Что НЕ делаем в Linear

- Не меняем assignee — всегда оператор.
- Не ведём длинные дискуссии по требованиям / архитектуре — они идут в
  markdown-артефактах. В Linear — короткие hand-off-комментарии.
- Не дублируем диаграммы / код / полные спеки — только ссылки.
- Не используем Linear для заметок внутри роли — личное остаётся в md-файлах.
- Не создаём Issue без прохождения `in`.
- Не деплоим до апрува оператора (даже если в Linear `phase/release`).

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

**Linear Issue:** <OBI/SHOP/PANEL/SEO/DES/DEV>-<M>
**Команда:** <OBI / SHOP / PANEL / SEO / DES / DEV>
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
**Linear Issue:** <OBI/SHOP/PANEL/SEO/DES/DEV>-<M>
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

**Выходы:** `team/specs/US-<N>-<slug>/intake.md`:

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
  `team/<dir>/<code>.md` + обновить §1 здесь + добавить `role/<code>` в §7.5.4.
- Новая команда — обновить §1.0 (таблица команд + branch + Linear team) + §6
  (merge order) + §7.5.1 (team key) + frontmatter всех артефактов.
- Исправления опечаток — любой агент, PR в одну строку.
