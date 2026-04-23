# US-1: Seed prod БД — System Analysis

**Автор:** sa
**Статус:** approved (оператор, 2026-04-23) → pending po
**Входы:** ./intake.md, ./ba.md (approved оператором 2026-04-23)
**Дата:** 2026-04-23
**Linear Issue:** OBI-TBD
**Привязка:** WORKFLOW §4 (System Analysis); ba.md §4 (14 REQ); PROJECT_CONTEXT.md §4–§5 (каталог услуг, география).

Скопе-подтверждение: 4 кластера × 7 пилотных районов = **28 записей коллекции
`service-districts`** (фактическое имя коллекции в Payload — см. §4.1 ниже);
mock-Case — 1 (существующий `snyali-pen-gostitsa-2026`); остальные 27 — `draft` +
`noindexUntilCase=true`. Миграции Payload — вне scope US-1. Placeholder-цены
трёх новых кластеров — `priceFrom: 1000` (ba.md §11).

---

## 0. Предметные уточнения (до реализации AC)

### 0.1. Фактические имена коллекций

Таблица берётся из `site/payload.config.ts` + `site/collections/*.ts`. В ba.md
использовалась обобщённая формулировка «28 LandingPages» — фактической коллекции
`LandingPages` в Payload **нет**; её роль исполняет `service-districts`
(slug коллекции в Payload). `sa` закрепляет терминологию:

| Роль | Payload slug | Файл | Примечание |
|------|--------------|------|------------|
| Корневая услуга | `services` | `site/collections/Services.ts` | versions.drafts + autosave |
| Район | `districts` | `site/collections/Districts.ts` | versions.drafts |
| Programmatic LP | `service-districts` | `site/collections/ServiceDistricts.ts` | indexes unique (service, district); beforeValidate-хук блокирует publish без miniCase и <2 localFaq |
| Кейс | `cases` | `site/collections/Cases.ts` | photosBefore/After minRows=1 |
| Эксперт/бригадир | `persons` | `site/collections/Persons.ts` | worksInDistricts[] |
| Медиа | `media` | `site/collections/Media.ts` | upload |
| SEO global | `seo-settings` | `site/globals/SeoSettings.ts` | Organization + LocalBusiness |

**Вывод для `be3/be4`:** в коде работаем с `collection: 'service-districts'`, а не
«LandingPages». Все дальнейшие AC используют этот slug.

### 0.2. Slugs кластеров услуг и районов (финализация open question из ba.md §9)

**Кластеры (4):** определены в `Districts.afterChange` hook (revalidation tags
`sd-<service>-<district>`) и в существующих seed-скриптах:

| Кластер (ba.md) | Service.slug | Подтверждение |
|---|---|---|
| арбористика | `arboristika` | `scripts/seed.ts:102`, `app/api/seed/route.ts:110`, `Districts.afterChange`:132 |
| крыши / снег | `ochistka-krysh` | `Districts.ts:132` |
| мусор | `vyvoz-musora` | `Districts.ts:132` |
| демонтаж | `demontazh` | `Districts.ts:132` |

**Районы (7):** slugs закреплены в ba.md §4 REQ-1.2 и валидируются регуляркой
`^[a-z][a-z0-9-]{2,40}$` из `Services.ts:21`:

| Район (именительный) | slug | Существует в seed | Источник |
|---|---|---|---|
| Одинцово | `odincovo` | нет | ba.md §4, seo1.md §96 (`odincovo`) |
| Красногорск | `krasnogorsk` | нет | ba.md §4 |
| Мытищи | `mytishchi` | нет | ba.md §4 |
| Химки | `khimki` | нет | ba.md §4 |
| Истра | `istra` | нет | ba.md §4 |
| Пушкино | `pushkino` | нет | ba.md §4 |
| Раменское | `ramenskoye` | **да** (scripts/seed.ts:174) | реюзаем |

Семь slug — это инвариант US-1. Если `seo1` найдёт конфликт с семядром
(например, хочет `odintsovo` vs `odincovo`) — эскалация в open question §9.

### 0.3. Где жить seed-логике: `scripts/seed.ts` vs `app/api/seed/route.ts`

В репо **два** seed-источника:

- `site/scripts/seed.ts` — CLI `pnpm seed` через `tsx --env-file=.env.local`.
  Создаёт: SeoSettings, arbo-Service, Раменское+Жуковский Districts,
  Алексея, arbo × Раменское ServiceDistrict (draft, без miniCase).
- `site/app/api/seed/route.ts` — POST-эндпоинт, authz через
  `x-revalidate-secret`. Расширяет CLI-вариант: грузит 2 placeholder-JPEG,
  создаёт mock-Case, publish-ит arbo × Раменское c miniCase.
  Комментарий в файле: *«Payload 3.83 standalone CLI ломается на @next/env
  loadEnvConfig в Next 16»* — то есть CLI-прогон исторически хрупок.

**Решение SA.** Основной источник истины US-1 — **CLI-скрипт
`site/scripts/seed.ts`**, расширенный до 4×7. Обоснование:

1. Seed = переиспользуемый актив команды (GOAL-4 ba.md §3). CLI через SSH на
   prod — стандартный паттерн для одноразовых скриптов Payload 3, проверяем
   на staging/local до prod.
2. HTTP-эндпоинт `/api/seed` в prod-сборке — **риск**: любой с утёкшим
   `REVALIDATE_SECRET` триггерит запись в БД. Вне US-1 оставляем, но `sa`
   фиксирует в DoD «`/api/seed` не вызывается при релизе US-1; по факту
   US-1 удалить или закрыть этот route».
3. Медийные placeholder-ы для mock-Case — копируем поведение из route.ts
   (`payload.create('media', { filePath })`), но ожидаем, что placeholder-файл
   лежит в репо (`site/content/seed/cases/` — подпапка будет создана
   `be3/be4`), а не в `/tmp/`.

Если `pnpm seed` на Node 22 VPS действительно падает на `@next/env` — см.
open question §9 к `tamd` (возможный fallback — запускать CLI-скрипт
через `next exec` / `node --loader tsx`, либо собрать временную
Next.js-route под защитой IP allowlist).

### 0.4. Поле `priceFrom/priceTo/priceUnit` в `Services`

Проверено по `site/collections/Services.ts:36–49`:

- `priceFrom: number, required: true, min: 0`
- `priceTo: number, required: true, min: 0`
- `priceUnit: select, required: true, enum: [object, tree, m3, shift, m2]`

Для 3 новых кластеров (ba.md §11 placeholder) фиксируем:

| Кластер | priceFrom | priceTo | priceUnit | Источник |
|---|---:|---:|---|---|
| `ochistka-krysh` | 1000 | 1000 | `m2` | ba.md §11 + PROJECT_CONTEXT.md §4 «за м²» |
| `vyvoz-musora` | 1000 | 1000 | `m3` | ba.md §11 + PROJECT_CONTEXT.md §4 «за м³» |
| `demontazh` | 1000 | 1000 | `object` | ba.md §11 + PROJECT_CONTEXT.md §4 «за объект» |
| `arboristika` | 700 | 45000 | `tree` | existing seed (сохраняем) |

