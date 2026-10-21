// Раздел «Услуги» (/uslugi/, план 09, этап 3): все направления плитками, как выбрать, для бизнеса, гарантии.

import type { V3BlockWithTone } from '@/components/blocks/v3/types'

import { retone } from '@/lib/blocks/v3/retone'

import { img, kicker, OFFER_STRIP, PHONE_HREF, STEPS_DEFAULT } from '../sub-services/_template'
import type { PageContent } from '../sub-services/types'

import { PILLAR } from './_helpers'

const blocks: V3BlockWithTone[] = [
  {
    blockType: 'hero-slider',
    slides: [
      {
        kicker: kicker('порядок под ключ · Москва и область'),
        title: 'Услуги для дома, дачи и бизнеса',
        lead: 'Деревья, мусор, крыши и снег, демонтаж, благоустройство и техника — одна бригада и одна смета. Уборка и вывоз отходов наших работ — в цене.',
        primary: { label: 'Рассчитать по фото', href: '#zayavka', icon: 'camera' },
        secondary: { label: 'Цены', href: '/uslugi/tseny/' },
        image: img('crew', 'Бригада Обихода идёт на участок с инструментом'),
      },
    ],
    badge: {
      value: 'от 700 ₽',
      text: 'спил дерева до 20 см — самая простая работа',
      note: 'Смета по фото — за 30 минут',
    },
    strip: OFFER_STRIP,
  },
  {
    blockType: 'services-tiles',
    anchor: 'napravleniya',
    eyebrow: 'Направления',
    title: 'Что делаем',
    link: { label: 'Все цены', href: '/uslugi/tseny/' },
    items: [
      PILLAR.arboristika,
      PILLAR.vyvoz,
      PILLAR.krysha,
      PILLAR.demontazh,
      PILLAR.uborka,
      PILLAR.landshaft,
      PILLAR.arenda,
      PILLAR.alpinizm,
      PILLAR.bilet,
    ],
  },
  {
    blockType: 'tree-check',
    eyebrow: 'Как выбрать',
    title: 'Одна задача или весь участок',
    checklistTitle: 'Частые связки:',
    checklist: [
      'Купили дачу — расчистка, снос сарая, вывоз и выравнивание',
      'Аварийное дерево — спил, пень, вывоз веток',
      'Перед стройкой — снос, вывоз, планировка',
      'Зима — крыша, сосульки, двор по договору',
      'Благоустройство — проект, мощение, газон, свет',
    ],
    consult: {
      eyebrow: 'Одна смета',
      title: 'Пришлите фото участка',
      text: 'Посчитаем всё одной сметой — одной бригадой выходит дешевле, чем по отдельности.',
      points: ['Ответ за 30 минут', 'Оценщик бесплатно до 50 км', 'Оплата после приёмки'],
      cta: { label: 'Отправить фото', href: '#zayavka' },
    },
  },
  {
    blockType: 'b2b-plan',
    eyebrow: 'Для УК, ТСЖ и бизнеса',
    title: 'Территория по договору — круглый год',
    text: 'Деревья, крупногабарит, снег и наледь, уборка территории — один подрядчик, один договор и одна форма отчёта.',
    kpis: [
      { value: '2 ч', label: 'аварийный выезд' },
      { value: '6 ч', label: 'реакция на снегопад' },
      { value: 'ЭДО', label: 'закрывающие документы' },
    ],
    primary: { label: 'Запросить договор', href: '#zayavka' },
    secondary: { label: 'Для УК и ТСЖ', href: '/b2b/uk-tszh/' },
    audiences: [
      { icon: 'building', title: 'УК и ТСЖ', text: 'Придомовая территория' },
      { icon: 'leaf', title: 'СНТ и посёлки', text: 'Общие земли и проезды' },
      { icon: 'file', title: 'Застройщики', text: 'Расчистка и снос под стройку' },
      { icon: 'clock', title: 'FM и бизнес', text: 'Склады, БЦ, ТЦ' },
    ],
    note: {
      title: 'Договор на сезон или год',
      text: 'Фиксированный тариф, график и аварийный режим — в договоре.',
    },
  },
  {
    blockType: 'steps',
    eyebrow: 'Как работаем',
    title: 'От фото до акта — 5 шагов',
    items: STEPS_DEFAULT,
  },
  {
    blockType: 'photo-cta',
    eyebrow: 'Смета по фото',
    title: 'Пришлите фото — цена через 30 минут',
    text: 'Не знаете, какая услуга нужна, — пришлите фото участка, подскажем и посчитаем.',
    image: img('phone-order', 'Фото задачи в телефоне'),
    primary: { label: 'Отправить фото', href: '#zayavka', icon: 'upload' },
    secondary: { label: 'Позвонить', href: PHONE_HREF, icon: 'phone' },
  },
  {
    blockType: 'reviews-v3',
    eyebrow: 'Отзывы',
    title: 'Что говорят клиенты',
    items: [],
  },
  {
    blockType: 'faq-v3',
    eyebrow: 'Вопросы',
    title: 'Частые вопросы',
    items: [
      {
        question: 'Можно заказать несколько услуг сразу?',
        answer:
          'Да, одной бригадой и одной сметой — так обычно дешевле, чем заказывать по отдельности.',
      },
      {
        question: 'Где работаете?',
        answer: 'Москва и Московская область; оценщик выезжает бесплатно до 50 км от МКАД.',
      },
      {
        question: 'Как фиксируется цена?',
        answer:
          'Твёрдая цена — в договоре до начала работ, доплаты — только с вашего письменного согласия.',
      },
      {
        question: 'Работаете с юрлицами?',
        answer: 'Да: договор, безнал, акт и закрывающие документы по ЭДО.',
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
    formTitle: 'Заявка на услуги',
    source: 'uslugi',
  },
]

export const uslugi: PageContent = {
  slug: 'uslugi',
  title: 'Услуги',
  metaTitle: 'Услуги Обихода в Москве и МО — деревья, мусор, крыши, демонтаж',
  metaDescription:
    'Спил и уход за деревьями, вывоз мусора, чистка крыш и снег, демонтаж, уборка территории, благоустройство, аренда техники. Одна бригада и одна смета.',
  blocks: retone(blocks),
}
