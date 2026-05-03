import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import { faqLocal, miniCaseOdincovo, relatedServices3, textContentLong } from './_mocks'

/**
 * Page-type composition: B2B Segment `/b2b/[slug]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (B2B-сегмент) → tldr (offer) →
 * text-content (договор + штрафы ГЖИ + кейсы) → mini-case →
 * related-services → cta-banner (B2B КП) → faq → lead-form (B2B).
 *
 * Соответствует `seosite/04-url-map/wireframes/b2b.md`. Анти-§14:
 * никакого «осуществляем деятельность», «имеем честь», «дорожим репутацией».
 */
const meta: Meta = {
  title: 'Pages/B2BSegment',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  {
    blockType: 'breadcrumbs',
    items: [
      { name: 'Главная', url: '/' },
      { name: 'B2B', url: '/b2b/' },
      { name: 'УК и ТСЖ', url: '/b2b/uk-tszh/' },
    ],
  },
  {
    blockType: 'hero',
    heading: 'Обиход для УК и ТСЖ — договор за 1 день',
    subheading:
      'Полный комплект документов: акт, ТТН, фотоотчёт. Регулярные выезды, штрафы ГЖИ под контролем.',
    primaryCta: { label: 'Запросить КП', href: '/b2b/dogovor/', variant: 'primary' },
    seasonalTheme: 'summer',
  },
  {
    blockType: 'tldr',
    eyebrow: 'Если коротко',
    text: 'Договор за 1 день, фиксированная цена за выезд, фотоотчёт и ТТН в ваш документооборот. Аварийные выезды — 24/7.',
  },
  textContentLong,
  miniCaseOdincovo,
  relatedServices3,
  {
    blockType: 'cta-banner',
    heading: 'Запросить коммерческое предложение',
    body: 'Пришлите ИНН и адрес объекта — пришлём КП и проект договора в течение дня.',
    cta: { label: 'Запросить КП', href: '/b2b/dogovor/' },
    accent: 'primary',
  },
  faqLocal,
  {
    blockType: 'lead-form',
    heading: 'B2B-заявка',
    subheading: 'Менеджер по корпоративным клиентам перезвонит в течение 30 минут.',
    consentText: 'Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных по 152-ФЗ.',
  },
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
