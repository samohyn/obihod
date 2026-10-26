import { APIError, type Field, type GlobalBeforeValidateHook, type GlobalConfig } from 'payload'

import { isAdmin } from '@/lib/auth/access'
import { revalidateGlobalAfterChange } from '@/lib/admin/revalidateSite'
import { OFFER_TOKENS, unknownOfferTokens } from '@/lib/offer'
import { TEMPLATE_TABS, TEMPLATE_VARS } from '@/lib/page-templates'

/**
 * «Шаблоны страниц» — тексты страниц, которые сайт собирает сам (план 09, этап 4.4): район,
 * «услуга в районе», статья, кейс, авторы, 404, контакты. Поля и значения — lib/page-templates.ts.
 */
const allowed = new Set(TEMPLATE_VARS.map((v) => v.token))

const validateTokens: GlobalBeforeValidateHook = ({ data }) => {
  const bad = unknownOfferTokens(data).filter((t) => !allowed.has(t))
  if (bad.length)
    throw new APIError(
      `Неизвестная подстановка ${bad.join(', ')}. Доступные: ${[...allowed, ...OFFER_TOKENS.map((t) => t.token)].join(', ')}.`,
      400,
      { unknownTokens: bad }, // без data Payload прячет текст ошибки
      true,
    )
  return data
}

export const PageTemplates: GlobalConfig = {
  slug: 'page-templates',
  label: 'Шаблоны страниц',
  admin: {
    description: `Тексты страниц, которые сайт собирает сам: район, «услуга в районе», статья, кейс, авторы, 404. Подстановки: ${TEMPLATE_VARS.map((v) => `${v.token} — ${v.hint}`).join('; ')}. Цифры оффера — метками {перезвон}, {смета по фото}… (список — в «Компания и контакты» → «Оффер»).`,
    group: 'Страницы и услуги',
  },
  access: { read: () => true, update: isAdmin },
  hooks: { beforeValidate: [validateTokens], afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: TEMPLATE_TABS.map((tab) => ({
        label: tab.label,
        description: tab.description,
        fields: tab.fields.map((f): Field => {
          const base = {
            name: f.name,
            label: f.label,
            required: true,
            defaultValue: f.value,
            admin: { description: 'hint' in f ? f.hint : undefined },
          }
          return f.value.length > 70 ? { ...base, type: 'textarea' } : { ...base, type: 'text' }
        }),
      })),
    },
  ],
}
