---
role: fe-panel + fe-site (combined)
us: PANEL-FAVICON-BRAND
phase: dev-complete
status: verify-passed
created: 2026-05-01
skills_activated: [frontend-patterns, nextjs-turbopack]
---

# PANEL-FAVICON-BRAND — fe wiring complete

## Skill activation (iron rule)

Перед правкой активированы:
- `frontend-patterns` — Next.js 16 metadata API conventions, root-layout composition.
- `nextjs-turbopack` — file-system convention для favicon (`app/favicon.ico` auto-injected) + явный metadata.icons[] для apple-touch / SVG / PWA-icons.

## Files changed

| Файл | Дифф one-liner |
|---|---|
| `site/app/(marketing)/layout.tsx` | + `icons: { icon, apple, other }` + `manifest: '/site.webmanifest'` в существующий `export const metadata: Metadata` (после `robots`). Title/description/openGraph не тронуты. |
| `site/payload.config.ts` | `admin.meta.icons[]`: было 2 entries (`favicon.ico` + `icon.png`), стало 3 — заменили `icon.png` на `favicon.svg` (modern browsers prefer SVG) + добавили `apple-touch-icon`. W9 comment сохранён, добавлен PANEL-FAVICON-BRAND comment 2026-05-01. |

## Files created

| Файл | Размер | Назначение |
|---|---|---|
| `site/public/site.webmanifest` | 358 B | PWA-ready минимум: name «Обиход», theme_color `#2d5a3d` (бренд primary §4), background_color `#f0ead8` (on-primary §3), display `browser` (НЕ standalone — не делаем full-PWA в этом US), 2 icon-размера (192/512). |

## Important deviation: layout.tsx target

Intake указывал `site/app/layout.tsx` как target, но в проекте его НЕТ — есть только route-group layouts:
- `site/app/(marketing)/layout.tsx` — public site (имеет `export const metadata: Metadata` с title/description/og/robots) ← edited
- `site/app/(payload)/layout.tsx` — admin (auto-generated `/* DO NOT MODIFY */`, без metadata) ← НЕ trogал

Решение: editировал `(marketing)/layout.tsx` — это де-факто root layout публичного сайта, покрывает все routes под `(marketing)` группой (`/`, `/uslugi/*`, `/raiony/*`, `/blog`, `/b2b`, etc.). Admin покрыт через `payload.config.ts admin.meta.icons[]` (отдельный механизм Payload, edit #2 выше).

## Orphan-files note (не трогал per surgical-edit iron rule)

| Файл | Дата | Статус |
|---|---|---|
| `site/app/icon.png` | Apr 24 (676 B) | Старый Next.js auto-convention asset (pre-PANEL-FAVICON-BRAND). Next.js 16 рендерит его как `<link rel="icon" href="/icon.png?...">` в head автоматически. Может конфликтовать с metadata.icons. **Рекомендация для popanel:** удалить в отдельной surgical PR (либо заменить на свежий бренд-icon через scripts/generate-favicons.mjs если оставить convention-driven путь). |
| `site/app/apple-icon.png` | Apr 24 (4284 B) | То же — старый auto-convention asset, Next.js 16 авто-рендерит `<link rel="apple-touch-icon">`. Конфликтует с моим `/apple-touch-icon.png` через metadata API. **Рекомендация:** удалить — `site/public/apple-touch-icon.png` от art покрывает. |

Эти 2 orphans — pre-existing, не созданы wiring task. Per iron rule «хирургические правки» — упомянул, не удалил. popanel решает priority cleanup-PR.

## Local verify (pre-push CI gate)

| Check | Result | Output |
|---|---|---|
| `pnpm type-check` (tsc --noEmit) | OK | Exit 0, no errors |
| `pnpm lint` (eslint .) | OK | 0 errors, 82 warnings (все pre-existing, не в touched files) |
| `pnpm format:check` (prettier --check .) | OK | "All matched files use Prettier code style!" |

Все 3 — green. Iron rule «do owns green CI before merge» satisfied (do получит зелёный CI на push).

## Что НЕ сделано (out of scope per intake)

- Не правил `scripts/generate-favicons.mjs` (art-owned).
- Не правил favicon-assets (art-frozen).
- Не делал git commit (popanel + do).
- Не запускал dev-server / browser-smoke (это leadqa post-merge per release-cycle).
- Не делал PWA service-worker (display: browser, не standalone).

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | fe-site + fe-panel | wiring task assigned после art delivery (5 assets + scripts/generate-favicons.mjs) |
| 2026-05-01 | fe-site + fe-panel | popanel | wiring complete — 3 файла + 1 new (`site.webmanifest`). Local CI green (type-check + lint + format:check). Orphan `app/icon.png` + `app/apple-icon.png` отмечены для opt-in cleanup. Ready для cr-panel + cr-site review → release gate. |
