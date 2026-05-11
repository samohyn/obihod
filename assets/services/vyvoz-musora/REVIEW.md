---
artifact: REVIEW
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D2 wave A — pilot pillar /vyvoz-musora/
authors: design
created: 2026-05-10
updated: 2026-05-11
status: done — 52 photos generated via fal.ai REST API (nano-banana-pro), reviewed
related:
  - design-system/fal-ai-prompts.md (prompt template — source for each generation)
  - design-system/foundations/photography.md (v1.0 — visual rubric)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief.md
target_pillar: /vyvoz-musora/
total_photos_planned: 50
total_photos_generated: 52
cost_cap_usd: 5.00
total_spend_usd: ~2.75
---

# REVIEW — vyvoz-musora wave A photos

## Verdict legend

- ✅ **approved** — passes brand-guide §photography rubric, ready for Payload Media import
- 🔄 **retry** — close but needs re-generation with prompt tweak (note tweak in `notes`)
- ❌ **reject** — fundamental fail (privacy / logo / stock-feel / wrong setting), drop and re-prompt from scratch

## Generation method

fal.ai REST API (`https://queue.fal.run/fal-ai/nano-banana-pro`) via curl/urllib — fal-ai MCP not available in session (needs restart). Model: `fal-ai/nano-banana-pro`. Script: `.tmp-falgen.py` (removed after run). FAL_KEY from `~/.claude/secrets/obikhod-fal.env`. Note: nano-banana-pro applies its own aspect logic — most outputs landed near-square (≈3500×3500) or slightly wider regardless of requested `image_size`; fe crops to target ratios at build time (acceptable — composition leaves headroom for crop).

## Hero photos (8 total = 4 desktop + 4 mobile)

| ID | File | Prompt | Verdict | Notes |
|---|---|---|---|---|
| H1d | hero/1-desktop.png | H1 | ✅ | Brigadier (back, hood hides face) + filled 8m³ skip + brick dacha house + birches. Documentary, RF Подмосковье. Best desktop candidate. |
| H2d | hero/2-desktop.png | H2 | ✅ | Two workers (backs) load furniture/wood into unbranded KamAZ near brick shed. Strong work-in-progress mood. |
| H3d | hero/3-desktop.png | H3 | ✅ | Orange 20m³ roll-off, fully loaded, low angle in front of brick house. No people — container as protagonist. Clean. |
| H4d | hero/4-desktop.png | H4 | ✅ | KamAZ tarped, departing through gate, golden-hour, dust kick. Cinematic — strong A/B candidate too. |
| H1m | hero/1-mobile.png | H1m | ✅ | Vertical-friendly H1: worker (back) + skip + brick house, sky headroom. Best mobile candidate. |
| H2m | hero/2-mobile.png | H2m | ✅ | Worker (back) + skip + brick house, golden cast. Good. |
| H3m | hero/3-mobile.png | H3m | ✅ | Loaded skip near house. Good. |
| H4m | hero/4-mobile.png | H4m | ✅ | Worker + skip, vertical. Good. |

**A/B pilot pick:** desktop = **H1d** (worker + container + house, all narrative elements), mobile = **H1m** (same composition, sky headroom for overlay). H4d held as backup (golden-hour appeal) for v2 A/B if H1d underperforms.

## Process steps (5 photos)

| ID | File | Prompt | Verdict | Notes |
|---|---|---|---|---|
| P1 | process/step1.png | P1 (request/call) | ✅ | Worker's hands (no face) + generic Android, chat-style screen with debris thumbnail. No readable app branding. |
| P2 | process/step2.png | P2 (container delivery) | ✅ | Multilift truck lowering empty skip onto gravel near dacha. Mechanical action clear. |
| P3 | process/step3.png | P3 (loading) | ✅ | Two workers (backs) loading debris; left worker mid-throw (gesture is throwing motion, not thumbs-up cliché — acceptable). |
| P4 | process/step4.png | P4 (departure) | ✅ | KamAZ tarped, side-action on suburban gravel road. No face, no plate. |
| P5 | process/step5.png | P5 (act sign-off) | ✅ | Top-down on van tailgate: act paper (gibberish text, no readable client data) + pen + two pairs of hands at edges. |

## Mini-cases (6 photos = 3 cases × before/after)

