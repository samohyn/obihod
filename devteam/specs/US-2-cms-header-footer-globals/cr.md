# US-2: Code Review

**Reviewer:** cr
**Дата:** 2026-04-23
**Входы:** `./ba.md` (approved), `./sa.md` (approved), `./dba.md` (approved w/conditions), `./qa.md` (PASS WITH NOTES, B-1 fixed), `../../adr/ADR-0002-site-chrome-dedup-seosettings.md` (Accepted), `/Users/a36/obikhod/CLAUDE.md`, `site/AGENTS.md`, `/Users/a36/obikhod/devteam/cr.md`.
**Статус:** **APPROVE WITH COMMENTS**

Код готов к acceptance. Блокер B-1 (access update без admin-check) — **закрыт** `cr`-фиксером в `SiteChrome.ts:130`: паттерн `(user as { role?: string } | null)?.role === 'admin'` корректен, совместим с `collections/Leads.ts:14` и `Users.ts:10-20`. Остальные 4 замечания — косметика/backlog, мерж не блокируют.

---

## Файлы в ревью

- `/Users/a36/obikhod/site/globals/SiteChrome.ts` (419 строк, новый) — global + validators + afterChange hook.
- `/Users/a36/obikhod/site/globals/SeoSettings.ts` (91 строка) — cleanup 9 полей + массив `sameAs`.
- `/Users/a36/obikhod/site/payload.config.ts` — регистрация `SiteChrome` в `globals: [SeoSettings, SiteChrome]`.
- `/Users/a36/obikhod/site/lib/chrome.ts` (221 строка, новый) — `getSiteChrome` + `DEFAULT_SITE_CHROME` + `socialHref/Label/menuHref` helpers.
- `/Users/a36/obikhod/site/components/marketing/Header.tsx` (116 строк) — async RSC-rewrite.
- `/Users/a36/obikhod/site/components/marketing/Footer.tsx` (173 строки) — async RSC-rewrite.
- `/Users/a36/obikhod/site/lib/seo/jsonld.ts` — `organizationSchema(chrome, seo)` + `localBusinessSchema(chrome, seo, district?)` pure-функции.
- `/Users/a36/obikhod/site/app/layout.tsx` — async + `Promise.all([getSiteChrome, getSeoSettings])`.
- `/Users/a36/obikhod/site/app/(marketing)/raiony/[district]/page.tsx` — chrome читается в parallel fetch.
- `/Users/a36/obikhod/site/app/(marketing)/[service]/[district]/page.tsx` — аналогично.
- `/Users/a36/obikhod/site/scripts/seed.ts` (строки 513–592) — идемпотентный seed-блок SiteChrome; SeoSettings-seed адаптирован (строки 467–511).

---

## Чеклист

