# US-13 — Homepage Redesign · Art Direction + Briefs

**EPIC:** [EPIC-HOMEPAGE-V2](../EPIC-HOMEPAGE-V2/README.md) · **Owner:** art · **Status:** in-progress · **Дата открытия:** 2026-05-03

## Запрос оператора (2026-05-03)

> «Мне нужен лендинг главной страницы новый. Все делаем по файлу brand-guide.html»

## Решения оператора (2026-05-03, plan-mode AskUserQuestion)

| # | Решение | Выбор |
|---|---|---|
| 1 | Концептуальное направление | **Direction 1 «Фотосмета»** (operational, USP-led) — гибрид с certificate-band из Direction 3 |
| 2 | Scope работы | **Полная пересборка** — 16 секций (4 new / 5 redesign / 7 reuse / 1 drop) |
| 3 | Hero visual | **Реальная фотосессия бригад** — 11 финальных кадров, документальный репортажный стиль |
| 4 | Coverage / география | **Новая секция Coverage** на 6-й позиции — 12 chip-карточек на TopoPattern |

## Deliverables этого US

| Файл | Аудитория | Готовность |
|---|---|---|
| [art-brief.md](art-brief.md) | все роли (общий direction) | ✅ done |
| [art-brief-ui.md](art-brief-ui.md) | `ui` (макеты + token sync) | ✅ done |
| [art-brief-ux.md](art-brief-ux.md) | `ux` (CJM + wireframes) | ✅ done |

## Hand-off log

| Дата | От → Кому | Действие | Артефакт |
|---|---|---|---|
| 2026-05-03 | operator → art | запрос на новую главную, all per brand-guide | (verbal) |
| 2026-05-03 | art → operator | 4 решения через AskUserQuestion: Direction 1 + полная пересборка + фотосессия + Coverage | (plan-mode) |
| 2026-05-03 | art → ui | передача art-brief-ui.md (через cpo) | art-brief-ui.md |
| 2026-05-03 | art → ux | передача art-brief-ux.md (через cpo) | art-brief-ux.md |

## Skill-check (iron rule #1)

art frontmatter skills: `[brand, brand-voice, design, design-system, ui-ux-pro-max]`. Активированы для этой задачи: **design-system** (iron rule §3 — сверка с brand-guide), **ui-ux-pro-max** (style/palette/composition matrix), **brand-voice** (TOV check). Активация зафиксирована в plan-mode + этом intake.

## Design-system awareness (iron rule #3)

Прочитаны секции brand-guide.html v2.2 для homepage scope: §1-14 (services foundations) + §33 site-chrome canonical + §13 TOV + §14 Don't. Identified gap: §35 Homepage layout не описан — будет дополнен после launch новой главной (см. art-brief.md §9).

## Dependencies

- **Photo production (внешний фотограф)** — задача оператора, параллельно. Без неё Hero/Team на launch остаются placeholder.
- **Reviews collection в Payload** — popanel backlog (US-18). Без неё Reviews-секция использует hardcoded fallback.
- **Cases.featured флаг** — popanel backlog (US-18). Без него Cases-секция использует первые 3 опубликованных.
- **AI fотo→смета pipeline** — уже live на 211 URL; PhotoSmeta-блок может переиспользовать compute через Server Action.

## Открытые вопросы (для cpo / podev / popanel)

1. **Backlog Payload:** popanel принимает в work Reviews collection + Cases.featured? (US-18 trigger)
2. **Photo production timeline:** оператор может зафиксировать дату съёмки? Это влияет на launch главной (Team остаётся placeholder если фото не готовы).
3. **PhotoSmeta-output preview:** реальный AI-output на главной (вызов Claude API через Server Action) vs UI-демо? Решение влияет на US-16 fe-build scope.
4. **§35 Homepage в brand-guide:** PR в `design/integration` от art после US-14 + US-15 approve, или раньше? (рекомендация: после, чтобы зафиксировать утверждённое).

## Next steps (передача дальше)

1. `cpo` review art-brief.md / art-brief-ui.md / art-brief-ux.md.
2. `cpo` triggers `ui` на US-14 (homepage-ui-mockups) и `ux` на US-15 (homepage-ux-wireframes) — параллельно.
3. `cpo` triggers `popanel` на US-18 (Payload prep — Reviews collection + Cases.featured флаг).
4. Operator triggers external photo production (US-17).
5. После US-14 + US-15 approve `art` review (моя ответственность).
6. После approve — `cpo` triggers `podev` → `sa-site` пишет `sa-site.md` для US-16 (homepage-fe-build, iron rule #2 spec-before-code).
