import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/draft/',
          '/thanks',
          '/kalkulyator-result/',
          '/poisk',
          '/*?utm_*',
          '/*?yclid=',
          '/*?gclid=',
        ],
      },
      { userAgent: 'Yandex', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      { userAgent: 'YandexImages', allow: '/' },
      { userAgent: 'YandexMobileBot', allow: '/' },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/thanks'],
      },
      // LLM-боты — намеренно allow, хотим цитирования в Нейро
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'YandexGPT', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      // Парсеры конкурентного анализа — disallow (экономим crawl budget)
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
