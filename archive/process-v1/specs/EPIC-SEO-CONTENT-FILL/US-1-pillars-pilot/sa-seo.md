---
us: US-1
epic: EPIC-SEO-CONTENT-FILL
title: Stage 1 — 4 pillar + 4 priority-A districts + 4 pilot SD + 5 cornerstone blog M1 + статика + /foto-smeta/
team: seo
po: poseo
sa: sa-seo
type: content
phase: spec
role: sa-seo
status: open
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish_w7: 2026-05-29
blocks: [US-2-sub-and-programmatic, US-3-b2b-cases-extras]
blocked_by: []
related: [US-0-templates-ux-migration, US-6-competitor-benchmark]
skills_activated: [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]
---

# US-1 · Stage 1 W4-W7 — Pillars + Priority-A Districts + Pilot SD + Cornerstone Blog M1 + Статика + /foto-smeta/

> **Master-документ Stage 1 эпика `EPIC-SEO-CONTENT-FILL`.** Это первый production-конвейер: после US-0 (фундамент-завод) US-1 — первая партия продукции на 16 текстов (~37 000 слов) + ~25 hero + 5 blog covers + W7 mid-benchmark. После US-1 страт-этап: пилотные шаблоны опережают ≥1 ось из 5 у топ-3 конкурентов; Stage 2 (US-2) масштабирует подход на 33 sub-services + ~96 SD batch.

## 1 · Цель US-1

Произвести **первый production-конвейер контента**, который превращает 8 утверждённых W3 эталонов в 16 рабочих страниц с реальными лидогенерационными свойствами. Каждый из 16 URL — конверсионная посадочная (lead-form ИЛИ cta-banner на `/foto-smeta/`) с конкретными цифрами, winning angle vs топ-3 и валидной schema. К W7 закрываем ≥40% URL-gap к топ-3 + опережаем ≥1 ось из 5 (URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage). Без US-1 невозможна DoD-метрика эпика «опережение топ-3 по ≥3 из 5 осей к W14»: US-2/3 наращивают объём на проверенный шаблон, US-1 проверяет шаблон на 16 живых URL вместо 8 эталонов.

## 2 · Бизнес-цель

Operator mandate (2026-05-02 14:00): **«сайт который конверит, приносит лиды и обгоняет конкурентов»**. Все остальные цели (SEO, schema, нейро-цитируемость) — следствия.

Из этого следует строгое требование к каждой из 16 страниц:

| Требование | Почему | Где проверяется |
|---|---|---|
| lead-form блок ИЛИ cta-banner на `/foto-smeta/` | без CTA-блока страница не приносит лиды | AC-1.5 / AC-2.6 / AC-3.5 / AC-4.6 / AC-5.1 |
| Конкретные цифры («12 800 ₽ за объект»), не «от X ₽» | TOV §13 #2; «от X ₽» — анти-TOV | AC-11.1 (TOV-checker) |
| Winning angle vs топ-3 из differentiation-matrix | без него — копия конкурентов, нет смысла наполнять | AC-1.10 / AC-2.5 / AC-3.2 / AC-4.6 / AC-5.2 |
| Schema (Service / FAQPage / BreadcrumbList min) | nейро-цитируемость + Я.ВебМастер 0 ошибок | AC-1.12 / AC-2.7 / AC-3.7 / AC-4.8 / AC-7.1 |
| Design-system §1-14 compliance (operator reminder) | tokens / иконки / TOV / анти-§14 | AC-11 (вся группа) |

US-1 == «первый завод-цех, который выпускает рабочую продукцию» (vs US-0 «фундамент под завод»). Качество цеха проверяется на 16 URL: если шаблон ломается на pilot — Stage 2 сваливается в demote. Поэтому W7 mid-benchmark — **hard gate** оператора.

## 3 · Scope

### 3.1 · 4 Pillar full content (~12 000 слов)

| URL | Объём | Cluster wsfreq | Главные H2-секции (target keys) | Winning angle |
|---|---|---|---|---|
| `/vyvoz-musora/` | ~3000 слов | 161 781 (102 789 на head) | Цены и виды мусора · Как работает 4-в-1 · Сроки и районы МО · Stroika/КГМ/мебель/сад · FAQ | 4-в-1 cross-sell + foto-smeta CTA × 2 (никто из 17 не делает) |
| `/arboristika/` | ~3000 слов | 27 589 (11 228 на «спил деревьев») | Спил/корчёвка/санитарная · Закон и разрешение · Цены за объект · Сезонность · FAQ | Cross-link на `/b2b/shtrafy-gzhi-oati/` (B2B-крючок штрафы ГЖИ — 0/17) |
| `/chistka-krysh/` | ~2000 слов | 888 (низкий, обязателен для 4-в-1) | Зимняя сезонность · УК/ТСЖ договор · Цены за м² · Промальпинизм · FAQ | B2B-связка с УК/ТСЖ через `/b2b/uk-tszh/` + штрафы ГЖИ |
| `/demontazh/` | ~1500 слов | 225 (4-й pillar по wsfreq) | Дача · Гараж · Стена · Демонтаж + вывоз = 1 договор · FAQ | Демонтаж + вывоз одной бригадой (vs `demontazhmsk.ru` — отдельный подрядчик на вывоз) |

**Все 4:** breadcrumbs + hero + tldr + services-grid (4-9 sub-cards с иконками §9) + text-content (≥800 слов) + lead-form + mini-case ≥1 + cta-banner /foto-smeta/ + faq (5+ Q&A) + related-services (2-3 cross-link).

### 3.2 · 4 priority-A Districts (~6 000 слов)

| URL | Объём | wsfreq | Specific |
|---|---|---|---|
| `/raiony/odincovo/` | ~1500 слов | 644 (A-priority) | Эталон W3 → расширить до full hub |
| `/raiony/krasnogorsk/` | ~1500 слов | A-priority | landmark (Павшинская пойма + Красногорский ЖК) |
| `/raiony/mytishchi/` | ~1500 слов | A-priority | landmark (Мытищинский залив, Перловка) |
| `/raiony/ramenskoye/` | ~1500 слов | A-priority | landmark (раменское поле, Гжельская керамика) |

**Каждый:** breadcrumbs + hero (с landmark, без бригады per art R1 W2) + tldr + services-grid (4 pillar × cross-link на `/<service>/<district>/`) + text-content (локальная команда + опыт + конкретика) + neighbor-districts (3 ближайших из `District.relatedDistricts`/`neighborDistricts`) + lead-form (с дефолтным district) + mini-case (≥2; один реальный, один generic с TODO).

**Schema:** Service + FAQPage + BreadcrumbList + LocalBusiness (с geo + areaServed).

### 3.3 · 4 pilot SD Одинцово (~5 000 слов) — programmatic-pilot

| URL | Объём | Status | Specific |
|---|---|---|---|
| `/vyvoz-musora/odincovo/` | ~1200 слов | W3 эталон → расширить до publish-ready | 50% shared base + 50% district-specific |
| `/arboristika/odincovo/` | ~1200 слов | Новый | landmark + время выезда + locallaw МО |
| `/chistka-krysh/odincovo/` | ~1200 слов | Новый | зимний context + УК Одинцово |
| `/demontazh/odincovo/` | ~1200 слов | Новый | дачный contextus (Одинцовский округ дачи) |

