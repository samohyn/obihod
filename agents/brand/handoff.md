# Brand Handoff for `fe1/fe2` — US-6 wave 2A

**Автор:** art
**Дата:** 2026-04-27
**Контракт:** для всех новых страниц wave 2A (`/b2b/`, `/blog/`, `/avtory/`)

## Источник истины токенов
`site/app/globals.css` (Tailwind v4 inline theme). Переопределять — нельзя.

## Палитра «Природный тёплый» — что использовать

| Назначение | Tailwind utility | Hex |
|---|---|---|
| Primary surface (CTA, accent buttons) | `bg-primary` | `#2d5a3d` (зелёный) |
| Primary on dark | `text-on-primary` | `#f7f5f0` (кремовый) |
| Accent (выделить цифру, цену) | `text-accent` `bg-accent` | `#e6a23c` (янтарь) |
| Текст основной | `text-ink` | `#1c1c1c` |
| Текст вторичный | `text-muted` | `#8c8377` |
| Border / разделитель | `border-line` | `#e6e1d6` |
| Body background | `bg-bg` | `#f7f5f0` |
| Card surface | `bg-card` | `#ffffff` |
| Bg alt (секции с подложкой) | `bg-bg-alt` | `#efebe0` |
| Success (ok-state) | `text-success` | `#4a7c59` |
| Error / warning | `text-error` | `#b54828` |

## Типографика

- `font-display` / `font-sans` — Golos Text (kyrillic-first), fallback Inter, system-ui
- `font-mono` — JetBrains Mono (для цен, цифр, ИНН)
- Body — 17px / 1.55 leading, `font-feature-settings: 'tnum' 0, 'ss01' 1`

## Радиусы / пэддинги

- `rounded-[var(--radius-sm)]` 6px / `rounded-[var(--radius)]` 10px / `rounded-[var(--radius-lg)]` 16px
- Контейнер: `mx-auto max-w-[var(--maxw)] px-[var(--pad)]` (1280px max, 20-40-80px горизонтально по брейкпоинтам)

## Что нельзя (анти-паттерны)

1. **Не вводить новые цвета из Tailwind палитры** (`text-orange-700`, `bg-stone-50` итд) — у нас своя семантическая палитра. Если нет подходящего токена — спрашивать `art`, а не лепить.
2. **Не использовать stock photo и AI-сгенерированный визуал** на B2B-страницах — только реальные объекты Обихода или скетч-плейсхолдер с пометкой «иллюстрация».
3. **Никаких градиентов** кроме одного утверждённого: `bg-gradient-to-b from-bg to-bg-alt` (мягкий вертикальный для hero).
4. **Без shadow-2xl и неоморфизма** — в проекте используется `shadow-sm` максимум, на ключевых карточках.

## Базовые паттерны для wave 2A

### Card компонент (универсальный)
```tsx
<article className="rounded-[var(--radius)] border border-line bg-card p-6 transition hover:border-primary/40">
  ...
</article>
```

### Hero pattern
```tsx
<section className="bg-bg-alt py-12 sm:py-16">
  <div className="mx-auto max-w-[var(--maxw)] px-[var(--pad)]">
    <Breadcrumbs items={...} />
    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
    <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>
  </div>
</section>
```

### CTA-блок (повторно использовать существующий `<CtaMessengers />`)

`components/marketing/CtaMessengers.tsx` уже использует токены — не дублировать.

### Breadcrumbs

Только через `<Breadcrumbs />` из `components/seo/Breadcrumbs.tsx` (с JSON-LD автоматически).

## Брейкпоинты (обязательны)

- mobile (default) → ~360px
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

Все 3 списочные и 3 detail страницы wave 2A должны корректно работать на 360, 768, 1280.

## A11y минимум

- Контраст текст/фон ≥ 4.5:1 (нашa палитра проходит для `text-ink` на `bg-bg`)
- `focus-visible` с `outline-2 outline-offset-2 outline-accent`
- Один `<h1>` на странице, иерархия `<h2>`/`<h3>`
- Все интерактивные элементы — `min-h-11` (touch ≥ 44px)
- `aria-live="polite"` для динамических областей (если будут)

## Approval

`art` дал approval на использование текущих токенов wave 2A. Любое расширение палитры или шрифтов — через PR с явным `art-approval` лейблом.
