# US-3 — Чек-лист всех полей для admin.description

**Автор:** `be4`
**Спек:** US-3 — Понятная админка, волна 1
**Дата:** 2026-04-24
**Источник правды (код):** `site/collections/*.ts` (11 файлов), `site/globals/*.ts` (2 файла) по состоянию на 2026-04-24, commit `e9b668d` handoff.
**Входы:** [ba.md §REQ-1.2 / §Interview delta](./ba.md), [sa.md §3/§7](./sa.md), [cw-admin-descriptions-dictionary.md](./cw-admin-descriptions-dictionary.md) (§5 white-list), [ADR-0003](../../adr/ADR-0003-blocks-pattern-preliminary.md)
**Назначение:** блокер-артефакт для `cw` — по этому чек-листу `cw` методично идёт по коллекциям и пишет `admin.description` (plain-string, TOV-compliant, ≤ 200 символов) для каждого поля, не пропуская ни одного и не тратя ресурс на служебку.

---

## 0. Легенда

**Столбцы таблиц:**

- `field path` — полное имя поля, включая вложенность: `Collection.field`, `Collection.array[].subField`, `Global.group.subField`, `Global.tabs[Tab].group.array[].subField`. Имена точно как в `site/collections/*.ts` / `site/globals/*.ts`.
- `type` — тип Payload 3 (`text`, `textarea`, `richText`, `number`, `date`, `email`, `relationship`, `upload`, `checkbox`, `select`, `array`, `group`, `json`, `tabs`).
- `req` — `yes` если в коде `required: true`, иначе `no`.
- `has desc?` — уже ли есть непустая `admin.description` в коде.
- `cond?` — есть ли `admin.condition` (условная видимость).
- `wl` — white-list по [cw-dictionary §5](./cw-admin-descriptions-dictionary.md) (`yes` = подпись не пишем). Служебка: `id`, `createdAt`, `updatedAt`, `_status`, `_versions*`, `hash`, `salt`, `loginAttempts`, `lockUntil`, `resetPasswordToken`, `resetPasswordExpiration`, `amoCrmId`, `callTrackingId`, `syncedAt`, `estimateDraftJson`, `utmMedium`, `utmCampaign`. Технические auth-поля Payload добавляются автоматически в `Users` (auth: true) и в контракте **не перечисляются** — они всегда white-list.
- `note` — якорные заметки для `cw` (REQ-7.* из ba.md, условия publish-gate, особенности UI/UX).

**Итоги по коллекции** внизу каждого подраздела: `fields total / need desc / already have / white-list`. «Total» считает только поля, видимые оператору (без Payload-internal служебки в p3-core, но с auth-полями Users, потому что они попадают в list view).

**REQ-1.2 инвариант:** `admin.description` = plain-string, 1 предложение + опциональный пример, **без** Markdown, **без** восклицательных (TOV), **без** канцеляризмов (cw-dictionary §4), ссылки на гайды — только через `<InlineHelp>` на уровне view, не в `admin.description` поля (sa.md §7.2).

---

## 1. Services (`site/collections/Services.ts`, 15 fields + nested)

