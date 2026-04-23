# ADR-0002: `SiteChrome` — источник правды для контактов и реквизитов, дедупликация `SeoSettings`

**Дата:** 2026-04-23
**Статус:** Accepted (оператор делегировал auto-apr, 2026-04-23) — **ВНИМАНИЕ:** prod-деплой с `push:true` + drop columns требует явного подтверждения оператора и ручного `pg_dump` перед мержем в main
**Автор:** tamd
**Контекст US:** US-2-cms-header-footer-globals (ba.md + sa.md approved оператором 2026-04-23)

> **Замечание по нумерации.** `sa.md` §11 ссылается на `ADR-0003`. В репо это **первый**
> ADR после `README.md`, поэтому фиксируем номер **`ADR-0002`** (`ADR-0001` — параллельный
> по миграциям Payload, в бэклоге). Ссылки в `sa.md` обновит `sa` при следующем
> касании US-2.

---

## Контекст

После US-2 в Payload появляется второй global — `SiteChrome` (`site/globals/SiteChrome.ts`)
с пятью табами: `header`, `footer`, `contacts`, `requisites`, `social`. Параллельно в
репо живёт `SeoSettings` (`site/globals/SeoSettings.ts`), у которого исторически в группе
`organization` лежат те же сущности: `telephone`, `legalName`, `taxId`, `name`, `ogrn`,
`addressRegion`, `addressLocality`, `streetAddress`, `postalCode`, `foundingDate`, плюс
массив `sameAs[]`.

Эти поля одновременно:

- **Редактируются оператором** в админке (поэтому логично в `SiteChrome`).
- **Читаются `seo2`** в `site/lib/seo/jsonld.ts` → `organizationSchema()` / `localBusinessSchema()`
  для структурированной разметки `Organization` и `LocalBusiness`.
- **Показываются в UI** Footer / Header (`contacts.*` + `requisites.*` + `social[]` → Footer).

Без явного ADR команда разойдётся уже на первой правке: оператор поменяет `phoneDisplay`
в `SiteChrome`, а в `SeoSettings.organization.telephone` останется старое — JSON-LD и UI
разойдутся. Это прямой риск **R6** из `ba.md` и нарушение **GOAL-4** из `ba.md` («консистентность
контактных каналов»).

**Релевантные ограничения:**

- **Prod БД пустая** (handoff 2026-04-23): ни одного значения в `SeoSettings` на prod
  нет — dropping колонок риск потери данных → нулевой.
- **Сайт ещё не проиндексирован** (indexed pages 0, sitemap из Payload fallback):
  обратная совместимость для внешних consumer'ов JSON-LD не нужна.
- **Стек зафиксирован** (Next.js 16 + Payload 3 + Postgres 16 + Beget VPS) — никаких новых
  зависимостей, всё решается в рамках Payload globals + существующего
  `site/lib/seo/*`.
- **Dev использует `push: true`** (`payload.config.ts:52`), prod — залит одноразово через
  `pg_dump --schema-only` (handoff 2026-04-21, раздел hardening). Переход на Payload
  migrations — отдельный item в бэклоге `dba`/`be3`.
- `sa.md` § 11 закрепил **рекомендацию Вариант B**; эта ADR подтверждает выбор и
  зафиксирует детали.

---

## Решение

**Вариант B** — убрать дублирующиеся поля из `SeoSettings.organization` и `SeoSettings.sameAs`,
сделать `SiteChrome` единственным источником правды для всего, что одновременно
показывается пользователю и попадает в `Organization` / `LocalBusiness` JSON-LD.

Миграция выполняется **атомарно в рамках одного PR** (он же закрывает US-2): новый
global + рефакторинг `lib/seo/*` + удаление полей из `SeoSettings` + seed-скрипт. Никакого
переходного периода с двойным чтением.

### Финальный список полей, мигрирующих в `SiteChrome` (удаляются из `SeoSettings`)

Из `SeoSettings.organization` **удаляются** (9 полей):

