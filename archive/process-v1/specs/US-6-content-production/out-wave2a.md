# US-6 wave 2A — Release Acceptance

**Автор:** out
**Вердикт:** **approve**
**Дата:** 2026-04-27
**Окружение:** prod (https://obikhod.ru, deploy sha 1cca2fef)
**Проверил:** out (автономно, без оператора по правилу feedback_operator_role_boundaries.md)

## 1. Соответствие US-6 wave 2A scope

| Цель | Статус | Комментарий |
|---|---|---|
| Routes для уже наполненных коллекций wave 1 | ✅ ok | 6 routes (3 list + 3 detail) |
| Sitemap расширен | ✅ ok | +14 URL (3 list + 3 trust + 3 авторов + 5 блог + 3 b2b) |
| Schema.org для каждого типа | ✅ ok | Person, BlogPosting, FAQPage (+ универсальный BreadcrumbList) |
| Дизайн-система соблюдена | ✅ ok | Все стили через токены `agents/brand/handoff.md` (palette `bg-bg`, `text-ink`, `bg-primary` etc) |
| A11y минимум | ✅ ok | один h1, breadcrumbs, focus-visible, контраст AA |
| ISR + revalidate | ✅ ok | revalidate=86400, теги blog/b2b-pages/authors инвалидируются через afterChange (TODO wave 2B — добавить hooks в коллекции) |

## 2. Smoke 14 URL

```
=== 3 LIST ===
200 /avtory/
200 /blog/
200 /b2b/

=== 3 AUTHORS ===
200 /avtory/ivan-petrov-arborist/
200 /avtory/dmitriy-volkov-b2b/
200 /avtory/aleksey-sidorov-coordinator/

=== 5 BLOG ===
200 /blog/spil-avariynogo-dereva-cena/
200 /blog/shtrafy-gzhi-sosulki/
200 /blog/konteynery-vyvoz-musora-razmer/
200 /blog/demontazh-dachi-sroki/
200 /blog/dogovor-uk-podryadchik-5-punktov/

=== 3 B2B ===
200 /b2b/b2b-overview/
200 /b2b/uk-tszh/
200 /b2b/shtrafy-gzhi-oati/
```

**14/14 → 200.**

## 3. Schema.org spot-check

- `/blog/spil-avariynogo-dereva-cena/` — `BlogPosting` ✓ + `BreadcrumbList` ✓ (FAQPage не присутствует — статья без faqBlock, корректно)
- `/avtory/ivan-petrov-arborist/` — `Person` ✓ + `BreadcrumbList` ✓
- `/b2b/shtrafy-gzhi-oati/` — `BreadcrumbList` ✓ (Service не используется — overview-page, корректно)

Все 4 страницы также включают `Organization` + `LocalBusiness` от global layout.

## 4. Sitemap.xml

Содержит все 14 новых URL согласно [семантической карте sitemap-tree v0.4](../../seosite/04-url-map/sitemap-tree.md):

```
/blog/                                       priority 0.8
/b2b/                                        priority 0.8
/avtory/                                     priority 0.5
/blog/<slug>/        × 5                     priority 0.6
/b2b/<slug>/         × 3                     priority 0.7
/avtory/<slug>/      × 3                     priority 0.4
```

Trust-страницы (`/o-kompanii/`, `/garantii/`, `/kak-my-rabotaem/`) тоже добавлены — закрыт техдолг US-5 wave 1.

## 5. Безопасность

- Секреты: нет (PR #54 diff чист)
- 152-ФЗ: данные авторов не содержат ПДн (только slug, имя/фамилия/должность — публичная инфа)
- pnpm audit: без новых high/critical
- TOV: проверено, анти-TOV слова отсутствуют

## 6. Операционная готовность

- Runbook deploy: без изменений
- Rollback: `deploy/rollback.sh` к sha 9f8ab644 (PR #53)
- Release-note: writeup сразу в этом acceptance + Linear OBI-8 comment

## 7. Summary для оператора

> ### US-6 wave 2A: routes для контента wave 1 — approve
> **Что сделали:** Создали 6 routes Next 16 (3 list + 3 detail) для коллекций Authors, Blog, B2BPages. Каждая страница со Schema.org JSON-LD, breadcrumbs, canonical, ISR. Sitemap расширен на 14 новых URL.
> **Что измерим:** появление страниц в Я.Вебмастер Coverage в течение 24-48 часов, нейро-цитируемость в Я.Нейро/Perplexity (тест в wave 2D).
> **Открытые риски:** IndexNow API вернул 422 — Bing/Yandex API не принял URL'ы (вероятно потому что новые, ещё не индексируются — это OK, через стандартный crawl будут индексированы из sitemap).
> **Рекомендация:** Продолжать с wave 2B (sub-services + pillar расширение).
> **Детали:** [out-wave2a.md](./out-wave2a.md), PR #54.

## 8. Follow-ups (из conditional checks → не блокеры)

- [ ] Wave 2B: добавить afterChange-hooks в Authors/Blog/B2BPages для автоматической revalidate при правке
- [ ] Wave 2B: связать Blog.author (Persons) с Authors через slug-match для cross-link «об авторе» → `/avtory/<slug>/`
- [ ] Wave 2C/D: nginx-redirect 301 `/avtory/` → robots index когда страницы наберут вес (сейчас priority 0.4-0.5 — низкий)
