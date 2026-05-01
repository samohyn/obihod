# Кластеры — Landshaft (услуга «Дизайн ландшафта»)

**EPIC:** [EPIC-SEO-LANDSHAFT](../../../specs/EPIC-SEO-LANDSHAFT/intake.md)
**Owner:** seo-content (под poseo)
**Сегмент:** services (5-й pillar / расширение)
**Статус:** discovery (skeleton 2026-04-29; наполняется после W2 — нормализации kw из `02-keywords/normalized-landshaft.csv`)

## Структура

Pillar + 5-8 cluster + B2B-trail. Гипотеза кластеров (финал после W2 kw-сбора):

| # | Кластер | URL (предв., решается в ADR-uМ-23) | Файл |
|--:|---|---|---|
| 0 | **Pillar** «Дизайн ландшафта» | `/dizain-landshafta/` | `pillar.md` |
| 1 | Проект ландшафтного дизайна | `/dizain-landshafta/proekt/` | `proekt.md` |
| 2 | Благоустройство участка | `/dizain-landshafta/blagoustroystvo/` | `blagoustroystvo.md` |
| 3 | Газон (укладка/ремонт/виды) | `/dizain-landshafta/gazon/` | `gazon.md` |
| 4 | Малые архитектурные формы | `/dizain-landshafta/malye-formy/` | `malye-formy.md` |
| 5 | Посадка крупномеров и многолетников | `/dizain-landshafta/posadka/` | `posadka.md` (cross-link → shop `krupnomery`) |
| 6 | Вертикальное озеленение / живые изгороди | `/dizain-landshafta/vert-ozelenenie/` | `vert-ozelenenie.md` |
| 7 | Кейсы / portfolio | `/keysy/?service=landshaft` (рекомендация ADR-uМ-25) | `kejsy.md` |
| 8 | B2B-trail (УК / застройщики) | `/b2b/landshaft/` (рекомендация ADR-uМ-24) | `b2b.md` |

Финальное число cluster'ов утверждается на W3 после нормализации wsfreq — некоторые кластеры могут слиться (например, «вертикальное озеленение» + «живые изгороди»), некоторые могут расщепиться («газон» отдельно от «рулонный газон»).

## Каноничный формат каждого `.md` (наследуется от `arboristika.md`)

Стандартный формат: `frontmatter` (cluster-id, pillar, sub-cluster, sum_wsfreq, top-keys, intent, sources) + head-keywords + long-tail + LSI + decisions/notes по схема-разметке (Service / Offer / AggregateRating).

## Источники данных (когда заполнять)

1. `seosite/02-keywords/raw/keysso-landshaft-*.json` — Keys.so по liwood + 5-7 landscape-студий
2. `seosite/02-keywords/raw/topvisor-landshaft-*.json` — Topvisor частоты по Москве+МО + сезонность (лето пик)
3. `seosite/02-keywords/raw/wordstat-landshaft-*.xml` — точные wsfreq для head-кластеров
4. `seosite/02-keywords/normalized-landshaft.csv`
5. `seosite/01-competitors/deep/liwood.ru.md` — есть baseline, использовать landshaft-разрез
6. `design-system/brand-guide-landshaft.html` — TOV Sage (когда `art` создаст; до тех пор — anti-words фильтр через `cpo` запрос)

## Cross-link map (выводится в `sa-seo.md`)

- `posadka.md` → shop категория `krupnomery` + `plodovye-derevya`
- `proekt.md` → arboristika `uxod-za-sadom` (после проекта — постоянное обслуживание)
- `b2b.md` → общий `/b2b/` pillar + `/b2b/dogovor/` (договор на сезонное обслуживание зелёных насаждений — добавить landshaft-разрез к существующей странице)

## Hand-off

После заполнения 9 файлов — `seo-content` передаёт `poseo` для финального ревью, далее в `sa-seo` для финализации ADR-uМ-23/24/25 + sitemap-tree v0.5 + cross-link map.
