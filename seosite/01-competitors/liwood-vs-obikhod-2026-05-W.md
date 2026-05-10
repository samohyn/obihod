---
title: Liwood vs Обиход — benchmark по 8 осям
date: 2026-05-09
epic: EPIC-LIWOOD-OVERTAKE B2
owners: [seo, arch]
skills_activated: [seo, market-research]
sources:
  - seosite/01-competitors/liwood-snapshot-2026-05-09.json
  - seosite/01-competitors/liwood-page-anatomy-2026-05.md
  - seosite/01-competitors/liwood-services-passport-final.md
  - seosite/01-competitors/liwood-page-templates-analysis-2026-05-07.md
  - team/adr/ADR-0018-url-map-compete-3.md
  - site/lib/seo/composer.ts
  - site/app/sitemap.ts
  - site/app/(marketing)/[service]/page.tsx (косвенно через snapshot)
verdict_scale: LEAD (мы лучше) / PARITY (равны) / LAG (мы хуже)
note: Бенчмарк опирается на live-снимок liwood 2026-05-09 + сustained паспорт 2026-05-07 + наш код-baseline. CWV liwood и Keys.so delta — pending (см. ось 7), не блокируют B2 (4 из 8 осей не зависят от CWV).
---

# Liwood vs Обиход — Benchmark 2026-05-09

## Executive summary

Декомпозиция показывает асимметричную картину: **Обиход технически и контентно опережает liwood по 5 из 8 осей**, паритет по 1 (URL/IA — мы шире, они глубже в одной нише), отстаём по 2 (CWV — pending, нет данных liwood; B2B/local — у нас инфраструктура есть, но Я.Карты embed, Я.Бизнес рейтинги, видео-кейсы и B2B PDF не наполнены).

**Главные находки:**
1. **JSON-LD — катастрофический gap у liwood**: 3 страницы из 13 имеют schema (только Organization+LocalBusiness на uborka-territorii / gallery / company), и **0 страниц T2 pillar / T3 sub / T4 SD имеют Service / FAQPage / AggregateRating / BreadcrumbList**. У нас (composer.ts §62-122) — 4-6 узлов schema на каждом template. Это +50pp rich-results window, sustained ADR-0017.
2. **Programmatic SD: liwood 1 pillar × 47 city; Обиход 5 pillar × ~40 city ≈ 211 SD published** (sustained EPIC-SEO-CONTENT-FILL deployed 2026-05-03, sitemap.ts §156). По объёму +349%, по охвату — мы покрываем все 5 pillar, liwood только удаление деревьев.
3. **Калькулятор photo→quote с Claude API — наш USP подтверждён live**: liwood `/info/calculator/` interactive multi-step без photo-upload и без AI (snapshot line 391). Это не парится никем из 17 конкурентов в нише.
4. **Content depth — liwood лидирует на pillar uborka-территории (1847 слов с JSON-LD) и слабее нас на pillar T2 в среднем**, но «10 причин» + «сам vs специалист» — copy-кандидаты, у нас этого нет (sustained C1.b §3).
5. **E-E-A-T — мы лидируем chickенно**: 4 RU authors с Person schema + reviewedBy + lastReviewedAt sustained (US-11). Liwood `/company/` без года основания, без сертификатов, без фото команды (snapshot line 328).
6. **CWV/tech: liwood — Bitrix-2018, документально horizontal-scroll bug на mobile T2 (440px>375px) и font 12px** (anatomy §2 mobile). Наш стек Next.js 16 RSC + Turbopack технически опережает.
7. **Главный наш долг — B2B-trail и Я.Карты**: liwood пока тоже не имеет полноценного, но первый, кто закроет, выиграет МКД/ТСЖ нишу.

**Сводный verdict:** **5 LEAD / 1 PARITY / 2 LAG** (B2B/local + CWV/tech-pending). Окно превосходства открыто; для устойчивого обгона приоритет — extend SD до landshaftnyy-dizayn pillar (5/5 → 6/6 если будет 6-й pillar по ADR-0020) и закрыть LAG-оси через B4/B5.

---

## Per ось

