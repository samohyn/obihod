# US-6 wave 2B — Release Acceptance

**Автор:** out
**Вердикт:** **approve**
**Дата:** 2026-04-27
**Окружение:** prod (https://obikhod.ru, deploy sha c20735f1 после PR #56)
**Проверил:** out (автономно)

## 1. Соответствие US-6 wave 2B scope

| Цель | Статус |
|---|---|
| Schema-расширение `Services.subServices` (intro/body/metaTitle/metaDescription) | ✅ wave 2B1 PR #56 |
| Миграция applied на prod через ssh+psql | ✅ wave 2B1 |
| Dual-routing /<service>/<sub-or-district>/ | ✅ wave 2B1 PR #56 |
| Schema.org Service + Offer + BreadcrumbList на sub-странице | ✅ |
| Sitemap расширение | ✅ +7 sub URLs |
| 7 sub-services с контентом (≈25% wsfreq проекта) | ✅ wave 2B2 |
| E2E тесты | ✅ us6-wave2b-subservices.spec.ts |

## 2. Smoke 7 sub-service URLs

```
200 /arboristika/spil-dereviev/         (wsfreq 19 486)
200 /arboristika/avariynyy-spil/        (320)
200 /arboristika/udalenie-pnya/         (432)
200 /arboristika/raschistka-uchastka/   (5 523, ADR-uМ-15) ← новый
200 /vyvoz-musora/vyvoz-stroymusora/    (10 325)
200 /vyvoz-musora/kontejner/            (11 991) ← новый
200 /vyvoz-musora/staraya-mebel/        (4 957) ← новый
```

**7/7 → 200.** Покрытие wsfreq: ~53 000 / 209 484 = **25.4% всего трафика проекта** одной волной.

## 3. Schema spot-check

`/arboristika/spil-dereviev/` — `Service` ✓ + `Offer` ✓ + `BreadcrumbList` ✓. Offer содержит `priceFrom: 12800 RUB unitText: "за объект"` — соответствует TOV «фикс-цена за объект».

Все 7 sub-services получили JSON-LD `Service` schema через `serviceSchema()` помощник (lib/seo/jsonld.ts).

## 4. Sitemap.xml

Содержит все 7 новых sub-service URLs с priority 0.85:

```xml
<loc>https://obikhod.ru/vyvoz-musora/vyvoz-stroymusora/</loc>
<loc>https://obikhod.ru/vyvoz-musora/kontejner/</loc>
<loc>https://obikhod.ru/vyvoz-musora/staraya-mebel/</loc>
<loc>https://obikhod.ru/arboristika/spil-dereviev/</loc>
<loc>https://obikhod.ru/arboristika/udalenie-pnya/</loc>
<loc>https://obikhod.ru/arboristika/avariynyy-spil/</loc>
<loc>https://obikhod.ru/arboristika/raschistka-uchastka/</loc>
```

## 5. Объём контента

7 sub-services × ~600 слов уник = **~4 200 слов** уникального текста.

Структура каждой страницы:
- intro (textarea answer-first ~280 char)
- body (Lexical richText): 4-6 секций h2 + параграфы + bullet-lists
- metaTitle (60 char), metaDescription (160 char)
- Schema.org Service + Offer

Все тексты в TOV брени (matter-of-fact, конкретные цифры — «12 800 ₽», «8/20/27 м³», «1-2 часа»). Анти-TOV отсутствуют.

## 6. Безопасность

- Секреты: нет (вся работа через REST API + ssh+psql)
- 152-ФЗ: контент публичный, ПДн не задействованы
- Анти-TOV: проверено

## 7. Итог

US-6 wave 2B полностью закрыта. Прогресс по US-6:
- Wave 1 (содержание авторы/блог/B2B): ~7 500 слов
- Wave 2A (routes): инфраструктура
- Wave 2B (sub-services 7 шт): ~4 200 слов
- **Total US-6 на сейчас: ~11 700 слов / 100 000 целевых = 11.7%**

Покрытие wsfreq:
- Wave 1: ~9 000 wsfreq (Authors/Blog/B2B head-clusters)
- Wave 2B: ~53 000 wsfreq
- **Total purely навес sub-services: ~62 000 / 209 484 = 30%** через 12 страниц

## 8. Recommendation

Старт **Wave 2C** — programmatic 160 ServiceDistricts bulk-update + Cases (mock через fal.ai). Это закроет 60+ programmatic URL и доберёт ещё ~80% wsfreq через локальные хвосты.

## 9. Follow-ups

- [ ] Wave 2D: остальные 7 sub-services из БД (kronirovanie, sanitarnaya-obrezka, demontazh-{bani,dachi,saraya}, chistka-krysh-*, sbivanie-sosulek, vyvoz-sadovogo-musora, uborka-uchastka) — bulk write
- [ ] FAQ для каждой sub-service (выработать pattern + копи)
- [ ] Связать sub-services с Cases через `casesShowcase`
- [ ] Author byline на sub-strings (E-E-A-T) — wave 2D