Коллекция публичная, уходит под `blocks[]` в US-3 (sa.md §9.2) + publish-gate (sa.md §5) + preview (sa.md §6). Все поля видны оператору, служебки нет.

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Services.slug` | text | yes | no | no | no | kebab-case латиницей 3-40; есть validate-regex |
| `Services.title` | text | yes | no | no | no | maxLength 80; ref `cw-dictionary §3.2` |
| `Services.h1` | text | yes | no | no | no | maxLength 90 |
| `Services.metaTitle` | text | yes | no | no | no | maxLength 60 |
| `Services.metaDescription` | textarea | yes | no | no | no | minLength 140, maxLength 160 |
| `Services.intro` | richText | yes | no | no | no | REQ-7.2 — это главный лид услуги |
| `Services.priceFrom` | number | yes | no | no | no | REQ-7.2: «от X ₽», без ₽/пробелов; preview-field рядом в UI (ba.md §9-bis, sa Q-to-be4) |
| `Services.priceTo` | number | **yes (код)** | no | no | no | **REQ-7.2 расхождение:** BA требует `priceTo` опциональный, в коде `required: true`. Флаг `be4` — снять `required`, `priceTo` уходит в tab «Дополнительно» скрытым |
| `Services.priceUnit` | select | yes | no | no | no | 5 опций: object/tree/m3/shift/m2 |
| `Services.faqGlobal` | array (0..12) | no | no | no | no | описать сам массив «Общие FAQ» |
| `Services.faqGlobal[].question` | text | yes | no | no | no | maxLength 160 |
| `Services.faqGlobal[].answer` | richText | yes | no | no | no | — |
| `Services.subServices` | array | no | no | no | no | описать «Под-услуги» |
| `Services.subServices[].slug` | text | yes | no | no | no | kebab-case для URL sub-услуги |
| `Services.subServices[].title` | text | yes | no | no | no | — |
| `Services.subServices[].h1` | text | yes | no | no | no | — |
| `Services.subServices[].priceFrom` | number | no | no | no | no | REQ-7.2 формат |
| `Services.relatedServices` | relationship→services hasMany (max 3) | no | no | no | no | «до 3 связанных услуг» |
| `Services.heroImage` | upload→media | no | no | no | no | — |
| `Services.gallery` | array (max 12) | no | no | no | no | описать «Галерея» |
| `Services.gallery[].image` | upload→media | yes | no | no | no | — |
| `Services.ogImage` | upload→media | no | no | no | no | 1200×630 для шейра |
| `Services.schemaJsonLdOverride` | json | no | no | no | no | техническое; `cw-dictionary §3.14`: «Обычно пусто. Заполняет разработчик» |

**Итог Services:** **23 поля всего / 23 нужна подпись / 0 уже есть / 0 white-list.**

---

## 2. Districts (`site/collections/Districts.ts`, 17 видимых полей)

Publication коллекция. Падежи — REQ `cw`-dictionary §3.23. `priceCoefficient` в ba.md Interview delta REQ-7.2 помечено «скрытый collapsible» — но в **текущем коде его нет**, есть `localPriceAdjustment` (см. note).

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Districts.slug` | text | yes | no | no | no | — |
| `Districts.nameNominative` | text | yes | **yes** («Раменское») | no | no | текущая подпись короче эталона cw-dict §3.23, `cw` может переписать |
| `Districts.namePrepositional` | text | yes | **yes** («в Раменском») | no | no | то же |
| `Districts.nameDative` | text | yes | **yes** («по Раменскому») | no | no | то же |
| `Districts.nameGenitive` | text | yes | **yes** («из Раменского») | no | no | то же |
| `Districts.coverageRadius` | number (1..50) | yes | **yes** («км — для GeoShape в schema.org») | no | no | cw-dict §3.25 даёт человеческий текст |
| `Districts.distanceFromMkad` | number (0..200) | yes | no | no | no | «км от МКАД» |
| `Districts.centerGeo` | json | yes | **yes** («[lon, lat] — центр…JSON-LD») | no | no | cw-dict §3.24: инструкция «откройте Я.Карты, правый клик…» |
| `Districts.landmarks` | array (0..12) | no | no | no | no | описать массив |
| `Districts.landmarks[].name` | text | yes | **yes** («КП Барвиха Hills») | no | no | — |
| `Districts.landmarks[].type` | select | yes | no | no | no | 4 опции |
| `Districts.neighborDistricts` | relationship→districts hasMany (max 3) | no | **yes** («3 соседних района…») | no | no | — |
| `Districts.courtsJurisdiction` | text | no | **yes** («Администрация…порубочный билет») | no | no | — |
| `Districts.photoGeo` | upload→media | no | **yes** («Фото с EXIF geo…») | no | no | — |
| `Districts.priority` | select | yes | no | no | no | 3 опции A/B/C |
| `Districts.localPriceAdjustment` | number (−20..+20) | yes | **yes** («% от базовой цены услуги») | no | no | **REQ-7.2 расхождение:** BA-словарь говорит `priceCoefficient` в Districts «скрытый collapsible». Поле называется иначе, **нет collapsible-обёртки**. Флаг `be4`: либо переименовать + скрыть в tab «Для калькулятора», либо оставить как есть и подтвердить с `sa`. Решение через SA-Q ниже. |
| `Districts.heroImage` | upload→media | no | no | no | no | — |
| `Districts.metaTitle` | text (max 60) | no | no | no | no | — |
| `Districts.metaDescription` | textarea (max 160) | no | no | no | no | — |

**Итог Districts:** **20 полей / 11 нужна новая подпись / 9 уже есть (7 норм + 2 под переписку в TOV) / 0 white-list.**

---

## 3. ServiceDistricts (`site/collections/ServiceDistricts.ts`, 13 полей)

Publication + publish-gate (sa.md §5.2 п.5). Есть `beforeValidate` hook `requireGatesForPublish`.

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `ServiceDistricts.service` | relationship→services | yes | no | no | no | cw-dict §3.15 |
| `ServiceDistricts.district` | relationship→districts | yes | no | no | no | cw-dict §3.16 — пара уникальна (indexes unique) |
| `ServiceDistricts.computedTitle` | text (readOnly) | no | **yes** («Заполняется автоматически») | no | **yes** | cw-dict §5.2 — readOnly, подпись оставляем, но мягче: «Заполняется сам после сохранения» |
| `ServiceDistricts.miniCase` | relationship→cases | no | **yes** («ОБЯЗАТЕЛЬНО для publish — реальный кейс из района») | no | no | **REQ-5.3 + TOV:** текущая подпись капсом «ОБЯЗАТЕЛЬНО» → переписать в cw-dict §3.17 формулировку «Без кейса страница не попадает в поиск» |
| `ServiceDistricts.localFaq` | array (max 5) | no | no | no | no | **publish-gate:** minRows для publish ≥ 2 (sa.md §5.2 / существующий hook); cw-dict §3.18 |
| `ServiceDistricts.localFaq[].question` | text | yes | no | no | no | maxLength 160 |
| `ServiceDistricts.localFaq[].answer` | richText | yes | no | no | no | — |
| `ServiceDistricts.localLandmarks` | array (max 6) | no | no | no | no | «Локальные ориентиры» |
| `ServiceDistricts.localLandmarks[].landmarkName` | text | yes | no | no | no | — |
| `ServiceDistricts.localPriceNote` | textarea (max 400) | no | no | no | no | «Примечание по цене для района» |
| `ServiceDistricts.leadParagraph` | richText | yes | **yes** («Lead 2-3 предложения…answer-first для GEO») | no | no | cw-dict §3.19 — переписать в TOV |
| `ServiceDistricts.uniquenessScore` | number (readOnly) | no | **yes** («Auto: % уникального…») | no | no | cw-dict §3.20 |
| `ServiceDistricts.publishStatus` | select | yes | no | no | no | 4 опции draft/review/published/archived; cw-dict §3.21 |
| `ServiceDistricts.noindexUntilCase` | checkbox | no | **yes** («Если miniCase нет…») | no | no | cw-dict §3.22 — переписать в TOV |
| `ServiceDistricts.isOrdMarked` | checkbox | no | **yes** («ОРД: рекламная…») | no | no | — |
| `ServiceDistricts.eridToken` | text | no | no | **yes (condition: isOrdMarked)** | no | условный — подпись c «нужно, если включена галка ОРД» (cw-dict §2.18) |

