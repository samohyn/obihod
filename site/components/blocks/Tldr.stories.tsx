import type { Meta, StoryObj } from '@storybook/react'

import { Tldr } from './Tldr'

const meta: Meta<typeof Tldr> = {
  title: 'Blocks/Tldr',
  component: Tldr,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Tldr>

export const Default: Story = {
  args: {
    blockType: 'tldr',
    eyebrow: 'Если коротко',
    text: 'Спил тополя в Одинцово — 4 800 ₽ за дерево с вывозом стволов. Бригада приезжает в день обращения, цена фиксируется по фото.',
  },
}

export const WithRichText: Story = {
  args: {
    blockType: 'tldr',
    eyebrow: 'TL;DR',
    body: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Вывоз мусора в Одинцово: контейнер 8 м³ — 6 200 ₽ с погрузкой. Если объём больше — приедет 20-кубовый, цена за м³ ниже.',
              },
            ],
          },
        ],
      },
    },
  },
}

export const Empty: Story = {
  args: {
    blockType: 'tldr',
  },
}
