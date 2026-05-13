# ONBOARDING — Обиход (для второго оператора)

> Этот файл — **cold-start пакет** для Claude Code второго оператора. Открой его в первой
> сессии, и Claude получит контекст за 30 секунд. Дальше работай как обычно — основной
> source of truth остаётся `CLAUDE.md` и `team/WORKFLOW.md`.

---

## 1. Что это

Компания **«Обиход»** — комплексный подрядчик «порядок под ключ» для Москвы и МО.

- **4 сервисных pillar:** вывоз мусора · арбористика и уход за садом · чистка крыш от снега · демонтаж (+ мелкие доп.услуги)
- **2 расширения:** дизайн ландшафта · магазин саженцев и товаров для сада
- **Сегменты:** B2C (частные дома, дачи) + B2B (УК, ТСЖ, FM, застройщики, госзаказ)
- **Главная цель сайта:** квалифицированные лиды на услуги + продажи товаров/растений

**Бренд:** ОБИХОД (кириллица). Архетипы: Caregiver + Ruler (services), Caregiver + Sage (shop).

---

## 2. Что прочитать первым (по убыванию приоритета)

1. **`CLAUDE.md`** — корневые инструкции, immutable-факты, iron rules, tech stack, поведенческие правила. Самый важный файл.
2. **`team/WORKFLOW.md`** — пайплайн команд: intake → dev → qa → review → release → leadqa → operator → do.
3. **`team/PROJECT_CONTEXT.md`** — единый бизнес-контекст для всех 42 ролевых агентов.
4. **`team/backlog.md`** — текущий cross-team беклог.
5. **`design-system/brand-guide.html`** — **единственный** source of truth для UI/UX и TOV (services + shop). Никаких CSS «по памяти».
6. **`contex/01_…07_`** — стратегические артефакты (конкуренты, GTM, brand, tech stacks, IA, deploy).
7. **`specs/<EPIC|TASK>/<US>/`** — артефакты конкретных задач (sa-, dev-, qa-, cr-, RC-, leadqa-).

---

## 3. Iron rules (нарушение = блокер релиза)

1. **Skill-check** — перед задачей роль сверяет `frontmatter.skills`, активирует через Skill tool, фиксирует в артефакте.
2. **Spec-before-code** — в `panel`/`product`/`shop` dev НЕ стартует без одобренной `sa-<team>.md`.
3. **Design-system awareness** — UI/UX/TOV-задача → сверка с `design-system/brand-guide.html` v2.2 ДО кода.
4. **PO local-verify перед merge** — PO команды разворачивает PR локально и проверяет acceptance до апрува.
5. **`do` owns green CI before merge** — type-check + lint + format:check локально ДО push. Оператор не видит red checks.
6. **Release gate** — `do` НЕ деплоит без апрува оператора. Оператор апрувит ТОЛЬКО после отчёта `leadqa` (`leadqa-N.md` + real-browser smoke).
7. **PO orchestration** — PO самостоятельно переключает фазы (dev→qa→cr→gate) и подключает агентов. Сомневается — спрашивает оператора.

---

## 4. Поведенческие правила (Karpathy-derived)

1. **Думай прежде чем кодить** — озвучивай допущения и tradeoffs, не делай молчаливых выборов.
2. **Простота прежде всего** — минимальный код. Никаких спекулятивных абстракций или конфигурируемости «на будущее».
3. **Хирургические правки** — трогай только то, что должен. Не «улучшай» соседний код.
4. **Цель-driven выполнение** — критерии успеха ДО кода. Для multi-step — план `1. шаг → verify`.

---

## 5. Команда — 42 роли в 7 командах

Все агенты на `claude-opus-4-7` (1M context, `reasoning_effort: max`). Hand-off, RACI, артефакты — в `team/WORKFLOW.md`.

