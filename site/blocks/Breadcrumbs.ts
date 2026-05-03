import type { Block } from 'payload'

/**
 * Breadcrumbs — хлебные крошки + JSON-LD BreadcrumbList.
 *
 * US-0 AC-2.5 «Breadcrumbs — UI + BreadcrumbList JSON-LD schema (генератор
 * из site/lib/seo/jsonld.ts)».
 *
 * Renderer: site/components/blocks/Breadcrumbs.tsx (защита от <2 элементов).
 */
export const Breadcrumbs: Block = {
  slug: 'breadcrumbs',
  labels: { singular: 'Хлебные крошки', plural: 'Хлебные крошки' },
  admin: { group: 'Навигация' },
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
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      labels: { singular: 'Элемент', plural: 'Элементы цепочки' },
      admin: {
        description:
          'Цепочка от главной до текущей страницы. От 2 до 6 элементов. Последний — текущая страница.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 60,
          admin: { description: 'Видимое название (например: «Услуги»).' },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'Относительный путь со слэшами (например: /uslugi/).' },
        },
      ],
    },
    {
      name: 'generateSchema',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Включает JSON-LD BreadcrumbList для GEO. Отключите, если breadcrumbs уже инжектится layout-ом.',
      },
    },
  ],
}
