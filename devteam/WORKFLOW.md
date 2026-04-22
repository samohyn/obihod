# Обиход — Workflow команды

Живой регламент работы распределённой команды из **28 ролей** над сайтом
**Обиход** (арбористика, чистка крыш, вывоз мусора, демонтаж — Москва и МО).
Описывает жизненный цикл задачи от оператора до prod, зоны ответственности,
каналы коммуникации, артефакты и правило использования глобальных скилов.

> Источник истины для «кто над чем работает» и «куда передать». Приоритет при
> конфликтах: `CLAUDE.md` (корневой) → `devteam/PROJECT_CONTEXT.md` →
> `contex/*.md` → этот файл.

---

## 0. Контекст проекта

- **Продукт:** сайт [obikhod.ru](https://obikhod.ru) — подрядчик 4-в-1 для
  частных (B2C) и УК/ТСЖ/FM/застройщиков (B2B) в Москве и МО.
- **Главная метрика:** квалифицированные заявки → amoCRM → бригадир. Воронка —
  форма + 4 калькулятора + «фото → смета за 10 мин».
- **Стек:** Next.js 16 (App Router, RSC, Turbopack, TS strict) + Payload CMS 3
  + PostgreSQL 16, хостинг Beget VPS, CI/CD через GitHub Actions + PM2. Детально —
  [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md).
- **Код сайта:** `site/`. Живой prod с 2026-04-21. Блокер публичного запуска —
  пустая БД (seed не прогонялся).
- **Тесты:** Playwright (chromium + mobile-chrome) в `site/tests/`. CI-parity
  через `PLAYWRIGHT_EXTERNAL_SERVER=1`.
- **Язык:** контент — русский; код, идентификаторы, commit messages — английский.
- **Репозиторий:** `samohyn/obihod` (private), основная ветка `main`,
  автодеплой на push.
- **Linear:** workspace `samohyn`, team key **`OBI`**, проект **obikhod**.

---

## 1. Карта команды

Полный состав — **28 ролей**. Все агенты работают на модели **`opus-4-6`** с
`reasoning_effort: max`. Профиль каждой роли — в соответствующем файле
`devteam/<code>.md`.

### 1.1. Контур «вход / выход»

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **in** | Intake Manager | Оператор | Оператор (свободный текст) | Интейк-бриф → **ba** |
| **out** | Release Acceptance | Оператор | Связка `qa + cr` после выполнения | Acceptance-отчёт + summary → Оператор |

### 1.2. Аналитика и планирование

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **ba** | Business Analyst (CBAP / BABOK v3) | Оператор | **in** | Декомпозиция требований → Оператор на утверждение → **po** |
| **re** | Research Analyst | **ba** (по запросу) | **ba** (опционально) | Рыночное/конкурентное исследование → **ba** |
| **po** | Product Owner / CPO | Оператор | **ba** (согласованные требования), **sa** (спеки) | Приоритизированный беклог, US-задания команде, release notes |
| **sa** | System Analyst | **po** | **po** | Полная спека: US, AC, UML, ERD, DoD → **po** |
| **tamd** | Technical Architect (solution-level) | **po** | **po** | Уточнения архитектуры на базе зафиксированного стека, ADR → **po** + команда разработки |

### 1.3. Дизайн

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **art** | Art Director | **po** | **po** | Концепция, визуальный язык, tone of voice, референсы → **ui** / **ux** |
| **ux** | UX / Product Designer | **art** | **art** (функционально), **po** (процессно) | CJM, JTBD, IA, wireframes, usability-отчёты → **ui** / **fe1,fe2** |
| **ui** | UI Designer | **art** | **art** (функционально), **po** (процессно) | Макеты, дизайн-токены, компоненты ДС → **fe1,fe2** |
| **lp** | Landing Page / CRO | **po** | **po** | Гипотезы конверсии, структуры экранов, A/B-план → **ux** / **ui** / **cw** |

### 1.4. Разработка — frontend

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **fe1** | Senior Frontend / Fullstack (TS, Next.js 16) | **po** | **po** (спека от **sa** + макеты от **ui**) | Код фронта, тесты, отчёт → **qa1,qa2** → **cr** |
| **fe2** | Senior Frontend / Fullstack (TS, Next.js 16) | **po** | **po** | То же |

### 1.5. Разработка — backend

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **be3** | Senior Backend (TS · Next.js API routes + Payload 3) | **po** | **po** (спека от **sa**, схема от **dba**) | Код API, Payload-коллекции, миграции, тесты → **qa1,qa2** → **cr** |
| **be4** | Senior Backend (TS · Next.js API routes + Payload 3) | **po** | **po** | То же |
| **be1** | Senior Backend (Go) · **резерв** | **po** | **po** (после ADR от **tamd**) | Go-микросервис, API, RPC, тесты → **qa1,qa2** → **cr** |
| **be2** | Senior Backend (Go) · **резерв** | **po** | **po** (после ADR от **tamd**) | То же |

> **be1 / be2 — резерв.** Активируются только если `tamd` в ADR утвердил
> отдельный Go-сервис (вероятные кандидаты: очередь фото→смета, биллинг B2B,
> интеграция с 1С). До этого весь backend — внутри Next.js API routes +
> Payload силами **be3 / be4**.

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **cr** | Code Reviewer | **po** | связка `fe/be` после `qa` | Отчёт ревью, блок/апрув → **po** / **out** |

### 1.6. QA

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **qa1** | Senior QA | **po** | **po** (AC от **sa**), код от `fe/be` | Smoke + E2E + visual + edge-cases → баг-репорт или Pass → **cr** |
| **qa2** | Senior QA | **po** | **po** | То же |

### 1.7. Контент и SEO

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **cw** | Copywriter | **po** | **po** | Тексты по TOV (синхрон с **art**, **seo1**), проверка на SEO → **ui** / **fe** |
| **seo1** | SEO Strategist (Яндекс-first, нейро-SEO) | **po** | **po** | Стратегия, кластеры, URL-карта, семядро, E-E-A-T → **seo2** / **cw** |
| **seo2** | Technical SEO | **po** | **po** + артефакты **seo1** | SEO-слой кода: `generateMetadata`, JSON-LD, sitemap, robots, CWV → **fe1,fe2** |

### 1.8. Данные и аналитика

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **aemd** | Analytics Engineer | **po** | **po** | Event taxonomy, трекинг, разметка, отчёты → **fe1,fe2** (внедрение) + **da,pa** (потребители) |
| **da** | Data Analyst | **po** | **po** | SQL/Python, проверка гипотез, дашборды, A/B-выводы |
| **pa** | Product Analyst | **po** | **po** | Воронка, когорты, метрики заявок, ответ на «где мы теряем лиды» |
| **dba** | Database Administrator | **po** | **po** (по запросу от **be3/be4** или **tamd**) | Модели данных, ревью схем Payload, индексы, безопасность PG, бэкапы/рестор, согласование миграций |

### 1.9. Инфраструктура

| Код | Роль | Подчинение | Источник задач | Выход |
|-----|------|-----------|----------------|-------|
| **do** | DevOps / Site Reliability | **po** | **po** + **tamd** | CI/CD, деплой на Beget, nginx, TLS, PM2, мониторинг (Sentry/Grafana/Zabbix), бэкапы |

---

## 2. Основной pipeline

```
 Оператор
    │
    ▼
┌─────────┐
│  [IN]   │  intake-бриф: что просят, бизнес-смысл, срок, критичность
└────┬────┘
     ▼
┌─────────┐                    ┌──────────┐
│  [BA]   │ ◀── опционально ── │   [RE]   │  (рыночное исследование по запросу BA)
└────┬────┘                    └──────────┘
     ▼
 Оператор  ◀── утверждение декомпозиции BA
     │
     ▼
┌─────────┐
│  [PO]   │  приоритизация, выбор состава исполнителей
└────┬────┘
     ▼
┌─────────┐
│  [SA]   │  формальная спека: US, AC, UML Sequence, ERD, DoD
└────┬────┘
     ▼
┌─────────┐
│  [PO]   │  принимает спеку, собирает команду и ставит задачи параллельно
└────┬────┘
     ▼
 ┌───┴────────────────────────────────────────────────────────────────┐
 │          Параллельные треки (по решению PO)                        │
 │                                                                    │
 │  ┌──────────┐      ADR по уточнению архитектуры                    │
 │  │  [TAMD]  │──────(обязателен при новом контракте/подсистеме)     │
 │  └──────────┘                                                      │
 │                                                                    │
 │  ┌──────────┐      схема/индексы/миграции                          │
 │  │  [DBA]   │──────(обязателен при изменении данных)               │
 │  └──────────┘                                                      │
 │                                                                    │
 │  ┌──────────┐                                                      │
 │  │   [ART]  │──▶ [UX] (CJM, IA, wireframes)                        │
 │  └──────────┘                                                      │
 │         │                                                          │
 │         └────▶ [UI] (макеты, дизайн-токены)                        │
 │                                                                    │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
 │  │   [LP]   │  │   [CW]   │  │  [SEO1]  │  │  [AEMD]  │            │
 │  └──────────┘  └──────────┘  └────┬─────┘  └──────────┘            │
 │                                   ▼                                │
 │                              ┌─────────┐                           │
 │                              │ [SEO2]  │                           │
 │                              └─────────┘                           │
 │                                                                    │
 │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
 │  │   [FE1]  │  │   [FE2]  │  │   [BE3]  │  │   [BE4]  │            │
 │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
 │                                                                    │
 │  ┌──────────┐  ┌──────────┐                                        │
 │  │  [BE1]*  │  │  [BE2]*  │  *Go-резерв — только после ADR от TAMD │
 │  └──────────┘  └──────────┘                                        │
 │                                                                    │
 │  ┌──────────┐                                                      │
 │  │   [DO]   │──── инфраструктура / деплой / мониторинг             │
 │  └──────────┘                                                      │
 └──────────────────────────┬─────────────────────────────────────────┘
                            ▼
                      ┌──────────┐
                      │ QA1 / QA2│   прогон по AC, E2E, visual, edge
                      └─────┬────┘
                            ▼
                      ┌──────────┐
                      │   [CR]   │   код-ревью: качество, безопасность
                      └─────┬────┘
                            ▼
                      ┌──────────┐
                      │   [OUT]  │   acceptance vs бизнес-требования
                      └─────┬────┘
                            ▼
                        Оператор
                            │
                            ▼
                      ┌──────────┐
                      │   [PO]   │   release note `US-N-<slug>.md`
                      └─────┬────┘
                            ▼
                          Prod
                            │
                            ▼
                      ┌──────────┐
                      │  [DA]    │   post-release: метрики, A/B-проверка
                      │  [PA]    │   воронка, когорты
                      └──────────┘
```

---

## 3. Фазы процесса

### Фаза 1. Intake

1. Оператор пишет произвольное сообщение → **in**.
2. **in** формирует интейк-бриф:
   - формулировка задачи в 1–3 абзаца,
   - бизнес-смысл (зачем),
   - контекст (откуда растёт, что уже пробовали),
   - срок, критичность,
   - открытые вопросы к оператору.
3. Передаёт бриф `→ ba`. Без утверждения оператора **ba** в работу не берёт.

### Фаза 2. Business Analysis

1. **ba** строит трассируемость: цель → gap → требование → решение → AC.
2. При необходимости подключает **re** для рыночного/конкурентного контекста.
3. Готовит артефакт: `devteam/specs/US-<N>-<slug>/ba.md`.
4. Возвращает на **утверждение оператору**. Оператор подтверждает — передаём
   `→ po`. Не подтверждает — правки.

### Фаза 3. Product Ownership

1. **po** приоритизирует задачу по RICE/ICE относительно беклога.
2. Определяет состав команды под задачу: от «только qa1» до «все».
3. Ставит задачу **sa** на спецификацию.

### Фаза 4. System Analysis

**sa** пишет спеку по шаблону:

- User Story (As a … I want … so that …),
- Acceptance Criteria (Given/When/Then),
- Use Case / UML Sequence,
- ERD (если задевает данные — согласуется с **dba**),
- NFR (производительность, доступность, SEO, a11y),
- Definition of Done,
- Open questions.

Артефакт: `devteam/specs/US-<N>-<slug>/sa.md`. Возврат `→ po` → оператор
утверждает.

### Фаза 5. Architecture Gate (условная)

Если задача меняет границы системы, контракты API, интеграции, выбор библиотек
верхнего уровня — **tamd** даёт архитектурное решение + ADR
(`devteam/adr/ADR-<N>-<slug>.md`). Стек зафиксирован (Next.js 16 + Payload 3 +
Postgres 16 + Beget), пересмотр стека — только по явному запросу оператора.

Если задача касается данных (новая коллекция, новые поля, изменение индексов,
миграция, доступы) — **dba** параллельно с tamd даёт схему и план миграции.

Без apr `tamd` разработка не стартует. Без apr `dba` не стартуют миграции.

### Фаза 6. Design

По решению **po**: активирует **art** → **ux** → **ui**. **lp** подключается для
ключевых конверсионных экранов. **cw** синхронизируется с **art** по TOV и с
**seo1** по ключам.

### Фаза 7. Implementation

**fe1/fe2** (фронт), **be3/be4** (бэк на TS), **seo2** (SEO-слой кода), **aemd**
(разметка событий), **do** (инфраструктура) работают параллельно. **be1/be2**
подключаются только при наличии ADR от `tamd` с отдельным Go-сервисом.
Коммуникация — через **po**; напрямую между разработчиками — только по техническим
деталям внутри уже согласованной спеки.

### Фаза 8. QA

**qa1** / **qa2** прогоняют по AC из спеки **sa**. QA **не верит на слово**: даже
если FE/BE говорит «проверил» — QA прогоняет заново. Артефакт:
`devteam/specs/US-<N>-<slug>/qa.md` (pass или bug report с воспроизведением).

### Фаза 9. Code Review

**cr** проверяет: читаемость, безопасность, соответствие `CLAUDE.md`, тесты,
производительность, отсутствие мёртвого кода. Блок / апрув. Артефакт — коммент в
PR или `devteam/specs/US-<N>-<slug>/cr.md`.

### Фаза 10. Acceptance

**out** проверяет соответствие реализации исходным **бизнес-требованиям** (BA) и
**спеке** (SA). Не QA-прогон, а «сделали ли мы то, что договаривались». Пишет
summary для оператора. **po** показывает оператору demo на localhost/staging
(scrum-ритуал). Оператор принимает решение о выходе в prod.

### Фаза 11. Release

**po** пишет `devteam/release-notes/US-<N>-<slug>.md` (шаблон в §8). **do**
выкатывает (в Обиходе — автоматический push в `main`). **aemd** / **da** / **pa**
забирают метрики post-release.

---

## 4. RACI по фазам

**Обозначения:** R — Responsible (исполняет), A — Accountable (отвечает), C —
Consulted (консультирует), I — Informed (информирован).

| Фаза             | R                | A        | C                                    | I                 |
|------------------|------------------|----------|--------------------------------------|-------------------|
| 1. Intake        | in               | Оператор | —                                    | ba                |
| 2. BA            | ba               | Оператор | re                                   | po                |
| 3. PO planning   | po               | Оператор | ba, tamd                             | вся команда       |
| 4. SA            | sa               | po       | ba, tamd, ux, ui, dba                | fe/be/qa/cr/do    |
| 5. Architecture  | tamd (+dba при данных) | po | be3, be4, do, seo2                   | fe1, fe2, sa      |
| 6. Design        | art → ux, ui     | po       | ba, ux, cw, seo1, lp                 | fe1, fe2          |
| 7. Implementation| fe1/2, be3/4 (be1/2 при ADR) | po | sa, ui, ux, seo2, aemd, do, dba      | qa1, qa2, cr      |
| 8. QA            | qa1 / qa2        | po       | sa, fe/be                            | cr, out           |
| 9. Code Review   | cr               | po       | fe/be, sa, dba                       | out               |
| 10. Acceptance   | out              | Оператор | ba, sa, po                           | вся команда       |
| 11. Release      | do (выкатка), po (RN) | po  | aemd, dba                            | вся команда       |
| 12. Post-release | da, pa, aemd     | po       | —                                    | Оператор, команда |

---

## 5. Каналы коммуникации и эскалации

### 5.1. Кто с кем общается напрямую

- **Оператор ↔ in, ba, po, out** — прямой канал.
- **po ↔ вся команда** — po единая точка контакта для исполнителей.
- **sa ↔ ba, tamd, dba, ui, ux** — напрямую по уточнениям требований/данных.
- **art ↔ ui, ux, cw** — напрямую по визуалу и TOV.
- **seo1 ↔ seo2, cw** — напрямую по стратегии/реализации.
- **fe ↔ be, ui, seo2, aemd** — напрямую по техническим деталям **внутри** уже
  согласованной спеки. Изменение scope → через po.
- **be3/be4 ↔ dba** — напрямую по схемам, индексам, миграциям Payload/Postgres.
- **qa ↔ fe, be, sa** — напрямую по воспроизведению багов.

### 5.2. Эскалация

```
Исполнитель → po → Оператор
tamd / cr / dba (блокирующее решение) → po → Оператор
ba (противоречие в требованиях) → Оператор
```

### 5.3. Запрещено

- Обход **po** при изменении scope задачи.
- Обход **cr** при мерже в main.
- Обход **out** при релизе в prod.
- Обход **dba** при изменении схемы БД / миграциях / индексах.
- Прямой диалог оператора с исполнителем (fe/be/qa/…) — всегда через `in` или `po`.

---

## 6. Артефакты и папки

```
devteam/
├── PROJECT_CONTEXT.md       # единый контекст (все агенты ссылаются сюда)
├── WORKFLOW.md              # этот файл
├── README — legend.md       # исходная легенда команды от оператора
├── <code>.md                # 28 файлов с профилями ролей
├── specs/
│   └── US-<N>-<slug>/
│       ├── intake.md        # бриф от in
│       ├── ba.md            # бизнес-анализ, требования
│       ├── sa.md            # системная спека: US, AC, UML, ERD, DoD
│       ├── qa.md            # тест-отчёт
│       ├── cr.md            # код-ревью (если не в PR)
│       └── out.md           # accept vs business requirements
├── adr/
│   └── ADR-<N>-<slug>.md    # архитектурные решения tamd
└── release-notes/
    └── US-<N>-<slug>.md     # релизная заметка (см. §8)
```

Имя задачи: `US-<N>-<kebab-slug>`, например `US-1-seed-prod-db`. Счётчик **N**
монотонно растёт, сброс не делается.

---

## 7. Использование глобальных скилов

**Правило:** каждый агент **обязан** использовать скилы из `~/.claude/skills/`,
которые относятся к его зоне ответственности и применимы к текущей задаче.

### 7.1. Как это работает

1. В frontmatter каждого агента (`skills: [...]`) зафиксирован **его персональный
   набор** — скилы, которые он ведёт постоянно.
2. В теле агента — раздел `## Skills`, где каждый скил расписан: **когда
   применять**, **к каким задачам**.
3. При получении задачи агент **перед имплементацией**:
   - читает задачу,
   - сверяется со своим списком скилов,
   - активирует 1–3 самых релевантных **через `Skill` tool**,
   - только потом начинает работу.
4. Если для задачи нужен скил из **чужой зоны ответственности** — агент
   эскалирует через **po** (или вызывает соответствующую роль).

### 7.2. Матрица «роль → ключевые скилы»

Полная матрица — в `~/.claude/CLAUDE.md` (раздел *Auto-Skill Selection by
Context*). Ниже — базовые назначения по ролям Обихода:

| Роль   | Ключевые скилы (что закреплено в frontmatter агента) |
|--------|----|
| in     | `search-first`, `codebase-onboarding` |
| ba     | `product-capability`, `product-lens`, `market-research`, `deep-research` |
| re     | `deep-research`, `exa-search`, `market-research` |
| po     | `product-capability`, `product-lens`, `blueprint`, `project-flow-ops` |
| sa     | `api-design`, `architecture-decision-records`, `hexagonal-architecture` |
| tamd   | `architecture-decision-records`, `hexagonal-architecture`, `api-design`, `postgres-patterns`, `docker-patterns`, `deployment-patterns`, `nextjs-turbopack` |
| dba    | `postgres-patterns`, `database-migrations`, `security-review` |
| art    | `brand`, `brand-voice`, `design`, `design-system`, `ui-ux-pro-max` |
| ux     | `ui-ux-pro-max`, `accessibility`, `design-system` |
| ui     | `ui-ux-pro-max`, `ui-styling`, `design-system`, `accessibility`, `frontend-design` |
| fe1/fe2| `frontend-patterns`, `frontend-design`, `nextjs-turbopack`, `ui-styling`, `e2e-testing`, `accessibility`, `tdd-workflow` |
| be3/be4| `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations`, `tdd-workflow`, `nextjs-turbopack`, `claude-api` |
| be1/be2| `golang-patterns`, `golang-testing`, `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations`, `tdd-workflow` *(в резерве)* |
| cr     | `coding-standards`, `security-review`, `simplify`, `plankton-code-quality` |
| qa1/qa2| `e2e-testing`, `browser-qa`, `click-path-audit`, `ai-regression-testing` |
| cw     | `article-writing`, `brand-voice`, `content-engine`, `seo` |
| seo1   | `seo`, `content-engine`, `deep-research` |
| seo2   | `seo`, `frontend-patterns`, `nextjs-turbopack` |
| lp     | `frontend-design`, `ui-ux-pro-max`, `brand-voice` |
| aemd   | `dashboard-builder`, `knowledge-ops` |
| da     | `postgres-patterns`, `clickhouse-io`, `dashboard-builder` |
| pa     | `dashboard-builder`, `product-lens` |
| do     | `docker-patterns`, `deployment-patterns`, `github-ops`, `terminal-ops`, `canary-watch` |
| out    | `verification-loop`, `product-lens`, `security-review` |

> При добавлении новых скилов в `~/.claude/skills/` — `po` решает, кому какие
> добавить в персональный список.

### 7.3. Когда скил **не** применяется

- Задача слишком мелкая (1-строчная правка).
- Скил не относится к существу задачи (например, `docker-patterns` на задаче
  по копирайтингу).
- Внутри скила — процесс для стека, которого нет в проекте.

В этих случаях агент делает работу напрямую, без инициализации скила.

---

## 7.5. Интеграция с Linear

Linear — **операторское окно и источник истины для беклога**. Каждый `US-<N>` в
нашем пайплайне зеркалируется как Issue в Linear: workspace **`samohyn`**,
team/project key **`OBI`**.

> **Важно про нумерацию.** `US-<N>` (сквозная нумерация в репо) и `OBI-<M>`
> (автонумерация Linear) **не обязаны совпадать** — Linear не переиспользует
> номера архивированных / удалённых Issue, поэтому сдвиг неизбежен. Связка
> фиксируется: в Linear — через `US-<N>: ...` в title, в репо — через поле
> `**Linear Issue:** OBI-<M>` в шапке `intake.md` / `ba.md` / `sa.md`.

### 7.5.1. Что где живёт

| Слой | Где | Владелец |
|------|-----|----------|
| Беклог (приоритизация, статусы) | Linear (team OBI) | `po` |
| Артефакты (intake, ba, sa, qa, cr, out) | `devteam/specs/US-<N>-<slug>/` в репо | соответствующие роли |
| ADR | `devteam/adr/` в репо | `tamd` |
| Research | `devteam/specs/US-<N>-<slug>/re.md` или `devteam/research/` в репо | `re` |
| Release notes | `devteam/release-notes/` в репо | `po` |
| История hand-off-ов | Комментарии в Linear Issue | все роли |

Правило: **Linear не дублирует содержимое артефактов**. В description Issue —
резюме + ссылки (относительные пути в репо). Полные тексты — в markdown.

### 7.5.2. Маппинг: наша фаза ↔ Linear state / labels

В команде OBI используем 4 рабочих state-а (Backlog / Todo / In Progress / Done).
**Assignee в Linear всегда — оператор (фаундер проекта).** Роль, ведущая задачу в
текущей фазе, маркируется через label `role:<code>`. Фаза — через label
`phase:<name>`.

| Фаза [WORKFLOW §3] | Linear state | Label фазы | Label роли (пример) |
|---------------------|--------------|------------|---------------------|
| 1. Intake | Backlog | `phase:intake` | `role:in` |
| 2. BA | In Progress | `phase:ba` | `role:ba` (+ `role:re` если подключён) |
| 3. PO planning | In Progress | `phase:po` | `role:po` |
| 4. SA | In Progress | `phase:sa` | `role:sa` |
| 5. Architecture | In Progress | `phase:tamd` | `role:tamd` (+ `role:dba` при данных) |
| 6. Design | In Progress | `phase:design` | `role:art`, `role:ui`, `role:ux`, `role:lp` |
| 7. Implementation | In Progress | `phase:dev` | `role:fe1`, `role:fe2`, `role:be3`, `role:be4`, `role:seo2`, `role:aemd`, `role:do` |
| 8. QA | In Progress | `phase:qa` | `role:qa1`, `role:qa2` |
| 9. Code Review | In Progress | `phase:cr` | `role:cr` |
| 10. Acceptance | In Progress | `phase:acceptance` | `role:out` |
| 11. Released | Done | — (все `phase:*` сняты) | `role:po` (закрытие) |
| Canceled / Parked | Canceled / Duplicate | — | — |

**Правило лейблов на hand-off:**
- `phase:*` — один активный, меняется при смене фазы (старый снимается, новый
  ставится).
- `role:*` — может быть **несколько одновременно**, когда несколько ролей
  работают параллельно в рамках одной фазы (например, в `phase:dev` могут висеть
  `role:fe1`, `role:be3`, `role:seo2`, `role:aemd` сразу). Роль снимается, когда
  её часть работы завершена.
- **Assignee не меняется на протяжении всего жизненного цикла Issue — всегда
  оператор.** Это обеспечивает оператору единое inbox-окно и избавляет от ручного
  перераспределения.

### 7.5.3. Labels (единый каталог)

**Тип задачи** (из intake): `Feature` · `Bug` · `Research` · `Ops` · `Content` ·
`Design Refresh` · `Improvement`

**Критичность** (MoSCoW / приоритет): `P0` (blocker) · `P1` (high) · `P2`
(normal) · `P3` (low)

**Сегмент** (если применимо): `b2c` · `b2b`

**Фаза** (временный label, снимается после выхода из фазы): `phase:intake` ·
`phase:ba` · `phase:po` · `phase:sa` · `phase:tamd` · `phase:design` ·
`phase:dev` · `phase:qa` · `phase:cr` · `phase:acceptance`

**Роль** (кто ведёт задачу в текущей фазе, может быть несколько одновременно):
`role:in` · `role:ba` · `role:re` · `role:po` · `role:sa` · `role:tamd` ·
`role:dba` · `role:art` · `role:ux` · `role:ui` · `role:lp` · `role:fe1` ·
`role:fe2` · `role:be1` · `role:be2` · `role:be3` · `role:be4` · `role:cr` ·
`role:qa1` · `role:qa2` · `role:cw` · `role:seo1` · `role:seo2` · `role:aemd` ·
`role:da` · `role:pa` · `role:do` · `role:out` — **28 штук**.

**Технические** (накапливаются по мере проекта): `Design System`, `Tech Debt`,
`Programmatic SEO`, `Calculator`, `Photo-to-quote`, `Telegram Bot`, `MAX Bot`,
`Wazzup24`, `amoCRM`, `Payload`, `Seed`, `Migration`, …

**География** (по необходимости для programmatic-SEO задач): `geo:pilot` (7
пилотных), `geo:wave-2` (второй эшелон), `geo:full` (полное покрытие МО).

### 7.5.4. Правила работы с Issue

1. **Создание.** `in` создаёт Issue при оформлении `intake.md`. Title =
   `US-<N>: <заголовок>`. State = Backlog. **Assignee = оператор.** Labels = тип
   + приоритет + сегмент + `phase:intake` + `role:in`.
2. **Описание.** Description Issue — шаблон из §7.5.5. Полный текст задачи — в
   markdown в репо; в Issue только резюме + ссылки.
3. **Hand-off.** Каждый переход между ролями фиксируется комментарием в Issue:
   «`ba` → `po`: `ba.md` готов, pending approve», со ссылкой на коммит / файл.
4. **Смена фазы.** При переходе в следующую фазу текущий исполнитель перед
   сдачей (или `po` при планировании): меняет `phase:*`, снимает свой `role:*`,
   добавляет `role:*` новой роли / ролей. **Assignee не трогаем — остаётся
   оператор.**
5. **Параллель по коду.** В `phase:dev` могут висеть несколько `role:*` —
   например, `role:fe1 + role:be3 + role:seo2 + role:aemd` одновременно. Каждый
   исполнитель снимает свой `role:*` по готовности.
6. **Закрытие.** При релизе `po` ставит Done, прикладывает ссылку на release
   note, снимает все `phase:*` и `role:*` (кроме, при желании, `role:po` как
   отметка закрывшего).
7. **Парковка.** Если задача отправлена в бэклог надолго — возвращает state =
   Backlog, снимает `phase:*` и `role:*`, добавляет комментарий с причиной и
   ориентировочным сроком возврата.
8. **Blocked / Blocks.** Зависимости между US фиксируются через Linear relations
   (`blocks`, `blocked by`), а не только в markdown.

### 7.5.5. Шаблон description Issue

```markdown
# US-<N>: <заголовок>

**Тип:** <Feature / Bug / Research / Ops / Content / Design Refresh>
**Приоритет:** <P0 / P1 / P2 / P3>
**Сегмент:** <b2c / b2b / cross>
**Assignee:** @оператор (не меняется на протяжении жизни Issue)

## Контекст
<2–4 предложения, бизнес-смысл>

## Артефакты (относительно корня репо)
- Intake: `devteam/specs/US-<N>-<slug>/intake.md`
- BA: `devteam/specs/US-<N>-<slug>/ba.md`
- SA: `devteam/specs/US-<N>-<slug>/sa.md`
- ADR (если есть): `devteam/adr/ADR-<M>-<slug>.md`
- QA report: `devteam/specs/US-<N>-<slug>/qa.md`
- Release note (после релиза): `devteam/release-notes/US-<N>-<slug>.md`

## Workflow
Фаза по `devteam/WORKFLOW.md`: <№ фазы, имя>.
Текущий статус: <одна строка>.
Активные роли: <role:X, role:Y>.

## Связи
- Blocks: <OBI-X, OBI-Y>
- Blocked by: <OBI-Z>
- Related: <OBI-W>
```

### 7.5.6. Инициатор каждого действия

| Действие | Делает |
|----------|--------|
| Создание Issue в Linear | `in` (при intake) |
| Изменение `phase:*` / `role:*` при hand-off | уходящая роль (последний шаг перед передачей) |
| Комментарий-hand-off со ссылкой на артефакт | уходящая роль |
| Управление приоритетами Pn | `po` |
| Ссылки `blocks` / `blocked by` | `sa` (на уровне спеки) или `po` (на уровне беклога) |
| Закрытие | `po` (при релизе) |

### 7.5.7. Что НЕ делаем в Linear

- Не меняем assignee — всегда оператор.
- Не ведём длинные дискуссии по требованиям / архитектуре — они идут в
  markdown-артефактах (`ba.md`, `sa.md`, ADR). В Linear — короткие
  hand-off-комментарии.
- Не дублируем диаграммы / код / полные спеки — только ссылки.
- Не используем Linear для заметок внутри роли — личное остаётся в ноутбуке /
  своих md-файлах.
- Не создаём Issue без прохождения `in` (каждая задача начинается с intake).

---

## 8. Release Notes — формат

Файл: `devteam/release-notes/US-<N>-<slug>.md`. Владелец — **po**.

```markdown
# US-<N>: <заголовок>

**Статус:** Released / Rolled back
**Дата релиза:** YYYY-MM-DD
**Автор RN:** po
**Linear Issue:** OBI-<M>
**Ветка:** <git-branch>
**Коммит / PR:** <sha / url>

## Что изменилось
<2–5 пунктов, языком пользователя>

## Зачем
<бизнес-цель из ba.md, метрика, которую двигаем>

## Acceptance Criteria (из sa.md)
- [x] AC-1 — <описание>
- [x] AC-2 — <описание>

## Исполнители
- SA: sa
- Design: art, ui, ux
- Dev: fe1 (основной), be3 (API), seo2 (мета), aemd (события)
- DBA (если были миграции): dba
- QA: qa1
- CR: cr
- Accept: out

## Риски и follow-ups
- <известные ограничения>
- <что в бэклоге на следующие релизы>

## Метрики для мониторинга post-release
- <aemd event / da query / pa cohort>
```

---

## 9. Сервисные роли: IN и OUT

### 9.1. IN (Intake Manager)

**Мандат:** принять сырой запрос оператора и превратить в бриф, достаточный для
работы BA. Не добавляет решений, только структурирует.

**Входы:** свободный текст оператора (в чате, голосом, ссылкой на документ).

**Выходы:** `devteam/specs/US-<N>-<slug>/intake.md`:

- Исходный текст оператора (как получено).
- Резюме запроса в 2–4 предложения.
- Тип задачи: `bug` / `feature` / `research` / `ops` / `content` /
  `design-refresh`.
- Срочность: `blocker` / `high` / `normal` / `low`.
- Открытые вопросы к оператору (если есть) — до передачи `→ ba` дождаться
  ответов.
- Исходный контекст: ссылки на `contex/*.md`, предыдущие US, файлы в `site/`,
  мокапы.

### 9.2. OUT (Release Acceptance)

**Мандат:** последний фильтр перед prod. Проверяет **соответствие
бизнес-требованиям** — не код, не тесты, а факт «то ли построили».

**Входы:**

- Спека от `sa`,
- Бизнес-анализ от `ba`,
- QA-отчёт от `qa1/qa2`,
- CR-апрув от `cr`,
- Реализация (собранный сайт в stage/preview/local).

**Выходы:** `devteam/specs/US-<N>-<slug>/out.md`:

- Сверка каждого AC: фактический результат vs ожидаемый.
- Проверка NFR: производительность (CWV), a11y, SEO (метатеги, JSON-LD),
  безопасность (глазами пользователя).
- Проверка бизнес-смысла: достигает ли релиз исходной цели из `ba.md`.
- Решение: `approve` / `block` / `conditional approve` (с рисками).
- Summary для оператора в 5–7 строк.

---

## 10. Инварианты проекта (жёсткие)

Эти инварианты наследуются от [CLAUDE.md](../CLAUDE.md) и
[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) и обязательны для каждого исполнителя:

- Контент сайта — на **русском**, код и идентификаторы — на английском.
- Кодировка — **UTF-8**.
- Весь код сайта живёт в `site/`, не в корне.
- Стек зафиксирован (Next.js 16 + Payload 3 + Postgres 16 + Beget). Не
  предлагать Tilda / WordPress / Bitrix / MODX / Yii. Хук
  `.claude/hooks/protect-immutable.sh` блокирует подобные запросы.
- TOV — из [contex/03_brand_naming.md](../contex/03_brand_naming.md). Анти-TOV
  слова («услуги населению», «имеем честь», «от 1 000 ₽», «в кратчайшие сроки»,
  «индивидуальный подход») — запрещены в `site/`, `content/`, `assets/`.
- Каналы коммуникации с клиентом — Telegram + MAX + WhatsApp (Wazzup24) + телефон.
- Фокус SEO — **Яндекс** (поиск + нейро-выдачи). Google — вторичный рынок.
- **Не** коммитить `node_modules/`, `playwright-report/`, `test-results/`,
  `.env`, `*.key`, `credentials.json`, `secrets/` (часть блокируется хуком
  `protect-secrets.sh`).
- **Не** добавлять npm-зависимости без апрува `tamd` + `po`.
- **Не** менять схему БД без апрува `dba`.
- **Не** пушить в main с `--no-verify` и `git reset --hard` (блок хуком
  `block-dangerous-bash.sh`).
- Перед `done` — `pnpm run type-check`, `pnpm run lint`, `pnpm run format:check`,
  `pnpm run test:e2e --project=chromium` должны быть зелёными. Детали —
  [deploy/README.md](../deploy/README.md).
- Никаких финтех-следов в агентах и спеках (банк / брокер / ЦБ РФ / KYC / AML).

Нарушение = возврат задачи в работу.

---

## 11. Definition of Done (общий)

Задача считается выполненной, когда:

- [ ] Код в `site/` соответствует спеке `sa.md`.
- [ ] Все AC закрыты, что подтверждено QA-отчётом.
- [ ] `dba` одобрил миграции (если задача затрагивала данные).
- [ ] `cr` дал `approve`.
- [ ] `out` дал `approve`.
- [ ] Написан release note `US-<N>-<slug>.md`.
- [ ] Метрики/события для `aemd` задеплоены (если задача их вводит).
- [ ] Мета-слой обновлён `seo2` (если задача добавила/изменила страницы).
- [ ] CI зелёный (type-check + lint + format + build + Playwright).
- [ ] `po` провёл demo оператору на localhost/staging.
- [ ] Оператор уведомлён и принял.

---

## 12. Как вносить изменения в этот файл

- Изменения workflow — через **po**, с апрувом оператора.
- Новые роли — добавить в [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) +
  [README — legend.md](README%20%E2%80%94%20legend.md) + создать `<code>.md` в
  `devteam/` + обновить §1 здесь + добавить `role:<code>` в §7.5.3.
- Исправления опечаток — любой агент, PR в одну строку.
