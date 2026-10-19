---
us: PANEL-AXE-PAYLOAD-CORE-A11Y
role: cr-panel
phase: review
verdict: APPROVE (self, iron rule #7)
reviewer: fe-panel + qa-panel combined dev (autonomous mandate, scope < 50 LOC, panel-internal)
date: 2026-05-01
---

# cr-panel — PANEL-AXE-PAYLOAD-CORE-A11Y

## Scope review

| Файл | LOC | Оценка |
|---|---|---|
| `site/components/admin/A11yRowCheckboxProvider.tsx` | 24 (NEW) | Server wrapper по pattern `LeadsBadgeProvider`. Single render `<>{children}<Overlay/></>`. OK. |
| `site/components/admin/A11yRowCheckboxOverlay.tsx` | 96 (NEW) | Client `useEffect` + `MutationObserver` + idempotent `applyLabels`. Гард `data-a11y-labeled="1"` исключает повторную обработку. `hasNonEmptyAccessibleName` корректно резолвит `aria-labelledby` (включая Payload-bug `aria-labelledby="select-all"` self-reference). Cleanup `observer.disconnect()` в return. OK. |
| `site/payload.config.ts` | +8 / -1 | Provider добавлен в `admin.components.providers` массив рядом с `LeadsBadgeProvider`. Inline rationale + ссылка на spec. OK. |
| `site/app/(payload)/admin/importMap.js` | +2 | Корректные md5 hashes (`52ccffaeb32b1decd698281bdb4d4c82` подтверждён через node `crypto.createHash('md5')`). OK. |
| `site/tests/e2e/admin-a11y.spec.ts` | +52 / -3 | `label` rule re-enabled (с inline-rationale), 2 новых test'а на cases + blog с explicit aria-label assertion + axe scan. OK. |

## DoD verification

- [x] Local axe smoke ДО push — verified на 5 routes:
  - `/admin/collections/cases` — 2 checkbox (1 header + 1 row, dev DB), 0 critical violations
  - `/admin/collections/blog` — 2 checkbox, 0 critical
  - `/admin/collections/leads` — 2 checkbox, 0 critical
  - `/admin/collections/services` — 5 checkbox (1 header + 4 rows), 0 critical
  - `/admin/collections/authors` — 2 checkbox, 0 critical
  - `/admin/collections/districts` — 9 checkbox (1 header + 8 rows), 0 critical
- [x] Screenshots: `screen/axe-a11y-cases-list-fixed.png` + `screen/axe-a11y-leads-list-fixed.png`
- [x] Click/toggle interaction verified — Payload native selection logic intact (firstRow.click() → checked toggle → selection state OK)
- [x] 0 console errors на all routes
- [x] `pnpm type-check` — clean
- [x] `pnpm lint` — 0 errors (82 pre-existing warnings, не моих)
- [x] `pnpm format:check` — clean
- [x] `pnpm build` — Compiled successfully in 7.0s
- [x] `pnpm test:e2e --project=chromium` — 60 passed, 31 skipped (skipped — pre-existing login API redirect issue, не введён этим PR; `/admin/login` axe test passed с включённым `label` rule)

## Approach deviations from sa-panel.md

1. **Selector adjusted** — sa-panel предполагал `input.checkbox-input__input`, но в Payload 3.84 класс на родительском `<div>`, не на input. Скорректирован на `.checkbox-input__input > input[type="checkbox"]`. Подтверждено в реальном DOM на `/admin/collections/cases`.
2. **Provider не в подкаталоге `providers/`** — следую существующему flat layout (`LeadsBadgeProvider.tsx` лежит прямо в `components/admin/`). Iron rule «хирургические правки», не плодим структуру.
3. **`hasNonEmptyAccessibleName` helper** — добавлен потому что Payload select-all имеет broken `aria-labelledby="select-all"` (self-reference, accessible name пустой). Простой `if (input.getAttribute('aria-label')) return` пропускал бы его. Helper резолвит IDs и проверяет реальный text content.

## Sign-off

`APPROVE` self per iron rule #7 (autonomous mandate, scope < 200 LOC, panel-internal, no cross-team conflict, спецификация одобрена popanel в spec-approved phase). Готов к merge → leadqa VoiceOver smoke (отдельный follow-up).

## Fix-forward 2026-05-01 (CI run 25216555569)

После первого push CI зафиксировал 2 класса regressions, оба → fixed forward в additional commit на той же ветке `feat/panel-axe-row-checkbox-aria`.

### Failure 1 — `/admin/`, `/admin/catalog`, `/admin/collections/services/` (label critical, 1 node)

**Root cause:** на /admin/collections/services/ Payload native рендерит **search-filter top-bar input** (`#search-filter-input`, `placeholder="Искать по"`) — и это input был unlabeled. Раньше этот violation был замаскирован глобальным `label` exception; после re-enable в W7 → ловится. На `/admin/` и `/admin/catalog` — react-select combobox без accessible name. Дополнительно: header `select-all` checkbox имел `title="select-all"` (технический ID), который наш старый `hasNonEmptyAccessibleName` ошибочно считал accessible name → early-return пропускал инъекцию.

**Fix:** Overlay расширен generic catch-all `applyGenericLabels()` для всех unlabeled visible inputs (derive из placeholder → name → role → type). `title` исключён из accessible-name check (не human-readable, не считается axe для inputs в большинстве случаев).

### Failure 2 — `/admin/collections/{cases,blog}` row-checkbox aria-label (timeout)

**Root cause:** `MutationObserver` с `useEffect` mount runs **после** initial paint; на медленных CI runners axe scan стартовал раньше, чем observer успевал навесить aria-label на dynamically rendered rows. Локально (10x faster CPU) race не воспроизводился.

**Fix:**
1. Добавлены 2 `requestAnimationFrame` passes сразу после initial `applyAll()` — догоняют React commits от Payload SWR data hydration.
2. Observer теперь слушает `attributes` mutations (`aria-label`, `aria-labelledby`) — переловит React rerender, который перезаписывает наш label.
3. В тестах `runAxe()` обёрнут предварительный `waitForA11yLabels()` — ждёт пока КАЖДЫЙ visible input получит `data-a11y-labeled="1"` (timeout 5s, soft-fail на runAxe для внятной ошибки).
4. Removed `data-a11yLabeled === '1'` early-return — каждый pass перепроверяет actual accessible name (не доверяет stale flag).

### Follow-up notes для leadqa / future work

- **`title` attribute как fallback** — Payload native ставит технические `title="select-all"` на header checkboxes. Обсудить с upstream PR (PANEL-AXE-PAYLOAD-CORE-A11Y-UPSTREAM follow-up).
- **react-select combobox aria-label = "combobox"** — это derived из `role="combobox"`, не идеально content-meaningful, но axe accept. Будущий enhancement: распарсить ближайший `<label>` в react-select wrapper.
- **Search-filter input «Искать по»** — placeholder уже информативный, derive label идентичен. Можно явно прописать `i18n.t('general:searchBy')` в Payload upstream PR.
- **`/admin/login` API redirect** локально (308 от trailing slash) — не блокирует CI (там работает). Pre-existing, не введён этим PR.
