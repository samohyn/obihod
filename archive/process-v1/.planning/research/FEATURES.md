# Feature Research — Overtake-3 (arboristik.ru + arborist.su + liwood.ru)

**Domain:** Лидогенерационный сайт комплексного подрядчика «порядок под ключ» — 5 pillar (арбо + снег + мусор + демонтаж + ландшафт), B2C + B2B (УК/ТСЖ/FM), Москва и МО
**Researched:** 2026-05-15
**Confidence:** HIGH (3 конкурента живо проверены WebFetch 2026-05-15; existing US/OVT прочитаны из team/backlog.md и contex/*)
**Источник:** liwood-vs-obikhod-2026-05-W.md (8 осей verdict) + WebFetch arboristik.ru/arborist.su 2026-05-15 + contex/01_competitor_research.md + 02_growth_gtm_plan.md + 03_brand_naming.md
**Sustained baseline:** 174 URL в prod, JSON-LD 100%, photo→quote AI, RUM, US-11 E-E-A-T, T2 master-template v2.3 — НЕ ре-исследуем

---

## Контекст исследования

**Цель милестона Overtake-3:** обогнать одновременно liwood.ru (10-летний vintage authority + 169 URL), arboristik.ru (единственный по комплексности 4-в-1 + 50+ гео + CPC 100-350₽) и arborist.su (нишевый арбо-спец с ETW сертификацией + 11 лет + 100+ госконтрактов).

**Ось каждой feature** размечена по 8 осям бенчмарка: URL/IA · Content · On-page · Schema · E-E-A-T · CRO · CWV · B2B/local.

**Verdict-режим:** для каждой feature указано `covered-by` (existing US/OVT/EPIC) — если есть, feature НЕ дублируется; если нет — это новая зона.

---

## Что у конкурентов СИЛЬНО (раздел 1 — arboristik.ru как комплексный 4-в-1)

| Feature | Сила | Что у нас |
|---|---|---|
| **50+ гео-страниц МО** в навигации (Люберцы, Балашиха, Пушкино, Щёлково, Раменское, Троицк, Одинцово, Истра, ...) | Программная глубина — арбо × ~50 населённых пунктов | sustained 211 SD × 5 pillar, есть параллель; arboristik покрывает только под арбо |
| **Дистанционная оценка по фото через WhatsApp/Telegram** (на трёх номерах) | Снимает основное возражение «непонятно сколько» | sustained photo→quote AI (Claude API) — мы УЖЕ лучше: AI vs ручная оценка |
| **4 ниши на одном сайте** (удаление + обрезка + пни + снег + расчистка + вывоз + демонтаж строений) | Единый подрядчик 4-в-1 — реальный USP в нише | sustained 5 pillar |
| **Прайс таблицей по диаметру ствола** (до 20см / 40см / 60см / 80см / 80+см × методы) | Конкретика и трансперентность | LAG — у нас sustained `/uslugi/tseny/`, но не таблицей по Ø+метод |
| **Видео работ + 3 кейса (фото)** | Доверительные знаки | LAG — sustained MiniCase, **0 видео-кейсов** (covered-by OVT-5 later) |
| **Профи 1996-2000 года, призёр соревнований 2006-2009** | Personal expertise narrative (E-E-A-T) | PARITY — sustained 4 автора с Person Schema, но без storytelling «с какого года» |
| **Минимальный заказ 10 000₽ в МКАД + опт скидка от 10 деревьев** | Прозрачные условия для крупных заказов | LAG — у нас sustained tseny, но нет opt-discount tier |
| **44-ФЗ через портал поставщиков** | B2B-trail для госзаказа | LAG (covered-by OVT-2 6 PDF лендингов) |

## Что у конкурентов СИЛЬНО (раздел 2 — arborist.su как нишевый арбо-спец)

| Feature | Сила | Что у нас |
|---|---|---|
| **European Tree Worker (ETW) сертификация** + дипломы МГУ/РГАУ-Тимирязева ландшафтному дизайну | Highest-tier E-E-A-T в нише — нишевая экспертная отстройка | LAG — у нас RU-сертификаты (Person Schema + reviewedBy), но не международные, не ETW |
| **«100+ госконтрактов через портал поставщиков»** + раздел «Документы, законы» | B2B-trail для УК + госзаказ — социальное доказательство объёмом | LAG (covered-by OVT-2) |
| **«Профессиональный уход за деревьями с 2011 года, 11 лет на рынке»** | Vintage authority narrative — критично в high-trust нише | LAG — у нас нет vintage (`chrome.about.foundedYear` есть, но не подаётся narrative-блоком) |
| **5 социальных каналов** (VK, Instagram, YouTube, Дзен, Telegram) + WhatsApp | Распределённое доверие, видео-контент на YT, Дзен-блог = SEO бонус | LAG — у нас TG/MAX/Wazzup, но нет YT/VK/Дзен |
| **Раздел «Реквизиты» с ИНН/ОГРН/ИП + фото офиса на Каширке** | Юридическая прозрачность B2B | sustained `chrome.legal` + LocalBusiness Schema; на UI наполнение pending |
| **Раздел «Дипломы»** с фото-каталогом сертификатов | Trust signal сверх стандарта | LAG — covered-by US-11 + OVT-MKT (sustained `/sro-licenzii/`, но наполнение слабее) |
| **«Лицензии на верхолазные работы по Приказу 782н»** упомянуты в hero | Профессиональный регуляторный язык — резонирует с УК | LAG — у нас sustained `LicenseBadge` block, но 782н не выводим явно |
| **«Гарантия качества с полной ответственностью» + блок акций со скидками 10-20%** | Conversion uplift + reduced risk perception | PARITY |

## Что у конкурентов СИЛЬНО (раздел 3 — liwood.ru как зрелый зонтик)

Источник: `seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` — sustained verdict, не ре-исследуем. Перечисляем только новые features за рамками OVT-1..7 / US-2..11.

| Feature | Сила | Что у нас |
|---|---|---|
| **LSI-блоки «10 причин обратиться» + «сам vs специалист»** на T2 udalenie-derevev (3500 слов) | Закрывает 80% возражений за один скролл | LAG — sustained C2 master-template, но LSI-блоки **не дописаны** в content brief |
| **8 преимуществ-иконок** в hero (СРО / гарантия / опыт 25 лет / своя техника) | Plug-and-play trust badges row | PARITY — sustained `LicenseBadge` block, но визуально 4 badge vs 8 у liwood |
| **48 city-links на T2** + 11 sub-карточек = ~60 internal links | Линковая плотность для SEO + UX | LAG — у нас sustained NeighborDistricts 4-6 + sub-grid; covered-by master-template B5 |
| **Vintage authority 10+ лет** + 8 B2B клиентов на `/company/` | Доверие через возраст домена + социальное доказательство | LAG — у нас 2024 запуск, единственный rescue — narrative `chrome.about.foundedYear` + ClientLogos наполнение |

---

## Feature Landscape

### Table Stakes (Users Expect These)

Минимум, без которого комплексный подрядчик в Москве 2026 не воспринимается всерьёз ни B2C, ни B2B.

| Feature | Why Expected | Complexity | Ось | covered-by | Notes |
|---------|--------------|------------|-----|------------|-------|
| **СРО номер + PDF выписка на странице** | B2B (УК/ТСЖ/застройщики) фильтрует подрядчиков по СРО на старте; без СРО — отказ в тендере | LOW | E-E-A-T + B2B | US-11 + OVT-2 | sustained `/sro-licenzii/`, но 4 СРО клик-zoom pending |
| **Лицензия Росприроднадзора (ТКО/КГМ IV класс) + PDF** | Без неё не получить договор с регоператором ТКО | LOW | E-E-A-T + B2B | US-11 + OVT-2 | pending — наполнение `/sro-licenzii/` контентом |
| **Страховка ГО ≥10 млн ₽ — полис на сайте** | УК БЦ/ТЦ и элитные КП требуют 10-15 млн как входной билет | LOW | E-E-A-T + B2B | OVT-2 | spec из contex/01 §5 |
| **Допуски Минтруда №782н (3 группы по высоте)** | Без них — расторжение B2B-контракта после первой проверки | LOW | E-E-A-T + B2B | OVT-2 | arboristik упоминает явно в hero — копировать паттерн |
| **Порубочный билет — оформление за наш счёт** | Все 3 конкурента имеют этот блок; без него — недоверие в москве (штраф 300k) | LOW | Content + CRO | covered-by content brief `/uslugi/spil-derevev/` | sustained pillar текст, **не выделено как USP** — fix в master-template C2 |
| **3 канала связи: телефон + WhatsApp + Telegram** | Базовый стандарт ниши — arboristik 4 телефона + 2 WA; arborist.su 5 соцсетей | LOW | CRO | sustained chrome.socials | расширить до VK + YouTube + Дзен (LAG arborist.su) |
| **Прайс таблицей** (Ø ствола × метод × цена) | arboristik имеет, liwood намёками; B2C-визитор хочет «сколько примерно для моего дерева» | MEDIUM | Content + On-page | covered-by C2 master-template + EPIC-SEO-USLUGI tseny | sustained — нужна прайс-матрица в master-template (sustained §08 mini-case extension) |
| **Минимальный заказ заявленный** (МКАД от X / 50+ км договорная) | B2C-визитор ожидает после liwood/arboristik | LOW | Content + CRO | covered-by `/uslugi/tseny/` | pending UI наполнение |
| **Реквизиты (ИНН/ОГРН/ИП-ООО)** видны в footer | Без них УК воспринимает как «шабашников» | LOW | E-E-A-T + B2B | sustained `chrome.legal` | заполнено (placeholder 1111111111 до регистрации ЮЛ — sustained learning) |
| **Отзывы клиентов с фото + дата + источник** | arborist.su показывает + arboristik 3 кейса; users assume есть | MEDIUM | E-E-A-T | US-9 + OVT-6 | sustained Reviews collection, ≥30 reviews наполнение pending |
| **Гарантия качества/опыт «с YYYY года»** в hero | arboristik 1996+2000, arborist.su 2011, liwood 25 лет | LOW | Content + E-E-A-T | `chrome.about.foundedYear` sustained | LAG — narrative `«с 2024 года»` слабее; mitigation — формулировка «команда с опытом X лет» |
| **JSON-LD на 100% страниц (Service+FAQ+BC+LocalBusiness)** | Не «expected» пользователем но **expected Яндексом/Гуглом 2026** — иначе rich snippets теряются | LOW | Schema | sustained ADR-0017 composer.ts | LEAD vs все 3 конкурента |
| **Мобайл-форм 1-click WhatsApp/TG из hero** | 60%+ B2C-трафика — mobile, sticky CTA expected | LOW | CRO + CWV | sustained brand-guide v2.3 | sustained sticky-bottom-CTA |
| **404-free навигация + breadcrumbs** | liwood имеет 5 живых 404 (slug-drift); users ожидают чистоту | LOW | On-page + UX | sustained ADR-0018 §SEO правила | LEAD |

### Differentiators (Competitive Advantage — то, чего нет у liwood/arboristik/arborist.su одновременно)

То, что превращает obikhod в первый выбор по 4 направлениям, а не «один из 3 комплексных».

| Feature | Value Proposition | Complexity | Ось | covered-by | Notes |
|---------|-------------------|------------|-----|------------|-------|
| **Photo→Quote через Claude API за 10 мин** (sustained live) | Никто из 17 конкурентов не делает; даже arboristik = ручная оценка по фото в WhatsApp | HIGH (sustained) | CRO + USP | US-8 + OVT-MKT | sustained 2026-05-03; threshold для re-classify: любой конкурент launches similar |
| **B2B-абонентка «зима-лето» с юр. ответственностью за штрафы ГЖИ/ОАТИ** | alpbond.org single player в нише; никто из 3 наших конкурентов не предлагает | HIGH | B2B + CRO | NEW — propose как OVT-8 | flagship оффер по contex/02 §3 + §6; required: тарифы (Базовый 45k / Стандарт 120k / Premium 220-450k) + страховой полис ГО 15 млн |
| **6 нормативных PDF-лендингов** `/b2b/<porubochnyi-bilet, lesnaya-deklaratsiya, akt-obsledovaniya, sro-vypiska, fkko-klassifikatsiya, fitosanitarnyi>/` | B2B нужны не услуги, а **документы**; arboristik/arborist.su/liwood ни у кого нет | MEDIUM | B2B + Content + Schema | OVT-2 | sustained route `/b2b/<doc>/` — pending наполнение |
| **«Штрафы ГЖИ/ОАТИ берём на себя по договору»** в B2B hero + договор-шаблон в PDF | Только alpbond играет; наши 3 конкурента не предлагают вообще | LOW (после OVT-2) | B2B + CRO | NEW — propose как OVT-9 | flagship месседж по contex/02 §3 + persona 4 |
| **Видео-кейсы 60-120s на YouTube/Rutube с VideoObject schema** | liwood/arboristik = 0; arborist.su есть YT но без embed на pillar | HIGH | Content + E-E-A-T + Schema | OVT-5 (later) | sustained EPIC-HOMEPAGE-V2 US-17 photo production prerequisite |
| **Я.Карты embed на топ-10 SD + LocalBusiness AggregateRating + Я.Бизнес owner verified** | Все 3 конкурента — text-only NAP, без map embed, без verified Я.Бизнес | MEDIUM | B2B/local + Schema + E-E-A-T | OVT-4 | sustained route; operator action Я.Бизнес setup |
| **RUM (Real User Monitoring) с p75 LCP/CLS/INP threshold-alert** | Никто из 3 не имеет; даёт sustainable CWV-преимущество | MEDIUM (sustained) | CWV/tech | OVT-3 (sustained) | sustained 2026-05-09; LEAD на оси 7 |
| **«Снег выпал — бригада свободна сегодня» dynamic creative** (Я.Погода API + автокоррекция креатива в Директе) | Технически легко, никто не делает (contex/01 gap #7) | MEDIUM | CRO + B2B | NEW — propose как OVT-10 marketing-tech | contex/02 §5.1 §6; +35% CR на аварийных ключах |
| **Authors collection с reviewedBy + lastReviewedAt + Person Schema** sustained (4 RU авторов) | liwood = 0 (80-90 статей без author); arboristik = personal narrative без Schema; arborist.su = ETW сертификат, но без Schema | LOW (sustained) | E-E-A-T + Schema | US-11 | LEAD vs все 3 |
| **«Зимняя абонентка» landing с auto-scheduler по сезонности** | Никто; даже liwood-зонтик не имеет абонемента | HIGH | B2B + CRO | NEW — propose как OVT-11 (later) | sustained `/abonement-zima/` route potential; sustained Telegram bot reminder |
| **Я.Дзен / VK + YouTube — кросс-постинг кейсов** | arborist.su имеет 5 каналов, arboristik 0; первый кто построит — выиграет distribution | MEDIUM | E-E-A-T + Content | NEW — propose как OVT-MKT extension | content/<post-id>.md + cross-post через skill `crosspost` |
| **AggregateRating live из Reviews + ≥30 reviews с фото + дата** | Все 3 — text-only без star + без Schema = 0 rich snippets | LOW | Schema + E-E-A-T + CRO | OVT-6 (later) | sustained Reviews collection; наполнение pending |
| **«4-в-1 + ландшафт = 5-в-1 под ключ» зонтичная подача** | arboristik 4-в-1 без брендинга, liwood без ландшафта (промальп вместо), arborist.su 1-в-1 | LOW (sustained) | Brand + Content | sustained ADR-0020 5 pillar | unique positioning — narrative в hero |

### Anti-Features (Commonly Requested, Often Problematic — НЕ копировать)

Что arboristik/arborist.su/liwood делает, но **нам делать не надо** — либо подрывает позиционирование «Caregiver+Ruler», либо демпинг-ловушка, либо обесценивает бренд.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **«от 1000 ₽» / «от 480 ₽» в hero** (arboristik делает) | Кажется ловит дешёвых лидов через Директ | (1) Демпинг-трафик с низкой маржой; (2) обесценивает бренд «Порядок под ключ»; (3) anti-TOV (sustained `brand-guide v2.3 §13-14 anti-words guard`); (4) подрывает B2B-восприятие (УК отвергает «дешёвых»); contex/01 §6 anti-pattern | sustained: **«фикс-цена за объект»** + «смета по фото в WA за 10 мин» |
| **3 копии lead-формы на T2 + sticky-header** (liwood делает) | Кажется максимизирует CR | (1) UI clutter; (2) визуальная агрессия противоречит Caregiver-архетипу; (3) sticky header 88px перекрывает hero на iPhone SE | sustained: **1 lead-form внизу + CTA inline + photo→quote entry в hero** |
| **«25 лет на рынке» когда фактически 2024 запуск** | Кажется vintage authority боост | (1) Юридический риск ФЗ-38 о рекламе; (2) первая же claim-проверка УК откроет ложь; (3) разрушит trust навсегда | sustained: **«команда с опытом N+ лет»** (про команду, не про юрлицо) + foundedYear honest |
| **8 преимуществ-иконок** (liwood делает) | Кажется trust signal | (1) Visual overload, mobile невозможно прочитать; (2) пользователи не читают >4 badge; (3) anti-brand-guide (sustained ≥56 padding, 4 badge max) | sustained: **4 ключевых badge** (СРО / страховка 10 млн / порубочный билет за наш счёт / гарантия фикс-цены) |
| **Латиница в имени бренда** (Liwood, Alpbond, Kronotech) | Кажется premium-восприятие | (1) Антитренд после 2022 в РФ; (2) фильтр-импорт у B2B (УК/госзаказ); (3) формы ГИС ЖКХ не принимают латиницу; contex/03 §Naming approach | sustained: **«ОБИХОД»** кириллица (immutable) |
| **«0 ₽» / «бесплатно» / «акция -50%»** (arborist.su делает периодически) | Кажется conversion uplift | (1) Anti-TOV «не обесцениваем»; (2) подрывает фикс-цена позиционирование; (3) демпинг-эффект на UK | sustained: **«опт-скидка от 5 деревьев / абонемент = -15% от разовых цен»** (объёмная, не sale) |
| **«Под ключ от 25 000 ₽» с тонким шрифтом» disclaimers** (snos24 делает) | Кажется ловит лиды на низкий тикет | (1) Anti-pattern contex/01 §6; (2) после реальной сметы клиент разочарован; (3) высокие refund-риски | sustained: **«фикс-цена после фото в WA за 10 мин»** — конкретное число, не «от» |
| **«Услуги населению»** в копии (стандарт у Bitrix-сайтов) | Кажется официально | (1) Anti-TOV (sustained brand-guide §13); (2) дистанцирует Caregiver-архетип; (3) звучит как мунcп. учреждение | sustained: **«работаем для собственников домов и УК»** |
| **44 телефона / 5 WhatsApp / 12 номеров** (arboristik имеет 4 + 2) | Кажется покрытие любого канала | (1) Decision paralysis у клиента; (2) визуальный clutter; (3) сложность атрибуции CR | sustained: **1 phone + WA + TG + MAX** (по brand-guide §33 chrome) |
| **Generic stock-photos из Shutterstock** | Кажется бюджетно | (1) Anti-brand-guide §photography; (2) убивает аутентичность; (3) клиент чувствует «как у всех» | sustained: **fal.ai Nano Banana Pro иконки + реальные репортажные фото с объектов** (sustained EPIC-HOMEPAGE-V2 US-17) |
| **Калькулятор без реального расчёта — только заявка** (liwood multi-step → lead form) | Кажется UX-улучшение | (1) Bait-and-switch разрушает trust; (2) photo→quote AI наша USP, статичный калькулятор обесценивает | sustained: **photo→quote AI real Claude API** vs lead-form-only |
| **Бренд-домен на десятке доменов разных направлений** (liwood: `/services/promalpinizm/`, `/services/landshaft/` separate sub-brands) | Кажется фокус на нише | (1) Распыляет авторитет SEO; (2) anti-architecture (sustained Branded House по contex/03 §Brand architecture) | sustained: **единый зонтик `obikhod.ru` + категории**, sub-bren `Обиход.Объект` позже после 100 млн ARR |

---

## Feature Dependencies

```
[OVT-4 Я.Карты embed + Я.Бизнес owner] ──requires──> [operator action Я.Бизнес setup]
                                       ──enhances──> [B2B-trail content fill OVT-2]

[OVT-2 B2B-trail 6 PDF лендингов] ──requires──> [legal review шаблонов договоров]
                                  ──enhances──> [NEW OVT-9 «Штрафы ГЖИ берём на себя»]
                                  ──enhances──> [NEW OVT-8 B2B-абонентка]

[NEW OVT-8 B2B-абонентка тарифы] ──requires──> [страховка ГО 15 млн (cf. contex/01 §5)]
                                  ──requires──> [OVT-2 6 PDF лендингов (договор-шаблон)]
                                  ──requires──> [/abonement-zima/ landing brief]

[NEW OVT-10 «Снег выпал» dynamic creative] ──requires──> [Я.Директ API connector]
                                            ──requires──> [Я.Погода API key]
                                            ──enhances──> [OVT-MKT marketing-angle assets]

[OVT-5 Video case studies] ──requires──> [EPIC-HOMEPAGE-V2 US-17 photo production (operator)]
                           ──requires──> [YouTube/Rutube channel setup]
                           ──enhances──> [E-E-A-T LEAD axis]

[OVT-1 SD extension 154→250] ──requires──> [EPIC-SHOP-REMOVAL.W1 + ADR-0020 closure]
                              ──requires──> [landshaft pillar T2 master-template (sustained C2)]

[OVT-MKT marketing-angle assets] ──requires──> [5 LEAD axes confirmed sustained]
                                  ──requires──> [Schema PR-story + photo→quote landing]
                                  ──enhances──> [SEO-USLUGI ROI per URL]

[NEW OVT-11 «Зимняя абонентка» landing] ──requires──> [OVT-8 тарифы]
                                         ──requires──> [Telegram bot reminders (sustained)]

[NEW LSI-блоки content brief «10 причин» + «сам vs специалист»] ──requires──> [C2 master-template (sustained)]
                                                                ──enhances──> [Content depth ось 2 — closes lag |
                                                                                vs liwood 3500 слов]

[NEW «Лицензии 782н» в hero + PDF zoom] ──requires──> [legal review actual допуски Минтруда]
                                         ──enhances──> [B2B persona 6 FM-операторы acceptance]
```

### Dependency Notes

- **OVT-8 B2B-абонентка requires OVT-2 PDF lendings:** без договор-шаблона невозможно подписать первого УК-клиента; страховой полис ГО 15 млн — single источник риска (250k₽/год, contex/02 §3 + §13)
- **OVT-9 «Штрафы ГЖИ» enhances OVT-8:** это маркетинговая надстройка на тарифы — без тарифов оффер пустой
- **OVT-5 Video requires US-17:** sustained EPIC-HOMEPAGE-V2 dependency — реальные кадры с объектов; fal.ai не подходит (anti-brand-guide stock-photos rule)
- **OVT-10 «Снег выпал» enhances OVT-MKT:** marketing-angle assets усиливаются динамическим креативом — но независимы (можно ship MKT без 10)
- **LSI-блоки enhance content axis:** sustained C2 master-template — content-blocks (covered-by EPIC-SERVICE-PAGES-UX C2 §reasons-list + comparison-table)

---

## MVP Definition

**Контекст:** «MVP» здесь = milestone Overtake-3 в окне 8-12 нед поверх sustained 174 URL + 9 OVT-* в backlog.

### Launch With (v1.0 Overtake-3 — must-ship для милестона)

Минимум для одновременного обгона 3 конкурентов по 4 направлениям. Все Table Stakes уже sustained — ниже только новые/расширения.

- [ ] **OVT-4 Я.Карты embed + Я.Бизнес owner verified** — закрывает LAG ось 8 (B2B/local) + добавляет AggregateRating LEAD
- [ ] **OVT-2 B2B-trail 6 PDF лендингов** — устраняет deal-breaker для УК/госзаказа (СРО/Росприроднадзор/порубочный билет/ФККО/фитосанитарный/выписка ЕГРЮЛ)
- [ ] **OVT-MONITOR 3X** — мониторинг 1→3 конкурентов sustained (sitemap counts + JSON-LD coverage + top-50 keys)
- [ ] **NEW LSI-блоки content brief** — «10 причин» + «сам vs специалист» в C2 master-template для закрытия content-depth lag vs liwood
- [ ] **NEW OVT-8 B2B-абонентка** — 3 тарифа (45k/120k/220-450k) + landing `/b2b/abonement/` + договор-шаблон PDF
- [ ] **NEW OVT-9 «Штрафы ГЖИ/ОАТИ берём на себя» messaging** — flagship hero на `/b2b/` + договор-шаблон § ответственность
- [ ] **NEW «Лицензии 782н + страховка ГО 10 млн» в hero на B2B-странице** — паттерн от arborist.su (профессиональный регуляторный язык)
- [ ] **OVT-3 RUM threshold alerts** (sustained) — confirm/downgrade verdict оси 7

### Add After Validation (v1.1)

После того как core overtake-3 закрыт и Bench подтверждает 7/8 LEAD axes vs все 3 конкурента.

- [ ] **OVT-1 SD extension 154→250** + landshaft pillar (после ADR-0020 + C2 закрытия)
- [ ] **OVT-MKT marketing-angle assets** — PR-история «100% Schema.org coverage» + sales deck v2 + Я.Дзен кросс-постинг
- [ ] **OVT-6 AggregateRating + ≥30 reviews с фото** — после operator setup Я.Бизнес + popanel Reviews UI
- [ ] **NEW «Прайс таблицей по Ø ствола × метод»** в `/uslugi/spil-derevev/` (паттерн arboristik)
- [ ] **NEW VK + YouTube + Дзен каналы** — паттерн arborist.su 5 каналов для distribution + E-E-A-T amplification

### Future Consideration (v1.2+)

- [ ] **OVT-5 Video case studies** — после EPIC-HOMEPAGE-V2 US-17 реальных кадров
- [ ] **NEW OVT-10 «Снег выпал — бригада свободна» dynamic creative** — после OVT-4 + Я.Директ API stable
- [ ] **NEW OVT-11 «Зимняя абонентка» landing с auto-scheduler** — после OVT-8 + Telegram bot reminders validated
- [ ] **NEW ETW сертификация / international diplomas** — long-term E-E-A-T для МКАД premium-сегмента
- [ ] **NEW «25 лет опыта команды» narrative** — после регистрации ЮЛ + 6+ мес наполнения case studies

---

## Feature Prioritization Matrix

| Feature | User Value | Impl Cost | Ось | covered-by | Priority |
|---------|------------|-----------|-----|------------|----------|
| OVT-4 Я.Карты + Я.Бизнес owner | HIGH (B2B trust + AggregateRating LEAD) | LOW (4 ЧД) | B2B + Schema + E-E-A-T | OVT-4 sustained | **P1** |
| OVT-MONITOR 3X (3 конкурентов) | HIGH (стратег. контроль обгона) | LOW (2 ЧД) | All axes | OVT-MONITOR sustained | **P1** |
| OVT-2 6 PDF лендингов | HIGH (B2B deal-breaker) | MEDIUM (6 ЧД) | B2B + Content + Schema | OVT-2 sustained | **P1** |
| NEW OVT-8 B2B-абонентка landing | HIGH (LTV-driver, flagship) | MEDIUM (5 ЧД) | B2B + CRO | NEW | **P1** |
| NEW OVT-9 «Штрафы ГЖИ» messaging | HIGH (persona 4 hook) | LOW (1 ЧД + legal review) | B2B + CRO | NEW | **P1** |
| NEW LSI-блоки content brief | MEDIUM (closes content-depth lag) | LOW (2 ЧД content) | Content | covered-by C2 | **P1** |
| OVT-3 RUM threshold alerts | MEDIUM (confirm LEAD ось 7) | LOW (sustained) | CWV | OVT-3 sustained | **P1** |
| NEW «Лицензии 782н + 10 млн» hero B2B | HIGH (persona 4-7 trust) | LOW (1 ЧД + design) | E-E-A-T + B2B | NEW | **P1** |
| OVT-1 SD extension 154→250 | HIGH (SEO objem +60%) | HIGH (12 ЧД) | URL/IA + Content | OVT-1 sustained | **P2** |
| OVT-MKT marketing-angle assets | MEDIUM (amplification) | MEDIUM (5 ЧД) | All LEAD axes | OVT-MKT sustained | **P2** |
| OVT-6 AggregateRating + ≥30 reviews | MEDIUM (CTR + E-E-A-T) | MEDIUM (4 ЧД) | Schema + E-E-A-T | OVT-6 sustained | **P2** |
| NEW Прайс таблицей по Ø ствола | MEDIUM (conversion uplift) | LOW (1 ЧД content) | Content + CRO | NEW | **P2** |
| NEW VK + YouTube + Дзен каналы | MEDIUM (distribution) | MEDIUM (3 ЧД setup) | E-E-A-T | NEW | **P2** |
| OVT-5 Video case studies | HIGH (E-E-A-T LEAD) | HIGH (10 ЧД + photo prereq) | E-E-A-T + Schema | OVT-5 sustained | **P3** |
| NEW OVT-10 «Снег выпал» creative | MEDIUM (CR +35%) | MEDIUM (3 ЧД) | CRO | NEW | **P3** |
| NEW OVT-11 «Зимняя абонентка» | HIGH (sezonn. сглаживание) | HIGH (8 ЧД) | B2B + CRO | NEW | **P3** |
| NEW ETW сертификация | LOW (premium-only) | HIGH (external + время) | E-E-A-T | NEW | **P3** |

**Priority key:**
- **P1** = Must для closing milestone Overtake-3 (8 нед окно) — 8 features, всего ~25 ЧД
- **P2** = Should после P1 confirmed — 5 features, ~25 ЧД
- **P3** = Future, после v1.0 Overtake-3 DoD — 4 features, ~25 ЧД

---

## Competitor Feature Analysis

Matrix per ось — где конкурент сильнее/слабее obikhod на 2026-05-15.

### Ось 1: URL/IA

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Pillars total | 17 | ~7 (4 услуги + расчистка + вывоз + демонтаж) | 11 | **5** (sustained ADR-0018) | Sustained 5 pillar глубже — не наращивать |
| Programmatic SD | 47 (1 pillar × city) | ~50 (1 pillar × city) | ~10 (Москва+МО без раскладки) | **211** sustained | **LEAD** — extend до 250 (OVT-1) |
| Mobile URL chains | flat | 4-уровневый | 3-уровневый | 3 sustained | Maintain |

### Ось 2: Content depth

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| LSI-блоки «10 причин» / «сам vs специалист» | **есть** на T2 (3500w) | partial | нет | **нет** | **P1** — добавить в C2 master-template |
| Прайс таблицей (Ø × метод) | partial | **есть** | partial | partial | **P2** — добавить в C2 + /uslugi/tseny/ |
| City-specific доля контента | 8-12% | 0% (одна страница на услугу) | n/a | **25-30%** sustained | **LEAD** — maintain |
| Vintage narrative «с YYYY года» | 25 лет | 1996-2000 личные | 2011 (11 лет) | foundedYear sustained | Mitigation — «опыт команды N лет» |

### Ось 3: On-page SEO

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Meta description coverage | 15% (2/13) | ~70% | ~80% | **100%** sustained | **LEAD** — maintain |
| Slug quality | 5 live 404 | clean | clean | clean | **LEAD** vs liwood |

### Ось 4: Schema / JSON-LD

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Service schema on T2/T3/T4 | 0% | 0% | 0% | **100%** sustained | **LEAD** — biggest moat |
| AggregateRating | 0% | 0% | 0% | sustained on T2 | **LEAD** + OVT-6 наполнение |
| FAQPage schema | 0% | 0% | 0% | sustained 100% | **LEAD** |
| VideoObject schema | 0 | 0 | партиально (без embed) | **нет** | **P3** — OVT-5 |

### Ось 5: E-E-A-T

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Authors с Person Schema | 0 | personal narrative без Schema | ETW сертификат без Schema | **4 RU** sustained | **LEAD** US-11 |
| ETW / international certs | 0 | 0 | **есть** (ETW + МГУ + РГАУ) | 0 | **P3** future consideration |
| Лицензии 782н в hero | partial | **есть** | partial | нет (есть в LicenseBadge) | **P1** — добавить в hero B2B |
| Vintage authority (домен) | 10+ лет | 25+ лет (1996-2000) | 11 лет | 2024 | Mitigation — «команда с опытом» |
| Соцсети distribution | partial | 2 (WA + email) | **5 каналов** | 3 (TG/MAX/Wazzup) | **P2** — добавить VK + YT + Дзен |

### Ось 6: CRO / lead-flow

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Photo→quote AI | нет | ручная оценка по фото в WA | нет | **AI Claude API** sustained | **LEAD** ⭐ — moat |
| Калькулятор реальной цены | multi-step → lead form (fake) | прайс-таблица + WA | нет | **AI real** | **LEAD** |
| Sticky-bottom mobile CTA | нет | partial | нет | sustained | **LEAD** |
| 1-click WhatsApp/TG в hero | partial | **есть** (3 номера) | **есть** | sustained | PARITY |

### Ось 7: CWV / tech

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| Tech stack | Bitrix 2018 | старый PHP / Wordpress | Bitrix 24 | **Next.js 16 RSC** | **LEAD** |
| RUM | нет | нет | нет | **sustained** | **LEAD** ⭐ moat |
| Mobile horizontal-scroll bug | **есть** на T2 (440px>375px) | нет | нет | нет sustained | **LEAD** vs liwood |

### Ось 8: B2B/local

| Feature | liwood.ru | arboristik.ru | arborist.su | obikhod current | Our approach |
|---------|-----------|---------------|-------------|-----------------|--------------|
| B2B-абонентка landing | нет | нет | нет | нет | **P1** NEW OVT-8 — first-mover |
| «Штрафы ГЖИ берём на себя» | нет | нет | нет | нет | **P1** NEW OVT-9 — first-mover |
| 6 PDF лендингов нормативки | нет | partial (44-ФЗ упоминание) | «Документы, законы» partial | sustained route | **P1** OVT-2 наполнение |
| Я.Карты embed | text-only | нет | partial | нет | **P1** OVT-4 |
| Я.Бизнес verified | unknown | unknown | unknown | unknown | **P1** OVT-4 + operator |
| 100+ B2B клиентов narrative | 8 клиентов на /company/ | partial (44-ФЗ упоминание) | **100+ госконтрактов** | sustained ClientLogos pending наполнение | **P2** OVT-MKT |
| СРО номер + PDF | partial | partial | **частично** | sustained `/sro-licenzii/` pending | **P1** OVT-2 |
| Страховка ГО ≥10 млн PDF | нет | нет | нет | нет | **P1** NEW (в OVT-2 scope) |

---

## Что НЕ ре-исследуем (sustained — DO NOT duplicate)

- ✓ Programmatic SD 211 URL по 5 pillar × ~40 districts (sustained EPIC-SEO-CONTENT-FILL deployed 2026-05-03)
- ✓ JSON-LD 100% coverage Service/FAQPage/LocalBusiness/BreadcrumbList/Article (sustained composer.ts §62-122)
- ✓ Photo→Quote через Claude API + prompt caching (sustained US-8 W15 launch)
- ✓ Calculator multi-step + LeadForm → Payload Leads → Telegram (sustained US-8)
- ✓ RUM `/api/rum` + Payload RumMetrics (sustained OVT-3)
- ✓ Weekly monitoring liwood watcher.ts (sustained OVT-MONITOR; **расширение до 3 конкурентов = MONITOR-3X-01** в .planning/PROJECT.md Active)
- ✓ 4 RU авторов с Person Schema + reviewedBy + lastReviewedAt (sustained US-11)
- ✓ T2 master-template v2.3 на 5 pillar (sustained EPIC-SERVICE-PAGES-REDESIGN D3/D5)
- ✓ Brand-guide v2.3 + Caregiver+Ruler TOV (immutable)
- ✓ ADR-0017 4-6 JSON-LD узлов (sustained)
- ✓ ADR-0018 URL-map (sustained)
- ✓ ADR-0020 5 pillar без магазина (sustained)
- ✓ ADR-0021 T2 master-template (sustained)

OVT-1..7 + US-2..11 — execution в `team/backlog.md`. Этот FEATURES.md не дублирует RICE, не предлагает их заново — только размечает **новое** (NEW OVT-8/9/10/11 + LSI-блоки + 4 enrichment features) и **table stakes / anti-features** для downstream синтезатора.

---

## Sources

- `/Users/a36/obikhod/.planning/PROJECT.md` (validated capabilities)
- `/Users/a36/obikhod/contex/01_competitor_research.md` (топ-30, payment модели, регуляторика B2B, gap-анализ)
- `/Users/a36/obikhod/contex/02_growth_gtm_plan.md` (persona 1-7, KPI tree, flagship оффер, B2B-абонентка тарифы)
- `/Users/a36/obikhod/contex/03_brand_naming.md` (TOV anti-words guard, Caregiver+Ruler, single-brand architecture)
- `/Users/a36/obikhod/seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md` (8 осей verdict — 5 LEAD / 1 PARITY / 2 LAG)
- `/Users/a36/obikhod/team/backlog.md` (existing OVT-1..7 + US-2..11 — covered-by check)
- WebFetch `https://arboristik.ru/` 2026-05-15 (hero / 4 ниши / 50+ гео / 1996-2000 narrative)
- WebFetch `https://arboristik.ru/tsenyi/` 2026-05-15 (прайс таблицей по Ø × метод, минимум 10k₽ МКАД, 44-ФЗ упоминание)
- WebFetch `https://arborist.su/` 2026-05-15 (ETW + МГУ + РГАУ дипломы, «100+ госконтрактов», 5 соцсетей, 2011 vintage)
- WebFetch `https://arborist.su/company/requisites/` 2026-05-15 (ИП Сидоров К.А., ИНН 773773397000, Каширка 65к2)
- WebFetch `https://arborist.su/company/licenses/` 2026-05-15 (международные семинары + ETW; нет СРО/Росприроднадзора в публичном выводе)

---
*Feature research for: лидогенерационный сайт комплексного «порядок под ключ» подрядчика 5 pillar × B2C+B2B Москва+МО*
*Researched: 2026-05-15*
