# Кластеры — Shop (магазин саженцев)

**EPIC:** [EPIC-SEO-SHOP](../../../specs/EPIC-SEO-SHOP/intake.md)
**Owner:** seo-content (под poseo)
**Сегмент:** ecommerce
**Статус:** discovery (skeleton 2026-04-29; наполняется после W2 — нормализации kw из `02-keywords/normalized-shop.csv`)

## Структура

Каждая из 9 категорий магазина саженцев получает свой кластерный файл (формат как `arboristika.md` / `vyvoz-musora.md` в родительской папке):

| # | Категория | URL | Файл |
|--:|---|---|---|
| 1 | Плодовые деревья | `/magazin/plodovye-derevya/` | `plodovye-derevya.md` |
| 2 | Колоновидные плодовые | `/magazin/kolonovidnye/` | `kolonovidnye.md` |
| 3 | Плодовые кустарники | `/magazin/plodovye-kustarniki/` | `plodovye-kustarniki.md` |
| 4 | Декоративные кустарники | `/magazin/dekorativnye-kustarniki/` | `dekorativnye-kustarniki.md` |
| 5 | Цветы | `/magazin/cvety/` | `cvety.md` |
| 6 | Розы | `/magazin/rozy/` | `rozy.md` |
| 7 | Крупномеры | `/magazin/krupnomery/` | `krupnomery.md` |
| 8 | Лиственные деревья | `/magazin/listvennye/` | `listvennye.md` |
| 9 | Хвойные | `/magazin/khvoynye/` | `khvoynye.md` |

Дополнительный файл `_product-tail-patterns.md` — паттерны товарного long-tail (сорт × размер контейнера × ZKS/ОКС × сезон) — общий для всех 9 категорий.

## Каноничный формат каждого `.md` (наследуется от `arboristika.md`)

Каждый кластерный файл содержит:
- `frontmatter` (cluster-id, pillar, sub-cluster, sum_wsfreq, top-keys, intent, sources)
- секцию head-keywords (top-20 по wsfreq)
- секцию long-tail (товарные tail и фасеты)
- LSI-варианты (anti-words из `design-system/brand-guide.html` §17 фильтруются на этапе нормализации)
- decisions/notes по разметке (Product schema, faceted-nav правила)

## Источники данных (когда заполнять)

1. `seosite/02-keywords/raw/keysso-shop-*.json` — Keys.so выгрузки по 4 ecommerce-конкурентам (Леруа, Подворье, Савватеевы, Поиск)
2. `seosite/02-keywords/raw/topvisor-shop-*.json` — Topvisor частоты по МО + сезонность
3. `seosite/02-keywords/normalized-shop.csv` — нормализация (Just-Magic кластеризация)
4. `design-system/brand-guide.html` §17 — лексика shop (anti-words на нормализации)

## Hand-off

После заполнения 9 файлов + `_product-tail-patterns.md` — `seo-content` передаёт `poseo` для финального ревью, далее в `sa-seo` для финализации ADR-uМ-19/20/21/22 в `04-url-map/decisions.md`.
