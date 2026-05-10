---
artifact: inventory-services-2026-05
epic: EPIC-SERVICE-PAGES-UX
deliverable: C1.a
owner: design
created: 2026-05-09
brand_guide_version: v2.2 (5754 lines)
scope: services periметр §1-14 + §30-33 (auth/site-chrome). §15-29 shop игнорим (удаляются в EPIC-SHOP-REMOVAL.W3).
skills_activated: [ui-ux-pro-max, design-system]
related:
  - design-system/brand-guide.html
  - specs/EPIC-SERVICE-PAGES-UX/intake.md
  - team/adr/ADR-0021-service-page-master-template (deliverable C2, pending)
status: done
---

# Brand-guide v2.2 inventory · services periметр

## 1 · Executive summary

Brand-guide v2.2 (5754 строки) для services-периметра содержит **15 готовых компонентов** (§1-14 + §30, §33), полностью покрывающих базовый UI-каркас: токены (color/contrast/type/shape), кнопки, бейджи, форму, карточку услуги, mega-menu (desktop + mobile accordion), pagination (numbered + compact), 4 toast-варианта, primary success-card flow «фото→смета», empty state, loading skeleton, 5 error-страниц, header (3 auth-states), footer (4 колонки + pre-footer CTA), 49 line-art иконок (22 service + 9 district + 9 case + 9 shop, последние 9 удаляем).

**Готовы как-есть для master template (T2/T3/T4):** 8 компонентов — buttons, badges, form-inputs, pagination, toasts, success-card, skeletons, error-pages, mega-menu, footer.

**Требуют расширения brand-guide.html в EPIC-C.C2:** **9 секций** (gap для master template) — `hero-service`, `breadcrumbs`, `tldr-block` (короткая выжимка для нейровыдачи), `services-grid` (T2 список sub-услуг), `pricing-block` (таблица цен с tabular-nums), `calculator-shell` (UI-обёртка US-8 photo→quote), `process-steps` (4-7 шагов), `mini-case` (тизер кейса), `cta-banner` (между секциями), `comparison-table` («сам vs специалист»), `trust-block` (СРО/лицензии/страховка), `neighbor-districts` (related-районы), `lead-form` (полноценный, не простой контрол).

**fal.ai-fillable** (по hybrid policy intake §fal.ai): hero-photos (документальный репортажный стиль), case-photos, district-photos. Всё остальное генерим только через design-расширение brand-guide, не AI.

**Анти-TOV защищён** хуком `protect-immutable.sh` — слова «упс / в кратчайшие сроки / индивидуальный подход» заблокированы.

---

## 2 · Inventory table

### 2.1 · Tokens & foundations

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Color tokens | `color` | `brand-guide.html:1092-1133` | brand (primary/primary-ink/accent/accent-ink), text (ink/ink-soft/muted), surfaces (bg/bg-alt/card/line), semantic (success/error/on-primary) | n/a | `--c-*` CSS-vars + Tailwind v4 `bg-primary` etc | inline (responsive) | ВСЕ секции template — фон / текст / кнопки | готов как-есть | Расхождение с брифом «графит+терракот» зафиксировано — source of truth = код |
| Contrast pairs | `contrast` | `brand-guide.html:1136-1198` | 8 пар с WCAG ratio | n/a | `--c-*` | inline | вся типографика, все CTA — guard для WCAG 2.2 AA | готов как-есть | `muted` на `bg` = AA✕ для normal — caption/large only. `accent` на `bg` 2.3:1 — только bg-акценты, не текст |
| Typography scale | `type` | `brand-guide.html:1201-1260` | display/h-xl/h-l/h-m/h-s/lead/body/eyebrow/mono.tnum | n/a | Golos Text + JetBrains Mono via `next/font` swap, clamp() responsive | clamp() = mobile auto | hero (h-display/h-xl), section headings (h-l/h-m), card titles (h-s), pricing (mono.tnum), eyebrow в каждой секции | готов как-есть | tabular-nums обязателен для цен и таймеров |
| Shape tokens | `shape` | `brand-guide.html:1263-1302` | radius-sm 6px / radius 10px / radius-lg 16px / pill 999px · spacing 4-96px · maxw 1280px · pad 20/40/80px | n/a | `--radius-*`, `--maxw`, `--pad` | media-queries для pad | вся вёрстка | готов как-есть | radius-sm = inputs/badges, radius = buttons/cards, radius-lg = hero/case-cards, pill = status-badges only |

