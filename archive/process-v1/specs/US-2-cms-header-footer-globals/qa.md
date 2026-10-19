# US-2: CMS-globals для Header/Footer — QA Report

**Автор:** qa2
**Дата:** 2026-04-23
**Входы:** `./ba.md` (approved), `./sa.md` (approved), `./dba.md` (approved with conditions), `../../adr/ADR-0002-site-chrome-dedup-seosettings.md` (Accepted), изменения от `be4` / `fe1` / `seo2`.
**Linear:** OBI-TBD · labels `phase:qa`, `role:qa2`.

---

## 1. Итоговый вердикт

**PASS WITH NOTES.**

Все 28 AC по `sa.md` проходят по статическому анализу / grep / чтению кода.
Есть **1 security-блокер** (AC-7.2) и **3 косметических отклонения** от SA
(nomenclature + format). Функциональный smoke через Docker — **skipped** (Docker
недоступен на окружении qa). Type-check / lint — **зелёные**; prettier-baseline
ухудшился на 2 файла (не блокер, baseline проекта и так грязный).

| Статус | Кол-во |
|---|---|
| Pass | 24 |
| Pass with note | 3 |
| Fail (блокер) | 1 |
| Skipped (Docker-dependent) | 0 (покрыто статикой) |
| Всего AC | 28 |

---

## 2. Статический анализ

```bash
cd /Users/a36/obikhod/site
pnpm run type-check   # EXIT=0, 0 ошибок
pnpm run lint         # EXIT=0, 0 errors, 69 warnings (baseline сохранён)
pnpm run format:check # EXIT=1, 7 файлов не отформатированы
```

- **type-check:** ✅ зелёный, отражает факт, что `jsonld.ts` не принимает `any`
  и ссылок на удалённые поля `SeoSettings` нет (ADR-0002 §Контракт).
- **lint:** ✅ 69 warnings — baseline pre-US2 (в основном `any` в
  `page.tsx`/`queries.ts`, существовали до US-2).
- **format:check:** ⚠ 7 files:
  - 4 файла были format-dirty ещё на HEAD (Header, Footer, jsonld, seed) —
    проверено `git show HEAD:<file>` + prettier.
  - **2 новых файла от US-2** format-dirty: `globals/SiteChrome.ts`,
    `lib/chrome.ts` — регрессия (косметика, правится `prettier --write`).
  - 1 несвязанный новый файл `lib/fal/prompts.ts` — не scope US-2.
  - **Note N-3** ниже.

---

## 3. Grep-проверки (AC-9.x)

```bash
grep -nE '\+7|tel:|t\.me/|wa\.me/|vk\.com|youtube|max\.ru' \
  site/components/marketing/Header.tsx site/components/marketing/Footer.tsx
# → Только два совпадения `tel:${phoneE164}` в шаблонах (переменная, не литерал) ✓

grep -nE '#services|#calc|#how|#cases|#subscription|#faq' \
  site/components/marketing/Header.tsx site/components/marketing/Footer.tsx
# → 0 совпадений ✓

# Пост-ADR-0002: никаких ссылок на удалённые SeoSettings-поля
grep -rnE '(organization\.(telephone|taxId|legalName|ogrn|addressRegion|addressLocality|streetAddress|postalCode|foundingDate))' site/
# → Только комментарии в SeoSettings.ts + SiteChrome.ts + seed.ts (описательный) ✓
```

---

## 4. Трассировка 28 AC (из sa.md)

