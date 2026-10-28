# Уведомления о заявках в Telegram

Бот **@OBIHODLEADBOT**, сообщения получает владелец. С VPS в РФ `api.telegram.org` недоступен
(таймаут, проверено 28.10.2026), поэтому путь такой:

1. Сайт при новой заявке пишет файл в `/home/deploy/obikhod/shared/tg-outbox/` (`TELEGRAM_OUTBOX_DIR`,
   `site/lib/telegram/sendMessage.ts`).
2. `obikhod-tg-relay.path` сразу запускает `obikhod-tg-relay` (пользователь `deploy`): файл уходит
   коммитом в закрытый репозиторий **samohyn/obihod-tg-relay** (`queue/`), ключ
   `/home/deploy/.ssh/obikhod_tg_relay_ed25519` — deploy key с записью только в этот репозиторий.
   `obikhod-tg-relay.timer` раз в 2 минуты повторяет push, если GitHub был недоступен.
3. Workflow `Telegram` в ретрансляторе (копия — `relay-repo/`) отправляет сообщение через Bot API.
   Секреты репозитория: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

В сообщении нет телефона, имени, почты, адреса и текста задачи (152-ФЗ: Telegram и GitHub за рубежом) —
номер заявки, срок ответа, услуга, район, число фото, страница и ссылка на карточку в админке.
Основной канал по-прежнему почта (`LEAD_NOTIFY_EMAIL`); сбой Telegram заявку не теряет.

Установка и проверка:

```bash
tar -C deploy/telegram -cz . | ssh root@89.111.141.79 \
  'rm -rf /tmp/obikhod-tg-src && mkdir /tmp/obikhod-tg-src && tar -xz -C /tmp/obikhod-tg-src && bash /tmp/obikhod-tg-src/install.sh'
journalctl -u obikhod-tg-relay --since today      # что ушло в ретранслятор
gh run list -R samohyn/obihod-tg-relay             # что ушло в Telegram
```

Сменить токен бота — `gh secret set TELEGRAM_BOT_TOKEN -R samohyn/obihod-tg-relay`; получателя —
`TELEGRAM_CHAT_ID` там же (получатель должен хотя бы раз нажать у бота «Старт»).
