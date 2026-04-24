# Form schemas · spec

**Статус:** v1.0 · approved 2026-04-24
**Зона:** shared Zod-схемы и утилиты для всех форм Обихода. Разблокирует PhotoQuoteForm / LeadForm / CtaMessengers / Calculator.
**Реализация:** `site/lib/forms/` — **TODO для fe1+be3** (отдельный US, spec готов).

## Purpose

На сайте 4+ формы, каждая требует phone + consent + частично name/address/files. Без shared-слоя каждая форма дублирует валидацию и formatting → дрейф форматов, расхождение с backend, регрессии при правке TOV.

## Стек

- **Zod** — validation (уже в package.json через shadcn/ui)
- **react-hook-form** — form state
- **@hookform/resolvers/zod** — мост
- **libphonenumber-js** — нормализация RU-телефонов к E.164

## Базовые схемы

### `phoneRUSchema`

```ts
import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const phoneRUSchema = z
  .string()
  .trim()
  .min(1, 'Укажите телефон для связи')
  .transform((raw, ctx) => {
    // Нормализация: +7/8 → +7, убрать пробелы/скобки/дефисы
    const parsed = parsePhoneNumberFromString(raw, 'RU')
    if (!parsed || !parsed.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Номер без пробелов — 10 цифр после +7',
      })
      return z.NEVER
    }
    return parsed.format('E.164') // "+79851705111"
  })
```

**Принимает:** `+7 985 170 51 11`, `89851705111`, `+7(985)170-51-11`, `985 170 51 11`
**Возвращает:** `+79851705111` (E.164)

### `nameSchema`

```ts
export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Имя от 2 букв')
  .max(100, 'Имя до 100 знаков')
```

### `consentSchema`

```ts
export const consentSchema = z.literal(true, {
  errorMap: () => ({ message: 'Согласие обязательно для отправки' }),
})
```

**Usage:** `<input type="checkbox">` должен быть checked (not just boolean). Обиход использует literal(true) — это явно, не zod.boolean().

### `messengerChannelSchema`

```ts
export const messengerChannelSchema = z.enum(['telegram', 'max', 'whatsapp', 'phone'], {
  errorMap: () => ({ message: 'Выберите канал связи' }),
})
```

### `addressSchema` (опциональное поле)

```ts
export const addressSchema = z
  .string()
  .trim()
  .max(300, 'Адрес до 300 знаков')
  .optional()
```

### `commentSchema`

```ts
export const commentSchema = z
  .string()
  .trim()
  .max(1000, 'До 1000 знаков')
  .optional()
```

### `photoUploadSchema` (файлы)

```ts
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
export const MAX_FILES = 6
export const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']

export const photoFileSchema = z.custom<File>((file) => file instanceof File, 'Нужен файл')
  .refine((f) => f.size <= MAX_FILE_SIZE, (f) => ({ message: `${f.name} больше 20 МБ — сожмите` }))
  .refine((f) => ACCEPTED_MIME.includes(f.type), (f) => ({ message: `${f.name} не фото` }))

export const photoUploadSchema = z
  .array(photoFileSchema)
  .min(1, 'Добавьте хотя бы одно фото')
  .max(MAX_FILES, `Максимум ${MAX_FILES} фото — выберите самые показательные`)
```

## Композитные схемы

### `leadFormSchema` (простая форма на лендинге)

```ts
export const leadFormSchema = z.object({
  name: nameSchema.optional(), // опционально
  phone: phoneRUSchema,
  channel: messengerChannelSchema,
  comment: commentSchema,
  consent: consentSchema,
})

export type LeadFormInput = z.infer<typeof leadFormSchema>
```

### `photoQuoteFormSchema` (главный конверсионный компонент)

```ts
export const photoQuoteFormSchema = z.object({
  phone: phoneRUSchema,
  channel: messengerChannelSchema,
  address: addressSchema,
  comment: commentSchema,
  photos: photoUploadSchema,
  consent: consentSchema,
})
```

### `b2bEnquirySchema` (B2B — УК/ТСЖ)

