/**
 * Canonical URL helpers — US-5 REQ-5.4.
 *
 * Цель: одна страница = один canonical URL без UTM/yclid/gclid/page параметров.
 * Используется в `generateMetadata()` каждого page.tsx через
 * `metadata.alternates.canonical = canonicalFor(...)`.
 *
 * Политика (sa.md US-5 §REQ-5.4):
 *   - trailingSlash: true — единая форма с trailing slash (Next 16 + конфиг)
 *   - UTM/маркетинговые параметры стрипуются на server-render
 *   - На programmatic ServiceDistricts canonical = собственный URL,
 *     не pillar (защита от каннибализации)
 *   - На /lp/* canonical = self + noindex (см. /lp/<campaign>/page.tsx)
 *   - Pagination: page=1 canonical → чистый URL без query, page>=2 canonical → self
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://obikhod.ru').replace(/\/+$/, '')

/**
 * Параметры query которые ВСЕГДА стрипуются из canonical.
 * UTM/маркетинговые — фрагменты атрибуции, не часть identity страницы.
 */
const STRIPPED_QUERY_KEYS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'yclid',
  'gclid',
  'fbclid',
  'gad_source',
  'gad_campaignid',
  'msclkid',
  '_openstat',
  'from',
])

/**
 * Нормализует path: убирает leading double-slash, гарантирует leading `/`,
 * trailing `/` (по next.config trailingSlash:true).
 */
function normalizePath(path: string): string {
  let p = path.trim()
  if (!p.startsWith('/')) p = '/' + p
  // Убираем лишние // в начале
  p = p.replace(/^\/+/, '/')
  // Гарантируем trailing slash (кроме корня)
  if (p !== '/' && !p.endsWith('/')) p += '/'
  return p
}

/**
 * Возвращает canonical URL для path. Стрипует UTM/маркетинговые параметры.
 * Сохраняет смысловые query (например, для blog filters если они нужны
 * в canonical — таких сейчас нет).
 *
 * @example
 *   canonicalFor('/vyvoz-musora/')                 → 'https://obikhod.ru/vyvoz-musora/'
 *   canonicalFor('/vyvoz-musora/?utm_source=ya')   → 'https://obikhod.ru/vyvoz-musora/'
 *   canonicalFor('/blog/?page=2')                  → 'https://obikhod.ru/blog/?page=2' (см. canonicalForListing)
 *   canonicalFor('vyvoz-musora')                   → 'https://obikhod.ru/vyvoz-musora/'
 */
export function canonicalFor(path: string): string {
  // Если передали полный URL — берём только pathname + search
  let pathname = path
  let search = ''
  try {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      const url = new URL(path)
      pathname = url.pathname
      search = url.search
    } else if (path.includes('?')) {
      const idx = path.indexOf('?')
      pathname = path.slice(0, idx)
      search = path.slice(idx)
    }
  } catch {
    // Некорректный URL — возвращаем что-то предсказуемое
    return `${SITE_URL}${normalizePath(path)}`
  }

  pathname = normalizePath(pathname)

  // Очищаем query от стрипуемых параметров
  let cleanQuery = ''
  if (search) {
    const params = new URLSearchParams(search)
    for (const key of [...params.keys()]) {
      if (STRIPPED_QUERY_KEYS.has(key.toLowerCase())) {
        params.delete(key)
      }
    }
    const remaining = params.toString()
    if (remaining) cleanQuery = '?' + remaining
  }

  return `${SITE_URL}${pathname}${cleanQuery}`
}

/**
 * Canonical для пагинируемых listings (`/blog/`, `/kejsy/`).
 *
 * Правило (sa.md REQ-5.4 + REQ-5.10):
 *   - page=1 (или нет параметра) → canonical = clean URL без `?page=`
 *   - page>=2 → canonical = self с `?page=N`
 *
 * @example
 *   canonicalForListing('/blog/', undefined) → 'https://obikhod.ru/blog/'
 *   canonicalForListing('/blog/', 1)         → 'https://obikhod.ru/blog/'
 *   canonicalForListing('/blog/', 2)         → 'https://obikhod.ru/blog/?page=2'
 */
export function canonicalForListing(basePath: string, page?: number | string): string {
  const base = canonicalFor(basePath)
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page
  if (!pageNum || pageNum <= 1 || Number.isNaN(pageNum)) return base
  // base уже без query (canonicalFor стрипает UTM, на listing других query быть не должно)
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}page=${pageNum}`
}

/**
 * Canonical override — если коллекция Payload явно задаёт canonical
 * (поле `canonicalOverride`, US-5 REQ-5.7), используем его как есть.
 * Иначе — стандартный canonicalFor.
 *
 * Используется на programmatic ServiceDistricts когда нужен canonical
 * на main pillar (для дублей) или на `/lp/*` где canonical = self.
 */
export function canonicalWithOverride(defaultPath: string, override?: string | null): string {
  if (override && typeof override === 'string' && override.trim() !== '') {
    return canonicalFor(override.trim())
  }
  return canonicalFor(defaultPath)
}