`priceTo` обязательный и `≥ priceFrom`, поэтому для 3 кластеров
временно `priceTo = priceFrom = 1000`. Реальные вилки — в follow-up US с `cw`.

### 0.5. Поведение роута `/[service]/[district]/page.tsx` для draft-LP

Проверено по `site/app/(marketing)/[service]/[district]/page.tsx:72`:

```ts
if (!service || !district) notFound()
```

`notFound()` вызывается **только** при отсутствии Service или District — **не**
при отсутствии ServiceDistrict и **не** при `publishStatus=draft`. Draft-LP
рендерится c предупреждением (желтая плашка `site/app/(marketing)/[service]/[district]/page.tsx:98–103`)
и падает в sitemap только если `miniCase && !noindexUntilCase`
(см. `site/app/sitemap.ts:62–64`).

**Вывод:** 27 draft-LP после seed отвечают HTTP 200 + `noindex` в
`generateMetadata` (см. `buildProgrammaticMetadata` в `site/lib/seo/metadata.ts`),
не попадают в sitemap, рендерят жёлтый баннер статуса — это корректное
поведение для AC-BA-1.

---

## 1. User Stories

### US-1.1 — Разблокировать публичный запуск пилотной географии

**Как** оператор Обихода,
**я хочу** прогнать одну команду seed, которая наполняет prod-БД 4 корневыми
услугами, 7 пилотными районами и 28 programmatic-LP,
**чтобы** все 28 URL `/<service-slug>/<district-slug>/` отвечали HTTP 200 и я
мог перевести сайт в публичный доступ с направленным трафиком.

**Acceptance Criteria:**

- **AC-1.1.1** *(REQ-1.2, GOAL-1)*
  **Given** чистая prod-БД (схема есть, коллекции пусты),
  **When** исполнитель запускает `pnpm --dir site seed` с `OBIKHOD_SEED_CONFIRM=yes`
  и prod-`DATABASE_URI`,
  **Then** по завершении скрипта в `services` — 4 записи с slug
  `{arboristika, ochistka-krysh, vyvoz-musora, demontazh}`, в `districts` — 7
  записей с slug `{odincovo, krasnogorsk, mytishchi, khimki, istra, pushkino,
  ramenskoye}`, в `service-districts` — 28 записей (уникальный индекс
  `(service, district)` уважён), exit code = 0.

- **AC-1.1.2** *(REQ-1.2)*
  **Given** seed прогнан успешно,
  **When** `curl -I https://obikhod.ru/<svc>/<dst>/` (все 28 комбинаций),
  **Then** каждый ответ = HTTP 200, размер body > 500 байт (не пустой
  skeleton), в HTML присутствует `<h1>` и секция `CtaMessengers`.

### US-1.2 — Защита от случайного прогона seed на prod

**Как** `do` / оператор,
**я хочу** обязательный env-флаг подтверждения перед записью в prod-БД,
**чтобы** случайный запуск скрипта (из IDE, в CI, в неправильном SSH-контексте)
не переписал данные и не сломал ручные правки `cw`.

**Acceptance Criteria:**

- **AC-1.2.1** *(REQ-2.1)*
  **Given** окружение с `DATABASE_URI`, указывающим на хост prod
  (`45.153.190.107` либо `db.obikhod.ru`), и без переменной
  `OBIKHOD_SEED_CONFIRM=yes`,
  **When** запускается `pnpm --dir site seed`,
  **Then** скрипт завершается с exit code ≠ 0, печатает в stderr
  `ABORT: OBIKHOD_SEED_CONFIRM=yes требуется для prod`, в БД — 0 изменений
  (COUNT(*) всех 7 коллекций до и после равен).

- **AC-1.2.2** *(REQ-2.1)*
  **Given** окружение с `NODE_ENV=development` + local `DATABASE_URI`
  (`localhost:5432`),
  **When** запускается `pnpm --dir site seed` **без** `OBIKHOD_SEED_CONFIRM`,
  **Then** скрипт не блокируется (flag обязателен только для prod-хоста),
  seed проходит (идемпотентно).

### US-1.3 — Идемпотентность повторного прогона

**Как** `dba` / `do`,
**я хочу** безопасно перезапустить seed на уже наполненной БД,
**чтобы** покрыть сценарий refresh staging, восстановление после инцидента,
повторный деплой.

**Acceptance Criteria:**

- **AC-1.3.1** *(REQ-1.1, GOAL-4)*
  **Given** seed уже отработал (есть 4 services, 7 districts, 28 SD, 1 person,
  1 case, SeoSettings заполнен),
  **When** оператор запускает `pnpm --dir site seed` повторно с флагом
  подтверждения,
  **Then** скрипт завершается exit 0, в stdout `created: 0, skipped: N,
  updated: 0`, COUNT(*) до и после совпадает, updatedAt всех записей **не**
  меняется (кроме тех полей, которые были null и получили дефолт —
  недопустимо менять текст, который мог быть отредактирован вручную).

- **AC-1.3.2** *(REQ-1.1)*
  **Given** прогнали seed, потом через `/admin` оператор изменил
  `Services(slug=arboristika).intro` (ручная правка `cw`),
  **When** прогон seed повторяется,
  **Then** `Services(arboristika).intro` **НЕ** перезаписан — скрипт
  идемпотентно skip-ит по `findOneBySlug`.

### US-1.4 — SEO-минимум для индексации

**Как** `seo2`,
**я хочу**, чтобы каждая seed-запись `Services`/`Districts`/`service-districts`
содержала заполненные SEO-поля,
**чтобы** `generateMetadata` возвращал полноценные мета-теги и Яндекс.Вебмастер
принял sitemap без ошибок валидации.

**Acceptance Criteria:**

- **AC-1.4.1** *(REQ-1.3)*
  **Given** seed завершён,
  **When** для каждой из 4 `services` читаем поля,
  **Then** `metaTitle.length ∈ [10, 60]`, `metaDescription.length ∈ [140, 160]`,
  `h1.length ∈ [5, 90]`, `intro` — Lexical root с минимум 1 параграфом,
  `priceFrom ≥ 0`, `priceTo ≥ priceFrom`, `priceUnit ∈ {object, tree, m3, shift, m2}`.

- **AC-1.4.2** *(REQ-1.3, REQ-1.4)*
  **Given** seed завершён,
  **When** для каждого из 7 `districts` читаем поля,
  **Then** `slug` matches `^[a-z][a-z0-9-]{2,40}$`, `nameNominative`,
  `namePrepositional`, `nameDative`, `nameGenitive` — все непустые и с ожидаемыми
  падежами (таблица ниже), `coverageRadius ∈ [1, 50]`, `distanceFromMkad ∈ [0, 200]`,
  `centerGeo` — `[lon, lat]` массив из 2 чисел, `priority ∈ {A, B, C}`,
  `localPriceAdjustment ∈ [-20, 20]`.

  Таблица падежей (фиксирует `sa`, согласовано по семантике):

  | slug | Nom | Prep (в) | Dat (по) | Gen (из) |
  |---|---|---|---|---|
  | odincovo | Одинцово | в Одинцово | по Одинцово | из Одинцово |
  | krasnogorsk | Красногорск | в Красногорске | по Красногорску | из Красногорска |
  | mytishchi | Мытищи | в Мытищах | по Мытищам | из Мытищ |
  | khimki | Химки | в Химках | по Химкам | из Химок |
  | istra | Истра | в Истре | по Истре | из Истры |
  | pushkino | Пушкино | в Пушкино | по Пушкино | из Пушкино |
  | ramenskoye | Раменское | в Раменском | по Раменскому | из Раменского |

  (Одинцово и Пушкино — топонимы на `-о`, склоняются факультативно; берём
  несклоняемый вариант как более общий для карт и Яндекса.)

