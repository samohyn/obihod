---
artifact: fal-ai-prompts
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D2 (wave A — pilot pillar /vyvoz-musora/)
authors: design
created: 2026-05-10
status: dev-ready (blocked by FAL_KEY provisioning)
related:
  - design-system/foundations/photography.md (v1.0 — стилевые принципы)
  - design-system/brand-guide.html (v2.6 — §photography references в §service-hero / §mini-case / §district-chips / §calculator-shell)
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief.md (D1 — photo budget 18 на T2)
  - assets/services/vyvoz-musora/ (target output)
  - assets/services/vyvoz-musora/REVIEW.md (per-photo verdict)
target_model: fal-ai/nano-banana-pro
guidance_scale_default: 7.5
total_photos_planned: 50 (4+4 hero / 5 process / 6 cases / 30 districts / 3 calculator)
cost_cap: $5 (wave A, autonomous mandate)
---

# fal.ai prompts — Обиход service-pages (wave A: vyvoz-musora)

## Назначение

Унифицированный prompt-template для генерации фотоматериалов через **fal-ai/nano-banana-pro** (preferred Pro для production fidelity). Каждый prompt = `style_preamble` + `subject_block` + `composition_block` + `negative_block`.

Цель — обойти stock-feel и liwood-style каталог-фото, выдать документальный репортаж по `foundations/photography.md` (russian suburbs, Moscow oblast, естественный свет, без лиц клиентов, без логотипов конкурентов).

## Iron rules (sustained)

1. **Без лиц** — clients/brigadiers — спина / руки / силуэт через спецодежду. Privacy 152-ФЗ.
2. **Без логотипов конкурентов** — техника без читаемых брендов (если в кадре).
3. **Без stock-tropes:** жёлтые каски + поднятый палец вверх, рукопожатия с заказчиком, белый фон каталога.
4. **Без западных suburbia / экзотических ландшафтов** — only Russian Подмосковье (брежневки, частный сектор, заборы, грунтовые дороги, березы, рябина, ели).
5. **Без overlay-text** — мы добавим caption в HTML (`<span class="photo-tag">`), а не в фото.
6. **Без watermark / brand-mark** — лого Обихода вставит fe в overlay, не AI.

## Style preamble (используется во ВСЕХ prompts)

```text
Documentary editorial photography, 35mm full-frame, natural overcast daylight or soft golden hour, slight warmth +150K, mild contrast, +5% saturation. Russian Moscow oblast suburbs setting: dacha plots, low-rise residential, mixed birch-pine landscape, gravel access roads, typical post-Soviet wooden fences and brick utility sheds. Reportage feel — uncomposed, unposed, natural human scale. NOT stock photography, NOT studio catalog, NOT idealized Western suburbia.
```

## Negative block (используется во ВСЕХ prompts)

```text
no watermark, no logo, no brand text, no captions, no overlay text, no readable license plates, no readable contracts, no client faces, no posed smiles to camera, no thumbs up, no handshakes, no yellow safety helmet cliché, no white studio background, no fish-eye distortion, no over-saturated instagram filter, no HDR halos, no neon, no Western suburbia, no palm trees, no Mediterranean coast, no exotic landscape, no medieval architecture, no Asian streetscape, no skyscrapers, no airport, no industrial mega-plant, no rendered CGI feel, no cartoon, no illustration, no 3D render, no anime
```

---

## 1. Hero photos (T2 pillar = vyvoz-musora)

**Spec D1:** 4 desktop candidates (1920×1080, `landscape_16_9`) + 4 mobile (750×900, `portrait_4_3` → crop). 8 photos total.

**Цель:** A/B pilot mood — реальная сцена работы пилларной услуги, виден труд + масштаб + спецодежда (без лица).

### H1 — «Бригадир рядом с заполненным контейнером у частного дома»

```text
{style_preamble}
Subject: A worker in dark navy work jacket and matching trousers standing with back partially turned to camera next to a freshly-loaded 8 cubic meter open construction skip container on a private dacha plot in Moscow oblast. The container is filled with construction debris — broken plaster, old wooden beams, rusty corrugated roofing sheets, broken tiles. A typical Russian wooden picket fence behind, a one-story brick house visible at left, mature birch trees framing the right side. Worker holds a clipboard, body angled three-quarter away from lens.
Composition: rule-of-thirds, container occupies right 2/3 of frame, worker grounds the left third, eye-line at upper third where house roof meets sky. Mid-day overcast soft light, no harsh shadows.
{negative_block}
```

