---
epic: EPIC-SEO-LANDSHAFT
title: SEO Discovery — услуга «Дизайн ландшафта»
team: seo
po: poseo
type: research
priority: P1
segment: services
phase: discovery
role: poseo
status: intake
blocks: [landshaft-landing-page, cw-landshaft-content, sa-podev-landshaft]
blocked_by: []
related: [US-11-ia-extension, EPIC-SEO-SHOP, brand-guide-landshaft-followup]
created: 2026-04-29
updated: 2026-04-29
skills_activated: [seo, product-capability, blueprint, market-research, search-first]
---

# EPIC-SEO-LANDSHAFT — SEO Discovery для услуги «Дизайн ландшафта»

**Автор intake:** poseo
**Дата:** 2026-04-29
**Источник:** запрос оператора + plan `team-seo-poseo-md-radiant-hartmanis.md` (approved 2026-04-29)
**Тип:** research / discovery
**Срочность:** P1 — ландшафт уже зафиксирован в US-11 IA Extension как flat-link, но meta/title/H1/контент пишутся вслепую без семантики
**Сегмент:** services (5-й pillar после 4 base + landshaft, 6-й оффер с shop)
**Связано с:** US-11 IA Extension (flat-link `/dizain-landshafta/` fixed), EPIC-SEO-SHOP (cross-link landshaft↔shop), follow-up `art` для `brand-guide-landshaft.html`

---

## Skill activation (iron rule)

`poseo` активирует на старте: **`seo`** (основной), **`product-capability`** (capability map для услуги landshaft), **`blueprint`** (5-недельный roadmap), **`market-research`** (liwood + landscape-студии Москвы), **`search-first`** (best practices service-page SEO + B2B-сегмент озеленения для застройщиков). Каждый агент команды на своём артефакте делает skill-check с фиксацией в Hand-off log.

---

## Исходный запрос оператора (2026-04-29)

> мне почему то кажется что нам нужно провести ресерч для питомника растений и дизайна ландшафта? какое ядро, структура итд

**Решения оператора в plan-mode (2026-04-29):**
- Discovery параллельно с EPIC-SEO-SHOP
- Глубина — full research (252-кластерный подход)
- Не блокируем US-11 IA Extension; URL-slug `/dizain-landshafta/` — fixed входная вводная

---

## Резюме запроса

Собрать SEO-ядро для услуги «Дизайн ландшафта» — pillar + 5-8 cluster + кейсы + B2B-trail (УК/застройщики). На выходе — готовые вводные для `podev`/`sa-site` под посадочную страницу + для `cw`/`seo-content` под контентные тексты (когда `art` создаст `brand-guide-landshaft.html`). Эталон в SERP — **liwood.ru** (`/services/landshaftniy-dizayn-uchastka/`), уже есть deep-профиль в `seosite/01-competitors/deep/liwood.ru.md`.

**Параллельная зависимость (вне scope этого EPIC):** `art` создаёт `design-system/brand-guide-landshaft.html` (TOV Sage, archetype, лексика, anti-words) — это блокер только для текстовых волн `cw`. Discovery (semantic + URL-map) полностью независим. Trigger в `cpo`-канал поднимаю отдельным запросом.

---

## Deliverables (что считается готовым)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Углубление `liwood.ru` deep-profile (landshaft-разрез) + 5-7 landscape-студий Москвы | re | `seosite/01-competitors/deep/{landshaft-studio-1..7}.md` |
| 2 | Расширение `shortlist.md` Wave 2 (landshaft) | re | `seosite/01-competitors/shortlist.md` (новая секция «Wave 2 — Landshaft services») |
| 3 | Сырые keysso-выгрузки (Keys.so + Topvisor + Wordstat) | seo-content | `seosite/02-keywords/raw/keysso-landshaft-*.json` |
| 4 | Нормализованный CSV (~300-500 ключей) | seo-content | `seosite/02-keywords/normalized-landshaft.csv` |
| 5 | Pillar + 5-8 cluster | seo-content | `seosite/03-clusters/landshaft/{pillar,proekt,blagoustroystvo,gazon,malye-formy,posadka,vert-ozelenenie,kejsy,b2b}.md` |
| 6 | URL ADR (one-pager vs pillar/cluster) | poseo + sa-seo | `seosite/04-url-map/decisions.md` ADR-uМ-23 |
| 7 | URL ADR (B2B-структура) | sa-seo | ADR-uМ-24 |
| 8 | URL ADR (кейсы — общие vs landshaft-only) | sa-seo + tamd (для Payload-коллекции Cases) | ADR-uМ-25 |
| 9 | Sitemap-tree.md обновление (ветка `/dizain-landshafta/...` v0.5) | sa-seo | `seosite/04-url-map/sitemap-tree.md` |
| 10 | Cross-link map арбо↔landshaft↔shop | poseo | в `sa-seo.md` |
| 11 | Schema.org стратегия (Service + Offer + AggregateRating + кейсы как CreativeWork) | seo-tech | в `sa-seo.md` |
| 12 | Content plan (pillar + cluster тексты + кейсы + B2B-trail) | cw + seo-content | `seosite/05-content-plan/landshaft.md` (pending `brand-guide-landshaft.html`) |
| 13 | Hand-off для `podev` | poseo | в `sa-seo.md` Hand-off log |

