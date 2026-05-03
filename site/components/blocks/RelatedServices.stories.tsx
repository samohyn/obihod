import type { Meta, StoryObj } from '@storybook/react'

import { RelatedServices } from './RelatedServices'

const meta: Meta<typeof RelatedServices> = {
  title: 'Blocks/RelatedServices',
  component: RelatedServices,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof RelatedServices>

export const ThreeCards: Story = {
  args: {
    blockType: 'related-services',
    heading: 'Похожие услуги',
    items: [
      {
        title: 'Спил деревьев',
        slug: 'spil-derevev',
        summary: 'Аварийные деревья, корчёвка пней, вывоз стволов.',
      },
      {
        title: 'Демонтаж',
        slug: 'demontazh',
        summary: 'Сараи, заборы, теплицы — с вывозом мусора.',
      },
      {
        title: 'Чистка крыш',
        slug: 'chistka-krysh',
        summary: 'Снег и наледь зимой, мусор и листва — в межсезонье.',
      },
    ],
  },
}

export const SingleCard: Story = {
  args: {
    blockType: 'related-services',
    heading: 'Также делаем',
    items: [
      {
        title: 'Вывоз мусора',
        slug: 'vyvoz-musora',
        summary: 'Контейнеры 8 / 20 / 27 м³ с погрузкой.',
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    blockType: 'related-services',
    heading: 'Похожие услуги',
    items: [],
  },
}
