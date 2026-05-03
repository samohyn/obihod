---
title: Я.Метрика 8 целей — финальный brief для aemd cross-team setup
owner: sa-seo
co-owners: [aemd, cms, seo-tech]
status: draft
created: 2026-05-03
us: US-4 (EPIC-SEO-CONTENT-FILL)
ac: [AC-4.4, AC-4.5]
related:
  - "./yandex-webmaster.md"
  - "./gsc-setup.md"
  - "./topvisor-dashboard.md"
---

# Я.Метрика 8 целей — финальный brief

> **Sustained iron rule (РФ-юрисдикция):** Я.Метрика — primary analytics для obikhod.ru. **8 целей** покрывают primary + secondary + tertiary conversion paths. **Fallback:** 4 primary goals (lead-form / phone / whatsapp / cta-banner) если 8 не успеваем к W14 day 6. Этот документ — sa-seo brief для aemd cross-team setup в Я.Метрика UI + cms `data-goal` selectors.

## 1. 8 целей spec

### Полная таблица

| # | Goal name | Type | Trigger | Selector / event | Conversion priority |
|---|---|---|---|---|---|
| 1 | `lead-form-submitted` | JS-событие | submit `<LeadForm>` (любой URL) | `[data-goal="lead-form-submitted"]` (form element) | **PRIMARY** (главная конверсия) |
| 2 | `phone-clicked` | URL | click `tel:` (header / footer / hero) | `a[href^="tel:"]` | PRIMARY (mobile click2call) |
| 3 | `whatsapp-clicked` | URL | click `whatsapp://` ИЛИ `wa.me/` | `a[href^="whatsapp:"], a[href*="wa.me/"]` | PRIMARY (sticky CTA + footer) |
| 4 | `chat-opened` | URL | click Telegram bot deep-link `tg://` | `a[href^="tg://"], a[href*="t.me/"]` | SECONDARY |
| 5 | `cta-banner-clicked` | JS-событие | click `<CTABanner>` (любой URL) | `[data-goal="cta-banner-clicked"]` | SECONDARY |
| 6 | `calculator-opened` | JS-событие | click calculator placeholder CTA | `[data-goal="calculator-opened"]` | TERTIARY (USP) |
| 7 | `foto-smeta-form-uploaded` | JS-событие | file upload в `<FotoSmetaForm>` | `[data-goal="foto-smeta-form-uploaded"]` | **PRIMARY** (USP-tracker, главный differentiator) |
| 8 | `case-link-clicked` | JS-событие | click ref на `/kejsy/<slug>/` из mini-case block | `[data-goal="case-link-clicked"]` | TERTIARY (нагрев) |

### Cross-link на sa-seo §3.4.4 mapping

Sa-seo intake §3.4 + sa-seo §3.4.4 уточнения: добавлены `calculator-opened` (USP placeholder) и `foto-smeta-form-uploaded` (file upload event — не submit, а именно upload trigger). Финальный список — 8 goals выше.

## 2. Implementation plan

### 2.1 · aemd cross-team — Я.Метрика UI setup (W14 day 4-5)

**Steps (для каждой из 8 целей):**

1. Login Я.Метрика → выбор счётчика `obikhod.ru`.
2. Settings → Goals → **Add goal**.
3. Goal #1 (lead-form-submitted):
   - Type: **JavaScript event**
   - Identifier: `lead-form-submitted` (точно совпадает с `data-goal` селектором)
   - Conversion value: настраивается оператором post-EPIC (не входит в US-4 scope)
4. Goal #2 (phone-clicked):
   - Type: **URL**
   - URL pattern: `tel:` substring match
5. Goal #3 (whatsapp-clicked):
   - Type: **URL**
   - URL pattern: `whatsapp:` OR `wa.me/` substring match (multiple URL conditions)
6. Goal #4 (chat-opened):
   - Type: **URL**
   - URL pattern: `tg://` OR `t.me/` substring match
7. Goals #5-#8 (JS-event):
   - Type: **JavaScript event**
   - Identifier: точно совпадает с `data-goal` селектором (table §1)

**Verify post-setup:**
- Я.Метрика → Goals dashboard → 8 goals listed + `enabled` status.
- Test event firing through Chrome DevTools console: `ym(<id>, 'reachGoal', '<name>')`.

### 2.2 · cms cross-team — `data-goal` атрибуты на 8 элементов в BlockRenderer (W14 day 5)

**Selectors mapping (cms re-seed):**

```tsx
// site/components/blocks/LeadForm.tsx (excerpt)
<form data-goal="lead-form-submitted" onSubmit={handleSubmit}>...</form>

// site/components/blocks/CTABanner.tsx (excerpt)
<a href="..." data-goal="cta-banner-clicked">...</a>

// site/components/blocks/CalculatorPlaceholder.tsx
<button data-goal="calculator-opened" onClick={...}>...</button>

// site/components/blocks/FotoSmetaForm.tsx (excerpt)
<input type="file" data-goal="foto-smeta-form-uploaded" onChange={...} />

// site/components/blocks/MiniCaseRef.tsx (excerpt)
<a href="/kejsy/<slug>/" data-goal="case-link-clicked">...</a>
```

