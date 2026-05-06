# Handoff — Обиход

_Обновляется в конце сессии. Короткий срез: что сделано, что в работе, что следующее. Цель — дать следующей сессии контекст за 30 секунд._

## Где мы сейчас (2026-05-06) — poseo сессия

### Эпик в работе: **EPIC-SEO-COMPETE-3** (`specs/EPIC-SEO-COMPETE-3/intake.md`)

Старый EPIC-SEO-OUTRANK **удалён 2026-05-06** по mandate оператора («clean start, новый EPIC с нуля»). Все `seosite/strategy/`, `seosite/02-keywords/`, `seosite/03-clusters/`, `seosite/05-content-plan/`, `seosite/scripts/` тоже удалены. Осталось только `seosite/01-competitors/keysso-snapshot-2026-05-06.json` как baseline.

**Что сделано в этой сессии (2026-05-06):**
- Live Keys.so refresh 3 конкурентов: liwood 155 / arborist.su 74 / arboristik.ru 65 pagesInIndex
- Phase 1 explore (3 parallel agents): site code map (Next.js 16 + Payload, 11 collections, 14 blocks, lib/seo готов) + Keys.so deep dive (5 ключевых insights, intent-split top-100 per домен) + services audit (Topvisor / Just-Magic / Я.Метрика / Я.Вебмастер)
- Phase 2 plan agent: 11 US декомпозиция black-box review
- 4 AskUserQuestion закрыты: uborka-territorii=новый pillar, real-names=3-5 imen+фото, services=Topvisor+Just-Magic есть+NAP placeholder, OUTRANK=удалить
- Bootstrap PR: DELETE EPIC-SEO-OUTRANK + CREATE EPIC-SEO-COMPETE-3/intake.md + ADR-0018-url-map skeleton + backlog update

**EPIC-SEO-COMPETE-3 цели (12 нед, DoD W14):**
- pagesInIndex ≥160 (паритет с liwood 155)
- Topvisor visibility ≥15
- Organic sessions ≥800/нед
- Lead submissions ≥15/нед
- AI-citation ≥4/10 prompts

**12 US:**
- US-0 pre-flight (cleanup + creds setup) — W1
- US-1 семантическое ядро — W1-W2
- US-2 URL-карта + ADR-0018 — W2
- US-3 нейро-SEO каркас (jsonld/citation/llms-full.txt/IndexNow auto) — W2-W3
- US-4 mega-прайс /uslugi/tseny/ — W4-W5
- US-5 30 info-articles /blog/ — W3-W12 rolling
- US-6 6 B2B-нормативки /b2b/<doc>/ — W4-W6
- US-7 programmatic <service>×<city> — W3-W5
- US-8 /kontakty/ + /kalkulyator/foto-smeta/ + 5 LeadForm-вариантов — W6-W7
- US-9 Reviews + /otzyvy/ + Я.Карты (last blocked owner) — W8
- US-10 Topvisor + Я.Метрика + weekly snapshot — W7-W12
- US-11 3-5 авторов + 12 кейсов + СРО — W8-W10
- US-12 final verify + retro — W13-W14

**Блокеры (open questions для оператора):**
1. Topvisor token — когда передать (US-0 W1)
2. Just-Magic creds — когда передать
3. NAP реальный (телефон/адрес) — нужен к US-9 W8
4. Real-name + фото 3-5 авторов — нужен к US-11 W8
5. Я.Бизнес owner-доступ — отложен до получения
6. B2B PDF templates — operator пишет / re из открытых источников
7. Slug `/uborka-territorii/` подтверждение

**Следующий шаг для poseo:**
1. Smoke local + push bootstrap PR + open `gh pr create`
2. Operator merge → handoff к tamd (ADR-0018 review W2)
3. Параллельно — operator готовит креды Topvisor + Just-Magic
4. После ADR-0018 approve → sa-seo стартует US-2 spec
5. seo-content + re стартуют US-1 pull Keys.so deep + Wordstat dop-сбор

### Operator answers 2026-05-06 (post-bootstrap)

PR #169 merged 2026-05-06. Operator передал в чате:
- Topvisor: `f183b7d…` + USER_ID 496026 (уже в `.env.local`)
- Just-Magic: `19e91bb…` (уже в `.env.local`)
- NAP: `+7 (985) 229-41-11`, «МО, Жуковский, мкр. Горельники, ул. Амет-хан Султана, 15к1»
- Real-name авторы: рандомные русские имена (photo source — open question)
- Я.Бизнес: оператор сам owner → US-9 unblocked
- B2B PDF templates: оператор не знаком с концептом, нужно объяснение

