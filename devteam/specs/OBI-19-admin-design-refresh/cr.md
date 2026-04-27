# OBI-19: Code Review

**Автор:** cr
**Issue:** [OBI-19](https://linear.app/samohyn/issue/OBI-19)
**Ветка:** feat/OBI-19-admin-design-refresh
**Вердикт:** approve
**Дата:** 2026-04-27

## Чеклист

- [x] Читаемость — комментарии в `custom.scss` поясняют контракт с `globals.css` и зачем `@import` Google Fonts
- [x] Правильность — все AC из issue покрыты (Golos Text, palette, radii, primary button, input focus, status pills)
- [x] Безопасность — `@import` Google Fonts через https, никаких user input в стилях, ничего секретного
- [x] Производительность — Google Fonts CSS блокирующий ресурс (приемлем для admin как внутреннего инструмента; FOUC покрыт fallback на Inter → system)
- [x] Тесты — `tests/e2e/admin-design-compliance.spec.ts` проверяет computed CSS-переменные и font-body
- [x] Архитектура — не трогаем layout/typography-scale Payload, только CSS-overrides + minor inline-style правки
- [x] Конвенции проекта — единый бренд-источник (`contex/07_brand_system.html`), русский в комментариях, identifiers на английском, нет hardcoded шрифтов

## Замечания

### block

— нет

### request changes

— нет

### nit

- `BeforeDashboardStartHere.tsx`:170 — захардкожен `borderRadius: 6` (для `rowStyle`). Уже заменён на `var(--brand-obihod-radius-sm, 6px)` в этом PR — закрыто.

### praise

- Контракт «brand-guide → globals.css → custom.scss» теперь линейный: одно изменение токена в `contex/07_brand_system.html` фиксируется параллельной правкой в обоих CSS-источниках. До этого admin отставал на «Inter».
- Использование `var(--font-body)` вместо hardcoded `'Inter'` в `BeforeDashboardStartHere` и `DashboardTile` — единственно правильный путь, чтобы при смене фирменного шрифта менять в одном месте.

## Локальная проверка

- `pnpm run type-check` — pass
- `pnpm run format:check` — pass (All matched files use Prettier code style)
- `pnpm run lint` — pass (0 errors, 81 warnings — все legacy `no-explicit-any` / unused-vars в migrations, не от этого PR)
- Smoke по AC локально через Playwright `admin-design-compliance.spec.ts` — pass

## Итог

PR безопасный, изолированный (3 файла + 1 spec). Брендовая консистентность admin/public восстановлена. Передаю `out` через `po`.
