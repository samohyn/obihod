import type { Meta, StoryObj } from '@storybook/react'

import { Breadcrumbs } from './Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Blocks/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Breadcrumbs>

export const ServiceDistrict: Story = {
  args: {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Вывоз мусора', url: '/vyvoz-musora/' },
      { name: 'Одинцово', url: '/vyvoz-musora/odincovo/' },
    ],
    generateSchema: true,
  },
}

export const TwoLevels: Story = {
  args: {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'Вывоз мусора', url: '/vyvoz-musora/' },
    ],
  },
}

/**
 * Edge case: на главной (один элемент) блок не должен рендериться —
 * проверяем защиту от <li> с одним элементом.
 */
export const HiddenOnHome: Story = {
  args: {
    blockType: 'breadcrumbs',
    items: [{ name: 'Главная', url: '/' }],
  },
}
