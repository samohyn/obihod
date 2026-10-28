/**
 * /robots.txt — сайт открыт для всех роботов (план 09, этап 8: команда владельца 28.10.2026
 * «открой к индексации сайт полностью для всех»). Закрыты только служебные адреса.
 *
 * - Поиск и AI-поиск: YandexBot и прочие роботы Яндекса (YandexAdditional — ответы Алисы и
 *   Нейро — не запрещаем), OAI-SearchBot / ChatGPT-User, PerplexityBot, Claude-SearchBot /
 *   Claude-User, Googlebot, Bingbot.
 * - Боты для обучения моделей (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) и
 *   SEO-парсеры больше не закрыты — «для всех» (до 28.10 были под Disallow).
 * - UTM и метки рекламы — Clean-param для Яндекса вместо запрета: страница с метками та же.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

const PRIVATE = ['/api/', '/admin/', '/draft/', '/dev/', '/poisk']

const SEARCH_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Claude-SearchBot',
  'Claude-User',
  'Googlebot',
  'Bingbot',
]

const CLEAN_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'gclid',
  'ysclid',
]

const group = (agents: string[], lines: string[]) =>
  [...agents.map((a) => `User-agent: ${a}`), ...lines].join('\n')

function robotsTxt(siteUrl = SITE_URL): string {
  const privateRules = PRIVATE.map((p) => `Disallow: ${p}`)
  return [
    group(['*'], ['Allow: /', ...privateRules]),
    group(['Yandex'], ['Allow: /', ...privateRules, `Clean-param: ${CLEAN_PARAMS.join('&')}`]),
    group(SEARCH_BOTS, ['Allow: /', ...privateRules]),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n\n')
}

export const dynamic = 'force-static'

export function GET() {
  return new Response(robotsTxt(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
