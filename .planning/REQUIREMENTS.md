# Requirements: Обиход — Milestone v1.0 Overtake-3

**Defined:** 2026-05-15
**Core Value:** Один лид через сайт стоит дешевле, чем у любого из 3 ключевых конкурентов (liwood.ru / arboristik.ru / arborist.su), потому что мы выигрываем по SEO/Schema/CRO/B2B-trail и закрываем фото→смета за 10 минут через Claude API

## v1 Requirements

Требования для Milestone v1.0 Overtake-3. Каждое маппится на ровно одну phase в ROADMAP.md.

### Benchmark (live decision-grade snapshots + 8-axis verdict 2 новых конкурентов)

- [ ] **BENCH-01**: PO/seo создаёт `seosite/01-competitors/arboristik-snapshot-2026-05.json` — 13 URL (homepage + /uslugi/ + 5 pillars + 5 sub + /price/ + /contact/) × WebFetch + Keys.so delta vs 2026-05-06 baseline + PSI mobile/desktop CWV mobile p75
- [ ] **BENCH-02**: PO/seo+arch создают `seosite/01-competitors/arboristik-vs-obikhod-2026-05.md` — 8 осей × {arboristik / obikhod / verdict (LEAD/PARITY/LAG) / gap size / leverage ref / proposed action} (sustained шаблон из liwood-vs-obikhod-2026-05-W.md)
- [ ] **BENCH-03**: PO/seo создаёт `seosite/01-competitors/arborist-su-snapshot-2026-05.json` — аналогично BENCH-01 для arborist.su (13 URL × WebFetch + Keys.so + PSI)
- [ ] **BENCH-04**: PO/seo+arch создают `seosite/01-competitors/arborist-su-vs-obikhod-2026-05.md` — 8 осей × verdict (sustained шаблон)

### Cross-roadmap (synthesis 3 benchmarks → ≤8 NEW US с RICE)

- [ ] **XROAD-01**: arch+seo+po синтезируют `seosite/01-competitors/cross-overtake-roadmap-2026-05.md` — leverage matrix 3-way (liwood ⊕ arboristik ⊕ arborist.su) + RICE recompute + RACI + Gantt 8-12 нед
- [ ] **XROAD-02**: po+arch выполняют cannibalisation matrix hard gate per-URL audit vs ADR-0018 §13 — ни один NEW URL не каннибализирует sustained LEAD-axes (5/8)
- [ ] **XROAD-03**: po добавляет ≤8 NEW US в `team/backlog.md` (RICE floor ≥1.5, dedup vs 16 sustained OVT-*/US-2..11) с phase/owner/effort/MoSCoW

### Monitor 3X (расширение watcher.ts 1 конкурент → 3)

- [ ] **MON-01**: dev+seo рефакторят `seosite/04-monitoring/watcher.ts` — extract URLs в новый `seosite/04-monitoring/targets.config.ts` (3 competitors блоками: liwood / arboristik / arborist_su)
- [ ] **MON-02**: dev+seo мигрируют snapshot schema `{competitors: {liwood, arboristik, arborist_su}, obikhod}` с backwards-compatible legacy reader для старых liwood-only snapshots
- [ ] **MON-03**: dev+seo добавляют `detectBreaches()` per-competitor + `p-limit(4)` concurrency (39 fetches 5 мин → ~30 сек) + per-target config (UA, throttle rps, retry, robots.txt allowlist, expected min content size)
- [ ] **MON-04**: dev+devops обновляют `.github/workflows/seo-monitor.yml` — `timeout 15min`, alert filename `${DATE}-${COMP}-${TYPE}.md`, `gh issue create --label competitor:${KEY}`, cron комментарий `# 08:00 МСК Mon` (UTC vs MSK безопасность)
- [ ] **MON-05**: dev+seo verify watcher `--dry-run ≥7 дней` до prod cron-enable (liveness assertion работает: `null`/`<50% baseline` → immediate Telegram alert)

### B2B-trust (закрытие LAG ось 8 — B2B/local; NEW P1 apruved Day-0 2026-05-15)

- [ ] **B2B-01**: dev+cw+design создают `/b2b/abonement/` — landing с 3 тарифами абонентки «зима-лето» (45k/120k/220-450k ₽/мес) + договор-шаблон PDF (OVT-8). White space: никто из 3 конкурентов не делает
- [ ] **B2B-02**: cw+design дизайнят `/b2b/` flagship hero «Штрафы ГЖИ/ОАТИ берём на себя» — first-mover messaging по 3 нишам сразу (паттерн alpbond.org) + ссылка на договор страховой третьей стороны (OVT-9)
- [ ] **B2B-03**: cw+design обновляют hero arborist-related страниц (5 pillar + select sub) — допуски Минтруда 782н + страховка ГО 10 млн → regulatorный язык (паттерн arborist.su)
- [ ] **B2B-04**: po обеспечивает страховой полис ГО 15 млн `≤250k₽/год` (operator action — договор со страховой третьей стороной + регистрация ЮЛ вместо placeholder ИНН 1111111111). Hard prerequisite для B2B-01 и B2B-02

