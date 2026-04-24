# PhotoQuoteForm · spec

**Статус:** v0.9 · draft · роль `ui` · утверждено `art` · ждёт реализации
**Зависит от:** [input.spec.md](../input/input.spec.md), [button.spec.md](../button/button.spec.md), [file-uploader.spec.md](../file-uploader/file-uploader.spec.md) (TODO)
**Бизнес-контекст:** главный дифференциатор Обихода — **«Фото → смета за 10 минут»**. Это основной конверсионный механизм сайта. Все остальные лид-формы — second best.

## Purpose

Пользователь загружает 1-6 фото объекта (дерево / крыша / куча мусора / разрушенный сарай), оставляет телефон и ждёт в выбранном мессенджере. Через ≤ 10 минут (Claude Sonnet 4.6 + prompt caching) на amoCRM приходит черновик сметы; бригадир подтверждает/корректирует → клиенту уходит финальная цена.

**Успех = заявка с фото на WhatsApp/Telegram за ≤ 60 секунд от клика до отправки.**

## Anatomy

```
┌──────────────────────────────────────────────┐
│ EYEBROW: 01 · Что у вас                      │  ← eyebrow
│ H2: Пришлите фото — ответим за 10 минут      │  ← h-l
│ LEAD: Спил, крыша, мусор, демонтаж           │  ← lead (список услуг)
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ DRAG-N-DROP ZONE (file-uploader)        │ │
│ │ Иконка + «Перетащите фото или [выбрать]»│ │
│ │ до 6 фото, JPG/PNG/HEIC, до 20 МБ каждое│ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ▪ [thumb] [thumb] [thumb]    ← превью       │
│                                              │
│ Телефон *                                    │
│ ┌──────────────────────────────────────────┐ │
│ │ +7 (985) 170-51-11                       │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Мессенджер *                                 │
│ ○ Telegram   ○ MAX   ○ WhatsApp   ○ Звонок │  ← radio-группа
│                                              │
│ Адрес объекта (опционально)                  │
│ ┌──────────────────────────────────────────┐ │
│ │ Раменское, Огородная 12                  │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Комментарий (опционально)                    │
│ ┌──────────────────────────────────────────┐ │
│ │ Спилить три берёзы у дома                │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ ☑ Согласен на обработку персональных данных │  ← checkbox required
│                                              │
│ [ Отправить — ответим за 10 минут ]          │  ← btn-primary, full-width mobile
│                                              │
│ Caption: Средний отклик сегодня — 7 минут    │  ← dynamic social-proof
└──────────────────────────────────────────────┘
```

## Flow и states

### State 1 · Idle (форма пустая)

- Drop-zone с иконкой `LogoMark.NE` (снежинка-роза как «указатель»).
- Hint: «Или [выберите файлы] с телефона»
- Submit disabled (нет файлов, нет телефона).

### State 2 · Files added

- Thumbnails 80×80 с кнопкой удаления (×).
- Валидация каждого файла: type ∈ {jpg/jpeg/png/heic/webp}, size ≤ 20 МБ.
- Ошибка отдельного файла: показываем красный thumb + caption с причиной.
- Кнопка submit активируется когда есть ≥ 1 валидный файл И phone валиден.

### State 3 · Submitting (loading)

- Submit button: spinner + label «Отправляем…» (см. button loading).
- Форма фиксируется (`pointer-events: none` на inputs, `opacity: 0.6`), чтобы нельзя было дважды нажать.
- **НЕ показываем модалку** — прогресс в button inline.

### State 4 · Success

- Форма **полностью заменяется** на success-card:
  ```
  ✓ Заявка OBI-2026-00042
  Напишем в Telegram на +7 985 170 51 11 за 10 минут.
  
  [ Открыть Telegram ] [ Позвонить сейчас ]
  ```
- `ID заявки` в mono + tabular-nums, крупно (h-m) — чтобы клиент мог скопировать/сказать.
- Fallback CTA «Позвонить» = tel:link.

### State 5 · Error (network / 500)

- Форма НЕ сбрасывается.
- Toast сверху (см. [feedback-states.spec.md](../feedback-states/feedback-states.spec.md)):
  «Заявка не ушла — проверьте интернет или напишите в Telegram напрямую: @obikhod_bot»
- Кнопка submit возвращается в default state, можно повторить.

## Copy

### Eyebrow
«01 · Что у вас» / «Оставьте заявку» / «Фото → смета»

### Заголовок
- **Main:** «Пришлите фото — ответим за 10 минут»
- **Alt (для B2B LP):** «Фото объекта — смета за 10 минут, договор за день»

### Lead
«Спил деревьев, чистка крыш, вывоз мусора, демонтаж. Фикс-цена за объект.»

### Micro-copy

