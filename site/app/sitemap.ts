import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Минимальный sitemap на старте M1.
  // По мере появления posts/pillar/programmatic — будем подтягивать из Payload
  // через getPayload() и расширять. Splitting на sitemap-index — при >5000 URL.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/o-kompanii/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/litsenzii/`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/kontakty/`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
