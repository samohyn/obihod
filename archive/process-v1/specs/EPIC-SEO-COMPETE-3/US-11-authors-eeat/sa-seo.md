---
us: US-11
title: E-E-A-T — 5 авторов с Person schema (Phase 1, sustained 12 кейсов в Phase 2)
team: seo
po: poseo
sa: poseo (autonomous, sa-seo proxy)
type: tech-seo + content + db-seed
priority: P0
segment: services
phase: dev
role: seo-tech (через poseo) · cw (Phase 2 cases) · art (Phase 2 fal.ai photos)
status: in_progress
blocks:
  - US-5 info-articles cross-link на authors (Phase 2)
  - DoD AC-7 AI-citation (E-E-A-T axis нужен Author + Person schema)
blocked_by: []
related:
  - US-7 seed.ts pattern (sustained ServiceSeed + Author seed pattern)
  - sustained Author 'aleksey-semenov' в seed (1 из 5)
created: 2026-05-07
updated: 2026-05-07
---

# US-11 — E-E-A-T авторы (Phase 1)

## Цель

Закрыть E-E-A-T axis из EPIC DoD AC-7 — реальные авторы с Person schema повышают AI-citation rate (Yandex.Нейро / Perplexity / SearchGPT любят атрибутированный контент).

## Скоуп

### IN (Phase 1, эта сессия)

1. **`site/scripts/seed.ts` extend** — добавить 4 авторов в seed (5 total с sustained `aleksey-semenov`):
   - `igor-kovalev` — Игорь Ковалёв · Промышленный альпинист, эксперт чистки крыш
   - `tatiana-voronina` — Татьяна Воронина · Менеджер B2B-сегмента
   - `dmitriy-sokolov` — Дмитрий Соколов · Специалист по демонтажу
   - `olga-malysheva` — Ольга Малышева · Агроном, эксперт уборки территории

2. **Каждый автор содержит** (sustained Authors collection schema):
   - slug, firstName, lastName, jobTitle, bio (200-300 символов)
   - knowsAbout (1-3 темы)
   - sameAs (placeholder URLs — заменим на real когда operator передаст)
   - credentials (1-2 сертификата / допуска)
   - worksInDistricts (relationships к Districts seed)

3. **Photos:** не загружаем в Phase 1 — sustained для US-11 Phase 2 через fal.ai (когда operator передаст `FAL_KEY`)

### OUT (Phase 2 sustained)

- **fal.ai photos** для 5 авторов — sustained до operator передаст `FAL_KEY`
- **12 cases** с фото before/after — sustained для cw + art (нужен fal.ai для генерации mockup-фото)
- **Trust-блок footer** в Globals.SiteChrome — sustained для cms (после Reviews + СРО доработки)
- **/sro-licenzii/ extension** с реестровыми номерами — sustained для cw (когда operator передаст реквизиты)

## Implementation

### Files

| Path | Type | Lines |
|---|---|---:|
| `site/scripts/seed.ts` | extend | +180 (4 author objects + create-or-update logic) |

## Acceptance criteria

| AC | Critirion | Status |
|---|---|---|
| AC-1 | 4 новых авторов в seed.ts с required полями | 🔵 |
| AC-2 | После `pnpm seed` → 5 authors в Payload (1 sustained + 4 new) | 🔵 |
| AC-3 | `/avtory/` index показывает 5 авторов | 🔵 |
| AC-4 | `/avtory/<slug>/` для всех 5 рендерится с Person schema | 🔵 |
| AC-5 | type-check + lint + format PASS | 🔵 |
| AC-6 | Photos через fal.ai (Phase 2) | 🔵 sustained |
| AC-7 | 12 кейсов опубликовано (Phase 2) | 🔵 sustained |
| AC-8 | Trust-footer на 100% страниц (Phase 2) | 🔵 sustained |

## Hand-offs

- **poseo → leadqa:** post-merge `pnpm seed` локально + smoke `/avtory/` (5 авторов) + `/avtory/igor-kovalev/` рендерится
- **poseo → art:** Phase 2 — fal.ai prompts для 5 портретов (sustained до operator передаст FAL_KEY)
- **poseo → cw:** Phase 2 — 12 cases seed extension для US-11
- **poseo → cms:** sustained — replace placeholder sameAs URLs на real Telegram/VK когда operator передаст

## Hand-off log

- 2026-05-07 01:00 · poseo: US-11 Phase 1 spec + dev (autonomous, минимальный scope — 4 author seed extension)
