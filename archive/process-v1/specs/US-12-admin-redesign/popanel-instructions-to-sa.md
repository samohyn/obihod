---
from: popanel
to: sa-panel
date: 2026-04-28
phase: A · spec-parallel
---

# Задание sa-panel — 4 wave-спеки параллельно

## Контекст

ADR-0005 Admin Customization Strategy закрыт `tamd`'ом ([team/adr/ADR-0005-admin-customization-strategy.md](../../adr/ADR-0005-admin-customization-strategy.md), Linear [PAN-2 Done](https://linear.app/samohyn/issue/PAN-2)). Wave 2 unblocked. **Запускаем 4 wave-спеки параллельно** (Phase A · spec-parallel из roadmap [note-popanel.md](note-popanel.md)).

Spec-before-code iron rule: dev/qa/cr НЕ стартуют, пока я (popanel) не одобрил `sa-panel-wave-N.md`. Каждая спека идёт через мой gate отдельно.

## Источники истины (читать ПЕРЕД написанием спеки)

1. [design-system/brand-guide.html §12](../../../design-system/brand-guide.html) — визуальный mockup всех 8 экранов (12.1 Login, 12.2 Layout, 12.3 Dashboard+PageCatalog, 12.4 Edit-tabs, 12.5 Empty/Error/403, 12.4.1 token-map). **Обязательно** открыть HTML в браузере, не только текст.
2. [art-concept-v2.md](art-concept-v2.md) — 13 разделов anatomy + token-map.
3. [art-brief-ui.md](art-brief-ui.md), [art-brief-ux.md](art-brief-ux.md), [art-brief-cw.md](art-brief-cw.md) — для cw / ux / ui spec.md.
4. [ADR-0005](../../adr/ADR-0005-admin-customization-strategy.md) — 3-уровневая стратегия кастомизации, versioning, rollback. **Каждая спека обязана указать какой уровень используется** (CSS / React / native).
5. [site/app/(payload)/custom.scss](../../../site/app/(payload)/custom.scss) — 375 строк Wave 1 + комментарии-anchors на §brand-guide.
6. [site/components/admin/](../../../site/components/admin/) — 9 React-компонентов уже на проде.
7. [note-po.md](note-po.md) — записка от art (старая, до v2 рестракта).
8. [note-popanel.md](note-popanel.md) — моя записка с roadmap.

## Общий формат каждой `sa-panel-wave-N.md`

Используй стандартный sa-template + следующие обязательные секции под US-12:

```markdown
# sa-panel — Wave N · <название>

**Issue:** [PAN-X](url)
**Wave:** N из roadmap art-concept-v2 §10
**Source of truth:** brand-guide.html §12.X · art-concept-v2 §X · ADR-0005

## ADR-0005 уровень кастомизации
<какой уровень: CSS-only / React `admin.components.*` / mix; почему>

## Scope IN
<что входит в Wave>

## Scope OUT (отдельные Wave/US)
<что НЕ делаем>

## Architecture (контракты)
<endpoints / схемы / TypeScript types — для be-panel/fe-panel оба>

## UI states (mapping на §12)
<default / hover / active / loading / success / error / disabled — каждое со ссылкой на §12.X.X>

## Acceptance Criteria
- [ ] sa-panel-wave-N.md одобрен popanel
- [ ] AC из Linear PAN-X
- [ ] ADR-0005 follow-ups (см. ниже на каждый Wave)
- [ ] Visual review ux-panel vs §12 mockup
- [ ] cr-panel approve
- [ ] Playwright smoke зелёный

## Open questions для popanel
<если есть — пинг до начала dev>

## Dev breakdown
<sub-tasks для be-panel / fe-panel / cw / ux-panel — кто что делает в днях>
```

---

## Конкретно по Wave'ам — приоритет parallel

### Wave 2 · AdminLogin magic link через Telegram ([PAN-5](https://linear.app/samohyn/issue/PAN-5))

**Объём:** 2 чд (be-panel 1.5 + fe-panel 0.5)
**Status:** unblocked после PAN-2 Done
**Приоритет:** P1 — старт первым, magic link нужен оператору для безопасного входа

