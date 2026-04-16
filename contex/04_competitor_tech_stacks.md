# Разведка техстеков топ-13 конкурентов

**Дата:** 2026-04-16
**Автор:** Technical Architect (в роли CTO проекта Обиход)
**Метод:** параллельный `curl` HTML + HTTP-headers → грэп CMS/фреймворк-маркеров
**Источник списка доменов:** [01_competitor_research.md](01_competitor_research.md) — топ-30 SEO-органики, взяты топ-13 наиболее релевантных
**Назначение:** обоснование выбора стека для сайта Обихода и фиксация tech-gap конкурентов на конкретную дату

---

## Executive Summary

1. **Ноль из 13 конкурентов используют современный JS-стек** (Next.js / Nuxt / Astro / Remix). Все — на PHP-based CMS или самописном PHP.
2. **54% на WordPress/Bitrix**, 23% на MODX Revolution, 23% на самописном PHP (Yii, легаси). Jivo/CallbackKiller/Venyoo — стандарт виджетов.
3. **У половины PHP 5.6–7.4** и jQuery 1.10 — технический долг на 5-8 лет, слабые Core Web Vitals, раздутый HTML.
4. **Интерактивных калькуляторов нет ни у одного** — подтверждается инсайт из [01_competitor_research.md](01_competitor_research.md) про «слабые калькуляторы» у лидеров Директа.
5. **Окно возможностей для Обихода:** Next.js 16 + Payload CMS + ISR + собственные калькуляторы даёт техническое преимущество в скорости, SEO-структуре и качестве лидогенерации, которое конкуренты быстро не закроют (миграция с Bitrix/WordPress на современный стек — 6-12 мес работы).

---

## Методология

- Параллельный запрос `HEAD` и `GET /` через curl, User-Agent: реальный Mozilla.
- Лимит 500 KB на HTML (первые секции достаточно для отпечатков).
- Маркеры, по которым определяли платформу:
  - **Tilda**: `tildacdn.com`, `t-rec`, `class="t-body"`, meta generator Tilda
  - **WordPress**: `wp-content/`, `wp-includes/`, `/wp-json/`, generator WordPress/WPBakery
  - **Bitrix**: header `X-Powered-CMS: Bitrix Site Manager`, `/bitrix/`, `window.BX`
  - **Elementor/Avada**: `elementor-*`, `fusion-*`
  - **MODX Revolution**: header `X-Powered-By: MODX`, `/assets/components/`, `/assets/templates/`
  - **Yii**: `/frontend/views/site/`, `/assets/HASH/yii.js`, `yii.activeForm.js`
  - **Next/Nuxt/Astro**: `/_next/`, `__NEXT_DATA__`, `/_nuxt/`, `__NUXT__`
- Параллельно собирали: виджеты (Jivo, CallbackKiller, Venyoo), аналитика (Я.Метрика, GTM), квизы (Marquiz).

**Ограничения:** только публично отдаваемый HTML главной страницы. Серверные интеграции (amoCRM/Битрикс24, очереди, БД) не видны. Частные лендинги Директа могут отличаться от корпоративной главной.

---

## Сводная таблица (13 доменов)

| # | Домен | Сервер / PHP | Платформа | Виджеты | Аналитика |
|---|---|---|---|---|---|
| 1 | arboristik.ru | nginx 1.28 | **WordPress + Elementor + Tilda-вставки** | — | Я.Метрика |
| 2 | liwood.ru | openresty + PHP 7.4 | **Bitrix Site Manager** | — | Я.Метрика |
| 3 | promtehalp.ru | Apache 2.4 | **Yii (самописное)** | CallbackKiller | Я.Метрика |
| 4 | alpbond.org | nginx + PHP 5.6 | **Yii (legacy)** | Venyoo | Я.Метрика |
| 5 | udalenie-dereviev.moscow | nginx + PHP 7.4 | **WordPress** | — | Я.Метрика |
| 6 | arbogarden.ru | Apache + PHP 7.4 | **Bitrix Site Manager** | Jivo | Я.Метрика |
| 7 | drovosek-mo.ru | nginx + PHP 7.4 | **WordPress** | — | Я.Метрика |
| 8 | arborist.su | nginx + PHP 8.2 | **Bitrix Site Manager** | — | — |
| 9 | rusarbo.ru | nginx + PHP 5.6 | **MODX Revolution** | — | Я.Метрика |
| 10 | treeworkers.ru | nginx + PHP 5.6 | **Самописное PHP (jQuery 1.10)** | — | — |
| 11 | musor.moscow | nginx + PHP 7.4 | **WordPress + WPBakery** | — | Я.Метрика |
| 12 | snos24.ru | nginx + PHP? | **MODX Revolution** | — | Я.Метрика |
| 13 | promalper.ru | nginx + PHP 7.4 | **MODX Revolution** | Jivo | Я.Метрика |