Follow-up PR создан с обновлениями intake.md + .env.example template + handoff.md.

**3 новых open questions для operator (после answers):**
1. **Авторские фото** — AI-gen / stock / без фото? (нужно к US-11 W8)
2. **Email** для NAP (например `info@obikhod.ru`)?
3. **B2B-track go/no-go** после объяснения PDF templates: оставляем 6 PDF в US-6 или скоупа без PDF?

Hand-off к `cms` — записать NAP в Globals.SiteChrome через Payload admin (W1 минор-задача).

---

## Где мы сейчас (2026-04-29)

### Свежайшее: PANEL BACKLOG REBUILD + drop magic link + SEED-ADMIN + ADR-0009 (2026-04-29 ночью)

**Сессия с popanel:**
1. **Drop Wave 2.B (magic link)** из US-12 — оператор пересмотрел, popanel дал rationale. PAN-9 (Telegram bot) → US-8 ownership (lead notifications, podev), PAN-10 (SMTP) → общая инфра/`do`. `sa-panel-wave2b.md` → `status: cancelled`, спека сохранена как архив.
2. **Беклог panel пересобран** — создан `team/backlog.md` (его не было!) с RICE/MoSCoW. panel.now: PANEL-DEV-SEED-ADMIN (66.7) → US-12 W0 ADR (50) → W2.A Login UI → W3 PageCatalog → W4 Tabs → W5 Empty/Error. panel.later: PANEL-LEADS-INBOX (11.25 — главный кандидат после US-12), PANEL-AUTH-2FA, PANEL-BULK-PUBLISH, PANEL-AUDIT-LOG, PANEL-MEDIA-LIBRARY.
3. **PANEL-DEV-SEED-ADMIN дотащен до verify-passed** — be-panel реализовал (`scripts/seed-admin.ts` + 4 файла), local-verify обнаружил P0 infra-блокер на tsx+Payload+`@next/env`. Эскалирован на tamd → **ADR-0009 path G** (CJS preload shim 13 строк). Финальный popanel local-verify: AC-1.1/1.3/2/3/4/5 ✅, browser smoke `admin@obikhod.local` логин в /admin dashboard ✅ (`screen/seed-admin-login-success.png`), do-checks ✅ (type-check 0 / lint 0 errors / format OK).
4. **Открытые follow-ups (для следующей сессии):**
   - PR + cr-panel review + merge `feature/seed-admin-local` → `panel/integration` (ничего ещё не закоммичено!)
   - `PRODUCT-SEED-METADATA-FIX` (low) — chistka-krysh metaDescription > 160 chars (pre-existing, не блокер).
5. **ВАЖНО для следующей сессии:** `.env.local` имеет добавленный руками блок `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`. БД содержит 3 admin'а (samohingeorgy@gmail.com, admin@obikhod.local, test@obikhod.local). Postgres контейнер `obikhod_postgres` running.

**Memory updates:** `project_cicd_backlog.md` — пункт «seed данных» закрыт (admin-уровень).

### Прошлое: SHOP MERGE + AUTH/CABINET + SITE CHROME (2026-04-29 поздним вечером)

**Решение оператора:** «один источник истины — `design-system/brand-guide.html`. brand-guide-shop.html не нужен».

**Что сделано:**
- `brand-guide-shop.html` **удалён** (был v1.0 → redirect-stub → удалён).
- Контент перенесён в `brand-guide.html` как §15-§29 (TOV порт + полная e-commerce: Витрина / Поиск / Карточка с PDP / Корзина / Чекаут B2C+B2B / Формы / Аккаунт shop / States / Photography / Heritage).
- Добавлено §30-§32: header auth-states / auth-экраны (login/register/recovery/2FA) / unified ЛК (sidebar 8 разделов, services lead-row + 5-шаговый timeline, shop order-row).
- Добавлено §33: Header & Footer canonical — iron rule «один Header.tsx, один Footer.tsx, без `· магазин` суффиксов»; полная anatomy footer'а с 4 колонками + bottom-row legal.
- 42 ролевых файла в `team/{business,common,design,panel,product,seo,shop}/` массово переписаны: 3 паттерна (iron rule §5, «team/shop/» bullet, «TOV для специализированных зон») заменены на «§15-§29 в brand-guide.html».
- `CLAUDE.md` immutable обновлён: один файл, brand-guide-shop.html удалён.
- Текущая версия: **brand-guide.html v2.2**, 5754 строк, 36 секций.

**Verify:** `grep -rln "brand-guide-shop" /Users/a36/obikhod/{team,CLAUDE.md,design-system}` → должно вернуть пусто (или только этот handoff).

