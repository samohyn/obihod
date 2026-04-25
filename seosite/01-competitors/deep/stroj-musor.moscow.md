# stroj-musor.moscow

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** строительный мусор + грунт + бетон + кирпич + снег + спил + аренда контейнеров

## Sitemap / IA

- Sitemap-индекс: post-sitemap (291), page-sitemap (130)
- 421 уникальный URL
- WordPress, плоская структура

```
stroj-musor.moscow/
├── /
├── /o-kompanii/, /kontakty/, /otzyvy/, /vakansii/
├── /licenzija/, /vopros-otvet/
├── /dogovor-na-vyvoz-musora/
├── /park-spectehniki/[6 URL]/, /akcii/[2 URL]/
├── /politika-konfidencialnosti/
│
├── /vyvoz-[type]/                  # **главный pillar: типы вывоза (плоско)**
│   ├── /vyvoz-asfaltovogo-skola/
│   ├── /vyvoz-betona/
│   ├── /vyvoz-derevev/, /vyvoz-derevjannogo-musora/
│   ├── /vyvoz-grunta/, /vyvoz-grunta-s-pogruzkoj/, /vyvoz-grunta-s-uchastka/
│   ├── /vyvoz-hlama/, /vyvoz-kirpicha/
│   ├── /vyvoz-krupnogabaritnogo-musora/
│   ├── /vyvoz-musora-bunkerami/
│   ├── /vyvoz-musora-cena/, /vyvoz-musora-iz-kvartiry/
│   ├── /vyvoz-musora-iz-ofisnogo-ili-torgovogo-centra/
│   ├── /vyvoz-musora-kontejnerom/, /vyvoz-musora-puhto/
│   ├── /vyvoz-musora-chastnyj-sektor/
│   ├── /vyvoz-tko/, /vyvoz-tbo/
│   ├── /vyvoz-stroitelnogo-musora/
│   └── /vyvoz-musora-bunkerom/
│
├── /vyvoz-musora-[okrug]/          # **9 округов Москвы (плоско на корне)**
│   ├── /vyvoz-musora-cao/, /vyvoz-musora-sao/, /vyvoz-musora-svao/
│   ├── /vyvoz-musora-szao/, /vyvoz-musora-vao/, /vyvoz-musora-juao/
│   ├── /vyvoz-musora-juvao/, /vyvoz-musora-juzao/, /vyvoz-musora-zao/
│   │
│   └── # окружные посадочные имеют до 17 sub-URL по типам мусора:
│       /vyvoz-musora-sao/[17 sub], /vyvoz-musora-svao/[13 sub], /vyvoz-musora-cao/[11 sub]
│       (programmatic okrug × type, ~40+ URL)
│
├── /vyvoz-musora-[city]/           # **13 городов МО на корне**
│   ├── /vyvoz-musora-balashiha/
│   ├── /vyvoz-musora-himki/
│   ├── /vyvoz-musora-domodedovo/
│   ├── /vyvoz-musora-dolgoprudnyj/
│   ├── /vyvoz-musora-dzerzhinskij/
│   ├── /vyvoz-musora-klimovsk/
│   ├── /vyvoz-musora-kommunarka/
│   ├── /vyvoz-musora-korolev/
│   └── ... (Реутов, Подольск, Видное, Лобня, Мытищи, Одинцово, etc.)
│
├── /arenda-musornogo-kontejnera/
├── /kontejner-dlja-stroitelnogo-musora/, /puhto-dlja-vyvoza-musora/
├── /uborka-i-vyvoz-snega/
├── /utilizacija-shin/
│
├── /stati/[slug]/                  # **59 статей блога**
└── /novosti/[slug]/                # **221 новость**
```

## Pillar-категории

3 видимых pillar:
1. **Типы вывоза** — ~25 URL на корне (стройматериалы, грунт, контейнеры)
2. **Округа Москвы** — 9 окружных URL + programmatic okrug × type (sao/svao/cao имеют sub-URL)
3. **Города МО** — 13 городских URL на корне

## Дробление подуслуг

- **2 уровня для округов** (/vyvoz-musora-sao/[type]/ — programmatic)
- 1 уровень для остального (плоско на корне)
- Сильное покрытие в 3-х округах (СВАО, САО, ЦАО) — обкатанный шаблон, но не масштабирован на все 9

## Гео-страницы

- **9 округов** Москвы
- **13 городов** МО
- **Programmatic okrug × type** в 3-х округах (~40 sub-URL)
- Слабее musor.moscow, но всё равно сильное гео-покрытие

## B2B

- **Отдельного раздела нет**
- /vyvoz-musora-iz-ofisnogo-ili-torgovogo-centra/ — implicit B2B
- /dogovor-na-vyvoz-musora/ — посадочная на договор (B2B-сигнал)
- Контент намекает на «строительные компании-девелоперы», но без отдельного хаба

## Блог

- /stati/[slug]/ — 59 статей
- /novosti/[slug]/ — 221 новость (агрегатор/автоген)

## Уникальные элементы

- ✅ Programmatic okrug × type (3 округа обкатано)
- ✅ /park-spectehniki/, /licenzija/ — E-E-A-T
- ❌ Калькулятор не выделен как отдельный URL
- ❌ Форма «фото→смета» отсутствует

## URL-паттерны

1. `/vyvoz-[type]/` — типы вывоза (корень)
2. `/vyvoz-musora-[okrug]/` — округа Москвы (корень)
3. `/vyvoz-musora-[okrug]/[type]/` — programmatic 2-й уровень для 3 округов
4. `/vyvoz-musora-[city]/` — города МО (корень)
5. `/stati/[slug]/`, `/novosti/[slug]/` — контент

**Канонический паттерн:** `stroj-musor.moscow/vyvoz-musora-[geo-or-type]/[optional-sub]/`. Партнёр / клон musor.moscow с фокусом на стройматериалы.
