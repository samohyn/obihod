---
us: US-4
epic: EPIC-SEO-CONTENT-FILL
title: Stage 3 W14 — E-E-A-T + neuro-SEO + monitoring + final sweep + W14 operator gate
team: seo
po: poseo
sa: sa-seo
type: tech-seo
phase: planning
role: poseo
status: open
priority: P0
moscow: Must
segment: services
created: 2026-05-03
updated: 2026-05-03
target_finish_w14: 2026-07-31
blocks: []
blocked_by: [US-3-priority-b-districts]
related: [US-6-competitor-benchmark]
skills_activated: [seo, architecture-decision-records, market-research, blueprint, project-flow-ops]
---

# US-4 · Stage 3 W14 — E-E-A-T + neuro-SEO + monitoring + final sweep + W14 operator gate

> **Финальный artefact-конвейер эпика `EPIC-SEO-CONTENT-FILL`.** US-3 закрыл production-волну priority-B (211 URL published + closure 85.4% к liwood медиане + 4/5 axes confirmed на W13). US-4 закрывает оставшиеся 2 axes (E-E-A-T parity → опережение vs cleaning-moscow, content-depth partial → confirmed +20%) + строит sustainable monitoring инфраструктуру (Topvisor / Я.ВебМастер / Я.Метрика 8 целей / GSC fallback) + проводит final SEO-tech sweep + собирает **operator-gate-W14 пакет** (финальный artefact эпика). Без US-4 эпик закрывается на W13 «4/5 confirmed» — но без monitoring sustainable trend post-EPIC и без E-E-A-T опережения (которое — главная W14 ось по operator mandate).

---

## 1 · Цель US-4

Произвести **финальный artefact-конвейер** эпика — закрыть 4 параллельных блока работ + собрать operator-gate-W14 пакет:

1. **E-E-A-T hub** (`seosite/06-eeat/` 5 артефактов + on-site `/komanda/` + `/sro-licenzii/` + Authors hub финализация) — закрывает E-E-A-T axis parity → опережение vs cleaning-moscow.
2. **Neuro-SEO foundation** (`seosite/07-neuro-seo/` 3 артефакта) — codifies SGE/AI-overviews/SearchGPT readiness pattern; готовит шестую axis (neuro-citability) для post-EPIC tracking.
3. **Monitoring** (`seosite/08-monitoring/` 4 артефакта + 8 целей Я.Метрики) — sustainable trend tracking infrastructure post-EPIC.
4. **Final SEO-tech sweep** — sitemap.xml ≥230 URL финал + lint:schema 0 errors / 0 warns на 100% URL + canonical/redirect/robots audit clean.

И собрать **operator-gate-W14.md** пакет — финальный отчёт по 5 осям опережения с numbers + screenshots + benchmark vs 17 конкурентов + recommendation epic close.

US-4 связан с US-3 как **«production → finalize»**:
- US-3 W13 закрыл axis URL-объём (closure 85.4%) и axis content-depth до partial-confirmed → US-4 закрывает content-depth до **confirmed +20%** через final aggregate calculation
- US-3 НЕ трогал axis E-E-A-T → US-4 закрывает её через E-E-A-T hub + on-site страницы + operator real-name escalation
- US-3 НЕ строил monitoring → US-4 финализирует setup через `seosite/08-monitoring/` + aemd cross-team

US-4 — **первый US в эпике, где artefact-конвейер преобладает над content-конвейером**: 12 артефактов в `seosite/` + 4 on-site страницы (Stage 1 fixtures sustained) + 1 финальный benchmark + 1 operator-gate пакет. Code/CMS изменения минимальны (Я.Метрика goals + meta-теги E-E-A-T страниц).

## 2 · Бизнес-цель

Operator W14 hard gate (sustained 2026-05-02): **«опережение топ-3 по ≥3 из 5 осей»**. После W13 уже **4/5 axes confirmed**:

| Ось | W11 status | W13 status (после US-3) | W14 target (US-4) |
|---|---|---|---|
| Schema-coverage | ✅ confirmed +50pp | ✅ sustained | sustained |
| UX foto-smeta USP | ✅ confirmed | ✅ sustained | sustained |
| 4-в-1 multi-pillar | ✅ confirmed | ✅ sustained | sustained |
| **URL-объём** | 🟡 closure 48.2% | ✅ **confirmed досрочно** (closure 85.4%, target ≥75%) | sustained |
| **Content-depth** | 🟡 +17% vs liwood | 🟡 partial confirmed | ✅ **confirmed +20%** |
| **E-E-A-T** | 🟡 parity | 🟡 sustained parity | 🎯 **опережение** (escalation if operator pending) |

**Текущий статус 4/5 confirmed = эпик уже PASS на W14 hard gate ≥3/5.** Цель US-4:
- Финализация **5/5** (или **4/5 + sustainable** при operator pending E-E-A-T)
- Sustainable monitoring инфраструктура для post-EPIC trend tracking (без неё «обгон» — единичный snapshot, не процесс)
- Финальный operator-gate-W14 пакет — формальный artefact для epic close decision

| Требование | Почему | Где проверяется |
|---|---|---|
| 5 артефактов E-E-A-T hub `seosite/06-eeat/` | Codifies реальные авторы / СРО / ИНН/ОГРН / методики — основа axis E-E-A-T | AC-1.x |
| On-site `/komanda/` + `/sro-licenzii/` + Authors hub финализация | Stage 1 fixture готов от Wave 0.2 (route HTTP 200) — нужна content+JSON-LD финализация | AC-2.x |
| 3 артефакта neuro-SEO foundation `seosite/07-neuro-seo/` | Codifies SGE/AI-overviews readiness pattern для post-EPIC neuro-citation tracking | AC-3.x |
| 4 артефакта monitoring `seosite/08-monitoring/` + 8 целей Я.Метрики | Sustainable trend infrastructure: Topvisor 200-key dashboard или fallback methodology + Я.ВебМастер + GSC + Метрика goals | AC-4.x |
| Final SEO-tech sweep (lint:schema 0 warns / sitemap ≥230 URL / canonical/redirect/robots) | Iron rule sustained от Stage 2 W11 — финальная сверка после Stage 3 production | AC-5.x |
| W14 Competitor Benchmark Final + differentiation-matrix v4 | Финальный artefact для operator gate — 5 осей × 17 конкурентов с real numbers | AC-6.x |
| E-E-A-T axis опережение vs cleaning-moscow | Главная W14-ось — без operator real-name + VK/TG sameAs E-E-A-T parity, не опережение | AC-7.x (Soft если operator pending) |
| Content-depth axis confirmed +20% vs liwood | Завершение axis sustained от Stage 2 partial +17% | AC-8.x |
| URL-объём axis sustained (W13 already confirmed 85.4%) | Auto-PASS — ничего не теряется в US-4 | AC-9.x |
| Operator gate W14 пакет ready (`operator-gate-W14.md`) | Финальный artefact epic close — без него operator не апрувит close | AC-10.x |
| ≥3 из 5 axes confirmed → EPIC DoD PASS | Hard gate operator mandate; W13 already 4/5 confirmed = auto-PASS | AC-11.x |
| Hand-off log актуален + memory updated | Sustained iron rule | AC-12.x |

US-4 — **«формальный artefact» finalize layer**: «опережение» становится sustained measurable процессом, а не разовым snapshot.

## 3 · Scope (~12 артефактов + on-site finalize + W14 benchmark + operator-gate пакет)

> Объёмные оценки: 4 параллельных tracks W14 day 1-7 (E-E-A-T + neuro-SEO + monitoring + final sweep). cw bottleneck низкий (artefact-only writing, не page-level content); aemd cross-team на 8 целей Я.Метрики.

### 3.1 · E-E-A-T hub (`seosite/06-eeat/` 5 артефактов)

> Цель: codifies реальные authority/expertise signals в навигируемом hub-формате. Все 5 артефактов — markdown в `seosite/06-eeat/`, не on-site страницы (on-site — §3.2). Они служат **источником данных для on-site финализации** + ADR-источником для будущих изменений.

#### 3.1.1 · `06-eeat/authors.md` — реальные авторы

**Содержание:**
- **Author 1: «Бригада вывоза Обихода»** (company-page) — sustained Stage 1 default. JSON-LD `Organization` с `legalName` + `taxID` (ИНН) + `address` + `telephone` + `email` + `sameAs` (VK / Telegram channel — пока placeholder, replace после operator W14 day 3).
- **Author 2: оператор (real-name)** — pending operator action W14 day 1. JSON-LD `Person` с `name` + `jobTitle` («Основатель / Директор Обиход») + `sameAs` (VK / Telegram personal — pending) + `worksFor` (→ Organization из Author 1).
- **Author 3: бригадир (real-name)** — pending operator action W14 day 1-3. JSON-LD `Person` с `name` + `jobTitle` («Старший бригадир») + `worksFor` + cross-link на cases где он участвовал.
- **Структурная схема:** Person → worksFor → Organization → sameAs cross-domain (VK/TG); Organization → founder → Person; Cases → author → Person.
- **Mapping на on-site:** info-cluster blog (info, без commercial intent) → Author 1 (company-page); commercial-bridge blog (B2B-крючки, ФККО, СРО) → Author 2 (operator); cases B2B → Author 2 + Author 3 (если применимо).

**Acceptance:** артефакт содержит full structured data spec + Mermaid-граф relationships + TODO-checklist для cms (replace placeholders в существующих 17 blog + 14 cases authors).

#### 3.1.2 · `06-eeat/credentials.md` — СРО / лицензии / ИНН-ОГРН

**Содержание:**
- **СРО номер (если применимо)** — pending operator action W14 day 1. На on-site `/sro-licenzii/` страница sustained Wave 0.2 fixture; здесь codifies номер + дата вступления + название СРО + ссылка на реестр НОСТРОЙ/НОПРИЗ.
- **Лицензии** — если есть (МЧС / Росприроднадзор для ФККО) — pending operator action; placeholder с TODO.
- **ИНН** — sustained 7847729123 (СПб, временный, memory `project_inn_temp.md`). **Решение sa-seo:** заменить на МО-ИНН после operator переезда юрлица; до этого — placeholder с явным `<!-- TODO replace МО-ИНН после operator decision -->`.
- **ОГРН** — pending; placeholder.
- **Структурная схема:** Organization → identifier (ИНН) + identifier (ОГРН) + hasCredential (СРО номер как `EducationalOccupationalCredential`).
- **Mapping на on-site:** footer (sustained §33 brand-guide site-chrome) + `/sro-licenzii/` body + B2B `/b2b/dogovor/` + `/avtory/<operator>/`.

**Acceptance:** артефакт содержит structured data spec + TODO-checklist для cms + явный escalation log (operator pending status).

#### 3.1.3 · `06-eeat/team-bios.md` — био бригадиров и инженеров

**Содержание:**
- 3-5 бригадиров — pending operator real-names. Sa-seo recommendation: до operator передачи real-names — **hidden-from-public** (живёт только в `seosite/06-eeat/`, не публикуется на on-site). После real-names — публикация на `/komanda/` страницу как individual `<TeamMember>` секции.
- 1-2 инженера (если есть в штате) — pending operator. Same подход.
- **Mapping на on-site:** `/komanda/` body (sustained Wave 0.2 fixture) + cross-link с cases где team member участвовал.

**Acceptance:** артефакт содержит шаблон bio (имя + job title + опыт + СРО/лицензии если есть + photo placeholder) × 5; cms TODO-checklist на публикацию когда real-names переданы.

#### 3.1.4 · `06-eeat/case-evidence.md` — связка cases ↔ realnost

**Содержание:**
- 14 cases (8 Stage 2 + 6 Stage 3) → mapping на real evidence (договоры / акты / fact-checked данные **без PII**)
- Sa-seo recommendation: для каждого case — **«evidence note»** в admin Payload field `case.evidence` (текстовый внутренний коммент, не публикуется): дата работ / номер договора / акт приёмки / клиент-сегмент (УК / частник / застройщик) / контакт-факт-чекер
- **Mapping на on-site:** на cards cases уже sustained Stage 2 (mini-case data). Здесь — **внутренняя evidence сcredibility chain** для возможного manual fact-check от Я.ВебМастер «Достоверная информация»
- **TODO для operator:** передать real evidence для existing 14 cases (privacy-redacted)

**Acceptance:** артефакт содержит таблицу 14 cases × evidence-fields + Payload schema TODO (admin-only field `case.evidenceNote: textarea` + `case.factCheckedBy: relation Authors`); cw + cms TODO-checklist.

