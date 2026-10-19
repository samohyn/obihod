---
artifact: art-brief-ui
epic: EPIC-SERVICE-PAGES-REDESIGN
deliverable: D1
template: T2_PILLAR
authors: design + fe
created: 2026-05-09
related:
  - specs/EPIC-SERVICE-PAGES-REDESIGN/T2-pillar/art-brief.md (general direction)
  - design-system/brand-guide.html (v2.6 — токены и компоненты)
  - design-system/tokens/ (sync target в D2)
---

# T2 Pillar — UI brief

## Mockup count

**3 desktop + 3 mobile = 6 mockup'ов** (sustained intake AC-1 D1).

| # | Viewport | Что показывает | Цель |
|---|----------|-----------------|------|
| M1 | 1440px desktop | Hero + breadcrumbs + tldr + services-grid above fold | Pixel-perfect entry, photo-upload USP visible |
| M2 | 1440px desktop | Pricing + calculator + process (mid-scroll) | Конверсионный mid-funnel — photo→смета центр scroll'а |
| M3 | 1440px desktop | Mini-case + faq + cta-banner + related + lead-form (final scroll) | Закрытие в lead-form |
| M4 | 375px mobile | Hero compact + breadcrumbs + tldr + services-grid (vertical 1-col) + sticky bottom-CTA bar visible | Mobile entry without horizontal scroll, sticky CTA active |
| M5 | 375px mobile | Pricing accordion-cards + calculator full-width photo-upload + process vertical | Mobile-first pricing/calculator UX |
| M6 | 375px mobile | FAQ accordion + cta-banner + lead-form 1-col | Final mobile flow, 152-ФЗ checkbox visible without scroll |

Mockup'ы рисуем в Figma (или brand-guide live-preview). Финальная вёрстка — D3 wave fe.

## Token sync (sustained brand-guide v2.6)

Используем существующие токены — **новых не нужно** (C2.5 wave merged 11 extensions).

| Категория | Tokens (sustained) | Где используется |
|-----------|-------------------|-------------------|
| Color | `--c-bg`, `--c-bg-alt`, `--c-fg`, `--c-fg-muted`, `--c-accent`, `--c-line`, `--c-error`, `--c-success` | везде |
| Typography | `--t-display`, `--t-h-xl`, `--t-h-l`, `--t-h-m`, `--t-h-s`, `--t-body`, `--t-body-l`, `--t-caption` (sustained `#type:1162`) | hero / sections / body |
| Spacing | `--space-section` (80-120px desktop, 48-64px mobile), `--space-block` (32-48px), `--space-element` (16-24px), `--space-tight` (8-12px) | vertical rhythm |
| Radius | `--radius-sm` (8px pill / chip), `--radius-md` (12px input / button), `--radius-lg` (16px card / photo) | cards, photos, buttons |
| Shadow | `--shadow-1` (cards), `--shadow-2` (sticky), `--shadow-3` (modal/dropdown) | elevation |
| Motion | `--ease-out`, `--ease-in`, `--duration-150`, `--duration-300` | transitions |
| Breakpoint | `--bp-mobile` (375), `--bp-mobile-lg` (414), `--bp-tablet` (768), `--bp-desktop` (1024) | media queries |

## New tokens

**Не нужны.** C2.5 wave (sustained ADR-0021) добавил 11 extensions в brand-guide v2.6 (4 critical / 4 high / 3 medium). Все T2-секции покрыты.

## Component spec list

### Hero (T2 variant) — `#service-hero` (line 4571)

- **Layout grid:** desktop 12-col (col 1-7 для текста + USP, col 8-12 для photo-upload card). Mobile single-col stack: H1 → lead → photo-upload card → CTA secondary
- **Breakpoints:**
  - 1024+ : 7+5 grid, photo card sticky-right
  - 768-1023: 7+5 grid сжатый
  - 375-767: stack vertical, photo-upload card full-width
- **Focus state:** primary CTA — 2px accent ring outset, photo-upload area — 2px accent ring inset на drag-over
- **Hover state:** primary CTA — `--c-accent-hover` (sustained), photo-upload area — subtle shadow lift
- **Pressed state:** scale 0.97 (sustained ui-ux-pro-max `scale-feedback`)

### Services-grid (T2 only) — `#components:1299` Карточка услуги

- **Layout:** 3 col desktop / 2 col tablet / 1 col mobile, gap 16px
- **Card:** icon (line-art 1.5px из `#icons:1314`) + h-s title + 1-2 line desc + price «от X руб.» + chevron-arrow на right
- **Hover:** subtle shadow lift + chevron translateX 4px (sustained `--duration-150`)
- **Focus-visible:** 2px accent ring (a11y)

### Pricing-block — `#pricing-table` (line 5129)

