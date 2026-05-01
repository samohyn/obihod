---
title: team/backlog.md — cross-team execution plan
owner: cpo
last_update: 2026-05-01
update_protocol: каждый PO команды держит свою секцию; cpo даёт общую приоритизацию
---

# Backlog — Обиход

Единый источник execution-плана для 7 команд. Linear отключён 2026-04-29 — всё здесь + в `specs/<EPIC|TASK>/<US>/`.

## Легенда статусов

| Статус | Значение |
|---|---|
| `now` | в работе (dev/qa/cr) или dev-ready, sa-<team>.md approved |
| `next` | spec written, ждёт kick-off в текущем эпике |
| `later` | идея в беклоге, нужна спека |
| `blocked` | блок внешним фактором — указать чем |
| `done` | смержено, продакшен |
| `dropped` | отменено — указать дату + кем + почему |

## RICE (для приоритизации внутри секции команды)

`Score = (Reach × Impact × Confidence) / Effort`

- **Reach (1-5):** как часто оператор/пользователь сталкивается (1=редко, 5=ежедневно)
- **Impact (1-5):** размер боли/ценности (1=cosmetic, 5=критично)
- **Confidence (0.5-1.0):** уверенность в оценках (0.5=guess, 1.0=validated)
- **Effort (ЧД):** командочеловеко-дни

## MoSCoW

`M` Must · `S` Should · `C` Could · `W` Won't (этот цикл)

---

## panel · Admin Payload