#### 3.1.5 · `06-eeat/methodology.md` — методики работы (ГОСТ / ОКВЭД / ТР ТС)

**Содержание:**
- **ОКВЭД** — sustained Stage 2 ОКВЭД whitelist (49 abbrev в TOV-checker). Здесь — codified mapping: pillar → ОКВЭД код → ГОСТ номер → ТР ТС если применимо.
- **vyvoz-musora** — ОКВЭД 38.11 (сбор неопасных отходов) + ОКВЭД 38.12 (сбор опасных) для ФККО I-IV класса; ГОСТ 17.2.6.02-2018 (мусоровозы).
- **arboristika** — ОКВЭД 02.40 (предоставление услуг в области лесоводства); ГОСТ Р 56198-2014 (озеленение городских территорий).
- **chistka-krysh** — ОКВЭД 81.21 (общая уборка зданий); СНиП 12-04-2002 (безопасность работ на высоте) + альпинистская СРО.
- **demontazh** — ОКВЭД 43.11 (разборка и снос зданий); ТР ТС 014/2011 (безопасность дорог) + СРО НОСТРОЙ.
- **Mapping на on-site:** pillar pages «Методики работы» секция (cms re-seed pillars W14 day 4) + B2B `/b2b/dogovor/` + footer reference.

**Acceptance:** артефакт содержит таблицу 4 pillar × ОКВЭД × ГОСТ × ТР ТС; cms TODO-checklist для pillar re-seed «Методики работы» секция.

#### 3.1.6 · E-E-A-T hub общий DoD

| AC | Артефакт | Owner | Hard/Soft |
|---|---|---|---|
| AC-1.1 | `authors.md` written | sa-seo + cw | **Hard** |
| AC-1.2 | `credentials.md` written | sa-seo + cw | **Hard** |
| AC-1.3 | `team-bios.md` written | sa-seo + cw | **Hard** |
| AC-1.4 | `case-evidence.md` written | sa-seo + cw | **Hard** |
| AC-1.5 | `methodology.md` written | sa-seo + cw | **Hard** |
| AC-1.6 | Sustained: 5 артефактов содержат явный operator-pending escalation log | poseo | **Hard** |

### 3.2 · On-site E-E-A-T страницы (cw + cms publish)

> Цель: финализировать Stage 1 fixtures через cw content + cms publish + JSON-LD audit. Routes уже HTTP 200 от Wave 0.2 (sustained `project_seo_stage3_wave0_closed_2026-05-02`). US-4 финализирует body+meta+JSON-LD.

| Page | Content (cw) | JSON-LD | Cross-link | Owner | Acceptance |
|---|---|---|---|---|---|
| `/komanda/` | bio Team Members (если operator real-names переданы; иначе — sustained generic «Бригада вывоза Обихода» + 5 placeholder с TODO) | `AboutPage` + `Organization` + `Person` (если real-names) + `BreadcrumbList` | footer / `/avtory/` / cases B2B | cw + cms | HTTP 200, lint:schema 0, sitemap.xml content |
| `/sro-licenzii/` | список СРО (placeholder если pending) + лицензии table + ИНН/ОГРН (placeholder) | `Article` + `Organization` (with identifier, hasCredential) + `BreadcrumbList` | footer / B2B `/b2b/dogovor/` / `/o-nas/` | cw + cms | HTTP 200, lint:schema 0 |
| `/avtory/` (Authors hub финализация) | список 1-2 авторов (Author 1 company sustained; Author 2 operator если real-name переdan) | `CollectionPage` + `Person` × N + `BreadcrumbList` | blog post authors / cases authors | cw + cms | HTTP 200, lint:schema 0 |
| `/avtory/<operator>/` (operator-author page) | individual author bio (если real-name передан W14 day 3); else — keep deferred (hidden) | `ProfilePage` + `Person` + `sameAs` (VK/TG) + `BreadcrumbList` | blog commercial-bridge authors / B2B cases / footer | cw + cms (только если real-name передан) | HTTP 200 if published; otherwise SKIP gracefully |

**Conditional publishing logic:** sa-seo recommendation §3.2.1 — **«gracefully degrade»**:
- Если operator real-name + VK/TG sameAs передан до W14 day 3 EOD → publish `/avtory/<operator>/` + finalize on-site страниц с real-names + close E-E-A-T axis опережение (AC-7 PASS).
- Если pending к W14 day 7 → keep generic Author 1 sustained; `/avtory/<operator>/` остаётся deferred (post-EPIC backlog); E-E-A-T axis sustained parity (AC-7 sustained, EPIC PASS на 4/5 axes без E-E-A-T).

#### 3.2.1 · On-site E-E-A-T DoD

| AC | Описание | Owner | Hard/Soft |
|---|---|---|---|
| AC-2.1 | `/komanda/` content + JSON-LD финализирован, HTTP 200 | cw + cms | **Hard** |
| AC-2.2 | `/sro-licenzii/` content + JSON-LD финализирован (placeholder OK), HTTP 200 | cw + cms | **Hard** |
| AC-2.3 | `/avtory/` Authors hub финализирован, HTTP 200, lint:schema 0 | cw + cms | **Hard** |
| AC-2.4 | `/avtory/<operator>/` published only if operator real-name + sameAs передан до W14 day 3 EOD | cw + cms | Soft (conditional) |
| AC-2.5 | JSON-LD audit pass: `pnpm lint:schema --urls=/komanda/,/sro-licenzii/,/avtory/[+operator]` exit 0 | seo-tech | **Hard** |
| AC-2.6 | sitemap.xml содержит 4 routes (3 + conditional 4-й) | seo-tech | **Hard** |

### 3.3 · Neuro-SEO foundation (`seosite/07-neuro-seo/` 3 артефакта)

> Цель: codifies SGE/AI-overviews/SearchGPT readiness pattern. Пишется sa-seo + cw + seo-tech как **artefact-only** (не on-site changes в US-4 scope; sustained TLDR + FAQ от Stage 1+2).

#### 3.3.1 · `07-neuro-seo/sge-readiness.md`

**Содержание:**
- Анализ нашего текущего FAQ-pattern: 100% pillar/sub/SD имеют ≥3-5 Q&A с FAQPage schema (sustained Stage 1+2).
- **Анализ SGE/AI-overviews preferred patterns** (источники: Anthropic claude.ai · OpenAI SearchGPT preview · Google SGE blog 2024-2025):
  - Q должен быть literal user phrasing («сколько стоит вывезти контейнер мусора 8 м³ из Подмосковья?»), не маркетингово-рекламное
  - A должен быть **short answer first** (2-3 предложения с конкретным числом / диапазоном / условием) → длинное объяснение *после*
  - Структурная разметка: H4 для Q, H5 *необязательно* — PT по `<dl><dt>` или `<details>` (sa-seo recommendation в US-4: оставить `<dl>` sustained Stage 2 pattern)
  - **Cross-domain author signal:** SGE цитирует чаще авторов с consistent `sameAs` cross-domain (VK / TG / LinkedIn) — это связка с E-E-A-T axis (AC-7)
- **Анализ нашего текущего pattern vs preferred:**
  - Q: Generally OK; ≥2 localFaq на каждом SD (sustained Stage 2 AC-2.5) — это +N для localized neuro-citation
  - A: **partial** — 30-40% A слишком длинные (≥150 слов, нет «short answer first» паттерна)
  - **Recommendation US-4 W14 day 4:** cw-revision sample 20 представительных pillar/sub/SD FAQ блоков → restructure A под «short answer first + extended explanation»
- **Acceptance:** артефакт содержит analysis + recommendation + TODO-checklist для cw (W14 day 4 FAQ A-revision)

#### 3.3.2 · `07-neuro-seo/llms-txt-spec.md`

**Содержание:**
- **Что такое `llms.txt`:** community-driven LLM-friendly content map (proposal от llmstxt.org 2024). Структура: markdown-доступ к ключевым URL сайта + краткие descriptions для LLM-агентов crawl (Anthropic / OpenAI / Perplexity / etc.).
- **Sa-seo decision:** **создать `llms.txt`** на корне `obikhod.ru/llms.txt` (низкий риск, потенциальный upside для AI-citation; конкурентов с llms.txt в shortlist 17 — 0).
- **Содержание `llms.txt`:**
  ```
  # Обиход — Порядок под ключ для Москвы и МО

  > Услуги: вывоз мусора (включая ФККО I-IV класса) + арбористика и уход за садом + чистка крыш от снега и сосулек + демонтаж и спец-доп-услуги. B2C (частные дома, дачи, СНТ) + B2B (УК, ТСЖ, FM, застройщики, госзаказ).
  >
  > USP: фото→смета за 10 минут (заказчик отправляет 2-3 фото, оператор присылает смету). 4-в-1 (вся уборка под одним подрядчиком). СРО + договор с штрафами ГЖИ/ОАТИ на нашей стороне.

  ## Pillars
  - [Вывоз мусора](https://obikhod.ru/vyvoz-musora/)
  - [Арбористика](https://obikhod.ru/arboristika/)
  - [Чистка крыш](https://obikhod.ru/chistka-krysh/)
  - [Демонтаж](https://obikhod.ru/demontazh/)

  ## B2B
  - [Б2Б хаб](https://obikhod.ru/b2b/)
  - [УК и ТСЖ](https://obikhod.ru/b2b/uk-tszh/)
  - [Договор](https://obikhod.ru/b2b/dogovor/)

  ## E-E-A-T
  - [Команда](https://obikhod.ru/komanda/)
  - [СРО и лицензии](https://obikhod.ru/sro-licenzii/)
  - [Авторы](https://obikhod.ru/avtory/)

  ## Optional
  - [Блог](https://obikhod.ru/blog/) — 31 статья info+commercial-bridge
  - [Кейсы](https://obikhod.ru/kejsy/) — 14 cases B2C+B2B
  - [Foto-smeta](https://obikhod.ru/foto-smeta/) — USP
  ```
- **Implementation:** `site/app/llms.txt/route.ts` (Next.js 16 route handler) или статический файл `site/public/llms.txt`. Sa-seo recommendation: **route handler** (динамическая генерация после deploys, lastmod).
- **Acceptance:** артефакт содержит full spec + sample content + implementation TODO для seo-tech.

#### 3.3.3 · `07-neuro-seo/jsonld-completeness.md`

