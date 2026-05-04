# Gap-матрица: сервисные страницы Обиход vs конкуренты

_Составлено: 2026-05-04 · poseo · Источники: Keys.so 2026-05-03, url-structure-top3.md,
keysso-master-union, keysso-whitespace._

---

## Что означают колонки

| Колонка | Пояснение |
|---|---|
| Страница у нас | ✅ есть и ранжируется / 🟡 есть частично / ❌ нет |
| wsk | Суммарная частота кластера (чем выше — тем больше трафика) |
| Whitespace | Число ключей у конкурентов, которых нет у нас |
| Конкурент | Кто ранжируется и сколько ключей на его URL |
| Приоритет | P0 создать срочно / P1 создать в ближайший месяц / P2 позже |

---

## АРБОРИСТИКА

| Тип услуги | Страница у нас | wsk | Whitespace | Конкурент (ключей) | Приоритет | Действие |
|---|---|---:|---:|---|---|---|
| **Обрезка деревьев** (общая + 6 sub) | 🟡 только `/sanitarnaya-obrezka/` | **44 387** | 34 | arboristik `/obrezka-derevev/` (11 kw), liwood `/services/` | **P0** | Создать pillar `/arboristika/obrezka-derevev/` + sub: омолаживающая / формовочная / плодовых / хвойных |
| **Удаление деревьев** | 🟡 `/spil-dereviev/` (частично) | **11 257** | **225** | arboristik `/tsenyi/` (351 kw covers), liwood info | **P0** | Расширить `/spil-dereviev/` или создать `/udalenie-derevev/`: вырубка / валка / аварийный / на кладбище |
| **Удаление пней** | ✅ `/udalenie-pnya/` | 1 113 | 17 | arboristik `/korchevanie-pney/` (59 kw) | P2 | Добавить sub: корчевание / дробление / фрезерование |
| **Кронирование** | ✅ `/kronirovanie/` | 150 | 4 | arboristik `/kronirovanie-derevev/` (14 kw) | P2 | ОК, расширить контент |
| **Опрыскивание / короед** | ❌ нет страницы | 234 | 0 | arboristik, liwood | P1 | `/arboristika/opryskivanie/` или `/arboristika/zashchita-ot-koroeda/` |
| **Лечение деревьев** | ❌ нет | 9 | 0 | liwood info | P2 | `/arboristika/lechenie-derevev/` |
| **Укрепление (брейсинг)** | ❌ нет | 22 | 0 | arboristik `/kabling-derevev/` (16 kw) | P2 | `/arboristika/ukreplenie/` |
| **Измельчение веток / щепа** | ❌ нет | 35 | 0 | arboristik `/izmelchenie-vetok/` (42 kw) | P1 | `/arboristika/izmelchenie-vetok/` |
| **Порубочный билет** | ❌ нет | 390 | 7 | liwood `/services/poluchenie-porubochnogo-bileta/` (18 kw) | P1 | `/arboristika/porubochny-bilet/` |
| **Обследование / диагностика** | ❌ нет | 15 | 0 | arborist.su — PDF-документы | P2 | Можно как FAQ-блок на pillar |

---

## УБОРКА ТЕРРИТОРИИ (нет pillar-страницы!)

| Тип услуги | Страница у нас | wsk | Whitespace | Конкурент (ключей) | Приоритет | Действие |
|---|---|---:|---:|---|---|---|
| **Покос травы / стрижка газона** | 🟡 `/uborka-uchastka/` (косвенно) | 1 214 | 1 | arboristik `/pokos-travy/` (32 kw), liwood `/services/strizhka-gazona/` (15 kw) | **P0** | Отдельная страница `/uborka-territorii/pokos-travy/` |
| **Выравнивание участка** | ❌ нет | 544 | 0 | arboristik `/vyravnivanie-uchastka/` (73 kw) — их 2-й по трафику URL! | **P0** | `/uborka-territorii/vyravnivanie-uchastka/` |
| **Расчистка / уборка участка** | 🟡 `/uborka-uchastka/` (общее) | 588 | 16 | arboristik `/uborka-dachnyh-uchastkov/` (53 kw), `/raschistka-uchastka/` (99 kw) | **P0** | Отдельная `/uborka-territorii/raschistka-uchastka/` |
| **Вырубка кустарников** | ❌ нет | 40 | 3 | arboristik включён в расчистку | P2 | Добавить как sub к расчистке |
| **Вывоз снега с территории** | 🟡 в chistka-krysh | 87 | 0 | liwood `/uborka-snega-vruchnuyu/` (18 kw) | P2 | Отдельный раздел на `/uborka-territorii/` |

> ⚠ **ADR нужен:** создавать ли `/uborka-territorii/` как новый pillar или вложить под `/arboristika/`?
> → передать `tamd` на решение.

---

## ПРОМАЛЬП / ЧИСТКА КРЫШ