- `organization.telephone` → `SiteChrome.contacts.phoneE164` (+ добавляется человекочитаемый
  `phoneDisplay`, которого в `SeoSettings` не было).
- `organization.legalName` → `SiteChrome.requisites.legalName`.
- `organization.taxId` → `SiteChrome.requisites.inn`.
- `organization.ogrn` → `SiteChrome.requisites.ogrn`.
- `organization.addressRegion` + `addressLocality` + `streetAddress` + `postalCode` →
  `SiteChrome.requisites.legalAddress` (один `textarea` — в админке оператору удобнее
  писать одним куском; для JSON-LD `addressRegion` / `addressLocality` пока остаются
  константами внутри `jsonld.ts` как fallback, финальный парсинг адреса — back-log
  `seo2`, вне scope US-2).
- `organization.foundingDate` → **удаляется совсем**. Не используется в JSON-LD сейчас
  (в `organizationSchema()` поля нет), в UI тоже не рендерится. Если `seo2` захочет
  добавить — вернёт в `SiteChrome.requisites.foundingDate` отдельным follow-up.

Верхнеуровневое из `SeoSettings` **удаляется** (1 массив):

- `sameAs[]` → `SiteChrome.social[]` (структура меняется: было
  `{ url: string }[]`, стало `{ type: enum, url: string, label?: string }[]`; для JSON-LD
  маппинг `social.map(s => s.url)` на стороне `jsonld.ts`).

**Остаётся в `SeoSettings`** (источник правды для SEO-слоя, в Footer/Header не показывается):

- `organization.name` — **остаётся**. Используется `organizationSchema()` как `name`
  Organization; в UI Footer/Header не рендерится (бренд подаётся константой «Обиход»).
  Дублирование с `SiteChrome.footer.copyrightHolder` допустимое: `copyrightHolder` — это
  литерал в копирайтной строке, `organization.name` — юридическое имя для JSON-LD.
- `localBusiness.priceRange` / `geoRadiusKm` / `openingHours.opens` / `openingHours.closes`.
- `credentials[]` (лицензии, СРО, Минтруд — hasCredential).
- `verification.yandexWebmaster` / `googleSearchConsole` / `mailRu`.
- `defaultOgImage`.
- `organizationSchemaOverride` (JSON-escape для редких SEO-кейсов).
- `indexNowKey`, `robotsAdditional`.

Итого `SeoSettings` превращается в тонкий **SEO-only** global без UI-копий.

### Контракт с `seo2`

`site/lib/seo/jsonld.ts` правит `organizationSchema()` и `localBusinessSchema()`:

```ts
// было:
export function organizationSchema() { return { telephone: '+7 (000) 000-00-00', taxID: '7847729123', sameAs: [], ... } }

// станет (контракт):
export function organizationSchema(
  chrome: Pick<SiteChromeDoc, 'contacts' | 'requisites' | 'social'>,
  seo?: Pick<SeoSettingsDoc, 'organization' | 'credentials'>,
): OrganizationSchema {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: seo?.organization?.name ?? 'Обиход',
    legalName: chrome.requisites?.legalName ?? 'Общество с ограниченной ответственностью «Обиход»',
    taxID: chrome.requisites?.inn ?? '',
    telephone: chrome.contacts?.phoneE164 ?? '',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: { '@type': 'PostalAddress', addressCountry: 'RU', ... },
    sameAs: (chrome.social ?? []).map(s => s.url).filter(Boolean),
    hasCredential: (seo?.credentials ?? []).map(c => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: c.name })),
    areaServed: [ ... ],
  }
}
```

**Никаких fallback'ов на `SeoSettings.organization.telephone` / `SeoSettings.sameAs`** —
этих полей физически не будет в схеме после миграции. Любой код, обращающийся к ним,
ломается на этапе TypeScript (`pnpm run type-check`) — это и есть желаемое поведение,
защита от дрейфа.

