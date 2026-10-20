// Общие поля блоков библиотеки v3 (этап 2 плана 09). Подписи — для владельца, без жаргона.

import type { Field } from 'payload'

import { ICON_NAMES } from '@/components/blocks/v3/iconNames'

export const enabledField: Field = {
  name: 'enabled',
  type: 'checkbox',
  label: 'Показывать блок',
  defaultValue: true,
  admin: { description: 'Снимите галочку, чтобы скрыть блок, не удаляя его.' },
}

export const toneField: Field = {
  name: 'tone',
  type: 'select',
  label: 'Фон',
  defaultValue: 'default',
  options: [
    { label: 'Кремовый', value: 'default' },
    { label: 'Бежевый (чередование)', value: 'alt' },
    { label: 'Зелёный', value: 'green' },
    { label: 'Тёмно-зелёный', value: 'dark' },
  ],
}

export const linkGroup = (name = 'link', label = 'Ссылка справа от заголовка'): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text', label: 'Текст ссылки' },
    { name: 'href', type: 'text', label: 'Адрес', admin: { description: 'Например /uslugi/' } },
  ],
})

/** Заголовок секции: надзаголовок, заголовок, ссылка справа, якорь, фон. */
export const sectionFields = ({ tone = true }: { tone?: boolean } = {}): Field[] => [
  enabledField,
  {
    type: 'row',
    fields: [
      {
        name: 'eyebrow',
        type: 'text',
        label: 'Надзаголовок',
        admin: { width: '50%', description: 'Мелкая строка над заголовком, 2–5 слов' },
      },
      {
        name: 'anchor',
        type: 'text',
        label: 'Якорь',
        admin: { width: '50%', description: 'Для ссылок вида #ceny, латиницей, без #' },
      },
    ],
  },
  { name: 'title', type: 'text', label: 'Заголовок' },
  linkGroup(),
  ...(tone ? [toneField] : []),
]

export const imageField = (name = 'image', label = 'Фото', required = true): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required,
  admin: {
    description:
      'Сгенерированные фото отмечайте в медиа флагом «Иллюстрация» — на сайте появится подпись.',
  },
})

export const iconField = (name = 'icon', label = 'Иконка', defaultValue = 'check'): Field => ({
  name,
  type: 'select',
  label,
  required: true,
  defaultValue,
  options: ICON_NAMES.map((n) => ({ label: n, value: n })),
})

/** Список строк (пункты, примечания, районы). */
export const stringList = (
  name: string,
  label: string,
  opts: { maxRows?: number; minRows?: number } = {},
): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Пункт', plural: 'Пункты' },
  ...opts,
  fields: [{ name: 'value', type: 'text', label: 'Текст', required: true }],
})

export const linkFields = (labelText = 'Текст кнопки'): Field[] => [
  { name: 'label', type: 'text', label: labelText, required: true },
  { name: 'href', type: 'text', label: 'Адрес', required: true },
]
