// Payload-конфиги блоков библиотеки v3 (этап 2 плана 09, эталон — главная C4).
// slug блока = blockType в components/blocks/v3/types.ts; данные в рендер приводит lib/blocks/v3/fromPayload.ts.

import type { Block, Field } from 'payload'

import {
  enabledField,
  iconField,
  imageField,
  linkFields,
  linkGroup,
  sectionFields,
  stringList,
  toneField,
} from './fields'

const cta = (name: string, label: string, required: boolean, withIcon = false): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text', label: 'Текст кнопки', required },
    {
      name: 'href',
      type: 'text',
      label: 'Адрес',
      required,
      admin: { description: '#zayavka — к форме внизу страницы' },
    },
    ...(withIcon ? [{ ...iconField('icon', 'Иконка', 'camera'), required: false } as Field] : []),
  ],
})

export const HeroSliderV3: Block = {
  slug: 'hero-slider',
  labels: { singular: 'Первый экран со слайдами', plural: 'Первые экраны' },
  fields: [
    enabledField,
    { name: 'anchor', type: 'text', label: 'Якорь' },
    {
      name: 'slides',
      type: 'array',
      label: 'Слайды',
      labels: { singular: 'Слайд', plural: 'Слайды' },
      minRows: 1,
      maxRows: 4,
      admin: { description: 'Первый слайд — главный: его видят все. Остальные листаются вручную.' },
      fields: [
        {
          name: 'kicker',
          type: 'text',
          label: 'Строка над заголовком',
          admin: { description: 'Например «Сезон · октябрь · спил до заморозков»' },
        },
        { name: 'title', type: 'text', label: 'Заголовок (H1)', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок' },
        cta('primary', 'Главная кнопка', true, true),
        cta('secondary', 'Вторая кнопка', false),
        imageField('image', 'Фото на фоне'),
      ],
    },
    {
      name: 'badge',
      type: 'group',
      label: 'Плашка справа',
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Крупно',
          admin: { description: 'Например «100%». Пусто — плашки нет.' },
        },
        { name: 'text', type: 'textarea', label: 'Текст' },
        { name: 'note', type: 'text', label: 'Мелкая сноска' },
      ],
    },
    {
      name: 'strip',
      type: 'array',
      label: 'Полоса под первым экраном',
      maxRows: 4,
      labels: { singular: 'Пункт', plural: 'Пункты' },
      fields: [
        iconField(),
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'text', label: 'Подпись' },
      ],
    },
    {
      name: 'autoplaySeconds',
      type: 'number',
      label: 'Автопрокрутка, секунд',
      defaultValue: 0,
      min: 0,
      max: 30,
      admin: { description: '0 — слайды листаются только вручную (рекомендуется).' },
    },
  ],
}

export const ServicesTilesV3: Block = {
  slug: 'services-tiles',
  labels: { singular: 'Услуги плиткой', plural: 'Услуги плиткой' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Плитки',
      labels: { singular: 'Плитка', plural: 'Плитки' },
      maxRows: 12,
      fields: [
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          label: 'Услуга',
          admin: {
            description: 'Название, адрес и фото возьмём из услуги, если поля ниже пустые.',
          },
        },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', label: 'Название', admin: { width: '50%' } },
            {
              name: 'price',
              type: 'text',
              label: 'Цена «от»',
              admin: { width: '50%', description: 'Например «от 4 500 ₽»' },
            },
          ],
        },
        { name: 'text', type: 'text', label: 'Короткое описание' },
        {
          name: 'href',
          type: 'text',
          label: 'Адрес',
          admin: { description: 'Нужен, если услуга не выбрана' },
        },
        imageField('image', 'Фото', false),
      ],
    },
  ],
}

