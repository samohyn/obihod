# Telegram Bot Setup — operator guide

Закрывает [PAN-9](https://linear.app/samohyn/issue/PAN-9) AC «Документация».

**Бот:** `@obipanelbot` (existing, оператор передал TOKEN podev 2026-04-29).

Используется двумя контурами:

- **PAN-11 / Wave 2.B** — magic-link login в `/admin/login/`
- **OBI-4 / US-8** — уведомления оператору о новых Leads

`chat_id` оператора хранится в `Users.telegramChatId` (привязка по `OPERATOR_EMAIL`), отдельной env `TELEGRAM_OPERATOR_CHAT_ID` нет.

---

## Шаг 1. TOKEN (готово)

TOKEN от @BotFather лежит в `~/.claude/secrets/obikhod-telegram.env` на машине оператора. Передача в shared/.env на VPS — Шаг 2 (зона `do`).

Если потерян — `@BotFather` → `/mybots` → `@obipanelbot` → `API Token`.

## Шаг 2. ENV на VPS (зона do)

Добавить в `/home/deploy/obikhod/shared/.env`:

```
TELEGRAM_BOT_TOKEN="…токен…"
TELEGRAM_WEBHOOK_SECRET="…openssl rand -base64 32…"
OPERATOR_EMAIL="samohingeorgy@gmail.com"
```

Double quotes обязательны для значений с пробелами/кириллицей (memory `feedback_env_example_quoting.md` — incident 2026-04-28 deploy.yml exit 127 на `SMTP_FROM_NAME=Обиход admin`).

`WEBHOOK_SECRET` можно взять из `~/.claude/secrets/obikhod-telegram.env` (сгенерирован 2026-04-29) либо сгенерировать на VPS заново — главное чтобы тот же secret пошёл в `setWebhook` Шаг 4.

PM2 reload:

```bash
ssh root@45.153.190.107 'sudo -u deploy pm2 reload obikhod --update-env'
```

## Шаг 3. Migration

`20260428_140000_users_telegram_chat_id` добавляет `users.telegram_chat_id` (nullable text). Проверить применена ли:

```bash
ssh root@45.153.190.107 "sudo -u postgres psql obikhod -c '\\d users'" | grep telegram_chat_id
```

Если нет — `cd /home/deploy/obikhod/current && sudo -u deploy pnpm payload migrate`.

## Шаг 4. setWebhook

URL: `https://obikhod.ru/api/telegram/webhook/` (trailing slash обязателен — Next 16 `trailingSlash: true`).

```bash
TOKEN="…"; SECRET="…"
curl -sS -X POST "https://api.telegram.org/bot${TOKEN}/setWebhook" \
  -H 'Content-Type: application/json' \
  -d "{\"url\":\"https://obikhod.ru/api/telegram/webhook/\",\"secret_token\":\"${SECRET}\",\"allowed_updates\":[\"message\"]}"
```

Verify:

```bash
curl -s "https://api.telegram.org/bot${TOKEN}/getWebhookInfo" | jq
```

`url` = `https://obikhod.ru/api/telegram/webhook/`, `pending_update_count` ≈ 0, `last_error_message` пуст.

## Шаг 5. /start от оператора

Открыть `@obipanelbot` в Telegram → `/start`. Webhook handler ([site/app/(payload)/api/telegram/webhook/route.ts](<../app/(payload)/api/telegram/webhook/route.ts>)):

- Сохранит `chat.id` в `Users.telegramChatId` (запись по `email = OPERATOR_EMAIL`).
- Пришлёт «Готов получать magic-link для входа в админку. Открой /admin/login и попроси ссылку — она прилетит сюда.»

Verify:

```bash
ssh root@45.153.190.107 "sudo -u postgres psql obikhod -c \"SELECT email, telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL\""
```

## Шаг 6. Smoke

```bash
set -a; . ~/.claude/secrets/obikhod-telegram.env; set +a
node site/scripts/admin/telegram-smoke.mjs           # readiness
node site/scripts/admin/telegram-smoke.mjs --send    # + тест-сообщение
```

Exit 0 + сообщение в Telegram = setup закрыт.

---

## Troubleshooting

| Симптом                                             | Причина                                            | Fix                                                  |
| --------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Webhook 401 на любой POST                           | `TELEGRAM_WEBHOOK_SECRET` не совпадает             | Перевыполни Шаг 4 с тем же SECRET, что в `.env`      |
| Webhook 500 «misconfigured»                         | `TELEGRAM_WEBHOOK_SECRET` отсутствует на VPS       | Шаг 2 + reload PM2                                   |
| `/start` приходит, но `users.telegram_chat_id` пуст | `OPERATOR_EMAIL` не задан / нет user с таким email | Создать user в `/admin/`, проверить ENV              |
| `getWebhookInfo.url` пуст                           | `setWebhook` не выполнен                           | Шаг 4                                                |
| `last_error_message: SSL …`                         | TLS на webhook домене                              | Verify `https://obikhod.ru/` отдаёт корректный HTTPS |
| Telegram 429 «Too Many Requests»                    | Превышен rate-limit (30/sec)                       | Не наш кейс на старте — оператор один                |
