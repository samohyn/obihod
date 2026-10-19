---
us: US-1
title: leadqa-1 — local-verify US-1 deliverables (research+spec, no code)
team: seo
po: poseo
type: leadqa
priority: P0
phase: qa
role: leadqa
status: PASS
verdict: PASS
created: 2026-05-08
verified_by: leadqa
---

# leadqa-1 — Local-verify US-1

## Контекст

US-1 это research+spec релиз — **кода нет**. leadqa проверяет полноту артефактов и согласованность ADR-0019 с ADR-0018. Real-browser smoke не применим (нет UI).

## AC matrix

| AC | Описание | Команда | Result | Verdict |
|---|---|---|---|---|
| 1 | `intake.md` создан | `ls -la specs/EPIC-SEO-USLUGI/intake.md` | 6719 байт | ✅ PASS |
| 2 | `ba.md` + `sa-seo.md` созданы | `ls -la specs/EPIC-SEO-USLUGI/US-1-research-spec/{ba,sa-seo}.md` | 6351 + 12289 байт | ✅ PASS |
| 3 | `ADR-0019` status: accepted | `grep "^status:" team/adr/ADR-0019-uslugi-routing-resolver.md` | `status: accepted` | ✅ PASS |
| 4 | namespace-audit verdict PASS | `grep "PASS" specs/EPIC-SEO-USLUGI/US-1-research-spec/namespace-audit.md` | `**PASS** — 0 collisions` | ✅ PASS |
| 5 | liwood passport ≥200 строк | `wc -l seosite/01-competitors/liwood-services-passport-final.md` | 230 строк | ✅ PASS |
| 6 | URL inventory = 191 URL | `node -e "..."` (см. ниже) | 191 (41 inline + 5×30 SD) | ✅ PASS |
| 7 | target-keys CSV = 191 строк | `tail -n +2 ... \| wc -l` | 191 | ✅ PASS |
| 8 | backlog mentions EPIC-SEO-USLUGI | `grep -c "EPIC-SEO-USLUGI" team/backlog.md` | 1 (с правильной секцией Now) | ✅ PASS |

## Cross-check ADR-0019 vs ADR-0018

ADR-0018 §«SD route depth уточнено» зафиксировал: **2-сегмент `/<pillar>/<city>/` (sustained pattern), 3-сегмент out-of-scope**.

ADR-0019 §«Решение» — extension того же 2-сегмент pattern через slug-resolver:
- `[service]/[slug]/page.tsx` → resolve sub-service first → service-district fallback → 404
- 0 redirect-chains, sustained URL не меняются

**Verdict:** ADR-0019 не противоречит ADR-0018, а детализирует его. ✅ PASS

## Полнота 9 файлов из AC US-1

```
specs/EPIC-SEO-USLUGI/
├── intake.md                                         ✅
└── US-1-research-spec/
    ├── ba.md                                          ✅
    ├── sa-seo.md                                      ✅
    ├── namespace-audit.md                             ✅ (PASS verdict)
    └── leadqa-1.md                                    ← этот файл

team/adr/
└── ADR-0019-uslugi-routing-resolver.md                ✅ (accepted)

seosite/
├── 01-competitors/
│   └── liwood-services-passport-final.md              ✅ (230 строк)
├── strategy/
│   └── 03-uslugi-url-inventory.json                   ✅ (191 URL)
└── 02-keywords/derived/
    └── target-keys-191.csv                            ✅ (191 keys)

team/backlog.md                                        ✅ (EPIC-SEO-USLUGI секция Now)
```

## Conditional follow-ups (не блокеры US-1, для US-3)

1. **`ramenskoye` ↔ `ramenskoe` alias decision** — namespace-audit предложил оставить sustained `ramenskoye` в URL inventory (sustained slug сохраняем). Принято в `03-uslugi-url-inventory.json` (line `ramenskoye` rank 3).
2. **Live-validation enforcement** — Payload validate-hook + `pnpm lint:slug` будет реализован в US-3.
3. **Seed.ts +4 sub-services discrepancy** — live-sync через Payload Local API в US-3.
4. **target-keys-191.csv класс confidence** — 150 SD имеют classConfidence=B/C (estimated через cityFactor). US-1 deliverable как **skeleton**; US-8 monitoring обновит фактическими Topvisor-позициями после indexing.

## Verdict: **PASS** — US-1 готов к release gate

**Recommendation:** **APPROVE** для перехода в release gate (operator approve → do push/PR/merge).

**Risk-flag:** **none**. US-1 — only spec/research/inventory, deploy в прод не задевает CWV/lead-flow/UX.

## Hand-off log

```
2026-05-08 · poseo → leadqa: dispatch US-1 для local-verify (8 AC mechanical)
2026-05-08 · leadqa: 8 AC проверены через bash-скрипт, все PASS, ADR cross-check PASS, 4 conditional follow-ups для US-3 зафиксированы
2026-05-08 · leadqa → poseo: leadqa-1.md PASS verdict, переход в release gate
```
