import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import {
  ctaBannerFotoSmeta,
  faqLocal,
  leadFormDistrict,
  miniCaseOdincovo,
  textContentLong,
  tldrPillar,
} from './_mocks'

/**
 * Page-type composition: District Hub `/raiony/[district]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (district overview) → tldr →
 * services-grid (4 pillar для этого района) → text-content → mini-case →
 * neighbor-districts → cta-banner → faq → lead-form.
 *
 * Соответствует `seosite/04-url-map/wireframes/district.md`.
 */
const meta: Meta = {
  title: 'Pages/DistrictHub',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Районы', url: '/raiony/' },
      { name: 'Одинцово', url: '/raiony/odincovo/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Обиход в Одинцово — порядок под ключ',
    subheading:
      'Вывоз мусора, спил деревьев, чистка крыш, демонтаж. Бригада в Одинцово — выезд за 4 часа.',
    primaryCta: { label: 'Заказать выезд', href: '/foto-smeta/', variant: 'primary' },
    seasonalTheme: 'summer',
  },
  tldrPillar,
  {
    blockType: 'services-grid',
    eyebrow: 'В Одинцово',
    heading: 'Что делаем',
    items: [
      { title: 'Вывоз мусора', slug: 'vyvoz-musora/odincovo', icon: 's-musor' },
      { title: 'Спил деревьев', slug: 'spil-derevev/odincovo', icon: 's-spil' },
      { title: 'Чистка крыш', slug: 'chistka-krysh/odincovo', icon: 's-krysha' },
      { title: 'Демонтаж', slug: 'demontazh/odincovo', icon: 's-demontazh' },
    ],
  },
  textContentLong,
  miniCaseOdincovo,
  {
    blockType: 'neighbor-districts',
    heading: 'Соседние районы',
    items: [
      { name: 'Жуковский', slug: 'zhukovskij', distance: '12 км' },
      { name: 'Раменское', slug: 'ramenskoe', distance: '18 км' },
      { name: 'Бронницы', slug: 'bronnitsy', distance: '24 км' },
    ],
  },
  ctaBannerFotoSmeta,
  faqLocal,
  leadFormDistrict,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