`site/app/layout.tsx` (или текущий эквивалент RSC-корня) собирает оба global параллельно:

```ts
const [chrome, seo] = await Promise.all([getSiteChrome(), getSeoSettings()])
<JsonLd schema={[organizationSchema(chrome, seo), websiteSchema(), localBusinessSchema(chrome)]} />
```

### План миграции Payload-схемы

#### Dev (локальный оператор / CI)

`payload.config.ts:52` держит `postgresAdapter({ push: true })`. При старте `next dev` Payload
сравнивает актуальную схему глобалов с БД и синхронизирует:

1. `be3/be4` добавляют `SiteChrome` в `globals: [SeoSettings, SiteChrome]`.
2. Удаляют поля из `SeoSettings.ts` согласно списку выше.
3. `pnpm dev` → Payload `push:true` автоматически:
   - создаёт таблицы `globals_site_chrome` + `globals_site_chrome_header_menu` +
     `_social` + `_footer_columns` + `_footer_columns_items` (Payload разворачивает
     `array` в отдельные таблицы с FK);
   - из `globals_seo_settings_organization` (встроенная group хранится плоскими
     колонками с префиксом) drop'ает колонки `telephone`, `legal_name`, `tax_id`,
     `ogrn`, `address_region`, `address_locality`, `street_address`, `postal_code`,
     `founding_date`;
   - drop'ает таблицу `globals_seo_settings_same_as` (Payload-array хранится отдельной
     таблицей).
4. `pnpm tsx scripts/seed-site-chrome.ts` создаёт запись global с seed'ами.
5. `qa1`/`qa2` прогоняют Playwright на dev — проверяют AC-1.x / AC-5.x / AC-6.x
   из `sa.md`.

#### Prod (Beget VPS, 45.153.190.107)

`push: true` на prod **оставляем включённым** — это уже договорённое поведение (handoff
2026-04-22, «Schema на prod был залит одноразово через `pg_dump --schema-only`; TODO
переход на Payload migrations»). После деплоя PM2 рестартует процесс `obikhod`, тот
запускает Payload, который видит расхождение схемы и применяет:

1. **Обязательный предохранитель перед деплоем** (делает `do`):
   ```bash
   ssh beget 'sudo -u postgres pg_dump obikhod > /var/backups/obikhod/pre-us-2-$(date +%F).sql'
   ```
   Пустая БД или нет — dump делаем всегда (1 KB стоит дешевле потенциального
   инцидента). Бэкап ложится в существующую папку `/var/backups/obikhod/` (handoff
   2026-04-21, cron 03:00 MSK уже настроен).

2. **Деплой PR** обычным workflow `deploy.yml` (`workflow_dispatch` или push в main):
   - tar на runner → rsync → `pm2 delete obikhod && pm2 start --cwd current`
   - Payload на старте применяет schema push: drop колонок + create таблиц SiteChrome.

3. **Seed прогоняется вручную** одним SSH-вызовом после деплоя (seed идемпотентный,
   AC-12.2):
   ```bash
   ssh beget 'cd /var/www/obikhod/current && NODE_ENV=production pnpm tsx scripts/seed-site-chrome.ts'
   ```
   В `deploy.yml` добавлять автоматический запуск **не будем** в US-2 — seed для
   начального накатывания, дальше оператор правит через `/admin`. Автоматизация
   seed — отдельный тикет для `do`.

4. **Smoke-чек на `/api/health?deep=1`** (Payload db ping) должен вернуть 200 после
   деплоя — это уже часть deploy.yml (handoff 2026-04-21, hardening).

5. **Проверка JSON-LD на prod** (closure-тест `seo2`): `curl -sS https://obikhod.ru/
   | grep -A 20 'application/ld+json'` — `telephone` = `+79851705111`, `taxID` =
   `7847729123`, `sameAs` непустой.

#### Отвергнутые альтернативы миграции на prod