---

### Прошлый день: design-system awareness iron rule в 42 ролях (2026-04-29)

**Решение оператора:** «все агенты которые есть в проекте obikhod смотрят в один источник истины (дизайн системы) — `design-system/brand-guide.html`. Для услуги «Дизайн ландшафта» и для магазина — отдельный TOV».

**Что сделано:**
- В **все 42 ролевых файла** в `team/{business,common,design,panel,product,seo,shop}/` добавлены два новых блока (после `## ⚙️ Железное правило: skill-check перед задачей`, до `## Capabilities`):
  - `## ⚙️ Железное правило: design-system awareness` — обязательная сверка с brand-guide перед UI/UX/контентной/TOV-задачей + per-team пометки (design = авторы; shop = + brand-guide-shop.html; landshaft = future-TOV).
  - `## Дизайн-система: что я обязан знать` — конспект 17 секций brand-guide.html, релевантность по типам задач, связанные источники (`globals.css`, `custom.scss`).
- `team/WORKFLOW.md` §11 «Инварианты проекта» — bullet про design-system awareness + TOV split.
- Memory `feedback_design_system_source_of_truth.md` дополнена примечанием про новый iron rule + TOV split.
- Verify: `grep -l "Железное правило: design-system awareness" team/*/*.md | wc -l` → **42**.

**TOV split:**
- `design-system/brand-guide.html` — общий source of truth для всех 42 ролей. Ведёт `team/design/`.
- `design-system/brand-guide-shop.html` — специализация для магазина (существует), **дополнительно** к общему brand-guide. Ведёт `team/shop/`.
- `design-system/brand-guide-landshaft.html` — специализация для услуги «Дизайн ландшафта», **follow-up** (создаётся позже, owner `art` через `cpo`).