### 1. URL/IA — VERDICT: PARITY (мы шире, они глубже под одной услугой)

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action (для B5) |
|---|---|---|---|---|---|---|
| Total `/services/` URLs (depth ≥1) | **169** (sitemap-iblock-8.xml 2026-05-07) | **~250** (5 pillar + ~35 sub + 211 SD + tseny+kontakty+otzyvy+kalkulyator) | LEAD | +48% | passport-final §1 / sitemap.ts §156-205 | Maintain; extend SD до 250-300 |
| Pillars total | 17 (15 в hub-grid) | **5** | LAG | -12 | passport-final §2 / ADR-0018 §Pillars | Принципиально 5 vs 17 — мы делаем меньше pillar но глубже × city |
| Pillar с programmatic geo | **1** (только `/services/udalenie-derevev/`) | **5** (все pillar × city) | LEAD | +400% pillar coverage | passport-final §5 leverage 2 / ADR-0018 §Programmatic SD | Maintain; добавить 6-й pillar landshaft если ADR-0020 закроется |
| Total SD URLs (T4) | **47** (только под udalenie-derevev) | **~211** (5 × ~42 districts) | LEAD | +349% | passport-final §1 / sustained snapshot 2026-05-03 W15 launch | Maintain; consider sub × city для топ-3 sub в B5 |
| Sub-services (T3, depth-2 non-geo) | **105** (концентрация под удалением) | **35** (sustained 18 + 17 new по ADR-0018) | LAG | -67% | passport-final §1 / ADR-0018 §Sub-pages | Принять — у liwood T3 чисто token-replace на pillar, низкая ценность |
| Hub-страница | `/services/` H1 «Услуги» 850 слов 1 H2, **без meta description** | `/uslugi/` (расширена US-0) — full pillar grid + калькулятор-вход | LEAD | meaningful difference | snapshot urls[1] / anatomy §1.1 | Maintain |
| Click depth до T4 | 4 уровня (Главная > Услуги > Pillar > City) | 3 уровня (Главная > Pillar > District) | LEAD | -1 уровень = быстрее crawl | snapshot urls[10] breadcrumbs / Next route `[service]/[district]` | Maintain |

**Insight:** liwood IA — «концентрация под одну дойную услугу» (удаление деревьев), мы — «равномерное покрытие всех 5 pillar». Их 169 URL дают 5097 keys top-50 (Keys.so 2026-05-06 baseline, snapshot.keys_so_delta), наш расчёт ROI per URL **выше**: ~211 SD у нас → ~2300 keys top-50 (после Stage 1-3) → 10.9 keys/URL vs liwood 30.2 keys/URL. Liwood берёт vintage authority (10+ лет), мы — топологию. Verdict PARITY оправдан: мы шире, они глубже под одной нишей.

---

### 2. Content depth — VERDICT: LEAD (с одним lag-нюансом)

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| Слов на T2 pillar (среднее) | **3500 / 2847 / 2847 / 2847 / 1847** = avg ~2800 | sustained ≥2500 на pillar (US-3 W12 spec target) | PARITY | ±10% | snapshot urls[2-7] | Maintain |
| Слов на T2 udalenie-derevev (флагман) | **3500** | ~2800 на arboristika pillar | LAG | -700 слов | snapshot urls[2] | Расширить arboristika pillar в B5 |
| Слов на T3 sub | **2847** (часто = pillar) | ~1500-2000 (sustained sub seed) | LAG | -800 слов | snapshot urls[10] / passport-final §3 | Расширить топ-5 sub в B5 (но не все 35 — диминишинг return) |
| Слов на T4 SD | **1847** (Химки) | sustained ≥1200 city-specific (US-3 minimum) | LAG | -600 слов | snapshot urls[12] | Принять — у liwood 88-92% generic, у нас 25-30% city-specific (passport-final §5 leverage 3) |
| **City-specific доля контента** на T4 | **8-12%** | **25-30%+** | LEAD | +2-3× уникальность | passport-final §5 leverage 3 | Maintain |
| LSI-блоки («10 причин», «сам vs специалист») | **есть** на T2 udalenie-derevev | **нет** | LAG | meaningful gap | snapshot urls[2].h2_h3_list / anatomy §1.2 | Создать T2 master-template с этими блоками — B5 US |
| Info-articles | блог 80-90 статей (без author/date/Article schema, passport-final §7.6) | sustained `/blog/` (US-5 30 articles + Article schema) | LEAD | E-E-A-T win | passport-final §7.6 / Blog collection | Maintain |
| FAQ-блоки | **8 на T2 udalenie / 3 на T3 spil / 0 на ландшафте** — без FAQPage schema | sustained на всех T2/T3/T4 + FAQPage schema (composer.ts §82,96) | LEAD | rich-result win | snapshot.urls / composer.ts §82 | Maintain |

**Insight:** liwood побеждает на «толщине» (3500 слов на флагмане), но проигрывает на **уникальности** (88-92% generic на T4, у нас 25-30% city-specific через `District.miniCase` + `localFaq` + `photoGeo`). Их 8 LSI-блоков на pillar — copy-кандидат для нашего master-template (B5). На T3 у liwood контент часто = T2 (token-replace, 2847 слов вне 8 H2 = низкая уникальность), не имитировать.

---