export const AboutStatsV3: Block = {
  slug: 'about-stats',
  labels: { singular: 'О компании и цифры', plural: 'О компании и цифры' },
  fields: [
    ...sectionFields(),
    { name: 'text', type: 'textarea', label: 'Текст о компании', required: true },
    stringList('checklist', 'Пункты с галочкой', { maxRows: 5 }),
    {
      name: 'stats',
      type: 'array',
      label: 'Цифры',
      maxRows: 4,
      labels: { singular: 'Цифра', plural: 'Цифры' },
      admin: { description: 'Только проверяемые цифры.' },
      fields: [
        { name: 'value', type: 'text', label: 'Значение', required: true },
        { name: 'label', type: 'text', label: 'Подпись', required: true },
      ],
    },
    {
      name: 'banner',
      type: 'group',
      label: 'Баннер калькулятора',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст',
          admin: { description: 'Пусто — баннера нет' },
        },
        { name: 'label', type: 'text', label: 'Текст кнопки' },
        { name: 'href', type: 'text', label: 'Адрес', defaultValue: '#calc' },
      ],
    },
  ],
}

export const EquipmentV3: Block = {
  slug: 'equipment',
  labels: { singular: 'Техника', plural: 'Техника' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Техника',
      maxRows: 8,
      labels: { singular: 'Машина', plural: 'Машины' },
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'text', type: 'text', label: 'Для чего' },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'text',
              label: 'Цена',
              admin: { width: '50%', description: 'Например «от 2 500 ₽/ч»' },
            },
            {
              name: 'href',
              type: 'text',
              label: 'Кнопка «Арендовать» ведёт на',
              admin: { width: '50%' },
            },
          ],
        },
        imageField(),
      ],
    },
  ],
}

export const ProjectsV3: Block = {
  slug: 'projects',
  labels: { singular: 'Проекты до/после', plural: 'Проекты до/после' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Проекты',
      maxRows: 6,
      labels: { singular: 'Проект', plural: 'Проекты' },
      admin: { description: 'Суммы — из сметы и подписанного акта.' },
      fields: [
        {
          name: 'case',
          type: 'relationship',
          relationTo: 'cases',
          label: 'Кейс',
          admin: { description: 'Карточка будет ссылкой на страницу кейса' },
        },
        {
          type: 'row',
          fields: [
            { name: 'place', type: 'text', label: 'Где', required: true, admin: { width: '50%' } },
            { name: 'duration', type: 'text', label: 'Срок', admin: { width: '50%' } },
          ],
        },
        { name: 'title', type: 'text', label: 'Что сделали', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'sum',
              type: 'text',
              label: 'Сумма',
              required: true,
              admin: { width: '50%', description: 'Например «64 800 ₽»' },
            },
            {
              name: 'matched',
              type: 'checkbox',
              label: 'Смета = акт',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        imageField('before', 'Фото «до»'),
        imageField('after', 'Фото «после»'),
        {
          name: 'afterLabel',
          type: 'text',
          label: 'Подпись второго фото',
          admin: { description: 'По умолчанию «ПОСЛЕ»' },
        },
      ],
    },
  ],
}

export const VideoGalleryV3: Block = {
  slug: 'video-gallery',
  labels: { singular: 'Видео', plural: 'Видео' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Ролики',
      maxRows: 6,
      labels: { singular: 'Ролик', plural: 'Ролики' },
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'text', type: 'text', label: 'Подпись' },
        {
          name: 'duration',
          type: 'text',
          label: 'Длительность',
          admin: { description: 'Например «4:12»' },
        },
        imageField('poster', 'Обложка'),
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка на ролик',
          admin: {
            description:
              'Embed-ссылка Rutube / VK Видео или файл .mp4. Пусто — обложка без воспроизведения.',
          },
        },
      ],
    },
  ],
}

export const PromotionsV3: Block = {
  slug: 'promotions',
  labels: { singular: 'Акции', plural: 'Акции' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Акции',
      maxRows: 4,
      labels: { singular: 'Акция', plural: 'Акции' },
      admin: { description: 'У каждой акции — ссылка на условия (страница «Гарантии»).' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Крупно',
              required: true,
              admin: { width: '50%', description: '«−10%», «0 ₽»' },
            },
            { name: 'dark', type: 'checkbox', label: 'Тёмная карточка', admin: { width: '50%' } },
          ],
        },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'text', label: 'Пояснение' },
        linkGroup('link', 'Ссылка на условия'),
      ],
    },
  ],
}

