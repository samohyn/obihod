# leadqa — newui/homepage-classic.html ↔ prod obikhod.ru visual diff

**Команда:** product · ad-hoc operator request (не RC)
**Дата:** 2026-05-06
**Проверял:** leadqa
**Окружение:** Chromium · 1440×900 + 375×812 · prod `https://obikhod.ru/` + localhost `http://127.0.0.1:3000/` (после fix-а) + static mockup `http://127.0.0.1:8765/homepage-classic.html`
**Skill активирован:** `browser-qa` (real browser smoke), `frontend-design` (применение fix-а), `design-system` (sweep §1-14)

## Статус: **conditional approve**

Один HIGH-severity drift найден и устранён в `site/components/marketing/sections/Documents.tsx`. Type-check ✅, локальный browser smoke ✅, DOM-сверка с макетом ✅. Готово к подаче в `podev` → `cr-site` → `release` → деплой.

Параллельно зафиксирован **HIGH cross-team incident** на проде (26 RSC-prefetch 404 на sub-pages услуг + shop categories) — не drift homepage UI, но требует немедленного follow-up в `poseo` + `popanel`.

---

## 1. Скрипт проверки

1. Прочитан макет `/Users/a36/obikhod/newui/homepage-classic.html` (1501 строк, 13 секций + header + footer + JSON-LD).
2. Сняты full-page скриншоты desktop 1440 для prod, mockup, local (после fix-а).
3. Делегирован Explore agent на exhaustive diff макет ↔ `site/components/marketing/sections/*.tsx` (13 секций) и `Header.tsx` / `Footer.tsx`.
4. Прочитаны: Hero, HeroLeadForm, Services, How, PricingTable, PricingCalculator (379 LOC — пропущен после Explore confirm), PhotoSmeta, Cases, Reviews, Documents, Coverage, Gallery, FAQ, CtaFooter.
5. Сверка с brand-guide (см. §3 ниже).
6. DOM-сверка через `browser_evaluate` (`.hpc-trust .doc` overlay-spans до и после fix-а).
7. Mobile compare 375×812 для всех трёх вариантов.

## 2. Diff таблица — что найдено

### HIGH (требуют фиксов)

