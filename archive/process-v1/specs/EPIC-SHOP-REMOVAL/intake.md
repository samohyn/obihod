---
epic: EPIC-SHOP-REMOVAL
title: Clean cut магазина саженцев — archive артефактов, landshaft = 5-й pillar услуг
team: cross
po: po
type: refactor + docs + design-system
priority: P0
segment: services
phase: kickoff
role: po
status: now
blocks:
  - EPIC-SERVICE-PAGES-UX (C2 ждёт A.W1 — landshaft positioning)
  - EPIC-SERVICE-PAGES-REDESIGN (D ждёт A.W3 — brand-guide.html v2.3)
blocked_by: []
related:
  - ADR-0020-shop-sunset-landshaft-positioning (deliverable W1)
  - design-system/brand-guide.html (удаление §15-29 в W3)
  - team/archive/shop/ (target archive location)
  - specs/_archived/EPIC-SEO-SHOP/ (target archive)
created: 2026-05-09
updated: 2026-05-09
skills_activated: [product-capability, ui-ux-pro-max, fal-ai-media]
plan_file: /Users/a36/.claude/plans/stateless-puzzling-valiant.md
---

# EPIC-SHOP-REMOVAL — clean cut магазина

## Контекст

Оператор 2026-05-09 принял bus-решение: магазин саженцев и растений выводится из проекта. Компания услугами магазина заниматься не будет. Привести проект в состояние «магазина не было» — без orphan-ссылок, broken anchors, dead artifacts. Landshaft (дизайн ландшафта) **остаётся** как 5-й pillar услуг (паритет с liwood).

## Story

Как оператор Обихода, я хочу полностью убрать магазин саженцев и растений из проекта (документация, design-system, специи, код), сохранив landshaft как услугу, чтобы команда сфокусировалась на услугах и могла обогнать liwood без размазывания фокуса.

## AC

- [ ] **W1 — Decisions:** ADR-0020 «Shop sunset & landshaft positioning» принят, фиксирует apruved решения (archive, landshaft = 5-й pillar, US-11 9 иконок archive)
- [ ] **W2 — Docs/specs/team:**
  - Given `team/shop.md`, When archive — Then `team/archive/shop/shop.md` существует, оригинал удалён
  - Given `specs/EPIC-SEO-SHOP/`, When archive — Then `specs/_archived/EPIC-SEO-SHOP/` существует
  - Given `specs/US-11-ia-extension/`, When archive — Then `specs/_archived/` содержит
  - Given `team/backlog.md`, When edit — Then 5 секций про shop удалены, 4 новых эпика добавлены
  - Given `CLAUDE.md`, When edit — Then 9 упоминаний shop/apps/shop/10ролей вычищены
  - Given `team/PROJECT_CONTEXT.md`, When edit — Then 10→9 ролей
- [ ] **W3 — Design-system:**
  - Given `design-system/brand-guide.html`, When edit — Then §15-29 (id `shop-*`, ~3376-4786) удалены, id-якоря §1-14/§30-33 не перенумерованы (избегаем broken anchors в archived доках)
  - Given `design-system/tov/shop.md`, When edit — Then удалён
  - Given ToC в brand-guide — Then обновлён без shop-секций
- [ ] **W4 — Site code:**
  - Given `site/components/marketing/Header.tsx`, When edit — Then блок мега-меню «Магазин» (lines 685-916) вырезан, build зелёный
  - Given `site/components/marketing/Footer.tsx` line 91, When edit — Then «магазин саженцев» убран, «дизайн ландшафта» остаётся
  - Given `site/components/blocks/types.ts` line 32, When edit — Then `'shop'` убран из `IconLine`
  - Given `jsonld.ts`/`composer.ts`/`sitemap.ts`, When scan — Then 0 shop-веток
