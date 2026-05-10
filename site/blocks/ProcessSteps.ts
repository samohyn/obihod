import type { Block } from 'payload'

/**
 * ProcessSteps — 4-7 шагов timeline per brand-guide v2.6 §process-steps (line 1341+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/ProcessSteps.tsx.
 */
export const ProcessSteps: Block = {
  slug: 'process-steps',
  labels: { singular: 'Процесс работы (шаги)', plural: 'Процесс работы' },
  admin: { group: 'Контент' },
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
      defaultValue: 'process',
      admin: { description: 'Якорь. Без #.' },
    },
    {
      name: 'h2',
      type: 'text',
      maxLength: 160,
      defaultValue: 'Как мы работаем',
    },
    {
      name: 'helper',
      type: 'textarea',
      maxLength: 320,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical timeline (mobile-first)', value: 'vertical' },
        { label: 'Horizontal (desktop ≥1100px)', value: 'horizontal' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 4,
      maxRows: 7,
      labels: { singular: 'Шаг', plural: 'Шаги (4-7)' },
      fields: [
        {
          name: 'num',
          type: 'text',
          maxLength: 4,
          admin: { description: 'Номер (например «01»). Если пусто — auto.' },
        },
        { name: 'title', type: 'text', required: true, maxLength: 80 },
        { name: 'description', type: 'textarea', maxLength: 320 },
        {
          name: 'eta',
          type: 'text',
          maxLength: 40,
          admin: { description: 'Длительность шага. Например «10 минут».' },
        },
      ],
    },
  ],
}