### 2.2 · Components (§07 · базовые)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Кнопки | `components` | `brand-guide.html:1310-1320` | btn-primary / btn-secondary / btn-ghost · sizes inferred | default + hover (primary→primary-ink) + focus-visible (2px accent outline) + disabled (`Отправлено`) — **отсутствует pressed/loading в brand-guide** | `--c-primary`, `--c-on-primary`, focus 2px accent | min-height 44px (WCAG 2.5.5) | hero-CTA, lead-form submit, calculator submit, pre-footer CTA, error-page actions | требует расширения | brand-guide НЕ показывает loading-spinner и pressed state — design draws в C2 wave |
| Бейджи и статусы | `components` | `brand-guide.html:1321-1328` | badge-live (зелёный с точкой) · badge-draft (серый) · badge-error | static visual | `--c-success`, `--c-muted`, `--c-error` | inline | `services-grid` (новые услуги «● Зима 2026»), pricing-block (статусы), trust-block (тарифы) | готов как-есть | используются в master template как indicator на карточках |
| Форма (input + label + helper + submit) | `components` | `brand-guide.html:1330-1336` | tel-input один, без вариантов | default + placeholder + helper-text · **отсутствует focus / error / disabled / required** | `--c-line` border, `--c-muted` placeholder | стандартная mobile (autozoom safe — 16px min) | lead-form блок, calculator pre-submit | требует расширения | в brand-guide только base. Нужны: error-state inline, multi-input layout, file-upload (для photo→quote), checkbox согласия 152-ФЗ |
| Карточка услуги | `components` | `brand-guide.html:1338-1348` | card с eyebrow + title + description + price + CTA | static | `--c-card`, `--c-bg-alt`, `--c-primary`, mono tabular-nums для цены | flex-grow inline | services-grid (T2 = sub-услуги), pricing-block (тарифные плиты), related-services | готов как-есть | базовая структура — используем 1:1 для services-grid |

### 2.3 · Icons (§08 · 49 line-art glyph)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Service icons (22) | `icons` | `brand-guide.html:1353-1384` | 4 кластера: Арбористика 7 / Крыши+территория 4 / Мусор+демонтаж 2 / УТП 3 + 6 в `_sheet.png` | static (стилевая спека stroke 1.5 / round / fill:none / currentColor) | viewBox 0 0 24 24, currentColor наследует `var(--c-primary)` | stroke 1.2 на 16px, 2 на 48+ | services-grid (на каждой карточке), process-steps (УТП), trust-block (fixed-price/fast-response/legal-shield), header mega-menu | готов как-есть | реестр: `icons/services/README.md` + `ServiceIcons.tsx`. Dasharray для динамики (трос каблинга, поток воды) |
| District icons (9) | `icons` | `brand-guide.html:1456-1524` | landmark-метафоры: Одинцово / Красногорск / Истра / Химки / Мытищи / Пушкино / Раменское / Жуковский / Москва | static + tech debt (inline в HTML и Header.tsx, нет export) | viewBox 0 0 24 24, currentColor | inline | district-pill в hero (T3/T4), neighbor-districts блок, mega-menu Районы | готов как-есть · tech debt | расширение до 28 районов запланировано через wsfreq US-4 — design draws по shortlist. Кандидаты: Балашиха/Электросталь/Серпухов/Подольск/Видное |
| Case topic icons (9) | `icons` | `brand-guide.html:1526-1592` | 3 кластера × 3: Аварийные (storm/emergency/urgent-roof) · Сезонные (pruning/winter-prep/post-renovation) · B2B (uk/cottage/fm) | static | viewBox 0 0 24 24, currentColor | inline | mini-case блок, cases-grid (related), mega-menu Кейсы | готов как-есть | используем для тизеров кейсов в template |
| Shop icons (9) | `icons` | `brand-guide.html:1386-1454` | плодовые-деревья / колоновидные / плодовые-кустарники / декоративные-кустарники / цветы / розы / крупномеры / лиственные / хвойные | static | viewBox 0 0 24 24, currentColor + fill (плоды/ягоды) | inline | **scope: игнорим** — удаляем в EPIC-SHOP-REMOVAL.W3 | scope-out | не используем в services template |
| Error illustrations (5) | `errors` | см. §11.5 | 96×96 line-art: компас (404), пила-чихалка (500), оборванная цепь (502), табличка-перерыв (503), антенна без сигнала (offline) | static | viewBox 0 0 96 96, stroke 2, currentColor | scale в media-query | error-pages all | готов как-есть | не stroke 1.5, а 2 — больший формат |