- **AC-1.4.3** *(REQ-1.3)*
  **Given** seed завершён,
  **When** для каждой из 28 `service-districts` читаем поля,
  **Then** `leadParagraph` — Lexical root с непустым текстом (length ≥ 100
  символов в плоском виде), `service` и `district` — resolvable FK,
  `publishStatus ∈ {draft, published}`, для `publishStatus=draft` —
  `noindexUntilCase = true`.

### US-1.5 — Один mock-Case, 27 LP без кейса

**Как** `seo2` и оператор,
**я хочу** единственный опубликованный LP с mock-Case и 27 draft-LP без кейса,
**чтобы** соблюсти защиту от Scaled Content Abuse и не нарушить `beforeValidate`
hook `ServiceDistricts`.

**Acceptance Criteria:**

- **AC-1.5.1** *(REQ-1.6)*
  **Given** seed завершён,
  **When** запрашиваем `service-districts` с `publishStatus=published`,
  **Then** возвращается ровно 1 запись — арбо × Раменское, у неё
  `miniCase != null`, `localFaq.length ≥ 2`, `noindexUntilCase = false`,
  `computedTitle = "Спил и уход за деревьями — Раменское"`.

- **AC-1.5.2** *(REQ-1.6)*
  **Given** seed завершён,
  **When** запрашиваем `service-districts` с `publishStatus=draft`,
  **Then** возвращается ровно 27 записей (4×7 − 1 = 27), у каждой
  `miniCase = null`, `noindexUntilCase = true`, `localFaq.length = 0` (для
  draft валидация не требует FAQ, поэтому экономим на placeholder-текстах).

- **AC-1.5.3** *(REQ-1.6, страница 200 для draft)*
  **Given** seed завершён, 27 LP в draft,
  **When** `curl -I https://obikhod.ru/demontazh/khimki/`,
  **Then** ответ HTTP 200, в HTML — жёлтый плашка статуса (селектор из
  `page.tsx:99`), в meta — `robots=noindex,follow`.

- **AC-1.5.4** *(REQ-1.6, sitemap)*
  **Given** seed завершён,
  **When** `curl https://obikhod.ru/sitemap.xml`,
  **Then** sitemap содержит `/arboristika/ramenskoye/` как единственный
  programmatic-URL из 28 (фильтр `miniCase && !noindexUntilCase` из
  `sitemap.ts:62–64`); плюс 4 service-URL, 7 district-URL (`/raiony/<slug>/`),
  static-entries (/, /raiony/, /kejsy/) и URL `/kejsy/snyali-pen-gostitsa-2026/`.

### US-1.6 — TOV-фильтр и инвариант каналов

**Как** оператор (хранитель бренда),
**я хочу**, чтобы все seed-тексты соответствовали TOV «Обихода» и упоминали все
4 канала связи,
**чтобы** первый публичный контакт не нарушал бренд.

**Acceptance Criteria:**

- **AC-1.6.1** *(REQ-1.7, CLAUDE.md Immutable)*
  **Given** seed завершён,
  **When** grep-ом по текстовым полям всех созданных записей
  (`services.intro|metaTitle|metaDescription|h1|title|faqGlobal.question|faqGlobal.answer|subServices.title`,
  `districts.metaTitle|metaDescription|nameNominative|namePrepositional|nameDative|nameGenitive`,
  `service-districts.leadParagraph|localFaq.question|localFaq.answer|localPriceNote`,
  `cases.title|h1|description|metaTitle|metaDescription`,
  `persons.bio|jobTitle`,
  `seo-settings.organization.*|credentials.*`),
  **Then** 0 совпадений по стоп-словам: `услуги населению`, `имеем честь`,
  `от 1 000 ₽`, `в кратчайшие сроки`, `индивидуальный подход`, `команда
  профессионалов`, `квалифицированные специалисты` (регистронезависимо, с учётом
  пробелов между цифрами/₽).

- **AC-1.6.2** *(REQ-1.5, CLAUDE.md Immutable «каналы»)*
  **Given** seed завершён,
  **When** читаем все текстовые поля публичного контента,
  **Then** минимум в 4 местах (1 на кластер услуг) упомянуты все 4 канала —
  `Telegram`, `MAX`, `WhatsApp`, телефон с префиксом `+7` — без предпочтения
  «только WhatsApp» или «только звонить».

### US-1.7 — Читаемый отчёт прогона

**Как** `do` / `qa`,
**я хочу** структурированный лог по коллекциям,
**чтобы** за 5 минут убедиться, что seed не молча пропустил часть объёма.

**Acceptance Criteria:**

- **AC-1.7.1** *(REQ-3.2)*
  **Given** успешный прогон,
  **When** читаем stdout,
  **Then** в логе есть секция `SUMMARY` с таблицей
  `collection | created | skipped | updated | total`, суммы совпадают с
  ожидаемыми: `services: 4, districts: 7, service-districts: 28,
  cases: 1, persons: 1, media: 2 (или 0 при повторе),
  globals.seo-settings: 1`, ниже — общий итог `ok` / `fail`.

### US-1.8 — Placeholder-медиа для OG/Case

**Как** `seo2`,
**я хочу** fallback-картинку для OG-рендера,
**чтобы** share в мессенджерах не возвращал 404.

**Acceptance Criteria:**

- **AC-1.8.1** *(REQ-2.3)*
  **Given** seed завершён,
  **When** для mock-Case `snyali-pen-gostitsa-2026` читаем `photosBefore[0].image`,
  `photosAfter[0].image`, `ogImage`,
  **Then** все три FK указывают на записи `media` с non-null `filename` и
  `mimeType=image/jpeg`, файлы доступны по URL.

- **AC-1.8.2** *(REQ-2.3, 27 LP без фото)*
  **Given** 27 draft-LP без кейса,
  **When** для каждой читаем `miniCase`,
  **Then** значение = null, страница рендерится без MiniCaseSection, OG-картинка
  для share берётся из `SeoSettings.defaultOgImage` (если задан — AC-1.8.3)
  либо опускается без 404.

- **AC-1.8.3** *(REQ-2.3, опционально)*
  **Given** seed завершён,
  **When** читаем `seo-settings.defaultOgImage`,
  **Then** значение заполнено (FK на `media` с файлом `og-fallback.jpg` или
  аналогичным). Если `cw`/`ui` не предоставили fallback — поле остаётся null,
  AC переходит в **partial** и open question §9 к `tamd`/`seo2`.

### US-1.9 — Persons (минимум 1 бригадир)

**Как** `seo2`,
**я хочу** запись `Persons` для E-E-A-T,
**чтобы** JSON-LD `Person` отрендерился на странице mock-Case.

**Acceptance Criteria:**

