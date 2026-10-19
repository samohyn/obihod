---
us: PANEL-EMPTY-LIST-WIRING
title: EmptyState wiring в list-view коллекций (Cases / Blog / Authors / B2BPages)
team: panel
po: popanel
type: feature
priority: P1
segment: admin
phase: spec
role: sa-panel
status: spec-draft
blocks: []
blocked_by: [PANEL-UX-AUDIT]
related: [PANEL-UX-AUDIT, US-12-W5, ADR-0010]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [design-system, frontend-patterns]
---

# sa-panel — PANEL-EMPTY-LIST-WIRING

## Skill activation (фиксация)

- `design-system` — brand-guide §12.6 (EmptyState mockup line 3192) — eyebrow + heading + text + 1-2 CTA.
- `frontend-patterns` — Payload custom view wrapper pattern, conditional rendering, preserve native UX surface.

## Контекст

W5 (`OBI-31` / Wave 5) поставил `site/components/admin/EmptyErrorStates.tsx` как **standalone exports**: `EmptyState / ErrorState / ForbiddenState`. Компоненты используют brand-токены (`--brand-obihod-*`), font-family, доступны для импорта в любом Payload context.

**Не сделано в W5**: wiring в конкретные коллекции через `admin.components.views.list`. На пустых list-view оператор видит дефолтный Payload-table (header + no-rows hint).

**ADR-0010** — Payload 3.84 не имеет публичного `views.list.Empty` slot. Обходим через **custom view component**, который:
1. Получает все props default ListView (через Payload `DefaultListView` import).
2. Загружает `docs.length` (через server-side query или client-state из `useListQuery` если доступно в 3.84).
3. Если `docs.length === 0 && !hasFilters` — рендерит `<EmptyState />`.
4. Иначе — рендерит native `<DefaultListView />` (preserve sort / filter / pagination / bulk-actions).

## Acceptance Criteria

### AC1 · Custom List view component (fe-panel)

- [ ] Новый компонент `site/components/admin/CollectionListWithEmpty.tsx`:

```tsx
'use client'
import { DefaultListView } from '@payloadcms/ui'
import { EmptyState } from './EmptyErrorStates'

interface Props {
  // Payload native list-view props (typed через @payloadcms/ui)
  collectionSlug: string
  emptyConfig: { title: string; text: string; actionLabel: string; actionHref: string }
}

export const CollectionListWithEmpty: FC<Props> = ({ collectionSlug, emptyConfig, ...rest }) => {
  // Получаем список через server query (Payload Local API в RSC) или client hook
  // Если docs.length === 0 && нет активных filters → EmptyState
  // Иначе → DefaultListView
}
```

- [ ] **Preserve UX**: при docs > 0 native list (sort / filter / pagination / bulk-select / search) работает идентично main.
- [ ] **Filtered empty != global empty**: `?where[status][equals]=draft` → если result пустой, но global docs > 0 → показываем native «no results» (НЕ наш EmptyState).
- [ ] Component **RSC-friendly** (Payload server components в 3.84) или **Client component** с suspense — выбор по research-итерации первой коллекции (Cases).

### AC2 · Wiring в коллекции (be-panel)

- [ ] **Cases** (`site/collections/Cases.ts` — найти `admin` config):
```ts
admin: {
  components: {
    views: {
      list: {
        Component: 'site/components/admin/CollectionListWithEmpty#default',
        clientProps: {
          emptyConfig: {
            title: 'Кейсов пока нет',
            text: 'Добавьте первый кейс — он появится в портфолио сайта и в SEO landing-pages.',
            actionLabel: '+ Добавить кейс',
            actionHref: '/admin/collections/cases/create',
          },
        },
      },
    },
  },
}
```

- [ ] **Blog** — копия pattern, copy:
  - title: «Постов пока нет»
  - text: «Первый пост запустит SEO-страницу `/blog/`. Можно использовать конструктор автозаполнения от seo-content.»
  - actionLabel: «+ Написать пост»

- [ ] **Authors** (если в scope) — title: «Авторов пока нет», text: «Авторы привязываются к постам блога и кейсам.», actionLabel: «+ Добавить автора»
- [ ] **B2BPages** (если в scope) — title: «B2B-страниц пока нет», text: «Лендинги для УК / ТСЖ / FM / застройщиков.», actionLabel: «+ Создать страницу»

