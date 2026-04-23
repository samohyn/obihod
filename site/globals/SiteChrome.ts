import type { ArrayField, GlobalConfig, Validate } from 'payload'

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
const E164_RE = /^\+7\d{10}$/
const HTTP_RE = /^https?:\/\//i
const ROUTE_RE = /^\/[^\s]*$/
const ANCHOR_RE = /^[a-z0-9-]+$/
const INN_RE = /^\d{10,12}$/

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

const validateE164: Validate = (v) =>
  typeof v === 'string' && E164_RE.test(v)
    ? true
    : 'Формат E.164: +7XXXXXXXXXX (11 цифр)'

const validateInn: Validate = (v) =>
  typeof v === 'string' && INN_RE.test(v) ? true : 'ИНН — 10 или 12 цифр'

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
  label: 'Site Chrome (Header / Footer)',
  admin: {
    description:
      'Всё, что про «рамку сайта»: шапка, футер, контакты, реквизиты, соцсети.',
    group: 'Контент',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        // Инвалидируем RSC-кеш по тегу + path-layout для надёжности на первом
        // запуске. Паттерн параллельный с /api/revalidate?tag=site-chrome,
        // но работает в том же процессе (PM2 / next dev) — экономит HTTP-hop.
        try {
          const { revalidateTag, revalidatePath } = await import('next/cache')
          revalidateTag('site-chrome', 'max')
          revalidatePath('/', 'layout')
          req.payload.logger.info(
            `[site-chrome] revalidated at ${new Date().toISOString()}`,
          )
        } catch (e) {
          req.payload.logger.error(
            `[site-chrome] revalidate failed: ${(e as Error).message}`,
          )
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // -------- HEADER --------
        {
          label: 'Header',
          fields: [
            {
              name: 'header',
              type: 'group',
              fields: [
                menuItemArrayField('menu'),
                {
                  name: 'cta',
                  type: 'group',
                  label: 'CTA-кнопка в шапке',
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
                        condition: (_d, s) =>
                          (s as MenuItemShape | undefined)?.kind === 'anchor',
                      },
                      validate: validateMenuItem,
                    },
                    {
                      name: 'route',
                      type: 'text',
                      maxLength: 120,
                      admin: {
                        condition: (_d, s) =>
                          (s as MenuItemShape | undefined)?.kind === 'route',
                      },
                      validate: validateMenuItem,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      maxLength: 500,
                      admin: {
                        condition: (_d, s) =>
                          (s as MenuItemShape | undefined)?.kind === 'external',
                      },
                      validate: validateMenuItem,
                    },
                  ],
                },
              ],
            },
          ],
        },
        // -------- FOOTER --------
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              fields: [
                { name: 'slogan', type: 'textarea', maxLength: 200 },
                {
                  name: 'columns',
                  type: 'array',
                  labels: { singular: 'Колонка', plural: 'Колонки' },
                  maxRows: 4,
                  fields: [
                    { name: 'title', type: 'text', required: true, maxLength: 24 },
                    menuItemArrayField('items'),
                  ],
                },
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
        // -------- CONTACTS --------
        {
          label: 'Контакты',
          description: 'Телефон и e-mail. Инвариант: телефон обязателен.',
          fields: [
            {
              name: 'contacts',
              type: 'group',
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
                  name: 'email',
                  type: 'email',
                  admin: {
                    description:
                      'Опционально. Если заполнен — рендерится в футере',
                  },
                },
              ],
            },
          ],
        },
        // -------- REQUISITES --------
        {
          label: 'Реквизиты',
          description: 'Для B2B и JSON-LD. Заполнить после регистрации юрлица.',
          fields: [
            {
              name: 'requisites',
              type: 'group',
              fields: [
                {
                  name: 'legalName',
                  type: 'text',
                  maxLength: 120,
                  admin: {
                    description:
                      'Например «ООО «Обиход-МО»» — заполнить после регистрации',
                  },
                },
                {
                  name: 'taxId',
                  type: 'text',
                  required: true,
                  maxLength: 12,
                  defaultValue: '7847729123',
                  admin: {
                    description:
                      'временный ИНН, подлежит замене при регистрации юрлица Обиход',
                  },
                  validate: validateInn,
                },
                {
                  name: 'kpp',
                  type: 'text',
                  maxLength: 9,
                  admin: { description: 'Заполнить после регистрации юрлица' },
                },
                {
                  name: 'ogrn',
                  type: 'text',
                  maxLength: 15,
                  admin: { description: 'Заполнить после регистрации юрлица' },
                },
                {
                  name: 'addressRegion',
                  type: 'text',
                  maxLength: 80,
                  admin: { description: 'Напр. «Московская область»' },
                },
                {
                  name: 'addressLocality',
                  type: 'text',
                  maxLength: 80,
                  admin: { description: 'Напр. «Одинцово»' },
                },
                {
                  name: 'streetAddress',
                  type: 'text',
                  maxLength: 200,
                  admin: { description: 'Улица, дом, корпус' },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  maxLength: 10,
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
