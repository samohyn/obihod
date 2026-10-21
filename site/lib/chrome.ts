import { cache } from 'react'

import { payloadClient } from './payload'
import { DEFAULT_COMPANY, clock, getCompany, hoursLine, type Company } from './company'
import type { IconName } from '@/components/blocks/v3/shared'

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

export interface NavLink {
  label: string
  href: string
}

export interface NavChild extends NavLink {
  text?: string | null
  icon?: IconName | null
}

export interface NavItem extends NavLink {
  children?: NavChild[] | null
}

export interface UtilityItem {
  icon: string
  text: string
}

export interface FooterNavColumn {
  title: string
  items?: NavLink[] | null
}

export interface SiteChrome {
  header?: {
    menu?: MenuItem[] | null
    cta?: HeaderCta | null
    nav?: NavItem[] | null
    mobileExtra?: NavLink[] | null
    utility?: UtilityItem[] | null
  } | null
  footer?: {
    slogan?: string | null
    nav?: FooterNavColumn[] | null
    columns?: FooterColumn[] | null
    privacyUrl?: string | null
    ofertaUrl?: string | null
    copyrightPrefix?: string | null
  } | null
  contacts?: {
    phoneDisplay?: string | null
    phoneE164?: string | null
    hours?: string | null
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
    email: 'partner@obikhod.ru',
  },
  requisites: {
    taxId: '1111111111',
    kpp: '111111111',
    ogrn: '1111111111111',
    addressRegion: 'Московская область',
    addressLocality: 'Жуковский',
    streetAddress: 'ул. Амет-хан Султана, 15, к1',
    postalCode: '140185',
  },
  social: [],
}

/**
 * Шапка и подвал C4 (план 09, этап 2), пока в админке пусто: меню — по карте 08
 * (contex/08_site_map_target.html), тексты — по офферу (contex/10_offer.md, раздел 3).
 */
export const DEFAULT_CHROME_VIEW = {
  nav: [
    {
      label: 'Услуги',
      href: '/uslugi/',
      children: [
        {
          label: 'Вывоз мусора',
          href: '/vyvoz-musora/',
          text: 'Контейнер, Газель, КГМ — с погрузкой',
        },
        {
          label: 'Спил и уход за деревьями',
          href: '/arboristika/',
          text: 'Спил, обрезка, пни, работа альпинистов',
        },
        {
          label: 'Чистка крыш и снег',
          href: '/chistka-krysh/',
          text: 'Снег, наледь, сосульки — дома и МКД',
        },
        {
          label: 'Уборка территории',
          href: '/uborka-territorii/',
          text: 'Расчистка, покос, вывоз остатков',
        },
        {
          label: 'Демонтаж и снос',
          href: '/demontazh/',
          text: 'Дачи, бани, сараи, заборы — с вывозом',
        },
        {
          label: 'Дизайн ландшафта',
          href: '/dizain-landshafta/',
          text: 'Проект, посадки, газон, дорожки',
        },
        {
          label: 'Аренда техники',
          href: '/arenda-tehniki/',
          text: 'Автовышка, измельчитель, самосвал',
        },
        {
          label: 'Промышленный альпинизм',
          href: '/promyshlennyj-alpinizm/',
          text: 'Фасады, кровли, работы на высоте',
        },
        {
          label: 'Порубочный билет',
          href: '/porubochnyj-bilet/',
          text: 'Разрешение на вырубку под ключ',
        },
      ],
    },
    {
      label: 'Для УК и ТСЖ',
      href: '/b2b/',
      children: [
        { label: 'УК и ТСЖ', href: '/b2b/uk-tszh/', text: 'Кровли, дворы, деревья по графику' },
        {
          label: 'Застройщикам',
          href: '/b2b/zastrojschikam/',
          text: 'Расчистка, снос, вывоз со стройки',
        },
        { label: 'FM-операторам', href: '/b2b/fm-operatoram/', text: 'Подрядчик на весь объект' },
        { label: 'Госзаказ', href: '/b2b/goszakaz/', text: 'Работа с бюджетными организациями' },
        {
          label: 'Договор на сезон',
          href: '/b2b/dogovor-na-sezon/',
          text: 'Зима и лето, сроки в договоре',
        },
      ],
    },
    { label: 'Цены', href: '/uslugi/tseny/' },
    { label: 'Кейсы', href: '/kejsy/' },
    { label: 'Контакты', href: '/kontakty/' },
  ] as NavItem[],
  mobileExtra: [
    { label: 'Районы', href: '/raiony/' },
    { label: 'О компании', href: '/o-kompanii/' },
    { label: 'Гарантии', href: '/garantii/' },
    { label: 'Как мы работаем', href: '/kak-my-rabotaem/' },
    { label: 'Отзывы', href: '/otzyvy/' },
    { label: 'Блог', href: '/blog/' },
  ] as NavLink[],
  utility: [
    {
      icon: 'pin',
      text: `Москва и область · выезд до ${DEFAULT_COMPANY.freeVisitRadiusKm} км от МКАД`,
    },
    {
      icon: 'clock',
      text: `Заявки 24/7 · менеджер ${clock(DEFAULT_COMPANY.opens)}–${clock(DEFAULT_COMPANY.closes)}`,
    },
    { icon: 'shield', text: 'Работаем по договору · физлица и юрлица' },
  ] as UtilityItem[],
  cta: { label: 'Смета по фото', href: '/foto-smeta/' } as NavLink,
  hours: hoursLine(DEFAULT_COMPANY),
  footerAbout:
    'Порядок под ключ на участке и территории. Москва и область, частные дома и организации.',
  footerNav: [
    {
      title: 'Услуги',
      items: [
        { label: 'Арбористика', href: '/arboristika/' },
        { label: 'Вывоз мусора', href: '/vyvoz-musora/' },
        { label: 'Чистка крыш и снег', href: '/chistka-krysh/' },
        { label: 'Уборка территории', href: '/uborka-territorii/' },
        { label: 'Демонтаж и снос', href: '/demontazh/' },
        { label: 'Дизайн ландшафта', href: '/dizain-landshafta/' },
      ],
    },
    {
      title: 'Клиентам',
      items: [
        { label: 'Цены', href: '/uslugi/tseny/' },
        { label: 'Гарантии', href: '/garantii/' },
        { label: 'Как мы работаем', href: '/kak-my-rabotaem/' },
        { label: 'Кейсы', href: '/kejsy/' },
        { label: 'Районы', href: '/raiony/' },
      ],
    },
    {
      title: 'Компания',
      items: [
        { label: 'О компании', href: '/o-kompanii/' },
        { label: 'Для УК и ТСЖ', href: '/b2b/' },
        { label: 'Блог', href: '/blog/' },
        { label: 'Контакты', href: '/kontakty/' },
      ],
    },
  ] as FooterNavColumn[],
}