### 2.4 · Navigation (§09)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Mega-menu (desktop) | `nav` | `brand-guide.html:1599-2056` | 4 trigger'а с dropdown (Услуги / Районы / Кейсы / Магазин) + 4 flat-link (Дизайн ландшафта / Цены / Блог / Контакты) + CTA «Получить смету» | default / hover (color+bg) / focus / dropdown open (opacity+translateY) · keyboard: Tab / Enter+Space / Esc / arrows · grace-period 300ms · prefers-reduced-motion | `--c-bg`, `--c-bg-alt`, `--c-primary`, `--c-line`, `--font-mono` для категорий | media-query 900px → static panels | site-chrome — НЕ часть master template, но обязательная обёртка | готов как-есть | spec в `components/navigation/mega-menu.spec.md`. Магазин-колонка удаляется в EPIC-SHOP-REMOVAL |
| Mobile accordion (drawer) | `nav` | `brand-guide.html:2058-2125` | `<details>`/`<summary>` + chevron rotation 180°, sub-items с иконками | open/closed · keyboard built-in | `--c-card`, `--c-line`, mono для category headers | n/a | site-chrome mobile | готов как-есть | используется для всех 6 разделов меню |
| Anti-patterns nav | `nav` | `brand-guide.html:2127-2133` | 4 don't: green plate / row-fill hover / emoji / 2+ levels | n/a | n/a | n/a | guard для design в C2 | готов как-есть | iron-rule для template review |

### 2.5 · Pagination (§10)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Numbered desktop | `pagination` | `brand-guide.html:2207-2221` | numbered с ellipsis + Prev/Next arrow | default + hover + current (aria-current=page) + disabled (Prev/Next на границах) | `--c-primary`, `--c-bg-alt`, mono tabular-nums, min-width 44px | media-query → compact | T2 main-pillar pages «Все услуги арбористики» (24 карточки), cases-index, blog-index, neighbor-districts (если 28+ районов) | готов как-есть | spec в `components/pagination/pagination.spec.md` |
| Compact mobile | `pagination` | `brand-guide.html:2251-2258` | space-between «← / Страница X из N / →» | static | `--c-muted`, `--c-ink` | <640px | mobile T2 lists | готов как-есть | |
| SEO `<head>` snippets | `pagination` | `brand-guide.html:2260-2265` | rel=canonical + rel=prev + rel=next | n/a | n/a | n/a | T2 paginated lists, blog pagination | готов как-есть | Яндекс читает rel=prev/next, для ru-first проекта обязательно. US-3 composer.ts уже инжектит canonical |