---

## Ключевые вопросы, на которые discovery даёт ответы

1. **Семантика услуги.** Pillar + 5-8 cluster:
   - **Проект ландшафтного дизайна** (цены, этапы, B2C/B2B) — head-кластер по wsfreq
   - **Благоустройство участка** (комплекс)
   - **Газон** (укладка, ремонт, виды) — отдельный кластер, у liwood есть
   - **Малые архитектурные формы** (дорожки, патио, водоёмы, освещение)
   - **Посадка крупномеров и многолетников** ← cross-link в shop (категория `krupnomery`)
   - **Вертикальное озеленение / живые изгороди**
   - **Кейсы / portfolio** — отдельный URL-вектор (структура решается в ADR-25)
   - **Ландшафт для УК/застройщика (B2B-trail)** — отдельная семантика «благоустройство ЖК», «озеленение придомовой территории»

2. **URL-структура** — критическое решение:
   - **A. One-pager** `/dizain-landshafta/` (минимум, фокус на конверсию, мало точек захвата в SERP)
   - **B. Pillar + cluster** `/dizain-landshafta/` + `/dizain-landshafta/proekt/`, `/blagoustroystvo/`, `/gazon/`, ... (больше точек захвата, но требует контент-плана на 5-8 cluster)
   - **C. Гибрид** — pillar one-pager c глубоким контентом + 2-3 топ-cluster как отдельные URL (минимально жизнеспособный B)
   - **Рекомендация PO для ADR-uМ-23:** B (полная pillar + cluster) — соответствует 252-кластерному подходу services, даёт максимум trafficflow.

3. **Конкурентный анализ.** Углубить `liwood.ru` (есть baseline в seosite/01-competitors/deep/), добавить deep-профили **5-7 специализированных landscape-студий Москвы**. Что у них работает в SERP по «ландшафтный дизайн участка цена» / «проект ландшафтного дизайна»? Какая контент-структура (one-pager vs pillar)? Сколько B2B-страниц? Какая глубина по кейсам? Кандидаты для разведки (по предварительной разведке `re`):
   - studio-fito.ru
   - landshaft-bureau.ru / landshaftnoye.ru
   - dachnyu.ru
   - yardesign.ru / iyardesign.ru
   - +2-3 будут добавлены `re` после первичного скана (сезонные top-10)

4. **Cross-link стратегия:**
   - арбо ↔ landshaft (на `/arboristika/uxod-za-sadom/` → блок «комплексный ландшафтный проект»; на landshaft → «обрезка крупномеров» как доводка)
   - landshaft ↔ shop (на cluster `posadka` — каталог саженцев из shop; на товарной карточке крупномера — кнопка «закажите проект»)
   - landshaft ↔ services full-stack (на `/dizain-landshafta/blagoustroystvo/` — блок «вывоз мусора при благоустройстве»)
   - **Ловушка:** не превратить landshaft в склад внешних линков. Cross-link — топ-3 на pillar, топ-1-2 на cluster.

5. **B2B-сегмент.** Семантика для УК/застройщика отличается:
   - «благоустройство ЖК», «озеленение придомовой территории», «ландшафт для застройщика», «озеленение коттеджного посёлка», «договор на сезонное обслуживание зелёных насаждений»
   - **Альтернативы:**
     - A. Внутри pillar `/dizain-landshafta/b2b/` (sub-page)
     - B. Отдельный URL `/b2b/landshaft/` (под общий /b2b/ pillar — ADR-uМ-11 уже зарезервировал такой паттерн)
     - C. Микс: страница в `/b2b/landshaft/` + блок в pillar `/dizain-landshafta/`
   - **Рекомендация PO для ADR-uМ-24:** B (под общий `/b2b/`) — собирается с другими B2B-сегментами (УК/ТСЖ/FM/застройщики), имеет связку «договор на сезонное обслуживание».

