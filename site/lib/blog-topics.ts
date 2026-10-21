import type { BlockImage } from '@/components/blocks/v3/types'

/**
 * Тема статьи по адресу — для связанных услуг и картинки по умолчанию, пока в админке не выбрана
 * своя («Обложка» статьи). Порядок важен: первое совпадение.
 */
const TOPICS: { re: RegExp; pillar: string | null; image: string; alt: string }[] = [
  { re: /grush|sliv|obrezk/, pillar: 'arboristika', image: 'spil-sanitar', alt: 'Обрезка веток' },
  { re: /sosn|el[iy]/, pillar: 'arboristika', image: 'spil-el', alt: 'Ель у дома' },
  { re: /berez/, pillar: 'arboristika', image: 'phone-birch', alt: 'Берёза у дома' },
  {
    re: /shtraf|razreshen|mozhno-li-spilit/,
    pillar: 'arboristika',
    image: 'act',
    alt: 'Документы на спил',
  },
  { re: /uhod|arbo/, pillar: 'arboristika', image: 'arbor', alt: 'Арборист в кроне' },
  { re: /spil|derev/, pillar: 'arboristika', image: 'spil-before', alt: 'Дерево перед спилом' },
  { re: /krysh/, pillar: 'chistka-krysh', image: 'zima-naled', alt: 'Наледь на крыше' },
  { re: /snos|demontazh/, pillar: 'demontazh', image: 'demo-dom', alt: 'Снос старого дома' },
  {
    re: /raschistka/,
    pillar: 'uborka-territorii',
    image: 'spil-raschistka-before',
    alt: 'Заросший участок',
  },
  { re: /szhigat/, pillar: 'vyvoz-musora', image: 'leaves', alt: 'Садовый мусор в мешках' },
  { re: /sortirovat/, pillar: 'vyvoz-musora', image: 'skip', alt: 'Контейнер для мусора' },
  { re: /snt|oplata/, pillar: 'vyvoz-musora', image: 'vyvoz-uk', alt: 'Контейнер во дворе' },
  { re: /strojmusor/, pillar: 'vyvoz-musora', image: 'case2-before', alt: 'Строительный мусор' },
  { re: /musor|vyvoz/, pillar: 'vyvoz-musora', image: 'vyvoz-gazel', alt: 'Вывоз мусора Газелью' },
  { re: /kalkulyator|smeta/, pillar: null, image: 'phone-order', alt: 'Фото объекта в телефоне' },
]

const DEFAULT = { pillar: null, image: 'crew', alt: 'Бригада идёт на участок' }

export function blogTopic(slug: string): { pillar: string | null; image: BlockImage } {
  const t = TOPICS.find((x) => x.re.test(slug)) ?? DEFAULT
  return {
    pillar: t.pillar,
    image: { url: `/dev-blocks/${t.image}.webp`, alt: t.alt, focus: null, illustration: true },
  }
}

/** Подпись рубрики: служебное «evergreen» читателю не показываем. */
export const BLOG_CATEGORY: Record<string, string> = {
  arbo: 'Деревья',
  sneg: 'Крыши и снег',
  musor: 'Вывоз мусора',
  demontazh: 'Демонтаж',
  b2b: 'Для УК и ТСЖ',
  regulyatorika: 'Законы и штрафы',
  evergreen: 'Статья',
}
