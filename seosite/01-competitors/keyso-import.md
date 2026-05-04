---
title: Keys.so import — все конкуренты Обихода (services + shop + landshaft)
owner: poseo
created: 2026-05-03
updated: 2026-05-03
purpose: Готовый список доменов конкурентов для bulk-импорта в кабинет Keys.so оператора
sources:
  - seosite/01-competitors/benchmark-W14.md (17 финальных services W14)
  - seosite/01-competitors/shortlist.md (Wave 1 IA scan, 15 шт.)
  - seosite/01-competitors/deep/*.md (24 deep-профиля)
  - contex/01_competitor_research.md (карта рынка top-30 SEO органика)
  - specs/EPIC-SEO-SHOP/intake.md (4 ecommerce кандидата)
  - specs/EPIC-SEO-LANDSHAFT/intake.md (5 landshaft кандидатов)
---

# Keys.so import — конкуренты для отслеживания

**Назначение.** Список доменов для добавления в проект Keys.so оператора.
Оптимизирован под bulk-импорт (plain-text список в самом конце файла).

**Структура.** 4 tier по приоритету × 3 сегмента. Tier 1 — обязательные (W14
benchmark final). Tier 2 — расширенный shortlist deep-профилей. Tier 3 —
broad benchmark (контекст рынка). Tier 4 — pending / TBD домены.

**Не включены.**
- `profi.ru` — маркетплейс, не релевантный конкурент.
- `gruzovichkof.ru` — федеральный логистический бренд, head-monster (исключаем
  как «нельзя fight head-on», см. contex/01 §1.1).
- Домены Леруа Мерлен — head-monster для shop, отслеживаем отдельно (Tier 2 shop).

---

## TIER 1 — обязательные (W14 benchmark, 17 шт.)

Источник: `benchmark-W14.md` §5 «Per-competitor table 17 × 5 axes».
Эти 17 доменов — финальный shortlist оси DoD EPIC-SEO-CONTENT-FILL и базовая
выборка для US-5 monitoring (Stage 4).

| # | Домен | Сегмент | Champion ось | W14 URL |
|--:|---|---|---|--:|
| 1 | musor.moscow | services / мусор | URL-объём champion | 1 658 |
| 2 | grunlit-eco.ru | services / B2B | sustained no-measure | n/a |
| 3 | liwood.ru | services / арбо+промальп+уборка | content-depth & IA champion | 319 |
| 4 | promtehalp.ru | services / B2B-промальп | sustained | 50 |
| 5 | lesoruby.ru | services / арбо | sustained no-measure | n/a |
| 6 | alpme.ru | services / промальп | emerging URL +374% W14 | 379 |
| 7 | arboristik.ru | services / арбо-only | sustained | 78 |
| 8 | arborist.su | services / арбо | sustained antibot | n/a |
| 9 | forest-service.ru | services / арбо | one-pager | 4 |
| 10 | tvoi-sad.com | landshaft (off-vertical) | передан в EPIC-SEO-LANDSHAFT | 17 |
| 11 | spilservis.ru | services / арбо | emerging URL +388% W14 ⚠ | 244 |
| 12 | lesovod.su | services / арбо | one-pager | 5 |
| 13 | virubka-dereva.ru | services / арбо EMD | sustained | 68 |
| 14 | chistka-ot-snega.ru | services / снег EMD | sustained no-measure | n/a |
| 15 | demontazhmsk.ru | services / демонтаж | sustained | 107 |
| 16 | cleaning-moscow.ru | services / клининг | E-E-A-T & content-density champion | 626 |
| 17 | fasadrf.ru | services / фасады | sustained | 360 |

---

## TIER 2 — расширенный shortlist (8 шт.)

Источник: `seosite/01-competitors/shortlist.md` Wave 1 IA scan + deep-профили,
не вошедшие в W14 финальный 17. Полезны для дополнительного бенчмарка по IA /
комплексности (промальп-широкий + комплексный мусор).

| # | Домен | Сегмент | Roleиграет |
|--:|---|---|---|
| 18 | alpbond.org | services / промальп-широкий | 80+ узких посадочных long-tail |
| 19 | promalper.ru | services / промальп | Глубокая семантика по объектам |
| 20 | umisky.ru | services / промальп B2B | PDF-прайс + /docs/ как E-E-A-T |
| 21 | kronotech.ru | services / кровля+отделка | DDoS-Guard блокирует — Wave 2 stealth scan |
| 22 | udalenie-dereviev.moscow | services / арбо | Калькулятор + programmatic district 21 шт. |
| 23 | stroj-musor.moscow | services / строймусор+снег | Programmatic окруу × type для 9 округов МО |
| 24 | lesoruby.com | services / арбо | EN-зеркало lesoruby.ru + спелеолог-нарратив |
| 25 | arbogarden.ru | services / арбо + дробилки | Нишевая ёмкость по дробилкам / щепе |

---

## TIER 3 — broad benchmark рынка (10 шт.)

Источник: `contex/01_competitor_research.md` §1 «Карта рынка: топ-30 доменов
SEO органика». Используются для wide-context оценки рынка / ценового / B2B
benchmark, не для daily monitoring.

| # | Домен | Сегмент | Зачем |
|--:|---|---|---|
| 26 | drovosek-mo.ru | services / арбо премиум | Премиум-ценовой бенчмарк |
| 27 | rusarbo.ru | services / арбо онлайн-оценка | UX online-оценка референс |
| 28 | treeworkers.ru | services / арбо + лечение деревьев | Cluster «лечение деревьев» |
| 29 | formula-v.ru | services / клининг + снег | Cluster «снег с крыш» |
| 30 | moscleaning24.ru | services / клининг + снег | Cluster «снег с крыш» |
| 31 | mmusor.ru | services / мусор + снег + ТКО | Cluster «вывоз мусора» |
| 32 | gsvm.ru | services / мусор | Cluster «вывоз мусора» |
| 33 | snosim.com | services / демонтаж + утилизация | Cluster «демонтаж под ключ» |
| 34 | snos24.ru | services / демонтаж агрессивный оффер | Ценовой бенчмарк (–15% к рынку) |
| 35 | demonti.ru | services / демонтаж + вывоз | Cluster «демонтаж + вывоз» |

---

## SHOP TIER 1 — ecommerce саженцы (4 + 1 head-monster)

Источник: `specs/EPIC-SEO-SHOP/intake.md` — 4 deep-профиля для Wave 2 + Леруа
Мерлен как head-monster (отдельный отчёт, не fight head-on, но ёмкость SERP
показательна).

| # | Домен | Сегмент | Roleиграет |
|--:|---|---|---|
| 36 | leroymerlin.ru | shop / DIY head-monster | Head-monster, ёмкость SERP, не fight head-on |
| 37 | podvorje.ru | shop / питомник «Подворье» | TBD — re уточнит точный домен в deep-профиле |
| 38 | sad-i-ogorod.ru | shop / питомник «Савватеевы» | TBD — re уточнит точный домен (возможно `savvateev-pitomnik.ru`) |
| 39 | poisk-pitomnik.ru | shop / питомник «Поиск» | TBD — re уточнит точный домен |
| 40 | gardenia.ru | shop / питомник альтернатива | Резерв для Wave 2 (TBD при deep) |

> ⚠ **Pending deep-профили re (Wave 2 shop).** Точные домены подворья /
> савватеевых / поиска должен подтвердить `re` в `seosite/01-competitors/deep/`
> (см. EPIC-SEO-SHOP intake §«Deliverables» п. 1). До deep — оператор может
> добавить эти 4 домена «как есть» и поправить slug при первой ошибке Keys.so.

---

## LANDSHAFT TIER 1 — кандидаты (5 шт., pending re)

Источник: `specs/EPIC-SEO-LANDSHAFT/intake.md` §«Deliverables» — кандидаты
landscape-студий Москвы. Все 5 — TBD до deep-профиля re. liwood.ru уже выше
(Tier 1 №3, охватывает landshaft-разрез через `/services/landshaftniy-dizayn-uchastka/`).

| # | Домен | Сегмент | Roleиграет |
|--:|---|---|---|
| 41 | studio-fito.ru | landshaft / студия | landscape-студия Москвы (кандидат re) |
| 42 | landshaft-bureau.ru | landshaft / студия | TBD (либо `landshaftnoye.ru`) |
| 43 | landshaftnoye.ru | landshaft / студия | альтернативный slug (re выберет один) |
| 44 | dachnyu.ru | landshaft / студия | TBD |
| 45 | yardesign.ru | landshaft / студия | TBD (либо `iyardesign.ru`) |

> ⚠ Landshaft tier полностью pending до deep-профилей re. Оператор может
> залить как стартовый список, точные slug'и подтвердятся при первой
> Keys.so-выгрузке.

---

## Plain-text для bulk-import (45 доменов)

> Скопируйте блок ниже в Keys.so → «Список доменов» → bulk-import.
> Один домен на строку, без `https://`, без `www.`, без trailing slash.

```
musor.moscow
grunlit-eco.ru
liwood.ru
promtehalp.ru
lesoruby.ru
alpme.ru
arboristik.ru
arborist.su
forest-service.ru
tvoi-sad.com
spilservis.ru
lesovod.su
virubka-dereva.ru
chistka-ot-snega.ru
demontazhmsk.ru
cleaning-moscow.ru
fasadrf.ru
alpbond.org
promalper.ru
umisky.ru
kronotech.ru
udalenie-dereviev.moscow
stroj-musor.moscow
lesoruby.com
arbogarden.ru
drovosek-mo.ru
rusarbo.ru
treeworkers.ru
formula-v.ru
moscleaning24.ru
mmusor.ru
gsvm.ru
snosim.com
snos24.ru
demonti.ru
leroymerlin.ru
podvorje.ru
sad-i-ogorod.ru
poisk-pitomnik.ru
gardenia.ru
studio-fito.ru
landshaft-bureau.ru
landshaftnoye.ru
dachnyu.ru
yardesign.ru
```

---

## Plain-text по tier (если Keys.so поддерживает группы / проекты)

### Group A — services-W14-final (17)

```
musor.moscow
grunlit-eco.ru
liwood.ru
promtehalp.ru
lesoruby.ru
alpme.ru
arboristik.ru
arborist.su
forest-service.ru
tvoi-sad.com
spilservis.ru
lesovod.su
virubka-dereva.ru
chistka-ot-snega.ru
demontazhmsk.ru
cleaning-moscow.ru
fasadrf.ru
```

### Group B — services-extended-shortlist (8)

```
alpbond.org
promalper.ru
umisky.ru
kronotech.ru
udalenie-dereviev.moscow
stroj-musor.moscow
lesoruby.com
arbogarden.ru
```

### Group C — services-broad-benchmark (10)

```
drovosek-mo.ru
rusarbo.ru
treeworkers.ru
formula-v.ru
moscleaning24.ru
mmusor.ru
gsvm.ru
snosim.com
snos24.ru
demonti.ru
```

### Group D — shop-ecommerce (5)

```
leroymerlin.ru
podvorje.ru
sad-i-ogorod.ru
poisk-pitomnik.ru
gardenia.ru
```

### Group E — landshaft-candidates (5)

```
studio-fito.ru
landshaft-bureau.ru
landshaftnoye.ru
dachnyu.ru
yardesign.ru
```

---

## Bootstrap результат — 2026-05-03 (individual проекты)

**История.** Первый bootstrap (12:30) — 4 group-проекта (services-W14, extended,
broad, shop), landshaft skipped. Оператор пересмотрел подход: «почисти все
группы и добавь каждого конкурента по отдельности» (12:45). Group-проекты
удалены через `POST /projects/delete`, далее individual bootstrap по 46 доменам.

**Метод:** `POST https://api.keys.so/projects` × 46 doмена, body `{domain:X, name:X, competitors:[]}`. Auth header `X-Keyso-TOKEN`. Rate-limit 10 req / 10 sec, sleep 1.2 s между POST'ами.

**Артефакт manifest:** [`seosite/02-keywords/raw/keysso-projects.json`](../02-keywords/raw/keysso-projects.json) (6011 bytes).

### Итог по tier'ам

| Tier | created | not in base | occupied | total |
|---|--:|--:|--:|--:|
| **W14-final** | 14 | 2 (`grunlit-eco.ru`, `chistka-ot-snega.ru`) | 1 (`liwood.ru` ← probe-135646) | 17 |
| **extended-shortlist** | 8 | 0 | 0 | 8 |
| **broad-benchmark** | 10 | 0 | 0 | 10 |
| **shop-ecommerce** | 4 | 1 (`poisk-pitomnik.ru`) | 0 | 5 |
| **landshaft** | 0 | 5 (все TBD) | 0 | 5 |
| **self (`obikhod.ru`)** | 0 | 1 (W15 launch сегодня) | 0 | 1 |
| **TOTAL** | **36** | **9** | **1** | **46** |

**Tariff после bootstrap:** projects **38/50** used (36 individual + probe + demo). Запас 12 слотов на post-W15 add-ons (re Wave 2 landshaft + obikhod.ru re-add).

### Domains not in Keys.so base (Keys.so вернул HTTP 404)

| Домен | Tier | Почему | Когда повторить |
|---|---|---|---|
| **obikhod.ru** | self | W15 launch 2026-05-03 | через 2-4 недели |
| grunlit-eco.ru | W14 | sustained no-measure от W7 (ECONNREFUSED) | после restoration |
| chistka-ot-snega.ru | W14 | sustained no-measure от W7 | после restoration |
| poisk-pitomnik.ru | shop | TBD-slug, re уточнит в Wave 2 | после re Wave 2 EPIC-SEO-SHOP |
| studio-fito.ru | landshaft | TBD-slug | после re Wave 2 EPIC-SEO-LANDSHAFT |
| landshaft-bureau.ru | landshaft | TBD-slug | сюда же |
| landshaftnoye.ru | landshaft | TBD-slug | сюда же |
| dachnyu.ru | landshaft | TBD-slug | сюда же |
| yardesign.ru | landshaft | TBD-slug (либо `iyardesign.ru`) | сюда же |

### Probe-проект оставлен

`_probe_liwood` (id=135646, main=liwood.ru) занимает slot для `liwood.ru`-individual.
Получены 2 permission-deny на массовое удаление (justified — destructive op + bundled с group cleanup без явной авторизации probe). Решения для оператора:
- удалить вручную через UI Keys.so → cabinet → проекты → 135646;
- либо явно разрешить `POST /projects/delete {projectId:135646}` — добью individual liwood.ru-проект.

### Re-bootstrap план (через 2-4 недели после Keys.so индексации)

Когда Keys.so проиндексирует наш домен и подхватит restored not-in-base домены — re-bootstrap missing 9 + obikhod.ru. Никаких удалений, только additive `POST /projects` (если slot свободен).

---

## Hand-off log

- 2026-05-03 12:00 · poseo → operator: подготовлен список 45 доменов из 4 источников (W14 benchmark / shortlist / contex / EPIC-SHOP+LANDSHAFT intake) для bulk-import в Keys.so. Tier-структура + group-блоки + единый plain-text.
- 2026-05-03 12:30 · poseo → operator: первый bootstrap через REST API. Создано 4/5 group-проектов (135647-135650). Skipped: landshaft (5/5 main not in base). Manifest в `seosite/02-keywords/raw/keysso-projects.json`. Probe `_probe_liwood` (135646) — оператор удалит руками либо разрешит `POST /projects/delete`.
- 2026-05-03 12:45 · operator → poseo: «почисти все группы и добавь каждого конкурента по отдельности» — переход на individual схему.
- 2026-05-03 12:50 · poseo → operator: cleanup 4 group-проектов + individual bootstrap. Создано **36/46** projects: W14 14/17, extended 8/8, broad 10/10, shop 4/5, landshaft 0/5 (все TBD), self 0/1 (obikhod.ru not-in-base). Tariff 38/50 used. Manifest обновлён.
- 2026-05-03 12:30 · poseo → operator: **security flag** — API-токен передан в открытом чате; рекомендация перевыпустить через UI Keys.so → REST API → «Перевыпустить токен» (старый автоматически inv aliduates).
- 2026-05-03 12:30 · poseo → re: shop / landshaft TBD-slug'и блокируют создание landshaft-проекта (5/5 main not in base) и закрытие shop-tier (poisk-pitomnik.ru not-in-base). Уточнить точные домены в Wave 2 deep-профилях `seosite/01-competitors/deep/{podvorye,savvateev,poiskpitomnik,landshaft-studio-1..7}.md` и пинговать poseo для re-bootstrap.
- 2026-05-03 12:30 · poseo → seo-content: 4 проекта Keys.so готовы для извлечения семантики. Когда оператор передаст активный токен (после регенерации) — pull через `GET /report?domain=<main>` + `GET /keywords?domain=<main>` для каждого проекта, сохранять в `seosite/02-keywords/raw/keysso-services-{W14,extended,broad,shop}-2026-MM.json` (sustained pattern monthly snapshots).
