import type { Block } from 'payload'

/**
 * CtaBanner — контрастный баннер с призывом.
 *
 * Закрывает publish-gate как «контактный блок» (вместе с LeadForm).
 * Sa-spec §3.12.
 */
export const CtaBanner: Block = {
  slug: 'cta-banner',
  labels: { singular: 'CTA-баннер', plural: 'CTA-баннеры' },
  admin: {
    group: 'Действия',
    // Иконка для палитры блоков в admin. Визуал копирует CtaBannerBlockIcon
    // из components/admin/icons.tsx (плашка-баннер со стрелкой вправо).
    images: {
      icon: { url: '/admin/blocks/cta-banner.svg', alt: 'CTA-баннер' },
      thumbnail: { url: '/admin/blocks/cta-banner.svg', alt: 'CTA-баннер' },
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
        description: 'Якорь для ссылки. Без символа #.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: {
        description: 'Заголовок баннера. Короткий призыв к действию.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Короткий текст под заголовком. 1–2 строки.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      required: true,
      maxLength: 60,
      admin: {
        description: 'Что написано на кнопке. Например: «Получить смету».',
      },
    },
    {
      name: 'ctaHref',
      type: 'text',
      required: true,
      admin: {
        description: 'Куда ведёт кнопка. Якорь #zayavka или путь.',
      },
    },
    {
      name: 'accent',
      type: 'select',
      required: true,
      defaultValue: 'primary',
      options: [
        { label: 'Primary — зелёный', value: 'primary' },
        { label: 'Warning — янтарный (акция, ограниченное время)', value: 'warning' },
        { label: 'Success — зелёный лайт', value: 'success' },
      ],
      admin: {
        description: 'Цвет блока. Янтарный — для акций, зелёный — для обычных CTA.',
      },
    },
  ],
}