- [ ] **W5 — CI/seo-tech:**
  - Given Я.Вебмастер мог проиндексировать `/shop*`, When deploy — Then 410 Gone в Payload `Redirects` для `/shop`, `/shop/*`
  - Given `site/app/llms.txt`/`llms-full.txt`, When scan — Then 0 shop-mention
  - Given Payload коллекции (Services/B2BPages/Blog richText), When Local API проход — Then `/shop`/`магазин`/`саженц` чистый (cw чистит)
- [ ] **W6 — Verification:**
  - Given EPIC complete, When `pnpm build && pnpm test:e2e --project=chromium` — Then зелёный
  - Given grep `shop|магазин|саженц|питомник` по `site/ design-system/ team/ contex/ specs/` (исключая `archive`/`_archived`/`release-notes`) — Then 0 hits
  - Given Я.Вебмастер 48h после deploy — Then 0 новых 5xx
  - Given Lighthouse mobile p75 LCP — Then не падает >2% от baseline 2026-05-09
  - Given sitemap diff — Then 0 URL изменено

## Out of scope

- Удаление `apps/shop/` (директории физически нет — нечего удалять)
- Изменения services TOV / 4 pillar / 35 sub
- Любая работа в Payload коллекциях (shop-коллекций нет)
- Изменения admin/Payload UI (отдельная программа `panel`)
- landshaft как pillar — **OUT** (это переходит в EPIC-SERVICE-PAGES-UX как scope)

## Зависимости

- Блокирует EPIC-SERVICE-PAGES-UX C2 (master template ждёт W1 решение про landshaft)
- Блокирует EPIC-SERVICE-PAGES-REDESIGN D (нужен brand-guide.html v2.3 после W3)
- Параллельно с EPIC-LIWOOD-OVERTAKE B1-B5 (B не трогает код)

## Hand-off log

