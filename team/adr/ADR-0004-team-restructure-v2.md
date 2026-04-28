# ADR-0004 — Team restructure v2: 30 → 42 ролей в 7 командах

**Status:** Accepted
**Date:** 2026-04-28
**Deciders:** оператор (samohingeorgy@gmail.com), архитектурный round (Plan agent)
**Supersedes:** —
**Related:**
- [team/PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) §1+§8
- [team/WORKFLOW.md](../WORKFLOW.md) §1.0–§1.8, §3 (фазы), §5.4 (sticky sessions), §6 (branch strategy)
- [CLAUDE.md](../../CLAUDE.md) секции «Структура проекта», «Агенты проекта»

---

## Context

До 2026-04-28 команда Обиход состояла из 30 ролей в 5 функциональных папках (`business/`, `common/`, `design/`, `product/`, `seo/`) под управлением одного `po`, с одним релизным gate `out`. Дубликаты разработки (`fe1/fe2`, `be1..be4`, `qa1/qa2`) пережили предыдущие итерации, но в фактической работе использовался один файл на роль.

**Что сломалось:**

1. **Один `po` управлял 30 ролями.** Невозможно держать качественный беклог cross-team (services сайт + SEO + design + панель). Оператор был вынужден сам распределять задачи между командами.
2. **Один `out` был и доковым gate, и практической QA.** Перегружен; оператор фактически делал верификацию сам перед апрувом.
3. **`shop/` (e-commerce саженцев) и `panel/` (Payload admin)** — отдельные домены без явных команд. shop требует ecommerce-специализации (категории, фасеты, корзина, checkout, ЛК), panel — UI-работы строго по `design-system/brand-guide.html` §12. Без своих PO они конкурировали с product за ресурсы.
4. **Скилы агентов — формальный список без процесса активации.** Skills из `~/.claude/skills/` присутствовали в frontmatter, но не активировались через Skill tool в работе — теряли специализированные паттерны.
5. **Sticky agent sessions** не было — оператор каждый раз заново «вызывал» роль.

## Decision

Пересобрать команду в **42 роли в 7 командах** с product owner в каждой, двухступенчатым релиз-циклом и явным sticky-режимом.

### Структура команд

