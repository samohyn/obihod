/**
 * Общее для скриптов наполнения страниц из блоков v3 (главная, подуслуги): данные блоков в формате
 * рендера (как витрина /dev/blocks) → поля Payload; фото из public/ → «Медиа» с флагом «Иллюстрация».
 */
import path from 'node:path'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import type { BlockImage, V3BlockWithTone } from '../components/blocks/v3/types'

export const PHOTO_HREF = 'mailto:partner@obikhod.ru?subject=Фото%20участка'
export const PHONE_HREF = 'tel:+79851705111'
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

const list = (values: string[] | null | undefined) => (values ?? []).map((value) => ({ value }))

async function mediaId(
  payload: Payload,
  image: BlockImage | null | undefined,
  cache: Map<string, number | string>,
) {
  if (!image?.url) return null
  const filename = path.basename(image.url)
  const cached = cache.get(filename)
  if (cached) return cached
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  let id = found.docs[0]?.id
  if (!id) {
    const created = await payload.create({
      collection: 'media',
      data: { alt: image.alt || 'Иллюстрация', illustration: true } as never,
      filePath: path.join(PUBLIC_DIR, image.url),
    })
    id = created.id
    console.log(`[seed] медиа ${filename} → ${id}`)
  }
  cache.set(filename, id)
  return id
}

async function serviceIds(payload: Payload) {
  const res = await payload.find({ collection: 'services', limit: 100, depth: 0 })
  return new Map(res.docs.map((d) => [String((d as { slug?: string }).slug), d.id]))
}

// Ссылки витрины на мессенджеры → почта, пока в настройках сайта нет MAX/Telegram.
const realHref = (href: string) => (href.startsWith('https://max.ru') ? PHOTO_HREF : href)

// И тексты витрины, которые обещают мессенджеры.
const MESSENGER_TEXT: [string, string][] = [
  ['фото в MAX или Telegram', 'фото на почту'],
  ['Предварительная — в мессенджер', 'Предварительная — по телефону или почтой'],
  ['ответит в мессенджере', 'перезвонит или ответит на почту'],
  ['фото в мессенджер или через форму', 'фото на почту или через форму'],
]
const realText = (text: string | null | undefined) =>
  MESSENGER_TEXT.reduce((t, [from, to]) => t.replace(from, to), text ?? '')

export type LayoutOptions = {
  /** Куда вести плитку, если её адрес не совпал ни с одной услугой (главная — «/uslugi/»). */
  unknownTileHref?: string
}