**Итог ServiceDistricts:** **16 полей / 10 нужна новая или переписанная подпись / 6 уже есть (переписать в TOV 5 из 6) / 1 white-list (`computedTitle` — но cw решил оставить подпись, поэтому белый список здесь по смыслу «можно оставить мягкую», не «опустить»).**

---

## 4. Cases (`site/collections/Cases.ts`, 16 видимых полей)

**REQ-7.1** — publish-gate кейса ≥ 1 медиа любого типа (ba.md §Interview delta). В коде сейчас `photosBefore.minRows: 1` и `photosAfter.minRows: 1` — это ужесточение, которое BA хочет ослабить. Сам `required` в коде не меняем (это задача вне US-3), но подпись пишем с новым правилом: «фото или видео минимум 1 из 3 форматов».

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Cases.slug` | text | yes | no | no | no | — |
| `Cases.title` | text (max 120) | yes | no | no | no | cw-operator-vocab §3.1: placeholder «Спил 2 тополей в Раменском, ЖК "Заря"» |
| `Cases.h1` | text (max 120) | no | no | no | no | «Заголовок на самой странице кейса» |
| `Cases.service` | relationship→services | yes | no | no | no | — |
| `Cases.district` | relationship→districts | yes | no | no | no | — |
| `Cases.dateCompleted` | date | yes | no | no | no | «Когда выполнили работу» |
| `Cases.brigade` | relationship→persons hasMany | no | no | no | no | «Бригада, которая работала» |
| `Cases.photosBefore` | array (minRows 1) | no | no | no | no | **REQ-7.1:** описать как «Фото "до" — одно из 3-х медиа-вариантов; если есть видео — фото можно опустить». Сам minRows менять не в US-3 |
| `Cases.photosBefore[].image` | upload→media | yes | no | no | no | 1600px по длинной, alt обязателен (cw-dict §3.30) |
| `Cases.photosBefore[].caption` | text | no | no | no | no | — |
| `Cases.photosAfter` | array (minRows 1) | no | no | no | no | **REQ-7.1:** та же логика |
| `Cases.photosAfter[].image` | upload→media | yes | no | no | no | — |
| `Cases.photosAfter[].caption` | text | no | no | no | no | — |
| `Cases.description` | richText | yes | no | no | no | «Что делали, как, чем доказываем» |
| `Cases.videoUrl` | text | no | **yes** («RuTube / YouTube») | no | no | переписать: «Ссылка на видео в RuTube, VK или YouTube» |
| `Cases.videoTranscript` | textarea | no | **yes** («Для GEO + VideoObject schema») | no | no | cw-dict §2.3 формулировка |
| `Cases.durationHours` | number | no | no | no | no | «Сколько часов делали работу» |
| `Cases.finalPrice` | number | no | **yes** («Только для аналитики, не публичное») | no | no | **cw-operator-vocab §4.3:** оператор сказал «учёт веду в CRM» → подпись в TOV: «Аналитический учёт. В публичную часть сайта не попадает» |
| `Cases.metaTitle` | text (max 60) | no | no | no | no | — |
| `Cases.metaDescription` | textarea (max 160) | no | no | no | no | — |
| `Cases.ogImage` | upload→media | no | no | no | no | — |

**Итог Cases:** **21 поле / 18 нужна подпись / 3 уже есть (все 3 переписать в TOV) / 0 white-list.**

---

## 5. Blog (`site/collections/Blog.ts`, 17 полей)

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Blog.slug` | text | yes | no | no | no | — |
| `Blog.title` | text (max 120) | yes | no | no | no | — |
| `Blog.h1` | text (max 120) | yes | no | no | no | — |
| `Blog.intro` | textarea (max 280) | yes | no | no | no | «Лид статьи 2-3 предложения» |
| `Blog.body` | richText | yes | no | no | no | «Основной текст статьи» |
| `Blog.author` | relationship→persons | yes | no | no | no | «Автор — для E-E-A-T» |
| `Blog.category` | select | yes | no | no | no | 7 опций |
| `Blog.tagsServices` | relationship→services hasMany | no | no | no | no | «Связанные услуги» |
| `Blog.tagsDistricts` | relationship→districts hasMany | no | no | no | no | «Связанные районы» |
| `Blog.publishedAt` | date | yes | no | no | no | — |
| `Blog.modifiedAt` | date | yes | no | no | no | «Дата последнего обновления — для datePublished/dateModified» |
| `Blog.heroImage` | upload→media | no | no | no | no | — |
| `Blog.ogImage` | upload→media | no | no | no | no | — |
| `Blog.metaTitle` | text (max 60) | no | no | no | no | — |
| `Blog.metaDescription` | textarea (max 160) | no | no | no | no | — |
| `Blog.faqBlock` | array (max 8) | no | no | no | no | — |
| `Blog.faqBlock[].question` | text | yes | no | no | no | — |
| `Blog.faqBlock[].answer` | richText | yes | no | no | no | — |
| `Blog.isHowTo` | checkbox | no | **yes** («Для HowTo schema») | no | no | переписать в TOV: «Включите, если статья — пошаговая инструкция. Даёт разметку HowTo для поиска» |
| `Blog.howToSteps` | array | no | no | **yes (condition: isHowTo)** | no | условный; подпись «Появляется, если галка выше» |
| `Blog.howToSteps[].name` | text | yes | no | conditional parent | no | — |
| `Blog.howToSteps[].text` | richText | yes | no | conditional parent | no | — |