**Содержание:**
- **JSON-LD coverage audit для AI-readiness** — sustained Stage 2 W11 (lint:schema 0 errors / 31 warns закрыты Wave 0.3). US-4 audit финальный: 100% URL имеют ≥1 JSON-LD блок.
- **Анализ преобладающих @types:** Service / FAQPage / BreadcrumbList / LocalBusiness / Article / Person / Organization / ImageObject / AboutPage / CollectionPage. В US-4 final sweep — добавить redundancy:
  - На pillar pages: `Service` + `WebPage` (sustained) + **`HowTo`** (для «как заказать вывоз» процесс) — sa-seo recommendation новое в US-4
  - На cases: `Service` + `ImageObject` (sustained) + **`HowTo`** на 2-3 cross-pillar case (#13, #14 Stage 3) — sa-seo recommendation
  - На blog: `Article` + `FAQPage` (sustained) + **`HowTo`** на 2-3 «как сделать»-блог (#22, #25, #26) — sa-seo recommendation
- **AI-readiness check:** проверка что 100% структуры schema являются полностью valid (Anthropic / OpenAI / Google **разные требования** — пытаются использовать superset)
- **Acceptance:** артефакт содержит analysis + 3 «HowTo» schema specs + cms TODO для cms re-seed (W14 day 5 — добавить HowTo на 2-3 cases + 2-3 blog)

#### 3.3.4 · Neuro-SEO foundation общий DoD

| AC | Артефакт | Owner | Hard/Soft |
|---|---|---|---|
| AC-3.1 | `sge-readiness.md` written + cw FAQ A-revision plan | sa-seo + cw | Hard |
| AC-3.2 | `llms-txt-spec.md` written + seo-tech implementation TODO | sa-seo + seo-tech | Hard |
| AC-3.3 | `jsonld-completeness.md` written + cms HowTo schema TODO | sa-seo + cms | Hard |
| AC-3.4 | Optional: `llms.txt` published на `obikhod.ru/llms.txt` (W14 day 5 implementation) | seo-tech | Soft (Hard если операторский апруv «доделать») |

### 3.4 · Monitoring (`seosite/08-monitoring/` 4 артефакта + 8 целей Я.Метрики)

> Цель: sustainable trend tracking infrastructure post-EPIC. Артефакты пишет sa-seo + seo-tech; aemd cross-team на 8 целей Я.Метрики (Я.Метрика setup — техзадача aemd, sustained `project_poseo_autonomous_mandate_2026-05-02` cross-team).

#### 3.4.1 · `08-monitoring/topvisor-dashboard.md`

**Содержание:**
- **Если Topvisor SaaS creds переданы оператором до W14 day 1:**
  - 200-key dashboard setup: 50 keys × 4 pillar (vyvoz / arbo / chistka / demontazh) = 200 ключей
  - Регионы: Москва + Московская область (priority-A 4 districts + priority-B 4 districts = 8 districts) + Russia overall
  - Refresh: weekly cron (sustained Topvisor default)
  - Export: CSV → Google Sheets dashboard (aemd cross-team если нужен Sheets setup; иначе manual)
- **Если creds pending к W14 day 1:**
  - **Fallback methodology** sustained Stage 1+2: Я.ВебМастер «Структурированные данные» + manual SERP top-50 spot-check + Keys.so (если creds) + deep-profiles из shortlist
  - Точность ±15% (sustained от W7+W11 benchmark precedent)
  - Refresh: bi-weekly manual (sa-seo + re cross-team)
- **Sa-seo recommendation:** **fallback methodology codified** даже если creds дойдут — Topvisor становится «augmentation», а не «sole source». **Why:** Topvisor SaaS может lapse + budget risk + vendor lock-in. Iron rule: **«fallback methodology = source of truth, SaaS = augmentation».** ADR-кандидат для tamd post-US-4.

**Acceptance:** артефакт содержит обе ветки (creds vs fallback) + recommendation iron rule + TODO для poseo W14 day 1 (escalation operator на Topvisor creds).

#### 3.4.2 · `08-monitoring/yandex-webmaster.md`

**Содержание:**
- **Я.ВебМастер site verification:**
  - Метод: meta-тег верификации в `<head>` (sustained Stage 2 AC-13 если был; в US-4 финализация)
  - Альтернатива: HTML-файл в `site/public/yandex_<hash>.html` (sa-seo recommendation: **meta-тег**, не HTML — meta-тег легче maintain через `generateMetadata`)
- **Sitemap submission:**
  - URL: `https://obikhod.ru/sitemap.xml` (sustained от Stage 1)
  - Submit via Я.ВебМастер UI (manual; aemd cross-team если нужно delegate)
- **Индексация tracking:**
  - W14 baseline: ~230 URL submitted, expected indexing latency 7-14 days post-publish
  - Тracking интервал: weekly (Я.ВебМастер автоматически crawls)
  - Метрики: URL crawled / URL indexed / URL with errors (broken links / 404 / canonical issues)
- **Я.ВебМастер «Структурированные данные»:**
  - W14 baseline: 0 errors после lint:schema 0 warns (sustained Stage 2 AC-8)
  - Tracking: weekly manual check; alert если ≥5 errors
- **Я.ВебМастер «Достоверная информация» (опционально):**
  - Submit company info (юр.лицо ИНН + ОГРН + СРО) — pending operator W14 day 1
  - Sa-seo recommendation: defer на post-EPIC если operator pending; не блокер EPIC close

**Acceptance:** артефакт содержит full setup steps + screenshots placeholder (manual после Я.ВебМастер access) + TODO для aemd cross-team (operator передаёт login если нужен delegate).

#### 3.4.3 · `08-monitoring/gsc-setup.md`

**Содержание:**
- **GSC fallback (Google Search Console):**
  - Sustained iron rule: **РФ-юрисдикция, primary → Я.Поиск + Я.ВебМастер; Google secondary** (sustained `contex/04_competitor_tech_stacks.md` принципы)
  - Verify через Cloudflare DNS TXT record (если Cloudflare доступен; pending operator)
  - Альтернатива: HTML-файл / meta-тег (sa-seo recommendation: **DNS-verification** через Cloudflare, не HTML — cleaner + проще rotate)
- **Sitemap submission:**
  - URL: `https://obikhod.ru/sitemap.xml`
  - Submit via GSC UI (manual)
- **Coverage tracking:**
  - Crawl stats / Indexed pages / Soft-404 / 4xx errors / 5xx errors
  - Mobile usability / Core Web Vitals (sustained Stage 1 baseline check, Stage 3 follow-up)
- **Sa-seo recommendation:** GSC = **secondary monitoring**, не primary. Я.ВебМастер = primary (РФ-юрисдикция iron rule). GSC покрывает: AI-overviews trend / Google ranking on рунет (если есть) / international visitors (если есть).

**Acceptance:** артефакт содержит setup steps + clear iron rule (Я.ВебМастер primary, GSC secondary) + TODO для aemd cross-team (DNS verification setup).

#### 3.4.4 · `08-monitoring/yandex-metrika-goals.md` — 8 целей

**Содержание:**
- **8 целей Я.Метрики финализация** (sustained intake §3.4 + расширено sa-seo):

| # | Goal name | Type | Trigger | Conversion-source priority |
|---|---|---|---|---|
| 1 | `lead-form-submit` | JS-событие | submit на `<LeadForm>` (любой URL) | **PRIMARY** (главная конверсия) |
| 2 | `phone-click` | URL | click на `tel:` (header / footer / hero) | PRIMARY |
| 3 | `whatsapp-click` | URL | click на `whatsapp://` (sticky CTA) | PRIMARY |
| 4 | `telegram-click` | URL | click на `tg://` (sticky CTA / footer) | SECONDARY |
| 5 | `cta-banner-click` | JS-событие | click на `<CTABanner>` (любой URL) | SECONDARY |
| 6 | `foto-smeta-cta` | JS-событие | click на CTA «фото→смета» (любой URL — это USP) | **PRIMARY** (USP-tracker) |
| 7 | `b2b-form-submit` | JS-событие | submit на B2B `<LeadForm variant="b2b">` (B2B URL only) | SECONDARY (segment) |
| 8 | `case-cta-click` | JS-событие | click на CTA внутри `<Case>` cards | TERTIARY (нагрев) |

- **Implementation:**
  - aemd cross-team: setup в Я.Метрика UI (8 goals × trigger config)
  - cms cross-team: добавить `data-goal=<name>` атрибуты на 8 элементов в BlockRenderer (sa-seo brief — точные селекторы)
  - seo-tech: добавить `_paq.push(['trackGoal', '<name>'])` или `ym(<id>, 'reachGoal', '<name>')` event-bindings в `site/lib/analytics/`
- **Cross-team coordination:**
  - sa-seo brief (W14 day 4) — этот артефакт + точные селекторы blocks
  - aemd setup (W14 day 4-5) — Я.Метрика goals
  - cms re-seed (W14 day 5) — `data-goal` атрибуты в blocks
  - seo-tech (W14 day 5) — analytics event-bindings
  - qa-site (W14 day 6) — verify через DevTools network на staging

**Acceptance:** артефакт содержит full спецификацию 8 goals + selectors + event-binding-code samples + escalation log (если aemd зависает к W14 day 5 → fallback к 4 primary goals: 1, 2, 3, 6).

#### 3.4.5 · Monitoring общий DoD

| AC | Артефакт | Owner | Hard/Soft |
|---|---|---|---|
| AC-4.1 | `topvisor-dashboard.md` written (creds OR fallback) | sa-seo + seo-tech | **Hard** |
| AC-4.2 | `yandex-webmaster.md` written + verification setup | sa-seo + seo-tech + aemd | **Hard** |
| AC-4.3 | `gsc-setup.md` written + DNS verification setup | sa-seo + seo-tech + aemd | Hard |
| AC-4.4 | `yandex-metrika-goals.md` written + 8 goals brief | sa-seo + aemd + cms | **Hard** |
| AC-4.5 | 8 goals live (или fallback к 4 primary) | aemd + cms + seo-tech + qa-site | **Hard** (Soft при aemd pending) |

### 3.5 · Final SEO-tech sweep

> Цель: финальная сверка после Stage 3 production.

| Sweep item | Owner | File / Command | Acceptance |
|---|---|---|---|
| **lint:schema 0 errors / 0 warns на 100% URL** | seo-tech | `pnpm lint:schema --all --strict` | exit 0 на 100% URL (~230); HomeAndConstructionBusiness url warns должны быть 0 (Wave 0.3 sustained); если W14 day 1 audit показывает regression — fix priority |
| **sitemap.xml финал ≥230 URL** | seo-tech | `curl https://obikhod.ru/sitemap.xml \| wc -l` (или `pnpm sitemap:audit`) | ≥230 URL emitted; lastmod актуализирован on bulk publish events; sub-level SD emission sustained от Wave 0.1 |
| **robots.txt audit** | seo-tech | `site/app/robots.ts` | allow `/` + `/sitemap.xml` + `/foto-smeta/`; block `/admin/`, `/api/` (кроме `/api/leads`), `/preview/`, `/_next/`, `/static/` (если нужно). Sa-seo recommendation: **block `/admin/` strict** (chrome canonical sustained §33), allow остальное по умолчанию |
| **canonical zero loops + zero contradictions** | seo-tech | `pnpm tsx scripts/audit-canonicals.ts` (новый script если нет) | 0 циклов self-canonical (А → А), 0 contradictions (А → Б, Б → А), 100% pages имеют explicit canonical (sustained Stage 1) |
| **Hreflang review** | seo-tech | `pnpm tsx scripts/audit-hreflang.ts` (новый script если нет) | sa-seo recommendation: **N/A в US-4** — мы single-language ru-RU; B2B-страницы pure ru-RU. Hreflang не нужен. Артефакт: log «N/A — single-language site» |
| **Redirect chains ≤2 hops + zero dead chains** | seo-tech | `pnpm tsx scripts/audit-redirects.ts` (sustained Stage 1) | 0 chains >2 hops (sustained Stage 1: `ochistka-krysh` → 308 → `chistka-krysh` = 1 hop OK); 0 dead chains (redirect → 404) |
| **Cross-link integrity на ~230 URL** | seo-tech | `pnpm tsx scripts/check-cross-links.ts --all` | 0 broken cross-links (sustained Stage 2 + Wave 0 + Stage 3) |

#### 3.5.1 · Final sweep DoD

| AC | Item | Hard/Soft |
|---|---|---|
| AC-5.1 | lint:schema --strict exit 0 на 100% URL | **Hard** |
| AC-5.2 | sitemap.xml ≥230 URL финал | **Hard** |
| AC-5.3 | robots.txt audit clean | **Hard** |
| AC-5.4 | Canonical audit 0 loops / 0 contradictions / 100% explicit | **Hard** |
| AC-5.5 | Hreflang N/A documented | Soft |
| AC-5.6 | Redirect chains audit clean | **Hard** |
| AC-5.7 | Cross-link integrity 0 broken | **Hard** |

### 3.6 · W14 Competitor Benchmark Final + differentiation matrix v4

> Финальный benchmark vs 17 конкурентов по 5 осям. Sustained методология от W7 + W11 benchmark, expanded по US-4 W14 final goals.

#### 3.6.1 · `seosite/01-competitors/benchmark-W14.md`

**Содержание:**
- **Methodology** (sustained от W11 fallback):
  - Топ-3 baseline: musor.moscow / liwood.ru / cleaning-moscow.ru
  - Источники: deep-profiles refresh top-3 (re W14 day 1-3) + 14 stub-with-hypothesis sustained от W11 (diff-only refresh) + sitemap.xml live audit (curl + grep) + Я.ВебМастер «Структурированные данные» public report (если доступ)
  - Точность: ±15% (sustained W11)
- **Наш Stage 3 actual после US-3 + US-4:**
  - URL: ~230 (16 priority-A pillar + 60 priority-B pillar + ~84 sub-level + 17 blog M1+M2+M3 + 14 cases + 8 districts hubs + 4 pillar + 8 special + 5 static + 4 E-E-A-T pages = ~230)
  - Контент-глубина: ~165 000 слов (sustained Stage 2 ~125k + US-3 ~55k = ~180k; - some overlap = ~165k)
  - E-E-A-T: 5 артефактов hub + on-site `/komanda/` + `/sro-licenzii/` + Authors hub + `/avtory/<operator>/` (conditional)
  - UX foto-smeta: sustained 100% URL lead-form
  - Schema-coverage: 100% (sustained от Stage 2 + Wave 0.3 + final sweep)
- **5 axes finalize calculation:**

| Ось | Stage 1 W7 | Stage 2 W11 | Stage 3 W13 | W14 final | Status |
|---|---|---|---|---|---|
| URL-объём | 22 | 119 | ~211 | ~230 | ✅ confirmed (closure 93% к liwood медиане 247) |
| Content-depth | ~3000 pillar | ~3500 pillar | ~3700 pillar | ~3800 pillar | ✅ **confirmed +27%** vs liwood ~3000 |
| Schema | 100% | 100% | 100% | 100% | ✅ confirmed +50pp |
| UX foto-smeta | 100% URL | 119/119 | ~211/211 | ~230/230 | ✅ confirmed 0/17 баазис |
| 4-в-1 multi-pillar | 4 pillar × 4 districts | 4 × 4 + sub | 4 × 8 + sub | 4 × 8 + sub | ✅ confirmed (auto-sustained) |
| **E-E-A-T** | parity (placeholder) | parity (sustained) | parity (sustained) | **опережение** (если operator real-name) **OR** sustained parity | conditional |

- **17 конкурентов breakdown:** sustained от W11 + diff-only refresh (top-3 deep + 14 stub diff)
- **vs cleaning-moscow** specifically для E-E-A-T axis comparison: их `/avtor-<name>/` без cross-domain `sameAs` (VK / TG); наши `/avtory/<operator>/` с cross-domain `sameAs` (если operator real-name + sameAs передан) → **опережение confirmed**
- **Recommendation:** epic close на 4/5 confirmed (без E-E-A-T) **OR** 5/5 confirmed (если operator pending closed)

**Acceptance:** артефакт sustained от W11 format + 5 финальных axes calculations + 17 × 5 final table + clear recommendation.

#### 3.6.2 · `seosite/01-competitors/differentiation-matrix.md` v4

**Содержание:**
- **v3 → v4 update:** добавить W13 + W14 строки в табличку «Сводная матрица»
- **8 winning angles** sustained Stage 2 W11 + расширения:
  - 1-7: sustained от W11 (фото→смета / 4-в-1 / штрафы ГЖИ / Programmatic 4 × N / Real B2B-author / Caregiver+Ruler TOV / Block-based / Я.Нейро формат)
  - **9: NEW W14 — `llms.txt` LLM-friendly content map** (если implemented). 0/17 конкурентов имеют llms.txt — uniqueness +1pp.
  - **10: NEW W14 — Я.Метрика 8 goals tracking infrastructure** (если 8 goals live; иначе 4 primary). 0/17 конкурентов имеют публично documented 8 goals — internal differentiation, не визуальный.
- **Топ-3 финальный confirm:** musor.moscow / liwood.ru / cleaning-moscow.ru sustained — топ-3 не меняется на W14
- **Recommendation:** post-EPIC backlog winning angles tracking continues monthly через monitoring infrastructure (sustained sa-seo iron rule)

**Acceptance:** артефакт sustained format v3 + 2 новых winning angles + W13+W14 строки + clear topology «finalized» tag.

#### 3.6.3 · Benchmark + matrix общий DoD

| AC | Артефакт | Owner | Hard/Soft |
|---|---|---|---|
| AC-6.1 | `benchmark-W14.md` written + 5 axes finalize | seo-content + re | **Hard** |
| AC-6.2 | `differentiation-matrix.md` v4 update | seo-content | **Hard** |
| AC-6.3 | re refresh top-3 deep-profiles (musor/liwood/cleaning) | re | **Hard** |
| AC-6.4 | re diff-only sustained 14 stub-with-hypothesis | re | Soft |
| AC-6.5 | sa-seo recommendation epic close написан явно | sa-seo | **Hard** |

### 3.7 · Operator gate W14 пакет (`operator-gate-W14.md`)

> Финальный artefact эпика — формальный отчёт для operator decision.

**Содержание:**

#### 3.7.1 · Executive summary (1 page max)

- Stage 0+1+2+3 closed: 4 epic stages, 7 weeks, ~230 URL, ~165k слов content, 60 hero, 14 cases, 5 E-E-A-T артефактов, 4 monitoring артефакта, ~12 ADR-кандидатов
- 5/5 axes confirmed (или 4/5 + sustained parity на E-E-A-T если operator pending)
- W14 hard gate ≥3/5 = **EPIC PASS** (sustained автоматически от W13 4/5)
- Recommendation: «approve epic close» (default) **OR** «conditional close с follow-up backlog» (если pending operator items > 5)

#### 3.7.2 · 5 axes опережения с numbers

| Ось | Numbers W14 | vs Топ-3 | Confirmed |
|---|---|---|---|
| URL-объём | ~230 URL | closure 93% к liwood медиане 247 | ✅ |
| Content-depth | ~3800 avg pillar / ~165k слов | +27% vs liwood ~3000 | ✅ |
| Schema-coverage | 100% lint:schema 0 errors | +50pp vs топ-3 ~50% | ✅ |
| UX foto-smeta | 230/230 lead-form | 0/17 конкурентов имеют аналог | ✅ |
| 4-в-1 multi-pillar | 4 pillar × 8 districts × ~22 sub | 0/17 имеют 4-pillar | ✅ |
| E-E-A-T | conditional | parity OR опережение | conditional |

#### 3.7.3 · Benchmark vs 17 конкурентов + differentiation v4

- Cross-link на `benchmark-W14.md` + `differentiation-matrix.md` v4
- Top-3 confirm sustained (musor / liwood / cleaning)
- 8 winning angles sustained + 2 NEW (`llms.txt` + Я.Метрика 8 goals)

#### 3.7.4 · 230+ URL sitemap stats

- sitemap.xml content breakdown: 4 pillar + ~22 sub + ~84 sub-level SD + 16 + 60 = ~76 priority-B SD + 16 priority-A SD + 17 blog + 14 cases + 8 districts + 4 авторы + 5 static + 4 E-E-A-T + foto-smeta + extras = ~230
- Lastmod актуализирован
- Cross-link на final sweep AC-5.2

#### 3.7.5 · 100% lint:schema PASS + 102+ axe reports

- lint:schema 0 errors / 0 warns (sustained от Wave 0.3 + final sweep)
- axe reports 102+ (51 Stage 2 W11 + ~51 Stage 3 W13 sustained от US-3 AC-11.4)
- 0 critical / 0 serious accessibility violations из блочного контента (sustained legacy SiteChrome contrast — backlog)

#### 3.7.6 · Stage 3 commit count + PR list

- Stage 3 W12+W13+W14 commits: ожидается ~120-150 commits на feature/seo-content-fill-stage-* (sustained от Wave 0 11 commits + Stage 3 Wave 1 ~50 + US-4 ~30)
- PR list: ~10-15 PRs (Wave 0 batch + Wave 1 cw runs + cms publish + media seed + benchmark + final sweep + operator-gate)

#### 3.7.7 · Pending operator action list (если есть на W14)

- Operator real-name + VK/TG sameAs (E-E-A-T axis опережение) — если pending
- ИНН-ОГРН-СРО replace placeholders — если pending
- Topvisor SaaS creds — если pending (fallback methodology sustained)
- Real photos для 14 cases — если pending (fal.ai illustrative sustained TODO)
- DNS A-record + GHA secrets для staging.obikhod.ru — если pending
- Я.ВебМастер «Достоверная информация» юр.лицо submission — если pending

#### 3.7.8 · Recommendation

- **Default (recommended):** «approve epic close, sustained 4/5 axes confirmed (5/5 если operator real-name closed); post-EPIC backlog: real photos / staging deploy / Wave 2.5 priority-C districts / amoCRM US-13»
- **Alternative (if pending > 5 items):** «conditional close с follow-up backlog: epic technically PASS, но operator items pending → leadqa backlog tracking + post-EPIC monitoring»

#### 3.7.9 · Operator-gate DoD

| AC | Описание | Owner | Hard/Soft |
|---|---|---|---|
| AC-10.1 | `operator-gate-W14.md` written | sa-seo + poseo | **Hard** |
| AC-10.2 | Executive summary 1 page max | poseo | **Hard** |
| AC-10.3 | 5 axes table с финальными numbers | poseo | **Hard** |
| AC-10.4 | Cross-link на benchmark-W14 + matrix v4 | poseo | **Hard** |
| AC-10.5 | Cross-link на final sweep AC + axe reports | poseo | **Hard** |
| AC-10.6 | Pending operator list актуальный | poseo | **Hard** |
| AC-10.7 | Sa-seo recommendation explicit | sa-seo | **Hard** |
| AC-10.8 | leadqa real-browser smoke ≥10 representative URL включая `/komanda/`, `/sro-licenzii/`, `/avtory/`, /foto-smeta/, 2 pillar, 2 SD, 2 blog, 2 cases | leadqa | **Hard** |
| AC-10.9 | release gate (RC release-notes) ready | release | **Hard** |

### 3.8 · Out-of-scope (детально расширено)

> Sustained intake §4 + расширено per US-4 spec.

- ~~Wave 2.5 расширение до 30+ districts~~ — post-EPIC backlog (operator decision)
- ~~Полная B2B программатика `/b2b/uk-tszh/<service>/` × 8 districts~~ — отложена; B2B хаб + 4 segments + договор/штрафы sustained от Stage 2
- ~~Calculator-блок реальная логика~~ — placeholder sustained от US-0 (отдельная US с pa-site, backlog)
- ~~Visual Regression CI (Chromatic/Percy)~~ — backlog (sustained `project_cicd_backlog`)
- ~~amoCRM (US-13)~~ — blocked by аккаунт; OBI-25 ticket sustained
- ~~Brand-IDENTITY правки~~ — operator-only domain (`feedback_design_system_source_of_truth`)
- ~~staging.obikhod.ru deploy с GHA workflow~~ — pending operator DNS A-record + GHA secrets; post-EPIC если pending к W14 day 7
- ~~Operator-author page `/avtory/<operator>/`~~ — conditional publish (см. §3.2.1) — если pending к W14 day 3 EOD, page deferred post-EPIC
- ~~Slug drift `zhukovskij` ↔ `zhukovsky` post-process cleanup~~ — US-3 follow-up (`fix(scripts)` commit `3b97b12` уже частично закрыт alias-mapping; full clean-up post-EPIC) **OR** US-4 §10 Open Q3
- ~~AI-pipeline fal.ai стиль ревизия~~ — sustained Stage 2 + 3 art apruv pattern; final operator review post-EPIC
- ~~Real photos для 14 cases~~ — backlog operator post-EPIC; fal.ai illustrative с TODO sustained
- ~~Sub-level SD priority-A второй волны (если поднимется в W14 keyword research)~~ — post-EPIC backlog, US-4 не trigger expansion
- ~~Я.ВебМастер «Достоверная информация» submission~~ — pending operator юр.лицо real-data; не блокер EPIC close

### 3.9 · Volume summary

```
US-4 production volume:
├── E-E-A-T hub (5 артефактов в seosite/06-eeat/): ~5 × 800-1500 слов = ~5500 слов markdown (artefact, не on-site)
├── On-site E-E-A-T финализация (3 + 1 conditional): ~3-4 × 600 слов = ~2000 слов on-site content
├── Neuro-SEO foundation (3 артефакта в seosite/07-neuro-seo/): ~3 × 1000 = ~3000 слов markdown + ~50 LOC llms.txt route + ~10 LOC HowTo schema
├── Monitoring (4 артефакта в seosite/08-monitoring/): ~4 × 800 = ~3200 слов markdown + 8 Я.Метрика goals setup
├── Final SEO-tech sweep: 0 текстов, ~50 LOC scripts (если новые) + audit reports
├── W14 Competitor Benchmark Final + matrix v4: ~2 × 1500 = ~3000 слов markdown
├── Operator-gate W14 пакет: ~1500 слов markdown
└── Total: ~18 200 слов artefact + ~2000 слов on-site + ~110 LOC code/scripts + 8 Я.Метрика goals setup
```

US-4 — низкая cw bottleneck нагрузка vs Stage 1+2+US-3 (artefact-only writing, не page-level content). Главный bottleneck: **operator pending escalation** (real-name / СРО / creds / DNS / GHA secrets) + **aemd cross-team** (Я.Метрика 8 goals).

## 4 · Tracks (4 параллельных + operator escalation track)

US-4 — **финальный artefact-конвейер**. PO orchestration по iron rule #7 (sustained `feedback_po_orchestration_phase_handoffs`). 4 tracks параллельно W14 day 1-7.

### 4.1 · Track A — E-E-A-T (owner: sa-seo + cw + cms)

**Цель:** 5 артефактов hub `seosite/06-eeat/` + on-site финализация 3-4 страниц + cms publish.

| Day | Owner | Deliverable | Acceptance |
|---|---|---|---|
| 1-2 | sa-seo + cw | 5 артефактов hub (authors/credentials/team-bios/case-evidence/methodology) | ~5500 слов markdown в `seosite/06-eeat/` |
| 1 | poseo | escalation operator — real-name / VK / TG sameAs / СРО / ИНН/ОГРН | Hand-off log entry; pending status tracked |
| 3 | cw | на основе hub artefakts → on-site content (`/komanda/`, `/sro-licenzii/`, `/avtory/` + conditional `/avtory/<operator>/`) | ~2000 слов on-site content |
| 4 | cms | publish 3-4 страницы; JSON-LD audit | HTTP 200, lint:schema 0, sitemap.xml content |
| 4-5 | seo-tech | JSON-LD audit финал на E-E-A-T pages | exit 0; 0 errors |

**Hand-off:**
- Day 2 EOD: 5 артефактов hub finalized → cw on-site content unblocked
- Day 3 EOD: on-site content ready → cms publish
- Day 4 EOD: cms publish complete → seo-tech audit
- Day 5: seo-tech audit pass → Track A done

### 4.2 · Track B — Neuro-SEO foundation (owner: sa-seo + cw + seo-tech + cms)

**Цель:** 3 артефакта `seosite/07-neuro-seo/` + optional `llms.txt` route + cms HowTo schema re-seed.

| Day | Owner | Deliverable | Acceptance |
|---|---|---|---|
| 2 | sa-seo + cw | `sge-readiness.md` + cw FAQ A-revision plan | ~1000 слов markdown + plan для W14 day 4 cw revision |
| 3 | sa-seo + seo-tech | `llms-txt-spec.md` + implementation TODO | ~800 слов markdown + spec |
| 3 | sa-seo + cms | `jsonld-completeness.md` + HowTo schema TODO | ~1200 слов markdown + 3 HowTo specs |
| 4 | cw | FAQ A-revision sample 20 представительных URL | TOV-checker exit 0; cw 100% review (small batch) |
| 5 | seo-tech | (optional) `llms.txt` route handler implementation | `obikhod.ru/llms.txt` returns valid markdown; lint:schema parse OK |
| 5 | cms | (optional) HowTo schema re-seed на 2-3 cases + 2-3 blog | publish-gate pass; lint:schema strict mode pass |

**Hand-off:**
- Day 3 EOD: 3 артефакта done → cms / seo-tech implementation tracks
- Day 5: optional implementation pass или Track B done на artefact-only

### 4.3 · Track C — Monitoring (owner: sa-seo + seo-tech + aemd cross-team + cms)

**Цель:** 4 артефакта `seosite/08-monitoring/` + 8 целей Я.Метрики setup + Я.ВебМастер verification + GSC fallback.

| Day | Owner | Deliverable | Acceptance |
|---|---|---|---|
| 2 | sa-seo + seo-tech | `topvisor-dashboard.md` (creds OR fallback) | ~1000 слов markdown + escalation log |
| 2 | sa-seo + seo-tech | `yandex-webmaster.md` + verification setup | ~800 слов + meta-тег verification на сайте |
| 3 | sa-seo + seo-tech | `gsc-setup.md` + DNS verification setup | ~700 слов + DNS-record TODO для aemd |
| 3 | sa-seo + aemd | `yandex-metrika-goals.md` + 8 goals brief | ~700 слов + 8 selectors brief |
| 4-5 | aemd cross-team | Я.Метрика 8 goals UI setup | 8 goals live в Я.Метрика UI (или 4 primary fallback) |
| 5 | cms | data-goal атрибуты на 8 elements в blocks | LeadForm + CTABanner + foto-smeta-cta + Case-cta всех wired |
| 5 | seo-tech | analytics event-bindings | _paq.push / ym reachGoal events fire correctly |
| 6 | qa-site | DevTools network verify на staging | 8 events fire correctly при triggering |

**Hand-off:**
- Day 1: poseo escalation operator — Topvisor / Я.ВебМастер / DNS / GHA secrets
- Day 3 EOD: 4 артефакта done → aemd cross-team setup
- Day 5: aemd setup done OR fallback to 4 primary goals
- Day 6: qa-site verify → Track C done

### 4.4 · Track D — Final SEO-tech sweep + W14 benchmark (owner: seo-tech + seo-content + re + cw)

**Цель:** Final sweep audit + W14 Competitor Benchmark Final + differentiation-matrix v4.

| Day | Owner | Deliverable | Acceptance |
|---|---|---|---|
| 1-3 | re | Refresh top-3 deep-profiles (musor / liwood / cleaning) + diff-only 14 stub | 3 deep + 14 stub diff in seosite/01-competitors/deep/ |
| 4 | seo-tech | Final SEO-tech sweep 7 audits (lint:schema strict + sitemap + robots + canonical + hreflang + redirect + cross-link) | All exit 0; reports в `screen/stage3-W14/` или logs |
| 5 | seo-content + re | `benchmark-W14.md` + 5 axes finalize calculation | ~1500 слов markdown |
| 5 | seo-content | `differentiation-matrix.md` v4 update | W13+W14 строки добавлены; 2 NEW winning angles |
| 6 | poseo + sa-seo | `operator-gate-W14.md` пакет (executive summary + 5 axes + benchmark cross-link + recommendations) | ~1500 слов markdown |
| 6 | qa-site | Playwright + axe ~30 sample URL включая E-E-A-T страницы | screen/stage3-W14/ ~60 PNG + ~30 axe.json |
| 6 | cr-site | review всех Track A-D PRs | merge after green CI (do iron rule #5) |
| 7 | leadqa | real-browser smoke ≥10 representative URL | leadqa-W14.md report для operator |
| 7 | release | RC-W14 release-notes | Cross-link на operator-gate-W14.md |
| 7 | poseo | operator gate handoff | operator review + ack |

**Hand-off:**
- Day 4 EOD: re + seo-tech audits done → seo-content benchmark ready
- Day 5 EOD: benchmark + matrix done → poseo operator-gate ready
- Day 6: gate finalized → leadqa real-browser
- Day 7: leadqa report → operator gate

### 4.5 · Track E — Operator escalation track (owner: poseo)

**Цель:** Persistent escalation для 5 pending items без блокировки tracks A-D.

| Day | Item | Status | Fallback |
|---|---|---|---|
| 1 | Operator real-name + VK/TG sameAs | escalation | E-E-A-T axis sustained parity |
| 1 | СРО номер / ИНН-ОГРН | escalation | placeholder sustained с TODO |
| 1 | Topvisor SaaS creds | escalation | fallback methodology sustained |
| 1 | DNS A-record + GHA secrets для staging | escalation | post-EPIC if pending |
| 3 | Real photos для 14 cases | escalation | fal.ai illustrative с TODO sustained |
| 3 | Я.ВебМастер access (если delegate нужен) | escalation | aemd cross-team manual setup |

**Hand-off:** poseo handles persistent escalation в дайлайне `Hand-off log` artefact. Тripwire: если ≥3 items pending к W14 day 7 → operator-gate-W14.md «conditional close» recommendation.

## 5 · Cross-team зависимости

| Команда / агент | Что нужно | Когда (W14) | Hard / Soft |
|---|---|---|---|
| **operator** (escalation) | Real-name + VK/TG sameAs (E-E-A-T axis 6) | day 1-3 (escalation на day 3 если pending) | Soft (E-E-A-T axis sustained parity) |
| **operator** (escalation) | ИНН / ОГРН / СРО номера replace placeholders | day 1-3 | Soft (placeholder sustained) |
| **operator** (escalation) | Topvisor SaaS creds | day 1 | Soft (fallback methodology sustained) |
| **operator** (escalation) | DNS A-record + GHA secrets для staging.obikhod.ru | day 1-3 | Soft (post-EPIC if pending) |
| **operator** (escalation) | Я.ВебМастер access (если delegate нужен) | day 1-2 | Soft (aemd cross-team manual setup) |
| **operator** (escalation) | Real photos для 14 cases | day 3 | Soft (fal.ai sustained TODO) |
| **aemd** (cross-team) | 8 целей Я.Метрики setup в Я.Метрика UI | day 4-5 | **Hard** (Soft при pending → 4 primary fallback) |
| **aemd** (cross-team) | DNS verification setup (Я.ВебМастер + GSC) | day 2-3 | Hard |
| **re** (cross-team) | Refresh top-3 deep-profiles (musor / liwood / cleaning) для W14 benchmark | day 1-3 | **Hard** (W14 benchmark blocked without) |
| **re** (cross-team) | Diff-only sustained 14 stub-with-hypothesis | day 1-3 | Soft |
| **cw** | E-E-A-T hub 5 артефактов + on-site finalize 3-4 pages + Neuro-SEO 3 артефакта + FAQ A-revision sample 20 URL + benchmark/matrix/operator-gate writing | day 1-6 | **Hard** (artefact bottleneck) |
| **cms** | publish 3-4 E-E-A-T pages + (optional) HowTo schema re-seed + data-goal атрибуты на blocks | day 4-5 | **Hard** |
| **qa-site** + **cr-site** | Final sweep validation + Я.Метрика 8 goals verify + Playwright + axe ~30 sample URL | day 5-6 | **Hard** |
| **release** + **leadqa** | RC-W14 release-notes + leadqa real-browser smoke ≥10 URL | day 7 | **Hard** (sustained release-cycle) |

**Iron rule #7 sustained:** poseo подключает cross-team напрямую через Hand-off log в `specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/`; не эскалирует к оператору штатные переходы между фазами.

## 6 · Acceptance Criteria (DoD US-4 = EPIC W14 gate — 12 групп AC)

> Sustained pattern US-3 (12 групп AC) → US-4 12 групп. Каждый AC — измеримый.

### AC-1 · E-E-A-T hub (5 артефактов)

- **AC-1.1.** `seosite/06-eeat/authors.md` written: full structured data spec (Person + Organization + sameAs cross-domain) + Mermaid relationships graph + cms TODO-checklist (replace placeholders в 17 blog + 14 cases authors). **Hard.**
- **AC-1.2.** `seosite/06-eeat/credentials.md` written: СРО / лицензии / ИНН / ОГРН placeholder с явным `<!-- TODO -->` + structured data spec (`hasCredential` `EducationalOccupationalCredential`) + escalation log. **Hard.**
- **AC-1.3.** `seosite/06-eeat/team-bios.md` written: 5 шаблонов bio (имя + job title + опыт + СРО/лицензии + photo placeholder) + cms TODO-checklist на публикацию `/komanda/` после real-names. **Hard.**
- **AC-1.4.** `seosite/06-eeat/case-evidence.md` written: 14 cases × evidence-fields таблица + Payload schema TODO (admin-only fields `case.evidenceNote: textarea` + `case.factCheckedBy: relation Authors`) + cw + cms TODO-checklist. **Hard.**
- **AC-1.5.** `seosite/06-eeat/methodology.md` written: 4 pillar × ОКВЭД × ГОСТ × ТР ТС таблица + cms TODO-checklist для pillar re-seed «Методики работы» секция. **Hard.**
- **AC-1.6.** Каждый из 5 артефактов содержит явный operator-pending escalation log (real-name / СРО / ИНН/ОГРН status). **Hard.**

### AC-2 · On-site E-E-A-T страницы

- **AC-2.1.** `/komanda/` financialized: bio Team Members content (real-names если переданы; else generic) + JSON-LD `AboutPage` + `Organization` + `Person` (если real-names) + `BreadcrumbList`. HTTP 200, sitemap.xml content. **Hard.**
- **AC-2.2.** `/sro-licenzii/` financialized: список СРО placeholder (если pending) + лицензии table + ИНН/ОГРН placeholder + JSON-LD `Article` + `Organization` (with identifier, hasCredential) + `BreadcrumbList`. HTTP 200, lint:schema 0. **Hard.**
- **AC-2.3.** `/avtory/` Authors hub financialized: список 1-2 авторов + JSON-LD `CollectionPage` + `Person` × N + `BreadcrumbList`. HTTP 200, lint:schema 0. **Hard.**
- **AC-2.4.** `/avtory/<operator>/` published only if operator real-name + sameAs передан до W14 day 3 EOD; иначе SKIP gracefully. **Soft (conditional).**
- **AC-2.5.** JSON-LD audit pass: `pnpm lint:schema --urls=/komanda/,/sro-licenzii/,/avtory/[+operator]` exit 0. **Hard.**
- **AC-2.6.** sitemap.xml содержит 4 routes (3 + conditional 4-й). **Hard.**

### AC-3 · Neuro-SEO foundation (3 артефакта)

- **AC-3.1.** `seosite/07-neuro-seo/sge-readiness.md` written: analysis нашего FAQ-pattern + SGE preferred patterns + cw FAQ A-revision plan для sample 20 URL. **Hard.**
- **AC-3.2.** `seosite/07-neuro-seo/llms-txt-spec.md` written: full spec + sample content + seo-tech implementation TODO (`site/app/llms.txt/route.ts`). **Hard.**
- **AC-3.3.** `seosite/07-neuro-seo/jsonld-completeness.md` written: analysis преобладающих @types + 3 HowTo schema specs + cms TODO для re-seed (2-3 cases + 2-3 blog). **Hard.**
- **AC-3.4.** Optional: `obikhod.ru/llms.txt` published (W14 day 5 implementation если seo-tech bandwidth). Lint:schema parse OK. **Soft (Hard если poseo apruv «доделать»).**
- **AC-3.5.** Optional: HowTo schema re-seed на 2-3 cases + 2-3 blog. publish-gate strict mode pass. **Soft.**
- **AC-3.6.** cw FAQ A-revision sample 20 URL: TOV-checker exit 0 + cw 100% review (small batch). **Hard.**

### AC-4 · Monitoring (4 артефакта + 8 целей Я.Метрики)

- **AC-4.1.** `seosite/08-monitoring/topvisor-dashboard.md` written: обе ветки (creds OR fallback methodology) + sa-seo iron rule «fallback = source of truth, SaaS = augmentation» + escalation log. **Hard.**
- **AC-4.2.** `seosite/08-monitoring/yandex-webmaster.md` written: setup steps + meta-тег verification на сайте + sitemap submission TODO + screenshots placeholder. **Hard.**
- **AC-4.3.** `seosite/08-monitoring/gsc-setup.md` written: DNS verification setup steps + sitemap submission TODO + iron rule «GSC secondary, Я.ВебМастер primary» + escalation log. **Hard.**
- **AC-4.4.** `seosite/08-monitoring/yandex-metrika-goals.md` written: full спецификация 8 goals + selectors brief + event-binding code samples + escalation log. **Hard.**
- **AC-4.5.** Я.Метрика 8 goals live (или 4 primary fallback): aemd cross-team setup + cms data-goal атрибуты + seo-tech event-bindings + qa-site DevTools network verify. **Hard (Soft при pending → 4 primary).**
- **AC-4.6.** Я.ВебМастер site verification active: meta-тег verified, sitemap submitted, индексация tracking baseline. **Hard.**
- **AC-4.7.** GSC fallback setup: DNS verification submitted, sitemap submitted (Soft если operator DNS pending). **Soft.**

### AC-5 · Final SEO-tech sweep

- **AC-5.1.** `pnpm lint:schema --all --strict` exit 0 на 100% URL (~230). 0 errors / 0 warns. **Hard.**
- **AC-5.2.** sitemap.xml ≥230 URL финал. lastmod актуализирован. Sub-level SD emission sustained от Wave 0.1. **Hard.**
- **AC-5.3.** robots.txt audit clean: allow `/` + `/sitemap.xml` + `/foto-smeta/`; block `/admin/`, `/api/` (кроме `/api/leads`), `/preview/`, `/_next/`, `/static/`. **Hard.**
- **AC-5.4.** Canonical audit: 0 циклов self-canonical, 0 contradictions, 100% pages имеют explicit canonical. `pnpm tsx scripts/audit-canonicals.ts` exit 0. **Hard.**
- **AC-5.5.** Hreflang N/A documented (single-language ru-RU). **Soft.**
- **AC-5.6.** Redirect chains audit clean: 0 chains >2 hops, 0 dead chains. **Hard.**
- **AC-5.7.** Cross-link integrity 0 broken на ~230 URL. `pnpm tsx scripts/check-cross-links.ts --all` exit 0. **Hard.**

### AC-6 · W14 Competitor Benchmark Final + differentiation-matrix v4

- **AC-6.1.** `seosite/01-competitors/benchmark-W14.md` written: methodology sustained от W11 + 17 × 5 final table + 5 axes finalize calculation + recommendation. **Hard.**
- **AC-6.2.** `seosite/01-competitors/differentiation-matrix.md` v4 update: W13 + W14 строки добавлены + 2 NEW winning angles (`llms.txt` + Я.Метрика 8 goals). **Hard.**
- **AC-6.3.** re refresh top-3 deep-profiles (musor.moscow + liwood.ru + cleaning-moscow.ru) — current data within 2 weeks. **Hard.**
- **AC-6.4.** re diff-only sustained 14 stub-with-hypothesis (если IA-структура изменилась). **Soft.**
- **AC-6.5.** sa-seo recommendation epic close написан явно в benchmark-W14.md и operator-gate-W14.md. **Hard.**

### AC-7 · E-E-A-T axis опережение vs cleaning-moscow (conditional)

- **AC-7.1.** Если operator real-name + VK/TG sameAs передан до W14 day 7 EOD:
  - `/avtory/<operator>/` published с full Person JSON-LD + cross-domain `sameAs` (VK + TG profile URL)
  - cleaning-moscow `/avtor-<name>/` без cross-domain sameAs (sustained from W11 deep-profile)
  - **opraženie confirmed:** Obihod E-E-A-T axis +1 vs cleaning-moscow
- **AC-7.2.** Если pending к W14 day 7:
  - Generic Author 1 «Бригада вывоза Обихода» sustained
  - E-E-A-T axis sustained parity (sustained от W7+W11)
  - **EPIC PASS на 4/5 axes без E-E-A-T** (sustained intake §6 + памятки `project_poseo_autonomous_mandate_2026-05-02`)

**Soft (conditional):** Hard при operator передачи; Soft при pending.

### AC-8 · Content-depth axis confirmed +20% vs liwood

- **AC-8.1.** Final aggregate calculation:
  - Avg pillar (4 pillar) — финальный ~3800 слов (Stage 1 ~3000 + Stage 2 ~3500 + Stage 3 ~3700 → US-4 final aggregate)
  - liwood reference: ~3000 слов avg pillar (sustained from W11)
  - **+27% vs liwood** → confirmed (target ≥20%)
- **AC-8.2.** Documented в benchmark-W14.md §5.1 (axis content-depth calculation).
- **AC-8.3.** Cross-link на seoсite content samples (4 pillar URLs).

**Hard.**

### AC-9 · URL-объём axis sustained (auto-confirmed от W13)

- **AC-9.1.** sitemap.xml ≥230 URL финал (sustained AC-5.2).
- **AC-9.2.** Closure к liwood медиане 247: ~230/247 = **93%** → confirmed (target ≥75%).
- **AC-9.3.** Documented в benchmark-W14.md §5.2 (axis URL-объём calculation).

**Hard (auto-sustained от US-3 W13 closure 85.4%).**

### AC-10 · Operator gate W14 пакет

- **AC-10.1.** `specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/operator-gate-W14.md` written. **Hard.**
- **AC-10.2.** Executive summary 1 page max (≤500 слов). **Hard.**
- **AC-10.3.** 5 axes table с финальными numbers (URL / content / schema / UX / 4-в-1 / E-E-A-T conditional). **Hard.**
- **AC-10.4.** Cross-link на benchmark-W14.md + differentiation-matrix v4. **Hard.**
- **AC-10.5.** Cross-link на final sweep AC-5.x + axe reports `screen/stage3-W14/`. **Hard.**
- **AC-10.6.** Pending operator list актуальный (5-7 items max). **Hard.**
- **AC-10.7.** Sa-seo recommendation explicit: «approve epic close» (default) OR «conditional close с follow-up backlog». **Hard.**
- **AC-10.8.** leadqa real-browser smoke ≥10 representative URL включая `/komanda/`, `/sro-licenzii/`, `/avtory/`, `/foto-smeta/`, 2 pillar, 2 SD, 2 blog, 2 cases. Артефакт: `specs/EPIC-SEO-CONTENT-FILL/US-4-eeat-monitoring/leadqa-W14.md`. **Hard.**
- **AC-10.9.** release gate (RC-W14 release-notes) ready. **Hard.**

### AC-11 · ≥3 из 5 axes confirmed → EPIC DoD PASS

- **AC-11.1.** 5 axes finalize: URL ✅ + Content-depth ✅ + Schema ✅ + UX ✅ + 4-в-1 ✅ + E-E-A-T conditional.
- **AC-11.2.** **≥3/5 confirmed = EPIC PASS** (auto от W13 already 4/5 confirmed).
- **AC-11.3.** Documented в operator-gate-W14.md §3.7.2 (5 axes table + status).

**Hard (auto-PASS от W13 4/5 confirmed).**

### AC-12 · Hand-off log + memory

- **AC-12.1.** Hand-off log в US-4 sa-seo.md заполнен с phase transitions (см. §9). **Hard.**
- **AC-12.2.** EPIC intake updated с US-4 closure status (Stage 3 W14 complete). **Hard.**
- **AC-12.3.** Memory updated: `project_seo_epic_closed_2026-XX-XX.md` (после US-4 done). **Hard.**
- **AC-12.4.** Передача в release: RC-W14 release-notes + leadqa-W14.md + operator-gate-W14.md cross-linked. **Hard.**
- **AC-12.5.** Phase: gate → done (poseo обновляет frontmatter US-4 sa-seo.md). **Hard.**

**EPIC W14 hard gate (operator review required):** AC-1 / AC-2 / AC-5 / AC-6 / AC-10 / AC-11 PASS — operator review + ack обязательны (sustained `feedback_leadqa_must_browser_smoke_before_push.md` + memory `project_release_cycle_v2`).

**Auto-PASS (без operator review):** AC-3 / AC-4 / AC-7 / AC-8 / AC-9 / AC-12 — sustained autonomous mandate (`project_poseo_autonomous_mandate_2026-05-02`).

## 7 · Risk register (расширено intake §7 — 8 рисков)

### R1 — Operator real-name + VK/TG sameAs pending к W14 day 7 (P=0.6, **HIGH**)

**Описание:** sustained от W7+W11 — operator передача real-names всё ещё pending. Если к W14 day 7 не передано → E-E-A-T axis sustained parity, не опережение vs cleaning-moscow.

**Митигация:**
- Sustained 4/5 axes confirmed → EPIC всё ещё PASS на ≥3/5 hard gate
- E-E-A-T axis опережение становится post-EPIC backlog
- Author 1 «Бригада вывоза Обихода» sustained generic; placeholder с TODO в admin notes
- Conditional publish `/avtory/<operator>/` (sustained §3.2.1) — gracefully degrade
- operator-gate-W14.md явно фиксирует «4/5 + sustained parity» recommendation

**Tripwire:** если к W14 day 7 EOD pending — sa-seo recommendation в operator-gate-W14.md «approve epic close on 4/5 axes; E-E-A-T → post-EPIC backlog».

### R2 — Topvisor SaaS creds pending → fallback methodology только (P=0.6, **MEDIUM**)

**Описание:** sustained от W3+W7+W11 — operator не передал Topvisor / Keys.so creds. W14 final benchmark «методологический», не SaaS-real-time.

**Митигация:**
- Sustained fallback methodology W11 (deep-profiles + Я.ВебМастер baseline + manual SERP top-50)
- Точность ±15% (sustained); достаточно для 5 axes finalize calculation
- Sa-seo iron rule (artefact `topvisor-dashboard.md`): **«fallback methodology = source of truth, SaaS = augmentation»** — codified ADR-кандидат для tamd post-US-4
- W14 benchmark explicit footnote «methodology fallback» (sustained от W7+W11 precedent)

**Tripwire:** если operator передаёт creds в момент W14 day 1-2 → seo-tech setup Topvisor 200-key dashboard parallel; W14 benchmark получает realtime data augmentation.

### R3 — aemd зависает на 8 целях Я.Метрики (P=0.4, **MEDIUM**)

**Описание:** Я.Метрика setup — техзадача aemd cross-team. Если aemd bandwidth bottleneck (другие команды) или Я.Метрика UI quirks — 8 goals не успевают live к W14 day 6.

**Митигация:**
- Fallback к 4 primary goals (1 lead-form / 2 phone-click / 3 whatsapp-click / 6 foto-smeta-cta) — этого достаточно для PRIMARY conversion tracking
- aemd cross-team escalation на W14 day 4 EOD (если 8 goals не started) → poseo escalates через cpo
- cms data-goal атрибуты — параллельная работа (cms может wire 8 elements, aemd setup независимо)
- Документация в `yandex-metrika-goals.md` детальна — operator может delegate setup post-EPIC если нужно

**Tripwire:** если W14 day 5 EOD aemd setup не started → switch to 4 primary fallback; AC-4.5 Soft.

### R4 — lint:schema regression от Stage 3 production (P=0.3, **MEDIUM**)

**Описание:** Stage 3 W12+W13 + Wave 0.3 fix sustained 0 warns на ~211 URL. US-4 final sweep на ~230 URL может выявить новые warns от:
- E-E-A-T pages (`/komanda/`, `/sro-licenzii/`, `/avtory/`) — новые JSON-LD типы (`AboutPage`, `CollectionPage`, `Person + sameAs`)
- HowTo schema re-seed (если Track B implementation pass — new @type)
- llms.txt route — не JSON-LD, но `Content-Type` issue (text/markdown)

**Митигация:**
- W14 day 4 final sweep — early audit; если warns обнаружены, fix priority
- seo-tech sustained от Wave 0.3 — emitter patterns codified
- lint:schema strict mode (sustained Stage 2 W11) — warnings блокируют publish, не warning

**Tripwire:** если W14 day 4 final sweep > 5 warns → seo-tech priority fix день 4-5; cms publish может быть partial.

### R5 — re top-3 deep-profiles refresh не успевает к W14 day 3 (P=0.3, **MEDIUM**)

**Описание:** re cross-team — refresh musor.moscow / liwood.ru / cleaning-moscow.ru deep-profiles. Sustained от W11 — данные ~2 weeks возраст, нужен refresh для accuracy. Если re bandwidth bottleneck → benchmark-W14 может опираться на устаревшие данные.

**Митигация:**
- Top-3 mandatory refresh — re должен закрыть до W14 day 3
- Diff-only 14 stub — Soft, если bandwidth — пропустить
- Sa-seo может выполнить top-3 refresh manually через WebFetch + curl sitemap parsing (≤30 min на каждый домен)
- benchmark-W14 sustained от W11 baseline + diff на 2-week refresh

**Tripwire:** если W14 day 3 EOD top-3 refresh не started → sa-seo backup execution; benchmark-W14 пишется с явным footnote «top-3 sustained от W11, diff-only».

### R6 — Operator не апрувит epic close (P=0.2, **LOW**)

**Описание:** Все AC PASS, но operator решает «conditional close» или «push EPIC continuation» (например, требует Wave 2.5 priority-C districts перед close).

**Митигация:**
- operator-gate-W14.md explicit recommendation 2 ветки («approve» default OR «conditional»)
- Pending operator list актуальный — operator знает что ещё pending
- Post-EPIC backlog itemized в operator-gate (Wave 2.5 / amoCRM US-13 / staging deploy / real photos / E-E-A-T finalize)
- sa-seo recommendation: **default «approve epic close»**, sustained 4/5 axes confirmed = технически EPIC PASS

**Tripwire:** если operator request «conditional close с Wave 2.5» — open new US-5 (post-EPIC US) instead of holding EPIC open.

### R7 — Slug drift `zhukovskij` ↔ `zhukovsky` post-process cleanup (P=0.5, **MEDIUM**)

**Описание:** US-3 commit `3b97b12` (`fix(scripts): seed-content-stage3-cases — district slug alias zhukovskij→zhukovsky`) частично закрыл alias mapping в seed scripts. Полная cleanup — broad refactor 10+ файлов queries.ts + page.tsx + Cases / SD / static fixtures.

**Митигация:**
- Sa-seo recommendation US-4 §10 Open Q3: **post-EPIC backlog, не US-4 scope**. **Why:** broad refactor выходит за scope W14 (artefact-only); slug drift не блокирует publish/индексацию (alias mapping sustained); зависит от operator decision канонической слаги (zhukovsky vs zhukovskij)
- Quick fix US-4 если poseo решает: 1 day work через sed + tsc + Playwright re-test 5 представительных URL

**Tripwire:** если poseo apruv «закрыть в US-4» (Open Q3) → seo-tech 1-day mini-track W14 day 5; иначе — post-EPIC.

### R8 — leadqa real-browser smoke fails на W14 day 7 (P=0.2, **LOW**)

**Описание:** sustained `feedback_leadqa_must_browser_smoke_before_push.md` iron rule — leadqa должен real-browser smoke ≥10 URL ДО operator gate. Если найдены runtime issues (например, JSON-LD parse error на E-E-A-T page, 500 на conditional `/avtory/<operator>/`, missing meta tags) → Block.

**Митигация:**
- qa-site Track D parallel verification W14 day 6 (Playwright + axe ~30 sample URL) — раньше leadqa, catches issues
- cr-site review всех Track A-D PRs (do iron rule #5) — green CI pre-merge
- leadqa-W14.md с явным fail/pass per URL — operator может видеть scope blocker

**Tripwire:** если leadqa fail на 1-2 URL — fast-fix; если ≥3 URL fail → BLOCK operator gate, fix приоритетный, повторный smoke.

## 8 · Production timeline (W14, 7-day grid)

```
W14 (2026-07-25 → 2026-07-31) — финальная неделя эпика
================================================================
day 1 (Mon, 2026-07-25):
  · poseo: escalation operator — 5 pending items (real-name / СРО / Topvisor / DNS / photos)
  · sa-seo: Track A 06-eeat artefacts start (authors.md + credentials.md)
  · sa-seo: Track C topvisor-dashboard.md + yandex-webmaster.md start
  · re: top-3 deep-profiles refresh start (musor / liwood / cleaning)
  · seo-tech: Я.ВебМастер verification setup (meta-тег + sitemap submit) — operator delegate via aemd

day 2 (Tue):
  · sa-seo: Track A team-bios.md + case-evidence.md
  · sa-seo: Track B sge-readiness.md + cw FAQ A-revision plan
  · sa-seo: Track C gsc-setup.md + yandex-metrika-goals.md
  · cw: Track A 5 артефактов hub finalize (если sa-seo bandwidth позволяет, иначе sa-seo делает) + on-site content prep
  · re: top-3 refresh continue (3/3 deep)
  · seo-tech: GSC DNS verification setup (cross-team aemd для DNS record)

day 3 (Wed):
  · sa-seo: Track A methodology.md (5/5 артефактов hub done)
  · sa-seo: Track B llms-txt-spec.md + jsonld-completeness.md (3/3 neuro артефактов done)
  · cw: Track A on-site finalize content (`/komanda/` + `/sro-licenzii/` + `/avtory/` + conditional `/avtory/<operator>/`)
  · operator escalation tripwire: real-name pending → conditional `/avtory/<operator>/` SKIP
  · re: 14 stub diff-only refresh (если bandwidth)

day 4 (Thu):
  · cms: Track A on-site publish (3 + conditional 4-я страница) → HTTP 200
  · seo-tech: Track A JSON-LD audit pass на E-E-A-T pages
  · cw: Track B FAQ A-revision sample 20 представительных URL
  · seo-tech: Track D Final SEO-tech sweep — 7 audits (lint:schema --strict + sitemap + robots + canonical + hreflang + redirect + cross-link)
  · aemd cross-team: Я.Метрика 8 goals UI setup начало
  · cms: data-goal атрибуты на 8 elements в blocks
  · seo-tech: analytics event-bindings

day 5 (Fri):
  · seo-tech: Track B llms.txt route handler implementation (optional)
  · cms: Track B HowTo schema re-seed на 2-3 cases + 2-3 blog (optional)
  · aemd: Я.Метрика 8 goals UI complete (или 4 primary fallback)
  · seo-content + re: Track D benchmark-W14.md write + matrix v4 update
  · qa-site: Track C Я.Метрика goals verify через DevTools network на staging
  · sa-seo: review всех Track A/B/C/D артефактов

day 6 (Sat):
  · poseo + sa-seo: Track D operator-gate-W14.md write (executive summary + 5 axes + benchmark cross-link + recommendation)
  · qa-site: Playwright + axe ~30 sample URL включая E-E-A-T pages → screen/stage3-W14/ ~60 PNG + ~30 axe.json
  · cr-site: review всех Track A-D PRs (cumulative от Wave 1)
  · do iron rule #5: type-check + lint + format:check + test:e2e зелёные на всех PR

day 7 (Sun, 2026-07-31):
  · leadqa: real-browser smoke ≥10 representative URL → leadqa-W14.md
  · release: RC-W14 release-notes (cross-link на operator-gate-W14.md + leadqa-W14.md)
  · poseo: operator gate handoff (operator review + ack обязательны)
  · operator: review + ack OR «conditional close» request
  · do (после operator ack): deploy (если staging — pending operator DNS; иначе local-only sustained)
  · phase: gate → done
  · cpo: post-release retro (sustained release-cycle v2)
  · sa-seo: memory update `project_seo_epic_closed_2026-XX-XX.md`
```

**Sustained pattern:** 4 параллельных tracks W14 day 1-7 + operator escalation track (poseo persistent). cw bottleneck значительно ниже US-3 (artefact-only writing); aemd cross-team — главный cross-team risk.

## 9 · Hand-off log

- **`2026-05-02 · poseo`**: создан intake US-4 на основе approved EPIC intake.md + Stage 2 W11 closure + поглощения backlog Stage 3 из memory `project_seo_stage2`. Pending до старта US-4: US-3 closure W13.
- **`2026-05-03 · poseo`**: US-3 W13 production close (Wave 0 + Wave 1 priority-B 16 SD pillar + 60 sub SD + 10 blog M3 + 6 cases). 211 URL published, closure 85.4% к liwood, 4/5 axes confirmed. US-3 follow-ups (cms admin mini-case binding + slug drift cleanup) → post-EPIC OR US-4 mini-track. Передаю sa-seo на написание sa-seo.md для US-4.
- **`2026-05-03 · sa-seo`**: написана спека US-4 sa-seo.md (~900 строк, 12 AC групп, 8 рисков, 7-day W14 production timeline). Активированы skills: [seo, architecture-decision-records, market-research, blueprint, project-flow-ops]. Spec покрывает 4 параллельных tracks (E-E-A-T hub + neuro-SEO foundation + monitoring + final sweep) + operator escalation track + W14 final benchmark + operator-gate-W14 пакет. ADR-кандидаты identified для tamd post-US-4: (1) E-E-A-T schema codified (Person + Organization + sameAs cross-domain); (2) Topvisor fallback methodology iron rule; (3) Mini-case binding pattern на ServiceDistricts. Передаю обратно poseo для запуска W14 day 1 tracks (sa-seo Track A+B+C artefacts + operator escalation + re top-3 refresh + seo-tech Я.ВебМастер verification + aemd DNS cross-team).

## 10 · Open questions для poseo (минимизировано — 3 вопроса)

> Большинство закрыто sustained Stage 1+2+3 precedent. 3 пункта требуют решения poseo до старта tracks W14 day 1.

1. **E-E-A-T axis priority — full E-E-A-T contented с placeholders ИЛИ wait operator?**

   - **Default (sa-seo recommendation):** **full E-E-A-T contented с явными placeholders + TODO** (sustained Stage 1+2 placeholder pattern). Заполнить:
     - `/komanda/` generic «Бригада вывоза Обихода» + 5 TODO bio placeholders
     - `/sro-licenzii/` placeholder СРО номер `<TODO operator W14 day 3>` + ИНН/ОГРН placeholder
     - `/avtory/` Author 1 sustained + Author 2 «оператор» с TODO real-name+sameAs
     - `/avtory/<operator>/` SKIP (conditional publish — sustained §3.2.1)
   - **Why:** Stage 3 closes на E-E-A-T axis sustained parity (4/5 axes confirmed = EPIC PASS); operator escalation продолжается W14 day 1-3 без блокировки tracks. Если operator real-name + sameAs передан до W14 day 3 EOD → conditional publish `/avtory/<operator>/` + cw revision на real-names. Это «gracefully degrade» pattern.
   - **Alternative:** wait operator → блокирует Track A до W14 day 3+; ослабляет timeline.
   - **Recommendation:** **default (full contented с placeholders + conditional publish)**

2. **Topvisor methodology fallback vs SaaS (если creds пришли) — final benchmark W14 будет «методологический»?**

   - **Default (sa-seo recommendation):** **fallback methodology codified как iron rule** (sustained от W7+W11). Topvisor SaaS — **augmentation**, не sole source. **Why:** sustained `project_seo_stack` policy (Wordstat XML + Just-Magic + Key Collector + Keys.so без Ahrefs/SEMrush) + low SaaS reliance. Если creds пришли в момент W14 day 1-2 → seo-tech setup parallel; benchmark получает realtime data augmentation, но **methodology fallback остаётся source of truth**.
   - **Alternative:** SaaS-only (если creds дойдут) — risk: vendor lock-in + SaaS lapse + budget waste.
   - **Recommendation:** **default fallback codified iron rule**; SaaS optional augmentation.
   - **ADR-кандидат для tamd:** «Fallback methodology iron rule в SEO benchmarking»

3. **Slug drift `zhukovskij` ↔ `zhukovsky` post-process cleanup — US-3 follow-up post-EPIC ИЛИ US-4 mini-track?**

   - **Default (sa-seo recommendation):** **post-EPIC backlog, не US-4 scope**. **Why:** broad refactor 10+ файлов выходит за scope W14 (artefact-only); slug drift не блокирует publish/индексацию (alias mapping sustained от commit `3b97b12`); зависит от operator decision канонической slug-стратегии (zhukovsky vs zhukovskij — это бренд-decision).
   - **Alternative:** US-4 mini-track W14 day 5 (1 day seo-tech). **Risk:** ослабляет final sweep timeline; broad refactor требует careful regression testing на 76 priority-B SD + cases.
   - **Recommendation:** **post-EPIC backlog**; mini-track US-3 follow-up через `seosite/scripts/normalize-zhukovsk-slug.ts` + Playwright regression в отдельной session post-EPIC.

**Auto-resolved (sustained Stage 1+2+US-3 precedent):**
- ✅ TOV-checker exit 0 + cw 100% review для on-site E-E-A-T content + 100% review for cw FAQ A-revision sample 20 URL — sustained iron rule
- ✅ axe-core severity threshold = `minor` блокирует gate; legacy SiteChrome contrast — backlog (sustained Stage 2)
- ✅ skill `claude-api` prompt caching обязательно — sustained iron rule (cache-hit ≥80%)
- ✅ design-system §1-14 + §33 site-chrome compliance — operator reminder sustained
- ✅ B2B-author оператор + sustained Authors company-page «Бригада вывоза Обихода» — placeholder с TODO до operator передачи real-name
- ✅ schema 100% Service+FAQPage+BreadcrumbList min + LocalBusiness где применимо — sustained Stage 1+2+US-3
- ✅ AnchorAuthor cross-domain VK/TG `sameAs` — placeholder продолжается до operator передачи; conditional publish `/avtory/<operator>/`
- ✅ Real images replacement — backlog operator post-EPIC; fal.ai illustrative с TODO sustained
- ✅ Calculator placeholder остаётся; реальная логика — отдельная US с pa-site (backlog)
- ✅ payload migrate workflow + idempotent seed + safety-gate `OBIKHOD_SEED_CONFIRM` — sustained
- ✅ TG bot / Я.Метрика на staging — отключены (sustained US-0; production setup в US-4 Track C)
- ✅ basic-auth для staging — do генерирует (sustained); pending operator DNS A-record — post-EPIC
- ✅ Storybook без CI Chromatic — sustained policy (`project_cicd_backlog`)

## 11 · ADR-кандидаты (фиксируются `tamd` после US-4)

> sustained pattern: ADR пишутся `tamd` после реализации, не во время spec.

1. **ADR-XXXX: E-E-A-T schema codified — Person + Organization + sameAs cross-domain (VK/TG iron rule).** Основание: §3.1.1 + AC-1.1 + sustained от W11 deep cleaning-moscow benchmark. Pros: structured data audit-проходит; cross-domain author signal для SGE/AI-overviews citation; iron rule `sameAs` cross-domain — opraženie axis vs cleaning-moscow without sameAs. Cons: pending operator передача real-name + VK/TG profile URL — placeholder window.
2. **ADR-XXXX: Topvisor fallback methodology iron rule — fallback = source of truth, SaaS = augmentation.** Основание: §3.4.1 + AC-4.1 + sustained от W3+W7+W11 fallback methodology precedent. Pros: vendor lock-in mitigation + SaaS lapse mitigation + budget cost-control; sustained `project_seo_stack` iron rule. Cons: точность ±15% (vs Topvisor SaaS ±5%); manual refresh bottleneck (re cross-team).
3. **ADR-XXXX: Mini-case binding pattern на ServiceDistricts — post-process script vs cms admin manual.** Основание: §3.1.4 + sustained Stage 2 publish-gate AC-2.4 + US-3 AC-4.3. Pros: post-process script — idempotent, reusable, auditable; cms admin manual — flexible, но no audit trail. Decision: **post-process script default**; cms admin manual для exception cases. Cons: post-process script коды требуют regular maintenance (новые cases / новые SD batches).

(Optional, если poseo apruv) 4. **ADR-XXXX: `llms.txt` LLM-friendly content map — single-language + minimal canonical URL list.** Основание: §3.3.2 + AC-3.4. Pros: 0/17 конкурентов имеют llms.txt — uniqueness +1pp; low implementation risk + potential AI-citation upside. Cons: emerging community standard (не finalize spec); maintenance overhead на updates.

(Optional) 5. **ADR-XXXX: Я.Метрика 8 goals + selectors-as-contract pattern.** Основание: §3.4.4 + AC-4.4-4.5. Pros: structured 8 goals covering primary + secondary + tertiary conversion paths; selectors-as-contract codified в `seosite/08-monitoring/yandex-metrika-goals.md`; aemd cross-team может delegate без context loss. Cons: 8 goals overhead vs 4 primary alternative; aemd cross-team coordination.

Эти ADR пишет `tamd` (cross-team consult) ПОСЛЕ закрытия US-4, на основании реализации.

## 12 · Решения poseo по open questions (closed 2026-05-03)

**poseo apruv 2026-05-03 — все 3 open Q закрыты, sa-seo recommendations приняты:**

1. **E-E-A-T axis = full contented с placeholders + conditional publish `/avtory/<operator>/`.** **Why:** Operator real-name + VK/TG sameAs pending — escalation активна, но не блокирует production. Sustained pattern Stage 1+2+3: placeholder «лицензия СРО №<TODO operator>» + content-ready без operator credentials. Conditional publish страницы `/avtory/<operator>/` — уход в `/avtory/brigada-vyvoza-obihoda/` (company-page) если real-name не пришёл к W14 day 3 EOD. Gracefully degrade — EPIC всё ещё PASS на 4/5 axes без E-E-A-T опережения.

2. **Topvisor = fallback methodology codified iron rule.** **Why:** Sustained Stage 1+2+3 — Wordstat XML + Just-Magic + Key Collector + Keys.so без Ahrefs/SEMrush (memory `project_seo_stack`). Topvisor SaaS optional augmentation если operator даст creds к W14 day 3, иначе benchmark «методологический» — это OK для W14 final. ADR codified для tamd post-EPIC.

3. **Slug drift `zhukovskij` ↔ `zhukovsky` = post-EPIC backlog.** **Why:** Broad refactor (10+ файлов queries.ts + page.tsx + fixtures normalization) выходит за US-4 W14 scope (artefact-only). Текущий alias в `seed-content-stage3-cases.ts` (commit `3b97b12`) sustained — works для cases. Cleanup pattern post-EPIC: либо normalize всё на `zhukovsky` (rename district в БД ломает Stage 1 sustainable links — **NO**), либо нормализовать fixtures `zhukovskij` → `zhukovsky` через bulk sed + cw rerun + tov:check, либо завести постоянный `DistrictSlugAlias` table в Payload (popanel scope).

**Phase transition:** `phase: spec` → `phase: planning` для всех 4 W14 production tracks → `phase: dev` после W14 day 1 start.

**Дополнительные poseo decisions sustained от sa-seo recommendations §4 + §8:**
- ✅ **W14 day 3 escalation tripwire:** operator real-name + VK/TG sameAs / ИНН-ОГРН-СРО / Topvisor creds / DNS+GHA secrets — сообщить оператору в W14 day 1 ack. Если silent — applied gracefully degrade defaults.
- ✅ **TLDR color-contrast** (sustained Stage 2 W11 baseline, 16/16 на Stage 3 W13 mid-check) — recommendation qa-site: fix как часть SiteChrome polish до W14 final benchmark, чтобы a11y baseline стал critical=0/serious=0. **Decision:** **NOT US-4 scope** — это design-team backlog (`art` через `cpo`), не SEO. После W14 final benchmark можем напомнить operator о backlog. Но если есть простой fix `--c-accent-ink` token revision — поручить design-team параллельно W14 production (без блокировки).
- ✅ **Mini-case binding** на priority-B SD (US-3 W13 follow-up): после Cases pack publish (Run 3 done) можно связать `ServiceDistricts.miniCase.link` → `/kejsy/<slug>/`. **Decision:** post-process script `scripts/post-bind-mini-case.ts` (cms scope) — запустить **после** US-4 day 5 cms publish E-E-A-T страниц (один cms session). Снимет noindex с 6/76 SD (только тех на priority-B districts с binded case). Остальные 70 остаются draft+noindex (sustained Stage 2 publish-gate).
- ✅ **Wave 1 Run 3 cms publish 16 blog/cases — sustained idempotent re-run проверен.**

**Hand-off от poseo (2026-05-03):**
- Track A (cw): E-E-A-T hub seosite/06-eeat/ 5 артефактов + on-site `/komanda/`+`/sro-licenzii/`+ `/avtory/brigada-vyvoza-obihoda/` финализация → W14 day 1-4.
- Track B (re): 17 конкурентов deep-profiles refresh top-3 mandatory + 14 diff-only → W14 day 1-3.
- Track C (sa-seo + aemd): neuro-SEO foundation 3 артефакта + 8 целей Я.Метрики (или 4 fallback) → W14 day 4-5.
- Track D (seo-tech + cms): final SEO-tech sweep 7 audits + cms publish E-E-A-T → W14 day 5-6.
- Track E (sa-seo + qa-site + cr-site + leadqa): W14 final benchmark + differentiation v4 + operator-gate-W14 пакет → W14 day 6-7.

---

**Cross-references:**
- [intake.md](./intake.md) — US-4 intake от poseo 2026-05-02
- [EPIC intake.md](../intake.md) — EPIC-SEO-CONTENT-FILL master
- [US-3 sa-seo.md](../US-3-priority-b-districts/sa-seo.md) — Stage 3 W12-W13 эталон + Wave 0 closure
- [US-2 sa-seo.md](../US-2-sub-and-programmatic/sa-seo.md) — Stage 2 эталон (sustained pattern)
- [benchmark-W11-mid.md](../../../seosite/01-competitors/benchmark-W11-mid.md) — Stage 2 mid-check baseline
- [benchmark-W7-mid.md](../../../seosite/01-competitors/benchmark-W7-mid.md) — Stage 1 mid-check baseline
- [differentiation-matrix.md](../../../seosite/01-competitors/differentiation-matrix.md) v3 — winning angles tracking (v4 update в US-4 AC-6.2)
- [shortlist.md](../../../seosite/01-competitors/shortlist.md) — 17 competitors reference
- [brand-guide §13 TOV](../../../design-system/brand-guide.html#tov) + [brand-guide §14 Don't](../../../design-system/brand-guide.html#donts) + [brand-guide §33 site-chrome](../../../design-system/brand-guide.html#chrome) — design-system iron rule
- [project_seo_stage3_wave0_closed memory](~/.claude/projects/-Users-a36-obikhod/memory/project_seo_stage3_wave0_closed_2026-05-02.md) — Wave 0 closure context
- [project_seo_stage2_milestone memory](~/.claude/projects/-Users-a36-obikhod/memory/project_seo_stage2_milestone_2026-05-02.md) — Stage 2 W11 closure context
- [project_poseo_autonomous_mandate memory](~/.claude/projects/-Users-a36-obikhod/memory/project_poseo_autonomous_mandate_2026-05-02.md) — autonomous mandate iron rule
- [project_seo_stack memory](~/.claude/projects/-Users-a36-obikhod/memory/project_seo_stack.md) — keyword tools iron rule (Wordstat XML / Just-Magic / Key Collector / Keys.so без Ahrefs/SEMrush)