**PO:** popanel · **branch:** feature-ветки от `main` (по pattern PR #99) · **last update:** 2026-05-01

### Now — autonomous mandate active (operator 2026-05-01)

(US-12 release closure ✅ closed 2026-05-01 11:15 UTC. cpo retro: [US-12-retro.md](../team/release-notes/US-12-retro.md). PANEL-AUTH-2FA + PANEL-LEADS-INBOX shipped 2026-05-01. Operator-блокеров нет — popanel ведёт автономно.)

### Next — dev-ready / dev-queued (autonomous mandate)

_(пусто — все dev-ready задачи из Next закрыты или передвинуты в Later)_

### Later — 4 spec-approved + 1 cpo retro follow-up

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| PANEL-MEDIA-LIBRARY | Media grid + filters + orphan detection + bulk cleanup + per-asset detail | be-panel + fe-panel + qa-panel | 1.5 чд | 3.6 | C | [sa-panel.md](../specs/PANEL-MEDIA-LIBRARY/sa-panel.md) — spec ready 2026-05-01, dev-ready (no ADR) |
| PANEL-LEADS-INBOX-V2 | Bulk actions (§ C.1) + date-range/source UI (§ B.3-B.4) + composite index (defer until volume >1000) + ConfirmDialog для bulk «Спам». Phase 3 follow-up к LEADS-INBOX | be-panel + fe-panel + qa-panel | 1 чд | tbd | C | new 2026-05-01 (LEADS-INBOX dev defer); spec-pending |
| PANEL-DASHBOARD-V2 | HTML5 drag-drop widgets + `users.dashboardLayout` persistence + 5 widgets registry | fe-panel + be-panel + qa-panel | 2 чд | 1.5 | W | [sa-panel.md](../specs/PANEL-DASHBOARD-V2/sa-panel.md) — spec ready 2026-05-01, dev-ready (priority W — после M/S/C) |

### Blocked

(блокеров нет — COMMON-SCRIPTS-RUNTIME-FIX закрыт ADR-0009 2026-04-29)

### Done

| ID | Что | Дата merge |
|---|---|---|
| **PANEL-RSC-LINT** | 3-layer defense: shared `pickClientProps()` utility + custom ESLint rule `obikhod/no-spread-server-props-in-client` (scope `components/admin/**` + `app/(payload)/**`) + Playwright runtime smoke spec на 7 коллекциях. Phase 2 verdict: build-custom (npm community plugin не подходит, Next.js 16 `next lint` removed). Prevents RC-2 #120 повтора | 2026-05-01 (TBD-MERGE-COMMIT) |
| **PANEL-GLOBAL-SEARCH** | Cmd+K top-bar search 7 коллекций + Districts (pg_trgm UNION + post-filter access). 57ms server / 69ms client локально | 2026-05-01 ([PR #132](https://github.com/samohyn/obihod/pull/132) MERGED · `cc70fa9`) |
| **PANEL-AUDIT-LOG** | Hybrid: Payload `versions` для 7 content + custom `audit_log` для PII (Leads/Users/Media/Redirects) + security events (login/logout/rbac). PII masking write-time. UI `/admin/audit` UNION ALL timeline + side-by-side diff. Retention 365d/90d via cron. ADR-0014. Fix-forward [PR #134](https://github.com/samohyn/obihod/pull/134): fire-and-forget capture + CI timeout — устранил pool-starvation hang seed admin (await capture блокировал save транзакцию первого user) | 2026-05-01 ([PR #133](https://github.com/samohyn/obihod/pull/133) + #134 fix) |
| US-12 W1 | custom.scss 375 строк — admin design refresh (OBI-19) | 2026-04-27 |
| **US-12 W0** | ADR-0005 Admin Customization Strategy (3-уровневая стратегия + защитный контракт) | 2026-04-28 (Accepted; partially superseded by ADR-0007 для Login UI) |
| **PANEL-DEV-SEED-ADMIN** | Seed admin user для local dev + Playwright fixtures + ADR-0009 CJS shim | 2026-04-29 (PR #99 MERGED) |
| **US-12 W2.A v2** | CSS-only Login UI (Approach E через `custom.scss` + native slots, brand-guide §12.1) | 2026-04-29 (commits PAN-15 + PAN-18 в main) |
| **US-12 W4 structural** | Tabs field в 10 коллекциях + SiteChrome global (unnamed tabs, no migrations) | 2026-04-29 (OBI-30, в main) |
| **US-12 W3 finish** | `/admin/catalog` page + `/api/admin/leads/count` + LeadsBadge sidebar pill | 2026-04-30 ([PR #100](https://github.com/samohyn/obihod/pull/100) MERGED) |
| **US-12 W5 part 1** | EmptyCollection + 4 wrappers + SkeletonTable/Form + brand-skeleton pulse animation | 2026-04-30 ([PR #101](https://github.com/samohyn/obihod/pull/101) MERGED) |
| **US-12 W5 part 2** | Per-collection EmptyState/Loading registration — closed by [ADR-0010](../team/adr/ADR-0010-payload-views-list-customization.md) (Payload 3.84 не имеет `views.list.Empty/Loading` API; компоненты остаются как public exports) | 2026-04-30 (closure через ADR) |
| **US-12 W6** | Mobile responsive admin · 6 секций CSS-only @media queries (login fullscreen / sidebar drawer / list-view h-scroll / tabs h-scroll / widget scrollable / bulk-action disabled) + touch targets 44×44 WCAG 2.5.5 | 2026-04-30 ([PR #106](https://github.com/samohyn/obihod/pull/106) MERGED) |
| **US-12 W7** | Polish + a11y WCAG 2.2 AA · @axe-core/playwright integration + 5+ routes + W3/W4/W5 polish smoke + reduced-motion + release readiness gate | 2026-04-30 ([PR #107](https://github.com/samohyn/obihod/pull/107) MERGED) |
| **US-12 W8** | Admin v2 prod alignment · sidebar group order + 13 line-art SVG иконок (CSS mask-image, ADR-0011) + hide default ModularDashboard. Закрывает gap mockup §12.2/§12.3 vs prod | 2026-04-30 ([PR #109](https://github.com/samohyn/obihod/pull/109) MERGED) |
| **US-12 W9** | Admin v2 deeper alignment · force-light theme depth (--theme-elevation-* override 0..1000) + BrandIcon 32→20 для step-nav fit + favicon meta type/url consistency. Закрывает 3 issue после W8 merge (тёмная тема внутри edit, кривой лого в crumbs, кривой favicon) | 2026-04-30 ([PR #110](https://github.com/samohyn/obihod/pull/110) MERGED) |
| **PANEL-LIST-CREATE-AMBER** | List view «Создать» pill amber primary CTA per §12.4.1 (full state matrix + reduced-motion). Native Payload pill (#d6d0bf) → brand янтарный (#e6a23c). Daily-use оператора | 2026-04-30 ([PR #111](https://github.com/samohyn/obihod/pull/111) MERGED) |
| **PANEL-AUTH-2FA** | TOTP 2FA для admin (otplib v12 + qrcode + bcryptjs). 5 endpoints + custom view `/admin/security` + 10 recovery codes + AES-256-GCM encryption at rest + Next.js 16 proxy.ts gate. Backwards compat: `totpEnabled=false` default → existing seed admin без 2FA логинится без второй ступени | 2026-05-01 ([PR #123](https://github.com/samohyn/obihod/pull/123) MERGED) |
| **PANEL-FAVICON-BRAND** | Бренд-favicon ОБИХОД (§3 master lockup) на весь периметр сайта + admin meta sync | 2026-04-30 ([PR #112](https://github.com/samohyn/obihod/pull/112) MERGED) |
| **PANEL-A11Y-TARGET-SIZE** | Row-actions ≥44×44 + axe `target-size` rule re-enable (WCAG 2.5.5) | 2026-05-01 ([PR #115](https://github.com/samohyn/obihod/pull/115) MERGED) |
| **PANEL-SERVICES-PREVIEW-TAB** | Tab «Превью» в Services edit-view (Phase 1, brand-guide §12.4 mockup line 3086) | 2026-05-01 ([PR #116](https://github.com/samohyn/obihod/pull/116) MERGED) |
| **PANEL-HEADER-CHROME-POLISH** | 3 фикса: home-icon в sidebar + dark-toggle stub + breadcrumb «О» fix | 2026-05-01 ([PR #117](https://github.com/samohyn/obihod/pull/117) MERGED) |
| **PANEL-DRAFT-PREVIEW-ROUTE** | Draft preview URL sync — fix регресса роутинга | 2026-05-01 ([PR #119](https://github.com/samohyn/obihod/pull/119) MERGED) |
| **PANEL-EMPTY-LIST-WIRING** | EmptyState wired to Cases + Blog list-view (custom view via `admin.components.views.list`) | 2026-05-01 ([PR #120](https://github.com/samohyn/obihod/pull/120) MERGED) |
| **PANEL-EMPTY-LIST-WIRING-RSC-FIX** | Hotfix: explicit whitelist `CLIENT_PROP_KEYS` через `pickClientProps()` — server props не пересекают RSC border (fix RC-2 BLOCK regression) | 2026-05-01 ([PR #122](https://github.com/samohyn/obihod/pull/122) MERGED) |
| **PANEL-NAV-HOME-LINK-CLEANUP** | Sidebar квадрат + rename «Вернуться в панель» (link state polish) | 2026-05-01 ([PR #121](https://github.com/samohyn/obihod/pull/121) MERGED) |
| **PANEL-UX-AUDIT** | Полный проход /admin (login → 7 коллекций → mobile drawer) — feed для HEADER-CHROME-POLISH + EMPTY-LIST-WIRING + A11Y-TARGET-SIZE + SERVICES-PREVIEW-TAB | 2026-05-01 (note-uxpanel.md) |
| **US-12 Admin Redesign (cumulative)** | 13 PR cumulative shipped (W1-W9 + LIST-AMBER + FAVICON + A11Y + SERVICES-PREVIEW + HEADER-CHROME + DRAFT-PREVIEW + EMPTY-LIST + RSC-FIX + NAV-HOME-LINK + UX-AUDIT) → operator approve → cpo retro | 2026-05-01 ([US-12-retro.md](../team/release-notes/US-12-retro.md)) |
| **PANEL-LEADS-INBOX** | Leads UX: status canonical (7 + spam) + status_history jsonb + statusHistory tab + 8-chip filters + StatusPillCell + RowActionsCell dropdown + Postgres ENUM TYPE migration up/down/idempotent. Phase 3 (bulk actions / date-range UI / confirm) deferred → PANEL-LEADS-INBOX-V2 | 2026-05-01 ([PR #123 part](https://github.com/samohyn/obihod/pull/123) + [PR #125](https://github.com/samohyn/obihod/pull/125) MERGED) |
| **PANEL-PERSONS-RENAME (b)** | Persons → Authors merge: 1 record migrated (Алексей Семёнов), bio richText→textarea Lexical extract OK, credentials.year→issuedAt='YYYY-01-01', worksInDistricts addded к Authors, sidebar §12.2 — одна иконка вместо двух, label «Авторы / Команда». Spec пропустил ServiceDistricts.reviewedBy (5-я reference) — мигрирован в рамках scope. Migration UP/DOWN/UP roundtrip clean | 2026-05-01 |
| **PANEL-CSS-PREFIX-CLEANUP** | Удалены 32 dead `.payload__app X` selectors из W1 custom.scss — ancestor отсутствует в Payload 3.84 admin shell. 1479→1296 строк (-12%). 6 routes pixel-identical, 36/36 admin E2E specs passed. Backlog follow-ups в SCSS comments (PANEL-W1-REVIVE-OR-DROP / W4-TABS-REVIVE / W6-MOBILE-REVIVE / A11Y-TARGET-SIZE-REVIVE) | 2026-05-01 ([PR #127](https://github.com/samohyn/obihod/pull/127)) |
| **PANEL-AXE-PAYLOAD-CORE-A11Y** | A11yRowCheckboxProvider (MutationObserver) + aria-label на Payload native row-select checkbox во всех list-views. Закрывает critical axe violation `aria-input-field-name` / `label` (WCAG SC 4.1.2 / SC 1.3.1) из leadqa-RC-3-hotfix.md § Findings F1. `label` rule re-enabled в admin-a11y.spec.ts. Verified локально на 6 routes (cases / blog / leads / services / authors / districts) — 0 critical. Selector скорректирован под реальный DOM Payload 3.84 (`.checkbox-input__input > input`). Header select-all с broken `aria-labelledby` self-reference корректно перезаписан | 2026-05-01 |
| **PANEL-BULK-PUBLISH** | Bulk-publish для Cases / Blog / Services / ServiceDistricts через Payload 3.84 native `<ListSelection_v4>` (PublishMany / UnpublishMany / EditMany / DeleteMany). Никакого custom компонента — i18n.fallbackLanguage='ru' даёт RU labels из @payloadcms/translations. SCSS-кастомизация `.list-selection` под brand-guide §12.5 chip-bar (~80 строк). E2E spec parametrized по 4 коллекциям + confirm-modal. AC2 «В архив» out-of-scope (cases enum только draft\|published; follow-up в PANEL-ARCHIVE-WORKFLOW). AC4 confirmation всегда показывается (строже, чем «≥10») | 2026-05-01 |
| **PANEL-SITECHROME-RESTRUCTURE** | Footer tab → 2 unnamed sub-tabs «Контент» / «Юридические ссылки» внутри group `footer`; Реквизиты → 2 collapsible-блока «Юридическое лицо» / «Адрес» внутри group `requisites`, оба `initCollapsed: false`. Schema идентична (footer_* + requisites_* flat 12 колонок), 0 pending migrations — Payload tabs/collapsible UI-only при unnamed/group-wrapped. Variant A из decision matrix (Phase B split-collection MenuItems → future PANEL-MENUS-COLLECTION) | 2026-05-01 ([PR #131](https://github.com/samohyn/obihod/pull/131) MERGED, sha 278b3ef) |

### Dropped

| ID | Что | Дата | Кто решил | Почему |
|---|---|---|---|---|
| US-12 W2.B | Magic link auth через Telegram + email fallback | 2026-04-29 | оператор + popanel | Wave 2.A покрывает UX-боль; 2 ЧД + два блокера (PAN-9/PAN-10) + новая collection слишком дорого для одного оператора-пользователя; защита от phishing закрывается TOTP 2FA дешевле. PAN-9 уходит в US-8 (lead notifications), PAN-10 — в US-8/общую инфру `do`. См. `specs/US-12-admin-redesign/sa-panel-wave2b.md` (status: cancelled). |

### Risks (popanel ведёт)

- ~~**PANEL-PERSONS-RENAME dev**~~ — closed 2026-05-01 (PR #126 merged, migration UP/DOWN/UP roundtrip clean, 1 record migrated, 5 references rebound including ServiceDistricts.reviewedBy).
- ~~**PANEL-GLOBAL-SEARCH + PANEL-AUDIT-LOG ADR блок**~~ — closed 2026-05-01: ADR-0013 (pg_trgm) + ADR-0014 (Hybrid storage) Accepted by popanel autonomous mandate. Specs `dev-ready`.
- **PANEL-GLOBAL-SEARCH + PANEL-AUDIT-LOG (later)** — оба dev-blocked-by-adr (tamd performance + storage strategy). Mitigation: capability contract стабилен поверх любой выбранной strategy.
- **Repeat RC-2 #120 incident** — PANEL-RSC-LINT в later (cpo retro L2). До implementation — каждый PR с RSC components обязан local browser-smoke (iron rule #4 strengthening).
- **Parallel dev agents race condition** — incident 2026-05-01: AUTH-2FA + LEADS-INBOX dev в одной working copy → AUTH-2FA squash проглотил часть LEADS-INBOX commits. Memory `feedback_parallel_dev_agents_worktree` — sequential default, parallel только через `Agent.isolation: "worktree"`.

---

## product · Сайт услуг

**PO:** podev · **branch:** `product/integration` · **last update:** 2026-04-29

| Эпик / задача | Тип | Приоритет | Статус | Артефакт | Note |
|---|---|---|---|---|---|
| EPIC-BUG-MOBILE — overflow на главной + 15× 404 + politika/oferta | bug | parked | parked | [intake](../specs/EPIC-BUG-MOBILE/intake.md) | smoke 2026-04-29; разморозка по явному запросу либо внутри US-9 full-regression |

---

## seo · Контент + tech SEO

**PO:** poseo · **branch:** `seo/integration` · **last update:** 2026-04-29

### Now

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-SEO-SHOP** discovery | Полное SEO-ядро + URL-architecture + positioning для 9 категорий магазина саженцев. Параллельно с EPIC-SEO-LANDSHAFT. | re + seo-content + sa-seo + seo-tech + cw | ~22 чд (5 нед) | 5×5×0.9 / 22 = 1.02 | M | intake.md готов 2026-04-29; ждёт `ba.md` от `ba`. [intake](../specs/EPIC-SEO-SHOP/intake.md) |
| **EPIC-SEO-LANDSHAFT** discovery | Полное SEO-ядро + URL-map + cross-link strategy для услуги «Дизайн ландшафта». Параллельно с EPIC-SEO-SHOP. | re + seo-content + sa-seo + seo-tech + cw | ~18 чд (5 нед) | 5×4×0.9 / 18 = 1.0 | M | intake.md готов 2026-04-29; ждёт `ba.md` от `ba` + параллельный trigger в `art` через `cpo` для `brand-guide-landshaft.html`. [intake](../specs/EPIC-SEO-LANDSHAFT/intake.md) |

### Later (post-discovery)

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| EPIC-SEO-SHOP-WAVE-1 | Реализация SEO-вводных в `apps/shop` scaffolding (категорийные meta/H1, schema Product/Offer, sitemap-shop.xml) | seo-tech + sa-shop + fe-shop | tbd | tbd | M | blocked by EPIC-SEO-SHOP discovery + `apps/shop` scaffolding (poshop) |
| EPIC-SEO-LANDSHAFT-WAVE-1 | Посадочная страница `/dizain-landshafta/` + 5-8 cluster URL + контент-волна | seo-content + cw + cms + fe-site (через podev) | tbd | tbd | M | blocked by EPIC-SEO-LANDSHAFT discovery + `brand-guide-landshaft.html` (art) |
| PRODUCT-SEED-METADATA-FIX | `pnpm seed` падает на 1 Service `chistka-krysh` — metaDescription > 160 символов. Перенесён из common (правка контента — это `cw`). | cw | 0.1 чд | low | C | discovered 2026-04-29 (tamd verify ADR-0009) |

### Blocked

(блокеров нет на discovery — research-only, не зависит от dev)

### Risks (poseo ведёт)

- **Параллельный discovery двух эпиков** — нагрузка на `re` и `seo-content` одновременно. Mitigation: разнесение по неделям внутри 5-недельного timeline (W1/W2 — kw сбор и кластеры; W3/W4 — URL-decisions; W5 — финализация). Если нагрузка не вытянется — переключаюсь на sequential (landshaft first, как fallback из plan-mode).
- **`brand-guide-landshaft.html` от `art`** — параллельная зависимость для contentwriter'a. Mitigation: discovery (kw + URL) идёт независимо; cw подключается только в W4-W5 на черновики meta-templates.
- **Positioning shop (head vs niche)** — стратегическое решение, требует апрува `cpo`. Mitigation: вынес в open question в intake.md, эскалирую сразу в W1.

---

## shop · E-commerce саженцев

**PO:** poshop · **branch:** `shop/integration` (apps/shop) · **last update:** —

_(Pending от poshop — backlog shop-команды.)_

---

## design · Дизайн-система

**PO:** art · **branch:** `design/integration` · **last update:** —

_(Pending от art — backlog design-команды: TODO §15 brand-guide, brand-guide-landshaft.html, новые компоненты.)_

---

## business · BA / CPO / Insights

**Owner:** cpo · **last update:** —

_(Pending от cpo — стратегические эпики, кросс-командные программы.)_

---

## common · Tech / DBA / DevOps / Release / LeadQA

**PO:** распределённый (tamd / dba / do / release / leadqa) · **last update:** 2026-04-29

### Done

| ID | Что | Дата merge | ADR |
|---|---|---|---|
| COMMON-SCRIPTS-RUNTIME-FIX | tsx Payload Local API скрипты падали на `@next/env` CJS-default destructure → решено через CJS preload shim `scripts/_payload-cjs-shim.cjs` (13 строк). 5 scripts получили `tsx --require=` префикс. | 2026-04-29 (verify-passed, ready) | [ADR-0009](../team/adr/ADR-0009-tsx-payload-cjs-shim.md) |

### Later

| ID | Что | Owner | Effort | Priority | Статус |
|---|---|---|---|---|---|
| PRODUCT-SEED-METADATA-FIX | `pnpm seed` падает на 1 Service `chistka-krysh` — metaDescription > 160 символов (Payload validation reject). Pre-existing data issue, обнаружен tamd 2026-04-29 при verify ADR-0009. | poseo / cw | 0.1 чд | low (контент-seed имеет workaround — сидеть руками) | discovered |

---

## Cross-team coordination

| Зависимость | Owner-from | Owner-to | Что |
|---|---|---|---|
| Telegram bot setup (бывший PAN-9) | podev (US-8) | panel (Leads уведомления оператору) + shop (order notifications) | владение перешло из panel в product 2026-04-29 после drop W2.B |
| SMTP setup (бывший PAN-10) | do (общая инфра) | panel (auth recovery если 2FA) + product (lead форма заявки) + shop (order email) | владение перешло из panel 2026-04-29 |
| `brand-guide-landshaft.html` создание | art (через cpo) | seo (cw для текстов landshaft) | trigger от poseo 2026-04-29 (EPIC-SEO-LANDSHAFT). Блокер только для контентной волны, не для discovery |
| Positioning shop (head vs niche) | poseo (EPIC-SEO-SHOP discovery) | cpo (стратегический апрув) + poshop (товарная стратегия) | open question в intake.md, эскалирую в W1 |
| Cross-link map services↔shop↔landshaft | poseo + podev + poshop | через cpo | финализируется в ADR-uМ-22 (shop) + sa-seo.md (landshaft), W3-W4 discovery |
