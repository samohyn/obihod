---
title: Frequency tiers definition (ВЧ / СЧ / НЧ)
created: 2026-05-03
operator_approved: 2026-05-03 (вариант α)
applies_to: всё семантическое ядро Обихода (services + landshaft + shop)
metric: wsk (Wordstat «!»-точное, Москва+МО база `msk` Keys.so)
---

# Frequency tiers — Обиход

## Определение (operator approved 2026-05-03)

Variant **α — классика RU SEO** (Ашманов / Кокшаров):

| Тир | wsk | Назначение | Roleиграет |
|---|---|---|---|
| **ВЧ** | `wsk >= 1000` | Head-страницы | Pillar / sub-pillar главные слова, главная страница |
| **СЧ** | `100 <= wsk < 1000` | Основной контент с конверсией | Sub-services, SD priority-A, main pillar контент |
| **НЧ** | `wsk < 100` | Long-tail | SD priority-B, blog-cases, внутренняя перелинковка |

## Альтернативы (отклонены оператором)

- **β — enterprise** (≥10 000 / 1 000-10 000 / <1 000) — слишком жёсткий для ниш арбо/демонтаж где ВЧ topки = 1-2K wsk.
- **γ — project-specific** (по distribution percentile) — адаптивно, но не воспроизводимо между monthly snapshots.

## Distribution на 2026-05-03 (Wave 3 multi-domain pull)

Source: `seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv` — 21 051 уникальных ключей из 32 services-конкурентов.

| Тир | Count | Доля |
|---|--:|--:|
| ВЧ | 167 | 0.8% |
| СЧ | 3 733 | 17.7% |
| НЧ | 17 151 | 81.5% |
| **Σ** | **21 051** | 100% |

> Long-tail dominance — типично для intersect 32 доменов. В per-domain pull (top-1000 wsk desc, как W2) распределение симметрично 5/40/55%.

## Дополнительный фильтр noisy ВЧ → СЧ

Keys.so возвращает поле `superwsk` (= wsk минус «фон» от ключа-омонима).

**Правило:** если `superwsk / wsk < 0.5` → демоут из ВЧ к СЧ.

**Пример:** «спил» (wsk 5 000, superwsk 1 200) — омоним «пилы (инструмент)»; superwsk/wsk = 0.24 < 0.5 → демоут к СЧ. Иначе мы бы посадили на pillar /arboristika/spil/ страницу с 76% нерелевантного трафика.

## Roleиграет в URL-планировании

| Тир | URL уровень | Слов / страница | Проверка outline |
|---|---|---|---|
| ВЧ | Pillar / `/foto-smeta/` / `/raschet-stoimosti/` | 6 000-9 000 | top-1 ВЧ ключ должен быть в H1 + Title + первом абзаце |
| СЧ | Sub-pillar / SD priority-A / B2B segment | 1 500-3 500 | top-3 СЧ ключей в H2 |
| НЧ | SD priority-B / blog-cases / FAQ items | 800-1 500 | НЧ ключ — H2/H3 уровень или абзац |

## Связанные артефакты

- [`seosite/02-keywords/derived/keysso-master-union-2026-05-03.csv`](derived/keysso-master-union-2026-05-03.csv) — column `tier_freq`
- [`seosite/02-keywords/derived/keysso-whitespace-2026-05-03.csv`](derived/keysso-whitespace-2026-05-03.csv) — column `priority` использует `tier_freq` для A1/A2/B
- [`seosite/scripts/keysso_intersect.py`](../scripts/keysso_intersect.py) — функция `tier_classify(wsk, superwsk)` — единственный source of truth для расчёта.
