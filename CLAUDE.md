# CLAUDE.md — Обиход

## Что это

Компания **«Обиход»** — комплексный подрядчик «порядок под ключ» для
Москвы и МО. **5 сервисных pillar** (вывоз мусора + арбористика и уход за садом + чистка крыш от
снега + демонтаж + дизайн ландшафта + мелкие доп. услуги). B2C (частные дома, дачи) + B2B
(УК, ТСЖ, FM, застройщики, госзаказ).

**Главная цель сайта:** приносить квалифицированные заявки (лиды) на услуги.

> Магазин саженцев и растений выведен из проекта 2026-05-09 (ADR-0020).
> Landshaft — 5-й pillar услуг, не extension.

## Immutable: не меняй без явного запроса оператора

| Что | Значение | Источник |
|---|---|---|
| Бренд | **ОБИХОД** (кириллица) | [03_brand_naming.md](contex/03_brand_naming.md) |
| Позиционирование | «Порядок под ключ», архетип Caregiver + Ruler | там же |
| Source of truth UI/UX + TOV | [design-system/brand-guide.html](design-system/brand-guide.html) v2.3 (после EPIC-SHOP-REMOVAL.W3) — **единственный** файл для всей команды. §1-14 services (Caregiver+Ruler), §30-32 account & auth, §33 site-chrome canonical. §15-29 shop удалены 2026-05-09 (ADR-0020). | оператор 2026-05-09 |
| Хостинг | **Beget (VPS/Cloud)** на старте; YC/Selectel при росте B2B-SLA | [04_competitor_tech_stacks.md](contex/04_competitor_tech_stacks.md) |
| Task tracker | Только [specs/](specs/) + `team/backlog.md`. Linear отключён 2026-04-29 | оператор |

## Железные правила (iron rules)

Применяются ко всем 9 ролям и к Claude в основной сессии.

1. **Skill-check** — перед задачей роль сверяет `frontmatter.skills`, активирует
   нужный skill через Skill tool. Нет skill — передаёт `po`.
2. **Design-system awareness** — перед UI/UX/контентной/TOV-задачей сверка с
   [design-system/brand-guide.html](design-system/brand-guide.html) (один файл для всех:
   §1-14 services, §30-32 auth, §33 site-chrome). Никаких «дизайнерских импровизаций» вне
   токенов. **Iron rule «brand-guide-first» (2026-05-09):** UI компоненты только из
   brand-guide; если §нет — design сначала PR в brand-guide, потом fe верстает.
3. **Green CI before merge** — `dev`/`fe` гоняют `type-check + lint + format:check`
   ДО открытия PR. `devops` мержит только при зелёном CI. Оператор не видит red checks.
4. **Real-browser smoke before merge** — `qa` разворачивает PR локально
   (`PAYLOAD_DISABLE_PUSH=1 pnpm dev`) и делает browser smoke ДО approve.
5. **Merge = qa approve + po approve + CI green** — `devops` мержит при трёх зелёных.
   Оператор апрувит только бизнес-решения (новые фичи, смена стека, деплой к клиентам).

## Структура проекта

```
obikhod/
├── specs/           # Артефакты задач: EPIC-<N>-<slug>/ или TASK-<DOMAIN>-<slug>/
│   ├── <ID>/spec.md # Story + AC + out-of-scope (минимальная спека)
│   └── _archived/   # завершённые/отменённые эпики
├── team/            # 9 ролей Scrum-команды
│   ├── po.md  dev.md  fe.md  seo.md  cw.md
│   ├── design.md  qa.md  devops.md  arch.md
│   ├── PROJECT_CONTEXT.md       # единый контекст для команды
│   ├── WORKFLOW.md              # Scrum-воркфлоу
│   ├── backlog.md               # беклог проекта
│   ├── adr/                     # ADR-<N>-<slug>.md
│   ├── archive/                 # старые роли (42 → 10 2026-05-08, → 9 2026-05-09 после shop sunset)
│   └── release-notes/           # история релизов
├── contex/          # Стратегические артефакты (01_, 02_, … — нумерация по порядку)
├── design-system/   # brand-guide.html — единый source of truth (§1-14 services, §30-32 account, §33 chrome)
├── site/            # Next.js 16 + Payload 3 (prod-код)
├── seosite/         # SEO-артефакты: keyword research, URL-map, decisions
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

## Команда — 9 ролей (Scrum)

Все на `claude-opus-4-7` (1M context, `reasoning_effort: max`).
Воркфлоу — в [team/WORKFLOW.md](team/WORKFLOW.md). Контекст — в [team/PROJECT_CONTEXT.md](team/PROJECT_CONTEXT.md).

| Роль | Зона |
|------|------|
| `po` | Беклог, спринты, acceptance |
| `dev` | Full-stack: Next.js, Payload, API, БД |
| `fe` | Frontend: компоненты, CSS, адаптив, a11y |
| `seo` | Технический SEO + контент-стратегия |
| `cw` | Тексты, TOV, Payload-публикация |
| `design` | UI/UX, brand-guide, макеты |
| `qa` | E2E тесты, code review, релизный gate |
| `devops` | CI/CD, Beget VPS, merge, деплой |
| `arch` | ADR, архитектура (on-demand) |

**Вход оператора — напрямую к `po`.** Всё остальное `po` организует сам.
**Sticky sessions:** `@po`, `@dev`, `@fe`, `@seo`, `@cw`, `@design`, `@qa`, `@devops`, `@arch` переключает Claude в роль до явного `/claude`.

**Релиз-цикл:**
```
dev/fe → PR открыт → qa verify (code review + E2E + browser smoke)
       → qa approve + po approve + CI green → devops merge + deploy
```

## Tech Stack

- **Frontend:** Next.js 16 (App Router, RSC, Turbopack) · TS strict · Tailwind · shadcn/ui · react-hook-form + Zod
- **CMS:** Payload 3 (embed в Next) — Services, Districts, ServiceDistricts, Cases, Blog, Authors, Reviews, Leads, B2BPages, Redirects, Media
- **БД:** PostgreSQL 16
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
- `devops` деплоит без трёх зелёных: qa approve + po approve + CI зелёный.

## graphify

Граф знаний — в [graphify-out/](graphify-out/).
- Перед вопросами по архитектуре — читай [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md).
- Если есть `graphify-out/wiki/index.md` — навигируй там, не сырыми файлами.
- После правок кода — `graphify update .` (AST-only, без API-расходов).
