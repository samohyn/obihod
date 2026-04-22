const INDEXNOW_ENDPOINT = 'https://yandex.com/indexnow'

type PushResult =
  | { ok: true; status: number; submitted: number }
  | { ok: false; status: number; error: string }

export async function pushToIndexNow(urls: string[]): Promise<PushResult> {
  const key = process.env.INDEXNOW_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!key || key.length < 8) {
    return { ok: false, status: 0, error: 'INDEXNOW_KEY not configured' }
  }
  if (!siteUrl) {
    return { ok: false, status: 0, error: 'NEXT_PUBLIC_SITE_URL not configured' }
  }
  if (urls.length === 0) {
    return { ok: true, status: 204, submitted: 0 }
  }

  const origin = new URL(siteUrl).origin
  const host = new URL(origin).host
  const keyLocation = `${origin}/indexnow/${key}.txt`
  const urlList = urls.map((u) =>
    u.startsWith('http') ? u : `${origin}${u.startsWith('/') ? u : `/${u}`}`,
  )

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { ok: false, status: res.status, error: body || res.statusText }
    }
    return { ok: true, status: res.status, submitted: urlList.length }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown'
    return { ok: false, status: 0, error: message }
  }
}
