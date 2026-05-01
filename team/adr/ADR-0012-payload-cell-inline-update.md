# ADR-0012 · Payload custom field Cell с inline-update through REST API

**Дата:** 2026-05-01
**Статус:** Accepted
**Автор:** tamd (PANEL-LEADS-INBOX review)
**Контекст US:** [PANEL-LEADS-INBOX](../../specs/PANEL-LEADS-INBOX/sa-panel.md) §A.2 + §C.2 + §A.3
**Related:** [ADR-0005](ADR-0005-admin-customization-strategy.md) (уровни кастомизации) · [ADR-0010](ADR-0010-payload-views-list-customization.md) (lessons: verify Payload API ДО регистрации) · [ADR-0011](ADR-0011-sidebar-icons-strategy.md) (CSS-first preference)
**Skill:** `architecture-decision-records` (skill-check iron rule, см. [tamd.md](../common/tamd.md))

---

## Контекст

PANEL-LEADS-INBOX §A.2 требует **inline-update статуса заявки прямо в list-view** (`/admin/collections/leads`) — оператор кликает на pill, выбирает новый статус, PATCH улетает в фоне без open-doc. Цель: 30s flow → 2s flow (M1 метрика).

Для этого нужно:

1. **Per-row custom rendering** — заменить native plain text status на цветную `.lead-status-badge.<value>` pill с click-handler.
2. **Per-row custom actions** — dropdown «⋯» с 7 status-опциями + Архив + «Открыть полностью», write через `PATCH /api/leads/{id}`.
3. **Audit history** — после каждой смены статуса append entry в `statusHistory: jsonb[]` (через `hooks.beforeChange`).

Payload 3.84 (verified в node_modules — см. § Verification ниже) предоставляет:

| API | Применение | Capability |
|---|---|---|
| `field.admin.components.Cell` | Custom render plain field в list-view | YES — рендерит React component вместо native plain text |
| `field.admin.components.Field` | Custom render в edit-view | YES — для read-only history list в табе «Статус» |
| `views.list.actions` | Header-row slot | YES — для quick-filters (chip row) |
| `views.list.Component` | Replace ВСЕЙ list-view | YES — но **отвергнуто** (см. ADR-0010, 500-1000 строк per collection) |
| **Per-row action menu** (Payload native) | NOT EXISTS | Ни `field.admin.components.RowActions`, ни `views.list.rowActions` — нет такого API |

**Vacuum в API:** Payload не имеет нативного per-row action dropdown. Реализуется только через `Cell` компонент virtual-field — **virtual** в смысле «field declared в config, но не пишется в БД» (через `hooks.beforeChange` стирающий значение, либо через `virtual: true` flag). Cell получает `rowData` и может рендерить любой UI, включая dropdown в portal.

**Lessons learned (incident memory `feedback_leadqa_must_browser_smoke_before_push`):**
- US-12 W2.A v1 (Login UI) — `views.login.beforeLogin` API ассумировался, оказался не существует → ADR-0007 + переписали через `views.login.Component` override.
- US-12 W6 SeoSettings — миграция type-check OK, но runtime `_v_version_*` join tables не созданы → 500 errors в admin → fixup migration.
- **Вывод:** type-check + lint = **необходимое но НЕ достаточное** условие. Real-browser smoke ДО push обязателен.

Этот ADR применяет уроки: фиксирует **что Payload API verified** + **что fallback готов** + **что browser smoke обязателен** до dev-фазы closure.

---

## Решение

**Принимаем 3-компонентную архитектуру для PANEL-LEADS-INBOX:**

### 1. `<StatusPillCell>` — per-row pill render (Payload native Cell API)

```typescript
// site/collections/Leads.ts (status field)
{
  name: 'status',
  type: 'select',
  options: [...], // 7 опций (см. dba review § migration)
  admin: {
    components: {
      Cell: '@/components/admin/leads/StatusPillCell',
    },
  },
}
```

