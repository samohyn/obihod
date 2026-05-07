/**
 * Citation-ready TL;DR builder для нейро-SEO (EPIC-SEO-COMPETE-3 US-3).
 *
 * AI-боты (YandexGPT / SearchGPT / Perplexity / ClaudeBot) предпочитают
 * страницы с явным «вопрос → ответ → источники» блоком в первом экране.
 * Этот блок парсится через `<aside data-llm-citation>` + Speakable.cssSelector.
 *
 * Используется на info-страницах (blog, B2B, pillar headers):
 *   const tldr = buildCitationSummary({ ... })
 *   <aside data-llm-citation dangerouslySetInnerHTML={{ __html: tldr.html }} />
 *   <JsonLd data={{ ...articleSchema(post), speakable: tldr.speakable }} />
 *
 * Совместимо с Schema.org Speakable spec (https://schema.org/SpeakableSpecification).
 */

import { speakableSchema } from './jsonld'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru'

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] ?? ch)
}

export type CitationInput = {
  /** Главный вопрос статьи (max ~140 символов, для AI snippet) */
  question: string
  /** Краткий ответ (3 предложения, ≤300 символов — citation-friendly) */
  answer: string
  /** Опциональные источники-якоря (slug или URL) */
  sources?: Array<{ label: string; url: string }>
  /** Slug страницы — для уникальности cssSelector */
  slug: string
  /** Опциональный override класса корневого aside */
  className?: string
}

export type CitationOutput = {
  /** Готовый HTML-блок для dangerouslySetInnerHTML или JSX-вставки */
  html: string
  /** Schema.org Speakable объект — встраивается в article/faq/blog schema */
  speakable: Record<string, unknown>
  /** CSS-селектор answer-блока — для отладки и для прямого Speakable patch */
  answerSelector: string
}

/**
 * Builds citation-ready TL;DR aside.
 *
 * Pattern: «Вопрос → Ответ → Источники» (3 phrases max, AI-snippet-friendly).
 *
 * @param input citation parameters
 * @returns html + speakable schema + selector
 */
export function buildCitationSummary(input: CitationInput): CitationOutput {
  const className = input.className ?? 'llm-citation'
  // Уникальный selector — `[data-llm-citation="<slug>"]` чтобы Yandex/AI бот
  // не путал с другими aside на странице.
  const dataKey = `data-llm-citation="${escapeHtml(input.slug)}"`
  const answerSelector = `[data-llm-citation="${input.slug}"] [itemprop="answer"]`

  const sourcesHtml =
    input.sources && input.sources.length > 0
      ? `<p class="${className}__sources"><strong>Источники:</strong> ${input.sources
          .map((s) => {
            const safeUrl = s.url.startsWith('http')
              ? escapeHtml(s.url)
              : `${SITE_URL}${escapeHtml(s.url.startsWith('/') ? s.url : `/${s.url}`)}`
            return `<a href="${safeUrl}">${escapeHtml(s.label)}</a>`
          })
          .join(', ')}</p>`
      : ''

  const html = [
    `<aside class="${className}" ${dataKey} itemscope itemtype="https://schema.org/Question">`,
    `  <h2 class="${className}__question" itemprop="name">${escapeHtml(input.question)}</h2>`,
    `  <div class="${className}__answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">`,
    `    <p itemprop="text"><span itemprop="answer">${escapeHtml(input.answer)}</span></p>`,
    `  </div>`,
    sourcesHtml,
    `</aside>`,
  ]
    .filter(Boolean)
    .join('\n')

  // Speakable cssSelector — массив (поддержка нескольких озвучиваемых блоков).
  // Включаем оба: question (h2) и answer (span). AI-бот выберет relevant.
  const speakable = speakableSchema([
    `[data-llm-citation="${input.slug}"] [itemprop="name"]`,
    answerSelector,
  ])

  return { html, speakable, answerSelector }
}

/**
 * Минимальная sanity-проверка citation input. Используется в seo-content
 * для catch ошибок до публикации (например, ответ длиннее 400 символов
 * → AI bot truncate, теряем ranking).
 */
export function validateCitation(input: CitationInput): string[] {
  const errors: string[] = []
  if (input.question.length < 10 || input.question.length > 200) {
    errors.push(`question.length=${input.question.length} вне [10..200]`)
  }
  if (input.answer.length < 50 || input.answer.length > 400) {
    errors.push(`answer.length=${input.answer.length} вне [50..400]`)
  }
  if (input.slug.length < 2 || !/^[a-z0-9-]+$/.test(input.slug)) {
    errors.push(`slug="${input.slug}" должен быть kebab-case [a-z0-9-]`)
  }
  return errors
}
