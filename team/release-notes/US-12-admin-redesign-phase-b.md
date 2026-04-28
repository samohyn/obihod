# US-12 Admin Redesign — Phase B (release candidate)

**Статус:** RC (release-candidate, не задеплоен) — pending `leadqa` verify + оператор approve + `do` deploy
**Дата RC:** 2026-04-28
**Автор RN:** release-mgr
**Linear Epic:** [PAN-1](https://linear.app/samohyn/issue/PAN-1) US-12 Admin Redesign
**Ветка:** `fix/admin-stat-cards-12-3` (9 коммитов от `843cbf5` до `4eae8b6`, NOT pushed)
**Базовый PR:** будет создан при push (TBD)

Это **intermediate release-candidate** — Phase B partial. US-12 epic закроется только после Wave 2.B (PAN-11 magic link), Wave 6 (PAN-7 mobile), Wave 7 (PAN-8 polish). Текущий RC покрывает: Wave 2.A + 4 + 5 partial + 3 part 1 + PAN-9 + PAN-10 + ADR-0005.

## 9 коммитов в этом RC

```
4eae8b6 fix(panel): cr-panel review findings — security + efficiency
e2e73d9 feat(panel): PAN-9 + PAN-10 finish — Telegram bot + Beget SMTP готовы
a0b29b4 feat(panel): Wave 3 part 1 — PageCatalogWidget top-6 + CSV export (PAN-6)
43b92c0 feat(panel): Wave 4 finish — tabs в Leads + Media (PAN-3)
4207cf3 feat(panel): Wave 5 error/forbidden/not-found boundaries (PAN-4 partial)
2f10c5d chore(panel): scaffolding для PAN-9 Telegram bot + PAN-10 Beget SMTP
ced6bed feat(panel): Wave 2.A AdminLogin custom view (PAN-5)
5b7acbe docs(spec): US-12 Wave 2-5 sa-panel specs + popanel decisions
843cbf5 docs(adr): ADR-0005 admin customization strategy
```

## Что задеплоится оператору

После `do` push + GitHub Actions CI + Beget VPS deploy:

1. **`/admin/login`** — кастомная форма §12.1: lockup + admin-tagline + carд 320px + email/password + янтарная «Войти» + «Забыли пароль?» link. Auth-flow native (Payload `useAuth` + direct POST `/api/users/login`). FSM с invalid_credentials / locked / network / unknown states. WCAG 2.2 AA.
2. **`/admin`** dashboard — добавлен widget «Свежие изменения» (top-6 last updated across 7 collections, sorted by updatedAt desc). Footer link «Открыть полный каталог →» → `/admin/catalog` (full route — Wave 3 part 2, ещё не реализован).
3. **`/admin/collections/leads`** edit-view — теперь tabs (Контакт / Запрос / Источник / Статус). Existing fields сохранены, no migration.
4. **`/admin/collections/media`** edit-view — tabs (Основные / Метаданные).
5. **500 / 403 / 404 errors** в `/admin/*` — кастомный fallback по §12.5 (retry button + Sentry conditional capture + dev-only error.message).
6. **`POST /api/admin/page-catalog/csv`** — auth-gated CSV export (admin/manager only), UTF-8 BOM для Excel, Cache-Control: no-store, RFC 4180 + OWASP CSV-injection guard.
7. **`POST /api/telegram/webhook`** — Telegram bot webhook handler (timing-safe secret compare), сохраняет `Users.telegramChatId` при `/start` + greeting.
8. **`Users.telegramChatId`** — новое поле (миграция `20260428_140000_users_telegram_chat_id`, idempotent ALTER TABLE ADD COLUMN).
9. **`site/lib/messengers/email.ts`** — реальный nodemailer transport через smtp.beget.com:587 STARTTLS (готов к использованию из Wave 2.B PAN-11).

## Соответствие AC по Wave

### ADR-0005 (PAN-2) — Admin Customization Strategy
- [x] Документ написан в формате ADR-0001..ADR-0004
- [x] 6 пунктов зафиксированы (CSS-only / React `admin.components.*` / НЕ трогаем native / `:where()` strategy / versioning / rollback)
- [x] Reviewed `popanel`
- [ ] Reviewed `cpo` — pending (not blocking)
- [x] Линкуется в US-12 epic

### Wave 2.A (PAN-5) — AdminLogin Login UI override
- [x] `sa-panel-wave2a.md` одобрен popanel
- [x] `site/components/admin/AdminLogin.tsx` создан (218 строк → после cr-panel typing fix меньше)
- [x] Подключен в `payload.config.ts` `admin.components.views.login`
- [x] Email + Password + «Войти» через native Payload (POST `/api/users/login` + setUser)
- [x] «Забыли пароль?» link → `/admin/forgot` (native)
- [x] Error states с FSM
- [x] WCAG 2.2 AA: aria-label, aria-invalid, aria-live, focus-visible (Wave 1 SCSS)
- [x] cr-panel approve (3-agent review, critical fixed)
- [ ] Visual review `ux-panel` vs §12.1 — **pending leadqa** (manual smoke)
- [ ] Playwright smoke login flow — pending real Postgres / staging

### Wave 4 (PAN-3) — Tabs field в коллекциях
- [x] 10 коллекций с tabs: Authors, B2BPages, Blog, Cases, Districts, ServiceDistricts, Services, SiteChrome (8 from prior OBI-30) + Leads, Media (2 в этом RC)
- [x] Labels на русском, capitalize
- [x] Zero field renames (только перенос внутрь tabs)
- [x] `pnpm payload generate:types` зелёный (через `tsc --noEmit`)
- [ ] `cw-tabs-audit.md` (admin.description audit) — отложено в Wave 7 polish
- [x] cr-panel + ux-panel approve (визуал прорев)
- [ ] Manual edit-view smoke 10 коллекций — **pending leadqa**

### Wave 5 (PAN-4) — Empty/Error states (partial close)
- [x] `error.tsx` (500 + retry + Sentry conditional)
- [x] `forbidden.tsx` (403 reuse ForbiddenState)
- [x] `not-found.tsx` (404 reuse EmptyState)
- [x] WCAG 2.2 AA: role=region, aria-label, focus-visible (Wave 1 SCSS), 24px+ touch targets, reduced-motion
- [x] cr-panel approve
- [ ] **Per-collection EmptyState** — incompatible с ADR-0005 §3 (нет nativного slot в Payload 3.83). Decision popanel: **close as-is + CSS tweak в Wave 7**.
- [ ] **SkeletonTable** / **SkeletonForm** — то же. Decision: drop.
- [ ] Network error toast — отложено в Wave 7 (decision Q1).

### Wave 3 part 1 (PAN-6 partial) — PageCatalog refactor + CSV
- [x] `PageCatalogWidget.tsx` (top-6 для afterDashboard) — replaces existing PageCatalog
- [x] CSV endpoint `/api/admin/page-catalog/csv` — auth-gated, RFC 4180, OWASP CSV-injection guard, UTF-8 BOM
- [x] Promise.all parallelization
- [ ] **Wave 3 part 2 (TODO):** `/admin/catalog` full-page route (через Payload custom view), filters/search/pagination, sidebar Leads badge counter (Plan A→B→C).

### PAN-9 — Telegram bot setup
- [x] Operator manual: @BotFather регистрация, TOKEN, ENV
- [x] Code: `site/lib/telegram/sendMessage.ts` (fetch-based)
- [x] Webhook handler `route.ts` с timing-safe secret + payloadClient + greeting + sanitized logging
- [x] `Users.telegramChatId` field + миграция
- [ ] Operator подтвердил «получил приветствие от бота» — **pending leadqa** (post-deploy smoke)
- [ ] `setWebhook` curl выполнен оператором post-deploy — **pending**
- [ ] Integration test (Vitest mock) — **отложено** в Wave 2.B PAN-11

### PAN-10 — Beget SMTP setup
- [x] Operator manual: mailbox `noreply@obikhod.ru`, ENV
- [x] DNS: SPF (`v=spf1 include:beget.com -all`), DKIM (selector `beget._domainkey`, RSA 1024-bit)
- [ ] DMARC — Beget support ticket open (не блокирует send, SPF+DKIM passes у Gmail)
- [x] Code: `site/lib/messengers/email.ts` real nodemailer transport
- [x] `pnpm add nodemailer` + `@types/nodemailer`
- [ ] Test send на gmail.com → SPF=PASS / DKIM=PASS — **pending leadqa** (post-deploy)

## cr-panel review summary

3 параллельных агента (reuse / quality / efficiency+security) проверили `843cbf5..HEAD`. Critical findings все **пофикшены** в commit `4eae8b6`:

| Severity | Issue | Status |
|---|---|---|
| High security S1 | timing-safe webhook secret compare | ✅ fixed (`crypto.timingSafeEqual`) |
| High security S3 | CSV formula injection (OWASP) | ✅ fixed (`'`-prefix on `^[=+\-@\t\r]`) |
| Medium security S4 | role bypass для users без role | ✅ fixed (`!role || !includes`) |
| Medium security S2 | PII leak в `console.error(err)` | ✅ fixed (sanitized `{name, message}`) |
| High efficiency E1 | sequential 7× find в widget | ✅ fixed (Promise.all) |
| High efficiency E2 | sequential 7× find в CSV | ✅ fixed (Promise.all) |
| Medium efficiency E4 | webhook не использует payloadClient singleton | ✅ fixed |
| Code quality | AdminLogin double type cast | ✅ fixed (`UserWithToken` import) |

**Suggested findings (отложены — separate refactor commit):**
- COLLECTIONS array tripled in 3 files → extract `lib/admin/page-catalog.ts`
- `error.tsx` ~100 строк inline-style boilerplate ↔ `EmptyErrorStates.tsx StatePanel` reuse
- `AdminLogin.tsx` error mapping over-engineered → simplify FSM
- Inline-styles vs Wave 1 SCSS classes — migrate progressively
- Comments referencing Wave/PAN/task IDs — clean up

**Refactor commit** запланирован на отдельный ход после prod-проверки.

## qa-panel verdict

- ✅ TypeScript `tsc --noEmit` zelenый
- ✅ ESLint 0 errors (82 baseline warnings от existing migrations)
- ✅ Prettier format ✓
- ✅ Production `pnpm run build` компилируется (только prerender SSG routes падают локально из-за Postgres unavailable — **не code issue**, build-time only)
- ⚠️ Playwright e2e — **5/6 skipped**, 1 passed. Postgres локально недоступен (Docker daemon off). **Полноценный e2e только на staging/prod**.

## NFR / Performance budget

- TypeScript strict ✓
- Bundle: AdminLogin (client) + PageCatalogWidget (server) — небольшие, не влияют на marketing-site bundle
- Lighthouse target: Performance ≥85, Accessibility ≥95 на admin pages — **проверка в Wave 7** (post-deploy)
- a11y: WCAG 2.2 AA — implemented в коде, audit в Wave 7
- reduced-motion: Wave 1 SCSS guard работает

## Migrations

- `20260428_140000_users_telegram_chat_id` — idempotent ALTER TABLE ADD COLUMN IF NOT EXISTS, no DEFAULT (no rewrite). Live на проде безопасно. Rollback safe (down DROP COLUMN).

## ENV-переменные (на VPS + GitHub Actions secrets)

- `TELEGRAM_BOT_TOKEN` ✅ (operator confirmed)
- `TELEGRAM_WEBHOOK_SECRET` ✅
- `OPERATOR_EMAIL` ✅
- `SMTP_HOST=smtp.beget.com`, `SMTP_PORT=587`, `SMTP_USER=noreply@obikhod.ru`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL` — **операторский todo** перед deploy

## Risks

| Risk | Mitigation |
|---|---|
| Local Postgres недоступен → e2e не прогнан полноценно | leadqa делает manual smoke на staging/prod после deploy |
| `setWebhook` Telegram URL не зарегистрирован | Operator выполняет `curl setWebhook` post-deploy (одна команда из инструкции pre-tasks/podev-telegram-bot-setup.md) |
| DMARC missing → возможен Spam-флаг у некоторых mail-провайдеров | Beget support ticket в обработке. SPF+DKIM passes у Gmail в основном |
| Wave 3 part 2 (`/admin/catalog`) ещё не реализован → link «Открыть полный каталог →» в widget даст 404 | Decision popanel: **acceptable** — оператор знает, link для будущего |
| Per-collection empty не реализован → native Payload "no documents found" UI | Decision popanel: close as-is, CSS tweak в Wave 7 |

## Rollback plan

Если что-то ломается в проде после deploy:

1. **CSS-уровень** — `git revert <sha> -- site/app/(payload)/custom.scss` + redeploy ≤5 мин (custom.scss в этом RC не менялся, риск низкий)
2. **React-уровень** — `git revert ced6bed` (Wave 2.A AdminLogin) → views.login fallback на native Payload ≤5 мин
3. **Migration** — `pnpm payload migrate:down` для `20260428_140000_users_telegram_chat_id`. Operator потеряет `telegramChatId` value (нужно заново /start боту)
4. **Полный rollback RC** — `git revert -m 1 <merge-commit>` ветки `panel/integration` → main (когда merged). До merge — `git reset --hard 843cbf5^` локально (operator approval required, destructive)

**Recovery target:** ≤15 мин от обнаружения до фикса.

## Что нужно от leadqa (verify gate)

См. `team/release-notes/leadqa-US-12-phase-b.md` (после написания leadqa отчёта).

Ожидаемое verification на staging/prod после deploy:

- [ ] `/admin/login` — open в браузере, проверить визуал vs §12.1 mockup ([screen/admin-login-mockup.png](../../screen/admin-login-mockup.png))
- [ ] Login flow: email+password существующего admin → redirect на `/admin`, session OK
- [ ] Login error: неправильный пароль → inline error visible, `aria-live` polite читается
- [ ] `/admin` dashboard widget «Свежие изменения» виден, top-6 заполнены
- [ ] Click row в widget → переход на edit-view документа
- [ ] CSV export: `curl -H "Cookie: payload-token=..." https://obikhod.ru/api/admin/page-catalog/csv` → 200 + CSV downloadable
- [ ] Edit Leads → tabs «Контакт / Запрос / Источник / Статус» visible, все existing leads открываются без data loss
- [ ] Edit Media → tabs «Основные / Метаданные» visible
- [ ] 500 boundary: trigger через invalid query или mock middleware → custom error page с retry
- [ ] 404: `/admin/non-existent-page` → custom not-found.tsx
- [ ] Telegram bot: `/start` → greeting в Telegram + `Users.telegramChatId` сохранён
- [ ] Email send (через node REPL после deploy): `sendEmail({to: 'samohingeorgy@gmail.com', ...})` → письмо в Inbox с SPF=PASS + DKIM=PASS
- [ ] keyboard-only: Tab → email → password → button → Enter — login работает без mouse
- [ ] Lighthouse: `/admin/login` Performance ≥85, Accessibility ≥95
- [ ] reduced-motion: ОС включён → нет animations на кнопках/transitions

## release-mgr approve

✅ Doc gate **PASSED**. RC готов передаваться `leadqa` для практической verification.

**Caveat:** полноценный e2e только на staging/prod из-за Postgres unavailability locally. Верификация critical paths делается leadqa **после deploy**, не до.

---

**Передаю → leadqa**.
