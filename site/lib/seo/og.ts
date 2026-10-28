/**
 * Картинка превью страницы (Open Graph, image в Article) — фирменная карточка `/og/` с заголовком,
 * 1200×630 (app/og/route.tsx). SEO-аудит 28.10.2026: на 383 из 384 страниц не было og:image.
 *
 * Фото первого экрана в превью не берём: почти все они сгенерированы, а в превью мессенджеров и
 * соцсетей подписи «Иллюстрация» нет (правило проекта о фото). Своя картинка документа (`ogImage`
 * в админке) по-прежнему главнее — её подставляет вызывающий код.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const OG_SITE_NAME = 'Обиход'

/** Бренд на карточке уже есть — хвост «— Обиход» из title не повторяем. */
const stripBrand = (title: string) => title.replace(/\s*[—|-]\s*Обиход\s*$/u, '').trim()

export function ogCard(title: string, subtitle = 'Москва и Московская область') {
  const clean = stripBrand(title)
  const q = new URLSearchParams({ title: clean.slice(0, 80), subtitle: subtitle.slice(0, 100) })
  return { url: `${SITE_URL}/og/?${q}`, width: 1200, height: 630, alt: clean }
}
