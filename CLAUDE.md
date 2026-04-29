# CLAUDE.md — Обиход

## Что это

Проект запуска сайта **«Обиход»** — комплексный подрядчик «порядок под ключ» для
Москвы и МО. **4 сервисных pillar** (вывоз мусора + арбористика + чистка крыш от
снега + демонтаж) + **2 расширения 2026-04-27** (дизайн ландшафта + магазин
саженцев и товаров для сада). B2C (частные дома, дачи) + B2B (УК, ТСЖ, FM-операторы,
застройщики, госзаказ).

> **Порядок 4 сервисных pillar = порядок в IA сайта.** Утверждён оператором
> 2026-04-25 после Wave 2 wsfreq US-4 (вывоз мусора 161К freq, арбо 27К,
> крыши 888, демонтаж 225 — разрыв 5.86×). См.
> [seosite/04-url-map/decisions.md ADR-uМ-14](seosite/04-url-map/decisions.md).
>
> **Расширение 2026-04-27** (по запросу оператора в сессии):
> — **«Дизайн ландшафта»** — flat-link в навигации (5-е направление: проект участка,
>   планировка, посадка с гарантией приживаемости).
> — **«Магазин»** — mega-menu в навигации (6-е направление: саженцы и товары для сада,
>   preliminary 9 категорий — плодовые / колоновидные / плодовые-куст / декор-куст /
>   цветы / розы / крупномеры / лиственные / хвойные).
> Категории и URL — preliminary, фиксируются `ba` + `poshop` отдельным US.

**Главная цель сайта:** приносить квалифицированные заявки — форма + калькуляторы +
«фото → смета за 10 минут» → amoCRM → бригадир. Метрики успеха — в
[contex/02_growth_gtm_plan.md](contex/02_growth_gtm_plan.md).

## Immutable: не обсуждается, пока не решено иначе

Зафиксировано стратегическими артефактами. **Не меняй без явного запроса оператора в
текущей сессии.**

| Что | Значение | Источник |
|---|---|---|
| Бренд | **ОБИХОД** (кириллица) | [03_brand_naming.md](contex/03_brand_naming.md) |
| Позиционирование | «Порядок под ключ» | там же |
| Архетип | Caregiver + Ruler | там же |
| Ключевой оффер | Фикс-цена за объект + смета за 10 мин по фото | там же |
| B2B-крючок | Штрафы ГЖИ/ОАТИ берём на себя по договору | там же |
| Порядок pillar в IA / навигации | **Вывоз мусора → Арбористика → Чистка крыш → Демонтаж** (под wsfreq Wave 2) | [seosite/04-url-map/decisions.md ADR-uМ-14](seosite/04-url-map/decisions.md), оператор 2026-04-25 |
| Расширения навигации (2026-04-27) | **+ Дизайн ландшафта** (flat-link, 5-е направление) и **+ Магазин** (mega-menu, 6-е направление, саженцы) | оператор 2026-04-27 в сессии · brand-guide v1.7 |
| География 1-й волны | Одинцово, Красногорск, Мытищи, Химки, Истра, Пушкино, Раменское, Жуковский | [03_brand_naming.md](contex/03_brand_naming.md) + Жуковский (legend) |
| TOV | Серьёзный без казёнщины, деловой с тёплыми вкраплениями, matter-of-fact | там же |
| Vocabulary Do | «обиход», «хозяйство», «объект», «порядок», «сделаем», «приедем», «12 800 ₽ за объект» | там же |
| Vocabulary Don't | «услуги населению», «имеем честь», «от 1 000 ₽», «в кратчайшие сроки», «индивидуальный подход» | там же |
| Каналы коммуникации с клиентом | **Telegram + MAX + WhatsApp** (Wazzup24) + телефон | этот файл |
| Хостинг | **Beget (VPS/Cloud)** на старте; YC/Selectel при росте B2B-SLA | этот файл + [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md) |

Любой копирайт и коммуникация — через фильтр TOV из
[03_brand_naming.md](contex/03_brand_naming.md).

## Структура проекта

