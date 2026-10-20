// Данные блоков v3 из Payload (коллекция «Страницы») → пропсы рендера components/blocks/v3.
// Картинки — развёрнутые документы media (depth ≥ 2), связи — документы услуг, кейсов, статей.
// Отзывы и статьи по умолчанию подтягиваются запросом: только опубликованное и проверенное.

import type { Payload } from 'payload'

import type {
  BlockImage,
  BlockLink,
  CalcService,
  SectionTone,
  V3BlockWithTone,
} from '@/components/blocks/v3/types'

type Doc = Record<string, unknown>
const isDoc = (v: unknown): v is Doc => typeof v === 'object' && v !== null && !Array.isArray(v)
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const arr = (v: unknown): Doc[] => (Array.isArray(v) ? v.filter(isDoc) : [])
const strList = (v: unknown): string[] =>
  arr(v)
    .map((r) => str(r.value))
    .filter((s): s is string => s !== null)

/**
 * Payload отдаёт абсолютный URL с хвостовым слешем (https://obikhod.ru/api/media/file/x.jpg/).
 * Для next/image берём путь: файл читается тем же сервером напрямую — без похода через nginx
 * (на staging там пароль → 401) и без запрета Next 16 на запросы к localhost.
 */
export function mediaPath(url: string): string {
  const m = url.match(/^https?:\/\/[^/]+(\/api\/media\/.+)$/)
  return (m ? m[1] : url).replace(/\/+$/, '')
}

export function toImage(media: unknown): BlockImage | null {
  if (!isDoc(media)) return null
  const raw = str(media.url)
  if (!raw) return null
  const url = mediaPath(raw)
  const fx = num(media.focalX)
  const fy = num(media.focalY)
  return {
    url,
    alt: str(media.alt) ?? '',
    focus: fx !== null && fy !== null ? `${fx}% ${fy}%` : null,
    illustration: media.illustration === true,
  }
}

const EMPTY_IMAGE: BlockImage = { url: '', alt: '' }
const img = (media: unknown): BlockImage => toImage(media) ?? EMPTY_IMAGE

function link(v: unknown): BlockLink | null {
  if (!isDoc(v)) return null
  const label = str(v.label)
  const href = str(v.href)
  return label && href ? { label, href } : null
}

