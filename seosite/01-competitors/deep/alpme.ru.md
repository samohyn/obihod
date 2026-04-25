# alpme.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** промальп (фасад/кровля/монтаж/арбо/праздник/такелаж) — Москва+СПб

## Sitemap / IA

- Sitemap: 202 URL, lastmod актуальный
- 2-уровневая иерархия в /our-services/
- **Уникально:** дублирование структуры под /msk/ для Москвы (alpme.ru — петербургская компания с филиалом в МСК)

```
alpme.ru/
├── /
├── /onas/, /kontakty/, /vakansii/, /otzyvy/, /faq/, /sitemap/
├── /privacy/, /persdannye/, /cookies/, /oplata/, /usloviya-sotrudnichestva/
├── /promalp/                 # обзорная промальпа
│
├── /our-services/            # каталог услуг (главный pillar)
│   ├── /our-services/        # обзор всех услуг
│   ├── /our-services/fasadnie-raboty/         # **pillar-категория**
│   │   ├── /our-services/fasad/hydrophobization/
│   │   └── /our-services/fasad/germetizacija_shvov/
│   │
│   ├── /our-services/visotnie_raboti/         # **pillar: высотные**
│   │   ├── /podjem_gruzov/
│   │   ├── /uhod_za_derevjami/
│   │   ├── /spil_derevjev/
│   │   └── /udalenie_derevjev/
│   │
│   ├── /our-services/krovlya/                  # **pillar: кровля**
│   │   ├── /ochistka_krysh/
│   │   └── /ochistka_mha/
│   │
│   ├── /our-services/cleaning/                 # **pillar: клининг**
│   │   ├── /mojkafasadov/
│   │   ├── /mojkaokon/
│   │   ├── /mojkavitrazhej/
│   │   ├── /udalenievysolov/
│   │   └── /vysotny_cleaning/
│   │
│   ├── /our-services/montazh/                  # **pillar: монтаж**
│   │   ├── /zus/
│   │   ├── /metallokonstrukcii/
│   │   ├── /vodostochnye_truby/
│   │   ├── /fasadnye_setki/
│   │   ├── /obogrev_krovli_i_vodostokov/
│   │   └── /greyushii_kabel/
│   │
│   ├── /our-services/prazdnik/                 # **pillar: праздничное оформление**
│   │   ├── /technology/
│   │   └── /proektirovanie/
│   │
│   ├── /our-services/takelagnie-raboty/        # такелаж
│   ├── /our-services/yslugi-arboristov/        # арбо обзорная
│   ├── /our-services/kronirovanie/
│   ├── /our-services/lightning_protection/     # молниезащита
│   ├── /our-services/montag_snegozadergateley/
│   ├── /our-services/podjem-gruzov-v-okno/
│   ├── /our-services/demontazh-metallokonstrukcii/
│   ├── /our-services/demontazh-na-vysote/
│   ├── /our-services/obespylivanie-metallokonstrukcii/
│   ├── /our-services/okraska_metallokonstrukcij/
│   ├── /our-services/arh_podsvetka/            # архитектурная подсветка
│   ├── /our-services/zagorodnij_dom/           # обслуживание загородных домов
│   ├── /our-services/otliv/, /vetrozashchita/
│
├── /msk/                     # **гео-сегмент Москва (зеркало структуры)**
│   ├── /msk/cleaning/mojkaokon/
│   ├── /msk/cleaning/mojkafasadov/
│   ├── /msk/krovlya/ochistka_krysh/
│   ├── /msk/montazh/zus/
│   ├── /msk/montazh/vodostochnye_truby/
│   ├── /msk/visotnie_raboti/podjem_gruzov/
│   ├── /msk/visotnie_raboti/udalenie_derevjev/
│   ├── /msk/lightning_protection/
│   ├── /msk/podjem-gruzov-v-okno/
│   ├── /msk/okraska_metallokonstrukcij/
│   ├── /msk/arh_podsvetka/
│   ├── /msk/kronirovanie/
│   ├── /msk/fasad/germetizacija_shvov/
│   ├── /msk/demontazh-metallokonstrukcii/
│   ├── /msk/yslugi-arboristov/
│   ├── /msk/prazdnik/, /msk/prazdnik/proektirovanie/
│   └── /msk/kontakty/                           # контакты МСК
│
├── /catalogue/                # каталог продуктов (zus/zur/комплекты — товарный)
│   ├── /catalogue/zus/, /zus/komplekt/, /zur/
│
├── /calculator                # **калькулятор**
│
├── /chistka-vodostokov/, /moyka-vyvesok/, /demontazh-dymovykh-trub/
│   (несколько услуг на корне без /our-services/ — legacy)
│
├── /bookalpme/                # форма бронирования
│
└── /objects/                  # портфолио (135+ кейсов)
    ├── /objects/montag_olen_boris/
    ├── /objects/petr_i_ekaterina_velikie/
    └── ... (135 кейсов)
```

## Pillar-категории

7 pillar внутри /our-services/:
1. Фасадные работы (/fasad/, /fasadnie-raboty/)
2. Высотные работы (/visotnie_raboti/) — включая арбо
3. Кровля (/krovlya/)
4. Клининг (/cleaning/)
5. Монтаж (/montazh/)
6. Праздничное оформление (/prazdnik/) — гирлянды, иллюминация
7. Такелажные (/takelagnie-raboty/)

## Дробление подуслуг

- **2 уровня**: /our-services/[pillar]/[sub-service]/
- Дополнительный 3-й уровень для /prazdnik/technology/ и /prazdnik/proektirovanie/

## Гео-страницы

- **Уникально среди 15: есть /msk/ как root-сегмент** (структурный мирроринг для Москвы, ~26 URL)
- Programmatic district-level страниц нет (только msk vs default-СПб)
- alpme.ru — компания из Питера, /msk/ — гео-фильтр для Москвы

## B2B

- **Отдельного B2B-раздела нет**
- Клиентская база (Газпром, МегаФон, Пулково) показана как логотипы, но без отдельной посадочной
- /usloviya-sotrudnichestva/ — implicit партнёрский раздел

## Блог

- **Блога нет** в sitemap (/articles/, /blog/ отсутствуют)
- Контент-маркетинг отсутствует — слабая сторона

## Уникальные элементы

- ✅ **Калькулятор** /calculator
- ✅ **/msk/-сегмент** (геотаргетинг через URL-структуру)
- ✅ **Каталог продуктов** /catalogue/ (товары, не услуги — ZUS/ZUR крепления)
- ✅ /faq/, /sitemap/, /persdannye/, /usloviya-sotrudnichestva/ — инфра
- ❌ Блога нет
- ❌ Programmatic district-страниц нет

## URL-паттерны

1. `/our-services/[pillar]/[sub-service]/` — главный (для услуг)
2. `/msk/[pillar]/[sub-service]/` — Москва-зеркало
3. `/objects/[case-slug]/` — портфолио
4. `/catalogue/[product]/` — товары
5. `/[legacy-slug]/` — legacy услуги на корне (chistka-vodostokov, moyka-vyvesok)

**Канонический паттерн:** `alpme.ru/our-services/[pillar]/[sub-service]/` + `/msk/...` для Москвы. Лучшая иерархия среди промальп-конкурентов.
