import type { ArrayField, Field, GlobalConfig, Validate } from 'payload'

import { ICON_NAMES } from '@/components/blocks/v3/iconNames'
import { isAdmin } from '@/lib/auth/access'
import { validateE164, validateInn } from './Company'
import { revalidateGlobalAfterChange } from '@/lib/admin/revalidateSite'

/**
 * SiteChrome — единый global для "рамки сайта": Header, Footer, контакты,
 * реквизиты, соцсети. Источник правды для полей, которые одновременно
 * отображаются в UI (Header/Footer) и попадают в JSON-LD (Organization,
 * LocalBusiness).
 *
 * Контракт: US-2-cms-header-footer-globals (sa.md §5), ADR-0002.
 *
 * Поля `organization.telephone`, `sameAs`, `organization.taxId` и др.
 * удалены из SeoSettings — всё живёт тут.
 */

// ---------- shared validators ----------
const HTTP_RE = /^https?:\/\//i
const ROUTE_RE = /^\/[^\s]*$/
const ANCHOR_RE = /^[a-z0-9-]+$/

type MenuItemShape = {
  kind?: 'anchor' | 'route' | 'external'
  anchor?: string
  route?: string
  url?: string
}

const validateMenuItem: Validate = (_value, { siblingData }) => {
  const item = siblingData as MenuItemShape
  if (!item?.kind) return 'kind обязателен'
  if (item.kind === 'anchor') {
    if (!item.anchor) return 'Для kind=anchor заполните поле anchor (без #)'
    if (!ANCHOR_RE.test(item.anchor)) return 'anchor должен быть kebab-case без #'
  }
  if (item.kind === 'route') {
    if (!item.route) return 'Для kind=route заполните путь'
    if (!ROUTE_RE.test(item.route)) return 'route должен начинаться с /'
  }
  if (item.kind === 'external') {
    if (!item.url) return 'Для kind=external заполните url'
    if (!HTTP_RE.test(item.url)) return 'Допустимы только http(s):// URL'
  }
  return true
}

const validateSocialUrl: Validate = (value, { siblingData }) => {
  const { type } = (siblingData ?? {}) as { type?: string }
  if (typeof value !== 'string' || !value) return 'URL обязателен'
  if (type === 'telegram' && /^(tg:\/\/|https:\/\/t\.me\/)/i.test(value)) return true
  if (!HTTP_RE.test(value)) return 'Допустимы только http(s):// URL'
  return true
}

const validateHref: Validate = (v) =>
  typeof v === 'string' && /^(\/[^\s]*|https?:\/\/\S+|tel:\+?\d+|mailto:\S+)$/.test(v)
    ? true
    : 'Адрес на сайте (/uslugi/), https://…, tel: или mailto:'

// Ссылка меню/подвала C4 (этап 2 плана 09): название + адрес в одной строке.
const navLinkRow: Field = {
  type: 'row',
  fields: [
    { name: 'label', type: 'text', label: 'Название', required: true, admin: { width: '50%' } },
    {
      name: 'href',
      type: 'text',
      label: 'Адрес',
      required: true,
      validate: validateHref,
      admin: { width: '50%', description: 'Например /uslugi/' },
    },
  ],
}

// ---------- reusable menu item field factory ----------
// NOTE: возвращаемый объект скопирован в нескольких местах (header.menu,
// footer.columns[].items), поэтому используется factory, а не shared constant.
const menuItemArrayField = (name: string): ArrayField => ({
  name,
  type: 'array',
  labels: { singular: 'Пункт', plural: 'Пункты' },
  admin: {
    description: 'anchor → #..., route → <Link>, external → новая вкладка',
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'anchor',
      options: [
        { label: 'Якорь на этой странице (#)', value: 'anchor' },
        { label: 'Внутренний путь (/)', value: 'route' },
        { label: 'Внешняя ссылка (https://)', value: 'external' },
      ],
    },
    { name: 'label', type: 'text', required: true, maxLength: 20 },
    {
      name: 'anchor',
      type: 'text',
      maxLength: 40,
      admin: {
        description: 'Без символа #. Только lowercase, цифры, дефис.',
        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'anchor',
      },
      validate: validateMenuItem,
    },
    {
      name: 'route',
      type: 'text',
      maxLength: 120,
      admin: {
        description: 'Начинается с /. Пример: /uslugi/',
        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'route',
      },
      validate: validateMenuItem,
    },
    {
      name: 'url',
      type: 'text',
      maxLength: 500,
      admin: {
        description: 'Полный URL со схемой https://',
        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'external',
      },
      validate: validateMenuItem,
    },
  ],
})