- **Layout desktop:** 3 col grid (Базовый / Стандарт / Под ключ), middle col `--c-bg-alt` highlighted + «Рекомендуем» badge live-style (`#components:1282`)
- **Numbers:** `font-variant-numeric: tabular-nums` (sustained `#type:1162` mono.tnum)
- **Mobile (≤640px):** collapse в accordion-cards. Каждая card = диаметр / параметр в `<summary>`, цена + features list в `<details>`
- **CTA per tier:** primary CTA «Выбрать тариф» ≥44pt touch-target, скролл к calculator

### Calculator — `#calculator-shell` (line 4757)

- **Layout desktop:** 8-col centered, max-width 720px
- **Drag-drop area:**
  - Idle: dashed border `--c-line` 2px, eyebrow «Перетащите фото или нажмите для выбора»
  - Drag-over: dashed border `--c-accent` 2px + scale 1.02 + `--c-bg-alt`
  - Uploading: skeleton shimmer (sustained `#notifications` shimmer), reduced-motion disabled
  - Processing: spinner ≥300ms (sustained `#notifications:2387`), progress text
  - Result: success-card pattern (sustained), смета + CTA «Перейти к заявке»
- **Photo-thumbnail row:** 60×60px, remove icon top-right, `aria-label="Удалить фото"`
- **Mobile:** full-width, single-tap action (camera / gallery alternative через `<input capture>`)

### Process — `#process-steps` (line 5278)

- **Desktop:** horizontal numbered 4-7 шагов в одну строку, gap 24px. Каждый шаг = number badge 48px + h-s title + 1-2 line body
- **Mobile:** vertical, номер 32px слева, content справа. gap 16px между шагами
- **Connector line:** subtle `--c-line` между шагами (horizontal desktop / vertical mobile)
- **Reduced-motion:** scroll-reveal animation 300ms ease-out, disabled при `prefers-reduced-motion`

### Mini-case — `#mini-case` (line 5815)

- **Layout T2 horizontal:** desktop 12-col grid (col 1-6 = before/after photo split, col 7-12 = icon + h-l + 1 metric + link)
- **Photo:** before/after slider (или 2 photo + caption), aspect-ratio 4:3
- **Metric:** числовой trust-сигнал, h-display + caption «срезали за 2 часа» / «вывезли 12 м³»
- **Link:** «Полный кейс →» secondary CTA
- **Mobile:** vertical stack, photo full-width, content ниже

### FAQ — `#faq-accordion` (line 5952)

- **Pattern:** sustained `<details>/<summary>` (`#nav:2019` mobile-mega-menu reuse)
- **Touch-target:** summary ≥44pt
- **Chevron:** rotate 180° on open, transition `--duration-150`
- **Keyboard:** Enter/Space toggle, Esc close, sustained `<details>` semantics
- **JSON-LD:** FAQPage уже инжектится через composer.ts (sustained US-3)

### Lead-form — `#lead-form-full` (line 4922)

- **Layout desktop:** centered max-width 560px
- **Inputs (sustained):**
  - phone: `autocomplete="tel"` `type="tel"` `inputmode="tel"` height 48px
  - name: `autocomplete="name"` height 48px
  - photo upload: multi, `accept="image/*"`, drag-drop area
  - 152-ФЗ checkbox (required, ≥44pt touch-target)
  - textarea коммент: optional, 240 chars maxlength
- **5-state flow (sustained `#notifications:2387`):** Idle → Filled → Submitting → Success → Error
- **Error inline:** red border + helper text «что не так + что сделать» (TOV-guard `#dont`)
- **Mobile:** 1-column, label above field, input height ≥44pt, error focus auto-jump

## fal.ai allowance

**Допустимо в D1** (sustained intake §fal.ai hybrid policy):
- **Nano Banana 2** для черновых layout-вариантов hero/case/services-grid (3-5 итераций per pillar)
- НЕ финальные mockups — финальные рисует design в brand-guide live-preview / Figma в D2

**Запрещено в D1:**
- Финальные hero/case/district photos (это D2 token sync wave)
- Stock photo сервисы (Shutterstock / Unsplash) — sustained brand-guide §photography only

## Анти-паттерны (sustained brand-guide §dont)

- Эко-зелёный листочек / иконки экологии (Caregiver+Ruler, не Hippie)
- Рукопожатия / щиты / медали в trust-block (документ-иконы only)
- 4 hero-CTA (sustained ui-ux-pro-max `primary-action`: 1 primary + 1 secondary max)
- Двойные телефоны в hero (liwood baseline — C1.b §1.2)
- 17-блочный dump (compact 12 секций для T2)
- Generic stock photo, постановочная улыбка в камеру

## Hand-off

D1 → D2 (token sync, fal.ai photo generation). D3 owner: fe (вёрстка по этому UI brief).
