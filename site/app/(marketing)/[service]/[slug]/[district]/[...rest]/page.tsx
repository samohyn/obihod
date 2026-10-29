import { notFound } from 'next/navigation'

import { NOT_FOUND_METADATA } from '@/lib/seo/metadata'

/**
 * Адреса глубже трёх уровней (/a/b/c/d/) ни одному маршруту не соответствуют, и Next отдавал свою
 * английскую заглушку без шапки. Этот маршрут ловит их и показывает нашу 404 (app/(marketing)/not-found.tsx).
 */
export const metadata = NOT_FOUND_METADATA

export default function DeepNotFound(): never {
  notFound()
}