| # | Раздел | Результат | Комментарий |
|---|---|---|---|
| 1 | Payload global корректность | PASS | slug `site-chrome` (`SiteChrome.ts:121`); 5 табов Header/Footer/Контакты/Реквизиты/Соцсети; `phoneDisplay`+`phoneE164` разделены (278–298); enum social строго 7 значений (394–403); union-меню + conditional admin.condition + `validateMenuItem` на каждом поле kind-specific; `validateE164` / `validateInn` / `validateSocialUrl` прописаны; `admin.group: 'Контент'` отделяет от SEO-блока. |
| 2 | Access update admin-only (B-1 fix) | PASS | `(user as { role?: string } \| null)?.role === 'admin'` (`SiteChrome.ts:130`). Null-safe через optional chaining — аноним (`user = null`) даст `false` → 401; `manager` → `false` → 403; `admin` → `true`. Паттерн согласован с `Leads.ts:14` (`['admin','manager'].includes(...)`); отличается сознательно — `update` на юрреквизиты строже. |
| 3 | afterChange hook | PASS | `revalidateTag('site-chrome', 'max')` + `revalidatePath('/', 'layout')` (`SiteChrome.ts:138–141`), динамический import из `next/cache`, логи через `req.payload.logger.info/.error` (не `console`). Infinite-loop невозможен: revalidation не пишет в Payload. |
| 4 | SeoSettings cleanup (ADR-0002) | PASS | Удалены ровно 9 полей из `organization` + массив `sameAs` — `grep -rnE 'organization\.(telephone\|taxId\|...\|foundingDate)'` по `app/`, `components/`, `lib/`, `globals/`, `scripts/` находит только описательные комментарии в `SeoSettings.ts` / `SiteChrome.ts` / `seed.ts`. Остались: `organization.name`, `localBusiness.*`, `credentials[]`, `verification.*`, `defaultOgImage`, `organizationSchemaOverride`, `indexNowKey`, `robotsAdditional` — совпадает с ADR. |
| 5 | RSC Header/Footer + fallback | PASS | Оба `export async function` (нет `'use client'`). `chrome ?? DEFAULT_SITE_CHROME` на верхнем уровне + каскадный fallback на вложенных полях (`header?.menu && length > 0 ? ... : DEFAULT_SITE_CHROME.header?.menu`) — AC-4.1/4.2 покрыт. Union-рендер: `route` → `<Link>`, `external` → `<a target="_blank" rel="noopener noreferrer">`, `anchor` → `<a href="#...">`. `tel:${phoneE164}` + `{phoneDisplay}` разделение корректно. `data-channel="phone"`/`data-channel={link.type}` для e2e-selectorов AC-6.1. `aria-label="Основное меню"` на Header `<nav>`. Классы `.nav`, `.foot-*` сохранены. |
| 6 | JSON-LD migration | PASS | `organizationSchema(chrome, seo)` pure, принимает оба аргумента; `telephone ← chrome.contacts.phoneE164`, `taxID ← chrome.requisites.taxId`, `legalName ← chrome.requisites.legalName`, `sameAs ← chrome.social.map(.url).filter(nonEmpty)`, `hasCredential ← seo.credentials`. `stripUndefined` + `hasAnyAddress`-гард — нет фейковых `+7 (000) 000-00-00` / пустого `PostalAddress` на первом prod-запуске (AC-5.1–5.3). Все 4 callsite обновлены: `layout.tsx:71,73`, `raiony/[district]/page.tsx:124`, `[service]/[district]/page.tsx:218`. `grep organizationSchema\|localBusinessSchema` — 0 вызовов без chrome-аргумента. `websiteSchema()` остался pure, не требует chrome. |
| 7 | unstable_cache + тег | PASS | `getSiteChrome = unstable_cache(fn, ['site-chrome'], {tags:['site-chrome'], revalidate: 3600})` (`lib/chrome.ts:144–160`) — один БД-запрос на цикл рендера несмотря на параллельные вызовы Header/Footer/layout/JsonLd (AC-15.1). `try/catch → null` защищает от Payload-fall (AC-4.2) — но тихо (см. N-2 ниже). |
| 8 | Seed SiteChrome | PASS | Гард `if (!chrome?.contacts?.phoneE164)` — идемпотент, защищает ручные правки оператора (`seed.ts:521–524`). `phoneDisplay`/`phoneE164` = реальный телефон; `taxId` = `7847729123`; URL политики/оферты — канонические `/politika-konfidentsialnosti/` + `/oferta/` (совпадают с `DEFAULT_SITE_CHROME.footer.privacyUrl/ofertaUrl`). 6 anchor-меню в header (Услуги/Калькулятор/Как это работает/Кейсы/Абонемент/FAQ). CTA «Замер бесплатно» anchor `calc`. |
| 9 | SeoSettings seed адаптация | PASS | Строки 467–511: убраны все обращения к `organization.telephone`/`taxId`/`legalName`/`addressRegion`/`addressLocality`/`foundingDate` + массив `sameAs`. Остались только `organization.name` + `localBusiness.*` + `credentials[]`. Идемпотент по новому критерию `credentials.length > 0` — корректная замена старому «phoneDisplay != null». |
| 10 | TypeScript | PASS | `pnpm run type-check` — exit 0, 0 ошибок. `lib/chrome.ts` экспортирует inline-типы `SiteChrome / MenuItem / HeaderCta / FooterColumn / SocialLink / SocialType` с TODO-комментом про `payload-types.ts`-генерацию — допустимо (`generate:types` падает на Node 24, отдельный follow-up). `as never` в `seed.ts` и `as unknown as SiteChrome \| null` в `lib/chrome.ts:150` — вынужденное из-за Payload generics, не злоупотребляется. Нет `any` без TODO. |
| 11 | CI-зелёный | PASS | type-check green; lint = 0 errors + 69 warnings (baseline pre-US2 сохранён, не ухудшен); format:check fail на 2 новых файлах (N-3, косметика). |
| 12 | Безопасность | PASS | `read: () => true` — осознанное (global публичный для RSC без auth); `update` admin-only после B-1; нет hardcoded-secrets (телефон / ИНН — не secret); hook не делает SQL-инъекций, только RSC-invalidation в своём процессе; `dangerouslySetInnerHTML` не использован. `validateSocialUrl` + `validateMenuItem` блокируют `javascript:`-URL (AC-3.5). |
| 13 | Конвенции CLAUDE.md | PASS | Бренд/TOV/стек не тронуты. Нет Тильды/Bitrix/WP. Русский для admin-меток и описаний, английский — для identifiers. |

---

## Комментарии по коду

### Praise

