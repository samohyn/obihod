---
title: Commercial filter decisions log (Phase C)
created: 2026-05-03
script: seosite/scripts/keysso_intersect.py
artefact: keysso-master-union-2026-05-03.csv (column intent_marker)
---

# Commercial filter — decisions log

## Метод: гибрид regex + Just-Magic intent reuse

```
intent_marker = pipeline:
  1. Если RE_INFORMATIONAL match И NOT RE_COMMERCIAL match → "информационный"
  2. Если RE_COMMERCIAL match И RE_LOCATION match → "коммерческий+локальный"
  3. Если RE_COMMERCIAL match → "коммерческий"
  4. Если RE_LOCATION match → "локальный"
  5. Иначе → "общий"
```

## Маркеры (regex source)

### Положительные коммерческие (RU SEO стандарт + Обиход vertical)

- **Транзакционные:** купить, заказ\w*, цен[аыу], стоимость, прайс, услуг[аи]
- **Срочность:** срочно, недорого, дёшево, онлайн, с доставкой
- **CTA:** вызвать, нанять, подряд, расценки, тариф, смет[аы], оформить, оплат\w+
- **Vertical-specific глаголы:** вывез*, спил*, удал*, снос*, разобр*, почист*, демонтир*, корчев*, обрез*, посад*
- **Корпоративные:** компани[яи], фирм[аы], организаци[яи]

### Отрицательные информационные (exclude)

- **Question-words:** как, сколько, когда, зачем, почему, чем, какие, какой, какая
- **Reading mode:** отзыв\w*, инструкци\w+, своими руками, самостоятельно
- **Encyclopedia:** википеди\w+, определени\w+, значени\w+, что такое, что значит

### Локальные (Москва+МО)

- **Региональные:** москв[аеу], мо, московск\w+, подмоск\w+
- **Города/районы МО:** Раменское, Жуковский, Балашиха, Мытищи, Подольск, Одинцово, Красногорск, Химки, Зеленоград, Долгопрудный, Реутов, Люберцы, Сергиев Посад, Клин, Солнечногорск, Ногинск, Щёлково, Пушкино, Истра, Видное, Домодедово, Дмитров, Серпухов

## Distribution на 21 051 ключе (master union 2026-05-03)

| intent_marker | Count | Доля |
|---|--:|--:|
| общий | 11 185 | 53.1% |
| коммерческий | 5 356 | 25.4% |
| информационный | 3 362 | 16.0% |
| коммерческий+локальный | 652 | 3.1% |
| локальный | 496 | 2.4% |
| **Σ** | **21 051** | 100% |

**Использовать в strategy:** `коммерческий` ∪ `коммерческий+локальный` = **6 008 ключей** (28.5%).

## Edge cases (manual review confirmed)

| Ключ | wsk | classified as | Решение |
|---|--:|---|---|
| «обрезка яблони весной» | 5 457 | коммерческий (regex `обрез\w+`) | ⚠ false-positive — это **информационный** (DIY guide). НЧ-cluster blog. Ручной override через `_clustering-decisions.md`. |
| «как обрезать яблоню» | 2 122 | информационный (regex `как`) | ✅ correct |
| «вывоз мусора» | 7 907 | коммерческий | ✅ correct |
| «арбористика» | 366 | общий ⚠ | False-negative — это конверсионный head-keyword. Manual fix: добавить в коммерческие через override list (Stage 4 регекс tightening). |
| «короед» | 5 348 | общий ⚠ | False-negative — high-intent (короед обработка). Cluster `arboristika`, intent override → коммерческий. |

## Sanity check (top-50 коммерческих + top-50 информационных)

Манual review запущен после первого pass. Precision коммерческих по top-30 ВЧ = ~85% (5 false-positives из 30). Precision информационных по top-30 = ~95%.

**Conclusion:** acceptable для Phase E кластеризации. Override list для top-15 false-positives зафиксирован inline в `_clustering-decisions.md`. Stage 4 backlog — fine-tune regex.

## Stage 4 backlog (regex tightening)

1. Добавить **negative lookahead** для DIY-glagolов: `\bобрез\w+\b(?!\s*(яблон|груш|слив|ветв))` — режем DIY от commercial.
2. Override list (forced commercial): `короед`, `арборист\w*`, `арбористик\w+`, `демонтаж`, `кгм`, `тбо`, `снос`, `спилить дерево`.
3. Add positive markers: «удалить пень», «спилить ветку», «прочистить водосток».

## Связанные артефакты

- [`seosite/scripts/keysso_intersect.py`](../../scripts/keysso_intersect.py) — функции `intent_classify(keyword)`, `RE_COMMERCIAL`, `RE_LOCATION`, `RE_INFORMATIONAL`.
- [`seosite/02-keywords/normalized.csv`](../normalized.csv) — Just-Magic intent classification (1 601 ключ) — fallback для override.
