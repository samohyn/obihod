---
adr: 0017
title: Homepage content source — отдельный Homepage global vs embed в SiteChrome
status: accepted
deciders: [tamd, podev, popanel, operator]
date: 2026-05-06
related: [EPIC-HOMEPAGE-MIGRATION Phase 2]
---

# ADR-0017 — Homepage content source

## Контекст

Phase 1 EPIC-HOMEPAGE-MIGRATION — homepage-classic.html portированы на site/ с **захардкоженным** контентом (13 React-секций). Деплой 2026-05-05, run 25378288354 success. Phase 2 — вытащить контент в Payload admin без визуального drift.

Контент главной страницы, который должен стать редактируемым:
- §01 Hero (title, subhead, lead, photo, trustBullets[3])
- §04 PricingTable (7 строк с иконками, ценами, ссылками)
- §07 Reviews (4 source-tile + 6 reviews)
- §08 Documents (8 trust-cards с photo-превью)
- §10 FAQ (8 Q&A)
- §09.5 Gallery (8 photos с caption)
- §05 PhotoSmeta (example-image + range)
- §03 Steps (5 шагов «как мы работаем»)

§02 Services / §06 Cases / §09 Coverage — уже есть как коллекции (Services, Cases, Districts), Phase 2.3b live wiring через `payload.find()`.

Header mega-menu (.iconKey) и Footer — расширяем существующий **SiteChrome global**.

## Решение

**Создать новый `globals/Homepage.ts` global** для homepage-специфичного контента (8 групп полей выше).

**SiteChrome остаётся для cross-page chrome**: header.menu / footer.columns / contacts / requisites / social. Расширяем его только полем `header.menu[].iconKey` (Phase 2.1).

## Альтернативы

### A) Embed весь homepage-контент в SiteChrome

**Минусы:**
- SiteChrome распухнет: уже 5 групп (header, footer, contacts, requisites, social) + 8 новых homepage-групп = 13 групп в одной admin-странице. Editor UX страдает.
- Нарушение Single Responsibility — SiteChrome предназначен для chrome (header/footer/contacts), не для page-content.
- Сложно изолировать homepage-revalidation: при сохранении SiteChrome придётся revalidate'ить все страницы (где он используется), не только `/`.

### B) Создать отдельные small globals (HomepageHero, HomepageReviews, etc)

**Минусы:**
- 8 globals для одной страницы = операционный overhead для editor (8 переходов в admin).
- Хуже atomicity: edit hero + faq → 2 разных save action, может разъехаться.

### C) Отдельный `Homepage` global (выбрано)

**Плюсы:**
- Изоляция scope: один global для одной страницы — легко найти, редактировать atomically.
- Single revalidation hook: `afterChange` на Homepage triggers `/api/revalidate?path=/` — не задевает другие страницы.
- Чистая архитектура: SiteChrome = cross-page chrome, Homepage = `/` content. Будущие страницы (`/b2b`, `/foto-smeta`) могут получить свои globals при необходимости.
- Editor UX: одна admin-страница для всего homepage-контента.

**Минусы:**
- Один global = большая форма (8 групп полей) — может быть длинной для editor. Митигация: collapsible sections + tabs в admin UI (Payload supports).

## Последствия

- Новый файл `site/globals/Homepage.ts` (Payload Global config).
- Новая миграция `2026MMDDHHMMSS_homepage_global.ts`.
- Новый seed-script `site/scripts/seed/homepage.ts` (заполнить начальными значениями из захардкоженного Phase 1).
- Обновление `payload.config.ts` для регистрации global.
- В page.tsx (server component) добавить `await getPayload().findGlobal({ slug: 'homepage' })` и пропустить через 13 секций.
- Каждая section: рефактор от hardcoded-JSX в props-driven (с fallback на захардкоженные значения для graceful degradation).

## Open questions (закрыты)

1. **Documents — отдельная коллекция или embed в Homepage?** Embed (до 12 docs не оправдывает таблицу). Documents = `Homepage.documents[]` array.
2. **Reviews — moderation workflow?** В Phase 2 — нет (всё в Homepage admin). Если позже появится UGC — отдельная Reviews collection с `_status: published`.
3. **Phase 2 feature flags?** Не используем — Payload `findGlobal` graceful degradation: если global ещё не seed'нут, secciones показывают hardcoded fallback. Per-section rollout не нужен.
4. **Hero photo update flow?** Edit `Homepage.hero.photo` (rel→Media) в admin. Только admin/manager роли.

## References

- План: `~/.claude/plans/team-product-podev-md-dapper-axolotl.md` секция 2.0
- RC Phase 1: `team/release-notes/RC-EPIC-HOMEPAGE-MIGRATION.md`
- ADR-0014 (panel-audit-log-storage) — паттерн отдельных globals
- ADR-0016 (payload-migrations-prod-strategy) — как делать миграции
