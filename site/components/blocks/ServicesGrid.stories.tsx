import type { Meta, StoryObj } from '@storybook/react'

import { ServicesGrid } from './ServicesGrid'

const meta: Meta<typeof ServicesGrid> = {
  title: 'Blocks/ServicesGrid',
  component: ServicesGrid,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof ServicesGrid>

export const PillarMusor: Story = {
  args: {
    blockType: 'services-grid',
    eyebrow: 'Под-услуги',
    heading: 'Что вывозим',
    items: [
      {
        title: 'Вывоз старой мебели',
        slug: 'vyvoz-musora/staraya-mebel',
        icon: 's-mebel',
        summary: 'Шкафы, диваны, кресла. Разбираем на месте.',
      },
      {
        title: 'Вывоз строительного мусора',
        slug: 'vyvoz-musora/stroymusor',
        icon: 's-stroy',
        summary: 'Бой кирпича, гипсокартон, плитка.',
      },
      {
        title: 'Вывоз бытовой техники',
        slug: 'vyvoz-musora/byttehnika',
        icon: 's-tehnika',
        summary: 'Холодильники, плиты, стиральные машины.',
      },
      {
        title: 'Расхламление дачи',
        slug: 'vyvoz-musora/dacha',
        icon: 's-dacha',
        summary: 'Чердак, сарай, участок — под ключ.',
      },
    ],
  },
}

export const FourPillars: Story = {
  args: {
    blockType: 'services-grid',
    heading: 'Услуги Обихода',
    items: [
      { title: 'Вывоз мусора', slug: 'vyvoz-musora', icon: 's-musor' },
      { title: 'Спил деревьев', slug: 'spil-derevev', icon: 's-spil' },
      { title: 'Чистка крыш', slug: 'chistka-krysh', icon: 's-krysha' },
      { title: 'Демонтаж', slug: 'demontazh', icon: 's-demontazh' },
    ],
  },
}

export const Empty: Story = {
  args: {
    blockType: 'services-grid',
    heading: 'Пусто',
    items: [],
  },
}
