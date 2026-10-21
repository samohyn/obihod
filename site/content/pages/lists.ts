// Страницы-списки (план 09, этап 3): блог и кейсы. Документ задаёт рамку — первый экран, «пришлите фото»,
// заявку; сам список страница подставляет под первый экран из коллекции («Блог», «Кейсы»).

import type { BlockImage, V3BlockWithTone } from '@/components/blocks/v3/types'

import { retone } from '@/lib/blocks/v3/retone'

import { img, kicker, OFFER_STRIP, PHONE_HREF } from '../sub-services/_template'
import type { PageContent } from '../sub-services/types'

function listPage(spec: {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  kicker: string
  heroTitle: string
  lead: string
  image: BlockImage
}): PageContent {
  const blocks: V3BlockWithTone[] = [
    {
      blockType: 'hero-slider',
      slides: [
        {
          kicker: kicker(spec.kicker),
          title: spec.heroTitle,
          lead: spec.lead,
          primary: { label: 'Рассчитать по фото', href: '#zayavka', icon: 'camera' },
          secondary: { label: 'Позвонить', href: PHONE_HREF },
          image: spec.image,
        },
      ],
      badge: null,
      strip: OFFER_STRIP,
    },
    {
      blockType: 'photo-cta',
      eyebrow: 'Смета по фото',
      title: 'Пришлите фото — цена через 30 минут',
      text: 'Похожая задача? Пришлите фото — посчитаем и скажем, что входит.',
      image: img('phone-order', 'Фото задачи в телефоне'),
      primary: { label: 'Отправить фото', href: '#zayavka', icon: 'upload' },
      secondary: { label: 'Позвонить', href: PHONE_HREF, icon: 'phone' },
    },
    {
      blockType: 'final-form',
      anchor: 'zayavka',
      eyebrow: 'Заявка · ответ за 10 минут',
      title: 'Оставьте заявку — перезвоним за 10 минут',
      background: img('yard-after', 'Чистый участок после работ'),
      channels: [],
      formTitle: 'Заявка',
      source: spec.slug,
    },
  ]
  return {
    slug: spec.slug,
    title: spec.title,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    blocks: retone(blocks),
  }
}

export const blog = listPage({
  slug: 'blog',
  title: 'Блог',
  metaTitle: 'Блог Обихода — деревья, мусор, крыши, демонтаж',
  metaDescription:
    'Что важно знать перед заказом: законы и штрафы за спил, вывоз мусора из СНТ, когда чистить крышу, как снести старый дом. Статьи с ценами и порядком работ.',
  kicker: 'статьи · Москва и область',
  heroTitle: 'Блог: деревья, мусор, крыши, демонтаж',
  lead: 'Законы и штрафы, сроки и порядок работ, как подготовить участок — то, что спрашивают перед заказом чаще всего.',
  image: img('arbor', 'Арборист в кроне дерева'),
})

export const kejsy = listPage({
  slug: 'kejsy',
  title: 'Кейсы',
  metaTitle: 'Кейсы Обихода — объекты в Москве и МО с ценой и сроком',
  metaDescription:
    'Выполненные объекты: спил деревьев, вывоз мусора, чистка крыш, демонтаж — что сделали, за сколько и в какие сроки, по районам Москвы и области.',
  kicker: 'объекты · Москва и область',
  heroTitle: 'Кейсы: что сделали и за сколько',
  lead: 'Объекты по направлениям и районам: задача, сроки и итог по акту. Фото «до» и «после» добавляем по мере сдачи объектов.',
  image: img('case1-after', 'Участок после работ'),
})
