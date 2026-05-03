import type { Meta, StoryObj } from '@storybook/react'

import { BlockRenderer } from '../../components/blocks/BlockRenderer'
import type { AnyBlock } from '../../components/blocks/types'
import {
  breadcrumbsServiceDistrict,
  calculatorMusor,
  faqLocal,
  leadFormDistrict,
  miniCaseOdincovo,
  neighborDistrictsOdincovo,
  textContentLong,
  tldrPillar,
} from './_mocks'

/**
 * Page-type composition: Programmatic Service-District `/[service]/[district]/`.
 *
 * Wireframe-блоки: breadcrumbs → hero (service+district) → tldr → text-content
 * (50% shared + 50% district-specific) → calculator-placeholder → mini-case →
 * neighbor-districts → faq → lead-form.
 *
 * Это самый «цитируемый» тип — должен проходить publish-gate (1 hero + 1
 * text-content ≥300 слов + 1 contact + mini-case + ≥2 localFaq).
 *
 * Соответствует `seosite/04-url-map/wireframes/sd.md` — критический template
 * для R1 (Scaled Content Abuse mitigation).
 */
const meta: Meta = {
  title: 'Pages/ProgrammaticSD',
  parameters: { layout: 'fullscreen' },
}
export default meta

const blocks: AnyBlock[] = [
  breadcrumbsServiceDistrict,
  {
    blockType: 'hero',
    heading: 'Вывоз мусора в Одинцово — за 1 день',
    subheading: 'Бригада с 7 лет опыта в Одинцово. Контейнер 8 м³ от 6 200 ₽, погрузка под ключ.',
    primaryCta: { label: 'Заказать в Одинцово', href: '/foto-smeta/', variant: 'primary' },
    seasonalTheme: 'summer',
  },
  tldrPillar,
  textContentLong,
  calculatorMusor,
  miniCaseOdincovo,
  neighborDistrictsOdincovo,
  faqLocal,
  leadFormDistrict,
]

export const Default: StoryObj = {
  render: () => <BlockRenderer blocks={blocks} />,
}
