# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас

- Лендинг перенесён из прототипа в Next.js 16 (коммит `e9bb594`), живёт в [site/](../../site)
- Playwright + smoke-тесты лендинга (`dcd3b88`)
- MCP Playwright подключён на уровне проекта (`9480e19`)
- Mock-кейс с фото + страница кейса, before/after на programmatic (`c2f5072`)
- Стратегические артефакты (`contex/`) и прототип (`_/`) удалены (`eb25c74`)
- **2026-04-21**: внедрена проектная память и хуки-принуждение (`.claude/hooks/` + `.claude/memory/`)
- **2026-04-21**: установлен graphify (pipx), зарегистрированы git-хуки и PreToolUse подсказка.
  Первый `/graphify .` build — за оператором (стоит API-токенов)
- **2026-04-21**: `agents/*.md` удалены из worktree намеренно — команда собирается заново под домен.
  CLAUDE.md обновлён, ссылок на конкретные роли больше нет. Восстанавливать из HEAD не нужно
- **2026-04-22**: коммиты `ec843e8` (devteam 28 ролей, +6543 строк) и `ad9b269` (graphify
  rebuild) в local main. **Не запушены на remote** — автодеплой в prod подхватит push,
  а изменений кода сайта нет, только docs. Решение по push — за оператором
- **2026-04-22**: команда собрана в [devteam/](../../devteam/) — **28 ролей** по легенде оператора
  (`devteam/README — legend.md`). Все адаптированы под Обиход (арбористика/крыши/мусор/демонтаж),
  0 рудиментов «Хром Маркет». Все на `opus-4-6` с `reasoning_effort: max`.
  - Новые файлы: [devteam/PROJECT_CONTEXT.md](../../devteam/PROJECT_CONTEXT.md) (единый контекст для
    всех агентов — бренд/TOV/стек/услуги/гео), [devteam/WORKFLOW.md](../../devteam/WORKFLOW.md)
    (пайплайн 11 фаз, Linear OBI, assignee=оператор всегда, hand-off через `role:<code>` labels)
  - Новые агенты: [dba.md](../../devteam/dba.md) (владелец БД, миграции, бэкапы),
    [be3.md](../../devteam/be3.md) + [be4.md](../../devteam/be4.md) (TS+Next.js API routes+Payload 3,
    **активные**)
  - be1/be2 — Go-инженеры **в резерве** (активируются только по ADR от `tamd` — кандидаты:
    очередь фото→смета, биллинг B2B, интеграция с 1С)
  - Каркас: [devteam/specs/](../../devteam/specs/), [devteam/adr/](../../devteam/adr/),
    [devteam/release-notes/](../../devteam/release-notes/) с README
  - Demo-US: [US-1-seed-prod-db/intake.md](../../devteam/specs/US-1-seed-prod-db/intake.md) —
    заведён на живой блокер (пустая prod БД) для валидации контура workflow
  - [CLAUDE.md](../../CLAUDE.md) обновлён: снято устаревшее «agents/ удалён», добавлена структура
    devteam/, 28 ролей, Linear OBI, правило assignee=оператор
- **2026-04-21**: Фаза 1 CI готова. `.github/workflows/ci.yml` (type-check + lint + format + build + Playwright).
  ESLint 9 + Prettier + Tailwind plugin настроены. 8/8 e2e зелёных локально в CI-parity режиме.
  118 `no-explicit-any` как warn-baseline
- **2026-04-21**: Фаза 2 deploy подготовлена. `.github/workflows/deploy.yml` на `workflow_dispatch` +
  preflight guard по secrets. Ждёт доступы Beget — перечислены в [deploy/README.md](../../deploy/README.md)
- **2026-04-21**: CI/CD **полностью рабочий**. GitHub repo `samohyn/obihod` (приватный),
  11 secrets залиты, VPS 45.153.190.107 настроен (swap/Node22/pnpm10.33/PM2/Postgres16/nginx/Let's Encrypt),
  сайт **живой на https://obikhod.ru** (PM2 obikhod online). Deploy переведён на auto — `push: branches: [main]`
- **2026-04-21**: БД на сервере пустая — схема создаётся автоматически при push но seed ещё не прогонялся.
  `/arboristika/` и другие programmatic-роуты возвращают 404. Нужен seed перед публичным запуском
- **2026-04-21**: hardening CI/CD pass 2.
  - Server: pm2 autostart (systemd), pm2-logrotate 10M×7 + compress, /usr/local/bin/obikhod-backup.sh +
    cron 03:00 MSK (daily 7 + weekly 4, /var/backups/obikhod/)
  - Code: `/api/health` + `/api/health?deep=1` (Payload db ping), `export dynamic='force-dynamic'`
  - CI: `.next/cache` + Playwright browsers кешируются, Playwright теперь chromium + mobile-chrome
  - Deploy: пакуем `node_modules` + все рантайм-файлы на runner'е (2GB сервера мало для pnpm install),
    `pm2 delete + pm2 start --cwd current` (reload не обновляет cwd), smoke check на `/api/health?deep=1`
  - Security: `.github/workflows/security-audit.yml` (Mon 08:00 MSK pnpm audit → issue на high/critical)
  - **Schema на prod был залит одноразово** через `pg_dump --schema-only` из локальной dev БД → scp → psql.
    **TODO переход на Payload migrations** (создать site/collections/Users.ts + `payload migrate:create` +
    шаг `payload migrate` в deploy.yml перед pm2 start) — пока хак
  - Branch protection откладывается: private repo на GitHub Free не поддерживает. Варианты:
    сделать repo публичным (бесплатно) либо GitHub Pro $4/мес

## В работе

- Ничего явного в in-progress. Проверить `git status` при старте.
- `devteam/` готов к использованию — следующий запрос оператора уже можно прогонять
  через контур `in → ba → po → sa → …` как реальный US.

## Следующий шаг

- **Первый реальный прогон workflow** — US-1-seed-prod-db готов (intake.md), ждёт
  apr оператора на открытые вопросы → `ba` возьмёт в работу
- **CI/CD backlog** (отложено, см. project memory `project_cicd_backlog.md`):
  1. Branch protection — решить платформенный вопрос (public/Pro/без)
  2. Payload migrations — до первого schema change в Payload (зона `dba`+`be3/be4`)
  3. Uptime monitor — оператор заводит account (зона `do`)
  4. Seed данных — US-1 готов, ждёт старта (блокер публичного запуска)
- **Продукт** (определяется оператором):
  - 4 калькулятора (арбористика, крыши, мусор, демонтаж)
  - Форма «фото → смета» + Telegram/MAX/WhatsApp боты
  - Programmatic SEO: Раменское + Жуковский (M1 pilot)
- **Первый build graphify**: `/graphify .` в Claude Code или `graphify update .` (AST-only, без LLM)
- **Создать Linear-labels** в OBI (оператор): 28 × `role:<code>`, `phase:*`, типы, приоритеты —
  каталог в [devteam/WORKFLOW.md §7.5.3](../../devteam/WORKFLOW.md)

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — зафиксировать TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Домен (`obihod.ru`, `obixod.ru`, `obihod-servis.ru`)
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