**Note:** `tel:` / `whatsapp:` / `tg://` URL goals — НЕ требуют `data-goal` атрибута (Я.Метрика URL goals match через href substring).

### 2.3 · seo-tech — event-bindings в `site/lib/analytics/`

**Implementation:** 1 централизованный event handler для all `[data-goal]` clicks + form submits.

```tsx
// site/lib/analytics/yandex-metrika.ts
declare global {
  interface Window {
    ym: (id: number, action: string, goal: string) => void
  }
}

const METRIKA_ID = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '0', 10)

export function initGoalTracking() {
  if (!METRIKA_ID || typeof window === 'undefined') return

  // Track all [data-goal] clicks
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-goal]')
    if (!target) return
    const goal = target.getAttribute('data-goal')
    if (!goal) return
    window.ym?.(METRIKA_ID, 'reachGoal', goal)
  })

  // Track all [data-goal] form submits (lead-form, b2b-form)
  document.addEventListener('submit', (e) => {
    const target = e.target as HTMLFormElement
    const goal = target.getAttribute('data-goal')
    if (!goal) return
    window.ym?.(METRIKA_ID, 'reachGoal', goal)
  })

  // Track file uploads (foto-smeta)
  document.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement
    if (target.type !== 'file') return
    const goal = target.getAttribute('data-goal')
    if (!goal || !target.files?.length) return
    window.ym?.(METRIKA_ID, 'reachGoal', goal)
  })
}
```

**Mount:** `site/app/layout.tsx` → useEffect `initGoalTracking()` post-hydration.

**Alternative:** `dataLayer.push(...)` если используется Я.Метрика TagManager-style — sustained iron rule использовать `ym(<id>, 'reachGoal', ...)` напрямую (sustained Я.Метрика 2024+ best practice).

### 2.4 · qa-site verify (W14 day 6)

- Open Chrome DevTools → Network tab → filter `mc.yandex.ru/watch`.
- Click each `data-goal` element → verify request fires + `reachGoal` payload contains expected goal name.
- Document в `screen/yandex-metrika-8-goals-verify.png`.

## 3. Fallback — 4 primary goals

**Если 8 goals не успеваем к W14 day 6 (aemd bandwidth bottleneck OR Я.Метрика UI quirks):**

Setup только **4 primary goals:**

1. `lead-form-submitted` (главная конверсия)
2. `phone-clicked` (mobile click2call)
3. `whatsapp-clicked` (sticky CTA)
4. `cta-banner-clicked` (engagement)

**Defer на post-EPIC:** chat-opened / calculator-opened / foto-smeta-form-uploaded / case-link-clicked.

**Sa-seo recommendation:** **8 goals попытка primary** (более полное coverage); 4 primary fallback ОК если время поджимает.

## 4. Cross-link с existing аналитика setup

### 4.1 · Sustained Stage 2 baseline

- Я.Метрика счётчик installed (sustained Stage 2 W11 — `site/lib/analytics/yandex-metrika.ts` создан).
- Counter ID stored в `NEXT_PUBLIC_YANDEX_METRIKA_ID` env var.
- Goals: **0** sustained → US-4 — first goals setup.

### 4.2 · Я.ВебМастер ↔ Я.Метрика binding

- Bind после goals setup (sustained `./yandex-webmaster.md` §4).
- Permits Я.ВебМастер показывать traffic data from Я.Метрика inside webmaster UI.

### 4.3 · UTM tracking (sustained Stage 2)

- UTM params already captured by Я.Метрика default (sustained `project_us8_no_amocrm_mvp`).
- Cross-link с Payload Leads collection (sustained — UTM saved on lead-form-submitted event).

## 5. Privacy / 152-ФЗ compliance

- Я.Метрика — **152-ФЗ compliant** (российский SaaS, sustained `contex/04_competitor_tech_stacks.md`).
- Cookies banner — sustained Stage 2 (Privacy Policy + cookie consent).
- НЕ собираем PII через goals (только event names + URL).

## 6. Acceptance & Hand-off

| AC | Что | Owner | Hard/Soft |
|---|---|---|---|
| AC-4.4.a | yandex-metrika-goals.md spec written | sa-seo | Hard |
| AC-4.4.b | 8 goals selectors mapped (table §1) | sa-seo + cms | Hard |
| AC-4.5.a | Я.Метрика UI setup 8 goals (или 4 primary fallback) | aemd cross-team | **Hard (Soft → 4 primary)** |
| AC-4.5.b | cms `data-goal` атрибуты на BlockRenderer | cms | Hard |
| AC-4.5.c | seo-tech event-bindings в `site/lib/analytics/` | seo-tech | Hard |
| AC-4.5.d | qa-site DevTools network verify | qa-site | Hard |
| AC-4.5.e | Я.ВебМастер ↔ Я.Метрика bind | aemd | Soft |

**Hand-off:**
- sa-seo → cms (W14 day 5): selectors mapping table §1 + `data-goal` атрибут TODO.
- sa-seo → seo-tech (W14 day 5): event-bindings code spec §2.3.
- sa-seo → aemd cross-team (W14 day 4-5): Я.Метрика UI setup 8 goals + verify panel.
- aemd → qa-site (W14 day 6): screenshots + 8 goals firing verify.
- qa-site → sa-seo (W14 day 6): verify report + DevTools network confirm.