| Элемент | Текст |
|---|---|
| Drop-zone empty | «Перетащите фото или выберите файлы» |
| Drop-zone hover/dragover | «Отпустите — загрузим» |
| Submit idle | «Отправить — ответим за 10 минут» |
| Submit loading | «Отправляем…» |
| Submit disabled (нет фото) | «Добавьте хотя бы одно фото» (в помощник под кнопкой) |
| Submit disabled (нет телефона) | «Укажите телефон для связи» |
| Consent | «Согласен на обработку персональных данных и [условия](/privacy)» |
| Success | «Заявка ОБИ-{{id}} принята. Напишем в {{channel}} за 10 минут» |
| Error (network) | «Заявка не ушла — проверьте интернет или напишите в Telegram @obikhod_bot» |
| Error (invalid file) | «{{name}} — не фото или больше 20 МБ. Сожмите или пришлите отдельно» |

### Social-proof caption

«Средний отклик сегодня — {{avg_minutes}} минут» — подтягивается из amoCRM metrics / Payload. Если > 15 минут — скрываем caption.

## Token usage

- Card container: `padding: {spacing.8}` на mobile, `{spacing.12}` desktop · `border-radius: {radius.xl}` · `background: var(--c-card)` · без тени, только `border: 1px solid var(--c-line)`.
- Form фон: `var(--c-bg)` (чтобы card выделялся белым).
- Spacing между секциями формы: `{spacing.6}`.

## A11y

- **Form semantics:** `<form>` с `onSubmit`. Поля сгруппированы `<fieldset><legend>` для radio-группы «Мессенджер».
- **Error announcement:** `role="alert"` на toast-ошибку, `aria-live="polite"` на inline helper ошибки.
- **Progress:** `aria-busy="true"` на form при submit.
- **Success focus:** после успеха фокус переходит на success-card `H3` (чтобы screen reader сразу прочитал).
- **File-uploader:** keyboard accessible, `Enter`/`Space` открывают диалог выбора файла.
- **Consent:** чекбокс с visible label, не прячем в мелкий `terms-and-conditions` текст.

## Responsive

- **Mobile:** все поля в колонку, submit — `w-full`, high-CTA зона (заголовок + drop-zone + submit) должна помещаться в 1 viewport на 390×844 (iPhone 14).
- **Tablet:** телефон + радио в 2 колонки.
- **Desktop:** форма max-width 520 px, центрированная, рядом может быть иллюстрация `LogoMark` или фото bricks at work.

## Integration

- **Frontend:** react-hook-form + Zod, submit POST в `/api/leads/photo-quote`.
- **Backend (be3/be4):** multipart upload в S3-совместимый Beget → создание lead в Payload → webhook в amoCRM → вызов Claude API с фото → amoCRM-комментарий с черновиком сметы.
- **Claude API:** skill `claude-api` — **обязательно prompt caching** (skill правило). Base prompt с каталогом услуг + ценообразованием кэшируется, меняются только фото + описание.
- **Analytics:** события «photo_quote_started», «photo_quote_file_added», «photo_quote_submitted», «photo_quote_success», «photo_quote_error» — через `aemd` агента.

## Security

- **Валидация файлов:** server-side проверка MIME (не только extension) + magic bytes + dimension limits. Клиент-сайд — только UX.
- **Rate limit:** 5 заявок / IP / час.
- **Spam:** honeypot field + hCaptcha для 6+ попыток за час.
- **PII:** phone + адрес — шифрование at-rest в Postgres, RLS на чтение только admin + owner.

## Edge cases

- **HEIC (iPhone):** конвертация в JPEG на клиенте через `heic2any` или server-side. HEIC отправлять в Claude **нельзя** — не все модели поддерживают.
- **Очень много фото (6+):** cap на 6, показываем helper «Максимум 6 — выберите самые показательные».
- **Медленный 4G:** visible upload-progress per file (см. file-uploader spec). Не блокируем UI — пользователь может заполнять остальные поля пока файлы летят.
- **iPhone offline → online во время submit:** react-query retry с backoff, но **не бесконечно** — после 3 неудач показываем error toast.
- **Адрес = полный адрес → CTA «Отправить бригаду» на B2B-версии:** в B2B-варианте формы прячем «Мессенджер» (только phone + email) и добавляем поле «УК / Организация».

## DoD

- [x] Anatomy + all states (idle/files/loading/success/error) задокументированы
- [x] Copy (заголовок, placeholder, helper, error, success) зафиксированы
- [x] TOV-фильтр пройден (нет анти-слов)
- [x] A11y-чеклист
- [x] Интеграция с backend + Claude описана
- [x] Security-требования (PII, rate limit, валидация)
- [ ] Реализация — **TODO** (отдельный US c `ba`→`sa`→`ui`→`fe`→`qa`)
- [ ] A/B-тест заголовка «за 10 минут» vs «за 15 минут» — после первых 100 заявок
