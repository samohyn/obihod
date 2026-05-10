---
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D5
title: A/B pilot — `/vyvoz-musora/` v1 vs v2 (master-template)
team: dev + seo + po
status: setup-ready (ожидает deploy + Я.Метрика goals creation)
created: 2026-05-10
updated: 2026-05-10
skills_activated: [backend-patterns, nextjs-turbopack, seo]
---

# D5 — A/B cookie split на /vyvoz-musora/

## Цель

7-дневный pilot для confirm/reject: новый master-template (T2_PILLAR с
useTemplateV2=true → 11 React компонентов wave A) реально улучшает conversion
relative to sustained legacy rendering (block-array as-is).

## Scope

**Pilot URL:** `/vyvoz-musora/` и все суб-маршруты (sub-services + districts).
**Sustained URLs:** все остальные pillars + не-pillar страницы → default
sustained rendering, A/B их не задевает.

## Architecture

```
Visitor → proxy.ts → cookie obikhod_ab_var=v1|v2 (50/50 random, 1 year, SameSite=Lax, !httpOnly)
                  → x-ab-variant header passed downstream
                  → [service]/page.tsx
                       ↓
                       readAbVariantOverride('vyvoz-musora') → cookies()
                       ↓
                       resolverOpts.templateV2 = (cookie === 'v2')
                       ↓
                       getBlocksForLayer('T2_PILLAR', blocks, opts)
                       ↓
                       BlockRenderer (v1 = legacy, v2 = master-template wave A)
```

## Files modified

| Файл | Что | Why |
|---|---|---|
| `site/proxy.ts` | Set cookie 50/50 на pilot path; pass-through `x-ab-variant` header | Cookie split |
| `site/lib/feature-flags/ab-pilot.ts` | NEW: `readAbVariant()` + `readAbVariantOverride(slug)` | Server-side cookie read с early return для не-pilot slugs (sustained ISR) |
| `site/app/(marketing)/[service]/page.tsx` | Apply override после `buildResolverOptions(doc)` | Force `templateV2=true` для pilot+v2 visitors |
| `site/components/analytics/RumProvider.tsx` | Add `abVariant` field в beacon payload (только pilot path) | RUM aggregation by variant |
| `site/components/analytics/YandexMetrika.tsx` | reachGoal AB_PILOT_v1/v2 + params ab_pilot — на pilot path | Я.Метрика goals report split |
| `site/app/api/rum/route.ts` | Validate + persist `abVariant` field | Beacon ingest |
| `site/collections/RumMetrics.ts` | New `abVariant` select field (`v1`/`v2`) | Payload UI + storage |
| `site/migrations/20260510_191924_rum_metrics_ab_variant.{up,down,ts}.sql` | ENUM + column + index | Postgres schema |

## NOT changed

- НЕ меняем Payload doc data (services.useTemplateV2 остаётся false на prod).
- НЕ задеваем sustained (non-pilot) URLs — early return в `readAbVariantOverride`.
- НЕ ломаем default v1 rendering — без cookie / с cookie=v1 page рендерится как
  до D5 (legacy block-array as-is).

## KPI

Primary:
- **Lead conversion rate** = leads.create count (pilot URL) / unique sessions per variant.
  Источник: Payload `leads` (collected utm/source) + Я.Метрика sessions filter
  by goal AB_PILOT_v1/v2.

Secondary:
- **Bounce rate** by variant (Я.Метрика отчёт «Источники → Цели»).
- **Scroll depth** (webvisor / Я.Метрика clickmap).
- **CWV p75 by variant** (RumMetrics: `GROUP BY ab_variant, name`):
  - LCP < 2.5s (good)
  - INP < 200ms (good)
  - CLS < 0.1 (good)

## Stop conditions

| Триггер | Действие |
|---|---|
| Conv rate v2 < v1 на ≥10% (после ≥200 sessions / variant) | Rollback: deploy proxy.ts с force `obikhod_ab_var=v1` для всех |
| LCP p75 v2 > 4s (poor zone) | Rollback (perf regression) |
| 5xx error spike на /vyvoz-musora/ > 1% | Rollback + post-mortem |
| Любая secondary метрика regress >20% | Rollback + investigate |

## Rollback procedure

1. **Soft rollback** (force v1 для всех новых посетителей):
   ```typescript
   // proxy.ts: вместо random — hardcode v1 на 7 дней
   const variant = 'v1'
   ```
   Эффект: новые visitors всегда получают v1; existing v2 cookie sustained до expire.

2. **Hard rollback** (force v1 для всех вкл. existing):
   ```typescript
   // Просто delete + reissue
   response.cookies.set({ name: 'obikhod_ab_var', value: 'v1', maxAge: AB_COOKIE_MAX_AGE, path: '/' })
   ```

3. **Nuclear option** (выключить cookie split полностью):
   - Закомментировать D5-блок в `proxy.ts` после Step 5.
   - Удалить override apply в `[service]/page.tsx`.
   - Не трогать collection/migration (NULL для будущих сэмплов — ок).

## Operator monitoring

### Я.Метрика
1. **Создать goals** в Я.Метрика → Цели → Создать → JS-событие:
   - Идентификатор: `AB_PILOT_v1`, название: «D5 pilot · vyvoz · v1 (legacy)»
   - Идентификатор: `AB_PILOT_v2`, название: «D5 pilot · vyvoz · v2 (master)»
2. После 24h — отчёт «Конверсии» → segment by goal → compare v1 vs v2 sessions.
3. Webvisor → filter `параметры визитов > ab_pilot = v2` → cohort behavior.

### RumMetrics SQL aggregation
```sql
-- p75 LCP per variant за последние 24h на pilot URL
SELECT
  ab_variant,
  name,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) AS p75,
  COUNT(*) AS samples
FROM rum_metrics
WHERE page_url LIKE '/vyvoz-musora%'
  AND ab_variant IS NOT NULL
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY ab_variant, name
ORDER BY ab_variant, name;
```

### Lead conversion (Payload Leads)
```sql
-- Conv per session требует cross-join с Я.Метрика sessions по utm.
-- На MVP: count leads per variant через `source` field (set proxy.ts → request header).
SELECT
  COUNT(*) AS leads_count
FROM leads
WHERE created_at > NOW() - INTERVAL '24 hours'
  AND source LIKE '%vyvoz-musora%';
-- Variant breakdown — через Я.Метрика goal report (более надёжно: cookie+session).
```

## Activation checklist (post-deploy)

- [ ] Migration applied на prod (`pnpm payload migrate`)
- [ ] proxy.ts deployed → curl `Cookie: <none>` /vyvoz-musora/ возвращает Set-Cookie
- [ ] curl `Cookie: obikhod_ab_var=v2` → DOM содержит блоки master-template wave A (calculator-shell vs calculator-placeholder)
- [ ] curl `Cookie: obikhod_ab_var=v1` → DOM legacy (текущий sustained)
- [ ] Я.Метрика goals AB_PILOT_v1 + AB_PILOT_v2 созданы (operator)
- [ ] После 1h trafic: rum_metrics WHERE ab_variant IS NOT NULL → видны записи
- [ ] Operator готов monitor 7 дней + decision на день 8

## Open questions для operator

1. Я.Метрика goals — operator создаёт сам или dev делает через API? (default: operator UI)
2. Pilot start date — после ближайшего deploy или ждём дополнительного approve?
3. Если v2 win — скользкий roll-out на остальные pillars (8 нед × 30 URL/нед — D6) или
   instant flip всех pillars в Payload `useTemplateV2=true`?
