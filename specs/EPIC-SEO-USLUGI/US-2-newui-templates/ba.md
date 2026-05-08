---
us: US-2
title: newui/ макеты × 4 шаблона — T1 hub / T2 pillar / T3 sub / T4 SD
team: seo (orchestrate) + design (execute)
po: poseo
type: design
priority: P0
segment: services
phase: dev
role: ba
status: active
blocks: [US-3, US-4, US-5, US-6, US-7, US-8]
blocked_by: [US-1]
related:
  - specs/EPIC-SEO-USLUGI/intake.md
  - specs/EPIC-SEO-USLUGI/US-1-research-spec/sa-seo.md
  - team/adr/ADR-0019-uslugi-routing-resolver.md
  - design-system/brand-guide.html (v2.2)
  - newui/brand-guide-styles.css
  - newui/homepage.html (sustained reference для CSS patterns)
  - seosite/01-competitors/liwood-services-passport-final.md
created: 2026-05-08
updated: 2026-05-08
---

# US-2 — 4 шаблона newui/ С НУЛЯ

## Бизнес-цель

US-1 дал контракт routing-resolver (ADR-0019) и URL inventory (191 URL). US-2 даёт **визуальный язык** для этих 191 URL — 4 HTML-макета, под brand-guide v2.2 services (§1-14), mobile-first.

Liwood-passport (US-1 deliverable) показал слабости конкурента: 0 JSON-LD, broken Title на T4, generic-галерея на city-страницах, отсутствие AggregateRating. Наши 4 шаблона должны эти слабости системно закрыть **на уровне макета** — то есть зашить блоки JSON-LD + AggregateRating + Author + локальные элементы прямо в HTML, чтобы US-4 (tech) реализовал их по готовой схеме без архитектурных дискуссий.

## Решение оператора 2026-05-07

> «**Перерисовать все 4 шаблона С НУЛЯ под brand-guide.**»

Это означает:
- НЕ использовать sustained `newui/uslugi-service-district.html` (2085 строк) как baseline — отправная точка, но не финал
- Все CSS-классы/токены берём из brand-guide v2.2 + shared CSS (`newui/brand-guide-styles.css` + `newui/homepage-shared.css`)
- Mobile-first 375/414/768/1024 на каждой итерации (memory `feedback_newui_mobile_first.md`)
- TOV §13 Caregiver+Ruler из brand-guide
- Anti-Тильда §15 Don't соблюдается

## 4 шаблона

| # | Файл | URL-pattern | Роль | Блокирует |
|---|---|---|---|---|
| T1 | `newui/uslugi-hub.html` | `/uslugi/` | Категорийный hub (5 pillar карточек, как liwood/services/) | US-4 imp `app/(marketing)/uslugi/page.tsx` |
| T2 | `newui/uslugi-pillar.html` | `/<pillar>/` (пример: `/vyvoz-musora/`) | Pillar-страница услуги (sub-services + цены + кейсы) | US-4 redesign `[service]/page.tsx` |
| T3 | `newui/uslugi-sub.html` | `/<pillar>/<sub>/` (пример: `/vyvoz-musora/vyvoz-stroymusora/`) | Под-услуга (специфичный intent) | US-4 redesign sub view |
| T4 | `newui/uslugi-service-district.html` | `/<pillar>/<city>/` (пример: `/vyvoz-musora/balashikha/`) | Programmatic SD — service × city | US-4 imp T4 view |

## AC US-2

- [ ] Все 4 HTML файла существуют в `newui/`
- [ ] Каждый файл валидно (W3C valid HTML5, semantic), без external JS framework (только vanilla)
- [ ] CSS только из shared (`brand-guide-styles.css`, `homepage-shared.css`) + локальный `<style>` в template (минимальный)
- [ ] Все 4 макета mobile-first: 375 → 414 → 768 → 1024 (4 viewport snapshot)
- [ ] axe-core 0 critical violations
- [ ] JSON-LD блоки stub'ы (placeholder data) с правильной структурой per ADR-0019/§4 sa-seo:
  - T1: Organization + WebSite + ItemList + BreadcrumbList
  - T2: Organization + Service + AggregateRating + FAQPage + BreadcrumbList
  - T3: Organization + Service(sub-scoped) + FAQPage + BreadcrumbList
  - T4: Organization + LocalBusiness + Service + FAQPage + BreadcrumbList + Person (Author)
- [ ] Все 4 имеют `<meta name="viewport"...>` + `<link rel="canonical">` placeholder + Open Graph
- [ ] Все 4 имеют CTA «Загрузите фото — получите смету» (sustained `/kalkulyator/foto-smeta/`)
- [ ] T2/T3/T4: блок AggregateRating видимый (не только в JSON-LD)
- [ ] T4: city-mention ≥5 раз в hero+body, список 25+ микрорайонов в подвале, локальная цена
- [ ] T4: Author block (фото + имя + должность + дата review) — E-E-A-T leverage
- [ ] T1 Hub: 5 pillar карточек с превью + priceFrom + breadcrumbs

## Out-of-scope US-2

- Реальный контент: hero текст, FAQ-вопросы, отзывы — placeholder lorem-style ok (US-5 заполнит)
- Tailwind/React-имплементация — это US-4
- Реальные landmarks/микрорайоны — placeholder в T4 (Тестовый микрорайон 1, etc.) ok, US-5/US-3 заменит из БД
- Реальные authors — placeholder (Алексей Семёнов / Игорь Ковалёв / etc.) — sustained authors из site/scripts/seed.ts:840+ можно использовать как stub

## Risks US-2

| # | Risk | Mitigation |
|---|---|---|
| 1 | 4 макета delegate'ятся 4 параллельным агентам → стилевая разнобой | Один art brief per template + общий CSS shared (`brand-guide-styles.css`) + строгий cross-check в leadqa |
| 2 | Mobile-first 4 viewports × 4 templates = 16 visual regression — большой axe-core scope | Playwright multi-viewport spec в leadqa, blocking gate |
| 3 | T4 макет сложный (15+ секций) | Sustained `newui/uslugi-service-district.html` как структурный референс (не визуальный финал), 2085 строк — переиспользуем структуру, перерисуем CSS под brand-guide |

## Hand-off log

```
2026-05-08 · poseo → ba (US-2): dispatch
2026-05-08 · ba: US-2 ba.md draft, переход sa-seo + 4 art briefs
```
