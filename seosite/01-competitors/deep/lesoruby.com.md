# lesoruby.com

**Дата сканирования:** 2026-04-25
**Услуги в каталоге:** арбо-only (узкий: спил/обрезка/укрепление/расчистка)

## Sitemap / IA

- Sitemap-индекс: 6 sub-sitemaps (misc, category, works, reviews, post, page)
- WordPress, актуальный (lastmod 2025)
- 127 URL, плоская структура

```
lesoruby.com/
├── /
├── /about/                           # о компании
├── /about/obraz-zhizni-speleologiya/ # подстраница о компании (спелеология — ниша)
├── /contacts/, /contact_test/
├── /testimonials/                    # отзывы
│
├── /[service-slug]/                  # услуги плоско
│   ├── /udalenie-derevev/
│   ├── /valka-derevev/
│   ├── /spil-topolya/
│   ├── /vyrubka-suhih-derevev/
│   ├── /ukreplenie-derevev/
│   ├── /chistka-krysh-ot-snega-naledi-i-sosulek/  # снег — единственный URL вне арбо
│   └── (другие — обзорная страница /uslugi/)
│
├── /articles/                         # листинг блога
├── /articles/[topic]-[date]/          # 48 URL блога с датой в slug
│   ├── /chto-takoe-arboristika-14-02-2017/
│   ├── /spil-derevev-v-balashihe-17-01-2017/
│   ├── /spil-derevev-v-mytishhah-13-11-2016/
│   ├── /spil-derevev-v-ramenskom-rajone-mo-10-11-2016/
│   ├── /spil-derevev-v-poselke-zhavoronki-10-06-2016/
│   ├── /spil-derevev-pod-solnechnogorskom-10-06-2016/
│   ├── /udalenie-derevev-v-sergievom-posade-25-07-2017/
│   ├── /osobennosti-udaleniya-derevev-v-serpuhovskom-rajone-22-05-2017/
│   ├── /nyuansy-udaleniya-derevev-v-moskovskoj-oblasti-06-02-2018/
│   └── ... (статьи как косвенные гео-посадочные)
│
├── /projects/             # 26 кейсов в портфолио
│
├── /en/                   # 25 URL — английская версия (редкость в нише!)
│   ├── /en/articles-en/[slug]/
│   ├── /en/company/
│   ├── /en/additional-services/
│   └── ...
```

## Pillar-категории

Узкая специализация в арбо:
1. Удаление деревьев (главный)
2. Укрепление деревьев
3. Омолаживающая обрезка
4. Санитарная обрезка
5. Дробление и корчевка пней
6. Расчистка участков
+ /chistka-krysh-ot-snega-naledi-i-sosulek/ — единственная не-арбо

## Дробление подуслуг

- **1 уровень** (плоско)
- Семантика дублируется в blog-статьях с гео-меткой («спил деревьев в [город]»)
- Нет programmatic-структуры — гео живёт как темы статей блога

## Гео-страницы

- **Programmatic гео-страниц нет**, но статьи блога играют их роль:
  - `/articles/spil-derevev-v-balashihe-17-01-2017/`
  - `/articles/spil-derevev-v-mytishhah-13-11-2016/`
  - `/articles/spil-derevev-v-ramenskom-rajone-mo-10-11-2016/`
  - `/articles/udalenie-derevev-v-sergievom-posade-25-07-2017/`
  - И т.д. — ~10-15 названий городов МО зафиксированы в slug-ах статей
- Дата в slug — антипаттерн SEO (свежесть страницы выглядит старой)

## B2B

- **Отдельного раздела нет**
- В контенте упоминаний об УК/ТСЖ не видно

## Блог

- /articles/ — 48 статей в sitemap
- Темы: техники валки, законодательство (порубочный билет), особенности удаления, кронирование, конкретные кейсы по районам

## Уникальные элементы

- ✅ **Английская версия** /en/ — единственный среди 15
- ✅ Кейсы в портфолио (/projects/, 26 шт)
- ✅ Раздел /about/obraz-zhizni-speleologiya/ — необычный лайфстайл-фрейм компании (брендирует через спелеологию)
- ❌ Калькулятор отсутствует
- ❌ «Фото→смета» отсутствует

## URL-паттерны

1. `/[slug]/` — услуги
2. `/articles/[slug-with-date]/` — блог с датой
3. `/projects/[slug]/` — кейсы
4. `/en/[mirror]/` — английская версия

**Канонический паттерн:** `lesoruby.com/[slug]/` или `/articles/[slug-DD-MM-YYYY]/`. Старая школа, но есть EN-версия.
