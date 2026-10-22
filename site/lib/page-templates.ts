/**
 * «Шаблоны страниц» (globals/PageTemplates.ts) — тексты страниц, которые сайт собирает сам:
 * район, «услуга в районе», статья, кейс, авторы, 404, контакты (план 09, этап 4.4).
 * Без обращения к базе: описание полей и значения по умолчанию (они же — пока раздел не сохранён
 * и при сбое базы). Чтение из админки — getPageTemplates в lib/page-templates-server.ts.
 *
 * В текстах — подстановки района и страницы ({в районе}, {район}, {км}, {направление}, {заголовок},
 * {ориентиры}) и метки оффера ({перезвон}, {смета по фото}… — lib/offer.ts).
 */

export const TEMPLATE_VARS: { token: string; hint: string }[] = [
  { token: '{в районе}', hint: '«в Жуковском» — как в записи района' },
  { token: '{район}', hint: '«Жуковский»' },
  { token: '{км}', hint: 'удалённость от МКАД, «32»' },
  { token: '{направление}', hint: 'название направления, «Спил и уход за деревьями»' },
  { token: '{заголовок}', hint: 'заголовок страницы' },
  { token: '{ориентиры}', hint: 'ориентиры района через запятую' },
]

type Field = { name: string; label: string; value: string; hint?: string }
type Tab = { label: string; description: string; fields: Field[] }