**Обязательные ADR-0005 follow-ups в spec'е:**
1. **Magic link backend → REST endpoint + Payload collection MagicLinkTokens**, не замена Payload auth core (ADR-0005 §3 Уровень 3 — auth core НЕ трогаем).
2. **`views.Login` custom view** через `admin.components.views.Login` — Уровень 2 React (ADR-0005). Тонкий слой: только верстка + email field + submit. Никаких import'ов глубже первого уровня `@payloadcms/ui`.
3. **Email fallback** — обязателен. Pre-condition: проверить что Beget SMTP исходящие письма работают для `obikhod.ru` (SPF / DKIM настроены). Если не настроены — отдельный issue для `do` ДО старта Wave 2 dev.
4. **Brute-force protection** — 5 requests/IP/hour. Использовать Payload Local API rate-limiter или Redis (если уже есть).
5. **Token security** — 32-byte URL-safe, `crypto.randomBytes(32).toString('base64url')`, single-use, TTL 10 мин, hash в БД (не plaintext).
6. **Telegram bot integration** — координация с `podev` (US-8). Получи статус: бот подключен или нет. Если нет — Wave 2 blocked **дополнительно** на US-8 connect.
7. **Rollback path** — если Wave 2 сломал login, откат через `admin.components.views.Login: undefined` в `payload.config.ts` (ADR-0005 Rollback §2). Native Payload login возвращается ≤5 мин.

**UI states по §12.1:**
- `default` — email field empty, button disabled пока email не валиден
- `loading` — после click «Получить ссылку», spinner на button, поля disabled
- `success` — карточка обновляется на «Ссылка отправлена в Telegram. Проверь бота @obikhod_bot.» + small reset link «отправить ещё раз через 60 сек»
- `error.invalid_email` — inline под полем
- `error.user_not_found` — generic «Пользователь не найден или временно заблокирован» (security: не выдавать что email существует)
- `error.rate_limited` — «Слишком много попыток. Попробуй через час.»

---

### Wave 3 · PageCatalog (отдельная страница + dashboard widget + CSV + Leads badge) ([PAN-6](https://linear.app/samohyn/issue/PAN-6))

**Объём:** 1.5 чд (be-panel 0.7 + fe-panel 0.8)
**Приоритет:** P1 — независим, параллельно с Wave 2

**Обязательные ADR-0005 follow-ups в spec'е:**
1. **REST endpoints** — Уровень 3 (не трогаем native Payload core), создаём через `payload.config.ts` `endpoints` array или Next.js API routes.
2. **`/admin/catalog` отдельная страница** — Уровень 2 React custom view. Через `admin.components.views` или Payload custom-route.
3. **Dashboard widget** — Уровень 2 React, `beforeDashboard` slot (как `BeforeDashboardStartHere`).
4. **Sidebar Leads badge counter — самое рискованное место (ADR-0005 §2 high risk).** Обязательный AC «графдеградация»:
   - **Plan A:** native Payload `Nav` admin component с slot для badge (если API позволяет в 3.83)
   - **Plan B:** CSS-injection через `::after` content на `.nav__link[href*="/admin/collections/leads"]` с client polling 30s, обновляющим `data-count` атрибут
   - **Plan C (fallback):** убрать badge из sidebar, оставить только в dashboard widget «Новые заявки: N»
   - Spec обязан описать **все 3** + acceptance test «работает в одном из трёх вариантов».
5. **CSV export** — server-side через `Buffer` + `Content-Disposition: attachment`. Не client-side (53+ строк превратятся в 2000+ при programmatic SD scaling).
6. **Кэш 60s/30s** — через `revalidate: 60` на server component или Redis с `staleWhileRevalidate`.

**UI states по §12.3:**
- Dashboard widget — top-6 last updated, link «открыть полный каталог →»
- `/admin/catalog` — full-table 7 коллекций, фильтры (Раздел / Статус / Дата), поиск (по URL + title), кнопка «⇩ CSV» в правом верхнем углу
- Empty (новый проект, всё пусто): EmptyState из Wave 5
- Loading: SkeletonTable
- Error: 500 fallback с retry button

---

### Wave 4 · Tabs field в 10 коллекциях ([PAN-3](https://linear.app/samohyn/issue/PAN-3))

**Объём:** 1.5 чд (be-panel 1 + cw 0.5)
**Приоритет:** P2 — независим, параллельно с Wave 2/3

**Обязательные ADR-0005 follow-ups в spec'е:**
1. **Уровень 3 — НЕ трогаем EditView core.** Только schema-side: добавляем `type: 'tabs'` field в `CollectionConfig` 10 коллекций. SCSS уже покрыл tabs states в Wave 1 (ADR-0005 §1 средний risk на `.tabs-field__tab-button`).
2. **`:where()` обёртка для tabs-классов** — ADR-0005 §1.2 рекомендует, для Wave 4 это критично (tabs селекторы могут смениться в minor 3.84+). Добавить в custom.scss.
3. **cw scope** — собрать labels вкладок + audit `admin.description` для каждого поля 10 коллекций. Tone: серьёзный без казёнщины ([CLAUDE.md TOV](../../../CLAUDE.md)).
4. **Validation errors → красная точка справа от label tab** (§12.4) — это работает через native Payload `validate` функции на полях, точка добавляется через CSS `.tabs-field__tab-button.has-error::after`.

