---
title: Topvisor 200-key dashboard + fallback methodology iron rule
owner: sa-seo
co-owners: [seo-tech, re]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-4.1]
related:
  - "../03-clusters/_summary.json"
  - "../03-clusters/_q2_signal.json"
  - "./yandex-webmaster.md"
  - "./yandex-metrika-goals.md"
---

# Topvisor 200-key dashboard + fallback methodology

> Sustainable trend tracking infrastructure post-EPIC. **Sa-seo iron rule (codified в §4):** «fallback methodology = source of truth, SaaS = augmentation» → даже если Topvisor creds дойдут, fallback (Wordstat XML + Just-Magic + Key Collector + Keys.so) остаётся primary. ADR-кандидат для tamd post-US-4.

## 1. Sustained context

- **SEO стек российский** (sustained `project_seo_stack` iron rule): Wordstat XML + Just-Magic + Key Collector + Keys.so. **Без Ahrefs / SEMrush** — операторский iron rule (РФ-юрисдикция, sanctions risk).
- **Topvisor SaaS** — опциональный augmentation tool для weekly automated SERP-tracking + dashboard UI.
- **Operator escalation pending** (W14 day 1): Topvisor creds (login + payment subscription).

## 2. Branch A — Topvisor SaaS creds переданы оператором

### 2.1 · 200-key dashboard setup

| Pillar | Top keys × pillar | Cluster source |
|---|---:|---|
| Вывоз мусора | 50 | `../03-clusters/vyvoz-musora.md` (top 50 по freq) |
| Арбористика | 50 | `../03-clusters/arboristika.md` (top 50) |
| Чистка крыш | 50 | `../03-clusters/chistka-krysh.md` (top 50) |
| Демонтаж | 50 | `../03-clusters/demontazh.md` (top 50) |
| **Total** | **200** | |

### 2.2 · Регионы

- **Москва** (region_id 1)
- **Московская область** (region_id 51)
- **Russia overall** (для broad benchmark)
- **8 districts cross-section** (priority-A: ВАО Москва / ЦАО Москва / Раменское / Жуковский; priority-B: Балашиха / Мытищи / Химки / Подольск)

### 2.3 · Refresh cadence

- **Weekly** (sustained Topvisor default — Monday 06:00 MSK).
- **Top-50 daily refresh** для top-50 priority keys (premium feature, optional).

### 2.4 · Export & integration

- CSV export weekly → Google Sheets dashboard
- aemd cross-team setup Sheets connector если нужен (sustained `project_poseo_autonomous_mandate_2026-05-02`)
- Manual fallback: weekly CSV download + spot-check sa-seo

### 2.5 · Cost projection (W14)

- Topvisor Standard plan ~7 000 ₽/мес (200 keys + 3 регионов + weekly refresh)
- Topvisor Premium plan ~15 000 ₽/мес (200 keys + 8 регионов + daily top-50)
- **Sa-seo recommendation:** Standard plan на старте, escalate to Premium только если confirmed value (≥3 месяца usage).

## 3. Branch B — Topvisor creds pending к W14 day 1

### 3.1 · Fallback methodology (sustained Stage 1+2+3)

| Tool | Role | Refresh cadence | Source |
|---|---|---|---|
| **Wordstat XML** (manual export) | Volume + trend tracking | bi-weekly | wordstat.yandex.ru — XML/CSV export |
| **Just-Magic** | Cluster tracking + SD priority sort | weekly | sustained Stage 1+2+3 (`../03-clusters/raw-justmagic-*.csv`) |
| **Key Collector** | On-page SEO audit + cluster expand | monthly | desktop tool, manual run |
| **Keys.so** | Конкурентный SERP-tracking (top-100 для 200 keys) | bi-weekly | API + manual export |
| **Я.ВебМастер «Поисковые запросы»** | Real-traffic queries + позиции на нашем сайте | weekly | Я.ВебМастер UI (см. `./yandex-webmaster.md`) |
| **Manual SERP top-50 spot-check** | Sanity check для top-20 priority keys | bi-weekly | sa-seo + re cross-team |

### 3.2 · Точность fallback

- **±15% precision** (sustained от W7+W11 benchmark precedent — закрыты в Stage 2 W11 mid-check).
- Coverage: 200 keys × 3 региона × top-100 SERP = 60 000 data-points/refresh.
- Latency: bi-weekly refresh (vs Topvisor weekly) — **acceptable** для US-4 scope.

