import { NextResponse, type NextRequest } from 'next/server'

import { generateByUseCase, type UseCase } from '@/lib/fal/generators'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const USE_CASES: UseCase[] = ['hero', 'og', 'case-viz', 'blog-cover']

// POST /api/fal/generate
// Headers: x-revalidate-secret: <secret>   (переиспользуем secret — server-only gate)
// Body:    { useCase: "hero" | "og" | "case-viz" | "blog-cover", params: {...} }
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { useCase?: string; params?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { useCase, params } = body
  if (!useCase || !USE_CASES.includes(useCase as UseCase)) {
    return NextResponse.json(
      { error: `useCase must be one of: ${USE_CASES.join(', ')}` },
      { status: 400 },
    )
  }
  if (!params || typeof params !== 'object') {
    return NextResponse.json({ error: 'params is required (object)' }, { status: 400 })
  }

  try {
    const result = await generateByUseCase(useCase as UseCase, params)
    return NextResponse.json({ ok: true, useCase, result })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
