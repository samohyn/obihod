import type { Meta, StoryObj } from '@storybook/react'

import { Hero } from './Hero'

const meta: Meta<typeof Hero> = {
  title: 'Blocks/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof Hero>

export const Default: Story = {
  args: {
    blockType: 'hero',
    heading: 'Спил деревьев и вывоз мусора в Одинцово — за 1 день',
    subheading:
      'Бригада с 7 лет опыта приедет в день обращения. Точный расчёт по фото за 15 минут.',
    primaryCta: { label: 'Заказать замер', href: '/foto-smeta/', variant: 'primary' },
    secondaryCta: { label: 'Посмотреть кейсы', href: '/kejsy/' },
    seasonalTheme: 'summer',
    overlayOpacity: 40,
  },
}

export const WinterTheme: Story = {
  args: {
    blockType: 'hero',
    heading: 'Чистка крыши от снега — выезд за 2 часа',
    subheading: 'Альпинисты с допуском, страховка 5 млн ₽, фотоотчёт после работы.',
    primaryCta: { label: 'Вызвать бригаду', href: '/foto-smeta/', variant: 'primary' },
    seasonalTheme: 'winter',
  },
}

export const PromoTheme: Story = {
  args: {
    blockType: 'hero',
    heading: 'Спилим 2 дерева — 3-е бесплатно',
    subheading: 'Только до 30 ноября. Москва и МО, выезд за 4 часа.',
    primaryCta: { label: 'Воспользоваться', href: '/foto-smeta/', variant: 'primary' },
    seasonalTheme: 'promo',
  },
}
