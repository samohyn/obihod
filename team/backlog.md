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

## cross-team · Программа «Обиход 2.0» (apruved 2026-05-09)

**PO:** po · **last update:** 2026-05-09 · **План:** `~/.claude/plans/stateless-puzzling-valiant.md`

Большая программа из 4 эпиков (12 нед): убираем магазин, обгоняем liwood, унифицируем структуру service-страниц, делаем редизайн по brand-guide. Iron rules: brand-guide-first (0 ad-hoc UI) + fal.ai hybrid (иконки/фото, не UI).

### Now

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-SHOP-REMOVAL** | Clean cut магазина саженцев — archive (team/shop.md, specs/EPIC-SEO-SHOP, brand-guide §15-29, tov/shop.md), Header/Footer/types.ts вырезание, 410 Gone /shop*, landshaft = 5-й pillar услуг. ADR-0020. 6 wave | po + arch + dev + fe + design + seo + cw + devops + qa | ~10 чд | 5×4×0.95 / 10 = 1.9 | M | **active 2026-05-09** — operator apruvil decisions (archive / landshaft = 5-й pillar / US-11 archive). [intake](../specs/EPIC-SHOP-REMOVAL/intake.md) |
| **EPIC-LIWOOD-OVERTAKE** | Decision-grade benchmark «Обиход vs liwood» по 8 осям через Keys.so + WebFetch + PageSpeed → 5+ новых US с RICE → roadmap 8-12 нед. Параллельно с EPIC-SHOP-REMOVAL.W3-W6 | po + seo | ~8 чд | 5×5×0.85 / 8 = 2.65 | M | **active 2026-05-09** — параллельно с A. [intake](../specs/EPIC-LIWOOD-OVERTAKE/intake.md) |

### Next — после EPIC-SHOP-REMOVAL.W1

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-SERVICE-PAGES-UX** | UX/UI-driven master template T2/T3/T4 (НЕ SEO-driven). Brand-guide v2.2 inventory + визуальный бенчмарк liwood. ADR-0021 с mapping table «секция → §brand-guide:line». LeadForm + Calculator + click-path-audit + breadcrumbs + SEO+нейровыдача-text обязательны. 7 wave (C1.a‖C1.b → C2 → C3 → C4 → C5 → C6 → C7) | design + ux + arch + dev + cw + seo + qa + po | ~22 чд | 5×5×0.9 / 22 = 1.02 | M | next (blocked by EPIC-SHOP-REMOVAL.W1 — landshaft = 5-й pillar). [intake](../specs/EPIC-SERVICE-PAGES-UX/intake.md) |

### Later — после EPIC-SERVICE-PAGES-UX C2

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-SERVICE-PAGES-REDESIGN** | Pixel-perfect редизайн по brand-guide v2.3 (0 ad-hoc компонентов). Mobile-first 375/414/768/1024. CWV LCP <2.5s mobile p75. Roll-out 30 URL/нед × 8 нед, начиная с /vyvoz-musora/ A/B pilot 7 дней. fal.ai генерит иконки/фото, НЕ UI. 7 wave (D1 → D2 → D3 → D4 → D5 pilot → D6 roll-out → D7 audit) | design + fe + qa + devops + po + seo + dev | ~30 чд | 5×4×0.85 / 30 = 0.57 | M | later (blocked by EPIC-SERVICE-PAGES-UX C2 + EPIC-SHOP-REMOVAL W3 + EPIC-LIWOOD-OVERTAKE B5). [intake](../specs/EPIC-SERVICE-PAGES-REDESIGN/intake.md) |

### Что СУПЕРСЕЖЕНО программой

- `apps/shop/` scaffolding plan (drop)
- shop роль (10→9 в team/PROJECT_CONTEXT.md)
- `design-system/brand-guide.html` §15-29 + `design-system/tov/shop.md` (W3)
- `specs/EPIC-SEO-SHOP/`, частично `specs/EPIC-SEO-LANDSHAFT/` (landshaft переподшивается в EPIC-C)
- shop секции в текущем backlog (cleanup в W2)
- `specs/US-11-ia-extension/` 9 shop-иконок (archive в W2)