// ---------- GLOBAL ----------
export const SiteChrome: GlobalConfig = {
  slug: 'site-chrome',
  label: 'Шапка и подвал',
  admin: {
    description: 'Шапка, подвал и соцсети. Контакты, реквизиты и часы — в «Компания и контакты».',
    group: '05 · Рамка сайта',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // -------- HEADER --------
        {
          label: 'Шапка и меню',
          fields: [
            {
              name: 'header',
              type: 'group',
              fields: [
                // Старое меню-якоря главной (не выводится с этапа 2) — удалить вместе с колонками.
                { ...menuItemArrayField('menu'), admin: { hidden: true } },
                {
                  name: 'cta',
                  type: 'group',
                  label: 'Главная кнопка в шапке',
                  admin: {
                    description:
                      'Справа от телефона и в нижней панели на телефоне. Например «Смета по фото» → /foto-smeta/',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      maxLength: 24,
                      defaultValue: 'Замер бесплатно',
                    },
                    {
                      name: 'kind',
                      type: 'select',
                      defaultValue: 'anchor',
                      options: [
                        { label: 'Якорь (#)', value: 'anchor' },
                        { label: 'Путь (/)', value: 'route' },
                        { label: 'URL', value: 'external' },
                      ],
                    },
                    {
                      name: 'anchor',
                      type: 'text',
                      maxLength: 40,
                      defaultValue: 'calc',
                      admin: {
                        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'anchor',
                      },
                      validate: validateMenuItem,
                    },
                    {
                      name: 'route',
                      type: 'text',
                      maxLength: 120,
                      admin: {
                        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'route',
                      },
                      validate: validateMenuItem,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      maxLength: 500,
                      admin: {
                        condition: (_d, s) => (s as MenuItemShape | undefined)?.kind === 'external',
                      },
                      validate: validateMenuItem,
                    },
                  ],
                },
                {
                  name: 'nav',
                  type: 'array',
                  label: 'Меню',
                  labels: { singular: 'Пункт меню', plural: 'Пункты меню' },
                  maxRows: 6,
                  admin: {
                    description:
                      'Верхнее меню слева направо, лучше 5 пунктов. Пусто — сайт показывает меню по карте сайта.',
                  },
                  fields: [
                    navLinkRow,
                    {
                      name: 'children',
                      type: 'array',
                      label: 'Выпадающий список',
                      labels: { singular: 'Пункт', plural: 'Пункты' },
                      admin: {
                        description: 'Заполните — у пункта появится стрелка и список.',
                        initCollapsed: true,
                      },
                      fields: [
                        navLinkRow,
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'text',
                              type: 'text',
                              label: 'Пояснение',
                              maxLength: 60,
                              admin: {
                                description: 'Короткая подпись под названием',
                                width: '70%',
                              },
                            },
                            {
                              name: 'icon',
                              type: 'select',
                              label: 'Иконка',
                              options: ICON_NAMES.map((n) => ({ label: n, value: n })),
                              admin: {
                                description:
                                  'Пусто — по разделу (вывоз мусора — контейнер и т. д.)',
                                width: '30%',
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'mobileExtra',
                  type: 'array',
                  label: 'Ещё в мобильном меню',
                  labels: { singular: 'Ссылка', plural: 'Ссылки' },
                  admin: {
                    description:
                      'Разделы, которых нет в верхнем меню: на телефоне — под основными пунктами.',
                  },
                  fields: [navLinkRow],
                },
                {
                  name: 'utility',
                  type: 'array',
                  label: 'Полоса над шапкой',
                  labels: { singular: 'Факт', plural: 'Факты' },
                  maxRows: 3,
                  admin: {
                    description:
                      'Короткие факты в тёмной полосе. На телефоне — только первый. Справа — мессенджеры и почта.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'icon',
                          type: 'select',
                          label: 'Иконка',
                          required: true,
                          defaultValue: 'pin',
                          options: ICON_NAMES.map((n) => ({ label: n, value: n })),
                          admin: { width: '30%' },
                        },
                        {
                          name: 'text',
                          type: 'text',
                          label: 'Текст',
                          required: true,
                          maxLength: 60,
                          admin: { width: '70%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // -------- FOOTER --------
        // PANEL-SITECHROME-RESTRUCTURE 2026-05-01: вложенные unnamed tabs
        // «Контент» / «Юридические ссылки» внутри group `footer`. Schema
        // не меняется (Payload tabs UI-only при unnamed) — все колонки
        // остаются flat `footer_*`, см. migration 20260424_133242.
        {
          label: 'Подвал',
          fields: [
            {
              name: 'footer',
              type: 'group',
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: 'Контент',
                      fields: [
                        {
                          name: 'slogan',
                          type: 'textarea',
                          label: 'Текст под логотипом',
                          maxLength: 200,
                        },
                        {
                          name: 'nav',
                          type: 'array',
                          label: 'Колонки ссылок',
                          labels: { singular: 'Колонка', plural: 'Колонки' },
                          maxRows: 3,
                          admin: {
                            description:
                              'До трёх колонок. Колонка «Контакты» добавляется сама. Пусто — колонки по карте сайта.',
                          },
                          fields: [
                            {
                              name: 'title',
                              type: 'text',
                              label: 'Заголовок',
                              required: true,
                              maxLength: 24,
                            },
                            {
                              name: 'items',
                              type: 'array',
                              label: 'Ссылки',
                              labels: { singular: 'Ссылка', plural: 'Ссылки' },
                              fields: [navLinkRow],
                            },
                          ],
                        },
                        {
                          // Старые колонки-якоря (не выводятся с этапа 2) — удалить вместе с таблицами.
                          admin: { hidden: true },
                          name: 'columns',
                          type: 'array',
                          labels: { singular: 'Колонка', plural: 'Колонки' },
                          maxRows: 4,
                          fields: [
                            { name: 'title', type: 'text', required: true, maxLength: 24 },
                            menuItemArrayField('items'),
                          ],
                        },
                      ],
                    },
                    {
                      label: 'Юридические ссылки',
                      fields: [
                        {
                          name: 'privacyUrl',
                          type: 'text',
                          defaultValue: '/politika-konfidentsialnosti/',
                          maxLength: 200,
                        },
                        {
                          name: 'ofertaUrl',
                          type: 'text',
                          defaultValue: '/oferta/',
                          maxLength: 200,
                        },
                        {
                          name: 'copyrightPrefix',
                          type: 'text',
                          defaultValue: '© Обиход,',
                          maxLength: 60,
                          admin: {
                            description:
                              'Префикс копирайтной строки. Год добавляется автоматически.',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // -------- CONTACTS --------
        {
          label: 'Контакты',
          description:
            'Телефон, почта, адрес, реквизиты и часы перенесены в «Компания и контакты» (план 09, этап 4.3). Здесь поля скрыты и будут удалены.',
          fields: [
            {
              name: 'contacts',
              type: 'group',
              admin: { hidden: true },
              fields: [
                {
                  name: 'phoneDisplay',
                  type: 'text',
                  required: true,
                  maxLength: 20,
                  defaultValue: '+7 (985) 170-51-11',
                  admin: {
                    description: 'Как видит человек, например +7 (985) 170-51-11',
                  },
                },
                {
                  name: 'phoneE164',
                  type: 'text',
                  required: true,
                  maxLength: 16,
                  defaultValue: '+79851705111',
                  admin: {
                    description: 'Для tel: и JSON-LD. Формат E.164: +7XXXXXXXXXX',
                  },
                  validate: validateE164,
                },
                {
                  name: 'hours',
                  type: 'text',
                  label: 'Режим работы',
                  maxLength: 60,
                  defaultValue: 'Ежедневно 8:00–22:00 · заявки 24/7',
                  admin: { description: 'Под телефоном в шапке и в подвале' },
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'partner@obikhod.ru',
                  admin: {
                    description: 'Опционально. Если заполнен — рендерится в футере',
                  },
                },
              ],
            },
            {
              name: 'requisites',
              type: 'group',
              admin: { hidden: true },
              fields: [
                {
                  type: 'collapsible',
                  label: 'Юридическое лицо',
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      name: 'legalName',
                      type: 'text',
                      maxLength: 120,
                      admin: {
                        description: 'Например «ООО «Обиход-МО»» — заполнить после регистрации',
                      },
                    },
                    {
                      name: 'taxId',
                      type: 'text',
                      required: true,
                      maxLength: 12,
                      defaultValue: '1111111111',
                      admin: {
                        description: 'Placeholder ИНН — оператор заменит при регистрации юрлица',
                      },
                      validate: validateInn,
                    },
                    {
                      name: 'kpp',
                      type: 'text',
                      maxLength: 9,
                      defaultValue: '111111111',
                      admin: { description: 'Placeholder КПП — оператор заменит при регистрации' },
                    },
                    {
                      name: 'ogrn',
                      type: 'text',
                      maxLength: 15,
                      defaultValue: '1111111111111',
                      admin: { description: 'Placeholder ОГРН — оператор заменит при регистрации' },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Адрес',
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      name: 'addressRegion',
                      type: 'text',
                      maxLength: 80,
                      defaultValue: 'Московская область',
                      admin: { description: 'Напр. «Московская область»' },
                    },
                    {
                      name: 'addressLocality',
                      type: 'text',
                      maxLength: 80,
                      defaultValue: 'Жуковский',
                      admin: { description: 'Напр. «Одинцово»' },
                    },
                    {
                      name: 'streetAddress',
                      type: 'text',
                      maxLength: 200,
                      defaultValue: 'ул. Амет-хан Султана, 15, к1',
                      admin: { description: 'Улица, дом, корпус' },
                    },
                    {
                      name: 'postalCode',
                      type: 'text',
                      maxLength: 10,
                      defaultValue: '140185',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // -------- SOCIAL --------
        {
          label: 'Соцсети и мессенджеры',
          description:
            'Порядок управляется drag-and-drop. Инвариант: Telegram + MAX + WhatsApp обязательны.',
          fields: [
            {
              name: 'social',
              type: 'array',
              labels: { singular: 'Канал', plural: 'Каналы' },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Telegram', value: 'telegram' },
                    { label: 'MAX (VK)', value: 'max' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'ВКонтакте', value: 'vk' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Яндекс.Дзен', value: 'yandex-zen' },
                    { label: 'Другое', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  maxLength: 500,
                  validate: validateSocialUrl,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
