import type { Meta, StoryObj } from '@storybook/react'

import { LeadForm } from './LeadForm'

const meta: Meta<typeof LeadForm> = {
  title: 'Blocks/LeadForm',
  component: LeadForm,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof LeadForm>

export const Default: Story = {
  args: {
    blockType: 'lead-form',
    heading: 'Оставьте заявку — перезвоним за 15 минут',
    subheading: 'Бесплатный замер. Цена фиксируется до начала работы.',
    consentText: 'Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных по 152-ФЗ.',
    successMessage: 'Спасибо, перезвоним за 15 минут.',
  },
}

export const WithDistrictHint: Story = {
  args: {
    blockType: 'lead-form',
    heading: 'Заказать вывоз мусора в Одинцово',
    subheading: 'Контейнер 8 м³, бригада 3 человека, разгрузка по требованию.',
    serviceHint: { slug: 'vyvoz-musora', title: 'Вывоз мусора' },
    districtHint: { slug: 'odincovo', nameNominative: 'Одинцово' },
  },
}

export const Minimal: Story = {
  args: {
    blockType: 'lead-form',
    heading: 'Заявка',
  },
}
