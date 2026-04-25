# udalenie-dereviev.moscow

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** арбо-only (удаление/спил/обрезка/пни/аренда) с гео-фокусом

## Sitemap / IA

- Sitemap-индекс: post-sitemap (257 URL), page-sitemap (36 URL), category-sitemap (3 URL)
- WordPress
- 296 уникальных URL

```
udalenie-dereviev.moscow/
├── /
├── /about-us/
│   ├── /about-us/careers/
│   ├── /about-us/our-partners/
│   └── /about-us/testimonials/
├── /contact-us/, /faq/, /akcii/
├── /politika-konfidencialnosti/
│
├── /kalkulyator-stoimosti/         # **калькулятор**
│
├── /vidy-rabot/                    # **pillar: типы услуг (27 URL)**
│   ├── /spil-derevev/
│   ├── /spil-derevev-s-avtovyshki/
│   ├── /spil-derevev-na-kladbishche/
│   ├── /valka-derevev/
│   ├── /vyrubka-derevev/, /vyrubka-lesa-pod-stroitelstvo/
│   ├── /udalenie-avariynyh-derevev/
│   ├── /udalenie-staryh-derevev/
│   ├── /obrezka-derevev/
│   ├── /obrezka-derevev-s-avtovyshki/
│   ├── /sanitarnaya-obrezka-derevev-i-kustarnikov/
│   ├── /opilovka-derevev/
│   ├── /kronirovanie-derevev/
│   ├── /korchevanie-pney/
│   ├── /udalenie-pnej/
│   ├── /droblenie-pnej-v-moskovskoj-oblasti/
│   ├── /izmelchenie-vetok-v-shchepu/
│   ├── /vyvoz-porubochnyh-ostatkov/
│   ├── /raschistka-uchastka-ot-derevev/
│   ├── /lechenie-derevev-uslugi-fitopatologa-v-moskovskoy-oblasti/
│   ├── /ukreplenie-derevev-v-moskovskoj-oblasti/
│   ├── /porubochnyy-bilet-moskva/
│   ├── /arenda-avtomobilnoj-vyshki/
│   ├── /arenda-izmelchitelya-pnej/
│   └── /arenda-izmelchitelya-vetok/
│
├── /udalit-derevo/                 # **pillar: гео-страницы (21 URL)**
│   ├── /v-moskovskoj-oblasti/
│   ├── /spil-derevev-zelenograd/
│   ├── /spilit-derevo-v-lobne/
│   ├── /udalenie-dereva-ramenskoe/
│   ├── /udalit-derevo-fryazino/
│   ├── /udalit-derevo-hotkovo/
│   ├── /udalit-derevo-kratovo/
│   ├── /udalit-derevo-losino-petrovskiy/
│   ├── /udalit-derevo-lytkarino/
│   ├── /udalit-derevo-lyubercy/
│   ├── /udalit-derevo-monino/
│   ├── /udalit-derevo-sergiev-posad/
│   ├── /udalit-derevo-v-balashihe/
│   ├── /udalit-derevo-v-dolgoprudnom/
│   ├── /udalit-derevo-v-himkah/
│   ├── /udalit-derevo-v-ivanteevke/
│   ├── /udalit-derevo-v-reutove/
│   ├── /udalit-derevo-v-valentinovke/
│   ├── /udalit-derevo-v-zagoryanskom/
│   ├── /udalit-derevo-v-zheleznodrozhnom/
│   └── /udalit-derevo-volkovskoe-shosse/
│   # **Антипаттерн: непоследовательные slug-форматы (udalit-derevo-X / udalit-derevo-v-X / udalenie-dereva-X)**
│
├── /portfolio/                     # 207 кейсов в портфолио
│   └── /portfolio/[case-slug]/     # часть кейсов с гео-меткой
│       ├── /izmelchenie-pnej-v-krasnogorske/
│       ├── /udalenie-berezy-v-moskovskoj-oblasti/
│       ├── /vyrubka-derevev-v-gorode-himki/
│       └── ... (картирует объекты по локациям)
│
└── /poleznye-stati/                # **22 статьи блога**
    ├── /arborist-kto-eto-i-chem-zanimaetsya/
    ├── /avariynost-derevev/
    ├── /obrezka-lipy/, /obrezka-sosny/, /obrezka-topoley/
    ├── /shtraf-za-vyrubku-dereva/
    ├── /vse-o-porubochnom-bilete/
    ├── /vyrubka-derevev-pod-lep/
    └── /zachem-nuzhno-udalyat-derevya/
```

## Pillar-категории

2 чётких pillar в URL:
1. **/vidy-rabot/** — 27 типов работ (виды услуг)
2. **/udalit-derevo/** — 21 гео-страница (programmatic district)

+ корневые: /portfolio/, /poleznye-stati/, /kalkulyator-stoimosti/, /faq/

## Дробление подуслуг

- **2 уровня:** /vidy-rabot/[work-type]/ и /udalit-derevo/[district]/
- Гео ровно как category, не как sub-service внутри /vidy-rabot/
- Антипаттерн: 21 район с непоследовательными slug-форматами

## Гео-страницы

- **21 район в МО** через /udalit-derevo/[slug]/
- + ~50 геогенерированных кейсов в /portfolio/ как косвенные гео-сигналы
- Покрытие: Балашиха, Химки, Реутов, Долгопрудный, Лобня, Зеленоград, Сергиев Посад, Раменское, Фрязино, Хотьково, Ивантеевка, Лыткарино, Люберцы, Мытищи, Пушкино, Королёв, Щёлково, Железнодорожный, Кратово, Лосино-Петровский, Монино, Валентиновка, Загорянский

## B2B

- **Отдельного раздела нет**
- /about-us/our-partners/ — лого-страница

## Блог

- /poleznye-stati/ — 22 статьи
- Темы: профессия арбориста, регуляторика (порубочный билет, штрафы), породы (липа/сосна/тополя), сезонные обрезки, древесная щепа

## Уникальные элементы

- ✅ **Калькулятор** /kalkulyator-stoimosti/
- ✅ Programmatic district (21 шт)
- ✅ /faq/ как отдельная страница
- ✅ /akcii/ — посадочная под промо
- ❌ «Фото→смета» offer не упоминается явно
- ❌ Slug-непоследовательность (udalit-derevo-X vs udalit-derevo-v-X)

## URL-паттерны

1. `/vidy-rabot/[work-type]/` — типы работ
2. `/udalit-derevo/[district]/` — гео
3. `/portfolio/[case-slug]/` — кейсы
4. `/poleznye-stati/[topic]/` — блог
5. `/kalkulyator-stoimosti/`, `/faq/`, `/akcii/` — статика

**Канонический паттерн:** `udalenie-dereviev.moscow/[pillar]/[item]/`. Чистый programmatic, удобная двойная семантика (работа × район).

## Примечание по offer'у «фото→смета за 10 минут»

Из intake задачи указан как обещанный там offer, но в WebFetch главной не подтверждён явно. Сайт обещает «оперативную оценку ситуации» — формулировка слабее. Для Wave 2 рекомендую глубже посмотреть форму на главной.