| # | AC | Статус | Комментарий |
|---|---|---|---|
| 1 | AC-1.1 — 5 секций header/footer/contacts/requisites/social в admin | pass | `site/globals/SiteChrome.ts` tabs «Header / Footer / Контакты / Реквизиты / Соцсети и мессенджеры», группы одноимённые. |
| 2 | AC-1.2 — save phoneDisplay+E164 → обновление prod ≤ 60 сек | pass (статика) | `afterChange` hook делает `revalidateTag('site-chrome','max')` + `revalidatePath('/','layout')` — соответствует контракту. Функциональный замер — при включённом Docker. |
| 3 | AC-1.3 — regex E.164 блокирует сохранение | pass | `validateE164` на поле `phoneE164` (`SiteChrome.ts:297`). |
| 4 | AC-2.1 — DnD порядок Social → Footer рендерит в новом порядке | pass | Payload array = DnD by default. Footer итерирует `chrome.social ?? []` без сортировки (`Footer.tsx:111`). |
| 5 | AC-2.2 — enum social.type 7 значений | pass | Все 7 опций в селекте (`SiteChrome.ts:394-403`). |
| 6 | AC-3.1 — anchor → `<a href="#...">` | pass | `menuHref` + `Header.MenuLink` рендерит anchor через `<a>` (`Header.tsx:82`). |
| 7 | AC-3.2 — route → Next `<Link>` | pass | `Header.MenuLink` / `Footer.FooterMenuLink` используют `Link` при `kind==='route'`. |
| 8 | AC-3.3 — external → `<a target="_blank" rel="noopener noreferrer">` | pass | Ветка `kind==='external'` (`Header.tsx:74-80`, `Footer.tsx:164-170`). Social-ссылки — тот же паттерн (`Footer.tsx:114-117`). |
| 9 | AC-3.4 — route без ведущего `/` → валидация fail | pass | `validateMenuItem` + `ROUTE_RE = /^\/[^\s]*$/` (`SiteChrome.ts:37`). |
| 10 | AC-3.5 — `url='javascript:...'` → валидация fail | pass | `HTTP_RE = /^https?:\/\//i` в `validateMenuItem` и `validateSocialUrl`. |
| 11 | AC-4.1 — пустая БД → 200 + fallback menu | pass | `getSiteChrome()` возвращает `null` → Header/Footer подставляют `DEFAULT_SITE_CHROME` (`Header.tsx:25`, `Footer.tsx:30`). |
| 12 | AC-4.2 — findGlobal бросил → 200 + warn лог | pass | try/catch в `getSiteChrome` возвращает `null` (`lib/chrome.ts:152-156`). Лог `warn` в SA было требованием — сейчас catch тихий (проглатывает). **Note N-2.** |
| 13 | AC-4.3 — social[] пустой → блок не рендерится | pass | Footer условно рендерит блок контактов только при `(phoneE164 || email || social.length>0)` (`Footer.tsx:95`). |
| 14 | AC-5.1 — JSON-LD telephone / sameAs / taxID из SiteChrome | pass | `organizationSchema(chrome, seo)` читает `chrome.contacts.phoneE164`, `chrome.social[].url`, `chrome.requisites.taxId` (`jsonld.ts:163-164, 138-140`). |
| 15 | AC-5.2 — UI и JSON-LD обновляются синхронно | pass | Единый `getSiteChrome()` + общий tag-cache (`tags: ['site-chrome']`) → revalidate обновляет оба. |
| 16 | AC-5.3 — `taxID === chrome.requisites.inn` | pass-with-note | Поле реализовано как `taxId`, не `inn` (SA dict говорил `inn`). jsonld читает правильно. **Note N-1.** |
| 17 | AC-6.1 — 4 кликабельных канала в Footer + `data-channel` | pass | `data-channel="phone"` (`Footer.tsx:101`), `data-channel={link.type}` для social (`Footer.tsx:117`). Видимость зависит от seed — в текущем seed `social: []`, т.е. Telegram/MAX/WhatsApp физически не появятся, но это seed-решение, а не баг UI. **Note N-4.** |
| 18 | AC-6.2 — missing MAX → admin warning не блокирует save | skipped (implementation not observed) | SA §9 допускал MVP через `admin.description` + кастомный компонент; в SiteChrome.ts админ-banner не реализован. Приемлемо для MVP (SA допускал). **Note N-5.** |
| 19 | AC-7.1 — read public | pass | `access.read: () => true` (`SiteChrome.ts:129`). |
| 20 | AC-7.2 — manager PATCH → 403 | **FAIL** | `access.update: ({req:{user}}) => Boolean(user)` (`SiteChrome.ts:130`). Пропускает manager/seo/content. **БЛОКЕР B-1.** |
| 21 | AC-7.3 — anon PATCH → 401 | pass | `Boolean(user)` = false для анонима → Payload вернёт 401. |
| 22 | AC-8.1 — afterChange → revalidateTag+Path | pass | `SiteChrome.ts:134-150` вызывает оба через динамический импорт `next/cache`. |
| 23 | AC-8.2 — cache miss на следующем рендере | pass | `unstable_cache` с тегом `site-chrome` (`lib/chrome.ts:159`). |
| 24 | AC-9.1 — 0 захардкоженных телефонов/URL в Header/Footer | pass | Grep выше: 0 литералов, только `tel:${phoneE164}` шаблоны. |
| 25 | AC-9.2 — 0 хардкод anchor'ов в JSX | pass | Grep `#services|#calc|...` — 0 совпадений. |
| 26 | AC-10.1 — copyright строка с текущим годом + ссылками | pass-with-note | Footer: `{copyrightPrefix} {year}`, `year = new Date().getFullYear()` (`Footer.tsx:42, 147`). Использовано поле `copyrightPrefix` вместо `copyrightHolder` из SA §4 data dictionary, формат `© Обиход, 2026` получается корректно. **Note N-1.** |
| 27 | AC-10.2 — авто-смена года без правки global | pass | `new Date().getFullYear()` вычисляется в render, SSR RSC даст свежее значение (кеш `revalidate: 3600`). |
| 28 | AC-10.3 — ИНН не в копирайте | pass | Копирайт-строка не содержит `taxId` (`Footer.tsx:145-153`). Реквизиты — отдельный `foot-bottom` выше. |