### 2.6 · Notifications & feedback (§11)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Primary success-card («фото→смета») | `notifications` | `brand-guide.html:2411-2424` | check-icon + ID-крупно + текст + 2 CTA (Telegram + позвонить) | success state — целиком заменяет форму, не toast поверх | `--c-bg-alt`, `--c-primary`, `--c-success`, mono tabular-nums | inline responsive | lead-form post-submit, calculator post-submit | готов как-есть | iron rule: форма заменяется целиком, не модалка |
| Toast-уведомления (4 варианта) | `notifications` | `brand-guide.html:2429-2478` | success (polite, auto 3s) / error (assertive, manual close + action-link) / warning (янтарный) / info (polite, auto 4s) | role=status или role=alert + aria-live · auto-dismiss + manual close | `--c-success`/`--c-error`/`--c-accent`/`--c-primary` border-left 4px | top-right desktop / top-center full-width mobile | calculator partial states (фото загружено, ошибка), lead-form inline валидация | готов как-есть | формула для error: «что не так + что сделать». Без «упс» |
| Empty state | `notifications` | `brand-guide.html:2483-2493` | dashed-border card + icon + h5 + paragraph + link | static | `--c-card`, `--c-line` (dashed), `--c-muted`, primary link | inline | mini-case в T3/T4 если нет кейсов в районе, related-services если нет | готов как-есть | формула: «что должно быть + что сделать», не «No data» |
| Loading skeleton | `notifications` | `brand-guide.html:2495-2504` | shimmer 1200ms keyframes + skeleton-block | aria-busy=true · prefers-reduced-motion → static | `--c-bg-alt` + linear-gradient white-50% | inline | services-grid loading, calculator processing photo, mini-case loading | готов как-есть | повторяет final layout — нет CLS. shimmer disabled на reduced-motion |
| 5-state submit flow | `notifications` | `brand-guide.html:2507-2516` | Idle → Filled → Submitting → Success → Error | docs only (текстовое описание ol) | n/a | n/a | lead-form, calculator submit | готов как-есть | iron rule: на error форма НЕ сбрасывается, retry активен |
| Anti-patterns notifications | `notifications` | `brand-guide.html:2518-2526` | 6 don't | n/a | n/a | n/a | guard | готов как-есть | |

### 2.7 · Error pages (§11.5)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| ErrorState shell | `errors` | `brand-guide.html:2613-2737` | unified template: 96×96 illu + code (eyebrow mono uppercase) + title (h-m) + 1-2 lines text + 1-2 CTA + fallback (border-top dashed) | static | `--c-bg`, `--c-primary` (illu opacity 0.85), `--c-accent` (primary CTA), `--c-line` | inline | site-chrome — error fallback для 404 на любом T2/T3/T4 URL | готов как-есть | spec в `components/error-state/error-state.spec.md` (создаётся ui по art-brief) |
| 404 / 500 / 502 / 503 / offline | `errors` | `brand-guide.html:2613-2737` | 5 страниц с конкретными иллюстрациями + текстами Caregiver-стиля | static | как выше | inline | route-segment / app-boundary / nginx-edge / client-network | готов как-есть | TOV: «Сервер не отозвался» вместо «Упс». Sentry capture на 500/502/503 |
| Copy principles | `errors` | `brand-guide.html:2740-2748` | 6 принципов (никогда «упс», CTA-выход, объяснить не извиниться, код не доминирует, иллюстрация-метафора, Sentry) | n/a | n/a | n/a | guide для cw | готов как-есть | финал текстов закрепит cw |