6. **Кейсы — общие vs landshaft-only.**
   - Сейчас в Payload есть единая коллекция `Cases` (общая для всех услуг). Вопрос: добавить ли landshaft-кейсы туда с фильтром `service=landshaft` или сделать отдельный URL-вектор `/dizain-landshafta/keysy/<slug>/`?
   - **Рекомендация PO для ADR-uМ-25:** **унифицированный** `/keysy/<slug>/?service=landshaft` (фильтр на странице) + блок «кейсы» на pillar (выборка топ-5 landshaft-кейсов). Это сохраняет одну коллекцию `Cases` в Payload и даёт максимум E-E-A-T-сигнал по всем услугам.

7. **Schema.org.** Service + Offer (фикс-цена за этап / договор) + AggregateRating (отзывы клиентов кейсов) + LocalBusiness (если landshaft — отдельный филиал; нет, у нас одна юрлицо). Кейсы как CreativeWork с author (исполнитель проекта). Реализация в `site/` — задача `seo-tech` через `fe-site`.

---

## Состав команды и расчёт нагрузки

| Роль | Задача | Чд |
|---|---|---|
| `re` | Deep-профили 5-7 landscape-студий + углубление liwood-разреза | 5 |
| `seo-content` | kw research + clustering pillar + 5-8 cluster + B2B-trail | 5 |
| `sa-seo` | Спека (sa-seo.md) + ADR-23/24/25 + sitemap-tree обновление | 3 |
| `seo-tech` | Schema strategy + UX рекомендации по pillar/cluster (для подачи `art`) | 1.5 |
| `cw` | Черновик meta-templates (после ADR-23, ждёт `brand-guide-landshaft.html`) | 1.5 |
| **Cross-team consult** |||
| `art` | UX-последствия выбора one-pager vs pillar/cluster + старт `brand-guide-landshaft.html` (вне scope) | 1 |
| `podev` | подтверждение по 5-му pillar в `site/collections/Services.ts` | 0.5 |
| `poshop` | cross-link с категорией `krupnomery` подтверждение | 0.5 |
| **Итого** | | **~18 чд** |

**Timeline:** 5 недель параллельно с EPIC-SEO-SHOP (см. plan).

---

## Open questions to operator

1. **B2B-структура — A/B/C.** Рекомендация PO — B (`/b2b/landshaft/` под общий `/b2b/` pillar). Подтверждаешь? Если оператор хочет «всё в одном» (landshaft-pillar собирает и B2C, и B2B) — переключаемся на A.
2. **Кейсы — унифицированные или landshaft-only.** Рекомендация PO — унифицированные с фильтром. Подтверждаешь?
3. **`brand-guide-landshaft.html` — приоритет.** Это блокер для `cw` контентных текстов, но не для discovery. **Запросить у `art` через `cpo` сейчас или после закрытия discovery?** Рекомендация PO — сейчас, чтобы текст шёл сразу за discovery без задержки.
4. **Landshaft = 5-й pillar или 5-й оффер?** Сейчас в `site/collections/Services.ts` 4 pillar (CLAUDE.md immutable «4 услуги»). Landshaft в CLAUDE.md упомянут как «расширение» (2 расширения = landshaft + shop). Вопрос: хотим формализовать его в Payload коллекции как 5-й pillar или оставить отдельной посадочной без записи в `Services`? **Рекомендация PO:** оставить отдельной посадочной (не нагружать Payload Services), URL `/dizain-landshafta/` живёт как обычная Next.js page без CMS-управления. Контент управляется через Payload Pages-like коллекцию (или markdown в репо). Решение — на `tamd` + `popanel` через `cpo`.

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-04-29 | poseo | ba | intake.md готов, прошу `ba.md` (рыночное обоснование landshaft, B2B/B2C tradeoff, RICE по cluster'ам, эскалация в `cpo` если landshaft = 5-й pillar) |
| 2026-04-29 | poseo | art (через cpo) | trigger: запрос на старт `design-system/brand-guide-landshaft.html` (TOV Sage). Параллельная зависимость, не блокирует discovery. |
