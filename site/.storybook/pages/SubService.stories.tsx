import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import {
  calculatorMusor,
  ctaBannerFotoSmeta,
  faqLocal,
  leadFormDistrict,
  miniCaseOdincovo,
  relatedServices3,
  textContentLong,
  tldrPillar,
} from './_mocks'

/**
 * Page-type composition: Sub-Service `/[service]/[sub]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (sub-specific) → tldr → text-content →
 * calculator-placeholder → mini-case → related-services → cta-banner → faq →
 * lead-form.
 *
 * Соответствует `seosite/04-url-map/wireframes/sub.md`.
 */
const meta: Meta = {
  title: 'Pages/SubService',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Вывоз мусора', url: '/vyvoz-musora/' },
      { name: 'Старая мебель', url: '/vyvoz-musora/staraya-mebel/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Вывоз старой мебели в Москве и МО',
    subheading:
      'Шкафы, диваны, кресла. Разбираем, выносим, грузим — за 1 рейс. Цена по фото за 15 минут.',
    primaryCta: { label: 'Запросить смету', href: '/foto-smeta/', variant: 'primary' },
    seasonalTheme: 'summer',
  },
  tldrPillar,
  textContentLong,
  calculatorMusor,
  miniCaseOdincovo,
  relatedServices3,
  ctaBannerFotoSmeta,
  faqLocal,
  leadFormDistrict,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
