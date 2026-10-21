// Шаблон подуслуги (эталон — «Спил деревьев», план 09, этап 3): порядок блоков и общие секции.
// Страница описывает только своё — первый экран, цены, калькулятор, способы, вопросы, связанные
// услуги; гарантии, этапы, документы, отзывы и заявка — общие. Фон секций чередуется сам.

import type {
  BlockImage,
  CalculatorBlock,
  DocumentItem,
  EquipmentItem,
  IconItem,
  PriceTab,
  ProjectItem,
  ServiceTile,
  StepItem,
  V3BlockWithTone,
} from '@/components/blocks/v3/types'

import type { SubServiceContent } from './types'

export const img = (name: string, alt: string, focus?: string): BlockImage => ({
  url: `/dev-blocks/${name}.webp`,
  alt,
  focus: focus ?? null,
  illustration: true,
})

export const PHONE_HREF = 'tel:+79851705111'

/** Надзаголовок «от 8 400 ₽ за дерево · Москва и область»: части переносятся только целиком. */
export const kicker = (text: string) =>
  text
    .split(' · ')
    .map((part) => part.replace(/ /g, '\u00a0'))
    .join(' · ')

/** Обещания оффера (contex/10_offer.md) — полоса под первым экраном по умолчанию. */
export const OFFER_STRIP: IconItem[] = [
  { icon: 'camera', title: 'Смета по фото', text: 'за 30 минут' },
  { icon: 'cash', title: 'Оплата после приёмки', text: 'без предоплаты' },
  { icon: 'dumpster', title: 'Уборка и вывоз', text: 'до 5 м³ — в цене' },
  { icon: 'clock', title: 'Окно приезда 2 часа', text: 'опоздали — скидка 10%' },
]

export const STEPS_DEFAULT: StepItem[] = [
  {
    time: '00:00',
    title: 'Фото или звонок',
    text: 'Пришлите фото через форму или на почту — или позвоните',
  },
  {
    time: '+30 мин',
    title: 'Смета по фото',
    text: 'Способ, цена и что входит. Нужен осмотр — оценщик приедет бесплатно сегодня или завтра',
  },
  {
    time: 'в окно 2 часа',
    title: 'Приезд бригады',
    text: 'Ограждаем зону работ и фотографируем «до»',
  },
  {
    time: 'день работ',
    title: 'Работа и уборка',
    text: 'Делаем по смете, убираем и вывозим отходы',
  },
  {
    time: 'приёмка',
    title: 'Акт и оплата',
    text: 'Обходим участок вместе, подписываем акт — оплата после',
  },
]

export const PERMIT_DOC: DocumentItem = {
  icon: 'stamp',
  title: 'Порубочный билет',
  text: 'Нужен для деревьев на общей территории СНТ, у многоквартирного дома и в зелёных зонах. Оформим сами',
  metaLabel: 'срок',
  metaValue: '7–14 рабочих дней',
}

export const BASE_DOCS: DocumentItem[] = [
  {
    icon: 'file',
    title: 'Договор и твёрдая смета',
    text: 'До начала работ — цена потом не меняется',
    metaLabel: 'каждому',
    metaValue: 'бесплатно',
  },
  {
    icon: 'image',
    title: 'Фото «до» и «после»',
    text: 'Фотоотчёт по каждому объекту',
    metaLabel: 'каждому',
    metaValue: 'бесплатно',
  },
  {
    icon: 'checkCircle',
    title: 'Акт выполненных работ',
    text: 'Юрлицам — закрывающие документы',
    metaLabel: 'каждому',
    metaValue: 'бесплатно',
  },
]

