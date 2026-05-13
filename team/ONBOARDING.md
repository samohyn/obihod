# ONBOARDING — Обиход

> Инструкция для нового разработчика: clean install с нуля на macOS без потери настроек/секретов.
> **Время:** ~30-60 минут от запроса инвайтов до зелёного `pnpm dev` и логина в `/admin`.
> **Контакт:** operator (см. CLAUDE.md «Вход оператора — напрямую к `po`»).

---

## Часть 0 — Что должен сделать operator ДО твоего старта

Без этого первые 4 шага не сработают. Запроси у operator и убедись что есть:

| # | Что | Канал | Verify |
|---|---|---|---|
| 1 | GitHub invite в `samohyn/obihod` с ролью **Admin** | github.com email | ты видишь repo в `gh repo list samohyn` |
| 2 | SSH user на VPS `45.153.190.107` (с твоим pubkey в `~/.ssh/authorized_keys`) | твой pubkey передаёшь, operator настраивает | `ssh <user>@45.153.190.107 'hostname'` работает |
| 3 | Payload admin user (email + temp password) | твой email | `https://obikhod.ru/admin` логин проходит |
| 4 | Beget panel credentials | secure vault (1Password / Bitwarden / Standard Notes shared) | `https://cp.beget.com` логин проходит |
| 5 | Я.Метрика + Я.Вебмастер + Я.Бизнес — доступ через Yandex sharing на твой Yandex email | Yandex notification | счётчик `obikhod.ru` видишь в metrika.yandex.ru |
| 6 | Secrets bundle (5 файлов) через secure vault | 1Password / Bitwarden encrypted note | см. Часть 5 ниже |

⛔ Никогда не получай и не передавай эти секреты в Telegram/email/Slack plaintext. Только vault или Signal/Wire.

---

## Часть 1 — SSH ключ (твой собственный)

```bash
# На твоём новом Mac
ssh-keygen -t ed25519 -C "<твой-email-или-имя>@obikhod" -f ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub                # отправь operator'у
```

Operator добавит твой pubkey:
- На VPS (твой user в `/home/<user>/.ssh/authorized_keys`)
- На GitHub (он не нужен если используешь `gh auth login` ниже — gh использует HTTPS+OAuth)

Проверка:
```bash
ssh <user>@45.153.190.107 'echo OK && hostname'    # → OK + obikhod-prod (или похожее)
```

---

## Часть 2 — Toolchain (macOS)

```bash
# Homebrew (если ещё нет)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Core
brew install node@22 pnpm git gh

# Docker Desktop (для локального Postgres)
brew install --cask docker
open -a Docker                            # запусти Docker.app один раз чтобы он встал

# Опционально (но рекомендуется)
brew install --cask visual-studio-code
brew install ripgrep jq                   # для grep/json wrangling
```

Verify:
```bash
node --version    # v22.x
pnpm --version    # 9.x или 10.x
docker --version  # 27.x
gh --version
```

---

## Часть 3 — GitHub auth

```bash
gh auth login
# выбери: GitHub.com → HTTPS → Yes (authenticate Git) → Login with a web browser
# после OAuth flow → gh пишет токен в ~/.config/gh/hosts.yml
gh repo list samohyn | grep obihod        # должен показать обихid
```

---

## Часть 4 — Clone repo + local dev

```bash
mkdir -p ~/work && cd ~/work
git clone https://github.com/samohyn/obihod.git obikhod
cd obikhod

# .env.local — оператор передаёт через vault (Часть 5, файл #1)
# либо см. .env.example как template
cp .env.example .env.local                # затем отредактируй

# Сайт
cd site
pnpm install                              # ~2-5 мин
pnpm db:up                                # Docker Postgres стартует на :5432
pnpm seed:admin                           # создаёт admin@obikhod.local (см. ADMIN_EMAIL/PASSWORD в .env.local)
pnpm dev                                  # → http://localhost:3000
```

Открой:
- `http://localhost:3000` — главная Обихода
- `http://localhost:3000/admin` — Payload admin, логин из `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

Если упало:
- Postgres conflict (порт 5432 занят) → `docker ps` и останови чужой Postgres
- `Cannot destructure property 'loadEnvConfig'` → нужен tsx shim (sustained, см. `site/AGENTS.md` § «tsx + Payload preload shim»)

---

## Часть 5 — Secrets bundle через secure vault

Operator передаёт тебе через 1Password / Bitwarden shared vault (или Standard Notes encrypted note) **5 файлов** + production env. Скопируй каждый в нужное место на новом Mac:

### Файл 1 — `~/work/obikhod/.env.local` (или `site/.env.local`)
Локальные переменные для разработки. Содержит:
- `DATABASE_URI=postgresql://obikhod:obikhod@localhost:5432/obikhod`
- `PAYLOAD_SECRET=<random>`
- `ADMIN_EMAIL=admin@obikhod.local` + `ADMIN_PASSWORD=<temp>`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `TELEGRAM_BOT_TOKEN=<token>` (sustained US-8)
- (опционально) `KEYS_SO_TOKEN`, `TOPVISOR_TOKEN`, `JUST_MAGIC_TOKEN`, `ANTHROPIC_API_KEY`

