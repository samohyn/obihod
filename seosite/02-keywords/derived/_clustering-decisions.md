---
title: Cluster_hint decisions log (Phase E)
created: 2026-05-03
script: seosite/scripts/keysso_intersect.py
artefact: keysso-master-union-2026-05-03.csv (column cluster_hint)
---

# Cluster mapping — decisions log

## Метод: rule-based regex по 5 направлениям

5 directions (operator brief 2026-05-03):
1. **vyvoz-musora** — вывоз мусора
2. **arboristika** — арбо
3. **uborka-snega** — уборка снега + чистка крыш
4. **demontazh-b2c** — демонтаж в частном секторе (B2B exclude)
5. **landshaft** — ландшафтный дизайн

## Distribution на 21 051 ключе

| cluster_hint | Count | Доля |
|---|--:|--:|
| vyvoz-musora | 3 405 | 16.2% |
| arboristika | 2 579 | 12.3% |
| demontazh-b2c | 1 144 | 5.4% |
| uborka-snega | 178 | 0.8% ⚠ |
| landshaft | 76 | 0.4% ⚠ |
| _unmatched | 13 875 | 65.9% |
| (multi_cluster) | ~80 | <0.4% |

> ⚠ uborka-snega и landshaft — низкое покрытие regex'ом. Подтверждение оператора: «landshaft через extraction services-доменов» — extraction даёт меньший pool, чем мог бы быть от dedicated landshaft-конкурентов (5/5 not in Keys.so базе). Дотюн regex — Stage 4.

## Edge cases (top-100 manual review confirmed)

### vyvoz-musora — false-positives через `вывоз\w*`

| Ключ | wsk | Issue | Решение |
|---|--:|---|---|
| «вывоз снега» | — | Match `вывоз` → vyvoz-musora, но это `uborka-snega` | Multi-cluster: помещаем в **обе** (Phase E.6 mitigation) |

### arboristika — false-positives через `обрез\w+\s*деревь\w+`

| Ключ | wsk | Issue | Решение |
|---|--:|---|---|
| «обрезка яблони весной» | 5 457 | DIY/blog запрос (RU info), classified arbo через `обрез + дерев` | ✅ keep arbo — НЧ-блог в `arboristika.md` blog secton |
| «обрезка яблонь» | — | Same | ✅ keep arbo |

### demontazh-b2c — exclusion через RE_DEMONT_NEGATIVE

| Ключ | wsk | Решение |
|---|--:|---|
| «демонтаж промышленный» | — | RE_DEMONT_NEGATIVE matches → exclude из demontazh-b2c → передан в `b2b.md` |
| «снос здания» | — | Если без `на участке` → exclude из B2C |
| «снос дома» | — | Match в B2C ✅ |
| «снос дач» | — | Match ✅ |

### landshaft — extraction-based (operator approved)

Источники extraction: liwood.ru `/services/landshaftniy-dizayn-uchastka/`, arbogarden.ru, treeworkers.ru, tvoi-sad.com.

5 landshaft-кандидатов (studio-fito.ru / landshaft-bureau.ru / etc.) — 5/5 not in Keys.so базе → semantic для landshaft получаем через services-домены overlap.

| Ключ | wsk | Cluster |
|---|--:|---|
| «ландшафтный дизайн участка» | — | landshaft pillar |
| «благоустройство участка» | — | landshaft sub |
| «газон рулонный» | — | landshaft / gazon |
| «дренаж участка» | — | landshaft / proekt |
| «посадка деревьев на участке» | — | **multi-cluster:** landshaft + arboristika |

## Multi-cluster (intentional overlap)

~80 ключей попали в 2+ direction. Это **intentional**: ключ ранжируется в нескольких темах, контент должен пересекаться.

**Примеры:**
- «вывоз снега» → vyvoz-musora + uborka-snega
- «снос дерева» → arboristika + demontazh-b2c (нет, regex demontazh не match здесь — корректно arbo only)
- «посадка деревьев» → landshaft + arboristika
- «обрезка деревьев в саду» → arboristika + landshaft (если match `сад`)