`image_size: "landscape_16_9"`, `guidance_scale: 7.5`

### H2 — «Команда грузит мусор в КамАЗ-самосвал»

```text
{style_preamble}
Subject: Two workers in dark navy uniforms (shot from behind and side, no faces visible) tossing wooden debris and old furniture fragments into the open back of a Russian KamAZ tipper truck parked on a gravel drive of a private suburban plot. Truck is generic, unbranded (any logos blurred or absent). Tailgate down, debris partially loaded. Worker on left bends with a plank, worker on right reaches up. Brick wall of utility shed visible behind truck, leafless deciduous trees suggest early spring.
Composition: medium-wide, KamAZ rear occupies center-right of frame, motion implied through bent posture, no faces. Slightly elevated camera angle. Natural overcast light.
{negative_block}
```

`image_size: "landscape_16_9"`, `guidance_scale: 7.5`

### H3 — «Полный контейнер у двухэтажного частного дома»

```text
{style_preamble}
Subject: A bright orange or grey 20 cubic meter roll-off construction container, fully loaded with mixed renovation waste — drywall sheets, old laminate flooring, plastic bags of insulation, broken bathroom tiles. Container sits on a paved driveway in front of a two-story Russian private brick house with a hipped metal roof. Foreground: gravel and patches of last-season grass. Background: typical suburban Moscow oblast — neighbour's roof visible, leafless oak tree, narrow road. No people in frame, just the container as protagonist.
Composition: container centred frame, low camera angle to emphasize volume, dramatic perspective. House blurred slightly in background depth-of-field. Late afternoon soft light, slight warmth.
{negative_block}
```

`image_size: "landscape_16_9"`, `guidance_scale: 7.5`

### H4 — «Загруженный КамАЗ выезжает с участка»

```text
{style_preamble}
Subject: Rear three-quarter view of a Russian KamAZ tipper truck, fully loaded with covered construction debris under a tarp, slowly driving out of a residential plot through an open metal gate. Gravel road kicks up faint dust behind rear wheels. Wooden fence on right, mature pine trees on left, suburban Moscow oblast village road extends into distance. No driver visible (cab in shadow). No readable license plate.
Composition: motion captured mid-departure, truck occupies left 2/3, road perspective leads to horizon at right third. Late golden-hour warm light, long shadows. Cinematic.
{negative_block}
```

`image_size: "landscape_16_9"`, `guidance_scale: 7.5`

**Mobile variants H1m..H4m:** same prompts, change `image_size: "portrait_4_3"`. Composition note added: «vertical-friendly framing, subject lower-third, sky upper-third for text overlay safe-zone».

---

## 2. Process steps (5 шагов /vyvoz-musora/ §process-steps)

**Spec D1:** 5 photos, 800×600 (`landscape_4_3`). Semi-staged, real-looking, no stock.

### P1 — «Заявка / звонок»

```text
{style_preamble}
Subject: Close-up over-shoulder shot of a worker's hands (no face) holding a smartphone, screen showing a generic chat interface with a photo thumbnail being uploaded. Worker wears dark navy work jacket. Background out of focus: tailgate of a service vehicle, hint of construction skip behind. Phone is generic Android, no branded interface elements visible.
Composition: hands and phone fill 60% of frame, depth-of-field blurs background. Indoor-outdoor transition lighting (porch / van interior).
{negative_block}, no readable app logos, no readable text on phone screen
```

### P2 — «Подача контейнера»

```text
{style_preamble}
Subject: A roll-off truck (multilift) lowering an empty 8 cubic meter construction skip container onto gravel ground next to a Russian private dacha. Hydraulic arms visible, container mid-descent. No driver visible in cab. Wooden fence and bare birches in background, last year's grass on the ground.
Composition: side view, mechanical action visible, truck and container occupy frame center. Overcast diffuse light.
{negative_block}
```

### P3 — «Погрузка мусора»

```text
{style_preamble}
Subject: Two workers in dark navy uniforms (backs to camera, no faces) actively loading construction debris into a half-full open skip container. One holds a wooden plank mid-throw, second carries a torn plastic bag of demolition waste. Pile of debris remaining on the ground next to container. Russian dacha brick utility shed and wooden fence in background.
Composition: action captured mid-motion, dynamic posture, container right of center, debris pile and workers anchor left half. Slightly elevated camera angle. Soft daylight.
{negative_block}
```

### P4 — «Вывоз — самосвал в движении»