Sustained `.env.example` показывает шаблон. Production значения для prod лежат в `/home/deploy/obikhod/shared/.env` на VPS (ты прочитаешь после Часть 6 SSH).

### Файл 2 — `~/.claude/secrets/obikhod-gh.env`
```
GH_PAT=<github-pat-or-app-token>
```
Используется в скриптах + workflow. **Лучше:** создай свой PAT через `github.com/settings/tokens` (Fine-grained, scope: repo + workflow + read:packages), не используй operator'ский.

### Файл 3 — `~/.claude/secrets/obikhod-payload.env`
```
PAYLOAD_API_KEY=<key>
```
Создаёшь сам после первого логина в `/admin` → твой user → API Key → generate.

### Файл 4 — `~/.claude/secrets/obikhod-fal.env`
```
FAL_KEY=<key>
```
Operator передаст текущий FAL_KEY (или ты создашь свой на `fal.ai/dashboard/keys`). Для design/photo-generation wave (sustained D2).

### Файл 5 — `~/.claude.json` MCP-серверы
Скопируй из operator'ского `~/.claude.json` блок `mcpServers` секции:
```json
{
  "mcpServers": {
    "magic-21st": { "command": "npx", "args": ["-y", "@21st-dev/magic-mcp"], "env": { "API_KEY": "<key>" } },
    "fal-ai": { "command": "npx", "args": ["-y", "fal-ai-mcp-server"], "env": { "FAL_KEY": "<key>" } }
  }
}
```

Permissions:
```bash
mkdir -p ~/.claude/secrets
chmod 700 ~/.claude/secrets
chmod 600 ~/.claude/secrets/*.env
```

---

## Часть 6 — Доступ к prod (VPS, Payload, БД)

