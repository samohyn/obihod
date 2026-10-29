import type { Metadata } from 'next'

import { NOT_FOUND_METADATA } from '@/lib/seo/metadata'

import MarketingLayout, { generateMetadata as marketingMetadata } from './(marketing)/layout'
import NotFound from './(marketing)/not-found'

/**
 * 404 для адресов, которые Next перехватывает до маршрутов (/404/, /500/, /_not-found/, /_error/),
 * и любых без маршрута: та же страница, что app/(marketing)/not-found.tsx, в шапке и подвале сайта.
 * Включается experimental.globalNotFound (next.config.ts).
 */
export async function generateMetadata(): Promise<Metadata> {
  return { ...(await marketingMetadata()), ...NOT_FOUND_METADATA }
}

export default function GlobalNotFound() {
  return (
    <MarketingLayout>
      <NotFound />
    </MarketingLayout>
  )
}