**Итог Blog:** **22 поля / 21 нужна подпись / 1 уже есть (переписать) / 0 white-list.**

---

## 6. B2BPages (`site/collections/B2BPages.ts`, 11 полей)

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `B2BPages.slug` | text | yes | no | no | no | — |
| `B2BPages.title` | text | yes | no | no | no | **нет maxLength в коде** — флаг `be4`, обычно 120 |
| `B2BPages.h1` | text | yes | no | no | no | **нет maxLength** |
| `B2BPages.metaTitle` | text (max 60) | no | no | no | no | — |
| `B2BPages.metaDescription` | textarea (max 160) | no | no | no | no | — |
| `B2BPages.audience` | select | yes | no | no | no | 5 опций: УК/ТСЖ/FM/Застройщики/Госзакупки |
| `B2BPages.body` | richText | yes | no | no | no | — |
| `B2BPages.casesShowcase` | relationship→cases hasMany | no | no | no | no | «Витрина кейсов для этой аудитории» |
| `B2BPages.formConfig` | json | no | no | no | no | техническое; cw-dict §5.2 white-list кандидат, если оператор не редактирует |
| `B2BPages.contractTemplateUrl` | text | no | no | no | no | «Ссылка на шаблон договора в PDF» |
| `B2BPages.krishaShtraf` | checkbox | no | **yes** («Штрафы ГЖИ берём на себя по договору») | no | no | цитата = immutable B2B-крючок (CLAUDE.md); **оставить как есть** — TOV-ок, формулировка уже в стиле оператора; `cw` валидирует |

**Итог B2BPages:** **11 полей / 9 нужна подпись / 1 уже есть (оставить) / 1 white-list-кандидат (`formConfig` — подтвердить с `sa`).**

---

## 7. Persons (`site/collections/Persons.ts`, 11 полей)

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Persons.slug` | text | yes | no | no | no | — |
| `Persons.firstName` | text | yes | no | no | no | — |
| `Persons.lastName` | text | yes | no | no | no | — |
| `Persons.jobTitle` | text | yes | **yes** («Например: Главный арборист / Бригадир арбо / Бригадир промальп») | no | no | оставить — TOV-ок |
| `Persons.photo` | upload→media | no | no | no | no | — |
| `Persons.bio` | richText | no | no | no | no | «Био сотрудника — для E-E-A-T и страниц кейсов» |
| `Persons.knowsAbout` | array | no | no | no | no | — |
| `Persons.knowsAbout[].topic` | text | yes | no | no | no | — |
| `Persons.sameAs` | array | no | no | no | no | «Профили в Telegram/VK — для sameAs schema.org» |
| `Persons.sameAs[].url` | text | yes | no | no | no | — |
| `Persons.credentials` | array | no | no | no | no | «Сертификаты и допуски» |
| `Persons.credentials[].name` | text | yes | no | no | no | — |
| `Persons.credentials[].issuer` | text | no | no | no | no | «Кто выдал» |
| `Persons.credentials[].year` | number | no | no | no | no | — |
| `Persons.worksInDistricts` | relationship→districts hasMany | no | no | no | no | — |

**Итог Persons:** **15 полей / 14 нужна подпись / 1 уже есть / 0 white-list.**

---

## 8. Leads (`site/collections/Leads.ts`, 14 полей)

`Leads` читают только admin/manager. White-list-богатая коллекция — auto-computed и интеграционные поля.

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Leads.phone` | text (index) | yes | no | no | no | cw-dict §3.27 |
| `Leads.name` | text | no | no | no | no | — |
| `Leads.email` | email | no | no | no | no | — |
| `Leads.sourcePage` | text | no | no | no | no | «Откуда пришла заявка — URL страницы» |
| `Leads.service` | relationship→services | no | no | no | no | — |
| `Leads.district` | relationship→districts | no | no | no | no | — |
| `Leads.photos` | array | no | no | no | no | «Фото объекта, загруженные клиентом» |
| `Leads.photos[].s3Key` | text | no | no | no | **yes** | технический ключ S3 |
| `Leads.photos[].url` | text | no | no | no | no | «Публичная ссылка на фото» (если оператор открывает) |
| `Leads.preferredChannel` | select | no | no | no | no | cw-dict §3.28 |
| `Leads.estimateDraftJson` | json | no | no | no | **yes** | cw-dict §5.2 — служебный JSON |
| `Leads.amoCrmId` | text | no | no | no | **yes** | cw-dict §5.2 |
| `Leads.utmSource` | text | no | no | no | no | cw-dict §5.3: подпись только у `utmSource` «UTM-метка кампании, проставляется автоматически» |
| `Leads.utmMedium` | text | no | no | no | **yes** | cw-dict §5.3 |
| `Leads.utmCampaign` | text | no | no | no | **yes** | cw-dict §5.3 |
| `Leads.callTrackingId` | text | no | no | no | **yes** | cw-dict §5.2 |
| `Leads.status` | select | no | no | no | no | cw-dict §3.29 — 6 опций |
| `Leads.syncedAt` | date | no | no | no | **yes** | cw-dict §5.2 |
| `Leads.createdAt` | date (timestamps) | — | — | no | **yes** | Payload-internal |
| `Leads.updatedAt` | date (timestamps) | — | — | no | **yes** | Payload-internal |