- **AC-1.9.1** *(REQ-3.1)*
  **Given** seed завершён,
  **When** читаем `persons` с slug `aleksey-semenov`,
  **Then** запись существует, `worksInDistricts` содержит ≥ 1 FK на район
  (минимум `ramenskoye`), `credentials.length ≥ 2`, `bio` не пустой,
  `jobTitle = "Бригадир-арборист"`.

### US-1.10 — SeoSettings как placeholder для Organization JSON-LD

**Как** `seo2`,
**я хочу** заполненные реквизиты в `SeoSettings`,
**чтобы** JSON-LD `Organization` не ломался на Schema-валидаторе.

**Acceptance Criteria:**

- **AC-1.10.1** *(REQ-2.2)*
  **Given** seed завершён,
  **When** `findGlobal('seo-settings')`,
  **Then** `organization.legalName`, `organization.name`, `organization.taxId`
  (=`7847729123`, placeholder по MEMORY `project_inn_temp.md`),
  `organization.addressRegion`, `organization.addressLocality`,
  `organization.telephone` (formatted `+7 (495) XXX-XX-XX`), `localBusiness.priceRange`,
  `localBusiness.geoRadiusKm`, `localBusiness.openingHours.opens/closes`,
  `credentials.length ≥ 4` — все заполнены.

### US-1.11 — Out of scope: миграции Payload

**Как** `po`,
**я хочу**, чтобы US-1 не вносила миграций Payload,
**чтобы** риск seed-контента и риск схемы не смешивались.

**Acceptance Criteria:**

- **AC-1.11.1** *(REQ-4.1)*
  **Given** US-1 завершена,
  **When** инспектируем изменения в репо,
  **Then** в `site/migrations/` новых файлов не появилось, `payload.config.ts`
  не изменён (`db: postgresAdapter({ push: true })` сохраняется),
  follow-up US «Payload migrations» создана в Linear с `blocks: US-1` снят.

### US-1.12 — Формат ценников: «фикс-цена за объект»

**Как** бренд-ответственный (оператор),
**я хочу**, чтобы нигде в публичных SEO-полях не было формулировки «от 1 000 ₽»
без указания единицы,
**чтобы** сохранить оффер «фикс-цена за объект».

**Acceptance Criteria:**

- **AC-1.12.1** *(REQ-1.8)*
  **Given** seed завершён,
  **When** grep по `services.metaTitle`, `services.metaDescription`,
  `service-districts.leadParagraph` (плоский текст),
  **Then** если встречается `от <число> ₽`, рядом в той же фразе обязательно есть
  одно из: `за объект`, `за дерево`, `за м²`, `за м³`, `за смену`. Изолированного
  «от 1 000 ₽» — 0 вхождений.

---

## 2. Use Case: прогон seed на prod

| # | Actor | System | Data / Effect |
|---|-------|--------|---------------|
| 1 | `do` | — | Делает SSH на VPS, готовит env (`OBIKHOD_SEED_CONFIRM=yes`, `DATABASE_URI`, `PAYLOAD_SECRET`, `NODE_ENV=production`) |
| 2 | `do` | `pnpm --dir /home/obikhod/current/site seed` | Запуск CLI |
| 3 | — | `scripts/seed.ts` loads Payload config, resolves DB connection | Логируем `env check: ok` |
| 4 | — | Safety-гейт: проверяем prod-хост и флаг `OBIKHOD_SEED_CONFIRM` | Если нет флага + prod — exit 1 (AC-1.2.1) |
| 5 | — | `findGlobal('seo-settings')` → если `organization.telephone` пуст, `updateGlobal` | +1 updated, иначе skipped |
| 6 | — | Цикл по 4 сервисам: `findOneBySlug('services', slug)` → create or skip | +N created / +M skipped |
| 7 | — | Цикл по 7 районам: `findOneBySlug('districts', slug)` → create or skip | +N created / +M skipped |
| 8 | — | `persons.aleksey-semenov`: create or skip (link to ramenskoye только при create) | +1 / skip |
| 9 | — | Загрузка 2 placeholder-JPEG в `media` (если mock-case ещё нет) | +2 / skip |
| 10 | — | `cases.snyali-pen-gostitsa-2026`: create с miniCase-полями или skip | +1 / skip |
| 11 | — | Цикл по 28 парам (`svc × dst`): `find by (service, district)` → create draft или skip | +N created / +M skipped |
| 12 | — | Специальный апгрейд: arbo × ramenskoye → `miniCase = mockCase.id`, `publishStatus = 'published'`, `noindexUntilCase = false` (срабатывает `beforeValidate`-гейт: проверяется `localFaq.length ≥ 2`) | +1 updated / skip |
| 13 | — | Печатает `SUMMARY` таблицу + глобальный `ok` | exit 0 |
| 14 | `qa1` | `curl` smoke по 28 URL | 28 × HTTP 200 |
| 15 | `qa1` | `curl /sitemap.xml` | проверяет вхождения |

---

## 3. Sequence (mermaid)

```mermaid
sequenceDiagram
    autonumber
    participant Op as Оператор / do
    participant Shell as SSH shell
    participant Script as scripts/seed.ts
    participant Env as process.env
    participant Payload as Payload Local API
    participant DB as Postgres 16

    Op->>Shell: pnpm --dir site seed
    Shell->>Env: OBIKHOD_SEED_CONFIRM, DATABASE_URI, NODE_ENV
    Shell->>Script: tsx scripts/seed.ts
    Script->>Env: read env
    alt prod host && missing OBIKHOD_SEED_CONFIRM
        Script-->>Shell: ABORT (exit 1)
    else
        Script->>Payload: getPayload({ config })
        Payload->>DB: connect
        Script->>Payload: findGlobal seo-settings
        Payload-->>Script: current SeoSettings
        alt organization.telephone empty
            Script->>Payload: updateGlobal seo-settings
            Payload->>DB: UPDATE
        end
        loop for each Service (4)
            Script->>Payload: find services where slug=X
            alt not found
                Script->>Payload: create services
                Payload->>DB: INSERT services
            end
        end
        loop for each District (7)
            Script->>Payload: find districts where slug=Y
            alt not found
                Script->>Payload: create districts
                Payload->>DB: INSERT districts
            end
        end
        Script->>Payload: upsert Persons(aleksey-semenov)
        Script->>Payload: upsert mock Case + 2 media
        loop for each pair (svc, dst) — 28 шт.
            Script->>Payload: find service-districts where service=svc && district=dst
            alt not found
                Script->>Payload: create service-districts (draft, noindex=true)
                Payload->>DB: INSERT service-districts
            end
        end
        Script->>Payload: update service-districts(arbo × ramenskoye) -> miniCase + published
        Note over Payload: beforeValidate проверяет miniCase + localFaq.length>=2
        Payload->>DB: UPDATE
        Script-->>Shell: SUMMARY table + exit 0
    end

    Op->>Shell: curl /arboristika/odincovo/ (x28)
    Shell-->>Op: HTTP 200 (27 noindex + 1 index)
    Op->>Shell: curl /sitemap.xml
    Shell-->>Op: XML с 1 programmatic-URL
```

---

## 4. Data / ERD

### 4.1. Охват коллекций

Seed **затрагивает** (C/U — create/update):

