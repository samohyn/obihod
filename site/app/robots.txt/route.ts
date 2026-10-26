/**
 * /robots.txt — правила на время ПОСЛЕ запуска (план 09, этап 7; сверено с Perplexity 26.10.2026).
 *
 * Пока индексация закрыта, этот ответ до посетителя не доходит: nginx сам отдаёт
 * `Disallow: /` и `X-Robots-Tag: noindex` (deploy/README.md). Открывает индексацию только
 * владелец отдельной командой (этап 8).
 *
 * - Поиск и AI-поиск открыты: YandexBot и прочие роботы Яндекса (YandexAdditional — ответы
 *   Алисы и Нейро — не запрещаем), OAI-SearchBot / ChatGPT-User, PerplexityBot,
 *   Claude-SearchBot / Claude-User, Googlebot, Bingbot.
 * - Боты для обучения моделей закрыты, пока владелец не решит иначе (журнал плана 09, 22.10):
 *   GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot. На поиск это не влияет.
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

const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']

const SEO_PARSERS = ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot']

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
    group(TRAINING_BOTS, ['Disallow: /']),
    group(SEO_PARSERS, ['Disallow: /']),
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
