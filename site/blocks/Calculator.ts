import type { Block } from 'payload'

/**
 * Calculator (placeholder) — карточка-приглашение «Расчёт стоимости — в
 * разработке» + CTA на /foto-smeta/.
 *
 * НЕ реальная логика расчёта. Занимает «слот» в шаблонах (pillar/sub/sd/b2b),
 * чтобы wireframes выглядели полно. Реальный калькулятор — отдельная US с
 * pa-site (форма, расчёт по объёму/площади/дереву, A/B на CR).
 *
 * US-0 AC-2.5 «Calculator — placeholder с TODO для US-расчёт; рендерит
 * карточку «Калькулятор стоимости — скоро» + CTA «Запросить смету через фото»».
 *
 * Renderer: site/components/blocks/Calculator.tsx.
 */
export const Calculator: Block = {
  slug: 'calculator-placeholder',
  labels: { singular: 'Калькулятор (placeholder)', plural: 'Калькуляторы (placeholder)' },
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
      admin: { description: 'Якорь для ссылки. Без символа #.' },
    },
    {
      name: 'heading',
      type: 'text',
      maxLength: 140,
      admin: {
        description: 'Заголовок карточки. По умолчанию: «Калькулятор стоимости — в разработке».',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      maxLength: 400,
      admin: {
        description:
          'Текст под заголовком. По умолчанию объясняет «пришлите фото — пересчитаем за 15 минут».',
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      // C2.6 issue 3 (2026-05-10): override auto-generated enum name.
      // Default `enum_<parent>_service_type` → 65 chars on T4_SD parent
      // (`service_districts_blocks_calculator_placeholder`), exceeds Postgres
      // NAMEDATALEN=63 → blocks adding Calculator to ServiceDistricts.
      // blockReferences. Function form returns per-table short enum:
      //   • T2          enum_services_blocks_calculator_placeholder_svc_t          (49)
      //   • T2 drafts   enum__services_v_blocks_calculator_placeholder_svc_t        (52)
      //   • T4_SD       enum_service_districts_blocks_calculator_placeholder_svc_t  (58)
      //   • T4_SD draft enum__service_districts_v_blocks_calculator_placeholder_svc_t (61)
      // Migration `20260510_220000_calculator_enum_rename` renames sustained
      // T2/T2-drafts enum types in-place (ALTER TYPE … RENAME TO …).
      enumName: ({ tableName }) => `enum_${tableName}_svc_t`,
      options: [
        { label: 'Спил деревьев', value: 'spil' },
        { label: 'Вывоз мусора', value: 'musor' },
        { label: 'Чистка крыш', value: 'krysha' },
        { label: 'Демонтаж', value: 'demontazh' },
      ],
      admin: {
        description: 'Тип услуги — для подстановки в default-текст. Опционально.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      maxLength: 60,
      defaultValue: 'Запросить смету через фото',
      admin: { description: 'Что написано на кнопке.' },
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/foto-smeta/',
      admin: { description: 'Куда ведёт кнопка. По умолчанию /foto-smeta/.' },
    },
  ],
}
