# 2026-04-30 — Iron rule #7: PO orchestration

**Дата:** 2026-04-30
**Длительность:** короткая сессия (1 запрос оператора + applied changes)
**Основная роль:** Claude (основная сессия, без sticky)
**Тема:** новое железное правило для всех PO про самостоятельную передачу задач между фазами + подключение компетентных агентов

## Summary

Оператор сформулировал новое железное правило для всех PO команд (`cpo` / `podev` / `poseo` / `popanel` / `poshop`):

> «продакты могут подключать самостоятельно компетентных агентов к задаче согласно контексту — например если задача вышла с разработки фронта, то он передает её в тестирование; если задача готова и её нужно передать на код ревью — то передаёт. Если продакт сомневается — то спрашивает у оператора. Добавить на уровне claude.md и в др файлах где требуется»

Правило снимает с оператора bottleneck для штатных переходов фаз внутри одной команды, но сохраняет за ним cross-team модерацию и Immutable-решения.

## Ключевые цитаты оператора

> «новое железное правило для всех продактов — что они могут подключать самостоятельно компетентных агентов к задаче согласно контексту»

> «если задача вышла с разработки фронта — то он передает ее в тестирование»

> «если задача готова и ее нужно передать на код ревью — то передает»

> «если продакт сомневается — то спрашивает у оператора»

> «добавить на уровне claude.md и в др файлах где требуется»

## Final decisions

1. **Iron rule #7** добавлен в `CLAUDE.md` секцию «Железные правила» (после release gate #6).
2. **Штатные переходы PO решает сам** (без эскалации к оператору):
   - `phase: dev` → `phase: qa` (после fe/be «готово»)
   - `phase: qa` → `phase: review` (после `qa-<team>` pass)
   - `phase: review` → `phase: gate` (после `cr-<team>` approve → передача в `release`)
   - sa-team approved → назначить состав исполнителей → `phase: dev`
   - подключение `tamd`/`dba`/`aemd`/`do` через Hand-off log
3. **PO ОБЯЗАН спросить оператора** при:
   - cross-team конфликте ресурсов
   - неясном owner (задача задевает 2+ команды)
   - риске нарушить scope другой команды
   - сомнении в выборе skill/роли
   - реджекте со спорным AC/scope
4. **Каждый hand-off** = строка в `## Hand-off log` артефакта `specs/<EPIC|TASK>/<US>/` + апдейт frontmatter (`phase:`, `role:`, `updated:`).
5. **Граница** (остаётся за оператором): approve `leadqa` отчёта, смена приоритетов между эпиками cross-team, любые Immutable из CLAUDE.md.

## Созданные / изменённые артефакты

- [CLAUDE.md](../CLAUDE.md) — пункт #7 в «Железные правила (iron rules)»
- [team/WORKFLOW.md](../team/WORKFLOW.md) — §2 (жёсткие правила процесса) + новый §5.4 «PO orchestration — передача между фазами и подключение агентов»; старый «Sticky agent sessions» переехал в §5.5
- [team/business/cpo.md](../team/business/cpo.md) — секция `## ⚙️ Железное правило: PO orchestration`
- [team/product/podev.md](../team/product/podev.md) — секция с командно-специфичной таблицей (fe-site/be-site/qa-site/cr-site)
- [team/seo/poseo.md](../team/seo/poseo.md) — секция с seo-специфичными переходами (seo-content/seo-tech/cw/cms)
- [team/panel/popanel.md](../team/panel/popanel.md) — секция с panel-специфичными переходами (fe-panel/be-panel/qa-panel/cr-panel + dba+be-panel для коллекций)
- [team/shop/poshop.md](../team/shop/poshop.md) — секция с shop-специфичными переходами (fe-shop/be-shop/qa-shop/cr-shop)
- [memory/feedback_po_orchestration_phase_handoffs.md](file:///Users/a36/.claude/projects/-Users-a36-obikhod/memory/feedback_po_orchestration_phase_handoffs.md) — feedback memory
- [memory/MEMORY.md](file:///Users/a36/.claude/projects/-Users-a36-obikhod/memory/MEMORY.md) — индексная строка добавлена

## Open follow-ups

- Возможно стоит дополнить `cpo.md` явным правилом «не принимать эскалацию внутрикомандного hand-off от PO» (зеркало этого iron rule с другой стороны) — частично уже зафиксировано в его секции, но без анти-паттернов в стиле WORKFLOW §5.4.
- При следующем редизайне ролей (sa-shop / sa-panel и т. п.) проверить, что они в курсе: PO передаёт им задачу сам и не ждёт оператора.
- Проверить, что existing artefacts in `specs/EPIC-SEO-SHOP/` и `specs/EPIC-SEO-LANDSHAFT/` уже используют Hand-off log — если нет, поднять при следующем discovery-pingup от `poseo`.

## Технический инцидент сессии

Между двумя Edit-ами CLAUDE.md и WORKFLOW.md линтер/что-то ещё откатил мои добавления. Перечитал файлы и применил правки повторно — second pass прошёл чисто. Если повторится — стоит проверить hooks в `.claude/settings.json`, возможно session-bootstrap или какой-то file watcher reverts edits.
