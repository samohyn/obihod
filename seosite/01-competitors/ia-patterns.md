# IA-паттерны: общие выводы Wave 1 (15 конкурентов)

**Дата:** 2026-04-25
**Скан:** `re` для US-4 (semantic-core, OBI-7)
**Вход для:** `seo1` — построение draft URL-tree obikhod.ru

## TL;DR

Из 15 конкурентов **2 эталона мирового класса** (liwood.ru — арбо, musor.moscow — мусор) и **6 промальп-конкурентов** с похожими flat-URL-структурами. Programmatic service × district применяют только нишевые игроки (арбо/мусор), широкий промальп-сегмент его не использует — это **окно возможности для obikhod.ru**: построить programmatic 4 услуги × 60 районов = 240+ посадочных, чего нет ни у кого.

## 5 канонических URL-паттернов (используются у 80%+ конкурентов)

### 1. **Flat /[service-slug]/** на корне — у 11 из 14 живых конкурентов (79%)

Самый распространённый паттерн legacy-WordPress / Bitrix без иерархии услуг.

Примеры:
- `arboristik.ru/kronirovanie-derevev/`
- `alpbond.org/sbros-snega-s-krysh/`
- `promalper.ru/uborka-snega-s-kryish.html`
- `lesoruby.com/udalenie-derevev/`
- `musor.moscow/vyvoz-musora-iz-kvartiry/`

**Слабая сторона:** нет иерархии → теряется кластеризация ключей. SEO-вес размыт.

### 2. **/[pillar]/[sub-service]/** — у 5 из 14 (36%, включая лидеров)

2-уровневая иерархия с pillar-категорией.

Примеры:
- `liwood.ru/services/udalenie-derevev/balashiha/`
- `alpme.ru/our-services/cleaning/mojkaokon/`
- `cleaning-moscow.ru/uborka-kvartir/[sub-service]/`
- `demontazhmsk.ru/services/demontazh-kirpichnyh-sten/`
- `fasadrf.ru/montazh-fasada/[sub]/`

**Сильная сторона:** хабы pillar собирают вес от sub-сервисов и районов.

### 3. **/[pillar]/[sub-service]/[district]/** — programmatic, у 2 из 14 (14%) **— конкурентное преимущество**

3-уровневая программаткой.

- `liwood.ru/services/udalenie-derevev/[district]/` — 40 районов
- `udalenie-dereviev.moscow/udalit-derevo/[district]/` — 21 район

**В широком промальп-сегменте этого паттерна нет совсем** — okno opportunities для obikhod.ru.

### 4. **/blog/[slug]/** или `/articles/[slug]/` или `/poleznye-stati/[slug]/` — у 12 из 14 (86%)

Контент-кластер. Объёмы:
- fasadrf.ru — **148 статей** (max)
- musor.moscow — **103 статьи** + 1051 новость (огромный новостной автоген)
- liwood.ru — 85 статей
- arboristik.ru — ~50 статей
- alpbond.org — 80+
- stroj-musor.moscow — 59 статей + 221 новость
- cleaning-moscow.ru — статьи на корне (антипаттерн)
- promalper.ru — статьи на корне (антипаттерн)
- udalenie-dereviev.moscow — 22 статьи
- lesoruby.com — 48 статей с датой в slug (антипаттерн)

**Норма:** 50-150 статей. Средняя — ~70.

### 5. **/[okrug]/** или `/rajony/[district]/` или `/goroda/[city]/` — у 5 из 14 (36%) — гео-сегмент

Programmatic district страницы.

Примеры:
- `musor.moscow/cao/`, `/rajony-obsluzhivanija/arbat/`, `/goroda/vyvoz-musora-balashiha/`
- `stroj-musor.moscow/vyvoz-musora-cao/`, `/vyvoz-musora-himki/`
- `liwood.ru/services/udalenie-derevev/[district]/`
- `udalenie-dereviev.moscow/udalit-derevo/[district]/`
- `arboristik.ru/[district]/` (в навигации, вне sitemap)

## Глубина дробления подуслуг — типичные значения

| Глубина | Сколько конкурентов | Кто |
|---|---|---|
| 1 уровень (плоско) | 8 из 14 (57%) | arboristik, alpbond, lesoruby, promtehalp, promalper, umisky, stroj-musor (для типов) |
| 2 уровня | 4 из 14 (29%) | liwood (часть), alpme, cleaning-moscow, demontazhmsk, udalenie-dereviev |
| 3 уровня | 2 из 14 (14%) | liwood (programmatic district), fasadrf (часть) |
| 4 уровня | 1 из 14 (7%) | fasadrf (по производителям подсистем) |

**Типичная глубина: 1-2 уровня.** 3+ — только у 2 конкурентов.

## Гео-покрытие — сколько районов в среднем

