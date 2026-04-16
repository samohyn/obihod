import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Singleton-обёртка над getPayload для server-side компонентов.
 * Кешируется внутри одного процесса dev-сервера / serverless instance.
 */
let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function payloadClient() {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}