### 2.8 · TOV & anti-patterns (§13-14)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| TOV scales (4 шкалы NN/g) | `tov` | `brand-guide.html:3268-3276` | Funny↔Serious / Formal↔Casual / Respectful↔Irreverent / Enthusiastic↔Matter-of-fact | n/a | n/a | n/a | reference для cw на всех текстах в template | готов как-есть | hook protect-immutable блокирует анти-TOV |
| 5 принципов TOV | `tov` | `brand-guide.html:3278-3285` | слово держим, цифры конкретные, техникой не пугаем, не обесцениваем, ответственность норма | n/a | n/a | n/a | reference для cw | готов как-есть | |
| Словарь Да/Нет | `tov` | `brand-guide.html:3287-3313` | 7 «да» + 7 «нет» лексем | n/a | n/a | n/a | reference для cw | готов как-есть | hook блокирует «в кратчайшие сроки», «индивидуальный подход» в site/ и content/ |
| 4 примера голоса | `tov` | `brand-guide.html:3315-3346` | B2C WhatsApp / B2C SMS / B2B email / B2C извинение | n/a | n/a | n/a | reference | готов как-есть | |
| Visual anti-patterns | `dont` | `brand-guide.html:3357-3368` | 9 don't: эко-зелёный/листочек / дерево с топором / рыцарь / рукопожатия / ДВОРЪ-style / стоковые рукавицы / матрёшки / градиенты в primary / неоновые ховеры | n/a | n/a | n/a | guard для design в C2 wave | готов как-есть | iron-rule для review |

### 2.9 · Site-chrome (§30 · §33)

| component | section_id | file_line | variants | states_documented | tokens_used | mobile_variant | template_use_case | gap | notes |
|---|---|---|---|---|---|---|---|---|---|
| Header (3 auth-states) | `auth-header` | `brand-guide.html:4787-4880` | logged-out (CTA Войти+Регистрация) / guest-with-lead (sticky-pill + Войти) / logged-in (user-menu dropdown + counter-badges) | live preview всех 3 + dropdown raskryt + 6 статусов pill | `--c-bg`, `--c-line`, `--c-primary`, `--c-accent`, `--font-mono` для phone | <860px → burger drawer, guest-pill = sticky 36px полоска под header | site-chrome во всех T2/T3/T4 (canonical, не часть template) | готов как-есть | spec `components/header/header.spec.md`. Magic-link для guest без пароля |
| User-menu dropdown | `auth-header` | `brand-guide.html:4836-4854` | header (name+meta) + 5 main items (Кабинет/Заявки/Заказы/Резервы/Избранное) + hr + 2 secondary (Профиль/Выйти) с counter-badges | static + hover | line-art icons | inline | header logged-in | готов как-есть | |
| Header & Footer iron rules + matrix | `site-chrome` | `brand-guide.html:5389-5677` | full-chrome / minimal-chrome / partial-chrome для 10 page-types · 6 iron rules | docs | n/a | mobile breakpoints в spec | matrix для template T2/T3/T4 = full-chrome | готов как-есть | exception list закрытый: только auth/checkout/thank-you/embed/print |
| Pre-footer CTA | `site-chrome` | `brand-guide.html:5521-5536` | conversion-CTA «Готовы убрать дерево?» с 2 button-on-dark (primary + ghost phone) | static | `--c-primary` фон, `--c-on-primary` текст | inline responsive | T2/T3/T4 services + LP-районы. На shop меняется на «Подобрать сорт». В корзине/чекауте/кабинете/error/auth — убирается | готов как-есть | iron rule: контекстно-зависим, но из закрытого списка вариантов |
| Footer (4 cols + brand-col + legal) | `site-chrome` | `brand-guide.html:5540-5621` | brand-col 1.4× (logo + tagline + intro + contacts) + Услуги / Районы / Магазин / Помощь | static | `--c-bg-alt`, `--c-line`, `--c-ink-soft` | mobile = accordion 4 col, brand expanded, legal vertical | site-chrome всех T2/T3/T4 | готов как-есть · partial gap | data из Payload SiteChrome / Services / Districts. Магазин-колонка УДАЛЯЕТСЯ в EPIC-SHOP-REMOVAL — нужна замена («Кейсы»/«Гарантии») в C2 |
| Bottom-row legal | `site-chrome` | `brand-guide.html:5610-5620` | © + ИНН + ОГРН + 4 ссылки (152-ФЗ / Договор-оферта / Cookies / Telegram) | static | `--c-muted` | mobile = vertical | site-chrome footer | готов как-есть | ИНН placeholder 1111111111 — заменит оператор при регистрации (memory: project_inn_temp.md) |