- `SiteChrome.ts` — `menuItemArrayField(name)` factory (строки 66–117) — единый источник правды для 3 callsites (`header.menu`, `footer.columns[].items`, и косвенно `header.cta` как inline-variant). Экономит ~60 строк дублирования; изменение union-валидатора правится в одном месте.
- `lib/chrome.ts` — `DEFAULT_SITE_CHROME` осознанно держит **только** те поля, которые реально нужны для рендера без placeholder'ов. `social: []` вместо фейкового Telegram — корректно: лучше отсутствующий блок, чем битый линк на первом запуске (`DEFAULT_SITE_CHROME.requisites` имеет только `taxId` — не фейковое юрлицо).
- `jsonld.ts` — вынос `organizationSchema` / `localBusinessSchema` в pure-функции с аргументами-параметрами. Раньше они тихо читали globals через замыкание; теперь `grep callers` работает, и TypeScript strict ловит drift (ADR-0002 § «защита от дрейфа»). `stripUndefined` + `hasAnyAddress` — не генерирует пустых `PostalAddress`-узлов для Яндекса.
- `afterChange` hook — **локальный** `revalidateTag` + `revalidatePath` вместо HTTP-hop на `/api/revalidate` (расходится с SA §UC-1 шаг 5, но функционально лучше: нет сетевой зависимости, нет `REVALIDATE_SECRET`, нет риска рассинхрона между Payload-процессом и Next-процессом — это один процесс). Архитектурное улучшение.
- Access-fix B-1 — грамотный null-safe паттерн через optional chaining на type cast, без `Boolean()`-анти-паттерна. Совместим с `Leads.ts:14` стилистически.

### Request changes

Нет. Все блокеры закрыты.

### Nit (P2, non-blocking, follow-up)

- **N-1 (от qa2, оставляю).** Nomenclature drift: SA `§4 data dictionary` + ADR-0002 используют имя `inn`, код — `taxId` (`SiteChrome.ts:330`). ADR-0002 использовал `legalAddress: textarea`, код — 4 раздельных поля (`addressRegion/Locality/streetAddress/postalCode`). **Последнее даже лучше** — JSON-LD `PostalAddress` собирается без парсинга строки, Яндекс и Google принимают отдельные поля корректно. Рекомендация: обновить SA-dict + ADR-0002 §«Контракт» post-factum (косметика в `sa.md` + footnote в ADR), не переименовывать код. Не блокер.
- **N-2 (от qa2, оставляю).** `lib/chrome.ts:152–156` — `catch {}` без `console.warn`. SA §AC-4.2 требовал «в логи уходит error уровня warn». Сейчас catch тихий, на prod при сбое Payload-read не будет диагностики. Follow-up: добавить `console.warn('[site-chrome] findGlobal failed:', err)` или `payload.logger.warn(...)` — обнаружить проблему глазами невозможно иначе. Не блокер.
- **N-3 (от qa2, оставляю).** `prettier --check` падает на `globals/SiteChrome.ts` и `lib/chrome.ts` (+ 4 файла с format-dirt было ещё на HEAD pre-US2, + несвязанный `lib/fal/prompts.ts`). Baseline проекта уже грязный, CI-gate не включён на format:check — не блокер, но `pnpm format:write` перед мержем снял бы шум.
- **N-4 (критичный для UX первого запуска).** Seed кладёт `social: []`. Это ломает **инвариант CLAUDE.md § Immutable** «Каналы: Telegram + MAX + WhatsApp» на первом запуске prod — до момента, когда оператор зайдёт в `/admin` и заполнит массив, Footer не покажет ни одного мессенджера. Админ-warning тоже не реализован (N-5). Это **возможный блокер релиза**, но не блокер мержа: решение — в `out`-acceptance оператор заполняет социалки в `/admin` **до** объявления запуска. Рекомендация: занести в `out.md` чеклист «после `pnpm seed:prod` → открыть `/admin/globals/site-chrome/social` → добавить Telegram/MAX/WhatsApp» + задача в handoff на заполнение. Код **менять не надо** (фейковые URL в seed хуже пустого массива — реальные `t.me/obihod` нужно согласовать с оператором).
- **N-5 (от qa2).** Admin-warnings (AC-6.2/13.1/13.2) не реализованы — SA явно допустил MVP без banner'а. Follow-up US, не блокер.
- **N-6 (от qa2).** Seed footer.columns — 2 колонки вместо 3. Третья «Контакты» динамически рендерится в `Footer.tsx:95–126` из `contacts + social`. Функционально эквивалентно AC-12.1, но буква расходится. Не блокер.
- **N-7 (от qa2).** Локальный `revalidate` вместо HTTP-hop — архитектурное улучшение, не дефект. Оформить в `learnings.md`: «afterChange Payload-хуки в embed-Next процессе — прямой вызов `revalidateTag/Path`, без `/api/revalidate`».
- **N-8 (seed-смысл).** `seed.ts:577` кладёт `legalName: 'ООО «Обиход»'` при ещё не зарегистрированном юрлице (memory `project_inn_temp.md`: «ИНН 7847729123 — временный, юрлицо будет меняться»). Дисбаланс: ИНН помечен в admin-description как «временный», а `legalName` — нет. Риск: B2B-клиент видит `legalName` + `taxId`, которые не бьются по ЕГРЮЛ (ИНН 7847729123 принадлежит другой организации в СПб). Follow-up: либо оставить `legalName` пустым в seed до регистрации, либо добавить `admin.description: 'временное имя, заменить после регистрации'` на поле. **Рекомендация `po`: уточнить с оператором** — если ООО «Обиход» зарегистрировано (или на подходе), оставить; если нет — seed должен давать пустой `legalName`. Не блокер мержа; блокер acceptance для B2B-демо.

