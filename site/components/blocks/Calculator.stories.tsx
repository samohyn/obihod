import type { Meta, StoryObj } from '@storybook/react'

import { Calculator } from './Calculator'

const meta: Meta<typeof Calculator> = {
  title: 'Blocks/Calculator',
  component: Calculator,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Calculator>

export const SpilDerevev: Story = {
  args: {
    blockType: 'calculator-placeholder',
    serviceType: 'spil',
  },
}

export const VyvozMusora: Story = {
  args: {
    blockType: 'calculator-placeholder',
    serviceType: 'musor',
  },
}

export const Generic: Story = {
  args: {
    blockType: 'calculator-placeholder',
  },
}

export const CustomCopy: Story = {
  args: {
    blockType: 'calculator-placeholder',
    heading: 'Расчёт по площади крыши',
    body: 'Точная цена зависит от уклона, высоты и количества снега. Пришлите фото — пересчитаем.',
    ctaLabel: 'Запросить выезд альпинистов',
    ctaHref: '/foto-smeta/?service=krysha',
    serviceType: 'krysha',
  },
}