export async function toLayout(
  payload: Payload,
  blocks: V3BlockWithTone[],
  opts: LayoutOptions = {},
) {
  const cache = new Map<string, number | string>()
  const m = (img: BlockImage | null | undefined) => mediaId(payload, img, cache)
  const services = await serviceIds(payload)
  const layout: Record<string, unknown>[] = []

  for (const b of blocks) {
    const head = {
      blockType: b.blockType,
      // Подпись блока в списке админки (вместо «Без названия»).
      blockName: b.title ?? (b.blockType === 'hero-slider' ? 'Первый экран' : undefined),
      enabled: true,
      anchor: b.anchor ?? null,
      eyebrow: b.eyebrow ?? null,
      title: b.title ?? null,
      link: b.link ?? undefined,
      tone: b.tone ?? undefined,
    }
    switch (b.blockType) {
      case 'hero-slider':
        layout.push({
          ...head,
          slides: await Promise.all(
            b.slides.map(async (s) => ({
              kicker: s.kicker,
              title: s.title,
              lead: s.lead,
              primary: { label: s.primary.label, href: s.primary.href, icon: s.primary.icon },
              secondary: s.secondary,
              image: await m(s.image),
            })),
          ),
          badge: b.badge,
          strip: b.strip,
          autoplaySeconds: 0,
        })
        break
      case 'services-tiles':
        layout.push({
          ...head,
          items: await Promise.all(
            b.items.map(async (it) => {
              const slug = it.href.replace(/^\/|\/$/g, '')
              const service = services.get(slug)
              return {
                service: service ?? null,
                title: it.title,
                text: it.text,
                price: it.price,
                href: service ? null : (opts.unknownTileHref ?? it.href),
                image: await m(it.image),
              }
            }),
          ),
        })
        break
      case 'about-stats':
        layout.push({
          ...head,
          text: b.text,
          checklist: list(b.checklist),
          stats: b.stats,
          banner: b.banner,
        })
        break
      case 'equipment':
        layout.push({
          ...head,
          items: await Promise.all(
            b.items.map(async (it) => ({ ...it, image: await m(it.image) })),
          ),
        })
        break
      case 'projects':
        layout.push({
          ...head,
          items: await Promise.all(
            b.items.map(async (it) => ({
              place: it.place,
              duration: it.duration,
              title: it.title,
              sum: it.sum,
              matched: it.matched !== false,
              before: await m(it.before),
              after: await m(it.after),
              afterLabel: it.afterLabel ?? null,
            })),
          ),
        })
        break
      case 'video-gallery':
        layout.push({
          ...head,
          items: await Promise.all(
            b.items.map(async (it) => ({
              title: it.title,
              text: it.text,
              duration: it.duration,
              poster: await m(it.poster),
              url: it.url ?? null,
            })),
          ),
        })
        break
      case 'promotions':
        layout.push({ ...head, items: b.items.map((it) => ({ ...it, dark: it.dark === true })) })
        break
      case 'team':
        layout.push({
          ...head,
          items: await Promise.all(
            b.items.map(async (it) => ({
              role: it.role,
              text: it.text,
              chip: it.chip,
              photo: await m(it.photo),
            })),
          ),
        })
        break
      case 'calculator-v3':
        layout.push({
          ...head,
          lead: b.lead,
          ctaLabel: b.ctaLabel,
          note: b.note,
          services: b.services.map((s) => ({ ...s, included: list(s.included) })),
        })
        break
      case 'steps':
        layout.push({ ...head, items: b.items.map((it) => ({ ...it, text: realText(it.text) })) })
        break
      case 'price-tabs':
        layout.push({
          ...head,
          tabs: b.tabs.map((t) => ({
            label: t.label,
            icon: t.icon,
            unit: t.unit,
            columns: list(t.columns),
            rows: t.rows.map((r) => ({ name: r.name, note: r.note, values: list(r.values) })),
            notes: list(t.notes),
          })),
        })
        break
      case 'photo-cta':
        layout.push({
          ...head,
          text: realText(b.text),
          image: await m(b.image),
          primary: { label: b.primary.label, href: PHOTO_HREF, icon: 'upload' },
          secondary: { label: 'Позвонить', href: PHONE_HREF, icon: 'phone' },
        })
        break
      case 'reviews-v3':
        // Рейтинг не переносим: «4,9» в витрине — демо. Отзывы — только проверенные из раздела «Отзывы».
        layout.push({
          ...head,
          limit: 3,
          rating: { value: null, source: 'Яндекс Карты', href: null },
        })
        break
      case 'documents':
        layout.push({ ...head, items: b.items })
        break
      case 'b2b-plan':
        layout.push({
          ...head,
          text: b.text,
          kpis: b.kpis,
          primary: b.primary,
          secondary: b.secondary,
          audiences: b.audiences,
          note: b.note,
        })
        break
      case 'tree-check':
        layout.push({
          ...head,
          checklistTitle: b.checklistTitle,
          checklist: list(b.checklist),
          consult: {
            eyebrow: b.consult.eyebrow,
            title: b.consult.title,
            text: b.consult.text,
            points: list(b.consult.points),
            ctaLabel: b.consult.cta.label,
            ctaHref: realHref(b.consult.cta.href),
          },
        })
        break
      case 'articles':
        layout.push({ ...head, posts: [] }) // пусто — три последние опубликованные статьи блога
        break
      case 'objects-map':
        layout.push({
          ...head,
          legend: b.legend,
          districts: list(b.districts),
          zones: b.zones,
          points: b.points,
          base: b.base,
        })
        break
      case 'guarantees':
        layout.push({ ...head, items: b.items })
        break
      case 'faq-v3':
        layout.push({
          ...head,
          items: b.items.map((it) => ({ ...it, answer: realText(it.answer) })),
        })
        break
      case 'final-form':
        layout.push({
          ...head,
          lead: 'Или выберите удобный канал — заявки принимаем круглосуточно, менеджер на связи с 8:00 до 22:00.',
          background: await m(b.background),
          channels: [
            { icon: 'phone', title: '+7 (985) 170-51-11', text: 'Позвонить', href: PHONE_HREF },
            {
              icon: 'message',
              title: 'partner@obikhod.ru',
              text: 'Пришлите фото — посчитаем',
              href: PHOTO_HREF,
            },
          ],
          formTitle: b.formTitle,
          source: 'home-final',
        })
        break
      case 'legal-doc':
        layout.push({
          blockType: b.blockType,
          blockName: b.title,
          enabled: true,
          eyebrow: b.eyebrow ?? null,
          title: b.title,
          revision: b.revision ?? null,
          // в наполнении текст — Markdown (content/pages/legal.ts)
          body: typeof b.body === 'string' ? await markdownToLexical(payload, b.body) : b.body,
        })
        break
    }
  }
  return layout
}

let editorConfig: Awaited<ReturnType<typeof editorConfigFactory.default>> | undefined
async function markdownToLexical(payload: Payload, markdown: string) {
  editorConfig ??= await editorConfigFactory.default({ config: payload.config })
  return convertMarkdownToLexical({ editorConfig, markdown })
}

/** Payload ждёт у групп объект или отсутствие поля — null в группе роняет хуки валидации. */
const UNITS = '₽|%|м²|м³|км|см|мм|м|т|ч|мин|мес|сут|дней|дня|часа|часов|минут|лет'
const THOUSANDS = /(\d) (?=\d{3}(?!\d))/g
const BEFORE_UNIT = new RegExp(`(\\d) (?=(?:${UNITS})(?![а-яёa-z]))`, 'gi')

/** Неразрывные пробелы в числах: «14 800 ₽», «5 м³», «2 часа» не разрываются переносом строки. */
export function nbspNumbers<T>(v: T): T {
  if (typeof v === 'string')
    return v.replace(THOUSANDS, '$1\u00a0').replace(BEFORE_UNIT, '$1\u00a0') as T
  if (Array.isArray(v)) return v.map(nbspNumbers) as T
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, nbspNumbers(x)]),
    ) as T
  }
  return v
}

export function dropNulls<T>(v: T): T {
  if (Array.isArray(v)) return v.map(dropNulls) as T
  if (v && typeof v === 'object') {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>)
        .filter(([, x]) => x !== null && x !== undefined)
        .map(([k, x]) => [k, dropNulls(x)]),
    ) as T
  }
  return v
}
