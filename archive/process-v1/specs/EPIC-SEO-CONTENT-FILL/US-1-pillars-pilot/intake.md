---
us: US-1
epic: EPIC-SEO-CONTENT-FILL
title: Stage 1 — 4 pillar + 4 priority-A districts + 4 pilot SD + 5 cornerstone blog M1 + статика + /foto-smeta/
team: seo
po: poseo
type: content
phase: done
role: poseo
status: closed
priority: P0
moscow: Must
segment: services
created: 2026-05-02
updated: 2026-05-02
target_finish: 2026-05-29
blocks: [US-2-sub-and-programmatic, US-3-b2b-cases-extras]
blocked_by: [US-0-templates-ux-migration]
related: [US-6-competitor-benchmark]
---

# US-1 · Stage 1 W4-W7 — Pillars + Pilot SD + Cornerstone

## Цель (одна фраза)

Заложить **фундамент сайта который конверит** на 4 главных pillars + 4 priority-A districts + 4 pilot SD (Одинцово) + 5 cornerstone blog M1 + главная + статика + USP-pillar `/foto-smeta/`. **W7 Mid Benchmark** — закрытие ≥40% URL-gap к топ-3 конкурентам + ≥1 ось из 5 уже в опережении.

## Состав исполнителей

| Track | Owner | Deliverable |
|---|---|---|
| Spec | sa-seo | US-1 sa-spec (этот документ → детальная) |
| Content | cw + seo-content | ~16 текстов (~37000 слов), TOV-checker exit 0 |
| Visual | art + fal.ai | ~25 hero + 5 blog covers через fal.ai (Nano Banana Pro) |
| Tech | seo-tech | meta/schema валидация на каждой странице, redirect chain check |
| Publish | cms | seed-content + publish status flip |
| Verify | qa-site | Playwright screenshots + axe + e2e CR-pathways |
| Benchmark | seo-content + re | W7 Mid-Check 17 конкурентов (Keys.so + Topvisor live audit) |

## Сроки

- W4 (2026-05-08 — 2026-05-14): sa-spec apruv + cw начинает 4 pillar drafts + fal.ai prompts validation
- W5 (2026-05-15 — 2026-05-21): 4 pillar finished + 4 districts + главная + статика
- W6 (2026-05-22 — 2026-05-28): 4 pilot SD (Одинцово) + 5 cornerstone blog
- W7 (2026-05-29): Mid-Check benchmark + Operator gate

## Out-of-scope

- 33 sub-services (Stage 2 W8-W9)
- B2B 10 страниц (Stage 2 W11)
- 8 Cases pack (Stage 2 W11)
- Programmatic ~96 SD batch (Stage 2 W10)
- 4 priority-B districts (Stage 3 W12-W13)
- Blog M2/M3 (Stage 2/3)
- E-E-A-T артефакты `seosite/06-eeat` (Stage 3 W14)
- Real images replacement (Stage 1 placeholders → постепенно через fal.ai)
- Calculator реальная логика (отдельная US с pa-site)

## Зависимости

**Блокеров нет** — Stage 0 закрыл всю инфра-зависимость:
- ✅ blocks[] архитектура (Track B-1 + B-2 + B-3)
- ✅ TOV-checker (Track C)
- ✅ lint:schema (Track C)
- ✅ fal-prompts расширены (Track C + fix 3cb7faa)
- ✅ Authors seed pattern (Track C)
- ✅ seed-content-etalons.ts (cms+qa-site Track)

**Параллельно:**
- staging deploy от do (после operator DNS + GHA secrets) — для prod-like preview
- Topvisor SaaS активация (после operator creds) — для W7 mid-check

## Задача от оператора (2026-05-02)

> «Твоя задача — сайт который конверит, приносит лиды и обгоняет конкурентов»
>
> Autonomous mandate: orchestrate EPIC-SEO-CONTENT-FILL автономно, cross-team как popanel.
>
> Reminder: «Не забывай использовать дизайн систему!»

## DoD