**Follow-up (не в этой сессии):**
1. Создать `brand-guide-landshaft.html` (триггер — первая landscape-related задача).
2. Документировать в `brand-guide.html` §12 namespace-разделение `--c-*` (паблик) vs `--brand-obihod-*` (admin).
3. Опционально — заменить устаревшую ссылку в [specs/US-3-admin-ux-redesign/ui-mockups.md:6](../../specs/US-3-admin-ux-redesign/ui-mockups.md#L6) на `design-system/brand-guide.html`.

---

### Раньше в этой сессии: отказ от Linear + reorg specs/ (2026-04-29)

**Решения оператора в одной сессии:**
1. «убираем Linear с проекта — мы перестаем им пользоваться» → ADR-0008.
2. «папку specs выносим из папки team, она будет отдельно» → `git mv team/specs specs/`.
3. «новые US оборачиваются в EPIC или TASK-AD-HOC» → структура `specs/{EPIC-<N>|TASK-<DOMAIN>-AD-HOC}/US-<N>/`.

**Что изменилось:**

- **Внешний task-tracker не используется.** Беклог и hand-off — только в репо.
- **Беклог** — `team/backlog.md` (cross-team таблица, ведёт `cpo` + PO команд).
- **Папка `specs/`** — вынесена из `team/specs/` на корень репо. Все ссылки в активных файлах + code-комментариях обновлены sed-ом.
- **Структура `specs/`:**
  - Новые US — в `specs/EPIC-<N>-<slug>/US-<N>-<slug>/` (для крупных программ) или `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/` (для одиночных задач).
  - Допустимые `<DOMAIN>` для TASK-AD-HOC: `INFRA`, `CONTENT`, `SEO`, `PANEL`, `SHOP`, `SITE`, `DESIGN`, `OPS`.
  - Исторические US (US-1..US-12, OBI-19, PAN-9, admin-visual, EPIC-SITE-MANAGEABILITY) — плоский список без реорганизации.
- **Артефакты US** — `intake.md`, `ba.md`, `sa-<team>.md`, `qa-<team>.md`, `cr-<team>.md`, `leadqa.md`.
- **Метаданные** — YAML-frontmatter (`us`, `epic`, `team`, `po`, `type`, `priority`, `segment`, `phase`, `role`, `status`, `blocks`, `blocked_by`, `related`).
- **Hand-off** — секция `## Hand-off log` внутри артефакта (timestamp · `from` → `to` · 1 фраза).
- **Merge-conflicts** (`do`) — `team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` + пинг PO напрямую.
- **MCP `mcp__claude_ai_Linear__*`** — не вызывать в этом проекте.

**Что переписано (активные файлы):**

- `CLAUDE.md` — секция «Структура проекта» (специальный блок для `specs/` на корне) + «Агенты проекта»: убрана Linear-интеграция, добавлена ссылка на ADR-0008 + правила группировки (EPIC/TASK-AD-HOC).
- `team/WORKFLOW.md` — §0, §1.0 (колонка «Linear team» удалена), §3, §6 (merge train), §7 (диаграмма каталогов с `specs/` на корне + EPIC/TASK-AD-HOC обёртками), §7.5 («Беклог и трекинг без внешнего tracker'а» + структура группировки + frontmatter с `epic:` полем), §9 (RC + release-note шаблоны), §13.
- `team/PROJECT_CONTEXT.md` — §8 (Управление проектом + специфика `specs/` на корне с EPIC/TASK-AD-HOC), §8.5 (merge train).
- `team/business/in.md` — intake-процесс с этапом «Определяю обёртку (EPIC vs TASK-AD-HOC)» + матрица «Признак → Куда кладу» + frontmatter с `epic:` полем.
- 40 ролевых файлов в `team/{business,common,design,product,seo,shop,panel}/` — Linear-механика заменена на frontmatter + Hand-off log + `team/backlog.md`. PO-роли (`cpo`, `podev`, `poseo`, `popanel`, `poshop`) — секции «Что я веду в Linear» → «Что я веду в репо». `team/common/do.md` — merge train без Linear-issue.
- `git mv team/specs specs` + sed `team/specs/` → `specs/` по 83 файлам (все активные .md/.json/.yml/.yaml + 7 code-комментариев в `site/`).
- Создан `specs/README.md` (обзор новой структуры, текущие эпики, нумерация US).
- Memory: удалены `feedback_linear_mandatory.md` + `project_linear_release_mgr_alias.md`, добавлен `feedback_no_external_tracker.md` (обновлён под новую структуру `specs/`). MEMORY.md обновлён. Обновлены 6 активных feedback-памяти (skill_check, spec_first, strict_sequential_epics, po_iron_rule, do_owns_merges, autonomous_mode_full_mandate) + project_team_v2_42_roles.
- Создан `team/adr/ADR-0008-drop-linear-task-tracker.md` (Accepted, 2026-04-29) — обновлён под reorg `specs/`.

**Не тронуто (исторические артефакты):** `specs/US-1..US-12/`, `specs/OBI-19-*/`, `specs/PAN-9-*/`, `specs/admin-visual/`, `specs/EPIC-SITE-MANAGEABILITY/`, `team/release-notes/`, `team/ops/`, `team/adr/ADR-0001..0007/`, ADR-0004 таблица «Linear team», 2 HTML с устаревшим путём `devteam/specs/` (`contex/07_brand_system.html`, `design-system/brand-guide.html` — битые ссылки до этого ADR). Старые Linear ID (`OBI-19`, `PAN-9`, `SHOP-N` и т. п.) в этих файлах остаются как archeological data.

**Текущая ветка:** `main`. Изменения этой сессии ещё не закоммичены — оператор решит про commit/PR.

---

### Структура команды (актуальное)

42 роли в 7 командах. Все на `opus-4-7` (`claude-opus-4-7`, 1M context) с `reasoning_effort: max`.

- **business/** (6): cpo, ba, in, re, aemd, da
- **common/** (5): tamd, dba, do, release, leadqa
- **design/** (3): art (lead), ux, ui — ветка `design/integration`
- **product/** (8): podev (lead), sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site — ветка `product/integration`
- **seo/** (6): poseo (lead), sa-seo, seo-content, seo-tech, cw, cms
- **shop/** (7): poshop (lead), sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop — ветка `shop/integration`, monorepo `apps/shop/`
- **panel/** (7): popanel (lead), sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel — ветка `panel/integration`

**Релиз-цикл:** `[команда] PR → [release] gate → [leadqa] verify → [operator] approve → [do] deploy → [cpo] retro`. `do` НЕ деплоит без апрува оператора.

**Подчинение:** оператор → cpo → {podev, poseo, popanel, poshop, art} → команды.

**Sticky agent sessions:** `@<code>` или «`<code>`, ...» переключает Claude в роль до явного `/claude`.

**Spec-before-code iron rule:** в командах panel/product/shop dev/qa/cr НЕ стартует без одобренной `sa-<team>.md`. PO команды держит gate в DoD.

**Skill-check железное правило:** перед задачей агент активирует релевантный skill через Skill tool, фиксирует в commit/PR/артефакте.

---

### Программа SITE-MANAGEABILITY (срез на 2026-04-27)

5/8 эпиков Done (US-3 Админка / US-4 Семантика / US-5 Sitemap-IA / US-6 Контент / US-7 SEO покрытие).

Backlog:
- **US-8** — Фичи + калькуляторы + photo→quote + Payload Leads + Telegram оператору (P1, разблокирован US-7). amoCRM вынесен в US-13.
- **US-9** — Полный технический регресс (P1, blocked by US-8).
- **US-10** — Финальный SEO аудит классики + нейро (P1, blocked by US-9 + US-7 Wave 2D content).

Future / out-of-scope MVP:
- **US-11** — IA Extension: Магазин mega + Дизайн ландшафта flat + Error pages 5 шт. (дизайн готов, ждёт seo URL slugs).
- **US-12** — Admin Redesign Final (Login + Layout + Page Catalog + Tabs + States). Wave 1 (custom.scss) задеплоен 2026-04-27. Waves 2-7 открыты, owner — команда panel.
- **US-13** — amoCRM (P2, blocked by аккаунт).
- **US-14** — Wazzup24 (P3, blocked by аккаунт).
- **US-15** — Колтрекинг (P3, blocked by сервис).

### Prod

- https://obikhod.ru, VPS 45.153.190.107, Node 22, PM2 `obikhod`, auto-deploy на push `main`.
- 53 публичных страницы, sitemap = 43 URL.

### Доступы

- ✅ **GH PAT** в `~/.claude/secrets/obikhod-gh.env` — Actions RW + PR RW + Contents RW
- ✅ **Payload API key** в `~/.claude/secrets/obikhod-payload.env`
- ✅ **SSH root** к VPS (45.153.190.107) через `~/.ssh/id_ed25519`
- ❌ **AI API keys** (Perplexity / OpenAI / Anthropic / GigaChat / fal.ai) — нет

---

## Следующий шаг (при возврате оператора)

1. Решить: коммитить ли изменения 2026-04-29 (Linear removal) одним коммитом или разнести (CLAUDE.md / WORKFLOW / role files / memory + ADR).
2. Создать `team/backlog.md` шаблон при первой новой задаче (отдельный US, ответственный — `cpo` совместно с PO команд).
3. Архивирование Linear workspace `samohyn` — вручную оператором в Linear UI (вне scope).
4. Дальше — продолжить программу SITE-MANAGEABILITY (US-8 → US-9 → US-10) или US-12 Wave 2.A (Login UI dev-ready).

## Подсказки для следующей сессии

- `do` сам мержит PR через GH API при зелёном CI (правило `feedback_do_owns_merges_when_ci_green.md`).
- `do` отвечает за зелёный CI до push (правило `feedback_do_owns_green_ci_before_merge.md`).
- Прямой psql на prod: `ssh root@45.153.190.107 'sudo -u postgres psql obikhod -c "..."'`.
- PM2 logs: `ssh root@45.153.190.107 'sudo -u deploy pm2 logs obikhod --lines 50 --nostream'`.
- REST POST на Payload требует **trailing slash** в URL (Next 16 trailingSlash:true → 308 redirect).
- Revalidate endpoint: **GET** (не POST), secret из `/home/deploy/obikhod/shared/.env`.
- Хук `block-dangerous-bash.sh` блокирует `DROP TABLE` — использовать `ALTER TABLE DROP COLUMN`.
- Хук `protect-secrets.sh` блокирует `cat ~/.claude/secrets/...` — использовать `set -a; . file; set +a`.
- Media upload: multipart `POST /api/media/` с `file=@path` + `_payload={"alt":"...","license":"public-domain"}`.

### Pattern для Payload миграций

При добавлении нового поля в коллекцию с `versions: { drafts: true }`:
- `<table>` — основная колонка
- `_<table>_v` — `version_<column>` копия
- Для `select hasMany` — отдельные таблицы `<table>_<field>` + `_<table>_v_version_<field>`
- Для `array` — `(id SERIAL, _uuid varchar, ...fields)` (не varchar PK!)
- Для каждой новой коллекции — `<slug>_id` колонка в `payload_locked_documents_rels`

CI на ephemeral postgres без seed не поймает missing snapshot tables — smoke на REST POST после migrate обязателен.

## Открытые вопросы (из CLAUDE.md)

- [ ] `contex/05_tech_stack_decision.md` — TCO и альтернативы
- [ ] Переименование `contex/` → `context/` (косметика)
- [ ] ТМ «ОБИХОД» у патентного поверенного
- [ ] Юрлицо / СРО / лицензия Росприроднадзора
- [ ] Аккаунты: amoCRM / Wazzup24 / Calltouch
- [ ] AI API ключ для нейро-SEO test (Perplexity / GigaChat / OpenAI)
- [ ] fal.ai key для замены picsum-placeholder в Cases на AI-сгенерированные
