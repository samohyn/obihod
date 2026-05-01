import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import { ctaBannerFotoSmeta, leadFormDistrict, relatedServices3, textContentLong } from './_mocks'

/**
 * Page-type composition: Case `/kejsy/[slug]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (кейс) → mini-case (этот кейс с
 * фактами) → text-content (детальный разбор) → related-services →
 * cta-banner → lead-form.
 *
 * Соответствует `seosite/04-url-map/wireframes/case.md`. Опциональный блок
 * `before-after` появится в US-3 (W11).
 */
const meta: Meta = {
  title: 'Pages/Case',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Кейсы', url: '/kejsy/' },
      { name: 'Сняли пень в гостиной', url: '/kejsy/snyali-pen-v-gostice/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Сняли пень в гостиной — Одинцово, март 2026',
    subheading:
      'Хозяин решил «оставить корни на память» — через год корни пошли через паркет. Спилили, выкорчевали, восстановили пол.',
    seasonalTheme: 'summer',
  },
  {
    blockType: 'mini-case',
    inline: {
      title: 'Факты по кейсу',
      photo: {
        url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=80',
        alt: 'Кейс Обихода — Одинцово',
      },
      facts: [
        { label: 'Срок', value: '4 часа' },
        { label: 'Бригада', value: '3 человека' },
        { label: 'Объём', value: '1 пень + 4 м³ опилок' },
        { label: 'Цена факт', value: '12 800 ₽' },
      ],
    },
  },
  textContentLong,
  relatedServices3,
  ctaBannerFotoSmeta,
  leadFormDistrict,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
