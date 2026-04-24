# Programmatic landing · pattern

**Статус:** v1.0 · approved 2026-04-24
**Scope:** шаблон LP `service × district` — основа programmatic SEO Обихода. 28 seed-страниц (4 кластера × 7 пилотных районов) → расширение до 60+.

## Purpose

Каждая страница `/uslugi/<cluster>/<district>/` должна:
1. Ранжироваться в Яндексе / Google по запросу «{{ service }} в {{ district }}».
2. Быть **не дубликатом** других LP — 15-20% уникального контента (price, cases, FAQ, map).
3. Конвертировать в заявку через PhotoQuoteForm или прямой CTA.

## URL-pattern

```
/uslugi/<cluster-slug>/                  индекс услуги — «Арбористика»
/uslugi/<cluster-slug>/<district-slug>/  LP — «Арбористика в Раменском»
/rajony/<district-slug>/                 индекс района — «Услуги в Раменском»
```

**Важно:**
- Trailing slash везде (единообразно с остальным сайтом).
- `district-slug` — транслитерация по ГОСТ 7.79 (`ramenskoye`, не `ramenskoe`, не `ramenskoye-city`).
- 301-редиректы со всех старых URL при переименовании.

## Обязательные секции (порядок важен для SEO)

```
1. Breadcrumbs                  ← Главная → Услуги → Арбористика → Раменское
2. H1 + lead                    ← «Арбористика в Раменском — фикс 12 800 ₽ за объект»
3. Hero CTA                     ← «Фото → смета за 10 минут» форма или ссылка на неё
4. Services-grid (cluster)      ← 4-8 подуслуг кластера с иконками + фикс-цены
5. Local proof                  ← что именно в этом районе: кейсы, отзывы, покрытие
6. Process (4 шага)             ← «Фото → смета → договор → бригада» схема
7. Calculator (cluster)         ← интерактивный расчёт
8. FAQ (cluster × district)     ← 6-10 вопросов, часть общие часть локальные
9. Cases с пагинацией           ← кейсы в районе (если есть) + пагинация
10. Footer CTA                  ← повтор фото → смета
11. JSON-LD schemas             ← Service + LocalBusiness + BreadcrumbList + FAQPage
```

### Опциональные секции

- **Сезонный блок** — «Сейчас в Раменском: уборка снега» (зимой). Активируется через `SiteChrome.seasonalHighlight`.
- **Mini-map района** — SVG-схема района с точками выездов. Опционально (см. DistrictCard spec).
- **Видео-кейс** — если есть 1-2 видео выездов в этом районе.

## Heading hierarchy

| Уровень | Что | Пример |
|---|---|---|
| `h1` | Сам LP | `Арбористика в Раменском — фикс 12 800 ₽ за объект` |
| `h2` | Секции | `Что делаем`, `Как работаем`, `Цены`, `Кейсы в Раменском`, `Вопросы` |
| `h3` | Карточки подуслуг / статьи FAQ | `Спил деревьев`, `Корчевание пней` |
| `h4` | Под-подзаголовки в длинных FAQ | редко, только в глубоких статьях |
| `h5/h6` | НЕ использовать |

**Ровно 1 `h1`. Пропуск уровней запрещён (см. [typography.spec.md](../components/typography/typography.spec.md)).**

## SEO-контент уникальность

**Правило:** каждая LP уникальна на 15-20% минимум. Не дублируем текст между LP — Google / Яндекс накажут за scaled content.

**Что уникально на LP:**
1. H1 (включает `{{ district }}`)
2. Lead-параграф — 2-3 предложения про район + специфику услуги
3. Local proof — реальные кейсы из этого района (или плейсхолдер «будет скоро» + дата)
4. FAQ — минимум 2 вопроса локальные (например, «Сколько стоит спил берёзы в Раменском?»)
5. Map / фото района — специфичные к локации

**Что шаблонно (нормально дублировать):**
- Process (4 шага)
- Общие услуги кластера
- Legal-плашка
- Structured data

## JSON-LD schemas

**Обязательно** на каждой LP:

### 1. `Service` (главная)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Арбористика",
  "name": "Арбористика в Раменском",
  "provider": { "@type": "LocalBusiness", "@id": "https://obikhod.ru/#org" },
  "areaServed": { "@type": "City", "name": "Раменское" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "RUB",
    "price": "12800",
    "priceSpecification": { "@type": "UnitPriceSpecification", "unitCode": "C62", "unitText": "объект" }
  }
}
```

### 2. `LocalBusiness` (global, один на весь сайт, referenced by `@id`)

Живёт в site-wide layout, не повторяется на каждой LP:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://obikhod.ru/#org",
  "name": "Обиход",
  "image": "https://obikhod.ru/icon-512.png",
  "telephone": "+79851705111",
  "address": { "@type": "PostalAddress", "addressRegion": "Московская область" },
  "areaServed": ["Раменское", "Одинцово", "Красногорск", "Мытищи", "Химки", "Истра", "Пушкино"],
  "priceRange": "от 12 800 ₽"
}
```

### 3. `BreadcrumbList`

См. [breadcrumbs.spec.md §JSON-LD](../components/breadcrumbs/breadcrumbs.spec.md).

