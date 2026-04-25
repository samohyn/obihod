# Конкуренты — Shortlist Wave 1 (IA Scan)

**Дата:** 2026-04-25
**Скан:** `re` для US-4 (semantic-core, OBI-7)
**Метод:** sitemap.xml + robots.txt + WebFetch главной (без агрессивного парсинга, без keywords/backlinks)

## Сводная таблица 15 конкурентов

| # | Домен | Тип | Pillar count | Sub-services depth | Districts/Cities | B2B-раздел | Блог | Sitemap | Key feature | IA Score |
|--:|---|---|--:|--:|--:|:-:|:-:|:-:|---|:-:|
| 1 | **arboristik.ru** | арбо-only | 0 (плоско) | 1 уровень | ~60 районов МО (вне sitemap) | ❌ | ✅ ~50 | ✅ старый (2017) | подвиды по породам деревьев | 2 |
| 2 | **liwood.ru** ⭐ | арбо+промальп+уборка | 15 | 3 уровня | 40 (district в /udalenie-derevev/) | ❌ | ✅ 85 | ✅ актуальный | калькулятор + programmatic district + 29 видов обрезки | **5** |
| 3 | promtehalp.ru | B2B-промальп | 4 (в меню, не в URL) | 1 уровень (`/service/[slug]/`) | 0 | ⚠ implicit | ✅ 5 | ✅ старый (2021) | /work + /video галерея | 2 |
| 4 | alpbond.org | промальп-широкий | 10 | 1 уровень | 0 | ⚠ implicit | ✅ 80+ | ✅ актуальный | 80+ узких посадочных long-tail | 3 |
| 5 | lesoruby.com | арбо-only | 6 | 1 уровень | косвенно через статьи | ❌ | ✅ 48 | ✅ актуальный | EN-версия + спелеолог-нарратив | 2 |
| 6 | promalper.ru | промальп | 7 (в меню) | 1 уровень `.html` | 0 | ⚠ implicit | ✅ ~10 на корне | ✅ актуальный | глубокая семантика по объектам | 2 |
| 7 | **alpme.ru** | промальп СПб+МСК | 7 | 2 уровня + /msk/ зеркало | 1 (Москва как /msk/) | ⚠ implicit | ❌ нет блога | ✅ актуальный | /msk/ root-сегмент + калькулятор + каталог продуктов | 4 |
| 8 | umisky.ru | промальп B2B | 1 (общий /services/) | 1 уровень | 0 | ⚠ программа лояльности | ✅ 41 | ⚠ неполный | PDF-прайс + /docs/ как E-E-A-T | 2 |
| 9 | kronotech.ru | кровля+отделка | (заблокирован) | (заблокирован) | (заблокирован) | ? | ? | ❌ Antibot | DDoS-Guard / Antibot Cloud — **полная блокировка** | n/a |
| 10 | **fasadrf.ru** | фасады-only | 3 | **3-4 уровня** | 0 | ⚠ implicit | ✅ **148** (max) | ✅ актуальный | глубочайшая иерархия по производителям подсистем | 4 |
| 11 | udalenie-dereviev.moscow | арбо-only | 2 (vidy-rabot + udalit-derevo) | 2 уровня | 21 район МО | ❌ | ✅ 22 | ✅ актуальный | калькулятор + programmatic district | 4 |
| 12 | **musor.moscow** ⭐ | мусор-only | 4 (типы+округа+районы+города) | 2-3 уровня | **109 районов + 19 городов + 9 округов** | ⚠ договор + лого | ✅ 103 + 1051 новость | ✅ актуальный | **эталон гео-покрытия** + калькулятор на главной | **5** |
| 13 | **cleaning-moscow.ru** | клининг-only | 11 | 2 уровня | 0 | ✅ **отдельный** /korporativnym/ + /chastnym/ | блог на корне | ✅ актуальный | B2B/B2C сегментация + авторы как E-E-A-T | 4 |
| 14 | stroj-musor.moscow | строймусор+снег | 3 (типы+округа+города) | 2 уровня (programmatic okrug × type для 3 округов) | 9 округов + 13 городов МО | ⚠ implicit | ✅ 59 + 221 новость | ✅ актуальный | partner/clone musor.moscow (стройматериалы) | 4 |
| 15 | demontazhmsk.ru | демонтаж-only | 1 (`/services/`) | 2 уровня (programmatic material × object) | 0 | ⚠ implicit | ❌ | ✅ актуальный | programmatic «стены/полы/санузлы × материал» | 3 |

