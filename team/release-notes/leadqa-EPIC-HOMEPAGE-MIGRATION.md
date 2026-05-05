---
rc: EPIC-HOMEPAGE-MIGRATION
team: product
verifier: leadqa
date: 2026-05-05
phase: verify
verdict: approve
---

# Lead QA Report — EPIC-HOMEPAGE-MIGRATION (Phase 1)

**Команда:** product (podev)
**RC artifact:** `team/release-notes/RC-EPIC-HOMEPAGE-MIGRATION.md`
**Окружение:** localhost:3000 · Next.js 16.2.4 (Turbopack) · pnpm · Postgres 16 (Docker) · Chromium 1440×900
**Вердикт:** **approve**

## 1. Setup

- ✅ `cd site && PAYLOAD_DISABLE_PUSH=1 pnpm dev` → Ready in 234ms
- ✅ HTTP 200 на `/`
- ✅ `pnpm type-check` → exit 0
- ✅ `pnpm lint` → 0 errors
- ✅ `pnpm format:check` → All matched files use Prettier code style

## 2. Соответствие AC

| AC | Статус | Подтверждение |
|---|---|---|
| Hero §01 1:1 mockup | ✅ | screenshot `screen/site-prod-hero.png`, H1 «Удаление деревьев в Москве и МО», hero-photo bg, form-card |
| 4 pillars §02 + how §03 | ✅ | `screen/site-prod-pillars.png`, ghost-цифры шагов |
| Pricing §04 + Calculator §04.5 | ✅ | tabs=4, sliders=3, checkboxes=3, formula реактивная (16 400₽ → 36 800₽ при tab→demo) |
| Photo→smeta §05 dark spotlight | ✅ | hero-фото внутри output-card |
| Cases §06 (6 фото с до/после) | ✅ | green tinted bg + B2C/B2B labels |
| Reviews §07 (4 sources + 6 отзывов) | ✅ | amber stars + green avatars |
| Documents §08 (8 документов) | ✅ | photo-превью, ✓ badges |
| Coverage §09 (12 районов) | ✅ | pilot-чипы с зелёным градиентом |
| Gallery §09.5 (8 фото + dots + prev/next) | ✅ | next/image, useRef scroll API, active dot sync |
| FAQ §10 (8 native `<details>`) | ✅ | accordion работает |
| CtaFooter §11 (2 формы) | ✅ | dark ink bg, форма постит /api/leads |
| Header mega-menu | ✅ | 31 SVG inline, pure CSS :hover |
| Footer (4 колонки + NAP) | ✅ | hardcoded Phase 1 |
| JsonLdGraph @graph×5 | ✅ | Organization + LocalBusiness + WebSite + FAQPage + Service |
| `<main>` + `<footer>` semantic | ✅ | landmark check pass |

## 3. NFR

| Проверка | Результат |
|---|---|
| LCP optimization | `<link rel="preload">` для hero-arborist-v1.jpg + next/image priority/fetchpriority |
| A11y | aria-live на calc result, aria-label на range, native checkbox, hit-areas ≥ 44px, Tab order логичный |
| SEO | title 40 chars, description 139 chars, canonical, OG (1200×630), Twitter card, theme-color, robots `max-image-preview:large` для нейро |
| Security | `/api/leads` honeypot (email_url), rate limit (5 req/min), CSP/HSTS headers (next.config) |
| Console errors | favicon.ico 404 (trivial, не от mockup) — без блокеров |

## 4. Скриншоты

- `screen/site-prod-hero.png` — Hero на 1440 (8.9KB JPG photo, gradient overlay, form-card)
- `screen/site-prod-pillars.png` — §02/§03 4 pillars + 5 шагов
- `screen/site-prod-calc.png` — initial Калькулятор state
- `screen/site-prod-calc-demo.png` — Демонтаж tab (формула пересчиталась 16 400 → 36 800 ₽)
- `screen/site-prod-final-fullpage.png` — full-page 13 секций
- `screen/leadqa-prod-calc-arbo.png` — финал leadqa проверка после fix className whitespace bug

## 5. Регрессии

**Поймал и зафиксил:**

1. **Prettier удаляет пробел в template literals при rebuild** — `'hp-calc-tab${active ? 'is-active' : ''}'` склеивается в `hp-calc-tabis-active` после `pnpm format`. **Fix:** заменил template literal на ternary в class-name (`activeTab === key ? 'hp-calc-tab is-active' : 'hp-calc-tab'`). Аналогичный fix в Gallery dots.
2. **`<a href="/...">` ESLint errors (220 шт)** — Next.js требует `<Link>` для internal nav. **Fix:** Python-скрипт автоконвертации с stack-based parser для balanced `</a>` tags + `import Link from 'next/link'`.

## 6. Cross-team integration

Не задевает: panel, shop, seo. Phase 1 чисто в `product/integration` scope. Phase 2 будет cross-team (popanel + sa-panel для Payload schema).

## 7. Recommendation

**approve.** RC соответствует AC + DoD + NFR. CI green, визуальный 1:1 mockup verified, интерактивность калькулятора + галереи + форм работает.

Готово к `do` merge → push → deploy.