```
obikhod/
├── specs/           # Артефакты задач (вынесены из team/ 2026-04-29)
│   ├── README.md    # Обзор структуры + текущие эпики
│   ├── EPIC-<N>-<slug>/             # Крупная программа из нескольких US
│   │   ├── README.md                # Цель эпика, состав US, статусы
│   │   └── US-<N>-<slug>/           # intake, ba, sa-*, qa-*, cr-*, leadqa
│   ├── TASK-<DOMAIN>-AD-HOC/        # Одиночные задачи (bug/ops/content)
│   │   └── US-<N>-<slug>/           # та же структура артефактов
│   └── <legacy US-N-slug>/          # Исторические US до 2026-04-29 (плоско)
├── team/         # 42 ролевых AI-агента в 7 функциональных командах + WORKFLOW + PROJECT_CONTEXT
│   ├── PROJECT_CONTEXT.md   # единый контекст для всех агентов
│   ├── WORKFLOW.md          # пайплайн задачи intake → release → leadqa → operator → do
│   ├── README — legend.md   # легенда команды (от оператора)
│   ├── backlog.md           # cross-team таблица беклога (priority, status, deps)
│   ├── business/   # cpo, ba, in, re, aemd, da — оркестрация продукта
│   ├── common/     # tamd, dba, do, release, leadqa — shared, подключаются по запросу
│   ├── design/     # art (lead), ux, ui — изолированная ветка design/integration
│   ├── product/    # podev, sa-site, be-site, fe-site, lp-site, pa-site,
│   │               #   cr-site, qa-site — сайт услуг (4 pillar + ландшафт)
│   ├── seo/        # poseo, sa-seo, seo-content, seo-tech, cw, cms — SEO + контент
│   ├── shop/       # poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop,
│   │               #   qa-shop — e-commerce саженцев (apps/shop, отдельная ветка)
│   ├── panel/      # popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel,
│   │               #   qa-panel — Payload admin (источник истины: brand-guide §12)
│   ├── adr/ADR-<N>-<slug>.md
│   └── release-notes/{RC-N,leadqa-N,US-N}.md
├── contex/          # Стратегические артефакты (нумерация 01_, 02_, …)
├── site/            # Код сайта (Next.js 16 + Payload 3) — живой prod
├── content/         # Копия/тексты для лендингов (MDX/JSON) — TODO
├── assets/          # Медиа: фото объектов, видео-кейсы, логотипы — TODO
└── CLAUDE.md        # Этот файл
```

**Правила файлов:**
- Новые стратегические артефакты → в `contex/` с номером `05_…`, `06_…` по порядку
- Не переименовываем `contex/` → `context/` пока оператор явно не попросит
- Команда проекта живёт в [team/](team/) — 42 роли в 7 функциональных
  командах (business / common / design / product / seo / shop / panel),
  адаптированных под домен Обихода. Единый контекст для агентов — в
  [team/PROJECT_CONTEXT.md](team/PROJECT_CONTEXT.md). Пайплайн — в
  [team/WORKFLOW.md](team/WORKFLOW.md). Исходная легенда от оператора —
  в [team/README — legend.md](team/README%20%E2%80%94%20legend.md).
- **Артефакты задач** живут в [specs/](specs/) (вынесено из `team/specs/`
  2026-04-29). Новые US оборачиваются в `EPIC-<N>-<slug>/` (для крупных
  программ) или `TASK-<DOMAIN>-AD-HOC/` (для одиночных задач). Исторические
  US (US-1..US-12, OBI-19, PAN-9, admin-visual) остаются плоским списком
  как archeological data, не реорганизуются.
- Устаревшее правило «agents/ удалён, не восстанавливать» снято 2026-04-22 после
  адаптации команды под Обиход из легенды

## Память и хуки Claude Code

`.claude/` содержит проектную память и хуки-принуждение — см.
[.claude/README.md](.claude/README.md).

| Файл | Назначение |
|---|---|
| [.claude/memory/handoff.md](.claude/memory/handoff.md) | где сейчас / в работе / следующее · **обновлять в конце сессии** |
| [.claude/memory/learnings.md](.claude/memory/learnings.md) | уроки из корректировок оператора · строка в формате `- YYYY-MM-DD · тема · правило · **Why:** причина` |
| [.claude/settings.json](.claude/settings.json) | конфиг хуков (commit-able) |
| [.claude/hooks/](.claude/hooks/) | shell-скрипты принуждения |

