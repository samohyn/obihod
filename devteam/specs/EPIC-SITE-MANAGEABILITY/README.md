# EPIC SITE-MANAGEABILITY — зонтик программы US-3..US-10

**Автор:** in
**Дата старта:** 2026-04-24
**Спонсор:** operator
**Цель:** превратить сайт obikhod.ru в полностью управляемый контент-менеджером продукт уровня liwood.ru по SEO-структуре, с замкнутым заявочным контуром и доказанной технической готовностью.
**Эталон:** [liwood.ru](https://liwood.ru) (по SEO-структуре и IA, не по дизайну).

## Linear

- **Project:** [EPIC SITE-MANAGEABILITY](https://linear.app/samohyn/project/epic-site-manageability-076efc9d9e64) (team: obikhod / OBI, lead: Георгий Самохин, priority: High)

## Состав программы

Исполнение — **строго последовательное 1 → 8**. Разблокировка следующего эпика — только после acceptance предыдущего оператором.

| # | US | Linear | Слаг | Тип | Ведущие роли | Intake |
|---:|---|---|---|---|---|---|
| 1 | US-3 | [OBI-1](https://linear.app/samohyn/issue/OBI-1) (Todo) | admin-ux-redesign | design-refresh + feature | ux → ui → art → be4 → qa1 | [intake](../US-3-admin-ux-redesign/intake.md) |
| 2 | US-4 | [OBI-7](https://linear.app/samohyn/issue/OBI-7) (Backlog) | semantic-core | research | seo1 + re + cw | [intake](../US-4-semantic-core/intake.md) |
| 3 | US-5 | [OBI-2](https://linear.app/samohyn/issue/OBI-2) (Backlog) | full-sitemap-ia | research + feature | sa + seo1 + ux + cw + be4 | [intake](../US-5-full-sitemap-ia/intake.md) |
| 4 | US-6 | [OBI-8](https://linear.app/samohyn/issue/OBI-8) (Backlog) | content-production | content | cw + lp + art + seo2 | [intake](../US-6-content-production/intake.md) |
| 5 | US-7 | [OBI-3](https://linear.app/samohyn/issue/OBI-3) (Backlog) | content-seo-coverage-audit | research | seo2 + qa1 + cw + re | [intake](../US-7-content-seo-coverage-audit/intake.md) |
| 6 | US-8 | [OBI-4](https://linear.app/samohyn/issue/OBI-4) (Backlog) | features-and-crm | feature | fe1 + fe2 + be3 + be4 + tamd + sa | [intake](../US-8-features-and-crm/intake.md) |
| 7 | US-9 | [OBI-5](https://linear.app/samohyn/issue/OBI-5) (Backlog) | full-regression | ops + bug | qa1 + qa2 + tamd + do | [intake](../US-9-full-regression/intake.md) |
| 8 | US-10 | [OBI-6](https://linear.app/samohyn/issue/OBI-6) (Backlog) | seo-neuro-tech-audit | research + ops | seo2 + re + pa + do | [intake](../US-10-seo-neuro-tech-audit/intake.md) |

## Правила программы (зафиксированы оператором 2026-04-24)

- Каждый эпик — отдельный полный цикл BA (intake → ba → po → sa → impl → qa → cr → out).
- **Каждый эпик согласовывается с оператором до старта следующего.**
- «Лишнее не делаем» — scope каждого эпика режется до минимально-достаточного.
- **«Будут ошибки — уволю»** — жёсткие DoD по каждому эпику.
- Сроки: «двигаемся как можем» — без фиксированной даты запуска.
- Платные сервисы: US-4 = **Keys.so + Just-Magic** (уже есть) + **Topvisor** (~1 500–3 000 ₽/мес, есть REST API). Topvisor покрывает также мониторинг позиций для US-10. На US-7 опционально добавим Serpstat Lite (~7 000 ₽/мес) для backlinks-аудита. На US-8/US-9 — колтрекинг + uptime. **Ahrefs не берём** (не покрывает Яндекс/Wordstat, дороже, нужна международная карта).

## Immutable (не пересматривать внутри программы)

Берём как данность из [CLAUDE.md](../../../CLAUDE.md) и `contex/03_brand_naming.md`:

- Бренд ОБИХОД, позиционирование, TOV, оффер «фикс-цена за объект», B2B-крючок «штрафы ГЖИ на нас».
- Стек: Next.js 16 + Payload 3 + PostgreSQL + Beget VPS.
- География 1-й волны: Одинцово, Красногорск, Мытищи, Химки, Истра, Пушкино, Раменское (+ Жуковский).
- Каналы коммуникации: Telegram + MAX + WhatsApp (Wazzup) + телефон.

## Прогресс

| Эпик | Статус | Дата открытия | Дата закрытия | Release Note |
|---|---|---|---|---|
| US-3 | Intake готов, ждёт ответов оператора | 2026-04-24 | — | — |
| US-4 | Backlog | — | — | — |
| US-5 | Backlog | — | — | — |
| US-6 | Backlog | — | — | — |
| US-7 | Backlog | — | — | — |
| US-8 | Backlog | — | — | — |
| US-9 | Backlog | — | — | — |
| US-10 | Backlog | — | — | — |

## Hand-off

Текущий активный эпик — **US-3**. Ожидаются ответы оператора на 5 вопросов в [US-3 intake](../US-3-admin-ux-redesign/intake.md#открытые-вопросы-к-оператору-до-передачи--ba).
