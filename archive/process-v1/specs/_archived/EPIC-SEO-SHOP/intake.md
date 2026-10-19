---
epic: EPIC-SEO-SHOP
title: SEO Discovery — магазин саженцев (apps/shop)
team: seo
po: poseo
type: research
priority: P1
segment: ecommerce
phase: discovery
role: poseo
status: intake
blocks: [shop-dev-waves, sa-shop-categories, sa-shop-product-card]
blocked_by: []
related: [US-11-ia-extension, EPIC-SEO-LANDSHAFT, project_shop_storage_decision]
created: 2026-04-29
updated: 2026-04-29
skills_activated: [seo, product-capability, blueprint, market-research, search-first]
---

# EPIC-SEO-SHOP — SEO Discovery для магазина саженцев

**Автор intake:** poseo
**Дата:** 2026-04-29
**Источник:** запрос оператора + plan `team-seo-poseo-md-radiant-hartmanis.md` (approved 2026-04-29)
**Тип:** research / discovery
**Срочность:** P1 — блокирует scaffolding `apps/shop` (нужны slug'и, фасетное решение, schema-стратегия до старта кода)
**Сегмент:** ecommerce
**Связано с:** US-11 IA Extension (mega-menu shop, slug'и категорий fixed), EPIC-SEO-LANDSHAFT (cross-link strategy), `team/shop/poshop.md`

---

## Skill activation (iron rule)

`poseo` активирует на старте: **`seo`** (основной), **`product-capability`** (capability map для 9 категорий × фасеты), **`blueprint`** (5-недельный crispy roadmap), **`market-research`** (Леруа/Подворье/Савватеевы deep-profile), **`search-first`** (best practices ecommerce SEO Next.js + headless). Каждый агент команды на своём артефакте делает skill-check с фиксацией в Hand-off log.

---

## Исходный запрос оператора (2026-04-29)

> мне почему то кажется что нам нужно провести ресерч для питомника растений и дизайна ландшафта? какое ядро, структура итд

**Решения оператора в plan-mode (2026-04-29):**
- Discovery параллельно с EPIC-SEO-LANDSHAFT (research-only ≠ implementation, iron rule strict-sequential не нарушается)
- Глубина — full research (252-кластерный подход как services, не MVP)
- Не блокируем US-11 IA Extension; URL-slug'и из US-11 принимаем как фиксированные вводные

---

## Резюме запроса

Собрать промышленное SEO-ядро для **9 категорий магазина саженцев** + товарный tail + фасетная архитектура + positioning vs Леруа/Подворье/Савватеевы/Поиск + cross-link стратегия со services (арбо ↔ shop). На выходе — готовые вводные для `poshop`/`sa-shop` под scaffolding `apps/shop` и для `cw`/`seo-content` под контентные волны.

**9 категорий (зафиксированы в `team/shop/poshop.md` + US-11 art-brief-ui.md):**
1. Плодовые деревья — `/magazin/plodovye-derevya/`
2. Колоновидные плодовые — `/magazin/kolonovidnye/`
3. Плодовые кустарники — `/magazin/plodovye-kustarniki/`
4. Декоративные кустарники — `/magazin/dekorativnye-kustarniki/`
5. Цветы — `/magazin/cvety/`
6. Розы — `/magazin/rozy/`
7. Крупномеры — `/magazin/krupnomery/`
8. Лиственные деревья — `/magazin/listvennye/`
9. Хвойные — `/magazin/khvoynye/`

---

## Deliverables (что считается готовым)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Deep-профили 4 ecommerce-конкурентов | re | `seosite/01-competitors/deep/{leroymerlin,podvorye,savvateev,poiskpitomnik}.md` |
| 2 | Расширение `shortlist.md` Wave 2 (shop) | re | `seosite/01-competitors/shortlist.md` (новая секция «Wave 2 — Shop ecommerce») |
| 3 | Сырые keysso-выгрузки (Keys.so + Topvisor) | seo-content | `seosite/02-keywords/raw/keysso-shop-*.json` |
| 4 | Нормализованный CSV (~2000-3000 ключей) | seo-content | `seosite/02-keywords/normalized-shop.csv` |
| 5 | 9 кластерных файлов (по категориям) | seo-content | `seosite/03-clusters/shop/{plodovye-derevya,kolonovidnye,plodovye-kustarniki,dekorativnye-kustarniki,cvety,rozy,krupnomery,listvennye,khvoynye}.md` |
| 6 | Товарные tail-паттерны (сорт × размер × ZKS/ОКС × сезон) | seo-content + sa-seo | `seosite/03-clusters/shop/_product-tail-patterns.md` |
| 7 | URL-architecture ADR (фасеты) | poseo + sa-seo | `seosite/04-url-map/decisions.md` ADR-uМ-19 |
| 8 | URL ADR (товарный slug) | sa-seo | ADR-uМ-20 |
| 9 | URL ADR (sitemap-shop отдельный index) | seo-tech | ADR-uМ-21 |
| 10 | URL ADR (cross-link services↔shop) | poseo | ADR-uМ-22 |
| 11 | Schema.org стратегия (Product/Offer/AggregateOffer/BreadcrumbList) | seo-tech | спека в `sa-seo.md` |
| 12 | Sitemap-tree.md обновление (ветка `/magazin/...` v0.5) | sa-seo | `seosite/04-url-map/sitemap-tree.md` |
| 13 | Content plan (категорийные посадочные + товарные карточки + гайды) | cw + seo-content | `seosite/05-content-plan/shop-categories.md` |
| 14 | Positioning decision (ниша/fight) | poseo | в `sa-seo.md`, аппрув от `cpo` |
| 15 | Hand-off для `poshop` | poseo | в `sa-seo.md` Hand-off log |

---

## Ключевые вопросы, на которые discovery даёт ответы

1. **Ёмкость семантики по 9 категориям.** Для каждой — top-100 ключей по wsfreq + tail. Источники: Keys.so (по конкурентам), Wordstat XML (frequency), Topvisor (точные частоты по МО + сезонность), Just-Magic (кластеризация). Гипотеза: «крупномеры» и «хвойные» — премиум-ёмкость; «цветы» / «розы» — head-конкуренция с агрегаторами.

2. **Конкурентное поле.** Кто из top-5 в SERP по «купить саженцы плодовых деревьев Москва», «крупномеры с доставкой», «хвойные саженцы»? Леруа = head-monster (миллионы трафика, нельзя с ним fight head-on). Подворье / Савватеевы / Поиск — niche-конкуренты с похожим offer. **Решение: ниша (премиум? региональный? B2B-питомник для landscape-студий?) или fight-for-head?** Эту гипотезу выводит `re` + `poseo` после deep-разведки.

3. **URL-архитектура фасетов** — критическое решение, делается **один раз**:
   - **A.** ЧПУ-фасеты `/magazin/khvoynye/sosna/?height=2m&container=zks` (1 уровень в URL — категория + основной фильтр; остальное query)
   - **B.** Полные ЧПУ `/magazin/khvoynye/sosna-2m-zks/` (все фасеты в URL — взрывной рост страниц, риск Scaled Content Abuse)
   - **C.** Только query-string `/magazin/khvoynye/?type=sosna&height=2m` (просто, но теряем SEO-вес фасетов)
   - **Рекомендация (для ADR-uМ-19):** A (гибрид — 1 уровень в URL, остальное query). Аргументы и контраргументы — в sa-seo.md.

4. **Товарный slug.** `/magazin/<категория>/<sku-slug>/` — но что внутри slug'а? Только латиница / транслит. Стабильность при переименовании сорта (Redirects-коллекция). Уникальность по всему shop или внутри категории? — ADR-uМ-20.

5. **Schema.org стратегия.** Product (товар) + Offer (цена/наличие) + AggregateOffer (для категорий) + BreadcrumbList (на всех уровнях). Дополнительно: Product → image, brand (поставщик), category. Реализация в `apps/shop` — отдельная задача `seo-tech` через `fe-shop`.

6. **Sitemap.** Отдельный `/sitemap-shop.xml` (subindex), включается в корневой sitemap-index. Частота update: товары — daily, категории — weekly. Priority: `/magazin/` 0.9, категории 0.8, товары 0.6 — ADR-uМ-21.

7. **Cross-link стратегия (главное seo-преимущество в нише):**
   - services → shop: на `/arboristika/posadka-derevev/` блок «купить саженцы» → топ-категории shop
   - services → shop: на `/landshaft/<кластер>/` (после EPIC-SEO-LANDSHAFT) — каталог нужных растений под кейс
   - shop → services: на товарной карточке крупномера / плодового — кнопка «заказать посадку» → arboristika
   - shop → services: на категории `/krupnomery/` — блок «комплексный landscape-проект» → landshaft
   - **ADR-uМ-22** — формализация cross-link map.

---

## Состав команды и расчёт нагрузки

| Роль | Задача | Чд |
|---|---|---|
| `re` | Deep-профили 4 конкурентов + рынок-сайзинг | 5 |
| `seo-content` | kw research + clustering 9 категорий + товарный tail | 8 |
| `sa-seo` | Спека (sa-seo.md) + ADR-19/20/22 + sitemap-tree | 3 |
| `seo-tech` | ADR-21 (sitemap-shop) + schema strategy ADR | 2 |
| `cw` | Черновик meta-templates для категорий и товаров (после ADR-19) | 2 |
| **Cross-team consult** |||
| `poshop` | категории/ассортимент confirm, B2B vs B2C приоритеты | 1 |
| `art` | если затронем UX списков/карточки за пределами §15-29 | 0.5 |
| `tamd` | если schema-changes требуют новых полей в Payload (вряд ли — shop отдельная Postgres) | 0.5 |
| **Итого** | | **~22 чд** |

**Timeline:** 5 недель параллельно с EPIC-SEO-LANDSHAFT (см. plan).

---

## Open questions to operator

1. **Positioning.** Премиум-ниша / B2B (для landscape-студий) / региональный (МО+ближнее Подмосковье) / B2C-универсал? Это влияет на выбор семантики (head vs niche-tail) и meta-tone-of-voice. **Рекомендация PO:** B2B-питомник + B2C-премиум (избегать head-fight с Леруа).
2. **Topvisor для shop.** Используем тот же аккаунт, что куплен на US-4, или отдельный проект? **Рекомендация PO:** отдельный проект внутри одного аккаунта, чтобы не смешивать services-ядро с shop.
3. **Регионы парсинга частот.** Москва+МО (как services) или шире (РФ+СНГ если планируем B2B-доставку)? **Рекомендация PO:** Москва+МО на старте (доставка крупномеров за пределы МО — отдельная экономика).

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-04-29 | poseo | ba | intake.md готов, прошу `ba.md` (рыночное обоснование, RICE-обоснование, MoSCoW по 9 категориям) |