| Команда | Файлы | Lead | Branch | Linear team |
|---|---|---|---|---|
| **business/** (6) | cpo, ba, in, re, aemd, da | cpo | main | OBI |
| **common/** (5) | tamd, dba, do, release, leadqa | shared | main | DEV |
| **design/** (3) | art (lead), ux, ui | art | design/integration | DES |
| **product/** (8) | podev, sa-site, be-site, fe-site, lp-site, pa-site, cr-site, qa-site | podev | product/integration | OBI/DEV |
| **seo/** (6) | poseo, sa-seo, seo-content, seo-tech, cw, cms | poseo | main | SEO |
| **shop/** (7) | poshop, sa-shop, be-shop, fe-shop, ux-shop, cr-shop, qa-shop | poshop | shop/integration | SHOP (новый) |
| **panel/** (7) | popanel, sa-panel, be-panel, fe-panel, ux-panel, cr-panel, qa-panel | popanel | panel/integration | PANEL (новый) |

### Подчинение

- `cpo` ← оператор. Над всеми PO команд (наблюдатель + helper, не «над-PO»).
- `podev` / `poseo` / `popanel` / `poshop` / `art` ← `cpo`.
- В каждой команде: исполнители ← свой PO. `ux-shop` / `ux-panel` ← `art`.
- `common/` shared: `tamd`, `dba`, `do`, `release`, `leadqa` ← `cpo`. Подключаются к любой команде по запросу.

### Двухступенчатый релиз-цикл

```
[команда] PR → [release] gate (доки) → [leadqa] verify (локально)
       → [operator] approve → [do] deploy → [cpo] post-release retro
```

- **`release`** — документальный gate (`team/common/release.md`). Проверяет соответствие реализации `ba.md` / `sa-*.md` / AC / DoD / NFR. Выпускает `team/release-notes/RC-N.md`.
- **`leadqa`** — практическая verification (`team/common/leadqa.md`). Разворачивает RC локально, прогоняет smoke + дизайн + a11y + функ/нефунк. Пишет `team/release-notes/leadqa-N.md` оператору.
- **`do`** — деплоит ТОЛЬКО после явного апрува оператора.

**Жёсткое правило:** оператор апрувит ТОЛЬКО после `leadqa` отчёта; `do` не деплоит без апрува; `release` выпускает RC только после `cr-*` approve.

### Branch strategy

Trunk-with-long-lived-integration-branches:

```
main (prod)
 ├── design/integration   (lead: art)
 ├── shop/integration     (lead: poshop)   apps/shop/**
 ├── panel/integration    (lead: popanel)  site/payload.config.ts
 └── product/integration  (lead: podev)
```

**Owner merge train: `do`** (daily cron). Order: design → panel → shop → product. Hot-paths: `payload.config.ts`, `apps/shop/**`, `app/(payload)/admin/**`, `design-system/**`, `package.json`/`pnpm-lock.yaml`.

### Sticky agent sessions

Когда оператор обращается к роли (`@cpo`, `/podev`, «cpo, ...») — Claude переключается в неё и **остаётся** до явного выхода. Каждый ответ префиксируется `[code]`. Возврат: `/claude`, «Claude, переключись», новая сессия.

### Skill-check железное правило

Каждый агент перед задачей:
1. Сверяет требования с frontmatter `skills`.
2. Активирует релевантный skill через Skill tool, фиксирует в commit / PR / артефакте.
3. Если skill отсутствует — НЕ берёт; пингует `reports_to` или передаёт роли с нужным skill.

Блок добавлен в каждый из 42 файлов после секции `## Skills (как применяю)`.

### Технические решения

- **Именование файлов:** kebab-case (`be-site.md`, `sa-seo.md`, `ux-shop.md`).
- **Модель:** `opus-4-7` (`claude-opus-4-7`, 1M context) для всех 42 ролей.
- **Owner Payload-коллекций:** `panel` (`be-panel` + `dba`). product/shop читают через Payload Local API.

## Consequences

### Положительные

1. PO команды разрешает **70% локальных решений**, оператор подключается к 30% стратегических.
2. `cpo` — единая точка для cross-team модерации (конфликты `panel` ↔ `product`, ресурсы между shop и services-сайтом).
3. `release` + `leadqa` — двухступенчатый gate снимает с оператора практическую верификацию: он апрувит на основании готового отчёта.
4. Branch strategy + `do` merge-train — конфликты `payload.config.ts` (panel vs product) и `package.json` (shop monorepo) ловятся ежедневно, а не на merge.
5. Skill-check рутина — спецпатт ерны (TDD-workflow, security-review, e2e-testing) активируются явно, не «висят» формально в frontmatter.
6. Sticky agent sessions — оператор работает с ролью без re-briefing каждое сообщение.

### Отрицательные

1. **Рост числа артефактов** — `RC-N.md` + `leadqa-N.md` + `release-blockers.md` (при block) на каждый релиз. Митигация: шаблоны зафиксированы в WORKFLOW.md §9.
2. **Linear labels миграция** — старые `role:po`/`role:out`/`role:fe1`/etc. требуют bulk-rename. Откладывается до апрува оператора (Фаза 4 миграции).
3. **`cpo` и `leadqa` без рабочего опыта** — первые 2 недели работают «дублёром» к старому `po`/`out`, оператор валидирует решения.
4. **Содержимое подкомандных ролей (be-site, fe-shop, qa-panel и т.д.)** — frontmatter обновлён, но текст ролей частично копия старых файлов. Каждая команда дополнит свою роль по мере работы.
5. **Создать SHOP и PANEL teams в Linear** — отдельная операция в Фазе 4.

## Alternatives considered

### A. Минимальная миграция: оставить 30 ролей, только переименования

**Отклонено:** не решает корневую проблему (один `po` на 30 ролей, один `out` gate). Оператор будет продолжать брать на себя cross-team модерацию.

### B. Реальные subagents через DevFleet / dmux harness

**Отклонено:** избыточно для проекта. Sticky agent sessions как правило в Claude закрывает 80% потребности без затрат на harness.

### C. Один `po` с виртуальными «командами» через labels

**Отклонено:** оператор ясно зафиксировал «PO в каждой команде, cpo над всеми». Виртуальные команды без явных PO не решают проблему распределения задач.

## Migration

См. plan: `/Users/a36/.claude/plans/splendid-wondering-yeti.md`. Branch: `chore/team-restructure-v2` от чекпоинта на `fix/admin-stat-cards-12-3` (commit `03dc2dd`).

**Фазы:**
- **0** — checkpoint commit + ветка ✅
- **1** — kebab-rename 22 файла + создание 4 ключевых ролей ✅
- **2** — split `po.md` → `cpo.md` + `podev.md`; `out.md` → `release.md` (rename + adapt); создание `leadqa.md`, `poseo.md`; 4 ключевых файла + 24 frontmatter-апдейта подкомандных ролей + 11 frontmatter-апдейтов business/common/design + bulk `opus-4-6` → `opus-4-7` + skill-check rule в 42 файлах ✅
- **3** — `WORKFLOW.md` (12 секций обновлено), `PROJECT_CONTEXT.md` (5 секций обновлено), `CLAUDE.md` (структура + sticky + release cycle) ✅
- **4** — Linear bulk-rename labels + создание SHOP / PANEL teams (отложена до явного апрува оператора, чтобы не сломать active filters)
- **5** — memory (4 новых файла + MEMORY.md index) + hooks audit ✅
- **6** — ADR ✅ + verification + handoff

**Verification:**
- `grep -rn "model: opus-4-6" team/` → 0
- `ls team/{business,common,design,product,seo,shop,panel}/*.md | wc -l` → 42
- `grep -c "Железное правило: skill-check" team/**/*.md` → ≥ 42

## Notes

- Содержимое подкомандных ролей (be-site, fe-site, qa-site, sa-site, и т.д.) частично остаётся от копий старых файлов. Каждая роль дополнит свою спеку по мере первой задачи. Frontmatter и skill-check rule корректны.
- Файл `team/business/po.md` удалён (контент перенесён в `cpo.md` + `podev.md`).
- `team/common/out.md` переименован в `release.md` с переписанной мандатной частью.
- Опечатка `team/shop/ux panel.md` → `team/shop/ux-shop.md` (был неправильный суффикс).