const rub = (n: number) => `${n}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const PRICE_UNIT: Record<string, string> = {
  object: '',
  tree: '/дерево',
  m3: '/м³',
  shift: '/смена',
  m2: '/м²',
}

function servicePrice(service: Doc): string | null {
  const from = num(service.priceFrom)
  if (from === null || from <= 0) return null
  return `от ${rub(from)} ₽${PRICE_UNIT[String(service.priceUnit)] ?? ''}`
}

const BLOG_CATEGORY: Record<string, string> = {
  arbo: 'Деревья',
  sneg: 'Снег и крыши',
  musor: 'Вывоз',
  demontazh: 'Демонтаж',
  b2b: 'Для УК',
  regulyatorika: 'Документы',
  evergreen: 'Полезное',
}

function articleItem(post: Doc) {
  const slug = str(post.slug)
  const title = str(post.title)
  if (!slug || !title) return null
  const intro = str(post.intro)
  return {
    kicker: BLOG_CATEGORY[String(post.category)] ?? null,
    title,
    text: intro && intro.length > 120 ? `${intro.slice(0, 117).trimEnd()}…` : intro,
    href: `/blog/${slug}/`,
    image: img(post.heroImage),
  }
}

const base = (b: Doc) => ({
  id: str(b.id),
  enabled: b.enabled !== false,
  anchor: str(b.anchor),
  eyebrow: str(b.eyebrow),
  title: str(b.title),
  link: link(b.link),
  tone: (str(b.tone) as SectionTone | null) ?? null,
})

/** Блоки, которым нужны запросы к другим коллекциям (отзывы, статьи по умолчанию). */
async function fetchReviews(payload: Payload, limit: number) {
  const res = await payload.find({
    collection: 'reviews',
    where: {
      and: [
        { verified: { equals: true } },
        { pinnedToHomepage: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    sort: '-priority',
    limit,
    depth: 1,
  })
  return (res.docs as unknown as Doc[]).map((r) => ({
    author: str(r.authorName) ?? 'Клиент',
    place: isDoc(r.district) ? str(r.district.nameNominative) : null,
    text: str(r.text) ?? '',
    service: isDoc(r.service) ? str(r.service.title) : null,
    rating: num(r.rating),
  }))
}

async function fetchLatestPosts(payload: Payload, limit: number) {
  const res = await payload.find({
    collection: 'blog',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return res.docs as unknown as Doc[]
}

export async function fromPayloadBlocks(
  layout: unknown,
  payload: Payload,
): Promise<V3BlockWithTone[]> {
  const out: V3BlockWithTone[] = []
  for (const b of arr(layout)) {
    const common = base(b)
    switch (b.blockType) {
      case 'hero-slider': {
        const slides = arr(b.slides)
          .map((s) => {
            const primary = link(s.primary)
            const title = str(s.title)
            if (!title || !primary) return null
            return {
              kicker: str(s.kicker),
              title,
              lead: str(s.lead),
              primary: {
                ...primary,
                icon: (str(isDoc(s.primary) ? s.primary.icon : null) as never) ?? null,
              },
              secondary: link(s.secondary),
              image: img(s.image),
            }
          })
          .filter((s) => s !== null)
        const badge = isDoc(b.badge) && str(b.badge.value) ? b.badge : null
        out.push({
          ...common,
          blockType: 'hero-slider',
          slides,
          badge: badge
            ? { value: str(badge.value)!, text: str(badge.text) ?? '', note: str(badge.note) }
            : null,
          strip: arr(b.strip).map((it) => ({
            icon: it.icon as never,
            title: str(it.title) ?? '',
            text: str(it.text),
          })),
          autoplaySeconds: num(b.autoplaySeconds),
        })
        break
      }
      case 'services-tiles': {
        const items = arr(b.items)
          .map((it) => {
            const service = isDoc(it.service) ? it.service : null
            const title = str(it.title) ?? (service ? str(service.title) : null)
            const href = str(it.href) ?? (service && str(service.slug) ? `/${service.slug}/` : null)
            if (!title || !href) return null
            return {
              title,
              text: str(it.text),
              price: str(it.price) ?? (service ? servicePrice(service) : null),
              href,
              image: toImage(it.image) ?? (service ? img(service.heroImage) : EMPTY_IMAGE),
            }
          })
          .filter((x) => x !== null)
        out.push({ ...common, blockType: 'services-tiles', items })
        break
      }
      case 'about-stats': {
        const banner =
          isDoc(b.banner) && str(b.banner.text) && str(b.banner.label) ? b.banner : null
        out.push({
          ...common,
          blockType: 'about-stats',
          text: str(b.text) ?? '',
          checklist: strList(b.checklist),
          stats: arr(b.stats).map((s) => ({
            value: str(s.value) ?? '',
            label: str(s.label) ?? '',
          })),
          banner: banner
            ? {
                text: str(banner.text)!,
                label: str(banner.label)!,
                href: str(banner.href) ?? '#calc',
              }
            : null,
        })
        break
      }
      case 'equipment':
        out.push({
          ...common,
          blockType: 'equipment',
          items: arr(b.items).map((it) => ({
            title: str(it.title) ?? '',
            text: str(it.text),
            price: str(it.price),
            href: str(it.href),
            image: img(it.image),
          })),
        })
        break
      case 'projects':
        out.push({
          ...common,
          blockType: 'projects',
          items: arr(b.items).map((it) => {
            const c = isDoc(it.case) ? it.case : null
            return {
              place: str(it.place) ?? '',
              duration: str(it.duration),
              title: str(it.title) ?? '',
              sum: str(it.sum) ?? '',
              matched: it.matched !== false,
              before: img(it.before),
              after: img(it.after),
              afterLabel: str(it.afterLabel),
              href: c && str(c.slug) ? `/kejsy/${c.slug}/` : null,
            }
          }),
        })
        break
      case 'video-gallery':
        out.push({
          ...common,
          blockType: 'video-gallery',
          items: arr(b.items).map((it) => ({
            title: str(it.title) ?? '',
            text: str(it.text),
            duration: str(it.duration),
            poster: img(it.poster),
            url: str(it.url),
          })),
        })
        break
      case 'promotions':
        out.push({
          ...common,
          blockType: 'promotions',
          items: arr(b.items).map((it) => ({
            value: str(it.value) ?? '',
            title: str(it.title) ?? '',
            text: str(it.text),
            link: link(it.link),
            dark: it.dark === true,
          })),
        })
        break
      case 'team':
        out.push({
          ...common,
          blockType: 'team',
          items: arr(b.items).map((it) => ({
            role: str(it.role) ?? '',
            text: str(it.text),
            chip: str(it.chip),
            photo: img(it.photo),
          })),
        })
        break
      case 'calculator-v3': {
        const services: CalcService[] = arr(b.services)
          .map((sv) => ({
            key: str(sv.key) ?? 'svc',
            label: str(sv.label) ?? '',
            icon: sv.icon as never,
            kindLabel: str(sv.kindLabel) ?? 'Способ',
            kinds: arr(sv.kinds).map((k) => ({
              label: str(k.label) ?? '',
              base: num(k.base) ?? 0,
              unit: str(k.unit) ?? '',
            })),
            volumeLabel: str(sv.volumeLabel) ?? 'Объём',
            volumes: arr(sv.volumes).map((v) => ({
              label: str(v.label) ?? '',
              factor: num(v.factor) ?? 1,
            })),
            zones: arr(sv.zones).map((z) => ({
              label: str(z.label) ?? '',
              factor: num(z.factor) ?? 1,
            })),
            included: strList(sv.included),
          }))
          .filter((sv) => sv.kinds.length > 0 && sv.volumes.length > 0 && sv.zones.length > 0)
        out.push({
          ...common,
          blockType: 'calculator-v3',
          lead: str(b.lead),
          ctaLabel: str(b.ctaLabel),
          note: str(b.note),
          services,
        })
        break
      }
      case 'steps':
        out.push({
          ...common,
          blockType: 'steps',
          items: arr(b.items).map((it) => ({
            time: str(it.time),
            title: str(it.title) ?? '',
            text: str(it.text),
          })),
        })
        break
      case 'price-tabs':
        out.push({
          ...common,
          blockType: 'price-tabs',
          tabs: arr(b.tabs).map((t) => ({
            label: str(t.label) ?? '',
            icon: t.icon as never,
            unit: str(t.unit) ?? '',
            columns: strList(t.columns),
            rows: arr(t.rows).map((r) => ({
              name: str(r.name) ?? '',
              note: str(r.note),
              values: strList(r.values),
            })),
            notes: strList(t.notes),
          })),
        })
        break
      case 'photo-cta': {
        const primary = link(b.primary)
        if (!primary) break
        const secondary = link(b.secondary)
        out.push({
          ...common,
          blockType: 'photo-cta',
          text: str(b.text),
          image: img(b.image),
          primary: {
            ...primary,
            icon: (isDoc(b.primary) ? (str(b.primary.icon) as never) : null) ?? null,
          },
          secondary: secondary
            ? {
                ...secondary,
                icon: (isDoc(b.secondary) ? (str(b.secondary.icon) as never) : null) ?? null,
              }
            : null,
        })
        break
      }
      case 'reviews-v3': {
        const items = await fetchReviews(payload, num(b.limit) ?? 3)
        const rating = isDoc(b.rating) && str(b.rating.value) ? b.rating : null
        out.push({
          ...common,
          blockType: 'reviews-v3',
          rating: rating
            ? {
                value: str(rating.value)!,
                source: str(rating.source) ?? 'Яндекс Карты',
                href: str(rating.href),
              }
            : null,
          items,
        })
        break
      }
      case 'documents':
        out.push({
          ...common,
          blockType: 'documents',
          items: arr(b.items).map((it) => ({
            icon: it.icon as never,
            title: str(it.title) ?? '',
            text: str(it.text),
            metaLabel: str(it.metaLabel),
            metaValue: str(it.metaValue),
          })),
        })
        break
      case 'b2b-plan': {
        const primary = link(b.primary)
        if (!primary) break
        const note = isDoc(b.note) && str(b.note.title) ? b.note : null
        out.push({
          ...common,
          blockType: 'b2b-plan',
          text: str(b.text),
          kpis: arr(b.kpis).map((k) => ({ value: str(k.value) ?? '', label: str(k.label) ?? '' })),
          primary,
          secondary: link(b.secondary),
          audiences: arr(b.audiences).map((a) => ({
            icon: a.icon as never,
            title: str(a.title) ?? '',
            text: str(a.text),
          })),
          note: note ? { title: str(note.title)!, text: str(note.text) ?? '' } : null,
        })
        break
      }
      case 'tree-check': {
        const c = isDoc(b.consult) ? b.consult : {}
        out.push({
          ...common,
          blockType: 'tree-check',
          checklistTitle: str(b.checklistTitle) ?? '',
          checklist: strList(b.checklist),
          consult: {
            eyebrow: str(c.eyebrow),
            title: str(c.title) ?? '',
            text: str(c.text),
            points: strList(c.points),
            cta: { label: str(c.ctaLabel) ?? 'Отправить фото', href: str(c.ctaHref) ?? '#zayavka' },
          },
        })
        break
      }
      case 'articles': {
        const chosen = arr(b.posts)
        const posts = chosen.length > 0 ? chosen : await fetchLatestPosts(payload, 3)
        out.push({
          ...common,
          blockType: 'articles',
          items: posts.map(articleItem).filter((x) => x !== null),
        })
        break
      }
      case 'objects-map': {
        const rawPoints = Array.isArray(b.points) ? b.points : []
        const points = rawPoints
          .filter(isDoc)
          .map((p) => ({ angle: num(p.angle) ?? 0, km: num(p.km) ?? 0 }))
        const baseDoc = isDoc(b.base) && str(b.base.label) ? b.base : null
        out.push({
          ...common,
          blockType: 'objects-map',
          legend: arr(b.legend).map((l) => ({
            label: str(l.label) ?? '',
            count: num(l.count) ?? 0,
            color: (str(l.color) as 'primary' | 'success' | 'muted' | 'accent' | null) ?? 'primary',
          })),
          districts: strList(b.districts),
          zones: arr(b.zones).map((z) => ({
            value: str(z.value) ?? '',
            label: str(z.label) ?? '',
          })),
          points,
          base: baseDoc
            ? {
                label: str(baseDoc.label)!,
                angle: num(baseDoc.angle) ?? 0,
                km: num(baseDoc.km) ?? 0,
              }
            : null,
        })
        break
      }
      case 'guarantees':
        out.push({
          ...common,
          blockType: 'guarantees',
          items: arr(b.items).map((it) => ({
            icon: it.icon as never,
            title: str(it.title) ?? '',
            text: str(it.text) ?? '',
            conditionLabel: str(it.conditionLabel) ?? '',
            conditionValue: str(it.conditionValue) ?? '',
          })),
        })
        break
      case 'faq-v3':
        out.push({
          ...common,
          blockType: 'faq-v3',
          items: arr(b.items).map((q) => ({
            question: str(q.question) ?? '',
            answer: str(q.answer) ?? '',
          })),
        })
        break
      case 'final-form':
        out.push({
          ...common,
          anchor: common.anchor ?? 'zayavka',
          blockType: 'final-form',
          lead: str(b.lead),
          background: toImage(b.background),
          channels: arr(b.channels).map((c) => ({
            icon: c.icon as never,
            title: str(c.title) ?? '',
            text: str(c.text) ?? '',
            href: str(c.href) ?? '#',
          })),
          formTitle: str(b.formTitle) ?? 'Заявка на смету',
          source: str(b.source) ?? 'home-final',
        })
        break
      default:
        break
    }
  }
  return out
}