- `services` — C × 4
- `districts` — C × 7
- `service-districts` — C × 28, U × 1 (повышение arbo × ramenskoye до published)
- `persons` — C × 1 (если ещё нет)
- `cases` — C × 1 (mock)
- `media` — C × 2 (placeholder before/after для mock-Case)
- `seo-settings` (global) — U × 1 (только если пуст)

Seed **не затрагивает**: `b2b-pages`, `blog`, `leads`, `redirects`, `users`.

### 4.2. ERD (актуальная Payload-схема — без изменений US-1)

```mermaid
erDiagram
    SERVICES ||--o{ SERVICE_DISTRICTS : "1:N"
    DISTRICTS ||--o{ SERVICE_DISTRICTS : "1:N"
    DISTRICTS }o--o{ DISTRICTS : "neighborDistricts (hasMany)"
    CASES }o--|| SERVICES : "service (req)"
    CASES }o--|| DISTRICTS : "district (req)"
    CASES }o--o{ PERSONS : "brigade (hasMany)"
    CASES ||--o{ MEDIA : "photosBefore[].image / photosAfter[].image / ogImage"
    SERVICE_DISTRICTS }o--o| CASES : "miniCase (optional)"
    PERSONS }o--o{ DISTRICTS : "worksInDistricts (hasMany)"
    SERVICES ||--o{ MEDIA : "heroImage / gallery / ogImage (optional)"
    DISTRICTS ||--o| MEDIA : "heroImage / photoGeo (optional)"
    SEO_SETTINGS ||--o| MEDIA : "defaultOgImage (optional)"

    SERVICES {
        text slug UK
        text title
        text h1
        text metaTitle
        text metaDescription
        richText intro
        number priceFrom
        number priceTo
        select priceUnit
        array faqGlobal
        array subServices
    }
    DISTRICTS {
        text slug UK
        text nameNominative
        text namePrepositional
        text nameDative
        text nameGenitive
        number coverageRadius
        number distanceFromMkad
        json centerGeo
        select priority
        number localPriceAdjustment
    }
    SERVICE_DISTRICTS {
        fk service
        fk district
        text computedTitle
        fk miniCase
        array localFaq
        array localLandmarks
        textarea localPriceNote
        richText leadParagraph
        select publishStatus
        checkbox noindexUntilCase
    }
    CASES {
        text slug UK
        text title
        date dateCompleted
        richText description
        array photosBefore
        array photosAfter
        number durationHours
        number finalPrice
    }
    PERSONS {
        text slug UK
        text firstName
        text lastName
        text jobTitle
        richText bio
        array credentials
        array knowsAbout
    }
    MEDIA {
        text filename
        text mimeType
        text alt
        text caption
    }
    SEO_SETTINGS {
        group organization
        group localBusiness
        array credentials
        upload defaultOgImage
    }
```

### 4.3. Инварианты (существующие, seed их соблюдает — не создаёт)

- **Uniqueness:** `services.slug`, `districts.slug`, `cases.slug`, `persons.slug`
  — unique index в Payload. Повтор → ошибка БД (23505). Seed использует
  `findOneBySlug` → insert только при отсутствии.
- **Composite unique:** `service-districts` имеет
  `indexes: [{ fields: ['service', 'district'], unique: true }]`. Seed
  использует `find(where=and(...))` → insert только при отсутствии.
- **beforeValidate гейт** на `service-districts`: `publishStatus='published'`
  требует `miniCase` и `localFaq.length ≥ 2`. Seed создаёт 28 LP как `draft`,
  а для arbo × ramenskoye upgrade-шаг выполняется только после того, как
  `miniCase` и `localFaq` гарантированы.
- **Required fields:** для `Services.metaDescription` — minLength 140 /
  maxLength 160. Placeholder-тексты 3 новых кластеров должны укладываться в
  диапазон — зафиксируется в шаблонах §5.4 и проверяется AC-1.4.1.

### 4.4. Эскалация к `dba`

Открытое к `dba` ревью:

1. Подтвердить, что unique-index на `(service, district)` в Payload 3.83
   на VPS Postgres 16 реально существует как SQL-constraint, а не только в
   Payload-layer — запросить `\d+ service_districts` через psql.
2. Подтвердить, что на prod-БД нет существующих записей с slug из §0.2
   (конфликт риск Р-4 ba.md) — запустить `SELECT slug, id FROM services;
   SELECT slug, id FROM districts;` перед seed.
3. Предложить план бэкапа непосредственно перед первым прогоном seed на prod
   (`/usr/local/bin/obikhod-backup.sh` уже есть в проекте — вызвать вручную).
4. Оценить, нужен ли доп. индекс по `service-districts.publishStatus` для
   `getPublishedServiceDistricts` — **вне US-1**, но занести follow-up.

---

## 5. Контракт seed-скрипта

### 5.1. CLI

```
# Команда (реализуемая `be3/be4`):
cd /home/obikhod/current/site
OBIKHOD_SEED_CONFIRM=yes \
DATABASE_URI=postgres://obikhod:...@127.0.0.1:5432/obikhod \
PAYLOAD_SECRET=... \
NODE_ENV=production \
pnpm seed
```

Для локального dev:
```
pnpm seed   # .env.local содержит localhost DATABASE_URI → флаг не требуется
```

Существующий npm-скрипт `site/package.json:13`:
```
"seed": "tsx --env-file=.env.local scripts/seed.ts"
```

**Вопрос к `tamd` (§9):** оставляем `--env-file=.env.local` или разрешаем
`pnpm seed` без env-file, полагаясь на переменные, экспортированные в shell
(иначе prod-запуск требует временного `/home/obikhod/.env.seed` или экспорта
в сессию).

### 5.2. Safety-гейт

Псевдокод:

```ts
const isProd =
  process.env.NODE_ENV === 'production' ||
  /obikhod\.ru|45\.153\.190\.107/.test(process.env.DATABASE_URI ?? '')
if (isProd && process.env.OBIKHOD_SEED_CONFIRM !== 'yes') {
  console.error('ABORT: OBIKHOD_SEED_CONFIRM=yes требуется для prod')
  process.exit(1)
}
```

### 5.3. Идемпотентность

- **Primary pattern:** `findOneBySlug(collection, slug)` → если есть, skip.
  Работает для: `services`, `districts`, `cases`, `persons`.
- **Composite pattern:** `find(where=and([service.equals(X),
  district.equals(Y)]))` → если есть, skip. Работает для `service-districts`.
- **Global pattern:** `findGlobal('seo-settings')` → если непустое ключевое
  поле (`organization.telephone`), skip полного апдейта.
- **Upgrade-пара** (arbo × ramenskoye → published): читаем текущее, если
  `miniCase` уже заполнен И `publishStatus === 'published'` — skip, иначе
  `update`. **Только это одно место делает `update`** поверх существующих
  данных — остальное либо `create`, либо `skip`.
- **Никаких полей типа «merge intro»** — защита от затирания ручных правок
  `cw` (риск Р-1 ba.md §7).

### 5.4. Шаблоны текстов (фиксируются в коде seed)

#### Services (4 кластера)

Для `arboristika` — берём существующие тексты из `scripts/seed.ts:98–161`.

