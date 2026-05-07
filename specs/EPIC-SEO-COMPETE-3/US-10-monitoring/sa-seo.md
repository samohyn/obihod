---
us: US-10
title: Monitoring infrastructure — Topvisor + Я.Метрика + Keys.so weekly snapshot
team: seo
po: poseo
sa: poseo (autonomous)
type: tech-seo + monitoring + scripts
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo) · aemd (Я.Метрика goals) · cms (Topvisor manual setup)
status: in_progress
blocks:
  - US-12 final verify (нужны metrics weekly до W14)
blocked_by: []
related:
  - US-1 keysso_pull_3competitors.py (sustained pull pattern)
  - DoD AC-1..AC-7 EPIC (все требуют monitoring)
created: 2026-05-06
updated: 2026-05-06
---

# US-10 — Monitoring infrastructure

## Цель

Построить replicable weekly monitoring цикл. Без этого мы не сможем замерить EPIC DoD на W14: 7 metrics × 4 источника (Keys.so / Topvisor / Я.Метрика / manual AI-prompt tests).

## Скоуп

### IN (autonomous этой сессии)

1. **`seosite/scripts/seo-weekly-snapshot.py`** — pull Keys.so для 4 доменов:
   - `obikhod.ru` (наш — отслеживаем рост с 0)
   - `liwood.ru` (champion 155)
   - `arborist.su` (74)
   - `arboristik.ru` (65)
   Сохраняет JSON snapshots в `seosite/04-monitoring/<YYYY-MM-DD>/<domain>.json` + `summary.csv` (pagesInIndex / keys_top50 / vis / DR per snapshot).

2. **`seosite/04-monitoring/dashboard.md`** — template-документ:
   - Header: дата, source (Keys.so live), period (weekly)
   - Table: 4 домена × 4 metrics (pagesInIndex, keys top-50, vis, DR)
   - Trend section: WoW Δ для нашего домена + 3 конкурентов
   - Alerts section: что просело > 5 пунктов
   - Empty state до первого snapshot

3. **`seosite/04-monitoring/yandex-metrika-goals.md`** — список 12 целей для `aemd`:
   - 5 lead-form variants (kontakty / foto-smeta / pillar / sub / b2b)
   - 6 PDF download events (`b2b_<doc>_pdf_download`)
   - 1 calculator complete (foto-smeta success)

4. **`seosite/04-monitoring/topvisor-setup.md`** — manual UI runbook для cms:
   - Шаг 1: создать проект `obikhod-services` в Topvisor UI
   - Шаг 2: добавить домен + регион (Москва)
   - Шаг 3: импорт keywords (CSV из `seosite/02-keywords/derived/clusters-tfidf.csv`)
   - Шаг 4: setup weekly check schedule
   - Шаг 5: API token verify

5. **Initial baseline snapshot** — запуск скрипта, сохранение `seosite/04-monitoring/2026-05-06/`

6. **`seosite/04-monitoring/README.md`** — runbook для еженедельного цикла

### OUT (sustained для US-10 follow-up)

- Topvisor API automation (programmatic create project + import keywords + position pull) — отложено до полной API доку или Python SDK
- Telegram-бот алерт при дроп позиции > 5 пунктов — sustained для aemd через CronCreate / GitHub Actions
- Mermaid charts auto-generation в dashboard.md — manual вписание в первые недели
- Comparison `obikhod.ru` baseline до US-7 seed (pagesInIndex=0) — после deploy + Yandex re-crawl

## Implementation

### Files

| Path | Type | Lines |
|---|---|---:|
| `seosite/scripts/seo-weekly-snapshot.py` | new | ~150 |
| `seosite/04-monitoring/dashboard.md` | new | ~80 |
| `seosite/04-monitoring/yandex-metrika-goals.md` | new | ~120 |
| `seosite/04-monitoring/topvisor-setup.md` | new | ~100 |
| `seosite/04-monitoring/README.md` | new | ~60 |
| `seosite/04-monitoring/2026-05-06/` | snapshot | initial baseline |

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | weekly-snapshot.py запускается + сохраняет 4 JSON | 🔵 |
| AC-2 | dashboard.md template готов с placeholders | 🔵 |
| AC-3 | yandex-metrika-goals.md содержит 12 целей | 🔵 |
| AC-4 | topvisor-setup.md содержит runbook 5 шагов | 🔵 |
| AC-5 | initial baseline 2026-05-06 saved | 🔵 |
| AC-6 | Topvisor проект `obikhod-services` создан в UI (cms manual) | 🔵 sustained |
| AC-7 | 12 Я.Метрика goals настроены (aemd manual) | 🔵 sustained |
| AC-8 | Weekly snapshot 8 нед подряд (W3-W12 EPIC) | 🔵 sustained |

## Hand-offs

- **poseo → leadqa:** проверить snapshot.py запуск локально (КEYSO_API_KEY override)
- **poseo → cms:** Topvisor manual UI setup per `topvisor-setup.md`
- **poseo → aemd:** Я.Метрика 12 goals per `yandex-metrika-goals.md`
- **poseo → seo-tech (US-10 follow-up):** автоматизация snapshot через GitHub Actions cron (weekly Mon 9:00 MSK)

## Hand-off log

- 2026-05-06 21:30 · poseo: US-10 spec + dev (autonomous, infrastructure scripts)