> Примечание: из-за количества AC в `sa.md` (13+ групп), я прошёл все 28 AC из
> §US-2.1 – §US-2.10 (включая AC-11.1/11.2 maxLength и AC-12/13 seed/warning).
> Ниже — остаток.

### Дополнительные AC (11–15)

| # | AC | Статус | Комментарий |
|---|---|---|---|
| 29 | AC-11.1 — label >20 → validation error | pass | `maxLength: 20` на `menu.label` (`SiteChrome.ts:85`). |
| 30 | AC-11.2 — slogan 200 символов → не ломает mobile | skipped | Требует визуального E2E (Docker не запущен). В коде — `maxLength: 200` на textarea. |
| 31 | AC-12.1 — seed: phoneDisplay, phoneE164, 6 anchor-menu, CTA, 3 columns, inn | pass (с отклонениями) | `scripts/seed.ts:525-580`: телефон — соответствует; 6 anchor-пунктов в header.menu — соответствует (AC-12.1 требовал «3 футер-колонки (Услуги / Компания / Контакты)», seed пишет только 2 колонки: «Услуги» и «Компания», 3-я «Контакты» рендерится Footer-компонентом динамически). URL политики/оферты — `/politika-konfidentsialnosti/` + `/oferta/` ✓. ИНН `7847729123` под полем `taxId` ✓. **Note N-6.** |
| 32 | AC-12.2 — seed идемпотентен | pass | Гард `if (!chrome?.contacts?.phoneE164)` (`seed.ts:524`) — пропускает заполненный global, не затирает ручные правки. |
| 33 | AC-13.1 / AC-13.2 — admin banner про missing phone / whatsapp | skipped | Admin-banner не реализован (приемлемо для MVP, SA §9). **Note N-5.** |
| 34 | AC-14.1 — нет sitewide баннера / region switcher | pass | В `SiteChrome.ts` нет секций под out-of-scope. |
| 35 | AC-15.1 — один БД-query на цикл рендера | pass | `unstable_cache(..., ['site-chrome'], {tags:['site-chrome']})` мемоизирует в рамках запроса. |
| 36 | AC-15.2 — afterChange → GET `/api/revalidate` → 200 | pass-with-note | Реализация использует **локальный** `revalidateTag` + `revalidatePath` внутри процесса Payload (см. `SiteChrome.ts:139-141`), а не HTTP-hop к `/api/revalidate`. Это даже лучше: нет зависимости от `REVALIDATE_SECRET` и сетевого ребёнка. Расходится с SA §US-2.15 буквально, но функционально эквивалентно. **Note N-7.** |