### 4. `FAQPage`

Только если на странице есть FAQ-секция:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Сколько стоит спил берёзы в Раменском?",
      "acceptedAnswer": { "@type": "Answer", "text": "Фикс 12 800 ₽ за объект. Срок..." }
    }
  ]
}
```

## Canonical rules

- **Страница 1 (нет пагинации):** canonical = self, без query/fragment.
- **Пагинация внутри LP** (кейсы, блог района): [pagination.spec.md §Canonical](../components/pagination/pagination.spec.md).
- **Дубликаты кластеров в двух районах:** canonical НЕ перекидывается между LP разных районов (они уникальны).
- **www vs non-www:** сайт на non-www (`https://obikhod.ru/`). 301 с www.
- **Trailing slash consistency** — все URL заканчиваются на `/`.

## Noindex rules

Ставим `<meta name="robots" content="noindex, follow">` когда:
- **Район-заглушка** (< 3 кейсов + базовый контент = дубликат) — до накопления контента.
- **Староgenerated page** после перехода бренда на новую схему.
- **Пагинация страница 100+** (deep pagination) — noindex, чтобы не тратить crawl budget.

## Metadata Next.js

```tsx
// app/uslugi/[cluster]/[district]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cluster, district } = await params
  const data = await getLPData(cluster, district)

  return {
    title: `${data.serviceName} в ${data.districtName} — фикс ${data.price} ₽ за объект · Обиход`,
    description: `${data.serviceName} в ${data.districtName}. Смета за 10 минут по фото. Фикс-цена ${data.price} ₽ за объект. Штрафы ГЖИ/ОАТИ берём по договору.`,
    alternates: { canonical: `/uslugi/${cluster}/${district}/` },
    openGraph: {
      title: `${data.serviceName} в ${data.districtName}`,
      description: `Фикс-цена ${data.price} ₽ за объект. Смета за 10 минут.`,
      images: [`/api/og?service=${cluster}&district=${district}`], // см. og-image.md
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.serviceName} в ${data.districtName}`,
      images: [`/api/og?service=${cluster}&district=${district}`],
    },
    robots: data.casesCount < 3 ? { index: false, follow: true } : { index: true, follow: true },
  }
}
```

## Generate static params

```tsx
export async function generateStaticParams() {
  const services = await payload.find({ collection: 'services', limit: 100 })
  const districts = await payload.find({ collection: 'districts', limit: 100 })

  // Pre-render только seed-пары (4 × 7 = 28 LP).
  // Остальные комбинации — ISR по запросу.
  return services.docs.flatMap((s) =>
    districts.docs
      .filter((d) => d.tier === 'pilot')
      .map((d) => ({ cluster: s.slug, district: d.slug })),
  )
}

export const dynamicParams = true   // разрешаем ISR для новых районов
export const revalidate = 3600       // 1 час
```

## Core Web Vitals targets

- **LCP ≤ 2.5s** — hero image + h1 критично. Используем `<Image priority>` + `preload`.
- **CLS ≤ 0.1** — все картинки с width/height, skeleton для dynamic content.
- **INP ≤ 200ms** — Hydration минимальная, большинство — Server Components.

Lighthouse a11y / seo / perf / best-practices ≥ 90 на всех LP — gate в CI.

## Interlinking

**Внутренняя перелинковка** — критично для programmatic SEO:
- LP района → другие LP того же района (sidebar или footer-блок «Другие услуги в Раменском»)
- LP района → соседний район по тому же сервису («Арбористика в соседних районах: Одинцово, Жуковский»)
- Статьи блога → релевантные LP через authored content

## Anti-patterns

- ❌ Один и тот же контент на всех LP (scaled content) — Google наказывает
- ❌ `h1` с ключевым словом-сборкой «Арбористика-крыши-мусор-демонтаж в Раменском»
- ❌ Footer-блок «Все районы» на 28 ссылок — перекачка anchor'ов, спам
- ❌ Hidden content для SEO (`display: none` с ключевыми словами)
- ❌ Doorway pages (страницы-заглушки) — Google наказывает

## Integration

- **Payload:** collections `Services`, `Districts`, `ServiceDistricts` (связь many-to-many с override полей для уникальности).
- **Backend:** `getLPData(cluster, district)` подтягивает + merge Services + Districts + ServiceDistricts + Cases.
- **Rendering:** Server Component App Router, ISR 1 час.
- **Revalidation:** POST `/api/revalidate?tag=service-district` при изменении Payload — инвалидирует кеш.

## DoD

- [x] URL-pattern
- [x] Обязательные секции и порядок
- [x] Heading hierarchy
- [x] Content uniqueness rules (15-20%)
- [x] JSON-LD schemas (4 типа)
- [x] Canonical + noindex rules
- [x] Metadata + generateStaticParams код-шаблон
- [x] CWV targets + Lighthouse 90+
- [x] Interlinking strategy
- [ ] Реализация — **US fe2** «LP-шаблон `/uslugi/arboristika/ramenskoye/`»
- [ ] SEO-тест в CI: structured-data-testing-tool + Lighthouse CI — TODO
- [ ] A/B-тест порядка секций после 1000 посетителей — `seo1` / `aemd`