export const TeamV3: Block = {
  slug: 'team',
  labels: { singular: 'Сотрудники', plural: 'Сотрудники' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Люди',
      maxRows: 8,
      labels: { singular: 'Сотрудник', plural: 'Сотрудники' },
      fields: [
        { name: 'role', type: 'text', label: 'Роль', required: true },
        { name: 'text', type: 'text', label: 'Чем занимается' },
        {
          name: 'chip',
          type: 'text',
          label: 'Метка',
          admin: { description: 'Например «допуск к высотным работам»' },
        },
        imageField('photo', 'Фото', true),
      ],
    },
  ],
}

export const CalculatorV3: Block = {
  slug: 'calculator-v3',
  labels: { singular: 'Калькулятор', plural: 'Калькуляторы' },
  fields: [
    ...sectionFields(),
    { name: 'lead', type: 'textarea', label: 'Текст слева' },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Текст кнопки',
          defaultValue: 'Зафиксировать цену',
          admin: { width: '50%' },
        },
        { name: 'note', type: 'text', label: 'Сноска под кнопкой', admin: { width: '50%' } },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Вкладки услуг',
      minRows: 1,
      maxRows: 4,
      labels: { singular: 'Услуга', plural: 'Услуги' },
      admin: { description: 'Цена = базовая цена вида работ × множитель объёма × множитель зоны.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'text',
              label: 'Код',
              required: true,
              admin: { width: '33%', description: 'латиницей, например arbor' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Название вкладки',
              required: true,
              admin: { width: '33%' },
            },
            { ...iconField('icon', 'Иконка', 'spil'), admin: { width: '33%' } } as Field,
          ],
        },
        {
          name: 'kindLabel',
          type: 'text',
          label: 'Подпись выбора вида работ',
          defaultValue: 'Способ',
        },
        {
          name: 'kinds',
          type: 'array',
          label: 'Виды работ',
          minRows: 1,
          labels: { singular: 'Вид работ', plural: 'Виды работ' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Название',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'base',
                  type: 'number',
                  label: 'Базовая цена, ₽',
                  required: true,
                  min: 0,
                  admin: { width: '25%' },
                },
                {
                  name: 'unit',
                  type: 'text',
                  label: 'Единица',
                  required: true,
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
        { name: 'volumeLabel', type: 'text', label: 'Подпись ползунка', defaultValue: 'Объём' },
        {
          name: 'volumes',
          type: 'array',
          label: 'Шаги ползунка',
          minRows: 2,
          labels: { singular: 'Шаг', plural: 'Шаги' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Подпись',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'factor',
                  type: 'number',
                  label: 'Множитель',
                  required: true,
                  min: 0,
                  admin: { width: '50%', step: 0.05 },
                },
              ],
            },
          ],
        },
        {
          name: 'zones',
          type: 'array',
          label: 'Зоны выезда',
          minRows: 1,
          maxRows: 3,
          labels: { singular: 'Зона', plural: 'Зоны' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Подпись',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'factor',
                  type: 'number',
                  label: 'Множитель',
                  required: true,
                  min: 0,
                  admin: { width: '50%', step: 0.05 },
                },
              ],
            },
          ],
        },
        stringList('included', 'Строки «включено»', { maxRows: 3 }),
      ],
    },
  ],
}

export const StepsV3: Block = {
  slug: 'steps',
  labels: { singular: 'Шаги работы', plural: 'Шаги работы' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Шаги',
      minRows: 2,
      maxRows: 6,
      labels: { singular: 'Шаг', plural: 'Шаги' },
      fields: [
        {
          name: 'time',
          type: 'text',
          label: 'Срок',
          admin: { description: '«+10 мин», «день работ»' },
        },
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'text', type: 'text', label: 'Пояснение' },
      ],
    },
  ],
}

