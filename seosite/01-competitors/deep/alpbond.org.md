# alpbond.org

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** промальп-широкий (фасад/кровля/монтаж/демонтаж/арбо/реклама) + чистка снега + клининг

## Sitemap / IA

- Sitemap: 199 URL, lastmod актуальный
- Плоский каталог услуг — все на корне домена
- 2 уровня иерархии (только для блога /blog/[slug]/)

```
alpbond.org/
├── /                                  # главная
├── /o-kompanii/, /kontakty/, /otzyvy/, /vakansii/
├── /pravila-ispolzovaniya-saita/
├── /politika-konfidencialnosti/
│
├── /[service-slug]/                   # ~150 услуг плоско на корне
│   ├── # — Фасадные работы —
│   ├── /fasadnye-raboty/
│   ├── /pokraska-fasadov-ceny-za-m2/
│   ├── /chistka-fasadov-zdanij/
│   ├── /mojka-fasada-zdaniya/
│   ├── /montazh-ventiliruemyh-fasadov/
│   ├── /remont-fasada-zdaniya/
│   ├── /oblicovka-fasada-naturalnym-kamnem/
│   ├── /montazh-sajdinga/, /mokryj-fasad/, /gidrofobizaciya-fasadov/, /oblicovka-kirpichom/
│   │
│   ├── # — Кровельные работы —
│   ├── /krovelnye-raboty-cena-za-m2/
│   ├── /montazh-krovli/, /remont-krovli/, /uteplenie-krovli/
│   ├── /montazh-vodostokov/, /montazh-snegozaderzhatelej/
│   ├── /montazh-obogreva-krovli-i-vodostokov/
│   ├── /demontazh-i-zamena-krovli/
│   ├── /montazh-myagkoj-krovli/, /montazh-membrannoj-krovli/
│   ├── /remont-naplavljaemoj-krovli/
│   ├── /montazh-krovlya-iz-profnastila/, /montazh-falcevojkrovli/
│   ├── /montazh-metallocherepicy/, /ploskaya-krovlya/
│   ├── /montazh-mednoj-krovli/
│   └── /remont-kryshi-chastnogo-doma/
│   │
│   ├── # — Снег / клининг на высоте —
│   ├── /sbros-snega-s-krysh/
│   ├── /uborka-vyvoz-snega/
│   ├── /klining-na-vysote/
│   ├── /mojka-okon-alpinistami/
│   ├── /ochistka-vodostokov-i-zhelobov-ot-listev/
│   ├── /mojka-vitrazhej-alpinistami/
│   └── /udalenie-vysolov/
│   │
│   ├── # — Промальп / монтаж —
│   ├── /vysotnye-raboty/
│   ├── /malyarnye-raboty-na-vysote/
│   ├── /gidroizolyacionnye-raboty/
│   ├── /ognezashchitnaya-obrabotka/
│   ├── /peskostrujnye-raboty/
│   ├── /montazh-metallokonstrukcij/
│   ├── /remont-rezervuarov/
│   ├── /montazh-kondicionerov-alpinistami/
│   ├── /zamena-steklopaketov/
│   ├── /montazh-reklamy/, /montazh-bannerov/, /montazh-svetovyx-bukv/
│   ├── /montazh-girlyand/
│   ├── /vskrytie-kvartir-cherez-okno/
│   ├── /podsvetka-bashennogo-krana/
│   ├── /svarochnye-raboty-na-vysote/
│   ├── /demontazh-reklamnyh-konstrukcij/
│   ├── /remont-i-demontazh-dymovyx-trub/, /demontazh-dymovyh-trub/
│   ├── /remont-vodonapornoj-bashni/, /remont-elevatorov/, /remont-silosa/
│   ├── /montazh-videokamer-na-vysote/
│   ├── /germetizaciya-mezhpanelnyx-shvov/
│   └── /obespylivanie-metallokonstrukcij/
│   │
│   ├── # — Покрасочные —
│   ├── /pokraska-fasadov-ceny-za-m2/, /pokraska-derevyannogo-doma-snaruzhi/
│   ├── /pokraska-metallokonstrukcij/, /pokraska-krovli/
│   ├── /pokraska-dymovyh-trub/, /pokraska-gazovyh-trub/
│   ├── /pokraska-kranov/, /pokraska-mostov-i-estakad/
│   ├── /pokraska-rezervuarov/, /pokraska-elevatorov/
│   ├── /pokraska-cistern/, /pokraska-silosov/
│   ├── /pokraska-vodonapornoj-bashni/
│   ├── /mekhanizirovannaya-pokraska/, /pokraska-opor-lep/
│   ├── /pokraska-vyshek/, /pokraska-pozharnyh-lestnic/
│   │
│   ├── # — Арбористика —
│   └── /uslugi-arboristov/             # одна обзорная (нет подвидов)
│
└── /blog/[slug]/         # 80+ статей блога
    ├── /blog/kak-pomyt-okna-na-3-etazhe-pravila-bezopasnosti-ot-alpbond/
    ├── /blog/sezon-snega-na-krovle/
    └── ... (актуальные статьи 2024-2025)
```

## Pillar-категории

Согласно WebFetch главной — 10 pillar:
1. Фасадные работы
2. Кровельные работы
3. Клининговые услуги (включая снег)
4. Высотные монтажные работы
5. Герметизация и гидроизоляция
6. Малярные работы
7. Пескоструйные работы
8. Такелажные работы
9. Арбористика
10. Огнезащитная обработка

В URL-структуре эти pillar **не выражены отдельными URL** (нет /fasady/, /krovlya/, /klining/) — они только в навигации/меню.

## Дробление подуслуг

- **1 уровень** для услуг (всё плоско на корне)
- Семантическое дробление по объектам (по типу: пожарные лестницы, силосы, рекламные конструкции, вышки)
- 80+ услуг — самый широкий каталог среди промальп-конкурентов

## Гео-страницы

- **Programmatic гео отсутствует**
- Нет /msk/, /[district]/

## B2B

- **Отдельного раздела нет**
- В преимуществах: «Специальные условия для УК и ТСЖ»
- Семантика B2B размыта по описаниям отдельных услуг (заводы, силосы, мосты)

## Блог

- /blog/ — 80+ актуальных статей (2024-2026)
- Темы: безопасность, сезон снега, мойка фасадов, законодательство

## Уникальные элементы

- ✅ Огромный каталог услуг (80+) — отлично для long-tail SEO
- ✅ Узкие посадочные «покраска вышек / опор ЛЭП / водонапорных башен / силосов»
- ❌ Калькулятор отсутствует
- ❌ Форма «фото→смета» отсутствует
- ❌ Нет programmatic гео

## URL-паттерны

1. `/[slug]/` — все услуги (плоско, 1 уровень)
2. `/blog/[slug]/` — блог
3. `/o-kompanii/`, `/kontakty/`, `/otzyvy/` — статика

**Канонический паттерн:** `alpbond.org/[slug]/`. Чистый legacy-flat-WordPress, силён в long-tail.
