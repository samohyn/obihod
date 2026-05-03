---
us: US-0
epic: EPIC-SEO-CONTENT-FILL
title: Templates + UX validation + Payload миграция legacy → blocks[]
team: seo
po: poseo
sa: sa-seo
type: spec
phase: dev
role: poseo
status: in-progress
priority: P0
moscow: Must
created: 2026-05-01
updated: 2026-05-01
target_finish_w3: 2026-05-22
blocks: [US-1-pillars-pilot, US-2-sub-and-programmatic, US-3-b2b-cases-extras, US-4-priority-b-districts, US-5-eeat-monitoring]
blocked_by: []
related: [US-6-competitor-benchmark]
skills_activated: [seo, architecture-decision-records, api-design, product-capability]
---

# US-0 · Templates + UX validation + Payload миграция legacy → blocks[]

> **Master-документ Stage 0 (W1-W3) эпика `EPIC-SEO-CONTENT-FILL`.** Без закрытия US-0 ни один из US-1..US-5 не стартует — здесь рождается архитектура, которая будет производить ~250 URL контента в Stage 1-3.

## 1 · Цель US-0

Подготовить **архитектурный, UX-валидированный и SEO-инфраструктурный фундамент** для наполнения services-сайта на 14 недель: 8 wireframes типов страниц, 7 новых блоков в библиотеке, миграция 6 коллекций Payload на `blocks[]`, Storybook + stories, 8 эталонных страниц на staging с реальным контентом, базовая SEO-инфраструктура (TOV-checker, lint:schema, fal-prompts расширение, slug migration, Topvisor + Я.Метрика, Authors seed) и W3 Competitor Benchmark Baseline по 17 конкурентам с первой differentiation-matrix. Без апрува оператора по 8 эталонным URL Stage 1 не стартует — это hard gate. Подробности по контенту/процессу — см. план §«Stage 0 (W1-W3)» в `/Users/a36/.claude/plans/team-seo-poseo-md-wise-flute.md`.

## 2 · Бизнес-цель

US-0 — единственный US, который физически разблокирует DoD-метрику эпика **«опережение топ-3 конкурентов по ≥3 из 5 осей к W14»** (URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage). Без block-based архитектуры:
- Контент-наполнение сваливается в шаблонную верстку через `richText` → риск Scaled Content Abuse demote (R1, P=0.7) → проседание оси «контент-глубина».
- Без TOV-checker / lint:schema → падает ось «UX» (axe + читаемость) и «schema-coverage».
- Без 8 эталонов с apruv оператора → каждый Stage 1+ PR превращается в дизайн-баттл вместо production-конвейера.
- Без W3 Benchmark Baseline → невозможно зафиксировать стартовую точку и проверять движение к опережению на W7/W14.

US-0 == «фундамент под завод», не «первая партия продукции». Именно поэтому он P0 / Must / target W3.

## 3 · Scope

### 3.1 · Что в US (deliverables)

1. **8 wireframes типов страниц** в `seosite/04-url-map/wireframes/<type>.md`:
   - `pillar.md` (Pillar Service `/[service]/`)
   - `sub.md` (Sub-Service `/[service]/[sub]/`)
   - `sd.md` (Programmatic SD `/[service]/[district]/`)
   - `district.md` (District Hub `/raiony/[district]/`)
   - `blog.md` (Blog Post `/blog/[slug]/`)
   - `case.md` (Case `/kejsy/[slug]/`)
   - `b2b.md` (B2B Segment `/b2b/[slug]/`)
   - `author.md` (Author `/avtory/[slug]/`)

2. **7 новых блоков** (TS-тип + рендерер + регистрация в `BlockRenderer` + Storybook story):
   - `services-grid` (`site/components/blocks/ServicesGrid.tsx`)
   - `mini-case` (`site/components/blocks/MiniCase.tsx`)
   - `calculator` placeholder (`site/components/blocks/Calculator.tsx`)
   - `related-services` (`site/components/blocks/RelatedServices.tsx`)
   - `neighbor-districts` (`site/components/blocks/NeighborDistricts.tsx`)
   - `tldr` (`site/components/blocks/Tldr.tsx`)
   - `breadcrumbs` (`site/components/blocks/Breadcrumbs.tsx`)

3. **Миграция 6 коллекций Payload на `blocks[]`** через `payload migrate`:
   - `Services`, `Blog`, `Cases`, `B2BPages`, `Districts`, `Authors`
   - Legacy `body: richText` → `[{blockType: 'text-content', body: <legacy>}]`
   - `Districts.relatedDistricts` (если поля нет — добавить)
   - `Cases.before-after` блок-тип (опционально в Stage 0, обязательно в US-3)

4. **Storybook setup + stories**:
   - `site/.storybook/` (Tailwind + RSC поддержка)
   - 12 block stories (5 существующих + 7 новых, по 2-3 варианта каждый)
   - 8 page-type composition stories (по wireframe и реальным mock-data)

5. **SEO-инфраструктура**:
   - `site/scripts/seed-content.ts` — idempotent batch-import (паттерн ADR-0001-seed-prod-runner)
   - `site/scripts/tov-checker.ts` — anti-TOV regex (≥30 паттернов из §14) + LLM pass на конкретику цифр
   - `site/scripts/lint-schema.ts` — schema.org Validator на 30 random pages, exit 1 при ошибке
   - `site/lib/fal/prompts.ts` extend: `districtHeroPrompt`, `b2bHeroPrompt`, `companyAuthorAvatarPrompt` (silhouette/back-shot)
   - Slug migration `ochistka-krysh` → `chistka-krysh` через коллекцию `Redirects` (301) + Payload migration на Service записи + регенерация sitemap.xml
   - Topvisor проект на 200 ключей (4 pillar × top-50 wsfreq из `seosite/03-clusters/`), baseline зафиксирован
   - Я.Метрика 8 целей (Lead form / Foto-smeta upload / TG / WA / MAX / Phone / Calculator / Blog-FAQ)
   - Authors seed: company-page «Бригада вывоза Обихода» + оператор как реальный B2B-автор

6. **8 эталонных страниц на staging** с реальным контентом:
   - `/vyvoz-musora/` (pillar)
   - `/vyvoz-musora/staraya-mebel/` (sub)
   - `/vyvoz-musora/odincovo/` (SD)
   - `/raiony/odincovo/` (district)
   - `/blog/chto-takoe-4-v-1/` (blog)
   - `/kejsy/snyali-pen-v-gostice/` (case)
   - `/b2b/uk-tszh/` (B2B)
   - `/avtory/brigada-vyvoza-obihoda/` (author)
   - Playwright screenshots в `screen/etalons-W3/<type>-{desktop,mobile}.png` + axe-violations report.

7. **W3 Competitor Benchmark Baseline + Differentiation Matrix v1**:
   - `seosite/01-competitors/benchmark-W3-baseline.md` — стартовый замер по 17 конкурентам
   - `seosite/01-competitors/differentiation-matrix.md` v1 — матрица 17 × 5 осей
   - Фиксация топ-3 для DoD-цели опережения

