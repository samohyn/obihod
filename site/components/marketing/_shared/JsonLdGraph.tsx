import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageSchema } from '@/lib/seo/jsonld'

/**
 * JSON-LD главной сверх layout: только FAQPage — из тех же вопросов, что рендерит секция FAQ
 * (разметка обязана совпадать с видимым текстом).
 *
 * Organization / WebSite рендерит (marketing)/layout.tsx из SiteChrome — здесь их
 * больше нет: раньше был хардкод с фейковым телефоном, адресом в Раменском и рейтингом
 * 4.87/201 (план 09, этап 1 — быстрые SEO-фиксы).
 */
export function JsonLdGraph({ faq }: { faq: { question: string; answer: string }[] }) {
  if (faq.length === 0) return null
  return <JsonLd schema={[{ '@id': 'https://obikhod.ru/#faq', ...faqPageSchema(faq) }]} />
}