export const PriceTabsV3: Block = {
  slug: 'price-tabs',
  labels: { singular: 'Прайс по вкладкам', plural: 'Прайсы по вкладкам' },
  fields: [
    ...sectionFields(),
    {
      name: 'tabs',
      type: 'array',
      label: 'Вкладки',
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Вкладка', plural: 'Вкладки' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Название вкладки',
              required: true,
              admin: { width: '33%' },
            },
            { ...iconField('icon', 'Иконка', 'spil'), admin: { width: '33%' } } as Field,
            {
              name: 'unit',
              type: 'text',
              label: 'Единица',
              required: true,
              admin: { width: '33%', description: '«за дерево», «за рейс»' },
            },
          ],
        },
        stringList('columns', 'Колонки цен', { minRows: 1, maxRows: 4 }),
        {
          name: 'rows',
          type: 'array',
          label: 'Строки',
          minRows: 1,
          labels: { singular: 'Строка', plural: 'Строки' },
          admin: { description: 'Цены — числом без «₽» и «от», по одной на колонку.' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Работа',
                  required: true,
                  admin: { width: '50%' },
                },
                { name: 'note', type: 'text', label: 'Пояснение', admin: { width: '50%' } },
              ],
            },
            stringList('values', 'Цены по колонкам', { minRows: 1, maxRows: 4 }),
          ],
        },
        stringList('notes', 'Примечания под таблицей (последнее — янтарное)', { maxRows: 4 }),
      ],
    },
  ],
}

export const PhotoCtaV3: Block = {
  slug: 'photo-cta',
  labels: { singular: 'Баннер с фото', plural: 'Баннеры с фото' },
  fields: [
    enabledField,
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Надзаголовок', admin: { width: '50%' } },
        { name: 'anchor', type: 'text', label: 'Якорь', admin: { width: '50%' } },
      ],
    },
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'text', type: 'textarea', label: 'Текст' },
    imageField('image', 'Фото на фоне'),
    cta('primary', 'Главная кнопка', true, true),
    cta('secondary', 'Вторая кнопка', false, true),
  ],
}

export const ReviewsV3: Block = {
  slug: 'reviews-v3',
  labels: { singular: 'Отзывы', plural: 'Отзывы' },
  fields: [
    ...sectionFields(),
    {
      name: 'limit',
      type: 'number',
      label: 'Сколько отзывов показать',
      defaultValue: 3,
      min: 1,
      max: 6,
      admin: {
        description:
          'Берутся из раздела «Отзывы»: только проверенные и отмеченные «на главную». Нет таких — блок не показывается.',
      },
    },
    {
      name: 'rating',
      type: 'group',
      label: 'Рейтинг на площадке',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Оценка',
              admin: { width: '33%', description: '«4,9». Пусто — без рейтинга' },
            },
            {
              name: 'source',
              type: 'text',
              label: 'Площадка',
              defaultValue: 'Яндекс Карты',
              admin: { width: '33%' },
            },
            { name: 'href', type: 'text', label: 'Ссылка на отзывы', admin: { width: '33%' } },
          ],
        },
      ],
    },
  ],
}

export const DocumentsV3: Block = {
  slug: 'documents',
  labels: { singular: 'Документы', plural: 'Документы' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Документы',
      maxRows: 8,
      labels: { singular: 'Документ', plural: 'Документы' },
      fields: [
        iconField('icon', 'Иконка', 'file'),
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'text', type: 'text', label: 'Пояснение' },
        {
          type: 'row',
          fields: [
            {
              name: 'metaLabel',
              type: 'text',
              label: 'Подпись внизу',
              admin: { width: '50%', description: '«срок»' },
            },
            {
              name: 'metaValue',
              type: 'text',
              label: 'Значение внизу',
              admin: { width: '50%', description: '«от 7 дней»' },
            },
          ],
        },
      ],
    },
  ],
}