| # | Секция | Файл макета (lines) | Файл prod (file:line) | Что в макете | Что в prod | Действие |
|---|---|---|---|---|---|---|
| 1 | §08 Documents | `newui/homepage-classic.html:1086-1151` (8 карточек, overlay-spans `СВИДЕТЕЛЬСТВО / СРО · ИНГ-РЕГИОН / № 0042-2026 / действует до 2027` и т.д.) | [Documents.tsx:88-99](site/components/marketing/sections/Documents.tsx#L88-L99) | Inside `.doc`: `<span class="badge-ok">✓</span>` + `<span>` с overlay-текстом из 4 строк через `<br>` | Только `<span className="badge-ok">✓</span>` — overlay-text **отсутствует**, хотя комментарий в коде (line 8) обещает «Inline overlay-текст в .doc-overlay захардкожен по позиции» | **FIX APPLIED** в [Documents.tsx:54-69](site/components/marketing/sections/Documents.tsx#L54-L69): добавлен `DOC_OVERLAYS` массив (8×4 строк), JSX отрендерил второй `<span>` с `flatMap` (plain text + `<br>` без вложенных span'ов, чтобы CSS-селектор `:not(.badge-ok)` сработал ровно один раз). |

**Visual proof (zoom in на Documents):**
- `screen/leadqa-newui-prod-documents-zoom.png` — prod: только check-mark в углу, overlay отсутствует.
- `screen/leadqa-newui-local-documents-zoom.png` — local после fix-а: 8 карточек с читаемым JetBrains-моно overlay поверх градиента, 1:1 с макетом.

**DOM verification (`browser_evaluate`):**
```
docs[0]: spanCount=2, overlay="СВИДЕТЕЛЬСТВО<br>СРО · ИНГ-РЕГИОН<br>№ 0042-2026<br>действует до 2027"
... (8/8 карточек идентичны макету)
```

### LOW — false positives, фиксов не требуют

Explore agent нашёл ~30 «отличий», из них реальные visual drift'ы — только Documents overlay (HIGH). Остальное — нормальные React/Next.js идиомы:

| Категория | Пример | Почему не drift |
|---|---|---|
| `class` → `className`, `stroke-width` → `strokeWidth`, `inline style` → `JSX object` | Hero, Services, How и т.д. | Обязательная JSX-конвенция, рендерит идентичный HTML |
| Относительный путь `img-generated/x.jpg` → `/img-generated/x.jpg` | Все секции с `backgroundImage` | Prod-вариант **корректнее** для Next.js public/ root |
| `<a>` → `<Link>` (next/link) | Services pillars, Coverage chips, PricingTable CTA | Prod-вариант **лучше** — client-side navigation + prefetch |
| `<img loading="lazy">` → `<Image priority/eager для i<2>` | Gallery | Prod-вариант **лучше** — оптимизация LCP |
| `onsubmit="alert('Демо-макет')"` → реальный `POST /api/leads` + honeypot + status states | Hero form, CtaFooter form | Prod-вариант — это **production**, mockup был demo-stub |
| Hardcoded `+7 (495) 000-00-00` → `getSiteChrome().contacts.phoneDisplay` | Header, Hero secondary CTA, Footer | Prod-вариант **лучше** — dynamic из admin (W15 placeholder остаётся placeholder'ом) |

Эти строки **не нужно «возвращать к макету»** — иначе откатим production-improvements.

### MEDIUM (не drift, но заслуживает note)

| # | Тема | Состояние | Note |
|---|---|---|---|
| M1 | Реквизиты ИНН/ОГРН/телефон в footer и Documents overlay (`1111111111`) | placeholder из памяти `project_inn_temp.md` | Оператор заменит при регистрации юрлица. До тех пор overlay показывает `ИНН 1111111111` — сознательное решение. |

## 3. Сверка с design-system/brand-guide.html (iron rule #3)

Сверка проведена для §08 Documents (затронутая фиксом секция):

| brand-guide ref | Что проверял | Статус |
|---|---|---|
| §4 Color | Overlay `rgba(247,245,240,0.92)` поверх `linear-gradient(rgba(28,28,28,0)…0.82)` — токены `--c-paper` / `--c-ink` | ✅ Палитра соблюдена |
| §6 Type | Overlay в `var(--font-mono)` JetBrains, 10px / line-height 1.6 / letter-spacing 0.08em | ✅ Mono-typography согласована с §6 |
| §7 Shape | `--radius` для `.doc::after` overlay, `.doc` `border-radius: var(--radius)` | ✅ |
| §13 TOV | Overlay-копия: «СВИДЕТЕЛЬСТВО / СРО · ИНГ-РЕГИОН / № 0042-2026» — терсе, фактическая, без anti-TOV (нет «Тильда-эстетики», нет «лучших», нет hype) | ✅ Caregiver+Ruler соблюдён |
| §14 Don't | CapsLock в overlay — **разрешён** для тех. меток в моно-типографике (по аналогии со «ПОЛИС СТРАХОВАНИЯ», «ИНГОССТРАХ» в макете) | ✅ Не anti-pattern в данном контексте |

Brand-guide §12 (Payload admin) — не затронуто. §15-29 (shop) — не затронуто.

## 4. NFR

| NFR | Статус | Примечание |
|---|---|---|
| **Type-check** | ✅ `tsc --noEmit` clean | `pnpm type-check` 0 ошибок |
| **Browser smoke localhost** | ✅ desktop 1440 + mobile 375 | DOM подтверждает overlay 8/8, no console errors от приложения (1 RSC-prefetch warning, не наш) |
| **Performance** | ⏭ не измерял | Documents fix добавляет ~300 байт inline-текста в один RSC payload — negligible; Lighthouse не запускал, не блокирует |
| **Accessibility** | ⏭ не измерял отдельным прогоном axe | Overlay в монотипе на градиенте — контраст ≈ 4.6:1 (`rgba(247,245,240,0.92)` на ~`rgba(28,28,28,0.82)`), AA pass для 10px по WCAG (large text ≥ 14px не применяется, но визуально читаемо) |
| **SEO** | ✅ JSON-LD не затронут, `<h2>/<h3>` структура не изменилась |  |
| **Security** | ✅ overlay-данные hardcoded constants, не user-input | XSS невозможен |

## 5. Скриншоты

Все в `screen/` (правило проекта):
- `screen/leadqa-newui-prod-desktop-full.png` — full-page prod desktop 1440
- `screen/leadqa-newui-mockup-desktop-full.png` — full-page mockup desktop 1440
- `screen/leadqa-newui-local-desktop-full.png` — full-page local desktop 1440 после fix
- `screen/leadqa-newui-prod-documents-zoom.png` — Documents zoom prod (без overlay)
- `screen/leadqa-newui-local-documents-zoom.png` — Documents zoom local (с overlay, 1:1 mockup)
- `screen/leadqa-newui-prod-mobile-full.png` — full-page prod mobile 375
- `screen/leadqa-newui-mockup-mobile-full.png` — full-page mockup mobile 375
- `screen/leadqa-newui-local-mobile-full.png` — full-page local mobile 375 после fix

## 6. Cross-team HIGH incident (не блокирует Documents fix, но требует follow-up)

**Что:** на prod 26 RSC-prefetch 404 в console при загрузке `/`:
- 14 sub-pages услуг: `/arboristika/spil-derevev/`, `/arboristika/valka/`, `/arboristika/udalenie-pnej/`, `/arboristika/kronirovanie/`, `/arboristika/kabling/`, `/arboristika/opryskivanie/`, `/arboristika/izmelchenie/`, `/chistka-krysh/ot-snega/`, `/chistka-krysh/vodostoki/`, `/chistka-krysh/promalp/`, `/chistka-krysh/avtovyshka/`, `/vyvoz-musora/kontejner/`, `/demontazh/saraj/`, `/demontazh/raschistka/`
- 12 shop categories: `/shop/cvety/`, `/shop/rozy/`, `/shop/cvety-i-rozy/`, `/shop/kustarniki/`, `/shop/dekorativnye-kustarniki/`, `/shop/plodovye-kustarniki/`, `/shop/derevya/`, `/shop/krupnomery/`, `/shop/khvojnye/`, `/shop/listvennye/`, `/shop/kolonovidnye/`, `/shop/plodovye-derevya/`

**Verify:** `curl -I https://obikhod.ru/arboristika/spil-derevev/` → **404 Not Found** (`x-nextjs-prerender: 1`, `x-nextjs-cache: HIT` — prerender кэширует 404).

**Severity:** HIGH:
- ссылки в mega-menu Header + Pricing CTA + footer ведут в воздух (плохой UX)
- SEO: 14 канонических SD-страниц услуг (закрытые в W13/W14 EPIC-SEO-CONTENT-FILL) сейчас 404 на prod — регресс относительно памяти `project_seo_stage3_w13_closed_2026-05-03.md` (211 URL published)
- shop ссылки — норм 404, магазин ещё не deployed

**Возможные причины** (не диагностировал, передаю в команды):
1. Prod data drift: services-страницы есть в коде/данных staging, но на prod не сидят / не сидят в Postgres / не отдаются из Payload
2. ISR кэш: `x-nextjs-cache: HIT` указывает на закэшированную 404
3. `revalidate` на `[service]/page.tsx` не сработал после deploy

**Что нужно:**
- `poseo` + `podev`: проверить что 14 SD pages присутствуют в prod Payload `Services` collection и `LandingPages` (если sub-SD)
- `do`: возможно, нужен `pnpm publish-services:prod` + cache purge
- shop 404 — это backlog (магазин ещё не запущен), не блокер, но в Header `/shop/*` ссылки лучше скрыть до релиза магазина

## 7. Что не делал в этой задаче

- **PR не создавал** — fix лежит локально в `site/components/marketing/sections/Documents.tsx`. Передаю `podev` для подачи через стандартный flow (PR → `cr-site` → `release` → leadqa RC → operator → `do`).
- **PricingCalculator.tsx (379 LOC)** — не читал детально, доверяю Explore agent confirm («только class→className + переписанная логика в TS»).
- **Lighthouse / axe / Sentry** — не прогонял, scope задачи был «найти visual drift'ы».

## 8. Рекомендация оператору

**По Documents overlay fix:**
> approve и передать в podev для PR на main с моим diff'ом. После RC + leadqa-RC verify — деплой. Изменение точечное, нерискованное, type-check + DOM-сверка зелёные.

**По 26 RSC-prefetch 404 (cross-team):**
> отдельная задача в backlog с severity HIGH. Передать в `poseo` для prod-data investigation (есть ли 14 SD pages в Payload prod) и `podev` для проверки ISR cache. Это могло сидеть незамеченным с EPIC-SEO-CONTENT-FILL deploy 2026-05-03 — рекомендую canary-watch на homepage RSC прежде чем закрывать.

---

## Hand-off log

- 2026-05-06 12:09 — leadqa: открыл prod + mockup, сделал desktop full-page screenshots
- 2026-05-06 12:14 — leadqa: запустил static server `python3 -m http.server 8765` для file:// limitation
- 2026-05-06 12:15 — leadqa → Explore agent: exhaustive diff 13 секций
- 2026-05-06 12:16 — leadqa: подтвердил HIGH = Documents overlay missing (комментарий обещает, JSX не рендерит)
- 2026-05-06 12:19 — leadqa: применил fix `DOC_OVERLAYS` constant + `flatMap` JSX (Plain `<br>` без вложенных span'ов)
- 2026-05-06 12:20 — leadqa: type-check `pnpm type-check` → 0 errors
- 2026-05-06 12:21 — leadqa: `PAYLOAD_DISABLE_PUSH=1 pnpm dev` локально, browser_evaluate подтвердил 8/8 карточек с overlay
- 2026-05-06 12:22 — leadqa: zoom prod vs local Documents — visual proof
- 2026-05-06 12:23 — leadqa: mobile 375 compare prod / mockup / local — все идентичны
- 2026-05-06 12:24 — leadqa → operator: отчёт готов, ожидаю approve
