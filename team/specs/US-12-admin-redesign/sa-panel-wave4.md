# sa-panel — Wave 4 · Tabs field в 10 коллекциях

**Issue:** [PAN-3](https://linear.app/samohyn/issue/PAN-3)
**Wave:** 4 из roadmap [art-concept-v2.md §10](art-concept-v2.md)
**Source of truth:** [brand-guide.html §12.4](../../../design-system/brand-guide.html) · [art-concept-v2.md §5](art-concept-v2.md) · [ADR-0005](../../adr/ADR-0005-admin-customization-strategy.md)
**Status:** `approved` (popanel 2026-04-28, decisions ниже). Pending: cw labels + be-panel schema audit.
**Skills активированы:** `product-capability` (capability map per-collection), `hexagonal-architecture` (НЕ применяется здесь, но `architecture-decision-records` если выявится новый узел)
**Author:** sa-panel
**Date:** 2026-04-28

---

## ADR-0005 уровень кастомизации

| Подсистема | Уровень | Обоснование |
|---|---|---|
| Tabs field в `CollectionConfig` | **Уровень 3** (НЕ трогаем EditView core) | Используем native Payload `type: 'tabs'` — это schema-уровень, не override view. Native Payload рендерит tabs в EditView |
| Tabs styling (visual) | **Уровень 1** (CSS) — уже сделано Wave 1 | `site/app/(payload)/custom.scss:282-305` покрыл `.tabs-field__tab-button` states (hover, active, focus-visible). Wave 4 НЕ переписывает CSS |
| `:where()` обёртка для tabs-классов | **Уровень 1** (CSS, новое) | ADR-0005 §1.2 рекомендует — для Wave 4 critical, tabs селекторы могут смениться в minor 3.84+. Добавить в custom.scss |
| Validation errors → красная точка справа от label | **Уровень 1** (CSS) — расширение | Native Payload добавляет `.has-error` или `[aria-invalid]` на tab при validation failure. CSS правило `.tabs-field__tab-button.has-error::after { content: '•'; color: red; }` |
| Tabs labels + admin.description audit | **cw scope** — content audit | Тон: серьёзный без казёнщины ([CLAUDE.md TOV](../../../../CLAUDE.md)) |

---

## Scope IN

### 4.1 · Tabs field в 10 коллекциях

**Maпинг tabs** (от popanel + утверждено мной как sa-panel, **финальный mapping** требует be-panel валидации с реальной schema коллекций):

| # | Коллекция | Файл | Tabs (label) | Что в tab |
|---|---|---|---|---|
| 1 | **Services** | `site/collections/Services.ts` | Основные / Контент / SEO / Sub-services / FAQ / Превью | name, slug, price, h1 / description, blocks, content, photos / metaTitle, metaDescription, og, twitter / subServices array / faq array / preview meta |
| 2 | **SiteChrome** (global) | `site/globals/SiteChrome.ts` | Header / Footer / SEO defaults / Tracking / Robots | header navigation + logo / footer links + contacts / default meta + og defaults / GTM, Yandex Metrika IDs / robots.txt + sitemap |
| 3 | **Districts** | `site/collections/Districts.ts` | Основные / Контент / SEO / Stats | name, slug, region / description, blocks / meta / population, area, distance |
| 4 | **Cases** | `site/collections/Cases.ts` | Основные / Контент / Медиа / SEO | title, slug, service, district, date, status / blocks / photos, video / meta |
| 5 | **Blog** | `site/collections/Blog.ts` | Основные / Контент / SEO / Author | title, slug, publishedAt, status / blocks / meta / author relation |
| 6 | **B2BPages** | `site/collections/B2BPages.ts` | Основные / Сегменты / SEO | title, slug, hero / segments array (УК / ТСЖ / FM / etc.) / meta |
| 7 | **Authors** | `site/collections/Authors.ts` | Профиль / Bio / SEO | name, slug, photo, role / bio (rich text), expertise / meta |
| 8 | **ServiceDistricts** | `site/collections/ServiceDistricts.ts` | Основные / Контент / SEO | service, district, computedTitle / blocks / meta |
| 9 | **Leads** | `site/collections/Leads.ts` | Контакт / Detail / Status / Internal | phone, email, name / service, district, message, photos / status, assignedTo / internalNotes (admin-only) |
| 10 | **Media** | `site/collections/Media.ts` | Основные / Метаданные | url, alt, width, height / mimeType, filesize, focalPoint |

**Pre-step для be-panel:** прочитать каждую `CollectionConfig`, валидировать что mapping выше соответствует реальным fields. Если field не вписывается в tab — обсудить со sa-panel (open question в спеке).

### 4.2 · Tabs field syntax

Payload 3.83 синтаксис:

```typescript
import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  // ...
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основные',
          description: 'Базовые поля: название, slug, цена.',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true, unique: true },
            { name: 'price', type: 'number', required: true },
            // ...
          ],
        },
        {
          label: 'Контент',
          description: 'Описание услуги для посетителей сайта.',
          fields: [
            { name: 'description', type: 'textarea' },
            { name: 'blocks', type: 'blocks', blocks: [/* ... */] },
            { name: 'photos', type: 'array', fields: [{ name: 'photo', type: 'upload', relationTo: 'media' }] },
          ],
        },
        {
          label: 'SEO',
          description: 'Meta tags для search engines и социальных сетей.',
          fields: [
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
            { name: 'og', type: 'group', fields: [/* ... */] },
          ],
        },
        // ...остальные tabs
      ],
    },
    // Поля ВНЕ tabs (например _status — Payload-системный):
    // ...
  ],
  // ...
};
```

**Сохранение существующих fields:** все текущие поля коллекции **переезжают внутрь tabs** без изменения `name` / `type` / `required` / `unique`. Storage layer не меняется (Payload Tabs — UI-only concept).

**TypeScript types:** Payload пересоберёт `payload-types.ts` через `pnpm payload generate:types` после schema-changes. `be-panel` запускает в pre-commit.

### 4.3 · Migrations

**Schema migration НУЖНА?** — Технически нет (Tabs не меняет SQL schema). Но Payload требует regenerate types + pгенерация миграции (даже если no-op):

```bash
pnpm payload migrate:create --name=wave4-tabs-in-collections
```

Result — пустая миграция (sufficient — Payload зафиксирует версию schema). Применяется автоматически при deploy.

**Risk:** на проде migration apply занимает <1 сек (no-op SQL). Но если be-panel при добавлении tabs **переименует** поле (e.g. `inn` → `legalInn`) — это потребует **data migration**. Должен быть **ZERO field renames** в Wave 4.

### 4.4 · `cw` scope — labels + admin.description audit

**Labels (для каждого tab):**
- Использовать заглавную первую букву (Capitalize), русский
- Без emoji / iconography в label (anti-pattern из brand-guide §12 anti-patterns)
- Пример: `Основные`, не `🏠 Основные`

**`admin.description` audit:**
Для **каждого field** во всех 10 коллекциях проверить:
1. Есть ли `admin.description`? Если нет — добавить (≤140 символов)
2. Тон: серьёзный без казёнщины ([contex/03_brand_naming.md](../../../contex/03_brand_naming.md))
3. Объясняет НЕ что это поле, а **зачем** — полезно для оператора

**Пример good vs bad:**
```typescript
// BAD
{ name: 'price', type: 'number', admin: { description: 'Цена услуги' } }

// GOOD
{ name: 'price', type: 'number', admin: { description: 'Базовая цена за объект (фикс). Для пары районов — индивидуальная фокус-цена в Sub-services.' } }
```

Audit deliverable: `team/specs/US-12-admin-redesign/cw-tabs-audit.md` — таблица 10 коллекций × все fields × current description × proposed description.

### 4.5 · `:where()` обёртка для tabs-классов (custom.scss)

ADR-0005 §1.2 — критично для Wave 4. Текущий `custom.scss:285-305` использует прямые селекторы:

```scss
.payload__app .tabs-field__tab-button { /* ... */ }
.payload__app .tabs-field__tab-button:hover { /* ... */ }
```

**Заменить на:**

```scss
.payload__app :where(.tabs-field__tab-button, [class*="tabs-field"][class*="tab-button"]) {
  /* base + transition */
}
.payload__app :where(.tabs-field__tab-button, [class*="tabs-field"][class*="tab-button"]):hover {
  /* hover */
}
```

**Why:** если Payload в minor bump'е переименует `.tabs-field__tab-button` → `.field-tabs__button`, наша обёртка через `[class*="tabs-field"][class*="tab-button"]` всё равно поймает (substring match). При major bump — fallback падает, и `cr-panel` ловит через CI smoke.

### 4.6 · Validation error indicator

Native Payload добавляет `aria-invalid="true"` или `.has-error` на tab при validation failure. CSS:

```scss
.payload__app :where(.tabs-field__tab-button.has-error, .tabs-field__tab-button[aria-invalid="true"])::after {
  content: '•';
  color: var(--brand-obihod-danger);
  margin-left: 6px;
  font-weight: 700;
}
```

---

## Scope OUT

- **Conditional tabs** (показывать tab только при определённом значении другого поля) — out of scope, Payload поддерживает через `admin.condition` на field level, но в Wave 4 не делаем
- **Drag-to-reorder tabs** — Payload не поддерживает natively, оператору не нужно
- **Tab badges** (counters в tab labels) — out of scope, отдельная US если запросит
- **Mobile tabs UX** — Wave 6 mobile responsive
- **Custom tab field types** — не нужно, native достаточно

---

## Architecture

Никаких REST endpoints, никаких custom React components. Только schema-changes в `CollectionConfig` × 10.

**Diff structure:**
```
site/collections/Services.ts      → fields[] оборачиваем в [{ type: 'tabs', tabs: [...] }]
site/collections/Districts.ts     → ditto
site/collections/Cases.ts         → ditto
site/collections/Blog.ts          → ditto
site/collections/B2BPages.ts      → ditto
site/collections/Authors.ts       → ditto
site/collections/ServiceDistricts.ts → ditto
site/collections/Leads.ts         → ditto
site/collections/Media.ts         → ditto
site/globals/SiteChrome.ts        → ditto

site/migrations/<timestamp>-wave4-tabs-in-collections.ts → no-op
site/payload-types.ts             → регенерируется через `pnpm payload generate:types`

site/app/(payload)/custom.scss    → :where() обёртка для tabs-классов + has-error indicator
```

---

## Acceptance Criteria

- [ ] `sa-panel-wave4.md` одобрен `popanel`
- [ ] `cw-tabs-audit.md` написан `cw`'ом + одобрен `popanel`
- [ ] **be-panel валидация mapping:** для каждой коллекции в схеме нет полей вне tabs (или тщательно zaфиксировано в спеке `Out of tabs:` блоке)
- [ ] **Schema changes:**
  - [ ] 10 коллекций имеют Tabs field
  - [ ] Zero field renames (только перенос внутрь tabs)
  - [ ] `pnpm payload generate:types` зелёный
  - [ ] `pnpm tsc --noEmit` зелёный (no breaking changes в payload-types.ts consumers)
  - [ ] Миграция создана (`payload migrate:create`) — no-op на SQL
- [ ] **Labels:**
  - [ ] Все tabs labels на русском, capitalize
  - [ ] Tone: серьёзный без казёнщины (cw audit)
- [ ] **admin.description audit:**
  - [ ] Все fields во всех 10 коллекциях имеют `admin.description`
  - [ ] Тон: «зачем», не «что»
  - [ ] ≤140 символов на description
- [ ] **CSS protection:**
  - [ ] `:where()` обёртка для `.tabs-field__tab-button` в custom.scss
  - [ ] `.has-error::after` indicator
  - [ ] No `!important` без `// reason: ...` комментария
- [ ] **ADR-0005 follow-ups:**
  - [ ] Уровень 3 (НЕ трогаем EditView core) подтверждён
  - [ ] `:where()` для нестабильных Payload-классов
  - [ ] Comment-anchors на §brand-guide.html §12.4
- [ ] **Visual ревью `ux-panel`** vs §12.4 mockup
- [ ] **`cr-panel` approve** — особенно migration safety + zero field renames
- [ ] **Playwright smoke** (Wave 7):
  - [ ] Открытие edit-view каждой из 10 коллекций — tabs visible
  - [ ] Click на tab — content swap
  - [ ] Validation error → красная точка на label
  - [ ] keyboard navigation (Tab + Arrow keys) работает
- [ ] **Manual QA по `qa-panel`:**
  - [ ] Все 10 коллекций edit-view проходят smoke (открыть, отредактировать, сохранить)
  - [ ] Существующие записи (production data) открываются без data-loss
  - [ ] reduced-motion отключает tab transition

---

## Resolved by popanel 2026-04-28

| Q | Решение | Действие в spec |
|---|---|---|
| Q1 Системные fields | ✅ **Вне tabs** (_status, createdAt, updatedAt — Payload native сайдбар) | §4.1 уточнено |
| Q2 SeoSettings global | ✅ **Skip Wave 4** (≤10 fields, flat достаточно) | §4.1 mapping без SeoSettings (10 → 9 коллекций для tabs, плюс SiteChrome global = 10 total) |
| Q3 Sub-services | ✅ Keep как **array tab внутри Services**. Если вырастет — отдельная US | §4.1 mapping unchanged |
| Q4 cw audit timing | ✅ **Parallel** с be-panel | Dev breakdown — cw + be-panel параллельно |

---

## Dev breakdown

| Task | Owner | Объём |
|---|---|---|
| `cw-tabs-audit.md` (10 коллекций × все fields) | `cw` | 0.5 чд |
| Schema changes 10 коллекций (`type: 'tabs'`) | `be-panel` | 0.5 чд |
| Payload migration (no-op) + types regen | `be-panel` + `dba` | 0.1 чд |
| `:where()` обёртка + `has-error` CSS | `fe-panel` | 0.1 чд |
| TypeScript validation (`tsc --noEmit`) — fix consumers если что-то упало | `be-panel` | 0.1 чд |
| Manual edit-view smoke 10 коллекций | `qa-panel` | 0.2 чд |
| Playwright admin tabs spec | `qa-panel` | 0.2 чд |

**Итого:** ~1.7 чд (изначально 1.5 чд — близко).

---

## Pinging

- `popanel` — Q1/Q2/Q3/Q4 approve
- `be-panel` — pre-flight: validate mapping vs реальные `CollectionConfig`. Если выявятся discrepancies — open question в комментарии PAN-3
- `cw` — kickoff `cw-tabs-audit.md` параллельно
