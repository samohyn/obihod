# PAN-9 · Telegram bot setup — инструкция (для оператора + podev)

**Issue:** [PAN-9](https://linear.app/samohyn/issue/PAN-9)
**Owner:** `podev` (cross-team) + оператор (BotFather interaction)
**Объём:** ~1 чд

## Что нужно от оператора (manual steps)

Эти шаги может сделать **только оператор** (требует доступ к Telegram + Beget VPS).

### 1. Регистрация бота в @BotFather (5 минут)

1. Открой `@BotFather` в Telegram
2. Команда `/newbot`
3. Имя бота: `Обиход admin` (можно человеко-читаемое)
4. Username: `obikhod_admin_bot` (должен заканчиваться на `bot`, уникальный)
5. **Сохрани TOKEN** — длинная строка вида `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`
6. Команда `/setdescription` → бот шлёт magic-link для входа в админку Обихода
7. Команда `/setcommands`:
   ```
   start - Привязать аккаунт + получить приветствие
   help - Подсказка по boту
   ```

### 2. ENV setup на Beget VPS (через `do` или сам)

В `.env` на VPS добавь:

```bash
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=
OPERATOR_EMAIL=samohingeorgy@gmail.com
```

Также добавь в **GitHub Actions secrets** (для CI/CD pipeline):
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

### 3. Регистрация webhook URL (одной командой)

После deploy кода (`site/app/(payload)/api/telegram/webhook/route.ts` уже создан):

```bash
TOKEN=<TELEGRAM_BOT_TOKEN>
SECRET=<TELEGRAM_WEBHOOK_SECRET>
curl -X POST "https://api.telegram.org/bot${TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"https://obikhod.ru/api/telegram/webhook\",
    \"secret_token\": \"${SECRET}\",
    \"allowed_updates\": [\"message\"]
  }"
```

Verify через:
```bash
curl "https://api.telegram.org/bot${TOKEN}/getWebhookInfo"
```
Должно показать `url: "https://obikhod.ru/api/telegram/webhook"` + `pending_update_count: 0`.

### 4. Привязка оператора к боту

1. В Telegram открой `@obikhod_admin_bot`
2. Нажми `Start` (или команда `/start`)
3. Бот должен сохранить `chat_id` в `Users.telegramChatId` для оператора (через webhook handler)
4. Verify в admin: открой `/admin/collections/users`, найди свой email — поле `telegramChatId` должно быть заполнено

### 5. Smoke-test (опционально, после Wave 2.B)

После деплоя Wave 2.B (PAN-11):
1. `/admin/login` — введи email
2. Нажми «Получить ссылку»
3. Через 1-2 секунды должно прийти сообщение в Telegram от бота: «Войти: https://obikhod.ru/admin/login?token=...»
4. Кликни ссылку → попадёшь в admin без password

## Что нужно от podev (code work)

### Pre-flight check

- [ ] Прочитать [PAN-9](https://linear.app/samohyn/issue/PAN-9) полностью
- [ ] Прочитать ADR-0005 §Уровень 3 (НЕ трогаем native auth core)
- [ ] Активировать skill `architecture-decision-records` (на случай если всплывёт новый узел)

### Code work (после оператор-step 1)

- [ ] **`site/collections/Users.ts` patch** — добавить поле:
  ```typescript
  {
    name: 'telegramChatId',
    type: 'text',
    admin: { description: 'Chat ID Telegram бота для magic link login.', hidden: false },
  }
  ```
  Migration: `pnpm payload migrate:create --name=add-telegram-chat-id-to-users`

- [ ] **`site/lib/telegram/sendMessage.ts`** — уже scaffolded sa-panel'ом, проверить + протестировать

- [ ] **`site/app/(payload)/api/telegram/webhook/route.ts`** — уже scaffolded, добавить:
  - import `sendMessage` из `@/lib/telegram/sendMessage`
  - в обработчике `/start` после save `telegramChatId` отправить greeting:
    ```typescript
    await sendMessage({
      chatId: chat.id,
      text: 'Готов получать ссылки входа. Открой /admin/login и попроси magic link.',
    })
    ```

- [ ] **Integration test** (Vitest):
  - Mock Telegram API + webhook secret
  - Test `/start` команда → сохранение chat_id + greeting

- [ ] **Acceptance:**
  - [ ] Operator подтвердил «получил приветствие от бота»
  - [ ] `Users.telegramChatId` = chat_id в БД
  - [ ] Smoke в Wave 2.B (PAN-11): magic link приходит в Telegram

## Cross-team

**С US-8 Leads pipeline:**
- Если US-8 уже создал бот для уведомлений о заявках — переиспользуем тот же `TELEGRAM_BOT_TOKEN`. Просто добавляем команды `/start` + helper `sendMessage` для admin magic link.
- Если ещё нет — этот PAN-9 покрывает первую регистрацию. US-8 потом будет использовать этот же helper.
- `podev` (PO product) и `popanel` (PO panel) синхронизируют через `cpo` если возникнут coordination questions.

## Risks

| Risk | Mitigation |
|---|---|
| Telegram API blocked в РФ (изредка) | Не критично — это admin tool, не публичный сайт. Email fallback (PAN-10) покрывает. |
| Bot токен утечка | Storage только в ENV, не commit'ить в git. Rotation план — каждые 6 мес или при подозрении. |
| Webhook без secret | TODO в коде уже есть — endpoint падает 401 без правильного `X-Telegram-Bot-Api-Secret-Token`. |
| Spam через `/start` | После регистрации оператора — webhook игнорирует `/start` от других chat_id (single-user mode). |

## Файлы

```
site/lib/telegram/sendMessage.ts                        # scaffolded by sa-panel
site/app/(payload)/api/telegram/webhook/route.ts        # scaffolded by sa-panel
site/collections/Users.ts                               # patch + миграция (podev в dev-фазе)
team/specs/US-12-admin-redesign/pre-tasks/podev-telegram-bot-setup.md  # этот файл
```

## Pinging

- `popanel` — после оператор-step 1 → start dev
- `dba` — review миграции для `Users.telegramChatId`
- `do` — verify ENV в Beget VPS + GitHub Actions secrets