Для 3 новых кластеров шаблоны (заполняет `be3/be4`, проверяет `cw` до merge):

```
ochistka-krysh:
  title: 'Чистка крыш от снега и наледи'
  h1: 'Чистка крыш от снега'
  metaTitle: 'Чистка крыш от снега в Москве и МО — Обиход'  // ≤60
  metaDescription: 'Чистим крыши от снега и наледи в Москве и МО по фикс-цене за
                    м². Выезд бригады 24/7, промальп и автовышка, страховка ГО
                    10 млн ₽, смета по фото в Telegram за 10 минут.'  // 140–160
  intro (Lexical): 'Обиход чистит крыши от снега и наледи в Москве и Московской
                    области с фиксированной ценой за м². Работаем с домами, УК,
                    ТСЖ и ЖК. Канал связи — Telegram, MAX, WhatsApp или телефон.'
  priceFrom: 1000, priceTo: 1000, priceUnit: 'm2'

vyvoz-musora:
  title: 'Вывоз мусора'
  h1: 'Вывоз мусора под ключ'
  metaTitle: 'Вывоз мусора в Москве и МО — фикс-цена | Обиход'
  metaDescription: 'Вывозим мусор в Москве и МО по фикс-цене за м³. Строительный,
                    порубочные остатки, хлам с участка. Погрузка и уборка —
                    входит. Смета в Telegram / MAX / WhatsApp за 10 минут.'
  intro (Lexical): 'Обиход вывозит строительный, садовый и порубочный мусор в
                    Москве и МО с фиксированной ценой за м³. Подъезжаем с
                    самосвалом, грузчики на борту. Канал связи — Telegram, MAX,
                    WhatsApp, телефон.'
  priceFrom: 1000, priceTo: 1000, priceUnit: 'm3'

demontazh:
  title: 'Демонтаж построек'
  h1: 'Демонтаж дач и построек'
  metaTitle: 'Демонтаж построек в Москве и МО — Обиход'
  metaDescription: 'Сносим дачные дома, бани, сараи, хозблоки в Москве и МО по
                    фикс-цене за объект. Вывоз мусора включён, порубочный билет
                    за наш счёт. Смета по фото в Telegram / MAX / WhatsApp.'
  intro (Lexical): 'Обиход выполняет демонтаж построек в Москве и МО с
                    фиксированной ценой за объект. Сносим дачи, бани, сараи,
                    расчищаем участок. Канал связи — Telegram, MAX, WhatsApp,
                    телефон.'
  priceFrom: 1000, priceTo: 1000, priceUnit: 'object'
```

Все 3 шаблона упоминают все 4 канала (AC-1.6.2), обходят стоп-слова (AC-1.6.1),
используют формат «за <единицу>» (AC-1.12.1).

#### Districts (7 × один шаблон)

```
District.metaTitle: `Обиход в ${nameDative}* — арбо, снег, мусор, демонтаж`
  // * или namePrepositional — см. таблицу §5.5 (грамматика по району)
District.metaDescription: `Все услуги Обихода ${namePrepositional}: спил
  деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект, смета
  по фото за 10 минут в Telegram, MAX или WhatsApp.`
  // длина 140–160 (проверить в тестах)
coverageRadius, distanceFromMkad, centerGeo — значения из справочника `seo1`
  или из существующего seed для Раменского; для новых 6 — см. §5.5
priority: 'A' для всех 7 пилотных
localPriceAdjustment: 0 (первый релиз — без гео-коррекции)
landmarks: 0–4 на район (опционально; если `seo1` передаст — добавить)
```

#### service-districts (28 × один шаблон)

```
service × district (FK x2)
leadParagraph (Lexical): 2–3 предложения с {namePrepositional}, кластер-спец.
  формулировкой, упоминанием мессенджеров. ≥ 100 символов плоского текста.
  Пример для demontazh × khimki:
    'Обиход выполняет демонтаж построек в Химках с фиксированной ценой за
     объект. Сносим дачные дома и бани, вывозим мусор, оформляем порубочный
     билет. Смета по фото за 10 минут в Telegram, MAX или WhatsApp.'
publishStatus: 'draft'
noindexUntilCase: true
localFaq: []  // оставляем пустым для draft
localLandmarks: []  // seo1 может передать позже
localPriceNote: null
```

Для единственной пары `arboristika × ramenskoye` — переиспользуем существующий
блок из `scripts/seed.ts:278–325` (leadParagraph + 2 localFaq + 3 landmarks +
localPriceNote), плюс upgrade-шаг (§5.3): `miniCase=<mockCaseId>`,
`publishStatus='published'`, `noindexUntilCase=false`.

### 5.5. Справочник падежей/геометрии 7 районов (финальные значения)

| slug | Nom | Prep | Dat | Gen | centerGeo [lon, lat] | distMkad | covRadius |
|---|---|---|---|---|---|---:|---:|
| odincovo | Одинцово | в Одинцово | по Одинцово | из Одинцово | [37.2754, 55.6782] | 24 | 20 |
| krasnogorsk | Красногорск | в Красногорске | по Красногорску | из Красногорска | [37.3300, 55.8219] | 22 | 20 |
| mytishchi | Мытищи | в Мытищах | по Мытищам | из Мытищ | [37.7336, 55.9110] | 17 | 20 |
| khimki | Химки | в Химках | по Химкам | из Химок | [37.4451, 55.8895] | 12 | 20 |
| istra | Истра | в Истре | по Истре | из Истры | [36.8585, 55.9072] | 40 | 15 |
| pushkino | Пушкино | в Пушкино | по Пушкино | из Пушкино | [37.8472, 56.0106] | 30 | 20 |
| ramenskoye | Раменское | в Раменском | по Раменскому | из Раменского | [38.2333, 55.5667] | 35 | 20 |

Значения — ориентир из открытых источников (центры ГО по Яндекс.Картам,
`distanceFromMkad` — по трассе). `seo1` вправе скорректировать в рамках своей
экспертизы до реализации, но не после merge.

### 5.6. SUMMARY лог (формат)

```
================ SEED SUMMARY ================
collection          | created | skipped | updated
---------------------|---------|---------|--------
services            |       4 |       0 |       0
districts           |       7 |       0 |       0
persons             |       1 |       0 |       0
media               |       2 |       0 |       0
cases               |       1 |       0 |       0
service-districts   |      28 |       0 |       1
globals/seo-settings|       - |       - |       1
---------------------|---------|---------|--------
status: ok  duration: 12.4s
==============================================
```

Первый прогон: created = ожидаемое. Второй прогон (AC-1.3.1): created=0,
skipped=все, updated=0, status=ok.

---

## 6. NFR

- **Reliability / идемпотентность:** AC-1.3.1, AC-1.3.2. Повторный прогон —
  0 изменений. Нет «merge-полей».
- **Safety:** AC-1.2.1 (env-флаг), AC-1.2.2. Случайный прогон в CI и локально
  защищён проверкой prod-хоста.
- **Observability:** AC-1.7.1 (таблица SUMMARY в stdout). Errors логируются
  как `❌ <collection>: <message>` и завершают процесс exit 1 с trace на stderr.