**Все 4 проходят publish-gate:** 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq.

**Schema:** Service + FAQPage + LocalBusiness (with district) + BreadcrumbList.

**Critical:** 50% shared base (методология услуги) + 50% district-specific (время выезда из бригадной точки + локальные landmarks + законодательство МО vs МСК + конкретный кейс района) — anti Scaled Content Abuse.

### 3.4 · 5 cornerstone blog M1 (~7 500 слов)

| # | URL | Cluster | Target key | wsfreq | Why cornerstone |
|---|---|---|---|---|---|
| 1 | `/blog/4-v-1-uslugi/` | C1 | «4 в 1 услуги» | 7947 | Brand-cluster + входная точка в /foto-smeta/ |
| 4 | `/blog/mozhno-li-spilit-derevo-na-svoem-uchastke/` | C2 (47 keys) | «можно ли спилить дерево на своём участке» | 0 (Wave 2 не дозабрала) | 47-keyword cluster, B2C-аудитория |
| 5 | `/blog/shtraf-za-spil-bez-razresheniya/` | C2 | «штраф за спил без разрешения» | 0 | High-intent, мост в /b2b/shtrafy-gzhi-oati/ |
| 6 | `/blog/razreshenie-na-spil-moskovskaya-oblast/` | C2 | «разрешение на спил Московская область» | 0 | Геолокальный info → commercial bridge |
| 11 | `/blog/smeta-za-10-minut/` | C1 расширение | «смета по фото» | 0 | USP CR-driver, единственная посадочная под /foto-smeta/ |

**Каждый ~1500 слов:** breadcrumbs + hero (H1 + автор + дата + cover) + tldr (2-3 предложения) + text-content (H2 ≥4 секций с target keys, списки/таблицы для нейро-парсинга) + faq (3-5 Q&A) + cta-banner /foto-smeta/ + related-services (2-3 ссылки на pillar/sub).

**Author:** «Бригада вывоза Обихода» (company-page из US-0) — для всех 5 М1 cornerstone.

**Schema:** Article + Person/Organization + BreadcrumbList + FAQPage.

### 3.5 · Главная + статика + /foto-smeta/ (~7 500 слов)

| URL | Объём | Spec |
|---|---|---|
| `/` | ~2500 слов | hero (4-в-1 USP + foto-smeta primary CTA) + services-grid (4 pillar) + benefits (СРО / договор / штрафы — ≥3) + foto-smeta CTA-banner #1 + testimonials/cases-recent (≥2 mini-case) + lead-form + neighbor-districts (4 priority-A) |
| `/foto-smeta/` | ~1500 слов | USP-pillar (0/17 конкурентов) — hero + tldr + 4-step process (фото → смета → бригада → закрытие) + benefits + faq + lead-form (TG/MAX/WA) |
| `/o-kompanii/` | ~1000 слов | Миссия + 4-в-1 + год основания + объёмы конкретные + cta-banner |
| `/kak-my-rabotaem/` | ~800 слов | 4-step process с иконками §9 + примеры на каждом шаге + cta-banner |
| `/garantii/` | ~600 слов | Штрафы ГЖИ/ОАТИ на нас + договор + ответственность + faq |
| `/sro-licenzii/` | ~400 слов | Список документов с issuer + СРО номер + страховка + лицензия Росприроднадзора |
| `/komanda/` | ~400 слов | Company-page mention + Authors cross-link + контакт оператора |
| `/park-tehniki/` | ~300 слов | Техника с фото/иконками + ГЛОНАСС + связка «бригада + техника» |

### 3.6 · Out-of-scope (детально)