### Iron rules программы

1. **Skill-check first:** перед каждой задачей `Skill` tool из frontmatter (po: product-capability/product-lens/blueprint/architecture-decision-records)
2. **brand-guide-first:** UI компоненты только из `design-system/brand-guide.html` v2.2 (§components/notifications/errors/pagination/nav/icons/color/contrast/type/shape). Если §нет — design сначала PR в brand-guide
3. **fal.ai hybrid (skill `fal-ai-media`):** иконки gap-fill (Nano Banana Pro, line-art), hero/cases/district photos (Nano Banana Pro, §photography style), черновики layout (Nano Banana 2). UI-элементы НЕЛЬЗЯ. Тексты НЕЛЬЗЯ (Claude API)
4. **spec.md → код:** dev/fe не стартует без apruved spec.md
5. **qa real-browser smoke до approve, не после**
6. **green CI before merge** (devops gate)
7. **screen/ для всех Playwright скриншотов**

### Liwood overtake roadmap (B5 — EPIC-LIWOOD-OVERTAKE deliverable)

**Source:** `seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` (B3 classification — 5 LEAD / 1 PARITY / 1 LAG / 1 likely LEAD pending). **Roadmap doc:** `seosite/01-competitors/overtake-roadmap-2026-05.md` (B5).

7 новых US (OVT-1..7) — все с covered-by check vs existing EPIC-SEO-USLUGI / EPIC-SEO-COMPETE-3 / EPIC-SERVICE-PAGES-UX. Никакой OVT-* НЕ дублирует existing US — это либо extension, либо новая зона (CWV/RUM, video-кейсы, marketing-angle assets).

**RICE формула:** `Score = (Reach × Impact × Confidence) / Effort`. Reach 1-5 (5=ежедневно), Impact 1-5 (5=критично), Confidence 0.5-1.0 (1.0=validated), Effort в ЧД.

#### Now — стартует параллельно с EPIC-SHOP-REMOVAL

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **OVT-3** | **CWV RUM instrumentation** — Real User Monitoring (web-vitals lib + custom endpoint в Next.js + ClickHouse/PG aggregation) для LCP/CLS/INP mobile p75 на prod. Plus PSI bench liwood (3 URL × mobile+desktop) для confirm/downgrade likely-LEAD verdict оси 7. Threshold-alerts для регрессии (LCP >2.5s p75 → Sentry alert) | seo + dev + devops | 3 ЧД | 5×4×0.9/3 = 6.0 | **M** | next (covered-by N/A — новый US, не пересекается с existing) |