После того как operator настроил SSH user (Часть 0 #2):

```bash
# Prod env переменные
ssh <user>@45.153.190.107 'sudo -u deploy cat /home/deploy/obikhod/shared/.env'
# DATABASE_URI, PAYLOAD_SECRET prod, SMTP, etc — НЕ копируй на свой Mac в .env.local
# (локально ты на Docker Postgres, prod БД в env читаешь только при необходимости)

# pm2 logs
ssh <user>@45.153.190.107 'sudo -u deploy pm2 logs obikhod --lines 50 --nostream'

# Прямой psql prod (read-only attitude, осторожно)
ssh <user>@45.153.190.107 'sudo -u postgres psql obikhod -c "SELECT id, slug FROM services LIMIT 5;"'

# Payload admin prod
open https://obikhod.ru/admin             # логин с temp password от operator → сменить
```

---

## Часть 7 — Claude Code (опционально, но рекомендуется)

```bash
# Установка
brew install --cask claude
# либо скачай с https://claude.com/code
open -a Claude

# Sign in → web OAuth
# После sign-in: ~/.claude/CLAUDE.md глобальные правила синхронизуются автоматически
```

Уже скопировано через Часть 5: `~/.claude.json` (MCP-серверы) + `~/.claude/secrets/`. 
Skills доступны автоматически после auth.

При первом запуске Claude Code в проекте:
```bash
cd ~/work/obikhod
claude                                    # запускает сессию, читает CLAUDE.md + handoff.md + learnings.md
```

Прочитай `.claude/memory/handoff.md` (что сейчас в работе) и `.claude/memory/learnings.md` (уроки).

---

## Часть 8 — Verify end-to-end

Чеклист «всё работает»:

| # | Команда | Ожидание |
|---|---|---|
| 1 | `cd ~/work/obikhod/site && pnpm type-check` | 0 errors |
| 2 | `pnpm lint` | 0 errors (warnings ок) |
| 3 | `pnpm test:unit` | 68/68 passing |
| 4 | `pnpm dev` → `http://localhost:3000` | главная грузится |
| 5 | `http://localhost:3000/admin` логин | passes |
| 6 | `ssh <user>@45.153.190.107 'hostname'` | hostname VPS |
| 7 | `gh pr list -R samohyn/obihod` | видишь открытые PR |
| 8 | `curl -s -o /dev/null -w "%{http_code}" https://obikhod.ru/vyvoz-musora/` | 200 |
| 9 | Claude Code → новая сессия → видишь `team/po.md`, `CLAUDE.md`, hooks работают | OK |

Если что-то не сошлось — пиши operator с конкретным шагом + outputом.

---

## Часть 9 — Что почитать ПЕРЕД первым коммитом

Без этих 7 файлов ты сломаешь iron rules и потеряешь время:

1. **`CLAUDE.md`** — top-level context проекта, что immutable, какой стек
2. **`team/PROJECT_CONTEXT.md`** — единый контекст для всех ролей (с deprecation banner)
3. **`team/WORKFLOW.md`** — Scrum-воркфлоу, релиз-цикл
4. **`team/po.md`** (+ остальные 8 ролей) — кто за что отвечает
5. **`team/backlog.md`** — текущие эпики (now / next / later)
6. **`.claude/memory/handoff.md`** — где сейчас сессия
7. **`.claude/memory/learnings.md`** — уроки (sustained learnings, gotchas)

Также:
- `design-system/brand-guide.html` v2.6 — single source of truth для UI/UX/TOV
- `team/adr/ADR-000{1..21}*.md` — все архитектурные решения
- `specs/EPIC-*/intake.md` — активные эпики (SHOP-REMOVAL closed, LIWOOD-OVERTAKE complete, SERVICE-PAGES-UX active, SERVICE-PAGES-REDESIGN active pilot)

---

## Часть 10 — Iron rules (НЕ нарушай)

Из `CLAUDE.md`:

1. **Skill-check** — перед задачей роль активирует skills из своего `frontmatter.skills` через `Skill` tool (первый tool call)
2. **Design-system awareness** — UI/UX/TOV/контент сверять с `design-system/brand-guide.html` v2.6 (`§1-14 services`, `§30-33 auth/cabinet/site-chrome`). **Iron rule brand-guide-first**: UI компоненты только из brand-guide; если §нет — design сначала PR в brand-guide, потом fe верстает.
3. **Green CI before merge** — `dev/fe` гоняет `type-check + lint + format:check` ДО PR
4. **Real-browser smoke before merge** — `qa` разворачивает PR локально (`PAYLOAD_DISABLE_PUSH=1 pnpm dev`) и делает browser smoke ДО approve
5. **Merge = qa approve + po approve + CI green** — `devops` мержит при трёх зелёных. Оператор апрувит только бизнес-решения.

Плюс (sustained learnings):
- Playwright скриншоты — **всегда в `screen/<topic>/`**, никогда в корне проекта
- `.env` файлы с пробелами/кириллицей — **обязательно double quotes**
- Payload select field = Postgres ENUM TYPE (не varchar), миграции через `ALTER TYPE ADD VALUE IF NOT EXISTS`
- Payload async hooks → fire-and-forget pattern с 5s timeout (sync await → pg pool deadlock)
- Прямой psql на prod через `ssh <user>@45.153.190.107 'sudo -u postgres psql obikhod -c "..."'`
- REST POST на Payload требует **trailing slash** (Next 16 `trailingSlash:true` → 308 redirect)
- Revalidate endpoint: GET (не POST), secret из `/home/deploy/obikhod/shared/.env`
- Хук `block-dangerous-bash.sh` блокирует `DROP TABLE` — используй `ALTER TABLE DROP COLUMN`
- Хук `protect-secrets.sh` блокирует `cat ~/.claude/secrets/...` — используй `set -a; . file; set +a`
- Parallel dev agents — sequential default, parallel только через `Agent.isolation: "worktree"`
- Media upload: multipart `POST /api/media/` с `file=@path` + `_payload={"alt":"...","license":"..."}`

---

## Часть 11 — Twoja first task

Возьми из `team/backlog.md` секция `now` любую low-risk задачу, например:
- PRODUCT-SEED-METADATA-FIX (0.1 чд, low — `pnpm seed` падает на 1 Service `chistka-krysh` — metaDescription > 160 символов)

Workflow:
1. Прочитай `team/po.md` → пиши `po` (operator или AI po-агент) → получи spec.md → branch → fix → PR → CI green → request review → merge.

Welcome.

---

## Что НЕ копировать с operator-машины

❌ `~/.claude/projects/` — session history (privacy)
❌ `~/.claude/shell-snapshots/` — bash history
❌ `~/.claude/todos/` — operator's todo lists
❌ `~/Library/Application Support/Claude/` — кэш приложения
❌ `node_modules/`, `.next/`, `.turbo/` — bloat, ставится `pnpm install`
❌ `.DS_Store` — macOS metadata

Если operator делает Вариант B (клонирование) — используй `tar --exclude` из предыдущего ответа PO.

---

## Контакты

| Кому | Когда |
|---|---|
| operator | бизнес-решения, доступы, бюджеты, новые фичи |
| po (AI или operator) | техзадачи, спецификация, sprint planning |
| `team/adr/` | архитектурные решения — прочитай прежде чем спорить |

Любой ad-hoc «как сделать X» — сначала grep по `.claude/memory/learnings.md`, потом по `team/adr/`, потом спрашивай.