export interface ChromeView {
  nav: NavItem[]
  mobileExtra: NavLink[]
  utility: UtilityItem[]
  cta: NavLink
  hours: string
  footerAbout: string
  footerNav: FooterNavColumn[]
  /** Мессенджеры с заполненной ссылкой (Telegram, MAX, WhatsApp). */
  messengers: { label: string; href: string }[]
}

const MESSENGERS: SocialType[] = ['max', 'telegram', 'whatsapp']

/** Иконка пункта выпадающего списка, если в админке не выбрана: по разделу (brand-guide, «Иконография»). */
const NAV_ICONS: Record<string, IconName> = {
  '/vyvoz-musora/': 'dumpster',
  '/arboristika/': 'spil',
  '/chistka-krysh/': 'roof-snow',
  '/uborka-territorii/': 'lawn-mower',
  '/demontazh/': 'demolition',
  '/dizain-landshafta/': 'plan',
  '/arenda-tehniki/': 'boomlift',
  '/promyshlennyj-alpinizm/': 'climber',
  '/porubochnyj-bilet/': 'legal-shield',
  '/b2b/uk-tszh/': 'building',
  '/b2b/zastrojschikam/': 'excavator',
  '/b2b/fm-operatoram/': 'facade-clean',
  '/b2b/goszakaz/': 'stamp',
  '/b2b/dogovor-na-sezon/': 'file',
}

const withIcons = (nav: NavItem[]): NavItem[] =>
  nav.map((item) =>
    item.children?.length
      ? {
          ...item,
          children: item.children.map((c) => ({
            ...c,
            icon: c.icon || NAV_ICONS[c.href] || null,
          })),
        }
      : item,
  )

/** Шапка и подвал: из админки, пустые поля — по умолчанию (DEFAULT_CHROME_VIEW). */
export const getChromeView = cache(async (): Promise<ChromeView> => {
  const [chrome, company] = await Promise.all([getSiteChrome(), getCompany()])
  const d = DEFAULT_CHROME_VIEW
  const h = chrome?.header
  // Старая кнопка вела на якорь калькулятора старой главной — на других страницах его нет.
  const cta = h?.cta?.label && h.cta.kind && h.cta.kind !== 'anchor' ? h.cta : null
  return {
    nav: withIcons(h?.nav?.length ? h.nav : d.nav),
    mobileExtra: h?.mobileExtra?.length ? h.mobileExtra : d.mobileExtra,
    utility: h?.utility?.length ? h.utility : d.utility,
    cta: cta ? { label: cta.label as string, href: menuHref(cta) } : d.cta,
    hours: hoursLine(company),
    footerAbout: chrome?.footer?.slogan?.trim() || d.footerAbout,
    footerNav: chrome?.footer?.nav?.length ? chrome.footer.nav : d.footerNav,
    messengers: (chrome?.social ?? [])
      .filter((link) => MESSENGERS.includes(link.type) && link.url)
      .map((link) => ({ label: socialLabel(link.type), href: socialHref(link) })),
  }
})