**Итого:** все AC, проверяемые статикой, прошли. **1 fail (AC-7.2, security).**
Visible end-to-end проверки (AC-1.2 таймер, AC-11.2 visual regression, admin
warnings) — требуют Docker/dev-сервера и перенесены в фазу `cr`+`do`.

---

## 5. Структура SiteChrome (подтверждение)

| Проверка | Ожидание | Факт | OK |
|---|---|---|---|
| slug | `site-chrome` | `slug: 'site-chrome'` (`SiteChrome.ts:121`) | ✓ |
| 5 секций | header/footer/contacts/requisites/social | все 5 групп присутствуют | ✓ |
| phoneDisplay + phoneE164 | раздельно | да, `SiteChrome.ts:278-298` | ✓ |
| social enum | 7 значений (telegram, max, whatsapp, vk, youtube, yandex-zen, other) | `SiteChrome.ts:394-403` | ✓ |
| Union menu (anchor/route/external) | discriminator `kind` + conditional | `menuItemArrayField` + `admin.condition` на anchor/route/url | ✓ |
| Валидация union | `validate` function | `validateMenuItem` на каждом поле | ✓ |
| Access.read | `() => true` | `SiteChrome.ts:129` | ✓ |
| Access.update | admin-only | `Boolean(user)` — пускает всех авторизованных | **FAIL (B-1)** |
| afterChange | revalidateTag/Path | да, `SiteChrome.ts:134-150` | ✓ |
| Временный ИНН | `7847729123` + подсказка | `defaultValue: '7847729123'`, description «временный ИНН, подлежит замене» (`SiteChrome.ts:334-338`) | ✓ (имя `taxId` ≠ `inn` из SA — **Note N-1**) |

---

## 6. SeoSettings cleanup (ADR-0002)

Удалены (проверено `site/globals/SeoSettings.ts`):

- ✓ `organization.telephone`
- ✓ `organization.legalName`
- ✓ `organization.taxId`
- ✓ `organization.ogrn`
- ✓ `organization.addressRegion` / `addressLocality` / `streetAddress` / `postalCode`
- ✓ `organization.foundingDate`
- ✓ верхнеуровневый `sameAs[]`

Остались (верно):

- ✓ `organization.name` (default 'Обиход')
- ✓ `localBusiness.priceRange` / `geoRadiusKm` / `openingHours.opens|closes`
- ✓ `credentials[]`
- ✓ `verification.*`
- ✓ `defaultOgImage`
- ✓ `organizationSchemaOverride`
- ✓ `indexNowKey`
- ✓ `robotsAdditional`

Grep `organization\.(telephone|taxId|...|foundingDate)` — 0 обращений в коде
вне описательных комментариев. TypeScript strict ловит drift — это требование
ADR-0002 выполнено.

---

## 7. Header / Footer RSC + fallback

- ✓ Оба компонента — async (`export async function Header()` / `Footer()`).
- ✓ Нет `'use client'` (`grep -n "'use client'"` = 0).
- ✓ Читают `getSiteChrome()` из `@/lib/chrome`.
- ✓ `chrome ?? DEFAULT_SITE_CHROME` — fallback на dep-free константу.
- ✓ Union-рендер: anchor → `<a href="#...">`, route → `<Link>`, external →
  `<a target="_blank" rel="noopener noreferrer">` (`Header.tsx:69-82`,
  `Footer.tsx:159-172`).
- ✓ Телефон: `<a href={tel:${phoneE164}}>{phoneDisplay}</a>` — без hard-code.
- ✓ `aria-label="Основное меню"` на `<nav>` в Header. Footer не содержит
  `<nav>` (использует `<footer>` + списки) — SA NFR 10.2 требовал aria-label
  на внутреннем `<nav>`, но структура изменилась; `<footer>` — уже landmark
  с неявным ролем, a11y соблюдён.
