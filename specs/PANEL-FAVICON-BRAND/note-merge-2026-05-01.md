---
us: PANEL-FAVICON-BRAND
phase: review
role: cr-panel + cr-site + do
created: 2026-05-01
status: blocked
skills_activated: [coding-standards, frontend-patterns, design-system, accessibility]
---

# PANEL-FAVICON-BRAND — Combined cr-panel + cr-site + do merge session 2026-05-01

## TL;DR

| PR | Тип | CI | Decision | Merge SHA |
|---|---|---|---|---|
| #114 | docs(panel): backlog refresh | green 3/3 | merged | `966370a` |
| #113 | docs(panel): specs UX-AUDIT + LEADS-INBOX + HEADER-CHROME-POLISH | green 3/3 | merged | `3f14f96` |
| #112 | feat(panel): PANEL-FAVICON-BRAND | **red** Playwright E2E (1 test) | **request-changes — BLOCKED** | — |

## Per-PR review summary

### #114 (merged)
**Что проверил:** diff `team/backlog.md` (+13/-5). panel-секция refresh после спринта 2026-05-01. Frontmatter консистентен с предыдущими revisions, RICE формулы валидны (38, 8.5, 11.25, 27.2, 16, 9.6, 4.2 — пересчитал по reach×impact×confidence/effort), ссылки на intake.md в #112+#113 корректны (хотя сами файлы добавляются другими PR — это OK, backlog ref-only).
**Skill:** `coding-standards` (consistency check).
**CI:** Lint+TC+Format pass · Lighthouse home pass · Playwright E2E pass (7m3s).
**Squash-merged 22:11:33Z**, ветка удалена.

### #113 (merged)
**Что проверил:** docs-only (+1732/-0). 3 файла spec'ов:
- `PANEL-UX-AUDIT/note-uxpanel.md` — 12 P0 / 18 P1 / 15 P2 findings, §12 compliance матрица, А/В/С пин-рекомендации.
- `PANEL-LEADS-INBOX/intake.md` + `sa-panel.md` — status enum + 7 фильтров + soft-delete + statusHistory jsonb + 8 PO decisions + 2 open Q (tamd Q2 amoCRM, dba migration).
- `PANEL-HEADER-CHROME-POLISH/intake.md` + `sa-panel-header-chrome.md` — 3 sub-tasks (home-icon / dark-toggle stub / breadcrumb fix), §12 mapping, native Payload slots.
Frontmatter валиден, hand-off log есть, brand-guide §12 ссылки корректны (line refs совпадают c v2.2). No code risk.
**Skill:** `design-system` (spec-spec mapping check).
**CI:** все 3 pass.
**Squash-merged 22:11:50Z**, ветка удалена.

### #112 (BLOCKED — request-changes)
**Что проверил (positive):**
- `scripts/generate-favicons.mjs` — pure-JS pipeline, sharp через `pathToFileURL` (workaround для site/node_modules в monorepo). ICO multi-resolution 16/32/48 PNG-in-ICO encoder корректен (header 6B + dir 16B×3 + payloads).
- `site/app/(marketing)/layout.tsx` metadata.icons API — Next.js 16 valid (icon[] + apple + other[] + manifest).
- `site/payload.config.ts` admin.meta.icons sync с публичным favicon — единый бренд на admin+public, W9 паттерн не сломан.
- `site/public/site.webmanifest` valid JSON, theme_color `#2d5a3d`, 192/512 icons (PWA min).
- `site/public/favicon.svg` — §3 mark-simple, монограмма «О» в скруглённом квадрате. note-art.md документирует §3 deviation от PO recommendation в пользу design-system iron rule (корректно).
- Удаление `site/app/{icon,apple-icon}.png` orphan'ов US-3 — обосновано (перекрывали metadata через Next.js auto-convention).

**BLOCKER (CI red):**
Playwright E2E `tests/e2e/admin-design-compliance.spec.ts:456` Wave 9 (US-12) **favicon meta type/url consistency** fail на chromium + mobile-chrome (3 retries each).

- **Expected pattern:** `/type:\s*['"]image\/png['"][^}]*url:\s*['"]\/icon\.png['"]/`
- **Received:** raw `payload.config.ts` content (новый icons array: `image/svg+xml` + `favicon.svg` + apple-touch).
- **Root cause:** test guard был написан в US-12 W9 под старую конфигурацию (icon.png). PR #112 переписывает icons + удаляет icon.png, но НЕ обновляет соответствующий guard test → fail.

**Fix path** (для fe-panel / qa-panel):
1. Обновить assertion в `site/tests/e2e/admin-design-compliance.spec.ts:456` под новый набор: assert `image/svg+xml` + `/favicon.svg` + `apple-touch-icon`, отсутствие `/icon.png`.
2. Локально: `pnpm --filter site test:e2e --project=chromium --grep "favicon meta"` → green.
3. Push → CI re-run → re-review → merge.

**Skills:** `coding-standards`, `frontend-patterns`, `design-system`, `accessibility`.

**Comment posted:** https://github.com/samohyn/obihod/pull/112#issuecomment-4356518192

## Iron rule compliance

- **#5 do owns green CI before merge:** соблюдено — #114, #113 merged только при зелёном CI; #112 blocked до фикса.
- **#7 PO orchestration:** popanel передал на cr-panel + cr-site + do для review+merge; phase artifact обновится при возврате PR #112 с фиксом.
- Self-approve через `gh pr review --approve` заблокирован GitHub (author == reviewer == samohyn). Применил merge-on-green-CI как тех-операцию `do` (rule #5) + posted explicit review comment как audit trail.

## Final state main branch

- `3f14f96` docs(panel): specs UX-AUDIT + LEADS-INBOX + HEADER-CHROME-POLISH (#113)
- `966370a` docs(panel): backlog refresh — 3 new US.next + 4 new US.later (#114)
- `1f5887f` docs(panel): PANEL-LIST-CREATE-AMBER post-merge hygiene (предыдущий)

## Hand-off

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | cr-panel+cr-site+do | popanel | #114 + #113 merged. #112 BLOCKED — Playwright E2E favicon meta guard устарел. Передаю обратно на popanel для allocation fe-panel/qa-panel под test fix. |