| Конкурент | Districts/Cities | Tier |
|---|---:|---|
| musor.moscow | 109 районов МСК + 19 городов МО + 9 округов = **137** | S |
| arboristik.ru | ~60 районов МО (вне sitemap) | A |
| stroj-musor.moscow | 9 округов + 13 городов = **22** | B |
| liwood.ru | 40 районов МО (только в одном кластере) | B |
| udalenie-dereviev.moscow | 21 район МО | B |
| alpme.ru | 1 (Москва как /msk/) | C |
| Все остальные (8) | 0 | D |

**Среднее по выборке:** ~20 районов. **Медиана:** 0.

**Вывод:** ниже широкого промальп-сегмента гео-покрытие около нуля. В нише «арбо» и «мусор» лидеры покрывают 20-140 районов. **obikhod.ru стартует с 7 первой волны (Одинцово/Красногорск/Мытищи/Химки/Истра/Пушкино/Раменское — из CLAUDE.md), целевая M3 = 60+** для perit с лидерами.

## Programmatic service × district — кто использует

Только **2 из 14** (14%) применяют этот паттерн:
1. **liwood.ru** — `/services/udalenie-derevev/[40 районов]/` — единственный pillar с гео
2. **udalenie-dereviev.moscow** — `/udalit-derevo/[21 район]/`

**Никто не делает 4 услуги × 60 районов = 240 посадочных.** Это main opportunity для obikhod.ru.

## Programmatic service × material/object — альтернативный приём

Из 14:
- **demontazhmsk.ru** — стены × 5 материалов, перегородки × 5, полы × 9, санузлы × 4 (suvy programmatic по материалам)
- **fasadrf.ru** — навесные фасады × 4 производителя подсистем (rusekspo/ukon/ism/zias)
- **alpbond.org** — длинный список узких URL по объектам (силосы, водонапорные башни, пожарные лестницы, опоры ЛЭП) — semi-programmatic

Применимо для obikhod.ru в кластере «демонтаж» (стены × материал / объект × тип).

## Блог: кто имеет и какой объём

**Имеют блог: 12 из 14 (86%)** — фактически **must-have**.

Объёмы (от больших к малым):
- fasadrf.ru — 148
- musor.moscow — 103 (+ новости)
- liwood.ru — 85
- alpbond.org — 80+
- stroj-musor.moscow — 59
- arboristik.ru — ~50
- lesoruby.com — 48
- umisky.ru — 41
- udalenie-dereviev.moscow — 22
- promtehalp.ru — 5+
- cleaning-moscow.ru — статьи на корне (без счёта, антипаттерн)
- promalper.ru — статьи на корне
- alpme.ru — **нет блога** (исключение)
- demontazhmsk.ru — **нет блога** (исключение)
- kronotech.ru — заблокирован

**Норма для obikhod.ru:** 60-100 статей в первый год, темы:
1. Регуляторика (порубочный билет, штрафы ГЖИ/ОАТИ)
2. Сезонные обрезки и операции
3. Цены / расчёты («сколько стоит ...»)
4. Технологии (валка частями, дробление пней, уборка снега техникой)
5. Нормативка (152-ФЗ, классы опасности отходов, ТКО/ТБО)

## B2B-раздел: кто имеет и как структурирует

**Отдельный B2B-раздел:** только 1 из 14 (7%) — **cleaning-moscow.ru** (`/korporativnym-klientam/` vs `/chastnym-klientam/`).

**Implicit B2B (намёк в контенте без отдельной посадочной):** 8 из 14 (57%):
- promtehalp.ru — `/page/partnership/`
- alpbond.org — упоминание на главной «спец. условия для УК/ТСЖ»
- alpme.ru — клиенты-логотипы
- musor.moscow — `/dogovor-na-vyvoz-musora/`, корп. отзывы
- stroj-musor.moscow — `/dogovor-na-vyvoz-musora/`
- promalper.ru — упоминание УК/ТСЖ
- umisky.ru — программа лояльности для бюджетных
- demontazhmsk.ru — /demontazh-ofisov/, /angarov-i-skladov/

**Без B2B вообще:** 5 из 14 (36%) — арбо-узкие конкуренты + lesoruby.com.

**Подсегменты B2B (как структурируют когда есть):**
- УК / ТСЖ
- Застройщики / девелоперы
- FM-операторы (упоминания почти не встречаются — недоосвоено)
- Госзаказ (упоминания почти не встречаются — недоосвоено)
- Корпоративные клиенты (общая категория)

**Вывод:** **отсутствие отдельного B2B-хаба у 93% конкурентов = главное окно для obikhod.ru.**
Из CLAUDE.md immutable: **«Штрафы ГЖИ/ОАТИ берём на себя по договору»** — это уникальный B2B-крючок, которого нет ни у одного конкурента.

## Калькуляторы / форма «фото→смета»

**Калькуляторы есть** у 4 из 14 (29%):
- liwood.ru — `/info/calculator/`
- alpme.ru — `/calculator`
- udalenie-dereviev.moscow — `/kalkulyator-stoimosti/`
- musor.moscow — на главной (выпадайки тип/объём/округ)
- fasadrf.ru — форма-калькулятор (упрощённый)

