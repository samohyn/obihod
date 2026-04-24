import { NextResponse, type NextRequest } from 'next/server'
import { draftMode } from 'next/headers'

/**
 * GET /api/exit-preview?redirect=/admin/...
 *
 * Выключает draftMode и редиректит обратно в админку (или на /).
 * Sa-spec §6.
 */
export async function GET(req: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const target = req.nextUrl.searchParams.get('redirect') ?? '/admin'
  // защита от open-redirect — принимаем только относительные пути
  const safe = target.startsWith('/') && !target.startsWith('//') ? target : '/admin'

  return NextResponse.redirect(new URL(safe, req.nextUrl.origin), 307)
}
