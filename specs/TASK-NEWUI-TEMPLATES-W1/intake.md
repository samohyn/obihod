---
task: TASK-NEWUI-TEMPLATES-W1
title: Первая волна HTML-шаблонов в newui/ на base brand-guide.html
team: product
po: podev
type: design + frontend-reference
priority: M (Must — блокер для US-3..US-9 эпика SEO-COMPETE-3 + EPIC-HOMEPAGE-V2)
segment: cross
phase: spec
role: podev → art/ux/ui (через cpo)
status: open
created: 2026-05-07
updated: 2026-05-07
related:
  - specs/EPIC-SEO-COMPETE-3/intake.md
  - specs/EPIC-HOMEPAGE-V2/
  - design-system/brand-guide.html
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md
---

# TASK-NEWUI-TEMPLATES-W1 — первая волна шаблонов в `newui/`

## Зачем

Сейчас page-level композиция глазами проверяется только на двух макетах:
`newui/homepage.html` и `newui/komanda.html`. Каждый новый тип страницы
команда `fe-site` / `lp-site` импровизирует «по brand-guide §1-14», что
приводит к расхождениям и невозможности утвердить эталон до старта вёрстки.

Параллельно эпик **SEO-COMPETE-3 US-3..US-9** требует ~120+ programmatic
SD-страниц (4 pillar × ~30 районов МО). Без эталонного макета T4
Service×District этот эпик не закрывается — вёрстка по «общим словам»
даст разнобой и SEO-провалы (Title/Meta/Schema), как у liwood.

## Decision base

Анализ конкурента-лидера: [`seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md`](../../seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md)
(13 deep-fetch URL + 5 sitemap-индексов разобраны research-агентом
2026-05-07 под мандатом podev).

Ключевые выводы:
- liwood держит 49 city-URL только под удаление деревьев → у нас простор
  на 4 pillar × ~30 районов;
- T4 SD у liwood 4/10 SEO-зрелости (нет Title, нет JSON-LD, есть 404
  в их же mega-menu) → явная зона обгона;
- наш USP «фото→смета» через Claude API против их статичной формы;
- T9/T10/T8 у liwood содержательно слабые (короткие статьи без Author
  Schema, отзывы без AggregateRating, generic-галерея вместо кейсов).

## Scope — Wave 1 (5 шаблонов)

| # | Имя | Файл в `newui/` | Owner | Приоритет |
|---|---|---|---|---|
| **W1.1** | **T4 Service×District** | `newui/uslugi-service-district.html` | art → ux → ui (через cpo) | **первый — блокер SEO-эпика** |
| W1.2 | T1 Главная (актуализация) | `newui/homepage.html` (уже есть, нужен audit под brand-guide v2.2 + 6 pillar) | art → ui | второй |
| W1.3 | T2 Услуга-pillar | `newui/usluga-pillar.html` | art → ui | третий |
| W1.4 | T6 Калькулятор «фото→смета» | `newui/calculator-photo.html` | ux → ui (требует interaction-spec) | четвёртый |
| W1.5 | T11 Shell-pages (контакты / о компании / гарантии) | `newui/page-shell-text.html` | ui | пятый (одним layout'ом) |

## Scope — Wave 2 (4 шаблона, после Wave 1)

T3 полная под-услуга, T9 блог+статья (с Article Schema), T10 отзывы
+ AggregateRating, T8 кейс/портфолио. Триггер — закрытие US-3..US-9
эпика SEO-COMPETE-3.

## Out of scope (page-by-page в `site/` без шаблона)

- T7 Прайс-лист — одиночка
- T5 Промо/Акция — landing на base T2
- T12 Вакансии — не SEO-priority
- B2B-LP (`/dlya-uk/`, `/dlya-zastroyshchikov/`) — на base T2 + B2B-форма

## Acceptance Criteria для Wave 1

Для каждого шаблона:
1. **HTML файл в `newui/`** на base `design-system/brand-guide.html`
   (никакого globals.css или CSS «по памяти» — стили только из brand-guide
   либо инлайн на токенах `--c-*` / `--radius-*` / `--space-*`).
2. **Mobile-first** — проверка на 375 / 414 / 768 / 1024 / 1440. Ничего
   не съезжает, контент читается. (Iron rule operator 2026-05-03.)
3. **Структурный паспорт сверху файла** в HTML-комментарии:
   - URL pattern
   - H1 / Title / Meta
   - JSON-LD типы
   - CTA placements
   - Trust elements
4. **JSON-LD заглушки** в `<head>` для каждого шаблона:
   - T4 SD: `Service` + `LocalBusiness` (areaServed) + `BreadcrumbList` + `FAQPage`
   - T1: `Organization` + `LocalBusiness` + `WebSite` + `BreadcrumbList`
   - T2: `Service` + `BreadcrumbList` + `FAQPage`
   - T6: `WebPage` + `BreadcrumbList`
   - T11: `WebPage` + `BreadcrumbList`
5. **Минимум 1 hero-вариант + 1 footer-вариант** (можно копию из
   homepage.html — chrome shell должен быть единым).
6. **Для T4** — обязательно: уникальный hero-абзац (≥150 слов плейсхолдер,
   с placeholder-токенами `{{district}}` / `{{service}}` для генератора),
   список микрорайонов района (как у liwood), **5+ city-mentions** в теле
   (не только в H1), фото-плейсхолдер с alt = `{{service}} в {{district}}`.

## Hand-off log

- 2026-05-07 · podev → research-agent: запрошен deep-dive liwood.ru → готов
  паспорт 12 типов страниц + 6 рекомендаций по first/second wave.
- 2026-05-07 · podev → cpo (FYI): зафиксировал scope Wave 1 (5 шаблонов),
  первый — T4 Service×District. Запускаю design-agent на T4 параллельно
  с этим artifact'ом. Cross-team координация с poseo по эпику SEO-COMPETE-3
  US-3..US-9 — макет = эталон вёрстки для seo-tech / fe-site.

## Skill activation

- **product-capability** — translate operator intent ("шаблоны страниц")
  в capability-план (5 шаблонов first wave с ACs + decision base).
- **product-lens** — фильтр «зачем»: каждый шаблон обоснован сравнением
  с liwood (что у них есть, что провисает, наша возможность).

Активировано 2026-05-07 podev.
