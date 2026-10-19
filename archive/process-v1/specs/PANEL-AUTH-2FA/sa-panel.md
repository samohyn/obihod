---
us: PANEL-AUTH-2FA
title: TOTP 2FA для admin Payload (Google Authenticator / 1Password / Authy compatible)
team: panel
po: popanel
type: feature
priority: P2
segment: admin
phase: spec-approved
role: sa-panel
status: dev-blocked-by-us-12-release
related: [US-12-admin-redesign, sa-panel-wave2b-cancelled]
created: 2026-05-01
updated: 2026-05-01
skills_activated: [product-capability, blueprint, design-system]
popanel_review: approved 2026-05-01 (autonomous mandate) — 7 AC sufficient, 8 risks с mitigations, 13 PO defaults locked, no ux-panel/art pass needed (existing §12 tokens cover all 4 surfaces). Подключения: dba (~0.2 чд миграция) + do (TOTP_ENCRYPTION_KEY в GH secrets + .env.example double quotes per memory) + cr-panel security review (grep logs / Sentry filter / API leak check). Dev start unblocks after US-12 closure.
---

# PANEL-AUTH-2FA — Spec (sa-panel)

**Author:** sa-panel
**Date:** 2026-05-01
**Source of truth:**
- [brand-guide.html §12.1 Login screen](../../design-system/brand-guide.html#admin) — карточка-форма 320 px, токены, состояния
- [brand-guide.html §12.4 Edit view с tabs](../../design-system/brand-guide.html#admin) — паттерн form rows для Setup/Recovery в profile
- [brand-guide.html §12.4.1 Interaction states palette](../../design-system/brand-guide.html#admin) — token map для inputs/buttons primary/secondary, focus-visible, loading, error
- [brand-guide.html §12.6 Empty / Error / 403 states](../../design-system/brand-guide.html#admin) — паттерн для recovery codes screen с предупреждением
- [brand-guide.html §31.7 (public 2FA, опциональный)](../../design-system/brand-guide.html#auth) — pattern reuse: TOTP, 10 backup codes, не SMS, экран ввода после login
- [ADR-0005 admin customization strategy](../../team/adr/ADR-0005-admin-customization-strategy.md) — уровни кастомизации Payload (мы остаёмся на Уровне 3, без trogania core auth)
- `site/collections/Users.ts` — текущая Users collection (уже имеет `auth: { useAPIKey: true }`, role enum, `telegramChatId` поле)
- `site/scripts/seed-admin.ts` — bootstrap admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD` env), backwards compat target

**Skill activation:** см. § Skill activation ниже.

---

## Skill activation (iron rule)

`sa-panel` вызвал Skill tool на старте:

| Skill | Когда применяю | Что даёт |
|---|---|---|
| `product-capability` | § Capability statement + § Constraints + § Implementation contract | Превращает «делаем 2FA для admin» в явные constraints (opt-in, backwards compat, recovery path, encryption at rest, не-SMS) и discrete actors / surfaces / states. Без этого `be-panel` пишет код по интуиции и приходит с вопросами «а как при потере телефона?». |
| `blueprint` | § Architecture + § Dev breakdown + § Migration | Каждый компонент (collection extension → endpoints → setup UI → login UI → recovery flow) — self-contained brief с dependency edges, exit criteria и rollback. Cold-start готовность для be-panel/fe-panel/dba. |
| `design-system` | § Brand-guide §12 mapping + AC | Сверка Setup screen / second-factor login screen / recovery codes screen с конкретным §-anchor (§12.1 Login + §12.4 form rows + §12.4.1 states palette + §12.6 empty/error). Без «дизайнерских импровизаций» — переиспользуем существующие токены из custom.scss. |

**Активация зафиксирована.** Если в процессе spec появится потребность в
`security-review` или `database-migrations` — `sa-panel` дополнительно активирует
и зафиксирует через hand-off log.

---

## Цель

Защитить admin Payload (`/admin`) от компрометации credentials через TOTP 2FA,
совместимый с Google Authenticator / 1Password / Authy / Yandex Key. Setup
opt-in в profile, login flow расширяется второй ступенью при `totpEnabled`.
Existing admin (seed) продолжает работать без 2FA — backwards compat обязательна.

**Outcome change:** утечка одного пароля (фишинг, утечка password manager,
shoulder surfing) ≠ доступ к Leads + cms. Recovery path (10 одноразовых кодов)
исключает lockout при потере телефона.

---

## Capability statement (product-capability)

После релиза:

- **Оператор / cms-роль (admin/manager/seo/content):** в profile видит секцию
  «Безопасность · 2FA», может включить 2FA (QR + manual secret → ввод OTP для
  verify → 10 recovery codes), может отключить (требует current password +
  current OTP / recovery code).
- **При login:** если `totpEnabled` → после email+password vidи второй экран
  «Введите код из приложения» (6 digits) с альтернативой «Использовать код
  восстановления» (one-time, 10 шт).
- **Recovery codes:** показываются ОДИН раз при setup с предупреждением
  «сохрани сейчас, повторно не покажем» + кнопкой «Скачать .txt»; в БД хранятся
  только bcrypt-hash (cost 10).
- **Backwards compat:** дефолт `totpEnabled: false` → seed admin
  (`admin@obikhod.local`) и любой existing user продолжает логиниться через
  привычный email+password без второго шага. 2FA — opt-in.
- **Encryption at rest:** `totpSecret` шифруется AES-256-GCM ключом из env
  `TOTP_ENCRYPTION_KEY` (32 bytes base64). При утечке БД (без env) — secret
  бесполезен.

---

## Acceptance Criteria

**AC-1 (collection extension):** Users collection расширена 3 полями —
`totpEnabled` (boolean, default false, admin-readonly), `totpSecretEnc` (text,
encrypted at rest, hidden из admin UI), `recoveryCodes` (array of bcrypt-hashes,
hidden из admin UI). Migration `2026XXXX_users_totp_fields.ts` применима на
prod без downtime. Existing rows получают `totpEnabled = false` без потери
данных. RBAC: эти поля невидимы для не-self users (нельзя посмотреть, включил
ли коллега 2FA).

**AC-2 (setup endpoint + UI):** `POST /api/admin/auth/2fa-setup` (auth required,
self-only) генерирует TOTP secret (128 bit, RFC 4226 base32) + QR (PNG base64
data URL, otpauth URI `otpauth://totp/Обиход:{email}?secret=...&issuer=Обиход`)
**и временно сохраняет в session** (НЕ в Users до verify). UI в profile (admin
custom view): кнопка «Включить 2FA» → модалка с QR + manual secret + поле OTP
для verify + кнопка «Подтвердить и сохранить». Дизайн — карточка по §12.1 Login
+ form rows §12.4 + states §12.4.1 (default / focus / loading / error).

**AC-3 (verify + recovery codes):** `POST /api/admin/auth/2fa-verify` принимает
6-digit OTP, валидирует через `otplib.authenticator.check` (window ±1 step =
±30 сек tolerance), при success: шифрует secret → пишет
`{ totpEnabled: true, totpSecretEnc, recoveryCodes }`. Возвращает 10
plaintext recovery codes (формат `XXXX-XXXX-XXXX`, base32, 60 bit entropy
each). UI: один раз показывает codes на отдельном экране с предупреждением
«Сохрани сейчас, повторно не покажем», кнопкой «Скачать .txt» и явным
ack-чекбоксом «Я сохранил коды» (без него «Готово» disabled). После закрытия
страницы — codes недоступны через UI или API.

**AC-4 (login second-factor flow):** Native Payload `/admin/login` остаётся
intact для email+password. После success login если у user `totpEnabled === true`
— Payload session помечена `awaitingSecondFactor: true` (custom field в session
или middleware-state), все non-2fa-эндпоинты возвращают 403 redirect на
`/admin/login/2fa`. Экран `/admin/login/2fa` принимает 6-digit OTP **или** один
recovery code (toggle link «Использовать код восстановления»). При success OTP:
снимает флаг `awaitingSecondFactor`. При success recovery code: дополнительно
помечает использованный hash как consumed (`recoveryCodes` array filter), при
remaining ≤ 3 — показывает баннер «Осталось N кодов восстановления, перегенерируй
в profile». Дизайн — те же 320 px карточка-форма §12.1 Login + поле 6-digit
OTP с моноширинным шрифтом + ссылка «Использовать код восстановления →».

**AC-5 (disable + regenerate recovery):**
- `POST /api/admin/auth/2fa-disable` требует body `{ password, otpOrRecovery }`
  — оба валидируются на сервере. При success: clear `totpEnabled`, `totpSecretEnc`,
  `recoveryCodes`. UI: кнопка «Отключить 2FA» в profile → модалка с двумя
  полями.
- `POST /api/admin/auth/2fa-regenerate-codes` требует current OTP, генерирует
  новые 10 codes, заменяет hashes в Users, показывает plaintext один раз
  (тот же экран что AC-3). Старые codes invalidated.

**AC-6 (backwards compat + bootstrap):** seed admin `admin@obikhod.local`
после migration работает без изменений (`totpEnabled: false`). `seed-admin.ts`
не трогаем — он не задаёт 2FA-поля, default берётся из collection schema.
Existing Playwright fixtures (TEST_USER_EMAIL/PASSWORD) продолжают работать
без 2FA. Никакого forced enrollment.

**AC-7 (security NFR):**
- `totpSecret` хранится в БД **только** в зашифрованном виде (AES-256-GCM,
  IV per record, ключ — `TOTP_ENCRYPTION_KEY` env, 32 bytes base64).
- `recoveryCodes` хранится **только** как массив bcrypt-hashes (cost 10),
  plaintext недоступен после AC-3 показа.
- Rate limit: setup-verify endpoint 5 попыток / 5 минут / user (защита от
  guess); login-2fa endpoint 5 попыток / 5 минут / session (после lockout —
  forced re-login email+password). Реализация — Payload custom collection
  `RateLimitAttempts` или in-memory LRU (decision sa: in-memory достаточно для
  одного prod-инстанса; при scale-out → перенос в Redis, follow-up).
- Никакого логирования OTP / secret / recovery codes ни в console, ни в
  Sentry, ни в Payload audit. `cr-panel` обязан проверить grep по логам.
- TOTP issuer = `"Обиход"` (UTF-8), label = email user-а — корректно отображается
  в Google Authenticator / 1Password.
- Window tolerance = ±1 step (±30 сек) — баланс UX (часы расходятся) vs replay.

---

## Brand-guide §12 mapping

Каждый visual element спеки → конкретный §-anchor + token. Без «дизайнерских
импровизаций».

| Surface | §-anchor | Tokens / pattern |
|---|---|---|
| **Login second-factor screen** (`/admin/login/2fa`) | §12.1 Login screen | Кремовый bg `#f7f5f0`, белая карточка 320 px по центру, brand-lockup `horizontal-compact.svg` + admin-tagline. Form: один input (6-digit OTP, моноширинный JetBrains Mono, letter-spacing 0.3em для groupings), primary button «Войти» янтарная `#e6a23c`. Ссылка ниже «Использовать код восстановления →» — `ad-link` token. |
| **Login second-factor states** | §12.4.1 Interaction states palette (Inputs + Buttons primary) | OTP input default → focus (border `#2d5a3d`, shadow `0 0 0 3px rgba(45,90,61,0.15)`) → error (border `#b54828`, helper red). Button loading (spinner 12×12 слева, текст «Проверяем»), disabled, error. Focus-visible обязателен. |
| **Setup screen в profile** (`/admin/collections/users/<self>/2fa-setup` или модалка) | §12.4 Edit view с tabs + §12.4.1 form rows | `ad-form-row` для each field (QR image, manual secret in monospace `JetBrains Mono`, OTP verify input). Primary button «Подтвердить и сохранить» (янтарная). Secondary «Отмена» (ghost). |
| **Recovery codes screen** | §12.6 Empty/Error/403 states + §12.4 form rows | Centered card, заголовок «Сохрани коды восстановления», warning-banner (orange `#b54828` border-left + `bg #fff4ec`) с текстом «Эти коды показываются один раз. Если потеряешь — перегенерируй в профиле.». Список 10 codes в monospace 2-column grid. Кнопка «Скачать .txt» (secondary), checkbox «Я сохранил коды» (без него primary disabled), primary button «Готово» (янтарная). |
| **Profile section «Безопасность · 2FA»** | §12.4 Edit view с tabs | Новый tab «Безопасность» в edit view Users. Если `totpEnabled = false`: badge «2FA не включена» (grey) + button «Включить 2FA» (primary). Если `totpEnabled = true`: badge «2FA включена» (green-leaning) + button «Отключить 2FA» (secondary, без destructive-red — это reversible action) + ссылка «Перегенерировать коды восстановления». Счётчик «Осталось N кодов» если ≤ 5. |
| **Status badges** | §12.5 Status badges | «2FA включена» — `ad-badge publ` (зелёная), «2FA не включена» — `ad-badge draft` (бежевая). Никаких новых цветов. |

**TOV** для всех текстов — §13 brand-guide:
- «Включить 2FA» (не «Активировать», не «Подключить»).
- «Введите код из приложения» (не «Введите верификационный код», не «Enter your
  TOTP token»).
- «Сохрани коды восстановления. Они показываются один раз. Если потеряешь
  телефон, войдёшь по любому из них.» (короткие фразы, на «ты» как везде в
  admin).
- «Не приходит код? Проверь время на телефоне — оно должно совпадать с
  серверным.» (helpful, без обвинений).

---

## Архитектура

### 1. Collection extension (`site/collections/Users.ts`)

3 новых поля в существующей коллекции:

```ts
// fields добавляются после существующего telegramChatId:
{
  name: 'totpEnabled',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    readOnly: true, // меняется только через 2fa-setup/2fa-disable endpoints
    description: 'Включена ли двухфакторная аутентификация (TOTP). Управляется через профиль.',
  },
},
{
  name: 'totpSecretEnc',
  type: 'text',
  admin: { hidden: true }, // никогда не показывать в admin UI
  access: { read: () => false, update: () => false }, // даже self не читает напрямую
},
{
  name: 'recoveryCodes',
  type: 'array',
  admin: { hidden: true },
  access: { read: () => false, update: () => false },
  fields: [
    { name: 'hash', type: 'text', required: true }, // bcrypt hash
    { name: 'consumedAt', type: 'date' }, // null = доступен
  ],
},
```

**Почему `text` для `totpSecretEnc`, а не отдельная коллекция:** secret per-user
1:1, отдельная коллекция оверкилл; `array` для recoveryCodes — Payload
nested документы поддерживает out-of-the-box.

**Почему `access.read: () => false`:** secret + recovery hashes должны быть
доступны только серверным endpoint-ам (через `payload.findByID` в server
context, который игнорирует field-level access). `cr-panel` обязан проверить.

### 2. Endpoints (`site/app/(payload)/api/admin/auth/`)

Все endpoints — Next.js route handlers с явным `auth required` check (через
`payload.auth({ headers })`):

| Method + Path | Body | Response | Auth |
|---|---|---|---|
| `POST /api/admin/auth/2fa-setup` | `{}` | `200 { qrPng: string (data URL), manualSecret: string (base32, formatted XXXX XXXX), tempSecretToken: string }` (secret кладётся в server-side session by `tempSecretToken`, НЕ в БД) | session required (logged-in user) |
| `POST /api/admin/auth/2fa-verify` | `{ tempSecretToken, otp: '123456' }` | `200 { recoveryCodes: string[10] }` (plaintext, ОДИН раз) или `400 { error: 'invalid_otp' \| 'expired_setup_session' }` | session required |
| `POST /api/admin/auth/2fa-disable` | `{ password: string, otpOrRecovery: string }` | `200 { ok: true }` или `400 { error: 'wrong_password' \| 'invalid_otp' }` | session required |
| `POST /api/admin/auth/2fa-regenerate-codes` | `{ otp: string }` | `200 { recoveryCodes: string[10] }` или `400 { error }` | session required |
| `POST /api/admin/auth/2fa-login` | `{ otp?: string, recoveryCode?: string }` | `200 { ok: true }` (снимает `awaitingSecondFactor` flag) или `401 { error }` | session с `awaitingSecondFactor: true` |

**Логика setup-session:** `tempSecretToken` — короткий (16 byte base64url)
ключ к in-memory Map<token, { secret, userId, expiresAt: now+10min }>. Если
verify не пришёл за 10 минут — secret отбрасывается, `tempSecretToken`
inval. Без этого был бы риск «недо-setup записал secret и пользователь не
подтвердил» → 2FA включена с unknown secret = lockout. Decision sa: in-memory
Map достаточно для prod (один node-инстанс), при scale-out → перенос в Redis
(follow-up в risks).

**Login flow extension:** Native Payload login возвращает session без изменений.
Добавляем custom Payload **endpoint hook** (или middleware на admin routes):

```ts
// site/lib/auth/totp/secondFactorMiddleware.ts (концепт)
// Регистрируется через payload.config.ts → endpoints[] или Next.js middleware
// matcher: /admin/(.+) кроме /admin/login и /admin/login/2fa и /api/admin/auth/2fa-login
//
// Если session.user.totpEnabled === true И session.passedSecondFactor !== true
// → redirect на /admin/login/2fa
```

**Где хранится `passedSecondFactor` flag:** Payload использует JWT-cookie для
session. Расширяем JWT payload через `auth.strategies` или, проще, отдельная
HTTP-only cookie `obihod_2fa_passed=<sha256(sessionId+secret)>` со сроком
жизни = session lifetime. Decision sa: HTTP-only cookie + sha256 binding —
проще и не требует переопределения Payload JWT scheme.

### 3. Domain code (`site/lib/auth/totp/`)

Hexagonal-ish split (один из skills, но не оверкилл — две функции):

```
site/lib/auth/totp/
├── encrypt.ts          # AES-256-GCM encrypt/decrypt totpSecret
├── recoveryCodes.ts    # generate10Codes() + hashCode() + verifyCode()
├── totpVerify.ts       # тонкая обёртка над otplib.authenticator
├── setupSession.ts     # in-memory Map для temp secrets (10-min TTL)
└── index.ts
```

Endpoints вызывают эти функции; нигде в endpoint-коде нет `crypto.*` напрямую.

### 4. Login UI (fe-panel scope)

| Surface | Файл (концепт) | Что |
|---|---|---|
| `/admin/login/2fa` | `site/app/(payload)/admin/login/2fa/page.tsx` (custom Next.js route, обходит Payload native) | Карточка-форма по §12.1 + OTP input + ссылка «Использовать код восстановления». При toggle — input меняется на `XXXX-XXXX-XXXX` mask. |
| Profile «Безопасность» tab | `site/components/admin/UserSecurityTab.tsx` (custom Payload field component, `views.edit.tabs[]` или `admin.components`) | Badge статуса + кнопки Setup/Disable/Regenerate. При click — модалка / drawer. |
| Setup modal | `site/components/admin/TwoFactorSetupModal.tsx` | QR + manual secret + OTP input + Confirm. |
| Recovery codes screen | `site/components/admin/RecoveryCodesScreen.tsx` | Warning banner + 10 codes grid + Download + Ack checkbox + «Готово». |

**ADR-0005 уровень:** UI компоненты — Уровень 3 (новые компоненты в `app/` /
`components/admin/`), без замены Payload core. Login second-factor screen —
**отдельный Next.js route** `/admin/login/2fa`, не custom Payload view (Payload
не предоставляет hook для inserting between login и admin).

---

## Библиотеки

| Lib | Версия (на 2026-05-01) | Зачем | Альтернативы рассмотрены |
|---|---|---|---|
| **`otplib`** | `^12.0.x` (latest stable) | TOTP RFC 6238, lightweight (no deps), audited, browser+node. Используется `otplib.authenticator` (sha1, 30s step, 6 digits — Google Authenticator default). | `speakeasy` (тяжелее, deprecated maintenance); ручная реализация HMAC-SHA1 — overkill и risk. |
| **`qrcode`** | `^1.5.x` | Генерация PNG base64 (data URL) для otpauth URI. Server-side. | `qrcode-svg` — больше веса для inline data URL без преимуществ. |
| **`bcryptjs`** | если уже есть в payload deps — переиспользуем; иначе `bcryptjs ^2.4.x` | Hash recovery codes. Payload native auth уже использует bcrypt-like для passwords. | `argon2` — был бы лучше, но требует native build (на Beget VPS — friction); cost 10 bcrypt достаточно для recovery codes (low-volume, не онлайн-guess) |
| **Node.js builtin `crypto`** | (no install) | AES-256-GCM для `totpSecret`, `randomBytes` для recovery codes и tempSecretToken | — |

**Total bundle impact:** все три lib server-only (route handlers). Bundle
паблик-сайта не растёт. `tamd` ADR не требуется (новые runtime deps, но в рамках
существующего стека и без архитектурного сдвига); `cr-panel` подтверждает в
рамках security review.

---

## Миграция

**Файл:** `site/migrations/2026XXXX_users_totp_fields.ts` (точная дата при
старте dev-фазы). Owner: `be-panel` + `dba`.

**Что делает:**
1. `ALTER TABLE users ADD COLUMN totp_enabled boolean NOT NULL DEFAULT false`
2. `ALTER TABLE users ADD COLUMN totp_secret_enc text NULL`
3. Создание дочерней таблицы `users_recovery_codes` (Payload array → relation
   table): `id, _parent_id (FK users), _order, hash text NOT NULL, consumed_at timestamp NULL`
4. Index на `users_recovery_codes._parent_id` (lookup при login)
5. Down migration: `DROP COLUMN totp_enabled, totp_secret_enc; DROP TABLE users_recovery_codes` —
   reversible.

**Backwards compat:**
- `DEFAULT false` для `totpEnabled` → existing rows не блокируются.
- Seed admin (`admin@obikhod.local`) и Playwright TEST_USER продолжают
  логиниться через email+password без второго шага.
- Никаких backfill-скриптов; users включают 2FA по желанию.

**Zero-downtime:** ADD COLUMN с DEFAULT false на postgres 16 — fast (metadata-only
для boolean), `dba` подтверждает на staging перед prod.

**Env addition:**
- `TOTP_ENCRYPTION_KEY` — обязательная new env для prod и dev (32 bytes base64,
  генерируется `openssl rand -base64 32`).
- В `.env.example` добавить запись с **double quotes** (memory
  `feedback_env_example_quoting`, incident 2026-04-28 deploy.yml exit 127):
  ```
  TOTP_ENCRYPTION_KEY="REPLACE_WITH_BASE64_32BYTES_FROM_OPENSSL_RAND"
  ```
  и комментарий-инструкция, как сгенерировать.
- В `deploy.yml` GitHub Actions добавить secret `TOTP_ENCRYPTION_KEY`. Если
  отсутствует на старте процесса — startup check кидает `throw new Error('TOTP_ENCRYPTION_KEY missing')`
  до того, как первый user может включить 2FA.
- При **rotate** ключа — отдельная процедура (re-encrypt всех `totpSecretEnc`
  в БД), follow-up в risks; на MVP — один ключ on-deploy.

---

## Recovery codes — детали

| Параметр | Значение | Обоснование |
|---|---|---|
| Количество | 10 | Стандарт (GitHub, Google, brand-guide §31.7) |
| Формат | `XXXX-XXXX-XXXX` (12 base32 chars + 2 dashes) | 60 bit entropy, читаемо glasгом, копируется одним dbl-click (с дашами) |
| Хранение | bcrypt-hash (cost 10), `consumed_at` per code | Low-volume guess, bcrypt cost 10 достаточен (~100ms verify, не критично для login) |
| Показ plaintext | ОДИН раз при setup AC-3 + при regenerate AC-5 | Стандарт (нет «show codes» в profile) |
| Скачивание | Кнопка «Скачать .txt» (`Blob` + `download` attr) | Браузер сохраняет файл `obikhod-recovery-codes-{email}-{date}.txt` |
| Ack | Чекбокс «Я сохранил коды» обязателен перед «Готово» | Защита от случайного закрытия таба |
| Использование | один code → consume (set `consumed_at`) → больше нельзя | Single-use enforce |
| Уведомление о малом остатке | Баннер если remaining ≤ 3 «Осталось N кодов, перегенерируй» | UX, не security |

**Что НЕ делаем:**
- Email recovery codes пользователю — нет SMTP в проекте на 2026-05-01 (PAN-10
  отложен), и это нарушает «codes показываются один раз» (email — persistent
  copy в чужих ящиках).
- Backup admin override (master key для разблокировки чужого аккаунта) — single-tenant
  single-operator проект, такой механизм был бы security antipattern.

---

## Encryption at rest для `totpSecret` — детали

| Параметр | Значение |
|---|---|
| Алгоритм | AES-256-GCM (`crypto.createCipheriv('aes-256-gcm', key, iv)`) |
| Key | `TOTP_ENCRYPTION_KEY` env var, 32 bytes (base64-decoded) |
| IV | Random 12 bytes per record (`crypto.randomBytes(12)`) |
| Auth tag | 16 bytes, prepended к ciphertext |
| Storage format в `totp_secret_enc` | `base64(iv || authTag || ciphertext)` (single column, self-contained) |
| Обоснование AES-256-GCM vs `crypto.subtle` | Node builtin, audited, AEAD (auth + integrity), быстро. Не нужен KMS на MVP. |

**Code (концепт `site/lib/auth/totp/encrypt.ts`):**

```ts
import crypto from 'node:crypto'

const ALG = 'aes-256-gcm'

function getKey(): Buffer {
  const k = process.env.TOTP_ENCRYPTION_KEY
  if (!k) throw new Error('TOTP_ENCRYPTION_KEY missing')
  const buf = Buffer.from(k, 'base64')
  if (buf.length !== 32) throw new Error('TOTP_ENCRYPTION_KEY must be 32 bytes (base64)')
  return buf
}

export function encryptSecret(plaintext: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALG, getKey(), iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}

export function decryptSecret(blob: string): string {
  const buf = Buffer.from(blob, 'base64')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const enc = buf.subarray(28)
  const decipher = crypto.createDecipheriv(ALG, getKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}
```

`be-panel` пишет под TDD-workflow: 4 unit-теста (round-trip, wrong key reject,
truncated blob reject, missing env reject).

---

## Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Secret leak в логах** (console.log / Sentry / Payload audit) | High | Iron-rule в endpoint-коде: `// no log secret/otp/recovery`. `cr-panel` обязан grep `console|payload.logger` в touched files. Sentry beforeSend filter (если Sentry уже добавлен) — drop fields `totpSecretEnc`, `otp`, `recoveryCode`. |
| **Race condition setup** (два таба setup одновременно → один пишет, второй overwrite) | Medium | `tempSecretToken` уникальный per setup; verify атомарно (`payload.update` под `where: { id, totpEnabled: { equals: false } }`); если уже включено — 409 Conflict. |
| **Lost recovery codes** (пользователь потерял телефон + не сохранил коды) | High по impact, Low по likelihood | UX: ack-чекбокс перед «Готово», явное предупреждение, кнопка «Скачать .txt». Если всё-таки lockout — manual recovery через `pnpm` script `disable-2fa.ts` (server-side, требует доступа к Beget VPS, audit-trail в Payload versions). Doc в `site/lib/auth/totp/README.md`. |
| **Утечка `TOTP_ENCRYPTION_KEY`** (env file, GitHub Actions logs) | Critical | `.env*` уже в `.gitignore` + protect-secrets hook (`.claude/hooks/protect-secrets.sh`). GitHub Actions — secret через `secrets.TOTP_ENCRYPTION_KEY`, не echo. Rotation procedure — follow-up при первом инциденте. |
| **Conflict с email-link auth (если когда-то добавим)** | Low | Wave 2.B cancelled, magic link не на горизонте. Если вернётся — это станет вторым auth strategy, и каждая стратегия должна сама проверять `awaitingSecondFactor`. Документируем в `site/lib/auth/totp/README.md` как known assumption. |
| **Time skew (часы пользователя расходятся с сервером)** | Low | `otplib` window = 1 (±30 сек tolerance). UX: текст «Не приходит код? Проверь время на телефоне». При persistent fail — admin поддержка через recovery codes. |
| **In-memory setup-session при scale-out** | Low (1 prod node на 2026-05-01) | Документируем follow-up: при переходе на 2+ node переносим в Redis (`@upstash/redis` или нативная Beget Redis). На MVP не нужно. |
| **Пользователь забыл disable перед увольнением cms-роли** | Medium | admin может удалить user через Payload UI → Cascade удаляет recoveryCodes (FK). Secret шифрован → бесполезен после удаления. Standard hygiene, не нужно отдельной фичи. |

---

## Out of scope (явно)

- **WebAuthn / passkeys / FIDO2** — отдельный US (PANEL-AUTH-WEBAUTHN), может прийти позже как «вместо или вместе с TOTP».
- **Forced 2FA для всех users** (admin enforcement) — opt-in only. Если оператор захочет «все админы обязаны включить» — отдельный mini-US.
- **SSO / SAML / OIDC / OAuth Google** — single-tenant single-operator проект, нет b2b-кейса.
- **2FA для shop customers** (`apps/shop/`) — owner `poshop`, отдельный US в shop-беклоге, brand-guide §31.7 уже описывает паттерн для public.
- **SMS 2FA** — SIM-swap risk в РФ, brand-guide §31.7 явно запрещает.
- **Push 2FA через Telegram bot** — coupling с PAN-9 (см. отвергнутый W2.B). Не делаем.
- **Email recovery codes** — нет SMTP, и это persistent-copy-leak risk.
- **Master admin override** для разблокировки чужого аккаунта — single-tenant, антипаттерн.
- **2FA UI в mobile-app** (его нет на 2026-05-01).

---

## Open questions

**НЕТ.** Operator approved «делаем сейчас» 2026-05-01 (autonomous mandate).
Все decisions ниже зафиксированы как PO defaults в этом spec без эскалации:

| Decision | Default (sa-panel) |
|---|---|
| Opt-in vs forced 2FA | Opt-in (default `totpEnabled: false`) |
| Алгоритм TOTP | sha1, 30s step, 6 digits (Google Authenticator default) |
| Window tolerance | ±1 step (±30 сек) |
| Recovery codes count | 10 |
| Recovery codes format | `XXXX-XXXX-XXXX` base32 (60 bit entropy) |
| Recovery codes hash | bcrypt cost 10 |
| `totpSecret` encryption | AES-256-GCM, key из `TOTP_ENCRYPTION_KEY` env |
| Setup session storage | In-memory Map (10-min TTL); Redis — follow-up при scale-out |
| `passedSecondFactor` flag storage | HTTP-only cookie `obihod_2fa_passed`, sha256-bound к session |
| Disable требования | password + (OTP или recovery code) |
| Regenerate codes требования | current OTP |
| Admin override / master key | НЕ делаем |
| Forced enrollment | НЕ делаем |

---

## Definition of Done (для задачи целиком)

- [ ] AC-1..7 реализованы и закрыты `qa-panel`.
- [ ] Migration applied на staging без downtime; `dba` подтвердил.
- [ ] `TOTP_ENCRYPTION_KEY` добавлен в GitHub Actions secrets и `.env.example` (с double quotes).
- [ ] `cr-panel` security review прошёл: нет логирования secret/otp/recovery codes; нет API утечки `totpSecretEnc` / `recoveryCodes` (grep по response payloads).
- [ ] Playwright e2e: setup → verify → recovery codes shown → logout → login → second-factor screen → OTP success → admin.
- [ ] Playwright e2e: login → second-factor → recovery code success → consumed (повторное использование того же кода → 401).
- [ ] Playwright e2e: backwards compat — seed admin без 2FA логинится без второго шага.
- [ ] Vitest unit-tests: `encryptSecret/decryptSecret` round-trip + edge cases; `recoveryCodes` generate/hash/verify; `totpVerify` valid/invalid/window tolerance.
- [ ] A11y WCAG 2.2 AA: aria-live на error/success, autocomplete `one-time-code` на OTP input, focus-visible на all interactive, keyboard-only flow, reduced-motion guard.
- [ ] Doc: `site/lib/auth/totp/README.md` — как работает + как разблокировать пользователя CLI-скриптом + how to rotate key (placeholder с warning).
- [ ] `release` собирает RC + checklist соответствия.
- [ ] `leadqa` smoke: реальный browser, реальный Google Authenticator (или 1Password) — устанавливает QR, логинится, использует один recovery code.
- [ ] Operator approve.

---

## Dev breakdown (preview для popanel)

| Task | Owner | Объём (estimate) |
|---|---|---|
| Migration `users_totp_fields` + Users.ts fields extension | be-panel + dba | 0.2 чд |
| `site/lib/auth/totp/` — encrypt + recoveryCodes + totpVerify + setupSession + tests | be-panel | 0.4 чд |
| 5 endpoints (`/api/admin/auth/2fa-*`) | be-panel | 0.4 чд |
| Second-factor middleware (cookie-binding + redirect) | be-panel | 0.2 чд |
| `/admin/login/2fa` route (Next.js page + form) | fe-panel | 0.3 чд |
| Profile «Безопасность» tab + Setup modal + Recovery codes screen | fe-panel | 0.5 чд |
| `.env.example` + GitHub Actions secret + startup check | do | 0.1 чд |
| Playwright e2e (3 сценария) | qa-panel | 0.4 чд |
| Vitest units (encrypt/recoveryCodes/totpVerify) | be-panel | 0.2 чд |
| `cr-panel` security review (grep logs, API leak check) | cr-panel | 0.2 чд |
| `site/lib/auth/totp/README.md` (CLI unlock + rotation placeholder) | be-panel | 0.1 чд |

**Итого:** ~3.0 чд. Можно сжать до 2 чд если be-panel и fe-panel параллелят
(endpoints + UI независимы за исключением API contract — он зафиксирован в
этом spec).

**Параллелизация (blueprint dependency edges):**
- Migration → blocks все остальные (один шаг, быстро)
- `lib/auth/totp/` → blocks endpoints (но не UI — UI работает с mock API)
- Endpoints || UI (после migration) — параллельно
- Middleware → integrate последним
- e2e + cr — после dev-готовности

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | spec request (autonomous mandate, operator approved «делаем сейчас»). Skill-check `product-capability` + `blueprint` + `design-system` обязателен. Open questions делаешь как PO defaults. |
| 2026-05-01 | sa-panel | popanel | spec ready for review: `specs/PANEL-AUTH-2FA/sa-panel.md`. AC-1..7 + brand-guide §12 mapping + architecture (collection ext + 5 endpoints + middleware) + libs (otplib + qrcode + bcryptjs) + migration plan + recovery codes detailed + AES-256-GCM encryption detailed + risks + out-of-scope + DoD + dev breakdown. Ноль open questions. Готов к передаче в be-panel + fe-panel после твоего approve. |
