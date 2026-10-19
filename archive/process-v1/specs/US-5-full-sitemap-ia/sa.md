# US-5 — sa.md (System Architect / `seo2` lead)

**Эпик:** US-5 full-sitemap-ia · Linear [OBI-2](https://linear.app/samohyn/issue/OBI-2)
**Фаза:** sa (после intake / ba)
**Дата:** 2026-04-25
**Автор:** `seo2` (tech-SEO + Schema.org + canonical) с поддержкой `sa` (модель Payload), `seo1` (semantic-core hand-off), `tamd` (ADR на blocks-pattern)
**Hand-off вход:** [seosite/04-url-map/sitemap-tree.md v0.4](../../../seosite/04-url-map/sitemap-tree.md), [seosite/04-url-map/decisions.md](../../../seosite/04-url-map/decisions.md) (ADR-uМ-01..18 закрыты)

---

## 1. Контекст

US-4 дал полное семантическое ядро (1601 ключ, 7 pillar, wsfreq Москва+МО) и URL-карту v0.4 (~330 URL в волне 1, ~2350 в полном покрытии). Q-14 закрыт оператором — порядок pillar **Вывоз мусора → Арбо → Крыши → Демонтаж** утверждён в [CLAUDE.md](../../../CLAUDE.md) immutable.

US-5 превращает URL-карту в **технический контракт сайта**: миграции БД, sitemap.xml + robots.txt + canonical-политика, schema-карта, breadcrumbs, lastmod, redirects, ADR на блочную модель (новая вводная оператора 2026-04-24 — header + blocks[] + footer).

---

## 2. Scope (must)

### REQ-5.1 — sitemap.xml автогенерация

Текущее состояние: [site/app/sitemap.ts](../../../site/app/sitemap.ts) после OBI-12 (PR #26/#27/#29/#31) отдаёт `pillar + ServiceDistricts + districts hubs`. Расширить под v0.4:

- **Источник истины:** Payload коллекции (`Services`, `ServiceDistricts`, `Districts`, `Cases`, `Blog`, `B2BPages`, `Authors`).
- **priority по wsfreq pillar:**
  - `/vyvoz-musora/` → 1.0
  - `/arboristika/` → 0.9
  - `/chistka-krysh/` → 0.7 (после миграции slug)
  - `/demontazh/` → 0.6
  - sub-services → 0.6–0.8 (по wsfreq head)
  - programmatic district → 0.5 (после publish-gate)
  - `/foto-smeta/`, `/raschet-stoimosti/` → 0.8
  - blog → 0.5
- **changefreq:** pillar=weekly, sub=monthly, programmatic=monthly, blog=weekly.
- **lastmod:** `updatedAt` из Payload.
- **Фильтр:** `_status === 'published'`, без `/lp/*`, `/admin/*`, `/api/*`.
- **Регрессия:** [site/tests/e2e/sitemap.spec.ts](../../../site/tests/e2e/sitemap.spec.ts) (расширить — `priority`, `changefreq`, lastmod-format ISO 8601).

### REQ-5.2 — robots.txt

- `Disallow: /admin/`, `/api/`, `/lp/`, `/_next/`, `/static/`.
- `Host: obikhod.ru` (для Я.Вебмастер).
- `Sitemap: https://obikhod.ru/sitemap.xml`.
- `User-agent: *` + явный `User-agent: Yandex` (один блок, можно скопировать).
- Разместить в [site/app/robots.ts](../../../site/app/robots.ts) (Next.js metadata route).

### REQ-5.3 — Миграция slug `ochistka-krysh` → `chistka-krysh` (ADR-uМ-13)

Это первое настоящее изменение БД-канона на проде → blast-radius средний.

**Шаги:**
1. **Payload migration** в `site/migrations/<timestamp>-rename-ochistka-to-chistka.ts`:
   - `UPDATE services SET slug = 'chistka-krysh' WHERE slug = 'ochistka-krysh'`
   - `UPDATE service_districts SET service_slug = 'chistka-krysh' WHERE service_slug = 'ochistka-krysh'` (если такой паттерн в коллекции)
   - Sub-services: `chistka-krysh-chastnyy-dom`, `chistka-krysh-mkd`, `sbivanie-sosulek` остаются (уже корректны).
2. **Сидер** [site/app/api/seed/route.ts](../../../site/app/api/seed/route.ts) — заменить все литералы `ochistka-krysh` → `chistka-krysh`.
3. **Коллекция Redirects** — добавить запись:
   - from: `/ochistka-krysh/(.*)` → to: `/chistka-krysh/$1` (regex), статус 301
   - **`be3` ответственный** (Payload Redirects плагин).
4. **Регенерация sitemap.xml** после миграции (автоматом — sitemap читает из БД).
5. **Я.Вебмастер инструмент «Изменение URL»** — оператор подтверждает в UI после деплоя (out-of-band).
6. **QA** — `qa1` snapshot 10 районных URL до/после, проверка 301 chain (`curl -I`).

**Откат (rollback):** обратная миграция `chistka-krysh` → `ochistka-krysh` + Redirects удалить + Я.Вебмастер «Изменение URL» отменить (24-часовое окно).

### REQ-5.4 — Canonical-политика

Каждая публичная страница имеет `<link rel="canonical" href="...">`:
- Без UTM (`utm_*` параметры стрипуются на server-render).
- Без trailing-slash variants — единая форма с trailing slash (соответствует текущему [site/next.config.ts](../../../site/next.config.ts) `trailingSlash: true`).
- На programmatic ServiceDistricts canonical = собственный URL, **не** pillar (защита от каннибализации).
- На `/lp/*` — `<meta name="robots" content="noindex,nofollow">` + canonical на самого себя (для Я.Метрики).
- На фильтрованных листингах (`?district=X` если будут) — canonical на чистый URL без query.

**Реализация:** Next.js metadata API в `app/<route>/page.tsx` через `generateMetadata`. Шаблон в `site/lib/seo/canonical.ts` (новый модуль — `seo2` пишет, `be4` ревью).

### REQ-5.5 — Schema.org карта

| Страница | Schema |
|---|---|
| `/` | `Organization` + `WebSite` + `LocalBusiness` (агрегирующая карточка) + `BreadcrumbList` |
| `/o-kompanii/`, `/komanda/`, `/kontakty/` | `Organization` + `BreadcrumbList` |
| `/vyvoz-musora/` (и любая pillar) | `Service` (с `serviceType`, `areaServed`, `provider` → `Organization`) + `BreadcrumbList` |
| `/vyvoz-musora/<sub>/` | `Service` (более узкий `serviceType`) + `BreadcrumbList` |
| `/vyvoz-musora/<sub>/<district>/` | `Service` + `LocalBusiness` (district-scoped) + `FAQPage` (если localFaq ≥ 2) + `BreadcrumbList` |
| `/raiony/<district>/` | `LocalBusiness` (с `address` района) + `BreadcrumbList` |
| `/avtory/<slug>/` | `Person` (с `jobTitle`, `knowsAbout`, `sameAs`) + `BreadcrumbList` |
| `/blog/<slug>/` | `Article` (с `author` → `/avtory/<slug>/`, `datePublished`, `dateModified`) + `BreadcrumbList` |
| `/kejsy/<slug>/` | `Article` + опционально `Review` (если есть рейтинг от заказчика) + `BreadcrumbList` |
| `/foto-smeta/`, `/raschet-stoimosti/` | `Service` + `BreadcrumbList` |
| `/b2b/uk-tszh/` (и любая B2B) | `Service` (с `audience: BusinessAudience`) + `FAQPage` (для B2B FAQ) + `BreadcrumbList` |

**Реализация:** один модуль `site/lib/seo/jsonld.ts` с factory-функциями (`organizationJsonLd()`, `serviceJsonLd(service, district?)`, и т.д.). Тесты — `site/tests/unit/seo/jsonld.spec.ts` (snapshot + JSON-LD валидатор schema.org).

### REQ-5.6 — BreadcrumbList на всех страницах

- **Источник:** иерархия URL (`/vyvoz-musora/staraya-mebel/odincovo/` → 4 уровня: Главная → Вывоз мусора → Старая мебель → Одинцово).
- **Render:** видимый компонент `<Breadcrumbs />` в шапке страницы + JSON-LD `BreadcrumbList` для Schema.org (две ноги одного источника).
- **Текстовое поле override** в Payload (`breadcrumbLabel` на коллекциях) — для случаев, когда H1 длинный, а в крошках надо короче.
- **Регрессия:** `qa1` Playwright — на 10 sample URL проверка `<nav aria-label="breadcrumbs">` + JSON-LD `@type: BreadcrumbList`.

### REQ-5.7 — Новые поля в Payload (be4 + sa)

Согласно [intake.md](intake.md) §3 — добавить в коллекции `Services`, `ServiceDistricts`, `Pages`, `B2BPages`, `Cases`, `Blog`:

| Поле | Тип | Where | Назначение |
|---|---|---|---|
| `seoTitleOverride` | text | везде | если пусто — генерируется из шаблона |
| `seoDescriptionOverride` | textarea | везде | то же |
| `h1Override` | text | везде | для случая H1 ≠ title |
| `canonicalOverride` | text | везде | редкий — для cross-canonical с `/lp/*` |
| `robotsDirectives` | select multi | везде | `index/noindex`, `follow/nofollow`, `noarchive` |
| `breadcrumbLabel` | text | везде | короткое имя в breadcrumbs (если H1 длинный) |
| `faqJsonLd` | array of {question, answer} | Services, ServiceDistricts, B2BPages | для `FAQPage` schema |
| `lastReviewedAt` | date | Blog, Cases, B2BPages | E-E-A-T сигнал «обновлено» |
| `reviewedBy` | relationship → Authors | то же | E-E-A-T автор-эксперт |

**Миграция:** одна миграция `<timestamp>-add-seo-override-fields.ts` (be4 пишет, dba ревью), без `ALTER TABLE … OWNER TO …` (см. learnings 2026-04-23).

### REQ-5.8 — ADR на блочную модель страниц (tamd lead)

Новая вводная оператора 2026-04-24 (см. [OBI-2 описание](https://linear.app/samohyn/issue/OBI-2)) — **header + blocks[] + footer**. Wave 1 в US-3 уже добавила 5 типов блоков (Hero, TextContent, LeadForm, CtaBanner, Faq), осталось 10 ([OBI-10](https://linear.app/samohyn/issue/OBI-10)).

**ADR-0003 (tamd):** выбрать паттерн блочной модели:
- A. Payload `blocks[]` field (текущий подход US-3 волны 1) — type-safe, Tailwind-render через map.
- B. Lexical-richtext c custom blocks — гибче для cw, сложнее в render.
- C. Гибрид — структурные блоки (Hero, Calc, Form) через `blocks[]`, текст-секции через Lexical.

**Default:** A (продолжаем US-3 волну 1). ADR должен подтвердить или сменить.

**Срок:** до старта US-6 (контент-производство).

### REQ-5.9 — Hreflang — НЕ применяем

Сайт ru-RU only, МО+Москва. Hreflang не нужен. Если появится СПб-зеркало (см. ADR-uМ-12 резерв) — добавим в M3+.

### REQ-5.10 — Pagination на listing-страницах

- `/blog/?page=2`, `/kejsy/?page=2` — `<link rel="next">` / `<link rel="prev">` (хотя Google deprecated, Яндекс продолжает использовать).
- canonical на page=1 → чистый URL без `?page=`.
- Page 2+ canonical → собственный URL с `?page=N`.

### REQ-5.11 — Изображения и `og:image`

- Все pillar-страницы и programmatic — generated `og-image` через `next/og` (динамический, шаблон `site/app/og-image/route.tsx`).
- Размер 1200×630, JPG/PNG.
- Alt-текст обязателен на изображениях в Payload Media (UI-валидация).
- WebP fallback через `<picture>`.

### REQ-5.12 — Тесты (qa1)

- E2E Playwright `site/tests/e2e/sitemap-ia.spec.ts`:
  - sitemap.xml содержит 10 sample URL из v0.4 sitemap-tree
  - canonical → собственный URL (не пустой, не дублирует pillar)
  - BreadcrumbList присутствует и совпадает с URL-иерархией
  - Schema.org `Organization` на `/`
  - Schema.org `Service` + опционально `LocalBusiness` на programmatic
- Unit-тесты — `site/tests/unit/seo/jsonld.spec.ts`, `site/tests/unit/seo/canonical.spec.ts`.

---

## 3. Out of scope (US-5)

- **Контент** — это US-6 (cw, lp).
- **Фичи** (калькулятор, форма фото→смета, amoCRM) — US-8.
- **Реальный SEO-аудит и Я.Вебмастер настройка** — US-7 + US-10.
- **Hreflang** (ru-RU only).
- **Sitemap-index с разделением по pillar** — пока один файл, разбиение появится при ≥ 50 000 URL (далеко за полным покрытием).

---

## 4. План работ (sa)

| # | Задача | Owner | Зависит от |
|---:|---|---|---|
| 1 | ADR-0003 — блочная модель страниц | tamd | — |
| 2 | Миграция Payload + новые SEO-override поля | be4 + dba | ADR-0003 |
| 3 | Sitemap.xml + robots.txt + canonical модуль | seo2 + be4 | (1)–(2) |
| 4 | Миграция slug `ochistka-krysh` → `chistka-krysh` + Redirects | be3 + dba | (2) |
| 5 | Schema.org factory module + JSON-LD на pillar | seo2 + fe1 | (3) |
| 6 | Breadcrumbs компонент + JSON-LD | fe1 + seo2 | (5) |
| 7 | E2E sitemap-ia.spec.ts + unit-тесты | qa1 | (3)–(6) |
| 8 | CR review | cr | весь scope |
| 9 | Acceptance | оператор → out | (8) |

**Параллель:** (3) и (4) можно делать параллельно после (2). (5) и (6) — параллельно после (3).

---

## 5. AC (acceptance criteria) для US-5

- [ ] sitemap.xml содержит **все pillar (4)** + **все sub-services (≥ 30)** + **все ServiceDistricts × 8 districts** + `/foto-smeta/` + `/raschet-stoimosti/` + B2B + блог (если seed-статьи есть) + кейсы.
- [ ] robots.txt отдаёт корректные директивы, проверка `curl -fsSL https://obikhod.ru/robots.txt` валидна.
- [ ] Миграция slug на проде успешна, `/chistka-krysh/` отдаёт 200, `/ochistka-krysh/` отдаёт 301 → `/chistka-krysh/`.
- [ ] Я.Вебмастер: «изменение URL» подано оператором, 0 ошибок индексации.
- [ ] Каждая публичная страница имеет canonical, BreadcrumbList в HTML + JSON-LD.
- [ ] Schema.org Organization, Service, LocalBusiness, FAQPage, Article, Person, BreadcrumbList — выводятся по схеме REQ-5.5.
- [ ] [ServiceDistricts](../../../site/src/collections/ServiceDistricts.ts) publish-gate (miniCase + ≥2 localFaq) сохраняется (не теряется при добавлении новых SEO-полей).
- [ ] E2E `site/tests/e2e/sitemap-ia.spec.ts` проходит на CI и на prod (smoke).
- [ ] Lighthouse SEO score ≥ 95 на 3 sample URL (`/`, `/vyvoz-musora/`, `/arboristika/spil-derevev/odincovo/`).
- [ ] Я.Вебмастер «Качество сайта» не ухудшилось vs baseline до релиза.

---

## 6. Риски

| Риск | Вероятность | Митигация |
|---|---|---|
| Миграция slug сломает live ServiceDistricts URLs | средняя | dry-run на dev-копии БД, prod-backup перед миграцией (есть `prod-backup.yml`), Redirects 301 покрывает 100% старых URL |
| Я.Вебмастер задерживает реиндексацию после URL change | высокая | подаём «Изменение URL» через инструмент Я.Вебмастер сразу после деплоя, sitemap.xml lastmod обновляется автоматом |
| Schema.org validator находит ошибки | средняя | unit-тесты + локальная проверка через `https://validator.schema.org/` на 5 sample URL до прод-деплоя |
| `unstable_cache` снова съест данные (повтор OBI-16) | низкая | cache layer убран в OBI-16, регрессия в `site/tests/e2e/site-chrome.spec.ts` |
| Bundle size растёт от schema/canonical модулей | низкая | модули server-only (Next.js metadata API), не идут в client bundle |

---

## 7. Hand-off

### → ba (US-5)
intake → ba (заполнить scope, AC, конкретику Q1–Q7 → закрыть с opraкаком оператора если нужно).

### → po (US-5)
Подтвердить scope «sitemap + canonical + schema + breadcrumbs + миграция chistka» в один спринт vs разбить на 2.

### → tamd
ADR-0003 на блочную модель — до старта US-6.

### → be3 / be4 / dba
Миграции (slug + SEO-fields). Отдельный PR на миграцию = атомарный rollback.

### → fe1 + seo2
Schema.org + Breadcrumbs модули.

### → qa1
E2E `sitemap-ia.spec.ts` + unit-тесты.

### → cr
Review всего диффа после QA.

### → out
Acceptance + release-notes.

---

## 8. Источники

- [seosite/04-url-map/sitemap-tree.md v0.4](../../../seosite/04-url-map/sitemap-tree.md) — URL-карта APPROVED
- [seosite/04-url-map/decisions.md](../../../seosite/04-url-map/decisions.md) — 18 ADR закрыты
- [seosite/03-clusters/_summary.json](../../../seosite/03-clusters/_summary.json) — wsfreq baseline для priority
- [CLAUDE.md](../../../CLAUDE.md) — immutable порядок pillar (обновлён 2026-04-25)
- [site/app/sitemap.ts](../../../site/app/sitemap.ts) — текущая реализация (после OBI-12)
- [site/app/api/seed/route.ts](../../../site/app/api/seed/route.ts) — canonical slug в БД
- [Linear OBI-2](https://linear.app/samohyn/issue/OBI-2)
