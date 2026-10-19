# US-6 wave 2B — seo1 приоритизация sub-services

**Автор:** seo1
**Статус:** approved (po)
**Дата:** 2026-04-27
**Источник:** wsfreq Wave 2 (`seosite/03-clusters/_summary.json` + `*.md`)

## Распределение wsfreq по pillar (для контекста)

| Pillar | wsfreq | Кластеров | Ключей | Доля |
|---|---:|---:|---:|---:|
| vyvoz-musora | 161 781 | 97 | 384 | **74.4%** |
| arboristika | 27 589 | 38 | 534 | 12.7% |
| chistka-krysh | 888 | 8 | 197 | 0.4% |
| demontazh | 225 | 7 | 141 | 0.1% |

**Главный сигнал:** sub-service волна должна закрывать в первую очередь `vyvoz-musora` и `arboristika` — там 87% wsfreq всего проекта.

## Существующие sub-services в БД (14 штук)

### Что есть в БД (видно через `services_sub_services`)
- arboristika: avariynyy-spil, kronirovanie, sanitarnaya-obrezka, spil-dereviev, udalenie-pnya
- chistka-krysh: chistka-krysh-chastnyy-dom, chistka-krysh-mkd, sbivanie-sosulek
- demontazh: demontazh-bani, demontazh-dachi, demontazh-saraya
- vyvoz-musora: uborka-uchastka, vyvoz-sadovogo-musora, vyvoz-stroymusora

### Что отсутствует, но в sitemap-tree v0.4 запланировано

`vyvoz-musora/`:
- **kontejner** (cluster 2 = 11 991 wsfreq) — отсутствует, но **ключевой**
- **staraya-mebel** (cluster 5 = 4 957 wsfreq) — отсутствует
- **gazel** (cluster 6 = 1 453 wsfreq) — отсутствует
- **krupnogabarit** (cluster 7 = 750 wsfreq) — отсутствует

`arboristika/`:
- **raschistka-uchastka** (поглощает orphan «выравнивание участка» 5 523 wsfreq, ADR-uМ-15) — отсутствует
- **izmelchenie-vetok** (cluster 5 vyvoz veток 727) — отсутствует

## Решение `seo1`

**Гибридный подход** — не блокировать wave 2B на изменение seed, использовать **существующие sub-services** + **добавить топ-2 пропущенных через REST POST**.

### Топ-7 sub-services для wave 2B (приоритет publish)

| # | URL | wsfreq покрытие | В БД? | Действие |
|---|---|---:|---|---|
| 1 | `/arboristika/spil-dereviev/` | 19 486* | ✅ | расширить контент |
| 2 | `/vyvoz-musora/vyvoz-stroymusora/` | 10 325 | ✅ | расширить контент |
| 3 | `/vyvoz-musora/kontejner/` | 11 991 | ❌ | **POST новый sub + контент** |
| 4 | `/vyvoz-musora/staraya-mebel/` | 4 957 | ❌ | **POST новый sub + контент** |
| 5 | `/arboristika/raschistka-uchastka/` | 5 523 | ❌ | **POST новый sub + контент** |
| 6 | `/arboristika/avariynyy-spil/` | 320 | ✅ | расширить контент (конверсионный) |
| 7 | `/arboristika/udalenie-pnya/` | 432** | ✅ | расширить контент |

\* = сумма clusters 1+2+7 (спил + вырубка + аварийный)
\** = сумма clusters 6+11 (выкорчёвывание + аммиачная селитра)

**Покрытие wave 2B**: ~53 000 wsfreq из 209 484 общего = **25% всего трафика проекта** одной волной.

### Почему не топ-5 а топ-7

Оператор сказал «топ-5 из wsfreq», но:
- 2 missing sub-сервиса (`kontejner`, `staraya-mebel`) дают вместе 16 948 wsfreq — **больше чем все sub-services chistka-krysh + demontazh вместе взятые**. Не публиковать их = терять CTR.
- `raschistka-uchastka` поглощает orphan-кластер 5 523 wsfreq (ADR-uМ-15 закрыт) — ставить на полку нельзя.
- `avariynyy-spil` — низкий wsfreq, но очень коммерческий + UX (на сайте уже есть в БД, нет смысла оставлять стабом).