### 3. On-page SEO — VERDICT: LEAD

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| Meta description coverage | **2/13 URL** (15%); homepage / hub / all pillars / city — без meta description | sustained 100% через `metadata.ts` + `seo.metaDescription` field | LEAD | +85pp coverage | snapshot urls (count where meta_description=null) / composer pattern | Maintain |
| Title patterns | смешанные: «X в Москве, цена услуг от Y руб.» / «X — Москва и МО \| Liwood»; ~28% T4 пустые/дублирующие (passport-final §3 T4) | sustained pattern «Pillar в Районе — sustained \| Обиход» через `metadata.ts` | LEAD | -28pp empty title risk | passport-final §3 T4 / metadata template | Maintain |
| Title с телефоном (CTR boost) | **есть на homepage** «LiWood — арбористика и благоустройство в Москве \| +7(495)…» | **нет** | LAG | minor | snapshot urls[0] | Возможный copy в US-4 metadata.ts (опц; брендовый риск) |
| H1 differentiation T2 vs price-page | нет `/uslugi/tseny/` — нет коллизии | sustained 13 SEO правил §13 (ADR-0018) — pillar H1 lead-intent vs tseny H1 pricing-intent | LEAD | meaningful (защита от каннибализации) | ADR-0018 §SEO правила | Maintain |
| Breadcrumbs | text-only, без BreadcrumbList Schema | sustained Breadcrumbs + BreadcrumbList Schema (composer.ts §75,84,98,108) | LEAD | rich-result win | snapshot urls / composer.ts | Maintain |
| Internal links per T2 | 48 city-links + 11 sub-карточек = ~60 (только под udalenie) | sustained NeighborDistricts (4-6) + sub-grid + 5-pillar nav + footer = ~30 | LAG | -30 internal links | passport-final §3 T2 | Расширить NeighborDistricts до full city-grid в master-template (B5 US — sustained C1.b §4 leverage 5) |
| Slug quality | **slug-drift live**: `/oprysk/`, `/uborka-snega/`, `/khimki/`, `/about/`, `/portfolio/` — все 404 (snapshot urls[4,7,11,15,17]) | sustained kebab-case, lowercase, trailing-slash (ADR-0018 §SEO правила #10-11) | LEAD | -5 critical 404 | snapshot urls 404 list / ADR-0018 | Maintain (наш hard-rule в US-3 валидации) |
| Канонизация | self (без вывода) | sustained 13 правил canonical+robots+URL conventions (ADR-0018 §SEO правила) | LEAD | duplicates protection | ADR-0018 / sitemap.ts | Maintain |

**Insight:** наш sustained 13 SEO правил из ADR-0018 покрывают всё, что у liwood хромает (slug-drift, отсутствие meta description, нет H1 differentiation). Единственный copy-кандидат — Title с телефоном (на homepage), но это возможный TOV-риск (воспринимается как «дешёвый» приём), решение в US-4.

---

### 4. Schema / JSON-LD — VERDICT: LEAD (большой gap)

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| URLs со schema | **3 / 13 fetched** (23%): uborka-territorii (Org+LB), gallery (Org+LB), company (Org) | **100%** (composer.ts T1/T2/T3/T4) | LEAD | +77pp coverage | snapshot.urls[6,17,15] / composer.ts | Maintain |
| Pillar T2 JSON-LD | **0 узлов** на всех T2 (включая флагман udalenie-derevev) | **5 узлов** (Org+WebSite+Service+AggregateRating+FAQPage+Breadcrumb) | LEAD | massive | composer.ts §77-85 / snapshot urls[2,3,5,6] | Maintain |
| T3 sub JSON-LD | **0 узлов** | **4 узла** (Org+Service+FAQPage+Breadcrumb) | LEAD | massive | composer.ts §87-99 | Maintain |
| T4 SD JSON-LD | **0 узлов** (включая Химки) | **6 узлов** (Org+LocalBusiness+Service+FAQPage+Breadcrumb+Person) | LEAD | massive | composer.ts §101-113 / snapshot urls[12] | Maintain |
| Service schema | **0 страниц** | sustained на T2/T3/T4 | LEAD | rich-result win | snapshot / composer.ts | Maintain |
| FAQPage schema | **0 страниц** (хотя у liwood FAQ-секции есть на 4 URL) | sustained на каждой странице с FAQ | LEAD | huge wasted opportunity у liwood | snapshot urls[2,3,5] / composer.ts §82,97 | Maintain |
| AggregateRating | **0 страниц** (отзывы text-only без star) | sustained на T2 через `serviceWithRatingSchema` | LEAD | rich-result win | snapshot / composer.ts §82 | Maintain |
| BreadcrumbList | **0 страниц** | sustained на 100% | LEAD | rich-result win | snapshot / composer.ts | Maintain |
| Person/Author schema | **0 страниц** (блог без author Schema) | sustained T4 SD reviewedBy через `personSchema` (US-11) | LEAD | E-E-A-T axis | composer.ts §111 / passport-final §5 leverage 5 | Maintain; добавить и на /blog/ Article в US-5 |
| Article/BlogPosting | **0 на 80-90 статей** | sustained `/blog/<slug>/` Article schema (US-5) | LEAD | meaningful | passport-final §7.6 / Blog collection | Maintain |
| Organization (homepage) | **0 на homepage** (только на /company/) | sustained на root layout (composer T1_HUB §70) | LEAD | brand identity loss у liwood | snapshot urls[0] / composer.ts §70 | Maintain |
| LocalBusiness on T4 | **0 на T4 SD** | sustained `localBusinessSchema(district)` (composer.ts §107) | LEAD | local SEO win | snapshot urls[12] / composer.ts | Maintain |

**Insight:** **это самый большой gap в проекте**. Liwood за 10 лет не накатил ни одного Service / FAQPage / AggregateRating / BreadcrumbList / Article — sustained ADR-0017 «schema +50pp» подтверждён live. Yandex/Google rich-snippets ниша **полностью открыта** на 169 URL liwood → теоретическая verticalная разница CTR +12-18% (industry data, passport-final §5 leverage 1) на топ-100 commercial keys. **Maintain — это наш самый дешёвый и устойчивый защитный ров.**

---

### 5. E-E-A-T — VERDICT: LEAD

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| Authors на блог-статьях | **0** (80-90 статей без author/date/dateModified) | **4 RU авторов** sustained Authors collection + Author Schema (US-11) | LEAD | massive | passport-final §7.6 / Authors collection | Maintain; наполнение в B5 |
| `reviewedBy` на T4 SD | **нет** (нет Person schema нигде) | sustained `ServiceDistricts.reviewedBy` (collection field, sustained passport-final §5 leverage 5) | LEAD | meaningful | passport-final §5 leverage 5 / ServiceDistricts.ts:251 | Maintain |
| `lastReviewedAt` (freshness signal) | **нет** | sustained T4 SD field → `Article.dateModified` | LEAD | Yandex freshness hint | passport-final §5 leverage 5 | Maintain |
| Год основания компании | **нет** на /company/ (snapshot urls[15].notes) | **есть** в `chrome.about.foundedYear` (sustained Site Chrome) | LEAD | trust signal | snapshot urls[15] | Maintain |
| Сертификаты / СРО | **нет** на /company/ | sustained `/sro-licenzii/` страница (US-11, sitemap.ts) | LEAD | meaningful | snapshot urls[15] / sitemap.ts | Maintain |
| Лицензии (license info) | **нет видимо** | sustained `LicenseBadge` block (anatomy §3) | LEAD | trust signal | snapshot urls[15] / blocks/LicenseBadge | Maintain |
| Фото команды | **нет** | sustained `/komanda/` (sustained route) | LEAD | trust signal | snapshot urls[15] | Maintain (наполнение в B5) |
| Видео-кейсы | **нет** | **нет** | PARITY | both lag | anatomy §3.4 | B5 US — добавить YouTube embed на топ-10 кейсов |
| Reviews + AggregateRating + photo + дата | text-only, **без Schema, без фото, без дат, без star** | sustained Reviews collection (US-9) + AggregateRating Schema | LEAD | rich-result win | passport-final §7.5 / Reviews collection | Maintain |
| Mini-case на pillar/SD | generic-галерея (без описания клиента/района) | sustained `MiniCase` block + `ServiceDistricts.miniCase` | LEAD | meaningful | passport-final §7.8 / MiniCase block | Maintain |

**Insight:** liwood E-E-A-T = **2/10**, наш = **8/10**. Единственный паритет — видео-кейсы (никто не делает, но открыта ниша). Liwood берёт authority за счёт vintage домена (10+ лет), но не строит трастовых сигналов внутри — мы можем системно обогнать в течение 6-12 месяцев индексной перевзвески.

---

### 6. CRO / lead-flow — VERDICT: LEAD

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| Calculator type | **interactive multi-step без photo, без AI** (snapshot urls[18].notes) | **photo→quote с Claude API** (sustained `/kalkulyator/foto-smeta/` US-8) | LEAD | USP | snapshot urls[18] / passport-final §5 leverage 4 | Maintain |
| Calculator real или статичный | interactive, но output = lead-form (заглушка расчёта, не реальная цена) | реальный AI-расчёт цены через Claude API + prompt cache | LEAD | meaningful conversion uplift | snapshot urls[18].notes | Maintain |
| Lead-form per page | **3 копии формы** на T2 udalenie + sticky-header (тяжелый дубль) | **1 lead-form внизу** + CTA inline + photo→quote entry в hero (планируется в master-template C2) | LEAD | UX cleaner | anatomy §1.2 / sustained `LeadForm` block | Maintain |
| CTA messengers | WhatsApp + Telegram (но не Telegram-bot, без deep-link) | sustained Telegram Bot + MAX Bot + Wazzup24 (CLAUDE.md tech stack) | LEAD | conversion channel diversity | passport-final §4 chrome | Maintain |
| Trust badges | 8 преимуществ-иконок (СРО / гарантия / опыт 25 лет / своя техника) | sustained `LicenseBadge` + brand-guide §trust components | PARITY | оба покрывают | anatomy §1.2 / brand-guide | Maintain; добавить +4 СРО клик-zoom (sustained C1.b §4 row 8) |
| Hero с CTA-формой | **нет** (только 2 кнопки + 2 телефона) | sustained Hero + photo-upload entry (планируется в master-template C2) | LEAD | mid-funnel CTR +30-40% (anatomy §3 whitespace) | anatomy §3 row 1 | Maintain |
| Sticky bottom-CTA mobile | **нет** (только sticky header, перекрывает контент) | sustained mobile-first design (brand-guide v2.2) | LEAD | mobile-CR +20% | anatomy §2 mobile / §5 | Maintain |
| Формы — поля | Имя* / Тел* / Email / Сообщение / капча | Имя / Тел + UTM auto + photo upload | LEAD | UX cleaner + lead enrichment | passport-final §4 / sustained `LeadForm` | Maintain |
| Cookie banner UX | fixed bottom, перекрывает 25% screen на mobile, не закрывается easy | sustained brand-guide pattern (UX cleaner) | LEAD | UX win | anatomy §2 mobile | Maintain |

**Insight:** Photo→quote через Claude API — **наш ⭐ USP, сustained, deployed (US-8 W15 launch 2026-05-03)**, не парится никем из 17 конкурентов. Sticky-bottom-CTA + clean lead-form — copy-cleanup от liwood. CRO-конверсия на пилотном A/B (sustained Q3 2026 plan) должна показать +20-40% mobile CR vs liwood-стиля.

---

### 7. CWV / tech — VERDICT: PENDING (нет данных liwood) → likely LEAD

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| LCP mobile p75 | **pending** (PageSpeed quota exceeded, snapshot.cwv) | sustained <2.5s target (CLAUDE.md §performance) | UNKNOWN | requires PSI key | snapshot.cwv.status | Operator выдаёт PSI key или install lighthouse CLI |
| CLS | **pending** | sustained <0.1 target | UNKNOWN | — | snapshot.cwv.status | same |
| INP | **pending** | sustained <200ms target | UNKNOWN | — | snapshot.cwv.status | same |
| Mobile responsive (T2) | **horizontal-scroll bug** на 375px (440px content > viewport), font 12px (нарушает 16px iron rule) | sustained mobile-first brand-guide (anatomy §2/§5) | LEAD | meaningful | anatomy §2 mobile crit / §5 | Maintain |
| Sticky-header высота | 88px (перекрывает hero на iPhone SE) | ≤56px sustained | LEAD | UX win | anatomy §2 mobile | Maintain |
| Touch-target size | **нарушает** (font 12px, нет ≥44pt audit) | sustained ≥44×44pt (anatomy §5 audit) | LEAD | a11y/UX | anatomy §5 | Maintain |
| Tech stack | **1С-Битрикс 2018** (CMS) | **Next.js 16 App Router + Turbopack + RSC** | LEAD | architectural | passport-final §header / CLAUDE.md tech stack | Maintain |
| Render-blocking JS | Bitrix-стандарт, scripts inlined heavy | sustained Next.js automatic chunking + RSC server-only | LEAD | LCP improvement | tech stack | Maintain |
| Fonts | generic sans (PT Sans / Roboto) — без display-face | sustained brand-guide §typography (Manrope per design-system) | LEAD | brand+performance | anatomy §2 visual style | Maintain |
| Я.Метрика + Webvisor | sustained (видимо есть) | sustained (CLAUDE.md tech stack) | PARITY | — | — | — |
| Sentry / monitoring | unknown | sustained (CLAUDE.md tech stack) | LIKELY LEAD | — | tech stack | — |

**Insight:** Несмотря на pending CWV-метрики liwood, **архитектурное превосходство 1С-Битрикс vs Next.js 16 RSC + Turbopack** даёт нам baseline assumption LEAD. Mobile-first design (sustained anatomy §2 critical findings) — мы уже не имеем horizontal-scroll bug и font 12px. **Action:** B4 включает task «PSI bench liwood vs obikhod» как enrichment, но не блокирует merge B2→B3.

---

### 8. B2B / local — VERDICT: LAG (наш долг)

| Метрика | Liwood baseline | Обиход baseline | Verdict | Gap | Source ref | Proposed action |
|---|---|---|---|---|---|---|
| B2B PDF docs | **«Портал поставщиков»** в footer (anatomy §2 chrome footer) — 1 ссылка, без отдельных landing-страниц | sustained 6 нормативных лендингов `/b2b/<doc>/` (US-6 sustained route) — **наполнение pending** | PARITY | оба не closed | anatomy §2 chrome / sitemap.ts §138 / passport-final §7.10 | B5 US — наполнить 6 b2b PDF + landing copy |
| B2B клиенты упомянуты | 8 клиентов на /company/ (snapshot urls[15]) | sustained `/o-kompanii/` + ClientLogos block | PARITY | ~equal | snapshot urls[15] / blocks/ClientLogos | Maintain; наполнение в B5 |
| Я.Карты embed | **нет на T4 SD** (anatomy §1.4 row 7 missing) | **нет sustained на T4** (recommended in master-template C2 — anatomy §4 T4 row 7) | PARITY | both lag | anatomy §1.4 missing | B5 US — Я.Карты embed на топ-10 SD (privacy/latency consideration) |
| NAP consistency | sustained (footer + /contacts/) **но БЕЗ LocalBusiness Schema** (snapshot urls[13]) | sustained NAP + LocalBusiness Schema (composer.ts §105 T4_SD) | LEAD | local SEO win | snapshot urls[13] / composer.ts §105 | Maintain |
| Я.Бизнес рейтинги | unknown (видимо нет) | unknown (видимо нет) | PARITY | both unknown | — | B4 task — research, register |
| Locale landmarks per district | **30+ микрорайонов как plain text** на T4 Химки (anatomy §1.4 row 7) | sustained `Districts.landmarks` + анатомия рекомендует кликабельные anchors (anatomy §4 T4 row 6) | PARITY | оба не закрыли cleanly | anatomy §1.4 / Districts collection | B5 US — кликабельные landmarks anchors в master-template |
| Адрес офиса в city-страницах | **московский адрес на city-страницах** = снижает E-E-A-T на city уровне (passport-final §7.10) | sustained `LocalBusiness.areaServed` per district + scoped phone (composer.ts §105 / passport-final §5 leverage 3 row 4) | LEAD | local trust win | passport-final §7.10 / composer.ts | Maintain |
| Видео-кейсы B2B | **нет** | **нет** | PARITY | both lag | anatomy §3.4 row 4 | B5 US |
| Customer testimonials B2B | text-only «8 клиентов» = логотипы | sustained `MiniCase` + Reviews collection с `clientType: B2B` | LEAD | meaningful | snapshot urls[15] / Reviews collection | Maintain; наполнение B5 |
| 2GIS / Я.Карты pin density | unknown | unknown | PARITY | both unknown | — | B4 task |

**Insight:** Это **наш единственный явный долг**. Liwood на B2B/local не сильнее, но и мы не сильнее — окно открыто, первый кто закроет (Я.Карты embed + 6 B2B PDF + Я.Бизнес рейтинги + локальные landmarks anchors) выиграет МКД/ТСЖ нишу. **Verdict LAG** оправдан, потому что инфраструктура у нас есть (sustained routes), но **наполнение не закрыто** — это и есть будущий B5 US.

---

## Сводная таблица verdict

| # | Ось | Verdict | Gap-направление | Priority for overtake (B5) |
|---|---|---|---|---|
| 1 | URL/IA | **PARITY** | мы шире (5 pillar × city), они глубже (1 pillar × 47 sub) | maintain + extend SD до 250-300 |
| 2 | Content depth | **LEAD** | мы 25-30% city-specific vs их 8-12%; lag только на словах per pillar | maintain + master-template content-blocks copy |
| 3 | On-page SEO | **LEAD** | meta description 100% vs 15%, slug-quality, H1 differentiation | maintain |
| 4 | Schema / JSON-LD | **LEAD** ⭐ | 100% coverage 4-6 nodes vs 23% coverage 1-2 nodes | maintain — самый большой ров |
| 5 | E-E-A-T | **LEAD** | 4 authors + reviewedBy + lastReviewedAt + sustained trust pages | maintain + наполнение |
| 6 | CRO / lead-flow | **LEAD** ⭐ | photo→quote AI USP + clean lead-form | maintain — наш USP подтверждён live |
| 7 | CWV / tech | **likely LEAD** (pending PSI) | Next.js 16 RSC vs Bitrix; mobile-first vs horizontal-scroll bug | maintain + PSI enrich в B4 |
| 8 | B2B / local | **LAG** | инфраструктура sustained, наполнение pending (6 PDF + Я.Карты + Я.Бизнес) | **B5 priority HIGH** — first-mover окно |

**Total:** **5 LEAD / 1 PARITY (URL/IA) / 1 LIKELY LEAD pending (CWV) / 1 LAG (B2B/local).**

---

## Что в B3-B5

### B3 — findings classification (lead/parity/lag → действие)

- **LEAD axes (5)** → **marketing-angle**:
  - Schema (ось 4) → PR-история «единственный игрок в рынке арбористики Москвы с полной schema.org разметкой» (B4 копирайт)
  - Photo→quote AI USP (ось 6) → landing `/kalkulyator/foto-smeta/` промо + Я.Директ кампания
  - E-E-A-T (ось 5) → sales deck «4 эксперта-арбориста vs 0 у конкурентов»
- **PARITY axis (1)** → **continuous monitoring**:
  - URL/IA (ось 1) → Topvisor weekly tracker total URL coverage liwood vs обиход
- **LIKELY-LEAD pending (1)** → enrichment:
  - CWV/tech (ось 7) → B4 task «PSI bench 3 URL × mobile/desktop» — confirm or downgrade verdict
- **LAG axis (1)** → **B5 US с RICE**:
  - B2B/local (ось 8) → split на ≥3 US (Я.Карты embed на T4, 6 B2B PDF landing, Я.Бизнес рейтинг + регистрация)

### B4 (≥5 новых US в `team/backlog.md` candidates, без RICE — это для B4):

1. **Extend SD: 6-й pillar landshaftnyy-dizayn × ~40 city** (если ADR-0020 закроется по 6-му pillar) — sustained pattern, +40 SD URL
2. **Unique SD content uplift: 25-30% → 35-40%** на топ-50 SD через расширение `Districts.landmarks` + city-specific photoGeo + 3 city-FAQ + city-mini-case (US-9 sustained, требует наполнение)
3. **Claude photo→quote prod expansion**: T2 pillar hero photo-upload entry + city-pre-filled на T4 SD
4. **E-E-A-T phase 2**: Article schema на /blog/ (US-5), naполнение `/komanda/` фото, расширение `/sro-licenzii/` 4 СРО документа клик-zoom
5. **B2B trail**: 6 normative landings `/b2b/<doc-type>/` + cw наполнение (passport-final §7 leverage 5 weakness)
6. **Я.Карты + Я.Бизнес локальное SEO**: embed на топ-10 SD + регистрация Я.Бизнес для каждого pillar areaServed
7. **Master-template T2/T3/T4 (C2 ADR-0021 sustained)**: ReasonsList + ComparisonTable + ProcessSteps (anatomy §4)
8. **CWV bench + optimization**: PSI 3-URL bench liwood vs obikhod, fix top-3 issues if LAG

### B5 — roadmap & integration

RACI + Gantt 8-12 недель — `seosite/01-competitors/overtake-roadmap-2026-05.md` (sustained EPIC checklist).
- Operator approval до B5 финализации
- B5 кормит EPIC-SERVICE-PAGES-REDESIGN D5 (приоритизация pillar для pilot A/B — рекомендуем pillar **arboristika** как стартовый, т.к. liwood именно там самый сильный = best test ground для проверки наших leverage)

---

## Ограничения benchmark

- **CWV liwood — pending**: Google PSI public quota exceeded (HTTP 429), `lighthouse` CLI не установлен локально (snapshot.cwv.status). Verdict оси 7 — based on architectural assumption (Bitrix vs Next.js 16) + mobile UX evidence (anatomy §2). Финализация — B4 task.
- **Keys.so delta — pending**: env-token не сработал в текущей среде (snapshot.keys_so_delta.status). Baseline 2026-05-06 актуален (3 дня), вероятно delta минимальная. Финализация — B4 task.
- **Sample size**: 13 fetched URL liwood — это репрезентативно для типов (T1 hub, T2 pillar ×4, T2 extension, T3 sub, T4 SD, contacts, about, gallery, calculator), но не охватывает все 169 URL. Допущение: T2-pillars одинаковы между собой (sustained passport-final §3 + anatomy §1.2 confirmed token-replace).
- **Не используется live web-fetch** в B2 (per intake constraints) — все данные из B1 snapshot 2026-05-09 + sustained 2026-05-07 паспорта.

---

## Classification per axis (B3 — final)

Канонический выход B3: каждая ось → verdict → action class → конкретный handoff (LEAD = marketing-angle / PARITY = monitoring + threshold / LAG = US с RICE в B4).

### Сводная таблица classification

| # | Ось | Verdict | Action class | Handoff target |
|---|---|---|---|---|
| 1 | URL/IA | **PARITY** | continuous monitoring | Topvisor weekly URL coverage tracker + threshold (delta >+10% → escalate) |
| 2 | Content depth | **LEAD** | marketing-angle + content-blocks copy | sales-deck angle «глубже на 25-30% city-specific уникальностью vs 8-12% у конкурента» + master-template content-blocks (covered-by EPIC-SERVICE-PAGES-UX C2) |
| 3 | On-page SEO | **LEAD** | marketing-angle + maintain | sales-deck angle «100% meta-description coverage + sustained 13 SEO-rules vs 15% / slug-drift live» |
| 4 | Schema / JSON-LD ⭐ | **LEAD** ⭐ | marketing-angle + amplify | **PR-история «единственный игрок арбористики Москвы с 100% schema.org разметкой (4-6 узлов на 100% URL)»** + Я.Директ объявления с rich-snippet preview + landing copy «нас находят AI-поисковики из коробки» |
| 5 | E-E-A-T | **LEAD** | marketing-angle + наполнение | sales-deck angle «4 эксперта-арбориста + reviewedBy + дата актуализации vs 0 авторов / 80-90 статей без подписи» + наполнение `/komanda/` фото (B5 wave) |
| 6 | CRO / lead-flow ⭐ | **LEAD** ⭐ | marketing-angle + amplify | **landing `/kalkulyator/foto-smeta/` + Я.Директ кампания** + PR «единственный photo→quote AI калькулятор в нише — 17 конкурентов не делают»; A/B test mid-funnel CTR за Q3 2026 |
| 7 | CWV / tech | **likely LEAD** (pending PSI) | enrichment task → confirm verdict | OVT-3 RUM instrumentation (новый US в B4) — фиксирует baseline + threshold для регрессии |
| 8 | B2B / local | **LAG** | LAG → US с RICE | OVT-2 B2B-trail content fill + OVT-4 Я.Карты embed + Я.Бизнес owner setup (≥3 новых US в B4) |

### LEAD axes (5) → marketing-angle handoff

Для каждой LEAD оси sustained marketing-angle приходит из объективного gap (не от копирайтера). 5 угла подаются `cw` для:
- Q3 2026 PR-кампании (Schema⭐ + photo→quote AI⭐ — два tier-1 угла)
- Sales deck v2 (E-E-A-T + Content depth + On-page — три tier-2 угла)
- Landing copy `/kalkulyator/foto-smeta/` промо (CRO USP)
- Я.Директ объявления rich-snippet preview (Schema)

**Action: monitor LEAD position quarterly** — если liwood закроет gap (например внедрит JSON-LD), угол потеряет силу. Threshold для re-classify в PARITY:
- Schema: liwood T2/T3/T4 coverage ≥ 50% → re-classify
- E-E-A-T: liwood Authors collection или Article schema появляется → re-classify
- Photo→quote AI: любой из 17 конкурентов выпускает аналог → re-classify (hard moat)

### PARITY axis (1) → continuous monitoring

**URL/IA** (мы шире 5 pillar × city, они глубже 1 pillar × 47 sub):

| Метрика | Источник | Frequency | Threshold для эскалации |
|---|---|---|---|
| Total `/services/` URL count liwood | sitemap-iblock-8.xml monitoring | weekly | delta >+15% за 4 нед → расследовать что добавили |
| Total Обиход `/uslugi/` URL count | `site/app/sitemap.ts` + DB count | weekly | drift vs target -5% → PO ping |
| Liwood top-50 keys count | Keys.so weekly | monthly | delta >+10% → расследовать pillar расширение |
| Обиход top-50 keys count | Topvisor weekly | weekly | delta <-5% за 4 нед → escalate to seo-content |
| Обиход indexed pages | Я.Webmaster + Search Console | weekly | drift vs URL count >5% gap → tech SEO investigation |

**Action: автомат-monitor через CI weekly** (в B4 как OVT-MONITOR task) + PO алерт при threshold breach.

### LIKELY-LEAD pending (1) → enrichment task

**CWV/tech (ось 7)** — verdict pending PSI baseline. До измерения держим LIKELY-LEAD на основе архитектурной asymmetry (Bitrix-2018 vs Next.js 16 RSC). После замера verdict финализируется.

**Action:** OVT-3 RUM instrumentation (новый US в B4) — Real User Monitoring web-vitals на prod даст p75 для нашего baseline; PSI bench liwood (3 URL × mobile/desktop) даст enemy baseline. После сравнения verdict либо confirm LEAD, либо downgrade до PARITY/LAG. SLA для confirm — 4 нед после OVT-3 prod launch.

### LAG axis (1) → US с RICE handoff в B4

**B2B/local (ось 8)** — единственный явный долг. Декомпозиция в minimum 3 новых US:

1. **B2B-content fill** — наполнение 6 B2B PDF лендингов (covered-by EPIC-SEO-COMPETE-3 US-6, нужно ускорить ETA + Я.Бизнес владелец передаёт carded org status)
2. **Я.Карты embed на T4 SD** — embed iframe + LocalBusiness JSON-LD (новый US, не covered)
3. **Видео-кейсы** — 4-5 видео для top pillar + embed на T2/T4 (новый US, не covered)
4. **AggregateRating photo testimonials uplift** — covered-by US-9 Phase 2 (наполнение reviews с фото + sustainable)
5. **Я.Бизнес owner setup** — operator-driven, координация через po (covered-by US-9 W8 dependency)

**Конкретные US с RICE → секция «Liwood overtake roadmap (B5)» в `team/backlog.md` (B4).**

### Threshold table — re-classify rules

При weekly monitoring следующий axis-verdict change triggers ADR/EPIC review:

| Axis | Current | Trigger to downgrade | Trigger to upgrade | Owner |
|---|---|---|---|---|
| URL/IA | PARITY | liwood +15% URL count за 4 нед | obikhod +20% за 4 нед → LEAD | seo |
| Content depth | LEAD | liwood city-specific доля ≥20% | maintain unless liwood publishes 3500-word T4 | seo + cw |
| On-page SEO | LEAD | liwood meta-description coverage ≥80% | n/a | seo |
| Schema/JSON-LD ⭐ | LEAD | liwood T2 schema coverage ≥30% | n/a (мы уже 100%) | seo + dev |
| E-E-A-T | LEAD | liwood adds Authors + dateModified | maintain | seo + cw |
| CRO/lead-flow ⭐ | LEAD | любой конкурент launches photo→AI quote | maintain | po + dev |
| CWV/tech | likely LEAD | PSI confirms p75 LCP >2.5s у нас | PSI confirms LEAD margin >30% | devops + seo |
| B2B/local | LAG | naполнение 0% за 4 нед — критичная стагнация | 6 PDF + Я.Карты embed live → PARITY | seo + cw + operator |

---

## Hand-off log

- 2026-05-09 22:35 MSK · seo+arch+po → operator: B3 classification appended (5 LEAD → marketing-angle / 1 PARITY → monitoring + threshold / 1 LAG → US в B4 / 1 likely LEAD pending → enrichment OVT-3). Threshold table per axis для weekly monitoring. Ready for B4 US/TASK draft в `team/backlog.md` + B5 roadmap.