```text
{style_preamble}
Subject: Russian KamAZ tipper truck loaded and tarped, mid-departure on a typical Moscow oblast suburban gravel road. Side view. Wooden village houses and bare deciduous trees flank the road. No driver face visible. No readable license plate.
Composition: classic side-action shot, motion blur on wheels only, truck centre-frame. Overcast or early-morning light.
{negative_block}
```

### P5 — «Подписание акта / закрытие»

```text
{style_preamble}
Subject: Top-down close-up shot of a wooden van tailgate or portable folding table outdoors, with a paper service-act document (generic, no readable client data, blurred names) and a basic black ballpoint pen. Two pairs of hands visible at frame edges — one holding the corner of paper, the other passing the pen. Background out of focus: gravel ground and edge of cleaned plot.
Composition: flat-lay perspective, paper centred, hands enter from left and right edges. Soft natural light from above.
{negative_block}, no readable signatures, no readable INN, no personal data on paper
```

All 5: `image_size: "landscape_4_3"`, `guidance_scale: 7.5`.

---

## 3. Mini-case photos (3 cases × 2 = 6 photos)

**Spec D1:** 6 photos for §mini-case (3 кейса × before/after pairs). 4:3 ratio (`landscape_4_3`). Same point-of-view rule from `photography.md`.

### Case 1 — «Расчищенный участок дачи после сноса сарая»

**C1-before:**
```text
{style_preamble}
Subject: A neglected corner of a Russian dacha plot — old collapsing wooden tool shed, peeling paint, broken windows, surrounded by piles of construction debris, broken bricks, rusty pipes, scattered rotten beams. Overgrown weeds. Typical Moscow oblast wooden fence in background. No people in frame.
Composition: medium-wide, shed slightly off-centre, debris pile dominates foreground. Same camera angle as «after» variant. Overcast daylight.
{negative_block}
```

**C1-after:**
```text
{style_preamble}
Subject: Same Russian dacha corner — now completely cleared. Bare flat ground where shed and debris stood, faint outline of demolished shed footprint visible on the soil. Same wooden fence in background, same bare trees. Clean, ready for new use. No people.
Composition: identical framing and angle as «before» — same lens, same eye-line, same time of day. Overcast daylight.
{negative_block}
```

### Case 2 — «Очищенный двор частного дома (общий план)»

**C2-before:**
```text
{style_preamble}
Subject: Backyard of a Russian one-story brick private house cluttered with renovation waste — broken plasterboard, old radiators, plastic packaging, torn insulation rolls, broken tiles, old kitchen cabinet pieces. House wall on left, wooden fence on right, leafless cherry trees in background.
Composition: wide angle showing full backyard mess, house anchors left, fence right. Overcast daylight.
{negative_block}
```

**C2-after:**
```text
{style_preamble}
Subject: Same backyard of the Russian brick private house — completely cleared. Clean swept paving and bare ground visible, faint sweep marks. Same house wall on left, same fence on right, same bare trees. Two empty unbranded plastic 240L bins stacked neatly at corner.
Composition: identical wide angle, same anchors, same daylight conditions.
{negative_block}
```

### Case 3 — «Очищенная промзона / коммерческий участок»

**C3-before:**
```text
{style_preamble}
Subject: A small commercial / light-industrial yard in Moscow oblast — concrete plates on the ground, scattered with industrial debris: broken pallets, shredded packaging film, old steel-frame parts, abandoned cardboard boxes, oil-stained rags. Beige industrial concrete-block warehouse wall as background. Grey overcast sky.
Composition: medium-wide, industrial wall fills upper third, debris-strewn ground fills lower two-thirds. Grey diffused light.
{negative_block}, no readable industrial brand names, no graffiti
```

**C3-after:**
```text
{style_preamble}
Subject: Same small commercial yard — completely cleared and swept. Bare clean concrete plates ground visible, faint broom marks. Same beige warehouse wall as background. Empty, professional, ready for delivery / loading.
Composition: identical framing as «before», same lens, same overcast sky.
{negative_block}
```

All 6: `image_size: "landscape_4_3"`, `guidance_scale: 7.5`. Critical: pair before/after — used same `seed` per pair to maintain spatial continuity (e.g. C1-before seed `4201`, C1-after seed `4201` + tweak prompt).

---

## 4. District photos (top-30 SD URL — `/vyvoz-musora/<city>/`)

**Spec D1:** 30 photos для T4 SD страниц. Generic urban / suburban Подмосковье with subtle local landmark references when available. 600×400 (closest model option: `landscape_4_3`, will resize down at fe build time).

