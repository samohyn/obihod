import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import {
  ctaBannerFotoSmeta,
  faqLocal,
  heroSummer,
  leadFormDistrict,
  miniCaseOdincovo,
  relatedServices3,
  servicesGridSubs,
  textContentLong,
  tldrPillar,
} from './_mocks'

/**
 * Page-type composition: Pillar Service `/[service]/`.
 *
 * Wireframe-блоки сверху вниз: breadcrumbs → hero → tldr → services-grid →
 * text-content → mini-case → related-services → cta-banner → faq → lead-form.
 *
 * Соответствует wireframe `seosite/04-url-map/wireframes/pillar.md`.
 */
const meta: Meta = {
  title: 'Pages/PillarService',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Вывоз мусора', url: '/vyvoz-musora/' },
    ],
  },
  heroSummer,
  tldrPillar,
  servicesGridSubs,
  textContentLong,
  miniCaseOdincovo,
  relatedServices3,
  ctaBannerFotoSmeta,
  faqLocal,
  leadFormDistrict,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
