import { CONSENT_URL, PRIVACY_URL } from './legal'

/**
 * Хлебные крошки по карте сайта 08 (contex/08_site_map_target.html), а не по адресу:
 * «Команда» живёт на /komanda/, но в карте она внутри «О компании» — так и в крошках.
 * Одна иерархия для видимых крошек и разметки BreadcrumbList (план 09, этап 2).
 */

export type Crumb = { name: string; href: string }

export type SectionKey =
  | 'uslugi'
  | 'tseny'
  | 'raiony'
  | 'kejsy'
  | 'b2b'
  | 'oKompanii'
  | 'komanda'
  | 'sroLicenzii'
  | 'parkTehniki'
  | 'garantii'
  | 'kakMyRabotaem'
  | 'otzyvy'
  | 'avtory'
  | 'blog'
  | 'kontakty'
  | 'fotoSmeta'
  | 'politika'
  | 'soglasie'
  | 'kartaSajta'

type Section = Crumb & { parent?: SectionKey }

const HOME: Crumb = { name: 'Главная', href: '/' }

const SECTIONS: Record<SectionKey, Section> = {
  uslugi: { name: 'Услуги', href: '/uslugi/' },
  tseny: { name: 'Цены', href: '/uslugi/tseny/' },
  raiony: { name: 'Районы', href: '/raiony/' },
  kejsy: { name: 'Кейсы', href: '/kejsy/' },
  b2b: { name: 'Для бизнеса', href: '/b2b/' },
  oKompanii: { name: 'О компании', href: '/o-kompanii/' },
  komanda: { name: 'Команда', href: '/komanda/', parent: 'oKompanii' },
  sroLicenzii: { name: 'СРО и лицензии', href: '/sro-licenzii/', parent: 'oKompanii' },
  parkTehniki: { name: 'Парк техники', href: '/park-tehniki/', parent: 'oKompanii' },
  garantii: { name: 'Гарантии', href: '/garantii/', parent: 'oKompanii' },
  kakMyRabotaem: { name: 'Как мы работаем', href: '/kak-my-rabotaem/', parent: 'oKompanii' },
  otzyvy: { name: 'Отзывы', href: '/otzyvy/', parent: 'oKompanii' },
  avtory: { name: 'Авторы', href: '/avtory/', parent: 'oKompanii' },
  blog: { name: 'Блог', href: '/blog/' },
  kontakty: { name: 'Контакты', href: '/kontakty/' },
  fotoSmeta: { name: 'Смета по фото', href: '/kalkulyator/foto-smeta/' },
  politika: { name: 'Политика конфиденциальности', href: PRIVACY_URL },
  soglasie: { name: 'Согласие на обработку данных', href: CONSENT_URL },
  kartaSajta: { name: 'Карта сайта', href: '/karta-sajta/' },
}

/** Калькуляторы и лендинги смет — в карте 08 группа без своей страницы: крошки сразу от главной. */
export const CALCULATOR_SLUGS = ['foto-smeta', 'raschet-stoimosti']

/**
 * Цепочка «Главная › раздел(ы) › страница». Раздел с родителем в карте (Команда → О компании)
 * разворачивается сам; `section = null` — страница прямо под главной.
 */
export function trail(section: SectionKey | null, ...leaf: Crumb[]): Crumb[] {
  const chain: Crumb[] = []
  let key: SectionKey | undefined = section ?? undefined
  while (key) {
    const s: Section = SECTIONS[key]
    chain.unshift({ name: s.name, href: s.href })
    key = s.parent
  }
  return [HOME, ...chain, ...leaf]
}

/**
 * Короткая подпись из SEO-заголовка: «Кронирование деревьев — 3 800 ₽ за дерево…» →
 * «Кронирование деревьев». Режем по первому « — » или «: », если до него осталась внятная фраза.
 */
export function shortTitle(title: string): string {
  const t = title.trim()
  const cut = [' — ', ' – ', ': ']
    .map((sep) => t.indexOf(sep))
    .filter((i) => i >= 8)
    .sort((a, b) => a - b)[0]
  return cut === undefined ? t : t.slice(0, cut).trim()
}

/** Для JSON-LD: абсолютные адреса. */
export function crumbsToSchema(crumbs: Crumb[], siteUrl: string): { name: string; url: string }[] {
  return crumbs.map((c) => ({ name: c.name, url: `${siteUrl}${c.href}` }))
}
