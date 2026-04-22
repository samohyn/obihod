import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ keyfile: string }> }) {
  const { keyfile } = await params
  const key = process.env.INDEXNOW_KEY

  if (!key || keyfile !== `${key}.txt`) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return new NextResponse(key, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  })
}