### AC3 · Brand-guide compliance (ux-panel + qa-panel)

- [ ] Visual: §12.6 EmptyState mockup line 3192 — eyebrow (skip для empty, только для error), heading 20px/600, text 14px/1.5, CTA primary button.
- [ ] FolderIcon уже встроен в `EmptyState` (W5).
- [ ] TOV: matter-of-fact, без «Упс! Здесь пока пусто 😞». Используется existing copy из `EmptyErrorStates.tsx:211-212` как baseline.
- [ ] CTA label всегда начинается с `+ ` (visual hint creation action).

### AC4 · Tests + Evidence (qa-panel + leadqa)

- [ ] Playwright e2e (`site/tests/e2e/admin-empty-states.spec.ts`):
  - login → `/admin/collections/cases/` (assumption: dev DB seed имеет Cases) — `<DefaultListView>` rendered, empty-state hidden.
  - **Test prep**: создать пустую коллекцию через temporary deletion в beforeAll OR использовать `Authors` если empty seed.
  - Если коллекция пустая → EmptyState rendered, button «+ Добавить» visible, `href` === create route.
  - Click button → navigates to `/admin/collections/<slug>/create`.
- [ ] axe-core 0 violations на empty list-view.
- [ ] Screenshots: `screen/panel-empty-cases.png`, `screen/panel-empty-blog.png`.

### AC5 · Scope guard

- [ ] **In scope (P1)**: Cases, Blog.
- [ ] **Optional (если effort < 0.7 чд lim)**: Authors, B2BPages.
- [ ] **Out-of-scope**: Services / Districts / LandingPages / Leads / Prices / FAQ / SiteChrome / SeoSettings (имеют seed-данные с первого деплоя, не empty в production).

## §-mapping (brand-guide.html)

- **§12.6 EmptyState mockup line 3188-3220** — точный визуальный шаблон.
- **§12.4 Buttons** — primary CTA «+ Добавить ...».
- **§13 TOV** — copy без «Упс/К сожалению».
- **§9 Icons** — FolderIcon (уже в `EmptyErrorStates.tsx`).

## Sub-tasks (decomposition)

| # | Кто | Что | Effort |
|---|---|---|---|
| 1 | sa-panel | spec + custom-view pattern research | 0.1 чд |
| 2 | fe-panel | `CollectionListWithEmpty.tsx` (research-итерация на Cases) | 0.3 чд |
| 3 | be-panel | wiring в Cases + Blog + (опц.) Authors / B2BPages | 0.1 чд |
| 4 | qa-panel | Playwright + screenshots | 0.2 чд |

**Total**: 0.7 чд.

## ADR-NEEDED?

**NO** для нового ADR. **Reference ADR-0010** (Payload 3.84 list-view limitations).

В sa-panel-spec явно цитируется ADR-0010 + проверяется обход через `admin.components.views.list` (не `views.list.Empty/Loading` slot, который отсутствует).

Если в ходе fe-panel research выяснится, что **Payload 3.84 ListView API изменился** или текущий `DefaultListView` не экспортируется из `@payloadcms/ui` — `tamd` подключается, обновляется ADR-0010 supplement.

## Состав команды

- **sa-panel** (this) — spec + research плана для fe-panel
- **fe-panel** — custom-view component
- **be-panel** — wiring в коллекции (admin.components.views.list)
- **ux-panel** — copy review (brand-guide §13 TOV)
- **qa-panel** — Playwright + screenshots
- **cr-panel** — final review

**НЕ нужны**: `dba` (no schema), `cw` (copy в spec предложен).

## Open questions

1. ~~Filtered empty или global empty?~~ — **resolved**: только global empty (docs === 0 без active filters), filtered empty оставляем native «no results».
2. ~~Authors / B2BPages в scope?~~ — **в scope, если effort budget выдержит**; иначе follow-up.
3. **Open**: `DefaultListView` exports из `@payloadcms/ui` Payload 3.84? (fe-panel research, при negative — поднять до `tamd` для ADR-0010 supplement).
4. **Open**: client-vs-server component для wrapper? (research-итерация на Cases определит).

## Hand-off log

- 2026-05-01 · popanel → sa-panel: spec request (P1, effort 0.7 чд, reference ADR-0010).
- 2026-05-01 · sa-panel → popanel: spec-draft готов, AC1-AC5 ясны, no new ADR, open questions 3-4 на fe-panel research-итерации.
