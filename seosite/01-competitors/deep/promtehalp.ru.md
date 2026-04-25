# promtehalp.ru

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** B2B-промальп (фасады/кровля/монтаж/демонтаж/высотные) + спил деревьев + уборка снега

## Sitemap / IA

- Sitemap: 46 URL, lastmod 2021-07 (старый, частично актуальный)
- HTTP (без HTTPS), типичный legacy-PHP
- Плоская структура, 2 уровня

```
promtehalp.ru/
├── /
├── /page/about           # о компании
├── /page/price           # цены
├── /page/partnership     # партнёрство (B2B-намёк)
├── /vacancy
├── /contact
├── /work                 # портфолио
├── /video
├── /articles             # листинг блога
│
├── /service              # листинг услуг
├── /service/all          # all-листинг
│
├── /service/[slug]       # подуслуги (39 шт)
│   ├── /alpinisty-svarshchiki/
│   ├── /antikorrozijnaya-zashchita/
│   ├── /dostavka/
│   ├── /ehksklyuzivnye-uslugi-alpinistov/
│   ├── /germetizacziya-shvov/
│   ├── /kapitalnyj-remont-zdanij/
│   ├── /kondicionirovanie-i-ventilyaciya/
│   ├── /mojka-fasadov-i-ostekleniya-okon/
│   ├── /montazh-falsh-fasadov/
│   ├── /montazh-i-remont-balkonov/
│   ├── /montazh-i-remont-krovel-zdanij/
│   ├── /montazh-metallokonstrukcij/
│   ├── /montazh-reklamy/
│   ├── /montazh-ventiliruemyh-fasadov/
│   ├── /ognezashchita-konstrukcij-termozashchita/
│   ├── /promyshlennyj-alpinizm/
│   ├── /remont-i-okraska-fasadov/
│   ├── /remont-zavodov-i-cekhovyh-pomeshchenij/
│   ├── /rigging/
│   ├── /snegosbros/                                # снег с крыш
│   ├── /teplovizionnoe-obsledovanie/
│   ├── /uborka/
│   ├── /udalenie-derevev/                          # арбо как один URL
│   ├── /udalenie-vysolov/
│   ├── /uslugi-diagnostiki/
│   ├── /vysotnye-ehlektromontazhnye-raboty/
│   ├── /vysotnyj-montazh-demontazh/
│   └── /montazh-zamena-steklopaketov/
│
└── /article/[slug]       # статьи блога (5+ URL)
```

## Pillar-категории

Из меню (WebFetch): 4 группы услуг
1. Фасадные работы
2. Монтажные услуги
3. Клининговые операции
4. Промышленный альпинизм

В sitemap, однако, нет URL `/service/fasady/` или `/service/montazh/` — pillar-категории живут как фильтр на странице listing /service, но в URL-структуре они не выражены. Все 39 услуг — на одном уровне `/service/[slug]/`.

## Дробление подуслуг

- **2 уровня (`/service/[slug]/`)**, без под-под-услуг
- Нет seo-сегментации по типам объектов (заводы/жилые дома/мосты)
- Дополнительные услуги в текстах, но не в URL

## Гео-страницы

- **Нет programmatic гео-страниц**
- Нет /msk/, нет /[district]/
- На главной упоминается «по Москве и области», но без посадочных

## B2B

- **Намёк есть:** /page/partnership (партнёрство), /service/remont-zavodov-i-cekhovyh-pomeshchenij/ (заводы)
- **Отдельного хаба для УК/ТСЖ/застройщиков нет**
- Контент явно B2B-tilt, но IA не отражает

## Блог

- Есть /articles + /article/[slug]
- В sitemap 5 статей, реально может быть больше (sitemap старый)
- Темы: окраска металлоконструкций, обогрев кровли, монтаж антенн, гирлянды, обслуживание объектов

## Уникальные элементы

- ❌ Калькулятор отсутствует
- ❌ Форма «фото→смета» отсутствует
- ✅ /work — портфолио проектов
- ✅ /video — видеогалерея (редко у конкурентов)

## URL-паттерны

1. `/service/[slug]/` — все услуги (один уровень)
2. `/article/[slug]/` — статьи
3. `/page/[slug]` — статические (about/price/partnership)
4. `/work`, `/video`, `/articles`, `/vacancy`, `/contact` — корневые разделы

**Канонический паттерн:** `promtehalp.ru/service/[slug]/`. Слабая иерархия, B2B-tilt без B2B-IA.
