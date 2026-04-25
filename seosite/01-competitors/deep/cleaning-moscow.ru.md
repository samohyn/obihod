# cleaning-moscow.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** клининг-only (квартиры/коттеджи/офисы/после-стройки/химчистка)

## Sitemap / IA

- Sitemap: 472 URL
- Самый большой среди клининг-конкурентов
- WordPress, иерархия 2 уровня в URL

```
cleaning-moscow.ru/
├── /
├── /o-kompanii/, /kontakty/, /otzyvy/
├── /price/, /privacy/, /konfidentsialnost/
├── /polzovatelskoe-soglashenie/, /pravila-ispolzovaniya-saita/
├── /akcii-i-skidki/, /foto/
├── /korporativnym-klientam/         # **B2B-раздел**
├── /chastnym-klientam/              # **B2C-раздел**
│
├── /uborka-kvartir/                 # **pillar: уборка квартир (49 URL)**
│   ├── /[sub-service]/              # под-услуги уборки квартир
│   ├── /uborka-kvartir-v-vihodnie-dni/
│   └── ... (генеральная, после-ремонт, поддерживающая, разовая)
│
├── /uborka-pomeshhenij/             # **pillar: уборка помещений (41 URL)**
│   └── /[sub-service]/
│
├── /uborka-ofisov/                  # **pillar: уборка офисов (15 URL)**
│   ├── /uborka-ofisov-old/          # старая версия (антипаттерн)
│   └── /[sub-service]/
│
├── /uborka-kottedzhej/              # **pillar: уборка коттеджей (14 URL)**
│   └── /[sub-service]/
│
├── /uborka-territorii/              # **pillar: уборка территории (14 URL)**
├── /uborka-posle-remonta/, /uborka-posle-pozhara/, /uborka-posle-smerti/   # спец-уборка
│
├── /himchistka/                     # **pillar: химчистка (36 URL)**
│   ├── /[item-type]/
│   └── (диваны, ковры, матрасы, мягкая мебель)
│
├── /mojka-okon-i-lodzhij/           # **pillar: мойка окон (19 URL)**
├── /shlifovka-pola/                 # **pillar: шлифовка пола (17 URL)**
├── /tsiklevka/                      # **pillar: циклёвка (12 URL)**
│
├── /vyvoz-i-utilizaciya/            # **pillar: вывоз/утилизация (19 URL)**
│
├── /prom-exploitation/              # **pillar: промышленная эксплуатация (22 URL)**
│   └── (B2B-эксплуатация зданий)
│
├── /drugie-uslugi/                  # **pillar: прочие услуги (39 URL)**
│   ├── /uteplenie-okon/
│   └── ...
│
├── /vidy_uborki/                    # обзор видов уборки
│
├── # — Авторы как страницы (E-E-A-T) —
├── /avtor-pavlina-pimenova/, /avtor-tatyana-blinkova/
├── /avtor-inna-kaminskaya/, /avtor-irina-goncharova/
├── /avtori-statey/, /proverka-informacii/
│
└── # — Блог-статьи на корне (без префикса /blog/) —
    ├── /kak-provodyat-himchistku-divana/
    ├── /zachem-myt-okna-osenyu/
    ├── /zachem-myt-fasady-zdanij/
    └── /vosstanovlenie-liftov/
```

## Pillar-категории

11 чётких pillar в URL:
1. /uborka-kvartir/ (49 URL)
2. /uborka-pomeshhenij/ (41 URL)
3. /drugie-uslugi/ (39 URL)
4. /himchistka/ (36 URL)
5. /prom-exploitation/ (22 URL)
6. /vyvoz-i-utilizaciya/ (19 URL)
7. /mojka-okon-i-lodzhij/ (19 URL)
8. /shlifovka-pola/ (17 URL)
9. /uborka-ofisov/ (15 URL)
10. /uborka-kottedzhej/ (14 URL)
11. /uborka-territorii/ (14 URL) + /tsiklevka/ (12 URL)

## Дробление подуслуг

- **2 уровня:** /[pillar]/[sub-service]/
- Очень глубокая семантика по типам объектов и видам уборки

## Гео-страницы

- **Programmatic гео отсутствует**
- Москва+МО без посадочных по районам/городам
- Слабая сторона при таком большом каталоге

## B2B

- ✅ **Отдельный B2B-раздел** /korporativnym-klientam/
- ✅ /chastnym-klientam/ — отдельная C2C-посадочная
- /prom-exploitation/ — кластер для промэксплуатации (B2B)
- /uborka-ofisov/ — implicit B2B
- Кейсы корп-клиентов: Emirates, Газпром, Bitriver

## Блог

- **Блог как отдельный URL-кластер не выделен**
- Статьи лежат на корне (антипаттерн): /zachem-myt-okna-osenyu/, /vosstanovlenie-liftov/, etc.
- Авторы как отдельные посадочные (E-E-A-T-стратегия)
- /proverka-informacii/, /avtori-statey/ — фактчек как E-E-A-T

## Уникальные элементы

- ✅ **B2B/B2C сегментация** в URL (/korporativnym-klientam/, /chastnym-klientam/)
- ✅ **Авторы статей как E-E-A-T** (отдельные посадочные)
- ✅ /proverka-informacii/ — fact-check как навигационный элемент
- ✅ /uborka-posle-smerti/ — глубокая семантика
- ❌ Калькулятор: только формы запроса
- ❌ Programmatic гео отсутствует

## URL-паттерны

1. `/[pillar]/` — pillar-категория
2. `/[pillar]/[sub-service]/` — подуслуга
3. `/avtor-[name]/` — авторы (E-E-A-T)
4. `/[info-slug]/` — статьи на корне (антипаттерн)

**Канонический паттерн:** `cleaning-moscow.ru/[pillar]/[sub]/`. Чистая иерархия, B2B/B2C в URL, но без гео.
