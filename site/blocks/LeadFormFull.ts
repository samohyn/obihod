import type { Block } from 'payload'

/**
 * LeadFormFull — 8 полей + 5-state submit flow per brand-guide v2.6
 * §lead-form-full (line 1164+).
 *
 * EPIC-SERVICE-PAGES-REDESIGN D3 wave A · 2026-05-10.
 *
 * Renderer: site/components/blocks/LeadFormFull.tsx (use client).
 */
export const LeadFormFull: Block = {
  slug: 'lead-form-full',
  labels: { singular: 'Lead-form (full v2.6)', plural: 'Lead-forms (full v2.6)' },
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
      defaultValue: 'lead-form',
      admin: { description: 'Якорь для скролла. Без #.' },
    },
    {
      name: 'h2',
      type: 'text',
      maxLength: 160,
      defaultValue: 'Оставьте заявку — перезвоним за 15 минут',
    },
    {
      name: 'helper',
      type: 'textarea',
      maxLength: 320,
    },
    {
      name: 'ctaLabel',
      type: 'text',
      maxLength: 60,
      defaultValue: 'Отправить заявку',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      maxLength: 320,
      defaultValue: 'Спасибо! Перезвоним за 15 минут.',
    },
    {
      name: 'consentText',
      type: 'textarea',
      maxLength: 320,
      defaultValue:
        'Нажимая кнопку, я соглашаюсь с обработкой персональных данных в соответствии с',
    },
    {
      name: 'consentHref',
      type: 'text',
      defaultValue: '/policy/',
    },
  ],
}
