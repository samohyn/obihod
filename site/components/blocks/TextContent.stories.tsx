import type { Meta, StoryObj } from '@storybook/react'

import { TextContent } from './TextContent'

const meta: Meta<typeof TextContent> = {
  title: 'Blocks/TextContent',
  component: TextContent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof TextContent>

/**
 * Mock-Lexical: упрощённая структура root → paragraph → text для Storybook,
 * чтобы не зависеть от реального Payload Lexical-state. RichTextRenderer
 * хорошо справляется с этой формой.
 */
const lexicalStub = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Бригада «Обихода» работает в Одинцово 7 лет. Спилим тополь у дома, вывезем стволы и ветки в день обращения, очистим участок от опилок. Цена фиксируется по фото — без сюрпризов на месте.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text: 'Работаем по договору, оплата после подписания акта. Фотоотчёт до и после в Telegram оператору.',
          },
        ],
      },
    ],
  },
}

export const Default: Story = {
  args: {
    blockType: 'text-content',
    eyebrow: 'Подробно',
    heading: 'Как работает спил аварийного дерева',
    body: lexicalStub,
    columns: '1',
  },
}

export const TwoColumns: Story = {
  args: {
    blockType: 'text-content',
    eyebrow: 'FAQ-блок',
    heading: 'Что важно знать перед заказом',
    body: lexicalStub,
    columns: '2',
  },
}

export const NoBody: Story = {
  args: {
    blockType: 'text-content',
    heading: 'Только заголовок',
  },
}
