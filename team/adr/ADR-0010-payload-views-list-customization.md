# ADR-0010 — Payload 3.84 admin collection list-view customization mechanism

**Дата:** 2026-04-30
**Статус:** Accepted
**Автор:** tamd (impersonated by popanel в auto-mode сессии)
**Контекст US:** US-12 W5 part 2 (Per-collection EmptyState/Loading registration)
**Skill:** `architecture-decision-records` (skill-check iron rule, см. [tamd.md](../common/tamd.md))
**Related:** [ADR-0005](ADR-0005-admin-customization-strategy.md) · [ADR-0007](ADR-0007-payload-login-customization.md) (lessons learned)
**Supersedes part of:** sa-panel-wave5.md §5.1 assumption «`admin.components.views.list.Empty`/`Loading` API» — этот ассумпшен **incorrect** для Payload 3.84.

---

## Контекст

W5 part 1 ([PR #101](https://github.com/samohyn/obihod/pull/101)) поставил инфраструктуру: `EmptyCollection` generic + 4 wrapper'а (Services/Cases/Blog/Leads) + Skeletons + brand-skeleton pulse animation. Цель W5 part 2 — подключить эти компоненты per-collection через Payload `admin.components.views.list.Empty` API (как описано в `sa-panel-wave5.md §5.1 rewrite Q3`).

**Проверка типов** (`node_modules/payload/dist/collections/config/types.d.ts:342-351`):

```typescript
views?: {
  // ...
  /**
   * Replace or modify the "list" view.
   * @link https://payloadcms.com/docs/custom-components/list-view
   */
  list?: {
    actions?: CustomComponent[];
    Component?: PayloadComponent;
  };
};
```

`Empty`, `Loading`, или `EmptyState` **не существуют** как ключи в `views.list`. Только `actions` (header кнопки) и `Component` (override всей list view).

**Это та же категория риска как `views.login`** в W2.A v1 (см. ADR-0007). Если бы мы зарегистрировали `views.list.Empty: '@/components/admin/empty/ServicesEmpty'` — Payload 3.84 не имеет такого ключа, importMap сгенерирует entry, но native list view проигнорирует наш компонент. На проде получим silent failure: оператор увидит native «No documents found» (или пустой экран), а не наш бренд-стейт.

**Что реально доступно для list-view customization:**

| Ключ | Что | Использование |
|---|---|---|
| `views.list.actions` | Header buttons row | Custom CTA рядом с «Создать» |
| `views.list.Component` | **Replace ВСЕЙ list-view** | Полный override (sorting/pagination/filters — наш код) |
| `components.beforeList` | Inject компонент **до** list | Banner/notice над таблицей |
| `components.afterList` | Inject **после** list | Footer с подсказками |
| `components.beforeListTable` / `afterListTable` | Уже, до/после конкретно table | Tighter контекст |

---

## Решение

**Принимаем стратегию «отложенной регистрации»** — W5 part 2 закрываем без подключения `EmptyCollection` к list-views.

**EmptyCollection и wrappers остаются как public exports** в `site/components/admin/empty/` для:
1. **Прямого использования** в custom routes (`/admin/catalog` уже использует `PageCatalog` + `EmptyState` — паттерн работает)
2. **Boundary states** — `error.tsx`, `forbidden.tsx`, `not-found.tsx` (уже подключены, Wave 1)
3. **Будущей регистрации** через ADR-0011 (если оператор запросит) с одной из 3 alternatives ниже

**SkeletonTable / SkeletonForm также остаются как public exports** — для опционального использования в custom routes / future Mobile views (W6).

**Для оператора это означает:** native Payload list-view показывает native «No documents found» (через `@payloadcms/translations` ru locale: «Документы не найдены»). Это **acceptable degraded state** — оператор понимает что коллекция пуста, существенной UX потери нет. Брендовый EmptyCollection приоритетнее в custom contexts (catalog page) где он уже работает.

---

## Альтернативы

### Альтернатива 1: Override entire list view через `views.list.Component`
- **Pros:** Полный контроль UI — sorting, pagination, filters, batch actions, EmptyState — всё наше
- **Cons:** Реimplement весь native list (~500-1000 строк per collection). 11 collections × сложная feature. Регрессия рисков очень высокая
- **Why not:** Karpathy #2 (простота прежде всего) + #1 (думай прежде кодить). Cost/benefit плохой: оператор видит native «Документы не найдены» один раз когда коллекция пуста; vs 11 × ~700 строк нашего кода которые надо поддерживать при каждом Payload bump

### Альтернатива 2: `beforeList` / `afterList` injection
- **Pros:** Простое подключение через existing slots; `EmptyCollection` рендерится поверх native list
- **Cons:** Не replace — наш empty state показывается **дополнительно** к native «Документы не найдены», получается двойной UI. Условный рендеринг (показать если doc count = 0) требует client-side JavaScript + DOM observation (та же категория как LeadsBadgeOverlay Plan B)
- **Why not:** Двойной empty state confuses оператора. Альтернативно можно через CSS hide native когда наш visible — но это hack

### Альтернатива 3: CSS-only через `[data-empty="true"]::before` selector
- **Pros:** Zero JS, zero registration, полностью cosmetic
- **Cons:** Зависит от того что Payload выставляет такой attribute. На быстрой проверке `node_modules/payload/dist/admin/views/List/...` — не нашёл такого pattern. Без verified attribute — не работает
- **Why not:** Не verified что Payload поддерживает; risk false-assumption

### Альтернатива 4: Skip registration, оставить как public exports (выбрана)
- **Pros:** Zero risk, zero code changes, components доступны для использования в custom routes/boundaries (где они уже работают). Native «Документы не найдены» — приемлемая degradation
- **Cons:** Оператор не увидит брендовый EmptyState в нативных list-views (Services empty list etc.). Visual inconsistency между custom routes (брендовые) и нативными list-views (native)
- **Why this:** Соответствует ADR-0007 урокам — не trust spec assumption без types verification. Cost/benefit лучший при текущей инфраструктуре

---

## Последствия

### Положительные
- **Zero blast radius** для Payload upgrades — мы не overrid'им list view core
- **W5 part 2 фактически closed** через эту ADR + комментарий в коде. Не блокирует US-12 release
- **Components ready** для будущего использования в catalog page (already), будущих Mobile views (W6), custom dashboards
- **No regression risk** на 11 collections × edit/list flows

### Отрицательные
- **Visual inconsistency:** в `/admin/catalog` оператор видит брендовый EmptyState (через PageCatalog), но в `/admin/collections/services` (когда пусто) — native «Документы не найдены»
- **W5 spec §5.1 partial closure** — компоненты созданы но не подключены как описано в spec

### Риски (mitigation)
- **Risk:** оператор требует брендовый empty в нативных list-views → mitigation: открыть отдельную US с ADR-0011 для Alternative 1 (override entire list view) + обоснование cost/benefit
- **Risk:** Payload 4.x добавит native `views.list.Empty` API → mitigation: ADR-0010 deprecated, supersede новым ADR с auto-migration. EmptyCollection wrappers готовы к подключению

---

## Влияние на другие waves

### W5 part 2 — закрыт через эту ADR
**Action:** обновить `sa-panel-wave5.md §5.1 (rewrite per Q3)` секцию — изменить «registration через `admin.components.views.list.Empty`» на «public exports + custom-route usage» + ссылка на ADR-0010.

`team/backlog.md` panel.now: **W5 part 2 закрыт** (move to Done с ссылкой на ADR-0010).

### W6 Mobile responsive (~1.5 ЧД, sa-panel-wave6.md ещё не написан)
**Implication для W6:**
- Override entire mobile list view через `views.list.Component` — **отвергаем** по тем же cost/benefit аргументам как Alternative 1
- **Recommended approach:** CSS-only mobile responsive через `@media (max-width: 640px)` правила в `custom.scss`. Использовать native Payload list responsive поведение (Payload 3 имеет mobile-friendly list rendering из коробки) + наши tweaks для `sidebar` collapse, `tabs` stacking, button sizing
- **`SkeletonTable` / `SkeletonForm` остаются public** — могут быть полезны если custom Mobile route понадобится (low-priority)
- **sa-panel-wave6.md** должен зафиксировать CSS-only approach как primary, custom-view как Plan B (только если CSS не покрывает specific cases)

### W7 Polish + a11y + Playwright (sa-panel-wave7.md draft в [PR #103](https://github.com/samohyn/obihod/pull/103))
**No impact** — W7 spec написан без assumption на views.list.Empty registration. Polish smoke tests для EmptyCollection в W7 §7.2 имеют conditional `if W5 part 2 merged` flag — теперь могут быть переписаны на «verify EmptyCollection используется в `/admin/catalog`» (existing usage, no W5 part 2 needed).

---

## Action items

- [x] ADR-0010 написан (этот документ)
- [ ] `sa-panel-wave5.md` §5.1 (rewrite per Q3) обновить с reference на ADR-0010
- [ ] `team/backlog.md` panel.now: переместить W5 part 2 в Done с пометкой «closed by ADR-0010 (skip registration, public exports only)»
- [ ] `note-popanel.md` Decision log D-2026-04-30-04 — фиксация решения
- [ ] (опц.) `sa-panel-wave6.md` написание — referenced в этой ADR как Mobile spec
- [ ] (опц.) Если оператор требует брендовый EmptyState в нативных list-views — отдельная US + ADR-0011 (Alternative 1: full list view override)

---

## Verification

```bash
# Проверка что Payload 3.84 не имеет views.list.Empty/Loading
grep -nE "list\?:" /Users/a36/obikhod/site/node_modules/payload/dist/collections/config/types.d.ts
# Expected: ровно одна запись с {actions, Component} — не Empty/Loading

# Проверка что наши компоненты не зарегистрированы в config (правильное состояние ADR-0010)
grep -nE "views.*list" /Users/a36/obikhod/site/payload.config.ts
# Expected: пусто
grep -rnE "views.*list.*Empty\|views.*list.*Loading" /Users/a36/obikhod/site/collections/
# Expected: пусто
```

---

## История

- 2026-04-28 — sa-panel-wave5.md §5.1 (rewrite per Q3) ассумирует `views.list.Empty` API
- 2026-04-30 — popanel в auto-mode сессии при подготовке W5 part 2 проверил `node_modules/payload/dist/collections/config/types.d.ts:342-351` → API не существует
- 2026-04-30 — ADR-0010 написан (impersonated tamd) → Accepted с decision Альтернатива 4
