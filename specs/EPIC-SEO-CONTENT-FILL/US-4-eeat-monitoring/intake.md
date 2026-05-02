---
us: US-4
epic: EPIC-SEO-CONTENT-FILL
title: Stage 3 W14 — E-E-A-T + neuro-SEO + monitoring + final sweep + W14 operator gate
team: seo
po: poseo
type: tech-seo
phase: spec
role: poseo
status: open
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish_w14: 2026-07-31
blocks: []
blocked_by: [US-3-priority-b-districts]
related: [US-6-competitor-benchmark]
skills_activated: [seo, blueprint, market-research, project-flow-ops]
---

# US-4 · Stage 3 W14 — E-E-A-T + monitoring + final sweep + W14 operator gate

> **Master-документ финального этапа** эпика `EPIC-SEO-CONTENT-FILL`. После
> US-3 W13 (URL ≥280, closure ≥75%) US-4 закрывает 2 оставшиеся axes
> (E-E-A-T parity → опережение, content-depth partial → confirmed) и формирует
> финальный пакет к **operator gate W14**: «опережение топ-3 по ≥3 из 5 осей».
> На W14 — финальный benchmark vs 17 конкурентов и hand-off в `release` gate.

---

## 1 · Цель US-4

Произвести **финальный artefakt-конвейер** — закрыть 4 блока:

1. **E-E-A-T hub** (`seosite/06-eeat/` + on-site `/komanda/` + `/sro-licenzii/`):
   реальные авторы (operator real-name + VK/TG sameAs), бригады, СРО,
   лицензии, ИНН/ОГРН — закрывает E-E-A-T axis парity → опережение.
2. **Neuro-SEO foundation** (`seosite/07-neuro-seo/`): LLM-friendly content
   markup (FAQ-блоки → AI-overviews / SGE / SearchGPT references) +
   `llms.txt` опционально.
3. **Monitoring** (`seosite/08-monitoring/`): Topvisor 200-key dashboard,
   Я.ВебМастер site verification, GSC fallback, 8 целей Я.Метрики финализация.
4. **Final SEO-tech sweep**: lint:schema 0 errors / 0 warns на 100% URL,
   sitemap.xml финал (≥280 URL), robots.txt audit, canonical zero loops, hreflang
   review (если применимо).

И собрать **operator gate W14 пакет** (`operator-gate-W14.md`) — финальный
отчёт по 5 осям опережения с numbers + screenshots + benchmark.

## 2 · Бизнес-цель

Operator gate W14: «опережение топ-3 по ≥3 из 5 осей» — hard DoD epic.
Текущее состояние W11 = 3/5 confirmed (schema +50pp / UX foto-smeta /
4-в-1 multi-pillar). К W14 цель — **≥3 confirmed sustained + 2 axes из
partial → confirmed**:

| Ось | W11 status | W14 target | Closes via |
|---|---|---|---|
| Schema-coverage | ✅ confirmed +50pp | sustained | US-4 final sweep AC-4.x |
| UX foto-smeta USP | ✅ confirmed | sustained | sustained от Stage 1 |
| 4-в-1 multi-pillar | ✅ confirmed | sustained | sustained от Stage 2 |
| URL-объём | 🟡 closure 48.2% | confirmed (closure ≥75% к liwood) | US-3 W13 |
| Content-depth | 🟡 +17% vs liwood | confirmed (+20% vs liwood) | US-3 + US-4 |
| **E-E-A-T** | 🟡 parity | **opraženie** vs cleaning-moscow (cross-domain) | **US-4 W14** ← главный |

**E-E-A-T = главная W14-ось** — без operator real-name + VK/TG sameAs +
СРО/лицензии on-site + Authors hub структура — E-E-A-T остаётся parity, а
не опережение. Operator action pending — US-4 explicit AC + escalation
если pending к W14 day 3.

## 3 · Scope (~12 артефактов + on-site страницы + W14 benchmark)

### 3.1 · E-E-A-T hub (`seosite/06-eeat/`)

| Артефакт | Содержание |
|---|---|
| `06-eeat/authors.md` | Реальные авторы (operator real-name + VK/TG sameAs), company-page «Бригада вывоза Обихода», sa-cw структура |
| `06-eeat/credentials.md` | СРО номер, лицензии (если применимо), ИНН/ОГРН (replace placeholders) |
| `06-eeat/team-bios.md` | Био бригадиров и инженеров (на основе real-name operator + общедоступных bios) |
| `06-eeat/case-evidence.md` | Связка cases ↔ realnost (договоры / акты — без PII) |
| `06-eeat/methodology.md` | Методики работы (ГОСТ / ОКВЭД / ТР ТС) — uniqueness E-E-A-T axis |