```ts
export const b2bEnquirySchema = z.object({
  company: z.string().trim().min(2, 'Название организации'),
  inn: z.string().trim().regex(/^\d{10}$|^\d{12}$/, 'ИНН 10 или 12 цифр').optional(),
  contactName: nameSchema,
  phone: phoneRUSchema,
  email: z.string().email('Почта без @ — проверьте'),
  objectsCount: z.coerce.number().int().min(1, 'Количество объектов'),
  services: z.array(z.enum(['arboristika', 'krishi', 'musor', 'demontazh'])).min(1, 'Хотя бы 1 услуга'),
  comment: commentSchema,
  consent: consentSchema,
})
```

## Форматирование (utils)

### `formatPhoneRU(e164: string): string`

Обратная операция к `phoneRUSchema` — для отображения в UI:

```ts
export function formatPhoneRU(e164: string): string {
  const parsed = parsePhoneNumberFromString(e164)
  if (!parsed) return e164
  return parsed.formatInternational() // "+7 985 170 51 11"
}
```

### `formatPhoneForLink(e164: string): string`

Для `<a href="tel:...">` — без пробелов:

```ts
export function formatPhoneForLink(e164: string): string {
  return `tel:${e164}`
}
```

### `formatPriceRUB(rubles: number): string`

```ts
export function formatPriceRUB(rubles: number): string {
  return new Intl.NumberFormat('ru-RU').format(rubles) + ' ₽'
}
// 12800 → "12 800 ₽"
```

## Inputmask (клиентская маска)

Для phone-поля — **нативный `inputmode="tel"` + pattern**, без JS-маски (маски ломают paste, copy, SR).

```tsx
<input
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  placeholder="+7 (985) 170-51-11"
  {...register('phone')}
/>
```

Zod нормализует на submit — не на onchange. Пользователь вводит как удобно, `phoneRUSchema.transform` приведёт к E.164.

## Error messages

Все messages проходят TOV-фильтр [microcopy.md](../../foundations/microcopy.md) §Error:
- Конкретно что не так + что сделать
- Без «пожалуйста», «некорректное значение», «ошибка формата»
- Переиспользуются между формами

## Backend-контракт

Схемы **должны** совпадать на клиенте и сервере. В `site/lib/forms/` экспортируется `*.schema.ts` — импортируется и в Client Component (`useForm({ resolver: zodResolver })`), и в API Route (`const data = schema.parse(await req.formData())`).

**Передача файлов:** multipart/form-data. Backend переваривает multipart → S3 upload → возвращает lead ID. Zod-схема на backend проверяет то же что на клиенте, с ещё magic bytes check.

## A11y

- Все error-messages связаны с полями через `aria-describedby`.
- `aria-invalid="true"` при ошибке.
- `aria-live="polite"` на контейнере error-текста.
- `autoComplete` обязателен: `tel`, `name`, `email`, `street-address`.

## Tests (обязательно)

```ts
// site/lib/forms/phone.test.ts
describe('phoneRUSchema', () => {
  it('accepts +7 985 170 51 11', () => { ... })
  it('accepts 8 (985) 170-51-11', () => { ... })
  it('normalizes to E.164 +79851705111', () => { ... })
  it('rejects less than 11 digits', () => { ... })
  it('rejects emoji', () => { ... })
})
```

Tests — Vitest (уже в проекте). Покрытие 90%+ на schemas.

## DoD

- [x] 6 базовых схем (phone, name, consent, channel, address, comment, photos)
- [x] 3 композитные (leadForm, photoQuoteForm, b2bEnquiry)
- [x] Утилиты форматирования (phone, price)
- [x] Error-messages проходят TOV
- [x] Backend-контракт (shared import client + API)
- [x] A11y правила
- [ ] **TODO US fe1+be3:** реализация `site/lib/forms/` + unit-tests
- [ ] Интеграция в LeadForm.tsx (рефакторинг существующего) — после `site/lib/forms/`
- [ ] PhotoQuoteForm — строится сразу на этих схемах

## Open questions

- **reCAPTCHA / hCaptcha:** где храним secret? В `.env.local` + Payload `SiteChrome.captchaSecret` (encrypted). Обсудить с `be3`.
- **Rate limit:** 5 заявок / IP / час — на уровне API Route или Beget nginx? → `be3` решает.
- **GDPR-like export пользовательских данных:** пока не нужен (B2C МО, не EU), но в архитектуре consent → опция отзыва.
