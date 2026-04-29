# CLAUDE.md — Обиход

## Что это

Компания **«Обиход»** — комплексный подрядчик «порядок под ключ» для
Москвы и МО. **4 сервисных pillar** (вывоз мусора + арбористика и уход за садаом + чистка крыш от
снега + демонтаж и еще мелкие доп. услуги) + **2 расширения** (дизайн ландшафта + магазин саженцев и товаров
для сада). B2C (частные дома, дачи) + B2B (УК, ТСЖ, FM, застройщики, госзаказ).

**Главная цель сайта:** приносить квалифицированные заявки (лиды) на услуги и 
осуществлять продажи товаров и растений

## Immutable: не меняй без явного запроса оператора

| Что | Значение | Источник |
|---|---|---|
| Бренд | **ОБИХОД** (кириллица) | [03_brand_naming.md](contex/03_brand_naming.md) |
| Позиционирование | «Порядок под ключ», архетип Caregiver + Ruler | там же |
| Source of truth UI/UX + TOV (services + shop) | [design-system/brand-guide.html](design-system/brand-guide.html) v2.2 — **единственный** файл для всех 42 ролей. §1-14 services (Caregiver+Ruler), §15-29 shop (Caregiver+Sage, полная e-commerce: Identity / TOV / Lexicon / Anti-words / Voice / Витрина / Поиск / Карточка / Корзина / Чекаут B2C+B2B / Формы / Аккаунт / States / Photography / Heritage), §30-32 account & auth, §33 site-chrome canonical. brand-guide-shop.html удалён 2026-04-29 после merge. | оператор 2026-04-29 |
| Хостинг | **Beget (VPS/Cloud)** на старте; YC/Selectel при росте B2B-SLA | [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md) |
| Task tracker | Только [specs/](specs/) + `team/backlog.md`. Linear отключён 2026-04-29 | оператор |

## Железные правила (iron rules)

Нарушение = блокер релиза. Применяются ко всем 42 ролям и к Claude в основной сессии.

1. **Skill-check** — перед задачей агент сверяет `frontmatter.skills`, активирует
   нужный skill через Skill tool, фиксирует активацию в артефакте. Нет skill —
   задача не его, передаёт PO команды.
2. **Spec-before-code** — в `panel`/`product`/`shop` dev НЕ стартует без одобренной
   `sa-<team>.md`. PO держит это в DoD.
3. **Design-system awareness** — перед UI/UX/контентной/TOV-задачей сверка с
   [design-system/brand-guide.html](design-system/brand-guide.html) v2.0
   (один файл для всех — §1-14 services, §15-29 shop). Никаких «дизайнерских
   импровизаций» вне токенов.
4. **PO local-verify перед merge** — PO команды обязан развернуть PR локально и
   проверить acceptance до апрува merge. Браузер-smoke обязателен для UI.
5. **do owns green CI before merge** — `do` локально гоняет
   `type-check + lint + format:check` ДО push, оператор не видит red checks.
   Merge при зелёном CI — техоперация `do`, не оператора.
6. **Release gate** — `do` НЕ деплоит без апрува оператора. Оператор апрувит
   ТОЛЬКО после отчёта `leadqa` (`leadqa-N.md`). `leadqa` обязан разворачивать
   локально и делать real-browser smoke ДО push.

## Структура проекта

```
obikhod/
├── specs/           # Артефакты задач: EPIC-<N>-<slug>/US-<N>-<slug>/ или TASK-<DOMAIN>-AD-HOC/
├── team/            # 42 ролевых агента в 7 командах + WORKFLOW + PROJECT_CONTEXT
│   ├── PROJECT_CONTEXT.md       # единый контекст для всех агентов
│   ├── WORKFLOW.md              # пайплайн intake → release → leadqa → operator → do
│   ├── backlog.md               # cross-team таблица беклога
│   ├── business/  common/  design/  product/  seo/  shop/  panel/
│   ├── adr/                     # ADR-<N>-<slug>.md
│   └── release-notes/           # RC-N.md, leadqa-N.md, US-N.md
├── contex/          # Стратегические артефакты (01_, 02_, … — нумерация по порядку)
├── design-system/   # brand-guide.html — единый source of truth (§1-14 services, §15-29 shop, §30-32 account, §33 chrome)
├── site/            # Next.js 16 + Payload 3 (prod-код)
├── seosite/         # SEO-артефакты: keyword research, URL-map, decisions
├── apps/shop/       # E-commerce саженцев (отдельная команда, своя Postgres)
├── content/  assets/  graphify-out/  screen/
└── CLAUDE.md
```