- **33 sub-services** (vyvoz-musora 9 + arboristika 12 + chistka-krysh 6 + demontazh 6) — US-2 W8-W9
- **B2B 10 страниц** (`/b2b/` + 4 segments + dogovor + shtrafy + dogovor-na-sezon + 3 кейс-страницы) — US-3 W11
- **8-12 cases pack** (по 2 на pillar, B2C+B2B mix) — US-3 W11
- **~96 SD batch priority-A** (4 districts × ~24 sub) — US-2 W10
- **4 priority-B districts + ~60 SD** (Химки / Пушкино / Истра / Жуковский) — US-4 W12-W13
- **Blog M2 / M3** (статьи #12-30) — US-3 / US-5
- **E-E-A-T артефакты** (`seosite/06-eeat/` + `07-neuro-seo/` + `08-monitoring/`) — US-5 W14
- **Real images replacement** placeholder → реальные фото бригад на объектах — постепенно через fal.ai в течение Stage 1-3 (US-1 фиксирует placeholder с TODO)
- **Calculator реальная логика** (placeholder из US-0 остаётся) — отдельная US с pa-site
- **Avtovyshka × 4 priority-A** programmatic — US-3 W11
- **/raschet-stoimosti/** + 4 калькулятора — US-3 W11
- **/promyshlennyj-alpinizm/**, `/arenda-tehniki/`, `/porubochnyj-bilet/` — US-3 W11

## 4 · Tracks (5 параллельных)

US-1 — первый US с production-конвейером, поэтому tracks поделены не по командам (как в US-0), а по типам deliverable. Это снижает координационные накладные расходы (cw не ждёт art не ждёт seo-tech, каждый берёт свой track и идёт). PO orchestration по iron rule #7.

### 4.1 · Track A — Content Production (owner: cw + seo-content)

**Цель:** 16 текстов (~37 000 слов) на TOV-checker exit 0; 100% review pillar/cornerstone от cw, 20% sampling SD/districts.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| 4 pillar full content | seo-content brief → cw write | Payload `Services.blocks` через cms; черновики в `site/content/stage1-w4w5/<slug>.json` | TOV-check pass; cw 100% review; word-count ±20% |
| 4 priority-A districts | seo-content brief → cw write | Payload `Districts.blocks` через cms; черновики в `site/content/stage1-w5/<district>.json` | TOV-check pass; cw 100% review; LocalBusiness data (geo) |
| 4 pilot SD Одинцово | seo-content brief → cw write | Payload `ServiceDistricts.blocks` (или `Services.subServices` extension — закрытое решение из US-0 hand-off log) | publish-gate pass; 50%/50% shared/specific; cw 20% sampling (1 из 4 full review) |
| 5 cornerstone blog M1 | seo-content brief → cw write | Payload `Blog.blocks` | TOV-check pass; cw 100% review; FAQ schema slot |
| Главная + статика + /foto-smeta/ | seo-content brief → cw write | Payload `Pages.blocks` (для /, /o-kompanii/, /kak-my-rabotaem/, /garantii/, /sro-licenzii/, /komanda/, /park-tehniki/, /foto-smeta/) или `Services` для /foto-smeta/ если решено как pillar | TOV-check pass; cw 100% review для главной + /foto-smeta/ |

**Hand-off с другими tracks:**
- W4 W1: art apruv первой партии fal.ai prompts (Track B-1) → cw может писать с альтами hero
- W5 W1: fe-site BlockRenderer ext + Payload-схема готовы → cms может seed
- W7: TOV-checker + lint:schema CI green → publish status flip готов

### 4.2 · Track B — Visual Production (owner: art + cms через fal.ai)

**Цель:** ~25 hero + 5 blog covers + 2 author avatars (если новые) сгенерированы через fal.ai с art-apruv стиля cohesive.

| Deliverable | Owner | Tool | Acceptance |
|---|---|---|---|
| ~25 hero (4 pillar + 4 districts + 4 SD + 6 статика + /foto-smeta/) | art apruv стиля → cms через `site/lib/fal/prompts.ts` | Nano Banana Pro (1280×720 или 16:9) | art apruv каждого batch (cohesive style across 25); §14 анти-паттерны не присутствуют |
| 5 blog covers (M1 cornerstone) | art apruv → cms | Standard (1200×630, OG-image format) | art apruv batch; alt + license + geo в Payload Media |
| 2 author avatars если новые (placeholder из US-0 остаётся, замена при apruv оператора) | art apruv → cms | `companyAuthorAvatarPrompt` (silhouette/back-shot) | Placeholder подходит для US-1; реальные photos — backlog при apruv оператора |

**Critical anti-patterns (per art W2 changes US-0 + brand-guide §14):**
- ❌ Никаких stock photos
- ❌ Никаких людей с лицами
- ❌ Никаких рукопожатий (B2B-штамп)
- ❌ Никаких рукавиц / топора / бензопилы
- ❌ Никаких эко-зелёных + листочков (generic эко-подрядчик)
- ❌ Никаких рыцарей / щитов / гербов
- ❌ Никаких градиентов в primary
- ❌ Никаких матрёшек / берёзок (лубочная русскость)
- ✅ Documentary style: реальные сценки бригад на объектах (без лиц)
- ✅ District hero: landmark only (per art R1 W2)
- ✅ B2B hero: documentary без рукопожатий (per art W2)
- ✅ Author silhouette / back-shot

**Hand-off с другими tracks:**
- W4 W1: первая партия (4 pillar hero) → art apruv до W4 W2 → разблокировка остальных
- W5 W1: 4 districts + 4 SD batch → art apruv W5 W2
- W6 W1: 5 blog covers + 6 статика hero + /foto-smeta/ hero → art apruv W6 W2

### 4.3 · Track C — Tech SEO (owner: seo-tech)

**Цель:** schema 0 errors на 16 страницах + redirect chain check + sitemap.xml расширение + lint:schema жёсткий gate с staging W2 (после US-0 continue-on-error).

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| schema validation 16 pages | seo-tech | `pnpm lint:schema --sample 16` или `--urls=<list>` | exit 0 на 16 URL; report `screen/stage1-W7/lint-schema-report.json` |
| sitemap.xml расширение | seo-tech | автогенерация `site/app/sitemap.ts` (existing) | 16 новых URL с priority по wsfreq (vyvoz-musora 1.0, arboristika 0.9, ...) |
| Canonical на каждой странице | seo-tech | `site/app/(marketing)/<route>/page.tsx` через generateMetadata | self-canonical; нет circular |
| Redirect chain check | seo-tech | `pnpm tsx scripts/check-redirects.ts` (новый или existing) | `ochistka-krysh` → `chistka-krysh` 301 без chain (US-0 закрыл, но проверяем после US-1 publish) |
| Я.ВебМастер «Структурированные данные» | seo-tech (manual) | seosite/08-monitoring/ya-vebmaster-W7.md | 0 ошибок на 16 URL после Я.ВебМастер crawl |
| lint:schema CI gate жёсткий | seo-tech | `.github/workflows/ci.yml` removed `continue-on-error` | После W7 staging — `lint:schema` блокирующий, не warning |

**Hand-off с другими tracks:**
- W6: sitemap autogen после первых публикаций (cms publish status flip) → seo-tech проверяет
- W7 W1: seo-tech запускает lint:schema на 16 URL → блокер для publish status flip

### 4.4 · Track D — Publish (owner: cms)

**Цель:** seed-content расширение, publish status flip, Authors company-page bio finalize, реальные данные оператора апдейт (если operator передаст до W7).

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| `seed:etalons:prod` или `seed:content:stage1` extended | cms + seo-tech | `site/scripts/seed-content-stage1.ts` (новый) или `seed-content-etalons.ts` extension | Idempotent (findOneBySlug); safety-gate `OBIKHOD_SEED_CONFIRM=yes`; loads from `site/content/stage1-*/<slug>.json` |
| 16 страниц `_status: published` в Payload | cms | админка или `seed:content:stage1` | Все 16 видны на `obikhod.ru/<url>/` (или staging если operator deploy готов) |
| Authors company-page bio finalize | cw + cms | Payload `Authors` collection | bio ~200 слов; TOV-check pass; sameAs — operator передал до W7 (если нет — placeholder с TODO) |
| Бригадир «Александр» в district-hub odincovo placeholder replace | cms (operator передаёт реальное имя) | `site/content/stage1-w5/odincovo.json` или Payload field | Реальное имя ИЛИ подтверждённый placeholder с явным TODO в admin notes |

**Hand-off с другими tracks:**
- W6 W2: cms запускает `seed:content:stage1` после Track A финализации
- W7 W1: publish status flip → блокер для Track E benchmark

### 4.5 · Track E — Benchmark + QA (owner: re + seo-content + qa-site)

**Цель:** W7 mid-check 17 конкурентов через Keys.so + Topvisor (после operator передаст creds — fallback deep-profiles + Я.ВебМастер baseline + manual SERP); Playwright screenshots + axe в `screen/stage1-W7/`; differentiation-matrix update.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| W7 mid-benchmark 17 конкурентов | seo-content + re | `seosite/01-competitors/benchmark-W7-mid.md` | 5 осей × 17, % closure URL-gap к топ-3 (≥40%), ≥1 ось из 5 в опережении |
| differentiation-matrix.md update | seo-content | `seosite/01-competitors/differentiation-matrix.md` | Обновление W7 (vs W3 baseline) с реальными цифрами после live audit |
| Playwright screenshots 16 URL × {desktop, mobile} = 32 PNG | qa-site | `screen/stage1-W7/<slug>-{desktop,mobile}.png` | Все 32 PNG созданы; 1920×1080 desktop / 375×812 mobile |
| axe-core scan 16 URL | qa-site | `screen/stage1-W7/axe-violations-<slug>.json` | 0 critical / 0 serious из блочного контента (legacy chrome contrast — не зона; backlog US-A11Y-CHROME-CONTRAST) |
| CR-pathways verify | qa-site | inline в `screen/stage1-W7/cr-pathways-report.md` | blog→pillar→lead-form (≥3 пути) + SD→neighbor-district→другой SD (≥2 пути) — все работают |
| Я.ВебМастер baseline | seo-tech | `seosite/08-monitoring/ya-vebmaster-W7-baseline.md` | После Я.ВебМастер crawl: 0 ошибок «Структурированные данные»; страницы проиндексированы |

**Hand-off:**
- W7 W2: после publish status flip → qa-site запускает Playwright + axe
- W7 W3: benchmark + differentiation-matrix update → operator gate

## 5 · Acceptance Criteria

> 12 групп AC, 50+ проверяемых пунктов. Каждый AC — измеримый.

### AC-1 · 4 Pillar full content

- **AC-1.1.** Каждый pillar содержит ~3000 слов (allow ±20%, т.е. 2400-3600); измерено `pnpm wc:check` или ручным split на пробелы.
- **AC-1.2.** H1 содержит target keyword:
  - `vyvoz-musora`: «Вывоз мусора в Москве и МО» или вариант с «Москве и Подмосковье»
  - `arboristika`: «Арбористика и спил деревьев в Москве и МО» или вариант
  - `chistka-krysh`: «Чистка крыш от снега в Москве и МО» (slug `chistka-krysh` после US-0 миграции)
  - `demontazh`: «Демонтаж и снос в Москве и МО»
- **AC-1.3.** H2 ≥4 секции с supplement keys из cluster (см. §3.1 таблица).
- **AC-1.4.** services-grid block с sub-services: `vyvoz-musora` 9 cards / `arboristika` 12 / `chistka-krysh` 6 / `demontazh` 6. Иконки из реестра brand-guide §9 (services line: 22 иконки).
- **AC-1.5.** lead-form ИЛИ cta-banner /foto-smeta/ ≥2 раза на странице (один в верхней половине, один в нижней).
- **AC-1.6.** mini-case block ≥1 (реальный кейс или generic с явным TODO для replacement в US-3 Cases pack).
- **AC-1.7.** FAQ ≥5 Q&A с FAQPage schema. Q ≥3 слова, A ≥40 слов с конкретикой.
- **AC-1.8.** related-services block с 2-3 cross-link на соседние pillar (vyvoz-musora → arboristika + demontazh; arboristika → vyvoz-musora + chistka-krysh; chistka-krysh → arboristika + b2b/uk-tszh; demontazh → vyvoz-musora + arboristika).
- **AC-1.9.** Цены: конкретные числа («12 800 ₽ за объект до 5 м³» / «450 ₽/м² за чистку кровли»), **не** «от X ₽» (TOV-checker блокирует).
- **AC-1.10.** 4-в-1 cross-sell упоминается в hero и/или text-content (winning angle vs 17 конкурентов).
- **AC-1.11.** TOV-checker exit 0 на каждом из 4 текстов (regex + LLM cascade).
- **AC-1.12.** schema Service + FAQPage + BreadcrumbList present и валидно (lint:schema exit 0).

### AC-2 · 4 priority-A Districts

- **AC-2.1.** Каждый ~1500 слов (allow ±20%).
- **AC-2.2.** services-grid block с 4 pillar в районе (cross-link на `/<service>/<district>/`). Если SD не существует (на этапе W4-W5 — не существует, кроме Одинцово) — link рендерится но 404 до W6 publish; sitemap не включает не-published.
- **AC-2.3.** LocalBusiness schema с geo (`@type: GeoCoordinates`, lat/long из открытых источников + указатель на офис Обихода) + areaServed (район + соседи).
- **AC-2.4.** neighbor-districts block: 3 ближайших из `District.relatedDistricts` (или `neighborDistricts` per US-0 hand-off log decision). Cross-link на `/raiony/<neighbor>/`.
- **AC-2.5.** Локальная команда mention в text-content + конкретика: время выезда из бригадной точки (например, «20 минут до Одинцово через М1»), кейсы или объёмы за квартал/год (если данные у оператора есть).
- **AC-2.6.** lead-form с дефолтным district (HTML-атрибут или Payload-relation): user открывает `/raiony/odincovo/`, в форме предзаполнено «Одинцово».
- **AC-2.7.** mini-case ≥2 (один из реальных кейсов района если есть в `Cases` collection; один generic с TODO для US-3 replacement).

### AC-3 · 4 pilot SD (Одинцово)

- **AC-3.1.** Каждый ~1200 слов (allow ±20%).
- **AC-3.2.** 50% shared base content + 50% district-specific (anti Scaled Content Abuse):
  - **Shared base:** методология услуги (что входит, как работает 4-в-1, СРО/договор)
  - **District-specific:** время выезда, локальные landmarks (например, для Одинцово — Одинцовский округ, Голицыно, Можайск), законодательство МО vs МСК, конкретный кейс района
- **AC-3.3.** mini-case относится к району (или generic с явным TODO replacement в US-3 Cases pack).
- **AC-3.4.** ≥2 localFaq (Q&A про работу в районе): «Сколько времени едет бригада в Одинцово?» / «Берёте ли вы вывоз мусора в дачных посёлках Одинцовского округа?»
- **AC-3.5.** publish-gate проходит: 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq. Без gate publish — Payload error.
- **AC-3.6.** neighbor-districts block: 3 соседних района Одинцову (Краснoznamenск / Голицыно / Можайск или другие из `District.relatedDistricts`).
- **AC-3.7.** schema Service + FAQPage + LocalBusiness (with district areaServed) + BreadcrumbList present и валидно.

### AC-4 · 5 cornerstone blog M1

- **AC-4.1.** ~1500 слов каждая (allow ±20%, 1200-1800).
- **AC-4.2.** TLDR ≥3 предложения нейро-ответ (короткий direct answer на target keyword).
- **AC-4.3.** H2 ≥4 секции с target keys из cluster:
  - #1: «Что такое 4-в-1 / Зачем 4-в-1 / Как работает 4-в-1 / Когда нужен 4-в-1»
  - #4: «Закон / Кто решает / Как получить разрешение / Когда не нужно разрешение»
  - #5: «Размер штрафа / Кто штрафует / Как избежать / Что делать если уже выписали»
  - #6: «Какой орган выдаёт / Документы / Сроки / Стоимость пошлины»
  - #11: «Как фото→смета работает / Что нужно прислать / Точность сметы / Что делать дальше»
- **AC-4.4.** Списки/таблицы (нейро-парсинг) — ≥1 список или таблица в каждой статье.
- **AC-4.5.** FAQ-блок 3-5 Q&A в конце.
- **AC-4.6.** CTA-banner на /foto-smeta/ (US #11 — главная посадочная) + related-services 2-3 ссылки на pillar/sub.
- **AC-4.7.** Author = «Бригада вывоза Обихода» (company-page); для статьи #11 (СR-driver) — apruv оператора если хочет указать своё имя как реального автора.
- **AC-4.8.** Article + Person/Organization schema + BreadcrumbList + FAQPage.

### AC-5 · Главная + статика + /foto-smeta/

- **AC-5.1.** Главная (`/`):
  - hero с 4-в-1 USP + foto-smeta primary CTA («Получить смету за 10 минут») + secondary CTA («Позвонить»)
  - services-grid с 4 pillar (cards с иконками §9 + ссылка на `/<service>/`)
  - benefits ≥3 (СРО 1 млрд, договор, штрафы ГЖИ/ОАТИ берём, страховка 10 млн)
  - foto-smeta cta-banner #1 (отдельный block для emphasis)
  - testimonials/cases-recent ≥2 (mini-case с района и B2B)
  - lead-form
  - neighbor-districts (4 priority-A districts)
- **AC-5.2.** /foto-smeta/: USP pillar (0/17 конкурентов делает — главное differentiation):
  - hero с H1 «Смета за 10 минут по фото»
  - tldr (1-2 предложения direct answer)
  - text-content с 4-step process (1. Фото в TG/MAX/WA → 2. Смета за 10 минут → 3. Бригада послезавтра → 4. Закрытие объекта)
  - benefits (точность ±5%, бесплатно, без обязательств)
  - faq (3-5 Q&A)
  - lead-form с CTA в TG/MAX/WA
- **AC-5.3.** /o-kompanii/: миссия + 4-в-1 + год основания (~6 лет в районах МО) + объёмы конкретные («2400 объектов в 2025», «44 бригады», «8 округов МО») + Authors cross-link + cta-banner.
- **AC-5.4.** /kak-my-rabotaem/: 4-step process с иконками §9:
  1. Фото / описание объекта
  2. Смета за 10 минут
  3. Выезд бригады
  4. Закрытие объекта по договору
- **AC-5.5.** /garantii/: штрафы ГЖИ/ОАТИ берём по договору + ответственность подрядчика + страховка 10 млн ₽ + faq B2B-вопросы.
- **AC-5.6.** /sro-licenzii/: список документов с issuer (СРО номер + страховка 10 млн ₽ + лицензия Росприроднадзора + 152-ФЗ compliance + ссылки на копии — если есть; иначе TODO).
- **AC-5.7.** /komanda/: company-page mention («Бригада вывоза Обихода» как core unit) + Authors cross-link + контакт оператора (placeholder до replacement).
- **AC-5.8.** /park-tehniki/: техника с иконками §9 (или fal.ai placeholder photos) + ГЛОНАСС + связка «бригада + техника» + CTA.

### AC-6 · Visual Production (fal.ai)

- **AC-6.1.** ~25 hero generation через Nano Banana Pro (1280×720 OR 16:9 — закрепить в `site/lib/fal/prompts.ts` extension если не done):
  - 4 pillar hero (`heroPrompt` с pillar context)
  - 4 districts hero (`districtHeroPrompt` landmark-only per art R1 W2)
  - 4 SD hero (`heroPrompt` с district context, не landmark — это уже SD level)
  - 6 статика hero (главная — 4-в-1 collage; /o-kompanii/ — компания; /kak-my-rabotaem/ — process; /garantii/ — договор; /sro-licenzii/ — документы; /komanda/ — без лиц)
  - /foto-smeta/ hero — process visualization (телефон с фото → смета)
  - 1 case hero (если в US-1 публикуем mini-case на pillar)
- **AC-6.2.** 5 blog covers через Standard (1200×630, OG-image format) для М1 cornerstone.
- **AC-6.3.** Всё через расширенные prompts `site/lib/fal/prompts.ts`:
  - `heroPrompt` (existing)
  - `districtHeroPrompt` (extended из US-0, landmark-only)
  - `b2bHeroPrompt` (extended, без рукопожатий) — **Stage 1 не использует** (B2B в US-3); только если /b2b/uk-tszh/ эталон обновляем (out-of-scope US-1)
  - `companyAuthorAvatarPrompt` (silhouette/back-shot, existing)
- **AC-6.4.** art apruv стиля cohesive across 25 hero + 5 blog covers (≥3 batch apruv events: W4 первая партия pillar; W5 districts+SD; W6 blog+статика). Каждый apruv — commit-message stamp в Track B PR.
- **AC-6.5.** Каждое hero — alt + license + geo (если district-photo) в Payload Media:
  - `alt` ≥10 слов, описывает сцену + район если применимо
  - `license` — `fal.ai/Nano-Banana-Pro` или `fal.ai/Standard` (для blog covers)
  - `geo` — для district-hero (`/raiony/odincovo/`) — координаты района
- **AC-6.6.** Никаких stock photos, никаких людей с лицами (per art changes US-0). Анти-§14 не присутствуют (TOV-checker не покрывает images, проверка art-apruv).

### AC-7 · Tech SEO sweep

- **AC-7.1.** schema validation 0 errors на 16 страниц через `pnpm lint:schema --sample 16` (или `--urls=<list-of-16>`). Report в `screen/stage1-W7/lint-schema-report.json`.
- **AC-7.2.** sitemap.xml автоматически содержит 16 новых URL с priority по wsfreq:
  - `/` priority 1.0
  - `/vyvoz-musora/` priority 1.0
  - `/arboristika/` priority 0.9
  - `/chistka-krysh/` priority 0.7
  - `/demontazh/` priority 0.6
  - `/foto-smeta/` priority 0.9
  - `/raiony/<district>/` priority 0.8
  - `/<service>/odincovo/` priority 0.7
  - `/blog/<slug>/` priority 0.6
  - статика priority 0.5
- **AC-7.3.** Canonical на каждой странице self-canonical (через generateMetadata Next.js). Нет circular canonicals.
- **AC-7.4.** redirect chain check: `ochistka-krysh` → `chistka-krysh` 301 без chain (US-0 закрыл, после US-1 publish — повторная проверка через `pnpm tsx scripts/check-redirects.ts` или `linkinator`).
- **AC-7.5.** Я.ВебМастер «Структурированные данные» — 0 ошибок на 16 URL после Я.ВебМастер crawl (дата W7, фиксируется в `seosite/08-monitoring/ya-vebmaster-W7-baseline.md`).

### AC-8 · Publish (cms)

- **AC-8.1.** cms запускает `seed:content:stage1` (новый script) или `seed:etalons:prod` extended с safety-gate `OBIKHOD_SEED_CONFIRM=yes`. Idempotent (findOneBySlug) — повторный запуск не дублирует.
- **AC-8.2.** Реальные данные оператора в Authors (если переданы до W7) — иначе остаётся placeholder с явным TODO в admin notes (per US-0 hand-off log решение оператора 2026-04-29 «дадим позже»).
- **AC-8.3.** Бригадир «Александр» в district-hub Одинцово (US-0 placeholder) — заменён на реальное имя (если оператор передал) или подтверждённый placeholder.
- **AC-8.4.** 16 страниц в Payload `_status: published`. Все 16 видны на `obikhod.ru/<url>/` (или staging `staging.obikhod.ru` если do deploy готов; если нет — local через `pnpm dev`).

### AC-9 · W7 Competitor Benchmark Mid-Check

- **AC-9.1.** 17 конкурентов через Keys.so (после operator передаст creds — fallback: deep-profiles из `seosite/01-competitors/deep/<domain>.md` + Topvisor если creds доступны + manual SERP top-50 проверка).
- **AC-9.2.** 5 осей: URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage. Метрики из плана §«Methodology».
- **AC-9.3.** ≥40% closure URL-gap к топ-3 (musor.moscow + liwood.ru + cleaning-moscow.ru — гипотеза до W3 baseline; если W3 audit показал другое — топ-3 пересобирается; для US-1 используем топ-3 из W3 baseline).
- **AC-9.4.** ≥1 ось из 5 уже в опережении топ-3 (гипотеза: schema-coverage — у нас 100% Service+FAQ+BreadcrumbList на 16 URL, у топ-3 < 50% per W3 baseline).
- **AC-9.5.** Артефакт: `seosite/01-competitors/benchmark-W7-mid.md` (формат по плану §«Формат отчёта») + обновление `differentiation-matrix.md` v2 с реальными W7 цифрами.

### AC-10 · QA + Playwright

- **AC-10.1.** Все 16 URL HTTP 200 на staging (или local если staging не готов).
- **AC-10.2.** Все 16 рендерят blocks через BlockRenderer (после US-0 Track B-3 закрытия — BlockRenderer работает на 7 routes с legacy fallback; в US-1 — sub-services не входят, 16 URL все на новом BlockRenderer; sub-service legacy SubServiceView — только для US-2 Stage 2).
- **AC-10.3.** 0 critical / 0 serious axe violations из блочного контента. Legacy SiteChrome contrast — не зона US-1 (backlog US-A11Y-CHROME-CONTRAST per US-0 закрытое решение).
- **AC-10.4.** Playwright screenshots в `screen/stage1-W7/<slug>-{desktop,mobile}.png` (32 PNG: 16 desktop + 16 mobile). Viewport: 1920×1080 desktop, 375×812 mobile (iPhone-like).
- **AC-10.5.** CR-pathways verify (manual через Playwright или browser):
  - blog→pillar→lead-form: ≥3 пути работают (например, /blog/4-v-1-uslugi/ → /vyvoz-musora/ → lead-form submit; /blog/shtraf-za-spil-bez-razresheniya/ → /arboristika/ → lead-form; /blog/smeta-za-10-minut/ → /foto-smeta/ → lead-form)
  - SD→neighbor-district→другой SD: ≥2 пути работают (например, /vyvoz-musora/odincovo/ → /raiony/krasnogorsk/ → /vyvoz-musora/krasnogorsk/ — 404 до US-2, fallback на /vyvoz-musora/; /arboristika/odincovo/ → /raiony/mytishchi/ → /arboristika/mytishchi/ — 404 до US-2)
  - Артефакт: `screen/stage1-W7/cr-pathways-report.md`

### AC-11 · Design-system compliance (operator reminder mandatory)

> Operator reminder 2026-05-02 13:30: «не забывай использовать дизайн систему!» — design-system awareness усилен во всех Stage 1+ агентах.

- **AC-11.1.** Все тексты прошли TOV-checker (anti §13 Don't + §14 анти-паттерны). 100% pillar + cornerstone review от cw; 20% sampling SD/districts (1 из 4 full review каждой группы).
- **AC-11.2.** Все блоки используют tokens из brand-guide §4 Color (--c-primary #2d5a3d, --c-accent #e6a23c, --c-ink, --c-bg) и §7 Shape (--radius-sm 6, --radius 10, --radius-lg 16). Никаких hardcoded hex/px вне tokens.
- **AC-11.3.** Иконки в services-grid из §9 (49 line-art glyph: services line 22 + districts line 9 + cases line 9). Никаких emoji, никаких стоковых иконок.
- **AC-11.4.** Type-system §6 (Golos Text + JetBrains Mono). H1-H6 + body + caption по шкале brand-guide.
- **AC-11.5.** Анти-паттерны §14 НЕ присутствуют:
  - В тексте: «услуги населению», «клиент» в B2C, «имеем честь», «осуществляем деятельность», «от 1 000 ₽», «в кратчайшие сроки», «гарантируем качество», «индивидуальный подход», «мы дорожим репутацией», «твёрдые коммунальные отходы» (B2C), «древесно-кустарниковая растительность» (B2C), «цены договорные», «звоните узнавайте», «обращайтесь»
  - В images: фотостоки, эко-зелень+листочек, топор/бензопила, рыцарь/щит, рукопожатия, твёрдый знак ДВОРЪ-style, рукавицы, матрёшки/берёзки, градиенты в primary, неоновые ховеры
- **AC-11.6.** art apruv каждого batch image generation (cohesive style across 25+5+author = ~30 visuals).
- **AC-11.7.** cw apruv TOV для 100% pillar + cornerstone (4 + 5 = 9 текстов full review), 20% sampling SD/districts (1 из 4 districts + 1 из 4 SD = 2 текста full review; остальные 6 — TOV-checker only).

### AC-12 · Operator gate W7

- **AC-12.1.** Demo на staging URL (если do задеплоил — `staging.obikhod.ru`) ИЛИ local + screenshots (32 PNG из AC-10.4 + axe reports + cr-pathways report + benchmark-W7-mid + differentiation-matrix v2).
- **AC-12.2.** Артефакт: `specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/operator-review-W7.md` (создаёт poseo в W7) — содержит:
  - 16 URL списком с visual screenshots
  - 32 PNG screenshots inline или ссылками
  - benchmark-W7-mid.md ссылкой
  - differentiation-matrix.md v2 ссылкой
  - 16 axe-violations отчётов (должны быть 0 critical/serious)
  - cr-pathways report
  - Чек-лист «что апрувить»: TOV / визуал / структура / SEO-мета / lead-form работа / 4-в-1 cross-sell / winning angles
- **AC-12.3.** Operator review: visual look + content quality + benchmark.
- **AC-12.4.** Operator apruv для Stage 2 либо корректировки (per iron rule #6 release gate). Hard gate: без явного apruv US-2 не стартует. При возврате — poseo распределяет правки по tracks, новый review-цикл ≤7 рабочих дней (буфер до W8 W2).

## 6 · Hand-off план (phase transitions)

```
[2026-05-02 14:00] poseo → sa-seo
  · фаза: spec
  · артефакт: этот файл (sa-seo.md)

[2026-05-02 HH:MM] sa-seo → poseo (apruv sa-spec)
  · фаза: spec → planning
  · апрув: poseo читает spec, апрувит, переключает phase

[2026-05-08] poseo → tracks parallel start (W4 W1)
  · фаза: planning → dev (5 tracks параллельно)
  · Track A → cw + seo-content (Content Production)
  · Track B → art + cms через fal.ai (Visual Production)
  · Track C → seo-tech (Tech SEO)
  · Track D → cms (Publish)
  · Track E → re + seo-content + qa-site (Benchmark + QA)

[2026-05-14] tracks → poseo (W4 EOW gate)
  · 4 pillar drafts ready (Track A)
  · fal.ai prompts validation + first batch (Track B)

[2026-05-21] tracks → poseo (W5 EOW gate)
  · 4 pillar finished (Track A)
  · 4 districts finished (Track A)
  · Главная + статика finished (Track A)
  · 25 hero generated + art apruv (Track B)
  · sitemap расширение готов (Track C)

[2026-05-28] tracks → poseo (W6 EOW gate)
  · 4 pilot SD finished (Track A)
  · 5 cornerstone blog finished (Track A)
  · 5 blog covers + 6 статика hero (Track B)
  · seed:content:stage1 готов (Track D)

[2026-05-29] poseo → qa-site + seo-content + re (W7 mid)
  · фаза: dev → qa
  · qa-site: Playwright + axe + CR-pathways → 32 PNG + reports
  · seo-content + re: benchmark-W7-mid + differentiation-matrix v2
  · seo-tech: lint:schema 16 URL + Я.ВебМастер baseline

[2026-05-29 EOD] poseo → operator (W7 gate)
  · фаза: qa → gate
  · operator-review-W7.md собран
  · Hard gate: оператор apruv → US-2 starts; reject → revise loop ≤7 раб. дней (W8 W2)

[2026-05-29 → 2026-05-30] operator → poseo (apruv) → US-2 stub created
  · фаза: gate → done
  · poseo обновляет phase: done в этом sa-spec
  · US-2-sub-and-programmatic/sa-seo.md → новая sa-spec
```

## 7 · Cross-team зависимости и эскалации

| Зависимость | Owner-team | Риск | Эскалация |
|---|---|---|---|
| art apruv визуального стиля 25 hero + 5 covers | design (art) | Блокер для cms publish (без art apruv hero — placeholder) | poseo → art напрямую (cross-team agent через iron rule #7); 3 batch apruv events (W4 / W5 / W6) — early apruv W4 первой партии критичен |
| do staging deploy (subdomain `staging.obikhod.ru`) | common (do) | Не блокер локально (CR-pathways verify работает на local); блокер для public preview operator gate | Если do не готов к W7 — gate на local + screenshots (AC-12.1 fallback) |
| aemd Я.Метрика события на /foto-smeta/ | business (aemd) | Не блокер US-1 (Я.Метрика 8 целей закрепил US-0 AC-9; /foto-smeta/ — extension если operator хочет new event) | Если aemd hand-off не готов — backlog событий, US-1 не блокируется |
| operator real names (имя оператора, VK, TG) для Authors | оператор | Блокер для finalize Authors bio (AC-8.2) | poseo запросил 2026-05-01; оператор «дадим позже к W2/W3» (US-0 hand-off log) — fallback placeholder с TODO |
| Topvisor SaaS creds для W7 mid-check | оператор | Risk для AC-9.1 точности | Fallback: deep-profiles + Я.ВебМастер baseline + manual SERP top-50; бенч продолжает работать без Topvisor |
| Keys.so creds для W7 mid-check | оператор | Risk для AC-9.1 точности | Та же fallback стратегия что и Topvisor |
| `Cases` collection для real mini-case на 16 страницах | seo (cms) + operator (real cases data) | Risk для AC-1.6 / AC-2.7 / AC-3.3 (если real нет — generic с TODO) | Generic с явным TODO replacement в US-3 Cases pack — допустимо |
| BlockRenderer + Payload schema на 7 routes | panel (popanel + be-panel + fe-site) | US-0 закрыл; US-1 sub-services не использует — только 16 URL на новом стеке | Не блокер; sub-service legacy SubServiceView — US-2 Stage 2 |
| skill `claude-api` prompt caching для cw LLM-augmented writing | seo (cw + seo-content) | Cost overrun без кэша на 37000 слов | Iron rule: prompt caching на ≥1024 токенов system prompt (TOV rules + brand-guide §13/§14 + примеры); cache-hit rate target ≥80% после 10 вызовов |

## 8 · Риски (топ-5)

### R1 — Scaled Content Abuse demote на 16 страницах (P=0.5, High)

**Описание:** Google-демоут за «многократно похожий контент по шаблону». 16 URL — больше чем 8 эталонов US-0, шаблон ещё не битt. Особенно опасно: 4 SD Одинцово (одинаковый pillar paттern × 4 услуги) и 4 Districts (одинаковый district pattern × 4 района).

**Митигация:**
- Pillar→SD строгий: SD не клонирует pillar, а **расширяет district-spec блок** (50%/50% rule из AC-3.2)
- 30% уникальность на SD: время выезда + landmarks + локальная legislation МО vs МСК + 1 уникальный кейс района
- 30% уникальность на Districts: landmark photo + локальная команда + 4 услуги cross-link на разных SD
- TOV-checker exit 0 + cw 100% review pillar/cornerstone (filter из US-0)
- W7 mid-benchmark проверяет: если индексация Я.ВебМастер «Структурированные данные» 0 ошибок и нет drop в Топvisor — шаблон работает; если drop — pillar→SD пересобирается до Stage 2

### R2 — cw bottleneck на ~37 000 слов за 4 недели (P=0.6, High)

**Описание:** 1 cw роль; 16 текстов; 100% review pillar/cornerstone (9 текстов full review); 20% sampling SD/districts (2 текста full review); итого ~11 full review × ~3000 слов avg = ~33 000 слов прочитать + правки. + LLM-augmented написание.

**Митигация:**
- TOV-checker pre-filter: cw читает только то, что прошло TOV-check (regex + LLM cascade); сэкономит ~30% времени на anti-TOV catch
- LLM-augmented writing с prompt caching (skill `claude-api`): brief → черновик за 5-10 мин, cw редактирует не пишет с нуля; ускорение ×3-5
- 20% sampling SD/districts: остальные 6 (4 SD + 4 districts - 2 sampling = 6) — TOV-checker only без cw human review; risk acceptable per US-0 решение оператора
- W4 W1 первая партия (4 pillar drafts) → cw review W4 W2 → выработка cw editorial style; следующие партии быстрее

### R3 — fal.ai art apruv задержка на 3 batches (P=0.4, Medium)

**Описание:** art apruv требуется на W4/W5/W6 batches (3 events × ~10 visuals каждый); задержка art = задержка cms publish.

**Митигация:**
- Early apruv W4 первой партии (4 pillar hero) — критично; если art занят — poseo эскалирует через cpo
- Между batches: fal.ai prompts уже apruv'нуты в US-0 (W2 art W2 apruv стиля); art только confirm cohesive look на новых batches
- Если art не отвечает >2 рабочих дня — poseo cross-team agent через iron rule #7 (PO orchestration); ставит deadline + escalates через cpo если deadline пропущен
- Worst case: cms публикует с placeholder hero (TODO replacement); art apruv до W7 gate (replacement до operator review)

### R4 — Operator real names не передаются до W7 (P=0.4, Medium)

**Описание:** Authors company-page bio + оператор VK/TG sameAs не финализированы; placeholder остаётся; оператор может потребовать «не показывать staging без real names».

**Митигация:**
- Placeholder с явным TODO (US-0 закрепил решение оператора 2026-04-29 «дадим позже к W2/W3» — Stage 1 продолжает policy)
- При operator передаст до W7 — cms swap placeholder → real в один проход через `seed:content:stage1` extension или Payload Admin UI
- Author bio как content — cw пишет 200 слов под placeholder, замена данных не меняет TOV
- Worst case: operator W7 gate apruv с placeholder + явный backlog «replace до Stage 2 W8»

### R5 — Topvisor / Я.ВебМастер creds не передаются до W7 mid-check (P=0.3, Medium)

**Описание:** Без Topvisor — позиции 200 ключей × 17 конкурентов измерить нельзя; без Keys.so — URL gap не точный.

**Митигация:**
- Fallback: deep-profiles (`seosite/01-competitors/deep/<domain>.md` + W2 stub-hypotheses из differentiation-matrix W3 baseline) + manual SERP top-50 для топ-3 конкурентов через Я.Поиск (no creds needed)
- Я.ВебМастер baseline — наша индексация — обязательна; creds оператор уже передал (US-0 закрепил)
- Точность W7 mid-check: ±15% без Topvisor (vs ±5% с Topvisor); acceptable для AC-9.3 (≥40% closure threshold) и AC-9.4 (≥1 ось — schema-coverage с 100% — measurable без Topvisor)
- Если operator передаст creds к W7 — bonus precision; W14 final benchmark все равно требует Topvisor (US-5)

## 9 · Definition of Done

- [ ] Все 12 групп AC закрыты (50+ пунктов)
- [ ] Hand-off log заполнен (см. §11)
- [ ] 16 URL apruv'нуты оператором (AC-12.4)
- [ ] Track A / B / C / D / E закрыты, deliverables в репозитории / в Payload
- [ ] PR'ы Track A (16 текстов как seed-content + JSON drafts) merge'нуты в `main` через `do` (CI green: type-check + lint + format:check + test:e2e --project=chromium)
- [ ] PR'ы Track B (~30 hero/cover via fal.ai в `site/public/images/stage1/` + Payload Media) merge'нуты
- [ ] PR'ы Track C (lint:schema жёсткий gate + sitemap autogen) merge'нуты
- [ ] PR'ы Track D (`seed:content:stage1` script + Authors finalize) merge'нуты
- [ ] PR'ы Track E (benchmark-W7-mid.md + differentiation-matrix v2 + Playwright reports) merge'нуты
- [ ] `screen/stage1-W7/` папка готова: 32 PNG screenshots + 16 axe reports + cr-pathways report + lint-schema report + benchmark-W7-mid + ya-vebmaster-baseline
- [ ] benchmark-W7-mid.md + differentiation-matrix.md v2 опубликованы и cross-link'ed из 16 URL (winning angle inline ссылки)
- [ ] Topvisor (если creds доступны) + Я.ВебМастер W7 baseline зафиксированы
- [ ] `pnpm lint:schema` exit 0 на 16 URL (жёсткий gate активен)
- [ ] `pnpm tov-check` exit 0 на содержимом 16 текстов
- [ ] `pnpm generate:types` без ошибок (если new fields добавлены — например, default district в lead-form)
- [ ] Передача в US-2 готова: `specs/EPIC-SEO-CONTENT-FILL/US-2-sub-and-programmatic/` создана, `sa-seo` пишет US-2 sa-spec
- [ ] Phase: gate → done (poseo обновляет frontmatter этого sa-spec)

## 10 · Открытые вопросы для poseo

> Большинство вопросов закрыто в US-0. Минимизирую — 4 пункта требуют решения poseo до старта tracks; остальные — авто-решения по precedent US-0 / iron rules.

1. **Последовательность writing 16 текстов (1-week phases) — confirm.** Sa-seo предлагает: W4 = 4 pillar; W5 = 4 districts + главная + статика; W6 = 4 pilot SD + 5 blog. Это распределяет ~3000 слов pillar на самую длинную фазу W4 (1 cw роль успевает за 5 рабочих дней с LLM-augmentation), districts/статика на W5 (короче, проще), SD/blog на W6 (последний spurt). Альтернатива: pillar+SD одного pillar в одной фазе (W4 = vyvoz-musora pillar + odincovo SD; W5 = arboristika pillar + odincovo SD; ...) — pillar→SD когнитивная связка для cw, но districts/статика откладываются на W6. Sa-seo recommendation: W4-W5-W6 split как выше (по типам, не по pillar). Confirm от poseo нужен.

2. **Параллелизация cw vs sequential — confirm.** У нас 1 cw роль (per team v2 42 roles). LLM-augmented writing + prompt caching ускоряет ×3-5, но cw human review остаётся bottleneck (R2). Sa-seo recommendation: sequential по фазам W4/W5/W6, NOT параллельно «cw пишет pillar 1 + cw пишет pillar 2 одновременно» — это ломает iron rule «sa-seo читает один текст целиком, не куски». Confirm от poseo: согласны с sequential? (Альтернатива — нанимать 2-го cw в Stage 2; out-of-scope US-1.)

3. **Staging vs local для CR-pathways verify — confirm fallback.** AC-10.5 verify работает на local (`pnpm dev`) если do staging deploy не готов к W7. Operator gate AC-12.1 — также local + screenshots если staging не готов. Confirm: poseo принимает local-only verify + screenshots если staging не готов к W7? (Per US-0 закрепил: VPS 4GB готов, do unblocked для staging deploy.)

4. **Topvisor / Я.ВебМастер fallback если creds не дойдут до W7 — confirm methodology.** Sa-seo recommendation: использовать deep-profiles + manual SERP top-50 + Я.ВебМастер (наша индексация) baseline; точность ±15%; gate AC-9.3/9.4 measurable. Confirm: poseo принимает fallback? (Если operator dolzhno передать к W7 — uncertain, не в наших руках; sa-seo не может рассчитывать на uncertain creds.)

**Auto-resolved (precedent из US-0):**
- ✅ TG bot на staging — отключён полностью (US-0 13:35 decision); US-1 продолжает policy
- ✅ Я.Метрика на staging — отключена полностью (US-0 13:35 decision)
- ✅ basic-auth для staging — do генерирует (US-0 13:35 decision)
- ✅ Bio «Бригада вывоза Обихода» — cw пишет, art apruvит TOV, poseo apruvит SEO-аспект (US-0 закрытое решение #4)
- ✅ axe-core severity threshold = `minor` блокирует gate (US-0 закрытое решение #8); legacy SiteChrome contrast — backlog (US-A11Y-CHROME-CONTRAST)
- ✅ skill `claude-api` prompt caching обязательно для cw LLM-augmented writing — iron rule (US-0 AC-5.7)
- ✅ Cases.before-after блок — out-of-scope US-1 (per US-0 closed decision #5: «before-after — US-3 W11»)
- ✅ Storybook без CI Chromatic — продолжает policy US-0 closed decision #6
- ✅ payload migrate workflow — продолжает push: true + ad-hoc через tsx (US-0 closed decision #7)
- ✅ AnchorAuthor cross-domain VK/TG sameAs — оператор «дадим позже» (US-0 hand-off log 2026-04-29); placeholder продолжается
- ✅ Realные имена операторов (Authors + бригадир Александр) — те же placeholder rules

## 11 · Hand-off log

- `2026-05-02 14:00 · poseo → sa-seo: написать sa-spec для US-1 (Stage 1 W4-W7); operator autonomous mandate; design-system reminder; скоп 16 текстов; цель «лиды + обгон»; skills [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system].`
- `2026-05-02 HH:MM · sa-seo → poseo: sa-spec готов для review; активированы skills [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]; spec покрывает 12 AC групп (50+ пунктов), 5 tracks, hard gate на operator apruv W7 для 16 URL; design-system §1-14 compliance — отдельная AC-11 группа per operator reminder; 4 открытых вопроса для poseo (минимизировано — большинство закрыто precedent US-0); ждёт apruv poseo для phase: spec → planning.`

---

**ADR-кандидаты (из US-1, фиксируются `tamd` после tracks):**
- ADR-XXXX: 50%/50% shared/specific rule для programmatic SD (anti Scaled Content Abuse pattern)
- ADR-XXXX: lint:schema жёсткий gate в CI (после US-0 continue-on-error → US-1 hard fail)
- ADR-XXXX: cw editorial workflow с LLM-augmentation + prompt caching (cost-aware content production)

Эти ADR пишет `tamd` (cross-team consult) ПОСЛЕ закрытия US-1, на основании реализации.

---

## 12 · Решения poseo по открытым вопросам (pending)

> Sa-seo передал sa-spec poseo. Раздел заполнится после poseo review (apruv ИЛИ корректировки) и закрытия 4 открытых вопросов §10.

> Phase transition: sa-spec apruv от `poseo` → `phase: planning` для всех 5 tracks → `phase: dev` после W4 W1 start.
