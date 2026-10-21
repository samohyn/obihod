// Раздел «Цены» (план 09, этап 3): /uslugi/tseny/ и прайсы направлений. Документ задаёт рамку — первый
// экран, «пришлите фото», вопросы и заявку; сами цены страница подставляет под первый экран из опубликованных
// подуслуг (или из хаба, если подуслуг нет). Правите цену в подуслуге — она меняется и в прайсе.

import type { BlockImage, V3BlockWithTone } from '@/components/blocks/v3/types'

import { retone } from '@/lib/blocks/v3/retone'

import { img, kicker, PHONE_HREF } from '../sub-services/_template'
import type { PageContent } from '../sub-services/types'

const PRICE_FAQ = [
  {
    question: 'Цены на сайте окончательные?',
    answer:
      'Это цены «от» для типовых работ. Твёрдую цену называем по фото или после бесплатного осмотра и фиксируем в договоре до начала работ.',
  },
  {
    question: 'Что входит в цену?',
    answer:
      'Работа бригады и уборка отходов наших работ с вывозом. Что считается отдельно — техника, материалы, доплаты — написано у каждой услуги и в смете.',
  },
  {
    question: 'Может ли цена вырасти на месте?',
    answer: 'Нет: доплаты — только с вашего письменного согласия.',
  },
  {
    question: 'Как платить?',
    answer: 'После работ и приёмки, без предоплаты. Юрлицам — по договору, возможна отсрочка.',
  },
]

function pricePage(spec: {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  kicker: string
  lead: string
  image: BlockImage
  badge: { value: string; text: string; note?: string }
}): PageContent {
  const blocks: V3BlockWithTone[] = [
    {
      blockType: 'hero-slider',
      slides: [
        {
          kicker: kicker(spec.kicker),
          title: spec.title,
          lead: spec.lead,
          primary: { label: 'Рассчитать по фото', href: '#zayavka', icon: 'camera' },
          secondary: { label: 'Позвонить', href: PHONE_HREF },
          image: spec.image,
        },
      ],
      badge: spec.badge,
      strip: [
        { icon: 'camera', title: 'Смета по фото', text: 'за 30 минут' },
        { icon: 'file', title: 'Твёрдая цена', text: 'в договоре' },
        { icon: 'cash', title: 'Оплата после приёмки', text: 'без предоплаты' },
        { icon: 'dumpster', title: 'Уборка и вывоз', text: 'отходов работ — в цене' },
      ],
    },
    {
      blockType: 'photo-cta',
      eyebrow: 'Смета по фото',
      title: 'Пришлите фото — цена через 30 минут',
      text: 'Не нашли свою работу в прайсе или не знаете объём — посчитаем по фото и скажем, что входит.',
      image: img('phone-order', 'Фото задачи в телефоне'),
      primary: { label: 'Отправить фото', href: '#zayavka', icon: 'upload' },
      secondary: { label: 'Позвонить', href: PHONE_HREF, icon: 'phone' },
    },
    {
      blockType: 'faq-v3',
      eyebrow: 'Вопросы',
      title: 'Частые вопросы о ценах',
      items: PRICE_FAQ,
    },
    {
      blockType: 'final-form',
      anchor: 'zayavka',
      eyebrow: 'Заявка · ответ за 10 минут',
      title: 'Оставьте заявку — перезвоним за 10 минут',
      background: img('yard-after', 'Чистый участок после работ'),
      channels: [],
      formTitle: 'Расчёт стоимости',
      source: spec.slug.replace(/\//g, '-'),
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

const pillarPrices = (
  pillar: string,
  name: string,
  image: BlockImage,
  badge: { value: string; text: string; note?: string },
): PageContent =>
  pricePage({
    slug: `uslugi/tseny/${pillar}`,
    title: `Цены: ${name.toLowerCase()}`,
    metaTitle: `${name} — цены в Москве и МО, прайс 2026`,
    metaDescription: `Прайс на услуги «${name}»: цены «от» по каждой работе, что входит и что считается отдельно. Смета по фото за 30 минут, оплата после приёмки.`,
    kicker: 'прайс 2026 · Москва и область',
    lead: 'Цены «от» по каждой работе направления. Твёрдую цену называем по фото или после бесплатного осмотра и фиксируем в договоре.',
    image,
    badge,
  })

export const PRICES: PageContent[] = [
  pricePage({
    slug: 'uslugi/tseny',
    title: 'Цены на услуги',
    metaTitle: 'Цены на услуги Обихода в Москве и МО — прайс 2026',
    metaDescription:
      'Прайс по всем направлениям: спил деревьев, вывоз мусора, чистка крыш, демонтаж, благоустройство, аренда техники. Цены «от», смета по фото за 30 минут.',
    kicker: 'прайс 2026 · Москва и область',
    lead: 'Цены «от» по всем направлениям — по ссылке у каждого раздела подробный прайс. Твёрдая цена — в договоре, оплата после приёмки.',
    image: img('crew', 'Бригада идёт на участок с инструментом'),
    badge: { value: 'от 700 ₽', text: 'спил дерева до 20 см', note: 'Смета по фото — бесплатно' },
  }),
  pillarPrices('arboristika', 'Спил и уход за деревьями', img('arb-climb', 'Арборист на дереве'), {
    value: 'от 700 ₽',
    text: 'спил дерева до 20 см',
  }),
  pillarPrices('vyvoz-musora', 'Вывоз мусора', img('vyvoz-gazel', 'Грузчики загружают Газель'), {
    value: 'от 12 800 ₽',
    text: 'Газель с грузчиками, за объект',
  }),
  pillarPrices(
    'chistka-krysh',
    'Чистка крыш и уборка снега',
    img('zima-krysha-lenta', 'Чистка крыши от снега'),
    {
      value: 'от 1 000 ₽',
      text: 'за м² скатной кровли',
    },
  ),
  pillarPrices('demontazh', 'Демонтаж и снос', img('demo-dacha', 'Снос старой дачи'), {
    value: 'от 18 000 ₽',
    text: 'дровяник или навес под ключ',
  }),
  pillarPrices('dizain-landshafta', 'Дизайн ландшафта', img('garden', 'Ухоженный участок'), {
    value: 'от 250 ₽',
    text: 'за м² — укладка газона',
  }),
  pillarPrices('arenda-tehniki', 'Аренда техники', img('eq-lift', 'Автовышка'), {
    value: 'от 9 600 ₽',
    text: 'смена минитрактора с оператором',
  }),
  pillarPrices('uborka-territorii', 'Уборка территории', img('yard-after', 'Чистый участок'), {
    value: 'от 12 800 ₽',
    text: 'зимняя уборка двора',
  }),
  pillarPrices('porubochnyj-bilet', 'Порубочный билет', img('act', 'Документы'), {
    value: '8 600 ₽',
    text: 'за заявку',
  }),
  pillarPrices(
    'promyshlennyj-alpinizm',
    'Промышленный альпинизм',
    img('zima-sosulki', 'Альпинист на фасаде'),
    {
      value: 'от 280 ₽',
      text: 'за м² — мойка фасада',
    },
  ),
  pillarPrices('foto-smeta', 'Смета по фото', img('phone-order', 'Фото объекта в телефоне'), {
    value: '0 ₽',
    text: 'смета по фото',
  }),
  pillarPrices('raschet-stoimosti', 'Расчёт стоимости', img('phone-order', 'Расчёт стоимости'), {
    value: 'от 700 ₽',
    text: 'спил дерева до 20 см',
  }),
]