- [ ] sa-spec apruv от poseo
- [ ] ~16 текстов через TOV-checker exit 0
- [ ] Все 16 страниц рендерят blocks[] через BlockRenderer
- [ ] Schema validation 0 errors на всех 16
- [ ] axe-core: 0 critical / 0 serious из блочного контента (legacy SiteChrome contrast — не зона)
- [ ] fal.ai 25+ hero сгенерированы и вставлены через Payload Media
- [ ] art apruv визуального стиля (cohesive look across 16 страниц)
- [ ] cw apruv TOV-чистоты (100% review pillar/cornerstone, 20% sampling SD)
- [ ] W7 Competitor Benchmark Mid-Check artifact в seosite/01-competitors/benchmark-W7-mid.md
- [ ] differentiation-matrix.md обновлена с реальными W7 цифрами
- [ ] Operator gate W7 — apruv с явной отметкой «move to Stage 2»

## Hand-off log

- `2026-05-02 14:00 · poseo → sa-seo: написать US-1 sa-spec (Stage 1 W4-W7); скоп 4 pillar + 4 districts + 4 pilot SD + 5 blog + статика + /foto-smeta/; design-system §1-14 mandatory.`
- `2026-05-02 16:30 · sa-seo → poseo: US-1 sa-spec готов (600 строк, 78 AC, 5 tracks, commit ed54d82). 4 open вопроса для poseo.`
- `2026-05-02 16:35 · poseo: 4 закрыто:`
  - `(1) Sequence 25 текстов: W4 = 4 pillar + /foto-smeta/ (5 / ~13500 слов); W5 = 4 districts + главная + 6 статика (11 / ~12000); W6 = 4 SD + 5 blog (9 / ~12300); W7 = art apruv + benchmark + gate`
  - `(2) cw sequential — 3 background runs c TOV-checker apruv до следующего`
  - `(3) CR-pathways verify: local fallback пока staging не готов; switch когда do deploy'нет`
  - `(4) Benchmark fallback: deep-profiles 17 + Я.ВебМастер public + manual SERP top-50 если Topvisor creds не дойдут к W7`
- `2026-05-02 16:35 · poseo: US-1 phase: spec → dev. cw Run 1 запуск (4 pillar + /foto-smeta/).`
- `2026-05-02 ... · poseo: Stage 1 production phase ЗАКРЫТ. cw 25 текстов / 36662 слов. Track B 24 hero. Track D+C 18 publish + 24 media + lint:schema 0 errors + sitemap 38 URL. Track E 44 PNG + axe + W7 benchmark + 3 CR-pathways verified. Buffer fix: home a11y + slug-bug closed. 0 critical / serious только в SiteChrome legacy backlog.`
- `2026-05-02 ... · poseo: Stage 1 W7 ГОТОВ к Operator gate. Передача → operator review.`
- `2026-05-02 ... · operator → poseo: APRUV Stage 1 → Stage 2 start. US-1 phase: dev → done.`
- `2026-05-02 ... · poseo: запуск US-2-sub-and-programmatic (Stage 2 W8-W11). sa-seo пишет sa-spec.`
- `2026-05-02 17:30 · cw → poseo: Run 1 готов (5 текстов, 12068 слов, TOV exit 0, 5 commits). Apruv от poseo: cohesion ok, B2B-формулировка использована, 4-в-1 winning angle с %.`
- `2026-05-02 17:35 · poseo: запуск cw Run 2 (4 districts + Главная + 6 статика, ~12000 слов) + Track B Run 1 fal.ai (5 hero) параллельно.`
- `2026-05-02 18:30 · cms+art → poseo: Track B Run 1 готов (5 hero JPG 1024×576, 3 commits). FAL_KEY был в .env.local — реальная генерация. 0 anti-§14. cw Run 1 JSON-fixtures обновлены heroImageUrl. seed-stage1-media.ts готов для Payload Media seed.`
- `2026-05-02 18:35 · poseo: Track B 3 open вопроса closed:`
  - `(1) flux/schnell 1024 vs target 1280: оставляем schnell для visual cohesion all Runs (1.25× retina ok)`
  - `(2) mini-case imageUrl placeholders: defer to US-3 W11 Cases pack (real photos)`
  - `(3) art cross-team consult: defer до полного Stage 1 batch ~25 images, W7 gate`
