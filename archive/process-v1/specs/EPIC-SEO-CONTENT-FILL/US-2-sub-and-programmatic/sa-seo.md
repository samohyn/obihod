---
us: US-2
epic: EPIC-SEO-CONTENT-FILL
title: Stage 2 — 33 sub-services + ~150 SD programmatic batch + B2B 10 + 8 Cases + extras + blog M2
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
target_finish_w11: 2026-06-26
blocks: [US-3-priority-b-districts, US-4-eeat-monitoring]
blocked_by: [US-1-pillars-pilot]
related: [US-6-competitor-benchmark]
skills_activated: [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]
---

# US-2 · Stage 2 W8-W11 — Sub-services + Programmatic batch + B2B + Cases + extras + blog M2

> **Master-документ Stage 2 эпика `EPIC-SEO-CONTENT-FILL`.** Это второй production-конвейер: после US-1 (16 URL pilot, 22/22 HTTP 200, 2 confirmed оси опережения — schema +50pp + UX/foto-smeta) Stage 2 масштабирует валидированный шаблон на **~210 URL** = ×11 объёма Stage 1. После US-2 страт-этап: ≥40% closure URL-gap к топ-3 + ≥2 confirmed оси опережения, заложен фундамент для Stage 3 (priority-B districts + E-E-A-T артефакты + W14 final benchmark).

---

## 1 · Цель US-2

Произвести **второй production-конвейер контента** — масштабировать валидированный на 16 pilot-URL (Stage 1) шаблон до **~210 URL** через 4 параллельных production-фронта: 33 sub-services depth + ~150 SD programmatic batch (4 priority-A districts × ~24 sub-services + 8 avtovyshka × 4 districts) + 10 B2B-страниц + 8 Cases pack + 6 extras + 10 blog M2. К W11 закрываем **≥40% closure URL-gap к топ-3** и подтверждаем **≥2 оси опережения** (URL-объём + content-depth), формируя последовательный путь к DoD-цели «опережение топ-3 по ≥3 из 5 осей к W14». Без US-2 невозможна US-3 (priority-B districts) и US-4 (E-E-A-T monitoring): US-2 — масштабное наполнение валидированного шаблона; US-3/4 — финализация + monitoring.

## 2 · Бизнес-цель

Operator mandate (2026-05-02 14:00, sustained для Stage 2): **«сайт который конверит, приносит лиды и обгоняет конкурентов»**. Stage 2 переводит «лиды + обгон» из режима «pilot validated» (US-1) в режим «production-scale»: каждая из ~210 страниц должна работать как самостоятельная посадочная с конкретными CTA-точками, а не быть «местом-заполнителем» для programmatic-индексации.

| Требование | Почему | Где проверяется |
|---|---|---|
| Каждая страница имеет lead-form ИЛИ cta-banner на `/foto-smeta/` | Без CTA — нет лидов; programmatic-страницы без CTA = Scaled Content Abuse | AC-1.x sub / AC-2.x SD / AC-3.x B2B / AC-4.x Cases / AC-5.x extras |
| Programmatic SD проходит publish-gate (50/50 shared/specific + mini-case + ≥2 localFaq) | Anti Scaled Content Abuse demote от Google + индексация в Я.ВебМастер | AC-2.x publish-gate group |
| B2B-страницы используют B2B-крючок «штрафы ГЖИ/ОАТИ берём» | Уникальный angle 0/17 конкурентов | AC-3.x B2B requirements |
| Cases pack — связка mini-case на SD pages (closes publish-gate) | Реальное E-E-A-T + закрывает publish-gate strict mode на 150 SD | AC-4.x cases binding |
| Design-system §1-14 + §33 site-chrome compliance | Operator reminder 2026-05-02 «не забывай дизайн систему!» | AC-11.x design-system group |
| TOV-checker exit 0 на 100% pillar/B2B/cases + 20% sampling SD/sub | Iron rule scope из US-1 (sustained для Stage 2) | AC-11.1 |
| Schema (Service / FAQPage / BreadcrumbList min) + LocalBusiness где применимо | Schema-coverage = подтверждённое опережение из US-1 (W7 audit) | AC-7.x tech-SEO sweep |

US-2 == «второй завод-цех с конвейером» (vs US-1 «первый цех с pilot-партией»). Качество цеха проверяется на ~210 URL: если шаблон ломается — индексация Я.ВебМастер показывает «Структурированные данные ошибки» / Topvisor показывает drop по pilot-ключам US-1 → Stage 3 пересматривается под revise. Поэтому **W11 mid-check — hard gate** оператора.

## 3 · Scope (~57 текстов + ~150 programmatic SD = ~207 страниц / ~75 000 слов)

> Объёмные оценки: 4 cw text-runs sequential + programmatic shared/specific scripts на W10. Реальный cw work для programmatic — ~30 000 слов unique через шаблонизацию (50% shared + 50% district-specific), не 90 000.

### 3.1 · 33 sub-services (~50 000 слов / 4 pillar batches)

#### 3.1.1 · vyvoz-musora — 9 sub × ~1500 слов = ~13 500 слов

| URL | Объём | Cluster wsfreq | Главные H2 (target keys) | Winning angle |
|---|---|---|---|---|
| `/vyvoz-musora/kontejner/` | ~1500 | 11 991 | Размеры контейнеров (8/20/27 м³) · Цена за объект · Сроки · Города/районы МО · FAQ | Конкретные размеры контейнеров vs musor.moscow (только калькулятор) |
| `/vyvoz-musora/vyvoz-stroymusora/` | ~1500 | 10 284 | Демонтаж + вывоз = 1 договор · ФККО-классы · Цены за м³ · УК и СНТ · FAQ | 4-в-1 cross-sell на /demontazh/ + B2B-крючок «штрафы ОАТИ» |
| `/vyvoz-musora/staraya-mebel/` | ~1500 | 4 957 + 539 | Цена за объект · Шкафы / диваны / кухни · Куда вывозим · Дача vs квартира · FAQ | Конкретные цифры за шкаф/кухню vs musor.moscow «от X ₽» |
| `/vyvoz-musora/krupnogabarit/` | ~1500 | 750 | КГМ норматив УК · Цена за объект · Куда вывозим · Связь с УК через `/b2b/uk-tszh/` · FAQ | B2B-связка УК (КГМ-норматив) — 0/17 конкурентов |
| `/vyvoz-musora/gazel/` | ~1500 | 1 453 | Газель 6 м³ · Часовая ставка · Грузчики · Куда поедем · FAQ | Часовая ставка vs «договорные» у gazelkin |
| `/vyvoz-musora/vyvoz-sadovogo-musora/` | ~1500 | 187 + 108 | Листва / ветки / трава · Цена за мешок vs объект · Сезонность · FAQ | Cross-link на /arboristika/raschistka-uchastka/ (4-в-1) |
| `/vyvoz-musora/uborka-uchastka/` | ~1500 | tail | Уборка + вывоз 1 бригадой · Площадь vs объём · Сроки · FAQ | Cross-link на /arboristika/raschistka-uchastka/ + 4-в-1 |
| `/vyvoz-musora/vyvoz-porubochnyh/` | ~1500 | 239 | Связка с арбо · Измельчение vs вывоз · Цена за м³ · FAQ | Cross-link на /arboristika/spil-derevev/ — единственный 4-в-1 |
| `/vyvoz-musora/dlya-uk-tszh/` | ~1500 | tail | КГМ + крыши + штрафы 1 договор · Абонентка vs разовая · FAQ | B2B-крючок «штрафы ГЖИ берём» — 0/17 конкурентов |

#### 3.1.2 · arboristika — 12 sub × ~1500 слов = ~18 000 слов

| URL | Объём | Cluster wsfreq | Главные H2 | Winning angle |
|---|---|---|---|---|
| `/arboristika/spil-derevev/` | ~1500 | 11 228 + 7 937 | Цена за объект · Закон / разрешение · Породы / диаметр · Сезонность · FAQ | Cross-link на /b2b/shtrafy-gzhi-oati/ + конкретные цифры vs liwood («индивидуально») |
| `/arboristika/kronirovanie/` | ~1500 | tail (info-cluster в blog) | Виды формовки · Сроки · Цена · Породы · FAQ | Сезонность Подмосковья + cross-link на blog #9 «когда обрезать сливу/грушу» |
| `/arboristika/udalenie-pnya/` | ~1500 | 398 + 727 | Корчёвка vs дробление · Цена за пень · Глубина · Препараты · FAQ | Cross-link на /arboristika/raschistka-uchastka/ |
| `/arboristika/avariynyy-spil/` | ~1500 | 320 | Когда «аварийный» по закону · Без разрешения МЧС · Сроки выезда · FAQ | Cross-link на /b2b/shtrafy-gzhi-oati/ (когда не штрафуют) |
| `/arboristika/sanitarnaya-obrezka/` | ~1500 | tail | Сезонность · Цена за дерево · Кронирование vs санитарная · FAQ | Связка с blog M1 #4-#6 «можно ли спилить» |
| `/arboristika/raschistka-uchastka/` | ~1500 | 5 523 (orphan absorbed) | Заросли / пни / разнотравье · Под стройку vs ландшафт · Цена · FAQ | Поглощает orphan «выравнивание участка» (ADR-uМ-15) |
| `/arboristika/spil-alpinistami/` | ~1500 | tail | Когда нужны альпинисты · Цена · СРО / страховка · Безопасность · FAQ | Cross-link на /promyshlennyj-alpinizm/ (extras) |
| `/arboristika/spil-s-avtovyshki/` | ~1500 | tail | Когда автовышка · Высота · Цена · /arenda-tehniki/avtovyshka/ · FAQ | Programmatic ADR-uМ-18 — ×4 districts SD batch |
| `/arboristika/valka-derevev/` | ~1500 | 1 099 + 24 | Целиком vs частями · Технология · Цена · Закон · FAQ | Технология vs liwood (только текст) |
| `/arboristika/izmelchenie-vetok/` | ~1500 | 727 | Мощность измельчителей · Цена за час vs объём · Использование щепы · FAQ | Cross-link на /arenda-tehniki/izmelchitel-vetok/ |
| `/arboristika/kabling/` | ~1500 | tail | Когда нужно · Растяжки · Цена · Безопасность · FAQ | Узкая ниша 0/17 detail |
| `/arboristika/vyrubka-elok/` | ~1500 | tail (сезон) | Сезонность · Цена · Утилизация · FAQ | Сезонный лонг-тейл |

