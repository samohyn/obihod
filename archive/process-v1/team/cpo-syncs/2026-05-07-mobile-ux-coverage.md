---
date: 2026-05-07
from: podev
to: cpo
type: sync / decision-request
team_scope: cross-team (design + product)
priority: medium
status: open
---

# Mobile UX coverage — нужна ли отдельная роль/skill?

## Триггер

Оператор 2026-05-03 закрепил mandate: все макеты `newui/` mobile-first, проверка на 375 / 414 / 768 / 1024 на каждой итерации (`feedback_newui_mobile_first.md`). Вопрос от оператора 2026-05-07: «есть ли в команде skills и агенты под мобильный UX?».

## Текущее покрытие (что есть)

**Skills (глобальные, доступны всем ролям):**
- `ui-ux-pro-max` — заявлен «for web **and mobile**», 99 UX guidelines, responsive-паттерны.
- `frontend-design`, `ui-styling` (shadcn/ui + Tailwind), `accessibility` (WCAG 2.2 AA, touch targets), `design-system`, `browser-qa`, `ui-demo`.
- Натив-mobile (`swiftui-patterns`, `dart-flutter-patterns`, `compose-multiplatform-patterns`, `liquid-glass-design`) — **не наш кейс**, у нас Next.js web.

**Агенты, де-факто закрывающие mobile UX:**

| Кто | Команда | Покрытие |
|---|---|---|
| [`ux`](../design/ux.md) | design | UX-паттерны / flows / wireframes; skills: `ui-ux-pro-max`, `accessibility`, `design-system` — уже релевантны mobile |
| [`ui`](../design/ui.md) | design | визуал, токены под mobile breakpoints |
| [`art`](../design/art.md) | design (lead) | арт-директ, owner brand-guide |
| [`fe-site`](../product/fe-site.md) | product (моя) | реализация responsive в Next.js |
| [`lp-site`](../product/lp-site.md) | product (моя) | mobile-first hero/CTA на лендингах |
| [`qa-site`](../product/qa-site.md) | product (моя) | E2E, **уже** запускает на `mobile-chrome` (см. `site/playwright.config.ts`) |

**Ничего критически не хватает** — стек один (Next.js + Tailwind), фрагментировать команду отдельной mobile-ролью смысла нет.

## Что предлагаю (две точечные правки, без новых ролей)

**1. `ux` ([team/design/ux.md](../design/ux.md))** — добавить в Capabilities явный mandate на mobile-first UX:
- mobile breakpoints 375 / 414 / 768 / 1024 — обязательная стадия в каждом UX-делиaverable;
- WCAG touch-targets ≥ 44×44 px — в чеклист;
- thumb-zone / one-hand reachability — фиксируется в wireframes.

**2. `qa-site` ([team/product/qa-site.md](../product/qa-site.md))** — в DoD QA добавить обязательный пункт:
- smoke на 375 / 414 / 768 / 1024 (через `browser-qa` / Playwright `mobile-chrome`);
- скриншоты в `screen/` для каждого breakpoint при review;
- провал любого breakpoint = bug-report, не «потом».

**Срок изменений:** 1 PR в `design/integration` (правка `ux.md`) + 1 PR в `product/integration` (правка `qa-site.md`). Оценка: 0.5 дня.

## Альтернатива (которую отвергаю)

Создание роли `mobile-ux` — overkill:
- стек один (web), фрагментация увеличит координационные издержки;
- 42 роли в команде уже сложная структура; +1 роль без явного загруза = мёртвый агент;
- mobile — это **режим работы** существующих ролей, а не отдельный трек.

## Решение от cpo

- [ ] Согласен с правками `ux.md` + `qa-site.md`?
- [ ] Нужно ли cross-team координировать с `team/seo/` (mobile UX лендингов под programmatic SEO) или это в моём scope как PO product?
- [ ] `team/shop/` (poshop) и `team/panel/` (popanel) — синхронизировать тот же mandate их PO самостоятельно, или ты хочешь общий mandate cross-team одним документом?

## Hand-off log

- 2026-05-07 · podev → cpo: эскалация mobile UX coverage, предложены 2 точечные правки без новых ролей.
