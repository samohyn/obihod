---
rc: USLUGI-US-2 (EPIC-SEO-USLUGI US-2 release gate)
target: US-2 newui/ макеты × 4 (T1 hub / T2 pillar / T3 sub / T4 SD) + ba/sa-seo/leadqa-2 spec
epic: EPIC-SEO-USLUGI
branch: seo/epic-uslugi-2-newui-templates (НЕ создана — будет создана `do` после operator approve)
status: ready-for-operator-approve
created: 2026-05-08
author: release
team: common (release manager) / poseo orchestrating
sustained_pattern: RC-USLUGI-US-1.md
---

# RC-USLUGI-US-2 — EPIC-SEO-USLUGI US-2 release gate

**Status: ✅ READY for operator approve.**

Iron rule релиз-цикла этого эпика (`specs/EPIC-SEO-USLUGI/intake.md` §«Релиз-цикл per US»):
`[poseo] dispatch → [executors: 4 parallel agents] dev → [poseo→qa] → [leadqa] real-browser smoke (Playwright MCP) → leadqa-2.md → [poseo→gate] → [operator] approve → [do] push → CI green → merge → [poseo] phase: done → US-3 dispatch`.

`leadqa-2` уже выполнен (`specs/EPIC-SEO-USLUGI/US-2-newui-templates/leadqa-2.md`):
**16/16 screenshots PASS, 0 critical axe-core violations × 4 templates, recommendation: APPROVE US-2 release.**
RC-USLUGI-US-2 агрегирует verification gate и передаёт оператору для финального approve.

---

## 1 · Scope of release

- **EPIC:** `EPIC-SEO-USLUGI`
- **US:** US-2 newui/ макеты × 4 (T1 hub / T2 pillar / T3 sub / T4 SD)
- **Deliverables (новые/перезаписанные файлы):**
  - `newui/uslugi-hub.html` (новый, **849 строк**) — T1 hub `/uslugi/`
  - `newui/uslugi-pillar.html` (новый, **1998 строк**) — T2 pillar `/<pillar>/` (demo `/vyvoz-musora/`)
  - `newui/uslugi-sub.html` (новый, **2069 строк**) — T3 sub `/<pillar>/<sub>/` (demo `/vyvoz-musora/vyvoz-stroymusora/`)
  - `newui/uslugi-service-district.html` (**перезаписан** sustained 2085 строк → новый **1563 строки**) — T4 SD `/<pillar>/<city>/` (demo `/vyvoz-musora/balashikha/`)
  - `specs/EPIC-SEO-USLUGI/US-2-newui-templates/ba.md`
  - `specs/EPIC-SEO-USLUGI/US-2-newui-templates/sa-seo.md`
  - `specs/EPIC-SEO-USLUGI/US-2-newui-templates/leadqa-2.md`
  - `team/release-notes/RC-USLUGI-US-2.md` (этот файл)
  - `screen/us-2/` (16 PNG screenshots, 4 templates × 4 viewports)

**Total HTML lines:** 6479 (4 макета).

---

## 2 · Verification gate checklist

| # | Gate | Source | Statut |
|---|---|---|---|
| 1 | 4 HTML макета созданы | `wc -l newui/uslugi-{hub,pillar,sub,service-district}.html` | ✅ PASS |
| 2 | Все 4 HTTP 200 при serve через python http.server | `curl -o /dev/null` × 4 | ✅ PASS |
| 3 | T1 — 4 JSON-LD blocks (Org+WebSite+ItemList+Breadcrumb) | browser_evaluate `script[type="application/ld+json"]` count | ✅ PASS (4) |
| 4 | T2 — 5 JSON-LD blocks (+ Service + AggregateRating + FAQPage) | same | ✅ PASS (5) |
| 5 | T3 — 4 JSON-LD blocks (Service-sub + FAQPage + Breadcrumb) | same | ✅ PASS (4) |
| 6 | T4 — 6 JSON-LD blocks (+ LocalBusiness + Person Author) | same | ✅ PASS (6) |
| 7 | T2 30 city-ссылок (target SD URLs) | `[href*="/vyvoz-musora/"]` count = 30+ внутри city-list | ✅ PASS (30) |
| 8 | T3 5 methods block | `.t3-method` count | ✅ PASS (5) |
| 9 | T3 НЕТ city-ссылок (T3 differentiator) | inspect main flow | ✅ PASS |
| 10 | T4 hero ≥150 слов | hero `.innerText.split(/\s+/).length` | ✅ PASS (170) |
| 11 | T4 «Балашиха» mentions ≥5 | regex match | ✅ PASS (16 в hero, 59 на странице) |
| 12 | T4 ≥25 микрорайонов | regex match unique | ✅ PASS (28) |
| 13 | T4 5 related-cities cross-link | inspect | ✅ PASS |
| 14 | T4 4 city-specific reviews | inspect | ✅ PASS |
| 15 | T4 placeholder tokens для US-4 | `{{service}}/{{district}}/...` в комментариях | ✅ PASS |
| 16 | Все 4 H1 = 1 | `document.querySelectorAll('h1').length` × 4 | ✅ PASS (1×4) |
| 17 | Все 4 canonical tags | `link[rel=canonical]` × 4 | ✅ PASS |
| 18 | Все 4 viewport meta + Open Graph | inspect | ✅ PASS |
| 19 | Mobile-first media-queries | min-width: 768 + 1024 × 4 | ✅ PASS |
| 20 | 16 Playwright screenshots (4 templates × 4 viewports 375/414/768/1024) | `ls screen/us-2/ \| wc -l` | ✅ PASS (16) |
| 21 | axe-core 0 critical violations × 4 templates | wcag2a+wcag2aa scan | ✅ PASS (0×4) |
| 22 | leadqa-2.md verdict PASS | `grep verdict leadqa-2.md` | ✅ PASS |
| 23 | Site chrome §33 sustained (Header + Footer 1-в-1) | inspect | ✅ PASS |
| 24 | TOV §13 Caregiver+Ruler | text inspect | ✅ PASS |
| 25 | brand-guide v2.2 tokens (CSS-vars only) | inspect | ✅ PASS |