**Хуки (работают всегда, не полагайся только на этот CLAUDE.md):**
- `protect-secrets.sh` — блок записи/чтения `.env`, `*.key`, `credentials.json`, `secrets/`
- `block-dangerous-bash.sh` — блок `rm -rf /`, force push на main, `git reset --hard`, `DROP TABLE`, `--no-verify`
- `protect-immutable.sh` — блок запрещённых CMS (Тильда/Bitrix/WordPress) и анти-TOV слов
  внутри `site/`, `content/`, `assets/`. Escape hatch для цитат: `obikhod:ok` в контенте
- `session-bootstrap.sh` — на старте сессии печатает git-статус + handoff + последние уроки

**Правило сессии:** в конце работы перезапиши `handoff.md` короткой сводкой, добавь
новые уроки в `learnings.md`.

## Агенты проекта

Команда — 42 роли в [team/](team/), сгруппированных по 7 функциональным
командам. Все на `opus-4-7` (`claude-opus-4-7`, 1M context) с
`reasoning_effort: max`. Hand-off, RACI, артефакты — в
[team/WORKFLOW.md](team/WORKFLOW.md). Единый контекст проекта — в
[team/PROJECT_CONTEXT.md](team/PROJECT_CONTEXT.md). Внешний task-tracker
**не используется** (Linear отключён 2026-04-29) — единственный источник
истины задачи — папка [specs/](specs/) на корне репо (новые US — внутри
обёртки `EPIC-<N>-<slug>/` или `TASK-<DOMAIN>-AD-HOC/`).

