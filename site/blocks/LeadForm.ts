import type { Block } from 'payload'

/**
 * LeadForm — стандартная форма заявки → amoCRM.
 *
 * Закрывает publish-gate как «контактный блок».
 * Sa-spec §3.3.
 */
export const LeadForm: Block = {
  slug: 'lead-form',
  labels: { singular: 'Форма заявки', plural: 'Формы заявки' },
  admin: {
    group: 'Действия',
    // Иконка для палитры блоков в admin. Визуал копирует LeadFormBlockIcon
    // из components/admin/icons.tsx (рамка + поля + кнопка).
    images: {
      icon: { url: '/admin/blocks/lead-form.svg', alt: 'Форма заявки' },
      thumbnail: { url: '/admin/blocks/lead-form.svg', alt: 'Форма заявки' },
    },
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Выключите, чтобы скрыть блок на сайте без удаления.',
      },
    },
    {
      name: 'anchor',
      type: 'text',
      admin: {
        description: 'Якорь для ссылки на форму. Например: zayavka.',
      },
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'short',
      options: [
        { label: 'Короткая — телефон + комментарий', value: 'short' },
        { label: 'Полная — имя, телефон, услуга, район, фото', value: 'long' },
      ],
      admin: {
        description: 'Короткая ловит больше заявок, полная даёт больше данных бригадиру.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Заголовок над формой. Например: «Замер бесплатно».',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      maxLength: 240,
      admin: {
        description: 'Подзаголовок 1–2 предложения. Что обещаем после клика.',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Какие услуги предлагать в селекте формы. Пусто — все.',
      },
    },
    {
      name: 'submitLabel',
      type: 'text',
      maxLength: 40,
      defaultValue: 'Отправить',
      admin: {
        description: 'Что написано на кнопке отправки. Например: «Получить смету».',
      },
    },
    {
      name: 'successMessage',
      type: 'text',
      maxLength: 200,
      defaultValue: 'Спасибо, перезвоним за 15 минут.',
      admin: {
        description: 'Что увидит клиент после отправки.',
      },
    },
  ],
}