#### 3.1.3 · chistka-krysh — 6 sub × ~1300 слов = ~7 800 слов

| URL | Объём | Cluster wsfreq | Главные H2 | Winning angle |
|---|---|---|---|---|
| `/chistka-krysh/chistnyy-dom/` | ~1300 | tail | Цена за м² · Скаты / профнастил / металлочерепица · Сезон · FAQ | Конкретные цифры vs chistka-ot-snega.ru |
| `/chistka-krysh/mkd/` | ~1300 | tail (B2B) | Договор УК / ТСЖ · Штрафы ГЖИ берём · Цена за м² · Абонентка · FAQ | B2B-крючок штрафы ГЖИ + cross-link на /b2b/uk-tszh/ |
| `/chistka-krysh/sbivanie-sosulek/` | ~1300 | tail | Высота · Технология · Цена за погонный метр · Безопасность · FAQ | Cross-link на /promyshlennyj-alpinizm/ |
| `/chistka-krysh/ot-snega/` | ~1300 | tail (cluster 2 — 146 ключей info) | Снег vs наледь vs сосульки · Кровли · Цена · FAQ | Info-сильный cluster — нейро-цитируемость |
| `/chistka-krysh/uborka-territorii-zima/` | ~1300 | tail | Дворники vs механизация · Антигололёд · Договор сезон · FAQ | B2B-связка с /b2b/dogovor-na-sezon/ |
| `/chistka-krysh/dogovor-na-sezon/` | ~1300 | tail (B2B) | Что входит · Месячная цена · Штрафы на нас · FAQ | Уникальный B2B-крючок 0/17 |

#### 3.1.4 · demontazh — 6 sub × ~1200 слов = ~7 200 слов

| URL | Объём | Cluster wsfreq | Главные H2 | Winning angle |
|---|---|---|---|---|
| `/demontazh/dachi/` | ~1200 | 143 | Каркас · Фундамент · Вывоз 1 договор · Цена · FAQ | Демонтаж + вывоз = 1 договор vs demontazhmsk (отдельный подрядчик на вывоз) |
| `/demontazh/bani/` | ~1200 | 82 | Сруб vs кирпич · Утилизация · Цена · FAQ | 4-в-1 cross-sell на /vyvoz-musora/vyvoz-stroymusora/ |
| `/demontazh/saraya/` | ~1200 | tail | Деревянный / металлический · Вывоз · Цена · FAQ | Бюджетный сегмент с конкретной ценой |
| `/demontazh/snos-doma/` | ~1200 | tail (big SERP) | СРО / лицензия · Согласование · Цена · FAQ | Cross-link на /sro-licenzii/ |
| `/demontazh/snos-garazha/` | ~1200 | tail | Металл / кирпич / ракушка · Утилизация · Цена · FAQ | 4-в-1 + перевозка металла |
| `/demontazh/snos-zabora/` | ~1200 | tail | Сетка / профнастил / кирпич · Цена за метр · FAQ | Простой сегмент с конкретной таксой |

**Все 33 sub:** breadcrumbs + hero (H1 cluster + цена «от X ₽» — допустимо в hero, anti-TOV блок только для основного текста; **операторская правка**: вместо «от X ₽» использовать «X ₽ за объект» как anchor) + tldr + text-content (≥1000 слов) + lead-form + mini-case ≥1 + cta-banner /foto-smeta/ + faq (4+ Q&A) + related-services (соседние sub в pillar).

**Schema:** Service + FAQPage + BreadcrumbList — на каждый sub.

### 3.2 · Programmatic SD batch (~150 URL / ~30 000 слов unique через 50/50 шаблонизацию)

> **Critical:** anti Scaled Content Abuse через rule 50% shared base + 50% district-specific (sustained от US-1 AC-3.2). cw production model для programmatic — **скрипты-генераторы**, не «писать каждый текст рукой».

#### 3.2.1 · 4 priority-A districts × ~24 sub-services = ~96 SD core

Districts: Одинцово / Красногорск / Мытищи / Раменское (priority-A apruv US-1 4-pillar).

Sub-services per district (24 sub):
- vyvoz-musora: 8 sub (kontejner, vyvoz-stroymusora, staraya-mebel, krupnogabarit, gazel, vyvoz-sadovogo-musora, uborka-uchastka, vyvoz-porubochnyh) — 8
- arboristika: 8 sub (spil-derevev, kronirovanie, udalenie-pnya, avariynyy-spil, raschistka-uchastka, spil-alpinistami, valka-derevev, izmelchenie-vetok) — 8
- chistka-krysh: 4 sub (chistnyy-dom, sbivanie-sosulek, ot-snega, uborka-territorii-zima) — 4
- demontazh: 4 sub (dachi, bani, snos-garazha, snos-zabora) — 4

**Итого:** 4 × 24 = **96 SD URL**.

#### 3.2.2 · 8 avtovyshka × 4 districts = 32 SD (per ADR-uМ-18)

`/arenda-tehniki/avtovyshka/<district>/` × 4 priority-A = 4 SD (не 8 × 4, поскольку avtovyshka — один sub-tehniki, разные high-vyshki — отдельная услуга арбо `/arboristika/spil-s-avtovyshki/<district>/` × 4 = 4 SD). Уточнение: **читаем ADR-uМ-18 как `/arenda-tehniki/avtovyshka/<district>/` × 8 districts = 8 URL** + cross-link на /arboristika/spil-s-avtovyshki/<district>/ × 4 priority-A = 4 URL = **итого 12 avtovyshka-related SD**, не 32.

> **Ambiguity flag для poseo:** план §«Stage 2» гласит «avtovyshka × 4 priority-A districts» = 4 SD; intake.md §«Programmatic SD ~150» гласит «8 avtovyshka × 4 districts = 32 SD». Sa-seo recommendation: **8 avtovyshka × 4 priority-A = 32 SD** относится к 8 sub-services где avtovyshka применима (vsozvolozhdennye spilom), не «8 × 4». Confirm от poseo: 4 SD (avtovyshka один sub × 4 districts) ИЛИ 32 SD (sub batch × 4 districts)? См. §10 открытый вопрос #2.

Sa-seo предполагает (default): **avtovyshka один sub-tehniki × 8 districts (priority-A 4 + Wave 1.5 4)** = 8 SD по ADR-uМ-18, но Stage 2 cap на priority-A только = **4 SD**. Wave 1.5 (Химки / Пушкино / Истра / Жуковский) — Stage 3 (US-3).

**Default scope для US-2:** 4 avtovyshka SD × priority-A. Если poseo confirm 8×4=32 — добавим 28 SD в scope.

#### 3.2.3 · Дополнительные supplementary sub × 4 districts = ~22 SD

Если оператор apruv'ит расширенный scope (см. §10 #2):
- avtovyshka × Wave 1.5 districts = 4 SD (Stage 3 candidate)
- остальные high-priority sub × extra districts = до ~22 SD

**Default Stage 2 scope (sa-seo recommendation):** 96 core + 4 avtovyshka = **~100 SD** (не 150). Если poseo выберет maximalist — 150.

#### 3.2.4 · Производственная модель programmatic SD

```
Total cw work: ~30 000 слов unique
├── Shared base (50%): ~15 000 слов
│   - Методология услуги (что входит, как 4-в-1, СРО)
│   - Reusable per sub-service (24 шаблона по 600 слов)
└── District-specific (50%): ~15 000 слов
    - Время выезда из бригадной точки (4 districts × ~150 слов = 600 слов)
    - Локальные landmarks (4 × ~200 слов = 800 слов)
    - МО vs МСК legislation (общий блок ~500 слов × 4 = 2000)
    - Конкретный кейс района (4 × ~300 слов = 1200 слов)
    - localFaq ≥2 (4 × 2 × ~150 слов = 1200 слов)
    - Время / цены модификаторы (4 × ~250 слов = 1000 слов)
```

**Каждая SD ~600 слов unique** (в TOV-checker лимит ≥300 слов publish-gate проходит). Все SD проходят publish-gate (1 hero + 1 text-300+ + 1 contact + mini-case + ≥2 localFaq).

**Schema:** Service + FAQPage + LocalBusiness (with district areaServed) + BreadcrumbList.

**Production-mode:** cw Run 5 — пишет 24 sub shared-content + 4 district-specific блоки; cms генерирует ~100 SD через `seed-content-stage2-programmatic.ts` (extension от Stage 1 seed) + автозаполнение через шаблон.

### 3.3 · B2B 10 страниц (~15 000 слов)