- **(a) Повторить хак с `pg_dump --schema-only` из dev + накатить на prod** —
  отвергнуто. Хак был оправдан на первом деплое без Users-коллекции; сейчас он
  уже сломает существующий `WITH TABLE globals_seo_settings` без явного `DROP
  COLUMN IF EXISTS`. К тому же схема-dump не делает data-migration, если бы в
  prod были значения.
- **(b) Ручной SQL-скрипт `ALTER TABLE ... DROP COLUMN ...`** — отвергнуто. Дублирует
  работу, которую `push: true` уже делает корректно; добавляет шанс рассинхрона
  между тем, что ждёт Payload, и тем, что в Postgres (например, Payload может
  переименовать колонку, а скрипт работает по старому имени).
- **(c) Включить Payload migrations только для US-2** — отвергнуто **для этой US**.
  Миграции — правильный путь стратегически, но `sa.md` ставит US-2 в P0 pre-launch
  pack рядом с US-1 (seed), и параллельно активировать migrations = добавить ещё
  один vector риска (baseline, генерация migration, проверка idempotency). Migrations
  остаются в бэклоге `dba`/`be3` как самостоятельный следующий US (ADR-0001 — см.
  раздел §Open questions ниже), и будут применены начиная со следующей schema-change
  задачи.

### Обратная совместимость

**Нет legacy-fallback чтения `SeoSettings.*`.** Причины:

1. **Сайт не проиндексирован** (indexed pages 0 на старте US-2). Внешние consumer'ы
   JSON-LD ещё не видели старых значений — ломать некого.
2. **Prod БД пустая**. В `SeoSettings` на prod нет ни одного значения — дублирующее
   чтение вернуло бы `undefined` и только запутало бы дебаг.
3. **TypeScript strict + удалённые поля в `SeoSettings.ts`** делают любое обращение к
   `seo.organization.telephone` ошибкой компиляции. Это сильная статическая гарантия
   отсутствия дрейфа, которую мы не хотим ослаблять.
4. **Атомарность PR** (global создан → Header/Footer читают SiteChrome → `jsonld.ts`
   читает SiteChrome → поля удалены из SeoSettings) — гарантирует, что между
   коммитом и деплоем невозможно частичное состояние.

Соответственно, в `jsonld.ts` **нет** конструкций вида `chrome.contacts.phoneE164 ??
seo.organization.telephone`. Только `chrome.contacts.phoneE164` (с дефолтом `''`,
если global пустой — мягкая деградация через `DEFAULT_SITE_CHROME`, AC-4.x).

---

## Альтернативы

### Вариант A. Оставить поля в обоих global, редактировать независимо

- **Плюсы:**
  - Нулевая миграция. `SeoSettings.ts` не меняется.
  - Роль `seo2` может держать «SEO-только» telephone, отличный от показного UI-номера
    (например, подменный для Calltouch).
- **Минусы:**
  - **Гарантированный рассинхрон на первой правке.** Оператор откроет `SiteChrome`,
    обновит телефон — `SeoSettings.organization.telephone` останется старым. JSON-LD
    и UI разойдутся.
  - Прямо противоречит **GOAL-4** и рекомендации `ba.md` REQ-4.1.
  - Подменные номера Calltouch — backlog «неделя 5-6», не проблема US-2; для них
    будет отдельное поле `contacts.phoneDisplayDynamic` в `SiteChrome`.
- **Вердикт:** отвергнуто.

### Вариант B. Убрать дубли из `SeoSettings`, `SiteChrome` — источник правды (выбрано)

- **Плюсы:**
  - Один source of truth для самых часто правимых полей.
  - JSON-LD физически невозможно рассинхронизировать с UI.
  - Минус 9+1 полей в `SeoSettings` → админка `SEO Settings` становится «SEO-only»,
    оператор меньше боится её трогать.
  - TypeScript ловит любой рудиментарный доступ к старому полю.
  - Data-migration на пустой prod БД = drop только schema, нулевой риск потери данных.
