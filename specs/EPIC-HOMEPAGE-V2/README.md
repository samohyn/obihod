# EPIC-HOMEPAGE-V2 — пересборка главной obikhod.ru под brand-guide v2.2

**Автор:** art (Design Director) · **Дата старта:** 2026-05-03 · **Спонсор:** operator
**Цель:** превратить W15-launch главную из placeholder-сборки в полноценный USP-led лендинг под концепцию **«Фотосмета»** (Direction 1: operational, Caregiver 50 / Ruler 30 / Operational 20).
**Эталон:** `design-system/brand-guide.html` v2.2 (single source of truth, §1-14 services + §33 site-chrome).

## Проблема

Главная `/` (`site/app/(marketing)/page.tsx`) собрана за W15 для запуска и держит структуру 13 секций, но:

- 9 placeholder-фото (Hero 1 + Team 4 + Cases 3×2 before/after) — диагональные полоски вместо реальных бригад.
- Cases / Reviews — hardcoded в JSX, не из Payload (14 кейсов в коллекции игнорируются).
- USP «фото→смета за 10 минут» (winning angle, 0/17 конкурентов имеют) спрятан внутри секции Calculator.
- B2B-блок на 11-й позиции — late-funnel placement несоразмерен экономике (Коттедж 1.8M ₽/год).
- 12 опубликованных Districts (из roadmap 74) на главной не показаны никак.
- LeadForm UI-only (`e.preventDefault()`), не подключена к Payload Leads / Telegram.
- SeasonCalendar (12×4 матрица) дублирует Services — переусложнение.

## Решение

Полная пересборка под **Direction 1 «Фотосмета»** + гибрид с certificate-band из Direction 3 «Сертификат». Концепция, структура секций, иерархия CTA, visual mood — в [art-brief.md](../US-13-homepage-redesign-art/art-brief.md).

Решение оператора 2026-05-03: полная пересборка / реальная фотосессия бригад / Coverage-секция / Direction 1.

## Состав программы

Исполнение строго последовательное в рамках design-команды + параллельно production (фотосессия) + Payload backlog (Reviews collection, Cases.featured).

| # | US | Слаг | Тип | Ведущие роли | Артефакт |
|---:|---|---|---|---|---|
| 1 | US-13 | homepage-redesign-art | art-direction + briefs | art → ui → ux | [intake](../US-13-homepage-redesign-art/intake.md) |
| 2 | US-14 | homepage-ui-mockups | design (макеты) | ui (на art-brief-ui.md) | _pending — start after US-13 art-brief signoff_ |
| 3 | US-15 | homepage-ux-wireframes | design (CJM + wireframes) | ux (на art-brief-ux.md) | _pending — start after US-13 art-brief signoff_ |
| 4 | US-16 | homepage-fe-build | feature (верстка) | sa-site → fe-site → be-site | _pending — start after US-14 + US-15 approve_ |
| 5 | US-17 | homepage-photo-production | external production | оператор + внешний фотограф | _pending — параллельно US-14/15/16, 11 финальных кадров_ |
| 6 | US-18 | homepage-payload-prep | backend prep | popanel → be-site (Reviews collection + Cases.featured) | _pending — параллельно US-14/15_ |

## Правила программы

- **Spec-before-code (iron rule #2):** US-16 fe-build НЕ стартует без одобренной `sa-site.md` от `podev`.
- **Каждый US — отдельный полный цикл** intake → spec → impl → qa → cr → leadqa → operator approve.
- **Параллельность:** US-14/15 (макеты+wireframes) + US-17 (фото) + US-18 (Payload) могут идти одновременно после US-13 signoff.
- **Single source of truth:** `design-system/brand-guide.html` v2.2. Любое отклонение требует PR в `design/integration` от `art`.
- **Design system iron rule #3:** перед каждым US-задачей роль сверяет с brand-guide §13 TOV + §14 Don't.
- **Photo production — задача оператора** (внешний фотограф). Команда не верстает на placeholder, если фото не готовы — Hero/Team на момент launch остаются с заглушкой + Team сокращена до 2 карточек.
- **brand-guide.html §35 Homepage** дополняется ПОСЛЕ запуска новой главной (US-13 art-brief = source для будущей §35).

## Immutable (не пересматривать внутри программы)

- Бренд ОБИХОД, archetype Caregiver+Ruler, TOV из `contex/03_brand_naming.md` + brand-guide §13.
- Direction 1 «Фотосмета» — выбран оператором 2026-05-03, не пересматриваем без явного запроса.
- 16-секционная структура из art-brief — base scope, частичные изменения через PR в art-brief.
- Primary CTA «[📷 Сфотографировать объект] → смета за 10 мин» (btn-accent, якорь #foto-smeta) — единственный primary везде.
- Iron rule §33 site-chrome: один Header / один Footer / Pre-footer CTA — не сломать.

## Прогресс

| US | Статус | Дата открытия | Дата закрытия | Release Note |
|---|---|---|---|---|
| US-13 | art-brief в работе (этой сессией) | 2026-05-03 | — | — |
| US-14 | pending | — | — | — |
| US-15 | pending | — | — | — |
| US-16 | pending (blocked by US-14 + US-15) | — | — | — |
| US-17 | pending (production timeline 1-2 недели) | — | — | — |
| US-18 | pending (popanel backlog) | — | — | — |