**Итог Leads:** **19 видимых полей / 10 нужна подпись / 0 уже есть / 9 white-list (6 технических + 3 UTM-автоподстановка).**

---

## 9. Redirects (`site/collections/Redirects.ts`, 4 поля)

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Redirects.from` | text (unique) | yes | **yes** («/staraya-url/») | no | no | пример-only, добавить смысл: «Старый URL, который уходит в редирект» |
| `Redirects.to` | text | yes | **yes** («/novaya-url/ или абсолютный URL») | no | no | дописать «Куда ведём» |
| `Redirects.statusCode` | select | no | no | no | no | 3 опции 301/302/410 |
| `Redirects.note` | textarea | no | **yes** («Зачем переезд») | no | no | переписать в TOV: «Зачем сделали редирект — заметка для команды» |

**Итог Redirects:** **4 поля / 4 нужна подпись (3 из 4 — переписать) / 3 уже есть / 0 white-list.**

---

## 10. Media (`site/collections/Media.ts`, 4 видимых поля + upload-internal)

Upload-коллекция. Payload сам создаёт служебные поля `filename`, `mimeType`, `filesize`, `width`, `height`, `url`, `sizes.*` — в контракт `cw` **не включаем** (Payload-internal, оператор их видит, но редактировать не может; аналог Leads.createdAt).

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Media.alt` | text | yes | no | no | no | **критично для a11y** — `cw` обязательно пишет TOV-подпись: «Текст для alt — что на картинке. Помогает SEO и слепым пользователям» |
| `Media.caption` | text | no | no | no | no | «Подпись под изображением на странице» |
| `Media.geoLocation` | json | no | **yes** («EXIF GPS как [lon, lat]…ImageObject contentLocation») | no | no | переписать: «Координаты, где снято. Попадает в разметку поиска» |
| `Media.license` | select | no | no | no | no | 3 опции: собственное / cc-by / public-domain |
| `Media.filename` | text (upload-internal) | — | — | — | **yes** | Payload auto |
| `Media.mimeType` | text (upload-internal) | — | — | — | **yes** | Payload auto |
| `Media.filesize` | number (upload-internal) | — | — | — | **yes** | Payload auto |
| `Media.width` / `height` / `url` / `sizes.*` | — (upload-internal) | — | — | — | **yes** | Payload auto |

**Итог Media:** **4 видимых / 4 нужна подпись (1 переписать) / 1 уже есть / 6+ white-list (upload-internal).**

---

## 11. Users (`site/collections/Users.ts`, 2 видимых + auth-internal)

`auth: true` — Payload добавляет `email`, `password`, `hash`, `salt`, `loginAttempts`, `lockUntil`, `resetPasswordToken`, `resetPasswordExpiration`, `_verified`, `_verificationToken`. Все — в white-list §5.1. В user-defined fields — только `name` и `role`.

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `Users.email` | auth email | yes | no | no | **yes (пишем мягкую)** | Payload-auth; cw дубль не нужен, но можно «Корпоративный e-mail для входа» |
| `Users.password` | auth password | yes | — | — | **yes** | — |
| `Users.name` | text | no | no | no | no | «Имя для отображения в админке» |
| `Users.role` | select | yes | no | no | no | 4 опции: admin/manager/seo/content; **критично** — описать какая роль что может |
| `Users.hash`, `Users.salt`, `Users.loginAttempts`, `Users.lockUntil`, `Users.resetPasswordToken`, `Users.resetPasswordExpiration`, `_verified`, `_verificationToken` | auth-internal | — | — | — | **yes** | cw-dict §5.1 |

**Итог Users:** **4 user-facing поля / 2 нужна подпись / 0 уже есть / 8+ white-list (auth-internal + email «мягкая»).**

---

