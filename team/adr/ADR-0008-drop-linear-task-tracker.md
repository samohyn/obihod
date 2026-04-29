## ADR-0008 — Отказ от Linear как внешнего task-tracker'а

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** оператор (samohingeorgy@gmail.com)
**Supersedes (partially):**
- [ADR-0004](ADR-0004-team-restructure-v2.md) — таблица «Linear team» в §Decision больше не действует. Колонка отменена в `team/WORKFLOW.md` §1.0 и `team/PROJECT_CONTEXT.md` §8.

**Related:**
- [team/WORKFLOW.md](../WORKFLOW.md) §7.5 (новая редакция «Беклог и трекинг без внешнего tracker'а»)
- [team/PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) §8 («Управление проектом»)
- [CLAUDE.md](../../CLAUDE.md) — раздел «Агенты проекта»

---

## Context

С 2026-04-24 проект использовал Linear (workspace `samohyn`, 6 team keys: `OBI`, `SEO`, `DES`, `DEV`, `SHOP`, `PANEL`) как зеркало беклога и hand-off-канал. Каждая задача жила одновременно как:

1. Папка `team/specs/US-<N>-<slug>/` с артефактами (intake, ba, sa-`<team>`, qa-`<team>`, cr-`<team>`).
2. Linear Issue с метаданными (priority, type, role/*, phase/*, segment/*, epic/*) + комментарии-hand-off + связи `blocks`/`blocked_by`/`parentId`.

Две побочки этой схемы:

- **Двойной учёт.** Каждый hand-off требовал и обновления frontmatter в md-файле, и комментария + смены labels в Linear. Артефакт оставался единственным источником содержания, Linear хранил только метаданные.
- **Внешняя зависимость.** Состояние задач лежало вне репо; чтобы понять где задача, нужен был live-доступ к Linear через MCP. Audit-trail рассыпан по двум местам.

Оператор 2026-04-29 принял решение: «убираем Linear с проекта — мы перестаём им пользоваться».

## Decision

**Внешний task-tracker не используется.** Любая задача живёт **только** в репозитории:

- **Беклог + приоритизация:** `team/backlog.md` — единая cross-team таблица (id, title, команда, PO, priority, status, deps). Cross-team ведёт `cpo`, секции команд — PO команд (`podev` / `poseo` / `popanel` / `poshop`).
- **Артефакты задачи:** `specs/<EPIC-или-TASK-AD-HOC>/US-<N>-<slug>/` с файлами `intake.md` + `ba.md` + `sa-<team>.md` + `qa-<team>.md` + `cr-<team>.md`. Папка `specs/` вынесена из `team/` на корень репо (вторая часть решения 2026-04-29). Новые US оборачиваются в `EPIC-<N>-<slug>/` (для крупных программ) или `TASK-<DOMAIN>-AD-HOC/` (для одиночных задач).
- **Метаданные** (epic, priority, type, segment, phase, role, status, blocks, blocked_by, related, dates) — в YAML-frontmatter каждого артефакта. Точная структура — в `team/WORKFLOW.md` §7.5.2.
- **Hand-off** — секция `## Hand-off log` внутри артефакта (timestamp · `from` → `to` · 1 фраза). Уходящая роль обновляет `phase:` / `role:` во frontmatter и дописывает строку в log.
- **Merge-conflicts** (`do`) — `team/ops/merge-conflicts/<YYYY-MM-DD>-<branch>.md` + пинг PO напрямую через сообщение оператору.

**MCP Linear-инструменты (`mcp__claude_ai_Linear__*`)** в этом проекте не вызываются, даже если доступны на уровне сессии.

## Consequences

**Положительные:**

- Один источник истины. Состояние задачи = состояние файлов в репо. `git log` = audit trail.
- Hand-off self-contained: всё в одном md-файле, не нужен внешний клиент.
- Снижение когнитивной нагрузки: 6 минимальных Linear labels на каждом issue → одно frontmatter-поле.
- Repo-portability: проект не привязан к конкретному tracker-вендору.
- Меньше ошибок «двойного учёта» (раньше частая ошибка — обновили labels в Linear, забыли в frontmatter, или наоборот).

**Отрицательные / риски:**

- Нет UI-доски для оператора. Снимается через `team/backlog.md` (одна таблица отдельно от артефактов) + любую визуализацию из git-инструмента (например, GitHub web UI с раскраской по статусу).
- Нет авто-уведомлений при смене статуса. Снимается прямыми сообщениями PO команд оператору при ключевых hand-off (intake-готов, sa-готов, RC-готов, leadqa-pass).
- Cross-team `blocks/blocked_by` поддерживается вручную в обоих frontmatter'ах. Снимается дисциплиной PO команд.

**Что НЕ меняется:**

- Pipeline фаз (intake → spec → design → dev → qa → review → gate → verify → release) остаётся.
- Двухступенчатый gate перед оператором (release → leadqa) остаётся.
- 7 команд / 42 роли / 4 integration-ветки остаются.
- Sticky agent sessions остаются.
- Skill-check железное правило остаётся.

## Migration

Выполнено в той же сессии 2026-04-29:

- `CLAUDE.md` — обновлены секции «Агенты проекта» и владельцы беклога.
- `team/WORKFLOW.md` — переписан §7.5 (Linear → frontmatter + Hand-off log + `team/backlog.md`); удалена колонка «Linear team» из §1.0; правки в §3, §6, §9, §13.
- `team/PROJECT_CONTEXT.md` — переписан §8 (Управление проектом); правки в §8.5 (merge train).
- 42 ролевых файла (`team/business/`, `team/common/`, `team/design/`, `team/product/`, `team/seo/`, `team/shop/`, `team/panel/`) — Linear-механика заменена на frontmatter + Hand-off log + `team/backlog.md`.
- Memory: удалены `feedback_linear_mandatory.md` + `project_linear_release_mgr_alias.md`, добавлен `feedback_no_external_tracker.md`.
- Исторические артефакты не тронуты: `specs/US-1..US-12/`, `team/release-notes/`, `team/ops/cms-changes/`, `team/adr/ADR-0001..0007/`. Старые Linear ID (`OBI-19`, `PAN-9`, `SHOP-N` и т. п.) в этих файлах остаются как archeological data — Linear workspace отключается, но ссылки между артефактами работают по US-номерам.
- **Папка `specs/` вынесена из `team/specs/` на корень репо** (`git mv` через 2026-04-29 в той же сессии). Все ссылки на `team/specs/` в активных файлах (CLAUDE.md, WORKFLOW.md, PROJECT_CONTEXT.md, 42 ролевых файла, .claude/memory/handoff.md, code comments) заменены sed-ом на `specs/`. Внутренние перекрёстные ссылки между US-артефактами тоже обновлены. HTML-файлы (`contex/07_brand_system.html`, `design-system/brand-guide.html`) с устаревшим путём `devteam/specs/` — не тронуты, это исторические битые ссылки до этого ADR.
- **Структура `specs/` под новую модель:** новые US оборачиваются в
  `EPIC-<N>-<slug>/` или `TASK-<DOMAIN>-AD-HOC/`. Исторические US-1..US-12,
  OBI-19, PAN-9, admin-visual, EPIC-SITE-MANAGEABILITY оставлены плоским
  списком в `specs/` без реорганизации (решение оператора).

`team/backlog.md` создаётся при первой новой задаче после этого ADR (ответственный — `cpo` совместно с PO команд).

## Open questions

- Создание `team/backlog.md` шаблона — отдельный US (не блокирует решение).
- Чистка/архивирование Linear workspace `samohyn` — вручную оператором в Linear UI (вне scope этого ADR).