| URL | Объём | Spec | Winning angle |
|---|---|---|---|
| `/b2b/` | ~2000 | hero (B2B-крючок «штрафы ГЖИ на нас») + 4 segments cards + foto-smeta для B2B + lead-form B2B (организация, ИНН, контакт) + faq B2B | Главный B2B-вход; уникальный USP штрафы 0/17 |
| `/b2b/uk-tszh/` | ~2000 | hero «Для УК и ТСЖ» + 4 услуги для УК + штрафы ГЖИ + договор · цена абонентки · cases УК · faq | wsfreq 214 + 21 (cluster 247-ст УК РФ); главный B2B-сегмент |
| `/b2b/fm-operatoram/` | ~2000 | hero «Для FM-операторов» + outsourcing для зданий + SLA + cases FM + faq | Узкий segment, реальный B2B-канал |
| `/b2b/zastrojschikam/` | ~2000 | hero «Для застройщиков» + расчистка под стройку + демонтаж + СРО + faq | Cross-link на /demontazh/ + /arboristika/raschistka-uchastka/ |
| `/b2b/goszakaz/` | ~2000 | hero «Госзаказ 44-ФЗ / 223-ФЗ» + опыт тендеров + СРО + страховка + faq | Узкий, но real-revenue |
| `/b2b/dogovor/` | ~1000 | text-content что в нашем договоре + штрафы переходят на нас + cta-banner | Уникальный USP — «штрафы ГЖИ на нас» формализован |
| `/b2b/shtrafy-gzhi-oati/` | ~1000 | deep info (нормы ЖК РФ, КОАП-статьи) + примеры штрафов + наша ответственность + cta-banner | wsfreq 235 + nейро-цитируемость; уникальный B2B-крючок |
| `/b2b/dogovor-na-sezon/` | ~1000 | абонентский договор сезонный + цена месяц · что входит · cta-banner | Cross-link на /chistka-krysh/dogovor-na-sezon/ |
| `/b2b/kejsy/` | ~500 | индекс B2B-кейсов (3 segments) + cta-banner + filter (по сегменту) | Hub для 3 segment cases |
| `/b2b/kejsy/uk-tszh/` + 2 segment cases (zastrojschikam, fm-operatoram) | 3 × ~500 = ~1500 | hero (объект + сегмент + цена факт) + text · before-after + cta-banner | E-E-A-T B2B + социальное доказательство |

**Все 10:** breadcrumbs + hero + tldr + text-content + lead-form B2B (организация / ИНН / контакт) + mini-case ≥1 + cta-banner + faq (B2B-вопросы) + related-services где применимо.

**B2B-author:** оператор как реальный B2B-автор (если real name + VK/TG sameAs переданы); fallback — placeholder TODO от US-1.

**Schema:** Service + FAQPage + BreadcrumbList + Organization (для /b2b/) + Article (для /b2b/shtrafy-gzhi-oati/ — info-deep страница).

### 3.4 · Cases pack 8 (~5 000 слов / 8 × ~600)

| Case | Pillar | B2C/B2B | Spec |
|---|---|---|---|
| Вывоз 30 м³ строймусора в Одинцово (УК) | vyvoz-musora | B2B | hero (объект + район + цена факт) + before/after + text + mini-case data + cta-banner |
| Вывоз старой мебели на даче в Раменском | vyvoz-musora | B2C | то же |
| Спил 4 деревьев с разрешением в Мытищах | arboristika | B2C | то же |
| Расчистка участка под застройку в Красногорске | arboristika | B2B (застройщик) | то же |
| Чистка кровли МКД с договором сезон в Одинцово | chistka-krysh | B2B (УК) | то же |
| Сбивание сосулек в частном доме Мытищи | chistka-krysh | B2C | то же |
| Снос дачного дома + вывоз в Раменском | demontazh | B2C | то же |
| Снос складского комплекса для застройщика в Красногорске | demontazh | B2B (застройщик) | то же |

