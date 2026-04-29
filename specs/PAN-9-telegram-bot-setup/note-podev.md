# PAN-9 · Telegram bot setup — note from podev

**Status:** Linear Done (28.04, code-side). Closure check 2026-04-29 + operator передал TOKEN.
**Issue:** [PAN-9](https://linear.app/samohyn/issue/PAN-9) · parent [PAN-1](https://linear.app/samohyn/issue/PAN-1) · blocks [PAN-11](https://linear.app/samohyn/issue/PAN-11) · related [PAN-10](https://linear.app/samohyn/issue/PAN-10)
**Bot:** `@obipanelbot`
**Owner:** podev (cross-team — общая инфра с US-8 leads)
**Skills активированы:** `design-system` (для аудита site/), `backend-patterns` (HTTP webhook integration)

## Что закрыто на code-side (28.04 + 29.04)

| AC | Артефакт | Status |
|---|---|---|
| `Users.telegramChatId` поле + миграция | `site/migrations/20260428_140000_users_telegram_chat_id.ts` | ✅ idempotent + rollback |
| `sendMessage` helper | `site/lib/telegram/sendMessage.ts` | ✅ full impl (timing-safe не нужен — это outbound) |
| Webhook `/start` handler | `site/app/(payload)/api/telegram/webhook/route.ts` | ✅ secret verify + chat_id save + greeting |
| `.env.example` плейсхолдеры | `site/.env.example:33-36` | ✅ TOKEN+SECRET+OPERATOR_EMAIL |
| `docs/telegram-bot-setup.md` | `site/docs/telegram-bot-setup.md` | ✅ 6 шагов + troubleshooting |
| Smoke script | `site/scripts/admin/telegram-smoke.mjs` | ✅ readiness + `--send` |
| Secrets файл | `~/.claude/secrets/obikhod-telegram.env` | ✅ TOKEN + USERNAME + OPERATOR_EMAIL + WEBHOOK_URL + WEBHOOK_SECRET (mode 600) |

## Что осталось — operator + do

| AC | Owner | Что нужно |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` + `WEBHOOK_SECRET` + `OPERATOR_EMAIL` на VPS | do | Из `~/.claude/secrets/obikhod-telegram.env` → `/home/deploy/obikhod/shared/.env` + PM2 reload |
| Migration applied на prod | do | Verify `\d users` или re-run migrate |
| `setWebhook` на Telegram side | do | curl с secret из shared/.env |
| /start от оператора | operator | Открыть `@obipanelbot` → `/start` → подтвердить greeting |
| Smoke prod (`--send`) | leadqa | Exit 0 + скриншот greeting |

## Архитектурное решение (фикс для PAN-11 и US-8)

**chat_id оператора живёт в `Users.telegramChatId`, не в env.**

US-8 intake (стр. 31, 73) изначально предполагал `TELEGRAM_OPERATOR_CHAT_ID` env. PAN-9 имплементация изменила: webhook handler заполняет `Users.telegramChatId` при `/start`, обе подсистемы (PAN-11 magic-link, US-8 leads-notify) ищут chat_id по `email = OPERATOR_EMAIL`.

**Why:** single-source. Если в будущем добавим вторую роль (бригадир получает уведомления о photo→quote), это станет `where: { role: { equals: 'foreman' } }` — без размножения env.

**How to apply:** US-8 leads-notify импортирует `sendMessage` + lookup chat_id через Payload Local API по OPERATOR_EMAIL. Не вводи `TELEGRAM_OPERATOR_CHAT_ID` env.

## Risks + open

1. **TLS** — webhook требует валидный TLS на `obikhod.ru`. Verified — HTTP/2 + HSTS preload (audit 2026-04-29 home screenshot).
2. **Webhook secret leak** — secret в `shared/.env` на VPS + `~/.claude/secrets/obikhod-telegram.env` локально. Если утечёт — `setWebhook` с новым secret. Не пушить в git.
3. **Bot privacy mode** — для magic-link не критично (only `/start`). При расширении на broadcast — `/setprivacy DISABLE` в @BotFather.
4. **MAX bot** (US-8 intake Q7) — параллельный канал, не блокирует PAN-9.

## DoD (по PO iron rule «local verification ДО push»)

- [x] Code-side артефакты на месте.
- [x] Docs `site/docs/telegram-bot-setup.md` — 6 шагов + troubleshooting.
- [x] Smoke script runnable локально с prod env.
- [x] Note-podev зафиксировал решение «chat_id через Users».
- [x] TOKEN получен от operator + сохранён в `~/.claude/secrets/`.
- [x] Локальный readiness smoke (`getMe` + `getWebhookInfo`) пройден.
- [ ] do выставил ENV+migration+setWebhook на prod.
- [ ] Operator сделал `/start` и получил greeting.
- [ ] leadqa прогнал `--send` smoke prod.

После 3 чекбоксов → закрываем PAN-9 финально и переключаем PAN-11 / OBI-4 в `phase:dev`.
