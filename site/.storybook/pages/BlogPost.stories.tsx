import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import { ctaBannerFotoSmeta, faqLocal, textContentLong } from './_mocks'

/**
 * Page-type composition: Blog Post `/blog/[slug]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (статья) → tldr → text-content (long) →
 * cta-banner → faq.
 *
 * Соответствует `seosite/04-url-map/wireframes/blog.md`.
 */
const meta: Meta = {
  title: 'Pages/BlogPost',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Блог', url: '/blog/' },
      { name: 'Что такое 4-в-1', url: '/blog/chto-takoe-4-v-1/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Что такое «4-в-1»: как Обиход совмещает 4 услуги в один выезд',
    subheading:
      'Вывоз, спил, демонтаж и чистка крыш — одной бригадой за день. Объясняем, что это даёт клиенту.',
    seasonalTheme: 'summer',
  },
  {
    blockType: 'tldr',
    eyebrow: 'TL;DR',
    text: '«4-в-1» — это когда одна бригада за один выезд закрывает несколько задач: спил тополя + вывоз стволов + демонтаж сарая. Экономия на логистике 30-40% и один акт вместо четырёх.',
  },
  textContentLong,
  ctaBannerFotoSmeta,
  faqLocal,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
