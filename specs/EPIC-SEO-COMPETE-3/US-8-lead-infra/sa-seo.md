---
us: US-8
title: Lead-инфраструктура — /kontakty/ + /kalkulyator/foto-smeta/
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy)
type: tech-seo + new-routes
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo)
status: in_progress
blocks:
  - US-4 CTAs (`/foto-smeta/?utm_source=tseny` сейчас → 404 без US-8)
  - US-9 footer NAP-link (требует /kontakty/)
blocked_by: []
related:
  - US-3 lib/seo/jsonld.ts (howToSchema + sustained organizationSchema)
  - ADR-0018 §lead_infrastructure
created: 2026-05-06
updated: 2026-05-06
---

# US-8 — Lead-infrastructure

## Цель

Создать 2 новые routes для конверсии — кросс-линки из всех pillar/sub/blog/B2B на единые точки входа: NAP (`/kontakty/`) и USP (`/kalkulyator/foto-smeta/`). Разблокирует CTAs из US-4 (`/foto-smeta/?utm_source=tseny`).

## Скоуп

### IN

1. **`/kontakty/page.tsx`** — NAP page:
   - Hero c phone (`+7 (985) 229-41-11`) + email (`hello@obikhod.ru`) + address (Жуковский, мкр. Горельники)
   - Block мессенджеров: Telegram + MAX + WhatsApp + email — все deep-links
   - LeadForm (sustained block) с UTM `source=kontakty`
   - Schema: `ContactPage` + `LocalBusiness` (sustained jsonld) + `ContactPoint[]`
   - `revalidate=86400`

2. **`/kalkulyator/foto-smeta/page.tsx`** — USP page (фото→смета за 10 мин):
   - Hero c CTA «Отправить 3 фото в Telegram» (deep-link)
   - 4-step HowTo block: (1) сделай 3 фото объекта → (2) отправь нам → (3) оператор оценит за 10 мин → (4) смета фикс
   - LeadForm с file upload (sustained `LeadForm` cw-схема поддерживает `type='file'`)
   - Schema: `WebApplication` + `HowTo` (US-3 sustained helper) + `Service`
   - `revalidate=86400`

3. **Sitemap.ts:** добавить 2 entries priority 0.6 (yearly changefreq)

4. **UTM tracking:** все CTAs из этих 2 страниц используют `utm_source=lead-infra&utm_medium=<route>`

### OUT

- 5 контекстных LeadForm-вариантов (`commercial-pricing`, `commercial-lead`, `info-bridge`, `b2b`, `local`) — sustained `LeadForm` уже поддерживает через `cw-схему` `fields[]`, контекстная разметка добавляется на каждой pillar/sub в US-7 follow-up
- 5 Я.Метрика целей (form_submit_<variant>) — конфигурируется в Я.Метрика admin UI, не код
- Реальный embed Я.Карты — sustained для US-9 после operator setup карточки
- Real-time photo processing (fal.ai integration) — отдельный `aemd` track

## Implementation

### Files

| Path | Type | Lines |
|---|---|---:|
| `site/app/(marketing)/kontakty/page.tsx` | new | ~150 |
| `site/app/(marketing)/kalkulyator/foto-smeta/page.tsx` | new | ~200 |
| `site/app/sitemap.ts` | extend | +12 |

### `LocalBusiness` schema на /kontakty/

Sustained `localBusinessSchema(chrome, seo)` принимает SiteChrome — тут не нужно расширять, переиспользуем sustained Organization + LocalBusiness.

### `ContactPoint` array

```typescript
contactPoint: [
  { '@type': 'ContactPoint', telephone: '+7 (985) 229-41-11', contactType: 'customer support', availableLanguage: 'Russian' },
  { '@type': 'ContactPoint', email: 'hello@obikhod.ru', contactType: 'customer support' },
]
```

### `HowTo` schema на /kalkulyator/foto-smeta/

Sustained `howToSchema()` из US-3 — 4 шага «сделай фото → отправь → оператор оценит → смета фикс».

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | `/kontakty/` рендерится с phone/email/address | 🔵 |
| AC-2 | `/kalkulyator/foto-smeta/` рендерится с HowTo + LeadForm | 🔵 |
| AC-3 | LocalBusiness + ContactPoint JSON-LD на /kontakty/ | 🔵 |
| AC-4 | HowTo + WebApplication JSON-LD на foto-smeta/ | 🔵 |
| AC-5 | Sitemap содержит 2 entries priority 0.6 | 🔵 |
| AC-6 | type-check + lint + format PASS | 🔵 |
| AC-7 | UTM tracking `utm_source=lead-infra&utm_medium=<route>` | 🔵 |

## Hand-offs

- **poseo → leadqa:** post-merge real-browser smoke /kontakty/ + /kalkulyator/foto-smeta/ (lead-form submit → /api/leads → Telegram)
- **poseo → aemd:** 2 Я.Метрика goals (`kontakty_form_submit`, `foto_smeta_form_submit`) — конфигурация в админке Я.Метрика
- **poseo → cms:** обновить SiteChrome NAP (phone `+7 (985) 229-41-11`, email `hello@obikhod.ru`, address Жуковский) после merge — sustained baseline `+79851705111` устаревший

## Hand-off log

- 2026-05-06 20:30 · poseo: US-8 spec + dev (autonomous, минимальный scope для unblock US-4 CTAs)
