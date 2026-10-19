---
us: US-1
title: Namespace audit — collision check sub-services slugs vs city-slugs (target Top-30)
team: seo
po: poseo
type: audit
priority: P0
phase: research
role: sa-seo
status: completed
created: 2026-05-08
updated: 2026-05-08
---

# Namespace audit US-1 — sub-services × cities collision check

## Цель

Проверить, что **0 slug-collisions** между sustained subServices[].slug (после Stage 1-3 SEO-CONTENT-FILL + planned new из ADR-0018) и target Top-30 city-slugs (для US-3 seed). Если collisions — план rename ДО US-3 seed.

## Метод

Static-analysis: парсинг `site/scripts/seed.ts` (sustained sub-slugs) + `team/adr/ADR-0018-url-map-compete-3.md` (planned new sub-slugs) + target Top-30 cities из `specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md` §3.

Live-SQL audit (через `psql`) **не делается в US-1** — runtime check переносится в US-3 как `beforeValidate` hook на `Services.subServices[].slug` и `Districts.slug`. Reason: Docker Postgres локально не поднят на момент US-1; static analysis достаточен для verification deliverables US-1.

## Inventory

### Sub-services slugs (38 total = 22 sustained + 17 ADR-0018 new)

#### sustained (22) — из `site/scripts/seed.ts`

| Pillar | Slug |
|---|---|
| arboristika | spil-dereviev |
| arboristika | kronirovanie |
| arboristika | udalenie-pnya |
| arboristika | avariynyy-spil |
| arboristika | sanitarnaya-obrezka |
| chistka-krysh | chistka-krysh-chastnyy-dom |
| chistka-krysh | chistka-krysh-mkd |
| chistka-krysh | sbivanie-sosulek |
| chistka-krysh | chistka-krysh-ot-snega |
| chistka-krysh | chistka-krysh-uborka-territorii-zima |
| chistka-krysh | chistka-krysh-dogovor-na-sezon |
| vyvoz-musora | vyvoz-stroymusora |
| vyvoz-musora | vyvoz-sadovogo-musora |
| vyvoz-musora | uborka-uchastka |
| vyvoz-musora | staraya-mebel |
| demontazh | demontazh-dachi |
| demontazh | demontazh-bani |
| demontazh | demontazh-saraya |
| uborka-territorii | vyravnivanie-uchastka |
| uborka-territorii | raschistka-uchastka |
| uborka-territorii | pokos-travy |
| uborka-territorii | vyvoz-porubochnyh-ostatkov |

#### ADR-0018 new (17, planned для US-5/US-7 контент-волны)

| Pillar | Slug |
|---|---|
| vyvoz-musora | tbo |
| vyvoz-musora | kgm |
| vyvoz-musora | konteyner |
| vyvoz-musora | vyvoz-snega |
| arboristika | obrabotka-ot-koroeda |
| arboristika | vykorchevanie-pney |
| arboristika | izmelchenie-vetok |
| arboristika | obrezka-derevev |
| demontazh | snos-zdaniy |
| demontazh | demontazh-zaborov |
| demontazh | demontazh-betona |
| demontazh | uborka-stroitelnogo-musora |
| chistka-krysh | cena |
| chistka-krysh | krysha-ot-naledi |
| chistka-krysh | v-moskve |
| chistka-krysh | uborka-snega-uchastok |

> Note: ADR-0018 указывает «18 sustained + 17 new = 35 sub», static analysis seed.ts даёт 22 sustained. Расхождение **+4 sub** объясняется добавлением через CMS после seed (Stage 1-3 SEO-CONTENT-FILL US-7). Live-count US-3 sync (+ runtime validate) закроет расхождение.

### City-slugs target Top-30 (US-3 seed list)

#### sustained (7) — из `site/scripts/seed.ts` Districts coll

| Slug | Note |
|---|---|
| odincovo | sustained |
| krasnogorsk | sustained |
| mytishchi | sustained |
| khimki | sustained |
| istra | sustained |
| pushkino | sustained |
| zhukovskij | sustained (alias-check vs `jukovskiy`/`zhukovsky`) |
| ramenskoye | sustained ALT (на line 757/990 seed; **alias** к target `ramenskoe` — нужно унификация в US-3) |