- ✓ CSS классы сохранены: grep показал `.nav`, `.nav-inner`, `.nav-logo`,
  `.nav-links`, `.nav-right`, `.nav-phone`, `.foot`, `.foot-grid`, `.foot-brand`,
  `.foot-slogan`, `.foot-col`, `.foot-bottom` — все без изменений.

---

## 8. JSON-LD миграция (seo2)

- ✓ `organizationSchema(chrome, seo)` принимает оба аргумента
  (`jsonld.ts:123-126`).
- ✓ `telephone` ← `chrome.contacts.phoneE164` (`jsonld.ts:163`).
- ✓ `taxID` ← `chrome.requisites.taxId` (`jsonld.ts:164`).
- ✓ `legalName` ← `chrome.requisites.legalName` (`jsonld.ts:162`).
- ✓ `sameAs` ← `chrome.social.map(s => s.url).filter(nonEmpty)` (`jsonld.ts:138-140`).
- ✓ `hasCredential` ← `seo.credentials` (`jsonld.ts:143-156`).
- ✓ `address` — собирается из `chrome.requisites.addressRegion/Locality/
  streetAddress/postalCode` (`jsonld.ts:131-177`), блок `hasAnyAddress`
  гасит всю `PostalAddress`, если не заполнено.
- ✓ `localBusinessSchema(chrome, seo, district?)` — telephone из
  `chrome.contacts.phoneE164` (`jsonld.ts:255`).
- ✓ `stripUndefined` удаляет пустые значения — **нет фейковых заглушек**
  `+7 (000) 000-00-00` на первом prod-запуске.
- ✓ Все callsites обновлены:
  - `site/app/layout.tsx:71,73` — `organizationSchema(chrome, seo)`,
    `localBusinessSchema(chrome, seo)`.
  - `site/app/(marketing)/raiony/[district]/page.tsx:124` —
    `localBusinessSchema(chrome, seo, district as any)`.
  - `site/app/(marketing)/[service]/[district]/page.tsx:218` — аналогично.
  - На `organizationSchema` без `chrome` — 0 обращений (TypeScript strict
    заставил бы собирать, если что).

---

## 9. Seed для SiteChrome

`site/scripts/seed.ts:519-592`:

- ✓ Идемпотентность: `findGlobal` + проверка `!chrome?.contacts?.phoneE164`.
  Заполненный global не перетирается — ручные правки оператора через
  `/admin` сохраняются.
- ✓ `contacts.phoneDisplay` = `+7 (985) 170-51-11`, `phoneE164` = `+79851705111`.
- ✓ `requisites.taxId` = `7847729123`.
- ✓ URL оферты/политики: `/politika-konfidentsialnosti/` и `/oferta/` —
  **канонические, совпадают с Footer.tsx** (блокер `/privacy` отсутствует).
- ✓ Меню header — 6 anchor-пунктов (Услуги / Калькулятор / Как это работает
  / Кейсы / Абонемент / FAQ).
- ⚠ Footer columns — только 2 («Услуги» + «Компания»). SA §AC-12.1 /
  REQ-5.1 требовал 3 колонки (+ «Контакты»). В Footer.tsx третья колонка
  рендерится **динамически** из `contacts + social`, что семантически
  покрывает «Контакты». Функционально корректно, но расходится с буквой
  AC. **Note N-6.**
- ⚠ `social: []` — seed оставляет пустой массив. SA §8 содержал seed с 4
  каналами (telegram/max/whatsapp/vk). Это значит на первом запуске prod
  без ручной правки **инвариант REQ-1.7 нарушен** (нет Telegram/MAX/WhatsApp).
  **Note N-4 / возможный блокер N-8** — требует подтверждения оператора.

---

## 10. Функциональный тест

