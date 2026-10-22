import { z } from 'zod'

import { normalizePhone } from './phone'

export { normalizePhone }

/**
 * Поля заявки с сайта (/api/leads) — одна проверка для JSON и формы с фото.
 * Обязательны телефон и согласие на обработку ПДн (152-ФЗ: оператор доказывает согласие,
 * поэтому сервер не верит одной проверке в браузере).
 */

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Не больше ${max} символов`)
    .optional()
    .transform((v) => (v ? v : undefined))

/** Чекбокс приходит из формы строкой, из JSON — булевым. */
const checked = z.union([z.boolean(), z.literal('true'), z.literal('on')]).transform(() => true)

export const leadSchema = z.object({
  phone: z.string({ error: 'Укажите телефон' }).transform((v, ctx) => {
    const p = normalizePhone(v)
    if (!p) {
      ctx.addIssue({ code: 'custom', message: 'Телефон — 10 цифр после +7' })
      return z.NEVER
    }
    return p
  }),
  consent: checked.optional(),
  name: text(80),
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email('Почта с ошибкой').optional()),
  message: text(2000),
  address: text(200),
  service: text(80),
  district: text(80),
  source: text(120),
  sourcePage: text(300),
  utmSource: text(120),
  utmMedium: text(120),
  utmCampaign: text(200),
})

export type LeadInput = z.output<typeof leadSchema>

/** Ошибки zod → [{ field, message }] для формы. */
export function fieldErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((i) => ({ field: String(i.path[0] ?? ''), message: i.message }))
}
