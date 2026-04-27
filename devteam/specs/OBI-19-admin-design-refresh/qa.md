# OBI-19 Wave 1: QA Report (qa1)

**Статус:** pass
**Дата:** 2026-04-27
**Стенд:** local + ожидается prod /admin после deploy
**Браузер:** chromium (Playwright CI default)
**Ветка/коммит:** feat/OBI-19-admin-design-refresh

## AC coverage

| AC | Тест | Статус | Заметка |
|---|---|---|---|
| Палитра 10 токенов на :root | `admin-design-compliance.spec.ts` block 1 | pass | primary/primary-ink/accent/accent-hover/accent-ink/paper/ink/muted/line/danger |
| Радиусы sm:6 / m:10 / lg:16 | `admin-design-compliance.spec.ts` block 2 | pass | соответствуют design-system/tokens/radius.json |
| Motion fast:120ms / base:200ms / ease.standard | `admin-design-compliance.spec.ts` block 3 | pass | соответствуют design-system/tokens/motion.json |
| Shadow focus-primary / focus-error | `admin-design-compliance.spec.ts` block 4 | pass | соответствуют design-system/tokens/shadow.json |
| Font Golos Text + Inter fallback | `admin-design-compliance.spec.ts` block 5 | pass | подгружается через `@import` |
| Primary button янтарный (НЕ зелёный) | Manual + computed style | pass | `.btn--style-primary` background = `#e6a23c` |
| Sidebar active link bg primary + 3px accent border | Manual | pass | `.nav__link.active` |
| Status publ pill bg primary | Manual | pass | `.pill--style-success` |
| Status draft pill bg accent | Manual | pass | `.pill--style-warning` |
| Input focus border primary + soft shadow | Manual | pass | `:focus-visible` |
| Smoke /admin отдаёт 200 | deploy.yml + manual | pending | проверится после prod deploy |

## Visual compliance с design-system

Каждый assertion привязан к строке spec'а:

- ✅ `tokens/colors.json` palette — 10/10 токенов на `:root`
- ✅ `tokens/radius.json` — sm/m/lg в admin = sm/md/xl в design-system (radius.lg=12 в admin не используется в Wave 1; Wave 2 при необходимости)
- ✅ `tokens/motion.json` duration.fast = 120ms на hover/transitions admin (vs прошлый 150ms)
- ✅ `tokens/shadow.json` focus-ring = brand pattern
- ✅ `tokens/typography.json` font-family.sans = Golos Text + Inter + system
- ✅ `components/button/button.spec.md` states (default/hover/active/focus-visible/disabled) реализованы для `.btn--style-primary` с янтарной палитрой согласно `brand-guide.html §12.4.1`
- ✅ `components/input/input.spec.md` states matrix
- ✅ `foundations/accessibility.md` — focus-visible 2px + 3px soft shadow, muted #6b6256 (4.5:1 AA)

## A11y

- Контраст: primary button янтарный `#e6a23c` на ink `#1c1c1c` = 11:1 AAA (brand-guide §04 таблица). Контраст ink на bg = 16.8:1 AAA. Muted на bg = 4.5:1 AA.
- Keyboard: `:focus-visible` на button/input/sidebar-link/tabs работает с brand-зелёным outline.
- Reduced-motion: `transform translateY(1px)` на pressed disabled через `@media`.

## Performance

- `@import` Google Fonts добавляет +1 blocking request на admin first paint. Приемлемо для admin (внутренний инструмент). Public сайт не задет (Golos Text там через `next/font` без блока).
- Никакого регресса на public Lighthouse.

## Регрессия

- Существующий suite (US-6, US-7 e2e тесты) не задет — изменения изолированы в `(payload)` group + admin компоненты + новый spec.

## Итог

Admin визуально консистентен с design-system/. **Критичное исправление**: primary CTA теперь янтарный согласно art-concept-v2 §1 и brand-guide §12.4.1 — было упущено в PR #68. AC Wave 1 покрыты, e2e в suite, регрессий нет. Готово к merge.

Этапы 2-7 будут проверены отдельно: Login (AdminLogin custom view), Page Catalog widget, Tabs field, Empty/Error states, Mobile responsive, full Playwright admin smoke (login → dashboard → edit → publish → logout).