- **Минусы:**
  - Разделение реквизитов на «контактные в `SiteChrome.requisites`» и «верификации / SEO-meta
    в `SeoSettings`» — чуть неочевидно, нужно учить оператора.
  - Нет legacy-fallback: любой внешний код (или старая CI-ветка) сломается на схеме —
    но это свойство, а не баг.
  - Миграция адреса в единый `legalAddress: textarea` временно теряет структурность
    (`addressRegion` / `addressLocality` / `streetAddress` / `postalCode` в JSON-LD
    получают константный fallback). Для полного `PostalAddress` в JSON-LD после
    регистрации юрлица `seo2` добавит парсинг `legalAddress` либо 4 отдельных поля —
    это follow-up, не критично для P0.
- **Вердикт:** **принято.** Обоснование — ниже в «Последствия».

### Вариант C. Computed read-through через Payload `afterRead` hook

Идея: поля `SeoSettings.organization.telephone` и `SeoSettings.sameAs` остаются в
`SeoSettings.ts`, но помечаются `admin.readOnly: true`, а значение подменяется в
`afterRead` hook из `SiteChrome`.

- **Плюсы:**
  - Обратная совместимость для любого consumer'а `SeoSettings` на уровне runtime.
  - Оператор видит текущее значение в `SeoSettings` (read-only), не запутывается.
- **Минусы:**
  - «Магия»: поля показываются в двух местах, но редактируемые только в одном —
    требует объяснения в `admin.description` на обоих.
  - Hook кидает второй query в `SiteChrome` на каждое чтение `SeoSettings` —
    удваивает Payload-latency (мелочь, но умножается на `generateStaticParams`
    для programmatic-страниц).
  - Усложняет типы: `afterRead` возвращает обогащённый объект, `payload-types.ts`
    генерируется из схемы — рассинхрон типов возможен.
  - Нет TypeScript-гарантии на «никто не пишет в `SeoSettings.organization.telephone`»
    — только runtime-предупреждение.
  - Больше кода при таком же бизнес-результате.
- **Вердикт:** отвергнуто. Выгоды обратной совместимости нулевые (сайт не проиндексирован,
  prod пустой), минусы реальные.

### Вариант D (до-рассмотрение). Вообще один global вместо двух

Слить `SeoSettings` + `SiteChrome` в один `SiteSettings`, разбитый на tabs:
`header`, `footer`, `contacts`, `requisites`, `social`, `seo`, `verification`.

- **Плюсы:**
  - Ещё меньше админ-интерфейса, всё в одном месте.
- **Минусы:**
  - Ломает уже утверждённое SA-решение (`sa.md` §5: слаг `site-chrome`, отдельный файл
    `site/globals/SiteChrome.ts`).
  - `SiteChrome` ↔ `SeoSettings` имеют разный access-профиль: `read: true` + `update:
    admin` у обоих одинаковый, но владельцы контента разные (UI vs SEO-tech).
  - Упирается в UX-ограничение Payload: 7 табов в одном global = много прокрутки.
  - Изменяет scope US-2, требует повторного approve `ba` + оператора.
- **Вердикт:** отвергнуто. Выходит за рамки US-2, ценностной дельты нет.

---

## Последствия

### Положительные

- **Консистентность:** UI и JSON-LD читают `phoneE164` и `sameAs` из одного поля —
  рассинхрон невозможен.
- **Чистая админка:** `SeoSettings` превращается в «SEO-only» global (verification,
  credentials, OG-image, IndexNow, robotsAdditional, priceRange, openingHours) —
  оператор чётко понимает, что там техническое, а в `SiteChrome` — пользовательское.
- **Поведенческая безопасность:** TypeScript strict ловит любую попытку прочитать
  удалённое поле — защита на CI (`pnpm run type-check`), не на code review.
- **Упрощение seed:** один скрипт `scripts/seed-site-chrome.ts` (SA §8) покрывает и
  UI-данные, и JSON-LD-данные в одной транзакции.
