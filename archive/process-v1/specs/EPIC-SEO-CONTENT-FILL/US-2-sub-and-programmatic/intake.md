---
us: US-2
epic: EPIC-SEO-CONTENT-FILL
title: Stage 2 — 33 sub-services + ~150 SD programmatic batch + B2B 10 страниц + 8 Cases + extras + blog M2
team: seo
po: poseo
type: content
phase: spec
role: sa-seo
status: open
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish_w11: 2026-06-26
blocks: [US-3-priority-b-districts, US-4-eeat-monitoring]
blocked_by: [US-1-pillars-pilot]
related: [US-6-competitor-benchmark]
---

# US-2 · Stage 2 W8-W11 — Sub-services + Programmatic batch + B2B + Cases + extras + blog M2

## Цель (одна фраза)

Закрыть **gap по URL-объёму к топ-3** через ~150 SD batch (4 priority-A × ~24 sub-services) + 33 sub-services depth + 10 B2B-страниц + 8 Cases pack + extras pillars (/raschet-stoimosti/, /promyshlennyj-alpinizm/, /arenda-tehniki/ + 4 sub, /porubochnyj-bilet/) + W11 mid-check на 17 конкурентах.

## DoD к W11

- Опубликовано: ~250+ URL (Stage 1 22 + Stage 2 ~210)
- ≥40% closure URL-gap к топ-3 (raw URL count)
- ≥2 confirmed оси в опережении топ-3 (URL-объём + content-depth)
- 8 Cases с реальными mini-case + before/after photos (через fal.ai or real)
- Real B2B-author оператор (ждём имя/VK/TG)
- Blog M2 10 статей опубликованы
- W11 staging preview готов (если do staging deploy завершён)

## Состав исполнителей (паттерн US-1 sequential 3 cw runs + Track B + D + C + E)

- **cw**: 33 sub-services + 10 B2B + 8 Cases + 6 extras + blog M2 = ~57 текстов / ~75000 слов
- **fal.ai (cms+art)**: ~50 hero + 8 case before/after photos
- **seo-tech**: schema validation + sitemap расширение + lint:schema strict mode
- **cms**: bulk publish ~200 SD + sub + B2B + Cases + blog
- **qa-site + re**: W11 mid-check + Playwright + axe

## Скоп

### sub-services (33):
- vyvoz-musora: 9 sub (kontejner, vyvoz-stroymusora, staraya-mebel, krupnogabarit, gazel, vyvoz-sadovogo-musora, uborka-uchastka, vyvoz-porubochnyh, dlya-uk-tszh)
- arboristika: 12 sub (spil-derevev, kronirovanie, udalenie-pnya, avariynyy-spil, sanitarnaya-obrezka, raschistka-uchastka, spil-alpinistami, spil-s-avtovyshki, valka-derevev, izmelchenie-vetok, kabling, vyrubka-elok)
- chistka-krysh: 6 sub (chistnyy-dom, mkd, sbivanie-sosulek, ot-snega, uborka-territorii-zima, dogovor-na-sezon)
- demontazh: 6 sub (dachi, bani, saraya, snos-doma, snos-garazha, snos-zabora)

### Programmatic SD (~150):
- 4 priority-A districts × ~24 sub-services = ~96 SD
- + 8 avtovyshka × 4 districts = 32 SD
- + остальные top sub × 4 = варьируется

### B2B (10 страниц):
- /b2b/ (главная)
- /b2b/uk-tszh/, /b2b/fm-operatoram/, /b2b/zastrojschikam/, /b2b/goszakaz/ (4 segments)
- /b2b/dogovor/, /b2b/shtrafy-gzhi-oati/, /b2b/dogovor-na-sezon/ (3 spec)
- /b2b/kejsy/ + 3 segment cases pages

### Cases (8):
- 2 на pillar (B2C+B2B mix): 2 vyvoz-musora + 2 arboristika + 2 chistka-krysh + 2 demontazh

### Extras (6):
- /raschet-stoimosti/ (hub калькуляторов)
- /promyshlennyj-alpinizm/
- /arenda-tehniki/ (hub) + 4 sub (avtovyshka, izmelchitel-vetok, minitraktor, samosval)
- /porubochnyj-bilet/

### Blog M2 (10 статей):
- темы #11-20 из темника

## Cross-team зависимости

- **fe-site через podev**: 3 missing routes (sro-licenzii/komanda/park-tehniki) — backlog priority
- **art**: final consult на ~50 hero batch (W11)
- **dba**: backup перед B2B + Cases bulk publish
- **operator**: реальные данные (имя, VK, TG, ИНН/ОГРН, СРО номера) — replace placeholders

## Hand-off log

- `2026-05-02 ... · poseo → sa-seo: написать US-2 sa-spec для Stage 2 W8-W11. Скоп ~57 текстов / ~50 hero / ~210 URL.`