**Итого: 25/25 gates PASS.**

## 3 · Risk-flag

**Risk: NONE.**

US-2 — HTML макеты в `newui/` (research/design assets), deploy в production НЕ происходит. `newui/` директория НЕ серверится Next.js, она используется как preview-baseline для US-4 имплементации.

- Не задевает CWV / lead-flow / UX в production
- Не требует БД миграций
- Не задевает Я.Метрика / Я.Вебмастер
- Не требует sitemap regen

Worst-case rollback: `git revert` коммита, макеты исчезают из `newui/`, production не задет.

## 4 · Conditional follow-ups (для следующих US, НЕ блокеры US-2)

| # | Follow-up | Куда |
|---|---|---|
| 1 | color-contrast violations (237 nodes total) — `--c-muted` token sustained design decision, fix через реальный контент с `--c-ink` | US-5 контент-волна |
| 2 | link-in-text-block (2 nodes T2+T3) — добавить `prose a { text-decoration: underline; }` | US-5 контент-волна |
| 3 | Token replace в T4 макете (`{{service}}`, etc.) → dynamic data из Payload через `composer.ts` | US-4 imp |
| 4 | T4 B2B-блок белый текст на градиенте — fix явный contrast override | US-5 |
| 5 | Lighthouse CI gate setup (LCP/CLS/INP в production) | US-6 finalQA |

## 5 · Что делает do (после operator approve)

1. `git checkout -b seo/epic-uslugi-2-newui-templates main`
2. `git add` deliverables (см. §1)
3. `git commit` (HEREDOC message с Co-Authored-By)
4. `git push -u origin seo/epic-uslugi-2-newui-templates`
5. `gh pr create` (title: `feat(seo): EPIC-SEO-USLUGI US-2 — newui/ макеты × 4 шаблона (T1/T2/T3/T4)`)
6. CI green (markdown + HTML — на newui-only PR CI не строгий)
7. `gh pr merge --squash` (operator merge как US-1) или `--auto`
8. `do` уведомляет poseo о merge → poseo → US-3 dispatch (Payload расширение Districts +23 + ServiceDistricts bulk-seed 150 + namespace validate-hooks)

## 6 · Recommendation для operator

**APPROVE US-2.**

Релиз даёт **визуальный язык** для 191 URL раздела `/uslugi/`. Без US-2 макетов:
- US-3 (Payload расширение) делает seed без знания финальных полей структур шаблонов
- US-4 (slug-resolver imp) переписывает Next.js-views без визуального ориентира — высокий риск стилевого расхождения с brand-guide
- US-5 (контент-волна) пишет hero/FAQ/cases без ширины блоков и характерных паттернов

Решение блокирует US-3 dispatch до approve. Авторизация: фaza go/no-go по US-2 → US-3.

## 7 · Hand-off log

```
2026-05-08 · poseo: dispatch US-2, scope 4 макета С НУЛЯ
2026-05-08 · ba (US-2): ba.md done
2026-05-08 · sa-seo (US-2): sa-seo.md done — контракты per template (T1=4 schemas, T2=5, T3=4, T4=6)
2026-05-08 · poseo → 4 parallel agents: dispatch отрисовки T1/T2/T3/T4
2026-05-08 · agent T1 hub: 849 строк, 4 JSON-LD, 5 pillar cards, mobile-first OK
2026-05-08 · agent T2 pillar: 1998 строк, 5 JSON-LD, 8 sub-cards, 30 city-ссылок, 9 FAQ
2026-05-08 · agent T3 sub: 2069 строк, 4 JSON-LD, 5 methods, 4 FAQ, 3 related-cards, 0 city-ссылок (T3 differentiator)
2026-05-08 · agent T4 SD: 1563 строки, 6 JSON-LD, 170 hero words, 28 микрорайонов, 8 FAQ, 4 city-reviews, 5 related cities
2026-05-08 · poseo → leadqa: dispatch local-verify
2026-05-08 · leadqa: Playwright MCP 16 screenshots × axe-core@4.10.0 scan
2026-05-08 · leadqa: 0 critical × 4 templates, leadqa-2.md PASS
2026-05-08 · poseo → release: dispatch gate
2026-05-08 · release: 25/25 gates PASS, RC-USLUGI-US-2 ready
2026-05-08 · release → operator: APPROVE pending
```