const GUARANTEES: V3BlockWithTone = {
  blockType: 'guarantees',
  eyebrow: 'Гарантии',
  title: 'Обещания с условиями',
  items: [
    {
      icon: 'file',
      title: 'Твёрдая смета',
      text: 'Цена фиксируется в договоре до начала работ.',
      conditionLabel: 'Доплаты',
      conditionValue: 'только с вашего письменного согласия',
    },
    {
      icon: 'cash',
      title: 'Оплата после приёмки',
      text: 'Платите, когда обошли участок и подписали акт.',
      conditionLabel: 'Юрлицам',
      conditionValue: 'по договору, возможна отсрочка',
    },
    {
      icon: 'clock',
      title: 'Окно приезда 2 часа',
      text: 'Договариваемся о времени и приезжаем вовремя.',
      conditionLabel: 'Опоздали',
      conditionValue: 'скидка 10% с работ',
    },
    {
      icon: 'dumpster',
      title: 'Участок сдаём чистым',
      text: 'Убираем за собой, отходы вывозим на полигон.',
      conditionLabel: 'Уже',
      conditionValue: 'в цене сметы',
    },
  ],
}

export type SubServiceSpec = {
  service: string
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  hero: {
    kicker: string
    title: string
    lead: string
    image: BlockImage
    badge: { value: string; text: string; note?: string }
    strip?: IconItem[]
  }
  prices: { title: string; link?: { label: string; href: string }; tabs: PriceTab[] }
  calculator?: Omit<CalculatorBlock, 'blockType'>
  methods?: { eyebrow: string; title: string; items: EquipmentItem[] }
  /** false — без полосы «Пришлите фото» (когда у ключевого блока страницы своя кнопка) */
  photo?: { title?: string; text: string; image?: BlockImage } | false
  /** Свои секции после «Пришлите фото»: «когда нужно», сравнения и т. п. */
  middle?: V3BlockWithTone[]
  projects?: { eyebrow?: string; title?: string; items: ProjectItem[] }
  steps?: { title?: string; items: StepItem[] }
  documents?: { title: string; link?: { label: string; href: string }; items: DocumentItem[] }
  faq: { title: string; items: { question: string; answer: string }[] }
  related: { title: string; link?: { label: string; href: string }; items: ServiceTile[] }
  form: { title: string; formTitle: string; background?: BlockImage }
}

const TONED = new Set(['hero-slider', 'photo-cta', 'final-form', 'b2b-plan'])

export function subServicePage(spec: SubServiceSpec): SubServiceContent {
  const blocks: V3BlockWithTone[] = [
    {
      blockType: 'hero-slider',
      slides: [
        {
          kicker: kicker(spec.hero.kicker),
          title: spec.hero.title,
          lead: spec.hero.lead,
          primary: { label: 'Рассчитать по фото', href: '#zayavka', icon: 'camera' },
          secondary: { label: 'Цены', href: '#ceny' },
          image: spec.hero.image,
        },
      ],
      badge: spec.hero.badge,
      strip: spec.hero.strip ?? OFFER_STRIP,
    },
    {
      blockType: 'price-tabs',
      anchor: 'ceny',
      eyebrow: 'Цены',
      title: spec.prices.title,
      link: spec.prices.link ?? null,
      tabs: spec.prices.tabs,
    },
  ]
  if (spec.calculator) {
    blocks.push({ blockType: 'calculator-v3', anchor: 'calc', ...spec.calculator })
  }
  if (spec.methods) blocks.push({ blockType: 'equipment', anchor: 'sposoby', ...spec.methods })
  const photo = spec.photo || undefined
  if (spec.photo !== false)
    blocks.push({
      blockType: 'photo-cta',
      eyebrow: 'Смета по фото',
      title: photo?.title ?? 'Пришлите фото — цена через 30 минут',
      text: photo?.text,
      image: photo?.image ?? img('phone-order', 'Фото задачи в телефоне'),
      primary: { label: 'Отправить фото', href: '#zayavka', icon: 'upload' },
      secondary: { label: 'Позвонить', href: PHONE_HREF, icon: 'phone' },
    })
  blocks.push(...(spec.middle ?? []))
  if (spec.projects) {
    blocks.push({
      blockType: 'projects',
      eyebrow: spec.projects.eyebrow ?? 'Сколько это стоит на практике',
      title: spec.projects.title ?? 'Примеры: смета = акт',
      items: spec.projects.items,
    })
  }
  blocks.push({
    blockType: 'steps',
    eyebrow: 'Как работаем',
    title: spec.steps?.title ?? 'От фото до акта — 5 шагов',
    items: spec.steps?.items ?? STEPS_DEFAULT,
  })
  if (spec.documents) {
    blocks.push({
      blockType: 'documents',
      eyebrow: 'Документы',
      title: spec.documents.title,
      link: spec.documents.link ?? null,
      items: spec.documents.items,
    })
  }
  blocks.push(GUARANTEES)
  blocks.push({
    blockType: 'reviews-v3',
    eyebrow: 'Отзывы',
    title: 'Что говорят клиенты',
    items: [],
  })
  blocks.push({
    blockType: 'faq-v3',
    eyebrow: 'Вопросы',
    title: spec.faq.title,
    items: spec.faq.items,
  })
  blocks.push({
    blockType: 'services-tiles',
    eyebrow: 'Ещё на участке',
    title: spec.related.title,
    link: spec.related.link ?? null,
    items: spec.related.items,
  })
  blocks.push({
    blockType: 'final-form',
    anchor: 'zayavka',
    eyebrow: 'Заявка · ответ за 10 минут',
    title: spec.form.title,
    background: spec.form.background ?? img('yard-after', 'Чистый участок после работ'),
    channels: [],
    formTitle: spec.form.formTitle,
    source: spec.slug,
  })

  // Фон чередуется: кремовый / бежевый, кроме секций со своим фоном.
  let alt = false
  const toned = blocks.map((b) => {
    if (TONED.has(b.blockType)) return b
    const tone = alt ? 'alt' : 'default'
    alt = !alt
    return { ...b, tone } as V3BlockWithTone
  })

  return {
    service: spec.service,
    slug: spec.slug,
    title: spec.title,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    blocks: toned,
  }
}