#### Next — последовательно после OVT-3

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **OVT-4** | **Я.Карты embed + Я.Бизнес owner + LocalBusiness JSON-LD enrich** — Я.Карты `<iframe>` embed на топ-10 SD (privacy-first, lazy-load, ~1KB initial) + полный NAP в `LocalBusiness` JSON-LD на 100% T4 SD + Я.Бизнес карточка organization верифицирована (operator-driven) + рейтинг attribution в `AggregateRating` schema. Owner: seo+dev (embed) + operator (Я.Бизнес setup) | seo + dev + cw + operator | 4 ЧД | 5×4×0.85/4 = 4.25 | **M** | next (covered-by partially: EPIC-SEO-COMPETE-3 US-9 Phase 2 — Я.Карты embed track. Эскалирует ETA с «backlog после operator setup» в фиксированный 2-week window. Operator action required before kickoff) |
| **OVT-2** | **B2B-trail content fill (6 PDF лендингов)** — наполнение 6 B2B-pages (porubochnyi-bilet / lesnaya-deklaratsiya / akt-obsledovaniya / sro-vypiska / fkko-klassifikatsiya / fitosanitarnyi) — copy + PDF templates через design (Figma → PDF) + legal references | cw + seo + design + dev | 6 ЧД | 4×4×0.9/6 = 2.4 | **S** | next (covered-by EPIC-SEO-COMPETE-3 US-6 Track A — accepted operator 2026-05-06. RICE здесь = эскалирует priority с W4-W6 backlog в active. ETA 2 нед параллельно с OVT-3) |
| **OVT-1** | **Programmatic SD extension 154→250 (incl landshaft × ~30)** — расширяет sustained 154 SD (5 pillar × 31 city, deployed 2026-05-03) до 250 SD: (a) 6-й pillar landshaftnyy-dizayn × ~30 city = ~30 new SD после ADR-0020 closure (covered-by EPIC-SHOP-REMOVAL.W1); (b) sub × city programmatic для топ-3 sub в каждом pillar (3 sub × 5 pillar × 30 city = ~450 max, taking топ-3 sub × 30 city = ~90 SD); (c) unique-content uplift с 25-30% → 35-40% на топ-50 SD | seo + cw + dev + dba | 12 ЧД | 5×5×0.85/12 = 1.77 | **M** | later (blocked-by EPIC-SHOP-REMOVAL.W1 closure — landshaft = 5-й pillar. Phase A = landshaft 30 SD. Phase B = sub × city. Covered-by EPIC-SEO-USLUGI US-3+US-7 для existing pattern, OVT-1 = extension сверху) |

#### Later — после prerequisite EPICs

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **OVT-7** | **Landshaft programmatic SD seed (Phase A для OVT-1)** — после ADR-0020 sustained: landshaft pillar T2 + ~30 T3 sub-services (sustained `/uslugi/` pattern) + 30 SD T4 city × landshaft = ~60 new URL. Unique content 25-30% per district, miniCase + reviewedBy + LocalBusiness. **Note:** этот US — Phase A детализация OVT-1. Если po решит держать как отдельный — отделить из OVT-1 | seo + cw + dev + dba | 8 ЧД | 5×4×0.85/8 = 2.13 | S | later (blocked-by EPIC-SHOP-REMOVAL.W1 + ADR-0020 + EPIC-SERVICE-PAGES-UX C2 master-template apruv для landshaft layer; Phase A subset OVT-1 — может быть как standalone US если po split) |
| **OVT-5** | **Video case studies — 4-5 видео для top pillar** — 60-120s per video, документальный стиль, embed на T2/T4 страницах (covered-by EPIC-SERVICE-PAGES-UX C2 §08 mini-case extension). Schema VideoObject в JSON-LD. Захватывает PARITY ось 5+8 (e-e-a-t + b2b/local) → first-mover в нише (никто из 17 конкурентов не делает) | art + cw + dev + design | 10 ЧД | 4×4×0.7/10 = 1.12 | **C** | later (blocked-by EPIC-HOMEPAGE-V2 US-17 photo production — operator coordination для real footage; covered-by N/A — новый US) |
| **OVT-6** | **AggregateRating + photo testimonials prod uplift** — наполнение Reviews collection до ≥30 reviews с photo (sustained Reviews collection из US-9 Phase 1 done) + AggregateRating на 100% T2 (sustained composer.ts) + photo upload guard в admin Reviews list (popanel coordination) | cw + popanel + design | 4 ЧД | 4×3×0.9/4 = 2.7 | **C** | later (covered-by EPIC-SEO-COMPETE-3 US-9 Phase 2 — operationalised в backlog как sustainable, OVT-6 эскалирует ETA до 4 weeks) |
| **OVT-MONITOR** | **Continuous monitoring tracker** — weekly cron job: (a) liwood sitemap URL count + Topvisor visibility delta; (b) liwood top-50 keys через Keys.so API; (c) обиход indexed pages через Я.Webmaster API; (d) автоматический PO alert при threshold breach (см. B3 §Threshold table). Артефакт: `seosite/01-competitors/liwood-monitor-weekly.csv` + Sentry alert rules | seo + devops | 2 ЧД | 5×3×0.9/2 = 6.75 | **S** | next (covered-by N/A — новый, реализует PARITY action из B3 axis 1) |

