# leadqa — PR #164 `feature/homepage-classic-launch`

**Дата:** 2026-05-04  
**Ветка:** `feature/homepage-classic-launch`  
**Проверял:** leadqa  
**Dev server:** http://localhost:3000 (запущен, ветка feature/homepage-classic-launch)

---

## Статус: **BLOCK**

**Причины блокировки (2 критических):**

1. **format:check FAIL** — 10 файлов PR нарушают Prettier, CI не пройдёт (Iron Rule #5)
2. **Форма — демо-макет** — HeroForm не подключена к бекенду (`alert('Демо-макет: форма не подключена')`), lead capture не работает

**Дополнительно (требуют решения до merge или трекинга):**

3. **landing.spec.ts 6/8 тестов FAIL** — тесты не обновлены под новый дизайн (H1, section IDs, форма, калькулятор, FAQ-классы устарели)

---

## Acceptance Criteria

### 1. HTTP статусы

| URL | Ожидание | Факт | Статус |
|-----|----------|------|--------|
| `/` | 200 | 200 | ✅ |
| `/arboristika` | 200 | 308→200 | ✅ trailing-slash redirect, норма |
| `/vyvoz-musora` | 200 | 308→200 | ✅ trailing-slash redirect, норма |
| `/demontazh` | 200 | 308→200 | ✅ trailing-slash redirect, норма |
| `/raiony` | 200 | 308→200 | ✅ trailing-slash redirect, норма |

> 308 — это Next.js trailing-slash нормализация, конечный ответ 200. Не регрессия.

### 2. Browser smoke — Desktop 1280px

| Проверка | Статус | Детали |
|----------|--------|--------|
| H1 виден | ✅ | "Удаление деревьев и хозяйственные работы в Москве и Подмосковье" |
| Форма справа (desktop grid 2 cols) | ✅ | `.hpc-hero-grid` имеет 2 дочерних элемента |
| Pricing: 7 строк с ценами | ✅ | 7 × `.hpc-price-row` найдено |
| Coverage: 12 районов | ✅ | 19 элементов `.name` (12 основных + вспомогательные) |
| FAQ: открывается по клику | ✅ | aria-expanded: false → true |
| Footer: тёмный | ✅ | background: rgb(28, 28, 28) |
| Footer: 4 колонки | ⚠️ | 2 колонки (Услуги + Компания) — DEFAULT_SITE_CHROME. Payload site-chrome не заполнен. Pre-existing, PR не менял Footer.tsx |
| Нет JS ошибок в консоли | ✅ | 0 console errors |

### 3. Browser smoke — Mobile 375px

| Проверка | Статус | Детали |
|----------|--------|--------|
| H1 виден | ✅ | Идентично desktop |
| Форма ниже H1 (mobile stack) | ✅ | formY (936px) > h1Y (142px) |
| Pillars видны при скролле | ✅ | скриншот сохранён |
| FAQ секция видна | ✅ | скриншот сохранён |
| Нет JS ошибок в консоли | ✅ | 0 console errors |

### 4. CI проверки

| Проверка | Статус | Детали |
|----------|--------|--------|
| `pnpm type-check` | ✅ PASS | tsc --noEmit без ошибок |
| `pnpm lint` | ✅ PASS | 0 errors, 97 warnings (все pre-existing) |
| `pnpm format:check` | ❌ **FAIL** | 10 файлов PR нарушают Prettier |

**Файлы с Prettier нарушениями (все из PR #164):**
```
app/homepage-classic.css
components/marketing/sections/Cases.tsx
components/marketing/sections/Coverage.tsx
components/marketing/sections/Guarantees.tsx
components/marketing/sections/Hero.tsx
components/marketing/sections/How.tsx
components/marketing/sections/PhotoSmeta.tsx
components/marketing/sections/PricingTable.tsx
components/marketing/sections/Reviews.tsx
components/marketing/sections/Services.tsx
```

Фикс: `cd site && pnpm format -- components/marketing/sections/ app/homepage-classic.css`

### 5. Ключевые роуты других страниц не сломаны

| URL | Статус | H1 |
|-----|--------|-----|
| `/arboristika/` | ✅ 200 | "Арбористика и уход за деревьями в Москве и МО — спил, обрезка, удаление пней" |
| `/vyvoz-musora/` | ✅ 200 | OK |
| `/demontazh/` | ✅ 200 | OK |
| `/chistka-krysh/` | ✅ 200 | OK (slug не изменился в Payload) |
| `/uborka-snega-i-chistka-krysh/` | ⚠️ 404 | Pre-existing: slug в Payload остался `chistka-krysh` |
| `/raiony/zhukovsky/` | ✅ 200 | Published district |
| `/raiony/ramenskoye/` | ⚠️ 404 | Pre-existing: district в статусе `draft` |

> `uborka-snega-i-chistka-krysh` 404 — pre-existing. PR переименовал только SEO-кластер-документ в `seosite/03-clusters/`, Payload slug не менялся.

### 6. Дополнительные находки

#### БЛОКЕР — Форма-демо без бекенда

`HeroForm.tsx` содержит:
```tsx
onSubmit={(e) => {
  e.preventDefault()
  alert('Демо-макет: форма не подключена')
}}
```

Форма не отправляет данные в Payload Leads. Lead capture — ключевая цель главной страницы. **Это прямое нарушение бизнес-цели PR** (приносить лиды).

#### НЕ-БЛОКЕР — landing.spec.ts 6/8 FAIL

Существующие E2E тесты написаны под старый дизайн главной:
- Ожидают H1 "Участок в порядке" → новый H1 другой ✗
- Ожидают `#services`, `#calc`, `#how` и т.д. → новые секции без id= ✗
- Ожидают `form[aria-label="Заявка на замер"]` → нет такого aria-label ✗
- Ожидают `.faq-item.is-open` → новый FAQ использует `.item[data-open]` ✗
- Калькулятор (`#calc`) отсутствует в новом дизайне ✗

Тесты должны быть обновлены или заменены новым спеком под Direction 2.

---

## Скриншоты

| Файл | Описание |
|------|----------|
| `screen/leadqa-desktop-hero.png` | Desktop 1280px — Hero секция |
| `screen/leadqa-desktop-pricing.png` | Desktop 1280px — Pricing table |
| `screen/leadqa-desktop-coverage.png` | Desktop 1280px — Coverage 12 районов |
| `screen/leadqa-desktop-footer.png` | Desktop 1280px — Footer |
| `screen/leadqa-mobile-hero.png` | Mobile 375px — Hero |
| `screen/leadqa-mobile-pillars.png` | Mobile 375px — Pillars (scroll 400px) |
| `screen/leadqa-mobile-faq.png` | Mobile 375px — FAQ секция |

---

## Резюме блокеров для `dev` → фикс

| # | Блокер | Кто фиксит | Быстрый фикс |
|---|--------|------------|--------------|
| B1 | `format:check` FAIL — 10 файлов | `fe-site` / `do` | `pnpm format -- components/marketing/sections/ app/homepage-classic.css` |
| B2 | HeroForm — демо без бекенда | `fe-site` + `be-site` | Подключить к `/api/leads/` (Payload Leads collection), как в US-8 |
| B3 | landing.spec.ts 6/8 FAIL | `qa-site` | Переписать тесты под Direction 2 UI (новые H1, data-open, без #calc) |

**После устранения B1 + B2 + B3 → повторный leadqa smoke → operator approve → do deploy.**