| ID | File | Prompt | Verdict | Notes |
|---|---|---|---|---|
| C1b | cases/case1-before.png | Case1-before | ✅ | Collapsing blue wooden shed, broken windows, brick stacks, rotten beams, weeds. RF dacha. No people. |
| C1a | cases/case1-after.png | Case1-after | ✅ | Cleared muddy ground, footprint outline visible, same fence/sheds nearby. Framing not pixel-identical to C1b but story reads clearly (acceptable; fe can pair side-by-side). |
| C2b | cases/case2-before.png | Case2-before (regen seed 7212) | ✅ | **Regenerated** — first pass had a tiny distant figure. New: brick house + cluttered backyard (plasterboard, radiators, insulation, drawer, tiles), zero people. |
| C2a | cases/case2-after.png | Case2-after (regen seed 7212) | ✅ | **Regenerated** — first pass had a walking woman with partial face (privacy borderline). New: same brick house, cleared/swept ground, 2 unbranded grey 240L bins at corner, zero people. Strong before/after pair. |
| C3b | cases/case3-before.png | Case3-before | ✅ | Light-industrial yard: concrete plates, broken pallets, shredded film, steel parts, oil rags, beige warehouse wall. Grey overcast. |
| C3a | cases/case3-after.png | Case3-after | ✅ | Same warehouse, fully cleared/swept concrete plates. Came out a smaller square crop (~1500px) — still well above min size, fe scales fine. Excellent before/after match. |

## District photos (30 photos)

All ✅ — cluster-mapping worked: industrial-suburb (brezhnevki + arterial road + light-industrial silhouette), dacha-suburb (wooden private houses + birch alleys), historic-town (brezhnevki + pre-revolution brick mid-rise), greater-moscow-rim (12-16-storey panel high-rises + saplings). Skip container sits naturally in scene (not the subject) per prompt. Some frames have tiny distant figures shot from behind / silhouettes — within the rule (backs/silhouettes OK, no faces). No readable Cyrillic signs. None reads as a specific geo-point (passes "looks like Подмосковье, not a named address" criterion).

| ID | File | City slug | Cluster | Verdict | Notes |
|---|---|---|---|---|---|
| D01 | districts/khimki.png | khimki | industrial-suburb | ✅ | Brezhnevki + yellow skip on courtyard edge + arterial road, light snow. |
| D02 | districts/podolsk.png | podolsk | industrial-suburb | ✅ | Beige panel buildings + skip + parked sedans, mud/snow. |
| D03 | districts/balashikha.png | balashikha | industrial-suburb | ✅ | Brezhnevki + skip, overcast. |
| D04 | districts/korolev.png | korolev | industrial-suburb | ✅ | Panel buildings + skip, late winter. |
| D05 | districts/mytishi.png | mytishi | industrial-suburb | ✅ | Brezhnevki + skip + cars. |
| D06 | districts/ramenskoe.png | ramenskoe | dacha-suburb | ✅ | Private wooden houses + brick garage + blue skip on dirt road, snow patches. Tiny distant figures (backs). |
| D07 | districts/lyubertsy.png | lyubertsy | industrial-suburb | ✅ | Panel buildings + skip. |
| D08 | districts/krasnogorsk.png | krasnogorsk | industrial-suburb | ✅ | Brezhnevki + skip. |
| D09 | districts/odintsovo.png | odintsovo | greater-moscow-rim | ✅ | Tall panel high-rises + blue skip + cars + birches. |
| D10 | districts/schyolkovo.png | schyolkovo | industrial-suburb | ✅ | Panel buildings + skip. |
| D11 | districts/domodedovo.png | domodedovo | greater-moscow-rim | ✅ | High-rises + skip + saplings. |
| D12 | districts/elektrostal.png | elektrostal | historic-town | ✅ | Mix brezhnevki + pre-revolution brick mid-rise + green skip, worn asphalt, light snow. |
| D13 | districts/zhukovskiy.png | zhukovskiy | dacha-suburb | ✅ | Wooden houses + birch alley + skip. |
| D14 | districts/dolgoprudnyy.png | dolgoprudnyy | greater-moscow-rim | ✅ | Panel high-rises + skip. |
| D15 | districts/reutov.png | reutov | greater-moscow-rim | ✅ | High-rises + skip + parked cars + tiny distant figures (backs). |
| D16 | districts/sergiyev-posad.png | sergiyev-posad | historic-town | ✅ | Brezhnevki + brick mid-rise + brick garages + skip, slushy road. |
| D17 | districts/orekhovo-zuevo.png | orekhovo-zuevo | historic-town | ✅ | Pre-revolution brick + panel building + green skip, bricked sidewalk. Distant figures (backs). |
| D18 | districts/ivanteevka.png | ivanteevka | dacha-suburb | ✅ | Wooden private houses + birches + green skip on gravel road. |
| D19 | districts/zheleznodorozhnyy.png | zheleznodorozhnyy | greater-moscow-rim | ✅ | High-rises + skip. |
| D20 | districts/dmitrov.png | dmitrov | historic-town | ✅ | Brick mid-rise + panel + skip. |
| D21 | districts/klin.png | klin | historic-town | ✅ | Historic brick + panel + skip. |
| D22 | districts/istra.png | istra | historic-town | ✅ | Brick mid-rise + panel + skip. |
| D23 | districts/naro-fominsk.png | naro-fominsk | dacha-suburb | ✅ | Wooden houses + birch alley + skip. |
| D24 | districts/chekhov.png | chekhov | dacha-suburb | ✅ | Private wooden houses + skip on dirt road. |
| D25 | districts/vidnoe.png | vidnoe | greater-moscow-rim | ✅ | Panel high-rises + skip + saplings. |
| D26 | districts/kashira.png | kashira | dacha-suburb | ✅ | Wooden houses + birches + skip. |
| D27 | districts/voskresensk.png | voskresensk | dacha-suburb | ✅ | Private houses + birch alley + skip. |
| D28 | districts/pushkino.png | pushkino | greater-moscow-rim | ✅ | Grey panel high-rises + brick garages + green skip + birch/pine, snow. Distant figures (backs). |
| D29 | districts/lytkarino.png | lytkarino | dacha-suburb | ✅ | Wooden houses + skip. |
| D30 | districts/lyubercy-2.png | lyubercy-2 | industrial-suburb | ✅ | Brezhnevka + skip + arterial road + light-industrial silhouette far background. |

