import type { Meta, StoryObj } from '@storybook/react'

import { Faq } from './Faq'

const meta: Meta<typeof Faq> = {
  title: 'Blocks/Faq',
  component: Faq,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Faq>

const lexicalAnswer = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text }],
      },
    ],
  },
})

export const Default: Story = {
  args: {
    blockType: 'faq',
    heading: 'Частые вопросы',
    items: [
      {
        question: 'Сколько стоит спил тополя в Одинцово?',
        answer: lexicalAnswer(
          'От 4 800 ₽ за дерево высотой до 8 м с вывозом стволов. Точная цена — по фото за 15 минут.',
        ),
      },
      {
        question: 'Как быстро приедет бригада?',
        answer: lexicalAnswer(
          'В день обращения — если позвонили до 16:00. Аварийные ситуации — за 2 часа.',
        ),
      },
      {
        question: 'Работаете ли с УК и ТСЖ?',
        answer: lexicalAnswer(
          'Да, по договору с актами, ТТН и регулярными выездами. Договор — за 1 день.',
        ),
      },
    ],
    generateFaqPageSchema: true,
  },
}

export const Single: Story = {
  args: {
    blockType: 'faq',
    heading: 'Вопрос',
    items: [
      {
        question: 'Можно ли заказать в выходные?',
        answer: lexicalAnswer('Да, выезд бригады без выходных, цена та же.'),
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    blockType: 'faq',
    heading: 'Частые вопросы',
    items: [],
  },
}