#### Marketing-angle assets (LEAD axes amplification)

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **OVT-MKT** | **Marketing-angle assets для 5 LEAD axes** — (a) PR-история «Schema.org 100% coverage» в press kit + Я.Дзен; (b) sales deck v2 с 5 LEAD slides (schema / photo→AI / e-e-a-t / content depth / on-page); (c) Я.Директ объявления rich-snippet preview screenshots; (d) landing copy `/kalkulyator/foto-smeta/` USP-промо. Sustained brand-guide TOV (§13-14 anti-words guard) | cw + design + po | 5 ЧД | 4×3×0.85/5 = 2.04 | **C** | later (covered-by N/A — новый, реализует marketing-angle action из B3 axes 2/3/4/5/6) |

#### Сводка roadmap

- **8 US в OVT-* серии** (7 запрошенных + OVT-MONITOR + OVT-MKT — всего 9). 5 содержат covered-by reference (OVT-1/2/4/6/7) — эскалируют existing US. 4 принципиально новых (OVT-3 RUM / OVT-5 video / OVT-MONITOR / OVT-MKT).
- **Total effort:** ~54 ЧД (≈ 8-12 нед при параллельной работе seo+cw+dev+design+devops).
- **Top-3 priority by RICE:** OVT-MONITOR (6.75) → OVT-3 RUM (6.0) → OVT-4 Я.Карты+Я.Бизнес (4.25). Видео и landshaft — позже.
- **Operator actions required:** Я.Бизнес owner setup (OVT-4 prerequisite) + ADR-0020 closure confirmation (OVT-1+7 prerequisite) + EPIC-HOMEPAGE-V2 US-17 photo coordination (OVT-5 prerequisite).
- **Зависимости:** OVT-1 ждёт EPIC-SHOP-REMOVAL.W1 + ADR-0020. OVT-7 — Phase A детализация OVT-1, может быть как standalone US. OVT-5 ждёт реальные кадры (US-17). OVT-6 ждёт popanel Reviews UI iteration.
- **Iron rule:** roadmap pending **operator apruv** через `specs/EPIC-LIWOOD-OVERTAKE/intake.md` hand-off.

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

**PO:** podev · **branch:** `product/integration` · **last update:** 2026-05-07