**Структура команд (7):**
- **business/** — оркестрация продукта: `cpo` (Chief PO над всеми), `ba`, `in`, `re`, `aemd`, `da`.
- **common/** — shared roles: `tamd`, `dba`, `do`, `release` (gate), `leadqa` (verify).
- **design/** — `art` (lead), `ux`, `ui`. Изолированная ветка `design/integration`.
- **product/** — сайт услуг: `podev` (PO), `sa-site`, `be-site`, `fe-site`, `lp-site`, `pa-site`, `cr-site`, `qa-site`. Ветка `product/integration`.
- **seo/** — `poseo` (PO), `sa-seo`, `seo-content`, `seo-tech`, `cw`, `cms`.
- **shop/** — e-commerce: `poshop` (PO), `sa-shop`, `be-shop`, `fe-shop`, `ux-shop`, `cr-shop`, `qa-shop`. Ветка `shop/integration`, monorepo `apps/shop/`.
- **panel/** — Payload admin: `popanel` (PO), `sa-panel`, `be-panel`, `fe-panel`, `ux-panel`, `cr-panel`, `qa-panel`. Ветка `panel/integration`. Источник истины UI — [design-system/brand-guide.html](design-system/brand-guide.html) §12.

**Вход для оператора — всегда `in`** для новой задачи. **Прямой путь к PO команды разрешён** — оператор может обращаться к любому `cpo`/`podev`/`poseo`/`popanel`/`poshop`/`art` напрямую; `cpo` всегда в курсе.

**Sticky agent sessions:** когда оператор обращается к роли (`@cpo`, «cpo, ...»), Claude переключается в эту роль и **остаётся в ней до явного переключения**. Каждый ответ в роли префиксируется `[code]` для ясности. Возврат к Claude: `/claude`, «Claude, переключись», новая сессия. Переключение между ролями (`@podev` после `@cpo`) — это смена роли, не возврат к Claude.

**Skill-check железное правило (для каждой роли):** перед тем как взять задачу, агент сверяет требования с `skills` из своего frontmatter и **активирует** релевантный skill через Skill tool, фиксируя в commit/PR/артефакте. Если skill отсутствует — задача не его, передаёт PO команды или роли с нужным skill.

**Релиз-цикл (новый, с 2026-04-28):**

```
[команда] PR → [release] gate (доки) → [leadqa] verify (локально)
       → [operator] approve → [do] deploy → [cpo] post-release retro
```

`do` НЕ деплоит без апрува оператора. Оператор апрувит ТОЛЬКО после `leadqa` отчёта. `release` выпускает `RC-N.md`, `leadqa` пишет `leadqa-N.md`. Артефакты — в `team/release-notes/`.

**Параллель по коду:** в каждой команде разработки (`product`, `shop`, `panel`) — по одному `be-*`/`fe-*`/`qa-*`/`cr-*` (без зеркал fe1/fe2). PO команды распределяет, оператор согласовывает приоритеты в спринт-планинге.

**Контент в админке** ведёт `cms` (seo/) — операционные publish/update/bulk через CLI скрипты `site/scripts/admin/`, аудит — в `team/ops/cms-changes/`. Тексты пишет `cw`, SEO-стратегию определяют `seo-content` / `seo-tech`, `cms` только применяет ТЗ.

**Owner Payload-коллекций — команда panel** (`be-panel` + `dba`). Команды product/shop читают через Payload Local API, не правят схему. Cross-team запросы на изменение схем — через `cpo` к `popanel`.

**Owner задачи — всегда оператор.** Роль, ведущая текущую фазу, и сама фаза
фиксируются в frontmatter артефактов в `specs/US-<N>-<slug>/` (`role:`,
`phase:`). Внешний tracker не ведётся.

Никаких финтех-следов в агентах (банк / брокер / ЦБ РФ / KYC / AML) — это домен
Обихода (арбористика, крыши, мусор, демонтаж, Москва и МО).

## Technology Stack (утверждено)

**Обоснование выбора** — разведка топ-13 конкурентов из
[04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md):

- 54% на WordPress/Bitrix, 23% MODX, 23% самописное PHP (Yii, legacy)
- **0 из 13** используют современный JS-стек
- У половины PHP 5.6–7.4, jQuery 1.10 — слабые Core Web Vitals
- Интерактивных калькуляторов нет ни у кого — подтверждает инсайт из
  [01_competitor_research.md](contex/01_competitor_research.md)

Для Обихода это **окно возможностей** через кастомный современный стек.

### Stack

```
Frontend:    Next.js 16 (App Router, RSC, Turbopack)
             TypeScript strict, Tailwind, shadcn/ui
             react-hook-form + Zod для форм
             собственный uploader для фото (S3-совместимый)

CMS:         Payload CMS 3 (self-hosted, embed в Next.js)
             Коллекции: Services, Districts, LandingPages,
                        Cases, Blog, Prices, FAQ, Leads

БД:          PostgreSQL 16

Хостинг:     Beget (VPS или Cloud) — MVP
             Beget S3 (медиа) + Beget CDN + Let's Encrypt
             Миграция на Yandex Cloud / Selectel — при росте B2B-SLA
             РФ-юрисдикция, 152-ФЗ compliant

Интеграции:  amoCRM (webhooks заявок)
             Telegram Bot API — основной канал (бесплатно, 95% аудитории)
             MAX Bot API (VK, экс-TamTam) — РФ-альтернатива, второй приоритет
             Wazzup24 (WhatsApp Business API) — для старшей B2C-аудитории
             Calltouch или CoMagic (колтрекинг, подмена номеров)
             Яндекс.Метрика + Вебмастер + Карты (виджет)
             Sentry (ошибки)

AI-pipeline: Claude API (Sonnet 4.6) — черновик сметы по фото
             → amoCRM комментарий → бригадир подтверждает → клиенту
             Prompt caching обязательно (skill `claude-api`)

CI/CD:       GitHub Actions:
               • ci.yml         — PR + push main: type-check + lint + format +
                                  build + Playwright E2E с Postgres service
               • deploy.yml     — workflow_dispatch на Beget (SSH + rsync + PM2
                                  reload, 5 последних релизов на сервере)
             Dependabot: weekly npm + github-actions
             Preview deploys для PR — после стабилизации prod-деплоя
```

**Качество кода:**
- `pnpm run type-check` (tsc --noEmit)
- `pnpm run lint` (eslint flat config, Next.js 16 core-web-vitals + TS rules)
- `pnpm run format:check` (prettier + prettier-plugin-tailwindcss)
- `pnpm run test:e2e --project=chromium` (Playwright, CI-parity через `PLAYWRIGHT_EXTERNAL_SERVER=1`)
- Baseline: `@typescript-eslint/no-explicit-any` временно на `warn`, убираем
  поэтапно и возвращаем на `error`. Детали деплоя — в [deploy/README.md](deploy/README.md)

**Почему Beget, а не Vercel/YC на старте:** цена ×5-10 ниже YC, РФ-юрисдикция без
вопросов, Node.js + Postgres + S3 + CDN в одной панели. Vercel — проблемы с оплатой
из РФ и юрисдикцией ПДн. YC/Selectel экономически оправданы только при B2B-контрактах
с SLA-требованиями.

**Почему не Astro:** калькуляторы state-heavy; в РФ найм на Next.js кратно проще.

**Почему Payload, а не Strapi/Directus:** единый TypeScript с Next, admin на React,
embed в Next-приложение.

Детальное обоснование и бюджет TCO — в `contex/04_competitor_tech_stacks.md` и будущем
`contex/05_tech_stack_decision.md` (создать при старте разработки).

## Правила работы Claude в проекте

### Язык

Русский — ответы, комментарии, сообщения коммитов по документации.
Код, identifiers, технические сообщения — английский.
Подтверждает глобальное правило в `~/.claude/CLAUDE.md`.

### Автовызов навыков

Перед началом задачи вызывать релевантные skills из `~/.claude/skills/`:

| Контекст задачи | Skills |
|---|---|
| Next.js / React / фронт | `frontend-patterns`, `frontend-design`, `nextjs-turbopack`, `ui-styling` |
| UI/UX решения | `ui-ux-pro-max`, `accessibility`, `design-system` |
| Бэкенд / API / БД | `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations` |
| Формы / калькуляторы / CRO | `frontend-patterns` + агент `landing-page-specialist` (планируется) |
| SEO | `seo` + агент [seo-expert](agents/seo-expert.md) |
| Claude API (фото → смета) | `claude-api` — **обязателен prompt caching** |
| Тексты под TOV | сначала [03_brand_naming.md](contex/03_brand_naming.md) → потом писать |
| Деплой / CI / Docker | `docker-patterns`, `deployment-patterns`, `github-ops` |
| Безопасность | `security-review`, `security-scan` |
| Тестирование | `tdd-workflow`, `e2e-testing`, `browser-qa` |

### Приоритет источников контекста

1. **Этот файл (CLAUDE.md)** — рамки, стек, TOV, правила
2. **`contex/*.md`** — зафиксированные стратегические решения
3. **`agents/*.md`** — роли для глубокой экспертизы при необходимости
4. Код и конвенции — по факту появления `site/`

### Поведение

- **Не предлагай Tilda/WordPress/Bitrix** — это шаг назад против конкурентов, см.
  [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md)
- **Не меняй бренд/TOV/оффер/стек** без ссылки на явный запрос оператора в текущей
  сессии
- **Новые стратегические документы** — только в `contex/` с префиксом по порядку
- **Уточняй перед реализацией**, если задача затрагивает immutable-блок
- **Каждое не-очевидное решение** — с ссылкой на источник (артефакт, ресёрч, агент)
- **Финтех-контекст запрещён в агентах.** Агенты адаптированы под домен Обихода; если
  найдёшь финтех-след (банк/брокер/ЦБ РФ/KYC/AML и т.п. в содержательном контексте) —
  это баг, зафиксируй и поправь

## Roadmap сайта (высокоуровневый, 10 недель)

| Неделя | Фаза | Итог |
|---:|---|---|
| 1-2 | Дизайн-система + модель Payload + скелет | 1 посадочная, 1 калькулятор |
| 3-4 | 4 калькулятора + форма «фото → смета» + Telegram/MAX-боты | заявки идут |
| 5-6 | amoCRM webhook + колтрекинг + Я.Метрика цели | цикл заявки замкнут |
| 7 | Programmatic SEO: 4 × 15 районов = 60+ посадочных | URL-база готова |
| 8 | CWV + тех-SEO аудит + Я.Вебмастер | Lighthouse 90+ |
| 9 | Блог + 10 seed-статей + видео-кейсы | контент-SEO база |
| 10+ | Директ-посадочные + A/B-тесты + B2B-кабинет | рост |

## Открытые вопросы

- [ ] Сохранить решение по стеку как `contex/05_tech_stack_decision.md` (TCO, альтернативы)
- [ ] Переименовать `contex/` → `context/` (косметика, не срочно)
- [ ] Подтверждение ТМ «ОБИХОД» у патентного поверенного
      (из [03_brand_naming.md](contex/03_brand_naming.md))
- [ ] Домен: проверить и купить (`obihod.ru`, `obixod.ru`, `obihod-servis.ru` и т.д.)
- [ ] Юрлицо / СРО / лицензия Росприроднадзора — чеклист в
      [01_competitor_research.md](contex/01_competitor_research.md) раздел 5
- [ ] amoCRM / Wazzup24 / Calltouch — завести аккаунты при старте разработки

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## Context Navigation
1. ВСЕГДА сначала читай graphify-out/GRAPH_REPORT.md
2. Сырые файлы открывай только если я попрошу прямо
3. Используй graph.json для точечных запросов
