# Design System — Обиход

Рабочая дизайн-система `ui`-агента. Разворачивает brand-guide от `art`
(источник — [agents/brand/](../agents/brand/), бренд-гайд — [brand-guide.html](brand-guide.html))
в реальные компоненты, токены и паттерны, которые берёт в руки `fe1`/`fe2`.

## Структура

```
design-system/
├── brand-guide.html            # Визуальный гайд-агрегатор — живой вход для всех ролей (v1.2)
├── tokens/                     # 8 JSON (color, typography, typography-scale, spacing, radius, shadow, motion, breakpoints)
├── foundations/                # Cross-cutting правила
│   ├── icons.md
│   ├── accessibility.md
│   ├── microcopy.md
│   ├── photography.md
│   └── print-materials.md
├── icons/
│   └── services/               # Domain-иконки услуг (ServiceIcons.tsx + 16 SVG + _sheet.png)
├── components/                 # Spec'и компонентов
│   ├── logo/
│   ├── typography/
│   ├── button/
│   ├── input/
│   ├── file-uploader/
│   ├── form-schemas/           # Zod shared-схемы для всех форм
│   ├── navigation/             # mega-menu.spec.md
│   ├── header/                 # header + footer spec
│   ├── breadcrumbs/
│   ├── pagination/
│   ├── service-card/
│   ├── district-card/
│   ├── calculator/             # 4 калькулятора услуг
│   ├── feedback-states/
│   └── photo-quote-form/
└── patterns/                   # Композиции
    ├── programmatic-landing.md
    ├── og-image.md
    └── b2b-pitch-deck.md
```

## Правила

**Первоисточник для всего интерфейса — эта папка.** Любая работа, которая
визуально или структурно касается UI, начинается здесь:

- **`fe1` / `fe2` перед реализацией** — читают `design-system/components/<name>.spec.md`.
  Нет spec'а → не кодят, возвращают задачу `po` для `ui`. Придумывать визуал
  самостоятельно (цвета, размеры, состояния, a11y) запрещено.
- **`ui` перед макетом** — проверяет существующие токены и компоненты. Новый
  токен / компонент добавляется только если в системе нет подходящего — с записью
  обоснования в spec. Не разворачивает параллельную систему в Figma без
  зеркалирования в `design-system/`.
- **`ux` при wireframes и CJM** — строит пути из компонентов которые уже есть
  в системе. Если нужен новый — ставит задачу `ui` через `po`, не рисует сам.
- **`art` при ревью** — сверяет итерации `ui`/`ux` с brand-guide
  ([brand-guide.html](brand-guide.html)) и
  [agents/brand/](../agents/brand/). Расхождение → правка spec'а, не код.
- **Другие роли** (be, seo2, aemd, cw) — читают spec'и когда их задача касается
  UI (формы сбора данных, SEO-метаданные, копи макетов).

Если `design-system/` и код `site/components/` расходятся — правим **оба**
одним PR. Одностороннее обновление кода без spec'а — регрессия. spec без кода
— дырка в бэклоге.

- **Один источник истины на артефакт.** Spec живёт здесь, реализация — в `site/components/`.
- **Spec пишется ДО реализации.** Новый компонент начинается со spec-файла, не с TSX.
- **Токены сначала, variants потом.** Новое визуальное решение сначала ищет существующий токен, потом только добавляет новый (защищает консистентность).
- **Source design tokens:** фактическая база — [`site/app/globals.css`](../site/app/globals.css). JSON-токены в `tokens/` — зеркало этих CSS-переменных для передачи в Figma/Storybook.

## Владельцы

- **`art`** (Design Director) — согласует визуальный язык, ревьюит spec'и, утверждает финальные макеты.
- **`ui`** (UI Designer) — пишет spec'и, разворачивает brand-guide в систему, передаёт в `fe`.
- **`fe1`/`fe2`** — реализуют по spec'у, не придумывают визуал самостоятельно.

## Текущее состояние

### Tokens
| Файл | Покрытие |
|---|---|
| [tokens/colors.json](tokens/colors.json) | ✅ palette + logo contexts |
| [tokens/typography.json](tokens/typography.json) | ✅ base font-family + wordmark/tag params |
| [tokens/typography-scale.json](tokens/typography-scale.json) | ✅ display / h-xl..s / lead / body / eyebrow / label / caption / mono |
| [tokens/spacing.json](tokens/spacing.json) | ✅ 4/8px scale + semantic aliases |
| [tokens/radius.json](tokens/radius.json) | ✅ none / sm / md / lg / xl / full |
| [tokens/shadow.json](tokens/shadow.json) | ✅ sm / md / lg / focus-ring |
| [tokens/motion.json](tokens/motion.json) | ✅ durations / eases / presets + guardrails |
| [tokens/breakpoints.json](tokens/breakpoints.json) | ✅ mobile / tablet / desktop / wide |

### Foundations
| Файл | Покрытие |
|---|---|
| [foundations/icons.md](foundations/icons.md) | ✅ brand glyphs + lucide + services + custom rules |
| [foundations/accessibility.md](foundations/accessibility.md) | ✅ WCAG 2.2 AA минимум, контраст-матрица, клавиатура, screen reader |
| [foundations/microcopy.md](foundations/microcopy.md) | ✅ label / placeholder / helper / error / empty / success / toast |
| [foundations/photography.md](foundations/photography.md) | ✅ правила съёмки кейсов / свет / кадрирование / forbidden-список |
| [foundations/print-materials.md](foundations/print-materials.md) | ✅ CMYK / Pantone / визитки / наклейки / бланки / экспорт PDF/X |