| Тип услуги | Страница у нас | wsk | Whitespace | Конкурент (ключей) | Приоритет | Действие |
|---|---|---:|---:|---|---|---|
| **Чистка крыш от снега** | ✅ `/chistka-krysh/` + 4 sub | 2 571 | 0 | liwood `/ochistka-krysh-ot-snega/` (24 kw) | P2 | ОК. Расширить контент. |
| **Мойка фасадов / окон** | ❌ нет | 1 871 | 10 | промальп-компании | P1 | `/promyshlennyj-alpinizm/mojka-fasadov/` |
| **Чистка водостоков** | ❌ нет | 31 | 2 | — | P2 | Добавить как sub к промальп |

---

## ВЫВОЗ МУСОРА

| Тип услуги | Страница у нас | wsk | Whitespace | Конкурент | Приоритет | Действие |
|---|---|---:|---:|---|---|---|
| **Вывоз мусора (общий)** | ✅ `/vyvoz-musora/` pillar | 53 359 | 34 | musor.moscow | **ЕСТЬ** | Расширять контент и whitespace ключи |
| **Строительный мусор** | ✅ `/vyvoz-stroymusora/` | 8 745 | 14 | — | P1 | Расширить: whitespace 14 ключей |
| **Контейнер** | ✅ `/kontejner/` | 3 698 | 5 | — | P1 | Расширить: добавить 5/8/20/27 м³ sub |
| **КГМ** | ✅ через `/staraya-mebel/` и др. | 2 086 | 1 | — | P1 | Собрать в единый `/kgm/` hub |
| **Садовый мусор** | ✅ `/vyvoz-sadovogo-musora/` | 412 | 0 | — | P2 | ОК |

---

## ДЕМОНТАЖ

| Тип услуги | Страница у нас | wsk | Whitespace | Конкурент | Приоритет | Действие |
|---|---|---:|---:|---|---|---|
| **Снос дома** | 🟡 `/demontazh/` (упомянуто, нет sub) | 1 553 | 13 | demontazhmsk.ru | P1 | `/demontazh/snos-doma/` — отдельная sub |
| **Снос дачи** | ✅ `/demontazh-dachi/` | 52 | 2 | — | P2 | ОК |
| **Снос бани** | ✅ `/demontazh-bani/` | 49 | 1 | — | P2 | ОК |
| **Снос сарая** | ✅ `/demontazh-saraya/` | — | — | — | P2 | ОК |
| **Демонтаж забора** | ❌ нет | 60 | 0 | — | P2 | Добавить как sub |
| **Демонтаж фундамента** | ❌ нет | 55 | 4 | — | P2 | Добавить как sub |

---

## Итоговый P0-список (делаем в первую очередь)

| # | Страница | wsk | Whitespace | Почему P0 |
|---|---|---:|---:|---|
| 1 | `/arboristika/obrezka-derevev/` + 4 sub | **44 387** | 34 | Огромный wsk, конкуренты ранжируются, у нас только санитарная обрезка |
| 2 | `/uborka-territorii/vyravnivanie-uchastka/` | 544 | 0 | arboristik — 73 ключа на этот URL (их 2-й по трафику!) |
| 3 | `/uborka-territorii/raschistka-uchastka/` | 588 | 16 | arboristik — 99 ключей, 16 whitespace у нас |
| 4 | `/uborka-territorii/pokos-travy/` | 1 214 | 1 | arboristik + liwood оба ранжируются, у нас нет |
| 5 | `/arboristika/udalenie-derevev/` (расширение) | **11 257** | **225** | 225 whitespace — самый большой gap по числу |

> **ADR от `tamd`** нужен для `/uborka-territorii/` прежде чем создавать страницы:
> новый pillar или sub arboristika?

---

## P1-список (следующий месяц)

| # | Страница | wsk | Примечание |
|---|---|---:|---|
| 1 | `/arboristika/porubochny-bilet/` | 390 | liwood ранжируется, 7 whitespace |
| 2 | `/arboristika/opryskivanie/` | 234 | Нет у нас, liwood имеет |
| 3 | `/arboristika/izmelchenie-vetok/` | 35 | arboristik 42 kw на своей странице |
| 4 | `/promyshlennyj-alpinizm/mojka-fasadov/` | 1 871 | 10 whitespace |
| 5 | `/demontazh/snos-doma/` | 1 553 | 13 whitespace |

---

## Следующие шаги

1. **`tamd`** → ADR `/uborka-territorii/`: новый pillar (4-й pillar) или sub arboristika?
2. **`sa-seo`** → спеки для P0 страниц (5 спек):
   - `specs/EPIC-SEO-OUTRANK/US-4.2-arboristika/sa-seo.md` — дополнить разделом obrezka
   - Новые US для uborka-territorii × 3 страницы
   - Расширение US-4.2 для udalenie-derevev whitespace
3. **`podev`** → роутинг для `/uborka-territorii/` если новый pillar (cross-team)
4. **`cw`** + **`cms`** → контент-волны после approve спек
