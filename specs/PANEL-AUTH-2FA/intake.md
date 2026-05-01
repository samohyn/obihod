---
us: PANEL-AUTH-2FA
title: TOTP 2FA для admin Payload (replacement дропнутого magic link W2.B)
team: panel
po: popanel
type: feature
priority: P2
segment: admin
phase: intake
role: popanel
status: spec-requested
blocks: []
blocked_by: []
related: [US-12-admin-redesign, sa-panel-wave2b-cancelled]
created: 2026-05-01
updated: 2026-05-01
skills_activated: []
---

# PANEL-AUTH-2FA — Intake

**Автор intake:** popanel
**Дата:** 2026-05-01
**Источник:** оператор approved 2026-05-01 «делаем сейчас» (см. memory `/Users/a36/.claude/projects/-Users-a36-obikhod/memory/project_panel_decisions_2026-05-01.md`).
**Тип:** feature (security extension над native Payload email+password auth).
**Срочность:** P2 — не блокирует daily ops оператора (admin сейчас защищён password manager + email+password Payload native), но закрывает реальный риск-вектор «утечка credentials → доступ к Leads + cms».
**Сегмент:** admin (`/admin`).

---

## Контекст: replacement дропнутого magic link W2.B

В US-12 admin-redesign Wave 2.B (`specs/US-12-admin-redesign/sa-panel-wave2b.md`,
status `cancelled` 2026-04-29) предлагался magic link через Telegram + email
fallback как passwordless flow. Решение об отмене зафиксировано там же:
- стоимость 2.5 ЧД + блок на PAN-9 (Telegram bot) + PAN-10 (SMTP);
- token в URL — security compromise того же риск-уровня, что и пароль в
  password manager;
- coupling admin auth с Telegram bot, который нужен под US-8 lead notifications
  совсем по другому owner-у;
- закрывалось предложением «password manager + TOTP 2FA (1 ЧД, одна коллекция)».

PANEL-AUTH-2FA — реализация этого предложения. Cheaper, focused на реальной
угрозе (фишинг + утечка credentials), без зависимости от Telegram/SMTP infra.

---

## Резюме задачи

`sa-panel` пишет полный spec на TOTP 2FA для admin Payload (Google Authenticator
/ 1Password / Authy compatible):

1. **Setup flow** в admin profile (Users edit-view): «Включить 2FA» → QR + manual
   secret → ввод OTP для verify → показ 10 recovery codes ОДИН раз.
2. **Login flow extension:** после email/password если `totpEnabled === true` →
   second screen request OTP (или recovery code link).
3. **Disable flow:** требует current password + current OTP (или recovery code).
4. **Backwards compat:** existing seed admin (`admin@obikhod.local`) продолжает
   работать без 2FA (default `totpEnabled: false`); setup опционально.
5. **Brand-guide §12.1 Login** — second screen 2FA вписан в две ступени с теми
   же tokens (карточка-форма 320 px, primary янтарная). Setup screen в admin
   profile + recovery codes screen — по §12.4 form rows + §12.4.1 interaction
   states.

**Output:** `sa-panel.md` с архитектурой, AC (5-7), risks, миграцией, библиотеками.

---

## Deliverables (spec фаза)

| # | Артефакт | Owner | Путь |
|---|---|---|---|
| 1 | Spec sa-panel.md (architecture + AC + risks + decisions) | sa-panel | `specs/PANEL-AUTH-2FA/sa-panel.md` |
| 2 | Hand-off log в spec | sa-panel | § Hand-off log в `sa-panel.md` |

---

## Out of scope (явно)

- **WebAuthn / passkeys** — отдельный US (PANEL-AUTH-WEBAUTHN при необходимости).
- **Forced 2FA для всех users** — opt-in only, default off для backwards compat.
- **SSO / SAML / OIDC** — нет b2b-need у admin (1 оператор + 2-3 cms-роли).
- **2FA для shop customers** — owner `poshop`, отдельный US в shop-беклоге.
- **SMS 2FA** — SIM-swap risk в РФ, см. brand-guide §31.7 «Не SMS как 2-й
  фактор».

---

## Зависимости

**Blocked by:** нет. Native Payload email+password (Wave 2.A US-12) уже работает
в main, расширяем поверх.

**Related (informational):**
- **sa-panel-wave2b.md** (cancelled) — historical reference для UX-боли, которую
  изначально пытался закрыть magic link. Большая часть отвергнутых решений
  (passwordless через Telegram, email fallback, custom auth strategy для
  `payload.login` без password) — **не переносим**, остаётся native auth +
  TOTP overlay.
- **US-12 admin-redesign** — login screen и admin profile уже визуально готовы
  (custom.scss W1-W11 в main). 2FA добавляется как minor extension UI без
  переработки.

---

## Hand-off log

| Когда | От | Кому | Что |
|---|---|---|---|
| 2026-05-01 | popanel | sa-panel | intake assigned, прошу spec по TOTP 2FA для admin (replacement W2.B). Skill-check: `product-capability` + `blueprint` + `design-system`. Operator approved «делаем сейчас» — autonomous mandate, open questions делаешь как PO defaults в spec, не запрашиваешь оператора. Output — `sa-panel.md` в этой папке. После spec → ko popanel review → operator approve → передача в be-panel + fe-panel. |