## Память и хуки

`.claude/` — проектная память + хуки-принуждение, см. [.claude/README.md](.claude/README.md).

| Файл | Назначение |
|---|---|
| [.claude/memory/handoff.md](.claude/memory/handoff.md) | где сейчас / в работе / следующее · **обновлять в конце сессии** |
| [.claude/memory/learnings.md](.claude/memory/learnings.md) | уроки: `- YYYY-MM-DD · тема · правило · **Why:** причина` |
| [.claude/settings.json](.claude/settings.json) + [.claude/hooks/](.claude/hooks/) | конфиг и shell-хуки |

**Хуки:** `protect-secrets` (блок `.env`/`*.key`), `block-dangerous-bash` (rm -rf, force push,
`--no-verify`), `protect-immutable` (Тильда/Bitrix/WP + анти-TOV в `site/`/`content/`),
`session-bootstrap` (git + handoff + learnings на старте).

## Команда — 42 роли в 7 командах

Все на `claude-opus-4-7` (1M context, `reasoning_effort: max`). Hand-off, RACI,
артефакты — в [team/WORKFLOW.md](team/WORKFLOW.md). Контекст — в
[team/PROJECT_CONTEXT.md](team/PROJECT_CONTEXT.md).

- **business/** — `cpo` (над всеми), `ba`, `in`, `re`, `aemd`, `da`
- **common/** — `tamd`, `dba`, `do`, `release` (gate), `leadqa` (verify)
- **design/** — `art` (lead), `ux`, `ui` · ветка `design/integration`
- **product/** — `podev` + `sa-site`, `be-site`, `fe-site`, `lp-site`, `pa-site`, `cr-site`, `qa-site`
- **seo/** — `poseo` + `sa-seo`, `seo-content`, `seo-tech`, `cw`, `cms`
- **shop/** — `poshop` + `sa-shop`, `be-shop`, `fe-shop`, `ux-shop`, `cr-shop`, `qa-shop` · `apps/shop/`
- **panel/** — `popanel` + `sa-panel`, `be-panel`, `fe-panel`, `ux-panel`, `cr-panel`, `qa-panel` · ветка `panel/integration`

**Вход оператора — `in`**, прямой путь к PO разрешён (`cpo` всегда в курсе).
**Sticky sessions:** обращение `@<role>` переключает Claude в роль до явного
`/claude`, ответы префиксируются `[code]`.

**Релиз-цикл (с 2026-04-28):**
```
[команда] PR → [release] gate (RC-N.md) → [leadqa] verify локально (leadqa-N.md)
       → [operator] approve → [do] deploy → [cpo] post-release retro
```
Iron rules релиз-цикла — см. секцию «Железные правила» выше (#5, #6).

## Tech Stack

- **Frontend:** Next.js 16 (App Router, RSC, Turbopack) · TS strict · Tailwind · shadcn/ui · react-hook-form + Zod
- **CMS:** Payload 3 (embed в Next, owner — команда `panel`) — Services, Districts, LandingPages, Cases, Blog, Prices, FAQ, Leads
- **БД:** PostgreSQL 16 (services); shop — отдельная Postgres в `apps/shop`
- **Хостинг:** Beget VPS (`45.153.190.107`) + S3 + CDN + Let's Encrypt · РФ-юрисдикция, 152-ФЗ
- **Интеграции:** amoCRM (US-13) · Telegram Bot · MAX Bot · Wazzup24 · Calltouch/CoMagic · Я.Метрика + Вебмастер + Карты · Sentry
- **AI-pipeline:** Claude API (Sonnet 4.6) для «фото → смета» · prompt caching обязателен (skill `claude-api`)
- **CI/CD:** GitHub Actions (`ci.yml` PR + `deploy.yml` workflow_dispatch на Beget) · Dependabot weekly · `pnpm` + Docker Postgres локально
- **Проверки:** `type-check` + `lint` + `format:check` + `test:e2e --project=chromium` (Playwright)

**Что НЕ предлагаем:** Tilda, WordPress, Bitrix, Astro, Vercel, Strapi/Directus —
обоснование в [contex/04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md).

## Правила работы Claude

**Язык:** русский в чате, документации, коммит-сообщениях. Код, identifiers — английский.

**Автовызов skills** (1-3 на задачу, см. глобальный `~/.claude/CLAUDE.md` для полного маппинга):
| Контекст | Skills |
|---|---|
| Next.js / React / форма | `frontend-patterns`, `frontend-design`, `nextjs-turbopack`, `ui-styling` |
| Бэкенд / API / БД | `backend-patterns`, `api-design`, `postgres-patterns`, `database-migrations` |
| SEO / контент | `seo`, `article-writing` |
| Claude API (фото→смета) | `claude-api` (prompt caching обязателен) |
| Тесты / деплой | `tdd-workflow`, `e2e-testing`, `deployment-patterns`, `github-ops` |
| Безопасность | `security-review`, `security-scan` |

**Приоритет источников:** этот файл → `contex/*.md` → `design-system/` → `team/WORKFLOW.md` → код.

## Поведенческие правила (Karpathy-derived)

Эти 4 принципа уменьшают типичные LLM-ошибки. Применяй ко всем задачам.

### 1. Думай прежде чем кодить
Не делай предположений молча. Не прячь сомнения. Озвучивай tradeoffs.
- Перед реализацией — явно проговори допущения. Если неясно — спроси.
- Если есть несколько интерпретаций — покажи их, не выбирай молча.
- Если есть более простой путь — скажи. Возражай оператору когда оправдано.

### 2. Простота прежде всего
Минимальный код, который решает задачу. Ничего спекулятивного.
- Не добавляй фич сверх запрошенного.
- Не создавай абстракций для одноразового кода.
- Не делай конфигурируемость, которую не просили.
- Не обрабатывай невозможные сценарии.
- Если написал 200 строк, а можно 50 — перепиши.

### 3. Хирургические правки
Трогай только то, что должен. Убирай только свой мусор.
- Не «улучшай» соседний код, комментарии, форматирование.
- Не рефактори то, что не сломано.
- Соблюдай существующий стиль, даже если сделал бы иначе.
- Если заметил несвязанный мёртвый код — упомяни, не удаляй.
- Удаляй orphan-импорты/переменные, которые остались после ТВОИХ правок.

### 4. Цель-driven выполнение
Определи критерии успеха. Зацикливайся до проверенного результата.
- «Добавь валидацию» → «Напиши тесты на невалидный ввод, потом сделай чтобы прошли»
- «Исправь баг» → «Напиши тест, воспроизводящий его, потом сделай чтобы прошёл»
- «Отрефактори X» → «Тесты зелёные до и после»

Для multi-step задач — план: `1. шаг → verify: проверка`.

**Эти правила работают, если** в diff меньше лишних правок, реже переписываем
из-за переусложнения, уточняющие вопросы — ДО реализации, а не после ошибок.

## Запрещено в проекте

- Менять бренд / TOV / оффер / стек без явного запроса оператора в этой сессии.
- Предлагать Tilda / WordPress / Bitrix.
- Финтех-следы в агентах (банк, брокер, ЦБ РФ, KYC, AML).
- Создавать стратегические доки вне `contex/` (нумерация `05_…`, `06_…` по порядку).
- `do` деплоит без апрува оператора. Оператор апрувит ТОЛЬКО после `leadqa`.

## graphify

Граф знаний — в [graphify-out/](graphify-out/).
- Перед вопросами по архитектуре — читай [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md).
- Если есть `graphify-out/wiki/index.md` — навигируй там, не сырыми файлами.
- После правок кода — `graphify update .` (AST-only, без API-расходов).