### Top-30 districts (sustained EPIC-SEO US-2/US-3 URL-map):

`khimki, podolsk, balashikha, korolev, mytishi, ramenskoe, lyubertsy, krasnogorsk, odintsovo, schyolkovo, domodedovo, elektrostal, zhukovskiy, dolgoprudnyy, reutov, sergiyev-posad, orekhovo-zuevo, ivanteevka, zheleznodorozhnyy, dmitrov, klin, istra, naro-fominsk, chekhov, vidnoe, kashira, voskresensk, pushkino, lytkarino, lyubercy-2`

(30 city-slugs — sustained URL-map. Exact list — owner po, design берёт 30 первых.)

### Generic district prompt template

```text
{style_preamble}
Subject: A typical residential street in {city_name}, Moscow oblast — combining a modern construction skip container parked at the edge of a courtyard with classic Russian suburban context. Visible elements: rows of 5-storey grey/beige Soviet-era panel apartment buildings («brezhnevki»), or a typical Moscow oblast private-sector road with wooden houses, depending on city character. Bare deciduous trees, parked Russian sedans (no brand visible). Concrete sidewalks, snow patches optional. The skip container sits naturally as part of the urban scene, not as the subject.
Composition: medium-wide environmental shot, container in middle-ground left third, residential building in background-right. Late winter / early spring overcast daylight. Documentary editorial.
{negative_block}, no readable street signs in Cyrillic, no readable shop signs, no specific recognizable landmarks beyond generic Soviet residential typology
```

`image_size: "landscape_4_3"`, `guidance_scale: 7.0` (slightly lower for variation across 30 generations).

**City character variations** (apply per-city in `{city_name}` slot + small subject tweak):

| Cluster | Cities | Visual flavour add-on |
|---|---|---|
| Industrial-suburb | khimki, podolsk, balashikha, lyubertsy, krasnogorsk, mytishi, korolev, schyolkovo, lyubercy-2 | «brezhnevki + wide arterial road + light industrial silhouette far background» |
| Dacha-suburb | ramenskoe, zhukovskiy, ivanteevka, naro-fominsk, chekhov, kashira, voskresensk, lytkarino | «private wooden houses + dacha plots + birch tree alleys» |
| Historic-town | sergiyev-posad, dmitrov, klin, istra, orekhovo-zuevo, elektrostal | «mix of brezhnevki and pre-revolutionary brick mid-rise + cobblestone or worn asphalt» |
| Greater Moscow rim | reutov, vidnoe, domodedovo, dolgoprudnyy, zheleznodorozhnyy, odintsovo, pushkino | «modern 12-16 storey panel high-rises + paved courtyards + young sapling trees» |

Cluster mapping ensures 4 variations across 30 cities, prevents «all photos look identical» fail-mode.

**Iron rule:** 30 photos должны быть generic enough чтобы НЕ ввести в заблуждение пользователя (мы не утверждаем «это улица Ленина в Химках, дом 5»). Приёмочный критерий: photo выглядит «как Подмосковье», не как конкретная гео-точка.

---

## 5. Calculator stage photos (3 photos для §calculator-shell)

**Spec D1:** 3 photo для UI mockup-screens. 800×600 (`landscape_4_3`).

### CL1 — «Photo of debris on phone (idle / upload)»

```text
{style_preamble}
Subject: First-person view of a smartphone screen held by a worker (hand visible at frame edge, no face) photographing a pile of construction debris — broken bricks, rotten wood beams, plaster pieces — on a private dacha plot. The phone screen shows the camera viewfinder with the debris pile in frame. Russian wooden fence partially visible behind. The phone is generic, no branded interface.
Composition: phone occupies center 60% of frame, debris pile visible both on phone screen and behind phone in real world. Overcast daylight.
{negative_block}, no readable app icons, no readable status bar text
```

### CL2 — «Photo accepted / processing state»

```text
{style_preamble}
Subject: Worker's hand (no face) holding the same smartphone, now showing a generic loading / processing screen — minimal interface with a subtle progress indicator over the previously-shot debris photo thumbnail. Indoor-to-outdoor transition lighting suggests the worker stepped into a vehicle or porch. Out-of-focus background hints at workspace.
Composition: phone fills frame, screen content readable but generic (no specific brand UI), thumbnail photo of debris recognizable. Soft warm interior light.
{negative_block}, no readable app names, no readable percentages
```

