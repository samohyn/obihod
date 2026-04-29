---
title: team/backlog.md — cross-team execution plan
owner: cpo
last_update: 2026-04-29
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

**PO:** popanel · **branch:** feature-ветки от `main` (по pattern PR #99) · **last update:** 2026-04-30

### Now

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **US-12 W2.A v2** | CSS-only Login UI (Approach E через `custom.scss` + native slots, brand-guide §12.1) | fe-panel + qa-panel + cr-panel | 0.7 чд | 5×4×1.0 / 0.7 = 28.6 | M | **in-dev, hand-off 2026-04-30** popanel → fe-panel. sa-panel-wave2a-v2.md approved, ADR-0007 Accepted. Ветка: `feature/us-12-w2a-login-css` от main. be-panel НЕ нужен (CSS-only). |
| **US-12 W3** | PageCatalog page `/admin/catalog` + dashboard widget + CSV + Leads badge | be-panel + fe-panel | 1.5 чд | 5×5×0.9 / 1.5 = 15 | M | **in-dev, hand-off 2026-04-30** popanel → be-panel + fe-panel. sa-panel-wave3.md approved, ADR-0005 Accepted. Ветка: `feature/us-12-w3-page-catalog` от main. fe-panel подключается после своего W2.A merge (split scope). |
| **US-12 W4** | Tabs field в 10 коллекциях + has-error indicator | structurally done | 0.1 чд | 5×4×0.8 / 0.1 = 160 | M | **structurally done в main** (Services 6 tabs, Cases 4, Blog 5, Districts/B2BPages/Authors/ServiceDistricts/Leads/Media/SiteChrome — все имеют tabs). Этот PR закрывает CSS has-error indicator. Pending follow-up: cw `admin.description` audit для всех fields. |
| **US-12 W5 part 2** | Per-collection EmptyState/Loading registration через Payload `views.list.*` API | tamd research + fe-panel | 0.5 чд | 4×3×0.7 / 0.5 = 16.8 | S | blocked by tamd research Payload 3.84 `views.list.Empty/Loading` API (та же категория риска как `views.login` в W2.A v1). W5 part 1 [PR #101](https://github.com/samohyn/obihod/pull/101) дал готовые компоненты (EmptyCollection + 4 wrappers + Skeletons). |

### Next (US-12 closure)

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| US-12 W6 | Mobile admin responsive (`≤640px`, list/edit views) | fe-panel + ux-panel | 1.5 чд | 2×3×0.6 / 1.5 = 2.4 | S | спека не написана, после Waves 2-5 смержены в main |
| US-12 W7 | Polish + a11y WCAG 2.2 AA + Playwright admin smoke (`admin-design-compliance.spec.ts`) | qa-panel + cr-panel | 1 чд | 5×4×1.0 / 1 = 20 | M | спека не написана, после W6 — release gate |

### Later (post-US-12)

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| PANEL-AUTH-2FA | TOTP 2FA коллекция + setup flow в Login (замена магического линка) | be-panel + fe-panel | 1 чд | 4×3×0.8 / 1 = 9.6 | S | idea, нужна sa-panel; не блокер релиза US-12 |
| PANEL-LEADS-INBOX | Leads collection UX-полировка (status workflow, фильтры, быстрые действия) — main daily-use оператора | be-panel + fe-panel + ux-panel | 2 чд | 5×5×0.9 / 2 = 11.25 | M | nужна sa-panel; в работу после US-12 release |
| PANEL-BULK-PUBLISH | Bulk-publish + bulk-edit для Cases / Blog / Services / ServiceDistricts | be-panel + cms | 1.5 чд | 3×4×0.7 / 1.5 = 5.6 | C | idea, нужна sa-panel |
| PANEL-AUDIT-LOG | Кто/что/когда менял (Payload `versions` history + diff view) | be-panel + dba | 2 чд | 2×3×0.6 / 2 = 1.8 | C | idea, нужна sa-panel + ADR (storage стратегия) |
| PANEL-MEDIA-LIBRARY | Media browser + cleanup orphaned uploads | be-panel + fe-panel | 1.5 чд | 3×3×0.6 / 1.5 = 3.6 | C | idea, нужна sa-panel |
| PANEL-DASHBOARD-V2 | Кастомизируемый dashboard (drag-drop widgets оператора) | fe-panel | 2 чд | 2×3×0.5 / 2 = 1.5 | W | idea, после стабилизации W3 widget |

### Blocked

(блокеров нет — COMMON-SCRIPTS-RUNTIME-FIX закрыт ADR-0009 2026-04-29)

### Done

| ID | Что | Дата merge |
|---|---|---|
| US-12 W1 | custom.scss 375 строк — admin design refresh (OBI-19) | 2026-04-27 |
| **US-12 W0** | ADR-0005 Admin Customization Strategy (3-уровневая стратегия + защитный контракт) | 2026-04-28 (Accepted; partially superseded by ADR-0007 для Login UI) |
| **PANEL-DEV-SEED-ADMIN** | Seed admin user для local dev + Playwright fixtures + ADR-0009 CJS shim | 2026-04-29 (PR #99 MERGED) |
| **US-12 W2.A v2** | CSS-only Login UI (Approach E через `custom.scss` + native slots, brand-guide §12.1) | 2026-04-29 (commits PAN-15 + PAN-18 в main) |
| **US-12 W4 structural** | Tabs field в 10 коллекциях + SiteChrome global (unnamed tabs, no migrations) | 2026-04-29 (OBI-30, в main) |

### Dropped

| ID | Что | Дата | Кто решил | Почему |
|---|---|---|---|---|
| US-12 W2.B | Magic link auth через Telegram + email fallback | 2026-04-29 | оператор + popanel | Wave 2.A покрывает UX-боль; 2 ЧД + два блокера (PAN-9/PAN-10) + новая collection слишком дорого для одного оператора-пользователя; защита от phishing закрывается TOTP 2FA дешевле. PAN-9 уходит в US-8 (lead notifications), PAN-10 — в US-8/общую инфру `do`. См. `specs/US-12-admin-redesign/sa-panel-wave2b.md` (status: cancelled). |

### Risks (popanel ведёт)

- **W4 Tabs schema** — затрагивает 10 коллекций, минор регрессия может сломать существующие edit-views. Mitigation: ADR-0005 `:where()` обёртка + e2e admin smoke перед merge.
- **W6 Mobile admin** — Payload native mobile-поддержка ограничена. Может потребоваться custom view для list/edit. Принимать решение в `sa-panel-wave6.md`.
- **W7 Playwright admin** — нужен изолированный тест-юзер + seed для admin URL. Coordination с `dba`.

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
