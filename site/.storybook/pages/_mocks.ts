/**
 * Общие mock-данные для page-composition stories.
 *
 * Не импортируется приложением — только Storybook. Mock-data зеркалит
 * структуру блоков из site/components/blocks/types.ts, но не вызывает
 * Payload (без БД).
 */
import type { AnyBlock } from '../../components/blocks/types'

const lex = (text: string) => ({
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

const lexParas = (paras: string[]) => ({
  root: {
    type: 'root',
    children: paras.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text }],
    })),
  },
})

export const heroSummer: AnyBlock = {
  blockType: 'hero',
  heading: 'Вывоз мусора в Москве и МО — за 1 день',
  subheading: 'Бригада Обихода: контейнер от 8 м³, погрузка под ключ, цена по фото за 15 минут.',
  primaryCta: { label: 'Запросить смету', href: '/foto-smeta/', variant: 'primary' },
  secondaryCta: { label: 'Кейсы', href: '/kejsy/' },
  seasonalTheme: 'summer',
}

export const breadcrumbsServiceDistrict: AnyBlock = {
  blockType: 'breadcrumbs',
  items: [
    { name: 'Главная', url: '/' },
    { name: 'Вывоз мусора', url: '/vyvoz-musora/' },
    { name: 'Одинцово', url: '/vyvoz-musora/odincovo/' },
  ],
}

export const tldrPillar: AnyBlock = {
  blockType: 'tldr',
  text: 'Вывоз мусора в Москве и МО — от 6 200 ₽ за 8 м³ контейнер. Бригада приедет в день обращения, цена фиксируется по фото без выезда замерщика.',
}

export const textContentLong: AnyBlock = {
  blockType: 'text-content',
  eyebrow: 'Подробно',
  heading: 'Как работает вывоз мусора Обихода',
  body: lexParas([
    'Бригада «Обихода» работает в Москве и Московской области 7 лет. Подаём контейнеры 8, 20 и 27 м³, грузим вручную или с гидроманипулятором — зависит от характера мусора.',
    'Цена фиксируется по фото за 15 минут, без сюрпризов на месте. Работаем с физлицами, УК, ТСЖ и застройщиками. По договору — полный комплект: акт, ТТН, фотоотчёт.',
  ]),
}

export const servicesGridSubs: AnyBlock = {
  blockType: 'services-grid',
  eyebrow: 'Что вывозим',
  heading: 'Под-услуги вывоза мусора',
  items: [
    { title: 'Старая мебель', slug: 'vyvoz-musora/staraya-mebel', icon: 's-mebel' },
    { title: 'Строительный мусор', slug: 'vyvoz-musora/stroymusor', icon: 's-stroy' },
    { title: 'Бытовая техника', slug: 'vyvoz-musora/byttehnika', icon: 's-tehnika' },
    { title: 'Расхламление дачи', slug: 'vyvoz-musora/dacha', icon: 's-dacha' },
  ],
}

export const miniCaseOdincovo: AnyBlock = {
  blockType: 'mini-case',
  inline: {
    title: 'Сняли пень в гостиной — Одинцово',
    photo: {
      url: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=80',
      alt: 'Бригада «Обихода» в Одинцово',
    },
    facts: [
      { label: 'Срок', value: '4 часа' },
      { label: 'Бригада', value: '3 человека' },
      { label: 'Объём', value: '4 м³ опилок' },
      { label: 'Цена', value: '12 800 ₽' },
    ],
    link: '/kejsy/snyali-pen-v-gostice/',
  },
}

export const relatedServices3: AnyBlock = {
  blockType: 'related-services',
  heading: 'Также делаем',
  items: [
    { title: 'Спил деревьев', slug: 'spil-derevev', summary: 'Аварийные деревья и корчёвка пней.' },
    { title: 'Демонтаж', slug: 'demontazh', summary: 'Сараи, заборы, теплицы под ключ.' },
    { title: 'Чистка крыш', slug: 'chistka-krysh', summary: 'Снег и наледь, мусор и листва.' },
  ],
}

export const neighborDistrictsOdincovo: AnyBlock = {
  blockType: 'neighbor-districts',
  heading: 'Соседние районы',
  serviceSlug: 'vyvoz-musora',
  items: [
    { name: 'Жуковский', slug: 'zhukovskij', distance: '12 км' },
    { name: 'Раменское', slug: 'ramenskoe', distance: '18 км' },
    { name: 'Бронницы', slug: 'bronnitsy', distance: '24 км' },
  ],
}

export const calculatorMusor: AnyBlock = {
  blockType: 'calculator-placeholder',
  serviceType: 'musor',
}

export const faqLocal: AnyBlock = {
  blockType: 'faq',
  heading: 'Частые вопросы',
  generateFaqPageSchema: true,
  items: [
    {
      question: 'Сколько стоит вывоз мусора в Одинцово?',
      answer: lex('От 6 200 ₽ за 8 м³ контейнер с погрузкой. Точная цена — по фото.'),
    },
    {
      question: 'За сколько приедет бригада?',
      answer: lex('В день обращения, если позвонили до 16:00.'),
    },
    {
      question: 'Работаете ли с УК?',
      answer: lex('Да, по договору с актами, ТТН и регулярными выездами.'),
    },
  ],
}

export const leadFormDistrict: AnyBlock = {
  blockType: 'lead-form',
  heading: 'Оставьте заявку — перезвоним за 15 минут',
  subheading: 'Бесплатный замер, цена по фото без выезда.',
  serviceHint: { slug: 'vyvoz-musora', title: 'Вывоз мусора' },
  districtHint: { slug: 'odincovo', nameNominative: 'Одинцово' },
  consentText: 'Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных.',
}

export const ctaBannerFotoSmeta: AnyBlock = {
  blockType: 'cta-banner',
  heading: 'Цена по фото за 15 минут',
  body: 'Пришлите 2-3 фото объекта в Telegram или на сайт — расчёт без выезда замерщика.',
  cta: { label: 'Запросить смету', href: '/foto-smeta/' },
  accent: 'primary',
}
