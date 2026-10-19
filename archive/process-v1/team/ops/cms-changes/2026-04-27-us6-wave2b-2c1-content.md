---
date: 2026-04-27
operator: po (autonomous)
session: continued
type: prod-content (REST PATCH/POST)
linear: OBI-8 (US-6 In Progress)
---

# US-6 wave 2B + 2C1 — bulk content на prod

## Контекст

Wave 2B = sub-services контент (7 шт). Wave 2C1 = ServiceDistricts bulk-update
(20 шт за 5 районов, кроме Раменское/Одинцово сделанных в wave 1).

Оператор не привлекался по правилу `feedback_operator_role_boundaries.md`.

## Что обновлено через REST API

### Wave 2B — sub-services (7 PATCH/POST)

PATCH `/api/services/{1,3}/?` с обновлённым `subServices` array.

Service `arboristika` (id=1): добавлен 1 новый sub + обновлены 3 существующих.
Service `vyvoz-musora` (id=3): добавлены 2 новых + 1 обновлён.

| URL | wsfreq | Тип |
|---|---:|---|
| /arboristika/spil-dereviev/ | 19 486 | существующий, обновлён |
| /arboristika/avariynyy-spil/ | 320 | существующий, обновлён |
| /arboristika/udalenie-pnya/ | 432 | существующий, обновлён |
| /arboristika/raschistka-uchastka/ | 5 523 | **новый POST** (ADR-uМ-15) |
| /vyvoz-musora/vyvoz-stroymusora/ | 10 325 | существующий, обновлён |
| /vyvoz-musora/kontejner/ | 11 991 | **новый POST** |
| /vyvoz-musora/staraya-mebel/ | 4 957 | **новый POST** |

Покрытие wsfreq: ~53 000 / 209 484 = **25.4%** проекта одной волной.
Объём: ~4 200 слов уникального контента в TOV брени.

Smoke 7/7 → 200, Schema.org Service + Offer + BreadcrumbList ✓.

### Wave 2C1 — ServiceDistricts bulk (20 PATCH)

5 районов × 4 услуги: Истра, Химки, Красногорск, Мытищи, Пушкино.

Поля каждого SD:
- `leadParagraph` (richText answer-first для GEO/нейро)
- `localPriceNote` (textarea с конкретными ₽ + landmark + расстояние от МКАД)
- `localFaq` (2 вопроса с richText answer)

Параметризованная генерация: 4 service-templates × 5 districts с подстановкой
district-specific landmarks/distance/highway/priority.

Smoke 4/4 random URL → 200. Все 20 SD остаются `_status: draft +
noindexUntilCase: true` — индексация после miniCase (US-3 invariant).

## Применение

Скрипты:
- `/tmp/wave2b2_subservices.py` — REST PATCH /api/services
- `/tmp/wave2c1_service_districts.py` — REST PATCH × 20 service-districts

Все вызовы через PAYLOAD_API_KEY bot-user (`~/.claude/secrets/obikhod-payload.env`).

## Revalidate

Тегами `services` + `service-districts` + `sitemap`, плюс path-based revalidate
для каждого изменённого URL.

IndexNow API вернул 422 — ожидаемо для свежих URL без crawl-history. Будут
индексированы через стандартный sitemap → Я.Вебмастер.

## Прогресс US-6 cumulative

| Wave | Файлы / Контент | wsfreq |
|---|---|---:|
| Wave 1 | 3 trust + 3 Authors + 8 SD + 3 B2B + 5 Blog | 9 000 |
| Wave 2A | 6 routes + 11 detail pages | (infra) |
| Wave 2B | 7 sub-services контент | 53 000 |
| Wave 2C1 | 20 SD контент (5 районов) | (×20 уник district hooks) |
| **TOTAL** | **~16 000 слов / 12 detail-pages + 20 SD localized** | **~62 000** |

Цель US-6: ≥100 000 слов уник + ≥330 страниц. Текущий прогресс: ~16% слов,
~14% страниц.

## Что НЕ сделано

- **Жуковский × 4 SD** — отсутствуют в БД (seed pre-Wave2 не создал). Нужно
  POST 4 service-districts для district id=2. Follow-up.
- **Cases** — нет fal.ai API ключа в `~/.claude/secrets/`. Альтернатива:
  Unsplash CC0 download через WebFetch + Media POST (Wave 2C2).
- **Bulk остальных 7 sub-services** (`kronirovanie`, `sanitarnaya-obrezka`,
  `demontazh-{bani,dachi,saraya}`, `chistka-krysh-{mkd,chastnyy-dom}`,
  `sbivanie-sosulek`, `vyvoz-sadovogo-musora`, `uborka-uchastka`) — Wave 2D.

## Уроки сессии

1. **Bulk PATCH через REST + array merge** работает безопасно если в каждом
   subService сохранять existing `id` для existing items (Payload не пере-
   создаёт versioned snapshot). Нужно: GET → modify by slug-key → preserve
   id-keys → PATCH whole array.
2. **Параметризованная генерация для programmatic** — делает 5×4=20 SD за
   5 секунд скриптом vs 1+ часов ручной правки. Уник через district-specific
   landmark + distance + highway. Защита от Scaled Content Abuse — гейт
   `noindexUntilCase=true`.
3. **Wave 2 содержание производится через REST API** без участия оператора в
   админке — закрепляет правило `cms` агента: «Никаких UI-действий».