## Calculator stages (3 photos)

| ID | File | Prompt | Verdict | Notes |
|---|---|---|---|---|
| CL1 | calculator/stage1.png | CL1 (capture) | ✅ | First-person POV: gloved hand + smartphone showing camera viewfinder over debris pile (bricks/beams), debris also visible behind phone, RF wooden fence. Generic UI, no readable text. |
| CL2 | calculator/stage2.png | CL2 (processing) | ✅ | Gloved hands + phone showing minimal "smeta gotova"-style screen over debris thumbnail, white van + brick garages in soft focus, golden light. No readable percentages. |
| CL3 | calculator/stage3.png | CL3 (result) | ✅ | Gloved hands + phone "СМЕТА ГОТОВА" screen, debris thumbnail at top, price abstracted to grey placeholder rectangles (no readable numbers/currency — per prompt). Cyrillic header is on-brand, acceptable. Late-afternoon sun glare on edge for authenticity. |

## Cost log

Pricing assumption: nano-banana-pro ≈ $0.05/image (per fal.ai public pricing as of 2026-05). Exact billed amount to be confirmed in fal.ai dashboard.

| Timestamp (MSK) | Batch | Count | Cost (USD) | Cumulative |
|---|---|---|---|---|
| 2026-05-11 14:13 | smoke test (pre-flight) | 1 | ~0.05 | ~0.05 |
| 2026-05-11 14:13–14:19 | hero | 8 | ~0.40 | ~0.45 |
| 2026-05-11 14:19–14:22 | process | 5 | ~0.25 | ~0.70 |
| 2026-05-11 14:22–14:26 | mini-case | 6 | ~0.30 | ~1.00 |
| 2026-05-11 14:26–14:28 | calculator | 3 | ~0.15 | ~1.15 |
| 2026-05-11 14:28–14:50 | districts | 30 | ~1.50 | ~2.65 |
| 2026-05-11 ~14:51 | retries (case2 before+after) | 2 | ~0.10 | ~2.75 |
| **Total** | — | **55 generations / 52 final assets** | **≈ $2.75** | — well under $5 cap |

## Summary block

- Approved: **52 / 52** (all final assets ✅)
- Retry: 0 outstanding (2 case2 photos retried during the run → now ✅)
- Reject: 0
- Total spend: **≈ $2.75 / $5.00 cap**
- Hero A/B winner pick: desktop = **H1d**, mobile = **H1m** (backup desktop = H4d)
- Reroll iterations: 1 (case2 before/after — first pass had stray people, regenerated with `no people` negative)
- Blockers: none. fal-ai MCP still not connected (used REST API instead — fully functional). Aspect ratios are near-square not exact 16:9/4:3 — fe crops at build time (composition leaves headroom). Ready for D3 wire-up (replace CSS-gradient fallback with real `assets/services/vyvoz-musora/...` paths in Payload Media).

## D3 hand-off notes for fe

- Hero: use `hero/1-desktop.png` (v1 A/B) + `hero/1-mobile.png`; keep `hero/4-desktop.png` as v2 A/B backup. All 4 candidates available if A/B pilot needs more variants.
- Process: `process/step{1..5}.png` map 1:1 to the 5 §process-steps.
- Mini-cases: `cases/case{1..3}-{before,after}.png` — pair before/after side-by-side in §mini-case.
- Districts: `districts/<city-slug>.png` for each of the 30 top SD URLs (`/vyvoz-musora/<city>/`). Slugs match the EPIC-SEO URL-map.
- Calculator: `calculator/stage{1..3}.png` for §calculator-shell mockup screens (capture → processing → result).
- All files are PNG, ~1.6–2.5 MB each (~106 MB total). fe should convert to WebP/AVIF + resize to target dimensions on import (perf: image-optimization rule).