### Patterns
| Файл | Покрытие |
|---|---|
| [patterns/programmatic-landing.md](patterns/programmatic-landing.md) | ✅ v1.0 — шаблон LP `service × district` + JSON-LD + canonical/noindex + CWV targets |
| [patterns/og-image.md](patterns/og-image.md) | ✅ v1.0 — `/api/og` edge endpoint + 5 variants + fonts handling |
| [patterns/b2b-pitch-deck.md](patterns/b2b-pitch-deck.md) | ⚠️ v0.9 skeleton — структура 12 слайдов + дизайн-правила, первый PDF после данных оператора |

### Icons · services
| Файл | Покрытие |
|---|---|
| [icons/services/README.md](icons/services/README.md) | ✅ реестр 16 иконок + правила + критерии приёмки |
| [icons/services/ServiceIcons.tsx](icons/services/ServiceIcons.tsx) | ✅ 22 React-компонента + SERVICE_ICONS каталог (spil, valka, stump, prune, kabling, spray, chipper, roof-snow, gutter, climber, boomlift, dumpster, demolition, fixed-price, fast-response, legal-shield, snow-truck, lawn-mower, excavator, brush, winter-decor, facade-clean) |
| [icons/services/_sheet.png](icons/services/_sheet.png) | ✅ визуальный реестр всех 22 иконок |

### Components
| Компонент | Spec | Реализация | Статус |
|---|---|---|---|
| Logo | [components/logo/logo.spec.md](components/logo/logo.spec.md) | [site/components/marketing/_shared/LogoMark.tsx](../site/components/marketing/_shared/LogoMark.tsx), [site/components/admin/BrandLogo.tsx](../site/components/admin/BrandLogo.tsx), [site/components/admin/BrandIcon.tsx](../site/components/admin/BrandIcon.tsx) | ✅ v1.0 |
| Typography | [components/typography/typography.spec.md](components/typography/typography.spec.md) | [globals.css `.h-*` / `.lead` / `.eyebrow` / `.mono` / `.tnum`](../site/app/globals.css) | ✅ v1.0 |
| Button | [components/button/button.spec.md](components/button/button.spec.md) | [globals.css `.btn` + variants](../site/app/globals.css) | ✅ v1.0 (CSS-классы), React wrap TODO P1 |
| Input / FormField | [components/input/input.spec.md](components/input/input.spec.md) | inline в [LeadForm.tsx](../site/components/marketing/sections/LeadForm.tsx) | ⚠️ v1.0 spec, React wrap TODO P1 |
| ServiceCard | [components/service-card/service-card.spec.md](components/service-card/service-card.spec.md) | [Services.tsx](../site/components/marketing/sections/Services.tsx) | ⚠️ v0.9 draft |
| Feedback states | [components/feedback-states/feedback-states.spec.md](components/feedback-states/feedback-states.spec.md) | — | ⚠️ v0.9 draft, no impl yet |
| PhotoQuoteForm | [components/photo-quote-form/photo-quote-form.spec.md](components/photo-quote-form/photo-quote-form.spec.md) | — | 📋 v0.9 spec, awaits fe impl (US TBD) |
| FileUploader | [components/file-uploader/file-uploader.spec.md](components/file-uploader/file-uploader.spec.md) | — | ⚠️ v0.9 draft, dependency PhotoQuoteForm |
| DistrictCard | [components/district-card/district-card.spec.md](components/district-card/district-card.spec.md) | — | ⚠️ v0.9 draft, для programmatic SEO LP |
| Calculator | [components/calculator/calculator.spec.md](components/calculator/calculator.spec.md) | [Calculator.tsx](../site/components/marketing/sections/Calculator.tsx) | ⚠️ v0.9 draft — единая anatomy для 4 калькуляторов + формулы + A/B-план, реализация рефакторинга TODO |
| MegaMenu (Услуги ▾ / Районы ▾) | [components/navigation/mega-menu.spec.md](components/navigation/mega-menu.spec.md) | — | ⚠️ v0.9 draft spec, реализация TODO |
| Header / Footer | [components/header/header.spec.md](components/header/header.spec.md) | [Header.tsx](../site/components/marketing/Header.tsx), [Footer.tsx](../site/components/marketing/Footer.tsx) | ✅ v1.0 spec, реализация refresh TODO |
| Breadcrumbs | [components/breadcrumbs/breadcrumbs.spec.md](components/breadcrumbs/breadcrumbs.spec.md) | — | ✅ v1.0 spec + JSON-LD BreadcrumbList, реализация TODO |
| Pagination | [components/pagination/pagination.spec.md](components/pagination/pagination.spec.md) | — | ✅ v1.0 spec + SEO rel=next/prev, реализация TODO |
| Form schemas (Zod shared) | [components/form-schemas/form-schemas.spec.md](components/form-schemas/form-schemas.spec.md) | — | ✅ v1.0 spec, `site/lib/forms/` TODO P0 |
| Modal / Drawer | — | — | TODO P2 (когда появится потребность) |
| Table | — | — | TODO P2 (B2B-дашборд УК/ТСЖ) |
