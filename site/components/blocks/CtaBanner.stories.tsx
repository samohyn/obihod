import type { Meta, StoryObj } from '@storybook/react'

import { CtaBanner } from './CtaBanner'

const meta: Meta<typeof CtaBanner> = {
  title: 'Blocks/CtaBanner',
  component: CtaBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof CtaBanner>

export const Primary: Story = {
  args: {
    blockType: 'cta-banner',
    heading: 'Точная цена за 15 минут — по фото',
    body: 'Пришлите 2-3 фото объекта в Telegram или на сайт. Расчёт без выезда замерщика, не уезжаем — экономим вашу субботу.',
    cta: { label: 'Запросить смету', href: '/foto-smeta/' },
    accent: 'primary',
  },
}

export const Warning: Story = {
  args: {
    blockType: 'cta-banner',
    heading: 'Аварийная ситуация на крыше?',
    body: 'Звоните напрямую — диспетчер на связи 24/7, бригада с ремнями в течение 2 часов.',
    cta: { label: 'Позвонить', href: 'tel:+74950000000' },
    accent: 'warning',
  },
}

export const Dark: Story = {
  args: {
    blockType: 'cta-banner',
    heading: 'B2B договор за 1 день',
    body: 'УК и ТСЖ — полный комплект документов: акты, ТТН, фотоотчёт, регулярные выезды по графику.',
    cta: { label: 'Запросить КП', href: '/b2b/dogovor/' },
    variant: 'dark',
  },
}