## 12. Global: SeoSettings (`site/globals/SeoSettings.ts`, 14 полей)

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SeoSettings.organization` | group | — | **yes** (group-level: «Юридическое имя для Organization JSON-LD…») | no | no | переписать в TOV |
| `SeoSettings.organization.name` | text (defaultValue 'Обиход') | no | no | no | no | «Название компании для разметки поиска» |
| `SeoSettings.localBusiness` | group | — | no | no | no | — |
| `SeoSettings.localBusiness.priceRange` | text (default '₽₽') | no | no | no | no | «Ценовой уровень — ₽, ₽₽, ₽₽₽» |
| `SeoSettings.localBusiness.geoRadiusKm` | number (default 150) | no | no | no | no | «Радиус рабочей зоны в км» |
| `SeoSettings.localBusiness.openingHours` | group | — | no | no | no | — |
| `SeoSettings.localBusiness.openingHours.opens` | text (default '08:00') | no | no | no | no | — |
| `SeoSettings.localBusiness.openingHours.closes` | text (default '21:00') | no | no | no | no | — |
| `SeoSettings.credentials` | array | — | no | no | no | «Лицензии и допуски — hasCredential schema.org» |
| `SeoSettings.credentials[].name` | text | yes | no | no | no | — |
| `SeoSettings.credentials[].issuer` | text | no | no | no | no | — |
| `SeoSettings.credentials[].documentUrl` | text | no | **yes** («PDF-скан в Media») | no | no | переписать |
| `SeoSettings.verification` | group | — | no | no | no | — |
| `SeoSettings.verification.yandexWebmaster` | text | no | no | no | no | «Код подтверждения Я.Вебмастера» |
| `SeoSettings.verification.googleSearchConsole` | text | no | no | no | no | — |
| `SeoSettings.verification.mailRu` | text | no | no | no | no | — |
| `SeoSettings.defaultOgImage` | upload→media | no | no | no | no | 1200×630 fallback для страниц без своей OG |
| `SeoSettings.organizationSchemaOverride` | json | no | no | no | **yes** | техническое, оператор не редактирует |
| `SeoSettings.indexNowKey` | text | no | **yes** («32-hex для IndexNow API») | no | no | переписать в TOV |
| `SeoSettings.robotsAdditional` | textarea | no | **yes** («Дополнительные правила…Clean-param…») | no | no | переписать |

**Итог SeoSettings:** **20 полей (включая group-контейнеры) / 18 нужна подпись / 4 уже есть (все переписать в TOV) / 1 white-list (`organizationSchemaOverride`).**

---

## 13. Global: SiteChrome (`site/globals/SiteChrome.ts`, ~58 полей в tabs)

**Самая большая структура** — 4 tabs (Header, Footer, Контакты, Реквизиты, Соцсети — фактически 5 логических зон), глубокая вложенность, factory `menuItemArrayField` порождает одинаковые подполя в `header.menu`, `footer.columns[].items`. Служебные поля `validate` не считаем в итогах. Подсчёт ведётся по **визуальной поверхности** для оператора.

### 13.1 Tabs и tab-level description

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome` (root) | global | — | **yes** («Всё, что про рамку сайта…») | no | no | переписать в TOV |
| `SiteChrome[Tab: Header]` | tab | — | no | no | no | описать tab (REQ-2.2) |
| `SiteChrome[Tab: Footer]` | tab | — | no | no | no | — |
| `SiteChrome[Tab: Контакты]` | tab | — | **yes** («Телефон и e-mail. Инвариант: телефон обязателен.») | no | no | переписать в TOV |
| `SiteChrome[Tab: Реквизиты]` | tab | — | **yes** («Для B2B и JSON-LD. Заполнить после регистрации юрлица.») | no | no | оставить почти как есть |
| `SiteChrome[Tab: Соцсети и мессенджеры]` | tab | — | **yes** («Порядок управляется drag-and-drop. Инвариант: Telegram + MAX + WhatsApp обязательны.») | no | no | переписать в TOV |

### 13.2 Header tab

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome.header` | group | — | no | no | no | — |
| `SiteChrome.header.menu` | array | — | **yes** (factory: «anchor → #..., route → <Link>, external → новая вкладка») | no | no | переписать в TOV — слишком техничная |
| `SiteChrome.header.menu[].kind` | select | yes | no | no | no | 3 опции; cw-dict §2.7 |
| `SiteChrome.header.menu[].label` | text (max 20) | yes | no | no | no | «Что увидит человек в меню» |
| `SiteChrome.header.menu[].anchor` | text (max 40) | no | **yes** («Без символа #...») | **yes (kind=anchor)** | no | переписать |
| `SiteChrome.header.menu[].route` | text (max 120) | no | **yes** («Начинается с /...») | **yes (kind=route)** | no | переписать |
| `SiteChrome.header.menu[].url` | text (max 500) | no | **yes** («Полный URL со схемой https://») | **yes (kind=external)** | no | переписать |
| `SiteChrome.header.cta` | group (label «CTA-кнопка в шапке») | — | no | no | no | — |
| `SiteChrome.header.cta.label` | text (max 24, default 'Замер бесплатно') | no | no | no | no | — |
| `SiteChrome.header.cta.kind` | select | no | no | no | no | 3 опции |
| `SiteChrome.header.cta.anchor` | text (max 40, default 'calc') | no | no | **yes (kind=anchor)** | no | — |
| `SiteChrome.header.cta.route` | text (max 120) | no | no | **yes (kind=route)** | no | — |
| `SiteChrome.header.cta.url` | text (max 500) | no | no | **yes (kind=external)** | no | — |

### 13.3 Footer tab

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome.footer` | group | — | no | no | no | — |
| `SiteChrome.footer.slogan` | textarea (max 200) | no | no | no | no | — |
| `SiteChrome.footer.columns` | array (max 4) | no | no | no | no | «Колонки футера — до 4» |
| `SiteChrome.footer.columns[].title` | text (max 24) | yes | no | no | no | — |
| `SiteChrome.footer.columns[].items` | array (factory) | — | **yes** (та же factory-подпись) | no | no | — |
| `SiteChrome.footer.columns[].items[].kind` | select | yes | no | no | no | — |
| `SiteChrome.footer.columns[].items[].label` | text (max 20) | yes | no | no | no | — |
| `SiteChrome.footer.columns[].items[].anchor` | text (max 40) | no | **yes** (factory) | **yes** | no | — |
| `SiteChrome.footer.columns[].items[].route` | text (max 120) | no | **yes** (factory) | **yes** | no | — |
| `SiteChrome.footer.columns[].items[].url` | text (max 500) | no | **yes** (factory) | **yes** | no | — |
| `SiteChrome.footer.privacyUrl` | text (max 200, default '/politika-konfidentsialnosti/') | no | no | no | no | — |
| `SiteChrome.footer.ofertaUrl` | text (max 200, default '/oferta/') | no | no | no | no | — |
| `SiteChrome.footer.copyrightPrefix` | text (max 60, default '© Обиход,') | no | **yes** («Префикс копирайтной строки. Год добавляется автоматически.») | no | no | оставить |