| Эпик / задача | Тип | Приоритет | Статус | Артефакт | Note |
|---|---|---|---|---|---|
| **TASK-NEWUI-TEMPLATES-W1** | design + frontend-reference | **M (must)** | **active — Wave 1 запущена 2026-05-07** | [intake](../specs/TASK-NEWUI-TEMPLATES-W1/intake.md) | Decision-base: deep-dive liwood.ru ([liwood-page-templates-analysis-2026-05-07.md](../seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md)). Wave 1 — 5 шаблонов в `newui/`: T4 Service×District (блокер SEO-эпика, в работе) + T1/T2/T6/T11-shell. Owner: art → ux → ui (через cpo). Без T4 не закрывается EPIC-SEO-COMPETE-3 US-3..US-9. |
| EPIC-HOMEPAGE-V2 US-16 fe-build | feature | M | next (blocked by US-14+US-15 approve) | pending sa-site spec.md | После approve art design-briefs (US-14 ui + US-15 ux) — sa-site пишет spec.md (iron rule #2 spec-before-code), затем fe-site/be-site верстают новую главную (16 секций, 4 новых компонента + 5 redesign), Server Action LeadForm → Payload Leads + Telegram. **Note 2026-05-07:** TASK-NEWUI-TEMPLATES-W1 W1.2 (T1 Главная) пересекается — ревью homepage.html на base brand-guide v2.2 и 6-pillar структуру может произойти раньше US-14/15 design-briefs либо параллельно. |
| EPIC-HOMEPAGE-V2 US-17 photo production | external | M | external (operator-driven) | external | Профессиональная фотосессия 11 финальных кадров (Hero 1 + Team 4 + Cases 6) на реальных объектах. Документальный репортажный стиль per `design-system/foundations/photography.md`. Параллельно US-14/15/16. |
| EPIC-BUG-MOBILE — overflow на главной + 15× 404 + politika/oferta | bug | parked | parked | [intake](../specs/EPIC-BUG-MOBILE/intake.md) | smoke 2026-04-29; разморозка по явному запросу либо внутри US-9 full-regression. **Note:** часть «overflow на главной» может быть решена внутри EPIC-HOMEPAGE-V2 US-16 fe-build при пересборке. |

---

## seo · Контент + tech SEO

**PO:** poseo · **branch:** `seo/integration` · **last update:** 2026-05-08

### Now

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-SEO-USLUGI** | Раздел `/uslugi/` объективно лучше liwood/services/. **191 URL** (1 hub T1 + 5 pillar T2 + 35 sub T3 + 150 programmatic SD T4) с **JSON-LD 100% coverage**, E-E-A-T (Author + reviewedBy), CWV LCP <2.5s mobile, 4 шаблона перерисованы С НУЛЯ под brand-guide v2.2. 4-5 нед, **per-US release cycle** (leadqa local-verify → operator approve → do push → следующий US). DoD W22: 191 URL, ≥80 keys top-10, ≥10 leads/нед week-4. | poseo + sa-seo + art/ux/ui + seo-tech + cw + seo-content + dba + tamd + leadqa + do | ~30 чд (4-5 нед) | 5×5×0.9 / 30 = 0.75 | **M** | **active 2026-05-08** — US-1 dispatch, intake.md + ba/sa-seo + ADR-0019 + namespace-audit + liwood-passport-final + URL-inventory-191 + target-keys CSV deliverables. Plan: `/Users/a36/.claude/plans/team-seo-poseo-md-joyful-globe.md`. [intake](../specs/EPIC-SEO-USLUGI/intake.md) · [ADR-0019](adr/ADR-0019-uslugi-routing-resolver.md) |
| **EPIC-SEO-COMPETE-3** | SEO + нейро-SEO стратегия обгона liwood / arborist.su / arboristik.ru — 5 pillar (с новым `/uborka-territorii/`) + mega-прайс + 6 B2B + 30 info-articles + programmatic SD + 5 контекстных LeadForm + Я.Карты track. 12 нед. DoD: pagesInIndex ≥160, Topvisor visibility ≥15, organic ≥800/нед, leads ≥15/нед. | seo-content + cw + sa-seo + seo-tech + cms + tamd (ADR) + podev (новые routes) | ~50 чд (12 нед) | 5×5×0.9 / 50 = 0.45 | M | intake.md + ADR-0018 skeleton 2026-05-06; pre-flight US-0 destructive cleanup OUTRANK done. [intake](../specs/EPIC-SEO-COMPETE-3/intake.md) · [ADR-0018](adr/ADR-0018-url-map-compete-3.md) |

### Later (post-discovery)

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| PRODUCT-SEED-METADATA-FIX | `pnpm seed` падает на 1 Service `chistka-krysh` — metaDescription > 160 символов. Перенесён из common (правка контента — это `cw`). | cw | 0.1 чд | low | C | discovered 2026-04-29 (tamd verify ADR-0009) |

### Blocked

(блокеров нет на discovery — research-only, не зависит от dev)

### Risks (poseo ведёт)

- **EPIC-SEO-COMPETE-3 — 30 articles × 3/нед** — высокая нагрузка на `cw`. Mitigation: двойная команда seo-content + cw, AI-draft + редакторский pass, fallback 24 шт. Подробнее в intake §Risks.
- **EPIC-SEO-COMPETE-3 — Я.Бизнес/Карты owner** — track US-9 локального SEO заблокирован до получения owner-доступа от оператора. Mitigation: в backlog как sustainable, разблокируется как только operator передаст.
- **Параллельный discovery двух эпиков** — нагрузка на `re` и `seo-content` одновременно. Mitigation: разнесение по неделям внутри 5-недельного timeline (W1/W2 — kw сбор и кластеры; W3/W4 — URL-decisions; W5 — финализация). Если нагрузка не вытянется — переключаюсь на sequential (landshaft first, как fallback из plan-mode).


---

## design · Дизайн-система

**PO:** art · **branch:** `design/integration` · **last update:** 2026-05-03

### Now

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-HOMEPAGE-V2** US-13 art-direction | Полная пересборка главной obikhod.ru под Direction 1 «Фотосмета» по brand-guide v2.2. 16 секций (4 new / 5 redesign / 7 reuse / 1 drop). 3 артефакта-brief готовы. | art | 0.5 чд (done) | 5×5×0.9/0.5 = 45 | M | art-brief.md / art-brief-ui.md / art-brief-ux.md ✅ done 2026-05-03. [intake](../specs/US-13-homepage-redesign-art/intake.md) |

### Next — dev-ready после signoff cpo

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-HOMEPAGE-V2** US-14 ui-mockups | 6 макетов (3 desktop + 3 mobile) для Hero+CertificateBand / PhotoSmeta / Coverage. 4 component spec для новых компонентов. Token sync в `design/integration` если нужно. | ui | ~3 чд | 5×4×0.9/3 = 6.0 | M | art-brief-ui.md ready, ждёт signoff art→cpo→ui kick-off |
| **EPIC-HOMEPAGE-V2** US-15 ux-wireframes | CJM 3 персон + wireframes (low-fi) desktop+mobile + interaction specs (PhotoSmeta drop-zone states, mobile camera, errors) + a11y checklist WCAG AA. | ux | ~2.5 чд | 5×4×0.9/2.5 = 7.2 | M | art-brief-ux.md ready, ждёт signoff art→cpo→ux kick-off |

### Later

| ID | Что | Owner | Effort | RICE | M | Статус |
|---|---|---|---|---|---|---|
| **EPIC-HOMEPAGE-V2** brand-guide §35 Homepage | PR в `design/integration` — добавить §35 Homepage layout + расширить §11 (Stats/Testimonials/DistrictCard-mini) + дополнить §13 TOV для Direction 1 operational регистра. Делается ПОСЛЕ launch новой главной. | art | ~1 чд | 4×3×0.9/1 = 10.8 | C | blocked by US-14 + US-15 + US-16 fe-build approve |

### Blocked

(блокеров нет на art briefs — direction утверждён оператором 2026-05-03)

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
| Telegram bot setup (бывший PAN-9) | podev (US-8) | panel (Leads уведомления оператору) + product (lead notifications) | владение перешло из panel в product 2026-04-29 |
| SMTP setup (бывший PAN-10) | do (общая инфра) | panel (auth recovery если 2FA) + product (lead форма заявки) | владение перешло из panel 2026-04-29 |
| EPIC-HOMEPAGE-V2 photo production | art (brief) | operator (внешний фотограф) | 11 финальных кадров для Hero/Team/Cases. Без них Hero/Team на launch — placeholder, Team сокращена до 2 карточек. Trigger 2026-05-03. |
| EPIC-HOMEPAGE-V2 Reviews collection + Cases.featured | art (brief) | popanel (Payload backlog) | новая коллекция Reviews (author/rating/text/source/featured) + флаг Cases.featured для top-3 динамической выборки. US-18 в EPIC-HOMEPAGE-V2. Trigger 2026-05-03. |
| EPIC-HOMEPAGE-V2 SEO main page | art (brief) | poseo (SEO consultation) | H1/Title с топ-ключом «вывоз мусора Москва» 161k freq + LocalBusiness/Organization/ServiceCollection/FAQPage/BreadcrumbList JSON-LD. Не блокер (poseo консультирует, fe-site реализует). |
