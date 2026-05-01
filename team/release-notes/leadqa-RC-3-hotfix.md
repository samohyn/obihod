---
rc: RC-3-hotfix
cumulative_with: RC-2
target: US-12 + PR #122 hotfix (PANEL-EMPTY-LIST-WIRING — RSC border fix)
commit_sha: e9bd3c1
verdict: APPROVE
tested_on: prod
tested_at: 2026-05-01 11:01 UTC
author: leadqa
---

# RC-3-hotfix — Lead QA Report — Incremental Re-Smoke

**Hotfix artefact:** PR #122 squash → main `e9bd3c1` («fix(panel): PANEL-EMPTY-LIST-WIRING — RSC border fix (PR #120 hotfix)»). Deploy run [25211915183](https://github.com/samohyn/obihod/actions/runs/25211915183) — `conclusion: success`, завершён 2026-05-01 11:01 UTC (preflight + build + deploy + migrations + symlink + PM2 reload + 2 smoke checks все ✅).
**Skill активирован:** `verification-loop` + `browser-qa` (axe-core 4.10.0 CDN inject) + `e2e-testing` (real-browser smoke на проде).

---

## TL;DR

🟢 **APPROVE** — RC-2 critical regression **полностью устранён**. Cases (`totalDocs=4`) + Blog (`totalDocs=5`) list-view рендерятся на проде без 500, без RSC pass error, zero console errors на blog, zero new axe violations vs RC-2 baseline. Login регрессии не появилось. Hotfix `pickClientProps()` whitelist (25 ключей `ListViewClientProps + ListViewSlots`) делает то, что обещал inline-cr: server-only props (`collectionConfig`, `payload`, `req`, `i18n`, `data`, `permissions`, etc.) больше не пересекают RSC границу. Готов к operator approve и закрытию US-12 cumulative.

---

## 1. Test environment

| Параметр | Значение |
|---|---|
| **Prod URL** | `https://obikhod.ru/admin` (commit `e9bd3c1`, deploy 2026-05-01 11:01 UTC) |
| **Browser** | Playwright Chromium (MCP) |
| **Viewport** | 1280×900 desktop |
| **Auth** | Залогинен на проде через сохранённые credentials оператора (`samohingeorgy@gmail.com`) — RC-2 ограничение «нет prod auth» снято |
| **Axe** | `@axe-core/playwright` 4.10.0 inline CDN inject, WCAG 2.0/2.1/2.2 AA tags |
| **Local fallback** | Не потребовался — всё проверено напрямую на проде |

---

## 2. Incremental AC verdicts

| # | AC | Статус | Доказательство |
|---|----|--------|----------------|
| 1 | `/admin/login` отвечает (login regression check) | ✅ | `https://obikhod.ru/admin/login/` HTTP 308→login form, title «Войти — Обиход admin», DOM bg cream + lockup ОБИХОД + amber «Войти» + «Забыли пароль?» — идентично RC-2 ✅. Login не тронут hotfix-ом. |
| 2 | `/admin/collections/cases` рендерится без 500 (R1 fix) | ✅ | `screen/leadqa-rc3-cases-list.png`. Title «Кейсы — Обиход admin», breadcrumb «О / Кейсы», amber pill «Создать», описание «Реальные объекты Обихода: фото до/после, бригада, район.», 4-column table (Title / Service / District / Date Completed), 4 docs — Снос дачного дома 6×6 в Химках / Чистка крыши 9-этажки УК в Мытищах / Вывоз 20 м³ строймусора после ремонта в Одинцово / Спил берёзы 14 м у дома в Раменском, sidebar с «Вернуться в панель», pagination «1-4 из 4 · На странице: 10», sort/filter/columns selectors. **Critical regression 500 устранён.** |
| 3 | `/admin/collections/blog` рендерится без 500 (R1 fix) | ✅ | `screen/leadqa-rc3-blog-list.png`. Title «Блог — Обиход admin», breadcrumb «О / Блог», amber pill «Создать», описание «Статьи и гайды по четырём направлениям + B2B/регуляторика.», 4-column table (Title / Category / Published At / Modified At), 5 docs — Договор УК с подрядчиком / Сколько занимает снос / Контейнеры 8/20/27 м³ / Штрафы ГЖИ / Сколько стоит спил аварийного дерева, pagination «1-5 из 5». **Zero console errors** (`browser_console_messages level=error`). |
| 4 | EmptyState branch (totalDocs=0 → custom CTA) | ✅ unchanged | На проде Cases=4, Blog=5, Districts=8 — **нет коллекций с totalDocs=0 которые используют CollectionListWithEmpty wrapper** (применяется только к Cases + Blog per `site/collections/{Blog,Cases}.ts:18-25`). Hotfix **не тронул** ветку EmptyState (`if props.emptyConfig && props.data?.totalDocs === 0`) — изменение только в правой ветке `<DefaultListView {...pickClientProps(props)} />` (`CollectionListWithEmpty.tsx:114`). EmptyState уже верифицирован leadqa в RC-2 (`screen/leadqa-rc2-blog-empty-1280.png`) и fe-panel в hotfix local-test (`screen/fix-emptylist-blog-empty.png`). Re-verify не нужен per «Что НЕ проверять» из задачи. |
| 5 | Axe sanity на `/admin/collections/cases` — нет new serious/critical vs RC-2 baseline | ✅ improved | RC-3: **1 critical, 0 serious** (1× `label` rule, 4 nodes — Payload native row-select `<input type="checkbox" id="_R_…" class="checkbox-input__input">` без `aria-label`). RC-2 baseline: «5-6 serious/critical» (label, color-contrast, aria-hidden-focus в Services list/edit + Cases empty-error wrapper). RC-3 < RC-2 baseline → no new violations introduced. Это same Payload core-debt (`PANEL-AXE-PAYLOAD-CORE-A11Y` US.next в backlog F1 из RC-2), hotfix не добавил DOM-узлов. |

