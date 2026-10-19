# leadqa-US-12 — Real-browser smoke на проде после merge 4 PR

**Дата:** 2026-04-30
**Автор:** leadqa
**Скоп:** US-12 Admin Redesign (W3 finish + W4 closure + W5 part 1 + W7 spec/ADR-0010)
**Skills активированы:** `verification-loop`, `e2e-testing`
**Verdict:** ✅ **GO с partial coverage** — все unauthed AC verified, authed AC требуют operator sign-off (см. §Limitations)

---

## Контекст

Оператор смержил 4 PR в `main` 2026-04-30:
- [#100](https://github.com/samohyn/obihod/pull/100) — W3 finish (catalog page + leads/count + LeadsBadge)
- [#101](https://github.com/samohyn/obihod/pull/101) — W5 part 1 (EmptyCollection + Skeletons + brand-skeleton pulse)
- [#102](https://github.com/samohyn/obihod/pull/102) — W4 closure (has-error tab indicator + backlog reconcile)
- [#103](https://github.com/samohyn/obihod/pull/103) — W7 spec + ADR-0010 (W5 part 2 closure via Payload API research)

`do` autodeploy через `deploy.yml` на push main:
- Stable deploy commit: `6ecf0db` (W4 closure) — **SUCCESS** 2026-04-30 05:11Z
- Текущий in-progress deploy commit: `9fe16bc` (W7 spec + ADR-0010 — docs only, runtime не меняется)

Iron rule per memory `feedback_leadqa_must_browser_smoke_before_push` + CLAUDE.md §Iron rule #6 (operator approve only after leadqa). Оператор уже смержил, поэтому делаю post-deploy smoke на проде.

---

## Smoke results

### A. HTTP/API smoke (unauthed)

| Endpoint | Expected | Actual | Verdict |
|---|---|---|---|
| `GET /api/health` | 200 + 0 | 200, time 0.33s | ✅ |
| `GET /api/health?deep=1` | 200 (DB ping OK) | 200 | ✅ |
| `GET /admin/login` | 200 + полная DOM | 200, full form rendered | ✅ |
| `GET /admin` | 200 (redirect to login если не авторизован) | 200 | ✅ |
| `GET /admin/catalog` | 200 (redirect to login если не авторизован) | 200 | ✅ (W3 finish) |
| `GET /api/admin/leads/count?status=new` | 401 unauthed | 401 | ✅ (security correct) |
| `GET /api/admin/page-catalog/csv` | 401 unauthed | 401 | ✅ (security correct) |
| `GET /` | 200 (public site) | 200 | ✅ |

### B. /admin/login pixel-perfect compliance (W2.A v2 + Wave 1)

Real-browser DOM evaluate через Playwright (https://obikhod.ru/admin/login):

| AC | Expected | Computed | Verdict |
|---|---|---|---|
| AC-1 | Полная форма (email + password + submit) | `hasForm/Email/Password/Submit` все true | ✅ |
| AC-6 | Page bg cream `#f7f5f0` | `--brand-obihod-paper` = `#f7f5f0` | ✅ |
| AC-7 | Form max-width 320px | `getComputedStyle(form).maxWidth` = `320px` | ✅ |
| AC-8 | Form bg white | `rgb(255, 255, 255)` | ✅ |
| AC-10 | Form border-radius 10px | `borderRadius: 10px` | ✅ |
| AC-11 | Submit button янтарный `#e6a23c` | `rgb(230, 162, 60)` | ✅ |
| AC-14 | Lockup ОБИХОД виден | text «ОБИХОД» found | ✅ |
| AC-15 | Tagline «порядок под ключ · admin» | визуально на скриншоте | ✅ |
| AC-16 | Footer «© 2026 · Обиход» | визуально на скриншоте | ✅ |
| Submit color | ink `#1c1c1c` | `rgb(28, 28, 28)` | ✅ |
| Brand accent token | `#e6a23c` | `--brand-obihod-accent` = `#e6a23c` | ✅ |

**Screenshot evidence:** [screen/leadqa-US-12-prod-admin-login.png](../../screen/leadqa-US-12-prod-admin-login.png) — login screen pixel-perfect vs brand-guide.html §12.1 mockup.

### C. Console messages on /admin/login

```
[ERROR] 401 Unauthorized @ /api/admin/leads/count?status=new (×2)
```

**Анализ:** ожидаемое поведение. `LeadsBadgeProvider` (W3 finish) рендерится через `admin.components.providers` для всех admin routes (включая login screen). `LeadsBadgeOverlay` `useEffect` mount-первый fetch получает 401 — `fetchCount()` silent fail (`if (cancelled || !res.ok) return`), без error toast / throw / user-visible UX impact.

**Не блокер релиза**, но **W3.1 polish follow-up** для устранения console шума: skip fetch если `/admin/login` route ИЛИ user not authenticated. Можно через `usePathname()` check либо через `react.useEffect` guard на cookie.

### D. Latest deploy GitHub Actions

```
SUCCESS: 6ecf0db (W4 closure) — 2026-04-30 05:11Z
  Lighthouse · home: success
  Deploy to Beget: success
IN PROGRESS: 9fe16bc (W7 spec + ADR-0010) — 2026-04-30 05:19Z
  CI: in_progress
  Deploy to Beget: in_progress
  Lighthouse: completed (success)
```

PR #103 — **docs only**, runtime prod не меняется. Текущий in-progress deploy = no-op для функциональности.

---

## Limitations / что НЕ проверено в этом отчёте

leadqa **не имеет prod admin password** (memory `feedback_leadqa_must_browser_smoke_before_push` требует real-browser smoke; ssh/secrets закрыты per operator). Следующие AC требуют **operator sign-off** через ручной login + проверку:

### Authed AC pending operator verify

| Wave | AC | Что проверить (ручной flow для operator) |
|---|---|---|
| **W3 finish** (#100) | Dashboard widget | Залогинься на /admin/login → попадаешь на /admin → виден widget «КАТАЛОГ ОПУБЛИКОВАННЫХ СТРАНИЦ» (top-6 last updated) |
| **W3 finish** | /admin/catalog page | На dashboard клик «Открыть полный каталог →» (или прямой URL `/admin/catalog`) → виден H1 «Каталог опубликованных страниц», breadcrumb «02 · Контент / Каталог», кнопка «⇩ Скачать CSV», полная таблица 53+ страниц |
| **W3 finish** | CSV download | Click «⇩ Скачать CSV» → файл `page-catalog-2026-04-30.csv` скачивается, открывается в Excel с правильной кириллицей |
| **W3 finish** | Leads badge | Открой /admin/collections/leads/create, создай тест-lead со статусом «Новый», вернись на /admin → sidebar пункт «Заявки» имеет янтарный pill-counter с цифрой (≥30 сек после создания) |
| **W4 closure** (#102) | Tabs has-error indicator | Открой /admin/collections/services/<id>, переключись на tab «Контент», очисти required field → сохрани → красная точка `•` появляется справа от label tab «Основные» (или того tab где validation failed) |
| **W5 part 1** (#101) | EmptyCollection в /admin/catalog | Если БД prod имеет хотя бы один published doc — игнор; если коллекция полностью пуста (вряд ли) — увидишь брендовый «Услуг пока нет» вместо native «Документы не найдены» |
| W2.A v2 | Login flow → redirect | Введи email + password → submit → redirect на /admin (полный auth-cycle) |

**Если все этих 7 пунктов работают:** verdict оператора → APPROVE → US-12 release closure.
**Если найдена регрессия:** rollback через `deploy/rollback.sh` (vs commit `da26ed4` либо более ранний).

---

## Известные follow-ups (не блокеры релиза)

| Item | Что | Owner | Когда |
|---|---|---|---|
| **W3.1 polish** | LeadsBadgeOverlay не fetch'ает на /admin/login (устранить console 401) | fe-panel | post-release polish |
| **W6 Mobile** | Spec sa-panel-wave6.md ещё не написан; ADR-0010 рекомендует CSS-only через `@media` queries | sa-panel + popanel | следующая сессия |
| **W7 dev** | Spec в [PR #103](https://github.com/samohyn/obihod/pull/103) (теперь в main); axe-core integration + 5 admin-a11y tests + reduced-motion + W3/W4/W5 polish smoke | qa-panel + cr-panel | release-gate перед US-12 closure |
| **cw audit** | `admin.description` для всех fields в 10 collections | cw | независимо |
| Console 401 на /admin/login | Cosmetic fix для LeadsBadge (см. W3.1) | fe-panel | при работе W3.1 |

---

## Verdict

✅ **GO с partial coverage**

**Что подтверждено:**
- 8/8 unauthed HTTP smoke endpoints зелёные (включая правильное 401 на secure endpoints)
- 11/11 visual + computed-style AC для /admin/login (W2.A v2 + Wave 1) match brand-guide §12.1
- Latest stable deploy = W4 closure (commit 6ecf0db) SUCCESS
- Pre-existing deploy для W7 spec — docs-only, no runtime impact
- Public site obikhod.ru/ работает 200, no regressions

**Что требует operator sign-off:**
- 7 authed AC по W3 / W4 / W5 (dashboard widget, catalog page rendering, CSV download, leads badge counter, tabs has-error indicator, login full flow). Чек-лист в §Limitations.

**Operator action для финального approve:**
1. Залогиниться на https://obikhod.ru/admin/login
2. Пройти 7 authed AC по чек-листу выше
3. Если все ✅ → apply «approved» reaction либо комментарий в этом файле / в чате
4. Если регрессия → `do` rollback через `deploy/rollback.sh`

**Crit-path до US-12 release:**
- W6 Mobile (~1.5 ЧД, нужна sa-panel-wave6.md)
- W7 dev (~1.2 ЧД, spec в main)
- cw audit (опц., 0.3 ЧД)

≈2.7 ЧД до US-12 финального release-gate.

---

## Артефакты

- Screenshot: [screen/leadqa-US-12-prod-admin-login.png](../../screen/leadqa-US-12-prod-admin-login.png)
- Latest CI: https://github.com/samohyn/obihod/actions
- Console log evidence: 2 × 401 на `/api/admin/leads/count?status=new` — expected silent fail на login screen (LeadsBadgeOverlay mount-first fetch без auth cookie)

---

## Pinging

- **Operator** — 7 authed AC проверка + final approve ИЛИ rollback request
- **popanel** — после operator approve: фиксировать US-12 closure в team/backlog.md (W6+W7 готовы к kickoff)
- **do** — мониторинг 2 часа (Sentry + Uptime Robot), если ошибки — rollback готов
- **fe-panel** — W3.1 polish console 401 на login (low priority, после release)