**Маппинг 10 коллекций уже в [PAN-3 description](https://linear.app/samohyn/issue/PAN-3):**

| Коллекция | Tabs |
|---|---|
| Services | Основные / Контент / SEO / Sub-services / FAQ / Превью |
| SiteChrome | Header / Footer / SEO defaults / Tracking / Robots |
| Districts | Основные / Контент / SEO / Stats |
| Cases | Основные / Контент / Медиа / SEO |
| Blog | Основные / Контент / SEO / Author |
| B2B | Основные / Сегменты / SEO |
| Authors | Профиль / Bio / SEO |
| ServiceDistricts | Основные / Контент / SEO |
| Leads | Контакт / Detail / Status / Internal notes |
| Media | Основные / Метаданные |

---

### Wave 5 · Empty / Error / Skeleton финал ([PAN-4](https://linear.app/samohyn/issue/PAN-4))

**Объём:** 1 чд (fe-panel)
**Приоритет:** P2 — независим, параллельно с Wave 2/3/4

**Обязательные ADR-0005 follow-ups в spec'е:**
1. **Уровень 2 — расширение existing `site/components/admin/EmptyErrorStates.tsx`.** Не переписывать с нуля — Wave 1 уже частично сделал.
2. **Per-collection через `admin.components.views.List.Empty`** (если Payload 3.83 поддерживает, иначе — через client-side detect в `BeforeListView`). Spec обязан описать какой механизм используется и почему.
3. **500 / 403 React-компоненты** — через `app/error.tsx` per route group `app/(payload)/error.tsx` + `forbidden.tsx`. Texts от `cw`.
4. **SkeletonTable** — `prefers-reduced-motion: reduce` отключает shimmer (ADR-0005 §1 + brand-guide §12.4.1).
5. **Texts от cw** — список empty-состояний 10 коллекций, тон позитивный (особенно Leads empty: «Все заявки обработаны. Хорошая работа.»). Через [art-brief-cw.md](art-brief-cw.md).

---

## Sequence для запуска

1. **Открой brand-guide.html в браузере** — посмотри 8 mockup'ов §12 живьём (не текст). Скриншоты от popanel — в [screen/admin-login-mockup.png](../../../screen/admin-login-mockup.png), [screen/admin-layout-mockup.png](../../../screen/admin-layout-mockup.png), [screen/admin-dashboard-mockup.png](../../../screen/admin-dashboard-mockup.png).
2. **Прочитай [ADR-0005](../../adr/ADR-0005-admin-customization-strategy.md) полностью** — особенно §Versioning стратегия и §Rollback.
3. **Активируй skill `architecture-decision-records`** через Skill tool (skill-check iron rule для sa-panel) — по фронтматтеру `team/panel/sa-panel.md`.
4. **Пиши 4 спеки последовательно или параллельно** — у тебя есть весь контекст. Приоритет: **Wave 2 first** (Magic link unblocking US-12 dev start), потом 3/4/5 в любом порядке.
5. **После каждой спеки → пинг popanel в комментарии Linear PAN-X** для approve. Я ставлю `phase:spec` → `phase:dev` label при approve.

## Cross-team зависимости (закрыть до dev)

| Зависимость | От кого | Когда нужно |
|---|---|---|
| Telegram bot connect к оператору | `podev` (US-8) | до start Wave 2 dev |
| Beget SMTP SPF/DKIM для email fallback | `do` | до start Wave 2 dev |
| Approval разделения капасити panel || product | `cpo` | до start Phase B (любой Wave dev) |

`popanel` запросит cpo + podev отдельным комментарием в [PAN-1](https://linear.app/samohyn/issue/PAN-1).

## Iron rules для всей Wave-серии (от popanel)

1. **brand-guide.html §12 — единственный source UI/UX.** Никаких `contex/*.html` (урок PR #68).
2. **`!important` запрещён** в новом коде Wave 2-7 без явного `// reason: ...` комментария рядом. Cr-panel review гейт.
3. **`:where()` обёртка** для всех нестабильных Payload-классов в новом custom.scss коде (ADR-0005 §1.2).
4. **Comment-anchors** — каждый блок CSS / React-компонент комментирует ссылкой на §brand-guide / §art-concept-v2.
5. **a11y WCAG 2.2 AA + reduced-motion** — обязательно в каждой спеке (focus-visible, aria-labels, keyboard nav).
6. **TypeScript types из `payload`**, не из `@payloadcms/ui` глубже первого уровня (ADR-0005 §2.3).

---

**Старт:** ты, `sa-panel`. Жду 4 спеки в `specs/US-12-admin-redesign/sa-panel-wave-{2,3,4,5}.md` для approve.
