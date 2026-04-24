import type { Block } from 'payload'

/**
 * Hero — первый экран страницы.
 *
 * Один на страницу (publish-gate в ServiceDistricts: requireExactly hero === 1).
 * Sa-spec §3.1.
 */
export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero-блоки' },
  admin: {
    group: 'Структура страницы',
    // Иконка для палитры блоков в admin. Payload 3 ждёт URL (не React-компонент),
    // поэтому используем статический SVG из site/public/admin/blocks/.
    // Визуал копирует HeroBlockIcon из components/admin/icons.tsx.
    images: {
      icon: { url: '/admin/blocks/hero.svg', alt: 'Hero — первый экран страницы' },
      thumbnail: { url: '/admin/blocks/hero.svg', alt: 'Hero — первый экран страницы' },
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
        description: 'Якорь для ссылки на блок. Например: hero. Без символа #.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: {
        description: 'Главный заголовок страницы. Видно клиенту первым. До 120 символов.',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      maxLength: 240,
      admin: {
        description: 'Подзаголовок под главным заголовком. 1–2 предложения, до 240 символов.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Фоновое изображение. 1920×1080, до 2 МБ. Реальный объект, не сток.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      maxLength: 40,
      admin: {
        description: 'Что написано на кнопке. Например: «Получить смету».',
      },
    },
    {
      name: 'ctaHref',
      type: 'text',
      admin: {
        description: 'Куда ведёт кнопка. Якорь #calc или путь /uslugi/spil/.',
      },
    },
    {
      name: 'seasonalTheme',
      type: 'select',
      defaultValue: 'summer',
      options: [
        { label: 'Лето — зелёный (арбористика, мусор)', value: 'summer' },
        { label: 'Зима — синий (крыши)', value: 'winter' },
        { label: 'Акция — янтарный', value: 'promo' },
      ],
      admin: {
        description: 'Сезонная палитра блока. Зима — для крыш, лето — для деревьев.',
      },
    },
  ],
}
