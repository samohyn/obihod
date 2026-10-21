/**
 * Сброс кеша всего сайта после seed и скриптов данных. Они работают вне процесса Next
 * и сами кеш не сбрасывают, поэтому просят работающее приложение на этой машине:
 * POST http://127.0.0.1:$PORT/api/revalidate/ (PORT из .env; на staging 3001, иначе 3000).
 *
 * Приложение не запущено (локально без `pnpm dev`) — только предупреждение, скрипт не падает.
 */
export async function requestSiteRevalidate(label: string): Promise<boolean> {
  const secret = process.env.REVALIDATE_SECRET
  const port = process.env.PORT || '3000'
  if (!secret) {
    console.error(`[${label}] кеш сайта не сброшен: нет REVALIDATE_SECRET`)
    return false
  }
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/revalidate/`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) console.error(`[${label}] кеш сайта сброшен (порт ${port})`)
    else console.error(`[${label}] кеш сайта не сброшен: порт ${port} ответил ${res.status}`)
    return res.ok
  } catch (e) {
    console.error(
      `[${label}] кеш сайта не сброшен: приложение на порту ${port} недоступно (${e instanceof Error ? e.message : e})`,
    )
    return false
  }
}
