# Branching — Обиход

> Owner: `do` (DevOps / SRE). Этот документ — runbook веточной модели проекта. Любые изменения через PR в `main` (после согласования с оператором).

## Long-lived branches

| Ветка    | Назначение                                              | Auto-deploy на prod                          |
|----------|---------------------------------------------------------|----------------------------------------------|
| `main`   | Production code. Источник истины для prod.              | ✓ на push: `.github/workflows/deploy.yml`    |
| `design` | Long-lived integration branch для работ дизайн-команды. | ✗ — нет; merge в `main` запускает deploy     |

`design` создан 2026-04-25 от HEAD `main`. Цель — отделить ритм дизайн-команды (`art`/`ui`/`ux`) от ритма разработки (`fe`/`be`). Дизайн набирается обособленно, потом сливается в `main` одним release-PR.

## Workflow

### Dev-команда (fe / be / do / be3+be4 …) — без изменений

- Feature-branch от `main`: `git checkout main && git pull && git checkout -b feat/<slug>` (или `fix/<slug>`, `chore/<slug>`)
- PR base = `main`
- После `cr` + `out` approve и зелёного `ci.yml` → merge в `main` → auto-deploy на prod

### Design-команда (art / ui / ux) — новая схема

- Feature-branch **от `design`**: `git checkout design && git pull && git checkout -b feat/<slug>` (или `chore/<slug>` для инфры). **Префикс `design/<slug>` использовать НЕЛЬЗЯ** — git refs collide с long-lived веткой `design`.
- PR base = **`design`** (НЕ `main`) — это и есть отличие от dev-команды, не префикс
- Ревью `art` (Design Director) + согласование с оператором → merge в `design`
- Накапливаем работу. Никакого prod-deploy на этом этапе.

### Релиз дизайна в prod

- Регулярно (раз в спринт или по триггеру) `art` / `po` инициируют **release-PR** `design` → `main`
- Один аудит-PR со всем накопленным дизайном за период
- После merge в `main` → `deploy.yml` выкатит на prod

## Sync `main` → `design`

Чтобы `design` не отставал от `main` (новые feature-flag'и, новые env, security-фиксы):

- **Авто:** [`.github/workflows/sync-design-from-main.yml`](../.github/workflows/sync-design-from-main.yml) — еженедельно (Mon 10:00 MSK) + `workflow_dispatch`. Делает `git merge main` в `design` и пушит.
- **Конфликт:** workflow упадёт. Резолвим вручную: `git checkout design && git merge main` → исправить → `git push origin design`. Алёрт смотрит `do` или дежурный.
- **Ручной запуск:** GitHub Actions → workflow → «Run workflow».

## CODEOWNERS

[`.github/CODEOWNERS`](../.github/CODEOWNERS) маркирует «дизайн-зону»:

```
design-system/                     — design
agents/brand/                      — design
contex/03_brand_naming.md          — design
contex/07_brand_system.html        — design
site/components/marketing/         — design + fe
site/app/globals.css               — design + fe
```

Любой PR, трогающий эти пути, автоматически просит ревью у владельца. Пока команда из одного оператора (`@samohyn`) — это маркер для будущих ревьюеров и для AI-агентов.

## Когда что делать

| Изменение                                          | Куда коммитить         |
|----------------------------------------------------|------------------------|
| Новая страница / компонент / API                   | feature-branch → `main`|
| `design-system/brand-guide.html` правки            | `design/<slug>` → `design`|
| Новый brand-asset (`agents/brand/logo/*`, иконки)  | `design/<slug>` → `design`|
| TOV / brand-naming                                 | `design/<slug>` → `design`|
| `site/components/marketing/*` визуал               | feature-branch → `main` (с CODEOWNERS-ревью от design) |
| `site/components/marketing/*` бизнес-логика        | feature-branch → `main`|
| Hotfix prod                                         | `fix/<slug>` → `main` (минуем `design`) |

Если задача затрагивает одновременно дизайн-артефакты и продовый код — раскладываем на 2 PR: дизайн-часть в `design`, код в `main`. Если это слишком накладно — допустимо одним PR в `main`, но с CODEOWNERS-ревью от design.

## Открытые задачи / гарантии

- [ ] **Branch protection** на `main` уже включён по умолчанию (см. handoff: «branch protection теперь доступен бесплатно после public repo»).
- [ ] **Branch protection на `design`** — оставлен мягким, чтобы дизайн-команда могла мерджить быстрее. При появлении 2+ ревьюеров — включить required reviews.
- [ ] **CI на PR в `design`** — `ci.yml` сейчас триггерится `pull_request` без фильтра по target — значит уже работает на PR в `design`. Если позже захочется ускорить (skip Playwright для дизайн-only PR) — добавим path-фильтр.
- [ ] **Auto-sync** workflow проверить через первый ручной запуск после первого merge в `main` после 2026-04-25.

## Первый кейс новой схемы

PR `feat/brand-guide-v1.6-header-lockup-shop` (открыт 2026-04-25) изначально был на `main`. После создания `design` — retarget на `design` через GitHub web UI: Edit → Base branch → `design`. Это показательный первый прогон.

## Контакт

Любой вопрос по веткам / merge / sync — `do`.
