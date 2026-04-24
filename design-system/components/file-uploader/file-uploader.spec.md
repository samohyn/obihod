# FileUploader · spec

**Статус:** v0.9 · draft · роль `ui` · утверждено `art`
**Зависит от:** [input.spec.md](../input/input.spec.md), [feedback-states.spec.md](../feedback-states/feedback-states.spec.md)
**Родительский компонент:** [photo-quote-form.spec.md](../photo-quote-form/photo-quote-form.spec.md) — главный use-case.

## Purpose

Принять 1-6 фотографий объекта для AI-сметы через Claude API. Работает как drag-n-drop (desktop) и picker (mobile), с превью, прогрессом загрузки, валидацией, удалением.

## Принятые форматы

| Формат | Поддержка | Комментарий |
|---|---|---|
| JPG / JPEG | ✅ native | Основной формат с телефонов |
| PNG | ✅ native | Скриншоты, ручная обработка |
| HEIC | ⚠️ convert client-side | iPhone default. Конверсия в JPEG через `heic2any` перед отправкой (Claude API не все модели поддерживают HEIC) |
| WebP | ✅ native | Современные Android |
| PDF | ❌ | Явно отклонён — «Пришлите фото, не документ» |
| GIF / BMP / TIFF | ❌ | Редкие форматы, не нужны |

**Лимит:** 20 МБ per file, 6 файлов total.

## Anatomy

### Empty state

```
┌──────────────────────────────────────────┐
│                                          │
│          [icon cloud-up 48]              │  ← lucide UploadCloud или brand mark
│                                          │
│   Перетащите фото или выберите           │  ← h-s
│   JPG, PNG, HEIC — до 20 МБ каждое       │  ← caption muted
│                                          │
│   [ Выбрать файлы ]                      │  ← btn-ghost
│                                          │
└──────────────────────────────────────────┘
```

Dash border 2 px `var(--c-line)` round. При dragover — `var(--c-primary)` + bg `var(--c-bg-alt)`.

### Filled state (1-6 thumbs)

```
┌──────────────────────────────────────────┐
│ [thumb][thumb][thumb] [+ добавить]       │
│ 3 из 6  · 4.2 МБ                         │
└──────────────────────────────────────────┘
```

Thumb 80×80 с close-button (×) в правом верхнем углу. «+ добавить» — dashed thumb с плюсом.

### Uploading (progress)

```
┌──────────────────────────────────────────┐
│ [thumb ▓▓▓▓▓░ 67%] [thumb ✓]             │
└──────────────────────────────────────────┘
```

Progress bar поверх thumb'а (bottom 4 px, `var(--c-primary)` + `var(--c-bg-alt)` fill). Галочка `{c.success}` при завершении.

### Error на одном файле

```
┌──────────────────────────────────────────┐
│ [thumb red-border ⚠]                     │
│ ⚠ large.heic — больше 20 МБ, сожмите     │  ← error text mono 12 px
└──────────────────────────────────────────┘
```

Красная рамка thumb + inline error с конкретной причиной + кнопка «Убрать». Остальные файлы продолжают загружаться.

## States (общие)

| State | Поведение |
|---|---|
| `idle` | Пустая drop-zone |
| `dragover` | Border primary + bg-alt + label «Отпустите — загрузим» |
| `has-files` | Thumbs + «+ добавить» (если < 6) |
| `uploading` | Per-file progress, общий summary бар |
| `success` | Все чекмарки, готово к submit формы |
| `error` | Красная рамка thumb, inline error text per file |
| `disabled` | При submit родительской формы |

## Behavior

### Добавление файлов

1. **Drag-n-drop** (desktop) — drop-zone отображается визуально при dragenter/dragover.
2. **Click → picker** — открывает нативный `<input type="file" multiple accept="image/*">`.
3. **Paste (clipboard)** — скрин из буфера тоже принимается.

### Валидация (клиент-сайд)

- **Тип:** MIME starts with `image/` AND extension в whitelist.
- **Размер:** `file.size <= 20 * 1024 * 1024`.
- **Количество:** текущий + добавляемые ≤ 6.
- **HEIC:** автоматическая конверсия через `heic2any` (async, показываем spinner на thumb).