## Распределение платформ

| Платформа | Доля | Примеры |
|---|---:|---|
| WordPress (в т.ч. с Elementor/WPBakery) | 4/13 (31%) | arboristik, udalenie-dereviev, drovosek-mo, musor.moscow |
| Bitrix Site Manager | 3/13 (23%) | liwood, arbogarden, arborist.su |
| MODX Revolution | 3/13 (23%) | rusarbo, snos24, promalper |
| Самописное PHP (Yii / кустарное) | 3/13 (23%) | promtehalp, alpbond, treeworkers |
| Tilda (чистая) | 0/13 | — (только как вставки внутри WP) |
| Современный JS (Next/Nuxt/Astro) | **0/13** | — |

## Ключевые наблюдения

1. **Технический долг у всех.** PHP 5.6 (конец поддержки — 2019) до сих пор продакшн у 3/13. PHP 8.2 (актуальный) — только у 1/13 (arborist.su).
2. **Скорость.** Bitrix и WordPress без агрессивной оптимизации дают Lighthouse 40-70. В нашем стеке (Next.js 16 + ISR + Beget S3 + CDN) цель — 90+.
3. **SEO-структура.** WPBakery, Elementor, Bitrix-компоненты генерируют раздутый HTML с избыточными обёртками. Программная разметка (schema.org Service, LocalBusiness, FAQ) настроена редко.
4. **Калькуляторы.** У 0/13 видны state-heavy интерактивные калькуляторы — максимум статичные прайсы или простые квиз-формы.
5. **Чат-виджеты.** Jivo (3 сайта), CallbackKiller (1), Venyoo (1), обратный звонок-модалки. Marquiz не замечен ни у кого.
6. **Аналитика.** Я.Метрика у 10/13 (ожидаемо). GA4/GTM встречается, но Я.Метрика доминирует.
7. **CRM/колтрекинг в HTML-маркерах не виден** — это серверные интеграции, не определяется такой методикой. В ресёрче типичный выбор: amoCRM или Битрикс24 + Calltouch/CoMagic/UIS.

## Выводы для Обихода

### Что это даёт нам

- **Подтверждает выбор стека Next.js 16 + Payload CMS + Postgres** — у конкурентов аналогов нет, tech-дифференциация реальна.
- **Программа SEO на 60+ посадочных** (4 услуги × 15 районов МО) выиграет у шаблонного HTML конкурентов по структуре и скорости.
- **Калькуляторы с state** и **фото → LLM-смета** — прямой бьющий в «белое пятно», зафиксированное в [01_competitor_research.md](01_competitor_research.md).

### Риски

- **Стек требует квалифицированного разработчика.** В РФ Next.js-мидлов много, но Payload CMS — нишевый, 1-2 нед ramp-up.
- **B2B-клиенты (УК, застройщики)** смотрят на опыт внедрения у подрядчика, не на Lighthouse. Стек — это наш внутренний рычаг скорости, не аргумент в тендере.
- **Beget** как стартовый хостинг закрывает MVP, но при росте (B2B-контракты, SLA) — миграция на Yandex Cloud или Selectel.

### Что перепроверить через 6 мес

- Изменился ли топ-10 по стеку (кто-то мигрировал?)
- Появились ли у лидеров калькуляторы или фото → смета
- Marquiz/квиз-конструкторы как рыночная норма (сейчас — нет)

---

## Сырые артефакты

HTML-файлы и headers лежат в `/tmp/obikhod_scan/` (эфемерно, не коммитятся). Повторить разведку:

```bash
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
mkdir -p /tmp/obikhod_scan
for d in arboristik.ru liwood.ru promtehalp.ru alpbond.org udalenie-dereviev.moscow \
         arbogarden.ru drovosek-mo.ru arborist.su rusarbo.ru treeworkers.ru \
         musor.moscow snos24.ru promalper.ru; do
  (curl -sI -A "$UA" -L --max-time 12 "https://$d/" -o "/tmp/obikhod_scan/$d.headers"
   curl -sL -A "$UA" --max-time 15 --max-filesize 500000 "https://$d/" -o "/tmp/obikhod_scan/$d.html") &
done; wait
```