**Required:**
- **mini-case relationship binding на SD pages** — это закрывает publish-gate strict mode для programmatic SD (AC-3.5 от US-1). Без real-cases bind на SD — strict mode заблокирует publish ~100 SD.
- **before/after photos:** real photos preferred → fal.ai illustrative с явным TODO «replace на real photo» (см. §10 открытый вопрос #1)

**Schema:** Service + ImageObject (before/after) + Person/Organization author + BreadcrumbList.

### 3.5 · Extras 6 (~7 500 слов)

| URL | Объём | Spec | Winning angle |
|---|---|---|---|
| `/raschet-stoimosti/` | ~1500 | hero + 4 calculator placeholder cards + tldr + cta «фото→смета» + faq | Hub 4 калькуляторов; calc placeholder, реальная логика — отдельная US с pa-site |
| `/promyshlennyj-alpinizm/` | ~1500 | hero + связка с арбо/крышами/чисткой фасадов + СРО · цена за м² · Cases промальп · faq | wsfreq 2415; cross-link на /chistka-krysh/sbivanie-sosulek/ + /arboristika/spil-alpinistami/ |
| `/arenda-tehniki/` | ~1000 | hub + 4 sub (avtovyshka / izmelchitel-vetok / minitraktor / samosval) + cta | wsfreq 3017+3018+1083+280 = ~7400 head |
| `/arenda-tehniki/avtovyshka/` | ~750 | hero + цена час/смена · высота 18-26м · ГЛОНАСС · cta + faq | wsfreq 3017 head; programmatic × 4 districts (см. §3.2.2) |
| `/arenda-tehniki/izmelchitel-vetok/` | ~750 | hero + мощности · диаметр веток · цена · использование щепы · faq | wsfreq 3018 head |
| `/arenda-tehniki/minitraktor/` | ~750 | hero + работы (расчистка / снег / траспортировка) · цена · faq | wsfreq 280 |
| `/arenda-tehniki/samosval/` | ~750 | hero + объём кузова · вывоз стройотходов · цена · faq | wsfreq 1083 |
| `/porubochnyj-bilet/` | ~500 | text-content (как получить, сроки, мы помогаем оформить) + cta-banner + faq | Cross-link на blog #4-#6 «можно ли спилить» |

**Total extras:** 1500 + 1500 + (1000 + 750×4) + 500 = ~7500 слов.

**Schema:** Service на 4 arenda-tehniki sub + Calculator placeholder schema на /raschet-stoimosti/ (closed schema spec — реальная логика placeholder).

### 3.6 · Blog M2 10 (~12 000 слов / 10 × ~1200)

Темы #11-#20 из `seosite/05-content-plan/blog-topics.md`:

| # | URL | Cluster | Target key | Priority |
|---|---|---|---|---|
| 11 | `/blog/smeta-za-10-minut/` | C1 (расширение) | смета по фото | P0 (CR-driver, **ВАЖНО:** уже в Stage 1 W6 написана!) — **исключить, заменить #21** |
| 12 | `/blog/spil-berezy-na-uchastke/` | C2 | можно ли спилить берёзу | P1 |
| 13 | `/blog/spil-derevev-letom/` | C2 | спил летом · сезон | P2 |
| 14 | `/blog/mozhno-li-szhigat-musor/` | C11 | сжигание мусора участок | P1 |
| 15 | `/blog/oplata-za-musor-bez-propiski/` | C5 | оплата мусор без прописки | P1 |
| 16 | `/blog/kak-sortirovat-musor/` | C9 | сортировка мусора | P2 |
| 17 | `/blog/kogda-obrezat-sosny/` | C10 | обрезать сосны | P2 |
| 18 | `/blog/kak-obrezat-grushu/` | C7 | обрезка груши | P2 |
| 19 | `/blog/obrezka-slivy-vesnoy/` | C8 | обрезка сливы весной | P2 |
| 20 | `/blog/chto-takoe-musor/` | C12 + C22 | классификация мусора | P2 |

> **Correction:** Blog #11 «Смета за 10 минут» уже включена в Stage 1 cornerstone M1 (US-1 §3.4). Stage 2 M2 = **#12-#21** (10 статей), не #11-#20. Эта correction должна быть согласована с poseo (см. §10 открытый вопрос #4).

**Каждая ~1200 слов:** breadcrumbs + hero (H1 + автор + дата + cover) + tldr + text-content (≥4 H2 секций с target keys) + faq (3-5 Q&A) + cta-banner /foto-smeta/ + related-services (2-3 ссылки на pillar/sub).

**Author:** «Бригада вывоза Обихода» (company-page из US-0/US-1) для info-cluster статей (#13-#20); оператор как B2B-автор для commercial-bridge статей (#12, #21 если входит).

**Schema:** Article + Person/Organization + BreadcrumbList + FAQPage.

### 3.7 · Out-of-scope (детально)

- **4 priority-B districts** (Химки / Пушкино / Истра / Жуковский) — US-3 Stage 3 W12-W13
- **~60 SD batch priority-B** (4 districts × ~15 sub) — US-3 Stage 3
- **Blog M3** (статьи #21-30) — US-3 / US-4 Stage 3
- **E-E-A-T артефакты** (`seosite/06-eeat/` + `seosite/07-neuro-seo/` + `seosite/08-monitoring/`) — US-4 Stage 3 W14
- **Calculator реальная логика** (placeholder из US-0/US-1 остаётся) — отдельная US с pa-site (backlog)
- **Real images replacement при отсутствии reals** (через fal.ai illustrative с явным TODO) — backlog operator
- **3 missing static routes** (sro-licenzii / komanda / park-tehniki) — backlog separate US-A11Y-CHROME-CONTRAST + US-3-MISSING-ROUTES (3 routes которые US-1 пытался написать, но не закрыл по контенту)
- **Visual Regression CI** (Chromatic / Percy) — backlog после W14
- **6 cases добавочных** (до 12-15 общего пакета) — US-4 Stage 3
- **AI-pipeline fal.ai стиль ревизия** — final apruv в US-4 W14

## 4 · Tracks (5 параллельных + 1 sequential для programmatic)

US-2 — масштабное наполнение валидированного шаблона (US-1 закрыл W7 baseline pilot). Tracks поделены по типам deliverable как в US-1, с расширением Track A на 5 sequential cw-runs из-за объёма (~57 текстов; больше любой другой US в эпике). PO orchestration по iron rule #7.

### 4.1 · Track A — Content Production (owner: cw + seo-content) — ~5 sequential runs

**Цель:** ~57 текстов (~75 000 слов) на TOV-checker exit 0; 100% review pillar/B2B/cases от cw, 20% sampling SD/sub.

| Run | Period | Deliverable | Word count | Acceptance |
|---|---|---|---|---|
| Run 1 | W8 (W1-W2) | 33 sub-services (4 pillar batches) | ~50 000 | TOV-check pass; cw 20% sampling (1 из 8 в каждом pillar = 4 full review); LLM-augmented через `claude-api` prompt caching iron rule |
| Run 2 | W11 part 1 | 10 B2B-страниц | ~15 000 | TOV-check pass; cw 100% review (B2B-крючок не на sampling); B2B-author оператор apruv |
| Run 3 | W11 part 2 | 8 Cases pack | ~5 000 | TOV-check pass; cw 100% review (real-cases важны для E-E-A-T); fal.ai illustrative apruv art |
| Run 4 | W11 part 3 | 6 extras + 10 blog M2 | ~7 500 + ~12 000 = ~19 500 | TOV-check pass; cw 100% review (cornerstone приоритет); blog Article schema slot |
| Run 5 | W10 | Programmatic SD shared-content scripts (24 sub × ~600 + 4 district-specific blocks) | ~30 000 unique | TOV-check pass на shared scripts; 50/50 rule валидируется linter; cw 20% sampling (1 из 24 sub shared-content full review + 1 district-specific full review = 2 текста) |

**Hand-off с другими tracks:**
- W8 W1: art apruv W7 baseline стиля (~50 fal.ai hero) → cms может seed sub-services
- W9 W1: cw Run 1 финальный → cms publish 33 sub
- W10: cw Run 5 (shared/specific scripts) → cms generate ~100 SD
- W11 W1: cw Run 2-4 параллельно (B2B + Cases + extras + blog) — это критическая неделя bottleneck

**Critical:** Run 5 — production-mode не «писать текст», а **писать шаблон**. cw пишет 24 base scripts + 4 district modifiers; cms генерирует SD через шаблонный seed.

### 4.2 · Track B — Visual Production (owner: cms через fal.ai + art apruv)

**Цель:** ~50 hero (33 sub + 10 B2B + extras) + 8 cases before/after photos + ~50 SD hero (или повторное использование pillar hero).

| Deliverable | Owner | Tool | Acceptance |
|---|---|---|---|
| 33 sub-services hero (~33 hero) | art apruv → cms через `site/lib/fal/prompts.ts` | Nano Banana Pro (1280×720) | art apruv каждого batch (cohesive style across 33); §14 анти-§14 не присутствуют |
| 10 B2B hero | art apruv → cms | Nano Banana Pro | b2bHeroPrompt (без рукопожатий per art W2) |
| 8 cases hero + 16 before/after (8 × 2) | art apruv → cms (или real photos если operator передаст) | Standard для thumbnails | art apruv каждого + license + alt + geo |
| 6 extras hero | art apruv → cms | Nano Banana Pro | art apruv |
| ~100 SD hero (или reuse pillar hero) | art recommendation: reuse pillar hero на programmatic SD (визуально consistent + экономит fal.ai cost) — апруv от art | — | sa-seo recommendation: **reuse**, не генерировать новые ~100 visuals |

**Total fal.ai generation:** ~57 hero (33 sub + 10 B2B + 8 cases + 6 extras) + 16 before/after = ~73 visuals. Bonus: SD reuse pillar hero = 0 generations.

**art apruv batches:**
- W8 W2: 33 sub-services hero apruv (1 batch event, ~33 visuals)
- W11 W1: 10 B2B + 8 cases + 6 extras + 16 before/after apruv (~40 visuals batch event)

**Anti-paтерн compliance (sustained от US-1 AC-6.6):**
- Никаких stock photos, никаких людей с лицами
- Нет анти-§14: эко-зелёные / топор/бензопила / рыцари / рукопожатия / матрёшки / градиенты в primary
- B2B hero: documentary, без рукопожатий
- Cases before/after: реальные сценки бригад на объектах (без лиц)

### 4.3 · Track C — Tech-SEO sweep (owner: seo-tech)

**Цель:** schema 0 errors на ~210 страниц + sitemap.xml расширение + canonical + redirects + lint:schema strict mode + JSON-LD inject verification.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| schema validation ~210 pages | seo-tech | `pnpm lint:schema --sample 50 --urls=<list>` или `--all` | exit 0 на ~210 URL; report `screen/stage2-W11/lint-schema-report.json` |
| sitemap.xml расширение | seo-tech | автогенерация `site/app/sitemap.ts` | ~210 новых URL с priority по wsfreq + cluster (sub priority 0.6-0.8, SD priority 0.5, B2B 0.7, blog 0.6, extras 0.5) |
| Canonical на каждой странице | seo-tech | generateMetadata Next.js | self-canonical; нет circular |
| Redirect chain check | seo-tech | `pnpm tsx scripts/check-redirects.ts` | После Stage 2 publish — 0 redirect chains; legacy `ochistka-krysh` → `chistka-krysh` стабилен |
| Я.ВебМастер «Структурированные данные» | seo-tech (manual) | `seosite/08-monitoring/ya-vebmaster-W11.md` | 0 ошибок на ~210 URL после crawl |
| lint:schema CI strict mode | seo-tech | `.github/workflows/ci.yml` | После W11 — `lint:schema` блокирующий, не warning (sustained от US-1) |
| Slug bug fix: `odintsovo` vs `odincovo` | seo-tech | `site/components/blocks/NeighborDistricts.tsx` или Districts seed | Все 9 ссылок на `/raiony/odintsovo/` redirect или fix на `/raiony/odincovo/` (closure от differentiation-matrix W7 §«Critical bug») |

**Hand-off:**
- W10: cms publish ~100 SD → seo-tech запускает schema validation на batch
- W11 W1: seo-tech запускает lint:schema на ~210 URL → блокер для publish status flip

### 4.4 · Track D — Bulk publish (owner: cms)

**Цель:** seed-content-stage2 extension + programmatic SD batch generator + media bulk seed.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| `seed:content:stage2` extended | cms + seo-tech | `site/scripts/seed-content-stage2.ts` (новый) | Idempotent; safety-gate `OBIKHOD_SEED_CONFIRM=yes`; loads from `site/content/stage2-w8/<slug>.json` (33 sub) |
| `seed:programmatic:stage2` | cms | `site/scripts/seed-programmatic-stage2.ts` (новый) | Генерирует ~100 SD из shared-content + district-modifier шаблонов; publish-gate validation per SD |
| ~57 страниц `_status: published` | cms | админка или seed | sub + B2B + Cases + extras + blog M2 видны на `staging.obikhod.ru` или local |
| ~100 SD `_status: published` | cms | seed:programmatic:stage2 | Все ~100 SD проходят publish-gate; 50/50 rule валидируется (autoseed reject если <300 unique words) |
| Media bulk seed | cms | `site/scripts/seed-media-stage2.ts` (новый) | ~73 fal.ai images загружены в Payload Media с alt + license + geo |
| Authors operator real names finalize | cms (operator передаёт) | Payload Authors | Real names + VK/TG sameAs (если operator передал к W11) или placeholder |

**Critical для programmatic:**
- Backup БД ПЕРЕД bulk publish (~100 SD = большая операция) — apruv dba (cross-team)
- Idempotent seed (findOneBySlug) — повторный run безопасен
- Rollback strategy: `OBIKHOD_SEED_ROLLBACK=stage2` режим

**Hand-off:**
- W10 W2: cms запускает `seed:programmatic:stage2` после Track A Run 5 финализации
- W11 W1: publish status flip для всех ~210 → блокер для Track E benchmark

### 4.5 · Track E — Benchmark + QA (owner: re + seo-content + qa-site)

**Цель:** W11 mid-check 17 конкурентов через Keys.so + Topvisor (если creds operator передал; fallback — sustained methodology US-1); Playwright screenshots + axe в `screen/stage2-W11/`; differentiation-matrix W11 update; CR-pathways verify.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| W11 mid-benchmark 17 конкурентов | seo-content + re | `seosite/01-competitors/benchmark-W11-mid.md` | 5 осей × 17, % closure URL-gap к топ-3 (≥40%), ≥2 confirmed оси опережения |
| differentiation-matrix.md update W11 | seo-content | `seosite/01-competitors/differentiation-matrix.md` | Обновление с реальными W11 цифрами (vs W7 baseline) + winning angles confirmation |
| Playwright screenshots ~50 random URL × {desktop, mobile} = ~100 PNG | qa-site | `screen/stage2-W11/<slug>-{desktop,mobile}.png` | random sample из ~210 URL: 33 sub + 10 B2B + 6 extras + 1 sample SD каждого pillar = ~50 URL × 2 viewports = 100 PNG |
| axe-core scan ~50 sample URL | qa-site | `screen/stage2-W11/axe-violations-<slug>.json` | 0 critical / 0 serious из блочного контента (legacy chrome contrast — backlog) |
| CR-pathways verify | qa-site | `screen/stage2-W11/cr-pathways-report.md` | sub→pillar→lead-form (≥3 пути) + SD→neighbor→другой SD (≥2 пути) + B2B→cases→pillar (≥2 пути) — все работают |
| Я.ВебМастер baseline W11 | seo-tech | `seosite/08-monitoring/ya-vebmaster-W11.md` | 0 ошибок «Структурированные данные»; ~210 страниц проиндексированы |

**Hand-off:**
- W11 W2: после publish status flip → qa-site запускает Playwright + axe
- W11 W3: benchmark + differentiation-matrix update → operator gate

## 5 · Acceptance Criteria

> 13 групп AC, 50+ проверяемых пунктов. Каждый AC — измеримый. Sustained от US-1 + расширения для Stage 2 scale.

### AC-1 · 33 sub-services

- **AC-1.1.** Каждый sub содержит ~1500 слов (allow ±20%, 1200-1800); измерено `pnpm wc:check` или ручной split.
- **AC-1.2.** H1 содержит target keyword из cluster (см. §3.1 таблицы).
- **AC-1.3.** H2 ≥3 секции с supplement keys из cluster.
- **AC-1.4.** Цены: конкретные числа («12 800 ₽ за объект до 5 м³» / «450 ₽/м² за чистку»), допустимо в hero «X ₽ за объект» как anchor; **не** «от X ₽» в основном тексте (TOV-checker блокирует).
- **AC-1.5.** lead-form ИЛИ cta-banner /foto-smeta/ ≥1 раза.
- **AC-1.6.** mini-case block ≥1 (real или generic с TODO; в Stage 2 после Cases pack — bind на реальный case через relationship).
- **AC-1.7.** FAQ ≥4 Q&A с FAQPage schema. Q ≥3 слова, A ≥40 слов с конкретикой.
- **AC-1.8.** related-services block с 2-3 cross-link на соседние sub в pillar.
- **AC-1.9.** 4-в-1 cross-sell упоминается где применимо (sub vyvoz-musora ↔ arboristika ↔ chistka-krysh ↔ demontazh).
- **AC-1.10.** TOV-checker exit 0 на каждом из 33 sub. cw 20% sampling (1 из 8 в каждом pillar = 4 full review).
- **AC-1.11.** schema Service + FAQPage + BreadcrumbList present и валидно (lint:schema exit 0).
- **AC-1.12.** Cross-link integrity: каждый sub ссылается на свой pillar (back-link); pillar обновляется services-grid с reference на 33 sub (cms re-seed pillars).

### AC-2 · ~100 Programmatic SD batch (4 priority-A × ~24 sub + 4 avtovyshka)

- **AC-2.1.** Каждый SD содержит ~600 слов unique (≥300 publish-gate threshold).
- **AC-2.2.** 50% shared base + 50% district-specific (anti Scaled Content Abuse, sustained от US-1):
  - **Shared base:** методология услуги (что входит, как работает 4-в-1, СРО/договор)
  - **District-specific:** время выезда из бригадной точки + локальные landmarks + МО vs МСК legislation + конкретный кейс района + localFaq ≥2
- **AC-2.3.** publish-gate проходит на 100% SD: 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq. Без gate publish — Payload error.
- **AC-2.4.** mini-case relationship binding на каждой SD — bind на real Case из Cases collection (после AC-4 закрытия). Без real-case bind — strict mode publish-gate заблокирует.
- **AC-2.5.** ≥2 localFaq (Q&A про работу в районе): «Сколько времени едет бригада в <district>?» / «Берёте ли вы вывоз мусора в дачных посёлках <district>?» / др.
- **AC-2.6.** neighbor-districts block: 3 ближайших района из `District.relatedDistricts`/`neighborDistricts` (sustained US-1; **bug fix:** `odincovo` slug, не `odintsovo`).
- **AC-2.7.** schema Service + FAQPage + LocalBusiness (with district areaServed) + BreadcrumbList present и валидно.
- **AC-2.8.** TOV-checker exit 0 на shared scripts + 20% sampling district-specific (1 из 24 sub shared-content full review + 1 из 4 districts district-specific full review = 2 cw full review).
- **AC-2.9.** Cross-link integrity: каждый SD ссылается на parent sub-service (back-link) + parent district hub (`/raiony/<district>/`); district hub обновляется services-grid с references на 24 sub × district (cms re-seed districts).
- **AC-2.10.** seed-программmatic генератор: idempotent (findOneBySlug); rollback `OBIKHOD_SEED_ROLLBACK=stage2`; safety-gate `OBIKHOD_SEED_CONFIRM=yes`.

### AC-3 · 10 B2B-страниц

- **AC-3.1.** Каждая B2B-страница содержит свой объём по §3.3 (allow ±20%): /b2b/, /b2b/uk-tszh/, /b2b/fm-operatoram/, /b2b/zastrojschikam/, /b2b/goszakaz/ ~2000 каждая; /b2b/dogovor/, /b2b/shtrafy-gzhi-oati/, /b2b/dogovor-na-sezon/ ~1000 каждая; /b2b/kejsy/ ~500; 3 segment cases по ~500.
- **AC-3.2.** B2B-крючок «штрафы ГЖИ/ОАТИ берём» присутствует на всех 4 segments + /b2b/dogovor/ + /b2b/shtrafy-gzhi-oati/ (winning angle 0/17 sustained).
- **AC-3.3.** lead-form B2B (организация / ИНН / контакт) на всех 4 segments + /b2b/.
- **AC-3.4.** mini-case ≥1 (реальный B2B case из Cases pack — после AC-4 закрытия; до того — generic с TODO).
- **AC-3.5.** FAQ B2B-вопросы (договор, штрафы, оплата, сроки, абонентка) ≥4 Q&A.
- **AC-3.6.** B2B-author оператор (если real name + VK/TG sameAs переданы к W11; fallback placeholder).
- **AC-3.7.** /b2b/shtrafy-gzhi-oati/ — info-deep страница: ЖК РФ ст. 161, КОАП ст. 7.22, примеры штрафов с конкретными суммами, наша ответственность по договору.
- **AC-3.8.** schema Service + FAQPage + Organization + BreadcrumbList на всех B2B; Article на /b2b/shtrafy-gzhi-oati/ (info-deep).
- **AC-3.9.** TOV-checker exit 0 + cw 100% review всех 10 B2B-текстов.

### AC-4 · 8 Cases pack

- **AC-4.1.** Каждая case ~600 слов (allow ±20%): hero (объект + район + услуга + цена факт) + text-content (задача / решение / результат) + before/after или mini-case data + cta-banner.
- **AC-4.2.** real before/after photos preferred. Fallback: fal.ai illustrative с явным TODO «replace на real photo» в admin notes (см. §10 #1).
- **AC-4.3.** mini-case relationship binding к sub-services + districts (publish-gate dependency для ~100 SD; AC-2.4).
- **AC-4.4.** Cases распределены по pillar: 2 vyvoz-musora (B2C + B2B) + 2 arboristika (B2C + B2B) + 2 chistka-krysh (B2C + B2B) + 2 demontazh (B2C + B2B).
- **AC-4.5.** Cross-link на /b2b/kejsy/<segment>/ (3 segment indices обновляются со ссылками на 4 B2B cases).
- **AC-4.6.** schema Service + ImageObject (для before/after) + Person/Organization author + BreadcrumbList.
- **AC-4.7.** TOV-checker exit 0 + cw 100% review.

### AC-5 · 6 Extras

- **AC-5.1.** /raschet-stoimosti/ — hub калькуляторов:
  - hero + tldr + 4 calculator placeholder cards (avtovyshka / izmelchitel / minitraktor / samosval) + cta «фото→смета мощнее» + faq
  - Calculator placeholder с явным TODO «реальная логика — отдельная US с pa-site»
- **AC-5.2.** /promyshlennyj-alpinizm/ — hero (wsfreq 2415) + tldr + text-content (СРО / технология / цена за м²) + cases промальп ≥1 + cta + faq + cross-link на /chistka-krysh/sbivanie-sosulek/ + /arboristika/spil-alpinistami/.
- **AC-5.3.** /arenda-tehniki/ — hub + 4 sub cards + cta-banner.
- **AC-5.4.** 4 arenda-tehniki sub (avtovyshka / izmelchitel-vetok / minitraktor / samosval) — каждый ~750 слов с цена/высота/мощность + cross-link на pillar где применимо.
- **AC-5.5.** /porubochnyj-bilet/ — text-content (как получить, сроки, мы помогаем оформить) + cta-banner + faq.
- **AC-5.6.** schema Service на 4 arenda-tehniki sub; Calculator placeholder schema на /raschet-stoimosti/; Article на /porubochnyj-bilet/.
- **AC-5.7.** TOV-checker exit 0 + cw 100% review всех 6 extras (cornerstone приоритет).

### AC-6 · 10 Blog M2

- **AC-6.1.** Каждая ~1200 слов (allow ±20%, 950-1450).
- **AC-6.2.** TLDR ≥3 предложения нейро-ответ (короткий direct answer на target keyword).
- **AC-6.3.** H2 ≥4 секции с target keys из cluster.
- **AC-6.4.** Списки/таблицы (нейро-парсинг) — ≥1 список или таблица в каждой статье.
- **AC-6.5.** FAQ-блок 3-5 Q&A в конце.
- **AC-6.6.** CTA-banner на /foto-smeta/ + related-services 2-3 ссылки на pillar/sub.
- **AC-6.7.** Author = «Бригада вывоза Обихода» для info-cluster (#13-#20); оператор как B2B-автор для commercial-bridge (#12, #21 если входит per §10 #4).
- **AC-6.8.** Article + Person/Organization schema + BreadcrumbList + FAQPage.
- **AC-6.9.** TOV-checker exit 0 + cw 100% review.

### AC-7 · Visual Production (fal.ai ~73 visuals)

- **AC-7.1.** ~33 sub-services hero (Nano Banana Pro 1280×720) — art apruv batch W8 W2.
- **AC-7.2.** 10 B2B hero (b2bHeroPrompt без рукопожатий) — art apruv W11 W1 batch.
- **AC-7.3.** 8 cases hero + 16 before/after (Standard для thumbnails) — art apruv W11 W1 batch.
- **AC-7.4.** 6 extras hero — art apruv W11 W1 batch.
- **AC-7.5.** ~100 SD: **reuse pillar hero**, не генерировать новые ~100 visuals (sa-seo art-apruv recommendation; экономит ~$30 fal.ai cost).
- **AC-7.6.** Каждое hero — alt + license + geo через Payload Media (sustained US-1 AC-6.5).
- **AC-7.7.** Анти-§14 не присутствуют (TOV-checker не покрывает images, проверка art-apruv): нет stock photos / эко-зелёные / топор / рукопожатия / матрёшки / градиенты в primary.
- **AC-7.8.** real photos для cases preferred → fal.ai illustrative с TODO replacement (см. §10 #1).

### AC-8 · Tech-SEO sweep

- **AC-8.1.** schema validation 0 errors на ~210 страниц через `pnpm lint:schema --sample 50` или `--all`. Report `screen/stage2-W11/lint-schema-report.json`.
- **AC-8.2.** sitemap.xml автоматически содержит ~210 новых URL с priority по wsfreq + cluster:
  - sub priority 0.6-0.8 (по wsfreq)
  - SD priority 0.5
  - B2B priority 0.7-0.9 (главный B2B-крючок 0.9 на /b2b/shtrafy-gzhi-oati/ + /b2b/dogovor/)
  - Cases priority 0.6
  - extras priority 0.5
  - blog priority 0.6
- **AC-8.3.** Canonical на каждой странице self-canonical (через generateMetadata Next.js). Нет circular canonicals.
- **AC-8.4.** Redirect chain check: 0 chains > 1 hop; legacy `ochistka-krysh` → `chistka-krysh` 301 stable.
- **AC-8.5.** Я.ВебМастер «Структурированные данные» — 0 ошибок на ~210 URL после crawl. Артефакт `seosite/08-monitoring/ya-vebmaster-W11.md`.
- **AC-8.6.** Slug bug fix: `odintsovo` → `odincovo` на neighbor-districts (closure US-1 W7 differentiation-matrix critical bug). Все 9 ссылок работают.
- **AC-8.7.** lint:schema CI strict mode active (sustained от US-1 → US-2 finalize).

### AC-9 · Bulk Publish

- **AC-9.1.** cms запускает `seed:content:stage2` (новый script) с safety-gate `OBIKHOD_SEED_CONFIRM=yes`. Idempotent (findOneBySlug). Loads from `site/content/stage2-w8/<slug>.json` (33 sub) + `stage2-w11/<slug>.json` (B2B + Cases + extras + blog M2).
- **AC-9.2.** cms запускает `seed:programmatic:stage2` (новый script) для ~100 SD generation из shared-content + district-modifier шаблонов. publish-gate validation per SD; reject + log если 50/50 rule не соблюдается (<300 unique words).
- **AC-9.3.** Backup БД ПЕРЕД bulk publish — apruv dba (cross-team). Backup в `site/backups/<timestamp>/`. Rollback strategy: `OBIKHOD_SEED_ROLLBACK=stage2` mode.
- **AC-9.4.** ~210 страниц в Payload `_status: published`. Все видны на `obikhod.ru/<url>/` (или staging).
- **AC-9.5.** Authors operator real names + VK/TG sameAs finalize если operator передал к W11; иначе placeholder с TODO в admin notes (sustained US-1 policy).
- **AC-9.6.** Cases pack — `Cases` collection заполнена 8 cases с real or fal.ai images. mini-case relationship binding на ~100 SD + 33 sub + 10 B2B finalized.

### AC-10 · W11 Competitor Benchmark Mid-Check

- **AC-10.1.** 17 конкурентов через Keys.so (если operator передал creds к W11) — fallback: deep-profiles + Я.ВебМастер baseline + manual SERP top-50 (sustained US-1 methodology). Точность ±15%.
- **AC-10.2.** 5 осей: URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage. Метрики из плана §«Methodology».
- **AC-10.3.** ≥40% closure URL-gap к топ-3 (musor.moscow + liwood.ru + cleaning-moscow.ru — топ-3 sustained от US-1 W7 baseline). Расчёт: (наши URL Stage 2 / медиана топ-3 URL) × 100% ≥ 40%.
- **AC-10.4.** ≥2 confirmed оси опережения топ-3:
  - **Schema-coverage:** sustained от US-1 W7 (+50pp); Stage 2 ~210 URL должно сохранить 100% coverage.
  - **URL-объём:** Stage 2 → ~232 URL (Stage 1 22 + Stage 2 ~210); если ≥40% closure достигнут — это новая ось опережения по 4-pillar (vs musor.moscow 4-pillar coverage = 0; они только мусор).
  - **UX (foto-smeta):** sustained от US-1 W7; Stage 2 sustained.
  - **Content-depth:** Stage 2 ~75 000 слов через 33 sub + B2B = средний объём pillar/sub +20% vs liwood.ru → если confirmed = 4-я ось опережения.
- **AC-10.5.** Артефакт: `seosite/01-competitors/benchmark-W11-mid.md` (формат по плану §«Формат отчёта») + обновление `differentiation-matrix.md` v3 (W7 baseline → W11 update).

### AC-11 · QA + Playwright

- **AC-11.1.** Random sample ~50 URL из ~210 (33 sub + 10 B2B + 6 extras + 1 sample SD каждого pillar = ~50 URL) — все HTTP 200 на staging (или local).
- **AC-11.2.** Все sample URL рендерят blocks через BlockRenderer.
- **AC-11.3.** 0 critical / 0 serious axe violations из блочного контента. Legacy SiteChrome contrast — backlog (sustained US-1).
- **AC-11.4.** Playwright screenshots в `screen/stage2-W11/<slug>-{desktop,mobile}.png` (~100 PNG: 50 desktop + 50 mobile). Viewport: 1920×1080 desktop / 375×812 mobile.
- **AC-11.5.** CR-pathways verify (Playwright или manual):
  - sub→pillar→lead-form: ≥3 пути работают
  - SD→neighbor→другой SD: ≥2 пути работают (после bug fix `odincovo`)
  - B2B→cases→pillar: ≥2 пути работают (B2B segment → case → relevant pillar/sub)
  - blog M2 → pillar/sub → lead-form: ≥2 пути
  - Артефакт: `screen/stage2-W11/cr-pathways-report.md`

### AC-12 · Design-system compliance (operator reminder mandatory)

> Operator reminder 2026-05-02 13:30 (sustained для Stage 2): «не забывай использовать дизайн систему!» — design-system awareness усилен.

- **AC-12.1.** Все тексты прошли TOV-checker (anti §13 Don't + §14 анти-паттерны). 100% pillar/B2B/cases review от cw; 20% sampling SD/sub.
- **AC-12.2.** Все блоки используют tokens из brand-guide §4 Color (--c-primary #2d5a3d, --c-accent #e6a23c, --c-ink, --c-bg) и §7 Shape (--radius-sm 6, --radius 10, --radius-lg 16). Никаких hardcoded hex/px вне tokens.
- **AC-12.3.** Иконки в services-grid + sub-services из §9 brand-guide (49 line-art glyph). Никаких emoji, никаких стоковых иконок.
- **AC-12.4.** Type-system §6 (Golos Text + JetBrains Mono). H1-H6 + body + caption по шкале brand-guide.
- **AC-12.5.** §33 site-chrome canonical — header/footer на ~210 страниц соответствуют canonical spec; нет улучшений в Stage 2.
- **AC-12.6.** Анти-§14 не присутствуют:
  - В тексте: anti-words из §13 Don't («услуги населению», «клиент» в B2C, «имеем честь», «осуществляем деятельность», «от 1 000 ₽» в основном тексте, «в кратчайшие сроки», «гарантируем качество», «индивидуальный подход», «мы дорожим репутацией», «твёрдые коммунальные отходы» в B2C, «древесно-кустарниковая растительность» в B2C, «цены договорные», «звоните узнавайте», «обращайтесь»)
  - В images: anti-§14 (фотостоки, эко-зелень+листочек, топор/бензопила, рыцарь/щит, рукопожатия, рукавицы, матрёшки/берёзки, градиенты в primary, неоновые ховеры)
- **AC-12.7.** art apruv каждого batch image generation (cohesive style).
- **AC-12.8.** cw apruv TOV для 100% pillar/B2B/cases (33 sub partial via 20% sampling, 10 B2B + 8 cases full review = 18 текстов full review; 6 extras + 10 blog M2 cornerstone full review = 16 текстов; итого ~34 full + ~23 sampling = ~57 текстов).

### AC-13 · Operator gate W11

- **AC-13.1.** Demo на staging URL (если do задеплоил — `staging.obikhod.ru`) ИЛИ local + screenshots (~100 PNG из AC-11.4 + axe reports + cr-pathways report + benchmark-W11-mid + differentiation-matrix v3).
- **AC-13.2.** Артефакт: `specs/EPIC-SEO-CONTENT-FILL/US-2-sub-and-programmatic/operator-review-W11.md` (создаёт poseo в W11) — содержит:
  - ~50 random sample URL списком с visual screenshots
  - ~100 PNG screenshots inline или ссылками
  - benchmark-W11-mid.md ссылкой
  - differentiation-matrix.md v3 ссылкой
  - axe-violations отчёты (должны быть 0 critical/serious)
  - cr-pathways report
  - Чек-лист «что апрувить»: TOV / визуал / structure / SEO-мета / lead-form работа / B2B-крючок / 4-в-1 cross-sell / winning angles confirmed
- **AC-13.3.** Operator review: visual look + content quality + benchmark + B2B-крючок confirm.
- **AC-13.4.** Operator apruv для Stage 3 либо корректировки. Hard gate: без явного apruv US-3 не стартует. При возврате — poseo распределяет правки по tracks, новый review-цикл ≤7 рабочих дней (буфер до W12 W2).

## 6 · Hand-off план (phase transitions)

```
[2026-05-02 HH:MM] poseo → sa-seo
  · фаза: spec
  · артефакт: этот файл (sa-seo.md)

[2026-05-02 HH:MM] sa-seo → poseo (apruv sa-spec)
  · фаза: spec → planning
  · апрув: poseo читает spec, апрувит, переключает phase

[2026-05-?? W8 W1] poseo → tracks parallel start (W8 W1)
  · фаза: planning → dev (5 tracks параллельно)
  · Track A → cw + seo-content (Run 1: 33 sub-services)
  · Track B → art + cms через fal.ai (sub-services hero batch)
  · Track C → seo-tech (schema validation prep)
  · Track D → cms (seed:content:stage2 setup)
  · Track E → re + seo-content (W11 benchmark prep)

[W9 EOW] tracks → poseo (W9 EOW gate)
  · 33 sub-services finished (Track A Run 1)
  · 33 sub hero generated + art apruv (Track B)
  · seed:content:stage2 готов (Track D)

[W10 EOW] tracks → poseo (W10 EOW gate)
  · cw Run 5: shared/specific scripts finished (Track A)
  · ~100 SD generated через programmatic seed (Track D)
  · schema validation на ~100 SD (Track C)

[W11 EOW] tracks → poseo (W11 EOW gate)
  · cw Runs 2-4 finished параллельно: 10 B2B + 8 Cases + 6 extras + 10 blog M2 (Track A)
  · 40+ B2B/cases/extras hero + before/after generated (Track B)
  · sitemap.xml + canonical + redirect-check + lint:schema strict mode (Track C)
  · ~57 страниц + ~100 SD published (Track D)
  · qa-site Playwright + axe + CR-pathways verify (Track E)
  · benchmark-W11-mid + differentiation-matrix v3 (Track E)

[W11 EOD] poseo → operator (W11 gate)
  · фаза: qa → gate
  · operator-review-W11.md собран
  · Hard gate: оператор apruv → US-3 starts; reject → revise loop ≤7 раб. дней (W12 W2)

[W11+1 → W12] operator → poseo (apruv) → US-3 stub created
  · фаза: gate → done
  · poseo обновляет phase: done в этом sa-spec
  · US-3-priority-b-districts/sa-seo.md → новая sa-spec (sa-seo пишет)
```

## 7 · Cross-team зависимости и эскалации

| Зависимость | Owner-team | Риск | Эскалация |
|---|---|---|---|
| art apruv визуального стиля ~73 visuals (33 sub + 10 B2B + 8 cases + 16 before/after + 6 extras) | design (art) | Блокер для cms publish (без art apruv hero — placeholder) | poseo → art напрямую (cross-team agent через iron rule #7); 2 batch apruv events (W8 W2 sub-services; W11 W1 B2B+cases+extras) — early apruv W8 первой партии критичен |
| dba apruv backup ПЕРЕД bulk publish ~100 SD | common (dba) | Блокер для Track D programmatic publish | poseo → dba напрямую; backup script готов до W10 W2; rollback strategy validated |
| do staging deploy (subdomain `staging.obikhod.ru`) | common (do) | Не блокер локально (CR-pathways verify работает на local); блокер для public preview operator gate | sustained от US-1: если do не готов к W11 — gate на local + screenshots (AC-13.1 fallback) |
| operator real names (имя оператора, VK, TG, ИНН/ОГРН, СРО номера) | оператор | Блокер для finalize Authors bio + sro-licenzii страница (если входит в Stage 2 — out-of-scope, отложено US-1) | sustained US-1 policy: placeholder с явным TODO; real-name swap через cms re-seed когда оператор передаст |
| Topvisor / Keys.so creds для W11 mid-check | оператор | Risk для AC-10.1 точности | sustained fallback methodology US-1 (deep-profiles + manual SERP); точность ±15% |
| Cases pack real photos | оператор / cms (fal.ai fallback) | Risk для AC-4.2 (real preferred) | fal.ai illustrative с явным TODO replacement (см. §10 #1) |
| 3 missing routes (sro-licenzii / komanda / park-tehniki) | panel + product (popanel + podev) | Не блокер US-2 (отложено в backlog separate US); cross-link integrity не страдает | backlog priority в panel/integration |
| BlockRenderer + Payload schema на 7 routes | panel (popanel + be-panel + fe-site) | US-0 закрыл; US-2 sub-services + B2B + Cases + extras все на новом BlockRenderer | Не блокер; legacy SubServiceView — Stage 0 закрытое decision (если sub-services используются) |
| skill `claude-api` prompt caching для cw LLM-augmented writing | seo (cw + seo-content) | Cost overrun на 75 000 слов | Iron rule sustained от US-1: prompt caching ≥1024 токенов system prompt (TOV rules + brand-guide §13/§14); cache-hit rate target ≥80% |

## 8 · Риски (топ-5)

### R1 — Programmatic SD как Scaled Content Abuse (P=0.6, **CRITICAL**)

**Описание:** Google demote за «многократно похожий контент по шаблону». ~100 SD URL — больше чем 4 SD pilot Stage 1 в 25×; шаблон 50/50 не битт на этом масштабе. Особенно опасно: 8 sub × 4 districts = 32 SD `/vyvoz-musora/<sub>/<district>/` все на одинаковом pattern.

**Митигация:**
- 50%/50% rule strictly enforced через linter (sa-seo recommendation: `pnpm tsx scripts/check-50-50-rule.ts` валидирует unique-content threshold ≥300 words на каждый SD)
- Programmatic seed reject (не публикует) если 50/50 rule не соблюдается
- District-specific блок enforce: время выезда + landmark + кейс + ≥2 localFaq уникальные на каждый SD (не cookie-cutter)
- TOV-checker exit 0 на shared scripts + 20% sampling district-specific
- W11 mid-benchmark проверяет: если индексация Я.ВебМастер «Структурированные данные» 0 ошибок и нет drop в Topvisor (или Я.ВебМастер baseline) — шаблон работает; если drop ≥20% позиций по pilot Stage 1 ключам → Stage 3 пересматривается под revise programmatic

**Tripwire:** если на W11 Track E фиксирует drop pilot позиций ≥20% — operator получает alert + recommendation pause Stage 3 до investigation.

### R2 — cw bottleneck на 75 000 слов за 4 нед (P=0.7, **HIGH**)

**Описание:** 1 cw роль; 5 sequential runs; ~57 текстов (33 sub + 10 B2B + 8 cases + 6 extras + 10 blog M2) + Run 5 programmatic shared-content; 100% review pillar/B2B/cases (~34 текста full review) + 20% sampling SD/sub (~23 sampling). Объём ×2 vs US-1.

**Митигация:**
- TOV-checker pre-filter: cw читает только то, что прошло TOV-check (regex + LLM cascade); экономит ~30% времени
- LLM-augmented writing с prompt caching (skill `claude-api` iron rule sustained US-1): brief → черновик за 5-10 мин; ускорение ×3-5
- Sequential 5 runs vs parallel — но Run 2-4 на W11 параллелизация (B2B + Cases + extras + blog) — это критическая неделя bottleneck
- 20% sampling SD/sub: 33 sub × 20% = ~6 full review (1 в каждом pillar group); programmatic shared-content cw 1 sample = ~2 cw full review
- Run 5 — production-mode не «писать», а **писать шаблон** (24 sub base scripts + 4 district modifiers); меньше cognitive load чем 100 уникальных текстов
- Если cw bottleneck на W11 W1 — poseo эскалирует через cpo, рассматривает hire 2-го cw (out-of-scope US-2; отложено US-3 если patrtern повторяется)

**Tripwire:** если на W10 W1 cw сообщает «не успеваю Run 5 + W11 параллель» → poseo приоритизирует: Run 2 (B2B) > Run 3 (Cases) > Run 5 (programmatic shared) > Run 4 (extras + blog). Programmatic SD cap снижается на 50% (с ~100 до ~50) если необходимо.

### R3 — 8 Cases без real photos (P=0.5, **MEDIUM-HIGH**)

**Описание:** Cases pack требует real before/after photos для E-E-A-T credibility. Operator не передал real photos к Stage 2 (sustained US-1 policy «дадим позже»). Fallback fal.ai illustrative — может выглядеть «AI-generated», что снижает credibility и потенциально trust-сигнал поисковиков.

**Митигация:**
- fal.ai illustrative с **явным TODO «replace на real photo»** в admin notes Cases collection
- 8 cases — 16 photos (before + after × 8); fal.ai генерация cohesive style через `casesPrompt` (если не существует — art W7 baseline для cases; новый prompt в `site/lib/fal/prompts.ts`)
- Real photo replacement — backlog operator до US-3 / US-4
- mini-case binding на SD не страдает: relationship binding работает с placeholder photos (publish-gate проходит)
- W11 mid-benchmark не блокируется fal.ai photos: schema (ImageObject) + alt text работают

**Decision needed (см. §10 #1):** poseo apruv fal.ai illustrative ОК или критичный блокер? Sa-seo recommendation: **OK с явным TODO + backlog real-replace в US-3/US-4**.

### R4 — art apruv ~73 visuals может потребовать re-runs (P=0.4, **MEDIUM**)

**Описание:** art apruv 33 sub-services hero (1 batch) + 40 B2B+cases+extras visuals (1 batch) = 2 events × ~36-37 visuals каждое. Если первый batch не cohesive (style inconsistent across 33 sub) — re-run +1 неделя задержки.

**Митигация:**
- Pre-apruv: art W7 baseline стиля sustained от US-1 (~50 hero batches W4-W6 closed); cohesive look establish
- Batch chunking: 33 sub-services делится на 4 pillar groups (vyvoz-musora 9 + arboristika 12 + chistka-krysh 6 + demontazh 6); каждый pillar group apruv'ится отдельно — снижает риск «весь batch reject»
- Reusable prompts: `heroPrompt` + `subServicePromptVariant` (extension от Stage 1) с pillar context — cohesive style guaranteed
- Если first batch reject — poseo escalates через cpo; retry within 3 days
- Worst case: cms публикует с placeholder hero (TODO replacement); art apruv до W11 gate

**Tripwire:** если W8 W2 art не apruv'ил sub-services hero за 2 рабочих дня → poseo делает batch chunking (apruv по pillar group, а не all-or-nothing).

### R5 — Operator real data (Authors / cases / SRO) не дойдут к W11 (P=0.5, **MEDIUM**)

**Описание:** Authors operator real names + VK/TG sameAs + СРО номера + ИНН/ОГРН + real cases data + real photos — sustained policy от US-1 «дадим позже». Если к W11 не передано — placeholder с TODO остаётся; operator W11 gate apruv сложнее (visual review с placeholder сложнее чем с real data).

**Митигация:**
- Sustained US-0/US-1 policy: placeholder с явным TODO в admin notes
- cms swap placeholder → real в один проход через `seed:content:stage2-real-data` (ad-hoc script) когда оператор передаст
- B2B-author оператор — сильнее в Stage 2 чем в Stage 1: 10 B2B-страниц + 4 segment cases ссылаются на operator-author; replace до W11 mid-check желательно
- TOV-checker не блокируется placeholder names (text-content идентичен)
- Worst case: operator W11 gate apruv с placeholder + явный backlog «replace до Stage 3 W12»

## 9 · Definition of Done

- [ ] Все 13 групп AC закрыты (50+ пунктов)
- [ ] Hand-off log заполнен (см. §11)
- [ ] ~210 URL apruv'нуты оператором (AC-13.4)
- [ ] Track A / B / C / D / E закрыты, deliverables в репозитории / в Payload
- [ ] PR'ы Track A (~57 текстов как seed-content + JSON drafts; Run 5 programmatic scripts) merge'нуты в `main` через `do` (CI green: type-check + lint + format:check + test:e2e --project=chromium)
- [ ] PR'ы Track B (~73 hero/cover via fal.ai в `site/public/images/stage2/` + Payload Media) merge'нуты
- [ ] PR'ы Track C (lint:schema strict mode active + sitemap расширение + slug bug fix odincovo) merge'нуты
- [ ] PR'ы Track D (`seed:content:stage2` + `seed:programmatic:stage2` scripts + Authors finalize + Cases binding) merge'нуты
- [ ] PR'ы Track E (benchmark-W11-mid + differentiation-matrix v3 + Playwright reports) merge'нуты
- [ ] `screen/stage2-W11/` папка готова: ~100 PNG screenshots + 50 axe reports + cr-pathways report + lint-schema report + benchmark-W11-mid + ya-vebmaster-W11
- [ ] benchmark-W11-mid.md + differentiation-matrix.md v3 опубликованы; W11 winning angles confirmed inline
- [ ] Topvisor (если creds доступны) + Я.ВебМастер W11 baseline зафиксированы
- [ ] `pnpm lint:schema` exit 0 на ~210 URL (strict mode active)
- [ ] `pnpm tov-check` exit 0 на содержимом ~57 текстов + shared/specific scripts
- [ ] `pnpm generate:types` без ошибок (если new fields добавлены — например, programmatic-modifier blocks)
- [ ] Передача в US-3 готова: `specs/EPIC-SEO-CONTENT-FILL/US-3-priority-b-districts/` создана, sa-seo пишет US-3 sa-spec
- [ ] Phase: gate → done (poseo обновляет frontmatter этого sa-spec)

## 10 · Открытые вопросы для poseo (минимизировано)

> Большинство вопросов решено precedent US-0/US-1 (sustained policies). Минимизирую — 4 пункта требуют решения poseo до старта tracks; остальные — авто-решения.

1. **Cases без real photos — fal.ai illustrative ОК или критичный блокер?** Sa-seo recommendation: **OK с явным TODO «replace на real photo» в admin notes + backlog real-replace в US-3/US-4 W12-W14**. Альтернатива: блокер publish 8 Cases pack до operator передаст real photos — это блокирует mini-case binding на SD (AC-2.4 + AC-4.3) → блокирует ~100 SD publish-gate. Confirm от poseo: OK fal.ai illustrative? (Worst case без real photos: Cases pack публикуется к W11, real photo replacement в backlog operator.)

2. **Programmatic SD scope — 96 / 100 / 150?** Intake §«Programmatic SD ~150» гласит 96 + 32 avtovyshka + 22 supplementary = ~150. Sa-seo пересчёт: 96 core + 4 avtovyshka × priority-A = ~100 SD (default). Maximalist: + 8 sub × Wave 1.5 districts (Химки/Пушкино/Истра/Жуковский) = +60 SD = 160 total (но Wave 1.5 districts — Stage 3 US-3 scope!). Sa-seo recommendation: **Stage 2 = 100 SD на priority-A только** (avtovyshka × Wave 1.5 districts → US-3 Stage 3); maximalist 150 = Stage 2 захватывает Wave 1.5 (что Stage 3 переписывает). Confirm от poseo: 100 (default) ИЛИ 150 (operator стрим maximalist)?

3. **Programmatic SD shared-content scripts — отдельный Run cw или batch-template?** Run 5 (W10) — cw пишет 24 sub shared-content + 4 district-specific blocks. Sa-seo recommendation: **отдельный Run 5 sequential** — cw пишет шаблоны (не «уникальный текст × 100»), потом cms генерирует SD через `seed:programmatic:stage2`. Альтернатива: cw пишет «псевдо-SD» с custom для каждого района (не 50/50 batch-template). Confirm от poseo: Run 5 sequential ОК?

4. **Blog M2 темы — #11-#20 или #12-#21?** intake.md гласит «темы #11-#20 из темника». Sa-seo correction: blog #11 «Смета за 10 минут» уже включена в Stage 1 cornerstone M1 (US-1 §3.4). Stage 2 M2 = **#12-#21** (10 статей: 12-21 включительно). Sa-seo recommendation: **темы #12-#21**. Confirm от poseo: correction OK?

**Auto-resolved (precedent US-0/US-1):**
- ✅ TOV-checker exit 0 + cw 100% review pillar/B2B/cases + 20% sampling SD/sub — sustained iron rule
- ✅ axe-core severity threshold = `minor` блокирует gate; legacy SiteChrome contrast — backlog
- ✅ skill `claude-api` prompt caching обязательно — sustained iron rule
- ✅ design-system §1-14 + §33 site-chrome compliance — operator reminder sustained
- ✅ B2B-author оператор — placeholder с TODO до real data (sustained US-0/US-1)
- ✅ Topvisor / Keys.so creds fallback methodology — sustained US-1
- ✅ schema 100% Service+FAQPage+BreadcrumbList min — sustained US-1
- ✅ publish-gate 1 hero + 1 text-300+ + 1 contact + mini-case + ≥2 localFaq — sustained US-1
- ✅ AnchorAuthor cross-domain VK/TG sameAs — placeholder продолжается
- ✅ Real images replacement — backlog
- ✅ Calculator placeholder остаётся; реальная логика — отдельная US с pa-site (backlog)
- ✅ 3 missing static routes — backlog separate US
- ✅ payload migrate workflow — sustained
- ✅ TG bot / Я.Метрика на staging — отключены (sustained US-0)
- ✅ basic-auth для staging — do генерирует
- ✅ Storybook без CI Chromatic — sustained policy

## 11 · Hand-off log

- `2026-05-02 14:00 · poseo → sa-seo: написать sa-spec для US-2 (Stage 2 W8-W11); operator autonomous mandate sustained from US-1; design-system reminder; скоп ~57 текстов / ~50 hero / ~210 URL; цель «лиды + обгон» sustained; skills [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system].`
- `2026-05-02 HH:MM · sa-seo → poseo: sa-spec готов для review; активированы skills [seo, architecture-decision-records, api-design, product-capability, blueprint, accessibility, design-system]; spec покрывает 13 AC групп (50+ пунктов), 5 tracks + Run 5 sequential для programmatic, hard gate на operator apruv W11 для ~210 URL; design-system §1-14 + §33 site-chrome compliance — отдельная AC-12 группа per operator reminder sustained; 4 открытых вопроса для poseo (минимизировано — большинство закрыто precedent US-0/US-1); ждёт apruv poseo для phase: spec → planning. ADR-кандидаты identified для tamd post-US-2: 50/50 linter rule + programmatic SD seed pattern + cw editorial 5-run sequence.`

---

**ADR-кандидаты (из US-2, фиксируются `tamd` после tracks):**
- ADR-XXXX: 50/50 linter rule валидация для programmatic SD (pre-publish gate, расширение от US-0/US-1 publish-gate)
- ADR-XXXX: programmatic SD seed-template pattern (shared-content scripts × district-modifier blocks), anti Scaled Content Abuse методология
- ADR-XXXX: cw editorial 5-run sequence для масштабирования контент-производства (sequential vs parallel decision matrix)

Эти ADR пишет `tamd` (cross-team consult) ПОСЛЕ закрытия US-2, на основании реализации.

---

## 12 · Решения poseo по открытым вопросам (pending)

> Sa-seo передал sa-spec poseo. Раздел заполнится после poseo review (apruv ИЛИ корректировки) и закрытия 4 открытых вопросов §10.

> Phase transition: sa-spec apruv от `poseo` → `phase: planning` для всех 5 tracks → `phase: dev` после W8 W1 start.