### 3.3 · Refresh process (fallback)

1. **Day 1 (Monday) — Wordstat XML export:** sa-seo manual export 200 priority keys × 3 региона.
2. **Day 1 — Just-Magic refresh:** sa-seo run cluster expansion для 4 pillar clusters.
3. **Day 2 — Key Collector audit:** sa-seo desktop run, output CSV.
4. **Day 3 — Keys.so SERP top-100:** API + manual export по top-20 priority keys.
5. **Day 3 — Я.ВебМастер «Поисковые запросы»:** weekly poll (autonomous).
6. **Day 4 — Manual SERP spot-check:** sa-seo + re cross-team — top-20 priority keys в incognito Chrome (Москва/МО geo).
7. **Day 5 — Compile dashboard:** Google Sheets manual update от sa-seo.

## 4. Sa-seo iron rule — codified

> **«Fallback methodology = source of truth, SaaS (Topvisor) = augmentation»**

### 4.1 · Why iron rule

| Reason | Impact |
|---|---|
| Topvisor SaaS subscription может lapse (payment / vendor issue) | Без fallback — мы слепы к ranking движениям |
| Vendor lock-in риск | Платим за SaaS → зависим от их API + UI changes |
| Budget risk | 7-15k ₽/мес × 12 мес = 84-180k ₽/год → не trivial для startup-этапа |
| РФ-юрисдикция (sustained `project_seo_stack`) | Wordstat XML / Just-Magic / Key Collector / Keys.so — **российский стек**, без sanctions exposure. Topvisor — российский SaaS, OK; но iron rule independence — в любом случае primary fallback |
| Reproducibility | Fallback methodology — `seosite/03-clusters/` artefacts, version-controlled в git → reproducible на любой момент |
| Cross-team handoff | Fallback methodology работает без external SaaS access → handoff легче (sa-seo → poseo → seo-content без лишних credentials) |

### 4.2 · Codified ADR-кандидат

```markdown
# ADR-XXXX: Topvisor SaaS = augmentation, fallback methodology = source of truth

## Decision
Используем fallback methodology (Wordstat XML + Just-Magic + Key Collector +
Keys.so + Я.ВебМастер) как primary monitoring source. Topvisor — augmentation
(faster refresh + UI dashboard), но НЕ замена fallback.

## Why
- Vendor independence (sustained `project_seo_stack` iron rule)
- Reproducibility (git-versioned artefacts)
- Budget risk mitigation
- Handoff simplicity без credentials

## Consequences
+ Sustainability post-EPIC без SaaS dependency
+ РФ-юрисдикция compliance
- Manual labor higher (~2-3h/week sa-seo)
- Latency longer (bi-weekly vs daily)
```

(Финальный ADR — `team/adr/ADR-XXXX-topvisor-fallback-iron-rule.md`, проектирует tamd post-US-4.)

## 5. 200-key priority shortlist (referenced)

Полный shortlist 200 keys — в `../03-clusters/`:
- `vyvoz-musora.md` — top 50 (sustained Stage 1)
- `arboristika.md` — top 50 (sustained Stage 1)
- `chistka-krysh.md` — top 50 (sustained Stage 1)
- `demontazh.md` — top 50 (sustained Stage 1)

**Filter criteria (sustained Stage 1):**
- frequency ≥ 100 (Wordstat МО) → mainstream
- intent = commercial OR commercial-info-bridge (sustained `_summary.json`)
- not pure-info (info-only blog keys excluded)

## 6. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-4.1.a | topvisor-dashboard.md written (обе ветки) | sa-seo | Hard |
| AC-4.1.b | iron rule §4 codified + ADR-кандидат | sa-seo + tamd post-US-4 | Hard (ADR Soft post-EPIC) |
| AC-4.1.c | Topvisor creds escalation log | poseo W14 day 1 | Hard |
| AC-4.1.d | 200-key shortlist link `../03-clusters/` | sa-seo | Hard (sustained) |
| AC-4.1.e | Fallback runbook §3.3 ready на staging | sa-seo + re | Hard |

**Hand-off:**
- sa-seo → poseo (W14 day 1): escalation operator на Topvisor creds.
- sa-seo → re (W14 day 4-5): manual SERP top-50 spot-check setup на bi-weekly cadence.
- sa-seo → tamd (post-US-4): finalize ADR-кандидат §4.2.