export const TEMPLATE_TABS = [
  {
    label: 'Район',
    description: 'Страница района /raiony/…/ — одна на 30 районов.',
    fields: [
      { name: 'districtTitle', label: 'Заголовок', value: 'Обиход {в районе}' },
      {
        name: 'districtKicker',
        label: 'Строка над заголовком',
        value: '{км} км от МКАД · {район}',
      },
      {
        name: 'districtLead',
        label: 'Подзаголовок',
        value:
          'Деревья, мусор, крыши и снег, демонтаж и благоустройство {в районе} и по всему округу — одна бригада и одна смета. Уборка и вывоз отходов наших работ — в цене.',
      },
      { name: 'districtServicesTitle', label: 'Заголовок услуг', value: 'Что делаем {в районе}' },
      {
        name: 'districtFactsTitle',
        label: 'Заголовок фактов района',
        value: 'Как работаем {в районе}',
      },
      {
        name: 'districtFactsText',
        label: 'Текст фактов района',
        value:
          '{район} — {км} км от МКАД. Смету присылаем по фото до выезда, бригада приезжает в согласованное окно.',
      },
      { name: 'districtFaqTitle', label: 'Заголовок вопросов', value: 'Частые вопросы {в районе}' },
      {
        name: 'districtFormTitle',
        label: 'Заголовок заявки',
        value: 'Оставьте заявку {в районе} — перезвоним за {перезвон}',
      },
      {
        name: 'districtMetaTitle',
        label: 'Title для поисковиков',
        value: 'Обиход {в районе} — деревья, мусор, крыши, демонтаж',
      },
      {
        name: 'districtMetaDescription',
        label: 'Description для поисковиков',
        value:
          'Спил деревьев, вывоз мусора, чистка крыш и снег, демонтаж и благоустройство {в районе}. Смета по фото за {смета по фото}, оплата после приёмки.',
      },
    ],
  },
  {
    label: 'Услуга в районе',
    description:
      'Страницы /направление/район/ и /направление/подуслуга/район/ — собираются из страницы направления или подуслуги и записи «Услуга × район»; {направление} — её название. Свои H1, лид и вопросы записи важнее шаблона.',
    fields: [
      {
        name: 'geoTitle',
        label: 'Заголовок (если в записи нет своего)',
        value: '{направление} {в районе}',
      },
      {
        name: 'geoLeadSuffix',
        label: 'Хвост подзаголовка',
        value: 'Работаем {в районе} и по всему округу.',
      },
      { name: 'geoPricesTitle', label: 'Заголовок цен', value: 'Цены {в районе}' },
      { name: 'geoFactsTitle', label: 'Заголовок фактов района', value: 'Работаем {в районе}' },
      {
        name: 'geoFactsText',
        label: 'Текст фактов района',
        value:
          '{район} — {км} км от МКАД. Бригада приезжает в согласованное окно, смету присылаем по фото до выезда.',
      },
      { name: 'geoFaqTitle', label: 'Заголовок вопросов', value: 'Частые вопросы {в районе}' },
      { name: 'geoOtherTitle', label: 'Заголовок «что ещё»', value: 'Что ещё делаем {в районе}' },
      { name: 'geoOtherLink', label: 'Ссылка на район', value: 'Всё {в районе}' },
      {
        name: 'geoFormTitle',
        label: 'Заголовок заявки',
        value: 'Оставьте заявку {в районе} — перезвоним за {перезвон}',
      },
      {
        name: 'geoFarBadge',
        label: 'Плашка первого экрана за аварийной зоной',
        value: 'Смета по фото — за {смета по фото}',
        hint: 'Вместо обещания аварийного выезда, если район дальше аварийной зоны',
      },
      { name: 'geoMetaTitle', label: 'Title для поисковиков', value: '{заголовок} — Обиход' },
    ],
  },
  {
    label: 'Факты и заявка',
    description: 'Общее для района и «услуги в районе»: условия выезда и подпись над заявкой.',
    fields: [
      { name: 'factsAround', label: 'Округ', value: 'Работаем по всему округу: {ориентиры}' },
      {
        name: 'factsFreeVisit',
        label: 'Оценщик (в зоне бесплатного выезда)',
        value: 'Выезд оценщика бесплатно — сегодня или завтра',
      },
      {
        name: 'factsFreeVisitFar',
        label: 'Оценщик (дальше)',
        value: 'Выезд оценщика — по согласованию',
      },
      {
        name: 'factsEmergency',
        label: 'Авария (в аварийной зоне)',
        value: 'Аварийная бригада — за {аварийный выезд}',
      },
      {
        name: 'factsEmergencyFar',
        label: 'Авария (дальше)',
        value: 'Аварийный выезд — по согласованию, время назовём при звонке',
      },
      {
        name: 'factsWindow',
        label: 'Окно приезда',
        value: 'Окно приезда {окно приезда}, опоздали — скидка {скидка за опоздание}',
      },
      { name: 'formEyebrow', label: 'Подпись над заявкой', value: 'Заявка · ответ за {перезвон}' },
    ],
  },
  {
    label: 'Статьи и кейсы',
    description: 'Статьи блога, кейсы и колонка «Смета по фото» рядом с текстом.',
    fields: [
      { name: 'articleFaqTitle', label: 'Статья: заголовок вопросов', value: 'Вопросы и ответы' },
      {
        name: 'articleFormTitle',
        label: 'Статья: заголовок заявки',
        value: 'Остались вопросы — перезвоним за {перезвон}',
      },
      { name: 'caseBeforeAfterTitle', label: 'Кейс: «до и после»', value: 'Как было и как стало' },
      { name: 'caseAboutTitle', label: 'Кейс: о работе', value: 'Коротко о работе' },
      {
        name: 'caseFormTitle',
        label: 'Кейс: заголовок заявки',
        value: 'Нужно так же — перезвоним за {перезвон}',
      },
      { name: 'sideTitle', label: 'Колонка: заголовок', value: 'Посчитаем вашу задачу' },
      {
        name: 'sideText',
        label: 'Колонка: текст',
        value:
          'Пришлите фото — ответим за {смета по фото}. Оценщик выезжает бесплатно до {бесплатный выезд} от МКАД.',
      },
    ],
  },
  {
    label: 'Авторы',
    description: 'Список авторов /avtory/ и страница автора.',
    fields: [
      { name: 'authorsTitle', label: 'Список: заголовок', value: 'Эксперты Обихода' },
      {
        name: 'authorsLead',
        label: 'Список: подзаголовок',
        value:
          'Бригадиры, эксперты по договорам и арбористы — кто отвечает за качество работ на каждом объекте.',
      },
      {
        name: 'authorsMetaTitle',
        label: 'Список: title',
        value: 'Эксперты Обихода — арбористы, бригадиры, B2B-эксперты',
      },
      {
        name: 'authorsMetaDescription',
        label: 'Список: description',
        value:
          'Кто отвечает за качество работ Обихода: бригадиры, арбористы и эксперты по договорам с УК и ТСЖ. Опыт и темы экспертизы.',
      },
      { name: 'authorAboutTitle', label: 'Автор: о специалисте', value: 'О специалисте' },
      { name: 'authorTopicsTitle', label: 'Автор: темы', value: 'Темы экспертизы' },
      { name: 'authorPostsTitle', label: 'Автор: статьи', value: 'Статьи автора' },
      {
        name: 'authorFormTitle',
        label: 'Заголовок заявки',
        value: 'Задайте вопрос — перезвоним за {перезвон}',
      },
    ],
  },
  {
    label: '404 и контакты',
    description: 'Страница «не найдено» и блок контактов на /kontakty/.',
    fields: [
      { name: 'notFoundEyebrow', label: '404: подпись', value: 'Ошибка 404' },
      { name: 'notFoundTitle', label: '404: заголовок', value: 'Такой страницы нет' },
      {
        name: 'notFoundLead',
        label: '404: текст',
        value:
          'Возможно, адрес изменился или в нём опечатка. Посмотрите наши услуги или оставьте заявку — перезвоним за {перезвон}.',
      },
      { name: 'notFoundTilesTitle', label: '404: заголовок услуг', value: 'Может быть, вы искали' },
      { name: 'contactsTitle', label: 'Контакты: заголовок', value: 'Телефон, почта, адрес' },
      {
        name: 'contactsPhoto',
        label: 'Контакты: про фото',
        value: 'Фото объекта — в форме заявки или на почту',
      },
    ],
  },
] as const satisfies readonly Tab[]

type FieldName = (typeof TEMPLATE_TABS)[number]['fields'][number]['name']
export type PageTemplates = Record<FieldName, string>

export const DEFAULT_TEMPLATES = Object.fromEntries(
  TEMPLATE_TABS.flatMap((t) => t.fields.map((f) => [f.name, f.value])),
) as PageTemplates

/** Подстановки района и страницы: {в районе}, {район}… — то, чего нет в `vars`, остаётся как есть. */
export function fillTemplate(
  text: string,
  vars: Partial<Record<string, string | number | null | undefined>>,
): string {
  return text.replace(/\{([^{}\n]{2,40})\}/g, (m, key: string) => {
    const v = vars[key]
    return v === null || v === undefined ? m : String(v)
  })
}
