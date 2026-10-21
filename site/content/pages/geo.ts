// Раздел «Районы» (/raiony/, план 09, этап 3): рамка страницы; список районов страница подставляет сама
// под первый экран — из коллекции «Районы».

import type { V3BlockWithTone } from '@/components/blocks/v3/types'

import { retone } from '@/lib/blocks/v3/retone'

import { img, kicker, PHONE_HREF, STEPS_DEFAULT } from '../sub-services/_template'
import type { PageContent } from '../sub-services/types'

const blocks: V3BlockWithTone[] = [
  {
    blockType: 'hero-slider',
    slides: [
      {
        kicker: kicker('Москва и область · выезд до 50 км от МКАД'),
        title: 'Районы, где мы работаем',
        lead: 'Москва и Московская область: спил деревьев, вывоз мусора, крыши и снег, демонтаж и благоустройство. Выберите свой район — там цены, сроки выезда и местные страницы услуг.',
        primary: { label: 'Рассчитать по фото', href: '#zayavka', icon: 'camera' },
        secondary: { label: 'Позвонить', href: PHONE_HREF },
        image: img('crew', 'Бригада Обихода идёт на участок'),
      },
    ],
    badge: {
      value: '50 км',
      text: 'от МКАД — выезд оценщика бесплатно',
      note: 'Аварийно — до 30 км, за 2 часа',
    },
    strip: [
      { icon: 'pin', title: 'Оценщик бесплатно', text: 'до 50 км от МКАД' },
      { icon: 'fast-response', title: 'Аварийный выезд', text: 'за 2 часа, до 30 км' },
      { icon: 'camera', title: 'Смета по фото', text: 'за 30 минут' },
      { icon: 'clock', title: 'Окно приезда 2 часа', text: 'опоздали — скидка 10%' },
    ],
  },
  {
    blockType: 'steps',
    eyebrow: 'Как работаем',
    title: 'От фото до акта — 5 шагов',
    items: STEPS_DEFAULT,
  },
  {
    blockType: 'faq-v3',
    eyebrow: 'Вопросы',
    title: 'Частые вопросы о выезде',
    items: [
      {
        question: 'Моего района нет в списке — приедете?',
        answer:
          'Да, работаем по всей Москве и области. Дальше 50 км от МКАД выезд оценщика и техники считаем в смете.',
      },
      {
        question: 'Как быстро приедете?',
        answer:
          'Оценщик — бесплатно сегодня или завтра до 50 км от МКАД. Аварийная бригада — за 2 часа до 30 км.',
      },
      {
        question: 'Цена зависит от района?',
        answer:
          'Работы стоят одинаково, отличается только доставка техники за 30–50 км — она будет в смете заранее.',
      },
    ],
  },
  {
    blockType: 'final-form',
    anchor: 'zayavka',
    eyebrow: 'Заявка · ответ за 10 минут',
    title: 'Оставьте заявку — перезвоним за 10 минут',
    background: img('yard-after', 'Чистый участок после работ'),
    channels: [],
    formTitle: 'Заявка',
    source: 'raiony',
  },
]

export const raiony: PageContent = {
  slug: 'raiony',
  title: 'Районы',
  metaTitle: 'Районы Москвы и МО, где работает Обиход',
  metaDescription:
    'Где работаем: Москва и Московская область. Выезд оценщика бесплатно до 50 км от МКАД, аварийная бригада за 2 часа до 30 км. Спил, вывоз, крыши, демонтаж.',
  blocks: retone(blocks),
}