- **SEO-минимум:**
  - `services.metaTitle` ≤ 60, `metaDescription` 140–160 (hard-limit Payload
    в `Services.ts`, падает валидацией при нарушении).
  - `districts.metaTitle` ≤ 60, `metaDescription` ≤ 160 (soft; ставим 140–160).
  - `service-districts.leadParagraph` ≥ 100 символов плоского текста.
  - Sitemap содержит 1 programmatic-URL (AC-1.5.4).
  - robots для 27 draft-LP — `noindex,follow` (через `buildProgrammaticMetadata`).
- **Грамматика:** 4 падежа заполнены для всех 7 районов (AC-1.4.2).
- **TOV:** 0 стоп-слов (AC-1.6.1), все 4 канала представлены в ≥ 1 публичном
  тексте на кластер (AC-1.6.2).
- **Фикс-цена:** AC-1.12.1 — никакого «от 1 000 ₽» без единицы измерения.
- **Производительность прогона:** не требование (разовый скрипт). Ориентир —
  < 60 секунд на prod с пустой БД, < 10 секунд на повторном прогоне.
- **Browsers / a11y:** не задеты (seed не рендерит UI).
- **Security:**
  - Не логируем `PAYLOAD_SECRET`, `DATABASE_URI`, ключи.
  - HTTP-эндпоинт `app/api/seed/route.ts` в US-1 **не трогаем**, но в DoD
    фиксируем follow-up US «удалить `/api/seed` после US-1» — см. §8 и §9.
  - Placeholder-медиа: файлы лежат в `site/content/seed/cases/` (подпапка
    создаётся `be3/be4`, коммитится в репо, размер ≤ 50 КБ/файл).
- **Data protection:** в `SeoSettings.organization.taxId` — placeholder
  `7847729123` по MEMORY `project_inn_temp.md`; не ИНН оператора, не чужие
  данные.

---

## 7. Edge cases

- **E1. Прерывание посреди прогона (Ctrl+C, OOM, потеря SSH).**
  - Payload-операции транзакционны только на уровне отдельного `create`. Но seed
    создаёт по одному объекту за раз, поэтому частичный прогон оставит
    частично заполненную БД.
  - Митигация: идемпотентность (AC-1.3.1). Повторный запуск добирает
    недостающие записи.
- **E2. Unique-constraint на `(service, district)` — race при параллельных
  прогонах.**
  - Последовательный код скрипта плюс skip-by-find защищает от дублей.
  - Параллельный прогон запрещён — `do` инициирует только из одной SSH-сессии.
- **E3. Большой latency Postgres (> 5s на операцию).**
  - Timeout Payload не настроен на уровне seed → скрипт будет висеть. Допустимо
    для разового прогона. Если становится проблемой — открываем follow-up.
- **E4. `payload.create('media', { filePath })` не находит файл.**
  - Обязательно чекать `fs.existsSync(filePath)` до передачи в Payload,
    иначе Sharp падает с невнятной ошибкой. AC-1.8.1 покрывает.
- **E5. 27 draft-LP рендерятся с жёлтым баннером.**
  - Это ожидаемое поведение (`page.tsx:98`), но **не** для prod-посетителя.
  - Опциональный follow-up (не в US-1): скрыть баннер при `publishStatus=draft`
    для неавторизованных посетителей — см. open question §9 к `ui/fe2`.
- **E6. Lexical JSON структура — несовместимость версий.**
  - Используем `lexicalParagraph` helper из существующего `scripts/seed.ts`;
    пересохранение через admin триггерит нормализацию Lexical. Если Payload
    ругается на структуру — эскалация к `tamd`.
- **E7. `pnpm seed` на Node 22 VPS падает на `@next/env loadEnvConfig`.**
  - Комментарий в `app/api/seed/route.ts:11` упоминает эту проблему для Next 16.
  - Митигация: `tamd` подтверждает рабочий способ запуска CLI (`tsx` с явными
    env-переменными, без `--env-file`). Если не работает — fallback на
    одноразовый HTTP-вызов `/api/seed/route.ts` с IP allowlist, но ТОЛЬКО
    после явного ADR от `tamd`. См. §9.

---

## 8. Definition of Done (US-1 в целом)

### Код и окружение

- [ ] `site/scripts/seed.ts` расширен до 4 сервисов × 7 районов × 28
      service-districts. Структура — из §5.4, тексты — из §5.4 и §5.5.
- [ ] Safety-гейт `OBIKHOD_SEED_CONFIRM` реализован (AC-1.2.1).
- [ ] Summary-лог в формате §5.6 реализован (AC-1.7.1).
- [ ] Placeholder-медиа для mock-Case коммитятся в `site/content/seed/cases/`
      (before.jpg, after.jpg), скрипт читает оттуда (не из `/tmp/`).
- [ ] `app/api/seed/route.ts` **не** модифицируется в US-1, но в файле
      добавляется комментарий `@deprecated: US-1 покрывает seed через CLI;
      этот route удалить в US-2`. Удаление — follow-up US.

### Статические проверки (site/)

- [ ] `pnpm --dir site run type-check` — green.
- [ ] `pnpm --dir site run lint` — green.
- [ ] `pnpm --dir site run format:check` — green.
- [ ] `pnpm --dir site run build` — green (build не должен вызывать seed).

### Функциональные проверки (qa1/qa2)

- [ ] AC-1.1.1 — exit 0, 4/7/28/1/1 записей.
- [ ] AC-1.1.2 — 28 URL отвечают HTTP 200.
- [ ] AC-1.2.1 — без флага: exit 1 + 0 записей.
- [ ] AC-1.2.2 — dev: без флага работает.
- [ ] AC-1.3.1 — повтор: 0 created, 0 updated.
- [ ] AC-1.3.2 — ручная правка `Services.intro` не затирается.
- [ ] AC-1.4.1 + AC-1.4.2 + AC-1.4.3 — SEO-поля валидны.
- [ ] AC-1.5.1 + AC-1.5.2 + AC-1.5.3 + AC-1.5.4 — mock-Case / draft-LP / sitemap.
- [ ] AC-1.6.1 — grep стоп-слов: 0 вхождений.
- [ ] AC-1.6.2 — каналы Telegram/MAX/WhatsApp/телефон упомянуты в ≥ 4 местах.
- [ ] AC-1.7.1 — SUMMARY-таблица.
- [ ] AC-1.8.1 + AC-1.8.2 (+ AC-1.8.3 опционально) — медиа.
- [ ] AC-1.9.1 — Алексей Семёнов в persons.
- [ ] AC-1.10.1 — SeoSettings заполнен.
- [ ] AC-1.12.1 — формат ценника.

### Критерии после релиза

- [ ] `https://obikhod.ru/sitemap.xml` содержит 1 programmatic-URL.
- [ ] Подача sitemap в Яндекс.Вебмастер **НЕ** в этой US (follow-up US-SEO-Launch).
- [ ] `qa` + `cw` подтверждают TOV-чистоту отчётом с grep-результатами.
- [ ] `dba` подтвердил, что prod-БД до прогона пустая по пересекающимся slug,
      и бэкап сделан.
- [ ] `cr` дал apr.
- [ ] `out` дал apr.
- [ ] `po` написал release note `devteam/release-notes/US-1-seed-prod-db.md`.
- [ ] Linear OBI-<M> → Done, `blocks: US-1` снят с follow-up Issues
      (Payload migrations, Real texts, Wave-2 geo).