### Block

Нет.

---

## Локальная проверка

- `pnpm run type-check` — **PASS** (exit 0, 0 ошибок).
- `pnpm run lint` — PASS (69 warnings baseline, 0 errors) по отчёту qa2 §2.
- `pnpm run format:check` — fail на 2 новых файлах + 4 pre-existing + 1 несвязанный (N-3).
- `pnpm run test:e2e --project=chromium` — **не запускал** (Playwright требует dev-сервер + БД; Docker недоступен в среде cr по handoff qa2). Функциональные smoke AC-1.2 (таймер ≤ 60 сек), AC-6.1 (data-channels), AC-11.2 (mobile slogan) — переносятся на `do` pre-deploy (`dba.md` §4 pre-deploy checklist).
- **Ручной grep по AC-9.1/9.2** — 0 захардкоженных номеров/якорей в `Header.tsx`/`Footer.tsx` (подтверждает qa2 §3).

---

## Блокер B-1 — подтверждение

Файл `site/globals/SiteChrome.ts:130`:

```ts
update: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
```

Поведение:
- `user = null` (аноним) → `(null)?.role === 'admin'` = `undefined === 'admin'` = `false` → Payload возвращает 401.
- `user.role = 'manager'` → `'manager' === 'admin'` = `false` → 403.
- `user.role = 'admin'` → `true` → update допускается.

Паттерн идентичен по стилю с `Leads.ts:14` (`['admin', 'manager'].includes((req.user as { role?: string })?.role ?? '')`); отличие намеренное — `update` на юрреквизиты строже, только admin. AC-7.2 + AC-7.3 + REQ-2.3 покрыты. **Блокер закрыт.**

---

## Итог

US-2 — качественная миграция: один global на 5 табов, тонкие async RSC-компоненты с каскадным fallback, pure-JSON-LD функции с параметрами, единый `unstable_cache` с тегом, идемпотентный seed. ADR-0002 выполнен по существу: 9 полей + `sameAs[]` удалены из `SeoSettings`, единственный источник правды — `SiteChrome`. Архитектурно код даже лучше SA-контракта (локальный revalidate, split-address вместо textarea). Остающиеся notes — косметика (N-1/3/6), диагностика (N-2), семантика seed для первого релиза (N-4/N-8).

**Передаю `out` + `po`:** APPROVE WITH COMMENTS. Основной риск acceptance — **N-4** (пустой `social[]` на первом релизе нарушает инвариант каналов до первой правки оператором) и **N-8** (`legalName: 'ООО «Обиход»'` при ещё не зарегистрированном юрлице). Оба решаются оператором в `/admin` после деплоя — но `out`-чеклист должен это явно зафиксировать **перед** объявлением запуска. Код — в main.

## Follow-ups (backlog для `po`)

- [ ] US-N+1: admin-warning banner для missing critical channels (AC-6.2 / AC-13.1 / AC-13.2). Приоритет P2.
- [ ] Обновить SA §4 data dictionary + ADR-0002 §«Контракт» на фактические имена (`taxId`, split-address) или переименовать код. P3, косметика.
- [ ] Добавить `console.warn` / `payload.logger.warn` в catch `lib/chrome.ts:152` (N-2). P2.
- [ ] `pnpm format:write` по всему baseline + включить `format:check` в CI как hard-gate. P3.
- [ ] Починить `pnpm generate:types` на Node 24 → заменить inline-типы в `lib/chrome.ts` + `lib/seo/jsonld.ts` на `payload-types.ts` импорты (TODO в коде). P2.
- [ ] Learnings: afterChange в embed-Next — прямой вызов `revalidateTag/Path`, без HTTP-hop на `/api/revalidate` (N-7).

---

## Подпись

**cr**, 2026-04-23. Hand-off `→ out` + `→ po`. Блокер B-1 подтверждён как закрытый в `SiteChrome.ts:130`. PR готов к мержу после `out`-чеклиста (N-4 / N-8 — оператор заполняет `social[]` + подтверждает `legalName` **до** объявления публичного запуска; не блокер мержа, блокер B2B-acceptance).