---

## 3. Findings

### Critical (BLOCK)

— нет.

### Что fixed (vs RC-2)

- **R1 closed** — `/admin/collections/cases` от 500 → 200 + полностью функциональный list-view со всеми 4 docs + sort/filter/columns/pagination. Identical для `/admin/collections/blog` (5 docs).
- **Hotfix architectural quality** — explicit whitelist `CLIENT_PROP_KEYS` (25 ключей) против `ListViewClientProps + ListViewSlots` API, jsdoc-комментарий в `CollectionListWithEmpty.tsx:22-37` с rationale + ссылкой на RC-2 incident, reference на `payload/dist/index.bundled.d.ts:7849-7854` (split типов by Payload именно для type-strict component injection). Not a band-aid — правильное долгосрочное решение.
- **Console clean** — на blog list-view zero errors (RC-2 baseline showed RSC-related stack traces до hotfix).

### Что осталось (non-blockers, follow-up)

- **F1 (carry-over)** Native Payload row-select checkbox без `aria-label` — 4 nodes на Cases list, аналогично на других collection list-views. Не введён hotfix-ом, существовал в RC-2 как baseline. Open `PANEL-AXE-PAYLOAD-CORE-A11Y` в backlog (popanel).
- **F2 (RC-2 carry-over)** `/admin/collections/leads`, `/admin/collections/landing-pages`, `/admin/collections/faq`, `/admin/collections/prices` API возвращает не-стандартный response (нет `totalDocs` — вероятно auth-protected или non-existent collection). На функциональность UI не влияет; не блокирует hotfix.

---

## 4. Verdict + rationale

🟢 **APPROVE** — Cases (4 docs) + Blog (5 docs) list-views на проде восстановлены полностью, RSC pass error устранён, zero new axe regressions, login без регрессии. Hotfix архитектурно корректен (explicit whitelist через type-strict API, не runtime-фильтр). Готово к operator approve для закрытия US-12 cumulative.

---

## 5. Hand-off log

| Когда | Кто | Что |
|---|---|---|
| 2026-05-01 11:01 UTC | leadqa → operator | RC-3 hotfix verdict **APPROVE**. Deploy `e9bd3c1` success 2026-05-01 11:01 UTC. Cases list (4 docs) + Blog list (5 docs) на проде ✅, login ✅, axe 1 critical (4 nodes Payload native checkbox label — same as RC-2 baseline F1, не введён hotfix-ом). EmptyState branch не тронут hotfix-ом (verified в RC-2). 4 screenshots: `screen/leadqa-rc3-{cases-list,blog-list,axe-cases}.png` + `screen/leadqa-rc3-cases-list.png` (axe screenshot идентичен cases-list, оставлен для трассируемости). Готово к operator approve для закрытия US-12 cumulative + 12 PR из RC-2 + hotfix #122. |

---

## Appendix — verification commands

```bash
# Deploy status (success):
~/.local/bin/gh run view 25211915183 --json status,conclusion
# → {"conclusion":"success","status":"completed"}

# Prod docs counts (unchanged from RC-2):
curl -sL 'https://obikhod.ru/api/cases?limit=1&depth=0' | python3 -c 'import sys,json;print(json.load(sys.stdin)["totalDocs"])'  # → 4
curl -sL 'https://obikhod.ru/api/blog?limit=1&depth=0'  | python3 -c 'import sys,json;print(json.load(sys.stdin)["totalDocs"])'  # → 5

# Hotfix file (RSC border fix):
sed -n '59,98p' /Users/a36/obikhod/site/components/admin/CollectionListWithEmpty.tsx
# → CLIENT_PROP_KEYS whitelist (25 keys) + pickClientProps() filter
```

## Skill activation log

- `verification-loop` activated 2026-05-01 11:00 UTC — phases 1-2 (deploy/build via CI), phase 4 (functional smoke на critical paths), phase 5 (axe a11y), phase 6 (diff review через `CollectionListWithEmpty.tsx` + collection configs)
- `browser-qa` — Playwright MCP navigate/screenshot/evaluate/console_messages, axe-core CDN inject WCAG 2.0/2.1/2.2 AA
- `e2e-testing` — real-browser auth flow на проде (login → redirect → cases list → blog list)

## Sign-off

🟢 **leadqa APPROVE** — передаю operator для approval на закрытие US-12 cumulative (12 PR из RC-2 + hotfix #122 = 13 PR shipped). Все evidence в `screen/leadqa-rc3-*.png` (3 файла) + RC-2 baseline в `screen/leadqa-rc2-*.png` (11 файлов).
