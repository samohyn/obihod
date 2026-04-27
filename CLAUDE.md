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
> Категории и URL — preliminary, фиксируются `ba` + `po` отдельным US.

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
├── devteam/         # 28 ролевых AI-агентов + WORKFLOW + PROJECT_CONTEXT
│   ├── PROJECT_CONTEXT.md   # единый контекст для всех агентов
│   ├── WORKFLOW.md          # пайплайн задачи intake → release
│   ├── README — legend.md   # легенда команды (от оператора)
│   ├── <code>.md            # 28 агентов: in, ba, po, sa, tamd, art, ux, ui,
│   │                        #   fe1, fe2, be1, be2, be3, be4, cr, qa1, qa2,
│   │                        #   cw, seo1, seo2, lp, aemd, da, pa, do, re,
│   │                        #   dba, out
│   ├── specs/US-<N>-<slug>/ # intake.md, ba.md, sa.md, qa.md, cr.md, out.md
│   ├── adr/ADR-<N>-<slug>.md
│   └── release-notes/US-<N>-<slug>.md
├── contex/          # Стратегические артефакты (нумерация 01_, 02_, …)
├── site/            # Код сайта (Next.js 16 + Payload 3) — живой prod
├── content/         # Копия/тексты для лендингов (MDX/JSON) — TODO
├── assets/          # Медиа: фото объектов, видео-кейсы, логотипы — TODO
└── CLAUDE.md        # Этот файл
```

**Правила файлов:**
- Новые стратегические артефакты → в `contex/` с номером `05_…`, `06_…` по порядку
- Не переименовываем `contex/` → `context/` пока оператор явно не попросит
- Команда проекта живёт в [devteam/](devteam/) — 28 ролей, адаптированных под
  домен Обихода. Единый контекст для агентов — в
  [devteam/PROJECT_CONTEXT.md](devteam/PROJECT_CONTEXT.md). Пайплайн — в
  [devteam/WORKFLOW.md](devteam/WORKFLOW.md). Исходная легенда от оператора —
  в [devteam/README — legend.md](devteam/README%20%E2%80%94%20legend.md).
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

Команда — 28 ролей в [devteam/](devteam/), все на `opus-4-6` с
`reasoning_effort: max`. Hand-off, RACI, Linear-интеграция (workspace `samohyn`,
team key **OBI**) — в [devteam/WORKFLOW.md](devteam/WORKFLOW.md). Единый контекст
проекта — в [devteam/PROJECT_CONTEXT.md](devteam/PROJECT_CONTEXT.md) (все агенты
ссылаются на него вместо дублирования).

**Вход для оператора — всегда `in`.** Оператор не пишет напрямую `ba`/`po`/`fe`.

**Параллель по коду:** 2 фронта (fe1, fe2), 2 бэка TypeScript (be3, be4), 2 Go-бэка
в резерве (be1, be2 — активируются по ADR от `tamd`), 2 QA (qa1, qa2). `po`
распределяет, параллель по одной задаче явно согласовывает с оператором.

**Assignee в Linear — всегда оператор.** Роль маркируется label `role:<code>`,
фаза — label `phase:<name>`.

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