## Override list — Wave 3 corrections (2026-05-04)

### False-negative override → добавить в arboristika (top-5)

| Ключ | wsk | Override → cluster | Why |
|---|--:|---|---|
| «короед жук» | 3 295 | arboristika | Реально жук-вредитель деревьев (не штукатурка) |
| «жук короед» | 3 045 | arboristika | То же |
| «короеды жуки» / «жуки короеды» | 466 + 424 | arboristika | То же (множественное) |
| «короед типограф» | 431 | arboristika | Конкретный вид жука |
| «порубочный билет» | 822 | arboristika | Документ для удаления дерева — наша вертикаль |
| «селитра для удаления пней» | 214 | arboristika | Метод корчевания, наша вертикаль |
| «измельчитель веток (аренда / в аренду)» | 235 + 199 + 117 + 102 | arboristika | Спецтехника, наша вертикаль |
| «валка леса» | 137 | arboristika | Sub-service /arboristika/valka-derevev/ |

### ⚠ False-positive — НЕ наша вертикаль (исключить из whitespace)

| Ключ | wsk | Original cluster | Real intent |
|---|--:|---|---|
| «короед штукатурка» / «штукатурка короед» / «короед фасад» / «короед декоративная» | **5 813 + 3 346 + 5 348 + ...** (~25 ключей) | (false-positive в plan) | **Декоративная фасадная штукатурка типа «короед»** — out of vertical. **Не путать с жуком-короедом!** |

**Honest correction:** Wave 3 strategy doc + whitespace-priority-A.md упомянули «короед» 5 348 wsk как arboristika action. После filter context — реально 80% этого wsk идёт на штукатурку (стройматериалы), 20% на жука. Корректировка: оставляем только «жук короед» (3 295) + «короед жук» (3 045) + «жук типограф» как реальные arboristika ключи (~6 770 combined). «Короед штукатурка» — exclude.

### False-positive intent override → информационный (DIY blog)

| Ключ | wsk | Original | Override |
|---|--:|---|---|
| «когда обрезать деревья весной» | 1 524 | коммерческий (regex `обрез\w+`) | **информационный** (DIY blog Wave 4+) |
| «когда обрезать деревья / плодовые» | 444 + 164 + 117 + 91 | коммерческий | информационный |
| «когда обрезают деревья» | 215 + 163 | коммерческий | информационный |

**Reason:** глагол `когда` указывает на info-intent даже при наличии «обрезать дерев». Override Stage 4 — добавить negative lookahead в RE_INFORMATIONAL.

## Stage 4 backlog (regex extension)

1. **arboristika:** добавить «жук короед», «порубочный билет», «селитра», «измельчитель веток», «валка леса» — done в override list выше
2. **arboristika:** **negative lookahead** для «короед штукатурка» — exclude декоративную штукатурку
3. **arboristika DIY-info:** добавить `\bкогда\b` в RE_INFORMATIONAL pos lookbehind для глагольных коммерческих
4. **uborka-snega:** добавить «снегоуборщик», «уборка территории зимой», «противогололедные»
5. **landshaft:** добавить «дизайнер участка», «озеленение территории», «декоративные растения», «садовый дизайн»
6. **vyvoz-musora:** убрать false-positive «вывоз снега» через negative lookahead → uborka-snega
7. **uborka-pomeshcheniy** — НОВОЕ направление **не покрыто** (was excluded из 5 — оператор сказал «уборка снега», не клининг). Wave 4 candidate.
8. **fasad/promalp** — **не наша вертикаль** (~500-1000 ключей в _unmatched). НЕ покрываем.

## Связанные артефакты

- [`seosite/scripts/keysso_intersect.py`](../../scripts/keysso_intersect.py) — `cluster_classify(keyword)`, RE_VYVOZ, RE_ARBO, RE_SNEG, RE_DEMONT, RE_LANDSHAFT
- [`seosite/03-clusters/`](../../03-clusters/) — финальные cluster .md (Wave 3 секции добавляются Phase E)