8. **Operator gate apruv** — оператор смотрит 8 staging URL + screenshots + benchmark + matrix, апрувит ИЛИ возвращает корректировки.

### 3.2 · Out-of-scope (НЕ делаем в US-0)

- 4 pillar full content (~3000 слов) — US-1 (Stage 1 W4-W7)
- 33 sub-services full content — US-2 (Stage 2 W8-W10)
- ~150 SD batch — US-2
- 4 priority-A districts hub — US-1 (только эталон Одинцово в US-0)
- 4 priority-B districts — US-4 (Stage 3 W12-W13)
- 10 B2B-страниц — US-3 (Stage 2 W11) — только эталон `/b2b/uk-tszh/` в US-0
- 12 cases — US-3 — только 1 эталон в US-0
- 30 blog posts — US-1/2/3 (cornerstone в US-1, M2 в US-3, M3 в US-5) — только 1 эталон в US-0
- E-E-A-T артефакты `seosite/06-eeat/`, neuro-SEO `seosite/07-neuro-seo/`, monitoring `seosite/08-monitoring/` — US-5
- Calculator реальная логика (только placeholder) — отдельная US с pa-site
- Visual Regression CI (Chromatic / Percy) — backlog, после W14
- W7 mid + W14 final benchmark — US-6 (сквозная)

## 4 · Tracks (3 параллельных)

US-0 — единственный US в эпике, где работают одновременно три параллельных track'а трёх разных команд через `poseo` orchestration. Track'и пересекаются на gate'ах (W1 wireframe apruv → W2 stories ready → W3 эталоны на staging).

### 4.1 · Track A — UX/Design (owner: ux + art + ui)

**Цель:** wireframes и цветовые макеты 8 типов страниц + 7 новых блоков визуально готовы для эталонов W3.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| 8 wireframes (low-fi ASCII или Figma-link) | `ux` | `seosite/04-url-map/wireframes/<type>.md` | block-hierarchy + mobile vs desktop + A11y annotations + «Winning angle vs топ-3» секция |
| Apruv wireframes vs brand-guide §1-14 | `art` | inline в wireframe.md | apruv-stamp с датой |
| Цветовые макеты эталонов (8 типов) | `ui` | Figma или `screen/mockups-W2/<type>.png` | использует токены §1-11 brand-guide; апрувит `art` |
| Apruv fal.ai prompt-стиль | `art` | inline в `site/lib/fal/prompts.ts` PR | apruv-stamp на стиле hero / district / B2B / author silhouette |
| Storybook setup + 12 block stories + 8 page-stories | `ui` + `fe-site` через `podev` | `site/.storybook/` | `pnpm storybook` локально работает, 12 + 8 stories рендерятся |

**Hand-off с другими track'ами:**
- W1 wireframe apruv от `art` → старт `ui`-цветовых макетов (Track A) и старт `fe-site` блок-реализации (Track B)
- W2 цветовые макеты apruv → старт `cw` живых текстов для эталонов (Track C)

### 4.2 · Track B — Tech/Migration (owner: popanel + be-panel + dba + fe-site через podev)

**Цель:** 6 коллекций мигрированы на `blocks[]`, 7 новых блоков реализованы и зарегистрированы в `BlockRenderer`, типы Payload сгенерированы.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| 7 новых блоков реализация | `fe-site` через `podev` | `site/components/blocks/<Block>.tsx` + `types.ts` extend + `BlockRenderer.tsx` switch-case | TS strict pass, рендерит mock-data, 0 console.warn для известных blockType |
| Миграция Services на blocks[] | `popanel` + `be-panel` | `site/migrations/<ts>-services-blocks.ts` + `site/collections/Services.ts` | `payload migrate` зелёный, legacy `body` → `[{blockType:'text-content',body}]`, rollback tested |
| Миграция Blog на blocks[] | то же | `site/migrations/<ts>-blog-blocks.ts` + `site/collections/Blog.ts` | то же |
| Миграция Cases на blocks[] | то же | `site/migrations/<ts>-cases-blocks.ts` + `site/collections/Cases.ts` | `before-after` block-тип опционально (используется в US-3), `casesShowcase` сохранён |
| Миграция B2BPages на blocks[] | то же | `site/migrations/<ts>-b2bpages-blocks.ts` + `site/collections/B2BPages.ts` | `casesShowcase` → relationship + `mini-case` блок |
| Миграция Districts на blocks[] | то же | `site/migrations/<ts>-districts-blocks.ts` + `site/collections/Districts.ts` | `relatedDistricts` field добавлен (если нет), `neighbor-districts` блок использует |
| Миграция Authors на blocks[] | то же | `site/migrations/<ts>-authors-blocks.ts` + `site/collections/Authors.ts` | то же; `worksInDistricts` field подтверждён |
| Apruv миграций БД + откат-стратегия | `dba` | inline в каждом migration PR | bcup перед migrate, rollback testing на копии БД |
| `pnpm generate:types` без ошибок | `be-panel` | `site/payload-types.ts` | TS strict pass на 100% после миграции |
| Расширение `publish-gate.ts` под новые блоки | `be-panel` | `site/lib/admin/publish-gate.ts` | Rule «mini-case + ≥2 localFaq + 1 hero + 1 text 300+ + 1 contact» работает на ServiceDistricts; не ломает Services / Blog / Cases / B2BPages / Districts / Authors |

**Hand-off с другими track'ами:**
- W1 миграция Services + Blog → Track C может стартовать seed-content.ts (Track C нужны таблицы blocks[])
- W2 все 6 миграций готовы → Track A может рендерить эталоны на staging

### 4.3 · Track C — SEO Infrastructure (owner: seo-tech + seo-content + re + cms + cw)

**Цель:** TOV-checker / lint:schema / Topvisor / Я.Метрика / slug migration / Authors seed работают; W3 baseline benchmark + differentiation-matrix v1 опубликованы; 8 живых текстов написаны для эталонов.

