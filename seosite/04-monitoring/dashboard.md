# SEO Dashboard — EPIC-SEO-COMPETE-3

**Последний snapshot:** **2026-05-07** (Keys.so live, base=msk)
**Baseline EPIC start.**

## Текущее состояние

| Домен | pagesInIndex | keys top-50 | keys top-10 | vis | DR | ai-answers |
|---|---:|---:|---:|---:|---:|---:|
| **obikhod.ru (we)** | **0** | **0** | **0** | **0** | **0** | **0** |
| liwood.ru | 155 | 5 050 | 733 | 34 | 21 | 803 |
| arborist.su | 75 | 1 329 | 378 | 18 | 24 | 210 |
| arboristik.ru | 65 | 1 336 | 476 | 64 | 26 | 364 |

Δ vs initial (2026-05-06):
- **liwood.ru:** keys top-50 -47 (5097→5050), vis -3 (37→34), ai-answers -446 (1249→803) — продолжает падать ✅ окно для нас
- **arborist.su:** pagesInIndex +1 (74→75), keys top-50 -26 — стабилен
- **arboristik.ru:** vis +7 (57→64), keys top-50 -29, pagesInIndex 65 — небольшой growth visibility

## Тренд obikhod.ru (WoW)

| Метрика | Baseline | Last week | This week | Δ | Target W14 |
|---|---:|---:|---:|---:|---:|
| pagesInIndex | 0 | TBD | TBD | TBD | **≥160** |
| keys top-50 | 0 | TBD | TBD | TBD | TBD |
| keys top-10 | 0 | TBD | TBD | TBD | **≥80** |
| vis | 0 | TBD | TBD | TBD | TBD |
| DR | TBD | TBD | TBD | TBD | TBD |
| ai-answers | 0 | TBD | TBD | TBD | TBD |

## Конкуренты — тренд (WoW)

| Домен | pagesInIndex Δ | keys top-50 Δ | Notes |
|---|---:|---:|---|
| liwood.ru | TBD | TBD | падает с пика 165 (12.2025) |
| arborist.su | TBD | TBD | растёт +19% YoY (62→74) |
| arboristik.ru | TBD | TBD | падает -23% Q1 (84→65) |

## Topvisor (отдельный CSV — `topvisor.csv`)

| Кластер | keys в проекте | top-10 share | Δ WoW |
|---|---:|---:|---:|
| arboristika | TBD | TBD | TBD |
| uborka-territorii | TBD | TBD | TBD |
| chistka-krysh | TBD | TBD | TBD |
| vyvoz-musora | TBD | TBD | TBD |
| demontazh | TBD | TBD | TBD |

## Я.Метрика (отдельный CSV — `yandex-metrika.csv`)

| Метрика | Last week | This week | Δ | Target W14 |
|---|---:|---:|---:|---:|
| Organic sessions | TBD | TBD | TBD | **≥800/нед** |
| Lead submissions | TBD | TBD | TBD | **≥15/нед** |
| Form submit rate (leads/sessions) | TBD | TBD | TBD | TBD |

## AI-citation rate (раз в 4 нед — `ai-citations.md`)

| Промпт | YandexGPT | SearchGPT | Perplexity | Score |
|---|:---:|:---:|:---:|---:|
| 10 prompts × 3 LLM | TBD | TBD | TBD | **≥4/30** |

## Алерты

(empty — алертить начнём после первого snapshot)

## Ключевые observations

- obikhod.ru baseline pagesInIndex = 0 (новый сайт). Ожидаем рост к W14 за счёт seed данных + Yandex re-crawl.
- liwood.ru теряет позиции (-7% pagesInIndex Q1). Окно для нас расширяется.
- arboristik.ru теряет ещё быстрее (-23% Q1). Реалистичный target — обогнать в Q2.
- arborist.su стабильно растёт — внимание на B2B-нормативку (US-6 Phase 1 после merge).

## Следующее (poseo)

- [ ] Запустить `seo-weekly-snapshot.py` после prod deploy + Yandex re-crawl
- [ ] cms: Topvisor проект `obikhod-services` создан (per `topvisor-setup.md`)
- [ ] aemd: 12 Я.Метрика goals настроены (per `yandex-metrika-goals.md`)
- [ ] poseo: первый AI-citation prompt-test (W3 после публикации)