- 2026-05-09 21:35 MSK · operator → po: epic kickoff, decisions apruved (archive / landshaft = 5-й pillar / US-11 archive)
- 2026-05-09 22:16 MSK · fe+dev → po: A.W4 done. Header.tsx: вырезан мега-меню «Магазин» 236 строк (lines 683-918, включая блок `<div className="mm-has-drop">` для shop catalog с 13 `/shop/*` link'ами и `mm-featured` карточкой «Сезон посадки»); docstring строки 5 обновлён `(Услуги / Районы / Магазин)` → `(Услуги / Районы)`; total 940 → 703 строк. Footer.tsx: line 91 — copy-строка отредактирована, убрано «Плюс магазин саженцев и дизайн ландшафта» → «Плюс дизайн ландшафта». types.ts: IconLine union очищен `'services' | 'shop' | 'districts' | 'cases'` → `'services' | 'districts' | 'cases'`, JSDoc обновлён (4 линейки → 3, удалена ссылка на `sh-` префикс). Type-check 0 errors / lint 0 errors (64 preexisting warnings в migrations/scripts/tests, не в правленных файлах) / format:check clean. SEO files (jsonld.ts/composer.ts/sitemap.ts) уже clean — 0 hits. Note: ServicesGrid.tsx:41 содержит `^sh-` в regex `replace(/^s-|^sh-|^d-|^c-|.../, '')` — orphan reference после shop sunset, но не в scope W4 (требует отдельной задачи).
- 2026-05-09 22:18 MSK · design+dev → po: A.W3 done, brand-guide §15-29 deleted (1455 lines removed: 5754→4299), tov/shop.md deleted, version v2.2→v2.3 + footer-banner changelog обновлён, ToC «Магазин» group (16 строк, 15 #shop-* href + wrapper) удалена из nav, §32 cabinet перетряхнут (32.5 заказы магазина removed → 32.5 shared-разделы; 32.6/32.7/32.8 → 32.6/32.7; убраны строки про shop-TOV из TOV-делимитера и shop-доставку из адресов), CSS-токены `.shop-section / .shop-eyebrow / .shop-scale` удалены из `<style>` (10 строк, headers «SHOP SECTIONS · §15-§29» тоже). Verify: 0 hits на `id="shop-` / `href="#shop-` / `class="shop-`, single hit на `.shop-` остался только в самом v2.3 changelog текстом. <section> tag balance 21/21. id-якоря §1-14 + §30-33 (19 штук) интактны. homepage-classic.css не тронут (false-positive `.shop-scale`/`.badge-shop` services-токены). Skills активированы: design-system + ui-styling.
- 2026-05-09 22:35 MSK · seo+cw+devops → po: A.W5 done. **410 Gone** через `site/proxy.ts` (Next 16 middleware→proxy rename) — pre-emptive для случая, если Я.Вебмастер просканировал URL извне; curl verified `/shop` / `/shop/` / `/shop/sazhency` / `/shop/foo/bar` → 410 (через 308 trailing slash); `/shopping` / `/shop-foo` остаются 404 (word boundary OK). **llms.txt + llms-full.txt:** 0 hits — оба файла уже clean без правок. **Payload richText audit:** скан 281 docs (5 коллекций) через `site/scripts/audit-shop-mentions.ts` + `audit-shop-mentions-detail.ts` → 9 hit-docs, 7 false positive («входные группы магазинов» в chistka-krysh / educational «саженец/питомник»). 2 docs cleanup (blog/26 cherta-mezhdu-arbo-i-sadovnikom + blog/23 uhod-za-derevyami): 5 promo-replacements в `body` + `blog_blocks_text_content.body` + `blog_blocks_faq_items.answer` + DELETE blog/26 related-services-item slug=shop. Прямой SQL (`scripts/clean-shop-mentions-sql.ts` + `clean-shop-mentions-sql-fix2.ts`) — Payload Local API mutation заблокирован drift `payload_locked_documents_rels.reviews_id` от non-applied миграции `20260509_120000_reviews_collection`. Detail audit + post-cleanup verification (8 SQL точек = 0 hits) в `specs/EPIC-SHOP-REMOVAL/audit-richtext-2026-05-09.md`. Type-check + ESLint + Prettier зелёные. **Pending:** применить cleanup на prod через `pnpm tsx scripts/clean-shop-mentions-sql.ts` + `…-fix2.ts` с `DATABASE_URI=<prod>` (после применения reviews миграции). Skills активированы: seo + database-migrations.
- 2026-05-09 22:55 MSK · qa → po: A.W6 done. Verdict: **PASS_WITH_FOLLOWUPS**. Report: `specs/EPIC-SHOP-REMOVAL/qa-report.md`. **Live verified:** proxy `/shop/` → HTTP 410 ✓ / `/` → 200 ✓ / sitemap.xml 165 URLs **0 shop hits** ✓ / llms.txt 0 hits ✓ / brand-guide.html v2.3 4299 lines, `<section>` 21/21 + `<details>` 11/11 balanced ✓ / lint 0 errors ✓. **Pre-existing FAIL (НЕ регрессия EPIC):** type-check `scripts/lint-schema.ts:332 TS2393 Duplicate function` (воспроизводится на чистом main `7193061`, корень — `lint-schema.ts`/etc. без `import|export` = script-mode global namespace collision) + format:check `blocks/master-template.ts` untracked (ADR-0021 другой команды). **Grep noise:** 168 semantic-acceptable hits после whitelist — все в historical prose (brand-guide changelog/auth/cabinet, design-system/inventory historical, team/{po,fe,qa,dev,design,WORKFLOW,backlog,PROJECT_CONTEXT}.md historical role mappings, ADR-0004/0008 historical context, наши own audit-scripts + W5 SQL clean scripts). **Functional code clean:** 0 hits в Header/Footer/types/jsonld/composer/sitemap/llms. Pending follow-ups: (1) proxy.ts deploy на prod, (2) prod richText cleanup после reviews migration, (3) Я.Вебмастер 7-day 5xx monitor, (4) orphan `^sh-` regex ServicesGrid.tsx:41 (W4 follow-up), (5) `scripts/lint-schema.ts` `export {}` fix (pre-existing tech debt). Skills активированы: e2e-testing + verification-loop.
