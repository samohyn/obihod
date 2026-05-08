---
us: US-3
title: SA-SEO US-3 — Payload расширение (Districts +23, ServiceDistricts bulk-seed 150, namespace validate-hooks, lint:slug, uniquenessScore, reviewedBy)
team: seo (orchestrate) + panel (Payload owner) + dba (миграции)
po: poseo
type: spec
priority: P0
phase: spec
role: sa-seo
status: active
blocks: [US-4, US-5, US-6, US-7, US-8]
blocked_by: [US-2]
related:
  - specs/EPIC-SEO-USLUGI/intake.md
  - specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md
  - team/adr/ADR-0019-uslugi-routing-resolver.md
  - seosite/strategy/03-uslugi-url-inventory.json
  - site/collections/Services.ts (sustained)
  - site/collections/Districts.ts (sustained)
  - site/collections/ServiceDistricts.ts (sustained)
created: 2026-05-08
updated: 2026-05-08
---

# US-3 SA-SEO — Payload расширение

## Бизнес-цель

Перевести URL inventory (US-1 deliverable) в реальные строки в Postgres + защитить namespace + дать гарантии anti-thin-content.

5 deliverables:
1. **Districts +23 city seed** → 30 total (sustained 7 + 23 new из inventory cities30)
2. **ServiceDistricts bulk-seed 150** (5 pillar × 30 city), все в `status: draft + noindexUntilCase: true`
3. **Namespace validate-hooks** на `Services.subServices[].slug` и `Districts.slug` (per ADR-0019 disjoint guard)
4. **`pnpm lint:slug` CI script** в `prebuild` — блокирует build при collision
5. **`uniquenessScore` beforeValidate hook** на ServiceDistricts (TF-IDF против шаблонного ядра, ≥60% gate для published)
6. **`reviewedBy` relationship на Services** (E-E-A-T leverage для T2/T3)

## Acceptance Criteria

| # | AC | Verify |
|---|---|---|
| 1 | Postgres `districts` table содержит 30 rows | `psql -c "SELECT COUNT(*) FROM districts WHERE _status='published';"` = 30 |
| 2 | Postgres `service_districts` table содержит 150 rows | `psql -c "SELECT COUNT(*) FROM service_districts;"` = 150 |
| 3 | Все 150 SD имеют `noindex_until_case = true` (sustained iron rule) | `psql -c "SELECT COUNT(*) FROM service_districts WHERE noindex_until_case = true;"` = 150 |
| 4 | Validate-hook на Services.subServices[].slug — пытаемся вставить subSlug = 'balashikha' → fail | unit test или manual через payload Local API |
| 5 | Validate-hook на Districts.slug — пытаемся вставить district.slug = 'pokos-travy' → fail | same |
| 6 | `pnpm lint:slug` exits 0 (нет collisions sustained) | `cd site && pnpm lint:slug` |
| 7 | `uniquenessScore` field присутствует в schema service_districts | `psql -c "\\d service_districts" \| grep uniqueness` |
| 8 | `reviewedBy` relationship на Services — sidebar field, optional | inspect Services.ts |
| 9 | Все sustained данные сохранены (existing 22 sub-services + 7 sustained districts + sustained services live) | regression check |
| 10 | Migrations applied и idempotent (down.sql работает) | `pnpm payload migrate` exit 0 |

## Контракт миграций

**Файлы (ровно по sustained pattern `site/migrations/`):**

1. `20260508_120000_uslugi_us3_namespace_disjoint.up.sql`:
   - НЕТ schema changes (validate-hooks работают на app level)
   - возможно индекс для performance: `CREATE INDEX IF NOT EXISTS idx_service_districts_slugs ON service_districts (district_id, service_id);`
2. `20260508_120000_uslugi_us3_namespace_disjoint.down.sql` — DROP index.
3. `20260508_120100_uslugi_us3_uniqueness_score.up.sql`:
   - `ALTER TABLE service_districts ADD COLUMN IF NOT EXISTS uniqueness_score numeric(5,2);` (already exists per ServiceDistricts.ts:281 — может быть NOOP)
4. `20260508_120200_uslugi_us3_services_reviewed_by.up.sql`:
   - `ALTER TABLE services ADD COLUMN IF NOT EXISTS reviewed_by_id integer REFERENCES authors(id) ON DELETE SET NULL;`
5. `*.down.sql` для каждого — drop column/constraint.
6. `*.ts` миграции (Payload pattern: drizzle migrate signature).

