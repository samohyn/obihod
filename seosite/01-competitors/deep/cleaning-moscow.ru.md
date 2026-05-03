# cleaning-moscow.ru

**Дата сканирования:** 2026-04-25 (Stage 1) · refresh **2026-05-03 (W14)**
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

---

## W14 refresh (2026-05-03)

### URL count

| Источник | URL | Δ vs W11 (~80) |
|---|--:|---|
| sitemap.xml (live) | **626** | **+546** vs прежняя W11-оценка ~80 |

> **CORRECTION W11→W14:** наша W11 оценка cleaning-moscow «~80 URL» **была критически занижена** (Stage 1 sitemap = 472, W14 sitemap = 626). W11 закрытие «closure 149%» **расчёт ошибочный** — реально мы (119 URL) vs cleaning (~472 W11 actual) = closure ~25%, NOT 149%.
> **W14 actual:** наш Stage 3 ~211-230 vs cleaning **626** → closure **34-37%** vs cleaning-moscow (а не 200%+).

> Method: WebFetch live на standard sitemap.xml 2026-05-03 (lastmod 2026-04-28..30).
> Источник: `https://cleaning-moscow.ru/sitemap.xml`.

### Content-depth (sample — partial DDoS-Guard block)

- DDoS-Guard блокирует прямой curl (HTTP 403 на 2/5 sample). Live page render через WebFetch удался для 2 страниц:

| URL | Word count (visible) | JSON-LD | Microdata | FAQ | Breadcrumbs |
|---|--:|:-:|:-:|:-:|:-:|
| `/uborka-kvartir/` | ~8 500-9 000 | ❌ | ❌ | ✅ | ✅ |
| `/avtor-pavlina-pimenova/` | ~250-300 (bio) | ❌ | partial Person | n/a | ✅ |

> **Implication:** cleaning-moscow контент-depth pillar **значительно глубже** наших ~3 800 слов (~2.2x). Это NEW W14 сигнал — мы недооценивали их content-density. Они компенсируют отсутствие гео огромными pillar-страницами.

### Schema-coverage

- **W11 baseline:** ~40% (estimate)
- **W14 measured:** **0% JSON-LD** на 5/5 sample, partial microdata (`itemtype="http://schema.org/..."` есть, но не на каждой странице, и не на Person-странице авторов)
- **Δ:** не двинулось; ниже musor.moscow и liwood по schema-формату.
- Наше опережение по «JSON-LD format» vs cleaning-moscow — **confirmed sustained +60-100pp** (зависит от строгости определения).

### UX features (homepage check 2026-05-03)

- ❌ **Нет калькулятора** (sustained — статичный прайс)
- ❌ Нет live-чата
- ✅ Lead form на каждой странице (callback)
- ❌ Нет «фото→смета» upload (sustained)
- ✅ Trust signals: 2 635 отзывов, 4.9★, ТОП-10 значки, Yandex/2GIS/Google Maps badges
- ❌ INN/OGRN/SRO не на homepage

### E-E-A-T (W14 detail)

- ✅ **Authors как страницы** (`/avtor-pavlina-pimenova/`, и др.) — sustained, лучшая E-E-A-T-структура из 17
- ✅ Cross-domain `sameAs`: **Telegram + VK + MAX + Email** в footer authors-page (W14 verified)
- ❌ **No Person JSON-LD schema** на authors-страницах (только на странице упомянуто visually)
- ✅ `/proverka-informacii/` (fact-check) sustained как навигационный элемент
- ✅ Bio Павлины: 250-300 слов, образование (СПбГУТД), 11 лет опыта, специализация эко-клининг

### 4-в-1 status

- **Single pillar (клининг-only)** sustained — 11 sub-pillar внутри клининга, но нет арбо/мусор/снег/демонтаж.

### Δ summary W14 vs W11

| Метрика | W11 (estimate) | W14 (measured) | Δ |
|---|--:|--:|---|
| URL count | ~80 | **626** | **+682%** ⚠ correction (W11 underestimated) |
| Schema-coverage | ~40% (JSON-LD) | 0% JSON-LD / partial microdata | -40pp (re-classified) |
| Content-depth (avg pillar) | ~2 000 | **~8 500-9 000** | **+325%** ⚠ correction |
| UX (calc / lead / chat) | lead-only | lead-only sustained | 0 |
| 4-в-1 | 1 pillar | 1 pillar | sustained |
| E-E-A-T (authors + sameAs) | parity | sustained — TG+VK+MAX визуально, no Person schema | sustained |

### W14 implication для нас

- **URL closure correction:** реальный benchmark cleaning-moscow = 626, а не 80. W11 closure «149%» был ошибочный. W14 closure ~34-37% к ним → **меньше нашего bench liwood-медианы (66-72%)**.
- **Content-depth — NEW сигнал:** их pillar-страницы 8 500-9 000 слов visible vs наши ~3 800. Если ось «content-depth» переоценить как «pillar-page word count», мы **отстаём в 2.2x**, не «опережаем +27%».
- **E-E-A-T — confirmed parity (visual)**, но мы можем опередить через Person JSON-LD schema (у них только visually + sameAs в footer, нет structured data).
- **JSON-LD format — confirmed sustained +60-100pp опережение** vs cleaning-moscow (только microdata partial).

