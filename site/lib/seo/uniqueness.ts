/**
 * TF-IDF uniqueness scoring для programmatic ServiceDistricts (US-3 §контракт).
 *
 * Назначение: anti-thin-content gate. Считает «насколько локальный текст
 * (leadParagraph + localFaq) отличается от шаблонного ядра» по cosine
 * similarity TF-IDF векторов; возвращает 0..100 (0 = идентично шаблону,
 * 100 = ничего общего). Используется ServiceDistricts.beforeValidate hook
 * для записи `uniquenessScore`. ≥60 — gate для published (sa-seo §AC-7).
 *
 * Зависимостей нет — простая реализация на 80 строк (требование sa-seo
 * §контракт «без external lib»). Алгоритм:
 *   1. tokenize → нормализованный массив term'ов.
 *   2. TF — частота term'а в документе.
 *   3. IDF — log(N / df), где df — кол-во документов baseline, содержащих term.
 *   4. Vec[term] = TF * IDF.
 *   5. Cosine similarity = dot(local, baselineSum) / (||local|| * ||baselineSum||).
 *   6. uniqueness = round(100 * (1 - cosine)).
 *
 * Baseline corpus передаётся снаружи (в hook загружается через payload.find
 * по другим ServiceDistricts) — модуль не лезет в БД сам, чтобы оставаться
 * pure и testable.
 */

const TOKEN_RE = /[\p{L}\p{N}]+/gu
// Стоп-слова RU + EN: артикли, предлоги, союзы, частые глаголы.
// Минимальный набор, чтобы не вычеркнуть «спил», «крыша», «снег».
const STOP_WORDS = new Set([
  'и',
  'в',
  'на',
  'с',
  'по',
  'для',
  'от',
  'до',
  'из',
  'у',
  'к',
  'о',
  'об',
  'не',
  'а',
  'но',
  'или',
  'что',
  'как',
  'это',
  'тот',
  'та',
  'те',
  'мы',
  'вы',
  'он',
  'она',
  'они',
  'я',
  'ты',
  'же',
  'бы',
  'ли',
  'если',
  'при',
  'за',
  'под',
  'над',
  'между',
  'the',
  'a',
  'an',
  'and',
  'or',
  'of',
  'in',
  'on',
  'to',
  'for',
  'is',
  'are',
])

function tokenize(text: string): string[] {
  const out: string[] = []
  const matches = text.toLowerCase().matchAll(TOKEN_RE)
  for (const m of matches) {
    const t = m[0]
    if (t.length >= 2 && !STOP_WORDS.has(t)) out.push(t)
  }
  return out
}

function termFreq(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>()
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1)
  return tf
}

function inverseDocFreq(corpusTokens: string[][]): Map<string, number> {
  const N = corpusTokens.length
  const df = new Map<string, number>()
  for (const docTokens of corpusTokens) {
    const seen = new Set(docTokens)
    for (const t of seen) df.set(t, (df.get(t) ?? 0) + 1)
  }
  const idf = new Map<string, number>()
  for (const [t, n] of df) {
    // +1 в знаменателе для smoothing (term встречается во всех baseline-doc).
    idf.set(t, Math.log((N + 1) / (n + 1)) + 1)
  }
  return idf
}

function tfIdfVector(tf: Map<string, number>, idf: Map<string, number>): Map<string, number> {
  const v = new Map<string, number>()
  for (const [t, f] of tf) {
    const w = idf.get(t)
    if (w === undefined) continue
    v.set(t, f * w)
  }
  return v
}

function vectorNorm(v: Map<string, number>): number {
  let s = 0
  for (const x of v.values()) s += x * x
  return Math.sqrt(s)
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  const na = vectorNorm(a)
  const nb = vectorNorm(b)
  if (na === 0 || nb === 0) return 0
  let dot = 0
  // Идём по меньшему вектору для перформанса.
  const [small, big] = a.size <= b.size ? [a, b] : [b, a]
  for (const [t, va] of small) {
    const vb = big.get(t)
    if (vb !== undefined) dot += va * vb
  }
  return dot / (na * nb)
}

/**
 * Считает uniqueness score локального текста против baseline корпуса.
 *
 * @param text — leadParagraph + localFaq + landmarks (склеенный обычный текст).
 * @param baseline — массив текстов из других programmatic SD (template ядро).
 * @returns 0..100 — выше = уникальнее. 0 если text пустой или baseline пустой.
 */
export function tfIdfUniqueness(text: string, baseline: string[]): number {
  if (!text || !text.trim()) return 0
  if (baseline.length === 0) return 100 // нет baseline — текст уникален «по определению»

  const localTokens = tokenize(text)
  if (localTokens.length === 0) return 0

  const baselineTokens = baseline.map((b) => tokenize(b)).filter((arr) => arr.length > 0)
  if (baselineTokens.length === 0) return 100

  // IDF считаем по корпусу = baseline + сам локальный документ
  // (стандартный TF-IDF: документ-под-оценкой включается в корпус).
  const idf = inverseDocFreq([...baselineTokens, localTokens])

  const localVec = tfIdfVector(termFreq(localTokens), idf)

  // Aggregated baseline vector — сумма TF-IDF всех baseline документов.
  const aggBaselineTf = new Map<string, number>()
  for (const docTokens of baselineTokens) {
    const tf = termFreq(docTokens)
    for (const [t, f] of tf) aggBaselineTf.set(t, (aggBaselineTf.get(t) ?? 0) + f)
  }
  const baselineVec = tfIdfVector(aggBaselineTf, idf)

  const sim = cosine(localVec, baselineVec)
  const score = Math.round(100 * (1 - sim))
  // Clamp на [0, 100] — численная защита от cosine > 1 при FP-погрешностях.
  return Math.max(0, Math.min(100, score))
}

/**
 * Извлекает плоский текст из Lexical richText (root.children).
 * Используется в hook'ах — leadParagraph хранится как jsonb Lexical state.
 */
export function lexicalToPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const obj = node as { text?: string; children?: unknown[] }
  if (typeof obj.text === 'string') return obj.text
  if (!Array.isArray(obj.children)) return ''
  return obj.children.map(lexicalToPlainText).filter(Boolean).join(' ')
}
