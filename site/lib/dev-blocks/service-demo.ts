// Витрина /dev/blocks, второй раздел (этап 2 плана 09): варианты блоков на страницах услуг —
// первый экран с обещанием оффера, «Что важно знать в районе», форма с открытыми фото, документ.
// Тексты — как на сайте (оффер подтверждён 22.10), картинки — иллюстрации витрины.

import type { BlockImage, V3BlockWithTone } from '@/components/blocks/v3/types'

const img = (name: string, alt: string): BlockImage => ({
  url: `/dev-blocks/${name}.webp`,
  alt,
  focus: null,
  illustration: true,
})

const lexical = (...items: (string | { h: string })[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((it) =>
      typeof it === 'string'
        ? {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'text',
                text: it,
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
          }
        : {
            type: 'heading',
            tag: 'h2',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'text',
                text: it.h,
                format: 0,
                detail: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
          },
    ),
  },
})

/** Страница услуги: первый экран с обещанием, «что важно знать», форма с фото. */
export const SERVICE_DEMO: V3BlockWithTone[] = [
  {
    blockType: 'hero-slider',
    slides: [
      {
        kicker: 'от 700 ₽ за ствол · Истра',
        title: 'Спил деревьев в Истре',
        promise: 'Спилим и вывезем — по твёрдой смете, оплата после приёмки',
        lead: 'Целиком, если есть место для валки, или по частям над домом и проводами. Округ в 40 км от МКАД — оценщик приезжает бесплатно.',
        primary: { label: 'Рассчитать по фото', href: '#zayavka-service', icon: 'camera' },
        secondary: { label: 'Цены', href: '#ceny' },
        image: img('arb-climb', 'Арборист в страховке на дереве у дома'),
      },
    ],
    badge: {
      value: 'от 700 ₽',
      text: 'за ствол до 20 см — спил в свободную сторону, с уборкой веток',
      note: 'Точная цена — в смете до начала работ',
    },
    strip: [
      { icon: 'camera', title: 'Смета по фото', text: 'за 30 минут' },
      { icon: 'cash', title: 'Оплата после приёмки', text: 'без предоплаты' },
      { icon: 'dumpster', title: 'Уборка и вывоз', text: 'до 5 м³ — в цене' },
      { icon: 'clock', title: 'Окно приезда 2 часа', text: 'опоздали — скидка 10%' },
    ],
  },
  {
    blockType: 'documents',
    eyebrow: 'Перед заказом',
    title: 'Что важно знать в Истре',
    items: [
      {
        icon: 'stamp',
        title: 'Порубочный билет в округе Истра',
        text: 'Вырубка деревьев, в том числе сухих, — по разрешению администрации (закон МО № 191/2014-ОЗ, ст. 42). Заявление — на uslugi.mosreg.ru; за сухостой компенсационную стоимость не берут.',
        metaLabel: 'срок',
        metaValue: 'до 17 рабочих дней',
      },
      {
        icon: 'alert',
        title: 'Берег Истринского водохранилища',
        text: 'В водоохранной зоне машинам можно стоять только на дороге или площадке с твёрдым покрытием — тогда разбираем дерево вручную и выносим к дороге.',
        metaLabel: 'основание',
        metaValue: 'Водный кодекс, ст. 65',
      },
      {
        icon: 'leaf',
        title: 'Плодовые деревья на своём участке',
        text: 'Для плодово-ягодных на участках садоводства и ИЖС разрешение на вырубку не нужно. На берёзу, ель и сосну исключение не распространяется.',
      },
    ],
  },
  {
    blockType: 'final-form',
    anchor: 'zayavka-service',
    eyebrow: 'Заявка · ответ за 10 минут',
    title: 'Приложите фото — смета за 30 минут',
    background: img('yard-after', 'Чистый участок после работ'),
    channels: [],
    formTitle: 'Смета по фото',
    source: 'dev-blocks-service',
    openDetails: true,
  },
]

/** Документ «Страниц» — политика и согласие ПДн. */
export const DOC_DEMO: V3BlockWithTone[] = [
  {
    blockType: 'legal-doc',
    eyebrow: 'Документ',
    title: 'Согласие на обработку персональных данных',
    revision: '19 октября 2026 г.',
    body: lexical(
      'Отправляя заявку на сайте obikhod.ru, я даю согласие на обработку моих персональных данных — телефона, имени, адреса и фото объекта — для расчёта стоимости и связи со мной.',
      { h: 'Срок и отзыв согласия' },
      'Согласие действует до достижения цели обработки и может быть отозвано письмом на партнёрскую почту компании.',
    ),
  },
]