- **`seo2` получает явный контракт:** `organizationSchema(chrome, seo)` — функция
  чистая, аргументы типизированы, side effect'ов нет.

### Отрицательные / риски

- **R1. Потеря foundingDate.** Поле удалено из схемы; если оператор захочет вернуть
  — потребуется новый migration. Митигация: `foundingDate` не использовалось ни в UI,
  ни в текущем `organizationSchema()`; при необходимости добавится как `requisites.foundingDate`
  follow-up'ом.
- **R2. Временная потеря структуры адреса в JSON-LD.** В `SiteChrome.requisites.legalAddress`
  адрес единой строкой, а `PostalAddress` в `Organization` JSON-LD просит `addressRegion` /
  `addressLocality` / `streetAddress` / `postalCode`. Митигация: `jsonld.ts` оставляет
  эти поля константами `'Санкт-Петербург'` до регистрации юрлица (как сейчас); `seo2` в
  следующей US после регистрации юрлица в МО либо распарсит `legalAddress`, либо добавит
  4 отдельных поля в `SiteChrome.requisites`. Для Яндекс-SEO критичнее сам факт наличия
  `Organization` — структурированный адрес можно доразмечать позже.
- **R3. Payload `push: true` на prod может не применить drop аккуратно.** Теоретически
  возможен случай, когда Payload видит колонку, но не умеет её drop'нуть (constraint,
  FK). Митигация: (а) `pg_dump` перед деплоем, (б) prod БД пустая, FK на эти колонки
  отсутствуют, (в) на dev миграция прогоняется первой и валидируется.
- **R4. Автодеплой на push в main выкатывает миграцию без ручной проверки.** Сейчас
  `deploy.yml` триггерится на push в main (handoff 2026-04-21). Митигация: PR
  мержится только после зелёного CI (type-check + lint + Playwright E2E + build),
  `do` делает `pg_dump` перед мержем в main (один раз, по чек-листу), smoke на
  `/api/health?deep=1` после деплоя — стандартный gate.
- **R5. Роль `seo2` сейчас в `jsonld.ts` держит константу `telephone: '+7 (000)
  000-00-00'`.** После миграции константа уходит, `telephone` становится обязательным
  аргументом — любое место, где `organizationSchema()` вызывается без `chrome`, ломается
  на этапе type-check. Митигация: это желаемое поведение; миграция callsite сделает
  `seo2` в рамках US-2.
- **R6. Reversibility.** Reversible: rollback = `git revert` PR + `pg_restore
  /var/backups/obikhod/pre-us-2-YYYY-MM-DD.sql`. Cost ≈ 10 минут. Необратимые действия
  (drop пользовательских данных) отсутствуют, потому что данных в prod БД нет.
- **R7. Consumer-drift.** Если где-то в коде (admin, sitemap, feeds) ещё остался доступ
  к `seo.organization.telephone` — он поймается на `pnpm run type-check` на PR. Grep
  перед мержем: `rg -n 'organization\.(telephone|legalName|taxId|ogrn|addressRegion|addressLocality|streetAddress|postalCode|foundingDate)|sameAs' site/` — ожидается
  0 совпадений (кроме самого `SeoSettings.ts`, откуда поля удаляются).

### Reversibility

**Reversible.** Пока prod БД пустая и сайт не проиндексирован — откат не оставляет
следов. После первой B2B-активности с реальным `inn`/`legalName`/`legalAddress`
обратимость уменьшается (данные придётся бэкапить), но это уже не US-2 scope.

### Cost

- Код: ~ 1 PR, ≈ 400-500 строк (`site/globals/SiteChrome.ts` ≈ 250, `site/lib/cms/siteChrome.ts`
  ≈ 40, `site/components/marketing/*` правки ≈ 100, `site/lib/seo/jsonld.ts` правки
  ≈ 50, seed ≈ 70).
- Инфраструктура: `pg_dump` перед деплоем — 5 секунд человеко-времени `do`.
- Риск-бюджет: низкий (пустая БД, атомарный PR).