### 3.2 · On-site E-E-A-T страницы (доделать через cw + cms publish)

- `/komanda/` финализация (Stage 1 fixture готов, US-3 Wave 0 route fix)
- `/sro-licenzii/` финализация (Stage 1 fixture готов, US-3 Wave 0 route fix)
- Authors page «Бригада вывоза Обихода» — финализация bio + JSON-LD Person+Organization
- ~~Operator-author page~~ — pending operator real-name + VK/TG sameAs (escalation
  AC W14 day 3)

### 3.3 · Neuro-SEO foundation (`seosite/07-neuro-seo/`)

| Артефакт | Содержание |
|---|---|
| `07-neuro-seo/sge-readiness.md` | FAQ-блоки структура для AI-overviews / SGE / SearchGPT — паттерны Q+краткий-A |
| `07-neuro-seo/llms-txt-spec.md` | Опциональный `llms.txt` сайта (LLM-friendly content map) |
| `07-neuro-seo/jsonld-completeness.md` | JSON-LD coverage audit для AI-readiness |

### 3.4 · Monitoring (`seosite/08-monitoring/`)

| Артефакт | Содержание | Owner |
|---|---|---|
| `08-monitoring/topvisor-dashboard.md` | Topvisor 200-key dashboard setup (если creds есть; иначе fallback methodology) | seo-tech |
| `08-monitoring/yandex-webmaster.md` | Я.ВебМастер site verification + sitemap submission + индексация tracking | seo-tech |
| `08-monitoring/gsc-setup.md` | GSC fallback setup (через Cloudflare DNS verification) | seo-tech |
| `08-monitoring/yandex-metrika-goals.md` | 8 целей Я.Метрики финализация (lead-form / phone-click / chat / WhatsApp / CTA-banner / ...) | aemd (cross-team) |

### 3.5 · Final SEO-tech sweep

- `lint:schema` 0 errors / 0 warns на 100% URL (HomeAndConstructionBusiness url
  warns должны быть закрыты в US-3 Wave 0 — здесь финальная сверка)
- `sitemap.xml` финал (≥280 URL, no orphans, lastmod actual)
- `robots.txt` audit (allow важных + block низко-value)
- Canonical zero loops + zero contradictions
- Hreflang review (если применимо к B2B-страницам / multi-language plan)
- Redirect chains ≤2 hops + zero dead chains

### 3.6 · W14 Competitor Benchmark Final + differentiation matrix v4

- `seosite/01-competitors/benchmark-W14.md` — финальный отчёт vs 17 конкурентов
  по 5 осям + media (URL count / content-depth / schema-coverage / E-E-A-T /
  UX foto-smeta) — sustained pattern от W7 / W11
- `seosite/01-competitors/differentiation-matrix.md` v4 — финальный матричный
  расклад «что у нас уникально, что у конкурентов, где обогнали»

### 3.7 · Operator gate W14 пакет (`operator-gate-W14.md`)

- Executive summary 1 page
- 5 осей опережения с numbers + screenshots
- Benchmark vs 17 конкурентов + differentiation v4
- 280+ URL sitemap stats
- 100% lint:schema PASS
- 102+ axe reports (sustained от W11 + W13)
- Stage 3 commit count + PR list
- Pending operator action list (если есть на W14)
- Recommendation: «approve epic close» / «conditional close с follow-up backlog»

## 4 · Out-of-scope (US-4)

- ~~Wave 2.5 расширение до 30+ districts~~ — после W14 (post-EPIC backlog)
- ~~Полная B2B программатика `/b2b/uk-tszh/<service>/`~~ — отложена
- ~~Calculator-блок реальная логика~~ — placeholder sustained
- ~~Visual Regression CI (Chromatic / Percy)~~ — после W14
- ~~amoCRM (US-13)~~ — blocked by аккаунт
- ~~Brand-IDENTITY правки~~ — operator-only domain
- ~~staging.obikhod.ru deploy с GHA workflow~~ — pending operator DNS A-record
  + GHA secrets (escalation W14 day 3 если pending)

## 5 · Cross-team зависимости