// ─── связанные услуги арбористики (плитки) ───────────────────────────────────

export const TILE: Record<string, ServiceTile> = {
  spil: {
    title: 'Спил деревьев',
    text: 'Целиком, по частям, с автовышки',
    price: 'от 700 ₽',
    href: '/arboristika/spil-derevev/',
    image: img('spil-before', 'Сухой тополь над дачей'),
  },
  avariya: {
    title: 'Аварийный спил',
    text: 'Выезд за 2 часа, круглосуточно',
    price: 'от 12 400 ₽',
    href: '/arboristika/avariynyy-spil/',
    image: img('spil-avaria-before', 'Упавшее дерево после ветра'),
  },
  pen: {
    title: 'Удаление пня',
    text: 'Фреза, химия или корчевание',
    price: 'от 3 200 ₽',
    href: '/arboristika/udalenie-pnya/',
    image: img('spil-pen', 'Фрезеровка пня на участке'),
  },
  kronirovanie: {
    title: 'Кронирование',
    text: 'Формирование кроны без вреда дереву',
    price: 'от 3 800 ₽',
    href: '/arboristika/kronirovanie/',
    image: img('arbor', 'Арборист на автовышке обрезает берёзу'),
  },
  sanitar: {
    title: 'Санитарная обрезка',
    text: 'Сухие и опасные ветви',
    price: 'от 2 600 ₽',
    href: '/arboristika/sanitarnaya-obrezka/',
    image: img('spil-sanitar', 'Арборист срезает сухую ветку'),
  },
  kabling: {
    title: 'Каблинг',
    text: 'Растяжки вместо спила',
    price: 'от 14 800 ₽',
    href: '/arboristika/kabling/',
    image: img('spil-kabling', 'Растяжка в кроне старой липы'),
  },
  alpinist: {
    title: 'Спил альпинистами',
    text: 'Без проезда для автовышки',
    price: 'от 8 400 ₽',
    href: '/arboristika/spil-alpinistami/',
    image: img('arb-climb', 'Арборист на дереве со страховкой', 'center 30%'),
  },
  vyshka: {
    title: 'Спил с автовышки',
    text: 'Открытый участок, 17–21 м',
    price: 'от 6 800 ₽',
    href: '/arboristika/spil-s-avtovyshki/',
    image: img('eq-lift', 'Автовышка у дерева на дачном участке'),
  },
  valka: {
    title: 'Валка целиком',
    text: 'Когда есть место для падения',
    price: 'от 2 400 ₽',
    href: '/arboristika/valka-derevev/',
    image: img('spil-valka', 'Валка дерева с направляющим тросом'),
  },
  shchepa: {
    title: 'Измельчение веток',
    text: 'Щепа остаётся на участке',
    price: '727 ₽ за м³',
    href: '/arboristika/izmelchenie-vetok/',
    image: img('spil-chipper', 'Измельчитель перерабатывает ветки в щепу'),
  },
  raschistka: {
    title: 'Расчистка участка',
    text: 'Подлесок и кустарник под ноль',
    price: 'от 28 000 ₽ за сотку',
    href: '/arboristika/raschistka-uchastka/',
    image: img('spil-raschistka-before', 'Заросший участок'),
  },
  vyvoz: {
    title: 'Вывоз порубочных остатков',
    text: 'Стволы и ветки за один заезд',
    price: 'от 16 400 ₽',
    href: '/vyvoz-musora/vyvoz-porubochnyh/',
    image: img('truck-out', 'Машина с ветками выезжает с участка'),
  },
  // вывоз мусора
  stroymusor: {
    title: 'Строительный мусор',
    text: 'После ремонта и демонтажа',
    price: 'от 12 800 ₽',
    href: '/vyvoz-musora/vyvoz-stroymusora/',
    image: img('case2-before', 'Строительный мусор после ремонта'),
  },
  kontejner: {
    title: 'Контейнер для мусора',
    text: '8, 20 и 27 м³, сутки — в цене',
    price: 'от 14 800 ₽',
    href: '/vyvoz-musora/kontejner/',
    image: img('skip-full', 'Заполненный контейнер у дома'),
  },
  gazel: {
    title: 'Газель с грузчиками',
    text: '5 м³, погрузка и вывоз',
    price: 'от 12 800 ₽',
    href: '/vyvoz-musora/gazel/',
    image: img('vyvoz-gazel', 'Грузчики загружают мешки в Газель'),
  },
  kgm: {
    title: 'Крупногабаритный мусор',
    text: 'Сантехника, окна, двери, техника',
    price: 'от 12 800 ₽',
    href: '/vyvoz-musora/krupnogabarit/',
    image: img('vyvoz-kgm', 'Старая ванна, двери и рамы у машины'),
  },
  mebel: {
    title: 'Старая мебель',
    text: 'Разберём, вынесем, вывезем',
    price: 'от 12 800 ₽',
    href: '/vyvoz-musora/staraya-mebel/',
    image: img('vyvoz-mebel', 'Грузчики выносят старый диван'),
  },
  sadovyi: {
    title: 'Садовый мусор',
    text: 'Листва, ветки, трава',
    price: 'от 14 200 ₽',
    href: '/vyvoz-musora/vyvoz-sadovogo-musora/',
    image: img('leaves', 'Мешки с листвой на участке'),
  },
  uborka: {
    title: 'Уборка участка от мусора',
    text: 'Хлам прежних хозяев за день',
    price: 'от 13 600 ₽',
    href: '/vyvoz-musora/uborka-uchastka/',
    image: img('yard-before', 'Захламлённый участок'),
  },
  demontazh: {
    title: 'Демонтаж и снос',
    text: 'Сараи, бани, дачи — с вывозом',
    price: 'от 32 000 ₽',
    href: '/demontazh/',
    image: img('demo', 'Разбор старого сарая'),
  },
  uk: {
    title: 'Для УК и ТСЖ',
    text: 'Вывоз КГМ и стройотходов по договору',
    price: 'от 14 800 ₽',
    href: '/vyvoz-musora/dlya-uk-tszh/',
    image: img('vyvoz-uk', 'Бункер для крупногабаритного мусора во дворе'),
  },
  bilet: {
    title: 'Порубочный билет',
    text: 'Оформим за 7–14 рабочих дней',
    price: 'от 8 600 ₽',
    href: '/porubochnyj-bilet/',
    image: img('act', 'Документы на столе'),
  },
  kryshaDom: {
    title: 'Крыша частного дома',
    text: 'Снег и наледь со скатной кровли',
    price: 'от 1 000 ₽/м²',
    href: '/chistka-krysh/chistka-krysh-chastnyy-dom/',
    image: img('zima-krysha-lenta', 'Рабочий в страховке чистит крышу дома от снега'),
  },
  kryshaMkd: {
    title: 'Крыши МКД',
    text: 'Абонемент на сезон для УК и ТСЖ',
    price: 'от 45 000 ₽/мес',
    href: '/chistka-krysh/chistka-krysh-mkd/',
    image: img('b2b-roof', 'Рабочий чистит плоскую кровлю многоквартирного дома'),
  },
  sosulki: {
    title: 'Сбивание сосулек',
    text: 'Фасады, козырьки, балконы',
    price: 'от 4 200 ₽',
    href: '/chistka-krysh/sbivanie-sosulek/',
    image: img('zima-sosulki', 'Альпинист сбивает сосульки с карниза дома'),
  },
  sneg: {
    title: 'Очистка крыш от снега',
    text: 'Скатные и плоские кровли',
    price: 'от 1 000 ₽/м²',
    href: '/chistka-krysh/ot-snega/',
    image: img('roof', 'Чистка скатной крыши от снега'),
  },
  zimaDvor: {
    title: 'Зимняя уборка территории',
    text: 'Дворы, парковки, тротуары',
    price: 'от 12 800 ₽',
    href: '/chistka-krysh/uborka-territorii-zima/',
    image: img('zima-traktor', 'Трактор чистит двор многоквартирного дома от снега'),
  },
  sezon: {
    title: 'Договор на сезон',
    text: 'Кровля, двор и сосульки — один подрядчик',
    price: 'от 45 000 ₽/мес',
    href: '/chistka-krysh/dogovor-na-sezon/',
    image: img('zima-vyvoz-snega', 'Погрузка снега в самосвал во дворе'),
  },
  demDacha: {
    title: 'Демонтаж дачи',
    text: 'Под ключ с вывозом',
    price: 'от 58 000 ₽',
    href: '/demontazh/demontazh-dachi/',
    image: img('demo-dacha', 'Мини-экскаватор разбирает старую дачу'),
  },
  demBanya: {
    title: 'Демонтаж бани',
    text: 'Каркасные и срубы, с печью',
    price: 'от 35 000 ₽',
    href: '/demontazh/demontazh-bani/',
    image: img('demo-banya', 'Разбор старого сруба бани'),
  },
  demSaray: {
    title: 'Демонтаж сарая',
    text: 'Сараи, хозблоки, теплицы',
    price: 'от 18 000 ₽',
    href: '/demontazh/demontazh-saraya/',
    image: img('demo', 'Разбор старого сарая'),
  },
  snosDom: {
    title: 'Снос частного дома',
    text: 'Дерево, кирпич, газобетон',
    price: 'от 142 000 ₽',
    href: '/demontazh/snos-doma/',
    image: img('demo-dom', 'Экскаватор сносит кирпичный дом'),
  },
  snosGarazh: {
    title: 'Снос гаража',
    text: 'Металлические и кирпичные',
    price: 'от 38 000 ₽',
    href: '/demontazh/snos-garazha/',
    image: img('demo-garazh', 'Разбор металлического гаража'),
  },
  snosZabor: {
    title: 'Снос забора',
    text: 'Дерево, профлист, бетон',
    price: 'от 800 ₽/п. м',
    href: '/demontazh/snos-zabora/',
    image: img('demo-zabor', 'Демонтаж старого деревянного забора'),
  },
}