## Контракт collections-расширения

### Services.ts

**Новый sidebar field:**
```ts
{
  name: 'reviewedBy',
  type: 'relationship',
  relationTo: 'authors',
  hasMany: false,
  admin: {
    position: 'sidebar',
    description: 'Автор-эксперт, проверивший контент (E-E-A-T)',
  },
}
```

**Новый validate на subServices[].slug:**
```ts
validate: async (value, { req, data, operation }) => {
  if (!value) return true;
  if (!/^[a-z0-9-]+$/.test(value)) return 'Slug должен быть kebab-case (a-z, 0-9, -)';
  // ADR-0019 disjoint guard
  const collision = await req.payload.find({
    collection: 'districts',
    where: { slug: { equals: value } },
    limit: 1,
  });
  if (collision.docs.length > 0) {
    return `Slug "${value}" уже используется в Districts. Sub-service slugs должны быть disjoint от city slugs (ADR-0019).`;
  }
  return true;
}
```

### Districts.ts

**Зеркальный validate на slug:**
```ts
validate: async (value, { req, data, operation }) => {
  if (!value) return true;
  if (!/^[a-z0-9-]+$/.test(value)) return 'Slug должен быть kebab-case';
  // ADR-0019 disjoint guard — проверка против всех subServices.slug
  const allServices = await req.payload.find({
    collection: 'services',
    limit: 100,
    depth: 0,
  });
  for (const svc of allServices.docs) {
    if (Array.isArray(svc.subServices)) {
      for (const sub of svc.subServices) {
        if (sub.slug === value) {
          return `Slug "${value}" уже используется в Services.${svc.slug}.subServices. District slugs должны быть disjoint от sub-service slugs (ADR-0019).`;
        }
      }
    }
  }
  return true;
}
```

### ServiceDistricts.ts — `uniquenessScore` beforeValidate

```ts
hooks: {
  beforeValidate: [
    async ({ data, originalDoc, req }) => {
      // Compute uniqueness score for hero+leadParagraph against template baseline
      const templateBaseline = await loadTemplateBaseline(req.payload);
      const localText = [data?.leadParagraph, data?.localFaq?.map(f => f.q + ' ' + f.a).join(' ')].filter(Boolean).join(' ');
      if (!localText.trim()) {
        data.uniquenessScore = 0;
      } else {
        data.uniquenessScore = tfIdfUniqueness(localText, templateBaseline);
      }
      return data;
    },
  ],
}
```

`tfIdfUniqueness()` — вспомогательная функция в `site/lib/seo/uniqueness.ts` (новый файл): TF-IDF cosine similarity, return 100% × (1 - cosine).

## Контракт seed-scripts

### `site/scripts/seed-cities.ts`

Читает `seosite/strategy/03-uslugi-url-inventory.json` секцию `cities30`, для каждой city:
- Если `sustained: true` — skip (уже в БД)
- Иначе — payload.create({ collection: 'districts', data: {...} })

Polulate fields: `slug, nameNominative (= nominative), namePrepositional, nameDative (auto), nameGenitive (auto)`. Где declensions нет — заполняем placeholder, US-5 cw уточнит.

### `site/scripts/seed-sd-bulk.ts`

Для каждой комбинации (pillar, city) из 5×30=150:
- Если уже sustained ServiceDistrict с этим (service_id, district_id) — skip
- Иначе — payload.create({ collection: 'service-districts', data: { service: pillar.id, district: city.id, status: 'draft', noindexUntilCase: true } })

### `site/scripts/lint-slug.ts`

Standalone script, напрямую SQL через `pg` library:
```sql
SELECT s.slug AS sub_slug, d.slug AS city_slug
FROM services_subservices s
JOIN districts d ON s.slug = d.slug
LIMIT 10;
```

Если есть rows → exit 1 с error message + список collisions.
Иначе → exit 0.

Добавляется в `package.json`:
```json
"lint:slug": "tsx --env-file=.env.local scripts/lint-slug.ts",
"prebuild": "pnpm lint:slug"
```

## Out-of-scope US-3

- Реальный контент (hero/FAQ/cases) — это US-5
- T1/T2/T3/T4 page-template implementation — это US-4
- Lighthouse CI gate — это US-6
- Production deploy — это US-7

## Hand-off log

```
2026-05-08 · poseo: dispatch US-3
2026-05-08 · sa-seo: sa-seo.md US-3 готов, передача в panel/dba/seo-tech для реализации
```