### Content-depth (закрытие LAG vs liwood 3500w; NEW P1 apruved Day-0 2026-05-15)

- [ ] **CONT-01**: cw+design добавляют LSI-блок «10 причин выбрать специалиста» в T2 master-template на 5 pillar (arboristika / chistka-krysh / vyvoz-musora / demontazh / dizain-landshafta) — закрывает content-depth LAG vs liwood 3500w на флагмане
- [ ] **CONT-02**: cw+design добавляют LSI-блок «Сам vs специалист» в T2 master-template (3 pillar где применимо: arboristika, demontazh, chistka-krysh) — pattern из liwood-page-anatomy §1.2

### Execution closure (sustained OVT-1..7 + US-2..11 до DoD)

- [ ] **EXEC-01**: seo+cw+dev закрывают **OVT-1** — SD extension 154→250 (incl landshaft pillar) до DoD; sitemap.ts updated, 100% JSON-LD coverage, all URLs HTTP 200
- [ ] **EXEC-02**: cw+seo+design закрывают **OVT-2** — B2B-trail 6 PDF лендингов на `/b2b/<doc>/` (СРО / лицензия Росприроднадзора / страховка ГО 10 млн / 782н / договор-шаблон / отзывы УК)
- [ ] **EXEC-03**: seo+dev+cw закрывают **OVT-4** — Я.Карты embed lazy-load на топ-10 SD + LocalBusiness JSON-LD enrich на 100% T4 (Я.Бизнес owner setup — operator action)
- [ ] **EXEC-04**: art+cw+dev+design закрывают **OVT-5** — 3 видео-кейса (T2 pillar арбо/демонтаж/чистка крыш) встроены на pillar pages (real footage coordination — operator action)
- [ ] **EXEC-05**: cw+popanel+design закрывают **OVT-6** — AggregateRating JSON-LD на всех T2 + 30 реальных reviews в Payload Reviews collection
- [ ] **EXEC-06**: seo+cw+dev+dba закрывают **OVT-7** — Landshaft SD seed (5-й pillar × 30+ city districts) — sub OVT-1, но трекаем отдельно из-за специфики landshaft контента
- [ ] **EXEC-07**: seo закрывает **US-2** url-map до merged main + DoD (sa-seo.md уже apruved)
- [ ] **EXEC-08**: cw+seo закрывают **US-3** neuro-seo (нейровыдача оптимизация) до merged + DoD
- [ ] **EXEC-09**: cw+dev закрывают **US-4** mega-pricing (прайс таблицей Ø × метод × цена — паттерн arboristik) до merged + DoD
- [ ] **EXEC-10**: seo+dev закрывают **US-7** programmatic-seed (sub × city для топ-3 sub в каждом pillar = +90 SD) до merged + DoD
- [ ] **EXEC-11**: dev закрывает **US-8** lead-infra (post-W15 enhancements) до merged + DoD
- [ ] **EXEC-12**: cw+popanel закрывают **US-9** reviews-otzyvy (sustained EXEC-05; trace отдельно из-за seo-фокуса) до merged + DoD
- [ ] **EXEC-13**: seo+dev+devops закрывают **US-10** monitoring legacy single-competitor — sustained, мигрирует в MON-01..05; DoD = closed-with-supersede note
- [ ] **EXEC-14**: cw+seo закрывают **US-11** authors-eeat (5+ авторов, 50% blog content с author/lastReviewedAt) до merged + DoD

## v2 Requirements

Deferred to v1.1+ (operator apruved Day-0 2026-05-15). Tracked but not in current roadmap.

### Marketing creative (P3 NEW US)

- **MKT-V1.1-01** (was OVT-10): «Снег выпал» dynamic creative — Я.Погода API + Я.Директ dynamic ads; +35% CR per contex/02 §5.1
- **MKT-V1.1-02** (was OVT-11): «Зимняя абонентка» landing с auto-scheduler + Telegram bot reminder (requires B2B-01 / OVT-8 done first)
- **MKT-V1.1-03**: OVT-MKT marketing-angle assets phase 2 — post-launch на основе реальных RUM/CR данных (PR sales-deck + Я.Директ creative refresh)
- **MKT-V1.1-04**: 2GIS / Google Business Profile parity (если operator вытащит из nice-to-have)

### Strategic next-bets (требуют v1.0 metrics)

