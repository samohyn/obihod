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

## Следующий шаг

- **CI/CD активация:**
  1. Создать GitHub-репо и подключить `origin` (`git remote add origin …; git push -u origin main`)
  2. Подать secrets Beget — см. [deploy/README.md](../../deploy/README.md) раздел «Что нужно от тебя»
  3. После первого успешного manual-деплоя снять `workflow_dispatch`-gate → `on: push: branches: [main]`
- **Продукт** (определяется оператором):
  - 4 калькулятора (арбористика, крыши, мусор, демонтаж)
  - Форма «фото → смета» + Telegram/MAX/WhatsApp боты
  - Programmatic SEO: Раменское + Жуковский (M1 pilot)
- **Первый build graphify**: `/graphify .` в Claude Code или `graphify update .` (AST-only, без LLM)

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — зафиксировать TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Домен (`obihod.ru`, `obixod.ru`, `obihod-servis.ru`)
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
