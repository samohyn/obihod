---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: Overtake-3
status: planning
last_updated: "2026-05-15T04:00:15.311Z"
last_activity: 2026-05-15
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

**Project:** Обиход — obikhod.ru
**Core value:** Один лид через сайт стоит дешевле, чем у любого из 3 ключевых конкурентов (liwood.ru / arboristik.ru / arborist.su).
**Current focus:** Milestone v1.0 Overtake-3 — обогнать одновременно 3 ключевых конкурентов по 8 SEO/UX/B2B-осям.

## Current Position

Phase: 1 (SETUP) — pending kick-off
Plan: —
Status: Roadmap created, awaiting Phase 1 planning
Progress: [          ] 0% (0/5 phases done)

## Performance Metrics

- v1 requirements: 32
- Mapped to phases: 32 ✓ (100% coverage)
- Validated capabilities (sustained baseline): 8 (см. PROJECT.md §Validated)

## Accumulated Context

### Key Decisions (from PROJECT.md)

- Стек Next 16 + Payload 3 (не Tilda/WP/Bitrix) — sustained prod stable
- Beget VPS на старте — РФ-юрисдикция, 152-ФЗ, бюджет ≤ 5k₽/мес
- ADR-0017: 4-6 JSON-LD узлов на каждой service-странице → +50pp rich-results
- ADR-0018: URL-map compete-3 (5 pillar + 35 sub + ~211 SD)
- ADR-0020 (2026-05-09): магазин саженцев вне проекта, landshaft = 5-й pillar
- ADR-0021: T2 master-template для всех 5 pillar
- `.planning/` как стратегический layer поверх `specs/` (2026-05-15)
- Day-0 batch 2026-05-15: P1 NEW US (OVT-8/9 + LSI + 782н) IN, P3 (OVT-10/11) OUT в v1.1, OVT-MKT 30k₽ envelope

### Active Todos

- [ ] /gsd-plan-phase 1 — SETUP (intake.md + template + REQ-mapping)

### Blockers / Operator Actions

- **B2B-04** (страховой полис ГО 15 млн + регистрация ЮЛ) — operator action, hard prereq для B2B-01 + B2B-02 (Phase 5)
- **EXEC-03 prereq** Я.Бизнес owner setup — operator action (Phase 5 OVT-4)
- **EXEC-04 prereq** реальные кадры video footage — operator action (Phase 5 OVT-5)
- **PSI API key** — operator action; если не выдан к Phase 2 — watcher без PSI, ось 7 для arboristik/arborist.su `pending`

## Session Continuity

**Last session:** 2026-05-15
- Created PROJECT.md (32 REQ-IDs)
- Completed research (HIGH confidence): SUMMARY.md, STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
- Created ROADMAP.md (5 phases, 100% requirement coverage)
- Updated REQUIREMENTS.md traceability table

**Next session entry point:** `/gsd-plan-phase 1` to start Phase 1 SETUP planning
