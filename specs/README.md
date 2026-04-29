# specs/

Артефакты задач Обихода. Единственный источник истины для каждой user story
(внешний task-tracker не используется с 2026-04-29 — см.
[../team/adr/ADR-0008-drop-linear-task-tracker.md](../team/adr/ADR-0008-drop-linear-task-tracker.md)).

## Структура

```
specs/
├── README.md                            # этот файл
├── EPIC-<N>-<slug>/                     # обёртка эпика для крупных программ
│   ├── README.md                        # цель эпика, состав US, статусы
│   └── US-<N>-<slug>/
│       ├── intake.md                    # бриф от in (Фаза 1)
│       ├── ba.md                        # бизнес-анализ, требования (Фаза 2)
│       ├── sa-<team>.md                 # системная спека (Фаза 4)
│       ├── qa-<team>.md                 # тест-отчёт qa-<team> (Фаза 8)
│       ├── cr-<team>.md                 # код-ревью (Фаза 9, если не в PR)
│       └── leadqa.md                    # verify-отчёт (Фаза 11)
├── TASK-<DOMAIN>-AD-HOC/                # обёртка для одиночных задач
│   └── US-<N>-<slug>/                   # та же структура артефактов
│       └── ...
└── <legacy US-N-slug>/                  # исторические US (плоский список)
    └── ...
```

## Правила группировки

| Сценарий | Куда |
|---|---|
| Часть существующего эпика (SITE-MANAGEABILITY, IA-EXTENSION, ADMIN-REDESIGN и т. п.) | `specs/EPIC-<N>-<slug>/US-<N>-<slug>/` |
| Новая программа из 2+ US с общей бизнес-целью | Создать `specs/EPIC-<M>-<slug>/README.md` + первую US внутри |
| Одиночная задача (bugfix, разовый ops, content-правка, design-refresh) | `specs/TASK-<DOMAIN>-AD-HOC/US-<N>-<slug>/` |

**Допустимые `<DOMAIN>` для TASK-AD-HOC:** `INFRA`, `CONTENT`, `SEO`, `PANEL`,
`SHOP`, `SITE`, `DESIGN`, `OPS`.

**Новые US после 2026-04-29 ВСЕГДА оборачиваются** в EPIC или TASK-AD-HOC —
напрямую в `specs/` не кладутся.

## Frontmatter US-артефактов

Каждый файл начинается с YAML-frontmatter (детали — в
[../team/WORKFLOW.md §7.5.2](../team/WORKFLOW.md#752-frontmatter-артефактов)):

```yaml
---
us: US-<N>
title: <семантический заголовок>
epic: EPIC-<N>-<slug>           # или TASK-<DOMAIN>-AD-HOC
team: business | common | design | product | seo | shop | panel
po: cpo | podev | poseo | popanel | poshop
type: feature | bug | research | ops | content | design-refresh | improvement | migration
priority: P0 | P1 | P2 | P3
segment: b2c | b2b | cross | internal
phase: intake | spec | design | dev | qa | review | gate | verify | release
role: <одна или несколько ролей через запятую>
status: backlog | in-progress | done | blocked | canceled
blocks: [US-<X>]
blocked_by: [US-<Y>]
related: [US-<Z>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Hand-off

Hand-off между ролями фиксируется внутри артефакта в секции `## Hand-off log`
(timestamp · `from` → `to` · 1 фраза). При смене фазы уходящая роль:
1. Дописывает строку в Hand-off log.
2. Обновляет `phase:` / `role:` / `updated:` во frontmatter.

Полный жизненный цикл задачи — [../team/WORKFLOW.md §3 «Фазы процесса»](../team/WORKFLOW.md).

## Текущее состояние

**Эпики (на 2026-04-29):**
- [EPIC-SITE-MANAGEABILITY/](EPIC-SITE-MANAGEABILITY/) — программа US-3..US-10
  (5/8 Done), эталон liwood.ru по SEO.

**Исторические US (плоский список, до 2026-04-29):** US-1..US-12, OBI-19,
PAN-9, admin-visual. Не реорганизуются — archeological data.

**TASK-AD-HOC папки:** создаются по мере появления одиночных задач.

## Нумерация US

- Сквозные номера, монотонно растут, не переиспользуются.
- `in` берёт `max(US-N)` из `specs/`, `team/release-notes/`, `team/backlog.md`
  и инкрементирует на 1.
- Slug — kebab-case из резюме задачи, 2–4 слова.