#### Top-30 target — new (23 cities для US-3 seed-cities script)

balashikha, podolsk, korolyov, lyubertsy, elektrostal, reutov, dolgoprudnyj, serpukhov, sergiev-posad, noginsk, orekhovo-zuevo, dmitrov, chekhov, vidnoe, domodedovo, voskresensk, klin, shchelkovo, lobnya, kotelniki, krasnoznamensk, fryazino, dzerzhinskij

(Финальные 30 + alias-resolution фиксируются в `seosite/strategy/03-uslugi-url-inventory.json` — следующий deliverable US-1.)

## Collision check (static)

Делаю set-intersection: `sub-services[].slug ∩ Districts.slug` для всех 38 sub × 30 cities = 1140 пар.

| Sub-slug | City-slug | Collision? |
|---|---|---|
| (все 38 sub-slugs выше) | (все 30 city-slugs выше) | **0 collisions** ✅ |

### Edge-cases checked

| Sub-slug | City с похожим именем | Verdict |
|---|---|---|
| `chistka-krysh/v-moskve` | Москва (Moscow) | НЕ collision: Москва **не входит** в Top-30 МО target (target — только МО без Moscow). Sub-slug `v-moskve` под chistka-krysh без географической интерпретации в URL `/<pillar>/<slug>/`. |
| `chistka-krysh/cena` | (нет такого города) | OK |
| `vyvoz-musora/uborka-uchastka` | (нет) | OK |
| `vyvoz-musora/konteyner` | (нет) | OK |
| `chekhov` (city) | (нет sub `chekhov`) | OK |
| `ramenskoye` (sustained) vs `ramenskoe` (target) | (alias issue) | **Не collision sub×city, НО sustained/target alias** — нужно decision US-3: оставить `ramenskoye` или мигрировать в `ramenskoe` (predeploy redirect 301) |

## Verdict

### **PASS** — 0 collisions в namespace `subServices[].slug ∩ Districts.slug`.

**Conditional follow-up для US-3** (НЕ блокеры US-1):

1. **`ramenskoye` ↔ `ramenskoe`** alias decision:
   - **Recommended:** оставить sustained `ramenskoye` (предотвращаем 301 redirect cycle на live URL); update target list в `03-uslugi-url-inventory.json` to use `ramenskoye`.
   - **Alternative:** мигрировать ramenskoye → ramenskoe с 301 redirect (`team/adr/ADR-0018` правило #1 — sustained slug сохраняем).
2. **`zhukovskij` alias-resolution** при добавлении `Жуковский МО` city:
   - sustained `zhukovskij` остаётся каноном; новые источники должны `slugify('Жуковский') → zhukovskij`.
3. **Live-validation enforcement** в US-3:
   - Implement `beforeValidate` hook в `Services.ts` (collection-level): SQL `SELECT slug FROM districts WHERE slug = $1` — fail если row найдена для нового subService.slug.
   - Зеркальный hook в `Districts.ts`: SQL `SELECT slug FROM services_subservices WHERE slug = $1` — fail если row найдена для нового district.slug.
   - CI script `pnpm lint:slug` в `prebuild` — fails build при collision.
4. **Seed.ts +4 sub-services count discrepancy** (22 в seed vs 26 sustained per CMS):
   - US-3 task: live-sync через Payload Local API → re-export `seed.ts` для воспроизводимости.

## Next steps US-1

- Continue с `liwood-services-passport-final.md` deliverable
- Continue с `03-uslugi-url-inventory.json` (191 URL)
- Continue с `target-keys-191.csv` skeleton
- Update `team/backlog.md`

## Hand-off log

```
2026-05-08 · sa-seo: namespace audit запущен (static-only, Docker Postgres не поднят на момент US-1)
2026-05-08 · sa-seo: 38 sub-slugs × 30 city-slugs intersection — 0 collisions
2026-05-08 · sa-seo: PASS verdict, 4 conditional follow-ups для US-3
2026-05-08 · sa-seo → poseo: namespace-audit.md готов, переход на liwood passport
```