### Out of scope (строго)

- Payload migrations (AC-1.11.1 + REQ-4.1).
- Реальные тексты `cw` для 28 LP.
- Wave-2 география (5 районов) и wave-2 услуги (50+).
- Реальные фото работ для 27 LP.
- Настройка реальных аккаунтов Telegram/MAX/Wazzup24/телефон.

---

## 9. Open questions

### К `po`

- [ ] **Placeholder-fallback для OG.** В US-1 опциональный `SeoSettings.defaultOgImage`
      (AC-1.8.3) — заводим сейчас или follow-up? SA-позиция: опциональный, не блокер.
- [ ] **Follow-up Issues в Linear.** Оформить сейчас или после релиза US-1:
      «Payload migrations» (blocks US-1), «Реальные тексты seed-LP» (cw),
      «Wave-2 география + услуги» (4 кластера × 5 районов), «Удалить
      `/api/seed/route.ts`».
- [ ] **Финальная подпись под AC-1.6.1 стоп-слов.** Расширил словарь
      стоп-слов до 7 формулировок (добавил «команда профессионалов» и
      «квалифицированные специалисты» — частый казённый штамп). `po` apr?

### К `tamd`

- [ ] **Форма safety-гейта (AC-1.2.1).** Регекс по `DATABASE_URI` на строки
      `obikhod.ru` / `45.153.190.107` плюс `NODE_ENV=production` — достаточно?
      Или нужен отдельный allowlist prod-hosts в env + stdin-подтверждение?
- [ ] **Запуск `pnpm seed` на VPS Node 22.** В `app/api/seed/route.ts:11` есть
      предупреждение: *«Payload 3.83 standalone CLI ломается на @next/env
      loadEnvConfig в Next 16»*. Проверили ли это на практике? Если ломается —
      ADR от `tamd` на альтернативу (экспорт env в shell + `tsx` без
      `--env-file`, либо временный IP-allowlist на `/api/seed`, либо
      одноразовый `next exec scripts/seed.ts`).
- [ ] **Запуск через deploy.yml workflow_dispatch vs ручной SSH.** SA-позиция:
      ручной SSH (минимальные риски), но если `tamd` хочет автоматизировать —
      `workflow_dispatch` с секретом `OBIKHOD_SEED_CONFIRM`. Решение фиксируется
      в ADR.

### К `dba`

- [ ] **Уникальные индексы Payload в Postgres.** Подтвердить через `\d+
      service_districts` на prod, что `(service_id, district_id)` — реальный
      DB-constraint, а не только Payload-валидация.
- [ ] **Предпрогон-аудит.** До seed выполнить `SELECT slug FROM services;
      SELECT slug FROM districts;` — убедиться, что 0 пересечений с §0.2.
- [ ] **Бэкап.** Запустить `/usr/local/bin/obikhod-backup.sh` вручную
      непосредственно перед первым прогоном seed на prod. Зафиксировать
      filename бэкапа в QA-отчёте.
- [ ] **Индекс на `service_districts.publish_status`.** Нужен ли для
      `getPublishedServiceDistricts`? Отдельный follow-up, не US-1.

### К `cw`

- [ ] **Ревью 3 шаблонов `ochistka-krysh` / `vyvoz-musora` / `demontazh`
      (§5.4).** Пройти чеклист TOV («порядок под ключ», matter-of-fact), убрать
      казённые обороты до merge. SA даёт черновик, `cw` визирует.
- [ ] **Падежи для Одинцово и Пушкино (§5.5).** Использован несклоняемый
      вариант («в Одинцово», «по Одинцово»). `cw` может рекомендовать
      склоняемый («в Одинцове», «по Одинцову») — до merge.

### К `seo1` (через `po`)

- [ ] **Slugs районов.** Подтвердить `odincovo` vs `odintsovo`, `mytishchi`
      vs `mytishi` — именно эти slug уже в семядре / перелинковке.
- [ ] **coverageRadius, distanceFromMkad, centerGeo (§5.5).** Значения —
      ориентир; если `seo1` имеет официальный справочник — скорректировать
      до merge.
- [ ] **Landmarks (КП, СНТ, мкр)** для 6 новых районов — если у `seo1` есть
      семядро, передаём. Иначе `landmarks: []`.

### К `ui / fe2` (follow-up, не блокер US-1)

- [ ] **Скрытие «жёлтой плашки статуса» для 27 draft-LP от публичных
      посетителей.** В `page.tsx:98` плашка показывается всем. Для
      авторизованных operator-ов — полезно. Для рандомного посетителя — шум.
      Follow-up US под `fe2`.

### Schema (**не** меняется в US-1)

- [ ] **Новых полей Payload не добавляем.** Если в ходе реализации `be3/be4`
      обнаружат, что нужно новое поле (например, `Services.clusterGroup`
      для группировки в navigation), эскалация `dba` + `po` → отдельная US,
      US-1 блокируется до решения.

---

## 10. PO Review (заполняет po)

- Дата ревью:
- Замечания:
- Статус: approved / reject

---

## 11. Приложение: матрица трассировки REQ → AC

| REQ (ba.md) | MoSCoW | AC в этом документе | Проверка (qa) |
|---|---|---|---|
| REQ-1.1 (идемпотентность) | Must | AC-1.3.1, AC-1.3.2 | повторный прогон → 0 изменений |
| REQ-1.2 (4×7 объём) | Must | AC-1.1.1, AC-1.1.2 | COUNT(*) + curl по 28 URL |
| REQ-1.3 (SEO-минимум) | Must | AC-1.4.1, AC-1.4.2, AC-1.4.3 | валидация полей всех 4+7+28 записей |
| REQ-1.4 (падежи) | Must | AC-1.4.2 + таблица §5.5 | ручное ревью + unit-тест на наличие 4 падежей |
| REQ-1.5 (каналы) | Must | AC-1.6.2 | grep Telegram / MAX / WhatsApp / +7 |
| REQ-1.6 (1 mock-Case) | Must | AC-1.5.1, AC-1.5.2, AC-1.5.3, AC-1.5.4 | queries + curl + sitemap parse |
| REQ-1.7 (TOV / анти-стоп-слова) | Must | AC-1.6.1 | grep стоп-слов |
| REQ-1.8 (формат «за объект») | Must | AC-1.12.1 | grep «от N ₽» без единицы |
| REQ-2.1 (env-флаг prod) | Should | AC-1.2.1, AC-1.2.2 | тест без флага + с флагом |
| REQ-2.2 (SeoSettings placeholder) | Should | AC-1.10.1 | findGlobal + полевые чек |
| REQ-2.3 (placeholder-медиа) | Should | AC-1.8.1, AC-1.8.2, AC-1.8.3 | проверка FK + file existence |
| REQ-3.1 (≥1 Persons) | Could | AC-1.9.1 | find + worksInDistricts |
| REQ-3.2 (SUMMARY лог) | Could | AC-1.7.1 | capture stdout, парсинг |
| REQ-4.1 (no migrations) | Won't | AC-1.11.1 | `git diff site/migrations/` пустой, payload.config не меняется |