```typescript
// site/components/admin/leads/StatusPillCell.tsx (client component)
'use client'
import { useState } from 'react'

export const StatusPillCell = ({ rowData, cellData }) => {
  const [status, setStatus] = useState(cellData)
  const [pending, setPending] = useState(false)

  const handleChange = async (newStatus: string) => {
    const previous = status
    setStatus(newStatus)        // optimistic UI
    setPending(true)
    try {
      const res = await fetch(`/api/leads/${rowData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // toast.success — через Payload's useTranslation + emit event
    } catch (err) {
      setStatus(previous)        // rollback
      // toast.error
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      className={`lead-status-badge ${status}`}
      onClick={(e) => { e.stopPropagation(); /* open dropdown portal */ }}
      disabled={pending}
    >
      {LABEL_MAP[status]}
    </button>
  )
}
```

**Verified:** Payload 3.84 `field.admin.components.Cell` принимает компонент с props `{ cellData, rowData, link, onClick }`. Можно делать REST call внутри Cell — это standard React, Payload не блокирует.

**Risk mitigation:** REST call использует Payload session cookie через `credentials: 'include'`. RBAC уже работает (Leads.access.read = admin/manager only); update аналогично проверяется server-side.

### 2. `<RowActionsCell>` — per-row dropdown «⋯» (virtual field Cell)

Payload не имеет per-row actions API → используем **virtual field hack**:

```typescript
// site/collections/Leads.ts (после status field)
{
  name: '_actions',
  type: 'text',
  virtual: true,            // not stored в БД (Payload 3.x supports virtual fields)
  admin: {
    components: {
      Cell: '@/components/admin/leads/RowActionsCell',
    },
    disableListColumn: false,
    readOnly: true,
  },
  hooks: {
    afterRead: [() => null], // virtual — всегда null
  },
}
```

**Plan B (если `virtual: true` не работает в list cell):** расширить `<StatusPillCell>` — добавить «⋯» иконку справа от pill. Trade-off: status-cell визуально перегружается, но architecture проще (single Cell component, no virtual field hack).

**Decision tree для be-panel в dev-фазе:**
1. Сначала прототип virtual field Cell в local dev → smoke test что Cell рендерится в list-view (не просто edit-view).
2. Если работает — Plan A.
3. Если Payload list-view игнорирует Cell от virtual fields — Plan B (combined Cell).
4. Решение фиксируется в Hand-off log spec (be-panel → tamd consult если ambiguity).

### 3. Audit history через `hooks.beforeChange` + `statusHistory: jsonb[]`

```typescript
// site/collections/Leads.ts
hooks: {
  beforeChange: [
    async ({ data, originalDoc, req, operation }) => {
      if (operation !== 'update') return data
      if (!originalDoc) return data
      if (data.status === originalDoc.status) return data

      const entry = {
        from: originalDoc.status,
        to: data.status,
        changedBy: req.user?.id ?? null,
        changedAt: new Date().toISOString(),
      }
      data.statusHistory = [...(originalDoc.statusHistory ?? []), entry]
      return data
    },
  ],
},
fields: [
  // ...existing tabs
  // Inside tab «Статус»:
  {
    name: 'statusHistory',
    type: 'json',                // jsonb (Payload maps json → jsonb в Postgres)
    defaultValue: [],
    admin: {
      readOnly: true,
      components: {
        Field: '@/components/admin/leads/StatusHistoryField', // render <ul>
      },
      description: 'История смен статуса (read-only, append через beforeChange hook)',
    },
  },
]
```

**Why NOT Payload native `versions: true`:**
- `versions` хранят полные снапшоты документа (фото, estimateDraftJson, all fields) → overkill для tracking single field.
- `versions` создают `_leads_v` + `_leads_v_version_photos` + `_leads_v_version_status_history` join tables → +3-5 таблиц для 1 use case.
- `versions` имеют draft/published lifecycle → для Leads (не имеет публикации) семантически неуместно.
- **Verified:** Leads.ts currently НЕ имеет `versions: true` → нет existing `_leads_v*` tables → нет risk pattern US-12 W6 SeoSettings v_join_tables_fixup для этой миграции.

**Why NOT отдельная коллекция `LeadStatusEvents`:**
- YAGNI на старте (50-150 заявок/неделя × ~3-5 status changes = ~500 events/week максимум).
- jsonb[] embedded в Lead → одна query при open doc, нет JOIN.
- При росте до 10K+ events → миграция в отдельную коллекцию через future ADR (jsonb backwards-compatible с column-extraction).

### 4. `<LeadsQuickFilters>` — header-row chips через `views.list.actions` (verified ADR-0010)

Standard slot, без custom Cell hacks. Skipping подробности — описано в sa-panel.md §B.2.

---

## Альтернативы

### Альтернатива 1: Override entire list view через `views.list.Component`

- **Pros:** полный контроль (sorting, pagination, filters, batch actions, EmptyState, row actions, inline-update).
- **Cons:** ~700-1000 строк нашего кода для одной коллекции; регрессионные риски при каждом Payload bump; повтор W3 LeadsBadge custom DOM observation проблем но в большом масштабе.
- **Why not:** ADR-0010 уже отверг этот path для всех 11 коллекций по cost/benefit. Для PANEL-LEADS-INBOX cost ещё выше — нужен sorting/pagination/search/RBAC/relationships UI = много native Payload features которые надо реimplement.

### Альтернатива 2: Bulk-only workflow (нет per-row inline)

- **Pros:** простейшая реализация — только bulk actions (Payload native checkbox + custom bulk «Изменить статус» modal).
- **Cons:** не закрывает M1 метрику (≤2s click-to-update). Bulk требует select row → click button → select status в modal → submit = ~5-7s per single заявка.
- **Why not:** оператор требует именно sub-15-секундный single-lead flow (см. capability statement). Bulk дополняет per-row, не заменяет.

### Альтернатива 3: Open doc + status field (как сейчас)

- **Pros:** zero code changes, native Payload UX.
- **Cons:** baseline 30s/заявка → 30 заявок = 15 минут только на status changes. Operator pain confirmed.
- **Why not:** именно эту проблему решает US (см. sa-panel.md § Цель).

### Альтернатива 4: Server Action из row (Next.js paradigm)

- **Pros:** идиоматично для Next.js 16, type-safe call.
- **Cons:** Payload list-view рендерится в Payload's own router context, не Next.js App Router. Server Actions из Cell компонента нетривиально вызвать (требует client-side bridge). Payload REST API проще и verified работает.
- **Why not:** YAGNI — REST + `credentials: 'include'` достаточно для MVP.

---

## Последствия

### Положительные

- **Низкая инвазивность:** per-field Cell components vs full view override (Уровень 2 vs Уровень 3 per ADR-0005).
- **Native Payload list features сохраняются** — sorting, pagination, search, RBAC, relationships не переписываются.
- **Audit history самодостаточен** — `hooks.beforeChange` гарантирует invariant «любая смена статуса → entry в history» (включая API-direct calls без UI).
- **US-13 amoCRM integration не блокируется** — `amoCrmId` + `syncedAt` поля сохраняются, status enum 7 опций mapping в amoCRM stages — задача US-13 dev-фазы (mapping table в адаптере), не предмет этого ADR.
- **Plan B готов** для virtual field Cell — если Payload не поддерживает в list-view, fallback на combined Cell без архитектурной перестройки.

### Отрицательные

- **`virtual: true` field — Payload-specific hack** — не общий React паттерн, новый разработчик может не понять зачем поле без storage.
- **Optimistic UI rollback требует careful error handling** — если PATCH fails частично (например, status updated но statusHistory write failed), UI consistency может разойтись с БД. Mitigation: hook + main update в single Payload transaction (`req.payloadAPI = 'REST'` уже даёт это).
- **`statusHistory` jsonb[] grows unbounded** — для 1 заявки с 100 status flips → 100 entries в одной строке. Mitigation: cap на 50 entries (truncate oldest в hook), либо move to отдельную коллекцию через future ADR при росте.

### Риски (mitigation)

- **Risk:** Payload 3.84 list-view игнорирует `virtual: true` field в Cell context → mitigation: Plan B (combined Cell), решение в dev-фазе через быстрый prototype + smoke (≤30 минут).
- **Risk:** Concurrent updates двух операторов — оба видят status `new`, оба меняют на разные статусы → последний write wins, history теряет промежуточный → mitigation: append в history оба entries (hook видит каждый change), оператор в UI видит конфликт через history list. Acceptable для single-tenant.
- **Risk:** REST PATCH из browser bypassing Payload Local API → security RBAC не auto-applied → mitigation: Payload REST endpoints используют те же `access.update` rules как Local API; verified в Payload 3 docs (`/api/[collection]/[id]` PATCH respects access control).
- **Risk:** `disableListColumn: false` для virtual field может ломаться в Payload upgrade → mitigation: type-check + smoke test в CI; если ломается, fallback Plan B готов.

---

## US-13 amoCRM conflict check (специфично для tamd review Q2)

**Question (sa-panel.md Q2):** различает ли amoCRM-интеграция `in_amocrm` (sync state) и `contacted` (operator action)?

**Анализ:**
1. **`in_amocrm` — это не workflow status, а sync-flag.** «Заявка в amoCRM» означает «передана в внешнюю систему», что ortogonal к workflow «менеджер связался → смета → бригада → завершено».
2. **Семантически правильное место для sync-state — это `syncedAt` (timestamp) + `amoCrmId` (deal id).** Они уже есть в Leads.ts:159-167.
3. **US-13 mapping в amoCRM stages — задача adapter layer**, не workflow status. amoCRM имеет свои pipeline stages (Первичный контакт / Принимают решение / Согласование договора / Успешно реализовано), которые **mapping'уются** к нашим 7 status'ам через таблицу в US-13 коде.
4. **Если `in_amocrm` останется как 8-й workflow status** — это создаст semantic mess: «Заявка `in_amocrm`, но менеджер уже связался — какой её workflow status?». Operator вынужден будет менять `in_amocrm → contacted → smeta → ...`, теряя информацию о sync-state.

**Conclusion (tamd):** `in_amocrm → contacted` migration **семантически корректна**. Sync-state живёт в `syncedAt`/`amoCrmId` полях (boolean derived: `Boolean(amoCrmId)`). US-13 не блокируется; даже наоборот — освобождается workflow status enum от sync concerns, что упрощает US-13 mapping.

**Optional improvement (not for this US):** добавить computed field `amoSynced: Boolean(amoCrmId)` в Leads admin UI — показывает sync-state визуально без putting в status enum. Backlog для US-13.

---

## Verification

**Что verified до acceptance этой ADR:**

```bash
# 1. Payload 3.84 supports field.admin.components.Cell
grep -nE "Cell:" /Users/a36/obikhod/site/node_modules/payload/dist/admin/forms/FieldBase.d.ts
# Expected: Cell?: PayloadComponent