Инвалид файлы **не добавляются в state**, показывается inline-error с конкретной причиной.

### Upload

- **Параллельная загрузка** (не последовательно) — до 3 одновременно (browser limit).
- **POST** multipart → `/api/leads/upload` (backend — `be3/be4`, Beget S3-совместимое).
- **Retry:** 2 попытки с exponential backoff при сетевых ошибках.
- **Прерывание:** при удалении thumb во время upload — `AbortController.abort()`.

### Удаление

Click на × → файл удаляется из state + abort если в процессе upload + удаляется из S3 (DELETE запрос) если уже загружен.

## Token usage

```css
/* drop zone */
border: 2px dashed var(--c-line);
border-radius: var(--radius-lg);
padding: 48px 24px;
background: var(--c-card);
min-height: 200px;
transition: all {duration.fast} {ease.standard};

/* dragover */
border-color: var(--c-primary);
border-style: solid;
background: var(--c-bg-alt);

/* thumb */
width: 80px;
height: 80px;
border-radius: var(--radius);
background-size: cover;
position: relative;

/* thumb remove button */
position: absolute;
top: -6px;
right: -6px;
width: 20px;
height: 20px;
border-radius: 9999px;
background: var(--c-card);
color: var(--c-ink);
box-shadow: var(--shadow-sm);
```

## A11y

- **Keyboard:**
  - `Tab` на drop-zone → визуально фокус-ring.
  - `Enter` / `Space` → открыть file-picker.
  - `Tab` по добавленным thumb'ам → `Enter` открывает preview modal / `Delete` удаляет.
- **Screen reader:**
  - Drop-zone — `<button aria-label="Выбрать файлы для загрузки" aria-describedby="uploader-hint">`.
  - При добавлении — `aria-live="polite"` announce «Добавлено 3 файла из 6. 4.2 мегабайта».
  - При ошибке — `aria-live="assertive"` announce причину.
  - Thumbs — `<figure>` + `<figcaption class="sr-only">{filename}</figcaption>` + remove-button `aria-label="Убрать {filename}"`.
- **Touch:** iOS/Android отлично обрабатывают нативный `<input type="file">`, drag-n-drop туда не нужен.

## Responsive

- **Mobile (≤ 640):** drop-zone меньше padding (32×16), thumbs 64×64 (4 в ряд без переноса).
- **Tablet+ :** full design (80×80 thumbs, 48×24 padding).

## Edge cases

- **Очень медленный 4G:** показываем estimated time («Осталось ~45 секунд»), retry buttons если timeout.
- **Файл с одинаковым именем дважды:** rename client-side (`photo.jpg` → `photo-2.jpg`) или skip с сообщением.
- **iPhone landscape HEIC → корректная ориентация:** `heic2any` уважает EXIF orientation.
- **Offline:** при потере соединения — файлы остаются в state с badge «Ждём сеть», автоматический resume при возврате online.
- **Submit формы с неполным upload:** блокируем submit, показываем «Ждём 2 файла», либо предлагаем отправить без них.

## Security

- **Клиент-сайд валидация — не безопасность, только UX.** Все проверки дублируются на backend.
- **Magic bytes check** — backend проверяет что файл действительно image/\* (не MIME spoofing).
- **Image dimensions cap** — отклоняем файлы > 10000×10000 px.
- **Content scan** — опционально через внешний сервис (NSFW detection, future).
- **Rate limit:** 50 upload'ов / IP / час.
- **S3 signed URLs:** backend возвращает presigned URL для прямой загрузки (минует Next.js сервер для больших файлов).

## DoD

- [x] All states (idle / dragover / has-files / uploading / success / error)
- [x] Форматы + лимиты + валидация
- [x] Token usage
- [x] A11y (keyboard + screen reader + touch)
- [x] Security (двойная валидация client+server)
- [x] Edge cases
- [ ] React `<FileUploader>` компонент — **TODO** (dependency PhotoQuoteForm)
- [ ] Backend `/api/leads/upload` + S3 integration — **TODO be3**
- [ ] `heic2any` интеграция + bundle size проверка — `heic2any` ~500 KB, загружается lazy только при HEIC