| Deliverable | Owner | File | Acceptance |
|---|---|---|---|
| `tov-checker.ts` | `seo-tech` | `site/scripts/tov-checker.ts` + `site/scripts/tov-anti-patterns.json` | exit 1 при матче, ≥30 anti-TOV regex из §14, LLM pass на конкретику цифр (Sonnet 4.6 + prompt caching из skill `claude-api`); подключён к `pre-commit` hook + `ci.yml` |
| `lint:schema.ts` | `seo-tech` | `site/scripts/lint-schema.ts` + `site/package.json` script | exit 1 при ошибке schema.org, прогоняет 30 random pages с staging, CI gate |
| `fal-prompts` extend | `seo-tech` + `art` apruv | `site/lib/fal/prompts.ts` | `districtHeroPrompt`, `b2bHeroPrompt`, `companyAuthorAvatarPrompt` (silhouette/back-shot) — стиль apruv от `art` W2 |
| Slug migration `ochistka-krysh` → `chistka-krysh` | `seo-tech` + `cms` | `site/migrations/<ts>-slug-chistka-krysh.ts` + Redirects entries + sitemap regen | 301 на все legacy URL, smoke staging — 0 broken-links |
| Topvisor проект 200 ключей | `seo-content` | `seosite/08-monitoring/topvisor-baseline.md` | 4 pillar × top-50 wsfreq, baseline зафиксирован на дату W2 |
| Я.Метрика 8 целей | `seo-tech` | `seosite/08-monitoring/ya-metrika-goals.md` + код в `site/app/(marketing)/layout.tsx` (если нужно) | Lead form / Foto-smeta upload / TG / WA / MAX / Phone / Calculator / Blog-FAQ — все 8 видны в Я.Метрике |
| Authors seed | `cms` + `cw` | `site/scripts/seed-content.ts` (Authors раздел) | 1 company-page (silhouette, schema Person→Organization, knowsAbout=[…]) + 1 оператор (имя реальное, sameAs=[VK, TG] обязательно) |
| 8 живых текстов для эталонов | `cw` | через `seed-content.ts` или Payload Admin UI | TOV-checker pass + lint:schema pass + 100% review `cw` |
| W3 baseline benchmark по 17 конкурентам | `seo-content` + `re` | `seosite/01-competitors/benchmark-W3-baseline.md` + `raw/` | 5 осей × 17 конкурентов, % отставания, топ-3 priority gap, фиксация топ-3 для DoD-опережения |
| Differentiation matrix v1 | `seo-content` | `seosite/01-competitors/differentiation-matrix.md` | 17 × 5 с пометками «копируем / превосходим / unique» |
| `seed-content.ts` idempotent batch-import | `seo-tech` + `cms` | `site/scripts/seed-content.ts` | паттерн ADR-0001-seed-prod-runner: safety-gate `OBIKHOD_SEED_CONFIRM=yes`, idempotent (findOneBySlug), `set -a; . ./.env; set +a` совместим |

**Hand-off с другими track'ами:**
- W2 TOV-checker + lint:schema готовы → Track C может публиковать тексты эталонов (Track C `cw`)
- W3 эталоны на staging (Track A + B) → Track C `qa-site` прогоняет Playwright + axe + публикует benchmark

## 5 · Acceptance Criteria

> 13 групп AC, ≥30 проверяемых пунктов. Каждый AC — измеримый.

### AC-1 · Wireframes (8 файлов)

- **AC-1.1.** В `seosite/04-url-map/wireframes/` лежит 8 файлов: `pillar.md`, `sub.md`, `sd.md`, `district.md`, `blog.md`, `case.md`, `b2b.md`, `author.md`.
- **AC-1.2.** Каждый wireframe содержит: (a) ASCII-схему или ссылку на Figma-frame; (b) список блоков сверху вниз с пометкой «обязательный/опциональный» (соответствует план §«Page Templates»); (c) hierarchy H1 → H2 → H3; (d) разделение mobile vs desktop; (e) A11y-аннотации (skip-links, ARIA-роли, focus-order); (f) секция «Winning angle vs топ-3 конкурентов по этому типу» (минимум 3 буллета: что у нас есть и нет у топ-3 + ссылка на benchmark-W3-baseline).
- **AC-1.3.** Apruv-stamp в каждом файле от `art` (visual соответствие brand-guide §1-14) и `poseo` (SEO-аспект: H1, FAQPage schema slot, target keyword density зона).

### AC-2 · 7 новых блоков (реализация + Storybook)

- **AC-2.1.** В `site/components/blocks/` существуют 7 новых файлов: `ServicesGrid.tsx`, `MiniCase.tsx`, `Calculator.tsx`, `RelatedServices.tsx`, `NeighborDistricts.tsx`, `Tldr.tsx`, `Breadcrumbs.tsx`.
- **AC-2.2.** В `site/components/blocks/types.ts` добавлены 7 новых TS-типов (`ServicesGridBlock`, `MiniCaseBlock`, `CalculatorBlock`, `RelatedServicesBlock`, `NeighborDistrictsBlock`, `TldrBlock`, `BreadcrumbsBlock`) и `AnyBlock` union обновлён.
- **AC-2.3.** В `site/components/blocks/BlockRenderer.tsx` добавлены 7 новых case в switch + удалён `TODO(fe1)` комментарий о недостающих блоках.
- **AC-2.4.** Каждый новый блок имеет Storybook story в `site/.storybook/stories/blocks/<Block>.stories.tsx` с минимум 2-3 вариантами (default / loaded / empty или sm/md/lg).
- **AC-2.5.** Спецификации блоков:
  - `ServicesGrid` — список карточек sub-services под pillar (4-9 шт), иконки из реестра §9 brand-guide (services line: 22 иконки), заголовок + ссылка
  - `MiniCase` — фото + 3-4 факта (срок, бригада, объём, цена) + ссылка на `/kejsy/<slug>/`
  - `Calculator` — placeholder с TODO для US-расчёт; рендерит карточку «Калькулятор стоимости — скоро» + CTA «Запросить смету через фото»
  - `RelatedServices` — 3 карточки cross-link (на соседние pillar/sub)
  - `NeighborDistricts` — 3 ближайших района из `District.relatedDistricts`
  - `Tldr` — нейро-формат: 2-3 предложения с акцентом, eyebrow «Если коротко» / «TL;DR»; mark-up `<aside aria-label="Краткий ответ">` для нейро-цитируемости
  - `Breadcrumbs` — UI + `BreadcrumbList` JSON-LD schema (генератор из `site/lib/seo/jsonld.ts`)

### AC-3 · Миграция Payload (6 коллекций)

- **AC-3.1.** Каждая из 6 коллекций (`Services`, `Blog`, `Cases`, `B2BPages`, `Districts`, `Authors`) имеет поле `blocks: blocks` с union-типами для всех 12 блоков (5 существующих + 7 новых).
- **AC-3.2.** Для каждой коллекции существует Payload migration `site/migrations/<UTC-ts>-<collection>-blocks.ts`, переносящая legacy `body: richText` → `blocks: [{blockType:'text-content', body: <legacy>, columns:'1'}]`. Записи без legacy `body` остаются с пустым `blocks: []`.
- **AC-3.3.** `Districts.relatedDistricts: relationship[]` существует (добавлено если не было), используется в блоке `neighbor-districts`.
- **AC-3.4.** В `Cases` блок-тип `before-after` зарегистрирован в `blocks` union (опционально использован в Stage 0 — обязательно в US-3).
- **AC-3.5.** Каждая migration имеет: (a) `up()` с copy-pattern legacy → blocks; (b) `down()` rollback; (c) Pre-migration backup через `obikhod-backup.sh` (паттерн ADR-0001) до запуска на prod; (d) apruv `dba` в PR-обсуждении.
- **AC-3.6.** `pnpm generate:types` после миграции отрабатывает без ошибок, `site/payload-types.ts` содержит обновлённые union-типы.
- **AC-3.7.** TS strict pass: `pnpm type-check` зелёный во всём `site/`.
- **AC-3.8.** Smoke на staging до prod: `pnpm dev` → открыть admin → редактировать запись каждой из 6 коллекций → переключить на blocks-editor → сохранить → перезагрузить — данные сохраняются. На публичных URL из `app/` — рендеринг через `BlockRenderer` работает.
- **AC-3.9.** `publish-gate.ts` extended: правило «1 hero + 1 text-content ≥300 слов + 1 contact (lead-form/cta-banner)» работает на `ServiceDistricts` (как сейчас) и не падает на остальных 5 коллекциях (там блоки опциональные на Stage 0).

