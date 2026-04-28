# US-8: Фичи (калькулятор, формы, фото→смета) — Payload Leads без внешней CRM

**Автор intake:** in
**Дата:** 2026-04-24 (обновлено 2026-04-27 — оператор вырезал amoCRM из scope)
**Linear Issue:** [OBI-4](https://linear.app/samohyn/issue/OBI-4) (state: Backlog, labels: `Feature`, `P1`, project: EPIC SITE-MANAGEABILITY)
**Тип:** feature
**Срочность:** high (P1)
**Сегмент:** cross
**Связано с:** EPIC SITE-MANAGEABILITY (эпик №6 из 8)
**Out of MVP (вынесено):**
- [OBI-25](https://linear.app/samohyn/issue/OBI-25) US-13 — amoCRM (blocked by аккаунт)
- [OBI-26](https://linear.app/samohyn/issue/OBI-26) US-14 — Wazzup24 / WhatsApp Business (P3, blocked by аккаунт)
- [OBI-27](https://linear.app/samohyn/issue/OBI-27) US-15 — Колтрекинг Calltouch/CoMagic (P3, blocked by сервис)

---

## Исходный запрос оператора (2026-04-24)

> 6 - допиливаем фичи (калькулятор, формы итд) + делаем интеграции с crm

## Изменение скоупа оператором (2026-04-27)

> «давай исключим пока что интеграцию с amocrm, будем пока пользоваться своей панелькой в payload в us-8»

amoCRM-интеграция перенесена в US-13 (OBI-25) — отдельный future-issue, заблокированный отсутствием аккаунта amoCRM. На MVP работаем с Payload Leads + Telegram-уведомлением оператору.

### Дополнительные решения оператора 2026-04-27

| # | Вопрос | Ответ |
|---|---|---|
| 1 | Telegram-бот для уведомлений оператору | **Используем существующий бот**. Нужны `TELEGRAM_BOT_TOKEN` + `TELEGRAM_OPERATOR_CHAT_ID` от оператора |
| 2 | Wazzup24 (WhatsApp Business) | **Не делаем в MVP** → вынесено в US-14 ([OBI-26](https://linear.app/samohyn/issue/OBI-26)) |
| 3 | Колтрекинг (Calltouch / CoMagic) | **Не делаем в MVP** → вынесено в US-15 ([OBI-27](https://linear.app/samohyn/issue/OBI-27)) |
| 4 | hCaptcha vs reCAPTCHA | **hCaptcha** ✅ (РФ-friendly, без VPN) |

**Wazzup24 / Колтрекинг** не блокируют MVP — сайт стартует с одним статичным номером в SiteChrome, оператор отвечает в WhatsApp с личного телефона. Подключение этих интеграций — отдельные future-issues, активируются по решению оператора («когда поток окрепнет»).

**Из исходного scope также убрано Wazzup24 из формы «Фото → смета»** — клиент получает ответ через свой исходный канал (Telegram-бот сайта / звонок оператору / личный WhatsApp оператора).

---

## Резюме запроса (актуализировано)

Реализовать функциональные блоки сайта, которые превращают его из «визитки» в «заявочную воронку» **на собственной инфраструктуре**:

1. **Калькулятор(ы)** — конфигурируемые через Payload (коэффициенты высоты/диаметра/доступа/спецтехники в CMS, не в коде), финальное решение по количеству (1 универсальный vs 4 отдельных) приходит из US-5.
2. **Форма «Фото → смета за 10 минут»** — загрузка 1–6 фото, адрес/район, услуга (предзаполняется из URL programmatic), телефон, мессенджер → Claude API (Sonnet 4.6) генерирует черновик сметы → запись в `Leads.aiDraft` со статусом `draft-ready` → **уведомление в существующий Telegram-бот оператора** со ссылкой на Lead → оператор/бригадир правит смету в Payload admin, шлёт клиенту через свой канал (звонок / личный мессенджер).
3. **Универсальная форма лида** (короткая и длинная версия) с Zod-валидацией, **hCaptcha**, honeypot, записью в Leads collection.
4. **Messenger-каналы для приёма заявок** (не CRM) — **Telegram Bot** для приёма фото от клиента + триггер в Claude API. **MAX Bot** — параллельный канал (уточнить активность). **Wazzup24 — out of MVP → OBI-26**.
5. **Я.Метрика + Я.Вебмастер цели** — все CTA, submit формы, phone-click, messenger-click, просмотр pricing.
6. **Sentry** — ошибки фронта и API.

**Колтрекинг — out of MVP → OBI-27.** Запускаемся с одним статичным номером в SiteChrome.

**Дедупликация в MVP без amoCRM:** уникальный индекс по `phone` (нормализация `+7XXXXXXXXXX`) в Leads collection через Payload `beforeChange` hook.

**UTM сохраняем в `Leads.utm` уже сейчас** — пригодится при подключении amoCRM (US-13).

## Открытые вопросы к оператору (актуализировано 2026-04-27)

Закрытые:
1. ~~**amoCRM**~~ — out of MVP → [OBI-25](https://linear.app/samohyn/issue/OBI-25).
2. ~~**Telegram-бот оператору**~~ — оператор подтвердил: **существующий бот** (нужны `TELEGRAM_BOT_TOKEN` + `TELEGRAM_OPERATOR_CHAT_ID`).
3. ~~**Wazzup24**~~ — out of MVP → [OBI-26](https://linear.app/samohyn/issue/OBI-26).
4. ~~**Колтрекинг**~~ — out of MVP → [OBI-27](https://linear.app/samohyn/issue/OBI-27).
5. ~~**hCaptcha vs reCAPTCHA**~~ — выбрана **hCaptcha** ✅.

Остаются открытыми:

6. **Claude API (Anthropic) доступ из РФ** — VPN/прокси-slave на VPS Beget? Или через Cloudflare AI Gateway? Нужен `tamd` ADR.
7. **MAX Bot** — оставляем как параллельный канал к Telegram Bot? Рекомендация PO: оставить (РФ-альтернатива, низкая цена реализации).
8. **Личный кабинет клиента** — рекомендация PO: backlog (отдельный US после US-8 закрытия).
9. **Telegram-бот для уведомлений оператору** — нужны от оператора: `TELEGRAM_BOT_TOKEN` (от @BotFather) и `TELEGRAM_OPERATOR_CHAT_ID` оператора. Сохранить в `~/.claude/secrets/obikhod-telegram.env`.

## Предварительный бриф для BA (актуализировано)

1. **Цель:** заявки идут, **Payload admin Leads** наполняется, фото → смета работает, оператор получает Telegram-уведомление в течение 1 минуты.
2. **Метрики:**
   - SLA «фото → черновик сметы» ≤ 10 минут.
   - Дедупликация **Payload Leads** по телефону — 100% (Payload `beforeChange` hook).
   - CR формы главной ≥ 3% (цель Я.Метрики).
   - Sentry: 0 unhandled errors на critical path (submit формы, upload фото, Claude API call).
   - **MVP-метрика операционки:** оператор получает Telegram-уведомление в течение 1 минуты после submit формы.
3. **Границы:**
   - IN: 7 пунктов резюме (без amoCRM webhook).
   - OUT: amoCRM (US-13 / OBI-25); внешние рекламные кабинеты (Я.Директ, VK); B2B-кабинет в полноценном формате (backlog); личный кабинет клиента (backlog).
4. **Состав команды:**
   - `ba` — scope + AC
   - `sa` — архитектура (где Claude API-слой, как кешируем prompt, как Telegram-бот шлёт уведомления оператору)
   - `tamd` — ADR на Claude API proxy из РФ (amoCRM mapping ADR — отложен в US-13)
   - `fe1` + `fe2` — формы, калькулятор, загрузчик фото, Я.Метрика события
   - `be3` — Claude API wrapper (с prompt caching, skill `claude-api` обязателен), **Telegram bot для уведомлений оператору**, dedup hook на Leads
   - `be4` — Payload-поля для калькулятора (коэффициенты), Leads схема расширение, Forms collection для A/B-вариантов
   - `seo2` — `sameAs` для мессенджеров, microdata для форм
   - `qa2` — E2E (Playwright): full flow заявки, дедуп, фейлы
   - `pa` — настройка Я.Метрики целей и сегментов
   - `out` — accept

## Связи

- **Blocks:** US-9 (регресс включает тесты на фичи).
- **Blocked by:** US-5 (IA определяет где рендерим фичи), US-3 (CMS для управляемости калькулятора). По правилу 1→8 — после US-7.

## Антидубль-проверка

- `site/app/api/fal/` + `site/lib/fal/` — работают локально (handoff.md) для генерации медиа. Не пересекается с Claude API для сметы.
- `Leads` collection уже есть.

## Готовность к передаче

- [ ] Оператор ответил на 6 вопросов.
- [ ] Передано ba после US-7.

---

## Service-meta

- **Файл:** `team/specs/US-8-features-and-crm/intake.md`
- **Linear labels:** `Feature`, `P1`, `cross`, `phase:intake`, `role:in`, `AI`, `Forms`, `Payload-Leads`
- **Assignee:** оператор