# 2. Payload supports virtual fields
grep -nE "virtual\?:" /Users/a36/obikhod/site/node_modules/payload/dist/fields/config/types.d.ts
# Expected: virtual?: boolean

# 3. Leads currently has NO versions/drafts (нет risk _v join tables)
grep -nE "versions|drafts" /Users/a36/obikhod/site/collections/Leads.ts
# Expected: пусто (verified 2026-05-01)

# 4. REST PATCH respects access control
# Reference: https://payloadcms.com/docs/access-control/collections#update
```

**Что должно быть verified в dev-фазе (be-panel):**

- [ ] Prototype `<StatusPillCell>` рендерится в list-view (не fallback на plain text).
- [ ] Click → dropdown → PATCH → toast → optimistic UI работает в Chrome DevTools (network tab + UI smoke).
- [ ] `virtual: true` field Cell рендерится в list (Plan A) ИЛИ commit Plan B fallback.
- [ ] `hooks.beforeChange` пишет entry в `statusHistory` (integration test).
- [ ] WCAG: Tab order (chip → row → pill → dropdown → ⋯ → menu items), Esc закрывает dropdown.
- [ ] **Real-browser smoke leadqa ДО push** — login → list-view → 3 status changes → verify в БД через `pnpm payload:exec` (см. iron rule #6).

---

## Implementation notes

- Все Cell компоненты — client components (`'use client'`).
- Dropdown в **portal** (avoid table overflow clipping); use `next/dynamic` + `ssr: false`.
- Toast — через Payload's `useToasts()` hook (если доступен в Payload 3.84) ИЛИ inline через emit DOM event + listener в Layout.
- Optimistic UI — `useState` для status, rollback в catch.
- Status enum mapping (LABEL_MAP) — в `site/lib/leads/status-labels.ts` (single source of truth, переиспользуется в `<RowActionsCell>` + `<LeadsQuickFilters>` + `<StatusHistoryField>`).
- `statusHistory` JSON field render — `<ul>` с `font-mono` для timestamp, sorted desc, max 50 entries (truncate).

---

## Migration / rollback

- **Migration:** см. dba review note (`note-tamd-dba-review.md` § dba verdict).
- **Code rollback:** revert PR — Cell components удаляются, native Payload list-view возвращается. Migration data (status enum) остаётся (idempotent), но семантика деградирует к pre-spec состоянию.
- **Full rollback:** revert + run down-migration (см. dba note) — возвращает enum к 6 опциям, удаляет `statusHistory` + `archivedAt` колонки.

---

## Acceptance

- [x] ADR-0012 написан (этот документ).
- [ ] sa-panel.md обновлён — § Architecture decisions ссылается на ADR-0012 (вместо «ADR не нужен»).
- [ ] be-panel читает ADR перед dev-стартом, фиксирует skill activation в hand-off log.
- [ ] cr-panel review checklist включает verification block выше (4 проверки).
- [ ] leadqa real-browser smoke ДО push — обязательно (iron rule #6).

---

## История

- 2026-05-01 · sa-panel.md §A.2 + §A.3 предложил per-row Cell + custom statusHistory без открытия ADR (assumed «ADR-needed = no»).
- 2026-05-01 · popanel approved spec defaults, передал tamd для Q2 enum review.
- 2026-05-01 · tamd review обнаружил что архитектура non-trivial (Cell + REST + virtual field + hooks для history) и заслуживает ADR — открыл ADR-0012 для prevent повторения lessons US-12 W2.A v1 (ADR-0007 patterns).
- 2026-05-01 · ADR-0012 accepted; migration plan делегирован dba (см. note-tamd-dba-review.md).
