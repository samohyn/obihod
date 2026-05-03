import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import { miniCaseOdincovo, relatedServices3, textContentLong } from './_mocks'

/**
 * Page-type composition: Author `/avtory/[slug]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (author bio) → text-content (опыт) →
 * mini-case (примеры работ) → related-services (что делает).
 *
 * Соответствует `seosite/04-url-map/wireframes/author.md`. Schema —
 * Person → Organization для company-page «Бригада вывоза Обихода»;
 * для оператора — Person с worksFor (см. AC-10 в sa-spec).
 *
 * silhouette/back-shot — никаких лиц на hero (privacy + бренд анти-§14).
 */
const meta: Meta = {
  title: 'Pages/Author',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Авторы', url: '/avtory/' },
      { name: 'Бригада вывоза Обихода', url: '/avtory/brigada-vyvoza-obihoda/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Бригада вывоза Обихода',
    subheading:
      '7 лет в Москве и МО. Знают законодательство МО, работают по 4 услугам, фотографируют процесс и сдают объект под подпись.',
    seasonalTheme: 'summer',
  },
  textContentLong,
  miniCaseOdincovo,
  relatedServices3,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