---

## 3 · Gap analysis для master template

EPIC-C.C2 master template structure (из intake.md AC-C2):
**hero → breadcrumbs → tldr → services-grid (T2) → pricing-block → calculator (фото→смета) → process → mini-case → FAQ → cta-banner → related → neighbor-districts → lead-form**

| # | Секция template | Есть в brand-guide? | §/line | Gap-вердикт | Что нужно дорисовать в C2 wave |
|---|---|---|---|---|---|
| 1 | `hero-service` | НЕТ (есть только typography classes h-display/h-xl) | — | **требует расширения** | новая § «Hero patterns» в brand-guide: T2-hero (h-display + lead + 2 CTA + photo right column), T3-hero (с district pill + photo сверху mobile), T4-hero (с sub-service breadcrumb). Photo через fal.ai (Nano Banana Pro документальный стиль). По 1 mobile + 1 desktop на T2/T3/T4 = 6 mockup |
| 2 | `breadcrumbs` | НЕТ | — | **требует расширения** | новая § «Breadcrumbs» в brand-guide: visual variant + JSON-LD BreadcrumbList snippet. JSON-LD уже есть в US-3 composer.ts. Мелкий компонент — 30-40 строк HTML |
| 3 | `tldr` (короткая выжимка для нейровыдачи) | НЕТ | — | **требует расширения** | новая § «TL;DR / Summary block»: ul из 3-5 пунктов в card с border-left 4px primary. Адаптирован для llms.txt + Speakable schema (US-3) |
| 4 | `services-grid` (T2 sub-услуги) | ЧАСТИЧНО — есть «Карточка услуги» (line 1338-1348) одиночная | `components` | **готов как-есть для карточки**, но **требует расширения** для grid layout: 3 col desktop / 2 col tablet / 1 col mobile + filter chips (опционально) | расширение: § «Services Grid» с layout-spec (gap 16px, masonry или fixed-height) + filter chips под radius-sm pill |
| 5 | `pricing-block` | НЕТ — есть только цена в Карточке услуги | — | **требует расширения** | новая § «Pricing table»: 3-col tier (Базовый / Стандарт / Под ключ), tabular-nums, чекмарки features, highlighted middle col, sticky on scroll опция. Для T2/T3/T4 — разная density |
| 6 | `calculator-shell` (UI-обёртка US-8 photo→quote) | НЕТ — есть форма+input одиночная | `components` (1330) | **требует расширения** | новая § «Calculator UI shell»: drag-drop area (24/48 photo states), photo-thumbnail row с remove, обёртка для Claude API call (loading skeleton от §notifications), success-card (от §notifications уже есть). 5-state flow уже задокументирован |
| 7 | `process-steps` (4-7 шагов) | НЕТ | — | **требует расширения** | новая § «Process steps»: horizontal numbered (desktop) / vertical (mobile), каждый шаг — service-icon + title + 1-2 lines. Стиль карточки услуги |
| 8 | `mini-case` (тизер кейса) | ЧАСТИЧНО — есть Case-icons + Empty state pattern | `icons` (1526), `notifications` (2483) | **требует расширения** | новая § «Mini-case teaser»: icon + before/after photo (fal.ai) + 1 cifra metric + link. T2 = 1 кейс horizontal, T3/T4 = 1 кейс с photo |
| 9 | `FAQ-accordion` | НЕТ (есть `<details>` в mobile mega-menu pattern) | `nav` (2058) — переиспользуем pattern | **требует расширения** | новая § «FAQ accordion»: chevron rotation, тот же `<details>` паттерн, JSON-LD FAQPage уже в US-3 composer.ts. Дизайн = заимствуем mobile-accordion |
| 10 | `cta-banner` (между секциями) | ЧАСТИЧНО — есть pre-footer CTA (33.4.1) | `site-chrome` (5521) | **готов как-есть** через variant pre-footer-CTA inline посреди страницы | расширение minor: документировать «inline CTA banner» как variant pre-footer (тот же markup, другой spacing) |
| 11 | `related` (related-services) | ЧАСТИЧНО — Карточка услуги + grid | `components` (1338) | **готов как-есть** | reuse services-grid с заголовком h-l «Похожие услуги» |
| 12 | `neighbor-districts` (related-районы) | ЧАСТИЧНО — district-icons есть | `icons` (1456) | **требует расширения** | новая § «District chips/grid»: pill с landmark-иконкой + название + расстояние «12 км». 3-6 chips в row |
| 13 | `lead-form` (полноценная) | ЧАСТИЧНО — Форма (1330) + 5-state flow + success-card | `components` + `notifications` | **требует расширения** | новая § «Lead form (full)»: phone + name + photo upload (multi) + checkbox 152-ФЗ + submit. 5-state flow собран. Mobile-first |

