# demontazhmsk.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** демонтаж-only (квартиры/дома/перегородок/полов/санузлов/объектов)
**Примечание:** заменил исходный demontage-services.ru — DNS не резолвится, demontazhmsk.ru подходит как functional equivalent

## Sitemap / IA

- Sitemap: 94 URL
- Все URL — под /services/ (2 уровня)
- Lastmod актуальный

```
demontazhmsk.ru/
├── /
├── /kontakty/, /privacy/, /vakansii/, /rekvizity/
│
├── /services/                          # **главный pillar: 90 URL**
│   ├── # — Объекты целиком —
│   ├── /demontazh-kvartiry/, /demontazh-hrushhevki/
│   ├── /demontazh-doma/, /demontazh-derevyannogo-doma/
│   ├── /demontazh-karkasnogo-doma/, /demontazh-bani/, /demontazh-dachi/
│   ├── /demontazh-saraev/, /demontazh-postroek/, /demontazh-hozbloka/
│   ├── /demontazh-pristroiki/, /demontazh-pechi/
│   ├── /slom-kirpichnogo-doma/, /snos-brevenchatogo-doma/
│   ├── /demontazh-ofisov/, /demontazh-magazina/, /demontazh-shkoly/
│   ├── /demontazh-pavilona/, /demontazh-stellazhej/
│   ├── /demontazh-angarov-i-skladov/, /demontazh-garazhej/
│   ├── /demontazh-zaborov/, /demontazh-obektov/
│   │
│   ├── # — Внутренние работы —
│   ├── /demontazh-otdelki/, /demontazh-shtukaturki/
│   ├── /demontazh-shpatlevki-i-kraski/
│   │
│   ├── # — Конструктивные —
│   ├── /demontazh-fundamenta/, /demontazh-krovli/, /demontazh-obreshetki/
│   ├── /demontazh-balkonov-i-lodzhij/
│   │
│   ├── # — Стены/перегородки (programmatic по материалам) —
│   ├── /demontazh-sten/
│   ├── /demontazh-kirpichnyh-sten/, /demontazh-derevyannyh-sten/
│   ├── /demontazh-betonnyh-sten/, /demontazh-gazobetonnyh-sten/
│   ├── /demontazh-gipsokartonnyh-sten/
│   ├── /demontazh-peregorodok/
│   ├── /demontazh-kirpichnyh-peregorodok/, /demontazh-derevjannyh-peregorodok/
│   ├── /demontazh-gazobetonnyh-peregorodok/, /demontazh-gipsokartonnyh-peregorodok/
│   ├── /demontazh-betonnyh-peregorodok/
│   │
│   ├── # — Полы (programmatic по типам) —
│   ├── /demontazh-pola/
│   ├── /demontazh-betonnoj-styazhki/, /demontazh-czementnoj-styazhki/, /demontazh-styazhki/
│   ├── /demontazh-nalivnogo-pola/
│   ├── /demontazh-derevyannogo-pola/, /demontazh-starogo-parketa/
│   ├── /demontazh-plitki-i-keramogranita/
│   ├── /demontazh-linoleuma-i-kovrolina/
│   ├── /demontazh-plintusa/, /demontazh-betonnogo-osnovanija/
│   │
│   ├── # — Потолки —
│   ├── /demontazh-potolka/, /demontazh-natyazhnogo-potolka/
│   ├── /demontazh-potolka-armstrong/, /demontazh-potolka-grilyato/
│   ├── /demontazh-potolka-iz-gipsokartona/
│   │
│   ├── # — Сантехкабины (programmatic) —
│   ├── /demontazh-santehkabiny/
│   ├── /demontazh-vannoj-komnaty/
│   ├── /demontazh-santehkabiny-iz-betona/, /demontazh-santehkabiny-iz-gipsa/
│   ├── /demontazh-shifernoj-santehkabiny-iz-aczeida/
│   ├── /demontazh-vodoprovodnyh-trub/
│   ├── /demontazh-unitazov-i-bide/
│   ├── /demontazh-stiralnyh-mashin/
│   │
│   ├── # — Окна / двери / проёмы —
│   ├── /demontazh-okon/, /demontazh-okonnyh-proyomov/, /demontazh-okonnogo-otkosa/
│   ├── /demontazh-dvernyh-blokov/, /demontazh-proyomov-i-blokov/
│   ├── /demontazh-reshetok/
│   │
│   ├── # — Прочее —
│   ├── /demontazh-batarej/, /demontazh-truboprovoda/
│   ├── /demontazh-sajdinga/, /demontazh-vagonki/, /demontazh-panelej-pvh/
│   ├── /demontazh-lestnicy/, /demontazh-stolbov/
│   └── /demontazh-kondiczionerov-i-ventilyaczionnyh-sistem/
```

## Pillar-категории

Из URL — нет явных pillar (все 90 URL под одним /services/).
Из контента (WebFetch) — функциональные группы:
1. Демонтаж квартир / домов / объектов целиком
2. Демонтаж стен / перегородок
3. Демонтаж полов / потолков
4. Демонтаж санузлов
5. Демонтаж проёмов / окон / дверей
6. Демонтаж кровли / фасада

## Дробление подуслуг

- **2 уровня:** /services/[slug]/
- Семантическое **programmatic по материалам**:
  - стены × материал = 6 URL (кирпич/дерево/бетон/газобетон/гипсокартон)
  - перегородки × материал = 5 URL
  - полы × тип покрытия = 9 URL
  - санузлы × материал = 4 URL
- Семантическое programmatic по объектам (хрущёвка / дача / баня / сарай / гараж / павильон / магазин / школа / офис / ангар)

## Гео-страницы

- **Programmatic гео отсутствует**
- /kontakty/ только Москва, без посадочных по районам/городам

## B2B

- **Отдельного раздела нет**
- /demontazh-ofisov/, /demontazh-magazina/, /demontazh-angarov-i-skladov/ — implicit B2B
- /rekvizity/ — реквизиты как страница (B2B-friendly)

## Блог

- **Блога нет** — sitemap не содержит /blog/, /stati/, /articles/
- Слабая сторона по контент-SEO

## Уникальные элементы

- ✅ Глубокий programmatic по материалам (стены × 5 материалов и т.д.)
- ✅ Прайс-лист (упомянут в WebFetch)
- ❌ Калькулятор отсутствует
- ❌ Блога нет
- ❌ Гео-страниц нет
- ❌ B2B-раздела нет

## URL-паттерны

1. `/services/[slug]/` — все услуги (одно место)
2. `/services/demontazh-[object]-[material]/` — programmatic material × object
3. `/[static]/` — статика (kontakty, vakansii, privacy, rekvizity)

**Канонический паттерн:** `demontazhmsk.ru/services/[slug]/`. Чистый каталог демонтажа с глубокой semantic-программаткой по материалам, но без блога и гео.
