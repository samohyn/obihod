# Header + Footer · spec

**Статус:** v1.0 · approved 2026-04-24
**Hosts:** [MegaMenu](../navigation/mega-menu.spec.md), Logo, Skip-link, CTA. Footer — контакты, каталог, документы, социалки.
**Реализация:** [site/components/marketing/Header.tsx](../../../site/components/marketing/Header.tsx) + [Footer.tsx](../../../site/components/marketing/Footer.tsx) — требуют refresh под новый spec.

## Header

### Anatomy

```
┌──────────────────────────────────────────────────────────────────────┐
│ [skip-link visually-hidden until focus]                              │
├──────────────────────────────────────────────────────────────────────┤
│ [Logo] ОБИХОД      [Услуги ▾] [Районы ▾] [Кейсы] [Блог] [Контакты]  │
│                                                 [+7 985 170 51 11]   │
│                                                 [Получить смету]     │
└──────────────────────────────────────────────────────────────────────┘
```

### Sticky behaviour

- **Desktop:** `position: sticky; top: 0` — всегда виден при скролле. `backdrop-filter: blur(8px)` + `background: rgba(247, 245, 240, 0.92)` (полу-прозрачный кремовый).
- **Mobile:** sticky включается только при скролле вверх (iOS-style — покажется если юзер "потянулся" к хедеру). На скролле вниз — прячется, экономит viewport.
- **Reduced motion:** backdrop-blur отключаем, фон сплошной.

### Variants

| Variant | Когда |
|---|---|
| `default` | Marketing LP, индексы услуг/районов |
| `article` | Статья блога / кейса — compact (без telephone в header, телефон в CTA) |
| `admin` | `/admin` — не наш header, Payload рендерит свой |

### States

- **Default:** прозрачный фон над hero (first 100vh on marketing home)
- **Scrolled:** после 80px скролла — plain background + border-bottom 1px `var(--c-line)`
- **Mobile menu open:** hamburger → close icon, backdrop затемняет контент

### Token usage

```css
header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(247, 245, 240, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;
}
header.scrolled {
  border-bottom-color: var(--c-line);
}
header .wrap {
  max-width: var(--maxw); /* 1280 */
  padding: 16px var(--pad);
  display: flex;
  align-items: center;
  gap: 32px;
}
```

### Skip-link

```html
<a href="#main" class="skip-link">Пропустить навигацию</a>
```

CSS: `position: absolute; left: -9999px`. При `:focus` — `left: 16px; top: 16px; z-index: 100`, background ink, color on-primary, padding 12px 20px.

Обязательно для WCAG 2.4.1.

### Phone display

Телефон из Payload `SiteChrome.contacts.phoneE164` — см. [learnings.md](../../../.claude/memory/learnings.md) правило "захардкоженный номер выжил". Формат: `+7 985 170 51 11` как текст, `tel:+79851705111` как href.

### Mobile navigation

- **≤ 1023 px:** hamburger-button (`var(--c-ink)`) справа, слева — logo.
- Click → full-viewport drawer (slide from right или top, выбираем top-to-bottom — native iOS-like).
- Внутри drawer: 3 кластера услуг (accordion), районы (accordion), прямые ссылки.
- Background drawer: `var(--c-bg)` кремовый.
- Close на `Esc`, click backdrop, hamburger повторно.
- Focus-trap при open.

### A11y

- `<header role="banner">`.
- Skip-link первый элемент (см. выше).
- Mobile menu button: `<button aria-expanded aria-controls="mobile-nav" aria-label="Открыть меню">`.
- Focus-trap в mobile drawer.
- Logo: `<a href="/" aria-label="Обиход — главная">`.
- Touch-target ≥ 44px на всех интерактивах.

### Copy

- **CTA:** «Получить смету» или «Фото → смета за 10 минут». Не «Оставить заявку» (длинно), не «Связаться» (пассивно).
- **Telephone:** отображать с форматтированием `+7 985 170 51 11` (ReadableByFlashcards).
- **Hamburger aria-label:** «Меню услуг и разделов».

### Responsive

| Breakpoint | Layout |
|---|---|
| ≤ 767 | Logo + hamburger + phone-icon (tel: link). Nav в drawer. |
| 768-1023 | Logo + условная nav + phone + CTA |
| 1024-1279 | Logo + full nav + phone + CTA |
| ≥ 1280 | Полный + SearchTrigger (P2) |