**Не покрыто intake-структурой, но критично для services-периметра:**

| # | Секция template | Гap-вердикт | Что нужно |
|---|---|---|---|
| 14 | `trust-block` (СРО/лицензии/страховка) | **требует расширения** | новая § «Trust/credentials block»: 3-4 plate с документ-иконами + цифрой («СРО 1 млрд», «Страховка 10 млн», «ГЛОНАСС»). Антипаттерн рукопожатия (§dont) |
| 15 | `comparison-table` (сам vs специалист) | **требует расширения** | новая § «Comparison table»: 2-col «Сами / Обиход», 5-7 строк (риск/время/цена/штрафы/гарантия) |
| 16 | `city-distributor` (карта или ссылочный подвал районов) | **требует расширения** | новая § или часть neighbor-districts: подвальная сетка районов alphabetical/regional |
| 17 | Photo style (для hero/cases/districts) | **fal.ai-fillable** | по brand-guide §photography (документальный репортажный) — нет в services-периметре, есть только в shop §28. Нужна адаптация для services |

---

## 4 · Recommendations для EPIC-C.C2

Приоритет — какие новые секции добавить в `brand-guide.html` ДО старта вёрстки (EPIC-D).

### 4.1 · Critical (без них template не верстается) — owner: design + ui

1. **§ Hero service-page patterns** — 6 mockup'ов (T2/T3/T4 × desktop/mobile) с реальной типографикой и реальным ServiceIcons. Photo-плейсхолдер picsum или fal.ai-черновик. Обоснование: hero — единственная секция, которую видит 100% посетителей; без spec'а каждая T2/T3/T4 рискует разъехаться.
2. **§ Calculator UI shell** — обёртка для US-8 photo→quote. 5 состояний (idle / drag-over / uploading / processing / result). Loading-skeleton уже есть в §notifications. Обоснование: главный конверсионный механизм Обихода («смета за 10 минут»), iron rule из intake §AC AC-2.
3. **§ Lead form (full)** — multi-input + photo upload + 152-ФЗ checkbox + 5-state flow. Связан с success-card §notifications. Обоснование: 233 service-URL × lead-form == главный канал лидов.
4. **§ Pricing table** — 3-col tier с tabular-nums и highlighted plan. Обоснование: pricing-block есть в каждой service-странице по AC; без spec'а cw + design разъезжаются.

### 4.2 · High (без них template работает, но качество страдает) — owner: design