### 13.4 Контакты tab

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome.contacts` | group | — | no | no | no | — |
| `SiteChrome.contacts.phoneDisplay` | text (max 20) | yes | **yes** («Как видит человек, например +7 (985) 170-51-11») | no | no | оставить — TOV-ок |
| `SiteChrome.contacts.phoneE164` | text (max 16) | yes | **yes** («Для tel: и JSON-LD. Формат E.164: +7XXXXXXXXXX») | no | no | переписать: «Телефон для клика и поиска. Формат: +7 и 10 цифр без пробелов» |
| `SiteChrome.contacts.email` | email | no | **yes** («Опционально. Если заполнен — рендерится в футере») | no | no | переписать |

### 13.5 Реквизиты tab

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome.requisites` | group | — | no | no | no | — |
| `SiteChrome.requisites.legalName` | text (max 120) | no | **yes** («Например ООО "Обиход-МО"…») | no | no | оставить |
| `SiteChrome.requisites.taxId` | text (max 12, default '7847729123') | yes | **yes** («временный ИНН…») | no | no | оставить (MEMORY.md — временный) |
| `SiteChrome.requisites.kpp` | text (max 9) | no | **yes** («Заполнить после регистрации юрлица») | no | no | оставить |
| `SiteChrome.requisites.ogrn` | text (max 15) | no | **yes** («Заполнить после регистрации юрлица») | no | no | оставить |
| `SiteChrome.requisites.addressRegion` | text (max 80) | no | **yes** («Напр. Московская область») | no | no | оставить |
| `SiteChrome.requisites.addressLocality` | text (max 80) | no | **yes** («Напр. Одинцово») | no | no | оставить |
| `SiteChrome.requisites.streetAddress` | text (max 200) | no | **yes** («Улица, дом, корпус») | no | no | оставить |
| `SiteChrome.requisites.postalCode` | text (max 10) | no | no | no | no | «Почтовый индекс — 6 цифр» |

### 13.6 Соцсети tab

| field path | type | req | has desc? | cond? | wl | note |
|---|---|---|---|---|---|---|
| `SiteChrome.social` | array | — | no | no | no | — |
| `SiteChrome.social[].type` | select | yes | no | no | no | 7 опций: tg/max/wa/vk/yt/zen/other; cw-dict §2.7 |
| `SiteChrome.social[].url` | text (max 500) | yes | no | no | no | «Ссылка на канал» |

**Итог SiteChrome:** **~41 видимое поле + 6 tab/group-контейнеров = 47 подписей / ~31 нужна подпись / ~16 уже есть (factory-подписи дублируются; переписать в TOV 12) / 0 white-list.**

Примечание по factory: одна и та же подпись в `header.menu[]` / `footer.columns[].items[]` — `cw` пишет **одну** формулировку, factory её раздаёт везде. Это **снижает** реальную работу примерно на 5 полей.

---

## 14. Сводная таблица

| Коллекция / Global | Всего видимых полей | Нужна подпись | Уже есть (из них переписать) | White-list |
|---|---:|---:|---:|---:|
| Services | 23 | 23 | 0 (0) | 0 |
| Districts | 20 | 11 | 9 (2) | 0 |
| ServiceDistricts | 16 | 10 | 6 (5) | 1 |
| Cases | 21 | 18 | 3 (3) | 0 |
| Blog | 22 | 21 | 1 (1) | 0 |
| B2BPages | 11 | 9 | 1 (0) | 1 |
| Persons | 15 | 14 | 1 (0) | 0 |
| Leads | 19 | 10 | 0 (0) | 9 |
| Redirects | 4 | 4 | 3 (3) | 0 |
| Media | 4 | 4 | 1 (1) | 6+ (upload-internal) |
| Users | 4 | 2 | 0 (0) | 8+ (auth-internal) + email мягкая |
| **Collections subtotal** | **159** | **126** | **25 (15 переписать)** | **25+** |
| SeoSettings | 20 | 18 | 4 (4) | 1 |
| SiteChrome | 47 | 31 | 16 (12) | 0 |
| **Globals subtotal** | **67** | **49** | **20 (16 переписать)** | **1** |
| **TOTAL** | **226** | **175** | **45 (31 переписать)** | **26+** |

### Интерпретация

- **Новых подписей `cw` пишет ≈ 175** (из них 31 — правка существующих под TOV).
- **26+ полей white-list** — Payload-internal, auth-internal, upload-internal, интеграционные (amoCrmId, callTrackingId, syncedAt, estimateDraftJson, utmMedium/Campaign без описания).
- Payload-internal служебка (`id`, `createdAt`, `updatedAt`, `_status`, `_versions*`) в подсчёт НЕ включена — её Payload рендерит сам, оператор их видит, но они универсально в white-list §5.1.
- На 175 подписей при темпе 50/день (см. SA-Q к `cw` ниже) = **3-4 рабочих дня** чистой работы `cw`; c учётом TOV-ревью и коллизий — закладываем **5 дней** для первой волны, 10-15% (≈ 18 подписей) допускается TODO-stub согласно AC-3.2.6.

---

## 15. Флаги `be4` — расхождения кода и ba/sa

