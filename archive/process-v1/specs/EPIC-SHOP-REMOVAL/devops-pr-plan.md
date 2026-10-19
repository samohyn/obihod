---
title: PR groupings для devops — программа Обиход 2.0 + legacy team-restructure
date: 2026-05-10
owner: po (план) → devops (исполнение)
---

# Devops PR plan — Обиход 2.0

## Контекст

В working tree накопились два потока изменений:
1. **Legacy pre-session** — team-restructure 42→10 ролей (2026-05-08). 42 удалённых файла в `team/{business,common,design,panel,product,seo,shop}/`, 10 новых ролевых файлов в `team/{po,dev,fe,seo,cw,design,qa,devops,arch}.md`, `team/archive/`, `.agents/skills/*`, hooks, settings.
2. **Сессия 2026-05-09/10 (программа Обиход 2.0)** — 4 эпика kickoff + execution.

Решение PO: **2 PR sequence** для balance между size и review-ability.

## PR-0 — team-restructure 42→10 (pre-session legacy)

**Branch:** `team-restructure-42-to-10`
**Owner:** devops + cross-team review

**Files (legacy untracked + deleted):**
- `D` 42 файлов в `team/{business,common,design,panel,product,seo,shop}/` (отдельные команды старой структуры)
- `D` `team/seo/topvisor-keywords-baseline.csv` + `topvisor-project-setup.md` + `yandex-metrika-goals.md`
- `?? team/{po,dev,fe,seo,cw,design,qa,devops,arch}.md` + `team/archive/` + `team/cw.md` (новые 9 ролей + archive)
- `?? .agents/skills/*` (skills migration)
- `?? .claude/hooks/{skill-check-reminder,timestamp,validate-skills-activated}.sh`
- `?? skills-lock.json`
- `?? specs/TASK-NEWUI-TEMPLATES-W1/`
- `M team/WORKFLOW.md` (relate to 9-role flow)
- `M .claude/settings.json`

**NB:** Это НЕ работа этой сессии — сделать ОТДЕЛЬНЫЙ PR. Если оператор хочет commit'ить — отдельная задача для devops.

## PR-1 — Программа Обиход 2.0 (этой сессии)

**Branch:** `obikhod-2.0-foundation`
**Owner:** devops
**Содержание:** All wave EPIC-A (shop sunset) + EPIC-B (liwood research + monitoring + RUM) + EPIC-C (master-template + validators + migration + 11 brand-guide extensions) + EPIC-D D1 (art-briefs).

### Files

**Documentation / artifacts:**
- `M` `CLAUDE.md` (5 pillar + 9 ролей + iron rule brand-guide-first + tech stack без shop)
- `M` `team/PROJECT_CONTEXT.md` (deprecation banner + 5-в-1 + landshaft = 5-й pillar)
- `M` `team/backlog.md` (новая секция «Программа Обиход 2.0», B4 OVT US, удалены 5 shop секций)
- `M` `.claude/memory/handoff.md` (current state)
- `M` `.claude/memory/learnings.md` (shop sunset + homepage-classic.css false-positive)
- `A` `team/adr/ADR-0020-shop-sunset-landshaft-positioning.md`
- `A` `team/adr/ADR-0021-service-page-master-template.md`
- `D` `design-system/tov/shop.md`
- `M` `design-system/brand-guide.html` (v2.2 → v2.3 shop cut → v2.4 critical → v2.5 high → v2.6 medium = 11 extensions, 4299 → 7459 строк)
- `A` `design-system/inventory-services-2026-05.md`
- `R` (move) `team/shop.md` → `team/archive/shop/shop.md`
- `R` (move) `specs/EPIC-SEO-SHOP/` → `specs/_archived/EPIC-SEO-SHOP/`
- `R` (move) `specs/US-11-ia-extension/` → `specs/_archived/US-11-ia-extension/`
- `R` (move) `specs/EPIC-SEO-LANDSHAFT/` → `specs/_archived/EPIC-SEO-LANDSHAFT/`
- `A` `specs/EPIC-SHOP-REMOVAL/intake.md` + `qa-report.md` + `audit-richtext-2026-05-09.md` + `devops-pr-plan.md` (этот файл)
- `A` `specs/EPIC-LIWOOD-OVERTAKE/intake.md`
- `A` `specs/EPIC-SERVICE-PAGES-UX/intake.md` + `c4-migration-plan.md`
- `A` `specs/EPIC-SERVICE-PAGES-REDESIGN/intake.md` + `T{2,3,4}-{pillar,sub,sd}/art-brief{,ui,ux}.md` (9 файлов)

**SEO research artifacts:**
- `A` `seosite/01-competitors/liwood-snapshot-2026-05-09.json`
- `A` `seosite/01-competitors/liwood-vs-obikhod-2026-05-W.md`
- `A` `seosite/01-competitors/liwood-page-anatomy-2026-05.md`
- `A` `seosite/01-competitors/overtake-roadmap-2026-05.md`
- `A` `seosite/04-monitoring/watcher.ts`
- `M` `seosite/04-monitoring/README.md`
- `A` `screen/EPIC-C/liwood-*.png` (10 screenshots)