- **NEXT-V1.1-01**: B2B pilot outreach 50 УК/ТСЖ через cold mail/Telegram (после B2B-01..03 launched и измерения CR)
- **NEXT-V1.1-02**: Just-Magic deep clustering endpoint integration (pending operator clarification из US-1)
- **NEXT-V1.1-03**: amoCRM full integration (US-13 OBI-25) — blocked by аккаунт

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Магазин саженцев и растений | Dropped 2026-05-09 (ADR-0020); landshaft переподшит как 5-й pillar услуг |
| Tilda / WordPress / Bitrix / Astro | Отвергнуто в `contex/04_competitor_tech_stacks.md`; сохраняем Next 16 + Payload 3 |
| Vercel / Netlify / Cloudflare Workers / Strapi / Directus | РФ-юрисдикция 152-ФЗ; используем Beget VPS + Payload embed |
| Финтех-следы в агентах (банк/брокер/ЦБ РФ/KYC/AML) | Запрет CLAUDE.md «Запрещено в проекте» |
| Замена brand/TOV/оффера | Immutable по `contex/03_brand_naming.md` и `design-system/brand-guide.html` v2.3 |
| «От 1000 ₽» демпинг (паттерн arboristik) | Anti-TOV: обесценивает бренд Caregiver+Ruler; см. liwood-vs-obikhod B3 «what NOT to copy» |
| 3 копии lead-form на одной странице (паттерн liwood) | Anti-UX: размытое intent, понижает CR vs одна форма + sticky CTA |
| «25 лет» когда юр-лицу 2024 | Юр-риск ФЗ-38 «о рекламе» — недостоверные заявления |
| Латиница в бренде (Liwood vs ОБИХОД) | Immutable бренд (контекст 03_brand_naming.md) |
| sticky-header 88px на mobile (паттерн liwood) | Anti-UX mobile (375/414 viewport), нарушает brand-guide §33 site-chrome |
| Shutterstock stock-photos (паттерн arboristik) | TOV anti-pattern, ломает локальность; используем fal.ai Nano Banana Pro или реальные кейсы |
| Калькулятор-bait без расчёта (паттерн liwood) | Anti-CRO: bait без value → bounce. Наш калькулятор photo→quote реально считает через Claude API |
| Vintage authority «25 лет команды» в hero | Cw validation required; вместо — «команда с N+ лет опыта» только при наличии доказательств |
| Payload CompetitorSnapshots collection | Overkill, snapshots остаются git-tracked JSON в `seosite/04-monitoring/snapshots/` |
| Ahrefs / Semrush / Moz / SerpAPI / DataForSEO | Дубль sustained Topvisor + Keys.so + РФ payment ограничения |
| Puppeteer-stealth для bypass anti-bot | Юр-серая зона; используем native WebFetch с whitelisted UA |
| Grafana / Prometheus / Notion для dashboards | Overkill для milestone; GH Actions issues + Telegram достаточно |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BENCH-01 | TBD | Pending |
| BENCH-02 | TBD | Pending |
| BENCH-03 | TBD | Pending |
| BENCH-04 | TBD | Pending |
| XROAD-01 | TBD | Pending |
| XROAD-02 | TBD | Pending |
| XROAD-03 | TBD | Pending |
| MON-01 | TBD | Pending |
| MON-02 | TBD | Pending |
| MON-03 | TBD | Pending |
| MON-04 | TBD | Pending |
| MON-05 | TBD | Pending |
| B2B-01 | TBD | Pending |
| B2B-02 | TBD | Pending |
| B2B-03 | TBD | Pending |
| B2B-04 | TBD | Pending (operator action) |
| CONT-01 | TBD | Pending |
| CONT-02 | TBD | Pending |
| EXEC-01 | TBD | Pending |
| EXEC-02 | TBD | Pending |
| EXEC-03 | TBD | Pending (operator action Я.Бизнес) |
| EXEC-04 | TBD | Pending (operator action footage) |
| EXEC-05 | TBD | Pending |
| EXEC-06 | TBD | Pending |
| EXEC-07 | TBD | Pending |
| EXEC-08 | TBD | Pending |
| EXEC-09 | TBD | Pending |
| EXEC-10 | TBD | Pending |
| EXEC-11 | TBD | Pending |
| EXEC-12 | TBD | Pending |
| EXEC-13 | TBD | Pending |
| EXEC-14 | TBD | Pending |

**Coverage:**
- v1 requirements: **32** total
- Mapped to phases: 0 (filled by roadmapper)
- Unmapped: 32 ⚠️ (will be 0 after roadmap)

---
*Requirements defined: 2026-05-15*
*Last updated: 2026-05-15 after Day-0 operator batch + research synthesis*
