# US-5: Полная IA и карта сайта — каждая страница = услуга

**Автор intake:** in
**Дата:** 2026-04-24
**Linear Issue:** [OBI-2](https://linear.app/samohyn/issue/OBI-2) (state: Backlog, labels: `Feature`, `P1`, project: EPIC SITE-MANAGEABILITY)
**Тип:** research + feature
**Срочность:** high (P1) — блокирует US-6..US-10
**Сегмент:** cross
**Связано с:** EPIC SITE-MANAGEABILITY (эпик №3 из 8)

---

## Исходный запрос оператора (2026-04-24)

> мне нужна карта сайта полноценная под услуги
>
> чтобы каждая страница была = услуге
>
> также важно сделать так чтобы по seo и нейро seo все было предусмотрено
>
> разметка, хдебные крошки, поведенческий фактор и так далее
>
> 3 - согласуй со мной полную структуру сайта от главной до вложенных страниц

---

## Резюме запроса

Финализировать **полную IA сайта Обихода** — от главной до 4-го уровня вложенности, каждый лист дерева — страница под конкретную услугу/район/кейс/B2B-сценарий/блог-статью. IA должна поддерживать: все кластеры из US-4 (семантическое ядро), структурную разметку (Schema.org: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList, Article, Review), хлебные крошки на всех уровнях, поведенческие сигналы (время на странице, скролл-депс, клики на ссылки, переходы «соседние услуги/районы»).

Выход US-5:
1. Обновлённый [contex/05_site_structure.md](../../../contex/05_site_structure.md) с синхронизацией факта (расхождения с реальной моделью коллекций зафиксированы в анализе be4).
2. Новый [contex/09_full_sitemap_ia.md](../../../contex/) — полная IA (дерево, URL-схема, canonical-правила, перелинковка, schema-покрытие).
3. Обновлённая модель Payload: новые поля (SEO-override, h1Override, robots, canonical, faqJsonLd, breadcrumbOverride, lastReviewedAt, reviewedBy), новые коллекции (если нужны после US-4: `Testimonials`, `Promotions`, `StaticPages`, `Navigation` global), новая миграция.
4. Согласование с оператором **до** перехода к US-6.

## Открытые вопросы к оператору

1. **Подтверди URL-схему.** Предварительно (из разбора 4 агентов): `/{service-slug}/`, `/{service}/{sub-service}/`, `/{service}/{district}/`, `/raiony/{district}/`, `/b2b/{audience}/`, `/kejsy/{slug}/`, `/blog/{slug}/`, `/kalkulyator/`, `/smeta-za-10-minut/`, `/avariyno/`. Оставляем или переделываем?
2. **District-hub vs programmatic** — `/raiony/{district}/` оставляем как hub (без формы, только навигация к 4 услугам)? Или объединяем с programmatic?
3. **Блог-категории** — плоско `/blog/{slug}/` + `noindex` на `/blog/category/{cat}/`? Или иерархия `/blog/{cat}/{slug}/`? SEO1 голосует за плоско.
4. **Калькуляторы** — 1 универсальный `/kalkulyator/?service=...` (с чипами-переключателями) + 4 SEO-landing с 301? Или 4 отдельных полноценных?
5. **Trust-страницы** — `/o-kompanii/`, `/komanda/`, `/litsenzii/`, `/garantii-i-otvetstvennost/` — одна агрегирующая `/o-kompanii/` с якорями + standalone `/litsenzii/` (для B2B)? Или оставляем 4 отдельные?
6. **Личный кабинет** — `/lichnyy-kabinet/` для повторных заказов B2C (UX предложил) — в scope US-5 или откладываем в backlog?
7. **B2B раздел** — `/b2b/` с 6-8 sub-аудиториями (УК, ТСЖ, застройщики, ЖКХ-операторы, FM, госзаказ) или меньше?

## Предварительный бриф для BA

1. **Цель:** каждый ключ из US-4 имеет свою URL-ячейку, каждая ячейка покрыта schema + breadcrumb + перелинковкой.
2. **Метрики:**
   - 100% кластеров US-4 отражены в IA.
   - 100% публичных страниц имеют BreadcrumbList + соответствующий Schema (Service/FAQPage/Article/Review).
   - 0 thin-страниц (min 800 слов) по гейту в Payload.
   - Линк-граф: каждая страница имеет 8–15 внутренних ссылок.
3. **Границы:**
   - IN: IA-дерево, URL-схема, canonical-политика, schema-карта, модель Payload (новые поля, коллекции, globals), миграция.
   - OUT: написание контента (US-6), имплементация Next-роутов (US-6/US-8), SEO-аудит (US-10).
4. **Состав команды:**
   - `sa` (ведущий) — IA, модель, URL-схема, ADR
   - `seo1` — SEO-рамка IA, кластеры, canonical
   - `seo2` — schema.org карта, hreflang (если понадобится)
   - `ux` — навигация, breadcrumb-паттерн, CJM
   - `cw` — TOV-валидация подписей разделов
   - `be4` — реализация полей/коллекций в Payload после согласования
   - `tamd` — ADR на разделение коллекций (например, `StaticPages` vs новая коллекция)
   - `lp` — CRO-гипотезы на pillar и programmatic
   - `qa1` — покрытие тестами schema и breadcrumb
   - `po` — согласование обновлений `contex/05` с оператором
   - `out` — accept

## Связи

- **Blocks:** US-6, US-7, US-8, US-9, US-10.
- **Blocked by:** US-4 (ядро), и по правилу 1→8 — US-3.
- **Related:** все `contex/*.md`.

## Антидубль-проверка

- `contex/05_site_structure.md` — существующая база, нуждается в обновлении после US-4. Не дубль, продолжение.

## Готовность к передаче

- [ ] Оператор ответил на 7 вопросов.
- [ ] Оператор подтвердил резюме и scope.
- [ ] Передано ba — YYYY-MM-DD HH:MM

## Hand-off

- `→ ba` только после закрытия US-4 (строго 1→8).

---

## Service-meta

- **Файл:** `devteam/specs/US-5-full-sitemap-ia/intake.md`
- **Linear labels:** `Research`, `Feature`, `P1`, `cross`, `phase:intake`, `role:in`, `SEO`, `IA`
- **Assignee:** оператор
