import type { Block } from 'payload'

/**
 * CalculatorShell — photo→quote калькулятор (5 states) per brand-guide v2.6
 * §calculator-shell (line 1044+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/CalculatorShell.tsx (use client).
 */
export const CalculatorShell: Block = {
  slug: 'calculator-shell',
  labels: { singular: 'Калькулятор v2.6', plural: 'Калькуляторы v2.6' },
  admin: { group: 'Действия' },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Выключите, чтобы скрыть блок без удаления.' },
    },
    {
      name: 'anchor',
      type: 'text',
      defaultValue: 'calculator',
      admin: { description: 'Якорь для скролла к калькулятору. Без #.' },
    },
    {
      name: 'h2',
      type: 'text',
      maxLength: 160,
      defaultValue: 'Смета по фото за 10 минут',
    },
    {
      name: 'helper',
      type: 'textarea',
      maxLength: 320,
      admin: { description: 'Описание под H2.' },
    },
    {
      name: 'serviceType',
      type: 'select',
      options: [
        { label: 'Спил деревьев', value: 'spil' },
        { label: 'Вывоз мусора', value: 'musor' },
        { label: 'Чистка крыш', value: 'krysha' },
        { label: 'Демонтаж', value: 'demontazh' },
      ],
      admin: { description: 'Тип услуги — для presets и default-helper.' },
    },
    {
      name: 'apiEndpoint',
      type: 'text',
      defaultValue: '/api/quote',
      admin: { description: 'API-endpoint для photo→quote (по умолчанию /api/quote).' },
    },
    {
      name: 'successHref',
      type: 'text',
      defaultValue: '#lead-form',
      admin: { description: 'Куда вести при success-state (по умолчанию #lead-form).' },
    },
  ],
}