### CL3 — «Successful estimate result on phone»

```text
{style_preamble}
Subject: Worker's hand (no face) holding the smartphone showing a generic «estimate ready» success screen — clean light interface, debris photo thumbnail at top, simple summary block below with placeholder rectangles where price would appear (not specific numbers visible — abstracted). Outdoor setting, end of work day, late afternoon warm sunlight on phone screen.
Composition: phone occupies center, slight tilt, sun glare on edge for authenticity. Worker's other hand or service vehicle hint in soft-focus background.
{negative_block}, no readable price numbers, no readable currency symbols, no readable brand names
```

All 3: `image_size: "landscape_4_3"`, `guidance_scale: 7.5`.

---

## Cost estimate (wave A pre-generate check)

Nano Banana Pro public pricing (as of 2026-05): ≈ $0.05 per generation @ default settings.

| Bucket | Count | Cost |
|---|---|---|
| Hero (4 desktop + 4 mobile) | 8 | $0.40 |
| Process steps | 5 | $0.25 |
| Mini-case (3 × 2) | 6 | $0.30 |
| Districts (top-30 SD) | 30 | $1.50 |
| Calculator stages | 3 | $0.15 |
| **Total** | **52** | **≈ $2.60** |

+10-15% reroll buffer (≈ 6-8 retries) → **wave A budget ≈ $3.00**, well under $5 cap.

If `estimate_cost` MCP returns >$5 — STOP, escalate to PO.

---

## Generation workflow (run-book)

1. **Pre-flight:** `estimate_cost` для всего батча 52 photos. If <$5 — go.
2. **Hero first** (8 photos): generate, открыть, отобрать 1 desktop + 1 mobile winner для A/B pilot. Если все 8 reject — re-prompt iteration (subject tweak), max 2 iterations.
3. **Process / mini-case / calculator** (14 photos): generate batch.
4. **Districts** (30 photos): generate в 4 cluster-batches by 7-8 cities. Apply cluster-specific subject add-on.
5. **Save:** `assets/services/vyvoz-musora/<bucket>/<id>.png` (PNG default из nano-banana-pro).
6. **Review:** open each photo, fill `assets/services/vyvoz-musora/REVIEW.md` with verdict ✅ / 🔄 / ❌ + reason.
7. **Cost log:** add row в `REVIEW.md` `## Cost log` table.
8. **Hand-off:** update `specs/EPIC-SERVICE-PAGES-REDESIGN/intake.md` hand-off log (D2 wave A done).

---

## Re-prompt iteration patterns

| Fail mode | Fix |
|---|---|
| «Looks too Western» | Add: «typical post-Soviet 5-storey panel building visible in background, Cyrillic-style cement urban context, no Western suburban houses» |
| «Stock-feel / posed smile» | Add: «candid documentary, worker shot from behind, no posed expression, no eye contact with camera» |
| «CGI / rendered look» | Lower `guidance_scale` to 6.5, add: «authentic 35mm film grain, subtle imperfections, photojournalism» |
| «Container looks toy-sized» | Add specific dimension: «8 cubic meter or 20 cubic meter industrial roll-off skip, taller than the worker» |
| «Faces visible (privacy fail)» | Re-prompt: «back of worker only, no face, no profile, body angled away from lens 90-180°» |
| «Logo / brand visible» | Add: «truck and uniforms generic unbranded, no readable text on side of vehicle, plain dark navy work jackets» |

---

## Status block (для D2 wave A run)

- [x] Prompt template authored (this file) — 2026-05-10
- [ ] FAL_KEY provisioned + fal-ai MCP connected — **BLOCKED, escalated to PO**
- [ ] Pre-flight cost estimate <$5
- [ ] Hero batch (8) generated + reviewed
- [ ] Process / mini-case / calculator batches (14) generated + reviewed
- [ ] Districts batch (30) generated + reviewed
- [ ] REVIEW.md filled, hand-off в intake.md

## Next-iteration scope (out of wave A)

- Wave B: arboristika pillar (sustained T2 photo budget 18) + district-specific photos for arboristika (top-30 SD).
- Wave C: chistka-krysh + demontazh + uborka-territorii + landshaft (4 pillars × 18 photos + 4 × 30 districts = ≈ 192 photos).
- Wave D: T3 sub-pages photos (sustained art-brief T3 budget) — пер-services photos.

Total epic photo budget на 6 pillar + T3 + T4: ≈ 250-300 photos через fal.ai. Wave A pilot валидирует prompt-template до scale-out.