export interface Contacts {
  phoneDisplay: string
  phoneE164: string
  email: string
  legalName: string
  /** ИНН / ОГРН / КПП — null, пока в админке стоит заглушка из единиц. */
  taxId: string | null
  ogrn: string | null
  kpp: string | null
  addressRegion: string
  addressLocality: string
  streetAddress: string
  postalCode: string
  /** «ул. …, Жуковский, Московская область, 140185» */
  addressLine: string
}

function filledRequisite(v: string | null | undefined): string | null {
  const s = v?.trim()
  return s && !/^1+$/.test(s) ? s : null
}

/**
 * Контакты и реквизиты для всех страниц, JSON-LD и llms.txt — из «Компания и контакты»
 * (lib/company.ts); заглушки ИНН/КПП/ОГРН из единиц на сайт не выводятся.
 */
export const getContacts = cache(async (): Promise<Contacts> => {
  const c = await getCompany()
  return {
    phoneDisplay: c.phoneDisplay,
    phoneE164: c.phoneE164,
    email: c.email,
    legalName: c.legalName || 'Обиход',
    taxId: filledRequisite(c.taxId),
    ogrn: filledRequisite(c.ogrn),
    kpp: filledRequisite(c.kpp),
    addressRegion: c.addressRegion,
    addressLocality: c.addressLocality,
    streetAddress: c.streetAddress,
    postalCode: c.postalCode,
    addressLine: [c.streetAddress, c.addressLocality, c.addressRegion, c.postalCode]
      .filter(Boolean)
      .join(', '),
  }
})

/**
 * Server-component fetcher. Читает global `site-chrome` из Payload.
 *
 * Стратегия (после OBI-16):
 *  - `react.cache` для per-request memoization — Header + Footer вызывают
 *    эту функцию из одного RSC-рендера, должна быть один SQL-запрос.
 *  - Cross-request кеш и ISR — через `export const revalidate` на роутах
 *    (layout.tsx обычно `revalidate = 3600`), плюс `revalidatePath('/', 'layout')`
 *    в `globals/SiteChrome.ts` afterChange.
 *  - Раньше использовался `unstable_cache(..., { tags: ['site-chrome'] })`,
 *    но в Next 16 он deprecated и в build-time возвращал null/[] для
 *    пирамидальных вызовов payloadClient → ломал pillar-страницы (OBI-16).
 *
 * Контракт: sa.md §AC-15.1 — 1 запрос в БД на цикл рендера несмотря
 * на два независимых вызова из Header + Footer. `react.cache` это
 * гарантирует.
 */
export const getSiteChrome = cache(async (): Promise<SiteChrome | null> => {
  try {
    const payload = await payloadClient()
    const [chrome, company] = await Promise.all([
      payload.findGlobal({ slug: 'site-chrome' }) as unknown as Promise<SiteChrome | null>,
      getCompany(),
    ])
    return chrome ? withCompany(chrome, company) : null
  } catch {
    // Мягкая деградация: не роняем страницу, возвращаем null — рендерер
    // подставит DEFAULT_SITE_CHROME.
    return null
  }
})

/**
 * Контакты и реквизиты «Шапки» перенесены в «Компания и контакты» (план 09, этап 4.3): подставляем
 * их оттуда, чтобы всё, что читает `chrome.contacts` / `chrome.requisites` (JSON-LD, старые страницы),
 * брало один источник. Убрать вместе со старыми полями «Шапки» (4.4).
 */
function withCompany(chrome: SiteChrome, c: Company): SiteChrome {
  return {
    ...chrome,
    contacts: {
      phoneDisplay: c.phoneDisplay,
      phoneE164: c.phoneE164,
      email: c.email,
      hours: hoursLine(c),
    },
    requisites: {
      legalName: c.legalName,
      taxId: c.taxId,
      kpp: c.kpp,
      ogrn: c.ogrn,
      addressRegion: c.addressRegion,
      addressLocality: c.addressLocality,
      streetAddress: c.streetAddress,
      postalCode: c.postalCode,
    },
  }
}

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