5. **§ Process steps** — visual для 4-7 шагов «как мы работаем». Обоснование: customer journey (intake §AC §1 «hero → понимание → решение → действие»), без визуала остаётся только список.
6. **§ Trust/credentials block** — СРО/страховка/ГЛОНАСС-плата. Обоснование: B2B сегмент (УК/ТСЖ/FM) ожидает credentials наверху страницы; конкуренты liwood это используют.
7. **§ Mini-case teaser** — icon + before/after photo + metric. Обоснование: социальное доказательство для Caregiver-архетипа.
8. **§ FAQ-accordion** — reuse mobile-mega-menu `<details>` pattern. Обоснование: FAQ-block в каждом template URL по AC, JSON-LD FAQPage уже в US-3 composer.ts.

### 4.3 · Medium (nice-to-have, не блокеры) — owner: design

9. **§ Breadcrumbs** — мелкий компонент (визуал + JSON-LD).
10. **§ TL;DR / Summary block** — для нейровыдачи.
11. **§ Comparison table** «Сам vs специалист» — конкуренция на смежных queries.
12. **§ District chips/grid** — neighbor-districts как pill.
13. **Update § Footer**: убрать колонку «Магазин» после EPIC-SHOP-REMOVAL.W3, заменить на «Кейсы» или «Гарантии». Owner: design + popanel.

### 4.4 · fal.ai assets gap (intake §fal.ai hybrid policy)

- **Hero photo lib**: 1 photo на T2 × 5 pillar (арбористика/крыши/мусор/демонтаж/landshaft если останется) = 5 photos через Nano Banana Pro документальный стиль. Replace picsum.
- **District photo lib**: 9 districts × 1 photo (узнаваемый landmark) = 9 photos.
- **Case photo lib**: ~10 кейсов × before+after = 20 photos. Rate-limit: cw редактирует копии после генерации.
- **НЕ генерим**: иконки (only design-extension brand-guide), UI-элементы (только brand-guide), TOV-тексты (только Claude API + cw).

### 4.5 · Process — как договариваемся в C2 wave

1. Design открывает PR в `design-system/brand-guide.html` с новыми § (1-13) одной серией коммитов. Per-§ — отдельный mockup с live-preview (как в §notifications или §nav).
2. До PR — `art-brief-template.md` в `specs/EPIC-SERVICE-PAGES-UX/` с раскадровкой каждой § (типы / states / mobile / TOV).
3. После approve дизайна оператором → ADR-0021 (deliverable C2) фиксирует mapping table «секция template → §brand-guide:line» для T2/T3/T4 required/optional.
4. Только после ADR-0021 approve — стартует EPIC-SERVICE-PAGES-REDESIGN (D1+ вёрстка).
5. Всё, чего нет в brand-guide на момент D1 запуска — расширяем сначала, потом верстаем (iron rule «brand-guide-first» из intake).

---

## Appendix · Удалённые ссылки

- `§15-29 shop` (line 3376-4781) — игнорим, удаляются в EPIC-SHOP-REMOVAL.W3
- `§31 auth-screens` (line 4884-5121) — для services template не используем (auth-flow живёт в exception-list §33.5)
- `§32 cabinet` (line 5122-5388) — для services template не используем; через guest-pill в header (§30.2) пользователь видит статус заявки без логина
- `§12 payload` (line 2755-3261) — для admin Payload, не паблик-сайт

## Appendix · Open questions для C2 wave

- Q1: Включаем ли `landshaft` как 5-й pillar в services-grid template? — Зависит от EPIC-SHOP-REMOVAL.W1 ADR-0020 (intake.md `blocked_by`). Default: ждём.
- Q2: B2B-форма (УК/ТСЖ) отдельная от B2C-lead-form? Сейчас в brand-guide одна форма. Кандидат — добавить B2B-вариант (multi-row inputs: ИНН + объект + объём + контактное лицо).
- Q3: Header colour/style на checkout (§33.5 exception)? Calculator photo→quote — это modal или отдельный URL? Решает ADR-0021.

---

_Документ — deliverable C1.a EPIC-SERVICE-PAGES-UX. После approve PO передаётся как референс в C2 (master template spec) и далее в EPIC-D (вёрстка)._