## Замены и блокеры

- **demontage-services.ru — DNS не резолвится.** Заменён на `demontazhmsk.ru` (functional equivalent, демонтаж-only, Москва).
- **kronotech.ru — заблокирован DDoS-Guard / Antibot Cloud.** Sitemap отдаёт HTML-loader. Из robots.txt извлечены подсказки: `/krovelnye-raboty/`, `/otdelka-pomeshcheniy/`, `/publications/`, `/nashi-proekty/` (Drupal). Для полного скана — Wave 2 через Playwright + stealth или Keys.so domain-export.

## Top-3 эталона для копирования IA

### 1. **musor.moscow** — эталон по гео-покрытию (для кластера «вывоз мусора»)
- 109 районов Москвы + 19 городов МО + 9 округов
- Двойная гео-сегментация: `/rajony-obsluzhivanija/[район]/` + `/goroda/vyvoz-musora-[город]/` + округ как короткий URL `/cao/`
- Programmatic snow × округ
- Калькулятор на главной
- Это ровно то, что нужно obikhod.ru для cluster `vyvoz-musora` + `chistka-krysh-ot-snega`

### 2. **liwood.ru** — эталон по иерархии услуг (для кластера «арбористика»)
- 3 уровня иерархии `/services/[pillar]/[sub-service]/`
- 40 districts × 1 service (programmatic) — `/services/udalenie-derevev/[район]/`
- 29 sub-services по обрезке (по породам)
- Калькулятор `/info/calculator/`
- 85 статей блога с темами, дублирующими pillar-структуру
- **Это «эталон по SEO» из контекста оператора — подтверждаю**

### 3. **cleaning-moscow.ru** — эталон по B2B/B2C-сегментации
- /korporativnym-klientam/ + /chastnym-klientam/ — два root-сегмента в URL
- 11 pillar-категорий по типам объектов (квартиры/коттеджи/офисы/после-стройки)
- Авторы статей как отдельные посадочные → E-E-A-T-стратегия
- /proverka-informacii/ — fact-check как навигационный элемент

## Дополнительные эталоны для оригинальных приёмов

- **fasadrf.ru** — глубина 4 уровня (программаткой по производителям подсистем)
- **alpme.ru** — root-сегмент `/msk/` для гео-фильтра (если соберём СПб-филиал)
- **demontazhmsk.ru** — programmatic material × object (стены × кирпич/дерево/бетон) — шаблон для cluster демонтажа
- **udalenie-dereviev.moscow** — двойная семантика «работа × район» через 2 параллельных pillar (`/vidy-rabot/` + `/udalit-derevo/`)

## Ключевые pattern'ы по типам конкурентов

- **Арбо-only** (4 шт): liwood.ru ⭐, lesoruby.com, arboristik.ru, udalenie-dereviev.moscow — у всех есть programmatic district хотя бы в одном кластере
- **Промальп-широкий** (5 шт): alpbond.org, alpme.ru, promtehalp.ru, promalper.ru, umisky.ru — flat URL, иерархия 1-2 уровня, нет programmatic гео
- **Мусор-only** (2 шт): musor.moscow ⭐, stroj-musor.moscow — оба с сильным гео; **в этой нише ≥100 гео-посадочных = норма**
- **Демонтаж-only** (1 шт): demontazhmsk.ru — programmatic material × object вместо гео
- **Клининг-only** (1 шт): cleaning-moscow.ru — B2B/B2C сегментация в URL
- **Фасад-only** (1 шт): fasadrf.ru — глубочайшая иерархия (4 уровня)
- **Заблокирован** (1 шт): kronotech.ru
