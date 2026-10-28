# Уведомления о заявках в Telegram

Бот **@OBIHODLEADBOT**, сообщения получает владелец. С VPS в РФ `api.telegram.org` недоступен
(таймаут, проверено 28.10.2026), поэтому путь такой:

1. Сайт при новой заявке пишет файл в `/home/deploy/obikhod/shared/tg-outbox/` (`TELEGRAM_OUTBOX_DIR`,
   `site/lib/telegram/sendMessage.ts`).
2. `obikhod-tg-relay.path` сразу запускает `obikhod-tg-relay` (пользователь `deploy`): файл уходит
   коммитом в закрытый репозиторий **samohyn/obihod-tg-relay** (`queue/`), ключ
   `/home/deploy/.ssh/obikhod_tg_relay_ed25519` — deploy key с записью только в этот репозиторий.
   `obikhod-tg-relay.timer` раз в 2 минуты повторяет push, если GitHub был недоступен.
3. Workflow `Telegram` в ретрансляторе (копия — `relay-repo/`) расшифровывает и отправляет сообщение
   через Bot API. Секреты репозитория: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RELAY_KEY`.

В сообщении — номер заявки, **имя и телефон** (решение владельца 28.10.2026), срок ответа, услуга, район,
число фото, страница и ссылка на карточку. Почты, адреса, описания задачи и фото нет. Имя и телефон в
Telegram (ОАЭ) и через GitHub (США) — трансграничная передача (ст. 12 152-ФЗ): она описана в политике и
согласии на сайте (`pnpm stage8:legal-telegram`), уведомление Роскомнадзора — за владельцем. Поэтому в
репозиторий-ретранслятор сообщение попадает только зашифрованным: `queue/*.json.enc`, AES-256-CBC + PBKDF2,
ключ — `/home/deploy/.config/obikhod-tg-relay.key` на сервере и секрет `RELAY_KEY` (одно значение; без
файла ключа скрипт ничего не отправляет).
Основной канал по-прежнему почта (`LEAD_NOTIFY_EMAIL`); сбой Telegram заявку не теряет.

Установка и проверка:

```bash
tar -C deploy/telegram -cz . | ssh root@89.111.141.79 \
  'rm -rf /tmp/obikhod-tg-src && mkdir /tmp/obikhod-tg-src && tar -xz -C /tmp/obikhod-tg-src && bash /tmp/obikhod-tg-src/install.sh'
journalctl -u obikhod-tg-relay --since today      # что ушло в ретранслятор
gh run list -R samohyn/obihod-tg-relay             # что ушло в Telegram
```

Сменить токен бота — `gh secret set TELEGRAM_BOT_TOKEN -R samohyn/obihod-tg-relay`; получателя —
`TELEGRAM_CHAT_ID` там же (получатель должен хотя бы раз нажать у бота «Старт»). Сменить ключ шифрования:

```bash
K=$(openssl rand -base64 48 | tr -d '\n')
printf '%s' "$K" | gh secret set RELAY_KEY -R samohyn/obihod-tg-relay
printf '%s\n' "$K" | ssh root@89.111.141.79 'install -o deploy -g deploy -m 0600 /dev/stdin /home/deploy/.config/obikhod-tg-relay.key'
```
