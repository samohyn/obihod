import type { Meta, StoryObj } from '@storybook/react'

import { NeighborDistricts } from './NeighborDistricts'

const meta: Meta<typeof NeighborDistricts> = {
  title: 'Blocks/NeighborDistricts',
  component: NeighborDistricts,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof NeighborDistricts>

export const DistrictHub: Story = {
  args: {
    blockType: 'neighbor-districts',
    heading: 'Соседние районы',
    items: [
      { name: 'Жуковский', slug: 'zhukovskij', distance: '12 км' },
      { name: 'Раменское', slug: 'ramenskoe', distance: '18 км' },
      { name: 'Бронницы', slug: 'bronnitsy', distance: '24 км' },
    ],
  },
}

export const ServiceDistrict: Story = {
  args: {
    blockType: 'neighbor-districts',
    heading: 'Также вывозим мусор в соседних районах',
    serviceSlug: 'vyvoz-musora',
    items: [
      { name: 'Жуковский', slug: 'zhukovskij', distance: '12 км' },
      { name: 'Раменское', slug: 'ramenskoe' },
    ],
  },
}

export const Empty: Story = {
  args: {
    blockType: 'neighbor-districts',
    heading: 'Соседние районы',
    items: [],
  },
}