export const B2bPlanV3: Block = {
  slug: 'b2b-plan',
  labels: { singular: 'Для УК и организаций', plural: 'Для УК и организаций' },
  fields: [
    ...sectionFields({ tone: false }),
    { ...toneField, defaultValue: 'dark' } as Field,
    { name: 'text', type: 'textarea', label: 'Текст' },
    {
      name: 'kpis',
      type: 'array',
      label: 'Сроки и цифры',
      maxRows: 3,
      labels: { singular: 'Цифра', plural: 'Цифры' },
      fields: [
        { name: 'value', type: 'text', label: 'Значение', required: true },
        { name: 'label', type: 'text', label: 'Подпись', required: true },
      ],
    },
    { name: 'primary', type: 'group', label: 'Главная кнопка', fields: linkFields() },
    {
      name: 'secondary',
      type: 'group',
      label: 'Вторая кнопка',
      fields: [
        { name: 'label', type: 'text', label: 'Текст кнопки' },
        { name: 'href', type: 'text', label: 'Адрес' },
      ],
    },
    {
      name: 'audiences',
      type: 'array',
      label: 'Для кого',
      maxRows: 4,
      labels: { singular: 'Тип клиента', plural: 'Типы клиентов' },
      fields: [
        iconField('icon', 'Иконка', 'building'),
        { name: 'title', type: 'text', label: 'Кто', required: true },
        { name: 'text', type: 'text', label: 'Что делаем' },
      ],
    },
    {
      name: 'note',
      type: 'group',
      label: 'Плашка внизу',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          admin: { description: 'Пусто — плашки нет' },
        },
        { name: 'text', type: 'text', label: 'Текст' },
      ],
    },
  ],
}

export const TreeCheckV3: Block = {
  slug: 'tree-check',
  labels: { singular: 'Нужно ли убирать дерево', plural: 'Чек-листы с консультацией' },
  fields: [
    ...sectionFields(),
    {
      name: 'checklistTitle',
      type: 'text',
      label: 'Заголовок чек-листа',
      required: true,
      defaultValue: 'Дерево пора убирать, если:',
    },
    stringList('checklist', 'Признаки', { minRows: 1, maxRows: 8 }),
    {
      name: 'consult',
      type: 'group',
      label: 'Консультация',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Надзаголовок' },
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Текст' },
        stringList('points', 'Пункты', { maxRows: 5 }),
        {
          type: 'row',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              label: 'Текст кнопки',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'ctaHref',
              type: 'text',
              label: 'Адрес кнопки',
              required: true,
              admin: { width: '50%', description: 'Мессенджер или #zayavka' },
            },
          ],
        },
      ],
    },
  ],
}

export const ArticlesV3: Block = {
  slug: 'articles',
  labels: { singular: 'Статьи', plural: 'Статьи' },
  fields: [
    ...sectionFields(),
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'blog',
      hasMany: true,
      maxRows: 3,
      label: 'Статьи',
      admin: { description: 'Пусто — покажем три последние опубликованные.' },
    },
  ],
}

export const ObjectsMapV3: Block = {
  slug: 'objects-map',
  labels: { singular: 'Карта объектов', plural: 'Карты объектов' },
  fields: [
    ...sectionFields(),
    {
      name: 'legend',
      type: 'array',
      label: 'Легенда',
      maxRows: 5,
      labels: { singular: 'Строка', plural: 'Строки' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Вид работ',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'count',
              type: 'number',
              label: 'Объектов',
              required: true,
              min: 0,
              admin: { width: '25%' },
            },
            {
              name: 'color',
              type: 'select',
              label: 'Цвет',
              defaultValue: 'primary',
              admin: { width: '25%' },
              options: [
                { label: 'Зелёный', value: 'primary' },
                { label: 'Светло-зелёный', value: 'success' },
                { label: 'Серый', value: 'muted' },
                { label: 'Янтарный', value: 'accent' },
              ],
            },
          ],
        },
      ],
    },
    stringList('districts', 'Районы', { maxRows: 24 }),
    {
      name: 'zones',
      type: 'array',
      label: 'Зоны выезда',
      maxRows: 3,
      labels: { singular: 'Зона', plural: 'Зоны' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Расстояние',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Что входит',
              required: true,
              admin: { width: '67%' },
            },
          ],
        },
      ],
    },
    {
      name: 'points',
      type: 'json',
      label: 'Точки объектов',
      admin: {
        description:
          'Список [{ "angle": градусы от севера, "km": расстояние от МКАД }]. Заполняется из кейсов, руками править не нужно.',
      },
    },
    {
      name: 'base',
      type: 'group',
      label: 'База',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Город', admin: { width: '50%' } },
            { name: 'angle', type: 'number', label: 'Направление, °', admin: { width: '25%' } },
            { name: 'km', type: 'number', label: 'Км от МКАД', admin: { width: '25%' } },
          ],
        },
      ],
    },
  ],
}