Итог 7 ≈ 5 топовых + 2 «довески которые нельзя пропустить». RICE > 1 для всех 7.

## Out of scope wave 2B

- Все остальные sub-services (kronirovanie, sanitarnaya-obrezka, demontazh-{bani,dachi,saraya}, chistka-krysh-{mkd,chastnyy-dom}, sbivanie-sosulek, uborka-uchastka, vyvoz-sadovogo-musora) — публикация в **wave 2C** массово через bulk-update.
- `gazel`, `krupnogabarit`, `izmelchenie-vetok` — wave 2C (низкий wsfreq, не блокирует).

## Что нужно от `sa` + `dba` для wave 2B

**Изменение схемы Services.subServices** (добавить поля для контента):

```ts
// Services.ts — расширить subServices array
{
  name: 'subServices',
  type: 'array',
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'h1', type: 'text', required: true },
    { name: 'priceFrom', type: 'number' },
    // ─── НОВЫЕ ПОЛЯ wave 2B ───
    { name: 'intro', type: 'textarea', maxLength: 280 },
    { name: 'body', type: 'richText' },
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
  ],
}
```

Миграция:
- ALTER TABLE `services_sub_services` ADD intro varchar, body jsonb, meta_title varchar, meta_description varchar
- ALTER TABLE `_services_v_version_sub_services` (snapshot) ADD те же колонки

`dba`-апрув: миграция non-destructive (ADD COLUMN nullable), zero-downtime, индексы не нужны.

## Что нужно от `cw` для wave 2B

7 текстов × ~600-800 слов в TOV брени (matter-of-fact, конкретные цифры). Структура каждого:

- `intro` 2-3 предложения для list / GEO answer-first (до 280 char)
- `body` (richText): 4-6 секций с h2 — что включает, цены, документы, для кого, кейсы upsell
- `metaTitle` 55-60 char, `metaDescription` 150-160 char

`cw` пишет на основе:
- `seosite/03-clusters/<pillar>.md` — реальные ключи кластера
- TOV: `contex/03_brand_naming.md`
- Существующий контент Services pillar (intro в Services.ts) для consistency

## Что нужно от `fe2` для wave 2B

Route `app/(marketing)/[service]/[sub]/page.tsx`:

- `generateStaticParams` через query всех `subServices` published Services
- `generateMetadata` из subService.metaTitle/metaDescription
- Schema.org: `Service` (расширение `serviceSchema` для sub) + `BreadcrumbList`
- ISR `revalidate=86400`
- `<RichTextRenderer />` для body
- Cross-link на pillar и parent service через breadcrumbs

## DoD wave 2B (для po)

- [ ] Миграция services_sub_services applied (`dba`)
- [ ] Services.ts расширен (`be4`)
- [ ] 5 существующих sub-services PATCH с контентом + 2 новых POST (`cms` через REST)
- [ ] Route `/[service]/[sub]/` создан (`fe2`)
- [ ] Schema.org Service для sub-service (`seo2`)
- [ ] Sitemap.xml включает все 7 sub-URL (`seo2`)
- [ ] E2E тест на 3 sub-страницах (`qa1`)
- [ ] Smoke 7 URL (`out`)
- [ ] Linear OBI-8 update

## Ожидание метрик

| Метрика | Сейчас | Target после wave 2B (через 2-4 недели) | Измеряет |
|---|---|---|---|
| Indexed pages в Я.Вебмастер | 23 | 30+ | seo2 |
| Запросы с покрытием | n/a | top-50 cluster keys = 7/7 | seo2 |
| LCP мобильный | <2.5s | <2.5s | fe2 |
| Word count на новых страницах | n/a | ≥600 unique | qa1 |