| Команда | Роли | Ветка |
|---|---|---|
| **business/** | `cpo` (над всеми), `ba`, `in`, `re`, `aemd`, `da` | — |
| **common/** | `tamd`, `dba`, `do`, `release` (gate), `leadqa` (verify) | — |
| **design/** | `art` (lead), `ux`, `ui` | `design/integration` |
| **product/** | `podev` + `sa-site`, `be-site`, `fe-site`, `lp-site`, `pa-site`, `cr-site`, `qa-site` | feature ветки |
| **seo/** | `poseo` + `sa-seo`, `seo-content`, `seo-tech`, `cw`, `cms` | feature ветки |
| **shop/** | `poshop` + `sa-shop`, `be-shop`, `fe-shop`, `ux-shop`, `cr-shop`, `qa-shop` | `apps/shop/` |
| **panel/** | `popanel` + `sa-panel`, `be-panel`, `fe-panel`, `ux-panel`, `cr-panel`, `qa-panel` | `panel/integration` |

**Вход оператора — `in`**, прямой путь к PO разрешён (`cpo` всегда в курсе).
**Sticky sessions:** `@<role>` или «<role>, …» переключает Claude в роль до явного `/claude`. Ответы префиксируются `[code]`.

**Релиз-цикл (с 2026-04-28):**
```
[команда] PR → [release] gate (RC-N.md) → [leadqa] verify локально (leadqa-N.md)
       → [operator] approve → [do] deploy → [cpo] post-release retro
```

---

## 6. Tech Stack

- **Frontend:** Next.js 16 (App Router, RSC, Turbopack) · TS strict · Tailwind · shadcn/ui · react-hook-form + Zod
- **CMS:** Payload 3 (embed в Next, owner — команда `panel`) — Services, Districts, LandingPages, Cases, Blog, Prices, FAQ, Leads, Reviews, Authors
- **БД:** PostgreSQL 16 (services); shop — отдельная Postgres в `apps/shop/`
- **Хостинг:** Beget VPS (`45.153.190.107`, 2×CPU/2GB → апгрейд до 4GB при запуске shop) + S3 + CDN + Let's Encrypt · РФ-юрисдикция, 152-ФЗ
- **Интеграции:** amoCRM (US-13, blocked) · Telegram Bot · MAX Bot · Wazzup24 · Calltouch/CoMagic · Я.Метрика + Вебмастер + Карты · Sentry
- **AI:** Claude API (Sonnet 4.6) для «фото → смета» · prompt caching обязателен (skill `claude-api`)
- **CI/CD:** GitHub Actions (`ci.yml` PR + `deploy.yml` workflow_dispatch на Beget) · Dependabot weekly
- **Локально:** `pnpm` + Docker Postgres (bun есть, но не используем для Payload)
- **Проверки:** type-check + lint + format:check + Playwright (`test:e2e --project=chromium`)

**SEO-стек российский:** Keys.so + Key Collector + Just-Magic + Wordstat XML (US-4), Serpstat (US-7). **Без Ahrefs.**

**Что НЕ предлагаем:** Tilda, WordPress, Bitrix, Astro, Vercel, Strapi/Directus.

---

## 7. Текущее состояние (срез на 2026-05-08)

### Закрытые epics
- **EPIC-SITE-MANAGEABILITY** — 5/8 done (US-3..US-7). US-8 MVP без amoCRM (Payload Leads + Telegram оператору). US-9/10 в backlog.
- **EPIC-SEO-CONTENT-FILL** — закрыт 2026-05-03. PR #136 → main `7c89697` → Beget deploy SUCCESS. 174 URLs, lead capture E2E HTTP 201 + Telegram. 4/5 axes confirmed.
- **W15 launch** — production live 2026-05-03.

### В работе
- **EPIC-SEO-USLUGI** — US-1..US-4 закрыты (PR #183-#187 merged). Цель: обгон liwood/services/, 191 URL, per-US release cycle.
- **EPIC-SEO-COMPETE-3** — 12 US (W14 DoD): pagesInIndex ≥160, Topvisor visibility ≥15, organic ≥800/нед, leads ≥15/нед, AI-citation ≥4/10.
- **TASK-NEWUI-TEMPLATES-W1** — макеты newui/ × 4 (T1/T2/T3/T4) (untracked в текущей ветке).
- **PANEL-AUTH-2FA / PANEL-LEADS-INBOX / PANEL-AUDIT-LOG / PANEL-DASHBOARD-V2** и др. — команда panel.

### Текущая ветка
`seo/uslugi-us4-ci-hotfix` · last commit `ffd73cd fix(ci): EPIC-SEO-USLUGI US-4 hotfix`.

---

## 8. Запрещено в проекте

- Менять бренд / TOV / оффер / стек без явного запроса оператора в этой сессии.
- Предлагать Tilda / WordPress / Bitrix / Vercel.
- Финтех-следы в агентах (банк, брокер, ЦБ РФ, KYC, AML).
- Создавать стратегические доки вне `contex/` (нумерация `01_…07_…` строго по порядку).
- `do` деплоит без апрува оператора. Оператор апрувит ТОЛЬКО после `leadqa`.
- Параллельные dev-агенты в одной working copy → race condition. Только через `Agent.isolation: "worktree"` (incident 2026-05-01).
- Мокать БД в integration-тестах.
- Любые секреты (`.env`, `*.key`) в репо — хук `protect-secrets` блокирует.
- `rm -rf`, `git push --force`, `--no-verify` — хук `block-dangerous-bash` блокирует.

---

## 9. Локальные факты (ключевое из MEMORY первого оператора)

Эти факты **не выводятся из кода** — у второго оператора своя локальная память, эти знания нужно держать вручную или скопировать в свой `MEMORY.md` после онбординга:

- **gh CLI** установлен в `~/.local/bin/gh` (не в PATH), залогинен под `samohyn`.
- **VPS:** Beget `45.153.190.107` (2×CPU/2GB), домен `obikhod.ru`. SSH-ключ передаётся отдельно.
- **GitHub:** репо `samohyn/obihod`. Linear отключён 2026-04-29 — task tracker только `specs/` + `team/backlog.md`.
- **ИНН placeholder** `1111111111` пока юрлицо не зарегистрировано (W15 backlog).
- **brand-guide.html v2.2** — единый файл (services + shop + account + chrome). `brand-guide-shop.html` удалён 2026-04-29 после merge.
- **Тулинг:** pnpm + Docker Postgres локально. bun не для Payload.
- **`PAYLOAD_DISABLE_PUSH=1 pnpm dev`** — escape-hatch для audit_log push:true (ADR-0014 tech debt, popanel разрешит).
- **Payload select field = PostgreSQL ENUM TYPE** — миграции через `ALTER TYPE ADD VALUE IF NOT EXISTS`.
- **Payload async hooks** → fire-and-forget pattern (sync await может starve pg pool, инцидент 60min hang 2026-05-01).
- **`.env.example`** — values с пробелами/кириллицей обязательно в double quotes (incident 2026-04-28 deploy.yml exit 127).
- **Скриншоты Playwright** — всегда в `screen/`, никогда в корень.
- **mobile-first** — все макеты newui/ адаптируются под 375/414/768/1024 на каждой итерации.
- **Mandate автономного режима** — оператор разрешил серии PR без вмешательства; chained ScheduleWakeup допустим при явном мандате.

---

## 10. Setup чек-лист для второго оператора

После первого открытия в Claude Code:

- [ ] **Git:** `git clone git@github.com:samohyn/obihod.git ~/obikhod && cd ~/obikhod`
- [ ] **gh CLI:** установить и `gh auth login` (нужны права на samohyn/obihod).
- [ ] **Локальный стек:** `pnpm install` + `docker compose up -d` (Postgres) + `pnpm dev` для проверки.
- [ ] **Секреты:** запросить у первого оператора отдельным каналом (1Password / encrypted):
  - `.env.local` (Payload, БД, SMTP, Telegram bot tokens)
  - SSH-ключ к Beget VPS (`45.153.190.107`)
  - Доступы к Я.Метрика / Я.Вебмастер / Topvisor / Keys.so (не хранятся в репо)
- [ ] **Хуки Claude Code:** `.claude/settings.json` + `.claude/hooks/` — подтянутся с git pull. Проверить, что `protect-secrets` и `block-dangerous-bash` активны.
- [ ] **Память:** прочитать этот ONBOARDING.md и `CLAUDE.md`. По мере работы — выносить локальные факты в свой `MEMORY.md`.
- [ ] **Команды:** прочитать `team/WORKFLOW.md` + `team/PROJECT_CONTEXT.md`. Изучить структуру `team/<command>/`.
- [ ] **Бренд:** открыть `design-system/brand-guide.html` в браузере, прочитать §1-33.
- [ ] **Текущая работа:** `git log --oneline -20` + `cat team/backlog.md` + проверить открытые `specs/EPIC-*/`.

---

## 11. Как работать с оператором

- **Язык:** русский в чате, документации, коммит-сообщениях. Код, identifiers — английский.
- **Авто-skills:** 1-3 на задачу (см. CLAUDE.md секция «Автовызов skills» и `~/.claude/CLAUDE.md`).
- **Приоритет источников:** `CLAUDE.md` → `contex/*.md` → `design-system/` → `team/WORKFLOW.md` → код.
- **Не переспрашивать подтверждённые решения** — оператор раздражается, когда возвращаюсь к закрытым вопросам.
- **Границы оператора:** оператор не делает техзадачи (build/test/migrate/deploy), только бизнес-решения и приоритизацию беклога. Технические проверки делегируй ролям (`do`/`qa`/`dba`/`tamd`).
- **Прогресс по SEO-эпикам** — давай прогресс-блок (EPIC % / US % / axes / next step) в каждом ответе до W14 closure.

---

## 12. graphify

Граф знаний — в `graphify-out/`.
- Перед вопросами по архитектуре → `graphify-out/GRAPH_REPORT.md`.
- Если есть `graphify-out/wiki/index.md` — навигируй там, не сырыми файлами.
- После правок кода — `graphify update .` (AST-only, без API-расходов).

---

**Готов работать.** Дальнейший source of truth — `CLAUDE.md` и `team/WORKFLOW.md`.