**Формы «фото→смета»: ни у кого** не выделена явно — **главное конкурентное преимущество obikhod.ru** (immutable из CLAUDE.md «фикс-цена за объект + смета за 10 мин по фото»).

## E-E-A-T-сигналы в IA

Кто строит:
- **cleaning-moscow.ru** — авторы статей как отдельные посадочные (`/avtor-pavlina-pimenova/` и др.) + /proverka-informacii/ — **best practice**
- **umisky.ru** — `/about/docs/[id]/` — лицензии/СРО как отдельные URL
- **musor.moscow** — `/licenzii/`, `/normativnye-dokumenty/`
- **stroj-musor.moscow** — `/licenzija/`, `/park-spectehniki/[10 URL]/`
- **promtehalp.ru** — упоминание СРО

**Норма для obikhod.ru:** /licenzii/, /sro/, /park-spectehniki/, /komanda-arboristov/, /avtori/ — отдельные URL.

## Что точно не делать (антипаттерны конкурентов)

1. **Сlash-варианты vs no-slash** в одних slug-форматах: udalenie-dereviev.moscow смешивает `/udalit-derevo-X/` и `/udalit-derevo-v-X/` — расщепляет SEO-вес
2. **Дата в slug**: lesoruby.com `/articles/spil-derevev-v-balashihe-17-01-2017/` — выглядит устаревшим
3. **Статьи на корне без префикса /blog/**: cleaning-moscow.ru, promalper.ru — растворяет URL-структуру
4. **`.html`-расширения**: promalper.ru — legacy
5. **HTTP без HTTPS**: fasadrf.ru, promtehalp.ru, arboristik.ru — снижение в выдаче
6. **Старые sitemap (lastmod 2017-2021)**: arboristik.ru (2017), promtehalp.ru (2021) — Google теряет интерес
7. **Sitemap не покрывает услуги**: umisky.ru — техническая ошибка
8. **DDoS-Guard блокирует ботов**: kronotech.ru — Google тоже теряет доступ к части контента
9. **Двойные клоны (musor.moscow + stroj-musor.moscow)**: каннибализация выдачи

## Рекомендации для seo1 (вход в URL-tree)

### Должно быть в obikhod.ru/

```
/
├── /uslugi/                           # pillar listing
│   ├── /spil-derevev/                 # 4 pillar cluster
│   │   ├── /[sub-service]/            # ~10 sub (валка/спил/обрезка/кронирование/корчевание/измельчение/...)
│   │   └── /[district]/               # 60+ programmatic district
│   ├── /chistka-krysh-ot-snega/
│   │   ├── /[sub-service]/            # ~6 sub (механизированная/ручная/абонентское/...)
│   │   └── /[district]/
│   ├── /vyvoz-musora/
│   │   ├── /[sub-service]/            # ~15 sub (по типам мусора/контейнеры/гр.грузчики)
│   │   └── /[district]/
│   └── /demontazh/
│       ├── /[sub-service]/            # ~20 sub (объекты/стены/полы/санузлы)
│       └── /[district]/
│
├── /b2b/                              # **главное конкурентное преимущество**
│   ├── /uk/                           # для УК
│   ├── /tszh/                         # для ТСЖ
│   ├── /zastroyshchikam/              # девелоперам
│   ├── /fm-operatoram/                # FM-операторы
│   └── /goszakaz/                     # госзаказ
│
├── /raschet-foto/                     # **«фото→смета за 10 минут» — отдельная посадочная**
├── /kalkulyator/                      # 4 калькулятора (по pillar)
│
├── /[district]/                       # альт. гео-вход (по району → все 4 услуги)
│
├── /blog/[topic]/                     # блог 60-100 статей в первый год
│
├── /o-kompanii/, /licenzii/, /sro/, /park-tehniki/
├── /komanda/                          # арбористы как лица (E-E-A-T)
├── /kontakty/, /tseny/, /faq/, /otzyvy/
└── /portfolio/[case-slug]/
```

### Стратегические выводы

1. **Programmatic 4 услуги × 60 районов = 240 посадочных** — никого нет на этом уровне в 4-в-1
2. **B2B-хаб с подсегментами УК/ТСЖ/застройщики/FM/госзаказ** — у 93% конкурентов нет
3. **«Фото→смета» как отдельная посадочная + 4 калькулятора** — никого нет
4. **Блог 60-100 статей в первый год** — норма (если делать, то делать)
5. **E-E-A-T через /komanda/ + /licenzii/ + /sro/ + /avtori/** — best-practice от cleaning-moscow + umisky
6. **HTTPS-only, sitemap актуальный, без `.html`, без даты в slug** — гигиена

## Источники по каждому конкуренту

См. `seosite/01-competitors/deep/<domain>.md` (15 файлов).