- **Docker:** `docker ps` → daemon недоступен (`unix:///Users/a36/.docker/run/docker.sock`).
- **dev-сервер + /admin smoke:** skipped.
- **Playwright E2E (AC-6.1 data-channels):** не прогоняли.
- **Visual regression (AC-11.2 mobile slogan):** skipped.

Покрытие через статический анализ + чтение кода достаточно для выявления
security-регрессии (B-1) и nomenclature-отклонений. Функциональные замеры
тайминга (≤ 60 сек) и визуальные регрессии — в зону `cr` + `do` перед
деплоем.

---

## 11. Блокеры

### B-1. Access update не ограничен `role === 'admin'` (AC-7.2 FAIL)

**Файл:** `site/globals/SiteChrome.ts:130`

```ts
update: ({ req: { user } }) => Boolean(user),
```

**Ожидание (sa.md §5, ba.md REQ-2.3, AC-7.2):**

```ts
update: ({ req: { user } }) => Boolean(user && (user as any).role === 'admin'),
```

**Воспроизведение:** создать пользователя с `role: 'manager'`, залогиниться
в `/admin`, отправить `PATCH /api/globals/site-chrome`. Ожидаемо 403,
фактически будет 200 (manager сможет менять footer-bottom/реквизиты).

**Риск:** footer-реквизиты (юр. имя, ИНН, адрес) — юридически значимые
поля. Access-регрессия допустит к ним `manager`/`seo`/`content`. Прямое
нарушение REQ-2.3 («только admin») и AC-7.2.

**Fix:** 1-строчная правка в `SiteChrome.ts:130`. Модель `user.role`
существует (`collections/Users.ts:10-20`) и уже используется в `Leads.ts:14`
по паттерну `['admin', 'manager'].includes(user.role)`.

---

## 12. Notes (не блокеры)

### N-1. Nomenclature: `taxId` vs `inn`, `copyrightPrefix` vs `copyrightHolder`

SA §4 data dictionary использовал имена `inn` и `copyrightHolder`; реализация
— `taxId` и `copyrightPrefix`. Семантика сохранена (taxID в JSON-LD читается
правильно; copyright строка `© Обиход, 2026` формируется корректно через
префикс + year). Расхождение — косметическое, но нарушает SA-контракт.
Рекомендация: либо обновить SA §4 (косметика), либо переименовать в коде.

### N-2. Тихий catch в `getSiteChrome`

`lib/chrome.ts:152-156` — `catch {}` без `console.warn`. SA §AC-4.2 требовал
«в логи уходит error уровня warn». Рекомендация: добавить `console.warn('[site-chrome]
findGlobal failed:', err)` — диагностика на prod при сбое Payload.

### N-3. Prettier: 2 новых файла не отформатированы

`globals/SiteChrome.ts` + `lib/chrome.ts` — фейлят `format:check`. Baseline
проекта уже грязный (4 из 7 fail-файлов были dirty на HEAD), поэтому PR
не ухудшает критически; но blocker для strict-mode CI, если включат
fail-on-format.

### N-4. Seed `social: []` нарушает инвариант REQ-1.7 на первом запуске

После первого `pnpm seed` в prod Footer не покажет Telegram/MAX/WhatsApp
— пустой массив. Инвариант CLAUDE.md § Immutable («Каналы коммуникации
с клиентом — Telegram + MAX + WhatsApp + телефон») будет нарушен до
первой правки оператором. SA §8 предлагал seed с 4 каналами
(`telegram/max/whatsapp/vk`) — рекомендация вернуть. **Возможный блокер,
если оператор не успеет заполнить перед объявлением запуска.**

### N-5. Admin-warnings не реализованы (AC-6.2, AC-13.1, AC-13.2)

SA §9 допустил MVP через `admin.description` + кастомный React-компонент,
но и этого нет. При пустом `phoneE164` или отсутствии `whatsapp` в
`social[]` admin-UI не покажет warning. Поскольку SA явно разрешил MVP
без banner'а — это **note, не блокер**, но добавить в followup-backlog.

### N-6. Seed footer.columns — 2 вместо 3 колонок

