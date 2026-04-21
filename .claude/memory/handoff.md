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
