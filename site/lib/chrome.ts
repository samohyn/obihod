import { unstable_cache } from 'next/cache'

import { payloadClient } from './payload'

/**
 * Типы SiteChrome.
 *
 * TODO(be3/be4): после того как `pnpm generate:types` начнёт успешно
 * генерировать `site/payload-types.ts` (сейчас падает на отсутствии
 * `collections/Users.ts`), заменить эти локальные типы на импорт из
 * `@/payload-types` и удалить этот блок. Сейчас форма совпадает со
 * схемой из `site/globals/SiteChrome.ts` — источник правды be4.
 */

export type MenuItemKind = 'anchor' | 'route' | 'external'

export interface MenuItem {
  kind: MenuItemKind
  label: string
  anchor?: string | null
  route?: string | null
  url?: string | null
}

export interface HeaderCta {
  label?: string | null
  kind?: MenuItemKind | null
  anchor?: string | null
  route?: string | null
  url?: string | null
}

export interface FooterColumn {
  title: string
  items?: MenuItem[] | null
}

export type SocialType = 'telegram' | 'max' | 'whatsapp' | 'vk' | 'youtube' | 'yandex-zen' | 'other'

export interface SocialLink {
  type: SocialType
  url: string
}

export interface SiteChrome {
  header?: {
    menu?: MenuItem[] | null
    cta?: HeaderCta | null
  } | null
  footer?: {
    slogan?: string | null
    columns?: FooterColumn[] | null
    privacyUrl?: string | null
    ofertaUrl?: string | null
    copyrightPrefix?: string | null
  } | null
  contacts?: {
    phoneDisplay?: string | null
    phoneE164?: string | null
    email?: string | null
  } | null
  requisites?: {
    legalName?: string | null
    taxId?: string | null
    kpp?: string | null
    ogrn?: string | null
    addressRegion?: string | null
    addressLocality?: string | null
    streetAddress?: string | null
    postalCode?: string | null
  } | null
  social?: SocialLink[] | null
}

/**
 * Fallback на случай пустого global / ошибки чтения Payload.
 * Набор — тот же, что был до рефакторинга в Header.tsx / Footer.tsx,
 * чтобы первый запуск prod без seed не ломал UI (REQ-2.2, AC-4.1/4.2).
 */
export const DEFAULT_SITE_CHROME: SiteChrome = {
  header: {
    menu: [
      { kind: 'anchor', anchor: 'services', label: 'Услуги' },
      { kind: 'anchor', anchor: 'calc', label: 'Калькулятор' },
      { kind: 'anchor', anchor: 'how', label: 'Как это работает' },
      { kind: 'anchor', anchor: 'cases', label: 'Кейсы' },
      { kind: 'anchor', anchor: 'subscription', label: 'Абонемент' },
      { kind: 'anchor', anchor: 'faq', label: 'FAQ' },
    ],
    cta: { kind: 'anchor', anchor: 'calc', label: 'Замер бесплатно' },
  },
  footer: {
    slogan:
      'Один подрядчик на весь год: спил, снег, демонтаж, вывоз. Работаем в Московской области, радиус 120 км от МКАД.',
    columns: [
      {
        title: 'Услуги',
        items: [
          { kind: 'anchor', anchor: 'services', label: 'Спил деревьев' },
          { kind: 'anchor', anchor: 'services', label: 'Уборка снега' },
          { kind: 'anchor', anchor: 'services', label: 'Демонтаж и снос' },
          { kind: 'anchor', anchor: 'services', label: 'Вывоз мусора' },
          { kind: 'anchor', anchor: 'subscription', label: 'Абонементы' },
        ],
      },
      {
        title: 'Компания',
        items: [
          { kind: 'anchor', anchor: 'cases', label: 'Кейсы' },
          { kind: 'anchor', anchor: 'faq', label: 'FAQ' },
        ],
      },
    ],
    privacyUrl: '/politika-konfidentsialnosti/',
    ofertaUrl: '/oferta/',
    copyrightPrefix: '© Обиход,',
  },
  contacts: {
    phoneDisplay: '+7 (985) 170-51-11',
    phoneE164: '+79851705111',
  },
  requisites: {
    taxId: '7847729123',
  },
  social: [],
}

/**
 * Server-component fetcher. Читает global `site-chrome` из Payload,
 * кеширует в Next RSC cache по тегу `site-chrome` — `afterChange` hook
 * в `SiteChrome.ts` делает `revalidateTag('site-chrome', 'max')`,
 * что возвращает этой функции cache miss при следующем RSC-рендере.
 *
 * Контракт: sa.md §AC-15.1 — 1 запрос в БД на цикл рендера несмотря
 * на два независимых вызова из Header + Footer.
 */
export const getSiteChrome = unstable_cache(
  async (): Promise<SiteChrome | null> => {
    try {
      const payload = await payloadClient()
      const chrome = (await payload.findGlobal({
        slug: 'site-chrome',
      })) as unknown as SiteChrome | null
      return chrome
    } catch {
      // Мягкая деградация: не роняем страницу, возвращаем null — рендерер
      // подставит DEFAULT_SITE_CHROME.
      return null
    }
  },
  ['site-chrome'],
  { tags: ['site-chrome'], revalidate: 3600 },
)

// ---------- URL helpers ----------

/**
 * По `SocialType` + raw url возвращает готовый href.
 * Решение (см. sa.md, intake): оператор заполняет полный URL в админке
 * (валидируется в Payload `validateSocialUrl`), поэтому в обычном пути
 * мы просто возвращаем `url` как есть. Префиксы по типу — страховка
 * на случай, если валидация пропустит короткую запись (`@obihod`).
 */
export function socialHref(link: SocialLink): string {
  const url = (link.url ?? '').trim()
  if (!url) return '#'
  if (/^https?:\/\//i.test(url)) return url
  if (link.type === 'telegram' && url.startsWith('tg://')) return url
  // Страховочные префиксы — если url не полный URL.
  const clean = url.replace(/^@/, '')
  switch (link.type) {
    case 'telegram':
      return `https://t.me/${clean}`
    case 'max':
      return `https://max.ru/${clean}`
    case 'whatsapp':
      return `https://wa.me/${clean.replace(/\D/g, '')}`
    case 'vk':
      return `https://vk.com/${clean}`
    case 'youtube':
      return `https://youtube.com/${clean}`
    case 'yandex-zen':
      return `https://dzen.ru/${clean}`
    default:
      return url
  }
}

export function socialLabel(type: SocialType): string {
  switch (type) {
    case 'telegram':
      return 'Telegram'
    case 'max':
      return 'MAX'
    case 'whatsapp':
      return 'WhatsApp'
    case 'vk':
      return 'ВКонтакте'
    case 'youtube':
      return 'YouTube'
    case 'yandex-zen':
      return 'Яндекс.Дзен'
    default:
      return 'Ссылка'
  }
}

export function menuHref(item: MenuItem | HeaderCta): string {
  if (item.kind === 'anchor') return `#${item.anchor ?? ''}`
  if (item.kind === 'route') return item.route ?? '/'
  if (item.kind === 'external') return item.url ?? '#'
  return '#'
}
