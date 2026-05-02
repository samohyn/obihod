/**
 * Текстовые утилиты для SEO meta-полей (Wave 0.4 mini-fix Track C).
 *
 * `String.prototype.slice` режет по UTF-16 code units и ломает surrogate pairs
 * (emoji, редкие символы). Для meta-description берём срез по Unicode
 * codepoints через `Array.from`, плюс мягкий trim по последнему пробелу,
 * чтобы не оставить полслова.
 */

/**
 * Безопасно обрезает строку до `maxLen` codepoints. Если фактический срез
 * пришёлся на середину слова — отступает к ближайшему предыдущему пробелу
 * (но не дальше 80% длины), чтобы не выводить «…ремон». Trailing whitespace
 * подрезается. Если строка короче лимита — возвращается as-is.
 */
export function truncateMeta(input: string | null | undefined, maxLen: number): string {
  if (!input) return ''
  const codepoints = Array.from(input)
  if (codepoints.length <= maxLen) return input
  const sliced = codepoints.slice(0, maxLen).join('')
  const lastSpace = sliced.lastIndexOf(' ')
  const minKeep = Math.floor(maxLen * 0.8)
  const cut = lastSpace >= minKeep ? sliced.slice(0, lastSpace) : sliced
  return cut.replace(/\s+$/u, '')
}
