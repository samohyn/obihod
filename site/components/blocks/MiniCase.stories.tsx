import type { Meta, StoryObj } from '@storybook/react'

import { MiniCase } from './MiniCase'

const meta: Meta<typeof MiniCase> = {
  title: 'Blocks/MiniCase',
  component: MiniCase,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof MiniCase>

export const Default: Story = {
  args: {
    blockType: 'mini-case',
    inline: {
      title: 'Сняли пень в гостиной — Одинцово, март 2026',
      photo: {
        url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=80',
        alt: 'Бригада «Обихода» работает в саду в Одинцово',
      },
      facts: [
        { label: 'Срок', value: '4 часа' },
        { label: 'Бригада', value: '3 человека' },
        { label: 'Объём', value: '1 пень + 4 м³ опилок' },
        { label: 'Цена факт', value: '12 800 ₽' },
      ],
      link: '/kejsy/snyali-pen-v-gostice/',
    },
  },
}

export const NoPhoto: Story = {
  args: {
    blockType: 'mini-case',
    inline: {
      title: 'Вывоз мусора с дачи в Жуковском',
      facts: [
        { label: 'Срок', value: '1 день' },
        { label: 'Объём', value: '12 м³' },
        { label: 'Цена факт', value: '24 600 ₽' },
      ],
      link: '/kejsy/dacha-zhukovskij/',
    },
  },
}

export const RefOnly: Story = {
  args: {
    blockType: 'mini-case',
    caseRef: { slug: 'krysha-tszh-himki', title: 'Чистка крыши ТСЖ — Химки' },
  },
}
