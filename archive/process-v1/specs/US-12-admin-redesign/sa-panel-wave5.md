# sa-panel — Wave 5 · EmptyState / ErrorState / SkeletonTable финал

**Issue:** [PAN-4](https://linear.app/samohyn/issue/PAN-4)
**Wave:** 5 из roadmap [art-concept-v2.md §10](art-concept-v2.md)
**Source of truth:** [brand-guide.html §12.5](../../../design-system/brand-guide.html) + [§12.6](../../../design-system/brand-guide.html) · [art-concept-v2.md §7](art-concept-v2.md) · [ADR-0005](../../adr/ADR-0005-admin-customization-strategy.md)
**Status:** `approved` (popanel 2026-04-28, decisions ниже). Pending: cw empty texts.
**Skills активированы:** `product-capability` (capability map states per-collection)
**Author:** sa-panel
**Date:** 2026-04-28

---

## Контекст текущего состояния

В `site/components/admin/EmptyErrorStates.tsx` уже есть **Wave 1 partial implementation** (OBI-31 partial):
- ✅ `EmptyState` — wrapper component с eyebrow + title + text + actions[]
- ✅ `ErrorState` — то же + eyebrow с error code
- ✅ `ForbiddenState` — для 403
- ✅ Дизайн-токены через `--brand-obihod-*`
- ✅ Tone — matter-of-fact (без «Упс! / Что-то пошло не так»)

**Что НЕ сделано Wave 1 (in scope Wave 5):**
1. ❌ Подключение к Payload через `admin.components.providers` / `notFound.tsx` / `forbidden.tsx`
2. ❌ Per-collection EmptyState (10 коллекций × empty texts от cw)
3. ❌ `SkeletonTable` для list-view loading
4. ❌ `SkeletonForm` для edit-view loading
5. ❌ `app/(payload)/admin/error.tsx` (500 boundary)
6. ❌ `app/(payload)/admin/forbidden.tsx` (403)
7. ❌ Network error toast + retry button в list-view

## ADR-0005 уровень кастомизации

| Подсистема | Уровень | Обоснование |
|---|---|---|
| `EmptyState` / `ErrorState` / `ForbiddenState` (existing) | **Уровень 2** (React components) | Уже сделано Wave 1, расширяем |
| `SkeletonTable` / `SkeletonForm` (new) | **Уровень 2** (React components) | Новые компоненты, в `site/components/admin/` |
| Per-collection EmptyState через `admin.components.views.list.Empty` | **Уровень 2** (React, per-collection) | Payload 3.83 API позволяет per-collection custom views |
| Global 500 / 403 boundaries | **Уровень 2** (Next.js Route Segments) | `app/(payload)/error.tsx` и `app/(payload)/forbidden.tsx` — native Next.js error handling |
| Network error toast | **Уровень 2** (React + browser API) | `react-hot-toast` или native + `aria-live` |

---

## Scope IN

### 5.1 · Per-collection EmptyState (10 коллекций)

**Mechanism:** Payload 3.83 `admin.components.views.list.Empty` per-collection.

**В каждой `CollectionConfig`:**

```typescript
import { CasesEmpty } from '@/components/admin/empty/CasesEmpty';

export const Cases: CollectionConfig = {
  slug: 'cases',
  // ...
  admin: {
    // ...
    components: {
      views: {
        list: {
          Empty: '@/components/admin/empty/CasesEmpty',
        },
      },
    },
  },
};
```

**Tone (от cw):**

| Коллекция | Empty text (предложение sa-panel, cw финализирует) | CTA |
|---|---|---|
| Services | «Услуг пока нет. Создай первую — это основа сайта.» | «Создать услугу» → `/admin/collections/services/create` |
| Districts | «Районов пока нет. Добавь первый — без него не будет programmatic SD.» | «Создать район» |
| ServiceDistricts | «SD ещё не сгенерированы. Они создаются автоматически из Services × Districts при публикации обоих.» | «Открыть Услуги» |
| Cases | «Кейсов пока нет. Опубликуй первый — это лучшее social proof.» | «Создать кейс» |
| Blog | «Статей пока нет. Первая статья — половина контент-стратегии.» | «Написать статью» |
| B2BPages | «B2B-страниц пока нет. Создай по одной на сегмент: УК, ТСЖ, FM.» | «Создать B2B» |
| Authors | «Авторов пока нет. Добавь себя — каждая статья нуждается в авторе.» | «Создать автора» |
| Persons | «Сотрудников пока нет.» | «Добавить сотрудника» |
| **Leads** | «Все заявки обработаны. Хорошая работа.» | (без CTA — позитивный empty) |
| Media | «Файлов пока нет. Загрузи фото объектов — они нужны для кейсов и сайта.» | «Загрузить» |
| Redirects | «Редиректов нет. Они нужны при переименовании URL.» | «Создать редирект» |
| Users | «Пользователей пока нет.» | «Создать пользователя» |

**`Leads` empty — особый case:** позитивный текст, не «нет ничего грустного». Оператор будет здесь много раз — нужна положительная эмоция.

### 5.2 · `SkeletonTable` (новый компонент)

**Назначение:** показывается во время загрузки list-view (Suspense fallback или SWR loading state).

**Anatomy:**
- Header с placeholder для column titles (5-7 колонок)
- 8 строк skeleton-rows с разной шириной (для realism)
- Пульсирующая анимация (`@keyframes pulse`)
- `@media (prefers-reduced-motion: reduce)` отключает pulse → статичный gray fill

**API:**
```typescript
interface SkeletonTableProps {
  columns?: number;       // default 5
  rows?: number;          // default 8
  hasIcon?: boolean;      // default false
}

export const SkeletonTable: FC<SkeletonTableProps> = ({ columns = 5, rows = 8, hasIcon = false }) => {
  // ...
};
```

**Использование:**
- `Suspense fallback={<SkeletonTable />}` оборачивая server components в list views
- Per-collection через `admin.components.views.list.Loading: '@/components/admin/SkeletonTable'`

### 5.3 · `SkeletonForm` (новый компонент)

**Назначение:** edit-view loading.

**Anatomy:**
- 5 placeholder-fields разной высоты (label + input bar)
- Одна tabs-row placeholder сверху (если коллекция использует tabs из Wave 4)
- Pulse animation + reduced-motion fallback

### 5.4 · Global Error Boundary (`app/(payload)/error.tsx`)

```typescript
// site/app/(payload)/error.tsx
'use client';
import { ErrorState } from '@/components/admin/EmptyErrorStates';

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      eyebrow="500 · server error"
      title="Что-то пошло не так на сервере"
      text={
        <>
          Мы получили уведомление и разбираемся. Попробуй обновить страницу через минуту.
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ /* monospace error details */ }}>{error.message}</pre>
          )}
        </>
      }
      actions={[
        { label: 'Попробовать ещё раз', onClick: reset, variant: 'primary' },
        { label: 'На главную', href: '/admin', variant: 'secondary' },
      ]}
    />
  );
}
```

**Integration with Sentry** (если оператор включит Sentry):
- `useEffect(() => { Sentry.captureException(error); }, [error]);`
- Eyebrow показывает `event_id` если Sentry response received

### 5.5 · `forbidden.tsx` boundary

```typescript
// site/app/(payload)/forbidden.tsx
import { ForbiddenState } from '@/components/admin/EmptyErrorStates';

export default function AdminForbidden() {
  return (
    <ForbiddenState
      eyebrow="403 · access"
      title="Нет доступа"
      text="У этого аккаунта нет прав на эту страницу. Если думаешь, что это ошибка — напиши Георгию."
      actions={[{ label: 'Назад в админку', href: '/admin', variant: 'primary' }]}
    />
  );
}
```

### 5.6 · `not-found.tsx` boundary (бонус, минимум)

```typescript
// site/app/(payload)/not-found.tsx
import { EmptyState } from '@/components/admin/EmptyErrorStates';

export default function AdminNotFound() {
  return (
    <EmptyState
      eyebrow="404 · not found"
      title="Страница не найдена"
      text="Возможно, запись удалили или URL неправильный."
      actions={[{ label: 'Назад в админку', href: '/admin' }]}
    />
  );
}
```

### 5.7 · Network error toast (low priority, может быть Wave 7)

**Уведомление при temporary network error в list view:**
- Toast снизу справа (не через `react-hot-toast` — добавляет dep; через native + `aria-live`)
- «Не удалось обновить список. [Попробовать ещё раз]»
- `aria-live="assertive"` для accessibility
- Auto-dismiss через 8 сек

**Decision (open для popanel):** включаем в Wave 5 или откладываем в Wave 7? Я заложил в Wave 5 как nice-to-have.

---

## Scope OUT

- **i18n для error texts** — только русский, английский fallback. Out of scope (Payload native `@payloadcms/translations` ru покрывает).
- **Custom illustrations** для empty states — пока без иллюстраций (текст + CTA). Иллюстрации — Wave 7 polish или отдельная UX US.
- **Animated empty state** (e.g. lottie) — out of scope, anti-pattern (admin = инструмент, не лендинг).
- **Per-action error boundaries** (e.g. при click «Сохранить» + ошибка) — Payload native обрабатывает через field-level errors, не нужен custom.
- **Maintenance mode page** (когда `do` делает deploy) — отдельная US для `do`.

---

## Architecture

```
site/components/admin/EmptyErrorStates.tsx (existing, расширить)
    ├── EmptyState (export)
    ├── ErrorState (export)
    └── ForbiddenState (export)

site/components/admin/empty/ (новая папка — per-collection empties)
    ├── ServicesEmpty.tsx
    ├── CasesEmpty.tsx
    ├── BlogEmpty.tsx
    ├── LeadsEmpty.tsx
    └── ... × 12 collections

site/components/admin/Skeletons.tsx (новый файл)
    ├── SkeletonTable (export)
    └── SkeletonForm (export)

site/app/(payload)/error.tsx (новый — Next.js Route Segment)
site/app/(payload)/forbidden.tsx (новый)
site/app/(payload)/not-found.tsx (новый)

site/collections/*.ts (×12) — добавить admin.components.views.list.Empty
site/payload.config.ts — без изменений (per-collection в каждой схеме)
site/app/(payload)/custom.scss — pulse animation для skeletons (с reduced-motion guard)
```

**SCSS extension:**

```scss
/* Skeleton pulse animation (Wave 5) */
@keyframes brand-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.payload__app .brand-skeleton {
  background-color: var(--brand-obihod-paper-warm);
  border-radius: var(--brand-obihod-radius-sm);
  animation: brand-skeleton-pulse 1.4s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .payload__app .brand-skeleton {
    animation: none;
    opacity: 0.8;
  }
}
```

---

## Acceptance Criteria

- [ ] `sa-panel-wave5.md` одобрен `popanel`
- [ ] AC из Linear PAN-4 (6 пунктов)
- [ ] **Per-collection EmptyState (12 коллекций):**
  - [ ] cw финализировал texts для всех 12
  - [ ] `site/components/admin/empty/<Name>Empty.tsx` × 12
  - [ ] Подключены через `admin.components.views.list.Empty` в каждой `CollectionConfig`
  - [ ] **Leads empty positive tone**
- [ ] **Skeletons:**
  - [ ] `SkeletonTable` работает
  - [ ] `SkeletonForm` работает
  - [ ] `prefers-reduced-motion: reduce` отключает pulse
  - [ ] Подключены к Payload через `admin.components.views.list.Loading`
- [ ] **Error boundaries:**
  - [ ] `app/(payload)/error.tsx` с retry button
  - [ ] `app/(payload)/forbidden.tsx`
  - [ ] `app/(payload)/not-found.tsx`
- [ ] **Visual ревью `ux-panel`** vs §12.5 + §12.6 mockups
- [ ] **`cr-panel` approve**
- [ ] **A11y WCAG 2.2 AA:**
  - [ ] `EmptyState` / `ErrorState` / `ForbiddenState` имеют semantic HTML (`<section role="region" aria-label>`)
  - [ ] CTA buttons имеют focus-visible
  - [ ] Skeleton имеет `role="status"` + `aria-label="Загрузка"`
  - [ ] Toast (если делаем) имеет `aria-live="assertive"`
- [ ] **ADR-0005 follow-ups:**
  - [ ] Уровень 2 React для всех components
  - [ ] No `!important` без `// reason: ...`
  - [ ] TypeScript types из `payload`, не из `@payloadcms/ui`
- [ ] **Playwright smoke** (Wave 7):
  - [ ] Открыть пустую коллекцию (например Cases без records) → empty text + CTA
  - [ ] Открыть коллекцию с filters не дающими результатов → empty (отличаем от no-data initial state)
  - [ ] Trigger 500 (e.g. через mock middleware) → 500 page с retry
  - [ ] Trigger 403 (test user без прав) → 403 page

---

## Resolved by popanel 2026-04-28

| Q | Решение | Действие в spec |
|---|---|---|
| Q1 Network error toast | ❌ **Drop в Wave 7** (не critical, экономит 0.2 чд) | §5.7 удалён из Wave 5 scope, перенесён в Wave 7 |
| Q2 Sentry conditional integration | ✅ **APPROVE** wrapped в `if (window.Sentry)` | §5.4 — `error.tsx` включает Sentry guard |
| Q3 Generic vs per-collection | ✅ **Generic + Leads override** (2 файла вместо 12) | §5.1 переписан ниже на generic |
| Q4 `not-found.tsx` | ✅ APPROVE add (0.05 чд бонус) | §5.6 в scope |

### §5.1 (rewrite per Q3) · Generic `EmptyCollection` + Leads override

Вместо 12 per-collection файлов — **1 generic + 1 Leads override** (decision Q3).

**`site/components/admin/empty/EmptyCollection.tsx`** (generic, 1 файл):

```typescript
import type { FC } from 'react';
import { EmptyState } from '../EmptyErrorStates';

interface EmptyCollectionProps {
  collectionLabel: string;        // e.g. «Услуг», «Кейсов»
  ctaLabel: string;               // e.g. «Создать услугу»
  ctaHref: string;                // e.g. «/admin/collections/services/create»
  description?: string;           // override default text
}

export const EmptyCollection: FC<EmptyCollectionProps> = ({
  collectionLabel,
  ctaLabel,
  ctaHref,
  description,
}) => (
  <EmptyState
    title={`${collectionLabel} пока нет`}
    text={description ?? `Создай первую запись — она появится здесь и в каталоге сайта.`}
    actions={[{ label: ctaLabel, href: ctaHref, variant: 'primary' }]}
  />
);
```

**Подключение per-collection** — через factory pattern в каждой `CollectionConfig`:

```typescript
// site/collections/Services.ts
admin: {
  components: {
    views: {
      list: {
        Empty: '@/components/admin/empty/ServicesEmpty',  // тонкий wrapper
      },
    },
  },
};
```

```typescript
// site/components/admin/empty/ServicesEmpty.tsx (тонкий wrapper)
import { EmptyCollection } from './EmptyCollection';
export default () => (
  <EmptyCollection
    collectionLabel="Услуг"
    ctaLabel="Создать услугу"
    ctaHref="/admin/collections/services/create"
    description="Создай первую — это основа сайта."
  />
);
```

Все 11 wrapper'ов — по 5 строк каждый, легко поддерживать.

**Leads override** (особый positive tone, decision Q3):

```typescript
// site/components/admin/empty/LeadsEmpty.tsx (override)
import { EmptyState } from '../EmptyErrorStates';
export default () => (
  <EmptyState
    title="Все заявки обработаны"
    text="Хорошая работа. Новые появятся здесь как только клиенты заполнят форму."
  />
);
```

Без CTA — это позитивный empty.

---

## Dev breakdown

(Зависит от ответа Q3)

### Если Q3 = generic (recommended):

| Task | Owner | Объём |
|---|---|---|
| `cw` финализирует empty texts (12 → 1 generic + Leads особый) | `cw` | 0.2 чд |
| Generic `EmptyCollection.tsx` + Leads override | `fe-panel` | 0.2 чд |
| `SkeletonTable` + `SkeletonForm` | `fe-panel` | 0.2 чд |
| ~~12 коллекций — `admin.components.views.list.Empty/Loading`~~ | ~~`be-panel`~~ | ~~0.2 чд~~ — **отменено по [ADR-0010](../../team/adr/ADR-0010-payload-views-list-customization.md)** (Payload 3.84 не имеет `views.list.Empty/Loading` API; компоненты остаются как public exports для catalog page + boundaries) |
| `error.tsx` + `forbidden.tsx` + `not-found.tsx` | `fe-panel` | 0.2 чд |
| custom.scss pulse animation + reduced-motion | `fe-panel` | 0.05 чд |
| Toast (если Q1 = «in Wave 5») | `fe-panel` | 0.2 чд (опционально) |
| Playwright smoke states | `qa-panel` | 0.2 чд |

**Итого:** ~1.3 чд (без toast) или ~1.5 чд (с toast). Изначально 1 чд занижено.

### Если Q3 = per-collection (12 файлов):

+0.4 чд на 12 файлов вместо 1 + override.

---

## Pinging

- `popanel` — Q1/Q2/Q3/Q4 approve
- `cw` — финализировать empty texts (parallel start с popanel approve)

---

## ADR-0010 closure notice (2026-04-30)

W5 part 2 (per-collection registration) **закрыт без подключения** по [ADR-0010](../../team/adr/ADR-0010-payload-views-list-customization.md).

**Root cause:** проверка `node_modules/payload/dist/collections/config/types.d.ts:342-351` показала что `admin.components.views.list` имеет только `actions` + `Component`. `Empty`/`Loading` не существуют в Payload 3.84 API. Spec §5.1 (rewrite per Q3) ассумировал несуществующий API — это та же категория ошибки как `views.login` v1 (см. ADR-0007 lessons).

**Решение по ADR-0010 — Альтернатива 4 (skip registration):**
- `EmptyCollection` + `ServicesEmpty/CasesEmpty/BlogEmpty/LeadsEmpty` остаются как public exports в `site/components/admin/empty/`
- Компоненты используются в `/admin/catalog` (через PageCatalog), `error.tsx`, `forbidden.tsx`, `not-found.tsx` (уже подключены)
- Native list-views оператора показывают native «Документы не найдены» (acceptable degradation; visual inconsistency между custom routes и native list-views — задокументирована)
- `SkeletonTable/Form` также остаются public exports — для будущих custom routes / Mobile views (W6)

**Если оператор требует брендовый EmptyState в нативных list-views** — отдельная US с ADR-0011 для Альтернативы 1 (full list view override через `views.list.Component` × 11 collections, ~700 строк per collection, high regression risk).
- `qa-panel` — pre-flight: проверить какие коллекции реально пустые на проде сейчас (для smoke testing fixtures)
