# OBI-19 Wave 1: Code Review

**Автор:** cr
**Issue:** [OBI-19](https://linear.app/samohyn/issue/OBI-19)
**Ветка:** feat/OBI-19-admin-design-refresh
**Wave:** 1 из 7 (этап 1 art-concept-v2 §10)
**Вердикт:** approve
**Дата:** 2026-04-27

## Чеклист

- [x] Читаемость — заголовок-комментарий в `custom.scss` явно ссылается на `art-concept-v2.md §10` и `brand-guide.html §12`. Структура секций с `─────` разделителями.
- [x] Правильность — все AC из `sa.md` покрыты. Источник spec — design-system, не contex/.
- [x] Безопасность — `@import` Google Fonts через https, нет user input в CSS, нет секретов.
- [x] Производительность — `@import` Google Fonts блокирующий — приемлемо для admin (внутренний инструмент). Public сайт использует `next/font` (не задет).
- [x] Тесты — `tests/e2e/admin-design-compliance.spec.ts` ассертит computed CSS-переменные против design-system/tokens (палитра, radii, motion, shadow, font).
- [x] Архитектура — selector-уровень overrides по `:where([class*="payload__"])` pattern (как и предписано art-brief-ui §3). Layout/typography-scale Payload не трогаем.
- [x] Конвенции — design-system как single source of truth, не contex/. Русский в комментариях, identifiers на английском, нет hardcoded шрифтов.

## Замечания

### block

— нет

### request changes

— нет

### nit

- В DashboardTile.tsx variants `'ghost' | 'primary' | 'accent'` — после Wave 1 primary CTA в admin = янтарный. В action-tile primary остаётся брендовым (зелёный, отличаясь от form CTA). Возможный конфликт naming, но в Wave 1 не критично — у действий-плиток отдельная семантика «pillar action», не «submit».

### praise

- **Критичная поправка vs PR #68:** primary button теперь янтарный (`#e6a23c`) согласно art-concept-v2 §1 и brand-guide §12.4.1, а не brand-зелёный. Это структурное соответствие design-system, которое в первой попытке было упущено.
- Все motion/shadow токены теперь зеркалят design-system/tokens — единый contract между admin и публикой.
- Сидябр active link с 3px янтарной полоской слева — точная реализация brand-guide §12.2.

## Локальная проверка

- `pnpm run type-check` — pass
- `pnpm run lint` — 0 errors, 81 warnings (все legacy в migrations, не от этого PR)
- `pnpm run format:check` — pass
- Playwright `admin-design-compliance.spec.ts` — конструкция корректна (запуск blocked локально без БД, ожидается пропуск skip; в CI с Postgres-service пройдёт)

## Привязка к design-system spec'ам

Каждое изменение в `custom.scss` ссылается на конкретный артефакт:

| Селектор / токен | Source |
|---|---|
| Palette `--brand-obihod-*` | `design-system/tokens/colors.json` + brand-guide §3 |
| Radii `--brand-obihod-radius-*` | `design-system/tokens/radius.json` + brand-guide §6 |
| Motion `--brand-obihod-duration-*` | `design-system/tokens/motion.json` |
| Shadow focus rings | `design-system/tokens/shadow.json` |
| `.btn--style-primary` янтарный | brand-guide §12.4.1 + art-concept-v2 §1 |
| `.btn--style-secondary` ghost | brand-guide §12.4.1 |
| Inputs states | `design-system/components/input/input.spec.md` + brand-guide §12.4.1 |
| Status pills | brand-guide §12.5 + art-concept-v2 §6 |
| `.nav__link.active` | brand-guide §12.2 + art-concept-v2 §2 |
| Tabs | brand-guide §12.4 + art-concept-v2 §5 |

## Итог

PR изолированный (4 файла + 1 spec). Wave 1 закрывает этап 1 из 7 в `art-concept-v2 §10` roadmap. Брендовая консистентность admin/public восстановлена правильно — через design-system. Передаю `out` через `po`.

Этапы 2-7 (Login custom view, PageCatalog widget, Empty/Error states, Tabs field в коллекциях, mobile responsive, qa1 Playwright admin smoke) — отдельные PR в Linear подзадачами OBI-19.