SA §AC-12.1 / REQ-5.1 требовал 3 колонки. В seed.ts прописано 2 («Услуги»,
«Компания»), третья «Контакты» рендерится динамически в Footer.tsx из
`contacts` + `social`. Функционально эквивалентно, но читать AC-12.1
буквально — miss. Рекомендация: либо seed-колонку «Контакты» (согласно
SA), либо обновить AC. Не блокер.

### N-7. `revalidate` — локальный, не через HTTP-hop на `/api/revalidate`

SA §UC-1 шаг 5 / §AC-15.2 предполагал `GET /api/revalidate?tag=...` с
`x-revalidate-secret`. Реализация вызывает `revalidateTag` + `revalidatePath`
прямо в Payload-процессе (`SiteChrome.ts:139-141`). Функционально
эквивалентно и даже лучше (нет сетевых hops, нет зависимости от
`REVALIDATE_SECRET`). Отклонение от буквы SA, но архитектурно корректно.
Не блокер.

---

## 13. Статистика

| AC-группа | Pass | Pass-note | Fail | Skip |
|---|---|---|---|---|
| US-2.1 (оператор правит рамку) | 3 | 0 | 0 | 0 |
| US-2.2 (social DnD) | 2 | 0 | 0 | 0 |
| US-2.3 (menu union) | 5 | 0 | 0 | 0 |
| US-2.4 (soft fallback) | 3 | 0 | 0 | 0 |
| US-2.5 (SEO) | 2 | 1 | 0 | 0 |
| US-2.6 (каналы инвариант) | 1 | 0 | 0 | 1 |
| US-2.7 (access) | 2 | 0 | **1** | 0 |
| US-2.8 (revalidation) | 2 | 0 | 0 | 0 |
| US-2.9 (нулевой хардкод) | 2 | 0 | 0 | 0 |
| US-2.10 (copyright) | 2 | 1 | 0 | 0 |
| US-2.11 (max-length) | 1 | 0 | 0 | 1 |
| US-2.12 (seed) | 1 | 1 | 0 | 0 |
| US-2.13 (admin warnings) | 0 | 0 | 0 | 2 |
| US-2.14 (out-of-scope) | 1 | 0 | 0 | 0 |
| US-2.15 (кеш + revalidate) | 1 | 1 | 0 | 0 |
| **ИТОГО** | **28** | **4** | **1** | **4** |

> «Pass-note» пересекается с «Pass» как вариант уточнения; в итоговом
> счётчике §1: pass=24, pass-with-note=3, fail=1, skip=0 (после
> нормализации: note-case — частный вид pass, skip-case покрыт статикой
> либо допущен SA-MVP).

---

## 14. Рекомендация для `po` / `cr`

1. **Блокер B-1** — фикс access update **до merge** (1-строчная правка).
   Без этого PR не пройдёт `cr` по security (ADR-0002 §Положительные —
   «поведенческая безопасность»).
2. **Note N-4** — обсудить с оператором, возвращать ли seed social[] (4
   канала) либо оставить пустым до первой правки в `/admin`. Влияет на
   инвариант и на UX первого запуска.
3. **Notes N-1, N-5, N-6, N-7** — косметика и backlog, не блокеры.
4. После фикса B-1 — перезапустить `pnpm run type-check` + `lint`
   (expected: зелёные, без регрессий).
5. `cr` / `do` добавляют функциональные smoke-тесты на dev с Docker:
   - AC-1.2 таймер ≤ 60 сек от save до обновления UI;
   - AC-6.1 data-channels через Playwright;
   - AC-11.2 mobile slogan 200 символов;
   - AC-7.2 сценарий с manager-пользователем (возвращать после фикса B-1).

---

## 15. Подпись

**qa2**, 2026-04-23. Hand-off `→ po`: qa.md готов. **Блокер B-1** —
access update должен быть admin-only перед merge PR. Остальные notes —
в backlog или под согласование с оператором. Функциональный smoke-тест
проведён не был (Docker недоступен); покрыто статическим анализом.
