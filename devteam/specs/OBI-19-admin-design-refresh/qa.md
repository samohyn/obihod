# OBI-19: QA Report (qa1)

**Статус:** pass
**Дата:** 2026-04-27
**Стенд:** local + prod /admin (после deploy)
**Браузеры:** chromium 138 (Playwright)
**Ветка/коммит:** feat/OBI-19-admin-design-refresh

## AC coverage

| AC                                              | Тест                                                          | Статус | Заметка                                                |
| ----------------------------------------------- | ------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| Golos Text на dashboard (computed)              | `admin-design-compliance.spec.ts` — assert `--font-body`      | pass   | `Golos Text → Inter → system` — резолвится корректно   |
| Primary button = `#2d5a3d`                      | `admin-design-compliance.spec.ts` — assert palette token      | pass   | `--brand-obihod-primary == #2d5a3d`                    |
| Card radius = 10px (`--brand-obihod-radius`)    | `admin-design-compliance.spec.ts` — assert radii tokens       | pass   | `--brand-obihod-radius == 10px`                        |
| Input focus outline = `#2d5a3d`                 | Manual — клик в любое поле collection editor                  | pass   | Селектор `input:focus-visible` → outline brand green   |
| Smoke /admin отдаёт 200                         | Manual + deploy.yml smoke step                                | pass   | После deploy, см. подтверждение `do`                   |

## Visual compliance

Сравнение с `contex/07_brand_system.html`:

- ✅ Палитра `--c-primary/--c-accent/--c-bg/--c-ink` идентична `--brand-obihod-*` в admin
- ✅ Радиусы `--radius-sm: 6px / --radius: 10px / --radius-lg: 16px` совпадают
- ✅ Шрифт Golos Text 400/500/600/700 — единый source через Google Fonts
- ✅ Primary button hover = `--c-primary-ink` (контракт «inkdarkening» из brand-guide)
- ✅ Status pills `published/draft` цвета согласованы с `.badge-live/.badge-draft` brand-guide

## A11y

- axe — без нарушений на изменённых селекторах (color-contrast не задет, `--brand-obihod-muted` подтянут до 4.5:1 ради WCAG AA — было ещё в пред-PR)
- Keyboard — `:focus-visible` на input/button работает (outline 2px brand green)

## Performance

- Google Fonts `@import` добавил **+1 blocking request** на admin first paint. Принято как приемлемое для admin (внутренний инструмент). Для public-сайта Golos Text идёт через `next/font/google` — без блока.
- Никакого регресса на public Lighthouse (admin вне скоупа).

## Итог

Admin визуально консистентен с brand-guide. AC покрыты, e2e-тест добавлен в suite, регрессий нет. PR готов к merge.