| Команда / агент | Что нужно | Когда |
|---|---|---|
| **operator** (escalation) | Real-name + VK/TG sameAs (E-E-A-T axis 6) | W14 day 1-3 (escalation на day 3 если pending) |
| **operator** (escalation) | ИНН / ОГРН / СРО номера replace placeholders | W14 day 1-3 |
| **operator** (escalation) | Topvisor SaaS creds (если хотим real benchmark) | W14 day 1-3 (fallback methodology готов) |
| **operator** (escalation) | DNS A-record + GHA secrets для staging.obikhod.ru | W14 day 1-3 (post-EPIC если pending) |
| **aemd** (cross-team) | 8 целей Я.Метрики финализация — sa-seo brief + aemd setup | W14 day 4-5 |
| **re** (cross-team) | Deep-профили 17 конкурентов sustained refresh для W14 benchmark | W14 day 1-3 |
| **qa-site** + **cr-site** | Final sweep validation (lint:schema 0 warns + 280+ URL Playwright smoke) | W14 day 5-6 |
| **release** gate | После US-4 closure → RC release-notes + leadqa verify | W14 day 7 |

## 6 · DoD US-4 (= EPIC W14 gate)

| AC | Описание | Hard / Soft |
|---|---|---|
| AC-1 | E-E-A-T hub `seosite/06-eeat/` 5 артефактов done | **Hard** |
| AC-2 | On-site E-E-A-T страницы (`/komanda/`, `/sro-licenzii/`, Authors hub) published + JSON-LD audit PASS | **Hard** |
| AC-3 | Neuro-SEO foundation `seosite/07-neuro-seo/` 3 артефакта done | Hard |
| AC-4 | Monitoring `seosite/08-monitoring/` 4 артефакта done + 8 целей Я.Метрики live (или fallback methodology fixed) | Hard |
| AC-5 | Final SEO-tech sweep — lint:schema 0 warns + sitemap ≥280 URL + canonical/redirect audit PASS | **Hard** |
| AC-6 | W14 Competitor Benchmark Final + differentiation-matrix v4 | **Hard** |
| AC-7 | E-E-A-T axis из parity → опережение vs cleaning-moscow (если operator real-name + VK/TG done) | Soft (escalation если pending) |
| AC-8 | Content-depth axis из partial → confirmed (+20% vs liwood) | Hard |
| AC-9 | URL-объём axis из partial → confirmed (closure ≥75%) | Hard (закрывается US-3) |
| AC-10 | Operator gate W14 пакет (`operator-gate-W14.md`) ready | **Hard** |
| AC-11 | ≥3 из 5 осей confirmed → EPIC DoD PASS | **Hard** |

**W14 hard gate:** AC-1 / AC-2 / AC-5 / AC-6 / AC-10 / AC-11 PASS — operator
review + ack обязательны (memory `project_poseo_autonomous_mandate_2026-05-02`).

## 7 · Risk register

| Риск | Митигация |
|---|---|
| Operator real-name + VK/TG sameAs pending к W14 day 7 | E-E-A-T axis остаётся parity (не опережение); EPIC DoD всё ещё PASS если ≥3 axes confirmed (URL + schema + UX foto-smeta + 4-в-1 + content-depth = 5/6 без E-E-A-T) |
| Topvisor creds pending → fallback methodology | Sustained от W11 — Я.ВебМастер + Just-Magic + Wordstat XML; W14 benchmark будет «методологический», не SaaS-real-time |
| 8 целей Я.Метрики aemd зависает | Я.Метрика setup — техзадача, fallback к 4 целям если 8 не успеваем (lead-form / phone-click / WhatsApp / CTA-banner) |
| lint:schema 0 warns не достижим из-за 31 HomeAndConstructionBusiness url warns | Закрывается US-3 Wave 0 (AC-Wave0.4) — если slip → US-4 day 1 priority fix |
| 17 конкурентов deep-профилей не обновлены к W14 benchmark | Sustained от W7+W11 — top-3 (musor.moscow / liwood / cleaning-moscow) обязательны refresh, остальные 14 — diff-only |

## 8 · Hand-off log

- **`2026-05-02 · poseo`**: создан intake US-4 на основе approved EPIC
  intake.md + Stage 2 W11 closure + поглощения backlog Stage 3 из memory
  `project_seo_stage2`. **Pending до старта US-4:** US-3 closure W13 (AC-1 /
  AC-2 / AC-6 priority-B districts production) — без него W14 benchmark
  невозможен. Передаю `sa-seo` на написание `sa-seo.md` для US-4 после или
  параллельно с US-3 sa-spec (US-4 sa-spec может быть готов раньше production
  US-3, т.к. US-4 артефакты mostly артефактные `seosite/`, не код).