### AC-4 · Storybook

- **AC-4.1.** `pnpm storybook` локально стартует и собирается без ошибок.
- **AC-4.2.** Tailwind работает в Storybook (классы рендерятся).
- **AC-4.3.** RSC-блоки (`Hero`, `TextContent`) рендерятся в Storybook (через `next/experimental-rsc` или mock-обёртку).
- **AC-4.4.** 12 block stories: 5 существующих (Hero, TextContent, LeadForm, CtaBanner, Faq) + 7 новых = 12. Каждый имеет 2-3 варианта.
- **AC-4.5.** 8 page-type composition stories: рендерят wireframe-комбинацию блоков с реальными mock-data (без вызова Payload). Файл-расположение: `site/.storybook/stories/pages/<type>.stories.tsx`.
- **AC-4.6.** Storybook NOT публикуется в CI/Chromatic (визуальная регрессия — backlog после W14). Только локальная команда + ручная проверка.

### AC-5 · TOV-checker

- **AC-5.1.** `site/scripts/tov-checker.ts` — CLI-скрипт, принимает stdin или `--file <path>` или `--all` (рекурсивно `site/content/`, `site/seosite/`, Lexical из БД).
- **AC-5.2.** Anti-TOV regex слой: ≥30 паттернов из brand-guide §14 («Нет»-список §13 + §14 Don't), включая обязательные:
  - «услуги населению», «клиент» (в B2C-контексте), «имеем честь», «осуществляем деятельность»
  - «от 1 000 ₽», «от X ₽» (без конкретики), «в кратчайшие сроки», «как можно скорее»
  - «гарантируем качество», «индивидуальный подход», «мы дорожим репутацией»
  - «твёрдые коммунальные отходы» (B2C), «древесно-кустарниковая растительность» (B2C)
  - «цены договорные», «звоните узнавайте», «обращайтесь»
  - + ещё ~15 эвристик (восклицания «!», capslock, «🌳» эмодзи-декораторы, «Упс!», «Что-то пошло не так»)
  - Список вынесен в `site/scripts/tov-anti-patterns.json` (один файл — один источник истины), `cw` правит без правки кода.
- **AC-5.3.** LLM-pass: при пропуске regex — Claude Sonnet 4.6 (skill `claude-api` + prompt caching, ≥1024 токенов system prompt) проверяет на конкретику цифр (правило §13 #2: «не "от 1 000 ₽", а "12 800 ₽ за объект"»). Возвращает violations[] с цитатами.
- **AC-5.4.** Exit-code 1 при любом нарушении, exit-code 0 при чистом тексте. Stdout: список нарушений с file:line + цитата + «Suggested fix» (regex-replace или LLM-предложение).
- **AC-5.5.** Подключен к `.husky/pre-commit` или `.claude/hooks/protect-immutable.sh` (existing) — расширение существующего hook'а.
- **AC-5.6.** Подключен к `.github/workflows/ci.yml` job: `pnpm tov-check` запускается на PR, fail при exit-code 1.
- **AC-5.7.** Skill `claude-api` активирован при разработке скрипта, prompt caching обязателен (фиксируется в commit message).

### AC-6 · lint:schema

- **AC-6.1.** `site/scripts/lint-schema.ts` — CLI-скрипт, принимает `--url <staging-url>` или дефолт `http://localhost:3000`.
- **AC-6.2.** Берёт 30 random pages из sitemap.xml (или sample 3 на каждый из 8 типов + 6 random), парсит JSON-LD, валидирует через schema.org Validator (через библиотеку `schema-dts` + кастомный валидатор или `schema-org-validator` package).
- **AC-6.3.** Проверки: (a) JSON-LD parseable; (b) обязательные поля на тип (Article: headline+author+publisher; LocalBusiness: name+address+telephone; Service: name+provider+areaServed; FAQPage: mainEntity[].acceptedAnswer.text; BreadcrumbList: itemListElement[].position+item.name); (c) URL canonical + og:url consistent.
- **AC-6.4.** Exit-code 1 при любой ошибке, exit-code 0 при clean. Stdout: report с url + missing field + ссылка на schema.org docs.
- **AC-6.5.** В `site/package.json` добавлен script `"lint:schema": "tsx scripts/lint-schema.ts"`.
- **AC-6.6.** Подключен к `.github/workflows/ci.yml` как gate (после deploy-preview job или на main с `--url=http://staging.obikhod.ru`).
- **AC-6.7.** На W3 эталонах все 8 страниц проходят `lint:schema` clean.

### AC-7 · fal-prompts расширение

- **AC-7.1.** В `site/lib/fal/prompts.ts` добавлены 3 новые экспортируемые функции:
  - `districtHeroPrompt(districtName: string, season?: SeasonalTheme): string` — hero для District Hub (`/raiony/<district>/`); landmark + сезон + бригада в работе
  - `b2bHeroPrompt(segment: 'uk-tszh' | 'fm' | 'zastrojshchik' | 'goszakaz'): string` — hero для B2B-страниц; documentary-style, no rukopozhatie (анти-§14)
  - `companyAuthorAvatarPrompt(): string` — silhouette/back-shot для company-page «Бригада вывоза Обихода»; **никаких лиц** (privacy + бренд: «Обиход — про порядок, не про мачо»)
- **AC-7.2.** Стиль prompt-ов apruv `art` в W2 (apruv-stamp в commit message PR).
- **AC-7.3.** Prompts соблюдают §14 анти-паттерны: нет «дровосеков», «топора», «рукавиц», «рукопожатий», «листочков», «матрёшек».
- **AC-7.4.** Прогон: 1 hero для каждого нового prompt сгенерирован через fal.ai (Nano Banana Pro для hero, Standard для author silhouette) и положен в `site/public/images/etalons-W3/` для эталонов.

### AC-8 · Slug migration `ochistka-krysh` → `chistka-krysh`

- **AC-8.1.** Payload migration `site/migrations/<ts>-slug-chistka-krysh.ts` обновляет `Services` запись с slug `ochistka-krysh` на `chistka-krysh` (если запись существует; idempotent если уже `chistka-krysh`).
- **AC-8.2.** В коллекцию `Redirects` добавлена запись 301 `/ochistka-krysh/*` → `/chistka-krysh/*` (с wildcard + всеми SD-вариантами `/ochistka-krysh/<district>/`).
- **AC-8.3.** `next.config.ts` `redirects()` обновлён (если используется static-redirects вместо runtime middleware) или middleware читает Redirects collection.
- **AC-8.4.** Sitemap.xml регенерирован (через `pnpm build` или dev-runtime), все URL содержат `chistka-krysh`, нет `ochistka-krysh`.
- **AC-8.5.** Smoke на staging: `curl -I https://staging.obikhod.ru/ochistka-krysh/` → 301 → `/chistka-krysh/`. Прогон Playwright: 0 broken-links на всём сайте (`linkinator` или `pa11y-ci`).
- **AC-8.6.** Apruv `dba` (миграция БД) + `seo-tech` (sitemap + robots.txt не блокирует).

### AC-9 · Topvisor + Я.Метрика

- **AC-9.1.** Topvisor проект «Обиход — services» создан в существующем аккаунте (подписка действует, см. memory `project_seo_stack.md`).
- **AC-9.2.** 200 ключей загружены: 4 pillar (vyvoz-musora / arboristika / chistka-krysh / demontazh) × top-50 по wsfreq из `seosite/03-clusters/<pillar>.md`. Источник wsfreq — Wordstat XML + Just-Magic, файлы фиксируются в `seosite/02-wordstat/`.
- **AC-9.3.** Регион: Я.Москва+МО.
- **AC-9.4.** Baseline snapshot W2 зафиксирован в `seosite/08-monitoring/topvisor-baseline-W2.md` (CSV-export или скриншот таблицы).
- **AC-9.5.** Я.Метрика 8 целей сконфигурированы:
  1. `lead_form_submit` — событие на `/api/leads` POST 200
  2. `foto_smeta_upload` — отправка формы на `/foto-smeta/`
  3. `tg_click` — клик по Telegram-CTA
  4. `wa_click` — клик по WhatsApp-CTA
  5. `max_click` — клик по MAX-CTA
  6. `phone_click` — клик по `tel:` ссылке
  7. `calculator_open` — открытие модалки калькулятора (placeholder)
  8. `blog_faq_expand` — раскрытие FAQ на blog-странице
- **AC-9.6.** Каждая цель видна в Я.Метрике интерфейсе и срабатывает на staging-прогон (тестовый клик — событие в real-time).
- **AC-9.7.** Документация целей и счётчик ID в `seosite/08-monitoring/ya-metrika-goals.md`.

### AC-10 · Authors seed

- **AC-10.1.** В `Authors` коллекции 2 записи:
  1. **Company-page «Бригада вывоза Обихода»** — `slug: brigada-vyvoza-obihoda`, `name: «Бригада вывоза Обихода»`, `kind: organization` (или поле-discriminator), `avatar` — silhouette из `companyAuthorAvatarPrompt`, `schema: Person → Organization` (через JSON-LD generator), `knowsAbout: [«вывоз мусора», «арбористика», «чистка крыш», «демонтаж»]`, `worksInDistricts: [все 8 districts]`, `bio: ~200 слов`, без `sameAs`.
  2. **Оператор как реальный B2B-автор** — реальное ФИО оператора (получает `cms` через `poseo` ⇒ оператор на отмашку приватно), `slug: <name-slug>`, `kind: person`, `avatar` — silhouette/back-shot, `sameAs: [VK_URL, TG_URL]` обязательно (реальные якоря — критическое отличие от cleaning-moscow.ru), `bio` отражает 4-в-1 опыт + годы в нише.
- **AC-10.2.** Schema JSON-LD на `/avtory/<slug>/`: для company — `Organization` с `subOrganization` ссылкой на основной `Organization` Обихода; для оператора — `Person` с `worksFor: { @type: Organization, name: «Обиход» }`.
- **AC-10.3.** Cross-link: оператор как автор на ≥3 B2B-страницах (`/b2b/uk-tszh/`, `/b2b/dogovor/`, `/b2b/shtrafy-gzhi-oati/`) — через `B2BPages.author: relationship to Authors`.
- **AC-10.4.** Apruv оператора по реальному имени и фотобэку (silhouette) до publish на staging.
- **AC-10.5.** TOV-checker pass на bio-текстах обеих авторов.

### AC-11 · 8 эталонных страниц на staging

- **AC-11.1.** На staging-инстансе (URL подтверждается `do` в W2 — см. AC-13.1) опубликованы 8 URL:
  - `/vyvoz-musora/` (pillar-эталон)
  - `/vyvoz-musora/staraya-mebel/` (sub-эталон)
  - `/vyvoz-musora/odincovo/` (SD-эталон)
  - `/raiony/odincovo/` (district-эталон)
  - `/blog/chto-takoe-4-v-1/` (blog-эталон, тема #1 темника)
  - `/kejsy/snyali-pen-v-gostice/` (case-эталон, mock-case из существующего seed)
  - `/b2b/uk-tszh/` (B2B-эталон)
  - `/avtory/brigada-vyvoza-obihoda/` (author-эталон)
- **AC-11.2.** Каждый URL рендерится через `BlockRenderer` (не через legacy `body: richText`).
- **AC-11.3.** Каждый URL проходит TOV-checker clean (exit 0).
- **AC-11.4.** Каждый URL проходит lint:schema clean (все обязательные schema-типы валидны).
- **AC-11.5.** Каждый URL проходит axe-core: **0 violations** (severity ≥ minor).
- **AC-11.6.** Playwright screenshots сделаны и положены:
  - `screen/etalons-W3/<type>-desktop.png` (1920×1080)
  - `screen/etalons-W3/<type>-mobile.png` (375×812 iPhone-like viewport)
  - `screen/etalons-W3/axe-violations-<type>.json` — отчёт axe (должен быть `{ violations: [] }`)
- **AC-11.7.** SD-страница (`/vyvoz-musora/odincovo/`) проходит publish-gate: 1 hero + 1 text-content ≥300 слов + 1 contact (lead-form ИЛИ cta-banner) + mini-case + ≥2 localFaq. Подтверждается в админке без error при publish.
- **AC-11.8.** Лeadform на эталонах подключен к Telegram-уведомлению (US-8 MVP, см. memory `project_us8_no_amocrm_mvp.md`); тестовая отправка → событие в Telegram-канале оператора.

### AC-12 · W3 Competitor Benchmark Baseline + Differentiation Matrix v1

- **AC-12.1.** Файл `seosite/01-competitors/benchmark-W3-baseline.md` опубликован, содержит:
  - Сводную таблицу 17 конкурентов × 5 осей (URL-объём / контент-глубина / E-E-A-T / UX / schema-coverage)
  - Числовые метрики (см. план §«Методология»):
    - URL-объём: всего URL у конкурента + по категориям; **% покрытия = (наши URL / конкурент) × 100%** (ожидаемо ~5-15%)
    - Ключевые слова: топ-100 ключей конкурента, пересечение с нашим семядром (1601 ключ), топ-10 «утерянных»
    - Контент-следы: блог (кол-во + объём + FAQ/TLDR), кейсы, авторы, schema-типы, B2B-сегменты
    - Позиции: Topvisor 200 ключей × 17 конкурентов из плана
  - Топ-3 priority gap для Stage 1 (что закрываем первым в US-1)
  - Топ-3 для DoD-цели опережения — фиксируется на baseline (гипотеза: musor.moscow + liwood.ru + fasadrf.ru — peresобираем если данные показывают другое)
  - Сырые данные в `seosite/01-competitors/raw/` (Keys.so CSV-export, ручные site:scan дампы)
- **AC-12.2.** Файл `seosite/01-competitors/differentiation-matrix.md` v1 опубликован, содержит:
  - Матрицу 17 × 5 с пометками «копируем / превосходим / unique»
  - 8 уникальных «winning angles» Обихода (фото→смета, 4-в-1, штрафы ГЖИ, programmatic 4 услуги × 8 районов, реальный B2B-автор, Caregiver+Ruler TOV, block-based архитектура, нейро-цитируемость)
  - Секцию «Что копируем у каждого из 17» (с явной формулировкой «как именно лучше»)
- **AC-12.3.** На каждом из 8 wireframes (AC-1) есть ссылка на benchmark + матрицу в секции «Winning angle vs топ-3».

### AC-13 · Operator gate

- **AC-13.1.** Staging-инстанс работает на отдельной Beget-инстанс или branch-deploy (URL устанавливает `do` в W2 — например `staging.obikhod.ru` или `obikhod-staging.obikhod.ru`). Доступен оператору через ссылку (HTTP basic-auth ОК для preview).
- **AC-13.2.** В `specs/EPIC-SEO-CONTENT-FILL/US-0-templates-ux-migration/operator-review.md` (создаёт `poseo` в W3) собраны:
  - 8 staging URL списком
  - 8 пар desktop+mobile screenshots inline или ссылками на `screen/etalons-W3/`
  - benchmark-W3-baseline.md ссылкой
  - differentiation-matrix.md ссылкой
  - 8 axe-violations отчётов (должны быть пустые)
  - Чек-лист «что апрувить»: TOV / визуал / структура / SEO-мета / lead-form работа
- **AC-13.3.** Оператор на встрече или асинхронно через файл-комментарий апрувит ИЛИ возвращает корректировки. Hard gate: **без явного «apruv» от оператора Stage 1 не стартует**.
- **AC-13.4.** Если возврат — `poseo` распределяет правки по track'ам, новый review-цикл за ≤5 рабочих дней (буфер до 2026-05-29).

## 6 · Hand-off план (phase transitions)

```
[2026-05-01] poseo → sa-seo
  · фаза: spec
  · артефакт: этот файл (sa-seo.md)

[2026-05-04] sa-seo → poseo (apruv sa-spec)
  · фаза: spec → planning
  · апрув: poseo читает spec, апрувит, переключает phase

[2026-05-05] poseo → tracks parallel start
  · фаза: planning → dev (3 track'а параллельно)
  · Track A → ux + art + ui (wireframes W1)
  · Track B → popanel + be-panel + dba (миграции W1)
  · Track C → seo-tech + seo-content + re (TOV-checker + benchmark W1-W2)

[2026-05-12] tracks → poseo (W2 readiness)
  · 8 wireframes apruv от art
  · 7 блоков реализованы, 6 миграций готовы (smoke staging clean)
  · TOV-checker + lint:schema CI green
  · Topvisor baseline + Я.Метрика 8 целей
  · benchmark-W3-baseline draft

[2026-05-15] poseo → cw + ui + fe-site (эталоны W3)
  · фаза: dev (эталоны)
  · cw пишет 8 живых текстов
  · ui собирает страницы с цветовыми макетами
  · fe-site публикует на staging

[2026-05-19] poseo → qa-site (Playwright + axe)
  · фаза: dev → qa
  · qa-site прогоняет Playwright, делает screenshots в screen/etalons-W3/
  · axe-core 0 violations подтверждён

[2026-05-21] poseo → cr-seo (review)
  · фаза: qa → review
  · cr-seo (если существует — иначе cr-site cross-team) делает code review

[2026-05-22] poseo → operator (gate)
  · фаза: review → gate
  · operator-review.md собран
  · Hard gate: оператор apruv → US-1 starts; reject → revise loop

[2026-05-22] operator → poseo (apruv) → US-1 stub created
  · фаза: gate → done
  · poseo обновляет phase: done в этом sa-spec
  · US-1-pillars-pilot/sa-seo.md → новая sa-spec, sa-seo переключается на US-1
```

## 7 · Cross-team зависимости и эскалации

| Зависимость | Owner-team | Риск | Эскалация |
|---|---|---|---|
| Миграция 6 коллекций Payload | `panel` (popanel + be-panel + dba) | **Критический блокер** Stage 0 | Оператор подтвердил 2026-05-01 что panel-волна свободна. Если возникает конфликт — `poseo` пингует `cpo` (но не должно понадобиться) |
| Apruv 8 wireframes от `art` | `design` (art lead) | Блокер для `ui` цветовых макетов и `fe-site` блок-реализации | `poseo` → `art` напрямую (cross-team agent через WORKFLOW); если задержка ≥2 дня — `poseo` пингует `cpo` |
| Apruv fal.ai prompt-стиль от `art` | `design` (art) | Блокер для `seo-tech` и публикации эталонов с hero | то же |
| Apruv миграций БД от `dba` | `common` (dba) | Блокер для prod-deploy миграций | `poseo` → `dba` через popanel (panel team внутри); rollback strategy фиксирована в каждом migration PR |
| Real имя + фото-back оператора для Authors | оператор | Блокер для Author-эталона | `poseo` запрашивает приватно; до получения — placeholder в seed |
| Telegram-bot + chat_id для US-8 MVP lead-form | `do` + `popanel` | Блокер для AC-11.8 | Если не готово к W3 — fallback: эталон лид-формы рендерит, но submit пишет в БД без TG; full TG переносится в US-1 |
| Staging URL/domain | `do` | Блокер для AC-11 / AC-13 | `do` готовит к W2 (subdomain `staging.obikhod.ru` или `obikhod-staging.obikhod.ru` или branch-deploy на отдельном порту); HTTP basic-auth OK для preview |
| skill `claude-api` prompt caching обязательно для TOV-checker LLM-pass | `seo-tech` | Cost overrun без кэша | Документирую в commit-message + PR-описании; `qa-site` проверяет в логах |

## 8 · Риски

### R1 — Scaled Content Abuse demote (P=0.5, High; в эпике P=0.7, но в US-0 ниже потому что только 8 эталонов)

**Описание:** Google-демоут за «многократно похожий контент по шаблону». 8 эталонов — слишком мало для демоута, но если шаблон wireframe не оставляет места для уникальности, в Stage 2 batch ~150 SD словит penalty.

**Митигация:**
- Wireframe SD (`sd.md`) обязан содержать «50% shared base + 50% district-specific блоки» (см. план §«Programmatic SD»)
- В каждый wireframe — секция «Slots для уникальности»: где district-name + landmark, где локальный кейс, где local-FAQ, где время выезда, где legislation МО
- Publish-gate активен с W3 (mini-case + ≥2 localFaq)
- W3 эталон SD `/vyvoz-musora/odincovo/` пишется как **прецедент уникальности** — 1500 слов с 50%+ district-specific

### R2 — UX-эталон не апрувится оператором с 1-й попытки (P=0.4, Medium)

**Описание:** Оператор возвращает 8 эталонов на доработку → буфер сжимается → US-1 откладывается.

**Митигация:**
- W1 wireframe-уровень apruv от `art` + `poseo` ДО реализации (защищает структуру)
- W2 цветовые макеты apruv `art` ДО staging-deploy (защищает визуал)
- W3 на staging оператор смотрит уже пятую итерацию шаблона; если возвращает — `poseo` фиксирует точные правки в `operator-review.md`, распределяет по track'ам, новый review-цикл ≤5 раб. дней (target W4 W1)
- В буфер заложено 5 рабочих дней до Stage 1 W4

### R3 — Миграция Payload 6 коллекций ломает legacy-данные (P=0.5, High)

**Описание:** Legacy `body: richText` некорректно преобразуется в `[{blockType:'text-content', body}]`, пропадает данные или Lexical-state не загружается.

**Митигация:**
- Pre-migration backup (`obikhod-backup.sh`, паттерн ADR-0001) до запуска `up()` на prod
- `down()` rollback во всех 6 migration файлах, тестируется на копии БД
- Smoke на staging до prod: full migration cycle на staging-инстансе с продакшен-копией БД
- Apruv `dba` обязательный (без apruv — PR не мерджится)
- Если миграция ломается → rollback через `pg_restore` (paттерн ADR-0001 §rollback) → переписываем migration → новый PR

### R4 — `popanel` занят на parallel-задачах (P=0.3, Medium)

**Описание:** Panel-волна (PANEL-AUTH-2FA → PANEL-AUDIT-LOG → ...) перетягивает popanel внимание; миграции тормозят.

**Митигация:**
- Оператор подтвердил 2026-05-01 что panel-волна свободна (memory `project_panel_decisions_2026-05-01.md`)
- `poseo` фиксирует приоритет US-0 в panel/integration roadmap
- Если возникает конфликт — эскалация `cpo`
- Buffer: 3 недели (W1-W3) для 6 миграций с резервным временем

### R5 — TOV-checker LLM-pass cost overrun (P=0.3, Medium)

**Описание:** LLM-pass на конкретику цифр без кэша = ~$0.01-0.05 за вызов × 8 эталонов × N итераций redactions × 100% review pillar = $5-20. Без скидки на kэш, если каждый вызов — fresh — на batch 250 URL вырастает в $300+.

**Митигация:**
- Skill `claude-api` обязателен; prompt caching на ≥1024 токенов system prompt (rules §13/§14 + примеры)
- Cache-hit rate target ≥80% после 5 вызовов
- LLM-pass только если regex layer пропустил (cascade)
- Cost monitoring через Sonnet 4.6 usage в logs; если в Stage 0 burn >$5 — анализ + сжатие prompt

### R6 — Storybook + RSC-блоки несовместимы (P=0.3, Medium)

**Описание:** RSC-блоки (Hero, TextContent с Lexical) могут не рендериться в Storybook без mock-обёртки.

**Митигация:**
- Storybook 8.x experimental RSC support (`@storybook/nextjs-vite` или wrapper)
- Если не работает — пишем mock-обёртку: client-side stub для async server components (паттерн известен)
- Fallback: 5 базовых блоков рендерим в Storybook полно, RSC-блоки — через статический snapshot (`renderToStaticMarkup`)

### Топ-5 для эпика (из плана §«Критические риски») — здесь зафиксированы:
- R3 (миграция Payload) — детализирован выше
- R4 (UX-эталон) — детализирован выше
- R1 (Scaled Content Abuse) — детализирован выше с зацепкой на Stage 2

## 9 · Definition of Done

- [ ] Все 13 групп AC закрыты (≥30 пунктов)
- [ ] Hand-off log заполнен (см. §10)
- [ ] 8 эталонных URL apruv'нуты оператором (AC-13.3)
- [ ] Track A / B / C закрыты, deliverables в репозитории
- [ ] PR'ы Track B (миграции) merge'нуты в `main` через `do` (CI green: type-check + lint + format:check + test:e2e --project=chromium)
- [ ] PR'ы Track A (блоки + Storybook) merge'нуты в `main`
- [ ] PR'ы Track C (TOV-checker + lint:schema + slug migration + Authors seed) merge'нуты в `main`
- [ ] Все 4 staging-screenshot папки готовы: `screen/etalons-W3/<type>-{desktop,mobile}.png` × 8 типов
- [ ] benchmark-W3-baseline.md + differentiation-matrix.md v1 опубликованы и cross-link'ed из wireframes
- [ ] Topvisor baseline-snapshot W2 + Я.Метрика 8 целей видны в дашбордах
- [ ] `pnpm lint:schema` зелёный на 30 random pages
- [ ] `pnpm tov-check` зелёный на содержимом всех 8 эталонов
- [ ] `pnpm storybook` локально работает (12 + 8 stories)
- [ ] `pnpm generate:types` без ошибок после всех 6 миграций
- [ ] Передача в US-1 готова: `specs/EPIC-SEO-CONTENT-FILL/US-1-pillars-pilot/` создана, `sa-seo` пишет US-1 sa-spec
- [ ] Phase: gate → done (poseo обновляет frontmatter)

## 10 · Hand-off log

- `2026-05-01 21:20 · poseo → sa-seo: написать sa-spec для US-0 (Stage 0 W1-W3); skills [seo, architecture-decision-records, api-design, product-capability]; эталон артефакта по template из team/seo/sa-seo.md`
- `2026-05-01 22:30 · sa-seo → poseo: sa-spec готов для review; активированы skills [seo, architecture-decision-records, api-design, product-capability]; spec покрывает 13 AC групп, 3 track'а, hard gate на operator apruv для 8 эталонов; ждёт apruv poseo для phase: spec → planning`
- `2026-05-01 22:45 · poseo → poseo: review выполнен. 6 из 8 открытых вопросов закрыты (см. §12). Оставшиеся 2: (a) имя оператора для Authors — поставлен запрос оператору, tracks стартуют с placeholder; (b) staging URL — делегировано do (см. ниже). phase: spec → dev. Apruv для запуска параллельных tracks A/B/C.`
- `2026-05-01 22:45 · poseo → operator: запрос на имя/VK/TG для B2B-автора (Authors seed). Deadline для замены placeholder — W2 W3.`
- `2026-05-01 22:50 · operator → poseo: «Даём позже к W2/W3» — tracks стартуют с placeholder «Georgy S. + VK TBD + TG TBD», cms заменяет до Operator gate W3.`
- `2026-05-01 22:45 · poseo → do: задача на (1) ветку feature/seo-content-fill-stage-0 от main; (2) staging-инстанс на subdomain staging.obikhod.ru на Beget VPS со стандартным паттерном prod-деплоя; deadline W2 (2026-05-15).`
- `2026-05-01 22:45 · poseo → ux + ui + art: запуск Track A (UX/Design) — 8 wireframes + 7 новых блоков + Storybook + цветовые макеты. AC-1, AC-2, AC-4, AC-7. Skill-check обязателен.`
- `2026-05-01 22:45 · poseo → popanel + be-panel + dba + fe-site через podev: запуск Track B (Tech/Migration) — миграция 6 коллекций + 7 рендереров блоков. AC-2, AC-3. Skill-check обязателен. dba apruv каждой migration.`
- `2026-05-01 22:45 · poseo → seo-tech + seo-content + re + cms + cw: запуск Track C (SEO Infra) — TOV-checker, lint:schema, slug migration, Topvisor, Я.Метрика, Authors seed (placeholder), W3 benchmark live audit. AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-12.`

## 11 · Открытые вопросы для poseo (требуют решения до старта tracks)

1. **Staging URL.** Кто конкретно (`do` через `cpo` или `do` напрямую) и до какого числа W2 готовит staging-инстанс? Subdomain `staging.obikhod.ru` или branch-deploy через GitHub Actions? Решение нужно к 2026-05-08, иначе AC-11 в риске.

2. **Реальное имя + фото-back оператора для Authors.** Как именно `cms` получает приватные данные (имя оператора, VK URL, TG URL)? Через `poseo` приватно или через operator → cms напрямую вне specs/? До получения — `poseo` использует placeholder; deadline для замены — W2 W3.

3. **Telegram bot + chat_id для US-8 MVP lead-form.** Готов ли US-8 MVP к W3? Если нет — лид-форма на эталонах рендерит, но submit идёт только в БД без TG. Решение нужно к W2.

4. **«Бригада вывоза Обихода» bio (~200 слов).** Кто пишет — `cw` или `cpo` (если cpo воспринимается как brand-voice owner)? Sa-seo считает: `cw` пишет, `art` apruvит TOV, `poseo` apruvит SEO-аспект.

5. **`Cases.before-after` блок-тип в Stage 0 — обязательно или опционально?** Sa-seo текущий вариант: опционально (используется в US-3). Если оператор хочет видеть в эталоне `/kejsy/snyali-pen-v-gostice/` — переводим в обязательно (расширяет track B на ~0.5 дня).

6. **Storybook без CI/Chromatic.** Sa-seo считает: Storybook только локальный, Visual Regression CI — backlog после W14. Подтверждение от `poseo` нужно (если кто-то хочет CI Chromatic — track A расширяется на 1-2 дня).

7. **`payload migrate` workflow в проекте.** Memory `project_cicd_backlog.md` упоминает Payload migrations как пункт CI/CD backlog. ADR-0001 говорит — current state — `push: true`, не managed migrations. `dba` + `tamd` apruv нужен ли менять `payload.config.ts` на managed migrations прямо сейчас (US-0) или используем `payload migrate:create` локально без переключения config? Sa-seo рекомендует: используем как есть (`push: true` остаётся, ad-hoc migration scripts через `tsx` + Payload Local API), не меняем config; этот вопрос — отдельная US в backlog.

8. **Чек-листы axe-core severity threshold.** AC-11.5 говорит «0 violations severity ≥ minor». Подтверждение — minor, или строже (только critical/serious)? Sa-seo: minor — точно блокирует gate; serious / critical — однозначно блок.

---

**ADR-кандидаты, которые рождаются из US-0 (фиксируются `tamd` после tracks):**
- ADR-XXXX: блочная архитектура для 6 коллекций (паттерн расширения BlockRenderer + миграция legacy → blocks[])
- ADR-XXXX: TOV-checker (regex + LLM cascade с prompt caching)
- ADR-XXXX: lint:schema CI gate (схема валидации + integration в ci.yml)
- ADR-XXXX: Authors company-page как Person→Organization schema (E-E-A-T pattern с silhouette-аватаром)

Эти ADR пишет `tamd` (cross-team consult) ПОСЛЕ закрытия US-0, на основании реализации. В sa-spec не входят — фиксируется как backlog для `tamd`.

---

## 12 · Решения poseo по открытым вопросам (2026-05-01)

После review sa-spec poseo закрывает 8 открытых вопросов:

1. **Staging URL.** ✅ Делегировано `do` параллельно с tracks: subdomain `staging.obikhod.ru` на Beget VPS (стандартный паттерн prod-деплоя), отдельный port. Deadline W2 (2026-05-15). См. Hand-off log → do.

2. **Реальное имя + VK/TG оператора для Authors.** 🟡 Поставлен запрос оператору 2026-05-01 (см. Hand-off log). Tracks стартуют с placeholder. Замена в Authors seed — W2 W3 до Operator gate.

3. **Telegram bot для US-8 MVP.** ✅ Не блокер W3. Lead-form на эталонах рендерит, submit идёт в БД (Leads collection). TG/MAX интеграция — отдельная US-8 после W14.

4. **Bio «Бригада вывоза Обихода» (~200 слов).** ✅ `cw` пишет → `art` apruvит TOV § §13/§14 → `poseo` apruvит SEO-аспект. (Sa-seo рекомендация принята.)

5. **`Cases.before-after` блок Stage 0.** ✅ Опционально в Stage 0 (план §«Что НЕ делаем»: «Calculator-блок реальная логика — placeholder; реализация в отдельной US»). before-after — аналогичный паттерн: schema готова, рендерер минимальный, реальная фотогалерея в US-3 W11. (Sa-seo рекомендация принята.)

6. **Storybook без CI Chromatic.** ✅ Только локальный (`pnpm storybook`). Visual Regression CI (Chromatic / Percy) — backlog после W14 (явно зафиксировано в плане §«Что НЕ делаем»). (Sa-seo рекомендация принята.)

7. **`payload migrate` workflow.** ✅ Не меняем `payload.config.ts` (`push: true` остаётся). Ad-hoc migration scripts через `tsx` + Payload Local API + обязательный preload `_payload-cjs-shim.cjs` (ADR-0009). Управляемые migrations — отдельная backlog-US для `tamd` после W14. (Sa-seo рекомендация принята.)

8. **axe-core severity threshold.** ✅ Threshold = `minor` блокирует gate (как sa-seo предложил). Critical/serious — однозначный блок. Moderate — собирается в отчёт, не блокирует индивидуально, но не должно быть в pillar/SD/B2B (фиксируется в US-3+ при batch).

**Phase transition:** sa-spec apruv от `poseo` 2026-05-01 → `phase: dev` для всех 3 tracks (UX/Tech/SEO-Infra).