---

## Footer

### Anatomy

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo wordmark]  Обиход                                      │
│  Комплексный подрядчик 4-в-1 для МО                          │
│                                                              │
│  УСЛУГИ              РАЙОНЫ           КОМПАНИЯ      КОНТАКТЫ │
│  Арбористика         Раменское        О нас         +7 985…  │
│  Крыши               Одинцово         Кейсы         TG / MAX │
│  Мусор               Красногорск      Блог          Адрес    │
│  Демонтаж            Мытищи           Вакансии              │
│  Все услуги →        Все районы →     Гарантии              │
├──────────────────────────────────────────────────────────────┤
│  © 2026 ИП Самохин Г.Н. · ИНН 7847729123 · СРО XXX           │
│  [Политика конфиденциальности] [Договор-оферта]              │
│  [Яндекс.Метрика · Я.Бизнес]                                 │
└──────────────────────────────────────────────────────────────┘
```

### Structure

4 колонки (desktop) / 2 колонки (tablet) / accordion-style (mobile) + нижняя плашка с legal.

### Variants

| Variant | Когда |
|---|---|
| `default` | Все страницы кроме admin |
| `minimal` | На PhotoQuoteForm success-странице — только легал + контакт |

### Token usage

```css
footer {
  background: var(--c-bg-alt);  /* чуть темнее main bg */
  border-top: 1px solid var(--c-line);
  padding: 64px var(--pad) 32px;
  color: var(--c-ink-soft);
}
footer h3 {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin: 0 0 16px;
}
footer a {
  color: var(--c-ink);
  text-decoration: none;
}
footer a:hover {
  color: var(--c-primary);
}
footer .bottom {
  border-top: 1px solid var(--c-line);
  margin-top: 48px;
  padding-top: 24px;
  font-size: 13px;
  color: var(--c-muted);
}
```

### A11y

- `<footer role="contentinfo">`.
- Sitemap-разметка logical grouping (`<section><h3>Услуги</h3>...`).
- Все ссылки keyboard-navigable.
- Адреса мессенджеров — `<a href="https://t.me/obikhod_bot">` + `aria-label="Telegram Обихода"`.

### Copy

- Заголовки колонок: «Услуги», «Районы», «Компания», «Контакты». Не «Наши услуги», не «Где работаем».
- «Все услуги →» / «Все районы →» — линк на индекс.
- Legal: строго юридический — «© 2026 ИП Самохин Г.Н.», ИНН, СРО / лицензия Росприроднадзора.

### Responsive

- **Mobile:** колонки в accordion (click раскрывает список).
- **Tablet:** 2 колонки.
- **Desktop:** 4 колонки.

## Integration

### Next.js 16

Server Component оба. Данные:
- Сервисы + районы из Payload LocalAPI (кэш 1 час)
- Contacts / legal — из Payload `SiteChrome` global (источник правды по learnings 2026-04-23)

Гидрация только для mobile-menu toggle и scrolled-state — client component обёртка.

### SEO-значимость

- Footer — **не добавляет** в SEO большого значения (Google deprioritizes).
- Важно: sitemap-ссылки в footer **ДОЛЖНЫ** вести на всё что есть на сайте — помогает краулингу.
- **Не дублируем sitemap.xml в footer** — избыточно.

## Anti-patterns

- ❌ Прозрачный header всегда — пользователь не видит границы
- ❌ Автоматический hide на скролле на desktop — раздражает
- ❌ Hamburger на desktop (>= 1024px) — неочевидно
- ❌ «Back to top» кнопка в footer — избыточно на ноутбуках с trackpad
- ❌ Newsletter-форма в footer **без UТП** — «подпишитесь на наши новости» — анти-TOV
- ❌ Социалки первым блоком футера — у Обихода приоритет контакты и услуги

## DoD

- [x] Header: sticky, mobile drawer, skip-link, phone из SiteChrome, CTA
- [x] Footer: 4 колонки + legal, адаптация mobile/tablet/desktop
- [x] A11y обоих
- [x] Интеграция с Payload SiteChrome + Services + Districts
- [ ] Реализация refresh [Header.tsx](../../../site/components/marketing/Header.tsx) — **TODO US** (связка с MegaMenu реализацией)
- [ ] [Footer.tsx](../../../site/components/marketing/Footer.tsx) refresh — TODO
- [ ] axe-тест hits WCAG 2.2 AA — в CI