---

## Rollback-план

Если после деплоя JSON-LD / Header / Footer сломались (smoke `/api/health?deep=1`
фейлит, Lighthouse SEO → error, видно битый `Organization` на `view-source:/`):

1. **Немедленно:** `git revert <SHA US-2 PR>` → push в main → автодеплой вернёт
   предыдущий билд (без `SiteChrome.ts`, со старым `SeoSettings.ts`).
2. **Восстановление БД** (на случай, если `push: true` на prod успел drop'нуть колонки,
   а тесты это пропустили):
   ```bash
   ssh beget 'sudo -u postgres psql -d obikhod < /var/backups/obikhod/pre-us-2-YYYY-MM-DD.sql'
   ```
3. **Пересоздать PM2 процесс**, если упал:
   ```bash
   ssh beget 'cd /var/www/obikhod/current && pm2 delete obikhod && pm2 start ecosystem.config.js --only obikhod'
   ```
4. **Проверка:**
   - `curl -sS https://obikhod.ru/api/health?deep=1` → 200.
   - `curl -sS https://obikhod.ru/ | grep application/ld+json` → `Organization` на месте,
     `telephone`, `taxID`, `sameAs` — как были.
5. **Postmortem** в `devteam/specs/US-2-cms-header-footer-globals/` (новый файл
   `rollback.md`): что сломалось, почему CI не поймал, что добавить в AC/QA.

RTO (recovery time objective) — до 20 минут. RPO (recovery point objective) — 0 данных
теряется, потому что `SiteChrome` ещё не успел получить операторские правки на prod.

---

## Связь с другими решениями

- **US-1-seed-prod-db.** US-2 отдельный от US-1: seed `Services`/`Districts` не зависит
  от наличия `SiteChrome`. Но оба — P0 pre-launch pack, идут параллельно по решению
  `po`.
- **ADR-0001 (в бэклоге, не создан).** Переход Payload с `push: true` на migrations
  — отдельный блокер, см. handoff 2026-04-21 «TODO переход на Payload migrations».
  US-2 сознательно **не** разблокирует этот бэклог, потому что (а) прод пустой и
  `push: true` безопасен, (б) миграции требуют baseline и отдельного QA-цикла. После
  закрытия US-2 `tamd` формирует ADR-0003 (по новой нумерации) на включение migrations
  — применяется со следующей schema-change задачи.
- **seo2 backlog.** Парсинг `legalAddress` → `PostalAddress` структурно — follow-up
  после регистрации юрлица «Обиход» в МО (см. CLAUDE.md § Открытые вопросы).

---

## Открытые вопросы

- [ ] **Q1.** `po` подтверждает, что поле `foundingDate` можно не мигрировать (удалить
      навсегда в этой US). Если фаундер хочет сохранить — добавить
      `SiteChrome.requisites.foundingDate: date` отдельным тикетом.
- [ ] **Q2.** `dba` подтверждает, что `push: true` корректно drop'ает `globals_seo_settings_same_as`
      (Payload-array = отдельная таблица с FK на parent global). На dev проверяется
      в первую очередь, перед выкатом на prod.
- [ ] **Q3.** `seo2` подтверждает сигнатуру `organizationSchema(chrome, seo)` — `chrome`
      первым параметром, `seo` опциональный. Либо альтернатива: `organizationSchema()`
      сам вызывает `getSiteChrome()` + `getSeoSettings()` — теряем чистоту, но
      упрощаем callsite. Рекомендация `tamd`: явный аргумент (чистая функция лучше
      тестируется).
- [ ] **Q4.** `do` подтверждает, что `pg_dump` перед деплоем PR'а US-2 добавлен в
      чеклист релиза (одноразовый шаг, не в `deploy.yml`).
- [ ] **Q5.** `sa` синхронизирует ссылку в `sa.md` §11: `ADR-0003` → `ADR-0002`
      (косметическая правка при следующем касании).