Для `po` и `sa` — не блокеры, но требуют подтверждения до implementation.

1. **`Services.priceTo` required** в коде, но REQ-7.2 требует его опциональным. Исправляем в US-3 или отдельной задачей? — см. SA-Q ниже.
2. **`Districts.localPriceAdjustment` vs `priceCoefficient`** — REQ-7.2 упоминает `priceCoefficient` как «скрытый collapsible "Для калькулятора"». Поле в коде называется иначе и не скрыто. Переименовывать в US-3 или оставить + документировать как есть?
3. **`Cases.photosBefore.minRows: 1` и `photosAfter.minRows: 1`** — REQ-7.1 требует ослабления до «≥ 1 медиа любого типа (фото или видео)». Меняем схему в US-3 или только подпись + фронт-гейт?
4. **`B2BPages.title/h1` без `maxLength`** — консистентность с остальными коллекциями (обычно 120).
5. **`Services.intro.required: true`** — это будущий кандидат на миграцию в `blocks[]` (sa.md §9.1). В US-3 оставляем как есть, zero-downtime.
6. **`versions.drafts.autosave`** есть только на `Services` (2s) и `Blog` (без interval). На Blog — включить interval 5s для консистентности? — вопрос к `sa`.
7. В **8 коллекциях из 11** нет `beforeValidate` publish-gate кроме `ServiceDistricts`. Добавление `buildPublishGate()` по sa.md §5.4 — часть US-3 implementation, но для Persons/Leads/Redirects/Media/Users это не нужно (они не публичные страницы).

---

## 16. Вопросы к другим ролям

### К `sa`

1. **Финальный формат `admin.description` для полей с `admin.condition`.** Когда условие активно — пишем одну подпись; когда поле невидимо — Payload не рендерит, но `admin.description` хранится в схеме. Нужна ли формулировка-условие («Появляется, если …») или достаточно описания самого поля? cw-dict §2.18 даёт формулу, но там нет пример для случая, когда условие завязано на другой группе (например, `howToSteps.name` внутри скрытого `howToSteps`, условного от `isHowTo`).
2. Подтверждение расхождений §15 пп. 1-4 — правим в US-3 или отдельными задачами?
3. White-list-кандидат `B2BPages.formConfig` — оператор редактирует или только разработчик?
4. Нужна ли подпись на tab-level в `SiteChrome` (AC-3.2.6 молчит) — да/нет?

### К `tamd`

1. **Библиотека автосклонения падежей.** BA Interview delta (3 доп. находки) просит petrovich или аналог. Вариант: `petrovich-ru` (npm) — активно maintained, node-compat. Альтернатива: `morpher.ru` (платный API, сетевой вызов). Рекомендация: `petrovich-ru` как primary, JSON-табличка исключений для Подмосковья как override. Нужен ADR-0004 или достаточно решения через PoC-6?
2. Русская локаль Payload 3 (`@payloadcms/translations` + `ru`-пак) — включена? Если нет — включить в US-3 или отдельной задачей?

### К `ui`

1. Первые макеты `DashboardTile` (REQ-1.1, 6 карточек 3×2), `BlockPaletteCard` (REQ-6.2, сетка 2-3 кол), `SectionalHeroTemplate` (для PoC-1 временной коллекции `_PocPages` — минимальный визуал). Без макетов PoC-1 делаем «как получится», переделаем потом.
2. Визуал для Dashboard-tile vs sidebar (REQ-7.3) — tile = core entry-point.

### К `art`

1. Иконки для 11 коллекций и 15 типов блоков. Placeholder из Lucide (`lucide-react`, уже в `site/` через shadcn) — подтверждаешь? Минимум: для Dashboard-tile, для AddBlockPalette, для sidebar групп `01 · Заявки` / `02 · Контент` / `03 · Медиа` / `04 · SEO` / `05 · Рамка сайта` / `09 · Система`.

### К `cw`

1. **Темп 50 полей/день подтверждает?** — итого 175 новых подписей + 31 переписать = 206 строк × 5 дней = 42/день. Укладываемся в 3-4 дня при темпе 50; 10-15% TODO допустимо на релиз (AC-3.2.6). Подтверждаешь или пересматриваешь?
2. В Cases `finalPrice` — подпись «для аналитики, не публичное» оставляем или заменяем на формулу оператора из cw-operator-vocab §4.3 («учёт в CRM, в админку пишу, если надо»)?
3. White-list `Leads` UTM — описать только `utmSource` (cw-dict §5.3). Оставляем правило или описываем все три, если оператор их регулярно читает?
4. `B2BPages.krishaShtraf` подпись «Штрафы ГЖИ берём на себя по договору» — immutable-цитата (CLAUDE.md B2B-крючок). Не трогаем?

### К `qa2`

1. В плане выборочной проверки 30 полей из разных коллекций — какая метрика passing? Предлагаю: 0 anti-TOV + 0 подписей > 200 символов + 0 пустых `admin.description` (кроме white-list).

---

## 17. Handoff

- `be4 → cw` (сейчас): методично идти по §1-§13. Для каждого «нужна подпись» — готовая формулировка по cw-dict §2 формулам + §3 примерам. Для «переписать» — взять существующую, прогнать через TOV.
- `be4 → po` (сейчас): подтверждение расхождений §15 до старта implementation. Без ответа на пп.1-3 — `be4` не трогает схему, пишет только новые поля (`blocks[]`) по sa.md §9.
- `cw → qa2` (после сдачи): список из 30 рандомных полей для TOV-ревью.