export const GuaranteesV3: Block = {
  slug: 'guarantees',
  labels: { singular: 'Гарантии с условиями', plural: 'Гарантии с условиями' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Гарантии',
      maxRows: 4,
      labels: { singular: 'Гарантия', plural: 'Гарантии' },
      admin: { description: 'Условие обязательно — так требует закон о рекламе.' },
      fields: [
        iconField('icon', 'Иконка', 'file'),
        { name: 'title', type: 'text', label: 'Гарантия', required: true },
        { name: 'text', type: 'text', label: 'Пояснение', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'conditionLabel',
              type: 'text',
              label: 'Условие — начало',
              required: true,
              admin: { width: '40%', description: '«Опоздали»' },
            },
            {
              name: 'conditionValue',
              type: 'text',
              label: 'Условие — суть',
              required: true,
              admin: { width: '60%', description: '«скидка 10% с работ»' },
            },
          ],
        },
      ],
    },
  ],
}

export const FaqV3Block: Block = {
  slug: 'faq-v3',
  labels: { singular: 'Вопросы и ответы', plural: 'Вопросы и ответы' },
  fields: [
    ...sectionFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы',
      minRows: 1,
      maxRows: 12,
      labels: { singular: 'Вопрос', plural: 'Вопросы' },
      fields: [
        { name: 'question', type: 'text', label: 'Вопрос', required: true },
        { name: 'answer', type: 'textarea', label: 'Ответ', required: true },
      ],
    },
  ],
}

export const FinalFormV3: Block = {
  slug: 'final-form',
  labels: { singular: 'Финальная форма', plural: 'Финальные формы' },
  fields: [
    enabledField,
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Надзаголовок', admin: { width: '50%' } },
        {
          name: 'anchor',
          type: 'text',
          label: 'Якорь',
          defaultValue: 'zayavka',
          admin: { width: '50%', description: 'Кнопки «#zayavka» ведут сюда' },
        },
      ],
    },
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'lead', type: 'textarea', label: 'Текст' },
    imageField('background', 'Фото на фоне', false),
    {
      name: 'channels',
      type: 'array',
      label: 'Каналы связи',
      maxRows: 3,
      labels: { singular: 'Канал', plural: 'Каналы' },
      fields: [
        iconField('icon', 'Иконка', 'phone'),
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'text', label: 'Подпись', required: true },
        {
          name: 'href',
          type: 'text',
          label: 'Адрес',
          required: true,
          admin: { description: 'tel:+7…, ссылка на MAX или Telegram' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'formTitle',
          type: 'text',
          label: 'Заголовок формы',
          required: true,
          defaultValue: 'Заявка на смету',
          admin: { width: '50%' },
        },
        {
          name: 'source',
          type: 'text',
          label: 'Метка заявки',
          required: true,
          defaultValue: 'home-final',
          admin: { width: '50%', description: 'Видна в заявке в админке' },
        },
      ],
    },
  ],
}

export const v3Blocks: Block[] = [
  HeroSliderV3,
  ServicesTilesV3,
  AboutStatsV3,
  EquipmentV3,
  ProjectsV3,
  VideoGalleryV3,
  PromotionsV3,
  TeamV3,
  CalculatorV3,
  StepsV3,
  PriceTabsV3,
  PhotoCtaV3,
  ReviewsV3,
  DocumentsV3,
  B2bPlanV3,
  TreeCheckV3,
  ArticlesV3,
  ObjectsMapV3,
  GuaranteesV3,
  FaqV3Block,
  FinalFormV3,
]