**Code (site/):**
- `M` `site/proxy.ts` — 410 Gone для `/shop*`
- `M` `site/components/marketing/Header.tsx` — мега-меню «Магазин» вырезан
- `M` `site/components/marketing/Footer.tsx` — line 91 cleaned
- `M` `site/components/blocks/types.ts` — IconLine clean
- `M` `site/components/blocks/ServicesGrid.tsx` — orphan `^sh-` regex cleanup
- `M` `site/components/blocks/BlockRenderer.tsx` — `_placeholder` branch
- `A` `site/components/blocks/placeholders/index.tsx` — 5 placeholder components
- `A` `site/components/analytics/RumProvider.tsx` — RUM client
- `M` `site/collections/Services.ts` — useTemplateV2 flag + master-template-gate hook
- `M` `site/collections/ServiceDistricts.ts` — same
- `M` `site/collections/B2BPages.ts` — same
- `A` `site/collections/RumMetrics.ts`
- `A` `site/blocks/master-template.ts` — Zod-like schema + validator
- `A` `site/blocks/__tests__/master-template.test.ts` (20 tests)
- `A` `site/blocks/README.md`
- `A` `site/lib/master-template/getBlocksForLayer.ts`
- `A` `site/lib/master-template/__tests__/getBlocksForLayer.test.ts` (29 tests)
- `A` `site/lib/admin/master-template-gate.ts`
- `A` `site/lib/feature-flags/template-v2.ts`
- `A` `site/migrations/{YYYYMMDD_HHMMSS}_template_v2_flag.{ts,sql}` (UP/DOWN)
- `A` `site/scripts/audit-shop-mentions.ts` + `audit-shop-mentions-detail.ts`
- `A` `site/scripts/clean-shop-mentions-sql.ts` + `clean-shop-mentions-sql-fix2.ts`
- `M` `site/scripts/lint-schema.ts` — `export {}` fix TS2393
- `M` `site/app/(marketing)/[service]/page.tsx` — getBlocksForLayer integration T2
- `M` `site/app/(marketing)/layout.tsx` — RumProvider mount
- `A` `site/app/api/rum/route.ts` — POST endpoint + rate-limit + validation
- `M` `site/payload.config.ts` — RumMetrics collection registered
- `M` `site/package.json` — `test:unit` script

**CI/Workflows:**
- `A` `.github/workflows/seo-monitor.yml` — cron MON 9 UTC + manual

### Verification before merge

```bash
cd /Users/a36/obikhod/site
pnpm install                  # if any new deps (нет — sustained)
pnpm type-check               # 0 errors
pnpm lint                     # 0 errors на изменённых
pnpm format:check             # clean
pnpm test:unit                # 49/49 passing
pnpm test:e2e --project=chromium --grep="header|footer|sitemap"  # smoke
```

### Deploy steps (после merge)

```bash
# 1. Deploy code
cd /Users/a36/obikhod
gh workflow run deploy.yml --ref main
# Подождать SUCCESS (5-7 мин)

# 2. Apply migrations on prod
gh workflow run migrate-prod.yml --ref main
# UP: rum_metrics table, use_template_v2 column на 6 таблицах

# 3. Cleanup richText на prod (после reviews-migration applies)
ssh root@45.153.190.107 "cd /home/deploy/obikhod && \
  sudo -u deploy DATABASE_URI=\$PROD_DB_URI \
  pnpm tsx --require=./scripts/_payload-cjs-shim.cjs \
  site/scripts/clean-shop-mentions-sql.ts"

# 4. Smoke prod
curl -i https://obikhod.ru/shop/                    # → 410
curl -i https://obikhod.ru/                          # → 200
curl -s https://obikhod.ru/sitemap.xml | grep -c '<loc>'  # → ~233 URL (без shop)
curl -i https://obikhod.ru/api/rum -d '{"name":"LCP","value":1234,"rating":"good","pageUrl":"/test"}' \
  -H 'Content-Type: application/json' -X POST       # → 204

# 5. Я.Вебмастер (manual operator action)
# webmaster.yandex.ru → Индексирование → Sitemap → https://obikhod.ru/sitemap.xml
```

### Rollback

```bash
# Если SEO drop > 5% за 48h — rollback
gh workflow run deploy.yml --ref <previous-main-commit>
# Migrations DOWN — manual psql на prod
ssh root@45.153.190.107 "sudo -u postgres psql obikhod < /tmp/template_v2_flag.down.sql"
```

## PR-2 — Pilot wave A (vyvoz-musora) — после PR-1 deploy

**Branch:** `pilot-vyvoz-musora`
**Содержание:**
- D2 wave A — fal.ai photos (assets/services/vyvoz-musora/) + design-system/fal-ai-prompts.md
- C5 wave A — content fill через Local API (не code, а data — нужен production-DB script run через `migrate-prod.yml` + content-fill workflow)
- Enable `useTemplateV2 = true` для `/vyvoz-musora/` через Payload admin (manual)
- A/B pilot setup в Я.Метрика

**После 7 дней A/B → если WIN/NEUTRAL → PR-3 rollout 30 URL/нед × 8 нед.**

## Operator action items

- [ ] Apruv merge PR-1 (когда CI зелёный + manual review)
- [ ] Я.Вебмастер sitemap submit (sustained pending от 2026-05-08 US-7)
- [ ] Я.Карты owner setup (Я.Бизнес account для OVT-4)
- [ ] 7-day мониторинг Я.Вебмастер 5xx после deploy

## Skill activations log (для audit)

В этой сессии активированы: `product-capability` (план + PO orchestration), `ui-ux-pro-max` (UX/UI компетенции), `fal-ai-media` (D2 photos generation). Subagents активировали соответствующие skills per their frontmatter (sustained iron rule #1).
